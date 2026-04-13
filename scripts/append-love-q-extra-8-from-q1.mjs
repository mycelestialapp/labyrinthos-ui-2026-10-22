/**
 * 感情快速选题中尚未入库的 8 道题：按题干从三母版（本质/阻碍/教会）之一派生，
 * 五段式追加写入
 * lib/tarot-master-question-content-love.ts，并补 const + QUESTION_ALIASES。
 *
 * 用法：node scripts/append-love-q-extra-8-from-q1.mjs
 * 幂等：若已存在 register(感情婚姻, 该不该表白, 即中止并提示。
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
import { LOVE_DERIVED_FROM_Q1_EXTRA_8 as EXTRA_EIGHT } from "./lib/love-question-derived-meta.mjs";
import {
  LOVE_MOTHER_Q1,
  LOVE_MOTHER_Q2,
  LOVE_MOTHER_Q3,
} from "./lib/love-mother-questions.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const lovePath = path.join(root, "lib/tarot-master-question-content-love.ts");

let ts = fs.readFileSync(lovePath, "utf8");
ts = ts.replace(/\r\n/g, "\n");

if (ts.includes("register(感情婚姻, 该不该表白,")) {
  console.error("已检测到 extra-8 入库痕迹，跳过（如需重做请先手工删除相关 register / const / 别名）。");
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
for (const meta of EXTRA_EIGHT) {
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

const header =
  "\n\n// ---------- 第二十一～二十八问（快速选题补全）：本质／阻碍／教会三母版派生 · scripts/append-love-q-extra-8-from-q1.mjs ----------\n";
const registerChunk = header + blocks.join("\n");

/** 须与 lib 内注释行全文一致，避免与其它「第十九问」前缀行混淆 */
const marker =
  "// ---------- 第十九问「我在感情中的模式是什么？」大师级成稿（回路织纹·自照节律；与辨讯迎门锻场镜前错开） ----------";
const midx = ts.indexOf(marker);
if (midx < 0) {
  console.error("找不到插入锚点（第十九问大师级成稿注释行）");
  process.exit(1);
}
ts = ts.slice(0, midx) + registerChunk + "\n" + ts.slice(midx);

const constAnchor = "const 我为何总是吸引同类型的人 = '我为何总是吸引同类型的人？';";
const constInsert = `${constAnchor}
const 我准备好进入新关系了吗我该如何爱自己 = '我准备好进入新关系了吗？我该如何爱自己？';
const 这段感情值得继续吗 = '这段感情值得继续吗？';
const 我们适合结婚吗 = '我们适合结婚吗？';
const 迈向婚姻我们目前最需要克服的是什么 = '迈向婚姻，我们目前最需要克服的是什么？';
const 该不该表白 = '该不该表白？';
const 该不该分手 = '该不该分手？';
const 该不该离婚 = '该不该离婚？';
const 近期感情运势如何 = '近期感情运势如何？';`;

if (!ts.includes(constInsert)) {
  if (!ts.includes(constAnchor)) {
    console.error("找不到 const 锚点");
    process.exit(1);
  }
  ts = ts.replace(constAnchor, constInsert);
}

const aliasBlock = `  '我為何總是吸引同類型的人？': '我为何总是吸引同类型的人？',
  '我准备好进入新关系了吗？我该如何爱自己？': '我准备好进入新关系了吗？我该如何爱自己？',
  '我准备好进入新关系了吗我该如何爱自己？': '我准备好进入新关系了吗？我该如何爱自己？',
  '我准备好进入新关系了吗我该如何爱自己': '我准备好进入新关系了吗？我该如何爱自己？',
  '我準備好進入新關係了嗎？我該如何愛自己？': '我准备好进入新关系了吗？我该如何爱自己？',
  '这段感情值得继续吗？': '这段感情值得继续吗？',
  '这段感情值得继续吗': '这段感情值得继续吗？',
  '這段感情值得繼續嗎？': '这段感情值得继续吗？',
  '我们适合结婚吗？': '我们适合结婚吗？',
  '我们适合结婚吗': '我们适合结婚吗？',
  '我們適合結婚嗎？': '我们适合结婚吗？',
  '迈向婚姻，我们目前最需要克服的是什么？': '迈向婚姻，我们目前最需要克服的是什么？',
  '迈向婚姻我们目前最需要克服的是什么？': '迈向婚姻，我们目前最需要克服的是什么？',
  '迈向婚姻我们目前最需要克服的是什么': '迈向婚姻，我们目前最需要克服的是什么？',
  '邁向婚姻，我們目前最需要克服的是什麼？': '迈向婚姻，我们目前最需要克服的是什么？',
  '该不该表白？': '该不该表白？',
  '该不该表白': '该不该表白？',
  '該不該表白？': '该不该表白？',
  '该不该分手？': '该不该分手？',
  '该不该分手': '该不该分手？',
  '該不該分手？': '该不该分手？',
  '该不该离婚？': '该不该离婚？',
  '该不该离婚': '该不该离婚？',
  '該不該離婚？': '该不该离婚？',
  '近期感情运势如何？': '近期感情运势如何？',
  '近期感情运势如何': '近期感情运势如何？',
  '近期感情運勢如何？': '近期感情运势如何？',
};`;

const aliasRe =
  /  '我為何總是吸引同類型的人？': '我为何总是吸引同类型的人？',\r?\n\};/;

if (!ts.includes("'近期感情運勢如何？':")) {
  if (!aliasRe.test(ts)) {
    console.error("找不到 QUESTION_ALIASES 结尾（我為何總是吸引… 段）");
    process.exit(1);
  }
  ts = ts.replace(aliasRe, aliasBlock);
}

fs.writeFileSync(lovePath, ts, "utf8");
console.log("已追加 8 题 × 156 条 register，并补 const / 别名。共 +", blocks.length, "条。");
