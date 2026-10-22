/**
 * 雷诺曼大师连读：单面、相邻成句、中轴、两头对看。无正逆位。
 */
import type { LenormandCard } from "./lenormand-cards";
import type { LenormandSpreadId } from "./lenormand-spread-id";
import { buildQuestionProfile } from "./lenormand-reading-base-zh";
import {
  SHADOW_CARD_IDS,
  categoryToDomain,
  getLenormandLexicon,
} from "./lenormand-card-lexicon-zh";
import { isLostPetInquiry, lostPetLine } from "./lenormand-lost-pet-zh";
import type { QuestionCategory } from "./question-category-keywords";

function lex(card: LenormandCard) {
  return getLenormandLexicon(card.id);
}

function domainLine(card: LenormandCard, category: QuestionCategory, inquiry?: string): string {
  if (inquiry && isLostPetInquiry(inquiry)) {
    return lostPetLine(card.id) ?? card.shortMeaning;
  }
  const L = lex(card);
  if (!L) return card.shortMeaning;
  const d = categoryToDomain(category);
  return L.domain[d] || L.essence;
}

function pairLine(a: LenormandCard, b: LenormandCard): string {
  const chainA = lex(a)?.chain ?? a.shortMeaning;
  const chainB = lex(b)?.chain ?? b.shortMeaning;
  return `${a.nameZh}挨着${b.nameZh}。${chainA}，接到${chainB}。`;
}

function shadowNote(cards: LenormandCard[]): string {
  const shadows = cards.filter((c) => SHADOW_CARD_IDS.has(c.id));
  if (shadows.length === 0) {
    return "全线没有云、蛇、棺材、镰刀、鞭子、狐狸、山、老鼠、十字这些硬阴影。不是算计、撕开、已经走了的那种局。";
  }
  const names = shadows.map((c) => c.nameZh).join("、");
  return `阴影牌在场：${names}。不是自动等于坏事，是这条线里有弯、有挡、有耗或有收口，要当真人障碍读，不要跳过。`;
}

function yesNoOpening(
  cards: LenormandCard[],
  inquiry: string,
  isJudgement: boolean,
): string {
  if (!inquiry) {
    return "你没写下问题。我按牌面把日子说出来。";
  }
  const head = `你问的是「${inquiry}」。`;
  if (isLostPetInquiry(inquiry)) {
    const hub = cards.length >= 9 ? cards[4] : cards.length >= 5 ? cards[2] : cards.length >= 3 ? cards[1] : cards[0];
    const loc = hub ? lostPetLine(hub.id) : null;
    return loc
      ? `${head}先看${hub!.nameZh}：${loc}`
      : `${head}这是找它，不是看病。沿最后看见的地方出门。`;
  }
  if (!isJudgement) {
    return `${head}雷诺曼不绕弯，用生活和结果答。`;
  }
  const center = cards.length >= 5 ? cards[2] : cards.length >= 3 ? cards[1] : cards[0];
  const L = center ? lex(center) : null;
  const yes = L?.yesNo ?? "先看整条线，不单点。";
  return `${head}这局不让你停在脑子里猜。中间偏枢纽的是${center?.nameZh ?? "整条线"}：${yes}`;
}

function chainBlock(cards: LenormandCard[]): string {
  if (cards.length < 2) return cards[0] ? `${cards[0].nameZh}：${lex(cards[0])?.chain ?? cards[0].shortMeaning}` : "";
  const parts: string[] = [];
  for (let i = 0; i < cards.length - 1; i += 1) {
    parts.push(pairLine(cards[i]!, cards[i + 1]!));
  }
  return parts.join("\n\n");
}

function sentenceOfLine(cards: LenormandCard[]): string {
  const bits = cards.map((c) => lex(c)?.chain ?? c.nameZh);
  return bits.join("，然后");
}

