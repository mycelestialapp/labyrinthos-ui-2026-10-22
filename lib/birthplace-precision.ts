/**
 * 出生地坐标「定盘方式」——存档与界面展示，便于星盘/八字/紫微复核与售后溯源。
 */
export type PlacePrecision =
  | "cn_geocode"
  | "us_county_geocode"
  | "us_geonames"
  | "us_centroid"
  | "us_csc"
  | "intl_geocode"
  | "csc_city"
  | "cascade_geocode"
  | "search"
  | "manual"
  | "unknown";

export const GN_TIER3_PREFIX = "gn:";
export const USCC_TIER3_PREFIX = "uscc:";

const ALL: readonly PlacePrecision[] = [
  "cn_geocode",
  "us_county_geocode",
  "us_geonames",
  "us_centroid",
  "us_csc",
  "intl_geocode",
  "csc_city",
  "cascade_geocode",
  "search",
  "manual",
  "unknown",
];

export function parsePlacePrecision(raw: unknown): PlacePrecision | undefined {
  if (typeof raw !== "string") return undefined;
  return (ALL as string[]).includes(raw) ? (raw as PlacePrecision) : undefined;
}

export function placePrecisionLabelZh(p: PlacePrecision): string {
  const m: Record<PlacePrecision, string> = {
    cn_geocode: "中国区县名录 + 地理编码定坐标",
    us_county_geocode: "美国县域地理编码",
    us_geonames: "美国：GeoNames 地名库（按县级 FIPS）",
    us_centroid: "美国：县级多边形质心（边界内代表点）",
    us_csc: "美国：country-state-city 库内城镇坐标",
    intl_geocode: "国际：结构化地理编码精化（城镇+州省+国家）",
    csc_city: "国际：country-state-city 库内坐标",
    cascade_geocode: "国际：级联地名拼接后地理编码",
    search: "地名搜索点选",
    manual: "手输经纬度",
    unknown: "未标注（旧存档）",
  };
  return m[p];
}
