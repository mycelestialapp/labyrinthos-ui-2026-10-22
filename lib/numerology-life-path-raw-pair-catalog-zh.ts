/**
 * **任意 1–99 整数**双人读数：先 `reduceWithMaster` 化约到本站主路径盘面（仅 1–9、11、22、33），
 * 再复用既有 **手写定稿**（144 工作台序对 + twin），**不另造 99² 篇新句**。
 *
 * 若需「字面 99×99 各一篇不同长文」，与当前毕达哥拉斯主路径定义冲突，需另立项。
 */

import type { PairMatrixManualBodyZh } from "@/lib/numerology-life-path-pair-matrix-types";
import { reduceWithMaster } from "@/lib/numerology-pythagorean";
import { lifePathPairCatalogBodyZh } from "@/lib/numerology-life-path-pair-catalog-zh";

/** 与合拍「任意原数」输入上界一致：1…99 */
export const RAW_INTEGER_PAIR_CATALOG_MAX = 99;

/** 枚举用：1 到 99 全部整数（长度 99） */
export const ALL_RAW_INTEGERS_1_TO_99: readonly number[] = Array.from({ length: RAW_INTEGER_PAIR_CATALOG_MAX }, (_, i) => i + 1);

function assertRawInt(n: number, label: string): void {
  if (!Number.isInteger(n) || n < 1 || n > RAW_INTEGER_PAIR_CATALOG_MAX) {
    throw new Error(`${label} 须为 1–${RAW_INTEGER_PAIR_CATALOG_MAX} 的整数，收到：${n}`);
  }
}

/** 任意正整数化约后的主路径盘面（1–9 / 11 / 22 / 33） */
export function rawIntegerToLifePathPlateau(n: number): number {
  assertRawInt(n, "n");
  return reduceWithMaster(n);
}

export type RawPairCatalogResolutionZh = {
  readonly meRaw: number;
  readonly otherRaw: number;
  readonly mePlateau: number;
  readonly otherPlateau: number;
  readonly body: PairMatrixManualBodyZh;
};

/**
 * 原数 `meRaw`、`otherRaw` 各在 **1–99**：先化约到盘面，再取与 `lifePathPairCatalogBodyZh` 相同的手写定稿。
 */
export function lifePathPairCatalogBodyZhFromRawInts(
  meRaw: number,
  otherRaw: number,
): RawPairCatalogResolutionZh {
  assertRawInt(meRaw, "meRaw");
  assertRawInt(otherRaw, "otherRaw");
  const mePlateau = rawIntegerToLifePathPlateau(meRaw);
  const otherPlateau = rawIntegerToLifePathPlateau(otherRaw);
  return {
    meRaw,
    otherRaw,
    mePlateau,
    otherPlateau,
    body: lifePathPairCatalogBodyZh(mePlateau, otherPlateau),
  };
}

/** `n → 盘面` 全表，**n=1…99** 各一行（供导出 / 对表） */
export function rawIntegerToPlateauMap1To99(): ReadonlyArray<{ raw: number; plateau: number }> {
  return ALL_RAW_INTEGERS_1_TO_99.map((raw) => ({ raw, plateau: rawIntegerToLifePathPlateau(raw) }));
}
