import type { LifePathBreakdown } from "@/lib/numerology-pythagorean";
import type { LifePathLayerCopy } from "@/lib/numerology-life-path-copy-zh";
import {
  birthdayNumber,
  computeLifePathBreakdown,
  expressionNumber,
  lifePathNumber,
  personalityNumber,
  personalYear,
  soulUrgeNumber,
} from "@/lib/numerology-pythagorean";
import {
  numerologyGateExecMemoBulletsZh,
  numerologyGateRawLayerHandbookZh,
  numerologyGateRawLayerIntroZh,
} from "@/lib/numerology-gate-ui-copy-zh";
import { lifePathLayerCopyZh } from "@/lib/numerology-life-path-copy-zh";
import {
  numerologyReadingVoiceClosingLineZh,
  numerologyReadingVoiceLogicPreambleZh,
  numerologyUnifiedDeepReadingZh,
} from "@/lib/numerology-unified-deep-reading-zh";
import {
  birthdayNumberLayerCopyZh,
  expressionLayerCopyZh,
  personalityLayerCopyZh,
  soulUrgeLayerCopyZh,
} from "@/lib/numerology-numeral-master-zh";
import type { NumerologyWorkspaceSnapshot } from "@/lib/numerology-workspace-snapshot";
import { numerologyMatrixHandbookBodyZh } from "@/lib/numerology-matrix-handbook-zh";
import { numerologyMatrixLitRootsZh } from "@/lib/numerology-matrix-readout-zh";

export type NumerologyMarkdownInput = {
  y: number;
  m: number;
  d: number;
  nameLatin: string;
  calendarYear: number;
  lifePath: number;
  birthdayNum: number;
  personalYearNum: number;
  expression: number | null;
  soulUrge: number | null;
  personality: number | null;
  breakdown: LifePathBreakdown;
  layers: LifePathLayerCopy;
};

/** 导出用 Markdown（与站内读数分层标题一致；不含未渲染 Markdown 加粗套语） */
export function buildNumerologyWorkspaceMarkdown(i: NumerologyMarkdownInput): string {
  const date = `${i.y}-${String(i.m).padStart(2, "0")}-${String(i.d).padStart(2, "0")}`;
  const nameLine = i.nameLatin.trim() ? `姓名（拉丁全拼）：${i.nameLatin.trim()}` : "姓名（拉丁全拼）：未填";

  const bdL = birthdayNumberLayerCopyZh(i.birthdayNum);
  const exL = i.expression != null ? expressionLayerCopyZh(i.expression) : null;
  const suL = i.soulUrge != null ? soulUrgeLayerCopyZh(i.soulUrge) : null;
  const peL = i.personality != null ? personalityLayerCopyZh(i.personality) : null;

  const matrixLitRoots = numerologyMatrixLitRootsZh({
    lifePath: i.lifePath,
    birthdayNum: i.birthdayNum,
    personalYearNum: i.personalYearNum,
    expression: i.expression,
    soulUrge: i.soulUrge,
    personality: i.personality,
  });
  const matrixHandbookMd = numerologyMatrixHandbookBodyZh(matrixLitRoots);

  const unifiedSnapshot = numerologyUnifiedDeepReadingZh({
    lifePath: i.lifePath,
    y: i.y,
    m: i.m,
    d: i.d,
    calendarYear: i.calendarYear,
    birthdayNum: i.birthdayNum,
    personalYearNum: i.personalYearNum,
    nameLatin: i.nameLatin,
    expression: i.expression,
    soulUrge: i.soulUrge,
    personality: i.personality,
    breakdown: i.breakdown,
    layers: i.layers,
  });

  return [
    `# 坛城数轨 · 数秘读数`,
    ``,
    `公历生辰：${date}`,
    nameLine,
    `个人年（${i.calendarYear}）：${i.personalYearNum}`,
    ``,
    `## 先听完这一段（高光 + 手册）`,
    unifiedSnapshot,
    ``,
    `## 慢慢拆开（推演）`,
    numerologyReadingVoiceLogicPreambleZh(),
    ``,
    i.layers.logic,
    ``,
    `### 日柱推演 · ${i.birthdayNum}`,
    bdL.logic,
    ...(exL ? [``, `### 表现数推演 · ${i.expression}`, exL.logic] : []),
    ...(suL ? [``, `### 灵魂数推演 · ${i.soulUrge}`, suL.logic] : []),
    ...(peL ? [``, `### 人格数推演 · ${i.personality}`, peL.logic] : []),
    ``,
    `## 对一眼数（备忘表）`,
    numerologyGateRawLayerIntroZh,
    ``,
    numerologyGateRawLayerHandbookZh({
      calendarYear: i.calendarYear,
      lifePath: i.lifePath,
      personalYear: i.personalYearNum,
      breakdown: i.breakdown,
    }),
    ``,
    `- 月柱化约：${i.breakdown.monthReduced}`,
    `- 日柱化约：${i.breakdown.dayReduced}`,
    `- 年柱化约：${i.breakdown.yearReduced}`,
    `- 合并再化约：${i.breakdown.combinedRaw} → 主路径 ${i.lifePath}`,
    `- 生日数：${i.birthdayNum}`,
    `- 表现数：${i.expression ?? "—"}`,
    `- 灵魂数：${i.soulUrge ?? "—"}`,
    `- 人格数：${i.personality ?? "—"}`,
    ``,
    `## 能量矩阵 · 格数手册`,
    ``,
    `亮格 ${matrixLitRoots.length ? matrixLitRoots.join("、") : "—"}：乃主路径、生日数、个人年与姓名数化约至 1–9 后去重，与站内「能量矩阵」同源。下附格数手册全文；先取与今岁、今心相合者读，其余留作备忘即可。`,
    ``,
    matrixHandbookMd,
    ``,
    `## 带走几句（能做的事）`,
    ``,
    numerologyGateExecMemoBulletsZh(i.lifePath, i.personalYearNum).join("\n\n"),
    ``,
    numerologyReadingVoiceClosingLineZh(),
    ``,
  ].join("\n");
}

/** 由快照 + 个人年公历还原完整 Markdown（档案条目导出用） */
export function buildNumerologyMarkdownFromSnapshot(snapshot: NumerologyWorkspaceSnapshot, calendarYear: number): string {
  const { y, m, d, nameLatin } = snapshot;
  const lifePath = lifePathNumber(m, d, y);
  return buildNumerologyWorkspaceMarkdown({
    y,
    m,
    d,
    nameLatin,
    calendarYear,
    lifePath,
    birthdayNum: birthdayNumber(d),
    personalYearNum: personalYear(m, d, calendarYear),
    expression: expressionNumber(nameLatin),
    soulUrge: soulUrgeNumber(nameLatin),
    personality: personalityNumber(nameLatin),
    breakdown: computeLifePathBreakdown(m, d, y),
    layers: lifePathLayerCopyZh(lifePath),
  });
}
