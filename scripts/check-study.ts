import {
  STUDY_Q01_DECK,
  STUDY_Q02_DECK,
  STUDY_Q03_DECK,
  STUDY_Q04_DECK,
  STUDY_Q05_DECK,
  STUDY_Q06_DECK,
  STUDY_Q07_DECK,
  STUDY_Q08_DECK,
  STUDY_Q09_DECK,
  STUDY_Q10_DECK,
  STUDY_Q11_DECK,
  STUDY_Q12_DECK,
  STUDY_Q13_DECK,
  STUDY_Q14_DECK,
  STUDY_Q15_DECK,
  STUDY_Q16_DECK,
  STUDY_Q17_DECK,
  STUDY_Q18_DECK,
  STUDY_Q19_DECK,
  STUDY_Q20_DECK,
  STUDY_Q21_DECK,
  STUDY_Q22_DECK,
  STUDY_Q23_DECK,
  STUDY_Q24_DECK,
  STUDY_Q25_DECK,
  STUDY_Q26_DECK,
  STUDY_Q27_DECK,
  STUDY_Q28_DECK,
  STUDY_Q29_DECK,
  STUDY_Q30_DECK,
  STUDY_Q31_DECK,
  STUDY_Q32_DECK,
  STUDY_Q33_DECK,
  STUDY_Q34_DECK,
  STUDY_Q35_DECK,
  STUDY_Q36_DECK,
  STUDY_Q37_DECK,
  STUDY_Q38_DECK,
  STUDY_Q39_DECK,
  STUDY_Q40_DECK,
  STUDY_Q41_DECK,
  STUDY_Q42_DECK,
  STUDY_Q43_DECK,
  STUDY_Q44_DECK,
  STUDY_Q45_DECK,
  STUDY_Q46_DECK,
  STUDY_Q47_DECK,
  STUDY_Q48_DECK,
  STUDY_Q49_DECK,
  STUDY_Q50_DECK,
  STUDY_Q51_DECK,
  STUDY_Q52_DECK,
  STUDY_Q53_DECK,
  STUDY_Q54_DECK,
  STUDY_Q55_DECK,
  STUDY_Q56_DECK,
  STUDY_Q57_DECK,
  STUDY_Q58_DECK,
  STUDY_Q59_DECK,
  STUDY_Q60_DECK,
  STUDY_Q61_DECK,
  STUDY_Q62_DECK,
  STUDY_Q63_DECK,
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
    for (const x of short.slice(0, 8)) {
      console.log(" short", x.cardId, x.upright ? "u" : "r", x.lean?.length, x.verdict?.length, x.speak?.length, x.soul?.length, x.doToday?.length);
    }
  }
}

chk("s01", STUDY_Q01_DECK);
chk("s02", STUDY_Q02_DECK);
chk("s03", STUDY_Q03_DECK);
chk("s04", STUDY_Q04_DECK);
chk("s05", STUDY_Q05_DECK);
chk("s06", STUDY_Q06_DECK);
chk("s07", STUDY_Q07_DECK);
chk("s08", STUDY_Q08_DECK);
chk("s09", STUDY_Q09_DECK);
chk("s10", STUDY_Q10_DECK);
chk("s11", STUDY_Q11_DECK);
chk("s12", STUDY_Q12_DECK);
chk("s13", STUDY_Q13_DECK);
chk("s14", STUDY_Q14_DECK);
chk("s15", STUDY_Q15_DECK);
chk("s16", STUDY_Q16_DECK);
chk("s17", STUDY_Q17_DECK);
chk("s18", STUDY_Q18_DECK);
chk("s19", STUDY_Q19_DECK);
chk("s20", STUDY_Q20_DECK);
chk("s21", STUDY_Q21_DECK);
chk("s22", STUDY_Q22_DECK);
chk("s23", STUDY_Q23_DECK);
chk("s24", STUDY_Q24_DECK);
chk("s25", STUDY_Q25_DECK);
chk("s26", STUDY_Q26_DECK);
chk("s27", STUDY_Q27_DECK);
chk("s28", STUDY_Q28_DECK);
chk("s29", STUDY_Q29_DECK);
chk("s30", STUDY_Q30_DECK);
chk("s31", STUDY_Q31_DECK);
chk("s32", STUDY_Q32_DECK);
chk("s33", STUDY_Q33_DECK);
chk("s34", STUDY_Q34_DECK);
chk("s35", STUDY_Q35_DECK);
chk("s36", STUDY_Q36_DECK);
chk("s37", STUDY_Q37_DECK);
chk("s38", STUDY_Q38_DECK);
chk("s39", STUDY_Q39_DECK);
chk("s40", STUDY_Q40_DECK);
chk("s41", STUDY_Q41_DECK);
chk("s42", STUDY_Q42_DECK);
chk("s43", STUDY_Q43_DECK);
chk("s44", STUDY_Q44_DECK);
chk("s45", STUDY_Q45_DECK);
chk("s46", STUDY_Q46_DECK);
chk("s47", STUDY_Q47_DECK);
chk("s48", STUDY_Q48_DECK);
chk("s49", STUDY_Q49_DECK);
chk("s50", STUDY_Q50_DECK);
chk("s51", STUDY_Q51_DECK);
chk("s52", STUDY_Q52_DECK);
chk("s53", STUDY_Q53_DECK);
chk("s54", STUDY_Q54_DECK);
chk("s55", STUDY_Q55_DECK);
chk("s56", STUDY_Q56_DECK);
chk("s57", STUDY_Q57_DECK);
chk("s58", STUDY_Q58_DECK);
chk("s59", STUDY_Q59_DECK);
chk("s60", STUDY_Q60_DECK);
chk("s61", STUDY_Q61_DECK);
chk("s62", STUDY_Q62_DECK);
chk("s63", STUDY_Q63_DECK);
