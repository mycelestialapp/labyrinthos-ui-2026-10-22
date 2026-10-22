import type { Metadata } from "next";
import Link from "next/link";
import { getAllOracleCards } from "@/lib/oracle-cards";
import { getOracleDisplayCard } from "@/lib/oracleCardDisplay";

export const metadata: Metadata = {
  title: "神谕卡牌面 · 迷宫坛",
  description: "四十四张主题神谕卡牌面预览。",
};

export default function OracleDeckPreviewPage() {
  const cards = getAllOracleCards();

  return (
    <div className="mx-auto w-full min-w-0 max-w-[100rem] space-y-6 px-3 py-6 text-[#e8dcc8] md:px-6">
      <header className="space-y-2">
        <p className="text-[11px] tracking-[0.28em] text-[#b8a078]/80">牌库 · 牌面</p>
        <h2 className="text-lg tracking-[0.18em] text-[#e8d4a8]">神谕卡（{cards.length} 张）</h2>
        <p className="max-w-2xl break-words text-[13px] leading-relaxed text-[#9eb4c8]/90">
          金纹发光主题神谕卡，单面牌义、没有正逆位。点一张可放大；要抽牌请回
          <Link href="/oracle" className="mx-1 text-[#e8d4a8] underline-offset-2 hover:underline">
            神谕仪式
          </Link>
          。
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {cards.map((card) => {
          const shown = getOracleDisplayCard(card);
          return (
            <li key={card.id} className="min-w-0">
              <a
                href={card.image ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-xl border border-[rgba(197,160,89,0.22)] bg-[rgba(18,12,28,0.72)] transition-colors hover:border-[rgba(197,160,89,0.5)]"
              >
                {card.image ? (
                  <img
                    src={card.image}
                    alt={shown.nameZh}
                    className="aspect-[3/4] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center text-[#c9a86a]/50">✦</div>
                )}
                <p className="min-w-0 break-words px-2 py-2 text-center text-[12px] tracking-wide text-[#f3e6c4]">
                  {shown.nameZh}
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
