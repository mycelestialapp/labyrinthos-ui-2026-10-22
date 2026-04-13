import type { TarotDrawnCard } from "@/lib/tarot-seeded-draw";
import type { TarotSpreadId } from "@/lib/tarot-deck-zh";
import { TAROT_SPREADS } from "@/lib/tarot-deck-zh";

function orientZh(reversed: boolean): string {
  return reversed ? "逆位" : "正位";
}

export type TarotLayeredReadingZh = {
  snapshot: string;
  spreadLogic: string;
  rawTable: string;
  actions: string;
};

export function buildTarotLayeredReadingZh(
  spreadId: TarotSpreadId,
  questionTrim: string,
  drawn: TarotDrawnCard[],
): TarotLayeredReadingZh {
  const spread = TAROT_SPREADS.find((s) => s.id === spreadId) ?? TAROT_SPREADS[0]!;
  const q = questionTrim || "（未填写具体问题，以下按牌阵泛读）";

  const linesRaw = drawn.map((d, i) => {
    const pos = spread.positionLabelsZh[i] ?? `位置 ${i + 1}`;
    return `${pos}：${d.card.nameZh}·${orientZh(d.reversed)}（${d.card.gistZh}）`;
  });

  const snapshotParts = drawn.map((d, i) => {
    const pos = spread.positionLabelsZh[i] ?? `位${i + 1}`;
    const tone = d.reversed ? "向内收、需回看惯性" : "向外展、可顺势推进";
    return `${pos}抽到「${d.card.nameZh}」${orientZh(d.reversed)}：${d.card.gistZh}；${tone}。`;
  });

  const snapshot =
    `你在问：${q} ` +
    snapshotParts.join(" ") +
    " 命题收束在可核对的趋势与张力，不作代决断语。";

  const spreadLogic =
    spreadId === "single"
      ? `单牌读法：把「${drawn[0]!.card.nameZh}」当作当前议题的镜面——${drawn[0]!.reversed ? "逆位强调内收、延迟或旧模式回访。" : "正位强调外在可动与显性线索。"} 与问题逐句对照：哪些是事实、哪些是情绪投射，先分开再谈下一步。`
      : `三牌时间流：过去基底锚定「怎么走到今天」，当下现场抓「此刻真正在消耗你的是什么」，趋向可能提示「若维持现状，惯性会把线头引向哪」。` +
        drawn
          .map((d, i) => {
            const pos = spread.positionLabelsZh[i]!;
            return ` ${pos}为「${d.card.nameZh}」${orientZh(d.reversed)}：${d.reversed ? "此段宜收束、复盘、改参数。" : "此段可试探动作、小步验证。"}`;
          })
          .join("");

  const rawTable = ["【牌面读数】", ...linesRaw, "", "每条结论均可回溯到上表对应位置与正逆位。"].join("\n");

  const actions = [
    "把问题改写成一句可验证的目标：本周能做到的最小一步是什么。",
    drawn.some((d) => d.reversed)
      ? "逆位偏多：优先睡眠与日程上限，再谈重大承诺。"
      : "正位偏多：可安排一次小范围试水，不必一次押满。",
    "深度关系或合作里，底线、许可与止损仍须说清；牌面只给参照，不给免责。",
  ].join("\n");

  return { snapshot, spreadLogic, rawTable, actions };
}

export function tarotReadingMarkdownZh(
  spreadLabel: string,
  layered: TarotLayeredReadingZh,
): string {
  return [
    "## 塔罗 · 分层解读",
    "",
    `牌阵：${spreadLabel}`,
    "",
    "### 【核心快照】",
    layered.snapshot,
    "",
    "### 【牌阵推演】",
    layered.spreadLogic,
    "",
    "### 【原始读数】",
    layered.rawTable,
    "",
    "### 【执行备忘】",
    layered.actions,
  ].join("\n");
}
