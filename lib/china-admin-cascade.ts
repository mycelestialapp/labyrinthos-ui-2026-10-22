import { readFileSync } from "fs";
import { join } from "path";

type LocCity = { code: string; name: string; districts: Record<string, string> };
type LocProv = { cities: Record<string, LocCity> };

let locationRoot: Record<string, LocProv> | null = null;

function getLocationRoot(): Record<string, LocProv> {
  if (!locationRoot) {
    const raw = readFileSync(join(process.cwd(), "node_modules", "china-location", "dist", "location.json"), "utf8");
    locationRoot = JSON.parse(raw) as Record<string, LocProv>;
  }
  return locationRoot;
}

/** country-state-city 省级 code → china-location 省级 GB 码 */
export const CSC_STATE_TO_PROVINCE_GB: Record<string, string> = {
  BJ: "110000",
  TJ: "120000",
  HE: "130000",
  SX: "140000",
  NM: "150000",
  LN: "210000",
  JL: "220000",
  HL: "230000",
  SH: "310000",
  JS: "320000",
  ZJ: "330000",
  AH: "340000",
  FJ: "350000",
  JX: "360000",
  SD: "370000",
  HA: "410000",
  HB: "420000",
  HN: "430000",
  GD: "440000",
  GX: "450000",
  HI: "460000",
  CQ: "500000",
  SC: "510000",
  GZ: "520000",
  YN: "530000",
  XZ: "540000",
  SN: "610000",
  GS: "620000",
  QH: "630000",
  NX: "640000",
  XJ: "650000",
  HK: "810000",
  MO: "820000",
  TW: "830000",
};

export function provinceGbFromPrefectureGb(prefectureGb: string): string {
  const n = Number(prefectureGb);
  if (!Number.isFinite(n) || prefectureGb.length !== 6) return "";
  const prov = Math.floor(n / 10000) * 10000;
  return String(prov).padStart(6, "0");
}

/** 中国内地/港澳台：省 code → 下辖地级市、州、盟等（china-location 第二层） */
export function listChinaPrefecturesByCscState(cscState: string): { code: string; name: string }[] {
  const gb = CSC_STATE_TO_PROVINCE_GB[cscState];
  if (!gb) return [];
  const prov = getLocationRoot()[gb];
  if (!prov?.cities) return [];
  const rows = Object.values(prov.cities).map((c) => ({ code: c.code, name: c.name }));
  rows.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  return rows;
}

/** 地级市 GB 码 → 区县列表 */
export function listChinaDistricts(prefectureGb: string): { code: string; name: string }[] {
  const provGb = provinceGbFromPrefectureGb(prefectureGb);
  if (!provGb) return [];
  const prov = getLocationRoot()[provGb];
  const city = prov?.cities?.[prefectureGb];
  if (!city?.districts) return [];
  return Object.entries(city.districts)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}
