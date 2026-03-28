import React from "react";
import Link from "next/link";
import { JetBrains_Mono, Noto_Serif_SC } from "next/font/google";
import { THE_CODEX_ENTRIES } from "@/lib/the-codex";

const serif = Noto_Serif_SC({
  weight: ["300", "400", "500", "600"],
  // @ts-expect-error chinese-simplified 为 Noto Serif SC 有效 subset
  subsets: ["latin", "chinese-simplified"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export default function HubCodexPage() {
  return (
    <main
      className={`min-h-[100dvh] bg-[#05050a] px-6 py-10 text-zinc-200 md:px-10 ${serif.className}`}
    >
      <div className="mx-auto w-full max-w-4xl">
        <p
          className={`text-[11px] text-[#888] ${mono.className}`}
          style={{ letterSpacing: "0.34em" }}
        >
          THE CODEX // KNOWLEDGE BASE
        </p>
        <h1
          className="mt-4 text-[28px] font-medium text-[#C5A059] md:text-[34px]"
          style={{ letterSpacing: "0.26em" }}
        >
          算法知识仓库
        </h1>
        <p className="mt-4 max-w-2xl text-[14px] leading-[1.9] text-[#A1A1AA]">
          这里记录命运监测层的核心定义：频率锚点、光谱对齐、相位对冲。目标不是制造神秘，而是解释系统如何把每日参数转化为可执行的观察与动作。
        </p>

        <section className="mt-10 space-y-8">
          {THE_CODEX_ENTRIES.map((entry) => (
            <article
              key={entry.key}
              className="border-t border-[rgba(197,160,89,0.18)] pt-5"
            >
              <p
                className={`text-[11px] text-[#888] ${mono.className}`}
                style={{ letterSpacing: "0.36em" }}
              >
                {entry.subtitle}
              </p>
              <h2
                className="mt-2 text-[18px] text-[#C5A059]"
                style={{ letterSpacing: "0.2em" }}
              >
                {entry.title}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.95] text-[#A1A1AA]">
                {entry.body}
              </p>
            </article>
          ))}
        </section>

        <div className="mt-12">
          <Link
            href="/hub"
            className={`text-[11px] text-[#888] hover:text-[#C5A059] ${mono.className}`}
            style={{ letterSpacing: "0.32em" }}
          >
            返回监测层
          </Link>
        </div>
      </div>
    </main>
  );
}
