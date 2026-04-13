import { fillCopyTemplate } from "@/lib/astro-copy-template-fill";
import { planetPositionsCopyForChartKind } from "@/lib/astro-observation-main-copy-by-chart-kind-zh";
import { DEFAULT_ANSWER_ROUTING_CONFIG } from "@/lib/astro-answer-routing-config";
import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { applyPlanetPositionsChartKindLayer } from "@/lib/astro-observation-five-chart-kind-layer-zh";
import {
  formatLongitudeInSignZh,
  houseNumberForLongitude,
  PLANET_NAME_ZH,
  type AstroChartWheelData,
  type AstroPlanetDatum,
  type PlanetId,
} from "@/lib/astro-chart-wheel";

export type PlanetPositionsObservationReport = {
  statusLine: string;
  answer: {
    happened: string;
    core: string;
    risk: string;
    today: string;
  };
  pro: {
    sunMars: string | null;
    moonVenus: string | null;
    mercuryJupiter: string;
  };
  precision: {
    matrix: string;
    clusters: Array<{ title: string; lines: string[] }>;
  };
  actions: [string, string, string];
};

const CANON: PlanetId[] = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "north_node",
  "south_node",
  "chiron",
];

const PLANET_EN_TAG: Record<PlanetId, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mer",
  venus: "Ven",
  mars: "Mar",
  jupiter: "Jup",
  saturn: "Sat",
  uranus: "Ura",
  neptune: "Nep",
  pluto: "Plu",
  north_node: "NN",
  south_node: "SN",
  chiron: "Chi",
};

function oppositeHouses(a: number, b: number): boolean {
  return Math.abs(a - b) === 6;
}

function planetRank(p: PlanetId): number {
  const i = CANON.indexOf(p);
  return i < 0 ? 99 : i;
}

function sortPlanetsByCanon(list: AstroPlanetDatum[]): AstroPlanetDatum[] {
  return [...list].sort((a, b) => planetRank(a.id) - planetRank(b.id));
}

function hasConjunction(chart: AstroChartWheelData, x: PlanetId, y: PlanetId): boolean {
  return (chart.aspects ?? []).some(
    (a) =>
      a.type === "conjunction" &&
      ((a.a === x && a.b === y) || (a.a === y && a.b === x)),
  );
}

function oneLineBody(p: AstroPlanetDatum, house: number): string {
  const pos = formatLongitudeInSignZh(p.lonDeg).text;
  return `${PLANET_NAME_ZH[p.id]}${pos}（${house}宫）`;
}

function planetTail(pid: PlanetId, C: ReturnType<typeof planetPositionsCopyForChartKind>): string {
  return C.planetTail[pid] ?? "读数尾注：该星体在本盘中的侧重。";
}

function contiguousRanges(houses: number[]): Array<[number, number]> {
  const u = [...new Set(houses)].sort((a, b) => a - b);
  if (u.length === 0) return [];
  const out: Array<[number, number]> = [];
  let lo = u[0]!;
  let hi = u[0]!;
  for (let i = 1; i < u.length; i++) {
    const x = u[i]!;
    if (x === hi + 1) {
      hi = x;
    } else {
      out.push([lo, hi]);
      lo = hi = x;
    }
  }
  out.push([lo, hi]);
  return out;
}

function clusterTitle(lo: number, hi: number, C: ReturnType<typeof planetPositionsCopyForChartKind>): string {
  if (lo === hi) {
    const name = C.houseShort[lo] ?? `${lo}宫`;
    return `${name}集群（${lo} 宫）`;
  }
  const a = C.houseShort[lo] ?? `${lo}宫`;
  const b = C.houseShort[hi] ?? `${hi}宫`;
  return `${a}与${b}串联带（${lo}-${hi} 宫）`;
}

