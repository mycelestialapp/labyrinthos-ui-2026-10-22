/**
 * 事业工作 20 问 × 78 牌 × 正逆 → 五段式（冻结输入源）
 *
 * 【成品】`tarot-master-question-content-career-registers.generated.ts`（`npm run tarot:career:freeze`）。
 * 【结构】对齐感情第一问口径：牌直接开口、心理【事业题脉】挖根、灵性含「核心启示」、行动可执行、总结一句魂。
 * 【底材】`tarot-career-rest-layers.generated.ts`（`node scripts/emit-career-rest-layers.mjs`）。
 */
import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';
import { CAREER_MAJOR_BRIDGE } from './tarot-career-master-bridges-major-zh';
import { CAREER_MINOR_RANK_BRIDGE } from './tarot-career-master-bridges-minor-zh';
import {
  CAREER_MAJOR_SOUL,
  CAREER_MINOR_SOUL_BY_NUM,
  type CareerMinorSuitKey,
} from './tarot-career-master-card-soul-zh';
import { CAREER_QUESTION_CLOSE_BEAT } from './tarot-career-question-close-beat-zh';
import { TAROT_MINOR_PRE_LINES_MASTER } from './tarot-minor-pre-lines-master-zh';
import {
  careerRestLayerIndex,
  CAREER_REST_ACTION,
  CAREER_REST_PSYCH,
  CAREER_REST_SPIRIT,
  CAREER_REST_SUM,
} from './tarot-career-rest-layers.generated';

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

function careerCloseBeat(qi: number): string {
  return CAREER_QUESTION_CLOSE_BEAT[qi] ?? CAREER_QUESTION_CLOSE_BEAT[0]!;
}

function majorCardSpeaking(qi: number, i: number, up: boolean, qFull: string): string {
  const n = majors[i]!;
  const u = up ? '正位' : '逆位';
  const label = `${n}${u}`;
  const bridge =
    CAREER_MAJOR_BRIDGE[qi]?.[i] ??
    `这题要紧处在下一步是否落地；${label}在此提醒你别用情绪偷换留痕与交付。`;
  const soul = CAREER_MAJOR_SOUL[i]?.[up ? 0 : 1] ?? '把怕写短，把动作写真。';
  const beat = careerCloseBeat(qi);
  return `这张牌对你说：你抽到的是「${label}」。${bridge}——牌魂落在：${soul}\n\n你问的是「${qFull}」——${beat}`;
}

function minorCardSpeakingCareer(
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
  const sk: CareerMinorSuitKey =
    suit === 'wands' || suit === 'cups' || suit === 'swords' || suit === 'pentacles' ? suit : 'pentacles';
  const pre = pick(up ? TAROT_MINOR_PRE_LINES_MASTER[sk].up : TAROT_MINOR_PRE_LINES_MASTER[sk].dn, sv);
  const idx = num - 1;
  const soulRow = CAREER_MINOR_SOUL_BY_NUM[idx] ?? CAREER_MINOR_SOUL_BY_NUM[0]!;
  const soul = soulRow[sk][up ? 0 : 1];
  const pair = CAREER_MINOR_RANK_BRIDGE[qi]?.[idx] ?? [
    '这一步：先把下一步写清，再谈怕。',
    '这一步：别让情绪盖住可执行动作。',
  ];
  const bridge = up ? pair[0]! : pair[1]!;
  const beat = careerCloseBeat(qi);
  return `这张牌对你说：${pre}你抽到的是「${label}」。${bridge}——牌魂落在：${soul}\n\n你问的是「${qFull}」——${beat}`;
}

/** 供 `npm run tarot:career:freeze` 调用 */
export function buildCareerEngineMasterEntry(
  qi: number,
  cardId: string,
  upright: boolean,
  questionText: string
): MasterQuestionCardContent {
  const idx = careerRestLayerIndex(qi, cardId, upright);
  const psych = CAREER_REST_PSYCH[idx]!;
  const spirit = CAREER_REST_SPIRIT[idx]!;
  const action = CAREER_REST_ACTION[idx]!;
  const sum = CAREER_REST_SUM[idx]!;

  if (cardId.startsWith('major_')) {
    const mi = Number(cardId.slice('major_'.length));
    const i = Number.isFinite(mi) ? mi : 0;
    const cardSpeaking = majorCardSpeaking(qi, i, upright, questionText);
    return { cardSpeaking, psychologyLayer: psych, spiritLayer: spirit, actionPath: action, masterSummary: sum };
  }

  const m = /^(\w+)_(\d+)$/.exec(cardId);
  if (m) {
    const suit = m[1]!;
    const num = Number(m[2]);
    const cardSpeaking = minorCardSpeakingCareer(qi, suit, num, upright, questionText, cardId);
    return { cardSpeaking, psychologyLayer: psych, spiritLayer: spirit, actionPath: action, masterSummary: sum };
  }

  const fallback = '此牌针对本题的五段式暂以通用事业向解读装配；请稍后重试或换牌。';
  return {
    cardSpeaking: fallback,
    psychologyLayer: fallback,
    spiritLayer: fallback,
    actionPath: fallback,
    masterSummary: fallback,
  };
}
