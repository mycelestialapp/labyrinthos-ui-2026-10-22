/**
 * 连问问法骨架：每类 6 刀切口，对应已有题干（冻结核或 gap）。
 * 不穷举句子；用户追问只换问法，牌面钉住。
 */
import { CAREER_QUESTION_TEXTS } from "./tarot-master-question-content-career-texts-only";
import { CAREER_Q } from "./tarot-question-career-framework-zh";
import {
  Q_CHILD,
  Q_CHOICE,
  Q_HEALTH,
  Q_PET,
  Q_REL,
  Q_SPIRIT,
} from "./tarot-master-question-content-life-categories";
import { MONEY_QUESTION_TEXTS } from "./tarot-master-question-content-money-texts-only";
import { STUDY_Q } from "./tarot-question-study-framework-zh";
import { HEALTH_GAP_CANONICAL, PET_GAP_CANONICAL } from "./tarot-question-hidden-chain-zh";
import { TAROT_QUESTION_CATALOG_BY_ID } from "./tarot-question-catalog-19-zh";
import { normalizeQuestionTextZh } from "./question-text-normalize-zh";
import { tradToSimp } from "./zhTradToSimp";

function nnIntent(s: string): string {
  return normalizeQuestionTextZh(tradToSimp(s));
}

export const TAROT_INTENT_IDS = [
  "yesno",
  "where",
  "outcome",
  "timing",
  "action",
  "choice",
] as const;

export type TarotIntentId = (typeof TAROT_INTENT_IDS)[number];

export type TarotFollowupChip = {
  intent: TarotIntentId;
  /** 切口短句，给用户点 */
  label: string;
  /** 解读查找键：冻结核原文或 gap 题干 */
  canonical: string;
};

function chips(...rows: Array<[TarotIntentId, string, string]>): TarotFollowupChip[] {
  return rows.map(([intent, label, canonical]) => ({ intent, label, canonical }));
}

