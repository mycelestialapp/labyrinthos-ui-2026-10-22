/**
 * 工作台「今日条」（光谱行）：日期与校准数据动态填空；声部 2–10 成稿，声部 1 与历史默认句式一致。
 */

import type { DailyCalibration } from "@/lib/daily-axiom";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

export type WorkspaceTodaySpectralParams = {
  dayKey: string;
  calibration: DailyCalibration | null;
};

const DEF_LOADED =
  "{date} · 今日节奏：{env}象偏强（{intensity}） · 今日状态：{scene} · 今日建议：{action}";

const LOADED_PATCH: Partial<Record<VoiceStyleIdZh, string>> = {
  2: "{date} · 今天外场：{env}象偏强（{intensity}） · 现在在发生的事：{scene} · 你可以：{action}",
  3: "{date}｜场域：{env}·强度{intensity}｜状态：{scene}｜建议动作：{action}",
  4: "{date} · 今日戏码底色：{env}象顶着（{intensity}） · 场上气氛像：{scene} · 导演笔记：{action}",
  5: "{date}｜{env}({intensity})｜{scene}｜{action}",
  6: "{date} · 观测备注：环境象 {env} 偏强（{intensity}） · 今日状态样本：{scene} · 处置建议：{action}",
  7: "{date} · 今儿外头 {env} 象有点顶（{intensity}） · 状态像：{scene} · 先这么办：{action}",
  8: "{date} · 今日环境象 {env} 强度 {intensity} · 状态描述：{scene} · 行动建议：{action}",
  9: "【今日条】{date}｜{env}·{intensity}｜场：{scene}｜招：{action}",
  10: "{date}:{env}{intensity}/{scene}/{action}",
};

const DEF_LOADING = "今日节奏：加载中…";

const LOADING_PATCH: Partial<Record<VoiceStyleIdZh, string>> = {
  2: "今日条还在对齐，稍等一下。",
  3: "今日校准：加载中。",
  4: "今日幕间：数据还在进场…",
  5: "今日：加载中",
  6: "观测：今日校准数据加载中。",
  7: "今儿这条还在加载，别急。",
  8: "今日节律条：数据加载中。",
  9: "【今日条】加载中",
  10: "今日:…",
};

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function workspaceTodaySpectralLineVocal(
  params: WorkspaceTodaySpectralParams,
  voiceStyleId: VoiceStyleIdZh,
): string {
  if (!params.calibration) {
    return LOADING_PATCH[voiceStyleId] ?? DEF_LOADING;
  }
  const template = LOADED_PATCH[voiceStyleId] ?? DEF_LOADED;
  const c = params.calibration;
  return fillTemplate(template, {
    date: params.dayKey,
    env: c.envElement,
    intensity: c.envIntensity.toFixed(2),
    scene: c.axiom.scene,
    action: c.axiom.action,
  });
}
