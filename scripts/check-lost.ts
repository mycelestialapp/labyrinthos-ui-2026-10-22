import {
  LOST_Q01_DECK,
  LOST_Q02_DECK,
  LOST_Q03_DECK,
  LOST_Q04_DECK,
  LOST_Q05_DECK,
  LOST_Q06_DECK,
  LOST_Q07_DECK,
  LOST_Q08_DECK,
  LOST_Q09_DECK,
  LOST_Q10_DECK,
  LOST_Q11_DECK,
  LOST_Q12_DECK,
  LOST_Q13_DECK,
  LOST_Q14_DECK,
  LOST_Q15_DECK,
  LOST_Q16_DECK,
  LOST_Q17_DECK,
  LOST_Q18_DECK,
  LOST_Q19_DECK,
  LOST_Q20_DECK,
  LOST_Q21_DECK,
  LOST_Q22_DECK,
  LOST_Q23_DECK,
  LOST_Q24_DECK,
  LOST_Q25_DECK,
  LOST_Q26_DECK,
  LOST_Q27_DECK,
  LOST_Q28_DECK,
  LOST_Q29_DECK,
  LOST_Q30_DECK,
  LOST_Q31_DECK,
  LOST_Q32_DECK,
  LOST_Q33_DECK,
  LOST_Q34_DECK,
  LOST_Q35_DECK,
  LOST_Q36_DECK,
  LOST_Q37_DECK,
  LOST_Q38_DECK,
  LOST_Q39_DECK,
  LOST_Q40_DECK,
  LOST_Q41_DECK,
  LOST_Q42_DECK,
  LOST_Q43_DECK,
  LOST_Q44_DECK,
  LOST_Q45_DECK,
  LOST_Q46_DECK,
  LOST_Q47_DECK,
  LOST_Q48_DECK,
  LOST_Q49_DECK,
  LOST_Q50_DECK,
  LOST_Q51_DECK,
  LOST_Q52_DECK,
  LOST_Q53_DECK,
  LOST_Q54_DECK,
  LOST_Q55_DECK,
  LOST_Q56_DECK,
  LOST_Q57_DECK,
  LOST_Q58_DECK,
  LOST_Q59_DECK,
  LOST_Q60_DECK,
  LOST_Q61_DECK,
  LOST_Q62_DECK,
  LOST_Q63_DECK,
  LOST_Q64_DECK,
  LOST_Q65_DECK,
  LOST_Q66_DECK,
  LOST_Q67_DECK,
} from "../lib/tarot-western-reading/index";
import type { WesternCardReading } from "../lib/tarot-western-reading/types";

function chk(name: string, d: WesternCardReading[]) {
  const ids = d.map((x) => `${x.cardId}|${x.upright ? "u" : "r"}`);
  const bad = d.filter((x) => !x.lean || !x.verdict || !x.speak || !x.soul || !x.doToday);
  const short = d.filter(
    (x) =>
      (x.lean?.length ?? 0) < 8 ||
      (x.verdict?.length ?? 0) < 12 ||
      (x.speak?.length ?? 0) < 12 ||
      (x.soul?.length ?? 0) < 12 ||
      (x.doToday?.length ?? 0) < 12,
  );
  console.log(
    name,
    "rows",
    d.length,
    "uniq",
    new Set(ids).size,
    "cards",
    new Set(d.map((x) => x.cardId)).size,
    "empty",
    bad.length,
    "short",
    short.length,
  );
  if (short.length) {
    console.log("  short keys", short.slice(0, 8).map((x) => `${x.cardId}|${x.upright ? "u" : "r"}`));
  }
}

chk("l01", LOST_Q01_DECK);
chk("l02", LOST_Q02_DECK);
chk("l03", LOST_Q03_DECK);
chk("l04", LOST_Q04_DECK);
chk("l05", LOST_Q05_DECK);
chk("l06", LOST_Q06_DECK);
chk("l07", LOST_Q07_DECK);
chk("l08", LOST_Q08_DECK);
chk("l09", LOST_Q09_DECK);
chk("l10", LOST_Q10_DECK);
chk("l11", LOST_Q11_DECK);
chk("l12", LOST_Q12_DECK);
chk("l13", LOST_Q13_DECK);
chk("l14", LOST_Q14_DECK);
chk("l15", LOST_Q15_DECK);
chk("l16", LOST_Q16_DECK);
chk("l17", LOST_Q17_DECK);
chk("l18", LOST_Q18_DECK);
chk("l19", LOST_Q19_DECK);
chk("l20", LOST_Q20_DECK);
chk("l21", LOST_Q21_DECK);
chk("l22", LOST_Q22_DECK);
chk("l23", LOST_Q23_DECK);
chk("l24", LOST_Q24_DECK);
chk("l25", LOST_Q25_DECK);
chk("l26", LOST_Q26_DECK);
chk("l27", LOST_Q27_DECK);
chk("l28", LOST_Q28_DECK);
chk("l29", LOST_Q29_DECK);
chk("l30", LOST_Q30_DECK);
chk("l31", LOST_Q31_DECK);
chk("l32", LOST_Q32_DECK);
chk("l33", LOST_Q33_DECK);
chk("l34", LOST_Q34_DECK);
chk("l35", LOST_Q35_DECK);
chk("l36", LOST_Q36_DECK);
chk("l37", LOST_Q37_DECK);
chk("l38", LOST_Q38_DECK);
chk("l39", LOST_Q39_DECK);
chk("l40", LOST_Q40_DECK);
chk("l41", LOST_Q41_DECK);
chk("l42", LOST_Q42_DECK);
chk("l43", LOST_Q43_DECK);
chk("l44", LOST_Q44_DECK);
chk("l45", LOST_Q45_DECK);
chk("l46", LOST_Q46_DECK);
chk("l47", LOST_Q47_DECK);
chk("l48", LOST_Q48_DECK);
chk("l49", LOST_Q49_DECK);
chk("l50", LOST_Q50_DECK);
chk("l51", LOST_Q51_DECK);
chk("l52", LOST_Q52_DECK);
chk("l53", LOST_Q53_DECK);
chk("l54", LOST_Q54_DECK);
chk("l55", LOST_Q55_DECK);
chk("l56", LOST_Q56_DECK);
chk("l57", LOST_Q57_DECK);
chk("l58", LOST_Q58_DECK);
chk("l59", LOST_Q59_DECK);
chk("l60", LOST_Q60_DECK);
chk("l61", LOST_Q61_DECK);
chk("l62", LOST_Q62_DECK);
chk("l63", LOST_Q63_DECK);
chk("l64", LOST_Q64_DECK);
chk("l65", LOST_Q65_DECK);
chk("l66", LOST_Q66_DECK);
chk("l67", LOST_Q67_DECK);
