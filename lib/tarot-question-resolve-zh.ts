/**
 * 把用户手输／隐身问法归一到 19 类预设题干（冻结核逐字键）。
 * 标点、繁简、口语差几个字，仍落到同一句入库文案。
 */
import {
  expandQuestionFormsZh,
  TAROT_QUESTION_CATALOG_19,
  TAROT_QUESTION_CATALOG_BY_ID,
  type TarotCategoryQuestionCatalog,
} from "./tarot-question-catalog-19-zh";
import { normalizeQuestionTextZh } from "./question-text-normalize-zh";
import { tradToSimp } from "./zhTradToSimp";
import { getTarotFollowups } from "./tarot-question-intent-zh";
import { TAROT_FILTERS_BY_CATEGORY } from "./tarot-question-dir-by-category-zh";
import {
  TAROT_DIR_BY_CATEGORY_WESTERN,
  TAROT_WESTERN_CATALOG,
  TAROT_WESTERN_CATALOG_BY_ID,
  getTarotFollowupsWestern,
} from "./tarot-western";

export type TarotResolvedQuestion = {
  categoryId: string;
  canonical: string;
  groupLabel: string;
  exact: boolean;
};

export function nnTarotQuestion(s: string): string {
  return normalizeQuestionTextZh(tradToSimp(s));
}

function groupLabelFor(cat: TarotCategoryQuestionCatalog, canonical: string): string {
  const hit = cat.groups.find((g) => g.surface.includes(canonical) || g.hidden.some((h) => nnTarotQuestion(h) === nnTarotQuestion(canonical)));
  if (hit) return hit.label;
  const byAlias = cat.groups.find((g) => g.hidden.some((h) => cat.aliasToCanonical[nnTarotQuestion(h)] === canonical));
  return byAlias?.label ?? cat.groups[0]?.label ?? "";
}

function nearestInList(input: string, list: readonly string[]): { text: string; score: number } | null {
  const a = nnTarotQuestion(input);
  if (!a || !list.length) return null;
  let best = list[0];
  let bestScore = -1;
  for (const c of list) {
    const b = nnTarotQuestion(c);
    if (!b) continue;
    let s = 0;
    if (a === b) s = 1000;
    else if (a.includes(b) || b.includes(a)) s = 80 + Math.min(a.length, b.length);
    else {
      for (let i = 0; i < b.length - 1; i++) {
        const g = b.slice(i, i + 2);
        if (g.length === 2 && a.includes(g)) s += 1;
      }
    }
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }
  return best ? { text: best, score: bestScore } : null;
}

function scoreGroup(input: string, cat: TarotCategoryQuestionCatalog): { groupLabel: string; canonical: string; score: number } | null {
  const a = nnTarotQuestion(input);
  let bestLabel = cat.groups[0]?.label ?? "";
  let bestCanonical = cat.canonical[0] ?? input;
  let best = -1;
  for (const group of cat.groups) {
    let s = 0;
    for (const k of group.keys) {
      const kn = nnTarotQuestion(k);
      if (kn.length >= 2 && a.includes(kn)) s += kn.length + 3;
    }
    const pool = group.surface.length ? group.surface : cat.canonical;
    const near = nearestInList(input, pool);
    if (near) s += near.score * 0.25;
    if (s > best) {
      best = s;
      bestLabel = group.label;
      bestCanonical = near?.text ?? group.surface[0] ?? bestCanonical;
    }
  }
  if (best < 2) {
    const near = nearestInList(input, cat.canonical);
    if (!near || near.score < 4) return null;
    return { groupLabel: groupLabelFor(cat, near.text), canonical: near.text, score: near.score };
  }
  const pool = cat.groups.find((g) => g.label === bestLabel)?.surface ?? cat.canonical;
  const near = nearestInList(input, pool.length ? pool : cat.canonical) ?? nearestInList(input, cat.canonical);
  return { groupLabel: bestLabel, canonical: near?.text ?? bestCanonical, score: best };
}

