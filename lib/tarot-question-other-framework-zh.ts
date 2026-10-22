/**
 * 其他／综合 · 分类框架（东西方共用场景，中文成稿）。
 * 冻结核 20 条原文一字不改。
 */
import { OTHER_X } from "./tarot-question-other-extra-scenes-zh";
import { OTHER_Y } from "./tarot-question-other-extra-scenes-2-zh";
import { OTHER_Z } from "./tarot-question-other-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const OTHER_Q = {
  goOk: "这件事会顺利吗？",
  months: "接下来三个月运势如何？",
  notice: "我该注意什么？",
  year: "今年运势如何？",
  doIt: "这件事该不该做？",
  need: "我当下最需要什么？",
  timing: "时机对吗？",
  gut: "该不该相信直觉？",
  result: "这件事的结果会如何？",
  chance: "有什么机遇？",
  test: "有什么考验？",
  firstAct: "我现在最该动手做哪一件？",
  stuck: "这件事卡住的关键是什么？",
  wait: "该不该再等一等？",
  missed: "我看漏了什么？",
  howLong: "这件事会拖多久？",
  whoHelp: "谁能帮上忙？",
  worst: "最坏情况我该怎么准备？",
  near: "近期整体运势如何？",
  worth: "这件事值不值得继续投入？",
  ...OTHER_X,
  ...OTHER_Y,
  ...OTHER_Z,
} as const;

export const OTHER_FROZEN_CANONICAL: readonly string[] = [
  OTHER_Q.goOk, OTHER_Q.months, OTHER_Q.notice, OTHER_Q.year, OTHER_Q.doIt,
  OTHER_Q.need, OTHER_Q.timing, OTHER_Q.gut, OTHER_Q.result, OTHER_Q.chance,
  OTHER_Q.test, OTHER_Q.firstAct, OTHER_Q.stuck, OTHER_Q.wait, OTHER_Q.missed,
  OTHER_Q.howLong, OTHER_Q.whoHelp, OTHER_Q.worst, OTHER_Q.near, OTHER_Q.worth,
];

