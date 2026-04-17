/**
 * 寰宇之门页内锚点：供个人星图等子页「直达对照」。
 * 与 `NumerologyGateView` 中 `id` 保持一致。
 */
export const NUMEROLOGY_GATE_ANCHOR = {
  /** 首屏「关键读数」整卡（含栅格） */
  kpi: "numerology-gate-kpi",
  /** 「读数分层」大标题所在卡 */
  readout: "numerology-gate-readout",
  /** 读数分层 · 第一段：高光 + 手册 + 推演（原 1、2 步合并） */
  layerListen: "numerology-layer-listen",
  /** 读数分层 · 第二段：对数备忘表 + 带走几句（原 3、4 步合并） */
  layerSettle: "numerology-layer-settle",
} as const;

export function numerologyGateHref(anchor: (typeof NUMEROLOGY_GATE_ANCHOR)[keyof typeof NUMEROLOGY_GATE_ANCHOR]): string {
  return `/numerology#${anchor}`;
}
