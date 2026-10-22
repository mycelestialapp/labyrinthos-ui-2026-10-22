import {
  PET_Q01_DECK,
  PET_Q02_DECK,
  PET_Q03_DECK,
  PET_Q04_DECK,
  PET_Q05_DECK,
  PET_Q06_DECK,
  PET_Q07_DECK,
  PET_Q08_DECK,
  PET_Q09_DECK,
  PET_Q10_DECK,
  PET_Q11_DECK,
  PET_Q12_DECK,
  PET_Q13_DECK,
  PET_Q14_DECK,
  PET_Q15_DECK,
  PET_Q16_DECK,
  PET_Q17_DECK,
  PET_Q18_DECK,
  PET_Q19_DECK,
  PET_Q20_DECK,
  PET_Q21_DECK,
  PET_Q22_DECK,
  PET_Q23_DECK,
  PET_Q24_DECK,
  PET_Q25_DECK,
  PET_Q26_DECK,
  PET_Q27_DECK,
  PET_Q28_DECK,
  PET_Q29_DECK,
  PET_Q30_DECK,
  PET_Q31_DECK,
  PET_Q32_DECK,
  PET_Q33_DECK,
  PET_Q34_DECK,
  PET_Q35_DECK,
  PET_Q36_DECK,
  PET_Q37_DECK,
  PET_Q38_DECK,
  PET_Q39_DECK,
  PET_Q40_DECK,
  PET_Q41_DECK,
  PET_Q42_DECK,
  PET_Q43_DECK,
  PET_Q44_DECK,
  PET_Q45_DECK,
  PET_Q46_DECK,
  PET_Q47_DECK,
  PET_Q48_DECK,
  PET_Q49_DECK,
  PET_Q50_DECK,
  PET_Q51_DECK,
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

chk("p01", PET_Q01_DECK);
chk("p02", PET_Q02_DECK);
chk("p03", PET_Q03_DECK);
chk("p04", PET_Q04_DECK);
chk("p05", PET_Q05_DECK);
chk("p06", PET_Q06_DECK);
chk("p07", PET_Q07_DECK);
chk("p08", PET_Q08_DECK);
chk("p09", PET_Q09_DECK);
chk("p10", PET_Q10_DECK);
chk("p11", PET_Q11_DECK);
chk("p12", PET_Q12_DECK);
chk("p13", PET_Q13_DECK);
chk("p14", PET_Q14_DECK);
chk("p15", PET_Q15_DECK);
chk("p16", PET_Q16_DECK);
chk("p17", PET_Q17_DECK);
chk("p18", PET_Q18_DECK);
chk("p19", PET_Q19_DECK);
chk("p20", PET_Q20_DECK);
chk("p21", PET_Q21_DECK);
chk("p22", PET_Q22_DECK);
chk("p23", PET_Q23_DECK);
chk("p24", PET_Q24_DECK);
chk("p25", PET_Q25_DECK);
chk("p26", PET_Q26_DECK);
chk("p27", PET_Q27_DECK);
chk("p28", PET_Q28_DECK);
chk("p29", PET_Q29_DECK);
chk("p30", PET_Q30_DECK);
chk("p31", PET_Q31_DECK);
chk("p32", PET_Q32_DECK);
chk("p33", PET_Q33_DECK);
chk("p34", PET_Q34_DECK);
chk("p35", PET_Q35_DECK);
chk("p36", PET_Q36_DECK);
chk("p37", PET_Q37_DECK);
chk("p38", PET_Q38_DECK);
chk("p39", PET_Q39_DECK);
chk("p40", PET_Q40_DECK);
chk("p41", PET_Q41_DECK);
chk("p42", PET_Q42_DECK);
chk("p43", PET_Q43_DECK);
chk("p44", PET_Q44_DECK);
chk("p45", PET_Q45_DECK);
chk("p46", PET_Q46_DECK);
chk("p47", PET_Q47_DECK);
chk("p48", PET_Q48_DECK);
chk("p49", PET_Q49_DECK);
chk("p50", PET_Q50_DECK);
chk("p51", PET_Q51_DECK);
