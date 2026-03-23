"use client";

import React from "react";
import { JetBrains_Mono } from "next/font/google";
import { APP_VERSION, HOME_SCREEN_PAD_X } from "@/lib/home-screen";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export default function HomeScreenFooter() {
  return (
    <div
      className={`${mono.className} mt-8 w-full max-w-6xl shrink-0 self-center ${HOME_SCREEN_PAD_X} pb-1 text-center text-[10px] tracking-[0.34em] text-zinc-500 md:text-[11px]`}
    >
      LABYRINTHOS · v{APP_VERSION}
    </div>
  );
}
