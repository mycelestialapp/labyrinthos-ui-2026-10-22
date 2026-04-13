/**
 * 行运工作台「实时块」：按声部 10 套成稿模板（占位符与 `buildTransitRealtimeReport` 一致）。
 */

import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

export type TransitRealtimeTplCtx = {
  houseLabel: string;
  h: number;
  cluster: string;
  reviewHours: string;
  tightHardLine: string;
  supportiveLine: string;
  tinyLine: string;
};

export type TransitRealtimeTpl = {
  statusLine: string;
  happened: string;
  riskHard: string;
  riskSoft: string;
  synergyYes: string;
  synergyNo: string;
  today: string;
  trigger: string;
  tensionHard: string;
  tensionSoft: string;
  expansionYes: string;
  expansionNo: string;
  scopeLine: string;
  houseFocusWithCluster: string;
  houseFocusNoCluster: string;
  aspMain: string;
  aspMainEmpty: string;
  aspHelp: string;
  aspHelpEmpty: string;
  aspTiny: string;
  aspTinyEmpty: string;
  action0: string;
  action1: string;
  action2: string;
};

export function fillTransitStr(t: string, x: TransitRealtimeTplCtx): string {
  return t
    .replaceAll("{houseLabel}", x.houseLabel)
    .replaceAll("{h}", String(x.h))
    .replaceAll("{cluster}", x.cluster)
    .replaceAll("{reviewHours}", x.reviewHours)
    .replaceAll("{tightHardLine}", x.tightHardLine)
    .replaceAll("{supportiveLine}", x.supportiveLine)
    .replaceAll("{tinyLine}", x.tinyLine);
}

const T1: TransitRealtimeTpl = {
  statusLine: "本表在说什么：眼下天象在你本命盘上踩了哪几块——哪块最热闹、该先稳住什么。",
  happened: "最近{houseLabel}这块特别容易有事找上门：环境在催你重排优先级，先别贪多。",
  riskHard: "{tightHardLine} 这组容易把话说绝、把事做满，重要话出口前停三秒。",
  riskSoft: "几件事同时推进时，脑子容易糊，以为都想清了其实还在乱。",
  synergyYes: "{supportiveLine} 像一条援手——不必全线撤退，把节奏放慢一点就好。",
  synergyNo: "顺手的助力不明显时，先把边界和日程写清，再往外伸。",
  today: "涉及钱、合同、分合这类大事，先放 {reviewHours} 小时再定；睡一觉往往比当场拍板划算。",
  trigger: "阶段触发：{h}宫相关议题在这一窗里更密，整体像「事情往这儿堆」，适合先点名、再动手。",
  tensionHard: "关键张力：{tightHardLine}。旧习惯和当下现场容易顶牛，先把结论放慢，分清事实和情绪。",
  tensionSoft: "关键张力：硬相位不算最尖时，矛盾多半来自日程太满、先后不清。",
  expansionYes: "可借的力：{supportiveLine} 能托一把，但答应别人的范围、自己的时间，仍要说清楚。",
  expansionNo: "可借的力：这窗更适合收一收、理一理，对外扩张拆成小步更稳。",
  scopeLine:
    "读数口径：行运星与本命星之间的相位（含容许度），与数据区「行运↔本命」表同源，可上下对照。",
  houseFocusWithCluster: "当下{h}宫星体较集中：{cluster}。可与「行运行星位置」表对读，看热闹从哪扇门进。",
  houseFocusNoCluster: "当下{h}宫仍是叙事焦点，表中星体分散时，以宫位主题为主、逐颗为辅。",
  aspMain: "[主张力] {tightHardLine}。",
  aspMainEmpty: "[主张力] 暂无贴得最紧的硬相位。",
  aspHelp: "[助力] {supportiveLine}。",
  aspHelpEmpty: "[助力] 助力相位不显眼。",
  aspTiny: "[细线] {tinyLine}。",
  aspTinyEmpty: "[细线] 次要线暂无可用样本。",
  action0: "先减载：非必要的加码、新坑，这窗能推就推，把一口气留给最硬的一两件事。",
  action1: "大事复核：钱、合同、关系定调，严格留足 {reviewHours} 小时再回话，减少后悔成本。",
  action2: "主线不断：日常该推进的别因为心情起伏全盘停摆，波动正常，不必神话成「天塌了」。",
};

