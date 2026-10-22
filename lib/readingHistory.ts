/** 神谕卡解读本地记录（迷宫坛侧精简版） */
const READINGS_KEY = "labyrinthos_oracle_readings";
const MAX_READINGS = 50;

export function addReading(entry: {
  tool: string;
  question: string | null;
  summary: string;
  detail: unknown;
}): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(READINGS_KEY);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    const next = Array.isArray(list) ? list : [];
    next.unshift({
      ...entry,
      id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(READINGS_KEY, JSON.stringify(next.slice(0, MAX_READINGS)));
  } catch {
    /* ignore */
  }
}
