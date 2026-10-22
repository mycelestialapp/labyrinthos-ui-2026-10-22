/**
 * 生活六大类大师向 · 牌魂层（与学业 STUDY_* 分离，忌备考/学分/挂科等措辞）
 * 拼装：`tarot-master-question-content-life-six-engine.ts`
 */
import type { StudyMinorSuitKey } from './tarot-study-master-card-soul-zh';

function minorSoulRow(
  w: [string, string],
  c: [string, string],
  s: [string, string],
  p: [string, string]
): Record<StudyMinorSuitKey, readonly [string, string]> {
  return { wands: w, cups: c, swords: s, pentacles: p };
}

/** 身体健康 · 22 大牌魂（就医节律、不替代诊疗） */
export const LIFE_SIX_MAJOR_SOUL_HEALTH: readonly (readonly [string, string])[] = [
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
];

/** 人际关系 · 22 大牌魂 */
export const LIFE_SIX_MAJOR_SOUL_RELATION: readonly (readonly [string, string])[] = [
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
];

/** 生育子女 · 22 大牌魂 */
export const LIFE_SIX_MAJOR_SOUL_CHILD: readonly (readonly [string, string])[] = [
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
];

/** 选择决策 · 22 大牌魂 */
export const LIFE_SIX_MAJOR_SOUL_CHOICE: readonly (readonly [string, string])[] = [
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
];

/** 宠物 · 22 大牌魂（兽医优先、丰容并行） */
export const LIFE_SIX_MAJOR_SOUL_PET: readonly (readonly [string, string])[] = [
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
];

/** 灵性成长 · 22 大牌魂（身心并行、安全底线） */
export const LIFE_SIX_MAJOR_SOUL_SPIRIT: readonly (readonly [string, string])[] = [
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
];

export const LIFE_SIX_MAJOR_SOUL_BY_CAT: readonly (readonly (readonly [string, string])[])[] = [
  LIFE_SIX_MAJOR_SOUL_HEALTH,
  LIFE_SIX_MAJOR_SOUL_RELATION,
  LIFE_SIX_MAJOR_SOUL_CHILD,
  LIFE_SIX_MAJOR_SOUL_CHOICE,
  LIFE_SIX_MAJOR_SOUL_PET,
  LIFE_SIX_MAJOR_SOUL_SPIRIT,
];

/** num 1..14；每花色 [正, 逆] — 去学业词，六大类共用 */
export const LIFE_SIX_MINOR_SOUL_BY_NUM: readonly Record<StudyMinorSuitKey, readonly [string, string]>[] = [
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
];

/** 身体健康 · 小牌魂（体征/医嘱/复诊节律） */
export const LIFE_SIX_MINOR_SOUL_HEALTH: readonly Record<StudyMinorSuitKey, readonly [string, string]>[] = [
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
];

/** 宠物 · 小牌魂（兽医/丰容/行为） */
export const LIFE_SIX_MINOR_SOUL_PET: readonly Record<StudyMinorSuitKey, readonly [string, string]>[] = [
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
];

/** 人际关系 · 小牌魂（边界、对齐、留痕、修复节奏） */
export const LIFE_SIX_MINOR_SOUL_RELATION: readonly Record<StudyMinorSuitKey, readonly [string, string]>[] = [
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
];

/** 生育子女 · 小牌魂（成长节律、家校儿保、照护分工） */
export const LIFE_SIX_MINOR_SOUL_CHILD: readonly Record<StudyMinorSuitKey, readonly [string, string]>[] = [
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
];

/** 选择决策 · 小牌魂（对比表、截止日、退出条件、可逆小步） */
export const LIFE_SIX_MINOR_SOUL_CHOICE: readonly Record<StudyMinorSuitKey, readonly [string, string]>[] = [
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
];

/** 灵性成长 · 小牌魂（身心落地、边界、练习节奏、专业支持） */
export const LIFE_SIX_MINOR_SOUL_SPIRIT: readonly Record<StudyMinorSuitKey, readonly [string, string]>[] = [
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
  minorSoulRow(
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ),
];

/** 0 健康 1 人际 2 生育 3 决策 4 宠物 5 灵性 — 小牌魂 */
export const LIFE_SIX_MINOR_SOUL_BY_CAT: readonly (readonly Record<StudyMinorSuitKey, readonly [string, string]>[])[] = [
  LIFE_SIX_MINOR_SOUL_HEALTH,
  LIFE_SIX_MINOR_SOUL_RELATION,
  LIFE_SIX_MINOR_SOUL_CHILD,
  LIFE_SIX_MINOR_SOUL_CHOICE,
  LIFE_SIX_MINOR_SOUL_PET,
  LIFE_SIX_MINOR_SOUL_SPIRIT,
];
