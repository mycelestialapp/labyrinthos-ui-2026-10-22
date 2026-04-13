"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Archive, ChevronLeft } from "lucide-react";
import { TAROT_DECK_ZH, TAROT_SPREADS, type TarotCardDef } from "@/lib/tarot-deck-zh";
import { drawTarotCards, type TarotDrawnCard } from "@/lib/tarot-seeded-draw";
import { buildTarotLayeredReadingZh } from "@/lib/tarot-reading-zh";
import { trackHubEvent } from "@/lib/hub-analytics";

const VOID_BG = "#050508";
const SERIF = '"Noto Serif SC", "Source Han Serif SC", "Songti SC", serif';
const ROMAN = ["I", "II", "III"] as const;

type Phase = "void" | "deck" | "layout" | "archive";

function cardElementZh(c: TarotCardDef): "火" | "水" | "风" | "地" {
  if (c.arcana === "minor" && c.suit) {
    const m = { wands: "火" as const, cups: "水" as const, swords: "风" as const, pentacles: "地" as const };
    return m[c.suit];
  }
  return (["火", "水", "风", "地"] as const)[c.id % 4]!;
}

const NOISE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.5"/></svg>`,
);

function l2Paragraph(
  drawn: TarotDrawnCard,
  positionLabel: string,
  index: number,
): string {
  const { card, reversed } = drawn;
  const o = reversed ? "逆位" : "正位";
  return `「${positionLabel}」之${ROMAN[index]}：${card.nameZh}（${o}）。${card.gistZh}。与邻位张力请对照整体节奏；此处仅点破这一格的声部。`;
}

