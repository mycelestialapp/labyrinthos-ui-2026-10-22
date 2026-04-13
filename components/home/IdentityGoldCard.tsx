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
  parseLatLon,
} from "../../lib/natal-chart";
import { computeNatalBig3WithHousesSwiss, type NatalBig3WithHouses } from "@/lib/astro-chart-wheel-swiss";
import { buildNatalReadingGoldCardMarkdown } from "@/lib/natal-reading-full-zh";
import NatalReadingMarkdown from "./NatalReadingMarkdown";
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
import {
  USER_PROFILE_STORAGE_KEY,
  notifyUserProfileChanged,
  parseStoredUserProfileJson,
  type StoredUserProfile,
} from "@/lib/stored-user-profile";
import { mergeAbortSignalWithDeadline } from "@/lib/merge-abort-signal-timeout";

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

type UserProfile = StoredUserProfile;

type GeocodeHit = { label: string; lat: number; lon: number; countryCode?: string };

type CascadeCountry = { code: string; label: string; name: string };
type CascadeStateRow = { code: string; name: string; labelZh?: string };

/** 二、三级行政区（中国：地级市→区县；其他国家：城镇→默认坐标点） */
type BirthTierRow = { code: string; label: string; lat?: string | null; lon?: string | null };
const RELATION_TAG_OPTIONS = ["本人", "家庭", "情人", "朋友", "客户", "领导", "同事", "老师", "同学"] as const;

