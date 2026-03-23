import { readFileSync } from "fs";
import { join } from "path";
import { pinyin } from "pinyin-pro";
import { CSC_STATE_TO_PROVINCE_GB } from "@/lib/china-admin-cascade";

type LocCity = { name: string; districts: Record<string, string> };
type LocProv = { cities: Record<string, LocCity> };

let locationRoot: Record<string, LocProv> | null = null;

function getLocationRoot(): Record<string, LocProv> {
  if (!locationRoot) {
    const raw = readFileSync(join(process.cwd(), "node_modules", "china-location", "dist", "location.json"), "utf8");
    locationRoot = JSON.parse(raw) as Record<string, LocProv>;
  }
  return locationRoot;
}

/** 常见英文/邮政式拼写 → 展示用中文（CSC 与汉语拼音不一致时） */
const CN_CITY_EN_OVERRIDES: Record<string, string> = {
  urumqi: "乌鲁木齐市",
  hohhot: "呼和浩特市",
  lhasa: "拉萨市",
  kashi: "喀什市",
  akesu: "阿克苏市",
  yining: "伊宁市",
  altay: "阿勒泰市",
  shihezi: "石河子市",
  tacheng: "塔城市",
  changji: "昌吉市",
  kuerle: "库尔勒市",
  korla: "库尔勒市",
  hami: "哈密市",
  turpan: "吐鲁番市",
  tulufan: "吐鲁番市",
  guilin: "桂林市",
  liuzhou: "柳州市",
  haikou: "海口市",
  sanya: "三亚市",
  sansha: "三沙市",
  danzhou: "儋州市",
  wanzhou: "万州区",
  fuling: "涪陵区",
  yongchuan: "永川区",
  jiangjin: "江津区",
  hechuan: "合川区",
  nanchuan: "南川区",
  qijiang: "綦江区",
  dazu: "大足区",
  bishan: "璧山区",
  tongliang: "铜梁区",
  tongnan: "潼南区",
  rongchang: "荣昌区",
  kaixian: "开州区",
  liangping: "梁平区",
  wulong: "武隆区",
  chengkou: "城口县",
  fengdu: "丰都县",
  dianjiang: "垫江县",
  zhongxian: "忠县",
  yunyang: "云阳县",
  fengjie: "奉节县",
  wushan: "巫山县",
  wuxi: "巫溪县",
  shizhu: "石柱土家族自治县",
  xiushan: "秀山土家族苗族自治县",
  youyang: "酉阳土家族苗族自治县",
  pengshui: "彭水苗族土家族自治县",
};

function zhStemPinyinKey(zh: string): string {
  const base = zh
    .replace(/(特别行政区|自治区|省|市|区|县|自治县|自治州|地区|盟|旗)+$/u, "")
    .trim();
  if (!base) return "";
  return pinyin(base, { toneType: "none", type: "array" }).join("").toLowerCase();
}

const provincePinyinMapCache = new Map<string, Map<string, string>>();

function buildProvincePinyinMap(provGb: string): Map<string, string> {
  const map = new Map<string, string>();
  const prov = getLocationRoot()[provGb];
  if (!prov?.cities) return map;
  for (const city of Object.values(prov.cities)) {
    const ck = zhStemPinyinKey(city.name);
    if (ck) map.set(ck, city.name);
    for (const dName of Object.values(city.districts)) {
      const dk = zhStemPinyinKey(dName);
      if (dk) map.set(dk, dName);
    }
  }
  return map;
}

function provincePinyinMap(provGb: string): Map<string, string> {
  let m = provincePinyinMapCache.get(provGb);
  if (!m) {
    m = buildProvincePinyinMap(provGb);
    provincePinyinMapCache.set(provGb, m);
  }
  return m;
}

function normalizeCscCityAscii(name: string): string {
  return name
    .replace(/\s+City$/i, "")
    .replace(/\s+Shi$/i, "")
    .replace(/\s+New\s+Area$/i, "newarea")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

/**
 * 在中国（含港澳台）下，将 CSC 英文城市名尽量映射为中文行政区划名；未命中则回退原文。
 */
export function cnCityLabelZh(cscStateCode: string, cscCityNameEn: string): string {
  const provGb = CSC_STATE_TO_PROVINCE_GB[cscStateCode];
  if (!provGb) return cscCityNameEn;
  const ascii = normalizeCscCityAscii(cscCityNameEn);
  if (!ascii) return cscCityNameEn;
  const o = CN_CITY_EN_OVERRIDES[ascii];
  if (o) return o;
  const zh = provincePinyinMap(provGb).get(ascii);
  return zh ?? cscCityNameEn;
}
