/**
 * /astro 案卷：本地持久化（第一期 localStorage）。
 */

export type AstroTopic = "love" | "career" | "self";

export type AstroLens = "time_lord" | "lunar_cycle";

/** 与 UI / Swiss 字母表见 `lib/astro-house-systems.ts`；新增时需同时改该文件与 `astro-chart-wheel-swiss`。 */
export type HouseSystemId =
  | "Placidus"
  | "Whole Sign"
  | "Koch"
  | "Equal"
  | "Campanus"
  | "Regiomontanus"
  | "Porphyry"
  | "Alcabitus"
  | "Morinus"
  | "Sripati"
  | "Krusinski"
  | "EqualMc"
  | "Horizontal"
  | "EqualAries"
  | "Meridian"
  | "Vehlow"
  | "Sunshine"
  | "PolichPage"
  | "Carter"
  | "Gauquelin"
  | "PullenSd"
  | "PullenSr"
  | "Apc";

export type TimeAnchorId = "natal" | "now";

export type AstroDossier = {
  id: string;
  title: string;
  topic: AstroTopic;
  topicDetail: string;
  lens: AstroLens;
  houseSystem: HouseSystemId;
  timeAnchor: TimeAnchorId;
  notes: string;
  createdAt: number;
  updatedAt: number;
};

export type AstroDossierStore = {
  dossiers: AstroDossier[];
  activeId: string;
};

const STORAGE_KEY = "labyrinthos-astro-dossiers-v1";

function newId(): string {
  return `d-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyDossier(partial?: Partial<Pick<AstroDossier, "title" | "topic" | "topicDetail">>): AstroDossier {
  const now = Date.now();
  return {
    id: newId(),
    title: partial?.title ?? "未命名解读",
    topic: partial?.topic ?? "self",
    topicDetail: partial?.topicDetail ?? "",
    lens: "time_lord",
    houseSystem: "Placidus",
    timeAnchor: "natal",
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function loadAstroDossierStore(): AstroDossierStore {
  if (typeof window === "undefined") {
    const d = createEmptyDossier({ title: "本命结构初探" });
    return { dossiers: [d], activeId: d.id };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const d = createEmptyDossier({ title: "本命结构初探" });
      return { dossiers: [d], activeId: d.id };
    }
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") throw new Error("bad");
    const rec = o as Record<string, unknown>;
    const dossiers = rec.dossiers;
    const activeId = rec.activeId;
    if (!Array.isArray(dossiers) || dossiers.length === 0 || typeof activeId !== "string") throw new Error("bad");
    const parsed = dossiers.filter((x): x is AstroDossier => {
      if (!x || typeof x !== "object") return false;
      const d = x as Record<string, unknown>;
      return typeof d.id === "string" && typeof d.title === "string";
    });
    if (parsed.length === 0) {
      const d = createEmptyDossier({ title: "本命结构初探" });
      return { dossiers: [d], activeId: d.id };
    }
    const validActive = parsed.some((d) => d.id === activeId) ? activeId : parsed[0]!.id;
    return { dossiers: parsed, activeId: validActive };
  } catch {
    const d = createEmptyDossier({ title: "本命结构初探" });
    return { dossiers: [d], activeId: d.id };
  }
}

export function saveAstroDossierStore(store: AstroDossierStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getActiveDossier(store: AstroDossierStore): AstroDossier {
  const d = store.dossiers.find((x) => x.id === store.activeId);
  return d ?? store.dossiers[0]!;
}