export const TAROT_FOLLOWUPS_BY_CATEGORY: Record<string, TarotFollowupChip[]> = {
  感情婚姻: chips(
    ["yesno", "对方还爱吗？", "他／她目前对我的真实感受／能量是什么？我该如何回应？"],
    ["where", "我们卡在哪？", "我们之间最大的阻碍是什么？"],
    ["outcome", "值得继续吗？", "这段感情值得继续吗？"],
    ["timing", "什么时候能见分晓？", "近期感情运势如何？"],
    ["action", "该不该分手？", "该不该分手？"],
    ["choice", "放手还是挽回？", "放手与挽回，分别意味着什么？我该如何选择？"],
  ),
  事业工作: chips(
    ["yesno", "还能不能待？", CAREER_QUESTION_TEXTS[1]!],
    ["where", "现在卡在哪？", CAREER_QUESTION_TEXTS[7]!],
    ["outcome", "这件事能成吗？", CAREER_QUESTION_TEXTS[6]!],
    ["timing", "什么时候能定？", CAREER_Q.signOffer],
    ["action", "该不该换行？", CAREER_QUESTION_TEXTS[0]!],
    ["choice", "走管理还是做深？", CAREER_QUESTION_TEXTS[2]!],
  ),
  财运投资: chips(
    ["yesno", "这个月过得去吗？", MONEY_QUESTION_TEXTS[0]!],
    ["where", "先救哪一头？", MONEY_QUESTION_TEXTS[1]!],
    ["outcome", "这笔还能回来吗？", MONEY_QUESTION_TEXTS[2]!],
    ["timing", "什么时候能缓过来？", MONEY_QUESTION_TEXTS[10]!],
    ["action", "现在割还是等？", MONEY_QUESTION_TEXTS[2]!],
    ["choice", "花还是留？", MONEY_QUESTION_TEXTS[18]!],
  ),
  学业考试: chips(
    ["yesno", "这门还能过吗？", STUDY_Q.final],
    ["where", "现在最该补哪块？", STUDY_Q.luckPatch],
    ["outcome", "这条路能成吗？", STUDY_Q.kaoyanWork],
    ["timing", "什么时候能松一口气？", STUDY_Q.luckWhen],
    ["action", "现在该补哪头？", STUDY_Q.luckPatch],
    ["choice", "考研还是工作？", STUDY_Q.kaoyanWork],
  ),
  身体健康: chips(
    ["yesno", "我是生病了吗？", HEALTH_GAP_CANONICAL[0]!],
    ["where", "哪个器官出问题？", HEALTH_GAP_CANONICAL[1]!],
    ["outcome", "能治好吗？", HEALTH_GAP_CANONICAL[2]!],
    ["timing", "哪天能好？", HEALTH_GAP_CANONICAL[3]!],
    ["action", "现在去不去医院？", Q_HEALTH[0]!],
    ["choice", "观察还是急诊？", Q_HEALTH[3]!],
  ),
  宠物: chips(
    ["yesno", "是生病了吗？", PET_GAP_CANONICAL[0]!],
    ["where", "哪里出问题？", PET_GAP_CANONICAL[2]!],
    ["outcome", "能治好吗？", PET_GAP_CANONICAL[3]!],
    ["timing", "哪天能好？", PET_GAP_CANONICAL[4]!],
    ["action", "现在送医院吗？", Q_PET[0]!],
    ["choice", "走丢了往哪找？", PET_GAP_CANONICAL[6]!],
  ),
  人际关系: chips(
    ["yesno", "还能处下去吗？", Q_REL[19]!],
    ["where", "关系卡在哪？", Q_REL[0]!],
    ["outcome", "能和解吗？", Q_REL[19]!],
    ["timing", "什么时候适合开口？", Q_REL[19]!],
    ["action", "该不该先道歉？", Q_REL[19]!],
    ["choice", "断还是留？", Q_REL[8]!],
  ),
  生育子女: chips(
    ["yesno", "能怀上吗？", Q_CHILD[0]!],
    ["where", "问题出在哪？", Q_CHILD[0]!],
    ["outcome", "这件事能成吗？", Q_CHILD[17]!],
    ["timing", "还要等多久？", Q_CHILD[0]!],
    ["action", "现在该查哪项？", Q_CHILD[2]!],
    ["choice", "二胎要不要？", Q_CHILD[10]!],
  ),
  选择决策: chips(
    ["yesno", "现在必须定吗？", Q_CHOICE[0]!],
    ["where", "真正卡住的是哪头？", Q_CHOICE[0]!],
    ["outcome", "选完会怎样？", Q_CHOICE[0]!],
    ["timing", "再等会不会错过？", Q_CHOICE[4]!],
    ["action", "今晚先做哪步？", Q_CHOICE[0]!],
    ["choice", "选哪边？", Q_CHOICE[0]!],
  ),
  灵性成长: chips(
    ["yesno", "我是卡住了吗？", Q_SPIRIT[0]!],
    ["where", "卡在哪？", Q_SPIRIT[0]!],
    ["outcome", "还能开心起来吗？", Q_SPIRIT[12]!],
    ["timing", "这口气什么时候能顺？", Q_SPIRIT[0]!],
    ["action", "今天最该动哪一步？", Q_SPIRIT[6]!],
    ["choice", "留下还是走？", Q_SPIRIT[9]!],
  ),
  出行迁居: chips(
    ["yesno", "这趟顺利吗？", "这次出行顺利吗？"],
    ["where", "风险在哪一段？", "旅途最可能在哪一段出状况？"],
    ["outcome", "签证／出差能成吗？", "签证能办下来吗？"],
    ["timing", "哪天走／搬更稳？", "哪天搬家比较好？"],
    ["action", "出门要注意什么？", "这趟出门要注意什么？"],
    ["choice", "该不该搬家？", "该不该搬家？"],
  ),
  官司法律: chips(
    ["yesno", "打得赢吗？", "官司能赢吗？"],
    ["where", "证据够吗？", "证据够吗？"],
    ["outcome", "判决会对我有利吗？", "判决会对我有利吗？"],
    ["timing", "要打多久？", "官司要打多久？"],
    ["action", "该不该告？", "该不该告对方？"],
    ["choice", "和解还是打到底？", "和解好还是打到底？"],
  ),
  失物寻找: chips(
    ["yesno", "还能找回吗？", "丢的东西能找回吗？"],
    ["where", "往哪找？", "该往哪个方向找？"],
    ["outcome", "还在家里吗？", "东西还在家里吗？"],
    ["timing", "什么时候能找到？", "什么时候能找到？"],
    ["action", "先开定位吗？", "定位还亮着，现在追不追得上？"],
    ["choice", "丢了还是被偷？", "被偷还是自己弄丢？"],
  ),
  占梦境: chips(
    ["yesno", "这个梦吉不吉？", "梦是吉是凶？"],
    ["where", "梦在说哪件事？", "这个梦要我注意生活里哪件事？"],
    ["outcome", "是预兆还是压力？", "这个梦代表什么意思？"],
    ["timing", "白天先处理哪头？", "这个梦要我注意生活里哪件事？"],
    ["action", "要不要当真？", "梦是吉是凶？"],
    ["choice", "反复同一梦怎么办？", "反复做同一个梦代表什么？"],
  ),
  占风水: chips(
    ["yesno", "这屋住着顺吗？", "这个房子适不适合我们住？"],
    ["where", "问题出在哪一处？", "家里风水要注意什么？"],
    ["outcome", "动了会不会更顺？", "今年家里要不要动格局？"],
    ["timing", "现在改还是等？", "今年家里要不要动格局？"],
    ["action", "先动哪一件？", "家里风水要注意什么？"],
    ["choice", "搬家日子怎么选？", "搬家要选哪天？"],
  ),
  代人问卜: chips(
    ["yesno", "他的病能好吗？", "他的病能好吗？"],
    ["where", "他现在卡在哪？", "代问：他现在最该处理哪件事？"],
    ["outcome", "这件事会过吗？", "替家人问：最近这件事会不会过？"],
    ["timing", "他什么时候能好？", "他什么时候能好？"],
    ["action", "最该先问哪头？", "代问：他现在最该处理哪件事？"],
    ["choice", "他还会回来吗？", "他会回来吗？"],
  ),
  其他: chips(
    ["yesno", "这件事会顺利吗？", "这件事会顺利吗？"],
    ["where", "卡住的关键是什么？", "这件事卡住的关键是什么？"],
    ["outcome", "结果会如何？", "这件事的结果会如何？"],
    ["timing", "会拖多久？", "这件事会拖多久？"],
    ["action", "现在最该做哪件？", "我现在最该动手做哪一件？"],
    ["choice", "该不该再等？", "该不该再等一等？"],
  ),
  心理疏导: chips(
    ["yesno", "这是过载了吗？", "如何区分可应对的压力和需要求助的过载？"],
    ["where", "焦虑在喊哪一块？", "我反复出现的焦虑，其实在为哪一部分的自己发声？"],
    ["outcome", "咨询对我有用吗？", "专业心理咨询对我是否有帮助？我是否愿意尝试？"],
    ["timing", "疗愈走到哪一站？", "如果疗愈是一个旅程，我现在走到了哪一站？"],
    ["action", "今晚能做的最小一步？", "我是否有减压的「紧急工具箱」？"],
    ["choice", "设界限还是求支持？", "我现在最需要学会的，是设立界限，还是允许自己被支持？"],
  ),
  人生建议: chips(
    ["yesno", "我走在想要的路上吗？", "我是否在活出自己想要的版本，还是活成了别人期待的样子？"],
    ["where", "当前主旋律是什么？", "我人生当前阶段的主旋律是什么？"],
    ["outcome", "这条路通往哪？", "人生的这个十字路口，有哪些路是通往安全的，哪些是通往真实的？"],
    ["timing", "准备好下一阶段了吗？", "我如何知道自己已经准备好进入下一个人生阶段？"],
    ["action", "现在最该放下什么？", "当下我最该放下的是什么？"],
    ["choice", "安全还是真实？", "人生的这个十字路口，有哪些路是通往安全的，哪些是通往真实的？"],
  ),
};

