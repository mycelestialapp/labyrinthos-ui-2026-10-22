import { ZODIAC_KEYS, ZODIAC_CN, type ZodiacKey } from "./natal-chart";
import {
  SUN_BODY,
  SUN_TAGLINE,
  MOON_BODY,
  MOON_TAGLINE,
  RISING_BODY,
  RISING_TAGLINE,
  MIRROR_BODY,
} from "./natal-reading-instrument-bodies-zh";

/**
 * 「宇宙观测报告」语料知识库：与 `natal-reading-instrument-bodies-zh.ts` 同源。
 * 供 Hub 典籍页、检索或外接 RAG 使用；正文为两段式（共鸣层 + 空行 + 精密层）。
 */
export type NatalInstrumentLayerId = "sun" | "moon" | "rising" | "mirror";

export type NatalInstrumentKnowledgeArticle = {
  layer: NatalInstrumentLayerId;
  sign: ZodiacKey;
  signLabelZh: string;
  tagline: string;
  body: string;
};

export type NatalInstrumentKnowledgeSection = {
  id: NatalInstrumentLayerId;
  titleZh: string;
  subtitleEn: string;
  descriptionZh: string;
  articles: readonly NatalInstrumentKnowledgeArticle[];
};

/** 上升 ⇄ 下降（与 `natal-reading-full-zh` 组装一致） */
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

function buildArticles(
  layer: NatalInstrumentLayerId,
  bodies: Record<ZodiacKey, string>,
  taglines: Record<ZodiacKey, string>,
): NatalInstrumentKnowledgeArticle[] {
  return ZODIAC_KEYS.map((sign) => ({
    layer,
    sign,
    signLabelZh: ZODIAC_CN[sign],
    tagline: taglines[sign],
    body: bodies[sign],
  }));
}

function mirrorArticles(): NatalInstrumentKnowledgeArticle[] {
  return ZODIAC_KEYS.map((sign) => ({
    layer: "mirror",
    sign,
    signLabelZh: ZODIAC_CN[sign],
    tagline: `对位：下降${ZODIAC_CN[DESCENDANT[sign]]}`,
    body: MIRROR_BODY[sign],
  }));
}

export const NATAL_INSTRUMENT_KNOWLEDGE_SECTIONS: readonly NatalInstrumentKnowledgeSection[] = [
  {
    id: "sun",
    titleZh: "太阳 · 核心能源",
    subtitleEn: "SOLAR CORE",
    descriptionZh:
      "长期趋力与自尊轴：首段可单独摘要（与简读 `firstNarrativeBlock` 对齐），次段为定义 / 指令级精密层。",
    articles: buildArticles("sun", SUN_BODY, SUN_TAGLINE),
  },
  {
    id: "moon",
    titleZh: "月亮 · 内部环流",
    subtitleEn: "LUNAR CIRCUIT",
    descriptionZh: "情绪与内需带宽：观测点与调频语句与精密定义分层给出。",
    articles: buildArticles("moon", MOON_BODY, MOON_TAGLINE),
  },
  {
    id: "rising",
    titleZh: "上升 · 界面装甲",
    subtitleEn: "ASC INTERFACE",
    descriptionZh: "世界接入的第一层协议：外相策略、优劣势与界面定义。",
    articles: buildArticles("rising", RISING_BODY, RISING_TAGLINE),
  },
  {
    id: "mirror",
    titleZh: "关系镜像 · 补偿模块",
    subtitleEn: "RELATIONAL MIRROR",
    descriptionZh:
      "按上升星座索引（对应下降轴补偿语料，非按太阳或月亮）。",
    articles: mirrorArticles(),
  },
];
