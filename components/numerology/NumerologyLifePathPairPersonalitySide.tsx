"use client";

import { lifePathSideManualParagraphsZh } from "@/lib/numerology-life-path-side-manual-zh";

type BlockProps = {
  role: "我" | "对方";
  lp: number;
  serifClassName: string;
};

function PathPersonalityBlock({ role, lp, serifClassName }: BlockProps) {
  const { ancient, glance, principle } = lifePathSideManualParagraphsZh(lp);
  return (
    <div className="min-w-0 rounded-xl border border-[rgba(148,163,184,0.12)] bg-[rgba(8,12,20,0.45)] px-4 py-4 sm:px-5 sm:py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <p className={`text-[14px] font-medium tracking-wide text-[#cbd5e1] sm:text-[15px] ${serifClassName}`}>
          {role} · 主路径{" "}
          <span className="tabular-nums text-[17px] font-semibold text-[#f8fafc] sm:text-lg">{lp}</span>
        </p>
      </div>
      <p
        className={`mt-2.5 text-[12px] leading-relaxed text-[#94a3b8] sm:text-[13px] ${serifClassName}`}
      >
        主路径 <span className="tabular-nums font-semibold text-[#e2e8f0]">{lp}</span>{" "}
        在<strong className="font-medium text-[#cbd5e1]">生命密码</strong>
        （毕达哥拉斯归一）里，是生日一路化约后的<strong className="font-medium text-[#cbd5e1]">路线名</strong>
        ：像一条河的名字，不是「生日数」那一格，也不是姓名里那几条支流。
      </p>
      <div
        className={`mt-3 space-y-2.5 text-[13px] leading-relaxed text-[#e2e8f0] sm:text-sm sm:leading-relaxed ${serifClassName}`}
      >
        <p className="text-pretty">{ancient}</p>
        <p className="text-pretty">{glance}</p>
        <p className="text-pretty">{principle}</p>
      </div>
    </div>
  );
}

type Props = {
  lpA: number;
  lpB: number;
  serifClassName: string;
  className?: string;
};

/**
 * 共鸣侧栏：按「我 / 对方」各自主路径换**手册级三段**（古法数象 / 气质 / 来由），定稿见 `numerology-life-path-side-manual-zh`。
 */
export function NumerologyLifePathPairPersonalitySide({ lpA, lpB, serifClassName, className = "" }: Props) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-4 ${className}`}
      role="region"
      aria-label={`双人主路径 ${lpA} 与 ${lpB} 生命密码提要`}
    >
      <p
        className={`w-full text-center text-[15px] font-medium tracking-wide text-[#f1f5f9] sm:text-base ${serifClassName}`}
      >
        主路径与生命密码
      </p>

      <PathPersonalityBlock role="我" lp={lpA} serifClassName={serifClassName} />
      <PathPersonalityBlock role="对方" lp={lpB} serifClassName={serifClassName} />
    </div>
  );
}
