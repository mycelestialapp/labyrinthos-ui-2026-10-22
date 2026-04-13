/**
 * 出生盘用户解读：唯一允许从 UI/业务代码进入的路径是 `lib/natal-reading-full-zh.ts`，
 * 其内部再调用 `lib/natal-reading-rewrite-zh.ts`。
 * 防止未来有人直连 rewrite 或旁路生成导致口径漂移。
 */
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

function walkSourceFiles(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const ent of entries) {
    const name = ent.name;
    if (name === "node_modules" || name === ".next" || name === "dist") continue;
    const full = path.join(dir, name);
    if (ent.isDirectory()) {
      walkSourceFiles(full, acc);
    } else if (/\.(tsx?|mjs)$/.test(name) && !name.endsWith(".d.ts")) {
      acc.push(full);
    }
  }
  return acc;
}

const full = read("lib/natal-reading-full-zh.ts");
const rewrite = read("lib/natal-reading-rewrite-zh.ts");
const shortcards = read("lib/astro-workspace-shortcards-zh.ts");
const knowledge = read("lib/natal-instrument-knowledge-zh.ts");

ensureIncludes(full, 'from "./natal-reading-rewrite-zh"', "full");
ensureIncludes(full, "buildNatalReadingRewriteFullMarkdown", "full");
ensureIncludes(rewrite, "buildNatalReadingRewriteFullMarkdown", "rewrite");
ensureIncludes(rewrite, "## 核心快照（默认）", "rewrite");
ensureIncludes(rewrite, "出生盘观测报告（重写版）", "rewrite");

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

const ALLOW_REWRITE_IMPORT = new Set(["lib/natal-reading-full-zh.ts", "lib/natal-reading-rewrite-zh.ts"]);

const rewriteImportRe =
  /natal-reading-rewrite-zh|buildNatalReadingRewrite(?:Full|Compact|GoldCard)?Markdown|buildAstroWorkspaceUnderstandRewriteMarkdown/;

for (const abs of walkSourceFiles(path.join(root, "lib"))) {
  const rel = path.relative(root, abs).split(path.sep).join("/");
  if (rel.endsWith("verify-natal-copy-single-source.mjs")) continue;
  const text = fs.readFileSync(abs, "utf8");
  if (rewriteImportRe.test(text) && !ALLOW_REWRITE_IMPORT.has(rel)) {
    throw new Error(
      `[gate] ${rel} must not reference natal-reading-rewrite or buildNatalReadingRewrite* directly; use natal-reading-full-zh only.`,
    );
  }
}

for (const top of ["components", "app"]) {
  const base = path.join(root, top);
  if (!fs.existsSync(base)) continue;
  for (const abs of walkSourceFiles(base)) {
    const rel = path.relative(root, abs).split(path.sep).join("/");
    const text = fs.readFileSync(abs, "utf8");
    if (rewriteImportRe.test(text)) {
      throw new Error(
        `[gate] ${rel} must not reference rewrite builders; import from @/lib/natal-reading-full-zh only.`,
      );
    }
  }
}

/** 消费「出生盘组装 API」的允许列表（知识库/典籍展示 instrument 语料，不属用户个性化出生盘）。 */
const fullZhImportRe = /from\s+["']@\/lib\/natal-reading-full-zh["']|from\s+["'][^"']*natal-reading-full-zh["']/;
const allowedFullZhConsumers = new Set([
  "components/astro/AstroWorkspace.tsx",
  "components/home/IdentityGoldCard.tsx",
]);

for (const top of ["components", "app"]) {
  const base = path.join(root, top);
  if (!fs.existsSync(base)) continue;
  for (const abs of walkSourceFiles(base)) {
    const rel = path.relative(root, abs).split(path.sep).join("/");
    const text = fs.readFileSync(abs, "utf8");
    if (fullZhImportRe.test(text) && !allowedFullZhConsumers.has(rel)) {
      throw new Error(
        `[gate] ${rel} imports natal-reading-full-zh; add to allowed list only if this is a new birth-chart surface.`,
      );
    }
  }
}

console.log("verify:natal-copy passed (rewrite gated; full-zh consumers:", [...allowedFullZhConsumers].join(", "), ")");
