/**
 * 生育子女 · 分类框架（东西方共用场景，中文成稿）。
 * 冻结核 20 条原文一字不改。孩子教育题留在本类。
 */
import { Q_CHILD as T } from "./tarot-master-question-content-life-categories";
import { CHILD_X } from "./tarot-question-child-extra-scenes-zh";
import { CHILD_Y } from "./tarot-question-child-extra-scenes-2-zh";
import { CHILD_Z } from "./tarot-question-child-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const CHILD_Q = {
  waitClinic: T[0]!,
  pushCall: T[1]!,
  recheck: T[2]!,
  nanny: T[3]!,
  milk: T[4]!,
  nightMilk: T[5]!,
  kindergarten: T[6]!,
  adhdMed: T[7]!,
  cram: T[8]!,
  partnerLazy: T[9]!,
  second: T[10]!,
  phoneKid: T[11]!,
  feedChase: T[12]!,
  custody: T[13]!,
  singleLate: T[14]!,
  teacherCall: T[15]!,
  district: T[16]!,
  ivf: T[17]!,
  afterCold: T[18]!,
  adopt: T[19]!,
  ...CHILD_X,
  ...CHILD_Y,
  ...CHILD_Z,
} as const;

export const CHILD_FROZEN_CANONICAL: readonly string[] = [
  CHILD_Q.waitClinic, CHILD_Q.pushCall, CHILD_Q.recheck, CHILD_Q.nanny, CHILD_Q.milk,
  CHILD_Q.nightMilk, CHILD_Q.kindergarten, CHILD_Q.adhdMed, CHILD_Q.cram, CHILD_Q.partnerLazy,
  CHILD_Q.second, CHILD_Q.phoneKid, CHILD_Q.feedChase, CHILD_Q.custody, CHILD_Q.singleLate,
  CHILD_Q.teacherCall, CHILD_Q.district, CHILD_Q.ivf, CHILD_Q.afterCold, CHILD_Q.adopt,
];

