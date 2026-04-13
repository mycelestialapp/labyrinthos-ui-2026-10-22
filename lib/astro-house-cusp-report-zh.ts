import { fillCopyTemplate } from "@/lib/astro-copy-template-fill";
import { houseCuspCopyForChartKind } from "@/lib/astro-observation-main-copy-by-chart-kind-zh";
import { formatLongitudeInSignZh, type AstroChartWheelData } from "@/lib/astro-chart-wheel";
import { type ZodiacKey, zodiacKeyFromLongitude } from "@/lib/natal-chart";
import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { applyHouseCuspChartKindLayer } from "@/lib/astro-observation-five-chart-kind-layer-zh";

export type HouseCuspObservationReport = {
  statusLine: string;
  answer: {
    happened: string;
    core: string;
    risk: string;
    today: string;
  };
  pro: {
    asc: string;
    valueAxis: string;
    mc: string;
  };
  precision: {
    matrix: string;
    anchors: [string, string, string, string];
    turns: [string, string];
  };
  actions: [string, string, string];
};

type Element = "fire" | "earth" | "air" | "water";

function elementOf(key: ZodiacKey): Element {
  if (["ARIES", "LEO", "SAGITTARIUS"].includes(key)) return "fire";
  if (["TAURUS", "VIRGO", "CAPRICORN"].includes(key)) return "earth";
  if (["GEMINI", "LIBRA", "AQUARIUS"].includes(key)) return "air";
  return "water";
}

function signAt(cusps: number[], idx0: number): { text: string; key: ZodiacKey; el: Element } {
  const lon = cusps[idx0] ?? 0;
  return {
    text: formatLongitudeInSignZh(lon).text,
    key: zodiacKeyFromLongitude(lon),
    el: elementOf(zodiacKeyFromLongitude(lon)),
  };
}

export function buildHouseCuspObservationReport(
  chart: AstroChartWheelData | null,
  chartKind: ChartKindId = "natal",
  voiceStyleId: VoiceStyleIdZh = 1,
): HouseCuspObservationReport | null {
  if (!chart || !chart.houseCuspsLonDeg || chart.houseCuspsLonDeg.length !== 12) return null;
  const cusps = chart.houseCuspsLonDeg;
  const c1 = signAt(cusps, 0);
  const c2 = signAt(cusps, 1);
  const c4 = signAt(cusps, 3);
  const c6 = signAt(cusps, 5);
  const c7 = signAt(cusps, 6);
  const c8 = signAt(cusps, 7);
  const c10 = signAt(cusps, 9);

  const C = houseCuspCopyForChartKind(chartKind, voiceStyleId);
  const interfaceMode =
    c1.el === "water" || c1.el === "earth"
      ? C.interfaceMode.defensive
      : c1.el === "air"
        ? C.interfaceMode.semantic
        : C.interfaceMode.impulse;
  const transformMode =
    c8.el === "air" || c8.el === "fire"
      ? C.transformMode.expansive
      : c8.el === "water"
        ? C.transformMode.osmotic
        : C.transformMode.structural;
  const axisRisk =
    c1.el === c7.el
      ? C.axisRisk.sameElement
      : c1.el === "water" && c7.el === "earth"
        ? C.axisRisk.waterEarth
        : c1.el === "fire" && c7.el === "air"
          ? C.axisRisk.fireAir
          : C.axisRisk.default;
  const todayProtocol = C.todayProtocol[c7.el];
  const mcMode = C.mcMode[c10.el];

  return applyHouseCuspChartKindLayer(
    {
      statusLine: C.statusLine,
      answer: {
        happened: C.answer.happened,
        core: fillCopyTemplate(C.answer.coreTemplate, {
          interfaceMode,
          transformMode,
          c1: c1.text,
          c8: c8.text,
        }),
        risk: fillCopyTemplate(C.answer.riskTemplate, {
          c1: c1.text,
          c7: c7.text,
          axisRisk,
        }),
        today: fillCopyTemplate(C.answer.todayTemplate, { todayProtocol }),
      },
      pro: {
        asc: fillCopyTemplate(C.pro.ascTemplate, { c1: c1.text }),
        valueAxis: fillCopyTemplate(C.pro.valueAxisTemplate, { c2: c2.text, c8: c8.text }),
        mc: fillCopyTemplate(C.pro.mcTemplate, { c10: c10.text, mcMode }),
      },
      precision: {
        matrix: C.precision.matrix,
        anchors: [
          fillCopyTemplate(C.precision.anchorAsc, { c1: c1.text }),
          fillCopyTemplate(C.precision.anchorIc, { c4: c4.text }),
          fillCopyTemplate(C.precision.anchorDes, { c7: c7.text }),
          fillCopyTemplate(C.precision.anchorMc, { c10: c10.text, mcMode }),
        ],
        turns: [
          fillCopyTemplate(C.precision.turn6, { c6: c6.text }),
          fillCopyTemplate(C.precision.turn8, { c8: c8.text }),
        ],
      },
      actions: [
        fillCopyTemplate(C.actions.align7, { c1: c1.text, c7: c7.text }),
        fillCopyTemplate(C.actions.clean4, { c4: c4.text }),
        fillCopyTemplate(C.actions.release10, { c10: c10.text, mcMode }),
      ],
    },
    chartKind,
    voiceStyleId,
  );
}

