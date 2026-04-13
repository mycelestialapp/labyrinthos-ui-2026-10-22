/**
 * 行星位置观测报告句库：口吻与占位符固定在此；`astro-planet-positions-report-zh` 只负责填数与选模板。
 * 分层口吻：`.cursor/rules/astro-copy-voice-layers-zh.mdc`（核心快照 / 逻辑推演；人读摘要见 `docs/ASTRO_COPY_VOICE_LAYERS_ZH.md`）。
 */

export type PlanetPositionsCopyConfigZh = {
  statusLine: string;
  matrixCaption: string;
  /** 宫位：核心快照段用的生活化主题（双核叙事） */
  housePoetic: Record<number, string>;
  /** 宫位：集群标题里的职能名 */
  houseShort: Record<number, string>;
  answer: {
    happenedOppositeTemplate: string;
    happenedDualTemplate: string;
    happenedSinglePeakTemplate: string;
    coreTemplate: string;
    coreArchetypeGeneric: string;
    coreSingleArchetype: string;
    riskSunMarsConjunction8: string;
    riskSunMarsSameHouse: string;
    riskMoonVenusSameHouse: string;
    riskGeneric: string;
    riskSinglePeak: string;
    todayLayered: string;
    coreSingleTemplate: string;
    todaySinglePeak: string;
  };
  pro: {
    sunMarsBodyCoreTemplate: string;
    moonVenusBodyCoreTemplate: string;
    mercuryJupiterTitle: string;
    mercuryLineTemplate: string;
    jupiterLineTemplate: string;
    mercuryOnlyFallback: string;
    jupiterOnlyFallback: string;
    mercuryJupiterMissing: string;
  };
  /** 原始读数段每颗星一行后的职能尾句（偏手册风） */
  planetTail: Partial<
    Record<
      string,
      string
    >
  >;
  actions: {
    engineTemplate: string;
    flowTemplate: string;
    contractTemplate: string;
    engineFallback: string;
    flowFallback: string;
    contractFallback: string;
  };
};

