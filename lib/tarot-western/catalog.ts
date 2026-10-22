import type { TarotCategoryQuestionCatalog, TarotQuestionGroup } from "../tarot-question-catalog-19-zh";
import { normalizeQuestionTextZh } from "../question-text-normalize-zh";
import { tradToSimp } from "../zhTradToSimp";
import type { TarotDirTab } from "../tarot-question-dir-filter-zh";
import { westernSurfacesForFilter, type WesternDirPack, type WesternGroup } from "./types";
import { WESTERN_LOVE_DIR } from "./love";
import { WESTERN_CAREER_DIR } from "./career";
import { WESTERN_MONEY_DIR } from "./money";
import { WESTERN_STUDY_DIR } from "./study";
import { WESTERN_HEALTH_DIR } from "./health";
import { WESTERN_PET_DIR } from "./pet";
import { WESTERN_REL_DIR } from "./rel";
import { WESTERN_TRAVEL_DIR } from "./travel";
import { WESTERN_LOST_DIR } from "./lost";
import { WESTERN_CHOICE_DIR } from "./choice";
import { WESTERN_DREAM_DIR } from "./dream";
import { WESTERN_SPIRIT_DIR } from "./spirit";
import { WESTERN_OTHER_DIR } from "./other";
import { WESTERN_PSY_DIR } from "./psy";
import { WESTERN_ADVICE_DIR } from "./advice";
import { WESTERN_BOOST } from "./boost";
import { mergeBoost, WESTERN_BOOST2 } from "./boost2";
import { boostPack } from "./types";

type WesternDirEntry = {
  defaultId: string;
  tabs: readonly TarotDirTab[];
  surfacesForFilter: (
    filterId: string,
    groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
  ) => string[];
  hint: string;
};

function nn(s: string): string {
  return normalizeQuestionTextZh(tradToSimp(s));
}

function unique(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of list) {
    const k = nn(s);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

function toGroups(rows: readonly WesternGroup[]): TarotQuestionGroup[] {
  return rows.map((row) => ({
    label: row.label,
    keys: [...row.keys],
    surface: [...row.surface],
    hidden: [],
    picks: [...row.surface],
    categoryId: row.categoryId,
  }));
}

function buildCat(pack: WesternDirPack): TarotCategoryQuestionCatalog {
  const id = pack.groups[0]?.categoryId ?? "";
  const groups = toGroups(pack.groups);
  const canonical = unique(groups.flatMap((g) => g.surface));
  const aliasToCanonical: Record<string, string> = {};
  for (const c of canonical) {
    const k = nn(c);
    if (k && !aliasToCanonical[k]) aliasToCanonical[k] = c;
  }
  return { id, label: id, canonical, groups, aliasToCanonical };
}

function dirEntry(pack: WesternDirPack): WesternDirEntry {
  return {
    defaultId: pack.defaultId,
    tabs: pack.tabs,
    surfacesForFilter: (filterId, groups) => westernSurfacesForFilter(filterId, groups, pack.tabs),
    hint: pack.hint,
  };
}

function withBoost(pack: WesternDirPack, key: string): WesternDirPack {
  const a = WESTERN_BOOST[key];
  const extra = WESTERN_BOOST2[key];
  if (!a) return pack;
  return boostPack(pack, extra ? mergeBoost(a, extra) : a);
}

export const WESTERN_DIR_PACKS: Record<string, WesternDirPack> = {
  感情婚姻: WESTERN_LOVE_DIR,
  事业工作: withBoost(WESTERN_CAREER_DIR, "事业工作"),
  财运投资: withBoost(WESTERN_MONEY_DIR, "财运投资"),
  学业考试: withBoost(WESTERN_STUDY_DIR, "学业考试"),
  身体健康: withBoost(WESTERN_HEALTH_DIR, "身体健康"),
  宠物: withBoost(WESTERN_PET_DIR, "宠物"),
  人际关系: withBoost(WESTERN_REL_DIR, "人际关系"),
  出行迁居: withBoost(WESTERN_TRAVEL_DIR, "出行迁居"),
  失物寻找: withBoost(WESTERN_LOST_DIR, "失物寻找"),
  选择决策: withBoost(WESTERN_CHOICE_DIR, "选择决策"),
  占梦境: withBoost(WESTERN_DREAM_DIR, "占梦境"),
  灵性成长: WESTERN_SPIRIT_DIR,
  其他: withBoost(WESTERN_OTHER_DIR, "其他"),
  心理疏导: withBoost(WESTERN_PSY_DIR, "心理疏导"),
  人生建议: withBoost(WESTERN_ADVICE_DIR, "人生建议"),
};

export const TAROT_WESTERN_CATALOG: TarotCategoryQuestionCatalog[] = Object.values(WESTERN_DIR_PACKS).map(buildCat);

export const TAROT_WESTERN_CATALOG_BY_ID: Record<string, TarotCategoryQuestionCatalog> = Object.fromEntries(
  TAROT_WESTERN_CATALOG.map((c) => [c.id, c]),
);

export const TAROT_DIR_BY_CATEGORY_WESTERN: Record<string, WesternDirEntry> = Object.fromEntries(
  Object.entries(WESTERN_DIR_PACKS).map(([id, pack]) => [id, dirEntry(pack)]),
);

export function getWesternQuestionGroups(categoryId: string): TarotQuestionGroup[] {
  return TAROT_WESTERN_CATALOG_BY_ID[categoryId]?.groups ?? [];
}

export function getWesternSurfaceQuestions(categoryId: string): string[] {
  const cat = TAROT_WESTERN_CATALOG_BY_ID[categoryId];
  return cat ? cat.groups.flatMap((g) => g.surface) : [];
}
