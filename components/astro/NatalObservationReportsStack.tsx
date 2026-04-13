import type { AngleAspectObservationReport } from "@/lib/astro-angle-aspect-report-zh";
import type { ObservationPanelTitlesZh } from "@/lib/astro-eight-chart-view-copy-zh";
import type { HouseCuspObservationReport } from "@/lib/astro-house-cusp-report-zh";
import type { MajorAspectObservationReport } from "@/lib/astro-major-aspect-report-zh";
import type { MinorAspectObservationReport } from "@/lib/astro-minor-aspect-report-zh";
import type { PlanetPositionsObservationReport } from "@/lib/astro-planet-positions-report-zh";
import {
  NatalAngleAspectReportPanel,
  NatalHouseCuspReportPanel,
  NatalMajorAspectReportPanel,
  NatalMinorAspectReportPanel,
  NatalPlanetPositionsReportPanel,
} from "@/components/astro/natal-observation-report-panels";

export type NatalObservationReportsStackProps = {
  planetPositionsReport: PlanetPositionsObservationReport | null;
  majorAspectReport: MajorAspectObservationReport | null;
  houseCuspReport: HouseCuspObservationReport | null;
  minorAspectReport: MinorAspectObservationReport | null;
  angleAspectReport: AngleAspectObservationReport | null;
  /** 八种盘型下各五联卡顶栏标题；缺省用出生盘默认标题 */
  panelTitles?: ObservationPanelTitlesZh | null;
};

export function NatalObservationReportsStack({
  planetPositionsReport,
  majorAspectReport,
  houseCuspReport,
  minorAspectReport,
  angleAspectReport,
  panelTitles = null,
}: NatalObservationReportsStackProps) {
  if (
    !planetPositionsReport &&
    !majorAspectReport &&
    !houseCuspReport &&
    !minorAspectReport &&
    !angleAspectReport
  ) {
    return null;
  }

  return (
    <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
      {planetPositionsReport ? (
        <NatalPlanetPositionsReportPanel
          report={planetPositionsReport}
          panelHeading={panelTitles?.planet}
        />
      ) : null}
      {majorAspectReport ? (
        <NatalMajorAspectReportPanel report={majorAspectReport} panelHeading={panelTitles?.major} />
      ) : null}
      {houseCuspReport ? (
        <NatalHouseCuspReportPanel report={houseCuspReport} panelHeading={panelTitles?.house} />
      ) : null}
      {minorAspectReport ? (
        <NatalMinorAspectReportPanel report={minorAspectReport} panelHeading={panelTitles?.minor} />
      ) : null}
      {angleAspectReport ? (
        <NatalAngleAspectReportPanel report={angleAspectReport} panelHeading={panelTitles?.angle} />
      ) : null}
    </div>
  );
}
