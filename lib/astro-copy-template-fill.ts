/** 文案模板占位符替换：{key} → value。仅用于星盘文案配置层。 */
export function fillCopyTemplate(tpl: string, vars: Record<string, string>): string {
  let out = tpl;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{${k}}`, v);
  }
  return out;
}
