/**
 * 星象简读全文：12 太阳 / 12 月亮 / 12 上升 / 12 关系镜像 + 动态元素 / 模式（基本·固定·变动）与组装。
 * 三主星与镜像正文为「宇宙观测报告」两段式，见 `natal-reading-instrument-bodies-zh.ts`；不替代医学/法律咨询。
 */

import { type NatalBig3, type ZodiacKey, ZODIAC_CN } from "./natal-chart";
import {
  WORKSPACE_SUN_CARD_ZH,
  WORKSPACE_MOON_CARD_ZH,
  WORKSPACE_RISING_CARD_ZH,
  WORKSPACE_MIRROR_LINE_ZH,
  descendantLabelZh,
} from "./astro-workspace-shortcards-zh";
import {
  type ElementKind,
  type ModalityKind,
  ELEMENT_TRIPLET_NARRATIVE,
  MODALITY_TRIPLET_NARRATIVE,
  elementModalityBridgeVariant,
  triadElementKey,
  triadModalityKey,
} from "./natal-reading-synthesis-zh";
import { firstNarrativeBlock, secondNarrativeBlock } from "./natal-reading-text-blocks";
import {
  SUN_BODY,
  SUN_TAGLINE,
  MOON_BODY,
  MOON_TAGLINE,
  RISING_BODY,
  RISING_TAGLINE,
  MIRROR_BODY,
} from "./natal-reading-instrument-bodies-zh";

type Element = "fire" | "earth" | "air" | "water";

function elementOf(key: ZodiacKey): Element {
  const f: ZodiacKey[] = ["ARIES", "LEO", "SAGITTARIUS"];
  const e: ZodiacKey[] = ["TAURUS", "VIRGO", "CAPRICORN"];
  const a: ZodiacKey[] = ["GEMINI", "LIBRA", "AQUARIUS"];
  if (f.includes(key)) return "fire";
  if (e.includes(key)) return "earth";
  if (a.includes(key)) return "air";
  return "water";
}

const ELEMENT_WORD: Record<Element, string> = {
  fire: "火象",
  earth: "土象",
  air: "风象",
  water: "水象",
};

/** 星座模式（与元素独立：谈「节奏/换挡」，不谈宫位细读） */
type Modality = "cardinal" | "fixed" | "mutable";

function modalityOf(key: ZodiacKey): Modality {
  const cardinal: ZodiacKey[] = ["ARIES", "CANCER", "LIBRA", "CAPRICORN"];
  const fixed: ZodiacKey[] = ["TAURUS", "LEO", "SCORPIO", "AQUARIUS"];
  if (cardinal.includes(key)) return "cardinal";
  if (fixed.includes(key)) return "fixed";
  return "mutable";
}

const MODALITY_WORD: Record<Modality, string> = {
  cardinal: "基本宫",
  fixed: "固定宫",
  mutable: "变动宫",
};

function elementModalityLabel(key: ZodiacKey): string {
  return `${ELEMENT_WORD[elementOf(key)]}·${MODALITY_WORD[modalityOf(key)]}`;
}

/** 上升 ⇄ 下降（对宫） */
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

/** 固定块：读前须知（Markdown） */
export const NATAL_READING_NOTICE_ZH = `## 观测协议（约 30 秒）

这是一份出生时刻的**几何读数**，不是预言脚本。

判读仅拆解三轴：**↑ 上升（界面装甲）/ ☽ 月亮（内部环流）/ ☉ 太阳（核心能源）**。

每轴附带**元素**与**模式（基本宫 / 固定宫 / 变动宫）**，用于识别节奏与换挡策略。

输出用于自检与关系协商，不替代医学、法律与心理专业判断。`;

/** 金卡 / 移动端默认：极短读前 */
const NATAL_READING_NOTICE_COMPACT = `## 观测协议

几何读数，不是预言。只看三轴：**↑ 出场接口 / ☽ 情绪环流 / ☉ 长期能源**。`;

