import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { HouseSystemId } from "@/lib/astro-dossier-storage";
import type { AspectPresetId, OrbPresetId } from "@/lib/astro-aspect-params";

export type VoiceStyleIdZh =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10;

type VoiceStyleSeed = {
  chartKind: ChartKindId;
  houseSystem: HouseSystemId;
  aspectPreset?: AspectPresetId;
  orbPreset?: OrbPresetId;
  includeMinorAspects?: boolean;
  majorOrbDeg?: number;
  minorOrbDeg?: number;
  /** 用于 transit/时刻类“同一窗口内”保持一致；natal 用出生时刻也能稳定 */
  instantUtcMs?: number;
};

function hashStringToInt(input: string): number {
  // djb2
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  // keep positive
  return Math.abs(h >>> 0);
}

export function selectVoiceStyleIdZh(seed: VoiceStyleSeed): VoiceStyleIdZh {
  const dayBucket = seed.instantUtcMs == null ? 0 : Math.floor(seed.instantUtcMs / 86400000);
  const major = seed.majorOrbDeg == null ? "" : seed.majorOrbDeg.toFixed(1);
  const minor = seed.minorOrbDeg == null ? "" : seed.minorOrbDeg.toFixed(1);
  const s = [
    seed.chartKind,
    seed.houseSystem,
    seed.aspectPreset ?? "",
    seed.orbPreset ?? "",
    seed.includeMinorAspects ? "minorOn" : "minorOff",
    major,
    minor,
    String(dayBucket),
  ].join("|");
  const n = hashStringToInt(s) % 10;
  return (n + 1) as VoiceStyleIdZh;
}

/**
 * 产品内中文口吻一律由各处 `*Vocal` 与补丁表成稿。
 * 本文件仅导出声部 id 类型与 `selectVoiceStyleIdZh`（由盘型、宫位制、相位口径等种子稳定映射到 1–10）。
 */
