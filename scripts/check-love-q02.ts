import {
  LOVE_Q01_DECK,
  LOVE_Q02_DECK,
  LOVE_Q03_DECK,
  LOVE_Q04_DECK,
  LOVE_Q05_DECK,
  LOVE_Q06_DECK,
  LOVE_Q07_DECK,
  LOVE_Q08_DECK,
  LOVE_Q09_DECK,
  LOVE_Q10_DECK,
  LOVE_Q11_DECK,
  LOVE_Q12_DECK,
  LOVE_Q13_DECK,
  LOVE_Q14_DECK,
  LOVE_Q15_DECK,
  LOVE_Q16_DECK,
  LOVE_Q17_DECK,
  LOVE_Q18_DECK,
  LOVE_Q19_DECK,
  LOVE_Q20_DECK,
  LOVE_Q21_DECK,
  LOVE_Q22_DECK,
  LOVE_Q23_DECK,
  LOVE_Q24_DECK,
  LOVE_Q25_DECK,
  LOVE_Q26_DECK,
  LOVE_Q27_DECK,
  LOVE_Q28_DECK,
  LOVE_Q29_DECK,
  LOVE_Q30_DECK,
  LOVE_Q31_DECK,
  LOVE_Q32_DECK,
  LOVE_Q33_DECK,
  LOVE_Q34_DECK,
  LOVE_Q35_DECK,
  LOVE_Q36_DECK,
  LOVE_Q37_DECK,
  LOVE_Q38_DECK,
  LOVE_Q39_DECK,
  LOVE_Q40_DECK,
  LOVE_Q41_DECK,
  LOVE_Q42_DECK,
  LOVE_Q43_DECK,
  LOVE_Q44_DECK,
  LOVE_Q45_DECK,
  LOVE_Q46_DECK,
  LOVE_Q47_DECK,
  LOVE_Q48_DECK,
  LOVE_Q49_DECK,
  LOVE_Q50_DECK,
  LOVE_Q51_DECK,
  LOVE_Q52_DECK,
  LOVE_Q53_DECK,
  LOVE_Q54_DECK,
  LOVE_Q55_DECK,
  LOVE_Q56_DECK,
  LOVE_Q57_DECK,
  LOVE_Q58_DECK,
  LOVE_Q59_DECK,
  LOVE_Q60_DECK,
  LOVE_Q61_DECK,
  LOVE_Q62_DECK,
  LOVE_Q63_DECK,
  LOVE_Q64_DECK,
  LOVE_Q65_DECK,
  LOVE_Q66_DECK,
  LOVE_Q67_DECK,
  LOVE_Q68_DECK,
  LOVE_Q69_DECK,
  LOVE_Q70_DECK,
  LOVE_Q71_DECK,
  LOVE_Q72_DECK,
  LOVE_Q73_DECK,
  LOVE_Q74_DECK,
  LOVE_Q75_DECK,
  LOVE_Q76_DECK,
  LOVE_Q77_DECK,
  LOVE_Q78_DECK,
  LOVE_Q79_DECK,
  LOVE_Q80_DECK,
  LOVE_Q81_DECK,
  LOVE_Q82_DECK,
  LOVE_Q83_DECK,
  LOVE_Q84_DECK,
  LOVE_Q85_DECK,
  LOVE_Q86_DECK,
  LOVE_Q87_DECK,
  LOVE_Q88_DECK,
  LOVE_Q89_DECK,
  LOVE_Q90_DECK,
  LOVE_Q91_DECK,
  LOVE_Q92_DECK,
  LOVE_Q93_DECK,
  LOVE_Q94_DECK,
  LOVE_Q95_DECK,
  LOVE_Q96_DECK,
  LOVE_Q97_DECK,
  LOVE_Q98_DECK,
  LOVE_Q99_DECK,
  LOVE_Q100_DECK,
  LOVE_Q101_DECK,
  LOVE_Q102_DECK,
  LOVE_Q103_DECK,
  LOVE_Q104_DECK,
  LOVE_Q105_DECK,
  LOVE_Q106_DECK,
  LOVE_Q107_DECK,
  LOVE_Q108_DECK,
  LOVE_Q109_DECK,
  LOVE_Q110_DECK,
  LOVE_Q111_DECK,
  LOVE_Q112_DECK,
  LOVE_Q113_DECK,
  LOVE_Q114_DECK,
  LOVE_Q115_DECK,
  LOVE_Q116_DECK,
  LOVE_Q117_DECK,
  LOVE_Q118_DECK,
  LOVE_Q119_DECK,
  LOVE_Q120_DECK,
  LOVE_Q121_DECK,
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

chk("q01", LOVE_Q01_DECK);
chk("q02", LOVE_Q02_DECK);
chk("q03", LOVE_Q03_DECK);
chk("q04", LOVE_Q04_DECK);
chk("q05", LOVE_Q05_DECK);
chk("q06", LOVE_Q06_DECK);
chk("q07", LOVE_Q07_DECK);
chk("q08", LOVE_Q08_DECK);
chk("q09", LOVE_Q09_DECK);
chk("q10", LOVE_Q10_DECK);
chk("q11", LOVE_Q11_DECK);
chk("q12", LOVE_Q12_DECK);
chk("q13", LOVE_Q13_DECK);
chk("q14", LOVE_Q14_DECK);
chk("q15", LOVE_Q15_DECK);
chk("q16", LOVE_Q16_DECK);
chk("q17", LOVE_Q17_DECK);
chk("q18", LOVE_Q18_DECK);
chk("q19", LOVE_Q19_DECK);
chk("q20", LOVE_Q20_DECK);
chk("q21", LOVE_Q21_DECK);
chk("q22", LOVE_Q22_DECK);
chk("q23", LOVE_Q23_DECK);
chk("q24", LOVE_Q24_DECK);
chk("q25", LOVE_Q25_DECK);
chk("q26", LOVE_Q26_DECK);
chk("q27", LOVE_Q27_DECK);
chk("q28", LOVE_Q28_DECK);
chk("q29", LOVE_Q29_DECK);
chk("q30", LOVE_Q30_DECK);
chk("q31", LOVE_Q31_DECK);
chk("q32", LOVE_Q32_DECK);
chk("q33", LOVE_Q33_DECK);
chk("q34", LOVE_Q34_DECK);
chk("q35", LOVE_Q35_DECK);
chk("q36", LOVE_Q36_DECK);
chk("q37", LOVE_Q37_DECK);
chk("q38", LOVE_Q38_DECK);
chk("q39", LOVE_Q39_DECK);
chk("q40", LOVE_Q40_DECK);
chk("q41", LOVE_Q41_DECK);
chk("q42", LOVE_Q42_DECK);
chk("q43", LOVE_Q43_DECK);
chk("q44", LOVE_Q44_DECK);
chk("q45", LOVE_Q45_DECK);
chk("q46", LOVE_Q46_DECK);
chk("q47", LOVE_Q47_DECK);
chk("q48", LOVE_Q48_DECK);
chk("q49", LOVE_Q49_DECK);
chk("q50", LOVE_Q50_DECK);
chk("q51", LOVE_Q51_DECK);
chk("q52", LOVE_Q52_DECK);
chk("q53", LOVE_Q53_DECK);
chk("q54", LOVE_Q54_DECK);
chk("q55", LOVE_Q55_DECK);
chk("q56", LOVE_Q56_DECK);
chk("q57", LOVE_Q57_DECK);
chk("q58", LOVE_Q58_DECK);
chk("q59", LOVE_Q59_DECK);
chk("q60", LOVE_Q60_DECK);
chk("q61", LOVE_Q61_DECK);
chk("q62", LOVE_Q62_DECK);
chk("q63", LOVE_Q63_DECK);
chk("q64", LOVE_Q64_DECK);
chk("q65", LOVE_Q65_DECK);
chk("q66", LOVE_Q66_DECK);
chk("q67", LOVE_Q67_DECK);
chk("q68", LOVE_Q68_DECK);
chk("q69", LOVE_Q69_DECK);
chk("q70", LOVE_Q70_DECK);
chk("q71", LOVE_Q71_DECK);
chk("q72", LOVE_Q72_DECK);
chk("q73", LOVE_Q73_DECK);
chk("q74", LOVE_Q74_DECK);
chk("q75", LOVE_Q75_DECK);
chk("q76", LOVE_Q76_DECK);
chk("q77", LOVE_Q77_DECK);
chk("q78", LOVE_Q78_DECK);
chk("q79", LOVE_Q79_DECK);
chk("q80", LOVE_Q80_DECK);
chk("q81", LOVE_Q81_DECK);
chk("q82", LOVE_Q82_DECK);
chk("q83", LOVE_Q83_DECK);
chk("q84", LOVE_Q84_DECK);
chk("q85", LOVE_Q85_DECK);
chk("q86", LOVE_Q86_DECK);
chk("q87", LOVE_Q87_DECK);
chk("q88", LOVE_Q88_DECK);
chk("q89", LOVE_Q89_DECK);
chk("q90", LOVE_Q90_DECK);
chk("q91", LOVE_Q91_DECK);
chk("q92", LOVE_Q92_DECK);
chk("q93", LOVE_Q93_DECK);
chk("q94", LOVE_Q94_DECK);
chk("q95", LOVE_Q95_DECK);
chk("q96", LOVE_Q96_DECK);
chk("q97", LOVE_Q97_DECK);
chk("q98", LOVE_Q98_DECK);
chk("q99", LOVE_Q99_DECK);
chk("q100", LOVE_Q100_DECK);
chk("q101", LOVE_Q101_DECK);
chk("q102", LOVE_Q102_DECK);
chk("q103", LOVE_Q103_DECK);
chk("q104", LOVE_Q104_DECK);
chk("q105", LOVE_Q105_DECK);
chk("q106", LOVE_Q106_DECK);
chk("q107", LOVE_Q107_DECK);
chk("q108", LOVE_Q108_DECK);
chk("q109", LOVE_Q109_DECK);
chk("q110", LOVE_Q110_DECK);
chk("q111", LOVE_Q111_DECK);
chk("q112", LOVE_Q112_DECK);
chk("q113", LOVE_Q113_DECK);
chk("q114", LOVE_Q114_DECK);
chk("q115", LOVE_Q115_DECK);
chk("q116", LOVE_Q116_DECK);
chk("q117", LOVE_Q117_DECK);
chk("q118", LOVE_Q118_DECK);
chk("q119", LOVE_Q119_DECK);
chk("q120", LOVE_Q120_DECK);
chk("q121", LOVE_Q121_DECK);
