/**
 * 韦特系 78 张：用于抽牌与展示名；解读句库可后续按 id 扩展。
 */

export type TarotSuit = "wands" | "cups" | "swords" | "pentacles";

export type TarotCardDef = {
  id: number;
  nameZh: string;
  arcana: "major" | "minor";
  suit?: TarotSuit;
  /** 短意象，供核心快照拼接 */
  gistZh: string;
};

const SUIT_ZH: Record<TarotSuit, string> = {
  wands: "权杖",
  cups: "圣杯",
  swords: "宝剑",
  pentacles: "星币",
};

const MINOR_RANKS: { key: string; zh: string }[] = [
  { key: "ace", zh: "王牌" },
  { key: "2", zh: "二" },
  { key: "3", zh: "三" },
  { key: "4", zh: "四" },
  { key: "5", zh: "五" },
  { key: "6", zh: "六" },
  { key: "7", zh: "七" },
  { key: "8", zh: "八" },
  { key: "9", zh: "九" },
  { key: "10", zh: "十" },
  { key: "page", zh: "侍从" },
  { key: "knight", zh: "骑士" },
  { key: "queen", zh: "王后" },
  { key: "king", zh: "国王" },
];

const MINOR_GIST: Record<TarotSuit, string> = {
  wands: "意志、行动与创意火花的节奏",
  cups: "情绪、关系与内在接纳的潮汐",
  swords: "判断、边界与言语思绪的锋利",
  pentacles: "资源、身体与现实步调的地气",
};

const MAJORS: { nameZh: string; gistZh: string }[] = [
  { nameZh: "愚人", gistZh: "起点、空白与敢踏出一步" },
  { nameZh: "魔术师", gistZh: "聚焦意图、把资源拧成行动" },
  { nameZh: "女祭司", gistZh: "静观、直觉与尚未言明的底牌" },
  { nameZh: "女皇", gistZh: "滋养、丰盛与容许事情生长" },
  { nameZh: "皇帝", gistZh: "结构、边界与可执行的秩序" },
  { nameZh: "教皇", gistZh: "传统、共识与导师式指引" },
  { nameZh: "恋人", gistZh: "选择、对齐价值与关系契约" },
  { nameZh: "战车", gistZh: "推进、意志与把方向拧到底" },
  { nameZh: "力量", gistZh: "柔韧、耐心与以柔制刚" },
  { nameZh: "隐士", gistZh: "退后一步、独自校准内在罗盘" },
  { nameZh: "命运之轮", gistZh: "周期转折、外境带动的那一格" },
  { nameZh: "正义", gistZh: "权衡、因果与把话说在明处" },
  { nameZh: "倒吊人", gistZh: "悬置、换角度看同一件事" },
  { nameZh: "死神", gistZh: "结束、让渡与腾出下一季空间" },
  { nameZh: "节制", gistZh: "调和、慢炖与不过度倾斜" },
  { nameZh: "恶魔", gistZh: "黏着、惯性舒适区与松绑课题" },
  { nameZh: "塔", gistZh: "突变、旧壳碎裂后的清醒" },
  { nameZh: "星星", gistZh: "疗愈、远景与重新相信过程" },
  { nameZh: "月亮", gistZh: "迷雾、潜意识与尚未看清的恐惧" },
  { nameZh: "太阳", gistZh: "明朗、热力与可被看见的正向" },
  { nameZh: "审判", gistZh: "召唤、复盘与是否回应更高一层" },
  { nameZh: "世界", gistZh: "闭环、整合与一段旅程落款" },
];

function buildDeck(): TarotCardDef[] {
  const out: TarotCardDef[] = [];
  let id = 0;
  for (const m of MAJORS) {
    out.push({ id: id++, nameZh: m.nameZh, arcana: "major", gistZh: m.gistZh });
  }
  const suits = Object.keys(SUIT_ZH) as TarotSuit[];
  for (const suit of suits) {
    const g = MINOR_GIST[suit];
    for (const r of MINOR_RANKS) {
      const nameZh = `${SUIT_ZH[suit]}${r.zh}`;
      out.push({
        id: id++,
        nameZh,
        arcana: "minor",
        suit,
        gistZh: g,
      });
    }
  }
  return out;
}

export const TAROT_DECK_ZH: TarotCardDef[] = buildDeck();

export type TarotSpreadId = "single" | "past_present_future";

export const TAROT_SPREADS: { id: TarotSpreadId; labelZh: string; count: number; positionLabelsZh: string[] }[] = [
  { id: "single", labelZh: "单牌", count: 1, positionLabelsZh: ["焦点"] },
  {
    id: "past_present_future",
    labelZh: "三牌·时间流",
    count: 3,
    positionLabelsZh: ["过去基底", "当下现场", "趋向可能"],
  },
];
