"use client";

/**
 * 与 Dmy `OracleSanctumEntrance` 塔罗分支同源：十大类 + 点选具体问题 + 折叠自由输入。
 * 数据：`lib/tarot-question-quick-pick.ts`（自 Dmy `questionQuickPick` 复制）。
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { lifeSixSanctumMasterHintZh } from "@/lib/tarot-life-six-sanctum-copy-zh";
import { QUESTION_QUICK_PICK_WESTERN } from "@/lib/tarot-question-quick-pick";

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
  const [showTarotFreeInput, setShowTarotFreeInput] = useState(false);
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
          className={`min-h-[200px] space-y-1 rounded-[60px] p-3 sm:p-4 ${
            O
              ? "border border-[#a9844a] bg-[rgba(20,10,25,0.6)]"
              : "rounded-2xl border border-[rgba(197,160,89,0.18)] bg-gradient-to-br from-[rgba(36,32,52,0.5)] to-[rgba(10,8,24,0.85)]"
          }`}
        >
          {quickPickList.map((cat, i) => {
            const isActive = safeIndex === i;
            const isLove = cat.id === "感情婚姻";
            const isCareer = cat.id === "事业工作";
            const lifeSixHint = lifeSixSanctumMasterHintZh(cat.id);
            return (
              <div key={cat.id} className={`border-b py-1.5 last:border-b-0 ${O ? "border-[#a9844a]/25" : "border-white/[0.06]"}`}>
                <button
                  type="button"
                  onClick={() => {
                    setQuickPickCategoryIndex(i);
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
                  <div className="mt-2 space-y-2 px-1">
                    {(isLove || isCareer || lifeSixHint) && (
                      <p className={`px-2 text-xs leading-relaxed sm:text-[13px] ${O ? "text-[#cbaf7a]/90" : "text-zinc-500"}`}>
                        {isLove &&
                          "塔罗更擅长行动建议，而不是简单 yes/no 或精确时间。把问题落在「我能做什么」往往更有帮助。"}
                        {isCareer &&
                          "牌面更擅长取舍与行动建议，而不是单纯成败预测。建议聚焦「如何调整、可以做什么」。"}
                        {!isLove && !isCareer && lifeSixHint}
                      </p>
                    )}
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
                      {cat.questions.map((q, j) => (
                        <button
                          key={j}
                          type="button"
                          onClick={() => handlePickQuestion(q)}
                          className={`rounded-xl border px-3 py-2 text-left text-[14px] leading-snug transition-colors sm:text-[15px] ${
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
                )}
              </div>
            );
          })}
        </div>
      </div>

      {question.trim() && (
        <div className="space-y-3">
          <div
            className={`rounded-[40px] px-4 py-3 ${
              O
                ? "border border-[rgba(212,175,55,0.4)] bg-[rgba(10,5,18,0.65)]"
                : "rounded-2xl border border-[rgba(197,160,89,0.2)] bg-black/35"
            }`}
          >
            <p className={`text-xs ${O ? "text-[#e7cf9c]" : "text-zinc-500"}`} style={O ? { fontFamily: "'Cinzel', serif" } : undefined}>
              当前问题
            </p>
            <p className={`mt-1 text-base leading-relaxed sm:text-lg ${O ? "text-[#f2e1ba]" : "text-zinc-200"}`}>{question}</p>
          </div>
          {onStartReading && (
            <button
              type="button"
              onClick={onStartReading}
              className={
                O
                  ? "draw-btn w-full justify-center"
                  : "w-full rounded-2xl border border-[rgba(197,160,89,0.45)] bg-gradient-to-r from-[rgba(197,160,89,0.2)] to-[rgba(120,80,160,0.12)] py-3.5 text-sm font-medium tracking-[0.15em] text-[#E8D4A8] transition hover:border-[#C5A059]/65"
              }
            >
              前往牌阵与抽牌
            </button>
          )}
        </div>
      )}

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowTarotFreeInput((v) => !v)}
          className={
            O
              ? "flex w-full items-center justify-center gap-2 rounded-[40px] border border-[#a9844a] bg-[rgba(20,10,25,0.45)] py-3 text-sm font-medium text-[#cbaf7a] transition hover:border-[#dbb45c] hover:bg-[rgba(182,144,66,0.12)] hover:text-[#f2e1ba]"
              : "flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-black/25 py-3 text-sm font-medium text-zinc-400 transition hover:border-[#C5A059]/25 hover:bg-white/[0.04] hover:text-zinc-300"
          }
          style={O ? { fontFamily: "'Cinzel', serif" } : undefined}
        >
          或自己输入问题
          {showTarotFreeInput ? <ChevronUp className="h-4 w-4" aria-hidden /> : <ChevronDown className="h-4 w-4" aria-hidden />}
        </button>
        <AnimatePresence>
          {showTarotFreeInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className={
                  O
                    ? "rounded-[30px] border border-[rgba(212,175,55,0.35)] bg-[rgba(10,5,18,0.5)] p-3"
                    : "rounded-2xl border border-white/[0.1] bg-black/35 p-3"
                }
              >
                <textarea
                  value={question}
                  onChange={(e) => onQuestionChange(e.target.value)}
                  rows={2}
                  maxLength={200}
                  placeholder="例如：我该如何改善目前的感情沟通？"
                  className={`w-full resize-none bg-transparent text-sm leading-relaxed outline-none ${
                    O ? "text-[#f3e6d2] placeholder:text-[#8a7a60]" : "text-zinc-200 placeholder:text-zinc-600"
                  }`}
                  style={O ? { fontFamily: "'Cormorant Garamond', serif" } : undefined}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
