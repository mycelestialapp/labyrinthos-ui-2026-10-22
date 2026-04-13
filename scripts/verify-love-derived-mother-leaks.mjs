/**
 * 感情类：第四～二十八问派生区不得残留前三问母版钩子等措辞（避免读者觉得「题不对板」、q1/q2/q3 叙事串台）。
 * 通过 ≠ 文案优美；仅表示未检出母版原题用语泄露。
 * 扫描区间：首条派生 register（第四问·愚者正）至末条派生 register（第二十八问·星币国王逆）的连续原文切片。
 *
 * 用法：node scripts/verify-love-derived-mother-leaks.mjs
 *
 * npm：verify:love-derived-leaks。以下脚本在 build 后会自动跑本校验：
 * tarot:love:rebuild-q4-28-masters、tarot:q4-20-from-q1:rebuild、tarot:love:append-q4-28、tarot:love-extra8:append。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cardOrder } from "./lib/adapt-love-from-q1.mjs";
import { LOVE_DERIVED_FROM_Q1_Q4_28 } from "./lib/love-question-derived-meta.mjs";
import { findRegisterBlockRange } from "./lib/love-register-block-range.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const lovePath = path.join(root, "lib/tarot-master-question-content-love.ts");

const ANCHOR = "Q3_TEACH_MINORS_FRAGMENT_END";

/** 派生正文里不应出现的母版钩子等子串（与 adapt-love-from-q1.mjs 目标一致） */
const FORBIDDEN = [
  "阻碍",
  "这段关系的本质是什么",
  "我们之间最大的阻碍是什么",
  "你问我们之间最大的阻碍是什么",
  "你问这段关系想教会你什么",
  "这段关系想教会我什么",
  /** Q3 母版：须由 adapt 换成「这一题／这一程／题面在问…收束」 */
  "这段关系的学分",
  "这段关系教会你：",
  "这段关系要你学",
  /** Q1 母版：须换成本题 display / essenceShort */
  "题面在问「这段关系的本质是什么」",
];

const raw = fs.readFileSync(lovePath, "utf8").replace(/\r\n/g, "\n");

const anchorPos = raw.indexOf(ANCHOR);
if (anchorPos < 0) {
  console.error("[verify-love-derived-leaks] 找不到锚点:", ANCHOR);
  process.exit(1);
}

const metas = LOVE_DERIVED_FROM_Q1_Q4_28;
const order = cardOrder();
const firstMeta = metas[0];
const lastMeta = metas[metas.length - 1];
const [firstCard, firstUpright] = order[0];
const [lastCard, lastUpright] = order[order.length - 1];

const rFirst = findRegisterBlockRange(
  raw,
  firstMeta.constName,
  firstCard,
  firstUpright,
);
const rLast = findRegisterBlockRange(
  raw,
  lastMeta.constName,
  lastCard,
  lastUpright,
);

if (!rFirst || !rLast) {
  console.error(
    "[verify-love-derived-leaks] 无法定位派生首尾 register 块（检查 const 名与牌序）",
  );
  process.exit(1);
}

if (rFirst.start < anchorPos) {
  console.error(
    "[verify-love-derived-leaks] 首条派生块出现在 Q3 小牌锚点之前，文件结构可能已变。",
  );
  process.exit(1);
}

const chunk = raw.slice(rFirst.start, rLast.end);
const hits = [];

for (const needle of FORBIDDEN) {
  let pos = 0;
  while (true) {
    const j = chunk.indexOf(needle, pos);
    if (j < 0) break;
    const lineNo = raw.slice(0, rFirst.start + j).split("\n").length;
    hits.push({ needle, lineNo });
    pos = j + needle.length;
  }
}

if (hits.length) {
  console.error("[verify-love-derived-leaks] 未通过。");
  console.error(
    "说明：第 4～28 问由三母版（本质／阻碍／教会）派生，正文里不应再出现「原母题」的钩子和用词，否则用户会觉得题不对板（串台）。",
  );
  console.error(
    "请在 scripts/lib/adapt-love-from-q1.mjs 补替换，或改母版成稿后重跑 rebuild。命中如下：",
  );
  for (const h of hits.slice(0, 40)) {
    console.error(`  行 ${h.lineNo}: 「${h.needle}」`);
  }
  if (hits.length > 40) console.error(`  … 共 ${hits.length} 处`);
  process.exit(1);
}

console.log("[verify-love-derived-leaks] 通过。");
console.log(
  "说明：已检查第 4～28 问整段成稿——未发现前三问母版残留用语（如「阻碍」「本质是什么」「想教会你」等）；这不评判文采好坏，只防题干串戏。",
);
