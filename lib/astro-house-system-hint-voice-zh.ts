/**
 * 读数区「宫位读法」一句：声部 2–10 成稿；声部 1 与未命中回退 `HOUSE_SYSTEM_READOUT_HINT_BASE_ZH`。
 */

import type { HouseSystemId } from "@/lib/astro-dossier-storage";
import {
  HOUSE_SYSTEM_READOUT_HINT_BASE_ZH,
  houseSystemReadoutHintKind,
  houseSystemReadoutHintZh,
  type HouseSystemReadoutHintKind,
} from "@/lib/astro-house-system-hint-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

type K = HouseSystemReadoutHintKind;
type V = VoiceStyleIdZh;

const PATCH: Partial<Record<V, Partial<Record<K, string>>>> = {
  2: {
    whole_sign:
      "整宫：一宫就是一整个星座；数行星在第几宫，就看它比上升星座往后顺数到第几个星座，别去找细宫头线。",
    equal: "等宫：从上升黄经算起，每 30° 切一宫；边界是等间距刻度，不是普拉西德那种弯弯曲曲的宫头。",
    equal_mc:
      "等宫·天顶：先把第 10 宫起点钉在天顶黄经，再每 30° 往后切；跟「从上升点起算的等宫」不是一路算法。",
    equal_aries:
      "等宫·白羊：第 1 宫从白羊 0° 开刀，每 30° 一格；跟从上升或从天顶起算都不一样，别混着读。",
    cusp_based:
      "这是宫头制：落宫看各宫起点的黄经分段；整宫那种「一宫吃满一个星座」的读法别往这里套。",
    swiss_algo:
      "这套宫界交给星历内置算法去算；读数以本盘表里的宫头、落宫为准，别拿整宫或别的制式硬对齐。",
  },
  3: {
    whole_sign: "整宫｜一宫=一星座；数宫=相对上升顺数星座。",
    equal: "等宫｜上升黄经起算·30°一格；非曲线宫头。",
    equal_mc: "等宫·天顶｜10 宫起=天顶黄经；≠上升起算等宫。",
    equal_aries: "等宫·白羊｜起点白羊0°；≠上升/天顶起算。",
    cusp_based: "宫头制｜表内宫界；≠整宫读法。",
    swiss_algo: "算法宫界｜以表为准｜勿硬套他制。",
  },
  4: {
    whole_sign:
      "整宫制里，一宫吞下一整个星座；行星落在第几宫，就数它比上升星座往后走过几个星座，不必抠细宫头。",
    equal: "等宫从上升黄经起跑，每三十度切一刀，刀口笔直；不是那种沿曲线宫头蜿蜒的切法。",
    equal_mc:
      "等宫·天顶：第十宫先把起点贴在天顶黄经，再三十度一格向外推进——和从上升点起步的等宫是两套规矩。",
    equal_aries:
      "等宫·白羊：零度白羊当第一宫门楣，再三十度一排；既不从上升也不从天顶起算，三套别串。",
    cusp_based: "宫头制看的是表里每一道宫起点怎么在黄经上分段；别拿整宫「一宫一星座」的读法来硬兑。",
    swiss_algo: "这一制的宫界交给星历内置算法；你只信眼前这张表的宫头与落宫，别拿整宫或别的系统来套。",
  },
  5: {
    whole_sign: "整宫·一宫=一星座·顺数定落宫",
    equal: "等宫·上升起算·30°切",
    equal_mc: "等宫·MC起点·≠上升等宫",
    equal_aries: "等宫·白羊0°·第三套",
    cusp_based: "宫头制·≠整宫读法",
    swiss_algo: "算法宫界·以表为准",
  },
  6: {
    whole_sign:
      "整宫制：各宫与黄道星座一一对应（一宫一整星座）；宫位归属以行星所在星座相对上升星座之序数判定，不单凭细分宫头线。",
    equal: "等宫制：自上升点黄经起，每三十度划分宫界；为等距分割，有别于曲线型宫头制式。",
    equal_mc:
      "等宫·天顶：以天顶黄经为第十宫起点，每三十度递进；与自上升点起算之等宫制不同。",
    equal_aries:
      "等宫·白羊：以白羊座零度为第一宫起点，每三十度递进；与上升点、天顶起算之等宫制均有区别。",
    cusp_based:
      "宫头制：落宫以各宫起点（宫头）黄经分段为准；与整宫制「一宫一整星座」之读法不同。",
    swiss_algo:
      "本制式宫界由星历按内置算法计算；请以本表宫头与落宫为判读依据，勿以整宫或其他制式强行套用。",
  },
  7: {
    whole_sign:
      "整宫就是一宫一整星座；看行星在第几宫，就数它比上升星座往后数到第几个星座，别总盯着细宫头线。",
    equal: "等宫是从上升黄经开始每 30° 剁一截，边界笔直；不是那种弯来弯去的宫头切法。",
    equal_mc:
      "等宫·天顶是先把第十宫扣在天顶黄经上再 30° 往外推；跟从上升算起的等宫不是一回事。",
    equal_aries: "等宫·白羊是从白羊 0° 开刀排宫；跟从上升、从天顶算的都别搅一锅。",
    cusp_based: "宫头制就看各宫起点怎么在黄经上切开；整宫那套一宫一星座别硬往里套。",
    swiss_algo: "这套让星历自己算法线；你只看表里宫头、落宫，别拿整宫或别的制式来强对齐。",
  },
  8: {
    whole_sign:
      "采用整宫制时，建议将每一宫位与一整星座对应；宫位判定宜依据行星所在星座相对上升星座之序位，而非依赖细分宫头切线。",
    equal: "等宫制自上升点黄经起，以三十度等距划分宫界；该切分与曲线宫头型制式存在差异。",
    equal_mc:
      "等宫·天顶制以天顶黄经作为第十宫起点，并按三十度递进；与自上升点起算之等宫制并不相同。",
    equal_aries:
      "等宫·白羊制以白羊座零度为第一宫起点；与以上升点或天顶为基准之等宫起算方式均应区分。",
    cusp_based: "宫头制依据各宫起点之黄经分段判定落宫；与整宫制读法不应混用。",
    swiss_algo: "本制式宫界由星历内置算法生成；建议以本表所列为准，避免以其他宫制强行套用。",
  },
  9: {
    whole_sign: "【整宫】一宫=一星座｜顺数定宫",
    equal: "【等宫】上升起·30°",
    equal_mc: "【等宫·天顶】MC 起·≠上升等宫",
    equal_aries: "【等宫·白羊】0°白羊起",
    cusp_based: "【宫头】≠整宫",
    swiss_algo: "【算法宫界】以表为准",
  },
  10: {
    whole_sign: "整宫:1宫=1星座",
    equal: "等宫:ASC+30°",
    equal_mc: "等宫:MC起",
    equal_aries: "等宫:白羊0",
    cusp_based: "宫头≠整宫",
    swiss_algo: "算法界·跟表",
  },
};

export function houseSystemReadoutHintVocal(voice: V, id: HouseSystemId): string {
  if (voice === 1) {
    return houseSystemReadoutHintZh(id);
  }
  const kind = houseSystemReadoutHintKind(id);
  const hit = PATCH[voice]?.[kind];
  return hit ?? HOUSE_SYSTEM_READOUT_HINT_BASE_ZH[kind];
}
