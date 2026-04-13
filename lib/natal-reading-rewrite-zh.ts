/**
 * 出生盘解读「重写版」：导言 → 核心快照 → 逻辑推演 → 原始读数 → 执行备忘。
 * 依赖：三主星星座 +（可选）日/月宫位；宫位语义与核心快照路由同源 `houseKeywordMap`。
 * `readingLens`：案卷「阅读角度」，分叉开篇导航与原始读数里的读数习惯句（默认时间主星向）。
 */
import { DEFAULT_ANSWER_ROUTING_CONFIG } from "@/lib/astro-answer-routing-config";
import type { AstroLens } from "@/lib/astro-dossier-storage";
import type { NatalBig3, ZodiacKey } from "@/lib/natal-chart";
import { ZODIAC_CN } from "@/lib/natal-chart";

const HK = DEFAULT_ANSWER_ROUTING_CONFIG.houseKeywordMap;

/** 上升 ⇄ 下降（对宫星座键，用于案例行） */
const DESCENDANT: Record<ZodiacKey, ZodiacKey> = {
  ARIES: "LIBRA",
  TAURUS: "SCORPIO",
  GEMINI: "SAGITTARIUS",
  CANCER: "CAPRICORN",
  LEO: "AQUARIUS",
  VIRGO: "PISCES",
  LIBRA: "ARIES",
  SCORPIO: "TAURUS",
  SAGITTARIUS: "GEMINI",
  CAPRICORN: "CANCER",
  AQUARIUS: "LEO",
  PISCES: "VIRGO",
};

type Element = "fire" | "earth" | "air" | "water";

function elementOf(key: ZodiacKey): Element {
  const f: ZodiacKey[] = ["ARIES", "LEO", "SAGITTARIUS"];
  const e: ZodiacKey[] = ["TAURUS", "VIRGO", "CAPRICORN"];
  const a: ZodiacKey[] = ["GEMINI", "LIBRA", "AQUARIUS"];
  if (f.includes(key)) return "fire";
  if (e.includes(key)) return "earth";
  if (a.includes(key)) return "air";
  return "water";
}

/** 上升元素：别人先感受到的出场气质（口语，用于核心快照与逻辑推演） */
const RISING_INTERFACE_BRIEF: Record<Element, string> = {
  fire: "热、快，往往先动了再消化环境",
  earth: "稳、慢，要先觉得靠谱才肯投入",
  air: "话与理要先透气，才安心往下走",
  water: "对环境很敏感，先摸气氛再决定敞开多少",
};

/** 太阳：长期想推进什么（每星座一条，避免「型结构」套话） */
const SUN_DRIVE_CLASS: Record<ZodiacKey, string> = {
  ARIES: "抢先机、破局，比干熬更对你胃口",
  TAURUS: "积累要落得实，节律感就是安全感",
  GEMINI: "信息对齐、话说明白，心里才落地",
  CANCER: "护住小圈子，边界与互惠要拎清",
  LEO: "要站得上台面，尊严需要被看见",
  VIRGO: "交付要精细，糊涂账会让你难受",
  LIBRA: "在意对等，关系里要双边都过得去",
  SCORPIO: "深度绑定，转化与清算都来得狠",
  SAGITTARIUS: "信念要扩张，坐标总想往外挪",
  CAPRICORN: "用时间换结果，责任要背得动",
  AQUARIUS: "原则摆前面，协作也要保持距离清醒",
  PISCES: "边界像潮汐，共感一强就容易糊",
};

/** 月亮：情绪里最较劲的一对张力（写「主矛盾」用） */
const MOON_TENSION: Record<ZodiacKey, string> = {
  ARIES: "想立刻被接住，又怕显得太冲",
  TAURUS: "要质感与安全，又怕变与失控",
  GEMINI: "话要说清闭环，又嫌一件事钉太死",
  CANCER: "想被懂得，又怕边界被踩穿",
  LEO: "要体面与温度，又怕没人看见",
  VIRGO: "想纠错到位，又怕自己永远不够格",
  LIBRA: "要公平对称，又怕委屈了自己",
  SCORPIO: "要么全给要么全收，释压要分期",
  SAGITTARIUS: "意义想走远，又怕脚下没托底",
  CAPRICORN: "责任越扛越硬，又怕白忙一场",
  AQUARIUS: "想清醒有距离，又想有一句真话落地",
  PISCES: "容易跟人共频，又怕自己没锚点",
};

