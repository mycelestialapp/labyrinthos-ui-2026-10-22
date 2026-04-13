import type { LifeSixMasterCategoryId } from "./tarot-master-question-content-life-categories";
import { LIFE_SIX_MASTER_CATEGORY_IDS } from "./tarot-master-question-content-life-categories";

/** 圣殿展开六大类时顶栏一句：冷峻、可执行、不替专业下断 */
export const LIFE_SIX_SANCTUM_MASTER_HINT_ZH: Record<LifeSixMasterCategoryId, string> = {
  身体健康: "题干须与冻结核逐字一致；牌面为就诊前 rehearsal，处置以执业医疗与书面医嘱为准。",
  人际关系: "题干须逐字一致；牌面拆边界、话术与代价，不作关系终裁。",
  生育子女: "题干须逐字一致；牌面排风险与分工，不择养育路线、不代判医疗学业。",
  选择决策: "题干须逐字一致；牌面清点选项、恐惧与退出成本；签字与法律责任仍归你。",
  宠物: "题干须逐字一致；牌面论照护与就医取舍，不替兽医下诊断。",
  灵性成长: "题干须逐字一致；牌面锚定觉察与行为阈值，不就教义与命运下全称判断。",
};

export function lifeSixSanctumMasterHintZh(categoryId: string): string | null {
  if (!(LIFE_SIX_MASTER_CATEGORY_IDS as readonly string[]).includes(categoryId)) return null;
  return LIFE_SIX_SANCTUM_MASTER_HINT_ZH[categoryId as LifeSixMasterCategoryId];
}

/** 分层解读区底栏（全类共用） */
export const TAROT_SANCTUARY_READING_FOOTNOTE_ZH =
  "读牌为复盘框架；医疗、法律、财务须征询持牌专业。";
