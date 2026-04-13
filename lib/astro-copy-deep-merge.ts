/**
 * 浅层对象递归合并：用于盘型句库 patch 叠在出生盘基座上。
 * 数组与 null 按覆盖处理，不逐项合并。
 */
export function deepMergePlain<T extends object>(base: T, patch: object | undefined): T {
  if (!patch || typeof patch !== "object") return base;
  const out = { ...base } as Record<string, unknown>;
  for (const [k, pv] of Object.entries(patch)) {
    if (pv === undefined) continue;
    const bv = (base as Record<string, unknown>)[k];
    if (
      pv !== null &&
      typeof pv === "object" &&
      !Array.isArray(pv) &&
      bv !== null &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[k] = deepMergePlain(bv as object, pv as object);
    } else {
      out[k] = pv;
    }
  }
  return out as T;
}