const T2: TransitRealtimeTpl = {
  statusLine: "本表在说什么：这阵子天象在你本命盘上最吵的是哪几块——先稳住最闹的那扇门。",
  happened: "这阵子{houseLabel}最容易被点名：环境在催你重排先后，别一次贪全。",
  riskHard: "{tightHardLine} 容易把话说到绝、把事做满；开口前停三秒。",
  riskSoft: "多线并进时，脑子容易「以为想清了」其实还在搅。",
  synergyYes: "{supportiveLine} 像有人递绳子——不必全退，先把节奏放慢。",
  synergyNo: "助力不明显时，先把边界、日程写死，再往外伸手。",
  today: "钱、合同、分合这类大事，先隔 {reviewHours} 小时；睡一觉常比当场划算。",
  trigger: "这一窗{h}宫议题更密：像事往这儿堆，先点名再动手。",
  tensionHard: "张力核心：{tightHardLine}。旧习惯顶现场，先把事实和情绪分开。",
  tensionSoft: "硬相位不算最尖：矛盾更像排太满、先后不清。",
  expansionYes: "可借力：{supportiveLine}；答应的范围与时间仍要说清。",
  expansionNo: "这窗宜收宜理，扩张拆小步。",
  scopeLine: "口径：行运↔本命相位（含容许度），与数据区表同源，可对照。",
  houseFocusWithCluster: "当下{h}宫较挤：{cluster}。可对照「行运行星位置」看从哪扇门进。",
  houseFocusNoCluster: "当下{h}宫仍是焦点；星散时以宫主题为纲。",
  aspMain: "[主压] {tightHardLine}。",
  aspMainEmpty: "[主压] 暂无最贴硬相位。",
  aspHelp: "[助力] {supportiveLine}。",
  aspHelpEmpty: "[助力] 不显眼。",
  aspTiny: "[细线] {tinyLine}。",
  aspTinyEmpty: "[细线] 暂无样本。",
  action0: "先减载：新坑能推就推，留给最硬的一两件事。",
  action1: "大事留足 {reviewHours} 小时再回，降后悔。",
  action2: "日常别因心情全盘停；波动正常。",
};

const T3: TransitRealtimeTpl = {
  statusLine: "本表在说什么：行运窗口里，本命盘上哪几块最亮、该先顾哪里。",
  happened: "最近{houseLabel}这块容易被推到前排：先排优先级，别平均用力。",
  riskHard: "{tightHardLine} 易把话说满；重要出口缓一拍。",
  riskSoft: "并行太多会糊；先写下来再动。",
  synergyYes: "{supportiveLine} 能托一下；节奏放慢即可。",
  synergyNo: "助力弱时，先清边界与日程。",
  today: "大钱大诺：隔 {reviewHours} 小时再拍板。",
  trigger: "{h}宫在本窗更密：先点名议题。",
  tensionHard: "关键对拉：{tightHardLine}。",
  tensionSoft: "硬相位不最尖：更像日程噪声。",
  expansionYes: "可借：{supportiveLine}；范围要说清。",
  expansionNo: "这窗宜收，扩张小步。",
  scopeLine: "读数口径与「行运↔本命」表一致。",
  houseFocusWithCluster: "{h}宫集中：{cluster}。",
  houseFocusNoCluster: "{h}宫仍焦点；星散以宫为主。",
  aspMain: "[紧] {tightHardLine}。",
  aspMainEmpty: "[紧] 无。",
  aspHelp: "[顺] {supportiveLine}。",
  aspHelpEmpty: "[顺] 弱。",
  aspTiny: "[细] {tinyLine}。",
  aspTinyEmpty: "[细] 无。",
  action0: "减载优先。",
  action1: "大事 {reviewHours}h 复核。",
  action2: "主线别全停。",
};

const T4: TransitRealtimeTpl = {
  statusLine: "本表在说什么：把行运当成当下剧情——本命盘上哪几场戏最吵。",
  happened: "{houseLabel}这章最近容易被点名：先改剧本顺序，别贪多线。",
  riskHard: "{tightHardLine}：台词容易说绝；停三秒。",
  riskSoft: "多线会糊成一锅；先列清单。",
  synergyYes: "{supportiveLine}：像配角递道具，慢一格就好。",
  synergyNo: "援手不明显：先立边界再伸手。",
  today: "钱合同分合：留白 {reviewHours} 小时。",
  trigger: "{h}宫这幕戏更密：先点题。",
  tensionHard: "戏眼张力：{tightHardLine}。",
  tensionSoft: "冲突更像排期乱。",
  expansionYes: "可借力：{supportiveLine}。",
  expansionNo: "这幕宜收束。",
  scopeLine: "相位口径与数据区同源。",
  houseFocusWithCluster: "{h}宫群戏：{cluster}。",
  houseFocusNoCluster: "{h}宫仍主场景。",
  aspMain: "[主戏] {tightHardLine}。",
  aspMainEmpty: "[主戏] 空镜。",
  aspHelp: "[援手] {supportiveLine}。",
  aspHelpEmpty: "[援手] 淡。",
  aspTiny: "[细线] {tinyLine}。",
  aspTinyEmpty: "[细线] 无。",
  action0: "删支线。",
  action1: "大决定 {reviewHours}h。",
  action2: "主剧情别停拍。",
};

