/**
 * 综合结论：主相位框句（{core}）与轴摩擦单行（{planet}{t}{ax}{orb}）声部 2–10 成稿。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

export type FrictionRowPatch = { h: string; s: string };

const ALL_KINDS: ChartKindId[] = [
  "natal",
  "synastry",
  "transit",
  "ephemeris",
  "secondary",
  "tertiary",
  "solar_return",
  "lunar_return",
];

function spreadFric(row: FrictionRowPatch): Record<ChartKindId, FrictionRowPatch> {
  return Object.fromEntries(ALL_KINDS.map((k) => [k, row])) as Record<ChartKindId, FrictionRowPatch>;
}

/** 主相位：除 natal 外为 `{core}` 外包；natal 不传 patch 时用基座（即 core）。 */
export const READOUT_MAJOR_WRAP_PATCH: Partial<
  Record<VoiceStyleIdZh, Partial<Record<ChartKindId, string>>>
> = {
  2: {
    synastry: "{core}双人是否咬得紧，别在主轮拍板；合盘与宫落对一下。",
    transit: "行运里：{core}要踩本命哪条线，打开「行运↔本命」对照。",
    ephemeris: "这一刻：{core}只服务这个切片，别拉成一生结论。",
    secondary: "次限景里：{core}几年里爱反复冒头的主题，常跟这条线挂钩。",
    tertiary: "三限窗里：{core}近几周生活块里更容易感觉到它。",
    solar_return: "日返年场：{core}这一年它常出来抢戏；配本命读。",
    lunar_return: "月返短窗：{core}这一小段里参与心情与起居节奏。",
  },
  3: {
    synastry: "{core}｜双人机制→合盘+宫落。",
    transit: "{core}｜本命交会→行运↔本命。",
    ephemeris: "{core}｜切片；禁终身。",
    secondary: "{core}｜年尺度主题回声。",
    tertiary: "{core}｜短窗可感。",
    solar_return: "{core}｜年题抢戏。",
    lunar_return: "{core}｜短窗起居。",
  },
  4: {
    synastry: "{core}主轮只写案主内部戏；俩人怎么咬，合盘那场见。",
    transit: "{core}外景天象这条线；本命是你身上的老布景。",
    ephemeris: "{core}就这一帧；别接整部片尾。",
    secondary: "{core}几年一季里爱回头的那条主题线。",
    tertiary: "{core}近几集剪辑里它会探头。",
    solar_return: "{core}年度片花里常抢镜的一条。",
    lunar_return: "{core}小段蒙太奇里的心情与起居配乐。",
  },
  5: {
    synastry: "{core}双人→合盘",
    transit: "{core}×本命",
    ephemeris: "{core}切片",
    secondary: "{core}年",
    tertiary: "{core}短窗",
    solar_return: "{core}年题",
    lunar_return: "{core}短",
  },
  6: {
    synastry: "{core}（观测：案主内部结构；双人验证→合盘域。）",
    transit: "{core}（观测：行运样本；本命参照。）",
    ephemeris: "{core}（观测：时刻锚；禁外推终身。）",
    secondary: "{core}（观测：次限年变量。）",
    tertiary: "{core}（观测：三限短窗。）",
    solar_return: "{core}（观测：日返年叙事。）",
    lunar_return: "{core}（观测：月返短周期。）",
  },
  7: {
    synastry: "{core}俩人咋处，别在主轮判死刑，合盘里唠。",
    transit: "{core}这几天外面的线，对照本命别混成一辈子。",
    ephemeris: "{core}就这一下子，别讲到一辈子。",
    secondary: "{core}几年里老爱回头的那档事。",
    tertiary: "{core}近几周身体感里更容易瞅见它。",
    solar_return: "{core}这一年它爱抢话。",
    lunar_return: "{core}这一小段心情家里事它会插嘴。",
  },
  8: {
    synastry:
      "{core}本句归纳限于案主本命内部结构；关系层面请以合盘与双方资料交叉验证。",
    transit: "{core}用于对照本命之长期配置；短周期感受不宜外推为终身定性。",
    ephemeris: "{core}仅描述指定时刻之盘内关系；不接人格终身结论。",
    secondary: "{core}年尺度慢变中，该主题具有较高复现倾向。",
    tertiary: "{core}短周期内该结构线之可感性上升。",
    solar_return: "{core}该年度叙事中此结构线参与显著。",
    lunar_return: "{core}该短周期内此结构线参与情绪与起居接口。",
  },
  9: {
    synastry: "【主相】{core}｜双人→合盘",
    transit: "【主相】{core}｜×本命",
    ephemeris: "【主相】{core}｜切片",
    secondary: "【主相】{core}｜年",
    tertiary: "【主相】{core}｜短窗",
    solar_return: "【主相】{core}｜年题",
    lunar_return: "【主相】{core}｜短",
  },
  10: {
    synastry: "主相:{core}->合盘",
    transit: "主相:{core}->本命",
    ephemeris: "主相:{core}->窗",
    secondary: "主相:{core}->年",
    tertiary: "主相:{core}->短",
    solar_return: "主相:{core}->年题",
    lunar_return: "主相:{core}->短",
  },
};

