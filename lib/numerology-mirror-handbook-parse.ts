/**
 * 将镜鉴/手册体字符串（以【…】分行）解析为可排版片段，供 UI 分层展示。
 */

export type MirrorHandbookSegment = {
  /** 去掉【】后的完整标签，如「镜鉴·定性·扉页」 */
  labelFull: string;
  /** 用户可见短题（取末段并映射），空则整段只出正文 */
  labelDisplay: string;
  body: string;
};

/** 主路径 / 日柱 / 姓名三数手册：小节题在 UI 中隐藏，正文顺读如口述 */
const HIDDEN_MANUAL_SUBTAILS = new Set([
  "一眼",
  "内里",
  "外场",
  "收口",
  "来由",
  "旁线",
  "今年这句",
  "定盘",
  "心局",
  "世面",
  "收刃",
  "术脉",
  "辅影",
  "年课",
]);

const SUBLABEL_DISPLAY_ZH: Record<string, string> = {
  /** 与卡顶大标题重复时隐藏 */
  展开: "",
  戒线: "",
  行法: "",
  侧写: "",
  扉页: "定场",
  定盘: "正读",
  总断: "收束",
  起势: "起势",
  纵深: "纵深",
  关钥: "关钥",
  全幅: "通读",
  条文: "条文",
  条目: "条目",
  行证: "对读",
  跟读: "跟读",
};

function labelToDisplay(full: string): string {
  if (!full) return "";
  const parts = full.split("·");
  const tail = parts[parts.length - 1] ?? full;
  if (tail === "手册") return "";
  const head = parts[0] ?? "";
  if (parts.length >= 3 && /^(主路径|日柱|表现|灵魂|人格)$/.test(head) && HIDDEN_MANUAL_SUBTAILS.has(tail)) {
    return "";
  }
  const useMirrorMap = full.startsWith("镜鉴·") || full.startsWith("原始读数·");
  if (!useMirrorMap) return tail;
  return SUBLABEL_DISPLAY_ZH[tail] ?? tail;
}

/**
 * 按行扫描：独占一行的【…】开启新段，其后非【行并入该段正文。
 */
export function parseMirrorHandbookText(text: string): MirrorHandbookSegment[] {
  const lines = text.split("\n");
  const out: MirrorHandbookSegment[] = [];
  let labelFull = "";
  const bodyLines: string[] = [];

  const flush = () => {
    const body = bodyLines.join("\n").trim();
    const labelDisplay = labelToDisplay(labelFull);
    if (!labelFull && !body) return;
    if (labelFull && !body && !labelDisplay) return;
    out.push({ labelFull, labelDisplay, body });
    labelFull = "";
    bodyLines.length = 0;
  };

  for (const raw of lines) {
    const t = raw.trim();
    if (!t) continue;
    if (/^【[^】]+】$/.test(t)) {
      flush();
      labelFull = t.slice(1, -1);
    } else {
      bodyLines.push(t);
    }
  }
  flush();
  return out.filter((s) => s.body || s.labelDisplay);
}