export function buildPlanetPositionsObservationReport(
  chart: AstroChartWheelData | null,
  chartKind: ChartKindId = "natal",
  voiceStyleId: VoiceStyleIdZh = 1,
): PlanetPositionsObservationReport | null {
  if (!chart || !chart.houseCuspsLonDeg || chart.houseCuspsLonDeg.length !== 12) return null;
  const planets = chart.planets ?? [];
  if (planets.length === 0) return null;

  const C = planetPositionsCopyForChartKind(chartKind, voiceStyleId);
  const hk = DEFAULT_ANSWER_ROUTING_CONFIG.houseKeywordMap;

  const rows = planets.map((p) => ({
    p,
    house: houseNumberForLongitude(p.lonDeg, chart.houseCuspsLonDeg),
  }));

  const countByHouse = new Map<number, number>();
  for (const { house } of rows) {
    countByHouse.set(house, (countByHouse.get(house) ?? 0) + 1);
  }
  const ranked = [...countByHouse.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  const h1 = ranked[0]![0];
  const h2 = ranked[1]?.[0] ?? h1;
  const singlePeak = ranked.length === 1;

  const theme = (h: number) => C.housePoetic[h] ?? hk[h] ?? `${h}宫核心议题`;
  const shortN = (h: number) => C.houseShort[h] ?? `${h}宫`;

  let happened: string;
  if (singlePeak) {
    happened = fillCopyTemplate(C.answer.happenedSinglePeakTemplate, {
      themeA: theme(h1),
      h: String(h1),
    });
  } else if (oppositeHouses(h1, h2)) {
    happened = fillCopyTemplate(C.answer.happenedOppositeTemplate, {
      themeA: theme(h1),
      themeB: theme(h2),
    });
  } else {
    happened = fillCopyTemplate(C.answer.happenedDualTemplate, {
      themeA: theme(h1),
      themeB: theme(h2),
    });
  }

  let core: string;
  if (singlePeak) {
    core = fillCopyTemplate(C.answer.coreSingleTemplate, {
      h: String(h1),
      n: shortN(h1),
      archetype: C.answer.coreSingleArchetype,
    });
  } else {
    core = fillCopyTemplate(C.answer.coreTemplate, {
      h1: String(h1),
      h2: String(h2),
      n1: shortN(h1),
      n2: shortN(h2),
      archetype: fillCopyTemplate(C.answer.coreArchetypeGeneric, {
        n1: shortN(h1),
        n2: shortN(h2),
      }),
    });
  }

  const sun = rows.find((r) => r.p.id === "sun");
  const mars = rows.find((r) => r.p.id === "mars");
  const moon = rows.find((r) => r.p.id === "moon");
  const venus = rows.find((r) => r.p.id === "venus");
  const mercury = rows.find((r) => r.p.id === "mercury");
  const jupiter = rows.find((r) => r.p.id === "jupiter");

  let risk: string;
  const sunMarsConj = sun && mars && hasConjunction(chart, "sun", "mars");
  if (sunMarsConj && sun.house === 8 && mars!.house === 8) {
    risk = C.answer.riskSunMarsConjunction8;
  } else if (sun && mars && sun.house === mars.house) {
    risk = fillCopyTemplate(C.answer.riskSunMarsSameHouse, { h: String(sun.house) });
  } else if (moon && venus && moon.house === venus.house) {
    risk = fillCopyTemplate(C.answer.riskMoonVenusSameHouse, { h: String(moon.house) });
  } else if (singlePeak) {
    risk = C.answer.riskSinglePeak;
  } else {
    risk = fillCopyTemplate(C.answer.riskGeneric, {
      n1: shortN(h1),
      n2: shortN(h2),
    });
  }

  const today = singlePeak
    ? fillCopyTemplate(C.answer.todaySinglePeak, { h: String(h1) })
    : fillCopyTemplate(C.answer.todayLayered, { h1: String(h1), h2: String(h2) });

  let sunMars: string | null = null;
  if (sun || mars) {
    let suffix: string;
    let houseTheme: string;
    let sunLine: string;
    let marsLine: string;
    if (sun && mars) {
      suffix =
        sun.house === mars.house
          ? `${formatLongitudeInSignZh(sun.p.lonDeg).signZh} ${sun.house}宫`
          : `${sun.house}宫 × ${mars.house}宫`;
      houseTheme = theme(sun.house === mars.house ? sun.house : h1);
      sunLine = oneLineBody(sun.p, sun.house);
      marsLine = oneLineBody(mars.p, mars.house);
    } else if (sun) {
      suffix = `${formatLongitudeInSignZh(sun.p.lonDeg).signZh} ${sun.house}宫 · 仅太阳`;
      houseTheme = theme(sun.house);
      sunLine = oneLineBody(sun.p, sun.house);
      marsLine = "火星未纳入本表";
    } else {
      const m = mars!;
      suffix = `${formatLongitudeInSignZh(m.p.lonDeg).signZh} ${m.house}宫 · 仅火星`;
      houseTheme = theme(m.house);
      sunLine = "太阳未纳入本表";
      marsLine = oneLineBody(m.p, m.house);
    }
    const core = fillCopyTemplate(C.pro.sunMarsBodyCoreTemplate, { houseTheme, sunLine, marsLine });
    sunMars = `1. 意志与行动中轴（太阳 & 火星 / ${suffix}）：${core}`;
  }

  let moonVenus: string | null = null;
  if (moon || venus) {
    let suffix: string;
    let houseTheme: string;
    let moonLine: string;
    let venusLine: string;
    if (moon && venus) {
      const same = moon.house === venus.house;
      suffix = same ? `${moon.house}宫同域` : `${moon.house}宫 × ${venus.house}宫`;
      houseTheme = theme(same ? moon.house : h1);
      moonLine = oneLineBody(moon.p, moon.house);
      venusLine = oneLineBody(venus.p, venus.house);
    } else if (moon) {
      suffix = `${moon.house}宫 · 仅月亮`;
      houseTheme = theme(moon.house);
      moonLine = oneLineBody(moon.p, moon.house);
      venusLine = "金星未纳入本表";
    } else {
      const v = venus!;
      suffix = `${v.house}宫 · 仅金星`;
      houseTheme = theme(v.house);
      moonLine = "月亮未纳入本表";
      venusLine = oneLineBody(v.p, v.house);
    }
    const core = fillCopyTemplate(C.pro.moonVenusBodyCoreTemplate, { houseTheme, moonLine, venusLine });
    moonVenus = `2. 情绪与审美反馈（月亮 & 金星 / ${suffix}）：${core}`;
  }

  let mercuryJupiter: string;
  if (mercury && jupiter) {
    mercuryJupiter = `${C.pro.mercuryJupiterTitle}\n${fillCopyTemplate(C.pro.mercuryLineTemplate, {
      mercuryLine: oneLineBody(mercury.p, mercury.house),
    })}\n${fillCopyTemplate(C.pro.jupiterLineTemplate, {
      jupiterLine: oneLineBody(jupiter.p, jupiter.house),
      jupiterTheme: shortN(jupiter.house),
    })}`;
  } else if (mercury) {
    mercuryJupiter = `${C.pro.mercuryJupiterTitle}\n${fillCopyTemplate(C.pro.mercuryLineTemplate, {
      mercuryLine: oneLineBody(mercury.p, mercury.house),
    })}\n${C.pro.jupiterOnlyFallback}`;
  } else if (jupiter) {
    mercuryJupiter = `${C.pro.mercuryJupiterTitle}\n${C.pro.mercuryOnlyFallback}\n${fillCopyTemplate(C.pro.jupiterLineTemplate, {
      jupiterLine: oneLineBody(jupiter.p, jupiter.house),
      jupiterTheme: shortN(jupiter.house),
    })}`;
  } else {
    mercuryJupiter = `${C.pro.mercuryJupiterTitle}\n${C.pro.mercuryJupiterMissing}`;
  }

  const housesOccupied = [...countByHouse.keys()].sort((a, b) => a - b);
  const ranges = contiguousRanges(housesOccupied);
  const byHouse = new Map<number, AstroPlanetDatum[]>();
  for (const { p, house } of rows) {
    const arr = byHouse.get(house) ?? [];
    arr.push(p);
    byHouse.set(house, arr);
  }
  const clusters = ranges.map(([lo, hi]) => {
    const title = clusterTitle(lo, hi, C);
    const lines: string[] = [];
    for (let h = lo; h <= hi; h++) {
      const list = sortPlanetsByCanon(byHouse.get(h) ?? []);
      for (const p of list) {
        const tag = PLANET_EN_TAG[p.id];
        const pos = formatLongitudeInSignZh(p.lonDeg).text;
        lines.push(`[${tag}] ${pos}（${h}宫）：${planetTail(p.id, C)}`);
      }
    }
    return { title, lines };
  });

  const sunMarsHint =
    sun && mars
      ? `日火在${sun.house === mars.house ? `同${sun.house}宫` : `${sun.house}宫与${mars.house}宫`}`
      : sun
        ? `太阳在${sun.house}宫`
        : mars
          ? `火星在${mars.house}宫`
          : "主轴动力";
  const moonVenusHint =
    moon && venus
      ? `月金在${moon.house === venus.house ? `同${moon.house}宫` : `${moon.house}宫与${venus.house}宫`}`
      : moon
        ? `月亮在${moon.house}宫`
        : venus
          ? `金星在${venus.house}宫`
          : "反馈回路";
  const mercuryHint = mercury ? `水星在${mercury.house}宫的契约接口` : "沟通接口";

  const actions: [string, string, string] = [
    sun || mars
      ? fillCopyTemplate(C.actions.engineTemplate, { sunMarsHint })
      : C.actions.engineFallback,
    moon || venus
      ? fillCopyTemplate(C.actions.flowTemplate, { moonVenusHint })
      : C.actions.flowFallback,
    mercury
      ? fillCopyTemplate(C.actions.contractTemplate, { mercuryHint })
      : C.actions.contractFallback,
  ];

  return applyPlanetPositionsChartKindLayer(
    {
      statusLine: C.statusLine,
      answer: { happened, core, risk, today },
      pro: { sunMars, moonVenus, mercuryJupiter },
      precision: { matrix: C.matrixCaption, clusters },
      actions,
    },
    chartKind,
    voiceStyleId,
  );
}
