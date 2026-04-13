/**
 * 五联观测·宫头：「本表在说什么」与矩阵标题，ChartKind × 声部 × 10 套成稿。
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
  `本表在说什么：案主本命十二宫门槛各是什么脾气——从出场到钱、家、关系、事业。${SYNASTRY_NOTE}`,
  `本表在说什么：先看案主十二宫头——每道门槛什么气质，从怎么上场到钱与关系。${SYNASTRY_NOTE}`,
  `本表在说什么：案主本命宫头＝十二间房的门口脾气——生活各场默认怎么接。${SYNASTRY_NOTE}`,
  `本表在说什么：把宫头当场景切换——案主从出场到事业各门的默认气氛。${SYNASTRY_NOTE}`,
  `本表在说什么：【案主宫头】十二门槛脾气总览。${SYNASTRY_NOTE}`,
  `本表在说什么：统计案主十二宫头分布——各生活场的接口气质。${SYNASTRY_NOTE}`,
  `本表在说什么：说白了，案主进钱、家、关系、工作各门时默认紧还是松——看宫头。${SYNASTRY_NOTE}`,
  `本表在说什么：宫头负荷图——案主生活各场的默认接口。${SYNASTRY_NOTE}`,
  `本表在说什么：像翻案主地图——宫头标出十二场的门槛戏。${SYNASTRY_NOTE}`,
  `本表在说什么：案主｜宫头＝十二道门槛脾气。${SYNASTRY_NOTE}`,
];
const SYN_M: V10 = [
  "场域路由映射：House Cusp Matrix（来源：案主本命十二宫宫头）",
  "宫头一览：House Cusp Matrix（数据：案主本命十二宫宫头）",
  "宫头矩阵：House Cusp Matrix（读数来源：案主本命十二宫宫头）",
  "宫头章节表：House Cusp Matrix（来源：案主本命十二宫宫头）",
  "【宫头矩阵】House Cusp Matrix（案主本命）",
  "宫头分布矩阵：House Cusp Matrix（来源：案主本命十二宫宫头）",
  "宫头蹲点表：House Cusp Matrix（案主本命十二宫宫头）",
  "宫头负荷矩阵：House Cusp Matrix（来源：案主本命十二宫宫头）",
  "宫头地图：House Cusp Matrix（来源：案主本命十二宫宫头）",
  "House Cusp Matrix｜案主本命宫头",
];

const TR_S: V10 = [
  "本表在说什么：按当前行运时刻切的十二宫头——此刻故事里钱、家、关系、事业各是什么脾气。",
  "本表在说什么：行运这一刻的十二道门槛——钱、家、关系、事业各场怎么接，对照本命。",
  "本表在说什么：行运宫头＝当下生活各门的默认气氛，不当终身判决。",
  "本表在说什么：此刻宫头写在哪些场上——行运镜头，本命是底色。",
  "本表在说什么：【行运宫头】十二门槛；对照本命。",
  "本表在说什么：从结构上看，行运十二宫头怎么切现场——回本命核对。",
  "本表在说什么：说白了，这一刻各生活门的脾气是什么——宫头先指路。",
  "本表在说什么：行运宫头短负荷——排日程，不改写人生脚本。",
  "本表在说什么：像当下这一章——宫头标出各场的门风。",
  "本表在说什么：行运｜宫头＝此刻十二门槛。",
];
const TR_M: V10 = [
  "场域路由映射：House Cusp Matrix（来源：行运盘十二宫宫头）",
  "宫头一览：House Cusp Matrix（数据：行运盘十二宫宫头）",
  "宫头矩阵：House Cusp Matrix（读数来源：行运盘十二宫宫头）",
  "宫头章节表：House Cusp Matrix（来源：行运盘十二宫宫头）",
  "【宫头矩阵】House Cusp Matrix（行运盘）",
  "宫头分布矩阵：House Cusp Matrix（来源：行运盘十二宫宫头）",
  "宫头蹲点表：House Cusp Matrix（行运盘十二宫宫头）",
  "宫头负荷矩阵：House Cusp Matrix（来源：行运盘十二宫宫头）",
  "宫头地图：House Cusp Matrix（来源：行运盘十二宫宫头）",
  "House Cusp Matrix｜行运盘宫头",
];

const EP_S: V10 = [
  "本表在说什么：该时刻下的十二宫头——这一刻钱、家、关系、事业各是什么接口。",
  "本表在说什么：时刻盘十二宫门槛——现场各场怎么接，不当终身标签。",
  "本表在说什么：这一刻宫头＝现场十二门的接口气质。",
  "本表在说什么：这一帧宫头最响的门是哪几扇——切片阅读。",
  "本表在说什么：【时刻宫头】十二接口。",
  "本表在说什么：该时刻宫头结构——事件级，不接人格判决书。",
  "本表在说什么：说白了，这一刻各生活门怎么开——看宫头。",
  "本表在说什么：现场宫头短负荷——判接口，不定终身。",
  "本表在说什么：像剧照——宫头标出当场各场门槛。",
  "本表在说什么：时刻盘｜宫头＝十二接口。",
];
const EP_M: V10 = [
  "场域路由映射：House Cusp Matrix（来源：时刻盘十二宫宫头）",
  "宫头一览：House Cusp Matrix（数据：时刻盘十二宫宫头）",
  "宫头矩阵：House Cusp Matrix（读数来源：时刻盘十二宫宫头）",
  "宫头章节表：House Cusp Matrix（来源：时刻盘十二宫宫头）",
  "【宫头矩阵】House Cusp Matrix（时刻盘）",
  "宫头分布矩阵：House Cusp Matrix（来源：时刻盘十二宫宫头）",
  "宫头蹲点表：House Cusp Matrix（时刻盘十二宫宫头）",
  "宫头负荷矩阵：House Cusp Matrix（来源：时刻盘十二宫宫头）",
  "宫头地图：House Cusp Matrix（来源：时刻盘十二宫宫头）",
  "House Cusp Matrix｜时刻盘宫头",
];

const SEC_S: V10 = [
  "本表在说什么：次限盘十二宫头——这一推进时刻下，生活各场的门槛气质。",
  "本表在说什么：次限宫头看年景——几年里各生活门默认怎么接。",
  "本表在说什么：年尺度宫头＝各场的慢变量门槛。",
  "本表在说什么：这几年宫头写在哪些场上——拆季、再拆周去读。",
  "本表在说什么：【次限宫头】年景十二门槛。",
  "本表在说什么：次限盘宫头——年景接口，要配日常拆解。",
  "本表在说什么：说白了，这几年各生活门什么脾气——次限宫头先画圈。",
  "本表在说什么：年尺度宫头慢负荷——阶段安排，不是每日指令。",
  "本表在说什么：像长篇——次限宫头标出几年里的各场门风。",
  "本表在说什么：次限｜宫头＝年景十二门槛。",
];
const SEC_M: V10 = [
  "场域路由映射：House Cusp Matrix（来源：次限盘十二宫宫头）",
  "宫头一览：House Cusp Matrix（数据：次限盘十二宫宫头）",
  "宫头矩阵：House Cusp Matrix（读数来源：次限盘十二宫宫头）",
  "宫头章节表：House Cusp Matrix（来源：次限盘十二宫宫头）",
  "【宫头矩阵】House Cusp Matrix（次限盘）",
  "宫头分布矩阵：House Cusp Matrix（来源：次限盘十二宫宫头）",
  "宫头蹲点表：House Cusp Matrix（次限盘十二宫宫头）",
  "宫头负荷矩阵：House Cusp Matrix（来源：次限盘十二宫宫头）",
  "宫头地图：House Cusp Matrix（来源：次限盘十二宫宫头）",
  "House Cusp Matrix｜次限盘宫头",
];

const TER_S: V10 = [
  "本表在说什么：三限盘十二宫头——这一小段日子里，各生活场的默认气氛。",
  "本表在说什么：三限宫头看几周——各生活门短窗脾气。",
  "本表在说什么：月尺度宫头＝这几周各场的门槛气氛。",
  "本表在说什么：这几周宫头最响的门——别写成十年结论。",
  "本表在说什么：【三限宫头】几周十二门槛。",
  "本表在说什么：三限盘宫头——月尺度接口，宜按周看。",
  "本表在说什么：说白了，这几周各场怎么接——看宫头。",
  "本表在说什么：几周宫头短负荷——排节奏，不是大运。",
  "本表在说什么：像中篇——三限宫头标出这几周各门。",
  "本表在说什么：三限｜宫头＝几周十二门槛。",
];
const TER_M: V10 = [
  "场域路由映射：House Cusp Matrix（来源：三限盘十二宫宫头）",
  "宫头一览：House Cusp Matrix（数据：三限盘十二宫宫头）",
  "宫头矩阵：House Cusp Matrix（读数来源：三限盘十二宫宫头）",
  "宫头章节表：House Cusp Matrix（来源：三限盘十二宫宫头）",
  "【宫头矩阵】House Cusp Matrix（三限盘）",
  "宫头分布矩阵：House Cusp Matrix（来源：三限盘十二宫宫头）",
  "宫头蹲点表：House Cusp Matrix（三限盘十二宫宫头）",
  "宫头负荷矩阵：House Cusp Matrix（来源：三限盘十二宫宫头）",
  "宫头地图：House Cusp Matrix（来源：三限盘十二宫宫头）",
  "House Cusp Matrix｜三限盘宫头",
];

const SOL_S: V10 = [
  "本表在说什么：日返十二宫头——这一年的生活各场「门槛脾气」。",
  "本表在说什么：日返宫头看全年——各生活门年度默认气氛。",
  "本表在说什么：年度宫头＝这一年十二场的接口气质。",
  "本表在说什么：这一年宫头写在哪些场上——日常仍要拆小。",
  "本表在说什么：【日返宫头】年度十二门槛。",
  "本表在说什么：日返盘宫头——年度接口，建议按季复核。",
  "本表在说什么：说白了，这一年各场怎么接——看宫头。",
  "本表在说什么：年度宫头主负荷——排全年节奏，不是单日指令。",
  "本表在说什么：像年度连载——日返宫头标出这一年的各门。",
  "本表在说什么：日返｜宫头＝年度十二门槛。",
];
const SOL_M: V10 = [
  "场域路由映射：House Cusp Matrix（来源：日返盘十二宫宫头）",
  "宫头一览：House Cusp Matrix（数据：日返盘十二宫宫头）",
  "宫头矩阵：House Cusp Matrix（读数来源：日返盘十二宫宫头）",
  "宫头章节表：House Cusp Matrix（来源：日返盘十二宫宫头）",
  "【宫头矩阵】House Cusp Matrix（日返盘）",
  "宫头分布矩阵：House Cusp Matrix（来源：日返盘十二宫宫头）",
  "宫头蹲点表：House Cusp Matrix（日返盘十二宫宫头）",
  "宫头负荷矩阵：House Cusp Matrix（来源：日返盘十二宫宫头）",
  "宫头地图：House Cusp Matrix（来源：日返盘十二宫宫头）",
  "House Cusp Matrix｜日返盘宫头",
];

const LUN_S: V10 = [
  "本表在说什么：月返十二宫头——这一小段各生活场的接口气氛。",
  "本表在说什么：月返宫头看短窗——各生活门这几天脾气。",
  "本表在说什么：短窗宫头＝这一小段十二场的门槛气氛。",
  "本表在说什么：这一小段宫头最响的门——别写成十年结论。",
  "本表在说什么：【月返宫头】短窗十二门槛。",
  "本表在说什么：月返盘宫头——短窗接口，宜按天微调。",
  "本表在说什么：说白了，这几天各场怎么接——看宫头。",
  "本表在说什么：短窗宫头情绪负荷——起居安排，不是命运判决。",
  "本表在说什么：像短篇——月返宫头标出这几天的各门。",
  "本表在说什么：月返｜宫头＝短窗十二门槛。",
];
const LUN_M: V10 = [
  "场域路由映射：House Cusp Matrix（来源：月返盘十二宫宫头）",
  "宫头一览：House Cusp Matrix（数据：月返盘十二宫宫头）",
  "宫头矩阵：House Cusp Matrix（读数来源：月返盘十二宫宫头）",
  "宫头章节表：House Cusp Matrix（来源：月返盘十二宫宫头）",
  "【宫头矩阵】House Cusp Matrix（月返盘）",
  "宫头分布矩阵：House Cusp Matrix（来源：月返盘十二宫宫头）",
  "宫头蹲点表：House Cusp Matrix（月返盘十二宫宫头）",
  "宫头负荷矩阵：House Cusp Matrix（来源：月返盘十二宫宫头）",
  "宫头地图：House Cusp Matrix（来源：月返盘十二宫宫头）",
  "House Cusp Matrix｜月返盘宫头",
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

export function houseFiveChartLayerStringsFor(
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh,
): { houseStatus?: string; houseMatrix?: string } {
  if (kind === "natal") return {};
  const row = BY_KIND[kind];
  return { houseStatus: pick(row.s, voiceStyleId), houseMatrix: pick(row.m, voiceStyleId) };
}
