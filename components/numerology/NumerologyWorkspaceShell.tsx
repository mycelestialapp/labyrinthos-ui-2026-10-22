"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { NumerologyEnergyNavPanel } from "@/components/numerology/numerology-energy-nav";
import { NUMEROLOGY_WORKSPACE_MODULES } from "@/lib/numerology-workspace-modules";
import {
  NUMEROLOGY_ACCENT_RGB,
  NUMEROLOGY_NOISE,
  useNumerologyVoidDepthStyle,
} from "@/components/numerology/numerology-shared-ui";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyInstantNavProvider } from "@/components/numerology/NumerologyInstantNavContext";

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
  /** 寰宇之门：以 Next 路径为准；嵌入导航与壳侧栏共用 `norm`，避免 pushState 与 children 打架出现双导航 */
  const isGateHome = norm === "/numerology";
  const { serverSync, dismissServerSync } = useNumerologyWorkspace();
  const voidDepthStyle = useNumerologyVoidDepthStyle();

  const onInstantNavigate = useCallback(
    (path: string) => {
      void router.push(path, { scroll: false });
    },
    [router],
  );

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

  return (
    <NumerologyInstantNavProvider instantPath={norm} navigate={onInstantNavigate}>
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
      {/* 顶区淡蓝冷光：卡片上缘 rim 的环境光来源（极弱，避免染屏） */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.2]"
        style={{
          background: `radial-gradient(ellipse 118% 48% at 50% -6%, rgba(186, 210, 255, 0.16) 0%, transparent 52%)`,
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
        - 窄于 lg：单栏；子页先侧栏后主区。
        - lg：子页为侧栏 12.5rem + 主区；寰宇之门仅主区（导航在 NumerologyGateView 首卡内）。模块切换走 router.push，与 children 同源避免双导航。
      */}
      <div
        className={`relative isolate z-10 mx-auto grid w-full max-w-[100rem] grid-cols-1 gap-5 px-4 pb-16 pt-5 sm:gap-6 sm:px-6 md:px-8 lg:pt-6 ${
          isGateHome
            ? "lg:grid-cols-1 lg:gap-5"
            : "numerology-shell-route-depth lg:grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)] lg:gap-5"
        }`}
      >
        {!isGateHome ? (
          <aside className="numerology-shell-depth-aside relative z-20 min-w-0 w-full lg:sticky lg:top-[4.5rem] lg:self-start lg:max-w-[12.5rem]">
            <NumerologyEnergyNavPanel currentPath={norm} onNavigate={onInstantNavigate} />
          </aside>
        ) : null}

        <div
          id="numerology-main"
          role="main"
          tabIndex={-1}
          className={`relative z-10 min-w-0 w-full overflow-x-hidden outline-none ${!isGateHome ? "numerology-shell-depth-main" : ""}`}
        >
          {children}
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
