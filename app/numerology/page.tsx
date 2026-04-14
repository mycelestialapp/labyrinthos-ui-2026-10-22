import type { Metadata } from "next";
import { NumerologyGateView } from "@/components/numerology/NumerologyGateView";

export const metadata: Metadata = {
  title: "寰宇之门 · 坛城数轨 · 迷宫坛",
  description: "毕达哥拉斯生命路径、辅数与读数分层；可选寰宇视觉层。",
};

export default function NumerologyPage() {
  return <NumerologyGateView />;
}
