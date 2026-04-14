"use client";

import { Noto_Serif_SC } from "next/font/google";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { lifePathNumber } from "@/lib/numerology-pythagorean";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyGlassCard, numerologyInputClassName } from "@/components/numerology/numerology-shared-ui";
import { loadNumerologyArchive, type NumerologyArchiveEntry } from "@/lib/numerology-archive-storage";

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/** 共鸣分析：甲为工作台生辰，乙为对照生辰，对比主路径 */
export function NumerologySynView() {
  const pathname = usePathname();
  const a = useNumerologyWorkspace();
  const { replaceWorkspace } = a;
  const [y2, setY2] = useState(a.y);
  const [m2, setM2] = useState(Math.min(12, a.m + 1 > 12 ? 1 : a.m + 1));
  const [d2, setD2] = useState(a.d);
  const [archives, setArchives] = useState<NumerologyArchiveEntry[]>([]);
  const [archiveSelect, setArchiveSelect] = useState("");

  const refreshArchives = useCallback(() => {
    setArchives(loadNumerologyArchive());
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) refreshArchives();
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, refreshArchives]);

  const lpA = a.lifePath;
  const lpB = useMemo(() => lifePathNumber(m2, d2, y2), [m2, d2, y2]);
  const diff = Math.abs(lpA - lpB);
  const line =
    diff === 0
      ? "主路径相同：节奏接口相近，适合对齐目标与验收方式。"
      : diff <= 2
        ? "主路径相邻：一动一静时易互补，需明确分工与反馈频率。"
        : "主路径跨度较大：吸引力常在差异处，长期合作需写清底线与退出条件。";

  const swapAB = () => {
    const wy = a.y;
    const wm = a.m;
    const wd = a.d;
    replaceWorkspace({ y: y2, m: m2, d: d2, nameLatin: a.nameLatin });
    setY2(wy);
    setM2(wm);
    setD2(wd);
  };

  const onPickArchive = (id: string) => {
    setArchiveSelect(id);
    if (!id) return;
    const e = archives.find((x) => x.id === id);
    if (!e) return;
    setY2(e.snapshot.y);
    setM2(e.snapshot.m);
    setD2(e.snapshot.d);
  };

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <NumerologyGlassCard>
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#9eb4c8]/55">共鸣分析</p>
        <p className={`mt-3 text-[13px] leading-relaxed text-[#cbd5e1] ${zhSerif.className}`}>
          「甲」沿用寰宇之门当前生辰；「乙」为对照对象。可从智慧档案载入乙，或与工作台互换公历。以下为演示级对照句，不作关系定论。
        </p>
      </NumerologyGlassCard>

      <NumerologyGlassCard className="!py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-xs">
            <span className="text-[9px] text-[#94a3b8]">从档案载入乙</span>
            <select
              value={archiveSelect}
              onChange={(ev) => onPickArchive(ev.target.value)}
              className="rounded-lg border-[0.5px] border-[rgba(168,188,208,0.3)] bg-[rgba(26,32,42,0.85)] px-2 py-2 text-[11px] text-[#cbd5e1] outline-none"
            >
              <option value="">选择快照…</option>
              {archives.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.note} · {e.snapshot.y}-{String(e.snapshot.m).padStart(2, "0")}-{String(e.snapshot.d).padStart(2, "0")}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={refreshArchives}
            className="rounded-lg border-[0.5px] border-[rgba(168,188,208,0.25)] px-3 py-2 text-[10px] text-[#94a3b8] hover:border-[rgba(168,188,208,0.45)]"
          >
            刷新列表
          </button>
          <button
            type="button"
            onClick={swapAB}
            className="rounded-lg border-[0.5px] border-[rgba(168,188,208,0.35)] px-3 py-2 text-[10px] text-[#9eb4c8] hover:border-[rgba(168,188,208,0.55)]"
          >
            甲乙互换公历
          </button>
        </div>
      </NumerologyGlassCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch">
        <NumerologyGlassCard className="min-w-0">
          <p className="text-[9px] uppercase tracking-[0.32em] text-[#9eb4c8]">甲 · 工作台</p>
          <p className="mt-3 text-3xl tabular-nums text-[#f1f5f9]">{lpA}</p>
          <p className="mt-2 text-[11px] text-[#94a3b8]">
            {a.y}-{String(a.m).padStart(2, "0")}-{String(a.d).padStart(2, "0")}
          </p>
        </NumerologyGlassCard>

        <NumerologyGlassCard className="min-w-0">
          <p className="text-[9px] uppercase tracking-[0.32em] text-[#9eb4c8]">乙 · 对照生辰</p>
          <div className="mt-3 grid min-w-0 grid-cols-3 gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-[9px] text-[#94a3b8]">年</span>
              <input type="number" min={1900} max={2100} value={y2} onChange={(e) => setY2(Number(e.target.value) || y2)} className={numerologyInputClassName} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[9px] text-[#94a3b8]">月</span>
              <input
                type="number"
                min={1}
                max={12}
                value={m2}
                onChange={(e) => setM2(Math.min(12, Math.max(1, Number(e.target.value) || m2)))}
                className={numerologyInputClassName}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[9px] text-[#94a3b8]">日</span>
              <input
                type="number"
                min={1}
                max={31}
                value={d2}
                onChange={(e) => setD2(Math.min(31, Math.max(1, Number(e.target.value) || d2)))}
                className={numerologyInputClassName}
              />
            </label>
          </div>
          <p className="mt-4 text-3xl tabular-nums text-[#f1f5f9]">{lpB}</p>
        </NumerologyGlassCard>
      </div>

      <NumerologyGlassCard>
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#9eb4c8]/55">对照摘要</p>
        <p className={`mt-4 text-[14px] leading-[1.85] text-[#cbd5e1] ${zhSerif.className}`}>{line}</p>
      </NumerologyGlassCard>
    </div>
  );
}
