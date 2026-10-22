/**
 * 19 大类方向胶囊注册表：一点开铺该组全部现场题。
 */
import type { TarotDirTab } from "./tarot-question-dir-filter-zh";
import { LOVE_DEFAULT_FILTER_ID, LOVE_FILTER_TABS, loveSurfacesForFilter } from "./tarot-question-love-framework-zh";
import { CAREER_DEFAULT_FILTER_ID, CAREER_FILTER_TABS, careerSurfacesForFilter } from "./tarot-question-career-framework-zh";
import { MONEY_DEFAULT_FILTER_ID, MONEY_FILTER_TABS, moneySurfacesForFilter } from "./tarot-question-money-framework-zh";
import { STUDY_DEFAULT_FILTER_ID, STUDY_FILTER_TABS, studySurfacesForFilter } from "./tarot-question-study-framework-zh";
import { HEALTH_DEFAULT_FILTER_ID, HEALTH_FILTER_TABS, healthSurfacesForFilter } from "./tarot-question-health-framework-zh";
import { PET_DEFAULT_FILTER_ID, PET_FILTER_TABS, petSurfacesForFilter } from "./tarot-question-pet-framework-zh";
import { REL_DEFAULT_FILTER_ID, REL_FILTER_TABS, relSurfacesForFilter } from "./tarot-question-rel-framework-zh";
import { CHILD_DEFAULT_FILTER_ID, CHILD_FILTER_TABS, childSurfacesForFilter } from "./tarot-question-child-framework-zh";
import { CHOICE_DEFAULT_FILTER_ID, CHOICE_FILTER_TABS, choiceSurfacesForFilter } from "./tarot-question-choice-framework-zh";
import { TRAVEL_DEFAULT_FILTER_ID, TRAVEL_FILTER_TABS, travelSurfacesForFilter } from "./tarot-question-travel-framework-zh";
import { LEGAL_DEFAULT_FILTER_ID, LEGAL_FILTER_TABS, legalSurfacesForFilter } from "./tarot-question-legal-framework-zh";
import { LOST_DEFAULT_FILTER_ID, LOST_FILTER_TABS, lostSurfacesForFilter } from "./tarot-question-lost-framework-zh";
import { DREAM_DEFAULT_FILTER_ID, DREAM_FILTER_TABS, dreamSurfacesForFilter } from "./tarot-question-dream-framework-zh";
import { FENG_DEFAULT_FILTER_ID, FENG_FILTER_TABS, fengSurfacesForFilter } from "./tarot-question-feng-framework-zh";
import { PROXY_DEFAULT_FILTER_ID, PROXY_FILTER_TABS, proxySurfacesForFilter } from "./tarot-question-proxy-framework-zh";
import { SPIRIT_DEFAULT_FILTER_ID, SPIRIT_FILTER_TABS, spiritSurfacesForFilter } from "./tarot-question-spirit-framework-zh";
import { OTHER_DEFAULT_FILTER_ID, OTHER_FILTER_TABS, otherSurfacesForFilter } from "./tarot-question-other-framework-zh";
import { PSY_DEFAULT_FILTER_ID, PSY_FILTER_TABS, psySurfacesForFilter } from "./tarot-question-psy-framework-zh";
import { ADVICE_DEFAULT_FILTER_ID, ADVICE_FILTER_TABS, adviceSurfacesForFilter } from "./tarot-question-advice-framework-zh";

export type TarotDirRegistryEntry = {
  defaultId: string;
  tabs: readonly TarotDirTab[];
  surfacesForFilter: (
    filterId: string,
    groups: ReadonlyArray<{ label: string; surface: readonly string[] }>,
  ) => string[];
  hint: string;
};

function entry(
  defaultId: string,
  tabs: readonly TarotDirTab[],
  surfacesForFilter: TarotDirRegistryEntry["surfacesForFilter"],
  hint: string,
): TarotDirRegistryEntry {
  return { defaultId, tabs, surfacesForFilter, hint };
}

