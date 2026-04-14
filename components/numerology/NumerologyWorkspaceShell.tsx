"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarClock,
  ChevronLeft,
  FlaskConical,
  Grid3x3,
  Home,
  Orbit,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Cinzel } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { NUMEROLOGY_WORKSPACE_MODULES } from "@/lib/numerology-workspace-modules";
import {
  NUMEROLOGY_ACCENT_RGB,
  NUMEROLOGY_NOISE,
  NumerologyGlassCard,
  useNumerologyVoidDepthStyle,
} from "@/components/numerology/numerology-shared-ui";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";

const displaySerif = Cinzel({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const ICON_BY_ID: Record<string, LucideIcon> = {
  gate: Home,
  chart: Orbit,
  matrix: Grid3x3,
  wheel: CalendarClock,
  syn: Users,
  archive: BookOpen,
  lab: FlaskConical,
};

const NAV_ICONS = NUMEROLOGY_WORKSPACE_MODULES.map((mod) => ({
  ...mod,
  Icon: ICON_BY_ID[mod.id] ?? Home,
}));

const COSMOS_SESSION_KEY = "labyrinthos_numerology_cosmos_v1";

export function NumerologyWorkspaceShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const norm = (pathname ?? "/").replace(/\/$/, "") || "/";
  const { lifePath, serverSync, dismissServerSync } = useNumerologyWorkspace();
  const voidDepthStyle = useNumerologyVoidDepthStyle();
  const [cosmos, setCosmos] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(COSMOS_SESSION_KEY) === "1") setCosmos(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(COSMOS_SESSION_KEY, cosmos ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [cosmos]);

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
    <div className="relative min-h-[100dvh] overflow-x-hidden font-sans text-[#cbd5e1]">
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
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border-[0.5px] border-[rgba(168,188,208,0.22)] px-2.5 py-1.5 text-[10px] tracking-[0.2em] text-[#9eb4c8]/90 transition-colors hover:border-[rgba(168,188,208,0.45)]"
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
              星云
            </Link>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-[9px] uppercase tracking-[0.42em] text-[#94a3b8]">坛城数轨 · Atelier Cosmos</p>
              <p className="truncate text-[11px] tracking-[0.12em] text-[#f1f5f9]/88">数秘</p>
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
              <span className="hidden text-[9px] uppercase tracking-[0.28em] text-[#94a3b8] sm:inline">主路径</span>
            </div>

            <button
              type="button"
              onClick={() => setCosmos((c) => !c)}
              aria-pressed={cosmos}
              className={`inline-flex items-center gap-1.5 rounded-full border-[0.5px] px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] transition-colors ${
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
          role="status"
          className="relative z-40 border-b border-[rgba(248,113,113,0.25)] bg-[rgba(40,22,22,0.55)] px-4 py-2 text-center text-[11px] text-[#fecaca] md:px-8"
        >
          <span>{serverSync.message}</span>
          <button
            type="button"
            onClick={dismissServerSync}
            className="ml-3 rounded border border-[rgba(248,113,113,0.35)] px-2 py-0.5 text-[10px] text-[#fecaca] hover:bg-[rgba(248,113,113,0.12)]"
          >
            关闭
          </button>
        </div>
      ) : null}

      {/*
        布局规则（与寰宇之门内 lg 断点一致）：
        - 窄于 lg：单栏；导航为 3/4 列网格，避免整列过长。
        - lg 及以上：侧栏 12.5rem + 主区 minmax(0,1fr)，sticky 顶对齐。
      */}
      <div className="relative isolate z-10 mx-auto grid w-full max-w-[100rem] grid-cols-1 gap-5 px-4 pb-16 pt-5 sm:gap-6 sm:px-6 md:px-8 lg:grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)] lg:gap-8 lg:pt-6">
        <aside className="relative z-20 min-w-0 w-full lg:sticky lg:top-[4.5rem] lg:self-start lg:max-w-[12.5rem]">
          <NumerologyGlassCard className="!p-3">
            <p className="mb-2 px-1 text-[8px] uppercase tracking-[0.38em] text-[#94a3b8] lg:mb-3">能量导航</p>
            <nav
              className="grid w-full grid-cols-3 gap-1.5 sm:grid-cols-4 lg:flex lg:flex-col lg:gap-1"
              aria-label="坛城数轨模块"
            >
              {NAV_ICONS.map((item) => {
                const active =
                  norm === item.path || (item.path !== "/numerology" && norm.startsWith(item.path));
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    prefetch
                    scroll={false}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                      e.preventDefault();
                      router.push(item.path);
                    }}
                    className={`flex min-h-[2.75rem] min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-2 text-center text-[10px] leading-snug tracking-[0.04em] transition-colors sm:min-h-[3rem] sm:px-2 sm:text-[10px] lg:min-h-0 lg:flex-row lg:justify-start lg:gap-2 lg:px-2.5 lg:py-2.5 lg:text-left lg:text-[11px] lg:tracking-[0.06em] ${
                      active ? "bg-[rgba(168,188,208,0.1)] text-[#f1f5f9]" : "text-[#94a3b8] opacity-80 hover:bg-[rgba(168,188,208,0.06)] hover:opacity-100"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <item.Icon className="h-4 w-4 shrink-0 opacity-80 sm:h-[1.05rem] sm:w-[1.05rem] lg:h-4 lg:w-4" strokeWidth={1.25} aria-hidden />
                    <span className="line-clamp-2 w-full min-w-0 break-words lg:line-clamp-none lg:flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </NumerologyGlassCard>
        </aside>

        <div
          id="numerology-main"
          role="main"
          tabIndex={-1}
          className="relative z-10 min-w-0 w-full overflow-x-hidden outline-none"
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
  );
}
