/**
 * 读数「综合结论」正文分段：声部 2–10 成稿（模板填空）；声部 1 与各段未命中回退基座 `*-by-kind-zh`。
 * 主相位框句、轴摩擦行见 `astro-chart-readout-synthesis-major-fric-patch-zh`；次要紧相位声部 2–10 换尾句（含次限/三限/日返/月返的盘型尾或内层模板）。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { aspectTypeLabelZh } from "@/lib/astro-aspect-type-label-zh";
import type { AstroAngleAspectDatum, AstroAspectDatum } from "@/lib/astro-chart-wheel";
import { PLANET_NAME_ZH } from "@/lib/astro-chart-wheel";
import {
  READOUT_SYNTHESIS_ONE_LINER_ZH,
  SYNTHESIS_ASC_MC_LINE_TEMPLATE_ZH,
  SYNTHESIS_FOURTH_LINE_TEMPLATE_ZH,
} from "@/lib/astro-eight-chart-view-copy-zh";
import {
  axisFrictionLineForDatum,
  isMinorOuterPlanetPair,
  majorAspectCoreLineZh,
  majorAspectWrapForKind,
  minorSupplementLineForKind,
  sunMarsConjLineForKind,
  sunMoonHousesLineForKind,
} from "@/lib/astro-chart-readout-synthesis-body-by-kind-zh";
import {
  READOUT_FRICTION_ROW_PATCH,
  READOUT_MAJOR_WRAP_PATCH,
} from "@/lib/astro-chart-readout-synthesis-major-fric-patch-zh";

type V = VoiceStyleIdZh;
type K = ChartKindId;

/** 声部 1 与未覆盖声部：与 `minorSupplementLineForKind` 中外行星分支尾句一致。 */
const DEFAULT_MINOR_TAIL_OUTER =
  "压力大时，直觉、想象或想躲一下的冲动容易被放大，拿来松一口气可以，别当成唯一决策依据。";
const DEFAULT_MINOR_TAIL_INNER = "像背景里的细线，小事里会冒出来提醒你。";

/** 次要相位：外行星两两成对时的长尾句，按声部换说法（natal/比较/行运/星历等共用）。 */
const MINOR_TAIL_OUTER_VOICE: Partial<Record<V, string>> = {
  2: "压力一上来，直觉、走神或想躲一下的念头容易被放大；拿来松口气行，别当唯一拍板依据。",
  3: "高压→直觉/躲避↑；可作减压线索，勿单源决策。",
  4: "担子一沉，梦境、预感或想退开的冲动就跟着显形；拿来透气无妨，别当成一辈子定性。",
  5: "压↑→直觉躲↑；喘口气≠拍板",
  6: "主观压力升高时，直觉性想象或回避倾向可能被放大；宜作情绪调节参考，不宜作为唯一决策依据。",
  7: "心里一紧，爱走神、爱躲的念头就跟着冒；拿来缓缓行，别当盖棺定论。",
  8: "当压力水平上升时，想象、直觉或回避动机可能被强化；可作为情绪缓冲之线索，不宜单独承担决策权重。",
  9: "【次要尾】压↑直觉/回避放大≠唯一依据",
  10: "压↑→直觉躲↑·非单判",
};

/** 次要相位：非外行星两两成对时的短尾句。 */
const MINOR_TAIL_INNER_VOICE: Partial<Record<V, string>> = {
  2: "更像背景里的一根细线，琐事的缝里偶尔也会勾它一下。",
  3: "背景细线；琐事或可触发。",
  4: "像幕布后的一根细丝，小事也爱轻轻拽它。",
  5: "底噪细线·小事触发",
  6: "表现为背景层面之细微联结；日常琐事中可能间歇显现。",
  7: "像底子里的细绳，小事也爱扯一下。",
  8: "多表现为背景层之轻微提示；于日常情境中可能间歇被唤起。",
  9: "【次要尾】底噪细线·琐事可触发",
  10: "底噪·琐触发",
};

/** 次限/三限/日返/月返：外行星两两成对时，冒号后的盘型尾（声部 1 见 `minorSupplementLineForKind`）。 */
type MinorProgKind = "secondary" | "tertiary" | "solar_return" | "lunar_return";

const MINOR_PROG_OUTER_BASE: Record<MinorProgKind, string> = {
  secondary: "几年里背景压力上来时，这条细线容易被听见。",
  tertiary: "近几周小事里这条线爱露头。",
  solar_return: "这一年里低潮时这条背景线会放大感受。",
  lunar_return: "这一小段里情绪波动时它常插话。",
};

/** 内层分支：`{tail}` 填入 `MINOR_TAIL_INNER_VOICE` 或默认细线尾。 */
const MINOR_PROG_INNER_BASE: Record<MinorProgKind, string> = {
  secondary: "慢迁里{tail}",
  tertiary: "近窗里{tail}",
  solar_return: "年度叙事里{tail}",
  lunar_return: "小段周期里{tail}",
};

const MINOR_PROG_OUTER_VOICE: Partial<Record<V, Partial<Record<MinorProgKind, string>>>> = {
  2: {
    secondary: "几年里压力一抬头，这条背景细线反而更容易钻进耳朵里。",
    tertiary: "近几周小事一密，这条线就爱露个头。",
    solar_return: "这一年情绪走低时，这条背景线特别容易把感受放大。",
    lunar_return: "这一小段心情起伏时，它老在中间插一句嘴。",
  },
  3: {
    secondary: "次限·年尺度压↑→细线易显。",
    tertiary: "三限·近周琐↑→线露头。",
    solar_return: "日返·低潮→背景线放大感受。",
    lunar_return: "月返·短窗情绪波动→常插话。",
  },
  4: {
    secondary: "几年这一镜推得慢，压力一上来，幕后的那根细丝反而先响。",
    tertiary: "近几周琐事一叠，这根线就爱从缝里探头。",
    solar_return: "这一年的低潮段落里，背景线特别会把心事放大一号。",
    lunar_return: "这一小段情绪一起伏，它就像旁白似的插进来。",
  },
  5: {
    secondary: "次限·压↑→细线显",
    tertiary: "三限·琐↑→线露",
    solar_return: "日返·低潮→背景放大",
    lunar_return: "月返·情波→插话",
  },
  6: {
    secondary: "观测（次限）：年尺度压力抬升时，该细微结构线可能更易被感知。",
    tertiary: "观测（三限）：近周琐事密度上升时，该线更易显现。",
    solar_return: "观测（日返）：年度低潮段中，背景型次要结构可能放大主观感受。",
    lunar_return: "观测（月返）：短周期情绪波动时，该线更易插入主观叙述。",
  },
  7: {
    secondary: "次限这几年，压力一抬头，背景那根细线反而先敲你耳朵。",
    tertiary: "三限这几周，小事一密，这条线就爱露脸。",
    solar_return: "日返这一年，心里低谷时，这根背景线老爱把难受放大一档。",
    lunar_return: "月返这一小段，情绪一颠，它就爱在中间嘟囔一句。",
  },
  8: {
    secondary: "于次限之年尺度进程中，当背景压力上升时，该次要结构线可能更易被听见。",
    tertiary: "于三限之短周期窗口内，琐事密度上升时，该线更易显现。",
    solar_return: "于日返之年度叙事中，低潮阶段该背景线可能强化感受体验。",
    lunar_return: "于月返之短周期内，情绪波动时该线更易参与主观叙述。",
  },
  9: {
    secondary: "【次限次要】压↑→细线显",
    tertiary: "【三限次要】琐↑→线露",
    solar_return: "【日返次要】低潮→感受放大",
    lunar_return: "【月返次要】情波→插话",
  },
  10: {
    secondary: "次限:压↑→细线",
    tertiary: "三限:琐↑→线",
    solar_return: "日返:低潮→背景↑",
    lunar_return: "月返:情波→插",
  },
};

