"use client";

/**
 * Dmy `public/tarot-master.html`：圣域大师版（大类下拉 + 问题宫格 + 六大牌阵 + 独立解读数据）。
 * 与 React 版 `TarotSanctuary` 并存：`/tarot` 默认此 iframe，`?lab=1` 为分层解读工作台（生活六大类冻结核见 `tarot-life-six-window-bridge` + `tarotQuestionLifeCategoriesContent.js`）。
 */
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { trackHubEvent } from "@/lib/hub-analytics";

export default function TarotMasterHtmlFrame() {
  return (
    <div
      className="flex min-h-[100dvh] flex-col bg-[#0b0510] text-[#e5d5b3]"
      style={{
        height: "100dvh",
        minHeight: "100dvh",
        width: "100%",
        backgroundColor: "#0b0510",
        color: "#e5d5b3",
        overflow: "hidden",
      }}
    >
      <header className="relative z-20 flex shrink-0 flex-wrap items-center gap-3 border-b border-[rgba(212,175,55,0.28)] bg-[rgba(6,2,12,0.75)] px-3 py-3 backdrop-blur-md sm:gap-4 sm:px-4">
        <Link
          href="/hub"
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(212,175,55,0.35)] bg-black/35 px-3 py-1.5 text-xs text-[#d4b68a] transition hover:border-[#dbb45c] hover:text-[#ffdfa7] sm:text-sm"
          style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
          onClick={() => trackHubEvent("tarot_master_back_hub")}
        >
          <ChevronLeft className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
          星云
        </Link>
        <Link
          href="/tarot?lab=1"
          className="rounded-full border border-[rgba(212,175,55,0.25)] bg-black/25 px-3 py-1.5 text-xs text-[#cbaf7a] transition hover:border-[#b69042]/50 hover:text-[#f2e1ba] sm:text-sm"
        >
          React 分层版
        </Link>
        <span
          className="min-w-0 flex-1 truncate text-center text-[11px] tracking-wide text-[#b6974b] sm:text-xs"
          style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
        >
          圣域塔罗 · 大师 HTML 原版
        </span>
      </header>
      <iframe
        title="圣域塔罗大师版"
        src="/tarot-master.html"
        className="w-full flex-1 border-0 bg-[#0b0510]"
        style={{
          flex: "1 1 0",
          minHeight: 0,
          backgroundColor: "#0b0510",
        }}
        allow="fullscreen"
      />
    </div>
  );
}
