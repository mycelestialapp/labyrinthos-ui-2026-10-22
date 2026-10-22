import type { LenormandCard } from "./lenormand-cards";
import type { QuestionCategory } from "./question-category-keywords";
import type { LenormandSpreadId } from "./lenormand-spread-id";
import type { EvidenceLevel, ReadingIntent } from "./lenormand-reading-types";

type CardSemantic = {
  basePositive: string;
  baseNegative: string;
};

type CategoryLens = {
  noun: string;
  positiveVerb: string;
  negativeVerb: string;
};

const CARD_SEMANTICS: Record<number, CardSemantic> = {
  1: { basePositive: "新消息推动局面前进", baseNegative: "节奏过快导致判断仓促" },
  2: { basePositive: "出现短期顺风与机会窗口", baseNegative: "过度侥幸忽略长期成本" },
  3: { basePositive: "出现拓展与外部连接机会", baseNegative: "方向分散导致重心飘移" },
  4: { basePositive: "根基与安全感得到加固", baseNegative: "过度保守让局面停滞" },
  5: { basePositive: "呈现稳步成长与修复趋势", baseNegative: "进展缓慢引发焦虑放大" },
  6: { basePositive: "模糊区开始被看见与澄清", baseNegative: "信息混乱造成误读循环" },
  7: { basePositive: "策略与洞察帮助避开暗坑", baseNegative: "边界模糊引发猜疑与消耗" },
  8: { basePositive: "旧模式结束带来重启机会", baseNegative: "突然切断造成失衡与恐慌" },
  9: { basePositive: "善意与支持带来回暖", baseNegative: "表面和气掩盖真实问题" },
  10: { basePositive: "果断切割让问题快速收口", baseNegative: "过猛决断引发连锁代价" },
  11: { basePositive: "持续打磨形成执行韧性", baseNegative: "重复冲突造成内耗积累" },
  12: { basePositive: "沟通活跃让信息开始流动", baseNegative: "噪音过载引发焦虑与误判" },
  13: { basePositive: "以轻量方式开启新周期", baseNegative: "经验不足导致判断偏幼态" },
  14: { basePositive: "谨慎审视提升风险识别", baseNegative: "过度防备造成关系不信任" },
  15: { basePositive: "资源与掌控力明显增强", baseNegative: "权力失衡带来压迫与反弹" },
  16: { basePositive: "方向感与信心逐步回升", baseNegative: "理想化预期脱离现实节奏" },
  17: { basePositive: "结构调整带来升级机会", baseNegative: "频繁变动造成不稳定感" },
  18: { basePositive: "可靠支持与忠诚度提升", baseNegative: "依赖加重形成关系负担" },
  19: { basePositive: "边界清晰有利于专业推进", baseNegative: "隔阂加深导致连接断层" },
  20: { basePositive: "公开互动带来资源连接", baseNegative: "外部评价干扰核心判断" },
  21: { basePositive: "阻力暴露后可精准拆解", baseNegative: "阻塞持续拖慢整体进度" },
  22: { basePositive: "关键分岔带来新路线", baseNegative: "摇摆不定导致机会流失" },
  23: { basePositive: "隐患被及时发现并止损", baseNegative: "持续耗损侵蚀核心收益" },
  24: { basePositive: "情感投入提升连接温度", baseNegative: "情绪化反应压过理性判断" },
  25: { basePositive: "承诺与规则形成稳定预期", baseNegative: "形式承诺无法落地兑现" },
  26: { basePositive: "隐藏信息逐步浮出可用", baseNegative: "信息封闭造成长期误判" },
  27: { basePositive: "文书与证据链条更清晰", baseNegative: "口径反复导致信息失真" },
  28: { basePositive: "主动位发力提升推进力", baseNegative: "强控倾向引发关系对抗" },
  29: { basePositive: "感受力提升促成细腻判断", baseNegative: "情绪敏感放大不安全感" },
  30: { basePositive: "成熟节奏带来稳定修复", baseNegative: "过度退让掩盖真实冲突" },
  31: { basePositive: "能见度提升、结果更明朗", baseNegative: "自信过载忽略细节风险" },
  32: { basePositive: "直觉增强帮助识别暗线", baseNegative: "情绪周期波动影响一致性" },
  33: { basePositive: "关键突破点被准确命中", baseNegative: "执着单点忽略系统问题" },
  34: { basePositive: "资源流动性与收益机会提升", baseNegative: "逐利冲动放大资金风险" },
  35: { basePositive: "稳定锚点帮助长期布局", baseNegative: "僵化固守错过调整窗口" },
  36: { basePositive: "责任意识促成深层成长", baseNegative: "压力负担过重抬高痛感" },
};

