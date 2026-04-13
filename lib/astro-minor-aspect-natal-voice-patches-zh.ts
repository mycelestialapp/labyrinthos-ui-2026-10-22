/**
 * 次要相位观测：本命基座 10 套成稿。voice 1 即 MINOR_ASPECT_COPY_CONFIG_ZH。
 */

import { deepMergePlain } from "@/lib/astro-copy-deep-merge";
import { MINOR_ASPECT_COPY_CONFIG_ZH, type MinorAspectCopyConfigZh } from "@/lib/astro-minor-aspect-copy-config-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const V1 = MINOR_ASPECT_COPY_CONFIG_ZH;
type Patch = Partial<MinorAspectCopyConfigZh>;

const P2: Patch = {
  statusLine: "本表在说什么：那些不大不小的摩擦和灵感——平时不起眼，久了会改你的手感。",
  answer: {
    happened:
      "次要相位很少砸场子，更像鞋里的沙：一两天没事，久了脚疼。说不清的小别扭，常从这里起。",
    risk: "要先留个心：别总忽略这些小信号。它们不上头条，却会悄悄带偏判断。",
    synergyTemplate: "协同：留意 {aspect}——压力大时可能给你「旁路想法」，别只会死磕主线。",
    today: "今天先这么做：扫一眼最紧的几条次要相位，当后台提醒。",
  },
  pro: {
    compensationTemplate: "隐性缓冲：{aspect}。乱的时候便于快速重组。",
    frictionTemplate: "轻微磨损：{aspect}。意志与价值小磨，执行易迟滞。",
    coordinationTemplate: "弱协同：{aspect}。可当沟通润滑。",
  },
  precision: {
    matrix: "次要相位矩阵：Minor Aspect Analysis（来源：盘内次要相位卡）",
    highFreqPrefix: "[高频·补偿]",
    lowFreqPrefix: "[低频·干扰]",
    emptyHighFreq: "[高频·补偿] 无",
    emptyLowFreq: "[低频·干扰] 无",
  },
  actions: {
    inspirationTemplate: "卡壳时先试 {aspect} 的跳跃想法，别硬线性硬磕。",
    tolerateTemplate: "容忍小磨：{aspect} 的不适像余热，不据此改主方向。",
    smoothingTemplate: "关键沟通借 {aspect} 加一点表达修饰，减少误会。",
  },
};

const P3: Patch = {
  statusLine: "本表在说什么：次要线＝性格里的细噪声与小灵感。",
  answer: {
    happened: "次要相位像细沙：久了烦。小别扭常从这里起。",
    risk: "别忽略小信号；会带偏判断。",
    synergyTemplate: "看 {aspect}：压力时可能有旁路灵感。",
    today: "今天适合：扫最紧几条次要线。",
  },
  pro: {
    compensationTemplate: "缓冲：{aspect}。",
    frictionTemplate: "磨损：{aspect}。",
    coordinationTemplate: "协同：{aspect}。",
  },
  precision: {
    matrix: "Minor Aspect Analysis（盘内次要相位）",
    highFreqPrefix: "[高]",
    lowFreqPrefix: "[低]",
    emptyHighFreq: "[高]无",
    emptyLowFreq: "[低]无",
  },
  actions: {
    inspirationTemplate: "试 {aspect} 跳跃解。",
    tolerateTemplate: "忍 {aspect} 小磨。",
    smoothingTemplate: "沟通加 {aspect} 修饰。",
  },
};

