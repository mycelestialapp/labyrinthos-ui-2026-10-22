/**
 * 占梦境 · 分类框架（东西方共用场景，中文成稿）。
 * 冻结核 20 条原文一字不改。
 */
import { DREAM_X } from "./tarot-question-dream-extra-scenes-zh";
import { DREAM_Y } from "./tarot-question-dream-extra-scenes-2-zh";
import { DREAM_Z } from "./tarot-question-dream-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const DREAM_Q = {
  mean: "这个梦代表什么意思？",
  fight: "梦到吵架／打架代表什么？",
  nightmare: "噩梦有什么寓意？",
  same: "反复做同一个梦代表什么？",
  snake: "梦到蛇代表什么？",
  deadKin: "梦到去世的亲人代表什么？",
  teeth: "梦到掉牙代表什么？",
  pregnant: "梦到怀孕／生孩子代表什么？",
  waterFire: "梦到水／火代表什么？",
  chased: "梦到被追代表什么？",
  exam: "梦到考试代表什么？",
  marry: "梦到结婚代表什么？",
  death: "梦到死亡代表什么？",
  animal: "梦到动物代表什么？",
  fly: "梦到飞代表什么？",
  money: "梦到钱／捡钱代表什么？",
  house: "梦到房子代表什么？",
  luck: "梦是吉是凶？",
  notice: "这个梦要我注意生活里哪件事？",
  samePerson: "反复梦到同一个人代表什么？",
  ...DREAM_X,
  ...DREAM_Y,
  ...DREAM_Z,
} as const;

export const DREAM_FROZEN_CANONICAL: readonly string[] = [
  DREAM_Q.mean, DREAM_Q.fight, DREAM_Q.nightmare, DREAM_Q.same, DREAM_Q.snake,
  DREAM_Q.deadKin, DREAM_Q.teeth, DREAM_Q.pregnant, DREAM_Q.waterFire, DREAM_Q.chased,
  DREAM_Q.exam, DREAM_Q.marry, DREAM_Q.death, DREAM_Q.animal, DREAM_Q.fly,
  DREAM_Q.money, DREAM_Q.house, DREAM_Q.luck, DREAM_Q.notice, DREAM_Q.samePerson,
];