function bodyGuide(cards: LenormandCard[], category: QuestionCategory, inquiry?: string): string[] {
  const houses = cards.some((c) => c.id === 4);
  const heart = cards.some((c) => c.id === 24);
  const ring = cards.some((c) => c.id === 25);
  const sun = cards.some((c) => c.id === 31);
  const dog = cards.some((c) => c.id === 18);
  const lines: string[] = [];
  if (inquiry && isLostPetInquiry(inquiry)) {
    lines.push("先定还在小区里还是已经走远。沿最后看见它的路、它常去的点、有食有水的地方。立刻发寻宠，别隔夜。");
    if (dog) lines.push("有狗这张牌：它还是会认家的那只。邻牌说它停在哪一类地方。");
    if (houses) lines.push("有房子：先把门、院子、楼下、窝翻完，再往外扩。");
    if (sun) lines.push("有太阳：偏向白天、亮处还能找到。现在就出门。");
    if (ring) lines.push("有戒指：跟家还套着，不是一去不回。");
    return lines;
  }
  if (category === "感情婚姻") {
    lines.push("少把问题问成一句空的保证。看三件有重量的事：日常还让不让你进；身体近不近；要紧事还找不找你。");
  } else if (category === "失物寻找") {
    lines.push("先定在家里还是外面，再沿最近走过的路、最后摸过的地方找。");
  } else if (category === "事业工作") {
    lines.push("少问一句空的成败。看回信、合同、谁拍板、你这周能动哪一步。");
  } else if (category === "官司法律") {
    lines.push("看文件、期限、谁在拖。牌面只作参照，不替代律师。");
  } else {
    lines.push("少停在形容词上。看能碰到的现场：人、文件、门、钱、身体。");
  }
  if (houses) lines.push("有房子：现场在门、灯、枕头、钥匙里，不在朋友圈。");
  if (sun) lines.push("有太阳：有话当面说完，说完就过日子。热怕被追问灭掉。");
  if (ring) lines.push("有戒指：圈还在不在，看你还守不守、对方还套不套，不看形容词。");
  if (heart) lines.push("有心：心在，仍要看能不能过成日子。");
  if (category === "身体健康") lines.push("身体只作参照，不替代就医。");
  return lines;
}

function readLine3(cards: LenormandCard[], category: QuestionCategory, inquiry: string, judgement: boolean): string {
  const [a, b, c] = cards;
  const chunks = [
    yesNoOpening(cards, inquiry, judgement),
    "三线从左到右：过去或起因 → 现在 → 走向。相邻成一句。",
    `${a.nameZh}、${b.nameZh}、${c.nameZh}。`,
    shadowNote(cards),
    pairLine(a, b),
    pairLine(b, c),
    `整句：${sentenceOfLine(cards)}。`,
    `${a.nameZh}是怎么来的：${domainLine(a, category, inquiry)}`,
    `现在落在${b.nameZh}：${domainLine(b, category, inquiry)}`,
    `走向是${c.nameZh}：${domainLine(c, category, inquiry)}`,
    ...bodyGuide(cards, category, inquiry),
  ];
  return chunks.join("\n\n");
}

function readLine5(cards: LenormandCard[], category: QuestionCategory, inquiry: string, judgement: boolean): string {
  const [a, b, mid, d, e] = cards;
  const chunks = [
    yesNoOpening(cards, inquiry, judgement),
    "五线从左读到右。第 3 张是心脏。1-2 是怎么铺过来的，4-5 是落到什么上、收成什么。",
    `${cards.map((c) => c.nameZh).join(" → ")}。`,
    shadowNote(cards),
    `中轴是${mid.nameZh}。${domainLine(mid, category, inquiry)} ${lex(mid)?.body ?? ""}`.trim(),
    pairLine(a, b),
    pairLine(b, mid),
    pairLine(mid, d),
    pairLine(d, e),
    `两头对看：开头${a.nameZh}（${lex(a)?.chain}），收尾${e.nameZh}（${lex(e)?.chain}）。`,
    `整句：${sentenceOfLine(cards)}。`,
    `${a.nameZh}：${domainLine(a, category, inquiry)}`,
    `${b.nameZh}：${domainLine(b, category, inquiry)}`,
    `${d.nameZh}：${domainLine(d, category, inquiry)}`,
    `${e.nameZh}：${domainLine(e, category, inquiry)}`,
    ...bodyGuide(cards, category, inquiry),
  ];
  return chunks.join("\n\n");
}

