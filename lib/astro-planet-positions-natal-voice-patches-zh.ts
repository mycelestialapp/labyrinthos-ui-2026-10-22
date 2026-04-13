/**
 * 行星位置观测：本命基座句库的 10 套独立成稿（叠盘型 patch 前）。
 * voice 1 即 `PLANET_POSITIONS_COPY_CONFIG_ZH`；2–10 为完整语义改写，占位符名不变。
 */

import { deepMergePlain } from "@/lib/astro-copy-deep-merge";
import {
  PLANET_POSITIONS_COPY_CONFIG_ZH,
  type PlanetPositionsCopyConfigZh,
} from "@/lib/astro-planet-positions-copy-config-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const V1 = PLANET_POSITIONS_COPY_CONFIG_ZH;

type Patch = Partial<PlanetPositionsCopyConfigZh>;

const P2: Patch = {
  statusLine:
    "本表在说什么：把行星想成你这段时间最忙的队友——它们主要落在生活的哪几块，往往就先消耗你、也先给你反馈。",
  matrixCaption: "行星落宫总表：Planetary Matrix（数据：盘内行星位置）",
  answer: {
    happenedOppositeTemplate:
      "你身上最显眼的两头，正好是面对面的「{themeA}」和「{themeB}」：像扁担两头挑，顾了一头就容易忘了另一头。别硬掰，先想今天主要保哪一边。",
    happenedDualTemplate:
      "你身上同时亮着的两块是「{themeA}」和「{themeB}」：两件事会抢你的注意力。不排顺序，就常见每件都做一半。",
    happenedSinglePeakTemplate:
      "你大部分行星都挤在「{themeA}」（{h}宫）这一块：集中不是错，但容易把压力也堆在一处——累、烦、钻牛角尖都可能从这里起。",
    coreTemplate:
      "说白了：你的戏份主要在 {h1} 宫（{n1}）和 {h2} 宫（{n2}）之间来回。{archetype}",
    coreArchetypeGeneric:
      "这两块一个偏「心里怎么想」，一个偏「手上怎么做」；没对齐就会出现「想得明白却乱做」或反过来。把大想法拆成明天就能完成的一小步。",
    riskSunMarsConjunction8:
      "要小心：太阳和火星一起在 8 宫时，人容易又冲又较真，钱、信任、隐私这类事一点就炸。别在累或气头上做决定。",
    riskSunMarsSameHouse:
      "要小心：太阳和火星同在 {h} 宫，干劲很足，但也容易不听劝、不等伙伴。大事留一句「我明天再回复」。",
    riskMoonVenusSameHouse:
      "要小心：月亮和金星同在 {h} 宫，心情和喜好绑得很紧，容易「此刻爽就点头」。重要决定缓一缓，换个环境再想。",
    riskGeneric:
      "要小心：{n1}和{n2}两件事节奏不一样，你会嫌自己「想得多做得少」或「做得多心里空」。把纠结写下来，比闷着强。",
    riskSinglePeak:
      "要小心：所有事都往 {n} 这一块堆，容易越扛越满。能分出去、能改天的，就别全压在今天。",
    todayLayered:
      "今天可以：先在 {h1} 宫相关的事里定一个小主意，再在 {h2} 宫落一件具体动作（写下来就算）。别停在嘴上商量。",
    coreSingleTemplate: "说白了：大半故事都发生在 {h} 宫（{n}）。{archetype}",
    coreSingleArchetype:
      "这一块同时牵动「心里怎么想」和「对外怎么做」，容易自己跟自己拧。把「今天要完成的一件小事」写死，别的先往后排。",
    todaySinglePeak:
      "今天可以：只抓 {h} 宫相关的一件事，切成三步，做完一步再打勾；别同时开新坑。",
  },
  pro: {
    sunMarsBodyCoreTemplate:
      "你的日火主轴落在「{houseTheme}」。{sunLine} 与 {marsLine} 叠在一起，擅长把问题看穿、往下做；缺点是容易把「看明白」当成「已经交付」。",
    moonVenusBodyCoreTemplate:
      "你的月金主轴落在「{houseTheme}」。{moonLine} 与 {venusLine} 并行时，安全感与喜好容易绑在日常细节里；情绪能讲清楚、能命名，会少很多内耗。",
    mercuryJupiterTitle: "3. 思路与机会（水星 & 木星）",
    mercuryLineTemplate:
      "{mercuryLine}：你说话做事偏想把范围与责任先讲清，适合把含糊承诺改成能核对的一句话。",
    jupiterLineTemplate:
      "{jupiterLine}：你的扩展感落在「{jupiterTheme}」，增长更适合「先试一小步—再复盘」的节奏，而不是单点硬扛。",
    mercuryOnlyFallback: "水星数据暂缺：沟通上仍建议先把名词与节点对齐。",
    jupiterOnlyFallback: "木星数据暂缺：机会面先保守，小步试。",
    mercuryJupiterMissing: "水星与木星未纳入本表：思路与机会模块先按保守策略理解。",
  },
  planetTail: {
    sun: "意志与目标感。",
    moon: "情绪与安全感节律。",
    mercury: "说法、信息与日程。",
    venus: "喜好、关系与价值感。",
    mars: "行动、脾气与边界。",
    jupiter: "信念放大与机会窗口。",
    saturn: "责任、耐心与界限。",
    uranus: "突变、独立与破格。",
    neptune: "想象、共情与模糊地带。",
    pluto: "深层执念与转化压力。",
    north_node: "成长方向感。",
    south_node: "惯性舒适区。",
    chiron: "旧伤与修复学习点。",
  },
  actions: {
    engineTemplate:
      "先往下沉：借 {sunMarsHint} 的冲劲，完成一件能改底层结构或重新分配资源的事（控制在单点闭环）。",
    flowTemplate:
      "节律清理：借 {moonVenusHint} 的反馈，把日常流程里反复返工的地方捋顺，把「可重复」写进日程。",
    contractTemplate:
      "用条款收口：围绕 {mercuryHint}，今天对外协作先对齐书面口径或明确范围，少靠口头兜底。",
    engineFallback: "把当前最重的一题拆成可验收的三步，先完成第一步再谈扩展。",
    flowFallback: "给日常任务加 10 分钟复盘槽，专门处理返工与沟通噪声。",
    contractFallback: "任何涉及对价的沟通，先对齐范围与截止时间，再进入执行。",
  },
};

