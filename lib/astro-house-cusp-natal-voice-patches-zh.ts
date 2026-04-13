/**
 * 宫头观测：本命基座句库 10 套成稿（叠盘型 patch 前）。voice 1 即 HOUSE_CUSP_COPY_CONFIG_ZH。
 */

import { deepMergePlain } from "@/lib/astro-copy-deep-merge";
import { HOUSE_CUSP_COPY_CONFIG_ZH, type HouseCuspCopyConfigZh } from "@/lib/astro-house-cusp-copy-config-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const V1 = HOUSE_CUSP_COPY_CONFIG_ZH;
type Patch = Partial<HouseCuspCopyConfigZh>;

const P2: Patch = {
  statusLine:
    "本表在说什么：十二个生活场景各是什么脾气——从你怎么出场，到钱、家、关系、事业怎么接招。",
  answer: {
    happened:
      "宫头像十二间房的门槛：你进关系、钱、工作这些门时，默认紧还是松、先讲理还是先感受，都会不一样。",
    coreTemplate:
      "你给人的第一印象偏「{interfaceMode}」；真要动到根上的事，更像「{transformMode}」。上升在 {c1}，8 宫在 {c8}，一个是「怎么上场」，一个是「敢不敢彻底翻新」。",
    riskTemplate: "「你自己」和「对面那个人」默认玩法不一样（上升 {c1}，下降 {c7}）。{axisRisk}",
    todayTemplate: "今天先这么做：跟人打交道时先记住一条——{todayProtocol}。别一上来就用「我觉得」挡掉所有商量。",
  },
  axisRisk: V1.axisRisk,
  todayProtocol: V1.todayProtocol,
  interfaceMode: V1.interfaceMode,
  transformMode: V1.transformMode,
  mcMode: V1.mcMode,
  pro: {
    ascTemplate: "人格面（ASC / 1宫 {c1}）：对环境信号偏敏感，会先感受风险，再决定对外敞开多少。",
    valueAxisTemplate:
      "资源轴（2/8：2宫 {c2} ↔ 8宫 {c8}）：进项与共有、信任绑在一起；大钱大承诺慢一步。",
    mcTemplate: "社会面（MC / 10宫 {c10}）：对外可见的路线偏{mcMode}，适合边走边调。",
  },
  precision: {
    matrix: "宫头矩阵：House Cusp Matrix（来源：十二宫宫头卡）",
    anchorAsc: "[ASC] 1宫 {c1} —— 出场气质：先看场合再表态",
    anchorIc: "[IC] 4宫 {c4} —— 心里踏实：家与日常根基",
    anchorDes: "[DES] 7宫 {c7} —— 一对一：边界与期待要说清",
    anchorMc: "[MC] 10宫 {c10} —— 对外名片：{mcMode}",
    turn6: "{c6} —— 日常执行：琐事与健康节奏",
    turn8: "{c8} —— 信任与共有：钱、亲密与放手",
  },
  actions: {
    align7: "对齐 7 宫边界：合作时同步 7宫 {c7} 的期待，少把 1宫 {c1} 的情绪直接甩给对方。",
    clean4: "整理 4 宫根基：用 4宫 {c4} 的细致，收拾私密与日常流程，给心里腾地方。",
    release10: "释放 10 宫可见度：公众表达里保留 10宫 {c10} 的{mcMode}空间，同时补上可验证动作。",
  },
};

const P3: Patch = {
  statusLine: "本表在说什么：十二宫头＝你进不同生活场时的「默认气氛」。",
  answer: {
    happened: "每道宫头像一扇门的把手：关系、钱、工作，你默认先拧哪边、用多大力，都不一样。",
    coreTemplate:
      "第一印象偏「{interfaceMode}」；深层翻新偏「{transformMode}」。上升 {c1}，8 宫 {c8}。",
    riskTemplate: "你习惯的出场（{c1}）和对方期待的玩法（{c7}）常不是一套。{axisRisk}",
    todayTemplate: "今天适合：记住——{todayProtocol}。",
  },
  axisRisk: V1.axisRisk,
  todayProtocol: V1.todayProtocol,
  interfaceMode: V1.interfaceMode,
  transformMode: V1.transformMode,
  mcMode: V1.mcMode,
  pro: {
    ascTemplate: "1宫 {c1}：先察觉场合，再决定敞开多少。",
    valueAxisTemplate: "2/8 轴 {c2}↔{c8}：进项与共有、信任绑在一起。",
    mcTemplate: "10宫 {c10}：对外路线偏{mcMode}。",
  },
  precision: {
    matrix: "House Cusp Matrix（十二宫宫头）",
    anchorAsc: "[ASC] {c1}",
    anchorIc: "[IC] {c4}",
    anchorDes: "[DES] {c7}",
    anchorMc: "[MC] {c10} · {mcMode}",
    turn6: "{c6} · 日常",
    turn8: "{c8} · 共有",
  },
  actions: {
    align7: "7宫 {c7} 与 1宫 {c1}：先对齐期待。",
    clean4: "4宫 {c4}：收拾根基。",
    release10: "10宫 {c10}：可见度配动作。",
  },
};

