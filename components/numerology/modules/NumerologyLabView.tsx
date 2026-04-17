"use client";

import { Noto_Serif_SC } from "next/font/google";
import { useMemo, useState } from "react";
import { reduceWithMaster } from "@/lib/numerology-pythagorean";
import { NumerologyGlassCard, numerologyInputClassName } from "@/components/numerology/numerology-shared-ui";

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

function digitSum(n: number): number {
  let x = Math.abs(Math.floor(n));
  let s = 0;
  while (x > 0) {
    s += x % 10;
    x = Math.floor(x / 10);
  }
  return s;
}

/** 炼金工具：数位和与化约演示 */
export function NumerologyLabView() {
  const [raw, setRaw] = useState("19990101");
  const parsed = useMemo(() => {
    const n = parseInt(raw.replace(/\D/g, ""), 10);
    if (!Number.isFinite(n) || n < 0) return { n: 0, chain: [] as number[], reduced: 0 as number };
    const chain: number[] = [n];
    let x = n;
    while (x > 9 && x !== 11 && x !== 22 && x !== 33) {
      x = digitSum(x);
      chain.push(x);
    }
    return { n, chain, reduced: reduceWithMaster(n) };
  }, [raw]);

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <NumerologyGlassCard>
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#9eb4c8]/55">炼金工具</p>
        <p className={`mt-3 text-[13px] leading-relaxed text-[#cbd5e1] ${zhSerif.className}`}>
          输入任意非负整数（可含分隔符），查看数位和链与化约终值（1–9 或保留 11/22/33）；用于核对手稿，并与之门第二段备忘表的演算链互证。
        </p>
        <label className="mt-4 block">
          <span className="text-[9px] text-[#94a3b8]">数字串</span>
          <input value={raw} onChange={(e) => setRaw(e.target.value)} className={`${numerologyInputClassName} mt-1 !text-left`} inputMode="numeric" />
        </label>
        <div className="mt-4 rounded-xl border border-[rgba(168,188,208,0.12)] bg-[rgba(12,16,24,0.35)] px-3 py-3 text-[12px] text-[#cbd5e1]">
          <p>
            <span className="text-[#94a3b8]">化约链：</span>
            {parsed.chain.length ? parsed.chain.join(" → ") : "—"}
          </p>
          <p className="mt-2">
            <span className="text-[#94a3b8]">终值（含大师数规则）：</span>
            <span className="tabular-nums text-[#f1f5f9]">{parsed.n ? parsed.reduced : "—"}</span>
          </p>
        </div>
      </NumerologyGlassCard>
    </div>
  );
}
