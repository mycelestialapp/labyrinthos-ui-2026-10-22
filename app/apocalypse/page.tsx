"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles, Wand2 } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import StarBackdrop from "../../components/StarBackdrop";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

function BaguaCompassEntry({ size = 210 }: { size?: number }) {
  const r = size / 2;

  return (
    <motion.div
      className="relative mx-auto"
      style={{ width: size, height: size, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.02 }}
    >
      {/* 外圈旋转流光 */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(252,246,186,0) 0deg, rgba(252,246,186,0.75) 20deg, rgba(191,149,63,0.65) 55deg, rgba(191,149,63,0) 120deg, rgba(252,246,186,0) 360deg)",
          filter: "drop-shadow(0 0 26px rgba(191,149,63,0.20))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />

      {/* 主罗盘 */}
      <div
        className="absolute inset-0 rounded-full border border-[#bf953f]/25 bg-white/5 backdrop-blur-md"
        style={{
          boxShadow: "0 0 0 1px rgba(191,149,63,0.10), 0 22px 90px rgba(0,0,0,0.35)",
        }}
      >
        {/* Yin-Yang */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: r * 0.56,
            height: r * 0.56,
            transform: "translate(-50%,-50%)",
            background:
              "radial-gradient(circle at 30% 30%, rgba(252,246,186,0.75) 0%, rgba(191,149,63,0.15) 22%, rgba(9,9,11,0.98) 64%), radial-gradient(circle at 70% 70%, rgba(191,149,63,0.28) 0%, rgba(9,9,11,1) 58%)",
            boxShadow: "0 0 18px rgba(191,149,63,0.18)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(252,246,186,0.70) 0%, rgba(252,246,186,0.06) 48%, rgba(9,9,11,1) 52%, rgba(9,9,11,1) 100%)",
              mixBlendMode: "screen",
              filter: "blur(0.2px)",
            }}
          />
        </div>

        {/* Trigrams SVG */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(252,246,186,0.95)" />
              <stop offset="45%" stopColor="rgba(191,149,63,0.75)" />
              <stop offset="100%" stopColor="rgba(191,149,63,0.25)" />
            </linearGradient>
          </defs>
          <circle
            cx={r}
            cy={r}
            r={r * 0.92}
            fill="transparent"
            stroke="url(#goldStroke)"
            strokeWidth="1.2"
            opacity="0.9"
          />

          {[
            { angle: -90, bits: [1, 1, 1] },
            { angle: -45, bits: [1, 0, 0] },
            { angle: 0, bits: [1, 1, 0] },
            { angle: 45, bits: [0, 1, 0] },
            { angle: 90, bits: [0, 0, 0] },
            { angle: 135, bits: [0, 1, 1] },
            { angle: 180, bits: [0, 0, 1] },
            { angle: -135, bits: [1, 0, 1] },
          ].map((t, idx) => (
            <g
              key={idx}
              transform={`translate(${r},${r}) rotate(${t.angle}) translate(0,${-r * 0.68})`}
              opacity="0.9"
            >
              {/* three lines */}
              {[0, 1, 2].map((level) => {
                const bit = t.bits[level];
                const y = -12 + level * 12;
                if (bit === 1) {
                  return (
                    <line
                      key={level}
                      x1={-16}
                      x2={16}
                      y1={y}
                      y2={y}
                      stroke="url(#goldStroke)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  );
                }
                return (
                  <>
                    <line
                      x1={-16}
                      x2={-4}
                      y1={y}
                      y2={y}
                      stroke="url(#goldStroke)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1={4}
                      x2={16}
                      y1={y}
                      y2={y}
                      stroke="url(#goldStroke)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </>
                );
              })}
            </g>
          ))}
        </svg>
      </div>

      {/* 顶部悬浮几何线 */}
      <div className="pointer-events-none absolute inset-[-14px] rounded-full">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(252,246,186,0.18) 0%, rgba(191,149,63,0.08) 38%, rgba(191,149,63,0) 70%)",
            filter: "blur(0.2px)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

export default function ApocalypsePage() {
  return (
    <StarBackdrop>
      <main className="relative min-h-screen w-full overflow-x-hidden text-zinc-100">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 22, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#bf953f]/25 bg-white/5 backdrop-blur-md px-4 py-2">
                <Compass className="h-4 w-4 text-[#fcf6ba]/90" />
                <span className="text-[11px] tracking-[0.22em] text-zinc-300">天启</span>
              </div>

              <h1 className={`${playfair.className} mt-10 text-4xl leading-[1.08] md:text-6xl font-semibold tracking-[0.18em]`}>
                天启
              </h1>

              <p className="mt-5 text-sm md:text-base tracking-[0.28em] text-zinc-400 font-light">
                新中式极简 · 向金而行的炼金界面
              </p>
            </motion.div>

            {/* 金色八卦罗盘入口 */}
            <div className="mt-10">
              <BaguaCompassEntry size={220} />
            </div>

            <div className="mt-10 grid w-full grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { title: "天干地支", icon: <Sparkles className="h-5 w-5" />, desc: "以气观时，锁定当下的势" },
                { title: "经卜定局", icon: <Wand2 className="h-5 w-5" />, desc: "以卦定方向，稳住每一步" },
                { title: "灵章解读", icon: <Compass className="h-5 w-5" />, desc: "以符见因果，洞察未显" },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + idx * 0.08, duration: 0.75, ease: "easeOut" }}
                  whileHover={{
                    y: -12,
                    boxShadow: "0 0 0 1px rgba(252,246,186,0.25), 0 30px 90px rgba(0,0,0,0.50)",
                  }}
                  className="group rounded-3xl bg-white/5 backdrop-blur-md border border-[#bf953f]/15 p-6"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(191,149,63,0.08)" }}
                >
                  <div className="mb-4 text-[#fcf6ba]/80">{item.icon}</div>
                  <h3 className={`${playfair.className} text-lg font-semibold tracking-[0.18em]`}>{item.title}</h3>
                  <p className="mt-2 text-xs text-zinc-500 tracking-wider">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </StarBackdrop>
  );
}

