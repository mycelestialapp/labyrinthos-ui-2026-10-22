/** 塔罗选题方向胶囊：一点开铺该组全部现场题。 */
export type TarotDirTab = {
  id: string;
  label: string;
  groupLabels: readonly string[];
  surface?: readonly string[];
};

export function surfacesForDirFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
  tabs: readonly TarotDirTab[],
): string[] {
  const tab = tabs.find((t) => t.id === filterId) ?? tabs[0];
  if (tab?.surface?.length) return [...tab.surface];
  if (!tab || tab.groupLabels.length === 0) {
    return groups.flatMap((g) => [...g.surface]);
  }
  const want = new Set(tab.groupLabels);
  return groups.filter((g) => want.has(g.label)).flatMap((g) => [...g.surface]);
}
