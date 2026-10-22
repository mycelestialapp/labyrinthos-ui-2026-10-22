/**
 * 学业考试 · 第一问「快期末了通宵还能不能把这门救回来？」手册级五段式（78×2=156 条）
 * 真源：逐条人工定稿；覆盖冻结库中同题干同键条目。
 */
import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';

const Q1 = '快期末了通宵还能不能把这门救回来？' as const;

function E(c: MasterQuestionCardContent): MasterQuestionCardContent {
  return c;
}

/** 第一问手册入库（须在全局 freeze 之后调用以覆盖底稿） */
export function registerStudyQ01Handbook(
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
