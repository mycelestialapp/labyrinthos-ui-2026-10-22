/**
 * 将生活六大类引擎五段式写入 `*.registers.generated.ts`（历史/对照用）。
 * 【线上】成品以 `emit-life-six-master-handbook-runner.ts` 输出的 `*.master-handbook.generated.ts` 为准。
 * 构建：esbuild 打包后 node 执行。
 */
import * as fs from 'fs';
import * as path from 'path';
import { buildLifeSixEngineMasterEntry } from '../lib/tarot-master-question-content-life-six-engine';
import { LIFE_SIX_VOICE_PACKS } from '../lib/tarot-life-six-voice-deck-zh';

const suits = ['wands', 'cups', 'swords', 'pentacles'] as const;

function writeCategory(ci: number): void {
  const pack = LIFE_SIX_VOICE_PACKS[ci]!;
  const slug = pack.slug;
  const exportFn = `registerLifeSix${slug.charAt(0).toUpperCase() + slug.slice(1)}FrozenRegisters`;
  const outPath = path.join(process.cwd(), 'lib', `tarot-master-question-content-life-six-${slug}.registers.generated.ts`);
  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * AUTO-GENERATED — npm run tarot:life-six:freeze');
  lines.push(` * ${pack.categoryId} · 20×156 条`);
  lines.push(' */');
  lines.push("import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';");
  lines.push('');
  lines.push(`export function ${exportFn}(`);
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

  for (let qi = 0; qi < pack.questions.length; qi++) {
    const Q = pack.questions[qi]!;
    for (let mi = 0; mi < 22; mi++) {
      for (const up of [true, false]) {
        const id = `major_${mi}`;
        const c = buildLifeSixEngineMasterEntry(ci, qi, id, up, Q);
        lines.push(
          `  register(categoryId, questionTexts[${qi}]!, ${JSON.stringify(id)}, ${String(up)}, ${JSON.stringify(c)});`
        );
      }
    }
    for (const suit of suits) {
      for (let num = 1; num <= 14; num++) {
        for (const up of [true, false]) {
          const id = `${suit}_${num}`;
          const c = buildLifeSixEngineMasterEntry(ci, qi, id, up, Q);
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

function main(): void {
  for (let ci = 0; ci < LIFE_SIX_VOICE_PACKS.length; ci++) {
    writeCategory(ci);
  }
}

main();
