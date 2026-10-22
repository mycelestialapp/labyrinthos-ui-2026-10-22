"use client";

/**
 * 神谕卡坛面：宇宙背景 + 启封序动 + 双栏解读（`/oracle` 默认；无开机全屏与音效）。
 * 启封数据来自神谕笺库（`getRandomDraw` 数字种子）。
 * 全部中文界面与短句见 `@/lib/tarot-oracle-layout-copy-zh` 与 `public/data/tarot-oracle-layout-copy-zh.json`。
 */
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { getRandomDraw, type SpreadKind, type TarotCardEntry } from "@/lib/tarot-cards-sacred";
import { getTarotAllowReversed } from "@/lib/tarot-sacred-settings";
import { addTarotSacredReading } from "@/lib/tarot-sacred-history";
import {
  ORACLE_SPREAD_OPTIONS,
  TAROT_ORACLE_READING_QUESTION,
  TAROT_ORACLE_SUIT_ICONS,
  TAROT_ORACLE_SUIT_ZH,
  TAROT_ORACLE_UI,
  formatTarotOracleDeckKeywords,
  fullTarotSacredReading,
  getTarotOracleCardMeaningForOrientation,
  tarotOracleDrawButtonLabel,
  tarotOracleMastheadIntentLine,
  oracleSpreadCardCount,
  tarotOraclePositionLabels,
  tarotOracleSpreadHeadLine,
} from "@/lib/tarot-oracle-layout-copy-zh";
import "./tarot-oracle.css";
import "./oracle-workspace.css";

type OracleDrawnItem = { card: TarotCardEntry; upright: boolean };

function OracleSacredExpandBody({ item }: { item: OracleDrawnItem }) {
  const kw = formatTarotOracleDeckKeywords(item.card, item.upright);
  const orientNow = item.upright ? TAROT_ORACLE_UI.orientUpright : TAROT_ORACLE_UI.orientReversed;
  return (
    <div className="oracle-sacred-expand-inner">
      <p className="oracle-sacred-expand-segment">
        {TAROT_ORACLE_UI.expandDeckFullLead}（{orientNow}）
      </p>
      <p className="oracle-sacred-body oracle-sacred-body--full">{fullTarotSacredReading(item.card, item.upright)}</p>

      <div className="oracle-sacred-expand-dim">
        <p className="oracle-sacred-expand-segment">{TAROT_ORACLE_UI.expandDeckOtherOrientLead}</p>
        <p className="oracle-sacred-body oracle-sacred-body--full">
          {fullTarotSacredReading(item.card, !item.upright)}
        </p>
      </div>

      {kw ? (
        <div className="oracle-sacred-expand-dim">
          <p className="oracle-sacred-expand-segment">{TAROT_ORACLE_UI.expandKeywordsDeckLead}</p>
          <p className="oracle-sacred-body oracle-sacred-body--full">{kw}</p>
        </div>
      ) : null}
    </div>
  );
}

function cardDisplayNumber(card: TarotCardEntry): number {
  const m = /^major_(\d+)$/.exec(card.id);
  if (m) return Number(m[1]);
  return 0;
}

