"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

function StarChartHollowGold({ size = 220 }: { size?: number }) {
  const r = size / 2;
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size, transformStyle: "preserve-3d" }}
      animate={{ rotateZ: 360 }}
      transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
    >
      {/* 外发光 */}
      <div
        className="absolute inset-[-18px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 40% 30%, rgba(252,246,186,0.18) 0%, rgba(191,149,63,0.08) 40%, rgba(191,149,63,0) 70%)",
          filter: "blur(6px)",
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nebulaGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(252,246,186,0.95)" />
            <stop offset="45%" stopColor="rgba(191,149,63,0.7)" />
            <stop offset="100%" stopColor="rgba(191,149,63,0.25)" />
          </linearGradient>
          <filter id="goldSoftGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.55 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 镂空圆环层 */}
        {[0, 1, 2].map((k) => {
          const rr = r * (0.78 - k * 0.16);
          const op = 0.75 - k * 0.18;
          const sw = 1.25 - k * 0.25;
          return (
            <circle
              key={k}
              cx={r}
              cy={r}
              r={rr}
              fill="transparent"
              stroke="url(#nebulaGold)"
              strokeOpacity={op}
              strokeWidth={sw}
              strokeDasharray={k === 1 ? "2 5" : "0"}
              filter="url(#goldSoftGlow)"
            />
          );
        })}

        {/* 星盘切线：金色细线辐射 */}
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2;
          const x1 = r + Math.cos(a) * (r * 0.22);
          const y1 = r + Math.sin(a) * (r * 0.22);
          const x2 = r + Math.cos(a) * (r * 0.93);
          const y2 = r + Math.sin(a) * (r * 0.93);
          const op = 0.35 + (i % 3) * 0.12;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#nebulaGold)"
              strokeWidth={1.15}
              strokeOpacity={op}
              strokeLinecap="round"
            />
          );
        })}

        {/* 节点 */}
        {Array.from({ length: 30 }).map((_, i) => {
          const a = (i / 30) * Math.PI * 2;
          const rr = r * (0.35 + ((i * 7) % 11) / 11) * 0.92;
          const x = r + Math.cos(a) * rr;
          const y = r + Math.sin(a) * rr;
          const rad = i % 5 === 0 ? 2.2 : 1.5;
          const op = i % 7 === 0 ? 0.9 : 0.55;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={rad}
              fill="rgba(252,246,186,0.95)"
              opacity={op}
            />
          );
        })}
      </svg>

      {/* 紫色星云模糊背板（不靠图片） */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(143,90,255,0.35) 0%, rgba(191,149,63,0.08) 28%, rgba(9,9,11,0) 65%), radial-gradient(circle at 70% 60%, rgba(93,60,255,0.20) 0%, rgba(9,9,11,0) 55%)",
          filter: "blur(18px) saturate(1.2)",
          opacity: 0.9,
        }}
      />
    </motion.div>
  );
}

function BaguaGoldHeavyBlur() {
  // 金色八卦：用 SVG 画符线，再用强模糊叠加动感。
  return (
    <div className="relative h-[240px] w-[240px]">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 20%, rgba(252,246,186,0.16) 0%, rgba(191,149,63,0.08) 35%, rgba(9,9,11,0.0) 70%)",
          filter: "blur(18px) saturate(1.1)",
          opacity: 0.95,
        }}
        animate={{ rotate: [0, 12, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.svg
        viewBox="0 0 240 240"
        className="absolute inset-0"
        aria-hidden="true"
        initial={{ opacity: 0.95, scale: 0.98 }}
        animate={{ opacity: 1, rotate: 360, scale: 1 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ filter: "blur(2.2px) drop-shadow(0 0 18px rgba(191,149,63,0.25))" }}
      >
        <defs>
          <linearGradient id="baguaGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(252,246,186,0.95)" />
            <stop offset="45%" stopColor="rgba(191,149,63,0.75)" />
            <stop offset="100%" stopColor="rgba(191,149,63,0.25)" />
          </linearGradient>
        </defs>

        <circle cx="120" cy="120" r="92" fill="transparent" stroke="url(#baguaGold)" strokeWidth="2.2" opacity="0.85" />
        {/* 阴阳分界 */}
        <path
          d="M120 28C75.3 28 41 67.4 41 120c0 52.6 34.3 92 79 92s79-39.4 79-92c0-52.6-34.3-92-79-92Z"
          fill="transparent"
          stroke="url(#baguaGold)"
          strokeWidth="1.8"
          opacity="0.4"
        />
        <path
          d="M120 28C120 65 120 89 120 120s0 55 0 92"
          fill="none"
          stroke="url(#baguaGold)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* 八卦外圈卦线位置 */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const cx = 120 + Math.cos(a) * 62;
          const cy = 120 + Math.sin(a) * 62;
          const rot = (i / 8) * 360;
          const strong = i % 2 === 0;
          const opacity = strong ? 0.7 : 0.45;
          return (
            <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
              <path
                d="M-18 -8 H18"
                stroke="url(#baguaGold)"
                strokeWidth={1.7}
                strokeLinecap="round"
                opacity={opacity}
              />
              <path
                d={strong ? "M-18 10 H18" : "M-18 10 H-4 M4 10 H18"}
                stroke="url(#baguaGold)"
                strokeWidth={1.7}
                strokeLinecap="round"
                opacity={opacity}
              />
            </g>
          );
        })}
      </motion.svg>

      {/* 叠加更强模糊金雾 */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(252,246,186,0.20) 0%, rgba(191,149,63,0.10) 35%, rgba(191,149,63,0) 70%)",
          filter: "blur(10px)",
          mixBlendMode: "screen",
          opacity: 0.75,
        }}
      />
    </div>
  );
}

