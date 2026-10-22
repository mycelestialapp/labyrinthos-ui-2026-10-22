import {
  CHOICE_Q01_DECK,
  CHOICE_Q02_DECK,
  CHOICE_Q03_DECK,
  CHOICE_Q04_DECK,
  CHOICE_Q05_DECK,
  CHOICE_Q06_DECK,
  CHOICE_Q07_DECK,
  CHOICE_Q08_DECK,
  CHOICE_Q09_DECK,
  CHOICE_Q10_DECK,
  CHOICE_Q11_DECK,
  CHOICE_Q12_DECK,
  CHOICE_Q13_DECK,
  CHOICE_Q14_DECK,
  CHOICE_Q15_DECK,
  CHOICE_Q16_DECK,
  CHOICE_Q17_DECK,
  CHOICE_Q18_DECK,
  CHOICE_Q19_DECK,
  CHOICE_Q20_DECK,
  CHOICE_Q21_DECK,
  CHOICE_Q22_DECK,
  CHOICE_Q23_DECK,
  CHOICE_Q24_DECK,
  CHOICE_Q25_DECK,
  CHOICE_Q26_DECK,
  CHOICE_Q27_DECK,
  CHOICE_Q28_DECK,
  CHOICE_Q29_DECK,
  CHOICE_Q30_DECK,
  CHOICE_Q31_DECK,
  CHOICE_Q32_DECK,
  CHOICE_Q33_DECK,
  CHOICE_Q34_DECK,
  CHOICE_Q35_DECK,
  CHOICE_Q36_DECK,
  CHOICE_Q37_DECK,
  CHOICE_Q38_DECK,
  CHOICE_Q39_DECK,
  CHOICE_Q40_DECK,
  CHOICE_Q41_DECK,
  CHOICE_Q42_DECK,
  CHOICE_Q43_DECK,
  CHOICE_Q44_DECK,
  CHOICE_Q45_DECK,
  CHOICE_Q46_DECK,
  CHOICE_Q47_DECK,
  CHOICE_Q48_DECK,
  CHOICE_Q49_DECK,
  CHOICE_Q50_DECK,
  CHOICE_Q51_DECK,
  CHOICE_Q52_DECK,
  CHOICE_Q53_DECK,
  CHOICE_Q54_DECK,
  CHOICE_Q55_DECK,
  CHOICE_Q56_DECK,
  CHOICE_Q57_DECK,
  CHOICE_Q58_DECK,
  CHOICE_Q59_DECK,
  CHOICE_Q60_DECK,
  CHOICE_Q61_DECK,
  CHOICE_Q62_DECK,
  CHOICE_Q63_DECK,
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

chk("c01", CHOICE_Q01_DECK);
chk("c02", CHOICE_Q02_DECK);
chk("c03", CHOICE_Q03_DECK);
chk("c04", CHOICE_Q04_DECK);
chk("c05", CHOICE_Q05_DECK);
chk("c06", CHOICE_Q06_DECK);
chk("c07", CHOICE_Q07_DECK);
chk("c08", CHOICE_Q08_DECK);
chk("c09", CHOICE_Q09_DECK);
chk("c10", CHOICE_Q10_DECK);
chk("c11", CHOICE_Q11_DECK);
chk("c12", CHOICE_Q12_DECK);
chk("c13", CHOICE_Q13_DECK);
chk("c14", CHOICE_Q14_DECK);
chk("c15", CHOICE_Q15_DECK);
chk("c16", CHOICE_Q16_DECK);
chk("c17", CHOICE_Q17_DECK);
chk("c18", CHOICE_Q18_DECK);
chk("c19", CHOICE_Q19_DECK);
chk("c20", CHOICE_Q20_DECK);
chk("c21", CHOICE_Q21_DECK);
chk("c22", CHOICE_Q22_DECK);
chk("c23", CHOICE_Q23_DECK);
chk("c24", CHOICE_Q24_DECK);
chk("c25", CHOICE_Q25_DECK);
chk("c26", CHOICE_Q26_DECK);
chk("c27", CHOICE_Q27_DECK);
chk("c28", CHOICE_Q28_DECK);
chk("c29", CHOICE_Q29_DECK);
chk("c30", CHOICE_Q30_DECK);
chk("c31", CHOICE_Q31_DECK);
chk("c32", CHOICE_Q32_DECK);
chk("c33", CHOICE_Q33_DECK);
chk("c34", CHOICE_Q34_DECK);
chk("c35", CHOICE_Q35_DECK);
chk("c36", CHOICE_Q36_DECK);
chk("c37", CHOICE_Q37_DECK);
chk("c38", CHOICE_Q38_DECK);
chk("c39", CHOICE_Q39_DECK);
chk("c40", CHOICE_Q40_DECK);
chk("c41", CHOICE_Q41_DECK);
chk("c42", CHOICE_Q42_DECK);
chk("c43", CHOICE_Q43_DECK);
chk("c44", CHOICE_Q44_DECK);
chk("c45", CHOICE_Q45_DECK);
chk("c46", CHOICE_Q46_DECK);
chk("c47", CHOICE_Q47_DECK);
chk("c48", CHOICE_Q48_DECK);
chk("c49", CHOICE_Q49_DECK);
chk("c50", CHOICE_Q50_DECK);
chk("c51", CHOICE_Q51_DECK);
chk("c52", CHOICE_Q52_DECK);
chk("c53", CHOICE_Q53_DECK);
chk("c54", CHOICE_Q54_DECK);
chk("c55", CHOICE_Q55_DECK);
chk("c56", CHOICE_Q56_DECK);
chk("c57", CHOICE_Q57_DECK);
chk("c58", CHOICE_Q58_DECK);
chk("c59", CHOICE_Q59_DECK);
chk("c60", CHOICE_Q60_DECK);
chk("c61", CHOICE_Q61_DECK);
chk("c62", CHOICE_Q62_DECK);
chk("c63", CHOICE_Q63_DECK);
