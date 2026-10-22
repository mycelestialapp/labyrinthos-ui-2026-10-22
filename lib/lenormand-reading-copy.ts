import type { LenormandCard } from "./lenormand-cards";
import { buildLenormandMasterReadingZh } from "./lenormand-master-reading-zh";
import type { LenormandSpreadId } from "./lenormand-spread-id";

export type { LenormandSpreadId } from "./lenormand-spread-id";

/** 单面连读：相邻成句，无正逆位。 */
export type LenormandReadingResolution = {
  kind: "master-line";
  text: string;
};

/**
 * 正统 Petit Lenormand 没有正逆位。解读只按牌序、邻接与问题大类生成。
 */
export function resolveLenormandReading(input: {
  spreadId: LenormandSpreadId;
  cards: LenormandCard[];
  inquiry?: string;
}): LenormandReadingResolution {
  const text = buildLenormandMasterReadingZh(input.spreadId, input.cards, input.inquiry);
  return { kind: "master-line", text };
}
