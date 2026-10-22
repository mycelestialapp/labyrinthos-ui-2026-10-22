/**
 * 塔罗 19 大类选题目录。
 * 19 类均按框架铺开，不限 20；冻结核原文仍入 canonical。
 * 用户可见题干与日后解读：东西方共用场景，中文成稿，不夹外文；专名留给翻译层。
 * 隐身问按小类归到冻结核／框架原文，供手输逐字命中解读。
 */
import { DISPLAY_QUESTION_EXTRAS } from "./question-display-extras-zh";
import { TAROT_HIDDEN_ENRICH_BY_CATEGORY } from "./tarot-question-hidden-enrich-zh";
import { TAROT_HIDDEN_WAVE2_BY_CATEGORY } from "./tarot-question-hidden-wave2-zh";
import { TAROT_HIDDEN_CHAIN_BY_CATEGORY } from "./tarot-question-hidden-chain-zh";
import { normalizeQuestionTextZh } from "./question-text-normalize-zh";
import { tradToSimp } from "./zhTradToSimp";
import { MONEY_FRAMEWORK_GROUPS, MONEY_FROZEN_CANONICAL } from "./tarot-question-money-framework-zh";
import { STUDY_FRAMEWORK_GROUPS, STUDY_FROZEN_CANONICAL } from "./tarot-question-study-framework-zh";
import { HEALTH_FRAMEWORK_GROUPS, HEALTH_FROZEN_CANONICAL } from "./tarot-question-health-framework-zh";
import { CAREER_FRAMEWORK_GROUPS, CAREER_FROZEN_CANONICAL } from "./tarot-question-career-framework-zh";
import { LOVE_FRAMEWORK_GROUPS } from "./tarot-question-love-framework-zh";
import { PET_FRAMEWORK_GROUPS, PET_FROZEN_CANONICAL } from "./tarot-question-pet-framework-zh";
import { REL_FRAMEWORK_GROUPS, REL_FROZEN_CANONICAL } from "./tarot-question-rel-framework-zh";
import { CHILD_FRAMEWORK_GROUPS, CHILD_FROZEN_CANONICAL } from "./tarot-question-child-framework-zh";
import { CHOICE_FRAMEWORK_GROUPS, CHOICE_FROZEN_CANONICAL } from "./tarot-question-choice-framework-zh";
import { TRAVEL_FRAMEWORK_GROUPS, TRAVEL_FROZEN_CANONICAL } from "./tarot-question-travel-framework-zh";
import { LEGAL_FRAMEWORK_GROUPS, LEGAL_FROZEN_CANONICAL } from "./tarot-question-legal-framework-zh";
import { LOST_FRAMEWORK_GROUPS, LOST_FROZEN_CANONICAL } from "./tarot-question-lost-framework-zh";
import { DREAM_FRAMEWORK_GROUPS, DREAM_FROZEN_CANONICAL } from "./tarot-question-dream-framework-zh";
import { FENG_FRAMEWORK_GROUPS, FENG_FROZEN_CANONICAL } from "./tarot-question-feng-framework-zh";
import { PROXY_FRAMEWORK_GROUPS, PROXY_FROZEN_CANONICAL } from "./tarot-question-proxy-framework-zh";
import { SPIRIT_FRAMEWORK_GROUPS, SPIRIT_FROZEN_CANONICAL } from "./tarot-question-spirit-framework-zh";
import { OTHER_FRAMEWORK_GROUPS, OTHER_FROZEN_CANONICAL } from "./tarot-question-other-framework-zh";
import { PSY_FRAMEWORK_GROUPS, PSY_FROZEN_CANONICAL } from "./tarot-question-psy-framework-zh";
import { ADVICE_FRAMEWORK_GROUPS, ADVICE_FROZEN_CANONICAL } from "./tarot-question-advice-framework-zh";

export const TAROT_SURFACE_QUESTION_COUNT = 20;

export type TarotQuestionGroup = {
  label: string;
  /** 冻结核／入库原文（感情婚姻为全量框架题干） */
  surface: string[];
  keys: string[];
  /** 口语别名（不进入库键） */
  hidden: string[];
  /** 界面可点：surface + 口语别名，已去标点重复 */
  picks: string[];
  /** 西方框架：所属大类 */
  categoryId?: string;
};

