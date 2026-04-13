import {
  houseNumberForLongitude,
  PLANET_NAME_ZH,
  type AstroAspectDatum,
  type AstroChartWheelData,
  type AstroTransitNatalAspectDatum,
  type PlanetId,
} from "@/lib/astro-chart-wheel";
import { DEFAULT_ANSWER_ROUTING_CONFIG } from "@/lib/astro-answer-routing-config";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { fillTransitStr, transitRealtimeTplFor } from "@/lib/astro-transit-realtime-voice-zh";

type AnyAspect = AstroAspectDatum | AstroTransitNatalAspectDatum;

export type TransitRealtimeReport = {
  statusLine: string;
  answer: {
    happened: string;
    risk: string;
    synergy: string;
    today: string;
  };
  pro: {
    trigger: string;
    tension: string;
    expansion: string;
  };
  precision: {
    /** 本块读数在说什么（口径说明） */
    scopeLine: string;
    /** 哪一宫当下星体较集中，可与行星表对读 */
    houseFocusLine: string;
    aspects: [string, string, string];
  };
  actions: [string, string, string];
};

function isTransitNatalAspect(a: AnyAspect): a is AstroTransitNatalAspectDatum {
  return "transit" in a;
}

function aspectPlanetName(pid: PlanetId): string {
  return PLANET_NAME_ZH[pid] ?? pid;
}

function topHouse(chart: AstroChartWheelData): number {
  const c = new Map<number, number>();
  for (const p of chart.planets) {
    const h = houseNumberForLongitude(p.lonDeg, chart.houseCuspsLonDeg);
    c.set(h, (c.get(h) ?? 0) + 1);
  }
  return [...c.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 1;
}

function hardAspectCount(rows: AnyAspect[]): number {
  return rows.filter((a) => a.type === "square" || a.type === "opposition").length;
}

function tightest(rows: AnyAspect[], types?: Array<AnyAspect["type"]>): AnyAspect | null {
  const scoped = types ? rows.filter((r) => types.includes(r.type)) : rows;
  if (scoped.length === 0) return null;
  return [...scoped].sort((a, b) => a.orbDeg - b.orbDeg)[0] ?? null;
}

function formatAspect(a: AnyAspect): string {
  if (isTransitNatalAspect(a)) {
    return `${aspectPlanetName(a.transit)}-${aspectPlanetName(a.natal)}（${a.orbDeg.toFixed(2)}°）`;
  }
  return `${aspectPlanetName(a.a)}-${aspectPlanetName(a.b)}（${a.orbDeg.toFixed(2)}°）`;
}

/**
 * 行运盘专用：工作台「读数分层」内实时块。按声部取成稿模板（`astro-transit-realtime-voice-zh`）。
 */
export function buildTransitRealtimeReport(
  chart: AstroChartWheelData | null,
  voiceStyleId: VoiceStyleIdZh = 1,
): TransitRealtimeReport | null {
  if (!chart) return null;
  const houseKeywords = DEFAULT_ANSWER_ROUTING_CONFIG.houseKeywordMap;
  const h = topHouse(chart);
  const houseLabel = `${houseKeywords[h] ?? "核心议题"}（${h}宫）`;

  const majorRows: AnyAspect[] = [
    ...(chart.transitNatalAspects ?? []),
    ...chart.aspects,
    ...(chart.angleAspectsMajor?.map((x) => ({
      transit: x.planet,
      natal: x.axis === "asc" ? ("north_node" as PlanetId) : ("south_node" as PlanetId),
      type: x.type,
      angleDeg: x.angleDeg,
      exactDeg: x.exactDeg,
      orbDeg: x.orbDeg,
    })) ?? []),
  ];
  const hardCount = hardAspectCount(majorRows);
  const tightHard = tightest(majorRows, ["square", "opposition"]);
  const supportive = tightest(majorRows, ["sextile", "trine"]);
  const tiny = tightest([...(chart.transitNatalMinorAspects ?? []), ...(chart.minorAspects ?? [])]);

  const cluster = chart.planets
    .map((p) => ({ p, house: houseNumberForLongitude(p.lonDeg, chart.houseCuspsLonDeg) }))
    .filter((x) => x.house === h)
    .slice(0, 5)
    .map((x) => {
      const id = x.p.id;
      const short =
        id === "mercury"
          ? "Mer"
          : id === "jupiter"
            ? "Jup"
            : id === "saturn"
              ? "Sat"
              : id === "uranus"
                ? "Ura"
                : id === "neptune"
                  ? "Nep"
                  : id === "pluto"
                    ? "Plu"
                    : id === "venus"
                      ? "Ven"
                      : id === "mars"
                        ? "Mar"
                        : id === "moon"
                          ? "Moon"
                          : id === "sun"
                            ? "Sun"
                            : aspectPlanetName(id);
      return `${short}（${x.p.lonDeg.toFixed(2)}°）`;
    })
    .join("、");

  const reviewHours = hardCount >= 3 || (tightHard?.orbDeg ?? 9) <= 1 ? 12 : 6;
  const tightHardLine = tightHard ? formatAspect(tightHard) : "";
  const supportiveLine = supportive ? formatAspect(supportive) : "";
  const tinyLine = tiny ? formatAspect(tiny) : "";
  const ctx = {
    houseLabel,
    h,
    cluster,
    reviewHours: String(reviewHours),
    tightHardLine,
    supportiveLine,
    tinyLine,
  };
  const t = transitRealtimeTplFor(voiceStyleId);

  return {
    statusLine: fillTransitStr(t.statusLine, ctx),
    answer: {
      happened: fillTransitStr(t.happened, ctx),
      risk: tightHard ? fillTransitStr(t.riskHard, ctx) : t.riskSoft,
      synergy: supportive ? fillTransitStr(t.synergyYes, ctx) : t.synergyNo,
      today: fillTransitStr(t.today, ctx),
    },
    pro: {
      trigger: fillTransitStr(t.trigger, ctx),
      tension: tightHard ? fillTransitStr(t.tensionHard, ctx) : t.tensionSoft,
      expansion: supportive ? fillTransitStr(t.expansionYes, ctx) : t.expansionNo,
    },
    precision: {
      scopeLine: t.scopeLine,
      houseFocusLine: cluster
        ? fillTransitStr(t.houseFocusWithCluster, ctx)
        : fillTransitStr(t.houseFocusNoCluster, ctx),
      aspects: [
        tightHard ? fillTransitStr(t.aspMain, ctx) : t.aspMainEmpty,
        supportive ? fillTransitStr(t.aspHelp, ctx) : t.aspHelpEmpty,
        tiny ? fillTransitStr(t.aspTiny, ctx) : t.aspTinyEmpty,
      ],
    },
    actions: [t.action0, fillTransitStr(t.action1, ctx), t.action2],
  };
}