export const NATAL_REWRITE_NOTICE_ZH = `## 观测协议

这是**几何读数**，不是预言。整篇都在说你的**长期习惯与结构**，不代替医生、律师或心理咨询师。`;

export const NATAL_REWRITE_DISCLAIMER_ZH = `## 口径

- **黄道**：热带黄道（回归黄道）。  
- **宫位**：依赖出生时刻、经纬度与所选宫位制；未载入完整盘面时，宫位句段将标注「待标定」。  
- **原则**：星图是地图，不是判决书。`;

const NATAL_REWRITE_DISCLAIMER_COMPACT = `## 口径

热带黄道；宫位对时辰与宫位制敏感；星图是地图。`;

function houseLine(n: number | undefined, whenKnown: string): string {
  if (n == null || n < 1 || n > 12) return "宫位要等完整出生数据与宫位制对齐后再细说。";
  return whenKnown;
}

export type NatalRewriteInput = {
  big3: NatalBig3;
  /** 1–12；缺省则逻辑推演/原始读数不写死宫位 */
  sunHouse?: number;
  moonHouse?: number;
  houseSystemZh?: string;
  dateLine?: string;
  showCaseLine?: boolean;
  /** 与占星工作台案卷「阅读角度」一致；缺省按时间主星向 */
  readingLens?: AstroLens;
};

function effectiveLens(input: NatalRewriteInput): AstroLens {
  return input.readingLens ?? "time_lord";
}

/** 全文 / 精简：插在观测协议之后、核心快照之前 */
function readingAngleBlockFull(lens: AstroLens): string {
  if (lens === "lunar_cycle") {
    return `## 阅读角度（本稿）

你选择的是 **月亮周期** 向阅读：下文先强项落在**月亮**——日常最拧的张力、作息与安全感往往从这里冒出来；**太阳**当作**方向盘**看长期方向。适合按朔望、上下半月做小复盘，别把单次情绪写成终身判决书。

这里不替你排月相日历，只是把**句子顺序与提醒点**对齐这种读法。`;
  }
  return `## 阅读角度（本稿）

你选择的是 **时间主星** 向阅读：下文先强项落在**太阳宫位与长期主轴**，用它们定「这几年/这几季一组题目围着什么转」；**月亮**用来收**日常情绪与日程**，别把每一天都升级成一辈子结论。

这里不替你算法达、小限等软件排盘，只是把**阅读习惯**对齐「先时主、后月相松紧」。`;
}

function readingAngleBlockCompact(lens: AstroLens): string {
  if (lens === "lunar_cycle") {
    return `## 阅读角度（本稿）

**月亮周期向**：先月亮张力与作息，太阳管长期方向；适合朔望小结，不单次定终身。`;
  }
  return `## 阅读角度（本稿）

**时间主星向**：先太阳宫位与长期线，再月亮收情绪与日程；不代算法达，只调阅读顺序。`;
}

function readingAngleLineShort(lens: AstroLens): string {
  if (lens === "lunar_cycle") {
    return `> **阅读角度**：月亮周期向——先月亮日常与张力，太阳作长期方向。\n\n`;
  }
  return `> **阅读角度**：时间主星向——先太阳宫位主轴，再收月亮日常。\n\n`;
}

function readingHabitLineZh(lens: AstroLens): string {
  if (lens === "lunar_cycle") {
    return "先月亮张力与日程，再太阳长期线，上升与宫位轴线随后；次要相位最后带过";
  }
  return "先太阳宫位与长期主轴，再月亮日常与情绪，上升与宫位轴线随后；次要相位最后带过";
}

