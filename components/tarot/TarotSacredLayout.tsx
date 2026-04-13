"use client";

/**
 * 塔罗「圣殿」全屏布局：自 Dmy-projects TarotSacred 迁入；
 * 图标用 lucide；抽牌用 tarot-cards-sacred（繁体牌名与长文牌义）。
 */
import { useCallback, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import {
  ArrowDown,
  BookOpen,
  Building2,
  Car,
  CircleDot,
  Coins,
  Crown,
  Droplets,
  Feather,
  Flame,
  Globe2,
  Heart,
  Lamp,
  type LucideIcon,
  Megaphone,
  Moon,
  Scale,
  Skull,
  Sparkles,
  Star,
  Sun,
  UserRound,
  Volume2,
  VolumeX,
  Wind,
  Wand2,
} from "lucide-react";
import { getRandomDraw, type TarotCardEntry } from "@/lib/tarot-cards-sacred";
import { getTarotAllowReversed } from "@/lib/tarot-sacred-settings";
import { addTarotSacredReading } from "@/lib/tarot-sacred-history";
import "./tarot-sacred.css";

const SUIT_ICONS: Record<string, LucideIcon> = {
  major: Star,
  wands: Flame,
  cups: Droplets,
  swords: Wind,
  pentacles: Coins,
};

const MAJOR_ICONS: Record<string, LucideIcon> = {
  愚者: UserRound,
  魔術師: Wand2,
  女祭司: Moon,
  皇后: Crown,
  皇帝: Crown,
  教皇: BookOpen,
  戀人: Heart,
  戰車: Car,
  力量: Sparkles,
  隱者: Lamp,
  命運之輪: CircleDot,
  正義: Scale,
  倒吊人: ArrowDown,
  死神: Skull,
  節制: Droplets,
  惡魔: Flame,
  高塔: Building2,
  星星: Star,
  月亮: Moon,
  太陽: Sun,
  審判: Megaphone,
  世界: Globe2,
};

const SUIT_ZH: Record<string, string> = {
  major: "大阿卡纳",
  wands: "权杖",
  cups: "圣杯",
  swords: "宝剑",
  pentacles: "星币",
};

type SpreadType = "single" | "three";
type DrawnCard = { card: TarotCardEntry; upright: boolean };

function cardDisplayNumber(card: TarotCardEntry): number {
  const m = /^major_(\d+)$/.exec(card.id);
  if (m) return Number(m[1]);
  return 0;
}

function getCardMeaning(card: TarotCardEntry, upright: boolean): string {
  const raw = upright ? card.upright : card.reversed;
  if (typeof raw === "string") {
    const t = raw.replace(/\s+/g, " ").trim();
    return t.length > 200 ? `${t.slice(0, 200)}…` : t;
  }
  return upright ? "积极面向" : "内在挑战";
}

function CardGlyph({ card }: { card: TarotCardEntry }) {
  const Icon =
    card.suit === "major"
      ? (MAJOR_ICONS[card.nameZh] ?? Star)
      : (SUIT_ICONS[card.suit] ?? Star);
  return <Icon className="h-10 w-10" strokeWidth={1.2} aria-hidden focusable="false" />;
}

export default function TarotSacredLayout() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [spreadType, setSpreadType] = useState<SpreadType>("single");
  const [drawn, setDrawn] = useState<DrawnCard[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const bgIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const cosmicBgRef = useRef<HTMLDivElement>(null);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    setSoundEnabled(true);
  }, []);

  const playPureTone = useCallback(
    (freq: number, duration: number, gainValue = 0.1, type: OscillatorType = "sine") => {
      const ctx = audioCtxRef.current;
      if (!ctx || !soundEnabled || ctx.state !== "running") return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gainValue, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.1);
    },
    [soundEnabled],
  );

  const playWelcomeMusic = useCallback(() => {
    if (!audioCtxRef.current || !soundEnabled) return;
    playPureTone(220, 2.0, 0.06);
    setTimeout(() => playPureTone(330, 1.8, 0.05), 200);
    setTimeout(() => playPureTone(440, 1.5, 0.04), 400);
    setTimeout(() => playPureTone(550, 1.2, 0.03), 600);
  }, [soundEnabled, playPureTone]);

  const playHarpSound = useCallback(() => {
    if (!audioCtxRef.current || !soundEnabled) return;
    playPureTone(600, 0.25, 0.08);
    setTimeout(() => playPureTone(750, 0.2, 0.06), 50);
  }, [soundEnabled, playPureTone]);

  const playCardSound = useCallback(
    (freq: number) => {
      if (!audioCtxRef.current || !soundEnabled) return;
      playPureTone(freq, 0.3, 0.07);
      setTimeout(() => playPureTone(freq * 1.2, 0.4, 0.05), 100);
    },
    [soundEnabled, playPureTone],
  );

  const stopAmbient = useCallback(() => {
    if (bgIntervalRef.current) {
      clearInterval(bgIntervalRef.current);
      bgIntervalRef.current = null;
    }
  }, []);

  const startAmbient = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || !soundEnabled) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 80;
    const gain = ctx.createGain();
    gain.gain.value = 0.015;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    bgIntervalRef.current = setInterval(() => {
      if (!soundEnabled) return;
      const newOsc = ctx.createOscillator();
      newOsc.type = "sine";
      newOsc.frequency.value = 80;
      newOsc.connect(gain);
      newOsc.start();
      newOsc.stop(ctx.currentTime + 30);
    }, 28000);
  }, [soundEnabled]);

  const handleWake = useCallback(() => {
    if (!audioCtxRef.current) {
      initAudio();
      setSoundEnabled(true);
      setTimeout(() => {
        playWelcomeMusic();
        startAmbient();
      }, 100);
    } else {
      const newEnabled = !soundEnabled;
      setSoundEnabled(newEnabled);
      if (newEnabled) {
        if (audioCtxRef.current.state === "suspended") void audioCtxRef.current.resume();
        playWelcomeMusic();
        startAmbient();
      } else {
        stopAmbient();
      }
    }
  }, [soundEnabled, initAudio, playWelcomeMusic, startAmbient, stopAmbient]);

  const handleSplashClick = useCallback(() => {
    handleWake();
    setSplashVisible(false);
    setTimeout(() => setMainVisible(true), 100);
  }, [handleWake]);

  const spawnParticles = useCallback((x: number, y: number, count = 30) => {
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
      const s = 6 + Math.random() * 8;
      p.style.width = `${s}px`;
      p.style.height = `${s}px`;
      container.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  }, []);

  const handleDraw = useCallback(() => {
    playHarpSound();
    const allowReversed = getTarotAllowReversed();
    const seed = Math.floor(
      (typeof performance !== "undefined" ? performance.now() : 0) + Date.now(),
    );
    const cards = getRandomDraw(seed, spreadType === "single" ? "daily" : "three", {
      allowReversed,
    });
    setDrawn(cards);
    setSelectedIndex(null);

    const question = spreadType === "single" ? "今日指引" : "时间之流";
    const summary = cards.map((c) => `${c.card.nameZh}${c.upright ? "正位" : "逆位"}`).join(" · ");
    addTarotSacredReading({
      tool: "tarot",
      question,
      summary: `塔罗 · ${summary}`,
      detail: { cards: cards.map((c) => ({ name: c.card.nameZh, upright: c.upright })) },
    });
  }, [spreadType, playHarpSound]);

  const activateDrawnCard = useCallback(
    (index: number, el: HTMLElement) => {
      if (!drawn) return;
      setSelectedIndex(index);
      const rect = el.getBoundingClientRect();
      spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
      const card = drawn[index]!.card;
      const n = cardDisplayNumber(card);
      playCardSound(400 + n * 5);

      if (cosmicBgRef.current) {
        if (card.nameZh === "皇后" || card.nameZh === "女皇") {
          cosmicBgRef.current.style.backgroundColor = "rgba(230,170,100,0.2)";
        } else if (card.nameZh === "星星") {
          cosmicBgRef.current.style.backgroundColor = "rgba(130,150,210,0.2)";
        } else {
          cosmicBgRef.current.style.backgroundColor = "transparent";
        }
      }
    },
    [drawn, spawnParticles, playCardSound],
  );

  const positions = spreadType === "single" ? ["今日指引"] : ["过去", "现在", "未来"];

  return (
    <div className="tarot-sacred-root">
      <div className="cosmic-bg" ref={cosmicBgRef}>
        <div className="nebula-1" />
        <div className="nebula-2" />
        <div className="stars" />
      </div>

      <div
        className={`splash-screen ${!splashVisible ? "hidden" : ""}`}
        style={{ display: splashVisible ? "flex" : "none" }}
      >
        <div className="splash-content">
          <div className="splash-logo">78 秘仪</div>
          <div className="splash-sub">完整塔罗 · 圣殿唤醒</div>
          <button type="button" className="splash-hint" onClick={handleSplashClick}>
            <Volume2 className="inline-block h-4 w-4 align-[-2px]" aria-hidden />
            点击开启音效与动画
          </button>
        </div>
      </div>

      <div className={`oracle-chamber ${mainVisible ? "visible" : ""}`}>
        <div className="title-domain">
          <div className="arcane-line">完整塔罗 · 78 张</div>
          <div className="arcane-sub">大阿卡纳 + 四元素小牌</div>
        </div>

        <div className="control-panel">
          <div className="spread-selector">
            <div
              role="button"
              tabIndex={0}
              className={`spread-option ${spreadType === "single" ? "active" : ""}`}
              onClick={() => {
                setSpreadType("single");
                setDrawn(null);
                setSelectedIndex(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSpreadType("single");
                  setDrawn(null);
                  setSelectedIndex(null);
                }
              }}
            >
              单张 · 今日指引
            </div>
            <div
              role="button"
              tabIndex={0}
              className={`spread-option ${spreadType === "three" ? "active" : ""}`}
              onClick={() => {
                setSpreadType("three");
                setDrawn(null);
                setSelectedIndex(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSpreadType("three");
                  setDrawn(null);
                  setSelectedIndex(null);
                }
              }}
            >
              三张 · 时间之流
            </div>
          </div>
          <button type="button" className="draw-btn" onClick={handleDraw}>
            <Sparkles className="h-5 w-5 shrink-0" aria-hidden />
            抽牌 · 占卜
          </button>
        </div>

        <div className="spread-area">
          {drawn
            ? drawn.map((item, idx) => (
                <div key={`${item.card.id}-${idx}`} className="card-slot filled">
                  <div className="slot-label">{positions[idx]}</div>
                  <div
                    role="button"
                    tabIndex={0}
                    className={`slot-card ${!item.upright ? "reversed" : ""} ${selectedIndex === idx ? "selected" : ""}`}
                    onClick={(e: MouseEvent<HTMLDivElement>) => activateDrawnCard(idx, e.currentTarget)}
                    onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        activateDrawnCard(idx, e.currentTarget);
                      }
                    }}
                  >
                    <div className="slot-card-icon">
                      <CardGlyph card={item.card} />
                    </div>
                    <div className="slot-card-name">{item.card.nameZh}</div>
                    <div className="slot-card-suit">
                      {SUIT_ZH[item.card.suit] ?? item.card.suit} · {item.upright ? "正位" : "逆位"}
                    </div>
                  </div>
                </div>
              ))
            : positions.map((label) => (
                <div key={label} className="card-slot">
                  <div className="slot-label">{label}</div>
                  <div className="slot-card" style={{ opacity: 0.5, cursor: "default" }}>
                    <div className="slot-card-icon">?</div>
                    <div className="slot-card-name">等待抽牌</div>
                  </div>
                </div>
              ))}
        </div>

        <div className="reading-panel">
          <div className="spread-interpretation">
            <div className="section-title">
              <Sparkles className="h-6 w-6 shrink-0 text-[#f5c84e]" aria-hidden />
              牌阵解读
            </div>
            <div className="spread-summary">
              {drawn
                ? spreadType === "single"
                  ? `单张牌揭示今日核心意象：${drawn[0]!.card.nameZh}${drawn[0]!.upright ? "正位" : "逆位"}。`
                  : `三张牌串联时间流：过去—${drawn[0]!.card.nameZh}，现在—${drawn[1]?.card.nameZh}，未来—${drawn[2]?.card.nameZh}。`
                : "点击下方抽牌，开始占卜"}
            </div>
            <div className="card-meanings">
              {drawn &&
                drawn.map((item, idx) => (
                  <div
                    key={`m-${item.card.id}-${idx}`}
                    className="meaning-item"
                    style={{ animationDelay: `${0.1 + idx * 0.2}s` }}
                  >
                    <div className="meaning-position">{positions[idx]}</div>
                    <div className="meaning-text">
                      <span className="highlight">{item.card.nameZh}</span> —{" "}
                      {getCardMeaning(item.card, item.upright)}
                    </div>
                  </div>
                ))}
            </div>
            {drawn && (
              <div className="action-card">
                <div className="action-number">{cardDisplayNumber(drawn[0]!.card)}</div>
                <div className="action-text">
                  <span className="flex items-center gap-2 text-[#f2e1ba]">
                    <Feather className="h-4 w-4 text-[#f5c84e]" aria-hidden />
                    今日行动 · {drawn[0]!.upright ? "勇敢前行" : "静心反思"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="card-detail-panel">
            <div className="section-title">
              <Star className="h-6 w-6 shrink-0 text-[#f5c84e]" aria-hidden />
              单牌详解
            </div>
            <div>
              {selectedIndex !== null && drawn ? (
                <>
                  <div className="detail-name">{drawn[selectedIndex]!.card.nameZh}</div>
                  <div className="detail-status">
                    {drawn[selectedIndex]!.upright ? "正位" : "逆位"}
                  </div>
                  <div className="detail-desc">
                    {getCardMeaning(drawn[selectedIndex]!.card, drawn[selectedIndex]!.upright)
                      .split(/[、。；]/)
                      .filter(Boolean)
                      .map((line, i) => (
                        <span key={i} className="desc-line" style={{ animationDelay: `${i * 0.1}s` }}>
                          · {line}
                        </span>
                      ))}
                  </div>
                </>
              ) : (
                <span style={{ color: "#d3c7b0" }}>点击任意一张牌查看摘录</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <button type="button" className="sound-toggle" onClick={handleWake}>
        {soundEnabled ? (
          <Volume2 className="mr-1 inline-block h-4 w-4 align-[-2px]" aria-hidden />
        ) : (
          <VolumeX className="mr-1 inline-block h-4 w-4 align-[-2px]" aria-hidden />
        )}
        {soundEnabled ? "音效开" : "唤醒音效"}
      </button>

      <div className="particle-container" ref={particleContainerRef} />
    </div>
  );
}
