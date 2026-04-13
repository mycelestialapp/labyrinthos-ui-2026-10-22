import AstroPageClient from "./AstroPageClient";

/**
 * 服务端入口：避免整页 `use client` 在 Turbopack 开发模式下主文档请求长期不落款（Network 里 astro 一直 pending、Provisional headers）。
 */
export default function AstroPage() {
  return <AstroPageClient />;
}
