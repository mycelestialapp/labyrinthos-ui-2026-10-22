import { makeWesternDir, wg } from "./types";

const C = "其他";

const Q = {
  now: "我现在最该看的是哪一件事？",
  timing: "这件事的时机到了吗？",
  hidden: "有什么我没看见的？",
  months: "接下来三个月，主线是什么？",
  wait: "该再等，还是该动手？",
  invest: "这件事还值不值得我投入？",
  people: "这件事里，谁是关键？",
  risk: "最大的风险在哪？",
  help: "我该自己扛，还是该开口求助？",
  truth: "我最不想面对的那句实话是什么？",
  next: "明天只做一件，该做哪件？",
  pattern: "生活里反复出现的这个主题，要我改什么？",
  luck: "最近这一阵，是窗口还是乱流？",
  close: "该不该把这章翻过去？",
  start: "新的一章，现在开得动吗？",
  energy: "我的精力现在最该给谁、给哪件事？",
  unknown: "未知的那一块，我能带着走吗？",
  yesno: "如果只能选推进或停止，现在是哪边？",
  delay: "我一拖再拖的那件，今晚动哪一小步？",
  bodyOther: "身体已经烦了，这件事还硬上吗？",
  ally: "这件事里谁能当同盟，我开口了没？",
  weather: "这阵子的「运气」，是窗口还是我状态不好？",
  firstDomino: "先推倒哪一张骨牌，后面才会动？",
  secret: "我瞒着的那件事，现在揭开还是再藏？",
  invitation: "这张邀请／机会，是礼物还是钩子？",
};

export const WESTERN_OTHER_GROUPS = [
  wg(C, "现在看哪件", ["最该看", "明天一件", "精力"], [
    Q.now, Q.next, Q.energy, Q.people, Q.help, Q.delay, Q.ally, Q.firstDomino,
  ]),
  wg(C, "时机与窗口", ["时机", "等", "三个月", "窗口"], [
    Q.timing, Q.wait, Q.months, Q.luck, Q.start, Q.close, Q.weather, Q.invitation,
  ]),
  wg(C, "没看见的", ["没看见", "风险", "实话", "主题"], [
    Q.hidden, Q.risk, Q.truth, Q.pattern, Q.unknown, Q.yesno, Q.invest, Q.bodyOther, Q.secret,
  ]),
];

export const WESTERN_OTHER_DIR = makeWesternDir(
  [
    Q.now, Q.timing, Q.hidden, Q.months, Q.wait, Q.invest,
    Q.truth, Q.next, Q.yesno, Q.luck, Q.help, Q.close,
  ],
  WESTERN_OTHER_GROUPS,
  [
    { id: "now", label: "现在看哪件", groupLabels: ["现在看哪件"] },
    { id: "when", label: "时机/窗口", groupLabels: ["时机与窗口"] },
    { id: "hid", label: "没看见的", groupLabels: ["没看见的"] },
  ],
  "归不到上面那些类时用：现在最该看哪件、时机到了没、有什么没看见的。问具体，牌才答得动。牌面看这一步。",
);
