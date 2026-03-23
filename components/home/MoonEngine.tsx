"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles, useTexture } from "@react-three/drei";
import * as THREE from "three";

export type LunarPhaseBand = "NEW_MOON" | "WAXING" | "FULL_MOON" | "WANING";

export type LunarPhaseShape8 =
  | "NEW_MOON" // 朔
  | "WAXING_CRESCENT" // 蛾眉
  | "FIRST_QUARTER" // 上弦
  | "WAXING_GIBBOUS" // 盈凸
  | "FULL_MOON" // 望
  | "WANING_GIBBOUS" // 亏凸
  | "LAST_QUARTER" // 下弦
  | "WANING_CRESCENT"; // 残

export type LunarPhaseInfo = {
  normalizedPhase: number; // 0..1
  phaseAngle: number; // radians 0..2PI
  percent: number; // 0..100
  band: LunarPhaseBand;
  phaseLabel: LunarPhaseShape8;
  /**
   * 月相八形态标题（当前为中文；日后可接 i18n）
   * phaseEng: 意象题名，与 phaseCn 天文名并列展示
   * phaseCn: 朔/蛾眉/上弦/盈凸/望/亏凸/下弦/残
   */
  phaseIndex: number; // 1..8
  phaseEng: string;
  phaseCn: string;

  observed: string; // 观照正文
  axiom: string; // 公理正文（保持字段名兼容）
  mode: string; // 模式/编码短语
  deconstruct: string; // 解构正文
  mandate: string; // 校准正文（敕令 // 动作：…）

  /** 历法日期展示串：zh-CN 格式，日期按用户设备本机时区；日后可随语言/时区偏好切换 */
  localeDateLabel: string;
};

export const LUNAR_CYCLE = 29.53059;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * 多国用户：历元与「此刻」均在**用户本机时区**下解释（`new Date(y,m,d)` / 本机 `Date.now()`），
 * 不写死单一地区。月相在平均朔望月内随**当地时钟连续推进**（同一天内明暗界线仍会缓慢移动），
 * 避免整天锁在同一照明角。
 */
/** 朔对齐历元：用户本机时区下当地日历 2026-03-14 的 0:00 对应的瞬时（毫秒） */
const EPOCH_NEW_MOON_LOCAL_MS = new Date(2026, 2, 14).getTime();

function positiveModulo(n: number, mod: number) {
  return ((n % mod) + mod) % mod;
}

/** 0..1 内归一相位，与 computeLunarPhaseInfo 使用同一公式（ms 为本机时间轴上的瞬时） */
function normalizedPhaseClampedFromInstantMs(ms: number): number {
  const diffDays = (ms - EPOCH_NEW_MOON_LOCAL_MS) / MS_PER_DAY;
  const normalized = positiveModulo(diffDays, LUNAR_CYCLE);
  return positiveModulo(normalized / LUNAR_CYCLE, 1);
}

function illuminationPhaseAngleFromInstantMs(ms: number): number {
  const clamped = normalizedPhaseClampedFromInstantMs(ms);
  return (0.5 - clamped) * Math.PI * 2;
}

