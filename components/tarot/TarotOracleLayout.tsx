"use client";

/**
 * Dmy-projects `TarotPanelOracle`：原版 HTML 宇宙背景 + 洗牌节拍 + 双栏解读（无开机全屏与音效）。
 * 抽牌数据：`tarot-cards-sacred`；`getRandomDraw` 第一参为数字种子（修正原项目误传 spread 的用法）。
 */
import { useCallback, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  getRandomDraw,
  type SpreadKind,
  type TarotCardEntry,
} from "@/lib/tarot-cards-sacred";
import { getTarotAllowReversed } from "@/lib/tarot-sacred-settings";
import { addTarotSacredReading } from "@/lib/tarot-sacred-history";
import "./tarot-oracle.css";
import "./oracle-workspace.css";

const SUIT_ICONS: Record<string, string> = {
  major: "✦",
  wands: "🔥",
  cups: "💧",
  swords: "⚔",
  pentacles: "🪙",
};

const SUIT_ZH: Record<string, string> = {
  major: "大阿卡纳",
  wands: "权杖",
  cups: "圣杯",
  swords: "宝剑",
  pentacles: "星币",
};

/** 大阿卡纳短义（与 Dmy 一致；牌库为繁体牌名） */
const MEANING_DATABASE: Record<string, { upright: string; reversed: string }> = {
  愚者: { upright: "新的开始、纯真、冒险、自由", reversed: "鲁莽、犹豫、不负责" },
  魔術師: { upright: "创造力、技能、意志、显化", reversed: "欺骗、才能未用" },
  女祭司: { upright: "直觉、潜意识、神秘、内在智慧", reversed: "表面、压抑直觉" },
  女皇: { upright: "丰盛、母性、自然、感官享受", reversed: "依赖、创造受阻" },
  皇后: { upright: "丰盛、母性、自然、感官享受", reversed: "依赖、创造受阻" },
  皇帝: { upright: "权威、结构、父亲形象、稳定", reversed: "专制、失控" },
  教皇: { upright: "传统、信仰、教导、遵从", reversed: "叛逆、个人信仰" },
  戀人: { upright: "爱情、选择、结合、价值观", reversed: "分歧、错误选择" },
  戰車: { upright: "意志力、胜利、控制、方向", reversed: "失控、冲突" },
  力量: { upright: "内在力量、勇气、耐心、慈悲", reversed: "软弱、滥用力量" },
  隱者: { upright: "内省、指引、独处、智慧", reversed: "孤独、逃避" },
  命運之輪: { upright: "转变、机遇、命运、循环", reversed: "抗拒变化、厄运" },
  正義: { upright: "公正、平衡、因果、法律", reversed: "不公、偏见" },
  倒吊人: { upright: "臣服、新视角、牺牲、暂停", reversed: "拖延、抗拒" },
  死神: { upright: "结束、新生、蜕变、放下", reversed: "抗拒改变、停滞" },
  節制: { upright: "平衡、调和、耐心、中庸", reversed: "失衡、极端" },
  惡魔: { upright: "束缚、欲望、物质、沉迷", reversed: "解放、摆脱控制" },
  高塔: { upright: "剧变、崩塌、觉醒、真相", reversed: "避免灾难、抗拒改变" },
  星星: { upright: "希望、疗愈、灵感、平静", reversed: "失望、缺乏信心" },
  月亮: { upright: "幻觉、恐惧、潜意识、直觉", reversed: "拨开迷雾、面对恐惧" },
  太陽: { upright: "成功、喜悦、活力、积极", reversed: "沮丧、能量低" },
  審判: { upright: "觉醒、召唤、宽恕、重生", reversed: "自我怀疑、拒绝召唤" },
  世界: { upright: "完成、成就、整合、圆满", reversed: "未完成、停滞" },
};

function cardDisplayNumber(card: TarotCardEntry): number {
  const m = /^major_(\d+)$/.exec(card.id);
  if (m) return Number(m[1]);
  return 0;
}

function getCardMeaning(card: TarotCardEntry, isReversed: boolean): string {
  if (card.suit === "major") {
    const meanings = MEANING_DATABASE[card.nameZh] ?? {
      upright: "积极发展",
      reversed: "内在挑战",
    };
    return isReversed ? meanings.reversed : meanings.upright;
  }
  const sz = SUIT_ZH[card.suit] ?? card.suit;
  return `${sz} · ${card.nameZh} 代表 ${isReversed ? "阻碍 / 内在反思" : "进展 / 机遇"}`;
}

