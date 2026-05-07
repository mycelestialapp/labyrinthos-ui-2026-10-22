"use client";

/**
 * 雷诺曼板块 · 界面布局（对标主流 Lenormand App 分区）
 * — 上：阵式/说明横向轮播（scroll-snap）
 * — 中：牌桌工作区（牌位网格）+ 侧栏速查（人物/事件/路径 + 搜索占位）
 * — 下：固定操作条（洗牌 / 切牌 / 启牌；牌阵未就绪时按钮禁用）
 *
 * 牌面数据与抽牌逻辑后续接入；本组件只定布局与交互骨架。
 */
import { useMemo, useState } from "react";
import "./lenormand-workspace.css";
import { LENORMAND_CARDS, shuffleLenormandDeck, type LenormandCard } from "@/lib/lenormand-cards";
import { resolveLenormandReading, type LenormandSpreadId } from "@/lib/lenormand-reading-copy";

type SpreadId = "intro" | "line3" | "line5" | "box9" | "grand";

type SpreadDef = {
  id: SpreadId;
  indexLabel: string;
  name: string;
  tag: string;
  body: string;
  slotCount: number;
  gridClass: string;
  /** 若与 slot 数一致，牌格内优先显示（如三线：过去/现在/将来） */
  slotTimeLabels?: string[];
};

/** 轮播顺序：总览 → 01–04 牌阵（默认进三线，首屏即有牌位格） */
const SPREADS: SpreadDef[] = [
  {
    id: "intro",
    indexLabel: "00",
    name: "总览 · 说明",
    tag: "非牌阵 · 口径",
    body:
      "本格不含牌位，仅说明工作台分区。点选「三线」等任一牌阵后，中部出现占位格，底栏洗牌 / 启牌方可用。牌面与抽牌逻辑将后续接入。",
    slotCount: 0,
    gridClass: "",
  },
  {
    id: "line3",
    indexLabel: "01",
    name: "三线",
    tag: "过去 · 现在 · 将来",
    body: "最常见的开口阵：三张成线，看时间梯度与因果链。多数商业 App 的默认入口。",
    slotCount: 3,
    gridClass: "lenormand-slot-grid--3",
    slotTimeLabels: ["过去", "现在", "将来"],
  },
  {
    id: "line5",
    indexLabel: "02",
    name: "五线",
    tag: "纵深与旁支",
    body: "五张延展：主线 + 两侧修饰位，适合「谁—做什么—结果」类追问。",
    slotCount: 5,
    gridClass: "lenormand-slot-grid--5",
  },
  {
    id: "box9",
    indexLabel: "03",
    name: "九宫",
    tag: "局面与张力",
    body: "三乘三宫格：中心为焦点，四角与四边看关系拉扯与资源分布。",
    slotCount: 9,
    gridClass: "lenormand-slot-grid--9",
  },
  {
    id: "grand",
    indexLabel: "04",
    name: "大展",
    tag: "全景 · 将接",
    body: "经典 36 位大桌：此处用占位格模拟牌位密度；人物走位与主题牌邻接后续接入。",
    slotCount: 36,
    gridClass: "lenormand-slot-grid--gt",
  },
];