const T5: TransitRealtimeTpl = {
  statusLine: "本表在说什么：【行运实时】本命盘上亮灯区与先手。",
  happened: "【亮】{houseLabel} → 重排优先。",
  riskHard: "【警】{tightHardLine} → 话别太满。",
  riskSoft: "【警】并行糊。",
  synergyYes: "【援】{supportiveLine}。",
  synergyNo: "【援】弱→先边界。",
  today: "【大事】{reviewHours}h。",
  trigger: "【{h}宫】密。",
  tensionHard: "【张】{tightHardLine}。",
  tensionSoft: "【张】日程。",
  expansionYes: "【扩】{supportiveLine}。",
  expansionNo: "【扩】收。",
  scopeLine: "【口径】同表。",
  houseFocusWithCluster: "【{h}】{cluster}。",
  houseFocusNoCluster: "【{h}】焦。",
  aspMain: "[主]{tightHardLine}",
  aspMainEmpty: "[主]无",
  aspHelp: "[助]{supportiveLine}",
  aspHelpEmpty: "[助]无",
  aspTiny: "[细]{tinyLine}",
  aspTinyEmpty: "[细]无",
  action0: "减载",
  action1: "{reviewHours}h",
  action2: "不断主线",
};

const T6: TransitRealtimeTpl = {
  statusLine: "本表在说什么：从结构上看，行运在本命盘上如何集中叙事压力与可用助力。",
  happened: "当前{houseLabel}域更易被事件触发，建议重新评估优先级。",
  riskHard: "{tightHardLine} 可能诱发极端表达，重要沟通宜降速。",
  riskSoft: "多任务并行将提高认知噪声。",
  synergyYes: "{supportiveLine} 可提供节奏缓冲。",
  synergyNo: "助力信号弱时，优先固化边界与计划。",
  today: "重大承诺建议设置 {reviewHours} 小时复核窗口。",
  trigger: "{h}宫相关议题在本时间窗密度上升，宜先结构化再执行。",
  tensionHard: "主要张力：{tightHardLine}。",
  tensionSoft: "硬相位不尖锐时，矛盾多源于排程。",
  expansionYes: "扩展路径：{supportiveLine}（需限定范围）。",
  expansionNo: "本窗更适合收敛与整理。",
  scopeLine: "读数口径与「行运↔本命」数据表一致。",
  houseFocusWithCluster: "{h}宫星体集中：{cluster}。",
  houseFocusNoCluster: "{h}宫为主题焦点。",
  aspMain: "[主张力] {tightHardLine}。",
  aspMainEmpty: "[主张力] 无显著硬相位。",
  aspHelp: "[助力] {supportiveLine}。",
  aspHelpEmpty: "[助力] 不显著。",
  aspTiny: "[细线] {tinyLine}。",
  aspTinyEmpty: "[细线] 无样本。",
  action0: "降低非必要并行。",
  action1: "重大事项延迟 {reviewHours} 小时决策。",
  action2: "维持主线推进，避免情绪性停摆。",
};

const T7: TransitRealtimeTpl = {
  statusLine: "本表在说什么：说白了，天象这会儿最折腾你本命盘哪几块。",
  happened: "最近{houseLabel}最容易有事找上门：先别贪多。",
  riskHard: "{tightHardLine} 容易说绝做满；嘴比脑子快时先停。",
  riskSoft: "几件事一起搞，脑子会糊。",
  synergyYes: "{supportiveLine} 能帮你缓一口。",
  synergyNo: "助力看不清，先把话说清、日程写清。",
  today: "大钱大诺：隔 {reviewHours} 小时，睡一觉更划算。",
  trigger: "{h}宫这阵子更闹：先点名再动手。",
  tensionHard: "最拧的是 {tightHardLine}：事实和情绪分开想。",
  tensionSoft: "硬的不算最尖：多半是排太满。",
  expansionYes: "能借 {supportiveLine} 一把，但别答应过头。",
  expansionNo: "这窗先收一收更稳。",
  scopeLine: "跟数据区「行运↔本命」一张表。",
  houseFocusWithCluster: "{h}宫正热闹：{cluster}。",
  houseFocusNoCluster: "{h}宫还是戏眼。",
  aspMain: "[最紧] {tightHardLine}。",
  aspMainEmpty: "[最紧] 暂无。",
  aspHelp: "[能帮] {supportiveLine}。",
  aspHelpEmpty: "[能帮] 不明显。",
  aspTiny: "[细线] {tinyLine}。",
  aspTinyEmpty: "[细线] 暂无。",
  action0: "能推的坑先推。",
  action1: "大事 {reviewHours} 小时后再回。",
  action2: "别一不爽就全停。",
};

