/**
 * 工作台「初始参数」宫位制区块 + 判读参数摘要中与宫位制相关的固定文案：十声部成稿。
 * 声部 1 用基座；2–10 见 PATCH；未命中字段回退基座。
 */

import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

type V = VoiceStyleIdZh;

export type HouseSystemWorkspaceUiZh = {
  sectionTitle: string;
  ariaCommon: string;
  ariaMore: string;
  moreHeading: string;
  expandMoreBar: string;
  collapseMoreBar: string;
  moreListPrefix: string;
  moreListSuffix: string;
  expandMoreLink: string;
  mainstreamParamsSubtitle: string;
  mainstreamParamsDt: string;
  /** 接在三主星星座后、宫制中文名之前，如「；宫位制 整宫制。」 */
  mainstreamBig3HouseSystemLead: string;
};

const BASE: HouseSystemWorkspaceUiZh = {
  sectionTitle: "宫位制（决定宫位切分，影响落宫与主题重心）",
  ariaCommon: "宫位制（常用）",
  ariaMore: "宫位制（更多）",
  moreHeading: "更多宫位制",
  expandMoreBar: "展开更多宫位制",
  collapseMoreBar: "收起更多宫位制",
  moreListPrefix: "当前：",
  moreListSuffix: "（在更多列表中）",
  expandMoreLink: "展开更多",
  mainstreamParamsSubtitle: "主流占星先看口径：宫位制、盘型、相位集与容许度，再进入解释。",
  mainstreamParamsDt: "宫位制",
  mainstreamBig3HouseSystemLead: "；宫位制 ",
};

