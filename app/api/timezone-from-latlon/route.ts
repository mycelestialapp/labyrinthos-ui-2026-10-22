import { NextResponse } from "next/server";
import { find } from "geo-tz";

export const runtime = "nodejs";

/** 多国重叠带（如中国东西）时用经度与国家码粗选主时区 */
function pickPrimaryZone(zones: string[], countryHint: string, lon: number): string | null {
  if (zones.length === 0) return null;
  if (zones.length === 1) return zones[0];
  const cc = countryHint.trim().toUpperCase();
  if (cc === "CN" && zones.includes("Asia/Shanghai") && zones.includes("Asia/Urumqi")) {
    return lon < 91 ? "Asia/Urumqi" : "Asia/Shanghai";
  }
  return zones[0];
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const lat = Number(sp.get("lat"));
  const lon = Number(sp.get("lon"));
  const country = sp.get("country")?.trim() ?? "";

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "invalid_coordinates" }, { status: 400 });
  }

  const zones = find(lat, lon);
  const timeZone = pickPrimaryZone(zones, country, lon);
  if (!timeZone) {
    return NextResponse.json({ error: "no_zone" }, { status: 404 });
  }

  return NextResponse.json({ timeZone, candidates: zones });
}
