/**
 * 事业大师向 · 题×大牌桥接（20 题 × 22 大牌）
 * 与 `CAREER_MAJOR_SOUL` 拼装为「牌说话」；与 `emit-career-rest-layers.mjs` 中 TAG_PSYCH 同源，改题钩时请双处对齐。
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

/** 与 `scripts/emit-career-rest-layers.mjs` 中 TAG_PSYCH 一致 */
export const CAREER_TAG_PSYCH = [
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

export const CAREER_MAJOR_BRIDGE: readonly (readonly string[])[] = CAREER_TAG_PSYCH.map((tag) =>
  majors.map((_, i) => `${tag}这一步：${MAJOR_TAIL[i]!}`)
);