/** 同源 API 若无限 pending，Chromium 标签页会一直显示加载中 */
const API_PLACES_DEADLINE_MS = 25_000;
const API_GEOCODE_DEADLINE_MS = 25_000;
const API_TZ_DEADLINE_MS = 15_000;

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
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}${scope}`, {
    signal: mergeAbortSignalWithDeadline(undefined, API_GEOCODE_DEADLINE_MS),
  });
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

/** 选「中国 CN」后，在省份列表最底部切入港澳台（数据库里为独立 ISO）。 */
const CN_STATE_GOTO_HK = "__GOTO_HK__";
const CN_STATE_GOTO_MO = "__GOTO_MO__";
const CN_STATE_GOTO_TW = "__GOTO_TW__";

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

export type IdentityGoldCardProps = {
  layoutVariant?: "home" | "embedded";
  onUnlockPersistSuccess?: () => void;
  /** 若开启，则三主星（太阳/月亮/上升）改用 Swiss Ephemeris 口径，确保与占星工作台一致。 */
  useSwissEphemeris?: boolean;
  /** 嵌入场景可强制先显示填写表单，而不是已保存摘要态。 */
  preferFormWhenProfileExists?: boolean;
  /** 存档 key；默认与首页一致，可用于对象B独立档案。 */
  profileStorageKey?: string;
  /** 是否广播全局资料变更事件（首页主档案默认 true）。 */
  notifyProfileChange?: boolean;
};

export default function IdentityGoldCard({
  layoutVariant = "home",
  onUnlockPersistSuccess,
  useSwissEphemeris = true,
  preferFormWhenProfileExists = false,
  profileStorageKey = USER_PROFILE_STORAGE_KEY,
  notifyProfileChange = true,
}: IdentityGoldCardProps = {}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [relationTag, setRelationTag] = useState<(typeof RELATION_TAG_OPTIONS)[number]>("本人");
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
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeResults, setPlaceResults] = useState<GeocodeHit[]>([]);
  const [placeLoading, setPlaceLoading] = useState(false);
  /** 仅检索 cn/tw/hk/mo，减少「青岛」误选日本条目；海外出生可关。（高级搜索用） */
  const [placeScopeZh, setPlaceScopeZh] = useState(true);
  const [geocodeEmptyHint, setGeocodeEmptyHint] = useState(false);
  /** 最近一次从列表点选结果带来的 ISO 国家码，用于与时区交叉提示；手改坐标会清空。 */
  const [selectedPlaceCountry, setSelectedPlaceCountry] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [editing, setEditing] = useState(false);
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
  const restoreBirthCodesRef = useRef<{
    country?: string;
    state?: string;
    tier2?: string;
    tier3?: string;
  } | null>(null);

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
    const raw = window.localStorage.getItem(profileStorageKey);
    const p = parseStoredUserProfileJson(raw);
    if (raw && !p) {
      try {
        window.localStorage.removeItem(profileStorageKey);
        if (notifyProfileChange) notifyUserProfileChanged();
      } catch {
        /* ignore */
      }
    }
    startTransition(() => {
      if (p) {
        setProfile(p);
        setDisplayName(p.displayName ?? "");
        setRelationTag((RELATION_TAG_OPTIONS as readonly string[]).includes(p.relationTag ?? "") ? (p.relationTag as (typeof RELATION_TAG_OPTIONS)[number]) : "本人");
        setEditing(preferFormWhenProfileExists);
        const picks = parseBirthdateToPicks(p.birthdate);
        setPickY(picks.y);
        setPickM(picks.m);
        setPickD(picks.d);
        setBirthTime(p.birthTime);
        setTimeZone(p.timeZone);
        setCoordinates(p.coordinates ?? formatLatLonInput(p.latitude, p.longitude));
        setPlaceLabel(p.placeLabel ?? "");
        setPlacePrecision(parsePlacePrecision(p.placePrecision) ?? null);
        restoreBirthCodesRef.current = {
          country: p.birthCountryCode,
          state: p.birthStateCode,
          tier2: p.birthTier2Code,
          tier3: p.birthTier3Code,
        };
        if (p.birthCountryCode) setBirthCountryCode(p.birthCountryCode);
      } else {
        setEditing(false);
        setDisplayName("");
        setRelationTag("本人");
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz) setTimeZone(tz);
        } catch {
          /* ignore */
        }
      }
      setHydrated(true);
    });
  }, [notifyProfileChange, preferFormWhenProfileExists, profileStorageKey]);

  useEffect(() => {
    // 编辑已保存档案时也需要国家列表，避免出现“暂无国家列表”。
    if (!hydrated || countriesList.length > 0) return;
    const ac = new AbortController();
    setCascadeLoading("countries");
    void fetch("/api/places/countries", {
      signal: mergeAbortSignalWithDeadline(ac.signal, API_PLACES_DEADLINE_MS),
    })
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
  }, [hydrated, countriesList.length]);

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
      signal: mergeAbortSignalWithDeadline(ac.signal, API_PLACES_DEADLINE_MS),
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
              { signal: mergeAbortSignalWithDeadline(ac.signal, API_PLACES_DEADLINE_MS) },
            );
            const t2d = (await t2.json()) as { tier2?: BirthTierRow[] };
            if (!ac.signal.aborted) setTier2List(Array.isArray(t2d.tier2) ? t2d.tier2 : []);
          } catch {
            if (!ac.signal.aborted) setTier2List([]);
          }
        } else {
          setTier2List([]);
          const pending = restoreBirthCodesRef.current;
          if (pending?.state && st.some((x) => x.code === pending.state)) {
            setBirthStateCode(pending.state);
          }
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
      { signal: mergeAbortSignalWithDeadline(ac.signal, API_PLACES_DEADLINE_MS) },
    )
      .then((r) => r.json())
      .then((d: { tier2?: BirthTierRow[] }) => {
        if (!ac.signal.aborted) {
          const list = Array.isArray(d.tier2) ? d.tier2 : [];
          setTier2List(list);
          setBirthTier2Code("");
          setBirthTier3Code("");
          setTier3List([]);
          const pending = restoreBirthCodesRef.current;
          if (pending?.tier2 && list.some((x) => x.code === pending.tier2)) {
            setBirthTier2Code(pending.tier2);
          }
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
        `/api/timezone-from-latlon?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}&country=${encodeURIComponent(countryIso)}`,
        { signal: mergeAbortSignalWithDeadline(undefined, API_TZ_DEADLINE_MS) },
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
      { signal: mergeAbortSignalWithDeadline(ac.signal, API_PLACES_DEADLINE_MS) },
    )
      .then((r) => r.json())
      .then((d: { tier3?: BirthTierRow[] }) => {
        if (ac.signal.aborted) return;
        const list = Array.isArray(d.tier3) ? d.tier3 : [];
        setTier3List(list);
        setBirthTier3Code("");
        const pending = restoreBirthCodesRef.current;
        if (pending?.tier3 && list.some((x) => x.code === pending.tier3)) {
          setBirthTier3Code(pending.tier3);
          const row = list.find((x) => x.code === pending.tier3);
          if (row) void applyTier3Latest.current(row);
        }
        if (birthCountryCode !== "CN" && list.length === 1 && list[0]) {
          setBirthTier3Code(list[0].code);
          void applyTier3Latest.current(list[0]);
        }
        restoreBirthCodesRef.current = null;
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
            signal: mergeAbortSignalWithDeadline(ac.signal, API_GEOCODE_DEADLINE_MS),
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

  const locked = !profile || editing;

  const [big3, setBig3] = useState<NatalBig3 | null>(null);
  const [natalHouses, setNatalHouses] = useState<Pick<NatalBig3WithHouses, "sunHouse" | "moonHouse"> | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!profile) {
        if (!cancelled) {
          setBig3(null);
          setNatalHouses(null);
        }
        return;
      }

      const utc = birthMomentToUtc(profile.birthdate, profile.birthTime, profile.timeZone);
      if (!utc) {
        if (!cancelled) {
          setBig3(null);
          setNatalHouses(null);
        }
        return;
      }

      if (useSwissEphemeris) {
        const next = await computeNatalBig3WithHousesSwiss(utc, profile.latitude, profile.longitude);
        if (!cancelled) {
          setBig3({ sun: next.sun, moon: next.moon, rising: next.rising });
          setNatalHouses({ sunHouse: next.sunHouse, moonHouse: next.moonHouse });
        }
        return;
      }

      const next = computeNatalBig3(utc, profile.latitude, profile.longitude);
      if (!cancelled) {
        setBig3(next);
        setNatalHouses(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profile, useSwissEphemeris]);

  const goldCardReadingMd = useMemo(() => {
    if (!big3) return "";
    return buildNatalReadingGoldCardMarkdown(big3, {
      sunHouse: natalHouses?.sunHouse,
      moonHouse: natalHouses?.moonHouse,
    });
  }, [big3, natalHouses]);

  const timeZoneOptions = useMemo(() => {
    const set = new Set(BIRTH_TIMEZONE_PRESETS);
    if (timeZone && !set.has(timeZone)) {
      return [timeZone, ...BIRTH_TIMEZONE_PRESETS];
    }
    return [...BIRTH_TIMEZONE_PRESETS];
  }, [timeZone]);

  const pickBirthCountry = (code: string) => {
    triggerEnergyPulse();
    setBirthCountryCode(code);
    setBirthStateCode("");
    setBirthTier2Code("");
    setBirthTier3Code("");
    setCoordinates("");
    setPlaceLabel("");
    setPlacePrecision(null);
    setSelectedPlaceCountry(null);
    setFormError(null);
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
  /** 分段选日期/时间：固定栏宽 + 箭头，避免 flex-1 拉成一条「空屏」 */
  const birthPickerRowClass =
    "inline-flex min-h-11 max-w-max flex-nowrap items-stretch overflow-hidden rounded-lg border border-[#D4AF37]/38 bg-[#14101f]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] divide-x divide-[#d4af37]/25";
  /** 出生地国家与三级级联：与日期栏同系金边分栏，极窄屏横向滑动 */
  const birthCascadeBarClass =
    "inline-flex max-w-full min-w-0 flex-nowrap items-stretch gap-2 overflow-x-auto rounded-lg border border-[#D4AF37]/38 bg-[#14101f]/92 px-1.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]";
  const birthCascadeColClass =
    "relative flex min-w-[10.25rem] max-w-[min(100vw-2.5rem,12rem)] shrink-0 flex-col gap-1 px-2 py-2";
  const birthCascadeLabelClass = `${mono.className} flex h-10 items-end text-[13px] leading-tight tracking-[0.04em] text-zinc-100`;
  const birthCascadeSelectClass = `${mono.className} birth-cascade-select box-border h-11 min-h-11 shrink-0 cursor-pointer appearance-none border-0 bg-transparent py-0 pl-2 text-[15px] font-medium leading-11 tabular-nums text-zinc-100 outline-none [color-scheme:dark] [font-synthesis:none] text-center`;

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
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="space-y-2">
                          <p className={`${mono.className} text-[13px] tracking-[0.16em] text-zinc-200`}>存储姓名</p>
                          <input
                            value={displayName}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (v !== displayName) triggerEnergyPulse();
                              setDisplayName(v);
                            }}
                            placeholder="例如：小赵 / A（仅用于存档）"
                            className={`${mono.className} w-full bg-transparent px-1 pb-3 pt-2 text-[15px] tracking-[0.08em] text-zinc-100 outline-none placeholder:text-zinc-400`}
                            style={selectLikeStyle}
                          />
                        </label>
                        <label className="space-y-2">
                          <p className={`${mono.className} text-[13px] tracking-[0.16em] text-zinc-200`}>存储关系</p>
                          <div
                            className="w-full overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            style={selectLikeStyle}
                          >
                            <div className="inline-flex min-w-max flex-nowrap items-center gap-1.5 py-2">
                              {RELATION_TAG_OPTIONS.map((x) => (
                                <button
                                  key={x}
                                  type="button"
                                  onClick={() => {
                                    triggerEnergyPulse();
                                    setRelationTag(x);
                                  }}
                                  className={`shrink-0 rounded-full border px-3.5 py-2 text-[14px] font-medium tracking-[0.06em] transition-colors ${
                                    relationTag === x
                                      ? "border-[#D4AF37]/65 bg-[#D4AF37]/14 text-[#F5D178]"
                                      : "border-[#D4AF37]/30 text-zinc-200 hover:border-[#D4AF37]/50 hover:text-zinc-100"
                                  }`}
                                >
                                  {x}
                                </button>
                              ))}
                            </div>
                          </div>
                        </label>
                      </div>
                      <p className={`${mono.className} text-[13px] tracking-[0.14em] text-zinc-200`}>
                        ① 出生日期与时间
                      </p>
                    <div className="space-y-2">
                      <p className={`${mono.className} text-[12px] tracking-[0.12em] text-zinc-300`}>
                        公历日期 · 出生时刻（二十四小时制）
                      </p>
                      <div className="flex w-full flex-wrap items-end justify-between gap-3 pb-0.5">
                        <div className="flex min-w-0 flex-1 justify-center overflow-x-auto [-webkit-overflow-scrolling:touch] sm:justify-start">
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
                            className={`${birthCascadeSelectClass} w-[5.2rem] sm:w-24 text-[14px]`}
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
                            className={`${birthCascadeSelectClass} w-[4.1rem] sm:w-[5rem] text-[14px]`}
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
                            className={`${birthCascadeSelectClass} w-[4.1rem] sm:w-[5rem] text-[14px]`}
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
                            className={`${birthCascadeSelectClass} w-[4.1rem] sm:w-[5.25rem] text-[14px]`}
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
                            className={`${birthCascadeSelectClass} w-[4.1rem] sm:w-[5.25rem] text-[14px]`}
                          >
                            {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                              <option key={m} value={String(m)}>
                                {pad2(m)}分
                              </option>
                            ))}
                          </select>
                        </div>
                        </div>
                        <div className="flex shrink-0 justify-center sm:justify-end">
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
                          displayName: displayName.trim() || undefined,
                          relationTag,
                          birthdate: birthdate.trim(),
                          birthTime: birthTime.trim(),
                          timeZone,
                          latitude: ll.lat,
                          longitude: ll.lon,
                          coordinates: coordinates.trim(),
                          placeLabel: placeLabel.trim() || undefined,
                          placePrecision: placePrecision ?? undefined,
                          birthCountryCode: birthCountryCode || undefined,
                          birthStateCode: birthStateCode || undefined,
                          birthTier2Code: birthTier2Code || undefined,
                          birthTier3Code: birthTier3Code || undefined,
                        };

                        try {
                          localStorage.setItem(profileStorageKey, JSON.stringify(next));
                          if (notifyProfileChange) notifyUserProfileChanged();
                        } catch {
                          // ignore
                        }

                        window.setTimeout(() => {
                          setProfile(next);
                          setEditing(false);
                          setUnlocking(false);
                          onUnlockPersistSuccess?.();
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
                    </div>

                    <div className="space-y-3">
                      <div className={`${mono.className} w-full min-w-0 space-y-2`}>
                        <p className={`${mono.className} text-[14px] tracking-[0.06em] text-zinc-100`}>
                          出生地逐级选择（国家 → 省/州 → 城镇；下拉选，手机为滚轮）
                        </p>
                        {cascadeLoading === "countries" && countriesList.length === 0 ? (
                          <p className={`${mono.className} text-[11px] text-zinc-500`}>
                            正在同步国家列表…
                          </p>
                        ) : null}
                        <div
                          className={birthCascadeBarClass}
                          title="地点逐级选择；极窄屏可横向滑动；国家与省州为下拉滚轮"
                        >
                          <div className={birthCascadeColClass}>
                            <label className={birthCascadeLabelClass}>
                              出生国家
                            </label>
                            <div className="relative">
                              {countriesList.length === 0 && cascadeLoading === "countries" ? (
                                <div
                                  className={`${mergeBarShellClass} flex min-h-11 items-center px-2 text-[14px] text-zinc-100`}
                                  style={selectLikeStyle}
                                >
                                  加载国家列表…
                                </div>
                              ) : countriesList.length === 0 ? (
                                <div
                                  className={`${mergeBarShellClass} flex min-h-11 items-center px-2 text-[14px] text-zinc-100`}
                                  style={selectLikeStyle}
                                >
                                  暂无国家列表，请稍后重试
                                </div>
                              ) : (
                                <>
                                  <select
                                    aria-label="出生国家"
                                    value={birthCountryCode}
                                    onChange={(e) => pickBirthCountry(e.target.value)}
                                    onFocus={() => setFocused("birthCountry")}
                                    onBlur={() => setFocused(null)}
                                    className={`${selectLikeClass} text-[14px]`}
                                    style={selectLikeStyle}
                                  >
                                    <option value="">请选择国家</option>
                                    {countriesList.map((c) => (
                                      <option key={c.code} value={c.code}>
                                        {c.label}
                                      </option>
                                    ))}
                                  </select>
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
                                    animate={{ scaleX: focused === "birthCountry" ? 1 : 0 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                  />
                                </>
                              )}
                            </div>
                          </div>

                            <div className={birthCascadeColClass}>
                              {!birthCountryCode ? (
                                <>
                                  <label className={birthCascadeLabelClass}>
                                    {birthplaceTier1Label("")}
                                  </label>
                                  <div className="relative">
                                    <select
                                      aria-label="省、州或一级区划（需先选国家）"
                                      disabled
                                      value=""
                                    className={`${selectLikeClass} cursor-not-allowed opacity-50 text-[14px]`}
                                      style={selectLikeStyle}
                                    >
                                      <option value="">请先选择国家</option>
                                    </select>
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
                                      animate={{ scaleX: 0 }}
                                      transition={{ duration: 0.35, ease: "easeOut" }}
                                    />
                                  </div>
                                </>
                              ) : statesList.length > 0 ? (
                                <>
                                  <label className={birthCascadeLabelClass}>
                                    {birthplaceTier1Label(birthCountryCode)}
                                  </label>
                                  <div className="relative">
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
                                          className={`${selectLikeClass} text-[14px]`}
                                          style={selectLikeStyle}
                                        >
                                          <option value="">请选择</option>
                                          {statesList.map((s) => (
                                            <option key={s.code} value={s.code}>
                                              {s.labelZh ?? s.name}
                                            </option>
                                          ))}
                                          {birthCountryCode === "CN" ? (
                                            <optgroup label="港澳台">
                                              <option value={CN_STATE_GOTO_HK}>香港特别行政区</option>
                                              <option value={CN_STATE_GOTO_MO}>澳门特别行政区</option>
                                              <option value={CN_STATE_GOTO_TW}>台湾</option>
                                            </optgroup>
                                          ) : null}
                                        </select>
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
                                  className={`${mono.className} block text-[11px] leading-tight tracking-[0.06em] text-zinc-300`}
                                  >
                                    {birthplaceTier1Label(birthCountryCode)}
                                  </label>
                                  <div
                                    className={`${mergeBarShellClass} flex min-h-11 items-center px-2 text-[14px] text-zinc-100`}
                                    style={selectLikeStyle}
                                  >
                                    加载一级…
                                  </div>
                                </>
                              ) : (
                                <>
                                  <label className={birthCascadeLabelClass}>
                                    {birthplaceTier1Label(birthCountryCode)}
                                  </label>
                                  <select
                                    aria-label={`${birthplaceTier1Label(birthCountryCode)}（该国无下级列表）`}
                                    disabled
                                    value="__NONE__"
                                    className={`${selectLikeClass} opacity-60 text-[14px]`}
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
                              <label className={birthCascadeLabelClass}>
                                {birthplaceTier2Label(birthCountryCode || "")}
                              </label>
                              <div className="relative">
                                <select
                                  aria-label={birthplaceTier2Label(birthCountryCode || "")}
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
                                  className={`${selectLikeClass} text-[14px]`}
                                  style={selectLikeStyle}
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
                                  {tier2List.map((t) => (
                                    <option key={t.code} value={t.code}>
                                      {t.label}
                                    </option>
                                  ))}
                                </select>
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
                              <label className={birthCascadeLabelClass}>
                                {birthplaceTier3Label(birthCountryCode || "")}
                              </label>
                              <div className="relative">
                                    <select
                                      aria-label={birthplaceTier3Label(birthCountryCode || "")}
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
                                      className={`${selectLikeClass} text-[14px]`}
                                      style={selectLikeStyle}
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
                                      {tier3List.map((t) => (
                                        <option key={t.code} value={t.code}>
                                          {t.label}
                                        </option>
                                      ))}
                                    </select>
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
                          </div>

                          {birthCountryCode && showTier2EmptyHelp ? (
                        <p className={`${mono.className} text-[12px] leading-relaxed tracking-[0.08em] text-amber-200/85`}>
                              当前上一级组合下没有可选第二级。请改选州/省，或用地名搜索、手输经纬度完成定位。
                            </p>
                          ) : null}
                          {birthCountryCode && showTier3EmptyHelp ? (
                        <p className={`${mono.className} text-[12px] leading-relaxed tracking-[0.08em] text-amber-200/85`}>
                              当前没有第三级可选项（多为库内缺数据）。请改选县/城镇，或用地名搜索、手输经纬度。
                            </p>
                          ) : null}
                      </div>
                    </div>

                      <details className={`${mono.className} mt-2 rounded-lg border border-[#D4AF37]/10 bg-black/15 px-3 py-2.5 text-left text-[13px] text-zinc-300`}>
                        <summary className="cursor-pointer select-none tracking-[0.12em] text-zinc-400 hover:text-zinc-300">
                          列表里找不到？用搜索框
                        </summary>
                        <div className="mt-3 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-zinc-500">范围</span>
                            <div
                              className={`${mono.className} inline-flex rounded-full border border-[#D4AF37]/25 p-0.5 text-[13px] tracking-[0.08em]`}
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
                              <p className={`${mono.className} mt-2 text-[13px] text-zinc-200`}>正在搜索…</p>
                            ) : null}
                            {placeResults.length > 0 ? (
                              <ul
                                className={`${mono.className} mt-2 max-h-48 overflow-y-auto rounded-lg border border-[#D4AF37]/20 bg-[#1a1528]/95 py-1 text-left text-[14px] leading-snug text-zinc-100`}
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
                              <p className={`${mono.className} mt-2 text-[13px] text-amber-200/95`}>
                                当前范围内无结果，可切「全球」再试。
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </details>

                    {placeLabel || resolvedLatLon ? (
                      <div
                        className={`${mono.className} rounded-lg border border-[#D4AF37]/20 bg-[#1a1528]/60 px-3 py-3 text-[14px] leading-relaxed tracking-[0.05em] text-[#F5D178]`}
                      >
                        {placeLabel ? (
                          <div>
                            <span className="text-zinc-500">已选 </span>
                            {placeLabel}
                          </div>
                        ) : null}
                        <p
                          className={`${mono.className} ${placeLabel ? "mt-1.5" : ""} text-[13px] leading-relaxed tracking-[0.04em] text-zinc-200`}
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
                          className={`${mono.className} mt-1.5 text-[13px] leading-relaxed tracking-[0.04em] text-zinc-200`}
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
                        className={`${mono.className} text-[13px] leading-relaxed tracking-[0.05em] text-amber-200`}
                      >
                        {tzPlaceHint}
                      </p>
                    ) : null}

                    <details className={`${mono.className} rounded-lg border border-[#D4AF37]/10 bg-black/15 px-3 py-2.5 text-left text-[13px] text-zinc-200`}>
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
                      <label className={`${mono.className} mb-1 mt-4 block text-[13px] text-zinc-200`}>
                        IANA 时区（默认随经纬度更新；边境/历史夏令时争议时可手选）
                      </label>
                      <select
                        value={timeZone}
                        onChange={(e) => {
                          triggerEnergyPulse();
                          setTimeZone(e.target.value);
                          setFormError(null);
                        }}
                        className={`${mono.className} w-full cursor-pointer appearance-none rounded-md border border-[#D4AF37]/20 bg-[#1a1528]/90 px-2 py-2.5 text-[14px] tracking-[0.06em] text-zinc-100 outline-none [color-scheme:dark]`}
                      >
                        {timeZoneOptions.map((tz) => (
                          <option key={tz} value={tz}>
                            {birthTimeZoneLabelZh(tz)}
                          </option>
                        ))}
                      </select>
                    </details>

                    </div>

                    {formError ? (
                      <p
                        className={`${mono.className} text-center text-[12px] tracking-[0.2em] text-rose-300/90`}
                      >
                        {formError}
                      </p>
                    ) : null}

                    <details
                      className={`${mono.className} rounded-lg border border-[#D4AF37]/15 bg-black/25 px-3 py-3 text-left text-[13px] leading-relaxed tracking-[0.06em] text-zinc-200`}
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
                      className={`${playfair.className} mt-6 w-full max-w-lg mx-auto px-1 text-zinc-100`}
                      initial={{ opacity: 0, y: 14, filter: "blur(14px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.25, duration: 0.65, ease: "easeOut" }}
                    >
                      {layoutVariant === "embedded" ? (
                        <p
                          className={`${mono.className} mx-auto max-w-md text-center text-[11px] leading-relaxed tracking-[0.1em] text-zinc-400`}
                        >
                          星历页右侧：<strong className="text-zinc-200">档案与今日 → 通俗读盘（短卡）→ 工作台</strong>
                          （事实/推论/便签/ChartFact）；与首页长文不同。此处仅确认档案已保存。
                        </p>
                      ) : goldCardReadingMd ? (
                        <NatalReadingMarkdown source={goldCardReadingMd} />
                      ) : null}
                    </motion.div>

                    <p
                      className={`${mono.className} mx-auto mt-3 max-w-md text-center text-[11px] leading-relaxed tracking-[0.12em] text-zinc-500`}
                    >
                      {layoutVariant === "embedded"
                        ? "演算口径与首页一致；技术说明仍可在下方「算法说明」查看。"
                        : "三主星按热带黄道与公示口径推算；出生地坐标来自你的检索或手输经纬度，详见下方「算法说明」。"}
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
                          localStorage.removeItem(profileStorageKey);
                          if (notifyProfileChange) notifyUserProfileChanged();
                        } catch {
                          // ignore
                        }
                        setPickY("");
                        setPickM("");
                        setPickD("");
                        setDisplayName("");
                        setRelationTag("本人");
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
                        onUnlockPersistSuccess?.();
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

