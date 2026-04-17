/**
 * **全量 12×12 序对目录**：工作台「我 × 对方」每一种主路径组合（含同数对角），共 **144** 条。
 * - 异数：线上读数走当场拼读 `lifePathPairMatrixVoiceBodyZh`；手写矩阵仍留在库里给程式备查；全量枚举 `allPairMatrixDualDraftsZh`。
 * - 同数：见 `lifePathPairTwinManualBodyZh`（`numerology-life-path-pair-compat-zh`）。
 *
 * 主路径在本站算法下**只会**落在 `LIFE_PATH_PLATEAU_NUMBERS`；不存在其它整数的盘面组合。
 */

import type { PairMatrixManualBodyZh } from "@/lib/numerology-life-path-pair-matrix-types";
import { lifePathPairTwinManualBodyZh } from "@/lib/numerology-life-path-pair-compat-zh";
import { LIFE_PATH_PLATEAU_NUMBERS } from "@/lib/numerology-life-path-pair-matrix-manual-zh";
import { lifePathPairMatrixVoiceBodyZh } from "@/lib/numerology-life-path-pair-matrix-voice-body-zh";

const PLATEAU_SET = new Set(LIFE_PATH_PLATEAU_NUMBERS);

function assertPlateau(n: number, label: string): void {
  if (!PLATEAU_SET.has(n)) {
    throw new Error(`${label}=${n} 非本站主路径盘面（仅 ${LIFE_PATH_PLATEAU_NUMBERS.join("、")}）`);
  }
}

/** 全部 `[我, 对方]` 序对，长度 144（含 12 条同数对角） */
export const ALL_LIFE_PATH_ORDERED_PAIRS_144: readonly (readonly [number, number])[] = (() => {
  const out: [number, number][] = [];
  for (const me of LIFE_PATH_PLATEAU_NUMBERS) {
    for (const other of LIFE_PATH_PLATEAU_NUMBERS) {
      out.push([me, other]);
    }
  }
  return out;
})();

/**
 * 取该序对的手册级合拍正文：**144 全覆盖**。
 * `me === other` 时返回同数 twin 体；否则返回矩阵工作台序向体。
 */
export function lifePathPairCatalogBodyZh(me: number, other: number): PairMatrixManualBodyZh {
  assertPlateau(me, "me");
  assertPlateau(other, "other");
  if (me === other) return lifePathPairTwinManualBodyZh(me);
  return lifePathPairMatrixVoiceBodyZh(me, other);
}
