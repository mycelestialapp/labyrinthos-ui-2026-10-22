/**
 * 失物寻找 · 分类框架（中文成稿）。
 * 冻结核 20 条原文一字不改。
 * 分组／滤签按西方找东西的顺序：先找回、往哪找、丢了还是被偷；
 * 报警只留贵重／被偷那一条，不单独成签。
 */
import { LOST_X } from "./tarot-question-lost-extra-scenes-zh";
import { LOST_Y } from "./tarot-question-lost-extra-scenes-2-zh";
import { LOST_Z } from "./tarot-question-lost-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const LOST_Q = {
  find: "丢的东西能找回吗？",
  whichWay: "该往哪个方向找？",
  when: "什么时候能找到？",
  where: "东西掉在哪里？",
  who: "被谁拿走了？",
  police: "该不该报警？",
  inOut: "失物在室内还是室外？",
  wallet: "钱包／证件能找回吗？",
  phone: "手机／贵重物品能找回吗？",
  giveUp: "找不到了该放弃吗？",
  clue: "线索在哪？",
  return: "有人捡到会还吗？",
  post: "该不该在网上发寻物？",
  days: "几天内能找到？",
  stolen: "被偷还是自己弄丢？",
  broken: "找回来会损坏吗？",
  atHome: "东西还在家里吗？",
  firstSpot: "该先找哪个地点？",
  used: "失物被别人用了吗？",
  watch: "找的时候最该注意什么？",
  ...LOST_X,
  ...LOST_Y,
  ...LOST_Z,
} as const;

export const LOST_FROZEN_CANONICAL: readonly string[] = [
  LOST_Q.find, LOST_Q.whichWay, LOST_Q.when, LOST_Q.where, LOST_Q.who,
  LOST_Q.police, LOST_Q.inOut, LOST_Q.wallet, LOST_Q.phone, LOST_Q.giveUp,
  LOST_Q.clue, LOST_Q.return, LOST_Q.post, LOST_Q.days, LOST_Q.stolen,
  LOST_Q.broken, LOST_Q.atHome, LOST_Q.firstSpot, LOST_Q.used, LOST_Q.watch,
];

