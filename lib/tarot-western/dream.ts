import { makeWesternDir, wg } from "./types";

const C = "占梦境";

const Q = {
  mean: "这个梦在说什么？",
  day: "它接到白天哪一件事上了？",
  omen: "这是预兆，还是脑子在消化压力？",
  future: "它有没有在指接下来几周的方向？",
  ignore: "这个梦，可以不当一回事吗？",
  repeat: "反复做同一个梦，要我注意什么？",
  nightmare: "噩梦要不要当真，醒来先做什么？",
  chase: "被追／跑不掉这种梦，卡在生活哪一块？",
  fall: "坠落／牙齿／考试这类梦，对应哪头压力？",
  death: "梦到死亡或结束，是害怕失去，还是某段该收？",
  snake: "蛇／虫／牙这类画面，对着我哪块压力？",
  naked: "梦到没准备好／穿错，白天哪件事让我暴露？",
  flying: "飞／坠落，我是想逃还是想掌控？",
  person: "梦里出现的这个人，代表什么？",
  ex: "又梦到前任，是未了还是只是习惯？",
  child: "梦里的小孩／旧家，是内在哪一部分在说话？",
  tell: "这个梦该不该告诉当事人？",
  crush: "梦到暗恋的人，要不要当信号？",
  dead: "梦到已逝的人，是思念还是有话没说完？",
  stranger: "梦里那个陌生引导者，我听哪一句？",
  water: "水／房子／迷路这些画面，指向哪？",
  house: "梦里的房子多了一层／塌了，对应生活哪一块？",
  work: "梦到工作／迟到，是焦虑还是真有疏漏？",
  school: "又梦回学校／考试，我在怕被评判哪一点？",
  pregnancy: "梦到怀孕或小孩，是创造欲还是责任压过来了？",
  lucid: "我能不能不被梦拖着走，醒来先落地哪一步？",
  journal: "还要不要把梦记下来？",
  wake3: "总在同一点醒来，是身体还是心事？",
  sleepTalk: "失眠加上乱梦，今晚该减刺激还是该把心事写下来？",
  share: "这个梦拿到牌上问，有用还是在放大恐惧？",
};

export const WESTERN_DREAM_GROUPS = [
  wg(C, "这个梦在说什么", ["意思", "白天", "预兆", "压力"], [
    Q.mean, Q.day, Q.omen, Q.future, Q.ignore, Q.share,
  ]),
  wg(C, "反复与噩梦", ["反复", "噩梦", "追", "坠落"], [
    Q.repeat, Q.nightmare, Q.chase, Q.fall, Q.death, Q.snake, Q.naked, Q.flying,
  ]),
  wg(C, "梦里的人", ["人", "前任", "小孩", "已逝"], [
    Q.person, Q.ex, Q.child, Q.tell, Q.crush, Q.dead, Q.stranger, Q.pregnancy,
  ]),
  wg(C, "画面与地方", ["水", "房子", "学校", "工作"], [
    Q.water, Q.house, Q.work, Q.school,
  ]),
  wg(C, "醒来怎么过", ["记下", "醒来", "失眠"], [
    Q.lucid, Q.journal, Q.wake3, Q.sleepTalk, Q.share,
  ]),
];

export const WESTERN_DREAM_DIR = makeWesternDir(
  [
    Q.mean, Q.day, Q.omen, Q.repeat, Q.nightmare, Q.person,
    Q.ex, Q.chase, Q.work, Q.ignore, Q.death, Q.tell, Q.dead, Q.wake3,
  ],
  WESTERN_DREAM_GROUPS,
  [
    { id: "mean", label: "在说什么", groupLabels: ["这个梦在说什么"] },
    { id: "loop", label: "反复/噩梦", groupLabels: ["反复与噩梦"] },
    { id: "who", label: "梦里的人", groupLabels: ["梦里的人"] },
    { id: "scene", label: "画面/地方", groupLabels: ["画面与地方"] },
    { id: "wake", label: "醒来怎么过", groupLabels: ["醒来怎么过"] },
  ],
  "西方人解梦，多半当心理信号：接到白天哪件事、是预兆还是压力、反复同一梦要我注意什么。不是简单问吉凶。牌面看信号与消化。",
);
