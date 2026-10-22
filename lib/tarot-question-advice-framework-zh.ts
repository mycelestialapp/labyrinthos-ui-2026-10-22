/**
 * 人生建议 · 分类框架（东西方共用场景，中文成稿）。
 * 冻结核 20 条原文一字不改。
 */
import { ADVICE_X } from "./tarot-question-advice-extra-scenes-zh";
import { ADVICE_Y } from "./tarot-question-advice-extra-scenes-2-zh";
import { ADVICE_Z } from "./tarot-question-advice-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const ADVICE_Q = {
  theme: "我人生当前阶段的主旋律是什么？",
  chapter: "如果把过去几年的人生视为一部电影，现在正处在怎样的章节？",
  expect: "在「别人期待我成为谁」和「我真正想成为谁」之间，我目前站在什么位置？",
  three: "现在最需要被我认真对待的三个优先事项是什么？",
  values: "面对重大选择时，我如何让决定更贴近自己的价值观？",
  calling: "有哪件一直想做却反复拖延的事，其实象征着更深的人生召唤？",
  futureMe: "如果未来的「理想版自己」来给我提一个当下建议，他／她会说什么？",
  regret: "在有限的生命时间里，我最不想留下的遗憾是什么？",
  meaning: "我的人生是否在朝着某个有意义的方向前进？",
  version: "我是否在活出自己想要的版本，还是活成了别人期待的样子？",
  cross: "人生的这个十字路口，有哪些路是通往安全的，哪些是通往真实的？",
  ready: "我如何知道自己已经准备好进入下一个人生阶段？",
  epitaph: "如果我今天必须写下墓志铭，我希望上面写什么？",
  nowFuture: "我如何平衡「活在当下」和「规划未来」？",
  five: "如果生命只剩五年，我会如何重新安排生活？",
  alive: "什么让我感到真正活着，而不是只是在过日子？",
  thanWin: "我的人生中，什么比成功更重要？",
  busy: "我是否在用忙碌逃避某个更深的人生问题？",
  drop: "当下我最该放下的是什么？",
  cosmos: "宇宙此刻最想让我看见的人生方向是什么？",
  ...ADVICE_X,
  ...ADVICE_Y,
  ...ADVICE_Z,
} as const;

export const ADVICE_FROZEN_CANONICAL: readonly string[] = [
  ADVICE_Q.theme, ADVICE_Q.chapter, ADVICE_Q.expect, ADVICE_Q.three, ADVICE_Q.values,
  ADVICE_Q.calling, ADVICE_Q.futureMe, ADVICE_Q.regret, ADVICE_Q.meaning, ADVICE_Q.version,
  ADVICE_Q.cross, ADVICE_Q.ready, ADVICE_Q.epitaph, ADVICE_Q.nowFuture, ADVICE_Q.five,
  ADVICE_Q.alive, ADVICE_Q.thanWin, ADVICE_Q.busy, ADVICE_Q.drop, ADVICE_Q.cosmos,
];

