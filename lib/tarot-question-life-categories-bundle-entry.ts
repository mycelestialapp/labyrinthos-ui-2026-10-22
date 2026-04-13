import {
  getLifeQuestionFiveModules,
  getQuestionsForLifeCategory,
  LIFE_CATEGORY_IDS,
  TAB_VALUE_TO_CATEGORY_ID,
  type LifeCategoryId,
  type LifeQuestionFiveModules,
} from './tarot-master-question-content-life-categories';
import {
  getMasterQuestionContentLifeSix,
  LIFE_SIX_MASTER_CATEGORY_IDS,
} from './tarot-master-question-content-life-six';

export {
  getLifeQuestionFiveModules,
  getQuestionsForLifeCategory,
  LIFE_CATEGORY_IDS,
  TAB_VALUE_TO_CATEGORY_ID,
  type LifeCategoryId,
  type LifeQuestionFiveModules,
  getMasterQuestionContentLifeSix,
  LIFE_SIX_MASTER_CATEGORY_IDS,
};

/** 静态页 tab 的 data-value → 命中题干五段模块 */
export function getLifeQuestionFiveModulesForTab(
  tabValue: string,
  questionText: string
): LifeQuestionFiveModules | null {
  const id = TAB_VALUE_TO_CATEGORY_ID[tabValue as keyof typeof TAB_VALUE_TO_CATEGORY_ID];
  if (!id) return null;
  return getLifeQuestionFiveModules(id, questionText);
}
