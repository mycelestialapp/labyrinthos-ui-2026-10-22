/**
 * 统一深度解读：与站内演算同源，先交代「这一屏在算什么」，再叠主路径手册、日柱手册、个人年与姓名三数。
 * 供寰宇之门首段（高光 + 手册）、导出 Markdown 等复用；个人星图判读区用 `numerologyChartFieldRowsZh` / `numerologyChartTotalSummaryBodyZh`（见 `numerology-chart-field-blurbs-zh.ts`）。`numerologyChartSynopsisZh` 仍保留作纯文速览备用。
 */

import type { LifePathBreakdown } from "@/lib/numerology-pythagorean";
import { numerologyNameHasLatinLetters } from "@/lib/numerology-pythagorean";
import type { LifePathLayerCopy } from "@/lib/numerology-life-path-copy-zh";
import { birthdayNumberLayerCopyZh } from "@/lib/numerology-numeral-master-zh";

export type NumerologyUnifiedDeepReadingInput = {
  lifePath: number;
  y: number;
  m: number;
  d: number;
  calendarYear: number;
  birthdayNum: number;
  personalYearNum: number;
  nameLatin: string;
  expression: number | null;
  soulUrge: number | null;
  personality: number | null;
  breakdown: LifePathBreakdown;
  layers: LifePathLayerCopy;
};

/** 主路径副题（一行，与手册气质对齐） */
const LIFE_PATH_TAGLINE_ZH: Record<number, string> = {
  1: "副题：先立局、再收刀的开路者",
  2: "副题：结盟为先、界线待补的调和者",
  3: "副题：火在喉舌与指节的表达者",
  4: "副题：规矩里讨安稳、肩上过重的承重者",
  5: "副题：变里找活路、难得深耕的探路者",
  6: "副题：照护为先、边界易层的守护者",
  7: "副题：真理的静默炼金师",
  8: "副题：成败一数、得失见骨的掌权者",
  9: "副题：大愿在前、慈悲易拖的收束者",
  11: "副题：直觉如刀、落地要证的信道者",
  22: "副题：蓝图很大、耐心要账的建筑者",
  33: "副题：以柔掌权、易耗心火的治愈者",
};

function lifePathTaglineZh(lp: number): string {
  return LIFE_PATH_TAGLINE_ZH[lp] ?? `副题：主路径 ${lp}`;
}

/** 高光层引号内短句（去掉「副题：」前缀） */
function lifePathTaglineShortZh(lp: number): string {
  return lifePathTaglineZh(lp).replace(/^副题：/, "");
}

/** 主盘高光下第二行金句（修辞层，不作才级判决） */
const LIFE_PATH_HIGHLIGHT_HOOK_ZH: Record<number, string> = {
  1: "先立局，再收刀；对外一局，对内一刀。",
  2: "结盟在先，界线在后；两说并行时先对齐事实。",
  3: "火在喉舌与指节：先说出来，再收束成作品。",
  4: "规矩里讨安稳：少扩张，多清单与收口。",
  5: "变里找活路：小步试探，忌全盘推翻。",
  6: "照护易外溢：先写清界线，再付出。",
  7: "在虚妄中剥离，于寂静处提炼。",
  8: "成败一数：把能量投向可交付与能见度。",
  9: "大愿在前：该收的尾收掉，该放的放手。",
  11: "直觉如刀：先落地一条证据链，再谈信。",
  22: "蓝图很大：拆里程碑，忌一口吞。",
  33: "以柔掌权：先稳住自己，再示范他人。",
};

function lifePathHighlightHookZh(lp: number): string {
  return LIFE_PATH_HIGHLIGHT_HOOK_ZH[lp] ?? `主路径 ${lp}：把习惯当功课，一步一步来就好。`;
}

