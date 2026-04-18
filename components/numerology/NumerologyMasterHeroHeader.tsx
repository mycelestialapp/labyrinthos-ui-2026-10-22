"use client";

function MasterHexSeal({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <polygon
        points="28,5 48.5,17 48.5,39 28,51 7.5,39 7.5,17"
        stroke="currentColor"
        strokeWidth="1.1"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 寰宇之门首卡顶栏：角框 + 六角徽 + 序号 + 主副题（与神谕卡式大师板同源） */
export function NumerologyMasterHeroHeader({
  stepIndex,
  title,
  subtitle,
  titleSerifClassName,
  subtitleSerifClassName,
  displaySerifClassName,
}: {
  stepIndex: string;
  title: string;
  subtitle: string;
  titleSerifClassName: string;
  subtitleSerifClassName: string;
  displaySerifClassName: string;
}) {
  return (
    <header className="numerology-master-hero-header relative mb-5 min-w-0 border-b border-[rgba(197,160,89,0.14)] pb-5 sm:mb-6 sm:pb-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-[inherit]" aria-hidden>
        <span className="numerology-master-corner numerology-master-corner--tl" />
        <span className="numerology-master-corner numerology-master-corner--br" />
      </div>
      <span
        className={`numerology-master-hero-step pointer-events-none absolute right-0 top-0 text-[12px] tabular-nums tracking-[0.12em] text-[#c9a86a]/80 sm:text-[13px] ${displaySerifClassName}`}
        aria-hidden
      >
        {stepIndex}
      </span>
      <div className="relative mx-auto flex max-w-[42rem] flex-col items-center gap-2.5 px-2 pt-1 text-center sm:gap-3">
        <MasterHexSeal className="h-9 w-9 shrink-0 text-[#d4b87a] opacity-[0.92] sm:h-10 sm:w-10" />
        <h1
          className={`numerology-master-plate-title text-[1.2rem] font-semibold tracking-[0.22em] text-[#e8d4a8] sm:text-[1.45rem] sm:tracking-[0.26em] ${titleSerifClassName}`}
        >
          {title}
        </h1>
        <p
          className={`max-w-[min(100%,26rem)] text-pretty text-[12px] leading-[1.72] tracking-[0.06em] text-[#b8a078]/95 sm:text-[13px] sm:leading-[1.75] ${subtitleSerifClassName}`}
        >
          {subtitle}
        </p>
      </div>
    </header>
  );
}
