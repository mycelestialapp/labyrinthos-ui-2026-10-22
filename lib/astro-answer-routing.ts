import {
  houseNumberForLongitude,
  type AspectType,
  type AstroChartWheelData,
  type AstroTransitNatalAspectDatum,
  type PlanetId,
} from "@/lib/astro-chart-wheel";
import { DEFAULT_ANSWER_ROUTING_CONFIG, type AnswerRoutingConfig } from "@/lib/astro-answer-routing-config";

export type AnswerLayerItem = { label: string; body: string };

type AnyAspectLike =
  | { type: AspectType; orbDeg: number; a: PlanetId; b: PlanetId }
  | AstroTransitNatalAspectDatum;

function hasHardByPlanet(rows: AnyAspectLike[], planet: PlanetId): boolean {
  return rows.some((a) => {
    if (!(a.type === "square" || a.type === "opposition")) return false;
    return "a" in a ? a.a === planet || a.b === planet : a.transit === planet || a.natal === planet;
  });
}

export function buildAnswerLayerRouting({
  chart,
  topicDetail,
  config = DEFAULT_ANSWER_ROUTING_CONFIG,
}: {
  chart: AstroChartWheelData | null;
  topicDetail?: string;
  config?: AnswerRoutingConfig;
}): {
  items: AnswerLayerItem[];
  isSilentWindow: boolean;
  evidenceTagLine: string;
  humanSummary: string;
} {
  const primaryAspectRows = chart?.aspects ?? [];
  const transitAspectRows = chart?.transitNatalAspects ?? [];
  const minorAspectRows = [...(chart?.minorAspects ?? []), ...(chart?.transitNatalMinorAspects ?? [])];
  const tightPrimary = [...primaryAspectRows, ...transitAspectRows].filter((a) => a.orbDeg <= config.silentMode.tightOrbDeg);
  const triggerMajorCount = primaryAspectRows.length + transitAspectRows.length + (chart?.angleAspectsMajor?.length ?? 0);
  const triggerMinorCount = minorAspectRows.length + (chart?.angleAspectsMinor?.length ?? 0);
  const isSilentWindow = !!chart && triggerMajorCount <= config.silentMode.maxMajorTriggers && tightPrimary.length === 0;

  const houseFocusSummary = (() => {
    if (!chart) return config.messages.noChartData;
    const counts = new Map<number, number>();
    for (const p of chart.planets) {
      const h = houseNumberForLongitude(p.lonDeg, chart.houseCuspsLonDeg);
      counts.set(h, (counts.get(h) ?? 0) + 1);
    }
    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([house]) => `${house}宫（${config.houseKeywordMap[house] ?? "议题聚焦"}）`);
    return top.length > 0 ? top.join(" / ") : config.messages.noHouseFocus;
  })();

  const evidenceTagLine = (() => {
    if (!chart) return config.messages.noEvidenceData;
    const sample = [...primaryAspectRows, ...transitAspectRows]
      .sort((a, b) => a.orbDeg - b.orbDeg)
      .slice(0, config.evidence.sampleCount)
      .map((a) => `${config.aspectTypeLabel[a.type]} orb ${a.orbDeg.toFixed(2)}°`);
    if (sample.length === 0) return config.messages.noMajorAspect;
    const weight =
      tightPrimary.length >= config.evidence.weightThreshold.high
        ? "H"
        : tightPrimary.length >= config.evidence.weightThreshold.medium
          ? "M"
          : "L";
    return `证据标签：${sample.join("｜")}｜权重 ${weight}`;
  })();

  const dynamicInstruction = (() => {
    if (isSilentWindow) {
      return config.messages.silentDynamicInstruction;
    }
    const allRows: AnyAspectLike[] = [...primaryAspectRows, ...transitAspectRows];
    const priorities: PlanetId[] = ["moon", "mercury"];
    for (const pid of priorities) {
      if (hasHardByPlanet(allRows, pid) && config.dynamicInstructionByPlanetHardAspect[pid]) {
        return config.dynamicInstructionByPlanetHardAspect[pid]!;
      }
    }
    return config.fallbackInstruction;
  })();

  const humanSummary = isSilentWindow
    ? config.messages.humanSummarySilent
    : config.messages.humanSummaryTemplate.replace("{houseFocusSummary}", houseFocusSummary);

  const items: AnswerLayerItem[] = isSilentWindow
    ? [
        { label: config.messages.silentWindowLabel, body: config.messages.silentWindowBody },
        { label: "基线建议", body: config.messages.baselineBody },
        { label: "证据标签", body: evidenceTagLine },
      ]
    : [
        { label: "核心快照", body: config.messages.answerBodyTemplate.replace("{houseFocusSummary}", houseFocusSummary) },
        { label: "证据标签", body: evidenceTagLine },
        {
          label: "次要相位摘要",
          body:
            triggerMinorCount > 0
              ? config.messages.minorSummaryWithCountTemplate.replace("{count}", String(triggerMinorCount))
              : config.messages.minorSummaryWithoutCount,
        },
        { label: "动态指令", body: dynamicInstruction },
        ...(topicDetail?.trim() ? [{ label: "议题上下文", body: topicDetail.trim() }] : []),
      ];

  return { items, isSilentWindow, evidenceTagLine, humanSummary };
}