/** 个人年一句母题（高光层；细则仍以镜鉴与 KPI 为准） */
const PERSONAL_YEAR_HIGHLIGHT_TAG_ZH: Record<number, string> = {
  1: "今年适合：定方向、开第一枪——先把一件事说清楚再扩散。",
  2: "今年适合：跟人把规矩聊明白，别光靠默契。",
  3: "今年适合：让人看见你的成果，少空谈、多一样拿得出手的东西。",
  4: "今年适合：收拾摊子、补基础，少开新坑。",
  5: "今年适合：小步试错，大事先设止损再动。",
  6: "今年适合：照顾人与责任，但先写清你能扛到哪里。",
  7: "今年适合：静下来核对事实，少被情绪和群聊带着跑。",
  8: "今年适合：谈钱、谈责任、谈结果，该落字就落字。",
  9: "今年适合：收尾、告别、清空，再开新局。",
  11: "今年适合：灵感多，先写成一条能验证的假设再行动。",
  22: "今年适合：大事拆小步，每周只啃得动一块就算赢。",
  33: "今年适合：帮人前先把自己睡饱、节律稳住。",
};

export function personalYearHighlightTagZh(py: number): string {
  return (
    PERSONAL_YEAR_HIGHLIGHT_TAG_ZH[py] ??
    `个人年 ${py}：今年外圈怎么走，可看镜鉴「展开」和上面五个数里的个人年；和主路径叠着读，别单拎一句定人。`
  );
}

function formatDateZh(y: number, m: number, d: number): string {
  return `${y}年${m}月${d}日`;
}

function nameThreeBodyZh(latin: string, ex: number | null, su: number | null, pe: number | null): string {
  const t = latin.trim();
  if (!t) {
    return "姓名还没填拉丁全拼时：表现数、灵魂数、人格数不会出现；看上排五个数字或导出说明。";
  }
  if (!numerologyNameHasLatinLetters(t)) {
    return "框里有字但没有英文字母 A–Z 时，系统不算姓名三数（中文名不算）。请改成拼音或英文名再试。";
  }
  const lines: string[] = [];
  if (ex != null) lines.push(`表现数 ${ex}：别人眼里你先像谁、先亮哪一面。`);
  if (su != null) {
    lines.push(`灵魂数 ${su}：你心里最想守住的那口气（只来自姓名里的元音 a e i o u）。`);
  } else {
    lines.push(
      "灵魂数：当前拼写里没有元音字母 a、e、i、o、u，系统不生成灵魂数（界面常为「—」），不是坏了。全辅音名常见如此。",
    );
  }
  if (pe != null) lines.push(`人格数 ${pe}：第一次见面时，你先给人的冷或热（只来自姓名里的辅音）。`);
  if (pe == null && (ex != null || su != null)) {
    lines.push("人格数（看辅音字母）：当前拼写里没有可算的辅音，所以人格数常常是「—」，不是坏了。");
  }
  if (lines.length === 0) {
    lines.push("从当前拼写里没算出三数，请确认是否只打了符号或中文。");
  }
  return lines.join("\n");
}

/** 首屏姓名框旁、与之门首段手册同源：三数白话一句 + 缺数说明 */
export function numerologyNameThreeSummaryZh(
  latin: string,
  ex: number | null,
  su: number | null,
  pe: number | null,
): string {
  return nameThreeBodyZh(latin, ex, su, pe);
}

export function stackReadOneLineZh(i: NumerologyUnifiedDeepReadingInput): string {
  const bits = [`主路径 ${i.lifePath}`, `生日数 ${i.birthdayNum}`, `个人年 ${i.personalYearNum}`];
  const nameBits: string[] = [];
  if (i.expression != null) nameBits.push(`表现 ${i.expression}`);
  if (i.soulUrge != null) nameBits.push(`灵魂 ${i.soulUrge}`);
  if (i.personality != null) nameBits.push(`人格 ${i.personality}`);
  const namePart =
    nameBits.length > 0 ? `；姓名三数：${nameBits.join("、")}` : "；姓名三数未齐（拉丁未填或无可算字母）";
  return `${bits.join("、")}${namePart}。几条线分开看，怎么念以本页为准；别揉成一句定人。`;
}

