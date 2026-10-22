import { makeWesternDir, wg } from "./types";

const C = "出行迁居";

const Q = {
  move: "该不该搬家？",
  city: "这座新城市，适合我吗？",
  stay: "留下来，还是回原来的地方？",
  jobMove: "为工作搬走，值得吗？",
  loveMove: "为这段感情搬走，值得吗？",
  roommates: "和新室友／新邻居，处得来吗？",
  lease: "这份租约，签不签？",
  trip: "这趟旅行顺利吗？",
  cancel: "这趟还去不去，还是该退？",
  alone: "一个人走，安不安全、开不开心？",
  with: "和这个人一起走，会不会把旅途走崩？",
  visa: "签证／入境这关，过得去吗？",
  immigrate: "移民／长期留下，这条还押不押？",
  timing: "该现在走，还是再等一个窗口？",
  home: "想家是信号，还是只是不适应？",
  risk: "路上最该小心的是哪一段？",
  workTrip: "这趟出差，去了对我有没有用？",
  holiday: "假期这样安排，会不会后悔？",
  sell: "把现在的住处处理掉，时机对不对？",
  longStay: "数字游民／暂住几个月，适合我现在吗？",
  flight: "改签／换行程，现在动还来得及吗？",
  culture: "文化差异这层，我会不会待不住？",
  neighborhood: "这个街区／治安，我住得安心吗？",
  deposit: "押金和中介这层，签了会不会被坑？",
  pack: "东西太多搬不动，先扔哪些？",
  weatherTrip: "天气／罢工会不会打乱这趟？",
  insuranceTrip: "旅行保险这口，买不买？",
  jetlag: "时差回来，第一周工作扛得住吗？",
  border: "海关／边境这关，我有没有该准备的？",
  sublet: "转租／分租这层，信得过对方吗？",
  homesickTrip: "假期回家，是充电还是又要被旧角色吸干？",
};

export const WESTERN_TRAVEL_GROUPS = [
  wg(C, "搬家安家", ["搬家", "城市", "租约", "室友"], [
    Q.move, Q.city, Q.stay, Q.lease, Q.roommates, Q.sell, Q.home, Q.neighborhood, Q.deposit, Q.pack, Q.sublet,
  ]),
  wg(C, "为工作或感情走", ["工作搬", "感情搬", "移民"], [
    Q.jobMove, Q.loveMove, Q.immigrate, Q.longStay, Q.culture,
  ]),
  wg(C, "旅行出差", ["旅行", "去不去", "出差", "假期"], [
    Q.trip, Q.cancel, Q.alone, Q.with, Q.workTrip, Q.holiday, Q.flight, Q.weatherTrip, Q.insuranceTrip, Q.jetlag, Q.homesickTrip,
  ]),
  wg(C, "时机与路上", ["现在走", "签证", "小心"], [
    Q.timing, Q.visa, Q.risk, Q.border,
  ]),
];

export const WESTERN_TRAVEL_DIR = makeWesternDir(
  [
    Q.move, Q.trip, Q.jobMove, Q.loveMove, Q.city, Q.timing,
    Q.visa, Q.cancel, Q.stay, Q.alone, Q.immigrate, Q.risk,
  ],
  WESTERN_TRAVEL_GROUPS,
  [
    { id: "home", label: "搬家/安家", groupLabels: ["搬家安家"] },
    { id: "why", label: "为工作/感情", groupLabels: ["为工作或感情走"] },
    { id: "trip", label: "旅行/出差", groupLabels: ["旅行出差"] },
    { id: "when", label: "时机/路上", groupLabels: ["时机与路上"] },
  ],
  "西方人问出行，多半是：该不该搬、这趟去不去、为工作或感情搬走值不值、签证顺不顺。牌面看走与留。",
);
