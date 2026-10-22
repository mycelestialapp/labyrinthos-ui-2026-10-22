import { makeWesternDir, wg } from "./types";

const C = "财运投资";

const Q = {
  month: "这个月钱还过得去吗？",
  bills: "账单堆在一起，先处理哪一头？",
  rent: "房租又涨，续租还是搬走？",
  debt: "信用卡／贷款，先还哪一笔能喘口气？",
  emergency: "应急金够不够撑过下一季？",
  raise: "该不该开口要加薪？",
  extra: "多出来的钱，先还债还是先投？",
  invest: "这笔投资现在该进还是该等？",
  hold: "已经亏的仓，割还是拿着？",
  crypto: "朋友拉我进的币／项目，跟不跟？",
  advisor: "这个理财建议，信不信得过？",
  house: "现在买房／换房，窗口对不对？",
  car: "这台车／这笔大件，该买还是再等？",
  partner: "和伴侣的钱要不要合并、怎么谈？",
  lend: "借出去的钱看样子回不来，还追不追？",
  family: "家人开口要钱，这次给不给？",
  scam: "我会不会正在被骗钱？",
  side: "副业这笔，能补上缺口吗？",
  tax: "税务／退税这件事，要不要找人看？",
  insure: "保险该续、该换，还是先别动？",
  inherit: "遗产／家人的钱，我该怎么站位？",
  spend: "想买的这件，是需要还是想填空虚？",
  save: "存钱计划总被打乱，卡在哪？",
  credit: "信用分数这件事，现在最该动哪一步？",
  retire: "退休账户现在加还是先顾眼前？",
  business: "把钱投进自己的生意，押不押？",
  split: "分手／分开后钱怎么切，我会不会亏？",
  gift: "大额送礼／随份子，这次还要不要跟？",
  jobPay: "为了钱留下，还是为了健康走？",
  abundance: "我缺的是机会，还是我不敢收钱？",
  overdraft: "账户又要透支，先砍哪一笔订阅／开销？",
  roommateRent: "合租分摊不公，现在摊开说吗？",
  sideFail: "副业这月又没进账，还要不要砸时间？",
  index: "长期定投还坚持吗，还是市场把我吓停了？",
  foomo: "别人都在赚钱，我是不是错过了？",
  downPay: "首付还差一截，现在硬买还是再等？",
  refi: "房贷／车贷再谈条件，窗口在不在？",
  jointCard: "和伴侣办联名账户，现在合适吗？",
  secretSpend: "对方瞒着花钱，我该不该摊开账本？",
  sideHustleTax: "副业收入要不要报税、怎么报才不踩？",
  charity: "捐／赞助这口，现在给得动吗？",
  moveCost: "搬家成本会不会把存款掏空？",
  budget: "记账总坚持不了，卡在羞耻还是方法？",
  rainDay: "应急金目标订多少，才不会吓到自己？",
  weddingMoney: "婚礼／庆典这笔，谁出、出多少，现在谈吗？",
  kidCost: "要不要为将来的养育先改现在的花钱？",
  sideClient: "这个副业客户，接了会不会把主业砸了？",
};

export const WESTERN_MONEY_GROUPS = [
  wg(C, "账单与过月", ["这个月", "账单", "房租", "应急"], [
    Q.month, Q.bills, Q.rent, Q.emergency, Q.save, Q.spend, Q.overdraft, Q.roommateRent, Q.budget, Q.rainDay,
  ]),
  wg(C, "债务与信用", ["债", "信用卡", "信用"], [
    Q.debt, Q.credit, Q.extra, Q.tax, Q.sideHustleTax, Q.refi,
  ]),
  wg(C, "投资与风险", ["投资", "亏", "币", "理财"], [
    Q.invest, Q.hold, Q.crypto, Q.advisor, Q.retire, Q.business, Q.index, Q.foomo,
  ]),
  wg(C, "收入与加薪", ["加薪", "副业", "留下"], [
    Q.raise, Q.side, Q.jobPay, Q.abundance, Q.sideFail, Q.sideClient,
  ]),
  wg(C, "大额买房买车", ["房", "车", "保险"], [
    Q.house, Q.car, Q.insure, Q.downPay, Q.moveCost,
  ]),
  wg(C, "伴侣家人与钱", ["伴侣", "家人", "借", "遗产"], [
    Q.partner, Q.lend, Q.family, Q.inherit, Q.split, Q.gift, Q.jointCard, Q.secretSpend, Q.charity, Q.weddingMoney, Q.kidCost,
  ]),
  wg(C, "被骗与边界", ["骗", "信不过"], [
    Q.scam, Q.advisor, Q.crypto,
  ]),
];

export const WESTERN_MONEY_DIR = makeWesternDir(
  [
    Q.month, Q.debt, Q.invest, Q.raise, Q.house, Q.scam,
    Q.partner, Q.rent, Q.hold, Q.extra, Q.emergency, Q.spend,
  ],
  WESTERN_MONEY_GROUPS,
  [
    { id: "cash", label: "账单/过月", groupLabels: ["账单与过月", "债务与信用"] },
    { id: "inv", label: "投资/风险", groupLabels: ["投资与风险", "被骗与边界"] },
    { id: "earn", label: "加薪/收入", groupLabels: ["收入与加薪"] },
    { id: "big", label: "房/车/保险", groupLabels: ["大额买房买车"] },
    { id: "people", label: "伴侣/家人", groupLabels: ["伴侣家人与钱"] },
  ],
  "西方人问钱，多半是：这个月过不过得去、债先还哪头、这笔投不投、该不该谈加薪。牌面看取舍，不报点位。",
);
