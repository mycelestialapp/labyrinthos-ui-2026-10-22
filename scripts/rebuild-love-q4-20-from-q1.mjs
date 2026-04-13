/**
 * 第四～二十问：按题干语义分别从三份大师成稿母版派生（q1 本质 / q2 阻碍 / q3 教会），
 * 五段式厚度与母版一致；题干引语与收束句由 adapt 替换。
 *
 * 用法：node scripts/rebuild-love-q4-20-from-q1.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseRegistersForQuestion } from "./lib/parse-love-q-registers.mjs";
import {
  adaptContent,
  cardOrder,
  emitRegister,
} from "./lib/adapt-love-from-q1.mjs";
import { LOVE_DERIVED_FROM_Q1_Q4_20 as TARGETS } from "./lib/love-question-derived-meta.mjs";
import {
  LOVE_MOTHER_Q1,
  LOVE_MOTHER_Q2,
  LOVE_MOTHER_Q3,
} from "./lib/love-mother-questions.mjs";
import { findRegisterBlockRange } from "./lib/love-register-block-range.mjs";
import { FROZEN_LOVE_REBUILD_MASTER_CONSTS } from "./lib/love-q4-20-rebuild-frozen-consts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const lovePath = path.join(root, "lib/tarot-master-question-content-love.ts");

let ts = fs.readFileSync(lovePath, "utf8");
ts = ts.replace(/\r\n/g, "\n");

const mapQ1 = parseRegistersForQuestion(ts, LOVE_MOTHER_Q1);
const mapQ2 = parseRegistersForQuestion(ts, LOVE_MOTHER_Q2);
const mapQ3 = parseRegistersForQuestion(ts, LOVE_MOTHER_Q3);
for (const [label, m] of [
  ["第一问（本质）", mapQ1],
  ["第二问（阻碍）", mapQ2],
  ["第三问（教会）", mapQ3],
]) {
  if (m.size !== 156) {
    console.error(`${label}条数异常:`, m.size);
    process.exit(1);
  }
}

function motherMap(mother) {
  if (mother === "q2") return mapQ2;
  if (mother === "q3") return mapQ3;
  return mapQ1;
}

const order = cardOrder();
const jobs = [];
let skippedFrozen = 0;

for (const meta of TARGETS) {
  if (FROZEN_LOVE_REBUILD_MASTER_CONSTS.has(meta.constName)) {
    skippedFrozen += order.length;
    continue;
  }
  const src = motherMap(meta.mother);
  for (const [cardId, upright] of order) {
    const k = `${cardId}|${upright}`;
    const row = src.get(k);
    if (!row) {
      console.error("缺母版行:", meta.mother, k);
      process.exit(1);
    }
    const range = findRegisterBlockRange(ts, meta.constName, cardId, upright);
    if (!range) {
      console.error("找不到块:", meta.constName, cardId, upright);
      process.exit(1);
    }
    const adapted = adaptContent(row, meta);
    const text = emitRegister(meta.constName, cardId, upright, adapted);
    jobs.push({ start: range.start, end: range.end, text });
  }
}

jobs.sort((a, b) => b.start - a.start);
let out = ts;
for (const j of jobs) {
  out = out.slice(0, j.start) + j.text + out.slice(j.end);
}

fs.writeFileSync(lovePath, out, "utf8");
console.log(
  "已按三母版（本质/阻碍/教会）重写第四～二十问，共",
  jobs.length,
  "条 register。",
);
if (skippedFrozen > 0) {
  console.log(
    "已跳过冻结题目（大师终稿分批手改）共",
    skippedFrozen,
    "条，见 scripts/lib/love-q4-20-rebuild-frozen-consts.mjs。",
  );
}
