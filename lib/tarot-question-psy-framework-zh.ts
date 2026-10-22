/**
 * 心理疏导 · 分类框架（内在天气／创伤／边界／咨询）。
 * 冻结核 20 条原文一字不改。点选题不用病名当门面。
 */
import { PSY_X } from "./tarot-question-psy-extra-scenes-zh";
import { PSY_Y } from "./tarot-question-psy-extra-scenes-2-zh";
import { PSY_Z } from "./tarot-question-psy-extra-scenes-3-zh";
import { surfacesForDirFilter, type TarotDirTab } from "./tarot-question-dir-filter-zh";

export const PSY_Q = {
  anxiety: "我反复出现的焦虑，其实在为哪一部分的自己发声？",
  blame: "当我责备自己的时候，内心那个声音最害怕的是什么？",
  pretend: "我最常「装没事」的情绪是什么？如果让它说话，会说什么？",
  trauma: "过去的某个创伤或失望，现在还在怎样影响我？",
  bound: "我现在最需要学会的，是设立界限，还是允许自己被支持？",
  valley: "这段情绪低谷，可以成为我重新认识自己的怎样一个契机？",
  fear: "我最害怕的情绪是什么？这种害怕本身在告诉我什么？",
  letGo: "过去的某次伤害，我现在是否真正允许自己放下了？",
  innerChild: "如果我可以对过去那个受伤的自己说一句话，我会说什么？",
  critic: "我内心的批判声音，通常在我做什么事情时最响亮？",
  worth: "我的自我价值感是否绑定了某些外在条件？",
  mistake: "当我犯错时，我如何对待自己？",
  stress: "我目前最大的压力源是什么？它是在提醒我改变什么吗？",
  fight: "面对压力时，我第一反应是战斗、逃跑还是僵住？",
  toolbox: "我是否有减压的「紧急工具箱」？",
  overload: "如何区分可应对的压力和需要求助的过载？",
  weather: "我能否把情绪看作内在天气，接受它来，也接受它走？",
  counsel: "专业心理咨询对我是否有帮助？我是否愿意尝试？",
  station: "如果疗愈是一个旅程，我现在走到了哪一站？",
  thank: "今天，我可以感谢哪种情绪带给我的信息？",
  ...PSY_X,
  ...PSY_Y,
  ...PSY_Z,
} as const;

export const PSY_FROZEN_CANONICAL: readonly string[] = [
  PSY_Q.anxiety, PSY_Q.blame, PSY_Q.pretend, PSY_Q.trauma, PSY_Q.bound,
  PSY_Q.valley, PSY_Q.fear, PSY_Q.letGo, PSY_Q.innerChild, PSY_Q.critic,
  PSY_Q.worth, PSY_Q.mistake, PSY_Q.stress, PSY_Q.fight, PSY_Q.toolbox,
  PSY_Q.overload, PSY_Q.weather, PSY_Q.counsel, PSY_Q.station, PSY_Q.thank,
];

