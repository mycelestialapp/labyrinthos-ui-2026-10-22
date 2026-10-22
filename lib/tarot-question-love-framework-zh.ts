/**
 * 感情婚姻 · 分类框架（东西方共用场景，中文成稿）。
 *
 * 格子写两边都会碰上的关系现场，不偏彩礼或某国婚俗。
 * 专名留给翻译层；点选题不夹外文。冻结核原文一字不改。
 * 缺口题暂无 78×2 成稿时走通用大师解，解读同样不写成一国习俗说明书。
 */

export type LoveFrameworkGroup = {
  label: string;
  keys: string[];
  surface: string[];
};

/** 已入库冻结核原文（勿改字） */
export const LOVE_Q = {
  essence: "这段关系的本质是什么？",
  obstacle: "我们之间最大的阻碍是什么？",
  lesson: "这段关系想教会我什么？",
  trend: "我们目前的关系能量走向如何？我可以做什么来影响它？",
  months: "未来 3～6 个月，我的感情能量会如何变化？我该做什么准备？",
  blindspot: "这段感情目前最大的盲点／课题是什么？我该如何面对？",
  recoverWays: "我该从哪些面向着手，才能提高挽回的可能性？",
  recoverSteps: "如果我想挽回，我目前最适合采取的步骤是？",
  express: "我该怎么表达，才能让他更愿意认真对待这段感情？",
  reunion: "关于复合，我需要知道什么？",
  leaveMind: "我该如何调整心态，才能更快走出这段感情？",
  letGoOrStay: "放手与挽回，分别意味着什么？我该如何选择？",
  heal: "如何疗愈我的心？",
  partnerType: "什么样的伴侣适合我？",
  attract: "如何提升自己，让我更容易吸引到合适的对象？",
  newLove: "我该如何迎接新的爱情？",
  feelings: "他／她目前对我的真实感受／能量是什么？我该如何回应？",
  behavior: "对方目前展现的行为／能量，对我来说代表什么？我该如何判断？",
  pattern: "我在感情中的模式是什么？",
  sameType: "我为何总是吸引同类型的人？",
  readyNew: "我准备好进入新关系了吗？我该如何爱自己？",
  worthContinue: "这段感情值得继续吗？",
  marry: "我们适合结婚吗？",
  marryBlock: "迈向婚姻，我们目前最需要克服的是什么？",
  confess: "该不该表白？",
  breakup: "该不该分手？",
  divorce: "该不该离婚？",
  fortune: "近期感情运势如何？",
  /** 以下为框架缺口：归类键，暂无专属冻结核 */
  status: "我们现在到底算什么？",
  affair: "有没有第三者？",
  cheat: "他／她会不会出轨？",
  forgiveCheat: "出轨之后，该原谅还是离开？",
  spare: "我是不是备胎？",
  stringing: "他／她是不是在吊着我？",
  hiding: "对方有没有在隐瞒什么？",
  crush: "暗恋还有没有希望？",
  meetParents: "该不该见家长？",
  cohabit: "该不该同居／一起住试试？",
  saveMarriage: "这段婚姻还能挽救吗？",
  separate: "分居能不能让关系冷静下来？",
  longDistance: "异地恋还能不能撑下去？",
  afterMeet: "见面之后，这段关系会怎样？",
  familyOppose: "家人反对，这段还能走下去吗？",
  moneyConflict: "感情里的金钱矛盾该怎么面对？",
  harm: "这段关系是否在伤害我，我该不该离开？",
  identity: "这段关系在家人与外界面前，我们该如何自处？",
  demandTitle: "继续装傻，还是逼他给我一个正式名份？",
  vsEx: "在他心里，我和那个忘不掉的前任／正宫，谁更重要？",
  moneyGuard: "还没结婚他就开始防着我／算计钱，这段还能嫁吗？",
  bridePrice: "因为彩礼／婚前出资／房产记名两家闹僵了，该妥协还是止损？",
  marryPoor: "跟着他是不是要陪他吃苦，我会不会变成扶贫？",
  prenupSign: "婚前协议现在签，是保护还是把感情谈崩？",
  bodyCool: "他对我越来越没有身体欲望，是厌倦了还是外面有人？",
  bodyOnly: "我们除了身体契合，到底还有没有真正的爱？",
  ghosted: "他为什么突然冷暴力／拉黑我？还会再联系吗？",
  stalkingFeed: "他频繁看我社交动态，到底是什么心态？",
  untilOver: "我还要被这段折磨多久，才算真正熬出头？",
  grayStay: "这段不公开／不上下，我还有没有转正的胜算？",
} as const;

