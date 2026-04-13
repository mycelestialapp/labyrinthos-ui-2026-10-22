/**
 * 将学业引擎五段式冻结为逐条 register（与财运/事业入库形态一致）。
 * 构建：esbuild 打包后 node 执行。
 */
import * as fs from 'fs';
import * as path from 'path';
import { buildStudyEngineMasterEntry } from '../lib/tarot-master-question-content-study-engine';
import { STUDY_QUESTION_TEXTS } from '../lib/tarot-master-question-content-study-texts-only';

const suits = ['wands', 'cups', 'swords', 'pentacles'] as const;

function main(): void {
  const outPath = path.join(process.cwd(), 'lib', 'tarot-master-question-content-study-registers.generated.ts');
  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * AUTO-GENERATED — 运行 `npm run tarot:study:freeze` 重新生成。');
  lines.push(' * 【手册级定稿】每条须在本文件内逐条人工改正文；冻结稿仅为可编辑底稿，非「手冊终稿」直至你替换完毕。');
  lines.push(' * 勿把运行时引擎当正式真源；改引擎后重冻会覆盖本文件。');
  lines.push(' */');
  lines.push("import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';");
  lines.push('');
  lines.push('export function registerStudyFrozenRegisters(');
  lines.push('  register: (');
  lines.push('    categoryId: string,');
  lines.push('    questionText: string,');
  lines.push('    cardId: string,');
  lines.push('    upright: boolean,');
  lines.push('    content: MasterQuestionCardContent');
  lines.push('  ) => void,');
  lines.push('  categoryId: string,');
  lines.push('  questionTexts: readonly string[]');
  lines.push('): void {');

  for (let qi = 0; qi < STUDY_QUESTION_TEXTS.length; qi++) {
    const Q = STUDY_QUESTION_TEXTS[qi]!;
    for (let mi = 0; mi < 22; mi++) {
      for (const up of [true, false]) {
        const id = `major_${mi}`;
        const c = buildStudyEngineMasterEntry(qi, id, up, Q);
        lines.push(
          `  register(categoryId, questionTexts[${qi}]!, ${JSON.stringify(id)}, ${String(up)}, ${JSON.stringify(c)});`
        );
      }
    }
    for (const suit of suits) {
      for (let num = 1; num <= 14; num++) {
        for (const up of [true, false]) {
          const id = `${suit}_${num}`;
          const c = buildStudyEngineMasterEntry(qi, id, up, Q);
          lines.push(
            `  register(categoryId, questionTexts[${qi}]!, ${JSON.stringify(id)}, ${String(up)}, ${JSON.stringify(c)});`
          );
        }
      }
    }
  }

  lines.push('}');
  lines.push('');
  fs.writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Wrote ${outPath} (${lines.length} lines)`);
}

main();
