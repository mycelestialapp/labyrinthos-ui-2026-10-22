import * as Astronomy from "astronomy-engine";
import type { HouseSystemId } from "@/lib/astro-dossier-storage";
import { zodiacKeyFromLongitude, ZODIAC_KEYS, ZODIAC_CN, type ZodiacKey } from "@/lib/natal-chart";

export type PlanetId =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

export type AstroPlanetDatum = {
  id: PlanetId;
  labelZh: string;
  color: string;
  lonDeg: number;
  zodiac: ZodiacKey;
};

export type AspectType = "conjunction" | "sextile" | "square" | "trine" | "opposition";

export type AstroAspectDatum = {
  a: PlanetId;
  b: PlanetId;
  type: AspectType;
  angleDeg: number; // actual minimal angle in degrees (0..180)
  exactDeg: number; // 0/60/90/120/180
  orbDeg: number; // abs(angleDeg - exactDeg)
};

export type AstroTransitNatalAspectDatum = {
  transit: PlanetId;
  natal: PlanetId;
  type: AspectType;
  angleDeg: number;
  exactDeg: number;
  orbDeg: number;
};

export type AstroChartWheelData = {
  instantUtc: Date;
  latitudeDeg: number;
  longitudeDeg: number;
  houseSystem: HouseSystemId;
  /**
   * 结果来自哪个星历引擎（用于数据面板的口径提示）。
   * - 目前：`astro-chart-kinds`（astronomy-engine）与 `astro-chart-wheel-swiss`（Swiss Ephemeris WASM）
   */
  ephemerisSource?: "astronomy-engine" | "swiss-ephemeris";

  // 轴线（由本地地平东/本地子午线交点决定）
  ascLonDeg: number;
  mcLonDeg: number;

  planets: AstroPlanetDatum[]; // 不包含 ASC/DSC（它们是地平轴，不是行星）
  aspects: AstroAspectDatum[];
  houseCuspsLonDeg: number[]; // 1..12 对应下标 0..11，范围 0..360
  /** 行运盘：行运行星与本命行星的主相位（容许度与盘内一致） */
  transitNatalAspects?: AstroTransitNatalAspectDatum[];
  /** 当前盘面类型说明（供读数区展示） */
  chartKindMeta?: { id: string; lineZh: string };
};

/** 占星常用符号（依赖系统字体中的 Unicode 字形） */
export const PLANET_GLYPH: Record<PlanetId, string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
};

export const PLANET_NAME_ZH: Record<PlanetId, string> = {
  sun: "太阳",
  moon: "月亮",
  mercury: "水星",
  venus: "金星",
  mars: "火星",
  jupiter: "木星",
  saturn: "土星",
  uranus: "天王星",
  neptune: "海王星",
  pluto: "冥王星",
};

/**
 * 黄道经度落在第几宫（1..12）。宫界为 cusps[i] → cusps[i+1] 沿黄道正向（含起点）。
 */
export function houseNumberForLongitude(lonDeg: number, houseCuspsLonDeg: readonly number[]): number {
  if (houseCuspsLonDeg.length !== 12) return 1;
  const p = normalizeDeg(lonDeg);
  for (let i = 0; i < 12; i++) {
    const a = normalizeDeg(houseCuspsLonDeg[i]!);
    const b = normalizeDeg(houseCuspsLonDeg[(i + 1) % 12]!);
    if (a <= b) {
      if (p >= a && p < b) return i + 1;
    } else {
      if (p >= a || p < b) return i + 1;
    }
  }
  return 12;
}

