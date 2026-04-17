/** 坛城数轨 Client Shell 内即时切页（与 NumerologyWorkspaceShell 监听一致） */

export const NUMEROLOGY_INSTANT_NAV_EVENT = "numerology:instant-nav";

function normalizePath(input: string | null | undefined): string {
  return (input ?? "/").replace(/\/$/, "") || "/";
}

export function numerologyInstantNavigate(path: string): void {
  if (typeof window === "undefined") return;
  const next = normalizePath(path);
  const curr = normalizePath(window.location.pathname);
  if (next === curr) {
    window.dispatchEvent(new Event(NUMEROLOGY_INSTANT_NAV_EVENT));
    return;
  }
  window.history.pushState({ numerologyInstant: true }, "", next);
  window.dispatchEvent(new Event(NUMEROLOGY_INSTANT_NAV_EVENT));
}