const P3: Patch = {
  statusLine:
    "本表在说什么：这是一张「精力地图」——行星主要待在哪些宫位，就像你最常加班的部门名单。",
  matrixCaption: "行星矩阵：Planetary Matrix（来源：盘内行星位置读数）",
  answer: {
    happenedOppositeTemplate:
      "你身上最忙的两块，正好踩在「{themeA}」和「{themeB}」这条对立轴上：像来回拉扯的橡皮筋。今天先选一边站稳，再谈另一边。",
    happenedDualTemplate:
      "你身上最抢戏的两块是「{themeA}」和「{themeB}」：它们会同时伸手要时间。给它们排个先后顺序，比平均用力更省力。",
    happenedSinglePeakTemplate:
      "你的行星多半堆在「{themeA}」（{h}宫）：故事线很集中，压力也容易集中——烦、累、钻牛角尖都常见。记得给自己留出口。",
    coreTemplate:
      "一句话：主线在 {h1} 宫（{n1}）和 {h2} 宫（{n2}）之间晃。{archetype}",
    coreArchetypeGeneric:
      "一块偏「内在剧本」，一块偏「外在动作」；没对齐就会互相埋怨。只选明天能落地的一件小事开始。",
    riskSunMarsConjunction8:
      "要先留个心：太阳火星同在 8 宫，冲动和较真会被放大，钱、信任、隐私别当场硬碰。",
    riskSunMarsSameHouse:
      "要先留个心：太阳火星同在 {h} 宫，火力猛但容易顶人；重要回复隔一夜更稳。",
    riskMoonVenusSameHouse:
      "要先留个心：月亮金星同在 {h} 宫，感受与喜好绑死，容易一时兴起答应大事。",
    riskGeneric:
      "要先留个心：{n1}和{n2}节奏不同步，你会觉得自己别扭。写下来，分清「急什么」和「怕什么」。",
    riskSinglePeak:
      "要先留个心：事都堆在 {n}，像杯子倒太满。能委托、能延后的，别硬塞今天。",
    todayLayered:
      "今天适合：{h1} 宫先定一个「小到可笑但能完成」的决定；{h2} 宫跟一件具体动作；写下来就算交付。",
    coreSingleTemplate: "一句话：大半戏份在 {h} 宫（{n}）。{archetype}",
    coreSingleArchetype: "心里与动作容易拧。今天只写一条「必须完成的最低版本」。",
    todaySinglePeak: "今天适合：只动 {h} 宫的一条线，分三步，做完第一步就停也行。",
  },
  pro: {
    sunMarsBodyCoreTemplate:
      "日火落在「{houseTheme}」。{sunLine} + {marsLine}，像一台推土机：能开路，也容易把「说到」当「做到」。",
    moonVenusBodyCoreTemplate:
      "月金落在「{houseTheme}」。{moonLine} + {venusLine}，心情与审美同行；能说清楚「我需要什么」，会顺很多。",
    mercuryJupiterTitle: "3. 信息线与扩展线（水星 & 木星）",
    mercuryLineTemplate: "{mercuryLine}：表达偏清晰取向，适合把模糊话改成可检查的一句。",
    jupiterLineTemplate: "{jupiterLine}：扩展接口在「{jupiterTheme}」，用短周期试错更划算。",
    mercuryOnlyFallback: "水星未入表：仍建议关键词与节点写死。",
    jupiterOnlyFallback: "木星未入表：机会先当「待验证」。",
    mercuryJupiterMissing: "水木未入表：信息与扩展先保守读。",
  },
  planetTail: {
    sun: "目标感与自我驱动。",
    moon: "心情潮汐与安全感。",
    mercury: "表达、学习与日程。",
    venus: "关系、审美与取舍。",
    mars: "行动、边界与火气。",
    jupiter: "信念、机会与放大。",
    saturn: "边界、耐心与承担。",
    uranus: "突变、独立与破局。",
    neptune: "想象、共情与含混。",
    pluto: "执念、转化与深层压力。",
    north_node: "成长抓手。",
    south_node: "熟悉区的引力。",
    chiron: "旧伤的学习题。",
  },
  actions: {
    engineTemplate: "单点突破：用 {sunMarsHint}，今天只啃一个硬点，别多线并发。",
    flowTemplate: "日常减噪：用 {moonVenusHint}，给情绪与流程留固定复盘缝。",
    contractTemplate: "先把边界写清：围绕 {mercuryHint}，口头话落成可核对的一句。",
    engineFallback: "最重一题拆三步，先打勾第一步。",
    flowFallback: "每天 10 分钟专门处理误会与返工。",
    contractFallback: "有对价就先对齐范围与截止。",
  },
};