export function formatLongitudeInSignZh(lonDeg: number): { signZh: string; degInSign: number; minInSign: number; text: string } {
  const signZh = ZODIAC_CN[zodiacKeyFromLongitude(lonDeg)];
  const x = normalizeDeg(lonDeg) % 30;
  let degInSign = Math.floor(x);
  let minInSign = Math.round((x - degInSign) * 60);
  if (minInSign === 60) {
    minInSign = 0;
    degInSign += 1;
  }
  if (degInSign === 30) {
    degInSign = 0;
  }
  return {
    signZh,
    degInSign,
    minInSign,
    text: `${signZh} ${degInSign}°${minInSign}′`,
  };
}

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function normalizeDeg(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

function normalizeSigned180(deg: number): number {
  const d = normalizeDeg(deg);
  return d > 180 ? d - 360 : d;
}

function circularDiffDeg(a: number, b: number): number {
  // signed diff in [-180,180)
  return normalizeSigned180(a - b);
}

function ascendantLongitudeDeg(instantUtc: Date, latDeg: number, lonDeg: number): number {
  // 复用当前项目里 natal-chart 的“严格用几何求 ASC 黄经”思路：
  // 取本地东点处的地平交点向量，ROT 到 ECT 再落到黄经。
  const observer = new Astronomy.Observer(latDeg, lonDeg, 0);
  const eastHorizon = new Astronomy.Spherical(0, 90, 1);
  const vHor = Astronomy.VectorFromHorizon(eastHorizon, instantUtc, "normal");
  const horEqj = Astronomy.Rotation_HOR_EQJ(instantUtc, observer);
  const vEqj = Astronomy.RotateVector(horEqj, vHor);
  const eqjEct = Astronomy.Rotation_EQJ_ECT(instantUtc);
  const vEct = Astronomy.RotateVector(eqjEct, vEqj);
  const sph = Astronomy.SphereFromVector(vEct);
  let lon = sph.lon;
  if (lon < 0) lon += 360;
  if (lon >= 360) lon -= 360;
  return lon;
}

function epsilonDegForInstant(instantUtc: Date): number {
  const t = Astronomy.MakeTime(instantUtc);
  const tilt = Astronomy.e_tilt(t);
  // ee: "Earth obliquity" in degrees in astronomy-engine typings
  return tilt.ee;
}

function raDecFromEclipticLon(lonDeg: number, epsilonDeg: number): { raDeg: number; decDeg: number } {
  const lon = lonDeg * DEG2RAD;
  const eps = epsilonDeg * DEG2RAD;
  // ecliptic plane -> equator with obliquity epsilon; assume ecliptic latitude = 0.
  const dec = Math.asin(Math.sin(lon) * Math.sin(eps));
  const y = Math.sin(lon) * Math.cos(eps);
  const x = Math.cos(lon);
  const ra = Math.atan2(y, x); // [-pi, pi]
  return { raDeg: normalizeDeg(ra * RAD2DEG), decDeg: dec * RAD2DEG };
}

function localSiderealTimeDeg(instantUtc: Date, longitudeDeg: number): number {
  // astronomy-engine SiderealTime returns Greenwich apparent sidereal time in *sidereal hours* [0,24)
  const gastHours = Astronomy.SiderealTime(instantUtc);
  const gastDeg = gastHours * 15;
  // LST = GST + geographic longitude (east positive) in degrees
  return normalizeDeg(gastDeg + longitudeDeg);
}

function calcPlacidusMundanePositionRaDegFast(args: {
  latitudeDeg: number;
  lstDeg: number;
  epsilonDeg: number;
  eclLonDeg: number;
}): number {
  const { latitudeDeg, lstDeg, epsilonDeg, eclLonDeg } = args;

  const { raDeg: raP, decDeg: decP } = raDecFromEclipticLon(eclLonDeg, epsilonDeg);

  const phi = latitudeDeg * DEG2RAD;
  const delta = decP * DEG2RAD;

  const H = normalizeSigned180(lstDeg - raP) * DEG2RAD; // hour angle in radians
  const sinH = Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.cos(H);
  const isAbove = sinH >= 0;

  // Ascension difference AD_P = asin(tan φ tan D)
  const tanPhi = Math.tan(phi);
  const tanDelta = Math.tan(delta);
  const x = Math.max(-1, Math.min(1, tanPhi * tanDelta));
  const adRad = Math.asin(x);
  const adDeg = adRad * RAD2DEG;

  // RA_MC/IC base
  const raBase = isAbove ? lstDeg : normalizeDeg(lstDeg + 180);
  const deltaRa = circularDiffDeg(raP, raBase); // signed [-180,180)

  // semi-arc length:
  // diurnal semi-arc ~ 90° - AD, nocturnal semi-arc ~ 90° + AD
  const semiArcDeg = isAbove ? Math.abs(90 - adDeg) : Math.abs(90 + adDeg);
  if (semiArcDeg < 1e-9) return normalizeDeg(raBase);

  const r = Math.min(1, Math.abs(deltaRa) / semiArcDeg);
  const raM = raBase + (deltaRa >= 0 ? 1 : -1) * 90 * r;
  return normalizeDeg(raM);
}

function solveEclipticLonByMundaneTarget(
  targetRaMdeg: number,
  latitudeDeg: number,
  // 用于选择正确根：接近 Whole Sign 的候选解
  wholeSignApproxLonDeg: number,
  epsilonDeg: number,
  lstDeg: number,
): number {
  // coarse sampling
  const stepCoarse = 0.25; // deg
  const stepRefine = 0.02; // deg
  const windowRefine = 0.5; // deg

  let bestLon = normalizeDeg(wholeSignApproxLonDeg);
  let bestDiff = Number.POSITIVE_INFINITY;
  let bestLonDiff = Number.POSITIVE_INFINITY;

  for (let lon = 0; lon < 360; lon += stepCoarse) {
    const raM = calcPlacidusMundanePositionRaDegFast({
      latitudeDeg,
      lstDeg,
      epsilonDeg,
      eclLonDeg: lon,
    });
    const diff = Math.abs(circularDiffDeg(raM, targetRaMdeg));
    const lonDiff = Math.abs(circularDiffDeg(lon, wholeSignApproxLonDeg));
    if (diff < bestDiff - 1e-9 || (Math.abs(diff - bestDiff) <= 1e-9 && lonDiff < bestLonDiff)) {
      bestDiff = diff;
      bestLonDiff = lonDiff;
      bestLon = lon;
    }
  }

  // local refine around bestLon
  const center = bestLon;
  for (let lon = center - windowRefine; lon <= center + windowRefine; lon += stepRefine) {
    const lonN = normalizeDeg(lon);
    const raM = calcPlacidusMundanePositionRaDegFast({
      latitudeDeg,
      lstDeg,
      epsilonDeg,
      eclLonDeg: lonN,
    });
    const diff = Math.abs(circularDiffDeg(raM, targetRaMdeg));
    const lonDiff = Math.abs(circularDiffDeg(lonN, wholeSignApproxLonDeg));
    if (diff < bestDiff - 1e-9 || (Math.abs(diff - bestDiff) <= 1e-9 && lonDiff < bestLonDiff)) {
      bestDiff = diff;
      bestLonDiff = lonDiff;
      bestLon = lonN;
    }
  }

  return normalizeDeg(bestLon);
}

function computeHouseCuspsLonDegPlacidus(
  instantUtc: Date,
  latitudeDeg: number,
  longitudeDeg: number,
  ascLonDeg: number,
): number[] {
  const epsilonDeg = epsilonDegForInstant(instantUtc);
  const lstDeg = localSiderealTimeDeg(instantUtc, longitudeDeg);

  // Whole Sign 近似（用于根选择）
  const ascZ = zodiacKeyFromLongitude(ascLonDeg);
  const ascZIdx = ZODIAC_KEYS.indexOf(ascZ);
  const wholeSignStart = ascZIdx * 30;

  const oaAscRaM = calcPlacidusMundanePositionRaDegFast({
    latitudeDeg,
    lstDeg,
    epsilonDeg,
    eclLonDeg: ascLonDeg,
  });

  const res: number[] = new Array(12);
  for (let i = 1; i <= 12; i++) {
    if (i === 1) {
      res[i - 1] = normalizeDeg(ascLonDeg);
      continue;
    }
    const targetRaM = normalizeDeg(oaAscRaM + 30 * (i - 1));
    const wholeApprox = normalizeDeg(wholeSignStart + 30 * (i - 1));
    // Solve for the ecliptic longitude whose mundane position matches the target
    const lon = solveEclipticLonByMundaneTarget(targetRaM, latitudeDeg, wholeApprox, epsilonDeg, lstDeg);
    res[i - 1] = lon;
  }
  // simple sanity: ensure monotonic-ish order isn't required because wheel can wrap.
  return res;
}

function computeHouseCuspsLonDegWholeSign(ascLonDeg: number): number[] {
  const ascZ = zodiacKeyFromLongitude(ascLonDeg);
  const ascZIdx = ZODIAC_KEYS.indexOf(ascZ);
  const start = ascZIdx * 30;
  return new Array(12).fill(0).map((_, i) => normalizeDeg(start + 30 * i));
}

function computeMcLonDegFromLst(instantUtc: Date, longitudeDeg: number): number {
  // MC: ecliptic point whose right ascension equals local sidereal time (hour angle = 0)
  const eps = epsilonDegForInstant(instantUtc);
  const lstDeg = localSiderealTimeDeg(instantUtc, longitudeDeg);

  const alpha = lstDeg * DEG2RAD; // RA in degrees -> rad
  const epsRad = eps * DEG2RAD;

  // Inverse of:
  //   ra = atan2(sinλ cosε, cosλ)
  // => λ = atan2(sinα / cosε, cosα)
  const sinLam = Math.sin(alpha) / Math.cos(epsRad);
  const cosLam = Math.cos(alpha);
  const lam = Math.atan2(sinLam, cosLam);
  return normalizeDeg(lam * RAD2DEG);
}

const PLANET_META: Record<
  PlanetId,
  { body: Astronomy.Body; labelZh: string; color: string; isOuter?: boolean }
> = {
  sun: { body: Astronomy.Body.Sun, labelZh: "日", color: "#D4A017" },
  moon: { body: Astronomy.Body.Moon, labelZh: "月", color: "#7EC8D4" },
  mercury: { body: Astronomy.Body.Mercury, labelZh: "水", color: "#B8A6E6" },
  venus: { body: Astronomy.Body.Venus, labelZh: "金", color: "#C5A059" },
  mars: { body: Astronomy.Body.Mars, labelZh: "火", color: "#D65A52" },
  jupiter: { body: Astronomy.Body.Jupiter, labelZh: "木", color: "#4EB89A" },
  saturn: { body: Astronomy.Body.Saturn, labelZh: "土", color: "#9C8D6B" },
  uranus: { body: Astronomy.Body.Uranus, labelZh: "天王", color: "#6BBBD7", isOuter: true },
  neptune: { body: Astronomy.Body.Neptune, labelZh: "海王", color: "#5A7DFF", isOuter: true },
  pluto: { body: Astronomy.Body.Pluto, labelZh: "冥王", color: "#9A8060", isOuter: true },
};

export function computePlanetsLongitudes(instantUtc: Date): AstroPlanetDatum[] {
  // Sun: use SunPosition().elon because it is exposed as "true ecliptic lon"
  const sunLon = Astronomy.SunPosition(instantUtc).elon;
  const moonLon = Astronomy.EclipticLongitude(Astronomy.Body.Moon, instantUtc);

  const mk = (id: PlanetId, lonDeg: number): AstroPlanetDatum => ({
    id,
    labelZh: PLANET_META[id]!.labelZh,
    color: PLANET_META[id]!.color,
    lonDeg: normalizeDeg(lonDeg),
    zodiac: zodiacKeyFromLongitude(lonDeg),
  });

  return [
    mk("sun", sunLon),
    mk("moon", moonLon),
    mk("mercury", Astronomy.EclipticLongitude(Astronomy.Body.Mercury, instantUtc)),
    mk("venus", Astronomy.EclipticLongitude(Astronomy.Body.Venus, instantUtc)),
    mk("mars", Astronomy.EclipticLongitude(Astronomy.Body.Mars, instantUtc)),
    mk("jupiter", Astronomy.EclipticLongitude(Astronomy.Body.Jupiter, instantUtc)),
    mk("saturn", Astronomy.EclipticLongitude(Astronomy.Body.Saturn, instantUtc)),
    mk("uranus", Astronomy.EclipticLongitude(Astronomy.Body.Uranus, instantUtc)),
    mk("neptune", Astronomy.EclipticLongitude(Astronomy.Body.Neptune, instantUtc)),
    mk("pluto", Astronomy.EclipticLongitude(Astronomy.Body.Pluto, instantUtc)),
  ];
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

  // Avoid over-clutter: show best N aspects
  const cap = 28;
  return aspects.slice(0, cap);
}

/**
 * 行运行星 × 本命行星：主相位（0/60/90/120/180），取容许度内、按 orb 升序，最多 40 条。
 */
export function computeTransitNatalMajorAspects(
  transitPlanets: AstroPlanetDatum[],
  natalPlanets: AstroPlanetDatum[],
  orbLimitDeg = 6,
): AstroTransitNatalAspectDatum[] {
  const aspects: AstroTransitNatalAspectDatum[] = [];
  const map: { type: AspectType; exactDeg: number }[] = [
    { type: "conjunction", exactDeg: 0 },
    { type: "sextile", exactDeg: 60 },
    { type: "square", exactDeg: 90 },
    { type: "trine", exactDeg: 120 },
    { type: "opposition", exactDeg: 180 },
  ];

  for (const tp of transitPlanets) {
    for (const np of natalPlanets) {
      const rawDiff = normalizeSigned180(np.lonDeg - tp.lonDeg);
      const angle = Math.abs(rawDiff);
      for (const asp of map) {
        const orb = Math.abs(angle - asp.exactDeg);
        if (orb <= orbLimitDeg) {
          aspects.push({
            transit: tp.id,
            natal: np.id,
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
  return aspects.slice(0, 40);
}

export function computeAstroChartWheelData(input: {
  instantUtc: Date;
  latitudeDeg: number;
  longitudeDeg: number;
  houseSystem: HouseSystemId;
}): AstroChartWheelData {
  const { instantUtc, latitudeDeg, longitudeDeg, houseSystem } = input;

  const ascLonDeg = ascendantLongitudeDeg(instantUtc, latitudeDeg, longitudeDeg);
  const mcLonDeg = computeMcLonDegFromLst(instantUtc, longitudeDeg);

  const planets = computePlanetsLongitudes(instantUtc);
  const aspects = computeMajorAspects(planets, 6);

  const houseCuspsLonDeg =
    houseSystem === "Whole Sign" ? computeHouseCuspsLonDegWholeSign(ascLonDeg) : computeHouseCuspsLonDegPlacidus(instantUtc, latitudeDeg, longitudeDeg, ascLonDeg);

  return {
    instantUtc,
    latitudeDeg,
    longitudeDeg,
    houseSystem,
    ascLonDeg,
    mcLonDeg,
    planets,
    aspects,
    houseCuspsLonDeg,
  };
}

