import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** 与 `TarotPageClient` 中 URL 判定一致：任一为 1 则走 React 壳（`/tarot/app`）。 */
const VARIANT_QUERY_KEYS = ["lab", "react", "ritual", "sacred", "oracle", "plain"] as const;

function tarotNeedsClientApp(searchParams: URLSearchParams): boolean {
  for (const key of VARIANT_QUERY_KEYS) {
    if (searchParams.get(key) === "1") return true;
  }
  return false;
}

/**
 * 仅对「整页文档」请求 rewrite 到静态大师 HTML。
 * Next `<Link>` 触发的 RSC / Prefetch 若也喂静态整页，Flight 解析失败 → 白屏、刷新卡住。
 */
function shouldRewriteTarotPathToStaticMaster(request: NextRequest): boolean {
  if (request.method !== "GET") return false;
  if (request.headers.get("RSC") === "1") return false;
  if (request.headers.get("Next-Router-Prefetch") === "1") return false;
  const dest = request.headers.get("sec-fetch-dest");
  if (dest === "empty") return false;
  if (dest == null || dest === "document" || dest === "iframe") return true;
  return false;
}

/**
 * 纯 `/tarot`：文档请求透明 rewrite 到 `public/tarot-master.html`；RSC 走 `app/tarot/page.tsx`（iframe 壳）。
 * 尾斜杠归一；`?lab=1` 等 rewrite 到 `/tarot/app`（React 壳）。
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname !== "/tarot" && pathname !== "/tarot/") {
    return NextResponse.next();
  }
  if (pathname === "/tarot/") {
    return NextResponse.redirect(new URL("/tarot", request.url));
  }
  if (tarotNeedsClientApp(searchParams)) {
    const url = request.nextUrl.clone();
    url.pathname = "/tarot/app";
    return NextResponse.rewrite(url);
  }
  if (shouldRewriteTarotPathToStaticMaster(request)) {
    return NextResponse.rewrite(new URL("/tarot-master.html", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/tarot", "/tarot/"],
};