/** 日期串随本机时区；locale 暂固定 zh-CN，日后可按语言切换为 en-AU 等 */
function formatLocaleDateLabel(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export function computeLunarPhaseInfo(date: Date): LunarPhaseInfo {
  const clamped = normalizedPhaseClampedFromInstantMs(date.getTime());
  const info = computeLunarPhaseInfoFromNormalized(clamped);

  return { ...info, localeDateLabel: formatLocaleDateLabel(date) };
}

function computeLunarPhaseInfoFromNormalized(normalizedPhase: number): LunarPhaseInfo {
  const clamped = positiveModulo(normalizedPhase, 1);
  const percent = clamped * 100;

  // 8 形态切分：每段为一种离散月形
  const idx = Math.floor(clamped * 8); // 0..7
  const phaseShapeOrder: LunarPhaseShape8[] = [
    "NEW_MOON",
    "WAXING_CRESCENT",
    "FIRST_QUARTER",
    "WAXING_GIBBOUS",
    "FULL_MOON",
    "WANING_GIBBOUS",
    "LAST_QUARTER",
    "WANING_CRESCENT",
  ];
  const phaseLabel = phaseShapeOrder[idx] ?? "NEW_MOON";

  // 与朔望对齐（相机在 +Z 看向原点）：clamped≈0 朔→背光；clamped≈0.5 望→正面受光
  const phaseAngle = (0.5 - clamped) * Math.PI * 2;
  const phaseIndex = idx + 1;

  const phaseEngMap: Record<LunarPhaseShape8, string> = {
    NEW_MOON: "虚空",
    WAXING_CRESCENT: "始源",
    FIRST_QUARTER: "对分",
    WAXING_GIBBOUS: "临界",
    FULL_MOON: "显真",
    WANING_GIBBOUS: "回响",
    LAST_QUARTER: "剥落",
    WANING_CRESCENT: "余息",
  };
  const phaseCnMap: Record<LunarPhaseShape8, string> = {
    NEW_MOON: "朔",
    WAXING_CRESCENT: "蛾眉",
    FIRST_QUARTER: "上弦",
    WAXING_GIBBOUS: "盈凸",
    FULL_MOON: "望",
    WANING_GIBBOUS: "亏凸",
    LAST_QUARTER: "下弦",
    WANING_CRESCENT: "残",
  };

  const docs: Record<
    LunarPhaseShape8,
    {
      observed: string;
      axiom: string;
      mode: string;
      deconstruct: string;
      mandate: string;
    }
  > = {
    NEW_MOON: {
      observed: "众星退位，虚空不回响；万象归零。",
      axiom: "所有的“无”，都是为了承载即将降临的“有”；在爆炸前那一秒，允许沉默。",
      mode: "极低频 // 深度关停 // 拒绝显化。",
      deconstruct: "你不是退场，而是为下一次显影腾出空间。",
      mandate: "敕令 // 动作：把手上那件事重新命名成一句可执行的指令。",
    },
    WAXING_CRESCENT: {
      observed: "细薄如眉，光在边缘试探；检测到意图正在晶体化。",
      axiom: "越是起点越要温柔。柔光并非弱，是未被驯服的力量。",
      mode: "意图显影 // 弱引力共振 // 频段预热。",
      deconstruct: "惊雷尚未响起，但落点已定；此时的念头，就是十四天后的宿命。",
      mandate: "敕令 // 动作：先调顺节奏，再让方向自然长出来。",
    },
    FIRST_QUARTER: {
      observed: "光影互博，边界在对分；妥协者最先失温。",
      axiom: "对分不是冲突，是筛选；阻力是意志纯度的最后压力测试。",
      mode: "绝对对焦 // 矢量裁断 // 阻力校准。",
      deconstruct: "上升不是狂奔，是把承诺抬到能兑现的高度；阻力就是你校验路线的工具。",
      mandate: "敕令 // 动作：今天只完成一个最小可交付的阶段目标。",
    },
    WAXING_GIBBOUS: {
      observed: "势能盈满，世界屏息等待你的定稿；每一毫秒都在增压。",
      axiom: "能量逼近容器极限；迟疑会把爆发的压强悄悄抬高。",
      mode: "高压 // 能量增压 // 临界突破。",
      deconstruct: "盈不是漫溢，是守住关键；每一次延迟，都在增加最终爆发的压强。",
      mandate: "敕令 // 动作：巩固主线，清理一个正在漏掉的消耗。",
    },
    FULL_MOON: {
      observed: "万事被漂白，真相在月光下脱水；所有秘密开始失去遮蔽。",
      axiom: "圆满不是终点，是你看见真相后仍愿意负责的那一刻。",
      mode: "全境显像 // 责任承接 // 峰值锁定。",
      deconstruct: "幻象碎裂之刻，真相不再隐藏；圆而不溢，这是“看见自己”的终极时刻。",
      mandate: "敕令 // 动作：收束所有发散的承诺，并为下一轮流转留出余裕。",
    },
    WANING_GIBBOUS: {
      observed: "智慧自剥离中诞生，能量开始垂直跌落；你开始听见回响本身。",
      axiom: "当你不再试图拥有，你才真正开始看清因果的走向。盈到头就会变，亏是修正的信号。",
      mode: "引力回溯 // 冗餘剝离 // 归因分析。",
      deconstruct: "不是追逐风暴，而是听回响如何把你带回因果；把注意力从索取转向清理。",
      mandate: "敕令 // 动作：写下一个该停的执念，立刻用替代行动安置它。",
    },
    LAST_QUARTER: {
      observed: "瓦片剥落，旧盔甲松动；旧神让位于新秩序。",
      axiom: "回落并不结束，是让能量回到你能走的轨道；崩塌是最后的仁慈。",
      mode: "重置中 // 负压 // 物理层复位。",
      deconstruct: "放下无法承载你此刻重量的旧盔甲；回落并不是退去，是让重量回到可承受的轨道。",
      mandate: "敕令 // 动作：清理一个不再承载你的旧路径或旧承诺。",
    },
    WANING_CRESCENT: {
      observed: "余烬未冷，灵识归于玄冥；最后一丝光仍指向方向。",
      axiom: "残月承认结束，但也允许希望继续在暗处发芽。",
      mode: "寂灭 // 淬炼（沉入回归）// 极限低压。",
      deconstruct: "用最小的仪式安置自己，为下一轮留种子；把结束当成下一次生长的土壤。",
      mandate: "敕令 // 动作：进入深度休息，或进行一次完全无目的的散步。",
    },
  };

  const doc = docs[phaseLabel];

  // 旧字段 band：用于沿用你原本的颜色分段（不影响八形态渲染）
  const rawBand: LunarPhaseBand =
    clamped < 0.1 || clamped >= 0.9 ? "NEW_MOON" : clamped < 0.4 ? "WAXING" : clamped < 0.6 ? "FULL_MOON" : "WANING";

  return {
    normalizedPhase: clamped,
    phaseAngle,
    percent,
    band: rawBand,
    phaseLabel,
    phaseIndex,
    phaseEng: phaseEngMap[phaseLabel],
    phaseCn: phaseCnMap[phaseLabel],
    observed: doc.observed,
    axiom: doc.axiom,
    mode: doc.mode,
    deconstruct: doc.deconstruct,
    mandate: doc.mandate,
    localeDateLabel: "",
  };
}

const MOON_ALBEDO_LOCAL = "/textures/moon/lroc_color_2k.jpg";
const MOON_HEIGHT_LOCAL = "/textures/moon/ldem_3_8bit.jpg";

const HALO_SHELL_COUNT = 16;

/** 蛾眉—盈凸共用：亮香槟晕 */
const WAXING_HALO_COLOR = "#f2dfb2";
const WAXING_HALO_STRENGTH = 0.46;
const WAXING_HALO_SPREAD = 0.58;

/** 朔 THE VOID：古金、收得更紧的体积光，衬剪影而非「白昼月面」 */
const VOID_HALO_COLOR = "#b9a06e";
const VOID_HALO_STRENGTH = 0.34;
const VOID_HALO_SPREAD = 0.42;

/** Sparkles 默认不写深度，易叠在月面上；强制 depthTest，亮缘在月盘外/背后，不糊月面 */
function DepthSparkles(props: React.ComponentProps<typeof Sparkles>) {
  const dpr = useThree((s) => s.viewport.dpr);
  return (
    <Sparkles {...props}>
      <sparklesImplMaterial transparent pixelRatio={dpr} depthWrite={false} depthTest />
    </Sparkles>
  );
}

/**
 * 统一柔和光晕：多层背向球壳 + 递减负指数透明度，避免「两三个大圈」的阶梯感。
 * 八种月相都走同一套逻辑，仅 color / strength 不同。
 */
function SoftVolumetricHalo({
  color,
  strength,
  spread = 0.42,
}: {
  color: string;
  strength: number;
  /** 朔等大晕时略加大扩散半径 */
  spread?: number;
}) {
  return (
    <group renderOrder={-50}>
      {Array.from({ length: HALO_SHELL_COUNT }, (_, i) => {
        const t = (i + 1) / HALO_SHELL_COUNT;
        const scale = 1.006 + t * spread;
        const fade = (1 - t) ** 2.5;
        // 内层略淡，外层加宽 spread 后仍避免在月盘中心叠光「糊脸」
        const opacity = Math.min(0.2, strength * fade * 0.055);
        return (
          <mesh key={i} scale={scale} renderOrder={-60 + i}>
            <sphereGeometry args={[1.12, 32, 32]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={opacity}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              depthTest
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function haloPresetForLabel(label: LunarPhaseShape8): { color: string; strength: number } {
  switch (label) {
    case "NEW_MOON":
      return { color: VOID_HALO_COLOR, strength: VOID_HALO_STRENGTH };
    case "WAXING_CRESCENT":
    case "FIRST_QUARTER":
    case "WAXING_GIBBOUS":
      return { color: WAXING_HALO_COLOR, strength: WAXING_HALO_STRENGTH };
    case "FULL_MOON":
      return { color: "#f5e8c8", strength: 0.4 };
    case "WANING_GIBBOUS":
      return { color: "#c2cef0", strength: 0.48 };
    case "LAST_QUARTER":
      return { color: "#b4c4ec", strength: 0.52 };
    case "WANING_CRESCENT":
      // 与下弦同属亏相末期：同一套冷侧体积光，避免与前几相「特效堆叠」割裂
      return { color: "#b4c4ec", strength: 0.52 };
    default:
      return { color: "#e8dcc0", strength: 0.4 };
  }
}

/** 紧贴球体的内层冕（仅朔用） */
function InnerGoldCorona({ color, strength }: { color: string; strength: number }) {
  const n = 10;
  return (
    <group renderOrder={-48}>
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 1) / n;
        const scale = 1.003 + t * 0.11;
        const fade = (1 - t) ** 1.6;
        const opacity = Math.min(0.28, strength * fade * 0.095);
        return (
          <mesh key={i} scale={scale} renderOrder={-55 + i}>
            <sphereGeometry args={[1.12, 28, 28]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={opacity}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              depthTest
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function MoonSpherePlaceholder({ onPhaseChange }: { onPhaseChange?: (info: LunarPhaseInfo) => void }) {
  useEffect(() => {
    const info = computeLunarPhaseInfo(new Date());
    onPhaseChange?.(info);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <directionalLight position={[2.2, 0, 8]} intensity={3.2} color={"#fff8ef"} />
      <mesh>
        <sphereGeometry args={[1.12, 64, 64]} />
        <meshStandardMaterial color={"#0a0a0a"} roughness={1} metalness={0} />
      </mesh>
    </>
  );
}

export function MoonSphereTextures({
  onReady,
  onPhaseChange,
}: {
  onReady?: () => void;
  onPhaseChange?: (info: LunarPhaseInfo) => void;
}) {
  const [map, height] = useTexture([MOON_ALBEDO_LOCAL, MOON_HEIGHT_LOCAL]);
  const moonRef = useRef<THREE.Mesh | null>(null);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, 30_000);
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const phaseInfo = useMemo(() => computeLunarPhaseInfo(now), [now]);

  useEffect(() => {
    onPhaseChange?.(phaseInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    phaseInfo.band,
    phaseInfo.localeDateLabel,
    phaseInfo.normalizedPhase,
    phaseInfo.percent,
    phaseInfo.phaseIndex,
  ]);

  // 月相切换时：月球不自转、不漂浮、镜头不推拉；主光方向每帧按本机时刻推进（与地区时钟一致）

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (moonRef.current) moonRef.current.rotation.set(0, 0, 0);
  }, [phaseInfo.phaseIndex]);

  // Hover 扫描流光
  const [hovered, setHovered] = useState(false);
  const sweepRef = useRef(0);
  const scanMatRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const scanTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 256, 256);
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "rgba(212,175,55,0)");
    g.addColorStop(0.44, "rgba(212,175,55,0)");
    g.addColorStop(0.5, "rgba(255,236,173,0.95)");
    g.addColorStop(0.56, "rgba(212,175,55,0)");
    g.addColorStop(1, "rgba(212,175,55,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    // 半圈扫描：X 只显示 180 度范围
    tex.repeat.set(0.5, 2.2);
    return tex;
  }, []);

  useEffect(() => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
    map.colorSpace = THREE.SRGBColorSpace;
    map.minFilter = THREE.LinearMipmapLinearFilter;
    map.magFilter = THREE.LinearFilter;
    map.anisotropy = 8;
    map.needsUpdate = true;

    height.wrapS = THREE.RepeatWrapping;
    height.wrapT = THREE.ClampToEdgeWrapping;
    height.colorSpace = THREE.NoColorSpace;
    height.minFilter = THREE.LinearMipmapLinearFilter;
    height.magFilter = THREE.LinearFilter;
    height.anisotropy = 8;
    height.needsUpdate = true;
  }, [map, height]);

  useEffect(() => {
    return () => {
      scanTexture?.dispose();
    };
  }, [scanTexture]);

  const label = phaseInfo.phaseLabel;
  const isVoid = label === "NEW_MOON";
  const isFull = label === "FULL_MOON";
  const isWaningGibbous = label === "WANING_GIBBOUS";
  const isLastQuarter = label === "LAST_QUARTER";
  const isWaningCrescent = label === "WANING_CRESCENT";
  const waxingAccent = phaseInfo.phaseIndex >= 2 && phaseInfo.phaseIndex <= 4;

  const haloPreset = useMemo(() => haloPresetForLabel(label), [label]);

  useFrame((_, delta) => {
    if (scanMatRef.current && scanTexture) {
      scanTexture.offset.y -= delta * 0.2;

      if (hovered) {
        sweepRef.current = (sweepRef.current + delta * 0.38) % 1;
      } else {
        sweepRef.current = THREE.MathUtils.lerp(sweepRef.current, 0, 0.06);
      }
      scanTexture.offset.x = sweepRef.current;

      const targetOpacity = hovered ? 0.22 : 0;
      scanMatRef.current.opacity = THREE.MathUtils.lerp(scanMatRef.current.opacity, targetOpacity, 0.08);
    }
  });

  const directionalRef = useRef<THREE.DirectionalLight | null>(null);
  const phaseLabelRef = useRef(label);
  useEffect(() => {
    phaseLabelRef.current = label;
  }, [label]);

  useFrame(() => {
    if (!directionalRef.current) return;
    const a = illuminationPhaseAngleFromInstantMs(Date.now());
    directionalRef.current.position.set(Math.sin(a) * 10, 0, Math.cos(a) * 10);
    // 望：略压主光，避免中心过曝；朔：略提光，让轮廓边缘有一点点受光信息
    const L = phaseLabelRef.current;
    if (L === "FULL_MOON") directionalRef.current.intensity = 2.72;
    else if (L === "NEW_MOON") directionalRef.current.intensity = 2.62;
    else directionalRef.current.intensity = 3.22;
  });

  const waxingDefault =
    !isVoid && !isFull && !isWaningGibbous && !isLastQuarter && !isWaningCrescent;

  return (
    <>
      <directionalLight ref={directionalRef} intensity={3.22} color={"#fff6ed"} />
      {/* 01 朔：地球反照（地照）— 冷色 + 微暖，照亮朝地球一侧，陨石坑可读，不是纯黑圆 */}
      {isVoid ? (
        <>
          <directionalLight position={[0, 0.1, 10.2]} intensity={0.168} color={"#b8c8e0"} />
          <directionalLight position={[0.25, -0.06, 9.6]} intensity={0.095} color={"#e8ddd2"} />
        </>
      ) : null}

      {/* 根缩放：与占位球半径 1.12 一致；无 Float / 无自转 */}
      <group scale={1}>
        <SoftVolumetricHalo
          color={haloPreset.color}
          strength={haloPreset.strength}
          spread={isVoid ? VOID_HALO_SPREAD : WAXING_HALO_SPREAD}
        />
        {isVoid ? <InnerGoldCorona color={"#c6a03a"} strength={0.32} /> : null}

        {waxingAccent ? (
          <DepthSparkles
            count={100}
            renderOrder={2}
            scale={[1.62, 1.62, 1.62]}
            size={2.35}
            speed={0.12}
            opacity={0.52}
            color={"#ffd97a"}
            noise={2.2}
          />
        ) : null}

        {isVoid ? (
          <>
            <DepthSparkles
              count={80}
              renderOrder={2}
              scale={[1.85, 1.85, 0.98]}
              size={2.05}
              speed={0.026}
              opacity={0.3}
              color={"#d4af37"}
              noise={3.2}
            />
            <DepthSparkles
              count={48}
              renderOrder={2}
              scale={[2.02, 2.02, 1.12]}
              size={1.55}
              speed={0.015}
              opacity={0.18}
              color={"#f0e0c4"}
              noise={3.8}
            />
          </>
        ) : null}

        <mesh
          ref={moonRef}
          renderOrder={10}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[1.12, 128, 128]} />
          {isVoid ? (
            <meshStandardMaterial
              map={map}
              bumpMap={height}
              bumpScale={1.2}
              color={"#131210"}
              roughness={0.96}
              metalness={0}
              emissive={"#3a4558"}
              emissiveIntensity={0.048}
              envMapIntensity={0}
            />
          ) : null}
          {isFull ? (
            <meshStandardMaterial
              map={map}
              bumpMap={height}
              bumpScale={1.12}
              roughness={0.58}
              metalness={0.04}
              color={"#d4d2cc"}
              emissive={"#b89430"}
              emissiveIntensity={0.07}
              envMapIntensity={0}
            />
          ) : null}
          {isWaningGibbous ? (
            <meshStandardMaterial
              map={map}
              bumpMap={height}
              bumpScale={2.12}
              roughness={0.52}
              metalness={0.03}
              color={"#f3f2f0"}
              envMapIntensity={0}
            />
          ) : null}
          {isLastQuarter || isWaningCrescent ? (
            <meshStandardMaterial
              map={map}
              bumpMap={height}
              bumpScale={1.96}
              roughness={0.58}
              metalness={0.025}
              color={"#ececf1"}
              envMapIntensity={0}
            />
          ) : null}
          {waxingDefault ? (
            <meshStandardMaterial
              map={map}
              bumpMap={height}
              bumpScale={2.05}
              roughness={0.58}
              metalness={0.02}
              color={"#ffffff"}
              envMapIntensity={0}
            />
          ) : null}

        </mesh>

        {scanTexture ? (
          <mesh scale={1.014} renderOrder={20}>
            <sphereGeometry args={[1.12, 96, 96]} />
            <meshBasicMaterial
              ref={scanMatRef}
              map={scanTexture}
              color={"#F7E7B5"}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              depthTest
            />
          </mesh>
        ) : null}
      </group>
    </>
  );
}

export default function MoonEngine() {
  // 预留：如果你想让 MoonEngine.tsx 直接提供“整个卡片”，可以在这里扩展为 Canvas+UI 组合。
  // 当前 CelestialDashboard 使用 MoonSphereTextures/Placeholder 直接挂载到 Canvas。
  return null;
}