export type TarotCategoryQuestionCatalog = {
  id: string;
  label: string;
  /** 解读入库题干（界面预设 + 感情全量框架键；隐身句不进这里） */
  canonical: string[];
  groups: TarotQuestionGroup[];
  /** 归一化后的隐身／标点／繁简 → 冻结原文 */
  aliasToCanonical: Record<string, string>;
};

function nn(s: string): string {
  return normalizeQuestionTextZh(tradToSimp(s));
}

export function expandQuestionFormsZh(raw: string): string[] {
  const s = tradToSimp((raw || "").trim());
  const out = new Set<string>();
  const add = (x: string) => {
    const t = x.trim();
    if (t) out.add(t);
  };
  add(raw);
  add(s);
  add(s.replace(/？/g, "?"));
  add(s.replace(/[？?]/g, ""));
  add(s.replace(/／/g, "/"));
  add(s.replace(/，/g, ","));
  add(s.replace(/～/g, "~"));
  add(s.replace(/～/g, "-"));
  add(s.replace(/／/g, "/").replace(/？/g, "?"));
  if (s.includes("他／她")) {
    add(s.replace(/他／她/g, "他"));
    add(s.replace(/他／她/g, "她"));
    add(s.replace(/他／她/g, "他/她"));
    add(s.replace(/他／她/g, "她/他"));
  }
  if (s.includes("他/她")) {
    add(s.replace(/他\/她/g, "他"));
    add(s.replace(/他\/她/g, "她"));
  }
  return [...out];
}

function overlapScore(input: string, target: string): number {
  const a = nn(input);
  const b = nn(target);
  if (!a || !b) return 0;
  if (a === b) return 1000;
  if (a.includes(b) || b.includes(a)) return 80 + Math.min(a.length, b.length);
  let hits = 0;
  for (let i = 0; i < b.length - 1; i++) {
    const g = b.slice(i, i + 2);
    if (g.length === 2 && a.includes(g)) hits += 1;
  }
  return hits;
}

function nearestCanonical(text: string, canonicals: readonly string[]): string {
  let best = canonicals[0] ?? text;
  let bestScore = -1;
  for (const c of canonicals) {
    const s = overlapScore(text, c);
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }
  return best;
}

