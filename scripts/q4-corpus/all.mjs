import { majorEntries } from "./majors.mjs";
import { minorEntries } from "./minors.mjs";

/** 牌序：大牌 0–21 正逆各一 → 权杖 → 圣杯 → 宝剑 → 星币（各 1–14 正逆） */
export const entries = [...majorEntries, ...minorEntries];
