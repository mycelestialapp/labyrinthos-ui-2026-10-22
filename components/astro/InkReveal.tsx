"use client";

import React, { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";

const MATTE = "#C5A059";

/** 哑光金：星座与占星术语 */
export function MatteTerm({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-medium" style={{ color: MATTE, letterSpacing: "0.3em" }}>
      {children}
    </span>
  );
}

type InkRevealBlockProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** 进入视口多少比例后触发 */
  amount?: number;
};

/** 单块墨迹显影：滚动入景时从模糊渗为清晰 */
export function InkRevealBlock({
  children,
  className = "",
  delay = 0,
  amount = 0.35,
}: InkRevealBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount, margin: "0px 0px -12% 0px", once: false });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        visible
          ? { opacity: 1, filter: "blur(0px)", y: 0 }
          : { opacity: 0.22, filter: "blur(7px)", y: 10 }
      }
      transition={{
        duration: 0.95,
        delay,
        ease: [0.22, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/** 将长文拆成句段，逐段 stagger 显影 */
export function InkRevealParagraph({
  text,
  className = "",
  baseDelay = 0,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
}) {
  const parts = useMemo(() => {
    const byEnd = text
      .split(/(?<=[。！？；])\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (byEnd.length > 1) return byEnd;
    return text
      .split(/\s*·\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [text]);

  if (parts.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {parts.map((p, i) => (
        <InkRevealBlock key={`${i}-${p.slice(0, 12)}`} delay={baseDelay + i * 0.12}>
          <p className="text-[11px] leading-[1.95] text-zinc-400/95">{p}</p>
        </InkRevealBlock>
      ))}
    </div>
  );
}
