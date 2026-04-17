import type { Metadata } from "next";
import { NumerologySynView } from "@/components/numerology/modules/NumerologySynView";

export const metadata: Metadata = {
  title: "共鸣分析 · 坛城数轨 · 迷宫坛",
  description: "双人主路径对照与合拍读数；主路径矩阵定稿按「我×对方」序对取稿。",
};

export default function NumerologySynPage() {
  return <NumerologySynView />;
}
