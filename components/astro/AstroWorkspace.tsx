"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ChevronLeft } from "lucide-react";
import AstroChartStage from "./AstroChartStage";
import ChartWheelPlaceholder from "./ChartWheelPlaceholder";
import AstroChartReadout from "./AstroChartReadout";
import SwissEphemerisErrorCallout from "./SwissEphemerisErrorCallout";
import HomeIdentityGoldBlock from "@/components/home/HomeIdentityGoldBlock";
import { MatteTerm } from "./InkReveal";
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
  type AspectPresetId,
  type ChartKindId,
  type OrbPresetId,
  type SecondaryYearBasisId,
  type TertiaryMonthBasisId,
  chartKindHasWheelTableObservation,
  computeWorkspaceChartWheel,
} from "@/lib/astro-chart-kinds";
import {
  CHART_DATA_CARD_TITLE_ZH,
  OBSERVATION_PANEL_TITLES_ZH,
  WORKSPACE_DECODE_SURFACE_ZH,
  workspaceCoreZonesForChartKind,
} from "@/lib/astro-eight-chart-view-copy-zh";
import { workspaceDecodeSurfaceVocal } from "@/lib/astro-workspace-master-voice-layers-zh";
import { resolveChartAspectParams } from "@/lib/astro-aspect-params";
import {
  computeAstroChartWheelDataSwiss,
  computeNatalBig3WithHousesSwiss,
  computePlanetsLongitudesSwiss,
  refineSolarReturnInstantSwiss,
  refineLunarReturnInstantSwiss,
  resetSwissEphemerisClientForRetry,
} from "@/lib/astro-chart-wheel-swiss";
import {
  computeTransitNatalAspects,
  formatLongitudeInSignZh,
  houseNumberForLongitude,
  houseSystemLabelZh,
  type AstroChartWheelData,
  type AstroTransitNatalAspectDatum,
  type PlanetId,
} from "@/lib/astro-chart-wheel";
import { buildAnswerLayerRouting } from "@/lib/astro-answer-routing";
import { buildTransitRealtimeReport } from "@/lib/astro-transit-report-zh";
import { buildMajorAspectObservationReport } from "@/lib/astro-major-aspect-report-zh";
import { buildHouseCuspObservationReport } from "@/lib/astro-house-cusp-report-zh";
import { buildMinorAspectObservationReport } from "@/lib/astro-minor-aspect-report-zh";
import { buildAngleAspectObservationReport } from "@/lib/astro-angle-aspect-report-zh";
import { buildPlanetPositionsObservationReport } from "@/lib/astro-planet-positions-report-zh";
import { buildAxisInterpretationZh } from "@/lib/astro-axis-interpretation-zh";
import { houseSystemReadoutHintVocal } from "@/lib/astro-house-system-hint-voice-zh";
import { astroViewCopyGuideVocal, formatAstroViewCopyGuideMarkdownZh } from "@/lib/astro-view-copy-guide-voice-zh";
import { houseSystemWorkspaceUiVocal } from "@/lib/astro-workspace-house-system-ui-voice-zh";
import { appendOriginsRelationshipRecord } from "@/lib/origins-relationships-storage";
import { chartDataCardSubtitleVocal } from "@/lib/astro-chart-data-card-subtitle-voice-zh";
import { chartWheelCardSubtitleVocal } from "@/lib/astro-workspace-wheel-card-subtitle-voice-zh";
import { workspaceReadingMarkdownVocal } from "@/lib/astro-workspace-chrome-voice-zh";
import { workspaceTodaySpectralLineVocal } from "@/lib/astro-workspace-spectral-line-voice-zh";
import { selectVoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import {
  ASPECT_PRESET_OPTIONS,
  ASTRO_MAINSTREAM_SETTINGS_STORAGE_KEY,
  DEFAULT_ASTRO_MAINSTREAM_SETTINGS,
  ORB_PRESET_OPTIONS,
  SECONDARY_YEAR_BASIS_OPTIONS,
  TERTIARY_MONTH_BASIS_OPTIONS,
  parseAstroMainstreamSettingsJson,
} from "@/lib/astro-mainstream-settings";
import {
  HOUSE_SYSTEM_MORE_IDS,
  HOUSE_SYSTEM_OPTIONS_COMMON,
  HOUSE_SYSTEM_OPTIONS_MORE,
} from "@/lib/astro-house-systems";
import { formatSwissEphemerisError, type SwissErrorDisplay } from "@/lib/swiss-ephemeris-error-zh";

/** 不用 next/font 拉 Google 子集，避免多一条字体请求拖慢首屏、在受限网络下长时间 pending。 */
const SERIF_ZH =
  "ui-serif, 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'SimSun', Georgia, serif";

const BG = "#0A0A1F";
const HUB_USER_ID_KEY = "labyrinthos-user-id";
const PARTNER_RELATION_DRAFT_KEY = "labyrinthos-partner-relation-draft-v1";
const PARTNER_SLOT_ACTIVE_KEY = "labyrinthos-partner-slot-active-v1";

type PartnerSlotId = "A" | "B" | "C";
const PARTNER_SLOTS: { id: PartnerSlotId; label: string; storageKey: string }[] = [
  { id: "A", label: "对象A", storageKey: "labyrinthos-partner-profile-v1-a" },
  { id: "B", label: "对象B", storageKey: "labyrinthos-partner-profile-v1-b" },
  { id: "C", label: "对象C", storageKey: "labyrinthos-partner-profile-v1-c" },
];

const TOPIC_OPTIONS: { id: AstroTopic; label: string }[] = [
  { id: "love", label: "感情窗口" },
  { id: "career", label: "职业节点" },
  { id: "self", label: "自我认识" },
];

const LENS_OPTIONS: { id: AstroLens; label: string }[] = [
  { id: "time_lord", label: "时间主星" },
  { id: "lunar_cycle", label: "月亮周期" },
];

/** 瑞士星历请求指纹：用于失败时判断是否仍应保留「上一份成功结果」（避免换档案后仍显示上一人盘面）。 */
function swissChartWheelInputKey(
  cwd: AstroChartWheelData,
  kind: ChartKindId,
  aspectPreset: AspectPresetId,
  orbPreset: OrbPresetId,
): string {
  return [
    cwd.instantUtc.toISOString(),
    cwd.latitudeDeg.toFixed(6),
    cwd.longitudeDeg.toFixed(6),
    cwd.houseSystem,
    kind,
    cwd.chartKindMeta?.id ?? "",
    aspectPreset,
    orbPreset,
  ].join("|");
}

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

function BCard({
  title,
  subtitle,
  children,
  className = "",
  deboxed = false,
  compact = false,
  /** 去框折叠：标题行无描边 hover，更像文稿目录 */
  deboxedFoldBare = false,
  foldable = false,
  foldOpen = false,
  onFoldToggle,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  /** 去框化：仅保留细分割线与轻标题 */
  deboxed?: boolean;
  /** 收紧内边距与标题下间距（轮盘等需少留白时用） */
  compact?: boolean;
  deboxedFoldBare?: boolean;
  /** 点击标题栏展开/收起正文（默认收起时 foldOpen=false） */
  foldable?: boolean;
  foldOpen?: boolean;
  onFoldToggle?: () => void;
}) {
  const headerMargin = foldable && !foldOpen ? "mb-0" : compact ? "mb-2" : "mb-4";
  const foldBtnClass =
    deboxed && deboxedFoldBare
      ? "group flex w-full min-w-0 items-start justify-between gap-3 py-1 text-left transition-opacity hover:opacity-90"
      : "group flex w-full min-w-0 items-start justify-between gap-3 rounded-lg border border-transparent py-0.5 text-left transition-colors hover:border-white/[0.08] hover:bg-white/[0.03]";
  return (
    <section
      className={
        deboxed
          ? `w-full min-w-0 border-t border-[#C5A059]/10 pt-4 sm:pt-5 ${className}`
          : `w-full min-w-0 rounded-2xl border border-white/[0.08] bg-[#0b0b22]/90 shadow-[0_12px_48px_rgba(0,0,0,0.4)] backdrop-blur-sm ${
              compact ? "p-3 sm:p-4" : "p-4 sm:p-5"
            } ${className}`
      }
    >
      {(title || subtitle) && (
        <header className={`${headerMargin} min-w-0 font-sans`}>
          {foldable && onFoldToggle ? (
            <button
              type="button"
              onClick={onFoldToggle}
              aria-expanded={foldOpen}
              className={foldBtnClass}
            >
              <div className="min-w-0 flex-1">
                {title ? (
                  <h2 className={deboxed ? UI_SCALE.cardTitleDeboxed : UI_SCALE.cardTitleDefault}>{title}</h2>
                ) : null}
                {subtitle ? <p className={UI_SCALE.cardSubtitle}>{subtitle}</p> : null}
              </div>
              <ChevronDown
                className={`mt-1 h-5 w-5 shrink-0 text-zinc-500 transition-transform group-hover:text-zinc-400 ${
                  foldOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>
          ) : (
            <>
              {title ? (
                <h2 className={deboxed ? UI_SCALE.cardTitleDeboxed : UI_SCALE.cardTitleDefault}>{title}</h2>
              ) : null}
              {subtitle ? <p className={UI_SCALE.cardSubtitle}>{subtitle}</p> : null}
            </>
          )}
        </header>
      )}
      {(!foldable || foldOpen) && <div className="min-w-0">{children}</div>}
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

type CoreZoneId = "origin" | "reality" | "decoding";

type ReadingDepthId = "short" | "compact" | "full";

const READING_DEPTH_OPTIONS: { id: ReadingDepthId; label: string; subtitle: string }[] = [
  { id: "short", label: "短卡", subtitle: "同源语料首段摘录，最快浏览" },
  { id: "compact", label: "精简", subtitle: "同源语料精简组装，约为全文 1/3" },
  { id: "full", label: "全文", subtitle: "同源语料完整长读" },
];

const AUTO_REFRESH_KINDS: ChartKindId[] = ["transit", "ephemeris", "secondary", "tertiary", "lunar_return", "synastry"];

const UI_SCALE = {
  pageTitle: "text-4xl sm:text-5xl",
  pageSub: "text-[15px] text-zinc-400",
  zoneTitle: "text-[15px] sm:text-[16px] tracking-[0.16em] font-medium text-zinc-300",
  zoneCopy: "text-[13px] sm:text-[14px] tracking-[0.1em] text-zinc-400",
  zoneHint: "text-[13px] font-medium text-zinc-400",
  chartChip: "px-4 py-2.5 text-[14px] sm:text-[15px] tracking-[0.08em] font-medium",
  chartChipLabel: "text-[13px] sm:text-[14px] tracking-[0.04em]",
  optionPill: "px-4 py-2.5 text-[15px] font-medium tracking-[0.06em]",
  cardTitleDeboxed: "text-[16px] font-semibold leading-snug tracking-[0.16em] text-[#D4C48A]",
  cardTitleDefault: "text-[17px] font-semibold leading-snug text-zinc-300",
  cardSubtitle: "mt-1 text-[16px] leading-relaxed text-zinc-400",
} as const;

function OptionPills<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  containerClassName,
  fullWidthPills,
  variant = "default",
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly { id: T; label: string }[];
  ariaLabel?: string;
  /** 默认 `flex flex-wrap`；宫位制等选项多时可传 grid 类名。 */
  containerClassName?: string;
  /** 与 grid 容器搭配：药丸拉满格宽，避免长短不一。 */
  fullWidthPills?: boolean;
  /** 幽灵：无底框，选中为底边金线（灵识解构偏好区） */
  variant?: "default" | "ghost";
}) {
  const defaultContainer =
    variant === "ghost" ? "flex flex-wrap items-end gap-x-1 gap-y-1" : "flex flex-wrap gap-2";
  return (
    <div
      className={containerClassName ?? defaultContainer}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={
            variant === "ghost"
              ? `rounded-none border-0 border-b-2 bg-transparent px-2 py-1 text-[13px] font-medium tracking-[0.14em] transition-colors ${
                  fullWidthPills ? "w-full min-w-0 text-left " : ""
                }${
                  value === o.id
                    ? "border-[#C5A059]/75 text-[#E8D4A8]"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`
              : `border border-white/[0.2] bg-transparent ${UI_SCALE.optionPill} transition-all ${
                  fullWidthPills ? "w-full min-w-0 " : ""
                }${
                  value === o.id
                    ? "border-[#C5A059]/75 text-[#D4C48A] shadow-[0_0_14px_rgba(197,160,89,0.34)]"
                    : "text-zinc-400 hover:border-[#C5A059]/45 hover:text-zinc-300"
                }`
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function readAstroDossierStoreSafe(): AstroDossierStore {
  try {
    return loadAstroDossierStore();
  } catch {
    const d = createEmptyDossier({ title: "本命结构初探" });
    return { dossiers: [d], activeId: d.id };
  }
}

export default function AstroWorkspace() {
  /** 由 /astro 页保证仅在客户端挂载后再渲染本组件，此处同步读案卷 */
  const [store, setStore] = useState<AstroDossierStore>(() => readAstroDossierStoreSafe());
  const [big3, setBig3] = useState<NatalBig3 | null>(null);
  const [natalReadingHouses, setNatalReadingHouses] = useState<{ sunHouse: number; moonHouse: number } | null>(
    null,
  );

  const [birthPanelOpen, setBirthPanelOpen] = useState(false);
  const [showAspectLines, setShowAspectLines] = useState(true);
  const [showMinorAspectLines, setShowMinorAspectLines] = useState(false);
  const [showAngleAspectLines, setShowAngleAspectLines] = useState(true);
  const [showOuterBodies, setShowOuterBodies] = useState(false);
  const [showAllBodies, setShowAllBodies] = useState(false);
  const [showChartRadials, setShowChartRadials] = useState(true);
  const [readingDepth, setReadingDepth] = useState<ReadingDepthId>("short");
  const [chartInstantRefreshKey, setChartInstantRefreshKey] = useState(0);
  /** 与瑞士星历「重新计算」共用，便于三主星与轮盘数据一并重拉 */
  const [swissRetryNonce, setSwissRetryNonce] = useState(0);
  const [wheelExtrasOpen, setWheelExtrasOpen] = useState(false);
  /** 默认展开：读数含宫位/宫头，避免误以为被「隐藏」 */
  const [chartDataOpen, setChartDataOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [synastryProfileOpen, setSynastryProfileOpen] = useState(false);
  const [todayRefOpen, setTodayRefOpen] = useState(false);
  /** 默认展开：便于看到「当前案卷已记下」与选项联动 */
  const [decodePrefsOpen, setDecodePrefsOpen] = useState(true);
  const [decodeBig3Open, setDecodeBig3Open] = useState(false);
  const [decodeInterpretOpen, setDecodeInterpretOpen] = useState(false);
  /** 默认展开：内嵌与「星盘数据→行星位置」同源的读数摘录，避免空壳感 */
  const [decodeRhythmOpen, setDecodeRhythmOpen] = useState(true);
  const [chartKind, setChartKind] = useState<ChartKindId>("natal");
  const [solarReturnYear, setSolarReturnYear] = useState(() => new Date().getFullYear());
  // 默认先落在「初始参数」，避免首次进入时只看到观测/轮盘而出生档案却被隐藏。
  const [activeZone, setActiveZone] = useState<CoreZoneId>("origin");
  const [originPulseKey, setOriginPulseKey] = useState(0);
  const [zoneFxKey, setZoneFxKey] = useState(0);
  const [coordCeremonyKey, setCoordCeremonyKey] = useState(0);
  const [coordStatus, setCoordStatus] = useState<string>("初始参数已锁定，可直接查看星盘。");
  const [houseSystemPulseKey, setHouseSystemPulseKey] = useState(0);
  const [houseSystemMoreOpen, setHouseSystemMoreOpen] = useState(false);
  const zoneTabsScrollRef = useRef<HTMLDivElement | null>(null);
  const onZoneTabsWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = zoneTabsScrollRef.current;
    if (!el) return;
    const hasHorizontalOverflow = el.scrollWidth - el.clientWidth > 1;
    if (!hasHorizontalOverflow) return;

    // 若用户正在做“水平滚动/换向”（deltaX 更明显，或按了 Shift），交给浏览器默认处理。
    if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    // 把垂直滚轮映射到水平滚动：仅当指针在该容器上时才会触发（没有“自动滚动”）。
    el.scrollLeft += e.deltaY;
    e.preventDefault();
  }, []);
  const [mainstreamSettings, setMainstreamSettings] = useState(DEFAULT_ASTRO_MAINSTREAM_SETTINGS);
  const [activePartnerSlot, setActivePartnerSlot] = useState<PartnerSlotId>("A");
  const [partnerProfile, setPartnerProfile] = useState<StoredUserProfile | null>(null);
  const [relationName, setRelationName] = useState("");
  const [selfName, setSelfName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [exportStatus, setExportStatus] = useState<"idle" | "ok" | "error">("idle");

  const [tick, setTick] = useState(0);

  const activePartnerStorageKey = useMemo(
    () => PARTNER_SLOTS.find((s) => s.id === activePartnerSlot)?.storageKey ?? PARTNER_SLOTS[0]!.storageKey,
    [activePartnerSlot],
  );

  const refreshProfile = useCallback(() => {
    setBig3(null); // 先置空，避免短时间展示 astronomy-engine 口径的三主星
    setNatalReadingHouses(null);
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => {
      setBig3(null);
      setNatalReadingHouses(null);
      const cachedActiveSlot = window.localStorage.getItem(PARTNER_SLOT_ACTIVE_KEY) as PartnerSlotId | null;
      if (cachedActiveSlot && PARTNER_SLOTS.some((s) => s.id === cachedActiveSlot)) {
        setActivePartnerSlot(cachedActiveSlot);
      }
      const slotId = cachedActiveSlot && PARTNER_SLOTS.some((s) => s.id === cachedActiveSlot) ? cachedActiveSlot : "A";
      const slotKey = PARTNER_SLOTS.find((s) => s.id === slotId)?.storageKey ?? PARTNER_SLOTS[0]!.storageKey;
      const rawPartner = window.localStorage.getItem(slotKey);
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PARTNER_SLOT_ACTIVE_KEY, activePartnerSlot);
    const rawPartner = window.localStorage.getItem(activePartnerStorageKey);
    setPartnerProfile(parseStoredUserProfileJson(rawPartner));
  }, [activePartnerSlot, activePartnerStorageKey]);

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

  const dossier = getActiveDossier(store);

  const profileRow = useMemo(
    () => {
      if (typeof window === "undefined") return null;
      return parseStoredUserProfileJson(window.localStorage.getItem(USER_PROFILE_STORAGE_KEY));
    },
    // tick：档案变更事件里递增，强制重读 localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick],
  );

  // 三主星（太阳/月亮/上升）+ 日/月宫位：Swiss Ephemeris，与案卷宫位制一致。
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!profileRow?.birthdate || !profileRow?.birthTime || !profileRow?.timeZone) {
        if (!cancelled) {
          setBig3(null);
          setNatalReadingHouses(null);
        }
        return;
      }
      const utc = birthMomentToUtc(profileRow.birthdate, profileRow.birthTime, profileRow.timeZone);
      if (!utc) {
        if (!cancelled) {
          setBig3(null);
          setNatalReadingHouses(null);
        }
        return;
      }
      try {
        const next = await computeNatalBig3WithHousesSwiss(
          utc,
          profileRow.latitude,
          profileRow.longitude,
          dossier?.houseSystem ?? "Placidus",
        );
        if (!cancelled) {
          setBig3({ sun: next.sun, moon: next.moon, rising: next.rising });
          setNatalReadingHouses({ sunHouse: next.sunHouse, moonHouse: next.moonHouse });
        }
      } catch (e) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[瑞士星历] 三主星计算失败", e);
        }
        if (!cancelled) {
          setBig3(null);
          setNatalReadingHouses(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    profileRow?.birthdate,
    profileRow?.birthTime,
    profileRow?.timeZone,
    profileRow?.latitude,
    profileRow?.longitude,
    dossier?.houseSystem,
    swissRetryNonce,
  ]);

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
          aspectPreset: mainstreamSettings.aspectPreset,
          orbPreset: mainstreamSettings.orbPreset,
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
      mainstreamSettings.aspectPreset,
      mainstreamSettings.orbPreset,
    ],
  );

  // 「星盘数据」表格口径：用 Swiss Ephemeris（WASM）替换坐标口径，尽量对齐西方主流。
  const [swissChartWheelData, setSwissChartWheelData] = useState<typeof chartWheelData>(null);
  const [swissBusy, setSwissBusy] = useState(false);
  const [swissError, setSwissError] = useState<SwissErrorDisplay | null>(null);
  const swissLastSuccessInputKeyRef = useRef<string | null>(null);
  const [synastryData, setSynastryData] = useState<{
    partnerLabel: string;
    aspects: AstroTransitNatalAspectDatum[];
    minorAspects?: AstroTransitNatalAspectDatum[];
    majorOrbDeg?: number;
    minorOrbDeg?: number;
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
          swissLastSuccessInputKeyRef.current = null;
        }
        return;
      }

      if (!cancelled) {
        setSwissBusy(true);
        setSwissError(null);
      }

      try {
        const aspect = resolveChartAspectParams({
          aspectPreset: mainstreamSettings.aspectPreset,
          orbPreset: mainstreamSettings.orbPreset,
        });

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
          aspect,
        });

        swissBase.chartKindMeta = chartWheelData.chartKindMeta;

        if (chartKind === "transit" && profileRow) {
          const birthUtc = birthMomentToUtc(profileRow.birthdate, profileRow.birthTime, profileRow.timeZone);
          if (birthUtc) {
            const natalPlanets = await computePlanetsLongitudesSwiss(birthUtc);
            const tn = computeTransitNatalAspects(swissBase.planets, natalPlanets, {
              majorOrbDeg: aspect.majorOrbDeg,
              minorOrbDeg: aspect.minorOrbDeg,
              maxMajor: 40,
              maxMinor: aspect.includeMinorAspects ? 36 : 0,
            });
            swissBase.transitNatalAspects = tn.major;
            swissBase.transitNatalMinorAspects = tn.minor.length > 0 ? tn.minor : undefined;
          }
        }

        if (!cancelled) {
          setSwissChartWheelData(swissBase);
          setSwissBusy(false);
          setSwissError(null);
          swissLastSuccessInputKeyRef.current = swissChartWheelInputKey(
            chartWheelData,
            chartKind,
            mainstreamSettings.aspectPreset,
            mainstreamSettings.orbPreset,
          );
        }
      } catch (e) {
        if (!cancelled) {
          setSwissBusy(false);
          const formatted = formatSwissEphemerisError(e);
          if (typeof console !== "undefined" && console.warn) {
            console.warn("[瑞士星历] 计算失败", e);
          }
          setSwissError(formatted);
          const failKey = swissChartWheelInputKey(
            chartWheelData,
            chartKind,
            mainstreamSettings.aspectPreset,
            mainstreamSettings.orbPreset,
          );
          if (swissLastSuccessInputKeyRef.current !== failKey) {
            setSwissChartWheelData(null);
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    chartWheelData,
    chartKind,
    profileRow,
    mainstreamSettings.aspectPreset,
    mainstreamSettings.orbPreset,
    swissRetryNonce,
  ]);

  const onSwissRetry = useCallback(() => {
    resetSwissEphemerisClientForRetry();
    setSwissRetryNonce((n) => n + 1);
  }, []);

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

      const aspect = resolveChartAspectParams({
        aspectPreset: mainstreamSettings.aspectPreset,
        orbPreset: mainstreamSettings.orbPreset,
      });

      const [myPlanets, partnerPlanets, partnerWheel] = await Promise.all([
        computePlanetsLongitudesSwiss(myBirthUtc),
        computePlanetsLongitudesSwiss(partnerBirthUtc),
        computeAstroChartWheelDataSwiss({
          instantUtc: partnerBirthUtc,
          latitudeDeg: partnerProfile.latitude,
          longitudeDeg: partnerProfile.longitude,
          houseSystem: dossier.houseSystem,
          aspect,
        }),
      ]);

      const synTn = computeTransitNatalAspects(partnerPlanets, myPlanets, {
        majorOrbDeg: aspect.majorOrbDeg,
        minorOrbDeg: aspect.minorOrbDeg,
        maxMajor: 40,
        maxMinor: aspect.includeMinorAspects ? 36 : 0,
      });
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
          aspects: synTn.major,
          minorAspects: synTn.minor.length > 0 ? synTn.minor : undefined,
          majorOrbDeg: aspect.majorOrbDeg,
          minorOrbDeg: aspect.minorOrbDeg,
          partnerInMyHouses,
          myInPartnerHouses,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    chartKind,
    profileRow,
    partnerProfile,
    swissChartWheelData,
    dossier,
    dossier?.houseSystem,
    partnerName,
    mainstreamSettings.aspectPreset,
    mainstreamSettings.orbPreset,
  ]);

  /** 轮盘次要相位线：需同时打开开关且排盘为「主+次」，与读数区一致。 */
  const minorAspectLinesOnWheel = useMemo(
    () => showMinorAspectLines && mainstreamSettings.aspectPreset === "major_and_minor",
    [showMinorAspectLines, mainstreamSettings.aspectPreset],
  );

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

  const topicLabel = dossier ? TOPIC_OPTIONS.find((t) => t.id === dossier.topic)?.label ?? dossier.topic : "";
  const lensLabel = dossier ? LENS_OPTIONS.find((x) => x.id === dossier.lens)?.label ?? dossier.lens : "";

  const voiceStyleId = useMemo(() => {
    if (!swissChartWheelData) return 1 as ReturnType<typeof selectVoiceStyleIdZh>;
    return selectVoiceStyleIdZh({
      chartKind,
      houseSystem: swissChartWheelData.houseSystem,
      aspectPreset: mainstreamSettings.aspectPreset,
      orbPreset: mainstreamSettings.orbPreset,
      includeMinorAspects: swissChartWheelData.aspectMeta?.includeMinorAspects,
      majorOrbDeg: swissChartWheelData.aspectMeta?.majorOrbDeg,
      minorOrbDeg: swissChartWheelData.aspectMeta?.minorOrbDeg,
      instantUtcMs: swissChartWheelData.instantUtc.getTime(),
    });
  }, [
    chartKind,
    swissChartWheelData,
    mainstreamSettings.aspectPreset,
    mainstreamSettings.orbPreset,
  ]);

  const houseSystemWorkspaceUi = useMemo(() => houseSystemWorkspaceUiVocal(voiceStyleId), [voiceStyleId]);

  const spectralLineStyled = useMemo(
    () =>
      workspaceTodaySpectralLineVocal(
        { dayKey: getTodayKey(), calibration: dailyCalibration },
        voiceStyleId,
      ),
    [dailyCalibration, voiceStyleId],
  );

  const decodeSurface = WORKSPACE_DECODE_SURFACE_ZH[chartKind];
  const decodeSurfaceStyled = useMemo(
    () => workspaceDecodeSurfaceVocal(chartKind, voiceStyleId),
    [chartKind, voiceStyleId],
  );

  const coreZones = useMemo(() => workspaceCoreZonesForChartKind(chartKind), [chartKind]);

  const natalReadingOpts = useMemo(() => {
    const dateLine = getTodayKey().replace(/-/g, ".");
    return {
      dateLine,
      showCaseLine: true as const,
      sunHouse: natalReadingHouses?.sunHouse,
      moonHouse: natalReadingHouses?.moonHouse,
      houseSystemZh: dossier ? houseSystemLabelZh(dossier.houseSystem) : undefined,
      readingLens: dossier.lens,
    };
  }, [natalReadingHouses, dossier]);

  const readingMd = useMemo(() => {
    if (!big3) return "";
    if (readingDepth === "short") return buildAstroWorkspaceUnderstandMarkdown(big3, natalReadingOpts);
    if (readingDepth === "compact") return buildNatalReadingCompactMarkdown(big3, natalReadingOpts);
    return buildNatalReadingFullMarkdown(big3, natalReadingOpts);
  }, [big3, readingDepth, natalReadingOpts]);
  const readingMdStyled = useMemo(
    () => workspaceReadingMarkdownVocal(readingMd, voiceStyleId),
    [readingMd, voiceStyleId],
  );

  const chartDataCardSubtitleStyled = useMemo(
    () =>
      chartDataCardSubtitleVocal(
        chartKind,
        {
          houseSystemZh: dossier ? houseSystemLabelZh(dossier.houseSystem) : null,
          includeMinorAspects: mainstreamSettings.aspectPreset === "major_and_minor",
        },
        voiceStyleId,
      ),
    [chartKind, mainstreamSettings.aspectPreset, dossier, voiceStyleId],
  );

  const chartWheelCardSubtitleStyled = useMemo(
    () =>
      chartWheelCardSubtitleVocal(
        chartKind,
        {
          houseSystemZh: dossier ? houseSystemLabelZh(dossier.houseSystem) : null,
          includeMinorAspects: mainstreamSettings.aspectPreset === "major_and_minor",
        },
        voiceStyleId,
      ),
    [chartKind, mainstreamSettings.aspectPreset, dossier, voiceStyleId],
  );

  const persistStore = useCallback(
    (next: AstroDossierStore) => {
      saveAstroDossierStore(next);
      setStore(next);
    },
    [setStore],
  );

  const patchDossier = useCallback(
    (patch: Partial<AstroDossier>) => {
      persistStore(updateActiveDossier(store, patch));
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

  const onAspectPresetChange = useCallback((aspectPreset: AspectPresetId) => {
    setMainstreamSettings((prev) => ({ ...prev, aspectPreset }));
  }, []);

  const onOrbPresetChange = useCallback((orbPreset: OrbPresetId) => {
    setMainstreamSettings((prev) => ({ ...prev, orbPreset }));
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
    const raw = window.localStorage.getItem(activePartnerStorageKey);
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
  }, [activePartnerStorageKey, partnerName, relationName, selfName]);

  const onExportReading = useCallback(async () => {
    if (!big3 || !readingMd) return;
    const metaLines = [
      `导出时间：${new Date().toLocaleString("zh-CN")}`,
      `盘面：${CHART_KIND_OPTIONS.find((x) => x.id === chartKind)?.label ?? chartKind}`,
      `宫位制：${houseSystemLabelZh(dossier.houseSystem)}`,
      `相位：${ASPECT_PRESET_OPTIONS.find((x) => x.id === mainstreamSettings.aspectPreset)?.label ?? mainstreamSettings.aspectPreset}`,
      `容许度：${ORB_PRESET_OPTIONS.find((x) => x.id === mainstreamSettings.orbPreset)?.label ?? mainstreamSettings.orbPreset}`,
    ];
    const lineZh = swissChartWheelData?.chartKindMeta?.lineZh;
    if (lineZh) metaLines.push(`盘面锚点：${lineZh}`);
    metaLines.push(`宫位读法：${houseSystemReadoutHintVocal(voiceStyleId, dossier.houseSystem)}`);
    metaLines.push(`阅读角度：${lensLabel || "—"}`);
    const meta = metaLines.join("\n");
    const guideMd = formatAstroViewCopyGuideMarkdownZh(astroViewCopyGuideVocal(chartKind, voiceStyleId));
    const payload = `${meta}\n\n---\n\n${guideMd}\n\n---\n\n${readingMdStyled}`;
    try {
      await navigator.clipboard.writeText(payload);
      setExportStatus("ok");
    } catch {
      setExportStatus("error");
    }
    window.setTimeout(() => setExportStatus("idle"), 1800);
  }, [
    big3,
    chartKind,
    dossier.houseSystem,
    lensLabel,
    mainstreamSettings.aspectPreset,
    mainstreamSettings.orbPreset,
    readingMd,
    readingMdStyled,
    swissChartWheelData,
    voiceStyleId,
  ]);

  useEffect(() => {
    if (!AUTO_REFRESH_KINDS.includes(chartKind)) return;
    setChartInstantRefreshKey((k) => k + 1);
  }, [chartKind]);

  const answerLayer = useMemo(
    () =>
      buildAnswerLayerRouting({
        chart: swissChartWheelData,
        topicDetail: dossier.topicDetail,
      }),
    [swissChartWheelData, dossier.topicDetail],
  );
  const transitRealtimeReport = useMemo(
    () =>
      chartKind === "transit"
        ? buildTransitRealtimeReport(swissChartWheelData, voiceStyleId)
        : null,
    [chartKind, swissChartWheelData, voiceStyleId],
  );

  const majorAspectReport = useMemo(
    () =>
      chartKindHasWheelTableObservation(chartKind)
        ? buildMajorAspectObservationReport(swissChartWheelData, chartKind, voiceStyleId)
        : null,
    [chartKind, swissChartWheelData, voiceStyleId],
  );
  const houseCuspReport = useMemo(
    () =>
      chartKindHasWheelTableObservation(chartKind)
        ? buildHouseCuspObservationReport(swissChartWheelData, chartKind, voiceStyleId)
        : null,
    [chartKind, swissChartWheelData, voiceStyleId],
  );
  const minorAspectReport = useMemo(
    () =>
      chartKindHasWheelTableObservation(chartKind)
        ? buildMinorAspectObservationReport(swissChartWheelData, chartKind, voiceStyleId)
        : null,
    [chartKind, swissChartWheelData, voiceStyleId],
  );
  const angleAspectReport = useMemo(
    () =>
      chartKindHasWheelTableObservation(chartKind)
        ? buildAngleAspectObservationReport(swissChartWheelData, chartKind, voiceStyleId)
        : null,
    [chartKind, swissChartWheelData, voiceStyleId],
  );
  const planetPositionsReport = useMemo(
    () =>
      chartKindHasWheelTableObservation(chartKind)
        ? buildPlanetPositionsObservationReport(swissChartWheelData, chartKind, voiceStyleId)
        : null,
    [chartKind, swissChartWheelData, voiceStyleId],
  );
  const stressItems = answerLayer.items;

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
  const axisInterpretation = useMemo(
    () =>
      chartKindHasWheelTableObservation(chartKind)
        ? buildAxisInterpretationZh(swissChartWheelData, chartKind, voiceStyleId)
        : null,
    [chartKind, swissChartWheelData, voiceStyleId],
  );

  const switchZone = (zone: CoreZoneId) => {
    setActiveZone(zone);
    setZoneFxKey((k) => k + 1);
    if (zone === "origin") setOriginPulseKey((k) => k + 1);
    const target = coreZones.find((z) => z.id === zone)?.anchorId;
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
        <header className="mb-4 grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2 border-b border-white/[0.07] pb-4 pt-1.5 sm:gap-3">
          <Link
            href="/hub"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#B8942E]/35 px-2.5 py-2 text-xs text-[#C8A85C] transition-colors hover:border-[#C5A059]/45"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            返回
          </Link>
          <div className="min-w-0 text-center">
            <h1
              className={`${UI_SCALE.pageTitle} font-bold tracking-[0.08em] text-[#D4C48A]`}
              style={{ fontFamily: SERIF_ZH }}
            >
              占星工作台
            </h1>
            <p className="mt-1 text-sm font-medium tracking-[0.08em] text-zinc-400/95 sm:text-base">
              以主流口径立根，以中文语境通神。
            </p>
          </div>
          {store.dossiers.length > 1 ? (
            <div className="min-w-0 max-w-[9.5rem] justify-self-end sm:max-w-[11rem]">
              <label className="sr-only" htmlFor="astro-header-dossier-select">
                切换案卷
              </label>
              <select
                id="astro-header-dossier-select"
                className="w-full truncate rounded-lg border border-white/[0.1] bg-black/35 px-2 py-2 text-[11px] text-zinc-300 outline-none focus:border-[#C5A059]/35 sm:text-xs"
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
          ) : (
            <span className="w-0 shrink-0" aria-hidden />
          )}
        </header>

        <div className="sticky top-0 z-30 -mx-3 border-b border-white/[0.06] bg-[#0A0A1F]/92 px-3 py-2 backdrop-blur-md sm:-mx-4 sm:px-4 md:-mx-6 md:px-6 lg:-mx-6">
          <div
            ref={zoneTabsScrollRef}
            onWheelCapture={onZoneTabsWheel}
            title="可水平滚动（鼠标/触控板向左/向右）"
            className="flex w-full min-w-0 gap-2 overflow-x-auto pb-1 font-sans [-ms-overflow-style:auto] [scrollbar-width:thin] sm:gap-3 md:overflow-visible [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-white/[0.18] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
          >
            {coreZones.map((zone) => {
              const active = activeZone === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => switchZone(zone.id)}
                  className={`group flex min-w-[8.75rem] shrink-0 flex-col rounded-xl border px-3 py-2.5 text-left transition-all duration-300 md:min-w-0 md:flex-1 md:basis-0 ${
                    active
                      ? "border-[#C5A059]/55 bg-[#C5A059]/10 opacity-100 shadow-[0_0_12px_rgba(197,160,89,0.22)]"
                      : "border-white/[0.12] bg-transparent opacity-85 hover:border-[#C5A059]/35 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`${UI_SCALE.zoneTitle} transition-colors ${active ? "text-[#E8D4A8]" : "group-hover:text-zinc-200"}`}
                  >
                    {zone.title}
                  </div>
                  <div className={`mt-0.5 max-w-[20rem] leading-snug md:max-w-none ${UI_SCALE.zoneCopy}`}>
                    {zone.copy}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-1">
            <p className={UI_SCALE.zoneHint}>
              轮盘与星盘数据表在下方始终可见，与顶部三档是否高亮无关。三档用于滚动定位：「初始参数」管档案与排盘设置；「实相观测」锚到轮盘与数据卡；「灵识解构」锚到解读与读数分层。改生日、宫位制等请切「初始参数」。
            </p>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex w-full min-w-0 flex-col gap-1 rounded-lg border border-white/[0.1] bg-black/20 px-3 py-2.5">
            <div className="text-sm text-zinc-400">
              <span className="font-medium text-zinc-300">盘面类型与时刻选项</span>
            </div>
            <div className="text-[12px] text-zinc-600">
              当前：{CHART_KIND_OPTIONS.find((x) => x.id === chartKind)?.label ?? chartKind}
            </div>
          </div>

          <motion.div className="mt-2 space-y-2" initial={false}>
            <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full min-w-0 gap-3.5 overflow-x-auto pb-1 font-sans [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
              <button
                type="button"
                onClick={onRefreshNow}
                className="shrink-0 rounded-lg border border-[#C5A059]/45 px-3 py-2 text-sm font-medium tracking-[0.08em] text-[#D4C48A] transition-colors hover:border-[#C5A059]/70"
                title="强制重算当前盘面与时刻"
              >
                立即重算
              </button>
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
        </div>

        <motion.main
          key={zoneFxKey}
          className="mt-4 w-full min-w-0 space-y-4 pb-10"
          initial={{ opacity: 0.76, filter: "blur(8px)", scale: 1.018 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* 勿在「灵识解构」下整段隐藏：否则用户切到解读区会看不到轮盘与宫位数据表 */}
          <div className="w-full min-w-0 space-y-4">
            {activeZone === "origin" && chartKind === "synastry" ? (
              <div className="scroll-mt-24">
                <div className="mt-2 rounded-lg border border-white/[0.1] bg-black/20 px-3 py-2.5">
                  <div className="mb-2 text-sm font-medium text-zinc-300">合盘称呼与关系名</div>
                  <div className="mb-2.5">
                    <p className="mb-2 text-xs text-zinc-500">对象档位（独立存储）</p>
                    <div className="flex flex-wrap gap-2">
                      {PARTNER_SLOTS.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setActivePartnerSlot(slot.id)}
                          className={`rounded-lg border px-2.5 py-1.5 text-xs tracking-[0.08em] transition-colors ${
                            activePartnerSlot === slot.id
                              ? "border-[#C5A059]/70 bg-[#C5A059]/12 text-[#D4C48A]"
                              : "border-white/[0.12] text-zinc-400 hover:border-[#C5A059]/35 hover:text-zinc-300"
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>
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
              </div>
            ) : null}
            <div id="section-chart-birth" className={`scroll-mt-24 ${activeZone === "origin" ? "" : "hidden"}`}>
              <BCard deboxed title="出生档案" subtitle="与首页身份金卡同档；解锁后即可稳定生成各类盘面。">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap font-sans text-sm tracking-wide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                foldable
                foldOpen={settingsOpen}
                onFoldToggle={() => setSettingsOpen((o) => !o)}
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
                    <p className="mb-2 text-sm font-medium text-zinc-300">{houseSystemWorkspaceUi.sectionTitle}</p>
                    <OptionPills
                      ariaLabel={houseSystemWorkspaceUi.ariaCommon}
                      value={dossier.houseSystem}
                      onChange={onHouseSystemChange}
                      options={HOUSE_SYSTEM_OPTIONS_COMMON}
                      containerClassName="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4"
                      fullWidthPills
                    />
                    {!houseSystemMoreOpen && HOUSE_SYSTEM_MORE_IDS.has(dossier.houseSystem) ? (
                      <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
                        {houseSystemWorkspaceUi.moreListPrefix}
                        <span className="font-medium text-[#D4C48A]">{houseSystemLabelZh(dossier.houseSystem)}</span>
                        {houseSystemWorkspaceUi.moreListSuffix}
                        <button
                          type="button"
                          onClick={() => setHouseSystemMoreOpen(true)}
                          className="ml-2 border-b border-[#C5A059]/50 pb-px text-[13px] font-medium tracking-[0.06em] text-[#D4C48A] transition-colors hover:border-[#C5A059] hover:text-[#E8D4A8]"
                        >
                          {houseSystemWorkspaceUi.expandMoreLink}
                        </button>
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setHouseSystemMoreOpen((o) => !o)}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-black/25 py-2.5 text-[13px] font-medium tracking-[0.12em] text-zinc-400 transition-colors hover:border-[#C5A059]/35 hover:text-[#D4C48A] sm:w-auto sm:px-5"
                      aria-expanded={houseSystemMoreOpen}
                    >
                      {houseSystemMoreOpen ? houseSystemWorkspaceUi.collapseMoreBar : houseSystemWorkspaceUi.expandMoreBar}
                    </button>
                    {houseSystemMoreOpen ? (
                      <div className="mt-3 border-t border-white/[0.08] pt-3">
                        <p className="mb-2 text-[12px] font-medium tracking-[0.14em] text-zinc-500">
                          {houseSystemWorkspaceUi.moreHeading}
                        </p>
                        <div className="max-h-[min(380px,50vh)] overflow-y-auto overscroll-y-contain rounded-md pr-1 [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(197,160,89,0.35)_transparent] [scrollbar-width:thin]">
                          <OptionPills
                            ariaLabel={houseSystemWorkspaceUi.ariaMore}
                            value={dossier.houseSystem}
                            onChange={onHouseSystemChange}
                            options={HOUSE_SYSTEM_OPTIONS_MORE}
                            containerClassName="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4"
                            fullWidthPills
                          />
                        </div>
                      </div>
                    ) : null}
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
                  <div>
                    <p className="mb-2 text-sm font-medium text-zinc-300">相位集（盘内、轴点、行运×本命、合盘共用）</p>
                    <OptionPills
                      ariaLabel="相位集"
                      value={mainstreamSettings.aspectPreset}
                      onChange={onAspectPresetChange}
                      options={ASPECT_PRESET_OPTIONS}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-zinc-300">容许度（主相位 / 次要相位共用一对数值）</p>
                    <OptionPills
                      ariaLabel="容许度预设"
                      value={mainstreamSettings.orbPreset}
                      onChange={onOrbPresetChange}
                      options={ORB_PRESET_OPTIONS}
                    />
                  </div>
                </div>
              </BCard>
            </div>

            <div id="section-chart-synastry-profile" className={`scroll-mt-24 ${activeZone === "origin" && chartKind === "synastry" ? "" : "hidden"}`}>
              <BCard
                deboxed
                title="合盘对象（对象B）"
                subtitle="合盘不贴标签，而是识别关系结构中的引力、阻力与成长路径。"
                foldable
                foldOpen={synastryProfileOpen}
                onFoldToggle={() => setSynastryProfileOpen((o) => !o)}
              >
                <HomeIdentityGoldBlock
                  layoutVariant="embedded"
                  withEnergyHeader={false}
                  className="min-w-0 px-1 sm:px-2"
                  onUnlockPersistSuccess={onPartnerProfileSaved}
                  useSwissEphemeris={true}
                  preferFormWhenProfileExists={true}
                  profileStorageKey={activePartnerStorageKey}
                  notifyProfileChange={false}
                />
              </BCard>
            </div>

            <div className={wheelDataRowClass}>
              <div id="section-chart-wheel" className="min-w-0 scroll-mt-24">
                      <BCard compact title="轮盘" subtitle={chartWheelCardSubtitleStyled} className="p-2 sm:p-4">
                  {swissChartWheelData ? (
                    <div className="mb-3 rounded-md border border-white/[0.08] bg-black/20 px-3 py-2 font-sans">
                      <div className="flex min-w-0 flex-wrap gap-x-4 gap-y-2">
                        <button
                          type="button"
                          onClick={() => setShowAspectLines((v) => !v)}
                          className={`bg-transparent px-0 pb-1 text-[13px] tracking-wide transition-colors ${
                            showAspectLines
                              ? "border-b-[0.3px] border-[#C5A059] text-[#C5A059]"
                              : "border-b-[0.3px] border-transparent text-zinc-500 hover:border-[#C5A059]/35 hover:text-zinc-400"
                          }`}
                        >
                          相位线
                        </button>
                        <button
                          type="button"
                          disabled={!showAspectLines || mainstreamSettings.aspectPreset === "major_only"}
                          onClick={() => setShowMinorAspectLines((v) => !v)}
                          className={`bg-transparent px-0 pb-1 text-[13px] tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                            minorAspectLinesOnWheel
                              ? "border-b-[0.3px] border-[#C5A059] text-[#C5A059]"
                              : "border-b-[0.3px] border-transparent text-zinc-500 hover:border-[#C5A059]/35 hover:text-zinc-400"
                          }`}
                          title={
                            !showAspectLines
                              ? "请先开启相位线"
                              : mainstreamSettings.aspectPreset === "major_only"
                                ? "相位集为「仅主相位」时轮盘不绘制次要相位线（与读数区一致）"
                                : undefined
                          }
                        >
                          次要相位线
                        </button>
                        <button
                          type="button"
                          disabled={!showAspectLines}
                          onClick={() => setShowAngleAspectLines((v) => !v)}
                          className={`bg-transparent px-0 pb-1 text-[13px] tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                            showAngleAspectLines
                              ? "border-b-[0.3px] border-[#C5A059] text-[#C5A059]"
                              : "border-b-[0.3px] border-transparent text-zinc-500 hover:border-[#C5A059]/35 hover:text-zinc-400"
                          }`}
                          title={
                            !showAspectLines
                              ? "请先开启相位线"
                              : mainstreamSettings.aspectPreset === "major_only"
                                ? "仅主相位时轮盘不绘轴点次要相位；行星↔上升/天顶的主相位仍会显示"
                                : undefined
                          }
                        >
                          轴点相位线
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowOuterBodies((v) => !v)}
                          className={`bg-transparent px-0 pb-1 text-[13px] tracking-wide transition-colors ${
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
                          className={`bg-transparent px-0 pb-1 text-[13px] tracking-wide transition-colors ${
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
                          className={`bg-transparent px-0 pb-1 text-[13px] tracking-wide transition-colors ${
                            showAllBodies
                              ? "border-b-[0.3px] border-[#C5A059] text-[#C5A059]"
                              : "border-b-[0.3px] border-transparent text-zinc-500 hover:border-[#C5A059]/35 hover:text-zinc-400"
                          }`}
                        >
                          全盘高亮
                        </button>
                      </div>
                    </div>
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
                          <div className="mx-auto aspect-square w-full min-w-0 max-w-[min(100vw,100%)] overflow-x-visible sm:max-w-[min(98vw,100%)] xl:max-w-[min(100%,min(96vw,96vh))]">
                            <ChartWheelPlaceholder
                              monoClassName="font-mono tabular-nums"
                              highlightSkeleton={!showAllBodies}
                              showAspectLines={showAspectLines}
                              showMinorAspectLines={minorAspectLinesOnWheel}
                              showAngleAspectLines={showAngleAspectLines}
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

                  {swissChartWheelData && axisInlineRows.length > 0 ? (
                    <div className="mt-2 rounded-md border border-white/[0.08] bg-black/25 px-3 py-2.5 font-sans">
                      <div className="mb-1.5 text-[11px] font-medium tracking-[0.12em] text-zinc-500">轴线定位</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                        {axisInlineRows.map((r) => (
                          <div key={r.k} className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                            <span className="shrink-0 text-[12px] text-zinc-500">{r.k}</span>
                            <span className="font-mono text-[12px] tabular-nums leading-snug text-zinc-300 sm:text-[13px]">
                              {r.text}
                            </span>
                          </div>
                        ))}
                      </div>
                      {axisInterpretation ? (
                        <div className="mt-2 border-t border-white/[0.06] pt-2 text-[11px] leading-relaxed text-zinc-400">
                          <p className="text-zinc-500">常规解读：{axisInterpretation.regular}</p>
                          <p className="mt-1.5 text-zinc-500">专业解读：{axisInterpretation.professional}</p>
                        </div>
                      ) : (
                        <p className="mt-2 border-t border-white/[0.06] pt-2 text-[11px] leading-relaxed text-zinc-500">
                          四轴是读数；含义、宫头与相位解读在下方「星盘数据」各张表里（每表下有【核心快照】起头的说明）。
                        </p>
                      )}
                    </div>
                  ) : null}

                  {chartWheelData && swissError ? (
                    <div className="mt-4">
                      <SwissEphemerisErrorCallout display={swissError} compact onRetry={onSwissRetry} />
                      {swissChartWheelData ? (
                        <p className="mt-2 text-[11px] text-zinc-500">已保留上次可用盘面数据；可继续查看并稍后重算。</p>
                      ) : null}
                    </div>
                  ) : null}
                  {chartWheelData && swissBusy && !swissChartWheelData ? (
                    <p className="mt-4 text-xs leading-relaxed text-zinc-400">正在从瑞士星历生成轮盘…</p>
                  ) : null}
                  {!chartWheelData ? (
                    <p className="mt-4 text-xs leading-relaxed text-zinc-500">录入并解锁档案后，这里会显示轮盘与数据表。</p>
                  ) : null}

                  {swissChartWheelData ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setWheelExtrasOpen((o) => !o)}
                        className="mt-3 flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-left text-[12px] text-zinc-400 transition-colors hover:border-[#C5A059]/22"
                        aria-expanded={wheelExtrasOpen}
                      >
                        <span>{wheelExtrasOpen ? "收起" : "展开"}盘面说明与显示开关</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${wheelExtrasOpen ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {wheelExtrasOpen ? (
                        <div className="mt-3 space-y-3">
                          {swissChartWheelData.chartKindMeta?.lineZh ? (
                            <p className="font-sans text-[12px] leading-relaxed text-zinc-500 sm:text-[13px]">
                              {swissChartWheelData.chartKindMeta.lineZh}
                            </p>
                          ) : null}
                          <p className="font-sans text-[12px] leading-relaxed text-zinc-500">
                            显示开关已移到轮盘上方横条，便于边看边调。
                          </p>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </BCard>
              </div>

              <div
                id="section-chart-data"
                className="min-w-0 scroll-mt-24"
              >
                <BCard
                  title={CHART_DATA_CARD_TITLE_ZH[chartKind]}
                  subtitle={chartDataCardSubtitleStyled}
                  className="xl:min-w-[420px]"
                  foldable
                  foldOpen={chartDataOpen}
                  onFoldToggle={() => setChartDataOpen((o) => !o)}
                >
                  {swissChartWheelData ? (
                    <div className="max-h-[min(86vh,980px)] overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch]">
                      {swissError ? (
                        <div className="mb-3">
                          <SwissEphemerisErrorCallout display={swissError} compact onRetry={onSwissRetry} />
                          <p className="mt-2 text-[11px] text-zinc-500">当前表格为上次可用结果。</p>
                        </div>
                      ) : null}
                      <AstroChartReadout
                        key={chartKind}
                        data={swissChartWheelData}
                        synastry={chartKind === "synastry" ? synastryData : null}
                        omitOuterSummary
                        className="!mx-auto !w-full !max-w-[960px] !border-0 !bg-transparent !p-0 !shadow-none"
                        natalInlineReports={
                          chartKindHasWheelTableObservation(chartKind) &&
                          (planetPositionsReport ||
                            majorAspectReport ||
                            houseCuspReport ||
                            minorAspectReport ||
                            angleAspectReport)
                            ? {
                                planetPositionsReport,
                                majorAspectReport,
                                houseCuspReport,
                                minorAspectReport,
                                angleAspectReport,
                                panelTitles: OBSERVATION_PANEL_TITLES_ZH[chartKind],
                              }
                            : null
                        }
                      />
                    </div>
                  ) : chartWheelData && swissError ? (
                    <SwissEphemerisErrorCallout display={swissError} onRetry={onSwissRetry} />
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
            className={`w-full min-w-0 space-y-8 lg:space-y-10 ${activeZone === "origin" ? "hidden" : ""}`}
          >
              <div id="read-section-prefs" className="scroll-mt-24">
                {activeZone === "decoding" ? (
                  <section className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setDecodePrefsOpen((o) => !o)}
                      className="flex w-full min-w-0 items-center justify-between text-left"
                      aria-expanded={decodePrefsOpen}
                    >
                      <h2 className="text-[12px] font-medium uppercase tracking-[0.2em] text-zinc-500">解读校准</h2>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-zinc-600 transition-transform ${decodePrefsOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                    {decodePrefsOpen ? (
                      <>
                        <ul className="space-y-2 text-sm leading-relaxed text-zinc-300">
                          <li>
                            <span className="mr-2 text-zinc-600">关注话题：</span>
                            {topicLabel || "自我认识"}
                          </li>
                          <li>
                            <span className="mr-2 text-zinc-600">阅读角度：</span>
                            {lensLabel || "时间主星"}
                          </li>
                          <li>
                            <span className="mr-2 text-zinc-600">议题补充：</span>
                            {dossier.topicDetail.trim() || "围绕本次读盘目标给出可执行建议。"}
                          </li>
                        </ul>
                      </>
                    ) : null}
                  </section>
                ) : null}
              </div>

              <div id="read-section-today" className="scroll-mt-24">
                {activeZone === "reality" ? (
                  <BCard
                    title="今日参考"
                    subtitle={decodeSurfaceStyled.todayRefSubtitle}
                    foldable
                    foldOpen={todayRefOpen}
                    onFoldToggle={() => setTodayRefOpen((o) => !o)}
                  >
                    <p className="text-sm leading-relaxed text-zinc-400">{spectralLineStyled}</p>
                  </BCard>
                ) : null}
              </div>

              {activeZone === "decoding" ? (
                <div className="grid min-w-0 gap-12 xl:grid-cols-[minmax(0,1fr)_450px] xl:items-start xl:gap-14">
                  <div id="read-section-text" className="scroll-mt-24 min-w-0">
                    <section className="space-y-4">
                      <button
                        type="button"
                        onClick={() => setDecodeInterpretOpen((o) => !o)}
                        className="flex w-full min-w-0 items-center justify-between text-left"
                        aria-expanded={decodeInterpretOpen}
                      >
                        <div className="min-w-0">
                          <h2 className="text-[22px] font-semibold tracking-[0.06em] text-zinc-100" style={{ fontFamily: SERIF_ZH }}>
                            结构解读
                          </h2>
                          <p className="mt-1 text-sm leading-relaxed text-zinc-500">{decodeSurfaceStyled.structureDecodeSubtitle}</p>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-zinc-600 transition-transform ${decodeInterpretOpen ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {decodeInterpretOpen ? (
                        <>
                          <section className="space-y-4">
                            <h3 className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">解读深度</h3>
                            <p className="max-w-xl text-xs leading-relaxed text-zinc-500">
                              同一套语料，三种篇幅；默认先读短卡，再进入精简或全文。{decodeSurfaceStyled.decodeDepthLead}
                            </p>
                            <div className="flex flex-wrap items-end gap-x-1 gap-y-1">
                              {READING_DEPTH_OPTIONS.map((opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => setReadingDepth(opt.id)}
                                  className={`rounded-none border-0 border-b-2 bg-transparent px-2 py-1 text-[13px] font-medium tracking-[0.14em] transition-colors ${
                                    readingDepth === opt.id
                                      ? "border-[#C5A059]/75 text-[#E8D4A8]"
                                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                            <p className="max-w-xl text-[11px] leading-relaxed text-zinc-600">
                              {READING_DEPTH_OPTIONS.find((o) => o.id === readingDepth)?.subtitle}
                            </p>
                            <p className="max-w-xl text-[11px] leading-relaxed text-zinc-600/90">
                              {astroViewCopyGuideVocal(chartKind, voiceStyleId).anchor}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <button
                                type="button"
                                onClick={onExportReading}
                                disabled={!big3}
                                className="border-0 bg-transparent text-xs tracking-[0.14em] text-[#C5A059] underline decoration-[#C5A059]/40 underline-offset-4 transition-colors hover:text-[#E8D4A8] hover:decoration-[#C5A059]/70 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40"
                              >
                                复制当前解读
                              </button>
                              {exportStatus === "ok" ? <span className="text-xs text-emerald-400/90">已复制到剪贴板</span> : null}
                              {exportStatus === "error" ? <span className="text-xs text-rose-300/90">复制失败，请检查浏览器权限</span> : null}
                            </div>
                          </section>

                          <section className="space-y-5 pt-8">
                            <h3 className="text-lg font-medium tracking-[0.08em] text-zinc-100 sm:text-xl">
                              {readingDepth === "short"
                                ? "解读（短卡）"
                                : readingDepth === "compact"
                                  ? "解读（精简）"
                                  : "解读（全文）"}
                            </h3>
                            <p className="max-w-xl text-xs leading-relaxed text-zinc-500">
                              {readingDepth === "short"
                                ? "首段摘录：用于快速建立方向。"
                                : readingDepth === "compact"
                                  ? "精简组装：用于中等深度复核。"
                                  : "完整长读：用于完整判读与归档。"}
                            </p>
                            {big3 ? (
                              <div
                                className="relative min-w-0 max-w-[52rem] px-0 py-7"
                                style={{
                                  fontFamily: SERIF_ZH,
                                  background:
                                    "radial-gradient(ellipse 85% 55% at 50% 0%, rgba(197, 160, 89, 0.09) 0%, transparent 58%)",
                                }}
                              >
                                <NatalReadingMarkdown
                                  source={readingMdStyled}
                                  className="astro-workspace-reading text-[15px] leading-[1.78] text-zinc-200/95 sm:text-base sm:leading-[1.85]"
                                />
                              </div>
                            ) : (
                              <p className="text-sm text-zinc-500">载入档案后显示。</p>
                            )}
                          </section>
                        </>
                      ) : null}
                    </section>
                  </div>

                  <aside className="min-w-0 space-y-10 xl:sticky xl:top-28 xl:self-start">
                    <div id="read-section-big3" className="scroll-mt-24 space-y-3">
                      <button
                        type="button"
                        onClick={() => setDecodeBig3Open((o) => !o)}
                        className="flex w-full min-w-0 items-center justify-between text-left"
                        aria-expanded={decodeBig3Open}
                      >
                        <h3 className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#C8A85C]">{decodeSurface.big3Title}</h3>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-zinc-600 transition-transform ${decodeBig3Open ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {decodeBig3Open ? (
                        <>
                          <p className="text-[12px] leading-relaxed text-zinc-500">{decodeSurfaceStyled.big3Subtitle}</p>
                          {big3 ? (
                            <div className="text-sm leading-relaxed text-zinc-300" style={{ fontFamily: SERIF_ZH }}>
                              <Big3Narrative big3={big3} />
                            </div>
                          ) : (
                            <p className="text-sm text-zinc-500">请先在上方「出生档案」里录入并解锁。</p>
                          )}
                          <dl className="space-y-1 text-[12px] leading-relaxed text-zinc-400">
                            <div className="flex items-start justify-between gap-3">
                              <dt className="text-zinc-600">宫位制</dt>
                              <dd className="text-right text-zinc-300">{houseSystemLabelZh(dossier.houseSystem)}</dd>
                            </div>
                            <div className="flex items-start justify-between gap-3">
                              <dt className="text-zinc-600">当前盘面</dt>
                              <dd className="text-right text-zinc-300">{CHART_KIND_OPTIONS.find((x) => x.id === chartKind)?.label ?? chartKind}</dd>
                            </div>
                            <div className="flex items-start justify-between gap-3">
                              <dt className="text-zinc-600">相位集</dt>
                              <dd className="text-right text-zinc-300">
                                {ASPECT_PRESET_OPTIONS.find((x) => x.id === mainstreamSettings.aspectPreset)?.label ??
                                  mainstreamSettings.aspectPreset}
                              </dd>
                            </div>
                            <div className="flex items-start justify-between gap-3">
                              <dt className="text-zinc-600">容许度</dt>
                              <dd className="text-right text-zinc-300">
                                {ORB_PRESET_OPTIONS.find((x) => x.id === mainstreamSettings.orbPreset)?.label ?? mainstreamSettings.orbPreset}
                              </dd>
                            </div>
                          </dl>
                        </>
                      ) : null}
                    </div>

                    <div id="read-section-rhythm" className="scroll-mt-24 space-y-3">
                      <button
                        type="button"
                        onClick={() => setDecodeRhythmOpen((o) => !o)}
                        className="flex w-full min-w-0 items-center justify-between text-left"
                        aria-expanded={decodeRhythmOpen}
                      >
                        <h3 className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#C8A85C]">读数分层</h3>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-zinc-600 transition-transform ${decodeRhythmOpen ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {decodeRhythmOpen ? (
                        <>
                          <p className="text-[12px] leading-relaxed text-zinc-500">{decodeSurfaceStyled.rhythmLayerSubtitle}</p>
                          {chartKind === "transit" && transitRealtimeReport ? (
                            <div className="space-y-2 text-sm leading-relaxed text-zinc-300">
                              <p className="text-xs text-zinc-500">{transitRealtimeReport.statusLine}</p>
                              <p>【核心快照】{transitRealtimeReport.answer.happened}</p>
                              <p className="text-zinc-400">{transitRealtimeReport.answer.today}</p>
                            </div>
                          ) : chartKindHasWheelTableObservation(chartKind) ? (
                            <div className="space-y-2">
                              <p className="text-sm leading-relaxed text-zinc-400">{decodeSurfaceStyled.readoutLayerBlurb}</p>
                              {planetPositionsReport ? (
                                <p className="text-sm leading-relaxed text-zinc-300">{planetPositionsReport.answer.happened}</p>
                              ) : (
                                <p className="text-[12px] leading-snug text-zinc-600">星盘数据就绪后，此处会摘录行星位置观测报告要点。</p>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm leading-relaxed text-zinc-300">{answerLayer.humanSummary}</p>
                              {stressItems.slice(0, 2).map((s) => (
                                <p key={s.label} className="text-sm leading-relaxed text-zinc-400">
                                  <span className="text-zinc-500">{s.label}：</span>
                                  {s.body}
                                </p>
                              ))}
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  </aside>
                </div>
              ) : null}
            </motion.div>

        </motion.main>
      </div>
    </div>
  );
}

