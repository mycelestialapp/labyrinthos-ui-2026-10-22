"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Copy, Layers, Sparkles } from "lucide-react";
import { TAROT_DECK_ZH, TAROT_SPREADS, type TarotSpreadId } from "@/lib/tarot-deck-zh";
import { drawTarotCards, type TarotDrawnCard } from "@/lib/tarot-seeded-draw";
import { resolveLifeSixMergeCategoryId } from "@/lib/tarot-life-six-merge-category-id";
import { TAROT_SANCTUARY_READING_FOOTNOTE_ZH } from "@/lib/tarot-life-six-sanctum-copy-zh";
import {
  loadTarotQuestionLifeCategoriesScriptOnce,
  mergeLifeSixMasterLayeredReadingZh,
} from "@/lib/tarot-life-six-window-bridge";
import { buildTarotLayeredReadingZh, tarotReadingMarkdownZh } from "@/lib/tarot-reading-zh";
import { trackHubEvent } from "@/lib/hub-analytics";
import TarotQuestionSanctum from "@/components/tarot/TarotQuestionSanctum";
import "./tarot-oracle.css";

const GOLD_SOFT = "rgba(197, 160, 89, 0.42)";
const BG_DEEP = "#070714";
const SERIF_ZH = '"Noto Serif SC", "Source Han Serif SC", "Songti SC", serif';

