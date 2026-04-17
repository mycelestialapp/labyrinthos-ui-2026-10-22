import type { PairMatrixManualBodyZh } from "@/lib/numerology-life-path-pair-matrix-types";
import { lifePathPairMatrixVoiceBodyZh } from "@/lib/numerology-life-path-pair-matrix-voice-body-zh";
import { lifePathPairTwinVoiceBodyZh } from "@/lib/numerology-life-path-pair-twin-voice-zh";

/**
 * 共鸣分析：两人主路径（生命路径）相处句式。
 * 档位参考常见「九数环」最短步距（非线性 |a−b|）：邻位互补、对宫张力等；
 * 出现 11/22/33 时，合拍档位按副振动 2/4/6 参与环距计算，正文仍直呼盘面主路径数。
 *
 * 单人提要（portrait）与环距档位总领：手册级密度，仍分短句、好扫读；与侧栏 `numerology-life-path-side-manual-zh` 单人深读、寰宇之门长文互补。
 *
 * **与合议定稿的分工**：主路径恰为 1 与 9 各一时，UI 另载 `numerology-life-path-1-9-pair-reading-zh.ts` 的定稿深读；
 * **异数共读**：`lifePathPairMatrixVoiceBodyZh` 按两人当场拼出总领与备忘（与合拍卡同一套「你／对方」底句）；手写矩阵仍留在库里作备查稿，线上展示一律读这份当场拼读。
 */
export type LifePathPairBand = "twin" | "near" | "ease" | "grind" | "pole";

export type LifePathPairCompatZh = {
  band: LifePathPairBand;
  bandLabel: string;
  /** 九数环最短步距（0＝同数）；供小字说明 */
  circularStep: number;
  /** 二人各自主路径白话提要（与寰宇之门手册长文分工） */
  portraitA: string;
  portraitB: string;
  /** 合看：环距怎么算、和大师数怎么叠（在提要之后、总领之前） */
  ringBridge: string;
  /** 总领一段，已含甲乙方主路径数 */
  lead: string;
  /** 总领之后两段：易踩坑 / 相处做法，顺读 */
  afterLead: readonly [string, string];
  /** 行法备忘五条 */
  bullets: readonly [string, string, string, string, string];
  /** 大师数参与时的叠注，无则空串 */
  masterAside: string;
  /** 生日数一句，供 UI 另排一行 */
  birthdayLine: (bdA: number, bdB: number) => string;
};

const MASTER = new Set([11, 22, 33]);

/**
 * 共鸣页专用：各主路径白话提要（非手册全文）。
 * 与 `numerology-life-path-copy-zh` 手册互补：此处只给双人合看时的「单数提要」。
 */
