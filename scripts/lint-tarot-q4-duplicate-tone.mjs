/**
 * 第四问「我们目前的关系能量走向如何？我可以做什么来影响它？」语气去重巡检。
 *
 * 默认：打印各监控短语在 156 条内的出现次数，exit 0（不阻断 CI）。
 * --strict：任一短语次数 > MAX（默认 10）则 exit 1。语料去套话后再常态化。
 *
 * 风格红线见 docs/TAROT_Q4_STYLE_GUARDRAILS_ZH.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseRegistersForQuestion } from "./lib/parse-love-q-registers.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const lovePath = path.join(root, "lib/tarot-master-question-content-love.ts");

const Q4_CONST = "我们目前的关系能量走向如何我可以做什么来影响它";

/** 易形成「广播腔」的套话子串；可按去套话进度删减本表。max 省略则用全局 MAX */
const MONITORED_PHRASES = [
  { id: "hook_signal", phrase: "关系能量给你的信号是" },
  { id: "push_know", phrase: "能量在推你认清" },
  { id: "hub", phrase: "关系能量的枢纽在" },
  { id: "influence", phrase: "你可以从这一点施加影响" },
  { id: "summary_prefix", phrase: "走向与杠杆：" },
  /** 可与第二问「宇宙在借…对你说」衔接；允许略多，但仍不宜 156 条同一骨架 */
  { id: "cosmic_borrow", phrase: "宇宙在借", max: 40 },
];

function countOccurrences(hay, needle) {
  if (!needle) return 0;
  let n = 0;
  let i = 0;
  while (true) {
    const j = hay.indexOf(needle, i);
    if (j < 0) break;
    n++;
    i = j + needle.length;
  }
  return n;
}

const strict = process.argv.includes("--strict");
const maxArg = process.argv.find((a) => a.startsWith("--max="));
const MAX = maxArg
  ? Number(maxArg.slice(6))
  : Number(process.env.LINT_Q4_PHRASE_MAX || 10);

const ts = fs.readFileSync(lovePath, "utf8");
const map = parseRegistersForQuestion(ts, Q4_CONST);

if (map.size !== 156) {
  console.error("[lint-q4-tone] 预期解析 156 条第四问，实际", map.size);
  process.exit(1);
}

let combined = "";
for (const [, row] of map) {
  combined +=
    row.cardSpeaking +
    row.psychologyLayer +
    row.spiritLayer +
    row.actionPath +
    row.masterSummary +
    "\n";
}

const rows = [];
let fail = false;
for (const row of MONITORED_PHRASES) {
  const c = countOccurrences(combined, row.phrase);
  const cap = row.max ?? MAX;
  rows.push({ ...row, count: c, cap });
  if (strict && c > cap) {
    fail = true;
  }
}

console.log("[lint-q4-tone] 第四问条数:", map.size);
console.log("[lint-q4-tone] 监控短语出现次数（全文五段合计，括号内为 strict 上限）:");
for (const r of rows) {
  const flag = strict && r.count > r.cap ? "  FAIL" : "";
  console.log(`  ${r.count}\t${r.phrase}\t（≤${r.cap}）${flag}`);
}

if (strict) {
  if (fail) {
    console.log(
      `[lint-q4-tone] strict：存在短语超过各自上限。调低套话或设 LINT_Q4_PHRASE_MAX / --max=（未单独写的条目用该值）。`
    );
    process.exit(1);
  }
  console.log("[lint-q4-tone] strict：通过。");
}
