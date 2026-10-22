/**
 * 批量去掉 dream/lost 解读条里的机械套尾「牌面看…」
 * 不改题干、不改结构；正文质量仍须按标准逐题整改。
 */
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "lib/tarot-western-reading");
const files = fs.readdirSync(dir).filter((f) => /^(dream|lost)-q\d+-\d+\.ts$/.test(f));

const re = /牌面看(?:信号与消化|找回与放手)[。.]?/g;

let filesTouched = 0;
let removals = 0;

for (const f of files) {
  const p = path.join(dir, f);
  const raw = fs.readFileSync(p, "utf8");
  const matches = raw.match(re);
  if (!matches?.length) continue;
  removals += matches.length;
  let next = raw.replace(re, "");
  // 清理套尾删掉后残留的双句号、多余空格
  next = next.replace(/。{2,}/g, "。");
  next = next.replace(/([，、；：])\s*。/g, "。");
  next = next.replace(/ +\./g, ".");
  if (next !== raw) {
    fs.writeFileSync(p, next, "utf8");
    filesTouched++;
  }
}

console.log(`files=${files.length} touched=${filesTouched} removals=${removals}`);
