import {
  DREAM_Q01_DECK,
  DREAM_Q02_DECK,
  DREAM_Q03_DECK,
  DREAM_Q04_DECK,
  DREAM_Q05_DECK,
  DREAM_Q06_DECK,
  DREAM_Q07_DECK,
  DREAM_Q08_DECK,
  DREAM_Q09_DECK,
  DREAM_Q10_DECK,
  DREAM_Q11_DECK,
  DREAM_Q12_DECK,
  DREAM_Q13_DECK,
  DREAM_Q14_DECK,
  DREAM_Q15_DECK,
  DREAM_Q16_DECK,
  DREAM_Q17_DECK,
  DREAM_Q18_DECK,
  DREAM_Q19_DECK,
  DREAM_Q20_DECK,
  DREAM_Q21_DECK,
  DREAM_Q22_DECK,
  DREAM_Q23_DECK,
  DREAM_Q24_DECK,
  DREAM_Q25_DECK,
  DREAM_Q26_DECK,
  DREAM_Q27_DECK,
  DREAM_Q28_DECK,
  DREAM_Q29_DECK,
  DREAM_Q30_DECK,
  DREAM_Q31_DECK,
  DREAM_Q32_DECK,
  DREAM_Q33_DECK,
  DREAM_Q34_DECK,
  DREAM_Q35_DECK,
  DREAM_Q36_DECK,
  DREAM_Q37_DECK,
  DREAM_Q38_DECK,
  DREAM_Q39_DECK,
  DREAM_Q40_DECK,
  DREAM_Q41_DECK,
  DREAM_Q42_DECK,
  DREAM_Q43_DECK,
  DREAM_Q44_DECK,
  DREAM_Q45_DECK,
  DREAM_Q46_DECK,
  DREAM_Q47_DECK,
  DREAM_Q48_DECK,
  DREAM_Q49_DECK,
  DREAM_Q50_DECK,
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

chk("d01", DREAM_Q01_DECK);
chk("d02", DREAM_Q02_DECK);
chk("d03", DREAM_Q03_DECK);
chk("d04", DREAM_Q04_DECK);
chk("d05", DREAM_Q05_DECK);
chk("d06", DREAM_Q06_DECK);
chk("d07", DREAM_Q07_DECK);
chk("d08", DREAM_Q08_DECK);
chk("d09", DREAM_Q09_DECK);
chk("d10", DREAM_Q10_DECK);
chk("d11", DREAM_Q11_DECK);
chk("d12", DREAM_Q12_DECK);
chk("d13", DREAM_Q13_DECK);
chk("d14", DREAM_Q14_DECK);
chk("d15", DREAM_Q15_DECK);
chk("d16", DREAM_Q16_DECK);
chk("d17", DREAM_Q17_DECK);
chk("d18", DREAM_Q18_DECK);
chk("d19", DREAM_Q19_DECK);
chk("d20", DREAM_Q20_DECK);
chk("d21", DREAM_Q21_DECK);
chk("d22", DREAM_Q22_DECK);
chk("d23", DREAM_Q23_DECK);
chk("d24", DREAM_Q24_DECK);
chk("d25", DREAM_Q25_DECK);
chk("d26", DREAM_Q26_DECK);
chk("d27", DREAM_Q27_DECK);
chk("d28", DREAM_Q28_DECK);
chk("d29", DREAM_Q29_DECK);
chk("d30", DREAM_Q30_DECK);
chk("d31", DREAM_Q31_DECK);
chk("d32", DREAM_Q32_DECK);
chk("d33", DREAM_Q33_DECK);
chk("d34", DREAM_Q34_DECK);
chk("d35", DREAM_Q35_DECK);
chk("d36", DREAM_Q36_DECK);
chk("d37", DREAM_Q37_DECK);
chk("d38", DREAM_Q38_DECK);
chk("d39", DREAM_Q39_DECK);
chk("d40", DREAM_Q40_DECK);
chk("d41", DREAM_Q41_DECK);
chk("d42", DREAM_Q42_DECK);
chk("d43", DREAM_Q43_DECK);
chk("d44", DREAM_Q44_DECK);
chk("d45", DREAM_Q45_DECK);
chk("d46", DREAM_Q46_DECK);
chk("d47", DREAM_Q47_DECK);
chk("d48", DREAM_Q48_DECK);
chk("d49", DREAM_Q49_DECK);
chk("d50", DREAM_Q50_DECK);