export const LOVE_FROZEN_CANONICAL: readonly string[] = [
  LOVE_Q.essence,
  LOVE_Q.obstacle,
  LOVE_Q.lesson,
  LOVE_Q.trend,
  LOVE_Q.months,
  LOVE_Q.blindspot,
  LOVE_Q.recoverWays,
  LOVE_Q.recoverSteps,
  LOVE_Q.express,
  LOVE_Q.reunion,
  LOVE_Q.leaveMind,
  LOVE_Q.letGoOrStay,
  LOVE_Q.heal,
  LOVE_Q.partnerType,
  LOVE_Q.attract,
  LOVE_Q.newLove,
  LOVE_Q.feelings,
  LOVE_Q.behavior,
  LOVE_Q.pattern,
  LOVE_Q.sameType,
  LOVE_Q.readyNew,
  LOVE_Q.worthContinue,
  LOVE_Q.marry,
  LOVE_Q.marryBlock,
  LOVE_Q.confess,
  LOVE_Q.breakup,
  LOVE_Q.divorce,
  LOVE_Q.fortune,
];

export const LOVE_FRAMEWORK_GROUPS: LoveFrameworkGroup[] = [
  {
    label: "关系现状与本质",
    keys: ["本质", "阻碍", "教会", "课题", "名分", "暧昧", "算什么", "认真"],
    surface: [LOVE_Q.essence, LOVE_Q.obstacle, LOVE_Q.lesson, LOVE_Q.status],
  },
  {
    label: "关系走向与未来",
    keys: ["走向", "能量", "三个月", "半年", "未来", "准备", "运势", "桃花运"],
    surface: [LOVE_Q.trend, LOVE_Q.months, LOVE_Q.blindspot, LOVE_Q.fortune],
  },
  {
    label: "对方心意",
    keys: ["爱我", "心里", "感受", "感觉", "真心", "冷淡", "已读"],
    surface: [LOVE_Q.feelings, LOVE_Q.behavior],
  },
  {
    label: "信任与越界",
    keys: ["第三者", "出轨", "备胎", "吊着", "隐瞒", "背叛", "越界", "查岗"],
    surface: [LOVE_Q.affair, LOVE_Q.cheat, LOVE_Q.forgiveCheat, LOVE_Q.spare, LOVE_Q.stringing, LOVE_Q.hiding],
  },
  {
    label: "暗恋与表白",
    keys: ["表白", "告白", "暗恋", "单恋"],
    surface: [LOVE_Q.confess, LOVE_Q.crush],
  },
  {
    label: "挽回与复合",
    keys: ["挽回", "复合", "回头", "回来", "表达", "前任"],
    surface: [LOVE_Q.recoverWays, LOVE_Q.recoverSteps, LOVE_Q.express, LOVE_Q.reunion],
  },
  {
    label: "放手与疗愈",
    keys: ["走出", "放手", "疗愈", "放下", "走出来", "失恋"],
    surface: [LOVE_Q.leaveMind, LOVE_Q.letGoOrStay, LOVE_Q.heal],
  },
  {
    label: "去留决策",
    keys: ["值得继续", "分手", "分开", "结束", "该不该分"],
    surface: [LOVE_Q.worthContinue, LOVE_Q.breakup],
  },
  {
    label: "婚姻与承诺",
    keys: ["结婚", "领证", "见家长", "同居", "承诺", "订婚"],
    surface: [LOVE_Q.marry, LOVE_Q.marryBlock, LOVE_Q.meetParents, LOVE_Q.cohabit],
  },
  {
    label: "离婚与危机",
    keys: ["离婚", "分居", "挽救", "婚姻危机", "离"],
    surface: [LOVE_Q.divorce, LOVE_Q.saveMarriage, LOVE_Q.separate],
  },
  {
    label: "择偶与脱单",
    keys: ["伴侣", "吸引", "脱单", "桃花", "新的爱情", "正缘", "爱自己", "相亲"],
    surface: [LOVE_Q.partnerType, LOVE_Q.attract, LOVE_Q.newLove, LOVE_Q.readyNew],
  },
  {
    label: "相处与现实",
    keys: ["异地", "见面", "家人反对", "金钱", "冷战", "催婚"],
    surface: [LOVE_Q.longDistance, LOVE_Q.afterMeet, LOVE_Q.familyOppose, LOVE_Q.moneyConflict],
  },
  {
    label: "自我觉察与模式",
    keys: ["模式", "同类型", "重复", "习惯", "将就", "依恋"],
    surface: [LOVE_Q.pattern, LOVE_Q.sameType],
  },
  {
    label: "伤害与自处",
    keys: ["伤害", "暴力", "安全", "出柜", "冷暴力", "控制"],
    surface: [LOVE_Q.harm, LOVE_Q.identity],
  },
  {
    label: "名份与定位",
    keys: ["摊牌", "转正", "地下", "灰色", "不公开", "不上下", "名份"],
    surface: [LOVE_Q.demandTitle, LOVE_Q.vsEx, LOVE_Q.grayStay],
  },
  {
    label: "婚前物质",
    keys: ["彩礼", "聘礼", "加名", "记名", "婚前出资", "婚前协议", "算计", "防着"],
    surface: [LOVE_Q.moneyGuard, LOVE_Q.bridePrice, LOVE_Q.marryPoor, LOVE_Q.prenupSign],
  },
  {
    label: "身体与欲望",
    keys: ["欲望", "身体", "肉体", "性生活", "性冷淡"],
    surface: [LOVE_Q.bodyCool, LOVE_Q.bodyOnly],
  },
  {
    label: "断联与失控",
    keys: ["拉黑", "断联", "视奸", "朋友圈", "熬头"],
    surface: [LOVE_Q.ghosted, LOVE_Q.stalkingFeed, LOVE_Q.untilOver],
  },
];

