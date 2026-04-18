"use client";

import TarotPageClient from "./TarotPageClient";

/**
 * 直接挂载：默认路由 `TarotMasterHtmlFrame` 可随首屏 HTML 输出，避免 `dynamic(..., ssr:false)` 在首包未到时整段留白。
 * 变体重型视图仍在 `TarotPageClient` 内按需 `dynamic`。
 *
 * `forceOracle`：`/oracle` 在 RSC 首帧无 `window`，须显式标记，否则会误落默认大师 HTML 顶栏叠在神谕壳上。
 */
export default function TarotPageGate({ forceOracle }: { forceOracle?: boolean } = {}) {
  return <TarotPageClient forceOracle={forceOracle} />;
}
