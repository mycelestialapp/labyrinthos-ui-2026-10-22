"use client";

import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { JetBrains_Mono, Playfair_Display } from "next/font/google";
import { playClick, playUnlock } from "../../lib/sfx";
import {
  type NatalBig3,
  NATAL_COMPUTATION_DISCLOSURE_ZH,
  ZODIAC_CN,
  birthMomentToUtc,
  computeNatalBig3,
  natalQualitativeCopy,
  parseLatLon,
} from "../../lib/natal-chart";
import {
  birthplaceTier1Label,
  birthplaceTier2Label,
  birthplaceTier3Label,
} from "@/lib/birthplace-tier-labels";
import { decodeIntlGeocodeCode } from "@/lib/intl-geocode-codec";
import {
  GN_TIER3_PREFIX,
  type PlacePrecision,
  parsePlacePrecision,
  placePrecisionLabelZh,
  USCC_TIER3_PREFIX,
} from "@/lib/birthplace-precision";
import { decodeUsCountyGeocodeCode } from "@/lib/us-county-cascade";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

type UserProfile = {
  birthdate: string;
  birthTime: string;
  timeZone: string;
  latitude: number;
  longitude: number;
  coordinates?: string;
  /** 地理编码返回的展示名，便于用户核对 */
  placeLabel?: string;
  /** 坐标定盘方式（存档溯源，星盘/八字/紫微复核） */
  placePrecision?: PlacePrecision;
};

type GeocodeHit = { label: string; lat: number; lon: number; countryCode?: string };

type CascadeCountry = { code: string; label: string; name: string };
type CascadeStateRow = { code: string; name: string; labelZh?: string };

/** 二、三级行政区（中国：地级市→区县；其他国家：城镇→默认坐标点） */
type BirthTierRow = { code: string; label: string; lat?: string | null; lon?: string | null };

/** 列表过长时显示筛选框（英、法、印、美各县等） */
const BIRTHPLACE_LIST_FILTER_MIN = 28;

function filterRowsWithPinnedSelection<T extends { code: string; label: string }>(
  rows: T[],
  query: string,
  pinnedCode: string
): T[] {
  const q = query.trim().toLowerCase();
  const base = !q ? rows : rows.filter((t) => t.label.toLowerCase().includes(q));
  const pin = rows.find((t) => t.code === pinnedCode);
  if (pin && !base.some((t) => t.code === pin.code)) return [pin, ...base];
  return base;
}

function filterStatesWithPinned(
  rows: CascadeStateRow[],
  query: string,
  pinnedCode: string
): CascadeStateRow[] {
  const q = query.trim().toLowerCase();
  const text = (s: CascadeStateRow) => (s.labelZh ?? s.name).toLowerCase();
  const base = !q ? rows : rows.filter((s) => text(s).includes(q));
  const pin = rows.find((s) => s.code === pinnedCode);
  if (pin && !base.some((s) => s.code === pin.code)) return [pin, ...base];
  return base;
}

function formatLatLonInput(lat: number, lon: number) {
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}

function formatLatLonDisplayZh(lat: number, lon: number) {
  const ns = lat >= 0 ? "北纬" : "南纬";
  const ew = lon >= 0 ? "东经" : "西经";
  return `${ns} ${Math.abs(lat).toFixed(5)}°，${ew} ${Math.abs(lon).toFixed(5)}°`;
}

