import { makeWesternDir, wg } from "./types";

const C = "宠物";

const Q = {
  sick: "它是生病了吗？",
  vet: "现在该不该送去看兽医？",
  wait: "再观察一晚，还是今天就去？",
  eat: "不吃东西这件事，严不严重？",
  behave: "行为突然变了，是身体还是情绪？",
  lost: "它走丢了，还能找回来吗？",
  where: "走丢了该先往哪找？",
  adopt: "该不该再接一只回来？",
  fit: "这只和家里现在的它，处得来吗？",
  train: "训练／纠正这步，现在做还有效吗？",
  anxiety: "它的分离焦虑，我今晚先改哪一件？",
  food: "换粮／换护理，现在动合适吗？",
  cost: "这笔治疗费，还押不押？",
  quality: "继续治，是为它好，还是为我舍不得？",
  move: "搬家／旅行，它跟不跟得动？",
  board: "寄养这几天，它安不安全、开不开心？",
  grief: "失去它之后，我怎么走？",
  bond: "我们的连接现在顺不顺？",
  allergy: "人对它过敏／冲突，留下还是重新安排？",
  rescue: "救助来的这只，我接得住吗？",
  chip: "芯片／定位还亮吗，今晚追不追？",
  shelter: "该去收容所／附近海报，还是先等消息？",
  bark: "叫、咬、乱尿，是训练问题还是身体？",
  aloneHours: "白天它独自在家的时间，还撑得住吗？",
  newHome: "新家它适应得了吗，今晚先布置哪一角？",
  otherPet: "两只处不来，分开养还是再请人看？",
};

export const WESTERN_PET_GROUPS = [
  wg(C, "健康送医", ["病", "兽医", "不吃", "治疗费"], [
    Q.sick, Q.vet, Q.wait, Q.eat, Q.cost, Q.quality,
  ]),
  wg(C, "行为与相处", ["行为", "训练", "焦虑", "连接"], [
    Q.behave, Q.train, Q.anxiety, Q.bond, Q.food, Q.allergy, Q.bark, Q.aloneHours,
  ]),
  wg(C, "走丢与找", ["走丢", "往哪找"], [
    Q.lost, Q.where, Q.chip, Q.shelter,
  ]),
  wg(C, "新成员与变动", ["再养", "搬家", "寄养", "救助"], [
    Q.adopt, Q.fit, Q.move, Q.board, Q.rescue, Q.grief, Q.newHome, Q.otherPet,
  ]),
];

export const WESTERN_PET_DIR = makeWesternDir(
  [
    Q.sick, Q.vet, Q.lost, Q.behave, Q.adopt, Q.wait,
    Q.where, Q.bond, Q.cost, Q.train, Q.eat, Q.move,
  ],
  WESTERN_PET_GROUPS,
  [
    { id: "vet", label: "生病/送医", groupLabels: ["健康送医"] },
    { id: "act", label: "行为/相处", groupLabels: ["行为与相处"] },
    { id: "lost", label: "走丢", groupLabels: ["走丢与找"] },
    { id: "new", label: "新成员/变动", groupLabels: ["新成员与变动"] },
  ],
  "西方人问宠物，多半是：它是不是病了、现在送不送医、走丢了还能不能找回来。牌面看照护取舍，替代不了兽医。",
);
