"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GOLD = "#C5A059";
const GOLD_HOT = "#f7e7b5";
const VB_W = 1000;
const VB_H = 42;
const MID = VB_H / 2;

const BREATH_PERIOD_SEC = 432.16 / 100;

type ResonanceLineProps = {
  progress: number;
  dateReadout: string;
  monoClassName: string;
  className?: string;
};

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function sampleWaveY(x: number, progress: number, phase: number): number {
  const p = clamp01(progress);
  if (p >= 0.998) return MID;

  const baseAmp = 13.2 * (1 - p * 0.85) + 0.62;
  const f0 = 0.0074 + p * 0.052;

  let carrier = Math.sin(f0 * x + phase);
  const sharpMix = p * 0.62;
  carrier = carrier * (1 - sharpMix) + Math.sign(carrier) * Math.abs(carrier) ** (0.52 + p * 0.48) * sharpMix;

  let fbm = 0;
  let a = 0.5;
  for (let o = 1; o <= 5; o++) {
    fbm += (a / o) * Math.sin(f0 * x * (1.52 + o * 0.4) + phase * (0.35 + o * 0.17) + o * 1.63);
    a *= 0.6;
  }
  const noiseW = (1 - p) ** 1.55 * 0.92 + p * 0.12;

  return MID + baseAmp * carrier + baseAmp * noiseW * fbm;
}

function pointsToSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  const pts = points;
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(3)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(3)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(3)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(3)}`;
  }
  return d;
}

function buildSmoothWavePath(progress: number, phase: number): string {
  const p = clamp01(progress);
  if (p >= 0.998) return "";

  const segments = 80;
  const dx = VB_W / segments;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= segments; i++) {
    const x = i * dx;
    points.push({ x, y: sampleWaveY(x, progress, phase) });
  }
  return pointsToSmoothPath(points);
}

function straightPath(): string {
  return `M 0 ${MID} L ${VB_W} ${MID}`;
}

/** 弦中点斜率 → 微弱旋转（度），让文字与波同向「咬合」 */
function waveTiltDegAtCenter(progress: number, phase: number): number {
  const cx = VB_W / 2;
  const eps = 14;
  const yL = sampleWaveY(cx - eps, progress, phase);
  const yR = sampleWaveY(cx + eps, progress, phase);
  const dy = yR - yL;
  const slopeRad = Math.atan2(dy, 2 * eps);
  const deg = (slopeRad * 180) / Math.PI;
  return Math.max(-5, Math.min(5, deg * 0.42));
}

type WaveFrame = { phase: number; t: number };

export default function ResonanceLine({
  progress,
  dateReadout,
  monoClassName,
  className = "",
}: ResonanceLineProps) {
  const uid = useId().replace(/:/g, "");
  const glowId = `rg-${uid}`;
  const bloomId = `rb-${uid}`;
  const particleId = `rp-${uid}`;
  const gradId = `lg-${uid}`;
  const reduceMotion = useReducedMotion();
  const progressRef = useRef(progress);
  const [waveFrame, setWaveFrame] = useState<WaveFrame>({ phase: 0, t: 0 });
  const complete = progress >= 0.998;

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (reduceMotion || progress >= 0.998) return;
    let id = 0;
    const loop = () => {
      setWaveFrame(({ phase }) => ({
        phase: phase + 0.021 * (0.42 + progressRef.current),
        t: performance.now() / 1000,
      }));
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [reduceMotion, progress]);

  const { wavePath, strokeBreath, textAdherePx, tiltDeg } = useMemo(() => {
    const ph = waveFrame.phase;
    const t = waveFrame.t;
    const strokeW = reduceMotion ? 0.6 : 0.6 + 0.2 * Math.sin((t * 2 * Math.PI) / BREATH_PERIOD_SEC);

    if (complete) {
      return { wavePath: "", strokeBreath: 0.6, textAdherePx: 0, tiltDeg: 0 };
    }
    if (reduceMotion) {
      return {
        wavePath: straightPath(),
        strokeBreath: strokeW,
        textAdherePx: 0,
        tiltDeg: 0,
      };
    }

    const path = buildSmoothWavePath(progress, ph);
    const cy = sampleWaveY(VB_W / 2, progress, ph);
    const delta = (cy - MID) / VB_H;
    return {
      wavePath: path,
      strokeBreath: strokeW,
      textAdherePx: delta * 22,
      tiltDeg: waveTiltDegAtCenter(progress, ph),
    };
  }, [waveFrame, complete, reduceMotion, progress]);

  const statusLabel = useMemo(() => {
    if (complete) return "[ RESONANCE_COHERENT ]";
    return "[ RESONANCE_SYNCING... ]";
  }, [complete]);

  const textEase = reduceMotion ? undefined : ("transform 95ms ease-out" as const);

  return (
    <div className={`w-full select-none ${className}`}>
      <div className="relative w-full">
        <p
          className={`${monoClassName} pointer-events-none mb-0.5 text-center text-[10px] leading-tight tracking-[0.2em] text-zinc-400`}
          style={{
            transform: `translateY(${(-textAdherePx * 1.05).toFixed(2)}px) rotate(${tiltDeg.toFixed(2)}deg)`,
            transition: textEase,
            transformOrigin: "center center",
          }}
          aria-hidden="true"
        >
          {statusLabel}
        </p>

        <div className="relative -my-1" aria-hidden="true">
          <svg
            className="block h-11 w-full"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="none"
            role="presentation"
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1={MID} x2={VB_W} y2={MID} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0} />
                <stop offset="38%" stopColor={GOLD} stopOpacity={0.45} />
                <stop offset="50%" stopColor={GOLD_HOT} stopOpacity={1} />
                <stop offset="62%" stopColor={GOLD} stopOpacity={0.45} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
              <filter id={bloomId} x="-80%" y="-200%" width="260%" height="500%">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0.12  0 1 0 0 0.08  0 0 0.85 0 0  0 0 0 0.55 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                </feMerge>
              </filter>
              <filter id={glowId} x="-40%" y="-150%" width="180%" height="400%">
                <feGaussianBlur stdDeviation="0.85" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id={particleId} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="1.8" result="g" />
                <feMerge>
                  <feMergeNode in="g" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {!complete && (
              <>
                <path
                  d={wavePath}
                  fill="none"
                  stroke={GOLD_HOT}
                  strokeOpacity={0.14}
                  strokeWidth={Math.max(1.2, strokeBreath * 5)}
                  vectorEffect="non-scaling-stroke"
                  filter={`url(#${bloomId})`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={wavePath}
                  fill="none"
                  stroke={`url(#${gradId})`}
                  strokeWidth={strokeBreath}
                  vectorEffect="non-scaling-stroke"
                  filter={reduceMotion ? undefined : `url(#${glowId})`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {complete && (
              <rect
                x={VB_W / 2 - 1}
                y={MID - 1}
                width={2}
                height={2}
                fill="#fff6d4"
                filter={`url(#${particleId})`}
                opacity={0.98}
              />
            )}
          </svg>
        </div>

        <p
          className={`${monoClassName} pointer-events-none mt-0.5 text-center text-[10px] leading-tight tracking-[0.12em] text-zinc-400`}
          style={{
            transform: `translateY(${(textAdherePx * 0.95).toFixed(2)}px) rotate(${tiltDeg.toFixed(2)}deg)`,
            transition: textEase,
            transformOrigin: "center center",
          }}
        >
          {dateReadout}
        </p>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        表单同步进度约 {Math.round(clamp01(progress) * 100)}%。
        {complete ? "共振已对齐，可解开。" : "继续填写出生信息与地点。"}
      </span>
    </div>
  );
}