/** 轴摩擦：h=四分/对分，s=其余；占位 {planet}{t}{ax}{orb} */
export const READOUT_FRICTION_ROW_PATCH: Partial<
  Record<VoiceStyleIdZh, Partial<Record<ChartKindId, FrictionRowPatch>>>
> = {
  2: {
    natal: {
      h: "{planet}{t}{ax}（{orb}°）容易顶住：亮相、心情或外期待在这儿卡一下。",
      s: "{planet}{t}{ax}（{orb}°）抢眼：怎么被看见、怎么出门，这条线会掺和。",
    },
    synastry: {
      h: "案主轮{planet}{t}{ax}（{orb}°）偏紧：门面或走向爱较劲；谁踩线，合盘对。",
      s: "案主轮{planet}{t}{ax}（{orb}°）显眼：案主怎么亮相、往哪走，常吃这条线。",
    },
    transit: {
      h: "行运{planet}{t}{ax}（{orb}°）偏紧：这几天出门、被点名容易在这儿顶一下；轴回本命。",
      s: "行运{planet}{t}{ax}（{orb}°）显眼：当下怎么亮相、往哪冲，它会插一脚。",
    },
    ephemeris: {
      h: "该时刻{planet}{t}{ax}（{orb}°）偏紧：当场门面或走向容易拧。",
      s: "该时刻{planet}{t}{ax}（{orb}°）显眼：这一瞬亮相与走向感强。",
    },
    secondary: {
      h: "次限{planet}{t}{ax}（{orb}°）偏紧：几年里对外标签或出门路径周期性卡住。",
      s: "次限{planet}{t}{ax}（{orb}°）显眼：慢迁里怎么被看见常与它有关。",
    },
    tertiary: {
      h: "三限{planet}{t}{ax}（{orb}°）偏紧：近几周门面或走向短拧一下。",
      s: "三限{planet}{t}{ax}（{orb}°）显眼：近窗亮相与走向会吃到它。",
    },
    solar_return: {
      h: "日返{planet}{t}{ax}（{orb}°）偏紧：这一年出门、被看见或事业标签容易顶住。",
      s: "日返{planet}{t}{ax}（{orb}°）显眼：年度怎么出门、怎么走，它常参与。",
    },
    lunar_return: {
      h: "月返{planet}{t}{ax}（{orb}°）偏紧：这一小段出门感或外期待容易别一下。",
      s: "月返{planet}{t}{ax}（{orb}°）显眼：短周期亮相与走向会带到它。",
    },
  },
  3: {
    natal: {
      h: "{planet}{t}{ax}（{orb}°）紧｜亮相/情绪/外期→卡。",
      s: "{planet}{t}{ax}（{orb}°）显｜出门接口。",
    },
    synastry: {
      h: "案主｜{planet}{t}{ax}（{orb}°）紧→合盘。",
      s: "案主｜{planet}{t}{ax}（{orb}°）显→双人相位。",
    },
    transit: {
      h: "行运｜{planet}{t}{ax}（{orb}°）紧→本命轴。",
      s: "行运｜{planet}{t}{ax}（{orb}°）显。",
    },
    ephemeris: {
      h: "时刻｜{planet}{t}{ax}（{orb}°）紧。",
      s: "时刻｜{planet}{t}{ax}（{orb}°）显。",
    },
    secondary: {
      h: "次限｜{planet}{t}{ax}（{orb}°）紧。",
      s: "次限｜{planet}{t}{ax}（{orb}°）显。",
    },
    tertiary: {
      h: "三限｜{planet}{t}{ax}（{orb}°）紧。",
      s: "三限｜{planet}{t}{ax}（{orb}°）显。",
    },
    solar_return: {
      h: "日返｜{planet}{t}{ax}（{orb}°）紧。",
      s: "日返｜{planet}{t}{ax}（{orb}°）显。",
    },
    lunar_return: {
      h: "月返｜{planet}{t}{ax}（{orb}°）紧。",
      s: "月返｜{planet}{t}{ax}（{orb}°）显。",
    },
  },
  4: {
    natal: {
      h: "{planet}{t}{ax}（{orb}°）像根细刺顶着：自我呈现或外期待在这儿别你一下。",
      s: "{planet}{t}{ax}（{orb}°）舞台灯打亮：出门与名片这条线它会入画。",
    },
    synastry: {
      h: "案主幕上{planet}{t}{ax}（{orb}°）绷紧：门面走向爱较劲；双人戏合盘演。",
      s: "案主幕上{planet}{t}{ax}（{orb}°）打光：怎么被看见、往哪走，常吃它。",
    },
    transit: {
      h: "行运外景{planet}{t}{ax}（{orb}°）顶：这几天出门被点名容易在这儿扛压。",
      s: "行运外景{planet}{t}{ax}（{orb}°）亮：当下亮相与冲刺它掺一脚。",
    },
    ephemeris: {
      h: "这一帧{planet}{t}{ax}（{orb}°）拧：当场门面走向别一下。",
      s: "这一帧{planet}{t}{ax}（{orb}°）亮：瞬时亮相走向感强。",
    },
    secondary: {
      h: "次限长镜{planet}{t}{ax}（{orb}°）卡：几年里标签与路径周期性顶住。",
      s: "次限长镜{planet}{t}{ax}（{orb}°）显：慢迁里被看见常与它有关。",
    },
    tertiary: {
      h: "三限近景{planet}{t}{ax}（{orb}°）短拧：几周里门面走向晃一下。",
      s: "三限近景{planet}{t}{ax}（{orb}°）显：近窗亮相走向吃到它。",
    },
    solar_return: {
      h: "日返年场{planet}{t}{ax}（{orb}°）顶住：这一年出门被看见爱在这儿较劲。",
      s: "日返年场{planet}{t}{ax}（{orb}°）参与：年度出门怎么走常带它。",
    },
    lunar_return: {
      h: "月返小段{planet}{t}{ax}（{orb}°）别：出门感或外期待短拧。",
      s: "月返小段{planet}{t}{ax}（{orb}°）带到：短周期亮相走向有它。",
    },
  },
  5: spreadFric({
    h: "{planet}{t}{ax}（{orb}°）紧",
    s: "{planet}{t}{ax}（{orb}°）显",
  }),
  6: {
    natal: {
      h: "观测：{planet}{t}{ax}（{orb}°）紧样本｜亮相/情绪接口承压。",
      s: "观测：{planet}{t}{ax}（{orb}°）显样本｜出门接口显著。",
    },
    synastry: {
      h: "观测（案主）：{planet}{t}{ax}（{orb}°）紧→合盘复核。",
      s: "观测（案主）：{planet}{t}{ax}（{orb}°）显→双人相位。",
    },
    transit: {
      h: "观测（行运）：{planet}{t}{ax}（{orb}°）紧→本命轴参照。",
      s: "观测（行运）：{planet}{t}{ax}（{orb}°）显。",
    },
    ephemeris: {
      h: "观测（时刻）：{planet}{t}{ax}（{orb}°）紧。",
      s: "观测（时刻）：{planet}{t}{ax}（{orb}°）显。",
    },
    secondary: {
      h: "观测（次限）：{planet}{t}{ax}（{orb}°）紧。",
      s: "观测（次限）：{planet}{t}{ax}（{orb}°）显。",
    },
    tertiary: {
      h: "观测（三限）：{planet}{t}{ax}（{orb}°）紧。",
      s: "观测（三限）：{planet}{t}{ax}（{orb}°）显。",
    },
    solar_return: {
      h: "观测（日返）：{planet}{t}{ax}（{orb}°）紧。",
      s: "观测（日返）：{planet}{t}{ax}（{orb}°）显。",
    },
    lunar_return: {
      h: "观测（月返）：{planet}{t}{ax}（{orb}°）紧。",
      s: "观测（月返）：{planet}{t}{ax}（{orb}°）显。",
    },
  },
  7: {
    natal: {
      h: "{planet}{t}{ax}（{orb}°）在这儿顶你一下：亮相、心情或外期待容易卡。",
      s: "{planet}{t}{ax}（{orb}°）挺抢眼：怎么出门、怎么被瞅见，它要插话。",
    },
    synastry: {
      h: "案主盘上{planet}{t}{ax}（{orb}°）绷紧：门面走向爱较劲；俩人谁踩，合盘瞅。",
      s: "案主盘上{planet}{t}{ax}（{orb}°）显眼：怎么亮相往哪走，常吃它。",
    },
    transit: {
      h: "行运{planet}{t}{ax}（{orb}°）这几天爱顶：出门被点名容易在这儿扛。",
      s: "行运{planet}{t}{ax}（{orb}°）当下抢眼：亮相冲刺它掺和。",
    },
    ephemeris: {
      h: "就这一刻{planet}{t}{ax}（{orb}°）拧一下。",
      s: "就这一刻{planet}{t}{ax}（{orb}°）亮。",
    },
    secondary: {
      h: "次限这几年{planet}{t}{ax}（{orb}°）周期性卡住。",
      s: "次限这几年{planet}{t}{ax}（{orb}°）慢迁里常显。",
    },
    tertiary: {
      h: "三限这几周{planet}{t}{ax}（{orb}°）短拧。",
      s: "三限这几周{planet}{t}{ax}（{orb}°）近窗显。",
    },
    solar_return: {
      h: "日返这一年{planet}{t}{ax}（{orb}°）爱顶住。",
      s: "日返这一年{planet}{t}{ax}（{orb}°）常参与出门走向。",
    },
    lunar_return: {
      h: "月返这一小段{planet}{t}{ax}（{orb}°）别一下。",
      s: "月返这一小段{planet}{t}{ax}（{orb}°）带到亮相走向。",
    },
  },
  8: {
    natal: {
      h: "{planet}{t}{ax}（{orb}°）呈紧张特征：自我呈现、情绪或外界期待易在此出现阻滞感。",
      s: "{planet}{t}{ax}（{orb}°）显著：参与对外亮相与行动路径之组织方式。",
    },
    synastry: {
      h: "案主轮：{planet}{t}{ax}（{orb}°）呈紧张特征；双人触发机制请参阅合盘。",
      s: "案主轮：{planet}{t}{ax}（{orb}°）显著；对外接口常受其牵引。",
    },
    transit: {
      h: "行运：{planet}{t}{ax}（{orb}°）呈紧张特征；本命轴参照仍以出生盘为准。",
      s: "行运：{planet}{t}{ax}（{orb}°）显著；当下亮相与推进受其参与。",
    },
    ephemeris: {
      h: "指定时刻：{planet}{t}{ax}（{orb}°）呈紧张特征。",
      s: "指定时刻：{planet}{t}{ax}（{orb}°）显著。",
    },
    secondary: {
      h: "次限：{planet}{t}{ax}（{orb}°）呈周期性紧张特征。",
      s: "次限：{planet}{t}{ax}（{orb}°）于慢迁中显著。",
    },
    tertiary: {
      h: "三限：{planet}{t}{ax}（{orb}°）于短周期呈紧张特征。",
      s: "三限：{planet}{t}{ax}（{orb}°）于短窗显著。",
    },
    solar_return: {
      h: "日返：{planet}{t}{ax}（{orb}°）于该年度呈紧张特征。",
      s: "日返：{planet}{t}{ax}（{orb}°）于该年度显著参与出门与走向接口。",
    },
    lunar_return: {
      h: "月返：{planet}{t}{ax}（{orb}°）于短周期呈紧张特征。",
      s: "月返：{planet}{t}{ax}（{orb}°）于短周期显著参与亮相与走向。",
    },
  },
  9: {
    natal: {
      h: "【轴紧】{planet}{t}{ax}（{orb}°）",
      s: "【轴显】{planet}{t}{ax}（{orb}°）",
    },
    synastry: {
      h: "【案主轴紧】{planet}{t}{ax}（{orb}°）",
      s: "【案主轴显】{planet}{t}{ax}（{orb}°）",
    },
    transit: {
      h: "【行运轴紧】{planet}{t}{ax}（{orb}°）",
      s: "【行运轴显】{planet}{t}{ax}（{orb}°）",
    },
    ephemeris: {
      h: "【时刻轴紧】{planet}{t}{ax}（{orb}°）",
      s: "【时刻轴显】{planet}{t}{ax}（{orb}°）",
    },
    secondary: {
      h: "【次限轴紧】{planet}{t}{ax}（{orb}°）",
      s: "【次限轴显】{planet}{t}{ax}（{orb}°）",
    },
    tertiary: {
      h: "【三限轴紧】{planet}{t}{ax}（{orb}°）",
      s: "【三限轴显】{planet}{t}{ax}（{orb}°）",
    },
    solar_return: {
      h: "【日返轴紧】{planet}{t}{ax}（{orb}°）",
      s: "【日返轴显】{planet}{t}{ax}（{orb}°）",
    },
    lunar_return: {
      h: "【月返轴紧】{planet}{t}{ax}（{orb}°）",
      s: "【月返轴显】{planet}{t}{ax}（{orb}°）",
    },
  },
  10: spreadFric({
    h: "{planet}{t}{ax}（{orb}°）H",
    s: "{planet}{t}{ax}（{orb}°）S",
  }),
};
