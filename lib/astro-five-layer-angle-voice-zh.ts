/**
 * 五联观测·轴点相位：「本表在说什么」与矩阵标题，ChartKind × 声部 × 10 套成稿。
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
  `本表在说什么：案主本命里，心里要的和社会名片是否错位。${SYNASTRY_NOTE}`,
  `本表在说什么：案主盘里星体碰上升、天顶——内心戏撞社会角色。${SYNASTRY_NOTE}`,
  `本表在说什么：轴点相位＝案主「怎么上场」对上「外面要你怎样」。${SYNASTRY_NOTE}`,
  `本表在说什么：把轴点当对台戏——案主心情与名片是否拧着。${SYNASTRY_NOTE}`,
  `本表在说什么：【案主轴点】内心 vs 名片。${SYNASTRY_NOTE}`,
  `本表在说什么：统计轴点张力——案主对外接口与情绪底色的错配。${SYNASTRY_NOTE}`,
  `本表在说什么：说白了，案主在外面要的和自己心里要的——轴点先指路。${SYNASTRY_NOTE}`,
  `本表在说什么：轴点负荷图——案主角色感与心情接口。${SYNASTRY_NOTE}`,
  `本表在说什么：像案主剧照——轴点标出「上场」与「抬头看」的拉扯。${SYNASTRY_NOTE}`,
  `本表在说什么：案主｜轴点＝心 vs 名片。${SYNASTRY_NOTE}`,
];
const SYN_M: V10 = [
  "轴点交互矩阵：Angles Aspect Matrix（来源：案主本命·星体与上升/天顶）",
  "轴点矩阵一览：Angles Aspect Matrix（数据：案主本命·星体与上升/天顶）",
  "轴点交互：Angles Aspect Matrix（读数来源：案主本命·星体与上升/天顶）",
  "轴点章节表：Angles Aspect Matrix（来源：案主本命·星体与上升/天顶）",
  "【轴点矩阵】Angles Aspect Matrix（案主本命）",
  "轴点分布矩阵：Angles Aspect Matrix（来源：案主本命·星体与上升/天顶）",
  "轴点蹲点表：Angles Aspect Matrix（案主本命·星体与上升/天顶）",
  "轴点负荷矩阵：Angles Aspect Matrix（来源：案主本命·星体与上升/天顶）",
  "轴点地图：Angles Aspect Matrix（来源：案主本命·星体与上升/天顶）",
  "Angles Aspect Matrix｜案主本命轴点",
];

const TR_S: V10 = [
  "本表在说什么：此刻天体怎么碰到你的上升、天顶——外面要你怎样，和当下心情是否拧着。",
  "本表在说什么：行运轴点——当下星体碰上升/天顶，对照本命读。",
  "本表在说什么：行运轴点相位＝此刻角色感与心情接口。",
  "本表在说什么：这一刻轴点最响的拉扯在哪——行运镜头。",
  "本表在说什么：【行运轴点】外 vs 心；对照本命。",
  "本表在说什么：从结构上看，行运轴点怎么定义当下接口。",
  "本表在说什么：说白了，这几天外面要的和你心里要的——轴点先对齐。",
  "本表在说什么：行运轴点短负荷——排现场，不改写终身脚本。",
  "本表在说什么：像当下剧照——行运轴点。",
  "本表在说什么：行运｜轴点＝外 vs 心。",
];
const TR_M: V10 = [
  "轴点交互矩阵：Angles Aspect Matrix（来源：行运盘·星体与上升/天顶）",
  "轴点矩阵一览：Angles Aspect Matrix（数据：行运盘·星体与上升/天顶）",
  "轴点交互：Angles Aspect Matrix（读数来源：行运盘·星体与上升/天顶）",
  "轴点章节表：Angles Aspect Matrix（来源：行运盘·星体与上升/天顶）",
  "【轴点矩阵】Angles Aspect Matrix（行运盘）",
  "轴点分布矩阵：Angles Aspect Matrix（来源：行运盘·星体与上升/天顶）",
  "轴点蹲点表：Angles Aspect Matrix（行运盘·星体与上升/天顶）",
  "轴点负荷矩阵：Angles Aspect Matrix（来源：行运盘·星体与上升/天顶）",
  "轴点地图：Angles Aspect Matrix（来源：行运盘·星体与上升/天顶）",
  "Angles Aspect Matrix｜行运盘轴点",
];

const EP_S: V10 = [
  "本表在说什么：这一刻星体与上升、天顶的关系——现场角色感与内心是否对齐。",
  "本表在说什么：时刻轴点——现场「要你怎样」与「你心里怎样」。",
  "本表在说什么：时刻轴点相位＝切片里的角色接口。",
  "本表在说什么：这一帧轴点最响处——不接终身结论。",
  "本表在说什么：【时刻轴点】现场对齐。",
  "本表在说什么：该时刻轴点结构——事件级。",
  "本表在说什么：说白了，这一刻轴点在拧什么。",
  "本表在说什么：现场轴点短负荷。",
  "本表在说什么：像剧照——时刻轴点。",
  "本表在说什么：时刻盘｜轴点＝现场接口。",
];
const EP_M: V10 = [
  "轴点交互矩阵：Angles Aspect Matrix（来源：时刻盘·星体与上升/天顶）",
  "轴点矩阵一览：Angles Aspect Matrix（数据：时刻盘·星体与上升/天顶）",
  "轴点交互：Angles Aspect Matrix（读数来源：时刻盘·星体与上升/天顶）",
  "轴点章节表：Angles Aspect Matrix（来源：时刻盘·星体与上升/天顶）",
  "【轴点矩阵】Angles Aspect Matrix（时刻盘）",
  "轴点分布矩阵：Angles Aspect Matrix（来源：时刻盘·星体与上升/天顶）",
  "轴点蹲点表：Angles Aspect Matrix（时刻盘·星体与上升/天顶）",
  "轴点负荷矩阵：Angles Aspect Matrix（来源：时刻盘·星体与上升/天顶）",
  "轴点地图：Angles Aspect Matrix（来源：时刻盘·星体与上升/天顶）",
  "Angles Aspect Matrix｜时刻盘轴点",
];

const SEC_S: V10 = [
  "本表在说什么：次限盘上星体与上升、天顶——这几年对外接口和心情是否容易拧着。",
  "本表在说什么：次限轴点——年尺度里角色与心情接口。",
  "本表在说什么：年尺度轴点相位＝几年里的「上场」与「抬头」。",
  "本表在说什么：这几年轴点写在哪些组合上。",
  "本表在说什么：【次限轴点】年景接口。",
  "本表在说什么：次限轴点——慢变量对位。",
  "本表在说什么：说白了，这几年外面要的和你心里要的。",
  "本表在说什么：年景轴点慢负荷。",
  "本表在说什么：像长篇——次限轴点。",
  "本表在说什么：次限｜轴点＝几年接口。",
];
const SEC_M: V10 = [
  "轴点交互矩阵：Angles Aspect Matrix（来源：次限盘·星体与上升/天顶）",
  "轴点矩阵一览：Angles Aspect Matrix（数据：次限盘·星体与上升/天顶）",
  "轴点交互：Angles Aspect Matrix（读数来源：次限盘·星体与上升/天顶）",
  "轴点章节表：Angles Aspect Matrix（来源：次限盘·星体与上升/天顶）",
  "【轴点矩阵】Angles Aspect Matrix（次限盘）",
  "轴点分布矩阵：Angles Aspect Matrix（来源：次限盘·星体与上升/天顶）",
  "轴点蹲点表：Angles Aspect Matrix（次限盘·星体与上升/天顶）",
  "轴点负荷矩阵：Angles Aspect Matrix（来源：次限盘·星体与上升/天顶）",
  "轴点地图：Angles Aspect Matrix（来源：次限盘·星体与上升/天顶）",
  "Angles Aspect Matrix｜次限盘轴点",
];

const TER_S: V10 = [
  "本表在说什么：三限盘上星体与轴点——近期对外形象与内心是否容易不同步。",
  "本表在说什么：三限轴点——几周里名片与心情。",
  "本表在说什么：月尺度轴点相位＝短窗接口。",
  "本表在说什么：这几周轴点最响处。",
  "本表在说什么：【三限轴点】几周接口。",
  "本表在说什么：三限轴点——按周读。",
  "本表在说什么：说白了，这几周外面与心里。",
  "本表在说什么：几周轴点短负荷。",
  "本表在说什么：像中篇——三限轴点。",
  "本表在说什么：三限｜轴点＝几周接口。",
];
const TER_M: V10 = [
  "轴点交互矩阵：Angles Aspect Matrix（来源：三限盘·星体与上升/天顶）",
  "轴点矩阵一览：Angles Aspect Matrix（数据：三限盘·星体与上升/天顶）",
  "轴点交互：Angles Aspect Matrix（读数来源：三限盘·星体与上升/天顶）",
  "轴点章节表：Angles Aspect Matrix（来源：三限盘·星体与上升/天顶）",
  "【轴点矩阵】Angles Aspect Matrix（三限盘）",
  "轴点分布矩阵：Angles Aspect Matrix（来源：三限盘·星体与上升/天顶）",
  "轴点蹲点表：Angles Aspect Matrix（三限盘·星体与上升/天顶）",
  "轴点负荷矩阵：Angles Aspect Matrix（来源：三限盘·星体与上升/天顶）",
  "轴点地图：Angles Aspect Matrix（来源：三限盘·星体与上升/天顶）",
  "Angles Aspect Matrix｜三限盘轴点",
];

const SOL_S: V10 = [
  "本表在说什么：日返盘上星体与上升、天顶——这一年对外名片与内心接口。",
  "本表在说什么：日返轴点——全年名片与心情大门。",
  "本表在说什么：年度轴点相位＝这一年的「上场」与「抬头」。",
  "本表在说什么：这一年轴点写在哪些组合上。",
  "本表在说什么：【日返轴点】年度接口。",
  "本表在说什么：日返轴点——按季复核。",
  "本表在说什么：说白了，这一年外面与心里。",
  "本表在说什么：年度轴点主负荷。",
  "本表在说什么：像年度连载——日返轴点。",
  "本表在说什么：日返｜轴点＝年度接口。",
];
const SOL_M: V10 = [
  "轴点交互矩阵：Angles Aspect Matrix（来源：日返盘·星体与上升/天顶）",
  "轴点矩阵一览：Angles Aspect Matrix（数据：日返盘·星体与上升/天顶）",
  "轴点交互：Angles Aspect Matrix（读数来源：日返盘·星体与上升/天顶）",
  "轴点章节表：Angles Aspect Matrix（来源：日返盘·星体与上升/天顶）",
  "【轴点矩阵】Angles Aspect Matrix（日返盘）",
  "轴点分布矩阵：Angles Aspect Matrix（来源：日返盘·星体与上升/天顶）",
  "轴点蹲点表：Angles Aspect Matrix（日返盘·星体与上升/天顶）",
  "轴点负荷矩阵：Angles Aspect Matrix（来源：日返盘·星体与上升/天顶）",
  "轴点地图：Angles Aspect Matrix（来源：日返盘·星体与上升/天顶）",
  "Angles Aspect Matrix｜日返盘轴点",
];

const LUN_S: V10 = [
  "本表在说什么：月返盘上星体与轴点——这一小段对外与内心是否容易拧着。",
  "本表在说什么：月返轴点——短窗名片与心情。",
  "本表在说什么：短窗轴点相位＝这几天的接口。",
  "本表在说什么：这一小段轴点最响处。",
  "本表在说什么：【月返轴点】短窗接口。",
  "本表在说什么：月返轴点——按天微调。",
  "本表在说什么：说白了，这几天外面与心里。",
  "本表在说什么：短窗轴点情绪负荷。",
  "本表在说什么：像短篇——月返轴点。",
  "本表在说什么：月返｜轴点＝短窗接口。",
];
const LUN_M: V10 = [
  "轴点交互矩阵：Angles Aspect Matrix（来源：月返盘·星体与上升/天顶）",
  "轴点矩阵一览：Angles Aspect Matrix（数据：月返盘·星体与上升/天顶）",
  "轴点交互：Angles Aspect Matrix（读数来源：月返盘·星体与上升/天顶）",
  "轴点章节表：Angles Aspect Matrix（来源：月返盘·星体与上升/天顶）",
  "【轴点矩阵】Angles Aspect Matrix（月返盘）",
  "轴点分布矩阵：Angles Aspect Matrix（来源：月返盘·星体与上升/天顶）",
  "轴点蹲点表：Angles Aspect Matrix（月返盘·星体与上升/天顶）",
  "轴点负荷矩阵：Angles Aspect Matrix（来源：月返盘·星体与上升/天顶）",
  "轴点地图：Angles Aspect Matrix（来源：月返盘·星体与上升/天顶）",
  "Angles Aspect Matrix｜月返盘轴点",
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

export function angleFiveChartLayerStringsFor(
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh,
): { angleStatus?: string; angleMatrix?: string } {
  if (kind === "natal") return {};
  const row = BY_KIND[kind];
  return { angleStatus: pick(row.s, voiceStyleId), angleMatrix: pick(row.m, voiceStyleId) };
}
