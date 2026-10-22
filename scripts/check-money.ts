import {
  MONEY_Q01_DECK,
  MONEY_Q02_DECK,
  MONEY_Q03_DECK,
  MONEY_Q04_DECK,
  MONEY_Q05_DECK,
  MONEY_Q06_DECK,
  MONEY_Q07_DECK,
  MONEY_Q08_DECK,
  MONEY_Q09_DECK,
  MONEY_Q10_DECK,
  MONEY_Q11_DECK,
  MONEY_Q12_DECK,
  MONEY_Q13_DECK,
  MONEY_Q14_DECK,
  MONEY_Q15_DECK,
  MONEY_Q16_DECK,
  MONEY_Q17_DECK,
  MONEY_Q18_DECK,
  MONEY_Q19_DECK,
  MONEY_Q20_DECK,
  MONEY_Q21_DECK,
  MONEY_Q22_DECK,
  MONEY_Q23_DECK,
  MONEY_Q24_DECK,
  MONEY_Q25_DECK,
  MONEY_Q26_DECK,
  MONEY_Q27_DECK,
  MONEY_Q28_DECK,
  MONEY_Q29_DECK,
  MONEY_Q30_DECK,
  MONEY_Q31_DECK,
  MONEY_Q32_DECK,
  MONEY_Q33_DECK,
  MONEY_Q34_DECK,
  MONEY_Q35_DECK,
  MONEY_Q36_DECK,
  MONEY_Q37_DECK,
  MONEY_Q38_DECK,
  MONEY_Q39_DECK,
  MONEY_Q40_DECK,
  MONEY_Q41_DECK,
  MONEY_Q42_DECK,
  MONEY_Q43_DECK,
  MONEY_Q44_DECK,
  MONEY_Q45_DECK,
  MONEY_Q46_DECK,
  MONEY_Q47_DECK,
  MONEY_Q48_DECK,
  MONEY_Q49_DECK,
  MONEY_Q50_DECK,
  MONEY_Q51_DECK,
  MONEY_Q52_DECK,
  MONEY_Q53_DECK,
  MONEY_Q54_DECK,
  MONEY_Q55_DECK,
  MONEY_Q56_DECK,
  MONEY_Q57_DECK,
  MONEY_Q58_DECK,
  MONEY_Q59_DECK,
  MONEY_Q60_DECK,
  MONEY_Q61_DECK,
  MONEY_Q62_DECK,
  MONEY_Q63_DECK,
  MONEY_Q64_DECK,
  MONEY_Q65_DECK,
  MONEY_Q66_DECK,
  MONEY_Q67_DECK,
  MONEY_Q68_DECK,
  MONEY_Q69_DECK,
  MONEY_Q70_DECK,
  MONEY_Q71_DECK,
  MONEY_Q72_DECK,
  MONEY_Q73_DECK,
  MONEY_Q74_DECK,
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

chk("m01", MONEY_Q01_DECK);
chk("m02", MONEY_Q02_DECK);
chk("m03", MONEY_Q03_DECK);
chk("m04", MONEY_Q04_DECK);
chk("m05", MONEY_Q05_DECK);
chk("m06", MONEY_Q06_DECK);
chk("m07", MONEY_Q07_DECK);
chk("m08", MONEY_Q08_DECK);
chk("m09", MONEY_Q09_DECK);
chk("m10", MONEY_Q10_DECK);
chk("m11", MONEY_Q11_DECK);
chk("m12", MONEY_Q12_DECK);
chk("m13", MONEY_Q13_DECK);
chk("m14", MONEY_Q14_DECK);
chk("m15", MONEY_Q15_DECK);
chk("m16", MONEY_Q16_DECK);
chk("m17", MONEY_Q17_DECK);
chk("m18", MONEY_Q18_DECK);
chk("m19", MONEY_Q19_DECK);
chk("m20", MONEY_Q20_DECK);
chk("m21", MONEY_Q21_DECK);
chk("m22", MONEY_Q22_DECK);
chk("m23", MONEY_Q23_DECK);
chk("m24", MONEY_Q24_DECK);
chk("m25", MONEY_Q25_DECK);
chk("m26", MONEY_Q26_DECK);
chk("m27", MONEY_Q27_DECK);
chk("m28", MONEY_Q28_DECK);
chk("m29", MONEY_Q29_DECK);
chk("m30", MONEY_Q30_DECK);
chk("m31", MONEY_Q31_DECK);
chk("m32", MONEY_Q32_DECK);
chk("m33", MONEY_Q33_DECK);
chk("m34", MONEY_Q34_DECK);
chk("m35", MONEY_Q35_DECK);
chk("m36", MONEY_Q36_DECK);
chk("m37", MONEY_Q37_DECK);
chk("m38", MONEY_Q38_DECK);
chk("m39", MONEY_Q39_DECK);
chk("m40", MONEY_Q40_DECK);
chk("m41", MONEY_Q41_DECK);
chk("m42", MONEY_Q42_DECK);
chk("m43", MONEY_Q43_DECK);
chk("m44", MONEY_Q44_DECK);
chk("m45", MONEY_Q45_DECK);
chk("m46", MONEY_Q46_DECK);
chk("m47", MONEY_Q47_DECK);
chk("m48", MONEY_Q48_DECK);
chk("m49", MONEY_Q49_DECK);
chk("m50", MONEY_Q50_DECK);
chk("m51", MONEY_Q51_DECK);
chk("m52", MONEY_Q52_DECK);
chk("m53", MONEY_Q53_DECK);
chk("m54", MONEY_Q54_DECK);
chk("m55", MONEY_Q55_DECK);
chk("m56", MONEY_Q56_DECK);
chk("m57", MONEY_Q57_DECK);
chk("m58", MONEY_Q58_DECK);
chk("m59", MONEY_Q59_DECK);
chk("m60", MONEY_Q60_DECK);
chk("m61", MONEY_Q61_DECK);
chk("m62", MONEY_Q62_DECK);
chk("m63", MONEY_Q63_DECK);
chk("m64", MONEY_Q64_DECK);
chk("m65", MONEY_Q65_DECK);
chk("m66", MONEY_Q66_DECK);
chk("m67", MONEY_Q67_DECK);
chk("m68", MONEY_Q68_DECK);
chk("m69", MONEY_Q69_DECK);
chk("m70", MONEY_Q70_DECK);
chk("m71", MONEY_Q71_DECK);
chk("m72", MONEY_Q72_DECK);
chk("m73", MONEY_Q73_DECK);
chk("m74", MONEY_Q74_DECK);
