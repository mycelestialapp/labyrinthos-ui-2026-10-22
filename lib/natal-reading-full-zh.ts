/**
 * 出生盘导出/金卡/工作台解读：统一走「重写版」组装（`natal-reading-rewrite-zh.ts`）。
 * 三主星星座 + 可选日/月宫位（来自瑞士星历盘面）；缺宫位时文案自动降级为「待标定」。
 */

import type { AstroLens } from "./astro-dossier-storage";
import type { NatalBig3 } from "./natal-chart";
import {
  buildAstroWorkspaceUnderstandRewriteMarkdown,
  buildNatalReadingRewriteCompactMarkdown,
  buildNatalReadingRewriteFullMarkdown,
  buildNatalReadingRewriteGoldCardMarkdown,
  NATAL_REWRITE_DISCLAIMER_ZH,
  NATAL_REWRITE_NOTICE_ZH,
  type NatalRewriteInput,
} from "./natal-reading-rewrite-zh";

export type NatalReadingFullOptions = {
  dateLine?: string;
  showCaseLine?: boolean;
  /** 1–12；来自本命盘宫头与日/月黄经 */
  sunHouse?: number;
  moonHouse?: number;
  houseSystemZh?: string;
  /** 工作台案卷「阅读角度」：分叉开篇与原始读数习惯句 */
  readingLens?: AstroLens;
};

function toRewriteInput(big3: NatalBig3, o: NatalReadingFullOptions = {}): NatalRewriteInput {
  return {
    big3,
    dateLine: o.dateLine,
    showCaseLine: o.showCaseLine,
    sunHouse: o.sunHouse,
    moonHouse: o.moonHouse,
    houseSystemZh: o.houseSystemZh,
    readingLens: o.readingLens,
  };
}

/** @deprecated 使用 NATAL_REWRITE_*；保留别名供旧 import */
export const NATAL_READING_NOTICE_ZH = NATAL_REWRITE_NOTICE_ZH;

export const NATAL_READING_DISCLAIMER_ZH = NATAL_REWRITE_DISCLAIMER_ZH;

/**
 * 完整出生盘 Markdown（重写版：导言 / 答案 / 专业 / 精密 / 手册 / 口径）
 */
export function buildNatalReadingFullMarkdown(big3: NatalBig3, options: NatalReadingFullOptions = {}): string {
  return buildNatalReadingRewriteFullMarkdown(toRewriteInput(big3, options));
}

/**
 * 精简版（约全文 1/3）：导言 + 答案 + 精密 + 手册 + 短口径
 */
export function buildNatalReadingCompactMarkdown(big3: NatalBig3, options: NatalReadingFullOptions = {}): string {
  return buildNatalReadingRewriteCompactMarkdown(toRewriteInput(big3, options));
}

/**
 * 金卡内嵌：核心快照骨架 + 短口径
 */
export function buildNatalReadingGoldCardMarkdown(big3: NatalBig3, options: NatalReadingFullOptions = {}): string {
  return buildNatalReadingRewriteGoldCardMarkdown(toRewriteInput(big3, options));
}

/**
 * 星历终端「短深度」：与全文同源，仅核心快照摘录
 */
export function buildAstroWorkspaceUnderstandMarkdown(
  big3: NatalBig3,
  options: NatalReadingFullOptions = {},
): string {
  return buildAstroWorkspaceUnderstandRewriteMarkdown(toRewriteInput(big3, options));
}
