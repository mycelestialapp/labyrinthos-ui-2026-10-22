/**
 * 身体健康 · 机器侧富化终稿向（仍非「感情 Q1 级全文手刻」）
 * 在引擎五段骨架上叠本题深描与牌种扣题句，供 `synthesizeLifeSixMasterHandbookEntry` 在 catIdx===0 时调用。
 */
import type { MasterQuestionCardContent } from "./tarot-master-question-types-shared";
import { H_HEALTH } from "./tarot-master-question-content-life-categories";

/** 与 Q_HEALTH 顺序一致：每题一段「心理挖根」，须含你/心里/怕 等 Rubric 线索 */
const HEALTH_PSYCH_DEEP: readonly string[] = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

const HEALTH_SPIRIT_DEEP: readonly string[] = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

const HEALTH_ACTION_DEEP: readonly string[] = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

const HEALTH_SUM_DEEP: readonly string[] = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

/** 大牌：22×2 一句，把牌势扣回「就医决策」 */
const HEALTH_MAJOR_TWIST: readonly (readonly [string, string])[] = [
  ["愚者正位像第一次走进急诊：先别赌运气，先把红线症状写清。", "愚者逆位提醒你：别用「再观察」无限拖延可验证的风险。"],
  ["魔术师正位：人药病历预约单齐了，才把力气拧成「今晚去不去医院」这一句。", "魔术师逆位：嘴上说改天，先把挂号界面点开第一下。"],
  ["女祭司正位：直觉提示风险，不代替量体温与核医嘱。", "女祭司逆位：越躲检查越吵；把症状写成三行字带去给真人看。"],
  ["皇后正位：睡眠与进食是底座，滋养不是放纵。", "皇后逆位：用刷手机填焦虑会更空；收回一小时给身体与医嘱。"],
  ["皇帝正位：把用药时间、复查日写清，羞耻会少一半。", "皇帝逆位：急到失序先误事；先补水降温，再决定下一步去哪。"],
  ["教皇正位：指南与经验并听，签字要落在证据上。", "教皇逆位：推销很响、证据很薄时要停。"],
  ["恋人正位：安全、省钱、要快——三选二先写清。", "恋人逆位：又想拖又想好会内耗；先写三条不可退让的红线。"],
  ["战车正位：就医与上班并排时，用时间表带着怕走。", "战车逆位：先降温整理材料，再冲医院。"],
  ["力量正位：温柔是对器官耐心，敢看检查单也不辱骂自己。", "力量逆位：别用硬扛证明勇敢；把怕问给听得懂的人。"],
  ["隐士正位：慢查资料可以，但要设闹钟停搜。", "隐士逆位：别独自在夜里把疼脑补成判决书。"],
  ["命运之轮正位：指标会波动，方案要更新；别把旧拖延当命运。", "命运之轮逆位：坏运气里仍能选「今天这一格医嘱」。"],
  ["正义正位：对齐事实再谈公平；病历时间线是你的秤。", "正义逆位：别用情绪替证据；先补齐材料再争。"],
  ["倒吊人正位：暂停不是逃，是把视角换到身体这一侧。", "倒吊人逆位：别卡在内耗里；先完成最小医疗动作。"],
  ["死神正位：旧习惯要退场，复查与停药都要问医。", "死神逆位：怕改变会拖延疗程；写清「为何停」再问。"],
  ["节制正位：身体需要渐变，换药减药别自学。", "节制逆位：节制变封闭时，开一条小缝给复诊。"],
  ["恶魔正位：成瘾与依赖会冒充「我必须」。写下来才算数。", "恶魔逆位：松一格控制，换一寸可执行。"],
  ["高塔正位：突发症状像雷；先处理安全，再谈体面。", "高塔逆位：预警已响就别装听不见。"],
  ["星星正位：希望要接在行动上；预约就是星光。", "星星逆位：别只许愿；把下一步写进日历。"],
  ["月亮正位：恐惧会变形；用记录对抗幻想。", "月亮逆位：夜里别自诊到天亮；设闹钟停搜。"],
  ["太阳正位：恢复需要晒得到人的安排；预约也是晒太阳。", "太阳逆位：别独自乐观；把复查日写出来。"],
  ["审判正位：复盘用药与症状，叫醒「我还能改」的那部分。", "审判逆位：别赖过去；从下一针下一次复诊重启。"],
  ["世界正位：疗程一段落要写总结给医生看；闭环才安心。", "世界逆位：别停在「差不多」；问清何时复查。"],
];

/** 小牌：4 元素 ×（数字段/宫廷段）× 正逆 = 16 句 */
const HEALTH_MINOR_TWIST: readonly string[] = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

function hookBodyHealth(qi: number): string {
  const raw = H_HEALTH[qi] ?? H_HEALTH[0]!;
  return raw.replace(/^这张牌对你说：/, "").trim();
}

function majorMinorTwistHealth(cardId: string, upright: boolean): string {
  const up = upright ? 0 : 1;
  const mj = /^major_(\d+)$/.exec(cardId);
  if (mj) {
    const mi = Math.min(21, Math.max(0, Number(mj[1])));
    const row = HEALTH_MAJOR_TWIST[mi] ?? HEALTH_MAJOR_TWIST[0]!;
    return row[up] ?? row[0]!;
  }
  const m2 = /^(wands|cups|swords|pentacles)_(\d+)$/.exec(cardId);
  if (!m2) return "把下一步写短，写在纸上，再带进诊室。";
  const suit = m2[1]!;
  const num = Number(m2[2]);
  const sk = suit === "wands" ? 0 : suit === "cups" ? 1 : suit === "swords" ? 2 : 3;
  const band = num <= 10 ? 0 : 1;
  const idx = sk * 4 + band * 2 + up;
  return HEALTH_MINOR_TWIST[idx] ?? HEALTH_MINOR_TWIST[0]!;
}

/**
 * 身体健康类：在引擎骨架上叠本题深描 + 牌种扣题，仍保留 Rubric 要求的牌语结构。
 */
export function composeHealthRichHandbook(
  base: MasterQuestionCardContent,
  qi: number,
  cardId: string,
  upright: boolean,
): MasterQuestionCardContent {
  const hook = hookBodyHealth(qi);
  const twist = majorMinorTwistHealth(cardId, upright);
  const cardSpeaking = `${base.cardSpeaking}\n\n【本题深读】\n${hook}\n\n这牌的劲儿落在这题上：${twist}`;
  const psychologyLayer = `${HEALTH_PSYCH_DEEP[qi] ?? HEALTH_PSYCH_DEEP[0]}\n\n${base.psychologyLayer}`;
  const spiritLayer = `${HEALTH_SPIRIT_DEEP[qi] ?? HEALTH_SPIRIT_DEEP[0]}\n\n${base.spiritLayer}`;
  const actionPath = `${HEALTH_ACTION_DEEP[qi] ?? HEALTH_ACTION_DEEP[0]}\n\n${base.actionPath}`;
  const masterSummary = `${HEALTH_SUM_DEEP[qi] ?? HEALTH_SUM_DEEP[0]} ${base.masterSummary}`;

  return { cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary };
}