const P4: Patch = {
  statusLine:
    "本表在说什么：行星落宫像在点名——你这段时间的故事，主要发生在生活的哪些房间。",
  matrixCaption: "行星位置矩阵：Planetary Matrix（来源：盘内行星）",
  answer: {
    happenedOppositeTemplate:
      "剧情里最吵的两头，是「{themeA}」对上「{themeB}」：像对台戏。别急着两边都赢，先写清今天谁是主角。",
    happenedDualTemplate:
      "同时响铃的两块：「{themeA}」与「{themeB}」。你会感觉时间被撕成两半；给它们排场次，比同时接两个电话轻松。",
    happenedSinglePeakTemplate:
      "行星多半聚在「{themeA}」（{h}宫）：像所有镜头对准一个场景——高光与过载也会一起放大。",
    coreTemplate:
      "把重点收回：精力在 {h1} 宫（{n1}）与 {h2} 宫（{n2}）之间拉扯。{archetype}",
    coreArchetypeGeneric:
      "一块管「心里怎么感受」，一块管「手上先动哪」；对不上就会拖。把故事缩成今天的一个镜头就够。",
    riskSunMarsConjunction8:
      "别急着下判断：日火同在 8 宫，钱与信任议题容易被点燃，气头上别拍板。",
    riskSunMarsSameHouse:
      "别急着下判断：日火同在 {h} 宫，冲劲像油门踩死，记得踩刹车。",
    riskMoonVenusSameHouse:
      "别急着下判断：月金同在 {h} 宫，感受会替你做决定，重大事项换场景再想。",
    riskGeneric:
      "别急着下判断：{n1}与{n2}各有一套节奏，你会内耗。写下来，分清「现在能做什么」。",
    riskSinglePeak:
      "别急着下判断：压力堆在 {n}，先减载再解释。",
    todayLayered:
      "今天更推荐：{h1} 宫先写一句「我今天要什么结果」；{h2} 宫跟一个小动作；别空谈。",
    coreSingleTemplate: "把重点收回：主场景在 {h} 宫（{n}）。{archetype}",
    coreSingleArchetype: "内心戏与外景不同步时，先拍一条「可见的 B 卷」。",
    todaySinglePeak: "今天更推荐：只推进 {h} 宫的一条线，收一个小尾。",
  },
  pro: {
    sunMarsBodyCoreTemplate:
      "日火场景在「{houseTheme}」。{sunLine} 与 {marsLine} 像导演喊「再来一条」：能量足，但要防把片场烧干。",
    moonVenusBodyCoreTemplate:
      "月金场景在「{houseTheme}」。{moonLine} 与 {venusLine} 让「想要」与「舒服」绑在一起；命名感受，剧情就不乱。",
    mercuryJupiterTitle: "3. 台词与布景（水星 & 木星）",
    mercuryLineTemplate: "{mercuryLine}：台词宜短、宜可核对，少绕弯。",
    jupiterLineTemplate: "{jupiterLine}：布景在「{jupiterTheme}」，扩张用分镜推进。",
    mercuryOnlyFallback: "水星缺席：台词仍建议先对齐关键词。",
    jupiterOnlyFallback: "木星缺席：布景先收一点。",
    mercuryJupiterMissing: "水木缺席：信息与扩展读保守。",
  },
  planetTail: {
    sun: "主角意志。",
    moon: "情绪气氛。",
    mercury: "对白与信息。",
    venus: "关系与美感。",
    mars: "动作与冲突。",
    jupiter: "信念与放大。",
    saturn: "结构与耐心。",
    uranus: "意外与独立。",
    neptune: "迷雾与共情。",
    pluto: "深渊与改写。",
    north_node: "走向。",
    south_node: "惯性。",
    chiron: "伤口功课。",
  },
  actions: {
    engineTemplate: "集中攻坚：用 {sunMarsHint}，今天只打一个关键镜头。",
    flowTemplate: "把节拍捋顺：用 {moonVenusHint}，给生活剪辑留呼吸点。",
    contractTemplate: "用规则收口：围绕 {mercuryHint}，把口头戏变成可执行条款。",
    engineFallback: "一场戏拆三镜，先拍完第一镜。",
    flowFallback: "留 10 分钟做「删废镜头」式复盘。",
    contractFallback: "对价场景先对齐权责与节点。",
  },
};

