/**
 * ???????????????/???????????????
 * ??????astronomy-engine???/??/????????Swiss ??? astro-chart-wheel-swiss??
 */

import * as Astronomy from "astronomy-engine";
import type { HouseSystemId } from "@/lib/astro-dossier-storage";
import type { ChartAspectComputationParams } from "@/lib/astro-aspect-params";
import { HOUSE_SYSTEM_LABEL_ZH } from "@/lib/astro-house-systems";
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
  | "pluto"
  | "north_node"
  | "south_node"
  | "chiron";

export type AstroPlanetDatum = {
  id: PlanetId;
  labelZh: string;
  color: string;
  lonDeg: number;
  zodiac: ZodiacKey;
  /** astronomy-engine / Swiss ????????? true */
  retrograde?: boolean;
};

export type AspectType =
  | "conjunction"
  | "sextile"
  | "square"
  | "trine"
  | "opposition"
  | "semisextile"
  | "semisquare"
  | "sesquiquadrate"
  | "quincunx";

/** ? `astro-aspect-type-label-zh` ?????sesquiquadrate=135??quincunx=150? */
export const MINOR_ASPECT_DEFS = [
  { type: "semisextile" as const, exactDeg: 30 },
  { type: "semisquare" as const, exactDeg: 45 },
  { type: "sesquiquadrate" as const, exactDeg: 135 },
  { type: "quincunx" as const, exactDeg: 150 },
] as const;

const MAJOR_ASPECT_DEFS: { type: AspectType; exactDeg: number }[] = [
  { type: "conjunction", exactDeg: 0 },
  { type: "sextile", exactDeg: 60 },
  { type: "square", exactDeg: 90 },
  { type: "trine", exactDeg: 120 },
  { type: "opposition", exactDeg: 180 },
];

export function isMajorAspectType(t: AspectType): boolean {
  return (
    t === "conjunction" ||
    t === "sextile" ||
    t === "square" ||
    t === "trine" ||
    t === "opposition"
  );
}

export type ChartAxisId = "asc" | "mc";

export type AstroAspectDatum = {
  a: PlanetId;
  b: PlanetId;
  type: AspectType;
  angleDeg: number;
  exactDeg: number;
  orbDeg: number;
};

export type AstroTransitNatalAspectDatum = {
  transit: PlanetId;
  natal: PlanetId;
  type: AspectType;
  angleDeg: number;
  exactDeg: number;
  orbDeg: number;
};

export type AstroAngleAspectDatum = {
  planet: PlanetId;
  axis: ChartAxisId;
  type: AspectType;
  angleDeg: number;
  exactDeg: number;
  orbDeg: number;
};

export type AstroChartWheelAspectMeta = {
  includeMinorAspects: boolean;
  majorOrbDeg: number;
  minorOrbDeg: number;
};

export type AstroChartWheelData = {
  instantUtc: Date;
  latitudeDeg: number;
  longitudeDeg: number;
  houseSystem: HouseSystemId;
  /**
   * ???????????????????????
   * - ???`astro-chart-kinds`?astronomy-engine?? `astro-chart-wheel-swiss`?Swiss Ephemeris WASM?
   */
  ephemerisSource?: "astronomy-engine" | "swiss-ephemeris";

  ascLonDeg: number;
  mcLonDeg: number;

  planets: AstroPlanetDatum[];
  /** ???????????? orb ??? */
  aspects: AstroAspectDatum[];
  /** ???????????????????????????? */
  minorAspects?: AstroAspectDatum[];
  houseCuspsLonDeg: number[];
  /** ????????????????? */
  transitNatalAspects?: AstroTransitNatalAspectDatum[];
  transitNatalMinorAspects?: AstroTransitNatalAspectDatum[];
  /** ?? ? ??/?????? */
  angleAspectsMajor?: AstroAngleAspectDatum[];
  angleAspectsMinor?: AstroAngleAspectDatum[];
  /** ????????????????? */
  aspectMeta?: AstroChartWheelAspectMeta;
  chartKindMeta?: { id: string; lineZh: string };
};

