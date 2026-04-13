/**
 * 八种盘型下，工作台与星盘读数区各视图的固定中文说明（与 `chartKind` 一一对应）。
 * 五联观测正文仍由 `astro-observation-main-copy-by-chart-kind-zh` 等生成；此处只管标题、Tab、副文案与综合结论收束句。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";

export function chartKindFromWheelMeta(chart: { chartKindMeta?: { id?: string } } | null | undefined): ChartKindId {
  const id = chart?.chartKindMeta?.id;
  if (
    id === "natal" ||
    id === "synastry" ||
    id === "transit" ||
    id === "ephemeris" ||
    id === "secondary" ||
    id === "tertiary" ||
    id === "solar_return" ||
    id === "lunar_return"
  ) {
    return id;
  }
  return "natal";
}

/** 星盘数据折叠卡副标题：接在宫位制之后，说明当前盘型 + 表内范围 */
export function chartDataCardSubtitleForKind(
  kind: ChartKindId,
  params: { houseSystemZh: string | null; includeMinorAspects: boolean },
): string {
  const aspectPart = params.includeMinorAspects
    ? "行星落点、宫位、轴点与相位（含次要；与排盘容许度一致，可上下滑动查看）。"
    : "行星落点、宫位、轴点与相位（仅主；与排盘容许度一致，可上下滑动查看）。";
  const head = CHART_DATA_CARD_HEAD_ZH[kind];
  const hs = params.houseSystemZh ? `宫位制：${params.houseSystemZh}。` : "";
  return `${hs}${head}${aspectPart}`;
}

/** 星盘数据卡副标题里「宫位制」之后的盘型头句；声部成稿见 `astro-chart-data-card-subtitle-voice-zh`。 */
export const CHART_DATA_CARD_HEAD_ZH: Record<ChartKindId, string> = {
  natal: "出生盘：",
  synastry: "合盘视图：主轮为案主本命；双人相位与互落宫见本卡内「合盘」Tab。",
  transit: "行运盘：当前天象落宫与盘内相位；行运×本命见「行运↔本命」Tab。",
  ephemeris: "时刻盘：指定时刻的盘内快照；不接终身人格定性。",
  secondary: "次限推运盘：年尺度推进下的盘内结构；不当单日吉凶。",
  tertiary: "三限推运盘：月尺度推进下的盘内结构；不当终身定调。",
  solar_return: "日返盘：太阳回归当刻的年度主题盘；配合本命看全年侧重。",
  lunar_return: "月返盘：月亮回归当刻的短周期盘；配合本命看情绪与起居接口。",
};

/** 实相观测（轮盘）卡副标题：在通用「开关/相位线」说明前加盘型一句 */
export function wheelZoneSubtitleForKind(
  kind: ChartKindId,
  baseWheelSubtitle: string,
): string {
  const pre = WHEEL_ZONE_PREFIX_ZH[kind];
  return pre ? `${pre}${baseWheelSubtitle}` : baseWheelSubtitle;
}

/** 轮盘卡副标题盘型前缀；声部成稿见 `astro-workspace-wheel-card-subtitle-voice-zh`。 */
export const WHEEL_ZONE_PREFIX_ZH: Record<ChartKindId, string> = {
  natal: "",
  synastry: "合盘时轮面为案主本命；双人几何在数据区合盘 Tab。",
  transit: "行运轮为当下天象；与本命交会读行运↔本命。",
  ephemeris: "时刻轮为事件现场切片。",
  secondary: "次限轮对应推进龄，看年景演变。",
  tertiary: "三限轮对应推进月节律，看几周走势。",
  solar_return: "日返轮对应当年太阳回归瞬间。",
  lunar_return: "月返轮对应当前搜索到的月亮回归瞬间。",
};

export type ReadoutViewTabLabelsZh = {
  planet: string;
  cusp: string;
  major: string;
  minor: string;
  angle: string;
  synthesis: string;
  synthesisSubtitle: string;
  /** 「行运↔本命」Tab（有数据时显示） */
  transitNatalTab: string;
  /** 「合盘」Tab（有双人数据时显示） */
  synastryTab: string;
};

