"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Link from "next/link";
import { trackHubEvent } from "@/lib/hub-analytics";
import { Inter, JetBrains_Mono, Noto_Serif_SC } from "next/font/google";
import {
  MoonStar,
  Layers,
  Pentagon,
  Hexagon,
  Gem,
  Sparkle,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import {
  parseStoredUserProfileJson,
  USER_PROFILE_STORAGE_KEY,
  USER_PROFILE_CHANGED_EVENT,
} from "@/lib/stored-user-profile";
import { type NatalBig3 } from "@/lib/natal-chart";
import {
  buildDailyCalibration,
  buildDeepObservationCopy,
  getTodayKey,
  type DailyCalibration,
  type DeepObservationCopy,
} from "@/lib/daily-axiom";
import { birthMomentToUtc } from "@/lib/natal-chart";
import { computeNatalBig3Swiss } from "@/lib/astro-chart-wheel-swiss";

const hubSerif = Noto_Serif_SC({
  weight: ["300", "400", "500", "600"],
  // 注意：当前 next/font/google 版本不认识 chinese-simplified subset
  // 使用 latin 保证构建稳定；中文会走本地字体回退栈
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const deepInter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const deepMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const HUB_ROOM_KEY = "labyrinthos-hub-room";
const HUB_LAST_VISIT_KEY = "labyrinthos-hub-last-visit";
const HUB_USER_ID_KEY = "labyrinthos-user-id";

type HubRoom = "temple" | "console";
type ManifestState = "IDLE" | "DAILY_MANIFEST" | "RITUAL_MANIFEST";

const DAILY_PLUCK_MS = 120;
const DAILY_JUDGE_MS = 300;

type HubCard = {
  title: string;
  description: string;
  plan: string;
  Icon: LucideIcon;
  /** 若设置，整张卡片可点击进入该路由（如占星工作台） */
  href?: string;
};

const CARDS: HubCard[] = [
  {
    title: "占星",
    description: "星历与人事的叠影",
    plan:
      "本命格局与行运同屏呈现，相位、宫位与月相作叙事骨架，并与页首当日光谱呼应：先看节律，再谈走向。只标出可讨论的趋势与张力，不作宿命式断语。",
    Icon: MoonStar,
    href: "/astro",
  },
  {
    title: "塔罗",
    description: "牌面为镜，照见岔路",
    plan:
      "经典牌阵与可变张数；正逆位、元素与牌位一并写入短句结论，每条皆可回溯到具体位置。适用于决策、关系与情绪周期的阶段性复盘，而非替你做选择。",
    Icon: Layers,
    href: "/tarot",
  },
  {
    title: "生命密码",
    description: "数字里的节奏与期限",
    plan:
      "生命路径、周期年与个人年并列；标明天赋带来的顺手与摩擦，以及关系、协作中的互补与冲突。用数字回答：何时宜收束步调，何时可以外放一步。",
    Icon: Pentagon,
    href: "/numerology",
  },
  {
    title: "神谕卡",
    description: "每日一句，轻量参照",
    plan:
      "支持单卡或多卡主题串联；给出关键词、情绪向度与可执行的小事建议。语气克制，可与当日宜忌对照阅读，仅作参照，不当唯一答案。",
    Icon: Hexagon,
    /** 独立路径，避免用户看到 `/tarot` 误以为进了经典牌阵；与 `?oracle=1` 同源祭坛场（经典双栏见 `?oracle=1&classic=1`） */
    href: "/oracle",
  },
  {
    title: "雷诺曼",
    description: "人事须落地，字句要具体",
    plan:
      "线性与九宫布局；人物、事件与路径牌组合解读，偏具体场景与时间邻近度。适合追问谁会入场、事如何推进、近处有何变，而少谈空泛命运。",
    Icon: Gem,
  },
  {
    title: "符文",
    description: "三枚成辞，边界须说清",
    plan:
      "固定三枚抽选与组合释义，附护符式短句与「不适用」情形。强调情境与取用条件，不包装成万能许诺；知止，亦是仪礼的一部分。",
    Icon: Sparkle,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 28 },
  },
};

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function toRgba(hex: string, alpha: number) {
  const pure = hex.replace("#", "");
  const n = parseInt(pure, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** 紫冥刻度盘 VIOLET ASTROLABE：深空径向 + 六宫环境雾 + 星历网格 + 天顶光束 + 顶层胶片噪点 */
const FILM_GRAIN_SVG = encodeURIComponent(
  `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
);

const ASTROLABE_GRID_RGB = "197, 160, 89";

/** 与桌面三列两排大致对齐的雾团锚点（视口百分比） */
const CARD_AMBIENT_ANCHORS: { x: string; y: string }[] = [
  { x: "30%", y: "56%" },
  { x: "50%", y: "56%" },
  { x: "70%", y: "56%" },
  { x: "30%", y: "76%" },
  { x: "50%", y: "76%" },
  { x: "70%", y: "76%" },
];

function AstrolabeStarGrid() {
  const radii = Array.from({ length: 16 }, (_, i) => 22 + i * 34);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {radii.map((r) => (
        <circle
          key={r}
          cx={500}
          cy={585}
          r={r}
          fill="none"
          stroke={`rgba(${ASTROLABE_GRID_RGB}, 0.08)`}
          strokeWidth={0.3}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

function AstrolabeTickGrid() {
  const marks = Array.from({ length: 48 }, (_, i) => i);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {marks.map((i) => {
        const angle = (i / marks.length) * Math.PI * 2;
        const isMajor = i % 6 === 0;
        const r1 = 238;
        const r2 = isMajor ? 278 : 262;
        const x1 = 500 + Math.cos(angle) * r1;
        const y1 = 585 + Math.sin(angle) * r1;
        const x2 = 500 + Math.cos(angle) * r2;
        const y2 = 585 + Math.sin(angle) * r2;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={`rgba(${ASTROLABE_GRID_RGB}, 0.08)`}
            strokeWidth={0.3}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

function ZenithBeam() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-0 z-[2] -translate-x-1/2"
      style={{
        width: "1px",
        height: "min(46vh, 520px)",
        background:
          "linear-gradient(180deg, rgba(56, 34, 82, 0.55) 0%, rgba(42, 27, 61, 0.24) 38%, rgba(42, 27, 61, 0.08) 70%, transparent 100%)",
        boxShadow:
          "0 0 12px rgba(42, 27, 61, 0.22), 0 0 28px rgba(42, 27, 61, 0.12)",
      }}
      aria-hidden
    />
  );
}

function FilmGrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden opacity-[0.12]"
      aria-hidden
    >
      <motion.div
        className="absolute h-[220%] w-[220%] mix-blend-soft-light"
        style={{
          left: "-60%",
          top: "-60%",
          backgroundImage: `url("data:image/svg+xml,${FILM_GRAIN_SVG}")`,
          backgroundSize: "128px 128px",
        }}
        animate={{
          x: [0, -18, 12, 0],
          y: [0, 14, -10, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

type VioletAstrolabeBackdropProps = {
  hoveredCardIndex: number | null;
  spectralHex: string;
  manifestState: ManifestState;
  gridParallaxY: MotionValue<string>;
};

function VioletAstrolabeBackdrop({
  hoveredCardIndex,
  spectralHex,
  manifestState,
  gridParallaxY,
}: VioletAstrolabeBackdropProps) {
  const mistBase = 0.15;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#06040c]">
      {/* 空间纵深：多层径向，避免纯黑平涂 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 130% 90% at 50% 115%, rgba(55, 32, 88, 0.22) 0%, transparent 52%),
            radial-gradient(ellipse 85% 55% at 50% -5%, rgba(20, 12, 38, 0.9) 0%, transparent 48%),
            radial-gradient(ellipse 120% 100% at 50% 48%, #07050f 0%, #0F0A1F 52%, #040208 100%)
          `,
        }}
      />

      {/* 六宫紫色环境雾（背景层，非卡片投影） */}
      {CARD_AMBIENT_ANCHORS.map((spot, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute z-0"
          style={{
            left: spot.x,
            top: spot.y,
            width: "min(88vw, 800px)",
            height: "min(76vh, 680px)",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(ellipse at center, rgba(26, 11, 46, 0.9) 0%, rgba(26, 11, 46, 0.35) 46%, transparent 72%)",
            filter: "blur(8px)",
          }}
          initial={{ opacity: mistBase }}
          animate={{
            opacity:
              hoveredCardIndex === i
                ? [
                    mistBase * 0.9,
                    mistBase,
                    mistBase * 1.1,
                    mistBase,
                  ]
                : [
                    mistBase * 0.95,
                    mistBase,
                    mistBase * 1.05,
                    mistBase,
                  ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* 星历网格：同心圆 + 45° 经纬（水印感，在雾之上、光束与噪点之下） */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.85]"
        style={{ y: gridParallaxY }}
      >
        <AstrolabeStarGrid />
        <AstrolabeTickGrid />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: `
            radial-gradient(ellipse 110% 70% at 10% 96%, ${toRgba(spectralHex, 0.1)} 0%, transparent 58%),
            radial-gradient(ellipse 110% 70% at 90% 96%, ${toRgba(spectralHex, 0.1)} 0%, transparent 58%)
          `,
        }}
        animate={{ opacity: manifestState === "IDLE" ? 0.5 : 1 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        aria-hidden
      />

      <ZenithBeam />
    </div>
  );
}

function DeepObservation({
  data,
  copy,
}: {
  data: DailyCalibration;
  copy: DeepObservationCopy;
}) {
  const sections = [
    copy.collisionA,
    copy.collisionB,
    copy.collisionC,
  ] as const;

  return (
    <section className="mx-auto mt-24 w-full max-w-4xl">
      <motion.h3
        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
        whileInView={{ opacity: 0.9, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={`text-center text-[21px] text-[#D2D2D8] ${deepMono.className}`}
        style={{ letterSpacing: "0.2em" }}
      >
        [ 第二层：解读态 // THE DEEP OBSERVATION ]
      </motion.h3>

      <div className="mt-12 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          whileInView={{ opacity: 0.82, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          className="border-t border-[rgba(197,160,89,0.18)] pt-6"
        >
          <p
            className={`text-[17px] text-[#BFC0C8] ${deepMono.className}`}
            style={{ letterSpacing: "0.2em" }}
          >
            {copy.collisionMeta}
          </p>
        </motion.div>

        {sections.map((text, idx) => (
          <motion.article
            key={`collision-${idx}`}
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            whileInView={{ opacity: 0.94, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.72, delay: idx * 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="border-l border-[0.3px] border-[rgba(197,160,89,0.26)] pl-5 md:pl-6"
            whileHover={{
              filter: "drop-shadow(0 0 20px rgba(232,196,120,0.52))",
            }}
          >
            <p
              className={`text-[23px] leading-[1.92] text-[#D6D6DB] ${deepInter.className}`}
              style={{
                letterSpacing: "0.2em",
                textShadow:
                  "0 0 8px rgba(232,196,120,0.14), 0 0 1px rgba(0,0,0,0.55)",
              }}
            >
              {text}
            </p>
          </motion.article>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
        whileInView={{ opacity: 0.92, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        className={`mt-12 text-center text-[18px] text-[#B8B8BE] ${deepMono.className}`}
        style={{ letterSpacing: "0.2em" }}
      >
        今日参数闭环 // [ LOCKED ]：{data.hex} / {data.anchor.toFixed(4)} / {data.axiom.scene}
      </motion.p>
    </section>
  );
}

type PsychicMonitorProps = {
  state: ManifestState;
  data: DailyCalibration;
  onRequestManifest: () => void;
};

type DailySeq = "pluck" | "judge" | "ink";
type BurstPhase = "idle" | "ignite" | "radiate";

function PsychicMonitor({ state, data, onRequestManifest }: PsychicMonitorProps) {
  const [countValue, setCountValue] = useState(0);
  const [dailySeq, setDailySeq] = useState<DailySeq>("pluck");
  const [burstPhase, setBurstPhase] = useState<BurstPhase>("idle");
  const manifestCompleteRef = useRef(false);
  const goldHoverOnceRef = useRef(false);
  const triggerTimerRef = useRef<number | null>(null);
  const radiateTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (state !== "IDLE") return;
    queueMicrotask(() => {
      setDailySeq("pluck");
      setCountValue(0);
      setBurstPhase("idle");
      manifestCompleteRef.current = false;
      goldHoverOnceRef.current = false;
    });
  }, [state]);

  useEffect(() => {
    return () => {
      if (triggerTimerRef.current !== null) {
        window.clearTimeout(triggerTimerRef.current);
      }
      if (radiateTimerRef.current !== null) {
        window.clearTimeout(radiateTimerRef.current);
      }
      if (finishTimerRef.current !== null) {
        window.clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state !== "DAILY_MANIFEST") return;
    queueMicrotask(() => setDailySeq("pluck"));
    const t1 = window.setTimeout(() => setDailySeq("judge"), DAILY_PLUCK_MS);
    const t2 = window.setTimeout(
      () => setDailySeq("ink"),
      DAILY_PLUCK_MS + DAILY_JUDGE_MS,
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [state]);

  useEffect(() => {
    if (state !== "DAILY_MANIFEST" || dailySeq !== "ink") return;
    manifestCompleteRef.current = false;
    const start = performance.now();
    const duration = 820;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - (1 - p) ** 2;
      setCountValue(data.anchor * ease);
      if (p >= 1 && !manifestCompleteRef.current) {
        manifestCompleteRef.current = true;
        trackHubEvent("hub_manifest_complete", {
          mode: "DAILY_MANIFEST",
          duration_ms: DAILY_PLUCK_MS + DAILY_JUDGE_MS + duration,
          anchor: data.anchor,
        });
      }
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, dailySeq, data.anchor]);

  const triggerFromGold = () => {
    if (state !== "IDLE") return;
    if (triggerTimerRef.current !== null) return;
    setBurstPhase("ignite");
    radiateTimerRef.current = window.setTimeout(() => {
      setBurstPhase("radiate");
    }, 120);
    triggerTimerRef.current = window.setTimeout(() => {
      triggerTimerRef.current = null;
      onRequestManifest();
    }, 540);
    finishTimerRef.current = window.setTimeout(() => {
      setBurstPhase("idle");
      if (radiateTimerRef.current !== null) {
        window.clearTimeout(radiateTimerRef.current);
        radiateTimerRef.current = null;
      }
      finishTimerRef.current = null;
    }, 980);
    if (!goldHoverOnceRef.current) {
      goldHoverOnceRef.current = true;
      trackHubEvent("hub_gold_string_hover");
    }
  };

  const etchedClass =
    "text-[23px] font-medium leading-[1.5] text-[#F2D596] [letter-spacing:0.2em]";
  const paramClass =
    "text-[16px] font-medium text-[#CACAD1] [letter-spacing:0.2em]";

  const showDailyInk = state === "DAILY_MANIFEST" && dailySeq === "ink";
  const showDailyJudge = state === "DAILY_MANIFEST" && dailySeq === "judge";
  const showParams = showDailyInk;
  const showManifestNoise = state === "DAILY_MANIFEST" && dailySeq !== "pluck";

  return (
    <div className="relative mx-auto mt-8 w-full max-w-4xl min-h-[260px]">
      {burstPhase !== "idle" && (
        <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center" aria-hidden>
          <motion.div
            className="absolute h-[min(66vw,420px)] w-[min(66vw,420px)] rounded-full"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={
              burstPhase === "ignite"
                ? { scale: 0.92, opacity: 0.95 }
                : { scale: 1.36, opacity: 0 }
            }
            transition={{ duration: burstPhase === "ignite" ? 0.12 : 0.5, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle, rgba(247,218,150,0.85) 0%, rgba(232,196,120,0.42) 28%, rgba(197,160,89,0.2) 48%, transparent 72%)",
            }}
          />
          <motion.div
            className="absolute h-[2px] w-[min(88vw,640px)]"
            initial={{ scaleX: 0.1, opacity: 0 }}
            animate={
              burstPhase === "ignite"
                ? { scaleX: 0.9, opacity: 1 }
                : { scaleX: 1.85, opacity: 0 }
            }
            transition={{ duration: burstPhase === "ignite" ? 0.14 : 0.56, ease: "easeOut" }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(247,218,150,0.98), transparent)",
              boxShadow:
                "0 0 26px rgba(247,218,150,0.9), 0 0 84px rgba(197,160,89,0.58)",
            }}
          />
          <motion.div
            className="absolute h-[2px] w-[min(88vw,640px)]"
            initial={{ rotate: 90, scaleX: 0.1, opacity: 0 }}
            animate={
              burstPhase === "ignite"
                ? { rotate: 90, scaleX: 0.9, opacity: 1 }
                : { rotate: 90, scaleX: 1.85, opacity: 0 }
            }
            transition={{ duration: burstPhase === "ignite" ? 0.14 : 0.56, ease: "easeOut" }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(247,218,150,0.95), transparent)",
              boxShadow:
                "0 0 24px rgba(247,218,150,0.85), 0 0 72px rgba(197,160,89,0.46)",
            }}
          />
        </div>
      )}
      <div className="relative z-[1] mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 text-center min-h-[260px]">
        <div className="relative flex w-full max-w-[640px] items-center justify-between">
          <motion.span
            className={`${paramClass} text-left`}
            initial={false}
            animate={{
              opacity: showParams ? 0.78 : 0,
              filter: showParams ? "blur(0px)" : "blur(8px)",
            }}
            transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}
            style={{
              fontFamily:
                '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            {data.hex}
          </motion.span>
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5">
            {(showDailyJudge || showDailyInk) && (
              <motion.div
                key="daily-axiom"
                className={`${etchedClass} flex flex-col items-center gap-1`}
                style={{
                  textShadow:
                    "0 0 30px rgba(242,213,150,0.72), 0 0 10px rgba(197,160,89,0.5), 0 1px 0 rgba(0,0,0,0.75)",
                  fontFamily:
                    '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                }}
                initial={{ filter: "blur(12px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                transition={{
                  duration: DAILY_JUDGE_MS / 1000,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <span className="whitespace-nowrap">[ 象 ]：{data.axiom.scene}</span>
                <span className="whitespace-nowrap">[ 定 ]：{data.axiom.action}</span>
              </motion.div>
            )}
            {state === "IDLE" && (
              <motion.button
                type="button"
                className="relative flex h-[152px] w-[152px] cursor-pointer items-center justify-center rounded-full border border-[rgba(197,160,89,0.52)] bg-[rgba(10,10,12,0.32)]"
                role="button"
                tabIndex={0}
                aria-label="触发符文以显影今日节律"
                onPointerEnter={() => {
                  if (!goldHoverOnceRef.current) {
                    goldHoverOnceRef.current = true;
                    trackHubEvent("hub_gold_string_hover");
                  }
                }}
                onPointerDown={(e) => {
                  trackHubEvent("hub_gold_string_activate", {
                    pointer_type: e.pointerType,
                  });
                  triggerFromGold();
                }}
                onClick={triggerFromGold}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    trackHubEvent("hub_gold_string_activate", { input: "keyboard" });
                    triggerFromGold();
                  }
                }}
                style={{
                  boxShadow:
                    "inset 0 0 34px rgba(197,160,89,0.44), 0 0 86px rgba(197,160,89,0.55), 0 0 180px rgba(197,160,89,0.34)",
                }}
                animate={
                  {
                    scale: [0.95, 1.09, 0.97, 1.1, 0.95],
                    opacity: [0.84, 1, 0.88, 1, 0.84],
                  } as const
                }
                whileHover={{
                  scale: [1, 1.12, 0.95, 1.06, 1],
                  rotate: [0, 3, -3, 2, 0],
                  transition: { duration: 0.14, ease: "easeInOut" },
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="pointer-events-none absolute inset-2 rounded-full border border-[rgba(197,160,89,0.32)]"
                  animate={{ rotate: [0, 8, 0], opacity: [0.52, 0.9, 0.52] }}
                  transition={{ duration: 2.45, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />
                <motion.div
                  className="pointer-events-none absolute h-[2px] w-[196px]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(232,196,120,0.92), transparent)",
                    boxShadow:
                      "0 0 18px rgba(232,196,120,0.8), 0 0 44px rgba(197,160,89,0.38)",
                  }}
                  animate={{
                    rotate: [0, 45, 90, 135, 180],
                    opacity: [0.35, 0.9, 0.4, 0.88, 0.35],
                  }}
                  transition={{ duration: 2.3, repeat: Infinity, ease: "linear" }}
                  aria-hidden
                />
                <motion.span
                  className="text-[40px] text-[#F1CF87]"
                  style={{
                    fontFamily:
                      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                    textShadow: "0 0 28px rgba(241,207,135,0.92), 0 0 62px rgba(197,160,89,0.62)",
                  }}
                  animate={{ opacity: [0.86, 1, 0.9], scale: [0.95, 1.12, 0.98] }}
                  transition={{ duration: 2.05, repeat: Infinity, ease: "easeInOut" }}
                >
                  ⟡
                </motion.span>
                {burstPhase !== "idle" && (
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-full"
                    initial={{ scale: 0.55, opacity: 0.9 }}
                    animate={
                      burstPhase === "ignite"
                        ? { scale: 0.95, opacity: 1 }
                        : { scale: 1.7, opacity: 0 }
                    }
                    transition={{ duration: burstPhase === "ignite" ? 0.12 : 0.38, ease: "easeOut" }}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(247,218,150,0.75) 0%, rgba(232,196,120,0.25) 40%, transparent 72%)",
                    }}
                    aria-hidden
                  />
                )}
              </motion.button>
            )}
            {state === "DAILY_MANIFEST" && (
              <motion.div
                className="relative flex h-[84px] w-[84px] items-center justify-center rounded-full border border-[rgba(197,160,89,0.24)]"
                style={{
                  boxShadow:
                    "0 0 20px rgba(197,160,89,0.32), inset 0 0 22px rgba(197,160,89,0.15)",
                }}
                animate={
                  dailySeq === "pluck"
                    ? {
                        x: [0, 7, -7, 6, -5, 3, -2, 0],
                        scale: [1, 1.24, 0.86, 1.16, 0.92, 1.08, 1],
                        opacity: [0.78, 1, 0.62, 1, 0.74, 0.9, 0.82],
                      }
                    : { opacity: 0.66, scale: 1, x: 0 }
                }
                transition={{
                  duration: dailySeq === "pluck" ? DAILY_PLUCK_MS / 1000 : 0.28,
                  ease: "easeInOut",
                }}
              >
                <span
                  className="text-[21px] text-[#C5A059]"
                  style={{
                    fontFamily:
                      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                    textShadow: "0 0 12px rgba(197,160,89,0.42)",
                  }}
                >
                  ⟡
                </span>
              </motion.div>
            )}
          </div>
          <motion.span
            className={`${paramClass} text-right tabular-nums`}
            initial={false}
            animate={{
              opacity: showParams ? 0.78 : 0,
              filter: showParams ? "blur(0px)" : "blur(8px)",
            }}
            transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}
            style={{
              fontFamily:
                '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            {countValue.toFixed(4)}
          </motion.span>
        </div>
      </div>

      {showManifestNoise && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-[3] mx-auto max-w-3xl mix-blend-soft-light opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,${FILM_GRAIN_SVG}")`,
            backgroundSize: "112px 112px",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 50%", "30% 100%", "0% 0%"],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "linear",
          }}
          aria-hidden
        />
      )}
    </div>
  );
}

/** 星舰控制台：午夜青蓝底（非纯黑）+ 网格与 HUD */
function ConsoleBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(165deg, #0f1c28 0%, #0a1520 40%, #081018 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(120, 200, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120, 200, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(80, 160, 255, 0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(80, 160, 255, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: "8px 8px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(50, 120, 190, 0.2) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(35, 90, 130, 0.14) 0%, transparent 50%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(140, 210, 255, 0.35), transparent)",
          boxShadow: "0 0 24px rgba(100, 180, 255, 0.25)",
        }}
        initial={{ top: "-2%" }}
        animate={{ top: ["-2%", "102%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      />
      {(
        [
          "left-5 top-5 border-l border-t",
          "right-5 top-5 border-r border-t",
          "left-5 bottom-5 border-l border-b",
          "right-5 bottom-5 border-r border-b",
        ] as const
      ).map((c) => (
        <div
          key={c}
          className={`pointer-events-none absolute h-10 w-10 border-[rgba(120,190,255,0.35)] md:h-12 md:w-12 ${c}`}
          style={{ borderWidth: "1px" }}
          aria-hidden
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 90% at 50% 50%, transparent 38%, rgba(4, 12, 20, 0.75) 100%)",
        }}
      />
    </div>
  );
}

export default function UniverseHub() {
  const [room, setRoom] = useState<HubRoom>("temple");
  const [manifestState, setManifestState] =
    useState<ManifestState>("IDLE");
  const [dailyData, setDailyData] = useState<DailyCalibration>({
    seed: 0,
    anchor: 0,
    hex: "#1A0B2E",
    axiom: {
      scene: "风大浪急",
      action: "收网回家",
      advice: "环境有点乱，先把手里的活做稳，再谈下一步。",
    },
    envElement: "土",
    envIntensity: 0.35,
  });
  const [templeReady, setTempleReady] = useState(false);
  const [voidHoveredCard, setVoidHoveredCard] = useState<number | null>(null);
  const [big3, setBig3] = useState<NatalBig3 | null>(null);
  const [birthDayTail, setBirthDayTail] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const monitorOpacity = useTransform(scrollY, [0, 340], [1, 0.2]);
  const monitorY = useTransform(scrollY, [0, 340], [0, -44]);
  const gridParallaxY = useTransform(scrollY, [0, 1200], ["0%", "-15%"]);
  const deepCopy = useMemo(
    () => buildDeepObservationCopy(dailyData, big3, birthDayTail),
    [dailyData, big3, birthDayTail],
  );
  const beginManifest = useCallback(() => {
    setManifestState((prev) => {
      if (prev !== "IDLE") return prev;
      trackHubEvent("hub_manifest_start", {
        mode: "DAILY_MANIFEST",
        source: "user_gold",
      });
      return "DAILY_MANIFEST";
    });
  }, []);

  useEffect(() => {
    try {
      const v = localStorage.getItem(HUB_ROOM_KEY);
      if (v === "temple" || v === "console") {
        queueMicrotask(() => setRoom(v));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (room !== "temple") {
      queueMicrotask(() => setTempleReady(false));
      return;
    }
    try {
      const now = new Date();
      const dayKey = getTodayKey();
      let uid = localStorage.getItem(HUB_USER_ID_KEY);
      if (!uid) {
        uid = `u-${hashString(`${navigator.userAgent}-${Date.now()}`).toString(
          36,
        )}`;
        localStorage.setItem(HUB_USER_ID_KEY, uid);
      }
      const uidFinal = uid;
      queueMicrotask(() => {
        setDailyData(buildDailyCalibration(uidFinal, dayKey));
        setManifestState("IDLE");
        setTempleReady(true);
      });

      localStorage.setItem(HUB_LAST_VISIT_KEY, dayKey);

      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      const msToMidnight = nextMidnight.getTime() - now.getTime();
      const midnightTimer = window.setTimeout(() => {
        const key = getTodayKey();
        setDailyData(buildDailyCalibration(uidFinal, key));
        localStorage.setItem(HUB_LAST_VISIT_KEY, key);
        setManifestState("IDLE");
      }, msToMidnight + 40);
      return () => {
        window.clearTimeout(midnightTimer);
      };
    } catch {
      queueMicrotask(() => {
        setManifestState("IDLE");
        setTempleReady(true);
      });
    }
  }, [room]);

  useEffect(() => {
    const syncBig3 = () => {
      const raw = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      const profile = parseStoredUserProfileJson(raw);

      if (!profile?.birthdate) {
        setBig3(null);
        setBirthDayTail(null);
        return;
      }

      const m = profile.birthdate.match(/^\d{4}-\d{2}-(\d{2})$/);
      setBirthDayTail(m ? Number(m[1]) : null);

      const run = async () => {
        const utc = birthMomentToUtc(profile.birthdate, profile.birthTime, profile.timeZone);
        if (!utc) {
          setBig3(null);
          return;
        }
        const next = await computeNatalBig3Swiss(utc, profile.latitude, profile.longitude);
        setBig3(next);
      };

      void run();
    };
    syncBig3();
    window.addEventListener(USER_PROFILE_CHANGED_EVENT, syncBig3);
    return () => window.removeEventListener(USER_PROFILE_CHANGED_EVENT, syncBig3);
  }, []);

  const pickRoom = (next: HubRoom) => {
    trackHubEvent("hub_room_select", {
      room: next === "temple" ? "temple" : "console",
    });
    setRoom(next);
    if (next !== "temple") setVoidHoveredCard(null);
    try {
      localStorage.setItem(HUB_ROOM_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={`relative min-h-[100dvh] overflow-hidden text-zinc-100 ${
        room === "temple" ? "bg-[#050505]" : "bg-[#0a1520]"
      }`}
      style={{
        paddingBottom: "calc(5.75rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <motion.div
          key={room}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0"
        >
          {room === "temple" ? (
            <VioletAstrolabeBackdrop
              hoveredCardIndex={voidHoveredCard}
              spectralHex={dailyData.hex}
              manifestState={manifestState}
              gridParallaxY={gridParallaxY}
            />
          ) : (
            <ConsoleBackground />
          )}
        </motion.div>
      </div>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[60] mix-blend-soft-light opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,${FILM_GRAIN_SVG}")`,
          backgroundSize: "128px 128px",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 60%", "35% 100%", "0% 0%"],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        aria-hidden
      />

      <Link
        href="/"
        onClick={() => trackHubEvent("hub_nav_home")}
        className={`fixed left-4 z-[45] flex items-center gap-1 rounded-md border border-[rgba(197,160,89,0.18)] bg-[rgba(8,8,10,0.72)] px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-md transition-colors hover:border-[rgba(197,160,89,0.32)] hover:bg-[rgba(12,12,14,0.82)] md:gap-1.5 md:px-2.5 ${hubSerif.className}`}
        style={{ top: "max(0.85rem, env(safe-area-inset-top))" }}
        aria-label="返回首页"
      >
        <ChevronLeft
          className="h-3.5 w-3.5 shrink-0 text-[#C5A059] opacity-90 md:h-4 md:w-4"
          strokeWidth={1.5}
          aria-hidden
        />
        <span className="text-[10px] font-light tracking-[0.28em] text-[#C5A059] md:text-[11px]">
          首页
        </span>
      </Link>

      <div
        className={`fixed right-4 z-[45] flex rounded-md border border-[rgba(197,160,89,0.18)] bg-[rgba(8,8,10,0.72)] p-px shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-md ${hubSerif.className}`}
        style={{ top: "max(0.85rem, env(safe-area-inset-top))" }}
        role="group"
        aria-label="界面风格：虚空或控制台"
      >
        <button
          type="button"
          onClick={() => pickRoom("temple")}
          className={`rounded-[5px] px-2.5 py-1.5 text-[10px] font-light tracking-[0.28em] transition-colors md:px-3 md:text-[11px] ${
            room === "temple"
              ? "bg-[rgba(197,160,89,0.1)] text-[#C5A059]"
              : "text-[#666] hover:text-[#C5A059]"
          }`}
        >
          虚空
        </button>
        <button
          type="button"
          onClick={() => pickRoom("console")}
          className={`rounded-[5px] px-2.5 py-1.5 text-[10px] font-light tracking-[0.28em] transition-colors md:px-3 md:text-[11px] ${
            room === "console"
              ? "bg-[rgba(197,160,89,0.1)] text-[#C5A059]"
              : "text-[#666] hover:text-[#C5A059]"
          }`}
        >
          控制台
        </button>
      </div>

      <div
        className={`relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 pb-12 pt-12 antialiased md:px-14 md:pt-[5rem] ${hubSerif.className}`}
      >
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
          className={
            room === "temple"
              ? "mx-auto mt-4 max-w-[24rem] text-center text-[1.9rem] font-medium leading-[1.45] tracking-[0.6em] text-[#C5A059] md:mt-6 md:max-w-none md:text-[2.45rem]"
              : "mx-auto mt-4 max-w-[24rem] text-center text-[1.9rem] font-medium leading-[1.45] tracking-[0.28em] text-[#C5A059] md:mt-6 md:max-w-none md:text-[2.45rem] md:tracking-[0.32em]"
          }
          style={{
            fontFeatureSettings: '"kern" 1',
            filter:
              room === "temple"
                ? "drop-shadow(0 2px 24px rgba(0,0,0,0.9)) drop-shadow(0 0 16px rgba(197,160,89,0.34))"
                : "drop-shadow(0 2px 16px rgba(0,0,0,0.92)) drop-shadow(0 0 14px rgba(197,160,89,0.28))",
          }}
        >
          于此展开你的星图
        </motion.h1>

        {room === "temple" && (
          <motion.div
            className="mx-auto mt-11 text-center md:mt-14"
            style={{ y: monitorY, opacity: monitorOpacity }}
          >
            <h2
              className="text-[17px] font-medium tracking-[0.48em] text-[#C5A059] md:text-[19px] md:tracking-[0.52em]"
              style={{ textShadow: "0 0 18px rgba(197,160,89,0.28)" }}
            >
              今日节律
            </h2>
            <p
              className="mt-3.5 text-[12px] text-[#888] md:text-[13px]"
              style={{
                fontFamily:
                  '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                letterSpacing: "0.2em",
              }}
            >
              {manifestState === "IDLE"
                ? "[ 频率校准中... ]"
                : "[ LOCKED // 已对焦 ]"}
            </p>
          </motion.div>
        )}

        {room === "temple" && templeReady && (
          <motion.div style={{ y: monitorY, opacity: monitorOpacity }}>
            <PsychicMonitor
              state={manifestState}
              data={dailyData}
              onRequestManifest={beginManifest}
            />
          </motion.div>
        )}

        {room === "temple" && templeReady && manifestState !== "IDLE" && (
          <DeepObservation data={dailyData} copy={deepCopy} />
        )}

        <h2
          className={`mx-auto text-center text-[17px] font-medium tracking-[0.48em] text-[#C5A059] md:text-[19px] md:tracking-[0.52em] ${
            room === "temple" ? "mt-16 md:mt-[4.5rem]" : "mt-14 md:mt-16"
          }`}
          style={{ textShadow: "0 0 18px rgba(197,160,89,0.28)" }}
        >
          各法交付说明
        </h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className={`mx-auto flex w-full max-w-md items-center gap-4 ${
            room === "temple" ? "mt-6 md:mt-7" : "mt-6 md:mt-7"
          }`}
          aria-hidden
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(197,160,89,0.25)]" />
          <span
            className="h-1 w-1 rotate-45 border border-[rgba(197,160,89,0.35)]"
            style={{ boxShadow: "0 0 12px rgba(197,160,89,0.15)" }}
          />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(197,160,89,0.25)]" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-16 grid grid-cols-1 gap-8 md:mt-24 md:grid-cols-3 md:gap-10"
        >
          {CARDS.map((c, idx) => {
            const panelChildren = (
              <>
                <span
                  className={`pointer-events-none absolute left-5 top-5 h-3.5 w-3.5 border-l border-t ${
                    room === "temple"
                      ? "border-[rgba(197,160,89,0.12)]"
                      : "border-[rgba(197,160,89,0.2)]"
                  }`}
                  aria-hidden
                />
                <span
                  className={`pointer-events-none absolute right-5 top-5 h-3.5 w-3.5 border-r border-t ${
                    room === "temple"
                      ? "border-[rgba(197,160,89,0.12)]"
                      : "border-[rgba(197,160,89,0.2)]"
                  }`}
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute right-6 top-6 text-[11px] font-light tabular-nums tracking-[0.2em] text-[rgba(197,160,89,0.18)] md:text-[12px]"
                  aria-hidden
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  className="pointer-events-none absolute inset-x-9 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(197,160,89,0.2)] to-transparent"
                  aria-hidden
                />

                <div className="relative mb-7 mt-1 flex justify-center md:mb-8">
                  <c.Icon
                    className={
                      room === "temple"
                        ? "h-12 w-12 text-[#C5A059] transition-all duration-300 ease-out group-hover:scale-[1.03] md:h-14 md:w-14"
                        : "h-12 w-12 text-[#d4b76a] transition-all duration-500 ease-out group-hover:scale-105 group-hover:text-[#f0dfa0] md:h-14 md:w-14"
                    }
                    style={{
                      filter:
                        room === "temple"
                          ? "drop-shadow(0 2px 6px rgba(0,0,0,0.85))"
                          : "drop-shadow(0 2px 4px rgba(0,0,0,0.75)) drop-shadow(0 0 16px rgba(197,160,89,0.35))",
                    }}
                    strokeWidth={1.15}
                    aria-hidden
                  />
                </div>
                <h3
                  className={`text-center text-[18px] font-medium tracking-[0.22em] md:text-[20px] ${
                    room === "temple" ? "text-[#C5A059]" : "text-[#e0c88a]"
                  }`}
                >
                  {c.title}
                </h3>
                <p
                  className={`mt-5 text-center text-[14px] font-light leading-[1.85] tracking-[0.04em] md:text-[15px] ${
                    room === "temple"
                      ? "text-[#C5A059]/[0.55]"
                      : "text-[#9ea3c0]"
                  }`}
                >
                  {c.description}
                </p>
                <p
                  className={`mt-6 text-left text-[13.5px] font-light leading-[1.9] tracking-[0.06em] md:text-[14.5px] ${
                    room === "temple" ? "text-[#9a9ca0]" : "text-[#8b90a8]"
                  }`}
                >
                  {c.plan}
                </p>
              </>
            );

            return (
              <motion.div
                key={c.title}
                variants={item}
                className="perspective-[1200px]"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 520, damping: 38 }}
              >
                {room === "temple" ? (
                  c.href ? (
                    <Link
                      href={c.href}
                      className="block h-full rounded-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(197,160,89,0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060508]"
                      onClick={() => {
                        if (c.href === "/astro") trackHubEvent("hub_card_astro_open");
                        if (c.href === "/tarot") trackHubEvent("hub_card_tarot_open");
                        if (c.href === "/oracle") trackHubEvent("hub_card_oracle_open");
                        if (c.href?.startsWith("/numerology")) trackHubEvent("hub_card_numerology_open");
                      }}
                    >
                      <div
                        role="article"
                        aria-label={`${c.title}：${c.description}`}
                        onMouseEnter={() => setVoidHoveredCard(idx)}
                        onMouseLeave={() => setVoidHoveredCard(null)}
                        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[32px] border-[0.5px] border-[rgba(197,160,89,0.22)] px-8 pb-10 pt-9 backdrop-blur-[20px] transition-[border-color] duration-300 hover:border-[rgba(197,160,89,0.38)]"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(125, 107, 125, 0.4) 0%, rgba(26, 11, 46, 0.78) 100%)",
                        }}
                      >
                        {panelChildren}
                      </div>
                    </Link>
                  ) : (
                    <div
                      role="article"
                      aria-label={`${c.title}：${c.description}`}
                      onMouseEnter={() => setVoidHoveredCard(idx)}
                      onMouseLeave={() => setVoidHoveredCard(null)}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border-[0.5px] border-[rgba(197,160,89,0.22)] px-8 pb-10 pt-9 backdrop-blur-[20px] transition-[border-color] duration-300 hover:border-[rgba(197,160,89,0.38)]"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(125, 107, 125, 0.4) 0%, rgba(26, 11, 46, 0.78) 100%)",
                      }}
                    >
                      {panelChildren}
                    </div>
                  )
                ) : c.href ? (
                  <Link
                    href={c.href}
                    className="block h-full rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(197,160,89,0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0c14]"
                    onClick={() => {
                      if (c.href === "/astro") trackHubEvent("hub_card_astro_open");
                      if (c.href === "/tarot") trackHubEvent("hub_card_tarot_open");
                      if (c.href === "/oracle") trackHubEvent("hub_card_oracle_open");
                      if (c.href?.startsWith("/numerology")) trackHubEvent("hub_card_numerology_open");
                    }}
                  >
                    <div
                      className="group relative rounded-[18px] p-px transition-[filter,box-shadow] duration-500 ease-out hover:shadow-[0_24px_64px_rgba(0,0,0,0.65),0_0_40px_rgba(197,160,89,0.12)]"
                      style={{
                        background:
                          "linear-gradient(145deg, rgba(220,190,120,0.55) 0%, rgba(197,160,89,0.15) 38%, rgba(130,90,180,0.28) 100%)",
                      }}
                    >
                      <div
                        role="article"
                        aria-label={`${c.title}：${c.description}`}
                        className="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[17px] bg-gradient-to-b from-[rgba(36,40,56,0.96)] to-[rgba(18,20,32,0.98)] px-8 pb-10 pt-9 shadow-[inset_0_1px_0_rgba(230,238,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-2xl transition-[background-color,box-shadow] duration-500 hover:from-[rgba(42,46,62,0.98)] hover:to-[rgba(22,24,38,0.99)] hover:shadow-[inset_0_1px_0_rgba(230,238,255,0.11)]"
                      >
                        {panelChildren}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    className="group relative rounded-[18px] p-px transition-[filter,box-shadow] duration-500 ease-out hover:shadow-[0_24px_64px_rgba(0,0,0,0.65),0_0_40px_rgba(197,160,89,0.12)]"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(220,190,120,0.55) 0%, rgba(197,160,89,0.15) 38%, rgba(130,90,180,0.28) 100%)",
                    }}
                  >
                    <div
                      role="article"
                      aria-label={`${c.title}：${c.description}`}
                      className="relative flex h-full flex-col overflow-hidden rounded-[17px] bg-gradient-to-b from-[rgba(36,40,56,0.96)] to-[rgba(18,20,32,0.98)] px-8 pb-10 pt-9 shadow-[inset_0_1px_0_rgba(230,238,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-2xl transition-[background-color,box-shadow] duration-500 hover:from-[rgba(42,46,62,0.98)] hover:to-[rgba(22,24,38,0.99)] hover:shadow-[inset_0_1px_0_rgba(230,238,255,0.11)]"
                    >
                      {panelChildren}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      <FilmGrainOverlay />
    </div>
  );
}
