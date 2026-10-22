/**
 * 官司法律 · 分类框架（东西方共用场景，中文成稿）。
 * 冻结核 20 条原文一字不改。
 */
import { LEGAL_X } from "./tarot-question-legal-extra-scenes-zh";
import { LEGAL_Y } from "./tarot-question-legal-extra-scenes-2-zh";
import { LEGAL_Z } from "./tarot-question-legal-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const LEGAL_Q = {
  win: "官司能赢吗？",
  contract: "合同纠纷该怎么处理？",
  custody: "孩子抚养权／监护权怎么保障？",
  hire: "该请律师吗？",
  settleOr: "和解好还是打到底？",
  theySettle: "对方会和解吗？",
  divorce: "离婚协议怎么谈？",
  courtPrep: "开庭我该怎么准备？",
  evidence: "证据够吗？",
  sue: "该不该告对方？",
  whichLawyer: "律师该选哪个？",
  verdict: "判决会对我有利吗？",
  visit: "探视权能争取到吗？",
  pay: "赔偿能拿到吗？",
  howLong: "官司要打多久？",
  mediate: "调解能成吗？",
  sign: "法律文件该怎么签？",
  appeal: "上诉还有没有机会？",
  guard: "这个案子最该防哪一刀？",
  witness: "关键证人会不会出庭？",
  ...LEGAL_X,
  ...LEGAL_Y,
  ...LEGAL_Z,
} as const;

export const LEGAL_FROZEN_CANONICAL: readonly string[] = [
  LEGAL_Q.win, LEGAL_Q.contract, LEGAL_Q.custody, LEGAL_Q.hire, LEGAL_Q.settleOr,
  LEGAL_Q.theySettle, LEGAL_Q.divorce, LEGAL_Q.courtPrep, LEGAL_Q.evidence, LEGAL_Q.sue,
  LEGAL_Q.whichLawyer, LEGAL_Q.verdict, LEGAL_Q.visit, LEGAL_Q.pay, LEGAL_Q.howLong,
  LEGAL_Q.mediate, LEGAL_Q.sign, LEGAL_Q.appeal, LEGAL_Q.guard, LEGAL_Q.witness,
];

