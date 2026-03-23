"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function hash2(a: number, b: number) {
  // deterministic 伪随机（不在 render 中用 Math.random）
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

export default function EnergyTelemetry() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [hz, setHz] = useState<number>(77.9);
  const [tick, setTick] = useState<number>(0);

  const initialSeed = useMemo(() => {
    // seed 基于当前时间的“天数”做一个稳定初值，避免每次热更新完全一样
    const dayKey = new Date().toISOString().slice(0, 10);
    let h = 2166136261;
    for (let i = 0; i < dayKey.length; i++) {
      h ^= dayKey.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }, []);

  useEffect(() => {
    // 数值跳动：每 1.5 秒在 77.5 - 78.2 之间做极微小随机变化
    const id = window.setInterval(() => {
      setHz((prev) => {
        const delta = (Math.random() - 0.5) * 0.22; // 极小跳动幅度
        const next = prev + delta;
        return clamp(next, 77.5, 78.2);
      });
      setTick((t) => t + 1);
    }, 1500);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let alive = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const draw = (timeMs: number) => {
      if (!alive) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const t = timeMs / 1000;

      // 背后柔雾
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.55);
      g.addColorStop(0, "rgba(191,149,63,0.14)");
      g.addColorStop(0.35, "rgba(252,246,186,0.08)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // 旋转让波纹“活” + 湍流“呼吸式液体流动”
      const rotY = t * 0.18;
      const rotX = Math.sin(t * 0.25) * 0.08 + t * 0.06;

      const sinY = Math.sin(rotY);
      const cosY = Math.cos(rotY);
      const sinX = Math.sin(rotX);
      const cosX = Math.cos(rotX);

      // 球体与投影
      const scale = Math.min(w, h) * 0.33;
      const dist = 3.0;
      const lineCount = 26;
      const steps = 128;

      ctx.lineWidth = 1;
      ctx.lineCap = "round";

      // 金色线条：用 shadowBlur 做“镀金细线”
      ctx.shadowColor = "rgba(252,246,186,0.60)";
      ctx.shadowBlur = 16;

      const breath = 0.6 + 0.4 * Math.sin(t * 0.62); // 呼吸节律（0.2..1）

      for (let li = 0; li < lineCount; li++) {
        const phi = (li / (lineCount - 1)) * Math.PI; // 0..pi
        const poleWeight = Math.cos(phi - Math.PI / 2); // -1..1
        const alpha = 0.08 + 0.16 * Math.abs(poleWeight);

        // 细线的“层级”略不同
        ctx.strokeStyle = `rgba(252,246,186,${alpha.toFixed(3)})`;

        ctx.beginPath();
        let started = false;

        for (let si = 0; si <= steps; si++) {
          const theta = (si / steps) * Math.PI * 2;

          // 湍流流动感：给球面经线一个极小“流体扭曲”
          const flow =
            Math.sin(phi * 1.07 + t * 0.78 + theta * 0.75) *
            Math.cos(theta * 2.05 - t * 0.55);
          const theta2 = theta + flow * 0.018;

          // 球面点
          let x = Math.sin(phi) * Math.cos(theta2);
          let y = Math.cos(phi);
          let z = Math.sin(phi) * Math.sin(theta2);

          // 不规则波动：多频 sin + deterministic jitter
          const w1 = Math.sin(theta2 * 2.1 + t * 1.85 + phi * 1.7);
          const w2 = Math.cos(theta2 * 4.8 - t * 1.15 + phi * 3.2);
          const w3 = Math.sin(theta2 * 9.2 + t * 0.75 + phi * 0.9);
          const irregular = (w1 + w2 * 0.7 + w3 * 0.35) / 2.05;

          // Turbulence：湍流混合场（-1..1），让线条产生“液体呼吸”的不规则形变
          const turb1 = Math.sin(theta2 * 2.7 + phi * 1.4 + t * 1.05);
          const turb2 = Math.cos(theta2 * 5.3 - phi * 2.1 - t * 0.8);
          const turb3 = Math.sin((theta2 + phi) * 3.3 + t * 0.72);
          const turbulence = (turb1 + turb2 + turb3) / 3; // -1..1

          const jitter = (hash2(initialSeed + li * 31.3, si * 0.77 + t * 0.25) - 0.5) * 0.35;

          // 将波纹当作“线阵”沿法线轻微鼓起
          const r =
            1 +
            irregular * 0.045 * breath +
            turbulence * 0.032 * (0.75 + breath * 0.25) +
            jitter * 0.018;
          x *= r;
          y *= r;
          z *= r;

          // 旋转
          const x1 = x * cosY + z * sinY;
          const z1 = -x * sinY + z * cosY;
          const y1 = y * cosX - z1 * sinX;
          const z2 = y * sinX + z1 * cosX;

          // 透视投影
          const p = 1 / (z2 + dist);
          const sx = cx + x1 * scale * p;
          const sy = cy + y1 * scale * p;

          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else {
            ctx.lineTo(sx, sy);
          }
        }

        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      // 球体中心亮点
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.12);
      core.addColorStop(0, "rgba(252,246,186,0.55)");
      core.addColorStop(0.45, "rgba(191,149,63,0.18)");
      core.addColorStop(1, "rgba(191,149,63,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.10, 0, Math.PI * 2);
      ctx.fill();

      // 金色外发光氛围：让能量球更“有灵魂”
      ctx.globalCompositeOperation = "screen";
      const halo = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        Math.min(w, h) * 0.55
      );
      halo.addColorStop(0, "rgba(252,246,186,0.14)");
      halo.addColorStop(0.35, "rgba(191,149,63,0.10)");
      halo.addColorStop(1, "rgba(191,149,63,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      rafRef.current = window.requestAnimationFrame(draw);
    };

    rafRef.current = window.requestAnimationFrame(draw);

    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [initialSeed]);

  return (
    <section className="relative">
      {/* 顶部标注 */}
      <div className="mx-auto inline-flex items-center justify-center gap-3 rounded-full border border-[#bf953f]/20 bg-white/5 px-5 py-2 backdrop-blur-md">
        <span
          aria-hidden="true"
          className="text-[#fcf6ba]/90"
          style={{ letterSpacing: "0.02em", fontSize: 14 }}
        >
          ◎
        </span>
        <span className="text-[11px] tracking-[0.32em] text-zinc-200">
          ENERGY TELEMETRY
        </span>
      </div>

      {/* 主体 */}
      <div className="mt-10 grid items-center justify-items-center gap-10 md:grid-cols-[1fr_auto]">
        <div className="text-center md:text-left">
          <motion.div
            className="flex flex-col leading-[1.05]"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className={`${playfair.className} text-[40px] md:text-[52px] tracking-[0.2em]`}>
              YOUR VIBRATIONAL
            </div>
            <div className={`${playfair.className} text-[40px] md:text-[52px] tracking-[0.2em]`}>
              FREQUENCY TODAY
            </div>
          </motion.div>
          <div className="mt-4 text-sm tracking-[0.22em] text-zinc-400">
            <motion.span
              key={tick}
              initial={{ opacity: 0.35, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {hz.toFixed(1)} Hz
            </motion.span>
          </div>
        </div>

        {/* 金色细线波纹能量球（Canvas） */}
        <motion.div
          className="relative h-[260px] w-[260px] md:h-[320px] md:w-[320px] rounded-full"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(circle at 40% 30%, rgba(252,246,186,0.10) 0%, rgba(191,149,63,0.06) 32%, rgba(9,9,11,0.10) 72%, rgba(9,9,11,0.65) 100%)",
            boxShadow:
              "0 0 0 1px rgba(191,149,63,0.10), 0 0 80px rgba(191,149,63,0.10), 0 30px 120px rgba(0,0,0,0.45)",
            overflow: "hidden",
          }}
        >
          <canvas ref={canvasRef} className="h-full w-full block" aria-hidden="true" />

          {/* 顶部轻微边缘光带（不影响主线） */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(252,246,186,0.20) 0%, rgba(191,149,63,0.08) 30%, rgba(0,0,0,0) 70%)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

