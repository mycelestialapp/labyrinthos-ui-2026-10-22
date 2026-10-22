/**
 * 事业工作 · 分类框架（东西方共用场景，中文成稿）。
 *
 * 格子写两边都会碰上的职场现场，不偏考公或某国劳动法专名。
 * 专名留给翻译层；点选题不夹外文。冻结核原文一字不改。
 * 缺口题暂无 78×2 成稿，解读走通用大师解。
 */
import { CAREER_QUESTION_TEXTS as T } from "./tarot-master-question-content-career-texts-only";

export type CareerFrameworkGroup = {
  label: string;
  keys: string[];
  surface: string[];
};

export const CAREER_Q = {
  changeField: T[0]!,
  stayCompany: T[1]!,
  manageOrCraft: T[2]!,
  skillGap: T[3]!,
  firstStep: T[4]!,
  certMoney: T[5]!,
  takeProject: T[6]!,
  crossTeam: T[7]!,
  startup: T[8]!,
  partner: T[9]!,
  offer: T[10]!,
  quitBare: T[11]!,
  pip: T[12]!,
  payGap: T[13]!,
  raiseTalk: T[14]!,
  verbalEquity: T[15]!,
  promoRace: T[16]!,
  layoffPay: T[17]!,
  sideGig: T[18]!,
  blameEmail: T[19]!,
  ceiling: "我是不是已经撞上职业天花板？下一步该往哪走？",
  yearPlan: "近一年，我的事业该怎么规划？",
  calling: "我真正该走的职业方向是哪条？",
  passionOrPay: "该追热情，还是先保住薪水？",
  ageJump: "这个年纪再转行，还来得及吗？",
  govOrMarket: "该走公职或大机构，还是留在市场里干？",
  moveAbroad: "该不该为工作搬家或出国？",
  remote: "远程和坐班，哪个更适合我现在？",
  interview: "这场面试能过吗？",
  pickOffer: "多份录用摆在面前，我该选哪份？",
  /** 对应拿走的「现金与股权值不值得签」：看岗位与发展，不看兑现 */
  signOffer: "这份录用，岗位和发展对我合适吗？",
  /** 对应拿走的「期权未来能兑现吗」：看去留，不看股权变现 */
  stayForPromise: "公司许的前途，还要不要留下来等？",
  probation: "试用期能顺利过吗？",
  resume: "我现在这样投，还能进面试吗？",
  internFull: "实习／合同工，转正有没有希望？",
  firstJob: "应届／第一份工作，这份能接吗？",
  hopWindow: "现在跳槽，窗口对不对？",
  restOrLeave: "现在的倦怠，是该休息还是该离开？",
  workLife: "工作与生活怎么摆，才不崩？",
  returnWork: "假回来之后，位置还能不能捡起来？",
  talkUp: "我该怎么跟上级沟通，才争取得到机会？",
  bossView: "老板现在到底怎么看我？",
  sidelined: "我是不是被边缘化了？该怎么办？",
  stealCredit: "同事抢功，我该不该摊开说？",
  burnout: "这份工作压力，我还扛不扛得住？",
  beSeen: "怎样才能被看见？",
  projectWin: "这个项目能做成吗？",
  stuckWhere: "最近工作不顺，核心卡在哪？",
  grabCore: "核心项目该不该去抢？",
  transfer: "被调岗了，接不接？",
  newBoss: "空降领导来了，我该怎么处？",
  reorg: "部门合并／组织调整，我会怎样？",
  leadFit: "我适不适合带团队？",
  leadStuck: "人带不动、事推不动，我该怎么办？",
  reviewRisk: "这次绩效评估会对我不利吗？",
  canPromote: "我这次能升上去吗？",
  negotiate: "该怎么谈薪，才谈得动？",
  bonus: "今年年终奖还发不发得下来？",
  dualTrack: "主业和副业怎么并行，才不容易翻车？",
  sideQuit: "副业做大了，该不该辞全职？",
  startupFail: "创业没做成，我下一步该怎么走？",
  freelance: "自由职业接下来一季，单会不会稳？",
  clientKeep: "这个客户还会不会续约？",
  clientDrop: "该不该结束和这个客户的合作？",
  layoffMe: "公司要裁员，我会不会是那个？",
  layoffNext: "被裁之后，大概多久能找到下一家？",
  layoffFight: "赔偿方案不合理，我该硬刚还是接受？",
  forcedOut: "被逼退／冷处理，我该怎么保全利益？",
  wageDelay: "公司变相降薪或拖欠工资，我该立马走还是先观望？",
  nonCompete: "竞业协议签了，我还能走吗？",
  payCut: "降薪或调岗，我该不该接受？",
  firstLead: "第一次带团队／做主管，我该怎么立威、带出绩效？",
  clique: "下属不服、搞小团体，我该怎么破局？",
  twoBosses: "直属领导和再上一级意见不合，我站哪边？",
  weakBoss: "领导能力不如我，我还值得跟着他吗？",
  teamBudget: "部门被边缘化了，我该怎么为团队争取资源和预算？",
  partnerFight: "我们会不会因为利益撕逼？",
  startupCash: "创业公司现金流紧张，该转型、收缩还是继续坚持？",
  unrelatedJump: "想跨到完全不相关的行业，胜算大吗？",
  personalIp: "做个人品牌／自媒体全职，能养活我自己吗？",
  overseasLong: "拿海外远程或出国工作，对长远发展有利吗？",
  harm: "这份工作是否在伤害我，我该不该离开？",
  counterOffer: "现公司挽留加码，我还走不走？",
  harassment: "被性骚扰／违法指令，该忍、该报、还是该走？",
  familyVsCareer: "家里不让我辞职／换行，听谁的？",
  studyVsWork: "在职读研／进修，会不会把职场节奏拖垮？",
  ageLayoff: "这个年纪被优化，还有没有下家？",
  nPlus: "法定补偿／遣散费给少了，我该争到哪一步？",
  partnerShare: "合伙里的股权，我拿得清、说得清吗？",
} as const;