const INTENT_HINTS: Record<TarotIntentId, string[]> = {
  yesno: ["是不是", "能不能", "会不会", "有没有", "还爱", "打得赢", "生病", "顺利", "过得去", "找得回", "能好", "能赢"],
  where: ["哪里", "哪个", "卡在", "器官", "部位", "证据", "方向", "往哪", "出问题", "关键"],
  outcome: ["能治好", "结果", "会如何", "有利", "找回来", "成吗", "过得去", "值得继续"],
  timing: ["哪天", "多久", "什么时候", "何时", "要打多久", "还要等", "时机"],
  action: ["该不该", "怎么办", "送医院", "报警", "注意什么", "先做", "开口"],
  choice: ["还是", "还是打", "和解", "放手", "挽回", "选哪", "观察还是", "考研还是"],
};

export function classifyTarotIntentZh(raw: string): TarotIntentId | null {
  const a = nnIntent(raw);
  if (!a) return null;
  let best: TarotIntentId | null = null;
  let bestScore = 0;
  for (const intent of TAROT_INTENT_IDS) {
    let s = 0;
    for (const h of INTENT_HINTS[intent]) {
      const kn = nnIntent(h);
      if (kn.length >= 2 && a.includes(kn)) s += kn.length;
    }
    if (s > bestScore) {
      bestScore = s;
      best = intent;
    }
  }
  return bestScore >= 2 ? best : null;
}

export function followupChipForIntent(categoryId: string, intent: TarotIntentId): TarotFollowupChip | null {
  return TAROT_FOLLOWUPS_BY_CATEGORY[categoryId]?.find((c) => c.intent === intent) ?? null;
}

export function getTarotFollowups(categoryId: string): TarotFollowupChip[] {
  return TAROT_FOLLOWUPS_BY_CATEGORY[categoryId] ?? [];
}

/** 跟当前题同一小类的其他预设；没有姐妹题才退回大类切口 */
export function getTarotFollowupsForQuestion(categoryId: string, question: string): TarotFollowupChip[] {
  const fallback = getTarotFollowups(categoryId);
  const cat = TAROT_QUESTION_CATALOG_BY_ID[categoryId];
  if (!cat) return fallback;
  const qn = nnIntent(question);
  if (!qn) return fallback;
  const mapped = cat.aliasToCanonical[qn] ?? "";
  const mappedN = mapped ? nnIntent(mapped) : "";
  const group = cat.groups.find((g) => {
    if (g.surface.some((s) => {
      const sn = nnIntent(s);
      return sn === qn || (mappedN && sn === mappedN);
    })) return true;
    if (g.hidden.some((h) => nnIntent(h) === qn)) return true;
    return false;
  });
  const others = (group?.surface ?? []).filter((s) => {
    const sn = nnIntent(s);
    return Boolean(sn && sn !== qn && sn !== mappedN);
  });
  if (!others.length) return [];
  return others.slice(0, 6).map((s, i) => ({
    intent: TAROT_INTENT_IDS[i % TAROT_INTENT_IDS.length]!,
    label: s,
    canonical: s,
  }));
}