export default function TarotRitualExperience() {
  const [phase, setPhase] = useState<Phase>("void");
  const [drawn, setDrawn] = useState<TarotDrawnCard[] | null>(null);
  const [layered, setLayered] = useState<ReturnType<typeof buildTarotLayeredReadingZh> | null>(null);
  const [visibleSlots, setVisibleSlots] = useState(0);
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);
  const [shutter, setShutter] = useState(false);
  const deckRef = useRef<HTMLButtonElement | null>(null);

  const spread = TAROT_SPREADS.find((s) => s.id === "past_present_future")!;

  const mx = useMotionValue(0);
  const skew = useSpring(useTransform(mx, [-120, 120], [2.5, -2.5]), { stiffness: 280, damping: 24 });
  const lift = useSpring(useTransform(mx, [-120, 120], [-1.5, 1.5]), { stiffness: 220, damping: 22 });

  const onDeckMove = useCallback(
    (e: React.MouseEvent) => {
      const el = deckRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      mx.set(Math.max(-120, Math.min(120, x)));
    },
    [mx],
  );

  const onDeckLeave = useCallback(() => {
    mx.set(0);
  }, [mx]);

  const startDraw = useCallback(() => {
    const next = drawTarotCards(TAROT_DECK_ZH, 3, {
      allowReversed: true,
      seedSalt: `ritual|${Date.now()}|${Math.random()}`,
    });
    setDrawn(next);
    setLayered(buildTarotLayeredReadingZh("past_present_future", "", next));
    setPhase("layout");
    setVisibleSlots(0);
  }, []);

  useEffect(() => {
    if (phase !== "layout" || !drawn) return;
    const timers = [0, 380, 760].map((ms, i) =>
      window.setTimeout(() => setVisibleSlots(i + 1), ms),
    );
    return () => timers.forEach(clearTimeout);
  }, [phase, drawn]);

  const l1VerticalText = useMemo(() => {
    if (!layered) return "请凝视虚空";
    return layered.snapshot.slice(0, 72).trim();
  }, [layered]);

  const runSeal = useCallback(() => {
    setShutter(true);
    trackHubEvent("tarot_ritual_seal");
  }, []);

  const onShutterDone = useCallback(() => {
    setShutter(false);
    setPhase("archive");
  }, []);

  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-hidden text-zinc-200"
      style={{
        fontFamily: "var(--font-geist-sans), sans-serif",
        backgroundColor: VOID_BG,
      }}
    >
      {/* 极细噪点 */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,${NOISE_SVG}")`,
        }}
        aria-hidden
      />

      {/* 顶光锥形聚光灯 */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 42% 78% at 50% -8%, rgba(197, 160, 89, 0.11) 0%, rgba(197, 160, 89, 0.03) 28%, transparent 52%),
            radial-gradient(ellipse 72% 55% at 50% 18%, rgba(197, 160, 89, 0.05) 0%, transparent 45%)
          `,
        }}
        aria-hidden
      />

      <AnimatePresence mode="wait">
        {phase === "void" && (
          <motion.div
            key="void"
            role="button"
            tabIndex={0}
            aria-label="轻触以开始仪式"
            className="fixed inset-0 z-10 flex cursor-pointer flex-col items-center justify-center outline-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => setPhase("deck")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPhase("deck");
              }
            }}
          >
            <p
              className="max-w-[min(90vw,22rem)] px-6 text-center text-[15px] font-extralight leading-[1.9] tracking-[0.35em] text-[#C5A059]/[0.42] sm:text-base sm:tracking-[0.42em]"
              style={{ fontFamily: SERIF }}
            >
              请凝视虚空，默想你所求之事
            </p>
            <span className="sr-only">按下 Enter 或点击屏幕以继续</span>
          </motion.div>
        )}

        {phase === "deck" && (
          <motion.div
            key="deck"
            className="fixed inset-0 z-20 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/hub"
              className="absolute left-4 top-4 z-30 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 text-xs text-zinc-600 transition hover:text-[#C5A059]/80"
              onClick={() => trackHubEvent("tarot_ritual_back_hub")}
            >
              <span className="inline-flex items-center gap-1">
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                星云
              </span>
            </Link>
            <div className="flex flex-1 flex-col items-center justify-end pb-[min(12vh,6rem)]">
              <motion.button
                type="button"
                ref={deckRef}
                className="relative flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/40"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.15 }}
                onMouseMove={onDeckMove}
                onMouseLeave={onDeckLeave}
                onClick={startDraw}
                aria-label="点击牌堆抽牌"
              >
                <motion.div style={{ skewX: skew, y: lift }} className="relative">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="absolute left-1/2 top-0 h-[min(28vw,112px)] w-[min(20vw,80px)] -translate-x-1/2 rounded-md border border-[rgba(197,160,89,0.38)] shadow-[0_8px_28px_rgba(0,0,0,0.55)]"
                      style={{
                        transform: `translate(${-i * 1.2}px, ${-i * 3.2}px) rotate(${i * 0.6}deg)`,
                        background:
                          "linear-gradient(145deg, rgba(62,52,48,0.95) 0%, rgba(28,24,22,0.98) 45%, rgba(18,14,12,1) 100%)",
                        zIndex: 5 - i,
                      }}
                    />
                  ))}
                  <div className="h-[min(28vw,112px)] w-[min(20vw,80px)]" aria-hidden />
                </motion.div>
                <p className="mt-8 text-[10px] tracking-[0.4em] text-zinc-600">轻触以抽牌</p>
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === "layout" && drawn && layered && (
          <motion.div
            key="layout"
            className="fixed inset-0 z-30 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* L3 元素水印 */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
              {drawn.map((d, i) => (
                <span
                  key={i}
                  className="absolute select-none text-[clamp(6rem,22vw,14rem)] font-serif font-light text-[#C5A059]/[0.06]"
                  style={{
                    left: `${18 + i * 22}%`,
                    top: `${25 + (i % 2) * 18}%`,
                    transform: `rotate(${-12 + i * 9}deg)`,
                  }}
                >
                  {cardElementZh(d.card)}
                </span>
              ))}
            </div>

            <Link
              href="/hub"
              className="absolute left-3 top-3 z-50 text-[10px] text-zinc-700 transition hover:text-zinc-500"
            >
              ← 星云
            </Link>

            {/* 左 35% 牌阵 */}
            <div className="relative z-10 flex w-[35%] min-w-[200px] items-center justify-center pl-2 sm:pl-6">
              <div className="perspective-[1400px]">
                <motion.div
                  className="flex items-end justify-center gap-2 sm:gap-4"
                  style={{
                    transform: "rotateY(-7deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {drawn.map((d, i) => (
                    <div key={i} className="relative flex flex-col items-center">
                      <AnimatePresence>
                        {visibleSlots > i && (
                          <>
                            <motion.div
                              className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C5A059]/30 sm:h-52 sm:w-52"
                              initial={{ scale: 0, opacity: 0.55 }}
                              animate={{ scale: 2.8, opacity: 0 }}
                              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            />
                            <motion.div
                              role="button"
                              tabIndex={0}
                              className="relative aspect-[2/3.2] w-[min(22vw,100px)] cursor-default rounded-md border border-[rgba(197,160,89,0.42)] sm:w-[min(18vw,120px)]"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(36,32,40,0.96) 0%, rgba(14,12,16,0.98) 100%)",
                                boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(197,160,89,0.12)",
                              }}
                              initial={{ opacity: 0, scale: 0.94 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.12 }}
                              onMouseEnter={() => setHoverSlot(i)}
                              onMouseLeave={() => setHoverSlot(null)}
                              onFocus={() => setHoverSlot(i)}
                              onBlur={() => setHoverSlot(null)}
                              onPointerDown={() => setHoverSlot(i)}
                            >
                              <div className="flex h-full flex-col items-center justify-center px-1 text-center">
                                <p
                                  className={`text-[11px] font-medium tracking-[0.15em] text-[#D4C48A] sm:text-xs ${d.reversed ? "rotate-180" : ""}`}
                                  style={{ fontFamily: SERIF }}
                                >
                                  {d.card.nameZh}
                                </p>
                                <p className={`mt-1 text-[9px] text-zinc-600 ${d.reversed ? "rotate-180" : ""}`}>
                                  {d.reversed ? "逆" : "正"}
                                </p>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                      {visibleSlots > i ? (
                        <span
                          className="mt-2 font-serif text-[10px] tracking-[0.35em] text-zinc-600"
                          style={{ fontFamily: SERIF }}
                        >
                          {ROMAN[i]}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* 中：悬停显 L2 */}
            <div className="relative z-10 hidden flex-1 items-center justify-center px-4 md:flex">
              <AnimatePresence mode="wait">
                {hoverSlot !== null && drawn[hoverSlot] ? (
                  <motion.p
                    key={hoverSlot}
                    className="max-w-md text-center text-sm font-light leading-[2] tracking-wide text-zinc-400"
                    style={{ fontFamily: SERIF }}
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.45 }}
                  >
                    {l2Paragraph(drawn[hoverSlot], spread.positionLabelsZh[hoverSlot]!, hoverSlot)}
                  </motion.p>
                ) : (
                  <motion.p
                    key="hint"
                    className="max-w-xs text-center text-[11px] font-light tracking-[0.2em] text-zinc-700"
                    style={{ fontFamily: SERIF }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    悬停于牌面，墨迹自现
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* 右：L1 书脊式竖排 */}
            <div className="relative z-10 flex w-[38%] max-w-xl flex-none items-stretch justify-end pr-1 sm:pr-3">
              <div
                className="flex max-h-[88vh] flex-1 items-start justify-end overflow-hidden py-8"
                style={{ writingMode: "vertical-rl" }}
              >
                <p
                  className="text-right text-[clamp(1.1rem,2.2vh,1.45rem)] font-light leading-[1.85] tracking-[0.12em] text-[#C5A059]/90"
                  style={{ fontFamily: SERIF }}
                >
                  {l1VerticalText}
                </p>
              </div>
            </div>

            {/* 移动端 L2：牌下方 */}
            <div className="fixed bottom-24 left-0 right-0 z-40 px-4 md:hidden">
              {hoverSlot !== null && drawn[hoverSlot] ? (
                <p className="mx-auto max-w-sm text-center text-xs leading-relaxed text-zinc-500" style={{ fontFamily: SERIF }}>
                  {l2Paragraph(drawn[hoverSlot], spread.positionLabelsZh[hoverSlot]!, hoverSlot)}
                </p>
              ) : (
                <p className="text-center text-[10px] text-zinc-700">点按牌面阅读此位</p>
              )}
            </div>

            {/* 封存 */}
            <motion.button
              type="button"
              aria-label="封存本次占卜"
              className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(197,160,89,0.25)] bg-black/30 text-[#C5A059]/70 transition hover:border-[#C5A059]/45 hover:text-[#E8D4A8]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={runSeal}
            >
              <Archive className="h-4 w-4" strokeWidth={1.25} />
            </motion.button>
          </motion.div>
        )}

        {phase === "archive" && drawn && layered && (
          <motion.div
            key="archive"
            className="fixed inset-0 z-40 overflow-y-auto"
            style={{ backgroundColor: VOID_BG }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="mx-auto min-h-full max-w-lg border-x border-[rgba(197,160,89,0.22)] px-6 py-12 shadow-[inset_0_0_80px_rgba(197,160,89,0.04)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(197,160,89,0.07) 0%, transparent 12%, transparent 88%, rgba(197,160,89,0.05) 100%)",
              }}
            >
              <p className="text-center text-[10px] tracking-[0.5em] text-[#C5A059]/50">ARCHIVE · 封存</p>
              <h2 className="mt-6 text-center text-lg font-light tracking-[0.25em] text-[#E8D4A8]" style={{ fontFamily: SERIF }}>
                三牌·时间流
              </h2>
              <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-400">
                {drawn.map((d, i) => (
                  <p key={i}>
                    <span className="text-zinc-600">{ROMAN[i]} · </span>
                    {d.card.nameZh}（{d.reversed ? "逆" : "正"}）
                  </p>
                ))}
                <div className="border-t border-white/[0.06] pt-6">
                  <p className="text-xs font-medium text-[#C5A059]">核心快照</p>
                  <p className="mt-2">{layered.snapshot}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#C5A059]">牌阵推演</p>
                  <p className="mt-2">{layered.spreadLogic}</p>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs text-zinc-500">{layered.rawTable}</pre>
                <div>
                  <p className="text-xs font-medium text-[#C5A059]">执行备忘</p>
                  <p className="mt-2 whitespace-pre-line">{layered.actions}</p>
                </div>
              </div>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  className="rounded-full border border-[#C5A059]/35 px-5 py-2 text-xs tracking-widest text-[#D4C48A] transition hover:bg-[#C5A059]/10"
                  onClick={() => {
                    setPhase("void");
                    setDrawn(null);
                    setLayered(null);
                    setVisibleSlots(0);
                    setHoverSlot(null);
                  }}
                >
                  再占一次
                </button>
                <Link
                  href="/hub"
                  className="rounded-full border border-white/[0.08] px-5 py-2 text-xs tracking-widest text-zinc-500 transition hover:text-zinc-400"
                >
                  返回星云
                </Link>
                <Link
                  href="/tarot"
                  className="w-full text-center text-[10px] tracking-[0.2em] text-zinc-600 underline-offset-4 hover:text-zinc-500 hover:underline"
                >
                  返回经典工作台
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 快门闪 */}
      <AnimatePresence>
        {shutter && (
          <motion.div
            key="shutter"
            className="pointer-events-none fixed inset-0 z-[100] bg-[#C5A059]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.92, 0] }}
            transition={{ duration: 0.42, times: [0, 0.35, 1] }}
            onAnimationComplete={onShutterDone}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
