/**
 * 雷诺曼免费层解读：与旧工程 `Dmy-projects/src/lib/lenormandMasterReading.ts` 中
 * `buildFreeReadingExplanation` + `LENORMAND_SPREAD_LAYOUTS` 同源（不调 AI）。
 * 单牌 mirror/reality 等大师句仍以空库为准；贴题感主要来自阵位角色 + 问题分类指引。
 */
import type { LenormandCard } from "./lenormand-cards";
import type { LenormandSpreadId } from "./lenormand-spread-id";
import { buildReadingBlocks } from "./lenormand-reading-base-zh";

export type LenormandSpreadKind = "TRIAD" | "CROSS" | "SQUARE" | "GRAND_TABLEAU";

export interface LenormandSpreadPosition {
  label: string;
  logic: string;
}

export const LENORMAND_SPREAD_LAYOUTS: Record<LenormandSpreadKind, LenormandSpreadPosition[]> = {
  TRIAD: [
    { label: "根源冲动", logic: "挖掘没说出口的欲望或隐秘恐惧" },
    { label: "能量瓶颈", logic: "剖析当前最核心的心理或环境矛盾" },
    { label: "走向/代价", logic: "直指如果不干预，惯性将带你去往何处" },
  ],
  CROSS: [
    { label: "愿景", logic: "脑海中幻想的最优版本" },
    { label: "现状推力", logic: "正在把你推向当前局面的外在或内在驱动力" },
    { label: "核心阻碍", logic: "当前最胶着、最难解的缠结点" },
    { label: "资源转机", logic: "可利用的外部支持或意外切入点" },
    { label: "根基", logic: "童年印记或长期形成的人格底色" },
  ],
  SQUARE: [
    { label: "外部环境", logic: "此刻你身处的客观情境与局势" },
    { label: "显意识", logic: "你自认为正在思考、关注的议题" },
    { label: "理性策略", logic: "你目前采取的计划、策略与应对方式" },
    { label: "情感状态", logic: "此刻真实的情绪波动与需求" },
    { label: "核心课题", logic: "这一局真正要面对的主题与功课" },
    { label: "行动模式", logic: "你惯性做出的反应与行动路径" },
    { label: "过去印记", logic: "过去事件或早期经验留下的影子" },
    { label: "身体/日常", logic: "身体状态与日常习惯中反映出的信息" },
    { label: "未来趋势", logic: "在不刻意干预下，能量自然延伸的方向" },
  ],
  GRAND_TABLEAU: [
    { label: "问卜者", logic: "自我、当事人核心状态" },
    { label: "家", logic: "住所、家庭空间、安全感" },
    { label: "想法", logic: "计划、念头、思维" },
    { label: "家庭", logic: "家族、根源、血缘" },
    { label: "子女/创意", logic: "新生命、创造、纯真" },
    { label: "健康", logic: "身体、日常、活力" },
    { label: "伴侣", logic: "合作、一对一关系" },
    { label: "结束", logic: "转化、死亡与重生" },
    { label: "灵性", logic: "信仰、更高意义" },
    { label: "事业", logic: "工作、社会角色" },
    { label: "希望", logic: "愿望、期待" },
    { label: "潜意识", logic: "隐藏、梦、未觉察" },
    { label: "沟通", logic: "讯息、表达、传递" },
    { label: "金钱", logic: "财富、资源、流动" },
    { label: "焦虑", logic: "阻碍、担忧" },
    { label: "喜悦", logic: "快乐、享受" },
    { label: "权威", logic: "长辈、制度、规则" },
    { label: "阻碍", logic: "限制、瓶颈" },
    { label: "远行", logic: "迁移、变动、距离" },
    { label: "外在环境", logic: "他人、外界、局势" },
    { label: "支持", logic: "贵人、资源、助力" },
    { label: "对立", logic: "挑战、敌人、张力" },
    { label: "爱情", logic: "浪漫、激情、吸引" },
    { label: "牺牲", logic: "付出、放下" },
    { label: "遗产/契约", logic: "传承、承诺、循环" },
    { label: "疾病/耗损", logic: "耗损、担忧、脆弱" },
    { label: "亲密", logic: "欲望、隐私、深度" },
    { label: "死亡", logic: "终结、转型、放手" },
    { label: "扩张", logic: "成长、机会、拓展" },
    { label: "关系", logic: "婚姻、承诺、长期" },
    { label: "教学", logic: "学习、智慧、传承" },
    { label: "放下", logic: "释放、结束" },
    { label: "秘密", logic: "未知、业力、隐藏" },
    { label: "成功", logic: "收获、认可" },
    { label: "变动", logic: "意外、转折" },
    { label: "完成", logic: "业力、总结、终局" },
  ],
};

