import type { Metadata } from "next";
import { NumerologyWorkspaceProvider } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyWorkspaceShell } from "@/components/numerology/NumerologyWorkspaceShell";

/** 工作台状态在客户端 Provider；layout 不宜 force-dynamic，否则每次侧栏切换都多一轮动态 RSC。 */
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
