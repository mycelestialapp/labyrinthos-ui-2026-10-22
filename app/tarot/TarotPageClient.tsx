"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TarotMasterHtmlFrame from "@/components/tarot/TarotMasterHtmlFrame";
import {
  TAROT_QUESTION_LIFE_CATEGORIES_SCRIPT_VERSION,
  tarotQuestionLifeCategoriesBundlePath,
} from "@/lib/tarot-life-six-public-script-url";

const shellStyle = { fontFamily: "var(--font-geist-sans), sans-serif" } as const;

function TarotChunkError() {
  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#070714] px-6 text-center text-sm text-zinc-300"
      style={shellStyle}
    >
      <p>塔罗模块未能加载</p>
      <p className="max-w-md text-xs text-zinc-500">
        可先刷新；若仍失败，请硬刷新（Ctrl+Shift+R）或重启 <code className="text-zinc-400">npm run dev</code>。
      </p>
      <button
        type="button"
        className="rounded-xl border border-[#bf953f]/40 bg-white/5 px-4 py-2 text-[#D4C48A] transition hover:border-[#C5A059]/60"
        onClick={() => window.location.reload()}
      >
        刷新页面
      </button>
    </div>
  );
}

function TarotLoading() {
  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#070714] px-6 text-center"
      style={shellStyle}
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-[#C5A059]/25 border-t-[#C5A059]"
        aria-hidden
      />
      <p className="text-sm text-zinc-400">塔罗圣殿载入中…</p>
    </div>
  );
}

/** Dmy-projects `TarotPanelOracle` 风格：宇宙背景双栏短义；需 `?oracle=1`。 */
const TarotOracleLayout = dynamic(
  () =>
    import("@/components/tarot/TarotOracleLayout").catch(() => {
      if (typeof console !== "undefined" && console.error) {
        console.error("[tarot] TarotOracleLayout 分包加载失败");
      }
      return { default: TarotChunkError };
    }),
  { ssr: false, loading: TarotLoading },
);

/** 开机动画 + 音效版（`TarotSacred`）。 */
const TarotSacredLayout = dynamic(
  () =>
    import("@/components/tarot/TarotSacredLayout").catch(() => {
      if (typeof console !== "undefined" && console.error) {
        console.error("[tarot] TarotSacredLayout 分包加载失败");
      }
      return { default: TarotChunkError };
    }),
  { ssr: false, loading: TarotLoading },
);

const TarotRitualExperience = dynamic(
  () =>
    import("@/components/tarot/TarotRitualExperience").catch(() => {
      if (typeof console !== "undefined" && console.error) {
        console.error("[tarot] TarotRitualExperience 分包加载失败");
      }
      return { default: TarotChunkError };
    }),
  { ssr: false, loading: TarotLoading },
);

const TarotSanctuary = dynamic(
  () =>
    import("@/components/tarot/TarotSanctuary").catch(() => {
      if (typeof console !== "undefined" && console.error) {
        console.error("[tarot] TarotSanctuary 分包加载失败");
      }
      return { default: TarotChunkError };
    }),
  { ssr: false, loading: TarotLoading },
);

function TarotRouteBody() {
  const [flags] = useState(() => {
    if (typeof window === "undefined") {
      return { ritual: false, sacred: false, oracle: false, plain: false, lab: false };
    }
    const q = new URLSearchParams(window.location.search);
    return {
      ritual: q.get("ritual") === "1",
      sacred: q.get("sacred") === "1",
      oracle: q.get("oracle") === "1",
      plain: q.get("plain") === "1",
      /** React 工作台：宇宙圣殿 + 十大类 + 分层 Markdown；`react=1` 同义 */
      lab: q.get("lab") === "1" || q.get("react") === "1",
    };
  });
  if (flags.ritual) return <TarotRitualExperience />;
  if (flags.sacred) return <TarotSacredLayout />;
  if (flags.oracle) return <TarotOracleLayout />;
  // `lab` / `react`：圣殿 React；`plain` 单独出现也要进 React（精简皮）
  if (flags.lab || flags.plain) return <TarotSanctuary plainLayout={flags.plain} />;
  // 默认：Dmy `tarot-master.html`（下拉大类 + 宫格问题 + 六大牌阵 · Font Awesome）
  return <TarotMasterHtmlFrame />;
}

export default function TarotPageClient() {
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const lab = q.get("lab") === "1" || q.get("react") === "1";
    const plain = q.get("plain") === "1";
    if (!lab && !plain) return;
    const v = TAROT_QUESTION_LIFE_CATEGORIES_SCRIPT_VERSION;
    if (document.querySelector(`link[data-tarot-life-six-preload="${v}"]`)) return;
    const href = tarotQuestionLifeCategoriesBundlePath(v);
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "script";
    link.href = href;
    link.setAttribute("data-tarot-life-six-preload", v);
    document.head.appendChild(link);
  }, []);

  return <TarotRouteBody />;
}
