/**
 * 寰宇之门首屏与读数区 · 用户可见中文文案
 * 口吻与术语对齐 `numerology-unified-deep-reading-zh`（首段高光 + 脚注）：节律与接口、主路径 / 生日数 / 个人年 / 姓名三数分立。
 * 与 `numerology-life-path-copy-zh`、`numerology-numeral-master-zh` 分工：本文件管壳层、KPI、镜鉴包装、第二段备忘说明、带走几句等。
 */

import { numerologyCrossPairInstantPartsZh, numerologyCrossPairReadingZh } from "@/lib/numerology-cross-reading-zh";
import type { LifePathBreakdown } from "@/lib/numerology-pythagorean";
import { numerologyNameHasLatinLetters } from "@/lib/numerology-pythagorean";
import { numerologyReadingVoiceClosingLineZh } from "@/lib/numerology-unified-deep-reading-zh";

export const numerologyGateMirrorEyebrowZh = "镜鉴断语";

export type NumerologyMirrorLinesZh = {
  dingpan: string;
  zhankai: string;
  jiexian: string;
  xingfa: string;
  tail: string;
};

export type NumerologyGateInstantSnapshotPartsZh = {
  /** 主路径×个人年一句定性（与镜鉴扉页首句同源，不重复展开段） */
  lead: string;
  cluster: string;
};

export function numerologyGateInstantSnapshotPartsZh(
  lifePath: number,
  personalYear: number,
  themeKey: string,
): NumerologyGateInstantSnapshotPartsZh {
  const { lead } = numerologyCrossPairInstantPartsZh(lifePath, personalYear);
  return { lead, cluster: numerologyGateClusterReadBiasLineZh(themeKey) };
}

/** 与 `numerologyEnergyThemeForLifePath` 的 `key` 对齐：叠读时先看哪条张力线 */
export function numerologyGateClusterReadBiasLineZh(themeKey: string): string {
  switch (themeKey) {
    case "master":
      return "大师数盘面：节律拉高时，先减刺激与熬夜两日，再谈对外加码。";
    case "moon":
      return "月箔簇（1/8/9）：钱、结果、意义分三次谈清，勿混成一场会。";
    case "mist":
      return "雾绡簇（2/6）：先写「要与不要」各三条，再进协同。";
    case "cerulean":
      return "晴灰簇（3/5）：先锁每日产出时段，再开社交与曝光。";
    case "jade":
      return "青瓷簇（4/7）：先书面留痕再动结构；大改须写退出条件。";
    default:
      return numerologyGateClusterReadBiasLineZh("jade");
  }
}

export function numerologyGateMirrorBodyZh(lifePath: number, personalYear: number): string {
  const lines = numerologyGateMirrorLinesZh(lifePath, personalYear);
  return [lines.dingpan, lines.zhankai, lines.jiexian, lines.xingfa, lines.tail].join("\n\n");
}

export function numerologyGateMirrorLinesZh(lifePath: number, personalYear: number): NumerologyMirrorLinesZh {
  const pair = numerologyCrossPairReadingZh(lifePath, personalYear);
  return {
    dingpan: pair.thesis,
    zhankai: pair.unfold,
    jiexian: pair.taboo,
    xingfa: pair.advice,
    tail: "生日数看上面五个数最左边一格，和下面「生日数」那段分开读。姓名三格是「—」多半是没填英文名/拼音，填上再对。",
  };
}

/** 曼陀罗圆心上方小字 */
export const numerologyGateLifePathEyebrowZh = "生命路径";

export const numerologyGateNameLatinLabelZh = "姓名 · 拉丁全拼（可选）";

/** 有输入但洗不出拉丁字母时（如纯中文），在姓名框下提示 */
export function numerologyGateLatinNameFieldHintZh(nameLatin: string): string | null {
  if (nameLatin.trim().length === 0) return null;
  if (numerologyNameHasLatinLetters(nameLatin)) return null;
  return "框里已有字，但不包含 A–Z 拉丁字母（中文、数字、符号会被忽略），表现数、灵魂数、人格数仍是「—」。请改用拼音全拼无空格或英文名，例如 QIAN SAN 或 LI MING。";
}

export const numerologyGateKpiTitleZh = "关键读数";

export const numerologyGateKpiIntroZh =
  "生日数、个人年：跟公历生日走。表现数、灵魂数、人格数：只认英文名或拼音里的 A–Z，没填就空着。和下面第一段高光加长文说的是一套规则。";


/** KPI 顶栏：分块标题 + 正文，便于横排分栏铺满，避免一长段挤在左侧 */
export type NumerologyGateKpiHeaderZh = {
  orderLabel: string;
  orderBody: string;
  thesisLabel: string;
  thesisBody: string;
  nameLabel: string;
  nameBody: string;
};

