/**
 * 星盘数据卡副标题：宫位制前缀保持动态；「盘型头句」按声部 2–10 成稿，声部 1 用 CHART_DATA_CARD_HEAD_ZH。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";
import { CHART_DATA_CARD_HEAD_ZH } from "@/lib/astro-eight-chart-view-copy-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const CHART_DATA_CARD_ASPECT_SUFFIX: Record<"major" | "minor", string> = {
  major: "行星落点、宫位、轴点与相位（仅主；与排盘容许度一致，可上下滑动查看）。",
  minor:
    "行星落点、宫位、轴点与相位（含次要；与排盘容许度一致，可上下滑动查看）。",
};

const CHART_DATA_CARD_HEAD_VOICE_PATCH: Partial<
  Record<VoiceStyleIdZh, Partial<Record<ChartKindId, string>>>
> = {
  2: {
    natal: "出生盘视图：",
    synastry: "合盘（主轮为案主本命）：双人相位与互落宫见本卡「合盘」Tab。",
    transit: "行运盘：当下天象落宫与盘内相位；与本命交会见「行运↔本命」Tab。",
    ephemeris: "时刻盘：指定瞬间的盘内快照；不接终身人格定性。",
    secondary: "次限盘：年尺度推进结构；不当单日吉凶签。",
    tertiary: "三限盘：月尺度推进结构；不当终身定调条。",
    solar_return: "日返盘：太阳回归当刻的年度主题；宜配合本命看全年侧重。",
    lunar_return: "月返盘：月亮回归当刻的短周期；宜配合本命看起居与情绪。",
  },
  3: {
    natal: "出生盘（数据域）：",
    synastry: "合盘域｜主轮＝案主本命；双人数据→「合盘」Tab。",
    transit: "行运域｜天象落宫+盘内相位；本命交会→「行运↔本命」。",
    ephemeris: "时刻域｜切片快照；禁终身定性。",
    secondary: "次限域｜年尺度；禁单日断言。",
    tertiary: "三限域｜月尺度；禁终身混句。",
    solar_return: "日返域｜年度主题瞬；联立本命。",
    lunar_return: "月返域｜短周期瞬；联立本命。",
  },
  4: {
    natal: "主角篇·出生盘：",
    synastry: "双人篇·主轮仍是案主本命；对手戏在「合盘」Tab。",
    transit: "外景篇·行运天象；与本命对戏在「行运↔本命」。",
    ephemeris: "定格篇·这一刻的盘；长篇人生回出生盘。",
    secondary: "年景篇·次限慢推；别跟日运剪在一起。",
    tertiary: "近景篇·三限短推；别跟年景、全书粘一句。",
    solar_return: "季线篇·日返年度门口；太阳正传还在本命。",
    lunar_return: "花絮篇·月返小段起居心情；月亮正传在本命。",
  },
  5: {
    natal: "出生盘：",
    synastry: "合盘｜主轮案主；双人→合盘 Tab。",
    transit: "行运｜天象+相位；×本命→对照 Tab。",
    ephemeris: "时刻｜切片；≠终身。",
    secondary: "次限｜年；≠日。",
    tertiary: "三限｜短窗；≠终身。",
    solar_return: "日返｜年题；联本命。",
    lunar_return: "月返｜短窗；联本命。",
  },
  6: {
    natal: "观测对象：出生盘｜",
    synastry: "观测对象：合盘（主轮案主）｜双人样本→合盘 Tab。",
    transit: "观测对象：行运盘｜交会样本→行运↔本命 Tab。",
    ephemeris: "观测对象：时刻盘｜单锚切片。",
    secondary: "观测对象：次限盘｜年过程。",
    tertiary: "观测对象：三限盘｜短过程。",
    solar_return: "观测对象：日返盘｜年主题假设。",
    lunar_return: "观测对象：月返盘｜短窗假设。",
  },
  7: {
    natal: "咱先看出生这张：",
    synastry: "合盘模式：主轮是案主；俩人那块点开「合盘」。",
    transit: "行运这张：外面咋落宫；跟本命咋掐，看「行运↔本命」。",
    ephemeris: "就这一刻的盘：别一口气讲到一辈子。",
    secondary: "次限这几年慢景：别跟今天明天绑死。",
    tertiary: "三限这几周近景：别跟几年一辈子糊一团。",
    solar_return: "日返这一年门口：太阳老故事还在本命。",
    lunar_return: "月返这一小段：心情家里事；月亮长线在本命。",
  },
  8: {
    natal: "本卡范围：出生盘｜",
    synastry: "本卡范围：合盘视图（主轮案主）；双人材料见「合盘」Tab。",
    transit: "本卡范围：行运盘；与本命交会请参阅「行运↔本命」Tab。",
    ephemeris: "本卡范围：指定时刻盘内快照；不作终身人格判定。",
    secondary: "本卡范围：次限年尺度结构；不作单日吉凶判定。",
    tertiary: "本卡范围：三限月尺度结构；不作终身定性替代。",
    solar_return: "本卡范围：日返年度主题盘；建议与本命联读。",
    lunar_return: "本卡范围：月返短周期盘；建议与本命联读起居与情绪。",
  },
  9: {
    natal: "【数据卡】出生盘｜",
    synastry: "【数据卡】合盘｜主栏案主；双人栏「合盘」。",
    transit: "【数据卡】行运｜对照栏「行运↔本命」。",
    ephemeris: "【数据卡】时刻｜切片特稿。",
    secondary: "【数据卡】次限｜年景连载。",
    tertiary: "【数据卡】三限｜近窗短篇。",
    solar_return: "【数据卡】日返｜年题栏。",
    lunar_return: "【数据卡】月返｜札记栏。",
  },
  10: {
    natal: "出生盘:",
    synastry: "合盘:主=案主→合盘Tab",
    transit: "行运:×本命→对照Tab",
    ephemeris: "时刻:切片",
    secondary: "次限:年",
    tertiary: "三限:短窗",
    solar_return: "日返:年",
    lunar_return: "月返:短",
  },
};

export function chartDataCardSubtitleVocal(
  kind: ChartKindId,
  params: { houseSystemZh: string | null; includeMinorAspects: boolean },
  voiceStyleId: VoiceStyleIdZh,
): string {
  const hs = params.houseSystemZh ? `宫位制：${params.houseSystemZh}。` : "";
  const aspectKey = params.includeMinorAspects ? "minor" : "major";
  const aspectPart = CHART_DATA_CARD_ASPECT_SUFFIX[aspectKey];
  const head =
    CHART_DATA_CARD_HEAD_VOICE_PATCH[voiceStyleId]?.[kind] ?? CHART_DATA_CARD_HEAD_ZH[kind];
  return `${hs}${head}${aspectPart}`;
}
