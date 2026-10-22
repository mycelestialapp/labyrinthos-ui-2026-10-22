/**
 * AUTO-GENERATED — 重新生成：node scripts/emit-money-rest-layers.mjs
 * 3120×4 条：心理 / 灵性 / 行动 / 收束（财运），与 freeze 牌序一致。
 */
export function moneyRestLayerIndex(qi: number, cardId: string, upright: boolean): number {
  const u = upright ? 0 : 1;
  if (cardId.startsWith('major_')) {
    const mi = Number(cardId.slice('major_'.length));
    const safe = Number.isFinite(mi) ? mi : 0;
    return qi * 156 + safe * 2 + u;
  }
  const m = /^(\w+)_(\d+)$/.exec(cardId);
  if (!m) return qi * 156;
  const suitOrder: Record<string, number> = { wands: 0, cups: 1, swords: 2, pentacles: 3 };
  const si = suitOrder[m[1]!] ?? 0;
  const rank = Number(m[2]);
  const local = 44 + si * 28 + (rank - 1) * 2 + u;
  return qi * 156 + local;
}

export const MONEY_REST_PSYCH: readonly string[] = [""];
export const MONEY_REST_SPIRIT: readonly string[] = [""];
export const MONEY_REST_ACTION: readonly string[] = [""];
export const MONEY_REST_SUM: readonly string[] = [""];
