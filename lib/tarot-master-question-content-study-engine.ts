/**
 * 学业考试 20 问 × 78 牌 × 正逆 → 五段式 **仅作冻结输入（草稿源）**
 *
 * 【正式真源】`tarot-master-question-content-study-registers.generated.ts`（由 `npm run tarot:study:freeze` 生成）。
 * 【定位】**五段全量**：牌说话＝`【题脉·牌语】`短签＋题桥（`STUDY_MAJOR_BRIDGE` / 小牌 rank 桥）＋牌魂＋收束句；心理/灵性/行动/收束＝3120×4 条与 freeze 索引对齐（`emit-study-rest-layers.mjs` 可重生成）。
 * 【禁止】线上 `study.ts` 不得再直接 `import` 本文件做运行时拼装入库（已改为只加载 frozen registers）。
 * 【风格】忌机核/运维隐喻；备考身体感与日程；心理/灵性/行动/收束与 `emit-study-rest-layers.mjs` 题脉标签一致（读本/落实/今日一格/总断等）。
 */
import type { MasterQuestionCardContent } from './tarot-master-question-types-shared';
import {
  STUDY_MAJOR_SOUL,
  STUDY_MINOR_SOUL_BY_NUM,
  type StudyMinorSuitKey,
} from './tarot-study-master-card-soul-zh';
import { STUDY_MAJOR_BRIDGE } from './tarot-study-master-bridges-major-zh';
import { STUDY_MINOR_RANK_BRIDGE } from './tarot-study-master-bridges-minor-zh';
import { TAROT_MINOR_PRE_LINES_MASTER } from './tarot-minor-pre-lines-master-zh';
import {
  studyRestLayerIndex,
  STUDY_REST_ACTION,
  STUDY_REST_PSYCH,
  STUDY_REST_SPIRIT,
  STUDY_REST_SUM,
} from './tarot-study-rest-layers.generated';
import { STUDY_QUESTION_BAND_ZH } from './tarot-study-question-band-zh';

export { STUDY_QUESTION_BAND_ZH };

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
] as const;

const suitZh: Record<string, string> = {
  wands: '权杖',
  cups: '圣杯',
  swords: '宝剑',
  pentacles: '星币',
};

const rankName = (n: number): string =>
  n === 1
    ? '王牌'
    : n <= 10
      ? ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][n]!
      : n === 11
        ? '侍从'
        : n === 12
          ? '骑士'
          : n === 13
            ? '王后'
            : n === 14
              ? '国王'
              : String(n);

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[((seed % arr.length) + arr.length) % arr.length]!;
}

function seedFrom(cardId: string, upright: boolean, qi: number): number {
  let h = qi * 1009;
  for (let i = 0; i < cardId.length; i++) h = (h * 31 + cardId.charCodeAt(i)) | 0;
  return h + (upright ? 17 : 0);
}

function studyQuestionBand(qi: number): string {
  return STUDY_QUESTION_BAND_ZH[qi] ?? '学业';
}

/** 20 题各一句收束，与 `STUDY_QUESTION_TEXTS` 下标对齐（qi=0…19）。 */
const STUDY_QUESTION_CLOSE_BEAT: readonly string[] = [
  '牌说：喘气的第一口，往往来自先把占分最大的洞补上——不是来自熬得更「好看」。',
  '牌说：课表会松会紧，你真正要决定的是——还追不追热爱，以及追的时候带不带成本账。',
  '牌说：第二次选择若仍只靠面子，你还会再痛一次；靠计划，才可能靠得住。',
  '牌说：语言可以练成路径，别只用自尊硬扛；也更别把「没过」写成「我不配」。',
  '牌说：追问导师不是为了赢邮件，是为了让拖延停下来；礼貌比泄愤重要。',
  '牌说：副业实习可以低调，但不能踩校规；先看清合同与学分，再谈赚多赚少。',
  '牌说：撕破脸要有谱、有睡眠红线、有话术；一口气若没有出口，会变成成绩与关系双输。',
  '牌说：追成绩先追书面规则与流程，再追人情；口头再热，也要落进可核对里。',
  '牌说：大决定出去之前，先问睡眠与缓冲周数；面子填不饱下一场考试。',
  '牌说：跟中介前先写退款条件与止损；话术越甜，越要听合同。',
  '牌说：换路先看政策与截止日，再看鸡汤；路径买的是可执行，不是安慰剂。',
  '牌说：争可以，别争成你不认识的人；规则与证据比狠话可靠。',
  '牌说：两万可能是学费也可能是教训，谈判与留痕比自责有用。',
  '牌说：本科只是前缀，作品与提问质量才是后话。',
  '牌说：填错一页不等于你整个人填错；先问官方，再谈情绪。',
  '牌说：寒暑假要排程，别只被声音推着走；主线只能一两个。',
  '牌说：考公是路不是牢，扛住期待也要为自己谈判时间。',
  '牌说：公平要争，但不要争到心烂；分工与署名先留痕。',
  '牌说：证与延期都能走规则，先问清再崩溃。',
  '牌说：自证不靠口号，靠日历上的勾；缓冲要有截止，才算诚实。',
];

