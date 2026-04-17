import type { Metadata } from "next";
import { NumerologyMatrixView } from "@/components/numerology/modules/NumerologyMatrixView";

export const metadata: Metadata = {
  title: "能量矩阵 · 坛城数轨 · 迷宫坛",
  description: "九宫收束格数：之门已填数化约至 1–9 高亮；伴读与手册叠读，长文仍以之门为纲。",
};

export default function NumerologyMatrixPage() {
  return <NumerologyMatrixView />;
}
