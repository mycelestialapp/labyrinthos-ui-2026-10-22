"use client";

import React from "react";
import { motion } from "framer-motion";

/** 胶片噪点纹理（SVG feTurbulence） */
const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><filter id="n" x="0" y="0"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" result="t"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.5"/></svg>`,
);

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** 与占星工作台页身统一的深靛夜空底 */
const STAGE_BASE =
  "radial-gradient(ellipse 88% 72% at 50% 42%, #12183a 0%, #0c1030 32%, #080c22 58%, #050814 100%)";

/**
 * 星盘舞台：深靛夜空底 + 中心极淡紫金径向、边缘暗角、胶片噪点；不对子树施模糊 filter，保证 SVG 线锐。
 */
export default function AstroChartStage({ children, className = "" }: Props) {
  return (
    <div
      className={`relative flex min-w-0 justify-center overflow-hidden rounded-2xl py-3 sm:py-6 ${className}`}
      style={{ background: STAGE_BASE }}
    >
      {/* 动态胶片噪点 */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
          backgroundSize: "180px 180px",
        }}
        animate={{
          opacity: [0.055, 0.062, 0.058, 0.064, 0.06],
          x: [0, 0.8, -0.8, 0.4, 0],
          y: [0, -0.4, 0.4, 0, 0],
        }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      {/* 中心能量场：极淡金 + 紫，托起刻度 */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 70% 64% at 50% 46%, rgba(197, 160, 89, 0.1) 0%, rgba(90, 140, 168, 0.06) 26%, rgba(110, 82, 138, 0.08) 42%, transparent 64%)",
        }}
        aria-hidden
      />

      {/* 强暗角：四边锁死视线在盘面 */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          boxShadow:
            "inset 0 0 min(28vw, 140px) min(18vw, 96px) rgba(2,4,14,0.92), inset 0 0 min(48vw, 260px) min(32vw, 180px) rgba(2,4,18,0.72), inset 0 0 min(72vw, 420px) min(50vw, 280px) rgba(0,0,8,0.4)",
        }}
        aria-hidden
      />

      <div className="relative z-[3] flex w-full min-w-0 items-center justify-center px-0 sm:px-2">
        <div className="relative z-[2] flex w-full min-w-0 justify-center">{children}</div>
      </div>
    </div>
  );
}
