/**
 * 财运大师向 · 题×小牌点数桥接（20 题 × 14 点数 × 正逆）
 * 花色只在「你抽到的是…」出现一次；桥接用「这一步：」起句，不再重复 `{花}`。
 */

import { MONEY_TAG_PSYCH } from './tarot-money-master-bridges-major-zh';

/** 不含题干钩，接在「当前处境」后 */
const UP_TAIL: readonly string[] = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
];

const DN_TAIL: readonly string[] = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
];

export const MONEY_MINOR_RANK_BRIDGE: readonly (readonly (readonly [string, string])[])[] =
  MONEY_TAG_PSYCH.map((scene) => {
    const stem = scene.endsWith('') ? scene.slice(0, -1) : scene;
    return UP_TAIL.map((up, idx) => {
      const u = `这一步：${stem}；${up}`;
      const d = `这一步：${stem}；${DN_TAIL[idx]!}`;
      return [u, d] as const;
    });
  });
