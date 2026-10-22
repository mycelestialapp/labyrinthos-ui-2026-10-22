import {
  REL_Q01_DECK,
  REL_Q02_DECK,
  REL_Q03_DECK,
  REL_Q04_DECK,
  REL_Q05_DECK,
  REL_Q06_DECK,
  REL_Q07_DECK,
  REL_Q08_DECK,
  REL_Q09_DECK,
  REL_Q10_DECK,
  REL_Q11_DECK,
  REL_Q12_DECK,
  REL_Q13_DECK,
  REL_Q14_DECK,
  REL_Q15_DECK,
  REL_Q16_DECK,
  REL_Q17_DECK,
  REL_Q18_DECK,
  REL_Q19_DECK,
  REL_Q20_DECK,
  REL_Q21_DECK,
  REL_Q22_DECK,
  REL_Q23_DECK,
  REL_Q24_DECK,
  REL_Q25_DECK,
  REL_Q26_DECK,
  REL_Q27_DECK,
  REL_Q28_DECK,
  REL_Q29_DECK,
  REL_Q30_DECK,
  REL_Q31_DECK,
  REL_Q32_DECK,
  REL_Q33_DECK,
  REL_Q34_DECK,
  REL_Q35_DECK,
  REL_Q36_DECK,
  REL_Q37_DECK,
  REL_Q38_DECK,
  REL_Q39_DECK,
  REL_Q40_DECK,
  REL_Q41_DECK,
  REL_Q42_DECK,
  REL_Q43_DECK,
  REL_Q44_DECK,
  REL_Q45_DECK,
  REL_Q46_DECK,
  REL_Q47_DECK,
  REL_Q48_DECK,
  REL_Q49_DECK,
  REL_Q50_DECK,
  REL_Q51_DECK,
  REL_Q52_DECK,
  REL_Q53_DECK,
  REL_Q54_DECK,
  REL_Q55_DECK,
  REL_Q56_DECK,
  REL_Q57_DECK,
  REL_Q58_DECK,
  REL_Q59_DECK,
  REL_Q60_DECK,
  REL_Q61_DECK,
  REL_Q62_DECK,
  REL_Q63_DECK,
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

chk("r01", REL_Q01_DECK);
chk("r02", REL_Q02_DECK);
chk("r03", REL_Q03_DECK);
chk("r04", REL_Q04_DECK);
chk("r05", REL_Q05_DECK);
chk("r06", REL_Q06_DECK);
chk("r07", REL_Q07_DECK);
chk("r08", REL_Q08_DECK);
chk("r09", REL_Q09_DECK);
chk("r10", REL_Q10_DECK);
chk("r11", REL_Q11_DECK);
chk("r12", REL_Q12_DECK);
chk("r13", REL_Q13_DECK);
chk("r14", REL_Q14_DECK);
chk("r15", REL_Q15_DECK);
chk("r16", REL_Q16_DECK);
chk("r17", REL_Q17_DECK);
chk("r18", REL_Q18_DECK);
chk("r19", REL_Q19_DECK);
chk("r20", REL_Q20_DECK);
chk("r21", REL_Q21_DECK);
chk("r22", REL_Q22_DECK);
chk("r23", REL_Q23_DECK);
chk("r24", REL_Q24_DECK);
chk("r25", REL_Q25_DECK);
chk("r26", REL_Q26_DECK);
chk("r27", REL_Q27_DECK);
chk("r28", REL_Q28_DECK);
chk("r29", REL_Q29_DECK);
chk("r30", REL_Q30_DECK);
chk("r31", REL_Q31_DECK);
chk("r32", REL_Q32_DECK);
chk("r33", REL_Q33_DECK);
chk("r34", REL_Q34_DECK);
chk("r35", REL_Q35_DECK);
chk("r36", REL_Q36_DECK);
chk("r37", REL_Q37_DECK);
chk("r38", REL_Q38_DECK);
chk("r39", REL_Q39_DECK);
chk("r40", REL_Q40_DECK);
chk("r41", REL_Q41_DECK);
chk("r42", REL_Q42_DECK);
chk("r43", REL_Q43_DECK);
chk("r44", REL_Q44_DECK);
chk("r45", REL_Q45_DECK);
chk("r46", REL_Q46_DECK);
chk("r47", REL_Q47_DECK);
chk("r48", REL_Q48_DECK);
chk("r49", REL_Q49_DECK);
chk("r50", REL_Q50_DECK);
chk("r51", REL_Q51_DECK);
chk("r52", REL_Q52_DECK);
chk("r53", REL_Q53_DECK);
chk("r54", REL_Q54_DECK);
chk("r55", REL_Q55_DECK);
chk("r56", REL_Q56_DECK);
chk("r57", REL_Q57_DECK);
chk("r58", REL_Q58_DECK);
chk("r59", REL_Q59_DECK);
chk("r60", REL_Q60_DECK);
chk("r61", REL_Q61_DECK);
chk("r62", REL_Q62_DECK);
chk("r63", REL_Q63_DECK);
