"use client";

import { Cinzel, Noto_Serif_SC } from "next/font/google";
import { ChevronDown } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useCallback, useLayoutEffect, useMemo, type ReactNode } from "react";
import { NumerologyMirrorChapterCard, NumerologyMirrorHandbook } from "@/components/numerology/NumerologyMirrorHandbook";
import { useNumerologyInstantNav } from "@/components/numerology/NumerologyInstantNavContext";
import { NumerologyEnergyNavPanel } from "@/components/numerology/numerology-energy-nav";
import { NumerologyExportMarkdownButtons } from "@/components/numerology/NumerologyExportMarkdownButtons";
import { NumerologyGregorianDateField } from "@/components/numerology/NumerologyGregorianDateField";
import { NumerologyGateMetricStrip } from "@/components/numerology/NumerologyGateMetricStrip";
import { NumerologyMandala2D } from "@/components/numerology/NumerologyMandala2D";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import {
  NumerologyGlassCard,
  NumerologyHandbookPrelineBlocks,
  numerologyInputClassName,
} from "@/components/numerology/numerology-shared-ui";
import { numerologyNameHasLatinLetters } from "@/lib/numerology-pythagorean";
import {
  numerologyGateHighlightZh,
  numerologyNameThreeSummaryZh,
  numerologyReadingVoiceLogicPreambleZh,
  numerologyUnifiedHandbookBodyZh,
} from "@/lib/numerology-unified-deep-reading-zh";
import {
  numerologyGateDisclaimerZh,
  numerologyGateLatinNameFieldHintZh,
  numerologyGateExecMemoBulletsZh,
  numerologyGateInstantSnapshotPartsZh,
  numerologyGateKpiHeaderZh,
  numerologyGateKpiTitleZh,
  numerologyGateMetricRowsMetaZh,
  numerologyGateMirrorEyebrowZh,
  numerologyGateMirrorLinesZh,
  numerologyGateNameLatinLabelZh,
  numerologyGateRawLayerHandbookZh,
  numerologyGateRawLayerIntroZh,
  numerologyGateRawTableRowFootnotesZh,
  numerologyGateRawTableZh,
  numerologyGateReadoutSettleHandbookDetailsSummaryZh,
  numerologyGateReadoutListenModuleTitlesZh,
  numerologyGateReadoutPhaseTitlesZh,
  numerologyGateReadoutStatusBodyZh,
  numerologyGateReadoutStatusLeadZh,
  numerologyGateReadoutTitleZh,
} from "@/lib/numerology-gate-ui-copy-zh";
import { NUMEROLOGY_GATE_ANCHOR } from "@/lib/numerology-gate-scroll-anchors";
import {
  birthdayNumberLayerCopyZh,
  expressionLayerCopyZh,
  personalityLayerCopyZh,
  soulUrgeLayerCopyZh,
} from "@/lib/numerology-numeral-master-zh";

