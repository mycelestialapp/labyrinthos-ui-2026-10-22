import fs from "fs";
import vm from "vm";

const src = fs.readFileSync("public/tarot-q01-single.js", "utf8");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(src, ctx);
const book = ctx.window.Q01Single;
const keys = Object.keys(book);
if (keys.length !== 156) throw new Error("n " + keys.length);

const locks = {
  "major_0|u": "崖边上，手里一朵白花",
  "major_1|u": "桌上四样摆齐",
  "pentacles_1|u": "云缝里伸出一只手",
  "swords_9|r": "天亮了，人躺回去",
};
for (const [k, head] of Object.entries(locks)) {
  if (!book[k].open.startsWith(head)) throw new Error("lock drift " + k);
}

const bans = ["对方现在看你", "这一眼还没有完全", "看两件", "他拿你当", "他眼里你是", "他把你看成", "他进门把你认成", "他先把你读成", "他此刻认定", "在他这边，你是一个", "这眼还悬", "看还没收", "这一眼还挂", "也有一次"];
const conns = ["之后", "紧接着", "话没说完", "到了第二天"];
const span = keys.filter((k) => {
  const n = k.match(/^major_(\d+)\|/);
  return n && Number(n[1]) >= 5 && Number(n[1]) <= 9;
});
for (const k of span) {
  const text = book[k].open + book[k].action;
  for (const b of bans) if (text.includes(b)) throw new Error(k + " ban " + b);
  const i = conns
    .map((c) => book[k].open.indexOf(c))
    .filter((x) => x >= 0)
    .sort((a, b) => a - b)[0];
  const first = conns.find((c) => book[k].open.indexOf(c) === i);
  console.log(k, first);
}

let out = "/** 第一题单张。怎么看我。按星币王牌正位那一档写全。 */\nexport const Q01_SINGLE_HAND = [\n";
for (const k of keys) {
  const [id, side] = k.split("|");
  const o = book[k];
  out += `  [${JSON.stringify(id)}, ${side === "u"},\n    ${JSON.stringify(o.open)},\n    ${JSON.stringify(o.action)}],\n`;
}
out += "];\n";
fs.writeFileSync("lib/tarot-western-reading/love-q01-single-hand.mjs", out);
console.log("hand", keys.length, "end", out.trim().slice(-5));