function readingAnglePrecisionLabel(lens: AstroLens): string {
  return lens === "lunar_cycle" ? "月亮周期向（先月亮，后太阳）" : "时间主星向（先太阳宫位主轴，后月亮）";
}

function structuralAxisParagraph(sunHouse: number | undefined, moonHouse: number | undefined): string {
  const hit2 = sunHouse === 2 || moonHouse === 2;
  const hit8 = sunHouse === 8 || moonHouse === 8;
  let detail =
    "你常在「手头稳不稳」与「要不要彻底翻新一段关系/钱/信任」之间来回想；反复多半在问：**哪些该留，哪些该换**。";
  if (sunHouse == null && moonHouse == null) {
    detail =
      "日、月宫位还没标定时，这条轴只当背景提示；等宫位定了，再谈钱是钱、蜕变是蜕变。";
  } else if (hit2 && hit8) {
    detail =
      "太阳或月亮同时踩中「钱与资源」和「共有与蜕变」两块，容易两头烧；宜拆成几段小目标，别指望一次想完。";
  } else if (hit8) {
    detail =
      "太阳或月亮压在蜕变、共有、信任这一块时，隐性绑定、欠债担保、权界这类事更容易浮上台面，适合慢慢重谈规则。";
  } else if (hit2) {
    detail =
      "太阳或月亮压在钱与自我价值这一块时，进账、定价、「我值不值」更容易占满注意力。";
  }
  return `### 4) 结构性课题（2/8 轴）

你的人生里常有一条线：**手里有什么（2 宫）** 和 **敢不敢与人共有、敢不敢蜕变（8 宫）**。
这不是运气坏，而是你心里总在**求稳**与**求深**之间找平衡。
${detail}`;
}

function professionalSun(big3: NatalBig3, sunHouse: number | undefined): string {
  const { sun } = big3;
  const cn = ZODIAC_CN[sun];
  const hk = sunHouse != null && sunHouse >= 1 && sunHouse <= 12 ? HK[sunHouse] : "（宫位待标定）";
  return `### 1) 动力系统（太阳 ${cn}${sunHouse != null ? ` / ${sunHouse} 宫` : ""}）

你长期想推进的，不是「讨谁喜欢」，而是**${SUN_DRIVE_CLASS[sun]}**。
${houseLine(sunHouse, `太阳落在${cn}${sunHouse}宫，日子多半绕在：${hk}；表面糊弄不过去，你心里会一遍遍自己验。`)}`;
}

function professionalMoon(big3: NatalBig3, moonHouse: number | undefined): string {
  const { moon } = big3;
  const cn = ZODIAC_CN[moon];
  const hk = moonHouse != null && moonHouse >= 1 && moonHouse <= 12 ? HK[moonHouse] : "（宫位待标定）";
  return `### 2) 内部回路（月亮 ${cn}${moonHouse != null ? ` / ${moonHouse} 宫` : ""}）

你心里最常较劲的，是：**${MOON_TENSION[moon]}**。
${houseLine(
    moonHouse,
    `月亮在${cn}${moonHouse}宫，心情和日程容易绑在：${hk}；感受若总跟生活节奏拧着，累会悄悄堆起来。`,
  )}`;
}

function professionalRising(big3: NatalBig3): string {
  const { rising } = big3;
  const cn = ZODIAC_CN[rising];
  return `### 3) 外部接口（上升 ${cn} / 1 宫）

别人第一眼感受到的你，往往是：**${RISING_INTERFACE_BRIEF[elementOf(rising)]}**。
这种出场方式好用，压力一大也容易**绷太紧**。
累了的时候，你更习惯**先缩回自己**，而不是当场向外讨安慰。`;
}

