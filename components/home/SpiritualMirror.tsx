"use client";

import React from "react";
import { HOME_SCREEN_MIN_HEIGHT, HOME_SCREEN_PAD_X, HOME_SCREEN_PAD_Y } from "@/lib/home-screen";
import AxisHomeCompass from "./AxisHomeCompass";

export default function SpiritualMirror() {
  return (
    <section
      className={`relative flex w-full flex-col ${HOME_SCREEN_MIN_HEIGHT} ${HOME_SCREEN_PAD_Y}`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl flex-1 flex-col ${HOME_SCREEN_PAD_X}`}
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <AxisHomeCompass />
        </div>
      </div>
    </section>
  );
}

