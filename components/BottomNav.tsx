"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, ShoppingBag, Users } from "lucide-react";

const navItems = [
  { href: "/", label: "星云", Icon: Sparkles },
  { href: "/apocalypse", label: "天启", Icon: Compass },
  { href: "/origins", label: "缘起", Icon: Users },
  { href: "/arcana", label: "玄典", Icon: ShoppingBag },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      // 纯 fixed：确保任何滚动/路由切换都不改变位置
      className="fixed inset-x-0 bottom-0 z-[60]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex items-center justify-between rounded-2xl border border-[#bf953f]/15 bg-white/5 px-3 py-2 backdrop-blur-xl">
          {navItems.map((item) => {
          const Icon = item.Icon;
          const active = item.href === "/"
            ? pathname === "/"
            : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className="relative flex w-full flex-col items-center justify-center gap-1 rounded-xl py-2"
            >
              {active && (
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(191,149,63,0.40), 0 0 30px rgba(191,149,63,0.22)",
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(252,246,186,0.20) 0%, rgba(191,149,63,0.07) 55%, rgba(191,149,63,0) 70%)",
                  }}
                />
              )}

              <Icon
                className="h-5 w-5"
                style={{
                  color: active ? "rgba(252,246,186,0.95)" : "rgba(252,246,186,0.55)",
                  filter: active ? "drop-shadow(0 0 10px rgba(191,149,63,0.35))" : "none",
                }}
              />
              <span
                className="text-[11px] tracking-[0.22em]"
                style={{
                  color: active ? "rgba(252,246,186,0.95)" : "rgba(252,246,186,0.55)",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
  );
}

