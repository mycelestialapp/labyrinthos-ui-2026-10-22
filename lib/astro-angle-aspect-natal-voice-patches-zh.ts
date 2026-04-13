/**
 * 轴点相位观测：本命基座 10 套成稿。voice 1 即 ANGLE_ASPECT_COPY_CONFIG_ZH。
 */

import { deepMergePlain } from "@/lib/astro-copy-deep-merge";
import { ANGLE_ASPECT_COPY_CONFIG_ZH, type AngleAspectCopyConfigZh } from "@/lib/astro-angle-aspect-copy-config-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const V1 = ANGLE_ASPECT_COPY_CONFIG_ZH;
type Patch = Partial<AngleAspectCopyConfigZh>;

const P2: Patch = {
  statusLine: "本表在说什么：你心里想走的路，和「场合希望你摆出的样子」之间，容易不在一条线上。",
  answer: {
    happened:
      "行星贴上上升、天顶时，像私下的你撞上「该演给谁看」：想做真实的自己，场面又催你换一张脸，中间就容易扯着。",
    risk: "要先留个心：越在意外面体面，回家或一个人时越容易憋或炸；盘里本来就紧时，这拉扯更明显。",
    synergyTemplate: "协同：看看 {aspect}——有时把弱点说清楚、肯露一点软，反而松一点，不必一直硬扛。",
    todayTemplate: "今天先这么做：对外别排太满，给自己留大约 {reserve} 的空白；喘口气往往比硬撑体面。",
  },
  pro: {
    socialFrictionTemplate: "角色与心情：{aspect}。公众想要的和情绪底色不一定同频，不等于路错，只是劲难使在一处。",
    entryPressureTemplate: "上场压力：{aspect}。新环境更谨慎慢热，更像自我保护。",
    interfaceMicroAdjustWithMinorTemplate: "细节：{snippet}。多一句确认、慢一点表态，常比硬撑省事。",
    interfaceMicroAdjustEmpty: "细节：次要轴点不多，先把主轴理顺。",
  },
  precision: {
    matrix: "轴点矩阵：Angles Aspect Matrix（来源：星体与上升/天顶卡）",
    majorEmpty: "无主轴高压相位",
    minorEmpty: "无边缘补偿相位",
  },
  actions: {
    a0Template: "别把别扭当结论：{aspect} 多是节奏问题，不必否定长期方向。",
    a1Template: "边界软一点：{aspect} 易绷太紧，正式场合也可留一点缝隙。",
    a2: "涉及立场时，先听清一句再回一句，少抢话。",
  },
};

const P3: Patch = {
  statusLine: "本表在说什么：轴点＝心里要的 vs 名片要的。",
  answer: {
    happened: "内心戏撞上升/天顶：想做自己 vs 场合要你怎样。",
    risk: "外面体面、里面憋；主轴紧时更明显。",
    synergyTemplate: "看 {aspect}：示弱有时更松。",
    todayTemplate: "今天适合：留 {reserve} 空白。",
  },
  pro: {
    socialFrictionTemplate: "名片↔心情：{aspect}。",
    entryPressureTemplate: "上场：{aspect}。",
    interfaceMicroAdjustWithMinorTemplate: "{snippet}",
    interfaceMicroAdjustEmpty: "次要轴点不多。",
  },
  precision: { matrix: "Angles Aspect Matrix（轴点）", majorEmpty: "主轴无", minorEmpty: "边缘无" },
  actions: {
    a0Template: "{aspect} 先当节奏。",
    a1Template: "{aspect} 别太硬。",
    a2: "先听再回。",
  },
};