export const READOUT_VIEW_TAB_LABELS_ZH: Record<ChartKindId, ReadoutViewTabLabelsZh> = {
  natal: {
    planet: "行星位置",
    cusp: "12宫头",
    major: "盘内主相位",
    minor: "盘内次相位",
    angle: "星体与上升/天顶",
    synthesis: "综合结论",
    synthesisSubtitle: "轴线与各表读数的规则归纳 · 可对表",
    transitNatalTab: "行运↔本命",
    synastryTab: "合盘",
  },
  synastry: {
    planet: "案主行星（本命轮）",
    cusp: "案主12宫头",
    major: "案主盘内主相位",
    minor: "案主盘内次相位",
    angle: "案主星体与轴点",
    synthesis: "综合结论（案主轮）",
    synthesisSubtitle: "主轮结构归纳；双人互动以合盘 Tab 为准",
    transitNatalTab: "行运↔本命",
    synastryTab: "双人合盘",
  },
  transit: {
    planet: "行运行星位置",
    cusp: "行运12宫头",
    major: "行运盘内主相位",
    minor: "行运盘内次相位",
    angle: "行运星体与轴点",
    synthesis: "综合结论（行运）",
    synthesisSubtitle: "当下盘面归纳；对照本命看触发",
    transitNatalTab: "行运天象↔本命",
    synastryTab: "合盘",
  },
  ephemeris: {
    planet: "时刻行星位置",
    cusp: "时刻12宫头",
    major: "时刻盘内主相位",
    minor: "时刻盘内次相位",
    angle: "时刻星体与轴点",
    synthesis: "综合结论（时刻）",
    synthesisSubtitle: "瞬时切片归纳；不接终身定性",
    transitNatalTab: "行运↔本命",
    synastryTab: "合盘",
  },
  secondary: {
    planet: "次限行星位置",
    cusp: "次限12宫头",
    major: "次限盘内主相位",
    minor: "次限盘内次相位",
    angle: "次限星体与轴点",
    synthesis: "综合结论（次限）",
    synthesisSubtitle: "年尺度推进归纳",
    transitNatalTab: "行运↔本命",
    synastryTab: "合盘",
  },
  tertiary: {
    planet: "三限行星位置",
    cusp: "三限12宫头",
    major: "三限盘内主相位",
    minor: "三限盘内次相位",
    angle: "三限星体与轴点",
    synthesis: "综合结论（三限）",
    synthesisSubtitle: "月尺度推进归纳",
    transitNatalTab: "行运↔本命",
    synastryTab: "合盘",
  },
  solar_return: {
    planet: "日返行星位置",
    cusp: "日返12宫头",
    major: "日返盘内主相位",
    minor: "日返盘内次相位",
    angle: "日返星体与轴点",
    synthesis: "综合结论（日返）",
    synthesisSubtitle: "年度主题归纳",
    transitNatalTab: "行运↔本命",
    synastryTab: "合盘",
  },
  lunar_return: {
    planet: "月返行星位置",
    cusp: "月返12宫头",
    major: "月返盘内主相位",
    minor: "月返盘内次相位",
    angle: "月返星体与轴点",
    synthesis: "综合结论（月返）",
    synthesisSubtitle: "短周期归纳",
    transitNatalTab: "行运↔本命",
    synastryTab: "合盘",
  },
};

export type ObservationPanelTitlesZh = {
  planet: string;
  major: string;
  house: string;
  minor: string;
  angle: string;
};

