/**
 * 首页出生地国家白名单（ISO 3166-1 alpha-2）。
 * 与 `birthplace-tier-labels.ts` 中显式配过栏位文案的码一致。
 *
 * 香港、澳门、台湾 **不**出现在国家下拉：选「中国」后，在 **① 省/州** 栏底部「港澳台」分组进入（见 IdentityGoldCard）。
 */
export const BIRTHPLACE_CURATED_COUNTRY_CODES: readonly string[] = [
  "AR",
  "AT",
  "AU",
  "BE",
  "BR",
  "CA",
  "CH",
  "CL",
  "CN",
  "CO",
  "CZ",
  "DE",
  "EG",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "HU",
  "ID",
  "IE",
  "IL",
  "IN",
  "IT",
  "JP",
  "KR",
  "MX",
  "MY",
  "NL",
  "NO",
  "NZ",
  "PE",
  "PH",
  "PL",
  "PT",
  "RO",
  "RU",
  "SA",
  "SE",
  "SG",
  "TH",
  "TR",
  "UA",
  "US",
  "VN",
  "ZA",
] as const;

const SET = new Set(BIRTHPLACE_CURATED_COUNTRY_CODES);

export function isBirthplaceCuratedCountry(isoCode: string): boolean {
  return SET.has(isoCode.trim().toUpperCase());
}
