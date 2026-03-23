import { NextResponse } from "next/server";
import { State } from "country-state-city";
import { resolveStateLabelZh } from "@/lib/place-subdivision-zh";

const CN_GOTO_OPTGROUP = new Set(["HK", "MO", "TW"]);

export async function GET(req: Request) {
  const country = new URL(req.url).searchParams.get("country")?.trim().toUpperCase();
  if (!country || country.length !== 2) {
    return NextResponse.json({ states: [] as { code: string; name: string; labelZh: string }[] });
  }

  let rows = State.getStatesOfCountry(country).map((s) => ({
    code: s.isoCode,
    name: s.name,
    labelZh: resolveStateLabelZh(country, s.isoCode, s.name),
  }));

  if (country === "CN") {
    rows = rows.filter((s) => !CN_GOTO_OPTGROUP.has(s.code));
  }

  /** 英国库内混入圣赫勒拿、阿森松等海外领地代码（GB-SH-*），与本土郡县混排易误导，出生地选本土时剔除 */
  if (country === "GB") {
    rows = rows.filter((s) => !s.code.startsWith("SH-"));
  }

  const sortLoc = country === "US" ? "en" : "zh-CN";
  rows.sort((a, b) => a.labelZh.localeCompare(b.labelZh, sortLoc));

  return NextResponse.json({ states: rows });
}