const P4: Patch = {
  statusLine: "本表在说什么：把轴点当对台——心与名片。",
  answer: {
    happened: "星体与上升、天顶打交道：自我与角色拉扯。",
    risk: "体面与独处情绪容易对撞。",
    synergyTemplate: "协同建议：{aspect} 有时能松绑。",
    todayTemplate: "今天更推荐：留白 {reserve}。",
  },
  pro: {
    socialFrictionTemplate: "社会面与心情：{aspect}。",
    entryPressureTemplate: "出场压力：{aspect}。",
    interfaceMicroAdjustWithMinorTemplate: "微调：{snippet}。",
    interfaceMicroAdjustEmpty: "次要轴点稀疏。",
  },
  precision: {
    matrix: "轴点章节表：Angles Aspect Matrix（星体与上升/天顶卡）",
    majorEmpty: "未见主轴高压样本",
    minorEmpty: "未见边缘补偿样本",
  },
  actions: {
    a0Template: "阻力：{aspect} → 先当当下节奏。",
    a1Template: "紧绷：{aspect} → 留缝。",
    a2: "立场对话：听完再答。",
  },
};

const P5: Patch = {
  statusLine: "本表在说什么：【轴点】心 vs 名片。",
  answer: {
    happened: "【对台】心戏撞角色。",
    risk: "【警】体面↔独处。",
    synergyTemplate: "【协】{aspect}。",
    todayTemplate: "【今日】空白{reserve}。",
  },
  pro: {
    socialFrictionTemplate: "【角】{aspect}。",
    entryPressureTemplate: "【场】{aspect}。",
    interfaceMicroAdjustWithMinorTemplate: "【细】{snippet}",
    interfaceMicroAdjustEmpty: "【细】少",
  },
  precision: { matrix: "【Angles】", majorEmpty: "无", minorEmpty: "无" },
  actions: {
    a0Template: "【0】{aspect}",
    a1Template: "【1】{aspect}",
    a2: "【2】先听",
  },
};

const P6: Patch = {
  statusLine: "本表在说什么：从结构上看，轴点如何连接自我呈现与社会投射。",
  answer: {
    happened: "行星与上升、天顶的相位描述内心需求与外部角色之间的耦合关系。",
    risk: "外部角色要求与私人情绪可能出现系统性错配。",
    synergyTemplate: "在部分配置下，{aspect} 可降低张力。",
    todayTemplate: "建议保留约 {reserve} 的可调度空白以降低过载。",
  },
  pro: {
    socialFrictionTemplate: "角色—情绪接口：{aspect}。",
    entryPressureTemplate: "场景进入成本：{aspect}。",
    interfaceMicroAdjustWithMinorTemplate: "微调节点：{snippet}。",
    interfaceMicroAdjustEmpty: "次要轴点样本不足。",
  },
  precision: {
    matrix: "轴点分布矩阵：Angles Aspect Matrix（星体与上升/天顶卡）",
    majorEmpty: "主轴高压相位未检出",
    minorEmpty: "边缘补偿相位未检出",
  },
  actions: {
    a0Template: "将 {aspect} 视作节奏变量而非结论变量。",
    a1Template: "在 {aspect} 场景下保留表达冗余。",
    a2: "立场沟通采用「听完—复述—回应」序列。",
  },
};

const P7: Patch = {
  statusLine: "本表在说什么：说白了，轴点就是「你想怎样」对上「人家看你该怎样」。",
  answer: {
    happened: "心里要的和社会名片容易打架：上升天顶这条线最敏感。",
    risk: "越要面子，回家越容易炸；主轴紧就更明显。",
    synergyTemplate: "说白了 {aspect} 有时能当减压阀。",
    todayTemplate: "今天别拖：留 {reserve} 喘气。",
  },
  pro: {
    socialFrictionTemplate: "外面要的 vs 心里要的：{aspect}。",
    entryPressureTemplate: "见生人/新场合：{aspect}。",
    interfaceMicroAdjustWithMinorTemplate: "小事多确认：{snippet}。",
    interfaceMicroAdjustEmpty: "次要轴点不多，先管主轴。",
  },
  precision: {
    matrix: "轴点蹲点表：Angles Aspect Matrix（星体与上升/天顶卡）",
    majorEmpty: "主轴高压暂无",
    minorEmpty: "边缘补偿暂无",
  },
  actions: {
    a0Template: "别扭不一定是结论：{aspect}。",
    a1Template: "别绷成铁板：{aspect}。",
    a2: "先听清再回，别抢。",
  },
};

