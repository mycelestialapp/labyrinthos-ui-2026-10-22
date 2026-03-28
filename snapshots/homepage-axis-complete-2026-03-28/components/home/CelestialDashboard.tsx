"use client";

/**
 * 全端一致：手机与电脑同一 DOM、同一段敕令/观测全文，不按断点删减或替换内容。
 * 比例随屏宽连续变化：字号与间距优先用 clamp(vw)；宽屏双列时月球视口与右侧文案卡等高顶对齐，
 * 手机单列仍为正方形视口，避免竖长条与遮挡。
 * 月相：朔日历元与「此刻」均按用户本机时区解释；照明随当地时钟在朔望月内连续推进，文案侧定期刷新。
 */

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { HOME_SCREEN_MIN_HEIGHT, HOME_SCREEN_PAD_Y } from "@/lib/home-screen";
import { playFocus } from "../../lib/sfx";
import HomeScreenFooter from "./HomeScreenFooter";
import { MoonSpherePlaceholder as MoonSpherePlaceholderEngine, MoonSphereTextures as MoonSphereTexturesEngine, type LunarPhaseInfo } from "./MoonEngine";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** 右侧卡片内：观测全文（顶部分隔线后直接相位标题与段落） */
function ObservationLetter({ phaseInfo }: { phaseInfo: LunarPhaseInfo | null }) {
  const voidMood = phaseInfo?.phaseIndex === 1;
  const mandateBody = phaseInfo
    ? phaseInfo.mandate.replace(/^(MANDATE|敕令)\s*\/\/\s*动作[：:]\s*/i, "")
    : "";

  const bodyMain = voidMood ? "text-zinc-400" : "text-zinc-200";
  const bodySub = voidMood ? "text-zinc-500" : "text-zinc-300";

  return (
    <div
      className="mt-[clamp(0.85rem,1.4vw,1.1rem)] border-t border-[#D4AF37]/12 pt-[clamp(0.6rem,1vw,0.85rem)]"
    >
      <div
        className={`${playfair.className} text-[clamp(1.375rem,1rem+1.35vw,2rem)] leading-snug tracking-[0.14em] text-zinc-50`}
        style={{ wordSpacing: "0.12em", textShadow: "0 0 24px rgba(212,175,55,0.12)" }}
      >
        <span className="text-[#D4AF37]">{phaseInfo ? `0${phaseInfo.phaseIndex}` : "—"}</span>
        <span className="text-zinc-500"> ｜ </span>
        <span>{phaseInfo ? phaseInfo.phaseCn : "—"}</span>
      </div>

      <div className="mt-[clamp(1.05rem,2vw,1.35rem)] space-y-[clamp(1.05rem,2vw,1.45rem)]">
        <section>
          <div className="text-[clamp(0.6875rem,0.55rem+0.45vw,0.75rem)] tracking-[0.28em] text-[#D4AF37]/90">
            观照
          </div>
          <p
            className={`mt-2 leading-[1.75] tracking-[0.12em] text-[clamp(1rem,0.9rem+0.45vw,1.125rem)] ${bodyMain}`}
          >
            {phaseInfo?.observed ?? ""}
          </p>
        </section>
        <section>
          <div className="text-[clamp(0.6875rem,0.55rem+0.45vw,0.75rem)] tracking-[0.28em] text-[#D4AF37]/90">
            公理
          </div>
          <p
            className={`mt-2 leading-[1.75] tracking-[0.12em] text-[clamp(1rem,0.9rem+0.45vw,1.125rem)] ${bodyMain}`}
          >
            {phaseInfo?.axiom ?? ""}
          </p>
        </section>
        <section>
          <div className="text-[clamp(0.6875rem,0.55rem+0.45vw,0.75rem)] tracking-[0.28em] text-[#D4AF37]/90">
            模式
          </div>
          <p
            className={`mt-2 leading-relaxed tracking-[0.14em] text-[clamp(0.875rem,0.78rem+0.35vw,1rem)] ${bodySub}`}
          >
            {phaseInfo?.mode ?? ""}
          </p>
        </section>
        <section>
          <div className="text-[clamp(0.6875rem,0.55rem+0.45vw,0.75rem)] tracking-[0.28em] text-[#D4AF37]/90">
            解构
          </div>
          <p
            className={`mt-2 leading-relaxed tracking-[0.14em] text-[clamp(0.875rem,0.78rem+0.35vw,1rem)] ${bodySub}`}
          >
            {phaseInfo?.deconstruct ?? ""}
          </p>
        </section>
        <section>
          <div className="text-[clamp(0.6875rem,0.55rem+0.45vw,0.75rem)] tracking-[0.28em] text-[#D4AF37]/90">
            校准
          </div>
          <p
            className={`mt-2 leading-relaxed tracking-[0.14em] text-[clamp(0.875rem,0.78rem+0.35vw,1rem)] ${bodySub}`}
          >
            {mandateBody}
          </p>
        </section>
      </div>
    </div>
  );
}

