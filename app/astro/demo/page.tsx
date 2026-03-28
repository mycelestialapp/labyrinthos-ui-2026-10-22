"use client";

import Link from "next/link";

export default function AstroDemoPage() {
  return (
    <main className="min-h-[100dvh] w-full bg-[#0A0A1F] px-4 py-8 text-zinc-100 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-[0.08em] text-[#F2DEB2] sm:text-4xl">
          排盘解读示例
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
          以下为示例文案，用于先体验解读风格，不代表你的个人盘面结果。
        </p>

        <section className="mt-6 rounded-2xl border border-white/[0.1] bg-[#0b0b22]/85 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-[#F2DEB2]">案例：太阳摩羯 · 月亮巨蟹 · 上升天秤</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-200 sm:text-base">
            <p>
              你看起来温和有分寸，内里却长期自我加压。别人看到的是“你很稳”，你真实的体感常是“我不能倒”。
            </p>
            <p>
              你的盘不是一夜成名盘，而是十年成碑盘。你真正的优势不在情绪下注，而在结构化长期积累。
            </p>
            <p>
              关系里你常做稳定器，课题不是更会忍，而是更早表达需要。把“我没事”改成“我需要你这样做”，关系质量会明显提升。
            </p>
            <p>
              你的关键行动是：先稳，再扩；先活，再赢。把可验证成果放在最前面，命运会向你长期倾斜。
            </p>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link
            href="/astro"
            className="rounded-lg border border-[#C5A059]/60 bg-[#C5A059]/12 px-4 py-2 text-sm font-semibold tracking-[0.08em] text-[#F2DEB2] transition-colors hover:border-[#C5A059]/80 hover:bg-[#C5A059]/20"
          >
            开始排盘解读
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-white/[0.2] px-4 py-2 text-sm font-semibold tracking-[0.08em] text-zinc-200 transition-colors hover:border-[#C5A059]/45 hover:text-[#F2DEB2]"
          >
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}

