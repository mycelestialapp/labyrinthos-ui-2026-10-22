"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import type { AstroChartWheelData, AspectType, PlanetId } from "@/lib/astro-chart-wheel";
import { PLANET_GLYPH } from "@/lib/astro-chart-wheel";
import { ZODIAC_CN, ZODIAC_KEYS } from "@/lib/natal-chart";

/** 与 ZODIAC_KEYS 顺序一致：外圈星座符标 */
const ZODIAC_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"] as const;

/** 与 ZODIAC_KEYS 同序：白羊起依次为 火土风水 循环 */
type ZodiacElementId = "fire" | "earth" | "air" | "water";
const ZODIAC_ELEMENT: ZodiacElementId[] = [
  "fire",
  "earth",
  "air",
  "water",
  "fire",
  "earth",
  "air",
  "water",
  "fire",
  "earth",
  "air",
  "water",
];
const ELEMENT_ZH: Record<ZodiacElementId, string> = {
  fire: "火象",
  earth: "土象",
  air: "风象",
  water: "水象",
};
/** 黄道中文四字：按四象分色，避免「一半亮一半灰」像失效态 */
const ZODIAC_NAME_FILL: Record<ZodiacElementId, string> = {
  fire: "rgba(245, 210, 160, 0.95)",
  earth: "rgba(210, 198, 168, 0.93)",
  air: "rgba(165, 228, 245, 0.92)",
  water: "rgba(195, 205, 252, 0.93)",
};
const ZOD_BADGE_STROKE_ELEMENT: Record<ZodiacElementId, string> = {
  fire: "rgba(230, 150, 95, 0.58)",
  earth: "rgba(200, 175, 120, 0.52)",
  air: "rgba(110, 195, 225, 0.55)",
  water: "rgba(140, 155, 230, 0.55)",
};

/** Atelier 星盘 — 克制金轴 + 靛紫星座标 + 可切换密刻度 */
const GOLD = "#C9A76C";
const GOLD_SOFT = "rgba(201, 167, 108, 0.42)";
const COOL_GRAY = "rgba(68, 72, 82, 0.55)";
const HOUSE_LINE = "rgba(88, 98, 118, 0.38)";
const HOUSE_LINE_ANGLE = "rgba(201, 167, 108, 0.36)";
const ZOD_BADGE_GLYPH = "rgba(235, 228, 255, 0.9)";
const LINE = 0.28;
const ASPECT_BASE = "rgba(72, 76, 86, 0.38)";
const R_CENTER_HOLE = 3.15;

function aspectLinePaint(
  t: AspectType,
  involved: boolean,
  dimOthers: boolean,
): { stroke: string; opacity: number } {
  if (involved) return { stroke: GOLD, opacity: 0.92 };
  if (dimOthers) return { stroke: ASPECT_BASE, opacity: 0.07 };
  switch (t) {
    case "square":
    case "opposition":
      return { stroke: "rgba(200, 110, 110, 0.5)", opacity: 0.36 };
    case "trine":
    case "sextile":
      return { stroke: "rgba(88, 152, 198, 0.5)", opacity: 0.34 };
    default:
      return { stroke: "rgba(140, 135, 125, 0.45)", opacity: 0.32 };
  }
}

/** 缩放后仍尽量保持发丝线清晰（viewBox 放大时线宽不糊） */
const LINE_SHARP = {
  vectorEffect: "nonScalingStroke" as const,
  shapeRendering: "crispEdges" as const,
};
const RING_SHARP = { vectorEffect: "nonScalingStroke" as const };

const GLYPH_FONT =
  "Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, STIX Two Math, sans-serif";

/** 宫位数字略偏经典衬线，与中文黄道名气质接近 */
const HOUSE_NUM_FONT =
  "Palatino Linotype, Book Antiqua, Palatino, Georgia, Noto Serif SC, serif";

