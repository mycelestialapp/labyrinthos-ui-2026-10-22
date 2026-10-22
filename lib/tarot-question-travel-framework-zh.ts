/**
 * 出行迁居 · 分类框架（东西方共用场景，中文成稿）。
 * 冻结核 20 条原文一字不改。
 */
import { TRAVEL_X } from "./tarot-question-travel-extra-scenes-zh";
import { TRAVEL_Y } from "./tarot-question-travel-extra-scenes-2-zh";
import { TRAVEL_Z } from "./tarot-question-travel-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const TRAVEL_Q = {
  tripOk: "这次出行顺利吗？",
  moveHouse: "该不该搬家？",
  visaOk: "签证能办下来吗？",
  moveDay: "哪天搬家比较好？",
  delay: "航班／交通会延误吗？",
  changeCity: "该不该换城市？",
  moveDir: "搬家该选哪个方向？",
  bizTrip: "这次出差的目的能达成吗？",
  migrate: "移民／移居适合现在做吗？",
  watchOut: "这趟出门要注意什么？",
  buyRent: "买房／租房该选哪个？",
  carOk: "车子／车况会有问题吗？",
  goNow: "该不该现在出门？",
  whichLeg: "旅途最可能在哪一段出状况？",
  moveTiming: "搬家的时机对吗？",
  housePaper: "换房手续能顺利吗？",
  dealOk: "出差谈判会顺利吗？",
  buyCar: "该不该买车？",
  travelWhen: "出国旅行该选哪个时间窗？",
  stayFit: "新住处适不适合长期住？",
  ...TRAVEL_X,
  ...TRAVEL_Y,
  ...TRAVEL_Z,
} as const;

export const TRAVEL_FROZEN_CANONICAL: readonly string[] = [
  TRAVEL_Q.tripOk, TRAVEL_Q.moveHouse, TRAVEL_Q.visaOk, TRAVEL_Q.moveDay, TRAVEL_Q.delay,
  TRAVEL_Q.changeCity, TRAVEL_Q.moveDir, TRAVEL_Q.bizTrip, TRAVEL_Q.migrate, TRAVEL_Q.watchOut,
  TRAVEL_Q.buyRent, TRAVEL_Q.carOk, TRAVEL_Q.goNow, TRAVEL_Q.whichLeg, TRAVEL_Q.moveTiming,
  TRAVEL_Q.housePaper, TRAVEL_Q.dealOk, TRAVEL_Q.buyCar, TRAVEL_Q.travelWhen, TRAVEL_Q.stayFit,
];

