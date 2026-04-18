"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getRandomDraw,
  type SpreadKind,
  type TarotCardEntry,
} from "@/lib/tarot-cards-sacred";
import { getTarotAllowReversed } from "@/lib/tarot-sacred-settings";
import { addTarotSacredReading } from "@/lib/tarot-sacred-history";
import { ORACLE_CARDS_MASTER_BACKGROUND_ZH } from "@/lib/oracle-cards-master-background-zh";
import OracleAmberOilBackground from "@/components/tarot/OracleAmberOilBackground";
import "./oracle-dimensional-altar.css";

type Step = "idle" | "shuffle" | "draw";

function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n));
}

function cardDisplayNumber(card: TarotCardEntry): number {
  const m = /^major_(\d+)$/.exec(card.id);
  if (m) return Number(m[1]);
  return 0;
}

function sequenceNo(card: TarotCardEntry): string {
  const m = /^major_(\d+)$/.exec(card.id);
  if (m) return String(Number(m[1])).padStart(3, "0");
  let h = 0;
  for (let i = 0; i < card.id.length; i += 1) {
    h = (h * 31 + card.id.charCodeAt(i)) >>> 0;
  }
  return String((h % 900) + 100);
}

function shortenChinese(text: string, maxLen: number): string {
  const t = text.replace(/\s+/g, "").trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen);
  const stops = ["，", "。", "；", "、", "："];
  for (let i = cut.length - 1; i > Math.floor(maxLen * 0.45); i -= 1) {
    if (stops.includes(cut[i]!)) return cut.slice(0, i + 1);
  }
  return `${cut.slice(0, maxLen - 1)}…`;
}

function lineOfPractice(card: TarotCardEntry, upright: boolean): string {
  const raw = upright ? card.advice : shortenChinese(card.reversed, 48) || card.advice;
  const line = shortenChinese(raw, 40);
  return `行法：${line}`;
}

/** 意象：关键词为主，宗师向短句 */
function imageKeywordsLine(card: TarotCardEntry): string {
  const k = card.keywords?.length ? card.keywords.slice(0, 4).join(" · ") : "";
  return k ? `意象：${k}` : "意象：待启封后显影。";
}

/** 判词：正文压缩，偏一句落定 */
function verdictLine(card: TarotCardEntry, upright: boolean): string {
  const body = upright ? card.upright : card.reversed;
  return shortenChinese(body, 44);
}

type Ripple = { id: number; x: number; y: number };

