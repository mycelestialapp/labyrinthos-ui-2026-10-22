import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { AstroAngleAspectDatum, AstroAspectDatum, PlanetId } from "@/lib/astro-chart-wheel";
import { PLANET_NAME_ZH } from "@/lib/astro-chart-wheel";
import { aspectTypeLabelZh } from "@/lib/astro-aspect-type-label-zh";

/** 次要相位补充句：外行星两两成对（天王/海王/冥王）时用较长「压力尾句」分支。 */
export function isMinorOuterPlanetPair(a: PlanetId, b: PlanetId): boolean {
  const outer = (x: PlanetId) => x === "uranus" || x === "neptune" || x === "pluto";
  return outer(a) && outer(b);
}

/** 主相位核心句（不含盘型框） */
export function majorAspectCoreLineZh(d: AstroAspectDatum): string {
  const na = PLANET_NAME_ZH[d.a];
  const nb = PLANET_NAME_ZH[d.b];
  const t = aspectTypeLabelZh(d.type);
  const orb = d.orbDeg.toFixed(2);
  switch (d.type) {
    case "conjunction":
      return `${na}与${nb}贴得很近（${orb}°），两颗星的题目容易绑在一起出现。`;
    case "square":
    case "opposition":
      return `${na}与${nb}${t}（${orb}°），两边需求容易拉扯，记得轮流照顾。`;
    case "trine":
    case "sextile":
      return `${na}与${nb}${t}（${orb}°），这条线顺手时像自带润滑，不顺时也别神化它。`;
    default:
      return `${na}与${nb}${t}（${orb}°），属于盘面里值得留意的结构线。`;
  }
}

/** 声部 1 默认：把核心句包进八种盘型框 */
export function majorAspectWrapForKind(kind: ChartKindId, core: string): string {
  switch (kind) {
    case "natal":
      return core;
    case "synastry":
      return `${core}这说的是案主本命内部结构；两人之间是否咬得紧，请以双人相位与宫落为准。`;
    case "transit":
      return `行运盘内，${core}若要论踩你本命哪条线，请对行运与本命对照。`;
    case "ephemeris":
      return `这一时刻盘内，${core}只描述快照内部，不延长成人生结论。`;
    case "secondary":
      return `次限盘上，${core}几年尺度里反复冒头的主题往往跟这条线有关。`;
    case "tertiary":
      return `三限盘上，${core}近几周生活块里这条线会更容易被感觉到。`;
    case "solar_return":
      return `日返盘上，${core}这一年里这条线常出来抢戏。`;
    case "lunar_return":
      return `月返盘上，${core}这一小段里它会参与心情与起居的节奏。`;
    default:
      return core;
  }
}

/** 主相位一句：八种盘前缀/收束不同，核心仍保留相位类型语义 */
export function describeMajorAspectLineForKind(kind: ChartKindId, d: AstroAspectDatum): string {
  return majorAspectWrapForKind(kind, majorAspectCoreLineZh(d));
}

export function sunMarsConjLineForKind(
  kind: ChartKindId,
  p: { orb: string; sunSignZh: string; houseTail: string },
): string {
  const { orb, sunSignZh, houseTail } = p;
  const mid = houseTail ? `${sunSignZh}、${houseTail}` : sunSignZh;

  switch (kind) {
    case "natal":
      return `太阳与火星靠得很近（${orb}°），落在${mid}——干劲容易在「一起扛事、谈信任、谈资源怎么分」这类题目上被点着，而不是在日常琐事里慢慢耗。`;
    case "synastry":
      return `案主本命盘上太阳与火星靠得很近（${orb}°），落在${mid}——案主本人容易把劲往深度绑定与承诺上使；双人场里谁触发这条线，看双人相位与互落宫。`;
    case "transit":
      return `行运太阳与火星靠得很近（${orb}°），落在${mid}——这几天容易把劲往立flag、抢节奏、当面说清楚上使；长期爱不爱这样硬顶，回本命太阳与火星对读。`;
    case "ephemeris":
      return `该时刻太阳与火星靠得很近（${orb}°），落在${mid}——快照里一股急火与行动感明显；是否牵动你个人故事，取决于你有没有挂本命档案。`;
    case "secondary":
      return `次限盘上太阳与火星靠得很近（${orb}°），落在${mid}——这几年里「敢下注、敢扛责」的劲头容易周期性抬头，用本命宫位看常落在哪一域。`;
    case "tertiary":
      return `三限盘上太阳与火星靠得很近（${orb}°），落在${mid}——近几周容易在面子、节奏、对错上顶一下，别和终身脾气混成一句。`;
    case "solar_return":
      return `日返盘上太阳与火星靠得很近（${orb}°），落在${mid}——这一年里竞赛感、抢进度、谈条件容易绑在一起，配合本命太阳读年度打法。`;
    case "lunar_return":
      return `月返盘上太阳与火星靠得很近（${orb}°），落在${mid}——这一小段里小事也容易上火、想马上解决；本命月亮要的安稳另表。`;
    default:
      return `太阳与火星靠得很近（${orb}°），落在${mid}——干劲与行动感绑在一起，具体落点请对照宫位表。`;
  }
}