export default function LenormandWorkspace() {
  const [activeId, setActiveId] = useState<SpreadId>("line3");
  const [inquiry, setInquiry] = useState("");
  const [deck, setDeck] = useState<LenormandCard[]>(() => shuffleLenormandDeck());
  const [drawsBySpread, setDrawsBySpread] = useState<Partial<Record<SpreadId, LenormandCard[]>>>({});
  const [actionHint, setActionHint] = useState("等待启牌");
  const [searchTerm, setSearchTerm] = useState("");
  const active = useMemo(() => SPREADS.find((s) => s.id === activeId) ?? SPREADS[1]!, [activeId]);
  const deckReady = activeId !== "intro";
  const activeDraws = drawsBySpread[activeId] ?? [];

  const filteredCards = useMemo(() => {
    const q = searchTerm.trim();
    if (!q) return LENORMAND_CARDS.slice(0, 8);
    return LENORMAND_CARDS.filter((c) => c.nameZh.includes(q) || c.shortMeaning.includes(q)).slice(0, 8);
  }, [searchTerm]);

  const handleShuffle = () => {
    setDeck(shuffleLenormandDeck());
    setDrawsBySpread({});
    setActionHint("已洗牌：牌序重置，等待启牌");
  };

  const handleCut = () => {
    if (!deckReady) return;
    if (deck.length < 2) {
      setDeck(shuffleLenormandDeck());
      setActionHint("牌堆过浅，已自动重洗");
      return;
    }
    const cutAt = Math.max(1, Math.min(deck.length - 1, Math.floor(Math.random() * deck.length)));
    const nextDeck = [...deck.slice(cutAt), ...deck.slice(0, cutAt)];
    setDeck(nextDeck);
    setActionHint(`已切牌：切点 ${cutAt} / ${deck.length}`);
  };

  const handleReveal = () => {
    if (!deckReady) return;
    const need = active.slotCount;
    if (need <= 0) return;

    const working = deck.length >= need ? [...deck] : shuffleLenormandDeck();
    const drawn = working.slice(0, need);
    const remain = working.slice(need);

    setDeck(remain);
    setDrawsBySpread((prev) => ({ ...prev, [activeId]: drawn }));
    setActionHint(
      `已启牌：${active.name} ${drawn
        .map((c) => `${c.symbol}${c.nameZh}`)
        .slice(0, activeId === "grand" ? 4 : drawn.length)
        .join(" / ")}${activeId === "grand" ? " ..." : ""}`,
    );
  };

  return (
    <div className="lenormand-workspace">
      <div className="lenormand-workspace__title-block">
        <p className="text-[10px] tracking-[0.32em] text-[#c5a059]/90">LENORMAND</p>
        <h1 className="lenormand-workspace__title">雷诺曼</h1>
        <p className="lenormand-workspace__subtitle">牌阵 · 牌解 · 进阶</p>
        <p className="mx-auto mt-2 max-w-2xl px-2 text-center text-[0.62rem] leading-relaxed text-[rgba(232,220,196,0.38)]">
          内容仅供自我参照，不构成医疗、法律或专业心理咨询意见。
        </p>
        <p className="lenormand-workspace__hint">
          默认打开「三线」占位牌桌；横向滑动可切到总览说明、五线、九宫或大展。侧栏为牌义速查占位；底栏洗牌 / 启牌在选定牌阵后可用（牌库接入前为布局演示）。
        </p>
      </div>

      <div className="mx-auto mb-5 w-full max-w-xl min-w-0 px-1">
        <label
          htmlFor="lenormand-inquiry"
          className="mb-1.5 block text-[0.65rem] tracking-[0.2em] text-[rgba(197,160,89,0.55)]"
        >
          问事（选填）
        </label>
        <textarea
          id="lenormand-inquiry"
          rows={2}
          className="w-full min-w-0 resize-y rounded-lg border border-[rgba(197,160,89,0.22)] bg-[rgba(0,0,0,0.28)] px-3 py-2 text-[0.72rem] leading-relaxed text-[#e8dcc4] outline-none ring-[#c5a059]/30 placeholder:text-[rgba(232,220,196,0.32)] focus:border-[rgba(197,160,89,0.45)] focus:ring-1"
          placeholder="例如：接下来三个月工作变动会怎样？"
          value={inquiry}
          onChange={(e) => setInquiry(e.target.value)}
          autoComplete="off"
        />
      </div>

      <section aria-label="牌阵与说明">
        <div className="lenormand-carousel" role="tablist" aria-label="牌阵选择">
          {SPREADS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={activeId === s.id}
              className={`lenormand-carousel-card ${activeId === s.id ? "lenormand-carousel-card--active" : ""}`}
              onClick={() => setActiveId(s.id)}
            >
              <span className="lenormand-carousel-card__corner" aria-hidden>
                {s.indexLabel}
              </span>
              <div className="lenormand-carousel-card__icon" aria-hidden>
                ◆
              </div>
              <div className="lenormand-carousel-card__name">{s.name}</div>
              <div className="lenormand-carousel-card__tag">{s.tag}</div>
              <p className="lenormand-carousel-card__body">{s.body}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="lenormand-main-grid">
        <section className="space-y-3" aria-labelledby="lenormand-table-heading">
          <h2 id="lenormand-table-heading" className="lenormand-table-panel__label">
            牌阵 · {active.name}
            <span className="ml-2 text-[rgba(232,220,196,0.35)]">
              · 余牌 {deck.length}
              {` · 已上桌 ${activeDraws.length || 0}/${active.slotCount} 张`}
            </span>
          </h2>
          <p className="mb-1 text-[0.64rem] tracking-[0.06em] text-[rgba(232,220,196,0.45)]">
            动作：{actionHint}
            {inquiry.trim() ? ` · 问事：${inquiry.trim().slice(0, 26)}${inquiry.trim().length > 26 ? "..." : ""}` : ""}
          </p>
          {[active].map((spread) => {
            const draws = drawsBySpread[spread.id] ?? [];
            const canRead =
              (spread.id === "line3" && draws.length >= 3) ||
              (spread.id === "line5" && draws.length >= 5) ||
              (spread.id === "box9" && draws.length >= 9) ||
              (spread.id === "grand" && draws.length >= 36);
            const reading =
              canRead && spread.id !== "intro"
                ? resolveLenormandReading({
                    spreadId: spread.id as LenormandSpreadId,
                    cards: draws,
                    inquiry,
                  })
                : null;
            return (
              <article key={spread.id} className="lenormand-table-panel">
                <h3 className="lenormand-table-panel__label">
                  {spread.indexLabel} · {spread.name}
                  <span className="ml-2 text-[rgba(232,220,196,0.35)]">
                    ({draws.length}/{spread.slotCount})
                  </span>
                </h3>
                <div className={`lenormand-slot-grid ${spread.gridClass}`}>
                  {Array.from({ length: spread.slotCount }, (_, i) => {
                    const card = draws[i];
                    const positionNo = i + 1;
                    return (
                      <div key={i} className="lenormand-slot">
                        {spread.slotTimeLabels?.[i] ? <span className="lenormand-slot__time">{spread.slotTimeLabels[i]}</span> : null}
                        {card ? (
                          <div className="lenormand-slot__card">
                            <span className="lenormand-slot__symbol" aria-hidden>
                              {card.symbol}
                            </span>
                            <span className="lenormand-slot__name">
                              {card.nameZh} · {card.id}
                            </span>
                            {spread.id === "grand" ? null : <span className="lenormand-slot__meaning">{card.shortMeaning}</span>}
                          </div>
                        ) : (
                          <span>{spread.id === "grand" ? String(positionNo) : `位 ${positionNo}`}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {reading ? (
                  <div className="mt-4 rounded-lg border border-[rgba(197,160,89,0.22)] bg-[rgba(0,0,0,0.2)] p-3">
                    <h4 className="text-[0.68rem] tracking-[0.16em] text-[rgba(197,160,89,0.88)]">故事解读</h4>
                    <p className="mt-2 whitespace-pre-wrap break-words text-[0.68rem] leading-relaxed text-[rgba(232,220,196,0.86)]">
                      {reading.text}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        <aside className="lenormand-aside" aria-label="速查与图例">
          <h3 className="lenormand-aside__title">牌义速查</h3>
          <p className="mb-3 text-[0.68rem] leading-relaxed text-[rgba(232,220,196,0.5)]">可按牌名或关键词搜索，最多显示 8 条。</p>
          <div className="lenormand-legend-row">
            <span className="lenormand-dot lenormand-dot--person" aria-hidden />
            <span>人物类（谁在场）</span>
          </div>
          <div className="lenormand-legend-row">
            <span className="lenormand-dot lenormand-dot--event" aria-hidden />
            <span>事件类（发生何事）</span>
          </div>
          <div className="lenormand-legend-row">
            <span className="lenormand-dot lenormand-dot--path" aria-hidden />
            <span>路径类（如何抵达）</span>
          </div>
          <input
            type="search"
            className="lenormand-aside__search"
            placeholder="搜索牌名…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          <div className="mt-3 space-y-1">
            {filteredCards.map((card) => (
              <div key={card.id} className="text-[0.62rem] leading-relaxed text-[rgba(232,220,196,0.58)]">
                {card.symbol} {card.id}. {card.nameZh} - {card.shortMeaning}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="lenormand-dock" role="toolbar" aria-label="牌组操作">
        <button
          type="button"
          className="lenormand-dock-btn"
          onClick={handleShuffle}
          disabled={!deckReady}
          title={!deckReady ? "请先选择牌阵" : undefined}
        >
          洗牌
        </button>
        <button type="button" className="lenormand-dock-btn" onClick={handleCut} disabled={!deckReady}>
          切牌
        </button>
        <button
          type="button"
          className={`lenormand-dock-btn lenormand-dock-btn--primary`}
          onClick={handleReveal}
          disabled={!deckReady}
        >
          启牌
        </button>
      </div>
    </div>
  );
}
