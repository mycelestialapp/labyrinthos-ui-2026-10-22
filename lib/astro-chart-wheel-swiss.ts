import SwissEPH from "sweph-wasm";
import type { HouseSystemId } from "@/lib/astro-dossier-storage";
import type { ChartAspectComputationParams } from "@/lib/astro-aspect-params";
import { houseSystemToSwissHsys } from "@/lib/astro-house-systems";
import {
  buildWheelAngleAspectSlices,
  buildWheelPairAspectSlices,
  houseNumberForLongitude,
  PLANET_NAME_ZH,
  type AstroChartWheelData,
  type AstroPlanetDatum,
  type PlanetId,
} from "@/lib/astro-chart-wheel";
import type { NatalBig3 } from "@/lib/natal-chart";
import { zodiacKeyFromLongitude } from "@/lib/natal-chart";

/** 解析 Swiss `swe_houses` 返回的 cusps / ascmc */
type SweHousesResult = {
  cusps: ArrayLike<number>;
  ascmc: ArrayLike<number>;
};

function readSweHouses(raw: unknown): SweHousesResult {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Swiss Ephemeris：swe_houses 返回非对象");
  }
  const o = raw as { cusps?: unknown; ascmc?: unknown };
  if (!o.cusps || !o.ascmc) {
    throw new Error("Swiss Ephemeris：swe_houses 缺少 cusps 或 ascmc");
  }
  return { cusps: o.cusps as ArrayLike<number>, ascmc: o.ascmc as ArrayLike<number> };
}

/** 瑞士盘 cusps：兼容 1..12 与 0..11 两种下标惯例 */
function twelveHouseCuspsFromSwe(cusps: ArrayLike<number>): number[] {
  const len = cusps.length;
  if (len >= 13) {
    return Array.from({ length: 12 }, (_, i) => normalizeDeg(Number(cusps[i + 1] ?? 0)));
  }
  return Array.from({ length: 12 }, (_, i) => normalizeDeg(Number(cusps[i] ?? 0)));
}

type PlanetMetaSwiss =
  | { kind: "body"; labelZh: string; color: string; ipl: number }
  | { kind: "south_node"; labelZh: string; color: string };

const PLANET_ORDER: PlanetId[] = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "north_node",
  "south_node",
  "chiron",
];

const PLANET_META_SWISS: Record<PlanetId, PlanetMetaSwiss> = {
  sun: { kind: "body", labelZh: PLANET_NAME_ZH.sun, color: "#D4A017", ipl: 0 },
  moon: { kind: "body", labelZh: PLANET_NAME_ZH.moon, color: "#7EC8D4", ipl: 1 },
  mercury: { kind: "body", labelZh: PLANET_NAME_ZH.mercury, color: "#B8A6E6", ipl: 2 },
  venus: { kind: "body", labelZh: PLANET_NAME_ZH.venus, color: "#C5A059", ipl: 3 },
  mars: { kind: "body", labelZh: PLANET_NAME_ZH.mars, color: "#D65A52", ipl: 4 },
  jupiter: { kind: "body", labelZh: PLANET_NAME_ZH.jupiter, color: "#4EB89A", ipl: 5 },
  saturn: { kind: "body", labelZh: PLANET_NAME_ZH.saturn, color: "#9C8D6B", ipl: 6 },
  uranus: { kind: "body", labelZh: PLANET_NAME_ZH.uranus, color: "#6BBBD7", ipl: 7 },
  neptune: { kind: "body", labelZh: PLANET_NAME_ZH.neptune, color: "#5A7DFF", ipl: 8 },
  pluto: { kind: "body", labelZh: PLANET_NAME_ZH.pluto, color: "#9A8060", ipl: 9 },
  north_node: { kind: "body", labelZh: PLANET_NAME_ZH.north_node, color: "#A89FBD", ipl: 11 },
  south_node: { kind: "south_node", labelZh: PLANET_NAME_ZH.south_node, color: "#8B8AA8" },
  chiron: { kind: "body", labelZh: PLANET_NAME_ZH.chiron, color: "#C9A4A8", ipl: 15 },
};

function normalizeDeg(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
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

let sweInitPromise: Promise<SwissEPH> | null = null;

async function getSweInstance(): Promise<SwissEPH> {
  if (sweInitPromise) return sweInitPromise;
  sweInitPromise = (async () => {
    const swe = await SwissEPH.init();

    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const epheUrl = `${origin}/swiss-ephe/`;
      // seas_18：凯龙等小行星；缺此文件时 swe_calc_ut(15) 会失败并触发读数区通用报错
      await swe.swe_set_ephe_path(epheUrl, ["sepl_18.se1", "semo_18.se1", "seas_18.se1"]);
    } else {
      await swe.swe_set_ephe_path();
    }

    return swe;
  })();
  return sweInitPromise;
}

/** 丢弃 WASM 单例，便于「重新计算」后重新 init */
export function resetSwissEphemerisClientForRetry(): void {
  sweInitPromise = null;
}

