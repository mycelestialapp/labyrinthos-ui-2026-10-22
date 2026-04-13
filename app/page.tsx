import HomePageClient from "./HomePageClient";

/**
 * 服务端壳：减轻整页 `use client` 在 Turbopack 下主文档长期 pending（标签转圈）。
 * 根路由勿用 `force-static`：在部分 Next 16 + Turbopack 开发模式下曾与客户端边界叠出白屏。
 */
export default function Home() {
  return <HomePageClient />;
}
