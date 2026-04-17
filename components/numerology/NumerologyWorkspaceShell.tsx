"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";
import { Cinzel } from "next/font/google";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NumerologyGateView } from "@/components/numerology/NumerologyGateView";
import { NumerologyEnergyNavPanel } from "@/components/numerology/numerology-energy-nav";
import { NumerologyChartView } from "@/components/numerology/modules/NumerologyChartView";
import { NumerologyLabView } from "@/components/numerology/modules/NumerologyLabView";
import { NumerologyMatrixView } from "@/components/numerology/modules/NumerologyMatrixView";
import { NumerologySynView } from "@/components/numerology/modules/NumerologySynView";
import { NumerologyWheelView } from "@/components/numerology/modules/NumerologyWheelView";
import { NUMEROLOGY_WORKSPACE_MODULES } from "@/lib/numerology-workspace-modules";
import {
  NUMEROLOGY_ACCENT_RGB,
  NUMEROLOGY_NOISE,
  useNumerologyVoidDepthStyle,
} from "@/components/numerology/numerology-shared-ui";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyInstantNavProvider } from "@/components/numerology/NumerologyInstantNavContext";
import {
  NUMEROLOGY_INSTANT_NAV_EVENT,
  numerologyInstantNavigate,
} from "@/lib/numerology-instant-nav";