function lookupExact(raw: string, categoryId?: string): TarotResolvedQuestion | null {
  const key = nnTarotQuestion(raw);
  if (!key) return null;
  const west = categoryId ? TAROT_WESTERN_CATALOG_BY_ID[categoryId] : undefined;
  if (west) {
    const canonical = west.aliasToCanonical[key];
    if (canonical) {
      return { categoryId: west.id, canonical, groupLabel: groupLabelFor(west, canonical), exact: true };
    }
  }
  const cats = categoryId && TAROT_QUESTION_CATALOG_BY_ID[categoryId]
    ? [TAROT_QUESTION_CATALOG_BY_ID[categoryId]!]
    : TAROT_QUESTION_CATALOG_19;
  for (const cat of cats) {
    const canonical = cat.aliasToCanonical[key];
    if (!canonical) continue;
    return { categoryId: cat.id, canonical, groupLabel: groupLabelFor(cat, canonical), exact: true };
  }
  if (categoryId) {
    for (const cat of TAROT_WESTERN_CATALOG) {
      const canonical = cat.aliasToCanonical[key];
      if (!canonical) continue;
      return { categoryId: cat.id, canonical, groupLabel: groupLabelFor(cat, canonical), exact: true };
    }
    for (const cat of TAROT_QUESTION_CATALOG_19) {
      const canonical = cat.aliasToCanonical[key];
      if (!canonical) continue;
      return { categoryId: cat.id, canonical, groupLabel: groupLabelFor(cat, canonical), exact: true };
    }
  }
  return null;
}

export function resolveTarotCanonicalQuestion(
  raw: string,
  categoryId?: string,
): TarotResolvedQuestion | null {
  const trimmed = (raw || "").trim();
  if (!trimmed) return null;
  const exact = lookupExact(trimmed, categoryId);
  if (exact) return exact;
  const chipCats = categoryId && TAROT_QUESTION_CATALOG_BY_ID[categoryId]
    ? [categoryId]
    : TAROT_QUESTION_CATALOG_19.map((c) => c.id);
  const qn = nnTarotQuestion(trimmed);
  for (const id of chipCats) {
    const chip = (getTarotFollowupsWestern(id).length ? getTarotFollowupsWestern(id) : getTarotFollowups(id)).find(
      (c) => nnTarotQuestion(c.label) === qn,
    );
    if (!chip) continue;
    const cat = TAROT_WESTERN_CATALOG_BY_ID[id] ?? TAROT_QUESTION_CATALOG_BY_ID[id];
    return {
      categoryId: id,
      canonical: chip.canonical,
      groupLabel: cat ? groupLabelFor(cat, chip.canonical) : "",
      exact: true,
    };
  }
  const catForScore =
    (categoryId && TAROT_WESTERN_CATALOG_BY_ID[categoryId]) ||
    (categoryId && TAROT_QUESTION_CATALOG_BY_ID[categoryId]);
  if (catForScore) {
    const scored = scoreGroup(trimmed, catForScore);
    if (scored) {
      return { categoryId, canonical: scored.canonical, groupLabel: scored.groupLabel, exact: false };
    }
  }
  let best: TarotResolvedQuestion | null = null;
  let bestScore = -1;
  for (const cat of TAROT_QUESTION_CATALOG_19) {
    const scored = scoreGroup(trimmed, cat);
    if (!scored || scored.score <= bestScore) continue;
    bestScore = scored.score;
    best = {
      categoryId: cat.id,
      canonical: scored.canonical,
      groupLabel: scored.groupLabel,
      exact: false,
    };
  }
  return bestScore >= 4 ? best : null;
}

/** 解读查找用：有命中则返回冻结核题干，否则原句 */
export function tarotQuestionKeyForReading(raw: string, categoryId?: string): string {
  return resolveTarotCanonicalQuestion(raw, categoryId)?.canonical ?? (raw || "").trim();
}

const TAB_TO_CATEGORY: Record<string, string> = {
  love: "感情婚姻",
  career: "事业工作",
  money: "财运投资",
  study: "学业考试",
  health: "身体健康",
  relation: "人际关系",
  child: "生育子女",
  choice: "选择决策",
  pet: "宠物",
  spirit: "灵性成长",
  travel: "出行迁居",
  legal: "官司法律",
  lost: "失物寻找",
  dream: "占梦境",
  fengshui: "占风水",
  proxy: "代人问卜",
  other: "其他",
  psyche: "心理疏导",
  advice: "人生建议",
};

