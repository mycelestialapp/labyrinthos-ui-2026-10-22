/**
 * 塔罗大师解读 · 事业工作 · 具体问题 × 78 张牌 × 正逆位
 *
 * 【产品标准】与财运库一致：成品通过逐条 `register` 入库；冻结文件可逐条手改定稿。
 * 【题干】与 `lib/tarot-question-quick-pick.ts`「事业工作」完全一致（真源：`tarot-master-question-content-career-texts-only.ts`）。
 * 【入库】`registerCareerFrozenRegisters`（`tarot-master-question-content-career-registers.generated.ts`）。
 * 【草稿/重冻】改四层语料先 `npm run tarot:career:emit-layers`；改引擎或题干后 `npm run tarot:career:freeze`。
 * 【装配】`npm run build:tarot-question-career` → `public/tarotQuestionCareerContent.js`（全局 `TarotQuestionCareer`）。
 */

import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';
import { CAREER_QUESTION_TEXTS } from './tarot-master-question-content-career-texts-only';
import { registerCareerFrozenRegisters } from './tarot-master-question-content-career-registers.generated';

const 事业工作 = '事业工作';

export { CAREER_QUESTION_TEXTS };

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

/** 题干别名字典：简繁、标点变体 → 规范句（与 STORE 键一致） */
const QUESTION_ALIASES: Record<string, string> = {
  我该不该换行从头来过: '我该不该换行从头来过？',
  '我该不该换行从头来过?': '我该不该换行从头来过？',
  我该不该换行重头来过: '我该不该换行从头来过？',
  '我该不该换行重头来过？': '我该不该换行从头来过？',
};

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
  const hint = `此牌（${name}·${orientation}）针对「${questionText}」的事业向专属五段式正在撰写中。请先参考本牌在「事业工作」下的通用大师解读。`;
  return {
    cardSpeaking: hint,
    psychologyLayer: hint,
    spiritLayer: hint,
    actionPath: hint,
    masterSummary: hint,
    isPlaceholder: true,
  };
}

/** 20 问 × 78 牌 × 正逆：冻结后的逐条 register */
registerCareerFrozenRegisters(register, 事业工作, CAREER_QUESTION_TEXTS);

/**
 * 获取事业工作类「具体问题 × 牌」大师解读。
 * `options.placeholder === true` 且无正式稿时返回占位（isPlaceholder: true），仅用于工具脚本或内测。
 */
export function getMasterQuestionContent(
  categoryId: string,
  questionText: string,
  cardId: string,
  upright: boolean,
  options?: { placeholder?: boolean }
): MasterQuestionCardContent | null {
  if (categoryId !== 事业工作) return null;
  const q = questionText?.trim() ?? '';
  const key = masterQuestionContentKey(事业工作, q, cardId, upright);
  let stored = STORE[key];
  if (!stored && QUESTION_ALIASES[q]) {
    const canonical = QUESTION_ALIASES[q];
    stored = STORE[masterQuestionContentKey(事业工作, canonical, cardId, upright)];
  }
  if (stored) return stored;
  if (options?.placeholder) {
    return generatePlaceholder(cardId, upright, q || questionText?.trim() || '');
  }
  return null;
}

export function getQuestionsForCategory(categoryId: string): string[] {
  if (categoryId === 事业工作) return [...CAREER_QUESTION_TEXTS];
  return [];
}

export function getAllDmyTarotCardIds(): string[] {
  const majors = Array.from({ length: 22 }, (_, i) => `major_${i}`);
  const minors: string[] = [];
  for (const suit of ['wands', 'cups', 'swords', 'pentacles'] as const) {
    for (let n = 1; n <= 14; n++) minors.push(`${suit}_${n}`);
  }
  return [...majors, ...minors];
}

export type { MasterQuestionCardContent } from './tarot-master-question-types-shared';
