/**
 * 主相位观测：本命基座句库 10 套成稿（叠盘型 patch 前）。voice 1 即 MAJOR_ASPECT_COPY_CONFIG_ZH。
 */

import { deepMergePlain } from "@/lib/astro-copy-deep-merge";
import { MAJOR_ASPECT_COPY_CONFIG_ZH, type MajorAspectCopyConfigZh } from "@/lib/astro-major-aspect-copy-config-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const V1 = MAJOR_ASPECT_COPY_CONFIG_ZH;
type Patch = Partial<MajorAspectCopyConfigZh>;

const P2: Patch = {
  statusLine: "本表在说什么：行星之间谁在拉扯、谁在托举——这是你性格里反复出现的主线。",
  answer: {
    happenedHighPressure:
      "最近你会很明显体感：旧目标或老习惯跟当下处境对不上，心里在逼你做取舍。轮到换剧本了，不必慌。",
    happenedCalibrate:
      "这阵子你在悄悄微调：哪些事还值得投入、哪些该放手。动静不大，方向在动。",
    riskWithHardTemplate:
      "{hardAspects} 这组容易把人逼到两极——要么硬扛到底，要么干脆躺平。中间那条路才是能走下去的。",
    riskNoHard: "同时惦记的事太多，脑子会「想太多却理不清」：以为都想透了，其实还在原地转。",
    synergyTemplate: "{aspect} 像一条缓冲带，能帮你稳住情绪、缓一口气，别浪费这条线。",
    todayTemplate:
      "今天先这么做：最较劲的一两组（表里越紧越优先）先处理，别的记下别硬啃；借钱、扩团队、大投入隔 {hours} 小时再拍板。",
  },
  pro: {
    centerTemplate: "当前主轴相位：{aspect}。主线围绕它展开。",
    conflictWithHardTemplate: "高压点：{hardAspects}。冲劲与限制一起抬升。",
    conflictNoHard: "高压点：硬相位不算密，主要矛盾更像执行噪声而不是结构对撞。",
    driveTemplate: "核心推力：{aspect}。意志和行动能同时使力，目标要先收窄。",
  },
  precision: { matrix: "主相位矩阵：Aspect Matrix（来源：盘内主相位卡）" },
  actions: {
    stabilizeTemplate: "先稳住：优先借 {aspect} 处理高压议题，事实先说清，情绪后收尾。",
    growthDelayTemplate: "大决定慢一点：借贷、扩编或大额投入，统一延后 {hours} 小时再复核。",
    burstTemplate: "单点突破：借 {aspect} 的执行力，只打一个硬任务，别多线并发。",
  },
};

const P3: Patch = {
  statusLine: "本表在说什么：主相位＝你性格里「谁和谁一直在对话」——较劲与帮忙都在这里。",
  answer: {
    happenedHighPressure:
      "最近你会直接察觉：旧脚本跟新现场打架，心里在逼你换招。不是坏事，是节奏到了。",
    happenedCalibrate: "最近你在暗暗校正：投入与放手在悄悄换位。",
    riskWithHardTemplate:
      "{hardAspects} 容易把你看成非黑即白——硬顶或躺平都不划算，找中间动作。",
    riskNoHard: "头绪太多时，容易以为都想清了，其实还在混成一团。",
    synergyTemplate: "{aspect} 能当缓震，压力大时别只会死磕主线。",
    todayTemplate:
      "今天适合：先啃最紧的一两组，其余排队；大钱大承诺隔 {hours} 小时再回话。",
  },
  pro: {
    centerTemplate: "主轴：{aspect}。",
    conflictWithHardTemplate: "对拉点：{hardAspects}。",
    conflictNoHard: "对拉点：硬相位不密，矛盾更像忙乱而不是结构死结。",
    driveTemplate: "推力：{aspect}。先收窄目标。",
  },
  precision: { matrix: "Aspect Matrix（盘内主相位）" },
  actions: {
    stabilizeTemplate: "稳住：用 {aspect} 先处理最烫的议题。",
    growthDelayTemplate: "扩张先缓：大额决策延后 {hours} 小时。",
    burstTemplate: "只打一孔：{aspect}，单任务。",
  },
};

