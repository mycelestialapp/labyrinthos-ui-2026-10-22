import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "雷诺曼 · 迷宫坛",
  description:
    "线性与九宫牌阵工作台：正统无正逆位，相邻成句；追问谁入场、事如何推进、近处何变。不作空泛定命之言。",
};

/** 与 Hub 雷诺曼卡气质一致：深紫底 + 金褐字；窄屏可横向滚动阵式带。 */
export default function LenormandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="lenormand-shell min-h-[100dvh] w-full min-w-0 bg-[#14101c] text-[#e8dcc4] antialiased"
      style={
        {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        } as CSSProperties
      }
      data-lenormand-workspace
    >
      <header
        role="banner"
        className="sticky top-0 z-50 border-b border-[rgba(197,160,89,0.2)] bg-[rgba(12,10,18,0.9)] px-4 py-3 backdrop-blur-md md:px-8"
      >
        <div className="mx-auto flex max-w-[100rem] flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] tracking-[0.28em] text-[#c5a059]/90">LENORMAND</p>
          <Link
            href="/hub"
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[rgba(197,160,89,0.35)] bg-[rgba(197,160,89,0.08)] px-2.5 py-1.5 text-[10px] tracking-[0.18em] text-[#d4c48a] transition-colors hover:border-[#C5A059]/55 hover:bg-[rgba(197,160,89,0.14)]"
          >
            返回星云
          </Link>
        </div>
      </header>
      <div className="relative mx-auto w-full max-w-[100rem] min-w-0 px-3 pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4rem))] pt-3 sm:px-5">
        {children}
      </div>
    </div>
  );
}
