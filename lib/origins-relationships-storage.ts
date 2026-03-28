import type { StoredUserProfile } from "@/lib/stored-user-profile";

export const ORIGINS_RELATIONSHIPS_STORAGE_KEY = "labyrinthos-origins-relationships-v1";

export type OriginsRelationshipRecord = {
  id: string;
  createdAt: number;
  relationName: string;
  selfName?: string;
  partnerName?: string;
  selfProfile: StoredUserProfile;
  partnerProfile: StoredUserProfile;
};

type OriginsRelationshipStore = {
  records: OriginsRelationshipRecord[];
};

function newId(): string {
  return `rel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadOriginsRelationshipStore(): OriginsRelationshipStore {
  if (typeof window === "undefined") return { records: [] };
  try {
    const raw = window.localStorage.getItem(ORIGINS_RELATIONSHIPS_STORAGE_KEY);
    if (!raw) return { records: [] };
    const parsed = JSON.parse(raw) as { records?: OriginsRelationshipRecord[] };
    if (!parsed || !Array.isArray(parsed.records)) return { records: [] };
    return { records: parsed.records };
  } catch {
    return { records: [] };
  }
}

export function saveOriginsRelationshipStore(store: OriginsRelationshipStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORIGINS_RELATIONSHIPS_STORAGE_KEY, JSON.stringify(store));
}

export function appendOriginsRelationshipRecord(input: {
  relationName: string;
  selfName?: string;
  partnerName?: string;
  selfProfile: StoredUserProfile;
  partnerProfile: StoredUserProfile;
}): OriginsRelationshipRecord {
  const rec: OriginsRelationshipRecord = {
    id: newId(),
    createdAt: Date.now(),
    relationName: input.relationName.trim() || "未命名关系",
    selfName: input.selfName?.trim() || undefined,
    partnerName: input.partnerName?.trim() || undefined,
    selfProfile: input.selfProfile,
    partnerProfile: input.partnerProfile,
  };
  const store = loadOriginsRelationshipStore();
  const next = { records: [rec, ...store.records].slice(0, 120) };
  saveOriginsRelationshipStore(next);
  return rec;
}