const PATCH: Partial<Record<V, Partial<HouseSystemWorkspaceUiZh>>> = {
  2: {
    sectionTitle: "宫位制：怎么切十二宫，会直接影响落宫和生活重心往哪儿偏——先在这里选对制式。",
    ariaCommon: "宫位制选择（常用列表）",
    ariaMore: "宫位制选择（更多列表）",
    moreHeading: "更多宫位制选项",
    expandMoreBar: "展开更多宫位制",
    collapseMoreBar: "收起更多宫位制",
    moreListPrefix: "当前选用：",
    moreListSuffix: "（在下方「更多」里）",
    expandMoreLink: "展开更多",
    mainstreamParamsSubtitle: "判读前先对齐口径：宫位制、盘面类型、相位集、容许度，再进入解释。",
    mainstreamParamsDt: "宫位制",
    mainstreamBig3HouseSystemLead: "；本轮宫位制 ",
  },
  3: {
    sectionTitle: "宫位制｜切分规则→落宫/重心",
    ariaCommon: "宫位制·常用",
    ariaMore: "宫位制·更多",
    moreHeading: "更多·宫位制",
    expandMoreBar: "展开·更多宫位制",
    collapseMoreBar: "收起·更多宫位制",
    moreListPrefix: "当前：",
    moreListSuffix: "｜更多列表",
    expandMoreLink: "展开",
    mainstreamParamsSubtitle: "口径序：宫位制→盘型→相位集→容许度→解释。",
    mainstreamParamsDt: "宫位制",
    mainstreamBig3HouseSystemLead: "；宫制 ",
  },
  4: {
    sectionTitle: "宫位制像分幕：幕怎么切，行星落在第几幕、主题往哪偏都会跟着变——先选对分法。",
    ariaCommon: "宫位制（常用分幕）",
    ariaMore: "宫位制（加长名单）",
    moreHeading: "更多分幕方式",
    expandMoreBar: "展开更多宫位制",
    collapseMoreBar: "收起更多宫位制",
    moreListPrefix: "此刻选中：",
    moreListSuffix: "（藏在更多名单里）",
    expandMoreLink: "展开更多",
    mainstreamParamsSubtitle: "先把宫位制、盘面、相位集、容许度四件口径对齐，再听解释。",
    mainstreamParamsDt: "宫位制",
    mainstreamBig3HouseSystemLead: "；所用宫位制 ",
  },
  5: {
    sectionTitle: "宫位制·切分→落宫/重心",
    ariaCommon: "宫制·常用",
    ariaMore: "宫制·更多",
    moreHeading: "更多宫制",
    expandMoreBar: "展开更多",
    collapseMoreBar: "收起更多",
    moreListPrefix: "当前：",
    moreListSuffix: "·更多内",
    expandMoreLink: "展开",
    mainstreamParamsSubtitle: "口径：宫制·盘型·相位·容许度→解释",
    mainstreamParamsDt: "宫制",
    mainstreamBig3HouseSystemLead: "；宫制 ",
  },
  6: {
    sectionTitle:
      "宫位制：决定黄道在本地如何划分为十二宫，从而影响行星落宫与主题重心之判读；请在此选择所采用之制式。",
    ariaCommon: "宫位制选择（常用项）",
    ariaMore: "宫位制选择（扩展项）",
    moreHeading: "扩展宫位制列表",
    expandMoreBar: "展开扩展宫位制",
    collapseMoreBar: "收起扩展宫位制",
    moreListPrefix: "当前选项：",
    moreListSuffix: "（位于扩展列表中）",
    expandMoreLink: "展开扩展列表",
    mainstreamParamsSubtitle:
      "建议优先核对宫位制、盘面类型、相位集合与容许度预设，再进入解释性阅读。",
    mainstreamParamsDt: "宫位制",
    mainstreamBig3HouseSystemLead: "；所采用宫位制 ",
  },
  7: {
    sectionTitle: "宫位制管的是「十二宫怎么切」——切法一变，落宫和重心跟着变，先在这儿选对。",
    ariaCommon: "宫位制（常用的那几个）",
    ariaMore: "宫位制（一长串更多）",
    moreHeading: "更多宫位制",
    expandMoreBar: "展开更多宫位制",
    collapseMoreBar: "收起更多宫位制",
    moreListPrefix: "现在用的是：",
    moreListSuffix: "（在更多里头呢）",
    expandMoreLink: "展开更多",
    mainstreamParamsSubtitle: "先看明白宫位制、啥盘面、相位集、容许度，再往下读解释。",
    mainstreamParamsDt: "宫位制",
    mainstreamBig3HouseSystemLead: "；宫位制 ",
  },
  8: {
    sectionTitle:
      "宫位制用于界定本地地平坐标系下之十二宫划分，将影响行星落宫及议题重心；请于此处选择所采用之制式。",
    ariaCommon: "宫位制（常用选项）",
    ariaMore: "宫位制（更多选项）",
    moreHeading: "更多宫位制选项",
    expandMoreBar: "展开更多宫位制选项",
    collapseMoreBar: "收起更多宫位制选项",
    moreListPrefix: "当前设置：",
    moreListSuffix: "（列于更多选项中）",
    expandMoreLink: "展开更多选项",
    mainstreamParamsSubtitle:
      "宜先明确宫位制、盘面类型、相位集合与容许度配置，再进入解释性段落。",
    mainstreamParamsDt: "宫位制",
    mainstreamBig3HouseSystemLead: "；当前宫位制 ",
  },
  9: {
    sectionTitle: "【宫位制】切分→落宫/主题重心",
    ariaCommon: "【宫位制】常用",
    ariaMore: "【宫位制】更多",
    moreHeading: "【更多】宫位制",
    expandMoreBar: "【展开】更多宫位制",
    collapseMoreBar: "【收起】更多宫位制",
    moreListPrefix: "【当前】",
    moreListSuffix: "【更多列表】",
    expandMoreLink: "【展开】",
    mainstreamParamsSubtitle: "【口径】宫位制·盘型·相位集·容许度→解释",
    mainstreamParamsDt: "【宫位制】",
    mainstreamBig3HouseSystemLead: "；【宫制】",
  },
  10: {
    sectionTitle: "宫位制:切分→落宫",
    ariaCommon: "宫制·常",
    ariaMore: "宫制·多",
    moreHeading: "更多宫制",
    expandMoreBar: "+更多宫制",
    collapseMoreBar: "-更多宫制",
    moreListPrefix: "当前:",
    moreListSuffix: "(更多内)",
    expandMoreLink: "更多",
    mainstreamParamsSubtitle: "口径:宫制·盘·相·容→释",
    mainstreamParamsDt: "宫制",
    mainstreamBig3HouseSystemLead: ";宫制 ",
  },
};

export function houseSystemWorkspaceUiVocal(voice: V): HouseSystemWorkspaceUiZh {
  if (voice === 1) return { ...BASE };
  return { ...BASE, ...PATCH[voice] };
}
