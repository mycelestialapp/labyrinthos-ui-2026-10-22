/**
 * 人际关系 · 分类框架（东西方共用场景，中文成稿）。
 * 冻结核 20 条原文一字不改。
 */
import { Q_REL as T } from "./tarot-master-question-content-life-categories";
import { REL_X } from "./tarot-question-rel-extra-scenes-zh";
import { REL_Y } from "./tarot-question-rel-extra-scenes-2-zh";
import { REL_Z } from "./tarot-question-rel-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const REL_Q = {
  phone: T[0]!,
  wine: T[1]!,
  birthday: T[2]!,
  roommate: T[3]!,
  mil: T[4]!,
  toast: T[5]!,
  lend: T[6]!,
  exWedding: T[7]!,
  group: T[8]!,
  salary: T[9]!,
  crush: T[10]!,
  gossipLead: T[11]!,
  houseName: T[12]!,
  newYear: T[13]!,
  parentGroup: T[14]!,
  divorceFriend: T[15]!,
  rumor: T[16]!,
  coffee: T[17]!,
  classmateMoney: T[18]!,
  apology: T[19]!,
  ...REL_X,
  ...REL_Y,
  ...REL_Z,
} as const;

export const REL_FROZEN_CANONICAL: readonly string[] = [
  REL_Q.phone, REL_Q.wine, REL_Q.birthday, REL_Q.roommate, REL_Q.mil,
  REL_Q.toast, REL_Q.lend, REL_Q.exWedding, REL_Q.group, REL_Q.salary,
  REL_Q.crush, REL_Q.gossipLead, REL_Q.houseName, REL_Q.newYear, REL_Q.parentGroup,
  REL_Q.divorceFriend, REL_Q.rumor, REL_Q.coffee, REL_Q.classmateMoney, REL_Q.apology,
];

