export type LenormandCard = {
  id: number;
  nameZh: string;
  symbol: string;
  shortMeaning: string;
};

export const LENORMAND_CARDS: LenormandCard[] = [
  { id: 1, nameZh: "骑士", symbol: "🐴", shortMeaning: "消息、变动、快速" },
  { id: 2, nameZh: "三叶草", symbol: "🍀", shortMeaning: "幸运、小确幸" },
  { id: 3, nameZh: "船", symbol: "⛵", shortMeaning: "旅行、远行、传播" },
  { id: 4, nameZh: "房子", symbol: "🏠", shortMeaning: "家庭、安全感、根基" },
  { id: 5, nameZh: "树", symbol: "🌳", shortMeaning: "健康、成长、生命" },
  { id: 6, nameZh: "云", symbol: "☁️", shortMeaning: "困惑、模糊、需澄清" },
  { id: 7, nameZh: "蛇", symbol: "🐍", shortMeaning: "诱惑、曲折、智慧" },
  { id: 8, nameZh: "棺材", symbol: "⚰️", shortMeaning: "结束、转化、放下" },
  { id: 9, nameZh: "花束", symbol: "💐", shortMeaning: "礼物、美好、收获" },
  { id: 10, nameZh: "镰刀", symbol: "🔪", shortMeaning: "决断、切割、收获" },
  { id: 11, nameZh: "鞭子", symbol: "🪢", shortMeaning: "重复、争执、节奏" },
  { id: 12, nameZh: "鸟", symbol: "🐦", shortMeaning: "沟通、消息、焦虑" },
  { id: 13, nameZh: "孩子", symbol: "👶", shortMeaning: "纯真、新开始、单纯" },
  { id: 14, nameZh: "狐狸", symbol: "🦊", shortMeaning: "谋略、工作、谨慎" },
  { id: 15, nameZh: "熊", symbol: "🐻", shortMeaning: "权威、力量、保护" },
  { id: 16, nameZh: "星星", symbol: "⭐", shortMeaning: "希望、灵感、指引" },
  { id: 17, nameZh: "鹳", symbol: "🦩", shortMeaning: "转变、迁移、提升" },
  { id: 18, nameZh: "狗", symbol: "🐕", shortMeaning: "忠诚、朋友、陪伴" },
  { id: 19, nameZh: "塔", symbol: "🗼", shortMeaning: "孤独、机构、距离" },
  { id: 20, nameZh: "花园", symbol: "🏡", shortMeaning: "社交、公开、聚会" },
  { id: 21, nameZh: "山", symbol: "⛰️", shortMeaning: "阻碍、挑战、稳固" },
  { id: 22, nameZh: "路", symbol: "🛤️", shortMeaning: "选择、方向、旅程" },
  { id: 23, nameZh: "老鼠", symbol: "🐭", shortMeaning: "耗损、担忧、细节" },
  { id: 24, nameZh: "心", symbol: "❤️", shortMeaning: "情感、爱、情绪" },
  { id: 25, nameZh: "戒指", symbol: "💍", shortMeaning: "承诺、契约、循环" },
  { id: 26, nameZh: "书", symbol: "📖", shortMeaning: "秘密、学习、未知" },
  { id: 27, nameZh: "信", symbol: "✉️", shortMeaning: "消息、文书、沟通" },
  { id: 28, nameZh: "男人", symbol: "👨", shortMeaning: "男性、阳性能量" },
  { id: 29, nameZh: "女人", symbol: "👩", shortMeaning: "女性、阴性能量" },
  { id: 30, nameZh: "百合", symbol: "🌸", shortMeaning: "宁静、成熟、智慧" },
  { id: 31, nameZh: "太阳", symbol: "☀️", shortMeaning: "成功、活力、明朗" },
  { id: 32, nameZh: "月亮", symbol: "🌙", shortMeaning: "直觉、梦境、周期" },
  { id: 33, nameZh: "钥匙", symbol: "🔑", shortMeaning: "解决、关键、答案" },
  { id: 34, nameZh: "鱼", symbol: "🐟", shortMeaning: "财富、丰盛、流动" },
  { id: 35, nameZh: "锚", symbol: "⚓", shortMeaning: "稳定、事业、坚持" },
  { id: 36, nameZh: "十字", symbol: "✝️", shortMeaning: "业力、责任、承担" },
];

export function shuffleLenormandDeck(seed = Math.random()): LenormandCard[] {
  const out = [...LENORMAND_CARDS];
  let s = Math.floor(seed * 2147483647) || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    s = (s * 48271) % 2147483647;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

