/**
 * 出生地 IANA 时区预设与中文展示名（与身份金卡一致）。
 * Windows 等环境下 Intl.DisplayNames('timeZone') 常退回 IANA 原文，故保留手写表。
 */

export const BIRTH_TIMEZONE_PRESETS = [
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Taipei",
  "Asia/Macau",
  "Asia/Urumqi",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Bangkok",
  "Asia/Ho_Chi_Minh",
  "Asia/Manila",
  "Asia/Jakarta",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Jerusalem",
  "America/Los_Angeles",
  "America/Denver",
  "America/Phoenix",
  "America/Chicago",
  "America/New_York",
  "America/Toronto",
  "America/Vancouver",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "America/Buenos_Aires",
  "America/Santiago",
  "America/Anchorage",
  "America/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Brussels",
  "Europe/Zurich",
  "Europe/Vienna",
  "Europe/Warsaw",
  "Europe/Athens",
  "Europe/Istanbul",
  "Europe/Moscow",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Perth",
  "Australia/Brisbane",
  "Pacific/Auckland",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "UTC",
] as readonly string[];

const BIRTH_TIMEZONE_LABEL_ZH: Record<string, string> = {
  UTC: "协调世界时",
  "Asia/Shanghai": "中国 · 上海",
  "Asia/Hong_Kong": "中国 · 香港",
  "Asia/Taipei": "中国 · 台北",
  "Asia/Macau": "中国 · 澳门",
  "Asia/Urumqi": "中国 · 乌鲁木齐",
  "Asia/Singapore": "新加坡",
  "Asia/Tokyo": "日本 · 东京",
  "Asia/Seoul": "韩国 · 首尔",
  "Asia/Bangkok": "泰国 · 曼谷",
  "Asia/Ho_Chi_Minh": "越南 · 胡志明市",
  "Asia/Manila": "菲律宾 · 马尼拉",
  "Asia/Jakarta": "印度尼西亚 · 雅加达",
  "Asia/Kolkata": "印度 · 加尔各答（新德里）",
  "Asia/Dubai": "阿联酋 · 迪拜",
  "Asia/Jerusalem": "以色列 · 耶路撒冷",
  "America/Los_Angeles": "美国 · 洛杉矶",
  "America/New_York": "美国 · 纽约",
  "America/Chicago": "美国 · 芝加哥",
  "America/Denver": "美国 · 丹佛",
  "America/Phoenix": "美国 · 凤凰城",
  "America/Anchorage": "美国 · 安克雷奇",
  "America/Honolulu": "美国 · 檀香山",
  "America/Toronto": "加拿大 · 多伦多",
  "America/Vancouver": "加拿大 · 温哥华",
  "America/Mexico_City": "墨西哥 · 墨西哥城",
  "America/Sao_Paulo": "巴西 · 圣保罗",
  "America/Buenos_Aires": "阿根廷 · 布宜诺斯艾利斯",
  "America/Santiago": "智利 · 圣地亚哥",
  "Europe/London": "英国 · 伦敦",
  "Europe/Paris": "法国 · 巴黎",
  "Europe/Berlin": "德国 · 柏林",
  "Europe/Rome": "意大利 · 罗马",
  "Europe/Madrid": "西班牙 · 马德里",
  "Europe/Amsterdam": "荷兰 · 阿姆斯特丹",
  "Europe/Brussels": "比利时 · 布鲁塞尔",
  "Europe/Zurich": "瑞士 · 苏黎世",
  "Europe/Vienna": "奥地利 · 维也纳",
  "Europe/Warsaw": "波兰 · 华沙",
  "Europe/Athens": "希腊 · 雅典",
  "Europe/Istanbul": "土耳其 · 伊斯坦布尔",
  "Europe/Moscow": "俄罗斯 · 莫斯科",
  "Australia/Sydney": "澳大利亚 · 悉尼",
  "Australia/Melbourne": "澳大利亚 · 墨尔本",
  "Australia/Perth": "澳大利亚 · 珀斯",
  "Australia/Brisbane": "澳大利亚 · 布里斯班",
  "Pacific/Auckland": "新西兰 · 奥克兰",
  "Africa/Cairo": "埃及 · 开罗",
  "Africa/Johannesburg": "南非 · 约翰内斯堡",
};

export function birthTimeZoneLabelZh(iana: string): string {
  const hit = BIRTH_TIMEZONE_LABEL_ZH[iana];
  if (hit) return hit;
  const head = iana.split("/")[0];
  const region =
    head === "Asia"
      ? "亚洲"
      : head === "America"
        ? "美洲"
        : head === "Europe"
          ? "欧洲"
          : head === "Africa"
            ? "非洲"
            : head === "Australia" || head === "Pacific"
              ? "大洋洲/太平洋"
              : head === "Atlantic"
                ? "大西洋"
                : head === "Indian"
                  ? "印度洋"
                  : head === "Arctic"
                    ? "北极"
                    : head === "Antarctica"
                      ? "南极"
                      : "";
  if (region) return `${region} · 其他（建议改选列表中最近的大城市）`;
  return "其他地区";
}
