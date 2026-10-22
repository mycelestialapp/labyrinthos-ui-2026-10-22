import { makeWesternDir, wg } from "./types";

const C = "人际关系";

const Q = {
  friend: "这段友谊还能处下去吗？",
  oneSided: "是不是只有我在维持？",
  drift: "我们慢慢淡了，该不该主动捡回来？",
  fight: "吵完之后，该不该先道歉？",
  boundary: "这句界限，说不说得出口？",
  toxic: "这段对人，是该减接触还是直接断？",
  family: "家人这事，今晚怎么开口？",
  inlaw: "另一半家里这层，我该硬还是该软？",
  sibling: "和兄弟姐妹这结，还能解开吗？",
  parent: "父母把我当小孩，该不该摊开说？",
  coworker: "同事背后说我，现在该点破吗？",
  bossRel: "和上司这层私人关系，还要不要靠近？",
  gossip: "圈子里的话，我要不要回应？",
  lonely: "我是真缺朋友，还是缺被理解？",
  newFriend: "这个新认识的人，值得投入吗？",
  group: "这个朋友局／社群，我还去不去？",
  forgive: "原谅对方，是为关系还是为让自己好过？",
  cut: "绝交之后，我会不会后悔？",
  triangle: "三个人里我被夹在中间，站哪边？",
  text: "已读不回，我还要不要再问一句？",
  help: "对方开口求助，这次帮不帮、帮到哪？",
  envy: "我酸朋友的成功，这件事怎么处理？",
  reunion: "多年没见，这次重逢该不该去？",
  roommate: "合租这层，还处得下去吗？",
  bestie: "最好的那个朋友，最近为什么变了？",
  groupChat: "这个群让我累，退还是静音？",
  birthday: "对方没记得我的日子，要不要说？",
  holidayFam: "节日回家，我该待多久、怎么挡话题？",
  parentMoney: "父母用钱／愧疚管我，这句界限怎么说？",
  slack: "工作群里被阴阳，回还是截图备案？",
  afterWork: "同事局我还去不去，会不会被当不合群？",
  mute: "把对方静音，是保护还是逃避？",
  doubleText: "已读两天了，再发一条是关心还是掉价？",
  weddingParty: "婚礼不请我／请了不想去，怎么回？",
  caregiver: "家里要我当照顾的人，我还能不能留一块给自己？",
  politics: "价值观差太大，友谊还处吗？",
  cancel: "圈子要我站队，我站不站、怎么站？",
};

export const WESTERN_REL_GROUPS = [
  wg(C, "友谊", ["朋友", "淡了", "单向", "新朋友"], [
    Q.friend, Q.oneSided, Q.drift, Q.newFriend, Q.group, Q.reunion, Q.envy, Q.bestie, Q.groupChat, Q.birthday, Q.doubleText, Q.politics, Q.weddingParty,
  ]),
  wg(C, "家人姻亲", ["家人", "父母", "兄弟姐妹", "另一半家"], [
    Q.family, Q.inlaw, Q.sibling, Q.parent, Q.holidayFam, Q.parentMoney, Q.caregiver,
  ]),
  wg(C, "职场人际", ["同事", "上司", "圈子", "合租"], [
    Q.coworker, Q.bossRel, Q.gossip, Q.roommate, Q.triangle, Q.slack, Q.afterWork,
  ]),
  wg(C, "界限与切断", ["界限", "绝交", "原谅", "帮"], [
    Q.boundary, Q.toxic, Q.cut, Q.forgive, Q.help, Q.fight, Q.text, Q.mute, Q.cancel,
  ]),
  wg(C, "孤独与圈子", ["孤独", "社群"], [
    Q.lonely, Q.group, Q.newFriend,
  ]),
];

export const WESTERN_REL_DIR = makeWesternDir(
  [
    Q.friend, Q.boundary, Q.family, Q.coworker, Q.toxic, Q.fight,
    Q.lonely, Q.cut, Q.oneSided, Q.text, Q.inlaw, Q.help,
  ],
  WESTERN_REL_GROUPS,
  [
    { id: "friend", label: "友谊", groupLabels: ["友谊"] },
    { id: "fam", label: "家人", groupLabels: ["家人姻亲"] },
    { id: "work", label: "职场人际", groupLabels: ["职场人际"] },
    { id: "line", label: "界限/切断", groupLabels: ["界限与切断"] },
    { id: "alone", label: "孤独/圈子", groupLabels: ["孤独与圈子"] },
  ],
  "西方人问人际，多半是：这段友谊还处不处、界限说不说、家人怎么开口、同事这层点不点破。牌面看边界，改不了对方。",
);
