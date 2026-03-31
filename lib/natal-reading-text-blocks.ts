/** 与 `natal-reading-instrument-bodies-zh` 正文分段一致：首段组（共鸣层）↔ 空行 ↔ 次段组（精密层）。 */

export function firstNarrativeBlock(text: string): string {
  const parts = text
    .trim()
    .split(/\n\n+/)
    .map((x) => x.trim())
    .filter(Boolean);
  return parts[0] ?? text.trim();
}

export function secondNarrativeBlock(text: string): string {
  const parts = text
    .trim()
    .split(/\n\n+/)
    .map((x) => x.trim())
    .filter(Boolean);
  return parts[1] ?? parts[0] ?? text.trim();
}