const MINOR_PROG_INNER_VOICE: Partial<Record<V, Partial<Record<MinorProgKind, string>>>> = {
  2: {
    secondary: "几年慢迁里，{tail}",
    tertiary: "近几周窗口里，{tail}",
    solar_return: "这一年的故事里，{tail}",
    lunar_return: "这一小段周期里，{tail}",
  },
  3: {
    secondary: "慢迁｜{tail}",
    tertiary: "近窗｜{tail}",
    solar_return: "年叙｜{tail}",
    lunar_return: "短周｜{tail}",
  },
  4: {
    secondary: "慢迁长镜里叠着，{tail}",
    tertiary: "近窗特写里，{tail}",
    solar_return: "年度剧本里裹着，{tail}",
    lunar_return: "小段花絮里夹着，{tail}",
  },
  5: {
    secondary: "慢迁·{tail}",
    tertiary: "近窗·{tail}",
    solar_return: "年叙·{tail}",
    lunar_return: "短周·{tail}",
  },
  6: {
    secondary: "次限慢迁语境中：{tail}",
    tertiary: "三限短窗语境中：{tail}",
    solar_return: "日返年度语境中：{tail}",
    lunar_return: "月返短周期语境中：{tail}",
  },
  7: {
    secondary: "几年慢迁里遛着，{tail}",
    tertiary: "近几周窗里晃着，{tail}",
    solar_return: "这一年的故事里掺着，{tail}",
    lunar_return: "这一小段里裹着，{tail}",
  },
  8: {
    secondary: "于次限之慢迁语境中：{tail}",
    tertiary: "于三限之近窗语境中：{tail}",
    solar_return: "于日返之年度语境中：{tail}",
    lunar_return: "于月返之短周期语境中：{tail}",
  },
  9: {
    secondary: "【次限】{tail}",
    tertiary: "【三限】{tail}",
    solar_return: "【日返】{tail}",
    lunar_return: "【月返】{tail}",
  },
  10: {
    secondary: "次限:{tail}",
    tertiary: "三限:{tail}",
    solar_return: "日返:{tail}",
    lunar_return: "月返:{tail}",
  },
};

function minorProgOuterSuffix(voice: V, kind: MinorProgKind): string {
  return MINOR_PROG_OUTER_VOICE[voice]?.[kind] ?? MINOR_PROG_OUTER_BASE[kind];
}

function minorProgInnerPart(voice: V, kind: MinorProgKind, tail: string): string {
  const tpl = MINOR_PROG_INNER_VOICE[voice]?.[kind] ?? MINOR_PROG_INNER_BASE[kind];
  return tpl.replaceAll("{tail}", tail);
}

function pick<KK extends string>(
  layer: Partial<Record<V, Partial<Record<KK, string>>>> | undefined,
  voice: V,
  key: KK,
  base: string,
): string {
  const hit = layer?.[voice]?.[key as KK];
  return hit !== undefined ? hit : base;
}

function fillAscMc(t: string, asc: string, mc: string): string {
  return t.replaceAll("{ascSign}", asc).replaceAll("{mcSign}", mc);
}

function fillFourth(t: string, fourth: string): string {
  return t.replaceAll("{fourthSign}", fourth);
}

function fillSunMoon(t: string, sunH: number, moonH: number): string {
  return t.replaceAll("{sunH}", String(sunH)).replaceAll("{moonH}", String(moonH));
}

function fillSunMars(t: string, orb: string, mid: string): string {
  return t.replaceAll("{orb}", orb).replaceAll("{mid}", mid);
}

