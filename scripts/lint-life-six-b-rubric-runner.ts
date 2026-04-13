/**
 * B 档 · 生活六大类大师向 Rubric（可执行）
 *
 * 全量：npm run tarot:life-six:lint:b
 * 仅健康：npm run tarot:life-six:lint:b-health
 */
import {
  Q_CHILD,
  Q_CHOICE,
  Q_HEALTH,
  Q_PET,
  Q_REL,
  Q_SPIRIT,
} from "../lib/tarot-master-question-content-life-categories";
import { getMasterQuestionContentLifeSix } from "../lib/tarot-master-question-content-life-six";
import { LIFE_SIX_VOICE_PACKS } from "../lib/tarot-life-six-voice-deck-zh";

const SUITS = ["wands", "cups", "swords", "pentacles"] as const;

const CATALOG_BAND = /【[^】]*·[^】]*】/;
const BAN_SUBSTR = ["载荷", "熔断", "带宽", "协议", "注入层", "二值化", "结论密度"] as const;

/** 心理层须出现「对人说话 / 挖根」向线索之一 */
const PSYCH_HUMAN = /你|自己|心里|怕|焦虑|根|夜里|醒|委屈|怒|躲|卡|惯|内疚|羞耻|累|压|拎|推|台前/;

const CARES: {
  packIndex: number;
  categoryId: string;
  questions: readonly string[];
  /** 行动层须命中其一：类题可执行感 */
  actionHint: RegExp;
}[] = [
  {
    packIndex: 0,
    categoryId: "身体健康",
    questions: Q_HEALTH,
    actionHint:
      /预约|今天|一步|写下|清单|医院|门诊|急诊|电话|日历|问|面诊|药|复查|医嘱|病历|热线|社区|互联网|便利贴|闹钟|复印|截图/,
  },
  {
    packIndex: 1,
    categoryId: "人际关系",
    questions: Q_REL,
    actionHint: /边界|今天|一步|写下|话|说|约|道歉|信息|面对面|列|三条|短信|录音|陈述|模板|日历|见证/,
  },
  {
    packIndex: 2,
    categoryId: "生育子女",
    questions: Q_CHILD,
    actionHint: /预约|今天|一步|夫妻|孩子|复述|清单|医生|园|校|电话|日历|列|写|陪|分工|挂号/,
  },
  {
    packIndex: 3,
    categoryId: "选择决策",
    questions: Q_CHOICE,
    actionHint: /选项|今天|一步|写下|列|表|三年|最坏|成本|面对面|纸|日历|决定日|专业|律师|财务|试验|身体/,
  },
  {
    packIndex: 4,
    categoryId: "宠物",
    questions: Q_PET,
    actionHint: /医院|诊所|急诊|今天|一步|记录|粮|水|牵引|训练|清单|电话|拍照|体温|运输笼|参数|就诊/,
  },
  {
    packIndex: 5,
    categoryId: "灵性成长",
    questions: Q_SPIRIT,
    actionHint: /今天|一步|坐下|呼吸|写|关掉|三分钟|出门|走|睡|闹钟|手机|朋友|固定|倾诉|日记|小赢|命名/,
  },
];

type Five = {
  cardSpeaking: string;
  psychologyLayer: string;
  spiritLayer: string;
  actionPath: string;
  masterSummary: string;
};

/** 与线上 STORE 一致：档 5 master-handbook 真源 */
function lifeSixFiveForLint(
  categoryId: string,
  questionText: string,
  cardId: string,
  upright: boolean,
): Five {
  const c = getMasterQuestionContentLifeSix(categoryId, questionText, cardId, upright);
  if (!c || c.isPlaceholder) {
    throw new Error(`[life-six-b] 缺少库文：${categoryId} | ${questionText} | ${cardId} | ${upright}`);
  }
  const { cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary } = c;
  return { cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary };
}

function parseOnlyArg(): string | null {
  const a = process.argv.find((x) => x.startsWith("--only="));
  return a ? a.slice("--only=".length).trim() : null;
}

function assertPackQuestionsAlign(packIndex: number, questions: readonly string[], categoryId: string): void {
  const pack = LIFE_SIX_VOICE_PACKS[packIndex]!;
  if (pack.categoryId !== categoryId) {
    throw new Error(`[life-six-b] pack[${packIndex}].categoryId=${pack.categoryId} 与期望 ${categoryId} 不符`);
  }
  if (pack.questions.length !== questions.length) {
    throw new Error(`[life-six-b] ${categoryId} 题量 pack=${pack.questions.length} 源=${questions.length}`);
  }
  for (let i = 0; i < questions.length; i += 1) {
    if (pack.questions[i] !== questions[i]) {
      throw new Error(`[life-six-b] ${categoryId} 题序 qi=${i} 不一致`);
    }
  }
}