/** 尖角朝外的正六边形路径（中心为原点） */
function hexPathPointyTop(R: number): string {
  let d = "";
  for (let k = 0; k < 6; k++) {
    const a = ((-90 + k * 60) * Math.PI) / 180;
    const x = R * Math.cos(a);
    const y = R * Math.sin(a);
    d += k === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return `${d} Z`;
}

function houseSystemLabelZh(v: string): string {
  if (v === "Placidus") return "普拉西德";
  if (v === "Whole Sign") return "整宫制";
  return v;
}

const DEG2RAD = Math.PI / 180;
const CX = 50;
const CY = 50;
const VB_X = -16;
const VB_Y = -16;
const VB_W = 132;
const VB_H = 132;

type Props = {
  highlightSkeleton?: boolean;
  className?: string;
  monoClassName?: string;
  showAspectLines?: boolean;
  showOuterBodies?: boolean;
  showRadials?: boolean;
  /** minimal：仅 30°/5° 外刻度；full：每度密刻度（仪器模式） */
  tickDensity?: "minimal" | "full";
  chartData?: AstroChartWheelData | null;
};

function normDeg(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

/** 两黄道经度间最短夹角（0–180） */
function angleSepDeg(a: number, b: number): number {
  let d = Math.abs(normDeg(a) - normDeg(b));
  if (d > 180) d = 360 - d;
  return d;
}

function pointFromLon(lonDeg: number, r: number) {
  const a = (lonDeg - 90) * DEG2RAD;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

/** 沿圆周切向偏移（单位：viewBox），减轻与同角度射线上的其它字重叠 */
function pointFromLonTangent(lonDeg: number, r: number, tangentPx: number) {
  const a = (lonDeg - 90) * DEG2RAD;
  const x = CX + r * Math.cos(a);
  const y = CY + r * Math.sin(a);
  return {
    x: x - Math.sin(a) * tangentPx,
    y: y + Math.cos(a) * tangentPx,
  };
}

const ZODIAC_MID_LONS = ZODIAC_KEYS.map((_, i) => i * 30 + 15);

/** 轴点字若与某星座中点过近，则略旋开 + 外移，避免与「巨蟹」等黄道字叠在一起 */
function axisLabelAdjustedPoint(lonDeg: number, r: number): { x: number; y: number } {
  const lon = normDeg(lonDeg);
  let minToMid = 999;
  for (const m of ZODIAC_MID_LONS) minToMid = Math.min(minToMid, angleSepDeg(lon, m));
  if (minToMid >= 10) return pointFromLon(lon, r);
  const plus = normDeg(lon + 10);
  const minus = normDeg(lon - 10);
  let dP = 999;
  let dM = 999;
  for (const m of ZODIAC_MID_LONS) {
    dP = Math.min(dP, angleSepDeg(plus, m));
    dM = Math.min(dM, angleSepDeg(minus, m));
  }
  const useLon = dP >= dM ? plus : minus;
  return pointFromLonTangent(useLon, r + 2.35, 0);
}

/** 黄道字若与轴点或宫头过近，沿切向挪开一点（用圆上周向差，避免 350°/10° 误判） */
function zodiacLabelAdjustedPoint(midLonDeg: number, r: number, obstacles: number[]): { x: number; y: number } {
  let tangent = 0;
  let rad = r;
  for (const ob of obstacles) {
    const d = angleSepDeg(midLonDeg, ob);
    if (d < 9) {
      const delta = normDeg(midLonDeg - ob);
      tangent += delta < 180 ? -2.1 : 2.1;
      rad = Math.min(rad, r - 1.2);
    }
  }
  tangent = Math.max(-4.3, Math.min(4.3, tangent));
  return pointFromLonTangent(midLonDeg, rad, tangent);
}

type PlanetLite = { id: PlanetId; lonDeg: number };

/** 经度过近的行星：半径阶梯 + 小角度摊开，避免金星月亮等叠字 */
function spreadPlanetLayout(planets: PlanetLite[], baseR: number): Map<PlanetId, { r: number; lonOff: number }> {
  const out = new Map<PlanetId, { r: number; lonOff: number }>();
  if (planets.length === 0) return out;
  const n = planets.length;
  const parent = planets.map((_, i) => i);
  const find = (i: number): number => {
    if (parent[i] !== i) parent[i] = find(parent[i]!);
    return parent[i]!;
  };
  const uni = (a: number, b: number) => {
    const pa = find(a);
    const pb = find(b);
    if (pa !== pb) parent[pa] = pb;
  };
  const idxs = planets.map((_, i) => i).sort((ia, ib) => normDeg(planets[ia]!.lonDeg) - normDeg(planets[ib]!.lonDeg));
  for (let k = 0; k < n - 1; k++) {
    const ia = idxs[k]!;
    const ib = idxs[k + 1]!;
    if (angleSepDeg(planets[ia]!.lonDeg, planets[ib]!.lonDeg) < 6.8) uni(ia, ib);
  }
  if (n > 1) {
    const i0 = idxs[0]!;
    const iL = idxs[n - 1]!;
    const lo = normDeg(planets[i0]!.lonDeg);
    const hi = normDeg(planets[iL]!.lonDeg);
    const wrapGap = normDeg(lo + 360 - hi);
    if (wrapGap < 6.8) uni(i0, iL);
  }
  const groups = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    const r = find(i);
    const g = groups.get(r) ?? [];
    g.push(i);
    groups.set(r, g);
  }
  for (let i = 0; i < n; i++) {
    out.set(planets[i]!.id, { r: baseR, lonOff: 0 });
  }
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    const sorted = [...g].sort((ia, ib) => normDeg(planets[ia]!.lonDeg) - normDeg(planets[ib]!.lonDeg));
    const m = sorted.length;
    sorted.forEach((pi, k) => {
      const id = planets[pi]!.id;
      out.set(id, {
        r: baseR - k * 2.05,
        lonOff: (k - (m - 1) / 2) * 3.4,
      });
    });
  }
  return out;
}

/** 宫位数字与黄道两字过近时略向内收，减少与摩羯等叠线 */
function houseNumberPoint(lonDeg: number, baseR: number): { x: number; y: number } {
  const lon = normDeg(lonDeg);
  for (const m of ZODIAC_MID_LONS) {
    if (angleSepDeg(lon, m) < 7.5) return pointFromLon(lon, baseR - 2.4);
  }
  return pointFromLon(lon, baseR);
}

function formatLon(lonDeg: number) {
  return `${normDeg(lonDeg).toFixed(2)}°`;
}

function aspectStrokeDash(t: AspectType): string | undefined {
  switch (t) {
    case "conjunction":
      return undefined;
    case "sextile":
      return "1.1 2";
    case "square":
      return "0.45 0.75";
    case "trine":
      return "2.8 1.4";
    case "opposition":
      return "4 2.2";
    default:
      return undefined;
  }
}

function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
  const rect = svg.getBoundingClientRect();
  return {
    x: VB_X + ((clientX - rect.left) / rect.width) * VB_W,
    y: VB_Y + ((clientY - rect.top) / rect.height) * VB_H,
  };
}

