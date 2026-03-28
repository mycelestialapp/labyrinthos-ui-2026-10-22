"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { JetBrains_Mono, Noto_Serif_SC } from "next/font/google";
import { ChevronDown, ChevronLeft } from "lucide-react";
import AstroChartStage from "./AstroChartStage";
import ChartWheelPlaceholder from "./ChartWheelPlaceholder";
import AstroChartReadout from "./AstroChartReadout";
import HomeIdentityGoldBlock from "@/components/home/HomeIdentityGoldBlock";
import { InkRevealBlock, MatteTerm } from "./InkReveal";
import {
  createEmptyDossier,
  getActiveDossier,
  loadAstroDossierStore,
  saveAstroDossierStore,
  type AstroDossierStore,
  type AstroDossier,
  type AstroLens,
  type AstroTopic,
  type HouseSystemId,
} from "@/lib/astro-dossier-storage";
import { ZODIAC_CN, type NatalBig3, birthMomentToUtc } from "@/lib/natal-chart";
import { buildDailyCalibration, getTodayKey } from "@/lib/daily-axiom";
import {
  USER_PROFILE_CHANGED_EVENT,
  USER_PROFILE_STORAGE_KEY,
  parseStoredUserProfileJson,
  type StoredUserProfile,
} from "@/lib/stored-user-profile";
import NatalReadingMarkdown from "@/components/home/NatalReadingMarkdown";
import {
  buildAstroWorkspaceUnderstandMarkdown,
  buildNatalReadingCompactMarkdown,
  buildNatalReadingFullMarkdown,
} from "@/lib/natal-reading-full-zh";
import {
  type ChartKindId,
  type SecondaryYearBasisId,
  type TertiaryMonthBasisId,
  computeWorkspaceChartWheel,
} from "@/lib/astro-chart-kinds";
import {
  computeAstroChartWheelDataSwiss,
  computeNatalBig3Swiss,
  computePlanetsLongitudesSwiss,
  refineSolarReturnInstantSwiss,
  refineLunarReturnInstantSwiss,
} from "@/lib/astro-chart-wheel-swiss";
import {
  computeTransitNatalMajorAspects,
  formatLongitudeInSignZh,
  houseNumberForLongitude,
  type PlanetId,
} from "@/lib/astro-chart-wheel";
import { appendOriginsRelationshipRecord } from "@/lib/origins-relationships-storage";
import {
  ASPECT_PRESET_OPTIONS,
  ASTRO_MAINSTREAM_SETTINGS_STORAGE_KEY,
  DEFAULT_ASTRO_MAINSTREAM_SETTINGS,
  ORB_PRESET_OPTIONS,
  SECONDARY_YEAR_BASIS_OPTIONS,
  TERTIARY_MONTH_BASIS_OPTIONS,
  parseAstroMainstreamSettingsJson,
} from "@/lib/astro-mainstream-settings";
import { ASTRO_BENCHMARK_PACK_VERSION } from "@/lib/astro-benchmark-samples";

const serif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  // @ts-expect-error subset
  subsets: ["latin", "chinese-simplified"],
  display: "swap",
});

const chartMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const BG = "#0A0A1F";
const HUB_USER_ID_KEY = "labyrinthos-user-id";
const PARTNER_PROFILE_STORAGE_KEY = "labyrinthos-partner-profile-v1";
const PARTNER_RELATION_DRAFT_KEY = "labyrinthos-partner-relation-draft-v1";

const TOPIC_OPTIONS: { id: AstroTopic; label: string }[] = [
  { id: "love", label: "感情窗口" },
  { id: "career", label: "职业节点" },
  { id: "self", label: "自我认识" },
];

const LENS_OPTIONS: { id: AstroLens; label: string }[] = [
  { id: "time_lord", label: "时间主星" },
  { id: "lunar_cycle", label: "月亮周期" },
];

function Big3Narrative({ big3 }: { big3: NatalBig3 | null }) {
  if (!big3) return null;
  return (
    <p className="text-[13px] leading-[2.35] text-zinc-400/95">
      <MatteTerm>太阳</MatteTerm>
      <span className="text-zinc-500">在</span>
      <MatteTerm>{ZODIAC_CN[big3.sun]}</MatteTerm>
      <span className="mx-2 text-zinc-700">·</span>
      <MatteTerm>月亮</MatteTerm>
      <span className="text-zinc-500">在</span>
      <MatteTerm>{ZODIAC_CN[big3.moon]}</MatteTerm>
      <span className="mx-2 text-zinc-700">·</span>
      <MatteTerm>上升</MatteTerm>
      <span className="text-zinc-500">在</span>
      <MatteTerm>{ZODIAC_CN[big3.rising]}</MatteTerm>
    </p>
  );
}

function updateActiveDossier(store: AstroDossierStore, patch: Partial<AstroDossier>): AstroDossierStore {
  const active = getActiveDossier(store);
  const now = Date.now();
  return {
    ...store,
    dossiers: store.dossiers.map((d) => (d.id === active.id ? { ...d, ...patch, updatedAt: now } : d)),
  };
}

function InsightBlock({
  k,
  title,
  tone,
  children,
  inkDelay = 0,
}: {
  k: string;
  title: string;
  tone: "cyan" | "gold" | "muted";
  children: React.ReactNode;
  inkDelay?: number;
}) {
  const head =
    tone === "cyan" ? "text-[#5F8794]" : tone === "gold" ? "text-[#B8944A]" : "text-zinc-500";
  return (
    <InkRevealBlock delay={inkDelay} className="relative pt-4">
      <div
        className="absolute left-0 right-0 top-0 h-px opacity-80"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.4) 40%, rgba(15,158,184,0.22) 62%, transparent 100%)",
        }}
      />
      <p className={`text-[10px] ${head}`} style={{ letterSpacing: "0.3em" }}>
        {k} {title}
      </p>
      <div className="mt-2.5 text-[11px] leading-[2.05] text-zinc-400/93">{children}</div>
    </InkRevealBlock>
  );
}

function BCard({
  title,
  subtitle,
  children,
  className = "",
  headerMono = false,
  deboxed = false,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  /** 标题/副标题使用 JetBrains Mono + 宽字距（轮盘区） */
  headerMono?: boolean;
  /** 去框化：仅保留细分割线与轻标题 */
  deboxed?: boolean;
}) {
  const mono = headerMono ? chartMono.className : "";
  return (
    <section
      className={
        deboxed
          ? `w-full min-w-0 border-t border-[#C5A059]/10 pt-4 sm:pt-5 ${className}`
          : `w-full min-w-0 rounded-2xl border border-white/[0.08] bg-[#0b0b22]/90 p-4 shadow-[0_12px_48px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:p-5 ${className}`
      }
    >
      {(title || subtitle) && (
        <header className={`mb-4 min-w-0 ${mono}`}>
          {title ? (
            <h2
              className={
                headerMono
                  ? UI_SCALE.cardTitleMono
                  : deboxed
                    ? UI_SCALE.cardTitleDeboxed
                    : UI_SCALE.cardTitleDefault
              }
            >
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p
              className={
                headerMono
                  ? UI_SCALE.cardSubtitleMono
                  : deboxed
                    ? UI_SCALE.cardSubtitle
                    : UI_SCALE.cardSubtitle
              }
            >
              {subtitle}
            </p>
          ) : null}
        </header>
      )}
      <div className="min-w-0">{children}</div>
    </section>
  );
}

const CHART_KIND_OPTIONS: { id: ChartKindId; label: string }[] = [
  { id: "natal", label: "出生盘" },
  { id: "synastry", label: "合盘" },
  { id: "transit", label: "行运盘" },
  { id: "ephemeris", label: "时刻盘" },
  { id: "secondary", label: "次限推运" },
  { id: "tertiary", label: "三限推运" },
  { id: "solar_return", label: "日返盘" },
  { id: "lunar_return", label: "月返盘" },
];

