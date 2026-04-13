/**
 * 财运投资 20 问 × 78 牌 × 正逆 → 五段式（**草稿/冻结源**：成品入库见 `tarot-master-question-content-money-registers.generated.ts`）
 *
 * 【标准手冊】对齐感情婚姻·第一问「这段关系的本质是什么？」成稿口径（`tarot-master-question-content-love.ts` 块首注释）：
 * ① 牌说话：题桥（`MONEY_MAJOR_BRIDGE` / `MONEY_MINOR_RANK_BRIDGE`）＋牌魂＋`MONEY_QUESTION_CLOSE_BEAT` 收束；结构与学业 `tarot-master-question-content-study-engine` 一致。
 * ② 心理挖根：【钱题现状】→【心理层面】→【根源层面】（与感情【关系现状】同构）；可点「你真正怕的是…」。
 * ③ 灵性层：先有宇宙视角段落，再用「核心启示：」一句收住（不用「核心提醒」混用）。
 * ④ 行动路径：具体可做，保留「检查你的「…」」式自省（与感情「行囊/桌面」同功，钱题用行囊、账本、抽屉、合同等）。
 * ⑤ 大师总结：一句话送你，全篇的魂，忌叠成两段口号。
 *
 * 题干须与 `MONEY_QUESTION_TEXTS` 逐字一致。
 * 【五段全量·后四层】心理/灵性/行动/收束＝3120×4 条与 freeze 索引对齐（`npm run tarot:money:emit-layers` 可重生成）。
 */
import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';
import {
  moneyRestLayerIndex,
  MONEY_REST_ACTION,
  MONEY_REST_PSYCH,
  MONEY_REST_SPIRIT,
  MONEY_REST_SUM,
} from './tarot-money-rest-layers.generated';
import { MONEY_MAJOR_BRIDGE } from './tarot-money-master-bridges-major-zh';
import { MONEY_MINOR_RANK_BRIDGE } from './tarot-money-master-bridges-minor-zh';
import {
  MONEY_MAJOR_SOUL,
  MONEY_MINOR_SOUL_BY_NUM,
  type MoneyMinorSuitKey,
} from './tarot-money-master-card-soul-zh';
import { MONEY_QUESTION_CLOSE_BEAT } from './tarot-money-question-close-beat-zh';
import { TAROT_MINOR_PRE_LINES_MONEY } from './tarot-minor-pre-lines-master-zh';

const majors = [
  '愚者',
  '魔术师',
  '女祭司',
  '皇后',
  '皇帝',
  '教皇',
  '恋人',
  '战车',
  '力量',
  '隐士',
  '命运之轮',
  '正义',
  '倒吊人',
  '死神',
  '节制',
  '恶魔',
  '高塔',
  '星星',
  '月亮',
  '太阳',
  '审判',
  '世界',
] as const;

const suitZh: Record<string, string> = {
  wands: '权杖',
  cups: '圣杯',
  swords: '宝剑',
  pentacles: '星币',
};

const rankName = (n: number): string =>
  n === 1
    ? '王牌'
    : n <= 10
      ? ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][n]!
      : n === 11
        ? '侍从'
        : n === 12
          ? '骑士'
          : n === 13
            ? '王后'
            : n === 14
              ? '国王'
              : String(n);

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[((seed % arr.length) + arr.length) % arr.length]!;
}

function seedFrom(cardId: string, upright: boolean, qi: number): number {
  let h = qi * 1009;
  for (let i = 0; i < cardId.length; i++) h = (h * 31 + cardId.charCodeAt(i)) | 0;
  return h + (upright ? 17 : 0);
}

function moneyCloseBeat(qi: number): string {
  return MONEY_QUESTION_CLOSE_BEAT[qi] ?? MONEY_QUESTION_CLOSE_BEAT[0]!;
}

function majorCardSpeaking(qi: number, i: number, up: boolean, qFull: string): string {
  const n = majors[i]!;
  const u = up ? '正位' : '逆位';
  const label = `${n}${u}`;
  const bridge =
    MONEY_MAJOR_BRIDGE[qi]?.[i] ??
    `这题要紧处在下一步是否落地；${label}在此提醒你别用情绪偷换动作。`;
  const soul = MONEY_MAJOR_SOUL[i]?.[up ? 0 : 1] ?? '把怕写短，把动作写真。';
  const beat = moneyCloseBeat(qi);
  return `你抽到的是${label}。${bridge}——牌魂落在：${soul}\n\n你嘴里念着「${qFull}」——${beat}`;
}

