import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "lib/tarot-western-reading");
const reps = [
  ["像要用空白立法", "像要把空白当成今晚的规矩"],
  ["像用空白立法", "像要把空白当成今晚的规矩"],
  ["用空白立法", "把空白当成今晚的规矩"],
  ["不像空白立法", "不像把空白当成今晚的规矩"],
  ["空白当晚立法", "把空白当成今晚的规矩"],
  ["空白立法", "把空白当成今晚的规矩"],
  ["当晚立法", "当成今晚的规矩"],
];

function ok(name) {
  const m = name.match(/^(lost|choice|dream)-q(\d+)-\d+\.ts$/);
  if (!m) return false;
  if (m[1] === "lost") return Number(m[2]) >= 21;
  return true;
}

let files = 0;
let hits = 0;
for (const f of fs.readdirSync(dir)) {
  if (!ok(f)) continue;
  const p = path.join(dir, f);
  let t = fs.readFileSync(p, "utf8");
  const orig = t;
  for (const [a, b] of reps) {
    const c = t.split(a).length - 1;
    if (c) {
      t = t.split(a).join(b);
      hits += c;
    }
  }
  t = t.replace(/把把空白当成今晚的规矩/g, "把空白当成今晚的规矩");
  if (t !== orig) {
    fs.writeFileSync(p, t);
    files++;
  }
}
console.log(JSON.stringify({ files, hits }));
