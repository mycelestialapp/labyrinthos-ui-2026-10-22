"use client";

/**
 * 雷诺曼工作台：正统 Petit Lenormand 没有正逆位。
 * 牌面一律正向；解读走相邻连读，不旋转牌图。
 */
import { useMemo, useState } from "react";
import "./lenormand-workspace.css";
import { LENORMAND_CARDS, shuffleLenormandDeck, type LenormandCard } from "@/lib/lenormand-cards";
import { getLenormandLexicon } from "@/lib/lenormand-card-lexicon-zh";
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
  slotTimeLabels?: string[];
};

const SPREADS: SpreadDef[] = [
  {
    id: "intro",
    indexLabel: "00",
    name: "总览 · 说明",
    tag: "非牌阵 · 单面",
    body:
      "正统 Petit Lenormand 没有正逆位：牌面一律正向，相邻成句。点选「三线」等牌阵后，中部出现牌位；底栏洗牌 / 切牌 / 启牌。",
    slotCount: 0,
    gridClass: "",
  },
  {
    id: "line3",
    indexLabel: "01",
    name: "三线",
    tag: "过去 · 现在 · 将来",
    body: "三张成线，从左读到右。相邻两张合成一句，看时间梯度。",
    slotCount: 3,
    gridClass: "lenormand-slot-grid--3",
    slotTimeLabels: ["过去", "现在", "将来"],
  },
  {
    id: "line5",
    indexLabel: "02",
    name: "五线",
    tag: "中轴在第三张",
    body: "五张从左读到右。第 3 张是心脏；1–2 铺过来，4–5 落地收局。不要套塔罗式「愿景/童年印记」。",
    slotCount: 5,
    gridClass: "lenormand-slot-grid--5",
    slotTimeLabels: ["铺垫", "推力", "核心", "落地", "收局"],
  },
  {
    id: "box9",
    indexLabel: "03",
    name: "九宫",
    tag: "中心 · 十字 · 四角",
    body: "先看中心，再看上下左右，四角是环境拉扯。不平均撒九句。",
    slotCount: 9,
    gridClass: "lenormand-slot-grid--9",
    slotTimeLabels: ["环境", "念头", "环境", "已然", "核心", "将然", "环境", "根基", "环境"],
  },
  {
    id: "grand",
    indexLabel: "04",
    name: "大展",
    tag: "先找人 · 再看邻牌",
    body: "三十六张一次铺开。先找男人/女人，再看心、戒指、房子、锚，以及贴在旁边的牌。",
    slotCount: 36,
    gridClass: "lenormand-slot-grid--gt",
  },
];

function cardCaption(card: LenormandCard): string {
  return getLenormandLexicon(card.id)?.chain ?? card.shortMeaning;
}

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
    const pool = q
      ? LENORMAND_CARDS.filter((c) => {
          const L = getLenormandLexicon(c.id);
          return (
            c.nameZh.includes(q) ||
            c.shortMeaning.includes(q) ||
            Boolean(L?.chain.includes(q)) ||
            Boolean(L?.essence.includes(q))
          );
        })
      : activeDraws.length
        ? activeDraws
        : LENORMAND_CARDS;
    return pool.slice(0, 12);
  }, [searchTerm, activeDraws]);

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
        <p className="mx-auto mt-2 max-w-2xl px-2 text-center text-[0.62rem] leading-relaxed text-[rgba(232,220,196,0.38)]">
          内容仅供自我参照，不构成医疗、法律或专业心理咨询意见。
        </p>
        <p className="lenormand-workspace__hint">
          写下问事，再启牌。默认「三线」，横滑可切五线、九宫或大展。
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
          placeholder="例如：她还爱我吗？东西还在家里吗？"
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
                      <div key={i} className="lenormand-slot-wrap">
                        {spread.slotTimeLabels?.[i] ? (
                          <span className="lenormand-slot__time">{spread.slotTimeLabels[i]}</span>
                        ) : null}
                        <div className={`lenormand-slot${card ? " lenormand-slot--drawn" : ""}`}>
                          {card ? (
                            <img
                              className="lenormand-slot__face"
                              src={card.image}
                              alt={`${card.id} ${card.nameZh}`}
                              width={180}
                              height={276}
                              draggable={false}
                            />
                          ) : (
                            <span>{spread.id === "grand" ? String(positionNo) : `位 ${positionNo}`}</span>
                          )}
                        </div>
                        {card && spread.id !== "grand" ? (
                          <span className="lenormand-slot__meaning">{cardCaption(card)}</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                {reading ? (
                  <div className="mt-4 min-w-0 rounded-lg border border-[rgba(197,160,89,0.22)] bg-[rgba(0,0,0,0.2)] p-3">
                    <h4 className="text-[0.68rem] tracking-[0.16em] text-[rgba(197,160,89,0.88)]">连读</h4>
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
          <p className="mb-3 text-[0.68rem] leading-relaxed text-[rgba(232,220,196,0.5)]">
            单面牌义，无正逆位。可按牌名搜索；启牌后优先显示本局。
          </p>
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
            placeholder="搜索牌名或关键词…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          <div className="mt-3 space-y-2">
            {filteredCards.map((card) => {
              const L = getLenormandLexicon(card.id);
              return (
                <div key={card.id} className="lenormand-aside__row">
                  <img className="lenormand-aside__thumb" src={card.image} alt="" width={28} height={42} />
                  <span className="min-w-0 flex-1 break-words">
                    <span className="block text-[rgba(232,220,196,0.88)]">
                      {card.id}. {card.nameZh}
                    </span>
                    <span className="block">{L?.essence ?? card.shortMeaning}</span>
                  </span>
                </div>
              );
            })}
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
          className="lenormand-dock-btn lenormand-dock-btn--primary"
          onClick={handleReveal}
          disabled={!deckReady}
        >
          启牌
        </button>
      </div>
    </div>
  );
}
