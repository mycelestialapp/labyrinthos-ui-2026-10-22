/**
 * 灵性成长 · 机器侧富化终稿向（仍非「感情 Q1 级全文手刻」）
 * 与健康、人际关系同档：`synthesizeLifeSixMasterHandbookEntry` 在 catIdx===5 时调用。
 */
import type { MasterQuestionCardContent } from "./tarot-master-question-types-shared";
import { H_SPIRIT } from "./tarot-master-question-content-life-categories";

const SPIRIT_PSYCH_DEEP: readonly string[] = [
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

const SPIRIT_SPIRIT_DEEP: readonly string[] = [
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

const SPIRIT_ACTION_DEEP: readonly string[] = [
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

const SPIRIT_SUM_DEEP: readonly string[] = [
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

const SPIRIT_MAJOR_TWIST: readonly (readonly [string, string])[] = [
  ["愚者正位：第一次面对浑浑噩噩别赌顿悟，先把三因命名写纸上。", "愚者逆位：别用再看看拖没命名的空。"],
  ["魔术师正位：人、睡眠、支持、小步行动齐了，才把力气拧成今天一格。", "魔术师逆位：嘴上说改天，先把闹钟设好第一下。"],
  ["女祭司正位：直觉提示空，不代替写下来与问人；睡前把最怕想起写清。", "女祭司逆位：越躲安静越慌；把一步出门写进日历。"],
  ["皇后正位：滋养是也给身体留氧气；先睡一口，再谈大改变。", "皇后逆位：用刷手机填洞会更空；收回一小时写小赢。"],
  ["皇帝正位：把手机落地、短修、倾诉窗写清，自责少一半。", "皇帝逆位：硬扛全能自律会裂；松一格换成可执行三分钟。"],
  ["教皇正位：传统劝勉与身体节奏并听，签字落在你能执行的版本上。", "教皇逆位：鸡汤很响、睡眠很薄时要停。"],
  ["恋人正位：要体面、要立刻好、要被喜欢——三选二先写清。", "恋人逆位：又想戒又想刷会内耗；先写三条底线再谈。"],
  ["战车正位：推进改变也推进节奏；带着怕走，也别情绪飙车。", "战车逆位：急骂自己最伤进展；先离开屏幕三分钟。"],
  ["力量正位：温柔是按住羞辱与自责；敢看专业建议，也不辱骂自己慢。", "力量逆位：自责换不来改变；把力气换成一句我需要。"],
  ["隐士正位：独处里分清我恨的是习惯、是人，还是旧脚本。", "隐士逆位：越躲越会脑补全集；把一句真话写给自己看。"],
  ["命运之轮正位：状态会变；顺势是更新微习惯，不是躺平也不是爆炸。", "命运之轮逆位：坏运气里仍能选今天这一格呼吸或出门。"],
  ["正义正位：对齐事实再谈原谅与边界；记录是你的秤。", "正义逆位：别用情绪替证据；先补齐材料再谈。"],
  ["倒吊人正位：暂停不是摆烂，是换视角看我要什么节奏。", "倒吊人逆位：别卡在内耗里；先完成最小动作。"],
  ["死神正位：旧互动要退场，新模式要问身体愿不愿意。", "死神逆位：怕改变会拖成慢性麻木；写清为何停再谈。"],
  ["节制正位：内在成长需要渐变，一次一个主题、一个三分钟。", "节制逆位：节制变压抑时，开一条小缝求助或倾诉。"],
  ["恶魔正位：刷手机与自我骂会冒充我在努力；写下来才算数。", "恶魔逆位：松一格硬扛，换一寸可执行的关屏或出门。"],
  ["高塔正位：崩溃或失眠像雷；先护身体安全，再谈体面。", "高塔逆位：预警已响就别装听不见。"],
  ["星星正位：希望要接在行动上；一次预约、一次呼吸也是星光。", "星星逆位：别只许愿；把下一步写进日历。"],
  ["月亮正位：误读会变形；用记录与复述对抗幻想。", "月亮逆位：夜里别自证到天亮；设闹钟停搜。"],
  ["太阳正位：修复需要晒得到人的安排；见面散步也是晒太阳。", "太阳逆位：别独自乐观；把倾诉或门诊时间写出来。"],
  ["审判正位：复盘自责与节奏，叫醒我还能改口的那部分。", "审判逆位：别赖过去；从下一次三呼吸重启。"],
  ["世界正位：一段微习惯写完要写小结：我们约定什么、何时复查。", "世界逆位：别停在差不多；问清何时再谈、谁来执行。"],
];

const SPIRIT_MINOR_TWIST: readonly string[] = [
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

function hookBodySpirit(qi: number): string {
  const raw = H_SPIRIT[qi] ?? H_SPIRIT[0]!;
  return raw.replace(/^这张牌对你说：/, "").trim();
}

function majorMinorTwistSpirit(cardId: string, upright: boolean): string {
  const up = upright ? 0 : 1;
  const mj = /^major_(\d+)$/.exec(cardId);
  if (mj) {
    const mi = Math.min(21, Math.max(0, Number(mj[1])));
    const row = SPIRIT_MAJOR_TWIST[mi] ?? SPIRIT_MAJOR_TWIST[0]!;
    return row[up] ?? row[0]!;
  }
  const m2 = /^(wands|cups|swords|pentacles)_(\d+)$/.exec(cardId);
  if (!m2) return "把下一步写短，写在纸上，再带进今天的节奏里。";
  const suit = m2[1]!;
  const num = Number(m2[2]);
  const sk = suit === "wands" ? 0 : suit === "cups" ? 1 : suit === "swords" ? 2 : 3;
  const band = num <= 10 ? 0 : 1;
  const idx = sk * 4 + band * 2 + up;
  return SPIRIT_MINOR_TWIST[idx] ?? SPIRIT_MINOR_TWIST[0]!;
}

export function composeSpiritRichHandbook(
  base: MasterQuestionCardContent,
  qi: number,
  cardId: string,
  upright: boolean,
): MasterQuestionCardContent {
  const hook = hookBodySpirit(qi);
  const twist = majorMinorTwistSpirit(cardId, upright);
  const cardSpeaking = `${base.cardSpeaking}\n\n【本题深读】\n${hook}\n\n这牌的劲儿落在这题上：${twist}`;
  const psychologyLayer = `${SPIRIT_PSYCH_DEEP[qi] ?? SPIRIT_PSYCH_DEEP[0]}\n\n${base.psychologyLayer}`;
  const spiritLayer = `${SPIRIT_SPIRIT_DEEP[qi] ?? SPIRIT_SPIRIT_DEEP[0]}\n\n${base.spiritLayer}`;
  const actionPath = `${SPIRIT_ACTION_DEEP[qi] ?? SPIRIT_ACTION_DEEP[0]}\n\n${base.actionPath}`;
  const masterSummary = `${SPIRIT_SUM_DEEP[qi] ?? SPIRIT_SUM_DEEP[0]} ${base.masterSummary}`;

  return { cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary };
}