/** 个人星图 · 主路径格：副题短句 + 金句（好扫，不撕手册长段） */
export function numerologyLifePathChartBlurbZh(lp: number): string {
  return `「${lifePathTaglineShortZh(lp)}」${lifePathHighlightHookZh(lp)}`;
}

/** 个人星图 · 个人年格：公历年 + 个人年数 + 母题（去掉「今年」与外层年份打架） */
export function numerologyPersonalYearChartCardZh(calendarYear: number, py: number): string {
  const tag = personalYearHighlightTagZh(py);
  const body = tag.startsWith("今年适合：") ? tag.slice("今年适合：".length) : tag;
  return `公历 ${calendarYear} 年，个人年落在 ${py}：${body}`;
}

/** 个人星图 · 表现数格（与首屏「姓名·拉丁」同源一句） */
export function numerologyExpressionChartCardZh(latin: string, ex: number | null): string {
  const t = latin.trim();
  if (ex != null) return `表现数 ${ex}：别人眼里你先像谁、先亮哪一面。`;
  if (!t) return "拉丁姓名还没填，这一格不会出现表现数。";
  if (!numerologyNameHasLatinLetters(t)) return "要有英文字母 A–Z 才算姓名数；纯中文名这里会空着。";
  return "按当前拼写还数不出表现数，可看看是不是只有符号或空格。";
}

/** 个人星图 · 灵魂数格（与首屏「姓名·拉丁」同源一句） */
export function numerologySoulUrgeChartCardZh(latin: string, su: number | null): string {
  const t = latin.trim();
  if (su != null) return `灵魂数 ${su}：你心里最想守住的那口气（只看姓名里的元音 a、e、i、o、u）。`;
  if (!t) return "拉丁姓名还没填，灵魂数不会出现。";
  if (!numerologyNameHasLatinLetters(t)) return "要有英文字母才算姓名数；纯中文名这里会空着。";
  return "拼写里没有元音 a、e、i、o、u，就没有灵魂数；全辅音名字很常见。";
}

/** 个人星图 · 人格数格（与首屏「姓名·拉丁」同源一句） */
export function numerologyPersonalityChartCardZh(
  latin: string,
  ex: number | null,
  su: number | null,
  pe: number | null,
): string {
  const t = latin.trim();
  if (pe != null) return `人格数 ${pe}：第一次见面时，别人会先感到你的冷或热（只看辅音）。`;
  if (!t) return "拉丁姓名还没填，人格数不会出现。";
  if (!numerologyNameHasLatinLetters(t)) return "要有英文字母才算姓名数；纯中文名这里会空着。";
  if (pe == null && (ex != null || su != null)) return "拼写里没有可算的辅音，人格数常为「—」；这一格空着是正常结果。";
  return "从当前拼写还数不出人格数，可看看是不是只有元音或符号。";
}

/** 与第二段备忘表一致的演算交代句 */
function breakdownExplainZh(b: LifePathBreakdown, lp: number): string {
  return `算法很笨，只是帮你对得上眼：先把月、日、年各自收成一位（这里是 ${b.monthReduced}、${b.dayReduced}、${b.yearReduced}），再加成 ${b.combinedRaw}，最后收到主路径 ${lp}。和中间曼陀罗上的数应能对上。`;
}

