/**
 * 塔罗大师解读 · 生活六大类（身体健康～灵性成长）· 具体问题 × 78 张牌 × 正逆
 *
 * 【档 5 · 可手改真源】各 `tarot-master-question-content-life-six-*.master-handbook.generated.ts`（`npm run tarot:life-six:emit-master-handbook`）。
 * 当前初值由 `life-six-master-handbook-synthesize-zh` 自动灌入：题干 H_* 钩句叠在引擎五段上——这是「紧扣本题的合成厚稿」，不是感情第一问那种逐条全文手刻的「手册终稿」。手册终稿只能在本文件内逐条替换 JSON 由人工完成。勿改成感情类牌格独白体。重跑 emit 会覆盖手改。
 * 【题脉/大牌核/小牌对】`tarot-life-six-voice-deck-zh.ts`；心理/灵性/行动/收束底材 `tarot-life-six-rest-layers.generated.ts`（`emit-life-six-rest-layers.ts` + `life-six-cat-pools-1-5.ts`，`npm run tarot:life-six:emit-layers`）。
 * 【题干】与 `tarot-master-question-content-life-categories.ts` 导出 Q_* 逐字一致。
 * 【重装配】`npm run tarot:life-six:rebuild`（emit-layers → emit-master-handbook → build:tarot-question-life → verify → lint:b）。
 * 【B 档 Rubric】npm run tarot:life-six:lint:b（全六大类）；分册 `lint:b-health` / `lint:b-relation` / `lint:b-child` / `lint:b-choice` / `lint:b-pet` / `lint:b-spirit`；`npm run tarot:life-six:check`（verify+lint:b，CI 同款）；已并入 rebuild
 * 【历史】`tarot:life-six:freeze` 与 `*.registers.generated.ts` 仅作对照/迁移；线上入库以 `*.master-handbook.generated.ts` 为准。
 *
 * 【路线 B · 人机接力】
 * 1. 机器：`emit-master-handbook` 灌入合成厚稿（题干 H_* + 引擎五段），保证 Rubric 骨架与题干扣死。
 * 2. 人：在对应 `*.master-handbook.generated.ts` 内**整段替换**每条 `register(..., {...})` 的 JSON（优先重写 cardSpeaking、psychologyLayer、masterSummary；spirit / action 可按题系统精修），勿在合成句上「只改两词」糊弄。
 * 3. 验：`npm run tarot:life-six:handbook:check`（Rubric + 打 life 包 + verify）。勿随意 `emit-master-handbook` 覆盖已手改文件；底材变更时先备份再重灌。
 * 【人手顺序】先从「身体健康」起：`lib/tarot-master-question-content-life-six-health.master-handbook.generated.ts`（20 题 ×156 条）。健康类已在 `life-six-health-handbook-rich-zh.ts` 做机器富化；**人际关系**同档见 `life-six-relation-handbook-rich-zh.ts`。**生育子女、选择决策、宠物、灵性成长**同档分别见 `life-six-child-handbook-rich-zh.ts`、`life-six-choice-handbook-rich-zh.ts`、`life-six-pet-handbook-rich-zh.ts`、`life-six-spirit-handbook-rich-zh.ts`（`emit-master-handbook` 重灌对应 `…-*.master-handbook.generated.ts`）。若要感情 Q1 级全文终稿仍须在对应 generated 文件逐条替换。改完可 `npm run tarot:life-six:handbook:check:health` / `handbook:check:relation` / `handbook:check:child` 等；全类终验用 `handbook:check`。
 */

import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';
import { LIFE_SIX_MASTER_CATEGORY_IDS } from './tarot-master-question-content-life-categories';
import { LIFE_SIX_VOICE_PACKS } from './tarot-life-six-voice-deck-zh';
import { registerLifeSixHealthMasterHandbook } from './tarot-master-question-content-life-six-health.master-handbook.generated';
import { registerLifeSixRelationMasterHandbook } from './tarot-master-question-content-life-six-relation.master-handbook.generated';
import { registerLifeSixChildMasterHandbook } from './tarot-master-question-content-life-six-child.master-handbook.generated';
import { registerLifeSixChoiceMasterHandbook } from './tarot-master-question-content-life-six-choice.master-handbook.generated';
import { registerLifeSixPetMasterHandbook } from './tarot-master-question-content-life-six-pet.master-handbook.generated';
import { registerLifeSixSpiritMasterHandbook } from './tarot-master-question-content-life-six-spirit.master-handbook.generated';

const STORE: Record<string, MasterQuestionCardContent> = {};

export function masterQuestionContentKeyLifeSix(
  categoryId: string,
  questionText: string,
  cardId: string,
  upright: boolean
): string {
  return `${categoryId}|${questionText}|${cardId}|${upright ? 'upright' : 'reversed'}`;
}

function register(
  categoryId: string,
  questionText: string,
  cardId: string,
  upright: boolean,
  content: MasterQuestionCardContent
): void {
  STORE[masterQuestionContentKeyLifeSix(categoryId, questionText, cardId, upright)] = content;
}

const REGISTRARS = [
  registerLifeSixHealthMasterHandbook,
  registerLifeSixRelationMasterHandbook,
  registerLifeSixChildMasterHandbook,
  registerLifeSixChoiceMasterHandbook,
  registerLifeSixPetMasterHandbook,
  registerLifeSixSpiritMasterHandbook,
] as const;

for (let i = 0; i < REGISTRARS.length; i++) {
  const pack = LIFE_SIX_VOICE_PACKS[i]!;
  REGISTRARS[i]!(register, pack.categoryId, pack.questions);
}

const CATEGORY_SET = new Set<string>([...LIFE_SIX_MASTER_CATEGORY_IDS]);

export function getMasterQuestionContentLifeSix(
  categoryId: string,
  questionText: string,
  cardId: string,
  upright: boolean,
  options?: { placeholder?: boolean }
): MasterQuestionCardContent | null {
  if (!CATEGORY_SET.has(categoryId)) return null;
  const q = questionText?.trim() ?? '';
  const key = masterQuestionContentKeyLifeSix(categoryId, q, cardId, upright);
  const stored = STORE[key];
  if (stored) return stored;
  if (options?.placeholder) {
    const hint = `此牌针对「${q || questionText}」的${categoryId}向专属五段式正在补全。`;
    return {
      cardSpeaking: hint,
      psychologyLayer: hint,
      spiritLayer: hint,
      actionPath: hint,
      masterSummary: hint,
      isPlaceholder: true,
    };
  }
  return null;
}

export function getAllDmyTarotCardIdsLifeSix(): string[] {
  const majors = Array.from({ length: 22 }, (_, j) => `major_${j}`);
  const minors: string[] = [];
  for (const suit of ['wands', 'cups', 'swords', 'pentacles'] as const) {
    for (let n = 1; n <= 14; n++) minors.push(`${suit}_${n}`);
  }
  return [...majors, ...minors];
}

export { LIFE_SIX_MASTER_CATEGORY_IDS };