const P4: Patch = {
  statusLine: "本表在说什么：把主相位当剧本——谁帮谁、谁顶谁，决定你性格里哪条戏最响。",
  answer: {
    happenedHighPressure:
      "最近你会明显更在意：旧目标跟新处境对不上，心里在催你做取舍。换剧本的信号。",
    happenedCalibrate: "最近你在不动声色地调整：值得与不值得在重写。",
    riskWithHardTemplate: "{hardAspects} 这组容易走极端——中间路线才是解法。",
    riskNoHard: "事太多时，脑子容易糊成一团，还以为自己想明白了。",
    synergyTemplate: "{aspect} 像援手，别浪费。",
    todayTemplate:
      "今天更推荐：先处理最拧的两组；借钱、扩编、大投入隔 {hours} 小时再定。",
  },
  pro: {
    centerTemplate: "戏眼相位：{aspect}。",
    conflictWithHardTemplate: "冲突峰：{hardAspects}。",
    conflictNoHard: "冲突峰：硬相位不多，噪声为主。",
    driveTemplate: "动能相位：{aspect}。",
  },
  precision: { matrix: "主相位章节表：Aspect Matrix（盘内主相位卡）" },
  actions: {
    stabilizeTemplate: "集中攻坚：{aspect}，高压先落地事实。",
    growthDelayTemplate: "把冲动压下去：大额决策 {hours} 小时后再说。",
    burstTemplate: "定向爆破：{aspect}，单点。",
  },
};

const P5: Patch = {
  statusLine: "本表在说什么：【主相位】助攻/拆台总览——性格主线。",
  answer: {
    happenedHighPressure: "【高压】旧脚本 vs 新现场 → 必做取舍。",
    happenedCalibrate: "【微调】投入/放手在换位。",
    riskWithHardTemplate: "【警】{hardAspects} → 易两极化，走中路。",
    riskNoHard: "【警】头绪过载 → 先列表。",
    synergyTemplate: "【缓】{aspect}。",
    todayTemplate: "【今日】先啃最紧 1–2 组；大钱 {hours}h 后拍板。",
  },
  pro: {
    centerTemplate: "【轴】{aspect}。",
    conflictWithHardTemplate: "【顶】{hardAspects}。",
    conflictNoHard: "【顶】硬相稀疏 → 执行噪。",
    driveTemplate: "【推】{aspect}。",
  },
  precision: { matrix: "【Aspect Matrix】主相位" },
  actions: {
    stabilizeTemplate: "【稳】{aspect}。",
    growthDelayTemplate: "【缓】大额 {hours}h。",
    burstTemplate: "【爆】{aspect} 单点。",
  },
};

const P6: Patch = {
  statusLine: "本表在说什么：从结构上看，主相位如何分配张力与助力——性格级主线。",
  answer: {
    happenedHighPressure:
      "你会清楚感到：旧目标与当前处境不匹配，系统要求重新配置优先级。",
    happenedCalibrate: "你在进行小幅校准：资源投向正在调整。",
    riskWithHardTemplate: "{hardAspects} 易诱发二元决策，建议引入中间选项。",
    riskNoHard: "并行任务过多会导致认知负荷上升，误判「已想清」。",
    synergyTemplate: "{aspect} 提供缓冲，可用于稳定情绪与节奏。",
    todayTemplate:
      "建议处理优先级最高的紧张相位组合；重大财务与扩张决策延迟 {hours} 小时复核。",
  },
  pro: {
    centerTemplate: "结构主轴：{aspect}。",
    conflictWithHardTemplate: "结构张力：{hardAspects}。",
    conflictNoHard: "结构张力：硬相位密度有限，矛盾偏执行层。",
    driveTemplate: "结构驱动：{aspect}。",
  },
  precision: { matrix: "主相位分布矩阵：Aspect Matrix（盘内主相位卡）" },
  actions: {
    stabilizeTemplate: "关键一步：以 {aspect} 稳定高压议题，先事实后情绪。",
    growthDelayTemplate: "重大扩张类决策统一延后 {hours} 小时。",
    burstTemplate: "单点闭环：{aspect}。",
  },
};

const P7: Patch = {
  statusLine: "本表在说什么：说白了，主相位就是「谁跟你较劲、谁帮你兜底」——性格里最常响的那几组。",
  answer: {
    happenedHighPressure:
      "最近你会很快看出来：老路子跟新现场不对付，心里催你换招。",
    happenedCalibrate: "最近你在慢慢把方向对齐：什么还值得、什么该放。",
    riskWithHardTemplate: "{hardAspects} 容易把人逼到「要么硬扛要么躺平」，记得留第三条路。",
    riskNoHard: "事一多你就以为自己想清了，其实还在搅。",
    synergyTemplate: "{aspect} 能帮你缓一口气，别空着不用。",
    todayTemplate:
      "今天别拖：最拧的先动；借钱、扩团队、大投入隔 {hours} 小时再回。",
  },
  pro: {
    centerTemplate: "最响的一组：{aspect}。",
    conflictWithHardTemplate: "最顶的一组：{hardAspects}。",
    conflictNoHard: "硬的不密，主要是忙乱。",
    driveTemplate: "最能推你动的一组：{aspect}。",
  },
  precision: { matrix: "主相位蹲点表：Aspect Matrix（盘内主相位卡）" },
  actions: {
    stabilizeTemplate: "一锤定节：靠 {aspect} 先压住高压。",
    growthDelayTemplate: "大动作先睡一觉：{hours} 小时后再说。",
    burstTemplate: "先把这一步打穿：{aspect}，单点。",
  },
};

