/**
 * 五联观测·次要相位：「本表在说什么」与矩阵标题，ChartKind × 声部 × 10 套成稿。
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
  `本表在说什么：案主本命里次要相位——小摩擦与小灵感，久了会塑形。${SYNASTRY_NOTE}`,
  `本表在说什么：案主盘里次要线——不砸场但磨人，久了改手感。${SYNASTRY_NOTE}`,
  `本表在说什么：次要相位＝案主性格里「鞋里的沙」——小别扭常从这里起。${SYNASTRY_NOTE}`,
  `本表在说什么：把次要相位当旁白——案主主线之外的小摩擦与小灵感。${SYNASTRY_NOTE}`,
  `本表在说什么：【案主次要相位】细线总览。${SYNASTRY_NOTE}`,
  `本表在说什么：统计次要相位——案主微观摩擦与补偿怎么分布。${SYNASTRY_NOTE}`,
  `本表在说什么：说白了，案主那些说不清的小别扭——次要相位常有关。${SYNASTRY_NOTE}`,
  `本表在说什么：次要相位细负荷——案主手感层的慢变量。${SYNASTRY_NOTE}`,
  `本表在说什么：像脚注——次要相位标出案主性格里的小回声。${SYNASTRY_NOTE}`,
  `本表在说什么：案主｜次要相位＝细线。${SYNASTRY_NOTE}`,
];
const SYN_M: V10 = [
  "微观阵列：Minor Aspect Analysis（来源：案主本命盘内次要相位）",
  "次要相位一览：Minor Aspect Analysis（数据：案主本命盘内次要相位）",
  "次要相位矩阵：Minor Aspect Analysis（读数来源：案主本命盘内次要相位）",
  "次要相位章节表：Minor Aspect Analysis（来源：案主本命盘内次要相位）",
  "【次要相位】Minor Aspect Analysis（案主本命盘）",
  "次要相位分布矩阵：Minor Aspect Analysis（来源：案主本命盘内次要相位）",
  "次要相位蹲点表：Minor Aspect Analysis（案主本命盘内次要相位）",
  "次要相位细矩阵：Minor Aspect Analysis（来源：案主本命盘内次要相位）",
  "次要相位地图：Minor Aspect Analysis（来源：案主本命盘内次要相位）",
  "Minor Aspect Analysis｜案主本命次要相位",
];

const TR_S: V10 = [
  "本表在说什么：行运盘里较细的次要相位——当下的小别扭和小灵感，动静不大也会染色。",
  "本表在说什么：行运次要线——当下磨人的细沙，对照本命读。",
  "本表在说什么：行运次要相位＝短窗手感，不当终身判决。",
  "本表在说什么：此刻次要相位写在哪些细线上——行运镜头。",
  "本表在说什么：【行运次要】细线；对照本命。",
  "本表在说什么：从结构上看，行运次要相位怎么染色当下判断。",
  "本表在说什么：说白了，这几天次要线在烦什么、帮什么。",
  "本表在说什么：行运次要细负荷——排感受，不改写脚本。",
  "本表在说什么：像当下旁白——次要相位标出短窗回声。",
  "本表在说什么：行运｜次要相位＝细线。",
];
const TR_M: V10 = [
  "微观阵列：Minor Aspect Analysis（来源：行运盘内次要相位）",
  "次要相位一览：Minor Aspect Analysis（数据：行运盘内次要相位）",
  "次要相位矩阵：Minor Aspect Analysis（读数来源：行运盘内次要相位）",
  "次要相位章节表：Minor Aspect Analysis（来源：行运盘内次要相位）",
  "【次要相位】Minor Aspect Analysis（行运盘）",
  "次要相位分布矩阵：Minor Aspect Analysis（来源：行运盘内次要相位）",
  "次要相位蹲点表：Minor Aspect Analysis（行运盘内次要相位）",
  "次要相位细矩阵：Minor Aspect Analysis（来源：行运盘内次要相位）",
  "次要相位地图：Minor Aspect Analysis（来源：行运盘内次要相位）",
  "Minor Aspect Analysis｜行运盘次要相位",
];

const EP_S: V10 = [
  "本表在说什么：时刻盘里的次要相位——细线提醒，别单独当大事结论。",
  "本表在说什么：这一刻次要线——现场小信号，不当终身标签。",
  "本表在说什么：时刻次要相位＝切片里的细摩擦/小灵感。",
  "本表在说什么：这一帧次要线最响处——别扩成终身叙事。",
  "本表在说什么：【时刻次要】细线。",
  "本表在说什么：该时刻次要相位——事件级提醒。",
  "本表在说什么：说白了，这一刻次要线在提示什么。",
  "本表在说什么：现场次要细负荷——辅助判断。",
  "本表在说什么：像剧照旁白——时刻次要线。",
  "本表在说什么：时刻盘｜次要相位＝细线。",
];
const EP_M: V10 = [
  "微观阵列：Minor Aspect Analysis（来源：时刻盘内次要相位）",
  "次要相位一览：Minor Aspect Analysis（数据：时刻盘内次要相位）",
  "次要相位矩阵：Minor Aspect Analysis（读数来源：时刻盘内次要相位）",
  "次要相位章节表：Minor Aspect Analysis（来源：时刻盘内次要相位）",
  "【次要相位】Minor Aspect Analysis（时刻盘）",
  "次要相位分布矩阵：Minor Aspect Analysis（来源：时刻盘内次要相位）",
  "次要相位蹲点表：Minor Aspect Analysis（时刻盘内次要相位）",
  "次要相位细矩阵：Minor Aspect Analysis（来源：时刻盘内次要相位）",
  "次要相位地图：Minor Aspect Analysis（来源：时刻盘内次要相位）",
  "Minor Aspect Analysis｜时刻盘次要相位",
];

const SEC_S: V10 = [
  "本表在说什么：次限盘次要相位——年尺度里的小事里藏着慢变量。",
  "本表在说什么：次限次要线——几年里的细沙，拆季看。",
  "本表在说什么：年尺度次要相位＝慢手感。",
  "本表在说什么：这几年次要线写在哪些组合上。",
  "本表在说什么：【次限次要】年景细线。",
  "本表在说什么：次限次要相位——慢变量样本。",
  "本表在说什么：说白了，这几年次要线在磨什么。",
  "本表在说什么：年景次要细负荷——阶段读。",
  "本表在说什么：像长篇脚注——次限次要线。",
  "本表在说什么：次限｜次要相位＝细线。",
];
const SEC_M: V10 = [
  "微观阵列：Minor Aspect Analysis（来源：次限盘内次要相位）",
  "次要相位一览：Minor Aspect Analysis（数据：次限盘内次要相位）",
  "次要相位矩阵：Minor Aspect Analysis（读数来源：次限盘内次要相位）",
  "次要相位章节表：Minor Aspect Analysis（来源：次限盘内次要相位）",
  "【次要相位】Minor Aspect Analysis（次限盘）",
  "次要相位分布矩阵：Minor Aspect Analysis（来源：次限盘内次要相位）",
  "次要相位蹲点表：Minor Aspect Analysis（次限盘内次要相位）",
  "次要相位细矩阵：Minor Aspect Analysis（来源：次限盘内次要相位）",
  "次要相位地图：Minor Aspect Analysis（来源：次限盘内次要相位）",
  "Minor Aspect Analysis｜次限盘次要相位",
];

const TER_S: V10 = [
  "本表在说什么：三限次要相位——月尺度里的小摩擦与小灵感。",
  "本表在说什么：三限次要线——几周里的细信号。",
  "本表在说什么：月尺度次要相位＝短窗手感。",
  "本表在说什么：这几周次要线最响处。",
  "本表在说什么：【三限次要】几周细线。",
  "本表在说什么：三限次要相位——按周读。",
  "本表在说什么：说白了，这几周次要线在提示什么。",
  "本表在说什么：几周次要细负荷。",
  "本表在说什么：像中篇脚注——三限次要线。",
  "本表在说什么：三限｜次要相位＝细线。",
];
const TER_M: V10 = [
  "微观阵列：Minor Aspect Analysis（来源：三限盘内次要相位）",
  "次要相位一览：Minor Aspect Analysis（数据：三限盘内次要相位）",
  "次要相位矩阵：Minor Aspect Analysis（读数来源：三限盘内次要相位）",
  "次要相位章节表：Minor Aspect Analysis（来源：三限盘内次要相位）",
  "【次要相位】Minor Aspect Analysis（三限盘）",
  "次要相位分布矩阵：Minor Aspect Analysis（来源：三限盘内次要相位）",
  "次要相位蹲点表：Minor Aspect Analysis（三限盘内次要相位）",
  "次要相位细矩阵：Minor Aspect Analysis（来源：三限盘内次要相位）",
  "次要相位地图：Minor Aspect Analysis（来源：三限盘内次要相位）",
  "Minor Aspect Analysis｜三限盘次要相位",
];

const SOL_S: V10 = [
  "本表在说什么：日返次要相位——年度主题里的小事与旁线。",
  "本表在说什么：日返次要线——全年里的细回声。",
  "本表在说什么：年度次要相位＝旁线手感。",
  "本表在说什么：这一年次要线写在哪些组合上。",
  "本表在说什么：【日返次要】年度旁线。",
  "本表在说什么：日返次要相位——按季看。",
  "本表在说什么：说白了，这一年次要线在染什么色。",
  "本表在说什么：年度次要细负荷。",
  "本表在说什么：像年度脚注——日返次要线。",
  "本表在说什么：日返｜次要相位＝旁线。",
];
const SOL_M: V10 = [
  "微观阵列：Minor Aspect Analysis（来源：日返盘内次要相位）",
  "次要相位一览：Minor Aspect Analysis（数据：日返盘内次要相位）",
  "次要相位矩阵：Minor Aspect Analysis（读数来源：日返盘内次要相位）",
  "次要相位章节表：Minor Aspect Analysis（来源：日返盘内次要相位）",
  "【次要相位】Minor Aspect Analysis（日返盘）",
  "次要相位分布矩阵：Minor Aspect Analysis（来源：日返盘内次要相位）",
  "次要相位蹲点表：Minor Aspect Analysis（日返盘内次要相位）",
  "次要相位细矩阵：Minor Aspect Analysis（来源：日返盘内次要相位）",
  "次要相位地图：Minor Aspect Analysis（来源：日返盘内次要相位）",
  "Minor Aspect Analysis｜日返盘次要相位",
];

const LUN_S: V10 = [
  "本表在说什么：月返次要相位——短窗口里的小信号。",
  "本表在说什么：月返次要线——这几天的细提醒。",
  "本表在说什么：短窗次要相位＝起居手感。",
  "本表在说什么：这一小段次要线最响处。",
  "本表在说什么：【月返次要】短窗细线。",
  "本表在说什么：月返次要相位——按天微调。",
  "本表在说什么：说白了，这几天次要线在嘀咕什么。",
  "本表在说什么：短窗次要细负荷。",
  "本表在说什么：像短篇脚注——月返次要线。",
  "本表在说什么：月返｜次要相位＝细线。",
];
const LUN_M: V10 = [
  "微观阵列：Minor Aspect Analysis（来源：月返盘内次要相位）",
  "次要相位一览：Minor Aspect Analysis（数据：月返盘内次要相位）",
  "次要相位矩阵：Minor Aspect Analysis（读数来源：月返盘内次要相位）",
  "次要相位章节表：Minor Aspect Analysis（来源：月返盘内次要相位）",
  "【次要相位】Minor Aspect Analysis（月返盘）",
  "次要相位分布矩阵：Minor Aspect Analysis（来源：月返盘内次要相位）",
  "次要相位蹲点表：Minor Aspect Analysis（月返盘内次要相位）",
  "次要相位细矩阵：Minor Aspect Analysis（来源：月返盘内次要相位）",
  "次要相位地图：Minor Aspect Analysis（来源：月返盘内次要相位）",
  "Minor Aspect Analysis｜月返盘次要相位",
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

export function minorFiveChartLayerStringsFor(
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh,
): { minorStatus?: string; minorMatrix?: string } {
  if (kind === "natal") return {};
  const row = BY_KIND[kind];
  return { minorStatus: pick(row.s, voiceStyleId), minorMatrix: pick(row.m, voiceStyleId) };
}
