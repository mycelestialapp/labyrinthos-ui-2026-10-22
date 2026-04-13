# -*- coding: utf-8 -*-
"""Regenerate lib files with UTF-8 Chinese (ASCII-only source in this script)."""
from __future__ import annotations

import codecs
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]


def uescape(s: str) -> str:
    return codecs.decode(s, "unicode_escape")

HOUSE_SYSTEMS_TS = r'''/**
 * \u5bab\u4f4d\u5236\uff1a\u754c\u9762\u5c55\u793a\u4e2d\u6587\u540d + Swiss `swe_houses` \u5b57\u6bcd\u7801\uff08\u4e0e sweph-wasm \u4e00\u81f4\uff09\u3002
 */

import type { HouseSystemId } from "@/lib/astro-dossier-storage";

/** Swiss Ephemeris `swe_houses` \u4f7f\u7528\u7684\u5355\u5b57\u6bcd\u5bab\u4f4d\u5236\u4ee3\u7801 */
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

/** \u5de5\u4f5c\u53f0\u4e0e\u5bfc\u51fa\u91cc\u4f18\u5148\u5c55\u793a\u7684\u5e38\u89c1\u5bab\u4f4d\u5236 */
export const HOUSE_SYSTEM_OPTIONS_COMMON: HouseSystemOption[] = [
  { id: "Placidus", label: "\u666e\u62c9\u897f\u5ea6", swiss: "P" },
  { id: "Whole Sign", label: "\u6574\u5bab\u5236", swiss: "W" },
  { id: "Koch", label: "\u79d1\u8d6b", swiss: "K" },
  { id: "Equal", label: "\u7b49\u5bab", swiss: "E" },
  { id: "EqualMc", label: "\u5929\u9876\u8d77\u7b49\u5bab", swiss: "D" },
  { id: "Campanus", label: "\u574e\u5e15\u7eb3\u65af", swiss: "C" },
  { id: "Regiomontanus", label: "\u533a\u57df\u8499\u5854\u52aa\u65af", swiss: "R" },
  { id: "Porphyry", label: "\u6ce2\u83f2\u91cc", swiss: "O" },
];

export const HOUSE_SYSTEM_OPTIONS_MORE: HouseSystemOption[] = [
  { id: "EqualAries", label: "\u767d\u7f8a\u8d77\u7b49\u5bab", swiss: "N" },
  { id: "Vehlow", label: "\u7ef4\u6d1b", swiss: "V" },
  { id: "Meridian", label: "\u5b50\u5348", swiss: "X" },
  { id: "Horizontal", label: "\u5730\u5e73", swiss: "H" },
  { id: "Alcabitus", label: "\u963f\u5c14\u5361\u6bd4\u7279\u65af", swiss: "B" },
  { id: "Morinus", label: "\u83ab\u6797\u7eb3\u65af", swiss: "M" },
  { id: "Sripati", label: "\u65af\u91cc\u5e15\u8482", swiss: "S" },
  { id: "Krusinski", label: "\u514b\u9c81\u8f9b\u65af\u57fa", swiss: "U" },
  { id: "Sunshine", label: "\u9633\u5149", swiss: "I" },
  { id: "PolichPage", label: "\u6ce2\u5229\u5e0c-\u4f69\u5947", swiss: "T" },
  { id: "Carter", label: "\u5361\u7279", swiss: "F" },
  { id: "Gauquelin", label: "\u9ad8\u683c\u6797", swiss: "G" },
  { id: "PullenSd", label: "Pullen SD", swiss: "L" },
  { id: "PullenSr", label: "Pullen SR", swiss: "Q" },
  { id: "Apc", label: "APC \u5bab\u5236", swiss: "Y" },
];

export const HOUSE_SYSTEM_MORE_IDS = new Set<HouseSystemId>(
  HOUSE_SYSTEM_OPTIONS_MORE.map((o) => o.id),
);

const ALL_HOUSE_SYSTEM_OPTIONS = [...HOUSE_SYSTEM_OPTIONS_COMMON, ...HOUSE_SYSTEM_OPTIONS_MORE];

/** \u4e0e `HOUSE_SYSTEM_OPTIONS_*` \u540c\u6b65\u7684\u77ed\u4e2d\u6587\u540d\uff08\u8bfb\u6570\u533a\u3001\u5bfc\u51fa\uff09 */
export const HOUSE_SYSTEM_LABEL_ZH: Record<HouseSystemId, string> = ALL_HOUSE_SYSTEM_OPTIONS.reduce(
  (acc, o) => {
    acc[o.id] = o.label;
    return acc;
  },
  {} as Record<HouseSystemId, string>,
);

/** `HouseSystemId` \u2192 Swiss `swe_houses` \u5b57\u6bcd */
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

/** \u5168\u91cf `HouseSystemId` \u7684\u7a33\u5b9a\u6392\u5e8f\uff08\u5e38\u89c1\u5728\u524d\uff0c\u5176\u4f59\u6309\u300c\u66f4\u591a\u300d\u5217\u8868\uff09 */
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
      throw new Error(`[astro-house-systems] \u91cd\u590d\u7684\u5bab\u4f4d\u5236 id\uff1a${o.id}`);
    }
    seenId.add(o.id);
    const prev = swissToId.get(o.swiss);
    if (prev !== undefined) {
      throw new Error(
        `[astro-house-systems] Swiss \u7801 "${o.swiss}" \u88ab\u91cd\u590d\u4f7f\u7528\uff1a${prev} \u4e0e ${o.id}`,
      );
    }
    swissToId.set(o.swiss, o.id);
  }
}
'''

CHROME_VOICE_TS = r'''/**
 * \u5de5\u4f5c\u53f0\u9876\u680f/\u526f\u680f\uff1a\u8bfb\u6570\u5bfc\u51fa\u4e0e\u5149\u8c31\u53e5\u7684\u58f0\u90e8\u5165\u53e3\u3002
 * \u8bfb\u6570 Markdown \u89c1 `workspace-reading-markdown-voice-zh`\uff1b
 * \u5149\u8c31\u53e5\u89c1 `astro-workspace-spectral-line-voice-zh`\u3002
 */

import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { workspaceReadingMarkdownVocal as workspaceReadingMarkdownVocalImpl } from "@/lib/workspace-reading-markdown-voice-zh";

export function workspaceReadingMarkdownVocal(md: string, voiceStyleId: VoiceStyleIdZh): string {
  return workspaceReadingMarkdownVocalImpl(md, voiceStyleId);
}

export function workspaceSubtitleVocal(text: string): string {
  return text;
}
'''


def main() -> None:
    (ROOT / "lib" / "astro-house-systems.ts").write_text(uescape(HOUSE_SYSTEMS_TS), encoding="utf-8")
    (ROOT / "lib" / "astro-workspace-chrome-voice-zh.ts").write_text(uescape(CHROME_VOICE_TS), encoding="utf-8")


if __name__ == "__main__":
    main()
