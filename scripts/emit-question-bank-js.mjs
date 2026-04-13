import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const bank = JSON.parse(fs.readFileSync(join(__dirname, "_bank-out.json"), "utf8"));

function esc(q) {
  return q.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

let lines = [];
for (const [k, v] of Object.entries(bank)) {
  lines.push(`                ${k}: [`);
  for (const q of v) {
    lines.push(`                    '${esc(q)}',`);
  }
  lines.push(`                ],`);
}
fs.writeFileSync(join(__dirname, "_question-bank-snippet.txt"), lines.join("\n"), "utf8");
console.log("wrote _question-bank-snippet.txt");