export const REL_FRAMEWORK_GROUPS = [
  {
    label: "关系总势",
    keys: ["人际", "卡在哪", "开口", "忍", "边界", "相处"],
    surface: [REL_Q.luckNow, REL_Q.luckYear, REL_Q.luckWhen, REL_Q.luckPatch, REL_Q.ignoreSignal, REL_Q.sayNo, REL_Q.keepDistance, REL_Q.muteChat],
  },
  {
    label: "原生家庭",
    keys: ["妈", "爸", "酒", "翻手机", "长辈", "比较", "过年", "兄弟姐妹"],
    surface: [REL_Q.phone, REL_Q.wine, REL_Q.newYear, REL_Q.inLawCall, REL_Q.siblingMoney, REL_Q.parentCompare, REL_Q.holidaySeat],
  },
  {
    label: "姻亲邻里",
    keys: ["婆婆", "带娃", "合租", "邻居", "拜访", "礼"],
    surface: [REL_Q.mil, REL_Q.roommate, REL_Q.roommateBill, REL_Q.neighborNoise, REL_Q.visitDuty, REL_Q.giftBack, REL_Q.kidsParents],
  },
  {
    label: "职场圈子",
    keys: ["小群", "工资", "领导", "同事", "咖啡", "下班局", "功劳"],
    surface: [REL_Q.group, REL_Q.salary, REL_Q.gossipLead, REL_Q.coffee, REL_Q.leaveChat, REL_Q.afterWork, REL_Q.lunchTrap, REL_Q.creditSteal],
  },
  {
    label: "钱与边界",
    keys: ["借", "钱", "担保", "突然借", "帮忙", "保密"],
    surface: [REL_Q.lend, REL_Q.classmateMoney, REL_Q.helpAgain, REL_Q.secretKeep, REL_Q.unfriend],
  },
  {
    label: "聚会场合",
    keys: ["生日", "劝酒", "前男友", "婚礼", "离婚", "请柬"],
    surface: [REL_Q.birthday, REL_Q.toast, REL_Q.exWedding, REL_Q.divorceFriend, REL_Q.inviteEx, REL_Q.groupShame],
  },
  {
    label: "修复道歉",
    keys: ["道歉", "谣言", "闺蜜", "婚房", "家长群", "传话"],
    surface: [REL_Q.apology, REL_Q.rumor, REL_Q.crush, REL_Q.houseName, REL_Q.parentGroup, REL_Q.gossipMe, REL_Q.publicFight, REL_Q.thirdPerson, REL_Q.reconnect],
  },
  {
    label: "友情去留",
    keys: ["朋友", "放鸽子", "淡了", "只在有事", "最后一面"],
    surface: [REL_Q.friendDrift, REL_Q.triangleFriend, REL_Q.cancelPlan, REL_Q.overShare, REL_Q.borrowTime, REL_Q.plusOne, REL_Q.introFriend, REL_Q.lastMeet, REL_Q.apologyWait, REL_Q.copyStyle],
  },
  {
    label: "网络群聊",
    keys: ["动态", "静音", "评论", "取关", "群", "已读", "语音"],
    surface: [REL_Q.storyWatch, REL_Q.muteOne, REL_Q.commentWar, REL_Q.followBack, REL_Q.groupKick, REL_Q.readMsg, REL_Q.voiceNote, REL_Q.lateNight, REL_Q.publicTag],
  },
  {
    label: "边界被踩",
    keys: ["上门", "礼", "时间", "玩笑", "合住", "人情", "AA"],
    surface: [REL_Q.dropBy, REL_Q.compareGift, REL_Q.parentTalk, REL_Q.timeSuck, REL_Q.jokeHurt, REL_Q.seatLeave, REL_Q.oldDebt, REL_Q.sharedHouse, REL_Q.keepSecret, REL_Q.elderRank, REL_Q.moneyPool],
  },
  {
    label: "合租同居",
    keys: ["合租", "冰箱", "钥匙", "家务", "过夜"],
    surface: [REL_Q.choreChart, REL_Q.fridgeSteal, REL_Q.loverStay, REL_Q.quietHours, REL_Q.depositSplit, REL_Q.keysCopy, REL_Q.roommatePet, REL_Q.billsApp, REL_Q.guestKey, REL_Q.bathroom, REL_Q.neighborCam, REL_Q.elevator],
  },
  {
    label: "同学旧识",
    keys: ["同学", "旧识", "老师", "校友", "群"],
    surface: [REL_Q.classReunion, REL_Q.oldCrush, REL_Q.teacherAsk, REL_Q.alumniMoney, REL_Q.yearbook, REL_Q.transferFriend, REL_Q.oldGroup, REL_Q.mentorAsk, REL_Q.reunionEx, REL_Q.dormBack, REL_Q.classChat, REL_Q.plusSeat],
  },
  {
    label: "当众面子",
    keys: ["当众", "敬酒", "合影", "主位", "直播"],
    surface: [REL_Q.toastForce, REL_Q.speechAsk, REL_Q.photoTag, REL_Q.seatHonor, REL_Q.giftOpen, REL_Q.nameWrong, REL_Q.gossipTable, REL_Q.clapFake, REL_Q.publicCry, REL_Q.toastSkip, REL_Q.weddingSeat, REL_Q.liveStream],
  },
];

export const REL_FEATURED_SURFACE: readonly string[] = [
  REL_Q.luckNow, REL_Q.phone, REL_Q.sayNo, REL_Q.lend, REL_Q.group,
  REL_Q.apology, REL_Q.mil, REL_Q.unfriend, REL_Q.toast, REL_Q.houseName, REL_Q.friendDrift, REL_Q.dropBy, REL_Q.choreChart, REL_Q.toastForce,
];

export const REL_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: REL_FEATURED_SURFACE },
  { id: "luck", label: "运势", groupLabels: ["关系总势"] },
  { id: "family", label: "原生家庭", groupLabels: ["原生家庭"] },
  { id: "inlaw", label: "姻亲/邻里", groupLabels: ["姻亲邻里"] },
  { id: "work", label: "职场/圈子", groupLabels: ["职场圈子"] },
  { id: "money", label: "钱/边界", groupLabels: ["钱与边界"] },
  { id: "scene", label: "聚会/场合", groupLabels: ["聚会场合"] },
  { id: "repair", label: "修复/道歉", groupLabels: ["修复道歉"] },
  { id: "friend", label: "友情/去留", groupLabels: ["友情去留"] },
  { id: "net", label: "网络/群聊", groupLabels: ["网络群聊"] },
  { id: "bound", label: "边界/被踩", groupLabels: ["边界被踩"] },
  { id: "rent", label: "合租/同居", groupLabels: ["合租同居"] },
  { id: "alumni", label: "同学/旧识", groupLabels: ["同学旧识"] },
  { id: "face", label: "当众/面子", groupLabels: ["当众面子"] },
];

export const REL_DEFAULT_FILTER_ID = "hot";

export function relSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, REL_FILTER_TABS);
}