export function sunMoonHousesLineForKind(kind: ChartKindId, sunH: number, moonH: number): string {
  switch (kind) {
    case "natal":
      return `太阳落在第${sunH}宫、月亮落在第${moonH}宫：你要的成就感和心里要的安全感不一定在同一个场域，先把两边都点名，就不容易互相冤枉。`;
    case "synastry":
      return `案主太阳在第${sunH}宫、月亮在第${moonH}宫：案主「想被看见的方式」和「心里要的安全感」常在两块不同地里；双人相处时别只用其中一边衡量对方。`;
    case "transit":
      return `行运太阳在第${sunH}宫、月亮在第${moonH}宫：这几天「想亮眼」与「想安顿」的舞台不一定同一张；别用本命习惯硬判这几天对不对。`;
    case "ephemeris":
      return `该时刻太阳在第${sunH}宫、月亮在第${moonH}宫：快照里成就议题与情绪接口各在一块地里；不接出生盘就不必说成你一生的日月故事。`;
    case "secondary":
      return `次限太阳在第${sunH}宫、月亮在第${moonH}宫：这几年里外在目标与内在安顿常在两块慢迁的域里拉扯，回本命日月宫位看老剧本。`;
    case "tertiary":
      return `三限太阳在第${sunH}宫、月亮在第${moonH}宫：近几周小舞台和大感受可能错频，别一次升级到终身定性。`;
    case "solar_return":
      return `日返太阳在第${sunH}宫、月亮在第${moonH}宫：这一年对外发力与对内心情的落脚点常不在同一宫；年度主题与情绪起居分开记。`;
    case "lunar_return":
      return `月返太阳在第${sunH}宫、月亮在第${moonH}宫：这一小段里白天想推进的事和夜里要的安全感可能各管一摊；短周期而已。`;
    default:
      return `太阳落在第${sunH}宫、月亮落在第${moonH}宫：成就与安全感关注的场域不同，宜分头照顾。`;
  }
}

const AXIS_LABEL_ZH: Record<AstroAngleAspectDatum["axis"], string> = {
  asc: "上升",
  mc: "天顶",
};

