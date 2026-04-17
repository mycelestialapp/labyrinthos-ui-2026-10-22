/**
 * 枚举**全部**异数合拍双稿（66 无序数对 × 各 2 向），供导出、对稿、和库里备查稿核对。
 * 手写备查稿仍在 `numerology-life-path-pair-matrix-manual-zh` 与各 part / hi 文件；本模块只聚合，不复制句库。
 */

import type { PairMatrixManualBodyZh } from "@/lib/numerology-life-path-pair-matrix-types";
import {
  PAIR_MATRIX_MANUAL_ZH,
  PAIR_MATRIX_MANUAL_ZH_HI_FIRST,
  lifePathPairMatrixKeysZh,
} from "@/lib/numerology-life-path-pair-matrix-manual-zh";

export type PairMatrixDualDraftZh = {
  readonly lo: number;
  readonly hi: number;
  /** 无序键 `小-大` */
  readonly keyLoHi: string;
  /** 我 = lo、对方 = hi（小→大定稿） */
  readonly bodyWhenMeIsLo: PairMatrixManualBodyZh;
  /** 我 = hi、对方 = lo（大→小定稿） */
  readonly bodyWhenMeIsHi: PairMatrixManualBodyZh;
};

/** 66 条无序数对，每条含「小为我」「大为我」两套完整手写正文 */
export function allPairMatrixDualDraftsZh(): readonly PairMatrixDualDraftZh[] {
  return lifePathPairMatrixKeysZh().map((k) => {
    const [lo, hi] = k.split("-").map(Number) as [number, number];
    const hiLoKey = `${hi}-${lo}`;
    return {
      lo,
      hi,
      keyLoHi: k,
      bodyWhenMeIsLo: PAIR_MATRIX_MANUAL_ZH[k]!,
      bodyWhenMeIsHi: PAIR_MATRIX_MANUAL_ZH_HI_FIRST[hiLoKey]!,
    };
  });
}

/** 将一条合拍体排成 Markdown 块（无外层标题） */
export function formatPairMatrixBodyMarkdownZh(body: PairMatrixManualBodyZh, heading?: string): string {
  const h = heading ? `### ${heading}\n\n` : "";
  const [a0, a1] = body.afterLead;
  const bl = body.bullets.map((b) => `- ${b}`).join("\n");
  return `${h}${body.lead}\n\n${a0}\n\n${a1}\n\n${bl}\n`;
}