const displaySerif = Cinzel({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const COSMOS_SESSION_KEY = "labyrinthos_numerology_cosmos_v1";

function normalizePath(input: string | null | undefined): string {
  return (input ?? "/").replace(/\/$/, "") || "/";
}

/** 首帧 usePathname 偶发空串时，normalize 会变成 "/"，switch 落到 default 且 page 为 null → 主区白屏 */
function numerologyShellPath(pathname: string | null | undefined): string {
  const raw = typeof pathname === "string" ? pathname.trim() : "";
  if (!raw) return "/numerology";
  const n = normalizePath(raw);
  if (!n.startsWith("/numerology")) return "/numerology";
  return n;
}

export function NumerologyWorkspaceShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const norm = useMemo(() => numerologyShellPath(pathname), [pathname]);
  const [instantPath, setInstantPath] = useState(norm);
  /** 寰宇之门：能量导航嵌入首卡左侧，外壳不再占侧栏列 */
  const isGateHome = instantPath === "/numerology";
  const { lifePath, serverSync, dismissServerSync } = useNumerologyWorkspace();
  const voidDepthStyle = useNumerologyVoidDepthStyle();
  const [cosmos, setCosmos] = useState(false);

  useEffect(() => {
    setInstantPath(norm);
  }, [norm]);

  useEffect(() => {
    const syncFromLocation = () => {
      setInstantPath(numerologyShellPath(window.location.pathname));
    };
    window.addEventListener("popstate", syncFromLocation);
    window.addEventListener(NUMEROLOGY_INSTANT_NAV_EVENT, syncFromLocation as EventListener);
    return () => {
      window.removeEventListener("popstate", syncFromLocation);
      window.removeEventListener(NUMEROLOGY_INSTANT_NAV_EVENT, syncFromLocation as EventListener);
    };
  }, []);

  const onInstantNavigate = useCallback((path: string) => {
    numerologyInstantNavigate(path);
  }, []);

  /**
   * Next 的 `children` 与真实 URL 同步；仅「即时 pushState」时 pathname 滞后，才用 switch 镜像挂载。
   * 各 `page.tsx` 已恢复导出视图，避免 children 恒为 null 导致白屏。
   */
  const workspaceContent = useMemo(() => {
    if (norm === instantPath) return children;
    switch (instantPath) {
      case "/numerology":
        return <NumerologyGateView />;
      case "/numerology/chart":
        return <NumerologyChartView />;
      case "/numerology/matrix":
        return <NumerologyMatrixView />;
      case "/numerology/wheel":
        return <NumerologyWheelView />;
      case "/numerology/syn":
        return <NumerologySynView />;
      case "/numerology/lab":
        return <NumerologyLabView />;
      default:
        return <NumerologyGateView />;
    }
  }, [children, instantPath, norm]);

  useEffect(() => {
    let cancelled = false;
    const t = window.setTimeout(() => {
      if (cancelled) return;
      try {
        if (sessionStorage.getItem(COSMOS_SESSION_KEY) === "1") setCosmos(true);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(COSMOS_SESSION_KEY, cosmos ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [cosmos]);

  /**
   * 预取子路由：useEffect 延后执行，避免连打 prefetch 拖住首帧/水合。
   * 侧栏 Link 仍有 onPointerEnter prefetch。
   */
  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    const hrefs = NUMEROLOGY_WORKSPACE_MODULES.map((item) => item.path);
    const prefetchOne = (href: string) => {
      try {
        void router.prefetch(href);
      } catch {
        /* ignore */
      }
    };
    const runBatch = () => {
      if (cancelled) return;
      for (const href of hrefs) prefetchOne(href);
    };
    runBatch();
    const rafId = window.requestAnimationFrame(() => {
      if (cancelled) return;
      runBatch();
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(
          () => {
            if (!cancelled) runBatch();
          },
          { timeout: 2500 },
        );
      }
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      if (idleId != null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [router]);

  const particles = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        left: `${(i * 41) % 92}%`,
        top: `${(i * 29) % 88}%`,
        size: 1 + (i % 4),
        dur: 6 + (i % 5),
        delay: (i % 9) * 0.35,
      })),
    [],
  );

  return (
    <NumerologyInstantNavProvider instantPath={instantPath} navigate={onInstantNavigate}>
    <div
      className="relative min-h-[100dvh] overflow-x-hidden bg-[#0b0f14] font-sans text-[#cbd5e1]"
      data-numerology-shell
    >
      <a href="#numerology-main" className="numerology-skip-main">
        跳到主内容
      </a>
      <div className="pointer-events-none fixed inset-0 z-0" style={voidDepthStyle} aria-hidden />
      <div
        className="numerology-void-aurora pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 56% 50% at 18% 14%, rgba(200,214,228,0.18) 0%, transparent 54%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.38]"
        style={{
          backgroundImage: `repeating-linear-gradient(180deg, transparent, transparent 26px, rgba(${NUMEROLOGY_ACCENT_RGB},0.045) 26px, rgba(${NUMEROLOGY_ACCENT_RGB},0.045) 27px)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.32]"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 0%, transparent 7.5%, rgba(${NUMEROLOGY_ACCENT_RGB},0.065) 7.55%, rgba(${NUMEROLOGY_ACCENT_RGB},0.065) 7.6%, transparent 7.65%, transparent 100%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.42]"
        style={{
          background: `linear-gradient(108deg, rgba(248,250,252,0.08) 0%, transparent 36%, transparent 55%, rgba(148,163,184,0.06) 78%, transparent 100%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 82% 75% at 50% 50%, transparent 0%, transparent 52%, rgba(12,16,24,0.38) 100%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,${NUMEROLOGY_NOISE}")`,
          backgroundSize: "180px 180px",
        }}
        aria-hidden
      />

      {cosmos ? (
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <div
            className="absolute inset-0 opacity-[0.48]"
            style={{
              background: `radial-gradient(ellipse 58% 50% at 22% 18%, rgba(${NUMEROLOGY_ACCENT_RGB},0.16) 0%, transparent 54%)`,
            }}
          />
          {particles.map((p, i) => (
            <span
              key={i}
              data-numerology-particle
              className="absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                background: `rgba(${NUMEROLOGY_ACCENT_RGB},${0.06 + (i % 4) * 0.028})`,
                animation: `numerology-dust ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
                willChange: "opacity, transform",
              }}
            />
          ))}
        </div>
      ) : null}

      <header
        role="banner"
        className="sticky top-0 z-50 border-b-[0.5px] border-[rgba(168,188,208,0.22)] bg-[rgba(36,44,54,0.55)] px-4 py-3 backdrop-blur-md md:px-8"
      >
        <div className="mx-auto flex max-w-[100rem] flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:max-w-[min(100%,36rem)] sm:flex-none">
            <Link
              href="/hub"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border-[0.5px] border-[rgba(168,188,208,0.22)] px-2.5 py-1.5 text-[11px] tracking-[0.2em] text-[#9eb4c8]/90 transition-colors hover:border-[rgba(168,188,208,0.45)]"
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
              星云
            </Link>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-[10px] uppercase tracking-[0.42em] text-[#94a3b8]">坛城数轨 · Atelier Cosmos</p>
              <p className="truncate text-[12px] tracking-[0.12em] text-[#f1f5f9]/88">数秘</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="numerology-badge-pulse flex items-center gap-2 rounded-full border-[0.5px] border-[rgba(168,188,208,0.35)] bg-[rgba(28,36,46,0.58)] px-2.5 py-1 pr-3">
              <span
                className="relative flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] border-[rgba(168,188,208,0.4)] text-xs font-semibold text-[#f1f5f9]"
                style={{ fontFamily: displaySerif.style.fontFamily }}
              >
                {lifePath}
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.28em] text-[#94a3b8] sm:inline">主路径</span>
            </div>

            <button
              type="button"
              onClick={() => setCosmos((c) => !c)}
              aria-pressed={cosmos}
              className={`inline-flex items-center gap-1.5 rounded-full border-[0.5px] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] transition-colors ${
                cosmos
                  ? "border-[rgba(168,188,208,0.55)] bg-[rgba(168,188,208,0.12)] text-[#f1f5f9]"
                  : "border-[rgba(168,188,208,0.2)] text-[#9eb4c8]/75 hover:border-[rgba(168,188,208,0.4)]"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {cosmos ? "寰宇" : "入寰宇"}
            </button>
          </div>
        </div>
      </header>

      {serverSync.status === "error" ? (
        <div
          role="alert"
          aria-live="polite"
          className="relative z-40 border-b border-[rgba(217,119,6,0.22)] bg-[linear-gradient(90deg,rgba(28,22,16,0.96)_0%,rgba(40,32,24,0.96)_50%,rgba(28,22,16,0.96)_100%)] px-4 py-2.5 md:px-8"
        >
          <div className="mx-auto flex min-w-0 max-w-4xl flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-[9px] uppercase tracking-[0.38em] text-[#fcd34d]/65">坛城 · 校准提示</p>
              <p className="mt-1 text-pretty text-[11px] leading-relaxed text-[#fef3c7]/95">
                {serverSync.message}
              </p>
            </div>
            <button
              type="button"
              onClick={dismissServerSync}
              className="shrink-0 self-center rounded-full border border-[rgba(251,191,36,0.35)] bg-[rgba(251,191,36,0.08)] px-3 py-1.5 text-[10px] tracking-[0.14em] text-[#fde68a] hover:border-[rgba(251,191,36,0.55)] hover:bg-[rgba(251,191,36,0.14)]"
            >
              收束
            </button>
          </div>
        </div>
      ) : null}

      {/*
        布局规则：
        - 窄于 lg：单栏；子页外壳侧栏仍为 3/4 列网格。
        - lg：子页为侧栏 12.5rem + 主区；寰宇之门仅主区（导航在 NumerologyGateView 首卡内）。
      */}
      <div
        className={`relative isolate z-10 mx-auto grid w-full max-w-[100rem] grid-cols-1 gap-5 px-4 pb-16 pt-5 sm:gap-6 sm:px-6 md:px-8 lg:pt-6 ${
          isGateHome ? "lg:grid-cols-1 lg:gap-5" : "lg:grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)] lg:gap-5"
        }`}
      >
        {!isGateHome ? (
          <aside className="relative z-20 min-w-0 w-full lg:sticky lg:top-[4.5rem] lg:self-start lg:max-w-[12.5rem]">
            <NumerologyEnergyNavPanel currentPath={instantPath} onNavigate={onInstantNavigate} />
          </aside>
        ) : null}

        <div
          id="numerology-main"
          role="main"
          tabIndex={-1}
          className="relative z-10 min-w-0 w-full overflow-x-hidden outline-none"
        >
          {workspaceContent}
        </div>
      </div>

      {process.env.NODE_ENV === "development" ? (
        <p className="pointer-events-none fixed bottom-3 left-3 z-[100] max-w-[18rem] rounded-md border border-[rgba(168,188,208,0.22)] bg-[rgba(18,24,32,0.9)] px-2.5 py-1.5 text-[9px] leading-snug text-[#94a3b8]">
          开发：样式不更新时，终端 Ctrl+C 后执行 npm run dev:clean；浏览器用 Ctrl+F5 或无痕窗口打开 /numerology。
        </p>
      ) : null}
    </div>
    </NumerologyInstantNavProvider>
  );
}
