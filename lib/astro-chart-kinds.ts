/**
 * 占星页「盘类型」：本命 / 合盘 / 行运 / 时刻盘 / 次限推运 / 三限推运 / 日返 / 月返。
 * 日返：在目标公历年、生日附近搜索太阳黄经回归本命太阳黄经的瞬时（热带黄道，astronomy-engine）。
 */

import * as Astronomy from "astronomy-engine";
import type { HouseSystemId } from "@/lib/astro-dossier-storage";
import {
  resolveChartAspectParams,
  type AspectPresetId,
  type OrbPresetId,
} from "@/lib/astro-aspect-params";
import {
  computeAstroChartWheelData,
  computePlanetsLongitudes,
  computeTransitNatalAspects,
  type AstroChartWheelData,
} from "@/lib/astro-chart-wheel";

export type { AspectPresetId, OrbPresetId } from "@/lib/astro-aspect-params";

export type ChartKindId =
  | "natal"
  | "synastry"
  | "transit"
  | "ephemeris"
  | "secondary"
  | "tertiary"
  | "solar_return"
  | "lunar_return";

/**
 * 在「星盘数据」各表下展示五联观测报告的盘型（与当前 Swiss 轮几何一致）。
 * 合盘时主轮为案主本命，双人相位在合盘 Tab。
 */
export const CHART_KINDS_WITH_WHEEL_TABLE_OBSERVATION: ChartKindId[] = [
  "natal",
  "synastry",
  "transit",
  "ephemeris",
  "secondary",
  "tertiary",
  "solar_return",
  "lunar_return",
];

export function chartKindHasWheelTableObservation(kind: ChartKindId): boolean {
  return CHART_KINDS_WITH_WHEEL_TABLE_OBSERVATION.includes(kind);
}

export type SecondaryYearBasisId = "tropical" | "julian";
export type TertiaryMonthBasisId = "synodic" | "sidereal";

const MS_DAY = 86400000;
const MS_TROPICAL_YEAR = 365.24219 * MS_DAY;
const MS_JULIAN_YEAR = 365.25 * MS_DAY;
/**
 * 三限推运主流口径（更贴近常见软件默认）：
 * 1 推进日 = 1 朔望月（synodic month, 平均约 29.53 日）
 */
const MS_SYNODIC_LUNAR_MONTH = 29.530588853 * MS_DAY;
const MS_SIDEREAL_LUNAR_MONTH = 27.321661 * MS_DAY;

