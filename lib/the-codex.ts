export type CodexEntry = {
  key: "anchor" | "spectral" | "phase";
  title: string;
  subtitle: string;
  body: string;
};

/** 本命三主星 + 关系镜像：宇宙观测报告全文语料（与星盘简读同源） */
export {
  NATAL_INSTRUMENT_KNOWLEDGE_SECTIONS,
  type NatalInstrumentKnowledgeSection,
  type NatalInstrumentKnowledgeArticle,
  type NatalInstrumentLayerId,
} from "./natal-instrument-knowledge-zh";

export const THE_CODEX_ENTRIES: readonly CodexEntry[] = [
  {
    key: "anchor",
    title: "频率锚点",
    subtitle: "ANCHOR DECODING",
    body:
      "频率锚点是用于压缩注意力噪声的短时标尺。它不预测未来，而是把当天最有效的决策带宽固定在一个可重复的数值通道里。用户在混乱时重复该锚点，可减少分叉动作。",
  },
  {
    key: "spectral",
    title: "光谱对齐",
    subtitle: "SPECTRAL ALIGNMENT",
    body:
      "光谱是当天情绪阈值的缓冲液。冷色用于降温和收束，暖色用于激活与推进。颜色不是装饰，而是针对场域压力的物理补丁，目的是让系统保持可控。",
  },
  {
    key: "phase",
    title: "相位对冲",
    subtitle: "PHASE HEDGING",
    body:
      "相位对冲用于平衡个体静态底色与当天动态天气。若本命倾向外放而天象要求收束，对冲策略会把行动拆成更小闭环，避免能量泄漏与误判放大。",
  },
];
