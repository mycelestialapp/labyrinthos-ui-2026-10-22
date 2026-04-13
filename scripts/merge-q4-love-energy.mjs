/**
 * 将 scripts/q4-love-energy-fragment.ts 合并进 lib/tarot-master-question-content-love.ts
 *（插在第三问收尾注释之前）。若已存在第四问区块（以「第四问…？」· 开头），先整段替换，避免重复。
 *
 * fragment 可由以下任一脚本生成：
 * - node scripts/build-q4-from-q1q2.mjs（第一问+第二问重框，推荐）
 * - node scripts/emit-q4-love-energy.mjs（第三问迁移，旧）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mainPath = path.join(root, "lib/tarot-master-question-content-love.ts");
const fragPath = path.join(__dirname, "q4-love-energy-fragment.ts");

const insertBeforeNeedle =
  "// ---------- 第三问「这段关系想教会我什么？」：78×2=156 条（大牌+小牌+宝剑三）已全部入库 ----------";

/** 第四问正文区起点：注释里「？」后为间隔符 ·（与收尾行「？」：区分） */
const q4BlockStartNeedle =
  "// ---------- 第四问「我们目前的关系能量走向如何？我可以做什么来影响它？」·";

let t = fs.readFileSync(mainPath, "utf8");
const fr = fs.readFileSync(fragPath, "utf8").trim();

const idxThird = t.indexOf(insertBeforeNeedle);
if (idxThird < 0) {
  console.error("insertBeforeNeedle not found:", insertBeforeNeedle);
  process.exit(1);
}

const q4Start = t.indexOf(q4BlockStartNeedle);
const block = `${fr}

// ---------- 第四问「我们目前的关系能量走向如何？我可以做什么来影响它？」：78×2=156 条（大牌+小牌+宝剑三）已全部入库 ----------
`;

if (q4Start >= 0 && q4Start < idxThird) {
  t = t.slice(0, q4Start) + block + "\n" + t.slice(idxThird);
} else {
  t = t.slice(0, idxThird) + block + "\n" + t.slice(idxThird);
}

const nQ4 = (t.match(/register\(感情婚姻, 我们目前的关系能量走向如何我可以做什么来影响它,/g) || []).length;
if (nQ4 !== 156) {
  console.error("预期 156 条第四问 register，实际", nQ4);
  process.exit(1);
}

fs.writeFileSync(mainPath, t, "utf8");
console.error("merged OK", mainPath, "q4 registers", nQ4);