export const CHILD_FRAMEWORK_GROUPS = [
  {
    label: "生育总势",
    keys: ["带孩子", "养育", "生育", "松一口气", "信号", "对齐"],
    surface: [CHILD_Q.luckNow, CHILD_Q.luckYear, CHILD_Q.luckWhen, CHILD_Q.luckPatch, CHILD_Q.ignoreSignal, CHILD_Q.partnerSync],
  },
  {
    label: "备孕产检",
    keys: ["备孕", "怀孕", "催生", "产检", "复查", "周期", "生产方式"],
    surface: [CHILD_Q.waitClinic, CHILD_Q.pushCall, CHILD_Q.recheck, CHILD_Q.tryAgain, CHILD_Q.clinicGo, CHILD_Q.tellFamily, CHILD_Q.bedRest, CHILD_Q.birthPlan, CHILD_Q.bodyBack],
  },
  {
    label: "喂养睡眠",
    keys: ["奶", "夜奶", "月嫂", "喂", "夜里", "睡"],
    surface: [CHILD_Q.nanny, CHILD_Q.milk, CHILD_Q.nightMilk, CHILD_Q.feedFight, CHILD_Q.nightShift, CHILD_Q.sleepTrain, CHILD_Q.feedChase],
  },
  {
    label: "二胎分工",
    keys: ["二胎", "不想生", "甩手", "帮忙", "假"],
    surface: [CHILD_Q.second, CHILD_Q.partnerLazy, CHILD_Q.secondKid, CHILD_Q.helpAsk, CHILD_Q.leaveWork],
  },
  {
    label: "教育相处",
    keys: ["幼儿园", "老师", "补习", "手机", "学区", "坐不住", "交友", "课外"],
    surface: [CHILD_Q.kindergarten, CHILD_Q.adhdMed, CHILD_Q.cram, CHILD_Q.phoneKid, CHILD_Q.teacherCall, CHILD_Q.district, CHILD_Q.sitStill, CHILD_Q.medWho, CHILD_Q.dropClass, CHILD_Q.screenRule, CHILD_Q.teacherMeet, CHILD_Q.nameSchool, CHILD_Q.friendWorry],
  },
  {
    label: "抚养单亲",
    keys: ["抚养", "单亲", "探视", "迟到"],
    surface: [CHILD_Q.custody, CHILD_Q.singleLate, CHILD_Q.custodyNow, CHILD_Q.visitDay],
  },
  {
    label: "试管领养",
    keys: ["试管", "领养", "积蓄", "冷淡"],
    surface: [CHILD_Q.ivf, CHILD_Q.adopt, CHILD_Q.afterCold, CHILD_Q.adoptWait, CHILD_Q.clinicMoney],
  },
  {
    label: "产后恢复",
    keys: ["生完", "伤口", "奶", "亲近", "掉发", "身子"],
    surface: [CHILD_Q.bodySlow, CHILD_Q.woundCare, CHILD_Q.nightSweat, CHILD_Q.wantClose, CHILD_Q.milkDown, CHILD_Q.hairMood, CHILD_Q.partnerNight],
  },
  {
    label: "长辈插手",
    keys: ["长辈", "老人", "两家", "名字", "瞒", "抢抱"],
    surface: [CHILD_Q.visitLong, CHILD_Q.buyStuff, CHILD_Q.sleepRule, CHILD_Q.pickName, CHILD_Q.hideClinic, CHILD_Q.holdBaby, CHILD_Q.twoHome],
  },
  {
    label: "孩子安全",
    keys: ["接送", "烫", "吃了就不对", "印", "人堆", "照片", "外号"],
    surface: [CHILD_Q.pickupWho, CHILD_Q.playSafe, CHILD_Q.hotNight, CHILD_Q.foodReject, CHILD_Q.bullyHint, CHILD_Q.lostSight, CHILD_Q.carSeat, CHILD_Q.allergyCare, CHILD_Q.napFight, CHILD_Q.shareToy, CHILD_Q.wetNight, CHILD_Q.teethBite, CHILD_Q.firstLeave, CHILD_Q.photoNet, CHILD_Q.nameCall, CHILD_Q.moneyKid],
  },
  {
    label: "入园适应",
    keys: ["入园", "接园", "午睡", "校车", "评价"],
    surface: [CHILD_Q.firstWeek, CHILD_Q.latePickup, CHILD_Q.extraPay, CHILD_Q.allergyMenu, CHILD_Q.napForce, CHILD_Q.shoeLost, CHILD_Q.pottyOut, CHILD_Q.shoeOn, CHILD_Q.rainSchool, CHILD_Q.busKid, CHILD_Q.reportCard, CHILD_Q.friendHome],
  },
  {
    label: "钱与育儿",
    keys: ["配方", "看护费", "随礼", "兴趣班", "育儿账"],
    surface: [CHILD_Q.formulaCost, CHILD_Q.gearPile, CHILD_Q.nannyFee, CHILD_Q.insuranceKid, CHILD_Q.redPacket, CHILD_Q.cutClassFee, CHILD_Q.twoLang, CHILD_Q.snackBribe, CHILD_Q.summerCamp, CHILD_Q.moneyFight, CHILD_Q.birthDay, CHILD_Q.hairCut],
  },
  {
    label: "夜间崩溃",
    keys: ["夜里哭", "凌晨醒", "夜惊", "发烧", "断奶"],
    surface: [CHILD_Q.nightCry, CHILD_Q.clockThree, CHILD_Q.spitNight, CHILD_Q.feverLoop, CHILD_Q.teethNight, CHILD_Q.dreamScare, CHILD_Q.milkDawn, CHILD_Q.partnerSleep, CHILD_Q.shotDay, CHILD_Q.grandTv, CHILD_Q.parkFight, CHILD_Q.lostMall],
  },
];

export const CHILD_FEATURED_SURFACE: readonly string[] = [
  CHILD_Q.luckNow, CHILD_Q.waitClinic, CHILD_Q.nightMilk, CHILD_Q.adhdMed, CHILD_Q.second,
  CHILD_Q.custody, CHILD_Q.ivf, CHILD_Q.partnerLazy, CHILD_Q.sitStill, CHILD_Q.district, CHILD_Q.bodySlow, CHILD_Q.hotNight, CHILD_Q.firstWeek, CHILD_Q.nightCry,
];

export const CHILD_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: CHILD_FEATURED_SURFACE },
  { id: "luck", label: "运势", groupLabels: ["生育总势"] },
  { id: "prep", label: "备孕/产检", groupLabels: ["备孕产检"] },
  { id: "care", label: "喂养/睡眠", groupLabels: ["喂养睡眠"] },
  { id: "two", label: "二胎/分工", groupLabels: ["二胎分工"] },
  { id: "edu", label: "教育/相处", groupLabels: ["教育相处"] },
  { id: "cust", label: "抚养/单亲", groupLabels: ["抚养单亲"] },
  { id: "path", label: "试管/领养", groupLabels: ["试管领养"] },
  { id: "post", label: "产后/恢复", groupLabels: ["产后恢复"] },
  { id: "elder", label: "长辈/插手", groupLabels: ["长辈插手"] },
  { id: "safe", label: "孩子/安全", groupLabels: ["孩子安全"] },
  { id: "kinder", label: "入园/适应", groupLabels: ["入园适应"] },
  { id: "fee", label: "钱/育儿", groupLabels: ["钱与育儿"] },
  { id: "night", label: "夜间/崩溃", groupLabels: ["夜间崩溃"] },
];

export const CHILD_DEFAULT_FILTER_ID = "hot";

export function childSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, CHILD_FILTER_TABS);
}
