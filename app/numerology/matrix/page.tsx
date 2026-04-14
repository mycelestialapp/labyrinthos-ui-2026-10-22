import type { Metadata } from "next";
import { NumerologyMatrixView } from "@/components/numerology/modules/NumerologyMatrixView";

export const metadata: Metadata = {
  title: "能量矩阵 · 坛城数轨 · 迷宫坛",
  description: "九数基底格与当前命盘高亮。",
};

export default function NumerologyMatrixPage() {
  return <NumerologyMatrixView />;
}
