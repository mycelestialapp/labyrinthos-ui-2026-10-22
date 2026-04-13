/**
 * 将财运引擎五段式冻结为逐条 register 调用（与事业库入库形态一致）。
 * 构建：esbuild 打包后 node 执行；勿直接 ts-node，避免路径解析差异。
 */
import * as fs from 'fs';
import * as path from 'path';
import { buildMoneyEngineMasterEntry } from '../lib/tarot-master-question-content-money-engine';
import { MONEY_QUESTION_TEXTS } from '../lib/tarot-master-question-content-money-texts-only';

const suits = ['wands', 'cups', 'swords', 'pentacles'] as const;

function main(): void {
  const outPath = path.join(process.cwd(), 'lib', 'tarot-master-question-content-money-registers.generated.ts');
  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * AUTO-GENERATED — 运行 `npm run tarot:money:freeze` 重新生成。');
  lines.push(' * 每条为独立 register 字面量；大师级定稿请在本文件内逐条改正文（勿改回运行时拼装）。');
  lines.push(' */');
  lines.push("import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';");
  lines.push('');
  lines.push('export function registerMoneyFrozenRegisters(');
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

  for (let qi = 0; qi < MONEY_QUESTION_TEXTS.length; qi++) {
    const Q = MONEY_QUESTION_TEXTS[qi]!;
    for (let mi = 0; mi < 22; mi++) {
      for (const up of [true, false]) {
        const id = `major_${mi}`;
        const c = buildMoneyEngineMasterEntry(qi, id, up, Q);
        lines.push(
          `  register(categoryId, questionTexts[${qi}]!, ${JSON.stringify(id)}, ${String(up)}, ${JSON.stringify(c)});`
        );
      }
    }
    for (const suit of suits) {
      for (let num = 1; num <= 14; num++) {
        for (const up of [true, false]) {
          const id = `${suit}_${num}`;
          const c = buildMoneyEngineMasterEntry(qi, id, up, Q);
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