export const CAREER_FROZEN_CANONICAL: readonly string[] = [
  CAREER_Q.changeField,
  CAREER_Q.stayCompany,
  CAREER_Q.manageOrCraft,
  CAREER_Q.skillGap,
  CAREER_Q.firstStep,
  CAREER_Q.certMoney,
  CAREER_Q.takeProject,
  CAREER_Q.crossTeam,
  CAREER_Q.startup,
  CAREER_Q.partner,
  CAREER_Q.offer,
  CAREER_Q.quitBare,
  CAREER_Q.pip,
  CAREER_Q.payGap,
  CAREER_Q.raiseTalk,
  CAREER_Q.verbalEquity,
  CAREER_Q.promoRace,
  CAREER_Q.layoffPay,
  CAREER_Q.sideGig,
  CAREER_Q.blameEmail,
];

export const CAREER_FRAMEWORK_GROUPS: CareerFrameworkGroup[] = [
  {
    label: "方向与成长",
    keys: ["换行", "转行", "赛道", "能力", "证书", "培训", "天花板", "规划", "方向", "热情", "年纪", "三十五", "四十", "跨行", "不相关", "自媒体", "个人品牌", "在职读研", "在职进修"],
    surface: [
      CAREER_Q.changeField,
      CAREER_Q.manageOrCraft,
      CAREER_Q.skillGap,
      CAREER_Q.firstStep,
      CAREER_Q.certMoney,
      CAREER_Q.ceiling,
      CAREER_Q.yearPlan,
      CAREER_Q.calling,
      CAREER_Q.passionOrPay,
      CAREER_Q.ageJump,
      CAREER_Q.unrelatedJump,
      CAREER_Q.personalIp,
      CAREER_Q.studyVsWork,
    ],
  },
  {
    label: "平台与去向",
    keys: ["体制", "公职", "考公", "出国", "搬家", "远程", "坐班", "外派", "签证", "工作许可", "出海", "海外", "大机构"],
    surface: [CAREER_Q.govOrMarket, CAREER_Q.moveAbroad, CAREER_Q.remote, CAREER_Q.overseasLong],
  },
  {
    label: "求职与录用",
    keys: ["面试", "录用", "试用", "应聘", "多份", "简历", "转正", "应届", "第一份", "该不该接", "岗位"],
    surface: [
      CAREER_Q.interview,
      CAREER_Q.signOffer,
      CAREER_Q.pickOffer,
      CAREER_Q.probation,
      CAREER_Q.resume,
      CAREER_Q.internFull,
      CAREER_Q.firstJob,
    ],
  },
  {
    label: "跳槽与去留",
    keys: ["跳槽", "换公司", "换东家", "裸辞", "离职", "待下去", "窗口", "倦怠", "假回来", "产假", "加班", "工作与生活", "画饼", "前途", "留下来等", "挽留", "加码", "反要约", "家里不让"],
    surface: [
      CAREER_Q.stayCompany,
      CAREER_Q.quitBare,
      CAREER_Q.hopWindow,
      CAREER_Q.stayForPromise,
      CAREER_Q.counterOffer,
      CAREER_Q.familyVsCareer,
      CAREER_Q.restOrLeave,
      CAREER_Q.workLife,
      CAREER_Q.returnWork,
    ],
  },
  {
    label: "上级与团队",
    keys: ["上级", "领导", "老板", "跨部门", "边缘", "压力", "甩锅", "沟通", "同事", "抢功", "贵人", "人脉", "看见", "站哪边", "预算", "资源"],
    surface: [
      CAREER_Q.crossTeam,
      CAREER_Q.blameEmail,
      CAREER_Q.talkUp,
      CAREER_Q.bossView,
      CAREER_Q.sidelined,
      CAREER_Q.stealCredit,
      CAREER_Q.burnout,
      CAREER_Q.beSeen,
      CAREER_Q.twoBosses,
      CAREER_Q.weakBoss,
      CAREER_Q.teamBudget,
    ],
  },
  {
    label: "组织调整",
    keys: ["调岗", "空降", "合并", "组织", "架构", "新领导"],
    surface: [CAREER_Q.transfer, CAREER_Q.newBoss, CAREER_Q.reorg],
  },
  {
    label: "项目与产出",
    keys: ["项目", "接", "做成", "不顺", "卡在", "核心", "抢"],
    surface: [CAREER_Q.takeProject, CAREER_Q.projectWin, CAREER_Q.stuckWhere, CAREER_Q.grabCore],
  },
  {
    label: "带团队",
    keys: ["带团队", "带人", "带不动", "管人", "下属", "立威", "小团体", "不服", "第一次"],
    surface: [CAREER_Q.leadFit, CAREER_Q.leadStuck, CAREER_Q.firstLead, CAREER_Q.clique],
  },
  {
    label: "考核与晋升",
    keys: ["绩效", "晋升", "升职", "观察期", "改进计划", "名额", "评估"],
    surface: [CAREER_Q.pip, CAREER_Q.promoRace, CAREER_Q.reviewRisk, CAREER_Q.canPromote],
  },
  {
    label: "薪酬谈判",
    keys: ["加薪", "谈薪", "同工", "股权", "奖金", "面谈", "年终奖"],
    surface: [CAREER_Q.payGap, CAREER_Q.raiseTalk, CAREER_Q.verbalEquity, CAREER_Q.negotiate, CAREER_Q.bonus],
  },
  {
    label: "创业与副业",
    keys: ["创业", "副业", "合伙", "兼职", "并行", "失败", "辞全职", "撕逼", "现金流", "收缩", "股权"],
    surface: [
      CAREER_Q.startup,
      CAREER_Q.partner,
      CAREER_Q.dualTrack,
      CAREER_Q.sideQuit,
      CAREER_Q.startupFail,
      CAREER_Q.partnerFight,
      CAREER_Q.startupCash,
      CAREER_Q.partnerShare,
    ],
  },
  {
    label: "自由职业与客户",
    keys: ["自由职业", "接单", "客户", "续约", "炒客户"],
    surface: [CAREER_Q.freelance, CAREER_Q.clientKeep, CAREER_Q.clientDrop],
  },
  {
    label: "裁员风险与合规",
    keys: ["裁员", "被裁", "补偿", "赔偿", "遣散", "私活", "违约", "竞业", "劳动合同", "降薪", "仲裁", "优化", "硬刚", "逼退", "冷处理", "欠薪", "拖欠", "这个年纪被裁"],
    surface: [
      CAREER_Q.layoffPay,
      CAREER_Q.sideGig,
      CAREER_Q.layoffMe,
      CAREER_Q.layoffNext,
      CAREER_Q.layoffFight,
      CAREER_Q.forcedOut,
      CAREER_Q.wageDelay,
      CAREER_Q.nonCompete,
      CAREER_Q.payCut,
      CAREER_Q.ageLayoff,
      CAREER_Q.nPlus,
    ],
  },
  {
    label: "职场安全",
    keys: ["伤害", "霸凌", "精神操控", "安全", "违法", "有毒", "穿小鞋", "性骚扰", "违法指令", "举报", "揭发"],
    surface: [CAREER_Q.harm, CAREER_Q.harassment],
  },
];