function energyAnatomyOpenZh(i: NumerologyUnifiedDeepReadingInput): string {
  const b = i.breakdown;
  const lp = i.lifePath;
  const bd = i.birthdayNum;
  const cy = i.calendarYear;
  const yr = b.yearReduced;
  const mr = b.monthReduced;
  const dr = b.dayReduced;
  const comb = b.combinedRaw;
  const head = `主路径 ${lp}（月${mr}+日${dr}+年${yr}=${comb}→${lp}）`;
  if (lp === 7) {
    return `${head}\n\n换成人话：主路径 7 像「想清楚了再动」的人；${i.m} 月 ${i.d} 日生，生日数 ${bd}，又带点「要站得住、要有自己的说法」。两种气质叠在同一个人身上很正常，不是矛盾，是不同层面的自己。出生年收成 ${yr} 是底子，${cy} 是「今年怎么走」，分开看更清楚。`;
  }
  return `${head}\n\n换成人话：主路径 ${lp} 像命里的主音色；生日数 ${bd} 是「生日那天」带来的小习惯；出生年收成 ${yr}，和今年 ${cy} 不是一回事——今年看个人年，别和出生年混着念。几条线各管一段，别硬揉成一句判词。`;
}

const ENERGY_ANATOMY_CLOSE_ZH =
  "你可能擅长：想问题细、能钻深（不是说你就一定当专家，只是容易往深处走）。\n别人容易误会你：表面话少，心里其实很有主见；不是来凑热闹的，是想把事问明白。";

function highlightFootnoteZh(i: NumerologyUnifiedDeepReadingInput): string {
  const cy = i.calendarYear;
  return `有句底线先说在前：这些数帮你把节奏摸清楚、做取舍，不替医生、律师、理财顾问开口。\n主路径是月、日、年分开再并回去；个人年按公历 ${cy} 年算；姓名三数只看拉丁 A–Z 拼出来的名字。\n生日或拼写一动，数就会变；以这一页算出来的为准。`;
}

function deepInsightBrainHeartZh(i: NumerologyUnifiedDeepReadingInput): string {
  const lp = i.lifePath;
  const bd = i.birthdayNum;
  const tension =
    lp === 7
      ? `容易别扭的地方：一边想「证据够了再动」，一边又想「我要站得住、要有自己的说法」（生日数 ${bd}）。老把经历收成脾气，多半是话没说清、界线没写清。`
      : `容易别扭的地方：主路径 ${lp} 是一套习惯，生日数 ${bd} 又是一套「生日那天」带来的口气，两套叠在一起，别人容易读错你。别把自己简单说成「孤僻」或「难搞」，多半是表达方式没对齐。`;
  return `容易卡在这里：\n\n${tension}\n\n小建议：先抓住一件小事的事实（时间、对象、结果），再谈感觉；别让自己在脑子里反刍到动不了。`;
}

function highlightTimingZh(i: NumerologyUnifiedDeepReadingInput): string {
  const cy = i.calendarYear;
  const py = i.personalYearNum;
  return `今年（${cy}）外圈是个人年 ${py}\n\n${personalYearHighlightTagZh(py)}\n\n这周就能做的一件小事：给自己约 15 分钟，把要说的事写成三行（给谁、要什么、什么时候要回话）。想写长文可以，先看下面镜鉴里的「展开」。\n说话不用变热络，把专业话翻成别人听得懂的一句就行。`;
}

/**
 * 寰宇之门首段顶部「高光层」：短句、海报感；术语与站内 KPI / 镜鉴一致，不与「灵魂数（姓名）」混用。
 */
export function numerologyGateHighlightZh(i: NumerologyUnifiedDeepReadingInput): string {
  const date = formatDateZh(i.y, i.m, i.d);
  const lp = i.lifePath;
  const short = lifePathTaglineShortZh(lp);
  const hook = lifePathHighlightHookZh(lp);
  return [
    `先听一句主线`,
    ``,
    `${date}生人，主路径数是 ${lp}。`,
    `「${short}」`,
    hook,
    ``,
    `这几条数不是给你贴标签，是几条同时还在生效的线：`,
    ``,
    energyAnatomyOpenZh(i),
    ``,
    ENERGY_ANATOMY_CLOSE_ZH,
    ``,
    deepInsightBrainHeartZh(i),
    ``,
    highlightTimingZh(i),
    ``,
    highlightFootnoteZh(i),
  ].join("\n\n");
}