export const OBSERVATION_PANEL_TITLES_ZH: Record<ChartKindId, ObservationPanelTitlesZh> = {
  natal: {
    planet: "行星位置（Planetary Positions）观测报告",
    major: "盘内主相位（Major Aspects）观测报告",
    house: "十二宫宫头（House Cusps）观测报告",
    minor: "盘内次要相位（Minor Aspects）观测报告",
    angle: "星体与上升 / 天顶（Angles Aspects）观测报告",
  },
  synastry: {
    planet: "案主·行星位置观测报告（本命轮）",
    major: "案主·盘内主相位观测报告（本命轮）",
    house: "案主·十二宫宫头观测报告（本命轮）",
    minor: "案主·盘内次要相位观测报告（本命轮）",
    angle: "案主·星体与轴点观测报告（本命轮）",
  },
  transit: {
    planet: "行运·行星位置观测报告",
    major: "行运·盘内主相位观测报告",
    house: "行运·十二宫宫头观测报告",
    minor: "行运·盘内次要相位观测报告",
    angle: "行运·星体与轴点观测报告",
  },
  ephemeris: {
    planet: "时刻盘·行星位置观测报告",
    major: "时刻盘·盘内主相位观测报告",
    house: "时刻盘·十二宫宫头观测报告",
    minor: "时刻盘·盘内次要相位观测报告",
    angle: "时刻盘·星体与轴点观测报告",
  },
  secondary: {
    planet: "次限·行星位置观测报告",
    major: "次限·盘内主相位观测报告",
    house: "次限·十二宫宫头观测报告",
    minor: "次限·盘内次要相位观测报告",
    angle: "次限·星体与轴点观测报告",
  },
  tertiary: {
    planet: "三限·行星位置观测报告",
    major: "三限·盘内主相位观测报告",
    house: "三限·十二宫宫头观测报告",
    minor: "三限·盘内次要相位观测报告",
    angle: "三限·星体与轴点观测报告",
  },
  solar_return: {
    planet: "日返·行星位置观测报告",
    major: "日返·盘内主相位观测报告",
    house: "日返·十二宫宫头观测报告",
    minor: "日返·盘内次要相位观测报告",
    angle: "日返·星体与轴点观测报告",
  },
  lunar_return: {
    planet: "月返·行星位置观测报告",
    major: "月返·盘内主相位观测报告",
    house: "月返·十二宫宫头观测报告",
    minor: "月返·盘内次要相位观测报告",
    angle: "月返·星体与轴点观测报告",
  },
};

export type WorkspaceDecodeSurfaceZh = {
  readoutLayerBlurb: string;
  decodeDepthLead: string;
  big3Title: string;
  big3Subtitle: string;
  structureDecodeSubtitle: string;
  rhythmLayerSubtitle: string;
  /** 「今日参考」折叠卡副标题 */
  todayRefSubtitle: string;
};

