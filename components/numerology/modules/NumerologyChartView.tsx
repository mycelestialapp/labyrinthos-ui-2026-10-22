"use client";

import { Noto_Serif_SC } from "next/font/google";
import { NumerologyGateMetricStrip } from "@/components/numerology/NumerologyGateMetricStrip";
import { NumerologyMandala2D } from "@/components/numerology/NumerologyMandala2D";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyGlassCard } from "@/components/numerology/numerology-shared-ui";
import { numerologyChartFieldRowsZh } from "@/lib/numerology-chart-field-blurbs-zh";
import { numerologyGateKpiTitleZh, numerologyGateMetricRowsMetaZh } from "@/lib/numerology-gate-ui-copy-zh";
import type { NumerologyUnifiedDeepReadingInput } from "@/lib/numerology-unified-deep-reading-zh";
import { useMemo } from "react";

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/** 个人星图：曼陀罗、关键读数五格与各格摘句 */
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

  const metricCells = useMemo(() => {
    const meta = numerologyGateMetricRowsMetaZh(ws.calendarYear);
    const values = [ws.birthdayNum, ws.personalYearNum, ws.expression, ws.soulUrge, ws.personality] as const;
    return meta.map((m, i) => ({ ...m, v: values[i] }));
  }, [ws.calendarYear, ws.birthdayNum, ws.personalYearNum, ws.expression, ws.soulUrge, ws.personality]);

  const fieldRows = useMemo(() => numerologyChartFieldRowsZh(chartReadingInput), [chartReadingInput]);

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
        <div className="numerology-mandala-disc numerology-mandala-hex-shell relative mx-auto flex aspect-square w-full max-w-[min(100%,360px)] min-h-0 min-w-0 items-center justify-center sm:max-w-[min(100%,400px)] md:max-w-[min(100%,440px)]">
          <NumerologyMandala2D
            lifePath={ws.lifePath}
            stroke={ws.theme.mandalaStroke}
            accentRgb={ws.theme.accentRgb}
            className="h-full w-full"
            wedgeLabels={mandalaWedgeLabels}
          />
        </div>
      </NumerologyGlassCard>

      <NumerologyGlassCard>
        <p className={`text-[10px] font-medium uppercase tracking-[0.22em] text-[#94a3b8] ${zhSerif.className}`}>
          {numerologyGateKpiTitleZh}
        </p>
        <div className="mt-3">
          <NumerologyGateMetricStrip cells={metricCells} variant="full" listAriaLabel={numerologyGateKpiTitleZh} />
        </div>
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
    </div>
  );
}
