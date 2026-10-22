/**
 * 塔罗大师向 · 小牌起句（四花色 × 正逆 × 各 3 条轮换）
 *
 * 【适用】与 `tarot-master-question-content-study-engine`、`tarot-master-question-content-money-engine`
 * 拼装「牌说话」时前置；**中性不绑单题**，与财运/学业 A 升级版口径一致。
 *
 * 【不适用】感情/事业等类目：小牌多为整段 cardSpeaking 真源手写，无此 pre 层；勿混用。
 */

export type TarotMinorSuitKey = 'wands' | 'cups' | 'swords' | 'pentacles';

export const TAROT_MINOR_PRE_LINES_MASTER: Record<
  TarotMinorSuitKey,
  { up: readonly string[]; dn: readonly string[] }
> = {
  wands: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  cups: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  swords: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  pentacles: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
} as const;

/** 财运向：在共用骨架上替换学业专用词为钱题用词（仍中性、不绑单题）。 */
export const TAROT_MINOR_PRE_LINES_MONEY: Record<
  TarotMinorSuitKey,
  { up: readonly string[]; dn: readonly string[] }
> = {
  wands: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  cups: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  swords: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  pentacles: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
} as const;

/** 生活六大类向：小牌起句（去学业/备考词） */
export const TAROT_MINOR_PRE_LINES_LIFE_SIX: Record<
  TarotMinorSuitKey,
  { up: readonly string[]; dn: readonly string[] }
> = {
  wands: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  cups: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  swords: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  pentacles: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
} as const;

/** 生活六大类 · 身体健康专用起句（诊务节律、体征优先） */
export const TAROT_MINOR_PRE_LINES_LIFE_SIX_HEALTH: Record<
  TarotMinorSuitKey,
  { up: readonly string[]; dn: readonly string[] }
> = {
  wands: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  cups: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  swords: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  pentacles: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
} as const;

/** 人际关系专用起句 */
export const TAROT_MINOR_PRE_LINES_LIFE_SIX_RELATION: Record<
  TarotMinorSuitKey,
  { up: readonly string[]; dn: readonly string[] }
> = {
  wands: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  cups: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  swords: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  pentacles: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
} as const;

/** 生育子女专用起句 */
export const TAROT_MINOR_PRE_LINES_LIFE_SIX_CHILD: Record<
  TarotMinorSuitKey,
  { up: readonly string[]; dn: readonly string[] }
> = {
  wands: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  cups: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  swords: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  pentacles: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
} as const;

/** 选择决策专用起句 */
export const TAROT_MINOR_PRE_LINES_LIFE_SIX_CHOICE: Record<
  TarotMinorSuitKey,
  { up: readonly string[]; dn: readonly string[] }
> = {
  wands: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  cups: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  swords: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  pentacles: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
} as const;

/** 宠物照护专用起句 */
export const TAROT_MINOR_PRE_LINES_LIFE_SIX_PET: Record<
  TarotMinorSuitKey,
  { up: readonly string[]; dn: readonly string[] }
> = {
  wands: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  cups: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  swords: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  pentacles: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
} as const;

/** 灵性成长专用起句（落地、边界、身心并行） */
export const TAROT_MINOR_PRE_LINES_LIFE_SIX_SPIRIT: Record<
  TarotMinorSuitKey,
  { up: readonly string[]; dn: readonly string[] }
> = {
  wands: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  cups: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  swords: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
  pentacles: {
    up: [
      '',
      '',
      '',
    ],
    dn: [
      '',
      '',
      '',
    ],
  },
} as const;

/** 生活六大类小牌起句：与健康类专用表同序（0..5） */
export const TAROT_MINOR_PRE_LINES_LIFE_SIX_BY_CAT: readonly Record<
  TarotMinorSuitKey,
  { up: readonly string[]; dn: readonly string[] }
>[] = [
  TAROT_MINOR_PRE_LINES_LIFE_SIX_HEALTH,
  TAROT_MINOR_PRE_LINES_LIFE_SIX_RELATION,
  TAROT_MINOR_PRE_LINES_LIFE_SIX_CHILD,
  TAROT_MINOR_PRE_LINES_LIFE_SIX_CHOICE,
  TAROT_MINOR_PRE_LINES_LIFE_SIX_PET,
  TAROT_MINOR_PRE_LINES_LIFE_SIX_SPIRIT,
];
