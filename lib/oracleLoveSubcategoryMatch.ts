/**
 * 感情婚姻 · 子类匹配（自输入占问 → 726 子类 + 全量触发词）
 */

import {
  LOVE_SUBCATEGORY_COUNT,
  type LoveSubcategory,
  buildLoveSubcategoryCatalog,
} from '@/lib/oracleLoveSubcategoriesCatalog';
import { LOVE_SUBCATEGORY_TRIGGERS } from '@/lib/oracleLoveSubcategoryTriggers.generated';
 
type MatchConfidence = 'high' | 'medium' | 'low';

interface RankedCandidate {
  subcategory: LoveSubcategory;
  score: number;
  matchedTriggers: string[];
}

export interface LoveSubcategoryMatchResult {
  subcategory: LoveSubcategory;
  score: number;
  matchedTriggers: string[];
  confidence: MatchConfidence;
  alternatives: Array<{
    subcategory: LoveSubcategory;
    score: number;
  }>;
}

const catalogByIndex = new Map(
  buildLoveSubcategoryCatalog().map(entry => [entry.index, entry]),
);

const LEADING_CHATTER = [
  '姐妹们',
  '姐妹',
  'bro',
  'bros',
  'guys',
  '朋友们',
  '朋友',
  '我想问',
  '我想问下',
  '我想问一下',
  '请问',
  '请问一下',
] as const;

/**
 * 清理「姐妹们/朋友们」这类口语开场，避免占问显得像玩笑。
 */
export function sanitizeLoveQuestionInput(input: string): string {
  let out = input.trim();
  if (!out) return out;

  let changed = true;
  while (changed) {
    changed = false;
    for (const chatter of LEADING_CHATTER) {
      if (out.toLowerCase().startsWith(chatter.toLowerCase())) {
        out = out.slice(chatter.length).trim();
        out = out.replace(/^[\s,，。!！?？~～:：、·\-—]+/, '');
        changed = true;
      }
    }
  }

  return out || input.trim();
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '');
}

function includesAny(text: string, words: readonly string[]): boolean {
  return words.some(word => text.includes(normalize(word)));
}

function extractMeaningTokens(name: string): string[] {
  const cleaned = name
    .replace(/[？?。！!]/g, '')
    .replace(/(怎么办|要不要|能不能|会不会|是不是|该不该|值不值得|为什么|如何|怎么|什么时候|何时)$/g, '')
    .trim();
  const chunks = cleaned.split(/[/、·]/).map(t => t.trim()).filter(Boolean);
  const tokens = new Set<string>(chunks);
  const phraseTokens = cleaned.match(/[\u4e00-\u9fa5]{2,10}|[a-zA-Z][a-zA-Z\s-]{2,}/g) ?? [];
  for (const token of phraseTokens) {
    tokens.add(token.trim());
  }
  return [...tokens].filter(t => t.length >= 2);
}

const DISAMBIGUATION_RULES: Array<{
  when: string[];
  preferNameIncludes: string[];
  avoidNameIncludes?: string[];
  bonus?: number;
}> = [
  {
    when: ['前任', '复合', '回头', '挽回', '回来'],
    preferNameIncludes: ['复合', '回头', '挽回', '前任'],
    avoidNameIncludes: ['新桃花', '相亲'],
    bonus: 5,
  },
  {
    when: ['出轨', '背叛', '第三者', '小三', '劈腿', '暧昧越界'],
    preferNameIncludes: ['出轨', '第三者', '越界', '背叛'],
    avoidNameIncludes: ['忽冷忽热', '冷暴力'],
    bonus: 5,
  },
  {
    when: ['查手机', '定位', '删聊天记录', '查岗', '监控'],
    preferNameIncludes: ['查手机', '定位', '隐私', '删聊天记录', '查岗'],
    avoidNameIncludes: ['出轨', '第三者'],
    bonus: 4,
  },
  {
    when: ['离婚', '分居', '婚姻', '要不要离开', '该走该留'],
    preferNameIncludes: ['离婚', '分居', '婚姻', '鸡肋婚姻', '挽救'],
    avoidNameIncludes: ['暗恋', '表白', '网恋'],
    bonus: 5,
  },
  {
    when: ['同性', '双性恋', '跨性别', '出柜', '彩虹', 'gay', 'les', 'queer'],
    preferNameIncludes: ['同性', '双性恋', '跨性别', '出柜', 'LGBTQ'],
    bonus: 6,
  },
  {
    when: ['结婚', '订婚', '彩礼', '见家长', '定下来', 'commit'],
    preferNameIncludes: ['结婚', '订婚', '彩礼', '见家长', '定下来'],
    avoidNameIncludes: ['分手', '离婚'],
    bonus: 4,
  },
  {
    when: ['网恋', '奔现', '聊天', '已读不回', 'ghosting', '不回消息'],
    preferNameIncludes: ['网恋', '奔现', '聊天', '已读不回', 'Ghosting'],
    bonus: 4,
  },
  {
    when: ['性生活', '无性', '亲密', '床上', 'intimacy', 'sexless'],
    preferNameIncludes: ['性', '亲密', '无性', '床'],
    bonus: 5,
  },
];

