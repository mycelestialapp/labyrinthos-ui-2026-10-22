"use client";

import { useEffect } from "react";

export default function AstroError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof console !== "undefined" && console.error) {
      console.error("[astro] 页面错误", error);
    }
  }, [error]);

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#0A0A1F] px-6 text-center text-sm text-zinc-300"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      <p className="text-base font-medium text-[#D4C48A]">占星工作台渲染出错</p>
      <p className="max-w-md text-xs leading-relaxed text-zinc-500">
        多为脚本异常或本地数据损坏。可先点「重试」；仍白屏请硬刷新或清空本站数据后重开。
      </p>
      {process.env.NODE_ENV === "development" ? (
        <pre className="max-h-32 max-w-full overflow-auto rounded-lg bg-black/40 p-3 text-left text-[10px] text-rose-200/90">
          {error.message}
        </pre>
      ) : null}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl border border-[#bf953f]/40 bg-white/5 px-4 py-2 text-[#D4C48A] transition hover:border-[#C5A059]/60"
        >
          重试
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl border border-white/15 bg-transparent px-4 py-2 text-zinc-400 transition hover:border-white/25"
        >
          整页刷新
        </button>
      </div>
    </div>
  );
}