export const LEGAL_FRAMEWORK_GROUPS = [
  {
    label: "官司总势",
    keys: ["官司", "案子", "窗口", "证据", "忍让"],
    surface: [LEGAL_Q.luckNow, LEGAL_Q.luckYear, LEGAL_Q.luckWhen, LEGAL_Q.luckPatch, LEGAL_Q.ignoreSignal, LEGAL_Q.costCarry],
  },
  {
    label: "输赢和解",
    keys: ["赢", "胜诉", "和解", "打到底", "调解", "上诉"],
    surface: [LEGAL_Q.win, LEGAL_Q.settleOr, LEGAL_Q.theySettle, LEGAL_Q.mediate, LEGAL_Q.appeal, LEGAL_Q.fileNow, LEGAL_Q.afterWin, LEGAL_Q.afterLose],
  },
  {
    label: "律师证据",
    keys: ["律师", "证据", "开庭", "告", "判决", "证人", "报警"],
    surface: [LEGAL_Q.hire, LEGAL_Q.courtPrep, LEGAL_Q.evidence, LEGAL_Q.sue, LEGAL_Q.whichLawyer, LEGAL_Q.verdict, LEGAL_Q.witness, LEGAL_Q.policeNow, LEGAL_Q.recordChat, LEGAL_Q.witnessAsk, LEGAL_Q.changeLawyer, LEGAL_Q.courtDay],
  },
  {
    label: "家事抚养",
    keys: ["抚养", "探视", "离婚协议", "孩子"],
    surface: [LEGAL_Q.custody, LEGAL_Q.divorce, LEGAL_Q.visit, LEGAL_Q.childSafe, LEGAL_Q.visitBlock, LEGAL_Q.familySplit],
  },
  {
    label: "合同赔偿",
    keys: ["合同", "赔偿", "多久", "签字", "纠纷", "防", "时效"],
    surface: [LEGAL_Q.contract, LEGAL_Q.pay, LEGAL_Q.howLong, LEGAL_Q.sign, LEGAL_Q.guard, LEGAL_Q.settleText, LEGAL_Q.hideAsset, LEGAL_Q.workDispute, LEGAL_Q.signPause, LEGAL_Q.publicPost, LEGAL_Q.neighborSuit, LEGAL_Q.contractFix, LEGAL_Q.timeBar],
  },
  {
    label: "劳动职场",
    keys: ["报酬", "辞退", "超时", "越界", "竞业", "集体"],
    surface: [LEGAL_Q.unpaid, LEGAL_Q.fireLetter, LEGAL_Q.overtime, LEGAL_Q.harass, LEGAL_Q.ndaSign, LEGAL_Q.unionTalk],
  },
  {
    label: "邻里房产",
    keys: ["墙", "漏", "噪音", "押金", "房产名字", "违建"],
    surface: [LEGAL_Q.fence, LEGAL_Q.leakDown, LEGAL_Q.noiseLaw, LEGAL_Q.deposit, LEGAL_Q.titleHouse, LEGAL_Q.buildAdd, LEGAL_Q.kidSchool, LEGAL_Q.willPaper],
  },
  {
    label: "执行上诉",
    keys: ["执行", "装穷", "上诉", "冻结", "跨地", "诉讼费"],
    surface: [LEGAL_Q.enforce, LEGAL_Q.hidePay, LEGAL_Q.secondRound, LEGAL_Q.freezeAcc, LEGAL_Q.deadlineAppeal, LEGAL_Q.foreignDoc, LEGAL_Q.mediaLaw, LEGAL_Q.settleNow, LEGAL_Q.loanShark, LEGAL_Q.fakeGoods, LEGAL_Q.idStolen, LEGAL_Q.courtOnline, LEGAL_Q.transRecord, LEGAL_Q.costOrder, LEGAL_Q.witnessFear, LEGAL_Q.copyFile],
  },
  {
    label: "名誉网络",
    keys: ["网上", "冒名", "截图", "直播", "造谣"],
    surface: [LEGAL_Q.postSmear, LEGAL_Q.fakeAccount, LEGAL_Q.reviewWar, LEGAL_Q.leakChat, LEGAL_Q.liveSlander, LEGAL_Q.workplaceRumor, LEGAL_Q.nameSearch, LEGAL_Q.bossGroup, LEGAL_Q.cameraHome, LEGAL_Q.schoolPost, LEGAL_Q.mediaAsk, LEGAL_Q.apologyLaw],
  },
  {
    label: "消费维权",
    keys: ["货不对板", "退卡", "装修", "快递", "小额"],
    surface: [LEGAL_Q.fakeItem, LEGAL_Q.courseTrap, LEGAL_Q.gymLockIn, LEGAL_Q.renovateCheat, LEGAL_Q.carSale, LEGAL_Q.deliveryLost, LEGAL_Q.refundTalk, LEGAL_Q.smallClaim, LEGAL_Q.invoiceFake, LEGAL_Q.shareHolder, LEGAL_Q.leaseBreakFee, LEGAL_Q.translator],
  },
  {
    label: "继承文书",
    keys: ["遗嘱", "老宅", "过户", "公证", "保全"],
    surface: [LEGAL_Q.willNew, LEGAL_Q.siblingHouse, LEGAL_Q.elderSign, LEGAL_Q.graveRight, LEGAL_Q.accountHeir, LEGAL_Q.giftBack, LEGAL_Q.inheritTax, LEGAL_Q.careDuty, LEGAL_Q.paperLost, LEGAL_Q.notaryDay, LEGAL_Q.minorSign, LEGAL_Q.freezeHouse],
  },
];

export const LEGAL_FEATURED_SURFACE: readonly string[] = [
  LEGAL_Q.luckNow, LEGAL_Q.win, LEGAL_Q.settleOr, LEGAL_Q.hire, LEGAL_Q.evidence,
  LEGAL_Q.custody, LEGAL_Q.contract, LEGAL_Q.sue, LEGAL_Q.appeal, LEGAL_Q.fileNow, LEGAL_Q.unpaid, LEGAL_Q.enforce, LEGAL_Q.postSmear, LEGAL_Q.willNew,
];

export const LEGAL_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: LEGAL_FEATURED_SURFACE },
  { id: "luck", label: "运势", groupLabels: ["官司总势"] },
  { id: "end", label: "输赢/和解", groupLabels: ["输赢和解"] },
  { id: "prep", label: "律师/证据", groupLabels: ["律师证据"] },
  { id: "family", label: "家事/抚养", groupLabels: ["家事抚养"] },
  { id: "paper", label: "合同/赔偿", groupLabels: ["合同赔偿"] },
  { id: "work", label: "劳动/职场", groupLabels: ["劳动职场"] },
  { id: "house", label: "邻里/房产", groupLabels: ["邻里房产"] },
  { id: "run", label: "执行/上诉", groupLabels: ["执行上诉"] },
  { id: "name", label: "名誉/网络", groupLabels: ["名誉网络"] },
  { id: "consumer", label: "消费/维权", groupLabels: ["消费维权"] },
  { id: "inherit", label: "继承/文书", groupLabels: ["继承文书"] },
];

export const LEGAL_DEFAULT_FILTER_ID = "hot";

export function legalSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, LEGAL_FILTER_TABS);
}
