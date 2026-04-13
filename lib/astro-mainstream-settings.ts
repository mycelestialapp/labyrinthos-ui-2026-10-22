import type { SecondaryYearBasisId, TertiaryMonthBasisId } from "@/lib/astro-chart-kinds";
import type { AspectPresetId, OrbPresetId } from "@/lib/astro-aspect-params";

export type { AspectPresetId, OrbPresetId } from "@/lib/astro-aspect-params";

export type AstroMainstreamSettings = {
  secondaryYearBasis: SecondaryYearBasisId;
  tertiaryMonthBasis: TertiaryMonthBasisId;
  aspectPreset: AspectPresetId;
  orbPreset: OrbPresetId;
};

export const ASTRO_MAINSTREAM_SETTINGS_STORAGE_KEY = "labyrinthos-astro-mainstream-settings-v1";

/** 默认与此前轮盘实际行为一致：主+次相位、主流容许度。 */
export const DEFAULT_ASTRO_MAINSTREAM_SETTINGS: AstroMainstreamSettings = {
  secondaryYearBasis: "tropical",
  tertiaryMonthBasis: "synodic",
  aspectPreset: "major_and_minor",
  orbPreset: "mainstream_default",
};

export const SECONDARY_YEAR_BASIS_OPTIONS: { id: SecondaryYearBasisId; label: string }[] = [
  { id: "tropical", label: "热带年 365.24219（主流）" },
  { id: "julian", label: "儒略年 365.25" },
];

export const TERTIARY_MONTH_BASIS_OPTIONS: { id: TertiaryMonthBasisId; label: string }[] = [
  { id: "synodic", label: "朔望月 29.53（主流）" },
  { id: "sidereal", label: "恒星月 27.32" },
];

export const ASPECT_PRESET_OPTIONS: { id: AspectPresetId; label: string; subtitle?: string }[] = [
  { id: "major_only", label: "仅主相位", subtitle: "合、冲、刑、拱、六合" },
  { id: "major_and_minor", label: "主相位 + 次要", subtitle: "十二分、八分、梅花等" },
];

export const ORB_PRESET_OPTIONS: { id: OrbPresetId; label: string; subtitle?: string }[] = [
  { id: "tight", label: "紧容许度", subtitle: "主 5° / 次 1.5°" },
  { id: "mainstream_default", label: "主流默认", subtitle: "主 6° / 次 2.5°" },
  { id: "wide", label: "宽容许度", subtitle: "主 8° / 次 3.5°" },
];

function isSecondaryYearBasisId(v: unknown): v is SecondaryYearBasisId {
  return v === "tropical" || v === "julian";
}

function isTertiaryMonthBasisId(v: unknown): v is TertiaryMonthBasisId {
  return v === "synodic" || v === "sidereal";
}

function isAspectPresetId(v: unknown): v is AspectPresetId {
  return v === "major_only" || v === "major_and_minor";
}

function isOrbPresetId(v: unknown): v is OrbPresetId {
  return v === "tight" || v === "mainstream_default" || v === "wide";
}

export function parseAstroMainstreamSettingsJson(raw: string | null | undefined): AstroMainstreamSettings {
  if (!raw) return DEFAULT_ASTRO_MAINSTREAM_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as Partial<AstroMainstreamSettings>;
    return {
      secondaryYearBasis: isSecondaryYearBasisId(parsed.secondaryYearBasis)
        ? parsed.secondaryYearBasis
        : DEFAULT_ASTRO_MAINSTREAM_SETTINGS.secondaryYearBasis,
      tertiaryMonthBasis: isTertiaryMonthBasisId(parsed.tertiaryMonthBasis)
        ? parsed.tertiaryMonthBasis
        : DEFAULT_ASTRO_MAINSTREAM_SETTINGS.tertiaryMonthBasis,
      aspectPreset: isAspectPresetId(parsed.aspectPreset)
        ? parsed.aspectPreset
        : DEFAULT_ASTRO_MAINSTREAM_SETTINGS.aspectPreset,
      orbPreset: isOrbPresetId(parsed.orbPreset)
        ? parsed.orbPreset
        : DEFAULT_ASTRO_MAINSTREAM_SETTINGS.orbPreset,
    };
  } catch {
    return DEFAULT_ASTRO_MAINSTREAM_SETTINGS;
  }
}