/** 上升·天顶：声部 × 盘型 */
const ASC_MC_PATCH: Partial<Record<V, Partial<Record<K, string>>>> = {
  2: {
    natal:
      "上升在{ascSign}、天顶在{mcSign}：别人第一眼抓到的你，和社会名片上那一面，本来就不一定是同一种配方。",
    synastry:
      "上升在{ascSign}、天顶在{mcSign}：案主这轮上，外界先读到的气质和名片仍可能不同步；俩人怎么接，合盘与双方档案再看。",
    transit:
      "行运盘上，上升在{ascSign}、天顶在{mcSign}：这几天外界更容易先读到这层「出场与名片」，心情未必跟得上，回头对本命里的长期接口更清楚。",
    ephemeris:
      "这一刻，上升在{ascSign}、天顶在{mcSign}：现场别人先抓到的你，和场合要你演的角色，可能仍是两套；只服务这个切片的决定。",
    secondary:
      "次限盘上，上升在{ascSign}、天顶在{mcSign}：这几年对外接口和公众形象会像慢镜头一样迁；底色还在本命，看的是年尺度张力。",
    tertiary:
      "三限盘上，上升在{ascSign}、天顶在{mcSign}：近几周「怎么被看见、怎么接活」更容易晃；拿来排程缓冲，别当改名条。",
    solar_return:
      "日返盘上，上升在{ascSign}、天顶在{mcSign}：这一年外界读你的方式与事业接口会带年度强调；仍建议对照本命。",
    lunar_return:
      "月返盘上，上升在{ascSign}、天顶在{mcSign}：这一小段里出场感和对外任务更容易跟着情绪起伏；先安顿起居与节奏。",
  },
  3: {
    natal:
      "上升｜{ascSign}；天顶｜{mcSign}：外界先读到的接口 vs 社会名片，常是两套坐标。",
    synastry:
      "案主轮｜上升{ascSign}、天顶{mcSign}：外界先读与名片接口可能错位；双人接法→合盘。",
    transit:
      "行运｜上升{ascSign}、天顶{mcSign}：当下出场/名片层先被读到；情绪接口回本命核对。",
    ephemeris:
      "时刻｜上升{ascSign}、天顶{mcSign}：切片内出场与角色分工可能双轨；不接终身定性。",
    secondary:
      "次限｜上升{ascSign}、天顶{mcSign}：年尺度对外接口慢迁；本命为参照系。",
    tertiary:
      "三限｜上升{ascSign}、天顶{mcSign}：短窗内亮相与接活波动；用于排程。",
    solar_return:
      "日返｜上升{ascSign}、天顶{mcSign}：年度公众接口强调；联立本命。",
    lunar_return:
      "月返｜上升{ascSign}、天顶{mcSign}：短周期出场与任务随情绪起伏；起居优先。",
  },
  4: {
    natal:
      "上升落在{ascSign}、天顶在{mcSign}：台前气质和社会给你的标签，常常是两套剧本。",
    synastry:
      "案主轮：上升{ascSign}、天顶{mcSign}——外界先看见的那一面，和名片仍可能不同步；对手戏看合盘。",
    transit:
      "行运幕里，上升{ascSign}、天顶{mcSign}：此刻容易被先读成「这一版出场」；心情线回本命找老接口。",
    ephemeris:
      "定格在{ascSign}上升、{mcSign}天顶：这一瞬的亮相与角色要求可能打架；只当现场提示。",
    secondary:
      "次限长镜里，上升{ascSign}、天顶{mcSign}：几年里对外接口慢慢换景；本命仍是母题。",
    tertiary:
      "三限近景，上升{ascSign}、天顶{mcSign}：几周里「被看见的方式」爱晃；先排缓冲别硬定性。",
    solar_return:
      "日返年场，上升{ascSign}、天顶{mcSign}：这一年公众读你的方式带年度滤镜；对照本命太阳。",
    lunar_return:
      "月返小段，上升{ascSign}、天顶{mcSign}：起居与情绪一牵动，出场感就跟着抖；先稳住私密节奏。",
  },
  5: {
    natal: "升{ascSign}·顶{mcSign}·出场≠名片",
    synastry: "案主升{ascSign}顶{mcSign}·双人→合盘",
    transit: "行运升{ascSign}顶{mcSign}·×本命→对照",
    ephemeris: "时刻升{ascSign}顶{mcSign}·切片",
    secondary: "次限升{ascSign}顶{mcSign}·年接口",
    tertiary: "三限升{ascSign}顶{mcSign}·短窗",
    solar_return: "日返升{ascSign}顶{mcSign}·年",
    lunar_return: "月返升{ascSign}顶{mcSign}·短",
  },
  6: {
    natal:
      "观测：上升{ascSign}、天顶{mcSign}；外界先验接口与社会名片接口可能不一致。",
    synastry:
      "观测（案主轮）：上升{ascSign}、天顶{mcSign}；双人几何样本→合盘。",
    transit:
      "观测（行运）：上升{ascSign}、天顶{mcSign}；与本命交会另行对照。",
    ephemeris:
      "观测（时刻）：上升{ascSign}、天顶{mcSign}；单锚切片。",
    secondary:
      "观测（次限）：上升{ascSign}、天顶{mcSign}；年尺度对外接口慢变量。",
    tertiary:
      "观测（三限）：上升{ascSign}、天顶{mcSign}；短窗亮相波动。",
    solar_return:
      "观测（日返）：上升{ascSign}、天顶{mcSign}；年度公众接口假设。",
    lunar_return:
      "观测（月返）：上升{ascSign}、天顶{mcSign}；短周期起居/情绪接口。",
  },
  7: {
    natal:
      "上升{ascSign}、天顶{mcSign}：别人瞅见你的头一眼，和你在社会上那张名片，本来就可能不是一码事。",
    synastry:
      "案主这轮，上升{ascSign}、天顶{mcSign}：外界先瞅见的和名片仍可能对不上；俩人咋磨合，合盘里见。",
    transit:
      "行运这张，上升{ascSign}、天顶{mcSign}：这几天人更容易先按「出场+名片」读你；心里那层回本命找。",
    ephemeris:
      "就这一刻，上升{ascSign}、天顶{mcSign}：当场读人与要你扮的角色，两套都可能有。",
    secondary:
      "次限这几年，上升{ascSign}、天顶{mcSign}：对外那层像慢挪；老根还在本命。",
    tertiary:
      "三限这几周，上升{ascSign}、天顶{mcSign}：亮相、接活容易忽紧忽松；先排日子别硬升华。",
    solar_return:
      "日返这一年，上升{ascSign}、天顶{mcSign}：外界读你的调门带年味儿；本命太阳别丢。",
    lunar_return:
      "月返这一小段，上升{ascSign}、天顶{mcSign}：家里和心情一乱，出门那层也跟着晃；先回血。",
  },
  8: {
    natal:
      "上升位于{ascSign}、天顶位于{mcSign}：外界第一印象与社会角色标签可能呈现为不同面向。",
    synastry:
      "案主轮：上升{ascSign}、天顶{mcSign}；外界先验印象与名片式角色仍可能不同步，双人互动请参阅合盘材料。",
    transit:
      "行运盘面：上升{ascSign}、天顶{mcSign}；当前更易先被读取「出场与社会面向」层，情绪与长期接口建议回本命核对。",
    ephemeris:
      "指定时刻：上升{ascSign}、天顶{mcSign}；现场亮相与角色期待可能并存两套描述，仅服务该窗口决策。",
    secondary:
      "次限盘面：上升{ascSign}、天顶{mcSign}；对外接口与公众形象呈年尺度慢迁，仍以本命为参照。",
    tertiary:
      "三限盘面：上升{ascSign}、天顶{mcSign}；短周期内亮相与任务承接波动更明显，用于排程而非身份改写。",
    solar_return:
      "日返盘面：上升{ascSign}、天顶{mcSign}；年度公众读数与事业接口带该年特征，建议与本命联读。",
    lunar_return:
      "月返盘面：上升{ascSign}、天顶{mcSign}；短周期内起居与情绪更易牵动对外表现，宜先稳定私密节律。",
  },
  9: {
    natal: "【上升·天顶】{ascSign}/{mcSign}·出场≠名片",
    synastry: "【案主轮】{ascSign}/{mcSign}·双人→合盘",
    transit: "【行运】{ascSign}/{mcSign}·本命→对照栏",
    ephemeris: "【时刻】{ascSign}/{mcSign}·切片",
    secondary: "【次限】{ascSign}/{mcSign}·年接口",
    tertiary: "【三限】{ascSign}/{mcSign}·短窗",
    solar_return: "【日返】{ascSign}/{mcSign}·年题",
    lunar_return: "【月返】{ascSign}/{mcSign}·短札",
  },
  10: {
    natal: "ASC{ascSign}MC{mcSign}",
    synastry: "案主ASC{ascSign}MC{mcSign}",
    transit: "行运ASC{ascSign}MC{mcSign}",
    ephemeris: "时刻ASC{ascSign}MC{mcSign}",
    secondary: "次限ASC{ascSign}MC{mcSign}",
    tertiary: "三限ASC{ascSign}MC{mcSign}",
    solar_return: "日返ASC{ascSign}MC{mcSign}",
    lunar_return: "月返ASC{ascSign}MC{mcSign}",
  },
};

