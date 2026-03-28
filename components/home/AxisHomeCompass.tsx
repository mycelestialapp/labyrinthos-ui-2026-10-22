"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AXIS_LAYER3,
  AXIS_LAYER4,
  pickRandomVerdictPole,
  type AxisPole,
  isAxisParentMessage,
} from "@/lib/axis-copy";
import { CompassIframe } from "./AncientClockHero";

const POLE_HEAD: Record<AxisPole, string> = {
  N: "北 · N",
  S: "南 · S",
  E: "东 · E",
  W: "西 · W",
  C: "轴心 · C",
};

/** 中文与标点可靠显示（避免继承罗盘页 Cinzel 导致缺字错位） */
const CJK_UI =
  'var(--font-geist-sans), "PingFang SC", "Microsoft YaHei", "Noto Sans SC", SimHei, sans-serif';

const STAGE_SECTION =
  "relative z-[1] flex w-full flex-col items-center justify-center py-[clamp(0.25rem,1.5vh,1rem)]";
const STAGE_INNER =
  "relative mx-auto aspect-square w-full max-w-[min(100%,94vw,90dvh)] overflow-hidden";

export default function AxisHomeCompass() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [verdictPole, setVerdictPole] = useState<AxisPole | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (!isAxisParentMessage(e.data)) return;
      setVerdictPole(pickRandomVerdictPole());
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const closeVerdict = useCallback(() => setVerdictPole(null), []);

  useEffect(() => {
    if (!verdictPole) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") closeVerdict();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [verdictPole, closeVerdict]);

  useEffect(() => {
    if (!verdictPole) return;
    const id = window.requestAnimationFrame(() => {
      stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [verdictPole]);

  return (
    <div className="flex w-full flex-col items-stretch">
      <section className={STAGE_SECTION}>
        <div ref={stageRef} className={STAGE_INNER}>
          <div className="absolute inset-0">
            <CompassIframe />
          </div>

          {verdictPole !== null && (
            <div
              className="axis-verdict-enter absolute inset-0 z-[5] flex flex-col bg-[rgba(6,5,4,0.78)] backdrop-blur-[2px]"
              style={{ fontFamily: CJK_UI }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="axis-verdict-title"
            >
              <button
                type="button"
                onClick={closeVerdict}
                className="absolute left-3 top-3 z-10 rounded px-2 py-1.5 text-sm tracking-[0.12em] text-[rgba(255,210,150,0.88)] underline-offset-4 hover:bg-[rgba(255,200,100,0.08)] hover:text-[#ffe9b8] hover:underline md:left-5 md:top-5 md:text-base"
              >
                ← 返回罗盘
              </button>

              <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-6 pt-14 md:px-8 md:pb-10 md:pt-16">
                <article className="max-h-full w-full max-w-[min(36rem,94%)] overflow-y-auto overscroll-contain text-center [&_h2]:[text-shadow:0_2px_18px_rgba(0,0,0,0.82)] [&_li]:[text-shadow:0_1px_12px_rgba(0,0,0,0.78)] [&_p]:[text-shadow:0_1px_14px_rgba(0,0,0,0.8)]">
                  {(() => {
                    const V = AXIS_LAYER4[verdictPole];
                    const L3 = AXIS_LAYER3[verdictPole];
                    return (
                      <>
                        <p className="text-sm font-medium tracking-[0.35em] text-[rgba(255,200,130,0.72)] md:text-base">
                          {POLE_HEAD[verdictPole]} · {L3.short}
                        </p>
                        <h2
                          id="axis-verdict-title"
                          className="mt-4 text-[clamp(1.35rem,4.2vmin,2.25rem)] font-semibold leading-tight tracking-[0.06em] text-[#f2dc96] md:mt-5"
                        >
                          {V.heading}
                        </h2>
                        <p className="mx-auto mt-5 max-w-[28rem] text-[clamp(1.05rem,2.8vmin,1.35rem)] leading-relaxed text-[rgba(255,245,225,0.95)] md:mt-6">
                          {V.verdict}
                        </p>

                        <div className="mx-auto mt-8 w-full max-w-[28rem] border-t border-[rgba(200,160,90,0.35)] pt-8 md:mt-10">
                          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[rgba(255,200,120,0.55)] md:text-sm">
                            今日律条
                          </p>
                          <ul className="mx-auto mt-5 max-w-xl space-y-5 text-left text-[clamp(1rem,2.5vmin,1.2rem)] leading-relaxed text-[rgba(255,232,205,0.92)] md:space-y-6">
                            {V.rules.map((r) => (
                              <li
                                key={r}
                                className="border-l-[3px] border-[rgba(220,180,90,0.55)] pl-5"
                              >
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mx-auto mt-8 w-full max-w-[28rem] rounded-lg border border-[rgba(212,175,55,0.35)] bg-[rgba(255,200,80,0.07)] px-5 py-5 text-left md:mt-10 md:px-6 md:py-6">
                          <p className="text-xs font-medium tracking-[0.22em] text-[rgba(255,200,120,0.6)] md:text-sm">
                            核心一问
                          </p>
                          <p className="mt-3 text-[clamp(1.05rem,2.6vmin,1.3rem)] leading-relaxed text-[#faf3dd]">
                            {V.question}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </article>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
