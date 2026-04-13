/**
 * 校验生活六大类：静态包关键导出 + rest 生成物含六类「××自检」行动层标签。
 * 说明：`esbuild` 打 IIFE 时常把中文打成 `\\uXXXX`，故 bundle 不测 UTF-8 字面。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const bundlePath = path.join(root, 'public', 'tarotQuestionLifeCategoriesContent.js');
const restPath = path.join(root, 'lib', 'tarot-life-six-rest-layers.generated.ts');
const bridgePath = path.join(root, 'lib', 'tarot-life-six-window-bridge.ts');
const scriptVerPath = path.join(root, 'lib', 'tarot-life-six-public-script-url.ts');
const masterHtmlPath = path.join(root, 'public', 'tarot-master.html');
const lifeCatPath = path.join(root, 'lib', 'tarot-master-question-content-life-categories.ts');
const quickPickPath = path.join(root, 'lib', 'tarot-question-quick-pick.ts');

const needBundleAscii = [
  'getMasterQuestionContentLifeSix',
  'LIFE_SIX_MASTER_CATEGORY_IDS',
  'registerLifeSixHealthMasterHandbook',
  'registerLifeSixSpiritMasterHandbook',
];

const needRestUtf8 = ['【就医自检】', '【关系自检】', '【养育自检】', '【决策自检】', '【照护自检】', '【身心自检】'];

function main() {
  if (
    !fs.existsSync(bridgePath) ||
    !fs.existsSync(masterHtmlPath) ||
    !fs.existsSync(lifeCatPath) ||
    !fs.existsSync(quickPickPath)
  ) {
    console.error('[verify-life-six-bundle] 缺少 bridge / tarot-master / life-categories / quick-pick');
    process.exit(1);
  }
  const verSrc = fs.readFileSync(scriptVerPath, 'utf8');
  const verM = verSrc.match(/export const TAROT_QUESTION_LIFE_CATEGORIES_SCRIPT_VERSION\s*=\s*"(\d+)"/);
  if (!verM) {
    console.error(
      '[verify-life-six-bundle] 无法解析 tarot-life-six-public-script-url.ts 中的 TAROT_QUESTION_LIFE_CATEGORIES_SCRIPT_VERSION',
    );
    process.exit(1);
  }
  const bridgeVer = verM[1];
  const htmlSrc = fs.readFileSync(masterHtmlPath, 'utf8');
  const htmlM = htmlSrc.match(/tarotQuestionLifeCategoriesContent\.js\?v=(\d+)/);
  if (!htmlM || htmlM[1] !== bridgeVer) {
    console.error(
      `[verify-life-six-bundle] tarot-master.html 中生活六大类 v= 须与 bridge 一致（html=${htmlM ? htmlM[1] : '无'} bridge=${bridgeVer}）`,
    );
    process.exit(1);
  }

  const lifeCat = fs.readFileSync(lifeCatPath, 'utf8');
  if (
    !lifeCat.includes('LIFE_SIX_MASTER_QUESTIONS_BY_CATEGORY_ID') ||
    !lifeCat.includes('身体健康: Q_HEALTH')
  ) {
    console.error('[verify-life-six-bundle] life-categories 缺少 LIFE_SIX_MASTER_QUESTIONS_BY_CATEGORY_ID 映射');
    process.exit(1);
  }
  const qp = fs.readFileSync(quickPickPath, 'utf8');
  if (!qp.includes('LIFE_SIX_MASTER_QUESTIONS_BY_CATEGORY_ID')) {
    console.error('[verify-life-six-bundle] quick-pick 须从 LIFE_SIX_MASTER_QUESTIONS_BY_CATEGORY_ID 展开六大类题干');
    process.exit(1);
  }

  if (!fs.existsSync(bundlePath)) {
    console.error('[verify-life-six-bundle] 缺少', bundlePath);
    process.exit(1);
  }
  const st = fs.statSync(bundlePath);
  const b = fs.readFileSync(bundlePath, 'utf8');
  for (const s of needBundleAscii) {
    if (!b.includes(s)) {
      console.error(`[verify-life-six-bundle] bundle 缺少：${s}`);
      process.exit(1);
    }
  }
  const minBytes = 45 * 1024 * 1024;
  if (st.size < minBytes) {
    console.error(`[verify-life-six-bundle] bundle 过小（${st.size} < ${minBytes}），可能未打入冻结库`);
    process.exit(1);
  }

  if (!fs.existsSync(restPath)) {
    console.error('[verify-life-six-bundle] 缺少', restPath);
    process.exit(1);
  }
  const r = fs.readFileSync(restPath, 'utf8');
  if (!r.includes('export const LIFE_SIX_REST_PSYCH') || !r.includes('lifeSixRestLayerIndex')) {
    console.error('[verify-life-six-bundle] rest 层文件结构异常');
    process.exit(1);
  }
  for (const s of needRestUtf8) {
    const n = r.split(s).length - 1;
    if (n < 1000) {
      console.error(`[verify-life-six-bundle] rest 层缺少或过少：${s}（出现 ${n} 次）`);
      process.exit(1);
    }
  }

  const mb = (st.size / (1024 * 1024)).toFixed(1);
  console.log(`[verify-life-six-bundle] ok · bundle ≈ ${mb} MB · 六类行动自检标签已在 rest 层`);
}

main();
