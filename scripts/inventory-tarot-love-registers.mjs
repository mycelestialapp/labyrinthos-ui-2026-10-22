/**
 * 统计 lib/tarot-master-question-content-love.ts 中感情婚姻类 register 条数（按第二参题干常量名聚合）。
 * 用法：node scripts/inventory-tarot-love-registers.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const p = path.join(root, "lib", "tarot-master-question-content-love.ts");
const t = fs.readFileSync(p, "utf8");
const re = /register\(感情婚姻,\s*([^,]+),\s*'([^']+)'/g;
const byQ = new Map();
let m;
while ((m = re.exec(t)) !== null) {
  const q = m[1].trim();
  if (!byQ.has(q)) byQ.set(q, { n: 0 });
  const row = byQ.get(q);
  row.n += 1;
}
const sorted = [...byQ.entries()].sort((a, b) => b[1].n - a[1].n);
console.error("文件:", p);
console.error("感情婚姻 register 总数:", [...byQ.values()].reduce((s, x) => s + x.n, 0));
for (const [q, { n }] of sorted) {
  console.error(`  ${n} 条\t${q}`);
}
