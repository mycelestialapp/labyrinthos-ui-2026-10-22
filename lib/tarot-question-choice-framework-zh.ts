/**
 * 选择决策 · 分类框架（东西方共用场景，中文成稿）。
 * 冻结核 20 条原文一字不改（含 offer）；新题用「录用」。
 */
import { Q_CHOICE as T } from "./tarot-master-question-content-life-categories";
import { CHOICE_X } from "./tarot-question-choice-extra-scenes-zh";
import { CHOICE_Y } from "./tarot-question-choice-extra-scenes-2-zh";
import { CHOICE_Z } from "./tarot-question-choice-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const CHOICE_Q = {
  twoOffer: T[0]!,
  gongBlog: T[1]!,
  follow: T[2]!,
  moveCity: T[3]!,
  waitPromo: T[4]!,
  breakFee: T[5]!,
  wedding: T[6]!,
  parentsNo: T[7]!,
  chatNight: T[8]!,
  houseName: T[9]!,
  carLoan: T[10]!,
  deposit: T[11]!,
  resignBack: T[12]!,
  guarantee: T[13]!,
  blindDate: T[14]!,
  pie: T[15]!,
  hometown: T[16]!,
  boarding: T[17]!,
  nursing: T[18]!,
  surgery: T[19]!,
  ...CHOICE_X,
  ...CHOICE_Y,
  ...CHOICE_Z,
} as const;

export const CHOICE_FROZEN_CANONICAL: readonly string[] = [
  CHOICE_Q.twoOffer, CHOICE_Q.gongBlog, CHOICE_Q.follow, CHOICE_Q.moveCity, CHOICE_Q.waitPromo,
  CHOICE_Q.breakFee, CHOICE_Q.wedding, CHOICE_Q.parentsNo, CHOICE_Q.chatNight, CHOICE_Q.houseName,
  CHOICE_Q.carLoan, CHOICE_Q.deposit, CHOICE_Q.resignBack, CHOICE_Q.guarantee, CHOICE_Q.blindDate,
  CHOICE_Q.pie, CHOICE_Q.hometown, CHOICE_Q.boarding, CHOICE_Q.nursing, CHOICE_Q.surgery,
];

