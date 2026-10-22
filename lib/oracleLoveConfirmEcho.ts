/**
 * 感情占问 · 大师复述确认（自然口吻，多模板轮换）
 */

import type { LoveSubcategory } from '@/lib/oracleLoveSubcategoriesCatalog';

export interface LoveSubcategoryMatchResult {
  subcategory: LoveSubcategory;
  score: number;
  matchedTriggers: string[];
  confidence: 'high' | 'medium' | 'low';
  alternatives: Array<{
    subcategory: LoveSubcategory;
    score: number;
  }>;
}

function hashPick(seed: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return mod > 0 ? h % mod : 0;
}

type EchoBuilder = (userText: string, topic?: string) => string;

const NO_MATCH_BODIES: EchoBuilder[] = [
  (q) =>
    `进来吧，朋友。\n\n你不必把话整理成标准问句——把你心里那句原样交给我就好。\n\n我先接住的，是不是这个意思：\n\n「${q}」\n\n若是，我们就从这里请牌；若还差一口气，你可以慢慢重说。`,
  (q) =>
    `我听见你了。\n\n有些问题，本来就没有标准写法——但圣殿听得懂真心。\n\n你想问的，是不是这一句：\n\n「${q}」`,
  (q) =>
    `过来，孩子。\n\n你带着这句话走来，已经很勇敢了。\n\n让我确认一下——你心里真正想问的，是不是：\n\n「${q}」\n\n点头，我们再往下走。`,
  (q) =>
    `别急，我在这儿。\n\n先把呼吸找回来。你刚才那句话，我接住了。\n\n是不是这个意思：\n\n「${q}」`,
];

const WITH_MATCH_BODIES: EchoBuilder[] = [
  (q, topic) =>
    `过来，孩子，坐近一点。\n\n我听懂你挂心的是什么了——这绕不开「${topic}」。\n\n你把话说到这一步，已经不容易。我先替你复述一遍，你看看像不像：\n\n「${q}」\n\n若是，我们就从这句开始请牌。`,
  (q, topic) =>
    `我听见你了。\n\n你其实在问「${topic}」这一层的事——只是心里太满，一句说不完。\n\n我先接住你刚才那句：\n\n「${q}」\n\n像吗？像，我们就继续。`,
  (q, topic) =>
    `进来吧，朋友。\n\n关于「${topic}」，你不必再独自猜。\n\n你此刻最想问的，是不是这句：\n\n「${q}」\n\n你点个头，牌才为你开口。`,
  (q, topic) =>
    `先把心稳一稳。\n\n我听懂方向了：你在「${topic}」里打转。\n\n让我确认——你要问的是不是：\n\n「${q}」\n\n对，我们就从这里走；不对，你慢慢重说，我不催你。`,
  (q, topic) =>
    `过来，孩子。\n\n这类心事，我听过太多——你并不奇怪，也不丢人。\n\n关于「${topic}」，你心里那句，是不是：\n\n「${q}」`,
];

const LOW_CONFIDENCE_SUFFIX = [
  (match: LoveSubcategoryMatchResult) =>
    `\n\n我先听到的是「${match.subcategory.name}」这一路；如果你更想问「${match.alternatives[0]?.subcategory.name ?? '另一个方向'}」，也可以告诉我，我会按你真正想问的来。`,
  (match: LoveSubcategoryMatchResult) =>
    `\n\n我先抓到的是「${match.subcategory.name}」这层，但你的话里也带着「${match.alternatives[0]?.subcategory.name ?? '别的牵挂'}」的影子；你点一点，我们就走你更在意的那条线。`,
];

/** 自输入 · 大师复述（确认后再抽牌） */
export function buildMasterEchoQuestion(
  userText: string,
  match: LoveSubcategoryMatchResult | null,
): string {
  const q = userText.trim();
  if (!q) return '进来吧，朋友。先把心里那句话，慢慢说给我听。';

  const seed = q + (match?.subcategory.id ?? 'open');
  if (!match) {
    return NO_MATCH_BODIES[hashPick(seed, NO_MATCH_BODIES.length)](q);
  }
  const main = WITH_MATCH_BODIES[hashPick(seed, WITH_MATCH_BODIES.length)](q, match.subcategory.name);
  if (match.confidence === 'low') {
    const suffix = LOW_CONFIDENCE_SUFFIX[hashPick(seed + ':low', LOW_CONFIDENCE_SUFFIX.length)](match);
    return `${main}${suffix}`;
  }
  return main;
}

/** 点选精选占问 · 轻确认（可选） */
export function buildSurfaceEchoQuestion(question: string): string {
  const q = question.trim();
  const templates = [
    () =>
      `好。\n\n你选中的这一句，我已经接住了：\n\n「${q}」\n\n若就是此刻你心里那句，我们便从这里请牌。`,
    () =>
      `我收到了。\n\n「${q}」\n\n——若这就是你今夜要问的，你点个头，我们再往下走。`,
  ];
  return templates[hashPick(q, templates.length)]();
}

/** 确认界面 · 主按钮文案 */
export const CONFIRM_YES_LABEL = '是，就从这句开始';
/** 确认界面 · 重说按钮文案 */
export const CONFIRM_RETRY_LABEL = '还不对，我慢慢重说';