export const DREAM_FRAMEWORK_GROUPS = [
  {
    label: "解梦总势",
    keys: ["代表", "寓意", "预示", "吉是凶", "提醒", "反复"],
    surface: [DREAM_Q.luckNow, DREAM_Q.luckYear, DREAM_Q.luckWhen, DREAM_Q.luckPatch, DREAM_Q.ignoreSignal, DREAM_Q.mean, DREAM_Q.luck, DREAM_Q.notice, DREAM_Q.same, DREAM_Q.nightmare, DREAM_Q.nightAfter],
  },
  {
    label: "人物入梦",
    keys: ["吵架", "亲人", "结婚", "同一个人", "去世"],
    surface: [DREAM_Q.fight, DREAM_Q.deadKin, DREAM_Q.marry, DREAM_Q.samePerson, DREAM_Q.repeatPerson, DREAM_Q.weddingOdd],
  },
  {
    label: "身体焦虑",
    keys: ["掉牙", "被追", "考试", "怀孕", "赶不上", "喊不出"],
    surface: [DREAM_Q.teeth, DREAM_Q.pregnant, DREAM_Q.chased, DREAM_Q.exam, DREAM_Q.fallDown, DREAM_Q.lateArrive, DREAM_Q.lostWay, DREAM_Q.speakFail, DREAM_Q.teethLoose, DREAM_Q.chaseWho, DREAM_Q.examAgain, DREAM_Q.babyHold],
  },
  {
    label: "象征物",
    keys: ["蛇", "水", "火", "动物", "飞", "钱", "房子", "死亡", "门"],
    surface: [DREAM_Q.snake, DREAM_Q.waterFire, DREAM_Q.death, DREAM_Q.animal, DREAM_Q.fly, DREAM_Q.money, DREAM_Q.house, DREAM_Q.sameHouse, DREAM_Q.oldHome, DREAM_Q.waterDeep, DREAM_Q.fireClose, DREAM_Q.doorLock, DREAM_Q.flyHigh, DREAM_Q.moneyPick, DREAM_Q.deathVisit, DREAM_Q.animalTalk],
  },
  {
    label: "情爱入梦",
    keys: ["旧人", "亲近", "外面有人", "婚礼跑", "孩子不见"],
    surface: [DREAM_Q.exInDream, DREAM_Q.kissOdd, DREAM_Q.cheatDream, DREAM_Q.weddingRun, DREAM_Q.babyLost, DREAM_Q.bodyTouch],
  },
  {
    label: "工作学业梦",
    keys: ["交不了差", "被骂", "工位", "上台", "成绩", "表停"],
    surface: [DREAM_Q.lateWork, DREAM_Q.bossYell, DREAM_Q.deskEmpty, DREAM_Q.speechFail, DREAM_Q.gradePost, DREAM_Q.clockStop, DREAM_Q.examNaked],
  },
  {
    label: "反复预示",
    keys: ["三夜", "一次比一次", "数字", "惊醒", "讲给对方"],
    surface: [DREAM_Q.threeNights, DREAM_Q.worseEach, DREAM_Q.afterTalk, DREAM_Q.numberRepeat, DREAM_Q.wakeHeart, DREAM_Q.tellWho, DREAM_Q.lucidTry, DREAM_Q.nightmareKid, DREAM_Q.fallRepeat, DREAM_Q.teethAgain, DREAM_Q.waterRise, DREAM_Q.lockedIn, DREAM_Q.chaseFriend, DREAM_Q.deadTalk, DREAM_Q.houseCrack, DREAM_Q.moneyLostD, DREAM_Q.flyThenFall],
  },
  {
    label: "房屋空间",
    keys: ["阁楼", "地下室", "多出一间", "楼梯", "校舍"],
    surface: [DREAM_Q.atticFind, DREAM_Q.basementLock, DREAM_Q.stairsBreak, DREAM_Q.windowOut, DREAM_Q.extraRoom, DREAM_Q.wallMove, DREAM_Q.schoolHall, DREAM_Q.hospitalWait, DREAM_Q.airportMiss, DREAM_Q.theaterStage, DREAM_Q.libraryBook, DREAM_Q.marketCrowd],
  },
  {
    label: "水火坠落",
    keys: ["进水", "起火", "悬崖", "电梯", "薄冰"],
    surface: [DREAM_Q.floodHome, DREAM_Q.fireKitchen, DREAM_Q.cliffStep, DREAM_Q.elevatorDrop, DREAM_Q.iceWalk, DREAM_Q.bridgeCut, DREAM_Q.rainEndless, DREAM_Q.snowSilent, DREAM_Q.windPush, DREAM_Q.darkRoom, DREAM_Q.doorMany, DREAM_Q.packBag],
  },
  {
    label: "亡者告别",
    keys: ["去世的人", "葬礼", "遗物", "另一个我", "时间倒流"],
    surface: [DREAM_Q.graveVisit, DREAM_Q.lastWords, DREAM_Q.funeralOdd, DREAM_Q.aliveAgain, DREAM_Q.askForgive, DREAM_Q.keepObject, DREAM_Q.mirrorAge, DREAM_Q.twinMe, DREAM_Q.babyTalk, DREAM_Q.animalGuide, DREAM_Q.clockBack, DREAM_Q.stayBehind],
  },
];

export const DREAM_FEATURED_SURFACE: readonly string[] = [
  DREAM_Q.luckNow, DREAM_Q.mean, DREAM_Q.notice, DREAM_Q.same, DREAM_Q.nightmare,
  DREAM_Q.chased, DREAM_Q.teeth,   DREAM_Q.deadKin, DREAM_Q.samePerson, DREAM_Q.house, DREAM_Q.exInDream, DREAM_Q.threeNights, DREAM_Q.atticFind, DREAM_Q.graveVisit,
];

export const DREAM_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: DREAM_FEATURED_SURFACE },
  { id: "luck", label: "运势/总问", groupLabels: ["解梦总势"] },
  { id: "people", label: "人物入梦", groupLabels: ["人物入梦"] },
  { id: "body", label: "身体/焦虑", groupLabels: ["身体焦虑"] },
  { id: "symbol", label: "象征物", groupLabels: ["象征物"] },
  { id: "love", label: "情爱入梦", groupLabels: ["情爱入梦"] },
  { id: "work", label: "工作/学业梦", groupLabels: ["工作学业梦"] },
  { id: "repeat", label: "反复/预示", groupLabels: ["反复预示"] },
  { id: "space", label: "房屋/空间", groupLabels: ["房屋空间"] },
  { id: "fall", label: "水火/坠落", groupLabels: ["水火坠落"] },
  { id: "dead", label: "亡者/告别", groupLabels: ["亡者告别"] },
];

export const DREAM_DEFAULT_FILTER_ID = "hot";

export function dreamSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, DREAM_FILTER_TABS);
}