function precisionBlock(input: NatalRewriteInput): string {
  const { big3, sunHouse, moonHouse, houseSystemZh } = input;
  const lens = effectiveLens(input);
  const hs = houseSystemZh ? `；宫位制：${houseSystemZh}` : "";
  const sunH = sunHouse != null && sunHouse >= 1 && sunHouse <= 12 ? String(sunHouse) : "待标定";
  const moonH = moonHouse != null && moonHouse >= 1 && moonHouse <= 12 ? String(moonHouse) : "待标定";
  return `## 原始读数（标签与权重）

给要核对表意的人：**下面是三轴落点与读数习惯，不是日运。**

- **读本类型**：静态底盘（长期向）  
- **阅读角度**：${readingAnglePrecisionLabel(lens)}  
- **关键配置**：太阳 ${ZODIAC_CN[big3.sun]} ${sunH} 宫 / 月亮 ${ZODIAC_CN[big3.moon]} ${moonH} 宫 / 上升 ${ZODIAC_CN[big3.rising]} 1 宫${hs}  
- **读数习惯**：${readingHabitLineZh(lens)}  
- **常回到的四组词**：怎么出场、长期要什么、心情拖什么、钱与蜕变怎么平衡`;
}

function manualConclusion(): string {
  return `## 执行备忘

- **落实**：把「想明白」拆成**明天能做完的一步**（谁做、何时复核）。  
- **别榨干**：先保住睡眠和日程上限，再谈远大意义。  
- **界线**：对自己、对亲密关系、对钱，**什么可以、什么不行**，能说出口。

你不是被写死的脚本；习惯可以改，节律可以调。`;
}

const INTRO_FULL = `## 导言（Intro）

你的人生很少是「随机发疯」，多半是一套**长期习惯**在重复。
这张盘不问今天运气，只帮你看：**你为什么总卡在同一类事上、哪里最耗电、可以怎么调**。`;

const INTRO_COMPACT = `## 导言

长期习惯与结构：说清「为什么总卡、哪里最耗」，不做单日吉凶。`;

export function buildNatalReadingRewriteFullMarkdown(input: NatalRewriteInput): string {
  const lens = effectiveLens(input);
  const { big3, sunHouse, moonHouse, dateLine = "", showCaseLine = true } = input;
  const { sun, moon, rising } = big3;
  const desc = ZODIAC_CN[DESCENDANT[rising]];

  const caseLine = showCaseLine
    ? `\n**案例**：太阳 ${ZODIAC_CN[sun]}${sunHouse != null ? ` ${sunHouse} 宫` : ""} · 月亮 ${ZODIAC_CN[moon]}${moonHouse != null ? ` ${moonHouse} 宫` : ""} · 上升 ${ZODIAC_CN[rising]} 1 宫（下降 ${desc}）${
        dateLine ? `  \n**日期**：${dateLine}` : ""
      }\n`
    : "";

  const moonHk =
    moonHouse != null && moonHouse >= 1 && moonHouse <= 12 ? HK[moonHouse] : "（月亮宫位待标定）";

  const answer = `## 核心快照（默认）

**你怎么出场**：${RISING_INTERFACE_BRIEF[elementOf(rising)]}。  
**你长期推什么**：${SUN_DRIVE_CLASS[sun]}。

**心里最常拧的**：**${MOON_TENSION[moon]}**（月亮·${ZODIAC_CN[moon]}），又和 **${moonHk}**${moonHouse != null ? `（${moonHouse} 宫）` : ""} 搅在一起。

**可以先做的三件事**：把打算**落成一小步**；别让心情和日程一直对打；钱、身体、亲密关系里**该说的界线**说清楚。`;

  const pro = `## 逻辑推演（展开）

${professionalSun(big3, sunHouse)}

${professionalMoon(big3, moonHouse)}

${professionalRising(big3)}

${structuralAxisParagraph(sunHouse, moonHouse)}`;

  const prec = precisionBlock(input);
  const manual = manualConclusion();

  return [
    `# 出生盘观测报告（重写版）\n`,
    caseLine,
    "---\n",
    INTRO_FULL,
    "\n---\n",
    NATAL_REWRITE_NOTICE_ZH,
    "\n---\n",
    readingAngleBlockFull(lens),
    "\n---\n",
    answer,
    "\n---\n",
    pro,
    "\n---\n",
    prec,
    "\n---\n",
    manual,
    "\n---\n",
    NATAL_REWRITE_DISCLAIMER_ZH,
    "\n",
  ].join("\n");
}

