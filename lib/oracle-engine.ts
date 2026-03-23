/**
 * 万象语意卷积引擎（骨架）
 *
 * 全量语意池：`lib/axiom-pools.ts` · 填空模板：`docs/ORACLE_AXIOM_POOL_TEMPLATE.md`
 *
 * 解决的问题：
 * 1) 避免 p+c+s 乱拼：固定「三句一节」语法 + 每句强制收束为「。」
 * 2) 避免同一 seed 连 % 10：每层从独立 rand() 取索引
 * 3) 占位符：${LUNAR_PHASE} 等由调用方注入，缺省用冷备读数
 * 4) 组合下界：export 文档函数，避免夸大「27 年」类口号
 */

import { AXIOM_POOLS } from "./axiom-pools";
import { SEMANTIC_MAIN } from "./oracle-corpus";

export type OracleMood = "CHAOS" | "STILLNESS" | "SEEKING" | "SURGE" | "FISSURE";

export type OracleTheme =
  | "ORDER_REBUILD"
  | "EMOTION_REPAIR"
  | "BOUNDARY"
  | "MOMENTUM"
  | "DECISION"
  | "RESOURCE_FLOW"
  | "CAREER_PATH"
  | "BODY_RHYTHM"
  | "CREATION"
  | "CYCLE_END"
  | "SYNCHRONICITY"
  | "SOUL_INTEGRATION";

/** 单层语意池：观测 / 公理核 / 相位调节（可逐格扩容到各 10+ 条） */
export type TierPools = {
  observed: string[];
  core: string[];
  phase: string[];
};

export type SynthesisContext = {
  /** 与第二屏月相同步时传入；未接好则用冷备字符串 */
  lunarPhaseLabel?: string;
  solarHint?: string;
};

function hashString(input: string) {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickIndex(rand: () => number, len: number): number {
  if (len <= 0) return 0;
  return Math.floor(rand() * len);
}

/** 去空白、保证以「。」收束（避免三节粘连不成句） */
function finalizeSentence(s: string): string {
  const t = s.replace(/\s+/g, "").trim();
  if (!t) return "";
  return t.endsWith("。") ? t : `${t}。`;
}

/**
 * 三节拼装：观测宏观 → 公理主体 → 相位调节
 * 要求：各池内文案自洽，避免重复主语；拼接只负责标点与节奏。
 */
export function assembleAxiomTriplet(observed: string, core: string, phase: string): string {
  return [finalizeSentence(observed), finalizeSentence(core), finalizeSentence(phase)]
    .filter(Boolean)
    .join("");
}

/** 占位符注入（扩展：${SOLAR_HINT} 等） */
export function injectOrbitalPlaceholders(text: string, ctx?: SynthesisContext): string {
  const lunar = ctx?.lunarPhaseLabel?.trim() || "月相档：未同步";
  const solar = ctx?.solarHint?.trim() || "日向参数：未绑定";
  return text
    .replace(/\$\{LUNAR_PHASE\}/g, lunar)
    .replace(/\$\{SOLAR_POSITION\}/g, solar);
}

/** 语意池全量见 `axiom-pools.ts` */

function synthKey(dateKey: string, userSeed: string, mood: OracleMood, theme: OracleTheme) {
  return `${dateKey}|${userSeed}|${mood}|${theme}|v1-synth`;
}

/**
 * 若该格已配置 AXIOM_POOLS：用三层独立抽取 + 拼装；否则返回 null（由调用方用语料库）。
 */
export function trySynthesizeMainAxiom(input: {
  theme: OracleTheme;
  mood: OracleMood;
  dateKey: string;
  userSeed: string;
  ctx?: SynthesisContext;
}): string | null {
  const cell = AXIOM_POOLS[input.theme][input.mood];
  if (!cell?.observed?.length || !cell.core?.length || !cell.phase?.length) return null;

  const seed = hashString(synthKey(input.dateKey, input.userSeed, input.mood, input.theme))();
  const rand = mulberry32(seed);

  const o = cell.observed[pickIndex(rand, cell.observed.length)]!;
  const c = cell.core[pickIndex(rand, cell.core.length)]!;
  const p = cell.phase[pickIndex(rand, cell.phase.length)]!;

  const raw = assembleAxiomTriplet(o, c, p);
  return injectOrbitalPlaceholders(raw, input.ctx);
}

/** 单格理论组合下界（独立均匀抽取假设）：|O|×|C|×|P| */
export function cellCombinationLowerBound(theme: OracleTheme, mood: OracleMood): number {
  const cell = AXIOM_POOLS[theme][mood];
  if (!cell) return 1;
  return Math.max(1, cell.observed.length * cell.core.length * cell.phase.length);
}

/** 供文档/注释：说明「多久可能重复」要用生日悖论 + 实际日更 seed，勿口头夸大 */
export function describeSynthesisEntropy(theme: OracleTheme, mood: OracleMood): string {
  const n = cellCombinationLowerBound(theme, mood);
  return `该格语意池独立组合下界约 ${n}（逐日变更 userSeed+date 时重复期望远高于 n）`;
}

/** 开发自检：某格未配池时回落文案仍存在 */
export function fallbackMain(theme: OracleTheme, mood: OracleMood): string {
  return SEMANTIC_MAIN[theme][mood];
}