export const PLANET_POSITIONS_COPY_CONFIG_ZH: PlanetPositionsCopyConfigZh = {
  statusLine: "本表在说什么：你的行星主要落在生活的哪几块——像看「精力都去哪儿了」。",
  matrixCaption: "全系统参数阵列：Planetary Matrix（来源：盘内行星位置）",
  housePoetic: {
    1: "自我、长相、给别人第一眼的感觉",
    2: "钱、资源、手头松紧",
    3: "说话、学习、身边人",
    4: "家、心里踏实、根在哪儿",
    5: "恋爱、创造、玩得开不开心",
    6: "上班、健康、日常琐事",
    7: "一对一关系、合作、对手",
    8: "共同资源、信任深浅、蜕变",
    9: "远方、信念、读万卷书",
    10: "事业、名声、社会上你是谁",
    11: "朋友、圈子、共同愿望",
    12: "独处、潜意识、需要收尾的事",
  },
  houseShort: {
    1: "自我与出场",
    2: "资源与家当",
    3: "沟通与走动",
    4: "家庭与内心",
    5: "创造与恋爱",
    6: "工作与身体",
    7: "关系与合作",
    8: "深度与共有",
    9: "信念与远方",
    10: "事业与名望",
    11: "朋友与社群",
    12: "幕后与休整",
  },
  answer: {
    happenedOppositeTemplate:
      "你身上最忙的两块，正好是面对面的「{themeA}」和「{themeB}」：像一根扁担两头挑，容易顾了一头忘了另一头。别在两头来回硬掰，先想清楚今天主要保哪一头。",
    happenedDualTemplate:
      "你身上最显眼的两块是「{themeA}」和「{themeB}」：两件事同时在抢你的注意力。若不排个先后，很容易哪件都做一半。",
    happenedSinglePeakTemplate:
      "你大部分行星都挤在「{themeA}」（{h}宫）这一块：不是坏事，但容易把鸡蛋放一个篮子里——累、烦、钻牛角尖都可能从这里来。",
    coreTemplate:
      "说白了：精力主要在 {h1} 宫（{n1}）和 {h2} 宫（{n2}）打转。{archetype}",
    coreArchetypeGeneric:
      "这两块一个像「想什么」，一个像「做什么」，中间若没对齐，就会出现「心里明白、手上乱套」或反过来。试着把大想法拆成明天就能做的一小步。",
    riskSunMarsConjunction8:
      "要小心：太阳和火星一起在 8 宫时，人容易又冲又较真，钱、信任、隐私这类事一点就炸。别在累或气头上做决定。",
    riskSunMarsSameHouse:
      "要小心：太阳和火星同在 {h} 宫，干劲特别足，但容易不听劝、不等人。大事留一句「我明天再回复」。",
    riskMoonVenusSameHouse:
      "要小心：月亮和金星同在 {h} 宫，心情和喜好绑在一起，容易「此刻爽就签字」。重要决定缓一缓，换个环境再想。",
    riskGeneric:
      "要小心：{n1}和{n2}两件事节奏不一样，你会嫌自己「想得多做得少」或「做得多心里空」。把纠结写下来，比闷在心里强。",
    riskSinglePeak:
      "要小心：所有事都往 {n} 这一块堆，容易越扛越满。能分给别人、能改天的，就别全压在今天。",
    todayLayered:
      "今天可以：先在 {h1} 宫相关的事里拿定一个小主意，再在 {h2} 宫落一件具体动作（写下来就算）。别停在嘴上商量。",
    coreSingleTemplate:
      "说白了：大半故事都发生在 {h} 宫（{n}）。{archetype}",
    coreSingleArchetype:
      "这一块既管你心里怎么想，又管你对外怎么做，容易自己跟自己拧着。把「今天要完成的一件小事」写死，别的先往后排。",
    todaySinglePeak:
      "今天可以：只抓 {h} 宫相关的一件事，切成三步，做完一步再打勾；别同时开新坑。",
  },
  pro: {
    sunMarsBodyCoreTemplate:
      "你的日火主轴落在「{houseTheme}」。{sunLine} 与 {marsLine} 叠加，擅长穿透表层规则；缺点是容易把「看穿」当成「已交付」。",
    moonVenusBodyCoreTemplate:
      "你的月金主轴落在「{houseTheme}」。{moonLine} 与 {venusLine} 并行时，价值感与安全感容易绑在日常细节；情绪尽量能讲清、能命名，会少内耗。",
    mercuryJupiterTitle: "3. 逻辑与社会资源（水星 & 木星）",
    mercuryLineTemplate: "{mercuryLine}：你的沟通协议偏契约化与条款导向，适合把模糊承诺改成可验收文本。",
    jupiterLineTemplate:
      "{jupiterLine}：你的扩张接口落在「{jupiterTheme}」，增长更适合「开创—复盘」循环，而不是单点硬扛。",
    mercuryOnlyFallback: "水星数据暂缺，沟通接口按「条款先行」默认协议处理。",
    jupiterOnlyFallback: "木星数据暂缺，社会资源扩张按「小步试错」默认策略处理。",
    mercuryJupiterMissing: "水星与木星在当前盘面未纳入本表，逻辑与社会资源模块按默认保守策略处理。",
  },
  planetTail: {
    sun: "意志下潜协议。",
    moon: "节律反馈回路。",
    mercury: "契约化沟通接口。",
    venus: "审美价值准入。",
    mars: "行动穿透指令。",
    jupiter: "社会资源扩张点。",
    saturn: "结构压测与边界硬化。",
    uranus: "突变注入与规则破窗。",
    neptune: "愿景模糊化校准。",
    pluto: "生产力彻底重组。",
    north_node: "方向增益接口。",
    south_node: "惯性卸载通道。",
    chiron: "修复回路采样点。",
  },
  actions: {
    engineTemplate: "高能下潜：利用 {sunMarsHint} 的爆发力，完成一个涉及底层逻辑改写或资源重绑定的核心任务（控制在单点闭环）。",
    flowTemplate: "流程降噪：利用 {moonVenusHint} 的反馈，优化日常流程里的颗粒度与节律，把「可重复」写进日程。",
    contractTemplate: "契约锁定：针对 {mercuryHint}，今日外部协作以书面口径或明确条款为准，拒绝模糊承诺与口头兜底。",
    engineFallback: "高能下潜：把当前最重的单一议题拆成可验收的三步，先完成第一步再谈扩展。",
    flowFallback: "流程降噪：给日常任务加 10 分钟复盘槽，专门处理返工与沟通噪声。",
    contractFallback: "契约锁定：任何涉及对价的沟通，先对齐范围与截止时间，再进入执行。",
  },
};
