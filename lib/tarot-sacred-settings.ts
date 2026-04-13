/** 与 Dmy-projects 同键：若曾在旧站关闭逆位，此处会读到同一偏好 */
const TAROT_ALLOW_REVERSED_KEY = "tarot_allow_reversed";

export function getTarotAllowReversed(): boolean {
  try {
    return localStorage.getItem(TAROT_ALLOW_REVERSED_KEY) !== "0";
  } catch {
    return true;
  }
}

export function setTarotAllowReversed(allow: boolean): void {
  try {
    localStorage.setItem(TAROT_ALLOW_REVERSED_KEY, allow ? "1" : "0");
  } catch {
    /* ignore */
  }
}
