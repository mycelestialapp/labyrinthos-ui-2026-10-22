import type { ReactNode } from "react";
import type { Metadata } from "next";

/** 勿对 `/tarot` 使用 `force-static`。纯 `/tarot`：文档请求 middleware rewrite 至 `tarot-master.html`；RSC/预取走 `page.tsx` iframe；带 `lab`/`react`/… rewrite 至 `/tarot/app`。 */

export const metadata: Metadata = {
  title: "塔罗圣殿",
  description: "牌阵、抽牌与分层解读；牌面为镜，照见岔路。",
};

export default function TarotSegmentLayout({ children }: { children: ReactNode }) {
  return children;
}