export function spreadIdToKind(spreadId: LenormandSpreadId): LenormandSpreadKind {
  switch (spreadId) {
    case "line3":
      return "TRIAD";
    case "line5":
      return "CROSS";
    case "box9":
      return "SQUARE";
    case "grand":
      return "GRAND_TABLEAU";
    default:
      return "TRIAD";
  }
}

/** 与旧版 `buildFreeReadingExplanation` 一致；末尾不设「订阅解锁」营销句。 */
export function buildLenormandFreeReadingZh(
  spreadId: LenormandSpreadId,
  cards: LenormandCard[],
  inquiry?: string,
): string {
  const spreadType = spreadIdToKind(spreadId);
  const positions = LENORMAND_SPREAD_LAYOUTS[spreadType];

  if (!positions?.length || cards.length === 0) {
    const names = cards.map((c) => c.nameZh).join("、");
    const meanings = cards.map((c) => c.shortMeaning).filter(Boolean);
    if (meanings.length) return `本局抽到 ${names}。${meanings.join("；")}。`;
    return `本局抽到 ${names}。`;
  }

  const maxLen = Math.min(cards.length, positions.length);
  const positionLines: string[] = [];
  for (let i = 0; i < maxLen; i++) {
    const pos = positions[i];
    const card = cards[i];
    if (!pos || !card) continue;
    positionLines.push(`- 【${pos.label}】${card.nameZh}：${card.shortMeaning}`);
  }

  const blocks = buildReadingBlocks({ spreadId, cards, inquiry });
  const synthesis = buildSynthesisLine(spreadType, cards);
  const boundary = compactGuidance(blocks.boundary.replace(/^边界：/, ""));

  const head: string[] = [
    `【开篇】${blocks.opening}`,
    `【牌阵职责】${blocks.spreadRole}`,
  ];
  if (blocks.motherTopicLine) {
    head.push(`【母题对焦】${blocks.motherTopicLine}`);
  }
  return [
    ...head,
    "【逐位解读】",
    ...positionLines,
    "【单牌正反面（按问题大类）】",
    ...blocks.cardPolarityLines,
    `【合局】${synthesis}`,
    `【正反面】${blocks.polarity}`,
    `【贴题焦点】${blocks.focus}`,
    `【边界】${boundary}`,
  ].join("\n");
}

function buildSynthesisLine(spreadType: LenormandSpreadKind, cards: LenormandCard[]): string {
  if (cards.length === 0) return "当前信息不足，先补齐牌面再看走向。";
  const names = cards.map((c) => c.nameZh);
  if (spreadType === "TRIAD" && names.length >= 3) {
    return `从「${names[0]}」到「${names[1]}」再到「${names[2]}」，主线是“起因—卡点—走向”。`;
  }
  if (spreadType === "CROSS" && names.length >= 5) {
    return `五位里，核心在第 3 位（${names[2]}），第 1/2 位给动机，第 4/5 位给资源与根基。`;
  }
  if (spreadType === "SQUARE" && names.length >= 9) {
    return `九宫先看中心位（${names[4]}），再看上下左右，它决定你当下这局的主轴。`;
  }
  return `这组牌先给方向，不给绝对答案；你的选择会改变后续结果。`;
}

function compactGuidance(raw: string): string {
  const clean = (raw || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  // 仅保留前两句，避免把长模板整段塞进免费层。
  const pieces = clean.split(/(?<=[。！？])/).map((s) => s.trim()).filter(Boolean);
  const joined = pieces.slice(0, 2).join("");
  if (joined.length <= 120) return joined;
  return `${joined.slice(0, 120)}...`;
}
