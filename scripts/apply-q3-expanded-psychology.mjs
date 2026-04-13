/**
 * 第三问小牌心理层扩写入库。数据分文件维护，便于分批提交。
 * 用法：node scripts/apply-q3-expanded-psychology.mjs
 */
import fs from 'node:fs';
import { PATCHES as PATCHES_WANDS } from './q3-psych-wands-patches.mjs';
import { PATCHES as PATCHES_CUPS } from './q3-psych-cups-patches.mjs';
import { PATCHES as PATCHES_SWORDS } from './q3-psych-swords-patches.mjs';
import { PATCHES as PATCHES_PENTS } from './q3-psych-pentacles-patches.mjs';

const TS = new URL('../lib/tarot-master-question-content-love.ts', import.meta.url);

const Q = '这段关系想教会我什么';

const PATCHES = [
  ...PATCHES_WANDS,
  ...PATCHES_CUPS,
  ...PATCHES_SWORDS,
  ...PATCHES_PENTS,
];

function replacePsych(s, cardId, upright, newPsych) {
  const needle = `register(感情婚姻, ${Q}, '${cardId}', ${upright}, {`;
  const idx = s.indexOf(needle);
  if (idx === -1) {
    throw new Error(`找不到块: ${cardId} ${upright}`);
  }
  const pPsych = s.indexOf('psychologyLayer: `', idx);
  if (pPsych === -1 || pPsych > idx + 800) {
    throw new Error(`找不到 psychologyLayer: ${cardId}`);
  }
  const start = pPsych + 'psychologyLayer: `'.length;
  let end = start;
  while (end < s.length) {
    if (s[end] === '`' && s[end + 1] === ',') break;
    end++;
  }
  return s.slice(0, pPsych) + 'psychologyLayer: `' + newPsych + '`,' + s.slice(end + 2);
}

let s = fs.readFileSync(TS, 'utf8');
for (const p of PATCHES) {
  s = replacePsych(s, p.cardId, p.upright, p.psychologyLayer);
}
fs.writeFileSync(TS, s, 'utf8');
console.log('第三问心理层已扩写', PATCHES.length, '条');
