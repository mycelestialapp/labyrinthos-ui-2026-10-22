export type TarotSacredHistoryEntry = {
  tool: string;
  question: string;
  summary: string;
  detail?: unknown;
};

const KEY = "labyrinthos_tarot_sacred_history_v1";

/** 轻量本地备忘：供日后若接「阅读历史」页时读取 */
export function addTarotSacredReading(entry: TarotSacredHistoryEntry): void {
  try {
    const prev = JSON.parse(localStorage.getItem(KEY) || "[]") as unknown[];
    if (!Array.isArray(prev)) return;
    prev.unshift({ ...entry, at: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(prev.slice(0, 40)));
  } catch {
    /* ignore */
  }
}
