import type { Metadata } from "next";
import { NumerologyWorkspaceProvider } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyWorkspaceShell } from "@/components/numerology/NumerologyWorkspaceShell";

/** 避免 CDN/浏览器把整段 RSC 壳强缓存成「永远旧样式」 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "坛城数轨 · 数秘 · 迷宫坛",
  description: "毕达哥拉斯生命路径与辅数：玻璃态坛城、可选寰宇粒子、读数分层。",
};

export default function NumerologyLayout({ children }: { children: React.ReactNode }) {
  return (
    <NumerologyWorkspaceProvider>
      <NumerologyWorkspaceShell>{children}</NumerologyWorkspaceShell>
    </NumerologyWorkspaceProvider>
  );
}
