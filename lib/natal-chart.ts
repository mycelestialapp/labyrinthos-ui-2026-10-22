/**
 * 本命盘「三主星」：太阳 / 月亮 / 上升（热带黄道 / 回归黄道）。
 * 星历：astronomy-engine（MIT）。
 * 对齐原则：太阳、月亮、上升的黄道经度均在「观测时刻的真黄道历元（ECT）」下读取，避免上升沿用 J2000 平均黄道而与日、月不一致。
 */

import * as Astronomy from "astronomy-engine";
import { toDate } from "date-fns-tz";

export const ZODIAC_KEYS = [
  "ARIES",
  "TAURUS",
  "GEMINI",
  "CANCER",
  "LEO",
  "VIRGO",
  "LIBRA",
  "SCORPIO",
  "SAGITTARIUS",
  "CAPRICORN",
  "AQUARIUS",
  "PISCES",
] as const;

export type ZodiacKey = (typeof ZODIAC_KEYS)[number];

export const ZODIAC_CN: Record<ZodiacKey, string> = {
  ARIES: "白羊",
  TAURUS: "金牛",
  GEMINI: "双子",
  CANCER: "巨蟹",
  LEO: "狮子",
  VIRGO: "处女",
  LIBRA: "天秤",
  SCORPIO: "天蝎",
  SAGITTARIUS: "射手",
  CAPRICORN: "摩羯",
  AQUARIUS: "水瓶",
  PISCES: "双鱼",
};

export type NatalBig3 = {
  sun: ZodiacKey;
  moon: ZodiacKey;
  rising: ZodiacKey;
};

/** 与界面「计算口径」说明一致，便于产品、法务与高级用户对齐预期 */
export const NATAL_COMPUTATION_DISCLOSURE_ZH: string[] = [
  "黄道体系：热带黄道（回归黄道）；星座界为黄道经度每 30° 一档，边界落在精确度极限附近时请以专业排盘软件交叉验证。",
  "太阳：地心视位置，真黄道历元与观测日期一致（与 astronomy-engine SunPosition / ECT 一致）。",
  "月亮：地心黄道经度（EclipticLongitude），与太阳同一黄道定义；未改用月面视差下的地平位置（与多数「月亮星座」流行算法一致）。",
  "上升：本地地平东点（方位角自北顺时针 90°、视高度角 0°，含标准大气折射）；经 HOR→EQJ→ECT 换至真黄道经度，与太阳、月亮对齐同一黄道体系。",
  "出生地坐标：级联、县域近似、库内点或地名搜索等路径均可落到 WGS84；解锁后本地存档含「定盘方式」字段（数据源层级说明），便于与地图或第二套排盘软件交叉验证，亦可在高级区手改经纬度。",
  "时区：IANA + date-fns-tz，尊重历史夏令时与政区变更规则；极端历史日期若与纸质记录冲突，请核对当时当地官方时间。",
  "引擎边界：非 Swiss Ephemeris；与任意商业软件「逐角分一致」不作保证。若需司法鉴定级对齐，应注明所依据的星历与宫位制并固定版本。",
];

export function isValidGregorianDate(year: number, month: number, day: number): boolean {
  if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1) return false;
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const dim = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= dim[month - 1]!;
}

/** 将黄道经度（度，热带）映射到星座键 */
export function zodiacKeyFromLongitude(lonDeg: number): ZodiacKey {
  const lon = ((lonDeg % 360) + 360) % 360;
  const idx = Math.min(11, Math.floor(lon / 30));
  return ZODIAC_KEYS[idx]!;
}

/**
 * 解析「纬度,经度」或「纬度，经度」。北纬、东经为正。
 */
export function parseLatLon(input: string): { lat: number; lon: number } | null {
  const s = input.trim().replace(/，/g, ",");
  const m = s.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lon = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}

