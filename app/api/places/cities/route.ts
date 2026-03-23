import { NextResponse } from "next/server";
import { getCitiesOfCountryCached, getCitiesOfStateCached } from "@/lib/csc-city-data";
import { cnCityLabelZh } from "@/lib/cn-city-label-zh";

type CityRow = { name: string; labelZh: string; lat: string | null; lon: string | null; stateCode: string };

/** 兼容旧调用；新界面请用 /api/places/tier2、tier3 三级联动。 */
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const country = sp.get("country")?.trim().toUpperCase();
  const state = sp.get("state")?.trim() ?? "";
  if (!country || country.length !== 2) {
    return NextResponse.json({ cities: [] as CityRow[] });
  }

  let raw;
  if (state) {
    raw = getCitiesOfStateCached(country, state);
  } else {
    raw = getCitiesOfCountryCached(country);
  }

  const zhFamily = country === "CN" || country === "HK" || country === "MO" || country === "TW";
  const cities: CityRow[] = raw.map((c) => ({
    name: c.name,
    labelZh: zhFamily ? cnCityLabelZh(c.stateCode, c.name) : c.name,
    lat: c.latitude ?? null,
    lon: c.longitude ?? null,
    stateCode: c.stateCode,
  }));
  cities.sort((a, b) =>
    zhFamily ? a.labelZh.localeCompare(b.labelZh, "zh-CN") : a.name.localeCompare(b.name, "en"),
  );

  return NextResponse.json({ cities });
}
