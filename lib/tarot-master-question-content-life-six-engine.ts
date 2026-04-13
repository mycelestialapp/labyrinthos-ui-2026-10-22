/**
 * 生活六大类 · 题×牌×正逆五段式 **冻结输入**
 * 【线上真源】各 `*.master-handbook.generated.ts`（npm run tarot:life-six:emit-master-handbook）；本文件仅供装配与 emit 灌入初值。
 */
import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';
import {
  TAROT_MINOR_PRE_LINES_LIFE_SIX,
  TAROT_MINOR_PRE_LINES_LIFE_SIX_BY_CAT,
} from './tarot-minor-pre-lines-master-zh';
import type { StudyMinorSuitKey } from './tarot-study-master-card-soul-zh';
import {
  LIFE_SIX_MAJOR_SOUL_BY_CAT,
  LIFE_SIX_MINOR_SOUL_BY_CAT,
  LIFE_SIX_MINOR_SOUL_BY_NUM,
} from './tarot-life-six-master-card-soul-zh';
import { LIFE_SIX_VOICE_PACKS } from './tarot-life-six-voice-deck-zh';
import {
  lifeSixRestLayerIndex,
  LIFE_SIX_REST_ACTION,
  LIFE_SIX_REST_PSYCH,
  LIFE_SIX_REST_SPIRIT,
  LIFE_SIX_REST_SUM,
} from './tarot-life-six-rest-layers.generated';

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

function rankName(n: number): string {
  if (n === 1) return '王牌';
  if (n <= 10) return ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][n]!;
  if (n === 11) return '侍从';
  if (n === 12) return '骑士';
  if (n === 13) return '王后';
  if (n === 14) return '国王';
  return String(n);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[((seed % arr.length) + arr.length) % arr.length]!;
}

function seedFrom(cardId: string, upright: boolean, qi: number, catIdx: number): number {
  let h = (qi + 1) * 1009 + catIdx * 503;
  for (let i = 0; i < cardId.length; i++) h = (h * 31 + cardId.charCodeAt(i)) | 0;
  return h + (upright ? 17 : 0);
}

function closeBeatFor(catIdx: number, qi: number): string {
  const pack = LIFE_SIX_VOICE_PACKS[catIdx]!;
  return pack.closeBeat[qi] ?? pack.closeBeat[0]!;
}