function minorCardSpeakingMoney(
  qi: number,
  suit: string,
  num: number,
  up: boolean,
  qFull: string,
  cardId: string
): string {
  const sz = suitZh[suit] ?? suit;
  const rk = rankName(num);
  const u = up ? '正位' : '逆位';
  const label = `${sz}${rk}${u}`;
  const sv = seedFrom(cardId, up, qi);
  const sk: MoneyMinorSuitKey =
    suit === 'wands' || suit === 'cups' || suit === 'swords' || suit === 'pentacles' ? suit : 'pentacles';
  const pre = pick(up ? TAROT_MINOR_PRE_LINES_MONEY[sk].up : TAROT_MINOR_PRE_LINES_MONEY[sk].dn, sv);
  const idx = num - 1;
  const soulRow = MONEY_MINOR_SOUL_BY_NUM[idx] ?? MONEY_MINOR_SOUL_BY_NUM[0]!;
  const soul = soulRow[sk][up ? 0 : 1];
  const pair = MONEY_MINOR_RANK_BRIDGE[qi]?.[idx] ?? [
    '这一步：先把下一步写清，再谈怕。',
    '这一步：别让情绪盖住可执行动作。',
  ];
  const bridge = up ? pair[0]! : pair[1]!;
  const beat = moneyCloseBeat(qi);
  return `${pre}你抽到的是${label}。${bridge}——牌魂落在：${soul}\n\n你嘴里念着「${qFull}」——${beat}`;
}

/** 供 `npm run tarot:money:freeze` 冻结为逐条 register；线上成品不运行时拼装。 */
export function buildMoneyEngineMasterEntry(
  qi: number,
  cardId: string,
  upright: boolean,
  questionText: string
): MasterQuestionCardContent {
  const idx = moneyRestLayerIndex(qi, cardId, upright);
  const psych = MONEY_REST_PSYCH[idx]!;
  const spirit = MONEY_REST_SPIRIT[idx]!;
  const action = MONEY_REST_ACTION[idx]!;
  const sum = MONEY_REST_SUM[idx]!;

  if (cardId.startsWith('major_')) {
    const idx = Number(cardId.slice('major_'.length));
    const i = Number.isFinite(idx) ? idx : 0;
    const cardSpeaking = majorCardSpeaking(qi, i, upright, questionText);
    return { cardSpeaking, psychologyLayer: psych, spiritLayer: spirit, actionPath: action, masterSummary: sum };
  }

  const m = /^(\w+)_(\d+)$/.exec(cardId);
  if (m) {
    const suit = m[1]!;
    const num = Number(m[2]);
    const cardSpeaking = minorCardSpeakingMoney(qi, suit, num, upright, questionText, cardId);
    return { cardSpeaking, psychologyLayer: psych, spiritLayer: spirit, actionPath: action, masterSummary: sum };
  }

  const fallback =
    '此牌针对本题的五段式暂以通用财运向解读装配；请稍后重试或换牌。';
  return {
    cardSpeaking: fallback,
    psychologyLayer: fallback,
    spiritLayer: fallback,
    actionPath: fallback,
    masterSummary: fallback,
  };
}

export function registerAllMoneyQuestions(
  register: (
    categoryId: string,
    questionText: string,
    cardId: string,
    upright: boolean,
    content: MasterQuestionCardContent
  ) => void,
  categoryId: string,
  questionTexts: readonly string[]
): void {
  const suits = ['wands', 'cups', 'swords', 'pentacles'] as const;
  for (let qi = 0; qi < questionTexts.length; qi++) {
    const Q = questionTexts[qi]!;
    for (let mi = 0; mi < 22; mi++) {
      for (const up of [true, false]) {
        register(categoryId, Q, `major_${mi}`, up, buildMoneyEngineMasterEntry(qi, `major_${mi}`, up, Q));
      }
    }
    for (const suit of suits) {
      for (let num = 1; num <= 14; num++) {
        for (const up of [true, false]) {
          const id = `${suit}_${num}`;
          register(categoryId, Q, id, up, buildMoneyEngineMasterEntry(qi, id, up, Q));
        }
      }
    }
  }
}
