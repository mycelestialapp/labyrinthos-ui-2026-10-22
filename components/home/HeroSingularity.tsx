"use client";

import React from "react";
import { motion } from "framer-motion";
import EnergyTelemetry from "../EnergyTelemetry";

export default function HeroSingularity() {
  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center">
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 18, filter: "blur(14px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.05, ease: "easeOut" }}
      >
        <EnergyTelemetry />
      </motion.div>
    </section>
  );
}

