/**
 * 代人问卜 · 分类框架（东西方共用场景，中文成稿）。
 * 冻结核 20 条原文一字不改。
 */
import { PROXY_X } from "./tarot-question-proxy-extra-scenes-zh";
import { PROXY_Y } from "./tarot-question-proxy-extra-scenes-2-zh";
import { PROXY_Z } from "./tarot-question-proxy-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const PROXY_Q = {
  people: "我家人／朋友最近如何？",
  workLove: "他的工作／感情会顺利吗？",
  handle: "代问：他现在最该处理哪件事？",
  momDad: "我妈／我爸身体会好吗？",
  sibling: "我姐／我哥最近顺利吗？",
  friendHard: "我朋友能度过难关吗？",
  hisIll: "他的病能好吗？",
  comeBack: "他会回来吗？",
  thinking: "对方现在在想什么？",
  kid: "我孩子最近如何？",
  partnerJob: "我伴侣的事业会好吗？",
  elder: "代问长辈健康？",
  stillMe: "他心里还有我吗？",
  palLove: "我闺蜜／兄弟感情会顺利吗？",
  familyFix: "家人关系会改善吗？",
  whenHeal: "他什么时候能好？",
  months: "代问：他近三个月运势如何？",
  promote: "我同事能升职吗？",
  forHer: "替她问：他心里还有她吗？",
  familyThing: "替家人问：最近这件事会不会过？",
  ...PROXY_X,
  ...PROXY_Y,
  ...PROXY_Z,
} as const;

export const PROXY_FROZEN_CANONICAL: readonly string[] = [
  PROXY_Q.people, PROXY_Q.workLove, PROXY_Q.handle, PROXY_Q.momDad, PROXY_Q.sibling,
  PROXY_Q.friendHard, PROXY_Q.hisIll, PROXY_Q.comeBack, PROXY_Q.thinking, PROXY_Q.kid,
  PROXY_Q.partnerJob, PROXY_Q.elder, PROXY_Q.stillMe, PROXY_Q.palLove, PROXY_Q.familyFix,
  PROXY_Q.whenHeal, PROXY_Q.months, PROXY_Q.promote, PROXY_Q.forHer, PROXY_Q.familyThing,
];