function TarotCardFace({
  drawn,
  positionLabel,
  index,
  revealed,
  oracleChrome = false,
}: {
  drawn: TarotDrawnCard;
  positionLabel: string;
  index: number;
  revealed: boolean;
  oracleChrome?: boolean;
}) {
  const { card, reversed } = drawn;
  return (
    <div className="flex flex-col items-center gap-2">
      <p
        className={`text-center text-[10px] font-medium uppercase tracking-[0.2em] ${
          oracleChrome ? "text-[#eace9b]/90" : "text-zinc-500"
        }`}
        style={oracleChrome ? { fontFamily: "'Cinzel', serif" } : undefined}
      >
        {positionLabel}
      </p>
      <div className="relative aspect-[2/3.4] w-[min(28vw,140px)] sm:w-[min(22vw,168px)]" style={{ perspective: "1400px" }}>
        <motion.div
          className="relative h-full w-full"
          initial={false}
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d", transformPerspective: 1400 }}
        >
          {/* 牌背（朝前为 0°） */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border border-[rgba(197,160,89,0.35)] shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
              background:
                "radial-gradient(ellipse 120% 80% at 50% 20%, rgba(130,90,160,0.35) 0%, rgba(18,12,40,0.95) 45%, rgba(6,5,12,1) 100%)",
            }}
          >
            <div
              className="absolute inset-2 rounded-xl border border-[rgba(197,160,89,0.2)]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  -18deg,
                  transparent,
                  transparent 6px,
                  rgba(197,160,89,0.06) 6px,
                  rgba(197,160,89,0.06) 7px
                )`,
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(197,160,89,0.35)]"
                style={{
                  boxShadow: `inset 0 0 20px ${GOLD_SOFT}, 0 0 24px rgba(197,160,89,0.15)`,
                }}
              >
                <Layers className="h-5 w-5 text-[#E8D4A8]/90" aria-hidden />
              </div>
              <span className="text-[9px] tracking-[0.35em] text-[#C5A059]/75">LABYRINTHOS</span>
            </div>
          </div>
          {/* 牌面（相对容器预先反 180°，整体翻转后正对观众） */}
          <div
            className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-[rgba(197,160,89,0.38)] bg-gradient-to-b from-[#1a1530] to-[#0a0818] shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-1 px-2 py-4 text-center">
              <span className={`text-[10px] tracking-[0.2em] ${oracleChrome ? "text-[#8a7a60]" : "text-zinc-500"}`}>
                #{String(index + 1).padStart(2, "0")}
              </span>
              <p
                className={`text-[15px] font-semibold leading-snug tracking-[0.12em] text-[#E8D4A8] sm:text-base ${reversed ? "rotate-180" : ""}`}
                style={{ fontFamily: SERIF_ZH }}
              >
                {card.nameZh}
              </p>
              <p className={`text-[11px] ${oracleChrome ? "text-[#cbaf7a]" : "text-zinc-500"} ${reversed ? "rotate-180" : ""}`}>
                {reversed ? "逆位" : "正位"}
              </p>
            </div>
            <div
              className="h-1 w-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${GOLD_SOFT}, transparent)`,
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function TarotSanctuary({ plainLayout = false }: { plainLayout?: boolean }) {
  const spreadSectionRef = useRef<HTMLElement>(null);
  const [question, setQuestion] = useState("");
  const [tarotCategoryId, setTarotCategoryId] = useState("");
  const [spreadId, setSpreadId] = useState<TarotSpreadId>("past_present_future");
  const [allowReversed, setAllowReversed] = useState(true);
  const [drawn, setDrawn] = useState<TarotDrawnCard[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [copyOk, setCopyOk] = useState(false);
  const [lifeSixScriptReady, setLifeSixScriptReady] = useState(false);

  const spread = useMemo(() => TAROT_SPREADS.find((s) => s.id === spreadId)!, [spreadId]);

  useEffect(() => {
    let cancelled = false;
    loadTarotQuestionLifeCategoriesScriptOnce()
      .then(() => {
        if (!cancelled) setLifeSixScriptReady(true);
      })
      .catch(() => {
        /* 大体积 bundle 加载失败时保留泛读分层 */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const layered = useMemo(() => {
    if (!drawn || drawn.length === 0) return null;
    const base = buildTarotLayeredReadingZh(spreadId, question.trim(), drawn);
    if (!lifeSixScriptReady) return base;
    const lifeSixMergeCat = resolveLifeSixMergeCategoryId(question.trim(), tarotCategoryId);
    if (!lifeSixMergeCat) return base;
    return mergeLifeSixMasterLayeredReadingZh({
      categoryId: lifeSixMergeCat,
      questionTrim: question.trim(),
      drawn,
      positionLabelsZh: spread.positionLabelsZh,
      base,
    });
  }, [drawn, spreadId, question, tarotCategoryId, lifeSixScriptReady, spread.positionLabelsZh]);

  const onDraw = useCallback(() => {
    setRevealed(false);
    setDrawn(null);
    setShuffling(true);
    const salt = `${question.trim()}|${spreadId}|${allowReversed}|${tarotCategoryId}|${Date.now()}`;
    window.setTimeout(() => {
      const next = drawTarotCards(TAROT_DECK_ZH, spread.count, {
        allowReversed,
        seedSalt: salt,
      });
      setDrawn(next);
      setShuffling(false);
      window.setTimeout(() => setRevealed(true), 120);
    }, 900);
  }, [question, spreadId, allowReversed, spread.count, tarotCategoryId]);

  const onCopy = useCallback(async () => {
    if (!layered) return;
    const md = tarotReadingMarkdownZh(spread.labelZh, layered);
    try {
      await navigator.clipboard.writeText(md);
      setCopyOk(true);
      window.setTimeout(() => setCopyOk(false), 2000);
    } catch {
      /* ignore */
    }
  }, [layered, spread.labelZh]);

  if (plainLayout) {
    return (
    <div
      className="relative min-h-[100dvh] w-full overflow-x-hidden text-zinc-200"
      style={{
        fontFamily: "var(--font-geist-sans), sans-serif",
        backgroundColor: BG_DEEP,
        backgroundImage: `
          radial-gradient(ellipse 100% 70% at 50% -10%, rgba(120, 80, 160, 0.22) 0%, transparent 55%),
          radial-gradient(ellipse 80% 50% at 80% 60%, rgba(197, 160, 89, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 10% 80%, rgba(60, 80, 140, 0.12) 0%, transparent 45%)
        `,
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
          )}")`,
        }}
        aria-hidden
      />

      <header className="relative z-10 border-b border-white/[0.06] bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/hub"
            className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-zinc-400 transition hover:border-[#C5A059]/35 hover:text-[#E8D4A8]"
            onClick={() => trackHubEvent("tarot_back_hub")}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            星云
          </Link>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h1
              className="text-xl font-semibold tracking-[0.2em] text-[#E8D4A8] sm:text-2xl"
              style={{ fontFamily: SERIF_ZH }}
            >
              塔罗圣殿
            </h1>
            <p className="mt-1 truncate text-xs text-zinc-500 sm:text-sm">牌面为镜，照见岔路 · 经典牌阵与分层解读</p>
          </div>
          <Sparkles className="hidden h-8 w-8 shrink-0 text-[#C5A059]/50 sm:block" aria-hidden />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
        {/* 上带：圣殿选题（与 Dmy OracleSanctumEntrance variant=tarot 同源题库） */}
        <section className="rounded-3xl border border-[rgba(197,160,89,0.18)] bg-gradient-to-br from-[rgba(36,32,52,0.75)] to-[rgba(10,8,24,0.92)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-7">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C5A059]/85">问法圣殿</h2>
            <span className="text-[10px] text-zinc-600">十大类 · 点选或自填</span>
          </div>
          <TarotQuestionSanctum
            visualVariant="lab"
            question={question}
            onQuestionChange={setQuestion}
            onCategoryChange={setTarotCategoryId}
            onStartReading={() =>
              spreadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        </section>

        {/* 牌阵与抽牌 */}
        <section
          ref={spreadSectionRef}
          className="rounded-3xl border border-[rgba(197,160,89,0.18)] bg-gradient-to-br from-[rgba(36,32,52,0.75)] to-[rgba(10,8,24,0.92)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-7"
        >
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C5A059]/85">牌阵与抽牌</h2>
            <span className="text-[10px] text-zinc-600">选好问题后在此洗牌</span>
          </div>
          <div className="mt-0">
            <p className="text-xs text-zinc-500">牌阵</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TAROT_SPREADS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSpreadId(s.id);
                    setDrawn(null);
                    setRevealed(false);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm tracking-wide transition ${
                    spreadId === s.id
                      ? "border-[#C5A059]/55 bg-[#C5A059]/14 text-[#E8D4A8]"
                      : "border-white/[0.1] bg-black/25 text-zinc-400 hover:border-[#C5A059]/25"
                  }`}
                >
                  {s.labelZh}
                </button>
              ))}
            </div>
          </div>
          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={allowReversed}
              onChange={(e) => setAllowReversed(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black/40 text-[#C5A059] focus:ring-[#C5A059]/40"
            />
            允许逆位（关闭则本轮仅正位）
          </label>
          <button
            type="button"
            onClick={onDraw}
            disabled={shuffling}
            className="mt-6 w-full rounded-2xl border border-[rgba(197,160,89,0.45)] bg-gradient-to-r from-[rgba(197,160,89,0.18)] to-[rgba(120,80,160,0.12)] py-3.5 text-sm font-medium tracking-[0.2em] text-[#E8D4A8] shadow-[0_0_28px_rgba(197,160,89,0.12)] transition hover:border-[#C5A059]/65 disabled:opacity-50"
          >
            {shuffling ? "洗牌中…" : drawn ? "重新抽牌" : "洗牌并抽牌"}
          </button>
        </section>

        {/* 中带：牌面 */}
        <section className="rounded-3xl border border-[rgba(197,160,89,0.15)] bg-black/25 p-6 sm:p-10">
          <div className="mb-6 flex items-center justify-between gap-2">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C5A059]/85">圣坛</h2>
            {drawn ? (
              <span className="text-xs text-zinc-500">
                {spread.labelZh} · {drawn.length} 张
              </span>
            ) : (
              <span className="text-xs text-zinc-600">尚未抽牌</span>
            )}
          </div>
          <AnimatePresence mode="wait">
            {shuffling ? (
              <motion.div
                key="shuf"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[200px] items-center justify-center"
              >
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-24 w-14 rounded-lg border border-[#C5A059]/30 bg-gradient-to-b from-[#2a2040] to-[#120818]"
                      animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : drawn && drawn.length > 0 ? (
              <motion.div
                key="cards"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-wrap justify-center gap-6 sm:gap-10 ${drawn.length === 1 ? "" : ""}`}
              >
                {drawn.map((d, i) => (
                  <TarotCardFace
                    key={`${d.card.id}-${i}`}
                    drawn={d}
                    positionLabel={spread.positionLabelsZh[i] ?? `位${i + 1}`}
                    index={i}
                    revealed={revealed}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex min-h-[180px] flex-col items-center justify-center gap-2 text-center text-sm text-zinc-600">
                <Layers className="h-10 w-10 text-zinc-700" aria-hidden />
                <p>按下「洗牌并抽牌」，牌背将在圣坛就位并翻开。</p>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* 下带：分层解读 */}
        {layered && revealed ? (
          <section className="space-y-6 rounded-3xl border border-[rgba(197,160,89,0.14)] bg-gradient-to-b from-[rgba(22,20,38,0.9)] to-[rgba(8,6,18,0.95)] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#C5A059]/85">分层解读</h2>
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/35 bg-black/30 px-4 py-2 text-xs tracking-wide text-[#D4C48A] transition hover:border-[#C5A059]/55"
              >
                <Copy className="h-3.5 w-3.5" aria-hidden />
                {copyOk ? "已复制" : "复制 Markdown"}
              </button>
            </div>
            <div className="space-y-5 border-l-2 border-[#C5A059]/25 pl-4">
              <div>
                <p className="text-xs font-medium text-[#C5A059]">【核心快照】</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{layered.snapshot}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#C5A059]">【牌阵推演】</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{layered.spreadLogic}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#C5A059]">【原始读数】</p>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-400">
                  {layered.rawTable}
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium text-[#C5A059]">【执行备忘】</p>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-300">{layered.actions}</p>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-600">{TAROT_SANCTUARY_READING_FOOTNOTE_ZH}</p>
          </section>
        ) : null}
      </main>
    </div>
    );
  }

  return (
    <div
      className="tarot-oracle-root min-h-[100dvh] w-full overflow-x-hidden pb-10"
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, 'Noto Serif SC', serif",
        color: "#f3e6d2",
      }}
    >
      <div className="tarot-cosmic-bg" aria-hidden>
        <div className="tarot-nebula-1" />
        <div className="tarot-nebula-2" />
        <div className="tarot-stars" />
      </div>

      <header className="relative z-20 border-b border-[rgba(212,175,55,0.28)] bg-[rgba(6,2,12,0.55)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1300px] items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/hub"
            className="flex items-center gap-2 rounded-[40px] border border-[rgba(212,175,55,0.35)] bg-black/35 px-3 py-2 text-sm text-[#d4b68a] transition hover:border-[#dbb45c] hover:text-[#ffdfa7]"
            style={{ fontFamily: "'Cinzel', serif" }}
            onClick={() => trackHubEvent("tarot_back_hub")}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            星云
          </Link>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h1
              className="text-xl font-black tracking-[0.22em] text-transparent sm:text-2xl"
              style={{
                fontFamily: "'Cinzel', serif",
                background: "linear-gradient(180deg, #f9e2b0, #b38f4a)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 18px rgba(255,184,107,0.35))",
              }}
            >
              塔罗圣殿
            </h1>
            <p className="mt-1 truncate text-xs text-[#cbaf7a] sm:text-sm">流动星云 · 圣殿视觉 · 分层解读</p>
          </div>
          <Sparkles className="hidden h-8 w-8 shrink-0 text-[#eace9b]/55 sm:block" aria-hidden />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1300px] space-y-8 px-4 py-8 sm:px-5 sm:py-10">
        <section className="oracle-chamber">
          <div className="title-domain">
            <div className="arcane-line">问法圣殿</div>
            <div className="arcane-sub">十大类 · 点选或自填</div>
          </div>
          <TarotQuestionSanctum
            visualVariant="oracle"
            question={question}
            onQuestionChange={setQuestion}
            onCategoryChange={setTarotCategoryId}
            onStartReading={() =>
              spreadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        </section>

        <section ref={spreadSectionRef} className="oracle-chamber scroll-mt-24">
          <div className="title-domain">
            <div className="arcane-line">牌阵与抽牌</div>
            <div className="arcane-sub">择阵 · 洗牌 · 观牌</div>
          </div>
          <div className="control-panel">
            <div className="spread-selector !h-auto min-h-0 w-full max-w-full flex-wrap justify-center py-3">
              {TAROT_SPREADS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSpreadId(s.id);
                    setDrawn(null);
                    setRevealed(false);
                  }}
                  className={`spread-option ${spreadId === s.id ? "active" : ""}`}
                >
                  {s.labelZh}
                </button>
              ))}
            </div>
          </div>
          <label
            className="mt-3 flex cursor-pointer items-center justify-center gap-3 text-sm text-[#d4b68a] sm:justify-start"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <input
              type="checkbox"
              checked={allowReversed}
              onChange={(e) => setAllowReversed(e.target.checked)}
              className="h-4 w-4 rounded border-[#a9844a] bg-black/50 text-[#b69042] focus:ring-[#C5A059]/40"
            />
            允许逆位（关闭则本轮仅正位）
          </label>
          <button
            type="button"
            onClick={onDraw}
            disabled={shuffling}
            className="draw-btn mx-auto mt-6 flex w-full max-w-lg items-center justify-center gap-2 disabled:opacity-50"
          >
            {shuffling ? "洗牌中…" : drawn ? "重新抽牌" : "洗牌并抽牌"}
          </button>
        </section>

        <section className="oracle-chamber">
          <div className="section-title">
            <Layers className="h-6 w-6 shrink-0 text-[#f5c84e]" aria-hidden />
            圣坛
          </div>
          <p className="mb-4 text-center text-sm text-[#cbaf7a]/85">
            {drawn ? `${spread.labelZh} · ${drawn.length} 张` : "尚未抽牌"}
          </p>
          <AnimatePresence mode="wait">
            {shuffling ? (
              <motion.div
                key="shuf-o"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[200px] items-center justify-center"
              >
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-24 w-14 rounded-lg border border-[#dbb45c]/40 bg-gradient-to-b from-[#2a1e30] to-[#140e20]"
                      animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : drawn && drawn.length > 0 ? (
              <motion.div
                key="cards-o"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="spread-area !my-0 flex flex-wrap justify-center gap-6 sm:gap-10"
              >
                {drawn.map((d, i) => (
                  <TarotCardFace
                    key={`${d.card.id}-${i}-o`}
                    drawn={d}
                    positionLabel={spread.positionLabelsZh[i] ?? `位${i + 1}`}
                    index={i}
                    revealed={revealed}
                    oracleChrome
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex min-h-[180px] flex-col items-center justify-center gap-2 text-center text-sm text-[#cbaf7a]/90">
                <Layers className="h-10 w-10 text-[#a9844a]/60" aria-hidden />
                <p>按下「洗牌并抽牌」，牌背将在圣坛就位并翻开。</p>
              </div>
            )}
          </AnimatePresence>
        </section>

        {layered && revealed ? (
          <div className="reading-panel !flex-wrap">
            <div className="spread-interpretation min-w-0 max-w-full flex-[1_1_100%]">
              <div className="section-title">
                <Sparkles className="h-6 w-6 shrink-0 text-[#f5c84e]" aria-hidden />
                分层解读
              </div>
              <div className="mb-4 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={onCopy}
                  className="inline-flex items-center gap-2 rounded-[40px] border border-[#dbb45c] bg-[rgba(26,17,33,0.6)] px-4 py-2 text-xs tracking-wide text-[#ffdfa7] transition hover:border-[#f5c84e] hover:bg-[rgba(182,144,66,0.15)]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  {copyOk ? "已复制" : "复制 Markdown"}
                </button>
              </div>
              <div className="space-y-5 border-l-2 border-[#f5c84e]/40 pl-4">
                <div>
                  <p className="text-xs font-medium text-[#e7cf9c]" style={{ fontFamily: "'Cinzel', serif" }}>
                    【核心快照】
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#f2e1ba]">{layered.snapshot}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#e7cf9c]" style={{ fontFamily: "'Cinzel', serif" }}>
                    【牌阵推演】
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#f2e1ba]">{layered.spreadLogic}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#e7cf9c]" style={{ fontFamily: "'Cinzel', serif" }}>
                    【原始读数】
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#d3c7b0]">
                    {layered.rawTable}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#e7cf9c]" style={{ fontFamily: "'Cinzel', serif" }}>
                    【执行备忘】
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#f2e1ba]">{layered.actions}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#cbaf7a]/85">{TAROT_SANCTUARY_READING_FOOTNOTE_ZH}</p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
