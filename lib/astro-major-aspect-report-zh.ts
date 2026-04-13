import { aspectTypeLabelZh } from "@/lib/astro-aspect-type-label-zh";
import { fillCopyTemplate } from "@/lib/astro-copy-template-fill";
import { majorAspectCopyForChartKind } from "@/lib/astro-observation-main-copy-by-chart-kind-zh";
import { PLANET_NAME_ZH, type AstroAspectDatum, type AstroChartWheelData } from "@/lib/astro-chart-wheel";
import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { applyMajorAspectChartKindLayer } from "@/lib/astro-observation-five-chart-kind-layer-zh";

export type MajorAspectObservationReport = {
  statusLine: string;
  answer: {
    happened: string;
    risk: string;
    synergy: string;
    today: string;
  };
  pro: {
    center: string;
    conflict: string;
    drive: string;
  };
  precision: {
    matrix: string;
    tight: string[];
    tension: string[];
    noise: string[];
  };
  actions: [string, string, string];
};

function fmt(a: AstroAspectDatum): string {
  return `${PLANET_NAME_ZH[a.a]}${aspectTypeLabelZh(a.type)}${PLANET_NAME_ZH[a.b]}（orb ${a.orbDeg.toFixed(2)}°）`;
}

function byOrb(rows: AstroAspectDatum[]): AstroAspectDatum[] {
  return [...rows].sort((a, b) => a.orbDeg - b.orbDeg);
}

function findAspect(rows: AstroAspectDatum[], p1: AstroAspectDatum["a"], p2: AstroAspectDatum["b"], types: AstroAspectDatum["type"][]) {
  return rows.find(
    (r) =>
      ((r.a === p1 && r.b === p2) || (r.a === p2 && r.b === p1)) &&
      types.includes(r.type),
  );
}

function densityLabel(rows: AstroAspectDatum[]): string {
  const hard = rows.filter((r) => r.type === "square" || r.type === "opposition").length;
  if (hard >= 6) return "高压重排";
  if (hard >= 3) return "中压拉扯";
  return "低压整备";
}

export function buildMajorAspectObservationReport(
  chart: AstroChartWheelData | null,
  chartKind: ChartKindId = "natal",
  voiceStyleId: VoiceStyleIdZh = 1,
): MajorAspectObservationReport | null {
  if (!chart) return null;
  const rows = byOrb(chart.aspects ?? []);
  if (rows.length === 0) return null;

  const nodeAxis = findAspect(rows, "north_node", "south_node", ["opposition"]);
  const moonSat = findAspect(rows, "moon", "saturn", ["sextile", "trine", "conjunction"]);
  const sunMars = findAspect(rows, "sun", "mars", ["conjunction", "trine", "sextile"]);
  const center = nodeAxis ?? rows[0];
  const hardRows = rows.filter((r) => r.type === "square" || r.type === "opposition");
  const hardTop = hardRows.slice(0, 2);
  const softRows = rows.filter((r) => r.type === "sextile" || r.type === "trine");
  const softTop = moonSat ?? softRows[0] ?? rows[0];
  const drive = sunMars ?? rows.find((r) => r.type === "conjunction") ?? rows[0];
  const tight = rows.filter((r) => r.orbDeg < 1).slice(0, 3);
  const tension = rows.filter((r) => r.orbDeg >= 1 && r.orbDeg <= 5).slice(0, 4);
  const noise = rows.filter((r) => r.orbDeg > 5).slice(0, 3);
  const mode = densityLabel(rows);
  const reviewHours = hardRows.length >= 3 || (hardRows[0]?.orbDeg ?? 9) <= 1 ? 12 : 6;
  const C = majorAspectCopyForChartKind(chartKind, voiceStyleId);
  const hardAspectsText = hardTop.map((x) => fmt(x)).join("；");

  return applyMajorAspectChartKindLayer(
    {
      statusLine: C.statusLine,
      answer: {
        happened: mode === "高压重排" ? C.answer.happenedHighPressure : C.answer.happenedCalibrate,
        risk:
          hardTop.length > 0
            ? fillCopyTemplate(C.answer.riskWithHardTemplate, { hardAspects: hardAspectsText })
            : C.answer.riskNoHard,
        synergy: fillCopyTemplate(C.answer.synergyTemplate, { aspect: fmt(softTop) }),
        today: fillCopyTemplate(C.answer.todayTemplate, { hours: String(reviewHours) }),
      },
      pro: {
        center: fillCopyTemplate(C.pro.centerTemplate, { aspect: fmt(center) }),
        conflict:
          hardTop.length > 0
            ? fillCopyTemplate(C.pro.conflictWithHardTemplate, { hardAspects: hardAspectsText })
            : C.pro.conflictNoHard,
        drive: fillCopyTemplate(C.pro.driveTemplate, { aspect: fmt(drive) }),
      },
      precision: {
        matrix: C.precision.matrix,
        tight: tight.map((x) => `[${aspectTypeLabelZh(x.type)}] ${fmt(x)}`),
        tension: tension.map((x) => `[${aspectTypeLabelZh(x.type)}] ${fmt(x)}`),
        noise: noise.map((x) => `[${aspectTypeLabelZh(x.type)}] ${fmt(x)}`),
      },
      actions: [
        fillCopyTemplate(C.actions.stabilizeTemplate, { aspect: fmt(softTop) }),
        fillCopyTemplate(C.actions.growthDelayTemplate, { hours: String(reviewHours) }),
        fillCopyTemplate(C.actions.burstTemplate, { aspect: fmt(drive) }),
      ],
    },
    chartKind,
    voiceStyleId,
  );
}