const SECONDARY_BASIS_OPTIONS: { id: SecondaryYearBasisId; label: string }[] = [
  { id: "tropical", label: "热带年 365.24219（主流）" },
  { id: "julian", label: "儒略年 365.25" },
];

const TERTIARY_BASIS_OPTIONS: { id: TertiaryMonthBasisId; label: string }[] = [
  { id: "synodic", label: "朔望月 29.53（主流）" },
  { id: "sidereal", label: "恒星月 27.32" },
];

type CoreZoneId = "origin" | "reality" | "decoding";

const CORE_ZONES: {
  id: CoreZoneId;
  title: string;
  copy: string;
  anchorId: string;
}[] = [
  {
    id: "origin",
    title: "初始参数",
    copy: "填写出生信息与排盘规则",
    anchorId: "section-chart-birth",
  },
  {
    id: "reality",
    title: "实相观测",
    copy: "查看当前星盘与实时数据",
    anchorId: "section-chart-wheel",
  },
  {
    id: "decoding",
    title: "灵识解构",
    copy: "阅读解释与趋势建议",
    anchorId: "read-section-text",
  },
];

const HOUSE_SYSTEM_OPTIONS: { id: HouseSystemId; label: string }[] = [
  { id: "Placidus", label: "普拉西德" },
  { id: "Whole Sign", label: "整宫制" },
];

function houseSystemLabelZh(v: string): string {
  if (v === "Placidus") return "普拉西德";
  if (v === "Whole Sign") return "整宫制";
  return v;
}

type ReadingDepthId = "short" | "compact" | "full";

const READING_DEPTH_OPTIONS: { id: ReadingDepthId; label: string; subtitle: string }[] = [
  { id: "short", label: "短卡", subtitle: "应用式大白话，最快浏览" },
  { id: "compact", label: "精简", subtitle: "约为全文 1/3，结构与金卡相近" },
  { id: "full", label: "全文", subtitle: "完整导师版长读" },
];

const UI_SCALE = {
  pageTitle: "text-4xl sm:text-5xl",
  pageSub: "text-[15px] text-zinc-400",
  zoneTitle: "text-[15px] sm:text-[16px] tracking-[0.16em] font-medium text-zinc-300",
  zoneCopy: "text-[13px] sm:text-[14px] tracking-[0.1em] text-zinc-400",
  zoneHint: "text-[13px] font-medium text-zinc-400",
  panelToggle: "px-3 py-2 text-[13px] font-medium text-[#D4C48A]",
  chartChip: "px-4 py-2.5 text-[14px] sm:text-[15px] tracking-[0.08em] font-medium",
  chartChipLabel: "text-[13px] sm:text-[14px] tracking-[0.04em]",
  optionPill: "px-4 py-2.5 text-[15px] font-medium tracking-[0.06em]",
  cardTitleMono: "text-[15px] font-medium leading-snug tracking-[0.24em] text-zinc-300",
  cardTitleDeboxed: "text-[16px] font-semibold leading-snug tracking-[0.16em] text-[#D4C48A]",
  cardTitleDefault: "text-[17px] font-semibold leading-snug text-zinc-300",
  cardSubtitleMono: "mt-2 text-[13px] leading-relaxed tracking-[0.18em] text-zinc-400",
  cardSubtitle: "mt-1 text-[16px] leading-relaxed text-zinc-400",
} as const;