/** 例子区二次筛选（不改归类格子，只收口展示） */
export type CareerFilterTab = {
  id: string;
  label: string;
  /** 对应 CAREER_FRAMEWORK_GROUPS.label；空则看 surface */
  groupLabels: readonly string[];
  /** 有则直接用这批例子，不再铺开该组全部格子 */
  surface?: readonly string[];
};

/** 打开例子时默认看到的高频刀口，不是 81 条全铺 */
export const CAREER_FEATURED_SURFACE: readonly string[] = [
  CAREER_Q.interview,
  CAREER_Q.signOffer,
  CAREER_Q.hopWindow,
  CAREER_Q.canPromote,
  CAREER_Q.negotiate,
  CAREER_Q.layoffMe,
  CAREER_Q.layoffFight,
  CAREER_Q.leadFit,
  CAREER_Q.bossView,
  CAREER_Q.startup,
  CAREER_Q.stayForPromise,
  CAREER_Q.unrelatedJump,
  CAREER_Q.personalIp,
  CAREER_Q.stayCompany,
];

export const CAREER_FILTER_TABS: readonly CareerFilterTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: CAREER_FEATURED_SURFACE },
  { id: "hire", label: "入职/面试", groupLabels: ["求职与录用"] },
  { id: "promo", label: "升职/加薪", groupLabels: ["考核与晋升", "薪酬谈判"] },
  {
    id: "layoff",
    label: "裁员/赔偿",
    groupLabels: ["裁员风险与合规", "职场安全"],
    surface: [
      CAREER_Q.layoffMe,
      CAREER_Q.nPlus,
      CAREER_Q.layoffFight,
      CAREER_Q.forcedOut,
      CAREER_Q.wageDelay,
    ],
  },
  {
    id: "lead",
    label: "管理/向上",
    groupLabels: ["带团队", "上级与团队", "组织调整", "项目与产出"],
    surface: [CAREER_Q.firstLead, CAREER_Q.clique, CAREER_Q.twoBosses, CAREER_Q.teamBudget],
  },
  {
    id: "startup",
    label: "合伙/利益",
    groupLabels: ["创业与副业", "自由职业与客户"],
    surface: [CAREER_Q.partnerFight, CAREER_Q.partnerShare, CAREER_Q.partner, CAREER_Q.startupCash],
  },
  {
    id: "pivot",
    label: "跨行/新兴",
    groupLabels: ["方向与成长", "平台与去向", "跳槽与去留"],
    surface: [CAREER_Q.unrelatedJump, CAREER_Q.personalIp, CAREER_Q.overseasLong, CAREER_Q.changeField],
  },
];

export const CAREER_DEFAULT_FILTER_ID = "hot";

export function careerSurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  const tab = CAREER_FILTER_TABS.find((t) => t.id === filterId) ?? CAREER_FILTER_TABS[0];
  if (tab?.surface?.length) return [...tab.surface];
  if (!tab || tab.groupLabels.length === 0) {
    return groups.flatMap((g) => [...g.surface]);
  }
  const want = new Set(tab.groupLabels);
  return groups.filter((g) => want.has(g.label)).flatMap((g) => [...g.surface]);
}
