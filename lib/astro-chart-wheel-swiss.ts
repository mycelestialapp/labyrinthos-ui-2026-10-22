import SwissEPH from "sweph-wasm";
import type { HouseSystemId } from "@/lib/astro-dossier-storage";
import { zodiacKeyFromLongitude } from "@/lib/natal-chart";
import type { NatalBig3 } from "@/lib/natal-chart";
import type {
  AstroAspectDatum,
  AstroChartWheelData,
  AstroPlanetDatum,
  AspectType,
  PlanetId,
} from "@/lib/astro-chart-wheel";

/** Swiss `swe_houses` 在本项目中实际用到的字段（其余字段忽略）。 */
type SweHousesResult = {
  cusps: ArrayLike<number>;
  ascmc: ArrayLike<number>;
};

type SweHouseSystemCode = "P" | "W";

function readSweHouses(raw: unknown): SweHousesResult {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Swiss Ephemeris：宫位计算返回异常（非对象）。");
  }
  const o = raw as { cusps?: unknown; ascmc?: unknown };
  if (!o.cusps || !o.ascmc) {
    throw new Error("Swiss Ephemeris：宫位计算返回异常（缺少 cusps/ascmc）。");
  }
  return { cusps: o.cusps as ArrayLike<number>, ascmc: o.ascmc as ArrayLike<number> };
}

/** Swiss 常见为 cusps[1..12]；部分绑定也可能是连续的 12 个元素。 */
function twelveHouseCuspsFromSwe(cusps: ArrayLike<number>): number[] {
  const len = cusps.length;
  if (len >= 13) {
    return Array.from({ length: 12 }, (_, i) => normalizeDeg(Number(cusps[i + 1] ?? 0)));
  }
  return Array.from({ length: 12 }, (_, i) => normalizeDeg(Number(cusps[i] ?? 0)));
}

const PLANET_META: Record<
  PlanetId,
  { labelZh: string; color: string; ipl: number }
> = {
  sun: { labelZh: "太阳", color: "#D4A017", ipl: 0 },
  moon: { labelZh: "月亮", color: "#7EC8D4", ipl: 1 },
  mercury: { labelZh: "水星", color: "#B8A6E6", ipl: 2 },
  venus: { labelZh: "金星", color: "#C5A059", ipl: 3 },
  mars: { labelZh: "火星", color: "#D65A52", ipl: 4 },
  jupiter: { labelZh: "木星", color: "#4EB89A", ipl: 5 },
  saturn: { labelZh: "土星", color: "#9C8D6B", ipl: 6 },
  uranus: { labelZh: "天王星", color: "#6BBBD7", ipl: 7 },
  neptune: { labelZh: "海王星", color: "#5A7DFF", ipl: 8 },
  pluto: { labelZh: "冥王星", color: "#9A8060", ipl: 9 },
};

