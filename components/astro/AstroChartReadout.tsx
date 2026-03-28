"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AstroChartWheelData, AstroAspectDatum, AstroTransitNatalAspectDatum } from "@/lib/astro-chart-wheel";
import {
  PLANET_GLYPH,
  PLANET_NAME_ZH,
  houseNumberForLongitude,
  formatLongitudeInSignZh,
} from "@/lib/astro-chart-wheel";
function aspectTypeZh(t: AstroAspectDatum["type"] | AstroTransitNatalAspectDatum["type"]): string {
  switch (t) {
    case "conjunction":
      return "合相";
    case "sextile":
      return "六合";
    case "square":
      return "四分";
    case "trine":
      return "三合";
    case "opposition":
      return "对冲";
  }
}

function normLon(d: number): string {
  const x = ((d % 360) + 360) % 360;
  return `${x.toFixed(2)}°`;
}

/** 金 = 区块标题；青灰 = 宫位列；data = 表内正文 */
const R = {
  title: "text-[#B8944A]",
  titleHover: "hover:text-[#C5A060]",
  key: "text-[#B8944A]",
  glyph: "text-[#B8944A]",
  house: "text-[#5F8794]",
  data: "text-zinc-400",
  sep: "text-zinc-500",
  meta: "text-zinc-500",
  /** 相位列表整行：与占星工作台主正文一致的灰白（勿用 mono 排中文，否则会偏黄褐） */
  aspectRow: "text-zinc-300 font-sans antialiased",
  borderGold: "border-[#C5A059]/18",
} as const;

type Props = {
  data: AstroChartWheelData;
  className?: string;
  synastry?: {
    partnerLabel: string;
    aspects: AstroTransitNatalAspectDatum[];
    partnerInMyHouses: Array<{ planet: AstroTransitNatalAspectDatum["transit"]; house: number }>;
    myInPartnerHouses: Array<{ planet: AstroTransitNatalAspectDatum["transit"]; house: number }>;
  } | null;
};

/**
 * 星盘旁文字读数：轴线、行星（符号+星座度数+宫位）、宫头表、主相位表。
 */