function rubricViolations(
  q: string,
  c: Five,
  actionHint: RegExp,
): string[] {
  const v: string[] = [];
  const { cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary } = c;

  if (!cardSpeaking.startsWith("这张牌对你说：")) v.push("cardSpeaking 须以「这张牌对你说：」起句");
  if (!cardSpeaking.includes("你抽到的是「")) v.push("cardSpeaking 须含「你抽到的是「…」」");
  if (!cardSpeaking.includes(`你问的是「${q}」`)) v.push("cardSpeaking 须嵌入本题题干（你问的是「…」）");
  if (!cardSpeaking.includes("牌魂落在")) v.push("cardSpeaking 须含「牌魂落在」");

  for (const field of [psychologyLayer, spiritLayer, actionPath, masterSummary] as const) {
    if (CATALOG_BAND.test(field)) {
      v.push(
        `${field === psychologyLayer ? "psych" : field === spiritLayer ? "spirit" : field === actionPath ? "action" : "sum"} 仍含【…·…】说明书式小标题`,
      );
    }
  }

  if (!PSYCH_HUMAN.test(psychologyLayer)) {
    v.push("psychologyLayer 须有「对人/挖根」向用词（你·心里·怕·根…之一）");
  }
  if (!actionHint.test(actionPath)) {
    v.push("actionPath 缺少该类可执行锚点（预约/写下/今天一步/边界…视类而定）");
  }

  const min = {
    cardSpeaking: 48,
    psychologyLayer: 24,
    spiritLayer: 16,
    actionPath: 24,
    masterSummary: 12,
  } as const;
  (Object.keys(min) as (keyof typeof min)[]).forEach((k) => {
    if (c[k].trim().length < min[k]) v.push(`${k} 过短（<${min[k]} 字）`);
  });

  const bag = [cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary].join("\n");
  for (const w of BAN_SUBSTR) {
    if (bag.includes(w)) v.push(`含忌讳词「${w}」`);
  }

  const set = new Set([cardSpeaking, psychologyLayer, spiritLayer, actionPath, masterSummary]);
  if (set.size < 5) v.push("五段存在整段完全相同，需区分层次");

  const sum = masterSummary.replace(/\s+/g, "");
  if (sum.length >= 24) {
    const h = Math.floor(sum.length / 2);
    if (sum.slice(0, h) === sum.slice(h)) v.push("masterSummary 前后半段完全重复");
  }

  return v;
}

function runCategory(packIndex: number, categoryId: string, questions: readonly string[], actionHint: RegExp): number {
  assertPackQuestionsAlign(packIndex, questions, categoryId);
  let fail = 0;
  for (let qi = 0; qi < questions.length; qi += 1) {
    const q = questions[qi]!;
    for (let mi = 0; mi < 22; mi += 1) {
      for (const up of [true, false]) {
        const id = `major_${mi}`;
        const c = lifeSixFiveForLint(categoryId, q, id, up);
        const bad = rubricViolations(q, c, actionHint);
        if (bad.length) {
          fail += 1;
          console.error(`[FAIL] ${categoryId} | ${q} | ${id} | ${up ? "正" : "逆"}`);
          for (const b of bad) console.error(`       · ${b}`);
        }
      }
    }
    for (const suit of SUITS) {
      for (let num = 1; num <= 14; num += 1) {
        for (const up of [true, false]) {
          const id = `${suit}_${num}`;
          const c = lifeSixFiveForLint(categoryId, q, id, up);
          const bad = rubricViolations(q, c, actionHint);
          if (bad.length) {
            fail += 1;
            console.error(`[FAIL] ${categoryId} | ${q} | ${id} | ${up ? "正" : "逆"}`);
            for (const b of bad) console.error(`       · ${b}`);
          }
        }
      }
    }
  }
  const n = questions.length * 156 * 2;
  console.log(`[life-six-b] 完成 · ${categoryId} · ${n} 条 · 未通过 ${fail}`);
  return fail;
}

function main(): void {
  const only = parseOnlyArg();
  const cares = only
    ? CARES.filter((c) => c.categoryId === only || String(c.packIndex) === only)
    : CARES;
  if (only && cares.length === 0) {
    console.error(`[life-six-b] 未知 --only=${only}（用中文类名如 身体健康）`);
    process.exit(1);
  }
  let totalFail = 0;
  for (const cfg of cares) {
    totalFail += runCategory(cfg.packIndex, cfg.categoryId, cfg.questions, cfg.actionHint);
  }
  if (totalFail > 0) {
    console.error(`\n[life-six-b] 未通过：${totalFail} 处`);
    process.exit(1);
  }
  const total = cares.reduce((s, c) => s + c.questions.length * 156 * 2, 0);
  console.log(`[life-six-b] Rubric 全通过 · ${cares.length} 类 · 共 ${total} 条`);
}

main();
