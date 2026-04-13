export type MinorAspectCopyConfigZh = {
  statusLine: string;
  answer: {
    happened: string;
    risk: string;
    synergyTemplate: string;
    today: string;
  };
  pro: {
    compensationTemplate: string;
    frictionTemplate: string;
    coordinationTemplate: string;
  };
  precision: {
    matrix: string;
    highFreqPrefix: string;
    lowFreqPrefix: string;
    emptyHighFreq: string;
    emptyLowFreq: string;
  };
  actions: {
    inspirationTemplate: string;
    tolerateTemplate: string;
    smoothingTemplate: string;
  };
};

/** 次要相位（Minor Aspects）文案句库：仅改这里即可换口吻，不碰计算逻辑。 */
export const MINOR_ASPECT_COPY_CONFIG_ZH: MinorAspectCopyConfigZh = {
  statusLine: "本表在说什么：那些「不大不小」的摩擦和灵感——平时不起眼，久了会塑造你的手感。",
  answer: {
    happened:
      "次要相位不会像刑冲那样砸场子，但会像鞋里的一粒沙：一天两天没事，久了脚就疼。你那些说不清的小别扭，往往从这里来。",
    risk: "风险是什么：别总忽略这些小信号。它们不会上头条，却会悄悄带偏你的判断。",
    synergyTemplate: "协同建议：留意 {aspect} 这条线——压力大的时候，它有时能给你「旁门左道」式的灵感，别只会死磕主线。",
    today: "今天怎么做：扫一眼表里贴得最紧的几条次要相位，当成「后台提醒」：哪里容易烦、哪里可以偷个巧。",
  },
  pro: {
    compensationTemplate: "核心补偿：{aspect}。这条相位相当于一层隐性缓冲，在混乱场景里便于快速重组。",
    frictionTemplate: "执行损耗：{aspect}。意志与价值齿轮轻微磨合，执行端易出现迟滞。",
    coordinationTemplate: "逻辑协同：{aspect}。表达与审美弱协同，可作为沟通润滑通道。",
  },
  precision: {
    matrix: "微观阵列：Minor Aspect Analysis（来源：盘内次要相位卡）",
    highFreqPrefix: "[高频补偿]",
    lowFreqPrefix: "[低频干扰]",
    emptyHighFreq: "[高频补偿] 无",
    emptyLowFreq: "[低频干扰] 无",
  },
  actions: {
    inspirationTemplate: "调用灵感缓存：遇到逻辑死结时，优先验证 {aspect} 的跳跃解法，不强行线性硬磕。",
    tolerateTemplate: "容忍微观磨损：{aspect} 带来的不适属于系统余热，不据此改写主方向。",
    smoothingTemplate: "优化沟通润滑：利用 {aspect} 的弱协同，在关键沟通中增加约 10% 的表达修饰度。",
  },
};