function studyCloseBeat(qi: number): string {
  return STUDY_QUESTION_CLOSE_BEAT[qi] ?? STUDY_QUESTION_CLOSE_BEAT[0]!;
}

function majorCardSpeaking(qi: number, i: number, up: boolean, qFull: string): string {
  const band = studyQuestionBand(qi);
  const n = majors[i]!;
  const u = up ? '正位' : '逆位';
  const label = `${n}${u}`;
  const bridge = STUDY_MAJOR_BRIDGE[qi]?.[i] ?? `这题要紧处在下一步是否落地；${label}在此提醒你别用情绪偷换动作。`;
  const soul = STUDY_MAJOR_SOUL[i]?.[up ? 0 : 1] ?? '把怕写短，把动作写真。';
  const beat = studyCloseBeat(qi);
  return `【${band}·牌语】你抽到的是${label}。${bridge}——牌魂落在：${soul}\n\n你嘴里念着「${qFull}」——${beat}`;
}

function minorCardSpeakingStudy(
  qi: number,
  suit: string,
  num: number,
  up: boolean,
  qFull: string,
  cardId: string
): string {
  const sz = suitZh[suit] ?? suit;
  const rk = rankName(num);
  const u = up ? '正位' : '逆位';
  const label = `${sz}${rk}${u}`;
  const sv = seedFrom(cardId, up, qi);
  const sk: StudyMinorSuitKey =
    suit === 'wands' || suit === 'cups' || suit === 'swords' || suit === 'pentacles' ? suit : 'pentacles';
  const pre = pick(up ? TAROT_MINOR_PRE_LINES_MASTER[sk].up : TAROT_MINOR_PRE_LINES_MASTER[sk].dn, sv);
  const idx = num - 1;
  const soulRow = STUDY_MINOR_SOUL_BY_NUM[idx] ?? STUDY_MINOR_SOUL_BY_NUM[0]!;
  const soul = soulRow[sk][up ? 0 : 1];
  const pair = STUDY_MINOR_RANK_BRIDGE[qi]?.[idx] ?? [
    '这一步：先把下一步写清，再谈怕。',
    '这一步：别让情绪盖住可执行动作。',
  ];
  const bridge = up ? pair[0]! : pair[1]!;
  const beat = studyCloseBeat(qi);
  const band = studyQuestionBand(qi);
  return `【${band}·牌语】${pre}你抽到的是${label}。${bridge}——牌魂落在：${soul}\n\n你嘴里念着「${qFull}」——${beat}`;
}

function psychologyLayerFor(qi: number, cardId: string, upright: boolean): string {
  const idx = studyRestLayerIndex(qi, cardId, upright);
  return STUDY_REST_PSYCH[idx] ?? STUDY_REST_PSYCH[0]!;
}

function spiritLayerFor(qi: number, cardId: string, upright: boolean): string {
  const idx = studyRestLayerIndex(qi, cardId, upright);
  return STUDY_REST_SPIRIT[idx] ?? STUDY_REST_SPIRIT[0]!;
}

function actionLayerFor(qi: number, cardId: string, upright: boolean): string {
  const idx = studyRestLayerIndex(qi, cardId, upright);
  return STUDY_REST_ACTION[idx] ?? STUDY_REST_ACTION[0]!;
}

function masterSummaryFor(qi: number, cardId: string, upright: boolean): string {
  const idx = studyRestLayerIndex(qi, cardId, upright);
  return STUDY_REST_SUM[idx] ?? STUDY_REST_SUM[0]!;
}

/** 供 `npm run tarot:study:freeze` 调用；不在成品 bundle 中作为运行时入库路径。 */
export function buildStudyEngineMasterEntry(
  qi: number,
  cardId: string,
  upright: boolean,
  questionText: string
): MasterQuestionCardContent {
  const psych = psychologyLayerFor(qi, cardId, upright);
  const spirit = spiritLayerFor(qi, cardId, upright);
  const action = actionLayerFor(qi, cardId, upright);
  const sum = masterSummaryFor(qi, cardId, upright);

  if (cardId.startsWith('major_')) {
    const idx = Number(cardId.slice('major_'.length));
    const i = Number.isFinite(idx) ? idx : 0;
    const cardSpeaking = majorCardSpeaking(qi, i, upright, questionText);
    return { cardSpeaking, psychologyLayer: psych, spiritLayer: spirit, actionPath: action, masterSummary: sum };
  }

  const m = /^(\w+)_(\d+)$/.exec(cardId);
  if (m) {
    const suit = m[1]!;
    const num = Number(m[2]);
    const cardSpeaking = minorCardSpeakingStudy(qi, suit, num, upright, questionText, cardId);
    return { cardSpeaking, psychologyLayer: psych, spiritLayer: spirit, actionPath: action, masterSummary: sum };
  }

  const fallback =
    '此牌针对本题的五段式暂以通用学业向解读装配；请稍后重试或换牌。';
  return {
    cardSpeaking: fallback,
    psychologyLayer: fallback,
    spiritLayer: fallback,
    actionPath: fallback,
    masterSummary: fallback,
  };
}

