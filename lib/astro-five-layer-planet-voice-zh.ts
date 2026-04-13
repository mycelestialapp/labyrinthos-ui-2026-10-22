/**
 * 五联观测·行星：「本表在说什么」与矩阵标题，按 ChartKind × 声部 各 10 套成稿。
 * 本命盘不在此表覆盖（用句库基座默认句）。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const SYNASTRY_NOTE = "（主轮为案主本命；双人咬合见合盘 Tab。）";

type Row = { planetStatus: string; planetMatrix: string };

const SYN: Record<VoiceStyleIdZh, Row> = {
  1: {
    planetStatus: `本表在说什么：案主本命里行星主要落在生活的哪几块——精力都往哪儿堆。${SYNASTRY_NOTE}`,
    planetMatrix: "全系统参数阵列：Planetary Matrix（来源：案主本命盘行星位置）",
  },
  2: {
    planetStatus: `本表在说什么：先看案主自己——行星多在哪些生活分工上用力，心里就有底。双人怎么咬合再开合盘。${SYNASTRY_NOTE}`,
    planetMatrix: "行星落宫一览：Planetary Matrix（数据：案主本命盘行星位置）",
  },
  3: {
    planetStatus: `本表在说什么：案主这张本命里，星星主要蹲在哪些宫位＝最近最容易累、也最容易有戏的地方。${SYNASTRY_NOTE}`,
    planetMatrix: "行星矩阵：Planetary Matrix（读数来源：案主本命盘行星位置）",
  },
  4: {
    planetStatus: `本表在说什么：把案主当成故事主角——行星落在哪些章节，剧情就更常在那儿发生。${SYNASTRY_NOTE}`,
    planetMatrix: "行星章节表：Planetary Matrix（来源：案主本命盘行星位置）",
  },
  5: {
    planetStatus: `本表在说什么：【案主分区】行星主要占用哪些宫位＝精力堆叠点。${SYNASTRY_NOTE}`,
    planetMatrix: "【行星矩阵】Planetary Matrix（案主本命盘）",
  },
  6: {
    planetStatus: `本表在说什么：统计上看，案主本命行星更常落在哪些宫位——通常也是压力与成就感的来源。${SYNASTRY_NOTE}`,
    planetMatrix: "行星分布矩阵：Planetary Matrix（来源：案主本命盘行星位置）",
  },
  7: {
    planetStatus: `本表在说什么：说白了，案主最近最忙活的生活块是哪几格——星星都蹲那儿呢。${SYNASTRY_NOTE}`,
    planetMatrix: "行星蹲点表：Planetary Matrix（案主本命盘里行星在哪儿）",
  },
  8: {
    planetStatus: `本表在说什么：这是一份「生活负荷分布」——案主行星落在哪些宫，哪些事就更常找上门。${SYNASTRY_NOTE}`,
    planetMatrix: "行星负荷矩阵：Planetary Matrix（来源：案主本命盘行星位置）",
  },
  9: {
    planetStatus: `本表在说什么：像翻地图——案主行星标在哪些宫，人生剧情就更常在那些段落上演。${SYNASTRY_NOTE}`,
    planetMatrix: "行星地图矩阵：Planetary Matrix（来源：案主本命盘行星位置）",
  },
  10: {
    planetStatus: `本表在说什么：案主｜行星落宫＝最吵最忙最显眼的生活块。${SYNASTRY_NOTE}`,
    planetMatrix: "Planetary Matrix｜案主本命行星位置",
  },
};

const TR: Record<VoiceStyleIdZh, Row> = {
  1: {
    planetStatus:
      "本表在说什么：当下天象里行星落在哪些生活领域——像看此刻哪里在亮灯，用来对照本命，不当终身定调。",
    planetMatrix: "全系统参数阵列：Planetary Matrix（来源：当前行运盘行星位置）",
  },
  2: {
    planetStatus:
      "本表在说什么：这一张行运盘上，星星这会儿主要待在哪些宫位——用来对照你的本命故事，别一次盖棺定论。",
    planetMatrix: "行星落宫一览：Planetary Matrix（数据：当前行运盘行星位置）",
  },
  3: {
    planetStatus:
      "本表在说什么：行运窗口里，行星主要点亮哪些生活块——像天气图，记得对照本命地形。",
    planetMatrix: "行星矩阵：Planetary Matrix（读数来源：行运盘行星位置）",
  },
  4: {
    planetStatus:
      "本表在说什么：此刻剧情更常在哪些章节上演——看行运行星落在哪几宫；本命是底色，行运是当下镜头。",
    planetMatrix: "行星章节表：Planetary Matrix（来源：行运盘行星位置）",
  },
  5: {
    planetStatus:
      "本表在说什么：【行运】行星占用宫位＝此刻亮灯区；对照本命，不当判决书。",
    planetMatrix: "【行星矩阵】Planetary Matrix（行运盘）",
  },
  6: {
    planetStatus:
      "本表在说什么：从结构上看，当前行运行星更常落在哪些宫位——用于理解短期张力分布，需回到本命核对。",
    planetMatrix: "行星分布矩阵：Planetary Matrix（来源：行运盘行星位置）",
  },
  7: {
    planetStatus:
      "本表在说什么：说白了，这几天天象最折腾你生活哪几块——星星落宫先指路，本命再解释为啥敏感。",
    planetMatrix: "行星蹲点表：Planetary Matrix（行运盘里行星在哪儿）",
  },
  8: {
    planetStatus:
      "本表在说什么：行运带来的「短期负荷」主要落在哪些宫——用来安排节奏，不是改写整个人生脚本。",
    planetMatrix: "行星负荷矩阵：Planetary Matrix（来源：行运盘行星位置）",
  },
  9: {
    planetStatus:
      "本表在说什么：像看当下这一章——行运行星写在哪些宫位，情节就更响；对照本命读前后文。",
    planetMatrix: "行星地图矩阵：Planetary Matrix（来源：行运盘行星位置）",
  },
  10: {
    planetStatus: "本表在说什么：行运｜行星落宫＝此刻最亮的生活块；对照本命。",
    planetMatrix: "Planetary Matrix｜行运盘行星位置",
  },
};

const EP: Record<VoiceStyleIdZh, Row> = {
  1: {
    planetStatus: "本表在说什么：指定时刻的天空里，行星落在哪些宫位——给事件现场切片，不接终身结论。",
    planetMatrix: "全系统参数阵列：Planetary Matrix（来源：时刻盘行星位置）",
  },
  2: {
    planetStatus: "本表在说什么：这一刻的天空快照里，行星待在哪些宫——用来理解现场接口，不当做人格判决书。",
    planetMatrix: "行星落宫一览：Planetary Matrix（数据：时刻盘行星位置）",
  },
  3: {
    planetStatus: "本表在说什么：时刻盘上，星星主要落在哪些生活领域——像现场布灯，只看切片。",
    planetMatrix: "行星矩阵：Planetary Matrix（读数来源：时刻盘行星位置）",
  },
  4: {
    planetStatus: "本表在说什么：这一帧画面里，剧情更响的宫位在哪——看行星落点；别把它扩成终身叙事。",
    planetMatrix: "行星章节表：Planetary Matrix（来源：时刻盘行星位置）",
  },
  5: {
    planetStatus: "本表在说什么：【时刻切片】行星宫位＝现场焦点区。",
    planetMatrix: "【行星矩阵】Planetary Matrix（时刻盘）",
  },
  6: {
    planetStatus: "本表在说什么：该时刻下行星分布指向哪些宫位——用于事件力学描述，不接长期标签。",
    planetMatrix: "行星分布矩阵：Planetary Matrix（来源：时刻盘行星位置）",
  },
  7: {
    planetStatus: "本表在说什么：说白了，这一刻最显眼的生活块是哪儿——星星落宫先点名。",
    planetMatrix: "行星蹲点表：Planetary Matrix（时刻盘里行星在哪儿）",
  },
  8: {
    planetStatus: "本表在说什么：现场「短负荷」主要落在哪些宫——帮助判断当下接口，不做终身定调。",
    planetMatrix: "行星负荷矩阵：Planetary Matrix（来源：时刻盘行星位置）",
  },
  9: {
    planetStatus: "本表在说什么：像截一张剧照——行星落在哪些宫，现场戏就更集中；别当成整部电影。",
    planetMatrix: "行星地图矩阵：Planetary Matrix（来源：时刻盘行星位置）",
  },
  10: {
    planetStatus: "本表在说什么：时刻盘｜行星落宫＝现场最响块。",
    planetMatrix: "Planetary Matrix｜时刻盘行星位置",
  },
};

const SEC: Record<VoiceStyleIdZh, Row> = {
  1: {
    planetStatus: "本表在说什么：次限推进盘上行星落宫——年尺度里，心里剧情更贴生活的哪几块。",
    planetMatrix: "全系统参数阵列：Planetary Matrix（来源：次限推运盘行星位置）",
  },
  2: {
    planetStatus: "本表在说什么：次限盘上，行星这几年主要待在哪些宫位——看年景里的主线，不当每日天气预报。",
    planetMatrix: "行星落宫一览：Planetary Matrix（数据：次限推运盘行星位置）",
  },
  3: {
    planetStatus: "本表在说什么：年尺度推进里，星星主要点亮哪些生活块——用来理解慢变量。",
    planetMatrix: "行星矩阵：Planetary Matrix（读数来源：次限盘行星位置）",
  },
  4: {
    planetStatus: "本表在说什么：这几年剧情更厚的章节在哪——看次限行星落宫；拆成季、再拆成周去读。",
    planetMatrix: "行星章节表：Planetary Matrix（来源：次限盘行星位置）",
  },
  5: {
    planetStatus: "本表在说什么：【次限】行星宫位＝年景主负载区。",
    planetMatrix: "【行星矩阵】Planetary Matrix（次限盘）",
  },
  6: {
    planetStatus: "本表在说什么：次限盘上行星分布指向哪些宫位——用于年尺度张力描述，需配合日常节奏拆解。",
    planetMatrix: "行星分布矩阵：Planetary Matrix（来源：次限盘行星位置）",
  },
  7: {
    planetStatus: "本表在说什么：说白了，这几年你最常在哪些生活块里打转——次限行星先画大圈。",
    planetMatrix: "行星蹲点表：Planetary Matrix（次限盘里行星在哪儿）",
  },
  8: {
    planetStatus: "本表在说什么：年尺度「慢负荷」主要落在哪些宫——帮助安排阶段目标，不是今日指令。",
    planetMatrix: "行星负荷矩阵：Planetary Matrix（来源：次限盘行星位置）",
  },
  9: {
    planetStatus: "本表在说什么：像读长篇——次限行星落在哪些宫，这几年就更像哪几卷；别用一章判全书。",
    planetMatrix: "行星地图矩阵：Planetary Matrix（来源：次限盘行星位置）",
  },
  10: {
    planetStatus: "本表在说什么：次限｜行星落宫＝年景主块。",
    planetMatrix: "Planetary Matrix｜次限盘行星位置",
  },
};

const TER: Record<VoiceStyleIdZh, Row> = {
  1: {
    planetStatus: "本表在说什么：三限推进盘上落宫——月尺度里，注意力更容易挂在哪几块生活。",
    planetMatrix: "全系统参数阵列：Planetary Matrix（来源：三限推运盘行星位置）",
  },
  2: {
    planetStatus: "本表在说什么：三限盘上，这几周行星主要落在哪些宫位——看短窗里的主线，不当终身定调。",
    planetMatrix: "行星落宫一览：Planetary Matrix（数据：三限推运盘行星位置）",
  },
  3: {
    planetStatus: "本表在说什么：月尺度里，星星主要点亮哪些生活块——用来理解这几周的手感。",
    planetMatrix: "行星矩阵：Planetary Matrix（读数来源：三限盘行星位置）",
  },
  4: {
    planetStatus: "本表在说什么：这几周剧情更响的章节在哪——看三限行星落宫；别一次写成命运结论。",
    planetMatrix: "行星章节表：Planetary Matrix（来源：三限盘行星位置）",
  },
  5: {
    planetStatus: "本表在说什么：【三限】行星宫位＝几周窗口主负载。",
    planetMatrix: "【行星矩阵】Planetary Matrix（三限盘）",
  },
  6: {
    planetStatus: "本表在说什么：三限盘上行星分布指向哪些宫位——用于月尺度张力描述，宜按周拆解。",
    planetMatrix: "行星分布矩阵：Planetary Matrix（来源：三限盘行星位置）",
  },
  7: {
    planetStatus: "本表在说什么：说白了，这几周你最常在哪些生活块里忙——三限行星先指路。",
    planetMatrix: "行星蹲点表：Planetary Matrix（三限盘里行星在哪儿）",
  },
  8: {
    planetStatus: "本表在说什么：几周内的「短负荷」主要落在哪些宫——帮助安排节奏，不是十年大运。",
    planetMatrix: "行星负荷矩阵：Planetary Matrix（来源：三限盘行星位置）",
  },
  9: {
    planetStatus: "本表在说什么：像读中篇——三限行星落在哪些宫，这几周就更像哪几章。",
    planetMatrix: "行星地图矩阵：Planetary Matrix（来源：三限盘行星位置）",
  },
  10: {
    planetStatus: "本表在说什么：三限｜行星落宫＝几周主块。",
    planetMatrix: "Planetary Matrix｜三限盘行星位置",
  },
};

const SOL: Record<VoiceStyleIdZh, Row> = {
  1: {
    planetStatus: "本表在说什么：日返盘上行星落宫——这一年度里，故事更容易在哪些领域上演。",
    planetMatrix: "全系统参数阵列：Planetary Matrix（来源：日返盘行星位置）",
  },
  2: {
    planetStatus: "本表在说什么：这一日返年里，行星主要落在哪些宫位——看年度主题，不当每日清单。",
    planetMatrix: "行星落宫一览：Planetary Matrix（数据：日返盘行星位置）",
  },
  3: {
    planetStatus: "本表在说什么：年度窗口里，星星主要点亮哪些生活块——用来定全年优先级。",
    planetMatrix: "行星矩阵：Planetary Matrix（读数来源：日返盘行星位置）",
  },
  4: {
    planetStatus: "本表在说什么：这一年剧情更厚的卷在哪——看日返行星落宫；日常仍要拆小。",
    planetMatrix: "行星章节表：Planetary Matrix（来源：日返盘行星位置）",
  },
  5: {
    planetStatus: "本表在说什么：【日返】行星宫位＝年度主舞台分区。",
    planetMatrix: "【行星矩阵】Planetary Matrix（日返盘）",
  },
  6: {
    planetStatus: "本表在说什么：日返盘上行星分布指向哪些宫位——用于年度结构描述，建议按季复核。",
    planetMatrix: "行星分布矩阵：Planetary Matrix（来源：日返盘行星位置）",
  },
  7: {
    planetStatus: "本表在说什么：说白了，这一年你最常在哪些生活块里投入——日返行星先画年圈。",
    planetMatrix: "行星蹲点表：Planetary Matrix（日返盘里行星在哪儿）",
  },
  8: {
    planetStatus: "本表在说什么：年度「主负荷」主要落在哪些宫——帮助排全年节奏，不是单日指令。",
    planetMatrix: "行星负荷矩阵：Planetary Matrix（来源：日返盘行星位置）",
  },
  9: {
    planetStatus: "本表在说什么：像读年度连载——日返行星落在哪些宫，这一年就更像哪几幕。",
    planetMatrix: "行星地图矩阵：Planetary Matrix（来源：日返盘行星位置）",
  },
  10: {
    planetStatus: "本表在说什么：日返｜行星落宫＝年度主块。",
    planetMatrix: "Planetary Matrix｜日返盘行星位置",
  },
};

const LUN: Record<VoiceStyleIdZh, Row> = {
  1: {
    planetStatus: "本表在说什么：月返盘上落宫——这一小段日子里，情绪与起居更容易挂在哪几块。",
    planetMatrix: "全系统参数阵列：Planetary Matrix（来源：月返盘行星位置）",
  },
  2: {
    planetStatus: "本表在说什么：这一月返短窗里，行星主要落在哪些宫位——看情绪与起居节奏，不当终身定调。",
    planetMatrix: "行星落宫一览：Planetary Matrix（数据：月返盘行星位置）",
  },
  3: {
    planetStatus: "本表在说什么：短窗口里，星星主要点亮哪些生活块——用来安排这几天怎么过。",
    planetMatrix: "行星矩阵：Planetary Matrix（读数来源：月返盘行星位置）",
  },
  4: {
    planetStatus: "本表在说什么：这一小段日子剧情更响的章节在哪——看月返行星落宫；别写成十年结论。",
    planetMatrix: "行星章节表：Planetary Matrix（来源：月返盘行星位置）",
  },
  5: {
    planetStatus: "本表在说什么：【月返】行星宫位＝短窗主负载。",
    planetMatrix: "【行星矩阵】Planetary Matrix（月返盘）",
  },
  6: {
    planetStatus: "本表在说什么：月返盘上行星分布指向哪些宫位——用于短窗张力描述，宜按天微调。",
    planetMatrix: "行星分布矩阵：Planetary Matrix（来源：月返盘行星位置）",
  },
  7: {
    planetStatus: "本表在说什么：说白了，这几天你最常在哪些生活块里起伏——月返行星先点名。",
    planetMatrix: "行星蹲点表：Planetary Matrix（月返盘里行星在哪儿）",
  },
  8: {
    planetStatus: "本表在说什么：短窗「情绪负荷」主要落在哪些宫——帮助起居安排，不是命运判决。",
    planetMatrix: "行星负荷矩阵：Planetary Matrix（来源：月返盘行星位置）",
  },
  9: {
    planetStatus: "本表在说什么：像读短篇——月返行星落在哪些宫，这几天就更像哪几段。",
    planetMatrix: "行星地图矩阵：Planetary Matrix（来源：月返盘行星位置）",
  },
  10: {
    planetStatus: "本表在说什么：月返｜行星落宫＝短窗主块。",
    planetMatrix: "Planetary Matrix｜月返盘行星位置",
  },
};

const BY_KIND: Record<Exclude<ChartKindId, "natal">, Record<VoiceStyleIdZh, Row>> = {
  synastry: SYN,
  transit: TR,
  ephemeris: EP,
  secondary: SEC,
  tertiary: TER,
  solar_return: SOL,
  lunar_return: LUN,
};

/** 五联行星表层：按盘型与声部取成稿；本命返回空对象表示不覆盖。 */
export function planetFiveChartLayerStringsFor(
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh,
): Partial<Row> {
  if (kind === "natal") return {};
  return BY_KIND[kind][voiceStyleId];
}
