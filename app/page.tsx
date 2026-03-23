"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarBackdrop from "../components/StarBackdrop";
import SpiritualMirror from "../components/home/SpiritualMirror";
import CelestialDashboard from "../components/home/CelestialDashboard";
import CosmicEnvelope from "../components/home/CosmicEnvelope";

function seedStars(count: number) {
  // 轻量粒子爆发：deterministic
  const stars = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    const r = Math.sqrt(((i * 97) % count) / count);
    return {
      id: i,
      x: Math.cos(a) * r,
      y: Math.sin(a) * r,
      s: 1 + ((i * 13) % 3),
      d: 0.25 + ((i * 7) % 30) / 60,
    };
  });
  return stars;
}

function ParticleBurst({ onDone }: { onDone: () => void }) {
  const particles = useMemo(() => seedStars(140), []);

  useEffect(() => {
    const t = window.setTimeout(onDone, 3000);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div className="fixed inset-0 z-[80] pointer-events-none">
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[420px] w-[420px]">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-[#D4AF37]"
              style={{
                left: "50%",
                top: "50%",
                width: `${p.s}px`,
                height: `${p.s}px`,
                boxShadow: "0 0 18px rgba(212,175,55,0.35)",
              }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
              animate={{
                opacity: [0, 1, 0],
                x: [0, p.x * 240, p.x * 340],
                y: [0, p.y * 240, p.y * 340],
                scale: [0.6, 1, 1.2],
              }}
              transition={{
                duration: 2.2,
                delay: p.d,
                ease: "easeOut",
              }}
            />
          ))}
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.85, 0], scale: [0.5, 1.1, 1.6] }}
            transition={{ duration: 2.4, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle at center, rgba(212,175,55,0.28) 0%, rgba(26,11,61,0.18) 40%, rgba(0,0,0,0) 72%)",
              filter: "blur(10px)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [burstDone, setBurstDone] = useState(false);

  return (
    <StarBackdrop>
      <AnimatePresence>{!burstDone && <ParticleBurst onDone={() => setBurstDone(true)} />}</AnimatePresence>

      {/* 三屏同一套区块与文案；各组件内部用流式比例（clamp/vw）适配，不按端删减内容 */}
      <main className="relative z-10 w-full">
        {/* 1. 第一屏：初始奇点 */}
        <SpiritualMirror />

        {/* 2. 第二屏：宇宙气象看板 */}
        <CelestialDashboard />

        {/* 3. 第三屏：寰宇信笺 */}
        <CosmicEnvelope />
      </main>
    </StarBackdrop>
  );
}