export const TRAVEL_FRAMEWORK_GROUPS = [
  {
    label: "出行总势",
    keys: ["出行", "出门", "窗口", "走与留", "信号"],
    surface: [TRAVEL_Q.luckNow, TRAVEL_Q.luckYear, TRAVEL_Q.luckWhen, TRAVEL_Q.luckPatch, TRAVEL_Q.ignoreSignal],
  },
  {
    label: "行程安全",
    keys: ["出行", "旅行", "航班", "平安", "出门", "安全", "延误", "独自"],
    surface: [TRAVEL_Q.tripOk, TRAVEL_Q.delay, TRAVEL_Q.watchOut, TRAVEL_Q.goNow, TRAVEL_Q.whichLeg, TRAVEL_Q.travelWhen, TRAVEL_Q.goTonight, TRAVEL_Q.aloneGo, TRAVEL_Q.cancelTrip, TRAVEL_Q.delayMiss, TRAVEL_Q.whichDay, TRAVEL_Q.roadNight, TRAVEL_Q.borderWait, TRAVEL_Q.hotelOk, TRAVEL_Q.meetFar, TRAVEL_Q.festivalGo],
  },
  {
    label: "搬家迁居",
    keys: ["搬家", "换城市", "换房", "时机", "方向", "退租"],
    surface: [TRAVEL_Q.moveHouse, TRAVEL_Q.moveDay, TRAVEL_Q.changeCity, TRAVEL_Q.moveDir, TRAVEL_Q.moveTiming, TRAVEL_Q.jobCity, TRAVEL_Q.partnerCity, TRAVEL_Q.leaseBreak, TRAVEL_Q.newNeighbor, TRAVEL_Q.storage, TRAVEL_Q.roommateMove],
  },
  {
    label: "签证出差",
    keys: ["签证", "出差", "移民", "过关", "洽谈"],
    surface: [TRAVEL_Q.visaOk, TRAVEL_Q.bizTrip, TRAVEL_Q.migrate, TRAVEL_Q.dealOk, TRAVEL_Q.visaRound, TRAVEL_Q.interviewTrip, TRAVEL_Q.settleNow, TRAVEL_Q.comeBack, TRAVEL_Q.packPet],
  },
  {
    label: "住房车辆",
    keys: ["买房", "租房", "买车", "车况", "住处"],
    surface: [TRAVEL_Q.buyRent, TRAVEL_Q.carOk, TRAVEL_Q.housePaper, TRAVEL_Q.buyCar, TRAVEL_Q.stayFit, TRAVEL_Q.stayLong, TRAVEL_Q.housePick, TRAVEL_Q.rentBuy, TRAVEL_Q.carReady],
  },
  {
    label: "独自远行",
    keys: ["独自", "过夜", "借住", "中转", "时差"],
    surface: [TRAVEL_Q.soloNight, TRAVEL_Q.soloTaxi, TRAVEL_Q.soloEat, TRAVEL_Q.trackShare, TRAVEL_Q.bagLight, TRAVEL_Q.hostTrust, TRAVEL_Q.weatherGo, TRAVEL_Q.cashOn, TRAVEL_Q.language, TRAVEL_Q.insuranceGo, TRAVEL_Q.layover, TRAVEL_Q.borderDoc, TRAVEL_Q.jetLag, TRAVEL_Q.localSim, TRAVEL_Q.roomShare, TRAVEL_Q.lastCall],
  },
  {
    label: "探亲过节",
    keys: ["过节", "两家", "手礼", "长辈", "带着小孩"],
    surface: [TRAVEL_Q.familyFest, TRAVEL_Q.twoHomes, TRAVEL_Q.giftBag, TRAVEL_Q.elderWait, TRAVEL_Q.kidTravel, TRAVEL_Q.emptySeat, TRAVEL_Q.comeEarly],
  },
  {
    label: "落地安家",
    keys: ["第一夜", "落户", "通勤", "圈子", "旧房子", "多留"],
    surface: [TRAVEL_Q.firstNight, TRAVEL_Q.register, TRAVEL_Q.netWork, TRAVEL_Q.makeFriend, TRAVEL_Q.oldLease, TRAVEL_Q.noiseNew, TRAVEL_Q.stayExtend],
  },
  {
    label: "自驾车况",
    keys: ["胎压", "夜路", "拼车", "封路", "充电"],
    surface: [TRAVEL_Q.tireBlow, TRAVEL_Q.nightDrive, TRAVEL_Q.mountainFog, TRAVEL_Q.carShare, TRAVEL_Q.fuelFar, TRAVEL_Q.parkCity, TRAVEL_Q.evCharge, TRAVEL_Q.tollWrong, TRAVEL_Q.snowChain, TRAVEL_Q.roadBlock, TRAVEL_Q.spareKey, TRAVEL_Q.childSeat],
  },
  {
    label: "过关证件",
    keys: ["证件", "空白页", "过关", "带小孩", "通讯卡"],
    surface: [TRAVEL_Q.passportPage, TRAVEL_Q.nameMismatch, TRAVEL_Q.visaStamp, TRAVEL_Q.inviteLetter, TRAVEL_Q.photoId, TRAVEL_Q.minorDoc, TRAVEL_Q.borderQueue, TRAVEL_Q.customsFood, TRAVEL_Q.eSimFail, TRAVEL_Q.petCabin, TRAVEL_Q.insuranceCut, TRAVEL_Q.midnightLand],
  },
  {
    label: "改期退票",
    keys: ["退票", "改期", "误机", "行李", "跟团"],
    surface: [TRAVEL_Q.refundNow, TRAVEL_Q.changeFee, TRAVEL_Q.noShow, TRAVEL_Q.weatherCancel, TRAVEL_Q.strikeGo, TRAVEL_Q.bumpSeat, TRAVEL_Q.ferryCut, TRAVEL_Q.loungeWait, TRAVEL_Q.bagDelay, TRAVEL_Q.rebookApp, TRAVEL_Q.groupTour, TRAVEL_Q.cruisePort],
  },
];

export const TRAVEL_FEATURED_SURFACE: readonly string[] = [
  TRAVEL_Q.luckNow, TRAVEL_Q.tripOk, TRAVEL_Q.moveHouse, TRAVEL_Q.visaOk, TRAVEL_Q.goNow,
  TRAVEL_Q.changeCity, TRAVEL_Q.migrate, TRAVEL_Q.buyRent,   TRAVEL_Q.cancelTrip, TRAVEL_Q.jobCity, TRAVEL_Q.soloNight, TRAVEL_Q.familyFest, TRAVEL_Q.tireBlow, TRAVEL_Q.refundNow,
];

export const TRAVEL_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: TRAVEL_FEATURED_SURFACE },
  { id: "luck", label: "运势", groupLabels: ["出行总势"] },
  { id: "trip", label: "行程/安全", groupLabels: ["行程安全"] },
  { id: "move", label: "搬家/迁居", groupLabels: ["搬家迁居"] },
  { id: "visa", label: "签证/出差", groupLabels: ["签证出差"] },
  { id: "home", label: "住房/车辆", groupLabels: ["住房车辆"] },
  { id: "solo", label: "独自/远行", groupLabels: ["独自远行"] },
  { id: "fest", label: "探亲/过节", groupLabels: ["探亲过节"] },
  { id: "land", label: "落地/安家", groupLabels: ["落地安家"] },
  { id: "drive", label: "自驾/车况", groupLabels: ["自驾车况"] },
  { id: "border", label: "过关/证件", groupLabels: ["过关证件"] },
  { id: "refund", label: "改期/退票", groupLabels: ["改期退票"] },
];

export const TRAVEL_DEFAULT_FILTER_ID = "hot";

export function travelSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, TRAVEL_FILTER_TABS);
}