export default function OracleDimensionalAltar() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>("idle");
  const [drawn, setDrawn] = useState<{ card: TarotCardEntry; upright: boolean } | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  const [pointerNorm, setPointerNorm] = useState({ x: 0, y: 0 });
  const [gyroNorm, setGyroNorm] = useState({ x: 0, y: 0 });
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [bottomLift, setBottomLift] = useState(0);
  const [ringFlash, setRingFlash] = useState(false);
  const lastMinute = useRef<number | null>(null);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const px = clamp(pointerNorm.x * (reduceMotion ? 0 : 1) + gyroNorm.x * (gyroEnabled && !reduceMotion ? 0.34 : 0), -1, 1);
  const py = clamp(pointerNorm.y * (reduceMotion ? 0 : 1) + gyroNorm.y * (gyroEnabled && !reduceMotion ? 0.34 : 0), -1, 1);
  const blurExtra = Math.hypot(px, py) * 6;
  const bottomShow = step === "draw" ? Math.max(bottomLift, 0.36) : bottomLift;
  /** 底部文案亮度：不依赖首次 pointermove（否则像「全空」） */
  const bottomUi =
    step === "idle" ? Math.max(bottomLift, 0.38) : step === "shuffle" ? Math.max(bottomLift, 0.3) : bottomShow;
  const resetReveal = step === "draw" ? clamp((bottomShow - 0.08) / 0.92, 0, 1) : 0;

  const spawnRipple = useCallback((clientX: number, clientY: number) => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = clientX - r.left;
    const y = clientY - r.top;
    const id = rippleId.current + 1;
    rippleId.current = id;
    setRipples((prev) => [...prev, { id, x, y }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((p) => p.id !== id));
    }, 760);
  }, []);

  const updatePointerFromEvent = useCallback((clientX: number, clientY: number) => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    const nx = (clientX / w) * 2 - 1;
    const ny = (clientY / h) * 2 - 1;
    setPointerNorm({ x: nx, y: ny });
    const zone = h * 0.32;
    const distBottom = h - clientY;
    const lift = clamp(distBottom / zone, 0, 1);
    setBottomLift(lift);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      updatePointerFromEvent(e.clientX, e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [updatePointerFromEvent]);

  /** 与琥珀 Shader 15s 呼吸同相，驱动竖题 / 行法阴影极弱脉动 */
  useEffect(() => {
    if (reduceMotion) {
      rootRef.current?.style.setProperty("--oda-breathe", "1");
      return;
    }
    const periodSec = 15;
    let id = 0;
    const tick = () => {
      const el = rootRef.current;
      if (!el) {
        id = window.requestAnimationFrame(tick);
        return;
      }
      const t = (typeof performance !== "undefined" ? performance.now() : Date.now()) / 1000;
      const breathe = 0.5 + 0.5 * Math.sin((t * Math.PI * 2) / periodSec);
      el.style.setProperty("--oda-breathe", breathe.toFixed(4));
      id = window.requestAnimationFrame(tick);
    };
    id = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(id);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const onOr = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      const gx = clamp(e.gamma / 42, -1, 1);
      const gy = clamp((e.beta - 42) / 28, -1, 1);
      setGyroNorm({ x: gx, y: gy });
    };
    window.addEventListener("deviceorientation", onOr);
    return () => window.removeEventListener("deviceorientation", onOr);
  }, [reduceMotion]);

  useEffect(() => {
    const tick = () => {
      const m = new Date().getMinutes();
      if (lastMinute.current !== null && m !== lastMinute.current) {
        setRingFlash(true);
        window.setTimeout(() => setRingFlash(false), 900);
      }
      lastMinute.current = m;
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const requestGyro = useCallback(async () => {
    if (reduceMotion) return;
    const DO = typeof window !== "undefined" ? window.DeviceOrientationEvent : undefined;
    if (!DO) return;
    try {
      const req = (DO as unknown as { requestPermission?: () => Promise<PermissionState> }).requestPermission;
      if (typeof req === "function") {
        const s = await req.call(DO);
        setGyroEnabled(s === "granted");
      } else {
        setGyroEnabled(true);
      }
    } catch {
      setGyroEnabled(false);
    }
  }, [reduceMotion]);

  const handleDraw = useCallback(() => {
    if (step === "shuffle") return;
    void requestGyro();
    setStep("shuffle");
    window.setTimeout(() => {
      const allowReversed = getTarotAllowReversed();
      const seed = Math.floor(
        (typeof performance !== "undefined" ? performance.now() : 0) + Date.now(),
      );
      const spreadType: SpreadKind = "daily";
      const cards = getRandomDraw(seed, spreadType, { allowReversed });
      const first = cards[0];
      if (!first) {
        setStep("idle");
        return;
      }
      setDrawn(first);
      setStep("draw");
      const summary = `${first.card.nameZh}${first.upright ? "正位" : "逆位"}`;
      addTarotSacredReading({
        tool: "tarot",
        question: "今日指引",
        summary: `神谕卡 · 降维场 · ${summary}`,
        detail: {
          variant: "oracle",
          layout: "dimensional_altar",
          cards: cards.map((c) => ({ name: c.card.nameZh, upright: c.upright })),
        },
      });
      try {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(14);
        }
      } catch {
        /* ignore */
      }
    }, 1500);
  }, [requestGyro, step]);

  const handleReset = useCallback(() => {
    setDrawn(null);
    setStep("idle");
  }, []);

  const onRootPointerDown = (e: React.PointerEvent) => {
    spawnRipple(e.clientX, e.clientY);
  };

  const verticalTitle =
    step === "draw" && drawn
      ? drawn.card.nameZh
      : step === "shuffle"
        ? "理牌"
        : "待启";

  const imageLine = step === "draw" && drawn ? imageKeywordsLine(drawn.card) : "";
  const verdict =
    step === "draw" && drawn ? verdictLine(drawn.card, drawn.upright) : "\u00a0";

  const practice =
    step === "draw" && drawn
      ? lineOfPractice(drawn.card, drawn.upright)
      : step === "shuffle"
        ? "行法：静心片刻，待理牌落定。"
        : "行法：近此浮现。";

  const seq = step === "draw" && drawn ? sequenceNo(drawn.card) : "---";
  const holoNum =
    step === "draw" && drawn
      ? cardDisplayNumber(drawn.card) > 0
        ? String(cardDisplayNumber(drawn.card)).padStart(2, "0")
        : "·"
      : step === "shuffle"
        ? "·"
        : "○";

  const rootMod =
    step === "idle" ? "oda-root--idle" : step === "draw" ? "oda-root--draw" : "oda-root--shuffle";

  return (
    <div
      ref={rootRef}
      className={`oda-root ${rootMod}`}
      style={
        {
          "--oda-px": px,
          "--oda-py": py,
          "--oda-bottom": bottomUi,
          "--oda-blur-extra": `${blurExtra}px`,
        } as React.CSSProperties
      }
      onPointerDown={onRootPointerDown}
    >
      <Link className="oda-classic-link" href="/tarot?oracle=1&classic=1">
        经典双栏
      </Link>

      <div className="oda-field-wrap" aria-hidden>
        <div className="oda-field-fallback" />
        <OracleAmberOilBackground className="oda-amber-oil" />
      </div>

      <p className="oda-mast">
        <span className="oda-mast-k">降维投影</span>
        <span className="oda-mast-dot" aria-hidden>
          ·
        </span>
        <span className="oda-mast-k">密序场</span>
        <span className="oda-mast-dot" aria-hidden>
          ·
        </span>
        <span className="oda-mast-k">单张今日</span>
      </p>

      {step === "idle" ? (
        <p className="oda-whisper">
          此场无框，只余光与影。
          <br />
          向心一封，可执一行。
        </p>
      ) : step === "shuffle" ? (
        <p className="oda-whisper oda-whisper--mute">理牌中，场域暂敛。</p>
      ) : null}

      <div className="oda-ripples" aria-hidden>
        {ripples.map((r) => (
          <div key={r.id} className="oda-ripple" style={{ left: r.x, top: r.y }} />
        ))}
      </div>

      <p className="oda-seq" aria-live="polite">
        {step === "draw" && drawn ? (
          <>
            № <span className="oda-seq-num">{seq}</span>
          </>
        ) : (
          <>
            密序 <span className="oda-seq-num">· 待启封</span>
          </>
        )}
      </p>

      <h2 className="oda-orbit-title">
        {verticalTitle}
      </h2>

      <div className={`oda-orbit-stack ${step === "draw" ? "oda-orbit-stack--on" : ""}`}>
        {step === "draw" ? <p className="oda-orbit-image">{imageLine}</p> : null}
        <p className={`oda-orbit-verdict ${step === "draw" ? "" : "oda-orbit-verdict--mute"}`}>{verdict}</p>
      </div>

      <div className="oda-nexus" aria-hidden={false}>
        <div className="oda-nexus-shadow" />
        <div className="oda-nexus-inner">
          <svg
            className={`oda-ring-svg ${ringFlash ? "oda-ring-flash" : ""}`}
            viewBox="0 0 200 200"
            aria-hidden
          >
            <circle
              className="oda-ring-stroke"
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="rgba(118, 88, 52, 0.78)"
              strokeWidth="0.55"
              strokeDasharray="2 8"
            />
          </svg>
          <div className="oda-hex-glass">
            <span className="oda-holo-num" aria-hidden>
              {holoNum}
            </span>
            {step === "idle" ? (
              <span className="oda-core-cue" aria-hidden>
                轻触
                <wbr />
                天心
              </span>
            ) : null}
            <button
              type="button"
              className="oda-core-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (step === "idle") handleDraw();
              }}
              aria-label="轻触天心启封神谕"
              disabled={step === "shuffle" || step === "draw"}
              aria-disabled={step === "draw" || step === "shuffle"}
            />
          </div>
        </div>
      </div>

      {step === "shuffle" ? <p className="oda-shuffle-msg">理牌中…</p> : null}

      {step === "idle" ? (
        <details className="oda-master-bg">
          <summary className="oda-master-bg-summary">
            <span className="oda-master-bg-summary-text">
              {ORACLE_CARDS_MASTER_BACKGROUND_ZH.summaryLabel}
              <span className="oda-master-bg-summary-sep" aria-hidden>
                ·
              </span>
              <span className="oda-master-bg-summary-hint">{ORACLE_CARDS_MASTER_BACKGROUND_ZH.summaryHint}</span>
            </span>
            <span className="oda-master-bg-chev shrink-0" aria-hidden>
              ▾
            </span>
          </summary>
          <div className="oda-master-bg-body">
            {ORACLE_CARDS_MASTER_BACKGROUND_ZH.paragraphs.map((p, i) => (
              <p key={i} className="oda-master-bg-p">
                {p}
              </p>
            ))}
          </div>
        </details>
      ) : null}

      {step === "idle" ? (
        <div className="oda-gate-strip">
          <p className="oda-gate-lead">
            今日只降一封。牌名、意象与判词在<span className="oda-gate-strong">启封后</span>出现。
          </p>
          <button type="button" className="oda-gate-btn" onClick={() => handleDraw()}>
            启封神谕
          </button>
          <p className="oda-gate-sub">与点按中央六角相同</p>
        </div>
      ) : null}

      <footer className="oda-water">
        <div className="oda-water-sheen" aria-hidden />
        <div className="oda-water-line" />
        <div className="oda-water-text">
          {practice}
          <div className="oda-water-hint">
            {step === "idle" ? "指尖下移，行法自水底浮起；中央六角可启封。" : null}
            {step === "draw" ? "下移亮显，可再降一封。" : null}
          </div>
          {step === "draw" ? (
            <button
              type="button"
              className="oda-reset"
              style={{ opacity: resetReveal }}
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
            >
              再降一次
            </button>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
