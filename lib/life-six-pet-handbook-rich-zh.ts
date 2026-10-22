/**
 * 宠物 · 机器侧富化终稿向（仍非「感情 Q1 级全文手刻」）
 * 与健康、人际关系同档：`synthesizeLifeSixMasterHandbookEntry` 在 catIdx===4 时调用。
 */
import type { MasterQuestionCardContent } from "./tarot-master-question-types-shared";
import { H_PET } from "./tarot-master-question-content-life-categories";

const PET_PSYCH_DEEP: readonly string[] = [
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

const PET_SPIRIT_DEEP: readonly string[] = [
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

const PET_ACTION_DEEP: readonly string[] = [
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

const PET_SUM_DEEP: readonly string[] = [
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

const PET_MAJOR_TWIST: readonly (readonly [string, string])[] = [
  ["愚者正位：第一次急诊别赌运气，先把精神与呕吐频率记录再出发。", "愚者逆位：别用再看看拖延红线症状。"],
  ["魔术师正位：人、病历、运输笼、医院电话齐了，才把力气拧成去不去这一格。", "魔术师逆位：嘴上说等等，先把急诊包清单打勾。"],
  ["女祭司正位：直觉提示危险，不代替量体温与体征；睡前把三问写清。", "女祭司逆位：越躲就诊越慌；把症状写三行带去分诊。"],
  ["皇后正位：滋养是它要水粮安稳，也要你不羞辱；滋养不是无限忍让邻居。", "皇后逆位：用刷手机填焦虑会更空；收回一小时做训练或丰容。"],
  ["皇帝正位：把喂食遛弯隔离规则写清，多宠争执少一半。", "皇帝逆位：硬扛全能照护会裂；松一格换成可执行分工表。"],
  ["教皇正位：经验与医嘱并听，签字落在它利益上。", "教皇逆位：偏方很响证据很薄时要停。"],
  ["恋人正位：要省钱、要省事、要它舒服——三选二先写清。", "恋人逆位：又想忍投诉又想硬扛训练会内耗；先写三条本周底线。"],
  ["战车正位：就医与出差并排时，用时间表带着怕走。", "战车逆位：急打只会教恐惧；先离开现场三分钟再训。"],
  ["力量正位：温柔是按住怒与内疚；敢看检查单也不辱骂自己犹豫。", "力量逆位：自责换不来好照护；把怕问给听得懂的人。"],
  ["隐士正位：慢查资料可以，但要设闹钟停搜。", "隐士逆位：别独自在夜里把愧疚脑补成判决书。"],
  ["命运之轮正位：病情与季节会变；顺势是更新护理表，不是躺平也不是乱换粮。", "命运之轮逆位：坏运气里仍能选今天这一格就诊或记录。"],
  ["正义正位：对齐事实再谈理赔与治疗方案；化验单是你的秤。", "正义逆位：别用情绪替证据；先补齐材料再争。"],
  ["倒吊人正位：暂停不是弃疗，是换视角看它真正痛在哪。", "倒吊人逆位：别卡在内耗里；先完成最小照护动作。"],
  ["死神正位：旧互动要退场，治疗路径要问它生活质量愿不愿意。", "死神逆位：怕改变会拖成慢性痛；写清为何停再谈。"],
  ["节制正位：照护需要渐变，一次一个主题、一个参数。", "节制逆位：节制变压抑时，开一条小缝求助或复诊。"],
  ["恶魔正位：内疚会冒充我必须砸钱；写下来才算数。", "恶魔逆位：松一格执念，换一寸可执行的姑息或第二意见。"],
  ["高塔正位：突发抽搐或中毒像雷；先护它安全，再谈体面。", "高塔逆位：预警已响就别装听不见。"],
  ["星星正位：希望要接在行动上；一次预约、一次测水也是星光。", "星星逆位：别只许愿；把下一步写进日历。"],
  ["月亮正位：误读症状会变形；用记录与照片对抗幻想。", "月亮逆位：夜里别自证到天亮；设闹钟停搜。"],
  ["太阳正位：恢复需要晒得到人的安排；陪玩晒太阳也是疗。", "太阳逆位：别独自乐观；把复诊时间写出来。"],
  ["审判正位：复盘用药与护理，叫醒我还能改方案的那部分。", "审判逆位：别赖昨天喂错；从下一次记录重启。"],
  ["世界正位：一段疗程写完要写小结：我们约定什么、何时复查。", "世界逆位：别停在差不多；问清何时再评生活质量。"],
];

const PET_MINOR_TWIST: readonly string[] = [
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

function hookBodyPet(qi: number): string {
  const raw = H_PET[qi] ?? H_PET[0]!;
  return raw.replace(/^这张牌对你说：/, "").trim();
}

function majorMinorTwistPet(cardId: string, upright: boolean): string {
  const up = upright ? 0 : 1;
  const mj = /^major_(\d+)$/.exec(cardId);
  if (mj) {
    const mi = Math.min(21, Math.max(0, Number(mj[1])));
    const row = PET_MAJOR_TWIST[mi] ?? PET_MAJOR_TWIST[0]!;
    return row[up] ?? row[0]!;
  }
  const m2 = /^(wands|cups|swords|pentacles)_(\d+)$/.exec(cardId);
  if (!m2) return "把下一步写短，写在纸上，再带进照护决定里。";
  const suit = m2[1]!;
  const num = Number(m2[2]);
  const sk = suit === "wands" ? 0 : suit === "cups" ? 1 : suit === "swords" ? 2 : 3;
  const band = num <= 10 ? 0 : 1;
  const idx = sk * 4 + band * 2 + up;
  return PET_MINOR_TWIST[idx] ?? PET_MINOR_TWIST[0]!;
}

export function composePetRichHandbook(
  base: MasterQuestionCardContent,
  qi: number,
  cardId: string,
  upright: boolean,
): MasterQuestionCardContent {
  const hook = hookBodyPet(qi);
  const twist = majorMinorTwistPet(cardId, upright);
  const cardSpeaking = `${base.cardSpeaking}\n\n【本题深读】\n${hook}\n\n这牌的劲儿落在这题上：${twist}`;
  const psychologyLayer = `${PET_PSYCH_DEEP[qi] ?? PET_PSYCH_DEEP[0]}\n\n${base.psychologyLayer}`;
  const spiritLayer = `${PET_SPIRIT_DEEP[qi] ?? PET_SPIRIT_DEEP[0]}\n\n${base.spiritLayer}`;
  const actionPath = `${PET_ACTION_DEEP[qi] ?? PET_ACTION_DEEP[0]}\n\n${base.actionPath}`;
  const masterSummary = `${PET_SUM_DEEP[qi] ?? PET_SUM_DEEP[0]} ${base.masterSummary}`;

  return { cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary };
}
