import type { OracleCardDisplayEntry } from '@/lib/oracleCardDisplay';
import type { LoveSubcategoryMatchResult } from '@/lib/oracleLoveSubcategoryMatch';

const POSITIVE_HINTS = ['希望', '复合', '结婚', '正缘', '定下来', '回头', '未来'];
const RISK_HINTS = ['出轨', '暴力', '冷暴力', '控制', '第三者', '分手', '离婚', '伤害'];

function includesAny(text: string, words: readonly string[]): boolean {
  return words.some(w => text.includes(w));
}

function resolveTrend(question: string, match: LoveSubcategoryMatchResult | null): string {
  const base = `${question} ${match?.subcategory.name ?? ''}`;
  if (includesAny(base, RISK_HINTS)) {
    return '这段关系的气口偏紧，核心不是你不够好，而是边界和真实感正在被侵蚀。';
  }
  if (includesAny(base, POSITIVE_HINTS)) {
    return '这段关系并非无路，气口仍在，只是要先把你真正想要的关系形状说清楚。';
  }
  return '这段关系还在可调整区间，关键不是追问结果，而是先校正你们相处的方式。';
}

function resolveCoreMirror(question: string): string {
  return `你带着「${question}」来，不只是想要一个是非答案，你真正想确认的是：这份爱还值不值得你继续交付真心。`;
}

function resolveAction(match: LoveSubcategoryMatchResult | null): string {
  const topic = match?.subcategory.name ?? '这段关系';
  return `今晚到明晚之间，给「${topic}」做一次24小时观察：先不争输赢，只记录三件事——对方主动靠近你的时刻、让你心口发紧的瞬间、以及你自己最想逃开的对话点。记录完再决定下一步，你会比现在清楚。`;
}

function resolveBoundaryTip(match: LoveSubcategoryMatchResult | null): string {
  const topic = match?.subcategory.name ?? '这件事';
  if (match?.confidence === 'low' && match.alternatives[0]) {
    return `你问的是「${topic}」，但你心里还挂着「${match.alternatives[0].subcategory.name}」。两条线别混在一起，先问主问题，再问次问题，牌意才不会打架。`;
  }
  return `先把「${topic}」问成一句可落地的话：你要的是结果、真相，还是一条能执行的下一步。问清楚，牌就会说得更准。`;
}

export interface OracleLoveMasterReading {
  message: string;
  action: string;
}

export function buildOracleLoveMasterReading(params: {
  question: string;
  match: LoveSubcategoryMatchResult | null;
  card: OracleCardDisplayEntry;
}): OracleLoveMasterReading {
  const { question, match, card } = params;
  const trend = resolveTrend(question, match);
  const mirror = resolveCoreMirror(question);
  const boundary = resolveBoundaryTip(match);
  const action = resolveAction(match);

  return {
    message: `${mirror}\n\n${trend}\n\n这张「${card.nameZh}」落下来，不是要你立刻做大决定，而是提醒你：先把关系里的真实温度看清，再决定留、调，还是转身。`,
    action: `${action}\n\n补一句给你：${boundary}`,
  };
}