export const CHOICE_FRAMEWORK_GROUPS = [
  {
    label: "选择总势",
    keys: ["选择", "卡在", "拍板", "签字", "两条路", "截止", "直觉"],
    surface: [CHOICE_Q.luckNow, CHOICE_Q.luckYear, CHOICE_Q.luckWhen, CHOICE_Q.luckPatch, CHOICE_Q.ignoreSignal, CHOICE_Q.twoPaths, CHOICE_Q.deadline, CHOICE_Q.familyVote, CHOICE_Q.gutVsSheet, CHOICE_Q.trialWeek, CHOICE_Q.tellThem, CHOICE_Q.oneStep],
  },
  {
    label: "工作去留",
    keys: ["录用", "offer", "公职", "升职", "辞职", "老板", "副业", "换城"],
    surface: [CHOICE_Q.twoOffer, CHOICE_Q.gongBlog, CHOICE_Q.waitPromo, CHOICE_Q.resignBack, CHOICE_Q.pie, CHOICE_Q.takeOffer, CHOICE_Q.stayYear, CHOICE_Q.startSide, CHOICE_Q.cityPick],
  },
  {
    label: "感情跟随",
    keys: ["对象", "换城市", "分手", "相亲", "婚", "跟随"],
    surface: [CHOICE_Q.follow, CHOICE_Q.moveCity, CHOICE_Q.chatNight, CHOICE_Q.parentsNo, CHOICE_Q.blindDate, CHOICE_Q.moveForLove, CHOICE_Q.cutChat, CHOICE_Q.meetAgain, CHOICE_Q.weddingScale, CHOICE_Q.eldersNo],
  },
  {
    label: "钱与契约",
    keys: ["违约", "婚礼", "买房", "买车", "担保", "出国", "贷款", "名字"],
    surface: [CHOICE_Q.breakFee, CHOICE_Q.wedding, CHOICE_Q.houseName, CHOICE_Q.carLoan, CHOICE_Q.deposit, CHOICE_Q.guarantee, CHOICE_Q.signName, CHOICE_Q.payBreak, CHOICE_Q.loanBuy, CHOICE_Q.helpSign],
  },
  {
    label: "安家照护",
    keys: ["老家", "寄宿", "养老院", "大城市"],
    surface: [CHOICE_Q.hometown, CHOICE_Q.boarding, CHOICE_Q.nursing, CHOICE_Q.goHome, CHOICE_Q.careHome, CHOICE_Q.schoolStay],
  },
  {
    label: "医疗取舍",
    keys: ["手术", "观察", "医生", "听谁"],
    surface: [CHOICE_Q.surgery, CHOICE_Q.surgeryPick, CHOICE_Q.withdraw],
  },
  {
    label: "学业路径",
    keys: ["空一季", "换专业", "课", "实习", "手艺", "报名"],
    surface: [CHOICE_Q.gapYear, CHOICE_Q.changeTrack, CHOICE_Q.nightClass, CHOICE_Q.dropOne, CHOICE_Q.internPick, CHOICE_Q.skillPay],
  },
  {
    label: "创业合伙",
    keys: ["合伙", "客户", "辞职去干", "招牌", "试卖"],
    surface: [CHOICE_Q.partnerSplit, CHOICE_Q.firstClient, CHOICE_Q.quitToStart, CHOICE_Q.nameShare, CHOICE_Q.smallTest, CHOICE_Q.oldJobBack],
  },
  {
    label: "时效窗口",
    keys: ["截止", "报名", "租约", "过期", "答复期限"],
    surface: [CHOICE_Q.taxDay, CHOICE_Q.enrollClose, CHOICE_Q.leaseEnd, CHOICE_Q.ticketExpire, CHOICE_Q.replyWindow, CHOICE_Q.twoCities, CHOICE_Q.familyLoan, CHOICE_Q.publicPost, CHOICE_Q.waitNews, CHOICE_Q.houseMate, CHOICE_Q.petKeep, CHOICE_Q.healthVsJob, CHOICE_Q.sayParents, CHOICE_Q.oneYearBox, CHOICE_Q.cheaperPath, CHOICE_Q.prestige, CHOICE_Q.friendVote, CHOICE_Q.sleepOn],
  },
  {
    label: "居住城市",
    keys: ["租约", "买下来", "通勤", "两头", "换城"],
    surface: [CHOICE_Q.rentYear, CHOICE_Q.buyNowCity, CHOICE_Q.suburb, CHOICE_Q.twoBases, CHOICE_Q.visaStay, CHOICE_Q.climateGo, CHOICE_Q.cityParents, CHOICE_Q.schoolZone, CHOICE_Q.jobRemote, CHOICE_Q.winterGo, CHOICE_Q.friendCity, CHOICE_Q.healthCity],
  },
  {
    label: "家庭投票",
    keys: ["家里投票", "家族群", "长辈否决", "孩子不想走"],
    surface: [CHOICE_Q.voteFamily, CHOICE_Q.weChatGroup, CHOICE_Q.siblingPick, CHOICE_Q.inLawVote, CHOICE_Q.kidVote, CHOICE_Q.elderVeto, CHOICE_Q.parentHouse, CHOICE_Q.festivalMove, CHOICE_Q.groupPoll, CHOICE_Q.twoOffers, CHOICE_Q.announceQuit, CHOICE_Q.silentQuit],
  },
  {
    label: "公开面子",
    keys: ["发网上", "合影", "头衔", "随礼", "改称呼"],
    surface: [CHOICE_Q.postDecide, CHOICE_Q.weddingShow, CHOICE_Q.titleKeep, CHOICE_Q.photoCouple, CHOICE_Q.alumniBoast, CHOICE_Q.giftFace, CHOICE_Q.nameChange, CHOICE_Q.ringOff, CHOICE_Q.liveAsk, CHOICE_Q.delayMail, CHOICE_Q.seatMove, CHOICE_Q.petCity],
  },
];

export const CHOICE_FEATURED_SURFACE: readonly string[] = [
  CHOICE_Q.luckNow, CHOICE_Q.twoOffer, CHOICE_Q.follow, CHOICE_Q.takeOffer, CHOICE_Q.breakFee,
  CHOICE_Q.hometown, CHOICE_Q.surgery, CHOICE_Q.guarantee, CHOICE_Q.deadline, CHOICE_Q.parentsNo, CHOICE_Q.enrollClose, CHOICE_Q.quitToStart, CHOICE_Q.rentYear, CHOICE_Q.voteFamily,
];

export const CHOICE_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: CHOICE_FEATURED_SURFACE },
  { id: "luck", label: "运势", groupLabels: ["选择总势"] },
  { id: "work", label: "工作/去留", groupLabels: ["工作去留"] },
  { id: "love", label: "感情/跟随", groupLabels: ["感情跟随"] },
  { id: "money", label: "钱/契约", groupLabels: ["钱与契约"] },
  { id: "home", label: "安家/照护", groupLabels: ["安家照护"] },
  { id: "med", label: "医疗/取舍", groupLabels: ["医疗取舍"] },
  { id: "study", label: "学业/路径", groupLabels: ["学业路径"] },
  { id: "start", label: "创业/合伙", groupLabels: ["创业合伙"] },
  { id: "window", label: "时效/窗口", groupLabels: ["时效窗口"] },
  { id: "city", label: "居住/城市", groupLabels: ["居住城市"] },
  { id: "vote", label: "家庭/投票", groupLabels: ["家庭投票"] },
  { id: "show", label: "公开/面子", groupLabels: ["公开面子"] },
];

export const CHOICE_DEFAULT_FILTER_ID = "hot";

export function choiceSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, CHOICE_FILTER_TABS);
}
