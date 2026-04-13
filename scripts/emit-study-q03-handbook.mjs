/**
 * 生成 lib/tarot-master-question-content-study-q03-handbook.ts
 * 第三问：考研二战 / 就业 / 家里催促如何回应
 * 运行：node scripts/emit-study-q03-handbook.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { upHooks, dnHooks } from "./study-q03-majors-data.mjs";
import { synthMinorQ3 } from "./study-minor-master-synth.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

const Q = "考研二战还是找工作家里一直催我怎么回？";

function minorRegFromSynth(suit, num, up) {
  const { cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary } = synthMinorQ3(suit, num, up);
  return `  regMinor('${suit}', ${num}, ${up}, {
    cardSpeaking:
      '${esc("【再战求职·牌语】" + cardSpeaking)}',
    psychologyLayer:
      '${esc(psychologyLayer)}',
    spiritLayer:
      '${esc(spiritLayer)}',
    actionPath:
      '${esc(actionPath)}',
    masterSummary: '${esc(masterSummary)}',
  });`;
}

function stripActBaggageLine(s) {
  return s
    .replace(/\\n\\n检查你的「行囊」：/g, "\\n\\n【行囊自检】")
    .replace(/\n\n检查你的「行囊」：/g, "\n\n【行囊自检】");
}
function wrapQ3Act(s) {
  const x = stripActBaggageLine(s);
  if (x.startsWith("【再战求职·今日一格】")) return x;
  return `【再战求职·今日一格】${x}`;
}
function wrapQ3Sum(s) {
  if (s.startsWith("【再战求职·总断】")) return s;
  return `【再战求职·总断】${s}`;
}

const majorRegs = [];
for (let i = 0; i < 22; i++) {
  const [lab, cs, psy, spi, act, sum] = upHooks[i];
  majorRegs.push(`  register(
    categoryId,
    q,
    'major_${i}',
    true,
    E({
      cardSpeaking: '${esc(lab + "：" + cs)}',
      psychologyLayer: '${esc(psy)}',
      spiritLayer: '${esc(spi)}',
      actionPath: '${esc(wrapQ3Act(act))}',
      masterSummary: '${esc(wrapQ3Sum(sum))}',
    })
  );`);
  const [lab2, cs2, psy2, spi2, act2, sum2] = dnHooks[i];
  majorRegs.push(`  register(
    categoryId,
    q,
    'major_${i}',
    false,
    E({
      cardSpeaking: '${esc("【再战求职·牌语】" + lab2 + "：" + cs2)}',
      psychologyLayer: '${esc(psy2)}',
      spiritLayer: '${esc(spi2)}',
      actionPath: '${esc(wrapQ3Act(act2))}',
      masterSummary: '${esc(wrapQ3Sum(sum2))}',
    })
  );`);
}

const minorRegs = [];
for (const suit of ["wands", "cups", "swords", "pentacles"]) {
  minorRegs.push(`  // ---------- ${suit} ----------`);
  for (let num = 1; num <= 14; num++) {
    minorRegs.push(minorRegFromSynth(suit, num, true));
    minorRegs.push(minorRegFromSynth(suit, num, false));
  }
}

const body = `/**
 * 学业考试 · 第三问「考研二战还是找工作家里一直催我怎么回？」手册级五段式（78×2=156 条）
 * 大牌：见 scripts/study-q03-majors-data.mjs；小牌：四元素题脉 + 点数位势 + 五段逐键组合（scripts/study-minor-master-synth.mjs）
 */
import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';

const Q3 = '${Q}' as const;

function E(c: MasterQuestionCardContent): MasterQuestionCardContent {
  return c;
}

/** 第三问手册入库（须在 freeze 与 Q1、Q2 手册之后调用） */
export function registerStudyQ03Handbook(
  register: (
    categoryId: string,
    questionText: string,
    cardId: string,
    upright: boolean,
    content: MasterQuestionCardContent
  ) => void,
  categoryId: string
): void {
  const q = Q3;
  if (categoryId !== '学业考试') return;

${majorRegs.join("\n\n")}

  function regMinor(
    suit: 'wands' | 'cups' | 'swords' | 'pentacles',
    num: number,
    up: boolean,
    c: MasterQuestionCardContent
  ): void {
    register(categoryId, q, \`\${suit}_\${num}\`, up, E(c));
  }

${minorRegs.join("\n")}
}
`;

const target = path.join(root, "lib", "tarot-master-question-content-study-q03-handbook.ts");
fs.writeFileSync(target, body, "utf8");
console.error("wrote", target, "lines", body.split("\n").length);
