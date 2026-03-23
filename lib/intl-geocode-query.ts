import { Country, State } from "country-state-city";
import type { CscCityRef } from "@/lib/csc-city-codec";
import { CSC_SYNTH_COUNTRY_STATE } from "@/lib/csc-city-codec";

/**
 * 构造地理编码查询串：城市/地区名 + 州省 + 国家，供第三级「精化」与无坐标兜底。
 * 仅服务端 API 使用。
 */
export function buildIntlGeocodeQuery(ref: CscCityRef): string | null {
  const co = Country.getCountryByCode(ref.c);
  if (!co?.name) return null;
  const name = ref.n?.trim();
  if (!name) return null;

  if (ref.s === CSC_SYNTH_COUNTRY_STATE) {
    return `${name}, ${co.name}`;
  }
  const st = State.getStateByCodeAndCountry(ref.s, ref.c);
  const statePart = st?.name?.trim() || ref.s;
  return `${name}, ${statePart}, ${co.name}`;
}
