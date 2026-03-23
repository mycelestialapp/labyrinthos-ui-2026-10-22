import { existsSync, readFileSync } from "fs";
import { join } from "path";

const REGIONS_BASE = join(process.cwd(), "node_modules", "iso3166-2-db", "regions");

type IsoRow = { iso: string; name: string; admin?: string; fips?: string };

const zhMapCache = new Map<string, Map<string, string>>();

function readZhMap(country: string): Map<string, string> {
  let m = zhMapCache.get(country);
  if (m) return m;
  const p = join(REGIONS_BASE, country, "dispute", "UN", "zh.json");
  if (!existsSync(p)) {
    m = new Map();
  } else {
    const rows = JSON.parse(readFileSync(p, "utf8")) as IsoRow[];
    m = new Map(rows.map((r) => [r.iso, r.name]));
  }
  zhMapCache.set(country, m);
  return m;
}

let cnEnRows: IsoRow[] | null = null;
let cnZhByIso: Map<string, string> | null = null;

function loadCnPair(): { en: IsoRow[]; zh: Map<string, string> } {
  if (cnEnRows && cnZhByIso) return { en: cnEnRows, zh: cnZhByIso };
  const enPath = join(REGIONS_BASE, "CN", "dispute", "UN", "en.json");
  const zhPath = join(REGIONS_BASE, "CN", "dispute", "UN", "zh.json");
  cnEnRows = JSON.parse(readFileSync(enPath, "utf8")) as IsoRow[];
  const zhRows = JSON.parse(readFileSync(zhPath, "utf8")) as IsoRow[];
  cnZhByIso = new Map(zhRows.map((r) => [r.iso, r.name]));
  return { en: cnEnRows, zh: cnZhByIso };
}

function normEn(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+prefecture$/i, "")
    .replace(/\s+autonomous region$/i, "")
    .replace(/\s+sar$/i, "")
    .trim();
}

function matchCnState(cscNameEn: string, enList: IsoRow[]): IsoRow | undefined {
  const n = normEn(cscNameEn);
  for (const e of enList) {
    const enN = normEn(e.name);
    if (enN === n || n.startsWith(enN) || enN.startsWith(n)) return e;
  }
  if (cscNameEn === "Xizang") return enList.find((e) => e.name.includes("Tibet"));
  if (cscNameEn === "Guangxi Zhuang") return enList.find((e) => e.name === "Guangxi");
  if (cscNameEn === "Ningxia Huizu") return enList.find((e) => e.name === "Ningxia");
  return undefined;
}

const CN_MANUAL: Record<string, string> = {
  HK: "香港特别行政区",
  MO: "澳门特别行政区",
  TW: "台湾",
};

/** CSC 香港分区码 → 简体（库内多为英文区名） */
const HK_DISTRICT_ZH: Record<string, string> = {
  HCW: "中西区",
  HWC: "湾仔区",
  HEA: "东区",
  HSO: "南区",
  KYT: "油尖旺区",
  KSS: "深水埗区",
  KKC: "九龙城区",
  KWT: "黄大仙区",
  KKT: "观塘区",
  NKT: "葵青区",
  NTW: "荃湾区",
  NTM: "屯门区",
  NYL: "元朗区",
  NTP: "大埔区",
  NSK: "西贡区",
  NST: "沙田区",
  NNO: "北区",
  NIS: "离岛区",
};

/**
 * 州 / 省 / 大区在中文界面下的展示名；与 country-state-city 的 isoCode 对齐。
 * 数据：iso3166-2-db（dispute/UN/zh）；中国内地额外用 UN/en 与 CSC 英文名对齐。
 * 美国：统一用 CSC 英文名，避免与海外领地等条目中英混排。
 */
export function resolveStateLabelZh(country: string, isoCode: string, nameEn: string): string {
  if (country === "US") return nameEn;

  if (country === "CN" && CN_MANUAL[isoCode]) return CN_MANUAL[isoCode];

  if (country === "HK" && HK_DISTRICT_ZH[isoCode]) return HK_DISTRICT_ZH[isoCode];

  if (country === "CN") {
    const { en, zh } = loadCnPair();
    const row = matchCnState(nameEn, en);
    if (row) {
      const z = zh.get(row.iso);
      if (z) return z;
    }
  }

  const z = readZhMap(country).get(isoCode);
  if (z) return z;
  return nameEn;
}
