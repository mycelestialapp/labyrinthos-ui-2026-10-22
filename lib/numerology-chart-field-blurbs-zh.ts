/**
 * 个人星图：六格摘句——眉题/界定用 `numerology-chart-lead-voice-zh`，下接 `numerology-chart-master-voice-zh` 同风格长段；不接手册长隐喻节选。
 */

import type { NumerologyUnifiedDeepReadingInput } from "@/lib/numerology-unified-deep-reading-zh";
import {
  chartBirthdayLeadVoiceZh,
  chartExpressionEmptyLeadVoiceZh,
  chartExpressionLeadVoiceZh,
  chartLifePathLeadVoiceZh,
  chartPersonalityEmptyLeadVoiceZh,
  chartPersonalityLeadVoiceZh,
  chartPersonalYearLeadVoiceZh,
  chartSoulUrgeEmptyLeadVoiceZh,
  chartSoulUrgeLeadVoiceZh,
} from "@/lib/numerology-chart-lead-voice-zh";
import {
  chartBirthdayMasterVoiceZh,
  chartExpressionMasterVoiceZh,
  chartLifePathMasterVoiceZh,
  chartPersonalityMasterVoiceZh,
  chartPersonalYearMasterVoiceZh,
  chartSoulUrgeMasterVoiceZh,
} from "@/lib/numerology-chart-master-voice-zh";
import { numerologyNameHasLatinLetters } from "@/lib/numerology-pythagorean";
import { numerologyReadingVoiceClosingLineZh, stackReadOneLineZh } from "@/lib/numerology-unified-deep-reading-zh";

export type NumerologyChartFieldRowZh = {
  key: string;
  value: string;
  foot: string;
  blurb: string;
};

function lifePathChartBlurbZh(lp: number): string {
  return `${chartLifePathLeadVoiceZh(lp)}\n\n${chartLifePathMasterVoiceZh(lp)}`;
}

function birthdayChartBlurbZh(birthdayReduced: number): string {
  return `${chartBirthdayLeadVoiceZh(birthdayReduced)}\n\n${chartBirthdayMasterVoiceZh(birthdayReduced)}`;
}

function personalYearChartBlurbZh(calendarYear: number, py: number): string {
  return `${chartPersonalYearLeadVoiceZh(calendarYear, py)}\n\n${chartPersonalYearMasterVoiceZh(py)}`;
}

function expressionChartBlurbZh(latin: string, ex: number | null): string {
  const t = latin.trim();
  if (ex != null) {
    return `${chartExpressionLeadVoiceZh(ex)}\n\n${chartExpressionMasterVoiceZh(ex)}`;
  }
  if (!t) {
    return chartExpressionEmptyLeadVoiceZh("noLatin");
  }
  if (!numerologyNameHasLatinLetters(t)) {
    return chartExpressionEmptyLeadVoiceZh("noLetters");
  }
  return chartExpressionEmptyLeadVoiceZh("invalid");
}

function soulUrgeChartBlurbZh(latin: string, su: number | null): string {
  const t = latin.trim();
  if (su != null) {
    return `${chartSoulUrgeLeadVoiceZh(su)}\n\n${chartSoulUrgeMasterVoiceZh(su)}`;
  }
  if (!t) {
    return chartSoulUrgeEmptyLeadVoiceZh("noLatin");
  }
  if (!numerologyNameHasLatinLetters(t)) {
    return chartSoulUrgeEmptyLeadVoiceZh("noLetters");
  }
  return chartSoulUrgeEmptyLeadVoiceZh("noVowels");
}

function personalityChartBlurbZh(latin: string, ex: number | null, su: number | null, pe: number | null): string {
  const t = latin.trim();
  if (pe != null) {
    return `${chartPersonalityLeadVoiceZh(pe)}\n\n${chartPersonalityMasterVoiceZh(pe)}`;
  }
  if (!t) {
    return chartPersonalityEmptyLeadVoiceZh("noLatin");
  }
  if (!numerologyNameHasLatinLetters(t)) {
    return chartPersonalityEmptyLeadVoiceZh("noLetters");
  }
  if (pe == null && (ex != null || su != null)) {
    return chartPersonalityEmptyLeadVoiceZh("noConsonants");
  }
  return chartPersonalityEmptyLeadVoiceZh("other");
}

const CHART_READ_SCOPE_ZH =
  "这一屏怎么听：主路径听出生月、日、年收成的那条长线习惯；生日数只听「生日那一天」前后抬头的一口气，别当主路径复读；个人年只听眼下这个公历年的外圈，和出生年收成不是同一条；姓名三数只看拉丁 A–Z 折出来的字母，和中文名本字无关。若你容易揉成一团，先各写一句「这一格今天只回答什么问题」，再叠读；数变以本页为准，动生日或拼写就会改全盘。";

export function numerologyChartFieldRowsZh(i: NumerologyUnifiedDeepReadingInput): NumerologyChartFieldRowZh[] {
  const cy = i.calendarYear;
  const py = i.personalYearNum;
  const latin = i.nameLatin;
  const ex = i.expression;
  const su = i.soulUrge;
  const pe = i.personality;

  return [
    { key: "生命路径", value: String(i.lifePath), foot: "主数", blurb: lifePathChartBlurbZh(i.lifePath) },
    { key: "生日数", value: String(i.birthdayNum), foot: "日柱", blurb: birthdayChartBlurbZh(i.birthdayNum) },
    { key: "个人年", value: String(py), foot: String(cy), blurb: personalYearChartBlurbZh(cy, py) },
    { key: "表现数", value: ex == null ? "—" : String(ex), foot: "外显", blurb: expressionChartBlurbZh(latin, ex) },
    { key: "灵魂数", value: su == null ? "—" : String(su), foot: "内驱", blurb: soulUrgeChartBlurbZh(latin, su) },
    {
      key: "人格数",
      value: pe == null ? "—" : String(pe),
      foot: "初见",
      blurb: personalityChartBlurbZh(latin, ex, su, pe),
    },
  ];
}

/** 底部总览：叠读 + 各线分工 + 导流 + 收束 */
export function numerologyChartTotalSummaryBodyZh(i: NumerologyUnifiedDeepReadingInput): string {
  return [
    stackReadOneLineZh(i),
    "",
    CHART_READ_SCOPE_ZH,
    "",
    "长文、镜鉴和第二段备忘表在「寰宇之门」底部的读数分层；要成篇带走可导出 Markdown。",
    "",
    numerologyReadingVoiceClosingLineZh(),
  ].join("\n");
}
