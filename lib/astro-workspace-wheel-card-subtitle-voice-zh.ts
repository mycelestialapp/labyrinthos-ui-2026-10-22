/**
 * 工作台「轮盘」卡副标题：宫位制与主/次说明保持动态；盘型前缀按声部 2–10 成稿，声部 1 与 `wheelZoneSubtitleForKind` 一致。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";
import {
  WHEEL_ZONE_PREFIX_ZH,
  wheelZoneSubtitleForKind,
} from "@/lib/astro-eight-chart-view-copy-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const BASE_WHEEL_MAJOR_ZH =
  "下方开关可简化盘面；当前为仅主相位，次要相位线已禁用。右侧（宽屏）为星盘数据表。";
const BASE_WHEEL_MINOR_ZH =
  "下方开关可简化盘面；次要相位线仅在「主+次」排盘下与读数一致。右侧（宽屏）为星盘数据表。";

const WHEEL_PREFIX_VOICE_PATCH: Partial<
  Record<VoiceStyleIdZh, Partial<Record<ChartKindId, string>>>
> = {
  2: {
    synastry: "合盘时主轮仍是案主本命；双人那条去数据区「合盘」。",
    transit: "行运轮画的是当下天象；跟本命怎么碰上，看「行运↔本命」。",
    ephemeris: "时刻轮就是这一刻的盘面，别拉长到整辈子。",
    secondary: "次限轮跟着推进龄走，看这几年大走向。",
    tertiary: "三限轮跟短节律挂勾，就看几周这档子。",
    solar_return: "日返轮卡在当年太阳回到出生度那一下；太阳正传还在本命。",
    lunar_return: "月返轮对在当前搜到的月亮回归那一刻；起居心情配合本命看。",
  },
  3: {
    synastry: "合盘域｜轮面＝案主本命；双人几何→「合盘」。",
    transit: "行运域｜天象轮；与本命交会→「行运↔本命」。",
    ephemeris: "时刻域｜单锚切片轮。",
    secondary: "次限域｜推进龄·年过程轮。",
    tertiary: "三限域｜月节律·短窗轮。",
    solar_return: "日返域｜太阳回归瞬轮。",
    lunar_return: "月返域｜月回归瞬轮（当前检索命中）。",
  },
  4: {
    synastry: "双人篇：舞台上亮的是案主本命轮；对手戏去数据区「合盘」。",
    transit: "外景篇：行运轮是天象场次；跟本命对戏请看「行运↔本命」。",
    ephemeris: "定格篇：就这一刻的轮盘，别拉到全书。",
    secondary: "年景篇：次限轮慢推这几年。",
    tertiary: "近景篇：三限轮看几周走势。",
    solar_return: "季线篇：日返轮站在这一年的太阳门口。",
    lunar_return: "花絮篇：月返轮一小段起居心情。",
  },
  5: {
    synastry: "合盘｜主轮案主；双人→合盘。",
    transit: "行运｜天象；×本命→对照。",
    ephemeris: "时刻｜切片。",
    secondary: "次限｜年。",
    tertiary: "三限｜短窗。",
    solar_return: "日返｜瞬。",
    lunar_return: "月返｜瞬(检索)。",
  },
  6: {
    synastry: "观测对象：合盘轮面（案主本命）；双人样本→数据合盘。",
    transit: "观测对象：行运轮；交汇读行运↔本命。",
    ephemeris: "观测对象：时刻轮｜单锚。",
    secondary: "观测对象：次限轮｜推进龄。",
    tertiary: "观测对象：三限轮｜月节律。",
    solar_return: "观测对象：日返轮｜太阳回归瞬。",
    lunar_return: "观测对象：月返轮｜月回归瞬（检索）。",
  },
  7: {
    synastry: "合盘模式：主轮还是案主；俩人那块去「合盘」。",
    transit: "行运这张轮：天象怎么转；跟本命掐架看「行运↔本命」。",
    ephemeris: "就这一刻的轮，别讲到一辈子。",
    secondary: "次限这几年慢景在轮上。",
    tertiary: "三限这几周近景在轮上。",
    solar_return: "日返这一年门口那下的轮。",
    lunar_return: "月返这一小段搜到的轮。",
  },
  8: {
    synastry: "本卡轮面说明：合盘视图主轮为案主本命；双人材料见「合盘」。",
    transit: "本卡轮面说明：行运为天象轮；与本命交会见「行运↔本命」。",
    ephemeris: "本卡轮面说明：指定时刻盘面；不作终身定性。",
    secondary: "本卡轮面说明：次限对应推进龄之年尺度。",
    tertiary: "本卡轮面说明：三限对应月节律之短窗。",
    solar_return: "本卡轮面说明：日返对应当年太阳回归瞬间。",
    lunar_return: "本卡轮面说明：月返对应当前检索命中的月亮回归瞬间。",
  },
  9: {
    synastry: "【轮面】合盘｜主栏案主；双人栏「合盘」。",
    transit: "【轮面】行运｜对照栏「行运↔本命」。",
    ephemeris: "【轮面】时刻｜切片。",
    secondary: "【轮面】次限｜年景。",
    tertiary: "【轮面】三限｜近窗。",
    solar_return: "【轮面】日返｜年题瞬。",
    lunar_return: "【轮面】月返｜札记瞬。",
  },
  10: {
    synastry: "合盘:主=案主→合盘",
    transit: "行运:×本命→对照",
    ephemeris: "时刻:切片",
    secondary: "次限:年",
    tertiary: "三限:短窗",
    solar_return: "日返:瞬",
    lunar_return: "月返:瞬(搜)",
  },
};

export function chartWheelCardSubtitleVocal(
  kind: ChartKindId,
  params: { houseSystemZh: string | null; includeMinorAspects: boolean },
  voiceStyleId: VoiceStyleIdZh,
): string {
  const base = params.includeMinorAspects ? BASE_WHEEL_MINOR_ZH : BASE_WHEEL_MAJOR_ZH;
  const middle = (params.houseSystemZh ? `宫位制：${params.houseSystemZh}。` : "") + base;
  if (voiceStyleId === 1) return wheelZoneSubtitleForKind(kind, middle);
  const pre = WHEEL_PREFIX_VOICE_PATCH[voiceStyleId]?.[kind] ?? WHEEL_ZONE_PREFIX_ZH[kind];
  return pre ? `${pre}${middle}` : middle;
}
