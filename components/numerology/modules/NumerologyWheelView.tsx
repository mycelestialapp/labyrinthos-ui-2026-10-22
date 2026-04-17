"use client";

import { useEffect, useMemo, useState } from "react";
import { Noto_Serif_SC } from "next/font/google";
import { personalYear } from "@/lib/numerology-pythagorean";
import {
  personalYearJudgmentCoreZh,
  personalYearJudgmentOneLineZh,
  personalYearWheelActionBulletsZh,
  personalYearWheelBottomSupplementZh,
  personalYearWheelDeepInterpretationZh,
  personalYearWheelJudgmentSegmentsZh,
  personalYearWheelScreenGuideLinesZh,
} from "@/lib/numerology-personal-year-judgment-zh";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyGlassCard } from "@/components/numerology/numerology-shared-ui";

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const WHEEL_DEEP_SECTION_LABELS_ZH: readonly string[] = [
  "总览与年内气质",
  "工作与钱财",
  "关系与家庭",
  "身体与节律",
  "心智功课",
  "与相邻年对照",
  "四季节奏",
  "职场与协作",
  "学习与技能",
  "若卡顿与纠偏",
  "外缘与时机窗口",
  "之门镜鉴叠读提示",
  "双月备忘 · 正月至二月",
  "双月备忘 · 三月至四月",
  "双月备忘 · 五月至六月",
  "双月备忘 · 七月至八月",
  "双月备忘 · 九月至十月",
  "双月备忘 · 十一月至腊月",
  "钱流与条款备忘",
  "身心底线备忘",
  "跨年衔接备忘",
];

/** 判读提要：与库内 `TABLE` 字数一致，弱标签分行，不对第三列做高度裁切 */
function WheelJudgmentReadout({ py }: { py: number }) {
  const segs = personalYearWheelJudgmentSegmentsZh(py);
  const core = personalYearJudgmentCoreZh(py);
  if (!segs) {
    return (
      <p className="break-words text-[11px] leading-relaxed text-[#94a3b8] sm:text-[12px] sm:leading-[1.65]">{core}</p>
    );
  }
  const line = (label: string, text: string) => (
    <p className="text-pretty text-[11px] leading-relaxed text-[#94a3b8] sm:text-[12px] sm:leading-[1.65]">
      <span className="mr-1.5 inline-block shrink-0 align-top text-[10px] font-medium tracking-wide text-[#64748b]">
        {label}
      </span>
      <span className="align-top">{text}</span>
    </p>
  );
  return (
    <div className={`min-w-0 space-y-1.5 break-words ${zhSerif.className}`}>
      <p className="text-pretty text-[11px] font-medium leading-snug text-[#e2e8f0] sm:text-[12px]">{segs.headline}</p>
      {line("主命题", segs.theme)}
      {line("风险位", segs.risk)}
      {line("操作线", segs.action)}
      {line("顺延读", segs.extend)}
    </div>
  );
}

type WheelAuxPanel = "guide" | "actions" | "deep";