export function emitTarotQuestionResolveIife(): string {
  const exactRows: Array<{ n: string; categoryId: string; canonical: string; groupLabel: string }> = [];
  const groupsById: Record<string, Array<{ label: string; categoryId?: string; surface: string[] }>> = {};
  for (const cat of TAROT_QUESTION_CATALOG_19) {
    groupsById[cat.id] = cat.groups
      .filter((g) => g.surface.length)
      .map((g) => ({ label: g.label, surface: [...g.surface] }));
    const seen = new Set<string>();
    for (const [n, canonical] of Object.entries(cat.aliasToCanonical)) {
      if (!n || seen.has(`${n}|${cat.id}`)) continue;
      seen.add(`${n}|${cat.id}`);
      exactRows.push({
        n,
        categoryId: cat.id,
        canonical,
        groupLabel: groupLabelFor(cat, canonical),
      });
    }
    for (const c of cat.canonical) {
      for (const form of expandQuestionFormsZh(c)) {
        const n = nnTarotQuestion(form);
        if (!n || seen.has(`${n}|${cat.id}`)) continue;
        seen.add(`${n}|${cat.id}`);
        exactRows.push({
          n,
          categoryId: cat.id,
          canonical: c,
          groupLabel: groupLabelFor(cat, c),
        });
      }
    }
    for (const chip of getTarotFollowups(cat.id)) {
      for (const form of [chip.label, chip.canonical, ...expandQuestionFormsZh(chip.label)]) {
        const n = nnTarotQuestion(form);
        if (!n || seen.has(`${n}|${cat.id}`)) continue;
        seen.add(`${n}|${cat.id}`);
        exactRows.push({
          n,
          categoryId: cat.id,
          canonical: chip.canonical,
          groupLabel: groupLabelFor(cat, chip.canonical),
        });
      }
    }
  }
  for (const cat of TAROT_WESTERN_CATALOG) {
    groupsById[cat.id] = cat.groups
      .filter((g) => g.surface.length)
      .map((g) => ({
        label: g.label,
        categoryId: g.categoryId ?? cat.id,
        surface: [...g.surface],
      }));
  }
  const followupsById: Record<string, Array<{ intent: string; label: string; canonical: string }>> = {};
  for (const cat of TAROT_QUESTION_CATALOG_19) {
    followupsById[cat.id] = getTarotFollowups(cat.id).map((c) => ({
      intent: c.intent,
      label: c.label,
      canonical: c.canonical,
    }));
  }
  for (const cat of TAROT_WESTERN_CATALOG) {
    const chips = getTarotFollowupsWestern(cat.id);
    if (chips.length) {
      followupsById[cat.id] = chips.map((c) => ({
        intent: c.intent,
        label: c.label,
        canonical: c.canonical,
      }));
    }
  }
  const filtersById = {
    ...TAROT_FILTERS_BY_CATEGORY,
    ...Object.fromEntries(
      Object.entries(TAROT_DIR_BY_CATEGORY_WESTERN).map(([id, row]) => [id, row.tabs]),
    ),
  };
  return `window.TarotQuestionResolve = (function(){
  var EXACT = ${JSON.stringify(exactRows)};
  var GROUPS = ${JSON.stringify(groupsById)};
  var FOLLOWUPS = ${JSON.stringify(followupsById)};
  var FILTERS = ${JSON.stringify(filtersById)};
  var TAB = ${JSON.stringify(TAB_TO_CATEGORY)};
  var map = Object.create(null);
  for (var i = 0; i < EXACT.length; i++) {
    var row = EXACT[i];
    if (!map[row.n]) map[row.n] = [];
    map[row.n].push(row);
  }
  function nn(s) {
    return String(s || "").trim().toLowerCase().replace(/\\s+/g, "").replace(/[，。！？、；：,.!?;:()（）【】\\[\\]'"“”‘’《》<>\\/\\\\|+-_=~\`@#$%^&*]/g, "");
  }
  function pick(raw, categoryId) {
    var list = map[nn(raw)] || [];
    if (!list.length) return null;
    if (categoryId) {
      for (var i = 0; i < list.length; i++) if (list[i].categoryId === categoryId) return list[i];
    }
    return list[0];
  }
  return {
    tabToCategory: function(tab) { return TAB[tab] || tab || ""; },
    groups: function(categoryId) { return GROUPS[categoryId] || []; },
    filters: function(categoryId) { return FILTERS[categoryId] || []; },
    followups: function(categoryId) { return FOLLOWUPS[categoryId] || []; },
    followupsFor: function(categoryId, question) {
      var groups = GROUPS[categoryId] || [];
      var hit = pick(question, categoryId);
      var canon = hit && hit.canonical ? hit.canonical : String(question || "").trim();
      var q = String(question || "").trim();
      var group = null;
      for (var i = 0; i < groups.length; i++) {
        var ss = groups[i].surface || [];
        for (var j = 0; j < ss.length; j++) {
          if (ss[j] === canon || ss[j] === q) { group = groups[i]; break; }
        }
        if (group) break;
      }
      if (!group) return [];
      var out = [];
      var seen = Object.create(null);
      (group.surface || []).forEach(function(s) {
        if (!s || s === canon || s === q || seen[s]) return;
        seen[s] = 1;
        out.push({ label: s, canonical: s });
      });
      return out;
    },
    resolve: function(raw, categoryId) { return pick(raw, categoryId); },
    canonicalForReading: function(raw, categoryId) {
      var hit = pick(raw, categoryId);
      return hit && hit.canonical ? hit.canonical : String(raw || "").trim();
    }
  };
})();
`;
}