function OptionPills<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly { id: T; label: string }[];
  ariaLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`border border-white/[0.2] bg-transparent ${UI_SCALE.optionPill} transition-all ${
            value === o.id
              ? "border-[#C5A059]/75 text-[#D4C48A] shadow-[0_0_14px_rgba(197,160,89,0.34)]"
              : "text-zinc-400 hover:border-[#C5A059]/45 hover:text-zinc-300"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function AstroWorkspace() {
  const [store, setStore] = useState<AstroDossierStore | null>(null);
  const [big3, setBig3] = useState<NatalBig3 | null>(null);

  const [birthPanelOpen, setBirthPanelOpen] = useState(true);
  const [showAspectLines, setShowAspectLines] = useState(true);
  const [showOuterBodies, setShowOuterBodies] = useState(false);
  const [showAllBodies, setShowAllBodies] = useState(false);
  const [showChartRadials, setShowChartRadials] = useState(true);
  const [chartFactOpen, setChartFactOpen] = useState(false);
  const [readingDepth, setReadingDepth] = useState<ReadingDepthId>("short");
  const [chartInstantRefreshKey, setChartInstantRefreshKey] = useState(0);
  const [chartKind, setChartKind] = useState<ChartKindId>("natal");
  const [solarReturnYear, setSolarReturnYear] = useState(() => new Date().getFullYear());
  const [activeZone, setActiveZone] = useState<CoreZoneId>("reality");
  const [originPulseKey, setOriginPulseKey] = useState(0);
  const [zoneFxKey, setZoneFxKey] = useState(0);
  const [coordCeremonyKey, setCoordCeremonyKey] = useState(0);
  const [coordStatus, setCoordStatus] = useState<string>("初始参数已锁定，可直接查看星盘。");
  const [houseSystemPulseKey, setHouseSystemPulseKey] = useState(0);
  const [simpleMode, setSimpleMode] = useState(true);
  const [mainstreamSettings, setMainstreamSettings] = useState(DEFAULT_ASTRO_MAINSTREAM_SETTINGS);
  const [partnerProfile, setPartnerProfile] = useState<StoredUserProfile | null>(null);
  const [relationName, setRelationName] = useState("");
  const [selfName, setSelfName] = useState("");
  const [partnerName, setPartnerName] = useState("");

  const [tick, setTick] = useState(0);

  const refreshProfile = useCallback(() => {
    setBig3(null); // 先置空，避免短时间展示 astronomy-engine 口径的三主星
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => {
      setStore(loadAstroDossierStore());
      setBig3(null);
      const rawPartner = window.localStorage.getItem(PARTNER_PROFILE_STORAGE_KEY);
      const parsedPartner = parseStoredUserProfileJson(rawPartner);
      setPartnerProfile(parsedPartner);
      const rawRelation = window.localStorage.getItem(PARTNER_RELATION_DRAFT_KEY);
      if (rawRelation) {
        try {
          const rel = JSON.parse(rawRelation) as { relationName?: string; selfName?: string; partnerName?: string };
          setRelationName(rel.relationName ?? "");
          setSelfName(rel.selfName ?? "");
          setPartnerName(rel.partnerName ?? "");
        } catch {
          /* ignore */
        }
      }
      const rawMainstream = window.localStorage.getItem(ASTRO_MAINSTREAM_SETTINGS_STORAGE_KEY);
      setMainstreamSettings(parseAstroMainstreamSettingsJson(rawMainstream));
    });
  }, []);

  useLayoutEffect(() => {
    void Promise.resolve().then(() => {
      const raw = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      const p = parseStoredUserProfileJson(raw);
      setBirthPanelOpen(!p);
    });
  }, []);

  useEffect(() => {
    const on = () => refreshProfile();
    window.addEventListener(USER_PROFILE_CHANGED_EVENT, on);
    return () => window.removeEventListener(USER_PROFILE_CHANGED_EVENT, on);
  }, [refreshProfile]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      PARTNER_RELATION_DRAFT_KEY,
      JSON.stringify({ relationName, selfName, partnerName }),
    );
  }, [relationName, selfName, partnerName]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ASTRO_MAINSTREAM_SETTINGS_STORAGE_KEY, JSON.stringify(mainstreamSettings));
  }, [mainstreamSettings]);

  const dossier: AstroDossier | null = store ? getActiveDossier(store) : null;

  const profileRow = useMemo(
    () => {
      if (typeof window === "undefined") return null;
      return parseStoredUserProfileJson(window.localStorage.getItem(USER_PROFILE_STORAGE_KEY));
    },
    // tick：档案变更事件里递增，强制重读 localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick],
  );

  // 三主星（太阳/月亮/上升）：使用 Swiss Ephemeris 口径，确保与“星盘数据表”一致。
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!profileRow?.birthdate || !profileRow?.birthTime || !profileRow?.timeZone) return;
      const utc = birthMomentToUtc(profileRow.birthdate, profileRow.birthTime, profileRow.timeZone);
      if (!utc) return;
      const next = await computeNatalBig3Swiss(utc, profileRow.latitude, profileRow.longitude);
      if (!cancelled) setBig3(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [profileRow?.birthdate, profileRow?.birthTime, profileRow?.timeZone, profileRow?.latitude, profileRow?.longitude]);

  const birthYmd = useMemo(() => {
    if (!profileRow?.birthdate) return null;
    const m = profileRow.birthdate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    return { y: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
  }, [profileRow?.birthdate]);

  const solarYearOptions = useMemo(() => {
    if (!birthYmd) return [];
    const end = birthYmd.y + 120;
    const out: number[] = [];
    for (let y = birthYmd.y; y <= end; y++) out.push(y);
    return out;
  }, [birthYmd]);

  useEffect(() => {
    if (!birthYmd) return;
    const cy = new Date().getFullYear();
    void Promise.resolve().then(() => {
      setSolarReturnYear((prev) => {
        if (prev < birthYmd.y) return birthYmd.y;
        if (prev > cy + 5) return cy;
        return prev;
      });
    });
  }, [birthYmd]);

  /* 依赖中仅含 `dossier?.houseSystem`：其它案卷字段不影响本盘几何计算。 */
  const chartWheelData = useMemo(
    () => {
      if (!profileRow || !dossier || !birthYmd) return null;
      const birthUtc = birthMomentToUtc(profileRow.birthdate, profileRow.birthTime, profileRow.timeZone);
      if (!birthUtc) return null;
      const nowUtc = new Date();
      void chartInstantRefreshKey;
      try {
        return computeWorkspaceChartWheel({
          kind: chartKind,
          birthUtc,
          birthMonth: birthYmd.month,
          birthDay: birthYmd.day,
          latitudeDeg: profileRow.latitude,
          longitudeDeg: profileRow.longitude,
          houseSystem: dossier.houseSystem,
          nowUtc,
          solarReturnCalendarYear: Math.max(solarReturnYear, birthYmd.y),
          secondaryYearBasis: mainstreamSettings.secondaryYearBasis,
          tertiaryMonthBasis: mainstreamSettings.tertiaryMonthBasis,
        });
      } catch {
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅 houseSystem 参与几何盘；完整 dossier 会令笔记等字段触发无谓重算
    [
      profileRow,
      dossier?.houseSystem,
      birthYmd,
      chartKind,
      chartInstantRefreshKey,
      solarReturnYear,
      mainstreamSettings.secondaryYearBasis,
      mainstreamSettings.tertiaryMonthBasis,
    ],
  );

  // 「星盘数据」表格口径：用 Swiss Ephemeris（WASM）替换坐标口径，尽量对齐西方主流。
  const [swissChartWheelData, setSwissChartWheelData] = useState<typeof chartWheelData>(null);
  const [swissBusy, setSwissBusy] = useState(false);
  const [swissError, setSwissError] = useState<string | null>(null);
  const [synastryData, setSynastryData] = useState<{
    partnerLabel: string;
    aspects: ReturnType<typeof computeTransitNatalMajorAspects>;
    partnerInMyHouses: Array<{ planet: PlanetId; house: number }>;
    myInPartnerHouses: Array<{ planet: PlanetId; house: number }>;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!chartWheelData) {
        if (!cancelled) {
          setSwissChartWheelData(null);
          setSwissBusy(false);
          setSwissError(null);
        }
        return;
      }

      if (!cancelled) {
        setSwissBusy(true);
        setSwissError(null);
      }

      try {
        let instantUtcForSwiss = chartWheelData.instantUtc;

        if ((chartKind === "solar_return" || chartKind === "lunar_return") && profileRow) {
          const birthUtc = birthMomentToUtc(profileRow.birthdate, profileRow.birthTime, profileRow.timeZone);
          if (birthUtc) {
            const natalPlanets = await computePlanetsLongitudesSwiss(birthUtc);
            if (chartKind === "solar_return") {
              const natalSun = natalPlanets.find((p) => p.id === "sun");
              if (natalSun) {
                instantUtcForSwiss = await refineSolarReturnInstantSwiss({
                  guessUtc: chartWheelData.instantUtc,
                  natalSunLonDeg: natalSun.lonDeg,
                });
              }
            } else {
              const natalMoon = natalPlanets.find((p) => p.id === "moon");
              if (natalMoon) {
                instantUtcForSwiss = await refineLunarReturnInstantSwiss({
                  guessUtc: chartWheelData.instantUtc,
                  natalMoonLonDeg: natalMoon.lonDeg,
                });
              }
            }
          }
        }

        const swissBase = await computeAstroChartWheelDataSwiss({
          instantUtc: instantUtcForSwiss,
          latitudeDeg: chartWheelData.latitudeDeg,
          longitudeDeg: chartWheelData.longitudeDeg,
          houseSystem: chartWheelData.houseSystem,
        });

        swissBase.chartKindMeta = chartWheelData.chartKindMeta;

        if (chartKind === "transit" && profileRow) {
          const birthUtc = birthMomentToUtc(profileRow.birthdate, profileRow.birthTime, profileRow.timeZone);
          if (birthUtc) {
            const natalPlanets = await computePlanetsLongitudesSwiss(birthUtc);
            swissBase.transitNatalAspects = computeTransitNatalMajorAspects(swissBase.planets, natalPlanets, 6);
          }
        }

        if (!cancelled) {
          setSwissChartWheelData(swissBase);
          setSwissBusy(false);
          setSwissError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setSwissChartWheelData(null);
          setSwissBusy(false);
          const raw = e instanceof Error ? e.message : String(e);
          setSwissError(raw.startsWith("瑞士星历") ? raw : `瑞士星历：${raw || "计算失败"}`);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chartWheelData, chartKind, profileRow]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (chartKind !== "synastry" || !profileRow || !partnerProfile || !swissChartWheelData || !dossier) {
        if (!cancelled) setSynastryData(null);
        return;
      }
      const myBirthUtc = birthMomentToUtc(profileRow.birthdate, profileRow.birthTime, profileRow.timeZone);
      const partnerBirthUtc = birthMomentToUtc(partnerProfile.birthdate, partnerProfile.birthTime, partnerProfile.timeZone);
      if (!myBirthUtc || !partnerBirthUtc) {
        if (!cancelled) setSynastryData(null);
        return;
      }

      const [myPlanets, partnerPlanets, partnerWheel] = await Promise.all([
        computePlanetsLongitudesSwiss(myBirthUtc),
        computePlanetsLongitudesSwiss(partnerBirthUtc),
        computeAstroChartWheelDataSwiss({
          instantUtc: partnerBirthUtc,
          latitudeDeg: partnerProfile.latitude,
          longitudeDeg: partnerProfile.longitude,
          houseSystem: dossier.houseSystem,
        }),
      ]);

      const aspects = computeTransitNatalMajorAspects(partnerPlanets, myPlanets, 6);
      const partnerInMyHouses = partnerPlanets.map((p) => ({
        planet: p.id,
        house: houseNumberForLongitude(p.lonDeg, swissChartWheelData.houseCuspsLonDeg),
      }));
      const myInPartnerHouses = myPlanets.map((p) => ({
        planet: p.id,
        house: houseNumberForLongitude(p.lonDeg, partnerWheel.houseCuspsLonDeg),
      }));

      if (!cancelled) {
        setSynastryData({
          partnerLabel: partnerName.trim() || partnerProfile.displayName?.trim() || partnerProfile.placeLabel?.trim() || "对象B",
          aspects,
          partnerInMyHouses,
          myInPartnerHouses,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chartKind, profileRow, partnerProfile, swissChartWheelData, dossier?.houseSystem, partnerName]);

  const dailyCalibration = useMemo(
    () => {
      if (typeof window === "undefined") return null;
      const uid = window.localStorage.getItem(HUB_USER_ID_KEY) || "local-anon";
      const dayKey = getTodayKey();
      return buildDailyCalibration(uid, dayKey);
    },
    // tick：与 profile 刷新同源，便于同日内在工作台侧得到更新后的校准 seed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick],
  );

  const spectralLine = dailyCalibration
    ? `${getTodayKey()} · 今日节奏：${dailyCalibration.envElement}象偏强（${dailyCalibration.envIntensity.toFixed(
        2,
      )}） · 今日状态：${dailyCalibration.axiom.scene} · 今日建议：${dailyCalibration.axiom.action}`
    : "今日节奏：加载中…";

  const topicLabel = dossier ? TOPIC_OPTIONS.find((t) => t.id === dossier.topic)?.label ?? dossier.topic : "";

  const readingMd = useMemo(() => {
    if (!big3) return "";
    const dateLine = getTodayKey().replace(/-/g, ".");
    if (readingDepth === "short") return buildAstroWorkspaceUnderstandMarkdown(big3);
    if (readingDepth === "compact") return buildNatalReadingCompactMarkdown(big3);
    return buildNatalReadingFullMarkdown(big3, { dateLine, showCaseLine: true });
  }, [big3, readingDepth]);

  const chartFactLines = useMemo(() => {
    const lines: string[] = [];
    if (big3) {
      lines.push(`三主星：太阳 ${ZODIAC_CN[big3.sun]} · 月亮 ${ZODIAC_CN[big3.moon]} · 上升 ${ZODIAC_CN[big3.rising]}`);
      lines.push(
        chartWheelData
          ? swissError
            ? `行星黄经 / 宫位 / 主相位：瑞士星历未就绪（${swissError}）。`
            : swissChartWheelData
              ? "行星黄经 / 宫位 / 宫头 / 主相位：已计算并展示于左侧「星盘数据」面板（瑞士星历，热带黄道）。"
              : swissBusy
                ? "行星黄经 / 宫位 / 宫头 / 主相位：正在从瑞士星历计算中…"
                : "行星黄经 / 宫位 / 宫头 / 主相位：等待瑞士星历结果…"
          : "黄经度数：解锁档案后由星盘计算写入。",
      );
    } else {
      lines.push("未载入出生档案，ChartFact 不完整");
    }

    if (dossier) {
      lines.push(`宫位制：${houseSystemLabelZh(dossier.houseSystem)}`);
      lines.push(
        swissChartWheelData?.chartKindMeta?.lineZh
          ? `当前盘面：${swissChartWheelData.chartKindMeta.lineZh}`
          : "当前盘面：未生成（请先解锁档案）",
      );
      lines.push(`阅读角度：${LENS_OPTIONS.find((x) => x.id === dossier.lens)?.label ?? dossier.lens}`);
      lines.push(`议题：${TOPIC_OPTIONS.find((t) => t.id === dossier.topic)?.label ?? dossier.topic}`);
      if (chartKind === "synastry") {
        lines.push(
          partnerProfile
            ? `合盘对象：已加载（关系：${relationName || "缘起关系"}；你：${selfName || "你"}；对方：${partnerName || partnerProfile.displayName || "对象B"}）`
            : "合盘对象：未填写，请在初始参数中录入对象出生资料。",
        );
      }
      if (chartKind === "secondary") {
        lines.push(
          `次限口径：${mainstreamSettings.secondaryYearBasis === "tropical" ? "热带年 365.24219（主流）" : "儒略年 365.25"}`,
        );
      }
      if (chartKind === "tertiary") {
        lines.push(
          `三限口径：${mainstreamSettings.tertiaryMonthBasis === "synodic" ? "朔望月 29.53（主流）" : "恒星月 27.32"}`,
        );
      }
    }
    if (dailyCalibration) {
      lines.push(`今日校准 seed：${dailyCalibration.seed}（与 Hub 同日同用户锁定）`);
    }
    return lines;
  }, [
    big3,
    dossier,
    dailyCalibration,
    chartWheelData,
    swissChartWheelData,
    swissBusy,
    swissError,
    chartKind,
    partnerProfile,
    relationName,
    selfName,
    partnerName,
    mainstreamSettings.secondaryYearBasis,
    mainstreamSettings.tertiaryMonthBasis,
  ]);

  const persistStore = useCallback(
    (next: AstroDossierStore) => {
      saveAstroDossierStore(next);
      setStore(next);
    },
    [setStore],
  );

  const patchDossier = useCallback(
    (patch: Partial<AstroDossier>) => {
      if (!store) return;
      persistStore(updateActiveDossier(store, patch));
    },
    [store, persistStore],
  );

  const addDossier = useCallback(() => {
    if (!store) return;
    const d = createEmptyDossier({ title: `解读 ${store.dossiers.length + 1}` });
    persistStore({ dossiers: [...store.dossiers, d], activeId: d.id });
  }, [store, persistStore]);

  const removeActiveDossier = useCallback(() => {
    if (!store || store.dossiers.length <= 1) return;
    const rest = store.dossiers.filter((d) => d.id !== store.activeId);
    persistStore({ dossiers: rest, activeId: rest[0]!.id });
  }, [store, persistStore]);

  const onNotesChange = useCallback(
    (notes: string) => {
      if (!store) return;
      const next = updateActiveDossier(store, { notes });
      persistStore(next);
    },
    [store, persistStore],
  );

  const onBirthUnlocked = useCallback(() => {
    refreshProfile();
    setBirthPanelOpen(false);
    setCoordStatus("正在重新计算参数...");
    window.setTimeout(() => setCoordStatus("初始参数已锁定，可直接查看星盘。"), 900);
  }, [refreshProfile]);

  const onHouseSystemChange = useCallback(
    (houseSystem: HouseSystemId) => {
      patchDossier({ houseSystem });
      setHouseSystemPulseKey((k) => k + 1);
    },
    [patchDossier],
  );

  const onSecondaryYearBasisChange = useCallback((secondaryYearBasis: SecondaryYearBasisId) => {
    setMainstreamSettings((prev) => ({ ...prev, secondaryYearBasis }));
  }, []);

  const onTertiaryMonthBasisChange = useCallback((tertiaryMonthBasis: TertiaryMonthBasisId) => {
    setMainstreamSettings((prev) => ({ ...prev, tertiaryMonthBasis }));
  }, []);

  const applyMainstreamPreset = useCallback(() => {
    patchDossier({ houseSystem: "Placidus" });
    setMainstreamSettings(DEFAULT_ASTRO_MAINSTREAM_SETTINGS);
    setHouseSystemPulseKey((k) => k + 1);
  }, [patchDossier]);

  const onRefreshNow = useCallback(() => {
    setChartInstantRefreshKey((k) => k + 1);
  }, []);

  const onPartnerProfileSaved = useCallback(() => {
    const rawSelf = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    const selfProfile = parseStoredUserProfileJson(rawSelf);
    const raw = window.localStorage.getItem(PARTNER_PROFILE_STORAGE_KEY);
    const parsedPartner = parseStoredUserProfileJson(raw);
    setPartnerProfile(parsedPartner);
    if (!selfProfile || !parsedPartner) return;
    appendOriginsRelationshipRecord({
      relationName: relationName.trim() || "缘起关系",
      selfName: selfName.trim() || selfProfile.displayName,
      partnerName: partnerName.trim() || parsedPartner.displayName,
      selfProfile,
      partnerProfile: parsedPartner,
    });
  }, [partnerName, relationName, selfName]);

  const AUTO_REFRESH_KINDS: ChartKindId[] = ["transit", "ephemeris", "secondary", "tertiary", "lunar_return", "synastry"];

  useEffect(() => {
    if (!AUTO_REFRESH_KINDS.includes(chartKind)) return;
    setChartInstantRefreshKey((k) => k + 1);
  }, [chartKind]);

  if (!store || !dossier) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center text-zinc-400" style={{ background: BG }}>
        加载案卷…
      </div>
    );
  }

  const stressItems: { label: string; body: string }[] = [
    ...(dossier.topicDetail?.trim()
      ? [{ label: "你的补充", body: dossier.topicDetail.trim() }]
      : []),
    {
      label: "今日与月亮",
      body: big3
        ? dailyCalibration
          ? `今日外场为「${dailyCalibration.envElement}」元素（强度 ${dailyCalibration.envIntensity}），与月亮${ZODIAC_CN[big3.moon]}形成可讨论的对撞接口——先读节律，再判对错。`
          : `月亮${ZODIAC_CN[big3.moon]}：情感节律为结构应力主参考之一。`
        : "录入身份卡后，此处将合并今日环境元素与出生月亮。",
    },
    {
      label: "阅读角度",
      body:
        dossier.lens === "lunar_cycle"
          ? "当前按「月亮周期」组织解读：适合看情绪节奏与休整窗口，不单日断吉凶。"
          : "当前按「时间主星」组织解读：适合看中长线主题与压力链，可与日后行运对照。",
    },
    {
      label: "说明",
      body: "解读结合出生星盘与当日环境参考，不作无依据的宿命结论。",
    },
  ];

  const wheelDataRowClass = "w-full min-w-0 space-y-4";

  const axisInlineRows = (() => {
    if (!swissChartWheelData) return [] as Array<{ k: "上升" | "天顶" | "下降" | "天底"; text: string }>;
    const norm = (d: number) => ((d % 360) + 360) % 360;
    const dsc = norm(swissChartWheelData.ascLonDeg + 180);
    const ic = norm(swissChartWheelData.mcLonDeg + 180);
    return [
      { k: "上升" as const, text: formatLongitudeInSignZh(swissChartWheelData.ascLonDeg).text },
      { k: "天顶" as const, text: formatLongitudeInSignZh(swissChartWheelData.mcLonDeg).text },
      { k: "下降" as const, text: formatLongitudeInSignZh(dsc).text },
      { k: "天底" as const, text: formatLongitudeInSignZh(ic).text },
    ];
  })();

  const switchZone = (zone: CoreZoneId) => {
    setActiveZone(zone);
    setZoneFxKey((k) => k + 1);
    if (zone === "origin") setOriginPulseKey((k) => k + 1);
    const target = CORE_ZONES.find((z) => z.id === zone)?.anchorId;
    if (target) {
      window.setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 25);
    }
  };

  return (
    <div
      className="astro-workspace min-h-[100dvh] w-full min-w-0 overflow-x-hidden text-zinc-400"
      style={{ background: BG, paddingBottom: "calc(5.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          opacity: 0.05,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
        }}
        aria-hidden
      />

      <div
        className="relative z-10 mx-auto w-full min-w-0 max-w-6xl px-3 pt-3 sm:px-4 md:pt-4 lg:px-6"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        <header className="relative mb-4 flex min-w-0 items-start justify-center border-b border-white/[0.07] pb-4 pt-1.5">
          <Link
            href="/hub"
            className="absolute left-0 top-1 inline-flex shrink-0 items-center gap-1 rounded-full border border-[#B8942E]/35 px-2.5 py-2 text-xs text-[#C8A85C] transition-colors hover:border-[#C5A059]/45"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            返回
          </Link>
          <div className="min-w-0 text-center">
            <h1 className={`${UI_SCALE.pageTitle} font-bold tracking-[0.08em] text-[#D4C48A] ${serif.className}`}>占星工作台</h1>
            <p className="mt-1 text-sm font-medium tracking-[0.08em] text-zinc-400/95 sm:text-base">
              以主流口径立根，以中文语境通神。
            </p>
          </div>
        </header>

        <div className="sticky top-0 z-30 -mx-3 border-b border-white/[0.06] bg-[#0A0A1F]/92 px-3 py-2 backdrop-blur-md sm:-mx-4 sm:px-4 md:-mx-6 md:px-6 lg:-mx-6">
          <div className={`flex w-full min-w-0 gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${chartMono.className}`}>
            {CORE_ZONES.map((zone) => {
              const active = activeZone === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => switchZone(zone.id)}
                  className={`group shrink-0 rounded-lg border px-3 py-2 text-left transition-all duration-300 ${
                    active
                      ? "border-[#C5A059]/55 bg-[#C5A059]/8 opacity-100 shadow-[0_0_12px_rgba(197,160,89,0.22)]"
                      : "border-white/[0.12] bg-transparent opacity-85 hover:border-[#C5A059]/35 hover:opacity-100"
                  }`}
                >
                  <div className={UI_SCALE.zoneTitle}>
                    {zone.title}
                  </div>
                  <div className={`mt-1 ${UI_SCALE.zoneCopy}`}>{zone.copy}</div>
                  <div
                    className={`mt-1.5 h-[0.5px] transition-all ${active ? "w-full bg-[#C5A059]" : "w-full bg-white/[0.1]"}`}
                    style={active ? { boxShadow: "0 0 10px rgba(197,160,89,0.45), 0 0 18px rgba(197,160,89,0.28)" } : undefined}
                  />
                </button>
              );
            })}
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className={UI_SCALE.zoneHint}>先用「实相观测」看盘；需要改生日和规则时切到「初始参数」。</p>
            <button
              type="button"
              onClick={() => setSimpleMode((v) => !v)}
              className={`shrink-0 border border-[#C5A059]/45 bg-transparent ${UI_SCALE.panelToggle} transition-colors hover:border-[#C5A059]/70`}
            >
              {simpleMode ? "显示完整模式" : "切回简洁模式"}
            </button>
          </div>
        </div>

        <motion.div
          className="mt-3 space-y-2"
        >
            <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className={`flex w-full min-w-0 gap-3.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${chartMono.className}`}>
                {CHART_KIND_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setChartKind(o.id)}
                    title={o.label}
                    className={`shrink-0 rounded-lg border ${UI_SCALE.chartChip} transition-all ${
                      chartKind === o.id
                        ? "border-[#C5A059]/65 bg-[#C5A059]/12 text-[#D4C48A] shadow-[0_0_10px_rgba(197,160,89,0.28)]"
                        : "border-white/[0.15] bg-transparent text-zinc-400 hover:border-[#C5A059]/35 hover:text-zinc-300"
                    }`}
                  >
                    <span className={UI_SCALE.chartChipLabel}>{o.label}</span>
                  </button>
                ))}
              </div>
            </div>
            {chartKind === "solar_return" && birthYmd ? (
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs text-zinc-500" htmlFor="astro-solar-return-year">
                  日返年份
                </label>
                <select
                  id="astro-solar-return-year"
                  className="min-w-[6.5rem] rounded-xl border border-white/[0.08] bg-black/30 px-2.5 py-1.5 text-sm text-zinc-200 outline-none focus:border-[#C5A059]/35"
                  value={solarReturnYear}
                  onChange={(e) => setSolarReturnYear(Number(e.target.value))}
                >
                  {solarYearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-zinc-600">在生日附近求太阳回归出生太阳黄经的世界时瞬时</span>
              </div>
            ) : null}
          </motion.div>

        <motion.main
          key={zoneFxKey}
          className="mt-4 w-full min-w-0 space-y-4 pb-10"
          initial={{ opacity: 0.76, filter: "blur(8px)", scale: 1.018 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className={`w-full min-w-0 space-y-4 ${activeZone === "decoding" ? "hidden" : ""}`}>
            {activeZone === "origin" && chartKind === "synastry" ? (
              <div className="scroll-mt-24">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <label className="text-sm text-zinc-300">
                    关系名
                    <input
                      type="text"
                      value={relationName}
                      onChange={(e) => setRelationName(e.target.value)}
                      placeholder="例如：A 与 B"
                      className="mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-base text-zinc-300 outline-none placeholder:text-zinc-500 focus:border-[#C5A059]/35"
                    />
                  </label>
                  <label className="text-sm text-zinc-300">
                    你的称呼
                    <input
                      type="text"
                      value={selfName}
                      onChange={(e) => setSelfName(e.target.value)}
                      placeholder="例如：小赵"
                      className="mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-base text-zinc-300 outline-none placeholder:text-zinc-500 focus:border-[#C5A059]/35"
                    />
                  </label>
                  <label className="text-sm text-zinc-300">
                    对象称呼
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="例如：小A"
                      className="mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-base text-zinc-300 outline-none placeholder:text-zinc-500 focus:border-[#C5A059]/35"
                    />
                  </label>
                </div>
              </div>
            ) : null}
            <div id="section-chart-birth" className={`scroll-mt-24 ${activeZone === "origin" ? "" : "hidden"}`}>
              <BCard deboxed title="出生档案" subtitle="与首页身份金卡同档；解锁后即可稳定生成各类盘面。">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className={`flex min-w-0 flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap text-sm tracking-[0.08em] ${chartMono.className} [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
                    <span className="text-zinc-200">{profileRow ? "已保存出生信息" : "尚未录入"}</span>
                    <span className="text-[#E8D4A8]/95">{coordStatus}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCoordCeremonyKey((k) => k + 1);
                      setBirthPanelOpen((o) => !o);
                    }}
                    className="border border-white/[0.2] bg-transparent px-3 py-1.5 text-sm font-semibold tracking-[0.16em] text-zinc-300 transition-all hover:border-[#C5A059]/45 hover:text-[#C5A059] hover:shadow-[0_0_12px_rgba(197,160,89,0.2)]"
                  >
                    {birthPanelOpen ? "收起" : profileRow ? "排盘" : "去录入"}
                  </button>
                </div>
                {birthPanelOpen ? (
                  <motion.div
                    key={coordCeremonyKey}
                    className="mt-4 min-h-0 max-h-[min(70dvh,720px)] overflow-y-auto overflow-x-hidden border border-white/[0.08] bg-black/10 py-2 pl-1 pr-1 [-webkit-overflow-scrolling:touch] sm:pl-2"
                    initial={{ opacity: 0.35, filter: "blur(6px)" }}
                    animate={{ opacity: [0.55, 1], filter: ["blur(6px)", "blur(0px)"], x: [0, -2, 2, -1, 0] }}
                    transition={{ duration: 0.26, ease: "easeOut" }}
                  >
                    <HomeIdentityGoldBlock
                      layoutVariant="embedded"
                      withEnergyHeader={false}
                      className="min-w-0 px-1 sm:px-2"
                      onUnlockPersistSuccess={onBirthUnlocked}
                      useSwissEphemeris={true}
                      preferFormWhenProfileExists={true}
                    />
                  </motion.div>
                ) : null}
              </BCard>
            </div>

            <div id="section-chart-settings" className={`scroll-mt-24 ${activeZone === "origin" ? "" : "hidden"}`}>
              <BCard
                deboxed
                title="排盘设置"
                subtitle="统一管理排盘口径。先用主流默认，再做研究级微调。"
              >
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-300">主流预设：一键归位主流参数，便于跨软件对照与教学演示。</p>
                    <button
                      type="button"
                      onClick={applyMainstreamPreset}
                      className="border border-[#C5A059]/45 bg-transparent px-3 py-1.5 text-sm font-semibold tracking-[0.08em] text-[#D4C48A] transition-colors hover:border-[#C5A059]/70"
                    >
                      应用主流默认
                    </button>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-zinc-300">宫位制（决定宫位切分，影响落宫与主题重心）</p>
                    <OptionPills
                      ariaLabel="宫位制"
                      value={dossier.houseSystem}
                      onChange={onHouseSystemChange}
                      options={HOUSE_SYSTEM_OPTIONS}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-zinc-300">次限口径（设定次限推运基准；默认：热带年）</p>
                    <OptionPills
                      ariaLabel="次限口径"
                      value={mainstreamSettings.secondaryYearBasis}
                      onChange={onSecondaryYearBasisChange}
                      options={SECONDARY_YEAR_BASIS_OPTIONS}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-zinc-300">三限口径（设定三限推运基准；默认：朔望月）</p>
                    <OptionPills
                      ariaLabel="三限口径"
                      value={mainstreamSettings.tertiaryMonthBasis}
                      onChange={onTertiaryMonthBasisChange}
                      options={TERTIARY_MONTH_BASIS_OPTIONS}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                    <div className="rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-zinc-200">
                      相位集：{ASPECT_PRESET_OPTIONS.find((x) => x.id === mainstreamSettings.aspectPreset)?.label ?? "主相位"}
                    </div>
                    <div className="rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-zinc-200">
                      容许度：{ORB_PRESET_OPTIONS.find((x) => x.id === mainstreamSettings.orbPreset)?.label ?? "主流默认"}
                    </div>
                  </div>
                </div>
              </BCard>
            </div>

            <div id="section-chart-synastry-profile" className={`scroll-mt-24 ${activeZone === "origin" && chartKind === "synastry" ? "" : "hidden"}`}>
              <BCard deboxed title="合盘对象（对象B）" subtitle="合盘不贴标签，而是识别关系结构中的引力、阻力与成长路径。">
                <HomeIdentityGoldBlock
                  layoutVariant="embedded"
                  withEnergyHeader={false}
                  className="min-w-0 px-1 sm:px-2"
                  onUnlockPersistSuccess={onPartnerProfileSaved}
                  useSwissEphemeris={true}
                  preferFormWhenProfileExists={true}
                  profileStorageKey={PARTNER_PROFILE_STORAGE_KEY}
                  notifyProfileChange={false}
                />
              </BCard>
            </div>

            <div className={`${wheelDataRowClass} ${activeZone === "reality" || activeZone === "origin" ? "" : "hidden"}`}>
              <div id="section-chart-wheel" className="min-w-0 scroll-mt-24">
                <BCard
                  headerMono
                  title="轮盘"
                  subtitle="下方开关可简化盘面；右侧（宽屏）为星盘数据表，可一同对照。"
                >
                  {swissChartWheelData?.chartKindMeta?.lineZh ? (
                    <p
                      className={`${chartMono.className} mb-3 text-[11px] leading-relaxed tracking-[0.4em] text-zinc-500`}
                    >
                      {swissChartWheelData.chartKindMeta.lineZh}
                    </p>
                  ) : null}
                  <div className="w-full min-w-0 overflow-x-visible px-0 sm:px-0">
                    <motion.div
                      key={originPulseKey}
                      animate={activeZone === "origin" ? { scale: [1, 1.012, 0.996, 1], rotate: [0, -1.2, 0.6, 0] } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                    >
                    <motion.div
                      key={houseSystemPulseKey}
                      initial={false}
                      animate={{ rotate: [0, 0.9, -0.6, 0], scale: [1, 1.006, 0.998, 1] }}
                      transition={{ duration: 0.42, ease: "easeInOut" }}
                    >
                    <AstroChartStage className="w-full">
                      <div className="mx-auto aspect-square w-full min-w-0 max-w-[min(96vw,100%)] overflow-x-visible sm:max-w-[min(94vw,100%)] xl:max-w-[min(100%,min(96vw,96vh))]">
                        <ChartWheelPlaceholder
                          monoClassName={chartMono.className}
                          highlightSkeleton={!showAllBodies}
                          showAspectLines={showAspectLines}
                          showOuterBodies={showOuterBodies}
                          showRadials={showChartRadials}
                          chartData={swissChartWheelData}
                          className="h-full w-full max-w-none"
                        />
                      </div>
                    </AstroChartStage>
                    </motion.div>
                    </motion.div>
                  </div>
                  {axisInlineRows.length > 0 ? (
                    <div className={`mt-3 rounded-md border border-white/[0.06] bg-black/25 px-3 py-2 ${chartMono.className}`}>
                      <div className="mb-1 text-[11px] tracking-[0.16em] text-zinc-400">轴线定位</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
                        {axisInlineRows.map((r) => (
                          <div key={r.k} className="flex items-baseline gap-2 text-[13px]">
                            <span className="text-zinc-400">{r.k}</span>
                            <span className="text-zinc-400">{r.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {swissChartWheelData ? (
                    <div className={`mt-5 flex min-w-0 flex-wrap gap-6 ${chartMono.className}`}>
                      <button
                        type="button"
                        onClick={() => setShowAspectLines((v) => !v)}
                        className={`bg-transparent px-0 pb-1 text-[13px] tracking-[0.15em] transition-colors ${
                          showAspectLines
                            ? "border-b-[0.3px] border-[#C5A059] text-[#C5A059]"
                            : "border-b-[0.3px] border-transparent text-zinc-500 hover:border-[#C5A059]/35 hover:text-zinc-400"
                        }`}
                      >
                        相位线
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOuterBodies((v) => !v)}
                        className={`bg-transparent px-0 pb-1 text-[13px] tracking-[0.15em] transition-colors ${
                          showOuterBodies
                            ? "border-b-[0.3px] border-[#C5A059] text-[#C5A059]"
                            : "border-b-[0.3px] border-transparent text-zinc-500 hover:border-[#C5A059]/35 hover:text-zinc-400"
                        }`}
                      >
                        外行星
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowChartRadials((v) => !v)}
                        className={`bg-transparent px-0 pb-1 text-[13px] tracking-[0.15em] transition-colors ${
                          showChartRadials
                            ? "border-b-[0.3px] border-[#C5A059] text-[#C5A059]"
                            : "border-b-[0.3px] border-transparent text-zinc-500 hover:border-[#C5A059]/35 hover:text-zinc-400"
                        }`}
                      >
                        径向线
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAllBodies((v) => !v)}
                        className={`bg-transparent px-0 pb-1 text-[13px] tracking-[0.15em] transition-colors ${
                          showAllBodies
                            ? "border-b-[0.3px] border-[#C5A059] text-[#C5A059]"
                            : "border-b-[0.3px] border-transparent text-zinc-500 hover:border-[#C5A059]/35 hover:text-zinc-400"
                        }`}
                      >
                        全盘高亮
                      </button>
                    </div>
                  ) : chartWheelData && swissError ? (
                    <p className="mt-4 text-xs leading-relaxed text-rose-300/90">{swissError}</p>
                  ) : chartWheelData && swissBusy ? (
                    <p className="mt-4 text-xs leading-relaxed text-zinc-400">正在从瑞士星历生成轮盘…</p>
                  ) : (
                    <p className="mt-4 text-xs leading-relaxed text-zinc-500">录入并解锁档案后，这里会显示轮盘与数据表。</p>
                  )}
                </BCard>
              </div>

              <div
                id="section-chart-data"
                className="min-w-0 scroll-mt-24"
              >
                <BCard title="星盘数据" subtitle="行星落点、宫位与主相位（可上下滑动查看）。" className="xl:min-w-[420px]">
                  {swissChartWheelData ? (
                    <div className="max-h-[min(86vh,980px)] overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch]">
                      <AstroChartReadout
                        data={swissChartWheelData}
                        synastry={chartKind === "synastry" ? synastryData : null}
                        className="!mx-auto !w-full !max-w-[960px] !border-0 !bg-transparent !p-0 !shadow-none"
                      />
                    </div>
                  ) : chartWheelData && swissError ? (
                    <div className="space-y-2 text-xs leading-relaxed">
                      <p className="text-rose-300/90">{swissError}</p>
                      <p className="text-zinc-500">
                        请确认能访问本站目录 <span className="font-mono text-zinc-400">/swiss-ephe/</span> 下的星历文件，或刷新页面后重试。
                      </p>
                    </div>
                  ) : chartWheelData && swissBusy ? (
                    <p className="text-xs leading-relaxed text-zinc-400">正在从瑞士星历计算星盘数据…</p>
                  ) : (
                    <p className="text-xs leading-relaxed text-zinc-500">录入并解锁档案后显示。</p>
                  )}
                </BCard>
              </div>
            </div>
          </div>

          <motion.div
            initial={false}
            animate={activeZone === "decoding" ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            className={`w-full min-w-0 space-y-4 ${activeZone === "origin" ? "hidden" : ""}`}
          >
              <div id="read-section-prefs" className="scroll-mt-24">
                {activeZone === "decoding" ? (
                  <BCard title="解读偏好" subtitle="话题与阅读角度会写入案卷；「环境与节奏」会跟着变。">
                    <div className="space-y-5">
                      <div>
                        <p className="mb-2 text-xs font-medium text-zinc-500">关注话题</p>
                        <OptionPills
                          ariaLabel="关注话题"
                          value={dossier.topic}
                          onChange={(topic) => patchDossier({ topic })}
                          options={TOPIC_OPTIONS}
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-medium text-zinc-500">阅读角度</p>
                        <OptionPills
                          ariaLabel="阅读角度"
                          value={dossier.lens}
                          onChange={(lens) => patchDossier({ lens })}
                          options={LENS_OPTIONS}
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-medium text-zinc-500">议题补充（可选）</p>
                        <textarea
                          value={dossier.topicDetail}
                          onChange={(e) => patchDossier({ topicDetail: e.target.value })}
                          rows={3}
                          className="w-full min-h-[4.5rem] resize-y rounded-xl border border-white/[0.08] bg-black/30 p-3 text-sm leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#3D7A86]/40"
                          placeholder="例如：最近在换工作、在一段距离里、想看清一段关系…"
                        />
                      </div>
                    </div>
                  </BCard>
                ) : null}
              </div>

              <div id="read-section-big3" className="scroll-mt-24">
                {activeZone === "decoding" ? (
                  <BCard title="你的日月升" subtitle="先看这三颗，最容易对上日常感受。">
                    {big3 ? (
                      <div className={`text-sm leading-relaxed text-zinc-300 ${serif.className}`}>
                        <Big3Narrative big3={big3} />
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500">请先在上方「出生档案」里录入并解锁。</p>
                    )}
                    {profileRow ? (
                      <pre className="mt-4 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-black/25 p-3 text-[11px] leading-relaxed text-zinc-500" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
                        {`${profileRow.birthdate} ${profileRow.birthTime}\n${profileRow.timeZone}\n${profileRow.placeLabel ?? `${profileRow.latitude}, ${profileRow.longitude}`}`}
                      </pre>
                    ) : null}
                  </BCard>
                ) : null}
              </div>

              <div id="read-section-today" className="scroll-mt-24">
                {activeZone === "reality" ? (
                  <BCard title="今日参考" subtitle="仅供当天心情与节奏参考，不改变出生结构。">
                    <p className="text-sm leading-relaxed text-zinc-400">{spectralLine}</p>
                  </BCard>
                ) : null}
              </div>

              <div id="read-section-text" className="scroll-mt-24 space-y-4">
                {activeZone === "decoding" ? (
                  <motion.div
                    initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                    animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="space-y-4"
                  >
                    <BCard title="正文深度" subtitle="同一套算法，三种篇幅；全文较长，建议宽屏或慢慢滑。">
                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
                        {READING_DEPTH_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setReadingDepth(opt.id)}
                            className={`flex min-w-0 flex-1 flex-col rounded-xl border px-3 py-2.5 text-left transition-colors sm:min-w-[7.5rem] sm:flex-none ${
                              readingDepth === opt.id ? "border-[#C5A059]/40 bg-[#C5A059]/10" : "border-white/[0.08] hover:border-white/15"
                            }`}
                          >
                            <span className="text-sm font-medium text-zinc-400">{opt.label}</span>
                            <span className="mt-0.5 text-[11px] leading-snug text-zinc-500">{opt.subtitle}</span>
                          </button>
                        ))}
                      </div>
                    </BCard>

                    <BCard
                      title={
                        readingDepth === "short"
                          ? "通俗解读（短卡）"
                          : readingDepth === "compact"
                            ? "通俗解读（精简）"
                            : "通俗解读（全文）"
                      }
                      subtitle={
                        readingDepth === "short"
                          ? "日月升与关系向短句，和首页长文错层。"
                          : readingDepth === "compact"
                            ? "结构与金卡相近的精简长文。"
                            : "完整导师版；可收藏、可慢慢对照。"
                      }
                    >
                      {big3 ? (
                        <NatalReadingMarkdown source={readingMd} className="astro-workspace-reading text-sm leading-relaxed text-zinc-300" />
                      ) : (
                        <p className="text-sm text-zinc-500">载入档案后显示。</p>
                      )}
                    </BCard>
                  </motion.div>
                ) : null}
              </div>

              <div id="read-section-rhythm" className="scroll-mt-24">
                {activeZone === "decoding" ? (
                  <BCard title="环境与节奏" subtitle="把「今天」和「你的月亮」放在一起看。">
                    <ul className="space-y-4">
                      {stressItems.map((s) => (
                        <li key={s.label} className="border-l-2 border-[#C5A059]/25 pl-3">
                          <p className="text-xs font-medium text-[#C5A059]">{s.label}</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{s.body}</p>
                        </li>
                      ))}
                    </ul>
                  </BCard>
                ) : null}
              </div>
            </motion.div>

          {simpleMode ? (
            <div className="mt-8 w-full min-w-0 border-t border-white/[0.06] pt-6">
              <BCard title="更多工具（已收起）" subtitle="已为你简化页面：当前只保留看盘所需核心区域。">
                <p className="text-sm leading-relaxed text-zinc-400">
                  如需管理案卷、写便签、查看技术条目，点上方「显示完整模式」即可展开。
                </p>
              </BCard>
            </div>
          ) : null}

          <div className={`mt-8 w-full min-w-0 space-y-4 border-t border-white/[0.06] pt-6 ${simpleMode ? "hidden" : ""}`}>
            <p className="text-xs tracking-wide text-zinc-500">案卷与备忘</p>
            <BCard title="案卷" subtitle="多份本地存档可切换；标题只给自己看。">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500" htmlFor="astro-dossier-select">
                    切换到
                  </label>
                  <select
                    id="astro-dossier-select"
                    className="mt-1.5 w-full min-w-0 rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-[#C5A059]/35"
                    value={store.activeId}
                    onChange={(e) => persistStore({ ...store, activeId: e.target.value })}
                  >
                    {store.dossiers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500" htmlFor="astro-dossier-title">
                    案卷标题
                  </label>
                  <input
                    id="astro-dossier-title"
                    type="text"
                    value={dossier.title}
                    onChange={(e) => patchDossier({ title: e.target.value })}
                    className="mt-1.5 w-full min-w-0 rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#C5A059]/35"
                    placeholder="例如：出生结构初探"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={addDossier}
                    className="rounded-full border border-[#3D7A86]/38 px-3 py-1.5 text-xs text-[#5F8794] transition-colors hover:border-[#4A8A96]/55"
                  >
                    新建案卷
                  </button>
                  {store.dossiers.length > 1 ? (
                    <button
                      type="button"
                      onClick={removeActiveDossier}
                      className="rounded-full border border-rose-500/25 px-3 py-1.5 text-xs text-rose-300/90 transition-colors hover:border-rose-400/45"
                    >
                      删除当前案卷
                    </button>
                  ) : null}
                </div>
              </div>
            </BCard>

            <BCard title="出生摘要" subtitle="当前案卷与排盘方式一览。">
              <dl className="space-y-2 text-sm text-zinc-400">
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="text-zinc-500">宫位制</dt>
                  <dd className="text-zinc-300">{houseSystemLabelZh(dossier.houseSystem)}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="text-zinc-500">阅读角度</dt>
                  <dd className="text-zinc-300">{LENS_OPTIONS.find((x) => x.id === dossier.lens)?.label ?? dossier.lens}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="text-zinc-500">关注话题</dt>
                  <dd className="text-zinc-300">{topicLabel || "—"}</dd>
                </div>
              </dl>
            </BCard>

            <BCard title="对照思考" subtitle="把盘当成镜子，用问题代替结论。">
              <div className="space-y-5">
                <InsightBlock k="·" title="事实" tone="cyan" inkDelay={0}>
                  {big3 ? (
                    <>
                      太阳在<MatteTerm>{ZODIAC_CN[big3.sun]}</MatteTerm>，月亮在<MatteTerm>{ZODIAC_CN[big3.moon]}</MatteTerm>，上升在
                      <MatteTerm>{ZODIAC_CN[big3.rising]}</MatteTerm>；宫位制 {houseSystemLabelZh(dossier.houseSystem)}。
                    </>
                  ) : (
                    <span className="text-zinc-500">无档案时无法列出。</span>
                  )}
                </InsightBlock>
                <InsightBlock k="·" title="可以怎么想" tone="gold" inkDelay={0}>
                  <>
                    太阳偏「我想成为什么」，月亮偏「我需要什么才安心」，上升偏「别人先看到的我」。结合你选的话题「{topicLabel || "—"}」慢慢对照即可。
                  </>
                </InsightBlock>
                <InsightBlock k="·" title="一个小问题" tone="muted" inkDelay={0}>
                  今天若重复卡在同一情绪里，它更像月亮的敏感、太阳的自尊，还是上升的自我保护？
                </InsightBlock>
              </div>
            </BCard>

            <BCard title="便签" subtitle="只给自己看的几句备忘。">
              <textarea
                value={dossier.notes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={5}
                className="w-full min-h-[6rem] resize-y rounded-xl border border-white/[0.08] bg-black/30 p-3 text-sm leading-relaxed text-zinc-200 outline-none ring-0 placeholder:text-zinc-600 focus:border-[#3D7A86]/40"
                placeholder="写一句今天想记住的…"
              />
            </BCard>

            <BCard title="技术说明" subtitle="不止结论，更有证据：口径、参数、数据源与回归轨迹。">
              <button
                type="button"
                onClick={() => setChartFactOpen((o) => !o)}
                className="flex w-full min-w-0 items-center justify-between gap-2 py-2 text-left text-sm text-zinc-500 transition-colors hover:text-[#C5A059]"
              >
                <span className="truncate">{chartFactOpen ? "收起" : "展开"}排盘与校准条目</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${chartFactOpen ? "rotate-180" : ""}`} />
              </button>
              {chartFactOpen ? (
                <ul className="mt-3 space-y-2 border-t border-white/[0.06] pt-3 text-xs leading-relaxed text-zinc-500" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
                  <li className="break-words border-l border-[#C5A059]/20 pl-2.5">
                    对标样例库：{ASTRO_BENCHMARK_PACK_VERSION}（同输入、同参数的持续回归基线）
                  </li>
                  {chartFactLines.map((line) => (
                    <li key={line} className="break-words border-l border-[#C5A059]/20 pl-2.5">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : null}
            </BCard>
          </div>
        </motion.main>
      </div>
    </div>
  );
}