export default function AstroChartReadout({ data, className = "", synastry = null }: Props) {
  const [readoutOpen, setReadoutOpen] = useState(true);
  const [cuspsOpen, setCuspsOpen] = useState(true);
  const [aspectsOpen, setAspectsOpen] = useState(true);
  const [transitNatalOpen, setTransitNatalOpen] = useState(true);
  const [synastryOpen, setSynastryOpen] = useState(true);
  const [planetTableMode, setPlanetTableMode] = useState<"simple" | "pro">("pro");

  const planetRows = useMemo(() => {
    const order: Array<(typeof data.planets)[number]["id"]> = [
      "sun",
      "moon",
      "mercury",
      "venus",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
      "pluto",
    ];
    const orderIndex = new Map(order.map((id, i) => [id, i]));
    return [...data.planets]
      .sort((a, b) => (orderIndex.get(a.id) ?? 999) - (orderIndex.get(b.id) ?? 999))
      .map((p) => {
      const pos = formatLongitudeInSignZh(p.lonDeg);
      const h = houseNumberForLongitude(p.lonDeg, data.houseCuspsLonDeg);
      return {
        id: p.id,
        glyph: PLANET_GLYPH[p.id],
        name: PLANET_NAME_ZH[p.id],
        pos: pos.text,
        sign: pos.signZh,
        degInSign: pos.degInSign,
        minInSign: pos.minInSign,
        house: h,
        lon: normLon(p.lonDeg),
      };
      });
  }, [data]);

  const cuspRows = useMemo(() => {
    return data.houseCuspsLonDeg.map((lon, i) => ({
      house: i + 1,
      t: formatLongitudeInSignZh(lon).text,
      lon: normLon(lon),
    }));
  }, [data.houseCuspsLonDeg]);

  const synastryAspectRows = useMemo(
    () => (synastry ? [...synastry.aspects].sort((a, b) => a.orbDeg - b.orbDeg) : []),
    [synastry],
  );

  return (
    <div
      className={`mx-auto w-full max-w-[1120px] rounded-lg border border-[#C5A059]/14 bg-[#05051a]/80 p-5 shadow-[inset_0_0_0_1px_rgba(197,160,89,0.06)] ${className}`}
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      <button
        type="button"
        onClick={() => setReadoutOpen((o) => !o)}
        className="mb-3 flex w-full items-center justify-between gap-2 rounded-md py-2 text-left transition-colors hover:bg-white/[0.04]"
        aria-expanded={readoutOpen}
      >
        <span className="flex min-w-0 items-center gap-2">
          <ChevronDown
            className={`h-4.5 w-4.5 shrink-0 ${R.title} transition-transform ${readoutOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
          <span className={`text-[clamp(15px,1.05vw,18px)] tracking-[0.1em] ${R.title}`}>星盘数据</span>
        </span>
        <span className="max-w-[55%] truncate text-[clamp(12px,0.85vw,15px)] text-zinc-400">
          {(data.houseSystem === "Whole Sign"
            ? "整宫制"
            : data.houseSystem === "Placidus"
              ? "普拉西德"
              : data.houseSystem) +
            " · " +
            (data.ephemerisSource === "swiss-ephemeris" ? "瑞士星历" : "天文引擎")}
        </span>
      </button>

      {readoutOpen ? (
        <>
          {data.chartKindMeta?.lineZh ? (
            <p className="mb-3 text-[clamp(13px,0.88vw,16px)] leading-relaxed text-zinc-400">{data.chartKindMeta.lineZh}</p>
          ) : null}

          <div className="grid max-w-[1080px] grid-cols-1 gap-3 text-[clamp(14px,0.95vw,16px)] leading-relaxed text-zinc-400 [font-variant-numeric:tabular-nums] md:grid-cols-2 xl:grid-cols-[minmax(0,1.26fr)_minmax(0,0.94fr)_minmax(0,1.1fr)]">
        <section className="rounded-md border border-white/[0.06] bg-black/15 p-3 min-w-0">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className={`text-[clamp(13px,0.95vw,16px)] font-medium tracking-[0.08em] ${R.title}`}>行星</p>
            <div className="inline-flex rounded-full border border-white/[0.1] p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setPlanetTableMode("simple")}
                className={`rounded-full px-2 py-0.5 transition-colors ${planetTableMode === "simple" ? "bg-[#C5A059]/16 text-[#C4B07A]" : "text-zinc-500 hover:text-zinc-400"}`}
              >
                简版
              </button>
              <button
                type="button"
                onClick={() => setPlanetTableMode("pro")}
                className={`rounded-full px-2 py-0.5 transition-colors ${planetTableMode === "pro" ? "bg-[#C5A059]/14 text-[#C4B07A]" : "text-zinc-500 hover:text-zinc-400"}`}
              >
                专业版
              </button>
            </div>
          </div>
          <div className="overflow-x-hidden">
            <table
              className="w-full table-fixed border-collapse text-left text-[clamp(14px,0.95vw,16px)]"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              <colgroup>
                <col style={{ width: "32%" }} />
                <col style={{ width: "35%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "22%" }} />
              </colgroup>
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-400">
                  <th className="pb-1.5 pr-1 font-normal">星体</th>
                  <th className="pb-1.5 pr-1 font-normal">{planetTableMode === "pro" ? "星座位置" : "位置"}</th>
                  <th className="pb-1.5 pr-1 font-normal">宫位</th>
                  <th className="pb-1.5 pr-1 text-right font-normal whitespace-nowrap">{planetTableMode === "pro" ? "黄经(°)" : "黄经"}</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
                {planetRows.map((r) => (
                  <tr key={r.id} className="border-b border-white/[0.04] text-zinc-400">
                    <td className="py-1.5 pr-1">
                      <span className={R.glyph} style={{ fontFamily: "Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, sans-serif" }}>
                        {r.glyph}
                      </span>{" "}
                      <span className={`truncate ${R.key}`}>{r.name}</span>
                    </td>
                    <td className={`py-1.5 pr-1 whitespace-nowrap ${R.data}`}>
                      {planetTableMode === "pro" ? `${r.sign} ${r.degInSign}°${r.minInSign}′` : r.pos}
                    </td>
                    <td className={`py-1.5 pr-1 whitespace-nowrap ${R.house}`}>{r.house}</td>
                    <td className={`py-1.5 pr-1 text-right whitespace-nowrap ${R.data}`}>{r.lon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-md border border-white/[0.06] bg-black/15 p-3 min-w-0">
          <button
            type="button"
            onClick={() => setCuspsOpen((o) => !o)}
            className={`flex w-full items-center justify-between py-1.5 text-left text-[clamp(13px,0.95vw,16px)] font-medium tracking-[0.08em] ${R.title} ${R.titleHover}`}
          >
            十二宫宫头
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${cuspsOpen ? "rotate-180" : ""}`} />
          </button>
          {cuspsOpen && (
            <ul
              className={`mt-1 w-full space-y-1.5 px-1 text-[clamp(13px,0.92vw,15px)] ${R.data}`}
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {cuspRows.map((c) => (
                <li key={c.house} className={`grid grid-cols-[auto_1fr] gap-3 border-l ${R.borderGold} pl-2 pr-1`}>
                  <span className={R.key}>第{c.house}宫</span>
                  <span className={`justify-self-start ${R.data}`}>
                    {c.t} <span className={R.meta}>{c.lon}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-md border border-white/[0.06] bg-black/15 p-3 min-w-0">
          <button
            type="button"
            onClick={() => setAspectsOpen((o) => !o)}
            className={`flex w-full items-center justify-between py-1.5 text-left text-[clamp(13px,0.95vw,16px)] font-medium tracking-[0.08em] ${R.title} ${R.titleHover}`}
          >
            盘内主相位
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${aspectsOpen ? "rotate-180" : ""}`} />
          </button>
          {aspectsOpen && (
            <ul className={`mt-1 w-full space-y-1.5 text-[clamp(13px,0.92vw,15px)] ${R.aspectRow}`}>
              {data.aspects.length === 0 ? (
                <li className="font-sans text-zinc-500">当前盘内暂无主相位。</li>
              ) : (
                [...data.aspects].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                  <li key={`${a.a}-${a.b}-${a.type}-${i}`} className={`border-l ${R.borderGold} pl-2`}>
                    <span className={R.key}>{aspectTypeZh(a.type)}</span> ·{" "}
                    <span style={{ fontFamily: "Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, sans-serif" }}>{PLANET_GLYPH[a.a]}</span>
                    {PLANET_NAME_ZH[a.a]} —{" "}
                    <span style={{ fontFamily: "Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, sans-serif" }}>{PLANET_GLYPH[a.b]}</span>
                    {PLANET_NAME_ZH[a.b]}
                    <span className="ml-2 tabular-nums opacity-90">orb {a.orbDeg.toFixed(2)}°</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

          </div>

          {data.transitNatalAspects && data.transitNatalAspects.length > 0 ? (
            <section className="mt-3 rounded-md border border-white/[0.06] bg-black/15 p-3">
              <button
                type="button"
                onClick={() => setTransitNatalOpen((o) => !o)}
                className={`flex w-full items-center justify-between py-1.5 text-left text-[clamp(13px,0.95vw,16px)] font-medium ${R.title} ${R.titleHover}`}
              >
                行运 ↔ 本命（主相位）
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${transitNatalOpen ? "rotate-180" : ""}`} />
              </button>
              {transitNatalOpen && (
                <ul className={`mt-1 w-full space-y-1.5 text-[clamp(13px,0.92vw,15px)] ${R.aspectRow}`}>
                  {[...data.transitNatalAspects].sort((x, y) => x.orbDeg - y.orbDeg).map((a, i) => (
                    <li key={`tn-${a.transit}-${a.natal}-${a.type}-${i}`} className={`border-l ${R.borderGold} pl-2`}>
                      行运
                      <span style={{ fontFamily: "Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, sans-serif" }}>{PLANET_GLYPH[a.transit]}</span>
                      {PLANET_NAME_ZH[a.transit]} <span className={R.key}>{aspectTypeZh(a.type)}</span> 出生
                      <span style={{ fontFamily: "Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, sans-serif" }}>{PLANET_GLYPH[a.natal]}</span>
                      {PLANET_NAME_ZH[a.natal]}
                      <span className="ml-2 tabular-nums opacity-90">orb {a.orbDeg.toFixed(2)}°</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}

          {synastry ? (
            <section className="mt-3 rounded-md border border-white/[0.06] bg-black/15 p-3">
              <button
                type="button"
                onClick={() => setSynastryOpen((o) => !o)}
                className={`flex w-full items-center justify-between py-1.5 text-left text-[clamp(13px,0.95vw,16px)] font-medium ${R.title} ${R.titleHover}`}
              >
                合盘（你 ↔ {synastry.partnerLabel}）
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${synastryOpen ? "rotate-180" : ""}`} />
              </button>
              {synastryOpen ? (
                <div className="mt-2 grid max-w-[1080px] grid-cols-1 gap-3 text-[clamp(14px,0.95vw,16px)] leading-relaxed text-zinc-400 [font-variant-numeric:tabular-nums] md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.14fr)]">
                  <section className="rounded-md border border-white/[0.06] bg-black/15 p-3 min-w-0">
                    <p className={`mb-2 text-[clamp(13px,0.95vw,16px)] font-medium tracking-[0.08em] ${R.title}`}>对方行星落你宫位</p>
                    <ul className="space-y-1.5 text-[clamp(13px,0.92vw,15px)]">
                      {synastry.partnerInMyHouses.map((x) => (
                        <li key={`pim-${x.planet}`} className={`border-l ${R.borderGold} pl-2`}>
                          <span className={R.glyph} style={{ fontFamily: "Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, sans-serif" }}>
                            {PLANET_GLYPH[x.planet]}
                          </span>
                          <span className={R.key}>{PLANET_NAME_ZH[x.planet]}</span>
                          <span className={R.sep}> → </span>
                          <span className={R.house}>第{x.house}宫</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-md border border-white/[0.06] bg-black/15 p-3 min-w-0">
                    <p className={`mb-2 text-[clamp(13px,0.95vw,16px)] font-medium tracking-[0.08em] ${R.title}`}>你行星落对方宫位</p>
                    <ul className="space-y-1.5 text-[clamp(13px,0.92vw,15px)]">
                      {synastry.myInPartnerHouses.map((x) => (
                        <li key={`mip-${x.planet}`} className={`border-l ${R.borderGold} pl-2`}>
                          <span className={R.glyph} style={{ fontFamily: "Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, sans-serif" }}>
                            {PLANET_GLYPH[x.planet]}
                          </span>
                          <span className={R.key}>{PLANET_NAME_ZH[x.planet]}</span>
                          <span className={R.sep}> → </span>
                          <span className={R.house}>第{x.house}宫</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-md border border-white/[0.06] bg-black/15 p-3 min-w-0">
                    <p className={`mb-2 text-[clamp(13px,0.95vw,16px)] font-medium tracking-[0.08em] ${R.title}`}>
                      双人主相位（Synastry）· 共 {synastryAspectRows.length} 条
                    </p>
                    <ul className={`space-y-1.5 text-[clamp(13px,0.92vw,15px)] ${R.aspectRow}`}>
                      {synastryAspectRows.length === 0 ? (
                        <li className="font-sans text-zinc-500">当前未命中主相位（6° 容许度）。</li>
                      ) : (
                        synastryAspectRows.map((a, i) => (
                          <li key={`syn-asp-${a.transit}-${a.natal}-${a.type}-${i}`} className={`border-l ${R.borderGold} pl-2`}>
                            对方
                            <span style={{ fontFamily: "Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, sans-serif" }}>{PLANET_GLYPH[a.transit]}</span>
                            {PLANET_NAME_ZH[a.transit]} <span className={R.key}>{aspectTypeZh(a.type)}</span> 你
                            <span style={{ fontFamily: "Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, sans-serif" }}>{PLANET_GLYPH[a.natal]}</span>
                            {PLANET_NAME_ZH[a.natal]}
                            <span className="ml-2 tabular-nums opacity-90">orb {a.orbDeg.toFixed(2)}°</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </section>
                </div>
              ) : null}
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
