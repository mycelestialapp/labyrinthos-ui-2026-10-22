import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "lib/tarot-western-reading");

const common = [
  ["用给控制或用要抽空", "用给予来控制，或用索要来抽空"],
  ["用给来控制", "用给予来控制"],
  ["用给控制", "用给予来控制"],
  ["唤窗术", "催窗的法子"],
  ["唤人术", "催人的法子"],
  ["唤约术", "催约的法子"],
  ["唤选术", "催选的法子"],
  ["进不进不想", "进不了不想"],
  ["让进不进不想", "让进不了不想"],
  ["下不进不想", "下不了不想"],
  ["靠不进不想", "靠不了不想"],
  ["揭不进不想", "揭不了不想"],
  ["当备胎", "当候补"],
  ["把空白当晚立法", "把空白当成今晚的规矩"],
  ["把空当晚立法", "把空白当成今晚的规矩"],
  ["像要空白立法", "像要把空白当成今晚的规矩"],
  ["是空白立法", "是把空白当成今晚的规矩"],
  ["空白被你当晚线索", "把空白当成今晚的规矩"],
  ["自己猛着", "自己硬撑着"],
  ["混约", "混翻"],
];

function shouldTouch(name) {
  const m = name.match(/^(lost|choice|dream)-q(\d+)-\d+\.ts$/);
  if (!m) return null;
  const kind = m[1];
  const q = Number(m[2]);
  if (kind === "lost" && q >= 21) return kind;
  if (kind === "choice") return kind;
  if (kind === "dream") return kind;
  return null;
}

function lightCompile(kind) {
  if (kind === "lost") return ["轻的编制", "还轻的查找"];
  if (kind === "choice") return ["轻的编制", "还轻的选项"];
  return ["轻的编制", "还轻的梦"];
}

let files = 0;
let hits = 0;
for (const f of fs.readdirSync(dir)) {
  const kind = shouldTouch(f);
  if (!kind) continue;
  const p = path.join(dir, f);
  let t = fs.readFileSync(p, "utf8");
  const orig = t;
  const reps = [...common, lightCompile(kind)];
  for (const [a, b] of reps) {
    if (t.includes(a)) {
      const c = t.split(a).length - 1;
      t = t.split(a).join(b);
      hits += c;
    }
  }
  t = t.replace(/用给予来控制给予来控制/g, "用给予来控制");
  t = t.replace(/像要把空白当成今晚的规矩空白当成今晚的规矩/g, "像要把空白当成今晚的规矩");
  t = t.replace(/已经已经不是路过/g, "已经不是路过");
  if (t !== orig) {
    fs.writeFileSync(p, t);
    files++;
  }
}
console.log(JSON.stringify({ files, hits }));
