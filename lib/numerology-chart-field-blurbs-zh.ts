/**
 * 个人星图：六格「短引导 + 首节一段」+ 底部总览。
 * 首节与手册 snapshot 同源（小节题现为「一眼」等，仍兼容旧稿「定盘」）；主路径 snapshot 常见「标题块 / 正文块」分两段，解析时两种都接。
 */

import {
  birthdayNumberLayerCopyZh,
  expressionLayerCopyZh,
  personalityLayerCopyZh,
  soulUrgeLayerCopyZh,
} from "@/lib/numerology-numeral-master-zh";
import { numerologyNameHasLatinLetters } from "@/lib/numerology-pythagorean";
import type { NumerologyUnifiedDeepReadingInput } from "@/lib/numerology-unified-deep-reading-zh";
import {
  numerologyExpressionChartCardZh,
  numerologyLifePathChartBlurbZh,
  numerologyPersonalityChartCardZh,
  numerologyPersonalYearChartCardZh,
  numerologyReadingVoiceClosingLineZh,
  numerologySoulUrgeChartCardZh,
  stackReadOneLineZh,
} from "@/lib/numerology-unified-deep-reading-zh";

export type NumerologyChartFieldRowZh = {
  key: string;
  value: string;
  foot: string;
  blurb: string;
};

/** 取首节（小节题「一眼」或旧稿「定盘」）后正文：可能同块，也可能单独成块跟在标题块后面 */
function twinSnapshotDingpanParagraph(snapshot: string): string {
  const chunks = snapshot
    .split(/\n\n+/)
    .map((x) => x.trim())
    .filter(Boolean);
  const firstSection = /(?:一眼|定盘)/;
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i]!;
    if (!firstSection.test(c)) continue;
    const combined = c.match(/^【[^】]*(?:一眼|定盘)[^】]*】\s*\n+([\s\S]+)$/);
    if (combined) {
      return chopTrailingSectionHeader(combined[1]!.trim());
    }
    if (/^【[^】]*(?:一眼|定盘)[^】]*】\s*$/.test(c)) {
      const next = chunks[i + 1];
      if (next && !next.startsWith("【")) return chopTrailingSectionHeader(next.trim());
    }
  }
  return "";
}

/** 去掉同一块里误跟的下一节「【…】」标题（单换行衔接） */
function chopTrailingSectionHeader(body: string): string {
  const nl = body.indexOf("\n【");
  if (nl !== -1) return body.slice(0, nl).trim();
  return body.trim();
}

function truncateSmart(s: string, max: number): string {
  const t = s.trim();
  if (!t) return "";
  if (t.length <= max) return t;
  const window = t.slice(0, max);
  const d = window.lastIndexOf("。");
  if (d > Math.floor(max * 0.38)) return `${t.slice(0, d + 1)}${d + 1 < t.length ? "…" : ""}`;
  return `${window.trimEnd()}…`;
}

function leadPlusDingpan(lead: string, snapshot: string, maxDingpan: number): string {
  const ding = truncateSmart(twinSnapshotDingpanParagraph(snapshot), maxDingpan);
  return ding ? `${lead}\n\n${ding}` : lead;
}

function birthdayChartBlurbZh(birthdayReduced: number): string {
  const snap = birthdayNumberLayerCopyZh(birthdayReduced).snapshot;
  const ding = truncateSmart(twinSnapshotDingpanParagraph(snap), 300);
  return ding || "—";
}

function personalYearChartBlurbLongZh(calendarYear: number, py: number): string {
  const head = numerologyPersonalYearChartCardZh(calendarYear, py);
  return `${head}\n\n它只管${calendarYear}这一公历年的外圈，别和出生年、主路径收成一条线念。想再往下对，可回「寰宇之门」看镜鉴「展开」和 KPI，数字与本页一致。`;
}

