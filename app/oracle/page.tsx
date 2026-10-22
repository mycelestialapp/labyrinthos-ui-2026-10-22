"use client";

import OracleThreeActRitual from "@/components/oracle/OracleThreeActRitual";
import { ReadingBackProvider } from "@/contexts/ReadingBackContext";

/** 神谕卡主区：接回已完成的三幕式（选题 → 抽牌 → 解读） */
export default function OracleCardsPage() {
  return (
    <ReadingBackProvider>
      <OracleThreeActRitual />
    </ReadingBackProvider>
  );
}
