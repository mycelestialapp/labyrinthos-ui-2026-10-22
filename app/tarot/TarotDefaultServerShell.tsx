import type { CSSProperties } from "react";

/**
 * 默认 `/tarot`：纯服务端壳 + iframe，不挂载 `TarotPageClient`。
 * 规避 Next 16 + Turbopack 下整页 `use client` + 多重 `dynamic(ssr:false)` 导致首屏长期白屏（与根 `app/page.tsx` 同因）。
 */
const shell: CSSProperties = {
  /** 仅 minHeight 时，列方向里子项 flex:1 在部分浏览器下分不到剩余高度 → 主区塌成 0 看起来像「整页白」 */
  height: "100dvh",
  minHeight: "100dvh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#0b0510",
  color: "#e5d5b3",
  overflow: "hidden",
};

const header: CSSProperties = {
  position: "relative",
  zIndex: 20,
  flexShrink: 0,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.75rem",
  borderBottom: "1px solid rgba(212, 175, 55, 0.28)",
  background: "rgba(6, 2, 12, 0.75)",
  padding: "0.75rem 1rem",
  backdropFilter: "blur(12px)",
};

const linkBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  borderRadius: "9999px",
  border: "1px solid rgba(212, 175, 55, 0.35)",
  background: "rgba(0, 0, 0, 0.35)",
  padding: "0.35rem 0.75rem",
  fontSize: "0.75rem",
  color: "#d4b68a",
  textDecoration: "none",
};

const linkGhost: CSSProperties = {
  ...linkBase,
  border: "1px solid rgba(212, 175, 55, 0.25)",
  background: "rgba(0, 0, 0, 0.25)",
  color: "#cbaf7a",
};

const title: CSSProperties = {
  minWidth: 0,
  flex: 1,
  textAlign: "center",
  fontSize: "11px",
  letterSpacing: "0.05em",
  color: "#b6974b",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export default function TarotDefaultServerShell() {
  return (
    <div style={shell}>
      {process.env.NODE_ENV === "development" ? (
        <div
          style={{
            flexShrink: 0,
            fontSize: 13,
            lineHeight: 1.35,
            fontWeight: 600,
            color: "#1a1205",
            background: "#e8c547",
            padding: "8px 12px",
            textAlign: "center",
          }}
        >
          开发模式：若你能看到这条黄条，说明塔罗壳已渲染。DevTools 里请点「Console」左侧的「Elements / 元素」看 HTML 树。
        </div>
      ) : null}
      <header style={header}>
        <a href="/hub" style={linkBase}>
          ← 星云
        </a>
        <a href="/tarot?lab=1" style={linkGhost}>
          React 分层版
        </a>
        <span style={title}>圣域塔罗 · 大师 HTML 原版</span>
      </header>
      <iframe
        title="圣域塔罗大师版"
        src="/tarot-master.html?v=115lock"
        style={{
          flex: "1 1 0",
          minHeight: 0,
          width: "100%",
          border: 0,
          backgroundColor: "#0b0510",
        }}
        allow="fullscreen"
      />
    </div>
  );
}
