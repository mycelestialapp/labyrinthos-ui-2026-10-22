"use client";

import { Noto_Serif_SC } from "next/font/google";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNumerologyWorkspace } from "@/components/numerology/NumerologyWorkspaceProvider";
import { NumerologyGlassCard, numerologyInputClassName } from "@/components/numerology/numerology-shared-ui";
import {
  loadNumerologyArchive,
  saveNumerologyArchive,
  type NumerologyArchiveEntry,
} from "@/lib/numerology-archive-storage";
import { buildNumerologyMarkdownFromSnapshot } from "@/lib/numerology-export-markdown";
import { lifePathNumber } from "@/lib/numerology-pythagorean";

const zhSerif = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/** 智慧档案：浏览器本地保存 / 载入工作台生辰快照 */
export function NumerologyArchiveView() {
  const { y, m, d, nameLatin, replaceWorkspace, calendarYear } = useNumerologyWorkspace();
  const [entries, setEntries] = useState<NumerologyArchiveEntry[]>([]);
  const [note, setNote] = useState("");
  const [mounted, setMounted] = useState(false);
  const [exportHint, setExportHint] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setEntries(loadNumerologyArchive());
      setMounted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: NumerologyArchiveEntry[]) => {
    setEntries(next);
    saveNumerologyArchive(next);
  }, []);

  const snapshot = useMemo(() => ({ y, m, d, nameLatin }), [y, m, d, nameLatin]);

  const handleSave = () => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const entry: NumerologyArchiveEntry = {
      id,
      savedAt: new Date().toISOString(),
      note: note.trim() || "未命名快照",
      snapshot: { ...snapshot },
    };
    persist([entry, ...entries]);
    setNote("");
  };

  const handleLoad = (e: NumerologyArchiveEntry) => {
    replaceWorkspace(e.snapshot);
  };

  const handleDelete = (id: string) => {
    persist(entries.filter((x) => x.id !== id));
  };

  const exportEntryMd = (e: NumerologyArchiveEntry) => {
    const text = buildNumerologyMarkdownFromSnapshot(e.snapshot, calendarYear);
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `numerology-archive-${e.id.slice(0, 12)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllZipHint = async () => {
    setExportHint(null);
    if (entries.length === 0) return;
    try {
      const parts = entries.map((e, i) => ({
        name: `${i + 1}-${e.note.replace(/[/\\?%*:|"<>]/g, "_").slice(0, 40) || "snapshot"}.md`,
        body: buildNumerologyMarkdownFromSnapshot(e.snapshot, calendarYear),
      }));
      const combined = parts.map((p) => `---\nfile: ${p.name}\n---\n\n${p.body}`).join("\n\n");
      await navigator.clipboard.writeText(combined);
      setExportHint("已全部合并复制到剪贴板（多段以 --- 分隔）；单条请用各卡片「导出」。");
    } catch {
      setExportHint("批量复制失败，请逐条导出。");
    }
    window.setTimeout(() => setExportHint(null), 4200);
  };

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      <NumerologyGlassCard>
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#9eb4c8]/55">智慧档案</p>
        <p className={`mt-3 text-[13px] leading-relaxed text-[#cbd5e1] ${zhSerif.className}`}>
          快照保存在本机浏览器（localStorage），清除站点数据会一并丢失；不涉及服务器账号。
        </p>
        <label className="mt-4 block">
          <span className="text-[9px] text-[#94a3b8]">备注（可选）</span>
          <input
            value={note}
            onChange={(ev) => setNote(ev.target.value)}
            placeholder="例如：本命盘备份"
            className={`${numerologyInputClassName} mt-1 !text-left`}
            maxLength={80}
          />
        </label>
        <button
          type="button"
          onClick={handleSave}
          className="mt-4 w-full rounded-xl border-[0.5px] border-[rgba(168,188,208,0.35)] py-2.5 text-[11px] tracking-[0.2em] text-[#9eb4c8] transition-colors hover:border-[rgba(168,188,208,0.55)] hover:text-[#f1f5f9]"
        >
          保存当前工作台
        </button>
        {mounted && entries.length > 0 ? (
          <button
            type="button"
            onClick={() => void exportAllZipHint()}
            className="mt-2 w-full rounded-xl border-[0.5px] border-[rgba(168,188,208,0.22)] py-2 text-[10px] tracking-[0.12em] text-[#94a3b8] hover:border-[rgba(168,188,208,0.4)]"
          >
            合并复制全部快照（剪贴板）
          </button>
        ) : null}
        {exportHint ? <p className="mt-2 text-[10px] text-[#94a3b8]">{exportHint}</p> : null}
      </NumerologyGlassCard>

      {!mounted ? null : entries.length === 0 ? (
        <NumerologyGlassCard>
          <p className="text-[13px] text-[#94a3b8]">暂无条目。在寰宇之门调好生辰后，回到此处保存。</p>
        </NumerologyGlassCard>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => {
            const lp = lifePathNumber(e.snapshot.m, e.snapshot.d, e.snapshot.y);
            return (
              <li key={e.id}>
                <NumerologyGlassCard className="!py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-[#f1f5f9]">{e.note}</p>
                      <p className="mt-1 text-[10px] text-[#94a3b8]">
                        {e.snapshot.y}-{String(e.snapshot.m).padStart(2, "0")}-{String(e.snapshot.d).padStart(2, "0")}
                        {e.snapshot.nameLatin ? ` · ${e.snapshot.nameLatin}` : ""} · 主路径 {lp}
                      </p>
                      <p className="mt-1 text-[9px] text-[#64748b]">{new Date(e.savedAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoad(e)}
                        className="rounded-lg border-[0.5px] border-[rgba(168,188,208,0.35)] px-3 py-1.5 text-[10px] text-[#9eb4c8] hover:border-[rgba(168,188,208,0.55)]"
                      >
                        载入工作台
                      </button>
                      <button
                        type="button"
                        onClick={() => exportEntryMd(e)}
                        className="rounded-lg border-[0.5px] border-[rgba(168,188,208,0.25)] px-3 py-1.5 text-[10px] text-[#9eb4c8] hover:border-[rgba(168,188,208,0.45)]"
                      >
                        导出 .md
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(e.id)}
                        className="rounded-lg border-[0.5px] border-[rgba(248,113,113,0.25)] px-3 py-1.5 text-[10px] text-[#fca5a5]/90 hover:border-[rgba(248,113,113,0.45)]"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </NumerologyGlassCard>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
