const PREFIX = "ige:";

/** 第三级：国际地点地理编码（query 为 UTF-8 原文经 encodeURIComponent） */
export function encodeIntlGeocodeCode(query: string): string {
  return `${PREFIX}${encodeURIComponent(query.trim())}`;
}

export function decodeIntlGeocodeCode(code: string): string | null {
  if (!code.startsWith(PREFIX)) return null;
  try {
    return decodeURIComponent(code.slice(PREFIX.length));
  } catch {
    return null;
  }
}
