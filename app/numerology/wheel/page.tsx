import type { Metadata } from "next";
import { NumerologyWheelView } from "@/components/numerology/modules/NumerologyWheelView";

export const metadata: Metadata = {
  title: "时序轮盘 · 坛城数轨 · 迷宫坛",
  description: "多年个人年表：生日月日加公历年化约；算法与寰宇之门同源，岁意仍归镜鉴与年度侧写。",
};

export default function NumerologyWheelPage() {
  return <NumerologyWheelView />;
}
