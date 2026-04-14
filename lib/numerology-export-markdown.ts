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
import { lifePathLayerCopyZh } from "@/lib/numerology-life-path-copy-zh";
import type { NumerologyWorkspaceSnapshot } from "@/lib/numerology-workspace-snapshot";

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

  return [
    `# 坛城数轨 · 数秘读数`,
    ``,
    `公历生辰：${date}`,
    nameLine,
    `个人年（${i.calendarYear}）：${i.personalYearNum}`,
    ``,
    `## 核心快照`,
    i.layers.snapshot,
    ``,
    `## 逻辑推演`,
    i.layers.logic,
    ``,
    `## 原始读数`,
    `- 月柱化约：${i.breakdown.monthReduced}`,
    `- 日柱化约：${i.breakdown.dayReduced}`,
    `- 年柱化约：${i.breakdown.yearReduced}`,
    `- 合并再化约：${i.breakdown.combinedRaw} → 主路径 ${i.lifePath}`,
    `- 生日数：${i.birthdayNum}`,
    `- 表现数：${i.expression ?? "—"}`,
    `- 灵魂数：${i.soulUrge ?? "—"}`,
    `- 人格数：${i.personality ?? "—"}`,
    ``,
    `## 执行备忘`,
    `- 把本周一件与「主路径 ${i.lifePath}」一致的小事写进日历，并设验收标准。`,
    `- 对照个人年 ${i.personalYearNum}：收束年与外放年动作不同，只选当下可做的一条。`,
    `- 七日内复盘一次：睡眠、日程与情绪是否同向，再决定是否调整承诺。`,
    ``,
    `命数为镜，照见节律与接口；不替代专业医疗、法律与财务判断。`,
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