export async function computePlanetsLongitudesSwiss(instantUtc: Date): Promise<AstroPlanetDatum[]> {
  const swe = await getSweInstance();
  const jdUt = toJulDayUT(swe, instantUtc);
  const iflag = swe.SEFLG_SWIEPH | swe.SEFLG_SPEED;

  const planets: AstroPlanetDatum[] = [];
  let northLonDeg = 0;
  let northNodeSpd = 0;

  for (const id of PLANET_ORDER) {
    const meta = PLANET_META_SWISS[id]!;
    if (meta.kind === "south_node") {
      const lonDeg = normalizeDeg(northLonDeg + 180);
      planets.push({
        id,
        labelZh: meta.labelZh,
        color: meta.color,
        lonDeg,
        zodiac: zodiacKeyFromLongitude(lonDeg),
        retrograde: northNodeSpd < 0,
      });
      continue;
    }

    const r = swe.swe_calc_ut(jdUt, meta.ipl, iflag);
    const lonDeg = normalizeDeg(r[0] as number);
    const spd = r[3] as number;
    if (id === "north_node") {
      northLonDeg = lonDeg;
      northNodeSpd = spd;
    }
    planets.push({
      id,
      labelZh: meta.labelZh,
      color: meta.color,
      lonDeg,
      zodiac: zodiacKeyFromLongitude(lonDeg),
      retrograde: spd < 0,
    });
  }

  return planets;
}

export async function computeAstroChartWheelDataSwiss(input: {
  instantUtc: Date;
  latitudeDeg: number;
  longitudeDeg: number;
  houseSystem: HouseSystemId;
  aspect: ChartAspectComputationParams;
}): Promise<AstroChartWheelData> {
  const swe = await getSweInstance();
  const jdUt = toJulDayUT(swe, input.instantUtc);

  const planets = await computePlanetsLongitudesSwiss(input.instantUtc);
  const pair = buildWheelPairAspectSlices(
    planets,
    input.aspect.majorOrbDeg,
    input.aspect.minorOrbDeg,
    input.aspect.includeMinorAspects,
  );

  const hsys = houseSystemToSwissHsys(input.houseSystem);
  const housesRaw = swe.swe_houses(jdUt, input.latitudeDeg, input.longitudeDeg, hsys);
  const houses = readSweHouses(housesRaw);

  const ascLonDeg = normalizeDeg(Number(houses.ascmc[0]));
  const mcLonDeg = normalizeDeg(Number(houses.ascmc[1]));
  const cuspsLon = twelveHouseCuspsFromSwe(houses.cusps);

  const ang = buildWheelAngleAspectSlices(
    planets,
    ascLonDeg,
    mcLonDeg,
    input.aspect.majorOrbDeg,
    input.aspect.minorOrbDeg,
    input.aspect.includeMinorAspects,
  );

  return {
    instantUtc: input.instantUtc,
    latitudeDeg: input.latitudeDeg,
    longitudeDeg: input.longitudeDeg,
    houseSystem: input.houseSystem,
    ephemerisSource: "swiss-ephemeris",
    ascLonDeg,
    mcLonDeg,
    planets,
    aspects: pair.major,
    minorAspects: pair.minor.length > 0 ? pair.minor : undefined,
    houseCuspsLonDeg: cuspsLon,
    angleAspectsMajor: ang.major.length > 0 ? ang.major : undefined,
    angleAspectsMinor: ang.minor.length > 0 ? ang.minor : undefined,
    aspectMeta: {
      includeMinorAspects: input.aspect.includeMinorAspects,
      majorOrbDeg: input.aspect.majorOrbDeg,
      minorOrbDeg: input.aspect.minorOrbDeg,
    },
  };
}

export type NatalBig3WithHouses = NatalBig3 & { sunHouse: number; moonHouse: number };

/** 太阳/月亮星座 + 上升星座，以及日、月所在宫位（Swiss swe_houses） */
export async function computeNatalBig3WithHousesSwiss(
  instantUtc: Date,
  latDeg: number,
  lonDeg: number,
  houseSystem: HouseSystemId = "Placidus",
): Promise<NatalBig3WithHouses> {
  const swe = await getSweInstance();
  const jdUt = toJulDayUT(swe, instantUtc);
  const iflag = swe.SEFLG_SWIEPH;

  const sunRes = swe.swe_calc_ut(jdUt, swe.SE_SUN, iflag);
  const moonRes = swe.swe_calc_ut(jdUt, swe.SE_MOON, iflag);

  const hsys = houseSystemToSwissHsys(houseSystem);
  const houses = readSweHouses(swe.swe_houses(jdUt, latDeg, lonDeg, hsys));
  const ascLonDeg = normalizeDeg(Number(houses.ascmc[0]));
  const cusps = twelveHouseCuspsFromSwe(houses.cusps);

  const sunLonDeg = normalizeDeg(sunRes[0] as number);
  const moonLonDeg = normalizeDeg(moonRes[0] as number);

  return {
    sun: zodiacKeyFromLongitude(sunLonDeg),
    moon: zodiacKeyFromLongitude(moonLonDeg),
    rising: zodiacKeyFromLongitude(ascLonDeg),
    sunHouse: houseNumberForLongitude(sunLonDeg, cusps),
    moonHouse: houseNumberForLongitude(moonLonDeg, cusps),
  };
}

/** 三主星（日/月/上升），宫位制固定 Placidus，与 swe_houses 一致 */
export async function computeNatalBig3Swiss(instantUtc: Date, latDeg: number, lonDeg: number): Promise<NatalBig3> {
  const big3h = await computeNatalBig3WithHousesSwiss(instantUtc, latDeg, lonDeg, "Placidus");
  return { sun: big3h.sun, moon: big3h.moon, rising: big3h.rising };
}

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
