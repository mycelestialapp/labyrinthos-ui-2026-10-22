/**
 * 宫位制：界面展示中文名 + Swiss `swe_houses` 字母码（与 sweph-wasm 一致）。
 */

import type { HouseSystemId } from "@/lib/astro-dossier-storage";

/** Swiss Ephemeris `swe_houses` 使用的单字母宫位制代码 */
export type SweHouseSystemCode =
  | "P"
  | "W"
  | "K"
  | "E"
  | "C"
  | "R"
  | "O"
  | "B"
  | "M"
  | "S"
  | "U"
  | "D"
  | "H"
  | "N"
  | "X"
  | "V"
  | "I"
  | "T"
  | "F"
  | "G"
  | "L"
  | "Q"
  | "Y";

export type HouseSystemOption = {
  id: HouseSystemId;
  label: string;
  swiss: SweHouseSystemCode;
};

/** 工作台与导出里优先展示的常见宫位制 */
export const HOUSE_SYSTEM_OPTIONS_COMMON: HouseSystemOption[] = [
  { id: "Placidus", label: "普拉西度", swiss: "P" },
  { id: "Whole Sign", label: "整宫制", swiss: "W" },
  { id: "Koch", label: "科赫", swiss: "K" },
  { id: "Equal", label: "等宫", swiss: "E" },
  { id: "EqualMc", label: "天顶起等宫", swiss: "D" },
  { id: "Campanus", label: "坎帕纳斯", swiss: "C" },
  { id: "Regiomontanus", label: "区域蒙塔努斯", swiss: "R" },
  { id: "Porphyry", label: "波菲里", swiss: "O" },
];

export const HOUSE_SYSTEM_OPTIONS_MORE: HouseSystemOption[] = [
  { id: "EqualAries", label: "白羊起等宫", swiss: "N" },
  { id: "Vehlow", label: "维洛", swiss: "V" },
  { id: "Meridian", label: "子午", swiss: "X" },
  { id: "Horizontal", label: "地平", swiss: "H" },
  { id: "Alcabitus", label: "阿尔卡比特斯", swiss: "B" },
  { id: "Morinus", label: "莫林纳斯", swiss: "M" },
  { id: "Sripati", label: "斯里帕蒂", swiss: "S" },
  { id: "Krusinski", label: "克鲁辛斯基", swiss: "U" },
  { id: "Sunshine", label: "阳光", swiss: "I" },
  { id: "PolichPage", label: "波利希-佩奇", swiss: "T" },
  { id: "Carter", label: "卡特", swiss: "F" },
  { id: "Gauquelin", label: "高格林", swiss: "G" },
  { id: "PullenSd", label: "Pullen SD", swiss: "L" },
  { id: "PullenSr", label: "Pullen SR", swiss: "Q" },
  { id: "Apc", label: "APC 宫制", swiss: "Y" },
];

export const HOUSE_SYSTEM_MORE_IDS = new Set<HouseSystemId>(
  HOUSE_SYSTEM_OPTIONS_MORE.map((o) => o.id),
);

const ALL_HOUSE_SYSTEM_OPTIONS = [...HOUSE_SYSTEM_OPTIONS_COMMON, ...HOUSE_SYSTEM_OPTIONS_MORE];

/** 与 `HOUSE_SYSTEM_OPTIONS_*` 同步的短中文名（读数区、导出） */
export const HOUSE_SYSTEM_LABEL_ZH: Record<HouseSystemId, string> = ALL_HOUSE_SYSTEM_OPTIONS.reduce(
  (acc, o) => {
    acc[o.id] = o.label;
    return acc;
  },
  {} as Record<HouseSystemId, string>,
);

/** `HouseSystemId` → Swiss `swe_houses` 字母 */
export const HOUSE_SYSTEM_SWISS_BY_ID: Record<HouseSystemId, SweHouseSystemCode> =
  ALL_HOUSE_SYSTEM_OPTIONS.reduce(
    (acc, o) => {
      acc[o.id] = o.swiss;
      return acc;
    },
    {} as Record<HouseSystemId, SweHouseSystemCode>,
  );

export function houseSystemToSwissHsys(h: HouseSystemId): SweHouseSystemCode {
  return HOUSE_SYSTEM_SWISS_BY_ID[h];
}

/** 全量 `HouseSystemId` 的稳定排序（常见在前，其余按「更多」列表） */
export const HOUSE_SYSTEM_IDS_ORDERED = [
  ...HOUSE_SYSTEM_OPTIONS_COMMON.map((o) => o.id),
  ...HOUSE_SYSTEM_OPTIONS_MORE.map((o) => o.id),
] as const;
type _HouseSystemIdFromUi = (typeof HOUSE_SYSTEM_IDS_ORDERED)[number];
type _MissingHouseSystemInUi = Exclude<HouseSystemId, _HouseSystemIdFromUi>;
void (0 as unknown as [_MissingHouseSystemInUi] extends [never] ? true : _MissingHouseSystemInUi);

if (process.env.NODE_ENV === "development") {
  const seenId = new Set<HouseSystemId>();
  const swissToId = new Map<SweHouseSystemCode, HouseSystemId>();
  for (const o of ALL_HOUSE_SYSTEM_OPTIONS) {
    if (seenId.has(o.id)) {
      throw new Error(`[astro-house-systems] 重复的宫位制 id：${o.id}`);
    }
    seenId.add(o.id);
    const prev = swissToId.get(o.swiss);
    if (prev !== undefined) {
      throw new Error(
        `[astro-house-systems] Swiss 码 "${o.swiss}" 被重复使用：${prev} 与 ${o.id}`,
      );
    }
    swissToId.set(o.swiss, o.id);
  }
}