/** 球体 1.12 + 体积光 spread 0.58 外缘约 1.78，再留余量给星点与数值误差 */
const MOON_SCENE_RADIUS = 1.92;
/** 略宽于常见 50°：配合 moonCameraZForFit 让球体在画布内更饱满（仍整球入画） */
const MOON_CAMERA_FOV = 56;

/**
 * 透视相机下，使半径 sceneRadius 的球在宽高比为 width/height 的画布内完整可见所需的最小 z。
 * safety 越接近 1 相机越近、月球在画面里越大，但越贴裁切边缘；略低于 1 留余量。
 */
function moonCameraZForFit(
  widthPx: number,
  heightPx: number,
  fovDeg: number,
  sceneRadius: number,
  safety = 0.965
): number {
  if (widthPx < 12 || heightPx < 12) return 6.4;
  const aspect = widthPx / heightPx;
  const vHalf = THREE.MathUtils.degToRad(fovDeg) / 2;
  const hHalf = Math.atan(Math.tan(vHalf) * aspect);
  const lim = Math.min(vHalf, hHalf) * safety;
  const z = sceneRadius / Math.tan(lim);
  return THREE.MathUtils.clamp(z, 3.25, 14);
}

function useInViewOnce<T extends HTMLElement>(opts: { rootMargin: string }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { root: null, threshold: 0.01, rootMargin: opts.rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [opts.rootMargin]);

  return { ref, inView };
}

