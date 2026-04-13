/**
 * 将 emit-q3-teach-minors.mjs 生成的 fragment 合并进 lib/tarot-master-question-content-love.ts
 * 先运行 tarot:q3-minors:emit，再运行本脚本。不改动文案，只替换第三问小牌区块。
 *
 * 【重要】结束锚点必须是 fragment 末尾的 Q3_TEACH_MINORS_FRAGMENT_END 行。
 * 不得用文件末尾的全局「未撰写」注释作 endNeedle，否则会误删第三问小牌之后的全部入库内容。
 * 若主文件尚无结束锚点：在「第三问·小阿尔卡那」区块最后一行 register 之后、下一主题注释之前，
 * 插入与 emit 写出的一行完全相同的 Q3_TEACH_MINORS_FRAGMENT_END 注释后再 merge。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mainPath = path.join(root, "lib/tarot-master-question-content-love.ts");
const fragPath = path.join(__dirname, "q3-teach-minors-fragment.ts");

let t = fs.readFileSync(mainPath, "utf8");
const fr = fs.readFileSync(fragPath, "utf8").trim();

const startNeedle =
  "// ---------- 第三问「这段关系想教会我什么？」· 小阿尔卡那";
const start = t.indexOf(startNeedle);
if (start < 0) {
  console.error("startNeedle not found:", startNeedle);
  process.exit(1);
}
const endNeedle =
  "// ---------- Q3_TEACH_MINORS_FRAGMENT_END — emit/merge 锚点（仅包住本段小牌；勿删勿改此行前缀） ----------";
const end = t.indexOf(endNeedle, start);
if (end < 0) {
  console.error("endNeedle not found");
  process.exit(1);
}
const endLineEnd = t.indexOf("\n", end);
const oldBlock = t.slice(start, endLineEnd >= 0 ? endLineEnd + 1 : undefined);

const newTail = `${fr}

// ---------- 第三问「这段关系想教会我什么？」：78×2=156 条（大牌+小牌+宝剑三）已全部入库 ----------
// ---------- 「我们之间最大的阻碍是什么？」78 张 × 正逆位 = 156 条，已全部人工创作入库 ----------
// ---------- 未撰寫的組合（若有新题干）由 getMasterQuestionContent(..., { placeholder: true }) 返回占位，不采用生成器 ----------
`;

t = t.replace(oldBlock, newTail);
fs.writeFileSync(mainPath, t, "utf8");
console.error("merged OK", mainPath);
