"use client";

import TarotPageClient from "./TarotPageClient";

/**
 * 直接挂载：默认路由 `TarotMasterHtmlFrame` 可随首屏 HTML 输出，避免 `dynamic(..., ssr:false)` 在首包未到时整段留白。
 * 变体重型视图仍在 `TarotPageClient` 内按需 `dynamic`。
 */
export default function TarotPageGate() {
  return <TarotPageClient />;
}