export const PLANET_GLYPH: Record<PlanetId, string> = {
  sun: "\u2609",
  moon: "\u263d",
  mercury: "\u263f",
  venus: "\u2640",
  mars: "\u2642",
  jupiter: "\u2643",
  saturn: "\u2644",
  uranus: "\u2645",
  neptune: "\u2646",
  pluto: "\u2647",
  north_node: "\u260a",
  south_node: "\u260b",
  chiron: "\u26b7",
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
  north_node: "北交点",
  south_node: "南交点",
  chiron: "凯龙",
};

export function axisLabelZh(axis: ChartAxisId): string {
  return axis === "asc" ? "上升" : "天顶";
}

export function houseSystemLabelZh(id: HouseSystemId): string {
  return HOUSE_SYSTEM_LABEL_ZH[id];
}

/**
 * ??????????1..12????? cusps[i] ? cusps[i+1] ???????????
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

export function formatLongitudeInSignZh(lonDeg: number): {
  signZh: string;
  degInSign: number;
  minInSign: number;
  text: string;
} {
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
    text: `${signZh} ${degInSign}\u00b0${minInSign}\u2032`,
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
  return normalizeSigned180(a - b);
}

function angleSepDegUnsigned(a: number, b: number): number {
  const na = normalizeDeg(a);
  const nb = normalizeDeg(b);
  let d = Math.abs(na - nb);
  if (d > 180) d = 360 - d;
  return d;
}

function jdUtFromDate(d: Date): number {
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const hour =
    d.getUTCHours() + d.getUTCMinutes() / 60 + (d.getUTCSeconds() + d.getUTCMilliseconds() / 1000) / 3600;
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn =
    day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return jdn + (hour - 12) / 24;
}

/** ??????????????????? Swiss ???????? */
function meanMoonNorthNodeLonDeg(d: Date): number {
  const jd = jdUtFromDate(d);
  const T = (jd - 2451545.0) / 36525;
  const lon = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000;
  return normalizeDeg(lon);
}

/** ??????????J2000 ??????????? astronomy-engine ????? */
function chironTropicalLonDegApprox(d: Date): number {
  const jd = jdUtFromDate(d);
  const days = jd - 2451545.0;
  const lon0 = 204.234;
  const motion = 360 / 18514;
  return normalizeDeg(lon0 + days * motion);
}

function lonSpeedDegPerDay(lonAt: (t: Date) => number, instantUtc: Date): number {
  const dtMs = 6 * 3600000;
  const lonA = lonAt(new Date(instantUtc.getTime() - dtMs));
  const lonB = lonAt(new Date(instantUtc.getTime() + dtMs));
  return normalizeSigned180(lonB - lonA) / 0.5;
}

function ascendantLongitudeDeg(instantUtc: Date, latDeg: number, lonDeg: number): number {
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
  return tilt.ee;
}

function raDecFromEclipticLon(lonDeg: number, epsilonDeg: number): { raDeg: number; decDeg: number } {
  const lon = lonDeg * DEG2RAD;
  const eps = epsilonDeg * DEG2RAD;
  const dec = Math.asin(Math.sin(lon) * Math.sin(eps));
  const y = Math.sin(lon) * Math.cos(eps);
  const x = Math.cos(lon);
  const ra = Math.atan2(y, x);
  return { raDeg: normalizeDeg(ra * RAD2DEG), decDeg: dec * RAD2DEG };
}

function localSiderealTimeDeg(instantUtc: Date, longitudeDeg: number): number {
  const gastHours = Astronomy.SiderealTime(instantUtc);
  const gastDeg = gastHours * 15;
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

  const H = normalizeSigned180(lstDeg - raP) * DEG2RAD;
  const sinH = Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.cos(H);
  const isAbove = sinH >= 0;

  const tanPhi = Math.tan(phi);
  const tanDelta = Math.tan(delta);
  const x = Math.max(-1, Math.min(1, tanPhi * tanDelta));
  const adRad = Math.asin(x);
  const adDeg = adRad * RAD2DEG;

  const raBase = isAbove ? lstDeg : normalizeDeg(lstDeg + 180);
  const deltaRa = circularDiffDeg(raP, raBase);

  const semiArcDeg = isAbove ? Math.abs(90 - adDeg) : Math.abs(90 + adDeg);
  if (semiArcDeg < 1e-9) return normalizeDeg(raBase);

  const r = Math.min(1, Math.abs(deltaRa) / semiArcDeg);
  const raM = raBase + (deltaRa >= 0 ? 1 : -1) * 90 * r;
  return normalizeDeg(raM);
}