/**
 * 精密星历刻度图（Atelier）：深空底、外圈星座符标、金轴留心、相位微分色、默认疏刻度；数据仍全由 chartData 驱动。
 */
export default function ChartWheelPlaceholder({
  highlightSkeleton = true,
  className = "",
  monoClassName = "",
  showAspectLines = true,
  showOuterBodies = false,
  showRadials = true,
  tickDensity = "minimal",
  chartData = null,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPlanetId, setHoveredPlanetId] = useState<PlanetId | null>(null);

  const R_OUT = 47.4;
  const R_RING_IN = 46.35;
  const R_Z_OUT = 45.85;
  const R_Z_IN = 40.1;
  const R_Z_LABEL = 42.85;
  const R_CHRONO_OUT = 49.35;
  const R_CHRONO_IN_MAJOR = 47.95;
  const R_CHRONO_IN_MID = 48.55;
  const R_CHRONO_IN_MICRO = 48.92;
  const R_HOUSE_OUT = 38.5;
  const R_HOUSE_IN = 16.2;
  const R_AXIS = 38.2;
  const R_HOUSE_NUM = 39.65;
  const R_AXIS_LBL = 44.6;
  const R_ASPECT = 31.8;
  const R_GLYPH = 30.2;
  const HOVER_R = 4.6;
  /** 内圈黄道中文略收进，把视觉焦点让给外圈符标 */
  const R_Z_CN = 41.75;

  const planetById = new Map((chartData?.planets ?? []).map((p) => [p.id, p] as const));

  const visiblePlanets = useMemo(() => {
    if (!chartData) return [];
    return chartData.planets.filter((p) => {
      if (showOuterBodies) return true;
      return p.id !== "uranus" && p.id !== "neptune" && p.id !== "pluto";
    });
  }, [chartData, showOuterBodies]);

  const planetLayout = useMemo(
    () => spreadPlanetLayout(visiblePlanets.map((p) => ({ id: p.id, lonDeg: p.lonDeg })), R_GLYPH),
    [visiblePlanets],
  );

  /** 黄道两字与轴点/宫头过近时切向错开，减轻叠字 */
  const zodiacTextLayout = useMemo(() => {
    const obstacles: number[] = [];
    if (chartData) {
      obstacles.push(
        normDeg(chartData.ascLonDeg),
        normDeg(chartData.ascLonDeg + 180),
        normDeg(chartData.mcLonDeg),
        normDeg(chartData.mcLonDeg + 180),
        ...chartData.houseCuspsLonDeg.map((lon) => normDeg(lon)),
      );
    }
    return ZODIAC_KEYS.map((_, i) => {
      const midLon = i * 30 + 15;
      if (obstacles.length === 0) return pointFromLon(midLon, R_Z_CN);
      return zodiacLabelAdjustedPoint(midLon, R_Z_CN, obstacles);
    });
  }, [chartData]);

  const zodiacSegments = useMemo(() => {
    return ZODIAC_KEYS.map((key, i) => {
      const name = ZODIAC_CN[key];
      const a0 = (i * 30 - 90) * DEG2RAD;
      const a1 = ((i + 1) * 30 - 90) * DEG2RAD;
      const x0 = CX + R_Z_IN * Math.cos(a0);
      const y0 = CY + R_Z_IN * Math.sin(a0);
      const x1 = CX + R_Z_OUT * Math.cos(a0);
      const y1 = CY + R_Z_OUT * Math.sin(a0);
      const x2 = CX + R_Z_OUT * Math.cos(a1);
      const y2 = CY + R_Z_OUT * Math.sin(a1);
      const x3 = CX + R_Z_IN * Math.cos(a1);
      const y3 = CY + R_Z_IN * Math.sin(a1);
      const mid = ((i + 0.5) * 30 - 90) * DEG2RAD;
      return {
        name,
        i,
        d: `M ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`,
        tx: CX + R_Z_LABEL * Math.cos(mid),
        ty: CY + R_Z_LABEL * Math.sin(mid),
      };
    });
  }, []);

  const chronographTicks = useMemo(() => {
    const ticks: {
      deg: number;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      gold: boolean;
      micro: boolean;
    }[] = [];
    const step = tickDensity === "full" ? 1 : 5;
    for (let deg = 0; deg < 360; deg += step) {
      const angle = (deg - 90) * DEG2RAD;
      const isMajor = deg % 30 === 0;
      const isMid = deg % 5 === 0 && !isMajor;
      if (tickDensity === "minimal" && !isMajor && !isMid) continue;
      const rIn = isMajor ? R_CHRONO_IN_MAJOR : isMid ? R_CHRONO_IN_MID : R_CHRONO_IN_MICRO;
      const x1 = CX + rIn * Math.cos(angle);
      const y1 = CY + rIn * Math.sin(angle);
      const x2 = CX + R_CHRONO_OUT * Math.cos(angle);
      const y2 = CY + R_CHRONO_OUT * Math.sin(angle);
      ticks.push({
        deg,
        x1,
        y1,
        x2,
        y2,
        gold: isMajor || (tickDensity === "full" && !isMid && deg % 2 === 0),
        micro: tickDensity === "full" && !isMajor && !isMid,
      });
    }
    return ticks;
  }, [tickDensity]);

  const radials12 = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const deg = i * 30;
      const angle = (deg - 90) * DEG2RAD;
      return {
        deg,
        gold: i % 2 === 0,
        x1: CX + R_HOUSE_IN * Math.cos(angle),
        y1: CY + R_HOUSE_IN * Math.sin(angle),
        x2: CX + (R_Z_IN - 0.45) * Math.cos(angle),
        y2: CY + (R_Z_IN - 0.45) * Math.sin(angle),
      };
    });
  }, []);

  const zodiacOuterBadges = useMemo(
    () =>
      ZODIAC_KEYS.map((_, i) => {
        const midLon = i * 30 + 15;
        const r = R_CHRONO_OUT - 0.42;
        const p = pointFromLon(midLon, r);
        return {
          i,
          sym: ZODIAC_SYMBOLS[i]!,
          x: p.x,
          y: p.y,
          rot: 90 - midLon,
        };
      }),
    [R_CHRONO_OUT],
  );

  const pickHoverPlanet = useCallback(
    (clientX: number, clientY: number) => {
      const el = svgRef.current;
      if (!el || visiblePlanets.length === 0) {
        setHoveredPlanetId(null);
        return;
      }
      const { x: mx, y: my } = clientToSvg(el, clientX, clientY);
      let best: PlanetId | null = null;
      let bestD = HOVER_R;
      for (const p of visiblePlanets) {
        const lay = planetLayout.get(p.id);
        const r = lay?.r ?? R_GLYPH;
        const off = lay?.lonOff ?? 0;
        const pt = pointFromLon(normDeg(p.lonDeg + off), r);
        const d = Math.hypot(mx - pt.x, my - pt.y);
        if (d < bestD) {
          bestD = d;
          best = p.id;
        }
      }
      setHoveredPlanetId(best);
    },
    [visiblePlanets, planetLayout],
  );

  const onSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    pickHoverPlanet(e.clientX, e.clientY);
  };

  const onSvgPointerLeave = () => setHoveredPlanetId(null);

  const axisVisible = highlightSkeleton;
  const axisMuted = axisVisible ? 1 : 0.42;

  const vb = `${VB_X} ${VB_Y} ${VB_W} ${VB_H}`;

  /** 四轴标签统一一类色（不再天顶/上升金、天底/下降灰） */
  const axisLabelFill = "rgba(242, 228, 200, 0.96)";
  /** 角宫数字略强调；其余宫位为中性银蓝，与四象黄道字区分 */
  const houseNumAngleFill = "rgba(236, 212, 175, 0.94)";
  const houseNumPlainFill = "rgba(172, 186, 208, 0.9)";

  return (
    <svg
      ref={svgRef}
      viewBox={vb}
      preserveAspectRatio="xMidYMid meet"
      className={`aspect-square h-full w-full select-none ${monoClassName} ${className}`}
      style={{ overflow: "visible" }}
      aria-label={chartData ? "本命星盘图" : "星历示意"}
      textRendering="geometricPrecision"
      onPointerMove={onSvgPointerMove}
      onPointerLeave={onSvgPointerLeave}
    >
      <defs>
        <radialGradient id="chart-disk-base" cx="50%" cy="46%" r="72%">
          <stop offset="0%" stopColor="#141a38" stopOpacity="1" />
          <stop offset="52%" stopColor="#0c1228" stopOpacity="1" />
          <stop offset="100%" stopColor="#060a18" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="chart-rim-light" cx="50%" cy="-5%" r="78%">
          <stop offset="0%" stopColor="#e8d5a8" stopOpacity="0.14" />
          <stop offset="35%" stopColor="#c9a76c" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#080c22" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ephemeris-center-field" cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#C9A76C" stopOpacity="0.12" />
          <stop offset="36%" stopColor="#4a6a88" stopOpacity="0.07" />
          <stop offset="58%" stopColor="#6b5588" stopOpacity="0.08" />
          <stop offset="78%" stopColor="#080c1c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="zodiac-badge-face" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(110, 88, 145, 0.72)" />
          <stop offset="100%" stopColor="rgba(38, 30, 58, 0.88)" />
        </linearGradient>
        <radialGradient id="planet-aureole" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#fff6e8" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#c9a76c" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#080c1c" stopOpacity="0" />
        </radialGradient>
        <filter id="glyph-matte-gold" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.38" result="b" />
          <feFlood floodColor="#C9A76C" floodOpacity="0.26" result="f" />
          <feComposite in="f" in2="b" operator="in" result="g" />
          <feMerge>
            <feMergeNode in="g" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 盘面纵深 + 顶侧博物馆式微光 */}
      <circle cx={CX} cy={CY} r={R_CHRONO_OUT + 0.35} fill="url(#chart-disk-base)" stroke="none" />
      <circle cx={CX} cy={CY} r={R_CHRONO_OUT + 0.35} fill="url(#chart-rim-light)" stroke="none" />
      <circle cx={CX} cy={CY} r={R_CHRONO_OUT + 0.2} fill="url(#ephemeris-center-field)" stroke="none" />
      <circle
        cx={CX}
        cy={CY}
        r={R_CHRONO_OUT + 0.04}
        fill="none"
        stroke={GOLD}
        strokeWidth={0.34}
        strokeOpacity={0.52}
        {...RING_SHARP}
      />
      <circle
        cx={CX}
        cy={CY}
        r={R_OUT}
        fill="none"
        stroke={GOLD_SOFT}
        strokeWidth={LINE}
        strokeOpacity={0.48}
        {...RING_SHARP}
      />
      <circle
        cx={CX}
        cy={CY}
        r={R_RING_IN}
        fill="none"
        stroke={COOL_GRAY}
        strokeWidth={LINE}
        strokeOpacity={0.36}
        {...RING_SHARP}
      />

      {zodiacSegments.map((s) => (
        <path
          key={`zf-${s.name}`}
          d={s.d}
          fill={
            s.i % 2 === 0
              ? "rgba(255, 248, 240, 0.018)"
              : "rgba(92, 72, 130, 0.045)"
          }
          stroke="none"
        />
      ))}

      {zodiacSegments.map((s) => (
        <path
          key={`ze-${s.name}`}
          d={s.d}
          fill="none"
          stroke={s.i % 2 === 0 ? GOLD_SOFT : COOL_GRAY}
          strokeWidth={LINE}
          strokeOpacity={0.16}
          {...LINE_SHARP}
        />
      ))}

      {/* 表盘式密刻度：每度一道，30°/5° 分级 */}
      <g>
        {chronographTicks.map((t) => (
          <line
            key={`c-${t.deg}`}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.gold ? GOLD : COOL_GRAY}
            strokeWidth={LINE}
            strokeOpacity={
              t.micro ? 0.16 : t.deg % 30 === 0 ? 0.34 : tickDensity === "minimal" ? 0.2 : t.deg % 5 === 0 ? 0.26 : 0.18
            }
            strokeLinecap="butt"
            {...LINE_SHARP}
          />
        ))}
      </g>

      {chartData && showRadials && (
        <g>
          {radials12.map((r) => (
            <line
              key={`r-${r.deg}`}
              x1={r.x1}
              y1={r.y1}
              x2={r.x2}
              y2={r.y2}
              stroke={r.gold ? GOLD_SOFT : COOL_GRAY}
              strokeWidth={LINE}
              strokeOpacity={0.11}
              strokeLinecap="round"
              {...LINE_SHARP}
            />
          ))}
        </g>
      )}

      {chartData && (
        <>
          <g>
            {chartData.houseCuspsLonDeg.map((lonDeg, i) => {
              const houseIndex = i + 1;
              const angle = (lonDeg - 90) * DEG2RAD;
              const isAngle = houseIndex === 1 || houseIndex === 4 || houseIndex === 7 || houseIndex === 10;
              const r1 = isAngle ? R_HOUSE_IN + 1.1 : R_HOUSE_IN + 0.55;
              const x1 = CX + r1 * Math.cos(angle);
              const y1 = CY + r1 * Math.sin(angle);
              const x2 = CX + R_HOUSE_OUT * Math.cos(angle);
              const y2 = CY + R_HOUSE_OUT * Math.sin(angle);
              return (
                <line
                  key={`h-${houseIndex}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isAngle ? HOUSE_LINE_ANGLE : HOUSE_LINE}
                  strokeWidth={LINE}
                  strokeOpacity={isAngle ? 0.44 : 0.32}
                  strokeLinecap="round"
                  {...LINE_SHARP}
                >
                  <title>{`第 ${houseIndex} 宫 · ${houseSystemLabelZh(chartData.houseSystem)} · ${formatLon(lonDeg)}`}</title>
                </line>
              );
            })}
          </g>

          {(() => {
            const mc = pointFromLon(chartData.mcLonDeg, R_AXIS);
            const ic = pointFromLon(normDeg(chartData.mcLonDeg + 180), R_AXIS);
            const mcIn = pointFromLon(chartData.mcLonDeg, R_CENTER_HOLE);
            const icIn = pointFromLon(normDeg(chartData.mcLonDeg + 180), R_CENTER_HOLE);
            const asc = pointFromLon(chartData.ascLonDeg, R_AXIS);
            const dsc = pointFromLon(normDeg(chartData.ascLonDeg + 180), R_AXIS);
            const ascIn = pointFromLon(chartData.ascLonDeg, R_CENTER_HOLE);
            const dscIn = pointFromLon(normDeg(chartData.ascLonDeg + 180), R_CENTER_HOLE);
            const ax = 0.36 * axisMuted;
            const axAsc = 0.3 * axisMuted;
            const wGlow = LINE + 0.42;
            const wCore = LINE + 0.02;
            return (
              <g>
                <line
                  x1={mc.x}
                  y1={mc.y}
                  x2={mcIn.x}
                  y2={mcIn.y}
                  stroke={GOLD}
                  strokeWidth={wGlow}
                  strokeOpacity={ax * 0.2}
                  strokeLinecap="round"
                  {...LINE_SHARP}
                />
                <line
                  x1={mc.x}
                  y1={mc.y}
                  x2={mcIn.x}
                  y2={mcIn.y}
                  stroke="#f5ead0"
                  strokeWidth={wCore}
                  strokeOpacity={ax * 0.55}
                  strokeLinecap="round"
                  {...LINE_SHARP}
                >
                  <title>天顶—天底</title>
                </line>
                <line
                  x1={ic.x}
                  y1={ic.y}
                  x2={icIn.x}
                  y2={icIn.y}
                  stroke={GOLD}
                  strokeWidth={wGlow}
                  strokeOpacity={ax * 0.2}
                  strokeLinecap="round"
                  {...LINE_SHARP}
                />
                <line
                  x1={ic.x}
                  y1={ic.y}
                  x2={icIn.x}
                  y2={icIn.y}
                  stroke="#f5ead0"
                  strokeWidth={wCore}
                  strokeOpacity={ax * 0.55}
                  strokeLinecap="round"
                  {...LINE_SHARP}
                />
                <line
                  x1={asc.x}
                  y1={asc.y}
                  x2={ascIn.x}
                  y2={ascIn.y}
                  stroke={GOLD}
                  strokeWidth={wGlow}
                  strokeOpacity={axAsc * 0.18}
                  strokeLinecap="round"
                  {...LINE_SHARP}
                />
                <line
                  x1={asc.x}
                  y1={asc.y}
                  x2={ascIn.x}
                  y2={ascIn.y}
                  stroke="#f5ead0"
                  strokeWidth={wCore}
                  strokeOpacity={axAsc * 0.48}
                  strokeLinecap="round"
                  {...LINE_SHARP}
                >
                  <title>上升—下降</title>
                </line>
                <line
                  x1={dsc.x}
                  y1={dsc.y}
                  x2={dscIn.x}
                  y2={dscIn.y}
                  stroke={GOLD}
                  strokeWidth={wGlow}
                  strokeOpacity={axAsc * 0.18}
                  strokeLinecap="round"
                  {...LINE_SHARP}
                />
                <line
                  x1={dsc.x}
                  y1={dsc.y}
                  x2={dscIn.x}
                  y2={dscIn.y}
                  stroke="#f5ead0"
                  strokeWidth={wCore}
                  strokeOpacity={axAsc * 0.48}
                  strokeLinecap="round"
                  {...LINE_SHARP}
                />
              </g>
            );
          })()}
        </>
      )}

      {!chartData && (
        <g opacity={axisVisible ? 1 : 0.38}>
          <line
            x1={CX}
            y1={CY - 28}
            x2={CX}
            y2={CY + 28}
            stroke={GOLD}
            strokeWidth={LINE}
            strokeOpacity={0.28}
            {...LINE_SHARP}
          />
          <line
            x1={CX - 28}
            y1={CY}
            x2={CX + 28}
            y2={CY}
            stroke={COOL_GRAY}
            strokeWidth={LINE}
            strokeOpacity={0.28}
            {...LINE_SHARP}
          />
        </g>
      )}

      {/* 相位弦：灰虚线/实线；悬停行星时相关线金亮，其余呼吸淡出 */}
      {showAspectLines &&
        chartData &&
        chartData.aspects.map((asp, idx) => {
          const a = planetById.get(asp.a);
          const b = planetById.get(asp.b);
          if (!a || !b) return null;
          const offA = planetLayout.get(asp.a)?.lonOff ?? 0;
          const offB = planetLayout.get(asp.b)?.lonOff ?? 0;
          const pa = pointFromLon(normDeg(a.lonDeg + offA), R_ASPECT);
          const pb = pointFromLon(normDeg(b.lonDeg + offB), R_ASPECT);
          const involved =
            hoveredPlanetId !== null && (asp.a === hoveredPlanetId || asp.b === hoveredPlanetId);
          const dimOthers = hoveredPlanetId !== null && !involved;
          const dash = aspectStrokeDash(asp.type);
          const paint = aspectLinePaint(asp.type, involved, dimOthers);
          const t =
            asp.type === "conjunction"
              ? "合相"
              : asp.type === "sextile"
                ? "六合"
                : asp.type === "trine"
                  ? "三合"
                  : asp.type === "square"
                    ? "四分"
                    : "对冲";
          return (
            <line
              key={`asp-${idx}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={paint.stroke}
              strokeWidth={LINE}
              strokeOpacity={paint.opacity}
              strokeDasharray={dash}
              strokeLinecap="round"
              {...LINE_SHARP}
            >
              <title>{`${t}：${a.labelZh}—${b.labelZh}`}</title>
            </line>
          );
        })}

      {zodiacSegments.map((s) => {
        const zp = zodiacTextLayout[s.i]!;
        const el = ZODIAC_ELEMENT[s.i]!;
        return (
          <text
            key={`z-${s.name}`}
            x={zp.x}
            y={zp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={ZODIAC_NAME_FILL[el]}
            stroke="rgba(0,0,0,0.45)"
            strokeWidth={0.045}
            paintOrder="stroke fill"
            style={{
              fontSize: "3.12px",
              fontWeight: 520,
              letterSpacing: "0.05em",
            }}
          >
            <title>{`${ELEMENT_ZH[el]} · ${s.name}`}</title>
            {s.name}
          </text>
        );
      })}

      <g aria-hidden>
        {zodiacOuterBadges.map((b) => (
          <g key={`zb-${b.i}`} transform={`translate(${b.x},${b.y}) rotate(${b.rot})`}>
            <path
              d={hexPathPointyTop(2.62)}
              fill="url(#zodiac-badge-face)"
              stroke={ZOD_BADGE_STROKE_ELEMENT[ZODIAC_ELEMENT[b.i]!]}
              strokeWidth={0.22}
              vectorEffect="non-scaling-stroke"
            >
              <title>{`${ELEMENT_ZH[ZODIAC_ELEMENT[b.i]!]} · ${ZODIAC_CN[ZODIAC_KEYS[b.i]!]}`}</title>
            </path>
            <text
              x={0}
              y={0.48}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ZOD_BADGE_GLYPH}
              style={{ fontSize: "2.92px", fontFamily: GLYPH_FONT, fontWeight: 600 }}
            >
              {b.sym}
            </text>
          </g>
        ))}
      </g>

      {chartData && (
        <>
          <g>
            {chartData.houseCuspsLonDeg.map((lonDeg, i) => {
              const houseIndex = i + 1;
              const isAngle = houseIndex === 1 || houseIndex === 4 || houseIndex === 7 || houseIndex === 10;
              const { x: lx, y: ly } = houseNumberPoint(lonDeg, R_HOUSE_NUM);
              return (
                <text
                  key={`hn-${houseIndex}`}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isAngle ? houseNumAngleFill : houseNumPlainFill}
                  style={{
                    fontFamily: HOUSE_NUM_FONT,
                    fontSize: isAngle ? "3.05px" : "2.78px",
                    fontWeight: isAngle ? 600 : 500,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.08em",
                  }}
                >
                  <title>{`第 ${houseIndex} 宫${isAngle ? "（角宫）" : ""}`}</title>
                  {houseIndex}
                </text>
              );
            })}
          </g>

          {(() => {
            const mcL = axisLabelAdjustedPoint(chartData.mcLonDeg, R_AXIS_LBL);
            const icL = axisLabelAdjustedPoint(normDeg(chartData.mcLonDeg + 180), R_AXIS_LBL);
            const ascL = axisLabelAdjustedPoint(chartData.ascLonDeg, R_AXIS_LBL);
            const dscL = axisLabelAdjustedPoint(normDeg(chartData.ascLonDeg + 180), R_AXIS_LBL);
            return (
              <g>
                {[
                  { x: mcL.x, y: mcL.y, t: "天顶" },
                  { x: icL.x, y: icL.y, t: "天底" },
                  { x: ascL.x, y: ascL.y, t: "上升" },
                  { x: dscL.x, y: dscL.y, t: "下降" },
                ].map((k) => (
                  <text
                    key={k.t}
                    x={k.x}
                    y={k.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={axisLabelFill}
                    style={{
                      fontSize: "3.05px",
                      fontWeight: 550,
                      letterSpacing: "0.2em",
                    }}
                  >
                    <title>四轴 · {k.t}</title>
                    {k.t}
                  </text>
                ))}
              </g>
            );
          })()}
        </>
      )}

      {/* 行星：仅符号 + 属性辉光（无实心色块） */}
      <g>
        {visiblePlanets.map((p) => {
          const lay = planetLayout.get(p.id) ?? { r: R_GLYPH, lonOff: 0 };
          const pt = pointFromLon(normDeg(p.lonDeg + lay.lonOff), lay.r);
          const isOuter = p.id === "uranus" || p.id === "neptune" || p.id === "pluto";
          const op = highlightSkeleton ? (isOuter ? 0.92 : 1) : 1;
          const glyph = PLANET_GLYPH[p.id];
          const inSign = normDeg(p.lonDeg) % 30;
          const inSignDeg = Math.floor(inSign);
          const inSignMin = Math.round((inSign - inSignDeg) * 60);
          const near = hoveredPlanetId === p.id;
          return (
            <g key={p.id} opacity={op}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={HOVER_R}
                fill="transparent"
                style={{ cursor: "crosshair" }}
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={near ? 3.55 : 3.2}
                fill="url(#planet-aureole)"
                opacity={near ? 0.62 : 0.48}
                style={{ pointerEvents: "none" }}
              />
              <text
                x={pt.x}
                y={pt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={near ? "#f2e6c8" : "#e8d5a8"}
                fillOpacity={1}
                stroke={near ? "rgba(40,32,20,0.5)" : "rgba(5,5,5,0.42)"}
                strokeWidth={near ? 0.09 : 0.06}
                paintOrder="stroke fill"
                style={{
                  fontSize: near ? "5.05px" : "4.58px",
                  fontWeight: 600,
                  fontFamily: GLYPH_FONT,
                  transition: "font-size 0.12s ease-out",
                  filter:
                    "url(#glyph-matte-gold) drop-shadow(0 0 1.4px rgba(232, 213, 172, 0.5)) drop-shadow(0 0 2.8px rgba(201, 167, 108, 0.2))",
                }}
              >
                <title>{`${glyph} ${p.labelZh} · ${ZODIAC_CN[p.zodiac]} ${inSignDeg}°${inSignMin}′ · ${formatLon(p.lonDeg)}`}</title>
                {glyph}
              </text>
            </g>
          );
        })}
      </g>

      {!chartData && (
        <g opacity={highlightSkeleton ? 1 : 0.42}>
          {[
            { x: CX, y: CY - 33, t: "天顶" },
            { x: CX, y: CY + 33, t: "天底" },
            { x: CX + 33, y: CY, t: "下降" },
            { x: CX - 33, y: CY, t: "上升" },
          ].map((k) => (
            <text
              key={k.t}
              x={k.x}
              y={k.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(230, 218, 195, 0.9)"
              style={{ fontSize: "2.1px", fontWeight: 500, letterSpacing: "0.24em" }}
            >
              {k.t}
            </text>
          ))}
          <text
            x={CX + 16}
            y={CY - 11}
            dominantBaseline="middle"
            fill={GOLD}
            fillOpacity={1}
            style={{
              fontSize: "4.6px",
              fontFamily: GLYPH_FONT,
              fontWeight: 600,
              filter:
                "url(#glyph-matte-gold) drop-shadow(0 0 1.2px rgba(197, 160, 89, 0.5)) drop-shadow(0 0 2.2px rgba(197, 160, 89, 0.2))",
            }}
          >
            {PLANET_GLYPH.sun}
          </text>
          <text
            x={CX - 15}
            y={CY + 13}
            textAnchor="end"
            dominantBaseline="middle"
            fill={GOLD}
            fillOpacity={1}
            style={{
              fontSize: "4.45px",
              fontFamily: GLYPH_FONT,
              fontWeight: 600,
              filter:
                "url(#glyph-matte-gold) drop-shadow(0 0 1.2px rgba(197, 160, 89, 0.5)) drop-shadow(0 0 2.2px rgba(197, 160, 89, 0.2))",
            }}
          >
            {PLANET_GLYPH.moon}
          </text>
          {showOuterBodies && (
            <g opacity={0.88}>
              <text
                x={CX + 10}
                y={CY + 24}
                fill={GOLD}
                fillOpacity={1}
                style={{
                  fontSize: "3.95px",
                  fontFamily: GLYPH_FONT,
                  fontWeight: 600,
                  filter:
                    "url(#glyph-matte-gold) drop-shadow(0 0 1px rgba(197, 160, 89, 0.45)) drop-shadow(0 0 2px rgba(197, 160, 89, 0.18))",
                }}
              >
                {PLANET_GLYPH.neptune}
              </text>
              <text
                x={CX - 20}
                y={CY + 22}
                fill={GOLD}
                fillOpacity={1}
                style={{
                  fontSize: "3.95px",
                  fontFamily: GLYPH_FONT,
                  fontWeight: 600,
                  filter:
                    "url(#glyph-matte-gold) drop-shadow(0 0 1px rgba(197, 160, 89, 0.45)) drop-shadow(0 0 2px rgba(197, 160, 89, 0.18))",
                }}
              >
                {PLANET_GLYPH.uranus}
              </text>
              <text
                x={CX + 24}
                y={CY + 8}
                fill={GOLD}
                fillOpacity={1}
                style={{
                  fontSize: "3.95px",
                  fontFamily: GLYPH_FONT,
                  fontWeight: 600,
                  filter:
                    "url(#glyph-matte-gold) drop-shadow(0 0 1px rgba(197, 160, 89, 0.45)) drop-shadow(0 0 2px rgba(197, 160, 89, 0.18))",
                }}
              >
                {PLANET_GLYPH.pluto}
              </text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
