/**
 * 同数当场拼读的共读正文；与合拍卡里「关于你／关于对方」底句同一套。
 */

import type { PairMatrixManualBodyZh } from "@/lib/numerology-life-path-pair-matrix-types";
import { aboutOtherVoiceParagraphsZh, aboutYouVoiceParagraphsZh } from "@/lib/numerology-life-path-pair-voice-about-zh";

export function lifePathPairTwinVoiceBodyZh(n: number): PairMatrixManualBodyZh {
  const u = aboutYouVoiceParagraphsZh(n);
  const v = aboutOtherVoiceParagraphsZh(n);
  return {
    lead: `你们都是主路径 ${n}：${u[0]} 同数叠影时，${u[1]} 同一种路数的好处与坏处都容易对称放大，像回声撞回声。`,
    afterLead: [
      `对方也是一面镜子，读的仍是「这一个 ${n}」：${v[0]} 两个人的短处会像回声互撞，别用更大的声量盖过去。`,
      `先这样试：对外只开一张嘴；轮换先交接清单再冻口径；每周半刻钟只清未结案清单，不开新题。`,
    ],
    bullets: [
      `主路径 ${n} 同数：大事纪要写清定调人、落地人、交付日与验收；改口二十四小时内补书面，旧口径冻到新纪要双签。`,
      "特别大的决定强制隔一晚：各写事实—我要—底线—最坏退路，次日只对纸、不对脾气。",
      "觉得被抢话：先各写三行摘要，对上名词再谈情绪；条款与委屈禁同桌混审。",
      "连续两晚在争名分：第三晚只允许带可打勾任务表进门，没有表就散会。",
      "留一页「对外顺口承诺」回收站：任何对外露出绑定交付日与可验收物，缺一不外说。",
    ],
  };
}
