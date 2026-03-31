/**
 * 星历终端右侧短卡：与 `natal-reading-instrument-bodies-zh` **同源**，仅取每条正文首段（共鸣层）。
 */
import { ZODIAC_KEYS, type ZodiacKey, ZODIAC_CN } from "./natal-chart";
import {
  SUN_BODY,
  MOON_BODY,
  RISING_BODY,
  MIRROR_BODY,
} from "./natal-reading-instrument-bodies-zh";
import { firstNarrativeBlock } from "./natal-reading-text-blocks";

/** 上升 → 下降（仅用于展示对轴） */
const DESCENDANT: Record<ZodiacKey, ZodiacKey> = {
  ARIES: "LIBRA",
  TAURUS: "SCORPIO",
  GEMINI: "SAGITTARIUS",
  CANCER: "CAPRICORN",
  LEO: "AQUARIUS",
  VIRGO: "PISCES",
  LIBRA: "ARIES",
  SCORPIO: "TAURUS",
  SAGITTARIUS: "GEMINI",
  CAPRICORN: "CANCER",
  AQUARIUS: "LEO",
  PISCES: "VIRGO",
};

function mapFirstBodies(bodies: Record<ZodiacKey, string>): Record<ZodiacKey, string> {
  return Object.fromEntries(
    ZODIAC_KEYS.map((k) => [k, firstNarrativeBlock(bodies[k])]),
  ) as Record<ZodiacKey, string>;
}

export const WORKSPACE_SUN_CARD_ZH = mapFirstBodies(SUN_BODY);

export const WORKSPACE_MOON_CARD_ZH = mapFirstBodies(MOON_BODY);

export const WORKSPACE_RISING_CARD_ZH = mapFirstBodies(RISING_BODY);

export const WORKSPACE_MIRROR_LINE_ZH = mapFirstBodies(MIRROR_BODY);

export function descendantForRising(rising: ZodiacKey): ZodiacKey {
  return DESCENDANT[rising];
}

export function descendantLabelZh(rising: ZodiacKey): string {
  return ZODIAC_CN[DESCENDANT[rising]];
}
