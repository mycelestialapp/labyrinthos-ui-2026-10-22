import type { Metadata } from "next";
import { NumerologyArchiveView } from "@/components/numerology/modules/NumerologyArchiveView";

export const metadata: Metadata = {
  title: "智慧档案 · 坛城数轨 · 迷宫坛",
  description: "本机快照保存、载入与 Markdown 导出。",
};

export default function NumerologyArchivePage() {
  return <NumerologyArchiveView />;
}
