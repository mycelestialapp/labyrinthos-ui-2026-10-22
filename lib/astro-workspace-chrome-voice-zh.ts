/**
 * 工作台顶栏/副栏：读数导出与光谱句的声部入口。
 * 读数 Markdown 见 `workspace-reading-markdown-voice-zh`；
 * 光谱句见 `astro-workspace-spectral-line-voice-zh`。
 */

import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { workspaceReadingMarkdownVocal as workspaceReadingMarkdownVocalImpl } from "@/lib/workspace-reading-markdown-voice-zh";

export function workspaceReadingMarkdownVocal(md: string, voiceStyleId: VoiceStyleIdZh): string {
  return workspaceReadingMarkdownVocalImpl(md, voiceStyleId);
}

export function workspaceSubtitleVocal(text: string): string {
  return text;
}
