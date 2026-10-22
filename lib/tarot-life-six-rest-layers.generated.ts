/**
 * AUTO-GENERATED — 运行 npm run tarot:life-six:emit-layers 重新生成。
 * 6×3120×4 条：心理 / 灵性 / 行动 / 收束；与 freeze 牌序一致。
 */
export function lifeSixRestLayerIndex(categoryIndex: number, qi: number, cardId: string, upright: boolean): number {
  const u = upright ? 0 : 1;
  let local: number;
  if (cardId.startsWith('major_')) {
    const mi = Number(cardId.slice('major_'.length));
    const safe = Number.isFinite(mi) ? mi : 0;
    local = safe * 2 + u;
  } else {
    const m = /^(\w+)_(\d+)$/.exec(cardId);
    if (!m) local = 0;
    else {
      const suitOrder: Record<string, number> = { wands: 0, cups: 1, swords: 2, pentacles: 3 };
      const si = suitOrder[m[1]!] ?? 0;
      const rank = Number(m[2]);
      local = 44 + si * 28 + (rank - 1) * 2 + u;
    }
  }
  return categoryIndex * 3120 + qi * 156 + local;
}

export const LIFE_SIX_REST_PSYCH: readonly string[] = [""];
export const LIFE_SIX_REST_SPIRIT: readonly string[] = [""];
export const LIFE_SIX_REST_ACTION: readonly string[] = [""];
export const LIFE_SIX_REST_SUM: readonly string[] = [""];