/** 时序轮盘：按生日列出相邻公历年的个人年，便于逐年对照 */
export function NumerologyWheelView() {
  const { m, d, calendarYear } = useNumerologyWorkspace();
  const [selectedYear, setSelectedYear] = useState(calendarYear);
  const [auxPanel, setAuxPanel] = useState<WheelAuxPanel>("guide");
  const span = 6;
  const yStart = calendarYear - span;
  const yEnd = calendarYear + span;
  const rows = Array.from({ length: span * 2 + 1 }, (_, i) => {
    const y = calendarYear - span + i;
    return { year: y, py: personalYear(m, d, y) };
  });
  const currentPy = personalYear(m, d, calendarYear);
  const selectedPy = useMemo(() => personalYear(m, d, selectedYear), [m, d, selectedYear]);
  const currentBottomSupplement = useMemo(() => personalYearWheelBottomSupplementZh(currentPy), [currentPy]);
  const selectedDeepInterpretation = useMemo(
    () => [...personalYearWheelDeepInterpretationZh(selectedPy)],
    [selectedPy],
  );
  const currentActionBullets = useMemo(() => [...personalYearWheelActionBulletsZh(currentPy)], [currentPy]);

  useEffect(() => {
    setSelectedYear(calendarYear);
  }, [calendarYear]);

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <NumerologyGlassCard className="!p-0 overflow-hidden">
        <div className="border-b border-[rgba(168,188,208,0.1)] px-3 py-3 sm:px-4">
          <p className={`text-[10px] uppercase tracking-[0.22em] text-[#94a3b8] ${zhSerif.className}`}>公历年 · 个人年</p>
          <div className="mt-2.5 rounded-lg border border-[rgba(168,188,208,0.08)] bg-[rgba(15,23,42,0.32)] p-2 sm:p-2.5 md:p-3">
            <div className="w-full min-w-0 touch-pan-x overflow-x-auto overscroll-x-contain pb-0.5 [-webkit-overflow-scrolling:touch]">
              <div className="flex w-max flex-nowrap gap-1.5 sm:gap-2">
                {rows.map((r) => {
                  const isCurrent = r.year === calendarYear;
                  const isSelected = r.year === selectedYear;
                  const ringClass = isSelected
                    ? "ring-2 ring-[rgba(129,161,193,0.5)]"
                    : isCurrent
                      ? "ring-1 ring-[rgba(168,188,208,0.2)]"
                      : "hover:border-[rgba(168,188,208,0.22)] hover:bg-[rgba(15,23,42,0.35)]";
                  return (
                    <button
                      key={r.year}
                      type="button"
                      onClick={() => setSelectedYear(r.year)}
                      className={`flex min-h-[44px] min-w-[3.65rem] shrink-0 flex-col items-center justify-center rounded-lg border px-2 py-2 tabular-nums shadow-sm transition-colors sm:min-w-[4.25rem] sm:px-2.5 sm:py-2.5 md:min-w-[5rem] md:px-3 md:py-3 lg:min-w-[5.35rem] ${
                        isCurrent
                          ? "border-[rgba(168,188,208,0.35)] bg-[rgba(168,188,208,0.14)]"
                          : "border-[rgba(168,188,208,0.12)] bg-[rgba(15,23,42,0.35)]"
                      } ${ringClass}`}
                    >
                      <span
                        className={`text-[11px] sm:text-xs md:text-[13px] ${isCurrent ? "font-semibold text-[#f8fafc]" : "text-[#94a3b8]"}`}
                      >
                        {r.year}
                      </span>
                      <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-[#64748b] md:text-[10px]">
                        个人年
                      </span>
                      <span
                        className={`mt-0.5 cursor-help text-sm font-semibold tabular-nums sm:text-base md:text-lg ${isCurrent ? "text-[#f1f5f9]" : "text-[#e2e8f0]"}`}
                        title={personalYearJudgmentOneLineZh(r.py)}
                      >
                        {r.py}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <p
              className={`mt-2 border-t border-[rgba(168,188,208,0.06)] pt-2 text-center text-[11px] leading-snug text-[#64748b] sm:text-[12px] md:mt-2.5 md:pt-2.5 ${zhSerif.className}`}
            >
              <span className="tabular-nums">
                {yStart}—{yEnd}
              </span>
              <span className="mx-1.5 text-[#475569]">·</span>
              共 {rows.length} 个公历年
              <span className="mx-1.5 text-[#475569]">·</span>
              一排横滑可览全部
              <span className="mx-1.5 text-[#475569]">·</span>
              点格切换判读提要
            </p>
          </div>
        </div>

        <div className="min-w-0 px-3 py-3 sm:px-4">
          <p className={`text-[10px] uppercase tracking-[0.22em] text-[#94a3b8] ${zhSerif.className}`}>判读提要</p>
          <p
            className={`mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-[12px] tabular-nums text-[#cbd5e1] sm:text-[13px] ${zhSerif.className}`}
          >
            <span className="text-[#94a3b8]">{selectedYear}</span>
            <span className="text-[#64748b]">·</span>
            <span>个人年 {selectedPy}</span>
            {selectedYear === calendarYear ? (
              <span className="text-[10px] font-normal tracking-wide text-[#94a3b8]">工作台当前年</span>
            ) : null}
          </p>
          <div className="mt-3 min-w-0 overflow-x-auto rounded-lg border border-[rgba(168,188,208,0.1)] bg-[rgba(15,23,42,0.22)] px-3 py-3 sm:px-4">
            <div className="min-w-0" title={personalYearJudgmentOneLineZh(selectedPy)}>
              <WheelJudgmentReadout py={selectedPy} />
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(168,188,208,0.1)] px-3 py-3 sm:px-4">
          <p className={`text-[10px] uppercase tracking-[0.22em] text-[#94a3b8] ${zhSerif.className}`}>延伸阅读</p>
          <p className={`mt-1.5 text-[11px] leading-snug text-[#64748b] sm:text-[12px] ${zhSerif.className}`}>
            横滑年格切换上方判读提要；「深度长读」随所选公历年同步。悬停年格内数字可看整句尾注。
          </p>
          <div
            className="mt-3 flex min-h-[40px] w-full min-w-0 flex-nowrap gap-1 overflow-x-auto overscroll-x-contain pb-0.5 [-webkit-overflow-scrolling:touch]"
            role="tablist"
            aria-label="延伸阅读分区"
          >
            {(
              [
                { id: "guide" as const, label: "页内指南" },
                { id: "actions" as const, label: "本年照做" },
                { id: "deep" as const, label: "深度长读" },
              ] as const
            ).map((t) => {
              const active = auxPanel === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  id={`wheel-aux-tab-${t.id}`}
                  aria-controls={`wheel-aux-panel-${t.id}`}
                  tabIndex={0}
                  onClick={() => setAuxPanel(t.id)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors sm:px-3.5 sm:py-2 sm:text-[12px] ${zhSerif.className} ${
                    active
                      ? "border-[rgba(129,161,193,0.45)] bg-[rgba(129,161,193,0.18)] text-[#e2e8f0]"
                      : "border-[rgba(148,163,184,0.14)] bg-[rgba(15,23,42,0.25)] text-[#94a3b8] hover:border-[rgba(148,163,184,0.22)] hover:text-[#cbd5e1]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div
            id="wheel-aux-panel-guide"
            role="tabpanel"
            aria-labelledby="wheel-aux-tab-guide"
            hidden={auxPanel !== "guide"}
            className="mt-3 min-w-0 rounded-lg border border-[rgba(168,188,208,0.08)] bg-[rgba(15,23,42,0.2)] px-3 py-3 sm:px-4"
          >
            <ol className="list-decimal space-y-2 pl-4 text-[12px] leading-relaxed text-[#cbd5e1] sm:text-[13px] sm:leading-[1.65]">
              {personalYearWheelScreenGuideLinesZh.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </div>

          <div
            id="wheel-aux-panel-actions"
            role="tabpanel"
            aria-labelledby="wheel-aux-tab-actions"
            hidden={auxPanel !== "actions"}
            className="mt-3 min-w-0 rounded-lg border border-[rgba(168,188,208,0.08)] bg-[rgba(15,23,42,0.2)] px-3 py-3 sm:px-4"
          >
            <p className={`mb-2 text-[11px] tabular-nums text-[#94a3b8] ${zhSerif.className}`}>
              工作台 <span className="text-[#cbd5e1]">{calendarYear}</span> 年 · 个人年 {currentPy}
            </p>
            <ul className="list-disc space-y-2 pl-4 text-[12px] leading-relaxed text-[#cbd5e1] sm:text-[13px] sm:leading-[1.65]">
              {currentActionBullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          <div
            id="wheel-aux-panel-deep"
            role="tabpanel"
            aria-labelledby="wheel-aux-tab-deep"
            hidden={auxPanel !== "deep"}
            className="mt-3 min-w-0 rounded-lg border border-[rgba(168,188,208,0.08)] bg-[rgba(15,23,42,0.2)] px-3 py-3 sm:px-4"
          >
            <p className={`mb-3 text-[11px] leading-snug text-[#94a3b8] sm:text-[12px] ${zhSerif.className}`}>
              {selectedYear === calendarYear ? (
                <>
                  <span className="tabular-nums text-[#cbd5e1]">{calendarYear}</span> 年 · 个人年 {selectedPy}（工作台当前年）
                </>
              ) : (
                <>
                  <span className="tabular-nums text-[#cbd5e1]">{selectedYear}</span> 年 · 个人年 {selectedPy}
                  <span className="mt-1 block text-[#64748b]">
                    工作台当前为 <span className="tabular-nums">{calendarYear}</span> 年
                  </span>
                </>
              )}
            </p>
            <div className={`min-w-0 space-y-3 text-[12px] leading-relaxed text-[#cbd5e1] sm:text-[13px] sm:leading-[1.72] ${zhSerif.className}`}>
              {selectedDeepInterpretation.map((para, i) => (
                <p key={`${selectedYear}-${i}`} className="min-w-0 break-words text-pretty">
                  <span className="mr-2 text-[11px] text-[#64748b]">
                    {WHEEL_DEEP_SECTION_LABELS_ZH[i] ?? `续读 ${i + 1}`} ·{" "}
                  </span>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>

        <details className="min-w-0 border-t border-[rgba(168,188,208,0.12)] open:bg-[rgba(15,23,42,0.15)]">
          <summary className="cursor-pointer list-none px-3 py-3 marker:hidden sm:px-5 [&::-webkit-details-marker]:hidden">
            <span className={`flex items-start justify-between gap-3 ${zhSerif.className}`}>
              <span className="min-w-0 flex-1 text-[11px] uppercase leading-snug tracking-[0.18em] text-[#94a3b8] sm:text-[10px] sm:tracking-[0.2em]">
                <span className="text-pretty">
                  当前 {calendarYear} 年 · 个人年 {currentPy} · 节奏与备忘
                </span>
                <span className="mt-1 block font-normal normal-case tracking-normal text-[#64748b]">展开查看</span>
              </span>
              <span className="shrink-0 pt-0.5 text-[10px] leading-none text-[#64748b]" aria-hidden>
                ▼
              </span>
            </span>
          </summary>
          <div
            className={`min-w-0 border-t border-[rgba(168,188,208,0.08)] px-3 pb-4 pt-2 text-[12px] leading-relaxed text-[#cbd5e1] sm:px-5 sm:text-[13px] sm:leading-[1.68] ${zhSerif.className}`}
          >
            <p className="text-pretty text-[12px] leading-relaxed text-[#94a3b8] sm:text-[13px] sm:leading-[1.65]">
              判读正文已分段见上「判读提要」；逐年场面、戒线仍以之门镜鉴「展开」与年度侧写为准。
            </p>
            <p className="mt-3 break-words text-[#94a3b8]">{currentBottomSupplement}</p>
          </div>
        </details>
      </NumerologyGlassCard>
    </div>
  );
}
