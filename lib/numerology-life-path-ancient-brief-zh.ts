/**
 * 古代常读单行导出（与侧栏手册三段同源，仅取 `ancient` 段）。
 * 其它场景若只需数象提要，可继续 import 本函数。
 */
import { lifePathSideManualParagraphsZh } from "@/lib/numerology-life-path-side-manual-zh";

export function lifePathAncientBriefZh(lp: number): string {
  return lifePathSideManualParagraphsZh(lp).ancient;
}
