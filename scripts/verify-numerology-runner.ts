import assert from "node:assert/strict";
import {
  birthdayNumber,
  lifePathNumber,
  numerologyNameHasLatinLetters,
  personalYear,
} from "../lib/numerology-pythagorean";
import { computeNumerologyProfile, parseNumerologyProfileBody } from "../lib/numerology-profile";
import {
  ALL_LIFE_PATH_ORDERED_PAIRS_144,
  lifePathPairCatalogBodyZh,
} from "../lib/numerology-life-path-pair-catalog-zh";
import { allPairMatrixDualDraftsZh } from "../lib/numerology-life-path-pair-matrix-enumerate-zh";
import { allLifePathSideManualRowsZh } from "../lib/numerology-life-path-side-manual-zh";
import {
  RAW_INTEGER_PAIR_CATALOG_MAX,
  lifePathPairCatalogBodyZhFromRawInts,
  rawIntegerToLifePathPlateau,
  rawIntegerToPlateauMap1To99,
} from "../lib/numerology-life-path-raw-pair-catalog-zh";
import {
  LIFE_PATH_PLATEAU_NUMBERS,
  PAIR_MATRIX_MANUAL_ZH,
  PAIR_MATRIX_MANUAL_ZH_HI_FIRST,
  lifePathPairMatrixBodyZh,
  lifePathPairMatrixKeysZh,
  lifePathPairMatrixWorkspaceBodyZh,
  lifePathPairOrderedWorkspaceKeysZh,
} from "../lib/numerology-life-path-pair-matrix-manual-zh";

assert.equal(lifePathNumber(1, 1, 2000), 4);
assert.equal(personalYear(4, 14, 2026), 1);

/** 金样例：与常见计算器交叉核对（主路径 2、生日数 9、2026 个人年 4） */
assert.equal(lifePathNumber(3, 9, 1979), 2);
assert.equal(birthdayNumber(9), 9);
assert.equal(personalYear(3, 9, 2026), 4);

assert.equal(numerologyNameHasLatinLetters("钱钱钱"), false);
assert.equal(numerologyNameHasLatinLetters("QIAN"), true);

const bad = parseNumerologyProfileBody({ month: 2, day: 30, year: 2026 });
assert.equal(bad.ok, false);
if (!bad.ok) {
  assert.equal(bad.error, "invalid_date");
  assert.ok(bad.message.includes("2026"));
  assert.ok(bad.message.includes("28"));
}

const ok = parseNumerologyProfileBody({ month: 1, day: 1, year: 2000, nameLatin: "", calendarYear: 2000 });
assert.equal(ok.ok, true);
if (ok.ok) {
  const profile = computeNumerologyProfile(ok.value);
  assert.equal(profile.numbers.lifePath, 4);
  assert.ok(profile.layers.snapshot.length > 10);
}

const pairKeys = lifePathPairMatrixKeysZh();
assert.equal(pairKeys.length, 66);
assert.equal(Object.keys(PAIR_MATRIX_MANUAL_ZH_HI_FIRST).length, 66);
for (const me of LIFE_PATH_PLATEAU_NUMBERS) {
  for (const ot of LIFE_PATH_PLATEAU_NUMBERS) {
    if (me <= ot) continue;
    assert.ok(PAIR_MATRIX_MANUAL_ZH_HI_FIRST[`${me}-${ot}`], `hi-first missing ${me}-${ot}`);
  }
}
assert.equal(LIFE_PATH_PLATEAU_NUMBERS.length, 12);
for (const k of pairKeys) {
  const row = PAIR_MATRIX_MANUAL_ZH[k];
  assert.ok(row, `pair matrix missing: ${k}`);
  assert.ok(row.lead.length > 20, k);
  assert.equal(row.afterLead.length, 2, k);
  assert.equal(row.bullets.length, 5, k);
  const [x, y] = k.split("-").map(Number);
  assert.deepEqual(lifePathPairMatrixBodyZh(x, y), row);
  assert.deepEqual(lifePathPairMatrixBodyZh(y, x), row);
}

const ordKeys = lifePathPairOrderedWorkspaceKeysZh();
assert.equal(ordKeys.length, 132);
for (const me of LIFE_PATH_PLATEAU_NUMBERS) {
  for (const ot of LIFE_PATH_PLATEAU_NUMBERS) {
    if (me === ot) continue;
    const w = lifePathPairMatrixWorkspaceBodyZh(me, ot);
    assert.ok(w, `workspace pair missing: ${me}-${ot}`);
    assert.ok(w.lead.startsWith(`主路径 ${me} 与 ${ot}：`), `${me}-${ot} opener`);
  }
}

const base32 = lifePathPairMatrixBodyZh(3, 22);
const ws223 = lifePathPairMatrixWorkspaceBodyZh(22, 3);
assert.ok(base32 && ws223);
assert.notEqual(base32.lead, ws223.lead, "3-22 vs 22-3 lead should differ");
assert.notDeepEqual(base32.afterLead, ws223.afterLead, "3-22 vs 22-3 afterLead should differ (hand dual draft)");
assert.notDeepEqual(base32.bullets, ws223.bullets, "3-22 vs 22-3 bullets should differ (hand dual draft)");

assert.equal(allPairMatrixDualDraftsZh().length, 66);
assert.equal(allLifePathSideManualRowsZh().length, 12);
assert.equal(ALL_LIFE_PATH_ORDERED_PAIRS_144.length, 144);
for (const [me, ot] of ALL_LIFE_PATH_ORDERED_PAIRS_144) {
  const c = lifePathPairCatalogBodyZh(me, ot);
  assert.ok(c.lead.length > 15, `catalog ${me}-${ot}`);
  assert.equal(c.afterLead.length, 2, `catalog ${me}-${ot}`);
  assert.equal(c.bullets.length, 5, `catalog ${me}-${ot}`);
}

for (const d of allPairMatrixDualDraftsZh()) {
  assert.deepEqual(d.bodyWhenMeIsLo, lifePathPairMatrixWorkspaceBodyZh(d.lo, d.hi));
  assert.deepEqual(d.bodyWhenMeIsHi, lifePathPairMatrixWorkspaceBodyZh(d.hi, d.lo));
}

assert.equal(rawIntegerToPlateauMap1To99().length, RAW_INTEGER_PAIR_CATALOG_MAX);
assert.equal(rawIntegerToLifePathPlateau(47), 11);
assert.equal(rawIntegerToLifePathPlateau(99), 9);
const rawPair = lifePathPairCatalogBodyZhFromRawInts(10, 28);
assert.equal(rawPair.mePlateau, 1);
assert.equal(rawPair.otherPlateau, 1);
assert.ok(rawPair.body.lead.length > 10);

console.log("verify-numerology: ok");
