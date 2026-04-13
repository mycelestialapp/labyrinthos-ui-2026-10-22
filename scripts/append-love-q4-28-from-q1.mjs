/**
 * 在第三问小牌 merge 锚点之后，追加第四～二十八问 × 156 条 register。
 * 按题干分别从三份大师成稿派生（q1 本质 / q2 阻碍 / q3 教会）；元数据见 love-question-derived-meta.mjs。
 *
 * 幂等：若已存在第四问首条 register 则跳过。
 * 用法：node scripts/append-love-q4-28-from-q1.mjs
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
import { LOVE_DERIVED_FROM_Q1_Q4_28 } from "./lib/love-question-derived-meta.mjs";
import {
  LOVE_MOTHER_Q1,
  LOVE_MOTHER_Q2,
  LOVE_MOTHER_Q3,
} from "./lib/love-mother-questions.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const lovePath = path.join(root, "lib/tarot-master-question-content-love.ts");

const END_LINE =
  "// ---------- Q3_TEACH_MINORS_FRAGMENT_END — emit/merge 锚点（仅包住本段小牌；勿删勿改此行前缀） ----------";

const OLD_FOOTER = `${END_LINE}
// ---------- 第三问「这段关系想教会我什么？」：78×2=156 条（大牌+小牌+宝剑三）已全部入库 ----------
// ---------- 「我们之间最大的阻碍是什么？」78×2=156 条已全部入库 ----------
// ---------- 第四问及之后题干：本文件尚未 register；由 getMasterQuestionContent(..., { placeholder: true }) 返回占位，不采用生成器 ----------
`;

const FOOTER_AFTER_CHUNK = `// ---------- 第四～二十八问：三母版派生（本质／阻碍／教会，见 rebuild-love-q4-28-from-mothers.mjs）；与快速选题 28 题 display 对齐 ----------
// ---------- 第一～三问为逐牌成稿；全文件 28×156=4368 条 register；第三问小牌 merge 仍以 Q3_TEACH_MINORS_FRAGMENT_END 为上界 ----------
`;

const IDEMPOTENCY_NEEDLE =
  "register(感情婚姻, 我们目前的关系能量走向如何我可以做什么来影响它, 'major_0', true, {";

let ts = fs.readFileSync(lovePath, "utf8");
/** 与尾注匹配、写出统一用 \n（避免 Windows CRLF 导致 includes 失败） */
ts = ts.replace(/\r\n/g, "\n");

if (ts.includes(IDEMPOTENCY_NEEDLE)) {
  console.error("已检测到第四问入库，跳过 append-love-q4-28-from-q1（如需重做请先删除第四问起的 register 块并恢复 OLD_FOOTER）。");
  process.exit(0);
}

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
const blocks = [];
for (const meta of LOVE_DERIVED_FROM_Q1_Q4_28) {
  const src = motherMap(meta.mother);
  for (const [cardId, upright] of order) {
    const k = `${cardId}|${upright}`;
    const row = src.get(k);
    if (!row) {
      console.error("缺母版行:", meta.mother, k);
      process.exit(1);
    }
    const adapted = adaptContent(row, meta);
    blocks.push(emitRegister(meta.constName, cardId, upright, adapted));
  }
}

const chunk =
  `// ---------- 感情婚姻 · 第四～二十八问（本质／阻碍／教会三母版派生 · append-love-q4-28-from-q1.mjs；全量重写见 rebuild-love-q4-28-from-mothers.mjs）----------\n` +
  blocks.join("\n") +
  "\n";

if (!ts.includes(OLD_FOOTER)) {
  console.error("找不到预期文件尾注（Q3 锚点 + 三行旧说明）。请确认未手工改动尾注，或手工合并。");
  process.exit(1);
}

ts = ts.replace(OLD_FOOTER, `${END_LINE}\n${chunk}\n${FOOTER_AFTER_CHUNK}`);

fs.writeFileSync(lovePath, ts, "utf8");
console.log(
  "已追加第四～二十八问 register，共",
  blocks.length,
  "条（",
  LOVE_DERIVED_FROM_Q1_Q4_28.length,
  "题 × 156）。",
);
