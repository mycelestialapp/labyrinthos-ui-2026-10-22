/**
 * 共鸣页「合拍」卡展示层：分节口吻与 7↔9 定稿同级叙事密度（【序幕】…【收束】）。
 * 环距档位与合拍数据源里的折步一致；7↔9 另有专稿 `numerology-syn-compat-pair-79-voice-zh`。
 */

import {
  LIFE_PATH_PAIR_BAND_DISPLAY_ZH,
  lifePathCircularStep,
  masterProxy,
  type LifePathPairBand,
} from "@/lib/numerology-life-path-pair-compat-zh";
import { numerologySynCompatPair79VoiceSectionsZh } from "@/lib/numerology-syn-compat-pair-79-voice-zh";
import {
  aboutOtherVoiceParagraphsZh,
  aboutYouVoiceParagraphsZh,
} from "@/lib/numerology-life-path-pair-voice-about-zh";

const MASTER = new Set([11, 22, 33]);

function resolveBand(lpA: number, lpB: number): LifePathPairBand {
  if (lpA === lpB) return "twin";
  const step = lifePathCircularStep(lpA, lpB);
  if (step === 1) return "near";
  if (step === 2) return "ease";
  if (step === 3) return "grind";
  return "pole";
}

function frictionTitle(band: LifePathPairBand): string {
  if (band === "twin") return "【摩擦点】两面镜子";
  if (band === "near") return "【摩擦点】心照不宣的便宜";
  if (band === "ease") return "【摩擦点】差一截的命名";
  if (band === "grind") return "【摩擦点】两块表的时差";
  return "【摩擦点】绳子两头";
}

function frictionParagraph(band: LifePathPairBand): string {
  if (band === "twin") {
    return "同数是照镜子：长处会加成，短处也会对称放大。最怕两个车头、两套口头承诺在同一件事上打架；轮换之前先冻旧口径，再换帅，不然吵的都是回声。";
  }
  if (band === "near") {
    return "环上最近，像一前一后好配合，也像门对门听得见锅碗瓢盆。真正磨人的常是「不说也会懂」的幻觉：你们越像，越要把默认前提写出来，再谈谁更爱谁。";
  }
  if (band === "ease") {
    return "隔两步，往往懂七成剩三成；那三成多半是名词、期限、责任没对齐。别用嗓门把七成补成十成，先把定义表和纪要补上，耳朵会松下来。";
  }
  if (band === "grind") {
    return "隔三步，节律差得像两个人各戴一块表。先把「不一样」写成分工与节奏约定，别先写成对错；节奏差不等于人品差，只是并轨前要减速。";
  }
  return "近乎对径，张力大得像两头拉风箱，中间那点空就是关系本身。界线晚写一天就多耗一天；先把「谁说了算哪些事」写成能上墙的条款，再谈亲疏远近。";
}

function stackReadTitle(band: LifePathPairBand): string {
  return `【叠读】${LIFE_PATH_PAIR_BAND_DISPLAY_ZH[band]}`;
}

function stackReadNarrative(band: LifePathPairBand, label: string): string {
  if (band === "twin") {
    return "同数叠影：好处坏处都容易对称放大，像两个人用同一把梳子梳不同的头，齿痕却像。";
  }
  if (band === "near") {
    return `「${label}」像门挨门：脚步声一响彼此都知道，却不一定叫得准对方心里那桩事的学名。`;
  }
  if (band === "ease") {
    return `「${label}」像隔着一条街喊话：声调懂了大半，剩下的偏偏要命，像差一个字就改判的卷子。`;
  }
  if (band === "grind") {
    return `「${label}」像两路鼓点交错：单独听都对，叠在一起才硌耳。`;
  }
  return `「${label}」：力气最容易花在「谁更对」上，而忘了先把绳子中间的结看清楚。`;
}

function stackReadTechnical(lpA: number, lpB: number, band: LifePathPairBand, step: number): string {
  if (band === "twin") {
    const m = MASTER.has(lpA);
    return `环距为 0，签作「${LIFE_PATH_PAIR_BAND_DISPLAY_ZH.twin}」。${m ? "大师数在折环距时用过副数，这里仍直呼盘面本数；两人同数时敏感与压力也易对称放大，纸面要比单人时再严一档。" : "常数同数没有折法争议，仍要防同一种脾气互点同一种火。"}`;
  }
  const px = masterProxy(lpA);
  const py = masterProxy(lpB);
  const label = LIFE_PATH_PAIR_BAND_DISPLAY_ZH[band];
  const hasM = MASTER.has(lpA) || MASTER.has(lpB);
  const bothM = MASTER.has(lpA) && MASTER.has(lpB);
  const overlay = bothM
    ? "两人都是大师数：节奏与压力更容易一起抬高，别半途换算法。"
    : hasM
      ? "只有一方是大师数：折环距时一边用副数、一边仍用本数；和别的站对读前先问清折不折。"
      : "两人都是常数：环上点就是盘面数，没有折法争议。";
  return `盘面对折到九数环：${lpA} 读作 ${px}，${lpB} 读作 ${py}；最短步 ${step}，落在「${label}」。${overlay}这一档只标松紧，不替你们下结论。`;
}

