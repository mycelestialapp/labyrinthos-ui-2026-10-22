/**
 * 将瑞士星历三段文件下载到 public/swiss-ephe/，供本地 /swiss-ephe/ 直链使用（可离线、少依赖外网）。
 * 来源与 sweph-wasm 默认演示同源；亦可自行从 https://www.astro.com/swisseph/ 取得相同文件名。
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "https://ptprashanttripathi.github.io/sweph-wasm/ephe/";
const FILES = ["sepl_18.se1", "semo_18.se1", "seas_18.se1"];
const OUT = path.join(__dirname, "..", "public", "swiss-ephe");

await fs.mkdir(OUT, { recursive: true });
for (const f of FILES) {
  const url = `${BASE}${f}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(path.join(OUT, f), buf);
  console.log(`OK ${f} (${buf.length} bytes)`);
}
console.log(`Done → ${OUT}`);
