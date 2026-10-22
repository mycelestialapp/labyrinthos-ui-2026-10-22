import type { LenormandCard } from "./lenormand-cards";
import type { LenormandSpreadId } from "./lenormand-spread-id";
import { detectQuestionCategory, getCategoryGuidance } from "./question-classification";
import type { QuestionCategory } from "./question-category-keywords";
import { getCardContextPolarity } from "./lenormand-semantic-matrix-zh";
import { matchMotherTopicDetailed } from "./lenormand-mother-topics-13x500-zh";
import type { ReadingIntent, EvidenceLevel } from "./lenormand-reading-types";
import { normalizeQuestionTextZh } from "./question-text-normalize-zh";

export type QuestionProfile = {
  categoryKey: QuestionCategory;
  category: string;
  intent: ReadingIntent;
  evidenceLevel: EvidenceLevel;
  guidance: string;
};

export type ReadingBlocks = {
  opening: string;
  spreadRole: string;
  cardLines: string[];
  cardPolarityLines: string[];
  polarity: string;
  focus: string;
  boundary: string;
  /** 命中母题时供开篇/免费层展示；与 focus 内技术字段同源 */
  motherTopicLine: string | null;
};

type SpreadMeta = {
  name: string;
  role: string;
};

const SPREAD_META: Record<LenormandSpreadId, SpreadMeta> = {
  line3: {
    name: "三线",
    role: "看“起因—当前卡点—近期走向”三段关系。",
  },
  line5: {
    name: "五线",
    role: "从左读到右，第 3 张是心脏；1-2 铺过来，4-5 落地收局。",
  },
  box9: {
    name: "九宫",
    role: "先看中心，再看上下左右十字，四角只作环境拉扯。",
  },
  grand: {
    name: "大展",
    role: "看全局能量分布与长期主线，不做单点断言。",
  },
};

const NEGATIVE_WORDS = ["困惑", "模糊", "阻碍", "耗损", "焦虑", "结束", "曲折", "挑战", "责任"];
const POSITIVE_WORDS = ["幸运", "成功", "希望", "收获", "礼物", "关键", "稳定", "财富", "忠诚"];

function detectIntent(question: string): ReadingIntent {
  const q = normalizeQuestionTextZh(question);
  if (!q) return "state";
  if (/(会不会|能不能|有没有|是否|是不是|行不行|可不可以|该不该|要不要|对吗|靠谱吗|能成吗|会好吗|行吗|还爱|爱我吗|爱不爱|吗[？?]?$)/.test(q)) {
    return "judgement";
  }
  if (/(为什么|怎么回事|原因|咋回事|何以|为何|什么原因)/.test(q)) return "diagnosis";
  if (/(多久|何时|什么时候|什么时间|几天|几个月|几年|还要多久|哪天|何日)/.test(q)) return "timing";
  return "state";
}

function detectEvidenceLevel(question: string): EvidenceLevel {
  const q = normalizeQuestionTextZh(question);
  if (!q) return "low";
  if (/(我感觉|我怀疑|好像|似乎|可能|猜|听说|不太确定|直觉|也许|大概)/.test(q)) return "low";
  if (/(聊天记录|截图|证据|已经|明确|当场|亲眼|合同|录音|转账|验血|化验单|判决书|书面)/.test(q)) {
    return "high";
  }
  return "medium";
}

function polarityOf(card: LenormandCard): "positive" | "negative" | "neutral" {
  const m = card.shortMeaning || "";
  if (NEGATIVE_WORDS.some((w) => m.includes(w))) return "negative";
  if (POSITIVE_WORDS.some((w) => m.includes(w))) return "positive";
  return "neutral";
}

function buildPolarityLine(cards: LenormandCard[]): string {
  let p = 0;
  let n = 0;
  let u = 0;
  for (const c of cards) {
    const po = polarityOf(c);
    if (po === "positive") p += 1;
    else if (po === "negative") n += 1;
    else u += 1;
  }
  if (p > n) return "正向信号略多：局面有可推进空间，但仍需看中间卡点是否被放大。";
  if (n > p) return "反向信号略多：当前阻力与不确定性更突出，结论应保守看。";
  return "正反信号接近：当前更像“信息混合期”，不宜用单点情绪下定论。";
}

function buildFocusLine(intent: ReadingIntent, evidenceLevel: EvidenceLevel): string {
  if (intent === "judgement" && evidenceLevel === "low") {
    return "这类问法先看“结构是否稳定”，不直接把情绪当事实结论。";
  }
  if (intent === "judgement" && evidenceLevel !== "low") {
    return "这类问法应优先核对“行为一致性”，再看牌面给出的结构方向。";
  }
  if (intent === "diagnosis") return "这类问法重点看“卡点机制”，不是追一个单句答案。";
  if (intent === "timing") return "这类问法重点看节奏变化，不做精确日期断言。";
  return "这类问法重点看状态主轴与变化方向。";
}

export function buildQuestionProfile(question: string): QuestionProfile {
  const { label, category } = detectQuestionCategory(question || "");
  return {
    categoryKey: category,
    category: label,
    intent: detectIntent(question),
    evidenceLevel: detectEvidenceLevel(question),
    guidance: getCategoryGuidance(question || "", category),
  };
}

export function buildReadingBlocks(input: {
  spreadId: LenormandSpreadId;
  cards: LenormandCard[];
  inquiry?: string;
}): ReadingBlocks {
  const q = (input.inquiry || "").trim();
  const profile = buildQuestionProfile(q);
  const spread = SPREAD_META[input.spreadId];
  const topicMatch = matchMotherTopicDetailed(q, profile.categoryKey);
  const topic = topicMatch?.topic ?? null;
  const motherHint = topic ? `母题对焦：${topic.primary}·${topic.angle}。` : undefined;
  const motherTopicLine = topic ? `「${topic.primary}」·${topic.angle}：${topic.text}` : null;
  const cardLines = input.cards.map((c) => `- ${c.nameZh}：${c.shortMeaning}`);
  const cardPolarityLines = input.cards.map((c, idx) => {
    const positionLabel = `${spread.name}第${idx + 1}位`;
    const pn = getCardContextPolarity({
      card: c,
      category: profile.categoryKey,
      spreadId: input.spreadId,
      positionLabel,
      intent: profile.intent,
      evidenceLevel: profile.evidenceLevel,
      motherHint,
    });
    return `- ${c.nameZh}\n  正：${pn.positive}\n  反：${pn.negative}`;
  });

  return {
    opening: q ? `你问的是「${q}」。先按牌面结构给出解读。` : "你暂未填写具体问题，先按牌面结构给出通用解读。",
    spreadRole: `${spread.name}职责：${spread.role}`,
    cardLines,
    cardPolarityLines,
    polarity: buildPolarityLine(input.cards),
    focus: `问题画像：${profile.category} / ${profile.intent} / 证据${profile.evidenceLevel}${topic ? ` / 母题${topic.id}` : ""}${topicMatch ? ` / 命中${topicMatch.confidence}` : ""}。${buildFocusLine(profile.intent, profile.evidenceLevel)}`,
    boundary: `边界：${profile.guidance}`,
    motherTopicLine,
  };
}

