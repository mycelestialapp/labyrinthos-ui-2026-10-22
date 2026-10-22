/**
 * 财运大师向 · 题×大牌桥接（20 题 × 22 大牌）
 * 与 `MONEY_MAJOR_SOUL` 拼装为「牌说话」；场景句 × 大牌核句组合，避免 2～20 问共用同一套叙事壳。
 */

const majors = [
  '愚者',
  '魔术师',
  '女祭司',
  '皇后',
  '皇帝',
  '教皇',
  '恋人',
  '战车',
  '力量',
  '隐士',
  '命运之轮',
  '正义',
  '倒吊人',
  '死神',
  '节制',
  '恶魔',
  '高塔',
  '星星',
  '月亮',
  '太阳',
  '审判',
  '世界',
] as const;

/** 与题干情绪对齐的现状钩（与 emit-money-rest-layers TAG_PSYCH 同源）；小牌点数桥接复用。 */
export const MONEY_TAG_PSYCH = [
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
  '',
  '',
  '',
  '',
  '',
  '',
] as const;

/** 大牌在此题上的「接话核」（不含题干复述） */
const MAJOR_TAIL: readonly string[] = [
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
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
];

export const MONEY_MAJOR_BRIDGE: readonly (readonly string[])[] = MONEY_TAG_PSYCH.map((tag) =>
  majors.map((_, i) => `${tag}这一步：${MAJOR_TAIL[i]!}`)
);
