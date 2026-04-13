/**
 * 行运×本命主叙事：收束句按声部成稿；正文由 `buildTransitNatalMajorNarrativeBodyZh` 定稿拼接。
 */

import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";
import { TRANSIT_NATAL_MAJOR_NARRATIVE_CLOSING_ZH } from "@/lib/astro-transit-natal-major-narrative-zh";

const CLOSING_PATCH: Partial<Record<VoiceStyleIdZh, string>> = {
  2: "若只记一句：这几天先少答应、把话说圆；心里雾大的时候别急着定调，先把日子和睡眠稳住，再琢磨路要不要拐弯。",
  3: "收束：短窗内降速、减承诺、口径写清；高不确定时避免仓促定调；优先稳固起居与生活底盘，再评估方向调整。",
  4: "落幕提示：先收火力、少打包票；雾厚时最贵的是一句话拍板——把家与日常理顺了，再谈航道改不改。",
  5: "一句：降速·少诺·说清；雾大勿定调；底盘稳再改道。",
  6: "执行备忘：近几日宜降低动作半径与口头承诺，表达留复核余地；判断窗口浑浊时推迟重大定调，优先稳定作息与生活支持面，再讨论路径修正。",
  7: "咱就记一句：这几天别硬扛、别乱答应；心里发糊的时候先别一锤定音，把吃喝睡和家里收拾顺了，再想走不走新路。",
  8: "综合建议：短期内宜减缓节奏、控制承诺规模并保持沟通清晰；在主观感受模糊阶段应避免仓促作出结构性决定，建议先稳固日常生活基础，再评估是否调整方向。",
  9: "【收束】降速/减诺/说清；雾期禁仓促定调；底盘稳→再议航道。",
  10: "收束:降速+少诺+口径;雾勿定调;底盘稳再改道。",
};

export function transitNatalMajorClosingForVoice(voiceStyleId: VoiceStyleIdZh): string {
  return CLOSING_PATCH[voiceStyleId] ?? TRANSIT_NATAL_MAJOR_NARRATIVE_CLOSING_ZH;
}