const FOURTH_PATCH: Partial<Record<V, Partial<Record<K, string>>>> = {
  2: {
    natal:
      "第四宫宫头在{fourthSign}：私下日子、身体节律、住得舒不舒服——这块稳了，外面的折腾才不容易反噬成内耗。",
    synastry:
      "第四宫宫头在{fourthSign}：案主私底下要的踏实与住处氛围，仍是关系里的底噪；俩人怎么分私密，合盘再谈。",
    transit:
      "第四宫宫头在{fourthSign}：这阵子家、独处、身体仍是你回血口；外面再吵也留点给「住得舒不舒服」。",
    ephemeris:
      "第四宫宫头在{fourthSign}：这一刻家、休息、身体的接口会被放大；只当现场提示。",
    secondary:
      "第四宫宫头在{fourthSign}：几年里根与住处议题会慢慢浮面；逐年收拾底盘，别用琐事量进展。",
    tertiary:
      "第四宫宫头在{fourthSign}：近几周起居与心情底色在这显形；累了先睡先吃再谈大事。",
    solar_return:
      "第四宫宫头在{fourthSign}：这一年「家与内在安全」会参与全年剧情；给生活底盘留预算。",
    lunar_return:
      "第四宫宫头在{fourthSign}：这一小段睡眠、家人、私密空间最吃情绪；先安顿再对外冲。",
  },
  3: {
    natal: "4宫头｜{fourthSign}：私生活/节律/住处稳→外耗不易反噬。",
    synastry: "案主4宫头｜{fourthSign}：私密底盘→关系底噪；双人→合盘。",
    transit: "行运4宫头｜{fourthSign}：回血域在家与身体。",
    ephemeris: "时刻4宫头｜{fourthSign}：家/休息放大；切片。",
    secondary: "次限4宫头｜{fourthSign}：根与住处·年变量。",
    tertiary: "三限4宫头｜{fourthSign}：起居底色·短窗。",
    solar_return: "日返4宫头｜{fourthSign}：内在安全·年题。",
    lunar_return: "月返4宫头｜{fourthSign}：睡眠家人·短札。",
  },
  4: {
    natal:
      "第四宫落在{fourthSign}：幕后生活、身体、住处的安稳，是你挡外面乱流的减震层。",
    synastry:
      "第四宫在{fourthSign}：案主要的私密与踏实，是关系里压不住的底层音量。",
    transit:
      "第四宫在{fourthSign}：这几天回血靠家、靠独处、靠身体别硬扛。",
    ephemeris:
      "第四宫在{fourthSign}：这一刻「家与休息」被放大成现场提示。",
    secondary:
      "第四宫在{fourthSign}：几年里「根在哪」会慢慢浮上来，别急用小事否定自己。",
    tertiary:
      "第四宫在{fourthSign}：近几周累了就往回缩一点，先吃饭睡觉。",
    solar_return:
      "第四宫在{fourthSign}：这一年的安全感账单记得单独列一行。",
    lunar_return:
      "第四宫在{fourthSign}：这一小段先护睡眠和家人，再谈对外冲。",
  },
  5: {
    natal: "4宫{fourthSign}·家底稳→外耗减",
    synastry: "案主4宫{fourthSign}·私密→合盘",
    transit: "行运4宫{fourthSign}·回血在家",
    ephemeris: "时刻4宫{fourthSign}·切片",
    secondary: "次限4宫{fourthSign}·年根",
    tertiary: "三限4宫{fourthSign}·短居",
    solar_return: "日返4宫{fourthSign}·年安",
    lunar_return: "月返4宫{fourthSign}·短歇",
  },
  6: {
    natal: "观测：第四宫宫头{fourthSign}；私生活与节律稳定可降低外耗反噬。",
    synastry: "观测（案主）：4宫头{fourthSign}；私密底盘样本→合盘。",
    transit: "观测（行运）：4宫头{fourthSign}；回血域优先。",
    ephemeris: "观测（时刻）：4宫头{fourthSign}；家/休息接口放大。",
    secondary: "观测（次限）：4宫头{fourthSign}；根议题年尺度浮现。",
    tertiary: "观测（三限）：4宫头{fourthSign}；起居底色短窗。",
    solar_return: "观测（日返）：4宫头{fourthSign}；内在安全参与年叙事。",
    lunar_return: "观测（月返）：4宫头{fourthSign}；睡眠/家人短周期敏感。",
  },
  7: {
    natal:
      "第四宫宫头在{fourthSign}：家里顺不顺、睡得好不好、住得踏实不踏实——这块理顺了，外面的烦才不容易啃进心里。",
    synastry:
      "第四宫在{fourthSign}：案主私底下要的安稳，是俩人关系里压不住的低音。",
    transit:
      "第四宫在{fourthSign}：这阵子别光在外面顶，回家喘口气、让身体过关。",
    ephemeris:
      "第四宫在{fourthSign}：这一刻家与休息的题会被拎到台前。",
    secondary:
      "第四宫在{fourthSign}：几年里「根扎哪」会慢慢浮出来，别急。",
    tertiary:
      "第四宫在{fourthSign}：近几周累了就先缩回被窝和饭桌。",
    solar_return:
      "第四宫在{fourthSign}：这一年给「心里踏实」留点预算。",
    lunar_return:
      "第四宫在{fourthSign}：这一小段先护家里人、护睡眠，再冲外面。",
  },
  8: {
    natal:
      "第四宫宫头位于{fourthSign}：私人生活、身体节律与居住体验的稳定，有助于降低外部压力向内的反噬风险。",
    synastry:
      "第四宫宫头位于{fourthSign}：案主对私密空间与内在安全感的需求，构成关系互动中的底层变量。",
    transit:
      "第四宫宫头位于{fourthSign}：当前阶段家庭、独处与身体恢复仍是重要的回血接口。",
    ephemeris:
      "第四宫宫头位于{fourthSign}：该时刻与家庭、休息及身体相关的主题易被强调。",
    secondary:
      "第四宫宫头位于{fourthSign}：数年内与「根基与居住」相关的议题可能逐步显现。",
    tertiary:
      "第四宫宫头位于{fourthSign}：近数周起居与情绪底色在该领域更为显著。",
    solar_return:
      "第四宫宫头位于{fourthSign}：该年度与内在安全及家庭主题相关的线索可能参与全年结构。",
    lunar_return:
      "第四宫宫头位于{fourthSign}：该短周期内睡眠、家人与私密空间更易牵动情绪，宜优先安顿。",
  },
  9: {
    natal: "【4宫】{fourthSign}·家底/节律/住处",
    synastry: "【案主4宫】{fourthSign}·私密底盘",
    transit: "【行运4宫】{fourthSign}·回血",
    ephemeris: "【时刻4宫】{fourthSign}·切片",
    secondary: "【次限4宫】{fourthSign}·年根",
    tertiary: "【三限4宫】{fourthSign}·短居",
    solar_return: "【日返4宫】{fourthSign}·年安",
    lunar_return: "【月返4宫】{fourthSign}·短歇",
  },
  10: {
    natal: "H4@{fourthSign}",
    synastry: "案主H4@{fourthSign}",
    transit: "行运H4@{fourthSign}",
    ephemeris: "时刻H4@{fourthSign}",
    secondary: "次限H4@{fourthSign}",
    tertiary: "三限H4@{fourthSign}",
    solar_return: "日返H4@{fourthSign}",
    lunar_return: "月返H4@{fourthSign}",
  },
};

type NonNatalSynKind = Exclude<K, "natal">;

const ONE_LINER_PATCH: Partial<Record<V, Partial<Record<NonNatalSynKind, string>>>> = {
  2: {
    synastry:
      "若只记一句：这屏是案主本命轮上的归纳；俩人怎么磨，要以合盘和双方档案说话，别拿主轮一笔勾销关系。",
    transit:
      "若只记一句：这是当下行运盘的归纳，用来对照本命长期配置；别把几天的爽或不爽写成终身判决书。",
    ephemeris:
      "若只记一句：这是指定时刻的归纳，只服务那个窗口的决定；人格与长期走向仍回出生盘。",
    secondary:
      "若只记一句：次限看几年慢变，像年景天气；人格底盘仍以本命为准，别用推进盘一次定终身。",
    tertiary:
      "若只记一句：三限看几周松紧，用来排程；身份与长期结构仍以本命为准。",
    solar_return:
      "若只记一句：日返像这一年的主题海报，帮你看侧重；别当每日指令，也要对照本命。",
    lunar_return:
      "若只记一句：月返像一小段起居与情绪提示，帮你看短窗；别当年度或终身结论。",
  },
  3: {
    synastry: "收束：案主轮归纳≠关系结论→合盘+双档。",
    transit: "收束：行运归纳→对照本命；禁终身判决书。",
    ephemeris: "收束：时刻归纳→单窗决策；终身→本命。",
    secondary: "收束：次限＝年景；终身结构→本命。",
    tertiary: "收束：三限＝短窗排程；身份→本命。",
    solar_return: "收束：日返＝年侧重提示；联立本命。",
    lunar_return: "收束：月返＝短窗提示；非年/终身。",
  },
  4: {
    synastry:
      "落幕提示：主轮写的是案主一个人的底盘；双人戏码，合盘里见，别把关系成败押在这一屏上。",
    transit:
      "落幕提示：行运是外景天象归纳；本命才是你 lifelong 的母带，别把几天当终审。",
    ephemeris:
      "落幕提示：时刻盘只服务这一场戏的决定；人生全书回出生盘翻。",
    secondary:
      "落幕提示：次限像年景预告片，人格还是本命那部正传。",
    tertiary:
      "落幕提示：三限像几周排练表，别拿来改身份证。",
    solar_return:
      "落幕提示：日返是年度海报，太阳的老故事还在本命。",
    lunar_return:
      "落幕提示：月返是小段花絮，别把花絮当全书结局。",
  },
  5: {
    synastry: "一句：主轮≠关系→合盘",
    transit: "一句：行运≠终身→本命",
    ephemeris: "一句：时刻≠终身",
    secondary: "一句：次限＝年景",
    tertiary: "一句：三限＝短窗",
    solar_return: "一句：日返＝年题",
    lunar_return: "一句：月返＝短",
  },
  6: {
    synastry:
      "执行备忘：本归纳基于案主本命轮；关系结论需合盘与双方档案交叉验证。",
    transit:
      "执行备忘：行运归纳用于对照本命长期配置；避免将短周期感受提升为终身定性。",
    ephemeris:
      "执行备忘：时刻归纳仅服务特定窗口决策；长期人格与结构仍以出生盘为参照。",
    secondary:
      "执行备忘：次限对应年尺度慢变；终身结构判断不应由单次推进盘替代。",
    tertiary:
      "执行备忘：三限对应短周期节律与排程；身份与长期结构仍以本命为准。",
    solar_return:
      "执行备忘：日返提供年度侧重点提示；宜与本命太阳主题联读。",
    lunar_return:
      "执行备忘：月返提供短周期起居与情绪提示；不宜外推为年度或终身结论。",
  },
  7: {
    synastry:
      "咱就记一句：这屏是案主自个儿的底盘归纳；俩人咋处，得看合盘，别用主轮给人判死刑。",
    transit:
      "咱就记一句：行运归纳是外面天象这层；你 lifelong 的谱还在本命，别把几天当盖棺。",
    ephemeris:
      "咱就记一句：时刻盘只管这一下子；一辈子的事回出生盘唠。",
    secondary:
      "咱就记一句：次限像年景，本命才是你这个人。",
    tertiary:
      "咱就记一句：三限像近几周排班表，别拿来改名分。",
    solar_return:
      "咱就记一句：日返像这一年的片花，太阳正传还在本命。",
    lunar_return:
      "咱就记一句：月返像一小段日记，别写成一辈子判决书。",
  },
  8: {
    synastry:
      "综合建议：本屏归纳限于案主本命轮结构；关系层面的结论需结合合盘与双方出生资料。",
    transit:
      "综合建议：行运盘面归纳用于对照本命之长期配置；应避免将短暂体验概括为终身定性。",
    ephemeris:
      "综合建议：指定时刻之归纳仅适用于该决策窗口；人格与长期走向仍以出生盘为主。",
    secondary:
      "综合建议：次限反映年尺度之缓慢演变；终身结构判断不应被单次推进结果替代。",
    tertiary:
      "综合建议：三限反映短周期之节律特征；宜用于排程，不宜用于改写长期身份叙事。",
    solar_return:
      "综合建议：日返可作为年度侧重点之参考；建议与本命材料交叉验证。",
    lunar_return:
      "综合建议：月返适用于短周期起居与情绪调度；不宜外推为年度或终身结论。",
  },
  9: {
    synastry: "【收束】主轮归纳｜关系→合盘",
    transit: "【收束】行运｜对照本命",
    ephemeris: "【收束】时刻｜单窗",
    secondary: "【收束】次限｜年景",
    tertiary: "【收束】三限｜短窗",
    solar_return: "【收束】日返｜年题",
    lunar_return: "【收束】月返｜短札",
  },
  10: {
    synastry: "收束:主轮≠双人→合盘",
    transit: "收束:行运→对本命",
    ephemeris: "收束:时刻→窗",
    secondary: "收束:次限→年",
    tertiary: "收束:三限→短",
    solar_return: "收束:日返→年",
    lunar_return: "收束:月返→短",
  },
};