function unique(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const q of list) {
    const t = q.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function uniqueByNorm(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const q of list) {
    const t = q.trim();
    if (!t) continue;
    const k = nn(t);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

function thickenSpoken(text: string): string[] {
  const core = text.replace(/[？?]+$/g, "").trim();
  if (core.length < 4) return [];
  const out = [
    `到底${core}？`,
    `现在${core}？`,
    `最近${core}？`,
    `${core}吗？`,
    `${core}还是怎样？`,
    `帮我看看：${core}？`,
    `直说：${core}？`,
    `我想问：${core}？`,
    `${core}，会怎样？`,
    `我很想知道，${core}？`,
    `老实讲，${core}？`,
    `这件事：${core}？`,
  ];
  if (!core.startsWith("该不该") && !core.includes("该不该")) {
    out.push(`该不该当成「${core}」来问？`);
  }
  if (core.includes("他") && !core.includes("她")) {
    out.push(text.replace(/他/g, "她"));
  }
  if (core.includes("她") && !core.includes("他／") && !core.includes("他/")) {
    out.push(text.replace(/她/g, "他"));
  }
  return out;
}

function thickenGroupHidden(groups: TarotQuestionGroup[], freezeKeys: readonly string[]): void {
  const freeze = new Set(freezeKeys.map(nn));
  for (const g of groups) {
    const seen = new Set([...g.surface, ...g.hidden].map(nn));
    const extra: string[] = [];
    const seeds = unique([...g.surface, ...g.hidden.filter((h) => freeze.has(nn(h)))]);
    for (const seed of seeds) {
      for (const v of thickenSpoken(seed)) {
        const k = nn(v);
        if (!k || seen.has(k)) continue;
        extra.push(v);
        seen.add(k);
      }
    }
    g.hidden.push(...extra);
  }
}

function absorbExtras(groups: TarotQuestionGroup[], extras: string[]): void {
  const shown = new Set(groups.flatMap((g) => g.surface).map(nn));
  const already = new Set(groups.flatMap((g) => g.hidden).map(nn));
  for (const raw of extras) {
    const t = raw.trim();
    if (!t) continue;
    const key = nn(t);
    if (shown.has(key) || already.has(key)) continue;
    let bestI = 0;
    let bestS = -1;
    groups.forEach((g, i) => {
      let s = 0;
      for (const k of g.keys) {
        const kn = nn(k);
        if (kn.length >= 2 && key.includes(kn)) s += kn.length + 2;
      }
      for (const sf of g.surface) s += overlapScore(t, sf) * 0.15;
      if (s > bestS) {
        bestS = s;
        bestI = i;
      }
    });
    const g = groups[bestI]!;
    if (!g.hidden.includes(t)) g.hidden.push(t);
    already.add(key);
  }
}

function mergeHiddenMaps(
  a: Record<string, string[]> = {},
  b: Record<string, string[]> = {},
): Record<string, string[]> {
  const out: Record<string, string[]> = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = [...(out[k] ?? []), ...v];
  }
  return out;
}

function attachHiddenByCanonical(
  groups: TarotQuestionGroup[],
  extraCanonical: readonly string[],
  enrich: Record<string, string[]>,
): Record<string, string> {
  const forced: Record<string, string> = {};
  const allCanon = unique([...groups.flatMap((g) => g.surface), ...extraCanonical]);
  for (const [canon, aliases] of Object.entries(enrich ?? {})) {
    const group =
      groups.find((g) => g.surface.includes(canon)) ??
      groups.find((g) => g.hidden.includes(canon)) ??
      groups.find((g) => extraCanonical.includes(canon) && g.surface.length === 0) ??
      groups[0];
    if (!group) continue;
    const seen = new Set(group.hidden.map(nn));
    seen.add(nn(canon));
    const pin = (alias: string) => {
      const t = alias.trim();
      if (!t) return;
      for (const form of [t, ...expandQuestionFormsZh(t)]) {
        const k = nn(form);
        if (k && !forced[k]) forced[k] = canon;
      }
    };
    pin(canon);
    for (const a of aliases) {
      const t = a.trim();
      if (!t || seen.has(nn(t))) continue;
      if (allCanon.some((c) => nn(c) === nn(t))) continue;
      group.hidden.push(t);
      seen.add(nn(t));
      pin(t);
    }
  }
  return forced;
}

function attachAutoForms(groups: TarotQuestionGroup[]): void {
  for (const g of groups) {
    const seen = new Set(g.hidden.map(nn));
    for (const sf of g.surface) {
      for (const form of expandQuestionFormsZh(sf)) {
        if (nn(form) === nn(sf) || seen.has(nn(form))) continue;
        g.hidden.push(form);
        seen.add(nn(form));
      }
    }
  }
}

function buildAliasMap(
  groups: TarotQuestionGroup[],
  canonical: readonly string[],
  forced: Record<string, string> = {},
): Record<string, string> {
  const map: Record<string, string> = {};
  const remember = (alias: string, target: string) => {
    for (const form of expandQuestionFormsZh(alias)) {
      const k = nn(form);
      if (k && !map[k]) map[k] = target;
    }
    const k0 = nn(alias);
    if (k0 && !map[k0]) map[k0] = target;
  };
  for (const c of canonical) remember(c, c);
  for (const [k, target] of Object.entries(forced)) {
    if (k && !map[k]) map[k] = target;
  }
  for (const g of groups) {
    const pool = g.surface.length ? g.surface : canonical;
    for (const sf of g.surface) remember(sf, sf);
    for (const h of g.hidden) {
      const hit = pool.find((c) => nn(c) === nn(h));
      const k = nn(h);
      remember(h, (k && map[k]) || hit || nearestCanonical(h, pool) || canonical[0] || h);
    }
  }
  return map;
}

function buildCat(
  id: string,
  label: string,
  groups: TarotQuestionGroup[],
  extraCanonical: readonly string[] = [],
): TarotCategoryQuestionCatalog {
  const surface = groups.flatMap((g) => g.surface);
  const canonical = unique([...surface, ...extraCanonical]);
  const forced = attachHiddenByCanonical(
    groups,
    extraCanonical,
    mergeHiddenMaps(
      mergeHiddenMaps(TAROT_HIDDEN_ENRICH_BY_CATEGORY[id], TAROT_HIDDEN_WAVE2_BY_CATEGORY[id]),
      TAROT_HIDDEN_CHAIN_BY_CATEGORY[id],
    ),
  );
  absorbExtras(groups, DISPLAY_QUESTION_EXTRAS[id] ?? []);
  thickenGroupHidden(groups, canonical);
  const aliasToCanonical = buildAliasMap(groups, canonical, forced);
  for (const g of groups) g.picks = uniqueByNorm([...g.surface, ...g.hidden]);
  return { id, label, canonical, groups, aliasToCanonical };
}

function g(label: string, keys: string[], surface: string[], hidden: string[] = []): TarotQuestionGroup {
  return { label, keys, surface, hidden, picks: [] };
}

const CATS: TarotCategoryQuestionCatalog[] = [
  buildCat(
    "感情婚姻",
    "感情婚姻",
    LOVE_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
  ),
  buildCat(
    "事业工作",
    "事业工作",
    CAREER_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    CAREER_FROZEN_CANONICAL,
  ),
  buildCat(
    "财运投资",
    "财运投资",
    MONEY_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    MONEY_FROZEN_CANONICAL,
  ),
  buildCat(
    "学业考试",
    "学业考试",
    STUDY_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    STUDY_FROZEN_CANONICAL,
  ),
  buildCat(
    "身体健康",
    "身体健康",
    HEALTH_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    HEALTH_FROZEN_CANONICAL,
  ),
  buildCat(
    "宠物",
    "宠物",
    PET_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    PET_FROZEN_CANONICAL,
  ),
  buildCat(
    "人际关系",
    "人际关系",
    REL_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    REL_FROZEN_CANONICAL,
  ),
  buildCat(
    "生育子女",
    "生育子女",
    CHILD_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    CHILD_FROZEN_CANONICAL,
  ),
  buildCat(
    "灵性成长",
    "灵性成长",
    SPIRIT_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    SPIRIT_FROZEN_CANONICAL,
  ),
  buildCat(
    "出行迁居",
    "出行迁居",
    TRAVEL_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    TRAVEL_FROZEN_CANONICAL,
  ),
  buildCat(
    "官司法律",
    "官司法律",
    LEGAL_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    LEGAL_FROZEN_CANONICAL,
  ),
  buildCat(
    "失物寻找",
    "失物寻找",
    LOST_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    LOST_FROZEN_CANONICAL,
  ),
  buildCat(
    "选择决策",
    "选择决策",
    CHOICE_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    CHOICE_FROZEN_CANONICAL,
  ),
  buildCat(
    "占梦境",
    "占梦境",
    DREAM_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    DREAM_FROZEN_CANONICAL,
  ),
  buildCat(
    "占风水",
    "占风水",
    FENG_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    FENG_FROZEN_CANONICAL,
  ),
  buildCat(
    "代人问卜",
    "代人问卜",
    PROXY_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    PROXY_FROZEN_CANONICAL,
  ),
  buildCat(
    "其他",
    "其他／综合",
    OTHER_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    OTHER_FROZEN_CANONICAL,
  ),
  buildCat(
    "心理疏导",
    "心理疏导",
    PSY_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    PSY_FROZEN_CANONICAL,
  ),
  buildCat(
    "人生建议",
    "人生建议",
    ADVICE_FRAMEWORK_GROUPS.map((row) => g(row.label, row.keys, [...row.surface])),
    ADVICE_FROZEN_CANONICAL,
  ),
];

function assertSurfaceCount(cat: TarotCategoryQuestionCatalog): void {
  const n = cat.groups.reduce((s, g) => s + g.surface.length, 0);
  if (n < TAROT_SURFACE_QUESTION_COUNT) {
    throw new Error(`[tarot-question-catalog] ${cat.id} surface=${n}, expected >= ${TAROT_SURFACE_QUESTION_COUNT}`);
  }
}

for (const c of CATS) assertSurfaceCount(c);

export const TAROT_QUESTION_CATALOG_19: TarotCategoryQuestionCatalog[] = CATS;

export const TAROT_QUESTION_CATALOG_BY_ID: Record<string, TarotCategoryQuestionCatalog> = Object.fromEntries(
  CATS.map((c) => [c.id, c]),
);

export function getTarotSurfaceQuestions(categoryId: string): string[] {
  const cat = TAROT_QUESTION_CATALOG_BY_ID[categoryId];
  return cat ? cat.groups.flatMap((g) => g.surface) : [];
}

export function getTarotQuestionGroups(categoryId: string): TarotQuestionGroup[] {
  return TAROT_QUESTION_CATALOG_BY_ID[categoryId]?.groups ?? [];
}
