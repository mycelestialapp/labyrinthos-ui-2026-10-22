import type { TarotCardDef } from "@/lib/tarot-deck-zh";

export type TarotDrawnCard = {
  card: TarotCardDef;
  reversed: boolean;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * 不放回抽取 n 张；同一 question + spread + reversed 选项 + salt 可复现同一牌面（便于复盘）。
 */
export function drawTarotCards(
  deck: TarotCardDef[],
  count: number,
  opts: { allowReversed: boolean; seedSalt: string },
): TarotDrawnCard[] {
  if (count < 1 || count > deck.length) return [];
  const rand = mulberry32(hashSeed(opts.seedSalt));
  const idxs = deck.map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [idxs[i], idxs[j]] = [idxs[j]!, idxs[i]!];
  }
  const pick = idxs.slice(0, count).map((i) => deck[i]!);
  return pick.map((card) => ({
    card,
    reversed: opts.allowReversed ? rand() < 0.5 : false,
  }));
}
