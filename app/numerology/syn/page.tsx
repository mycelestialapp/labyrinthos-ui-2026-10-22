import type { Metadata } from "next";
import { NumerologySynView } from "@/components/numerology/modules/NumerologySynView";

export const metadata: Metadata = {
  title: "双人合盘 · 坛城数轨 · 迷宫坛",
  description: "两人合不合：主路径对照与合拍读数。",
};

export default function NumerologySynPage() {
  return <NumerologySynView />;
}
