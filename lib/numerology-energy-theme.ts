/** 依生命路径主数返回界面能量辅色（与「坛城数轨」墨青底上的细线色相呼应） */

export type NumerologyEnergyTheme = {
  key: string;
  /** 粒子 / 光斑辅色 */
  accentRgb: string;
  /** 曼陀罗细线辅色 */
  mandalaStroke: string;
  label: string;
};

export function numerologyEnergyThemeForLifePath(lp: number): NumerologyEnergyTheme {
  const n = lp === 11 || lp === 22 || lp === 33 ? lp : ((lp - 1) % 9) + 1;
  if (lp === 11 || lp === 22 || lp === 33) {
    return {
      key: "master",
      accentRgb: "255, 252, 245",
      mandalaStroke: "rgba(255,252,245,0.22)",
      label: "大师辉光",
    };
  }
  if (n === 1 || n === 8 || n === 9) {
    return { key: "moon", accentRgb: "168, 188, 208", mandalaStroke: "rgba(168,188,208,0.34)", label: "月箔场" };
  }
  if (n === 2 || n === 6) {
    return { key: "mist", accentRgb: "186, 176, 210", mandalaStroke: "rgba(186,176,210,0.26)", label: "雾绡场" };
  }
  if (n === 3 || n === 5) {
    return { key: "cerulean", accentRgb: "125, 186, 206", mandalaStroke: "rgba(125,186,206,0.26)", label: "晴灰场" };
  }
  return { key: "jade", accentRgb: "110, 188, 178", mandalaStroke: "rgba(110,188,178,0.24)", label: "青瓷场" };
}
