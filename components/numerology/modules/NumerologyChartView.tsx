"use client";

import Link from "next/link";
import { Noto_Serif_SC } from "next/font/google";
import { NumerologyGateMetricStrip } from "@/components/numerology/NumerologyGateMetricStrip";
import { NumerologyMandala2D } from "@/components/numerology/NumerologyMandala2D";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyGlassCard, NumerologyHandbookPrelineBlocks } from "@/components/numerology/numerology-shared-ui";
import {
  numerologyChartFieldRowsZh,
  numerologyChartTotalSummaryBodyZh,
} from "@/lib/numerology-chart-field-blurbs-zh";
import {
  numerologyGateChartReadoutStatusBodyZh,
  numerologyGateKpiIntroZh,
  numerologyGateKpiTitleZh,
  numerologyGateMetricRowsMetaZh,
  numerologyGateReadoutPhaseTitlesZh,
  numerologyGateReadoutStatusLeadZh,
  numerologyGateReadoutTitleZh,
} from "@/lib/numerology-gate-ui-copy-zh";
import { NUMEROLOGY_GATE_ANCHOR, numerologyGateHref } from "@/lib/numerology-gate-scroll-anchors";
import type { NumerologyUnifiedDeepReadingInput } from "@/lib/numerology-unified-deep-reading-zh";
import { useMemo } from "react";

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const gateCtaPrimaryClass = `inline-flex min-h-[2.75rem] flex-1 items-center justify-center rounded-xl border border-sky-400/45 bg-sky-500/[0.18] px-3 py-2 text-center text-[13px] font-semibold leading-snug text-sky-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:bg-sky-500/[0.28] sm:min-h-0 sm:flex-none sm:px-5 ${zhSerif.className}`;

const gateCtaSecondaryClass = `inline-flex min-h-[2.5rem] flex-1 items-center justify-center rounded-xl border border-[rgba(148,163,184,0.35)] bg-[rgba(15,23,42,0.45)] px-3 py-2 text-center text-[12px] font-medium leading-snug text-[#e2e8f0] transition-colors hover:border-sky-400/35 hover:bg-[rgba(30,41,59,0.55)] sm:min-h-0 sm:flex-none sm:px-4 ${zhSerif.className}`;

const gateInlineLinkClass = `font-medium text-sky-300 underline decoration-sky-400/50 underline-offset-2 hover:text-sky-200 ${zhSerif.className}`;

