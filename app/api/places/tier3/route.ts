/**
 * 出生地第三级：
 * - CN：区县（china-location）
 * - US：CSC + GeoNames cities1000（按 FIPS）+ 县质心 + 县域 geocode
 * - 其他：CSC 默认坐标 + 结构化地理编码查询（ige:）作精化/无坐标兜底
 */
import { NextResponse } from "next/server";
import { Country, State } from "country-state-city";
import { getCitiesOfStateCached } from "@/lib/csc-city-data";
import { listChinaDistricts } from "@/lib/china-admin-cascade";
import {
  decodeUsCountyParent,
  encodeUsCountyGeocodeCode,
  findUsCountyRow,
  usCountyGeocodeQuery,
  usCountyTier3ResolvedCities,
} from "@/lib/us-county-cascade";
import { encodeUsCountyCentroidCode, getUsCountyCentroid } from "@/lib/us-county-centroid-data";
import { encodeGeonamesTier3Code, getUsGeonamesPlacesForCounty } from "@/lib/us-geonames-county-data";
import { encodeIntlGeocodeCode } from "@/lib/intl-geocode-codec";
import { buildIntlGeocodeQuery } from "@/lib/intl-geocode-query";
import {
  cityRowToRef,
  CSC_SYNTH_COUNTRY_STATE,
  decodeCscCityRef,
  encodeCscCityRef,
} from "@/lib/csc-city-codec";

export type Tier3Row = { code: string; label: string; lat: string | null; lon: string | null };

const DEFAULT_CODE = "default";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const country = sp.get("country")?.trim().toUpperCase() ?? "";
  const parent = sp.get("parent")?.trim() ?? "";

  if (!country || country.length !== 2 || !parent) {
    return NextResponse.json({ tier3: [] as Tier3Row[] });
  }

  if (country === "CN" && /^\d{6}$/.test(parent)) {
    const rows = listChinaDistricts(parent).map((d) => ({
      code: d.code,
      label: d.name,
      lat: null as string | null,
      lon: null as string | null,
    }));
    return NextResponse.json({ tier3: rows });
  }

  if (country === "US") {
    const dec = decodeUsCountyParent(parent);
    if (dec) {
      const row = findUsCountyRow(dec.stateAbbr, dec.fips5);
      if (!row) return NextResponse.json({ tier3: [] as Tier3Row[] });
      const allCities = getCitiesOfStateCached("US", dec.stateAbbr);
      const resolved = usCountyTier3ResolvedCities(dec.fips5, row.countyname, allCities);
      const seen = new Set(resolved.map((c) => c.name.trim().toLowerCase()));
      const cityRows: Tier3Row[] = resolved.map((c) => ({
        code: encodeCscCityRef(cityRowToRef("US", c)),
        label: c.name,
        lat: c.latitude ?? null,
        lon: c.longitude ?? null,
      }));
      for (const x of getUsGeonamesPlacesForCounty(dec.fips5)) {
        const k = x.n.trim().toLowerCase();
        if (seen.has(k)) continue;
        seen.add(k);
        cityRows.push({
          code: encodeGeonamesTier3Code(x.id),
          label: x.n,
          lat: String(x.lat),
          lon: String(x.lon),
        });
      }
      cityRows.sort((a, b) => a.label.localeCompare(b.label, "en"));

      const tier3: Tier3Row[] = [...cityRows];
      const centroid = getUsCountyCentroid(dec.fips5);
      if (centroid) {
        tier3.push({
          code: encodeUsCountyCentroidCode(dec.fips5),
          label: "County centroid (approx. center, in boundary)",
          lat: String(centroid.lat),
          lon: String(centroid.lon),
        });
      }
      const gq = usCountyGeocodeQuery(row.countyname, dec.stateAbbr);
      tier3.push({
        code: encodeUsCountyGeocodeCode(gq),
        label: `${row.countyname}（县域近似，库内无单独城镇时选此项）`,
        lat: null,
        lon: null,
      });
      return NextResponse.json({ tier3 });
    }
  }

  const ref = decodeCscCityRef(parent);
  if (!ref || ref.c !== country) {
    return NextResponse.json({ tier3: [] as Tier3Row[] });
  }

  const cities =
    ref.s === CSC_SYNTH_COUNTRY_STATE ? [] : getCitiesOfStateCached(ref.c, ref.s);
  const hit = cities.find((x) => x.name === ref.n);
  let lat = hit?.latitude ?? null;
  let lon = hit?.longitude ?? null;

  if ((hit == null || lat == null || lon == null) && ref.s && ref.s !== CSC_SYNTH_COUNTRY_STATE) {
    const st = State.getStateByCodeAndCountry(ref.s, ref.c);
    if (st && st.name === ref.n && st.latitude && st.longitude) {
      lat = st.latitude;
      lon = st.longitude;
    }
  }

  if ((lat == null || lon == null) && ref.s === CSC_SYNTH_COUNTRY_STATE) {
    const co = Country.getCountryByCode(ref.c);
    if (co?.latitude && co.longitude) {
      lat = co.latitude;
      lon = co.longitude;
    }
  }

  const countryLevel = ref.s === CSC_SYNTH_COUNTRY_STATE;

  const defaultRow: Tier3Row = {
    code: DEFAULT_CODE,
    label: countryLevel ? "默认（使用国家/地区中心坐标）" : "默认（使用该城镇/库内坐标）",
    lat,
    lon,
  };

  const tier3: Tier3Row[] = [defaultRow];
  const intlQ = buildIntlGeocodeQuery(ref);
  if (intlQ) {
    const hasCoords = lat != null && lon != null;
    tier3.push({
      code: encodeIntlGeocodeCode(intlQ),
      label: hasCoords
        ? "地理编码精化（与地图交叉验证，推荐校时用）"
        : "地理编码获取坐标（库内无经纬度时选此项）",
      lat: null,
      lon: null,
    });
  }

  return NextResponse.json({ tier3 });
}
