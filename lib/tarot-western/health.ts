import { makeWesternDir, wg } from "./types";

const C = "身体健康";

const Q = {
  doctor: "该不该去看医生？",
  gp: "先去家庭医生，还是直接找专科？",
  second: "要不要再听一个第二意见？",
  wait: "检查结果还没出，我是慌还是先按日常过？",
  chronic: "这个反复的不舒服，还要不要再查？",
  energy: "精力回不来，是身体还是压力？",
  sleep: "睡不好这件事，今晚还要不要硬撑？",
  anxiety: "心里发紧，是该休息、运动，还是该约咨询？",
  gym: "这套锻炼还坚持吗，还是在伤自己？",
  food: "饮食这件事，我是该收，还是已经收过头了？",
  rest: "今天该请假休息，还是去上班硬扛？",
  meds: "药／补剂这套，还继续吗？（问节奏，不是处方）",
  therapy: "心理咨询这门，现在该推还是该去？",
  surgery: "手术／操作这步，现在做还是再观察？",
  recovery: "恢复期我是不是又在提前加码？",
  habit: "最该先改的一个习惯是什么？",
  burnoutBody: "身体在叫停，工作还听不听？",
  test: "这项筛查，今年还要不要去做？",
  pain: "疼着拖，还是今天就去看？",
  mental: "这是情绪的身体化，还是身体本身的事？",
  support: "该不该把身体这事告诉亲近的人？",
  alcohol: "酒／刺激物这层，现在该减吗？",
  cycle: "周期／激素这层让我不稳，要不要去问医生？",
  longCovid: "好了之后还虚，是该再查还是该给时间？",
  er: "今晚去急诊，还是明早再看？",
  specialistWait: "专科排队要几个月，中间我怎么过？",
  physio: "理疗／康复这套，还要坚持吗？",
  migraine: "反复的疼，是该记录触发，还是该再约诊？",
  screen: "屏幕和睡眠，今晚先砍哪头？",
  caffeine: "咖啡因这层，是在帮我还是在掏我？",
  step: "计步／运动目标，是照顾自己还是在惩罚自己？",
  isolate: "不舒服时我该独处，还是该让人来？",
  secondMed: "两种治疗方案，听哪个医生？",
  gymSkip: "连续停练，是该重启还是该承认这套不适合？",
  therapyWait: "咨询候补要很久，中间我怎么撑？",
};

export const WESTERN_HEALTH_GROUPS = [
  wg(C, "要不要就医", ["医生", "检查", "第二意见", "疼"], [
    Q.doctor, Q.gp, Q.second, Q.wait, Q.chronic, Q.pain, Q.test, Q.surgery, Q.er, Q.specialistWait, Q.migraine, Q.secondMed,
  ]),
  wg(C, "精力睡眠压力", ["精力", "睡", "压力", "请假"], [
    Q.energy, Q.sleep, Q.anxiety, Q.rest, Q.burnoutBody, Q.mental, Q.screen, Q.caffeine,
  ]),
  wg(C, "习惯与恢复", ["锻炼", "饮食", "恢复", "习惯"], [
    Q.gym, Q.food, Q.recovery, Q.habit, Q.alcohol, Q.meds, Q.physio, Q.step, Q.gymSkip,
  ]),
  wg(C, "身心与支持", ["咨询", "告诉", "周期"], [
    Q.therapy, Q.support, Q.cycle, Q.longCovid, Q.isolate, Q.therapyWait,
  ]),
];

export const WESTERN_HEALTH_DIR = makeWesternDir(
  [
    Q.doctor, Q.energy, Q.sleep, Q.anxiety, Q.rest, Q.therapy,
    Q.second, Q.pain, Q.burnoutBody, Q.habit, Q.mental, Q.chronic,
  ],
  WESTERN_HEALTH_GROUPS,
  [
    { id: "care", label: "就医/检查", groupLabels: ["要不要就医"] },
    { id: "energy", label: "精力/睡眠", groupLabels: ["精力睡眠压力"] },
    { id: "habit", label: "习惯/恢复", groupLabels: ["习惯与恢复"] },
    { id: "mind", label: "身心/咨询", groupLabels: ["身心与支持"] },
  ],
  "西方人问身体，多半是：该不该去看医生、是压力还是身体、今天休息还是硬扛。牌面看节奏，替代不了就诊。",
);
