"use client";

import { useMemo } from "react";

/** 月箔线色（与壳层一致） */
export const NUMEROLOGY_ACCENT_RGB = "168, 188, 208";
export const NUMEROLOGY_CARD_BG = "rgba(34, 42, 52, 0.52)";

export const NUMEROLOGY_NOISE = encodeURIComponent(
  `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
);

export function useNumerologyVoidDepthStyle() {
  return useMemo(
    () => ({
      background: `
        radial-gradient(ellipse 70% 54% at 14% 8%, rgba(226,232,240,0.14) 0%, transparent 42%),
        radial-gradient(ellipse 48% 40% at 88% 86%, rgba(100,116,139,0.1) 0%, transparent 48%),
        radial-gradient(ellipse 95% 44% at 50% 108%, rgba(12,16,22,0.32) 0%, transparent 50%),
        linear-gradient(178deg, #2c3340 0%, #232a34 34%, #1a2028 64%, #14181f 100%)
      `
        .replace(/\s+/g, " ")
        .trim(),
    }),
    [],
  );
}

export function NumerologyGlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border-[0.5px] border-[rgba(168,188,208,0.32)] px-4 py-4 shadow-[inset_0_1px_0_rgba(168,188,208,0.06)] backdrop-blur-xl md:rounded-3xl md:px-5 md:py-5 ${className}`}
      style={{
        background: NUMEROLOGY_CARD_BG,
        boxShadow: `inset 0 0 48px rgba(${NUMEROLOGY_ACCENT_RGB},0.07), 0 20px 56px rgba(10,14,22,0.32)`,
      }}
    >
      {children}
    </div>
  );
}

export const numerologyInputClassName =
  "w-full rounded-xl border border-[rgba(168,188,208,0.38)] bg-[rgba(22,28,38,0.9)] px-3 py-2.5 text-center text-sm tabular-nums text-[#f1f5f9] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition-[border-color,box-shadow] focus:border-[rgba(168,188,208,0.55)] focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_24px_rgba(168,188,208,0.12)]";
