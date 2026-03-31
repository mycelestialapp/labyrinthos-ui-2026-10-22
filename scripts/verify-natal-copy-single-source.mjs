import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function ensureIncludes(text, fragment, ctx) {
  if (!text.includes(fragment)) {
    throw new Error(`[${ctx}] missing required fragment: ${fragment}`);
  }
}

function ensureNotIncludes(text, fragment, ctx) {
  if (text.includes(fragment)) {
    throw new Error(`[${ctx}] found forbidden fragment: ${fragment}`);
  }
}

const full = read("lib/natal-reading-full-zh.ts");
const shortcards = read("lib/astro-workspace-shortcards-zh.ts");
const knowledge = read("lib/natal-instrument-knowledge-zh.ts");

ensureIncludes(full, 'from "./natal-reading-instrument-bodies-zh"', "full");
ensureIncludes(full, 'from "./natal-reading-text-blocks"', "full");
ensureIncludes(shortcards, "mapFirstBodies(SUN_BODY)", "shortcards");
ensureIncludes(shortcards, "mapFirstBodies(MOON_BODY)", "shortcards");
ensureIncludes(shortcards, "mapFirstBodies(RISING_BODY)", "shortcards");
ensureIncludes(shortcards, "mapFirstBodies(MIRROR_BODY)", "shortcards");
ensureIncludes(knowledge, "NATAL_INSTRUMENT_KNOWLEDGE_SECTIONS", "knowledge");

const forbiddenInFull = [
  "getLegacyAstrologySeedBySun",
  "resolvedSunBody(",
  "THIRTY_RISING",
  "THIRTY_MOON",
  "THIRTY_SUN",
  "## 读前须知",
];

for (const token of forbiddenInFull) {
  ensureNotIncludes(full, token, "full");
}

console.log("verify:natal-copy passed");