export const OTHER_FRAMEWORK_GROUPS = [
  {
    label: "成败时机",
    keys: ["顺利", "成", "时机", "结果", "投入", "该不该做"],
    surface: [OTHER_Q.goOk, OTHER_Q.doIt, OTHER_Q.timing, OTHER_Q.result, OTHER_Q.wait, OTHER_Q.worth, OTHER_Q.sayNoNow, OTHER_Q.keepGo, OTHER_Q.lastTry, OTHER_Q.closeChapter],
  },
  {
    label: "运势阶段",
    keys: ["三个月", "近期", "今年", "接下来", "拖"],
    surface: [OTHER_Q.luckNow, OTHER_Q.luckYear, OTHER_Q.luckWhen, OTHER_Q.months, OTHER_Q.year, OTHER_Q.howLong, OTHER_Q.near, OTHER_Q.monthPath, OTHER_Q.yearTheme],
  },
  {
    label: "当下行动",
    keys: ["注意", "需要", "最该", "机遇", "考验", "看漏", "准备"],
    surface: [OTHER_Q.luckPatch, OTHER_Q.ignoreSignal, OTHER_Q.notice, OTHER_Q.need, OTHER_Q.chance, OTHER_Q.test, OTHER_Q.firstAct, OTHER_Q.stuck, OTHER_Q.missed, OTHER_Q.whoHelp, OTHER_Q.worst, OTHER_Q.startSmall, OTHER_Q.whoAsk, OTHER_Q.riskPrep, OTHER_Q.missedClue, OTHER_Q.helpTake, OTHER_Q.newChance, OTHER_Q.testNow, OTHER_Q.stuckWhy, OTHER_Q.redoPlan, OTHER_Q.tellTruth, OTHER_Q.onePerson],
  },
  {
    label: "直觉卡住",
    keys: ["直觉", "再等", "休息"],
    surface: [OTHER_Q.gut, OTHER_Q.timingGut, OTHER_Q.waitMore, OTHER_Q.restFirst],
  },
  {
    label: "人脉资源",
    keys: ["先找", "引荐", "拉一个人", "自己扛"],
    surface: [OTHER_Q.whoFirst, OTHER_Q.whoAvoid, OTHER_Q.introAsk, OTHER_Q.teamUp, OTHER_Q.goAlone],
  },
  {
    label: "收尾复盘",
    keys: ["收尾", "复盘", "删", "道谢", "对不起"],
    surface: [OTHER_Q.closeLoop, OTHER_Q.reviewWhy, OTHER_Q.archive, OTHER_Q.thankYou, OTHER_Q.sorryLate],
  },
  {
    label: "风险底线",
    keys: ["必须停", "备选", "最坏", "体面离开", "再投"],
    surface: [OTHER_Q.lineDraw, OTHER_Q.backup, OTHER_Q.insurance, OTHER_Q.tellRisk, OTHER_Q.walkAway, OTHER_Q.smallWin, OTHER_Q.pauseDay, OTHER_Q.moneyCap, OTHER_Q.timeCap, OTHER_Q.energyCap, OTHER_Q.publicNow, OTHER_Q.privateNow, OTHER_Q.copyPath, OTHER_Q.waitSign, OTHER_Q.twoFront, OTHER_Q.oldPromise, OTHER_Q.newInfo, OTHER_Q.gutNo, OTHER_Q.lastCall2, OTHER_Q.enoughGood],
  },
  {
    label: "等待窗口",
    keys: ["再等", "已读不回", "窗口", "号排到了"],
    surface: [OTHER_Q.waitWeek, OTHER_Q.waitReply, OTHER_Q.waitSeason, OTHER_Q.waitMoney, OTHER_Q.waitLouder, OTHER_Q.waitCrowd, OTHER_Q.waitQueue, OTHER_Q.waitNight, OTHER_Q.waitKid, OTHER_Q.waitBoss, OTHER_Q.waitDoor, OTHER_Q.waitAge],
  },
  {
    label: "信息看漏",
    keys: ["垃圾箱", "未接", "小字", "附件", "版本"],
    surface: [OTHER_Q.missMail, OTHER_Q.missCall, OTHER_Q.missMeet, OTHER_Q.missClause, OTHER_Q.missName, OTHER_Q.missFile, OTHER_Q.infoDump, OTHER_Q.infoRumor, OTHER_Q.infoOld, OTHER_Q.missAlarm, OTHER_Q.missMap, OTHER_Q.waitHealth],
  },
  {
    label: "求助拒绝",
    keys: ["开口求助", "别人要帮", "第三次", "说不"],
    surface: [OTHER_Q.askHelp, OTHER_Q.refuseHelp, OTHER_Q.helpWrong, OTHER_Q.helpAgain, OTHER_Q.helpPublic, OTHER_Q.helpSilent, OTHER_Q.helpPay, OTHER_Q.helpTime, OTHER_Q.helpSkill, OTHER_Q.helpTeam, OTHER_Q.helpNo, OTHER_Q.waitPerfect],
  },
];

export const OTHER_FEATURED_SURFACE: readonly string[] = [
  OTHER_Q.luckNow, OTHER_Q.goOk, OTHER_Q.doIt, OTHER_Q.firstAct, OTHER_Q.stuck,
  OTHER_Q.timing,   OTHER_Q.gut, OTHER_Q.worth, OTHER_Q.notice, OTHER_Q.months, OTHER_Q.lineDraw, OTHER_Q.whoFirst, OTHER_Q.waitWeek, OTHER_Q.askHelp,
];

export const OTHER_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: OTHER_FEATURED_SURFACE },
  { id: "end", label: "成败/时机", groupLabels: ["成败时机"] },
  { id: "luck", label: "运势/阶段", groupLabels: ["运势阶段"] },
  { id: "act", label: "当下行动", groupLabels: ["当下行动"] },
  { id: "gut", label: "直觉/卡住", groupLabels: ["直觉卡住"] },
  { id: "people", label: "人脉/资源", groupLabels: ["人脉资源"] },
  { id: "close", label: "收尾/复盘", groupLabels: ["收尾复盘"] },
  { id: "risk", label: "风险/底线", groupLabels: ["风险底线"] },
  { id: "wait", label: "等待/窗口", groupLabels: ["等待窗口"] },
  { id: "miss", label: "信息/看漏", groupLabels: ["信息看漏"] },
  { id: "help", label: "求助/拒绝", groupLabels: ["求助拒绝"] },
];

export const OTHER_DEFAULT_FILTER_ID = "hot";

export function otherSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, OTHER_FILTER_TABS);
}
