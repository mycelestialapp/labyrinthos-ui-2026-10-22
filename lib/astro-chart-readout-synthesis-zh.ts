import type { AstroAspectDatum, AstroChartWheelData, PlanetId } from "@/lib/astro-chart-wheel";
import { formatLongitudeInSignZh, houseNumberForLongitude } from "@/lib/astro-chart-wheel";
import { ZODIAC_CN } from "@/lib/natal-chart";
import type { ChartKindId } from "@/lib/astro-chart-kinds";
import { chartKindFromWheelMeta } from "@/lib/astro-eight-chart-view-copy-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import {
  readoutSynthesisAscMcLineVocal,
  readoutSynthesisFourthLineVocal,
  readoutSynthesisFrictionLinesVocal,
  readoutSynthesisMajorAspectLineVocal,
  readoutSynthesisMinorLineVocal,
  readoutSynthesisSunMarsLineVocal,
  readoutSynthesisSunMoonLineVocal,
  readoutSynthesisTailLineVocal,
} from "@/lib/astro-chart-readout-synthesis-body-voice-zh";

export type ChartReadoutSynthesisParams = {
  chart: AstroChartWheelData;
  /** 读数区是否展示合盘 Tab（案主盘 + 双人数据） */
  hasSynastryTab?: boolean;
  /**
   * 不传：使用内置 `getReadoutSynthesisKindFrameZh`。
   * 传入字符串（可含空串）：强制作为首段盘型框句（空串表示不展示框句）。
   */
  kindFrameZhOverride?: string;
  /** 声部 1 为默认；2–10 走综合结论分段成稿（见 astro-chart-readout-synthesis-body-voice-zh）。 */
  voiceStyleId?: VoiceStyleIdZh;
};

function findAspect(
  rows: AstroAspectDatum[],
  a: PlanetId,
  b: PlanetId,
  type: AstroAspectDatum["type"],
): AstroAspectDatum | null {
  return (
    rows.find((r) => ((r.a === a && r.b === b) || (r.a === b && r.b === a)) && r.type === type) ?? null
  );
}

function pickTightest<T extends { orbDeg: number }>(rows: T[] | undefined): T | null {
  if (!rows?.length) return null;
  return [...rows].sort((a, b) => a.orbDeg - b.orbDeg)[0] ?? null;
}

/** 综合结论首段「盘型框句」；声部成稿见 `astro-chart-readout-synthesis-frame-voice-zh`。 */
export function getReadoutSynthesisKindFrameZh(
  chartKindMetaId: string | undefined,
  hasSynastryTab: boolean,
): string {
  if (hasSynastryTab) {
    return "下面各 Tab 以案主本命为骨架；双人怎么咬合，请再点开「合盘」对照。";
  }
  switch (chartKindMetaId as ChartKindId | undefined) {
    case "transit":
      return "这是当前行运行星落成的盘面；与本命怎么交会，请点开「行运↔本命」。";
    case "ephemeris":
      return "这是指定时刻的盘内关系快照；若论长期底色，仍以出生盘为主。";
    case "secondary":
      return "这是次限推进下的盘面，看的是缓慢演变，不是单日吉凶。";
    case "tertiary":
      return "这是三限推进下的盘面，偏近期节律，别和终身定性混为一谈。";
    case "solar_return":
      return "这是日返盘：适合当作「这一年度」的侧重点提示。";
    case "lunar_return":
      return "这是月返盘：适合当作「这一小段」的情绪与起居提示。";
    case "synastry":
      return "当前为合盘模式：主轮是案主本命；双人相位与互落宫见「合盘」Tab。";
    default:
      return "";
  }
}

function luminaryWeight(id: PlanetId): number {
  if (id === "sun" || id === "moon") return 0;
  if (id === "mercury" || id === "venus" || id === "mars") return 1;
  return 2;
}

