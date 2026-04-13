import type { ReactNode } from "react";
import type { AngleAspectObservationReport } from "@/lib/astro-angle-aspect-report-zh";
import type { HouseCuspObservationReport } from "@/lib/astro-house-cusp-report-zh";
import type { MajorAspectObservationReport } from "@/lib/astro-major-aspect-report-zh";
import type { MinorAspectObservationReport } from "@/lib/astro-minor-aspect-report-zh";
import type { PlanetPositionsObservationReport } from "@/lib/astro-planet-positions-report-zh";

/** 星盘数据各折叠块下方：与表格分隔、解读始终可见 */
export function NatalObservationReportInlineBlock({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 border-t border-[#C5A059]/14 pt-3 text-[13px] leading-relaxed text-zinc-300">
      {children}
    </div>
  );
}

export function NatalPlanetPositionsReportPanel({
  report,
  panelHeading = "行星位置（Planetary Positions）观测报告",
}: {
  report: PlanetPositionsObservationReport;
  panelHeading?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[#C5A059]/20 bg-[#C5A059]/8 px-3 py-2.5">
        <p className="text-xs text-zinc-500">{panelHeading}</p>
        <p className="mt-1 text-sm text-zinc-300">{report.statusLine}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【核心快照】</p>
        <p>发生了什么：{report.answer.happened}</p>
        <p>{report.answer.core}</p>
        <p>{report.answer.risk}</p>
        <p>{report.answer.today}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【逻辑推演】</p>
        {report.pro.sunMars ? <p>{report.pro.sunMars}</p> : null}
        {report.pro.moonVenus ? <p>{report.pro.moonVenus}</p> : null}
        {report.pro.mercuryJupiter.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【原始读数】</p>
        <p>{report.precision.matrix}</p>
        {report.precision.clusters.map((c) => (
          <div key={c.title} className="space-y-1">
            <p>{c.title}</p>
            {c.lines.map((ln, j) => (
              <p key={`${c.title}-${j}`} className="pl-1 text-zinc-400">
                {ln}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【执行备忘】</p>
        <p>{report.actions[0]}</p>
        <p>{report.actions[1]}</p>
        <p>{report.actions[2]}</p>
      </div>
    </div>
  );
}

export function NatalMajorAspectReportPanel({
  report,
  panelHeading = "盘内主相位（Major Aspects）观测报告",
}: {
  report: MajorAspectObservationReport;
  panelHeading?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[#C5A059]/20 bg-[#C5A059]/8 px-3 py-2.5">
        <p className="text-xs text-zinc-500">{panelHeading}</p>
        <p className="mt-1 text-sm text-zinc-300">{report.statusLine}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【核心快照】</p>
        <p>发生了什么：{report.answer.happened}</p>
        <p>风险是什么：{report.answer.risk}</p>
        <p>协同建议：{report.answer.synergy}</p>
        <p>今天怎么做：{report.answer.today}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【逻辑推演】</p>
        <p>{report.pro.center}</p>
        <p>{report.pro.conflict}</p>
        <p>{report.pro.drive}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【原始读数】</p>
        <p>{report.precision.matrix}</p>
        <p>极紧密耦合：{report.precision.tight.join("；") || "无"}</p>
        <p>张力偏紧：{report.precision.tension.join("；") || "无"}</p>
        <p>背景微扰：{report.precision.noise.join("；") || "无"}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【执行备忘】</p>
        <p>{report.actions[0]}</p>
        <p>{report.actions[1]}</p>
        <p>{report.actions[2]}</p>
      </div>
    </div>
  );
}

export function NatalHouseCuspReportPanel({
  report,
  panelHeading = "十二宫宫头（House Cusps）观测报告",
}: {
  report: HouseCuspObservationReport;
  panelHeading?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[#C5A059]/20 bg-[#C5A059]/8 px-3 py-2.5">
        <p className="text-xs text-zinc-500">{panelHeading}</p>
        <p className="mt-1 text-sm text-zinc-300">{report.statusLine}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【核心快照】</p>
        <p>发生了什么：{report.answer.happened}</p>
        <p>核心特征：{report.answer.core}</p>
        <p>风险点：{report.answer.risk}</p>
        <p>今天怎么做：{report.answer.today}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【逻辑推演】</p>
        <p>{report.pro.asc}</p>
        <p>{report.pro.valueAxis}</p>
        <p>{report.pro.mc}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【原始读数】</p>
        <p>{report.precision.matrix}</p>
        <p>关键锚点：{report.precision.anchors.join("；")}</p>
        <p>关键转折：{report.precision.turns.join("；")}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【执行备忘】</p>
        <p>{report.actions[0]}</p>
        <p>{report.actions[1]}</p>
        <p>{report.actions[2]}</p>
      </div>
    </div>
  );
}

export function NatalMinorAspectReportPanel({
  report,
  panelHeading = "盘内次要相位（Minor Aspects）观测报告",
}: {
  report: MinorAspectObservationReport;
  panelHeading?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[#C5A059]/20 bg-[#C5A059]/8 px-3 py-2.5">
        <p className="text-xs text-zinc-500">{panelHeading}</p>
        <p className="mt-1 text-sm text-zinc-300">{report.statusLine}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【核心快照】</p>
        <p>发生了什么：{report.answer.happened}</p>
        <p>{report.answer.risk}</p>
        <p>{report.answer.synergy}</p>
        <p>{report.answer.today}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【逻辑推演】</p>
        <p>{report.pro.compensation}</p>
        <p>{report.pro.friction}</p>
        <p>{report.pro.coordination}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【原始读数】</p>
        <p>{report.precision.matrix}</p>
        <p>高频补偿：{report.precision.highFreq.join("；")}</p>
        <p>低频干扰：{report.precision.lowFreq.join("；")}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【执行备忘】</p>
        <p>{report.actions[0]}</p>
        <p>{report.actions[1]}</p>
        <p>{report.actions[2]}</p>
      </div>
    </div>
  );
}

export function NatalAngleAspectReportPanel({
  report,
  panelHeading = "星体与上升 / 天顶（Angles Aspects）观测报告",
}: {
  report: AngleAspectObservationReport;
  panelHeading?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[#C5A059]/20 bg-[#C5A059]/8 px-3 py-2.5">
        <p className="text-xs text-zinc-500">{panelHeading}</p>
        <p className="mt-1 text-sm text-zinc-300">{report.statusLine}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【核心快照】</p>
        <p>发生了什么：{report.answer.happened}</p>
        <p>{report.answer.risk}</p>
        <p>{report.answer.synergy}</p>
        <p>{report.answer.today}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【逻辑推演】</p>
        <p>{report.pro.socialFriction}</p>
        <p>{report.pro.entryPressure}</p>
        <p>{report.pro.interfaceMicroAdjust}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【原始读数】</p>
        <p>{report.precision.matrix}</p>
        <p>主轴高压：{report.precision.major.join("；")}</p>
        <p>边缘补偿：{report.precision.minor.join("；")}</p>
      </div>
      <div className="space-y-2 border-l-2 border-[#C5A059]/25 pl-3">
        <p className="text-xs font-medium text-[#C5A059]">【执行备忘】</p>
        <p>{report.actions[0]}</p>
        <p>{report.actions[1]}</p>
        <p>{report.actions[2]}</p>
      </div>
    </div>
  );
}
