import TarotPageGate from "../TarotPageGate";

/** React 仪式 / 分层 / 神谕等变体：由根 `middleware` 将 `/tarot?…` 含参 rewrite 至此，避免 `/tarot` 主文档挂 async + searchParams。 */
export default function TarotAppPage() {
  return (
    <div
      className="min-h-[100dvh] bg-[#0b0510] text-[#e5d5b3]"
      style={{ minHeight: "100dvh", backgroundColor: "#0b0510", color: "#e5d5b3" }}
    >
      <TarotPageGate />
    </div>
  );
}