type NatalTail = "sm_h" | "sm_nh" | "nsm_h" | "nsm_nh";

const NATAL_TAIL_PATCH: Partial<Record<V, Partial<Record<NatalTail, string>>>> = {
  2: {
    sm_h:
      "若只记一句：深里敢碰敢拼，对外却常被槛绊住；先把第四宫落在{fourthSign}的「家与底盘」理顺，比硬贴别人节拍省力。",
    sm_nh:
      "若只记一句：你爱往深度绑定上下劲，别拿碎事量自己有没有干劲；{fourthSign}这一侧稳了，深水劲才不容易反咬。",
    nsm_h:
      "若只记一句：心里想的和对外演的常不同步，别急着自我攻击；先把日常节律和第四宫落在{fourthSign}这边理顺，拉扯会降一档。",
    nsm_nh:
      "若只记一句：先看日月与上升怎么配，再啃相位表；同一套数据多角度切片，不必一口吞完。",
  },
  3: {
    sm_h: "收束：深冲/外槛→先稳4宫{fourthSign}底盘。",
    sm_nh: "收束：绑定劲→4宫{fourthSign}稳→防反噬。",
    nsm_h: "收束：内外异步→理顺4宫{fourthSign}+节律。",
    nsm_nh: "收束：先日月上升→再相位表。",
  },
  4: {
    sm_h:
      "落幕提示：里头有股敢拼的狠劲，外头却常被门槛拖住；先把{fourthSign}代表的家里与底盘收拾稳，再谈对齐别人。",
    sm_nh:
      "落幕提示：你的劲爱下在深度绑定上，别让琐事骗你说自己没动力；{fourthSign}稳了，深水才不乱翻。",
    nsm_h:
      "落幕提示：心里戏和对外戏老对不上，别先骂自己；把{fourthSign}与日常节律理顺，戏会松一点。",
    nsm_nh:
      "落幕提示：先读日月上升三角，再翻相位表；盘面是多机位同一场戏，别一次读完。",
  },
  5: {
    sm_h: "一句：深拼/外槛→稳4-{fourthSign}",
    sm_nh: "一句：绑定劲→4-{fourthSign}稳",
    nsm_h: "一句：内外拧→4-{fourthSign}+节律",
    nsm_nh: "一句：日月升→相位",
  },
  6: {
    sm_h:
      "执行备忘：内在行动驱力与外在门槛压力并存时，宜优先稳固第四宫（{fourthSign}）所代表之生活底盘与私密支持面。",
    sm_nh:
      "执行备忘：深度承诺议题易感突出时，建议同步检视第四宫（{fourthSign}）之稳定性以降低反噬风险。",
    nsm_h:
      "执行备忘：内在感受与外在表达出现异步时，宜先整理日常节律及第四宫（{fourthSign}）相关领域。",
    nsm_nh:
      "执行备忘：建议先核对日月与上升之主轴关系，再进入相位表细读；避免一次性完成全部判读。",
  },
  7: {
    sm_h:
      "咱就记一句：里头敢冲外头绊，先把{fourthSign}这头的家与底盘收拾顺，比跟人硬对齐省力。",
    sm_nh:
      "咱就记一句：劲爱往绑定上下，别用碎事怀疑自己；{fourthSign}稳了，深水里才不翻船。",
    nsm_h:
      "咱就记一句：心里想的面儿上演的对不上，先别骂自己；{fourthSign}和日子理顺了会松快些。",
    nsm_nh:
      "咱就记一句：先日月上升，再相位；一桌子菜别一口咽。",
  },
  8: {
    sm_h:
      "综合建议：若内在行动倾向与外在门槛压力并存，建议优先稳固与第四宫（{fourthSign}）相关之生活与私密支持结构。",
    sm_nh:
      "综合建议：深度承诺与责任议题易感突出时，建议同步关注第四宫（{fourthSign}）之稳定性。",
    nsm_h:
      "综合建议：当内在体验与外在表达出现不同步时，宜先整理节律及第四宫（{fourthSign}）所涉领域。",
    nsm_nh:
      "综合建议：建议先建立日月与上升之主轴理解，再进入相位表细读；数据应以多视角分步核对。",
  },
  9: {
    sm_h: "【收束】深拼/外槛→4宫{fourthSign}",
    sm_nh: "【收束】绑定→4宫{fourthSign}",
    nsm_h: "【收束】内外拧→4宫{fourthSign}",
    nsm_nh: "【收束】日月升→相位",
  },
  10: {
    sm_h: "收束:深/槛→4{fourthSign}",
    sm_nh: "收束:绑→4{fourthSign}",
    nsm_h: "收束:拧→4{fourthSign}",
    nsm_nh: "收束:日月中→相",
  },
};

