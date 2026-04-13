/**
 * 五联观测·主相位：「本表在说什么」与矩阵标题，ChartKind × 声部 × 10 套成稿。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const SYNASTRY_NOTE = "（主轮为案主本命；双人咬合见合盘 Tab。）";

type V10 = readonly [string, string, string, string, string, string, string, string, string, string];

function pick(row: V10, voice: VoiceStyleIdZh): string {
  return row[voice - 1];
}

type KindNonNatal = Exclude<ChartKindId, "natal">;

const SYN_S: V10 = [
  `本表在说什么：案主本命里行星主线谁帮谁、谁顶谁——性格的「主剧情」。${SYNASTRY_NOTE}`,
  `本表在说什么：先看案主本命主相位——谁拉扯、谁托举，性格大戏的主轴在这儿。${SYNASTRY_NOTE}`,
  `本表在说什么：案主盘里主相位＝「谁跟谁在较劲、谁跟谁互相帮忙」——读性格的抓手。${SYNASTRY_NOTE}`,
  `本表在说什么：把主相位当剧本主线——案主身上哪几组关系最带戏。${SYNASTRY_NOTE}`,
  `本表在说什么：【案主主相位】助攻/拆台清单（性格层）。${SYNASTRY_NOTE}`,
  `本表在说什么：统计主相位分布——案主性格张力与助力怎么分配。${SYNASTRY_NOTE}`,
  `本表在说什么：说白了，案主性格里谁帮谁、谁顶谁——看主相位就够入门。${SYNASTRY_NOTE}`,
  `本表在说什么：主相位负荷图——案主本命里结构级拉扯与支撑。${SYNASTRY_NOTE}`,
  `本表在说什么：像读案主长篇——主相位标出性格里反复出现的对台与援手。${SYNASTRY_NOTE}`,
  `本表在说什么：案主｜主相位＝性格主剧情。${SYNASTRY_NOTE}`,
];
const SYN_M: V10 = [
  "相位阵列观测：Aspect Matrix（来源：案主本命盘内主相位）",
  "主相位一览：Aspect Matrix（数据：案主本命盘内主相位）",
  "主相位矩阵：Aspect Matrix（读数来源：案主本命盘内主相位）",
  "主相位章节表：Aspect Matrix（来源：案主本命盘内主相位）",
  "【主相位矩阵】Aspect Matrix（案主本命盘）",
  "主相位分布矩阵：Aspect Matrix（来源：案主本命盘内主相位）",
  "主相位蹲点表：Aspect Matrix（案主本命盘内主相位）",
  "主相位负荷矩阵：Aspect Matrix（来源：案主本命盘内主相位）",
  "主相位地图：Aspect Matrix（来源：案主本命盘内主相位）",
  "Aspect Matrix｜案主本命主相位",
];

const TR_S: V10 = [
  "本表在说什么：此刻天空中行星谁跟谁在较劲、谁帮谁——行运盘的主线，用来对照本命。",
  "本表在说什么：这一张行运盘上，主相位先看谁拉扯、谁托举——对照本命，不当终身判决。",
  "本表在说什么：行运窗口里主相位＝当下天象的「主剧情」，记得对照本命地形。",
  "本表在说什么：此刻主相位写在哪些组合上——行运镜头，本命是底色。",
  "本表在说什么：【行运主相位】当下助攻/拆台；对照本命。",
  "本表在说什么：从结构上看，行运主相位怎么分配张力与助力——回本命核对。",
  "本表在说什么：说白了，这几天天象主相位最响的是哪几组——先指路再解释。",
  "本表在说什么：行运主相位短期负荷——安排节奏，不改写人生脚本。",
  "本表在说什么：像读当下这一章——主相位标出行运情节的筋。",
  "本表在说什么：行运｜主相位＝此刻主线；对照本命。",
];
const TR_M: V10 = [
  "相位阵列观测：Aspect Matrix（来源：行运盘内主相位）",
  "主相位一览：Aspect Matrix（数据：行运盘内主相位）",
  "主相位矩阵：Aspect Matrix（读数来源：行运盘内主相位）",
  "主相位章节表：Aspect Matrix（来源：行运盘内主相位）",
  "【主相位矩阵】Aspect Matrix（行运盘）",
  "主相位分布矩阵：Aspect Matrix（来源：行运盘内主相位）",
  "主相位蹲点表：Aspect Matrix（行运盘内主相位）",
  "主相位负荷矩阵：Aspect Matrix（来源：行运盘内主相位）",
  "主相位地图：Aspect Matrix（来源：行运盘内主相位）",
  "Aspect Matrix｜行运盘主相位",
];

const EP_S: V10 = [
  "本表在说什么：这一时刻盘内行星谁帮谁、谁顶谁——像当场力学，不当长期人格判决。",
  "本表在说什么：这一刻盘内主相位——谁拉扯、谁托举；现场切片，不当终身标签。",
  "本表在说什么：时刻盘主相位＝现场力学主线，只看这一帧。",
  "本表在说什么：这一帧里主相位最响的组合是哪几组——别扩成终身叙事。",
  "本表在说什么：【时刻主相位】现场对拉/助攻。",
  "本表在说什么：该时刻主相位结构——事件级，不接人格判决书。",
  "本表在说什么：说白了，这一刻主相位在吵什么、帮什么——先点名。",
  "本表在说什么：现场主相位短负荷——判接口，不定终身。",
  "本表在说什么：像剧照——时刻主相位标出当场张力与援手。",
  "本表在说什么：时刻盘｜主相位＝现场主线。",
];
const EP_M: V10 = [
  "相位阵列观测：Aspect Matrix（来源：时刻盘内主相位）",
  "主相位一览：Aspect Matrix（数据：时刻盘内主相位）",
  "主相位矩阵：Aspect Matrix（读数来源：时刻盘内主相位）",
  "主相位章节表：Aspect Matrix（来源：时刻盘内主相位）",
  "【主相位矩阵】Aspect Matrix（时刻盘）",
  "主相位分布矩阵：Aspect Matrix（来源：时刻盘内主相位）",
  "主相位蹲点表：Aspect Matrix（时刻盘内主相位）",
  "主相位负荷矩阵：Aspect Matrix（来源：时刻盘内主相位）",
  "主相位地图：Aspect Matrix（来源：时刻盘内主相位）",
  "Aspect Matrix｜时刻盘主相位",
];

const SEC_S: V10 = [
  "本表在说什么：次限盘上主相位——这几年结构级的主线在张力与助力之间怎么分配。",
  "本表在说什么：次限主相位看年景——谁几年里一直扯你、谁几年里一直托你。",
  "本表在说什么：年尺度主相位＝慢变量里的助攻与拆台。",
  "本表在说什么：这几年主相位写在哪些组合上——拆季、再拆周去读。",
  "本表在说什么：【次限主相位】年景结构线。",
  "本表在说什么：次限盘主相位分布——几年里的张力与助力，要配日常拆解。",
  "本表在说什么：说白了，这几年主相位最响的是哪几组——次限先画大圈。",
  "本表在说什么：年尺度主相位慢负荷——阶段目标，不是每日指令。",
  "本表在说什么：像读长篇——次限主相位标出几年里的筋。",
  "本表在说什么：次限｜主相位＝年景主线。",
];
const SEC_M: V10 = [
  "相位阵列观测：Aspect Matrix（来源：次限盘内主相位）",
  "主相位一览：Aspect Matrix（数据：次限盘内主相位）",
  "主相位矩阵：Aspect Matrix（读数来源：次限盘内主相位）",
  "主相位章节表：Aspect Matrix（来源：次限盘内主相位）",
  "【主相位矩阵】Aspect Matrix（次限盘）",
  "主相位分布矩阵：Aspect Matrix（来源：次限盘内主相位）",
  "主相位蹲点表：Aspect Matrix（次限盘内主相位）",
  "主相位负荷矩阵：Aspect Matrix（来源：次限盘内主相位）",
  "主相位地图：Aspect Matrix（来源：次限盘内主相位）",
  "Aspect Matrix｜次限盘主相位",
];

const TER_S: V10 = [
  "本表在说什么：三限主相位——这几个月里，哪几组关系最容易带着你走。",
  "本表在说什么：三限主相位看几周——谁拉扯、谁托举，短窗主线。",
  "本表在说什么：月尺度主相位＝这几周的情节筋。",
  "本表在说什么：这几周主相位最响的组合——别写成十年结论。",
  "本表在说什么：【三限主相位】几周窗口主线。",
  "本表在说什么：三限盘主相位——月尺度张力与助力，宜按周看。",
  "本表在说什么：说白了，这几周主相位在吵什么、帮什么。",
  "本表在说什么：几周主相位短负荷——排节奏，不是大运。",
  "本表在说什么：像中篇——三限主相位标出这几章。",
  "本表在说什么：三限｜主相位＝几周主线。",
];
const TER_M: V10 = [
  "相位阵列观测：Aspect Matrix（来源：三限盘内主相位）",
  "主相位一览：Aspect Matrix（数据：三限盘内主相位）",
  "主相位矩阵：Aspect Matrix（读数来源：三限盘内主相位）",
  "主相位章节表：Aspect Matrix（来源：三限盘内主相位）",
  "【主相位矩阵】Aspect Matrix（三限盘）",
  "主相位分布矩阵：Aspect Matrix（来源：三限盘内主相位）",
  "主相位蹲点表：Aspect Matrix（三限盘内主相位）",
  "主相位负荷矩阵：Aspect Matrix（来源：三限盘内主相位）",
  "主相位地图：Aspect Matrix（来源：三限盘内主相位）",
  "Aspect Matrix｜三限盘主相位",
];

const SOL_S: V10 = [
  "本表在说什么：日返主相位——这一年度结构级的主旋律与拉扯点。",
  "本表在说什么：日返主相位看全年——谁一年里主拉扯、谁主托举。",
  "本表在说什么：年度主相位＝这一年里的结构筋。",
  "本表在说什么：这一年主相位写在哪些组合上——日常仍要拆小。",
  "本表在说什么：【日返主相位】年度主旋律。",
  "本表在说什么：日返盘主相位——年度张力与助力，建议按季复核。",
  "本表在说什么：说白了，这一年主相位最响的是哪几组。",
  "本表在说什么：年度主相位主负荷——排全年节奏，不是单日指令。",
  "本表在说什么：像年度连载——日返主相位标出这一年的幕。",
  "本表在说什么：日返｜主相位＝年度主线。",
];
const SOL_M: V10 = [
  "相位阵列观测：Aspect Matrix（来源：日返盘内主相位）",
  "主相位一览：Aspect Matrix（数据：日返盘内主相位）",
  "主相位矩阵：Aspect Matrix（读数来源：日返盘内主相位）",
  "主相位章节表：Aspect Matrix（来源：日返盘内主相位）",
  "【主相位矩阵】Aspect Matrix（日返盘）",
  "主相位分布矩阵：Aspect Matrix（来源：日返盘内主相位）",
  "主相位蹲点表：Aspect Matrix（日返盘内主相位）",
  "主相位负荷矩阵：Aspect Matrix（来源：日返盘内主相位）",
  "主相位地图：Aspect Matrix（来源：日返盘内主相位）",
  "Aspect Matrix｜日返盘主相位",
];

const LUN_S: V10 = [
  "本表在说什么：月返主相位——这一小段日子的背景张力与助攻，别当终身定调。",
  "本表在说什么：月返主相位看短窗——谁这几天拉扯、谁这几天托你。",
  "本表在说什么：短窗主相位＝这一小段的情节底色。",
  "本表在说什么：这一小段主相位最响的组合——别写成十年结论。",
  "本表在说什么：【月返主相位】短窗背景线。",
  "本表在说什么：月返盘主相位——短窗张力与助力，宜按天微调。",
  "本表在说什么：说白了，这几天主相位在吵什么、帮什么。",
  "本表在说什么：短窗主相位情绪负荷——安排起居，不是命运判决。",
  "本表在说什么：像短篇——月返主相位标出这几段。",
  "本表在说什么：月返｜主相位＝短窗主线。",
];
const LUN_M: V10 = [
  "相位阵列观测：Aspect Matrix（来源：月返盘内主相位）",
  "主相位一览：Aspect Matrix（数据：月返盘内主相位）",
  "主相位矩阵：Aspect Matrix（读数来源：月返盘内主相位）",
  "主相位章节表：Aspect Matrix（来源：月返盘内主相位）",
  "【主相位矩阵】Aspect Matrix（月返盘）",
  "主相位分布矩阵：Aspect Matrix（来源：月返盘内主相位）",
  "主相位蹲点表：Aspect Matrix（月返盘内主相位）",
  "主相位负荷矩阵：Aspect Matrix（来源：月返盘内主相位）",
  "主相位地图：Aspect Matrix（来源：月返盘内主相位）",
  "Aspect Matrix｜月返盘主相位",
];

const BY_KIND: Record<KindNonNatal, { s: V10; m: V10 }> = {
  synastry: { s: SYN_S, m: SYN_M },
  transit: { s: TR_S, m: TR_M },
  ephemeris: { s: EP_S, m: EP_M },
  secondary: { s: SEC_S, m: SEC_M },
  tertiary: { s: TER_S, m: TER_M },
  solar_return: { s: SOL_S, m: SOL_M },
  lunar_return: { s: LUN_S, m: LUN_M },
};

export function majorFiveChartLayerStringsFor(
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh,
): { majorStatus?: string; majorMatrix?: string } {
  if (kind === "natal") return {};
  const row = BY_KIND[kind];
  return { majorStatus: pick(row.s, voiceStyleId), majorMatrix: pick(row.m, voiceStyleId) };
}
