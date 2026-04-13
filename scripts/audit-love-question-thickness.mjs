/**
 * Compare 感情婚姻 20 问与第 1、2 问的篇幅/结构（仅统计，不改文件）
 */
import fs from 'node:fs';

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

function fieldLen(block, field) {
  const prefix = `${field}: \``;
  const start = block.indexOf(prefix);
  if (start === -1) return 0;
  let i = start + prefix.length;
  const out = [];
  while (i < block.length) {
    if (block[i] === '`' && block[i + 1] === ',') break;
    out.push(block[i]);
    i++;
  }
  return out.length;
}

function blockStats(block) {
  const cs = fieldLen(block, 'cardSpeaking');
  const ps = fieldLen(block, 'psychologyLayer');
  const p0 = block.indexOf('cardSpeaking: `');
  let opening = '';
  if (p0 !== -1) {
    const from = p0 + 'cardSpeaking: `'.length;
    const to = Math.min(from + 100, block.length);
    opening = block.slice(from, to);
  }
  return {
    cs,
    ps,
    total: cs + ps + fieldLen(block, 'spiritLayer') + fieldLen(block, 'actionPath'),
    has关系现状: block.includes('【关系现状】'),
    has你问: opening.includes('你问'),
  };
}

const report = [];
for (let idx = 0; idx < Q_CONSTS.length; idx++) {
  const q = Q_CONSTS[idx];
  const blocks = extractRegisters(q);
  if (blocks.length !== 156) {
    report.push({ q: idx + 1, name: q, error: `条数 ${blocks.length}≠156` });
    continue;
  }
  let sumCs = 0,
    sumPs = 0,
    sumTot = 0,
    rel = 0,
    niwen = 0;
  for (const b of blocks) {
    const st = blockStats(b);
    sumCs += st.cs;
    sumPs += st.ps;
    sumTot += st.total;
    if (st.has关系现状) rel++;
    if (st.has你问) niwen++;
  }
  const n = blocks.length;
  report.push({
    q: idx + 1,
    name: q.slice(0, 28) + (q.length > 28 ? '…' : ''),
    n,
    avgCard: Math.round(sumCs / n),
    avgPsy: Math.round(sumPs / n),
    avg4: Math.round(sumTot / n),
    pct关系现状: Math.round((rel / n) * 100),
    pct你问开头: Math.round((niwen / n) * 100),
  });
}

const q1 = report[0];
const q2 = report[1];
console.log('基准：第1问 avg cardSpeaking / psychologyLayer / 四段合计（字元）');
console.log(q1.avgCard, q1.avgPsy, q1.avg4, '| 【关系现状】', q1.pct关系现状 + '%', '| 牌说话以「你问」', q1.pct你问开头 + '%');
console.log('基准：第2问', q2.avgCard, q2.avgPsy, q2.avg4, '| 【关系现状】', q2.pct关系现状 + '%', '| 「你问」', q2.pct你问开头 + '%');
console.log('\n序号 | avg牌说话 | avg心理 | avg四段 | 【关系现状】% | 「你问」开头% | 题干缩写');
console.log('-'.repeat(95));
for (const r of report) {
  if (r.error) {
    console.log(r.q, r.error, r.name);
    continue;
  }
  const low =
    r.avgCard < Math.min(q1.avgCard, q2.avgCard) * 0.45 ||
    r.avgPsy < Math.min(q1.avgPsy, q2.avgPsy) * 0.45;
  const tag = low ? ' <<<' : '';
  console.log(
    String(r.q).padStart(2),
    String(r.avgCard).padStart(5),
    String(r.avgPsy).padStart(7),
    String(r.avg4).padStart(7),
    String(r.pct关系现状).padStart(6) + '%',
    String(r.pct你问开头).padStart(8) + '%',
    r.name + tag
  );
}
