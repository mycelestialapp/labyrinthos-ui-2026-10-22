/**
 * 第四问成稿装配：语料在 scripts/q4-corpus/ 人工撰写；本脚本只转义、写 fragment、校验 156 条。
 * 体例：第一问纵深（三段心理 + 宇宙在告诉你）× 第二问落点（你问…——我（牌）想对你说 + 今日小事 + 行囊）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entries } from "./q4-corpus/all.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

if (entries.length !== 156) {
  console.error("预期 156 条语料，实际", entries.length);
  process.exit(1);
}

let out =
  "// ---------- 第四问「我们目前的关系能量走向如何？我可以做什么来影响它？」· 成稿：第一问纵深 + 第二问句式；七十八牌；脚本仅装配 ----------\n";

for (const e of entries) {
  out += `register(感情婚姻, 我们目前的关系能量走向如何我可以做什么来影响它, '${e.cardId}', ${e.upright}, {
  cardSpeaking: \`${esc(e.cardSpeaking)}\`,
  psychologyLayer: \`${esc(e.psychologyLayer)}\`,
  spiritLayer: \`${esc(e.spiritLayer)}\`,
  actionPath: \`${esc(e.actionPath)}\`,
  masterSummary: \`${esc(e.masterSummary)}\`,
});
`;
}

const outPath = path.join(__dirname, "q4-love-energy-fragment.ts");
fs.writeFileSync(outPath, out, "utf8");
console.error("Wrote", outPath, "entries", entries.length, "bytes", Buffer.byteLength(out, "utf8"));