/** 金卡默认：极短口径 */
const NATAL_READING_DISCLAIMER_COMPACT = `## 五、口径

热带黄道（回归黄道）；上升轴高敏感于出生时间地点；星图是地图，不是判决书。`;

/** 五、口径说明（全局固定） */
export const NATAL_READING_DISCLAIMER_ZH = `## 五、口径

- **黄道**：热带黄道（回归黄道）。与恒星盘、印度盘非同一口径，禁止混读。  
- **误差**：上升 / 下降轴对出生时辰与经纬高度敏感；时间偏差将优先污染该轴。  
- **原则**：**星图是地图，不是判决书**。`;

function sectionOneCompact(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  return `## 一、三主星（速览）

### ☉ 太阳·${ZODIAC_CN[s]}（${elementModalityLabel(s)}）｜${SUN_TAGLINE[s]}

${firstNarrativeBlock(SUN_BODY[s])}

### ☽ 月亮·${ZODIAC_CN[m]}（${elementModalityLabel(m)}）｜${MOON_TAGLINE[m]}

${firstNarrativeBlock(MOON_BODY[m])}

### ↑ 上升·${ZODIAC_CN[r]}（${elementModalityLabel(r)}）｜${RISING_TAGLINE[r]}

${firstNarrativeBlock(RISING_BODY[r])}`;
}

function sectionTwoCompact(big3: NatalBig3): string {
  const r = big3.rising;
  const d = DESCENDANT[r];
  return `## 二、关系镜像：上升${ZODIAC_CN[r]} ⇄ 下降${ZODIAC_CN[d]}

${firstNarrativeBlock(MIRROR_BODY[r])}`;
}

function sectionThreeCompact(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  const es = elementOf(s) as ElementKind;
  const em = elementOf(m) as ElementKind;
  const er = elementOf(r) as ElementKind;
  const ek = triadElementKey(es, em, er);
  const ms = modalityOf(s) as ModalityKind;
  const mm = modalityOf(m) as ModalityKind;
  const mr = modalityOf(r) as ModalityKind;
  const mk = triadModalityKey(ms, mm, mr);
  const et =
    ELEMENT_TRIPLET_NARRATIVE[ek] ??
    `你的日、月、升元素组合较罕见，以第一节为准；张力可当资源慢慢用。`;
  const mt =
    MODALITY_TRIPLET_NARRATIVE[mk] ?? `你的模式三联以第一节为准；换挡比贴标签重要。`;
  const cnS = ZODIAC_CN[s];
  const cnM = ZODIAC_CN[m];
  const cnR = ZODIAC_CN[r];
  return `## 三、元素与模式（要点）

${et}

${mt}

**链序**：先${cnR}（界面）→ 再${cnM}（环流）→ 后${cnS}（能源认领）。`;
}

function sectionThirtyCompact(big3: NatalBig3): string {
  const r = big3.rising;
  const m = big3.moon;
  const s = big3.sun;
  return `## 四、三十日（各一条）

**1–10 天 · 升${ZODIAC_CN[r]}** ${secondNarrativeBlock(RISING_BODY[r])}

**11–20 天 · 月${ZODIAC_CN[m]}** ${secondNarrativeBlock(MOON_BODY[m])}

**21–30 天 · 日${ZODIAC_CN[s]}** ${secondNarrativeBlock(SUN_BODY[s])}`;
}

function sectionClosingCompact(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  const cnS = ZODIAC_CN[s];
  const cnM = ZODIAC_CN[m];
  const cnR = ZODIAC_CN[r];
  return `---

## 收尾

观测止于此。**☉${cnS} · ☽${cnM} · ↑${cnR}**｜${SUN_TAGLINE[s]} / ${MOON_TAGLINE[m]} / ${RISING_TAGLINE[r]}。判读用于自检与协议校准，不替代你还在进行的工程。`;
}