export const TAROT_DIR_BY_CATEGORY: Record<string, TarotDirRegistryEntry> = {
  感情婚姻: entry(LOVE_DEFAULT_FILTER_ID, LOVE_FILTER_TABS, loveSurfacesForFilter, "塔罗更擅长行动建议，而不是简单 yes/no 或精确时间。把问题落在「我能做什么」往往更有帮助。"),
  事业工作: entry(CAREER_DEFAULT_FILTER_ID, CAREER_FILTER_TABS, careerSurfacesForFilter, "牌面更擅长取舍与行动建议，而不是单纯成败预测。建议聚焦「如何调整、可以做什么」。"),
  财运投资: entry(MONEY_DEFAULT_FILTER_ID, MONEY_FILTER_TABS, moneySurfacesForFilter, "牌面更擅长取舍与节奏，报不了点位，也打不了回本包票。问「先还是先留、现在动不动」更有用。"),
  学业考试: entry(STUDY_DEFAULT_FILTER_ID, STUDY_FILTER_TABS, studySurfacesForFilter, "牌面更擅长取舍与节奏，报不了分数，也打不了过关包票。问「现在补哪头、这条还押不押」更有用。"),
  身体健康: entry(HEALTH_DEFAULT_FILTER_ID, HEALTH_FILTER_TABS, healthSurfacesForFilter, "牌面帮你看节奏和取舍，替代不了就诊。问「今晚去不去、复查还要不要拖」更有用。"),
  宠物: entry(PET_DEFAULT_FILTER_ID, PET_FILTER_TABS, petSurfacesForFilter, "牌面帮你看照护和取舍，替代不了就诊。问「今晚送不送、还找不找」更有用。"),
  人际关系: entry(REL_DEFAULT_FILTER_ID, REL_FILTER_TABS, relSurfacesForFilter, "牌面更擅长边界和怎么开口，报不了对方会改。问「这句说不说、这趟还去不去」更有用。"),
  出行迁居: entry(TRAVEL_DEFAULT_FILTER_ID, TRAVEL_FILTER_TABS, travelSurfacesForFilter, "牌面帮你看走与留、窗口和路上哪一段。问「今晚还走不走、这趟还去不去」更有用。"),
  官司法律: entry(LEGAL_DEFAULT_FILTER_ID, LEGAL_FILTER_TABS, legalSurfacesForFilter, "牌面帮你看取舍和节奏，替代不了律师。问「现在递不递、和解还是打」更有用。"),
  生育子女: entry(CHILD_DEFAULT_FILTER_ID, CHILD_FILTER_TABS, childSurfacesForFilter, "牌面帮你看节奏和分工，替代不了产检。问「还查不查、这门砍不砍」更有用。"),
  失物寻找: entry(LOST_DEFAULT_FILTER_ID, LOST_FILTER_TABS, lostSurfacesForFilter, "牌面帮你看先翻哪一层、还要不要耗。问「还能找回吗、往哪找、丢了还是被偷」更有用；钥匙手机先定位／挂失，报警帮不上找回。"),
  选择决策: entry(CHOICE_DEFAULT_FILTER_ID, CHOICE_FILTER_TABS, choiceSurfacesForFilter, "牌面帮你看选项、恐惧和退出成本。问「今晚签不签、两条路还并不并」更有用。"),
  占梦境: entry(DREAM_DEFAULT_FILTER_ID, DREAM_FILTER_TABS, dreamSurfacesForFilter, "牌面把梦接到白天那一件事。问「醒来先处理哪件、这个反复还要不要记」更有用。"),
  占风水: entry(FENG_DEFAULT_FILTER_ID, FENG_FILTER_TABS, fengSurfacesForFilter, "牌面看睡、坐、门口和动线。问「这张床还睡不睡得着、工位还要不要换」更有用。"),
  代人问卜: entry(PROXY_DEFAULT_FILTER_ID, PROXY_FILTER_TABS, proxySurfacesForFilter, "牌面帮你看能帮到哪、要不要开口。问「告诉不告诉、身体会不会先松」更有用。"),
  灵性成长: entry(SPIRIT_DEFAULT_FILTER_ID, SPIRIT_FILTER_TABS, spiritSurfacesForFilter, "牌面帮你看停哪一件、留哪一口。问「今晚还刷不刷、这句软的说不说」更有用。"),
  其他: entry(OTHER_DEFAULT_FILTER_ID, OTHER_FILTER_TABS, otherSurfacesForFilter, "牌面帮你看时机和先做哪一步。问「再等还是动手、这件事还投不投」更有用。"),
  心理疏导: entry(PSY_DEFAULT_FILTER_ID, PSY_FILTER_TABS, psySurfacesForFilter, "牌面帮你看内在天气和边界，替代不了专业陪伴。问「这句界限说不说、咨询这门推不推」更有用。"),
  人生建议: entry(ADVICE_DEFAULT_FILTER_ID, ADVICE_FILTER_TABS, adviceSurfacesForFilter, "牌面帮你看主线和该放下的那一口。问「这一件最该认真、忙碌是不是在躲」更有用。"),
};

export const TAROT_FILTERS_BY_CATEGORY: Record<string, readonly TarotDirTab[]> = Object.fromEntries(
  Object.entries(TAROT_DIR_BY_CATEGORY).map(([id, row]) => [id, row.tabs]),
);
