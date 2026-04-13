"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ChartKindId } from "@/lib/astro-chart-kinds";
import { astroViewCopyGuideVocal } from "@/lib/astro-view-copy-guide-voice-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const tierTitle = "text-xs font-medium text-[#C5A059]";

export function AstroViewCopyGuide({
  chartKind,
  voiceStyleId,
  className = "",
}: {
  chartKind: ChartKindId;
  voiceStyleId: VoiceStyleIdZh;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const g = useMemo(() => astroViewCopyGuideVocal(chartKind, voiceStyleId), [chartKind, voiceStyleId]);

  return (
    <section className={`min-w-0 rounded-md border border-white/[0.08] bg-black/25 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-2 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04] sm:items-center"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-[13px] font-semibold tracking-tight text-[#B8944A]">八盘导览</p>
          <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">{g.viewTitle} · 阅读顺序与数据区建议</p>
        </div>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-zinc-500 transition-transform sm:mt-0 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3 border-t border-white/[0.06] px-3 pb-3 pt-2 text-[13px] leading-relaxed text-zinc-300">
          <p className="text-[12px] text-zinc-400">{g.anchor}</p>
          <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
            <p className={tierTitle}>【核心快照】</p>
            <p>{g.summary.answer}</p>
          </div>
          <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
            <p className={tierTitle}>【逻辑推演】</p>
            <p>{g.summary.pro}</p>
          </div>
          <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
            <p className={tierTitle}>【原始读数】</p>
            <p>{g.summary.precision}</p>
            <p className="text-zinc-400">数据区建议：{g.dataPanelHint}</p>
          </div>
          <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
            <p className={tierTitle}>【执行备忘】</p>
            {g.actionProtocol.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