function normalizeDeg(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

function normalizeSigned180(deg: number): number {
  const d = normalizeDeg(deg);
  return d > 180 ? d - 360 : d;
}

function angleSepDeg(a: number, b: number): number {
  const na = normalizeDeg(a);
  const nb = normalizeDeg(b);
  let d = Math.abs(na - nb);
  if (d > 180) d = 360 - d;
  return d;
}

function minimize1D(lo: number, hi: number, err: (x: number) => number, iterations: number): number {
  let a = lo;
  let b = hi;
  for (let i = 0; i < iterations; i++) {
    const m1 = a + (b - a) * (1 / 3);
    const m2 = a + (b - a) * (2 / 3);
    if (err(m1) < err(m2)) b = m2;
    else a = m1;
  }
  return (a + b) / 2;
}

function toJulDayUT(swe: SwissEPH, d: Date): number {
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();

  const hour =
    d.getUTCHours() +
    d.getUTCMinutes() / 60 +
    (d.getUTCSeconds() + d.getUTCMilliseconds() / 1000) / 3600;

  return swe.swe_julday(year, month, day, hour, swe.SE_GREG_CAL);
}

function computeMajorAspects(planets: AstroPlanetDatum[], orbLimitDeg = 6): AstroAspectDatum[] {
  const aspects: AstroAspectDatum[] = [];
  const map: { type: AspectType; exactDeg: number }[] = [
    { type: "conjunction", exactDeg: 0 },
    { type: "sextile", exactDeg: 60 },
    { type: "square", exactDeg: 90 },
    { type: "trine", exactDeg: 120 },
    { type: "opposition", exactDeg: 180 },
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i]!;
      const b = planets[j]!;
      const rawDiff = normalizeSigned180(b.lonDeg - a.lonDeg); // [-180,180)
      const angle = Math.abs(rawDiff); // 0..180
      for (const asp of map) {
        const orb = Math.abs(angle - asp.exactDeg);
        if (orb <= orbLimitDeg) {
          aspects.push({
            a: a.id,
            b: b.id,
            type: asp.type,
            angleDeg: angle,
            exactDeg: asp.exactDeg,
            orbDeg: orb,
          });
        }
      }
    }
  }

  aspects.sort((x, y) => x.orbDeg - y.orbDeg);

  // Avoid over-clutter: show best N aspects (same cap as astrology-engine impl)
  const cap = 28;
  return aspects.slice(0, cap);
}

let sweInitPromise: Promise<SwissEPH> | null = null;
async function getSweInstance(): Promise<SwissEPH> {
  if (sweInitPromise) return sweInitPromise;
  sweInitPromise = (async () => {
    const swe = await SwissEPH.init();

    // Ensure the downloaded Swiss Ephemeris data is used (not remote CDN).
    // In Next.js, client components can reference the public path directly.
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const epheUrl = `${origin}/swiss-ephe/`;
      await swe.swe_set_ephe_path(epheUrl, ["sepl_18.se1", "semo_18.se1"]);
    } else {
      // Fallback: let the library decide (may hit CDN).
      await swe.swe_set_ephe_path();
    }

    return swe;
  })();
  return sweInitPromise;
}

export async function computePlanetsLongitudesSwiss(instantUtc: Date): Promise<AstroPlanetDatum[]> {
  const swe = await getSweInstance();
  const jdUt = toJulDayUT(swe, instantUtc);

  // Use Swiss Ephemeris, tropical (default), geocentric apparent positions.
  const iflag = swe.SEFLG_SWIEPH;

  const planets: AstroPlanetDatum[] = [];
  for (const id of Object.keys(PLANET_META) as PlanetId[]) {
    const meta = PLANET_META[id]!;
    const r = swe.swe_calc_ut(jdUt, meta.ipl, iflag);
    const lonDeg = normalizeDeg(r[0] as number);
    const zodiac = zodiacKeyFromLongitude(lonDeg);
    planets.push({
      id,
      labelZh: meta.labelZh,
      color: meta.color,
      lonDeg,
      zodiac,
    });
  }

  // Stable order for UI and aspects: match astro-chart-wheel.ts order.
  const order: PlanetId[] = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
  planets.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  return planets;
}

export async function computeAstroChartWheelDataSwiss(input: {
  instantUtc: Date;
  latitudeDeg: number;
  longitudeDeg: number;
  houseSystem: HouseSystemId;
}): Promise<AstroChartWheelData> {
  const swe = await getSweInstance();
  const jdUt = toJulDayUT(swe, input.instantUtc);

  const planets = await computePlanetsLongitudesSwiss(input.instantUtc);
  const aspects = computeMajorAspects(planets, 6);

  const hsys: SweHouseSystemCode = input.houseSystem === "Placidus" ? "P" : "W";
  const housesRaw = swe.swe_houses(jdUt, input.latitudeDeg, input.longitudeDeg, hsys);
  const houses = readSweHouses(housesRaw);

  const ascLonDeg = normalizeDeg(Number(houses.ascmc[0]));
  const mcLonDeg = normalizeDeg(Number(houses.ascmc[1]));
  const cuspsLon = twelveHouseCuspsFromSwe(houses.cusps);

  return {
    instantUtc: input.instantUtc,
    latitudeDeg: input.latitudeDeg,
    longitudeDeg: input.longitudeDeg,
    houseSystem: input.houseSystem,
    ephemerisSource: "swiss-ephemeris",
    ascLonDeg,
    mcLonDeg,
    planets,
    aspects,
    houseCuspsLonDeg: cuspsLon,
  };
}