const MAIN_PATH_BONE_ZH: Record<number, string> = {
  1:
    "你爱拍板，也怕踩空：最怕事悬着没人签收。相处先把「谁落地、何时交、怎样算完」写进同一页，比争声量有用；两人都爱领头时，轮流对外承诺、轮流盯条款，别让两个车头互别。",
  2:
    "你善体谅，也易把话炖成默会；最怕传话链和暗猜。相处里事实与感受分栏写清再谈价码；涉及第三人当面说齐；沉默若代表「算了」，把定义写出来，别让另一方猜成冷暴力。",
  3:
    "你爱表达、也爱热闹，容易话多过交付。先各认领一条能打勾收口的任务，指标两人先互认；热闹替代不了作品，掌声是借来的火，纸上的名与日期才是自己的柴。",
  4:
    "你只信钉得进墙的东西，也容易两人一起较真卡死。给彼此留「够好就先交」的口子：规则一页封顶，其余试行有期；到点先交一版再复盘，别当场推翻已交的，否则双质检永远没有第一版。",
  5:
    "你爱新鲜、怕闷，一拍即合也容易一起飘。大决定前写清最晚日、最少现金、怎么退出，再留一条半年不动的锚；变动是换气不是逃责，没有阀门的风最先碎的是信用。",
  6:
    "你爱扛事、心软，会照顾人也易两人一起累垮。帮忙要有周上限与书面价码；轮流有一个人说逆耳真话；长辈孩子的事单开会议，别把外场债混成你们两人的战场。",
  7:
    "你要安静、讲依据，也容易把「我想清楚」拖成冷战。约好急事怎么联系、缓事多久回、大事凭哪三条依据再上桌；谈僵就各写五百字隔天再谈，别让「不打扰」被读成不在乎。",
  8:
    "你要结果、也要台面，能扛事也易台面客气、台下较劲。钱与权只认写下来的；谈僵先休会对账，感情单独立案；利益表按季复盘，改动带版本与理由，防口头一句顶掉旧条款。",
  9:
    "你会成全、会念旧，也容易尾巴拖着不结、新盘开不动。未了结列清单，清几条再谈新的；轮流做敢说「可以结束」的人；纪念物与共同账户一次定方案少翻案，放手也是一种负责。",
  11:
    "你灵、细，小事易放大；最怕互相当预言家，把预感煸成结论。直觉先私藏，再过三问——证据、代价、退路；约好勿扰与「急事」定义；睡眠或身体连续很差时，一周内不做关系大钱三类重决定。",
  22:
    "你心想得大、蓝图多，真要落地要少而硬。先定谁总负责，再定四周里能验的三块有编号之砖；远景会前先列三块小任务与验收日；延期两次第三次必须砍目标、加人或加时间，禁止空口把同一承诺再说一遍。",
  33:
    "你易心软帮人，边界糊时恩义变负担。帮人前三问写清——谁负责、帮到哪儿停、怎么退出；答不清不答应，答应要留字；家里时间钱情设上限，任一人说「不」即不，防被各个击破。",
};

export function lifePathPairBoneLineZh(n: number): string {
  return MAIN_PATH_BONE_ZH[n] ?? `主路径 ${n}：此处未单列短句，请先看环距档位与下文总领，或回寰宇之门读完整手册。`;
}

function pairPortraits(lpA: number, lpB: number): { portraitA: string; portraitB: string } {
  const boneA = lifePathPairBoneLineZh(lpA);
  const boneB = lifePathPairBoneLineZh(lpB);
  return {
    portraitA: `你 · 主路径 ${lpA}：${boneA}`,
    portraitB:
      lpA === lpB
        ? `对方 · 主路径 ${lpB}：与你是同一个数，上面那段两人共用。下面专写「同一种路数」叠在一起时，坏处怎么对称放大，以及轮换、留纸、对外一张嘴的法子。`
        : `对方 · 主路径 ${lpB}：${boneB}`,
  };
}

