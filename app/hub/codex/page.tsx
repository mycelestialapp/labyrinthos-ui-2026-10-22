import React from "react";
import Link from "next/link";
import { JetBrains_Mono, Noto_Serif_SC } from "next/font/google";
import {
  NATAL_INSTRUMENT_KNOWLEDGE_SECTIONS,
  THE_CODEX_ENTRIES,
} from "@/lib/the-codex";

const serif = Noto_Serif_SC({
  weight: ["300", "400", "500", "600"],
  // 注意：当前 next/font/google 版本不认识 chinese-simplified subset
  // 使用 latin 保证构建稳定；中文走本地字体回退栈
  subsets: ["latin"],
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
          这里记录命运监测层的核心定义：频率锚点、光谱对齐、相位对冲；以及本命层的「宇宙观测报告」全文语料（太阳 / 月亮 / 上升 / 关系镜像各十二式）。目标不是制造神秘，而是解释系统如何把参数转化为可复核的观察口径。
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

        <section className="mt-16 border-t border-[rgba(197,160,89,0.22)] pt-10">
          <p
            className={`text-[11px] text-[#888] ${mono.className}`}
            style={{ letterSpacing: "0.34em" }}
          >
            NATAL INSTRUMENT CORPUS // 宇宙观测报告
          </p>
          <h2
            className="mt-4 text-[22px] font-medium text-[#C5A059] md:text-[26px]"
            style={{ letterSpacing: "0.22em" }}
          >
            本命语料知识库
          </h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-[1.9] text-[#A1A1AA]">
            以下与星盘简读中的 ☉ / ☽ / ↑
            及关系镜像章节同源：每条含共鸣层与精密层（折叠内为完整正文，换行与产品内展示一致）。
          </p>

          <div className="mt-10 space-y-14">
            {NATAL_INSTRUMENT_KNOWLEDGE_SECTIONS.map((block) => (
              <div key={block.id}>
                <p
                  className={`text-[11px] text-[#888] ${mono.className}`}
                  style={{ letterSpacing: "0.36em" }}
                >
                  {block.subtitleEn}
                </p>
                <h3
                  className="mt-2 text-[17px] text-[#C5A059]"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {block.titleZh}
                </h3>
                <p className="mt-2 max-w-2xl text-[13px] leading-[1.85] text-[#93939c]">
                  {block.descriptionZh}
                </p>
                <div className="mt-5 space-y-2">
                  {block.articles.map((article) => (
                    <details
                      key={`${block.id}-${article.sign}`}
                      className="border border-[rgba(197,160,89,0.12)] bg-[rgba(8,8,14,0.55)]"
                    >
                      <summary className="cursor-pointer list-none px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
                        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span className="text-[14px] text-[#e4e4e7]">
                            {article.signLabelZh}
                          </span>
                          <span
                            className={`text-[11px] text-[#888] ${mono.className}`}
                          >
                            {article.tagline}
                          </span>
                        </span>
                      </summary>
                      <div
                        className={`border-t border-[rgba(197,160,89,0.1)] px-4 py-4 text-[14px] leading-[1.95] text-[#A1A1AA] ${mono.className}`}
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {article.body}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
