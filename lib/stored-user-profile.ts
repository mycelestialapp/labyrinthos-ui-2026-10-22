/**
 * localStorage「user_profile」与三主星推算（与 IdentityGoldCard 存档格式一致）。
 */

import { type NatalBig3, birthMomentToUtc, computeNatalBig3 } from "./natal-chart";
import { type PlacePrecision, parsePlacePrecision } from "./birthplace-precision";

export const USER_PROFILE_STORAGE_KEY = "user_profile";

/** 自定义事件：同页内金卡写入/清除档案后，通知头部等组件刷新 */
export const USER_PROFILE_CHANGED_EVENT = "labyrinthos:user-profile-changed";

export type StoredUserProfile = {
  displayName?: string;
  relationTag?: string;
  birthdate: string;
  birthTime: string;
  timeZone: string;
  latitude: number;
  longitude: number;
  coordinates?: string;
  placeLabel?: string;
  placePrecision?: PlacePrecision;
  birthCountryCode?: string;
  birthStateCode?: string;
  birthTier2Code?: string;
  birthTier3Code?: string;
};

export function parseStoredUserProfileJson(raw: string | null): StoredUserProfile | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    const p = o as Record<string, unknown>;
    if (
      typeof p.birthdate !== "string" ||
      typeof p.birthTime !== "string" ||
      typeof p.timeZone !== "string" ||
      typeof p.latitude !== "number" ||
      typeof p.longitude !== "number"
    )
      return null;
    return {
      displayName: typeof p.displayName === "string" ? p.displayName : undefined,
      relationTag: typeof p.relationTag === "string" ? p.relationTag : undefined,
      birthdate: p.birthdate,
      birthTime: p.birthTime,
      timeZone: p.timeZone,
      latitude: p.latitude,
      longitude: p.longitude,
      coordinates: typeof p.coordinates === "string" ? p.coordinates : undefined,
      placeLabel: typeof p.placeLabel === "string" ? p.placeLabel : undefined,
      placePrecision: parsePlacePrecision(p.placePrecision),
      birthCountryCode: typeof p.birthCountryCode === "string" ? p.birthCountryCode : undefined,
      birthStateCode: typeof p.birthStateCode === "string" ? p.birthStateCode : undefined,
      birthTier2Code: typeof p.birthTier2Code === "string" ? p.birthTier2Code : undefined,
      birthTier3Code: typeof p.birthTier3Code === "string" ? p.birthTier3Code : undefined,
    };
  } catch {
    return null;
  }
}

export function natalBig3FromStoredProfile(p: StoredUserProfile): NatalBig3 | null {
  const utc = birthMomentToUtc(p.birthdate, p.birthTime, p.timeZone);
  if (!utc) return null;
  return computeNatalBig3(utc, p.latitude, p.longitude);
}

export function readNatalBig3FromLocalStorage(): NatalBig3 | null {
  if (typeof window === "undefined") return null;
  const p = parseStoredUserProfileJson(window.localStorage.getItem(USER_PROFILE_STORAGE_KEY));
  if (!p) return null;
  return natalBig3FromStoredProfile(p);
}

export function notifyUserProfileChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(USER_PROFILE_CHANGED_EVENT));
}

/** 写入本地档案（与首页身份金卡同一 key），并通知各组件刷新 */
export function saveStoredUserProfile(p: StoredUserProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(p));
  notifyUserProfileChanged();
}
