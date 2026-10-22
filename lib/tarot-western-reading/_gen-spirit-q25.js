const fs = require("fs");
const path = require("path");

const dir = __dirname;

const files = [
  {
    src: "other-q01-01.ts",
    dest: "spirit-q25-01.ts",
    headerFrom: 'export const OTHER_Q01 = "我现在最该看的是哪一件事？";\r\n\r\nexport const OTHER_Q01_MAJOR',
    headerTo: 'export const SPIRIT_Q25 = "阴影现在指着我哪一块？";\r\n\r\nexport const SPIRIT_Q25_MAJOR',
    headerFromLf: 'export const OTHER_Q01 = "我现在最该看的是哪一件事？";\n\nexport const OTHER_Q01_MAJOR',
    headerToLf: 'export const SPIRIT_Q25 = "阴影现在指着我哪一块？";\n\nexport const SPIRIT_Q25_MAJOR',
  },
  {
    src: "other-q01-02.ts",
    dest: "spirit-q25-02.ts",
    headerFrom: "export const OTHER_Q01_MAJOR_B",
    headerTo: "export const SPIRIT_Q25_MAJOR_B",
  },
  {
    src: "other-q01-03.ts",
    dest: "spirit-q25-03.ts",
    headerFrom: "export const OTHER_Q01_WANDS",
    headerTo: "export const SPIRIT_Q25_WANDS",
  },
  {
    src: "other-q01-04.ts",
    dest: "spirit-q25-04.ts",
    headerFrom: "export const OTHER_Q01_CUPS",
    headerTo: "export const SPIRIT_Q25_CUPS",
  },
  {
    src: "other-q01-05.ts",
    dest: "spirit-q25-05.ts",
    headerFrom: "export const OTHER_Q01_SWORDS",
    headerTo: "export const SPIRIT_Q25_SWORDS",
  },
  {
    src: "other-q01-06.ts",
    dest: "spirit-q25-06.ts",
    headerFrom: "export const OTHER_Q01_PENTS",
    headerTo: "export const SPIRIT_Q25_PENTS",
  },
];

function toPiece(topic) {
  let t = topic;
  t = t.replace(/那一口(?!袋)/g, "那一块");
  t = t.replace(/那几口/g, "那几块");
  t = t.replace(/那口(?!袋)/g, "那块");
  if (!t.includes("块")) t += "这一块";
  t = t.replace(/这一块这一块/g, "这一块");
  t = t.replace(/那一块这一块/g, "那一块");
  t = t.replace(/那几块这一块/g, "那几块");
  return t;
}

function transformLean(lean) {
  const mark = "牌面看这一步";
  if (!lean.endsWith(mark)) throw new Error("lean ending: " + lean);
  let core = lean.slice(0, lean.length - mark.length).replace(/。$/, "");
  if (!core.startsWith("最该看")) throw new Error("lean prefix: " + core);
  core = core.slice("最该看".length);
  const slash = core.indexOf("／");
  if (slash < 0) throw new Error("lean slash: " + core);
  const topic = core.slice(0, slash);
  const rest = core.slice(slash + 1);
  const colon = rest.indexOf("：");
  if (colon < 0) throw new Error("lean colon: " + rest);
  const contrast = rest.slice(0, colon).replace(/^别看/, "别指");
  const reason = rest.slice(colon + 1);
  return `阴影指着${toPiece(topic)}／${contrast}：${reason}。牌面看这一步`;
}

function transformBody(text, which) {
  let s = text;
  s = s.replaceAll("「该看哪一件」", "「阴影指着哪一块」");
  s = s.replaceAll("该看哪一件", "阴影指着哪一块");
  s = s.replaceAll("能看清的一件", "阴影指着的这一块");
  s = s.replaceAll("能看的一件", "阴影指着的这一块");
  s = s.replaceAll("挡看清的牌", "挡这一块的牌");
  s = s.replaceAll("只审看不看", "只审阴影指不指这一块");
  s = s.replaceAll("这一件", "这一块");
  s = s.replaceAll("再立法", "再立规矩");
  s = s.replaceAll("用给控制", "用给予来控制");
  s = s.replaceAll("空白立法", "把空白立成规矩");
  s = s.replaceAll("轻的编制", "还轻的这一步");
  s = s.replaceAll("当备胎", "当候补");
  s = s.replaceAll("唤窗术", "催窗的法子");
  s = s.replaceAll("进不进不想", "进不了不想");
  // verdict and today step name the piece
  if (which === "verdict" || which === "doToday") {
    if (!s.includes("阴影现在指着这一块")) {
      if (s.endsWith("牌面看这一步。")) {
        s = s.slice(0, -"牌面看这一步。".length) + "阴影现在指着这一块。牌面看这一步。";
      } else if (s.endsWith("牌面看这一步")) {
        s = s.slice(0, -"牌面看这一步".length) + "阴影现在指着这一块。牌面看这一步";
      } else if (s.includes("牌面看这一步")) {
        // keep mid phrase, still close the paragraph
        if (!s.endsWith("。")) s += "。";
        s += "阴影现在指着这一块。牌面看这一步。";
      } else {
        if (!s.endsWith("。")) s += "。";
        s += "阴影现在指着这一块。牌面看这一步。";
      }
    }
  } else if (!s.endsWith("牌面看这一步") && !s.endsWith("牌面看这一步。")) {
    if (!s.endsWith("。")) s += "。";
    s += "牌面看这一步。";
  }
  return s;
}