export default function TarotOracleLayout({ hideDuplicateTitle = false }: { hideDuplicateTitle?: boolean }) {
  const [spreadType, setSpreadType] = useState<SpreadKind>("daily");
  const [step, setStep] = useState<"choose" | "shuffling" | "draw">("choose");
  const [drawn, setDrawn] = useState<{ card: TarotCardEntry; upright: boolean }[] | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
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
      setSelectedCardIndex(null);
      setStep("draw");

      const question = spreadType === "daily" ? "今日指引" : "时间之流";
      const summary = cards.map((c) => `${c.card.nameZh}${c.upright ? "正位" : "逆位"}`).join(" · ");
      addTarotSacredReading({
        tool: "tarot",
        question,
        summary: `神谕卡 · ${summary}`,
        detail: { variant: "oracle", cards: cards.map((c) => ({ name: c.card.nameZh, upright: c.upright })) },
      });
    }, 1500);
  }, [spreadType]);

  const handleReset = useCallback(() => {
    setStep("choose");
    setDrawn(null);
    setSelectedCardIndex(null);
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

  const positions = spreadType === "daily" ? ["今日指引"] : ["过去", "现在", "未来"];

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
        {!hideDuplicateTitle ? (
          <div className="title-domain">
            <div className="arcane-line">神谕卡</div>
            <div className="arcane-sub">每日一句，轻量参照</div>
          </div>
        ) : (
          <div className="oracle-workspace-rail mb-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-[rgba(197,160,89,0.14)] pb-3 text-center text-[10px] leading-relaxed tracking-[0.12em] text-[#b8a078]/95 sm:text-[11px] sm:tracking-[0.14em]">
            <span className="tabular-nums">①</span>
            <span>择张数</span>
            <span className="text-[#7a6a58]/80" aria-hidden>
              →
            </span>
            <span className="tabular-nums">②</span>
            <span>启封</span>
            <span className="text-[#7a6a58]/80" aria-hidden>
              →
            </span>
            <span className="tabular-nums">③</span>
            <span>读整合与摘录</span>
          </div>
        )}

        {step === "choose" && (
          <div className="control-panel">
            <div className="spread-selector">
              <div
                role="button"
                tabIndex={0}
                className={`spread-option ${spreadType === "daily" ? "active" : ""}`}
                onClick={() => setSpreadType("daily")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSpreadType("daily");
                  }
                }}
              >
                单张 · 今日指引
              </div>
              <div
                role="button"
                tabIndex={0}
                className={`spread-option ${spreadType === "three" ? "active" : ""}`}
                onClick={() => setSpreadType("three")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSpreadType("three");
                  }
                }}
              >
                三张 · 时间之流
              </div>
            </div>
            <button type="button" className="draw-btn" onClick={handleDraw}>
              <Sparkles size={20} aria-hidden />
              启封 · 请一张
            </button>
          </div>
        )}

        {step === "shuffling" && (
          <div className="control-panel">
            <p style={{ color: "#f2e1ba", fontSize: "1.2rem", letterSpacing: "4px" }}>
              理牌中，留一行空白给今天…
            </p>
          </div>
        )}

        <div className="spread-area">
          {step === "choose" &&
            positions.map((label) => (
              <div key={label} className="card-slot">
                <div className="slot-label">{label}</div>
                <div className="slot-card" style={{ opacity: 0.5, cursor: "default" }}>
                  <div className="slot-card-icon">?</div>
                  <div className="slot-card-name">等待启封</div>
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
                  className={`slot-card ${!item.upright ? "reversed" : ""} ${selectedCardIndex === idx ? "selected" : ""}`}
                  onClick={(e) => {
                    setSelectedCardIndex(idx);
                    const rect = e.currentTarget.getBoundingClientRect();
                    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      const el = e.currentTarget;
                      setSelectedCardIndex(idx);
                      const rect = el.getBoundingClientRect();
                      spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
                    }
                  }}
                >
                  <div className="slot-card-icon">{SUIT_ICONS[item.card.suit] ?? "✦"}</div>
                  <div className="slot-card-name">{item.card.nameZh}</div>
                  <div className="slot-card-suit">
                    {SUIT_ZH[item.card.suit] ?? item.card.suit} · {item.upright ? "正位" : "逆位"}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="reading-panel">
          <div className="spread-interpretation">
            <div className="section-title">
              <span aria-hidden>🔮</span>
              读数整合
            </div>

            {step === "choose" && (
              <div className="spread-summary">点「启封 · 请一张」，收一句今日意象与可执行小事；语气克制，仅作参照。</div>
            )}

            {step === "draw" && drawn && (
              <>
                <div className="spread-summary">
                  {spreadType === "daily"
                    ? `今日这一句落在：${drawn[0]!.card.nameZh}${drawn[0]!.upright ? "正位" : "逆位"}。`
                    : `三张连成一线：过去—${drawn[0]!.card.nameZh}，现在—${drawn[1]?.card.nameZh}，未来—${drawn[2]?.card.nameZh}。`}
                </div>

                <div className="card-meanings">
                  {drawn.map((item, idx) => (
                    <div key={`meaning-${item.card.id}-${idx}`} className="meaning-item">
                      <div className="meaning-position">{positions[idx]}</div>
                      <div className="meaning-text">
                        <span className="highlight">{item.card.nameZh}</span> —{" "}
                        {getCardMeaning(item.card, !item.upright)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="action-card">
                  <div className="action-number">{cardDisplayNumber(drawn[0]!.card)}</div>
                  <div className="action-text">
                    <span>✦ 今日行动 · {drawn[0]!.upright ? "勇敢前行" : "静心反思"}</span>
                  </div>
                </div>

                <button type="button" className="draw-btn" style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }} onClick={handleReset}>
                  再请一张
                </button>
              </>
            )}
          </div>

          <div className="card-detail-panel">
            <div className="section-title">
              <span aria-hidden>⭐</span>
              单牌摘录
            </div>

            {selectedCardIndex !== null && drawn && drawn[selectedCardIndex] ? (
              <div>
                <div className="detail-name">{drawn[selectedCardIndex]!.card.nameZh}</div>
                <div className="detail-status">
                  {drawn[selectedCardIndex]!.upright ? "正位" : "逆位"}
                </div>
                <div className="detail-desc">
                  {getCardMeaning(drawn[selectedCardIndex]!.card, !drawn[selectedCardIndex]!.upright)
                    .split("、")
                    .map((line, i) => (
                      <span key={i} className="desc-line" style={{ animationDelay: `${i * 0.1}s` }}>
                        · {line}
                      </span>
                    ))}
                </div>
              </div>
            ) : (
              <div style={{ color: "#d3c7b0" }}>点选左侧任意一张，读此栏关键词与情绪向度</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
