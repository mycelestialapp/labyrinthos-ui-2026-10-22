"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  birthdayNumber,
  computeLifePathBreakdown,
  expressionNumber,
  lifePathNumber,
  personalityNumber,
  personalYear,
  soulUrgeNumber,
} from "@/lib/numerology-pythagorean";
import { numerologyEnergyThemeForLifePath } from "@/lib/numerology-energy-theme";
import { lifePathLayerCopyZh } from "@/lib/numerology-life-path-copy-zh";
import type { NumerologyWorkspaceSnapshot } from "@/lib/numerology-workspace-snapshot";

export type { NumerologyWorkspaceSnapshot };

const STORAGE_KEY = "labyrinthos_numerology_ws_v1";

export type NumerologyServerSyncState =
  | { status: "idle" }
  | { status: "ok"; verifiedAt: number }
  | { status: "error"; message: string };

type Ctx = {
  y: number;
  m: number;
  d: number;
  nameLatin: string;
  calendarYear: number;
  setY: (n: number) => void;
  setM: (n: number) => void;
  setD: (n: number) => void;
  setNameLatin: (s: string) => void;
  replaceWorkspace: (p: NumerologyWorkspaceSnapshot) => void;
  lifePath: number;
  birthdayNum: number;
  personalYearNum: number;
  expression: number | null;
  soulUrge: number | null;
  personality: number | null;
  breakdown: ReturnType<typeof computeLifePathBreakdown>;
  theme: ReturnType<typeof numerologyEnergyThemeForLifePath>;
  layers: ReturnType<typeof lifePathLayerCopyZh>;
  serverSync: NumerologyServerSyncState;
  dismissServerSync: () => void;
};

const NumerologyWorkspaceContext = createContext<Ctx | null>(null);

function readStored(): NumerologyWorkspaceSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Record<string, unknown>;
    const y = Number(o.y);
    const m = Number(o.m);
    const d = Number(o.d);
    const nameLatin = typeof o.nameLatin === "string" ? o.nameLatin : "";
    if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
    if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
    return { y, m, d, nameLatin };
  } catch {
    return null;
  }
}

export function NumerologyWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const calendarYear = useMemo(() => new Date().getFullYear(), []);
  const now = useMemo(() => new Date(), []);
  const [hydrated, setHydrated] = useState(false);
  const [y, setYState] = useState(now.getFullYear());
  const [m, setMState] = useState(now.getMonth() + 1);
  const [d, setDState] = useState(now.getDate());
  const [nameLatin, setNameLatinState] = useState("");
  const [serverSync, setServerSync] = useState<NumerologyServerSyncState>({ status: "idle" });

  const dismissServerSync = useCallback(() => {
    setServerSync({ status: "idle" });
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const s = readStored();
      if (s) {
        setYState(s.y);
        setMState(s.m);
        setDState(s.d);
        setNameLatinState(s.nameLatin);
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ y, m, d, nameLatin }));
    } catch {
      /* ignore quota */
    }
  }, [y, m, d, nameLatin, hydrated]);

  const setY = useCallback((n: number) => setYState(n), []);
  const setM = useCallback((n: number) => setMState(n), []);
  const setD = useCallback((n: number) => setDState(n), []);
  const setNameLatin = useCallback((s: string) => setNameLatinState(s), []);
  const replaceWorkspace = useCallback((p: NumerologyWorkspaceSnapshot) => {
    setYState(p.y);
    setMState(p.m);
    setDState(p.d);
    setNameLatinState(p.nameLatin);
  }, []);

  const lifePath = useMemo(() => lifePathNumber(m, d, y), [m, d, y]);
  const birthdayNum = useMemo(() => birthdayNumber(d), [d]);
  const personalYearNum = useMemo(() => personalYear(m, d, calendarYear), [m, d, calendarYear]);
  const expression = useMemo(() => expressionNumber(nameLatin), [nameLatin]);
  const soulUrge = useMemo(() => soulUrgeNumber(nameLatin), [nameLatin]);
  const personality = useMemo(() => personalityNumber(nameLatin), [nameLatin]);
  const breakdown = useMemo(() => computeLifePathBreakdown(m, d, y), [m, d, y]);
  const theme = useMemo(() => numerologyEnergyThemeForLifePath(lifePath), [lifePath]);
  const layers = useMemo(() => lifePathLayerCopyZh(lifePath), [lifePath]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    const ctrl = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/numerology/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            month: m,
            day: d,
            year: y,
            nameLatin: nameLatin.trim() || undefined,
            calendarYear,
          }),
          signal: ctrl.signal,
        });
        const raw = await res.text();
        if (ctrl.signal.aborted) return;
        let data: { ok?: boolean; numbers?: { lifePath: number }; message?: string };
        try {
          data = JSON.parse(raw) as typeof data;
        } catch {
          setServerSync({ status: "error", message: "接口返回非 JSON" });
          return;
        }
        if (!res.ok || !data.ok) {
          setServerSync({ status: "error", message: typeof data.message === "string" ? data.message : "服务端校验失败" });
          return;
        }
        const remoteLp = data.numbers?.lifePath;
        if (typeof remoteLp !== "number" || remoteLp !== lifePathNumber(m, d, y)) {
          setServerSync({ status: "error", message: "本地与接口主路径不一致，请刷新或反馈。" });
          return;
        }
        if (ctrl.signal.aborted) return;
        setServerSync({ status: "ok", verifiedAt: Date.now() });
      } catch {
        if (ctrl.signal.aborted) return;
        setServerSync({ status: "error", message: "网络异常，接口未校验。" });
      }
    }, 480);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [y, m, d, nameLatin, calendarYear, hydrated]);

  const value = useMemo(
    () =>
      ({
        y,
        m,
        d,
        nameLatin,
        calendarYear,
        setY,
        setM,
        setD,
        setNameLatin,
        replaceWorkspace,
        lifePath,
        birthdayNum,
        personalYearNum,
        expression,
        soulUrge,
        personality,
        breakdown,
        theme,
        layers,
        serverSync,
        dismissServerSync,
      }) satisfies Ctx,
    [
      y,
      m,
      d,
      nameLatin,
      calendarYear,
      setY,
      setM,
      setD,
      setNameLatin,
      replaceWorkspace,
      lifePath,
      birthdayNum,
      personalYearNum,
      expression,
      soulUrge,
      personality,
      breakdown,
      theme,
      layers,
      serverSync,
      dismissServerSync,
    ],
  );

  return <NumerologyWorkspaceContext.Provider value={value}>{children}</NumerologyWorkspaceContext.Provider>;
}

export function useNumerologyWorkspace() {
  const c = useContext(NumerologyWorkspaceContext);
  if (!c) throw new Error("useNumerologyWorkspace must be used inside NumerologyWorkspaceProvider");
  return c;
}
