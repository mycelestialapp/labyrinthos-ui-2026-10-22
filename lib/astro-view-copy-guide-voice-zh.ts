import { ASTRO_VIEW_COPY_TEMPLATES_ZH, type AstroViewCopyTemplate } from "@/lib/astro-copy-templates-zh";
import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

/**
 * 八盘导览：当前无分声部补丁时各声部共用基座（`astro-copy-templates-zh`）。
 * 新增声部变体时在此合并补丁即可。
 */
export function astroViewCopyGuideVocal(kind: ChartKindId, voiceStyleId: VoiceStyleIdZh): AstroViewCopyTemplate {
  void voiceStyleId;
  return ASTRO_VIEW_COPY_TEMPLATES_ZH[kind];
}

/** 导出 Markdown：与读数区分层标题一致 */
export function formatAstroViewCopyGuideMarkdownZh(g: AstroViewCopyTemplate): string {
  return [
    `## 八盘导览 · ${g.viewTitle}`,
    "",
    g.anchor,
    "",
    "### 【核心快照】",
    g.summary.answer,
    "",
    "### 【逻辑推演】",
    g.summary.pro,
    "",
    "### 【原始读数】",
    g.summary.precision,
    "",
    `数据区建议：${g.dataPanelHint}`,
    "",
    "### 【执行备忘】",
    ...g.actionProtocol.map((line, i) => `${i + 1}. ${line}`),
  ].join("\n");
}
