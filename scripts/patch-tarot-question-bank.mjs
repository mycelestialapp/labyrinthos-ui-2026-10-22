import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, "../public/tarot-master.html");
const snipPath = join(__dirname, "_question-bank-snippet.txt");

let html = fs.readFileSync(htmlPath, "utf8");
const snip = fs.readFileSync(snipPath, "utf8").trimEnd();

const startMarker = "            // ---------- 问题库（13大类，西方塔罗风格） ----------";
const endMarker = "            const categoryTabs = document.getElementById('categoryTabs');";
const start = html.indexOf(startMarker);
const end = html.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error("markers not found");

const replacement =
  "            // 问题库：与 Dmy-projects `src/lib/questionQuickPick.ts` 中 WESTERN 十大类一致，每类 20 条（学业类源数据 18 条，补 2 条与旧版一致）\n" +
  "            const questionBank = {\n" +
  snip +
  "\n            };\n\n";

html = html.slice(0, start) + replacement + html.slice(end);
fs.writeFileSync(htmlPath, html, "utf8");
console.log("patched", htmlPath);