const SUN_MARS_PATCH: Partial<Record<V, Partial<Record<K, string>>>> = {
  2: {
    natal:
      "太阳和火星挨得紧（{orb}°），落在{mid}——劲更爱往「一起扛、谈信任、谈资源怎么分」上冲，稀碎日常里反而不耐拖。",
    synastry:
      "案主本命太阳火星挨得紧（{orb}°），落在{mid}——案主本人爱把劲使在深度绑定上；双人谁踩这条线，看双人相位与互落宫。",
    transit:
      "行运太阳火星挨得紧（{orb}°），落在{mid}——这几天爱立 flag、抢节奏、当面说清楚；长期爱不爱硬顶，回本命太阳火星。",
    ephemeris:
      "该时刻太阳火星挨得紧（{orb}°），落在{mid}——快照里急火与行动感明显；牵不牵动你，看有没有挂本命。",
    secondary:
      "次限太阳火星挨得紧（{orb}°），落在{mid}——这几年「敢下注、敢扛责」会周期性抬头，用本命宫位看常落哪一域。",
    tertiary:
      "三限太阳火星挨得紧（{orb}°），落在{mid}——近几周面子、节奏、对错容易顶一下，别和终身脾气糊一句。",
    solar_return:
      "日返太阳火星挨得紧（{orb}°），落在{mid}——这一年竞赛感、抢进度、谈条件容易绑一起，配本命太阳读年打法。",
    lunar_return:
      "月返太阳火星挨得紧（{orb}°），落在{mid}——这一小段小事也容易上火想马上解决；本命月亮要的安稳另表。",
  },
  3: {
    natal: "日火紧合{orb}°·{mid}→深挖/绑定驱力；非琐事耗散型。",
    synastry: "案主日火{orb}°·{mid}→案主绑定驱力；双人→合盘。",
    transit: "行运日火{orb}°·{mid}→短窗抢节奏；长期→本命。",
    ephemeris: "时刻日火{orb}°·{mid}→快照急火。",
    secondary: "次限日火{orb}°·{mid}→年周期扛责峰。",
    tertiary: "三限日火{orb}°·{mid}→短窗顶牛。",
    solar_return: "日返日火{orb}°·{mid}→年竞赛感。",
    lunar_return: "月返日火{orb}°·{mid}→短上火。",
  },
  4: {
    natal:
      "太阳火星贴成一对（{orb}°），落在{mid}——劲往「一起扛、谈信任、谈怎么分」上烧，不爱在琐事里慢慢磨。",
    synastry:
      "案主盘上太阳火星贴成一对（{orb}°），落在{mid}——案主本人劲爱往绑定与承诺上使；双人场谁触发，合盘见。",
    transit:
      "行运太阳火星贴成一对（{orb}°），落在{mid}——这几天爱抢话、抢节奏；长期脾气回本命。",
    ephemeris:
      "这一刻太阳火星贴成一对（{orb}°），落在{mid}——现场一股急火；个人故事看挂没挂本命。",
    secondary:
      "次限太阳火星贴一对（{orb}°），落在{mid}——几年里周期性想扛大事。",
    tertiary:
      "三限太阳火星贴一对（{orb}°），落在{mid}——近几周爱顶、爱快。",
    solar_return:
      "日返太阳火星贴一对（{orb}°），落在{mid}——这一年爱赛、爱推进。",
    lunar_return:
      "月返太阳火星贴一对（{orb}°），落在{mid}——这一小段小事也想马上灭火。",
  },
  5: {
    natal: "日火{orb}°·{mid}·深挖劲",
    synastry: "案主日火{orb}·{mid}",
    transit: "行运日火{orb}·{mid}",
    ephemeris: "时刻日火{orb}·{mid}",
    secondary: "次限日火{orb}·{mid}",
    tertiary: "三限日火{orb}·{mid}",
    solar_return: "日返日火{orb}·{mid}",
    lunar_return: "月返日火{orb}·{mid}",
  },
  6: {
    natal:
      "观测：太阳与火星紧合（{orb}°）于{mid}；执行驱力倾向深度绑定与责任议题，而非琐事消耗。",
    synastry:
      "观测（案主）：日火紧合{orb}°·{mid}；双人触发→合盘。",
    transit:
      "观测（行运）：日火紧合{orb}°·{mid}；短窗节奏抬升。",
    ephemeris:
      "观测（时刻）：日火紧合{orb}°·{mid}；快照行动峰值。",
    secondary:
      "观测（次限）：日火紧合{orb}°·{mid}；年尺度扛责周期。",
    tertiary:
      "观测（三限）：日火紧合{orb}°·{mid}；短窗摩擦抬升。",
    solar_return:
      "观测（日返）：日火紧合{orb}°·{mid}；年度竞赛接口。",
    lunar_return:
      "观测（月返）：日火紧合{orb}°·{mid}；短周期急躁样本。",
  },
  7: {
    natal:
      "太阳跟火星黏得紧（{orb}°），落在{mid}——劲爱往「一起扛、谈信任、谈怎么分」上冒，不爱在鸡毛里耗。",
    synastry:
      "案主盘上太阳跟火星黏得紧（{orb}°），落在{mid}——案主本人劲往绑定上使；俩人谁顶到，合盘瞅。",
    transit:
      "行运太阳火星黏得紧（{orb}°），落在{mid}——这几天爱抢节奏、当面锣；长期回本命。",
    ephemeris:
      "就这一刻，太阳火星黏得紧（{orb}°），落在{mid}——当场一股急火。",
    secondary:
      "次限太阳火星黏得紧（{orb}°），落在{mid}——几年里周期性想扛大的。",
    tertiary:
      "三限太阳火星黏得紧（{orb}°），落在{mid}——近几周爱顶、爱快。",
    solar_return:
      "日返太阳火星黏得紧（{orb}°），落在{mid}——这一年爱赛、爱冲。",
    lunar_return:
      "月返太阳火星黏得紧（{orb}°），落在{mid}——这一小段小事也想立刻灭。",
  },
  8: {
    natal:
      "太阳与火星呈紧合（{orb}°），落于{mid}：行动驱力更易集中于深度绑定、信任与资源分配等议题，而非日常琐事之缓慢消耗。",
    synastry:
      "案主本命太阳与火星紧合（{orb}°），落于{mid}：案主倾向将精力配置于深度承诺领域；双人触发机制请参阅合盘。",
    transit:
      "行运太阳与火星紧合（{orb}°），落于{mid}：短周期内节奏与表达强度上升；长期偏好请回本命核对。",
    ephemeris:
      "指定时刻太阳与火星紧合（{orb}°），落于{mid}：该快照呈现较高行动与急切特征。",
    secondary:
      "次限太阳与火星紧合（{orb}°），落于{mid}：年尺度上易出现周期性承担责任之冲动。",
    tertiary:
      "三限太阳与火星紧合（{orb}°），落于{mid}：短周期内摩擦与节奏冲突更易显现。",
    solar_return:
      "日返太阳与火星紧合（{orb}°），落于{mid}：该年度竞争感与推进冲动可能同步升高。",
    lunar_return:
      "月返太阳与火星紧合（{orb}°），落于{mid}：短周期内小事亦易触发急切解决倾向。",
  },
  9: {
    natal: "【日火紧】{orb}°·{mid}",
    synastry: "【案主日火】{orb}·{mid}",
    transit: "【行运日火】{orb}·{mid}",
    ephemeris: "【时刻日火】{orb}·{mid}",
    secondary: "【次限日火】{orb}·{mid}",
    tertiary: "【三限日火】{orb}·{mid}",
    solar_return: "【日返日火】{orb}·{mid}",
    lunar_return: "【月返日火】{orb}·{mid}",
  },
  10: {
    natal: "日火{orb}+{mid}",
    synastry: "案主日火{orb}+{mid}",
    transit: "行运日火{orb}+{mid}",
    ephemeris: "时刻日火{orb}+{mid}",
    secondary: "次限日火{orb}+{mid}",
    tertiary: "三限日火{orb}+{mid}",
    solar_return: "日返日火{orb}+{mid}",
    lunar_return: "月返日火{orb}+{mid}",
  },
};

