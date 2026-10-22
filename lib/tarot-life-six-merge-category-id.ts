import {
  LIFE_SIX_MASTER_CATEGORY_IDS,
  LIFE_SIX_MASTER_QUESTIONS_BY_CATEGORY_ID,
} from "./tarot-master-question-content-life-categories";
import { isLifeSixMasterCategoryId } from "./tarot-life-six-window-bridge";
import { tarotQuestionKeyForReading } from "./tarot-question-resolve-zh";

/**
 * 合并冻结核用的六大类 id：题干与真源题库逐字命中时优先该题所属类（手输/未切 Tab 仍可对上）；
 * 否则在 Tab 已是六大类之一时用 Tab。
 */
export function resolveLifeSixMergeCategoryId(questionTrim: string, tabCategoryId: string): string | null {
  const raw = questionTrim.trim();
  const q = tarotQuestionKeyForReading(raw, tabCategoryId);
  if (q) {
    for (const catId of LIFE_SIX_MASTER_CATEGORY_IDS) {
      if (LIFE_SIX_MASTER_QUESTIONS_BY_CATEGORY_ID[catId].includes(q)) return catId;
      if (raw && LIFE_SIX_MASTER_QUESTIONS_BY_CATEGORY_ID[catId].includes(raw)) return catId;
    }
  }
  if (isLifeSixMasterCategoryId(tabCategoryId)) return tabCategoryId;
  return null;
}