function transformFile(spec) {
  const srcPath = path.join(dir, spec.src);
  let raw = fs.readFileSync(srcPath, "utf8");
  const nl = raw.includes("\r\n") ? "\r\n" : "\n";
  if (spec.headerFrom && raw.includes(spec.headerFrom)) {
    raw = raw.replace(spec.headerFrom, spec.headerTo);
  } else if (spec.headerFromLf && raw.includes(spec.headerFromLf)) {
    raw = raw.replace(spec.headerFromLf, spec.headerToLf);
  } else if (raw.includes(spec.headerFrom)) {
    raw = raw.replace(spec.headerFrom, spec.headerTo);
  } else {
    throw new Error("header missing in " + spec.src);
  }

  // Transform each r( call's string args 4-8 (lean + 4 body). Args are double-quoted.
  // Walk r(" ... ") by a small parser from each "  r(".
  let out = "";
  let i = 0;
  let count = 0;
  while (i < raw.length) {
    const idx = raw.indexOf("r(", i);
    if (idx < 0) {
      out += raw.slice(i);
      break;
    }
    const prev = raw.slice(Math.max(0, idx - 4), idx);
    if (!prev.endsWith("  ")) {
      out += raw.slice(i, idx + 2);
      i = idx + 2;
      continue;
    }
    out += raw.slice(i, idx);
    const parsed = parseCall(raw, idx);
    out += transformCall(parsed.text).replace(/\n/g, nl);
    count++;
    i = parsed.end;
  }
  fs.writeFileSync(path.join(dir, spec.dest), out);
  return count;
}

function parseCall(raw, callStart) {
  // callStart points at r(
  if (raw.slice(callStart, callStart + 2) !== "r(") {
    throw new Error("expected r( at " + callStart + " got " + JSON.stringify(raw.slice(callStart, callStart + 8)));
  }
  let i = callStart + 2;
  let depth = 1;
  let inStr = false;
  while (i < raw.length && depth > 0) {
    const c = raw[i];
    if (inStr) {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === '"') inStr = false;
      i++;
      continue;
    }
    if (c === '"') {
      inStr = true;
      i++;
      continue;
    }
    if (c === "(") depth++;
    else if (c === ")") depth--;
    i++;
  }
  return { text: raw.slice(callStart, i), end: i };
}

function splitArgs(callText) {
  // callText is r( ... )
  const inner = callText.slice(2, -1);
  const args = [];
  let i = 0;
  let cur = "";
  let inStr = false;
  while (i < inner.length) {
    const c = inner[i];
    if (inStr) {
      cur += c;
      if (c === "\\") {
        cur += inner[i + 1] ?? "";
        i += 2;
        continue;
      }
      if (c === '"') inStr = false;
      i++;
      continue;
    }
    if (c === '"') {
      inStr = true;
      cur += c;
      i++;
      continue;
    }
    if (c === ",") {
      args.push(cur.trim());
      cur = "";
      i++;
      continue;
    }
    cur += c;
    i++;
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
}

function transformCall(callText) {
  const args = splitArgs(callText);
  if (args.length !== 8) throw new Error("arg count " + args.length + " in " + callText.slice(0, 80));
  const unquote = (q) => {
    if (!q.startsWith('"') || !q.endsWith('"')) throw new Error("not quoted " + q.slice(0, 40));
    return q.slice(1, -1);
  };
  const quote = (s) => '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
  const lean = transformLean(unquote(args[3]));
  const kinds = ["verdict", "speak", "soul", "doToday"];
  const bodies = [4, 5, 6, 7].map((n, k) => quote(transformBody(unquote(args[n]), kinds[k])));
  return `r(${args[0]}, ${args[1]}, ${args[2]}, ${quote(lean)},\n    ${bodies[0]},\n    ${bodies[1]},\n    ${bodies[2]},\n    ${bodies[3]})`;
}

let total = 0;
for (const spec of files) {
  const n = transformFile(spec);
  console.log(spec.dest, n);
  total += n;
}
console.log("total", total);