/** 个人星图：与之门「读数分层」术语对齐 + 锚点直达 */
export function NumerologyChartView() {
  const ws = useNumerologyWorkspace();

  const chartReadingInput = useMemo(
    (): NumerologyUnifiedDeepReadingInput => ({
      lifePath: ws.lifePath,
      y: ws.y,
      m: ws.m,
      d: ws.d,
      calendarYear: ws.calendarYear,
      birthdayNum: ws.birthdayNum,
      personalYearNum: ws.personalYearNum,
      nameLatin: ws.nameLatin,
      expression: ws.expression,
      soulUrge: ws.soulUrge,
      personality: ws.personality,
      breakdown: ws.breakdown,
      layers: ws.layers,
    }),
    [
      ws.lifePath,
      ws.y,
      ws.m,
      ws.d,
      ws.calendarYear,
      ws.birthdayNum,
      ws.personalYearNum,
      ws.nameLatin,
      ws.expression,
      ws.soulUrge,
      ws.personality,
      ws.breakdown,
      ws.layers,
    ],
  );

  const fieldRows = useMemo(() => numerologyChartFieldRowsZh(chartReadingInput), [chartReadingInput]);
  const totalSummaryBody = useMemo(
    () => numerologyChartTotalSummaryBodyZh(chartReadingInput),
    [chartReadingInput],
  );

  const metricCells = useMemo(() => {
    const meta = numerologyGateMetricRowsMetaZh(ws.calendarYear);
    const values = [ws.birthdayNum, ws.personalYearNum, ws.expression, ws.soulUrge, ws.personality] as const;
    return meta.map((m, i) => ({ ...m, v: values[i] }));
  }, [ws.calendarYear, ws.birthdayNum, ws.personalYearNum, ws.expression, ws.soulUrge, ws.personality]);

  const mandalaWedgeLabels = useMemo(
    () =>
      [
        String(ws.lifePath),
        String(ws.birthdayNum),
        String(ws.personalYearNum),
        ws.expression == null ? "—" : String(ws.expression),
        ws.soulUrge == null ? "—" : String(ws.soulUrge),
        ws.personality == null ? "—" : String(ws.personality),
      ] as const,
    [ws.lifePath, ws.birthdayNum, ws.personalYearNum, ws.expression, ws.soulUrge, ws.personality],
  );

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <NumerologyGlassCard>
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#9eb4c8]/55">个人星图</p>
        <p className={`mt-3 text-[13px] leading-relaxed text-[#cbd5e1] ${zhSerif.className}`}>
          与「寰宇之门」同源：公历 {ws.y}-{String(ws.m).padStart(2, "0")}-{String(ws.d).padStart(2, "0")}
          {ws.nameLatin ? ` · ${ws.nameLatin}` : ""}。主路径能量主题为「{ws.theme.label}」。要全文对照，优先点下面蓝色主按钮；之门会滚到同一块。
        </p>
        <div className="numerology-mandala-disc numerology-mandala-hex-shell relative mx-auto mt-6 flex aspect-square w-full max-w-[240px] min-h-0 min-w-0 items-center justify-center sm:mt-8">
          <NumerologyMandala2D
            lifePath={ws.lifePath}
            stroke={ws.theme.mandalaStroke}
            accentRgb={ws.theme.accentRgb}
            className="h-full w-full"
            wedgeLabels={mandalaWedgeLabels}
          />
        </div>
        <div className="mt-6 space-y-3 rounded-xl border border-sky-400/30 bg-[linear-gradient(165deg,rgba(14,165,233,0.12),rgba(15,23,42,0.65))] px-3 py-3.5 sm:px-4">
          <p className={`text-[12px] font-semibold tracking-wide text-sky-100 ${zhSerif.className}`}>先去哪？</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
            <Link href={numerologyGateHref(NUMEROLOGY_GATE_ANCHOR.readout)} prefetch className={gateCtaPrimaryClass}>
              寰宇之门：滚到「读数分层」
            </Link>
            <Link href={numerologyGateHref(NUMEROLOGY_GATE_ANCHOR.layerListen)} prefetch className={gateCtaSecondaryClass}>
              第一段：{numerologyGateReadoutPhaseTitlesZh.listen}
            </Link>
            <Link href={numerologyGateHref(NUMEROLOGY_GATE_ANCHOR.layerSettle)} prefetch className={gateCtaSecondaryClass}>
              第二段：{numerologyGateReadoutPhaseTitlesZh.settle}
            </Link>
          </div>
        </div>
      </NumerologyGlassCard>

      <NumerologyGlassCard>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <h2 className={`text-lg font-semibold tracking-[0.12em] text-[#f1f5f9] sm:text-xl ${zhSerif.className}`}>
            {numerologyGateReadoutTitleZh}
          </h2>
          <Link href={numerologyGateHref(NUMEROLOGY_GATE_ANCHOR.readout)} prefetch className={gateCtaPrimaryClass}>
            在之门打开同一屏
          </Link>
        </div>
        <p className={`mt-3 text-[12px] leading-relaxed text-[#94a3b8] ${zhSerif.className}`}>
          <span className="text-[#cbd5e1]">{numerologyGateReadoutStatusLeadZh}</span>
          {numerologyGateChartReadoutStatusBodyZh}
        </p>
        <ol className={`mt-4 list-decimal space-y-2.5 pl-[1.15rem] text-[12px] leading-relaxed text-[#b8c9d6] marker:text-[#64748b] sm:text-[13px] sm:leading-[1.65] ${zhSerif.className}`}>
          <li>
            这一排「{numerologyGateKpiTitleZh}」五格 → 之门首屏同卡{" "}
            <Link href={numerologyGateHref(NUMEROLOGY_GATE_ANCHOR.kpi)} prefetch className={gateInlineLinkClass}>
              点这里直达
            </Link>
            （数应一致）。
          </li>
          <li>
            下面六条摘句、叠读与长推演 → 之门第一段「{numerologyGateReadoutPhaseTitlesZh.listen}」{" "}
            <Link href={numerologyGateHref(NUMEROLOGY_GATE_ANCHOR.layerListen)} prefetch className={gateInlineLinkClass}>
              点这里滚到同一段
            </Link>
            （高光与手册在上，推演接在同一段里）。
          </li>
          <li>
            算式验算、表与备忘清单 → 第二段「{numerologyGateReadoutPhaseTitlesZh.settle}」{" "}
            <Link href={numerologyGateHref(NUMEROLOGY_GATE_ANCHOR.layerSettle)} prefetch className={gateInlineLinkClass}>
              点这里滚到同一段
            </Link>
            。
          </li>
        </ol>
        <p className={`mt-5 text-[10px] uppercase tracking-[0.26em] text-[#94a3b8] ${zhSerif.className}`}>{numerologyGateKpiTitleZh}</p>
        <p className={`mt-2 text-[11px] leading-relaxed text-[#8b9cb0] ${zhSerif.className}`}>{numerologyGateKpiIntroZh}</p>
        <div className="mt-3">
          <NumerologyGateMetricStrip cells={metricCells} variant="full" listAriaLabel={numerologyGateKpiTitleZh} />
        </div>
        <p className={`mt-6 text-[11px] font-medium tracking-[0.18em] text-[#94a3b8] ${zhSerif.className}`}>
          {numerologyGateReadoutPhaseTitlesZh.listen}
          <span className="ml-2 font-normal tracking-normal text-[#64748b]">（首节摘句 · 与之门第一段同源）</span>
        </p>
      </NumerologyGlassCard>

      <div className="space-y-3">
        {fieldRows.map((row) => (
          <NumerologyGlassCard key={row.key} className="!py-4 sm:!py-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-[9px] uppercase tracking-[0.28em] text-[#94a3b8]">{row.key}</p>
              <p className="text-2xl tabular-nums text-[#f1f5f9]">{row.value}</p>
              <p className="text-[9px] text-[#94a3b8]">{row.foot}</p>
            </div>
            <p
              className={`mt-3 whitespace-pre-line border-t border-[rgba(148,163,184,0.12)] pt-3 text-[13px] leading-relaxed text-[#cbd5e1] ${zhSerif.className}`}
            >
              {row.blurb}
            </p>
          </NumerologyGlassCard>
        ))}
      </div>

      <NumerologyGlassCard>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#9eb4c8]/55">总览</p>
            <p className={`mt-2 text-[11px] leading-relaxed text-[#64748b] ${zhSerif.className}`}>
              叠读与收束与之门「读数分层」第一段同一真源；长推演在之门同一段里接在摘句后。
            </p>
          </div>
          <Link href={numerologyGateHref(NUMEROLOGY_GATE_ANCHOR.layerListen)} prefetch className={gateCtaSecondaryClass}>
            去之门听同一段全文
          </Link>
        </div>
        <div className={`mt-3 ${zhSerif.className}`}>
          <NumerologyHandbookPrelineBlocks
            text={totalSummaryBody}
            className={`text-[14px] leading-[1.68] text-[#cbd5e1] sm:leading-[1.7] ${zhSerif.className}`}
            gapClassName="gap-2"
          />
        </div>
      </NumerologyGlassCard>
    </div>
  );
}
