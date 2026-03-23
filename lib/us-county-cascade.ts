import type { ICity } from "country-state-city";
import { US_COUNTY_ANCHOR_CITIES } from "@/lib/data/us-county-anchor-cities";

type FipsRow = { state: string; statefp: string; countyfp: string; countyname: string };

// eslint-disable-next-line @typescript-eslint/no-require-imports -- 包为 CommonJS
const fipsMod = require("fips-county-codes") as { getCountiesByState: (s: string) => FipsRow[] };

/** 美国县级 FIPS 父键，如 usco:CA:06001 */
export function encodeUsCountyParent(stateAbbr: string, statefp: string, countyfp: string): string {
  return `usco:${stateAbbr.toUpperCase()}:${statefp}${countyfp}`;
}

export function decodeUsCountyParent(
  code: string
): { stateAbbr: string; fips5: string } | null {
  if (!code.startsWith("usco:")) return null;
  const rest = code.slice(5);
  const idx = rest.indexOf(":");
  if (idx < 0) return null;
  const stateAbbr = rest.slice(0, idx);
  const fips5 = rest.slice(idx + 1);
  if (stateAbbr.length !== 2 || fips5.length !== 5) return null;
  return { stateAbbr, fips5 };
}

export function listUsCounties(stateAbbr: string): { code: string; name: string }[] {
  const rows = fipsMod.getCountiesByState(stateAbbr.toUpperCase());
  return rows
    .map((r) => ({
      code: encodeUsCountyParent(r.state, r.statefp, r.countyfp),
      name: r.countyname,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}

export function findUsCountyRow(stateAbbr: string, fips5: string): FipsRow | undefined {
  const rows = fipsMod.getCountiesByState(stateAbbr.toUpperCase());
  const trimmed = fips5.trim();
  const rowFips = (r: FipsRow) => `${r.statefp}${r.countyfp}`;
  const hit = rows.find((r) => rowFips(r) === trimmed);
  if (hit) return hit;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length > 0 && digits.length <= 5) {
    const padded = digits.padStart(5, "0");
    return rows.find((r) => rowFips(r) === padded);
  }
  return undefined;
}

function countyBaseNames(countyFullName: string): string[] {
  const stripped = countyFullName
    .replace(/\s+County$/i, "")
    .replace(/\s+Parish$/i, "")
    .replace(/\s+Borough$/i, "")
    .replace(/\s+City and County$/i, "")
    .trim();
  const out = new Set<string>();
  if (stripped) out.add(stripped);
  if (stripped.startsWith("St. ")) out.add(`Saint ${stripped.slice(4)}`);
  if (stripped.startsWith("Saint ")) out.add(`St. ${stripped.slice(6)}`);
  return [...out];
}

/**
 * 在州内 CSC 城镇中，按县名做弱匹配（与行政边界不完全一致，无命中时用户选「县域近似」）。
 */
export function cscCitiesMatchingCounty(countyFullName: string, cities: ICity[]): ICity[] {
  const bases = countyBaseNames(countyFullName);
  if (bases.length === 0) return [];
  const hits = cities.filter((c) => {
    const n = c.name;
    for (const b of bases) {
      if (b.length < 3) continue;
      if (n === b || n === `${b} City` || n === `${b} town`) return true;
      if (n.startsWith(`${b} `) && b.length >= 5) return true;
    }
    return false;
  });
  const uniq = new Map<string, ICity>();
  for (const h of hits) uniq.set(h.name, h);
  return [...uniq.values()].sort((a, b) => a.name.localeCompare(b.name, "en"));
}

/**
 * 美国县第三级：县名模糊匹配 + 按 FIPS 配置的主要城镇（CSC 内名称），去重后按名排序。
 */
export function usCountyTier3ResolvedCities(fips5: string, countyFullName: string, allCities: ICity[]): ICity[] {
  const matched = cscCitiesMatchingCounty(countyFullName, allCities);
  const byName = new Map<string, ICity>();
  for (const c of matched) byName.set(c.name, c);
  const anchors = US_COUNTY_ANCHOR_CITIES[fips5];
  if (anchors) {
    for (const name of anchors) {
      if (byName.has(name)) continue;
      const hit = allCities.find((x) => x.name === name);
      if (hit) byName.set(hit.name, hit);
    }
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, "en"));
}

export function usCountyGeocodeQuery(countyFullName: string, stateAbbr: string): string {
  return `${countyFullName}, ${stateAbbr.toUpperCase()}, United States`;
}

/** tier3 用：县域近似 geocode 行 code 前缀 */
export const US_COUNTY_FALLBACK_PREFIX = "usge:";

export function encodeUsCountyGeocodeCode(geocodeQuery: string): string {
  return `${US_COUNTY_FALLBACK_PREFIX}${encodeURIComponent(geocodeQuery)}`;
}

export function decodeUsCountyGeocodeCode(code: string): string | null {
  if (!code.startsWith(US_COUNTY_FALLBACK_PREFIX)) return null;
  try {
    return decodeURIComponent(code.slice(US_COUNTY_FALLBACK_PREFIX.length));
  } catch {
    return null;
  }
}
