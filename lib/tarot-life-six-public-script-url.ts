/**
 * 生活六大类冻结核静态包 URL（仅版本号与路径，勿 import 题库 TS，以免 /tarot 首包带上 life-categories）。
 * `public/tarot-master.html` 尾部异步注入须与此处 `v=` 一致；esbuild：`npm run build:tarot-question-life`。
 */
export const TAROT_QUESTION_LIFE_CATEGORIES_SCRIPT_VERSION = "7";

export function tarotQuestionLifeCategoriesBundlePath(
  scriptVersion = TAROT_QUESTION_LIFE_CATEGORIES_SCRIPT_VERSION,
): string {
  return `/tarotQuestionLifeCategoriesContent.js?v=${encodeURIComponent(scriptVersion)}`;
}
