"use client";

import dynamic from "next/dynamic";

const shellStyle = { fontFamily: "var(--font-geist-sans), sans-serif" } as const;

function AstroChunkError() {
  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#0A0A1F] px-6 text-center text-sm text-zinc-300"
      style={shellStyle}
    >
      <p>工作台脚本未能加载</p>
      <p className="max-w-md text-xs text-zinc-500">
        常见于网络中断、缓存异常或开发服务热更新后分包未对齐。可先刷新；若仍失败，请尝试硬刷新（Ctrl+Shift+R）或重启{" "}
        <code className="text-zinc-400">npm run dev</code>。
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

function AstroWorkspaceLoading() {
  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#0A0A1F] px-6 text-center"
      style={shellStyle}
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-[#C5A059]/25 border-t-[#C5A059]"
        aria-hidden
      />
      <p className="text-sm text-zinc-400">占星工作台加载中…</p>
      <p className="max-w-sm text-[11px] leading-relaxed text-zinc-600">
        若长时间停在此页，请硬刷新（Ctrl+Shift+R）或重启终端里的 npm run dev。
      </p>
    </div>
  );
}

const AstroWorkspace = dynamic(
  () =>
    import("@/components/astro/AstroWorkspace").catch(() => {
      if (typeof console !== "undefined" && console.error) {
        console.error("[astro] AstroWorkspace 分包加载失败");
      }
      return { default: AstroChunkError };
    }),
  {
    ssr: false,
    // 勿用 null：分包未到时页面会整块空白，易被误认为白屏/卡死。
    loading: AstroWorkspaceLoading,
  },
);

export default function AstroPageClient() {
  return <AstroWorkspace />;
}
