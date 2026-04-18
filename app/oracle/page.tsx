import TarotPageGate from "../tarot/TarotPageGate";

/** 神谕卡主区：须 `forceOracle`，否则 SSR 无 window 会误渲染大师 HTML 顶栏与神谕壳叠在一起 */
export default function OracleCardsPage() {
  return <TarotPageGate forceOracle />;
}
