"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JetBrains_Mono, Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import type { NatalBig3 } from "@/lib/natal-chart";
import { ZODIAC_CN } from "@/lib/natal-chart";
import {
  USER_PROFILE_CHANGED_EVENT,
  USER_PROFILE_STORAGE_KEY,
  parseStoredUserProfileJson,
} from "@/lib/stored-user-profile";
import { birthMomentToUtc } from "@/lib/natal-chart";
import { computeNatalBig3Swiss } from "@/lib/astro-chart-wheel-swiss";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function zodiacSymbol(z: string): string {
  const map: Record<string, string> = {
    ARIES: "♈",
    TAURUS: "♉",
    GEMINI: "♊",
    CANCER: "♋",
    LEO: "♌",
    VIRGO: "♍",
    LIBRA: "♎",
    SCORPIO: "♏",
    SAGITTARIUS: "♐",
    CAPRICORN: "♑",
    AQUARIUS: "♒",
    PISCES: "♓",
  };
  return map[z] ?? "✶";
}

function formatBig3Line(b: NatalBig3): string {
  const cn = (k: keyof typeof ZODIAC_CN) => ZODIAC_CN[k];
  return `☉${zodiacSymbol(b.sun)} ${cn(b.sun)} · ☽${zodiacSymbol(b.moon)} ${cn(b.moon)} · ↑${zodiacSymbol(b.rising)} ${cn(b.rising)}`;
}

const DEFAULT_NEBULA_BIG3: NatalBig3 = {
  sun: "LIBRA",
  moon: "PISCES",
  rising: "SAGITTARIUS",
};

export default function EnergyHeader() {
  const [hz, setHz] = useState(432.17);
  const [tick, setTick] = useState(0);
  const [natalBig3, setNatalBig3] = useState<NatalBig3 | null>(null);

  const refreshNatalBig3 = useCallback(async () => {
    try {
      const raw = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      const profile = parseStoredUserProfileJson(raw);
      if (!profile) {
        setNatalBig3(null);
        return;
      }
      const utc = birthMomentToUtc(profile.birthdate, profile.birthTime, profile.timeZone);
      if (!utc) {
        setNatalBig3(null);
        return;
      }
      const next = await computeNatalBig3Swiss(utc, profile.latitude, profile.longitude);
      setNatalBig3(next);
    } catch {
      setNatalBig3(null);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => void refreshNatalBig3());
    const onProfileChanged = () => void refreshNatalBig3();
    const onStorage = (e: StorageEvent) => {
      if (e.key === USER_PROFILE_STORAGE_KEY || e.key === null) void refreshNatalBig3();
    };
    window.addEventListener(USER_PROFILE_CHANGED_EVENT, onProfileChanged);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(USER_PROFILE_CHANGED_EVENT, onProfileChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, [refreshNatalBig3]);

  const base = useMemo(() => 432.17, []);
  const suppressUntilRef = useRef(0);
  const returnTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() < suppressUntilRef.current) return;
      const delta = (Math.random() - 0.5) * 0.1; // ±0.05
      const next = clamp(base + delta, base - 0.05, base + 0.05);
      setHz(next);
      setTick((t) => t + 1);
    }, 1500);
    return () => window.clearInterval(id);
  }, [base]);

  useEffect(() => {
    const onCoordinatePulse = () => {
      // 强提示：短时间内“解析坐标中”
      if (returnTimerRef.current) window.clearTimeout(returnTimerRef.current);

      suppressUntilRef.current = Date.now() + 650;
      // “同频扫描”：小频率剧烈跳动（围绕 432.17 快速回弹）
      setHz(base + 1.18);
      setTick((t) => t + 1);

      window.setTimeout(() => {
        setHz(clamp(base - 0.36, base - 0.05, base + 0.05));
        setTick((t) => t + 1);
      }, 140);

      returnTimerRef.current = window.setTimeout(() => {
        const delta = (Math.random() - 0.5) * 0.1; // ±0.05
        const next = clamp(base + delta, base - 0.05, base + 0.05);
        setHz(next);
        setTick((t) => t + 1);
      }, 360);
    };

    window.addEventListener("energy:coordinate-pulse", onCoordinatePulse);
    return () => {
      window.removeEventListener("energy:coordinate-pulse", onCoordinatePulse);
      if (returnTimerRef.current) window.clearTimeout(returnTimerRef.current);
    };
  }, [base]);

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div
        className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/45 bg-[#2a243b]/80 px-5 py-2 backdrop-blur-2xl"
        style={{ boxShadow: "0 0 0 1px rgba(212,175,55,0.14), 0 0 34px rgba(212,175,55,0.2)" }}
      >
        <span
          className={`${mono.className} text-[13px] tracking-[0.34em] text-[#f2ddb0] md:text-[14px]`}
        >
          基线宇宙嗡鸣 ·
        </span>
        <motion.span
          key={tick}
          initial={{ opacity: 0.6, y: 2, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`${mono.className} text-[13px] tracking-[0.34em] text-[#ffd879] md:text-[14px]`}
          style={{ textShadow: "0 0 24px rgba(212,175,55,0.34)" }}
        >
          {hz.toFixed(2)} 赫兹
        </motion.span>
      </div>

      <div
        className={`${playfair.className} mt-3 text-[12px] tracking-[0.22em] text-zinc-200 md:text-[13px]`}
        style={{ letterSpacing: "0.22em" }}
      >
        仪表示数：实时星象同步
      </div>

      <div
        className={`${mono.className} mt-2.5 max-w-[min(100%,26rem)] px-3 text-center text-[10px] leading-relaxed tracking-[0.12em] text-[#d4c4a8]/88 md:text-[11px] md:tracking-[0.14em]`}
      >
        {natalBig3 ? (
          <>
            <span className="block text-zinc-500">本命三主星（热带黄道）</span>
            <span className="mt-1 block text-[#f0e6d4]">{formatBig3Line(natalBig3)}</span>
          </>
        ) : (
          <>
            <span className="block text-zinc-500">星云示例三主星（热带黄道）</span>
            <span className="mt-1 block text-[#f0e6d4]">{formatBig3Line(DEFAULT_NEBULA_BIG3)}</span>
          </>
        )}
      </div>
    </div>
  );
}

