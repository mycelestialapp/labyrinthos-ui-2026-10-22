"use client";

import { Cinzel, Noto_Serif_SC } from "next/font/google";
import { useMemo } from "react";
import { NumerologyExportMarkdownButtons } from "@/components/numerology/NumerologyExportMarkdownButtons";
import { NumerologyMandala2D } from "@/components/numerology/NumerologyMandala2D";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyGlassCard, numerologyInputClassName } from "@/components/numerology/numerology-shared-ui";

const displaySerif = Cinzel({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/** 寰宇之门：生辰、曼陀罗、辅数与读数分层 */
export function NumerologyGateView() {
  const {
    y,
    m,
    d,
    nameLatin,
    calendarYear,
    setY,
    setM,
    setD,
    setNameLatin,
    lifePath: lp,
    birthdayNum: bd,
    personalYearNum: py,
    expression: ex,
    soulUrge: su,
    personality: pe,
    breakdown,
    theme,
    layers,
  } = useNumerologyWorkspace();

  const markdownSource = useMemo(
    () => ({
      y,
      m,
      d,
      nameLatin,
      calendarYear,
      lifePath: lp,
      birthdayNum: bd,
      personalYearNum: py,
      expression: ex,
      soulUrge: su,
      personality: pe,
      breakdown,
      layers,
    }),
    [y, m, d, nameLatin, calendarYear, lp, bd, py, ex, su, pe, breakdown, layers],
  );

  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-8">
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:gap-8">
        <div className="min-w-0 space-y-5 sm:space-y-6">
          <NumerologyGlassCard>
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:gap-10">
              <div className="numerology-mandala-disc relative mx-auto aspect-square w-full max-w-[min(100%,300px)] min-w-0 justify-self-center overflow-visible rounded-full border border-white/[0.08] bg-[radial-gradient(ellipse_72%_60%_at_50%_28%,rgba(255,255,255,0.085),transparent_58%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_32px_64px_rgba(0,0,0,0.42),0_22px_48px_rgba(0,0,0,0.28)] lg:mx-0 lg:max-w-[300px] lg:justify-self-start xl:max-w-[320px]">
                <div className="absolute inset-[2px] flex items-center justify-center text-[#9eb4c8]">
                  <NumerologyMandala2D
                    lifePath={lp}
                    stroke={theme.mandalaStroke}
                    accentRgb={theme.accentRgb}
                    className="h-full w-full max-h-[316px] max-w-[316px]"
                  />
                </div>
                <div className="numerology-mandala-enter relative z-10 flex h-full min-h-[220px] flex-col items-center justify-center px-1">
                  <span
                    className={`text-[11px] tracking-[0.35em] text-[#b8c9d9] ${zhSerif.className}`}
                    style={{ fontFeatureSettings: '"palt" 1' }}
                  >
                    生命路径
                  </span>
                  <span
                    className="mt-1 leading-none tabular-nums text-[#f8fafc]"
                    style={{
                      fontFamily: displaySerif.style.fontFamily,
                      fontSize: "clamp(4.25rem, 12vw, 7rem)",
                      textShadow: `0 1px 0 rgba(0,0,0,0.5), 0 0 36px rgba(${theme.accentRgb},0.45), 0 0 80px rgba(${theme.accentRgb},0.22), 0 0 1px rgba(255,255,255,0.1)`,
                    }}
                  >
                    {lp}
                  </span>
                  <p className={`mt-3 max-w-[14rem] text-center text-[11px] leading-relaxed text-[#cbd5e1] ${zhSerif.className}`}>{theme.label}</p>
                </div>
              </div>

              <div className="flex min-h-0 min-w-0 flex-col justify-center space-y-5 border-l border-[rgba(168,188,208,0.14)] pl-5 sm:pl-6 lg:min-h-[240px] lg:pl-7">
                <p className={`text-[11px] tracking-[0.22em] text-[#b8c9d9] ${zhSerif.className}`}>生辰与姓名</p>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-[9px] text-[#94a3b8]">年</span>
                    <input type="number" min={1900} max={2100} value={y} onChange={(e) => setY(Number(e.target.value) || y)} className={numerologyInputClassName} />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[9px] text-[#94a3b8]">月</span>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={m}
                      onChange={(e) => setM(Math.min(12, Math.max(1, Number(e.target.value) || m)))}
                      className={numerologyInputClassName}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[9px] text-[#94a3b8]">日</span>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={d}
                      onChange={(e) => setD(Math.min(31, Math.max(1, Number(e.target.value) || d)))}
                      className={numerologyInputClassName}
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1">
                  <span className="text-[9px] text-[#94a3b8]">姓名 · 拉丁全拼（可选）</span>
                  <input
                    type="text"
                    value={nameLatin}
                    onChange={(e) => setNameLatin(e.target.value)}
                    placeholder="LI SIHAN"
                    className={`${numerologyInputClassName} !text-left !tracking-[0.12em]`}
                    autoComplete="off"
                  />
                </label>
              </div>
            </div>
          </NumerologyGlassCard>

          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-5 xl:gap-4 2xl:gap-5">
            {[
              { label: "生日数", v: bd, sub: "日柱" },
              { label: "个人年", v: py, sub: String(calendarYear) },
              { label: "表现数", v: ex, sub: "外显", emptyHint: "填拉丁全拼后计算" },
              { label: "灵魂数", v: su, sub: "内驱", emptyHint: "填拉丁全拼后计算" },
              { label: "人格数", v: pe, sub: "初见", emptyHint: "填拉丁全拼后计算" },
            ].map((c) => {
              const empty = c.v == null;
              return (
                <NumerologyGlassCard key={c.label} className="!flex !min-h-[9rem] !flex-col !justify-between !px-4 !py-5">
                  <p className={`text-[10px] tracking-[0.12em] text-[#94a3b8] ${zhSerif.className}`}>{c.label}</p>
                  <p
                    className={`mt-3 text-3xl tabular-nums leading-none ${empty ? "text-[#64748b]" : "text-[#f1f5f9]"}`}
                    style={{ fontFamily: displaySerif.style.fontFamily }}
                  >
                    {c.v ?? "—"}
                  </p>
                  <div className="mt-3 min-h-[2.25rem]">
                    <p className={`text-[9px] leading-snug text-[#94a3b8] ${zhSerif.className}`}>{c.sub}</p>
                    {empty && "emptyHint" in c && c.emptyHint ? (
                      <p className={`mt-1.5 text-[8px] leading-relaxed text-[#64748b] ${zhSerif.className}`}>{c.emptyHint}</p>
                    ) : null}
                  </div>
                </NumerologyGlassCard>
              );
            })}
          </div>
        </div>

        <aside className="hidden min-w-0 lg:block">
          <NumerologyGlassCard className="sticky top-[4.75rem]">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#9eb4c8]/65">洞见之镜</p>
            <p className={`mt-4 text-[13px] leading-[1.75] text-[#cbd5e1] ${zhSerif.className}`}>
              当前主路径 {lp}，流年个人年 {py}。姓名三数若齐全，可将外显、内驱与初见对照阅读；未填姓名时，三数留白为正常状态。
            </p>
            <div className="mt-6 border-t border-[rgba(168,188,208,0.12)] pt-4 text-[11px] leading-relaxed text-[#94a3b8]">
              <p>侧栏模块已接通路由；个人星图、矩阵、轮盘等可自导航进入。</p>
            </div>
          </NumerologyGlassCard>
        </aside>
      </div>

      <NumerologyGlassCard>
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#9eb4c8]/55">读数分层</p>
        <p className={`mt-3 text-[13px] leading-[1.75] text-[#cbd5e1] ${zhSerif.className}`}>
          <span className="text-[#9eb4c8]/90">本表在说什么：</span>
          汇总公历生辰与拉丁全拼下的毕达哥拉斯主路径、生日数、当年个人年及姓名三数；下列为阅读顺序，不作单一断语。
        </p>

        <div className="mt-10 space-y-10 border-t border-[rgba(168,188,208,0.1)] pt-10">
          <article className="relative border-l-[0.5px] border-[rgba(168,188,208,0.45)] pl-5 sm:pl-7">
            <h3 className="text-[11px] font-medium tracking-[0.35em] text-[#9eb4c8]" style={{ fontFamily: zhSerif.style.fontFamily }}>
              【核心快照】
            </h3>
            <p className={`mt-4 text-[14px] leading-[1.85] text-[#cbd5e1] ${zhSerif.className}`}>{layers.snapshot}</p>
          </article>
          <article className="relative border-l-[0.5px] border-[rgba(168,188,208,0.35)] pl-5 sm:pl-7">
            <h3 className="text-[11px] font-medium tracking-[0.35em] text-[#9eb4c8]" style={{ fontFamily: zhSerif.style.fontFamily }}>
              【逻辑推演】
            </h3>
            <p className={`mt-4 text-[14px] leading-[1.85] text-[#cbd5e1] ${zhSerif.className}`}>{layers.logic}</p>
          </article>
          <article className="relative border-l-[0.5px] border-[rgba(168,188,208,0.28)] pl-5 sm:pl-7">
            <h3 className="text-[11px] font-medium tracking-[0.35em] text-[#9eb4c8]" style={{ fontFamily: zhSerif.style.fontFamily }}>
              【原始读数】
            </h3>
            <div className={`mt-4 overflow-x-auto text-[13px] ${zhSerif.className}`}>
              <table className="w-full min-w-[280px] border-collapse text-left text-[#cbd5e1]">
                <tbody>
                  <tr className="border-b border-[rgba(168,188,208,0.12)]">
                    <th className="py-2 pr-4 font-normal text-[#94a3b8]">月柱化约</th>
                    <td className="py-2 tabular-nums">{breakdown.monthReduced}</td>
                  </tr>
                  <tr className="border-b border-[rgba(168,188,208,0.12)]">
                    <th className="py-2 pr-4 font-normal text-[#94a3b8]">日柱化约</th>
                    <td className="py-2 tabular-nums">{breakdown.dayReduced}</td>
                  </tr>
                  <tr className="border-b border-[rgba(168,188,208,0.12)]">
                    <th className="py-2 pr-4 font-normal text-[#94a3b8]">年柱化约</th>
                    <td className="py-2 tabular-nums">{breakdown.yearReduced}</td>
                  </tr>
                  <tr className="border-b border-[rgba(168,188,208,0.12)]">
                    <th className="py-2 pr-4 font-normal text-[#94a3b8]">合并再化约</th>
                    <td className="py-2 tabular-nums">
                      {breakdown.combinedRaw} → {lp}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 pr-4 font-normal text-[#94a3b8]">个人年（{calendarYear}）</th>
                    <td className="py-2 tabular-nums">{py}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
          <article className="relative border-l-[0.5px] border-[rgba(168,188,208,0.22)] pl-5 sm:pl-7">
            <h3 className="text-[11px] font-medium tracking-[0.35em] text-[#9eb4c8]" style={{ fontFamily: zhSerif.style.fontFamily }}>
              【执行备忘】
            </h3>
            <ul className={`mt-4 list-inside list-disc space-y-2 text-[14px] leading-[1.85] text-[#cbd5e1] ${zhSerif.className}`}>
              <li>把本周一件与「主路径 {lp}」一致的小事写进日历，并设验收标准。</li>
              <li>对照个人年 {py}：收束年与外放年动作不同，只选当下可做的一条。</li>
              <li>七日内复盘一次：睡眠、日程与情绪是否同向，再决定是否调整承诺。</li>
            </ul>
          </article>
        </div>

        <p className={`mt-10 text-[11px] leading-relaxed text-[#94a3b8] ${zhSerif.className}`}>
          命数为镜，照见节律与接口；不替代专业医疗、法律与财务判断。
        </p>
        <NumerologyExportMarkdownButtons source={markdownSource} />
      </NumerologyGlassCard>

      <aside className="lg:hidden">
        <NumerologyGlassCard>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#9eb4c8]/65">洞见之镜</p>
          <p className={`mt-3 text-[13px] leading-[1.75] text-[#cbd5e1] ${zhSerif.className}`}>
            主路径 {lp}，个人年 {py}。姓名三数齐全时可对照外显与内驱。
          </p>
        </NumerologyGlassCard>
      </aside>
    </div>
  );
}