function pickPrimaryMajorAspect(aspects: AstroAspectDatum[]): AstroAspectDatum | null {
  if (!aspects.length) return null;
  const sorted = [...aspects].sort((a, b) => {
    const la = Math.min(luminaryWeight(a.a), luminaryWeight(a.b));
    const lb = Math.min(luminaryWeight(b.a), luminaryWeight(b.b));
    if (la !== lb) return la - lb;
    return a.orbDeg - b.orbDeg;
  });
  return sorted[0] ?? null;
}

/**
 * 星盘数据区「综合结论」：规则合成、可对读数核对；口吻对齐核心快照（口语收束，忌运维隐喻）。
 */
export function buildChartReadoutSynthesisZh(p: ChartReadoutSynthesisParams): string {
  const { chart, hasSynastryTab = false, kindFrameZhOverride, voiceStyleId: voiceStyleIdRaw } = p;
  const voice: VoiceStyleIdZh = voiceStyleIdRaw ?? 1;
  const cusps = chart.houseCuspsLonDeg;
  const kindResolved: ChartKindId = hasSynastryTab ? "synastry" : chartKindFromWheelMeta(chart);

  const sun = chart.planets.find((x) => x.id === "sun");
  const moon = chart.planets.find((x) => x.id === "moon");
  const mars = chart.planets.find((x) => x.id === "mars");

  const ascSign = formatLongitudeInSignZh(chart.ascLonDeg).signZh;
  const mcSign = formatLongitudeInSignZh(chart.mcLonDeg).signZh;

  const sunMarsConj = findAspect(chart.aspects ?? [], "sun", "mars", "conjunction");
  const sunHouse = sun ? houseNumberForLongitude(sun.lonDeg, cusps) : null;
  const marsHouse = mars ? houseNumberForLongitude(mars.lonDeg, cusps) : null;

  const parts: string[] = [];

  const frame =
    kindFrameZhOverride !== undefined
      ? kindFrameZhOverride
      : getReadoutSynthesisKindFrameZh(chart.chartKindMeta?.id, hasSynastryTab);
  if (frame) parts.push(frame);

  if (sunMarsConj && sun && mars) {
    const sunZh = ZODIAC_CN[sun.zodiac];
    const houseTail =
      sunHouse != null && marsHouse != null && sunHouse === marsHouse
        ? `第${sunHouse}宫`
        : sunHouse != null
          ? `太阳一侧贴近第${sunHouse}宫`
          : "";
    parts.push(
      readoutSynthesisSunMarsLineVocal(voice, kindResolved, {
        orb: sunMarsConj.orbDeg.toFixed(2),
        sunSignZh: sunZh,
        houseTail,
      }),
    );
  } else {
    const primary = pickPrimaryMajorAspect(chart.aspects ?? []);
    if (primary) {
      parts.push(readoutSynthesisMajorAspectLineVocal(voice, kindResolved, primary));
    } else if (sun && moon && sunHouse != null) {
      const moonHouse = houseNumberForLongitude(moon.lonDeg, cusps);
      parts.push(readoutSynthesisSunMoonLineVocal(voice, kindResolved, sunHouse, moonHouse));
    }
  }

  parts.push(readoutSynthesisAscMcLineVocal(voice, kindResolved, ascSign, mcSign));

  const angleMajor = chart.angleAspectsMajor ?? [];
  const friction = readoutSynthesisFrictionLinesVocal(voice, kindResolved, angleMajor);
  if (friction.length) {
    parts.push(friction.join(""));
  }

  const tightMinor = pickTightest(chart.minorAspects);
  if (tightMinor) {
    parts.push(readoutSynthesisMinorLineVocal(voice, kindResolved, tightMinor));
  }

  const fourthCusp = cusps[3];
  const fourthSign = fourthCusp !== undefined ? formatLongitudeInSignZh(fourthCusp).signZh : "第四宫";

  parts.push(readoutSynthesisFourthLineVocal(voice, kindResolved, fourthSign));

  const hasHardAngle = angleMajor.some((a) => a.type === "square" || a.type === "opposition");
  parts.push(
    readoutSynthesisTailLineVocal(voice, kindResolved, {
      sunMars: !!sunMarsConj,
      hasHardAngle,
      fourthSign,
    }),
  );

  return parts.filter(Boolean).join("");
}
