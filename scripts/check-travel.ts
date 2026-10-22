import {
  TRAVEL_Q01_DECK,
  TRAVEL_Q02_DECK,
  TRAVEL_Q03_DECK,
  TRAVEL_Q04_DECK,
  TRAVEL_Q05_DECK,
  TRAVEL_Q06_DECK,
  TRAVEL_Q07_DECK,
  TRAVEL_Q08_DECK,
  TRAVEL_Q09_DECK,
  TRAVEL_Q10_DECK,
  TRAVEL_Q11_DECK,
  TRAVEL_Q12_DECK,
  TRAVEL_Q13_DECK,
  TRAVEL_Q14_DECK,
  TRAVEL_Q15_DECK,
  TRAVEL_Q16_DECK,
  TRAVEL_Q17_DECK,
  TRAVEL_Q18_DECK,
  TRAVEL_Q19_DECK,
  TRAVEL_Q20_DECK,
  TRAVEL_Q21_DECK,
  TRAVEL_Q22_DECK,
  TRAVEL_Q23_DECK,
  TRAVEL_Q24_DECK,
  TRAVEL_Q25_DECK,
  TRAVEL_Q26_DECK,
  TRAVEL_Q27_DECK,
  TRAVEL_Q28_DECK,
  TRAVEL_Q29_DECK,
  TRAVEL_Q30_DECK,
  TRAVEL_Q31_DECK,
  TRAVEL_Q32_DECK,
  TRAVEL_Q33_DECK,
  TRAVEL_Q34_DECK,
  TRAVEL_Q35_DECK,
  TRAVEL_Q36_DECK,
  TRAVEL_Q37_DECK,
  TRAVEL_Q38_DECK,
  TRAVEL_Q39_DECK,
  TRAVEL_Q40_DECK,
  TRAVEL_Q41_DECK,
  TRAVEL_Q42_DECK,
  TRAVEL_Q43_DECK,
  TRAVEL_Q44_DECK,
  TRAVEL_Q45_DECK,
  TRAVEL_Q46_DECK,
  TRAVEL_Q47_DECK,
  TRAVEL_Q48_DECK,
  TRAVEL_Q49_DECK,
  TRAVEL_Q50_DECK,
  TRAVEL_Q51_DECK,
  TRAVEL_Q52_DECK,
  TRAVEL_Q53_DECK,
  TRAVEL_Q54_DECK,
  TRAVEL_Q55_DECK,
  TRAVEL_Q56_DECK,
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

chk("t01", TRAVEL_Q01_DECK);
chk("t02", TRAVEL_Q02_DECK);
chk("t03", TRAVEL_Q03_DECK);
chk("t04", TRAVEL_Q04_DECK);
chk("t05", TRAVEL_Q05_DECK);
chk("t06", TRAVEL_Q06_DECK);
chk("t07", TRAVEL_Q07_DECK);
chk("t08", TRAVEL_Q08_DECK);
chk("t09", TRAVEL_Q09_DECK);
chk("t10", TRAVEL_Q10_DECK);
chk("t11", TRAVEL_Q11_DECK);
chk("t12", TRAVEL_Q12_DECK);
chk("t13", TRAVEL_Q13_DECK);
chk("t14", TRAVEL_Q14_DECK);
chk("t15", TRAVEL_Q15_DECK);
chk("t16", TRAVEL_Q16_DECK);
chk("t17", TRAVEL_Q17_DECK);
chk("t18", TRAVEL_Q18_DECK);
chk("t19", TRAVEL_Q19_DECK);
chk("t20", TRAVEL_Q20_DECK);
chk("t21", TRAVEL_Q21_DECK);
chk("t22", TRAVEL_Q22_DECK);
chk("t23", TRAVEL_Q23_DECK);
chk("t24", TRAVEL_Q24_DECK);
chk("t25", TRAVEL_Q25_DECK);
chk("t26", TRAVEL_Q26_DECK);
chk("t27", TRAVEL_Q27_DECK);
chk("t28", TRAVEL_Q28_DECK);
chk("t29", TRAVEL_Q29_DECK);
chk("t30", TRAVEL_Q30_DECK);
chk("t31", TRAVEL_Q31_DECK);
chk("t32", TRAVEL_Q32_DECK);
chk("t33", TRAVEL_Q33_DECK);
chk("t34", TRAVEL_Q34_DECK);
chk("t35", TRAVEL_Q35_DECK);
chk("t36", TRAVEL_Q36_DECK);
chk("t37", TRAVEL_Q37_DECK);
chk("t38", TRAVEL_Q38_DECK);
chk("t39", TRAVEL_Q39_DECK);
chk("t40", TRAVEL_Q40_DECK);
chk("t41", TRAVEL_Q41_DECK);
chk("t42", TRAVEL_Q42_DECK);
chk("t43", TRAVEL_Q43_DECK);
chk("t44", TRAVEL_Q44_DECK);
chk("t45", TRAVEL_Q45_DECK);
chk("t46", TRAVEL_Q46_DECK);
chk("t47", TRAVEL_Q47_DECK);
chk("t48", TRAVEL_Q48_DECK);
chk("t49", TRAVEL_Q49_DECK);
chk("t50", TRAVEL_Q50_DECK);
chk("t51", TRAVEL_Q51_DECK);
chk("t52", TRAVEL_Q52_DECK);
chk("t53", TRAVEL_Q53_DECK);
chk("t54", TRAVEL_Q54_DECK);
chk("t55", TRAVEL_Q55_DECK);
chk("t56", TRAVEL_Q56_DECK);
