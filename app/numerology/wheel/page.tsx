import type { Metadata } from "next";
import { NumerologyWheelView } from "@/components/numerology/modules/NumerologyWheelView";

export const metadata: Metadata = {
  title: "时序轮盘 · 坛城数轨 · 迷宫坛",
  description: "相邻年份个人年列表。",
};

export default function NumerologyWheelPage() {
  return <NumerologyWheelView />;
}
