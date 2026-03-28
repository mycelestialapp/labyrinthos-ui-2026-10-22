/**
 * 【轴心 // THE AXIS】首页文案 — 四层结构，供 React 与罗盘 iframe 对照使用。
 */

export type AxisPole = "N" | "S" | "E" | "W" | "C";

export const AXIS_LAYER1 = {
  title: "轴心",
  subtitle: "局势定位系统（Status Positioning System）",
  principles: [
    "局势先于努力，秩序优于自由。",
    "我不改变你的人生，我只校准你的方向。",
  ],
  secondary: "剔除噪音，见终局。",
  cta: "校准轴心",
} as const;

export const AXIS_LAYER2 = {
  guide: "任何混乱，皆因失焦。停止奔跑，停下，拨动指针。",
  spinning: "正在剥离干扰…",
  locked: "坐标已锁定。",
} as const;

export const AXIS_LAYER3: Record<
  AxisPole,
  { short: string; full: string }
> = {
  N: { short: "终局律", full: "除了结果，其余皆是损耗。" },
  S: { short: "屏障律", full: "守不住边界的人，赢多少都会吐回去。" },
  E: { short: "博弈律", full: "优雅，是最高级的防御。" },
  W: { short: "代谢律", full: "情绪是信号，不是指令。" },
  C: { short: "定力", full: "外界转向，你不转性。" },
};

export const AXIS_LAYER4: Record<
  AxisPole,
  {
    heading: string;
    verdict: string;
    rules: [string, string];
    question: string;
  }
> = {
  N: {
    heading: "北极 N ｜ 战略闭环",
    verdict: "无产出，不介入。",
    rules: [
      "划掉 80% 琐事，只留一件 30 天后仍有价值的事。",
      "所有情绪化回应，封存 12 小时。",
    ],
    question: "你在解决问题，还是在制造忙碌？",
  },
  S: {
    heading: "南极 S ｜ 深度防御",
    verdict: "守住孤岛，方有绿洲。",
    rules: [
      "拒绝一次低效社交。",
      "停止扫描他人情绪，把注意力撤回身体。",
    ],
    question: "你在维护谁的体面？",
  },
  E: {
    heading: "东极 E ｜ 柔性博弈",
    verdict: "隐于秩序，显于分寸。",
    rules: [
      "先听完，再定调；先给框架，再给立场。",
      "把讨好式回应，改为边界式表达。",
    ],
    question: "你在争取认同，还是在收割资源？",
  },
  W: {
    heading: "西极 W ｜ 系统代谢",
    verdict: "旧我不退，新我不立。",
    rules: [
      "把压力拆成 3 条事实，删掉 3 条想象。",
      "假如一切重来，你还会做现在的决定吗？",
    ],
    question: "真正让你恐惧的是风险，还是变化？",
  },
  C: {
    heading: "轴心 C ｜ 终极定力",
    verdict: "中心不失，万物归位。",
    rules: [
      "所有临时决策，强制对齐三年目标。",
      "今日不为短期快感，背叛长期秩序。",
    ],
    question: "此刻的选择，是否对得起更强大的你？",
  },
};

/** iframe → 父页 */
export const AXIS_MESSAGE_SOURCE = "axis-compass" as const;

/** iframe 在启阵（旋转+消散）结束后发往首页，由父页随机择一极展示裁决 */
export type AxisParentMessage = {
  source: typeof AXIS_MESSAGE_SOURCE;
  type: "AXIS_REVEAL";
};

const ALL_POLES: AxisPole[] = ["N", "S", "E", "W", "C"];

export function pickRandomVerdictPole(): AxisPole {
  return ALL_POLES[Math.floor(Math.random() * ALL_POLES.length)];
}

export function isAxisParentMessage(data: unknown): data is AxisParentMessage {
  if (!data || typeof data !== "object") return false;
  const o = data as Record<string, unknown>;
  return o.source === AXIS_MESSAGE_SOURCE && o.type === "AXIS_REVEAL";
}