function sectionClosing(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  const cnS = ZODIAC_CN[s];
  const cnM = ZODIAC_CN[m];
  const cnR = ZODIAC_CN[r];
  return `---

## 收尾

三轴坐标：**☉${cnS}**（${SUN_TAGLINE[s]}）· **☽${cnM}**（${MOON_TAGLINE[m]}）· **↑${cnR}**（${RISING_TAGLINE[r]}）。以上为可读数快照；执行与命名仍归操作者。`;
}

function layerOsParagraph(big3: NatalBig3): string {
  const cnS = ZODIAC_CN[big3.sun];
  const cnM = ZODIAC_CN[big3.moon];
  const cnR = ZODIAC_CN[big3.rising];
  return `### 分层链序（同名三颗星）

操作协议：**↑${cnR}**（界面装甲）→ **☽${cnM}**（内部环流）→ **☉${cnS}**（核心能源）。链序为时序权重，非价值排序。`;
}

function sectionThree(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  const es = elementOf(s) as ElementKind;
  const em = elementOf(m) as ElementKind;
  const er = elementOf(r) as ElementKind;
  const ek = triadElementKey(es, em, er);
  const ms = modalityOf(s) as ModalityKind;
  const mm = modalityOf(m) as ModalityKind;
  const mr = modalityOf(r) as ModalityKind;
  const mk = triadModalityKey(ms, mm, mr);
  const et =
    ELEMENT_TRIPLET_NARRATIVE[ek] ??
    `你的日、月、升元素组合（${ek}）较罕见，以第一节三主星正文为准；张力可当作**待开发的资源**，不必急着消灭。`;
  const mt =
    MODALITY_TRIPLET_NARRATIVE[mk] ??
    `你的模式三联（${mk}）以第一节正文为准；换挡比贴标签重要。`;

  return `## 三、元素与模式速写 & 底层逻辑

第一节已写明各星的**元素 · 模式**与长文；此处不再重复列星座表，只读**三联怎么拧在一起**（手机阅读更短）。

### 元素三联张力（日 → 月 → 升）

${et}

### 模式三联张力（日 → 月 → 升）

${mt}

${elementModalityBridgeVariant(es, em, er)}

${layerOsParagraph(big3)}`;
}

function sectionThirty(big3: NatalBig3): string {
  const r = big3.rising;
  const m = big3.moon;
  const s = big3.sun;
  return `## 四、三十日（精密层摘录）

**第 1–10 天 · 上升${ZODIAC_CN[r]}**  
${secondNarrativeBlock(RISING_BODY[r])}

**第 11–20 天 · 月亮${ZODIAC_CN[m]}**  
${secondNarrativeBlock(MOON_BODY[m])}

**第 21–30 天 · 太阳${ZODIAC_CN[s]}**  
${secondNarrativeBlock(SUN_BODY[s])}`;
}

function sectionOne(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  return `## 一、三主星：三轴读数

### ☉ 太阳·${ZODIAC_CN[s]}（${elementModalityLabel(s)}）｜${SUN_TAGLINE[s]}

${SUN_BODY[s]}

### ☽ 月亮·${ZODIAC_CN[m]}（${elementModalityLabel(m)}）｜${MOON_TAGLINE[m]}

${MOON_BODY[m]}

### ↑ 上升·${ZODIAC_CN[r]}（${elementModalityLabel(r)}）｜${RISING_TAGLINE[r]}

${RISING_BODY[r]}`;
}

function sectionTwo(big3: NatalBig3): string {
  const r = big3.rising;
  const d = DESCENDANT[r];
  return `## 二、关系镜像：上升${ZODIAC_CN[r]} ⇄ 下降${ZODIAC_CN[d]}

${MIRROR_BODY[r]}`;
}

export type NatalReadingFullOptions = {
  /** 例如 2026.03.23 */
  dateLine?: string;
  /** 是否输出案例行 */
  showCaseLine?: boolean;
};

