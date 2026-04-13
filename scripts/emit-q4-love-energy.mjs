/**
 * 感情婚姻 · 第四问「我们目前的关系能量走向如何？我可以做什么来影响它？」——装配脚本（非写手）
 *
 * 【大师级原则】正文语义由第三问成稿经固定句式迁移（大牌+宝剑三自 lib 切片；小牌同源 HOOKS）；
 * 本脚本负责：结构统一、转义、条数与 HOOKS 长度校验、写出 fragment。禁止空模板凑字。
 *
 * 须先存在第三问全量入库。输出：scripts/q4-love-energy-fragment.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HOOKS, cardZh } from "./emit-q3-teach-minors.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const Q4_CONST = "我们目前的关系能量走向如何我可以做什么来影响它";

/** 嵌入 TS 模板字符串 */
function safeTpl(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

/** 第三问 → 第四问：大牌/宝剑三整段 register 文本迁移 */
function transformQ3LoveBlockToQ4(block) {
  let t = block.replace(
    /register\(感情婚姻, 这段关系想教会我什么,/g,
    `register(感情婚姻, ${Q4_CONST},`
  );
  t = t.replace(/你问这段关系想教会你什么——我/g, "你问我们目前的关系能量走向如何、我可以做什么来影响它——我");
  t = t.replace(/教会你的是「/g, "关系能量给你的信号是「");
  t = t.replace(/这段关系教会你：「/g, "走向与杠杆：「");
  t = t.replace(/这段关系要你学：/g, "能量在推你认清：");
  t = t.replace(/这段关系的学分，记在「/g, "关系能量的枢纽在「");
  t = t.replace(
    /关系能量的枢纽在「([^」]+)」上——([\s\S]*?)。灵性层面[^」]*「([^」]+)」/g,
    "关系能量的枢纽在「$1」。关于这一点：$2。你可以从这一点施加影响：「$3」"
  );
  t = t.replace(
    /关系能量的枢纽在「([^」]+)」上。灵性层面[^」]*「([^」]+)」/g,
    "关系能量的枢纽在「$1」。你可以从这一点施加影响：「$2」"
  );
  return t;
}

function q4ifyMinorSlot(s) {
  return String(s)
    .replace(/这段关系教会你：「/g, "走向与杠杆：「")
    .replace(/这段关系要你学：/g, "能量在推你认清：");
}

function emitMinorQ4(suit, i, upright) {
  const id = `${suit}_${i}`;
  const row = HOOKS[id];
  if (!row) throw new Error(`missing HOOKS ${id}`);
  const a = upright ? row.up : row.rev;
  if (!Array.isArray(a) || a.length !== 12) {
    throw new Error(
      `${id} ${upright ? "正" : "逆"}：HOOKS 须 12 段（与第三问 emit 约定一致）`
    );
  }
  const zh = cardZh(suit, i);
  const ori = upright ? "正位" : "逆位";
  const name = zh;
  const cardSpeaking = `你问我们目前的关系能量走向如何、我可以做什么来影响它——我（${name}${ori}）想对你说：关系能量给你的信号是「${a[0]}」。${q4ifyMinorSlot(a[1])}`;
  return `register(感情婚姻, ${Q4_CONST}, '${id}', ${upright}, {
  cardSpeaking: \`${safeTpl(cardSpeaking)}\`,
  psychologyLayer: \`【关系现状】${safeTpl(q4ifyMinorSlot(a[2]))}\\n\\n【心理层面】${safeTpl(q4ifyMinorSlot(a[3]))}\\n\\n【根源层面】${safeTpl(q4ifyMinorSlot(a[4]))}\`,
  spiritLayer: \`宇宙在借${safeTpl(name)}${safeTpl(ori)}对你说：关系能量的枢纽在「${safeTpl(q4ifyMinorSlot(a[5]))}」。你可以从这一点施加影响：「${safeTpl(q4ifyMinorSlot(a[6]))}」\\n\\n核心启示：${safeTpl(q4ifyMinorSlot(a[7]))}\`,
  actionPath: \`今天做一件「${safeTpl(a[8])}」的小事：${safeTpl(q4ifyMinorSlot(a[9]))}\\n\\n检查你的「行囊」：${safeTpl(name)}${safeTpl(ori)}问你——${safeTpl(q4ifyMinorSlot(a[10]))}\`,
  masterSummary: \`${safeTpl(q4ifyMinorSlot(a[11]))}\`,
});
`;
}

function extractQ3MajorAndSwords3Registers(loveText) {
  const startMarker = "register(感情婚姻, 这段关系想教会我什么, 'major_0', true, {";
  const endMarker = "// ---------- 第三问「这段关系想教会我什么？」· 小阿尔卡那";
  const start = loveText.indexOf(startMarker);
  const end = loveText.indexOf(endMarker);
  if (start < 0 || end < 0 || end <= start) {
    throw new Error("无法在 lib/tarot-master-question-content-love.ts 中定位第三问大牌+宝剑三区块");
  }
  const chunk = loveText.slice(start, end);
  const re = /register\(感情婚姻, 这段关系想教会我什么,[\s\S]*?\}\);\r?\n/g;
  const blocks = chunk.match(re);
  if (!blocks || blocks.length !== 46) {
    throw new Error(`预期 46 条 register（22 大牌×2 + 宝剑三×2），实际 ${blocks?.length ?? 0}`);
  }
  return blocks.map(transformQ3LoveBlockToQ4).join("");
}

function main() {
  const lovePath = path.join(root, "lib/tarot-master-question-content-love.ts");
  const loveText = fs.readFileSync(lovePath, "utf8");

  const majorPart = extractQ3MajorAndSwords3Registers(loveText);

  const ORDER = ["wands", "cups", "swords", "pentacles"];
  let minorPart = "";
  for (const suit of ORDER) {
    for (let i = 1; i <= 14; i++) {
      if (suit === "swords" && i === 3) continue;
      minorPart += emitMinorQ4(suit, i, true);
      minorPart += emitMinorQ4(suit, i, false);
    }
  }

  const out = `// ---------- 第四问「我们目前的关系能量走向如何？我可以做什么来影响它？」· 大牌与宝剑三由第三问成稿经脚本句式迁移；小牌与第三问共用 HOOKS 数据源并由本脚本装配（共 156 条） ----------
${majorPart}
// ---------- 第四问 · 小阿尔卡那 55×2（宝剑三已含于上栏 46 条内；此处 110 条） ----------
${minorPart}`;

  const nReg = (out.match(/register\(感情婚姻,/g) || []).length;
  if (nReg !== 156) {
    throw new Error(`预期 156 条 register，实际 ${nReg}`);
  }

  const outPath = path.join(__dirname, "q4-love-energy-fragment.ts");
  fs.writeFileSync(outPath, out, "utf8");
  console.error("Wrote", outPath, "bytes", Buffer.byteLength(out, "utf8"), "registers", nReg);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
