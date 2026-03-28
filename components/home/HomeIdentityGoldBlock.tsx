"use client";

import React from "react";
import { motion } from "framer-motion";
import EnergyHeader from "./EnergyHeader";
import IdentityGoldCard, { type IdentityGoldCardProps } from "./IdentityGoldCard";

type Props = {
  className?: string;
  /** 默认 true；星历内嵌出生区设为 false，去掉首页能量抬头 */
  withEnergyHeader?: boolean;
} & Pick<
  IdentityGoldCardProps,
  | "onUnlockPersistSuccess"
  | "layoutVariant"
  | "useSwissEphemeris"
  | "preferFormWhenProfileExists"
  | "profileStorageKey"
  | "notifyProfileChange"
>;

/**
 * 首页第一屏核心：能量抬头 + 身份金卡。星历「出生数据」可只嵌金卡（无抬头）。
 */
export default function HomeIdentityGoldBlock({
  className = "",
  withEnergyHeader = true,
  onUnlockPersistSuccess,
  layoutVariant = "home",
  useSwissEphemeris = true,
  preferFormWhenProfileExists = false,
  profileStorageKey,
  notifyProfileChange,
}: Props) {
  return (
    <div className={className}>
      {withEnergyHeader ? <EnergyHeader /> : null}
      <motion.div
        className={
          layoutVariant === "embedded"
            ? withEnergyHeader
              ? "mt-4 md:mt-5"
              : "mt-0"
            : "mt-6 md:mt-8"
        }
        initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.95, ease: "easeOut", delay: withEnergyHeader ? 0.12 : 0.04 }}
      >
        <IdentityGoldCard
          layoutVariant={layoutVariant}
          onUnlockPersistSuccess={onUnlockPersistSuccess}
          useSwissEphemeris={useSwissEphemeris}
          preferFormWhenProfileExists={preferFormWhenProfileExists}
          profileStorageKey={profileStorageKey}
          notifyProfileChange={notifyProfileChange}
        />
      </motion.div>
    </div>
  );
}
