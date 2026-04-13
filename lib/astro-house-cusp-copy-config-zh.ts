/** 十二宫宫头文案句库：仅改此处换口吻；元素分支键由生成器写入。 */
export type HouseCuspCopyConfigZh = {
  statusLine: string;
  answer: {
    happened: string;
    coreTemplate: string;
    riskTemplate: string;
    todayTemplate: string;
  };
  axisRisk: {
    sameElement: string;
    waterEarth: string;
    fireAir: string;
    default: string;
  };
  todayProtocol: Record<"earth" | "air" | "water" | "fire", string>;
  interfaceMode: {
    defensive: string;
    semantic: string;
    impulse: string;
  };
  transformMode: {
    expansive: string;
    osmotic: string;
    structural: string;
  };
  mcMode: Record<"water" | "air" | "earth" | "fire", string>;
  pro: {
    ascTemplate: string;
    valueAxisTemplate: string;
    mcTemplate: string;
  };
  precision: {
    matrix: string;
    anchorAsc: string;
    anchorIc: string;
    anchorDes: string;
    anchorMc: string;
    turn6: string;
    turn8: string;
  };
  actions: {
    align7: string;
    clean4: string;
    release10: string;
  };
};

export const HOUSE_CUSP_COPY_CONFIG_ZH: HouseCuspCopyConfigZh = {
  statusLine: "本表在说什么：十二个生活场景各是什么「脾气」——从你怎么出场，到钱、家、关系、事业怎么接招。",
  answer: {
    happened:
      "宫头就像十二间房的门槛：你进「关系」「钱」「工作」这些门时，默认是紧张还是放松、先讲理还是先感受，都会不一样。",
    coreTemplate:
      "你给人的第一印象偏「{interfaceMode}」；真要脱胎换骨、动到根上的事，又更像「{transformMode}」。上升在 {c1}，8 宫在 {c8}，一个是「怎么上场」，一个是「敢不敢彻底翻新」。",
    riskTemplate: "「你自己」和「对面那个人」默认玩法不一样（上升 {c1}，下降 {c7}）。{axisRisk}",
    todayTemplate: "今天可以：跟人打交道时先记住一条——{todayProtocol}。别一上来就用「我觉得」挡掉所有商量。",
  },
  axisRisk: {
    sameElement: "你们太容易互相听懂潜台词，反而说不清边界，谁该干啥容易糊。",
    waterEarth: "一个重感受一个重实际，节奏对不上，容易你觉得冷、他觉得你黏。",
    fireAir: "话说得快、承诺跟得慢，后面容易扯皮返工。",
    default: "你习惯的那套和对方习惯的那套不是一码事，多解释一句比冷战省劲。",
  },
  todayProtocol: {
    earth: "先把条件、责任、截止时间说清楚",
    air: "先把名词对齐，别各说各话",
    water: "先说你介意什么、需要什么，别让人猜",
    fire: "先分清哪件最急，别全挤在一起",
  },
  interfaceMode: {
    defensive: "先观望、不轻易交底",
    semantic: "爱讲清楚、要道理",
    impulse: "来得快、先动了再说",
  },
  transformMode: {
    expansive: "敢往外扩、敢试新东西",
    osmotic: "慢慢渗透、润物细无声",
    structural: "宁可慢一点，也要把规矩立住",
  },
  mcMode: {
    water: "愿景驱动",
    air: "网络协同",
    earth: "结构兑现",
    fire: "冲刺开路",
  },
  pro: {
    ascTemplate: "人格接口（ASC / 1宫 {c1}）：对环境信号偏敏感，会先察觉风险，再决定对外敞开多少。",
    valueAxisTemplate:
      "价值载荷（2/8轴：2宫 {c2} ↔ 8宫 {c8}）：前端负责价值显化，后端负责深层重构；财务与安全需同时满足“掌控感 + 可复核”。",
    mcTemplate: "社会坐标（MC / 10宫 {c10}）：职业可见度偏{mcMode}，更适合演化式路径，不适合僵硬爬梯。",
  },
  precision: {
    matrix: "场域路由映射：House Cusp Matrix（来源：十二宫宫头卡）",
    anchorAsc: "[ASC] 1宫 {c1} —— 系统入口协议：柔性拦截",
    anchorIc: "[IC] 4宫 {c4} —— 内核稳定来源：流程化与精细管理",
    anchorDes: "[DES] 7宫 {c7} —— 关系准入标准：责任校验与契约边界",
    anchorMc: "[MC] 10宫 {c10} —— 社会可见频率：{mcMode}输出",
    turn6: "{c6} —— 执行节律：在日常流程里寻找意义与可持续节拍",
    turn8: "{c8} —— 重构逻辑：非对称改写与深层资源重配",
  },
  actions: {
    align7: "对齐 7 宫边界：处理合作关系时，同步 7宫 {c7} 的准入规则，减少 1宫 {c1} 的情绪代入。",
    clean4: "清理 4 宫底噪：利用 4宫 {c4} 的精细化倾向，整理私域与基础流程，为内核降噪。",
    release10: "释放 10 宫愿景：在公众表达中保留 10宫 {c10} 的{mcMode}空间，同时补上可验证动作。",
  },
};
