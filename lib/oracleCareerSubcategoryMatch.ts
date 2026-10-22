/**
 * 事业工作 · 子类匹配（自输入占问 → 600 子类 + 全量触发词）
 */

import {
  CAREER_SUBCATEGORY_COUNT,
  type CareerSubcategory,
  buildCareerSubcategoryCatalog,
} from '@/lib/oracleCareerSubcategoriesCatalog';
import { CAREER_SUBCATEGORY_TRIGGERS } from '@/lib/oracleCareerSubcategoryTriggers.generated';

type MatchConfidence = 'high' | 'medium' | 'low';

interface RankedCandidate {
  subcategory: CareerSubcategory;
  score: number;
  matchedTriggers: string[];
}

export interface CareerSubcategoryMatchResult {
  subcategory: CareerSubcategory;
  score: number;
  matchedTriggers: string[];
  confidence: MatchConfidence;
  alternatives: Array<{
    subcategory: CareerSubcategory;
    score: number;
  }>;
}

const catalogByIndex = new Map(
  buildCareerSubcategoryCatalog().map(entry => [entry.index, entry]),
);

const LEADING_CHATTER = [
  '朋友们',
  '朋友',
  '兄弟们',
  '姐妹们',
  '我想问',
  '我想问下',
  '我想问一下',
  '请问',
  '请问一下',
] as const;

export function sanitizeCareerQuestionInput(input: string): string {
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

function getTriggersForIndex(index: number, subcategory: CareerSubcategory): string[] {
  const generated = CAREER_SUBCATEGORY_TRIGGERS[index - 1];
  if (generated && generated.length > 0) return [...generated];
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
      score += t.length >= 8 ? 8 : t.length >= 5 ? 6 : t.length >= 3 ? 4 : 2;
      if (normalized === t) score += 5;
    }
  }

  if (score === 0) return null;
  return { subcategory, score, matchedTriggers };
}

function resolveConfidence(best: RankedCandidate, second?: RankedCandidate): MatchConfidence {
  const gap = second ? best.score - second.score : best.score;
  if (best.score >= 15 && gap >= 5) return 'high';
  if (best.score >= 9 && gap >= 3) return 'medium';
  return 'low';
}

export function matchCareerSubcategory(input: string): CareerSubcategoryMatchResult | null {
  const trimmed = sanitizeCareerQuestionInput(input);
  if (!trimmed) return null;

  const candidates: RankedCandidate[] = [];
  for (let index = 1; index <= CAREER_SUBCATEGORY_COUNT; index += 1) {
    const result = scoreSubcategory(trimmed, index);
    if (result) candidates.push(result);
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