export const WORKSPACE_DECODE_SURFACE_ZH: Record<ChartKindId, WorkspaceDecodeSurfaceZh> = {
  natal: {
    readoutLayerBlurb:
      "当前为出生盘：各模块观测解读已贴在「立根」星盘数据对应表格下方；表可收起，解读在表头下可见。此处用语义路由与主解读做校准。",
    decodeDepthLead:
      "当前盘型为出生盘：时间锚点是出生时刻与出生地。本区解释长期结构基线，不当作单日运势。",
    big3Title: "你的日月升",
    big3Subtitle: "先看这三颗，最容易对上日常感受。",
    structureDecodeSubtitle: "位于星盘数据之后：先读证据，再读解释。",
    rhythmLayerSubtitle:
      "宫位议题与相位证据摘要；八种盘型下，五联观测均贴在星盘数据各表下方，与当前轮几何一致。",
    todayRefSubtitle: "仅供当天心情与节奏参考，不改变出生结构。",
  },
  synastry: {
    readoutLayerBlurb:
      "合盘视图：主轮为案主本命，五联贴在案主数据表下；双人相位与互落宫见「合盘」Tab。此处用来校准案主侧读数，不把双人结论压在一轮上。",
    decodeDepthLead:
      "当前为合盘模式：主解读仍基于案主本命轮；关系机制请结合合盘 Tab 与对象出生数据。",
    big3Title: "案主的日月升",
    big3Subtitle: "主轮三主星，用来对齐案主日常感受；相处以合盘为准。",
    structureDecodeSubtitle: "案主侧结构解读；双人互动请对照合盘与双方档案。",
    rhythmLayerSubtitle:
      "合盘时五联贴在案主数据表下，双人数据在合盘 Tab。读数分层仍可用，勿用案主轮一笔代替关系核对。",
    todayRefSubtitle: "今日条线是日历节奏提示；关系判断仍以合盘与双方本命为据。",
  },
  transit: {
    readoutLayerBlurb:
      "行运盘：五联贴在当前行运数据表下；行运×本命主相位见「行运↔本命」Tab。本区另有行运实时报告块。别把当下窗口写成终身定调。",
    decodeDepthLead:
      "当前为行运盘：锚点是「现在」相对本命。本区解释当下触发与窗口，不替代出生结构全文。",
    big3Title: "本命日月升（对照用）",
    big3Subtitle: "档案三主星仍是长期底色；行运表描述的是当下天象落宫。",
    structureDecodeSubtitle: "先看清星盘数据里的行运与行运×本命，再读正文摘录。",
    rhythmLayerSubtitle:
      "行运下五联观测与当前轮一致；另显示行运实时报告。综合结论 Tab 会标明行运语境。",
    todayRefSubtitle: "今日参考可与行运盘对照，看「今天的外界节奏」与「当下的天象落宫」是否同向。",
  },
  ephemeris: {
    readoutLayerBlurb:
      "时刻盘：五联贴在指定时刻的盘面表下。用于事件现场切片，不接终身人格判决书。",
    decodeDepthLead:
      "当前为时刻盘：锚点是选定的时间地点。本区只谈该切片可读的结构，不外推成长期定性。",
    big3Title: "档案日月升（背景）",
    big3Subtitle: "正文仍来自出生结构；时刻表描述的是该瞬间天象。",
    structureDecodeSubtitle: "时刻数据优先；长文为辅，勿混口径。",
    rhythmLayerSubtitle:
      "时刻盘五联与当刻轮一致；读数分层帮助你对齐「这一刻」与「一生」的边界。",
    todayRefSubtitle: "今日参考是日历向提示；与时刻盘无同一锚点时，请分开理解。",
  },
  secondary: {
    readoutLayerBlurb:
      "次限盘：五联贴在推进盘面表下。看年尺度演变，不当每日天气预报。",
    decodeDepthLead:
      "当前为次限推运：锚点是日—年映射。本区谈几年里的慢变结构，不替代出生盘全文。",
    big3Title: "本命日月升（参照）",
    big3Subtitle: "档案三主星是底色；次限表是推进后的场域与相位。",
    structureDecodeSubtitle: "先读次限数据区，再读本命长文，分开理解时间尺度。",
    rhythmLayerSubtitle:
      "次限下五联与推进轮几何一致；用语义路由时记得按「年」复盘，不按「日」赌吉凶。",
    todayRefSubtitle: "今日参考是当日微节奏；次限看年景，别把日历条当成推进结论。",
  },
  tertiary: {
    readoutLayerBlurb:
      "三限盘：五联贴在推进盘面表下。看月尺度节律，不当终身定调。",
    decodeDepthLead:
      "当前为三限推运：锚点是日—月映射。本区谈几周内的节拍，不替代出生盘全文。",
    big3Title: "本命日月升（参照）",
    big3Subtitle: "档案三主星是底色；三限表是近窗推进。",
    structureDecodeSubtitle: "先读三限数据区，再读本命长文，注意尺度。",
    rhythmLayerSubtitle:
      "三限下五联与推进轮一致；适合安排节奏，不适合重写身份结论。",
    todayRefSubtitle: "今日参考可当「今天要不要硬顶」的提示；三限仍看几周窗口。",
  },
  solar_return: {
    readoutLayerBlurb:
      "日返盘：五联贴在太阳回归当刻的盘面表下。用于年度主题，不当每日指令。",
    decodeDepthLead:
      "当前为日返盘：锚点是太阳回到本命黄经的瞬间。本区谈这一公历年的侧重，仍建议对照本命。",
    big3Title: "本命日月升（参照）",
    big3Subtitle: "档案三主星是终身底色；日返表是年度切片。",
    structureDecodeSubtitle: "年度数据与出生长文联读：先分清哪个是年、哪个是一生。",
    rhythmLayerSubtitle:
      "日返五联与返盘轮一致；读数分层便于你做年度排兵，而非单日决策。",
    todayRefSubtitle: "今日参考是当日节奏；日返定全年主题，二者尺度不同。",
  },
  lunar_return: {
    readoutLayerBlurb:
      "月返盘：五联贴在月亮回归当刻的盘面表下。用于短周期情绪与起居，不当十年大运。",
    decodeDepthLead:
      "当前为月返盘：锚点是月亮回到本命黄经（相对此刻向后搜索）。本区谈这一小段日子，仍建议对照本命。",
    big3Title: "本命日月升（参照）",
    big3Subtitle: "档案三主星是底色；月返表是短窗切片。",
    structureDecodeSubtitle: "短窗数据与出生长文联读：注意别把几天写成一辈子。",
    rhythmLayerSubtitle:
      "月返五联与返盘轮一致；适合月度调度，不适合替代年度与终身结构。",
    todayRefSubtitle: "今日参考可对照月返窗口内的起居节奏；别把日历条当成月返全文。",
  },
};

