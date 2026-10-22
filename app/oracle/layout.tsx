import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Serif_SC } from "next/font/google";

const oracleSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "神谕卡 · 迷宫坛",
  description: "选题、抽牌与完整解读；单张或三张主题神谕卡。",
};

/** 神谕卡独立板块顶栏：与数秘大师壳同系紫底金线，语义与「塔罗圣殿」分流 */
export default function OracleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-[100dvh] bg-[#0e0814] text-[#e8dcc8] ${oracleSerif.className}`}
      data-oracle-workspace
    >
      <header
        role="banner"
        className="sticky top-0 z-50 border-b-[0.5px] border-[rgba(197,160,89,0.22)] bg-[rgba(32,22,42,0.72)] px-4 py-3 backdrop-blur-md md:px-8"
      >
        <div className="mx-auto flex max-w-[100rem] flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#b8a078]/90">选题抽牌 · 主题神谕</p>
            <h1 className="mt-0.5 text-[15px] font-medium tracking-[0.22em] text-[#e8d4a8] md:text-[16px]">神谕卡</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/oracle/deck"
              className="rounded-lg border-[0.5px] border-[rgba(197,160,89,0.35)] px-2.5 py-1.5 text-[10px] tracking-[0.14em] text-[#e8d4a8] transition-colors hover:border-[rgba(197,160,89,0.6)]"
            >
              全部牌面
            </Link>
            <Link
              href="/tarot?lab=1"
              className="rounded-lg border-[0.5px] border-[rgba(197,160,89,0.2)] px-2.5 py-1.5 text-[10px] tracking-[0.14em] text-[#c9a86a]/90 transition-colors hover:border-[rgba(197,160,89,0.45)] hover:text-[#e8d4a8]"
            >
              需要牌阵时去塔罗圣殿
            </Link>
            <Link
              href="/hub"
              className="inline-flex items-center gap-1 rounded-lg border-[0.5px] border-[rgba(168,188,208,0.22)] px-2.5 py-1.5 text-[10px] tracking-[0.18em] text-[#9eb4c8]/90 transition-colors hover:border-[rgba(168,188,208,0.45)]"
            >
              返回星云
            </Link>
          </div>
        </div>
      </header>
      <div className="relative min-h-0 min-w-0 w-full">{children}</div>
    </div>
  );
}