const P5: Patch = {
  statusLine:
    "本表在说什么：行星落宫＝你的「任务分区」——哪些宫位亮灯，哪些事就会来找你。",
  matrixCaption: "任务分区表：Planetary Matrix（来源：行星位置）",
  answer: {
    happenedOppositeTemplate:
      "【对打】「{themeA}」↔「{themeB}」：资源别两头硬扯。今天勾选：保 A 还是保 B。",
    happenedDualTemplate:
      "【并行】「{themeA}」+「{themeB}」：两条任务线。写清优先级，否则默认「都重要＝都不做」。",
    happenedSinglePeakTemplate:
      "【单核】行星挤在「{themeA}」（{h}宫）：单核高性能，也单核易过热。",
    coreTemplate:
      "不绕了：{h1}宫（{n1}）与 {h2}宫（{n2}）抢你的精力。{archetype}",
    coreArchetypeGeneric:
      "一块是「策略」，一块是「执行」；没对齐就卡。今天只交付一个最小可验收点。",
    riskSunMarsConjunction8:
      "先守住边界：日火 8 宫，别在敏感议题上硬刚。",
    riskSunMarsSameHouse:
      "先守住边界：日火同 {h} 宫，火力别对内也别对外乱喷。",
    riskMoonVenusSameHouse:
      "先守住边界：月金同 {h} 宫，感受≠合同，别混谈。",
    riskGeneric:
      "先守住边界：{n1}/{n2}节奏冲突，列表化再行动。",
    riskSinglePeak:
      "先守住边界：{n}过载，先减三件事。",
    todayLayered:
      "今天把它落下：{h1}宫 1 条决定；{h2}宫 1 条动作；打勾即关单。",
    coreSingleTemplate: "不绕了：主负载在 {h}宫（{n}）。{archetype}",
    coreSingleArchetype: "单核易过热：写「今日唯一交付物」。",
    todaySinglePeak: "今天把它落下：{h}宫只关一张单。",
  },
  pro: {
    sunMarsBodyCoreTemplate:
      "【动力组】「{houseTheme}」：{sunLine} × {marsLine}。强攻型配置，记得留冷却。",
    moonVenusBodyCoreTemplate:
      "【感受组】「{houseTheme}」：{moonLine} × {venusLine}。把感受说清楚，系统才稳定。",
    mercuryJupiterTitle: "3. 【接口组】水星 & 木星",
    mercuryLineTemplate: "{mercuryLine}：接口要清晰，少歧义。",
    jupiterLineTemplate: "{jupiterLine}：扩展面在「{jupiterTheme}」，分期上线。",
    mercuryOnlyFallback: "水星缺省：接口按「先对齐名词」处理。",
    jupiterOnlyFallback: "木星缺省：扩展按「小流量试跑」。",
    mercuryJupiterMissing: "水木缺省：信息与扩展降级读取。",
  },
  planetTail: {
    sun: "目标感。",
    moon: "情绪起伏。",
    mercury: "信息往来。",
    venus: "价值取向。",
    mars: "行动快慢。",
    jupiter: "信念放大。",
    saturn: "耐心与边界。",
    uranus: "意外转折。",
    neptune: "模糊与想象。",
    pluto: "深层改写。",
    north_node: "想练的新方向。",
    south_node: "老路子的惯性。",
    chiron: "敏感与修复。",
  },
  actions: {
    engineTemplate: "定向爆破：{sunMarsHint}，只打一孔。",
    flowTemplate: "流程降噪：{moonVenusHint}，清返工。",
    contractTemplate: "契约锁定：{mercuryHint}，口头→书面。",
    engineFallback: "重单拆三票，先核销第一票。",
    flowFallback: "10 分钟清噪声工单。",
    contractFallback: "范围+截止，再执行。",
  },
};

