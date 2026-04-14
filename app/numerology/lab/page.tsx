import type { Metadata } from "next";
import { NumerologyLabView } from "@/components/numerology/modules/NumerologyLabView";

export const metadata: Metadata = {
  title: "炼金工具 · 坛城数轨 · 迷宫坛",
  description: "数位和与化约演示。",
};

export default function NumerologyLabPage() {
  return <NumerologyLabView />;
}
