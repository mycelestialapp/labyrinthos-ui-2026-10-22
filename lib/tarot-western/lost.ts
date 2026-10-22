import { makeWesternDir, wg } from "./types";

const C = "失物寻找";

const Q = {
  find: "丢的东西还能找回吗？",
  where: "该往哪一层、哪个方向找？",
  home: "会不会其实还在家里／包里？",
  last: "最后一次确定看见，是在哪？",
  retrace: "该不该按来时的路再走一遍？",
  stolen: "是自己弄丢了，还是被人拿走了？",
  borrow: "是不是借出去忘了，该先问一圈人？",
  track: "定位还亮着，现在追不追得上？",
  cards: "钱包／卡，先冻卡还是再找一夜？",
  keys: "钥匙丢了，今晚先换锁吗？",
  phone: "手机还能不能找回来？",
  giveUp: "找不到了，该不该放弃、先买替用？",
  venue: "店里／场馆失物招领，现在问还来得及吗？",
  ride: "车上那一格，平台还能不能问到司机？",
  gym: "更衣室／柜子那一层，现在回去还来得及吗？",
  airport: "安检／托运那一段，今晚还问得动吗？",
  sofa: "沙发缝、口袋、脏衣袋，还要再翻一遍吗？",
  post: "在群里发一条寻物，还会有人理吗？",
  insurance: "为保险留记录要不要写一笔，还是先冻卡／开定位？",
  police: "明确被偷或很贵重时，该不该报警备案？",
  passport: "旅行证件找不到，先补办还是再翻一宿？",
  laptop: "电脑／硬盘，数据还在不在云里？",
  account: "账号登不上了，先改密还是先当被拿走？",
  roommate: "合住的人神色不对，开门见山问吗？",
  same: "会不会就在我每天经过的那一格？",
  pockets: "外套口袋、备用包、车门槽，还要不要再掏一遍？",
  laundry: "会不会进洗衣机／干衣机了？",
  office: "工位／会议室那一层，今晚还问得完吗？",
  kids: "会不会被小孩／客人随手放了？",
  findMy: "定位显示在某栋楼，现在去还来得及吗？",
  backup: "云备份／相册里，今晚还找得到那份吗？",
  walletChain: "卡冻了以后，钱包本体还值得找吗？",
  airTag: "追踪器还在动，跟着去安不安全？",
  hotel: "酒店前台／打扫过的房间，再查一次？",
  bar: "酒吧／聚会最后看到，群里问还是私聊主人？",
  uber: "网约车行程已结束，平台代问还问得动吗？",
  train: "火车／地铁座位下，失物处现在还开着吗？",
  beach: "户外／沙滩那一格，回头找还来得及吗？",
  serial: "序列号我还留着，报出去会不会让倒卖跑更快？",
  replacePhone: "先买备用机，还是再等找回？",
  photos: "唯一的照片／纪念品，还有没有备份？",
  coatCheck: "衣帽间／寄存，凭票还能不能取？",
};

export const WESTERN_LOST_GROUPS = [
  wg(C, "还能找回吗", ["找回", "放弃", "替用"], [
    Q.find, Q.phone, Q.giveUp, Q.passport, Q.replacePhone, Q.walletChain, Q.photos,
  ]),
  wg(C, "往哪找", ["哪里", "家里", "来路", "最后看见"], [
    Q.where, Q.home, Q.last, Q.retrace, Q.sofa, Q.same, Q.borrow, Q.pockets, Q.laundry, Q.office, Q.kids,
  ]),
  wg(C, "丢了还是被偷", ["被偷", "拿走", "合住"], [
    Q.stolen, Q.roommate, Q.police, Q.insurance, Q.serial,
  ]),
  wg(C, "手机卡钥匙", ["定位", "冻卡", "换锁", "账号"], [
    Q.track, Q.cards, Q.keys, Q.account, Q.laptop, Q.findMy, Q.backup, Q.airTag,
  ]),
  wg(C, "出门丢的", ["店里", "车", "机场", "寻物"], [
    Q.venue, Q.ride, Q.gym, Q.airport, Q.post, Q.hotel, Q.bar, Q.uber, Q.train, Q.beach, Q.coatCheck,
  ]),
];

export const WESTERN_LOST_DIR = makeWesternDir(
  [
    Q.find, Q.where, Q.home, Q.stolen, Q.track, Q.borrow,
    Q.giveUp, Q.cards, Q.keys, Q.last, Q.venue, Q.retrace,
  ],
  WESTERN_LOST_GROUPS,
  [
    { id: "back", label: "能否找回", groupLabels: ["还能找回吗"] },
    { id: "where", label: "往哪找", groupLabels: ["往哪找"] },
    { id: "taken", label: "丢了还是被偷", groupLabels: ["丢了还是被偷"] },
    { id: "kit", label: "手机/卡/钥匙", groupLabels: ["手机卡钥匙"] },
    { id: "out", label: "出门丢的", groupLabels: ["出门丢的"] },
  ],
  "西方人找东西：先问还能不能找回、往哪找、丢了还是被偷。手机先开定位，卡先挂失；报警帮不上找回，只在被偷或很贵重时才问那一条。",
);
