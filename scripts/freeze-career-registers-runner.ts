/**
 * 将事业引擎五段式冻结为逐条 register（与财运 freeze 同源）。
 * 构建：esbuild 打包后 node 执行。
 */
import * as fs from 'fs';
import * as path from 'path';
import { buildCareerEngineMasterEntry } from '../lib/tarot-master-question-content-career-engine';
import { CAREER_QUESTION_TEXTS } from '../lib/tarot-master-question-content-career-texts-only';

const suits = ['wands', 'cups', 'swords', 'pentacles'] as const;

function main(): void {
  const outPath = path.join(process.cwd(), 'lib', 'tarot-master-question-content-career-registers.generated.ts');
  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * AUTO-GENERATED — 运行 `npm run tarot:career:freeze` 重新生成。');
  lines.push(' * 每条为独立 register 字面量；大师级定稿请在本文件内逐条改正文。');
  lines.push(' */');
  lines.push("import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';");
  lines.push('');
  lines.push('export function registerCareerFrozenRegisters(');
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

  for (let qi = 0; qi < CAREER_QUESTION_TEXTS.length; qi++) {
    const Q = CAREER_QUESTION_TEXTS[qi]!;
    for (let mi = 0; mi < 22; mi++) {
      for (const up of [true, false]) {
        const id = `major_${mi}`;
        const c = buildCareerEngineMasterEntry(qi, id, up, Q);
        lines.push(
          `  register(categoryId, questionTexts[${qi}]!, ${JSON.stringify(id)}, ${String(up)}, ${JSON.stringify(c)});`
        );
      }
    }
    for (const suit of suits) {
      for (let num = 1; num <= 14; num++) {
        for (const up of [true, false]) {
          const id = `${suit}_${num}`;
          const c = buildCareerEngineMasterEntry(qi, id, up, Q);
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