function expressionChartBlurbLongZh(latin: string, ex: number | null): string {
  const lead = numerologyExpressionChartCardZh(latin, ex);
  if (ex == null) {
    if (!latin.trim()) {
      return `${lead}\n\n填上拉丁全拼后，会按毕达哥拉斯表把字母折成数；表现数用全名里所有字母的和，再化约到 1–9 或 11/22/33。细则与首屏「姓名·拉丁」同口径。`;
    }
    if (!numerologyNameHasLatinLetters(latin)) {
      return `${lead}\n\n要有英文字母 A–Z 才会出姓名三数；中文名不算在内。拼音或英文名填在同一框即可。`;
    }
    return `${lead}\n\n若已填字母仍为空，多半是只有符号或空格；之门首屏姓名拉丁框下有边界说明。`;
  }
  return leadPlusDingpan(lead, expressionLayerCopyZh(ex).snapshot, 260);
}

function soulUrgeChartBlurbLongZh(latin: string, su: number | null): string {
  const lead = numerologySoulUrgeChartCardZh(latin, su);
  if (su == null) {
    if (!latin.trim()) return `${lead}\n\n填上拉丁全拼后，系统只取元音 a、e、i、o、u 折灵魂数；全辅音名没有灵魂数是常见情况。`;
    if (!numerologyNameHasLatinLetters(latin)) return `${lead}\n\n要有英文字母才会出姓名三数；中文名不算。`;
    return `${lead}\n\n与之门首屏姓名拉丁里「没有元音」说明一致；需要举例可去之门看同一段。`;
  }
  return leadPlusDingpan(lead, soulUrgeLayerCopyZh(su).snapshot, 260);
}

function personalityChartBlurbLongZh(latin: string, ex: number | null, su: number | null, pe: number | null): string {
  const lead = numerologyPersonalityChartCardZh(latin, ex, su, pe);
  if (pe == null) {
    if (!latin.trim()) return `${lead}\n\n填上拉丁全拼后，人格数只看辅音字母；和表现数、灵魂数拆开来算，三条线别揉成一句。`;
    if (!numerologyNameHasLatinLetters(latin)) return `${lead}\n\n要有英文字母才会出姓名三数；中文名不算。`;
    if (pe == null && (ex != null || su != null)) {
      return `${lead}\n\n辅音列没凑出来时这一格会空着；之门首屏姓名拉丁里会交代怎么折、怎么和另外两数叠读。`;
    }
    return `${lead}\n\n若拼写里只有元音或符号，人格数也会空；之门手册里口径与本页一致。`;
  }
  return leadPlusDingpan(lead, personalityLayerCopyZh(pe).snapshot, 260);
}

const CHART_READ_SCOPE_ZH =
  "主路径听出生月、日、年收成的那条主线；生日数听「生日那一天」的习惯口气；个人年听眼下这个公历年的外圈；姓名三数只听拉丁拼写里的字母，和中文名本身无关。";

export function numerologyChartFieldRowsZh(i: NumerologyUnifiedDeepReadingInput): NumerologyChartFieldRowZh[] {
  const cy = i.calendarYear;
  const py = i.personalYearNum;
  const latin = i.nameLatin;
  const ex = i.expression;
  const su = i.soulUrge;
  const pe = i.personality;

  const lpBlurb = leadPlusDingpan(numerologyLifePathChartBlurbZh(i.lifePath), i.layers.snapshot, 300);

  return [
    { key: "生命路径", value: String(i.lifePath), foot: "主数", blurb: lpBlurb },
    { key: "生日数", value: String(i.birthdayNum), foot: "日柱", blurb: birthdayChartBlurbZh(i.birthdayNum) },
    { key: "个人年", value: String(py), foot: String(cy), blurb: personalYearChartBlurbLongZh(cy, py) },
    { key: "表现数", value: ex == null ? "—" : String(ex), foot: "外显", blurb: expressionChartBlurbLongZh(latin, ex) },
    { key: "灵魂数", value: su == null ? "—" : String(su), foot: "内驱", blurb: soulUrgeChartBlurbLongZh(latin, su) },
    {
      key: "人格数",
      value: pe == null ? "—" : String(pe),
      foot: "初见",
      blurb: personalityChartBlurbLongZh(latin, ex, su, pe),
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
