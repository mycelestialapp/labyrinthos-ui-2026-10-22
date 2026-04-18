"use client";

import { Calendar } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NUMEROLOGY_CARD_BG, numerologyInputClassName } from "@/components/numerology/numerology-shared-ui";
import { daysInMonth } from "@/lib/numerology-gregorian";

const YEAR_MIN = 1900;
const YEAR_MAX = 2100;
const ITEM_H = 40;
const VIEW_H = 220;

function WheelColumn({
  values,
  value,
  onChange,
  suffix,
}: {
  values: readonly number[];
  value: number;
  onChange: (n: number) => void;
  suffix: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pad = (VIEW_H - ITEM_H) / 2;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const i = Math.max(0, values.indexOf(value));
    el.scrollTop = i * ITEM_H;
  }, [value, values]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const handler = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const raw = Math.round(el.scrollTop / ITEM_H);
        const i = Math.max(0, Math.min(values.length - 1, raw));
        const v = values[i];
        if (v !== undefined && v !== value) onChange(v);
      }, 64);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => {
      el.removeEventListener("scroll", handler);
      if (timeout) clearTimeout(timeout);
    };
  }, [value, values, onChange]);

  const scrollToIndex = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(values.length - 1, i));
    el.scrollTo({ top: clamped * ITEM_H, behavior: "smooth" });
    const v = values[clamped];
    if (v !== undefined) onChange(v);
  };

  return (
    <div className="relative min-w-0 flex-1">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-10 -translate-y-1/2 border-y border-[rgba(168,188,208,0.22)] bg-[rgba(168,188,208,0.06)]"
        aria-hidden
      />
      <div
        ref={ref}
        className="h-[220px] overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: "pan-y" }}
      >
        <div style={{ paddingTop: pad, paddingBottom: pad }}>
          {values.map((v, i) => {
            const active = v === value;
            return (
              <button
                key={v}
                type="button"
                className={`flex h-10 w-full shrink-0 items-center justify-center gap-0.5 text-[14px] tabular-nums transition-colors ${
                  active ? "font-medium text-[#f1f5f9]" : "text-[#64748b]"
                }`}
                onClick={() => scrollToIndex(i)}
              >
                {v}
                <span className="text-[11px] font-normal text-[#94a3b8]">{suffix}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type Props = {
  y: number;
  m: number;
  d: number;
  setY: (n: number) => void;
  setM: (n: number) => void;
  setD: (n: number) => void;
  serifHintClassName: string;
  /** 根容器额外 class（如共鸣页 `max-w-xs` 收窄日期条宽度） */
  rootClassName?: string;
  /** 标签、日期条与提示语横向居中（日历图标贴右，不占居中宽度） */
  centered?: boolean;
  /** 为 false 时不渲染「点按开滚轮」一行（如共鸣页已与其它入口重复说明） */
  showWheelHint?: boolean;
  /** 用户在滚轮面板点「确定」并写入公历后触发（用于共鸣等「未确认前不展示读文」） */
  onDateCommit?: () => void;
  /**
   * unset：主按钮不展示年月日数字（纯汉字提示），滚轮仍按当前 y/m/d 打开；用于共鸣页首屏。
   */
  numericDisplay?: "full" | "unset";
};

export function NumerologyGregorianDateField({
  y,
  m,
  d,
  setY,
  setM,
  setD,
  serifHintClassName,
  rootClassName,
  centered = false,
  showWheelHint = true,
  onDateCommit,
  numericDisplay = "full",
}: Props) {
  const [open, setOpen] = useState(false);
  const [draftY, setDraftY] = useState(y);
  const [draftM, setDraftM] = useState(m);
  const [draftD, setDraftD] = useState(d);

  const years = useMemo(() => Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MIN + i), []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const maxDay = useMemo(() => daysInMonth(draftY, draftM), [draftY, draftM]);
  const days = useMemo(() => Array.from({ length: maxDay }, (_, i) => i + 1), [maxDay]);

  const onDraftY = useCallback((ny: number) => {
    setDraftY(ny);
    setDraftM((cm) => {
      setDraftD((dd) => Math.min(dd, daysInMonth(ny, cm)));
      return cm;
    });
  }, []);

  const onDraftM = useCallback((nm: number) => {
    setDraftM(nm);
    setDraftY((cy) => {
      setDraftD((dd) => Math.min(dd, daysInMonth(cy, nm)));
      return cy;
    });
  }, []);

  const openSheet = () => {
    setDraftY(y);
    setDraftM(m);
    setDraftD(d);
    setOpen(true);
  };

  const applyToday = () => {
    const t = new Date();
    setDraftY(t.getFullYear());
    setDraftM(t.getMonth() + 1);
    setDraftD(t.getDate());
  };

  const confirm = () => {
    const cap = daysInMonth(draftY, draftM);
    const dd = Math.min(draftD, cap);
    setY(draftY);
    setM(draftM);
    setD(dd);
    onDateCommit?.();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const display =
    numericDisplay === "unset" ? "公历 · 待选（点按选择）" : `${y}年${m}月${d}日`;

  const portal =
    open && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/55 p-0 sm:items-center sm:justify-center sm:p-4">
            <button type="button" className="absolute inset-0 cursor-default" aria-label="关闭" onClick={() => setOpen(false)} />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="numerology-date-sheet-title"
              className="relative z-[201] w-full max-w-lg rounded-t-3xl border border-[rgba(168,188,208,0.28)] shadow-[0_-12px_48px_rgba(0,0,0,0.45)] sm:rounded-2xl"
              style={{ background: NUMEROLOGY_CARD_BG }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2 border-b border-[rgba(168,188,208,0.12)] px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  <span
                    id="numerology-date-sheet-title"
                    className="rounded-full border border-[rgba(168,188,208,0.35)] bg-[rgba(168,188,208,0.1)] px-3 py-1 text-[12px] tracking-[0.08em] text-[#e2e8f0]"
                  >
                    公历
                  </span>
                  <button
                    type="button"
                    onClick={applyToday}
                    className="rounded-full border border-[rgba(168,188,208,0.25)] px-2.5 py-1 text-[11px] tracking-[0.15em] text-[#94a3b8] transition-colors hover:border-[rgba(168,188,208,0.45)] hover:text-[#cbd5e1]"
                  >
                    今
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-[12px] text-[#94a3b8] transition-colors hover:text-[#cbd5e1]"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={confirm}
                    className="rounded-lg border border-[rgba(168,188,208,0.45)] bg-[rgba(241,245,249,0.12)] px-4 py-1.5 text-[12px] font-medium tracking-[0.12em] text-[#f1f5f9] transition-colors hover:bg-[rgba(241,245,249,0.18)]"
                  >
                    确定
                  </button>
                </div>
              </div>

              <div className="flex divide-x divide-[rgba(168,188,208,0.12)] px-1 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:pb-4">
                <WheelColumn values={years} value={draftY} onChange={onDraftY} suffix="年" />
                <WheelColumn values={months} value={draftM} onChange={onDraftM} suffix="月" />
                <WheelColumn
                  key={`day-${draftY}-${draftM}-${maxDay}`}
                  values={days}
                  value={Math.min(draftD, maxDay)}
                  onChange={setDraftD}
                  suffix="日"
                />
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      className={`flex w-full min-w-0 flex-col gap-2${centered ? " items-center text-center" : ""}${rootClassName ? ` ${rootClassName}` : ""}`}
    >
      <span className={`w-full text-[12px] text-[#94a3b8]${centered ? " text-center" : ""}`}>出生日期 · 公历</span>
      <button
        type="button"
        onClick={openSheet}
        className={`${numerologyInputClassName} !flex !w-full !cursor-pointer items-center gap-2 ${
          numericDisplay === "unset" ? "text-[#cbd5e1]" : "text-base text-[#f1f5f9]"
        } ${
          centered
            ? "relative !justify-center !pr-10 !text-center"
            : "justify-between !text-left"
        }`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span
          className={`tracking-[0.02em] ${serifHintClassName} ${
            numericDisplay === "unset" ? "text-[13px] text-[#94a3b8]" : "text-base tabular-nums text-[#f1f5f9]"
          }`}
        >
          {display}
        </span>
        <Calendar
          className={`h-4 w-4 shrink-0 opacity-70 ${centered ? "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" : ""}`}
          strokeWidth={1.35}
          aria-hidden
        />
      </button>
      {showWheelHint ? (
        <p className={`w-full text-[12px] leading-relaxed text-[#94a3b8] ${serifHintClassName}${centered ? " text-center" : ""}`}>
          点按开滚轮；无农历时辰。
        </p>
      ) : null}
      {portal}
    </div>
  );
}