/** 大师数折为环上点；与环距、合拍句库同源，供 UI 九数环示意等复用 */
export function masterProxy(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

/** 1–9 环上最短步距；输入可为大师数（先化副振动参与环距） */
export function lifePathCircularStep(a: number, b: number): number {
  const x = masterProxy(a);
  const y = masterProxy(b);
  if (x < 1 || x > 9 || y < 1 || y > 9) return Math.abs(x - y);
  const d = Math.abs(x - y);
  return Math.min(d, 9 - d);
}

/** 同数叠影手册体（与共鸣页「我、对方」同主路径对齐；盘面须为 1–9、11、22、33） */
export function lifePathPairTwinManualBodyZh(n: number): PairMatrixManualBodyZh {
  return lifePathPairTwinVoiceBodyZh(n);
}

/** 共鸣合拍卡徽章与叠读用的档位短名（与环距算法同源，仅换称）。 */
export const LIFE_PATH_PAIR_BAND_DISPLAY_ZH: Record<LifePathPairBand, string> = {
  twin: "同数叠影",
  near: "近邻一口气",
  ease: "隔岸两步",
  grind: "两拍三步",
  pole: "对径一盏灯",
};

/** 合看二人：环上折距与大师副振动如何叠进本页读数（与骨相、档位总领分工） */
function ringBridgeParagraph(lpA: number, lpB: number, band: LifePathPairBand, circularStep: number): string {
  if (band === "twin") {
    const m = MASTER.has(lpA);
    return `你们是同一盘面数 ${lpA}，环距为 0，签作「${LIFE_PATH_PAIR_BAND_DISPLAY_ZH.twin}」：像两面镜子对放，好处坏处都容易对称放大。${
      m
        ? "这是 11/22/33 之一：算环距时会用到副数 2/4/6，正文仍直呼盘面本数。两人同数时敏感、大图或心软更易叠影，纸面要比单人时再严一档。"
        : "两人都是常数：没有折数争议，仍要防同一种脾气互点同一种火。上面两段是各自走路的样子，这里只交代「同数」在环上意味着什么。"
    }`;
  }
  const px = masterProxy(lpA);
  const py = masterProxy(lpB);
  const hasM = MASTER.has(lpA) || MASTER.has(lpB);
  const bothM = MASTER.has(lpA) && MASTER.has(lpB);
  const label = LIFE_PATH_PAIR_BAND_DISPLAY_ZH[band];
  const fold = `把主路径折到九数环上的点：${lpA} 读作 ${px}，${lpB} 读作 ${py}；最短步 ${circularStep}，落在「${label}」这一档。`;
  const overlay = bothM
    ? "两人都是大师数：副数都进了环距，节奏与压力更易一起抬高；别半途换算法，也别用预感盖掉纪要。"
    : hasM
      ? "只有一方是大师数：环距一边按副数折、一边仍用本数。和别的站对读前，先问清折不折、怎么称呼盘面。"
      : "两人都是常数：环上点就是盘面数，没有折法争议。这一档只标松紧，不代替上面两段各人脾气的话。";
  return `你是主路径 ${lpA}，对方是 ${lpB}。${fold}${overlay}点开下面小三角，可慢慢看环距怎么折；上面合拍卡才是咱们这一版的共读正文，别当第二套算命。`;
}

export function lifePathPairCompatZh(lpA: number, lpB: number): LifePathPairCompatZh {
  const masterAside =
    MASTER.has(lpA) || MASTER.has(lpB)
      ? "有人落在 11/22/33：环距里已经借过副数 2/4/6，正文仍叫盘面上的本数，不会把 11 收成 2 再读。和别的站对比，先问清折不折、有没有把生日数误当主路径。直觉可以收进日记，大事仍过证据、代价、退路三问再落子。"
      : "";

  const birthdayLine = (bdA: number, bdB: number) =>
    bdA === bdB
      ? `生日数都是 ${bdA}（从生日化出的小数，不是主路径）：像同一种口音里的小方言，用来解释「小事为什么容易擦」最合适。不能倒推人生，更不能单靠它定亲疏；大事仍以主路径、环距与纸面约定为准。`
      : `生日数是 ${bdA} 与 ${bdB}：像两件衣服里不同的衬里，能补一点小细节，不能替主路径说话。先看主路径与约定，再用生日数解释小摩擦；别反过来用一句话定终身。`;

  if (lpA === lpB) {
    const t = lifePathPairTwinVoiceBodyZh(lpA);
    return {
      band: "twin",
      bandLabel: LIFE_PATH_PAIR_BAND_DISPLAY_ZH.twin,
      circularStep: 0,
      ...pairPortraits(lpA, lpB),
      ringBridge: ringBridgeParagraph(lpA, lpB, "twin", 0),
      lead: t.lead,
      afterLead: t.afterLead,
      bullets: t.bullets,
      masterAside,
      birthdayLine,
    };
  }

  const step = lifePathCircularStep(lpA, lpB);
  let band: Exclude<LifePathPairBand, "twin">;
  if (step === 1) band = "near";
  else if (step === 2) band = "ease";
  else if (step === 3) band = "grind";
  else band = "pole";

  const body: PairMatrixManualBodyZh = lifePathPairMatrixVoiceBodyZh(lpA, lpB);
  return {
    band,
    bandLabel: LIFE_PATH_PAIR_BAND_DISPLAY_ZH[band],
    circularStep: step,
    ...pairPortraits(lpA, lpB),
    ringBridge: ringBridgeParagraph(lpA, lpB, band, step),
    lead: body.lead,
    afterLead: body.afterLead,
    bullets: body.bullets,
    masterAside,
    birthdayLine,
  };
}
