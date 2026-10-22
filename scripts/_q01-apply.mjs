import fs from "fs";
import vm from "vm";
import path from "path";
import { pathToFileURL } from "url";

const jsPath = path.resolve("public/tarot-q01-single.js");
const updatePath = path.resolve(process.argv[2]);
const locks = new Set(["pentacles_1|u", "swords_9|r", "major_0|u", "major_1|u"]);

const src = fs.readFileSync(jsPath, "utf8");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(src, ctx);
const book = ctx.window.Q01Single;
if (!book || Object.keys(book).length !== 156) {
  throw new Error("book " + (book ? Object.keys(book).length : 0));
}

const mod = await import(pathToFileURL(updatePath).href);
const updates = mod.updates;
let n = 0;
for (const [k, v] of Object.entries(updates)) {
  if (locks.has(k)) throw new Error("lock " + k);
  if (!book[k]) throw new Error("missing " + k);
  if (!v.open || !v.action) throw new Error("empty " + k);
  book[k] = { open: v.open, action: v.action };
  n++;
}
const keys = Object.keys(book);
let out = "window.Q01Single = {\n";
for (let i = 0; i < keys.length; i++) {
  const k = keys[i];
  const o = book[k];
  const comma = i === keys.length - 1 ? "" : ",";
  out += JSON.stringify(k) + ":" + JSON.stringify({ open: o.open, action: o.action }) + comma + "\n";
}
out += "};\n";
fs.writeFileSync(jsPath, out);
console.log("patched " + n);
