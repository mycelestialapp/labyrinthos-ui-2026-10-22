/**
 * 选择决策 · 机器侧富化终稿向（仍非「感情 Q1 级全文手刻」）
 * 与健康、人际关系同档：`synthesizeLifeSixMasterHandbookEntry` 在 catIdx===3 时调用。
 */
import type { MasterQuestionCardContent } from "./tarot-master-question-types-shared";
import { H_CHOICE } from "./tarot-master-question-content-life-categories";

const CHOICE_PSYCH_DEEP: readonly string[] = [
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

const CHOICE_SPIRIT_DEEP: readonly string[] = [
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

const CHOICE_ACTION_DEEP: readonly string[] = [
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

const CHOICE_SUM_DEEP: readonly string[] = [
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

const CHOICE_MAJOR_TWIST: readonly (readonly [string, string])[] = [
  ["愚者正位：第一次重大决定先别赌运气，把选项与决定日写进日历再跳。", "愚者逆位：别用再看看拖没截止日的决定。"],
  ["魔术师正位：人、钱、法律顾问、家人沟通齐了，才把力气拧成签哪一格。", "魔术师逆位：嘴上说改天，先把决策表第一行填上。"],
  ["女祭司正位：直觉提示风险，不代替算现金流与合同；睡前把最怕失去写清。", "女祭司逆位：越躲对话越吵；把请求写成三行带进家庭会。"],
  ["皇后正位：滋养是也给未来留氧气；顺心若买睡眠，别透支身体签单。", "皇后逆位：用面子填洞会更空；收回一小时写真实结余。"],
  ["皇帝正位：把节点、违约金、产权写清，争执少一半。", "皇帝逆位：硬扛全能决策会裂；松一格换成可复查的书面。"],
  ["教皇正位：传统意见与专业条款并听，签字落在你能执行的版本上。", "教皇逆位：场面话很响、条款很薄时要停。"],
  ["恋人正位：要面子、要安稳、要心动——三选二先写清；最怕都要。", "恋人逆位：又想忍又想撕会内耗；先写三条底线再谈妥协。"],
  ["战车正位：推进决定也推进节奏；带着怕签，也别情绪飙车。", "战车逆位：急话最伤谈判；先离开现场三分钟，再回来谈。"],
  ["力量正位：温柔是按住羞辱与恐吓；敢看合同细字，也不辱骂自己犹豫。", "力量逆位：自责换不来好决定；把力气换成一句清楚请求。"],
  ["隐士正位：慢查资料可以，但要设闹钟停搜。", "隐士逆位：别独自在夜里把后悔脑补成判决书。"],
  ["命运之轮正位：机会窗会变；顺势是更新计划，不是躺平也不是乱赌。", "命运之轮逆位：坏运气里仍能选今天这一格专业咨询。"],
  ["正义正位：对齐事实再谈公平；合同与流水是你的秤。", "正义逆位：别用情绪替证据；先补齐材料再签。"],
  ["倒吊人正位：暂停不是耍赖，是换视角看代价与退出成本。", "倒吊人逆位：别卡在内耗里；先完成最小决策动作。"],
  ["死神正位：旧承诺要退场，新模式要问自己愿不愿意买单。", "死神逆位：怕改变会拖成慢性亏损；写清为何停再谈。"],
  ["节制正位：重大决定需要渐变，一次一个主题、一个截止日。", "节制逆位：节制变压抑时，开一条小缝给真话或求助。"],
  ["恶魔正位：面子会冒充我必须撑；写下来才算数。", "恶魔逆位：松一格硬撑，换一寸可执行的拒绝或延期。"],
  ["高塔正位：突发违约或家庭爆发像雷；先护现金流与安全，再谈体面。", "高塔逆位：预警已响就别装听不见。"],
  ["星星正位：希望要接在行动上；一次律师预约也是星光。", "星星逆位：别只许愿；把下一步写进日历。"],
  ["月亮正位：误读合同与误读人心都会变形；用复述与记录对抗幻想。", "月亮逆位：夜里别自证到天亮；设闹钟停搜。"],
  ["太阳正位：好决定需要晒得到人的对齐；见面谈条件也是晒太阳。", "太阳逆位：别独自乐观；把决定日写出来。"],
  ["审判正位：复盘条款与怕，叫醒我还能改口的那部分。", "审判逆位：别赖过去；从下一次书面确认重启。"],
  ["世界正位：一段决定写完要写小结：我们约定什么、何时复查。", "世界逆位：别停在差不多；问清何时再谈、谁来执行。"],
];

const CHOICE_MINOR_TWIST: readonly string[] = [
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

function hookBodyChoice(qi: number): string {
  const raw = H_CHOICE[qi] ?? H_CHOICE[0]!;
  return raw.replace(/^这张牌对你说：/, "").trim();
}

function majorMinorTwistChoice(cardId: string, upright: boolean): string {
  const up = upright ? 0 : 1;
  const mj = /^major_(\d+)$/.exec(cardId);
  if (mj) {
    const mi = Math.min(21, Math.max(0, Number(mj[1])));
    const row = CHOICE_MAJOR_TWIST[mi] ?? CHOICE_MAJOR_TWIST[0]!;
    return row[up] ?? row[0]!;
  }
  const m2 = /^(wands|cups|swords|pentacles)_(\d+)$/.exec(cardId);
  if (!m2) return "把下一步写短，写在纸上，再带进决定里。";
  const suit = m2[1]!;
  const num = Number(m2[2]);
  const sk = suit === "wands" ? 0 : suit === "cups" ? 1 : suit === "swords" ? 2 : 3;
  const band = num <= 10 ? 0 : 1;
  const idx = sk * 4 + band * 2 + up;
  return CHOICE_MINOR_TWIST[idx] ?? CHOICE_MINOR_TWIST[0]!;
}

export function composeChoiceRichHandbook(
  base: MasterQuestionCardContent,
  qi: number,
  cardId: string,
  upright: boolean,
): MasterQuestionCardContent {
  const hook = hookBodyChoice(qi);
  const twist = majorMinorTwistChoice(cardId, upright);
  const cardSpeaking = `${base.cardSpeaking}\n\n【本题深读】\n${hook}\n\n这牌的劲儿落在这题上：${twist}`;
  const psychologyLayer = `${CHOICE_PSYCH_DEEP[qi] ?? CHOICE_PSYCH_DEEP[0]}\n\n${base.psychologyLayer}`;
  const spiritLayer = `${CHOICE_SPIRIT_DEEP[qi] ?? CHOICE_SPIRIT_DEEP[0]}\n\n${base.spiritLayer}`;
  const actionPath = `${CHOICE_ACTION_DEEP[qi] ?? CHOICE_ACTION_DEEP[0]}\n\n${base.actionPath}`;
  const masterSummary = `${CHOICE_SUM_DEEP[qi] ?? CHOICE_SUM_DEEP[0]} ${base.masterSummary}`;

  return { cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary };
}
