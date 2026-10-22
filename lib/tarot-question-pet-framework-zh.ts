/**
 * 宠物 · 分类框架（东西方共用场景，中文成稿）。
 * 点选题写症状与取舍，不点病名。冻结核 20 条原文一字不改。
 */
import { Q_PET as T } from "./tarot-master-question-content-life-categories";
import { PET_GAP_CANONICAL as G } from "./tarot-question-hidden-chain-zh";
import { PET_X } from "./tarot-question-pet-extra-scenes-zh";
import { PET_Y } from "./tarot-question-pet-extra-scenes-2-zh";
import { PET_Z } from "./tarot-question-pet-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const PET_Q = {
  vomit: T[0]!,
  tests: T[1]!,
  vaccineBook: T[2]!,
  chewHit: T[3]!,
  aloneTrip: T[4]!,
  barkDown: T[5]!,
  neuterCheap: T[6]!,
  breedCost: T[7]!,
  boardBack: T[8]!,
  oldLimp: T[9]!,
  multiFight: T[10]!,
  foodSoft: T[11]!,
  tickPull: T[12]!,
  insureFight: T[13]!,
  newYearRoad: T[14]!,
  fishDie: T[15]!,
  strayHome: T[16]!,
  birdBald: T[17]!,
  newCat: T[18]!,
  endTreat: T[19]!,
  sick: G[0]!,
  eatBad: G[1]!,
  organ: G[2]!,
  heal: G[3]!,
  whenHeal: G[4]!,
  dogLost: G[5]!,
  lostWhere: G[6]!,
  ...PET_X,
  ...PET_Y,
  ...PET_Z,
} as const;

export const PET_FROZEN_CANONICAL: readonly string[] = [
  PET_Q.vomit,
  PET_Q.tests,
  PET_Q.vaccineBook,
  PET_Q.chewHit,
  PET_Q.aloneTrip,
  PET_Q.barkDown,
  PET_Q.neuterCheap,
  PET_Q.breedCost,
  PET_Q.boardBack,
  PET_Q.oldLimp,
  PET_Q.multiFight,
  PET_Q.foodSoft,
  PET_Q.tickPull,
  PET_Q.insureFight,
  PET_Q.newYearRoad,
  PET_Q.fishDie,
  PET_Q.strayHome,
  PET_Q.birdBald,
  PET_Q.newCat,
  PET_Q.endTreat,
];

