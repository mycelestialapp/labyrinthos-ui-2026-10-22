/**
 * 生育子女 · 机器侧富化终稿向（仍非「感情 Q1 级全文手刻」）
 * 与健康、人际关系同档：`synthesizeLifeSixMasterHandbookEntry` 在 catIdx===2 时调用。
 */
import type { MasterQuestionCardContent } from "./tarot-master-question-types-shared";
import { H_CHILD } from "./tarot-master-question-content-life-categories";

const CHILD_PSYCH_DEEP: readonly string[] = [
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

const CHILD_SPIRIT_DEEP: readonly string[] = [
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

const CHILD_ACTION_DEEP: readonly string[] = [
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

const CHILD_SUM_DEEP: readonly string[] = [
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
  "",
  "",
  "",
];

const CHILD_MAJOR_TWIST: readonly (readonly [string, string])[] = [
  ["愚者正位：备孕像第一次走进门诊，先别赌运气，先把检查与对话排上日程。", "愚者逆位：别用「再等等」无限拖延该查的那一格。"],
  ["魔术师正位：人、检查单、伴侣共识齐了，才把力气拧成「这周去不去医院」这一句。", "魔术师逆位：嘴上说改天，先把挂号界面点开第一下。"],
  ["女祭司正位：直觉提示风险，不代替量体温与医嘱；睡前把三要问问清。", "女祭司逆位：越躲检查越吵；把症状与养育矛盾写成三行带去问医。"],
  ["皇后正位：滋养是孩子与大人都要睡一口；滋养不是无限忍让。", "皇后逆位：用刷手机填焦虑会更空；收回一小时给亲子对齐。"],
  ["皇帝正位：把喂养、接送、屏幕时间写清，争执少一半。", "皇帝逆位：硬扛全能父母会裂；松一格换成可轮流的责任表。"],
  ["教皇正位：长辈经验与指南并听，签字落在孩子利益上。", "教皇逆位：推销式偏方很响、证据很薄时要停。"],
  ["恋人正位：要成绩、要关系、要面子——三选二先写清。", "恋人逆位：又想忍又想撕会内耗；先写三条不可退让的育儿底线。"],
  ["战车正位：就医与上班、带娃并排时，用时间表带着怕走。", "战车逆位：急话最伤孩子；先离开现场三分钟，再回来谈。"],
  ["力量正位：温柔是对孩子耐心，敢看检查单也不辱骂自己。", "力量逆位：自责换不来好喂养；把怕问给听得懂的人。"],
  ["隐士正位：慢查资料可以，但要设闹钟停搜。", "隐士逆位：别独自在夜里把愧疚脑补成判决书。"],
  ["命运之轮正位：发育与家庭阶段会变；顺势是更新规则，不是躺平也不是爆炸。", "命运之轮逆位：坏运气里仍能选「今天这一格医嘱或陪伴」。"],
  ["正义正位：对齐事实再谈公平；成长曲线与医嘱是你的秤。", "正义逆位：别用情绪替证据；先补齐材料再争。"],
  ["倒吊人正位：暂停不是冷暴力，是把视角换到孩子这一侧。", "倒吊人逆位：别卡在内耗里；先完成最小育儿动作。"],
  ["死神正位：旧互动要退场，新模式要问全家愿不愿意。", "死神逆位：怕改变会拖成慢性伤害；写清「为何停」再问。"],
  ["节制正位：养育需要渐变，一次一个主题、一个请求。", "节制逆位：节制变压抑时，开一条小缝给真话。"],
  ["恶魔正位：内疚会冒充「我必须完美」；写下来才算数。", "恶魔逆位：松一格控制，换一寸可执行的求助或分工。"],
  ["高塔正位：突发高烧或冲突像雷；先护孩子安全，再谈体面。", "高塔逆位：预警已响就别装听不见。"],
  ["星星正位：希望要接在行动上；一次预约、一次共读也是星光。", "星星逆位：别只许愿；把下一步写进日历。"],
  ["月亮正位：误读会变形；用记录与复述对抗幻想。", "月亮逆位：夜里别自证到天亮；设闹钟停搜。"],
  ["太阳正位：恢复需要晒得到人的安排；陪玩也是晒太阳。", "太阳逆位：别独自乐观；把儿保或谈话时间写出来。"],
  ["审判正位：复盘用药与作息，叫醒「我还能改」的那部分。", "审判逆位：别赖过去；从下一次道歉与分工重启。"],
  ["世界正位：一段养育段落写完要写小结：我们约定什么、何时复查。", "世界逆位：别停在「差不多」；问清何时再谈、谁来执行。"],
];

const CHILD_MINOR_TWIST: readonly string[] = [
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

function hookBodyChild(qi: number): string {
  const raw = H_CHILD[qi] ?? H_CHILD[0]!;
  return raw.replace(/^这张牌对你说：/, "").trim();
}

function majorMinorTwistChild(cardId: string, upright: boolean): string {
  const up = upright ? 0 : 1;
  const mj = /^major_(\d+)$/.exec(cardId);
  if (mj) {
    const mi = Math.min(21, Math.max(0, Number(mj[1])));
    const row = CHILD_MAJOR_TWIST[mi] ?? CHILD_MAJOR_TWIST[0]!;
    return row[up] ?? row[0]!;
  }
  const m2 = /^(wands|cups|swords|pentacles)_(\d+)$/.exec(cardId);
  if (!m2) return "把下一步写短，写在纸上，再带进养育决定里。";
  const suit = m2[1]!;
  const num = Number(m2[2]);
  const sk = suit === "wands" ? 0 : suit === "cups" ? 1 : suit === "swords" ? 2 : 3;
  const band = num <= 10 ? 0 : 1;
  const idx = sk * 4 + band * 2 + up;
  return CHILD_MINOR_TWIST[idx] ?? CHILD_MINOR_TWIST[0]!;
}

export function composeChildRichHandbook(
  base: MasterQuestionCardContent,
  qi: number,
  cardId: string,
  upright: boolean,
): MasterQuestionCardContent {
  const hook = hookBodyChild(qi);
  const twist = majorMinorTwistChild(cardId, upright);
  const cardSpeaking = `${base.cardSpeaking}\n\n【本题深读】\n${hook}\n\n这牌的劲儿落在这题上：${twist}`;
  const psychologyLayer = `${CHILD_PSYCH_DEEP[qi] ?? CHILD_PSYCH_DEEP[0]}\n\n${base.psychologyLayer}`;
  const spiritLayer = `${CHILD_SPIRIT_DEEP[qi] ?? CHILD_SPIRIT_DEEP[0]}\n\n${base.spiritLayer}`;
  const actionPath = `${CHILD_ACTION_DEEP[qi] ?? CHILD_ACTION_DEEP[0]}\n\n${base.actionPath}`;
  const masterSummary = `${CHILD_SUM_DEEP[qi] ?? CHILD_SUM_DEEP[0]} ${base.masterSummary}`;

  return { cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary };
}