export default function TarotOracleLayout({ hideDuplicateTitle = false }: { hideDuplicateTitle?: boolean }) {
  const [spreadType, setSpreadType] = useState<SpreadKind>("daily");
  const [step, setStep] = useState<"choose" | "shuffling" | "draw">("choose");
  const [drawn, setDrawn] = useState<{ card: TarotCardEntry; upright: boolean }[] | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);

  const handleDraw = useCallback(() => {
    setStep("shuffling");
    setTimeout(() => {
      const allowReversed = getTarotAllowReversed();
      const seed = Math.floor(
        (typeof performance !== "undefined" ? performance.now() : 0) + Date.now(),
      );
      const cards = getRandomDraw(seed, spreadType, { allowReversed });
      setDrawn(cards);
      setStep("draw");

      const question = TAROT_ORACLE_READING_QUESTION[spreadType];
      const summary = cards.map((c) => `${c.card.nameZh}${c.upright ? TAROT_ORACLE_UI.orientUpright : TAROT_ORACLE_UI.orientReversed}`).join(" · ");
      addTarotSacredReading({
        tool: "oracle",
        question,
        summary: `神谕卡 · ${summary}`,
        detail: { variant: "oracle", cards: cards.map((c) => ({ name: c.card.nameZh, upright: c.upright })) },
      });
    }, 1500);
  }, [spreadType]);

  const handleReset = useCallback(() => {
    setStep("choose");
    setDrawn(null);
  }, []);

  const spawnParticles = useCallback((x: number, y: number, count = 25) => {
    const container = particleContainerRef.current;
    if (!container) return;
    for (let i = 0; i < count; i += 1) {
      const p = document.createElement("div");
      p.className = "particle";
      const angle = Math.random() * 2 * Math.PI;
      const dist = 80 + Math.random() * 120;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      p.style.setProperty("--dx", `${dx}px`);
      p.style.setProperty("--dy", `${dy}px`);
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      const s = 6 + Math.random() * 6;
      p.style.width = `${s}px`;
      p.style.height = `${s}px`;
      container.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  }, []);

  const buildReadingText = useCallback(() => {
    if (!drawn?.length) return "";
    const posLabels = tarotOraclePositionLabels(spreadType);
    const head = tarotOracleSpreadHeadLine(spreadType, drawn);
    const blocks = drawn.map((item, idx) => {
      const pos = posLabels[idx] ?? "";
      const kw = formatTarotOracleDeckKeywords(item.card, item.upright);
      const short = getTarotOracleCardMeaningForOrientation(item.card, item.upright);
      const deckFull = fullTarotSacredReading(item.card, item.upright);
      const deckOther = fullTarotSacredReading(item.card, !item.upright);
      return [
        `【${pos}】${item.card.nameZh}（${item.upright ? TAROT_ORACLE_UI.orientUpright : TAROT_ORACLE_UI.orientReversed}）`,
        kw ? `${TAROT_ORACLE_UI.keywordsHeading}：${kw}` : "",
        `读数提要：${short}`,
        `${TAROT_ORACLE_UI.copyReadingFullLead}${deckFull}`,
        `${TAROT_ORACLE_UI.copyReadingOtherOrientLead}${deckOther}`,
        "",
      ]
        .filter(Boolean)
        .join("\n");
    });
    return ["迷宫坛 · 神谕启封录", head, "", ...blocks].join("\n");
  }, [drawn, spreadType]);

  const handleCopyReading = useCallback(async () => {
    const text = buildReadingText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyHint(TAROT_ORACLE_UI.copyReadingDone);
    } catch {
      setCopyHint(TAROT_ORACLE_UI.copyReadingFail);
    }
    window.setTimeout(() => setCopyHint(null), 2400);
  }, [buildReadingText]);

  const positions = tarotOraclePositionLabels(spreadType);

  return (
    <div
      className={`tarot-oracle-root ${hideDuplicateTitle ? "oracle-workspace-skin" : ""}`}
      style={
        hideDuplicateTitle
          ? { color: "#f3e6d2" }
          : { fontFamily: "'Cormorant Garamond', serif", color: "#f3e6d2" }
      }
    >
      <div className="tarot-cosmic-bg" aria-hidden>
        <div className="tarot-nebula-1" />
        <div className="tarot-nebula-2" />
        <div className="tarot-stars" />
      </div>

      <div className="particle-container" ref={particleContainerRef} />

      <div className="oracle-chamber">
        {hideDuplicateTitle ? (
          <header className="oracle-page-masthead" aria-labelledby="oracle-masthead-title">
            <div className="oracle-page-masthead__row">
              <div className="oracle-page-masthead__rail" aria-hidden />
              <h1 id="oracle-masthead-title" className="oracle-page-masthead__seal">
                <span className="oracle-page-masthead__chip">{TAROT_ORACLE_UI.mastheadSeal1}</span>
                <span className="oracle-page-masthead__lozenge" aria-hidden>
                  ◆
                </span>
                <span className="oracle-page-masthead__chip">{TAROT_ORACLE_UI.mastheadSeal2}</span>
              </h1>
              <div className="oracle-page-masthead__rail" aria-hidden />
            </div>
            <p className="oracle-page-masthead__intent">{tarotOracleMastheadIntentLine(spreadType)}</p>
          </header>
        ) : (
          <div className="title-domain">
            <div className="arcane-line">{TAROT_ORACLE_UI.titleMain}</div>
            <div className="arcane-sub">{TAROT_ORACLE_UI.titleSub}</div>
          </div>
        )}

        {step === "choose" && (
          <div className="control-panel control-panel--oracle">
            <div className="spread-selector spread-selector--oracle-grid" role="tablist" aria-label="阵式">
              {ORACLE_SPREAD_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  role="tab"
                  aria-selected={spreadType === opt.id}
                  tabIndex={0}
                  className={`spread-option ${spreadType === opt.id ? "active" : ""}`}
                  onClick={() => setSpreadType(opt.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSpreadType(opt.id);
                    }
                  }}
                >
                  {TAROT_ORACLE_UI[opt.labelKey]}
                </div>
              ))}
            </div>
            <button type="button" className="draw-btn" onClick={handleDraw}>
              <Sparkles size={20} aria-hidden />
              {tarotOracleDrawButtonLabel(spreadType)}
            </button>
          </div>
        )}

        {step === "shuffling" && (
          <div className="control-panel">
            <p style={{ color: "#f2e1ba", fontSize: "1.2rem", letterSpacing: "4px" }}>{TAROT_ORACLE_UI.shuffleLine}</p>
          </div>
        )}

        <div
          className={[
            "oracle-workbench",
            step === "draw" && drawn ? "oracle-workbench--aside" : "",
            step === "choose" ? "oracle-workbench--pick" : "",
            positions.length === 3 ? "oracle-workbench--three-slots" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <aside className="oracle-bench-slots" aria-label="阵位笺格">
            <div
              className={[
                "spread-area spread-area--in-rail",
                positions.length === 3 ? "spread-area--three-across" : "",
                positions.length === 1 ? "spread-area--single-slot" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {step === "choose" &&
                positions.map((label) => (
                  <div key={label} className="card-slot">
                    <div className="slot-label">{label}</div>
                    <div className="slot-card" style={{ opacity: 0.5, cursor: "default" }}>
                      <div className="slot-card-icon">{TAROT_ORACLE_UI.slotWaitIcon}</div>
                      <div className="slot-card-name">{TAROT_ORACLE_UI.slotWaitName}</div>
                    </div>
                  </div>
                ))}

              {step === "draw" &&
                drawn &&
                drawn.map((item, idx) => (
                  <div key={`${item.card.id}-${idx}`} className="card-slot filled">
                    <div className="slot-label">{positions[idx]}</div>
                    <div
                      role="button"
                      tabIndex={0}
                      className={`slot-card ${!item.upright ? "reversed" : ""}`}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          const el = e.currentTarget;
                          const rect = el.getBoundingClientRect();
                          spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
                        }
                      }}
                    >
                      {item.card.image ? (
                        <div className="slot-card-thumb">
                          <Image
                            src={item.card.image}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 140px, 160px"
                            className="slot-card-thumb-img"
                          />
                        </div>
                      ) : (
                        <div className="slot-card-icon">{TAROT_ORACLE_SUIT_ICONS[item.card.suit] ?? "✦"}</div>
                      )}
                      <div className="slot-card-name">{item.card.nameZh}</div>
                      <div className="slot-card-suit">
                        {TAROT_ORACLE_SUIT_ZH[item.card.suit] ?? item.card.suit} ·{" "}
                        {item.upright ? TAROT_ORACLE_UI.orientUpright : TAROT_ORACLE_UI.orientReversed}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </aside>

          <div className="oracle-bench-main">
            {step !== "choose" ? (
            <div
              className={`spread-interpretation${
                step === "shuffling" ? " spread-interpretation--idle" : ""
              }`}
            >
            <div className="section-title">
              <span aria-hidden>🔮</span>
              {TAROT_ORACLE_UI.sectionReading}
            </div>

            {step === "draw" && drawn && (
              <>
                <div className="spread-summary">{tarotOracleSpreadHeadLine(spreadType, drawn)}</div>

                <div className="card-meanings">
                  {drawn.map((item, idx) => {
                    const kw = formatTarotOracleDeckKeywords(item.card, item.upright);
                    return (
                      <div key={`meaning-${item.card.id}-${idx}`} className="meaning-item">
                        <div className="meaning-position">{positions[idx]}</div>
                        <div className="meaning-text">
                          <span className="highlight">{item.card.nameZh}</span> —{" "}
                          {getTarotOracleCardMeaningForOrientation(item.card, item.upright)}
                        </div>
                        {kw ? (
                          <div className="meaning-keywords">
                            {TAROT_ORACLE_UI.keywordsHeading}：{kw}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <div className="oracle-sacred-section">
                  <div className="section-title oracle-sacred-section-title">
                    <span aria-hidden>📜</span>
                    {TAROT_ORACLE_UI.sectionSacred}
                  </div>
                  {drawn.map((item, idx) => (
                    <div key={`sacred-${item.card.id}-${idx}`} className="oracle-sacred-block">
                      <div className="meaning-position">{positions[idx]}</div>
                      <details className="oracle-sacred-full">
                        <summary>{TAROT_ORACLE_UI.expandFull}</summary>
                        <OracleSacredExpandBody item={item} />
                      </details>
                    </div>
                  ))}
                </div>

                {oracleSpreadCardCount(spreadType) === 1 ? (
                  <div className="action-card">
                    <div className="action-number">{cardDisplayNumber(drawn[0]!.card)}</div>
                    <div className="action-text">
                      <span>
                        {TAROT_ORACLE_UI.actionPrefix}
                        {drawn[0]!.upright ? TAROT_ORACLE_UI.actionUpright : TAROT_ORACLE_UI.actionReversed}
                      </span>
                    </div>
                  </div>
                ) : null}

                <div className="oracle-action-row">
                  {copyHint ? <p className="oracle-copy-hint">{copyHint}</p> : null}
                  <div className="oracle-action-buttons">
                    <button
                      type="button"
                      className="draw-btn draw-btn--secondary"
                      onClick={() => void handleCopyReading()}
                    >
                      {TAROT_ORACLE_UI.copyReading}
                    </button>
                    <button type="button" className="draw-btn" onClick={handleReset}>
                      {TAROT_ORACLE_UI.resetButton}
                    </button>
                  </div>
                </div>
              </>
            )}
            </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