export const PROXY_FRAMEWORK_GROUPS = [
  {
    label: "代问总势",
    keys: ["代问", "最近如何", "运势", "告诉", "插手"],
    surface: [PROXY_Q.luckNow, PROXY_Q.luckYear, PROXY_Q.luckWhen, PROXY_Q.luckPatch, PROXY_Q.ignoreSignal, PROXY_Q.people, PROXY_Q.handle, PROXY_Q.months, PROXY_Q.tellOrNot, PROXY_Q.howToHelp, PROXY_Q.moveOn],
  },
  {
    label: "代问感情",
    keys: ["心里", "回来", "感情", "替她", "前任"],
    surface: [PROXY_Q.comeBack, PROXY_Q.thinking, PROXY_Q.stillMe, PROXY_Q.palLove, PROXY_Q.forHer, PROXY_Q.loveBack, PROXY_Q.friendLove, PROXY_Q.newPerson, PROXY_Q.coupleAsk, PROXY_Q.exAsk],
  },
  {
    label: "代问家人",
    keys: ["家人", "爸", "妈", "长辈", "孩子", "替家人"],
    surface: [PROXY_Q.momDad, PROXY_Q.sibling, PROXY_Q.kid, PROXY_Q.elder, PROXY_Q.familyFix, PROXY_Q.familyThing, PROXY_Q.kidSchool, PROXY_Q.parentBody, PROXY_Q.siblingStuck, PROXY_Q.elderHouse],
  },
  {
    label: "代问事业身体",
    keys: ["工作", "病", "运势", "升职", "朋友", "身体会不会松"],
    surface: [PROXY_Q.workLove, PROXY_Q.friendHard, PROXY_Q.hisIll, PROXY_Q.partnerJob, PROXY_Q.whenHeal, PROXY_Q.promote, PROXY_Q.workOk, PROXY_Q.moneyOk, PROXY_Q.bodyEase, PROXY_Q.whenEase, PROXY_Q.safeNow, PROXY_Q.friendCrisis, PROXY_Q.coworker],
  },
  {
    label: "代问钱事",
    keys: ["借", "坑", "岗的钱", "买", "两口子钱"],
    surface: [PROXY_Q.moneyLend, PROXY_Q.moneyScam, PROXY_Q.moneyJob, PROXY_Q.moneyHouse, PROXY_Q.moneySplit],
  },
  {
    label: "代问安全",
    keys: ["住的那边", "身边那个人", "夜里", "网上", "瞒着不舒服"],
    surface: [PROXY_Q.safeStay, PROXY_Q.safePerson, PROXY_Q.safeNight, PROXY_Q.safeKid, PROXY_Q.safeNet, PROXY_Q.bodyHide, PROXY_Q.bodyWait, PROXY_Q.bodyFar],
  },
  {
    label: "开口分寸",
    keys: ["说一半", "全部实说", "瞒三天", "不想知道", "连问三次"],
    surface: [PROXY_Q.tellSoft, PROXY_Q.tellAll, PROXY_Q.tellDelay, PROXY_Q.tellGroup, PROXY_Q.tellRefuse, PROXY_Q.friendDrift, PROXY_Q.coworkerAsk, PROXY_Q.inLawAsk, PROXY_Q.exAskMore, PROXY_Q.teacherAsk, PROXY_Q.loveThird, PROXY_Q.loveMove, PROXY_Q.luckMonth, PROXY_Q.luckYearAsk, PROXY_Q.selfMix, PROXY_Q.payWho, PROXY_Q.stopAsk],
  },
  {
    label: "代问朋友",
    keys: ["朋友辞", "朋友分", "朋友搬家", "朋友借"],
    surface: [PROXY_Q.palJob, PROXY_Q.palLove2, PROXY_Q.palMove, PROXY_Q.palMoney2, PROXY_Q.palHealth, PROXY_Q.palBoss, PROXY_Q.palExam, PROXY_Q.palWedding, PROXY_Q.palScam, PROXY_Q.friendDebt, PROXY_Q.fameAsk, PROXY_Q.groupAsk],
  },
  {
    label: "代问孩子",
    keys: ["孩子闷", "园里", "不吃", "老师配合"],
    surface: [PROXY_Q.kidMood, PROXY_Q.kidFriend, PROXY_Q.kidSchool2, PROXY_Q.kidSleep, PROXY_Q.kidGift, PROXY_Q.kidFuture, PROXY_Q.kidBully, PROXY_Q.kidEat, PROXY_Q.inLawChild, PROXY_Q.teacherKid, PROXY_Q.coupleKids, PROXY_Q.timeAsk],
  },
  {
    label: "别卷进去",
    keys: ["自己的慌", "传话", "秘密", "连问三次", "录音"],
    surface: [PROXY_Q.myAnxiety, PROXY_Q.triangle, PROXY_Q.secretBet, PROXY_Q.payExpect, PROXY_Q.resultLeak, PROXY_Q.stopThird, PROXY_Q.gossipAsk, PROXY_Q.compareAsk, PROXY_Q.revengeAsk, PROXY_Q.controlAsk, PROXY_Q.farewellAsk, PROXY_Q.recordAsk],
  },
];

export const PROXY_FEATURED_SURFACE: readonly string[] = [
  PROXY_Q.luckNow, PROXY_Q.handle, PROXY_Q.comeBack, PROXY_Q.hisIll, PROXY_Q.momDad,
  PROXY_Q.stillMe, PROXY_Q.bodyEase,   PROXY_Q.tellOrNot, PROXY_Q.kid, PROXY_Q.familyThing, PROXY_Q.safeStay, PROXY_Q.tellSoft, PROXY_Q.palJob, PROXY_Q.myAnxiety,
];

export const PROXY_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: PROXY_FEATURED_SURFACE },
  { id: "luck", label: "运势", groupLabels: ["代问总势"] },
  { id: "love", label: "代问感情", groupLabels: ["代问感情"] },
  { id: "family", label: "代问家人", groupLabels: ["代问家人"] },
  { id: "work", label: "事业/身体", groupLabels: ["代问事业身体"] },
  { id: "money", label: "代问钱事", groupLabels: ["代问钱事"] },
  { id: "safe", label: "代问安全", groupLabels: ["代问安全"] },
  { id: "tell", label: "开口/分寸", groupLabels: ["开口分寸"] },
  { id: "pal", label: "代问朋友", groupLabels: ["代问朋友"] },
  { id: "kiddo", label: "代问孩子", groupLabels: ["代问孩子"] },
  { id: "mix", label: "别卷进去", groupLabels: ["别卷进去"] },
];

export const PROXY_DEFAULT_FILTER_ID = "hot";

export function proxySurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, PROXY_FILTER_TABS);
}