/** 出生地的当地日历日 + 墙钟时间 → UTC Date */
export function birthMomentToUtc(
  birthDate: string,
  birthTime: string,
  timeZone: string
): Date | null {
  const dm = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dm) return null;
  const y = Number(dm[1]);
  const mo = Number(dm[2]);
  const d = Number(dm[3]);
  if (!isValidGregorianDate(y, mo, d)) return null;

  const tm = birthTime.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!tm) return null;
  const hh = Number(tm[1]);
  const mm = Number(tm[2]);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;

  const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
  const isoLocal = `${dm[1]}-${dm[2]}-${dm[3]}T${pad(hh)}:${pad(mm)}:00`;
  const utc = toDate(isoLocal, { timeZone });
  if (Number.isNaN(utc.getTime())) return null;
  return utc;
}

function ascendantLongitudeDeg(date: Date, latDeg: number, lonDeg: number): number {
  const observer = new Astronomy.Observer(latDeg, lonDeg, 0);
  const eastHorizon = new Astronomy.Spherical(0, 90, 1);
  const vHor = Astronomy.VectorFromHorizon(eastHorizon, date, "normal");
  const horEqj = Astronomy.Rotation_HOR_EQJ(date, observer);
  const vEqj = Astronomy.RotateVector(horEqj, vHor);
  const eqjEct = Astronomy.Rotation_EQJ_ECT(date);
  const vEct = Astronomy.RotateVector(eqjEct, vEqj);
  const sph = Astronomy.SphereFromVector(vEct);
  let lon = sph.lon;
  if (lon < 0) lon += 360;
  if (lon >= 360) lon -= 360;
  return lon;
}

export function computeNatalBig3(instantUtc: Date, latDeg: number, lonDeg: number): NatalBig3 {
  const sunLon = Astronomy.SunPosition(instantUtc).elon;
  const moonLon = Astronomy.EclipticLongitude(Astronomy.Body.Moon, instantUtc);
  const ascLon = ascendantLongitudeDeg(instantUtc, latDeg, lonDeg);

  return {
    sun: zodiacKeyFromLongitude(sunLon),
    moon: zodiacKeyFromLongitude(moonLon),
    rising: zodiacKeyFromLongitude(ascLon),
  };
}

type Element = "fire" | "earth" | "air" | "water";

function elementOf(key: ZodiacKey): Element {
  const f: ZodiacKey[] = ["ARIES", "LEO", "SAGITTARIUS"];
  const e: ZodiacKey[] = ["TAURUS", "VIRGO", "CAPRICORN"];
  const a: ZodiacKey[] = ["GEMINI", "LIBRA", "AQUARIUS"];
  if (f.includes(key)) return "fire";
  if (e.includes(key)) return "earth";
  if (a.includes(key)) return "air";
  return "water";
}

const ELEMENT_WORD: Record<Element, string> = {
  fire: "火象",
  earth: "土象",
  air: "风象",
  water: "水象",
};

/**
 * 频率定性文案（可后续替换为完整文案库 / i18n）。
 * 当前：事实句 + 按上升/月亮元素各一句气质描述。
 */
export function natalQualitativeCopy(big3: NatalBig3): string {
  const sunW = ELEMENT_WORD[elementOf(big3.sun)];
  const moonW = ELEMENT_WORD[elementOf(big3.moon)];
  const riseW = ELEMENT_WORD[elementOf(big3.rising)];

  const fact = `热带黄道：太阳☉${ZODIAC_CN[big3.sun]}（${sunW}）、月亮☽${ZODIAC_CN[big3.moon]}（${moonW}）、上升↑${ZODIAC_CN[big3.rising]}（${riseW}）。`;
  const tone =
    elementOf(big3.rising) === "fire"
      ? "外在节奏偏直给，习惯用行动先占位。"
      : elementOf(big3.rising) === "earth"
        ? "外在偏稳，倾向可验证、可累积的步调。"
        : elementOf(big3.rising) === "air"
          ? "外在轻快，擅长命名、连接与视角切换。"
          : "外在收束，直觉与氛围优先于解释。";

  const core =
    elementOf(big3.moon) === "fire"
      ? "内在需要热度和意义感，情绪来得快也去得快。"
      : elementOf(big3.moon) === "earth"
        ? "内在要安全感，情绪常落在「实不实」上。"
        : elementOf(big3.moon) === "air"
          ? "内在需要说清楚、想明白，情绪易被信息牵动。"
          : "内在潮汐深，记忆与意象比道理先到场。";

  return `${fact}${tone}${core}`;
}
