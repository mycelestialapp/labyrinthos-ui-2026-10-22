/**
 * 事业大师向 · 题×小牌点数桥接（20 题 × 14 点数 × 正逆）
 */

import { CAREER_TAG_PSYCH } from './tarot-career-master-bridges-major-zh';

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

export const CAREER_MINOR_RANK_BRIDGE: readonly (readonly (readonly [string, string])[])[] =
  CAREER_TAG_PSYCH.map((scene) => {
    const stem = scene.endsWith('') ? scene.slice(0, -1) : scene;
    return UP_TAIL.map((up, idx) => {
      const u = `这一步：${stem}；${up}`;
      const d = `这一步：${stem}；${DN_TAIL[idx]!}`;
      return [u, d] as const;
    });
  });
