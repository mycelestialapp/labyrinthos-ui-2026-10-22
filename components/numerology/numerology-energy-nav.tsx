"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CalendarClock, Grid3x3, Home, Orbit, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NUMEROLOGY_WORKSPACE_MODULES } from "@/lib/numerology-workspace-modules";
import { NumerologyGlassCard } from "@/components/numerology/numerology-shared-ui";

const ICON_BY_ID: Record<string, LucideIcon> = {
  gate: Home,
  chart: Orbit,
  matrix: Grid3x3,
  wheel: CalendarClock,
  syn: Users,
};

const NAV_ICONS = NUMEROLOGY_WORKSPACE_MODULES.map((mod) => ({
  ...mod,
  Icon: ICON_BY_ID[mod.id] ?? Home,
}));

export function NumerologyEnergyNavPanel({
  className = "",
  embedded = false,
  currentPath,
  onNavigate,
}: {
  className?: string;
  /** 嵌入寰宇之门主卡时略收紧内边距 */
  embedded?: boolean;
  /** 可选：工作台即时路由模式下，用传入路径覆盖 usePathname */
  currentPath?: string;
  /** 可选：即时切换回调（不走 Next 路由切页） */
  onNavigate?: (path: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  /** 禁止在 render 里读 window（SSR 与客户端首帧不一致 → React 19 水合失败） */
  const norm = (currentPath ?? pathname ?? "/").replace(/\/$/, "") || "/";
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const instantMode = typeof onNavigate === "function";

  useEffect(() => {
    return () => {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    };
  }, []);

  return (
    <div className={className}>
      <div
        className={
          embedded
            ? "mx-auto w-full min-w-0 max-w-full lg:max-w-[min(100%,15.5rem)]"
            : "w-full min-w-0"
        }
      >
        <NumerologyGlassCard
          className={
            embedded ? "!p-3 sm:!p-3.5 lg:!px-4 lg:!pb-6 lg:!pt-6" : "!p-3"
          }
        >
          <p
            className={`mb-2 px-1 uppercase tracking-[0.38em] text-[#94a3b8] lg:mb-3 ${embedded ? "text-[10px] lg:mb-4" : "text-[9px]"}`}
          >
            能量导航
          </p>
          <nav
            className={`grid w-full grid-cols-3 gap-1.5 sm:grid-cols-4 lg:flex lg:flex-col ${embedded ? "lg:gap-3" : "lg:gap-1"}`}
            aria-label="坛城数轨模块"
          >
            {NAV_ICONS.map((item) => {
              const activeByPath = norm === item.path || (item.path !== "/numerology" && norm.startsWith(item.path));
              const active = activeByPath || pendingPath === item.path;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  prefetch
                  scroll={false}
                  onPointerEnter={() => {
                    try {
                      void router.prefetch(item.path);
                    } catch {
                      /* ignore */
                    }
                  }}
                  onClick={(e) => {
                    if (activeByPath) return;
                    e.preventDefault();
                    setPendingPath(item.path);
                    if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
                    pendingTimerRef.current = setTimeout(() => {
                      setPendingPath(null);
                      pendingTimerRef.current = null;
                    }, 1200);
                    if (instantMode) {
                      onNavigate?.(item.path);
                      return;
                    }
                    const canInstant =
                      typeof window !== "undefined" &&
                      norm.startsWith("/numerology") &&
                      item.path.startsWith("/numerology");
                  if (canInstant) {
                    void router.push(item.path, { scroll: false });
                    return;
                  }
                  router.push(item.path, { scroll: false });
                  }}
                  className={`flex min-h-[2.75rem] min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-2 text-center text-[11px] leading-snug tracking-[0.04em] transition-colors sm:min-h-[3rem] sm:px-2 sm:text-[11px] lg:min-h-0 lg:flex-row lg:justify-start lg:gap-2 lg:px-2.5 lg:py-2.5 lg:text-left lg:tracking-[0.06em] ${
                    embedded ? "lg:gap-3 lg:px-3 lg:py-4 lg:text-[13px]" : "lg:gap-2 lg:text-[12px]"
                  } ${
                    active ? "bg-[rgba(168,188,208,0.1)] text-[#f1f5f9]" : "text-[#94a3b8] opacity-80 hover:bg-[rgba(168,188,208,0.06)] hover:opacity-100"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <item.Icon
                    className={`shrink-0 opacity-80 sm:h-[1.05rem] sm:w-[1.05rem] ${embedded ? "h-4 w-4 lg:h-5 lg:w-5" : "h-4 w-4 lg:h-4 lg:w-4"}`}
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <span className="line-clamp-2 w-full min-w-0 break-words lg:line-clamp-none lg:flex-1">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </NumerologyGlassCard>
      </div>
    </div>
  );
}
