import {
  CAREER_Q01_DECK,
  CAREER_Q02_DECK,
  CAREER_Q03_DECK,
  CAREER_Q04_DECK,
  CAREER_Q05_DECK,
  CAREER_Q06_DECK,
  CAREER_Q07_DECK,
  CAREER_Q08_DECK,
  CAREER_Q09_DECK,
  CAREER_Q10_DECK,
  CAREER_Q11_DECK,
  CAREER_Q12_DECK,
  CAREER_Q13_DECK,
  CAREER_Q14_DECK,
  CAREER_Q15_DECK,
  CAREER_Q16_DECK,
  CAREER_Q17_DECK,
  CAREER_Q18_DECK,
  CAREER_Q19_DECK,
  CAREER_Q20_DECK,
  CAREER_Q21_DECK,
  CAREER_Q22_DECK,
  CAREER_Q23_DECK,
  CAREER_Q24_DECK,
  CAREER_Q25_DECK,
  CAREER_Q26_DECK,
  CAREER_Q27_DECK,
  CAREER_Q28_DECK,
  CAREER_Q29_DECK,
  CAREER_Q30_DECK,
  CAREER_Q31_DECK,
  CAREER_Q32_DECK,
  CAREER_Q33_DECK,
  CAREER_Q34_DECK,
  CAREER_Q35_DECK,
  CAREER_Q36_DECK,
  CAREER_Q37_DECK,
  CAREER_Q38_DECK,
  CAREER_Q39_DECK,
  CAREER_Q40_DECK,
  CAREER_Q41_DECK,
  CAREER_Q42_DECK,
  CAREER_Q43_DECK,
  CAREER_Q44_DECK,
  CAREER_Q45_DECK,
  CAREER_Q46_DECK,
  CAREER_Q47_DECK,
  CAREER_Q48_DECK,
  CAREER_Q49_DECK,
  CAREER_Q50_DECK,
  CAREER_Q51_DECK,
  CAREER_Q52_DECK,
  CAREER_Q53_DECK,
  CAREER_Q54_DECK,
  CAREER_Q55_DECK,
  CAREER_Q56_DECK,
  CAREER_Q57_DECK,
  CAREER_Q58_DECK,
  CAREER_Q59_DECK,
  CAREER_Q60_DECK,
  CAREER_Q61_DECK,
  CAREER_Q62_DECK,
  CAREER_Q63_DECK,
  CAREER_Q64_DECK,
  CAREER_Q65_DECK,
  CAREER_Q66_DECK,
  CAREER_Q67_DECK,
  CAREER_Q68_DECK,
  CAREER_Q69_DECK,
  CAREER_Q70_DECK,
  CAREER_Q71_DECK,
  CAREER_Q72_DECK,
  CAREER_Q73_DECK,
  CAREER_Q74_DECK,
  CAREER_Q75_DECK,
  CAREER_Q76_DECK,
  CAREER_Q77_DECK,
  CAREER_Q78_DECK,
  CAREER_Q79_DECK,
  CAREER_Q80_DECK,
  CAREER_Q81_DECK,
  CAREER_Q82_DECK,
  CAREER_Q83_DECK,
  CAREER_Q84_DECK,
  CAREER_Q85_DECK,
  CAREER_Q86_DECK,
  CAREER_Q87_DECK,
  CAREER_Q88_DECK,
  CAREER_Q89_DECK,
  CAREER_Q90_DECK,
  CAREER_Q91_DECK,
  CAREER_Q92_DECK,
  CAREER_Q93_DECK,
  CAREER_Q94_DECK,
  CAREER_Q95_DECK,
  CAREER_Q96_DECK,
  CAREER_Q97_DECK,
  CAREER_Q98_DECK,
  CAREER_Q99_DECK,
  CAREER_Q100_DECK,
  CAREER_Q101_DECK,
  CAREER_Q102_DECK,
  CAREER_Q103_DECK,
  CAREER_Q104_DECK,
  CAREER_Q105_DECK,
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

chk("c01", CAREER_Q01_DECK);
chk("c02", CAREER_Q02_DECK);
chk("c03", CAREER_Q03_DECK);
chk("c04", CAREER_Q04_DECK);
chk("c05", CAREER_Q05_DECK);
chk("c06", CAREER_Q06_DECK);
chk("c07", CAREER_Q07_DECK);
chk("c08", CAREER_Q08_DECK);
chk("c09", CAREER_Q09_DECK);
chk("c10", CAREER_Q10_DECK);
chk("c11", CAREER_Q11_DECK);
chk("c12", CAREER_Q12_DECK);
chk("c13", CAREER_Q13_DECK);
chk("c14", CAREER_Q14_DECK);
chk("c15", CAREER_Q15_DECK);
chk("c16", CAREER_Q16_DECK);
chk("c17", CAREER_Q17_DECK);
chk("c18", CAREER_Q18_DECK);
chk("c19", CAREER_Q19_DECK);
chk("c20", CAREER_Q20_DECK);
chk("c21", CAREER_Q21_DECK);
chk("c22", CAREER_Q22_DECK);
chk("c23", CAREER_Q23_DECK);
chk("c24", CAREER_Q24_DECK);
chk("c25", CAREER_Q25_DECK);
chk("c26", CAREER_Q26_DECK);
chk("c27", CAREER_Q27_DECK);
chk("c28", CAREER_Q28_DECK);
chk("c29", CAREER_Q29_DECK);
chk("c30", CAREER_Q30_DECK);
chk("c31", CAREER_Q31_DECK);
chk("c32", CAREER_Q32_DECK);
chk("c33", CAREER_Q33_DECK);
chk("c34", CAREER_Q34_DECK);
chk("c35", CAREER_Q35_DECK);
chk("c36", CAREER_Q36_DECK);
chk("c37", CAREER_Q37_DECK);
chk("c38", CAREER_Q38_DECK);
chk("c39", CAREER_Q39_DECK);
chk("c40", CAREER_Q40_DECK);
chk("c41", CAREER_Q41_DECK);
chk("c42", CAREER_Q42_DECK);
chk("c43", CAREER_Q43_DECK);
chk("c44", CAREER_Q44_DECK);
chk("c45", CAREER_Q45_DECK);
chk("c46", CAREER_Q46_DECK);
chk("c47", CAREER_Q47_DECK);
chk("c48", CAREER_Q48_DECK);
chk("c49", CAREER_Q49_DECK);
chk("c50", CAREER_Q50_DECK);
chk("c51", CAREER_Q51_DECK);
chk("c52", CAREER_Q52_DECK);
chk("c53", CAREER_Q53_DECK);
chk("c54", CAREER_Q54_DECK);
chk("c55", CAREER_Q55_DECK);
chk("c56", CAREER_Q56_DECK);
chk("c57", CAREER_Q57_DECK);
chk("c58", CAREER_Q58_DECK);
chk("c59", CAREER_Q59_DECK);
chk("c60", CAREER_Q60_DECK);
chk("c61", CAREER_Q61_DECK);
chk("c62", CAREER_Q62_DECK);
chk("c63", CAREER_Q63_DECK);
chk("c64", CAREER_Q64_DECK);
chk("c65", CAREER_Q65_DECK);
chk("c66", CAREER_Q66_DECK);
chk("c67", CAREER_Q67_DECK);
chk("c68", CAREER_Q68_DECK);
chk("c69", CAREER_Q69_DECK);
chk("c70", CAREER_Q70_DECK);
chk("c71", CAREER_Q71_DECK);
chk("c72", CAREER_Q72_DECK);
chk("c73", CAREER_Q73_DECK);
chk("c74", CAREER_Q74_DECK);
chk("c75", CAREER_Q75_DECK);
chk("c76", CAREER_Q76_DECK);
chk("c77", CAREER_Q77_DECK);
chk("c78", CAREER_Q78_DECK);
chk("c79", CAREER_Q79_DECK);
chk("c80", CAREER_Q80_DECK);
chk("c81", CAREER_Q81_DECK);
chk("c82", CAREER_Q82_DECK);
chk("c83", CAREER_Q83_DECK);
chk("c84", CAREER_Q84_DECK);
chk("c85", CAREER_Q85_DECK);
chk("c86", CAREER_Q86_DECK);
chk("c87", CAREER_Q87_DECK);
chk("c88", CAREER_Q88_DECK);
chk("c89", CAREER_Q89_DECK);
chk("c90", CAREER_Q90_DECK);
chk("c91", CAREER_Q91_DECK);
chk("c92", CAREER_Q92_DECK);
chk("c93", CAREER_Q93_DECK);
chk("c94", CAREER_Q94_DECK);
chk("c95", CAREER_Q95_DECK);
chk("c96", CAREER_Q96_DECK);
chk("c97", CAREER_Q97_DECK);
chk("c98", CAREER_Q98_DECK);
chk("c99", CAREER_Q99_DECK);
chk("c100", CAREER_Q100_DECK);
chk("c101", CAREER_Q101_DECK);
chk("c102", CAREER_Q102_DECK);
chk("c103", CAREER_Q103_DECK);
chk("c104", CAREER_Q104_DECK);
chk("c105", CAREER_Q105_DECK);
