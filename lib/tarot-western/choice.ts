import { makeWesternDir, wg } from "./types";

const C = "选择决策";

const Q = {
  two: "两条路摆在面前，选哪条？",
  must: "现在必须定吗，还是可以再等？",
  miss: "再等会不会错过？",
  gut: "听直觉，还是听利弊清单？",
  fear: "拦着我的是害怕，还是真的不对？",
  regret: "选完会后悔吗？",
  first: "今晚先做哪一步，才不算空转？",
  both: "两条路还能不能并着走一段时间？",
  offer: "两份工作／两个机会，选哪个？",
  city: "留在这城，还是去另一座？",
  love: "为这段感情改计划，值不值？",
  sayNo: "这句拒绝，今晚说不说？",
  sign: "这份合同／协议，签不签？",
  money: "这笔钱现在动，还是按住？",
  people: "听家里的、听朋友的，还是听自己的？",
  deadline: "截止日期到了，我还改不改主意？",
  trial: "能不能先试一小段，再下大注？",
  undo: "选了之后，还有没有退路？",
  hidden: "有什么我现在没看见的？",
  enough: "信息已经够了，还是我在假装还要再查？",
  identity: "这个选择会把我变成谁？",
  safe: "选安全的，还是选真的？",
  timing: "是选项不对，还是时机不对？",
  third: "是不是其实有第三条路？",
  coin: "两头一样难受，是不是该先睡一晚再定？",
  peoplePlease: "我是在选给我自己，还是在选给别人看？",
  sunk: "已经投进去的，会不会绑住我不敢改？",
  fomoChoice: "我是怕选错，还是怕别人觉得我选错？",
  bodyVote: "身体已经有答案了，我还在装没看见吗？",
  smallTest: "48 小时内能做的最小试验是什么？",
  tellWho: "决定之前，该不该先告诉会受影响的人？",
  reverse: "如果选另一边，最坏是什么、我扛得住吗？",
  values: "哪条路更靠近我真正在乎的？",
  pause: "暂停一周，会不会比硬定更清楚？",
  email: "这封邮件／消息发出去就没法收回，今晚发吗？",
  three: "三个选项里，哪个是我假装不存在的？",
  laterMe: "一年后的我会感谢现在哪一个选择？",
  cost: "不选的代价，我有没有算进账里？",
};

export const WESTERN_CHOICE_GROUPS = [
  wg(C, "两条路与时机", ["两条路", "必须定", "错过", "第三条"], [
    Q.two, Q.must, Q.miss, Q.both, Q.deadline, Q.third, Q.timing, Q.coin, Q.pause, Q.sunk, Q.three, Q.laterMe, Q.cost,
  ]),
  wg(C, "直觉与害怕", ["直觉", "害怕", "没看见", "信息"], [
    Q.gut, Q.fear, Q.hidden, Q.enough, Q.regret, Q.fomoChoice, Q.bodyVote, Q.reverse, Q.values,
  ]),
  wg(C, "工作与城市", ["工作", "城市", "试"], [
    Q.offer, Q.city, Q.trial, Q.undo, Q.smallTest,
  ]),
  wg(C, "感情与拒绝", ["感情", "拒绝", "听谁"], [
    Q.love, Q.sayNo, Q.people, Q.peoplePlease, Q.tellWho,
  ]),
  wg(C, "签字与钱", ["签", "钱", "安全还是真"], [
    Q.sign, Q.money, Q.safe, Q.identity, Q.first, Q.sunk, Q.email,
  ]),
];

export const WESTERN_CHOICE_DIR = makeWesternDir(
  [
    Q.two, Q.must, Q.gut, Q.fear, Q.offer, Q.sign,
    Q.miss, Q.hidden, Q.sayNo, Q.first, Q.safe, Q.third,
  ],
  WESTERN_CHOICE_GROUPS,
  [
    { id: "two", label: "两条路/时机", groupLabels: ["两条路与时机"] },
    { id: "gut", label: "直觉/害怕", groupLabels: ["直觉与害怕"] },
    { id: "job", label: "工作/城市", groupLabels: ["工作与城市"] },
    { id: "love", label: "感情/拒绝", groupLabels: ["感情与拒绝"] },
    { id: "sign", label: "签字/钱", groupLabels: ["签字与钱"] },
  ],
  "西方人问选择，多半是：两条路选哪条、现在必须定吗、是害怕还是真不对、有没有我没看见的。牌面看选项和退出成本。",
);
