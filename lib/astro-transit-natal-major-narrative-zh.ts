import type {
  AspectType,
  AstroChartWheelData,
  AstroTransitNatalAspectDatum,
  PlanetId,
} from "@/lib/astro-chart-wheel";
import { PLANET_NAME_ZH } from "@/lib/astro-chart-wheel";
import { aspectTypeLabelZh } from "@/lib/astro-aspect-type-label-zh";

function findTN(
  rows: AstroTransitNatalAspectDatum[],
  transit: PlanetId,
  natal: PlanetId,
  type: AspectType,
): AstroTransitNatalAspectDatum | null {
  return rows.find((r) => r.transit === transit && r.natal === natal && r.type === type) ?? null;
}

function orbStr(d: AstroTransitNatalAspectDatum): string {
  return d.orbDeg.toFixed(2);
}

function aspectKey(a: AstroTransitNatalAspectDatum): string {
  return `${a.transit}\0${a.natal}\0${a.type}`;
}

/** \u58f0\u90e8 1 \u9ed8\u8ba4\u6536\u675f\uff1b2\u201310 \u89c1 `astro-transit-natal-major-narrative-voice-zh` */
export const TRANSIT_NATAL_MAJOR_NARRATIVE_CLOSING_ZH =
  "先按上面读到的交会点辨认压力与顺出口；真要定调，留一句给自己复核的余地，别把一口气赌在一天上。";

function planetZh(id: PlanetId): string {
  return PLANET_NAME_ZH[id] ?? id;
}

type PriorClause = { id: string; text: string; keys: string[] };

function genericTransitNatalClause(a: AstroTransitNatalAspectDatum, variant: number): string {
  const t = planetZh(a.transit);
  const n = planetZh(a.natal);
  const lab = aspectTypeLabelZh(a.type);
  const o = orbStr(a);
  const v = variant % 3;

  if (a.transit === a.natal) {
    return [

      `行运${t}与本命${t}形成${lab}（容许约 ${o} 度），像在同一条绳上自己挝自己：先别用一句话把日子钉死，留一点复核余地。`,
      `行运${t}回到本命${t}的${lab}（容许约 ${o} 度），体感上容易「自我较劲」：把承诺放慢半步，先把睡眠与节奏稳住。`,
      `行运${t}对本命${t}成${lab}（容许约 ${o} 度），更像是内在口径在打架：少当场拍板，先把事实与感受分开写清。`,
    ][v];
  }

  if (a.type === "square" || a.type === "opposition") {
    return [
      `行运${t}与本命${n}成${lab}（容许约 ${o} 度），张力会被放大：先辨认哪里在急、哪里在扛，再决定要不要当场表态。`,
      `行运${t}压到本命${n}的${lab}（容许约 ${o} 度），像两条线拧在一起：把「必须现在解决」的念头先降一档。`,
      `行运${t}与本命${n}的${lab}（容许约 ${o} 度）带来硬碰口感：沟通留余地，别把面子与事实捆死在同一句里。`,
    ][v];
  }

  if (a.type === "trine" || a.type === "sextile") {
    return [
      `行运${t}与本命${n}成${lab}（容许约 ${o} 度），顺流更明显：把力气用在「把事情推进一小步」，别贪一口吃满。`,
      `行运${t}与本命${n}的${lab}（容许约 ${o} 度）像开了辅助轮：适合修补关系与流程，但别因此忽略底线。`,
      `行运${t}照到本命${n}的${lab}（容许约 ${o} 度），手感偏顺：抓住窗口把该对齐的对齐，别只停在感觉良好。`,
    ][v];
  }

  if (a.type === "conjunction") {
    return [
      `行运${t}与本命${n}合相（容许约 ${o} 度），主题会被「叠在一起」：先分清哪些是旧脚本、哪些是新事实。`,
      `行运${t}贴上本命${n}（容许约 ${o} 度），故事线会变得更显眼：把关键词写下来，比在心里反复更省力气。`,
      `行运${t}与本命${n}在同一刻度（容许约 ${o} 度）：别急着贴标签，先把「我想要什么结果」说具体。`,
    ][v];
  }

  return `行运${t}与本命${n}成${lab}（容许约 ${o} 度），把感受与动作拆开半步，再决定下一步。`;
}

