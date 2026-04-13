"use client";

import React, { useState } from "react";
import type { SwissErrorDisplay } from "@/lib/swiss-ephemeris-error-zh";

type Props = {
  display: SwissErrorDisplay;
  onRetry: () => void;
  /** 轮盘区短提示，不重述长说明 */
  compact?: boolean;
};

export default function SwissEphemerisErrorCallout({ display, onRetry, compact = false }: Props) {
  const [showMore, setShowMore] = useState(false);
  const [showTech, setShowTech] = useState(false);

  if (compact) {
    return (
      <div className="space-y-2">
        <p className="text-[12px] leading-relaxed text-rose-200/95">{display.title}</p>
        <p className="text-[11px] leading-relaxed text-zinc-500">右侧「星盘数据」可重试与查看简要说明。</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-[#C5A059]/45 bg-[#C5A059]/12 px-3 py-1.5 text-[12px] font-medium text-[#E8D4A8] transition-colors hover:border-[#C5A059]/70 hover:bg-[#C5A059]/18"
        >
          重新计算
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <p className="text-[13px] leading-relaxed text-rose-200/95">{display.title}</p>
      <p className="text-[12px] leading-relaxed text-zinc-500">
        请先点「重新计算」；仍不行可刷新页面。需要排查时再展开下方说明。
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-[#C5A059]/45 bg-[#C5A059]/12 px-3 py-1.5 text-[12px] font-medium text-[#E8D4A8] transition-colors hover:border-[#C5A059]/70 hover:bg-[#C5A059]/18"
        >
          重新计算
        </button>
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="rounded-lg border border-white/[0.12] bg-transparent px-3 py-1.5 text-[12px] text-zinc-500 transition-colors hover:border-white/[0.2] hover:text-zinc-400"
        >
          {showMore ? "收起说明" : "更多说明"}
        </button>
        {display.technical ? (
          <button
            type="button"
            onClick={() => setShowTech((v) => !v)}
            className="rounded-lg border border-white/[0.12] bg-transparent px-3 py-1.5 text-[12px] text-zinc-500 transition-colors hover:border-white/[0.2] hover:text-zinc-400"
          >
            {showTech ? "隐藏详情" : "技术详情"}
          </button>
        ) : null}
      </div>

      {showMore ? (
        <div className="rounded-md border border-white/[0.06] bg-black/25 px-3 py-2.5 text-[12px] leading-relaxed text-zinc-400">
          <ul className="list-disc space-y-1 pl-[1.1rem]">
            {display.hints.map((h, i) => (
              <li key={`${i}-${h.slice(0, 24)}`}>{h}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {showTech && display.technical ? (
        <pre className="max-h-28 overflow-auto rounded-md border border-white/[0.08] bg-black/40 p-2 font-mono text-[10px] leading-snug text-zinc-500 break-all">
          {display.technical}
        </pre>
      ) : null}
    </div>
  );
}
