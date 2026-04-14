"use client";

import { Noto_Serif_SC } from "next/font/google";
import { personalYear } from "@/lib/numerology-pythagorean";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyGlassCard } from "@/components/numerology/numerology-shared-ui";

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/** 时序轮盘：以当前生辰为锚，列出相邻年份个人年 */
export function NumerologyWheelView() {
  const { m, d, calendarYear } = useNumerologyWorkspace();
  const span = 6;
  const rows = Array.from({ length: span * 2 + 1 }, (_, i) => {
    const y = calendarYear - span + i;
    return { year: y, py: personalYear(m, d, y) };
  });

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <NumerologyGlassCard>
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#9eb4c8]/55">时序轮盘</p>
        <p className={`mt-3 text-[13px] leading-relaxed text-[#cbd5e1] ${zhSerif.className}`}>
          以工作台月日为锚，列出自 {calendarYear - span} 至 {calendarYear + span} 各公历年个人年（毕达哥拉斯化约规则与主路径一致）。
        </p>
      </NumerologyGlassCard>

      <NumerologyGlassCard className="!p-0 overflow-hidden">
        <div className="w-full overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[260px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(168,188,208,0.15)] text-[#94a3b8]">
              <th className="px-4 py-3 font-normal">公历年</th>
              <th className="px-4 py-3 font-normal">个人年</th>
            </tr>
          </thead>
          <tbody className="text-[#cbd5e1]">
            {rows.map((r) => (
              <tr
                key={r.year}
                className={`border-b border-[rgba(168,188,208,0.08)] ${r.year === calendarYear ? "bg-[rgba(168,188,208,0.08)]" : ""}`}
              >
                <td className="px-4 py-2.5 tabular-nums">{r.year}</td>
                <td className="px-4 py-2.5 tabular-nums text-[#f1f5f9]">{r.py}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </NumerologyGlassCard>
    </div>
  );
}
