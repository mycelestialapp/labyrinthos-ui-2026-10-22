"use client";



import { Noto_Serif_SC } from "next/font/google";

import { Fragment, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { birthdayNumber, lifePathNumber } from "@/lib/numerology-pythagorean";

import { lifePathPairCompatZh, type LifePathPairBand } from "@/lib/numerology-life-path-pair-compat-zh";
import { isLifePathPair19, lifePathPair19ReadingSectionsZh } from "@/lib/numerology-life-path-1-9-pair-reading-zh";
import { numerologySynCompatCardVoiceSectionsZh } from "@/lib/numerology-syn-compat-card-voice-zh";

import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";

import { NumerologyGregorianDateField } from "@/components/numerology/NumerologyGregorianDateField";
import { NumerologyLifePathPairPersonalitySide } from "@/components/numerology/NumerologyLifePathPairPersonalitySide";
import { NumerologyGlassCard } from "@/components/numerology/numerology-shared-ui";

const zhSerif = Noto_Serif_SC({

  weight: ["400", "500", "600"],

  subsets: ["latin"],

  display: "swap",

});

/** 定稿内偶发 `**词**`，渲染为加粗（不整段走 Markdown） */
function renderPair19InlineBold(text: string): ReactNode {
  if (!text.includes("**")) return text;
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let i = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > i) out.push(text.slice(i, m.index));
    out.push(
      <strong key={`b-${k++}`} className="font-semibold text-[#fef3c7]/95">
        {m[1]}
      </strong>,
    );
    i = m.index + m[0].length;
  }
  if (i < text.length) out.push(text.slice(i));
  return out.length <= 1 ? (out[0] ?? text) : <Fragment>{out}</Fragment>;
}



const BAND_BADGE: Record<LifePathPairBand, string> = {

  twin: "border-[rgba(167,243,208,0.28)] bg-[rgba(16,185,129,0.12)] text-[#a7f3d0]",

  near: "border-[rgba(125,211,252,0.28)] bg-[rgba(14,165,233,0.11)] text-[#bae6fd]",

  ease: "border-[rgba(147,197,253,0.25)] bg-[rgba(59,130,246,0.1)] text-[#bfdbfe]",

  grind: "border-[rgba(253,230,138,0.28)] bg-[rgba(245,158,11,0.1)] text-[#fde68a]",

  pole: "border-[rgba(252,165,165,0.28)] bg-[rgba(248,113,113,0.09)] text-[#fecaca]",

};

/** 共鸣分析：左「我 / 对方」表单；宽屏右侧主路径性格提要（手册同源句） */

