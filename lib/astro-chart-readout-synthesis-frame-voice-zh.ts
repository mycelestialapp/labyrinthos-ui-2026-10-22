/**
 * 读数区「综合结论」首段盘型框句：声部 2–10 成稿；未命中或未覆盖场景回退 `getReadoutSynthesisKindFrameZh`。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { getReadoutSynthesisKindFrameZh } from "@/lib/astro-chart-readout-synthesis-zh";

export type ReadoutSynthesisFrameScenario =
  | "synastry_tab"
  | "natal"
  | "transit"
  | "ephemeris"
  | "secondary"
  | "tertiary"
  | "solar_return"
  | "lunar_return"
  | "synastry";

export function readoutSynthesisFrameScenario(
  chartKindMetaId: string | undefined,
  hasSynastryTab: boolean,
): ReadoutSynthesisFrameScenario {
  if (hasSynastryTab) return "synastry_tab";
  switch (chartKindMetaId as ChartKindId | undefined) {
    case "transit":
      return "transit";
    case "ephemeris":
      return "ephemeris";
    case "secondary":
      return "secondary";
    case "tertiary":
      return "tertiary";
    case "solar_return":
      return "solar_return";
    case "lunar_return":
      return "lunar_return";
    case "synastry":
      return "synastry";
    default:
      return "natal";
  }
}

const FRAME_VOICE_PATCH: Partial<
  Record<VoiceStyleIdZh, Partial<Record<ReadoutSynthesisFrameScenario, string>>>
> = {
  2: {
    synastry_tab: "底下这些 Tab 都以案主本命打底；俩人怎么咬合，点开「合盘」对照着看。",
    transit: "这是眼下的行运盘面；跟本命怎么交会，去「行运↔本命」那条里对。",
    ephemeris: "这是指定时刻的盘内快照；要谈长期底色，回到出生盘更稳。",
    secondary: "这是次限推进盘面，看的是慢慢变的那层，别当单日签文读。",
    tertiary: "这是三限盘面，偏最近几周的节奏，别跟一辈子定性糊一句。",
    solar_return: "这是日返盘，当作「这一年」的侧重提示就好。",
    lunar_return: "这是月返盘，当作「这一小段」的心情与起居提示就好。",
    synastry: "合盘模式：主轮还是案主本命；双人相位与互落宫在「合盘」Tab。",
  },
  3: {
    synastry_tab: "数据域｜各 Tab 骨架＝案主本命；双人样本→「合盘」。",
    transit: "行运域｜当下天象盘面；与本命交会→「行运↔本命」。",
    ephemeris: "时刻域｜瞬时切片；终身底色→出生盘。",
    secondary: "次限域｜年尺度演变；禁单日断言。",
    tertiary: "三限域｜短窗节律；禁终身混读。",
    solar_return: "日返域｜年度主题假设。",
    lunar_return: "月返域｜短周期起居/情绪假设。",
    synastry: "合盘域｜主轮案主；双人几何→「合盘」Tab。",
  },
  4: {
    synastry_tab: "这一屏的台词都以案主本命为主轴；双人对手戏，请移步「合盘」那场。",
    transit: "外景行运盘面在此；和本命怎么对戏，看「行运↔本命」那条支线。",
    ephemeris: "定格在某一瞬的盘面；人生全书还请回到出生盘那章。",
    secondary: "次限是年景慢推，别跟今天的日运剪在同一句。",
    tertiary: "三限是近景短推，别跟年景、全书粘成一锅。",
    solar_return: "日返像这一年的季线预告，太阳正传仍在出生盘。",
    lunar_return: "月返像一小段花絮，心情与家里事配合本命读。",
    synastry: "双人篇：主轮亮的是案主；对手戏在「合盘」Tab。",
  },
  5: {
    synastry_tab: "Tab骨架=案主；双人→合盘。",
    transit: "行运盘；×本命→对照Tab。",
    ephemeris: "时刻切片；终身→本命。",
    secondary: "次限；年尺度。",
    tertiary: "三限；短窗。",
    solar_return: "日返；年侧重。",
    lunar_return: "月返；短窗情绪/起居。",
    synastry: "合盘｜主轮案主→合盘Tab。",
  },
  6: {
    synastry_tab: "观测说明：各 Tab 以案主本命为参照系；双人几何请打开「合盘」。",
    transit: "观测对象：行运盘面；与本命交会请参阅「行运↔本命」。",
    ephemeris: "观测对象：指定时刻盘内快照；长期人格底色以出生盘为准。",
    secondary: "观测对象：次限推进结构；不作单日吉凶判定。",
    tertiary: "观测对象：三限短周期结构；不作终身定性替代。",
    solar_return: "观测对象：日返年度主题盘。",
    lunar_return: "观测对象：月返短周期盘（情绪与起居接口）。",
    synastry: "观测说明：合盘模式主轮为案主本命；双人材料见「合盘」Tab。",
  },
  7: {
    synastry_tab: "下面这些 Tab 都绕着案主本命转；俩人那块，点开「合盘」才齐活。",
    transit: "这是行运那张；跟本命咋掐，看「行运↔本命」。",
    ephemeris: "这是卡住某一瞬的盘；讲一辈子还得回到出生盘。",
    secondary: "次限看的是几年慢景，别跟今天明天绑死。",
    tertiary: "三限看的是几周近景，别跟一辈子糊一团。",
    solar_return: "日返是这一年的门口，太阳老故事还在本命。",
    lunar_return: "月返是一小段心情与家里事，月亮长线还在本命。",
    synastry: "合盘：主轮是案主；俩人戏份在「合盘」。",
  },
  8: {
    synastry_tab: "本区各 Tab 以案主本命为结构骨架；双人互动材料请参阅「合盘」。",
    transit: "本区为行运盘面；与本命交会请参阅「行运↔本命」。",
    ephemeris: "本区为指定时刻之盘内关系快照；长期定性建议以出生盘为主。",
    secondary: "本区为次限推进盘面，侧重缓慢演变，不宜作单日断言。",
    tertiary: "本区为三限推进盘面，侧重近期节律，不宜与终身定性混读。",
    solar_return: "本区为日返盘，可作为年度侧重点之提示。",
    lunar_return: "本区为月返盘，可作为短周期情绪与起居之提示。",
    synastry: "当前为合盘模式：主轮展示案主本命；双人相位与互落宫见「合盘」Tab。",
  },
  9: {
    synastry_tab: "【综合框】Tab骨架＝案主本命｜双人栏「合盘」。",
    transit: "【综合框】行运盘面｜对照栏「行运↔本命」。",
    ephemeris: "【综合框】时刻切片｜终身→出生盘。",
    secondary: "【综合框】次限｜年景连载。",
    tertiary: "【综合框】三限｜近窗短篇。",
    solar_return: "【综合框】日返｜年题提示。",
    lunar_return: "【综合框】月返｜札记提示。",
    synastry: "【综合框】合盘｜主栏案主｜双人栏「合盘」。",
  },
  10: {
    synastry_tab: "综合:骨架=案主→合盘",
    transit: "综合:行运→对照Tab",
    ephemeris: "综合:切片≠终身",
    secondary: "综合:次限=年",
    tertiary: "综合:三限=短窗",
    solar_return: "综合:日返=年",
    lunar_return: "综合:月返=短",
    synastry: "综合:合盘主=案主",
  },
};

export function readoutSynthesisKindFrameVocal(
  voiceStyleId: VoiceStyleIdZh,
  chartKindMetaId: string | undefined,
  hasSynastryTab: boolean,
): string {
  if (voiceStyleId === 1) {
    return getReadoutSynthesisKindFrameZh(chartKindMetaId, hasSynastryTab);
  }
  const scenario = readoutSynthesisFrameScenario(chartKindMetaId, hasSynastryTab);
  const hit = FRAME_VOICE_PATCH[voiceStyleId]?.[scenario];
  if (hit !== undefined) return hit;
  return getReadoutSynthesisKindFrameZh(chartKindMetaId, hasSynastryTab);
}