/** 去掉 rest 层里「甲·乙」式小标题（易显说明书腔）；保留如【就医自检】等不含中点「·」的收束块。 */
function stripLifeSixCatalogBandTags(text: string): string {
  return text
    .replace(/【[^】]*·[^】]*】/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function majorCardSpeaking(
  catIdx: number,
  qi: number,
  i: number,
  up: boolean,
  qFull: string
): string {
  const pack = LIFE_SIX_VOICE_PACKS[catIdx]!;
  const n = majors[i]!;
  const u = up ? '正位' : '逆位';
  const label = `${n}${u}`;
  const tag = pack.tagPsych[qi] ?? '';
  const core = pack.majorCore[i] ?? '把怕写短，把动作写真。';
  const bridge = `${tag}这一步：${core}`;
  const soulRowM = LIFE_SIX_MAJOR_SOUL_BY_CAT[catIdx]?.[i];
  const soul = soulRowM?.[up ? 0 : 1] ?? '把怕写短，把动作写真。';
  const beat = closeBeatFor(catIdx, qi);
  return `这张牌对你说：你抽到的是「${label}」。${bridge}——牌魂落在：${soul}\n\n你问的是「${qFull}」——${beat}`;
}

function minorCardSpeaking(
  catIdx: number,
  qi: number,
  suit: string,
  num: number,
  up: boolean,
  qFull: string,
  cardId: string
): string {
  const pack = LIFE_SIX_VOICE_PACKS[catIdx]!;
  const sz = suitZh[suit] ?? suit;
  const rk = rankName(num);
  const u = up ? '正位' : '逆位';
  const label = `${sz}${rk}${u}`;
  const sv = seedFrom(cardId, up, qi, catIdx);
  const sk: StudyMinorSuitKey =
    suit === 'wands' || suit === 'cups' || suit === 'swords' || suit === 'pentacles' ? suit : 'pentacles';
  const preLines = TAROT_MINOR_PRE_LINES_LIFE_SIX_BY_CAT[catIdx] ?? TAROT_MINOR_PRE_LINES_LIFE_SIX;
  const pre = pick(up ? preLines[sk].up : preLines[sk].dn, sv);
  const idx = num - 1;
  const minorTable = LIFE_SIX_MINOR_SOUL_BY_CAT[catIdx] ?? LIFE_SIX_MINOR_SOUL_BY_NUM;
  const soulRow = minorTable[idx] ?? minorTable[0]!;
  const soul = soulRow[sk][up ? 0 : 1];
  const pair = pack.minorRankPair[idx] ?? ['这一步：先把下一步写清，再谈怕。', '这一步：别让情绪盖住可执行动作。'];
  const bridge = up ? pair[0]! : pair[1]!;
  const beat = closeBeatFor(catIdx, qi);
  return `这张牌对你说：${pre}你抽到的是「${label}」。${bridge}——牌魂落在：${soul}\n\n你问的是「${qFull}」——${beat}`;
}

function psychologyLayerFor(catIdx: number, qi: number, cardId: string, upright: boolean): string {
  const idx = lifeSixRestLayerIndex(catIdx, qi, cardId, upright);
  return stripLifeSixCatalogBandTags(LIFE_SIX_REST_PSYCH[idx] ?? LIFE_SIX_REST_PSYCH[0]!);
}

function spiritLayerFor(catIdx: number, qi: number, cardId: string, upright: boolean): string {
  const idx = lifeSixRestLayerIndex(catIdx, qi, cardId, upright);
  return stripLifeSixCatalogBandTags(LIFE_SIX_REST_SPIRIT[idx] ?? LIFE_SIX_REST_SPIRIT[0]!);
}

function actionLayerFor(catIdx: number, qi: number, cardId: string, upright: boolean): string {
  const idx = lifeSixRestLayerIndex(catIdx, qi, cardId, upright);
  return stripLifeSixCatalogBandTags(LIFE_SIX_REST_ACTION[idx] ?? LIFE_SIX_REST_ACTION[0]!);
}

function masterSummaryFor(catIdx: number, qi: number, cardId: string, upright: boolean): string {
  const idx = lifeSixRestLayerIndex(catIdx, qi, cardId, upright);
  return stripLifeSixCatalogBandTags(LIFE_SIX_REST_SUM[idx] ?? LIFE_SIX_REST_SUM[0]!);
}

/** 供 `npm run tarot:life-six:emit-master-handbook`（及对照用 `tarot:life-six:freeze`）调用 */
export function buildLifeSixEngineMasterEntry(
  categoryIndex: number,
  qi: number,
  cardId: string,
  upright: boolean,
  questionText: string
): MasterQuestionCardContent {
  const psych = psychologyLayerFor(categoryIndex, qi, cardId, upright);
  const spirit = spiritLayerFor(categoryIndex, qi, cardId, upright);
  const action = actionLayerFor(categoryIndex, qi, cardId, upright);
  const sum = masterSummaryFor(categoryIndex, qi, cardId, upright);

  if (cardId.startsWith('major_')) {
    const idx = Number(cardId.slice('major_'.length));
    const i = Number.isFinite(idx) ? idx : 0;
    const cardSpeaking = majorCardSpeaking(categoryIndex, qi, i, upright, questionText);
    return { cardSpeaking, psychologyLayer: psych, spiritLayer: spirit, actionPath: action, masterSummary: sum };
  }

  const m = /^(\w+)_(\d+)$/.exec(cardId);
  if (m) {
    const suit = m[1]!;
    const num = Number(m[2]);
    const cardSpeaking = minorCardSpeaking(categoryIndex, qi, suit, num, upright, questionText, cardId);
    return { cardSpeaking, psychologyLayer: psych, spiritLayer: spirit, actionPath: action, masterSummary: sum };
  }

  const fallback = '此牌针对本题的五段式暂以通用向解读装配；请稍后重试或换牌。';
  return {
    cardSpeaking: fallback,
    psychologyLayer: fallback,
    spiritLayer: fallback,
    actionPath: fallback,
    masterSummary: fallback,
  };
}
