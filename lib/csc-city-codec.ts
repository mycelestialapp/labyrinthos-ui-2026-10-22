import type { ICity } from "country-state-city";

export type CscCityRef = { c: string; s: string; n: string };

/** 无「州/省」列表时，二级项用此占位 stateCode，三级解析为国家/地区中心点 */
export const CSC_SYNTH_COUNTRY_STATE = "-";

export function encodeCscCityRef(ref: CscCityRef): string {
  const json = JSON.stringify(ref);
  return Buffer.from(json, "utf8").toString("base64url");
}

export function decodeCscCityRef(code: string): CscCityRef | null {
  try {
    const json = Buffer.from(code, "base64url").toString("utf8");
    const o = JSON.parse(json) as unknown;
    if (!o || typeof o !== "object") return null;
    const p = o as Record<string, unknown>;
    if (typeof p.c !== "string" || typeof p.s !== "string" || typeof p.n !== "string") return null;
    if (p.c.length !== 2) return null;
    return { c: p.c.toUpperCase(), s: p.s, n: p.n };
  } catch {
    return null;
  }
}

export function cityRowToRef(country: string, city: ICity): CscCityRef {
  return { c: country.toUpperCase(), s: city.stateCode, n: city.name };
}
