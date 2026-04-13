/**
 * 星盘读数区：Tab 导读与空状态文案的声部层。
 * - 导读：声部 2–10 全 Tab 成稿（补丁见 astro-readout-panel-context-patches-zh）；声部 1 或未命中回退基座原文（不再整段 apply）。
 * - 空状态：声部 2–10 成稿（见 astro-readout-panel-context-patches-zh）；未命中回退基座。
 * - 行运×本命主叙事：收束句声部成稿；正文为定稿句串接。
 * - 综合结论：框句 + 分段声部成稿（含主相位框、轴摩擦、次要紧尾句变体）。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";
import {
  readoutPanelContextZh,
  READOUT_EMPTY_ANGLE_MAJOR_ZH,
  READOUT_EMPTY_ANGLE_MINOR_ZH,
  READOUT_EMPTY_MAJOR_ASPECTS_ZH,
  READOUT_EMPTY_SYNASTRY_MAJOR_ZH,
  type ReadoutPanelContextId,
} from "@/lib/astro-eight-chart-readout-panel-context-zh";
import {
  READOUT_EMPTY_ANGLE_MAJOR_VOICE_PATCH,
  READOUT_EMPTY_ANGLE_MINOR_VOICE_PATCH,
  READOUT_EMPTY_MAJOR_VOICE_PATCH,
  READOUT_EMPTY_SYNASTRY_MAJOR_VOICE_PATCH,
  READOUT_PANEL_CONTEXT_VOICE_PATCH,
} from "@/lib/astro-readout-panel-context-patches-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { buildChartReadoutSynthesisZh } from "@/lib/astro-chart-readout-synthesis-zh";
import { readoutSynthesisKindFrameVocal } from "@/lib/astro-chart-readout-synthesis-frame-voice-zh";
import { buildTransitNatalMajorNarrativeBodyZh } from "@/lib/astro-transit-natal-major-narrative-zh";
import { transitNatalMajorClosingForVoice } from "@/lib/astro-transit-natal-major-narrative-voice-zh";
import type { AstroChartWheelData } from "@/lib/astro-chart-wheel";

export function readoutPanelContextVocal(
  kind: ChartKindId,
  panel: ReadoutPanelContextId,
  voiceStyleId: VoiceStyleIdZh,
): string {
  const base = readoutPanelContextZh(kind, panel);
  if (!base) return "";
  const p = READOUT_PANEL_CONTEXT_VOICE_PATCH[voiceStyleId]?.[kind]?.[panel];
  return p ?? base;
}

export function readoutEmptyMajorAspectsVocal(kind: ChartKindId, voiceStyleId: VoiceStyleIdZh): string {
  const base = READOUT_EMPTY_MAJOR_ASPECTS_ZH[kind];
  const p = READOUT_EMPTY_MAJOR_VOICE_PATCH[voiceStyleId]?.[kind];
  return p ?? base;
}

export function readoutEmptyAngleMajorVocal(kind: ChartKindId, voiceStyleId: VoiceStyleIdZh): string {
  const base = READOUT_EMPTY_ANGLE_MAJOR_ZH[kind];
  const p = READOUT_EMPTY_ANGLE_MAJOR_VOICE_PATCH[voiceStyleId]?.[kind];
  return p ?? base;
}

export function readoutEmptyAngleMinorVocal(kind: ChartKindId, voiceStyleId: VoiceStyleIdZh): string {
  const base = READOUT_EMPTY_ANGLE_MINOR_ZH[kind];
  const p = READOUT_EMPTY_ANGLE_MINOR_VOICE_PATCH[voiceStyleId]?.[kind];
  return p ?? base;
}

export function readoutEmptySynastryMajorVocal(voiceStyleId: VoiceStyleIdZh): string {
  const p = READOUT_EMPTY_SYNASTRY_MAJOR_VOICE_PATCH[voiceStyleId];
  return p ?? READOUT_EMPTY_SYNASTRY_MAJOR_ZH;
}

export function chartReadoutSynthesisBodyVocal(
  chart: AstroChartWheelData,
  hasSynastryTab: boolean,
  voiceStyleId: VoiceStyleIdZh,
): string {
  const kindFrameZhOverride =
    voiceStyleId === 1
      ? undefined
      : readoutSynthesisKindFrameVocal(voiceStyleId, chart.chartKindMeta?.id, hasSynastryTab);

  return buildChartReadoutSynthesisZh({
    chart,
    hasSynastryTab,
    kindFrameZhOverride,
    voiceStyleId,
  });
}

export function transitNatalMajorNarrativeVocal(
  data: AstroChartWheelData,
  voiceStyleId: VoiceStyleIdZh,
): string | null {
  const body = buildTransitNatalMajorNarrativeBodyZh(data);
  if (!body) return null;
  const closing = transitNatalMajorClosingForVoice(voiceStyleId);
  return body + closing;
}