const P6: Patch = {
  statusLine:
    "本表在说什么：从统计上看，你的行星更常落在哪些宫位——这通常也是你近期压力与成就感的来源。",
  matrixCaption: "行星分布矩阵：Planetary Matrix（来源：盘内行星位置）",
  answer: {
    happenedOppositeTemplate:
      "结构上看，「{themeA}」与「{themeB}」形成对轴张力：资源分配需要明确权重，否则系统会震荡。",
    happenedDualTemplate:
      "结构上看，「{themeA}」与「{themeB}」并行占用注意力：建议建立优先级，而非并行硬扛。",
    happenedSinglePeakTemplate:
      "结构上看，行星集中在「{themeA}」（{h}宫）：集中度提升效率，也提升单点风险。",
    coreTemplate:
      "直接讲：主要张力在 {h1} 宫（{n1}）与 {h2} 宫（{n2}）之间。{archetype}",
    coreArchetypeGeneric:
      "认知与执行若不同步，会出现预测偏差。将目标降级为可验证的下一步，可降低误差。",
    riskSunMarsConjunction8:
      "需要谨慎：日火合于 8 宫，决策易受情绪与隐私议题扰动。",
    riskSunMarsSameHouse:
      "需要谨慎：日火同 {h} 宫，冲动与坚持同步升高。",
    riskMoonVenusSameHouse:
      "需要谨慎：月金同 {h} 宫，情感因素可能覆盖理性评估。",
    riskGeneric:
      "需要谨慎：{n1}与{n2}存在节奏错配，建议外化记录以降低认知负荷。",
    riskSinglePeak:
      "需要谨慎：{n}域堆积任务，超载风险上升。",
    todayLayered:
      "今天的正确打开方式：{h1} 宫形成决策，{h2} 宫形成动作，并留下可复查记录。",
    coreSingleTemplate: "直接讲：主结构在 {h} 宫（{n}）。{archetype}",
    coreSingleArchetype: "单点结构需配「最小闭环」以防失控。",
    todaySinglePeak: "今天的正确打开方式：{h} 宫只推进一个闭环。",
  },
  pro: {
    sunMarsBodyCoreTemplate:
      "日火结构位「{houseTheme}」。{sunLine} 与 {marsLine} 指示意志—行动链路的强度与风险。",
    moonVenusBodyCoreTemplate:
      "月金结构位「{houseTheme}」。{moonLine} 与 {venusLine} 指示情绪—价值回路的耦合程度。",
    mercuryJupiterTitle: "3. 信息结构与扩展结构（水星 & 木星）",
    mercuryLineTemplate: "{mercuryLine}：信息处理偏结构化，适合明确边界与节点。",
    jupiterLineTemplate: "{jupiterLine}：扩展域在「{jupiterTheme}」，宜分阶段验证。",
    mercuryOnlyFallback: "水星缺失：信息策略按保守默认。",
    jupiterOnlyFallback: "木星缺失：扩展策略按保守默认。",
    mercuryJupiterMissing: "水木缺失：信息与扩展按保守默认。",
  },
  planetTail: {
    sun: "意志函数。",
    moon: "情绪反馈。",
    mercury: "信息处理。",
    venus: "价值评估。",
    mars: "行动输出。",
    jupiter: "机会放大。",
    saturn: "约束与耐心。",
    uranus: "变异项。",
    neptune: "模糊项。",
    pluto: "深层重构项。",
    north_node: "优化方向。",
    south_node: "路径依赖。",
    chiron: "修复项。",
  },
  actions: {
    engineTemplate: "关键一步：以 {sunMarsHint} 完成单点闭环任务。",
    flowTemplate: "节奏收紧：以 {moonVenusHint} 降低流程噪声。",
    contractTemplate: "用约定接住沟通：围绕 {mercuryHint} 明确范围与责任。",
    engineFallback: "拆解为三步闭环，先完成第一步。",
    flowFallback: "插入固定复盘窗口以降低返工率。",
    contractFallback: "先定义范围、截止与验收，再执行。",
  },
};