export const PSY_FRAMEWORK_GROUPS = [
  {
    label: "内在天气",
    keys: ["焦虑", "装没事", "害怕", "情绪", "天气", "发声"],
    surface: [PSY_Q.luckNow, PSY_Q.luckYear, PSY_Q.luckWhen, PSY_Q.luckPatch, PSY_Q.ignoreSignal, PSY_Q.anxiety, PSY_Q.blame, PSY_Q.pretend, PSY_Q.valley, PSY_Q.fear, PSY_Q.weather, PSY_Q.thank, PSY_Q.nameFeel, PSY_Q.letSpeak, PSY_Q.bodyMap, PSY_Q.weatherPass, PSY_Q.stopNumb, PSY_Q.nightLoop],
  },
  {
    label: "创伤边界",
    keys: ["创伤", "伤害", "批判", "价值", "犯错", "界限"],
    surface: [PSY_Q.trauma, PSY_Q.bound, PSY_Q.letGo, PSY_Q.innerChild, PSY_Q.critic, PSY_Q.worth, PSY_Q.mistake, PSY_Q.boundarySay, PSY_Q.askSupport, PSY_Q.innerKid, PSY_Q.criticOn, PSY_Q.worthBind, PSY_Q.afterMistake, PSY_Q.angerUse, PSY_Q.griefWave],
  },
  {
    label: "压力过载",
    keys: ["压力", "战斗", "减压", "过载", "僵住"],
    surface: [PSY_Q.stress, PSY_Q.fight, PSY_Q.toolbox, PSY_Q.overload, PSY_Q.freezeNow, PSY_Q.overloadNow, PSY_Q.restPermit],
  },
  {
    label: "咨询疗愈",
    keys: ["咨询", "疗愈", "求助", "陪伴"],
    surface: [PSY_Q.counsel, PSY_Q.station, PSY_Q.counselStart, PSY_Q.counselStay, PSY_Q.safePeople],
  },
  {
    label: "关系模式",
    keys: ["越怕被丢", "讨好", "画饼", "冷淡试", "对最亲的人发火"],
    surface: [PSY_Q.clingPush, PSY_Q.pleaseAll, PSY_Q.pickUnavailable, PSY_Q.testLove, PSY_Q.angryKind, PSY_Q.innerTeen, PSY_Q.trustBody],
  },
  {
    label: "睡眠反刍",
    keys: ["重放", "躺下就开工", "天亮前", "半夜看消息", "用吃"],
    surface: [PSY_Q.replayTalk, PSY_Q.noSleep, PSY_Q.dawnDread, PSY_Q.napShame, PSY_Q.dreamHang, PSY_Q.checkPhone, PSY_Q.numbFood, PSY_Q.isolate],
  },
  {
    label: "求助节奏",
    keys: ["约专业", "取消", "问得太密", "小组", "结束这段"],
    surface: [PSY_Q.bookSession, PSY_Q.cancelSession, PSY_Q.tooOften, PSY_Q.tooRare, PSY_Q.friendDump, PSY_Q.medAsk, PSY_Q.groupShare, PSY_Q.journalRage, PSY_Q.bodyShake, PSY_Q.safeWord, PSY_Q.compareHeal, PSY_Q.relapseFeel, PSY_Q.afterCare, PSY_Q.homework, PSY_Q.endTherapy],
  },
  {
    label: "自我批判",
    keys: ["审判", "不够好", "应该", "对自己狠"],
    surface: [PSY_Q.innerJudge, PSY_Q.neverEnough, PSY_Q.compareFeed, PSY_Q.mistakeLoop, PSY_Q.praiseOdd, PSY_Q.restGuilt, PSY_Q.innerKidNow, PSY_Q.shouldList, PSY_Q.uglyThought, PSY_Q.peopleMask, PSY_Q.kindVoice, PSY_Q.futureBlank],
  },
  {
    label: "身体记忆",
    keys: ["靠近就僵", "味道", "手抖", "皮肤记得"],
    surface: [PSY_Q.bodyFlinch, PSY_Q.smellBack, PSY_Q.startleLoud, PSY_Q.stomachKnot, PSY_Q.handShake, PSY_Q.skinCrawl, PSY_Q.bodyScan, PSY_Q.breathHold, PSY_Q.eatNumb, PSY_Q.mirrorSkip, PSY_Q.walkOut, PSY_Q.numbDay],
  },
  {
    label: "反复波浪",
    keys: ["又涌上来", "好日子怕掉", "周年", "写了删"],
    surface: [PSY_Q.waveBack, PSY_Q.goodDayTrap, PSY_Q.anniBody, PSY_Q.triggerMap, PSY_Q.relapseTalk, PSY_Q.hopeScare, PSY_Q.weekendCrash, PSY_Q.mondayDread, PSY_Q.therapyGap, PSY_Q.medsDoubt, PSY_Q.sleepClock, PSY_Q.textDraft],
  },
];

export const PSY_FEATURED_SURFACE: readonly string[] = [
  PSY_Q.luckNow, PSY_Q.pretend, PSY_Q.bound, PSY_Q.weather, PSY_Q.counsel,
  PSY_Q.trauma, PSY_Q.overload,   PSY_Q.nameFeel, PSY_Q.askSupport, PSY_Q.critic, PSY_Q.noSleep, PSY_Q.bookSession, PSY_Q.innerJudge, PSY_Q.waveBack,
];

export const PSY_FILTER_TABS: readonly TarotDirTab[] = [
  { id: "hot", label: "高频", groupLabels: [], surface: PSY_FEATURED_SURFACE },
  { id: "weather", label: "内在天气", groupLabels: ["内在天气"] },
  { id: "wound", label: "创伤/边界", groupLabels: ["创伤边界"] },
  { id: "load", label: "压力/过载", groupLabels: ["压力过载"] },
  { id: "care", label: "咨询/疗愈", groupLabels: ["咨询疗愈"] },
  { id: "pattern", label: "关系/模式", groupLabels: ["关系模式"] },
  { id: "sleep", label: "睡眠/反刍", groupLabels: ["睡眠反刍"] },
  { id: "ask", label: "求助/节奏", groupLabels: ["求助节奏"] },
  { id: "judge", label: "自我/批判", groupLabels: ["自我批判"] },
  { id: "soma", label: "身体/记忆", groupLabels: ["身体记忆"] },
  { id: "wave", label: "反复/波浪", groupLabels: ["反复波浪"] },
];

export const PSY_DEFAULT_FILTER_ID = "hot";

export function psySurfacesForFilter(
  filterId: string,
  groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
): string[] {
  return surfacesForDirFilter(filterId, groups, PSY_FILTER_TABS);
}