const CATEGORY_LENS: Record<QuestionCategory, CategoryLens> = {
  感情婚姻: { noun: "关系互动", positiveVerb: "回暖与对齐", negativeVerb: "拉扯与误读" },
  事业工作: { noun: "职场推进", positiveVerb: "提效与落地", negativeVerb: "内耗与卡顿" },
  财运投资: { noun: "资金节奏", positiveVerb: "增益与优化", negativeVerb: "波动与亏损风险" },
  学业考试: { noun: "学习状态", positiveVerb: "提分与稳定", negativeVerb: "分心与失准" },
  宠物: { noun: "照护状态", positiveVerb: "安稳与配合", negativeVerb: "应激与失衡" },
  身体健康: { noun: "身心节律", positiveVerb: "修复与稳态", negativeVerb: "紧绷与耗损" },
  人际关系: { noun: "人际互动", positiveVerb: "联结与修复", negativeVerb: "口舌与隔阂" },
  出行迁居: { noun: "行程与环境", positiveVerb: "顺畅与安定", negativeVerb: "变动与延误" },
  官司法律: { noun: "法律沟通", positiveVerb: "清晰与有利推进", negativeVerb: "反复与不利升级" },
  生育子女: { noun: "家庭养育", positiveVerb: "协同与稳步推进", negativeVerb: "焦虑与分歧放大" },
  失物寻找: { noun: "线索排查", positiveVerb: "聚焦与找回概率提升", negativeVerb: "方向混乱与延误" },
  选择决策: { noun: "决策节奏", positiveVerb: "收敛与定案", negativeVerb: "犹豫与错失" },
  占梦境: { noun: "梦境信息", positiveVerb: "澄清与对照白天", negativeVerb: "过度当真与惊吓" },
  代人问卜: { noun: "代问信息", positiveVerb: "补充与澄清", negativeVerb: "失真与偏差" },
  心理疏导: { noun: "情绪节律", positiveVerb: "被看见与稳住", negativeVerb: "自我攻击与过载" },
  人生建议: { noun: "人生阶段", positiveVerb: "对齐与取舍", negativeVerb: "漂与拖延" },
  灵性成长: { noun: "内在觉察", positiveVerb: "整合与提升", negativeVerb: "漂浮与自我消耗" },
  占风水: { noun: "空间能量", positiveVerb: "调顺与稳定", negativeVerb: "干扰与失衡" },
  其他: { noun: "当前议题", positiveVerb: "推进与明朗", negativeVerb: "混乱与卡滞" },
};

export type CardCategoryPolarity = {
  positive: string;
  negative: string;
};

type SpreadLens = {
  positive: string;
  negative: string;
};

const SPREAD_LENS: Record<LenormandSpreadId, SpreadLens> = {
  line3: {
    positive: "在三线里更容易形成清晰主线",
    negative: "在三线里更容易把单点情绪放大成结论",
  },
  line5: {
    positive: "在五线里更容易看见矛盾与资源的平衡关系",
    negative: "在五线里更容易出现层层牵扯导致判断迟滞",
  },
  box9: {
    positive: "在九宫里更容易看出中心主轴与周边呼应",
    negative: "在九宫里更容易因信息过载出现主次混乱",
  },
  grand: {
    positive: "在大展里更适合做全局长期观察",
    negative: "在大展里若急于下结论会明显失真",
  },
};

const INTENT_LENS: Record<ReadingIntent, { positive: string; negative: string }> = {
  judgement: {
    positive: "适合用来判断结构倾向",
    negative: "不适合直接下事实判决",
  },
  diagnosis: {
    positive: "适合定位当前卡点机制",
    negative: "若只盯情绪会忽略真正成因",
  },
  timing: {
    positive: "适合观察节奏与阶段变化",
    negative: "不支持精确到具体日期的断言",
  },
  state: {
    positive: "适合呈现当前状态与趋势",
    negative: "若过度解读会把状态误当结果",
  },
};

export function getCardCategoryPolarity(
  card: LenormandCard,
  category: QuestionCategory,
): CardCategoryPolarity {
  const semantic = CARD_SEMANTICS[card.id] ?? {
    basePositive: "有可推进的变化信号",
    baseNegative: "有需防范的风险信号",
  };
  const lens = CATEGORY_LENS[category] ?? CATEGORY_LENS.其他;
  return {
    positive: `${semantic.basePositive}，在${lens.noun}层面更易表现为${lens.positiveVerb}。`,
    negative: `${semantic.baseNegative}，在${lens.noun}层面更易表现为${lens.negativeVerb}。`,
  };
}

export function getCardContextPolarity(input: {
  card: LenormandCard;
  category: QuestionCategory;
  spreadId: LenormandSpreadId;
  positionLabel: string;
  intent: ReadingIntent;
  evidenceLevel: EvidenceLevel;
  /** 与全库母题一致的对焦句，各阵位、各大类共用同一口径 */
  motherHint?: string;
}): CardCategoryPolarity {
  const base = getCardCategoryPolarity(input.card, input.category);
  const spreadLens = SPREAD_LENS[input.spreadId];
  const intentLens = INTENT_LENS[input.intent];
  const evidenceLine =
    input.evidenceLevel === "low"
      ? "当前证据偏弱，解读应更保守。"
      : input.evidenceLevel === "medium"
        ? "当前证据中等，宜结合行为一致性核对。"
        : "当前证据较强，可提高结构判断权重。";
  const motherLine = input.motherHint ? `${input.motherHint}` : "";

  return {
    positive: `${base.positive}${spreadLens.positive}。位于「${input.positionLabel}」时，${intentLens.positive}。${motherLine}${evidenceLine}`,
    negative: `${base.negative}${spreadLens.negative}。位于「${input.positionLabel}」时，${intentLens.negative}。${motherLine}${evidenceLine}`,
  };
}