const P7: Patch = {
  statusLine:
    "本表在说什么：说白了，就是看你这段时间「最忙活的生活块」是哪几格——星星都蹲那儿呢。",
  matrixCaption: "行星蹲点表：Planetary Matrix（来源：盘里行星在哪儿）",
  answer: {
    happenedOppositeTemplate:
      "你最纠结的俩方向，正好是「{themeA}」跟「{themeB}」打对台：像同时约了两场局，总得鸽一个。",
    happenedDualTemplate:
      "你身上最闹腾的两块：「{themeA}」和「{themeB}」。不排个先后，你就只能原地打转。",
    happenedSinglePeakTemplate:
      "你大部分星都挤「{themeA}」（{h}宫）：像全家都挤一个屋，热闹是热闹，也容易吵。",
    coreTemplate:
      "换个说法：你主要在 {h1} 宫（{n1}）和 {h2} 宫（{n2}）之间来回跑。{archetype}",
    coreArchetypeGeneric:
      "一个管你心里的小剧场，一个管你手上的真动作；俩不对齐，你就觉得自己「又累又空」。先整一件最小的事。",
    riskSunMarsConjunction8:
      "先看好节奏：日火扎在 8 宫，钱啊信任啊别硬碰硬，缓一缓。",
    riskSunMarsSameHouse:
      "先看好节奏：日火都在 {h} 宫，火气上来快，别当场怼。",
    riskMoonVenusSameHouse:
      "先看好节奏：月金都在 {h} 宫，心情一好就容易答应太多。",
    riskGeneric:
      "先看好节奏：{n1}跟{n2}各走各的拍子，你会烦自己。写下来就顺一半。",
    riskSinglePeak:
      "先看好节奏：{n}这块别堆成山，能扔的扔，能延的延。",
    todayLayered:
      "今天别拖：{h1} 宫先定个小事，{h2} 宫跟个动作，写完就算赢。",
    coreSingleTemplate: "换个说法：大戏都在 {h} 宫（{n}）。{archetype}",
    coreSingleArchetype: "别跟自己较劲：今天就一个「能交差」的小事。",
    todaySinglePeak: "今天别拖：{h} 宫就一件事，干完拉倒。",
  },
  pro: {
    sunMarsBodyCoreTemplate:
      "你日火这块在「{houseTheme}」。{sunLine} 加 {marsLine}，属于「说干就干」型；缺点是干太猛容易没后手。",
    moonVenusBodyCoreTemplate:
      "你月金这块在「{houseTheme}」。{moonLine} 加 {venusLine}，心情跟审美绑一起；讲出来就不那么憋。",
    mercuryJupiterTitle: "3. 嘴皮子跟路子（水星 & 木星）",
    mercuryLineTemplate: "{mercuryLine}：说话喜欢讲清楚，别让人猜。",
    jupiterLineTemplate: "{jupiterLine}：路子宽在「{jupiterTheme}」，先小步试。",
    mercuryOnlyFallback: "水星没进来：也先把话说死关键词。",
    jupiterOnlyFallback: "木星没进来：机会先别贪大。",
    mercuryJupiterMissing: "水木都没进来：先保守，别脑补太多。",
  },
  planetTail: {
    sun: "你想往哪儿走。",
    moon: "你心里稳不稳。",
    mercury: "你怎么说清楚。",
    venus: "你喜欢啥、亲近谁。",
    mars: "你怎么开干、怎么顶。",
    jupiter: "你怎么信、怎么扩。",
    saturn: "你怎么扛、怎么守界。",
    uranus: "你怎么突然变卦。",
    neptune: "你怎么心软、怎么迷糊。",
    pluto: "你怎么较真到底。",
    north_node: "你想练的新技能。",
    south_node: "你老想躲的舒适区。",
    chiron: "你老碰的旧痛点。",
  },
  actions: {
    engineTemplate: "一锤定节：靠 {sunMarsHint}，今天就把一个硬结敲松。",
    flowTemplate: "把日常抚平：靠 {moonVenusHint}，别让自己连环炸毛。",
    contractTemplate: "先把口径定死：靠 {mercuryHint}，别靠「回头再说」。",
    engineFallback: "最重那档子事，拆三小步，先迈第一步。",
    flowFallback: "每天留口气，专门收拾误会。",
    contractFallback: "涉及交换的，先把话说明白再动手。",
  },
};

