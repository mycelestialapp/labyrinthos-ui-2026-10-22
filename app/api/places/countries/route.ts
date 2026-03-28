import { NextResponse } from "next/server";
import { Country } from "country-state-city";
import {
  BIRTHPLACE_CURATED_COUNTRY_CODES,
  isBirthplaceCuratedCountry,
} from "@/lib/birthplace-curated-countries";

type CountryRow = { code: string; label: string; name: string };

/** 白名单变更时签名会变，避免 dev/生产里旧进程长期缓存仍含已删国家 */
const CURATED_SIG = BIRTHPLACE_CURATED_COUNTRY_CODES.join(",");
let cached: { sig: string; countries: CountryRow[] } | null = null;

export async function GET() {
  if (cached?.sig === CURATED_SIG) {
    return NextResponse.json({ countries: cached.countries });
  }

  let dn: Intl.DisplayNames | null = null;
  try {
    dn = new Intl.DisplayNames(["zh-CN"], { type: "region" });
  } catch {
    dn = null;
  }

  const rows: CountryRow[] = Country.getAllCountries()
    .filter((c) => isBirthplaceCuratedCountry(c.isoCode))
    .map((c) => {
      const zh = dn?.of(c.isoCode);
      return {
        code: c.isoCode,
        label: zh && zh !== c.isoCode ? zh : c.name,
        name: c.name,
      };
    });

  /** 美国置顶；其次中国；其余按中文地区名排序。（港澳台不在国家列表，从选中国后的省/州栏进入。） */
  rows.sort((a, b) => {
    if (a.code === "US") return -1;
    if (b.code === "US") return 1;
    if (a.code === "CN") return -1;
    if (b.code === "CN") return 1;
    return a.label.localeCompare(b.label, "zh-CN");
  });

  cached = { sig: CURATED_SIG, countries: rows };
  return NextResponse.json({ countries: rows });
}
