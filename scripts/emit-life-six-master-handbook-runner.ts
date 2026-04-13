/**
 * 生活六大类 · 档 5 可手改真源（逐条 register）
 * 初值 = `life-six-master-handbook-synthesize-zh`：题干 H_* + 引擎五段的「合成厚稿」，便于紧扣本题；健康/人际/生育子女/选择决策/宠物/灵性成长六类中后四类与健康同档机器富化（各 `life-six-*-handbook-rich-zh.ts`）。不是感情第一问级「全文手册终稿」。
 * 终稿须在本生成文件内逐条人工替换 JSON（路线 B：机器厚稿 → 人整段重写 → `npm run tarot:life-six:handbook:check`）。
 * 口径须保持「大师对你讲话」与 B 档 Rubric；勿改成感情类牌格独白体。重跑会覆盖手改——手改前请备份或勿重跑本脚本。
 */
import * as fs from "fs";
import * as path from "path";
import { synthesizeLifeSixMasterHandbookEntry } from "../lib/life-six-master-handbook-synthesize-zh";
import { LIFE_SIX_VOICE_PACKS } from "../lib/tarot-life-six-voice-deck-zh";

const suits = ["wands", "cups", "swords", "pentacles"] as const;

function slugToExportBase(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function writeCategory(ci: number): void {
  const pack = LIFE_SIX_VOICE_PACKS[ci]!;
  const slug = pack.slug;
  const base = slugToExportBase(slug);
  const exportFn = `registerLifeSix${base}MasterHandbook`;
  const outPath = path.join(
    process.cwd(),
    "lib",
    `tarot-master-question-content-life-six-${slug}.master-handbook.generated.ts`,
  );
  const lines: string[] = [];
  lines.push("/**");
  lines.push(" * AUTO-GENERATED — npm run tarot:life-six:emit-master-handbook");
  lines.push(
    ` * 【档 5】${pack.categoryId} · 可手改真源 · 20×156 条（初值 = 合成厚稿，非手册终稿）${
      ci === 0
        ? " · 【人手优先】健康类建议首批在此文件终稿。"
        : ci === 1
          ? " · 人际关系与健康同档：`life-six-relation-handbook-rich-zh` 富化。"
          : ci === 2
            ? " · 生育子女与健康同档：`life-six-child-handbook-rich-zh` 富化。"
            : ci === 3
              ? " · 选择决策与健康同档：`life-six-choice-handbook-rich-zh` 富化。"
              : ci === 4
                ? " · 宠物与健康同档：`life-six-pet-handbook-rich-zh` 富化。"
                : ci === 5
                  ? " · 灵性成长与健康同档：`life-six-spirit-handbook-rich-zh` 富化。"
                  : ""
    }`,
  );
  lines.push(
    " * 初值 = `life-six-master-handbook-synthesize-zh`（题干 H_* + 引擎五段）。手册终稿 = 逐条人工替换 JSON；须保留「大师对你讲话」与 B 档 Rubric（后四段勿用【甲·乙】中带中点的节标）。",
  );
  lines.push(" * 勿改为感情类牌格独白体。重跑本脚本会覆盖手改。");
  lines.push(" */");
  lines.push("import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';");
  lines.push("");
  lines.push(`export function ${exportFn}(`);
  lines.push("  register: (");
  lines.push("    categoryId: string,");
  lines.push("    questionText: string,");
  lines.push("    cardId: string,");
  lines.push("    upright: boolean,");
  lines.push("    content: MasterQuestionCardContent");
  lines.push("  ) => void,");
  lines.push("  categoryId: string,");
  lines.push("  questionTexts: readonly string[]");
  lines.push("): void {");

  for (let qi = 0; qi < pack.questions.length; qi++) {
    const Q = pack.questions[qi]!;
    for (let mi = 0; mi < 22; mi++) {
      for (const up of [true, false]) {
        const id = `major_${mi}`;
        const c = synthesizeLifeSixMasterHandbookEntry(ci, qi, id, up, Q);
        lines.push(
          `  register(categoryId, questionTexts[${qi}]!, ${JSON.stringify(id)}, ${String(up)}, ${JSON.stringify(c)});`,
        );
      }
    }
    for (const suit of suits) {
      for (let num = 1; num <= 14; num++) {
        for (const up of [true, false]) {
          const id = `${suit}_${num}`;
          const c = synthesizeLifeSixMasterHandbookEntry(ci, qi, id, up, Q);
          lines.push(
            `  register(categoryId, questionTexts[${qi}]!, ${JSON.stringify(id)}, ${String(up)}, ${JSON.stringify(c)});`,
          );
        }
      }
    }
  }

  lines.push("}");
  lines.push("");
  fs.writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote ${outPath} (${lines.length} lines)`);
}

function main(): void {
  for (let ci = 0; ci < LIFE_SIX_VOICE_PACKS.length; ci++) {
    writeCategory(ci);
  }
}

main();
