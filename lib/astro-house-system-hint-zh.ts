import type { HouseSystemId } from "@/lib/astro-dossier-storage";

/** 读数区「宫位读法」一句：合并为六类，便于十声部成稿。 */
export type HouseSystemReadoutHintKind =
  | "whole_sign"
  | "equal"
  | "equal_mc"
  | "equal_aries"
  | "cusp_based"
  | "swiss_algo";

/** 声部 1 与各声部未命中补丁时的基座（与历史 `houseSystemReadoutHintZh` 一致）。 */
export const HOUSE_SYSTEM_READOUT_HINT_BASE_ZH: Record<HouseSystemReadoutHintKind, string> = {
  whole_sign:
    "整宫制：每宫占满一整星座；行星在第几宫，看它的星座相对上升星座顺数即可，不按细宫头线切分。",
  equal: "等宫制：从上升点黄经起，每 30° 一宫；宫界是等分点，不是曲线宫头那种切法。",
  equal_mc:
    "等宫·天顶：以天顶黄经为第 10 宫起点，每 30° 一宫；和「从上升点起算的等宫」不是同一种。",
  equal_aries:
    "等宫·白羊：以白羊 0° 为第 1 宫起点，每 30° 一宫；与上升点、天顶起算都不同。",
  cusp_based:
    "宫头制：落宫由表里各宫起点（宫头黄经）分段决定；与整宫「一宫一整星座」的读法不同。",
  swiss_algo:
    "本制式宫界由星历按内置算法计算；请以本表宫头与落宫为准，勿按整宫或别的制式硬套。",
};

export function houseSystemReadoutHintKind(id: HouseSystemId): HouseSystemReadoutHintKind {
  switch (id) {
    case "Whole Sign":
      return "whole_sign";
    case "Equal":
      return "equal";
    case "EqualMc":
      return "equal_mc";
    case "EqualAries":
      return "equal_aries";
    case "Placidus":
    case "Koch":
    case "Campanus":
    case "Regiomontanus":
    case "Porphyry":
    case "Alcabitus":
    case "Morinus":
    case "Sripati":
    case "Krusinski":
    case "Horizontal":
      return "cusp_based";
    case "Meridian":
    case "Vehlow":
    case "Sunshine":
    case "PolichPage":
    case "Carter":
    case "Gauquelin":
    case "PullenSd":
    case "PullenSr":
    case "Apc":
      return "swiss_algo";
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

/**
 * 星盘数据读数区 Tab 上方一句提示（L1，忌运维隐喻）。
 * 位置：`AstroChartReadout` 内、视图 Tab 之上。
 */
export function houseSystemReadoutHintZh(id: HouseSystemId): string {
  return HOUSE_SYSTEM_READOUT_HINT_BASE_ZH[houseSystemReadoutHintKind(id)];
}
