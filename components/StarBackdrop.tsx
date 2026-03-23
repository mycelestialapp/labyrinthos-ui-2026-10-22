"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

type StarDot = {
  id: number;
  x: number; // 0-100 (%)
  y: number; // 0-100 (%)
  size: number; // 1-3 px
  driftX: number; // px
  driftY: number; // px
  duration: number; // 2-5s
  delay: number; // 0-5s
  glow: number; // px
};

const STAR_COUNT = 300;

function stringHash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function StarField({
  stars,
  parallaxX,
  parallaxY,
}: {
  stars: StarDot[];
  parallaxX: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ x: parallaxX, y: parallaxY }}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {stars.map((s) => (
          <motion.g
            key={s.id}
            initial={{ opacity: 0.1, transform: "translate(0px,0px)" }}
            animate={{
              opacity: [0.1, 1, 0.1],
              transform: [
                "translate(0px,0px)",
                `translate(${s.driftX}px, ${s.driftY}px)`,
                "translate(0px,0px)",
              ],
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
              ease: "easeInOut",
            }}
            style={{
              willChange: "transform, opacity",
              filter: `drop-shadow(0 0 ${s.glow}px rgba(255,255,255,0.35))`,
            }}
          >
            <circle cx={`${s.x}%`} cy={`${s.y}%`} r={s.size} fill="rgba(255,255,255,0.95)" />
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
}

function hashToUnit(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // -1..1
  return ((h >>> 0) / 4294967295) * 2 - 1;
}

export default function StarBackdrop({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);

  const parallaxXSpring = useSpring(parallaxX, {
    stiffness: 160,
    damping: 24,
    mass: 0.25,
  });
  const parallaxYSpring = useSpring(parallaxY, {
    stiffness: 160,
    damping: 24,
    mass: 0.25,
  });

  const stars = useMemo<StarDot[]>(
    () => {
      const seedBase = stringHash("labyrinthos-ui-starfield-v1");
      return Array.from({ length: STAR_COUNT }, (_, id) => {
        const rand = mulberry32(seedBase + id * 1013);
        const size = rand() * 2 + 1; // 1-3px
        const driftAmp = 6 + rand() * 14; // 6-20px
        const x = rand() * 100;
        const y = rand() * 100;
        const driftX = (rand() - 0.5) * driftAmp;
        const driftY = (rand() - 0.5) * driftAmp;
        const duration = 2 + rand() * 3; // 2-5s
        const delay = rand() * 5; // 0-5s
        return {
          id,
          x,
          y,
          size,
          driftX,
          driftY,
          duration,
          delay,
          glow: size > 2.4 ? 12 : size > 1.8 ? 9 : 6,
        };
      });
    },
    []
  );

  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const impulseRef = useRef({ x: 0, y: 0 });
  const sceneShiftTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // 1) 鼠标视差（反向、极微弱）
    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const nx = e.clientX / w - 0.5;
      const ny = e.clientY / h - 0.5;
      const amp = 6;

      pointerRef.current = { x: -nx * amp, y: -ny * amp };
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [parallaxX, parallaxY]);

  useEffect(() => {
    // 2) 路由切换视差位移：在新页面挂载时给一次“跨时空”冲击
    const ux = hashToUnit(pathname || "root");
    const uy = hashToUnit(`${pathname}-y`);
    const impulseX = ux * 10;
    const impulseY = uy * 8;

    impulseRef.current = { x: impulseX, y: impulseY };

    const t = window.setTimeout(() => {
      impulseRef.current = { x: 0, y: 0 };
    }, 650);

    return () => window.clearTimeout(t);
  }, [pathname, parallaxX, parallaxY]);

  useEffect(() => {
    // 3) 场景切换视差位移：用于“第一屏->第二屏”等叙事段落衔接
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ x?: number; y?: number }>;
      const x = ce.detail?.x ?? 0;
      const y = ce.detail?.y ?? 0;

      impulseRef.current = { x, y };

      if (sceneShiftTimerRef.current) window.clearTimeout(sceneShiftTimerRef.current);
      sceneShiftTimerRef.current = window.setTimeout(() => {
        impulseRef.current = { x: 0, y: 0 };
      }, 900);
    };

    window.addEventListener("star:scene-shift", handler as EventListener);
    return () => {
      window.removeEventListener("star:scene-shift", handler as EventListener);
      if (sceneShiftTimerRef.current) window.clearTimeout(sceneShiftTimerRef.current);
    };
  }, []);

  useEffect(() => {
    // 3) 极其缓慢的背景视差漂移：让用户在无鼠标操作时也能感到“深度宇宙”
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const slowAmpX = 3.2;
      const slowAmpY = 2.3;
      const slowX = Math.sin(t * 0.045) * slowAmpX;
      const slowY = Math.cos(t * 0.038) * slowAmpY;

      parallaxX.set(pointerRef.current.x + impulseRef.current.x + slowX);
      parallaxY.set(pointerRef.current.y + impulseRef.current.y + slowY);

      rafRef.current = window.requestAnimationFrame(loop);
    };

    rafRef.current = window.requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [parallaxX, parallaxY]);

  return (
    <>
      {/* 深紫径向渐变深度（按要求色值） */}
      <div
        className="fixed inset-0 z-[0]"
        style={{
          background:
            "radial-gradient(circle at center, #0a0a0d 0%, #060608 58%, #020203 100%)",
        }}
      />

      {/* 星空粒子 */}
      <StarField stars={stars} parallaxX={parallaxXSpring} parallaxY={parallaxYSpring} />

      {/* 暗角深度层（不放横线/分割线） */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.28)_76%)]" />

      {children}
    </>
  );
}

