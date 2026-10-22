/**
 * 学业考试 · 第二问「转专业要重修一堆课我还要不要转？」手册级五段式（78×2=156 条）
 * 大牌：逐条题牌咬合；小牌：四元素题脉 + 点数位势 + 五段逐键组合（scripts/study-minor-master-synth.mjs）
 */
import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';

const Q2 = '转专业要重修一堆课我还要不要转？' as const;

function E(c: MasterQuestionCardContent): MasterQuestionCardContent {
  return c;
}

/** 第二问手册入库（须在 freeze 与 Q1 手册之后调用） */
export function registerStudyQ02Handbook(
  register: (
    categoryId: string,
    questionText: string,
    cardId: string,
    upright: boolean,
    content: MasterQuestionCardContent
  ) => void,
  categoryId: string
): void {
}
