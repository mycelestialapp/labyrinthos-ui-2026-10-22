/** 智慧档案：localStorage（共鸣页等复用） */

import type { NumerologyWorkspaceSnapshot } from "@/lib/numerology-workspace-snapshot";

export const NUMEROLOGY_ARCHIVE_STORAGE_KEY = "labyrinthos_numerology_archive_v1";

export type NumerologyArchiveEntry = {
  id: string;
  savedAt: string;
  note: string;
  snapshot: NumerologyWorkspaceSnapshot;
};

export function loadNumerologyArchive(): NumerologyArchiveEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NUMEROLOGY_ARCHIVE_STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((x) => x && typeof x === "object" && typeof (x as NumerologyArchiveEntry).id === "string") as NumerologyArchiveEntry[];
  } catch {
    return [];
  }
}

export function saveNumerologyArchive(entries: NumerologyArchiveEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NUMEROLOGY_ARCHIVE_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* quota */
  }
}