const T8: TransitRealtimeTpl = {
  statusLine: "本表在说什么：行运实时负荷——本命盘上短期叙事焦点与风险窗。",
  happened: "{houseLabel}域当前更易成为事件入口。",
  riskHard: "{tightHardLine} 对应表达与决策的极端化风险。",
  riskSoft: "并行任务上升将提高误判概率。",
  synergyYes: "{supportiveLine} 可作为节奏调节因子。",
  synergyNo: "助力不足时，以边界与计划为先。",
  today: "建议重大事项设置 {reviewHours} 小时缓冲。",
  trigger: "{h}宫议题密度上升。",
  tensionHard: "张力样本：{tightHardLine}。",
  tensionSoft: "结构冲突有限，更多为排程问题。",
  expansionYes: "扩展样本：{supportiveLine}。",
  expansionNo: "扩张信号弱，宜整理。",
  scopeLine: "口径与数据区一致。",
  houseFocusWithCluster: "{h}宫集中：{cluster}。",
  houseFocusNoCluster: "{h}宫焦点。",
  aspMain: "[T] {tightHardLine}。",
  aspMainEmpty: "[T] ∅。",
  aspHelp: "[+] {supportiveLine}。",
  aspHelpEmpty: "[+] ∅。",
  aspTiny: "[~] {tinyLine}。",
  aspTinyEmpty: "[~] ∅。",
  action0: "并行降级。",
  action1: "缓冲 {reviewHours}h。",
  action2: "维持执行。",
};

const T9: TransitRealtimeTpl = {
  statusLine: "本表在说什么：像读当下这一章——行运在本命盘上点了哪几盏灯。",
  happened: "这章{houseLabel}最容易被写到前排：先改场次顺序。",
  riskHard: "{tightHardLine}：台词别说到绝。",
  riskSoft: "多线并演会乱场；先写提纲。",
  synergyYes: "{supportiveLine}：像幕后递道具。",
  synergyNo: "援手淡：先把舞台边界画好。",
  today: "重头戏留白 {reviewHours} 小时。",
  trigger: "{h}宫这场更密。",
  tensionHard: "戏眼：{tightHardLine}。",
  tensionSoft: "更像排期乱。",
  expansionYes: "可借：{supportiveLine}。",
  expansionNo: "这章宜收。",
  scopeLine: "与「行运↔本命」表同口径。",
  houseFocusWithCluster: "{h}宫群像：{cluster}。",
  houseFocusNoCluster: "{h}宫主场景。",
  aspMain: "[幕] {tightHardLine}。",
  aspMainEmpty: "[幕] 空。",
  aspHelp: "[扶] {supportiveLine}。",
  aspHelpEmpty: "[扶] 淡。",
  aspTiny: "[丝] {tinyLine}。",
  aspTinyEmpty: "[丝] 无。",
  action0: "删支线场次。",
  action1: "{reviewHours}h 后再落槌。",
  action2: "主戏别停。",
};

const T10: TransitRealtimeTpl = {
  statusLine: "本表在说什么：行运｜本命亮灯区。",
  happened: "{houseLabel}忙。",
  riskHard: "{tightHardLine}→绝话。",
  riskSoft: "并行糊。",
  synergyYes: "{supportiveLine}缓。",
  synergyNo: "助力弱→边界。",
  today: "大事{reviewHours}h。",
  trigger: "{h}宫密。",
  tensionHard: "{tightHardLine}",
  tensionSoft: "日程。",
  expansionYes: "{supportiveLine}",
  expansionNo: "收。",
  scopeLine: "同表。",
  houseFocusWithCluster: "{h}·{cluster}",
  houseFocusNoCluster: "{h}焦",
  aspMain: "{tightHardLine}",
  aspMainEmpty: "—",
  aspHelp: "{supportiveLine}",
  aspHelpEmpty: "—",
  aspTiny: "{tinyLine}",
  aspTinyEmpty: "—",
  action0: "减载",
  action1: "{reviewHours}h",
  action2: "不断",
};

const BY_VOICE: Record<VoiceStyleIdZh, TransitRealtimeTpl> = {
  1: T1,
  2: T2,
  3: T3,
  4: T4,
  5: T5,
  6: T6,
  7: T7,
  8: T8,
  9: T9,
  10: T10,
};

export function transitRealtimeTplFor(voiceStyleId: VoiceStyleIdZh): TransitRealtimeTpl {
  return BY_VOICE[voiceStyleId];
}
