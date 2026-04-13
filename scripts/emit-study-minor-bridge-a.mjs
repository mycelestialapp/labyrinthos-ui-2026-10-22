/**
 * 学业小牌桥接 → 财运 A 升级版：TAG stem +「这一步：」+「；」+ 去 {花} 与点数正逆后的核句。
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const TAG_PSYCH = JSON.parse(
  fs.readFileSync(path.join(root, 'lib/tarot-study-major-nucleus.generated.json'), 'utf8')
).TAG_PSYCH;

const RANKS = ['王牌', '十', '九', '八', '七', '六', '五', '四', '三', '二', '一', '侍从', '骑士', '王后', '国王'];

function stripFlowerRank(s) {
  let t = s.replace(/^\{花\}/, '');
  for (const r of RANKS) {
    for (const o of ['正位', '逆位']) {
      const p = r + o;
      if (t.startsWith(p)) {
        t = t.slice(p.length);
        break;
      }
    }
  }
  return t.replace(/^[：:]\s*/, '').trimStart();
}

function stemFromTag(tag) {
  return tag.endsWith('。') ? tag.slice(0, -1) : tag;
}

const src = fs.readFileSync(path.join(root, 'lib/tarot-study-master-bridges-minor-zh.ts'), 'utf8');
const start = src.indexOf('export const STUDY_MINOR_RANK_BRIDGE');
const slice = src.slice(start);
const lb = slice.indexOf('= [');
const rb = slice.lastIndexOf('];');
const body = slice.slice(lb + 3, rb);

const strings = [];
let i = 0;
const len = body.length;
while (i < len) {
  const q = body.indexOf("'", i);
  if (q === -1) break;
  let j = q + 1;
  let out = '';
  while (j < len) {
    const c = body[j];
    if (c === '\\' && body[j + 1] === "'") {
      out += "'";
      j += 2;
      continue;
    }
    if (c === "'") break;
    out += c;
    j++;
  }
  if (j < len && body[j] === "'") strings.push(out);
  i = j + 1;
}

if (strings.length !== 560) {
  console.error('Expected 560 minor strings, got', strings.length);
  process.exit(1);
}

const blocks = [];
let si = 0;
for (let qi = 0; qi < 20; qi++) {
  const stem = stemFromTag(TAG_PSYCH[qi]);
  const rows = [];
  for (let r = 0; r < 14; r++) {
    const up = strings[si++];
    const dn = strings[si++];
    rows.push(
      `    [\n      ${JSON.stringify(`这一步：${stem}；${stripFlowerRank(up)}`)},\n      ${JSON.stringify(`这一步：${stem}；${stripFlowerRank(dn)}`)},\n    ],`
    );
  }
  blocks.push(`  // Q${qi + 1}\n  [\n${rows.join('\n')}\n  ],`);
}

const out = `/**
 * 学业大师向 · 题×小牌点数桥接（20 题 × 14 点数 × 正逆）
 * 与 major 桥接所用 TAG（emit-study-rest-layers 同源）对齐；形态同财运 A 升级版。
 * 花色与点数只在「你抽到的是…」出现；桥接为「这一步：现状；核句」。
 */

export const STUDY_MINOR_RANK_BRIDGE: readonly (readonly (readonly [string, string])[])[] = [
${blocks.join('\n')}
];
`;

fs.writeFileSync(path.join(root, 'lib/tarot-study-master-bridges-minor-zh.ts'), out, 'utf8');
console.log('Wrote lib/tarot-study-master-bridges-minor-zh.ts');
