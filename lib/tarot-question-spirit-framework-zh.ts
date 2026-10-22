/**
 * 灵性成长 · 分类框架（东西方共用场景，中文成稿）。
 * 冻结核 20 条原文一字不改。
 */
import { Q_SPIRIT as T } from "./tarot-master-question-content-life-categories";
import { SPIRIT_X } from "./tarot-question-spirit-extra-scenes-zh";
import { SPIRIT_Y } from "./tarot-question-spirit-extra-scenes-2-zh";
import { SPIRIT_Z } from "./tarot-question-spirit-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const SPIRIT_Q = {
  stuck: T[0]!,
  othersSee: T[1]!,
  phoneTwo: T[2]!,
  inferior: T[3]!,
  noFamily: T[4]!,
  sitPray: T[5]!,
  threeMin: T[6]!,
  fierceHome: T[7]!,
  jobless: T[8]!,
  resignDare: T[9]!,
  selfHate: T[10]!,
  jealous: T[11]!,
  noJoy: T[12]!,
  hideOracle: T[13]!,
  kindOut: T[14]!,
  retire: T[15]!,
  sideHustle: T[16]!,
  grief: T[17]!,
  muteGroup: T[18]!,
  forgive: T[19]!,
  ...SPIRIT_X,
  ...SPIRIT_Y,
  ...SPIRIT_Z,
} as const;

export const SPIRIT_FROZEN_CANONICAL: readonly string[] = [
  SPIRIT_Q.stuck, SPIRIT_Q.othersSee, SPIRIT_Q.phoneTwo, SPIRIT_Q.inferior, SPIRIT_Q.noFamily,
  SPIRIT_Q.sitPray, SPIRIT_Q.threeMin, SPIRIT_Q.fierceHome, SPIRIT_Q.jobless, SPIRIT_Q.resignDare,
  SPIRIT_Q.selfHate, SPIRIT_Q.jealous, SPIRIT_Q.noJoy, SPIRIT_Q.hideOracle, SPIRIT_Q.kindOut,
  SPIRIT_Q.retire, SPIRIT_Q.sideHustle, SPIRIT_Q.grief, SPIRIT_Q.muteGroup, SPIRIT_Q.forgive,
];

