const fs = require("fs");
const path = require("path");
const dir = __dirname;
const files = [1, 2, 3, 4, 5, 6].map((n) =>
  path.join(dir, `spirit-q25-0${n}.ts`),
);

const reps = [
  ["立法", "立规矩"],
  ["到底看哪一件", "阴影指着哪一块"],
  ["最该看的这一块", "阴影指着的这一块"],
  ["那口该看的事", "那一块"],
  ["整份该看自己扛完", "整份这一块自己扛完"],
  ["挡看清的牌", "挡这一块的牌"],
  ["能站的一件", "能站的一块"],
  ["改过的一件", "改过的一块"],
  ["正经的一件", "正经的一块"],
  ["这一件", "这一块"],
  ["热不是一件看清。一件要见完再对才长得出来。", "热不是这一块已经看清。这一块要见完再对才长得出来。"],
  [
    "阴影指着马还在冲向已经发生的那块这一刀先落／",
    "阴影指着马还在冲、这一刀先落的那一块／",
  ],
];

for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  for (const [a, b] of reps) s = s.split(a).join(b);
  fs.writeFileSync(f, s);
}

const banned = ["用给控制", "空白立法", "轻的编制", "当备胎", "唤窗术", "进不进不想", "立法"];
let total = 0;
const problems = [];
for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  const calls = s.split(/\n {2}r\(/).length - 1;
  total += calls;
  for (const b of banned) {
    if (s.includes(b)) problems.push(path.basename(f) + " banned " + b);
  }
  const strs = [];
  const re = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
  let m;
  while ((m = re.exec(s))) strs.push(m[1]);
  // groups of readings: after export, each r has 7 strings? cardId, name, lean, v, speak, soul, do = 7
  // plus the question string in file 01
  for (const str of strs) {
    if (/^(major_|wands_|cups_|swords_|pentacles_)/.test(str)) continue;
    if (str.length < 6) continue;
    if (str === "阴影现在指着我哪一块？") continue;
    if (!str.endsWith("牌面看这一步") && !str.endsWith("牌面看这一步。")) {
      problems.push(path.basename(f) + " no end: " + str.slice(-24));
    }
    if (/[A-Za-z]/.test(str)) problems.push(path.basename(f) + " latin: " + str.match(/[A-Za-z]+/g).join(","));
    if (/[,:;!?]/.test(str)) problems.push(path.basename(f) + " ascii punct: " + str.slice(0, 40));
    if (str.includes("吊人") && !str.includes("倒吊人")) problems.push("bad hanged " + str.slice(0, 20));
  }
}
console.log("calls", total);
console.log(problems.length ? problems.slice(0, 40).join("\n") : "ok");
