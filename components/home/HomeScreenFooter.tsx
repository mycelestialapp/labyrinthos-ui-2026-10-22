"use client";

import React from "react";
import { HOME_SCREEN_PAD_X } from "@/lib/home-screen";

export default function HomeScreenFooter() {
  return (
    <div
      className={`mt-8 w-full max-w-6xl shrink-0 self-center ${HOME_SCREEN_PAD_X} pb-1 text-center text-[11px] tracking-[0.38em] text-[rgba(255,210,140,0.62)] [text-shadow:0_0_12px_rgba(255,200,80,0.35)] md:text-xs`}
      style={{ textIndent: "0.38em" }}
    >
      轻触中心 · 启阵
    </div>
  );
}