export const SPIRIT_FRAMEWORK_GROUPS = [
  {
    label: "成长总势",
    keys: ["卡在哪", "浑浑噩噩", "清明", "消耗", "白活"],
    surface: [SPIRIT_Q.luckNow, SPIRIT_Q.luckYear, SPIRIT_Q.luckWhen, SPIRIT_Q.luckPatch, SPIRIT_Q.ignoreSignal, SPIRIT_Q.stuck, SPIRIT_Q.meaningAsk, SPIRIT_Q.oneTrue, SPIRIT_Q.bodyFirst],
  },
  {
    label: "卡住眼光",
    keys: ["别人怎么看", "刷手机", "自卑", "比较", "屏幕"],
    surface: [SPIRIT_Q.othersSee, SPIRIT_Q.phoneTwo, SPIRIT_Q.inferior, SPIRIT_Q.phoneNight, SPIRIT_Q.compareStop, SPIRIT_Q.restDay],
  },
  {
    label: "家人习惯",
    keys: ["陪家人", "念经", "三分钟", "对家里人凶", "温柔"],
    surface: [SPIRIT_Q.noFamily, SPIRIT_Q.sitPray, SPIRIT_Q.threeMin, SPIRIT_Q.fierceHome, SPIRIT_Q.sitShort, SPIRIT_Q.sayKind, SPIRIT_Q.smallHabit, SPIRIT_Q.boundaryHome],
  },
  {
    label: "工作比较",
    keys: ["失业", "辞职", "起不来", "晒幸福", "空了"],
    surface: [SPIRIT_Q.jobless, SPIRIT_Q.resignDare, SPIRIT_Q.selfHate, SPIRIT_Q.jealous, SPIRIT_Q.jobEmpty, SPIRIT_Q.retireFill, SPIRIT_Q.shameOut, SPIRIT_Q.innerJudge, SPIRIT_Q.retire],
  },
  {
    label: "逃避角色",
    keys: ["不开心", "塔罗", "温柔都给了外人", "躲"],
    surface: [SPIRIT_Q.noJoy, SPIRIT_Q.hideOracle, SPIRIT_Q.kindOut, SPIRIT_Q.oracleUse, SPIRIT_Q.askHelp],
  },
  {
    label: "勇气原谅",
    keys: ["副业", "亲人", "群里", "原谅"],
    surface: [SPIRIT_Q.sideHustle, SPIRIT_Q.grief, SPIRIT_Q.muteGroup, SPIRIT_Q.forgive, SPIRIT_Q.griefRite, SPIRIT_Q.forgiveMeet, SPIRIT_Q.speakGroup, SPIRIT_Q.startShow],
  },
  {
    label: "身体先行",
    keys: ["先睡", "吃得乱", "出门走", "身体报警", "胸口"],
    surface: [SPIRIT_Q.sleepFirst, SPIRIT_Q.eatFirst, SPIRIT_Q.walkOut, SPIRIT_Q.doctorFirst, SPIRIT_Q.breathStop],
  },
  {
    label: "仪式习惯",
    keys: ["仪式", "积灰", "日记", "团体", "清晨"],
    surface: [SPIRIT_Q.ritualShort, SPIRIT_Q.altarDust, SPIRIT_Q.journalSkip, SPIRIT_Q.incense, SPIRIT_Q.groupSit, SPIRIT_Q.dawnSit, SPIRIT_Q.weekendEmpty, SPIRIT_Q.bookQuit, SPIRIT_Q.vowBreak, SPIRIT_Q.silenceDay, SPIRIT_Q.returnPractice],
  },
  {
    label: "意义方向",
    keys: ["意义", "手艺", "见证人", "从零", "功课"],
    surface: [SPIRIT_Q.meaningJob, SPIRIT_Q.meaningHome, SPIRIT_Q.meaningTalk, SPIRIT_Q.meaningArt, SPIRIT_Q.meaningServe, SPIRIT_Q.faithDoubt, SPIRIT_Q.teacherLeave, SPIRIT_Q.natureGo, SPIRIT_Q.donateNow, SPIRIT_Q.namePath, SPIRIT_Q.ageAsk, SPIRIT_Q.witness, SPIRIT_Q.envyHoly, SPIRIT_Q.endChapter],
  },
  {
    label: "哀悼放下",
    keys: ["周年", "遗物", "语音", "空位子"],
    surface: [SPIRIT_Q.griefYear, SPIRIT_Q.boxClothes, SPIRIT_Q.altarAsh, SPIRIT_Q.dateAvoid, SPIRIT_Q.voiceMail, SPIRIT_Q.emptyChair, SPIRIT_Q.candleOut, SPIRIT_Q.incenseAsk, SPIRIT_Q.closeChapter, SPIRIT_Q.beginAgain, SPIRIT_Q.weatherMood, SPIRIT_Q.volunteer],
  },
  {
    label: "社群导师",
    keys: ["圈子", "续课", "发誓", "网上这位"],
    surface: [SPIRIT_Q.groupCult, SPIRIT_Q.teacherFee, SPIRIT_Q.rankInside, SPIRIT_Q.secretOath, SPIRIT_Q.comparePath, SPIRIT_Q.leaveSangha, SPIRIT_Q.retreatPay, SPIRIT_Q.onlineGuru, SPIRIT_Q.donation, SPIRIT_Q.praiseTrap, SPIRIT_Q.copyPractice, SPIRIT_Q.dreamSign],
  },
  {
    label: "日常微习",
    keys: ["晨间", "走路", "吃饭", "日记", "刷别人的悟"],
    surface: [SPIRIT_Q.morningSit, SPIRIT_Q.walkSlow, SPIRIT_Q.phoneDawn, SPIRIT_Q.mealSilent, SPIRIT_Q.journalGap, SPIRIT_Q.waterPlant, SPIRIT_Q.bookHalf, SPIRIT_Q.numberSync, SPIRIT_Q.animalOmen, SPIRIT_Q.nightScroll, SPIRIT_Q.guiltSkip, SPIRIT_Q.shareAwake],
  },
];

export const SPIRIT_FEATURED_SURFACE: readonly string[] = [
  SPIRIT_Q.luckNow, SPIRIT_Q.stuck, SPIRIT_Q.phoneTwo, SPIRIT_Q.fierceHome, SPIRIT_Q.hideOracle,
  SPIRIT_Q.forgive, SPIRIT_Q.jobless,   SPIRIT_Q.askHelp, SPIRIT_Q.oneTrue, SPIRIT_Q.grief, SPIRIT_Q.sleepFirst, SPIRIT_Q.ritualShort, SPIRIT_Q.griefYear, SPIRIT_Q.morningSit,
];

export const SPIRIT_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: SPIRIT_FEATURED_SURFACE },
  { id: "luck", label: "运势", groupLabels: ["成长总势"] },
  { id: "see", label: "眼光/比较", groupLabels: ["卡住眼光"] },
  { id: "home", label: "家人/习惯", groupLabels: ["家人习惯"] },
  { id: "work", label: "工作/空窗", groupLabels: ["工作比较"] },
  { id: "hide", label: "逃避/角色", groupLabels: ["逃避角色"] },
  { id: "courage", label: "勇气/原谅", groupLabels: ["勇气原谅"] },
  { id: "body", label: "身体先行", groupLabels: ["身体先行"] },
  { id: "rite", label: "仪式/习惯", groupLabels: ["仪式习惯"] },
  { id: "mean", label: "意义/方向", groupLabels: ["意义方向"] },
  { id: "grief", label: "哀悼/放下", groupLabels: ["哀悼放下"] },
  { id: "sangha", label: "社群/导师", groupLabels: ["社群导师"] },
  { id: "daily", label: "日常/微习", groupLabels: ["日常微习"] },
];

export const SPIRIT_DEFAULT_FILTER_ID = "hot";

export function spiritSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, SPIRIT_FILTER_TABS);
}
