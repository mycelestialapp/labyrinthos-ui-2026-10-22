/**
 * 工作台「我→对方」当场拼读的共读正文（异数）：与合拍卡同一套「你／对方」底句，
 * 仍满足 `主路径 我 与 对方：` 起首与 3-22 / 22-3 两种席位的措辞差异（供 `verify:numerology`）。
 */

import type { PairMatrixManualBodyZh } from "@/lib/numerology-life-path-pair-matrix-types";
import { aboutOtherVoiceParagraphsZh, aboutYouVoiceParagraphsZh } from "@/lib/numerology-life-path-pair-voice-about-zh";

type Band = "twin" | "near" | "ease" | "grind" | "pole";

const BAND_DISPLAY: Record<Exclude<Band, "twin">, string> = {
  near: "近邻一口气",
  ease: "隔岸两步",
  grind: "两拍三步",
  pole: "对径一盏灯",
};

function masterProxy(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

function lifePathCircularStep(a: number, b: number): number {
  const x = masterProxy(a);
  const y = masterProxy(b);
  if (x < 1 || x > 9 || y < 1 || y > 9) return Math.abs(x - y);
  const d = Math.abs(x - y);
  return Math.min(d, 9 - d);
}

function resolveBand(lpA: number, lpB: number): Band {
  if (lpA === lpB) return "twin";
  const step = lifePathCircularStep(lpA, lpB);
  if (step === 1) return "near";
  if (step === 2) return "ease";
  if (step === 3) return "grind";
  return "pole";
}

function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function bandSuffix(band: Exclude<Band, "twin">): string {
  if (band === "near") return "近得像门挨门，风吹草动都传得快，默会也最容易偷换成误会。";
  if (band === "ease") return "隔一口气能懂大半，剩那一截往往卡在命名、期限与验收。";
  if (band === "grind") return "两路鼓点交错，像各戴一块表；节奏差不等于人品差，先写分工再谈爱。";
  return "张力像绳子两头抻，界线要先写清，爱才好慢慢靠岸。";
}

function bandTryClose(band: Exclude<Band, "twin">): string {
  if (band === "near") {
    return "同一件事只设一个主答；要换人先宣布并留书面交接；名词表与纪要当天双签，默会不替纸。";
  }
  if (band === "ease") {
    return "先谈事实、期限、责任、验收，再谈期待与情绪；各写三条「以为不用写却总出事」的默契，互签版本。";
  }
  if (band === "grind") {
    return "目标先放低、程序加厚：大事先试两周小样，写指标、复盘与退出；旁听可以，要有记录，别变站队骂战。";
  }
  return "把不同写成谁负责什么；大钱与身体边界尽量双签或公证；口头宽限最多一次且留痕。";
}

function frictionLine(band: Exclude<Band, "twin">): string {
  if (band === "near") {
    return "「不说也会懂」在这一档最贵：你们越像，越要把默认前提写出来，再谈谁更爱谁。";
  }
  if (band === "ease") {
    return "七成懂最容易偷换成十成该懂：那三成多半是名词没对齐，别用嗓门把七成补成十成。";
  }
  if (band === "grind") {
    return "节律差像两块表，先把「不一样」写成分工与节奏约定，别先写成对错。";
  }
  return "对径最易热开局、冷规则；先把谁说了算哪些事钉到墙上，再谈亲疏远近。";
}

/**
 * 拼出「我→对方」这一席的共读总领与备忘（异数）；手写备查稿仍在库里，线上目录与合拍数据都读这一份。
 */
export function lifePathPairMatrixVoiceBodyZh(lpMe: number, lpOther: number): PairMatrixManualBodyZh {
  const band = resolveBand(lpMe, lpOther);
  if (band === "twin") {
    throw new Error("lifePathPairMatrixVoiceBodyZh: twin should use lifePathPairTwinVoiceBodyZh");
  }
  const tag = BAND_DISPLAY[band];
  const y0 = aboutYouVoiceParagraphsZh(lpMe)[0];
  const y1 = aboutYouVoiceParagraphsZh(lpMe)[1];
  const o0 = aboutOtherVoiceParagraphsZh(lpOther)[0];
  const o1 = aboutOtherVoiceParagraphsZh(lpOther)[1];

  const lead = `主路径 ${lpMe} 与 ${lpOther}：${clip(y0, 96)} 对方主路径 ${lpOther} 则是：${clip(
    o0,
    96,
  )} 你们在环上落在「${tag}」——${bandSuffix(band)}`;

  const afterLead: readonly [string, string] = [
    `你（主路径 ${lpMe}）这一侧先落纸：${y1}`,
    `对方（主路径 ${lpOther}）那侧先别定罪：${o1} ${frictionLine(band)} 先这样试：${bandTryClose(band)}`,
  ];

  const bullets: readonly [string, string, string, string, string] = [
    `各自用三行写对方（我主路径 ${lpMe}、对方主路径 ${lpOther}），写完再谈立场；禁边写边改口漂移。`,
    "大事写可验收：什么叫完、何时算数、谁签；落纸，别用默契代替验收。",
    "留白要命名：谁要安静几天、什么叫失联、什么叫充电，写清比猜省命。",
    "钱、孩子、照护：先对名词表，再谈态度；感受与条款分桌限时，禁混审。",
    "同一议题连续三次翻车：加一页模板或请人旁听一次，或冻结一周只做止血与复盘。",
  ];

  return { lead, afterLead, bullets };
}
