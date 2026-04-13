import type { PlanetPositionsCopyConfigZh } from "@/lib/astro-planet-positions-copy-config-zh";
import type { ChartKindId } from "@/lib/astro-chart-kinds";

/** 非出生盘：原始读数行星尾句（生活化，与盘型无关可共用） */
export const PLANET_TAIL_PLAIN: NonNullable<PlanetPositionsCopyConfigZh["planetTail"]> = {
  sun: "意志与目标感。",
  moon: "情绪与安全感节律。",
  mercury: "说法、信息与日程接口。",
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
};

/** 行星位置：七种非本命盘的主解读 patch（叠在出生盘句库上） */
export const PLANET_POSITIONS_MAIN_PATCH_BY_KIND: Record<ChartKindId, object> = {
  natal: {},
  synastry: {
    answer: {
      happenedOppositeTemplate:
        "案主本命轮上，最忙的两块正好是面对面的「{themeA}」和「{themeB}」：像一根扁担两头挑。双人怎么咬合请看合盘 Tab，这里只看案主侧底子。先想清楚今天保哪一头，别两头硬掰。",
      happenedDualTemplate:
        "案主本命轮上最显眼的两块是「{themeA}」和「{themeB}」：两件事容易同时抢注意力。相处层面的摩擦与默契仍以合盘为准；这里先排个先后。",
      happenedSinglePeakTemplate:
        "案主大部分行星挤在「{themeA}」（{h}宫）：底子偏集中，累或钻牛角尖可能从这里起。别用这一屏代替双人核对。",
      coreTemplate: "案主侧：精力常在 {h1} 宫（{n1}）和 {h2} 宫（{n2}）之间来回。{archetype}",
      coreArchetypeGeneric:
        "这两块一个像心里怎么盘算，一个像手上怎么落地；若没对齐，会出现「心里明白、手上乱套」或反过来。先把明天能做的一小步写死。",
      riskSunMarsConjunction8:
        "要小心：案主太阳与火星同在 8 宫时，容易又冲又较真，钱、信任、隐私一点就炸。别在累或气头上做决定。",
      riskSunMarsSameHouse:
        "要小心：案主太阳与火星同在 {h} 宫，干劲足但容易不听劝。大事留一句「我明天再回复」。",
      riskMoonVenusSameHouse:
        "要小心：案主月亮与金星同在 {h} 宫，心情和喜好绑在一起，容易「此刻爽就签字」。重要决定缓一缓。",
      riskGeneric:
        "要小心：{n1}和{n2}在案主侧节奏不一，容易「想得多做得少」或反过来。把纠结写下来。",
      riskSinglePeak: "要小心：案主侧事都往 {n} 堆，容易越扛越满。能分出去、能改天的，别全压在今天。",
      todayLayered:
        "今天可以：先在 {h1} 宫相关的事里拿定一个小主意，再在 {h2} 宫落一件具体动作（写下来就算）。合盘层面另开一局。",
      coreSingleTemplate: "案主侧：大半底子落在 {h} 宫（{n}）。{archetype}",
      coreSingleArchetype:
        "这一块既管心里怎么想，又管对外怎么做，容易自己跟自己拧着。把「今天要完成的一件小事」写死。",
      todaySinglePeak: "今天可以：只抓 {h} 宫相关的一件事，切成三步；别同时开新坑。",
    },
    pro: {
      sunMarsBodyCoreTemplate:
        "案主日火落在「{houseTheme}」。{sunLine} 与 {marsLine} 一起看，多是性格里的固定打法；与具体对象怎么互动，合盘 Tab 再往下看。",
      moonVenusBodyCoreTemplate:
        "案主月金落在「{houseTheme}」。{moonLine} 与 {venusLine} 并行时，心情和喜好容易绑在一起；能讲清感受会少内耗。",
      mercuryJupiterTitle: "3. 思路与机会（水星 & 木星）",
      mercuryLineTemplate:
        "{mercuryLine}：案主说话办事偏要把范围、责任想清，适合把含糊说法落成可核对的一句。",
      jupiterLineTemplate:
        "{jupiterLine}：扩展感落在「{jupiterTheme}」，更适合小步试错后复盘，而不是一次押光。",
      mercuryOnlyFallback: "水星未纳入本表：沟通上仍建议先对齐名词与截止时间。",
      jupiterOnlyFallback: "木星未纳入本表：机会面先保守，小步试。",
      mercuryJupiterMissing: "水星与木星未纳入本表：案主侧逻辑与机会模块先按保守策略理解。",
    },
    actions: {
      engineTemplate: "先收尾一件事：借 {sunMarsHint} 的劲，在案主自己的事里完成一个能打勾的动作；与人对峙留给合盘结论。",
      flowTemplate: "稳住日常：用 {moonVenusHint} 的感受当提示，给日程留一点可重复的空白，少连环加班式硬扛。",
      contractTemplate: "对外说清楚：围绕 {mercuryHint}，今天协作先对齐范围与截止时间，再往下做。",
      engineFallback: "把最重的一题拆成三步，先完成第一步。",
      flowFallback: "给日常加 10 分钟复盘，专门处理返工与误会。",
      contractFallback: "涉及对价时，先对齐范围与截止时间，再执行。",
    },
    planetTail: PLANET_TAIL_PLAIN,
  },
  transit: {
    answer: {
      happenedOppositeTemplate:
        "这一张行运盘上，当下最显眼的两块正好是面对面的「{themeA}」和「{themeB}」：像临时把聚光灯打在两端。用来对照本命，不当终身判决书。先想清楚今天保哪一头。",
      happenedDualTemplate:
        "行运窗口里，最抢戏的两块是「{themeA}」和「{themeB}」：两件事同时伸手要你的注意力。对照本命看哪些是旧题复发，别一次判死刑。",
      happenedSinglePeakTemplate:
        "行运盘上行星多半挤在「{themeA}」（{h}宫）：当下故事线偏集中，烦或累可能从这里冒头。记得拉回本命的长配置再看。",
      coreTemplate: "此刻叙事：精力主要在 {h1} 宫（{n1}）和 {h2} 宫（{n2}）之间晃。{archetype}",
      coreArchetypeGeneric:
        "这两块一个像心里怎么反应，一个像手上先动哪边；若没对齐，容易慌或拖。拆成今天能做的一小步。",
      riskSunMarsConjunction8:
        "要小心：行运太阳与火星同在 8 宫时，当下容易又冲又较真，钱、信任、隐私别在气头上碰。",
      riskSunMarsSameHouse:
        "要小心：行运太阳与火星同在 {h} 宫，当下干劲猛但容易顶人。大事缓一句再回。",
      riskMoonVenusSameHouse:
        "要小心：行运月亮与金星同在 {h} 宫，心情和喜好绑死，容易冲动点头。重要决定换口气再想。",
      riskGeneric:
        "要小心：{n1}和{n2}在行运里节奏打架，你会嫌自己乱。写下来，对照本命哪条是老剧本。",
      riskSinglePeak: "要小心：当下事都往 {n} 堆，容易爆。能推明天的别硬塞今天。",
      todayLayered:
        "今天可以：先在 {h1} 宫相关的事里定一个小主意，再在 {h2} 宫落一件具体动作。行运是天气，别当命运盖章。",
      coreSingleTemplate: "此刻叙事：大半戏份在 {h} 宫（{n}）。{archetype}",
      coreSingleArchetype: "心里和手上容易拧着。把「今天一件小事」写死，别的先记笔记。",
      todaySinglePeak: "今天可以：只抓 {h} 宫一件事，三步走完；别并行开新坑。",
    },
    pro: {
      sunMarsBodyCoreTemplate:
        "行运日火落在「{houseTheme}」。{sunLine} 与 {marsLine} 一起看，是当下怎么冲、怎么守的脾气；本命底色另看本命盘。",
      moonVenusBodyCoreTemplate:
        "行运月金落在「{houseTheme}」。{moonLine} 与 {venusLine} 并行时，这几天心情和喜好容易绑紧；能说清就少内耗。",
      mercuryJupiterTitle: "3. 当下思路与机会（水星 & 木星）",
      mercuryLineTemplate:
        "{mercuryLine}：这几天说法与日程接口更敏感，适合把模糊话改成可核对的一句。",
      jupiterLineTemplate:
        "{jupiterLine}：机会感落在「{jupiterTheme}」，行运里宜小步试、快复盘。",
      mercuryOnlyFallback: "水星未纳入本表：沟通仍建议先对齐名词与节点。",
      jupiterOnlyFallback: "木星未纳入本表：机会先保守看待。",
      mercuryJupiterMissing: "水星与木星未纳入本表：当下逻辑与机会按保守理解。",
    },
    actions: {
      engineTemplate: "借 {sunMarsHint}：今天完成一个与行运主题相关、能收口的小动作，别同时开三条线。",
      flowTemplate: "借 {moonVenusHint}：给情绪与日程留一点重复可用的空档，少连环硬顶。",
      contractTemplate: "围绕 {mercuryHint}：对外先对齐说法与截止时间，再往下做。",
      engineFallback: "最急的一题拆三步，先走完第一步。",
      flowFallback: "加 10 分钟复盘槽，处理返工与误会。",
      contractFallback: "有对价就先对齐范围与截止时间。",
    },
    planetTail: PLANET_TAIL_PLAIN,
  },
  ephemeris: {
    answer: {
      happenedOppositeTemplate:
        "指定这一刻的盘面上，最忙的两块正好是面对面的「{themeA}」和「{themeB}」：像事件现场的剖面。用来理解当下接口，不当做人格定调。",
      happenedDualTemplate:
        "这一刻最抢戏的两块是「{themeA}」和「{themeB}」：现场注意力被两头拽。先排先后，别指望一屏定终身。",
      happenedSinglePeakTemplate:
        "这一刻行星多半挤在「{themeA}」（{h}宫）：现场故事线偏集中，紧或乱可能从这里显形。",
      coreTemplate: "此刻盘面：戏份主要在 {h1} 宫（{n1}）和 {h2} 宫（{n2}）。{archetype}",
      coreArchetypeGeneric:
        "两块一个像心里怎么感受，一个像现场先动哪边；没对齐就容易误会节奏。落成一件可见的小动作即可。",
      riskSunMarsConjunction8:
        "要小心：这一刻太阳与火星同在 8 宫，现场容易又冲又较真，钱与信任别当场拍板。",
      riskSunMarsSameHouse: "要小心：这一刻太阳与火星同在 {h} 宫，火气近、易顶牛。大事退一步。",
      riskMoonVenusSameHouse:
        "要小心：这一刻月亮与金星同在 {h} 宫，心情与喜好绑死，容易冲动答应。",
      riskGeneric: "要小心：{n1}与{n2}在现场各喊各的，容易乱。写下来再动。",
      riskSinglePeak: "要小心：现场事都往 {n} 挤，容易超载。能简化的先简。",
      todayLayered:
        "可以：先在 {h1} 宫相关现场定一个小主意，再在 {h2} 宫落一件具体动作。记住这是切片，不是判决书。",
      coreSingleTemplate: "此刻盘面：大半戏份在 {h} 宫（{n}）。{archetype}",
      coreSingleArchetype: "心里与场面容易不同步。抓一件最小可见动作。",
      todaySinglePeak: "可以：只抓 {h} 宫一件事，三步走完。",
    },
    pro: {
      sunMarsBodyCoreTemplate:
        "此刻日火在「{houseTheme}」。{sunLine} 与 {marsLine} 描述现场怎么冲、怎么守，不接终身人格标签。",
      moonVenusBodyCoreTemplate:
        "此刻月金在「{houseTheme}」。{moonLine} 与 {venusLine} 描述当下心情与喜好怎么绑在一起。",
      mercuryJupiterTitle: "3. 此刻信息与放大（水星 & 木星）",
      mercuryLineTemplate: "{mercuryLine}：这一刻说法与信息接口更敏感，适合先对齐再扩散。",
      jupiterLineTemplate: "{jupiterLine}：放大感落在「{jupiterTheme}」，宜小步验证。",
      mercuryOnlyFallback: "水星未纳入：仍建议先对齐关键词与节点。",
      jupiterOnlyFallback: "木星未纳入：机会信号先保守。",
      mercuryJupiterMissing: "水星与木星未纳入：信息与机会按保守读。",
    },
    actions: {
      engineTemplate: "现场动作：用 {sunMarsHint} 完成一件可验收的小事，别多线并发。",
      flowTemplate: "现场节奏：用 {moonVenusHint} 给流程留一点缓冲，少硬顶。",
      contractTemplate: "现场沟通：围绕 {mercuryHint} 先对齐说法与责任边界。",
      engineFallback: "现场最急的一题拆三步，先完成第一步。",
      flowFallback: "留 10 分钟给复述与确认。",
      contractFallback: "有对价就对齐范围与截止时间。",
    },
    planetTail: PLANET_TAIL_PLAIN,
  },
  secondary: {
    answer: {
      happenedOppositeTemplate:
        "次限推进盘上，最显眼的两块正好是面对面的「{themeA}」和「{themeB}」：像年尺度剧情里两头拉扯。用来理解这几年心里主戏，不当当天天气预报。",
      happenedDualTemplate:
        "次限窗口里，最抢戏的两块是「{themeA}」和「{themeB}」：几年里注意力容易在两头分配。先排主次。",
      happenedSinglePeakTemplate:
        "次限盘上行星多半挤在「{themeA}」（{h}宫）：这几年故事线偏集中，累或钻牛角尖可能从这里起。",
      coreTemplate: "次限叙事：精力主要在 {h1} 宫（{n1}）和 {h2} 宫（{n2}）之间拉锯。{archetype}",
      coreArchetypeGeneric:
        "两块一个像心里怎么消化，一个像这几年先动哪边；没对齐就拖。拆成阶段小目标。",
      riskSunMarsConjunction8:
        "要小心：次限太阳与火星同在 8 宫，这几年共有资源、信任议题容易烫手，别在情绪峰值定终身。",
      riskSunMarsSameHouse: "要小心：次限太阳与火星同在 {h} 宫，几年里冲劲大、易硬顶。大事分阶段。",
      riskMoonVenusSameHouse:
        "要小心：次限月亮与金星同在 {h} 宫，几年里心情与喜好绑紧，重大承诺多留缓冲。",
      riskGeneric: "要小心：{n1}与{n2}在次限里节奏不一，容易内耗。写下来分季看。",
      riskSinglePeak: "要小心：几年里事都往 {n} 堆，容易扛满。能分批就别一次背完。",
      todayLayered:
        "可以：在 {h1} 宫相关方向定一个本季小目标，在 {h2} 宫落一条可追踪动作。次限看年景，别当今日指令。",
      coreSingleTemplate: "次限叙事：大半戏份在 {h} 宫（{n}）。{archetype}",
      coreSingleArchetype: "心里与行动容易拧几年。先定一个季度内可完成的小块。",
      todaySinglePeak: "可以：从 {h} 宫相关方向切出本周一件推进，别贪多。",
    },
    pro: {
      sunMarsBodyCoreTemplate:
        "次限日火在「{houseTheme}」。{sunLine} 与 {marsLine} 描述这几年意志与行动的主轴怎么叠在一起。",
      moonVenusBodyCoreTemplate:
        "次限月金在「{houseTheme}」。{moonLine} 与 {venusLine} 描述几年里情绪与价值感怎么同行。",
      mercuryJupiterTitle: "3. 次限思路与扩展（水星 & 木星）",
      mercuryLineTemplate: "{mercuryLine}：这几年说法与学习接口更吃「说清楚再扩散」。",
      jupiterLineTemplate: "{jupiterLine}：扩展落在「{jupiterTheme}」，适合阶段式试错。",
      mercuryOnlyFallback: "水星未纳入：仍建议分阶段对齐计划。",
      jupiterOnlyFallback: "木星未纳入：扩展先保守。",
      mercuryJupiterMissing: "水星与木星未纳入：次限里信息与扩展按保守读。",
    },
    actions: {
      engineTemplate: "年尺度：借 {sunMarsHint} 定一个季度内能收口的硬目标，别同时三线攻坚。",
      flowTemplate: "年尺度：用 {moonVenusHint} 调整日常节律，让情绪有命名、有出口。",
      contractTemplate: "年尺度：围绕 {mercuryHint} 把口头约定改成可复查的一句。",
      engineFallback: "选一条主线，拆到本季三步。",
      flowFallback: "每周留固定时间复盘心情与日程。",
      contractFallback: "长期协作把范围写清，按季回顾。",
    },
    planetTail: PLANET_TAIL_PLAIN,
  },
  tertiary: {
    answer: {
      happenedOppositeTemplate:
        "三限推进盘上，最显眼的两块正好是面对面的「{themeA}」和「{themeB}」：像月尺度剧情里两头拉扯。用来理解这几周主戏，不当终身定调。",
      happenedDualTemplate:
        "三限窗口里，最抢戏的两块是「{themeA}」和「{themeB}」：几周里注意力容易两头分。先排先后。",
      happenedSinglePeakTemplate:
        "三限盘上行星多半挤在「{themeA}」（{h}宫）：这几周故事线偏集中，烦或累可能从这里起。",
      coreTemplate: "三限叙事：精力主要在 {h1} 宫（{n1}）和 {h2} 宫（{n2}）之间晃。{archetype}",
      coreArchetypeGeneric:
        "两块一个像心里怎么起伏，一个像这周先动哪边；没对齐就拖。拆成本周一小步。",
      riskSunMarsConjunction8:
        "要小心：三限太阳与火星同在 8 宫，这几周共有与信任议题容易烫，别在气头上定音。",
      riskSunMarsSameHouse: "要小心：三限太阳与火星同在 {h} 宫，这几周冲、易顶。缓一句。",
      riskMoonVenusSameHouse:
        "要小心：三限月亮与金星同在 {h} 宫，心情与喜好绑紧，别冲动签字。",
      riskGeneric: "要小心：{n1}与{n2}在三限里抢戏，容易乱。写下来按周看。",
      riskSinglePeak: "要小心：几周里事都往 {n} 堆，容易满。能拆到明天就别堆周末。",
      todayLayered:
        "可以：在 {h1} 宫相关事先拿定本周一个小主意，在 {h2} 宫落一件具体动作。三限看几周，别当十年大运。",
      coreSingleTemplate: "三限叙事：大半戏份在 {h} 宫（{n}）。{archetype}",
      coreSingleArchetype: "心里与动作容易几周里拧着。写清「本周一件小事」。",
      todaySinglePeak: "可以：只抓 {h} 宫相关的一件，三天内打勾。",
    },
    pro: {
      sunMarsBodyCoreTemplate:
        "三限日火在「{houseTheme}」。{sunLine} 与 {marsLine} 描述这几周意志与行动怎么叠。",
      moonVenusBodyCoreTemplate:
        "三限月金在「{houseTheme}」。{moonLine} 与 {venusLine} 描述几周里情绪与喜好怎么同行。",
      mercuryJupiterTitle: "3. 三限思路与机会（水星 & 木星）",
      mercuryLineTemplate: "{mercuryLine}：这几周说法与信息更敏感，先对齐再扩散。",
      jupiterLineTemplate: "{jupiterLine}：机会感落在「{jupiterTheme}」，宜小步。",
      mercuryOnlyFallback: "水星未纳入：仍建议周计划写清关键词。",
      jupiterOnlyFallback: "木星未纳入：机会先保守。",
      mercuryJupiterMissing: "水星与木星未纳入：三限里信息与机会按保守读。",
    },
    actions: {
      engineTemplate: "几周尺度：借 {sunMarsHint} 完成一件本周可收口的事，别并行硬啃。",
      flowTemplate: "几周尺度：用 {moonVenusHint} 给日程留可重复的空档。",
      contractTemplate: "几周尺度：围绕 {mercuryHint} 先对齐说法与节点。",
      engineFallback: "本周选一条主线，拆三天。",
      flowFallback: "每天留 10 分钟给心情与日程对齐。",
      contractFallback: "本周协作先对齐范围与截止时间。",
    },
    planetTail: PLANET_TAIL_PLAIN,
  },
  solar_return: {
    answer: {
      happenedOppositeTemplate:
        "日返盘上，最显眼的两块正好是面对面的「{themeA}」和「{themeB}」：像这一公历年里的两头拉扯。用来理解年度主题，不当每日指令。",
      happenedDualTemplate:
        "这一日返年里，最抢戏的两块是「{themeA}」和「{themeB}」：全年注意力容易两头分。先定年度优先级。",
      happenedSinglePeakTemplate:
        "日返盘上行星多半挤在「{themeA}」（{h}宫）：这一年故事线偏集中，压力或投入可能从这里起。",
      coreTemplate: "年度叙事：精力主要在 {h1} 宫（{n1}）和 {h2} 宫（{n2}）之间分配。{archetype}",
      coreArchetypeGeneric:
        "两块一个像心里怎么定调，一个像这一年先动哪边；没对齐就全年拖。拆成季度可见的小块。",
      riskSunMarsConjunction8:
        "要小心：日返太阳与火星同在 8 宫，这一年共有与信任线容易烫，别在情绪峰值定大方向。",
      riskSunMarsSameHouse: "要小心：日返太阳与火星同在 {h} 宫，全年冲劲大、易硬顶。大事分季看。",
      riskMoonVenusSameHouse:
        "要小心：日返月亮与金星同在 {h} 宫，心情与喜好全年绑紧，重大承诺多留缓冲。",
      riskGeneric: "要小心：{n1}与{n2}在日返里全年抢戏，容易耗。写下来按季复盘。",
      riskSinglePeak: "要小心：全年事都往 {n} 堆，容易扛满。能分批就别一次背完。",
      todayLayered:
        "可以：在 {h1} 宫相关方向定一个本季主题，在 {h2} 宫落一条可追踪动作。日返看年景，日常仍要拆小。",
      coreSingleTemplate: "年度叙事：大半戏份在 {h} 宫（{n}）。{archetype}",
      coreSingleArchetype: "心里与行动容易全年拧着。先定本季一件可见成果。",
      todaySinglePeak: "可以：从 {h} 宫方向切出本月一件推进，别贪多。",
    },
    pro: {
      sunMarsBodyCoreTemplate:
        "日返日火在「{houseTheme}」。{sunLine} 与 {marsLine} 描述这一年意志与行动怎么叠。",
      moonVenusBodyCoreTemplate:
        "日返月金在「{houseTheme}」。{moonLine} 与 {venusLine} 描述全年情绪与价值感怎么同行。",
      mercuryJupiterTitle: "3. 年度思路与扩展（水星 & 木星）",
      mercuryLineTemplate: "{mercuryLine}：这一年说法与学习接口更适合「先立规矩再扩展」。",
      jupiterLineTemplate: "{jupiterLine}：扩展落在「{jupiterTheme}」，适合按季复盘。",
      mercuryOnlyFallback: "水星未纳入：年度计划仍建议写清节点。",
      jupiterOnlyFallback: "木星未纳入：扩展先保守。",
      mercuryJupiterMissing: "水星与木星未纳入：日返里信息与扩展按保守读。",
    },
    actions: {
      engineTemplate: "年度：借 {sunMarsHint} 定一个本季能收口的硬目标，别全年多线硬扛。",
      flowTemplate: "年度：用 {moonVenusHint} 调整日常节律，让情绪有出口。",
      contractTemplate: "年度：围绕 {mercuryHint} 把口头约定改成可复查的一句。",
      engineFallback: "选年度一条主线，拆到本季三步。",
      flowFallback: "每月留固定时间复盘心情与日程。",
      contractFallback: "长期协作把范围写清，按季回顾。",
    },
    planetTail: PLANET_TAIL_PLAIN,
  },
  lunar_return: {
    answer: {
      happenedOppositeTemplate:
        "月返盘上，最显眼的两块正好是面对面的「{themeA}」和「{themeB}」：像这一小段日子里的两头拉扯。用来理解情绪与起居节奏，不当终身定调。",
      happenedDualTemplate:
        "这一月返窗口里，最抢戏的两块是「{themeA}」和「{themeB}」：几周里注意力容易两头分。先排先后。",
      happenedSinglePeakTemplate:
        "月返盘上行星多半挤在「{themeA}」（{h}宫）：这一小段日子故事线偏集中，烦或累可能从这里起。",
      coreTemplate: "月返叙事：精力主要在 {h1} 宫（{n1}）和 {h2} 宫（{n2}）之间晃。{archetype}",
      coreArchetypeGeneric:
        "两块一个像心里怎么起伏，一个像这几天先动哪边；没对齐就乱。拆成很小的一步。",
      riskSunMarsConjunction8:
        "要小心：月返太阳与火星同在 8 宫，这一小段共有与信任线容易烫，别在气头上定音。",
      riskSunMarsSameHouse: "要小心：月返太阳与火星同在 {h} 宫，这几天冲、易顶。缓一句。",
      riskMoonVenusSameHouse:
        "要小心：月返月亮与金星同在 {h} 宫，心情与喜好绑紧，别冲动答应。",
      riskGeneric: "要小心：{n1}与{n2}在月返里抢戏，容易乱。写下来按天看。",
      riskSinglePeak: "要小心：这一小段事都往 {n} 堆，容易满。能拆就别堆到周末爆掉。",
      todayLayered:
        "可以：在 {h1} 宫相关事先拿定一个小主意，在 {h2} 宫落一件具体动作。月返看短窗，别当十年大运。",
      coreSingleTemplate: "月返叙事：大半戏份在 {h} 宫（{n}）。{archetype}",
      coreSingleArchetype: "心里与动作容易这几天拧着。写清「今天一件小事」。",
      todaySinglePeak: "可以：只抓 {h} 宫相关的一件，两天内打勾。",
    },
    pro: {
      sunMarsBodyCoreTemplate:
        "月返日火在「{houseTheme}」。{sunLine} 与 {marsLine} 描述这一小段意志与行动怎么叠。",
      moonVenusBodyCoreTemplate:
        "月返月金在「{houseTheme}」。{moonLine} 与 {venusLine} 描述这几天情绪与喜好怎么同行。",
      mercuryJupiterTitle: "3. 月返思路与机会（水星 & 木星）",
      mercuryLineTemplate: "{mercuryLine}：这几天说法与信息更敏感，先对齐再扩散。",
      jupiterLineTemplate: "{jupiterLine}：机会感落在「{jupiterTheme}」，宜更小步。",
      mercuryOnlyFallback: "水星未纳入：仍建议日程写清关键词。",
      jupiterOnlyFallback: "木星未纳入：机会先保守。",
      mercuryJupiterMissing: "水星与木星未纳入：月返里信息与机会按保守读。",
    },
    actions: {
      engineTemplate: "短窗：借 {sunMarsHint} 完成一件两天内可收口的事，别并行硬啃。",
      flowTemplate: "短窗：用 {moonVenusHint} 给起居留一点空白。",
      contractTemplate: "短窗：围绕 {mercuryHint} 先对齐说法与节点。",
      engineFallback: "选一件最急的事，拆到明天。",
      flowFallback: "每天留 10 分钟给心情点名。",
      contractFallback: "这几天协作先对齐范围与截止时间。",
    },
    planetTail: PLANET_TAIL_PLAIN,
  },
};