const SUN_MOON_PATCH: Partial<Record<V, Partial<Record<K, string>>>> = {
  2: {
    natal:
      "太阳在第{sunH}宫、月亮在第{moonH}宫：你想被看见的成就感和心里要的安全感，常常不在同一张台面上，先两边都点名，少互相误会。",
    synastry:
      "案主太阳在第{sunH}宫、月亮在第{moonH}宫：案主「想被看见」和「心里要稳」常分两块地；相处别只用一边量对方。",
    transit:
      "行运太阳在第{sunH}宫、月亮在第{moonH}宫：这几天亮眼与安顿的舞台不一定同一张；别用本命习惯硬判这几天。",
    ephemeris:
      "该时刻太阳在第{sunH}宫、月亮在第{moonH}宫：快照里成就与情绪接口各一块；没挂本命就别说成一生日月故事。",
    secondary:
      "次限太阳在第{sunH}宫、月亮在第{moonH}宫：几年里外在目标与内在安顿常慢迁拉扯，回本命日月看老剧本。",
    tertiary:
      "三限太阳在第{sunH}宫、月亮在第{moonH}宫：近几周小舞台和大感受可能错频，别一次升级到终身。",
    solar_return:
      "日返太阳在第{sunH}宫、月亮在第{moonH}宫：这一年对外发力与心情落脚点常不同宫；年题与起居分开记。",
    lunar_return:
      "月返太阳在第{sunH}宫、月亮在第{moonH}宫：这一小段白天想推的事和夜里要的安全感可能各一摊。",
  },
  3: {
    natal: "日{sunH}宫·月{moonH}宫→成就域≠安全感域；分头点名。",
    synastry: "案主日{sunH}月{moonH}→看见≠安稳；双人→合盘。",
    transit: "行运日{sunH}月{moonH}→短窗错频；禁硬套本命。",
    ephemeris: "时刻日{sunH}月{moonH}→切片双域。",
    secondary: "次限日{sunH}月{moonH}→年慢迁拉扯。",
    tertiary: "三限日{sunH}月{moonH}→短窗错频。",
    solar_return: "日返日{sunH}月{moonH}→年双落脚点。",
    lunar_return: "月返日{sunH}月{moonH}→短双摊。",
  },
  4: {
    natal:
      "太阳落在第{sunH}宫、月亮落在第{moonH}宫：你要的掌声和你要的安稳，常在两块地里各自长大。",
    synastry:
      "案主太阳{sunH}宫、月亮{moonH}宫：案主想被看见的方式和心里要的踏实，常分两路；别用一条路量完对方。",
    transit:
      "行运太阳{sunH}宫、月亮{moonH}宫：这几天外面想亮和里面想躲可能不同步。",
    ephemeris:
      "这一刻太阳{sunH}宫、月亮{moonH}宫：切片里成就与心情各演各的。",
    secondary:
      "次限太阳{sunH}宫、月亮{moonH}宫：几年里外在目标与内在安顿像慢火炖。",
    tertiary:
      "三限太阳{sunH}宫、月亮{moonH}宫：近几周小舞台和大感受爱打架。",
    solar_return:
      "日返太阳{sunH}宫、月亮{moonH}宫：这一年对外冲和心里歇可能各管一摊。",
    lunar_return:
      "月返太阳{sunH}宫、月亮{moonH}宫：这一小段白天冲、夜里怂都正常。",
  },
  5: {
    natal: "日{sunH}·月{moonH}·成就≠安",
    synastry: "案主日{sunH}月{moonH}",
    transit: "行运日{sunH}月{moonH}",
    ephemeris: "时刻日{sunH}月{moonH}",
    secondary: "次限日{sunH}月{moonH}",
    tertiary: "三限日{sunH}月{moonH}",
    solar_return: "日返日{sunH}月{moonH}",
    lunar_return: "月返日{sunH}月{moonH}",
  },
  6: {
    natal:
      "观测：太阳{sunH}宫、月亮{moonH}宫；成就关注与安全感关注可能分属不同生活域。",
    synastry:
      "观测（案主）：日{sunH}宫、月{moonH}宫；双人接口→合盘。",
    transit:
      "观测（行运）：日{sunH}宫、月{moonH}宫；短窗错频样本。",
    ephemeris:
      "观测（时刻）：日{sunH}宫、月{moonH}宫；切片双域。",
    secondary:
      "观测（次限）：日{sunH}宫、月{moonH}宫；年慢迁。",
    tertiary:
      "观测（三限）：日{sunH}宫、月{moonH}宫；短窗。",
    solar_return:
      "观测（日返）：日{sunH}宫、月{moonH}宫；年双落脚点。",
    lunar_return:
      "观测（月返）：日{sunH}宫、月{moonH}宫；短双摊。",
  },
  7: {
    natal:
      "太阳在第{sunH}宫、月亮在第{moonH}宫：你要的面儿和你要的踏实，常常不在一块地里。",
    synastry:
      "案主太阳{sunH}宫、月亮{moonH}宫：案主想被瞅见和想被接住，常分两路。",
    transit:
      "行运太阳{sunH}宫、月亮{moonH}宫：这几天外面想亮、里面想缩都可能对。",
    ephemeris:
      "这一刻太阳{sunH}宫、月亮{moonH}宫：当场成就与心情各演各的。",
    secondary:
      "次限太阳{sunH}宫、月亮{moonH}宫：几年里目标和心情像慢炖。",
    tertiary:
      "三限太阳{sunH}宫、月亮{moonH}宫：近几周小舞台和大感受爱掐。",
    solar_return:
      "日返太阳{sunH}宫、月亮{moonH}宫：这一年冲和歇可能各管一摊。",
    lunar_return:
      "月返太阳{sunH}宫、月亮{moonH}宫：这一小段白天冲夜里怂都常见。",
  },
  8: {
    natal:
      "太阳位于第{sunH}宫、月亮位于第{moonH}宫：成就导向与安全感导向可能分布于不同生活领域，宜分别命名与照顾。",
    synastry:
      "案主太阳位于第{sunH}宫、月亮位于第{moonH}宫：对外展示需求与内在稳定需求可能呈现为不同接口。",
    transit:
      "行运太阳位于第{sunH}宫、月亮位于第{moonH}宫：短周期内「被看见」与「被安顿」的舞台可能错频。",
    ephemeris:
      "指定时刻太阳位于第{sunH}宫、月亮位于第{moonH}宫：该快照中两类议题可能并行呈现。",
    secondary:
      "次限太阳位于第{sunH}宫、月亮位于第{moonH}宫：年尺度上外在目标与内在安顿可能呈慢迁拉扯。",
    tertiary:
      "三限太阳位于第{sunH}宫、月亮位于第{moonH}宫：短周期内易出现舞台与感受之错频。",
    solar_return:
      "日返太阳位于第{sunH}宫、月亮位于第{moonH}宫：该年度对外发力与情绪安顿之落脚点可能不同步。",
    lunar_return:
      "月返太阳位于第{sunH}宫、月亮位于第{moonH}宫：该短周期内昼夜议题可能分属不同生活块面。",
  },
  9: {
    natal: "【日月宫】{sunH}/{moonH}",
    synastry: "【案主日月宫】{sunH}/{moonH}",
    transit: "【行运日月宫】{sunH}/{moonH}",
    ephemeris: "【时刻日月宫】{sunH}/{moonH}",
    secondary: "【次限日月宫】{sunH}/{moonH}",
    tertiary: "【三限日月宫】{sunH}/{moonH}",
    solar_return: "【日返日月宫】{sunH}/{moonH}",
    lunar_return: "【月返日月宫】{sunH}/{moonH}",
  },
  10: {
    natal: "日H{sunH}月H{moonH}",
    synastry: "案主日H{sunH}月H{moonH}",
    transit: "行运日H{sunH}月H{moonH}",
    ephemeris: "时刻日H{sunH}月H{moonH}",
    secondary: "次限日H{sunH}月H{moonH}",
    tertiary: "三限日H{sunH}月H{moonH}",
    solar_return: "日返日H{sunH}月H{moonH}",
    lunar_return: "月返日H{sunH}月H{moonH}",
  },
};