const P4: Patch = {
  statusLine: "本表在说什么：把宫头当场景——你怎么登场、钱与关系各是什么脾气。",
  answer: {
    happened: "十二道门槛：进不同生活场时，你默认紧张还是放松、先讲理还是先感受，各不相同。",
    coreTemplate:
      "出场偏「{interfaceMode}」；翻新感偏「{transformMode}」。上升 {c1}，8 宫 {c8}。",
    riskTemplate: "上升 {c1} 与下降 {c7} 容易各说各话。{axisRisk}",
    todayTemplate: "今天更推荐：{todayProtocol}。",
  },
  axisRisk: V1.axisRisk,
  todayProtocol: V1.todayProtocol,
  interfaceMode: V1.interfaceMode,
  transformMode: V1.transformMode,
  mcMode: V1.mcMode,
  pro: {
    ascTemplate: "出场（ASC {c1}）：环境信号先掂量。",
    valueAxisTemplate: "资源轴（2/8）：{c2}↔{c8}。",
    mcTemplate: "名片（MC {c10}）：{mcMode}。",
  },
  precision: {
    matrix: "宫头章节表：House Cusp Matrix（十二宫宫头卡）",
    anchorAsc: "[ASC] 1宫 {c1} —— 登场",
    anchorIc: "[IC] 4宫 {c4} —— 根基",
    anchorDes: "[DES] 7宫 {c7} —— 一对一",
    anchorMc: "[MC] 10宫 {c10} —— {mcMode}",
    turn6: "{c6} —— 琐事节律",
    turn8: "{c8} —— 信任与钱",
  },
  actions: {
    align7: "合作：先对齐 7宫 {c7}。",
    clean4: "私密：整理 4宫 {c4}。",
    release10: "公众：10宫 {c10} 留动作。",
  },
};

const P5: Patch = {
  statusLine: "本表在说什么：【宫头】十二场门槛脾气。",
  answer: {
    happened: "【门槛】关系/钱/工作各门默认松紧不同。",
    coreTemplate: "出场「{interfaceMode}」；翻新「{transformMode}」。↑{c1} · 8宫{c8}。",
    riskTemplate: "↑{c1} vs ↓{c7}。{axisRisk}",
    todayTemplate: "【今日】{todayProtocol}。",
  },
  axisRisk: V1.axisRisk,
  todayProtocol: V1.todayProtocol,
  interfaceMode: V1.interfaceMode,
  transformMode: V1.transformMode,
  mcMode: V1.mcMode,
  pro: {
    ascTemplate: "【1宫】{c1}",
    valueAxisTemplate: "【2/8】{c2}-{c8}",
    mcTemplate: "【10宫】{c10} {mcMode}",
  },
  precision: {
    matrix: "【House Cusp Matrix】",
    anchorAsc: "[ASC]{c1}",
    anchorIc: "[IC]{c4}",
    anchorDes: "[DES]{c7}",
    anchorMc: "[MC]{c10}",
    turn6: "{c6}",
    turn8: "{c8}",
  },
  actions: {
    align7: "7宫对齐",
    clean4: "4宫整理",
    release10: "10宫释放",
  },
};

