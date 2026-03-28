/**
 * UniverseHub 轻量埋点：不依赖第三方 SDK。
 *
 * - 浏览器内派发 `CustomEvent("labyrinthos:hub", { detail })`，便于自建看板或调试脚本监听。
 * - 若存在 `window.dataLayer`（如后续接 GTM/GA4），自动 push 一条对象，`event` 字段为事件名。
 * - 开发环境 `console.debug` 输出。
 *
 * 监听示例：
 *   window.addEventListener("labyrinthos:hub", (e) => console.log(e.detail));
 */

export type HubAnalyticsPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

export function trackHubEvent(
  name: string,
  payload?: HubAnalyticsPayload,
): void {
  if (typeof window === "undefined") return;

  const ts = Date.now();
  const detail = { name, payload: payload ?? {}, ts };

  try {
    window.dispatchEvent(new CustomEvent("labyrinthos:hub", { detail }));
  } catch {
    /* ignore */
  }

  const win = window as Window & { dataLayer?: Record<string, unknown>[] };
  if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push({
      event: name,
      hub_ts: ts,
      ...(payload ?? {}),
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.debug(`[hub-analytics] ${name}`, payload);
  }
}