function natalTailKey(sunMars: boolean, hasHardAngle: boolean): NatalTail {
  if (sunMars && hasHardAngle) return "sm_h";
  if (sunMars) return "sm_nh";
  if (hasHardAngle) return "nsm_h";
  return "nsm_nh";
}

export function readoutSynthesisAscMcLineVocal(
  voice: V,
  kind: K,
  ascSign: string,
  mcSign: string,
): string {
  const base = fillAscMc(SYNTHESIS_ASC_MC_LINE_TEMPLATE_ZH[kind], ascSign, mcSign);
  if (voice === 1) return base;
  const tpl = pick(ASC_MC_PATCH, voice, kind, SYNTHESIS_ASC_MC_LINE_TEMPLATE_ZH[kind]);
  return fillAscMc(tpl, ascSign, mcSign);
}

export function readoutSynthesisFourthLineVocal(voice: V, kind: K, fourthSign: string): string {
  const base = fillFourth(SYNTHESIS_FOURTH_LINE_TEMPLATE_ZH[kind], fourthSign);
  if (voice === 1) return base;
  const tpl = pick(FOURTH_PATCH, voice, kind, SYNTHESIS_FOURTH_LINE_TEMPLATE_ZH[kind]);
  return fillFourth(tpl, fourthSign);
}

export function readoutSynthesisSunMarsLineVocal(
  voice: V,
  kind: K,
  params: { orb: string; sunSignZh: string; houseTail: string },
): string {
  const base = sunMarsConjLineForKind(kind, params);
  if (voice === 1) return base;
  const { orb, sunSignZh, houseTail } = params;
  const mid = houseTail ? `${sunSignZh}、${houseTail}` : sunSignZh;
  const hit = SUN_MARS_PATCH[voice]?.[kind];
  return hit !== undefined ? fillSunMars(hit, orb, mid) : base;
}

export function readoutSynthesisSunMoonLineVocal(
  voice: V,
  kind: K,
  sunH: number,
  moonH: number,
): string {
  const base = sunMoonHousesLineForKind(kind, sunH, moonH);
  if (voice === 1) return base;
  const hit = SUN_MOON_PATCH[voice]?.[kind];
  return hit !== undefined ? fillSunMoon(hit, sunH, moonH) : base;
}

export function readoutSynthesisMajorAspectLineVocal(voice: V, kind: K, d: AstroAspectDatum): string {
  const core = majorAspectCoreLineZh(d);
  if (voice === 1) return majorAspectWrapForKind(kind, core);
  const tpl = READOUT_MAJOR_WRAP_PATCH[voice]?.[kind];
  if (tpl === undefined) return majorAspectWrapForKind(kind, core);
  return tpl.replaceAll("{core}", core);
}

export function readoutSynthesisFrictionLinesVocal(
  voice: V,
  kind: K,
  major: AstroAngleAspectDatum[] | undefined,
): string[] {
  if (!major?.length) return [];
  const sorted = [...major].sort((a, b) => a.orbDeg - b.orbDeg).slice(0, 2);
  return sorted.map((r) => {
    if (voice === 1) return axisFrictionLineForDatum(kind, r);
    const row = READOUT_FRICTION_ROW_PATCH[voice]?.[kind];
    if (!row) return axisFrictionLineForDatum(kind, r);
    const planet = PLANET_NAME_ZH[r.planet];
    const ax = r.axis === "asc" ? "上升" : "天顶";
    const t = aspectTypeLabelZh(r.type);
    const orb = r.orbDeg.toFixed(2);
    const hard = r.type === "square" || r.type === "opposition";
    const tpl = hard ? row.h : row.s;
    return tpl.replaceAll("{planet}", planet).replaceAll("{t}", t).replaceAll("{ax}", ax).replaceAll("{orb}", orb);
  });
}

export function readoutSynthesisMinorLineVocal(voice: V, kind: K, d: AstroAspectDatum): string {
  if (voice === 1) return minorSupplementLineForKind(kind, d);

  const na = PLANET_NAME_ZH[d.a];
  const nb = PLANET_NAME_ZH[d.b];
  const t = aspectTypeLabelZh(d.type);
  const orb = d.orbDeg.toFixed(2);
  const outer = isMinorOuterPlanetPair(d.a, d.b);
  const tailO = MINOR_TAIL_OUTER_VOICE[voice] ?? DEFAULT_MINOR_TAIL_OUTER;
  const tailI = MINOR_TAIL_INNER_VOICE[voice] ?? DEFAULT_MINOR_TAIL_INNER;

  if (outer) {
    switch (kind) {
      case "natal":
        return `次要相位里最紧的是 ${na}${t}${nb}（${orb}°）：${tailO}`;
      case "synastry":
        return `案主轮上次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailO}双人是否共振，看双人次要相位。`;
      case "transit":
        return `行运盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailO}`;
      case "ephemeris":
        return `该时刻次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailO}`;
      case "secondary":
        return `次限盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${minorProgOuterSuffix(voice, "secondary")}`;
      case "tertiary":
        return `三限盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${minorProgOuterSuffix(voice, "tertiary")}`;
      case "solar_return":
        return `日返盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${minorProgOuterSuffix(voice, "solar_return")}`;
      case "lunar_return":
        return `月返盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${minorProgOuterSuffix(voice, "lunar_return")}`;
      default:
        return `次要相位里最紧的是 ${na}${t}${nb}（${orb}°）：${tailO}`;
    }
  }

  switch (kind) {
    case "natal":
      return `次要相位里最紧的是 ${na}${t}${nb}（${orb}°）：${tailI}`;
    case "synastry":
      return `案主轮上次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailI}`;
    case "transit":
      return `行运盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailI}`;
    case "ephemeris":
      return `该时刻次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailI}`;
    case "secondary":
      return `次限盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${minorProgInnerPart(voice, "secondary", tailI)}`;
    case "tertiary":
      return `三限盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${minorProgInnerPart(voice, "tertiary", tailI)}`;
    case "solar_return":
      return `日返盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${minorProgInnerPart(voice, "solar_return", tailI)}`;
    case "lunar_return":
      return `月返盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${minorProgInnerPart(voice, "lunar_return", tailI)}`;
    default:
      return `次要相位里最紧的是 ${na}${t}${nb}（${orb}°）：${tailI}`;
  }
}

export function readoutSynthesisTailLineVocal(
  voice: V,
  kind: K,
  params: {
    sunMars: boolean;
    hasHardAngle: boolean;
    fourthSign: string;
  },
): string {
  const one = READOUT_SYNTHESIS_ONE_LINER_ZH[kind];
  if (one) {
    const base = one;
    if (voice === 1) return base;
    const alt = pick(ONE_LINER_PATCH, voice, kind as NonNatalSynKind, base);
    return alt;
  }
  const key = natalTailKey(params.sunMars, params.hasHardAngle);
  const baseNatal =
    params.sunMars && params.hasHardAngle
      ? `若只记一句：深层里有股敢碰敢拼的劲，对外却容易先被门槛拖住；先把第四宫落在${params.fourthSign}代表的「家里与底盘」收拾稳，比硬对齐别人的节奏更省力。`
      : params.hasHardAngle
        ? `若只记一句：心里想的和对外演的常常不同步，别急着自我攻击；先把日常节律和${params.fourthSign}这一侧理顺，很多拉扯会自然降一档。`
        : params.sunMars
          ? `若只记一句：你的发力点往往在「一起承担、一起下注」的深度议题上，别用琐碎去衡量自己有没有干劲；${params.fourthSign}稳了，深水的劲才不容易反噬。`
          : `若只记一句：先看日月与上升怎么配，再读相位表；盘面是同一套数据的多角度切片，不必一次读完。`;
  if (voice === 1) return baseNatal;
  const tpl = pick(NATAL_TAIL_PATCH, voice, key, baseNatal);
  return tpl.replaceAll("{fourthSign}", params.fourthSign);
}