function solveEclipticLonByMundaneTarget(
  targetRaMdeg: number,
  latitudeDeg: number,
  wholeSignApproxLonDeg: number,
  epsilonDeg: number,
  lstDeg: number,
): number {
  const stepCoarse = 0.25;
  const stepRefine = 0.02;
  const windowRefine = 0.5;

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
    const lon = solveEclipticLonByMundaneTarget(targetRaM, latitudeDeg, wholeApprox, epsilonDeg, lstDeg);
    res[i - 1] = lon;
  }
  return res;
}

function computeHouseCuspsLonDegWholeSign(ascLonDeg: number): number[] {
  const ascZ = zodiacKeyFromLongitude(ascLonDeg);
  const ascZIdx = ZODIAC_KEYS.indexOf(ascZ);
  const start = ascZIdx * 30;
  return new Array(12).fill(0).map((_, i) => normalizeDeg(start + 30 * i));
}

function computeMcLonDegFromLst(instantUtc: Date, longitudeDeg: number): number {
  const eps = epsilonDegForInstant(instantUtc);
  const lstDeg = localSiderealTimeDeg(instantUtc, longitudeDeg);

  const alpha = lstDeg * DEG2RAD;
  const epsRad = eps * DEG2RAD;

  const sinLam = Math.sin(alpha) / Math.cos(epsRad);
  const cosLam = Math.cos(alpha);
  const lam = Math.atan2(sinLam, cosLam);
  return normalizeDeg(lam * RAD2DEG);
}

const PLANET_META: Record<
  PlanetId,
  { body?: Astronomy.Body; labelZh: string; color: string; isOuter?: boolean; syntheticLon?: (d: Date) => number }
> = {
  sun: { body: Astronomy.Body.Sun, labelZh: PLANET_NAME_ZH.sun, color: "#D4A017" },
  moon: { body: Astronomy.Body.Moon, labelZh: PLANET_NAME_ZH.moon, color: "#7EC8D4" },
  mercury: { body: Astronomy.Body.Mercury, labelZh: PLANET_NAME_ZH.mercury, color: "#B8A6E6" },
  venus: { body: Astronomy.Body.Venus, labelZh: PLANET_NAME_ZH.venus, color: "#C5A059" },
  mars: { body: Astronomy.Body.Mars, labelZh: PLANET_NAME_ZH.mars, color: "#D65A52" },
  jupiter: { body: Astronomy.Body.Jupiter, labelZh: PLANET_NAME_ZH.jupiter, color: "#4EB89A" },
  saturn: { body: Astronomy.Body.Saturn, labelZh: PLANET_NAME_ZH.saturn, color: "#9C8D6B" },
  uranus: { body: Astronomy.Body.Uranus, labelZh: PLANET_NAME_ZH.uranus, color: "#6BBBD7", isOuter: true },
  neptune: { body: Astronomy.Body.Neptune, labelZh: PLANET_NAME_ZH.neptune, color: "#5A7DFF", isOuter: true },
  pluto: { body: Astronomy.Body.Pluto, labelZh: PLANET_NAME_ZH.pluto, color: "#9A8060", isOuter: true },
  north_node: {
    labelZh: PLANET_NAME_ZH.north_node,
    color: "#A89FBD",
    syntheticLon: meanMoonNorthNodeLonDeg,
  },
  south_node: {
    labelZh: PLANET_NAME_ZH.south_node,
    color: "#8B8AA8",
    syntheticLon: (d) => normalizeDeg(meanMoonNorthNodeLonDeg(d) + 180),
  },
  chiron: {
    labelZh: PLANET_NAME_ZH.chiron,
    color: "#C9A4A8",
    syntheticLon: chironTropicalLonDegApprox,
  },
};

