/**

 * 工作台「本命长文」Markdown：分层标题与产品定稿对齐；声部导语 + 正文定稿层（不做全文短语 replace）。

 */



import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";



/** 与 `.cursor/rules/astro-copy-voice-layers-zh.mdc` 用户可见分层标题一致（导出/剪贴板同源）。 */

const MD_HEADING_LAYER_MAP: [from: RegExp, to: string][] = [

  [/^##\s*核心快照（默认）/m, "## 【核心快照】"],

  [/^##\s*核心快照\n/m, "## 【核心快照】\n"],

  [/^##\s*逻辑推演（展开）/m, "## 【逻辑推演】"],

  [/^##\s*逻辑推演\n/m, "## 【逻辑推演】\n"],

  [/^##\s*原始读数（标签与权重）/m, "## 【原始读数】"],

  [/^##\s*原始读数/m, "## 【原始读数】"],

  [/^##\s*执行备忘/m, "## 【执行备忘】"],

];



const READING_LEAD_ZH: Partial<Record<VoiceStyleIdZh, string>> = {

  2: "下面这段长读与导出同源；分层标题已统一为「核心快照 / 逻辑推演 / 原始读数 / 执行备忘」格式，语气按当前声部微调。",

  3: "以下长文：分层标题与产品定稿一致；表述偏观测笔记体，可与数据区对表。",

  4: "长文开场：结构分层与导出一致；读的时候当作多幕剧本，别一口气吞完。",

  5: "长读｜分层标题已定稿｜声部=极简。",

  6: "说明：下列 Markdown 分层标题与导出一致；正文为静态底盘向长期习惯叙述，非日运。",

  7: "唠一句：底下长文分层标题跟导出是一样的，你按声部语气扫着读就行。",

  8: "本区长文采用与导出一致的分层标题；请分模块阅读并与读数区交叉核对。",

  9: "【长文】分层｜核心快照/逻辑推演/原始读数/执行备忘｜与导出同源。",

  10: "长读:分层已定稿;声部短句",

};



function normalizeLayerHeadings(md: string): string {

  let out = md;

  for (const [from, to] of MD_HEADING_LAYER_MAP) {

    out = out.replace(from, to);

  }

  return out;

}



export function workspaceReadingMarkdownVocal(md: string, voiceStyleId: VoiceStyleIdZh): string {

  if (!md.trim()) return md;

  const body = normalizeLayerHeadings(md);

  const lead = READING_LEAD_ZH[voiceStyleId];

  if (!lead || voiceStyleId === 1) return body;

  return `${lead}\n\n${body}`;

}