const P6: Patch = {
  statusLine: "本表在说什么：从结构上看，十二宫头如何定义各生活场的默认接口。",
  answer: {
    happened: "宫头可视为生活分区的入口参数：关系、财务、职业等场景的默认响应不同。",
    coreTemplate:
      "对外接口偏「{interfaceMode}」；深层转化偏「{transformMode}」。上升 {c1}，8 宫 {c8}。",
    riskTemplate: "上升（{c1}）与下降（{c7}）存在系统性错位风险。{axisRisk}",
    todayTemplate: "建议：在互动中优先落实——{todayProtocol}。",
  },
  axisRisk: V1.axisRisk,
  todayProtocol: V1.todayProtocol,
  interfaceMode: V1.interfaceMode,
  transformMode: V1.transformMode,
  mcMode: V1.mcMode,
  pro: {
    ascTemplate: "人格接口 ASC/1宫 {c1}：风险感知优先于外显。",
    valueAxisTemplate: "价值与共有轴 2/8（{c2}↔{c8}）：需同时满足可控与可复核。",
    mcTemplate: "社会坐标 MC/10宫 {c10}：可见路径偏{mcMode}，宜演化式调整。",
  },
  precision: {
    matrix: "宫头分布矩阵：House Cusp Matrix（十二宫宫头卡）",
    anchorAsc: "[ASC] 1宫 {c1} —— 入口气质",
    anchorIc: "[IC] 4宫 {c4} —— 内核稳定",
    anchorDes: "[DES] 7宫 {c7} —— 关系准入",
    anchorMc: "[MC] 10宫 {c10} —— 社会可见：{mcMode}",
    turn6: "{c6} —— 执行节律",
    turn8: "{c8} —— 资源重构",
  },
  actions: {
    align7: "同步 7宫 {c7} 边界，降低 1宫 {c1} 情绪代入。",
    clean4: "以 4宫 {c4} 整理私域与流程。",
    release10: "10宫 {c10} 表达保留{mcMode}空间并补可验证动作。",
  },
};

const P7: Patch = {
  statusLine: "本表在说什么：说白了，十二宫就是「你进各生活块时的默认脾气」。",
  answer: {
    happened: "每道门不一样：进关系、钱、工作，你默认先紧还是先松、先讲理还是先感受。",
    coreTemplate:
      "第一印象「{interfaceMode}」；真要翻新「{transformMode}」。上升 {c1}，8 宫 {c8}。",
    riskTemplate: "你习惯怎么出场（{c1}）跟一对一里对方默认（{c7}）容易拧。{axisRisk}",
    todayTemplate: "今天别拖：跟人处先记住——{todayProtocol}。",
  },
  axisRisk: V1.axisRisk,
  todayProtocol: V1.todayProtocol,
  interfaceMode: V1.interfaceMode,
  transformMode: V1.transformMode,
  mcMode: V1.mcMode,
  pro: {
    ascTemplate: "怎么上场：1宫 {c1}，先摸场合。",
    valueAxisTemplate: "钱与信任：2宫 {c2} 和 8宫 {c8} 一根绳。",
    mcTemplate: "外面怎么看你：10宫 {c10}，偏{mcMode}。",
  },
  precision: {
    matrix: "宫头蹲点表：House Cusp Matrix（十二宫宫头卡）",
    anchorAsc: "[ASC] {c1} —— 出场",
    anchorIc: "[IC] {c4} —— 家里与心里",
    anchorDes: "[DES] {c7} —— 对面那个人",
    anchorMc: "[MC] {c10} —— 名片 · {mcMode}",
    turn6: "{c6} —— 上班琐事",
    turn8: "{c8} —— 共有与放手",
  },
  actions: {
    align7: "一锤定节：合作先对齐 7宫 {c7}。",
    clean4: "把 4宫 {c4} 收拾利索，心里少堵。",
    release10: "10宫 {c10} 别光要面子，配一条能查的动作。",
  },
};

const P8: Patch = {
  statusLine: "本表在说什么：宫头负荷——各生活场的默认接口与摩擦点。",
  answer: {
    happened: "十二宫头描述你进入各生活领域时的默认反应模式。",
    coreTemplate:
      "对外呈现偏「{interfaceMode}」；深层转化偏「{transformMode}」。上升 {c1}，8 宫 {c8}。",
    riskTemplate: "自我呈现轴与关系期待轴存在错配（{c1}/{c7}）。{axisRisk}",
    todayTemplate: "今天可以先从这一步开始：{todayProtocol}。",
  },
  axisRisk: V1.axisRisk,
  todayProtocol: V1.todayProtocol,
  interfaceMode: V1.interfaceMode,
  transformMode: V1.transformMode,
  mcMode: V1.mcMode,
  pro: {
    ascTemplate: "呈现端 ASC/1宫 {c1}：敏感于环境信号。",
    valueAxisTemplate: "资源端 2/8：{c2}↔{c8}，共有与信任耦合。",
    mcTemplate: "可见端 MC/10宫 {c10}：{mcMode}取向。",
  },
  precision: {
    matrix: "宫头负荷矩阵：House Cusp Matrix（十二宫宫头卡）",
    anchorAsc: "[ASC] 1宫 {c1}",
    anchorIc: "[IC] 4宫 {c4}",
    anchorDes: "[DES] 7宫 {c7}",
    anchorMc: "[MC] 10宫 {c10} / {mcMode}",
    turn6: "{c6} / 日常",
    turn8: "{c8} / 共有",
  },
  actions: {
    align7: "收束关系边界：7宫 {c7}。",
    clean4: "归位根基：4宫 {c4}。",
    release10: "公众表达：10宫 {c10}。",
  },
};

