/**
 * 占卜问题文本统一归一化：分类关键词、主题指引、雷诺曼母题等共用，
 * 避免各模块各自 strip 导致口径漂移。
 */
export function normalizeQuestionTextZh(raw: string): string {
  return (raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[，。！？、；：,.!?;:()（）【】\[\]'"“”‘’《》<>\/\\|+-_=~`@#$%^&*]/g, "");
}