export function buildNatalReadingRewriteCompactMarkdown(input: NatalRewriteInput): string {
  const lens = effectiveLens(input);
  const { big3, moonHouse, dateLine = "", showCaseLine = true } = input;
  const { sun, moon, rising } = big3;
  const moonHk =
    moonHouse != null && moonHouse >= 1 && moonHouse <= 12 ? HK[moonHouse] : "（月亮宫位待标定）";
  const caseLine =
    showCaseLine && dateLine
      ? `\n**日期**：${dateLine}\n`
      : showCaseLine
        ? `\n**三轴**：☉ ${ZODIAC_CN[sun]} · ☽ ${ZODIAC_CN[moon]} · ↑ ${ZODIAC_CN[rising]}\n`
        : "";

  return [
    `# 出生盘（精简版）\n`,
    caseLine,
    "---\n",
    INTRO_COMPACT,
    "\n---\n",
    NATAL_REWRITE_NOTICE_ZH,
    "\n---\n",
    readingAngleBlockCompact(lens),
    "\n---\n",
    `## 核心快照\n\n**出场**：${RISING_INTERFACE_BRIEF[elementOf(rising)]}\n\n**长期**：${SUN_DRIVE_CLASS[sun]}\n\n**拉扯**：${MOON_TENSION[moon]}（☽ ${ZODIAC_CN[moon]}）× ${moonHk}${moonHouse != null ? `（${moonHouse} 宫）` : ""}\n\n**先做**：落一步 · 别耗空 · 界线说清楚\n`,
    "---\n",
    precisionBlock(input),
    "\n---\n",
    manualConclusion(),
    "\n---\n",
    NATAL_REWRITE_DISCLAIMER_COMPACT,
    "\n",
  ].join("\n");
}

export function buildNatalReadingRewriteGoldCardMarkdown(input: NatalRewriteInput): string {
  const { big3, moonHouse } = input;
  const { sun, moon, rising } = big3;
  const moonHk =
    moonHouse != null && moonHouse >= 1 && moonHouse <= 12 ? HK[moonHouse] : "宫位待标定";
  return [
    `> **出生盘**：看长期习惯与结构，不是单日运势。\n\n`,
    `## 核心快照\n\n`,
    `**出场**：${RISING_INTERFACE_BRIEF[elementOf(rising)]}\n\n`,
    `**长期**：${SUN_DRIVE_CLASS[sun]}\n\n`,
    `**拉扯**：${MOON_TENSION[moon]} × ${moonHk}${moonHouse != null ? ` · ${moonHouse}宫` : ""}\n\n`,
    `**先做**：落一步 · 别耗空 · 界线清\n\n`,
    `---\n\n`,
    NATAL_REWRITE_DISCLAIMER_COMPACT,
    "\n",
  ].join("");
}

export function buildAstroWorkspaceUnderstandRewriteMarkdown(input: NatalRewriteInput): string {
  const lens = effectiveLens(input);
  const { big3, moonHouse } = input;
  const { sun, moon, rising } = big3;
  const moonHk =
    moonHouse != null && moonHouse >= 1 && moonHouse <= 12 ? HK[moonHouse] : "宫位待标定";
  return [
    `> **怎么读**：与导出全文同一套**重写版**出生盘；此处仅核心快照骨架。\n\n`,
    readingAngleLineShort(lens),
    `## 核心快照\n\n`,
    `**出场**：${RISING_INTERFACE_BRIEF[elementOf(rising)]}\n\n`,
    `**长期**：${SUN_DRIVE_CLASS[sun]}\n\n`,
    `**拉扯**：${MOON_TENSION[moon]} × ${moonHk}${moonHouse != null ? ` · ${moonHouse}宫` : ""}\n\n`,
    `**先做**：落一步 · 别耗空 · 界线清\n`,
  ].join("");
}
