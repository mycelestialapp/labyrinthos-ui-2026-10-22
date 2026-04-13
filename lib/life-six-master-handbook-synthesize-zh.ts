/**
 * 生活六大类 · 档 5「合成厚稿」（非手册终稿）
 * 题干钩句（life-categories 导出 H_*）+ 引擎五段：用于紧扣本题、保留「大师对你讲话」牌语骨架与 B 档 Rubric。
 * 感情类第一问那种手册终稿 = 每条 register 全文手刻；本模块不冒充那一层，只提供可继续逐条替换的初值。
 *
 * 【路线 B】人改时建议整段替换五段对象，少做「在机器句尾巴上补一句」；终稿听感应齐于「大师对你讲话」，与感情 Q1 的差别只在体例（勿牌格独白），不在厚度目标。
 */
import type { MasterQuestionCardContent } from "./tarot-master-question-types-shared";
import {
  H_CHILD,
  H_CHOICE,
  H_HEALTH,
  H_PET,
  H_REL,
  H_SPIRIT,
} from "./tarot-master-question-content-life-categories";
import { composeHealthRichHandbook } from "./life-six-health-handbook-rich-zh";
import { composeRelationRichHandbook } from "./life-six-relation-handbook-rich-zh";
import { composeChildRichHandbook } from "./life-six-child-handbook-rich-zh";
import { composeChoiceRichHandbook } from "./life-six-choice-handbook-rich-zh";
import { composePetRichHandbook } from "./life-six-pet-handbook-rich-zh";
import { composeSpiritRichHandbook } from "./life-six-spirit-handbook-rich-zh";
import { buildLifeSixEngineMasterEntry } from "./tarot-master-question-content-life-six-engine";

const HOOKS_BY_CAT = [H_HEALTH, H_REL, H_CHILD, H_CHOICE, H_PET, H_SPIRIT] as const;

/** 去掉「这张牌对你说：」前缀，取题干向大师钩句作扣题备忘 */
function hookBodyForQuestion(catIdx: number, qi: number): string {
  const raw = HOOKS_BY_CAT[catIdx]![qi] ?? HOOKS_BY_CAT[catIdx]![0]!;
  const t = raw.replace(/^这张牌对你说：/, "").trim();
  return t.length > 200 ? `${t.slice(0, 197)}…` : t;
}

const SPIRIT_LEAD_BY_CAT: readonly string[] = [
  "这题是身体与节律题：先把「我怕麻烦」和「我怕出事」分开写，医嘱才进得来。\n\n",
  "这题是关系与边界题：先把「我要被喜欢」和「我要被尊重」分开量，话才下得准。\n\n",
  "这题是养育与责任题：先把「我怕不够好」和「孩子此刻需要什么」分开看，动作才不会变形。\n\n",
  "这题是选择与代价题：先把「我想要」和「我付得起」并排写，决定才不飘。\n\n",
  "这题是照护与风险题：先把「它会不会怪我」和「它现在痛不痛」分开问，判断才不软。\n\n",
  "这题是内在与节奏题：先把「我哪里坏了」改成「我哪里累了」，自责才不会盖过修法。\n\n",
];

function actionLead(_catIdx: number, q: string): string {
  const tail = q.length > 36 ? `${q.slice(0, 35)}…` : q;
  return `紧扣题干：把「${tail}」里最不敢落笔的那一格，写成今天能做的一步（预约、写下、当面问清其一）。\n\n`;
}

function psychologyLead(q: string): string {
  return `你心里真正对准的是题干里这句：「${q}」。这不是别人的剧本，是你此刻要认的真实。\n\n`;
}

function masterTail(q: string): string {
  const tag = q.length > 26 ? `${q.slice(0, 25)}…` : q;
  return `——回扣题干：「${tag}」时，把下一步写进日历，比把怕写进搜索框更靠近解。`;
}

/**
 * 合成单条大师手册五段：引擎保证牌面与 Rubric 骨架；钩句与导语保证「紧扣本题」。
 */
export function synthesizeLifeSixMasterHandbookEntry(
  catIdx: number,
  qi: number,
  cardId: string,
  upright: boolean,
  q: string,
): MasterQuestionCardContent {
  const base = buildLifeSixEngineMasterEntry(catIdx, qi, cardId, upright, q);
  /** 身体健康：机器侧富化（本题深描 + 牌种扣题） */
  if (catIdx === 0) {
    return composeHealthRichHandbook(base, qi, cardId, upright);
  }
  /** 人际关系：与健康同档富化，紧扣题干 */
  if (catIdx === 1) {
    return composeRelationRichHandbook(base, qi, cardId, upright);
  }
  /** 生育子女 */
  if (catIdx === 2) {
    return composeChildRichHandbook(base, qi, cardId, upright);
  }
  /** 选择决策 */
  if (catIdx === 3) {
    return composeChoiceRichHandbook(base, qi, cardId, upright);
  }
  /** 宠物 */
  if (catIdx === 4) {
    return composePetRichHandbook(base, qi, cardId, upright);
  }
  /** 灵性成长 */
  if (catIdx === 5) {
    return composeSpiritRichHandbook(base, qi, cardId, upright);
  }

  const kits = hookBodyForQuestion(catIdx, qi);
  const cardSpeaking = `${base.cardSpeaking}\n\n本题扣题：${kits}`;
  const psychologyLayer = `${psychologyLead(q)}${base.psychologyLayer}`;
  const spiritLayer = `${SPIRIT_LEAD_BY_CAT[catIdx] ?? SPIRIT_LEAD_BY_CAT[0]}${base.spiritLayer}`;
  const actionPath = `${actionLead(catIdx, q)}${base.actionPath}`;
  const masterSummary = `${base.masterSummary}${masterTail(q)}`;

  return { cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary };
}
