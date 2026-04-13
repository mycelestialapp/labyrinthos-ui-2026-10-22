import type { AspectType } from "@/lib/astro-chart-wheel";

/**
 * 相位中文名唯一真源：须与 `AstroChartReadout` 卡片徽标、`ChartWheelPlaceholder` 提示一致。
 * 轴点/次要/主相位观测报告、答案路由等一律从此导入，禁止在其它文件另写 `TYPE_ZH` / switch。
 *
 * 角度对应：`astro-chart-wheel` MINOR_ASPECT_DEFS — sesquiquadrate=135°（八分补），quincunx=150°（梅花相）。
 */
export const ASTRO_ASPECT_TYPE_LABEL_ZH: Record<AspectType, string> = {
  conjunction: "合相",
  sextile: "六合",
  square: "四分",
  trine: "三合",
  opposition: "对冲",
  semisextile: "十二分相",
  semisquare: "八分相",
  sesquiquadrate: "八分补",
  quincunx: "梅花相",
};

export function aspectTypeLabelZh(type: AspectType): string {
  return ASTRO_ASPECT_TYPE_LABEL_ZH[type];
}