function applyDisambiguation(input: string, candidate: RankedCandidate): number {
  const normalizedInput = normalize(input);
  let delta = 0;
  for (const rule of DISAMBIGUATION_RULES) {
    if (!includesAny(normalizedInput, rule.when)) continue;
    const name = candidate.subcategory.name;
    const hitPrefer = rule.preferNameIncludes.some(t => name.includes(t));
    if (!hitPrefer) continue;
    delta += rule.bonus ?? 3;
    if (rule.avoidNameIncludes?.some(t => name.includes(t))) {
      delta -= 2;
    }
  }
  return delta;
}

function getTriggersForIndex(index: number, subcategory: LoveSubcategory): string[] {
  const fromGenerated = LOVE_SUBCATEGORY_TRIGGERS[index - 1];
  if (fromGenerated && fromGenerated.length > 0) {
    return [...fromGenerated];
  }
  return [subcategory.name.replace(/[？?/、]/g, '')];
}

function scoreSubcategory(input: string, index: number): RankedCandidate | null {
  const subcategory = catalogByIndex.get(index);
  if (!subcategory) return null;

  const normalized = normalize(input);
  const triggers = getTriggersForIndex(index, subcategory);
  const matchedTriggers: string[] = [];
  let score = 0;

  for (const trigger of triggers) {
    const t = normalize(trigger);
    if (t.length < 2) continue;
    if (normalized.includes(t)) {
      if (!matchedTriggers.includes(trigger)) matchedTriggers.push(trigger);
      score += t.length >= 8 ? 7 : t.length >= 5 ? 5 : t.length >= 3 ? 3 : 1;
      if (normalized === t) score += 4;
    }
  }

  const meaningTokens = extractMeaningTokens(subcategory.name);
  for (const token of meaningTokens) {
    const t = normalize(token);
    if (t.length >= 2 && normalized.includes(t)) {
      score += t.length >= 5 ? 6 : 4;
      if (!matchedTriggers.includes(token)) matchedTriggers.push(token);
    }
  }

  if (score === 0) return null;
  return { subcategory, score, matchedTriggers };
}

function resolveConfidence(best: RankedCandidate, second?: RankedCandidate): MatchConfidence {
  const gap = second ? best.score - second.score : best.score;
  if (best.score >= 12 && gap >= 4) return 'high';
  if (best.score >= 7 && gap >= 2) return 'medium';
  return 'low';
}

/** 匹配自输入占问（扫描全部 726 子类触发词） */
export function matchLoveSubcategory(input: string): LoveSubcategoryMatchResult | null {
  const trimmed = sanitizeLoveQuestionInput(input);
  if (!trimmed) return null;

  const candidates: RankedCandidate[] = [];
  const total = LOVE_SUBCATEGORY_COUNT;

  for (let index = 1; index <= total; index += 1) {
    const result = scoreSubcategory(trimmed, index);
    if (!result) continue;
    const adjustedScore = result.score + applyDisambiguation(trimmed, result);
    if (adjustedScore > 0) {
      candidates.push({
        ...result,
        score: adjustedScore,
      });
    }
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.matchedTriggers.length !== a.matchedTriggers.length) {
      return b.matchedTriggers.length - a.matchedTriggers.length;
    }
    return a.subcategory.index - b.subcategory.index;
  });

  const [best, second, third] = candidates;
  return {
    subcategory: best.subcategory,
    score: best.score,
    matchedTriggers: best.matchedTriggers,
    confidence: resolveConfidence(best, second),
    alternatives: [second, third]
      .filter((c): c is RankedCandidate => Boolean(c))
      .map(c => ({ subcategory: c.subcategory, score: c.score })),
  };
}

export { buildMasterEchoQuestion, buildSurfaceEchoQuestion } from '@/lib/oracleLoveConfirmEcho';
