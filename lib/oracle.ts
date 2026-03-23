import {
  SEMANTIC_CLOSING,
  SEMANTIC_DO,
  SEMANTIC_DONT,
  SEMANTIC_MAIN,
} from "./oracle-corpus";
import type { SynthesisContext } from "./oracle-engine";

export type OracleMood = "CHAOS" | "STILLNESS" | "SEEKING" | "SURGE" | "FISSURE";

const MOOD_LABEL_ZH: Record<OracleMood, string> = {
  CHAOS: "混沌",
  STILLNESS: "静息",
  SEEKING: "寻迹",
  SURGE: "涌动",
  FISSURE: "裂隙",
};

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

export type OracleLetter = {
  theme: OracleTheme;
  themeLabel: string;
  header: string;
  mainMessage: string;
  numberId: `N-${string}`;
  numberValue: number;
  colorId: `C-${string}`;
  colorHex: `#${string}`;
  doList: string[];
  dontList: string[];
  closing: string;
};

/** 工程级主题命名（与 UI / THEME_IDS 对齐） */
const THEMES: Array<{ id: OracleTheme; label: string }> = [
  { id: "ORDER_REBUILD", label: "秩序归元" },
  { id: "EMOTION_REPAIR", label: "灵境涤清" },
  { id: "BOUNDARY", label: "场域立槛" },
  { id: "MOMENTUM", label: "矢量对焦" },
  { id: "DECISION", label: "因果裁断" },
  { id: "RESOURCE_FLOW", label: "丰饶潮汐" },
  { id: "CAREER_PATH", label: "阶位攀升" },
  { id: "BODY_RHYTHM", label: "命力节律" },
  { id: "CREATION", label: "虚空映照" },
  { id: "CYCLE_END", label: "寂灭余烬" },
  { id: "SYNCHRONICITY", label: "共时锚定" },
  { id: "SOUL_INTEGRATION", label: "灵识合一" },
];

export const THEME_CATALOG = THEMES.map((t) => t.label);
export const THEME_IDS = THEMES.map((t) => t.id);

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

function pickOne<T>(arr: T[], rand: () => number) {
  return arr[Math.floor(rand() * arr.length)];
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function generateOracleLetter(input: {
  mood: OracleMood;
  date: Date;
  userSeed: string;
  forcedTheme?: OracleTheme;
  /** 接入月相等实时量时传入；不配则占位符走引擎冷备 */
  synthesisContext?: SynthesisContext;
}): OracleLetter {
  const dateKey = `${input.date.getFullYear()}-${pad2(input.date.getMonth() + 1)}-${pad2(input.date.getDate())}`;

  const theme = input.forcedTheme
    ? THEMES.find((t) => t.id === input.forcedTheme) ?? THEMES[0]
    : (() => {
        const r0 = mulberry32(hashString(`${dateKey}|${input.userSeed}|${input.mood}`)());
        return pickOne(THEMES, r0);
      })();

  const rand = mulberry32(hashString(`${dateKey}|${input.userSeed}|${input.mood}|${theme.id}`)());

  const mainMessage = SEMANTIC_MAIN[theme.id][input.mood];
  const closing = SEMANTIC_CLOSING[theme.id][input.mood];
  const doPair = SEMANTIC_DO[theme.id][input.mood];
  const dontPair = SEMANTIC_DONT[theme.id][input.mood];
  const doList = [...doPair];
  const dontList = [...dontPair];

  const numberValue = Math.floor(rand() * 99) + 1;
  const numberId = `N-${pad2(numberValue)}` as const;
  const colorValue = Math.floor(rand() * 24) + 1;
  const colorId = `C-${pad2(colorValue)}` as const;
  const colorHexes = [
    "#050505", "#1a0b3d", "#D4AF37", "#6D28D9", "#312E81", "#0B1F3A", "#B8860B", "#E7D3A0",
    "#EDE7D9", "#C08497", "#9F1239", "#7F1D1D", "#0F766E", "#14532D", "#86A789", "#0EA5E9",
    "#22C55E", "#F5F3FF", "#3F3F46", "#A16207", "#F59E0B", "#4C1D95", "#3B0764", "#A78BFA",
  ] as const;
  const colorHex = colorHexes[colorValue - 1];

  return {
    theme: theme.id,
    themeLabel: theme.label,
    header: `档案 // ${dateKey} // ${MOOD_LABEL_ZH[input.mood]}`,
    mainMessage,
    numberId,
    numberValue,
    colorId,
    colorHex,
    doList,
    dontList,
    closing,
  };
}
