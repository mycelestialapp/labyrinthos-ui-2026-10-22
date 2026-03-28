"use client";

import React, { useMemo, useSyncExternalStore } from "react";

const WIDE_MQ = "(min-width: 768px)";

function subscribeWide(cb: () => void) {
  const mq = window.matchMedia(WIDE_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getWideSnapshot(): boolean {
  return typeof window !== "undefined" && window.matchMedia(WIDE_MQ).matches;
}

function getWideServerSnapshot(): boolean {
  return false;
}

function inlineBold(text: string, keyPrefix: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-[#EDE5D8]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (!part) return null;
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

/** 供 summary 纯文本展示 */
function stripMdBold(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, "$1");
}

export type MarkdownSection = { title: string; body: string };

/** 按二级标题切块（正文里不再含 ##，由外层渲染标题） */
export function splitMarkdownByH2(source: string): { preamble: string; sections: MarkdownSection[] } {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const preambleLines: string[] = [];
  const sections: MarkdownSection[] = [];
  let currentTitle: string | null = null;
  const currentBody: string[] = [];

  const flush = () => {
    if (currentTitle !== null) {
      sections.push({ title: currentTitle, body: currentBody.join("\n").trim() });
      currentBody.length = 0;
    }
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentTitle === null) {
        // 第一个 ## 之前为前言（引用、短句等）
      } else {
        flush();
      }
      currentTitle = line.slice(3).trim();
    } else if (currentTitle === null) {
      preambleLines.push(line);
    } else {
      currentBody.push(line);
    }
  }
  flush();

  return {
    preamble: preambleLines.join("\n").trim(),
    sections,
  };
}

function parseBlocks(source: string): React.ReactNode[] {
  const lines = source.split("\n");
  const out: React.ReactNode[] = [];
  let k = 0;
  const listBuf: string[] = [];

  const flushList = () => {
    if (!listBuf.length) return;
    const lid = k++;
    out.push(
      <ul key={`ul-${lid}`} className="my-2 list-disc space-y-1.5 pl-4 text-left marker:text-[#D4AF37]/50">
        {listBuf.map((item, j) => (
          <li key={j} className="text-[13px] leading-relaxed md:text-[14px]">
            {inlineBold(item, `li-${lid}-${j}`)}
          </li>
        ))}
      </ul>
    );
    listBuf.length = 0;
  };

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trimEnd();

    if (t.trim() === "") {
      flushList();
      continue;
    }

    if (t === "---") {
      flushList();
      out.push(<hr key={`hr-${k++}`} className="my-4 border-[#D4AF37]/15" />);
      continue;
    }

    if (t.startsWith("## ")) {
      flushList();
      const text = t.slice(3);
      const id = k++;
      out.push(
        <h2
          key={`h2-${id}`}
          className="mt-5 text-left text-[13px] font-semibold tracking-[0.12em] text-[#D4AF37]/90 first:mt-0 md:text-[14px]"
        >
          {inlineBold(text, `h2-${id}`)}
        </h2>
      );
      continue;
    }

    if (t.startsWith("### ")) {
      flushList();
      const text = t.slice(4);
      const id = k++;
      out.push(
        <h3
          key={`h3-${id}`}
          className="mt-4 text-left text-[12px] font-medium tracking-[0.1em] text-zinc-300 md:text-[13px]"
        >
          {inlineBold(text, `h3-${id}`)}
        </h3>
      );
      continue;
    }

    if (t.startsWith("> ")) {
      flushList();
      const id = k++;
      out.push(
        <blockquote
          key={`bq-${id}`}
          className="my-3 border-l-2 border-[#D4AF37]/35 pl-3 text-left text-[12px] leading-relaxed italic text-zinc-400 md:text-[13px]"
        >
          {inlineBold(t.slice(2), `bq-${id}`)}
        </blockquote>
      );
      continue;
    }

    if (t.startsWith("- ")) {
      listBuf.push(t.slice(2));
      continue;
    }

    flushList();
    const pid = k++;
    out.push(
      <p
        key={`p-${pid}`}
        className="mt-2 text-left text-[13px] leading-[1.75] text-zinc-300 first:mt-0 md:text-[14px]"
      >
        {inlineBold(t, `p-${pid}`)}
      </p>
    );
  }
  flushList();
  return out;
}

export default function NatalReadingMarkdown({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const wide = useSyncExternalStore(subscribeWide, getWideSnapshot, getWideServerSnapshot);

  const { preamble, sections } = useMemo(() => splitMarkdownByH2(source), [source]);

  const preambleNodes = useMemo(
    () => (preamble ? parseBlocks(preamble) : null),
    [preamble]
  );

  const sectionBlocks = useMemo(() => {
    return sections.map((sec) => ({
      title: sec.title,
      titlePlain: stripMdBold(sec.title),
      nodes: parseBlocks(sec.body),
    }));
  }, [sections]);

  return (
    <div className={className} suppressHydrationWarning>
      {!wide && sections.length > 0 ? (
        <p className="mb-3 text-left text-[10px] leading-relaxed tracking-[0.08em] text-zinc-500 md:hidden">
          手机端：各章默认收起；正文已为精简版，仍可按需点开。
        </p>
      ) : null}

      {preambleNodes}

      {wide
        ? sectionBlocks.map((sec, i) => (
            <section key={`sec-${i}`}>
              <h2 className="mt-5 text-left text-[13px] font-semibold tracking-[0.12em] text-[#D4AF37]/90 first:mt-0 md:mt-6 md:text-[14px]">
                {inlineBold(sec.title, `h2w-${i}`)}
              </h2>
              <div>{sec.nodes}</div>
            </section>
          ))
        : sectionBlocks.map((sec, i) => (
            <details
              key={`det-${i}`}
              className="mb-2 rounded-lg border border-[#D4AF37]/18 bg-black/22 px-3 py-2 text-left open:border-[#D4AF37]/28"
            >
              <summary className="cursor-pointer list-none py-1 [&::-webkit-details-marker]:hidden">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-left text-[12px] font-semibold tracking-[0.1em] text-[#D4AF37]/88">
                    {sec.titlePlain}
                  </span>
                  <span className="shrink-0 pt-0.5 text-[9px] tracking-[0.12em] text-zinc-500">展开</span>
                </div>
              </summary>
              <div className="border-t border-[#D4AF37]/10 pb-1 pt-3">{sec.nodes}</div>
            </details>
          ))}
    </div>
  );
}
