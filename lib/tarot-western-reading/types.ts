/**
 * 西方塔罗 · 解读1
 * 每一道具体题 × 全套 78 张 × 正逆，各一篇完整成稿。按牌序写，正完写逆，不问、不拼装。
 */

export type WesternCardReading = {
  cardId: string;
  nameZh: string;
  upright: boolean;
  /** 用户第一眼看见的判断，必须明确 */
  lean: string;
  verdict: string;
  speak: string;
  soul: string;
  doToday: string;
};

export const LOVE_Q01 = "他／她现在到底怎么看我？";

export function formatWesternCardReading(r: WesternCardReading): string {
  const ori = r.upright ? "正位" : "逆位";
  return [
    `【判断】${r.lean}`,
    "",
    r.verdict,
    "",
    `【这张牌对你说】${r.nameZh}·${ori}`,
    r.speak,
    "",
    "【灵魂上】",
    r.soul,
    "",
    "【今天就做这一步】",
    r.doToday,
  ].join("\n");
}

export function readingKey(cardId: string, upright: boolean): string {
  return `${cardId}|${upright ? "u" : "r"}`;
}

export function r(
  cardId: string,
  nameZh: string,
  upright: boolean,
  lean: string,
  verdict: string,
  speak: string,
  soul: string,
  doToday: string,
): WesternCardReading {
  return { cardId, nameZh, upright, lean, verdict, speak, soul, doToday };
}