function norm0(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function sunLon(d: Date): number {
  return norm0(Astronomy.SunPosition(d).elon);
}

function moonLon(d: Date): number {
  return norm0(Astronomy.EclipticLongitude(Astronomy.Body.Moon, d));
}

function angleSepDeg(a: number, b: number): number {
  let d = Math.abs(norm0(a) - norm0(b));
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

/**
 * 在指定公历年的生日附近，求太阳黄经最接近本命太阳黄经的 UTC 瞬时（用于日返盘）。
 */
export function findSolarReturnUtcNearBirthday(params: {
  natalSunLonDeg: number;
  calendarYear: number;
  birthMonth: number;
  birthDay: number;
}): Date {
  const { natalSunLonDeg, calendarYear, birthMonth, birthDay } = params;
  const target = norm0(natalSunLonDeg);
  const lo = Date.UTC(calendarYear, birthMonth - 1, birthDay - 2, 0, 0, 0);
  const hi = Date.UTC(calendarYear, birthMonth - 1, birthDay + 4, 0, 0, 0);
  const er = (tms: number) => angleSepDeg(sunLon(new Date(tms)), target);
  let bestT = lo;
  let bestE = 999;
  for (let t = lo; t <= hi; t += 3600000) {
    const e = er(t);
    if (e < bestE) {
      bestE = e;
      bestT = t;
    }
  }
  const refined = minimize1D(bestT - 18 * 3600000, bestT + 18 * 3600000, er, 56);
  return new Date(refined);
}

/**
 * 自 afterUtc 起向前略回拨、向后约 55 日内，求月亮黄经最接近本命月亮黄经的瞬时（月返）。
 */
export function findNearestLunarReturnUtc(params: { natalMoonLonDeg: number; afterUtc: Date }): Date {
  const target = norm0(params.natalMoonLonDeg);
  const start = params.afterUtc.getTime() - 2 * 3600000;
  const end = params.afterUtc.getTime() + 55 * MS_DAY;
  const er = (tms: number) => angleSepDeg(moonLon(new Date(tms)), target);
  let bestT = start;
  let bestE = 999;
  for (let t = start; t <= end; t += 15 * 60 * 1000) {
    const e = er(t);
    if (e < bestE) {
      bestE = e;
      bestT = t;
    }
  }
  const refined = minimize1D(bestT - 6 * 3600000, bestT + 6 * 3600000, er, 52);
  return new Date(refined);
}

const CHART_KIND_LABELS: Record<ChartKindId, string> = {
  natal: "出生盘：出生时刻（出生地）",
  synastry: "合盘：两人出生盘对照（双人主相位与互落宫）",
  transit: "行运盘：当前天体相对本命；含行运与本命主相位",
  ephemeris: "时刻盘：当前天体位置（仅盘内主相位）",
  secondary: "次限推运盘：1 推进日 = 1 回归年",
  tertiary: "三限推运盘：1 推进日 = 1 朔望月（约 29.53 日）",
  solar_return: "日返盘：太阳回归出生太阳黄经",
  lunar_return: "月返盘：月亮回归出生月亮黄经（相对此刻向后搜索）",
};

export function computeWorkspaceChartWheel(input: {
  kind: ChartKindId;
  birthUtc: Date;
  birthMonth: number;
  birthDay: number;
  latitudeDeg: number;
  longitudeDeg: number;
  houseSystem: HouseSystemId;
  nowUtc: Date;
  solarReturnCalendarYear: number;
  secondaryYearBasis: SecondaryYearBasisId;
  tertiaryMonthBasis: TertiaryMonthBasisId;
  aspectPreset: AspectPresetId;
  orbPreset: OrbPresetId;
}): AstroChartWheelData {
  const aspect = resolveChartAspectParams({
    aspectPreset: input.aspectPreset,
    orbPreset: input.orbPreset,
  });

  const natalPlanets = computePlanetsLongitudes(input.birthUtc);
  let instantUtc: Date;
  let transitNatalAspects: AstroChartWheelData["transitNatalAspects"];
  let transitNatalMinorAspects: AstroChartWheelData["transitNatalMinorAspects"];
  let extraLine = "";

  switch (input.kind) {
    case "natal":
    case "synastry":
      instantUtc = input.birthUtc;
      break;
    case "transit": {
      instantUtc = input.nowUtc;
      const tn = computeTransitNatalAspects(computePlanetsLongitudes(instantUtc), natalPlanets, {
        majorOrbDeg: aspect.majorOrbDeg,
        minorOrbDeg: aspect.minorOrbDeg,
        maxMajor: 40,
        maxMinor: aspect.includeMinorAspects ? 36 : 0,
      });
      transitNatalAspects = tn.major;
      transitNatalMinorAspects = tn.minor.length > 0 ? tn.minor : undefined;
      break;
    }
    case "ephemeris":
      instantUtc = input.nowUtc;
      break;
    case "secondary": {
      const yearMs = input.secondaryYearBasis === "julian" ? MS_JULIAN_YEAR : MS_TROPICAL_YEAR;
      const lifeYears = (input.nowUtc.getTime() - input.birthUtc.getTime()) / yearMs;
      instantUtc = new Date(input.birthUtc.getTime() + lifeYears * MS_DAY);
      extraLine = `推进龄≈${lifeYears.toFixed(4)}回归年 · 口径=${input.secondaryYearBasis === "julian" ? "儒略年(365.25)" : "热带年(365.24219)"}`;
      break;
    }
    case "tertiary": {
      const elapsed = input.nowUtc.getTime() - input.birthUtc.getTime();
      const monthMs = input.tertiaryMonthBasis === "sidereal" ? MS_SIDEREAL_LUNAR_MONTH : MS_SYNODIC_LUNAR_MONTH;
      const monthsFloat = elapsed / monthMs;
      instantUtc = new Date(input.birthUtc.getTime() + monthsFloat * MS_DAY);
      extraLine = `折合${input.tertiaryMonthBasis === "sidereal" ? "恒星月" : "朔望月"}≈${monthsFloat.toFixed(4)}`;
      break;
    }
    case "solar_return": {
      const natalSun = natalPlanets.find((p) => p.id === "sun")!;
      instantUtc = findSolarReturnUtcNearBirthday({
        natalSunLonDeg: natalSun.lonDeg,
        calendarYear: input.solarReturnCalendarYear,
        birthMonth: input.birthMonth,
        birthDay: input.birthDay,
      });
      extraLine = `目标年 ${input.solarReturnCalendarYear}`;
      break;
    }
    case "lunar_return": {
      const natalMoon = natalPlanets.find((p) => p.id === "moon")!;
      instantUtc = findNearestLunarReturnUtc({
        natalMoonLonDeg: natalMoon.lonDeg,
        afterUtc: input.nowUtc,
      });
      break;
    }
  }

  const base = computeAstroChartWheelData({
    instantUtc,
    latitudeDeg: input.latitudeDeg,
    longitudeDeg: input.longitudeDeg,
    houseSystem: input.houseSystem,
    aspect,
  });

  const baseLabel = CHART_KIND_LABELS[input.kind];
  const lineZh = extraLine ? `${baseLabel} · ${extraLine}` : baseLabel;

  return {
    ...base,
    transitNatalAspects,
    transitNatalMinorAspects,
    ephemerisSource: "astronomy-engine",
    chartKindMeta: { id: input.kind, lineZh },
  };
}
