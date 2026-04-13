import type { AspectType, PlanetId } from "@/lib/astro-chart-wheel";
import { ASTRO_ASPECT_TYPE_LABEL_ZH } from "@/lib/astro-aspect-type-label-zh";

export type AnswerRoutingConfig = {
  houseKeywordMap: Record<number, string>;
  aspectTypeLabel: Record<AspectType, string>;
  silentMode: {
    maxMajorTriggers: number;
    tightOrbDeg: number;
  };
  evidence: {
    sampleCount: number;
    weightThreshold: {
      high: number;
      medium: number;
    };
  };
  messages: {
    noChartData: string;
    noEvidenceData: string;
    noMajorAspect: string;
    noHouseFocus: string;
    humanSummarySilent: string;
    humanSummaryTemplate: string;
    silentWindowLabel: string;
    silentWindowBody: string;
    baselineBody: string;
    answerBodyTemplate: string;
    minorSummaryWithCountTemplate: string;
    minorSummaryWithoutCount: string;
    /** 非静默分支未展示动态指令时仍会计算；与第一层口吻一致，备后续 UI 复用 */
    silentDynamicInstruction: string;
  };
  dynamicInstructionByPlanetHardAspect: Partial<Record<PlanetId, string>>;
  fallbackInstruction: string;
};

export const DEFAULT_ANSWER_ROUTING_CONFIG: AnswerRoutingConfig = {
  /** 与观测报告第一层同一生活化轴；仍用于「X宫（…）」证据摘要，勿写成长论文 */
  houseKeywordMap: {
    1: "自我、怎么出场、当场怎么选",
    2: "进账花钱、手头资源、自我价值感",
    3: "说话办事、字据短旅、身边人",
    4: "住处根基、家庭氛围、心里安不安",
    5: "创作玩乐、敢不敢冒险、被看见",
    6: "上班琐事、身体状态、日常质量",
    7: "一对一关系、合作、商量与博弈",
    8: "共有资源、欠债担保、信任深浅",
    9: "读书远行、信念、长远打算",
    10: "工作名望、责任上限、外界怎么看你",
    11: "朋友圈子、集体、共同目标",
    12: "休息收尾、潜意识、该放下的旧事",
  },
  aspectTypeLabel: { ...ASTRO_ASPECT_TYPE_LABEL_ZH },
  silentMode: {
    maxMajorTriggers: 6,
    tightOrbDeg: 1,
  },
  evidence: {
    sampleCount: 3,
    weightThreshold: {
      high: 4,
      medium: 2,
    },
  },
  messages: {
    noChartData: "缺少盘面数据，暂时归纳不了宫位重点。",
    noEvidenceData: "证据标签：待盘面加载。",
    noMajorAspect: "证据标签：未检测到主相位触发。",
    noHouseFocus: "行星分布较匀，没有特别扎堆的宫位。",
    humanSummarySilent: "今天没有特别显眼的大触发，按平常节奏就行。",
    humanSummaryTemplate: "眼下容易挂在心上的是：{houseFocusSummary}。主目标先收窄成一件，别并行太多。",
    silentWindowLabel: "静默窗口",
    silentWindowBody: "今天盘面偏静，没有非要立刻校准的大事，按日常节奏来就好。",
    baselineBody: "该干嘛干嘛，睡够觉；别临时加高风险承诺。",
    answerBodyTemplate:
      "眼下精力容易卡在：{houseFocusSummary}。重大决定别只押一条线，留一点复核余地。",
    minorSummaryWithCountTemplate: "次要相位贴得紧的有 {count} 条，小事反复、沟通折返可能会多一点。",
    minorSummaryWithoutCount: "次要相位不紧，不用单独为「背景噪声」操心。",
    silentDynamicInstruction: "今日盘面偏静：没有特别显眼的大触发，维持平常节奏与睡眠即可。",
  },
  dynamicInstructionByPlanetHardAspect: {
    moon: "月亮受压：先分清「感受」和「事实」，再交关键决定。",
    mercury: "水星受压：字据、合同、口头话先过一遍复核再往外发。",
  },
  fallbackInstruction: "先把主目标收成一条，其余记下来观察，别全挤在今天拍板。",
};
