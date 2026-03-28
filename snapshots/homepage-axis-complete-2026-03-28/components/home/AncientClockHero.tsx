"use client";

import React, { forwardRef } from "react";

/** 仅 iframe，须放在 `relative aspect-square` 容器内 */
export const CompassIframe = forwardRef<HTMLIFrameElement>(function CompassIframe(
  _props,
  ref
) {
  return (
    <iframe
      ref={ref}
      src="/index.html"
      title="轴心 · 宇宙罗盘"
      className="absolute inset-0 h-full w-full border-0"
      loading="lazy"
    />
  );
});

/**
 * 首屏嵌入 public/index.html 宇宙罗盘（SVG + GSAP + Three 粒子）
 * 全屏独立页：/compass
 */
const AncientClockHero = forwardRef<HTMLIFrameElement>(function AncientClockHero(
  _props,
  ref
) {
  return (
    <section className="relative z-[1] flex w-full flex-col items-center justify-center py-[clamp(0.25rem,1.5vh,1rem)]">
      <div className="relative mx-auto aspect-square w-full max-w-[min(100%,94vw,90dvh)] overflow-hidden">
        <CompassIframe ref={ref} />
      </div>
    </section>
  );
});

export default AncientClockHero;