function buildPriorQueue(rows: AstroTransitNatalAspectDatum[]): PriorClause[] {
  const q: PriorClause[] = [];
  const nepSn = findTN(rows, "neptune", "south_node", "square");
  const nepNn = findTN(rows, "neptune", "north_node", "square");

  if (nepSn && nepNn) {
    q.push({
      id: "nep",
      text: `海王星同时与本命南交点、北交点形成四分（容许分别约 ${orbStr(
          nepSn,
        )} 度 / ${orbStr(nepNn)} 度），叙事与边界容易被「泡软」：这几天少做口头大包大揽，重要约定落字或留复核。`,
      keys: [aspectKey(nepSn), aspectKey(nepNn)],
    });
  } else if (nepSn) {
    q.push({
      id: "nep",
      text: `海王星四分本命南交点（容许约 ${orbStr(
          nepSn,
        )} 度），旧习惯里的含糊会被放大：遇到「好像可以」的邀请，先问一句代价与期限。`,
      keys: [aspectKey(nepSn)],
    });
  } else if (nepNn) {
    q.push({
      id: "nep",
      text: `海王星四分本命北交点（容许约 ${orbStr(
          nepNn,
        )} 度），方向感容易发雾：别用感觉代替计划，把下一步拆成可检查的小动作。`,
      keys: [aspectKey(nepNn)],
    });
  }

  const mv = findTN(rows, "mars", "venus", "square");
  if (mv) {
    q.push({
      id: "mars",
      text: `火星与本命金星四分（容许约 ${orbStr(
          mv,
        )} 度），欲望与节奏容易不同步：亲密关系与工作协作里，先降语速再谈条件。`,
      keys: [aspectKey(mv)],
    });
  }

  const uc = findTN(rows, "uranus", "chiron", "square");
  if (uc) {
    q.push({
      id: "uc",
      text: `天王星与本命凯龙四分（容许约 ${orbStr(
          uc,
        )} 度），旧伤触点可能被意外事件碰到：给自己留退出与暂停的选项，不必当场解释清楚。`,
      keys: [aspectKey(uc)],
    });
  }

  const sp = findTN(rows, "saturn", "pluto", "square");
  if (sp) {
    q.push({
      id: "sp",
      text: `土星与本命冥王星四分（容许约 ${orbStr(
          sp,
        )} 度），结构压力与执念容易顶牛：把「必须控制」的范围缩小到一件具体小事。`,
      keys: [aspectKey(sp)],
    });
  }

  const vNn = findTN(rows, "venus", "north_node", "trine");
  const vSn = findTN(rows, "venus", "south_node", "sextile");
  if (vNn && vSn) {
    q.push({
      id: "ven",
      text: `金星与本命北交三合、与南交六合（容许约 ${orbStr(
          vNn,
        )} 度 / ${orbStr(vSn)} 度），关系与审美议题会被轻轻向前推：适合修补语气与仪式感，不贪一步登天。`,
      keys: [aspectKey(vNn), aspectKey(vSn)],
    });
  } else if (vNn) {
    q.push({
      id: "ven",
      text: `金星与本命北交三合（容许约 ${orbStr(
          vNn,
        )} 度），合作与价值取向更容易对齐：把「我喜欢」翻译成「我可以给什么」。`,
      keys: [aspectKey(vNn)],
    });
  } else if (vSn) {
    q.push({
      id: "ven",
      text: `金星与本命南交六合（容许约 ${orbStr(
          vSn,
        )} 度），旧舒适区里的甜头会招手：享受可以，但别用它替代表态与边界。`,
      keys: [aspectKey(vSn)],
    });
  }

  const nj = findTN(rows, "neptune", "jupiter", "conjunction");
  if (nj) {
    q.push({
      id: "nj",
      text: `海王星与本命木星合相（容许约 ${orbStr(
          nj,
        )} 度），期待容易被放大：花钱、承诺、信仰三类事先设上限，再谈投入。`,
      keys: [aspectKey(nj)],
    });
  }

  return q;
}

function minorTransitNatalClause(a: AstroTransitNatalAspectDatum, variant: number): string {
  const t = planetZh(a.transit);
  const n = planetZh(a.natal);
  const lab = aspectTypeLabelZh(a.type);
  const o = orbStr(a);
  const v = variant % 3;

  if (a.type === "square" || a.type === "opposition") {
    return [
      `次要：行运${t}${lab}本命${n}（容许约 ${o} 度），像背景里的细刺：不必戏剧化，但别完全忽略身体与日程信号。`,
      `次要：行运${t}对本命${n}${lab}（容许约 ${o} 度），小事也可能连环：把提醒与备份当作礼貌，不是迷信。`,
      `次要：行运${t}与本命${n}的${lab}（容许约 ${o} 度），压力偏「慢性」：用固定时段处理，比一直悬在心上更省。`,
    ][v];
  }

  if (a.type === "trine" || a.type === "sextile") {
    return [
      `次要：行运${t}${lab}本命${n}（容许约 ${o} 度），小顺流可用来修细节：整理、对齐、补课都合适。`,
      `次要：行运${t}对本命${n}${lab}（容许约 ${o} 度），适合把话说圆、把关系磨顺，不贪大动作。`,
      `次要：行运${t}与本命${n}的${lab}（容许约 ${o} 度），手感偏轻：抓住一个具体小目标完成它。`,
    ][v];
  }

  if (a.type === "conjunction") {
    return [
      `次要：行运${t}贴近本命${n}（容许约 ${o} 度），主题会多一层叠影：先观察一周再定调。`,
      `次要：行运${t}与本命${n}合相（容许约 ${o} 度），像多开了一条支线：记录触发点比急着解释更有用。`,
      `次要：行运${t}叠上本命${n}（容许约 ${o} 度），信息密度偏高：把「事实 / 推测 / 感受」分三行写。`,
    ][v];
  }

  return `次要：行运${t}${lab}本命${n}（容许约 ${o} 度），当作背景噪声调校日程即可。`;
}