/**
 * Swiss 版三主星（太阳/月亮/上升），用于让读一读文案与主流口径一致。
 * 上升点在不同 house system 下的“天文意义”一致，这里直接用 swe_houses 结果的 ascendant。
 */
export async function computeNatalBig3Swiss(instantUtc: Date, latDeg: number, lonDeg: number): Promise<NatalBig3> {
  const swe = await getSweInstance();
  const jdUt = toJulDayUT(swe, instantUtc);

  const iflag = swe.SEFLG_SWIEPH;

  const sunRes = swe.swe_calc_ut(jdUt, swe.SE_SUN, iflag);
  const moonRes = swe.swe_calc_ut(jdUt, swe.SE_MOON, iflag);

  // Ascendant longitude from houses calculation (Placidus flag 'P' as a conventional default).
  const houses = readSweHouses(swe.swe_houses(jdUt, latDeg, lonDeg, "P" satisfies SweHouseSystemCode));
  const ascLonDeg = normalizeDeg(Number(houses.ascmc[0]));

  const sunLonDeg = normalizeDeg(sunRes[0] as number);
  const moonLonDeg = normalizeDeg(moonRes[0] as number);

  return {
    sun: zodiacKeyFromLongitude(sunLonDeg),
    moon: zodiacKeyFromLongitude(moonLonDeg),
    rising: zodiacKeyFromLongitude(ascLonDeg),
  };
}

/**
 * 太阳回归：在 Swiss 口径下，用 1D 最小化对行星黄经匹配点做局部精修。
 * 这里用 astro-engine 的 guess 作为中心，窗口与原实现一致（-18h ~ +18h）。
 */
export async function refineSolarReturnInstantSwiss(params: { guessUtc: Date; natalSunLonDeg: number }): Promise<Date> {
  const swe = await getSweInstance();
  const target = normalizeDeg(params.natalSunLonDeg);

  const sunLonAt = (tms: number) => {
    const jdUt = toJulDayUT(swe, new Date(tms));
    const r = swe.swe_calc_ut(jdUt, swe.SE_SUN, swe.SEFLG_SWIEPH);
    return normalizeDeg(r[0] as number);
  };

  const guess = params.guessUtc.getTime();
  const err = (tms: number) => angleSepDeg(sunLonAt(tms), target);
  const refined = minimize1D(guess - 18 * 3600000, guess + 18 * 3600000, err, 56);
  return new Date(refined);
}

/**
 * 月返盘：在 Swiss 口径下，用 1D 最小化对月亮黄经匹配点做局部精修。
 * 这里用 astro-engine 的 guess 作为中心，窗口与原实现一致（-6h ~ +6h）。
 */
export async function refineLunarReturnInstantSwiss(params: { guessUtc: Date; natalMoonLonDeg: number }): Promise<Date> {
  const swe = await getSweInstance();
  const target = normalizeDeg(params.natalMoonLonDeg);

  const moonLonAt = (tms: number) => {
    const jdUt = toJulDayUT(swe, new Date(tms));
    const r = swe.swe_calc_ut(jdUt, swe.SE_MOON, swe.SEFLG_SWIEPH);
    return normalizeDeg(r[0] as number);
  };

  const guess = params.guessUtc.getTime();
  const err = (tms: number) => angleSepDeg(moonLonAt(tms), target);
  const refined = minimize1D(guess - 6 * 3600000, guess + 6 * 3600000, err, 52);
  return new Date(refined);
}