export const PET_FRAMEWORK_GROUPS = [
  {
    label: "宠物总势",
    keys: ["它现在", "生病", "治好", "不吃", "器官", "信号", "松下来"],
    surface: [
      PET_Q.luckNow,
      PET_Q.luckYear,
      PET_Q.luckWhen,
      PET_Q.luckPatch,
      PET_Q.ignoreSignal,
      PET_Q.sick,
      PET_Q.eatBad,
      PET_Q.organ,
      PET_Q.heal,
      PET_Q.whenHeal,
    ],
  },
  {
    label: "就医检查",
    keys: ["吐", "医院", "检查", "疫苗", "蜱", "送", "第二意见", "呼吸", "不吃"],
    surface: [
      PET_Q.vomit,
      PET_Q.tests,
      PET_Q.vaccineBook,
      PET_Q.tickPull,
      PET_Q.oldLimp,
      PET_Q.nightEr,
      PET_Q.secondVet,
      PET_Q.eatSkip,
      PET_Q.drinkSkip,
      PET_Q.limpWorse,
      PET_Q.breatheOdd,
      PET_Q.hidePain,
      PET_Q.afterProc,
      PET_Q.treatCost,
    ],
  },
  {
    label: "行为看护",
    keys: ["咬", "出差", "狗叫", "训", "独留", "定点", "遛"],
    surface: [
      PET_Q.chewHit,
      PET_Q.aloneTrip,
      PET_Q.barkDown,
      PET_Q.crateGo,
      PET_Q.walkRefuse,
      PET_Q.sepHowl,
      PET_Q.litterMiss,
      PET_Q.chewNight,
      PET_Q.neighbor,
      PET_Q.aloneHours,
    ],
  },
  {
    label: "绝育合宠",
    keys: ["绝育", "配种", "寄养", "多宠", "新猫", "合宠", "隔离"],
    surface: [
      PET_Q.neuterCheap,
      PET_Q.breedCost,
      PET_Q.boardBack,
      PET_Q.multiFight,
      PET_Q.newCat,
      PET_Q.addSecond,
      PET_Q.introFail,
      PET_Q.rehome,
    ],
  },
  {
    label: "粮行保险",
    keys: ["粮", "软便", "保险", "春节", "搬家", "住", "换粮"],
    surface: [
      PET_Q.foodSoft,
      PET_Q.insureFight,
      PET_Q.newYearRoad,
      PET_Q.foodSwitch,
      PET_Q.claimFight,
      PET_Q.moveHouse,
      PET_Q.hotelPet,
    ],
  },
  {
    label: "走失寻找",
    keys: ["走丢", "走失", "找回", "往哪找", "寻宠", "芯片", "启事"],
    surface: [
      PET_Q.dogLost,
      PET_Q.lostWhere,
      PET_Q.chipLost,
      PET_Q.poster,
      PET_Q.indoorOut,
      PET_Q.stolen,
      PET_Q.comeBack,
      PET_Q.giveUp,
    ],
  },
  {
    label: "领养临终",
    keys: ["捡", "流浪", "治不好", "继续治", "少受罪", "鹦鹉", "鱼", "领养"],
    surface: [
      PET_Q.strayHome,
      PET_Q.birdBald,
      PET_Q.fishDie,
      PET_Q.endTreat,
      PET_Q.quality,
      PET_Q.howLong,
      PET_Q.adoptHome,
      PET_Q.shelterWait,
      PET_Q.fishTank,
      PET_Q.birdPull,
    ],
  },
  {
    label: "用药术后",
    keys: ["药", "伤口", "头套", "漏喂", "发热", "抓", "甩头", "眼睛", "咳"],
    surface: [
      PET_Q.medKeep, PET_Q.stitchLick, PET_Q.coneOff, PET_Q.followDose, PET_Q.feverAfter, PET_Q.limpAfter,
      PET_Q.itchNight, PET_Q.earShake, PET_Q.eyeGunk, PET_Q.peeOut, PET_Q.coughNight, PET_Q.bloated,
    ],
  },
  {
    label: "训练社交",
    keys: ["训练", "日托", "扑人", "牵引", "客人", "发情", "洗澡", "指甲"],
    surface: [
      PET_Q.classGo, PET_Q.daycare, PET_Q.recallFail, PET_Q.jumpPeople, PET_Q.leashPull, PET_Q.guestBite,
      PET_Q.heatSeason, PET_Q.bathNow, PET_Q.nailCut, PET_Q.teethSmell, PET_Q.weightDown, PET_Q.waterBowl,
    ],
  },
  {
    label: "费用取舍",
    keys: ["报价", "分期", "众筹", "疫苗", "便宜粮", "加收", "检查费"],
    surface: [
      PET_Q.quoteShock, PET_Q.payPlan, PET_Q.donateCare, PET_Q.skipVax, PET_Q.cheapFood, PET_Q.nightFee,
    ],
  },
  {
    label: "幼体老年",
    keys: ["幼", "老年", "分窝", "台阶", "夜里喘"],
    surface: [
      PET_Q.pupEat, PET_Q.pupBite, PET_Q.pupAlone, PET_Q.oldStairs, PET_Q.oldNight, PET_Q.oldEat,
      PET_Q.litterBorn, PET_Q.weanWhen, PET_Q.oldTeeth, PET_Q.youngVac, PET_Q.nestMove, PET_Q.adoptOld,
    ],
  },
  {
    label: "异宠水族",
    keys: ["缸", "异宠", "兔", "鱼", "叫"],
    surface: [
      PET_Q.tankCycle, PET_Q.tankCrash, PET_Q.birdScream, PET_Q.reptileHide, PET_Q.rabbitChew, PET_Q.fishNew,
      PET_Q.waterChange, PET_Q.twoBowls, PET_Q.catTree, PET_Q.nightHowl, PET_Q.returnPet, PET_Q.microchip,
    ],
  },
  {
    label: "寄养隔离",
    keys: ["寄养", "隔离", "托运", "监控", "遛"],
    surface: [
      PET_Q.boardPick, PET_Q.boardCam, PET_Q.isoDays, PET_Q.fosterOut, PET_Q.hotelCage, PET_Q.flightPet,
      PET_Q.rainWalk, PET_Q.heatOut, PET_Q.snowPaw, PET_Q.sitterFail, PET_Q.camWatch, PET_Q.leashLaw,
    ],
  },
];

export const PET_FEATURED_SURFACE: readonly string[] = [
  PET_Q.luckNow,
  PET_Q.vomit,
  PET_Q.heal,
  PET_Q.dogLost,
  PET_Q.tests,
  PET_Q.endTreat,
  PET_Q.aloneTrip,
  PET_Q.strayHome,
  PET_Q.eatSkip,
  PET_Q.multiFight,
  PET_Q.medKeep,
  PET_Q.quoteShock,
  PET_Q.pupEat,
  PET_Q.boardPick,
];

export const PET_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: PET_FEATURED_SURFACE },
  { id: "luck", label: "运势", groupLabels: ["宠物总势"] },
  { id: "vet", label: "就医/检查", groupLabels: ["就医检查"] },
  { id: "behave", label: "行为/看护", groupLabels: ["行为看护"] },
  { id: "pack", label: "绝育/合宠", groupLabels: ["绝育合宠"] },
  { id: "daily", label: "粮行/保险", groupLabels: ["粮行保险"] },
  { id: "lost", label: "走失/寻找", groupLabels: ["走失寻找"] },
  { id: "life", label: "领养/临终", groupLabels: ["领养临终"] },
  { id: "meds", label: "用药/术后", groupLabels: ["用药术后"] },
  { id: "train", label: "训练/社交", groupLabels: ["训练社交"] },
  { id: "cost", label: "费用/取舍", groupLabels: ["费用取舍"] },
  { id: "age", label: "幼体/老年", groupLabels: ["幼体老年"] },
  { id: "exotic", label: "异宠/水族", groupLabels: ["异宠水族"] },
  { id: "board", label: "寄养/隔离", groupLabels: ["寄养隔离"] },
];

export const PET_DEFAULT_FILTER_ID = "hot";

export function petSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, PET_FILTER_TABS);
}
