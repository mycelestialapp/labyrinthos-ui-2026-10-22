/**
 * 母版 A：第 1 问心理层结构——每条须同时含
 * 【关系现状】【心理层面】【根源层面】（可另起段，顺序建议：现状 → 心理 → 根源）。
 *
 * 用法：
 *   node scripts/lint-tarot-love-q1-psychology.mjs           # 只打报告，exit 0
 *   node scripts/lint-tarot-love-q1-psychology.mjs --strict  # 第 2–20 问任一条不合规则 exit 1
 *   node scripts/lint-tarot-love-q1-psychology.mjs --strict --min-psy=200  # 另要求心理层最短字元
 */
import fs from 'node:fs';

const strict = process.argv.includes('--strict');
const minArg = process.argv.find((a) => a.startsWith('--min-psy='));
const minPsy = minArg ? Number(minArg.split('=')[1]) : 0;

const path = new URL('../lib/tarot-master-question-content-love.ts', import.meta.url);
const s = fs.readFileSync(path, 'utf8');

const Q_CONSTS = [
  '这段关系的本质是什么',
  '我们之间最大的阻碍是什么',
  '这段关系想教会我什么',
  '我们目前的关系能量走向如何我可以做什么来影响它',
  '未来3到6个月我的感情能量会如何变化我该做什么准备',
  '这段感情目前最大的盲点课题是什么我该如何面对',
  '我该从哪些面向着手才能提高挽回的可能性',
  '如果我想挽回我目前最适合采取的步骤是',
  '我该怎么表达才能让他更愿意认真对待这段感情',
  '关于复合我需要知道什么',
  '我该如何调整心态才能更快走出这段感情',
  '放手与挽回分别意味着什么我该如何选择',
  '如何疗愈我的心',
  '什么样的伴侣适合我',
  '如何提升自己让我更容易吸引到合适的对象',
  '我该如何迎接新的爱情',
  '他她目前对我的真实感受能量是什么我该如何回应',
  '对方目前展现的行为能量对我来说代表什么我该如何判断',
  '我在感情中的模式是什么',
  '我为何总是吸引同类型的人',
];

const LABELS = ['【关系现状】', '【心理层面】', '【根源层面】'];

function extractRegisters(questionConst) {
  const needle = `register(感情婚姻, ${questionConst}, `;
  const blocks = [];
  let pos = 0;
  const closeTag = /\r?\n\}\);\r?\n/g;
  while (pos < s.length) {
    const i = s.indexOf(needle, pos);
    if (i === -1) break;
    closeTag.lastIndex = i + needle.length;
    const m = closeTag.exec(s);
    if (!m) break;
    const end = closeTag.lastIndex;
    blocks.push(s.slice(i, end));
    pos = end;
  }
  return blocks;
}

function getPsychologyLayer(block) {
  const prefix = 'psychologyLayer: `';
  const start = block.indexOf(prefix);
  if (start === -1) return null;
  let i = start + prefix.length;
  const out = [];
  while (i < block.length) {
    if (block[i] === '`' && block[i + 1] === ',') break;
    out.push(block[i]);
    i++;
  }
  return out.join('');
}

function checkStructure(psych) {
  const i1 = psych.indexOf('【关系现状】');
  const i2 = psych.indexOf('【心理层面】');
  const i3 = psych.indexOf('【根源层面】');
  const missing = [];
  if (i1 === -1) missing.push('【关系现状】');
  if (i2 === -1) missing.push('【心理层面】');
  if (i3 === -1) missing.push('【根源层面】');
  if (missing.length) return { missing, orderOk: true };
  const orderOk = i1 <= i2 && i2 <= i3;
  return { missing, orderOk };
}

let failed = false;

console.log('母版 A：心理层须含 ' + LABELS.join('、'));
if (minPsy > 0) console.log('附加：心理层长度 ≥', minPsy, '字元');
console.log('');

for (let idx = 0; idx < Q_CONSTS.length; idx++) {
  const q = Q_CONSTS[idx];
  const qn = idx + 1;
  const blocks = extractRegisters(q);
  if (blocks.length !== 156) {
    console.log(`问${qn} 错误：条数 ${blocks.length}≠156`);
    if (strict && qn >= 2) failed = true;
    continue;
  }

  let badStruct = 0;
  let badOrder = 0;
  let badLen = 0;
  for (const b of blocks) {
    const psych = getPsychologyLayer(b) ?? '';
    const { missing, orderOk } = checkStructure(psych);
    if (missing.length) badStruct++;
    if (!missing.length && !orderOk) badOrder++;
    if (minPsy > 0 && psych.length < minPsy) badLen++;
  }

  const isRef = qn === 1;
  const line = `问${qn}  结构不合规 ${badStruct}/156  顺序有误 ${badOrder}/156` +
    (minPsy > 0 ? `  长度<${minPsy} ${badLen}/156` : '') +
    (isRef ? '  （母版参考，--strict 不据此失败）' : '');

  console.log(line);

  if (strict && !isRef && (badStruct > 0 || badOrder > 0 || (minPsy > 0 && badLen > 0))) {
    failed = true;
  }
}

console.log('');
if (strict && failed) {
  console.log('strict：未通过母版 A（第 2–20 问须全部达标）。');
  process.exit(1);
}
console.log(strict ? 'strict：通过。' : '提示：加 --strict 可在 CI 中强制母版 A。');
process.exit(0);