const displaySerif = Cinzel({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/** 关键读数卡：节标题 / 正文 / 栅格辅文统一层级，避免左右栏色差 */
const kpiSectionLabelClass = `text-[10px] font-medium tracking-[0.22em] text-[#94a3b8] ${zhSerif.className}`;
const kpiSectionBodyClass = `mt-1 text-[12px] leading-[1.68] text-[#cbd5e1] ${zhSerif.className}`;
/** 寰宇之门：生辰、曼陀罗、辅数与读数分层 */
export function NumerologyGateView() {
  const {
    y,
    m,
    d,
    nameLatin,
    calendarYear,
    setY,
    setM,
    setD,
    setNameLatin,
    lifePath: lp,
    birthdayNum: bd,
    personalYearNum: py,
    expression: ex,
    soulUrge: su,
    personality: pe,
    breakdown,
    theme,
    layers,
  } = useNumerologyWorkspace();

  const instantNav = useNumerologyInstantNav();

  const reducedMotion = useReducedMotion() ?? false;
  const heroPointerX = useMotionValue(0.5);
  const heroPointerY = useMotionValue(0.5);
  const heroTiltX = useTransform(heroPointerY, [0, 1], [-3.2, 3.2]);
  const heroTiltY = useTransform(heroPointerX, [0, 1], [3.2, -3.2]);
  const heroSpringTiltX = useSpring(heroTiltX, { stiffness: 280, damping: 28, mass: 0.42 });
  const heroSpringTiltY = useSpring(heroTiltY, { stiffness: 280, damping: 28, mass: 0.42 });

  const onHeroPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      heroPointerX.set((e.clientX - r.left) / r.width);
      heroPointerY.set((e.clientY - r.top) / r.height);
    },
    [reducedMotion, heroPointerX, heroPointerY],
  );

  const onHeroPointerLeave = useCallback(() => {
    heroPointerX.set(0.5);
    heroPointerY.set(0.5);
  }, [heroPointerX, heroPointerY]);

  const markdownSource = useMemo(
    () => ({
      y,
      m,
      d,
      nameLatin,
      calendarYear,
      lifePath: lp,
      birthdayNum: bd,
      personalYearNum: py,
      expression: ex,
      soulUrge: su,
      personality: pe,
      breakdown,
      layers,
    }),
    [y, m, d, nameLatin, calendarYear, lp, bd, py, ex, su, pe, breakdown, layers],
  );

  const unifiedReadingInput = useMemo(
    () => ({
      lifePath: lp,
      y,
      m,
      d,
      calendarYear,
      birthdayNum: bd,
      personalYearNum: py,
      nameLatin,
      expression: ex,
      soulUrge: su,
      personality: pe,
      breakdown,
      layers,
    }),
    [y, m, d, calendarYear, lp, bd, py, nameLatin, ex, su, pe, breakdown, layers],
  );

  const gateHighlightReading = useMemo(
    () => numerologyGateHighlightZh(unifiedReadingInput),
    [unifiedReadingInput],
  );

  const unifiedHandbookBody = useMemo(
    () => numerologyUnifiedHandbookBodyZh(unifiedReadingInput),
    [unifiedReadingInput],
  );

  const metricCells = useMemo(() => {
    const meta = numerologyGateMetricRowsMetaZh(calendarYear);
    const values = [bd, py, ex, su, pe] as const;
    return meta.map((m, i) => ({ ...m, v: values[i] }));
  }, [calendarYear, bd, py, ex, su, pe]);

  const nameThreeReady = ex != null && su != null && pe != null;
  const kpiHeader = useMemo(
    () => numerologyGateKpiHeaderZh(lp, py, bd, calendarYear, nameThreeReady),
    [lp, py, bd, calendarYear, nameThreeReady],
  );

  const latinNameFieldHint = useMemo(() => numerologyGateLatinNameFieldHintZh(nameLatin), [nameLatin]);

  /** 曼陀罗下方通栏：快扫 + 镜鉴四卡（定性 / 展开 / 戒线 / 行法；窄屏横向滑动） */
  const gateMirrorBand = useMemo(() => {
    const mirror = numerologyGateMirrorLinesZh(lp, py);
    const snap = numerologyGateInstantSnapshotPartsZh(lp, py, theme.key);
    return (
      <div
        className={`numerology-depth-mirror relative isolate min-w-0 border-t border-[rgba(168,188,208,0.14)] pt-5 [grid-area:mir] lg:pt-4 ${zhSerif.className}`}
      >
        <div className="space-y-2 rounded-xl border border-[rgba(168,188,208,0.14)] bg-[rgba(168,188,208,0.06)] px-3 py-2.5">
          <p className="text-[12px] leading-relaxed text-[#cbd5e1]">{snap.lead}</p>
          <p className="text-[11px] leading-relaxed text-[#8b9cb0]">{snap.cluster}</p>
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-[#9eb4c8]/65">{numerologyGateMirrorEyebrowZh}</p>
        <div className="mt-2 flex snap-x snap-mandatory flex-row gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] lg:mt-2 lg:grid lg:w-full lg:snap-none lg:grid-cols-4 lg:gap-3 lg:overflow-visible lg:pb-0">
          <NumerologyMirrorChapterCard
            serifClassName={zhSerif.className}
            chapterTitle="定性"
            text={mirror.dingpan}
            className="min-w-[min(280px,86vw)] shrink-0 snap-start lg:min-w-0"
          />
          <NumerologyMirrorChapterCard
            serifClassName={zhSerif.className}
            chapterTitle="展开"
            text={mirror.zhankai}
            className="min-w-[min(280px,86vw)] shrink-0 snap-start lg:min-w-0"
          />
          <NumerologyMirrorChapterCard
            serifClassName={zhSerif.className}
            chapterTitle="戒线"
            text={mirror.jiexian}
            className="min-w-[min(280px,86vw)] shrink-0 snap-start lg:min-w-0"
          />
          <NumerologyMirrorChapterCard
            serifClassName={zhSerif.className}
            chapterTitle="行法"
            text={mirror.xingfa}
            className="min-w-[min(280px,86vw)] shrink-0 snap-start lg:min-w-0"
          />
        </div>
        <p className={`mt-3 text-[12px] leading-relaxed text-[#94a3b8] ${zhSerif.className}`}>{mirror.tail}</p>
      </div>
    );
  }, [lp, py, theme.key]);

  const layerBlocks: { step: string; anchorId: string; title: string; body: ReactNode }[] = useMemo(() => {
    const rawFoot = numerologyGateRawTableRowFootnotesZh({
      calendarYear,
      lifePath: lp,
      personalYear: py,
      breakdown,
    });
    const rawSettleRows: { key: string; label: string; value: string; note: string }[] = [
      { key: "m", label: numerologyGateRawTableZh.monthReduced, value: String(breakdown.monthReduced), note: rawFoot.monthReduced },
      { key: "d", label: numerologyGateRawTableZh.dayReduced, value: String(breakdown.dayReduced), note: rawFoot.dayReduced },
      { key: "y", label: numerologyGateRawTableZh.yearReduced, value: String(breakdown.yearReduced), note: rawFoot.yearReduced },
      {
        key: "c",
        label: numerologyGateRawTableZh.combined,
        value: `${breakdown.combinedRaw} → ${lp}`,
        note: rawFoot.combined,
      },
      {
        key: "py",
        label: numerologyGateRawTableZh.personalYear(calendarYear),
        value: String(py),
        note: rawFoot.personalYear,
      },
    ];
    const bdLayer = birthdayNumberLayerCopyZh(bd);
    const exLayer = ex != null ? expressionLayerCopyZh(ex) : null;
    const suLayer = su != null ? soulUrgeLayerCopyZh(su) : null;
    const peLayer = pe != null ? personalityLayerCopyZh(pe) : null;
    const subBody = `text-[14px] leading-[1.68] text-[#cbd5e1] ${zhSerif.className}`;
    const handbookBody = `text-[14px] leading-[1.68] sm:text-[15px] sm:leading-[1.7] text-[#cbd5e1] ${zhSerif.className}`;
    const highlightBody = `text-[13px] leading-[1.72] tracking-[0.02em] text-[#dce6ef] ${zhSerif.className}`;
    const listenModuleTitleClass = `text-[11px] font-medium tracking-[0.14em] text-[#94a3b8] ${zhSerif.className}`;
    const listenModuleShellClass =
      "space-y-3 rounded-2xl border border-[rgba(168,188,208,0.12)] bg-[rgba(6,12,18,0.42)] p-4 sm:p-5";
    return [
      {
        step: "1",
        anchorId: NUMEROLOGY_GATE_ANCHOR.layerListen,
        title: numerologyGateReadoutPhaseTitlesZh.listen,
        body: (
          <div className="space-y-7 sm:space-y-8">
            <section className={listenModuleShellClass}>
              <p className={listenModuleTitleClass}>{numerologyGateReadoutListenModuleTitlesZh.mainline}</p>
              <NumerologyHandbookPrelineBlocks text={gateHighlightReading} className={highlightBody} gapClassName="gap-2" />
            </section>
            <section className={listenModuleShellClass}>
              <p className={listenModuleTitleClass}>{numerologyGateReadoutListenModuleTitlesZh.align}</p>
              <NumerologyHandbookPrelineBlocks text={unifiedHandbookBody} className={handbookBody} gapClassName="gap-2" />
            </section>
            <section className={listenModuleShellClass}>
              <p className={listenModuleTitleClass}>{numerologyGateReadoutListenModuleTitlesZh.unfold}</p>
              <div className="space-y-5">
                <NumerologyHandbookPrelineBlocks text={numerologyReadingVoiceLogicPreambleZh()} className={handbookBody} gapClassName="gap-2" />
                <NumerologyHandbookPrelineBlocks text={layers.logic} className={handbookBody} gapClassName="gap-2" />
                <NumerologyHandbookPrelineBlocks text={bdLayer.logic} className={subBody} gapClassName="gap-2" />
                {exLayer ? <NumerologyHandbookPrelineBlocks text={exLayer.logic} className={subBody} gapClassName="gap-2" /> : null}
                {suLayer ? <NumerologyHandbookPrelineBlocks text={suLayer.logic} className={subBody} gapClassName="gap-2" /> : null}
                {peLayer ? <NumerologyHandbookPrelineBlocks text={peLayer.logic} className={subBody} gapClassName="gap-2" /> : null}
              </div>
            </section>
          </div>
        ),
      },
      {
        step: "2",
        anchorId: NUMEROLOGY_GATE_ANCHOR.layerSettle,
        title: numerologyGateReadoutPhaseTitlesZh.settle,
        body: (
          <div className={`space-y-5 overflow-x-auto text-[14px] ${zhSerif.className}`}>
            <p className="text-[13px] leading-relaxed text-[#94a3b8] sm:text-[14px]">{numerologyGateRawLayerIntroZh}</p>
            <div className="w-full min-w-0 space-y-2.5 sm:space-y-3" role="list">
              {rawSettleRows.map((row) => (
                <div
                  key={row.key}
                  role="listitem"
                  className="rounded-xl border border-[rgba(168,188,208,0.14)] bg-[rgba(8,16,26,0.45)] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-4 sm:py-3.5"
                >
                  <div className="flex min-w-0 items-baseline justify-between gap-3">
                    <span className="min-w-0 flex-1 text-[12px] font-normal leading-snug tracking-wide text-[#94a3b8] sm:text-[13px]">
                      {row.label}
                    </span>
                    <span
                      className={`shrink-0 tabular-nums text-lg font-semibold tracking-tight text-[#f1f5f9] sm:text-xl ${displaySerif.className}`}
                    >
                      {row.value}
                    </span>
                  </div>
                  <p className="mt-2.5 border-t border-[rgba(168,188,208,0.1)] pt-2.5 text-pretty text-[11px] leading-relaxed break-words text-[#8b9cb0] sm:text-[12px] sm:leading-relaxed">
                    {row.note}
                  </p>
                </div>
              ))}
            </div>
            <details className="group rounded-xl border border-[rgba(168,188,208,0.12)] bg-[rgba(6,14,24,0.3)]">
              <summary className="flex cursor-pointer list-none items-start gap-2.5 px-3 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
                <ChevronDown
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#94a3b8] transition-transform group-open:rotate-180"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 break-words text-[13px] leading-snug text-[#cbd5e1] sm:text-[14px]">
                  {numerologyGateReadoutSettleHandbookDetailsSummaryZh}
                </span>
              </summary>
              <div className={`border-t border-[rgba(168,188,208,0.1)] px-3 pb-3 pt-2 ${zhSerif.className}`}>
                <NumerologyMirrorHandbook
                  text={numerologyGateRawLayerHandbookZh({
                    calendarYear,
                    lifePath: lp,
                    personalYear: py,
                    breakdown,
                  })}
                  bodyClassName="text-[14px] leading-[1.68] text-[#d4dfe6]"
                />
              </div>
            </details>
            <ul
              className={`list-inside list-disc space-y-2.5 border-t border-[rgba(168,188,208,0.1)] pt-4 text-[14px] leading-[1.68] text-[#cbd5e1] sm:text-[15px] sm:leading-[1.72] ${zhSerif.className}`}
            >
              {numerologyGateExecMemoBulletsZh(lp, py).map((line, i) => (
                <li key={i} className="whitespace-pre-line">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ),
      },
    ];
  }, [
    bd,
    breakdown,
    calendarYear,
    ex,
    gateHighlightReading,
    layers.logic,
    lp,
    pe,
    py,
    su,
    unifiedHandbookBody,
  ]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.location.hash.replace(/^#/, "").trim();
    if (!id) return;
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const tid = window.setTimeout(run, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(tid);
    };
  }, []);

  return (
      <div className="w-full min-w-0 space-y-6 sm:space-y-7 lg:pl-[min(7.5vw,4rem)] xl:pl-[min(7.5vw,4.5rem)]">
      {/* 首屏单卡：lg 三列等宽（导航｜曼陀罗｜生辰），镜鉴通栏占第二行；透视 + 微视差 + Z 分层 */}
      <div className="w-full min-w-0">
        <NumerologyGlassCard className="numerology-hero-depth-card min-h-0 min-w-0">
          <div className="numerology-depth-stage min-w-0">
            <motion.div
              className="numerology-depth-root grid min-w-0 grid-cols-1 gap-6 [grid-template-areas:'nav'_'m'_'mir'_'b'] sm:gap-7 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-5 lg:[grid-template-areas:'nav_m_b'_'mir_mir_mir'] xl:gap-x-7"
              style={{
                transformStyle: "preserve-3d",
                rotateX: reducedMotion ? 0 : heroSpringTiltX,
                rotateY: reducedMotion ? 0 : heroSpringTiltY,
              }}
              onPointerMove={onHeroPointerMove}
              onPointerLeave={onHeroPointerLeave}
            >
            <div className="numerology-depth-nav [grid-area:nav] min-w-0 w-full self-start lg:sticky lg:top-1">
              <NumerologyEnergyNavPanel
                embedded
                className="min-w-0 w-full"
                currentPath={instantNav?.instantPath}
                onNavigate={instantNav?.navigate}
              />
            </div>
            <div className="numerology-depth-mandala [grid-area:m] numerology-mandala-disc numerology-mandala-hex-shell numerology-mandala-rim relative mx-auto aspect-square w-full max-w-[min(100%,400px)] min-w-0 shrink-0 justify-self-center overflow-visible border border-white/[0.08] bg-[radial-gradient(ellipse_68%_68%_at_50%_50%,rgba(255,255,255,0.09),transparent_58%)] sm:max-w-[min(100%,380px)] lg:mx-0 lg:max-w-full lg:justify-self-center">
                <div className="absolute inset-0 flex items-center justify-center p-[3px] text-[#9eb4c8]">
                  <NumerologyMandala2D
                    lifePath={lp}
                    stroke={theme.mandalaStroke}
                    accentRgb={theme.accentRgb}
                    className="h-full w-full max-h-full max-w-full"
                  />
                </div>
                <div className="numerology-mandala-enter pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                  <span
                    className="numerology-lp-metal leading-none tabular-nums"
                    style={{
                      fontFamily: displaySerif.style.fontFamily,
                      fontSize: "clamp(5.25rem, 14vw, 8.5rem)",
                    }}
                  >
                    {lp}
                  </span>
                </div>
              </div>

              {gateMirrorBand}

              <div className="numerology-depth-form [grid-area:b] flex w-full min-w-0 flex-col justify-center border-t border-[rgba(168,188,208,0.14)] pt-5 sm:mx-auto sm:max-w-[min(100%,19rem)] lg:mx-0 lg:max-w-none lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 xl:pl-6">
                <div className="flex w-full min-w-0 max-w-full flex-col gap-4 self-start sm:gap-5">
                  <NumerologyGregorianDateField
                    y={y}
                    m={m}
                    d={d}
                    setY={setY}
                    setM={setM}
                    setD={setD}
                    serifHintClassName={zhSerif.className}
                  />
                  <label className="flex w-full min-w-0 flex-col gap-1.5">
                    <span className="text-[12px] text-[#94a3b8]">{numerologyGateNameLatinLabelZh}</span>
                    <input
                      type="text"
                      value={nameLatin}
                      onChange={(e) => setNameLatin(e.target.value)}
                      placeholder="LI SIHAN"
                      className={`${numerologyInputClassName} !text-left !tracking-[0.12em]`}
                      autoComplete="off"
                    />
                    {latinNameFieldHint ? (
                      <p className={`mt-2 text-[12px] leading-relaxed text-amber-200/90 ${zhSerif.className}`}>
                        {latinNameFieldHint}
                      </p>
                    ) : null}
                    {nameLatin.trim() && numerologyNameHasLatinLetters(nameLatin) ? (
                      <div className="mt-3 rounded-lg border border-[rgba(168,188,208,0.14)] bg-[rgba(8,14,22,0.45)] px-3 py-3">
                        <p className={`text-[11px] font-medium tracking-[0.18em] text-[#a8b8c8] ${zhSerif.className}`}>
                          姓名三数 · 本页已算
                        </p>
                        <p className={`mt-2 whitespace-pre-line text-[13px] leading-relaxed text-[#e2e8f0] sm:text-[14px] sm:leading-relaxed ${zhSerif.className}`}>
                          {numerologyNameThreeSummaryZh(nameLatin, ex, su, pe)}
                        </p>
                        <p className={`mt-2 text-[12px] leading-relaxed text-[#94a3b8] ${zhSerif.className}`}>
                          更长手册句在下方「读数分层」第一段同一块里。
                        </p>
                      </div>
                    ) : null}
                  </label>
                </div>
              </div>
            </motion.div>
          </div>
        </NumerologyGlassCard>
      </div>

      {/* 单卡 KPI 栅格：类似分析产品顶栏指标带，避免五张空卡「漏风」 */}
      <NumerologyGlassCard id={NUMEROLOGY_GATE_ANCHOR.kpi} className="scroll-mt-24 !overflow-hidden !p-0">
        <header className="border-b border-[rgba(168,188,208,0.1)] px-4 py-3 sm:px-5 md:px-6 md:py-3.5">
          <p className={`text-[10px] uppercase tracking-[0.26em] text-[#94a3b8] ${zhSerif.className}`}>{numerologyGateKpiTitleZh}</p>
          <div className="mt-2 grid gap-4 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-0">
            <div className="min-w-0 space-y-3">
              <section className="min-w-0">
                <p className={kpiSectionLabelClass}>{kpiHeader.orderLabel}</p>
                <p className={kpiSectionBodyClass}>{kpiHeader.orderBody}</p>
              </section>
              <section className="min-w-0">
                <p className={kpiSectionLabelClass}>{kpiHeader.thesisLabel}</p>
                <div className={kpiSectionBodyClass}>
                  <NumerologyMirrorHandbook
                    text={kpiHeader.thesisBody}
                    bodyClassName="text-[12px] leading-[1.62] text-[#cbd5e1]"
                    labelClassName="text-[9px] font-medium tracking-[0.16em] text-[#7a8b9c]"
                  />
                </div>
              </section>
            </div>
            <div className="min-w-0 space-y-3 border-t border-[rgba(168,188,208,0.12)] pt-3.5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              <section className="min-w-0">
                <p className={kpiSectionLabelClass}>{kpiHeader.nameLabel}</p>
                <p className={kpiSectionBodyClass}>{kpiHeader.nameBody}</p>
              </section>
              <div className="hidden lg:block">
                <NumerologyGateMetricStrip cells={metricCells} variant="embedded" listAriaLabel={numerologyGateKpiTitleZh} />
              </div>
            </div>
          </div>
        </header>
        <div className="lg:hidden">
          <NumerologyGateMetricStrip cells={metricCells} variant="full" listAriaLabel={numerologyGateKpiTitleZh} />
        </div>
      </NumerologyGlassCard>

      <NumerologyGlassCard id={NUMEROLOGY_GATE_ANCHOR.readout} className="scroll-mt-24">
        <div className="flex flex-col gap-2 border-b border-[rgba(168,188,208,0.1)] pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0 max-w-[48rem]">
            <h2 className={`text-lg font-semibold tracking-[0.12em] text-[#f1f5f9] sm:text-xl ${zhSerif.className}`}>{numerologyGateReadoutTitleZh}</h2>
            <p className={`mt-1.5 text-[13px] leading-[1.65] text-[#94a3b8] sm:text-[14px] sm:leading-[1.68] ${zhSerif.className}`}>
              <span className="text-[#cbd5e1]">{numerologyGateReadoutStatusLeadZh}</span>
              {numerologyGateReadoutStatusBodyZh}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-3.5">
          {layerBlocks.map((block) => (
            <article
              key={block.anchorId}
              id={block.anchorId}
              className="scroll-mt-24 rounded-2xl border border-[rgba(168,188,208,0.1)] bg-[rgba(10,14,20,0.35)] p-3.5 sm:p-4 md:p-5"
            >
              <div className="flex gap-3 sm:gap-3.5">
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(168,188,208,0.2)] bg-[rgba(168,188,208,0.08)] text-[12px] font-semibold tabular-nums text-[#cbd5e1]"
                  aria-hidden
                >
                  {block.step}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="sr-only" style={{ fontFamily: zhSerif.style.fontFamily }}>
                    第{block.step}段 {block.title}
                  </h3>
                  <div>{block.body}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className={`mt-8 border-t border-[rgba(168,188,208,0.08)] pt-6 text-[12px] leading-relaxed text-[#94a3b8] ${zhSerif.className}`}>
          {numerologyGateDisclaimerZh}
        </p>
        <NumerologyExportMarkdownButtons source={markdownSource} />
      </NumerologyGlassCard>
    </div>
  );
}
