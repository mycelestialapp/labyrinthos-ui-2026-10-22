/**
 * 事业占问 · 大师复述确认（先确认问题，再进入抽牌）
 */

import type { CareerSubcategoryMatchResult } from '@/lib/oracleCareerSubcategoryMatch';

function hashPick(seed: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  }
  return mod > 0 ? h % mod : 0;
}

const NO_MATCH_BODIES = [
  (q: string) =>
    `我先确认一下，你现在要问的是：\n\n「${q}」\n\n如果是，我们就从这句开始请牌。`,
  (q: string) =>
    `我听到了。\n\n你此刻最关心的事业问题，是不是这句：\n\n「${q}」`,
];

const WITH_MATCH_BODIES = [
  (q: string, topic: string) =>
    `我先接住你的方向：你主要在问「${topic}」。\n\n让我确认一下原话：\n\n「${q}」\n\n如果准确，我们就继续。`,
  (q: string, topic: string) =>
    `你现在最纠结的是「${topic}」这条线。\n\n我先复述你这句：\n\n「${q}」`,
];

const LOW_CONFIDENCE_SUFFIX = [
  (match: CareerSubcategoryMatchResult) =>
    `\n\n我先抓到的是「${match.subcategory.name}」；如果你更想问「${match.alternatives[0]?.subcategory.name ?? '另一个方向'}」，可以直接点那个方向。`,
];

export function buildCareerMasterEchoQuestion(
  userText: string,
  match: CareerSubcategoryMatchResult | null,
): string {
  const q = userText.trim();
  if (!q) return '请先把你真正想问的事业问题写下来。';

  const seed = `${q}:${match?.subcategory.id ?? 'open'}`;
  if (!match) {
    return NO_MATCH_BODIES[hashPick(seed, NO_MATCH_BODIES.length)](q);
  }

  const main = WITH_MATCH_BODIES[hashPick(seed, WITH_MATCH_BODIES.length)](q, match.subcategory.name);
  if (match.confidence === 'low') {
    const suffix = LOW_CONFIDENCE_SUFFIX[hashPick(seed, LOW_CONFIDENCE_SUFFIX.length)](match);
    return `${main}${suffix}`;
  }
  return main;
}

