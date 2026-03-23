import { NextResponse } from "next/server";
import { Country } from "country-state-city";

type CountryRow = { code: string; label: string; name: string };

let cached: { countries: CountryRow[] } | null = null;

export async function GET() {
  if (cached) {
    return NextResponse.json(cached);
  }

  let dn: Intl.DisplayNames | null = null;
  try {
    dn = new Intl.DisplayNames(["zh-CN"], { type: "region" });
  } catch {
    dn = null;
  }

  const rows: CountryRow[] = Country.getAllCountries().map((c) => {
    const zh = dn?.of(c.isoCode);
    return {
      code: c.isoCode,
      label: zh && zh !== c.isoCode ? zh : c.name,
      name: c.name,
    };
  });

  /** 产品置顶：美国优先；其余按中文地区名排序，仍保留全球全集（约 250）以免选不到出生地。 */
  rows.sort((a, b) => {
    if (a.code === "US") return -1;
    if (b.code === "US") return 1;
    return a.label.localeCompare(b.label, "zh-CN");
  });

  cached = { countries: rows };
  return NextResponse.json(cached);
}
