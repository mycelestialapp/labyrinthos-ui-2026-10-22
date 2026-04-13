import { aspectTypeLabelZh } from "@/lib/astro-aspect-type-label-zh";
import {
  PLANET_NAME_ZH,
  type AstroAngleAspectDatum,
  type AstroChartWheelData,
} from "@/lib/astro-chart-wheel";
import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { fillCopyTemplate } from "@/lib/astro-copy-template-fill";
import { angleAspectCopyForChartKind } from "@/lib/astro-observation-main-copy-by-chart-kind-zh";
import { applyAngleAspectChartKindLayer } from "@/lib/astro-observation-five-chart-kind-layer-zh";

export type AngleAspectObservationReport = {
  statusLine: string;
  answer: {
    happened: string;
    risk: string;
    synergy: string;
    today: string;
  };
  pro: {
    socialFriction: string;
    entryPressure: string;
    interfaceMicroAdjust: string;
  };
  precision: {
    matrix: string;
    major: string[];
    minor: string[];
  };
  actions: [string, string, string];
};

function axisZh(a: AstroAngleAspectDatum["axis"]): "上升" | "天顶" {
  return a === "asc" ? "上升" : "天顶";
}

function fmt(a: AstroAngleAspectDatum): string {
  return `${PLANET_NAME_ZH[a.planet]}${aspectTypeLabelZh(a.type)}${axisZh(a.axis)}（${a.orbDeg.toFixed(2)}°）`;
}

function first<T>(xs: T[]): T | null {
  return xs.length > 0 ? xs[0]! : null;
}

function pick(rows: AstroAngleAspectDatum[], pred: (x: AstroAngleAspectDatum) => boolean): AstroAngleAspectDatum | null {
  return first(rows.filter(pred).sort((a, b) => a.orbDeg - b.orbDeg));
}

function lowPressure(rows: AstroAngleAspectDatum[]): boolean {
  const hard = rows.filter((r) => r.type === "square" || r.type === "opposition").length;
  return hard <= 1;
}

export function buildAngleAspectObservationReport(
  chart: AstroChartWheelData | null,
  chartKind: ChartKindId = "natal",
  voiceStyleId: VoiceStyleIdZh = 1,
): AngleAspectObservationReport | null {
  if (!chart) return null;
  const major = [...(chart.angleAspectsMajor ?? [])].sort((a, b) => a.orbDeg - b.orbDeg);
  const minor = [...(chart.angleAspectsMinor ?? [])].sort((a, b) => a.orbDeg - b.orbDeg);
  if (major.length + minor.length === 0) return null;
  const anyTop = first(major) ?? first(minor);
  if (!anyTop) return null;

  const moonMc =
    pick(major, (r) => r.planet === "moon" && r.axis === "mc" && r.type === "square") ??
    pick(minor, (r) => r.planet === "moon" && r.axis === "mc") ??
    anyTop;
  const satAsc =
    pick(major, (r) => r.planet === "saturn" && r.axis === "asc" && r.type === "square") ??
    pick(minor, (r) => r.planet === "saturn" && r.axis === "asc") ??
    anyTop;
  const chironAsc =
    pick(minor, (r) => r.planet === "chiron" && r.axis === "asc") ??
    pick(minor, (r) => r.axis === "asc") ??
    anyTop;

  const majorLines = major.map(
    (r) => `[${aspectTypeLabelZh(r.type)}] ${PLANET_NAME_ZH[r.planet]} → ${axisZh(r.axis)} (${r.orbDeg.toFixed(2)}°)`,
  );
  const minorLines = minor.map(
    (r) => `[${aspectTypeLabelZh(r.type)}] ${PLANET_NAME_ZH[r.planet]} → ${axisZh(r.axis)} (${r.orbDeg.toFixed(2)}°)`,
  );
  const reserve = lowPressure(major) ? "10%" : "15%";
  const C = angleAspectCopyForChartKind(chartKind, voiceStyleId);

  return applyAngleAspectChartKindLayer(
    {
      statusLine: C.statusLine,
      answer: {
        happened: C.answer.happened,
        risk: C.answer.risk,
        synergy: fillCopyTemplate(C.answer.synergyTemplate, { aspect: fmt(chironAsc) }),
        today: fillCopyTemplate(C.answer.todayTemplate, { reserve }),
      },
      pro: {
        socialFriction: fillCopyTemplate(C.pro.socialFrictionTemplate, { aspect: fmt(moonMc) }),
        entryPressure: fillCopyTemplate(C.pro.entryPressureTemplate, { aspect: fmt(satAsc) }),
        interfaceMicroAdjust:
          minor.length > 0
            ? fillCopyTemplate(C.pro.interfaceMicroAdjustWithMinorTemplate, {
                snippet: minor.slice(0, 2).map((r) => fmt(r)).join("；"),
              })
            : C.pro.interfaceMicroAdjustEmpty,
      },
      precision: {
        matrix: C.precision.matrix,
        major: majorLines.length > 0 ? majorLines : [C.precision.majorEmpty],
        minor: minorLines.length > 0 ? minorLines : [C.precision.minorEmpty],
      },
      actions: [
        fillCopyTemplate(C.actions.a0Template, { aspect: fmt(moonMc) }),
        fillCopyTemplate(C.actions.a1Template, { aspect: fmt(satAsc) }),
        C.actions.a2,
      ],
    },
    chartKind,
    voiceStyleId,
  );
}

