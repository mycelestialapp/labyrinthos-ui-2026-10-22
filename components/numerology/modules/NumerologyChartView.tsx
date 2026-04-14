"use client";

import { Noto_Serif_SC } from "next/font/google";
import { NumerologyMandala2D } from "@/components/numerology/NumerologyMandala2D";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyGlassCard } from "@/components/numerology/numerology-shared-ui";

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/** 个人星图：当前工作台生辰下的主路径与辅数一览 */
export function NumerologyChartView() {
  const ws = useNumerologyWorkspace();
  const nums = [
    { k: "生命路径", v: ws.lifePath, d: "主数" },
    { k: "生日数", v: ws.birthdayNum, d: "日柱" },
    { k: "个人年", v: ws.personalYearNum, d: String(ws.calendarYear) },
    { k: "表现数", v: ws.expression ?? "—", d: "外显" },
    { k: "灵魂数", v: ws.soulUrge ?? "—", d: "内驱" },
    { k: "人格数", v: ws.personality ?? "—", d: "初见" },
  ];

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <NumerologyGlassCard>
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#9eb4c8]/55">个人星图</p>
        <p className={`mt-3 text-[13px] leading-relaxed text-[#cbd5e1] ${zhSerif.className}`}>
          与「寰宇之门」同源数据：公历 {ws.y}-{String(ws.m).padStart(2, "0")}-{String(ws.d).padStart(2, "0")}
          {ws.nameLatin ? ` · ${ws.nameLatin}` : ""}。主路径能量主题为「{ws.theme.label}」。
        </p>
        <div className="numerology-mandala-disc relative mx-auto mt-6 aspect-square w-full max-w-[240px] min-w-0 sm:mt-8">
          <div className="absolute inset-0 flex items-center justify-center text-[#9eb4c8]/80">
            <NumerologyMandala2D
              lifePath={ws.lifePath}
              stroke={ws.theme.mandalaStroke}
              accentRgb={ws.theme.accentRgb}
              className="h-full w-full"
            />
          </div>
          <div className="relative z-10 flex h-full items-center justify-center text-5xl tabular-nums text-[#f1f5f9]">{ws.lifePath}</div>
        </div>
      </NumerologyGlassCard>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {nums.map((row) => (
          <NumerologyGlassCard key={row.k} className="!py-4">
            <p className="text-[9px] uppercase tracking-[0.28em] text-[#94a3b8]">{row.k}</p>
            <p className="mt-2 text-2xl tabular-nums text-[#f1f5f9]">{row.v}</p>
            <p className="mt-1 text-[9px] text-[#94a3b8]">{row.d}</p>
          </NumerologyGlassCard>
        ))}
      </div>

      <NumerologyGlassCard>
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#9eb4c8]/55">判读摘要</p>
        <p className={`mt-4 text-[14px] leading-[1.85] text-[#cbd5e1] ${zhSerif.className}`}>{ws.layers.snapshot}</p>
      </NumerologyGlassCard>
    </div>
  );
}
