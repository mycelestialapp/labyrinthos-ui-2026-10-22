import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "lib/tarot-western-reading");
const reps = [
  ["减把行程", "少把行程"],
  ["近完算力", "近完算力气"],
  ["填库赎罪库还是空", "填库赎罪，库还是空"],
  ["落地有人为走", "落地了有人会走"],
  ["下来有人为走", "下来了有人会走"],
  ["希望很美人还会", "希望很美，人还会"],
  ["关闭催更", "关闭催促"],
  ["热带线", "热还带线"],
  ["下一秒是库", "下一秒是空库"],
  ["口过了，链不想要", "这一口过了，链不想要"],
  ["海关了", "海已经关了"],
  ["近完下一秒卸妆", "近完下一秒是卸妆"],
  ["下一秒卸妆", "下一秒是卸妆"],
  ["写在下一招", "看下一招"],
  ["对方用得清软的一句", "对方软而清楚的一句还在"],
  ["你用得清软的一句", "软而清楚的一句还在"],
  ["他用得清软的一句", "软而清楚的一句还在"],
  ["她用得清软的一句", "软而清楚的一句还在"],
  ["用得清软的一句", "软而清楚的一句还在"],
  ["倒吊能近", "倒吊人正位能近"],
  ["眺完人来", "眺完人不来"],
  ["越过路过", "已经不是路过"],
  ["用给控制或用要抽空", "用给予来控制，或用索要来抽空"],
  ["不把追问写成唤窗术", "不把追问写成催窗的法子"],
  ["请你自己当备胎", "请你自己当候补"],
  ["也进不进不想进的门", "也进不了不想进的门"],
  ["进不进不想进的门", "进不了不想进的门"],
];

let files = 0;
let changes = 0;
for (const f of fs.readdirSync(dir)) {
  if (!/^pet-q\d+-\d+\.ts$/.test(f)) continue;
  const p = path.join(dir, f);
  let t = fs.readFileSync(p, "utf8");
  const orig = t;
  let n = 0;
  for (const [a, b] of reps) {
    const c = t.split(a).length - 1;
    if (c) {
      t = t.split(a).join(b);
      n += c;
    }
  }
  t = t.replace(/这一(?:这一)+口过了/g, "这一口过了");
  t = t.replace(/已经已经不是路过/g, "已经不是路过");
  if (t !== orig) {
    fs.writeFileSync(p, t);
    files++;
    changes += n || 1;
  }
}
console.log(JSON.stringify({ files, changes }));
