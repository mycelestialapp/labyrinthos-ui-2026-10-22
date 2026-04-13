export type MajorAspectCopyConfigZh = {
  statusLine: string;
  answer: {
    happenedHighPressure: string;
    happenedCalibrate: string;
    riskWithHardTemplate: string;
    riskNoHard: string;
    synergyTemplate: string;
    todayTemplate: string;
  };
  pro: {
    centerTemplate: string;
    conflictWithHardTemplate: string;
    conflictNoHard: string;
    driveTemplate: string;
  };
  precision: {
    matrix: string;
  };
  actions: {
    stabilizeTemplate: string;
    growthDelayTemplate: string;
    burstTemplate: string;
  };
};

/** 盘内主相位文案句库：仅改此处换口吻，不碰 `astro-major-aspect-report-zh` 内计算逻辑。 */
export const MAJOR_ASPECT_COPY_CONFIG_ZH: MajorAspectCopyConfigZh = {
  statusLine: "本表在说什么：行星之间谁跟谁在较劲、谁跟谁互相帮忙——是你性格的「主线剧情」。",
  answer: {
    happenedHighPressure:
      "最近你会明显感觉：旧的目标或习惯跟现在的处境对不上号了，心里在逼你做取舍。不是坏事，是轮到换剧本了。",
    happenedCalibrate:
      "最近你在悄悄调整：哪些事还值得投入、哪些该放手。变化不大，但方向在动。",
    riskWithHardTemplate: "{hardAspects} 这组容易让人非黑即白——要么硬顶到底，要么干脆躺平。中间那条路才是真的。",
    riskNoHard: "同时惦记的事太多，脑子会「结论过载」：以为都想清了，其实还在打转。",
    synergyTemplate: "{aspect} 像一条缓冲带，能帮你稳住情绪、缓一口气，别浪费这条线。",
    todayTemplate:
      "先处理最让你较劲的那一两组（表里越紧的越优先），别的先记下别硬啃；借钱、扩团队、大投入这类决定，隔 {hours} 小时再拍板。",
  },
  pro: {
    centerTemplate: "绝对中心相位：{aspect}。当前主线围绕该相位展开。",
    conflictWithHardTemplate: "高压冲突点：{hardAspects}。增长冲动与路径约束同步抬升。",
    conflictNoHard: "高压冲突点：硬相位密度有限，主要矛盾在执行噪声而非结构冲突。",
    driveTemplate: "核心驱动力：{aspect}。意志与行动可以同时使力，但目标要先收窄。",
  },
  precision: {
    matrix: "相位阵列观测：Aspect Matrix（来源：盘内主相位卡）",
  },
  actions: {
    stabilizeTemplate: "调用稳定内核：优先利用{aspect}处理高压议题，执行“事实先行，情绪后置”。",
    growthDelayTemplate: "控制增长野心：涉及借贷、扩编或大额投入的决策，统一延后 {hours} 小时复核。",
    burstTemplate: "定向爆破：利用{aspect}的执行力，只打一个硬任务，禁止多线并发。",
  },
};
