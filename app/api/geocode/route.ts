import { NextResponse } from "next/server";

type GeocodeResult = { label: string; lat: number; lon: number; countryCode?: string };

/** 浏览器语言 → 优先展示该 ISO 3166-1 alpha-2 国家的结果（减少「青岛」类同字跨国的干扰）。 */
function preferredCountryFromAcceptLanguage(accept: string | null): string | null {
  if (!accept) return null;
  const tag = accept.split(",")[0]?.trim().toLowerCase() ?? "";
  if (tag.startsWith("ja")) return "jp";
  if (tag.startsWith("ko")) return "kr";
  if (tag.startsWith("zh-tw") || tag.startsWith("zh-hant-tw")) return "tw";
  if (tag.startsWith("zh-hk")) return "hk";
  if (tag.startsWith("zh-mo")) return "mo";
  if (tag.startsWith("zh")) return "cn";
  return null;
}

function sortByCountryBias(results: GeocodeResult[], preferred: string | null): GeocodeResult[] {
  if (!preferred) return results;
  const p = preferred.toLowerCase();
  const head: GeocodeResult[] = [];
  const tail: GeocodeResult[] = [];
  for (const r of results) {
    if (r.countryCode?.toLowerCase() === p) head.push(r);
    else tail.push(r);
  }
  return [...head, ...tail];
}

function mapboxWorldviewFromAcceptLanguage(accept: string | null): string | undefined {
  if (!accept) return undefined;
  const tag = accept.split(",")[0]?.trim().toLowerCase() ?? "";
  if (tag.startsWith("ja")) return "jp";
  if (tag.startsWith("zh")) return "cn";
  return undefined;
}

/**
 * 出生地地理编码：优先调用 Mapbox（需要服务端 token）；不配置/失败时回退到 OpenStreetMap Nominatim。
 * - Nominatim：须遵守 https://operations.osmfoundation.org/policies/nominatim/ ：合理 User-Agent、控制频率（前端防抖）。
 */
const NOMINATIM_UA = "LabyrinthosUI/1.0 (birth-place search; https://github.com/)";

export async function GET(req: Request) {
  const clientLang = req.headers.get("accept-language");
  const preferred = preferredCountryFromAcceptLanguage(clientLang);

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ results: [] as GeocodeResult[] });
  }
  if (q.length > 200) {
    return NextResponse.json({ error: "query_too_long" }, { status: 400 });
  }

  const countriesRaw = searchParams.get("countries")?.trim().toLowerCase() ?? "";
  const countriesOk =
    countriesRaw.length > 0 &&
    /^[a-z]{2}(,[a-z]{2}){0,24}$/.test(countriesRaw) &&
    countriesRaw.split(",").every((s) => s.length === 2);

  // 1) Mapbox（优先）
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN?.trim();
  if (mapboxToken) {
    try {
      const url = new URL("https://api.mapbox.com/search/geocode/v6/forward");
      url.searchParams.set("q", q);
      url.searchParams.set("access_token", mapboxToken);
      url.searchParams.set("limit", "10");
      url.searchParams.set("format", "geojson");
      if (countriesOk) url.searchParams.set("country", countriesRaw);

      const worldview = mapboxWorldviewFromAcceptLanguage(clientLang);
      if (worldview) url.searchParams.set("worldview", worldview);

      const res = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`mapbox_upstream_${res.status}`);
      }

      const data = (await res.json()) as {
        features?: Array<{
          geometry?: { coordinates?: [number, number] };
          properties?: {
            name?: string;
            place_formatted?: string;
            full_address?: string;
            context?: { country?: { country_code?: string } };
          };
        }>;
      };

      const results: GeocodeResult[] = [];
      for (const feature of data.features ?? []) {
        const coords = feature.geometry?.coordinates;
        if (!coords) continue;

        const lon = Number(coords[0]);
        const lat = Number(coords[1]);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;

        const label =
          feature.properties?.full_address?.trim() ||
          feature.properties?.place_formatted?.trim() ||
          feature.properties?.name?.trim();
        if (!label) continue;

        const countryCode = feature.properties?.context?.country?.country_code?.trim().toLowerCase();
        const row: GeocodeResult = { label, lat, lon };
        if (countryCode) row.countryCode = countryCode;
        results.push(row);
      }

      return NextResponse.json({ results: sortByCountryBias(results, preferred) });
    } catch {
      // Mapbox 异常时回退到 Nominatim（保证服务可用）。
    }
  }

  // 2) Nominatim（回退）
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "10");
  url.searchParams.set("addressdetails", "1");
  if (countriesOk) {
    url.searchParams.set("countrycodes", countriesRaw);
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": NOMINATIM_UA,
        Accept: "application/json",
        "Accept-Language": "zh-CN,en",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ results: [], error: "upstream" }, { status: 502 });
    }

    const data = (await res.json()) as Array<{
      display_name?: string;
      lat?: string;
      lon?: string;
      address?: { country_code?: string };
    }>;

    const results: GeocodeResult[] = [];
    for (const item of data) {
      const lat = Number(item.lat);
      const lon = Number(item.lon);
      const label = item.display_name?.trim();
      const countryCode = item.address?.country_code?.trim().toLowerCase();
      if (!label || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;
      const row: GeocodeResult = { label, lat, lon };
      if (countryCode) row.countryCode = countryCode;
      results.push(row);
    }

    return NextResponse.json({ results: sortByCountryBias(results, preferred) });
  } catch {
    return NextResponse.json({ results: [], error: "fetch_failed" }, { status: 502 });
  }
}
