import { lifePathSideManualParagraphsZh } from "@/lib/numerology-life-path-side-manual-zh";

export type LifePathSynSnippetZh = {
  /** 手册级「一眼」段（与侧栏 `glance` 同源） */
  temperamentLine: string;
  /** 手册级「来由」段（与侧栏 `principle` 同源） */
  traditionLine: string;
};

/**
 * 从侧栏手册定稿拆出气质 / 来由两段；与 `lifePathSideManualParagraphsZh` 同源，避免双份句库。
 */
export function lifePathSynSnippetZh(lp: number): LifePathSynSnippetZh {
  const m = lifePathSideManualParagraphsZh(lp);
  return { temperamentLine: m.glance, traditionLine: m.principle };
}