/**
 * 综合结论末尾「若只记一句」：非出生盘用固定收束，避免终身口吻套在推运/行运上。
 * 出生盘传 null 时由算法生成（见 astro-chart-readout-synthesis-zh）。
 */
export const READOUT_SYNTHESIS_ONE_LINER_ZH: Record<ChartKindId, string | null> = {
  natal: null,
  synastry:
    "若只记一句：这一屏是案主本命轮上的归纳；两人怎么磨合，要以合盘与双方档案为准，别用主轮代替关系结论。",
  transit:
    "若只记一句：这是当下行运盘的归纳，用来对照本命里长期配置；别把几天的爽或不爽写成终身判决书。",
  ephemeris:
    "若只记一句：这是指定时刻的盘面归纳，只服务那个窗口的决定；人格与长期走向仍回到出生盘。",
  secondary:
    "若只记一句：次限看几年里的慢变，像年景天气；真正的人格底盘仍以本命为准，别用推进盘一次定终身。",
  tertiary:
    "若只记一句：三限看几周里的节拍与松紧，适合排程；身份与长期结构仍以本命为准。",
  solar_return:
    "若只记一句：日返像这一年的主题海报，帮你看全年侧重；别把它当成每天的指令，也要对照本命。",
  lunar_return:
    "若只记一句：月返像这一小段的起居与情绪提示，帮你看短窗；别把它当成年度或终身结论。",
};

// ─── 大师级补齐：数据卡标题、三区导览、主流判读提示、综合结论中段（上升/天顶/四宫）───

export const CHART_DATA_CARD_TITLE_ZH: Record<ChartKindId, string> = {
  natal: "星盘数据（出生盘）",
  synastry: "星盘数据（合盘·案主轮）",
  transit: "星盘数据（行运盘）",
  ephemeris: "星盘数据（时刻盘）",
  secondary: "星盘数据（次限推运）",
  tertiary: "星盘数据（三限推运）",
  solar_return: "星盘数据（日返盘）",
  lunar_return: "星盘数据（月返盘）",
};

export type WorkspaceCoreZoneRow = {
  id: "origin" | "reality" | "decoding";
  title: string;
  copy: string;
  anchorId: string;
};

const CORE_ZONE_ORIGIN: WorkspaceCoreZoneRow = {
  id: "origin",
  title: "初始参数",
  copy: "档案、盘型、宫位制与相位口径",
  anchorId: "section-chart-birth",
};

const REALITY_ZONE_COPY_ZH: Record<ChartKindId, string> = {
  natal: "出生轮盘与瑞士读数表",
  synastry: "案主本命轮 + 数据区合盘",
  transit: "行运轮盘与当下天象表",
  ephemeris: "指定时刻的轮盘与切片表",
  secondary: "次限推进轮与年尺度表",
  tertiary: "三限推进轮与月尺度表",
  solar_return: "日返当刻轮与年度主题表",
  lunar_return: "月返当刻轮与短周期表",
};

const DECODING_ZONE_COPY_ZH: Record<ChartKindId, string> = {
  natal: "本命长读与五联观测",
  synastry: "案主解读 + 双人合盘对照",
  transit: "对照读本 + 行运实时块",
  ephemeris: "长读为辅，切片为主",
  secondary: "年景与本命对照读",
  tertiary: "近窗节奏与本命对照读",
  solar_return: "年度主题与本命对照读",
  lunar_return: "短窗起居情绪与对照读",
};

export function workspaceCoreZonesForChartKind(kind: ChartKindId): WorkspaceCoreZoneRow[] {
  return [
    CORE_ZONE_ORIGIN,
    {
      id: "reality",
      title: "实相观测",
      copy: REALITY_ZONE_COPY_ZH[kind],
      anchorId: "section-chart-wheel",
    },
    {
      id: "decoding",
      title: "灵识解构",
      copy: DECODING_ZONE_COPY_ZH[kind],
      anchorId: "read-section-text",
    },
  ];
}

