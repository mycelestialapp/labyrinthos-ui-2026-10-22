/**
 * 主路径双人手册级合拍矩阵。
 *
 * - **盘面全集**：与本站 `reduceWithMaster` / `lifePathNumber` 一致，主路径**只会**落在
 *   `LIFE_PATH_PLATEAU_NUMBERS`（1–9、11、22、33）共 **12** 个数；不会出现 10、12、13 等「别的盘面」可组合。
 * - **无序正文键**：`小-大` 共 **C(12,2)=66** 条，存于 `PAIR_MATRIX_MANUAL_ZH`。
 * - **工作台序向（132 异数）**：`lifePathPairMatrixWorkspaceBodyZh(me, other)` 按 **我→对方** 取稿。
 *   **我 ≤ 对方**：读 `小-大` 基准手写表（`PAIR_MATRIX_MANUAL_ZH`）。
 *   **我 > 对方**：读 **`大-小` 另一套手写定稿**（`PAIR_MATRIX_MANUAL_ZH_HI_FIRST_*` 合并），与基准句式另起，**非**算法逆序稿。
 * - **同数**：不在矩阵，走 `lifePathPairTwinVoiceBodyZh`（并见 `lifePathPairTwinManualBodyZh` / `numerology-life-path-pair-catalog-zh` **144 全序对**入口）。
 */

import type { PairMatrixManualBodyZh } from "@/lib/numerology-life-path-pair-matrix-types";
import { PAIR_MATRIX_MANUAL_ZH as PAIR_MATRIX_PART_A } from "@/lib/numerology-life-path-pair-matrix-manual-zh-part-a";
import { PAIR_MATRIX_MANUAL_ZH as PAIR_MATRIX_PART_B } from "@/lib/numerology-life-path-pair-matrix-manual-zh-part-b";
import { PAIR_MATRIX_MANUAL_ZH as PAIR_MATRIX_PART_C } from "@/lib/numerology-life-path-pair-matrix-manual-zh-part-c";
import { PAIR_MATRIX_MANUAL_ZH_HI_FIRST_PART1 } from "@/lib/numerology-life-path-pair-matrix-manual-zh-hi-1of2";
import { PAIR_MATRIX_MANUAL_ZH_HI_FIRST_PART2 } from "@/lib/numerology-life-path-pair-matrix-manual-zh-hi-2of2";

export type { PairMatrixManualBodyZh } from "@/lib/numerology-life-path-pair-matrix-types";

const LP_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;

/** 与本站算法一致的主路径盘面全集（供 UI/导出枚举，勿与「任意整数」混淆） */
export const LIFE_PATH_PLATEAU_NUMBERS: readonly number[] = [...LP_ORDER];

export const PAIR_MATRIX_MANUAL_ZH: Record<string, PairMatrixManualBodyZh> = {
  ...PAIR_MATRIX_PART_A,
  ...PAIR_MATRIX_PART_B,
  ...PAIR_MATRIX_PART_C,
};

/** `大-小` 手写定稿：我盘面数 > 对方 时使用（共 66 键） */
export const PAIR_MATRIX_MANUAL_ZH_HI_FIRST: Record<string, PairMatrixManualBodyZh> = {
  ...PAIR_MATRIX_MANUAL_ZH_HI_FIRST_PART1,
  ...PAIR_MATRIX_MANUAL_ZH_HI_FIRST_PART2,
};

function pairKey(a: number, b: number): string {
  return `${Math.min(a, b)}-${Math.max(a, b)}`;
}

/** 无序数对手册体（键为小-大）；同数返回 undefined。 */
export function lifePathPairMatrixBodyZh(lpA: number, lpB: number): PairMatrixManualBodyZh | undefined {
  if (lpA === lpB) return undefined;
  return PAIR_MATRIX_MANUAL_ZH[pairKey(lpA, lpB)];
}

/**
 * 工作台「我 → 对方」序向的手册体。同数 undefined。
 * 我 ≤ 对方 → `小-大` 基准定稿；我 > 对方 → `大-小` 手写定稿。
 */
export function lifePathPairMatrixWorkspaceBodyZh(lpMe: number, lpOther: number): PairMatrixManualBodyZh | undefined {
  if (lpMe === lpOther) return undefined;
  if (lpMe < lpOther) return PAIR_MATRIX_MANUAL_ZH[`${lpMe}-${lpOther}`];
  return PAIR_MATRIX_MANUAL_ZH_HI_FIRST[`${lpMe}-${lpOther}`];
}

/** 全部异数有序对键 `我-对方`（132 条），供枚举/测试 */
export function lifePathPairOrderedWorkspaceKeysZh(): string[] {
  const out: string[] = [];
  for (const me of LP_ORDER) {
    for (const ot of LP_ORDER) {
      if (me !== ot) out.push(`${me}-${ot}`);
    }
  }
  return out;
}

/** 列出全部矩阵键（程式备查用） */
export function lifePathPairMatrixKeysZh(): string[] {
  const out: string[] = [];
  for (let i = 0; i < LP_ORDER.length; i++) {
    for (let j = i + 1; j < LP_ORDER.length; j++) {
      out.push(`${LP_ORDER[i]}-${LP_ORDER[j]}`);
    }
  }
  return out;
}
