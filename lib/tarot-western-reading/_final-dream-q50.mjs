import fs from "fs";
import path from "path";

const dir = "E:/labyrinthos-ui/lib/tarot-western-reading";
const files = [
  ["dream-q50-01.ts", "DREAM_Q50_MAJOR", 12],
  ["dream-q50-02.ts", "DREAM_Q50_MAJOR_B", 32],
  ["dream-q50-03.ts", "DREAM_Q50_WANDS", 28],
  ["dream-q50-04.ts", "DREAM_Q50_CUPS", 28],
  ["dream-q50-05.ts", "DREAM_Q50_SWORDS", 28],
  ["dream-q50-06.ts", "DREAM_Q50_PENTS", 28],
];

const re =
  /r\("([^"]+)",\s*"([^"]+)",\s*(true|false),\s*"([^"]*)",\s*\n\s*"([^"]*)",\s*\n\s*"([^"]*)",\s*\n\s*"([^"]*)",\s*\n\s*"([^"]*)"\)/g;

let total = 0;
const short = [];
for (const [f, exp, expect] of files) {
  const t = fs.readFileSync(path.join(dir, f), "utf8");
  if (!t.includes(`export const ${exp}`)) console.log("missing export", exp);
  if (f !== "dream-q50-01.ts" && t.includes("export const DREAM_Q50 ")) console.log("Q leak", f);
  if (f === "dream-q50-01.ts") {
    const q = t.match(/export const DREAM_Q50 = "([^"]+)"/)?.[1];
    if (q !== "发薪日／绩效前夜的梦，当提示还是当噪音？") console.log("Q mismatch", q);
  }
  const rs = [...t.matchAll(re)];
  if (rs.length !== expect) console.log(f, "count", rs.length, "expect", expect);
  total += rs.length;
  for (const m of rs) {
    const fields = [
      ["lean", m[4], 12],
      ["verdict", m[5], 14],
      ["speak", m[6], 14],
      ["soul", m[7], 14],
      ["doToday", m[8], 14],
    ];
    for (const [name, val, min] of fields) {
      if ([...val].length < min) short.push(`${f} ${m[1]} ${m[3]} ${name}=${[...val].length}`);
      if (!val.includes("牌面看信号与消化") && name !== "speak" && name !== "soul") {
        // speak/soul also should have it per style
      }
      if (!val.includes("牌面看信号与消化")) {
        short.push(`${f} ${m[1]} ${name} missing phrase`);
      }
    }
  }
}
console.log("TOTAL", total);
console.log("short/missing", short.length);
for (const s of short.slice(0, 30)) console.log(s);

// delete helpers
for (const h of [
  "_gen-dream-q50.mjs",
  "_check-dream-q50.mjs",
  "_fix-dream-q50.mjs",
  "_fix2-dream-q50.mjs",
  "_scan-dream-q50.mjs",
]) {
  const p = path.join(dir, h);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}
console.log("helpers removed");