export function numerologyGateKpiHeaderZh(
  lifePath: number,
  personalYear: number,
  birthdayNumber: number,
  calendarYear: number,
  nameThreeReady: boolean,
): NumerologyGateKpiHeaderZh {
  const pair = numerologyCrossPairReadingZh(lifePath, personalYear);
  return {
    orderLabel: "读数导读",
    orderBody: `从左到右五个格：生日数、今年个人年、表现数、灵魂数、人格数。中间圆盘是主路径 ${lifePath}，算法在下面那张备忘表里。生日数 ${birthdayNumber} 只看生日。个人年 ${personalYear} 是「生日 + 今年 ${calendarYear} 年」折出来的。姓名三格要有拉丁字母才算。建议读法：先看今年个人年叠主路径，再看生日数；姓名三格齐了，再对照「像谁 / 心里要什么 / 第一次见面什么感觉」。右边年度侧写和下面镜鉴四张卡，讲今年场面和忌讳。`,
    thesisLabel: "年度侧写（主路径×个人年）",
    thesisBody: pair.thesis,
    nameLabel: "姓名三数",
    nameBody: nameThreeReady
      ? "三个数都有了：看看「对外像谁」和「心里要什么」是不是差很远；差很远时，先把话说清楚再改行动。"
      : "还没出三个数：要么没填拉丁名，要么框里没有英文字母。改成拼音或英文名再试；还是「—」就看姓名框下面灰字提示。",
  };
}

/** 单段拼接版（导出 Markdown 等场景可复用） */
export function numerologyGateKpiIntroAfterBirthZh(
  lifePath: number,
  personalYear: number,
  nameThreeReady = false,
  birthdayNumber?: number,
  calendarYear?: number,
): string {
  const bd = typeof birthdayNumber === "number" ? birthdayNumber : 0;
  const cy = typeof calendarYear === "number" ? calendarYear : new Date().getFullYear();
  const h = numerologyGateKpiHeaderZh(lifePath, personalYear, bd, cy, nameThreeReady);
  return `${h.orderLabel}：${h.orderBody} ${h.thesisLabel}：${h.thesisBody} ${h.nameLabel}：${h.nameBody}`;
}

export const numerologyGateReadoutTitleZh = "读数分层";

export const numerologyGateReadoutStatusLeadZh = "这一屏陪你：";

export const numerologyGateReadoutStatusBodyZh =
  "把公历生日收成中间的主路径；上排五个格是生日数、今年个人年、姓名三数（有拉丁名才算）；下表把月、日、年怎么折写给你，用来对眼，不当场下判决书。怎么折、保不保留 11/22/33，都以这一页为准。";

/** 「个人星图」页：与之门「读数分层」同一术语下的本表说明；具体去哪块由星图页按钮/清单承接 */
export const numerologyGateChartReadoutStatusBodyZh =
  "与「寰宇之门」同一工作台：之门「读数分层」收成两大段（先听完 / 再落定），不再拆成四步。下面五格与六条摘句仍与之门同数；点链过去会滚到对应段。";

/** 与页脚 / 导出尾行同一收束句 */
export const numerologyGateDisclaimerZh = numerologyReadingVoiceClosingLineZh();

/** 导出 Markdown 等仍可用旧名；之门 UI 已合并为两段「读数分层」 */
export const numerologyGateLayerTitlesZh = {
  snapshot: "一层 · 先听一遍（高光 + 手册）",
  logic: "二层 · 慢慢拆开（推演）",
  raw: "三层 · 对一眼数（备忘表）",
  exec: "四层 · 带走几句（能做的事）",
} as const;

/** 之门「读数分层」两段式大标题（少步骤感） */
export const numerologyGateReadoutPhaseTitlesZh = {
  listen: "先听完这一段",
  settle: "再对一眼，带走一句",
} as const;

/** 「先听完这一段」内分三块：扫读锚点，减轻整墙正文像说明书 */
export const numerologyGateReadoutListenModuleTitlesZh = {
  mainline: "一眼主线",
  align: "本页数字与手册",
  unfold: "推演与叠读",
} as const;

export const numerologyGateRawTableZh = {
  monthReduced: "月柱化约",
  dayReduced: "日柱化约",
  yearReduced: "年柱化约",
  combined: "合并再化约",
  personalYear: (calendarYear: number) => `个人年（${calendarYear}）`,
} as const;

