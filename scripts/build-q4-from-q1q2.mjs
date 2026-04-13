/**
 * 第四问专用：从已入库第一问（本质）+ 第二问（阻碍）解析正文，
 * 按本题「走向如何 / 我能做什么影响」重框五段式；不沿用第三问语料。
 * 输出 scripts/q4-love-energy-fragment.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseRegistersForQuestion } from "./lib/parse-love-q-registers.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const lovePath = path.join(root, "lib/tarot-master-question-content-love.ts");

const Q1 = "这段关系的本质是什么";
const Q2 = "我们之间最大的阻碍是什么";
const Q4_CONST = "我们目前的关系能量走向如何我可以做什么来影响它";

/** 嵌入 TS 反引号串：只转义 ` 与 $，不把正文里的 \\n 再翻倍（否则心理层会变成字面 \\n） */
function esc(s) {
  return String(s).replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function parseNameFromQ2(cardSpeaking) {
  const m = cardSpeaking.match(/我（([^）]+)）想对你说：/);
  return m ? m[1].trim() : "";
}

function firstSentence(s) {
  const i = s.indexOf("。");
  return i >= 0 ? s.slice(0, i + 1) : s.slice(0, 120);
}

function extractKnotFromQ2Spirit(spirit) {
  let m = spirit.match(/阻碍与「([^」]+)」有关/);
  if (m) return m[1];
  m = spirit.match(/最大的阻碍，与「([^」]+)」有关/);
  if (m) return m[1];
  m = spirit.match(/阻碍卡在「([^」]+)」/);
  if (m) return m[1];
  return "";
}

function extractTodayVerb(actionPath) {
  const m = actionPath.match(/今天做一件「([^」]+)」/);
  return m ? m[1] : "";
}

/** 降低 156 条同一句杠杆口号的广播感 */
function leverLine(cardId, upright, verb) {
  const v = verb || "一件具体小事";
  const seeds = [
    `你要影响走向，今天就卡这一格：把「${v}」做到底，小不要紧，但要真。`,
    `走向听行动。今天只兑现「${v}」——让对方看见你在动，而不是在讲。`,
    `你能拧动的开关往往在细节：今天把「${v}」做实，比分析十句有用。`,
    `别等对方先示范。今天你先用「${v}」给关系一个可跟的节拍。`,
    `影响走向不靠喊话，靠落地。今天完成「${v}」，再谈别的。`,
    `把力气花在看得见的一步：今天只做「${v}」，做完就停。`,
    `你若真想推动走势，就从「${v}」开始——轻，但要真。`,
    `今天用「${v}」替关系试温：你动了，场的流向才会跟着变。`,
  ];
  let h = 0;
  const key = `${cardId}|${upright}`;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return seeds[h % seeds.length];
}

function rewriteOpeningTrajectory(q2Speaking) {
  const body = q2Speaking.replace(/^你问我们之间最大的阻碍是什么——我（[^）]+）想对你说：/, "").trim();
  const first = firstSentence(body);
  let t = first;
  if (
    /^阻碍不是「[^」]+」，而是「[^」]+」/.test(t) ||
    /^阻碍不是「[^」]+」，而是「[^」]+」/.test(body.slice(0, 80))
  ) {
    t = t.replace(
      /^阻碍不是「([^」]+)」，而是「([^」]+)」。?$/,
      "走向不是「$1」那种误会式的死局，而是两人的劲还拧在「$2」上，没一起认、也没一起动。"
    );
    t = t.replace(
      /^阻碍不是「([^」]+)」，而是「([^」]+)」/,
      "眼下不是缺「$1」，而是能量还堆在「$2」这一点，没人肯先伸手。"
    );
  } else if (/^阻碍是「/.test(t)) {
    t = t.replace(
      /^阻碍是「([^」]+)」。?$/,
      "走向被「$1」拖住了；不是没路，是这股力一直没被你们摊开来说、更没约好怎么分担。"
    );
  } else if (/最大的阻碍/.test(t)) {
    t = t.replace(/最大的阻碍，是/, "走向里真正吃劲的，是");
  }
  if (t.length < 8) t = first.slice(0, 200);
  return { body, trajectory: t };
}

function buildCardSpeaking(q1, q2, cardId, upright) {
  const name = parseNameFromQ2(q2.cardSpeaking) || "这张牌";
  const hook = `你问我们目前的关系能量走向如何、我可以做什么来影响它——我（${name}）想对你说：`;
  const { trajectory, body } = rewriteOpeningTrajectory(q2.cardSpeaking);
  const q1First = firstSentence(q1.cardSpeaking);
  const verb = extractTodayVerb(q2.actionPath);
  const lever = leverLine(cardId, upright, verb);
  const extra = body.split("。").slice(1, 3).join("。").trim();
  const mid = extra && extra.length > 5 ? extra + "。" : "";
  return hook + trajectory + (mid ? " " + mid : "") + " " + q1First + " " + lever;
}

function buildPsychology(q1, q2) {
  const tail = q2.psychologyLayer.trim().replace(/\s+/g, " ");
  return (
    q1.psychologyLayer.trim() +
    "\n\n【走向与影响】" +
    tail
  );
}

function buildSpirit(q1, q2, cardId, upright) {
  const knot = extractKnotFromQ2Spirit(q2.spiritLayer);
  const parts = q1.spiritLayer.split(/\n\n核心启示：/);
  const main = parts[0] || q1.spiritLayer;
  const core = parts.length > 1 ? parts.slice(1).join("\n\n核心启示：").trim() : "";
  let bridge = "";
  if (knot) {
    const bridges = [
      `\n\n就走向而言，两人的气机还绕在「${knot}」上；你这边一动诚实、一松手或一立界，这条线都会跟着颤。`,
      `\n\n这条关系的走势，眼下还拴在「${knot}」上；你改一个小动作、一句真话或一次退让，场里都会有回音。`,
      `\n\n能量没有散，是聚在「${knot}」上打转；你愿意先松一处、先认一点，走向才会开始拐弯。`,
      `\n\n若问势头卡在哪，多半是「${knot}」还没被两个人一起摊开；你先从自己这一侧动一下，比等对方顿悟快。`,
    ];
    let h = 0;
    const key = `${cardId}|${upright}|${knot}`;
    for (let i = 0; i < key.length; i++) h = (h * 17 + key.charCodeAt(i)) >>> 0;
    bridge = bridges[h % bridges.length];
  }
  if (core) {
    return main.trim() + bridge + "\n\n核心启示：" + core;
  }
  return main.trim() + bridge;
}

function buildSummary(q1, q2, knot, cardId, upright) {
  const a = q1.masterSummary.trim().replace(/[。；]+$/g, "。");
  const b = q2.masterSummary.replace(/^「|」$/g, "").trim();
  const bShort = b.slice(0, 80) + (b.length > 80 ? "…" : "");
  if (knot) {
    const heads = [
      `走向的纽子在「${knot}」——${a} 要推动它，记着第二问那句：${bShort}`,
      `势头绕在「${knot}」上——${a} 第二问早已点破：${bShort}`,
      `想动走势，先认「${knot}」这道结——${a} 对照第二问：${bShort}`,
      `「${knot}」松一寸，走向就变一寸——${a} 第二问那句仍管用：${bShort}`,
    ];
    let h = 0;
    const key = `${cardId}|${upright}|${knot}`;
    for (let i = 0; i < key.length; i++) h = (h * 13 + key.charCodeAt(i)) >>> 0;
    return heads[h % heads.length];
  }
  return `${a} 眼下想影响走向，先落实第二问里那件最小的事。`;
}

function cardOrder() {
  const out = [];
  for (let i = 0; i < 22; i++) {
    out.push([`major_${i}`, true], [`major_${i}`, false]);
  }
  for (const suit of ["wands", "cups", "swords", "pentacles"]) {
    for (let r = 1; r <= 14; r++) {
      out.push([`${suit}_${r}`, true], [`${suit}_${r}`, false]);
    }
  }
  return out;
}

const ts = fs.readFileSync(lovePath, "utf8");
const m1 = parseRegistersForQuestion(ts, Q1);
const m2 = parseRegistersForQuestion(ts, Q2);

let out =
  "// ---------- 第四问「我们目前的关系能量走向如何？我可以做什么来影响它？」· 由第一问 + 第二问成稿专题为走向／影响重框；非第三问迁移 ----------\n";

let n = 0;
for (const [cardId, upright] of cardOrder()) {
  const k = `${cardId}|${upright}`;
  const q1 = m1.get(k);
  const q2 = m2.get(k);
  if (!q1 || !q2) {
    console.error("缺 Q1 或 Q2:", k);
    process.exit(1);
  }
  const knot = extractKnotFromQ2Spirit(q2.spiritLayer);

  const e = {
    cardSpeaking: buildCardSpeaking(q1, q2, cardId, upright),
    psychologyLayer: buildPsychology(q1, q2),
    spiritLayer: buildSpirit(q1, q2, cardId, upright),
    actionPath: q2.actionPath.trim(),
    masterSummary: buildSummary(q1, q2, knot, cardId, upright),
  };

  out += `register(感情婚姻, ${Q4_CONST}, '${cardId}', ${upright}, {
  cardSpeaking: \`${esc(e.cardSpeaking)}\`,
  psychologyLayer: \`${esc(e.psychologyLayer)}\`,
  spiritLayer: \`${esc(e.spiritLayer)}\`,
  actionPath: \`${esc(e.actionPath)}\`,
  masterSummary: \`${esc(e.masterSummary)}\`,
});
`;
  n++;
}

if (n !== 156) {
  console.error("条数错误", n);
  process.exit(1);
}

const outPath = path.join(__dirname, "q4-love-energy-fragment.ts");
fs.writeFileSync(outPath, out, "utf8");
console.error("Wrote", outPath, "registers", n);
