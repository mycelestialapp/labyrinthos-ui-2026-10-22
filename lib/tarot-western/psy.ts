import { makeWesternDir, wg } from "./types";

const C = "心理疏导";

const Q = {
  pattern: "我现在卡在哪个模式里？",
  therapy: "该不该去预约心理咨询？",
  therapistFit: "这个咨询师合不合适，该不该换？",
  cancelTherapy: "想取消下次咨询，是抗拒还是真的不合适？",
  anxiety: "焦虑在保护我什么？",
  panic: "恐慌来了，今晚先用身体落地，还是该立刻找人？",
  rumination: "夜里那卷反复想，怎么先落地一寸？",
  boundary: "这句界限，说不说得出口？",
  inner: "内在那个受伤的部分，现在需要什么？",
  critic: "心里骂我的那条声音，最怕什么？",
  numb: "我是平静了，还是麻了？",
  trigger: "这次被点燃，真正勾到的是哪段旧事？",
  rest: "我需要的是休息，还是被看见？",
  people: "身边谁是安全的，谁在消耗我？",
  selfTalk: "我对自己说话的方式，今晚先改哪一句？",
  grief: "哀悼还没走完，我是不是在催自己好？",
  control: "我抓这么紧，是怕失控还是怕被丢下？",
  peoplePlease: "讨好这一层，现在还要不要演？",
  body: "身体哪里在替我扛情绪？",
  medsTalk: "要不要和医生谈一谈药物／诊断这件事？",
  group: "互助小组／同伴支持，适合我现在吗？",
  crisis: "我是不是已经过载到该立刻找人陪？",
  worth: "我的价值是不是绑在成就或被爱上？",
  tomorrow: "明天只对自己温和一件事，是哪件？",
  comparison: "和别人比，我比的是事实还是羞耻？",
  journalPsy: "把情绪写下来，今晚还做不做？",
  attachment: "我抓关系这么紧，是爱还是害怕被丢？",
  freeze: "我又僵住了，先动身体还是先找安全的人？",
  anger: "怒压着不说，会转到哪里？",
  sad: "眼泪如果今晚允许流，会指向哪一件？",
  sleepPsy: "睡不着是心事，还是该把作息先收回来？",
  social: "社交让我空，是该减场次，还是该换圈子？",
  innerTeen: "那个青春期的自己，现在要一句什么？",
  parentVoice: "我脑子里那句父母的话，还要不要当真理？",
  relapse: "以为好了又掉回去，这算失败还是功课的第二圈？",
};

export const WESTERN_PSY_GROUPS = [
  wg(C, "模式与声音", ["模式", "骂自己", "讨好", "价值"], [
    Q.pattern, Q.critic, Q.peoplePlease, Q.worth, Q.selfTalk, Q.control, Q.comparison, Q.attachment, Q.parentVoice, Q.innerTeen,
  ]),
  wg(C, "焦虑悲伤过载", ["焦虑", "哀悼", "过载", "麻"], [
    Q.anxiety, Q.panic, Q.grief, Q.crisis, Q.numb, Q.trigger, Q.body, Q.rest, Q.rumination, Q.freeze, Q.anger, Q.sad, Q.sleepPsy, Q.relapse,
  ]),
  wg(C, "咨询与支持", ["咨询", "界限", "谁安全", "药物"], [
    Q.therapy, Q.therapistFit, Q.cancelTherapy, Q.boundary, Q.people, Q.medsTalk, Q.group, Q.inner, Q.tomorrow, Q.journalPsy, Q.social,
  ]),
];

export const WESTERN_PSY_DIR = makeWesternDir(
  [
    Q.pattern, Q.therapy, Q.anxiety, Q.boundary, Q.inner, Q.critic,
    Q.numb, Q.trigger, Q.people, Q.worth, Q.crisis, Q.tomorrow, Q.panic, Q.therapistFit,
  ],
  WESTERN_PSY_GROUPS,
  [
    { id: "pattern", label: "模式/声音", groupLabels: ["模式与声音"] },
    { id: "feel", label: "焦虑/过载", groupLabels: ["焦虑悲伤过载"] },
    { id: "help", label: "咨询/支持", groupLabels: ["咨询与支持"] },
  ],
  "西方人问心里这层，多半是：我卡在哪个模式、该不该去咨询、焦虑在保护什么、界限说不说。牌面不能替代专业陪伴。",
);