export type MainstreamInsightLinesZh = {
  /** 接在三主星读数后的收束句 */
  structureClosing: string;
  /** 解释边界整段；含占位 {chartLabel}{topicLabel} */
  boundary: string;
  /** 建议动作整段 */
  action: string;
};

/** 主流判读三句基座；声部成稿叠在 `astro-workspace-master-voice-layers-zh`。 */
export const MAINSTREAM_INSIGHT_LINES_ZH: Record<ChartKindId, MainstreamInsightLinesZh> = {
  natal: {
    structureClosing: "以上为出生时刻口径下、可回头核对的三轴基线。",
    boundary:
      "太阳看长期要什么，月亮看日常情绪习惯，上升看对外气质。请与当前盘面「{chartLabel}」和议题「{topicLabel}」一起读，别把别的盘型的句子硬套进来。",
    action:
      "先对数据区的落宫与相位，再读正文对应段；若说法打架，先回到宫位制、相位集、容许度三项是否一致。",
  },
  synastry: {
    structureClosing: "上列为案主出生时刻下的三轴；主轮几何以表为准，双人互动看合盘 Tab。",
    boundary:
      "合盘时主解读锚在案主本命轮；相处、冲突、承诺要以「{chartLabel}」数据与议题「{topicLabel}」联读，勿用案主轮一笔勾销关系题。",
    action:
      "先看清合盘相位与互落宫，再读案主正文；若两人说法不一，拆成「事实层」与「感受层」分开谈。",
  },
  transit: {
    structureClosing: "上列为档案三主星（终身参照）；表内是当下行运天象，请分两层理解。",
    boundary:
      "行运读「此刻天象落在哪、和本命怎么碰」；日月升仍是底色。当前为「{chartLabel}」，议题「{topicLabel}」——别把几天的爽或不爽写成终身判决。",
    action:
      "先看「行运↔本命」与行运五联，再读本命长文摘录；急了先降速，大事按表里的复核窗执行。",
  },
  ephemeris: {
    structureClosing: "上列为档案三主星；本卡几何锚在选定时刻，与生日盘是两条时间线。",
    boundary:
      "时刻盘只服务选定切片，不接人格终身定性。当前「{chartLabel}」与议题「{topicLabel}」联读时，记得哪一句是「这一刻」、哪一句是「这一生」。",
    action:
      "现场决策优先对表：轴点、主相位、触发宫；长文仅作背景，别混锚点。",
  },
  secondary: {
    structureClosing: "上列为出生三轴；次限表是推进后的场，看几年慢变，不是看单日。",
    boundary:
      "次限谈几年里的心里剧情迁移，事件像回声。当前「{chartLabel}」与「{topicLabel}」联读时，年景与终身结构分开命名。",
    action:
      "按季设一个小结构目标，把日历琐事和年尺度判断拆开；每月用数据区复查相位与落宫是否仍支持原判断。",
  },
  tertiary: {
    structureClosing: "上列为出生三轴；三限表看近几周节拍，用来排程，不是用来改名分。",
    boundary:
      "三限读「这几周松紧与恢复窗」。当前「{chartLabel}」与议题「{topicLabel}」联读时，别用短窗推翻终身结论。",
    action:
      "先读三限表再找日程空档；高风险决定放到表上较松的几天，并仍对照本命。",
  },
  solar_return: {
    structureClosing: "上列为出生三轴；日返表是这一公历年的主题切片。",
    boundary:
      "日返定「今年主戏在哪」，不是每日指令。当前「{chartLabel}」与「{topicLabel}」联读时，年题与一生底色分开放。",
    action:
      "年度只抓一两件主战役，写进日历与预算；每季用数据区复查主轴是否还成立。",
  },
  lunar_return: {
    structureClosing: "上列为出生三轴；月返表是这一小段起居与情绪的窗口。",
    boundary:
      "月返管短窗调度，不管十年大运。当前「{chartLabel}」与「{topicLabel}」联读时，别把几天写成一辈子。",
    action:
      "月初粗排负载，月底一页复盘；表上紧的地方少加码，松的地方再做推进。",
  },
};

export function mainstreamInsightLinesForChartKind(
  kind: ChartKindId,
  params: { chartLabel: string; topicLabel: string },
): MainstreamInsightLinesZh {
  const row = MAINSTREAM_INSIGHT_LINES_ZH[kind];
  const topic = params.topicLabel.trim() || "—";
  return {
    structureClosing: row.structureClosing,
    boundary: row.boundary.replaceAll("{chartLabel}", params.chartLabel).replaceAll("{topicLabel}", topic),
    action: row.action,
  };
}

