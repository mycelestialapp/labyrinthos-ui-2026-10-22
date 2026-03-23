"use client";

import React from "react";
import { motion } from "framer-motion";
import { HOME_SCREEN_MIN_HEIGHT, HOME_SCREEN_PAD_X, HOME_SCREEN_PAD_Y } from "@/lib/home-screen";
import EnergyHeader from "./EnergyHeader";
import HomeScreenFooter from "./HomeScreenFooter";
import IdentityGoldCard from "./IdentityGoldCard";

export default function SpiritualMirror() {
  return (
    <section
      className={`relative flex w-full flex-col ${HOME_SCREEN_MIN_HEIGHT} ${HOME_SCREEN_PAD_Y}`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl flex-1 flex-col ${HOME_SCREEN_PAD_X}`}
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <EnergyHeader />

          <motion.div
            className="mt-6 md:mt-8"
            initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.95, ease: "easeOut", delay: 0.12 }}
          >
            <IdentityGoldCard />
          </motion.div>
        </div>

        <HomeScreenFooter />
      </div>
    </section>
  );
}

