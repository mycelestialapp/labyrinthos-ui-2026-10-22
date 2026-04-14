import type { Metadata } from "next";
import { NumerologyChartView } from "@/components/numerology/modules/NumerologyChartView";

export const metadata: Metadata = {
  title: "个人星图 · 坛城数轨 · 迷宫坛",
  description: "主路径与辅数一览、曼陀罗缩略。",
};

export default function NumerologyChartPage() {
  return <NumerologyChartView />;
}