const P8: Patch = {
  statusLine:
    "本表在说什么：这是一份「生活负荷分布」——行星落在哪些宫，哪些事就更容易找上门、也更吃你的精力。",
  matrixCaption: "行星负荷矩阵：Planetary Matrix（来源：盘内行星位置）",
  answer: {
    happenedOppositeTemplate:
      "需要留意：「{themeA}」与「{themeB}」形成对拉，容易诱发过度补偿。请以单一优先事项稳定系统。",
    happenedDualTemplate:
      "需要留意：「{themeA}」与「{themeB}」同时升高唤醒水平，建议分时段处理。",
    happenedSinglePeakTemplate:
      "需要留意：行星集中于「{themeA}」（{h}宫），可能出现资源过度集中与耗竭。",
    coreTemplate:
      "简明说：主要波动在 {h1} 宫（{n1}）与 {h2} 宫（{n2}）。{archetype}",
    coreArchetypeGeneric:
      "认知与行为若长期不一致，会增加慢性压力。请将目标收缩为可完成的短周期动作。",
    riskSunMarsConjunction8:
      "提醒你一件事：日火在 8 宫，隐私与共有资源议题敏感，避免冲动承诺。",
    riskSunMarsSameHouse:
      "提醒你一件事：日火在 {h} 宫，冲动与固执并存，重大沟通延后处理更安全。",
    riskMoonVenusSameHouse:
      "提醒你一件事：月金在 {h} 宫，情绪愉悦感可能误导判断，重要决定需复核。",
    riskGeneric:
      "提醒你一件事：{n1}与{n2}存在不同步，建议记录以减少反复纠结。",
    riskSinglePeak:
      "提醒你一件事：{n}域任务密度偏高，请主动减载。",
    todayLayered:
      "今天可以先从这一步开始：{h1} 宫明确意图，{h2} 宫完成一个可验证动作。",
    coreSingleTemplate: "简明说：主波动在 {h} 宫（{n}）。{archetype}",
    coreSingleArchetype: "建议以「今日最低有效剂量」推进，避免过度自我施压。",
    todaySinglePeak: "今天可以先从这一步开始：{h} 宫完成一个最小闭环。",
  },
  pro: {
    sunMarsBodyCoreTemplate:
      "日火负荷区「{houseTheme}」。{sunLine} 与 {marsLine} 显示意志—行动链路易高强度运行。",
    moonVenusBodyCoreTemplate:
      "月金负荷区「{houseTheme}」。{moonLine} 与 {venusLine} 显示情绪—价值系统易耦合。",
    mercuryJupiterTitle: "3. 信息负荷与机会负荷（水星 & 木星）",
    mercuryLineTemplate: "{mercuryLine}：信息处理建议明确节点，降低歧义。",
    jupiterLineTemplate: "{jupiterLine}：机会面向「{jupiterTheme}」，建议小剂量验证。",
    mercuryOnlyFallback: "水星未显示：信息策略取保守。",
    jupiterOnlyFallback: "木星未显示：机会策略取保守。",
    mercuryJupiterMissing: "水木未显示：信息与机会取保守。",
  },
  planetTail: {
    sun: "意志负荷。",
    moon: "情绪负荷。",
    mercury: "信息负荷。",
    venus: "关系负荷。",
    mars: "行动负荷。",
    jupiter: "期望负荷。",
    saturn: "责任负荷。",
    uranus: "不确定负荷。",
    neptune: "模糊负荷。",
    pluto: "深层压力。",
    north_node: "成长压力。",
    south_node: "惯性压力。",
    chiron: "敏感点压力。",
  },
  actions: {
    engineTemplate: "收束发力：用 {sunMarsHint} 完成单点关键任务，避免扩散。",
    flowTemplate: "把节律归位：用 {moonVenusHint} 恢复可预测的日常节奏。",
    contractTemplate: "先把口径定死：围绕 {mercuryHint} 书面确认协作条件。",
    engineFallback: "将关键任务拆为可验证子步骤，先完成第一步。",
    flowFallback: "设置短复盘以降低沟通误差。",
    contractFallback: "明确范围、时间线与验收标准。",
  },
};

const P9: Patch = {
  statusLine:
    "本表在说什么：像翻地图——行星主要标在哪些宫位，你最近的人生剧情就更常在那些章节发生。",
  matrixCaption: "行星章节表：Planetary Matrix（来源：盘内行星位置）",
  answer: {
    happenedOppositeTemplate:
      "故事的两条主线在「{themeA}」与「{themeB}」对望：像章回体里的上阕下阕，别指望一页翻完。今天先写哪一阕。",
    happenedDualTemplate:
      "两条支线同时推进：「{themeA}」与「{themeB}」。读者（你自己）会累；给章节排个顺序。",
    happenedSinglePeakTemplate:
      "笔墨集中在「{themeA}」（{h}宫）：这一章写得厚，戏剧冲突也厚。",
    coreTemplate:
      "先给结论：叙事重心在 {h1} 宫（{n1}）与 {h2} 宫（{n2}）之间摆动。{archetype}",
    coreArchetypeGeneric:
      "内心段落与行动段落若脱节，读起来就「前言不搭后语」。先写一段短文：今天的一行剧情。",
    riskSunMarsConjunction8:
      "提醒你一件事：日火在 8 宫，像暗流里的火，钱与信任别写成狗血桥段。",
    riskSunMarsSameHouse:
      "提醒你一件事：日火在 {h} 宫，对白容易变吼叫，停一拍。",
    riskMoonVenusSameHouse:
      "提醒你一件事：月金在 {h} 宫，浪漫滤镜别开太大。",
    riskGeneric:
      "提醒你一件事：{n1}与{n2}两条线抢笔，你会写乱。列提纲。",
    riskSinglePeak:
      "提醒你一件事：{n}这章写太满，下一章没空间。",
    todayLayered:
      "今天可以先从这一步开始：{h1} 宫写一句旁白；{h2} 宫落一个动作句。",
    coreSingleTemplate: "先给结论：主章节在 {h} 宫（{n}）。{archetype}",
    coreSingleArchetype: "别贪多：今天只写一段可见情节。",
    todaySinglePeak: "今天可以先从这一步开始：{h} 宫只写一页。",
  },
  pro: {
    sunMarsBodyCoreTemplate:
      "日火章节在「{houseTheme}」。{sunLine} 与 {marsLine} 像两条粗体：推动强，也要防剧情失控。",
    moonVenusBodyCoreTemplate:
      "月金章节在「{houseTheme}」。{moonLine} 与 {venusLine} 让情绪与审美同场；台词写出来就不闷。",
    mercuryJupiterTitle: "3. 旁白与伏笔（水星 & 木星）",
    mercuryLineTemplate: "{mercuryLine}：旁白宜短、宜准。",
    jupiterLineTemplate: "{jupiterLine}：伏笔落在「{jupiterTheme}」，分章揭晓。",
    mercuryOnlyFallback: "水星未出场：旁白先手写关键词。",
    jupiterOnlyFallback: "木星未出场：伏笔先收。",
    mercuryJupiterMissing: "水木未出场：叙事信息保守读。",
  },
  planetTail: {
    sun: "主角动机。",
    moon: "气氛与回忆。",
    mercury: "对白与信息。",
    venus: "美感与亲密。",
    mars: "冲突与推进。",
    jupiter: "信念与远方。",
    saturn: "规则与时间。",
    uranus: "意外转折。",
    neptune: "梦境与模糊。",
    pluto: "暗线与改写。",
    north_node: "下一卷方向。",
    south_node: "旧卷惯性。",
    chiron: "伤痕母题。",
  },
  actions: {
    engineTemplate: "关键一步：借 {sunMarsHint} 推进一章硬情节。",
    flowTemplate: "节奏收紧：借 {moonVenusHint} 给日常留白。",
    contractTemplate: "用约定接住沟通：借 {mercuryHint} 把口头伏笔落地。",
    engineFallback: "一章拆三幕，先写完第一幕。",
    flowFallback: "每天一段「删废话」式复盘。",
    contractFallback: "把口头约定写成两句可执行话。",
  },
};