const P9: Patch = {
  statusLine: "本表在说什么：像翻地图——宫头标出十二场生活的门槛戏。",
  answer: {
    happened: "每一宫是一道门：你进钱、家、关系、工作，门的松紧和规矩各不相同。",
    coreTemplate:
      "上场气质「{interfaceMode}」；深层剧情「{transformMode}」。上升 {c1}，8 宫 {c8}。",
    riskTemplate: "你的门牌（{c1}）和对面的门牌（{c7}）不是同一套规矩。{axisRisk}",
    todayTemplate: "今天可以先从这一步开始：{todayProtocol}。",
  },
  axisRisk: V1.axisRisk,
  todayProtocol: V1.todayProtocol,
  interfaceMode: V1.interfaceMode,
  transformMode: V1.transformMode,
  mcMode: V1.mcMode,
  pro: {
    ascTemplate: "第一幕气质：ASC {c1}。",
    valueAxisTemplate: "资源戏：2/8 {c2}↔{c8}。",
    mcTemplate: "社会戏：MC {c10}，{mcMode}。",
  },
  precision: {
    matrix: "宫头地图：House Cusp Matrix（十二宫宫头卡）",
    anchorAsc: "[ASC] 1宫 {c1} —— 开场",
    anchorIc: "[IC] 4宫 {c4} —— 回望",
    anchorDes: "[DES] 7宫 {c7} —— 对位",
    anchorMc: "[MC] 10宫 {c10} —— 聚光 · {mcMode}",
    turn6: "{c6} —— 日常幕",
    turn8: "{c8} —— 深处幕",
  },
  actions: {
    align7: "对位戏：先对齐 7宫 {c7}。",
    clean4: "回望戏：收拾 4宫 {c4}。",
    release10: "聚光戏：10宫 {c10} 配一句可验证台词。",
  },
};

const P10: Patch = {
  statusLine: "本表在说什么：宫头＝十二道门槛脾气。",
  answer: {
    happened: "十二门：关系钱工作默认不同。",
    coreTemplate: "出场{interfaceMode}；翻新{transformMode}。↑{c1} 8{c8}。",
    riskTemplate: "↑{c1}↓{c7}。{axisRisk}",
    todayTemplate: "今日：{todayProtocol}。",
  },
  axisRisk: V1.axisRisk,
  todayProtocol: V1.todayProtocol,
  interfaceMode: V1.interfaceMode,
  transformMode: V1.transformMode,
  mcMode: V1.mcMode,
  pro: {
    ascTemplate: "1宫{c1}",
    valueAxisTemplate: "2/8 {c2}-{c8}",
    mcTemplate: "10{c10}{mcMode}",
  },
  precision: {
    matrix: "House Cusp Matrix",
    anchorAsc: "ASC{c1}",
    anchorIc: "IC{c4}",
    anchorDes: "DES{c7}",
    anchorMc: "MC{c10}",
    turn6: "{c6}",
    turn8: "{c8}",
  },
  actions: {
    align7: "7宫",
    clean4: "4宫",
    release10: "10宫",
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

const cache: Partial<Record<VoiceStyleIdZh, HouseCuspCopyConfigZh>> = { 1: V1 };

export function houseCuspNatalBaseForVoice(voiceStyleId: VoiceStyleIdZh): HouseCuspCopyConfigZh {
  const hit = cache[voiceStyleId];
  if (hit) return hit;
  if (voiceStyleId === 1) return V1;
  const merged = deepMergePlain(V1, PATCH_BY_VOICE[voiceStyleId as Exclude<VoiceStyleIdZh, 1>]);
  cache[voiceStyleId] = merged;
  return merged;
}