function DynamicTextStream() {
  const sentences = useMemo(
    () => [
      "A soul in Paris is decoding destiny...",
      "A soul in Kyoto is tuning fate's resonance...",
      "A soul in Cairo is tracing hidden currents...",
      "A soul in Lisbon is listening to the omen's breath...",
      "A soul in Delhi is calibrating tomorrow's vow...",
      "A soul in Reykjavik is mapping the quiet signs...",
      "A soul in Dubai is summoning luminous timing...",
    ],
    []
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((v) => (v + 1) % sentences.length);
    }, 2100);
    return () => window.clearInterval(id);
  }, [sentences.length]);

  return (
    <div className="relative h-[240px] w-[100%] flex items-center justify-center px-6">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center text-[14px] leading-[1.8] text-zinc-300 tracking-[0.06em]"
          style={{
            textShadow: "0 0 16px rgba(191,149,63,0.18)",
          }}
        >
          {sentences[idx]}
        </motion.p>
      </AnimatePresence>

      {/* 轻微光栅 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(252,246,186,0) 0%, rgba(252,246,186,0.10) 50%, rgba(252,246,186,0) 100%)",
          filter: "blur(10px)",
          opacity: 0.35,
        }}
      />
    </div>
  );
}

export default function CelestialWindows() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });

  const aY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const bY = useTransform(scrollYProgress, [0, 1], [32, -28]);
  const cY = useTransform(scrollYProgress, [0, 1], [10, -26]);

  const aX = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const bX = useTransform(scrollYProgress, [0, 1], [14, -8]);
  const cX = useTransform(scrollYProgress, [0, 1], [-16, 6]);

  return (
    <section ref={wrapRef} className="relative mt-14">
      {/* 非对称“错落分布”：绝对定位 + 不同视差 */}
      <div className="relative mx-auto h-[420px] w-full max-w-6xl">
        {/* 卡片 A */}
        <motion.div
          style={{ x: aX, y: aY }}
          className="absolute left-[6%] top-[8%] w-[320px] max-w-[90%] rounded-3xl border border-[#bf953f]/15 bg-white/5 backdrop-blur-md p-5"
          whileHover={{ y: -6 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#fcf6ba]/85" />
            <div className={`${playfair.className} text-[12px] tracking-[0.28em] text-zinc-200`}>
              NEBULA · THE ASTROLOGY
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <StarChartHollowGold size={240} />
          </div>
        </motion.div>

        {/* 卡片 B */}
        <motion.div
          style={{ x: bX, y: bY }}
          className="absolute right-[4%] top-[16%] w-[320px] max-w-[90%] rounded-3xl border border-[#bf953f]/15 bg-white/5 backdrop-blur-md p-5"
          whileHover={{ y: -6 }}
        >
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-[#fcf6ba]/80" />
            <div className={`${playfair.className} text-[12px] tracking-[0.28em] text-zinc-200`}>
              APOCALYPSE · THE ORIENTAL
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center">
            <BaguaGoldHeavyBlur />
          </div>
        </motion.div>

        {/* 卡片 C */}
        <motion.div
          style={{ x: cX, y: cY }}
          className="absolute left-[24%] bottom-[4%] w-[520px] max-w-[95%] rounded-3xl border border-[#bf953f]/15 bg-white/5 backdrop-blur-md p-5"
          whileHover={{ y: -6 }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className={`${playfair.className} text-[12px] tracking-[0.28em] text-zinc-200`}>
              CHRONO-SOCIAL · FRAGMENTS
            </div>
            <div className="text-[10px] tracking-[0.26em] text-zinc-500">
              AURORA STREAM
            </div>
          </div>
          <DynamicTextStream />
        </motion.div>
      </div>
    </section>
  );
}

