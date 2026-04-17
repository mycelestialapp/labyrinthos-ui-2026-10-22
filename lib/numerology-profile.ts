import { daysInMonth, isValidGregorianDate } from "@/lib/numerology-gregorian";
import { numerologyEnergyThemeForLifePath, type NumerologyEnergyTheme } from "@/lib/numerology-energy-theme";
import { lifePathLayerCopyZh, type LifePathLayerCopy } from "@/lib/numerology-life-path-copy-zh";
import {
  birthdayNumber,
  computeLifePathBreakdown,
  expressionNumber,
  lifePathNumber,
  personalityNumber,
  personalYear,
  soulUrgeNumber,
  type LifePathBreakdown,
} from "@/lib/numerology-pythagorean";

export type NumerologyProfileInput = {
  month: number;
  day: number;
  year: number;
  /** 拉丁全拼，可空 */
  nameLatin?: string | null;
  /** 个人年所用公历年，默认当年 */
  calendarYear?: number | null;
};

export type NumerologyProfile = {
  ok: true;
  input: {
    month: number;
    day: number;
    year: number;
    nameLatin: string | null;
    calendarYear: number;
  };
  numbers: {
    lifePath: number;
    birthdayNumber: number;
    personalYear: number;
    expression: number | null;
    soulUrge: number | null;
    personality: number | null;
  };
  breakdown: LifePathBreakdown;
  layers: LifePathLayerCopy;
  energyTheme: NumerologyEnergyTheme;
  meta: { computedAt: string };
};

export type NumerologyProfileParseError =
  | "invalid_json_shape"
  | "invalid_date"
  | "month_out_of_range"
  | "day_out_of_range"
  | "year_out_of_range"
  | "name_too_long"
  | "calendar_year_out_of_range";

function asInt(n: unknown): number | null {
  if (typeof n === "number" && Number.isFinite(n) && Number.isInteger(n)) return n;
  if (typeof n === "string" && /^-?\d+$/.test(n.trim())) return parseInt(n.trim(), 10);
  return null;
}

export type ParseNumerologyProfileBodyResult =
  | { ok: true; value: NumerologyProfileInput }
  | { ok: false; error: NumerologyProfileParseError; message: string };

const YEAR_MIN = 1900;
const YEAR_MAX = 2100;
const NAME_MAX = 200;

/**
 * 校验并归一化 POST body（供 Route Handler 与测试复用）。
 */
export function parseNumerologyProfileBody(body: unknown): ParseNumerologyProfileBodyResult {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "invalid_json_shape", message: "body 须为 JSON 对象" };
  }
  const o = body as Record<string, unknown>;
  const month = asInt(o.month);
  const day = asInt(o.day);
  const year = asInt(o.year);
  if (month === null || day === null || year === null) {
    return { ok: false, error: "invalid_json_shape", message: "month、day、year 须为整数" };
  }
  if (month < 1 || month > 12) {
    return { ok: false, error: "month_out_of_range", message: "月份须在 1–12 之间。" };
  }
  if (day < 1 || day > 31) {
    return { ok: false, error: "day_out_of_range", message: "日期须在 1–31 之间（具体上限随月份与闰年而定）。" };
  }
  if (year < YEAR_MIN || year > YEAR_MAX) {
    return { ok: false, error: "year_out_of_range", message: `年份须在 ${YEAR_MIN}–${YEAR_MAX} 之间。` };
  }
  if (!isValidGregorianDate(year, month, day)) {
    const max = daysInMonth(year, month);
    return {
      ok: false,
      error: "invalid_date",
      message: `此公历无法成立：${year} 年 ${month} 月没有 ${day} 日。该月仅有 1—${max} 日，请将「日」调至合法范围后再试（闰年 2 月至多 29 日）。`,
    };
  }

  let nameLatin: string | null = null;
  if (o.nameLatin !== undefined && o.nameLatin !== null) {
    if (typeof o.nameLatin !== "string") {
      return { ok: false, error: "invalid_json_shape", message: "nameLatin 须为字符串或省略" };
    }
    const t = o.nameLatin.trim();
    if (t.length > NAME_MAX) {
      return { ok: false, error: "name_too_long", message: `nameLatin 最长 ${NAME_MAX} 字符` };
    }
    nameLatin = t.length ? t : null;
  }

  let calendarYear = new Date().getFullYear();
  if (o.calendarYear !== undefined && o.calendarYear !== null) {
    const cy = asInt(o.calendarYear);
    if (cy === null) {
      return { ok: false, error: "invalid_json_shape", message: "calendarYear 须为整数或省略" };
    }
    if (cy < YEAR_MIN || cy > YEAR_MAX) {
      return { ok: false, error: "calendar_year_out_of_range", message: `calendarYear 须在 ${YEAR_MIN}–${YEAR_MAX}` };
    }
    calendarYear = cy;
  }

  return {
    ok: true,
    value: { month, day, year, nameLatin: nameLatin ?? undefined, calendarYear },
  };
}

/** 纯函数：毕达哥拉斯主路径、辅数、分层句库与能量主题（与前台 lib 同源算法）。 */
export function computeNumerologyProfile(input: NumerologyProfileInput): NumerologyProfile {
  const { month, day, year } = input;
  const name = input.nameLatin ?? "";
  const calendarYear = input.calendarYear ?? new Date().getFullYear();

  const lp = lifePathNumber(month, day, year);
  const breakdown = computeLifePathBreakdown(month, day, year);
  const bd = birthdayNumber(day);
  const py = personalYear(month, day, calendarYear);
  const ex = expressionNumber(name);
  const su = soulUrgeNumber(name);
  const pe = personalityNumber(name);

  return {
    ok: true,
    input: {
      month,
      day,
      year,
      nameLatin: name.length ? name : null,
      calendarYear,
    },
    numbers: {
      lifePath: lp,
      birthdayNumber: bd,
      personalYear: py,
      expression: ex,
      soulUrge: su,
      personality: pe,
    },
    breakdown,
    layers: lifePathLayerCopyZh(lp),
    energyTheme: numerologyEnergyThemeForLifePath(lp),
    meta: { computedAt: new Date().toISOString() },
  };
}
