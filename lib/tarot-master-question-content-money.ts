/**
 * 塔罗大师解读 · 财运投资 · 具体问题 × 78 张牌 × 正逆位
 *
 * 【产品标准】与事业库一致：成品仅通过逐条 `register` 入库；**禁止**依赖运行时「引擎拼池」作为正式条目的唯一真源。
 * 【题干】与 `lib/tarot-question-quick-pick.ts`「财运投资」完全一致（真源：`tarot-master-question-content-money-texts-only.ts`）。
 * 【入库】`registerMoneyFrozenRegisters`（`tarot-master-question-content-money-registers.generated.ts`，可逐条手改定稿）。
 * 【草稿/重冻】改四层语料先 `npm run tarot:money:emit-layers`；改引擎或题干后 `npm run tarot:money:freeze` 覆盖生成文件。
 * 【装配】npm run build:tarot-question-money → public/tarotQuestionMoneyContent.js
 */

import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';
import { MONEY_QUESTION_TEXTS } from './tarot-master-question-content-money-texts-only';
import { registerMoneyFrozenRegisters } from './tarot-master-question-content-money-registers.generated';

const 财运投资 = '财运投资';

export { MONEY_QUESTION_TEXTS };

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
  const hint = `此牌（${name}·${orientation}）针对「${questionText}」的财运向专属五段式正在撰写中。请先参考本牌在「财运投资」下的通用大师解读。`;
  return {
    cardSpeaking: hint,
    psychologyLayer: hint,
    spiritLayer: hint,
    actionPath: hint,
    masterSummary: hint,
    isPlaceholder: true,
  };
}

/** 20 问 × 78 牌 × 正逆：冻结后的逐条 register（与事业库形态一致） */
registerMoneyFrozenRegisters(register, 财运投资, MONEY_QUESTION_TEXTS);

export function getMasterQuestionContent(
  categoryId: string,
  questionText: string,
  cardId: string,
  upright: boolean,
  options?: { placeholder?: boolean }
): MasterQuestionCardContent | null {
  if (categoryId !== 财运投资) return null;
  const q = questionText?.trim() ?? '';
  const key = masterQuestionContentKey(财运投资, q, cardId, upright);
  const stored = STORE[key];
  if (stored) return stored;
  if (options?.placeholder) {
    return generatePlaceholder(cardId, upright, q || questionText?.trim() || '');
  }
  return null;
}

export function getQuestionsForMoneyCategory(): string[] {
  return [...MONEY_QUESTION_TEXTS];
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