function prologue(lpA: number, lpB: number, band: LifePathPairBand): readonly string[] {
  if (band === "twin") {
    return [
      `两个人主路径都是 ${lpA}。同数不是「更好相处」的便宜货，而是同一种路数的好处与坏处都容易叠在一起，像回声撞回声。`,
      "先把分工与底线说清楚，再谈亲近；先落纸，再吵嘴——镜子才照得见人，不照得见火。",
    ];
  }
  if (band === "near") {
    return [
      `这一组是主路径 ${lpA} 与 ${lpB}：在环上你们是近邻，风吹草动都传得快，像并行的两条轨。`,
      "远看像好配合；近看才知最怕的是「不说也会懂」的心照不宣。下面先读你们各自怎么走路，再找磨人的那一撮毛刺。",
    ];
  }
  if (band === "ease") {
    return [
      `这一组是主路径 ${lpA} 与 ${lpB}：隔一口气，看得懂大半，又总差那一截，像顺风听见屋檐上的雨，却说不清雨柱落谁家檐角。`,
      "懂七成最容易偷换成「应该懂十成」；那剩下三成，多半是名词和期限没对齐。先读人，再对表。",
    ];
  }
  if (band === "grind") {
    return [
      `这一组是主路径 ${lpA} 与 ${lpB}：隔三步，像两个节拍相间的鼓点，踩在一起才觉得对，踩岔了先怪节拍不怪人。`,
      "先把「不一样」看成两套合法节奏，再谈谁更爱谁；先把分工写进纸里，再上桌吵，会少很多冤枉气。",
    ];
  }
  return [
    `这一组是主路径 ${lpA} 与 ${lpB}：近乎对径，像绳子两头各自使劲，中间那点空就是你们的关系。`,
    "界线晚写一天，就多耗一天；下面先读你们各自怎么使力，再把「谁说了算哪些事」慢慢钉到墙上。",
  ];
}

function threeActions(band: LifePathPairBand): readonly string[] {
  if (band === "twin") {
    return [
      "对外只开一张嘴，对内留质证与记录；轮换前先交接清单，旧口径冻到新纪要双签，别让回声改口径。",
      "同一件事只设一个主答；要换人先宣布，二十四小时内补书面，别靠口头漂移把日历磨穿。",
      "每周一刻钟对表：只念清单与版本，不翻旧账；连续三晚开火就强制停火一周，只做止血与复盘。",
    ];
  }
  return [
    "先复述再解释：各自用三行写对方版本，写完再谈。",
    "大事写可验收：什么叫完、何时算数，落纸；别用默契代替验收。",
    "留白要命名：谁需要安静几天、什么算失联、什么算充电，写清比猜省命。",
  ];
}

function closingLine(band: LifePathPairBand): string {
  if (band === "twin") {
    return "同数不是复制粘贴两个人；把差异写进日程与纪要里，镜子才不会变成互相指责的灯。";
  }
  if (band === "near") {
    return "你们贴得近，误伤也近；把默会说穿，比把爱说满更省力。主路径只是纸上的等高线，日子是走出来的。";
  }
  if (band === "ease") {
    return "隔两步不必硬读懂；补一张名词表，七十能慢慢变回一百。节奏差先当误会，别先当人品的判决。";
  }
  if (band === "grind") {
    return "两块表的时差不必判死刑；写规则的人，最后往往写得出情书。先把并轨写成可试的顺序，再谈远近。";
  }
  if (band === "pole") {
    return "对径像两根绳往反方向抻；要先写清的往往不是爱不够，是线太细。把上面三条按顺序试一遍，先把人品和节拍拆开。";
  }
  return "主路径只是简图；把上面三条当成能试的顺序，就不容易被节奏差读成人品差。";
}

export type SynCompatVoiceSectionZh = {
  title: string;
  paragraphs: readonly string[];
};

/**
 * 合拍卡分节正文（非 1↔9 合议深读路径用）；与徽章环距同源。
 */
export function numerologySynCompatCardVoiceSectionsZh(lpA: number, lpB: number): readonly SynCompatVoiceSectionZh[] {
  const pair79 = numerologySynCompatPair79VoiceSectionsZh(lpA, lpB);
  if (pair79) return pair79;

  const band = resolveBand(lpA, lpB);
  const step = lifePathCircularStep(lpA, lpB);
  const label = band === "twin" ? "" : LIFE_PATH_PAIR_BAND_DISPLAY_ZH[band];

  const sections: SynCompatVoiceSectionZh[] = [
    { title: "【序幕】", paragraphs: prologue(lpA, lpB, band) },
    { title: `【关于你 · 主路径 ${lpA}】`, paragraphs: aboutYouVoiceParagraphsZh(lpA) },
    { title: `【关于对方 · 主路径 ${lpB}】`, paragraphs: aboutOtherVoiceParagraphsZh(lpB) },
    {
      title: stackReadTitle(band),
      paragraphs: [stackReadNarrative(band, label), stackReadTechnical(lpA, lpB, band, step)],
    },
    { title: frictionTitle(band), paragraphs: [frictionParagraph(band)] },
    { title: "【三条照做】", paragraphs: threeActions(band) },
    { title: "【收束】", paragraphs: [closingLine(band)] },
  ];

  return sections;
}
