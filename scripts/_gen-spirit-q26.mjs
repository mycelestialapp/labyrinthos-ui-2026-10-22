import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("lib/tarot-western-reading");

function parseReadings(src) {
  const readings = [];
  const re = /\br\(/g;
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + 2;
    const args = [];
    while (args.length < 8) {
      while (i < src.length && /\s/.test(src[i])) i++;
      if (src[i] === '"') {
        let j = i + 1;
        let str = "";
        while (j < src.length) {
          if (src[j] === "\\") {
            str += src[j + 1];
            j += 2;
            continue;
          }
          if (src[j] === '"') break;
          str += src[j];
          j++;
        }
        args.push(str);
        i = j + 1;
      } else if (src.startsWith("true", i)) {
        args.push(true);
        i += 4;
      } else if (src.startsWith("false", i)) {
        args.push(false);
        i += 5;
      } else {
        throw new Error("bad token " + src.slice(i, i + 40));
      }
      while (i < src.length && /[\s,]/.test(src[i])) i++;
    }
    readings.push(args);
  }
  return readings;
}

function polarityOf(lean) {
  if (lean.startsWith("在接收信号")) return "是别人的";
  if (lean.startsWith("在硬找意义")) return "是自己的";
  throw new Error("unknown polarity " + lean.slice(0, 20));
}

function theme(text, answer) {
  const wrong = answer === "是自己的" ? "推责" : "自认";
  const wrongSide = answer === "是自己的" ? "别人的" : "自己的";
  const rightSide = answer === "是自己的" ? "自己的" : "别人的";
  let s = text;
  const reps = [
    ["用给控制", "用给予来控制"],
    ["空白立法", "把空白立成规矩"],
    ["轻的编制", "还轻的这一步"],
    ["当备胎", "当候补"],
    ["唤窗术", "催窗的法子"],
    ["进不进不想", "进不了不想"],
    ["现在立法", "现在立规矩"],
    ["开口立法", "开口立规矩"],
    ["再立法", "再立规矩"],
    ["雾里立法", "雾里立规矩"],
    ["「该看哪一件」", "「最受不了的那一点是不是自己的」"],
    ["到底看哪一件", "到底是别人的还是自己的"],
    ["未回的一行", "最受不了的那一点"],
    ["能看清的一件", `能分清是${rightSide}这一点`],
    ["看清不是起点", `认成${wrongSide}不是起点`],
    ["看清写在", `${rightSide}这一点写在`],
    ["看清", "分清是谁的"],
    ["「今晚就定」", `「今晚就${wrong}」`],
    ["「今晚就判完」", `「今晚就${wrong}」`],
    ["定音", wrong],
    ["只审看不看", "只审这一点是别人的还是自己的"],
    ["看或不看", "是别人的还是自己的"],
    ["这一件", "这一点"],
    ["哪一件", "这一点是谁的"],
  ];
  for (const [a, b] of reps) s = s.split(a).join(b);
  s = s
    .replaceAll(",", "，")
    .replaceAll(":", "：")
    .replaceAll(";", "；")
    .replaceAll("?", "？")
    .replaceAll("!", "！")
    .replaceAll("(", "（")
    .replaceAll(")", "）")
    .replaceAll("/", "／");
  return s;
}

function transformLean(lean, answer) {
  const other = answer === "是自己的" ? "别人的" : "自己的";
  let s = lean.replace(/。牌面看这一步$/, "");
  if (!s.startsWith("最该看")) throw new Error("lean " + s.slice(0, 30));
  s = s.slice("最该看".length);
  const cut = s.indexOf("／别");
  if (cut < 0) throw new Error("no slash " + s);
  const core = theme(s.slice(0, cut), answer);
  let rest = s.slice(cut + 1);
  if (!rest.startsWith("别")) throw new Error(rest);
  rest = "别当成" + other + "，也" + rest.slice(1);
  if (!rest.includes("：")) throw new Error("no colon " + rest);
  rest = rest.replace("：", "。");
  rest = theme(rest, answer);
  return `${answer}：${core}／${rest}。牌面看这一步`;
}

function tagVerdict(verdict, answer) {
  const tag = answer === "是自己的" ? "这一点是自己的。" : "这一点是别人的。";
  if (verdict.includes("这一点是自己的") || verdict.includes("这一点是别人的")) return verdict;
  if (!verdict.endsWith("牌面看这一步。")) throw new Error("verdict end " + verdict.slice(-20));
  return verdict.replace(/牌面看这一步。$/, tag + "牌面看这一步。");
}

const files = ["01", "02", "03", "04", "05", "06"];
const exportName = {
  "01": "SPIRIT_Q26_MAJOR",
  "02": "SPIRIT_Q26_MAJOR_B",
  "03": "SPIRIT_Q26_WANDS",
  "04": "SPIRIT_Q26_CUPS",
  "05": "SPIRIT_Q26_SWORDS",
  "06": "SPIRIT_Q26_PENTS",
};

let total = 0;
const foolLeans = [];

for (const n of files) {
  const base = parseReadings(fs.readFileSync(path.join(dir, `other-q01-${n}.ts`), "utf8"));
  const pol = parseReadings(fs.readFileSync(path.join(dir, `spirit-q20-${n}.ts`), "utf8"));
  if (base.length !== pol.length) throw new Error("len " + n);
  const out = [];
  for (let i = 0; i < base.length; i++) {
    const b = base[i];
    const p = pol[i];
    if (b[0] !== p[0] || b[1] !== p[1] || b[2] !== p[2]) {
      throw new Error(`order ${n} ${i} ${b[0]} ${b[2]} vs ${p[0]} ${p[2]}`);
    }
    const answer = polarityOf(p[3]);
    const row = b.slice();
    row[3] = transformLean(b[3], answer);
    row[4] = tagVerdict(theme(b[4], answer), answer);
    row[5] = theme(b[5], answer);
    row[6] = theme(b[6], answer);
    row[7] = theme(b[7], answer);
    if (b[0] === "major_0" && b[2] === true) {
      row[3] =
        "是别人的：脚还在跳的那一口／别当成自己的去看远方立下的规矩。空白还热，再追「今晚就定成自己的」是崖边多踩。牌面看这一步";
      foolLeans.push(row[3]);
    }
    for (const k of [3, 4, 5, 6, 7]) {
      if (!String(row[k]).endsWith("牌面看这一步。") && !String(row[k]).endsWith("牌面看这一步")) {
        throw new Error("ending " + b[0] + " " + k + " " + String(row[k]).slice(-24));
      }
    }
    out.push(row);
  }
  total += out.length;
  const lines = [];
  lines.push('import { r, type WesternCardReading } from "./types";');
  lines.push("");
  if (n === "01") {
    lines.push('export const SPIRIT_Q26 = "我最受不了别人的那一点，是不是我自己的？";');
    lines.push("");
  }
  lines.push(`export const ${exportName[n]}: WesternCardReading[] = [`);
  for (const a of out) {
    lines.push(
      `  r(${JSON.stringify(a[0])}, ${JSON.stringify(a[1])}, ${a[2] ? "true" : "false"}, ${JSON.stringify(a[3])},`,
    );
    lines.push(`    ${JSON.stringify(a[4])},`);
    lines.push(`    ${JSON.stringify(a[5])},`);
    lines.push(`    ${JSON.stringify(a[6])},`);
    lines.push(`    ${JSON.stringify(a[7])}),`);
  }
  lines.push("];");
  lines.push("");
  fs.writeFileSync(path.join(dir, `spirit-q26-${n}.ts`), lines.join("\n"), "utf8");
}

console.log("total", total);
console.log("fool", foolLeans[0]);
