"use client";

import { Noto_Serif_SC } from "next/font/google";
import { useMemo } from "react";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyGlassCard, NumerologyHandbookPrelineBlocks } from "@/components/numerology/numerology-shared-ui";
import { numerologyMatrixHandbookFoldLayersZh } from "@/lib/numerology-matrix-handbook-zh";
import {
  numerologyMatrixIntroBodyZh,
  numerologyMatrixInsightBodyZh,
  numerologyMatrixLitRootsZh,
} from "@/lib/numerology-matrix-readout-zh";

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/** 能量矩阵：1–9 基底格，高亮当前命盘出现的数字 */
export function NumerologyMatrixView() {
  const ws = useNumerologyWorkspace();
  const rootDigits = useMemo(
    () =>
      numerologyMatrixLitRootsZh({
        lifePath: ws.lifePath,
        birthdayNum: ws.birthdayNum,
        personalYearNum: ws.personalYearNum,
        expression: ws.expression,
        soulUrge: ws.soulUrge,
        personality: ws.personality,
      }),
    [ws.lifePath, ws.birthdayNum, ws.personalYearNum, ws.expression, ws.soulUrge, ws.personality],
  );
  const rootSet = useMemo(() => new Set(rootDigits), [rootDigits]);
  const introBody = useMemo(() => numerologyMatrixIntroBodyZh(), []);
  const handbookUi = useMemo(() => numerologyMatrixHandbookFoldLayersZh(rootDigits), [rootDigits]);
  const insightBody = useMemo(
    () =>
      numerologyMatrixInsightBodyZh({
        rootDigits,
        themeLabel: ws.theme.label,
        themeKey: ws.theme.key,
        lifePath: ws.lifePath,
        birthdayNum: ws.birthdayNum,
        personalYearNum: ws.personalYearNum,
        expression: ws.expression,
        soulUrge: ws.soulUrge,
        personality: ws.personality,
      }),
    [
      rootDigits,
      ws.theme.label,
      ws.theme.key,
      ws.lifePath,
      ws.birthdayNum,
      ws.personalYearNum,
      ws.expression,
      ws.soulUrge,
      ws.personality,
    ],
  );

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <NumerologyGlassCard>
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#9eb4c8]/55">能量矩阵</p>
        <div className="mt-3">
          <NumerologyHandbookPrelineBlocks
            text={introBody}
            className={`text-[13px] leading-relaxed text-[#cbd5e1] ${zhSerif.className}`}
            gapClassName="gap-2.5"
          />
        </div>
        <p className={`mt-5 border-t border-[rgba(148,163,184,0.12)] pt-4 text-[10px] uppercase tracking-[0.26em] text-[#94a3b8] ${zhSerif.className}`}>
          伴读
        </p>
        <div className="mt-2">
          <NumerologyHandbookPrelineBlocks
            text={insightBody}
            className={`text-[13px] leading-relaxed text-[#cbd5e1] sm:text-[14px] sm:leading-[1.68] ${zhSerif.className}`}
            gapClassName="gap-2.5"
          />
        </div>
      </NumerologyGlassCard>

      <NumerologyGlassCard className="!overflow-hidden">
        <p className={`text-[10px] uppercase tracking-[0.26em] text-[#94a3b8] ${zhSerif.className}`}>格数手册</p>
        <div
          className="mx-auto mt-3 grid w-full max-w-[min(100%,20rem)] grid-cols-3 gap-2 sm:max-w-md"
          aria-label="当前命盘亮格：1–9 化约去重"
        >
          {Array.from({ length: 9 }, (_, i) => {
            const n = i + 1;
            const on = rootSet.has(n);
            return (
              <NumerologyGlassCard
                key={n}
                className={`!flex !aspect-square !items-center !justify-center !p-0 text-2xl tabular-nums ${
                  on ? "border-[rgba(168,188,208,0.55)] text-[#f1f5f9]" : "text-[#94a3b8]/70"
                }`}
              >
                {n}
              </NumerologyGlassCard>
            );
          })}
        </div>
        <p className={`mt-4 text-[11px] leading-relaxed text-[#64748b] ${zhSerif.className}`}>
          亮格多则叠读条数随层而涨（例：四亮格时两两 6 条、三三 4 条、四格 1 条），穷举使然，非逼你一夜读完。首屏为开篇与单格；双格默认展开，三格及以上收于折叠。念到哪段算哪段，仍以主路径与个人年为纲。
        </p>
        <div
          className={`mt-3 max-h-[min(70vh,28rem)] space-y-3 overflow-y-auto overscroll-y-contain pr-1 ${zhSerif.className}`}
          tabIndex={0}
          aria-label="格数手册：单格至多格叠读长文"
        >
          {handbookUi.emptyMessage ? (
            <NumerologyHandbookPrelineBlocks
              text={handbookUi.emptyMessage}
              className={`text-[13px] leading-relaxed text-[#cbd5e1] sm:text-[14px] sm:leading-[1.68] ${zhSerif.className}`}
              gapClassName="gap-3"
            />
          ) : (
            <>
              <NumerologyHandbookPrelineBlocks
                text={handbookUi.introAndSingles}
                className={`text-[13px] leading-relaxed text-[#cbd5e1] sm:text-[14px] sm:leading-[1.68] ${zhSerif.className}`}
                gapClassName="gap-3"
              />
              {handbookUi.folds.map((layer) => (
                <details
                  key={layer.key}
                  open={layer.defaultOpen}
                  className="group rounded-lg border border-[rgba(148,163,184,0.14)] bg-[rgba(15,23,42,0.28)] px-3 py-2 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary
                    className={`list-none cursor-pointer select-none text-[12px] leading-snug tracking-wide text-[#94a3b8] outline-none ring-offset-2 ring-offset-[#0f172a] marker:content-none focus-visible:ring-2 focus-visible:ring-[rgba(148,163,184,0.45)] ${zhSerif.className}`}
                  >
                    <span className="text-[#cbd5e1] group-open:text-[#e2e8f0]">{layer.summary}</span>
                    <span className="ml-2 text-[10px] text-[#64748b]">点击展开 / 收起</span>
                  </summary>
                  <div className="mt-2 border-t border-[rgba(148,163,184,0.1)] pt-2">
                    <NumerologyHandbookPrelineBlocks
                      text={layer.body}
                      className={`text-[13px] leading-relaxed text-[#cbd5e1] sm:text-[14px] sm:leading-[1.68] ${zhSerif.className}`}
                      gapClassName="gap-3"
                    />
                  </div>
                </details>
              ))}
            </>
          )}
        </div>
      </NumerologyGlassCard>
    </div>
  );
}
