/**
 * 塔羅牌牌義 · 78 張（22 大阿爾克那 + 56 小阿爾克那）
 * 對齊占星規格：結構化、繁體中文、正/逆位、關鍵詞、建議。
 * 牌義依據主流偉特系詮釋，供本地解讀與每日一牌使用。
 */

export type TarotSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCardEntry {
  id: string;
  nameZh: string;
  suit: TarotSuit;
  /** 牌面圖片（可選，本地路徑或 URL） */
  image?: string;
  /** 正位牌義（完整敘述，可多段） */
  upright: string;
  /** 逆位牌義 */
  reversed: string;
  /** 關鍵詞（3～5 個） */
  keywords: string[];
  /** 一句建議 */
  advice: string;
  /** 愛情運勢（主流 App 常見維度） */
  love?: string;
  /** 事業／工作 */
  career?: string;
  /** 財運／金錢 */
  wealth?: string;
  /** 健康（可選） */
  health?: string;
}

/** 大阿爾克那 0–21 */
const MAJOR_ARCANA: TarotCardEntry[] = [
  {
    id: 'major_0',
    nameZh: '愚者',
    suit: 'major',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_1',
    nameZh: '魔術師',
    suit: 'major',
    image: '/tarot/thoth/thoth_magician.jpg',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_2',
    nameZh: '女祭司',
    suit: 'major',
    image: '/tarot/thoth/thoth_priestess.jpg',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_3',
    nameZh: '皇后',
    suit: 'major',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_4',
    nameZh: '皇帝',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_5',
    nameZh: '教皇',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_6',
    nameZh: '戀人',
    suit: 'major',
    image: '/tarot/thoth/thoth_lovers.jpg',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_7',
    nameZh: '戰車',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_8',
    nameZh: '力量',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_9',
    nameZh: '隱者',
    suit: 'major',
    image: '/thoth/major_09_hermit.jpg',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_10',
    nameZh: '命運之輪',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_11',
    nameZh: '正義',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_12',
    nameZh: '倒吊人',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_13',
    nameZh: '死神',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_14',
    nameZh: '節制',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_15',
    nameZh: '惡魔',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_16',
    nameZh: '高塔',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_17',
    nameZh: '星星',
    suit: 'major',
    image: '/thoth/major_17_star.jpg',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_18',
    nameZh: '月亮',
    suit: 'major',
    image: '/thoth/major_18_moon.jpg',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_19',
    nameZh: '太陽',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_20',
    nameZh: '審判',
    suit: 'major',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    id: 'major_21',
    nameZh: '世界',
    suit: 'major',
    image: '/thoth/major_21.jpg',
    keywords: [],
    upright: '',
    reversed: '',
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
];

/** 小阿爾克那：四組牌組 × 14 張（1–10 + 侍從/騎士/皇后/國王） */
function buildMinor(
  suit: TarotSuit,
  nameZhPrefix: string,
  cards: {
    name: string;
    upright: string;
    reversed: string;
    keywords: string[];
    advice: string;
    love?: string;
    career?: string;
    wealth?: string;
    health?: string;
    image?: string;
  }[],
): TarotCardEntry[] {
  return cards.map((c, i) => ({
    id: `${suit}_${i + 1}`,
    nameZh: `${nameZhPrefix}${c.name}`,
    suit,
    ...(c.image ? { image: c.image } : {}),
    upright: c.upright,
    reversed: c.reversed,
    keywords: c.keywords,
    advice: c.advice,
    love: c.love,
    career: c.career,
    wealth: c.wealth,
    health: c.health,
  }));
}

/** 權杖 1–14（火元素：行動、創意、動能） */
const WANDS_CARDS: TarotCardEntry[] = buildMinor('wands', '權杖', [
  {
    name: '一',
    image: '/tarot/thoth/thoth_wands_01.jpg',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '二',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '三',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '四',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '五',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '六',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '七',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '八',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '九',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '十',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '侍者',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '騎士',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '皇后',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '國王',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
]);

/** 聖杯 1–14（水元素：情感、直覺、關係） */
const CUPS_CARDS: TarotCardEntry[] = buildMinor('cups', '聖杯', [
  {
    name: '一',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '二',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '三',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '四',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '五',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '六',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '七',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '八',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '九',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '十',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '侍從',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '騎士',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '皇后',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '國王',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
]);

/** 寶劍 1–14（風元素：思維、溝通、真相與衝突） */
const SWORDS_CARDS: TarotCardEntry[] = buildMinor('swords', '寶劍', [
  {
    name: '一',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '二',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '三',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '四',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '五',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '六',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '七',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '八',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '九',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '十',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '侍從',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '騎士',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '皇后',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '國王',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
]);

/** 錢幣 1–14 */
const PENTACLES_CARDS: TarotCardEntry[] = buildMinor('pentacles', '錢幣', [
  {
    name: '一',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '二',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '三',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '四',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '五',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '六',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '七',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '八',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '九',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '十',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '侍從',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '騎士',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '皇后',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
  {
    name: '國王',
    upright: '',
    reversed: '',
    keywords: [],
    advice: '',
    love: '',
    career: '',
    wealth: '',
  },
]);

const ALL_CARDS: TarotCardEntry[] = [
  ...MAJOR_ARCANA,
  ...WANDS_CARDS,
  ...CUPS_CARDS,
  ...SWORDS_CARDS,
  ...PENTACLES_CARDS,
];

const BY_ID = new Map<string, TarotCardEntry>(ALL_CARDS.map(c => [c.id, c]));

/** 依 id 取得單張牌 */
export function getTarotCardById(id: string): TarotCardEntry | undefined {
  return BY_ID.get(id);
}

/** 取得全部 78 張牌（供抽牌隨機用） */
export function getAllTarotCards(): TarotCardEntry[] {
  return [...ALL_CARDS];
}

/** 依日期種子做確定性「抽牌」（同一日同一種子得到同一張） */
function seededIndex(seed: number, max: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return Math.floor((x - Math.floor(x)) * max) % max;
}

/** 每日一牌：依日期抽一張，正逆位由種子決定 */
export function getDailyCard(date: Date): { card: TarotCardEntry; upright: boolean } {
  const seed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const idx = seededIndex(seed, ALL_CARDS.length);
  const card = ALL_CARDS[idx];
  const upright = seededIndex(seed + 1, 2) === 0;
  return { card, upright };
}

/** 三張牌陣：過去 / 當下 / 未來，依日期種子確定性抽牌 */
export function getThreeCardSpread(date: Date): { card: TarotCardEntry; upright: boolean }[] {
  const base =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  return getRandomDraw(base, 'three');
}

// 抽牌時可用的牌陣類型
export type SpreadKind = 'daily' | 'three' | 'relationship' | 'horseshoe';

/** 抽牌選項：逆位可由設定頁開關控制 */
export type GetRandomDrawOptions = { allowReversed?: boolean };

/** 依任意種子抽牌（用於用戶點擊「抽牌」當下的儀式感，每次抽牌結果不同） */
export function getRandomDraw(
  seed: number,
  spreadType: SpreadKind,
  options?: GetRandomDrawOptions
): { card: TarotCardEntry; upright: boolean }[] {
  const allowReversed = options?.allowReversed !== false;
  const count =
    spreadType === 'daily'
      ? 1
      : spreadType === 'three'
      ? 3
      : spreadType === 'relationship'
      ? 5
      : 7;
  const used = new Set<number>();
  const result: { card: TarotCardEntry; upright: boolean }[] = [];
  for (let i = 0; i < count; i++) {
    let idx = seededIndex(seed + i * 7919, ALL_CARDS.length);
    while (used.has(idx)) {
      idx = (idx + 1) % ALL_CARDS.length;
    }
    used.add(idx);
    const card = ALL_CARDS[idx];
    const upright = allowReversed ? seededIndex(seed + i * 3719, 2) === 0 : true;
    result.push({ card, upright });
  }
  return result;
}
