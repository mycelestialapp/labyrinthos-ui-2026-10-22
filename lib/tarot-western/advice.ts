import { makeWesternDir, wg } from "./types";

const C = "人生建议";

const Q = {
  hear: "我现在最该听的是哪一句？",
  theme: "这个人生阶段的主线是什么？",
  busy: "忙碌是不是在躲某件事？",
  next: "下一步最该认真对待的是哪一件？",
  drop: "当下最该放下的是什么？",
  future: "五年后的我会怎么劝现在的我？",
  true: "我是在过自己的日子，还是在演给别人看？",
  regret: "我最不想留下的遗憾是什么？",
  values: "面对选择时，哪条价值观现在必须站前？",
  chapter: "这一章该结束了吗？",
  gift: "我一直没用上的那部分自己，现在用在哪？",
  rest: "我是该冲，还是该给自己一个冬天？",
  people: "谁该进入我的下一段，谁该留在上一段？",
  enough: "怎样才算对现在的自己「够了」？",
  meaning: "什么让我感到活着，而不只是把日子过完？",
  delayed: "那件一直拖的事，其实在叫我去哪？",
  role: "别人要我成为的人，和我想成为的人，差在哪？",
  today: "如果今天只能改一件生活安排，改哪件？",
  no: "我最该学会说不的是哪一件？",
  yes: "我最该学会答应自己的是哪一件？",
  comparisonLife: "我羡慕的那种生活，真的是我想要的吗？",
  bodyClock: "我的精力高峰在哪一段，安排有没有反着来？",
  thirty: "这个年纪的焦虑，是真实期限，还是别人的时间表？",
  legacy: "我想被记得的，不是头衔，是哪一件待人的方式？",
  hobby: "那件只为自己高兴的事，为什么总排到最后？",
  home: "什么样的日常，才算我能住进去的生活？",
  courage: "勇气现在该用在开口，还是用在离开？",
  small: "不必改天换地，最小的诚实一步是什么？",
  season: "我是在春天该种，还是在冬天该养？",
  lonely: "独处是充电，还是我在罚自己？",
};

export const WESTERN_ADVICE_GROUPS = [
  wg(C, "主线与下一件", ["主线", "下一件", "听哪句", "章节"], [
    Q.hear, Q.theme, Q.next, Q.chapter, Q.today, Q.values, Q.no, Q.yes, Q.bodyClock, Q.small, Q.season,
  ]),
  wg(C, "真实与遗憾", ["演给别人", "遗憾", "活着", "角色"], [
    Q.true, Q.regret, Q.meaning, Q.role, Q.future, Q.enough, Q.comparisonLife, Q.legacy, Q.thirty,
  ]),
  wg(C, "放下与躲藏", ["放下", "忙碌", "拖", "冲还是冬"], [
    Q.drop, Q.busy, Q.delayed, Q.rest, Q.gift, Q.people, Q.hobby, Q.home, Q.courage, Q.lonely,
  ]),
];

export const WESTERN_ADVICE_DIR = makeWesternDir(
  [
    Q.hear, Q.theme, Q.busy, Q.next, Q.drop, Q.future,
    Q.true, Q.chapter, Q.delayed, Q.meaning, Q.rest, Q.role, Q.no, Q.small,
  ],
  WESTERN_ADVICE_GROUPS,
  [
    { id: "now", label: "主线/下一件", groupLabels: ["主线与下一件"] },
    { id: "true", label: "真实/遗憾", groupLabels: ["真实与遗憾"] },
    { id: "drop", label: "放下/躲藏", groupLabels: ["放下与躲藏"] },
  ],
  "西方人问人生建议，多半是：现在最该听哪句、主线是什么、忙碌是不是在躲、下一步认真哪件。落到能做的一步。",
);
