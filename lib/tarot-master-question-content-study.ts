/**
 * 塔罗大师解读 · 学业考试 · 具体问题 × 78 张牌 × 正逆位
 *
 * 【产品标准】**成品只认逐条 `register` 真源**（`tarot-master-question-content-study-registers.generated.ts`）。
 * 【大师向 A 稿】引擎侧已拆「题桥×20 + 大牌魂×22×2 + 小牌魂×56×2 + 小牌题桥×20×14×2」，冻结后为可逐条手改的厚底稿；仍可继续打磨至你认可的「手册终稿」。
 * 【禁止】把 `study-engine` 当线上唯一真源（引擎仅作 `npm run tarot:study:freeze` 输入）。
 * 【题干】`tarot-master-question-content-study-texts-only.ts` 与 quick-pick「学业考试」逐字一致。
 * 【入库】`registerStudyFrozenRegisters`（见上 generated 文件，可逐条手改）。
 * 【重冻】改 `tarot-master-question-content-study-engine.ts` 后执行 `npm run tarot:study:freeze`（会覆盖 generated，手改请先备份或改完再冻）。
 * 【手册覆盖】第一～三问 `registerStudyQ01Handbook`…`Q03`；均在冻结入库之后调用以覆盖同键。第四～二十问与引擎共用 `scripts/emit-study-rest-layers.mjs` 生成之五段（题脉标签与 Q1–Q3 手册一致），重冻后一并入库。
 * 【装配】`npm run build:tarot-question-study` → `public/tarotQuestionStudyContent.js`
 */

import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';
import { STUDY_QUESTION_TEXTS } from './tarot-master-question-content-study-texts-only';
import { registerStudyFrozenRegisters } from './tarot-master-question-content-study-registers.generated';
import { registerStudyQ01Handbook } from './tarot-master-question-content-study-q01-handbook';
import { registerStudyQ02Handbook } from './tarot-master-question-content-study-q02-handbook';
import { registerStudyQ03Handbook } from './tarot-master-question-content-study-q03-handbook';

const 学业考试 = '学业考试';

const DMY_CARD_NAME_ZH: Record<string, string> = (() => {
  const majors: Record<string, string> = {
    major_0: '愚者',
    major_1: '魔术师',
    major_2: '女祭司',
    major_3: '皇后',
    major_4: '皇帝',
    major_5: '教皇',
    major_6: '恋人',
    major_7: '战车',
    major_8: '力量',
    major_9: '隐士',
    major_10: '命运之轮',
    major_11: '正义',
    major_12: '倒吊人',
    major_13: '死神',
    major_14: '节制',
    major_15: '恶魔',
    major_16: '高塔',
    major_17: '星星',
    major_18: '月亮',
    major_19: '太阳',
    major_20: '审判',
    major_21: '世界',
  };
  const suitZh: Record<string, string> = {
    wands: '权杖',
    cups: '圣杯',
    swords: '宝剑',
    pentacles: '星币',
  };
  const nzh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const rank = (n: number) =>
    n === 1
      ? '王牌'
      : n >= 2 && n <= 10
        ? nzh[n]!
        : n === 11
          ? '侍从'
          : n === 12
            ? '骑士'
            : n === 13
              ? '王后'
              : n === 14
                ? '国王'
                : String(n);
  const out: Record<string, string> = { ...majors };
  for (const suit of ['wands', 'cups', 'swords', 'pentacles'] as const) {
    const sz = suitZh[suit];
    for (let n = 1; n <= 14; n++) {
      out[`${suit}_${n}`] = `${sz}${rank(n)}`;
    }
  }
  return out;
})();

const STORE: Record<string, MasterQuestionCardContent> = {};

export function masterQuestionContentKey(
  categoryId: string,
  questionText: string,
  cardId: string,
  upright: boolean
): string {
  return `${categoryId}|${questionText}|${cardId}|${upright ? 'upright' : 'reversed'}`;
}

function register(
  categoryId: string,
  questionText: string,
  cardId: string,
  upright: boolean,
  content: MasterQuestionCardContent
): void {
  STORE[masterQuestionContentKey(categoryId, questionText, cardId, upright)] = content;
}

function generatePlaceholder(
  cardId: string,
  upright: boolean,
  questionText: string
): MasterQuestionCardContent {
  const orientation = upright ? '正位' : '逆位';
  const name = DMY_CARD_NAME_ZH[cardId] ?? cardId;
  const hint = `此牌（${name}·${orientation}）针对「${questionText}」的学业向专属五段式正在撰写中。请先参考本牌在「学业考试」下的通用大师解读。`;
  return {
    cardSpeaking: hint,
    psychologyLayer: hint,
    spiritLayer: hint,
    actionPath: hint,
    masterSummary: hint,
    isPlaceholder: true,
  };
}

registerStudyFrozenRegisters(register, 学业考试, STUDY_QUESTION_TEXTS);
registerStudyQ01Handbook(register, 学业考试);
registerStudyQ02Handbook(register, 学业考试);
registerStudyQ03Handbook(register, 学业考试);

export function getMasterQuestionContent(
  categoryId: string,
  questionText: string,
  cardId: string,
  upright: boolean,
  options?: { placeholder?: boolean }
): MasterQuestionCardContent | null {
  if (categoryId !== 学业考试) return null;
  const q = questionText?.trim() ?? '';
  const key = masterQuestionContentKey(学业考试, q, cardId, upright);
  const stored = STORE[key];
  if (stored) return stored;
  if (options?.placeholder) {
    return generatePlaceholder(cardId, upright, q || questionText?.trim() || '');
  }
  return null;
}

export function getQuestionsForStudyCategory(): string[] {
  return [...STUDY_QUESTION_TEXTS];
}

export function getAllDmyTarotCardIdsStudy(): string[] {
  const majors = Array.from({ length: 22 }, (_, i) => `major_${i}`);
  const minors: string[] = [];
  for (const suit of ['wands', 'cups', 'swords', 'pentacles'] as const) {
    for (let n = 1; n <= 14; n++) minors.push(`${suit}_${n}`);
  }
  return [...majors, ...minors];
}

export { STUDY_QUESTION_TEXTS };
export type { MasterQuestionCardContent } from './tarot-master-question-types-shared';