const P10: Patch = {
  statusLine: "本表在说什么：行星落哪宫＝你最近哪几块生活最吵、最忙、最显眼。",
  matrixCaption: "行星矩阵 Planetary Matrix（盘内位置）",
  answer: {
    happenedOppositeTemplate:
      "对轴：{themeA} / {themeB}。二选一先站稳，别两头硬扯。",
    happenedDualTemplate:
      "双线：{themeA} + {themeB}。排序，否则全拖。",
    happenedSinglePeakTemplate:
      "单核：{themeA}（{h}宫）。集中，防过热。",
    coreTemplate: "主线：{h1}宫（{n1}）↔{h2}宫（{n2}）。{archetype}",
    coreArchetypeGeneric: "心手不同步→拆一步明天可做。",
    riskSunMarsConjunction8: "警：日火8，钱信私，缓决。",
    riskSunMarsSameHouse: "警：日火同{h}宫，缓回。",
    riskMoonVenusSameHouse: "警：月金同{h}宫，缓签。",
    riskGeneric: "警：{n1}/{n2}节奏拧，写下再动。",
    riskSinglePeak: "警：{n}堆满，减载。",
    todayLayered: "今日：{h1}宫1决；{h2}宫1动。",
    coreSingleTemplate: "主线：{h}宫（{n}）。{archetype}",
    coreSingleArchetype: "单核→今日一事。",
    todaySinglePeak: "今日：{h}宫一事三步。",
  },
  pro: {
    sunMarsBodyCoreTemplate: "日火｜{houseTheme}｜{sunLine}+{marsLine}",
    moonVenusBodyCoreTemplate: "月金｜{houseTheme}｜{moonLine}+{venusLine}",
    mercuryJupiterTitle: "3. 水木",
    mercuryLineTemplate: "{mercuryLine}：口径清。",
    jupiterLineTemplate: "{jupiterLine}：扩｜{jupiterTheme}｜小步。",
    mercuryOnlyFallback: "水缺：先关键词。",
    jupiterOnlyFallback: "木缺：机会保守。",
    mercuryJupiterMissing: "水木缺：保守。",
  },
  planetTail: {
    sun: "意志",
    moon: "情绪",
    mercury: "信息",
    venus: "价值",
    mars: "行动",
    jupiter: "信念",
    saturn: "边界",
    uranus: "突变",
    neptune: "模糊",
    pluto: "深层",
    north_node: "去向",
    south_node: "惯性",
    chiron: "伤点",
  },
  actions: {
    engineTemplate: "攻：{sunMarsHint}，单点。",
    flowTemplate: "稳：{moonVenusHint}，复盘缝。",
    contractTemplate: "锁：{mercuryHint}，书面。",
    engineFallback: "重题→三步→一步。",
    flowFallback: "10分复盘。",
    contractFallback: "范围+截止。",
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

const cache: Partial<Record<VoiceStyleIdZh, PlanetPositionsCopyConfigZh>> = {
  1: V1,
};

/** 本命行星句库基座（未叠盘型 patch）按声部取值。 */
export function planetPositionsNatalBaseForVoice(voiceStyleId: VoiceStyleIdZh): PlanetPositionsCopyConfigZh {
  const hit = cache[voiceStyleId];
  if (hit) return hit;
  if (voiceStyleId === 1) return V1;
  const merged = deepMergePlain(V1, PATCH_BY_VOICE[voiceStyleId as Exclude<VoiceStyleIdZh, 1>]);
  cache[voiceStyleId] = merged;
  return merged;
}
