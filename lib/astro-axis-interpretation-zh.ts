import {
  PLANET_NAME_ZH,
  formatLongitudeInSignZh,
  houseNumberForLongitude,
  type AstroAngleAspectDatum,
  type AstroAspectDatum,
  type AstroChartWheelData,
} from "@/lib/astro-chart-wheel";
import { aspectTypeLabelZh } from "@/lib/astro-aspect-type-label-zh";
import { ZODIAC_CN } from "@/lib/natal-chart";
import type { ChartKindId } from "@/lib/astro-chart-kinds";
import {
  axisProMoonEmotionalTailForVoice,
  axisProMoonMcNoVocal,
  axisProMoonMcYesVocal,
  axisProSatAscNoVocal,
  axisProSatAscYesVocal,
  axisProSunMarsNoVocal,
  axisProSunMarsYesVocal,
  axisProTightMinorNoVocal,
  axisProTightMinorYesVocal,
  axisRegularFrictionWrapVocal,
  axisRegularNoFrictionVocal,
  axisRegularNoSunMarsVocal,
  axisRegularSunMarsLineVocal,
  axisRegularTightMinorNoVocal,
  axisRegularTightMinorYesVocal,
} from "@/lib/astro-axis-interpretation-body-voice-zh";
import {
  axisProfessionalFirstLineForVoice,
  axisProfessionalReadOrderForVoice,
  axisRegularAxesBridgeForVoice,
  axisRegularOpeningForVoice,
} from "@/lib/astro-axis-interpretation-voice-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

function resolveChartKind(chart: AstroChartWheelData, explicit?: ChartKindId): ChartKindId {
  const id = chart.chartKindMeta?.id;
  if (explicit) return explicit;
  if (
    id === "natal" ||
    id === "synastry" ||
    id === "transit" ||
    id === "ephemeris" ||
    id === "secondary" ||
    id === "tertiary" ||
    id === "solar_return" ||
    id === "lunar_return"
  ) {
    return id;
  }
  return "natal";
}

function sunMarsPlatePhraseZh(kind: ChartKindId): string {
  switch (kind) {
    case "natal":
      return "在本命盘里";
    case "synastry":
      return "在案主本命盘里";
    case "transit":
      return "在当前行运盘里";
    case "ephemeris":
      return "在这张时刻盘里";
    case "secondary":
    case "tertiary":
      return "在这张推进盘里";
    case "solar_return":
      return "在这张日返盘里";
    case "lunar_return":
      return "在这张月返盘里";
    default: {
      const _e: never = kind;
      return _e;
    }
  }
}

function moonProfessionalTagZh(kind: ChartKindId): string {
  switch (kind) {
    case "natal":
      return "本命月亮";
    case "synastry":
      return "案主本命月亮";
    case "transit":
      return "行运盘月亮";
    case "ephemeris":
      return "此刻盘月亮";
    case "secondary":
    case "tertiary":
      return "推进盘月亮";
    case "solar_return":
      return "日返盘月亮";
    case "lunar_return":
      return "月返盘月亮";
    default: {
      const _e: never = kind;
      return _e;
    }
  }
}

export type AxisInterpretationZh = {
  regular: string;
  professional: string;
};

function normDeg(d: number): number {
  return ((d % 360) + 360) % 360;
}

function pickTightest<T extends { orbDeg: number }>(rows: T[]): T | null {
  if (rows.length === 0) return null;
  return [...rows].sort((a, b) => a.orbDeg - b.orbDeg)[0] ?? null;
}

function findAspect(
  rows: AstroAspectDatum[],
  a: AstroAspectDatum["a"],
  b: AstroAspectDatum["b"],
  type: AstroAspectDatum["type"],
): AstroAspectDatum | null {
  return (
    rows.find((r) => ((r.a === a && r.b === b) || (r.a === b && r.b === a)) && r.type === type) ??
    null
  );
}

function findAngleAspect(
  rows: AstroAngleAspectDatum[],
  planet: AstroAngleAspectDatum["planet"],
  axis: AstroAngleAspectDatum["axis"],
  type: AstroAngleAspectDatum["type"],
): AstroAngleAspectDatum | null {
  return rows.find((r) => r.planet === planet && r.axis === axis && r.type === type) ?? null;
}

