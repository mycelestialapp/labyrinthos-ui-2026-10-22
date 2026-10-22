import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { pathToFileURL } from "url";

const root = process.cwd();
const entry = path.join(root, "scripts/.western-reading-dump-entry.ts");
const dump = path.join(root, "scripts/.western-reading-dump.mjs");
const outDir = path.join(root, "public/tarot-western-readings");
const loaderPath = path.join(root, "public/tarotWesternReading.js");

const loader = `/* 按题加载。不要把全库打进这一支。 */
(function () {
  var ALLOWED = {
    "感情婚姻": 1,
    "事业工作": 1,
    "财运投资": 1,
    "学业考试": 1,
    "身体健康": 1,
    "宠物": 1,
    "人际关系": 1,
    "出行迁居": 1,
    "失物寻找": 1,
    "选择决策": 1,
    "占梦境": 1,
    "灵性成长": 1,
    "心理疏导": 1,
    "人生建议": 1,
    "其他": 1
  };
  var cache = Object.create(null);
  var inflight = Object.create(null);
  var indexPromise = null;

  function canon(q) {
    return String(q || "").replace(/\\s+/g, "").replace(/\\//g, "／");
  }
  function allowed(categoryId) {
    return !categoryId || ALLOWED[categoryId] === 1;
  }
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch("/tarot-western-readings/index.json?v=74").then(function (res) {
        if (!res.ok) throw new Error("reading index");
        return res.json();
      });
    }
    return indexPromise;
  }
  function ensure(questionText) {
    var q = canon(questionText);
    if (!q) return Promise.resolve(false);
    if (Object.prototype.hasOwnProperty.call(cache, q)) return Promise.resolve(cache[q] != null);
    if (inflight[q]) return inflight[q];
    inflight[q] = loadIndex().then(function (index) {
      var file = index[q];
      if (!file) {
        cache[q] = null;
        return false;
      }
      return fetch("/tarot-western-readings/" + file + "?v=74").then(function (res) {
        if (!res.ok) {
          cache[q] = null;
          return false;
        }
        return res.json().then(function (data) {
          cache[q] = data;
          return true;
        });
      });
    }).then(function (ok) {
      delete inflight[q];
      return ok;
    }, function () {
      delete inflight[q];
      cache[q] = null;
      return false;
    });
    return inflight[q];
  }
  function pack(row) {
    if (!row) return null;
    var ori = row.upright ? "正位" : "逆位";
    return {
      lean: row.lean,
      verdict: row.verdict,
      speak: row.speak,
      soul: row.soul,
      doToday: row.doToday,
      nameZh: row.nameZh,
      upright: row.upright,
      text: "【判断】" + row.lean + "\\n\\n" + row.verdict + "\\n\\n【这张牌对你说】" + row.nameZh + "·" + ori + "\\n" + row.speak + "\\n\\n【灵魂上】\\n" + row.soul + "\\n\\n【今天就做这一步】\\n" + row.doToday
    };
  }
  var api = {
    LOVE_Q01: "他／她现在到底怎么看我？",
    ensure: ensure,
    missing: function (categoryId, questionText) {
      if (!allowed(categoryId)) return true;
      var q = canon(questionText);
      return Object.prototype.hasOwnProperty.call(cache, q) && cache[q] == null;
    },
    get: function (categoryId, questionText, cardId, upright) {
      if (!allowed(categoryId)) return null;
      var deck = cache[canon(questionText)];
      if (!deck) return null;
      var row = deck[cardId + "|" + (upright ? "u" : "r")];
      if (!row) return null;
      return pack({
        nameZh: row[0],
        lean: row[1],
        verdict: row[2],
        speak: row[3],
        soul: row[4],
        doToday: row[5],
        upright: !!upright
      });
    }
  };
  globalThis.TarotWesternReading = api;
})();
`;

fs.writeFileSync(entry, 'export { WESTERN_READING_BY_QUESTION } from "../lib/tarot-western-reading/registry";\n');

await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: dump,
  legalComments: "none",
  logLevel: "info",
});

const mod = await import(pathToFileURL(dump).href + "?t=" + Date.now());
const map = mod.WESTERN_READING_BY_QUESTION;
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, "q"), { recursive: true });

const index = {};
const used = new Set();
let questions = 0;
let bytes = 0;
for (const [canon, deck] of Object.entries(map)) {
  if (!deck || !deck.length) continue;
  const hash = crypto.createHash("sha1").update(canon).digest("hex").slice(0, 16);
  if (used.has(hash)) throw new Error("hash collision " + hash);
  used.add(hash);
  const body = {};
  for (const row of deck) {
    body[row.cardId + "|" + (row.upright ? "u" : "r")] = [
      row.nameZh,
      row.lean,
      row.verdict,
      row.speak,
      row.soul,
      row.doToday,
    ];
  }
  const rel = "q/" + hash + ".json";
  const json = JSON.stringify(body);
  fs.writeFileSync(path.join(outDir, rel), json);
  index[canon] = rel;
  questions += 1;
  bytes += json.length;
}

const indexJson = JSON.stringify(index);
fs.writeFileSync(path.join(outDir, "index.json"), indexJson);
fs.writeFileSync(loaderPath, loader);
bytes += indexJson.length + loader.length;

fs.rmSync(entry, { force: true });
fs.rmSync(dump, { force: true });

console.log(JSON.stringify({
  questions,
  indexBytes: indexJson.length,
  loaderBytes: loader.length,
  totalBytes: bytes,
}));
