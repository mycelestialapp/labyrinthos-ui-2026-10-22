import { aspectTypeLabelZh } from "@/lib/astro-aspect-type-label-zh";
import {
  PLANET_NAME_ZH,
  type AspectType,
  type AstroAspectDatum,
  type AstroChartWheelData,
} from "@/lib/astro-chart-wheel";
import { minorAspectCopyForChartKind } from "@/lib/astro-observation-main-copy-by-chart-kind-zh";
import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { applyMinorAspectChartKindLayer } from "@/lib/astro-observation-five-chart-kind-layer-zh";

export type MinorAspectObservationReport = {
  statusLine: string;
  answer: {
    happened: string;
    risk: string;
    synergy: string;
    today: string;
  };
  pro: {
    compensation: string;
    friction: string;
    coordination: string;
  };
  precision: {
    matrix: string;
    highFreq: string[];
    lowFreq: string[];
  };
  actions: [string, string, string];
};

function fmt(a: AstroAspectDatum): string {
  return `${aspectTypeLabelZh(a.type)} ${PLANET_NAME_ZH[a.a]}-${PLANET_NAME_ZH[a.b]}（${a.orbDeg.toFixed(2)}°）`;
}

function fill(tpl: string, vars: Record<string, string>): string {
  let out = tpl;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{${k}}`, v);
  }
  return out;
}

function topBy(rows: AstroAspectDatum[], n: number, pred: (a: AstroAspectDatum) => boolean): AstroAspectDatum[] {
  return rows.filter(pred).sort((a, b) => a.orbDeg - b.orbDeg).slice(0, n);
}

function findPair(rows: AstroAspectDatum[], a: AstroAspectDatum["a"], b: AstroAspectDatum["b"], types: AspectType[]) {
  return rows.find((r) => ((r.a === a && r.b === b) || (r.a === b && r.b === a)) && types.includes(r.type));
}

export function buildMinorAspectObservationReport(
  chart: AstroChartWheelData | null,
  chartKind: ChartKindId = "natal",
  voiceStyleId: VoiceStyleIdZh = 1,
): MinorAspectObservationReport | null {
  if (!chart) return null;
  const rows = (chart.minorAspects ?? []).slice().sort((a, b) => a.orbDeg - b.orbDeg);
  if (rows.length === 0) return null;

  const urNep = findPair(rows, "uranus", "neptune", ["semisextile", "quincunx", "sesquiquadrate"]);
  const sunVen = findPair(rows, "sun", "venus", ["semisquare", "semisextile", "quincunx"]);
  const merVen = findPair(rows, "mercury", "venus", ["semisextile", "semisquare", "quincunx"]);

  const topTight = topBy(rows, 3, (r) => r.orbDeg <= 1);
  const topMid = topBy(rows, 6, (r) => r.orbDeg > 1 && r.orbDeg <= 2.5);
  const C = minorAspectCopyForChartKind(chartKind, voiceStyleId);
  const urNepLabel = fmt(urNep ?? rows[0]);
  const sunVenLabel = fmt(sunVen ?? rows[Math.min(1, rows.length - 1)] ?? rows[0]);
  const merVenLabel = fmt(merVen ?? rows[Math.min(2, rows.length - 1)] ?? rows[0]);

  return applyMinorAspectChartKindLayer(
    {
      statusLine: C.statusLine,
      answer: {
        happened: C.answer.happened,
        risk: C.answer.risk,
        synergy: fill(C.answer.synergyTemplate, { aspect: urNepLabel }),
        today: C.answer.today,
      },
      pro: {
        compensation: fill(C.pro.compensationTemplate, { aspect: urNepLabel }),
        friction: fill(C.pro.frictionTemplate, { aspect: sunVenLabel }),
        coordination: fill(C.pro.coordinationTemplate, { aspect: merVenLabel }),
      },
      precision: {
        matrix: C.precision.matrix,
        highFreq:
          topTight.length > 0 ? topTight.map((r) => `${C.precision.highFreqPrefix} ${fmt(r)}`) : [C.precision.emptyHighFreq],
        lowFreq: topMid.length > 0 ? topMid.map((r) => `${C.precision.lowFreqPrefix} ${fmt(r)}`) : [C.precision.emptyLowFreq],
      },
      actions: [
        fill(C.actions.inspirationTemplate, { aspect: urNepLabel }),
        fill(C.actions.tolerateTemplate, { aspect: sunVenLabel }),
        fill(C.actions.smoothingTemplate, { aspect: merVenLabel }),
      ],
    },
    chartKind,
    voiceStyleId,
  );
}

