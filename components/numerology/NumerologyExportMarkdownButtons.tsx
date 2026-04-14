"use client";

import { useCallback, useState } from "react";
import { buildNumerologyWorkspaceMarkdown, type NumerologyMarkdownInput } from "@/lib/numerology-export-markdown";

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function NumerologyExportMarkdownButtons({ source }: { source: NumerologyMarkdownInput }) {
  const [hint, setHint] = useState<string | null>(null);

  const md = buildNumerologyWorkspaceMarkdown(source);
  const fname = `numerology-${source.y}${String(source.m).padStart(2, "0")}${String(source.d).padStart(2, "0")}.md`;

  const copy = useCallback(async () => {
    setHint(null);
    try {
      await navigator.clipboard.writeText(md);
      setHint("已复制到剪贴板");
      window.setTimeout(() => setHint(null), 2400);
    } catch {
      setHint("复制失败，可改用下载");
      window.setTimeout(() => setHint(null), 3200);
    }
  }, [md]);

  const download = useCallback(() => {
    setHint(null);
    downloadText(fname, md);
    setHint("已下载 Markdown");
    window.setTimeout(() => setHint(null), 2400);
  }, [fname, md]);

  return (
    <div className="mt-6 flex flex-col gap-2 border-t border-[rgba(168,188,208,0.1)] pt-6 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded-lg border-[0.5px] border-[rgba(168,188,208,0.35)] px-3 py-2 text-[10px] tracking-[0.12em] text-[#9eb4c8] transition-colors hover:border-[rgba(168,188,208,0.55)] hover:text-[#f1f5f9]"
        >
          复制 Markdown
        </button>
        <button
          type="button"
          onClick={download}
          className="rounded-lg border-[0.5px] border-[rgba(168,188,208,0.35)] px-3 py-2 text-[10px] tracking-[0.12em] text-[#9eb4c8] transition-colors hover:border-[rgba(168,188,208,0.55)] hover:text-[#f1f5f9]"
        >
          下载 .md
        </button>
      </div>
      {hint ? <p className="text-[10px] text-[#94a3b8]">{hint}</p> : null}
    </div>
  );
}
