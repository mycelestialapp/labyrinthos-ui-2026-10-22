import type { Metadata } from "next";
import { NumerologySynView } from "@/components/numerology/modules/NumerologySynView";

export const metadata: Metadata = {
  title: "共鸣分析 · 坛城数轨 · 迷宫坛",
  description: "甲乙生辰主路径对照；可自档案载入乙。",
};

export default function NumerologySynPage() {
  return <NumerologySynView />;
}