const P4: Patch = {
  statusLine: "本表在说什么：把次要相位当旁白——小摩擦与小灵感。",
  answer: {
    happened: "次要线像背景杂音：不大，但久了塑形。",
    risk: "风险：小信号带偏判断。",
    synergyTemplate: "协同建议：{aspect} 有时能松一口气。",
    today: "今天更推荐：扫一眼次要线当提醒。",
  },
  pro: {
    compensationTemplate: "补偿线：{aspect}。",
    frictionTemplate: "损耗线：{aspect}。",
    coordinationTemplate: "润滑线：{aspect}。",
  },
  precision: {
    matrix: "次要相位章节表：Minor Aspect Analysis（盘内次要相位卡）",
    highFreqPrefix: "[补偿侧]",
    lowFreqPrefix: "[干扰侧]",
    emptyHighFreq: "[补偿侧] 无",
    emptyLowFreq: "[干扰侧] 无",
  },
  actions: {
    inspirationTemplate: "灵感：验证 {aspect}。",
    tolerateTemplate: "容忍：{aspect} 余热。",
    smoothingTemplate: "润滑：{aspect} 修饰。",
  },
};

const P5: Patch = {
  statusLine: "本表在说什么：【次要相位】细线。",
  answer: {
    happened: "【细沙】久了脚疼。",
    risk: "【警】小信号带偏。",
    synergyTemplate: "【协】{aspect}。",
    today: "【今日】扫紧线。",
  },
  pro: {
    compensationTemplate: "【补】{aspect}。",
    frictionTemplate: "【磨】{aspect}。",
    coordinationTemplate: "【润】{aspect}。",
  },
  precision: {
    matrix: "【Minor】次要",
    highFreqPrefix: "[H]",
    lowFreqPrefix: "[L]",
    emptyHighFreq: "[H]无",
    emptyLowFreq: "[L]无",
  },
  actions: {
    inspirationTemplate: "【灵】{aspect}。",
    tolerateTemplate: "【忍】{aspect}。",
    smoothingTemplate: "【滑】{aspect}。",
  },
};

const P6: Patch = {
  statusLine: "本表在说什么：从结构上看，次要相位如何提供微观补偿与干扰。",
  answer: {
    happened: "次要相位对系统的影响多为渐进式，长期累积可改变手感。",
    risk: "小振幅信号可能导致判断偏移，建议记录与复核。",
    synergyTemplate: "在压力场景下，{aspect} 可能提供替代解法路径。",
    today: "建议检视表中紧样本的次要相位条目。",
  },
  pro: {
    compensationTemplate: "补偿结构：{aspect}。",
    frictionTemplate: "摩擦结构：{aspect}。",
    coordinationTemplate: "协调结构：{aspect}。",
  },
  precision: {
    matrix: "次要相位分布矩阵：Minor Aspect Analysis（盘内次要相位卡）",
    highFreqPrefix: "[高频补偿样本]",
    lowFreqPrefix: "[低频干扰样本]",
    emptyHighFreq: "[高频补偿样本] 无",
    emptyLowFreq: "[低频干扰样本] 无",
  },
  actions: {
    inspirationTemplate: "优先验证 {aspect} 的非线性解法。",
    tolerateTemplate: "将 {aspect} 的不适视为背景噪声处理。",
    smoothingTemplate: "在关键沟通中引入 {aspect} 相关的表达缓冲。",
  },
};

const P7: Patch = {
  statusLine: "本表在说什么：说白了，次要线就是「不大不小」的烦与小聪明。",
  answer: {
    happened: "次要相位像鞋里沙：久了疼。",
    risk: "别当看不见：会带偏你。",
    synergyTemplate: "留意 {aspect}：压力时能偷个巧。",
    today: "今天别拖：扫最紧几条。",
  },
  pro: {
    compensationTemplate: "兜底感：{aspect}。",
    frictionTemplate: "磨人感：{aspect}。",
    coordinationTemplate: "好说话一点：{aspect}。",
  },
  precision: {
    matrix: "次要相位蹲点表：Minor Aspect Analysis（盘内次要相位卡）",
    highFreqPrefix: "[紧·补]",
    lowFreqPrefix: "[松·扰]",
    emptyHighFreq: "[紧·补] 无",
    emptyLowFreq: "[松·扰] 无",
  },
  actions: {
    inspirationTemplate: "卡了先试 {aspect}。",
    tolerateTemplate: "{aspect} 别当主因。",
    smoothingTemplate: "说话绕一点 {aspect}。",
  },
};

