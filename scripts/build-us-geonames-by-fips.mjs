/**
 * 自 GeoNames cities5000（CC-BY 4.0）解析美国城市，按县级 FIPS5 分组，供第三级补全。
 * 需先下载：见脚本内 URL 或传入 txt 路径。
 *
 * 运行：将 cities1000.txt 放到 scripts/source/ 后执行 npm run build:us-geonames
 * 或：node scripts/build-us-geonames-by-fips.mjs path/to/cities1000.txt
 */
import { createReadStream, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const fips = require("fips-county-codes");

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "lib", "data", "us-geonames-by-fips.json");

const STATE_ABBRS = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
  "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "AS", "GU", "MP", "PR", "VI",
];

const abbrToStateFp = {};
for (const st of STATE_ABBRS) {
  try {
    const rows = fips.getCountiesByState(st);
    if (rows?.length) abbrToStateFp[st] = String(rows[0].statefp).padStart(2, "0");
  } catch {
    /* skip */
  }
}

const inputPath = process.argv[2] || join(root, "scripts", "source", "cities5000.txt");

async function main() {
  if (!existsSync(inputPath)) {
    console.error("Missing input file:", inputPath);
    console.error("Download: https://download.geonames.org/export/dump/cities1000.zip → cities1000.txt");
    process.exit(1);
  }

  /** @type {Record<string, { id: string; n: string; lat: number; lon: number; pop: number }[]>} */
  const by = {};
  const rl = createInterface({ input: createReadStream(inputPath, "utf8"), crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line || line.startsWith("#")) continue;
    const p = line.split("\t");
    if (p.length < 15 || p[8] !== "US") continue;
    const adm1 = p[10];
    const adm2 = p[11];
    if (!adm1 || !adm2) continue;
    const sfp = abbrToStateFp[adm1];
    if (!sfp) continue;
    const f5 = sfp + String(adm2).padStart(3, "0");
    const pop = parseInt(p[14], 10) || 0;
    const lat = Number(p[4]);
    const lon = Number(p[5]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const id = p[0];
    const n = p[1];
    if (!id || !n) continue;
    if (!by[f5]) by[f5] = [];
    by[f5].push({ id, n, lat, lon, pop });
  }

  const MAX_PER_COUNTY = 60;
  const out = {};
  for (const [k, arr] of Object.entries(by)) {
    const seen = new Set();
    const dedup = [];
    for (const x of arr.sort((a, b) => b.pop - a.pop)) {
      const key = x.n.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      dedup.push({ id: x.id, n: x.n, lat: x.lat, lon: x.lon, pop: x.pop });
      if (dedup.length >= MAX_PER_COUNTY) break;
    }
    out[k] = dedup;
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(out));
  console.log("wrote", outPath, "counties", Object.keys(out).length);
}

await main();