/** 单条轴点主相位一句（用于综合结论等） */
export function axisFrictionLineForDatum(kind: ChartKindId, r: AstroAngleAspectDatum): string {
  const planet = PLANET_NAME_ZH[r.planet];
  const ax = AXIS_LABEL_ZH[r.axis];
  const t = aspectTypeLabelZh(r.type);
  const orb = r.orbDeg.toFixed(2);
  const hard = r.type === "square" || r.type === "opposition";
  switch (kind) {
    case "natal":
      return hard
        ? `${planet}${t}${ax}（${orb}°）偏紧：自我呈现、情绪或外界期待容易在这里卡住一下。`
        : `${planet}${t}${ax}（${orb}°）在盘面里很显眼，会参与你怎么被看见、怎么走出门。`;
    case "synastry":
      return hard
        ? `案主轮上${planet}${t}${ax}（${orb}°）偏紧：案主在门面或走向上容易在这里较劲；双人谁踩到这条线，合盘再对。`
        : `案主轮上${planet}${t}${ax}（${orb}°）显眼：案主「怎么被看见、往哪走」常会吃到这条线；双人场里谁顶到它，看双人相位。`;
    case "transit":
      return hard
        ? `行运${planet}${t}${ax}（${orb}°）偏紧：这几天出门、被点名或职业标签容易在这里顶住一下，本命轴仍回出生盘。`
        : `行运${planet}${t}${ax}（${orb}°）显眼：当下怎么亮相、往哪冲，这条线会掺一脚。`;
    case "ephemeris":
      return hard
        ? `该时刻${planet}${t}${ax}（${orb}°）偏紧：当场门面或走向容易拧一下。`
        : `该时刻${planet}${t}${ax}（${orb}°）显眼：这一瞬的亮相与走向感强。`;
    case "secondary":
      return hard
        ? `次限${planet}${t}${ax}（${orb}°）偏紧：几年里对外标签或出门路径容易周期性卡住。`
        : `次限${planet}${t}${ax}（${orb}°）显眼：慢迁里「怎么被看见」常与这条线有关。`;
    case "tertiary":
      return hard
        ? `三限${planet}${t}${ax}（${orb}°）偏紧：近几周门面或走向容易短拧一下。`
        : `三限${planet}${t}${ax}（${orb}°）显眼：近窗里亮相与走向会吃到这条线。`;
    case "solar_return":
      return hard
        ? `日返${planet}${t}${ax}（${orb}°）偏紧：这一年里出门、被看见或事业标签容易在这里顶住。`
        : `日返${planet}${t}${ax}（${orb}°）显眼：年度里怎么出门、怎么走，这条线常参与。`;
    case "lunar_return":
      return hard
        ? `月返${planet}${t}${ax}（${orb}°）偏紧：这一小段里出门感或外界期待容易别一下。`
        : `月返${planet}${t}${ax}（${orb}°）显眼：短周期里亮相与走向会带到这条线。`;
    default:
      return hard
        ? `${planet}${t}${ax}（${orb}°）偏紧：门面或走向容易在这里卡住一下。`
        : `${planet}${t}${ax}（${orb}°）显眼：参与你怎么被看见、怎么走出门。`;
  }
}

export function axisFrictionLinesForKind(
  kind: ChartKindId,
  major: AstroAngleAspectDatum[] | undefined,
): string[] {
  if (!major?.length) return [];
  const sorted = [...major].sort((a, b) => a.orbDeg - b.orbDeg);
  return sorted.slice(0, 2).map((r) => axisFrictionLineForDatum(kind, r));
}

export function minorSupplementLineForKind(kind: ChartKindId, d: AstroAspectDatum): string {
  const na = PLANET_NAME_ZH[d.a];
  const nb = PLANET_NAME_ZH[d.b];
  const t = aspectTypeLabelZh(d.type);
  const orb = d.orbDeg.toFixed(2);
  const outer = isMinorOuterPlanetPair(d.a, d.b);

  const tailOuter =
    "压力大时，直觉、想象或想躲一下的冲动容易被放大，拿来松一口气可以，别当成唯一决策依据。";
  const tailInner = "像背景里的细线，小事里会冒出来提醒你。";

  if (outer) {
    switch (kind) {
      case "natal":
        return `次要相位里最紧的是 ${na}${t}${nb}（${orb}°）：${tailOuter}`;
      case "synastry":
        return `案主轮上次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailOuter}双人是否共振，看双人次要相位。`;
      case "transit":
        return `行运盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailOuter}`;
      case "ephemeris":
        return `该时刻次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailOuter}`;
      case "secondary":
        return `次限盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：几年里背景压力上来时，这条细线容易被听见。`;
      case "tertiary":
        return `三限盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：近几周小事里这条线爱露头。`;
      case "solar_return":
        return `日返盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：这一年里低潮时这条背景线会放大感受。`;
      case "lunar_return":
        return `月返盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：这一小段里情绪波动时它常插话。`;
      default:
        return `次要相位里最紧的是 ${na}${t}${nb}（${orb}°）：${tailOuter}`;
    }
  }

  switch (kind) {
    case "natal":
      return `次要相位里最紧的是 ${na}${t}${nb}（${orb}°）：${tailInner}`;
    case "synastry":
      return `案主轮上次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailInner}`;
    case "transit":
      return `行运盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailInner}`;
    case "ephemeris":
      return `该时刻次要相位最紧的是 ${na}${t}${nb}（${orb}°）：${tailInner}`;
    case "secondary":
      return `次限盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：慢迁里${tailInner}`;
    case "tertiary":
      return `三限盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：近窗里${tailInner}`;
    case "solar_return":
      return `日返盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：年度叙事里${tailInner}`;
    case "lunar_return":
      return `月返盘次要相位最紧的是 ${na}${t}${nb}（${orb}°）：小段周期里${tailInner}`;
    default:
      return `次要相位里最紧的是 ${na}${t}${nb}（${orb}°）：${tailInner}`;
  }
}