/** 备忘表数字下方极短脚注：与 `numerologyGateRawLayerHandbookZh` 同站位；表内只放提要，展开里仍是完整备忘。 */
export function numerologyGateRawTableRowFootnotesZh(input: {
  calendarYear: number;
  lifePath: number;
  personalYear: number;
  breakdown: LifePathBreakdown;
}): {
  monthReduced: string;
  dayReduced: string;
  yearReduced: string;
  combined: string;
  personalYear: string;
} {
  const cy = input.calendarYear;
  const lp = input.lifePath;
  const py = input.personalYear;
  const b = input.breakdown;
  return {
    monthReduced: `月份收成一位（${b.monthReduced}），再与日、年并入主路径。`,
    dayReduced: `日子收成一位（${b.dayReduced}）；「生日数」另格解读，勿与此格拧成一句。`,
    yearReduced: `出生年年份收成一位（${b.yearReduced}）；式内一步，勿与 ${cy} 个人年混读。`,
    combined: `三数相加得 ${b.combinedRaw}，再收成主路径 ${lp}；应与曼陀罗中心一致。`,
    personalYear: `生日月日与 ${cy} 年年份并算，得外圈 ${py}；先主路径，再叠今年这一圈。`,
  };
}

/** 第二段备忘表前一句：短，避免说明书腔；细拆收进下方「展开」 */
export const numerologyGateRawLayerIntroZh =
  "下面是本页算式结果，用来和曼陀罗、上排五格对一眼。要弄清每一行字义再点展开。";

/** 第二段：灰框长文折叠摘要（默认收起） */
export const numerologyGateReadoutSettleHandbookDetailsSummaryZh =
  "展开：表上每一行在说什么（和生日数、今年个人年别混）";

/** 备忘表层内读本：释各行在读法上之站位，并嵌入当页数字作互证；不作命断，以免与上层口述、推演叠床架屋。 */
export function numerologyGateRawLayerHandbookZh(input: {
  calendarYear: number;
  lifePath: number;
  personalYear: number;
  breakdown: LifePathBreakdown;
}): string {
  const cy = input.calendarYear;
  const lp = input.lifePath;
  const py = input.personalYear;
  const b = input.breakdown;
  return `你可以把它当备忘条：数字和中间圆盘、上排五个格对得上就行，人生结论不在这几行里写完。

月收成 ${b.monthReduced}
月份里的数字先收成一位（规则跟这一页算法走）。

日收成 ${b.dayReduced}
日子里的数字收成一位。和「生日数」有关，但格子不一样，别混成同一个词。

年出生成 ${b.yearReduced}
出生那一年的数字收成一位。这是「出生年」，不是「今年 ${cy}」。

月日年并回去 ${b.combinedRaw} → 主路径 ${lp}
三个月、日、年收成的那三个数加总，再收到主路径，应和曼陀罗中心一样。

今年（${cy}）外圈是个人年 ${py}
用「生日月日 + 今年年份」收成；先看中间主路径，再看今年这一圈。

看完若改生日或拉丁名，会重算；听人怎么长，以上面第一段长文为主，这张表用来对眼。`;
}

export function numerologyGateExecMemoBulletsZh(lifePath: number, personalYear: number): string[] {
  return [
    `主路径 ${lifePath}——本周只收三件事进日历：

先钉一桩：谁拍板、交付物长什么样、何时回条——写进日历。

对外场：口头对齐不算数；关键承诺落字或落页，缺一不配开第二波对外承诺。

收口处：范围外扩之前，先停三天做一次回条检视；回条不到就先收刃，不让加班替你签字。`,
    `个人年 ${personalYear}——今年外圈怎么落地：

先押一条硬结果出柜；其余想法进「七日冷藏」，到期再决定认不认。

对外场：冷藏仍烫手的不是诺，是债；债要落笔：谁付、何时止。

收口处：冲动想认新坑时，先写清「这条线谁长期付代价」；写不清就不认。`,
    `七日检视——给自己留一页真话：

结果、体能、情绪各写一句；不许互相替嘴。

三句若打架：下周先减载一条主线，再加码。

疲态当警报，不是战略；警报响了还硬顶，等于撕毁与自己的合同。`,
  ];
}

export type NumerologyGateMetricRowMeta = {
  label: string;
  sub: string;
  emptyHint: string | null;
};

export function numerologyGateMetricRowsMetaZh(calendarYear: number): NumerologyGateMetricRowMeta[] {
  return [
    { label: "生日数", sub: "日柱", emptyHint: null },
    { label: "个人年", sub: String(calendarYear), emptyHint: null },
    {
      label: "表现数",
      sub: "外显",
      emptyHint: "此项只从姓名拉丁字母换算，生辰填了也不会自动出现。请在首屏上方「姓名·拉丁全拼」输入后再看（例：LI MING）。",
    },
    {
      label: "灵魂数",
      sub: "内驱",
      emptyHint: "此项只从姓名里的元音字母换算；未填拉丁姓名时为「—」。输入同上。",
    },
    {
      label: "人格数",
      sub: "初见",
      emptyHint: "此项只从姓名里的辅音字母换算；未填拉丁姓名时为「—」。输入同上。",
    },
  ];
}