function readBox9(cards: LenormandCard[], category: QuestionCategory, inquiry: string, judgement: boolean): string {
  const center = cards[4];
  const cross = [cards[1], cards[3], cards[4], cards[5], cards[7]];
  const chunks = [
    yesNoOpening(cards, inquiry, judgement),
    "九宫先看中心，再看上下左右十字，四角是拉扯。不平均撒九句鸡汤。",
    `中心是${center.nameZh}：${domainLine(center, category, inquiry)} ${lex(center)?.body ?? ""}`.trim(),
    shadowNote(cards),
    `上（念头）${cards[1].nameZh}：${domainLine(cards[1], category, inquiry)}`,
    `下（根基）${cards[7].nameZh}：${domainLine(cards[7], category, inquiry)}`,
    `左（已然）${cards[3].nameZh}：${domainLine(cards[3], category, inquiry)}`,
    `右（将然）${cards[5].nameZh}：${domainLine(cards[5], category, inquiry)}`,
    `十字连读：${chainBlock(cross)}`,
    `四角拉扯：${cards[0].nameZh}、${cards[2].nameZh}、${cards[6].nameZh}、${cards[8].nameZh}。${cards
      .filter((_, i) => i === 0 || i === 2 || i === 6 || i === 8)
      .map((c) => domainLine(c, category, inquiry))
      .join(" ")}`,
    ...bodyGuide(cards, category, inquiry),
  ];
  return chunks.join("\n\n");
}

function readGrand(cards: LenormandCard[], category: QuestionCategory, inquiry: string, judgement: boolean): string {
  const man = cards.find((c) => c.id === 28);
  const woman = cards.find((c) => c.id === 29);
  const heart = cards.find((c) => c.id === 24);
  const ring = cards.find((c) => c.id === 25);
  const sig: LenormandCard[] =
    category === "感情婚姻"
      ? [man, woman].filter((c): c is LenormandCard => Boolean(c))
      : cards.slice(0, 3);
  const near = cards.slice(0, 8);
  const chunks = [
    yesNoOpening(cards, inquiry, judgement),
    "大展三十六张一次铺开。正统读法：先找人（男人/女人），再看心、戒指、房子、工作（锚），以及贴在他们旁边的牌。不把三十六张平均念完。",
    shadowNote(cards),
    man ? `男人在场：${domainLine(man, category, inquiry)}` : "这桌没翻出「男人」这张，男性当事人要用邻牌和问题里的「他」来对。",
    woman ? `女人在场：${domainLine(woman, category, inquiry)}` : "这桌没翻出「女人」这张，女性当事人要对问题里的「她」和房子、心、月亮。",
    heart ? `心在桌面上：${domainLine(heart, category, inquiry)}` : "心不在前排显位，感情不是这桌最亮的那盏灯，或藏在更远的位置。",
    ring ? `戒指在桌面上：${domainLine(ring, category, inquiry)}` : "戒指不在你一眼能抓住的近处，承诺可能还没落到桌上，或绑在远处。",
    `近景八张（开局那一片）：${near.map((c) => c.nameZh).join("、")}。`,
    chainBlock(near.slice(0, 5)),
    sig.length
      ? `人物线索：${sig
          .map((c) => `${c.nameZh}——${lex(c)?.body ?? c.shortMeaning}`)
          .join("；")}`
      : "",
    ...bodyGuide(cards, category, inquiry),
    "大展给的是地图，不是当天判决。先按人物和心/戒指/房子/锚这几张定位，再决定下一问要缩成三线或五线。",
  ];
  return chunks.filter(Boolean).join("\n\n");
}

export function buildLenormandMasterReadingZh(
  spreadId: LenormandSpreadId,
  cards: LenormandCard[],
  inquiry?: string,
): string {
  const q = (inquiry || "").trim();
  const profile = buildQuestionProfile(q);
  const category = profile.categoryKey;
  const judgement = profile.intent === "judgement";

  if (cards.length === 0) return "还没启牌。选阵，启牌，我才有日子可读。";

  if (spreadId === "line3" && cards.length >= 3) {
    return readLine3(cards.slice(0, 3), category, q, judgement);
  }
  if (spreadId === "line5" && cards.length >= 5) {
    return readLine5(cards.slice(0, 5), category, q, judgement);
  }
  if (spreadId === "box9" && cards.length >= 9) {
    return readBox9(cards.slice(0, 9), category, q, judgement);
  }
  if (spreadId === "grand" && cards.length >= 36) {
    return readGrand(cards.slice(0, 36), category, q, judgement);
  }
  return `${cards.map((c) => c.nameZh).join("、")}。${cards.map((c) => domainLine(c, category, inquiry)).join(" ")}`;
}
