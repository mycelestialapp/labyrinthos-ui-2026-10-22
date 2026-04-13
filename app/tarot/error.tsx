"use client";

/**
 * 塔罗段错误页：避免 RSC/ hydration 失败时整页只剩白底却看不到原因。
 * 请把此处 `digest` / 文案与控制台红字一并反馈。
 */
export default function TarotSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        padding: 24,
        backgroundColor: "#0b0510",
        color: "#e5d5b3",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "1.1rem", marginBottom: 12 }}>塔罗页加载失败</h1>
      {error.digest ? (
        <p style={{ fontSize: "0.8rem", opacity: 0.85, marginBottom: 8 }}>digest: {error.digest}</p>
      ) : null}
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: "0.85rem",
          lineHeight: 1.5,
          padding: 12,
          borderRadius: 8,
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(212,175,55,0.25)",
        }}
      >
        {error.message}
      </pre>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          marginTop: 16,
          padding: "10px 18px",
          borderRadius: 8,
          border: "1px solid rgba(212,175,55,0.45)",
          background: "rgba(0,0,0,0.4)",
          color: "#f2e1ba",
          cursor: "pointer",
        }}
      >
        重试
      </button>
      <p style={{ marginTop: 20, fontSize: "0.75rem", opacity: 0.7 }}>
        若反复白屏：终端执行 <code style={{ color: "#cbaf7a" }}>npm run dev:clean</code> 后重开 dev；仍失败请截<strong>控制台第一条红错</strong>。
      </p>
    </div>
  );
}
