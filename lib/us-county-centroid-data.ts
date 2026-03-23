/**
 * 仅由服务端（如 Route Handler）引用：读县级质心 JSON，勿从 Client Component 间接 import。
 */
import { readFileSync } from "fs";
import { join } from "path";

let cache: Record<string, { lat: number; lon: number }> | null = null;

export function getUsCountyCentroid(fips5: string): { lat: number; lon: number } | null {
  if (!cache) {
    const p = join(process.cwd(), "lib", "data", "us-county-centroids.json");
    cache = JSON.parse(readFileSync(p, "utf8")) as Record<string, { lat: number; lon: number }>;
  }
  const k = fips5.trim().padStart(5, "0");
  return cache[k] ?? null;
}

export const US_COUNTY_CENTROID_PREFIX = "uscc:";

export function encodeUsCountyCentroidCode(fips5: string): string {
  return `${US_COUNTY_CENTROID_PREFIX}${fips5.trim().padStart(5, "0")}`;
}
