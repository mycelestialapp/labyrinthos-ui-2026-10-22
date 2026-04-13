import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { planetFiveChartLayerStringsFor } from "@/lib/astro-five-layer-planet-voice-zh";
import { majorFiveChartLayerStringsFor } from "@/lib/astro-five-layer-major-voice-zh";
import { houseFiveChartLayerStringsFor } from "@/lib/astro-five-layer-house-voice-zh";
import { minorFiveChartLayerStringsFor } from "@/lib/astro-five-layer-minor-voice-zh";
import { angleFiveChartLayerStringsFor } from "@/lib/astro-five-layer-angle-voice-zh";
import type { PlanetPositionsObservationReport } from "@/lib/astro-planet-positions-report-zh";
import type { MajorAspectObservationReport } from "@/lib/astro-major-aspect-report-zh";
import type { HouseCuspObservationReport } from "@/lib/astro-house-cusp-report-zh";
import type { MinorAspectObservationReport } from "@/lib/astro-minor-aspect-report-zh";
import type { AngleAspectObservationReport } from "@/lib/astro-angle-aspect-report-zh";

/**
 * 五联观测：各 Tab「本表在说什么 / 矩阵标题」按盘型与声部取自 `astro-five-layer-*-voice-zh`（本命盘不覆盖表层）。
 */

export function applyPlanetPositionsChartKindLayer(
  report: PlanetPositionsObservationReport,
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh = 1,
): PlanetPositionsObservationReport {
  const V = planetFiveChartLayerStringsFor(kind, voiceStyleId);
  if (!V.planetStatus && !V.planetMatrix) return report;
  return {
    ...report,
    statusLine: V.planetStatus ?? report.statusLine,
    precision: {
      ...report.precision,
      matrix: V.planetMatrix ?? report.precision.matrix,
    },
  };
}

export function applyMajorAspectChartKindLayer(
  report: MajorAspectObservationReport,
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh = 1,
): MajorAspectObservationReport {
  const V = majorFiveChartLayerStringsFor(kind, voiceStyleId);
  if (!V.majorStatus && !V.majorMatrix) return report;
  return {
    ...report,
    statusLine: V.majorStatus ?? report.statusLine,
    precision: {
      ...report.precision,
      matrix: V.majorMatrix ?? report.precision.matrix,
    },
  };
}

export function applyHouseCuspChartKindLayer(
  report: HouseCuspObservationReport,
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh = 1,
): HouseCuspObservationReport {
  const V = houseFiveChartLayerStringsFor(kind, voiceStyleId);
  if (!V.houseStatus && !V.houseMatrix) return report;
  return {
    ...report,
    statusLine: V.houseStatus ?? report.statusLine,
    precision: {
      ...report.precision,
      matrix: V.houseMatrix ?? report.precision.matrix,
    },
  };
}

export function applyMinorAspectChartKindLayer(
  report: MinorAspectObservationReport,
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh = 1,
): MinorAspectObservationReport {
  const V = minorFiveChartLayerStringsFor(kind, voiceStyleId);
  if (!V.minorStatus && !V.minorMatrix) return report;
  return {
    ...report,
    statusLine: V.minorStatus ?? report.statusLine,
    precision: {
      ...report.precision,
      matrix: V.minorMatrix ?? report.precision.matrix,
    },
  };
}

export function applyAngleAspectChartKindLayer(
  report: AngleAspectObservationReport,
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh = 1,
): AngleAspectObservationReport {
  const V = angleFiveChartLayerStringsFor(kind, voiceStyleId);
  if (!V.angleStatus && !V.angleMatrix) return report;
  return {
    ...report,
    statusLine: V.angleStatus ?? report.statusLine,
    precision: {
      ...report.precision,
      matrix: V.angleMatrix ?? report.precision.matrix,
    },
  };
}