export type LoveFilterTab = {
  id: string;
  label: string;
  groupLabels: readonly string[];
  surface?: readonly string[];
};

export const LOVE_FEATURED_SURFACE: readonly string[] = [
  LOVE_Q.feelings,
  LOVE_Q.status,
  LOVE_Q.demandTitle,
  LOVE_Q.reunion,
  LOVE_Q.breakup,
  LOVE_Q.affair,
  LOVE_Q.spare,
  LOVE_Q.marry,
  LOVE_Q.bridePrice,
  LOVE_Q.ghosted,
  LOVE_Q.bodyCool,
  LOVE_Q.untilOver,
  LOVE_Q.obstacle,
  LOVE_Q.worthContinue,
];

export const LOVE_FILTER_TABS: readonly LoveFilterTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: LOVE_FEATURED_SURFACE },
  { id: "stay", label: "复合/去留", groupLabels: ["挽回与复合", "去留决策", "放手与疗愈", "关系走向与未来", "对方心意"] },
  {
    id: "title",
    label: "名份/灰色",
    groupLabels: ["关系现状与本质", "暗恋与表白", "名份与定位"],
    surface: [LOVE_Q.demandTitle, LOVE_Q.grayStay, LOVE_Q.vsEx, LOVE_Q.spare, LOVE_Q.stringing, LOVE_Q.status],
  },
  { id: "trust", label: "出轨/信任", groupLabels: ["信任与越界", "伤害与自处"] },
  {
    id: "marry",
    label: "结婚/算计",
    groupLabels: ["婚姻与承诺", "离婚与危机", "相处与现实", "婚前物质"],
    surface: [LOVE_Q.bridePrice, LOVE_Q.prenupSign, LOVE_Q.moneyGuard, LOVE_Q.marry, LOVE_Q.marryBlock],
  },
  {
    id: "cut",
    label: "断联/失控",
    groupLabels: ["断联与失控", "择偶与脱单", "自我觉察与模式"],
    surface: [LOVE_Q.ghosted, LOVE_Q.stalkingFeed, LOVE_Q.untilOver],
  },
  {
    id: "body",
    label: "身体/契合",
    groupLabels: ["身体与欲望"],
    surface: [LOVE_Q.bodyCool, LOVE_Q.bodyOnly],
  },
];

export const LOVE_DEFAULT_FILTER_ID = "hot";

export function loveSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  const tab = LOVE_FILTER_TABS.find((t) => t.id === filterId) ?? LOVE_FILTER_TABS[0];
  if (tab?.surface?.length) return [...tab.surface];
  if (!tab || tab.groupLabels.length === 0) {
    return groups.flatMap((g) => [...g.surface]);
  }
  const want = new Set(tab.groupLabels);
  return groups.filter((g) => want.has(g.label)).flatMap((g) => [...g.surface]);
}
