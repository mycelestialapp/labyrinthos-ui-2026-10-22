/**
 * 塔罗／西方占卜选题框架。
 * 每组都带所属大类；不冻 20 条；东方 19 类题库另文件保留。
 */
import { surfacesForDirFilter, type TarotDirTab } from "../tarot-question-dir-filter-zh";

export type WesternGroup = {
  /** 所属大类（与顶栏 15 类 id 一致） */
  categoryId: string;
  /** 子类 */
  label: string;
  keys: string[];
  surface: string[];
};

export type WesternDirPack = {
  defaultId: string;
  hint: string;
  tabs: readonly TarotDirTab[];
  groups: readonly WesternGroup[];
};

export function wg(
  categoryId: string,
  label: string,
  keys: string[],
  surface: string[],
): WesternGroup {
  return { categoryId, label, keys, surface };
}

export function makeWesternDir(
  featured: readonly string[],
  groups: readonly WesternGroup[],
  tabs: ReadonlyArray<{ id: string; label: string; groupLabels: readonly string[] }>,
  hint: string,
): WesternDirPack {
  return {
    defaultId: "hot",
    hint,
    tabs: [
      { id: "hot", label: "高频", groupLabels: [], surface: featured },
      ...tabs.map((t) => ({ id: t.id, label: t.label, groupLabels: t.groupLabels })),
    ],
    groups,
  };
}

export function westernGroupsForFilter(
  filterId: string,
  pack: WesternDirPack,
): WesternGroup[] {
  const tab = pack.tabs.find((t) => t.id === filterId) ?? pack.tabs[0];
  const categoryId = pack.groups[0]?.categoryId ?? "";
  if (tab?.surface?.length) {
    return [{ categoryId, label: "高频", keys: [], surface: [...tab.surface] }];
  }
  if (!tab || tab.groupLabels.length === 0) return [...pack.groups];
  const want = new Set(tab.groupLabels);
  return pack.groups.filter((g) => want.has(g.label));
}

export function uniqueQuestionList(list: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const q of list) {
    if (!q || seen.has(q)) continue;
    seen.add(q);
    out.push(q);
  }
  return out;
}

export function westernSurfacesFlat(
  filterId: string,
  pack: WesternDirPack,
): string[] {
  return uniqueQuestionList(westernGroupsForFilter(filterId, pack).flatMap((g) => g.surface));
}

export function boostPack(
  pack: WesternDirPack,
  extra: {
    groups: readonly WesternGroup[];
    tabs?: ReadonlyArray<{ id: string; label: string; groupLabels: readonly string[] }>;
  },
): WesternDirPack {
  const extraTabs = (extra.tabs ?? []).map((t) => ({
    id: t.id,
    label: t.label,
    groupLabels: t.groupLabels,
  }));
  const extraHot = uniqueQuestionList(extra.groups.flatMap((g) => g.surface)).slice(0, 10);
  const tabs = pack.tabs.map((t) => {
    if (t.id !== "hot" || !t.surface?.length) return t;
    return {
      ...t,
      surface: uniqueQuestionList([...t.surface, ...extraHot]).slice(0, 22),
    };
  });
  return {
    ...pack,
    groups: [...pack.groups, ...extra.groups],
    tabs: [...tabs, ...extraTabs],
  };
}

export function westernSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
  tabs: readonly TarotDirTab[],
): string[] {
  return surfacesForDirFilter(filterId, groups, tabs);
}
