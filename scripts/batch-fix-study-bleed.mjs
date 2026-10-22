import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "lib/tarot-western-reading");
const reps = [
  ["不把追问写成唤皮术", "不把追问写成催换皮的法子"],
  ["不把追问写成唤家术", "不把追问写成催问的法子"],
  ["不把追问写成唤秤术", "不把追问写成空催过秤"],
  ["不把追问写成催窗的法子", "不把追问写成催窗口的法子"],
  ["亲近用来止渴", "开口用来止渴"],
  ["亲近当观光", "课口当观光"],
  ["亲近不当一回事", "功课不当一回事"],
  ["亲近可以发生在字里", "课口可以写在字里"],
  ["亲近当", "课口当"],
  ["把庆典当成入籍", "把庆典当成已经过关"],
  ["已经够格入籍", "已经够格过关"],
  ["够格入籍", "够格过关"],
  ["入籍会空", "过关会空"],
  ["必须落户的停", "必须当场定下的停"],
  ["请你自己当候补", "请你自己当旁听"],
  ["把自己写成候补", "把自己写成旁听"],
  ["判成候补", "判成旁听"],
  ["候补长不成", "旁听长不成"],
  ["情书是草稿", "提纲是草稿"],
  ["也进不进不想进的门", "也进不去不想进的门"],
  ["进不进不想", "进不去不想"],
  ["查询先落地", "课表先落地"],
  ["空白回信", "空白回条"],
];

let files = 0;
let changes = 0;
for (const f of fs.readdirSync(dir)) {
  if (!/^study-q\d+-\d+\.ts$/.test(f)) continue;
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
