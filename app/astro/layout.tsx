import type { ReactNode } from "react";

/**
 * 强制本段为静态，避免 App Router 在开发模式下对 /astro 的 document 请求长时间保持开放流，
 * Network 里表现为 (pending)、标签页一直转圈（页面仍可能已由其它 chunk 渲染）。
 */
export const dynamic = "force-static";

export default function AstroSegmentLayout({ children }: { children: ReactNode }) {
  return children;
}
