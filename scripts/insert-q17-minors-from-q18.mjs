/**
 * Moves Q18 minor arcana (wands..pentacles) to after Q17 major_21, transforming to Q17 question id.
 * Result order: Q17 majors+minors, Q18 majors only, Q20+...
 */
import fs from 'node:fs';

const path = new URL('../lib/tarot-master-question-content-love.ts', import.meta.url);
let s = fs.readFileSync(path, 'utf8');

const Q18 = 'register(感情婚姻, 对方目前展现的行为能量对我来说代表什么我该如何判断, ';
const Q17 = 'register(感情婚姻, 他她目前对我的真实感受能量是什么我该如何回应, ';

const q18Major0Open =
  "register(感情婚姻, 对方目前展现的行为能量对我来说代表什么我该如何判断, 'major_0', true, {";
const iMajor0 = s.indexOf(q18Major0Open);
if (iMajor0 === -1) {
  console.error('Q18 major_0 open not found');
  process.exit(1);
}
const closeNeedle = '});\r\n';
let iClose = s.lastIndexOf(closeNeedle, iMajor0);
let nlAfterClose = closeNeedle.length;
if (iClose === -1) {
  iClose = s.lastIndexOf('});\n', iMajor0);
  nlAfterClose = '});\n'.length;
}
if (iClose === -1 || iClose >= iMajor0) {
  console.error('Q17 major_21 false close before Q18 major_0 not found');
  process.exit(1);
}
const insertPos = iClose + nlAfterClose;

const minorStart = s.indexOf(Q18 + "'wands_1'", insertPos);
if (minorStart === -1) {
  console.error('Q18 wands_1 not found after major_0');
  process.exit(1);
}

const pentFalse = s.indexOf(Q18 + "'pentacles_14', false, {", minorStart);
if (pentFalse === -1) {
  console.error('Q18 pentacles_14 false not found');
  process.exit(1);
}
const subPent = s.slice(pentFalse);
const closeM = subPent.match(/\n\}\);\r?\n/);
if (!closeM) {
  console.error('pentacles_14 false close not found');
  process.exit(1);
}
const minorEnd = pentFalse + closeM.index + closeM[0].length;

const q18Minors = s.slice(minorStart, minorEnd);

function transformBlock(block) {
  let t = block.replaceAll(Q18, Q17);
  t = t.replaceAll('【辨讯现状】', '【映受现状】');
  t = t.replaceAll('对方', 'TA');
  t = t.replace(/——对你意味「([^」]+)」/g, '；感受带「$1」色');
  t = t.replace(/。判断/g, '。回应：');
  t = t.replace(/，意味/g, '，别把它读成');
  return t;
}

const blocks = [];
let pos = 0;
while (pos < q18Minors.length) {
  const reg = q18Minors.indexOf(Q18, pos);
  if (reg === -1) break;
  const next = q18Minors.indexOf(Q18, reg + Q18.length);
  const chunk = next === -1 ? q18Minors.slice(reg) : q18Minors.slice(reg, next);
  blocks.push(transformBlock(chunk));
  pos = next === -1 ? q18Minors.length : next;
}

if (blocks.length !== 112) {
  console.error('expected 112 minor blocks, got', blocks.length);
  process.exit(1);
}

const footer =
  '// ---------- 第十七问「他／她目前对我的真实感受／能量是什么？我该如何回应？」：78×2=156 条已全部入库 ----------\n';

const insertion = '\n' + blocks.join('') + '\n' + footer + '\n';

/** Keep Q18 minors after Q18 majors (do not drop the original span). */
const newS =
  s.slice(0, insertPos) +
  insertion +
  s.slice(insertPos, minorStart) +
  s.slice(minorStart, minorEnd) +
  s.slice(minorEnd);

fs.writeFileSync(path, newS, 'utf8');
console.log('inserted', blocks.length, 'Q17 minor blocks; removed duplicate span', minorStart, '-', minorEnd);
