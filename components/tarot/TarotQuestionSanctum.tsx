"use client";

/**
 * 19 大类 + 手输问题为主，点选例子为辅。
 * 数据：`lib/tarot-question-quick-pick.ts`（自 Dmy `questionQuickPick` 复制）。
 */
import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { lifeSixSanctumMasterHintZh } from "@/lib/tarot-life-six-sanctum-copy-zh";
import { QUESTION_QUICK_PICK_WESTERN } from "@/lib/tarot-question-quick-pick";
import { TAROT_DIR_BY_CATEGORY_WESTERN, WESTERN_DIR_PACKS, westernSurfacesFlat } from "@/lib/tarot-western";

const DISCLAIMER_KEY = "labyrinthos_tarot_disclaimer_seen";

export type TarotQuestionSanctumProps = {
  question: string;
  onQuestionChange: (value: string) => void;
  onCategoryChange?: (categoryId: string) => void;
  /** 已选题后跳到牌阵/抽牌区 */
  onStartReading?: () => void;
  /** `oracle`：与 Dmy `tarot-oracle.css` 圣殿金褐配色；`lab`：原深紫工作台字色 */
  visualVariant?: "lab" | "oracle";
};

export default function TarotQuestionSanctum({
  question,
  onQuestionChange,
  onCategoryChange,
  onStartReading,
  visualVariant = "lab",
}: TarotQuestionSanctumProps) {
  const O = visualVariant === "oracle";
  const [quickPickCategoryIndex, setQuickPickCategoryIndex] = useState(0);
  const [dirFilterId, setDirFilterId] = useState("hot");
  const [disclaimerDismissed, setDisclaimerDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(DISCLAIMER_KEY) === "1";
    } catch {
      return false;
    }
  });

  const quickPickList = QUESTION_QUICK_PICK_WESTERN;
  const safeIndex = Math.min(quickPickCategoryIndex, Math.max(0, quickPickList.length - 1));
  const currentCategory = quickPickList[safeIndex]!;

  const handlePickQuestion = (q: string) => {
    onQuestionChange(q);
    if (currentCategory?.id) onCategoryChange?.(currentCategory.id);
  };

  const dismissDisclaimer = () => {
    setDisclaimerDismissed(true);
    try {
      localStorage.setItem(DISCLAIMER_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="space-y-6">
      {!O && (
        <div className="text-center px-1">
          <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Tarot · Immersive Guidance</p>
          <h2 className="mt-2 text-lg font-semibold tracking-wide text-[#E8D4A8] sm:text-xl" style={{ fontFamily: "var(--font-geist-sans)" }}>
            塔罗 · 先选方向，再选问题
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">选中的问题会带入下方解读，更贴题。</p>
        </div>
      )}

      {!disclaimerDismissed && (
        <div
          className={`relative rounded-2xl px-4 py-3 pr-10 text-center text-sm leading-relaxed ${
            O
              ? "border border-[rgba(212,175,55,0.35)] bg-[rgba(10,5,18,0.55)] text-[#d3c7b0]"
              : "border border-white/[0.08] bg-black/35 text-zinc-400"
          }`}
        >
          <p>
            塔罗是指引与自我觉察的工具，不是绝对预言。建议把问题聚焦在「我能做什么」，会更有方向感。
          </p>
          <button
            type="button"
            aria-label="关闭"
            onClick={dismissDisclaimer}
            className="absolute right-2 top-2 rounded-md p-1 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      <div className="space-y-2">
        <p className={`px-1 text-sm font-medium ${O ? "text-[#cbaf7a]" : "text-zinc-400"}`} style={O ? { fontFamily: "'Cinzel', serif" } : undefined}>
          选择方向与具体问题
        </p>
        <div
          className={`max-h-[min(70vh,46rem)] min-h-[200px] space-y-1 overflow-y-auto overscroll-contain rounded-[60px] p-3 sm:p-4 ${
            O
              ? "border border-[#a9844a] bg-[rgba(20,10,25,0.6)]"
              : "rounded-2xl border border-[rgba(197,160,89,0.18)] bg-gradient-to-br from-[rgba(36,32,52,0.5)] to-[rgba(10,8,24,0.85)]"
          }`}
        >
          {quickPickList.map((cat, i) => {
            const isActive = safeIndex === i;
            const dir = TAROT_DIR_BY_CATEGORY_WESTERN[cat.id];
            const dirTabs = dir?.tabs ?? [];
            const lifeSixHint = lifeSixSanctumMasterHintZh(cat.id);
            return (
              <div key={cat.id} className={`border-b py-1.5 last:border-b-0 ${O ? "border-[#a9844a]/25" : "border-white/[0.06]"}`}>
                <button
                  type="button"
                  onClick={() => {
                    setQuickPickCategoryIndex(i);
                    setDirFilterId(TAROT_DIR_BY_CATEGORY_WESTERN[cat.id]?.defaultId ?? "hot");
                    onCategoryChange?.(cat.id);
                  }}
                  className={
                    O
                      ? `spread-option flex w-full items-center justify-between gap-3 !rounded-[40px] px-4 py-2 text-left text-base sm:text-[17px] ${isActive ? "active" : ""}`
                      : `flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-base font-semibold transition-colors sm:text-[17px] ${
                          isActive
                            ? "border border-[#C5A059]/45 bg-[#C5A059]/14 text-[#E8D4A8] shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
                            : "border border-transparent text-zinc-200 hover:bg-white/[0.04]"
                        }`
                  }
                  style={{ fontFamily: O ? "'Cinzel', serif" : '"Noto Serif SC", "Source Han Serif SC", serif' }}
                >
                  <span>{cat.label}</span>
                  {isActive ? <ChevronUp className="h-4 w-4 shrink-0 opacity-80" aria-hidden /> : <ChevronDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden />}
                </button>

                {isActive && (
                  <div className="mt-2 space-y-3 px-1">
                    <div className="flex min-w-0 flex-wrap items-stretch gap-2">
                      <input
                        type="text"
                        value={question}
                        maxLength={120}
                        placeholder="输入你的问题"
                        aria-label="输入你的问题"
                        onChange={(e) => {
                          onQuestionChange(e.target.value);
                          if (cat.id) onCategoryChange?.(cat.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key !== "Enter" || !onStartReading) return;
                          e.preventDefault();
                          onStartReading();
                        }}
                        className={`min-h-12 min-w-0 flex-1 rounded-full border px-4 py-2.5 text-sm outline-none sm:text-base ${
                          O
                            ? "border-[#a9844a] bg-[rgba(10,5,18,0.55)] text-[#f3e6d2] placeholder:text-[#8a7a60]"
                            : "border-white/[0.12] bg-black/35 text-zinc-200 placeholder:text-zinc-600"
                        }`}
                      />
                      {onStartReading ? (
                        <button
                          type="button"
                          onClick={onStartReading}
                          className={
                            O
                              ? "draw-btn shrink-0 justify-center px-5"
                              : "shrink-0 rounded-full border border-[rgba(197,160,89,0.45)] bg-gradient-to-r from-[rgba(197,160,89,0.2)] to-[rgba(120,80,160,0.12)] px-5 py-2.5 text-sm font-medium tracking-[0.12em] text-[#E8D4A8]"
                          }
                        >
                          抽牌
                        </button>
                      ) : null}
                    </div>
                    {(dir?.hint || lifeSixHint) && (
                      <p className={`px-2 text-xs leading-relaxed sm:text-[13px] ${O ? "text-[#cbaf7a]/90" : "text-zinc-500"}`}>
                        {dir?.hint ?? lifeSixHint}
                      </p>
                    )}
                    {dirTabs.length > 0 && (
                      <div className="flex min-w-0 gap-3 overflow-x-auto overscroll-x-contain pb-1" role="tablist" aria-label={`${cat.label}二次筛选`}>
                        {dirTabs.map((tab) => {
                          const on = dirFilterId === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              role="tab"
                              aria-selected={on}
                              onClick={() => setDirFilterId(tab.id)}
                              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-[18px] font-semibold leading-tight sm:text-[20px] ${
                                on
                                  ? O
                                    ? "border-[#dbb45c] bg-[rgba(182,144,66,0.32)] text-[#ffefa8]"
                                    : "border-[#C5A059]/55 bg-[#C5A059]/18 text-[#E8D4A8]"
                                  : O
                                    ? "border-[#a9844a]/55 text-[#f3e6d2] hover:border-[#b6974b]"
                                    : "border-white/[0.08] text-zinc-300 hover:border-[#C5A059]/28"
                              }`}
                              style={{ fontFamily: '"Noto Serif SC", "Source Han Serif SC", "Songti SC", serif' }}
                            >
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <div className="min-w-0 overflow-x-auto overscroll-x-contain pr-1">
                      <div className="flex flex-wrap gap-x-4 gap-y-3">
                        {(WESTERN_DIR_PACKS[cat.id]
                          ? westernSurfacesFlat(dirFilterId, WESTERN_DIR_PACKS[cat.id]!)
                          : cat.questions
                        ).map((q, j) => (
                          <button
                            key={`${cat.id}-${j}`}
                            type="button"
                            onClick={() => handlePickQuestion(q)}
                            className={`max-w-full shrink-0 rounded-full border px-4 py-2 text-left text-[14px] leading-snug break-words transition-colors sm:text-[15px] ${
                              question === q
                                ? O
                                  ? "border-[#ffd966] bg-[rgba(182,144,66,0.2)] text-[#ffdfa7] shadow-[0_0_24px_rgba(250,188,47,0.25)]"
                                  : "border-[#C5A059]/55 bg-[#C5A059]/18 text-[#E8D4A8] shadow-[0_8px_18px_rgba(0,0,0,0.2)]"
                                : O
                                  ? "border-[#a9844a]/40 text-[#f2e1ba] hover:border-[#dbb45c]/55 hover:bg-[#b69042]/10"
                                  : "border-white/[0.08] text-zinc-300 hover:border-[#C5A059]/28 hover:bg-[#C5A059]/08"
                            }`}
                            style={{ fontFamily: O ? "'Cormorant Garamond', serif" : '"Noto Serif SC", "Source Han Serif SC", serif' }}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