const P8: Patch = {
  statusLine: "本表在说什么：次要相位细负荷——微观摩擦与灵感样本。",
  answer: {
    happened: "次要线描述渐进式摩擦与灵感来源。",
    risk: "低显著度信号仍可能影响决策质量。",
    synergyTemplate: "{aspect} 可作为压力下的替代策略线索。",
    today: "今日可先复核紧次要样本。",
  },
  pro: {
    compensationTemplate: "样本·补偿：{aspect}。",
    frictionTemplate: "样本·摩擦：{aspect}。",
    coordinationTemplate: "样本·协调：{aspect}。",
  },
  precision: {
    matrix: "次要相位负荷矩阵：Minor Aspect Analysis（盘内次要相位卡）",
    highFreqPrefix: "[HF]",
    lowFreqPrefix: "[LF]",
    emptyHighFreq: "[HF] ∅",
    emptyLowFreq: "[LF] ∅",
  },
  actions: {
    inspirationTemplate: "验证 {aspect}。",
    tolerateTemplate: "降级处理 {aspect}。",
    smoothingTemplate: "缓冲 {aspect}。",
  },
};

const P9: Patch = {
  statusLine: "本表在说什么：像脚注——次要相位标出小回声。",
  answer: {
    happened: "次要线不写头条，但写脚注：久了改手感。",
    risk: "脚注也能带偏剧情。",
    synergyTemplate: "旁白：{aspect} 有时递梯子。",
    today: "今天可以先从这一步开始：扫紧脚注。",
  },
  pro: {
    compensationTemplate: "脚注·缓冲：{aspect}。",
    frictionTemplate: "脚注·磨：{aspect}。",
    coordinationTemplate: "脚注·润：{aspect}。",
  },
  precision: {
    matrix: "次要相位地图：Minor Aspect Analysis（盘内次要相位卡）",
    highFreqPrefix: "[注·高]",
    lowFreqPrefix: "[注·低]",
    emptyHighFreq: "[注·高] 无",
    emptyLowFreq: "[注·低] 无",
  },
  actions: {
    inspirationTemplate: "脚注招式：{aspect}。",
    tolerateTemplate: "脚注噪声：{aspect}。",
    smoothingTemplate: "脚注语气：{aspect}。",
  },
};

const P10: Patch = {
  statusLine: "本表在说什么：次要相位＝细线。",
  answer: {
    happened: "细沙。",
    risk: "小偏。",
    synergyTemplate: "{aspect}。",
    today: "扫紧。",
  },
  pro: {
    compensationTemplate: "{aspect}",
    frictionTemplate: "{aspect}",
    coordinationTemplate: "{aspect}",
  },
  precision: {
    matrix: "Minor",
    highFreqPrefix: "H",
    lowFreqPrefix: "L",
    emptyHighFreq: "H∅",
    emptyLowFreq: "L∅",
  },
  actions: {
    inspirationTemplate: "{aspect}",
    tolerateTemplate: "{aspect}",
    smoothingTemplate: "{aspect}",
  },
};

const PATCH_BY_VOICE: Record<Exclude<VoiceStyleIdZh, 1>, Patch> = {
  2: P2,
  3: P3,
  4: P4,
  5: P5,
  6: P6,
  7: P7,
  8: P8,
  9: P9,
  10: P10,
};

const cache: Partial<Record<VoiceStyleIdZh, MinorAspectCopyConfigZh>> = { 1: V1 };

export function minorAspectNatalBaseForVoice(voiceStyleId: VoiceStyleIdZh): MinorAspectCopyConfigZh {
  const hit = cache[voiceStyleId];
  if (hit) return hit;
  if (voiceStyleId === 1) return V1;
  const merged = deepMergePlain(V1, PATCH_BY_VOICE[voiceStyleId as Exclude<VoiceStyleIdZh, 1>]);
  cache[voiceStyleId] = merged;
  return merged;
}
