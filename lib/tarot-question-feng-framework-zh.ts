/**
 * 占风水 · 分类框架（住／睡／工位／格局；阴宅祖坟留冻结核）。
 * 冻结核 20 条原文一字不改。
 */
import { FENG_X } from "./tarot-question-feng-extra-scenes-zh";
import { FENG_Y } from "./tarot-question-feng-extra-scenes-2-zh";
import { FENG_Z } from "./tarot-question-feng-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const FENG_Q = {
  homeWatch: "家里风水要注意什么？",
  whichItem: "哪个风水物品比较适合？",
  officeHouse: "办公室／房子风水如何？",
  liveHere: "这个房子适不适合我们住？",
  wealth: "摆什么能招财？",
  bedDesk: "床位／书桌该怎么摆？",
  door: "大门朝向有问题吗？",
  sha: "煞气怎么化解？",
  peach: "旺桃花怎么摆？",
  grave: "祖坟／阴宅要注意什么？",
  moveDay: "搬家要选哪天？",
  renoDay: "装修动工吉日？",
  seat: "办公室座位怎么选？",
  mirror: "镜子摆放对吗？",
  plant: "植物放哪好？",
  corner: "缺角怎么补？",
  itemDir: "风水物品摆哪个方位？",
  thisDir: "这个方位适合我吗？",
  kitchen: "厨房／卫生间有没有要注意的？",
  layoutYear: "今年家里要不要动格局？",
  ...FENG_X,
  ...FENG_Y,
  ...FENG_Z,
} as const;

export const FENG_FROZEN_CANONICAL: readonly string[] = [
  FENG_Q.homeWatch, FENG_Q.whichItem, FENG_Q.officeHouse, FENG_Q.liveHere, FENG_Q.wealth,
  FENG_Q.bedDesk, FENG_Q.door, FENG_Q.sha, FENG_Q.peach, FENG_Q.grave,
  FENG_Q.moveDay, FENG_Q.renoDay, FENG_Q.seat, FENG_Q.mirror, FENG_Q.plant,
  FENG_Q.corner, FENG_Q.itemDir, FENG_Q.thisDir, FENG_Q.kitchen, FENG_Q.layoutYear,
];

