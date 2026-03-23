import { NextResponse } from "next/server";
import { Country, State } from "country-state-city";
import { listChinaPrefecturesByCscState } from "@/lib/china-admin-cascade";
import { getCitiesOfCountryCached, getCitiesOfStateCached } from "@/lib/csc-city-data";
import { cityRowToRef, CSC_SYNTH_COUNTRY_STATE, encodeCscCityRef } from "@/lib/csc-city-codec";
import { listUsCounties } from "@/lib/us-county-cascade";
import { resolveStateLabelZh } from "@/lib/place-subdivision-zh";

export type Tier2Row = { code: string; label: string; lat: string | null; lon: string | null };

/** 无州/省列表时，二级展示用中文惯用名（其余用 CSC 英文名） */
const COUNTRY_CENTER_LABEL_ZH: Readonly<Record<string, string>> = {
  MO: "澳门",
  VA: "梵蒂冈",
  GI: "直布罗陀",
  JE: "泽西岛",
  GG: "根西岛",
  IM: "马恩岛",
};

function synthTier2FromState(country: string, stateIso: string): Tier2Row | null {
  const st = State.getStateByCodeAndCountry(stateIso, country);
  if (!st?.latitude || !st.longitude) return null;
  return {
    code: encodeCscCityRef({ c: country.toUpperCase(), s: st.isoCode, n: st.name }),
    label: resolveStateLabelZh(country, st.isoCode, st.name),
    lat: st.latitude,
    lon: st.longitude,
  };
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const country = sp.get("country")?.trim().toUpperCase() ?? "";
  const state = sp.get("state")?.trim() ?? "";

  if (!country || country.length !== 2) {
    return NextResponse.json({ tier2: [] as Tier2Row[] });
  }

  if (country === "CN") {
    if (!state) return NextResponse.json({ tier2: [] as Tier2Row[] });
    const rows = listChinaPrefecturesByCscState(state).map((p) => ({
      code: p.code,
      label: p.name,
      lat: null as string | null,
      lon: null as string | null,
    }));
    return NextResponse.json({ tier2: rows });
  }

  if (country === "US" && state) {
    try {
      const rows = listUsCounties(state).map((c) => ({
        code: c.code,
        label: c.name,
        lat: null as string | null,
        lon: null as string | null,
      }));
      return NextResponse.json({ tier2: rows });
    } catch {
      return NextResponse.json({ tier2: [] as Tier2Row[] });
    }
  }

  let raw;
  if (state) {
    raw = getCitiesOfStateCached(country, state);
  } else {
    raw = getCitiesOfCountryCached(country);
  }

  /** 香港、新加坡部分规划区等：库内分区下无城镇，用行政区几何中心作为二级 */
  if (raw.length === 0 && state) {
    const syn = synthTier2FromState(country, state);
    if (syn) return NextResponse.json({ tier2: [syn] });
  }

  /** 澳门、梵蒂冈等：无州列表且全国无城镇条目，用国家/地区中心点 */
  if (raw.length === 0 && !state) {
    const co = Country.getCountryByCode(country);
    if (co?.latitude && co.longitude) {
      const label = COUNTRY_CENTER_LABEL_ZH[country] ?? co.name;
      return NextResponse.json({
        tier2: [
          {
            code: encodeCscCityRef({
              c: country.toUpperCase(),
              s: CSC_SYNTH_COUNTRY_STATE,
              n: co.name,
            }),
            label,
            lat: co.latitude,
            lon: co.longitude,
          },
        ],
      });
    }
  }

  const tier2: Tier2Row[] = raw.map((c) => ({
    code: encodeCscCityRef(cityRowToRef(country, c)),
    label: c.name,
    lat: c.latitude ?? null,
    lon: c.longitude ?? null,
  }));
  tier2.sort((a, b) => a.label.localeCompare(b.label, "en"));

  return NextResponse.json({ tier2 });
}