export function buildAxisInterpretationZh(
  chart: AstroChartWheelData | null,
  chartKind?: ChartKindId,
  voiceStyleId: VoiceStyleIdZh = 1,
): AxisInterpretationZh | null {
  if (!chart) return null;

  const kind = resolveChartKind(chart, chartKind);

  const ascText = formatLongitudeInSignZh(chart.ascLonDeg).text;
  const mcText = formatLongitudeInSignZh(chart.mcLonDeg).text;
  const dscText = formatLongitudeInSignZh(normDeg(chart.ascLonDeg + 180)).text;
  const icText = formatLongitudeInSignZh(normDeg(chart.mcLonDeg + 180)).text;

  const sun = chart.planets.find((p) => p.id === "sun");
  const moon = chart.planets.find((p) => p.id === "moon");
  const sunHouse = sun ? houseNumberForLongitude(sun.lonDeg, chart.houseCuspsLonDeg) : null;
  const sunMarsConj = findAspect(chart.aspects ?? [], "sun", "mars", "conjunction");

  const moonMcSquare = findAngleAspect(chart.angleAspectsMajor ?? [], "moon", "mc", "square");
  const satAscSquare = findAngleAspect(chart.angleAspectsMajor ?? [], "saturn", "asc", "square");
  const tightMinor = pickTightest(chart.minorAspects ?? []);

  const frictionMid = [
    moonMcSquare ? `月亮四分天顶（${moonMcSquare.orbDeg.toFixed(2)}°）` : "",
    satAscSquare ? `土星四分上升（${satAscSquare.orbDeg.toFixed(2)}°）` : "",
  ]
    .filter(Boolean)
    .join("，");

  const minorDetailPro = tightMinor
    ? `${PLANET_NAME_ZH[tightMinor.a]}${aspectTypeLabelZh(tightMinor.type)}${PLANET_NAME_ZH[tightMinor.b]}（orb ${tightMinor.orbDeg.toFixed(2)}°）`
    : "";
  const minorAspectRegular = tightMinor
    ? `${PLANET_NAME_ZH[tightMinor.a]}${aspectTypeLabelZh(tightMinor.type)}${PLANET_NAME_ZH[tightMinor.b]}（${tightMinor.orbDeg.toFixed(2)}°）`
    : "";

  const regular = [
    axisRegularOpeningForVoice(kind, voiceStyleId),
    axisRegularAxesBridgeForVoice(voiceStyleId, {
      asc: ascText,
      mc: mcText,
      dsc: dscText,
      ic: icText,
    }),
    sunMarsConj && sunHouse
      ? axisRegularSunMarsLineVocal(
          voiceStyleId,
          sunMarsPlatePhraseZh(kind),
          sunMarsConj.orbDeg.toFixed(2),
          sunHouse,
        )
      : axisRegularNoSunMarsVocal(voiceStyleId),
    moonMcSquare || satAscSquare
      ? axisRegularFrictionWrapVocal(voiceStyleId, frictionMid)
      : axisRegularNoFrictionVocal(voiceStyleId),
    tightMinor
      ? axisRegularTightMinorYesVocal(voiceStyleId, minorAspectRegular)
      : axisRegularTightMinorNoVocal(voiceStyleId),
  ].join("");

  const sunMarsHouseClause =
    sunMarsConj && sunHouse ? `，落点靠近 ${sunHouse} 宫` : "";

  const professional = [
    axisProfessionalFirstLineForVoice(voiceStyleId, {
      asc: ascText,
      mc: mcText,
      dsc: dscText,
      ic: icText,
    }),
    axisProfessionalReadOrderForVoice(voiceStyleId),
    moonMcSquare
      ? axisProMoonMcYesVocal(voiceStyleId, moonMcSquare.orbDeg.toFixed(2))
      : axisProMoonMcNoVocal(voiceStyleId),
    satAscSquare
      ? axisProSatAscYesVocal(voiceStyleId, satAscSquare.orbDeg.toFixed(2))
      : axisProSatAscNoVocal(voiceStyleId),
    sunMarsConj
      ? axisProSunMarsYesVocal(voiceStyleId, sunMarsConj.orbDeg.toFixed(2), sunMarsHouseClause)
      : axisProSunMarsNoVocal(voiceStyleId),
    tightMinor
      ? axisProTightMinorYesVocal(voiceStyleId, minorDetailPro)
      : axisProTightMinorNoVocal(voiceStyleId),
    moon
      ? axisProMoonEmotionalTailForVoice(
          voiceStyleId,
          moonProfessionalTagZh(kind),
          ZODIAC_CN[moon.zodiac],
        )
      : "",
  ]
    .filter(Boolean)
    .join("");

  return { regular, professional };
}

