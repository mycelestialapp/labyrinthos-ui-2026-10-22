/**
 * 盘内 / 行运 / 合盘共用的相位容许度与「是否算次要相位」解析（无其它 lib 依赖，避免循环 import）。
 */

export type AspectPresetId = "major_only" | "major_and_minor";

export type OrbPresetId = "tight" | "mainstream_default" | "wide";

export type ChartAspectComputationParams = {
  majorOrbDeg: number;
  minorOrbDeg: number;
  /** false 时不生成次要相位列表（盘内、轴点、行运×本命、合盘均一致）。 */
  includeMinorAspects: boolean;
};

const ORB_BY_PRESET: Record<OrbPresetId, { majorOrbDeg: number; minorOrbDeg: number }> = {
  tight: { majorOrbDeg: 5, minorOrbDeg: 1.5 },
  mainstream_default: { majorOrbDeg: 6, minorOrbDeg: 2.5 },
  wide: { majorOrbDeg: 8, minorOrbDeg: 3.5 },
};

export function resolveChartAspectParams(input: {
  aspectPreset: AspectPresetId;
  orbPreset: OrbPresetId;
}): ChartAspectComputationParams {
  const o = ORB_BY_PRESET[input.orbPreset];
  return {
    majorOrbDeg: o.majorOrbDeg,
    minorOrbDeg: o.minorOrbDeg,
    includeMinorAspects: input.aspectPreset === "major_and_minor",
  };
}
