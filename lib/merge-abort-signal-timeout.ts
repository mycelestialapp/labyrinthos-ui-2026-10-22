/**
 * 把调用方 AbortSignal 与「最长等待」合并，超时后中止 fetch。
 * 避免请求在开发环境/上游卡住时无限 pending —— Chromium 会一直显示标签页加载中。
 */
export function mergeAbortSignalWithDeadline(signal: AbortSignal | undefined, ms: number): AbortSignal {
  let deadline: AbortSignal;
  const timeoutFn = (AbortSignal as unknown as { timeout?: (n: number) => AbortSignal }).timeout;
  if (typeof timeoutFn === "function") {
    deadline = timeoutFn.call(AbortSignal, ms);
  } else {
    const c = new AbortController();
    setTimeout(() => c.abort(), ms);
    deadline = c.signal;
  }
  if (!signal) return deadline;
  const anyFn = (AbortSignal as unknown as { any?: (signals: AbortSignal[]) => AbortSignal }).any;
  if (typeof anyFn === "function") {
    return anyFn.call(AbortSignal, [signal, deadline]);
  }
  return deadline;
}