/**
 * 统一深度解读「手册正文」：紧接高光层之后；边界已并入高光脚注，此处不再重复边界套话。
 */
export function numerologyUnifiedHandbookBodyZh(i: NumerologyUnifiedDeepReadingInput): string {
  const bdLayer = birthdayNumberLayerCopyZh(i.birthdayNum);
  const pyIntro = `${i.calendarYear} 这一年外圈落在个人年 ${i.personalYearNum}；和上排「个人年」一格、镜鉴里「展开」说的是同一件事。当它像天气，不当判决书。`;

  const nameBlock = nameThreeBodyZh(i.nameLatin, i.expression, i.soulUrge, i.personality);

  return [
    breakdownExplainZh(i.breakdown, i.lifePath),
    ``,
    nameBlock,
    ``,
    i.layers.snapshot,
    ``,
    `${i.m} 月 ${i.d} 日 → 生日数 ${i.birthdayNum}。`,
    ``,
    bdLayer.snapshot,
    ``,
    pyIntro,
    ``,
    stackReadOneLineZh(i),
  ].join("\n\n");
}

/**
 * 个人星图「星图速览」：与之门同源，只放一眼对齐 + 叠读一句 + 个人年母题；完整高光、手册、镜鉴与推演只在「寰宇之门」读数分层里顺读一遍。
 */
export function numerologyChartSynopsisZh(i: NumerologyUnifiedDeepReadingInput): string {
  const lp = i.lifePath;
  const short = lifePathTaglineShortZh(lp);
  const hook = lifePathHighlightHookZh(lp);
  const cy = i.calendarYear;
  const py = i.personalYearNum;
  return [
    `星图速览`,
    ``,
    `这一屏负责六格数字与曼陀罗总览；和「寰宇之门」是同一套数、同一本手册真源。不把首段高光加长文再整篇贴在这里，免得两页各读一遍像两篇稿。`,
    ``,
    `主路径 ${lp}：「${short}」`,
    hook,
    ``,
    `${cy} 年个人年 ${py}：${personalYearHighlightTagZh(py)}`,
    ``,
    `数字怎么叠`,
    stackReadOneLineZh(i),
    ``,
    `去哪读全本`,
    `回「寰宇之门」首页向下滑，打开「读数分层」：那里有高光加长手册、慢慢拆开、对数小表、镜鉴与 KPI。需要正文带走仍可用导出 Markdown。`,
  ].join("\n\n");
}

/**
 * 统一深度解读全文：高光层 + 手册正文（导出 Markdown 等与 UI 同源）。
 */
export function numerologyUnifiedDeepReadingZh(i: NumerologyUnifiedDeepReadingInput): string {
  return [numerologyGateHighlightZh(i), numerologyUnifiedHandbookBodyZh(i)].join("\n\n");
}

/**
 * 「慢慢拆开」推演段与导出 Markdown 共用：与首段高光脚注同一口径，避免各层各说各话。
 */
export function numerologyReadingVoiceLogicPreambleZh(): string {
  return [
    `下面几段是慢慢拆开念，不是让你背条款。`,
    ``,
    `主路径是出生月、日、年收成的那条主线；生日数只看「生日那一天」的习惯口气；个人年只看眼下这个公历年的外圈；姓名三数只看拉丁拼写里的字母，和中文名怎么写无关。`,
    ``,
    `几条线分开听，别收成一句「你就是怎样的人」。生日或拼写一动，数就会变；以这一页为准。`,
  ].join("\n\n");
}

/** 全站命数读数收束句（页脚、导出尾行等） */
export function numerologyReadingVoiceClosingLineZh(): string {
  return `这些数帮你做取舍，不当判决书用；看病、签约、理财仍要找专业人士。怎么折、怎么念，以这一页为准。`;
}
