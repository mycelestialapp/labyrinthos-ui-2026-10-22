import {
  HEALTH_Q01_DECK,
  HEALTH_Q02_DECK,
  HEALTH_Q03_DECK,
  HEALTH_Q04_DECK,
  HEALTH_Q05_DECK,
  HEALTH_Q06_DECK,
  HEALTH_Q07_DECK,
  HEALTH_Q08_DECK,
  HEALTH_Q09_DECK,
  HEALTH_Q10_DECK,
  HEALTH_Q11_DECK,
  HEALTH_Q12_DECK,
  HEALTH_Q13_DECK,
  HEALTH_Q14_DECK,
  HEALTH_Q15_DECK,
  HEALTH_Q16_DECK,
  HEALTH_Q17_DECK,
  HEALTH_Q18_DECK,
  HEALTH_Q19_DECK,
  HEALTH_Q20_DECK,
  HEALTH_Q21_DECK,
  HEALTH_Q22_DECK,
  HEALTH_Q23_DECK,
  HEALTH_Q24_DECK,
  HEALTH_Q25_DECK,
  HEALTH_Q26_DECK,
  HEALTH_Q27_DECK,
  HEALTH_Q28_DECK,
  HEALTH_Q29_DECK,
  HEALTH_Q30_DECK,
  HEALTH_Q31_DECK,
  HEALTH_Q32_DECK,
  HEALTH_Q33_DECK,
  HEALTH_Q34_DECK,
  HEALTH_Q35_DECK,
  HEALTH_Q36_DECK,
  HEALTH_Q37_DECK,
  HEALTH_Q38_DECK,
  HEALTH_Q39_DECK,
  HEALTH_Q40_DECK,
  HEALTH_Q41_DECK,
  HEALTH_Q42_DECK,
  HEALTH_Q43_DECK,
  HEALTH_Q44_DECK,
  HEALTH_Q45_DECK,
  HEALTH_Q46_DECK,
  HEALTH_Q47_DECK,
  HEALTH_Q48_DECK,
  HEALTH_Q49_DECK,
  HEALTH_Q50_DECK,
  HEALTH_Q51_DECK,
  HEALTH_Q52_DECK,
  HEALTH_Q53_DECK,
  HEALTH_Q54_DECK,
  HEALTH_Q55_DECK,
  HEALTH_Q56_DECK,
  HEALTH_Q57_DECK,
  HEALTH_Q58_DECK,
  HEALTH_Q59_DECK,
  HEALTH_Q60_DECK,
  HEALTH_Q61_DECK,
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

chk("h01", HEALTH_Q01_DECK);
chk("h02", HEALTH_Q02_DECK);
chk("h03", HEALTH_Q03_DECK);
chk("h04", HEALTH_Q04_DECK);
chk("h05", HEALTH_Q05_DECK);
chk("h06", HEALTH_Q06_DECK);
chk("h07", HEALTH_Q07_DECK);
chk("h08", HEALTH_Q08_DECK);
chk("h09", HEALTH_Q09_DECK);
chk("h10", HEALTH_Q10_DECK);
chk("h11", HEALTH_Q11_DECK);
chk("h12", HEALTH_Q12_DECK);
chk("h13", HEALTH_Q13_DECK);
chk("h14", HEALTH_Q14_DECK);
chk("h15", HEALTH_Q15_DECK);
chk("h16", HEALTH_Q16_DECK);
chk("h17", HEALTH_Q17_DECK);
chk("h18", HEALTH_Q18_DECK);
chk("h19", HEALTH_Q19_DECK);
chk("h20", HEALTH_Q20_DECK);
chk("h21", HEALTH_Q21_DECK);
chk("h22", HEALTH_Q22_DECK);
chk("h23", HEALTH_Q23_DECK);
chk("h24", HEALTH_Q24_DECK);
chk("h25", HEALTH_Q25_DECK);
chk("h26", HEALTH_Q26_DECK);
chk("h27", HEALTH_Q27_DECK);
chk("h28", HEALTH_Q28_DECK);
chk("h29", HEALTH_Q29_DECK);
chk("h30", HEALTH_Q30_DECK);
chk("h31", HEALTH_Q31_DECK);
chk("h32", HEALTH_Q32_DECK);
chk("h33", HEALTH_Q33_DECK);
chk("h34", HEALTH_Q34_DECK);
chk("h35", HEALTH_Q35_DECK);
chk("h36", HEALTH_Q36_DECK);
chk("h37", HEALTH_Q37_DECK);
chk("h38", HEALTH_Q38_DECK);
chk("h39", HEALTH_Q39_DECK);
chk("h40", HEALTH_Q40_DECK);
chk("h41", HEALTH_Q41_DECK);
chk("h42", HEALTH_Q42_DECK);
chk("h43", HEALTH_Q43_DECK);
chk("h44", HEALTH_Q44_DECK);
chk("h45", HEALTH_Q45_DECK);
chk("h46", HEALTH_Q46_DECK);
chk("h47", HEALTH_Q47_DECK);
chk("h48", HEALTH_Q48_DECK);
chk("h49", HEALTH_Q49_DECK);
chk("h50", HEALTH_Q50_DECK);
chk("h51", HEALTH_Q51_DECK);
chk("h52", HEALTH_Q52_DECK);
chk("h53", HEALTH_Q53_DECK);
chk("h54", HEALTH_Q54_DECK);
chk("h55", HEALTH_Q55_DECK);
chk("h56", HEALTH_Q56_DECK);
chk("h57", HEALTH_Q57_DECK);
chk("h58", HEALTH_Q58_DECK);
chk("h59", HEALTH_Q59_DECK);
chk("h60", HEALTH_Q60_DECK);
chk("h61", HEALTH_Q61_DECK);
