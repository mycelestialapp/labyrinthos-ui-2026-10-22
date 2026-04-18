"use client";

import { parseMirrorHandbookText } from "@/lib/numerology-mirror-handbook-parse";

type Props = {
  text: string;
  /** 正文主色 */
  bodyClassName?: string;
  /** 小节题颜色 */
  labelClassName?: string;
  className?: string;
};

/**
 * 镜鉴/手册体：把【小节】从正文中抬成弱标题，避免一坨等宽字墙。
 */
export function NumerologyMirrorHandbook({
  text,
  className = "",
  bodyClassName = "text-[13px] leading-[1.68] text-[#d4dfe6]",
  labelClassName = "text-[10px] font-medium tracking-[0.2em] text-[#6f8294]",
}: Props) {
  const segments = parseMirrorHandbookText(text);
  return (
    <div className={`space-y-1.5 ${className}`}>
      {segments.map((s, i) => (
        <div key={`${s.labelFull}-${i}`} className="min-w-0">
          {s.labelDisplay ? <p className={`mb-0.5 ${labelClassName}`}>{s.labelDisplay}</p> : null}
          {s.body ? <p className={`whitespace-pre-line ${bodyClassName}`}>{s.body}</p> : null}
        </div>
      ))}
    </div>
  );
}

/** 镜鉴单列：顶栏中文题 + 内层手册排版 */
export function NumerologyMirrorChapterCard({
  chapterTitle,
  text,
  serifClassName,
  className = "",
}: {
  chapterTitle: string;
  text: string;
  serifClassName: string;
  /** 横排栅格时传入 min-w-0 flex-1 等 */
  className?: string;
}) {
  return (
    <section
      className={`flex min-h-0 min-w-0 flex-col rounded-xl border border-[rgba(168,188,208,0.14)] bg-[rgba(10,16,24,0.72)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] antialiased [text-rendering:optimizeLegibility] ${serifClassName} ${className}`}
    >
      <p className="numerology-mirror-chapter-3d mb-1.5 border-b border-[rgba(168,188,208,0.1)] pb-1 text-[11px] font-semibold tracking-[0.22em]">
        {chapterTitle}
      </p>
      <NumerologyMirrorHandbook
        text={text}
        bodyClassName="numerology-mirror-body-relief text-[12px] leading-[1.78] text-[#e8eef5] xl:text-[13px] xl:leading-[1.82]"
        labelClassName="numerology-mirror-label-relief text-[10px] font-medium tracking-[0.18em] text-[#8a9cb0]"
      />
    </section>
  );
}
