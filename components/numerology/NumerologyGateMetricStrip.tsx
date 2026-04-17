"use client";

import { Cinzel, Noto_Serif_SC } from "next/font/google";
import { NUMEROLOGY_CARD_BG } from "@/components/numerology/numerology-shared-ui";

const displaySerif = Cinzel({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const kpiMetricColLabelClass = `text-[10px] font-medium tracking-[0.22em] text-[#94a3b8] ${zhSerif.className}`;
const kpiMetricSubClass = `text-[10px] tracking-[0.12em] text-[#94a3b8] ${zhSerif.className}`;
const kpiMetricHintClass = (compact: boolean) =>
  `${compact ? "mt-1 text-[11px] leading-[1.55]" : "mt-1 text-[12px] leading-[1.65]"} text-[#cbd5e1] ${zhSerif.className}`;

export type NumerologyGateMetricCell = {
  label: string;
  sub: string;
  v: number | null;
  emptyHint: string | null;
};

export function NumerologyGateMetricStrip({
  cells,
  variant,
  listAriaLabel,
}: {
  cells: NumerologyGateMetricCell[];
  variant: "full" | "embedded";
  listAriaLabel: string;
}) {
  const dense = variant === "embedded";
  return (
    <div
      className={
        dense
          ? "mt-3 grid grid-cols-5 gap-px overflow-hidden rounded-lg border border-[rgba(168,188,208,0.14)] bg-[rgba(168,188,208,0.14)]"
          : "grid grid-cols-2 gap-px bg-[rgba(168,188,208,0.14)] sm:grid-cols-3 xl:grid-cols-5"
      }
      role="list"
      aria-label={listAriaLabel}
    >
      {cells.map((c) => {
        const empty = c.v == null;
        return (
          <div
            key={c.label}
            role="listitem"
            className={
              dense
                ? "flex min-h-[4.5rem] flex-col items-center justify-between px-1 py-2 text-center sm:min-h-[4.75rem] sm:px-1.5"
                : "flex min-h-[118px] flex-col items-center justify-between px-3.5 py-3 text-center sm:min-h-[124px] sm:px-4 sm:py-3.5"
            }
            style={{ background: NUMEROLOGY_CARD_BG }}
          >
            <p className={kpiMetricColLabelClass}>{c.label}</p>
            <p
              className={`tabular-nums leading-none ${dense ? "mt-1 text-2xl sm:text-[1.65rem]" : "mt-1.5 text-3xl sm:text-[2.125rem]"} ${empty ? "text-[#94a3b8]" : "text-[#f1f5f9]"}`}
              style={{ fontFamily: displaySerif.style.fontFamily }}
            >
              {c.v ?? "—"}
            </p>
            <div className={`w-full ${dense ? "mt-1" : "mt-2"}`}>
              <p className={kpiMetricSubClass}>{c.sub}</p>
              {empty && c.emptyHint ? (
                <p
                  className={`${kpiMetricHintClass(dense)} ${dense ? "line-clamp-4" : ""}`}
                  title={dense ? c.emptyHint : undefined}
                >
                  {c.emptyHint}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
