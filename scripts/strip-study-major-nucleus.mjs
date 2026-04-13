/**
 * 一次性迁移用：从**旧版**（每格整句、牌名在句首）的 major 桥接抽核句。
 * 当前库已升级为 STUDY_MAJOR_NUCLEUS；若 major 文件含 STUDY_MAJOR_NUCLEUS 则本脚本直接退出。
 * 运行：node scripts/strip-study-major-nucleus.mjs
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const majors = [
  '愚者',
  '魔术师',
  '女祭司',
  '皇后',
  '皇帝',
  '教皇',
  '恋人',
  '战车',
  '力量',
  '隐士',
  '命运之轮',
  '正义',
  '倒吊人',
  '死神',
  '节制',
  '恶魔',
  '高塔',
  '星星',
  '月亮',
  '太阳',
  '审判',
  '世界',
];

function nucleus(s, name) {
  let t = s.replace(/^这题问救分：/, '');
  if (!t.startsWith(name)) {
    throw new Error(`Expected ${name} at start of: ${s.slice(0, 60)}`);
  }
  t = t.slice(name.length);
  if (t.startsWith('若来，')) t = t.slice(3);
  if (t.startsWith('若塌，')) t = t.slice(3);
  const colonHook = t.match(/^([\s\S]{1,50}?：)/);
  if (colonHook) {
    return t.slice(colonHook[1].length);
  }
  const verbs = [
    '先整理',
    '先写',
    '先停',
    '别信',
    '别抄',
    '别只听',
    '别在',
    '别用',
    '别脑补',
    '别装',
    '别为',
    '别传',
    '别无限',
    '别道德',
    '别冷战',
    '别冲动',
    '被一句话',
    '被期待',
    '把缓冲',
    '把一年',
    '想把',
    '按住',
    '清掉',
    '点破',
    '警告',
    '结束',
    '允许',
    '带着',
    '请',
    '让你',
    '要你',
    '说',
    '劝你',
    '提醒',
    '指向',
    '撕开',
    '把',
    '问',
    '立',
    '查',
    '找',
    '给',
    '喊',
    '清',
    '若来',
    '若塌',
    '调',
    '最易',
    '刷卡',
    '手抖',
    '在友情',
    '站在',
    '最怕',
    '就是',
    '整理',
    '写',
    '别',
    '先',
  ];
  for (const v of verbs) {
    if (t.startsWith(v)) return t.slice(v.length);
  }
  /* 如「高塔若来，是滤镜碎…」去名与「若来，」后，核句以「是」起笔 */
  return t;
}

const src = fs.readFileSync(path.join(root, 'lib/tarot-study-master-bridges-major-zh.ts'), 'utf8');
if (src.includes('STUDY_MAJOR_NUCLEUS')) {
  console.log('skip: tarot-study-master-bridges-major-zh.ts already A-upgraded');
  process.exit(0);
}
const start = src.indexOf('export const STUDY_MAJOR_BRIDGE');
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
  if (body[q - 1] === '\\') {
    i = q + 1;
    continue;
  }
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

if (strings.length !== 440) {
  console.error('Parsed string count', strings.length);
  process.exit(1);
}

const TAG_PSYCH = [
  '期末近了，你在想「通宵还能不能把这门救回来」。',
  '转专业摆在面前，重修像一摞山，你在转与不转之间掂。',
  '二战还是上班，家里催得紧，你在怎么回与怎么活之间卡。',
  '四级三次没过，出国梦还在，你在坚持与换路之间痛。',
  '导师邮件石沉大海，你在等与换之间耗。',
  '实习工资低，你在熬满三个月与跑路之间算。',
  '室友半夜吵，你在撕破脸与忍之间憋。',
  '网课挂了重修贵，你在求情与认栽之间抖。',
  '毕设拖稿，你在延毕与硬熬之间选。',
  '中介喊保录，你在信与不信之间悬。',
  '高考分出来，你在复读与走之间赌。',
  '升本名额只有一个，你在争与让之间烫。',
  '考证班两万，你在退与认之间肉疼。',
  '面试被嫌本科，你在怼与稳之间慌。',
  '签证填错一页，你在重交与认命之间急。',
  '寒暑假有限，你在打工与竞赛之间排。',
  '爸妈逼考公，你在扛与从之间闷。',
  '小组有人划水，你在署名与不署之间恶心。',
  '毕业前一门挂，你在证与延期之间抖。',
  '先找工作再考研，你在缓冲与自欺之间问。',
];

const nuclei = [];
for (let qi = 0; qi < 20; qi++) {
  const row = [];
  for (let mi = 0; mi < 22; mi++) {
    const raw = strings[qi * 22 + mi];
    row.push(nucleus(raw, majors[mi]));
  }
  nuclei.push(row);
}

const outPath = path.join(root, 'lib/tarot-study-major-nucleus.generated.json');
fs.writeFileSync(outPath, JSON.stringify({ TAG_PSYCH, nuclei }, null, 0), 'utf8');
console.log('Wrote', outPath);