export const FENG_FRAMEWORK_GROUPS = [
  {
    label: "住与睡",
    keys: ["风水", "房子", "住", "床", "睡", "门", "采光"],
    surface: [FENG_Q.luckNow, FENG_Q.luckYear, FENG_Q.luckWhen, FENG_Q.luckPatch, FENG_Q.ignoreSignal, FENG_Q.homeWatch, FENG_Q.liveHere, FENG_Q.sleepHere, FENG_Q.doorFeel, FENG_Q.lightAir, FENG_Q.noiseWall, FENG_Q.shareRoom, FENG_Q.newHouse, FENG_Q.rentLeave],
  },
  {
    label: "工位格局",
    keys: ["办公室", "座位", "格局", "厨房", "在家办公"],
    surface: [FENG_Q.officeHouse, FENG_Q.kitchen, FENG_Q.layoutYear, FENG_Q.deskHere, FENG_Q.kitchenSink, FENG_Q.workCorner, FENG_Q.officeSeat, FENG_Q.shopFront],
  },
  {
    label: "摆位招财",
    keys: ["招财", "床", "书桌", "大门", "镜子", "植物", "方位", "桃花"],
    surface: [FENG_Q.wealth, FENG_Q.bedDesk, FENG_Q.door, FENG_Q.peach, FENG_Q.seat, FENG_Q.mirror, FENG_Q.plant, FENG_Q.itemDir, FENG_Q.thisDir, FENG_Q.plantSpot, FENG_Q.mirrorFace, FENG_Q.clutter, FENG_Q.colorWall],
  },
  {
    label: "动工日子",
    keys: ["煞", "搬家", "装修", "缺角", "物品"],
    surface: [FENG_Q.whichItem, FENG_Q.sha, FENG_Q.moveDay, FENG_Q.renoDay, FENG_Q.corner, FENG_Q.moveDate, FENG_Q.renoPause, FENG_Q.afterFight],
  },
  {
    label: "阴宅祖坟",
    keys: ["祖坟", "阴宅", "长辈"],
    surface: [FENG_Q.grave, FENG_Q.ancestor],
  },
  {
    label: "店铺生意",
    keys: ["铺面", "门口", "收钱", "招牌", "客人坐"],
    surface: [FENG_Q.shopDoor, FENG_Q.cashSpot, FENG_Q.backDoor, FENG_Q.lightSign, FENG_Q.seatGuest],
  },
  {
    label: "租房选择",
    keys: ["看房", "试住", "见不到光", "味道", "隔间"],
    surface: [FENG_Q.rentSee, FENG_Q.rentNoise, FENG_Q.rentLight, FENG_Q.rentSmell, FENG_Q.rentShare],
  },
  {
    label: "睡眠质量",
    keys: ["睡过十二点", "头朝", "分床", "窗正对床", "床下"],
    surface: [FENG_Q.sleepTime, FENG_Q.sleepDir, FENG_Q.sleepPair, FENG_Q.sleepWindow, FENG_Q.sleepHall, FENG_Q.deskBack, FENG_Q.meetTable, FENG_Q.stairFace, FENG_Q.waterPipe, FENG_Q.plantDie, FENG_Q.clockTick, FENG_Q.redToo, FENG_Q.storageBed, FENG_Q.shoePile, FENG_Q.fridgeBuzz, FENG_Q.bathSteam, FENG_Q.studyCorner, FENG_Q.guestBed, FENG_Q.yearMove, FENG_Q.photoWall],
  },
  {
    label: "门口动线",
    keys: ["进门", "过道", "对冲", "楼道", "护栏"],
    surface: [FENG_Q.shoeBlock, FENG_Q.doorSlam, FENG_Q.corridorDark, FENG_Q.splitView, FENG_Q.stairMouth, FENG_Q.threeDoor, FENG_Q.porchLight, FENG_Q.mailPile, FENG_Q.bikeJammed, FENG_Q.smokeIn, FENG_Q.balconyDrop, FENG_Q.plantThorn],
  },
  {
    label: "厨卫水火",
    keys: ["灶", "马桶", "漏水", "地漏", "热水"],
    surface: [FENG_Q.stoveSink, FENG_Q.fridgeBuzz2, FENG_Q.leakStain, FENG_Q.toiletSee, FENG_Q.wetFloor, FENG_Q.trashCook, FENG_Q.waterHeater, FENG_Q.drainHair, FENG_Q.knifeBlock, FENG_Q.microwave, FENG_Q.fountain, FENG_Q.clockFast],
  },
  {
    label: "办公座位",
    keys: ["背对门", "走道位", "出风口", "换楼层", "餐桌办公"],
    surface: [FENG_Q.backToDoor, FENG_Q.glassCage, FENG_Q.aisleSeat, FENG_Q.underAc, FENG_Q.windowGlare, FENG_Q.meetingEnd, FENG_Q.copyDesk, FENG_Q.shelfHead, FENG_Q.cableNest, FENG_Q.deadCorner, FENG_Q.teamMove, FENG_Q.wfhTable],
  },
];

export const FENG_FEATURED_SURFACE: readonly string[] = [
  FENG_Q.luckNow, FENG_Q.sleepHere, FENG_Q.liveHere, FENG_Q.deskHere, FENG_Q.doorFeel,
  FENG_Q.layoutYear, FENG_Q.officeSeat,   FENG_Q.moveDate, FENG_Q.grave, FENG_Q.homeWatch, FENG_Q.sleepTime, FENG_Q.rentSee, FENG_Q.shoeBlock, FENG_Q.backToDoor,
];

export const FENG_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: FENG_FEATURED_SURFACE },
  { id: "sleep", label: "住/睡", groupLabels: ["住与睡"] },
  { id: "work", label: "工位/格局", groupLabels: ["工位格局"] },
  { id: "place", label: "摆位/招财", groupLabels: ["摆位招财"] },
  { id: "day", label: "动工/日子", groupLabels: ["动工日子"] },
  { id: "grave", label: "阴宅/祖坟", groupLabels: ["阴宅祖坟"] },
  { id: "shop", label: "店铺/生意", groupLabels: ["店铺生意"] },
  { id: "rent", label: "租房/选择", groupLabels: ["租房选择"] },
  { id: "rest", label: "睡眠/质量", groupLabels: ["睡眠质量"] },
  { id: "door", label: "门口/动线", groupLabels: ["门口动线"] },
  { id: "kitchen", label: "厨卫/水火", groupLabels: ["厨卫水火"] },
  { id: "seat", label: "办公/座位", groupLabels: ["办公座位"] },
];

export const FENG_DEFAULT_FILTER_ID = "hot";

export function fengSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, FENG_FILTER_TABS);
}
