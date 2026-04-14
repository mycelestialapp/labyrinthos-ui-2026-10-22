"use client";

import { Noto_Serif_SC } from "next/font/google";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyGlassCard } from "@/components/numerology/numerology-shared-ui";

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/** 能量矩阵：1–9 基底格，高亮当前命盘出现的数字 */
function foldTo1to9(n: number): number {
  let x = Math.abs(Math.floor(n));
  while (x > 9) {
    x = `${x}`.split("").reduce((s, ch) => s + Number(ch), 0);
  }
  return x || 1;
}

export function NumerologyMatrixView() {
  const ws = useNumerologyWorkspace();
  const set = new Set<number>();
  [ws.lifePath, ws.birthdayNum, ws.personalYearNum, ws.expression, ws.soulUrge, ws.personality].forEach((n) => {
    if (typeof n === "number") set.add(foldTo1to9(n));
  });

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <NumerologyGlassCard>
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#9eb4c8]/55">能量矩阵</p>
        <p className={`mt-3 text-[13px] leading-relaxed text-[#cbd5e1] ${zhSerif.className}`}>
          九数基底格：高亮为当前工作台中出现的 1–9（主路径、生日数、个人年、姓名三数化约后）；大师数 11/22/33 同时映射其根数位置。
        </p>
      </NumerologyGlassCard>

      <div className="mx-auto grid w-full max-w-[min(100%,20rem)] grid-cols-3 gap-2 sm:max-w-md">
        {Array.from({ length: 9 }, (_, i) => {
          const n = i + 1;
          const on = set.has(n);
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
    </div>
  );
}