const P8: Patch = {
  statusLine: "本表在说什么：轴点负荷——角色接口与心情接口。",
  answer: {
    happened: "轴点相位刻画外部角色与内在情绪之间的张力分布。",
    risk: "高角色负荷可能压低私人情绪容纳空间。",
    synergyTemplate: "{aspect} 可能提供可操作的缓和路径。",
    todayTemplate: "今日建议预留 {reserve} 空白以稳定节律。",
  },
  pro: {
    socialFrictionTemplate: "接口样本·社会：{aspect}。",
    entryPressureTemplate: "接口样本·进入：{aspect}。",
    interfaceMicroAdjustWithMinorTemplate: "微扰样本：{snippet}。",
    interfaceMicroAdjustEmpty: "微扰样本不足。",
  },
  precision: {
    matrix: "轴点负荷矩阵：Angles Aspect Matrix（星体与上升/天顶卡）",
    majorEmpty: "主轴高压 ∅",
    minorEmpty: "边缘补偿 ∅",
  },
  actions: {
    a0Template: "复核 {aspect} 是否被误读为结论。",
    a1Template: "为 {aspect} 保留表达缝隙。",
    a2: "降低抢话频率。",
  },
};

const P9: Patch = {
  statusLine: "本表在说什么：像剧照——轴点标出「上场」与「抬头」的拉扯。",
  answer: {
    happened: "内心戏对上升、天顶：自我与角色对台词。",
    risk: "场面越正，后场越容易炸。",
    synergyTemplate: "旁白：{aspect} 有时让戏松一格。",
    todayTemplate: "今天可以先从这一步开始：留白 {reserve}。",
  },
  pro: {
    socialFrictionTemplate: "对词：{aspect}。",
    entryPressureTemplate: "候场：{aspect}。",
    interfaceMicroAdjustWithMinorTemplate: "走位：{snippet}。",
    interfaceMicroAdjustEmpty: "次要走位不多。",
  },
  precision: {
    matrix: "轴点地图：Angles Aspect Matrix（星体与上升/天顶卡）",
    majorEmpty: "主轴无戏",
    minorEmpty: "边缘无戏",
  },
  actions: {
    a0Template: "别把这幕当终局：{aspect}。",
    a1Template: "留一句气口：{aspect}。",
    a2: "台词：听完再接。",
  },
};

const P10: Patch = {
  statusLine: "本表在说什么：轴点＝心vs名片。",
  answer: {
    happened: "心戏撞角色。",
    risk: "体面↔独处。",
    synergyTemplate: "{aspect}",
    todayTemplate: "空白{reserve}",
  },
  pro: {
    socialFrictionTemplate: "{aspect}",
    entryPressureTemplate: "{aspect}",
    interfaceMicroAdjustWithMinorTemplate: "{snippet}",
    interfaceMicroAdjustEmpty: "少",
  },
  precision: { matrix: "Angles", majorEmpty: "—", minorEmpty: "—" },
  actions: {
    a0Template: "{aspect}",
    a1Template: "{aspect}",
    a2: "听→回",
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

const cache: Partial<Record<VoiceStyleIdZh, AngleAspectCopyConfigZh>> = { 1: V1 };

export function angleAspectNatalBaseForVoice(voiceStyleId: VoiceStyleIdZh): AngleAspectCopyConfigZh {
  const hit = cache[voiceStyleId];
  if (hit) return hit;
  if (voiceStyleId === 1) return V1;
  const merged = deepMergePlain(V1, PATCH_BY_VOICE[voiceStyleId as Exclude<VoiceStyleIdZh, 1>]);
  cache[voiceStyleId] = merged;
  return merged;
}