export const ADVICE_FRAMEWORK_GROUPS = [
  {
    label: "阶段版本",
    keys: ["主旋律", "章节", "期待", "版本", "方向", "角色"],
    surface: [ADVICE_Q.luckNow, ADVICE_Q.luckYear, ADVICE_Q.luckWhen, ADVICE_Q.theme, ADVICE_Q.chapter, ADVICE_Q.expect, ADVICE_Q.meaning, ADVICE_Q.version, ADVICE_Q.trueSelf, ADVICE_Q.audience, ADVICE_Q.stopPretend, ADVICE_Q.oldStory],
  },
  {
    label: "选择遗憾",
    keys: ["优先", "价值观", "召唤", "遗憾", "十字路口", "墓志铭"],
    surface: [ADVICE_Q.luckPatch, ADVICE_Q.three, ADVICE_Q.values, ADVICE_Q.calling, ADVICE_Q.futureMe, ADVICE_Q.regret, ADVICE_Q.cross, ADVICE_Q.epitaph, ADVICE_Q.safeVsReal, ADVICE_Q.regretStop, ADVICE_Q.delayCall, ADVICE_Q.futureMeAsk, ADVICE_Q.oneYes],
  },
  {
    label: "时间意义",
    keys: ["五年", "活着", "成功", "规划", "下一阶段"],
    surface: [ADVICE_Q.ready, ADVICE_Q.nowFuture, ADVICE_Q.five, ADVICE_Q.alive, ADVICE_Q.thanWin, ADVICE_Q.nextReady, ADVICE_Q.todayLive, ADVICE_Q.fiveYear, ADVICE_Q.aliveFeel, ADVICE_Q.moreThanWin, ADVICE_Q.enoughNow],
  },
  {
    label: "放下方向",
    keys: ["忙碌", "放下", "宇宙", "扎根"],
    surface: [ADVICE_Q.ignoreSignal, ADVICE_Q.busy, ADVICE_Q.drop, ADVICE_Q.cosmos, ADVICE_Q.putDown, ADVICE_Q.stayOrGo, ADVICE_Q.askBody, ADVICE_Q.helpAccept, ADVICE_Q.direction],
  },
  {
    label: "工作意义",
    keys: ["工作", "身份", "手艺", "头衔"],
    surface: [ADVICE_Q.jobMean, ADVICE_Q.jobLeave, ADVICE_Q.jobStay, ADVICE_Q.craftKeep, ADVICE_Q.titleDrop, ADVICE_Q.endWork],
  },
  {
    label: "关系章节",
    keys: ["这段关系", "这圈朋友", "家里人", "独自", "新的人"],
    surface: [ADVICE_Q.loveChap, ADVICE_Q.friendChap, ADVICE_Q.familyChap, ADVICE_Q.aloneChap, ADVICE_Q.meetChap, ADVICE_Q.homeBase, ADVICE_Q.childLife],
  },
  {
    label: "身体节奏",
    keys: ["身体跟不跟得上", "休耕", "睡眠", "换季"],
    surface: [ADVICE_Q.bodyPace, ADVICE_Q.restSeason, ADVICE_Q.sportBack, ADVICE_Q.ageBody, ADVICE_Q.sleepLife, ADVICE_Q.travelLife, ADVICE_Q.moneyLife, ADVICE_Q.dailyRite, ADVICE_Q.noAudience, ADVICE_Q.yesCost, ADVICE_Q.noPractice, ADVICE_Q.seasonAsk, ADVICE_Q.mentor, ADVICE_Q.student, ADVICE_Q.legacy, ADVICE_Q.forgiveSelf, ADVICE_Q.beginAgain],
  },
  {
    label: "金钱证明",
    keys: ["收入证明", "过得省", "账上够了", "谈钱"],
    surface: [ADVICE_Q.provePay, ADVICE_Q.cheapLife, ADVICE_Q.richEmpty, ADVICE_Q.giftSelf, ADVICE_Q.inheritWait, ADVICE_Q.charityAsk, ADVICE_Q.salaryMe, ADVICE_Q.sideProof, ADVICE_Q.debtIdentity, ADVICE_Q.moneyTalk, ADVICE_Q.poorFriend, ADVICE_Q.fameNone],
  },
  {
    label: "孤独空白",
    keys: ["一个人吃饭", "假日空白", "人堆里", "家里太静"],
    surface: [ADVICE_Q.aloneDinner, ADVICE_Q.weekendBlank, ADVICE_Q.noText, ADVICE_Q.crowdLonely, ADVICE_Q.petTalk, ADVICE_Q.holidayAlone, ADVICE_Q.soloTrip, ADVICE_Q.quietHouse, ADVICE_Q.newCityZero, ADVICE_Q.smallJoy, ADVICE_Q.dawnAsk, ADVICE_Q.ageNumber],
  },
  {
    label: "终局留下",
    keys: ["一封信", "遗物", "手艺", "愿望清单"],
    surface: [ADVICE_Q.lastLetter, ADVICE_Q.stuffKeep, ADVICE_Q.storyTell, ADVICE_Q.treePlant, ADVICE_Q.nameStone, ADVICE_Q.forgiveList, ADVICE_Q.hospitalVisit, ADVICE_Q.photoBox, ADVICE_Q.skillPass, ADVICE_Q.apologyLate, ADVICE_Q.bucketStop, ADVICE_Q.graveVisit2],
  },
];

export const ADVICE_FEATURED_SURFACE: readonly string[] = [
  ADVICE_Q.luckNow, ADVICE_Q.theme, ADVICE_Q.expect, ADVICE_Q.three, ADVICE_Q.cross,
  ADVICE_Q.busy,   ADVICE_Q.drop, ADVICE_Q.five, ADVICE_Q.alive, ADVICE_Q.cosmos, ADVICE_Q.jobMean, ADVICE_Q.bodyPace, ADVICE_Q.provePay, ADVICE_Q.aloneDinner,
];

export const ADVICE_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: ADVICE_FEATURED_SURFACE },
  { id: "stage", label: "阶段/版本", groupLabels: ["阶段版本"] },
  { id: "choice", label: "选择/遗憾", groupLabels: ["选择遗憾"] },
  { id: "time", label: "时间/意义", groupLabels: ["时间意义"] },
  { id: "drop", label: "放下/方向", groupLabels: ["放下方向"] },
  { id: "work", label: "工作/意义", groupLabels: ["工作意义"] },
  { id: "rel", label: "关系/章节", groupLabels: ["关系章节"] },
  { id: "body", label: "身体/节奏", groupLabels: ["身体节奏"] },
  { id: "prove", label: "金钱/证明", groupLabels: ["金钱证明"] },
  { id: "solo", label: "孤独/空白", groupLabels: ["孤独空白"] },
  { id: "last", label: "终局/留下", groupLabels: ["终局留下"] },
];

export const ADVICE_DEFAULT_FILTER_ID = "hot";

export function adviceSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, ADVICE_FILTER_TABS);
}
