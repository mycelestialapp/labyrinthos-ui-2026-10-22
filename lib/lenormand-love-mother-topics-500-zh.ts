/**
 * 感情类 500 母题库（50 × 10）
 * - primaryThemes: 一级母题（50）
 * - angles: 细分角度（10），与 `lenormand-mother-topics-13x500-zh` 的 ANGLES_10 一致
 * 匹配逻辑与全库母题共用（见 `matchLoveMotherTopic`）。
 */

import { matchMotherTopicDetailed } from "./lenormand-mother-topics-13x500-zh";

export type LoveMotherTopic = {
  id: string;
  primary: string;
  angle: string;
  text: string;
};

const PRIMARY_THEMES: string[] = [
  "心意确认",
  "关系定位",
  "沟通频率",
  "沟通质量",
  "误解修复",
  "冲突升级",
  "冷战僵局",
  "情绪勒索",
  "边界清晰度",
  "忠诚稳定度",
  "第三方暧昧",
  "第三方介入",
  "信任坍塌",
  "复合意愿",
  "复合可行性",
  "回流沟通",
  "分手前兆",
  "分手决断",
  "离婚评估",
  "去留两难",
  "承诺意愿",
  "承诺兑现",
  "婚配适配",
  "价值观冲突",
  "金钱观冲突",
  "原生家庭压力",
  "姻亲关系压力",
  "异地距离压力",
  "时间投入失衡",
  "关系权力失衡",
  "依赖与控制",
  "安全感缺失",
  "嫉妒与占有",
  "自尊受损",
  "自我怀疑",
  "关系疲劳",
  "激情衰退",
  "亲密回避",
  "亲密需求错配",
  "公开与私下反差",
  "社交媒体干扰",
  "秘密与隐瞒",
  "谎言识别",
  "现实阻碍",
  "经济住房压力",
  "生育议题冲突",
  "节点推进",
  "关系重建",
  "关系止损",
  "关系终局判断",
];

const ANGLES: string[] = [
  "当下状态",
  "近期趋势",
  "隐藏动因",
  "核心矛盾",
  "显性表现",
  "潜在风险",
  "稳定条件",
  "失衡信号",
  "边界焦点",
  "判读重点",
];

function toId(primaryIndex: number, angleIndex: number): string {
  return `LOVE_${String(primaryIndex + 1).padStart(2, "0")}_${String(angleIndex + 1).padStart(2, "0")}`;
}

export function buildLoveMotherTopics500(): LoveMotherTopic[] {
  const out: LoveMotherTopic[] = [];
  for (let i = 0; i < PRIMARY_THEMES.length; i += 1) {
    for (let j = 0; j < ANGLES.length; j += 1) {
      out.push({
        id: toId(i, j),
        primary: PRIMARY_THEMES[i],
        angle: ANGLES[j],
        text: `${PRIMARY_THEMES[i]}的${ANGLES[j]}如何判断？`,
      });
    }
  }
  return out;
}

export const LOVE_MOTHER_TOPICS_500: LoveMotherTopic[] = buildLoveMotherTopics500();

/** 与全库 `matchMotherTopicDetailed(q,"感情婚姻")` 同口径，ID 前缀为 `LOVE_` 以兼容旧脚本。 */
export function matchLoveMotherTopic(question: string): LoveMotherTopic | null {
  const m = matchMotherTopicDetailed(question || "", "感情婚姻");
  if (!m) return null;
  const t = m.topic;
  return {
    id: t.id.replace(/^TOPIC_感情婚姻_/, "LOVE_"),
    primary: t.primary,
    angle: t.angle,
    text: t.text,
  };
}

