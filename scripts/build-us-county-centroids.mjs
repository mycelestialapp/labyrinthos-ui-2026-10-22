/**
 * 自 us-atlas (ISC) 县级 TopoJSON 生成 FIPS5 → 多边形质心，供出生地第三级兜底坐标。
 * 质心在行政边界内，一般接近县治但非官方县治；显著优于「仅 CSC 县名匹配」的空白。
 *
 * 运行：node scripts/build-us-county-centroids.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import us from "us-atlas/counties-10m.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "lib", "data", "us-county-centroids.json");

const fc = feature(us, us.objects.counties);
const out = {};
for (const f of fc.features) {
  const id = f.id;
  if (id == null) continue;
  const fips = String(id).padStart(5, "0");
  try {
    const [lon, lat] = geoCentroid(f);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      out[fips] = { lat, lon };
    }
  } catch {
    /* ignore */
  }
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(out));
console.log("wrote", outPath, "entries", Object.keys(out).length);