/**
 * 生成完整星象简读 Markdown（与 docs/NATAL_READING_FULL_EXAMPLE_ZH.md 同源风格）。
 */
export function buildNatalReadingFullMarkdown(big3: NatalBig3, options: NatalReadingFullOptions = {}): string {
  const { dateLine = "", showCaseLine = true } = options;
  const head = `# 星象简读报告

> **星图是地图，不是刑期。**
`;
  const caseLine = showCaseLine
    ? `\n**案例**：太阳${ZODIAC_CN[big3.sun]} · 月亮${ZODIAC_CN[big3.moon]} · 上升${ZODIAC_CN[big3.rising]}（下降${ZODIAC_CN[DESCENDANT[big3.rising]]}）${dateLine ? `  \n**日期**：${dateLine}` : ""}\n`
    : "";

  return [
    head,
    caseLine,
    "---\n",
    NATAL_READING_NOTICE_ZH,
    "\n---\n",
    sectionOne(big3),
    "\n---\n",
    sectionTwo(big3),
    "\n---\n",
    sectionThree(big3),
    "\n---\n",
    sectionThirty(big3),
    "\n---\n",
    NATAL_READING_DISCLAIMER_ZH,
    "\n",
    sectionClosing(big3),
    "\n",
  ].join("\n");
}

const GOLD_CARD_SLICE = "## 观测协议";

/**
 * 精简版全文：金卡 / 移动端默认；约为完整版的 **1/3～1/4** 字数。
 * 完整导师版见 `buildNatalReadingFullMarkdown`（导出、归档、将来「全文」开关可用）。
 */
export function buildNatalReadingCompactMarkdown(big3: NatalBig3): string {
  return [
    `# 星象简读（精简版）\n\n> **星图是地图，不是刑期。**\n`,
    "---\n",
    NATAL_READING_NOTICE_COMPACT,
    "\n---\n",
    sectionOneCompact(big3),
    "\n---\n",
    sectionTwoCompact(big3),
    "\n---\n",
    sectionThreeCompact(big3),
    "\n---\n",
    sectionThirtyCompact(big3),
    "\n---\n",
    NATAL_READING_DISCLAIMER_COMPACT,
    "\n",
    sectionClosingCompact(big3),
    "\n",
  ].join("\n");
}

/**
 * 身份金卡内嵌：默认使用**精简版**；从「观测协议」起切片，避免与卡片顶部符号行重复。
 */
export function buildNatalReadingGoldCardMarkdown(big3: NatalBig3): string {
  const full = buildNatalReadingCompactMarkdown(big3);
  const i = full.indexOf(GOLD_CARD_SLICE);
  const body = i >= 0 ? full.slice(i).trimStart() : full.trim();
  return `> **星图是地图，不是刑期。**\n\n${body}`;
}

/**
 * 星历终端右侧「怎么理解这张盘」：与全文同源，仅取各轴首段（共鸣层）；算法同源（热带黄道）。
 */
export function buildAstroWorkspaceUnderstandMarkdown(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  return `> **怎么读这一栏**：与本页长读、全文报告**同一套宇宙观测语料**；此处仅展示各轴**首段（共鸣层）**。算法：热带黄道。

## 先说一句

**☉ 太阳**：核心能源。**☽ 月亮**：内部环流。**↑ 上升**：界面装甲。以下为主文首段摘录。

---

## 太阳 · ${ZODIAC_CN[s]}

${WORKSPACE_SUN_CARD_ZH[s]}

---

## 月亮 · ${ZODIAC_CN[m]}

${WORKSPACE_MOON_CARD_ZH[m]}

---

## 上升 · ${ZODIAC_CN[r]}

${WORKSPACE_RISING_CARD_ZH[r]}

---

## 一对一 · 上升${ZODIAC_CN[r]} · 下降${descendantLabelZh(r)}

${WORKSPACE_MIRROR_LINE_ZH[r]}`;
}
