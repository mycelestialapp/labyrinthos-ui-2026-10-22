import type { ICity } from "country-state-city";
import { City } from "country-state-city";

/**
 * country-state-city 的 City.getCitiesOfState / getCitiesOfCountry 每次都会走 getAllCities()
 * 并对全城市场 filter，首包解析 city.json 极慢。此处只加载一次全表，并按 (国, 州) / 国 缓存结果。
 */
let allCities: ICity[] | null = null;

function ensureAllCities(): ICity[] {
  if (allCities !== null) return allCities;
  allCities = City.getAllCities();
  return allCities;
}

const byStateKey = new Map<string, ICity[]>();
const byCountryKey = new Map<string, ICity[]>();

function stateCacheKey(countryCode: string, stateCode: string) {
  return `${countryCode.toUpperCase()}|${stateCode}`;
}

/** 预热：首请求前可调用，避免首屏在业务逻辑里卡顿。 */
export function warmCscCityData(): void {
  ensureAllCities();
}

export function getCitiesOfStateCached(countryCode: string, stateCode: string): ICity[] {
  const rows = ensureAllCities();
  const cc = countryCode.toUpperCase();
  const k = stateCacheKey(cc, stateCode);
  const hit = byStateKey.get(k);
  if (hit) return hit;
  const next = rows.filter((c) => c.countryCode === cc && c.stateCode === stateCode);
  byStateKey.set(k, next);
  return next;
}

export function getCitiesOfCountryCached(countryCode: string): ICity[] {
  const rows = ensureAllCities();
  const cc = countryCode.toUpperCase();
  const hit = byCountryKey.get(cc);
  if (hit) return hit;
  const next = rows.filter((c) => c.countryCode === cc);
  byCountryKey.set(cc, next);
  return next;
}
