/**
 * 人际关系 · 机器侧富化终稿向（仍非「感情 Q1 级全文手刻」）
 * 在引擎五段骨架上叠本题深描与牌种扣题句，供 `synthesizeLifeSixMasterHandbookEntry` 在 catIdx===1 时调用。
 * 与健康类同档：紧扣题干、五段加厚、大牌/小牌各一句扣题。
 */
import type { MasterQuestionCardContent } from "./tarot-master-question-types-shared";
import { H_REL } from "./tarot-master-question-content-life-categories";

/** 与 Q_REL 顺序一致：每题一段「心理挖根」，须含你/心里/怕/边界 等 Rubric 线索 */
const REL_PSYCH_DEEP: readonly string[] = [
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

const REL_SPIRIT_DEEP: readonly string[] = [
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

const REL_ACTION_DEEP: readonly string[] = [
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

const REL_SUM_DEEP: readonly string[] = [
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

/** 大牌：22×2 一句，把牌势扣回「边界与对齐」 */
const REL_MAJOR_TWIST: readonly (readonly [string, string])[] = [
  ["愚者正位像第一次开口要边界：先别赌对方会读心，先把不舒服说清楚。", "愚者逆位：别用「再看看」无限拖延该对齐的那句真话。"],
  ["魔术师正位：人、时间、见证、话术齐了，才把力气拧成「今晚谈不谈」这一句。", "魔术师逆位：嘴上说改天，先把第一条短信草稿写出来。"],
  ["女祭司正位：直觉提示危险，不代替核对事实与约定；睡前把底线想清。", "女祭司逆位：越躲对话越吵；把请求写成三行，当面或书面递出去。"],
  ["皇后正位：滋养是也给关系留氧气；先睡一口，再谈大和解。", "皇后逆位：用回避填洞会更空；收回一小时做诚实对话。"],
  ["皇帝正位：把分工、钱、回复窗写清，争执少一半。", "皇帝逆位：硬撑「全能和事佬」会裂；松一格，换成可轮流的责任表。"],
  ["教皇正位：传统与边界并听，签字要落在你们小家庭能执行的版本上。", "教皇逆位：场面话很响、真心很薄时要停；别用热闹代替对齐。"],
  ["恋人正位：要体面、要赢、要被爱——三选二先写清；关系题最怕都要。", "恋人逆位：又想忍又想撕会内耗；先写三条底线再谈妥协。"],
  ["战车正位：推进关系也要推进节奏；带着怕谈，也别情绪飙车。", "战车逆位：急话最伤亲近人；先离开现场三分钟，再回来谈。"],
  ["力量正位：温柔是按住羞辱与反击；敢听对方怕什么，也敢说自己怕什么。", "力量逆位：自责换不来尊重；把力气换成一句清楚的请求。"],
  ["隐士正位：独处里分清：我恨的是事，是人，还是旧脚本。", "隐士逆位：越躲越会脑补全集；把一句真话写给自己看。"],
  ["命运之轮正位：关系阶段会变；顺势是更新规则，不是躺平也不是爆炸。", "命运之轮逆位：坏运气里仍能选「今天这一格对齐」。"],
  ["正义正位：对齐事实再谈公平；聊天记录与约定是你的秤。", "正义逆位：别用情绪替证据；先补齐材料再争。"],
  ["倒吊人正位：暂停不是冷暴力，是换视角看「我要什么」。", "倒吊人逆位：别卡在内耗里；先完成最小对齐动作。"],
  ["死神正位：旧互动要退场，新模式要问双方愿不愿意。", "死神逆位：怕改变会拖成慢性伤害；写清「为何停」再谈。"],
  ["节制正位：关系需要渐变，一次一个主题、一个请求。", "节制逆位：节制变压抑时，开一条小缝给真话。"],
  ["恶魔正位：操控会冒充「我都是为你好」；写下来才算数。", "恶魔逆位：松一格控制，换一寸可执行的拒绝或请求。"],
  ["高塔正位：羞辱或爆发像雷；先护孩子与自身安全，再谈体面。", "高塔逆位：预警已响就别装听不见。"],
  ["星星正位：希望要接在行动上；一句约定也是星光。", "星星逆位：别只许愿；把下一步写进日历。"],
  ["月亮正位：误读会变形；用记录与复述对抗幻想。", "月亮逆位：夜里别自证到天亮；设闹钟停猜。"],
  ["太阳正位：修复需要晒得到人的安排；见面也是晒太阳。", "太阳逆位：别独自乐观；把谈话时间写出来。"],
  ["审判正位：复盘对话与底线，叫醒「我还能改口」的那部分。", "审判逆位：别赖过去；从下一次复述与道歉重启。"],
  ["世界正位：一段对齐写完要写小结：我们约定什么、何时复查。", "世界逆位：别停在「差不多」；问清何时再谈、谁来执行。"],
];

/** 小牌：4 元素 ×（数字段/宫廷段）× 正逆 = 16 句 */
const REL_MINOR_TWIST: readonly string[] = [
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

function hookBodyRelation(qi: number): string {
  const raw = H_REL[qi] ?? H_REL[0]!;
  return raw.replace(/^这张牌对你说：/, "").trim();
}

function majorMinorTwistRelation(cardId: string, upright: boolean): string {
  const up = upright ? 0 : 1;
  const mj = /^major_(\d+)$/.exec(cardId);
  if (mj) {
    const mi = Math.min(21, Math.max(0, Number(mj[1])));
    const row = REL_MAJOR_TWIST[mi] ?? REL_MAJOR_TWIST[0]!;
    return row[up] ?? row[0]!;
  }
  const m2 = /^(wands|cups|swords|pentacles)_(\d+)$/.exec(cardId);
  if (!m2) return "把下一步写短，写在纸上，再带进对话里。";
  const suit = m2[1]!;
  const num = Number(m2[2]);
  const sk = suit === "wands" ? 0 : suit === "cups" ? 1 : suit === "swords" ? 2 : 3;
  const band = num <= 10 ? 0 : 1;
  const idx = sk * 4 + band * 2 + up;
  return REL_MINOR_TWIST[idx] ?? REL_MINOR_TWIST[0]!;
}

/**
 * 人际关系类：在引擎骨架上叠本题深描 + 牌种扣题，仍保留 Rubric 要求的牌语结构。
 */
export function composeRelationRichHandbook(
  base: MasterQuestionCardContent,
  qi: number,
  cardId: string,
  upright: boolean,
): MasterQuestionCardContent {
  const hook = hookBodyRelation(qi);
  const twist = majorMinorTwistRelation(cardId, upright);
  const cardSpeaking = `${base.cardSpeaking}\n\n【本题深读】\n${hook}\n\n这牌的劲儿落在这题上：${twist}`;
  const psychologyLayer = `${REL_PSYCH_DEEP[qi] ?? REL_PSYCH_DEEP[0]}\n\n${base.psychologyLayer}`;
  const spiritLayer = `${REL_SPIRIT_DEEP[qi] ?? REL_SPIRIT_DEEP[0]}\n\n${base.spiritLayer}`;
  const actionPath = `${REL_ACTION_DEEP[qi] ?? REL_ACTION_DEEP[0]}\n\n${base.actionPath}`;
  const masterSummary = `${REL_SUM_DEEP[qi] ?? REL_SUM_DEEP[0]} ${base.masterSummary}`;

  return { cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary };
}
