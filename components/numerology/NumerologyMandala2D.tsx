"use client";

import { useId } from "react";

/** 尖顶正六边形：顶点朝上，与外壳 clip-path 同向 */
function hexPoints(cx: number, cy: number, R: number): string {
  return Array.from({ length: 6 }, (_, k) => {
    const a = -Math.PI / 2 + (k * Math.PI) / 3;
    return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`;
  }).join(" ");
}

function hexVertex(cx: number, cy: number, R: number, k: number): { x: number; y: number } {
  const a = -Math.PI / 2 + (k * Math.PI) / 3;
  return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
}

/** 左上偏外光源（屏幕 y 向下） */
const LX = -0.58;
const LY = -0.62;

type V = { x: number; y: number };

function sideFaceLit(Tk: V, Tk1: V, Bk: V, Bk1: V, cx: number, cy: number): number {
  const mx = (Tk.x + Tk1.x + Bk.x + Bk1.x) / 4 - cx;
  const my = (Tk.y + Tk1.y + Bk.y + Bk1.y) / 4 - cy;
  const d = Math.hypot(mx, my) || 1;
  const dot = (mx / d) * LX + (my / d) * LY;
  return (dot + 1) / 2;
}

/** 从正上方扇区起顺时针六格，与「个人星图」六卡顺序一致：主路径、生日数、个人年、表现、灵魂、人格 */
export type NumerologyMandalaWedgeLabels = readonly [string, string, string, string, string, string];

/** 顶面分块 + 挤出侧壁 + 底面，形成可读 3D 棱柱感 */
export function NumerologyMandala2D({
  lifePath,
  stroke,
  accentRgb = "168, 188, 208",
  className = "",
  wedgeLabels,
}: {
  lifePath: number;
  stroke: string;
  accentRgb?: string;
  className?: string;
  /** 有则画入六扇区；寰宇之门由外层叠主路径大字，可不传 */
  wedgeLabels?: NumerologyMandalaWedgeLabels;
}) {
  void lifePath;
  const rid = useId().replace(/:/g, "");
  const clipId = `mandala-hex-clip-${rid}`;
  const spotId = `mandala-hex-spot-${rid}`;
  const botGradId = `mandala-hex-bot-${rid}`;
  const aoId = `mandala-hex-ao-${rid}`;

  const cx = 100;
  const cy = 100;
  const RTop = 97.5;
  const RBot = 84.5;
  const ex = 5.8;
  const ey = 7.8;

  const metal = `rgba(${accentRgb},0.78)`;
  const metalDim = `rgba(${accentRgb},0.32)`;

  const clipPts = hexPoints(cx, cy, 100);
  const spokeTo = 81;

  const topVerts = Array.from({ length: 6 }, (_, k) => hexVertex(cx, cy, RTop, k));
  const botVerts = Array.from({ length: 6 }, (_, k) => {
    const v = hexVertex(cx, cy, RBot, k);
    return { x: v.x + ex, y: v.y + ey };
  });

  const topFacets = Array.from({ length: 6 }, (_, k) => {
    const v0 = topVerts[k]!;
    const v1 = topVerts[(k + 1) % 6]!;
    const mx = (v0.x + v1.x) / 2;
    const my = (v0.y + v1.y) / 2;
    const dist = Math.hypot(mx - cx, my - cy) || 1;
    const ux = (mx - cx) / dist;
    const uy = (my - cy) / dist;
    const dot = Math.max(-1, Math.min(1, ux * LX + uy * LY));
    const lit = (dot + 1) / 2;
    const hi = 0.1 + lit * 0.9;
    const centerStop =
      lit > 0.48
        ? `rgba(242,248,255,${(0.2 + hi * 0.22).toFixed(3)})`
        : `rgba(${accentRgb},${(0.06 + hi * 0.1).toFixed(3)})`;
    const edgeStop =
      lit > 0.48
        ? `rgba(18,24,36,${(0.58 + (1 - hi) * 0.28).toFixed(3)})`
        : `rgba(1,2,5,${(0.9 + (1 - hi) * 0.08).toFixed(3)})`;
    const gid = `mandala-hex-top-${rid}-${k}`;
    const pts = `${cx},${cy} ${v0.x},${v0.y} ${v1.x},${v1.y}`;
    return { gid, pts, mx, my, centerStop, edgeStop };
  });

  const botCx = cx + ex;
  const botCy = cy + ey;

  return (
    <svg
      className={`numerology-mandala-svg pointer-events-none ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
      shapeRendering="geometricPrecision"
      style={{ overflow: "hidden" }}
    >
      <defs>
        <clipPath id={clipId}>
          <polygon points={clipPts} />
        </clipPath>
        <radialGradient id={botGradId} cx={botCx} cy={botCy} r="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgb(14,16,24)" />
          <stop offset="58%" stopColor="rgb(5,6,11)" />
          <stop offset="100%" stopColor="rgb(1,2,4)" />
        </radialGradient>
        <radialGradient id={aoId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.22)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        {topFacets.map((s) => (
          <linearGradient key={s.gid} id={s.gid} gradientUnits="userSpaceOnUse" x1={cx} y1={cy} x2={s.mx} y2={s.my}>
            <stop offset="0%" stopColor={s.centerStop} />
            <stop offset="48%" stopColor={`rgba(${accentRgb},0.06)`} />
            <stop offset="100%" stopColor={s.edgeStop} />
          </linearGradient>
        ))}
        {Array.from({ length: 6 }, (_, k) => {
          const Tk = topVerts[k]!;
          const Tk1 = topVerts[(k + 1) % 6]!;
          const Bk = botVerts[k]!;
          const Bk1 = botVerts[(k + 1) % 6]!;
          const mx = (Tk.x + Tk1.x + Bk.x + Bk1.x) / 4;
          const my = (Tk.y + Tk1.y + Bk.y + Bk1.y) / 4;
          const gx = (Tk.x + Tk1.x) / 2;
          const gy = (Tk.y + Tk1.y) / 2;
          const sid = `mandala-hex-side-${rid}-${k}`;
          const sl = sideFaceLit(Tk, Tk1, Bk, Bk1, cx, cy);
          const topR = Math.round(42 + sl * 38);
          const topG = Math.round(50 + sl * 32);
          const topB = Math.round(64 + sl * 28);
          const topA = 0.42 + sl * 0.28;
          const midA = 0.88 - sl * 0.12;
          return (
            <linearGradient key={sid} id={sid} gradientUnits="userSpaceOnUse" x1={gx} y1={gy} x2={mx} y2={my}>
              <stop offset="0%" stopColor={`rgba(${topR},${topG},${topB},${topA.toFixed(3)})`} />
              <stop offset="50%" stopColor={`rgba(12,14,20,${midA.toFixed(3)})`} />
              <stop offset="100%" stopColor="rgba(1,2,4,0.98)" />
            </linearGradient>
          );
        })}
        <radialGradient id={spotId} cx="38%" cy="32%" r="48%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.24)" />
          <stop offset="42%" stopColor={`rgba(${accentRgb},0.1)`} />
          <stop offset="100%" stopColor="rgba(6,8,12,0)" />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <polygon points={botVerts.map((p) => `${p.x},${p.y}`).join(" ")} fill={`url(#${botGradId})`} stroke="none" />

        {Array.from({ length: 6 }, (_, k) => {
          const Tk = topVerts[k]!;
          const Tk1 = topVerts[(k + 1) % 6]!;
          const Bk1 = botVerts[(k + 1) % 6]!;
          const Bk = botVerts[k]!;
          const pts = `${Tk.x},${Tk.y} ${Tk1.x},${Tk1.y} ${Bk1.x},${Bk1.y} ${Bk.x},${Bk.y}`;
          return <polygon key={`side-${k}`} points={pts} fill={`url(#mandala-hex-side-${rid}-${k})`} stroke="none" />;
        })}

        {topFacets.map((s, k) => (
          <polygon key={`topf-${k}`} points={s.pts} fill={`url(#${s.gid})`} stroke="none" />
        ))}

        <circle cx={cx} cy={cy} r="30" fill={`url(#${aoId})`} />

        <circle cx={cx} cy={cy} r="44" fill={`url(#${spotId})`} />

        {Array.from({ length: 6 }, (_, k) => {
          const a = -Math.PI / 2 + (k * Math.PI) / 3;
          const x2 = cx + Math.cos(a) * spokeTo;
          const y2 = cy + Math.sin(a) * spokeTo;
          return (
            <line
              key={`spoke-${k}`}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke="rgba(6,8,12,0.72)"
              strokeWidth={1.05}
              strokeLinecap="round"
            />
          );
        })}

        {wedgeLabels
          ? wedgeLabels.map((label, k) => {
              const a = -Math.PI / 2 + (k + 0.5) * (Math.PI / 3);
              const r = 59;
              const tx = cx + Math.cos(a) * r;
              const ty = cy + Math.sin(a) * r;
              const fs = label === "—" ? 13 : label.length >= 2 ? 11.5 : 14.5;
              return (
                <text
                  key={`wedge-lbl-${k}`}
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="rgba(248,250,252,0.9)"
                  fontSize={fs}
                  fontWeight={600}
                  fontFamily='ui-sans-serif, system-ui, "Segoe UI", sans-serif'
                  className="tabular-nums"
                  style={{ paintOrder: "stroke fill", stroke: "rgba(2,4,10,0.55)", strokeWidth: 2.5 }}
                >
                  {label}
                </text>
              );
            })
          : null}

        <polygon
          points={hexPoints(cx, cy, RTop - 1.5)}
          fill="none"
          stroke="rgba(248,250,252,0.1)"
          strokeWidth={0.65}
          strokeLinejoin="round"
        />

        <polygon
          points={hexPoints(cx, cy, 94)}
          fill="none"
          stroke={stroke}
          strokeWidth={1.75}
          strokeLinejoin="round"
          opacity={0.95}
        />
        <polygon
          points={hexPoints(cx, cy, 94)}
          fill="none"
          stroke={metal}
          strokeWidth={1.25}
          strokeLinejoin="round"
          opacity={0.55}
        />
        <polygon
          points={hexPoints(cx, cy, 91)}
          fill="none"
          stroke={metalDim}
          strokeWidth={2.2}
          strokeLinejoin="round"
          opacity={0.75}
        />
        <polygon
          points={hexPoints(cx, cy, 91)}
          fill="none"
          stroke="rgba(248,250,252,0.2)"
          strokeWidth={0.6}
          strokeLinejoin="round"
          opacity={0.92}
        />
      </g>
    </svg>
  );
}