/** 综合结论「上升·天顶」句模板；声部成稿叠见 `astro-chart-readout-synthesis-body-voice-zh`。 */
export const SYNTHESIS_ASC_MC_LINE_TEMPLATE_ZH: Record<ChartKindId, string> = {
  natal:
    "上升在{ascSign}、天顶在{mcSign}：别人第一眼读到的你，和社会名片上的你，本来就可能不是同一种配方。",
  synastry:
    "上升在{ascSign}、天顶在{mcSign}：案主轮上，外界先读到的气质与社会名片仍可能不同步；两人怎么接招，另看合盘与双方档案。",
  transit:
    "行运盘上，上升在{ascSign}、天顶在{mcSign}：此刻外界容易先读到这一层「出场与名片」，心情未必同步，适合回头对照本命里的长期接口。",
  ephemeris:
    "这一时刻，上升在{ascSign}、天顶在{mcSign}：现场别人先抓到的你，和场合要你扮演的角色，可能仍有两套；只服务本切片决定。",
  secondary:
    "次限盘上，上升在{ascSign}、天顶在{mcSign}：这几年对外接口与公众形象，会像慢镜头一样迁动；仍以本命为底色，看的是年尺度张力。",
  tertiary:
    "三限盘上，上升在{ascSign}、天顶在{mcSign}：近几周「怎么被看见、怎么接活」更容易波动；用来排程与缓冲，不当改名条。",
  solar_return:
    "日返盘上，上升在{ascSign}、天顶在{mcSign}：这一年度外界读你的方式与事业接口，会带这一年特有的强调；仍建议对照本命。",
  lunar_return:
    "月返盘上，上升在{ascSign}、天顶在{mcSign}：这一小段日子里，出场感与对外任务更容易跟着情绪起伏；用来安顿起居与节奏。",
};

/** 综合结论「第四宫」句模板；声部成稿叠见 `astro-chart-readout-synthesis-body-voice-zh`。 */
export const SYNTHESIS_FOURTH_LINE_TEMPLATE_ZH: Record<ChartKindId, string> = {
  natal:
    "第四宫宫头在{fourthSign}：私下生活、身体节律、住得舒不舒服，这一块稳了，外面的折腾才不容易反噬成自我消耗。",
  synastry:
    "第四宫宫头在{fourthSign}：案主私下里要的踏实与住处氛围，仍是关系里的底层音量；双人怎么共享私密与边界，合盘里再谈。",
  transit:
    "第四宫宫头在{fourthSign}：这阵子家里、独处、身体节律仍是你回血的地方；外面再吵，也留一点时间给「住得舒不舒服」。",
  ephemeris:
    "第四宫宫头在{fourthSign}：这一刻与「家、休息、身体」相关的接口会被放大；只当现场提示，不当终身定调。",
  secondary:
    "第四宫宫头在{fourthSign}：几年里心底要的根与住处议题会慢慢浮面；适合逐年收拾底盘，别用琐事衡量有没有进展。",
  tertiary:
    "第四宫宫头在{fourthSign}：近几周起居与心情的底色在这里显形；累了先睡、先吃饭，再谈大事。",
  solar_return:
    "第四宫宫头在{fourthSign}：这一年「家与内在安全」的题目会参与全年剧情；大事之外，记得给生活底盘留预算。",
  lunar_return:
    "第四宫宫头在{fourthSign}：这一小段里，睡眠、家人、私密空间最吃情绪；先安顿这里，再对外冲。",
};

export function synthesisAscMcLineForChartKind(kind: ChartKindId, ascSign: string, mcSign: string): string {
  return SYNTHESIS_ASC_MC_LINE_TEMPLATE_ZH[kind].replaceAll("{ascSign}", ascSign).replaceAll("{mcSign}", mcSign);
}

export function synthesisFourthLineForChartKind(kind: ChartKindId, fourthSign: string): string {
  return SYNTHESIS_FOURTH_LINE_TEMPLATE_ZH[kind].replaceAll("{fourthSign}", fourthSign);
}