const P8: Patch = {
  statusLine: "本表在说什么：主相位负荷图——性格里结构级拉扯与支撑各在何处。",
  answer: {
    happenedHighPressure:
      "你会明显被触动：旧习惯与当下需求冲突，需要重新分配精力。",
    happenedCalibrate: "你在悄悄收敛：投入结构在微调。",
    riskWithHardTemplate: "{hardAspects} 易触发极端反应，宜降档处理。",
    riskNoHard: "多线程并行时易出现「伪清晰」，建议外化记录。",
    synergyTemplate: "{aspect} 可作为情绪与节奏的缓冲带。",
    todayTemplate:
      "今天可以先从这一步开始：优先处理最紧张相位；重大事项延迟 {hours} 小时决策。",
  },
  pro: {
    centerTemplate: "主轴样本：{aspect}。",
    conflictWithHardTemplate: "张力样本：{hardAspects}。",
    conflictNoHard: "张力样本：硬相位不突出。",
    driveTemplate: "驱动样本：{aspect}。",
  },
  precision: { matrix: "主相位负荷矩阵：Aspect Matrix（盘内主相位卡）" },
  actions: {
    stabilizeTemplate: "收束发力：{aspect}，事实先行。",
    growthDelayTemplate: "明确复核窗口：{hours} 小时。",
    burstTemplate: "单点关键任务：{aspect}。",
  },
};

const P9: Patch = {
  statusLine: "本表在说什么：像读长篇——主相位标出性格里反复出现的对台与援手。",
  answer: {
    happenedHighPressure:
      "最近你会更容易觉察到：旧章新景对不上，心里在催你翻页。",
    happenedCalibrate: "最近你在静静修正：什么还跟着、什么该松手。",
    riskWithHardTemplate: "{hardAspects} 这组戏容易演成「非黑即白」，记得写第三结局。",
    riskNoHard: "线索太多时，别骗自己「都想好了」。",
    synergyTemplate: "{aspect} 是旁白里的援手，记得用。",
    todayTemplate:
      "今天可以先从这一步开始：先处理最较劲的一两组；大钱大诺 {hours} 小时后再落笔。",
  },
  pro: {
    centerTemplate: "章眼相位：{aspect}。",
    conflictWithHardTemplate: "冲突桥段：{hardAspects}。",
    conflictNoHard: "冲突桥段：硬相位不多，像噪声。",
    driveTemplate: "推进桥段：{aspect}。",
  },
  precision: { matrix: "主相位地图：Aspect Matrix（盘内主相位卡）" },
  actions: {
    stabilizeTemplate: "关键镜头：{aspect}。",
    growthDelayTemplate: "留白 {hours} 小时再拍板。",
    burstTemplate: "单场戏：{aspect}。",
  },
};

const P10: Patch = {
  statusLine: "本表在说什么：主相位＝性格主剧情。",
  answer: {
    happenedHighPressure: "高压：旧vs新 → 取舍。",
    happenedCalibrate: "微调：投放在动。",
    riskWithHardTemplate: "警：{hardAspects} → 两极 → 走中。",
    riskNoHard: "警：头绪糊。",
    synergyTemplate: "缓：{aspect}。",
    todayTemplate: "今日：最紧1–2；大事 {hours}h 后。",
  },
  pro: {
    centerTemplate: "轴：{aspect}。",
    conflictWithHardTemplate: "顶：{hardAspects}。",
    conflictNoHard: "顶：稀→噪。",
    driveTemplate: "推：{aspect}。",
  },
  precision: { matrix: "Aspect Matrix｜主相位" },
  actions: {
    stabilizeTemplate: "稳：{aspect}。",
    growthDelayTemplate: "缓：{hours}h。",
    burstTemplate: "爆：{aspect}。",
  },
};

const PATCH_BY_VOICE: Record<Exclude<VoiceStyleIdZh, 1>, Patch> = {
  2: P2,
  3: P3,
  4: P4,
  5: P5,
  6: P6,
  7: P7,
  8: P8,
  9: P9,
  10: P10,
};

const cache: Partial<Record<VoiceStyleIdZh, MajorAspectCopyConfigZh>> = { 1: V1 };

export function majorAspectNatalBaseForVoice(voiceStyleId: VoiceStyleIdZh): MajorAspectCopyConfigZh {
  const hit = cache[voiceStyleId];
  if (hit) return hit;
  if (voiceStyleId === 1) return V1;
  const merged = deepMergePlain(V1, PATCH_BY_VOICE[voiceStyleId as Exclude<VoiceStyleIdZh, 1>]);
  cache[voiceStyleId] = merged;
  return merged;
}
