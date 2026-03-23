/**
 * GeoNames cities1000 按县级 FIPS 分组（仅服务端加载）。许可：CC-BY 4.0，见 lib/data/ATTRIBUTION-GEONAMES.txt
 */
import { readFileSync } from "fs";
import { join } from "path";

type GnRow = { id: string; n: string; lat: number; lon: number; pop: number };

let cache: Record<string, GnRow[]> | null = null;

function load(): Record<string, GnRow[]> {
  if (!cache) {
    const p = join(process.cwd(), "lib", "data", "us-geonames-by-fips.json");
    cache = JSON.parse(readFileSync(p, "utf8")) as Record<string, GnRow[]>;
  }
  return cache;
}

export function getUsGeonamesPlacesForCounty(fips5: string): GnRow[] {
  const k = fips5.trim().padStart(5, "0");
  return load()[k] ?? [];
}

export const US_GEONAMES_TIER3_PREFIX = "gn:";

export function encodeGeonamesTier3Code(geonameId: string): string {
  return `${US_GEONAMES_TIER3_PREFIX}${geonameId}`;
}