export function computePlanetsLongitudes(instantUtc: Date): AstroPlanetDatum[] {
  const sunLon = Astronomy.SunPosition(instantUtc).elon;

  const mk = (id: PlanetId, lonDeg: number, retrograde?: boolean): AstroPlanetDatum => ({
    id,
    labelZh: PLANET_META[id]!.labelZh,
    color: PLANET_META[id]!.color,
    lonDeg: normalizeDeg(lonDeg),
    zodiac: zodiacKeyFromLongitude(lonDeg),
    retrograde,
  });

  const order: PlanetId[] = [
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

  const out: AstroPlanetDatum[] = [];

  for (const id of order) {
    const meta = PLANET_META[id]!;
    if (meta.body !== undefined) {
      const lon = id === "sun" ? sunLon : Astronomy.EclipticLongitude(meta.body, instantUtc);
      const lonAt =
        id === "sun"
          ? (t: Date) => Astronomy.SunPosition(t).elon
          : (t: Date) => Astronomy.EclipticLongitude(meta.body!, t);
      const spd = lonSpeedDegPerDay(lonAt, instantUtc);
      out.push(mk(id, lon, spd < 0));
    } else if (meta.syntheticLon) {
      const lon = meta.syntheticLon(instantUtc);
      const spd = lonSpeedDegPerDay(meta.syntheticLon, instantUtc);
      out.push(mk(id, lon, spd < 0));
    }
  }

  return out;
}

/** Swiss ??????????????????/??? */
export function buildWheelPairAspectSlices(
  planets: AstroPlanetDatum[],
  majorOrb: number,
  minorOrb: number,
  includeMinor: boolean,
): { major: AstroAspectDatum[]; minor: AstroAspectDatum[] } {
  const major: AstroAspectDatum[] = [];
  const minor: AstroAspectDatum[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i]!;
      const b = planets[j]!;
      const rawDiff = normalizeSigned180(b.lonDeg - a.lonDeg);
      const angle = Math.abs(rawDiff);

      for (const asp of MAJOR_ASPECT_DEFS) {
        const orb = Math.abs(angle - asp.exactDeg);
        if (orb <= majorOrb) {
          major.push({
            a: a.id,
            b: b.id,
            type: asp.type,
            angleDeg: angle,
            exactDeg: asp.exactDeg,
            orbDeg: orb,
          });
        }
      }

      if (includeMinor) {
        for (const asp of MINOR_ASPECT_DEFS) {
          const orb = Math.abs(angle - asp.exactDeg);
          if (orb <= minorOrb) {
            minor.push({
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
  }

  major.sort((x, y) => x.orbDeg - y.orbDeg);
  minor.sort((x, y) => x.orbDeg - y.orbDeg);
  return { major: major.slice(0, 28), minor: minor.slice(0, 36) };
}

/** Swiss ?????????? ? ASC/MC ?/??? */
export function buildWheelAngleAspectSlices(
  planets: AstroPlanetDatum[],
  ascLonDeg: number,
  mcLonDeg: number,
  majorOrb: number,
  minorOrb: number,
  includeMinor: boolean,
): { major: AstroAngleAspectDatum[]; minor: AstroAngleAspectDatum[] } {
  const major: AstroAngleAspectDatum[] = [];
  const minor: AstroAngleAspectDatum[] = [];

  const axes: { id: ChartAxisId; lon: number }[] = [
    { id: "asc", lon: ascLonDeg },
    { id: "mc", lon: mcLonDeg },
  ];

  for (const p of planets) {
    for (const ax of axes) {
      const angle = angleSepDegUnsigned(p.lonDeg, ax.lon);

      for (const asp of MAJOR_ASPECT_DEFS) {
        const orb = Math.abs(angle - asp.exactDeg);
        if (orb <= majorOrb) {
          major.push({
            planet: p.id,
            axis: ax.id,
            type: asp.type,
            angleDeg: angle,
            exactDeg: asp.exactDeg,
            orbDeg: orb,
          });
        }
      }

      if (includeMinor) {
        for (const asp of MINOR_ASPECT_DEFS) {
          const orb = Math.abs(angle - asp.exactDeg);
          if (orb <= minorOrb) {
            minor.push({
              planet: p.id,
              axis: ax.id,
              type: asp.type,
              angleDeg: angle,
              exactDeg: asp.exactDeg,
              orbDeg: orb,
            });
          }
        }
      }
    }
  }

  major.sort((x, y) => x.orbDeg - y.orbDeg);
  minor.sort((x, y) => x.orbDeg - y.orbDeg);
  return { major, minor: minor.slice(0, 48) };
}

export type TransitNatalAspectComputeOpts = {
  majorOrbDeg: number;
  minorOrbDeg: number;
  maxMajor: number;
  maxMinor: number;
};

export function computeTransitNatalAspects(
  transitPlanets: AstroPlanetDatum[],
  natalPlanets: AstroPlanetDatum[],
  opts: TransitNatalAspectComputeOpts,
): { major: AstroTransitNatalAspectDatum[]; minor: AstroTransitNatalAspectDatum[] } {
  const major: AstroTransitNatalAspectDatum[] = [];
  const minor: AstroTransitNatalAspectDatum[] = [];

  for (const tp of transitPlanets) {
    for (const np of natalPlanets) {
      const rawDiff = normalizeSigned180(np.lonDeg - tp.lonDeg);
      const angle = Math.abs(rawDiff);

      for (const asp of MAJOR_ASPECT_DEFS) {
        const orb = Math.abs(angle - asp.exactDeg);
        if (orb <= opts.majorOrbDeg) {
          major.push({
            transit: tp.id,
            natal: np.id,
            type: asp.type,
            angleDeg: angle,
            exactDeg: asp.exactDeg,
            orbDeg: orb,
          });
        }
      }

      if (opts.maxMinor > 0) {
        for (const asp of MINOR_ASPECT_DEFS) {
          const orb = Math.abs(angle - asp.exactDeg);
          if (orb <= opts.minorOrbDeg) {
            minor.push({
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
  }

  major.sort((x, y) => x.orbDeg - y.orbDeg);
  minor.sort((x, y) => x.orbDeg - y.orbDeg);
  return {
    major: major.slice(0, opts.maxMajor),
    minor: minor.slice(0, opts.maxMinor),
  };
}

/** @deprecated ???? `computeTransitNatalAspects`????????? */
export function computeTransitNatalMajorAspects(
  transitPlanets: AstroPlanetDatum[],
  natalPlanets: AstroPlanetDatum[],
  orbLimitDeg = 6,
): AstroTransitNatalAspectDatum[] {
  return computeTransitNatalAspects(transitPlanets, natalPlanets, {
    majorOrbDeg: orbLimitDeg,
    minorOrbDeg: 2.5,
    maxMajor: 40,
    maxMinor: 0,
  }).major;
}

export function computeAstroChartWheelData(input: {
  instantUtc: Date;
  latitudeDeg: number;
  longitudeDeg: number;
  houseSystem: HouseSystemId;
  aspect: ChartAspectComputationParams;
}): AstroChartWheelData {
  const { instantUtc, latitudeDeg, longitudeDeg, houseSystem, aspect } = input;

  const ascLonDeg = ascendantLongitudeDeg(instantUtc, latitudeDeg, longitudeDeg);
  const mcLonDeg = computeMcLonDegFromLst(instantUtc, longitudeDeg);

  const planets = computePlanetsLongitudes(instantUtc);
  const pair = buildWheelPairAspectSlices(planets, aspect.majorOrbDeg, aspect.minorOrbDeg, aspect.includeMinorAspects);
  const ang = buildWheelAngleAspectSlices(
    planets,
    ascLonDeg,
    mcLonDeg,
    aspect.majorOrbDeg,
    aspect.minorOrbDeg,
    aspect.includeMinorAspects,
  );

  const houseCuspsLonDeg =
    houseSystem === "Whole Sign"
      ? computeHouseCuspsLonDegWholeSign(ascLonDeg)
      : computeHouseCuspsLonDegPlacidus(instantUtc, latitudeDeg, longitudeDeg, ascLonDeg);

  return {
    instantUtc,
    latitudeDeg,
    longitudeDeg,
    houseSystem,
    ascLonDeg,
    mcLonDeg,
    planets,
    aspects: pair.major,
    minorAspects: pair.minor.length > 0 ? pair.minor : undefined,
    houseCuspsLonDeg,
    angleAspectsMajor: ang.major.length > 0 ? ang.major : undefined,
    angleAspectsMinor: ang.minor.length > 0 ? ang.minor : undefined,
    aspectMeta: {
      includeMinorAspects: aspect.includeMinorAspects,
      majorOrbDeg: aspect.majorOrbDeg,
      minorOrbDeg: aspect.minorOrbDeg,
    },
  };
}
