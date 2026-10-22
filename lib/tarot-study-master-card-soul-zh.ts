/**
 * 学业大师向 · 牌魂层（与题干解耦）：78 牌 × 正逆，各一条「芯」。
 * 拼装时由题桥接题干；忌财运话术、忌机核隐喻。
 */

export type StudyMinorSuitKey = 'wands' | 'cups' | 'swords' | 'pentacles';

/** 22 大牌 × [正位芯, 逆位芯] */
export const STUDY_MAJOR_SOUL: readonly (readonly [string, string])[] = [
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
  [
    '',
    '',
  ],
];

function minorSoulRow(
  w: [string, string],
  c: [string, string],
  s: [string, string],
  p: [string, string]
): Record<StudyMinorSuitKey, readonly [string, string]> {
  return { wands: w, cups: c, swords: s, pentacles: p };
}

/** num 1..14；每花色 [正, 逆] */
export const STUDY_MINOR_SOUL_BY_NUM: readonly Record<StudyMinorSuitKey, readonly [string, string]>[] = [
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
