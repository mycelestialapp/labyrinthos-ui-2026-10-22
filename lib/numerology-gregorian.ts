/** 公历日数与合法性（数秘工作台与接口校验共用） */

export function daysInMonth(y: number, mo: number): number {
  return new Date(y, mo, 0).getDate();
}

export function isValidGregorianDate(y: number, m: number, d: number): boolean {
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

/** 将「日」收束到该年该月合法范围（用于水合、存档回灌） */
export function clampGregorianDay(y: number, m: number, d: number): number {
  if (m < 1 || m > 12) return Math.max(1, Math.min(d, 31));
  const max = daysInMonth(y, m);
  return Math.max(1, Math.min(d, max));
}