/**
 * \u884c\u8fd0\u00d7\u672c\u547d\uff1a\u4e3b\u76f8\u4f4d\u53d9\u4e8b\u6b63\u6587\uff08L1+L2 \u6df7\u6392\uff09\u3002
 */
export function buildTransitNatalMajorNarrativeBodyZh(chart: AstroChartWheelData): string | null {
  const majorRows = chart.transitNatalAspects ?? [];
  if (majorRows.length === 0) return null;

  const minorRows = chart.transitNatalMinorAspects ?? [];
  const hasMinor = minorRows.length > 0;

  const MAX_MAJOR_SENTENCES = hasMinor ? 7 : 6;
  const MAX_MINOR_SENTENCES = hasMinor ? 4 : 0;
  const MAX_SPECIAL_SENTENCES = hasMinor ? 5 : 4;

  const consumed = new Set<string>();
  const majorParts: string[] = [];

  const priorQueue = buildPriorQueue(majorRows);
  const pickedPrior = priorQueue.slice(0, MAX_SPECIAL_SENTENCES);
  for (const p of pickedPrior) {
    majorParts.push(p.text);
    for (const k of p.keys) consumed.add(k);
  }

  const hardFirst = (a: AstroTransitNatalAspectDatum) => (a.type === "square" || a.type === "opposition" ? 0 : 1);
  const remaining = [...majorRows]
    .filter((a) => !consumed.has(aspectKey(a)))
    .sort((a, b) => hardFirst(a) - hardFirst(b) || a.orbDeg - b.orbDeg);

  for (let i = 0; i < remaining.length && majorParts.length < MAX_MAJOR_SENTENCES; i++) {
    majorParts.push(genericTransitNatalClause(remaining[i]!, i));
    consumed.add(aspectKey(remaining[i]!));
  }

  const minorParts: string[] = [];
  if (hasMinor && MAX_MINOR_SENTENCES > 0) {
    const hardMinor = [...minorRows]
      .filter((a) => a.type === "square" || a.type === "opposition")
      .sort((a, b) => a.orbDeg - b.orbDeg);
    const softMinor = [...minorRows]
      .filter((a) => a.type === "trine" || a.type === "sextile")
      .sort((a, b) => a.orbDeg - b.orbDeg);
    const conjMinor = [...minorRows]
      .filter((a) => a.type === "conjunction")
      .sort((a, b) => a.orbDeg - b.orbDeg);

    const picked: AstroTransitNatalAspectDatum[] = [];
    picked.push(...hardMinor.slice(0, 2));
    if (picked.length < MAX_MINOR_SENTENCES) picked.push(...softMinor.slice(0, 1));
    if (picked.length < MAX_MINOR_SENTENCES) picked.push(...conjMinor.slice(0, 1));

    if (picked.length < MAX_MINOR_SENTENCES) {
      const allSorted = [...minorRows].sort((a, b) => a.orbDeg - b.orbDeg);
      for (const a of allSorted) {
        if (picked.length >= MAX_MINOR_SENTENCES) break;
        if (picked.some((x) => aspectKey(x) === aspectKey(a))) continue;
        picked.push(a);
      }
    }

    for (let i = 0; i < picked.length; i++) {
      minorParts.push(minorTransitNatalClause(picked[i]!, i));
    }
  }

  if (majorParts.length === 0) return null;

  const parts: string[] = [];
  parts.push(majorParts.join(""));
  if (minorParts.length > 0) {
    parts.push(`\n\n${minorParts.join("")}`);
  }
  return parts.join("");
}

export function buildTransitNatalMajorNarrativeZh(chart: AstroChartWheelData): string | null {
  const body = buildTransitNatalMajorNarrativeBodyZh(chart);
  if (!body) return null;
  return body + TRANSIT_NATAL_MAJOR_NARRATIVE_CLOSING_ZH;
}