async function fetchGeocodeFirstHit(q: string, countriesIso?: string): Promise<GeocodeHit | null> {
  const scope =
    countriesIso && /^[a-z]{2}(,[a-z]{2}){0,24}$/i.test(countriesIso)
      ? `&countries=${encodeURIComponent(countriesIso.toLowerCase())}`
      : "";
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}${scope}`);
  const data = (await res.json()) as { results?: GeocodeHit[] };
  const hit = data.results?.[0];
  return hit && Number.isFinite(hit.lat) && Number.isFinite(hit.lon) ? hit : null;
}

/**
 * 下拉可选时区：覆盖主要人口与商务城市；仍非全球每一城（极小众 IANA 依赖「本机时区」插项 + 兜底文案）。
 * 太阳/月亮只依赖 UTC 瞬时；上升依赖下方经纬度，与本列表正交。
 */
const BIRTH_TIMEZONE_PRESETS = [
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Taipei",
  "Asia/Macau",
  "Asia/Urumqi",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Bangkok",
  "Asia/Ho_Chi_Minh",
  "Asia/Manila",
  "Asia/Jakarta",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Jerusalem",
  "America/Los_Angeles",
  "America/Denver",
  "America/Phoenix",
  "America/Chicago",
  "America/New_York",
  "America/Toronto",
  "America/Vancouver",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "America/Buenos_Aires",
  "America/Santiago",
  "America/Anchorage",
  "America/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Brussels",
  "Europe/Zurich",
  "Europe/Vienna",
  "Europe/Warsaw",
  "Europe/Athens",
  "Europe/Istanbul",
  "Europe/Moscow",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Perth",
  "Australia/Brisbane",
  "Pacific/Auckland",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "UTC",
];

/**
 * 手写中文展示名：Windows 等环境下 Intl.DisplayNames('timeZone') 常退回 IANA 原文。
 * value 仍为 IANA，计算逻辑不变；日后 i18n 可整表替换。
 */
const BIRTH_TIMEZONE_LABEL_ZH: Record<string, string> = {
  UTC: "协调世界时",
  "Asia/Shanghai": "中国 · 上海",
  "Asia/Hong_Kong": "中国 · 香港",
  "Asia/Taipei": "中国 · 台北",
  "Asia/Macau": "中国 · 澳门",
  "Asia/Urumqi": "中国 · 乌鲁木齐",
  "Asia/Singapore": "新加坡",
  "Asia/Tokyo": "日本 · 东京",
  "Asia/Seoul": "韩国 · 首尔",
  "Asia/Bangkok": "泰国 · 曼谷",
  "Asia/Ho_Chi_Minh": "越南 · 胡志明市",
  "Asia/Manila": "菲律宾 · 马尼拉",
  "Asia/Jakarta": "印度尼西亚 · 雅加达",
  "Asia/Kolkata": "印度 · 加尔各答（新德里）",
  "Asia/Dubai": "阿联酋 · 迪拜",
  "Asia/Jerusalem": "以色列 · 耶路撒冷",
  "America/Los_Angeles": "美国 · 洛杉矶",
  "America/New_York": "美国 · 纽约",
  "America/Chicago": "美国 · 芝加哥",
  "America/Denver": "美国 · 丹佛",
  "America/Phoenix": "美国 · 凤凰城",
  "America/Anchorage": "美国 · 安克雷奇",
  "America/Honolulu": "美国 · 檀香山",
  "America/Toronto": "加拿大 · 多伦多",
  "America/Vancouver": "加拿大 · 温哥华",
  "America/Mexico_City": "墨西哥 · 墨西哥城",
  "America/Sao_Paulo": "巴西 · 圣保罗",
  "America/Buenos_Aires": "阿根廷 · 布宜诺斯艾利斯",
  "America/Santiago": "智利 · 圣地亚哥",
  "Europe/London": "英国 · 伦敦",
  "Europe/Paris": "法国 · 巴黎",
  "Europe/Berlin": "德国 · 柏林",
  "Europe/Rome": "意大利 · 罗马",
  "Europe/Madrid": "西班牙 · 马德里",
  "Europe/Amsterdam": "荷兰 · 阿姆斯特丹",
  "Europe/Brussels": "比利时 · 布鲁塞尔",
  "Europe/Zurich": "瑞士 · 苏黎世",
  "Europe/Vienna": "奥地利 · 维也纳",
  "Europe/Warsaw": "波兰 · 华沙",
  "Europe/Athens": "希腊 · 雅典",
  "Europe/Istanbul": "土耳其 · 伊斯坦布尔",
  "Europe/Moscow": "俄罗斯 · 莫斯科",
  "Australia/Sydney": "澳大利亚 · 悉尼",
  "Australia/Melbourne": "澳大利亚 · 墨尔本",
  "Australia/Perth": "澳大利亚 · 珀斯",
  "Australia/Brisbane": "澳大利亚 · 布里斯班",
  "Pacific/Auckland": "新西兰 · 奥克兰",
  "Africa/Cairo": "埃及 · 开罗",
  "Africa/Johannesburg": "南非 · 约翰内斯堡",
};

/** 与「已选地点」同屏展示，避免全国东八区却写成「中国·上海」 */
function birthTimezoneSummaryZh(iana: string, countryCode: string): string {
  const cc = countryCode.toUpperCase();
  if (cc === "CN" && iana === "Asia/Shanghai") {
    return "中国标准时间（东八区，IANA：Asia/Shanghai）";
  }
  if (cc === "CN" && iana === "Asia/Urumqi") {
    return "新疆常用区时（IANA：Asia/Urumqi）";
  }
  const z = birthTimeZoneLabelZh(iana);
  return z !== iana ? `${z}（${iana}）` : iana;
}

function birthTimeZoneLabelZh(iana: string): string {
  const hit = BIRTH_TIMEZONE_LABEL_ZH[iana];
  if (hit) return hit;
  const head = iana.split("/")[0];
  const region =
    head === "Asia"
      ? "亚洲"
      : head === "America"
        ? "美洲"
        : head === "Europe"
          ? "欧洲"
          : head === "Africa"
            ? "非洲"
            : head === "Australia" || head === "Pacific"
              ? "大洋洲/太平洋"
              : head === "Atlantic"
                ? "大西洋"
                : head === "Indian"
                  ? "印度洋"
                  : head === "Arctic"
                    ? "北极"
                    : head === "Antarctica"
                      ? "南极"
                      : "";
  if (region) return `${region} · 其他（建议改选列表中最近的大城市）`;
  return "其他地区";
}

/** 出生地国家码与所选 IANA 时区明显不一致时的短提示（避免「中国时区 + 日本坐标」静默算错）。 */
function birthPlaceTimezoneHint(timeZone: string, placeCountryCode: string | null): string | null {
  if (!placeCountryCode) return null;
  const cc = placeCountryCode.toLowerCase();
  if ((timeZone === "Asia/Shanghai" || timeZone === "Asia/Urumqi") && cc === "jp") {
    return "所选地在日本。若你当时人在日本，请把时区改为「日本 · 东京」；若本意是中国青岛，请在上方的结果里选带「中国」的条目。";
  }
  if (timeZone === "Asia/Tokyo" && cc === "cn") {
    return "所选地在中国。若你当时在中国，请把时区改为「中国 · 上海」等；若人在日本却看到中国地名，多半是异国同名，请重选。";
  }
  return null;
}

const GEOCODE_ZH_REGION = "cn,tw,hk,mo";

/** 快捷「中国」高亮：含内地与从内地列表切入的港澳台（ISO 仍为 CN/HK/MO/TW）。 */
const CHINA_FAMILY_CODES = new Set(["CN", "HK", "MO", "TW"]);

/** 选「中国 CN」后，在省份列表最底部切入港澳台（数据库里为独立 ISO）。 */
const CN_STATE_GOTO_HK = "__GOTO_HK__";
const CN_STATE_GOTO_MO = "__GOTO_MO__";
const CN_STATE_GOTO_TW = "__GOTO_TW__";

/** 横排快捷国家：美国固定第一位，其余为常见来源（全球列表在展开项中）。 */
const BIRTHPLACE_QUICK_ISO = [
  "US",
  "JP",
  "KR",
  "SG",
  "GB",
  "CA",
  "AU",
  "FR",
  "DE",
  "IN",
  "IT",
  "ES",
  "MX",
  "BR",
  "TH",
  "MY",
  "PH",
  "VN",
  "ID",
  "NZ",
  "NL",
  "CH",
  "AE",
  "RU",
] as const;

const QUICK_COUNTRY_LABEL_ZH: Record<(typeof BIRTHPLACE_QUICK_ISO)[number], string> = {
  US: "美国",
  JP: "日本",
  KR: "韩国",
  SG: "新加坡",
  GB: "英国",
  CA: "加拿大",
  AU: "澳大利亚",
  FR: "法国",
  DE: "德国",
  IN: "印度",
  IT: "意大利",
  ES: "西班牙",
  MX: "墨西哥",
  BR: "巴西",
  TH: "泰国",
  MY: "马来西亚",
  PH: "菲律宾",
  VN: "越南",
  ID: "印度尼西亚",
  NZ: "新西兰",
  NL: "荷兰",
  CH: "瑞士",
  AE: "阿联酋",
  RU: "俄罗斯",
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return leap ? 29 : 28;
  }
  if (month === 4 || month === 6 || month === 9 || month === 11) return 30;
  return 31;
}

function parseBirthdateToPicks(iso: string): { y: string; m: string; d: string } {
  const dm = iso.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dm) return { y: "", m: "", d: "" };
  return { y: dm[1], m: String(Number(dm[2])), d: String(Number(dm[3])) };
}

function parseStoredProfile(raw: string | null): UserProfile | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    const p = o as Record<string, unknown>;
    if (
      typeof p.birthdate !== "string" ||
      typeof p.birthTime !== "string" ||
      typeof p.timeZone !== "string" ||
      typeof p.latitude !== "number" ||
      typeof p.longitude !== "number"
    )
      return null;
    return {
      birthdate: p.birthdate,
      birthTime: p.birthTime,
      timeZone: p.timeZone,
      latitude: p.latitude,
      longitude: p.longitude,
      coordinates: typeof p.coordinates === "string" ? p.coordinates : undefined,
      placeLabel: typeof p.placeLabel === "string" ? p.placeLabel : undefined,
      placePrecision: parsePlacePrecision(p.placePrecision),
    };
  } catch {
    return null;
  }
}

function zodiacLabel(key: string) {
  return ZODIAC_CN[key as keyof typeof ZODIAC_CN] ?? key;
}

function symbolFor(z: string) {
  const map: Record<string, string> = {
    ARIES: "♈",
    TAURUS: "♉",
    GEMINI: "♊",
    CANCER: "♋",
    LEO: "♌",
    VIRGO: "♍",
    LIBRA: "♎",
    SCORPIO: "♏",
    SAGITTARIUS: "♐",
    CAPRICORN: "♑",
    AQUARIUS: "♒",
    PISCES: "♓",
  };
  return map[z] ?? "✶";
}

export default function IdentityGoldCard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [hovered, setHovered] = useState(false);
  /** 年/月/日分栏：须独立存，不能只在拼出 ISO 后才写入（否则选年会把月日锁死在 disabled） */
  const [pickY, setPickY] = useState("");
  const [pickM, setPickM] = useState("");
  const [pickD, setPickD] = useState("");
  const [birthTime, setBirthTime] = useState("12:00");
  const [timeZone, setTimeZone] = useState("Asia/Shanghai");
  const [coordinates, setCoordinates] = useState("");
  const [placeLabel, setPlaceLabel] = useState("");
  const [placePrecision, setPlacePrecision] = useState<PlacePrecision | null>(null);
  const [countriesList, setCountriesList] = useState<CascadeCountry[]>([]);
  const [statesList, setStatesList] = useState<CascadeStateRow[]>([]);
  const [tier2List, setTier2List] = useState<BirthTierRow[]>([]);
  const [tier3List, setTier3List] = useState<BirthTierRow[]>([]);
  const [birthCountryCode, setBirthCountryCode] = useState("");
  const [birthStateCode, setBirthStateCode] = useState("");
  const [birthTier2Code, setBirthTier2Code] = useState("");
  const [birthTier3Code, setBirthTier3Code] = useState("");
  const [cascadeLoading, setCascadeLoading] = useState<"countries" | "states" | "cities" | null>(null);
  const [countryMoreOpen, setCountryMoreOpen] = useState(false);
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeResults, setPlaceResults] = useState<GeocodeHit[]>([]);
  const [placeLoading, setPlaceLoading] = useState(false);
  /** 仅检索 cn/tw/hk/mo，减少「青岛」误选日本条目；海外出生可关。（高级搜索用） */
  const [placeScopeZh, setPlaceScopeZh] = useState(true);
  const [geocodeEmptyHint, setGeocodeEmptyHint] = useState(false);
  /** 最近一次从列表点选结果带来的 ISO 国家码，用于与时区交叉提示；手改坐标会清空。 */
  const [selectedPlaceCountry, setSelectedPlaceCountry] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [stateListFilter, setStateListFilter] = useState("");
  const [tier2Filter, setTier2Filter] = useState("");
  const [tier3Filter, setTier3Filter] = useState("");
  const [buttonHovered, setButtonHovered] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockNonce, setUnlockNonce] = useState(0);
  const [focused, setFocused] = useState<
    | "coordinates"
    | "placeQuery"
    | "birthCountry"
    | "birthState"
    | "birthTier2"
    | "birthTier3"
    | null
  >(null);

  const lastPulseAtRef = useRef(0);
  const geocodeAbortRef = useRef<AbortController | null>(null);

  const resolvedLatLon = useMemo(() => parseLatLon(coordinates), [coordinates]);

  const tzPlaceHint = useMemo(
    () => birthPlaceTimezoneHint(timeZone, selectedPlaceCountry),
    [timeZone, selectedPlaceCountry]
  );

  const birthdate = useMemo(() => {
    if (!pickY || !pickM || !pickD) return "";
    const yi = Number(pickY);
    const mi = Number(pickM);
    let di = Number(pickD);
    if (!Number.isFinite(yi) || !Number.isFinite(mi) || !Number.isFinite(di)) return "";
    const dim = daysInMonth(yi, mi);
    di = Math.min(Math.max(1, di), dim);
    return `${pickY}-${pad2(mi)}-${pad2(di)}`;
  }, [pickY, pickM, pickD]);

  /** 未选年时用闰年 2000 推算每月最大日数，便于先选月/日再补年；补年后按真实年再收紧 */
  useEffect(() => {
    if (!pickM || !pickD) return;
    const mi = Number(pickM);
    const di = Number(pickD);
    if (!Number.isFinite(mi) || !Number.isFinite(di) || mi < 1 || mi > 12) return;
    const yi = Number(pickY);
    const dim =
      pickY && Number.isFinite(yi) ? daysInMonth(yi, mi) : daysInMonth(2000, mi);
    if (di > dim) setPickD(String(dim));
  }, [pickY, pickM, pickD]);

  const birthYearOptions = useMemo(() => {
    const end = new Date().getFullYear() + 1;
    const list: number[] = [];
    for (let y = end; y >= 1920; y--) list.push(y);
    return list;
  }, []);

  const birthTimeParts = useMemo(() => {
    const tm = birthTime.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!tm) return { h: "12", min: "0" };
    return { h: String(Number(tm[1])), min: String(Number(tm[2])) };
  }, [birthTime]);

  const birthDayOptions = useMemo(() => {
    const mi = Number(pickM);
    if (!pickM || !Number.isFinite(mi) || mi < 1 || mi > 12) {
      return Array.from({ length: 31 }, (_, i) => i + 1);
    }
    const yi = Number(pickY);
    const dim =
      pickY && Number.isFinite(yi) ? daysInMonth(yi, mi) : daysInMonth(2000, mi);
    return Array.from({ length: dim }, (_, i) => i + 1);
  }, [pickY, pickM]);

  const statesForSelect = useMemo(
    () => filterStatesWithPinned(statesList, stateListFilter, birthStateCode),
    [statesList, stateListFilter, birthStateCode]
  );

  const tier2ForSelect = useMemo(
    () => filterRowsWithPinnedSelection(tier2List, tier2Filter, birthTier2Code),
    [tier2List, tier2Filter, birthTier2Code]
  );

  const tier3ForSelect = useMemo(
    () => filterRowsWithPinnedSelection(tier3List, tier3Filter, birthTier3Code),
    [tier3List, tier3Filter, birthTier3Code]
  );

  const showTier2EmptyHelp = Boolean(
    birthCountryCode &&
      cascadeLoading !== "states" &&
      cascadeLoading !== "cities" &&
      tier2List.length === 0 &&
      (statesList.length === 0 || birthStateCode)
  );

  const showTier3EmptyHelp = Boolean(
    birthCountryCode &&
      birthTier2Code &&
      cascadeLoading !== "cities" &&
      tier3List.length === 0
  );

  useEffect(() => {
    setStateListFilter("");
  }, [birthCountryCode]);

  useEffect(() => {
    setTier2Filter("");
  }, [tier2List]);

  useEffect(() => {
    setTier3Filter("");
  }, [tier3List]);

  useEffect(() => {
    const raw = window.localStorage.getItem("user_profile");
    const p = parseStoredProfile(raw);
    if (raw && !p) {
      try {
        window.localStorage.removeItem("user_profile");
      } catch {
        /* ignore */
      }
    }
    startTransition(() => {
      if (p) {
        setProfile(p);
        const picks = parseBirthdateToPicks(p.birthdate);
        setPickY(picks.y);
        setPickM(picks.m);
        setPickD(picks.d);
        setBirthTime(p.birthTime);
        setTimeZone(p.timeZone);
        setCoordinates(p.coordinates ?? formatLatLonInput(p.latitude, p.longitude));
        setPlaceLabel(p.placeLabel ?? "");
        setPlacePrecision(parsePlacePrecision(p.placePrecision) ?? null);
      } else {
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz) setTimeZone(tz);
        } catch {
          /* ignore */
        }
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated || profile !== null) return;
    const ac = new AbortController();
    setCascadeLoading("countries");
    void fetch("/api/places/countries", { signal: ac.signal })
      .then((r) => r.json())
      .then((d: { countries?: CascadeCountry[] }) => {
        if (!ac.signal.aborted) setCountriesList(Array.isArray(d.countries) ? d.countries : []);
      })
      .catch(() => {
        if (!ac.signal.aborted) setCountriesList([]);
      })
      .finally(() => {
        if (!ac.signal.aborted) setCascadeLoading(null);
      });
    return () => ac.abort();
  }, [hydrated, profile]);

  useEffect(() => {
    if (!birthCountryCode) {
      setStatesList([]);
      setTier2List([]);
      setTier3List([]);
      setBirthStateCode("");
      setBirthTier2Code("");
      setBirthTier3Code("");
      return;
    }
    const ac = new AbortController();
    setCascadeLoading("states");
    void fetch(`/api/places/states?country=${encodeURIComponent(birthCountryCode)}`, {
      signal: ac.signal,
    })
      .then((r) => r.json())
      .then(async (d: { states?: CascadeStateRow[] }) => {
        if (ac.signal.aborted) return;
        const st = Array.isArray(d.states) ? d.states : [];
        setStatesList(st);
        setBirthStateCode("");
        setBirthTier2Code("");
        setBirthTier3Code("");
        setTier3List([]);
        if (st.length === 0) {
          setCascadeLoading("cities");
          try {
            const t2 = await fetch(
              `/api/places/tier2?country=${encodeURIComponent(birthCountryCode)}&state=`,
              { signal: ac.signal }
            );
            const t2d = (await t2.json()) as { tier2?: BirthTierRow[] };
            if (!ac.signal.aborted) setTier2List(Array.isArray(t2d.tier2) ? t2d.tier2 : []);
          } catch {
            if (!ac.signal.aborted) setTier2List([]);
          }
        } else {
          setTier2List([]);
        }
      })
      .catch(() => {
        if (!ac.signal.aborted) {
          setStatesList([]);
          setTier2List([]);
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setCascadeLoading(null);
      });
    return () => ac.abort();
  }, [birthCountryCode]);

  useEffect(() => {
    if (!birthCountryCode || statesList.length === 0) return;
    if (!birthStateCode) {
      setTier2List([]);
      setTier3List([]);
      setBirthTier2Code("");
      setBirthTier3Code("");
      return;
    }
    const ac = new AbortController();
    setCascadeLoading("cities");
    void fetch(
      `/api/places/tier2?country=${encodeURIComponent(birthCountryCode)}&state=${encodeURIComponent(birthStateCode)}`,
      { signal: ac.signal }
    )
      .then((r) => r.json())
      .then((d: { tier2?: BirthTierRow[] }) => {
        if (!ac.signal.aborted) {
          setTier2List(Array.isArray(d.tier2) ? d.tier2 : []);
          setBirthTier2Code("");
          setBirthTier3Code("");
          setTier3List([]);
        }
      })
      .catch(() => {
        if (!ac.signal.aborted) {
          setTier2List([]);
          setTier3List([]);
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setCascadeLoading(null);
      });
    return () => ac.abort();
  }, [birthCountryCode, birthStateCode, statesList.length]);

  const applyTier3Latest = useRef<(row: BirthTierRow) => Promise<void>>(async () => {});

  const syncTzFromLatLon = useCallback(async (lat: number, lon: number, countryIso: string) => {
    try {
      const r = await fetch(
        `/api/timezone-from-latlon?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}&country=${encodeURIComponent(countryIso)}`
      );
      const d = (await r.json()) as { timeZone?: string; error?: string };
      if (!r.ok || !d.timeZone) {
        return;
      }
      setTimeZone(d.timeZone);
    } catch {
      /* 保持当前 timeZone；可在高级里手选 */
    }
  }, []);

  const applyTier3Row = useCallback(
    async (row: BirthTierRow) => {
      const countryMeta = countriesList.find((x) => x.code === birthCountryCode);
      const stateMeta = statesList.find((x) => x.code === birthStateCode);
      const countryName = countryMeta?.label ?? birthCountryCode;
      const stateName = stateMeta?.labelZh ?? stateMeta?.name ?? "";
      const prefRow = tier2List.find((t) => t.code === birthTier2Code);
      let labelBase =
        birthCountryCode === "CN"
          ? [row.label, prefRow?.label, stateName || undefined, countryName].filter(Boolean).join(", ")
          : [prefRow?.label, stateName || undefined, countryName].filter(Boolean).join(", ");
      if (birthCountryCode === "US" && prefRow?.label && !row.code.startsWith("usge:")) {
        labelBase = [row.label, prefRow.label, stateName || undefined, countryName].filter(Boolean).join(", ");
      }
      setSelectedPlaceCountry(birthCountryCode.toLowerCase());
      setPlaceQuery("");
      setPlaceResults([]);
      const geoUs = decodeUsCountyGeocodeCode(row.code);
      if (geoUs) {
        const hit = await fetchGeocodeFirstHit(geoUs, "us");
        if (hit) {
          setPlacePrecision("us_county_geocode");
          setCoordinates(formatLatLonInput(hit.lat, hit.lon));
          setPlaceLabel(hit.label.length > 120 ? `${hit.label.slice(0, 117)}…` : hit.label);
          if (hit.countryCode) setSelectedPlaceCountry(hit.countryCode.toLowerCase());
          setFormError(null);
          const cc = (hit.countryCode ?? birthCountryCode).toUpperCase();
          await syncTzFromLatLon(hit.lat, hit.lon, cc);
        } else {
          setFormError("该县域暂无法自动定位，请用搜索或手输经纬度。");
        }
        return;
      }
      const intlGeo = decodeIntlGeocodeCode(row.code);
      if (intlGeo) {
        const hit = await fetchGeocodeFirstHit(intlGeo, birthCountryCode.toLowerCase());
        if (hit) {
          setPlacePrecision("intl_geocode");
          setCoordinates(formatLatLonInput(hit.lat, hit.lon));
          setPlaceLabel(hit.label.length > 120 ? `${hit.label.slice(0, 117)}…` : hit.label);
          if (hit.countryCode) setSelectedPlaceCountry(hit.countryCode.toLowerCase());
          setFormError(null);
          const cc = (hit.countryCode ?? birthCountryCode).toUpperCase();
          await syncTzFromLatLon(hit.lat, hit.lon, cc);
        } else {
          setFormError("地理编码未返回结果，请用地名搜索或手输经纬度。");
        }
        return;
      }
      const lat = row.lat != null ? Number(row.lat) : NaN;
      const lon = row.lon != null ? Number(row.lon) : NaN;
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        let prec: PlacePrecision = birthCountryCode === "US" ? "us_csc" : "csc_city";
        if (row.code.startsWith(GN_TIER3_PREFIX)) prec = "us_geonames";
        if (row.code.startsWith(USCC_TIER3_PREFIX)) prec = "us_centroid";
        setPlacePrecision(prec);
        setCoordinates(formatLatLonInput(lat, lon));
        setPlaceLabel(labelBase);
        setFormError(null);
        await syncTzFromLatLon(lat, lon, birthCountryCode);
        return;
      }
      const hit = await fetchGeocodeFirstHit(labelBase, birthCountryCode.toLowerCase());
      if (hit) {
        setPlacePrecision(birthCountryCode === "CN" ? "cn_geocode" : "cascade_geocode");
        setCoordinates(formatLatLonInput(hit.lat, hit.lon));
        setPlaceLabel(hit.label.length > 120 ? `${hit.label.slice(0, 117)}…` : hit.label);
        if (hit.countryCode) setSelectedPlaceCountry(hit.countryCode.toLowerCase());
        setFormError(null);
        const cc = (hit.countryCode ?? birthCountryCode).toUpperCase();
        await syncTzFromLatLon(hit.lat, hit.lon, cc);
      } else {
        setFormError("该地点暂无自动坐标，请用搜索或展开「高级」手输经纬度。");
      }
    },
    [
      birthCountryCode,
      birthStateCode,
      birthTier2Code,
      countriesList,
      statesList,
      tier2List,
      syncTzFromLatLon,
    ]
  );

  useEffect(() => {
    applyTier3Latest.current = applyTier3Row;
  }, [applyTier3Row]);

  useEffect(() => {
    if (!birthCountryCode || !birthTier2Code) {
      setTier3List([]);
      setBirthTier3Code("");
      return;
    }
    const ac = new AbortController();
    setCascadeLoading("cities");
    void fetch(
      `/api/places/tier3?country=${encodeURIComponent(birthCountryCode)}&parent=${encodeURIComponent(birthTier2Code)}`,
      { signal: ac.signal }
    )
      .then((r) => r.json())
      .then((d: { tier3?: BirthTierRow[] }) => {
        if (ac.signal.aborted) return;
        const list = Array.isArray(d.tier3) ? d.tier3 : [];
        setTier3List(list);
        setBirthTier3Code("");
        if (birthCountryCode !== "CN" && list.length === 1 && list[0]) {
          setBirthTier3Code(list[0].code);
          void applyTier3Latest.current(list[0]);
        }
      })
      .catch(() => {
        if (!ac.signal.aborted) {
          setTier3List([]);
          setBirthTier3Code("");
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setCascadeLoading(null);
      });
    return () => ac.abort();
  }, [birthCountryCode, birthTier2Code]);

  useEffect(() => {
    const q = placeQuery.trim();
    if (q.length < 2) {
      setPlaceResults([]);
      setPlaceLoading(false);
      setGeocodeEmptyHint(false);
      return;
    }

    const timer = window.setTimeout(() => {
      geocodeAbortRef.current?.abort();
      const ac = new AbortController();
      geocodeAbortRef.current = ac;
      setPlaceLoading(true);
      setGeocodeEmptyHint(false);

      const scope = placeScopeZh ? `&countries=${encodeURIComponent(GEOCODE_ZH_REGION)}` : "";
      void (async () => {
        try {
          const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}${scope}`, {
            signal: ac.signal,
          });
          const data = (await res.json()) as { results?: GeocodeHit[] };
          if (!ac.signal.aborted) {
            const list = Array.isArray(data.results) ? data.results : [];
            setPlaceResults(list);
            setGeocodeEmptyHint(placeScopeZh && list.length === 0);
          }
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") return;
          if (!ac.signal.aborted) {
            setPlaceResults([]);
            setGeocodeEmptyHint(false);
          }
        } finally {
          if (!ac.signal.aborted) setPlaceLoading(false);
        }
      })();
    }, 600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [placeQuery, placeScopeZh]);

  const triggerEnergyPulse = () => {
    if (typeof window === "undefined") return;
    const now = Date.now();
    if (now - lastPulseAtRef.current < 350) return; // 输入扫描节流：更贴近“剧烈跳动”
    lastPulseAtRef.current = now;
    window.dispatchEvent(new CustomEvent("energy:coordinate-pulse"));
  };

  const locked = !profile;

  const big3 = useMemo((): NatalBig3 | null => {
    if (!profile) return null;
    const utc = birthMomentToUtc(profile.birthdate, profile.birthTime, profile.timeZone);
    if (!utc) return null;
    return computeNatalBig3(utc, profile.latitude, profile.longitude);
  }, [profile]);

  const qualitativeLine = useMemo(() => (big3 ? natalQualitativeCopy(big3) : ""), [big3]);

  const timeZoneOptions = useMemo(() => {
    const set = new Set(BIRTH_TIMEZONE_PRESETS);
    if (timeZone && !set.has(timeZone)) {
      return [timeZone, ...BIRTH_TIMEZONE_PRESETS];
    }
    return [...BIRTH_TIMEZONE_PRESETS];
  }, [timeZone]);

  const quickCountries = useMemo((): CascadeCountry[] => {
    const map = new Map(countriesList.map((c) => [c.code, c]));
    return BIRTHPLACE_QUICK_ISO.map((code) => {
      const fromList = map.get(code);
      if (fromList) return fromList;
      return { code, label: QUICK_COUNTRY_LABEL_ZH[code], name: code };
    });
  }, [countriesList]);

  const pickBirthCountry = (code: string) => {
    triggerEnergyPulse();
    setBirthCountryCode(code);
    setBirthTier2Code("");
    setBirthTier3Code("");
    setCoordinates("");
    setPlaceLabel("");
    setPlacePrecision(null);
    setSelectedPlaceCountry(null);
    setFormError(null);
    setCountryMoreOpen(false);
  };

  const selectLikeClass = `${mono.className} w-full cursor-pointer appearance-none rounded-none bg-[#1a1528]/90 px-1 pb-3 pt-2 text-[13px] tracking-[0.14em] text-zinc-100 outline-none [color-scheme:dark]`;
  const selectLikeStyle = {
    borderBottomWidth: 0.5,
    borderBottomStyle: "solid" as const,
    borderBottomColor: "rgba(212,175,55,0.6)",
  };
  /** 筛选 + 下拉同一底边（与右侧 select 同字号/字重/行高，避免视觉上下错位） */
  const mergeBarShellClass =
    "flex min-h-11 items-center rounded-none bg-[#1a1528]/90";
  const mergeFilterInputClass = `${mono.className} box-border h-11 w-[6.75rem] shrink-0 border-0 bg-transparent py-0 pl-1 pr-1 text-[13px] font-normal leading-11 tracking-[0.14em] text-zinc-100 outline-none placeholder:text-zinc-500 [font-synthesis:none]`;
  const mergeSelectClass = `${mono.className} box-border h-11 min-h-11 min-w-0 flex-1 cursor-pointer appearance-none border-0 bg-transparent py-0 pl-1 pr-1 text-[13px] font-normal leading-11 tracking-[0.14em] text-zinc-100 outline-none [color-scheme:dark] [font-synthesis:none]`;
  /** 分段选日期/时间：固定栏宽 + 箭头，避免 flex-1 拉成一条「空屏」 */
  const birthPickerRowClass =
    "inline-flex min-h-11 max-w-max flex-nowrap items-stretch overflow-hidden rounded-lg border border-[#D4AF37]/38 bg-[#14101f]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] divide-x divide-[#d4af37]/25";
  /** 出生地三级 + 坐标：与日期栏同系金边分栏，极窄屏横向滑动 */
  const birthCascadeBarClass =
    "inline-flex max-w-full min-w-0 flex-nowrap items-stretch overflow-x-auto rounded-lg border border-[#D4AF37]/38 bg-[#14101f]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] divide-x divide-[#d4af37]/25";
  const birthCascadeColClass =
    "relative flex min-w-[10.25rem] max-w-[min(100vw-3rem,17.5rem)] shrink-0 flex-col gap-1 px-2 py-2";
  const birthCascadeSelectClass = `${mono.className} birth-cascade-select box-border h-11 min-h-11 shrink-0 cursor-pointer appearance-none border-0 bg-transparent py-0 pl-2 text-[13px] font-normal leading-11 tabular-nums text-zinc-100 outline-none [color-scheme:dark] [font-synthesis:none] text-center`;

  return (
    <motion.div
      className="relative mx-auto w-full max-w-6xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="rounded-[28px] border bg-[#201b33]/78 backdrop-blur-2xl overflow-hidden"
        style={{
          borderColor: "rgba(212, 175, 55, 0.34)",
          boxShadow:
            "0 0 0 1px rgba(212,175,55,0.16), 0 0 68px rgba(212,175,55,0.14), 0 40px 140px rgba(0,0,0,0.42)",
        }}
      >
        {/* 金色内光 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(212,175,55,0.16) 0%, rgba(26,11,61,0.10) 42%, rgba(0,0,0,0) 70%)",
            opacity: 0.9,
          }}
        />

        <div className="relative z-10 px-7 py-8 md:px-9 md:py-10">
          {/* 上沿细线 */}
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.52) 50%, rgba(212,175,55,0) 100%)",
              opacity: 0.55,
            }}
          />

          <div className="mt-8 flex flex-col items-center gap-6">
            {/* 未登录：诱惑态 */}
            <AnimatePresence mode="wait">
              {locked ? (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className="w-full"
                >
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <motion.div
                      className={`${mono.className} text-center text-[15px] md:text-[16px] tracking-[0.26em] text-transparent bg-clip-text`}
                      animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, rgba(212,175,55,0.14) 0%, rgba(247,231,181,0.95) 46%, rgba(212,175,55,0.14) 100%)",
                        backgroundSize: "200% 100%",
                        backgroundPosition: "0% 50%",
                        opacity: 0.92,
                        filter: `url(#goldSmoke) blur(${hovered ? 2 : 8}px)`,
                        transition: "filter 260ms ease",
                        textShadow: "0 0 26px rgba(212,175,55,0.12)",
                      }}
                    >
                      身份辉光弥散中…
                    </motion.div>

                    {/* SVG Filter：金色烟雾 */}
                    <svg className="absolute w-0 h-0" aria-hidden="true">
                      <defs>
                        <filter id="goldSmoke" x="-50%" y="-50%" width="200%" height="200%">
                          <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.012"
                            numOctaves={3}
                            seed={8}
                            stitchTiles="stitch"
                          >
                            <animate
                              attributeName="baseFrequency"
                              dur="12s"
                              values="0.009;0.015;0.009"
                              repeatCount="indefinite"
                            />
                          </feTurbulence>
                          <feDisplacementMap in="SourceGraphic" scale="14" />
                          <feColorMatrix
                            type="matrix"
                            values="1 0 0 0 0.65  0 0.85 0 0 0.45  0 0 0.2 0 0.05  0 0 0 1 0"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </motion.div>

                  <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <span
                      className={`${mono.className} inline-block text-[13px] tracking-[0.34em] bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-transparent`}
                      style={{
                        filter: "drop-shadow(0 0 18px rgba(251,245,183,0.22))",
                      }}
                    >
                      点击揭晓你的灵魂编码
                    </span>
                  </motion.div>

                    <motion.div
                      className="mt-4 text-center"
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: hovered ? 0 : 1, y: hovered ? -6 : 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      style={{ pointerEvents: "none" }}
                    >
                    <span
                      className={`${mono.className} inline-block text-[13px] tracking-[0.34em] bg-gradient-to-r from-[#D4AF37] via-[#f7e7b5] to-[#D4AF37] bg-clip-text text-transparent`}
                      style={{
                        filter: "drop-shadow(0 0 18px rgba(212,175,55,0.20))",
                      }}
                    >
                      填时间 → 选地点 → 点解开
                    </span>
                  </motion.div>

                  {/* 解锁输入区：日期 / 时刻 / 出生地 / 高级经纬度与时区 + 解开 */}
                  <motion.div
                    className="mt-7 space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hovered ? 1 : 0.75 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    <div className="identity-gold-native-selects rounded-xl border border-[#D4AF37]/12 bg-black/20 px-4 py-4 space-y-5">
                      <p
                        className={`${mono.className} text-[11px] tracking-[0.2em] text-zinc-400`}
                      >
                        ① 出生日期与时间
                      </p>
                    <div className="space-y-2">
                      <p
                        className={`${mono.className} text-[10px] tracking-[0.18em] text-zinc-500`}
                      >
                        公历日期 · 出生时刻（二十四小时制）
                      </p>
                      <div className="flex w-full justify-center overflow-x-auto pb-0.5 [-webkit-overflow-scrolling:touch] sm:justify-start">
                        <div
                          className={`${birthPickerRowClass} transition-shadow duration-300 focus-within:shadow-[0_0_0_1px_rgba(247,231,181,0.35),0_0_24px_rgba(212,175,55,0.12)]`}
                        >
                          <select
                            id="birth-year"
                            aria-label="出生年份"
                            value={pickY}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (v !== pickY) triggerEnergyPulse();
                              setFormError(null);
                              setPickY(v);
                            }}
                            className={`${birthCascadeSelectClass} w-[5rem] sm:w-24`}
                          >
                            <option value="">年</option>
                            {birthYearOptions.map((y) => (
                              <option key={y} value={String(y)}>
                                {y}年
                              </option>
                            ))}
                          </select>
                          <select
                            id="birth-month"
                            aria-label="出生月份"
                            value={pickM}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (v !== pickM) triggerEnergyPulse();
                              setFormError(null);
                              if (!v) {
                                setPickM("");
                                setPickD("");
                                return;
                              }
                              setPickM(v);
                            }}
                            className={`${birthCascadeSelectClass} w-[3.85rem] sm:w-[5rem]`}
                          >
                            <option value="">月</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                              <option key={m} value={String(m)}>
                                {m}月
                              </option>
                            ))}
                          </select>
                          <select
                            id="birth-day"
                            aria-label="出生日期（日）"
                            value={pickD}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (v !== pickD) triggerEnergyPulse();
                              setFormError(null);
                              if (!v) {
                                setPickD("");
                                return;
                              }
                              setPickD(v);
                            }}
                            className={`${birthCascadeSelectClass} w-[3.85rem] sm:w-[5rem]`}
                          >
                            <option value="">日</option>
                            {birthDayOptions.map((d) => (
                              <option key={d} value={String(d)}>
                                {d}日
                              </option>
                            ))}
                          </select>
                          <select
                            id="birth-hour"
                            aria-label="出生时刻 · 时"
                            value={birthTimeParts.h}
                            onChange={(e) => {
                              const h = Number(e.target.value);
                              const mm = Number(birthTimeParts.min);
                              const next = `${h}:${pad2(mm)}`;
                              if (next !== birthTime.trim()) triggerEnergyPulse();
                              setFormError(null);
                              setBirthTime(next);
                            }}
                            className={`${birthCascadeSelectClass} w-[3.85rem] sm:w-[5.25rem]`}
                          >
                            {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                              <option key={h} value={String(h)}>
                                {pad2(h)}时
                              </option>
                            ))}
                          </select>
                          <select
                            id="birth-minute"
                            aria-label="出生时刻 · 分"
                            value={birthTimeParts.min}
                            onChange={(e) => {
                              const mm = Number(e.target.value);
                              const h = Number(birthTimeParts.h);
                              const next = `${h}:${pad2(mm)}`;
                              if (next !== birthTime.trim()) triggerEnergyPulse();
                              setFormError(null);
                              setBirthTime(next);
                            }}
                            className={`${birthCascadeSelectClass} w-[3.85rem] sm:w-[5.25rem]`}
                          >
                            {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                              <option key={m} value={String(m)}>
                                {pad2(m)}分
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p
                          className={`${mono.className} mb-2 text-[11px] tracking-[0.12em] text-zinc-500`}
                        >
                          出生国家
                        </p>
                        {cascadeLoading === "countries" && countriesList.length === 0 ? (
                          <p className={`${mono.className} mb-1 text-[11px] text-zinc-500`}>
                            正在同步全球列表（可先选常用国家）
                          </p>
                        ) : null}
                        <>
                            <div className="flex flex-wrap gap-2">
                              {quickCountries
                                .filter((c) => c.code === "US")
                                .map((c) => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => pickBirthCountry(c.code)}
                                    className={`${mono.className} rounded-full border px-3 py-1.5 text-[11px] tracking-[0.14em] transition-colors ${
                                      birthCountryCode === c.code
                                        ? "border-[#D4AF37]/80 bg-[#D4AF37]/20 text-[#f5d178]"
                                        : "border-[#D4AF37]/25 text-zinc-400 hover:border-[#D4AF37]/45 hover:text-zinc-200"
                                    }`}
                                  >
                                    {c.label}
                                  </button>
                                ))}

                              <button
                                type="button"
                                onClick={() => pickBirthCountry("CN")}
                                className={`${mono.className} rounded-full border px-3 py-1.5 text-[11px] tracking-[0.14em] transition-colors ${
                                  CHINA_FAMILY_CODES.has(birthCountryCode)
                                    ? "border-[#D4AF37]/80 bg-[#D4AF37]/20 text-[#f5d178]"
                                    : "border-[#D4AF37]/25 text-zinc-400 hover:border-[#D4AF37]/45 hover:text-zinc-200"
                                }`}
                              >
                                {countriesList.find((c) => c.code === "CN")?.label ?? "中国"}
                              </button>

                              {quickCountries
                                .filter((c) => c.code !== "US")
                                .map((c) => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => pickBirthCountry(c.code)}
                                    className={`${mono.className} rounded-full border px-3 py-1.5 text-[11px] tracking-[0.14em] transition-colors ${
                                      birthCountryCode === c.code
                                        ? "border-[#D4AF37]/80 bg-[#D4AF37]/20 text-[#f5d178]"
                                        : "border-[#D4AF37]/25 text-zinc-400 hover:border-[#D4AF37]/45 hover:text-zinc-200"
                                    }`}
                                  >
                                    {c.label}
                                  </button>
                                ))}

                              <button
                                type="button"
                                onClick={() => {
                                  triggerEnergyPulse();
                                  setCountryMoreOpen((v) => !v);
                                }}
                                className={`${mono.className} rounded-full border border-dashed border-[#D4AF37]/35 px-3 py-1.5 text-[11px] tracking-[0.14em] text-zinc-500 hover:text-zinc-300`}
                              >
                                {countryMoreOpen ? "收起全球列表" : "陆续会增加更多国家"}
                              </button>
                            </div>
                            {countryMoreOpen ? (
                              <div className="relative mt-2">
                                <label className="sr-only">从全球列表选择国家</label>
                                <select
                                  value={birthCountryCode}
                                  onChange={(e) => {
                                    pickBirthCountry(e.target.value);
                                  }}
                                  onFocus={() => setFocused("birthCountry")}
                                  onBlur={() => setFocused(null)}
                                  disabled={countriesList.length === 0}
                                  className={selectLikeClass}
                                  style={selectLikeStyle}
                                >
                                  <option value="">
                                    {countriesList.length === 0 ? "全球列表加载中…" : "从全球列表选择…"}
                                  </option>
                                  {countriesList.map((c) => (
                                    <option key={c.code} value={c.code}>
                                      {c.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : null}
                            {birthCountryCode &&
                            !countryMoreOpen &&
                            !quickCountries.some((c) => c.code === birthCountryCode) &&
                            birthCountryCode !== "CN" &&
                            !CHINA_FAMILY_CODES.has(birthCountryCode) ? (
                              <p className={`${mono.className} mt-2 text-[11px] text-zinc-500`}>
                                已选：
                                {countriesList.find((x) => x.code === birthCountryCode)?.label ??
                                  birthCountryCode}
                              </p>
                            ) : null}
                          </>
                      </div>
                    </div>

                      <div
                        className="h-px w-full"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.22), transparent)" }}
                        aria-hidden="true"
                      />

                      {birthCountryCode ? (
                        <div className={`${mono.className} w-full min-w-0 space-y-2`}>
                          <div
                            className={birthCascadeBarClass}
                            title="地点逐级选择；栏可横向滑动"
                          >
                            <div className={birthCascadeColClass}>
                              {statesList.length > 0 ? (
                                <>
                                  <label
                                    className={`${mono.className} block text-[10px] leading-tight tracking-[0.08em] text-zinc-500`}
                                  >
                                    {birthplaceTier1Label(birthCountryCode)}
                                  </label>
                                  <div className="relative">
                                    <div className={mergeBarShellClass} style={selectLikeStyle}>
                                      {statesList.length >= BIRTHPLACE_LIST_FILTER_MIN ? (
                                        <input
                                          value={stateListFilter}
                                          onChange={(e) => setStateListFilter(e.target.value)}
                                          placeholder="筛选…"
                                          aria-label="筛选省、州或一级区划"
                                          onFocus={() => setFocused("birthState")}
                                          onBlur={() => setFocused(null)}
                                          className={mergeFilterInputClass}
                                        />
                                      ) : null}
                                      <div
                                        className={
                                          statesList.length >= BIRTHPLACE_LIST_FILTER_MIN
                                            ? "flex min-h-11 min-w-0 flex-1 items-center border-l border-zinc-600/35"
                                            : "min-w-0 flex-1"
                                        }
                                      >
                                        <select
                                          aria-label={birthplaceTier1Label(birthCountryCode)}
                                    value={birthStateCode}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      if (v === CN_STATE_GOTO_HK) {
                                        pickBirthCountry("HK");
                                        return;
                                      }
                                      if (v === CN_STATE_GOTO_MO) {
                                        pickBirthCountry("MO");
                                        return;
                                      }
                                      if (v === CN_STATE_GOTO_TW) {
                                        pickBirthCountry("TW");
                                        return;
                                      }
                                      triggerEnergyPulse();
                                      setBirthStateCode(v);
                                      setBirthTier2Code("");
                                      setBirthTier3Code("");
                                      setCoordinates("");
                                      setPlaceLabel("");
                                      setPlacePrecision(null);
                                      setFormError(null);
                                    }}
                                    onFocus={() => setFocused("birthState")}
                                    onBlur={() => setFocused(null)}
                                    disabled={cascadeLoading === "states"}
                                    className={
                                      statesList.length >= BIRTHPLACE_LIST_FILTER_MIN
                                        ? mergeSelectClass
                                        : selectLikeClass
                                    }
                                    style={
                                      statesList.length >= BIRTHPLACE_LIST_FILTER_MIN ? undefined : selectLikeStyle
                                    }
                                  >
                                    <option value="">请选择</option>
                                    {statesForSelect.map((s) => (
                                      <option key={s.code} value={s.code}>
                                        {s.labelZh ?? s.name}
                                      </option>
                                    ))}
                                    {birthCountryCode === "CN" ? (() => {
                                      const sq = stateListFilter.trim().toLowerCase();
                                      const showOpt = (label: string) => !sq || label.toLowerCase().includes(sq);
                                      const hk = showOpt("香港特别行政区");
                                      const mo = showOpt("澳门特别行政区");
                                      const tw = showOpt("台湾");
                                      if (!hk && !mo && !tw) return null;
                                      return (
                                        <optgroup label="港澳台">
                                          {hk ? <option value={CN_STATE_GOTO_HK}>香港特别行政区</option> : null}
                                          {mo ? <option value={CN_STATE_GOTO_MO}>澳门特别行政区</option> : null}
                                          {tw ? <option value={CN_STATE_GOTO_TW}>台湾</option> : null}
                                        </optgroup>
                                      );
                                    })() : null}
                                  </select>
                                </div>
                              </div>
                              <motion.div
                                aria-hidden="true"
                                className="pointer-events-none absolute left-0 right-0 bottom-0 h-[0.5px]"
                                style={{
                                  backgroundImage:
                                    "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(247,231,181,0.95) 45%, rgba(212,175,55,0) 100%)",
                                  backgroundSize: "200% 100%",
                                  transformOrigin: "center",
                                }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: focused === "birthState" ? 1 : 0 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                              />
                            </div>
                                </>
                              ) : cascadeLoading === "states" && statesList.length === 0 ? (
                                <>
                                  <label
                                    className={`${mono.className} block text-[10px] leading-tight tracking-[0.08em] text-zinc-500`}
                                  >
                                    {birthplaceTier1Label(birthCountryCode)}
                                  </label>
                                  <div
                                    className={`${mergeBarShellClass} flex min-h-11 items-center px-2 text-[11px] text-zinc-500`}
                                    style={selectLikeStyle}
                                  >
                                    加载一级…
                                  </div>
                                </>
                              ) : (
                                <>
                                  <label
                                    className={`${mono.className} block text-[10px] leading-tight tracking-[0.08em] text-zinc-500`}
                                  >
                                    {birthplaceTier1Label(birthCountryCode)}
                                  </label>
                                  <select
                                    aria-label={`${birthplaceTier1Label(birthCountryCode)}（该国无下级列表）`}
                                    disabled
                                    value="__NONE__"
                                    className={`${selectLikeClass} opacity-60`}
                                    style={selectLikeStyle}
                                  >
                                    <option value="__NONE__">
                                      （库内无州/省列表；下一栏为地区中心，不对请搜索或手输经纬度）
                                    </option>
                                  </select>
                                </>
                              )}
                            </div>

                            <div className={birthCascadeColClass}>
                              <label
                                className={`${mono.className} block text-[10px] leading-tight tracking-[0.08em] text-zinc-500`}
                              >
                                {birthplaceTier2Label(birthCountryCode)}
                              </label>
                              <div className="relative">
                                <div className={mergeBarShellClass} style={selectLikeStyle}>
                              {tier2List.length >= BIRTHPLACE_LIST_FILTER_MIN ? (
                                <input
                                  value={tier2Filter}
                                  onChange={(e) => setTier2Filter(e.target.value)}
                                  placeholder="筛选…"
                                  aria-label="筛选第二级地点列表"
                                  onFocus={() => setFocused("birthTier2")}
                                  onBlur={() => setFocused(null)}
                                  disabled={
                                    !birthCountryCode ||
                                    cascadeLoading === "cities" ||
                                    (statesList.length > 0 && !birthStateCode) ||
                                    tier2List.length === 0
                                  }
                                  className={`${mergeFilterInputClass} disabled:opacity-40`}
                                />
                              ) : null}
                              <div
                                className={
                                  tier2List.length >= BIRTHPLACE_LIST_FILTER_MIN
                                    ? "flex min-h-11 min-w-0 flex-1 items-center border-l border-zinc-600/35"
                                    : "min-w-0 flex-1"
                                }
                              >
                                <select
                                  aria-label={birthplaceTier2Label(birthCountryCode)}
                                  value={birthTier2Code}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    triggerEnergyPulse();
                                    setBirthTier2Code(v);
                                    setBirthTier3Code("");
                                    setCoordinates("");
                                    setPlaceLabel("");
                                    setPlacePrecision(null);
                                    setFormError(null);
                                  }}
                                  onFocus={() => setFocused("birthTier2")}
                                  onBlur={() => setFocused(null)}
                                  disabled={
                                    !birthCountryCode ||
                                    cascadeLoading === "cities" ||
                                    (statesList.length > 0 && !birthStateCode) ||
                                    tier2List.length === 0
                                  }
                                  className={
                                    tier2List.length >= BIRTHPLACE_LIST_FILTER_MIN
                                      ? mergeSelectClass
                                      : selectLikeClass
                                  }
                                  style={
                                    tier2List.length >= BIRTHPLACE_LIST_FILTER_MIN ? undefined : selectLikeStyle
                                  }
                                >
                                  <option value="">
                                    {!birthCountryCode
                                      ? "请先点选上面的国家"
                                      : statesList.length > 0 && !birthStateCode
                                        ? "请先选州/省"
                                        : tier2List.length === 0
                                          ? cascadeLoading === "cities"
                                            ? "加载中…"
                                            : birthCountryCode
                                              ? birthCountryCode === "US"
                                                ? "该州暂无县级数据"
                                                : "暂无数据"
                                              : "请先点选国家"
                                          : birthCountryCode === "CN"
                                            ? "请选择地级市等"
                                            : birthCountryCode === "US"
                                              ? "请选择县（County 等）"
                                              : "请选择城镇"}
                                  </option>
                                  {tier2ForSelect.map((t) => (
                                    <option key={t.code} value={t.code}>
                                      {t.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <motion.div
                              aria-hidden="true"
                              className="pointer-events-none absolute left-0 right-0 bottom-0 h-[0.5px]"
                              style={{
                                backgroundImage:
                                  "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(247,231,181,0.95) 45%, rgba(212,175,55,0) 100%)",
                                backgroundSize: "200% 100%",
                                transformOrigin: "center",
                              }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: focused === "birthTier2" ? 1 : 0 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                            />
                          </div>
                            </div>

                            <div className={birthCascadeColClass}>
                              <label
                                className={`${mono.className} block text-[10px] leading-tight tracking-[0.08em] text-zinc-500`}
                              >
                                {birthplaceTier3Label(birthCountryCode)}
                              </label>
                              <div className="relative">
                                <div className={mergeBarShellClass} style={selectLikeStyle}>
                                  {tier3List.length >= BIRTHPLACE_LIST_FILTER_MIN ? (
                                    <input
                                      value={tier3Filter}
                                      onChange={(e) => setTier3Filter(e.target.value)}
                                      placeholder="筛选…"
                                      aria-label="筛选第三级地点列表"
                                      onFocus={() => setFocused("birthTier3")}
                                      onBlur={() => setFocused(null)}
                                      disabled={
                                        !birthCountryCode ||
                                        !birthTier2Code ||
                                        cascadeLoading === "cities" ||
                                        tier3List.length === 0
                                      }
                                      className={`${mergeFilterInputClass} disabled:opacity-40`}
                                    />
                                  ) : null}
                                  <div
                                    className={
                                      tier3List.length >= BIRTHPLACE_LIST_FILTER_MIN
                                        ? "flex min-h-11 min-w-0 flex-1 items-center border-l border-zinc-600/35"
                                        : "min-w-0 flex-1"
                                    }
                                  >
                                    <select
                                      aria-label={birthplaceTier3Label(birthCountryCode)}
                                      value={birthTier3Code}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        setBirthTier3Code(v);
                                        const row = tier3List.find((x) => x.code === v);
                                        if (row) {
                                          triggerEnergyPulse();
                                          void applyTier3Row(row);
                                        }
                                      }}
                                      onFocus={() => setFocused("birthTier3")}
                                      onBlur={() => setFocused(null)}
                                      disabled={
                                        !birthCountryCode ||
                                        !birthTier2Code ||
                                        cascadeLoading === "cities" ||
                                        tier3List.length === 0
                                      }
                                      className={
                                        tier3List.length >= BIRTHPLACE_LIST_FILTER_MIN
                                          ? mergeSelectClass
                                          : selectLikeClass
                                      }
                                      style={
                                        tier3List.length >= BIRTHPLACE_LIST_FILTER_MIN
                                          ? undefined
                                          : selectLikeStyle
                                      }
                                    >
                                      <option value="">
                                        {!birthTier2Code
                                          ? "请先选上一级"
                                          : tier3List.length === 0
                                            ? cascadeLoading === "cities"
                                              ? "加载中…"
                                              : "暂无"
                                            : birthCountryCode === "CN"
                                              ? "请选择区县"
                                              : birthCountryCode === "US"
                                                ? "请选择城镇或县域近似"
                                                : "请确认点位"}
                                      </option>
                                      {tier3ForSelect.map((t) => (
                                        <option key={t.code} value={t.code}>
                                          {t.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <motion.div
                                  aria-hidden="true"
                                  className="pointer-events-none absolute left-0 right-0 bottom-0 h-[0.5px]"
                                  style={{
                                    backgroundImage:
                                      "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(247,231,181,0.95) 45%, rgba(212,175,55,0) 100%)",
                                    backgroundSize: "200% 100%",
                                    transformOrigin: "center",
                                  }}
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: focused === "birthTier3" ? 1 : 0 }}
                                  transition={{ duration: 0.35, ease: "easeOut" }}
                                />
                              </div>
                            </div>

                            <div className={`${birthCascadeColClass} min-w-[9rem] max-w-[15rem]`}>
                              <span
                                className={`${mono.className} block text-[10px] leading-tight tracking-[0.08em] text-zinc-500`}
                              >
                                坐标
                              </span>
                              <div className={mergeBarShellClass} style={selectLikeStyle}>
                                <div
                                  className={`${mono.className} flex min-h-11 w-full items-center px-1 text-[10px] leading-snug tracking-[0.06em]`}
                                  title={
                                    resolvedLatLon
                                      ? `${resolvedLatLon.lat.toFixed(5)}, ${resolvedLatLon.lon.toFixed(5)}`
                                      : undefined
                                  }
                                >
                                  {resolvedLatLon ? (
                                    <span className="text-[#e8d5a3]/95">
                                      {formatLatLonDisplayZh(resolvedLatLon.lat, resolvedLatLon.lon)}
                                    </span>
                                  ) : (
                                    <span className="text-zinc-600">选定后显示</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {showTier2EmptyHelp ? (
                            <p
                              className={`${mono.className} text-[11px] leading-relaxed tracking-[0.12em] text-amber-200/75`}
                            >
                              当前上一级组合下没有可选第二级。请改选州/省，或用地名搜索、手输经纬度完成定位。
                            </p>
                          ) : null}
                          {showTier3EmptyHelp ? (
                            <p
                              className={`${mono.className} text-[11px] leading-relaxed tracking-[0.12em] text-amber-200/75`}
                            >
                              当前没有第三级可选项（多为库内缺数据）。请改选县/城镇，或用地名搜索、手输经纬度。
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      <details className={`${mono.className} mt-2 rounded-lg border border-[#D4AF37]/10 bg-black/15 px-3 py-2 text-left text-[11px] text-zinc-500`}>
                        <summary className="cursor-pointer select-none tracking-[0.12em] text-zinc-400 hover:text-zinc-300">
                          列表里找不到？用搜索框
                        </summary>
                        <div className="mt-3 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-zinc-500">范围</span>
                            <div
                              className={`${mono.className} inline-flex rounded-full border border-[#D4AF37]/25 p-0.5 text-[11px] tracking-[0.12em]`}
                              role="group"
                              aria-label="搜索范围"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  triggerEnergyPulse();
                                  setPlaceScopeZh(true);
                                }}
                                className={`rounded-full px-3 py-1 transition-colors ${
                                  placeScopeZh
                                    ? "bg-[#D4AF37]/25 text-[#f5d178]"
                                    : "text-zinc-500 hover:text-zinc-300"
                                }`}
                              >
                                内地/港澳台
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  triggerEnergyPulse();
                                  setPlaceScopeZh(false);
                                }}
                                className={`rounded-full px-3 py-1 transition-colors ${
                                  !placeScopeZh
                                    ? "bg-[#D4AF37]/25 text-[#f5d178]"
                                    : "text-zinc-500 hover:text-zinc-300"
                                }`}
                              >
                                全球
                              </button>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              value={placeQuery}
                              onChange={(e) => {
                                const next = e.target.value;
                                if (next !== placeQuery) triggerEnergyPulse();
                                setPlaceQuery(next);
                                setFormError(null);
                              }}
                              onFocus={() => setFocused("placeQuery")}
                              onBlur={() => setFocused(null)}
                              placeholder="输入地名，下方出现结果后点选"
                              autoComplete="off"
                              className={`${mono.className} w-full bg-transparent px-1 pb-3 pt-2 text-[13px] tracking-[0.12em] text-zinc-100 outline-none placeholder:text-zinc-500`}
                              style={selectLikeStyle}
                            />
                            {placeLoading ? (
                              <p className={`${mono.className} mt-2 text-[11px] text-zinc-500`}>正在搜索…</p>
                            ) : null}
                            {placeResults.length > 0 ? (
                              <ul
                                className={`${mono.className} mt-2 max-h-40 overflow-y-auto rounded-lg border border-[#D4AF37]/20 bg-[#1a1528]/95 py-1 text-left text-[12px] leading-snug text-zinc-200`}
                                role="listbox"
                              >
                                {placeResults.map((hit, idx) => (
                                  <li key={`${hit.lat},${hit.lon},${idx}`}>
                                    <button
                                      type="button"
                                      className="w-full px-3 py-2 text-left hover:bg-[#D4AF37]/12"
                                      onClick={() => {
                                        triggerEnergyPulse();
                                        setPlacePrecision("search");
                                        setCoordinates(formatLatLonInput(hit.lat, hit.lon));
                                        setPlaceLabel(
                                          hit.label.length > 120 ? `${hit.label.slice(0, 117)}…` : hit.label
                                        );
                                        setSelectedPlaceCountry(hit.countryCode?.toLowerCase() ?? null);
                                        void syncTzFromLatLon(
                                          hit.lat,
                                          hit.lon,
                                          (hit.countryCode ?? "").toUpperCase()
                                        );
                                        setPlaceResults([]);
                                        setPlaceQuery("");
                                        setBirthCountryCode("");
                                        setBirthStateCode("");
                                        setBirthTier2Code("");
                                        setBirthTier3Code("");
                                        setStatesList([]);
                                        setTier2List([]);
                                        setTier3List([]);
                                        setFormError(null);
                                      }}
                                    >
                                      {hit.label.length > 100 ? `${hit.label.slice(0, 97)}…` : hit.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                            {geocodeEmptyHint && !placeLoading ? (
                              <p className={`${mono.className} mt-2 text-[11px] text-amber-200/80`}>
                                当前范围内无结果，可切「全球」再试。
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </details>

                    {placeLabel || resolvedLatLon ? (
                      <div
                        className={`${mono.className} rounded-lg border border-[#D4AF37]/20 bg-[#1a1528]/60 px-3 py-2.5 text-[11px] leading-relaxed tracking-[0.08em] text-[#D4AF37]/90`}
                      >
                        {placeLabel ? (
                          <div>
                            <span className="text-zinc-500">已选 </span>
                            {placeLabel}
                          </div>
                        ) : null}
                        <p
                          className={`${mono.className} ${placeLabel ? "mt-1.5" : ""} text-[10px] leading-relaxed tracking-[0.08em] text-zinc-500`}
                        >
                          出生时刻换算用时区：
                          <span className="text-zinc-400">
                            {birthTimezoneSummaryZh(
                              timeZone,
                              birthCountryCode ||
                                (selectedPlaceCountry ? selectedPlaceCountry.toUpperCase() : "")
                            )}
                          </span>
                          （由经纬度自动推算；极个别可在「高级」手改）
                        </p>
                        <p
                          className={`${mono.className} mt-1.5 text-[10px] leading-relaxed tracking-[0.08em] text-zinc-600`}
                        >
                          定盘方式：
                          <span className="text-zinc-400">
                            {placePrecisionLabelZh(placePrecision ?? "unknown")}
                          </span>
                        </p>
                      </div>
                    ) : null}

                    {tzPlaceHint ? (
                      <p
                        className={`${mono.className} text-[11px] leading-relaxed tracking-[0.08em] text-amber-200/85`}
                      >
                        {tzPlaceHint}
                      </p>
                    ) : null}

                    <details className={`${mono.className} rounded-lg border border-[#D4AF37]/10 bg-black/15 px-3 py-2 text-left text-[11px] text-zinc-500`}>
                      <summary className="cursor-pointer select-none tracking-[0.12em] text-zinc-400 hover:text-zinc-300">
                        {resolvedLatLon ? (
                          <>
                            <span className="text-zinc-500">坐标 </span>
                            <span className="text-[#e8d5a3]/95">
                              {formatLatLonDisplayZh(resolvedLatLon.lat, resolvedLatLon.lon)}
                            </span>
                            <span className="text-zinc-600"> · 展开可手改</span>
                          </>
                        ) : (
                          "高级：手改经纬度或 IANA 时区（一般不用）"
                        )}
                      </summary>
                      <div className="relative mt-3">
                        <input
                          value={coordinates}
                          onChange={(e) => {
                            const next = e.target.value;
                            if (next !== coordinates) triggerEnergyPulse();
                            setCoordinates(next);
                            setSelectedPlaceCountry(null);
                            setFormError(null);
                            if (!next.trim()) setPlacePrecision(null);
                          }}
                          onFocus={() => setFocused("coordinates")}
                          onBlur={() => {
                            setFocused(null);
                            const ll = parseLatLon(coordinates);
                            if (ll) {
                              setPlacePrecision("manual");
                              const iso =
                                birthCountryCode ||
                                (selectedPlaceCountry ? selectedPlaceCountry.toUpperCase() : "");
                              void syncTzFromLatLon(ll.lat, ll.lon, iso);
                            }
                          }}
                          placeholder="纬度，经度（北纬、东经为正）"
                          className={`${mono.className} w-full bg-transparent px-1 pb-3 pt-2 text-[13px] tracking-[0.14em] text-zinc-100 outline-none placeholder:text-zinc-400`}
                          style={{
                            borderBottomWidth: 0.5,
                            borderBottomStyle: "solid",
                            borderBottomColor: "rgba(212,175,55,0.45)",
                          }}
                        />
                        <motion.div
                          aria-hidden="true"
                          className="absolute left-0 right-0 bottom-0 h-[0.5px]"
                          style={{
                            backgroundImage:
                              "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(247,231,181,0.7) 45%, rgba(212,175,55,0) 100%)",
                            backgroundSize: "200% 100%",
                            transformOrigin: "center",
                          }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: focused === "coordinates" ? 1 : 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                        />
                      </div>
                      <label className={`${mono.className} mb-1 mt-4 block text-[11px] text-zinc-500`}>
                        IANA 时区（默认随经纬度更新；边境/历史夏令时争议时可手选）
                      </label>
                      <select
                        value={timeZone}
                        onChange={(e) => {
                          triggerEnergyPulse();
                          setTimeZone(e.target.value);
                          setFormError(null);
                        }}
                        className={`${mono.className} w-full cursor-pointer appearance-none rounded-md border border-[#D4AF37]/20 bg-[#1a1528]/90 px-2 py-2 text-[12px] tracking-[0.1em] text-zinc-200 outline-none [color-scheme:dark]`}
                      >
                        {timeZoneOptions.map((tz) => (
                          <option key={tz} value={tz}>
                            {birthTimeZoneLabelZh(tz)}
                          </option>
                        ))}
                      </select>
                    </details>

                    <div className="flex justify-end pt-1">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onHoverStart={() => setButtonHovered(true)}
                      onHoverEnd={() => setButtonHovered(false)}
                      disabled={unlocking || !hydrated}
                      aria-disabled={unlocking || !hydrated}
                      onClick={async () => {
                        if (unlocking) return;
                        setFormError(null);

                        const utc = birthMomentToUtc(birthdate.trim(), birthTime.trim(), timeZone);
                        const ll = resolvedLatLon;
                        if (!utc) {
                          setFormError("日期请用 1990-06-15 这种格式；时刻请用 14:30 这种 24 小时制。");
                          return;
                        }
                        if (!ll) {
                          setFormError("请先选好国家与城市；或展开「列表里找不到」用搜索；或「高级」手填经纬度。");
                          return;
                        }

                        setUnlocking(true);
                        setUnlockNonce((n) => n + 1);

                        await playClick();
                        await playUnlock(); // 空灵撞击：随后炸裂显现 Big 3

                        const next: UserProfile = {
                          birthdate: birthdate.trim(),
                          birthTime: birthTime.trim(),
                          timeZone,
                          latitude: ll.lat,
                          longitude: ll.lon,
                          coordinates: coordinates.trim(),
                          placeLabel: placeLabel.trim() || undefined,
                          placePrecision: placePrecision ?? undefined,
                        };

                        try {
                          localStorage.setItem("user_profile", JSON.stringify(next));
                        } catch {
                          // ignore
                        }

                        window.setTimeout(() => {
                          setProfile(next);
                          setUnlocking(false);
                        }, 220);
                      }}
                      className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/65 bg-[#2b2114]/65 px-5 py-3 text-[13px] text-[#f5d178] backdrop-blur-xl disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        boxShadow: "0 0 0 1px rgba(212,175,55,0.16), 0 0 42px rgba(212,175,55,0.2)",
                      }}
                    >
                      {/* 顺时针旋转边框流光（hover 才明显） */}
                      <motion.div
                        aria-hidden="true"
                        className="absolute -inset-[2px] rounded-2xl"
                        initial={false}
                        animate={{ opacity: buttonHovered ? 1 : 0.35, rotate: [0, 360] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                        style={{
                          background:
                            "conic-gradient(from 0deg at 50% 50%, rgba(212,175,55,0) 0deg, rgba(247,231,181,0.85) 54deg, rgba(212,175,55,0.10) 110deg, rgba(212,175,55,0) 170deg, rgba(247,231,181,0.55) 240deg, rgba(212,175,55,0) 360deg)",
                          filter: "blur(14px)",
                          mixBlendMode: "screen",
                          WebkitMaskImage:
                            "radial-gradient(circle at 50% 50%, transparent 60%, #000 64%)",
                          maskImage:
                            "radial-gradient(circle at 50% 50%, transparent 60%, #000 64%)",
                        }}
                      />

                      <span className="relative z-10 inline-flex items-center gap-2">
                        <span className={`${mono.className} tracking-[0.42em]`}>解</span>
                        <span className={`${mono.className} tracking-[0.42em]`}>开</span>
                      </span>
                    </motion.button>
                    </div>
                    </div>

                    {formError ? (
                      <p
                        className={`${mono.className} text-center text-[12px] tracking-[0.2em] text-rose-300/90`}
                      >
                        {formError}
                      </p>
                    ) : null}

                    <details
                      className={`${mono.className} rounded-lg border border-[#D4AF37]/15 bg-black/25 px-3 py-2.5 text-left text-[11px] leading-relaxed tracking-[0.1em] text-zinc-400`}
                    >
                      <summary className="cursor-pointer select-none text-zinc-300 tracking-[0.14em]">
                        算法说明（可选阅读）
                      </summary>
                      <ul className="mt-2 list-disc space-y-1.5 pl-4">
                        {NATAL_COMPUTATION_DISCLOSURE_ZH.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </details>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="unlocked"
                  initial={{ opacity: 0, y: 16, filter: "blur(18px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  {/* 拨云见日遮罩 */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 1, filter: "blur(22px)", scale: 1.06 }}
                    animate={{ opacity: 0, filter: "blur(0px)", scale: 0.99 }}
                    transition={{ duration: 1.0, ease: "easeOut" }}
                    style={{
                      background:
                        "radial-gradient(circle at 40% 35%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.72) 45%, rgba(0,0,0,0) 75%)",
                    }}
                  />

                  {/* 中心向外“炸裂”光环 */}
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.35 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.35, 1.22, 1] }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    style={{
                      background:
                        "radial-gradient(circle at 50% 40%, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0.16) 35%, rgba(0,0,0,0) 70%)",
                      filter: "blur(10px)",
                      mixBlendMode: "screen",
                    }}
                  />

                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      key={`big3-${unlockNonce}`}
                      className={`${mono.className} text-center text-[15px] md:text-[16px] tracking-[0.26em] text-[#D4AF37]/92`}
                      initial={{ opacity: 0, y: 14, scale: 0.6, filter: "blur(22px)" }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: [0.68, 1.1, 1],
                        filter: "blur(0px)",
                      }}
                      transition={{
                        delay: 0.08,
                        duration: 0.85,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{ textShadow: "0 0 26px rgba(212,175,55,0.22)" }}
                    >
                      ☉ {symbolFor(big3?.sun ?? "")} · ☽ {symbolFor(big3?.moon ?? "")} · ↑{" "}
                      {symbolFor(big3?.rising ?? "")}
                      <span className="text-[#D4AF37]/70">
                        {" "}
                        {big3?.sun ? zodiacLabel(big3.sun) : ""} · {big3?.moon ? zodiacLabel(big3.moon) : ""} ·{" "}
                        {big3?.rising ? zodiacLabel(big3.rising) : ""}
                      </span>
                    </motion.div>

                    {profile.placeLabel ? (
                      <p
                        className={`${mono.className} mt-3 max-w-md px-2 text-center text-[11px] leading-relaxed tracking-[0.08em] text-zinc-400`}
                      >
                        出生地记录：{profile.placeLabel}
                      </p>
                    ) : null}
                    {profile.placePrecision ? (
                      <p
                        className={`${mono.className} mt-1 max-w-md px-2 text-center text-[10px] leading-relaxed tracking-[0.08em] text-zinc-500`}
                      >
                        定盘方式：{placePrecisionLabelZh(profile.placePrecision)}
                      </p>
                    ) : null}

                    <motion.div
                      className={`${playfair.className} mt-6 text-center text-[14px] md:text-[16px] leading-relaxed text-zinc-100`}
                      initial={{ opacity: 0, y: 14, filter: "blur(14px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.25, duration: 0.65, ease: "easeOut" }}
                      style={{ letterSpacing: "0.22em" }}
                    >
                      {qualitativeLine}
                    </motion.div>

                    <p
                      className={`${mono.className} mx-auto mt-3 max-w-md text-center text-[11px] leading-relaxed tracking-[0.12em] text-zinc-500`}
                    >
                      三主星按热带黄道与公示口径推算；出生地坐标来自你的检索或手输经纬度，详见下方「算法说明」。
                    </p>

                    <details
                      className={`${mono.className} mx-auto mt-4 w-full max-w-md rounded-lg border border-[#D4AF37]/12 bg-black/20 px-3 py-2 text-left text-[11px] leading-relaxed tracking-[0.1em] text-zinc-400`}
                    >
                      <summary className="cursor-pointer select-none text-zinc-400 tracking-[0.14em]">
                        再次查看 · 算法说明
                      </summary>
                      <ul className="mt-2 list-disc space-y-1.5 pl-4">
                        {NATAL_COMPUTATION_DISCLOSURE_ZH.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </details>

                    <motion.button
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        await playClick();
                        try {
                          localStorage.removeItem("user_profile");
                        } catch {
                          // ignore
                        }
                        setPickY("");
                        setPickM("");
                        setPickD("");
                        setBirthTime("12:00");
                        setCoordinates("");
                        setPlaceLabel("");
                        setPlacePrecision(null);
                        setPlaceQuery("");
                        setPlaceResults([]);
                        setBirthCountryCode("");
                        setBirthStateCode("");
                        setBirthTier2Code("");
                        setBirthTier3Code("");
                        setStatesList([]);
                        setTier2List([]);
                        setTier3List([]);
                        setSelectedPlaceCountry(null);
                        setGeocodeEmptyHint(false);
                        setFormError(null);
                        try {
                          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                          setTimeZone(tz || "Asia/Shanghai");
                        } catch {
                          setTimeZone("Asia/Shanghai");
                        }
                        setProfile(null);
                      }}
                      className={`${mono.className} mt-8 rounded-full border border-[#D4AF37]/20 bg-white/0 px-4 py-2 text-[12px] tracking-[0.26em] text-[#D4AF37]/75 hover:text-[#D4AF37]`}
                      style={{
                        boxShadow: "0 0 0 1px rgba(212,175,55,0.05)",
                      }}
                    >
                      重新输入
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 底部微光呼吸线 */}
          <motion.div
            className="mt-10 h-px w-full"
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.52) 50%, rgba(212,175,55,0) 100%)",
            }}
          />
        </div>
      </div>

      {/* 外部悬浮金尘 */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-[34px]"
        animate={{ opacity: [0.22, 0.45, 0.22] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(212,175,55,0.12) 0%, rgba(26,11,61,0.08) 38%, rgba(0,0,0,0) 70%)",
          filter: "blur(10px)",
        }}
      />
    </motion.div>
  );
}