export const LOST_FRAMEWORK_GROUPS = [
  {
    label: "寻找总势",
    keys: ["找回", "还在", "窗口", "翻", "忽略"],
    surface: [LOST_Q.luckNow, LOST_Q.luckYear, LOST_Q.luckWhen, LOST_Q.luckPatch, LOST_Q.ignoreSignal],
  },
  {
    label: "能否找回",
    keys: ["找回", "还能", "放弃", "钱包", "手机", "证件"],
    surface: [LOST_Q.find, LOST_Q.wallet, LOST_Q.phone, LOST_Q.giveUp, LOST_Q.giveUpDay, LOST_Q.replaceNow, LOST_Q.keepLooking, LOST_Q.when, LOST_Q.days, LOST_Q.broken, LOST_Q.damaged],
  },
  {
    label: "往哪找",
    keys: ["方向", "哪里", "室内", "家里", "地点", "包", "单位"],
    surface: [LOST_Q.whichWay, LOST_Q.where, LOST_Q.inOut, LOST_Q.clue, LOST_Q.atHome, LOST_Q.firstSpot, LOST_Q.lastSeen, LOST_Q.bagOrRoom, LOST_Q.workPlace, LOST_Q.transit, LOST_Q.samePlace, LOST_Q.friendBorrow, LOST_Q.watch, LOST_Q.nightLook],
  },
  {
    label: "丢了还是被偷",
    keys: ["被偷", "谁", "捡到", "报警", "保险"],
    surface: [LOST_Q.stolen, LOST_Q.someoneTook, LOST_Q.who, LOST_Q.return, LOST_Q.willReturn, LOST_Q.payFind, LOST_Q.police, LOST_Q.insuranceLost, LOST_Q.policeWait, LOST_Q.used],
  },
  {
    label: "手机卡钥匙",
    keys: ["手机", "定位", "卡", "钥匙", "换锁", "挂失"],
    surface: [LOST_Q.deviceTrack, LOST_Q.walletApp, LOST_Q.idCards, LOST_Q.keySet, LOST_Q.lockChange, LOST_Q.passport, LOST_Q.badge, LOST_Q.jewelry, LOST_Q.tellThem],
  },
  {
    label: "数字账号",
    keys: ["账号", "云", "验证码", "支付", "聊天记录", "文件"],
    surface: [LOST_Q.accountHack, LOST_Q.cloudPhoto, LOST_Q.mailCode, LOST_Q.chatGone, LOST_Q.driveFile],
  },
  {
    label: "证件票务",
    keys: ["证件", "工牌", "票", "合同原件", "补办"],
    surface: [LOST_Q.ticketStub, LOST_Q.paperContract, LOST_Q.replaceWait],
  },
  {
    label: "公共场所",
    keys: ["更衣室", "店里", "洗手间", "车上", "机场", "公园", "酒店", "寻物"],
    surface: [LOST_Q.gymLock, LOST_Q.cafeTable, LOST_Q.restroom, LOST_Q.taxiBack, LOST_Q.airportBin, LOST_Q.parkBench, LOST_Q.kidSchoolBag, LOST_Q.hotelSafe, LOST_Q.laundry, LOST_Q.moveBox, LOST_Q.sharedDrawer, LOST_Q.photoSpot, LOST_Q.smellTrack, LOST_Q.rewardCap, LOST_Q.fakeClaim, LOST_Q.post, LOST_Q.postNow, LOST_Q.cameraAsk],
  },
  {
    label: "家里室内",
    keys: ["沙发缝", "脏衣", "储物间", "换季", "再翻"],
    surface: [LOST_Q.sofaGap, LOST_Q.laundryBag, LOST_Q.fridgeTop, LOST_Q.kidsRoom, LOST_Q.toolShed, LOST_Q.coatSeason, LOST_Q.rainGutter, LOST_Q.habitPath, LOST_Q.familyHide, LOST_Q.petSwallow, LOST_Q.secondLook, LOST_Q.waitDawn],
  },
  {
    label: "交通旅途",
    keys: ["地铁", "行李架", "网约车", "机场袋", "寄存柜"],
    surface: [LOST_Q.busSeat, LOST_Q.bikeBasket, LOST_Q.trainOverhead, LOST_Q.taxiApp, LOST_Q.planePocket, LOST_Q.restStop, LOST_Q.pocketHole, LOST_Q.gymFloor, LOST_Q.hotelHousekeep, LOST_Q.moveCrew, LOST_Q.storageUnit, LOST_Q.mailbox],
  },
  {
    label: "被人拿走",
    keys: ["同居", "客人", "保洁", "同事", "当铺"],
    surface: [LOST_Q.roommateTook, LOST_Q.guestLeft, LOST_Q.cleanerBin, LOST_Q.coworkerDesk, LOST_Q.kidSchool, LOST_Q.exHouse, LOST_Q.partyTable, LOST_Q.photoAlbum, LOST_Q.pawnCheck, LOST_Q.serialNum, LOST_Q.findersKeep, LOST_Q.markSpot],
  },
];

/** 西方高频：找回、往哪找、还在家吗、丢了还是被偷；报警不进高频。 */
export const LOST_FEATURED_SURFACE: readonly string[] = [
  LOST_Q.find, LOST_Q.whichWay, LOST_Q.atHome, LOST_Q.stolen,
  LOST_Q.deviceTrack, LOST_Q.friendBorrow, LOST_Q.giveUp, LOST_Q.wallet,
  LOST_Q.keySet, LOST_Q.sofaGap, LOST_Q.lastSeen, LOST_Q.replaceNow,
];

export const LOST_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: LOST_FEATURED_SURFACE },
  { id: "luck", label: "还在不在", groupLabels: ["寻找总势"] },
  { id: "back", label: "能否找回", groupLabels: ["能否找回"] },
  { id: "where", label: "往哪找", groupLabels: ["往哪找", "家里室内"] },
  { id: "taken", label: "丢了还是被偷", groupLabels: ["丢了还是被偷", "被人拿走"] },
  { id: "kit", label: "手机卡钥匙", groupLabels: ["手机卡钥匙", "数字账号", "证件票务"] },
  { id: "out", label: "出门丢的", groupLabels: ["公共场所", "交通旅途"] },
];

export const LOST_DEFAULT_FILTER_ID = "hot";

export function lostSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, LOST_FILTER_TABS);
}
