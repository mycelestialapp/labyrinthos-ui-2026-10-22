"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type {
  AstroChartWheelData,
  AstroAngleAspectDatum,
  AstroAspectDatum,
  AstroTransitNatalAspectDatum,
  AspectType,
} from "@/lib/astro-chart-wheel";
import { aspectTypeLabelZh } from "@/lib/astro-aspect-type-label-zh";
import {
  PLANET_GLYPH,
  PLANET_NAME_ZH,
  houseNumberForLongitude,
  formatLongitudeInSignZh,
  axisLabelZh,
  houseSystemLabelZh,
  isMajorAspectType,
} from "@/lib/astro-chart-wheel";
import type { NatalObservationReportsStackProps } from "@/components/astro/NatalObservationReportsStack";
import {
  NatalAngleAspectReportPanel,
  NatalHouseCuspReportPanel,
  NatalMajorAspectReportPanel,
  NatalMinorAspectReportPanel,
  NatalObservationReportInlineBlock,
  NatalPlanetPositionsReportPanel,
} from "@/components/astro/natal-observation-report-panels";
import { chartKindFromWheelMeta, READOUT_VIEW_TAB_LABELS_ZH } from "@/lib/astro-eight-chart-view-copy-zh";
import type { ChartKindId } from "@/lib/astro-chart-kinds";
import { houseSystemReadoutHintVocal } from "@/lib/astro-house-system-hint-voice-zh";
import {
  chartReadoutSynthesisBodyVocal,
  readoutEmptyAngleMajorVocal,
  readoutEmptyAngleMinorVocal,
  readoutEmptyMajorAspectsVocal,
  readoutEmptySynastryMajorVocal,
  readoutPanelContextVocal,
  transitNatalMajorNarrativeVocal,
} from "@/lib/astro-readout-panel-voice-zh";
import { selectVoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { AstroViewCopyGuide } from "@/components/astro/AstroViewCopyGuide";

function normLon(d: number): string {
  const x = ((d % 360) + 360) % 360;
  return `${x.toFixed(2)}°`;
}

/** 金 = 区块标题；青灰 = 宫位列；data = 表内正文 */
const R = {
  title: "text-[#B8944A]",
  titleHover: "hover:text-[#C5A060]",
  key: "text-[#B8944A]",
  glyph: "text-[#B8944A]",
  house: "text-[#5F8794]",
  data: "text-zinc-400",
  sep: "text-zinc-500",
  meta: "text-zinc-500",
  /** 相位列表整行：与占星工作台主正文一致的灰白（勿用 mono 排中文，否则会偏黄褐） */
  aspectRow: "text-zinc-300 font-sans antialiased",
  borderGold: "border-[#C5A059]/18",
} as const;

const GLYPH_STYLE: React.CSSProperties = {
  fontFamily: "Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, STIX Two Math, sans-serif",
};

/** 相位徽标：主相位按和谐/张力分色，次要相位统一冷紫灰 */
function aspectBadgeClass(t: AspectType): string {
  switch (t) {
    case "conjunction":
      return "border-amber-500/25 bg-amber-950/45 text-[#E8D4A8]";
    case "sextile":
    case "trine":
      return "border-emerald-600/25 bg-emerald-950/40 text-emerald-100/90";
    case "square":
    case "opposition":
      return "border-rose-500/22 bg-rose-950/35 text-rose-100/88";
    default:
      return "border-violet-500/20 bg-violet-950/35 text-violet-100/85";
  }
}

const aspectCardShell =
  "rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent px-3.5 py-3 shadow-[inset_0_1px_0_0_rgba(197,160,89,0.07)] transition-[border-color,box-shadow] duration-200 hover:border-[#C5A059]/22 hover:shadow-[inset_0_1px_0_0_rgba(197,160,89,0.12)]";

function OrbPill({ deg }: { deg: number }) {
  return (
    <span
      className="shrink-0 rounded-md border border-white/[0.06] bg-black/35 px-2 py-0.5 font-mono text-[11px] tabular-nums tracking-wide text-zinc-400"
      title="容许偏差"
    >
      ±{deg.toFixed(2)}°
    </span>
  );
}

function BodyPairAspectCard({ a }: { a: AstroAspectDatum }) {
  return (
    <div className={aspectCardShell}>
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex max-w-[100%] rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-[0.12em] ${aspectBadgeClass(a.type)}`}
        >
          {aspectTypeLabelZh(a.type)}
        </span>
        <OrbPill deg={a.orbDeg} />
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-snug text-zinc-200">
        <span className="inline-flex items-center gap-1">
          <span className="text-[#D4B87A]" style={GLYPH_STYLE}>
            {PLANET_GLYPH[a.a]}
          </span>
          <span className="text-zinc-200/95">{PLANET_NAME_ZH[a.a]}</span>
        </span>
        <span className="text-zinc-600 select-none" aria-hidden>
          —
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="text-[#D4B87A]" style={GLYPH_STYLE}>
            {PLANET_GLYPH[a.b]}
          </span>
          <span className="text-zinc-200/95">{PLANET_NAME_ZH[a.b]}</span>
        </span>
      </div>
    </div>
  );
}

function TransitNatalAspectCard({
  a,
  leftLabel = "行运",
  rightLabel = "本命",
}: {
  a: AstroTransitNatalAspectDatum;
  /** 左列星体旁小字（行运盘 / 合盘「对方」） */
  leftLabel?: string;
  /** 右列星体旁小字（本命 / 合盘「你」） */
  rightLabel?: string;
}) {
  return (
    <div className={aspectCardShell}>
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-[0.12em] ${aspectBadgeClass(a.type)}`}
        >
          {aspectTypeLabelZh(a.type)}
        </span>
        <OrbPill deg={a.orbDeg} />
      </div>
      <div className="flex flex-col gap-2 text-[14px] text-zinc-200">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-medium tracking-[0.14em] text-zinc-500">{leftLabel}</span>
          <span className="text-[#D4B87A]" style={GLYPH_STYLE}>
            {PLANET_GLYPH[a.transit]}
          </span>
          <span>{PLANET_NAME_ZH[a.transit]}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-medium tracking-[0.14em] text-zinc-500">{rightLabel}</span>
          <span className="text-[#D4B87A]" style={GLYPH_STYLE}>
            {PLANET_GLYPH[a.natal]}
          </span>
          <span>{PLANET_NAME_ZH[a.natal]}</span>
        </div>
      </div>
    </div>
  );
}

function SynastryHouseCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ planet: AstroTransitNatalAspectDatum["transit"]; house: number }>;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-[#C5A059]/12 bg-[#060814]/90 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
      <p className={`mb-3 text-[clamp(13px,0.95vw,16px)] font-medium tracking-[0.1em] ${R.title}`}>{title}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {rows.map((x) => (
          <div
            key={`${title}-${x.planet}`}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-transparent px-3 py-2.5 shadow-[inset_0_1px_0_0_rgba(197,160,89,0.05)]"
          >
            <span className="flex min-w-0 items-center gap-1.5 text-[13px] text-zinc-200">
              <span className="text-[#D4B87A]" style={GLYPH_STYLE}>
                {PLANET_GLYPH[x.planet]}
              </span>
              <span className="truncate">{PLANET_NAME_ZH[x.planet]}</span>
            </span>
            <span
              className={`shrink-0 rounded-md border border-[#5F8794]/28 bg-[#5F8794]/12 px-2 py-0.5 text-[11px] font-medium tracking-[0.12em] ${R.house}`}
            >
              第{x.house}宫
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AngleAspectCard({ a }: { a: AstroAngleAspectDatum }) {
  const major = isMajorAspectType(a.type);
  return (
    <div
      className={`${aspectCardShell} ${major ? "ring-1 ring-[#C5A059]/10" : ""}`}
    >
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-[0.12em] ${aspectBadgeClass(a.type)}`}
        >
          {aspectTypeLabelZh(a.type)}
        </span>
        <OrbPill deg={a.orbDeg} />
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-snug text-zinc-200">
        <span className="inline-flex items-center gap-1">
          <span className="text-[#D4B87A]" style={GLYPH_STYLE}>
            {PLANET_GLYPH[a.planet]}
          </span>
          <span>{PLANET_NAME_ZH[a.planet]}</span>
        </span>
        <span className="text-[#5F8794]" style={{ letterSpacing: "0.12em" }}>
          →
        </span>
        <span className="rounded-md border border-[#C5A059]/20 bg-[#C5A059]/8 px-2 py-0.5 text-[12px] font-medium tracking-[0.12em] text-[#D4C48A]">
          {axisLabelZh(a.axis)}
        </span>
      </div>
    </div>
  );
}

type Props = {
  data: AstroChartWheelData;
  className?: string;
  /** 为 true 时隐藏外层「星盘数据」总标题按钮（由外层折叠卡片承担） */
  omitOuterSummary?: boolean;
  /** 出生盘：各模块观测报告贴在对应表格下方；传入时行星/宫头/主相位表默认收起，解读始终可见 */
  natalInlineReports?: NatalObservationReportsStackProps | null;
  synastry?: {
    partnerLabel: string;
    aspects: AstroTransitNatalAspectDatum[];
    minorAspects?: AstroTransitNatalAspectDatum[];
    /** 与排盘设置一致，用于副标题展示 */
    majorOrbDeg?: number;
    minorOrbDeg?: number;
    partnerInMyHouses: Array<{ planet: AstroTransitNatalAspectDatum["transit"]; house: number }>;
    myInPartnerHouses: Array<{ planet: AstroTransitNatalAspectDatum["transit"]; house: number }>;
  } | null;
};

/**
 * 星盘旁文字读数：轴线、行星（符号+星座度数+宫位）、宫头表、主相位表。
 */
export default function AstroChartReadout({
  data,
  className = "",
  synastry = null,
  omitOuterSummary = false,
  natalInlineReports = null,
}: Props) {
  type ReadoutViewId = "planet" | "cusp" | "major" | "minor" | "angle" | "transit" | "synastry" | "synthesis";
  const collapseNatalDataTables = natalInlineReports != null;
  const [readoutOpen, setReadoutOpen] = useState(true);
  /** 有本命内联解读时默认收起表格，仅展开解读；否则与原先一致默认展开 */
  const [cuspsOpen, setCuspsOpen] = useState(() => !collapseNatalDataTables);
  const [aspectsOpen, setAspectsOpen] = useState(() => !collapseNatalDataTables);
  const [minorAspectsOpen, setMinorAspectsOpen] = useState(false);
  const [angleAspectsOpen, setAngleAspectsOpen] = useState(false);
  const [transitNatalOpen, setTransitNatalOpen] = useState(false);
  const [transitNatalMinorOpen, setTransitNatalMinorOpen] = useState(false);
  const [synastryOpen, setSynastryOpen] = useState(false);
  const [synastryMinorOpen, setSynastryMinorOpen] = useState(false);
  const [planetTableMode, setPlanetTableMode] = useState<"simple" | "pro">("pro");
  /** 行星/行运位置表可折叠：避免表格过长挤占阅读空间 */
  const [planetPositionsOpen, setPlanetPositionsOpen] = useState(() => !collapseNatalDataTables);
  const [activeView, setActiveView] = useState<ReadoutViewId>("planet");

  const planetRows = useMemo(() => {
    const order: Array<(typeof data.planets)[number]["id"]> = [
      "sun",
      "moon",
      "mercury",
      "venus",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
      "pluto",
      "north_node",
      "south_node",
      "chiron",
    ];
    const orderIndex = new Map(order.map((id, i) => [id, i]));
    return [...data.planets]
      .sort((a, b) => (orderIndex.get(a.id) ?? 999) - (orderIndex.get(b.id) ?? 999))
      .map((p) => {
      const pos = formatLongitudeInSignZh(p.lonDeg);
      const h = houseNumberForLongitude(p.lonDeg, data.houseCuspsLonDeg);
      return {
        id: p.id,
        glyph: PLANET_GLYPH[p.id],
        name: PLANET_NAME_ZH[p.id],
        pos: pos.text,
        signZh: pos.signZh,
        degInSign: pos.degInSign,
        minInSign: pos.minInSign,
        house: h,
        lon: normLon(p.lonDeg),
        retrograde: p.retrograde === true,
      };
      });
  }, [data]);

  const viewTabLabels = useMemo(() => READOUT_VIEW_TAB_LABELS_ZH[chartKindFromWheelMeta(data)], [data]);
  /** 读数区导读与空状态：有合盘时与综合结论一致，按「案主+双人」语境走 synastry */
  const readoutChartKind: ChartKindId = synastry != null ? "synastry" : chartKindFromWheelMeta(data);
  const inlinePanelTitles = natalInlineReports?.panelTitles;

  const cuspRows = useMemo(() => {
    return data.houseCuspsLonDeg.map((lon, i) => {
      const pos = formatLongitudeInSignZh(lon);
      return {
        house: i + 1,
        t: pos.text,
        signZh: pos.signZh,
        degInSign: pos.degInSign,
        minInSign: pos.minInSign,
        lon: normLon(lon),
      };
    });
  }, [data.houseCuspsLonDeg]);

  const synastryAspectRows = useMemo(
    () => (synastry ? [...synastry.aspects].sort((a, b) => a.orbDeg - b.orbDeg) : []),
    [synastry],
  );

  const synastryMinorRows = useMemo(
    () => (synastry?.minorAspects ? [...synastry.minorAspects].sort((a, b) => a.orbDeg - b.orbDeg) : []),
    [synastry],
  );

  /** 与排盘「主+次 / 仅主」一致；缺省视为含次要（旧数据无 aspectMeta 时） */
  const includeMinorAspectsInChart = data.aspectMeta?.includeMinorAspects ?? true;

  const hasTransitNatalMajor = (data.transitNatalAspects?.length ?? 0) > 0;
  const hasTransitNatalMinor = (data.transitNatalMinorAspects?.length ?? 0) > 0;

  /** 合盘：主+次且确有次要数据时合并为一张相位卡片（与「行运↔本命」一致） */
  const mergeSynastryAspectCards = includeMinorAspectsInChart && synastryMinorRows.length > 0;

  const hasNatalMinorBodyAspects = (data.minorAspects?.length ?? 0) > 0;
  const hasNatalAngleAspects =
    (data.angleAspectsMajor?.length ?? 0) > 0 || (data.angleAspectsMinor?.length ?? 0) > 0;
  /** 盘内：次要行星相位与轴点区块同时有数据时合并为一张卡片 */
  // 视图固定单列顺排：次要相位与轴点相位不再合并为同一卡片。
  const mergeNatalMinorAndAngleCard = false;

  const readoutAspectOrbTail = useMemo(() => {
    const m = data.aspectMeta?.majorOrbDeg ?? 6;
    const n = data.aspectMeta?.minorOrbDeg ?? 2.5;
    const inc = data.aspectMeta?.includeMinorAspects ?? true;
    const major = `主±${m.toFixed(1)}°`;
    if (!inc) return ` · 仅主相位 · ${major}`;
    return ` · ${major} · 次±${n.toFixed(1)}°`;
  }, [data.aspectMeta]);

  const readoutSubtitleExtra = useMemo(() => {
    const tags: string[] = [];
    if (synastry) {
      const synMin = synastry.minorAspects?.length ?? 0;
      tags.push(synMin > 0 ? "合盘·含次要" : "合盘");
    }
    const tnMajor = data.transitNatalAspects?.length ?? 0;
    const tnMinor = data.transitNatalMinorAspects?.length ?? 0;
    if (tnMajor + tnMinor > 0) {
      tags.push(tnMinor > 0 ? "行运×本命·含次要" : "行运×本命");
    }
    return tags.length ? ` · ${tags.join(" · ")}` : "";
  }, [synastry, data.transitNatalAspects, data.transitNatalMinorAspects]);

  const showReadoutBody = omitOuterSummary || readoutOpen;
  const hasTransitView = hasTransitNatalMajor || hasTransitNatalMinor;
  const viewTabsAll: Array<{ id: ReadoutViewId; label: string; show: boolean }> = [
    { id: "planet", label: viewTabLabels.planet, show: true },
    { id: "cusp", label: viewTabLabels.cusp, show: true },
    { id: "major", label: viewTabLabels.major, show: true },
    { id: "minor", label: viewTabLabels.minor, show: hasNatalMinorBodyAspects },
    { id: "angle", label: viewTabLabels.angle, show: hasNatalAngleAspects },
    { id: "transit", label: viewTabLabels.transitNatalTab, show: hasTransitView },
    { id: "synastry", label: viewTabLabels.synastryTab, show: !!synastry },
    { id: "synthesis", label: viewTabLabels.synthesis, show: true },
  ];
  const viewTabs = viewTabsAll.filter((v) => v.show);

  const voiceStyleId = useMemo(
    () =>
      selectVoiceStyleIdZh({
        chartKind: readoutChartKind,
        houseSystem: data.houseSystem,
        includeMinorAspects: data.aspectMeta?.includeMinorAspects,
        majorOrbDeg: data.aspectMeta?.majorOrbDeg,
        minorOrbDeg: data.aspectMeta?.minorOrbDeg,
        instantUtcMs: data.instantUtc.getTime(),
      }),
    [readoutChartKind, data.houseSystem, data.aspectMeta, data.instantUtc],
  );

  const readoutSynthesisZh = useMemo(
    () => chartReadoutSynthesisBodyVocal(data, synastry != null, voiceStyleId),
    [data, synastry, voiceStyleId],
  );

  const transitNatalMajorNarrativeZh = useMemo(
    () => transitNatalMajorNarrativeVocal(data, voiceStyleId),
    [data, voiceStyleId],
  );

  const effectiveView: ReadoutViewId = viewTabs.some((v) => v.id === activeView)
    ? activeView
    : (viewTabs[0]?.id ?? "planet");

  return (
    <div
      className={`mx-auto w-full max-w-[1120px] rounded-lg border border-[#C5A059]/14 bg-[#05051a]/80 p-4 font-sans text-[15px] leading-relaxed text-zinc-300 antialiased shadow-[inset_0_0_0_1px_rgba(197,160,89,0.06)] sm:p-5 ${className}`}
    >
      {!omitOuterSummary ? (
        <button
          type="button"
          onClick={() => setReadoutOpen((o) => !o)}
          className="mb-3 flex w-full flex-col gap-1 rounded-md py-2 text-left transition-colors hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between sm:gap-2"
          aria-expanded={readoutOpen}
        >
          <span className="flex min-w-0 items-center gap-2">
            <ChevronDown
              className={`h-4.5 w-4.5 shrink-0 ${R.title} transition-transform ${readoutOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
            <span className={`text-[17px] font-semibold tracking-tight ${R.title}`}>星盘数据</span>
          </span>
          <span className="max-w-full text-[12px] leading-snug text-zinc-400 sm:max-w-[min(72%,36rem)] sm:text-right sm:text-[13px]">
            {houseSystemLabelZh(data.houseSystem) +
              " · " +
              (data.ephemerisSource === "swiss-ephemeris" ? "瑞士星历" : "天文引擎") +
              readoutAspectOrbTail +
              readoutSubtitleExtra}
          </span>
        </button>
      ) : null}

      {showReadoutBody ? (
        <>
          {data.chartKindMeta?.lineZh ? (
            <p className="mb-3 text-[clamp(13px,0.88vw,16px)] leading-relaxed text-zinc-400">{data.chartKindMeta.lineZh}</p>
          ) : null}
          {omitOuterSummary ? (
            <p className="mb-3 text-[11px] leading-relaxed text-zinc-500">
              宫界口径：{houseSystemLabelZh(data.houseSystem)}
              {" · "}
              {data.ephemerisSource === "swiss-ephemeris" ? "瑞士星历" : "天文引擎"}
              {readoutAspectOrbTail}
              {readoutSubtitleExtra}
            </p>
          ) : null}
          <AstroViewCopyGuide chartKind={readoutChartKind} voiceStyleId={voiceStyleId} className="mb-3" />
          <p className="mb-3 text-[11px] leading-relaxed text-zinc-500">
            {houseSystemReadoutHintVocal(voiceStyleId, data.houseSystem)}
          </p>
          <div className="mb-3 border-b border-white/[0.08] pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {viewTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveView(tab.id)}
                  className={`rounded-md border px-3 py-1.5 text-[13px] transition-colors ${
                    effectiveView === tab.id
                      ? "border-[#C5A059]/40 bg-[#C5A059]/14 text-[#D6BF8A]"
                      : "border-white/[0.08] bg-black/20 text-zinc-400 hover:border-[#C5A059]/25 hover:text-zinc-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {effectiveView === "synthesis" ? (
            <section
              className="mb-1 min-w-0 max-w-[1080px] rounded-md border border-white/[0.08] bg-black/20 p-3 sm:p-3.5"
              aria-label={viewTabLabels.synthesis}
            >
              <p className="mb-2 border-l-2 border-[#C5A059]/20 pl-2 text-[11px] leading-snug text-zinc-500">
                {readoutPanelContextVocal(readoutChartKind, "synthesis", voiceStyleId)}
              </p>
              <p className="text-[12px] leading-relaxed text-zinc-400 sm:text-[13px]">{readoutSynthesisZh}</p>
            </section>
          ) : (
          <>
          {/* 左列纵向叠「行星 + 宫头」，右列单独主相位：避免三列时宫头过短、右侧大块留白 */}
          <div className="grid max-w-[1080px] grid-cols-1 items-start gap-4 text-[14px] leading-relaxed text-zinc-300">
        <div className="flex min-w-0 flex-col gap-4">
        {effectiveView === "planet" ? (
        <section className="min-w-0 rounded-md border border-white/[0.08] bg-black/20 p-3 sm:p-3.5">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setPlanetPositionsOpen((o) => !o)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPlanetPositionsOpen((o) => !o);
              }
            }}
            className="mb-3 flex w-full flex-wrap items-center justify-between gap-2 rounded-md text-left transition-colors hover:bg-white/[0.04]"
            aria-expanded={planetPositionsOpen}
          >
            <div className="flex flex-col gap-0.5">
              <p className={`text-[15px] font-semibold tracking-tight ${R.title}`}>{viewTabLabels.planet}</p>
              <p className="text-[11px] leading-snug text-zinc-500">
                {readoutPanelContextVocal(readoutChartKind, "planet", voiceStyleId)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {planetPositionsOpen ? (
                <div className="inline-flex rounded-full border border-white/[0.1] p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlanetTableMode("simple");
                    }}
                    className={`rounded-full px-2.5 py-1 transition-colors ${planetTableMode === "simple" ? "bg-[#C5A059]/16 text-[#C4B07A]" : "text-zinc-500 hover:text-zinc-400"}`}
                    title="整行中文位置"
                  >
                    简版
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlanetTableMode("pro");
                    }}
                    className={`rounded-full px-2.5 py-1 transition-colors ${planetTableMode === "pro" ? "bg-[#C5A059]/14 text-[#C4B07A]" : "text-zinc-500 hover:text-zinc-400"}`}
                    title="分栏：星座、度、分、宫"
                  >
                    分栏
                  </button>
                </div>
              ) : null}
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${planetPositionsOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </div>
          </div>
          {planetPositionsOpen ? (
            <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
              {planetTableMode === "pro" ? (
              <table className="w-full min-w-[320px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.1] text-[11px] font-medium text-zinc-500">
                    <th className="pb-2 pr-2 text-left font-sans">星体</th>
                    <th className="pb-2 pr-1 text-left font-sans">星座</th>
                    <th className="w-8 pb-2 px-0.5 text-center font-mono font-normal">度</th>
                    <th className="w-8 pb-2 px-0.5 text-center font-mono font-normal">分</th>
                    <th className="w-9 pb-2 px-0.5 text-center font-sans">宫</th>
                    <th className="w-8 pb-2 px-0.5 text-center font-sans">逆</th>
                    <th className="pb-2 pl-2 text-right font-mono font-normal">黄经</th>
                  </tr>
                </thead>
                <tbody>
                  {planetRows.map((r) => (
                    <tr key={r.id} className="border-b border-white/[0.05]">
                      <td className="py-2 pr-2 align-middle">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-[#D4B87A]" style={GLYPH_STYLE}>
                            {r.glyph}
                          </span>
                          <span className="text-[13px] font-medium text-zinc-200">{r.name}</span>
                        </span>
                      </td>
                      <td className="py-2 pr-1 align-middle font-sans text-[13px] text-zinc-300">{r.signZh}</td>
                      <td className="py-2 px-0.5 text-center font-mono text-[13px] tabular-nums text-zinc-400">{r.degInSign}</td>
                      <td className="py-2 px-0.5 text-center font-mono text-[13px] tabular-nums text-zinc-400">{r.minInSign}</td>
                      <td className="py-2 px-0.5 text-center font-mono text-[13px] tabular-nums text-[#5F8794]">{r.house}</td>
                      <td className="py-2 px-0.5 text-center font-sans text-[12px] text-zinc-500">{r.retrograde ? "逆" : "—"}</td>
                      <td className="py-2 pl-2 text-right font-mono text-[12px] tabular-nums text-zinc-400">{r.lon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[11px] font-medium text-zinc-500">
                    <th className="pb-2 pr-2 font-sans">星体</th>
                    <th className="pb-2 pr-2 font-sans">位置</th>
                    <th className="pb-2 pr-2 font-sans">宫</th>
                    <th className="w-10 pb-2 px-1 text-center font-sans">逆</th>
                    <th className="pb-2 pl-1 text-right font-mono">黄经</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  {planetRows.map((r) => (
                    <tr key={r.id} className="border-b border-white/[0.05]">
                      <td className="py-1.5 pr-2 font-sans">
                        <span className={R.glyph} style={GLYPH_STYLE}>
                          {r.glyph}
                        </span>{" "}
                        <span className={`truncate ${R.key}`}>{r.name}</span>
                      </td>
                      <td className="py-1.5 pr-2 font-sans text-zinc-300">{r.pos}</td>
                      <td className={`py-1.5 pr-2 font-mono tabular-nums ${R.house}`}>{r.house}</td>
                      <td className="py-1.5 px-1 text-center font-sans text-zinc-500">{r.retrograde ? "逆" : "—"}</td>
                      <td className="py-1.5 pl-1 text-right font-mono text-[12px] tabular-nums text-zinc-400">{r.lon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          ) : null}
          {natalInlineReports?.planetPositionsReport ? (
            <NatalObservationReportInlineBlock>
              <NatalPlanetPositionsReportPanel
                report={natalInlineReports.planetPositionsReport}
                panelHeading={inlinePanelTitles?.planet}
              />
            </NatalObservationReportInlineBlock>
          ) : null}
        </section>
        ) : null}

        {effectiveView === "cusp" ? (
        <section className="min-w-0 rounded-md border border-white/[0.08] bg-black/20 p-3 sm:p-3.5">
          <button
            type="button"
            onClick={() => setCuspsOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-2 py-1 text-left"
          >
            <span className={`text-[15px] font-semibold tracking-tight ${R.title}`}>{viewTabLabels.cusp}</span>
            <ChevronDown className={`h-4 w-4 shrink-0 ${R.title} transition-transform ${cuspsOpen ? "rotate-180" : ""}`} />
          </button>
          {cuspsOpen ? (
            <div className="mt-2 overflow-x-auto">
              <p className="mb-2 border-l-2 border-[#C5A059]/20 pl-2 text-[11px] leading-snug text-zinc-500">
                {readoutPanelContextVocal(readoutChartKind, "cusp", voiceStyleId)}
              </p>
              <table className="w-full min-w-[280px] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-white/[0.1] text-[11px] font-medium text-zinc-500">
                    <th className="pb-2 pr-2 text-left font-sans">宫</th>
                    <th className="pb-2 pr-1 text-left font-sans">星座</th>
                    <th className="w-8 pb-2 px-0.5 text-center font-mono font-normal">度</th>
                    <th className="w-8 pb-2 px-0.5 text-center font-mono font-normal">分</th>
                    <th className="pb-2 pl-2 text-right font-mono font-normal">黄经</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  {cuspRows.map((c) => (
                    <tr key={c.house} className="border-b border-white/[0.05]">
                      <td className="py-1.5 pr-2 font-mono text-[13px] tabular-nums text-[#5F8794]">{c.house}</td>
                      <td className="py-1.5 pr-1 font-sans text-zinc-300">{c.signZh}</td>
                      <td className="py-1.5 px-0.5 text-center font-mono tabular-nums">{c.degInSign}</td>
                      <td className="py-1.5 px-0.5 text-center font-mono tabular-nums">{c.minInSign}</td>
                      <td className="py-1.5 pl-2 text-right font-mono text-[12px] tabular-nums text-zinc-400">{c.lon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {natalInlineReports?.houseCuspReport ? (
            <NatalObservationReportInlineBlock>
              <NatalHouseCuspReportPanel
                report={natalInlineReports.houseCuspReport}
                panelHeading={inlinePanelTitles?.house}
              />
            </NatalObservationReportInlineBlock>
          ) : null}
        </section>
        ) : null}
        </div>

        {effectiveView === "major" ? (
        <section className="min-w-0 rounded-md border border-white/[0.08] bg-black/20 p-3 sm:p-3.5 md:min-w-0">
          <button
            type="button"
            onClick={() => setAspectsOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-2 py-1 text-left"
          >
            <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span>{viewTabLabels.major}</span>
              <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                主 ±{(data.aspectMeta?.majorOrbDeg ?? 6).toFixed(1)}°
                {!includeMinorAspectsInChart ? " · 仅主相位" : ""}
              </span>
            </span>
            <span className="flex items-center gap-2">
              {data.aspects.length > 0 ? (
                <span className="rounded-full border border-white/[0.08] bg-black/30 px-2 py-0.5 font-mono text-[10px] tabular-nums text-zinc-500">
                  {data.aspects.length}
                </span>
              ) : null}
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${aspectsOpen ? "rotate-180" : ""}`} />
            </span>
          </button>
          {aspectsOpen && (
            <div className="mt-3">
              <p className="mb-2 border-l-2 border-[#C5A059]/20 pl-2 text-[11px] leading-snug text-zinc-500">
                {readoutPanelContextVocal(readoutChartKind, "major", voiceStyleId)}
              </p>
              {data.aspects.length === 0 ? (
                <p className="text-[13px] text-zinc-500">
                  {readoutEmptyMajorAspectsVocal(readoutChartKind, voiceStyleId)}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {[...data.aspects].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                    <BodyPairAspectCard key={`${a.a}-${a.b}-${a.type}-${i}`} a={a} />
                  ))}
                </div>
              )}
            </div>
          )}
          {natalInlineReports?.majorAspectReport ? (
            <NatalObservationReportInlineBlock>
              <NatalMajorAspectReportPanel
                report={natalInlineReports.majorAspectReport}
                panelHeading={inlinePanelTitles?.major}
              />
            </NatalObservationReportInlineBlock>
          ) : null}
        </section>
        ) : null}

          </div>

          {(effectiveView === "minor" || effectiveView === "angle") &&
          (hasNatalMinorBodyAspects || hasNatalAngleAspects) ? (
            <div className="mt-2 flex max-w-[1080px] flex-col gap-3 text-[clamp(14px,0.95vw,16px)] leading-relaxed [font-variant-numeric:tabular-nums]">
              {mergeNatalMinorAndAngleCard ? (
                <section className="min-w-0 rounded-md border border-white/[0.08] bg-black/20 p-3 sm:p-3.5">
                  <button
                    type="button"
                    onClick={() => setMinorAspectsOpen((o) => !o)}
                    className="flex w-full items-center justify-between gap-2 py-1 text-left"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span>{viewTabLabels.minor}</span>
                      <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                        次 ±{(data.aspectMeta?.minorOrbDeg ?? 2.5).toFixed(1)}°
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="rounded-full border border-white/[0.08] bg-black/30 px-2 py-0.5 font-mono text-[10px] tabular-nums text-zinc-500">
                        {data.minorAspects?.length ?? 0}
                      </span>
                      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${minorAspectsOpen ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  {minorAspectsOpen && (
                    <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <p className="col-span-full mb-1 border-l-2 border-[#C5A059]/20 pl-2 text-[11px] leading-snug text-zinc-500">
                        {readoutPanelContextVocal(readoutChartKind, "minor", voiceStyleId)}
                      </p>
                      {[...(data.minorAspects ?? [])].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                        <BodyPairAspectCard key={`min-${a.a}-${a.b}-${a.type}-${i}`} a={a} />
                      ))}
                    </div>
                  )}
                  {natalInlineReports?.minorAspectReport ? (
                    <NatalObservationReportInlineBlock>
                      <NatalMinorAspectReportPanel
                        report={natalInlineReports.minorAspectReport}
                        panelHeading={inlinePanelTitles?.minor}
                      />
                    </NatalObservationReportInlineBlock>
                  ) : null}
                  <div className="mt-4 border-t border-white/[0.06] pt-4">
                    <button
                      type="button"
                      onClick={() => setAngleAspectsOpen((o) => !o)}
                      className="flex w-full items-center justify-between gap-2 py-1 text-left"
                    >
                      <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span>{viewTabLabels.angle}</span>
                        <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                          主 ±{(data.aspectMeta?.majorOrbDeg ?? 6).toFixed(1)}° · 次 ±
                          {(data.aspectMeta?.minorOrbDeg ?? 2.5).toFixed(1)}°
                        </span>
                      </span>
                      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${angleAspectsOpen ? "rotate-180" : ""}`} />
                    </button>
                    {angleAspectsOpen && (
                      <div className="mt-4 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 sm:gap-8">
                        <p className="col-span-full mb-1 border-l-2 border-[#C5A059]/20 pl-2 text-[11px] leading-snug text-zinc-500 sm:col-span-2">
                          {readoutPanelContextVocal(readoutChartKind, "angle", voiceStyleId)}
                        </p>
                        <div className="relative sm:border-r sm:border-white/[0.06] sm:pr-6">
                          <div className="mb-3 flex items-center gap-2">
                            <span className="h-px flex-1 bg-gradient-to-r from-[#C5A059]/35 to-transparent" aria-hidden />
                            <span className={`shrink-0 text-[11px] font-medium tracking-[0.2em] ${R.key}`}>主相位</span>
                            <span className="h-px flex-1 bg-gradient-to-l from-[#C5A059]/35 to-transparent" aria-hidden />
                          </div>
                          {(data.angleAspectsMajor?.length ?? 0) === 0 ? (
                            <p className="text-[13px] text-zinc-500">
                              {readoutEmptyAngleMajorVocal(readoutChartKind, voiceStyleId)}
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                              {[...(data.angleAspectsMajor ?? [])].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                                <AngleAspectCard key={`ang-maj-${a.planet}-${a.axis}-${a.type}-${i}`} a={a} />
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="mb-3 flex items-center gap-2">
                            <span className="h-px flex-1 bg-gradient-to-r from-violet-500/25 to-transparent" aria-hidden />
                            <span className="shrink-0 text-[11px] font-medium tracking-[0.2em] text-violet-200/70">次要相位</span>
                            <span className="h-px flex-1 bg-gradient-to-l from-violet-500/25 to-transparent" aria-hidden />
                          </div>
                          {(data.angleAspectsMinor?.length ?? 0) === 0 ? (
                            <p className="text-[13px] text-zinc-500">
                              {readoutEmptyAngleMinorVocal(readoutChartKind, voiceStyleId)}
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                              {[...(data.angleAspectsMinor ?? [])].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                                <AngleAspectCard key={`ang-min-${a.planet}-${a.axis}-${a.type}-${i}`} a={a} />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {natalInlineReports?.angleAspectReport ? (
                      <NatalObservationReportInlineBlock>
                        <NatalAngleAspectReportPanel
                          report={natalInlineReports.angleAspectReport}
                          panelHeading={inlinePanelTitles?.angle}
                        />
                      </NatalObservationReportInlineBlock>
                    ) : null}
                  </div>
                </section>
              ) : (
                <>
                  {effectiveView === "minor" && hasNatalMinorBodyAspects ? (
                    <section className="min-w-0 rounded-md border border-white/[0.08] bg-black/20 p-3 sm:p-3.5">
                      <button
                        type="button"
                        onClick={() => setMinorAspectsOpen((o) => !o)}
                        className="flex w-full items-center justify-between gap-2 py-1 text-left"
                      >
                        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span>{viewTabLabels.minor}</span>
                          <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                            次 ±{(data.aspectMeta?.minorOrbDeg ?? 2.5).toFixed(1)}°
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="rounded-full border border-white/[0.08] bg-black/30 px-2 py-0.5 font-mono text-[10px] tabular-nums text-zinc-500">
                            {data.minorAspects?.length ?? 0}
                          </span>
                          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${minorAspectsOpen ? "rotate-180" : ""}`} />
                        </span>
                      </button>
                      {minorAspectsOpen && (
                        <div className="mt-3 grid grid-cols-1 gap-2.5">
                          <p className="border-l-2 border-[#C5A059]/20 pl-2 text-[11px] leading-snug text-zinc-500">
                            {readoutPanelContextVocal(readoutChartKind, "minor", voiceStyleId)}
                          </p>
                          {[...(data.minorAspects ?? [])].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                            <BodyPairAspectCard key={`min-${a.a}-${a.b}-${a.type}-${i}`} a={a} />
                          ))}
                        </div>
                      )}
                      {natalInlineReports?.minorAspectReport ? (
                        <NatalObservationReportInlineBlock>
                          <NatalMinorAspectReportPanel
                            report={natalInlineReports.minorAspectReport}
                            panelHeading={inlinePanelTitles?.minor}
                          />
                        </NatalObservationReportInlineBlock>
                      ) : null}
                    </section>
                  ) : null}

                  {effectiveView === "angle" && hasNatalAngleAspects ? (
                    <section className="min-w-0 rounded-md border border-white/[0.08] bg-black/20 p-3 sm:p-3.5">
                      <button
                        type="button"
                        onClick={() => setAngleAspectsOpen((o) => !o)}
                        className="flex w-full items-center justify-between gap-2 py-1 text-left"
                      >
                        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span>{viewTabLabels.angle}</span>
                          <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                            主 ±{(data.aspectMeta?.majorOrbDeg ?? 6).toFixed(1)}°
                            {includeMinorAspectsInChart ? (
                              <> · 次 ±{(data.aspectMeta?.minorOrbDeg ?? 2.5).toFixed(1)}°</>
                            ) : null}
                          </span>
                        </span>
                        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${angleAspectsOpen ? "rotate-180" : ""}`} />
                      </button>
                      {angleAspectsOpen && (
                        <div className="mt-4 grid grid-cols-1 items-start gap-6">
                          <p className="border-l-2 border-[#C5A059]/20 pl-2 text-[11px] leading-snug text-zinc-500">
                            {readoutPanelContextVocal(readoutChartKind, "angle", voiceStyleId)}
                          </p>
                          <div className="relative">
                            <div className="mb-3 flex items-center gap-2">
                              <span className="h-px flex-1 bg-gradient-to-r from-[#C5A059]/35 to-transparent" aria-hidden />
                              <span className={`shrink-0 text-[11px] font-medium tracking-[0.2em] ${R.key}`}>主相位</span>
                              <span className="h-px flex-1 bg-gradient-to-l from-[#C5A059]/35 to-transparent" aria-hidden />
                            </div>
                            {(data.angleAspectsMajor?.length ?? 0) === 0 ? (
                              <p className="text-[13px] text-zinc-500">
                                {readoutEmptyAngleMajorVocal(readoutChartKind, voiceStyleId)}
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 gap-2.5">
                                {[...(data.angleAspectsMajor ?? [])].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                                  <AngleAspectCard key={`ang-maj-${a.planet}-${a.axis}-${a.type}-${i}`} a={a} />
                                ))}
                              </div>
                            )}
                          </div>
                          {includeMinorAspectsInChart ? (
                            <div>
                              <div className="mb-3 flex items-center gap-2">
                                <span className="h-px flex-1 bg-gradient-to-r from-violet-500/25 to-transparent" aria-hidden />
                                <span className="shrink-0 text-[11px] font-medium tracking-[0.2em] text-violet-200/70">次要相位</span>
                                <span className="h-px flex-1 bg-gradient-to-l from-violet-500/25 to-transparent" aria-hidden />
                              </div>
                              {(data.angleAspectsMinor?.length ?? 0) === 0 ? (
                                <p className="text-[13px] text-zinc-500">
                                  {readoutEmptyAngleMinorVocal(readoutChartKind, voiceStyleId)}
                                </p>
                              ) : (
                                <div className="grid grid-cols-1 gap-2.5">
                                  {[...(data.angleAspectsMinor ?? [])].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                                    <AngleAspectCard key={`ang-min-${a.planet}-${a.axis}-${a.type}-${i}`} a={a} />
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      )}
                      {natalInlineReports?.angleAspectReport ? (
                        <NatalObservationReportInlineBlock>
                          <NatalAngleAspectReportPanel
                            report={natalInlineReports.angleAspectReport}
                            panelHeading={inlinePanelTitles?.angle}
                          />
                        </NatalObservationReportInlineBlock>
                      ) : null}
                    </section>
                  ) : null}
                </>
              )}
            </div>
          ) : null}

          {effectiveView === "transit" && (hasTransitNatalMajor || hasTransitNatalMinor) ? (
            <div className="mt-2 flex flex-col gap-2">
              <p className="border-l-2 border-[#C5A059]/20 pl-2 text-[11px] leading-snug text-zinc-500">
                {readoutPanelContextVocal(readoutChartKind, "transit", voiceStyleId)}
              </p>
              {!includeMinorAspectsInChart && hasTransitNatalMajor ? (
                <section className="min-w-0 rounded-md border border-white/[0.08] bg-black/20 p-3 sm:p-3.5">
                  <button
                    type="button"
                    onClick={() => setTransitNatalOpen((o) => !o)}
                    className="flex w-full items-center justify-between gap-2 py-1 text-left"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span>{viewTabLabels.transitNatalTab}</span>
                      <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                        主 ±{(data.aspectMeta?.majorOrbDeg ?? 6).toFixed(1)}° · 仅主相位
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="rounded-full border border-white/[0.08] bg-black/30 px-2 py-0.5 font-mono text-[10px] tabular-nums text-zinc-500">
                        {data.transitNatalAspects?.length ?? 0}
                      </span>
                      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${transitNatalOpen ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  {transitNatalOpen && data.transitNatalAspects ? (
                    <div className="mt-3 grid grid-cols-2 gap-2.5 [&>*]:min-w-0">
                      {[...data.transitNatalAspects].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                        <TransitNatalAspectCard key={`tn-${a.transit}-${a.natal}-${a.type}-${i}`} a={a} />
                      ))}
                    </div>
                  ) : null}
                </section>
              ) : includeMinorAspectsInChart && hasTransitNatalMajor && hasTransitNatalMinor ? (
                <section className="min-w-0 overflow-hidden rounded-xl border border-[#C5A059]/12 bg-[#060814]/90 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                  <button
                    type="button"
                    onClick={() => setTransitNatalOpen((o) => !o)}
                    className="flex w-full items-center justify-between gap-2 py-1 text-left"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span>主相位</span>
                      <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                        主 ±{(data.aspectMeta?.majorOrbDeg ?? 6).toFixed(1)}°
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="rounded-full border border-white/[0.08] bg-black/30 px-2 py-0.5 font-mono text-[10px] tabular-nums text-zinc-500">
                        {data.transitNatalAspects?.length ?? 0}
                      </span>
                      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${transitNatalOpen ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  {transitNatalOpen && data.transitNatalAspects ? (
                    <div className="mt-3 grid grid-cols-2 gap-2.5 [&>*]:min-w-0">
                      {[...data.transitNatalAspects].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                        <TransitNatalAspectCard key={`tn-${a.transit}-${a.natal}-${a.type}-${i}`} a={a} />
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-4 border-t border-white/[0.06] pt-4">
                    <button
                      type="button"
                      onClick={() => setTransitNatalMinorOpen((o) => !o)}
                      className="flex w-full items-center justify-between gap-2 py-1 text-left"
                    >
                      <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span>次要相位</span>
                        <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                          次 ±{(data.aspectMeta?.minorOrbDeg ?? 2.5).toFixed(1)}°
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="rounded-full border border-white/[0.08] bg-black/30 px-2 py-0.5 font-mono text-[10px] tabular-nums text-zinc-500">
                          {data.transitNatalMinorAspects?.length ?? 0}
                        </span>
                        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${transitNatalMinorOpen ? "rotate-180" : ""}`} />
                      </span>
                    </button>
                    {transitNatalMinorOpen && data.transitNatalMinorAspects ? (
                      <div className="mt-3 grid grid-cols-2 gap-2.5 [&>*]:min-w-0">
                        {[...data.transitNatalMinorAspects].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                          <TransitNatalAspectCard key={`tnm-${a.transit}-${a.natal}-${a.type}-${i}`} a={a} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : (
                <>
                  {hasTransitNatalMajor ? (
                    <section className="min-w-0 rounded-md border border-white/[0.08] bg-black/20 p-3 sm:p-3.5">
                      <button
                        type="button"
                        onClick={() => setTransitNatalOpen((o) => !o)}
                        className="flex w-full items-center justify-between gap-2 py-1 text-left"
                      >
                        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span>
                            {viewTabLabels.transitNatalTab}（主相位）
                          </span>
                          <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                            主 ±{(data.aspectMeta?.majorOrbDeg ?? 6).toFixed(1)}°
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="rounded-full border border-white/[0.08] bg-black/30 px-2 py-0.5 font-mono text-[10px] tabular-nums text-zinc-500">
                            {data.transitNatalAspects?.length ?? 0}
                          </span>
                          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${transitNatalOpen ? "rotate-180" : ""}`} />
                        </span>
                      </button>
                      {transitNatalOpen && data.transitNatalAspects ? (
                        <div className="mt-3 grid grid-cols-2 gap-2.5 [&>*]:min-w-0">
                          {[...data.transitNatalAspects].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                            <TransitNatalAspectCard key={`tn-${a.transit}-${a.natal}-${a.type}-${i}`} a={a} />
                          ))}
                        </div>
                      ) : null}
                    </section>
                  ) : null}
                  {hasTransitNatalMinor ? (
                    <section className="min-w-0 rounded-md border border-white/[0.08] bg-black/20 p-3 sm:p-3.5">
                      <button
                        type="button"
                        onClick={() => setTransitNatalMinorOpen((o) => !o)}
                        className="flex w-full items-center justify-between gap-2 py-1 text-left"
                      >
                        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span>
                            {viewTabLabels.transitNatalTab}（次要相位）
                          </span>
                          <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                            次 ±{(data.aspectMeta?.minorOrbDeg ?? 2.5).toFixed(1)}°
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="rounded-full border border-white/[0.08] bg-black/30 px-2 py-0.5 font-mono text-[10px] tabular-nums text-zinc-500">
                            {data.transitNatalMinorAspects?.length ?? 0}
                          </span>
                          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${transitNatalMinorOpen ? "rotate-180" : ""}`} />
                        </span>
                      </button>
                      {transitNatalMinorOpen && data.transitNatalMinorAspects ? (
                        <div className="mt-3 grid grid-cols-2 gap-2.5 [&>*]:min-w-0">
                          {[...data.transitNatalMinorAspects].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                            <TransitNatalAspectCard key={`tnm-${a.transit}-${a.natal}-${a.type}-${i}`} a={a} />
                          ))}
                        </div>
                      ) : null}
                    </section>
                  ) : null}
                </>
              )}
              {transitNatalMajorNarrativeZh ? (
                <div className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5">
                  <p className="whitespace-pre-line text-[13px] leading-relaxed text-zinc-400 sm:text-[14px]">
                    {transitNatalMajorNarrativeZh}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {effectiveView === "synastry" && synastry ? (
            <section className="mt-2 min-w-0 rounded-md border border-white/[0.08] bg-black/20 p-3 sm:p-3.5">
              <button
                type="button"
                onClick={() => setSynastryOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-2 py-1 text-left"
              >
                <span>
                  合盘（你 ↔ {synastry.partnerLabel}）
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${synastryOpen ? "rotate-180" : ""}`} />
              </button>
              {synastryOpen ? (
                <div className="mt-3 flex max-w-[1080px] flex-col gap-3 text-[clamp(14px,0.95vw,16px)] leading-relaxed text-zinc-400 [font-variant-numeric:tabular-nums]">
                  <p className="border-l-2 border-[#C5A059]/20 pl-2 text-[11px] leading-snug text-zinc-500">
                        {readoutPanelContextVocal(readoutChartKind, "synastry", voiceStyleId)}
                  </p>
                  <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-x-4">
                    <SynastryHouseCard title="对方行星落你宫位" rows={synastry.partnerInMyHouses} />
                    <SynastryHouseCard title="你行星落对方宫位" rows={synastry.myInPartnerHouses} />
                  </div>

                  {mergeSynastryAspectCards ? (
                    <section className="min-w-0 overflow-hidden rounded-xl border border-[#C5A059]/12 bg-[#060814]/90 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                      <div className="mb-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-1 border-b border-white/[0.06] pb-3">
                        <span className={`text-[clamp(13px,0.95vw,16px)] font-medium tracking-[0.1em] ${R.title}`}>
                          双人相位（对方 ↔ 你）
                        </span>
                        <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                          主 ±{(synastry.majorOrbDeg ?? 6).toFixed(1)}° · 次 ±{(synastry.minorOrbDeg ?? 2.5).toFixed(1)}°
                        </span>
                      </div>
                      <p className={`text-[clamp(13px,0.95vw,16px)] font-medium tracking-[0.1em] ${R.title}`}>
                        主相位 · 共 {synastryAspectRows.length} 条
                        <span className="ml-2 text-[11px] font-normal tracking-normal text-zinc-500">
                          （{(synastry.majorOrbDeg ?? 6).toFixed(1)}° 主相位容许度）
                        </span>
                      </p>
                      {synastryAspectRows.length === 0 ? (
                        <p className="mt-2 text-[13px] text-zinc-500">
                          {readoutEmptySynastryMajorVocal(voiceStyleId)}
                        </p>
                      ) : (
                        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                          {synastryAspectRows.map((a, i) => (
                            <TransitNatalAspectCard
                              key={`syn-asp-${a.transit}-${a.natal}-${a.type}-${i}`}
                              a={a}
                              leftLabel="对方"
                              rightLabel="你"
                            />
                          ))}
                        </div>
                      )}
                      <div className="mt-4 border-t border-white/[0.06] pt-4">
                        <button
                          type="button"
                          onClick={() => setSynastryMinorOpen((o) => !o)}
                          className="flex w-full items-center justify-between gap-2 py-1 text-left"
                        >
                          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span>次要相位</span>
                            <span className="text-[11px] font-normal tracking-normal text-zinc-500">
                              次 ±{(synastry.minorOrbDeg ?? 2.5).toFixed(1)}°
                            </span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="rounded-full border border-white/[0.08] bg-black/30 px-2 py-0.5 font-mono text-[10px] tabular-nums text-zinc-500">
                              {synastryMinorRows.length}
                            </span>
                            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${synastryMinorOpen ? "rotate-180" : ""}`} />
                          </span>
                        </button>
                        {synastryMinorOpen ? (
                          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                            {synastryMinorRows.map((a, i) => (
                              <TransitNatalAspectCard
                                key={`syn-min-${a.transit}-${a.natal}-${a.type}-${i}`}
                                a={a}
                                leftLabel="对方"
                                rightLabel="你"
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </section>
                  ) : (
                    <section className="min-w-0 overflow-hidden rounded-xl border border-[#C5A059]/12 bg-[#060814]/90 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                      <p className={`text-[clamp(13px,0.95vw,16px)] font-medium tracking-[0.1em] ${R.title}`}>
                        双人主相位 · 共 {synastryAspectRows.length} 条
                        <span className="ml-2 text-[11px] font-normal tracking-normal text-zinc-500">
                          （{(synastry.majorOrbDeg ?? 6).toFixed(1)}° 主相位容许度
                          {!includeMinorAspectsInChart ? " · 仅主相位" : ""}）
                        </span>
                      </p>
                      {synastryAspectRows.length === 0 ? (
                        <p className="mt-2 text-[13px] text-zinc-500">
                          {readoutEmptySynastryMajorVocal(voiceStyleId)}
                        </p>
                      ) : (
                        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                          {synastryAspectRows.map((a, i) => (
                            <TransitNatalAspectCard
                              key={`syn-asp-${a.transit}-${a.natal}-${a.type}-${i}`}
                              a={a}
                              leftLabel="对方"
                              rightLabel="你"
                            />
                          ))}
                        </div>
                      )}
                    </section>
                  )}
                </div>
              ) : null}
            </section>
          ) : null}
          </>
          )}
        </>
      ) : null}
    </div>
  );
}
