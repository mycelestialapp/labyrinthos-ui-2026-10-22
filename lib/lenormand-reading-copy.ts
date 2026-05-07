import type { LenormandCard } from "./lenormand-cards";
import { buildLenormandFreeReadingZh } from "./lenormand-free-reading-zh";
import type { LenormandSpreadId } from "./lenormand-spread-id";

export type { LenormandSpreadId } from "./lenormand-spread-id";

/** 底座模式：统一走结构化生成（阵位+分类指引）。 */
export type LenormandReadingResolution = {
  kind: "structured-free";
  text: string;
};

/**
 * 与底座一致：不绑定特定牌组文案，统一按问题与牌阵生成解读。
 */
export function resolveLenormandReading(input: {
  spreadId: LenormandSpreadId;
  cards: LenormandCard[];
  inquiry?: string;
}): LenormandReadingResolution {
  const text = buildLenormandFreeReadingZh(input.spreadId, input.cards, input.inquiry);
  return { kind: "structured-free", text };
}
