"use client";

import { useId } from "react";

/** 坛城：theme.stroke + accent 金属环与轨道；主刻度单层金属；活跃节点用 hiBall 径向填充，无光晕模糊 */

export function NumerologyMandala2D({
  lifePath,
  stroke,
  accentRgb = "168, 188, 208",
  className = "",
}: {
  lifePath: number;
  stroke: string;
  accentRgb?: string;
  className?: string;
}) {
  const rid = useId().replace(/:/g, "");
  const radialId = `mandala-rad-${rid}`;
  const rimId = `mandala-rim-${rid}`;
  const vignetteId = `mandala-vig-${rid}`;
  const hiBallId = `hiBall-${rid}`;

  const ticks = 12;
  const minorPerSector = 3;
  const innerR = 38 + (lifePath % 5) * 4;
  const highlightIndex = (((Math.min(lifePath, 33) - 1) % 9) + 9) % 9;
  const orbitR = 70;
  const cx = 100;
  const cy = 100;

  const aHi = (highlightIndex / 9) * Math.PI * 2 - Math.PI / 2;
  const highlightPos = { x: cx + Math.cos(aHi) * orbitR, y: cy + Math.sin(aHi) * orbitR };

  const metal = `rgba(${accentRgb},0.78)`;
  const metalMid = `rgba(${accentRgb},0.5)`;
  const metalDim = `rgba(${accentRgb},0.32)`;

  return (
    <svg
      className={`numerology-mandala-svg pointer-events-none ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id={radialId} cx="50%" cy="50%" r="68%">
          <stop offset="0%" stopColor={`rgb(${accentRgb})`} stopOpacity={0.38} />
          <stop offset="42%" stopColor={`rgb(${accentRgb})`} stopOpacity={0.09} />
          <stop offset="100%" stopColor="rgb(8,11,16)" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={rimId} cx="50%" cy="50%" r="96%">
          <stop offset="72%" stopColor={`rgb(${accentRgb})`} stopOpacity={0} />
          <stop offset="88%" stopColor={`rgb(${accentRgb})`} stopOpacity={0.14} />
          <stop offset="100%" stopColor={`rgb(${accentRgb})`} stopOpacity={0.22} />
        </radialGradient>
        <radialGradient id={vignetteId} cx="50%" cy="50%" r="54%">
          <stop offset="0%" stopColor="rgb(5,8,12)" stopOpacity={0.55} />
          <stop offset="48%" stopColor="rgb(7,10,15)" stopOpacity={0.22} />
          <stop offset="100%" stopColor="rgb(7,10,15)" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={hiBallId} cx="35%" cy="30%" r="62%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.98} />
          <stop offset="38%" stopColor="#f8fafc" stopOpacity={0.92} />
          <stop offset="72%" stopColor={`rgb(${accentRgb})`} stopOpacity={0.88} />
          <stop offset="100%" stopColor={`rgb(${accentRgb})`} stopOpacity={0.62} />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r="99" fill={`url(#${radialId})`} />
      <circle cx={cx} cy={cy} r="99" fill={`url(#${rimId})`} />
      <circle cx={cx} cy={cy} r="56" fill={`url(#${vignetteId})`} />

      <circle cx={cx} cy={cy} r="50" fill="rgba(241,245,249,0.035)" stroke={metalDim} strokeWidth={0.85} opacity={0.9} />

      <circle cx={cx} cy={cy} r="94" stroke={stroke} strokeWidth={1.75} opacity={0.95} />
      <circle cx={cx} cy={cy} r="94" stroke={metal} strokeWidth={1.25} opacity={0.55} />
      <circle cx={cx} cy={cy} r="91" stroke={metalDim} strokeWidth={2.2} opacity={0.75} />

      <circle cx={cx} cy={cy} r={orbitR + 7} stroke={metalDim} strokeWidth={1} opacity={0.45} />

      <g className="numerology-mandala-orbit-spin">
        <circle
          cx={cx}
          cy={cy}
          r="79"
          stroke={stroke}
          strokeWidth={1.2}
          strokeDasharray="4 7"
          opacity={0.72}
        />
        <circle cx={cx} cy={cy} r="79" stroke={metalMid} strokeWidth={0.65} strokeDasharray="4 7" opacity={0.4} />
      </g>

      <circle cx={cx} cy={cy} r={orbitR} stroke={metalMid} strokeWidth={1.15} opacity={0.62} />

      <circle cx={cx} cy={cy} r={innerR} stroke={metal} strokeWidth={1.35} opacity={0.58} />
      <circle cx={cx} cy={cy} r={innerR} stroke={stroke} strokeWidth={0.85} opacity={0.85} />

      {Array.from({ length: ticks * minorPerSector }).map((_, i) => {
        if (i % minorPerSector === 0) return null;
        const a = (i / (ticks * minorPerSector)) * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + Math.cos(a) * 88;
        const y1 = cy + Math.sin(a) * 88;
        const x2 = cx + Math.cos(a) * 96;
        const y2 = cy + Math.sin(a) * 96;
        return (
          <line
            key={`m-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={metal}
            strokeWidth={0.9}
            opacity={0.48}
            strokeLinecap="round"
          />
        );
      })}

      {Array.from({ length: ticks }).map((_, i) => {
        const a = (i / ticks) * Math.PI * 2 - Math.PI / 2;
        const cardinal = i % 3 === 0;
        const inner = cardinal ? 80 : 85;
        const outer = cardinal ? 101 : 99;
        const x1 = cx + Math.cos(a) * inner;
        const y1 = cy + Math.sin(a) * inner;
        const x2 = cx + Math.cos(a) * outer;
        const y2 = cy + Math.sin(a) * outer;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={cardinal ? metal : metalMid}
            strokeWidth={cardinal ? 1.65 : 1.2}
            opacity={cardinal ? 0.88 : 0.72}
            strokeLinecap="round"
          />
        );
      })}

      <line
        x1={cx}
        y1={cy}
        x2={highlightPos.x}
        y2={highlightPos.y}
        stroke={metal}
        strokeWidth={0.95}
        opacity={0.42}
        strokeLinecap="round"
      />

      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * orbitR;
        const y = cy + Math.sin(a) * orbitR;
        const on = i === highlightIndex;
        if (on) {
          return (
            <g key={`n-${i}`} className="numerology-mandala-active">
              <circle cx={x} cy={y} r={10.5} fill="none" stroke={metal} strokeWidth={1.1} opacity={0.55} />
              <circle cx={x} cy={y} r={8.1} fill="none" stroke={`rgba(${accentRgb},0.42)`} strokeWidth={0.9} opacity={0.95} />
              <circle cx={x} cy={y} r={6.35} fill={`url(#${hiBallId})`} />
              <circle cx={x} cy={y} r={2.65} fill="#ffffff" opacity={0.98} />
            </g>
          );
        }
        return (
          <g key={`n-${i}`}>
            <circle cx={x} cy={y} r={3.75} fill="none" stroke={metalDim} strokeWidth={0.75} opacity={0.9} />
            <circle cx={x} cy={y} r={2.9} fill={metalMid} opacity={0.88} />
            <circle cx={x} cy={y} r={1.05} fill="rgba(248,250,252,0.4)" />
          </g>
        );
      })}
    </svg>
  );
}