export default function CelestialDashboard() {
  const [phaseInfo, setPhaseInfo] = useState<LunarPhaseInfo | null>(null);
  const { ref: sceneRef, inView: shouldLoad } = useInViewOnce<HTMLDivElement>({
    // 让加载触发更贴近“滚到 50vh”
    rootMargin: "0px 0px -50% 0px",
  });

  const [texturesReady, setTexturesReady] = useState(false);

  const moonCellRef = useRef<HTMLDivElement>(null);
  const copyCardRef = useRef<HTMLDivElement>(null);
  /** 桌面双列：宽=左栏满宽、高≈右侧文案卡（顶对齐第三屏体量）；手机单列：保持正方形避免竖长条 */
  const [moonViewport, setMoonViewport] = useState({ w: 320, h: 320 });

  useEffect(() => {
    const moonCell = moonCellRef.current;
    if (!moonCell) return;

    const measure = () => {
      const m = moonCell.getBoundingClientRect();
      const card = copyCardRef.current;
      const ch = card?.getBoundingClientRect().height ?? 0;
      const cw = m.width;

      const twoCol =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches;

      if (twoCol && card && ch > 120) {
        const h = Math.floor(Math.min(ch * 0.998, m.height));
        const w = Math.floor(cw);
        setMoonViewport({
          w: Math.max(260, w),
          h: Math.max(360, h),
        });
      } else {
        const capByCopy = ch > 96 ? ch * 0.985 : Number.POSITIVE_INFINITY;
        const side = Math.floor(Math.min(cw, m.height, capByCopy));
        const s = Math.max(300, side);
        setMoonViewport({ w: s, h: s });
      }
    };

    const ro = new ResizeObserver(measure);
    ro.observe(moonCell);
    const card = copyCardRef.current;
    if (card) ro.observe(card);
    measure();
    return () => ro.disconnect();
  }, []);

  const cameraZ = useMemo(
    () =>
      moonCameraZForFit(moonViewport.w, moonViewport.h, MOON_CAMERA_FOV, MOON_SCENE_RADIUS, 0.992),
    [moonViewport.w, moonViewport.h]
  );

  useEffect(() => {
    if (!shouldLoad) return;
    // 背景星空轻微位移：来自第一屏到第二屏的“沉浸切换”
    window.dispatchEvent(
      new CustomEvent("star:scene-shift", {
        detail: { x: -10, y: -6 },
      })
    );
  }, [shouldLoad]);

  useEffect(() => {
    if (!texturesReady) return;
    // 可选：极弱电子对焦声
    void playFocus();
  }, [texturesReady]);

  return (
    <motion.section
      className={`relative flex w-full flex-col ${HOME_SCREEN_MIN_HEIGHT} ${HOME_SCREEN_PAD_Y}`}
      ref={sceneRef}
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-[clamp(1rem,3.5vw,1.5rem)]">
          <div className="grid grid-cols-1 items-stretch gap-x-[clamp(0.45rem,1vw,1.35rem)] gap-y-[clamp(1.5rem,3.2vw,2.25rem)] md:grid-cols-[1.22fr_0.78fr]">
          <div className="relative z-20 flex min-w-0 justify-center overflow-visible px-0 pb-2 md:min-h-[min(620px,72svh)] md:h-full md:items-start md:justify-center md:px-1 md:pb-0">
            <div
              ref={moonCellRef}
              className="flex w-full min-h-[clamp(19rem,90vw,28rem)] max-w-[min(94vw,34rem)] items-center justify-center md:max-w-none md:min-h-0 md:h-full md:items-start md:justify-center"
            >
              <motion.div
                className="overflow-visible"
                style={{
                  width: moonViewport.w,
                  height: moonViewport.h,
                  filter: shouldLoad ? (texturesReady ? "blur(0px)" : "blur(16px)") : "blur(16px)",
                }}
                animate={{
                  filter: shouldLoad ? (texturesReady ? "blur(0px)" : "blur(16px)") : "blur(16px)",
                }}
                transition={{ duration: 1.5, ease: [0.65, 0.05, 0.36, 1] }}
              >
              {/*
                md+：视口为矩形（宽=左栏、高≈文案卡），与右卡顶对齐、同高，避免上下大留白；cameraZ 按 w×h 视锥计算仍不裁光晕。
                手机：单列仍为正方形，比例用 min(宽,高,…) 连续缩放。
              */}
              <Canvas
                className="h-full w-full bg-transparent"
                camera={{ position: [0, 0, cameraZ], fov: MOON_CAMERA_FOV }}
                gl={{ alpha: true, antialias: true }}
                onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
              >
                {shouldLoad ? (
                  <Suspense fallback={<MoonSpherePlaceholderEngine onPhaseChange={setPhaseInfo} />}>
                    <MoonSphereTexturesEngine
                      onReady={() => setTexturesReady(true)}
                      onPhaseChange={setPhaseInfo}
                    />
                  </Suspense>
                ) : (
                  <MoonSpherePlaceholderEngine onPhaseChange={setPhaseInfo} />
                )}
              </Canvas>
              </motion.div>
            </div>
          </div>

          <div
            ref={copyCardRef}
            className="relative z-10 min-w-0 w-full rounded-3xl border border-[#D4AF37]/20 bg-white/5 p-[clamp(1.15rem,2.2vw+0.55rem,2rem)] backdrop-blur-2xl"
          >
            {/* 顶区居中：题签 + 主标题 + 状态行；下方观测全文仍左对齐便于长文阅读 */}
            <div className="text-center">
            <div className="space-y-1.5">
              <motion.div
                className="text-[clamp(0.8125rem,0.68rem+0.55vw,1rem)] tracking-[0.34em] text-zinc-300"
                initial={{ opacity: 0.9 }}
                animate={{
                  opacity: texturesReady ? [0.9, 0.45, 1, 0.7, 1] : 0.9,
                  textShadow: texturesReady
                    ? [
                        "0 0 0 rgba(212,175,55,0)",
                        "0 0 12px rgba(212,175,55,0.22)",
                        "0 0 2px rgba(212,175,55,0.08)",
                        "0 0 14px rgba(212,175,55,0.20)",
                        "0 0 0 rgba(212,175,55,0)",
                      ]
                    : "0 0 0 rgba(212,175,55,0)",
                }}
                transition={{ duration: 0.48, ease: "easeOut" }}
              >
                ［气象敕令］
              </motion.div>
              <div className="text-[clamp(0.8125rem,0.68rem+0.55vw,1rem)] tracking-[0.34em] text-zinc-400">
                当前天象对齐
              </div>
            </div>

            <div
              className={`${playfair.className} mt-[clamp(0.75rem,1.5vw,1rem)] text-[clamp(1.625rem,1.15rem+1.6vw,2.25rem)] leading-[1.12] tracking-[0.2em]`}
              style={{ textShadow: "0 0 22px rgba(212,175,55,0.16)" }}
            >
              ϟ 月潮 · 信标锁定
            </div>

            <div className="mt-[clamp(0.75rem,1.5vw,1rem)] space-y-1 text-[clamp(0.9375rem,0.84rem+0.42vw,1.0625rem)] leading-snug tracking-[0.08em] text-zinc-300">
              <div>—— 月相之力 · {phaseInfo?.localeDateLabel ?? "—"} · 状态</div>
              <div className="text-zinc-400 opacity-95">
                观测台已唤醒；下一次心念将与相位的推移共振。
              </div>
            </div>
            </div>

            <ObservationLetter phaseInfo={phaseInfo} />
          </div>
        </div>
        </div>
      </div>

      <HomeScreenFooter />
    </motion.section>
  );
}

