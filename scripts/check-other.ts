import {
  OTHER_Q01_DECK,
  OTHER_Q02_DECK,
  OTHER_Q03_DECK,
  OTHER_Q04_DECK,
  OTHER_Q05_DECK,
  OTHER_Q06_DECK,
  OTHER_Q07_DECK,
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

chk("o01", OTHER_Q01_DECK);
chk("o02", OTHER_Q02_DECK);
chk("o03", OTHER_Q03_DECK);
chk("o04", OTHER_Q04_DECK);
chk("o05", OTHER_Q05_DECK);
chk("o06", OTHER_Q06_DECK);
chk("o07", OTHER_Q07_DECK);
