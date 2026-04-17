/**
 * 命数句库「全量口径收束」：在既有手册正文末尾统一叠一句，与首段高光脚注同向。
 * 由 `numerology-life-path-copy-zh`、`numerology-numeral-master-zh`、`numerology-cross-pair-table-zh` 引用；勿从 `numerology-unified-deep-reading-zh` 反向 import，以免环依赖。
 */

/** 主路径 ·「慢慢拆开」段尾 */
export const NUMEROLOGY_VOICE_TAIL_LP_LOGIC_ZH = `

顺带记：
主路径是一条线；生日数、个人年、姓名三数是另几条线。分开读，别揉成一句贴标签；数以本页为准。`;

/** 生日数（日柱）快照 / 推演段尾 */
export const NUMEROLOGY_VOICE_TAIL_BIRTHDAY_ZH = `

顺带记：
「生日数」只看生日那一天的习惯；姓名里的「灵魂数」是另一回事，别混成一个词。`;

const NAME_LABEL: Record<"expression" | "soulUrge" | "personality", string> = {
  expression: "表现数",
  soulUrge: "灵魂数",
  personality: "人格数",
};

/** 姓名三数（表现 / 灵魂 / 人格）快照 / 推演段尾 */
export function numerologyVoiceTailNameLineZh(kind: keyof typeof NAME_LABEL): string {
  const label = NAME_LABEL[kind];
  return `

顺带记：
「${label}」只从拉丁拼写来；和主路径、生日数、今年个人年分开看。`;
}

/** 交叉表 · 展开段尾（定性 / 戒线 / 行法由 handbook 包层承接，此处只补展开体量） */
export const NUMEROLOGY_VOICE_TAIL_CROSS_UNFOLD_ZH = `

顺带记：
上面这段只讲「主路径 × 今年个人年」；生日数、姓名三数请看上面五个格和第一段长文。`;