export function NumerologySynView() {

  const a = useNumerologyWorkspace();

  const {
    hydrated,
    y: y1,
    m: m1,
    d: d1,
    setY: setY1,
    setM: setM1,
    setD: setD1,
  } = a;

  const [y2, setY2] = useState(a.y);

  const [m2, setM2] = useState(Math.min(12, a.m + 1 > 12 ? 1 : a.m + 1));

  const [d2, setD2] = useState(a.d);

  const 乙SyncedAfterHydrate = useRef(false);

  /** 未在任一侧公历滚轮点「确定」前，不展示主路径数字与共读/合拍文案 */
  const [synReadoutReady, setSynReadoutReady] = useState(false);

  const onSynDateCommit = useCallback(() => {
    setSynReadoutReady(true);
  }, []);



  useEffect(() => {

    if (!hydrated || 乙SyncedAfterHydrate.current) return;

    乙SyncedAfterHydrate.current = true;

    setY2(a.y);

    setM2(a.m + 1 > 12 ? 1 : a.m + 1);

    setD2(a.d);

  }, [hydrated, a.y, a.m, a.d]);

  const lpA = a.lifePath;

  const lpB = useMemo(() => lifePathNumber(m2, d2, y2), [m2, d2, y2]);

  const bdA = a.birthdayNum;

  const bdB = useMemo(() => birthdayNumber(d2), [d2]);

  const compat = useMemo(() => lifePathPairCompatZh(lpA, lpB), [lpA, lpB]);

  const birthdayNote = useMemo(() => compat.birthdayLine(bdA, bdB), [compat, bdA, bdB]);

  const showPair19Deep = useMemo(() => isLifePathPair19(lpA, lpB), [lpA, lpB]);

  const pair19Sections = useMemo(
    () => (showPair19Deep ? lifePathPair19ReadingSectionsZh(lpA, lpB) : null),
    [showPair19Deep, lpA, lpB],
  );

  const synCompatVoiceSections = useMemo(() => numerologySynCompatCardVoiceSectionsZh(lpA, lpB), [lpA, lpB]);

  return (

    <div className="w-full min-w-0 space-y-4">

      <NumerologyGlassCard className="min-w-0">

        <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">

          <div className="min-w-0 w-full shrink-0 lg:max-w-xs">

          <p className="text-center text-[11px] uppercase tracking-[0.3em] text-[#9eb4c8]/60 sm:text-[12px]">共鸣分析</p>

          <div className="mt-4 overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.14)] bg-[rgba(10,16,24,0.42)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">

            <div className="divide-y divide-[rgba(148,163,184,0.1)]">

              <div className="min-w-0 px-4 py-4 sm:px-5 sm:py-5">

                <p className={`mb-3 text-center text-[13px] font-medium tracking-wide text-[#e2e8f0] sm:text-sm ${zhSerif.className}`}>
                  我
                </p>

                <NumerologyGregorianDateField
                  y={y1}
                  m={m1}
                  d={d1}
                  setY={setY1}
                  setM={setM1}
                  setD={setD1}
                  serifHintClassName={zhSerif.className}
                  centered
                  showWheelHint={false}
                  onDateCommit={onSynDateCommit}
                />

                {synReadoutReady ? (
                  <div className="mt-4 flex w-full min-w-0 flex-wrap items-end justify-center gap-2">
                    <span className="text-3xl tabular-nums leading-none text-[#f1f5f9]">{lpA}</span>

                    <span className={`pb-0.5 text-[12px] text-[#64748b] ${zhSerif.className}`}>主路径</span>
                  </div>
                ) : null}

              </div>

              <div className="min-w-0 px-4 py-4 sm:px-5 sm:py-5">

                <p className={`mb-3 text-center text-[13px] font-medium tracking-wide text-[#e2e8f0] sm:text-sm ${zhSerif.className}`}>
                  对方
                </p>

                <NumerologyGregorianDateField
                  y={y2}
                  m={m2}
                  d={d2}
                  setY={setY2}
                  setM={setM2}
                  setD={setD2}
                  serifHintClassName={zhSerif.className}
                  centered
                  showWheelHint={false}
                  onDateCommit={onSynDateCommit}
                />

                {synReadoutReady ? (
                  <div className="mt-4 flex w-full min-w-0 flex-wrap items-end justify-center gap-2">
                    <span className="text-3xl tabular-nums leading-none text-[#f1f5f9]">{lpB}</span>

                    <span className={`pb-0.5 text-[12px] text-[#64748b] ${zhSerif.className}`}>主路径</span>
                  </div>
                ) : null}

              </div>

            </div>

          </div>

          </div>

          <aside
            className="flex min-w-0 flex-1 flex-col justify-start rounded-2xl p-4 ring-1 ring-inset ring-[rgba(148,163,184,0.08)] sm:p-5 lg:min-h-[12rem]"
            aria-label="双人主路径性格与古法提要"
          >
            {synReadoutReady ? (
              <NumerologyLifePathPairPersonalitySide lpA={lpA} lpB={lpB} serifClassName={zhSerif.className} />
            ) : null}
          </aside>

        </div>

      </NumerologyGlassCard>



      {synReadoutReady ? (
        <NumerologyGlassCard id="numerology-syn-compat" className="min-w-0 scroll-mt-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${BAND_BADGE[compat.band]} ${zhSerif.className}`}>
              {compat.bandLabel}
            </span>

            <span className={`tabular-nums text-[10px] text-[#64748b] ${zhSerif.className}`}>环距 {compat.circularStep}</span>
          </div>

          {showPair19Deep ? (
          <div className="relative mt-4 space-y-8 overflow-hidden rounded-xl border border-[rgba(251,191,36,0.14)] bg-[linear-gradient(165deg,rgba(245,158,11,0.07)_0%,rgba(15,23,42,0.45)_42%,rgba(15,23,42,0.72)_100%)] px-3 py-4 sm:px-5 sm:py-5">
            <div
              className="pointer-events-none absolute inset-y-3 left-0 w-px bg-gradient-to-b from-[rgba(251,191,36,0.45)] via-[rgba(251,191,36,0.12)] to-transparent"
              aria-hidden
            />
            <header className="relative min-w-0 pl-3">
              <p className={`text-pretty text-[11px] leading-relaxed text-[#94a3b8] ${zhSerif.className}`}>
                <strong className="font-medium text-[#fde68a]/95">合议定稿</strong>：全文固定
                <strong className="font-medium text-[#cbd5e1]">「你」＝主路径 1</strong>、
                <strong className="font-medium text-[#cbd5e1]">「他」＝主路径 9</strong>
                。与左右生日无关，读时把「你／他」对上两侧主路径即可。环距怎么折、落在哪一档，点开下面小三角看，不占正文气口。
              </p>
            </header>
            {(pair19Sections ?? []).map((sec) => (
              <div key={`${lpA}-${lpB}-${sec.heading}`} className="relative min-w-0 space-y-3 pl-3">
                <p className={`border-l border-[rgba(251,191,36,0.35)] pl-2.5 text-pretty text-[11px] font-medium tracking-wide text-[#fde68a]/95 ${zhSerif.className}`}>
                  {sec.heading}
                </p>
                {sec.paragraphs.map((para, i) => (
                  <p
                    key={`${sec.heading}-${i}`}
                    className={`text-pretty text-[12px] leading-[1.82] text-[#e2e8f0] sm:text-[13px] sm:leading-[1.8] ${zhSerif.className}`}
                  >
                    {renderPair19InlineBold(para)}
                  </p>
                ))}
              </div>
            ))}
            <details className="relative min-w-0 rounded-lg border border-[rgba(148,163,184,0.14)] bg-[rgba(15,23,42,0.4)] px-3 py-2 pl-3">
              <summary
                className={`cursor-pointer list-none text-[10px] text-[#94a3b8] marker:hidden [&::-webkit-details-marker]:hidden ${zhSerif.className}`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0 flex-1 text-pretty">共读补注（环距与折法）</span>
                  <span className="shrink-0" aria-hidden>
                    ▼
                  </span>
                </span>
              </summary>
              <p className={`mt-2 text-pretty text-[11px] leading-[1.75] text-[#cbd5e1] ${zhSerif.className}`}>
                {compat.ringBridge}
              </p>
            </details>
          </div>
        ) : (
          <div className="relative mt-4 space-y-6 overflow-hidden rounded-xl border border-[rgba(148,163,184,0.12)] bg-[rgba(15,23,42,0.28)] px-3 py-4 sm:px-5 sm:py-5">
            <div
              className="pointer-events-none absolute inset-y-3 left-0 w-px bg-gradient-to-b from-[rgba(148,163,184,0.35)] via-[rgba(148,163,184,0.1)] to-transparent"
              aria-hidden
            />
            {synCompatVoiceSections.map((sec) => (
              <div key={sec.title} className="relative min-w-0 space-y-2.5 pl-3">
                <p
                  className={`border-l border-[rgba(148,163,184,0.35)] pl-2.5 text-pretty text-[11px] font-medium tracking-wide text-[#fde68a]/95 ${zhSerif.className}`}
                >
                  {sec.title}
                </p>
                {sec.paragraphs.map((para, i) => (
                  <p
                    key={`${sec.title}-${i}`}
                    className={`text-pretty text-[12px] leading-[1.82] text-[#e2e8f0] sm:text-[13px] sm:leading-[1.8] ${zhSerif.className}`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}



        <p className={`mt-4 text-pretty text-[11px] leading-relaxed text-[#64748b] ${zhSerif.className}`}>{birthdayNote}</p>



        {compat.masterAside ? (

          <p className={`mt-3 text-[10px] leading-relaxed text-[#64748b] ${zhSerif.className}`}>{compat.masterAside}</p>

        ) : null}



        <details className="mt-4 min-w-0 border-t border-[rgba(148,163,184,0.08)] pt-3">

          <summary className="cursor-pointer list-none text-[10px] text-[#64748b] marker:hidden [&::-webkit-details-marker]:hidden">

            <span className={`flex items-start justify-between gap-2 ${zhSerif.className}`}>

              <span className="min-w-0 flex-1 text-pretty">说明（边界与算法）</span>

              <span className="shrink-0" aria-hidden>

                ▼

              </span>

            </span>

          </summary>

          <p className={`mt-2 text-pretty text-[10px] leading-relaxed text-[#64748b] ${zhSerif.className}`}>

            仅供整理提纲；不作医疗、法律或关系判决。合拍按九数环距分档，与同站主路径归一算法一致。左侧「我」侧公历与共鸣页左栏同源，改一侧数字即重算两侧主路径与下文。

          </p>

        </details>
        </NumerologyGlassCard>
      ) : null}

    </div>

  );

}

