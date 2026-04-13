import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const j = JSON.parse(fs.readFileSync(path.join(root, 'lib/tarot-study-major-nucleus.generated.json'), 'utf8'));

const esc = (s) => JSON.stringify(s);

const header = `/**
 * 学业大师向 · 题×大牌桥接（20 题 × 22 大牌）
 * STUDY_TAG_PSYCH 与 scripts/emit-study-rest-layers.mjs 的 TAG_PSYCH 同源；小牌桥接复用。
 * 拼装形态与财运 A 升级版一致：现状钩 +「这一步：」+ 核句（不在此重复牌名）。
 */

export const STUDY_TAG_PSYCH = ${JSON.stringify(j.TAG_PSYCH, null, 2)} as const;

const STUDY_MAJOR_NUCLEUS: readonly (readonly string[])[] = [
${j.nuclei.map((row) => `  [\n${row.map((s) => `    ${esc(s)},`).join('\n')}\n  ],`).join('\n')}
];

export const STUDY_MAJOR_BRIDGE: readonly (readonly string[])[] = STUDY_TAG_PSYCH.map((tag, qi) =>
  STUDY_MAJOR_NUCLEUS[qi]!.map((nuc) => \`\${tag}这一步：\${nuc}\`)
);
`;

fs.writeFileSync(path.join(root, 'lib/tarot-study-master-bridges-major-zh.ts'), header, 'utf8');
console.log('Wrote lib/tarot-study-master-bridges-major-zh.ts');
