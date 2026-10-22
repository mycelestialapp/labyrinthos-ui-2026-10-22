import fs from "fs";
import path from "path";
const Q02_LOCKED_BY_KEY: Record<string, { nameZh: string; picture: string; trust: string }> = {};
const Q02_SINGLE_ROWS: [string, boolean, string, string][] = [];

export type SpreadArticle = {
  open: string;
  seats: string[];
  chain: string;
  action: string;
};

type CardFace = {
  pageId: string;
  cardId: string;
  upright: boolean;
  name: string;
  pos: string;
  picture: string;
  trust: string;
  open: string;
  action: string;
};

const POS: Record<string, string[]> = {
  celtic: ["现状", "阻碍", "潜意识", "过去", "未来", "自我", "环境", "希望/恐惧", "他人看法", "结果"],
  triangle: ["过去", "现在", "未来"],
  choice: ["A · 优势", "A · 劣势", "A · 结果", "B · 优势", "B · 劣势", "B · 结果"],
  hexagram: ["过去", "现在", "未来", "行动", "环境", "希望/恐惧"],
  trinity: ["身", "心", "灵"],
  venus: ["自己", "对方", "关系", "问题", "建议", "结果", "潜在影响"],
};

const SINGLE = new Map(
  Q02_SINGLE_ROWS.map((row) => [row[0] + "|" + (row[1] ? "u" : "r"), { open: row[2], action: row[3] }]),
);

const CACHE = path.join(process.cwd(), ".cache", "q02-spread.json");

function pageToCardId(pageId: string): { cardId: string; upright: boolean } | null {
  const upright = !pageId.endsWith("_rev");
  const baseId = pageId.replace(/_rev$/, "");
  const majors: Record<string, string> = {
    fool: "major_0", magician: "major_1", priestess: "major_2", empress: "major_3",
    emperor: "major_4", hierophant: "major_5", lovers: "major_6", chariot: "major_7",
    strength: "major_8", hermit: "major_9", wheel: "major_10", justice: "major_11",
    hanged: "major_12", death: "major_13", temperance: "major_14", devil: "major_15",
    tower: "major_16", star: "major_17", moon: "major_18", sun: "major_19",
    judgement: "major_20", world: "major_21",
  };
  if (majors[baseId]) return { cardId: majors[baseId], upright };
  for (const suit of ["wands", "cups", "swords", "pentacles"]) {
    if (!baseId.startsWith(suit)) continue;
    const tail = baseId.slice(suit.length);
    if (/^\d+$/.test(tail)) return { cardId: suit + "_" + tail, upright };
    if (tail === "_page") return { cardId: suit + "_11", upright };
    if (tail === "_knight") return { cardId: suit + "_12", upright };
    if (tail === "_queen") return { cardId: suit + "_13", upright };
    if (tail === "_king") return { cardId: suit + "_14", upright };
  }
  return null;
}

function anchorOf(picture: string): string {
  const s = picture.replace(/。$/, "").trim();
  const cut = s.split(/[，,]/)[0].trim();
  return cut.length >= 4 ? cut : s.slice(0, 8);
}

function sentenceCount(text: string): number {
  return text.split("。").filter((part) => part.trim()).length;
}

function withPicture(face: CardFace, seat: string): string {
  const pic = face.picture.endsWith("。") ? face.picture : face.picture + "。";
  const bare = pic.replace(/。$/, "");
  let rest = (seat || "").trim();
  if (rest.startsWith(pic)) rest = rest.slice(pic.length).trim();
  else if (rest.indexOf(bare) !== -1) {
    const at = rest.indexOf(bare);
    rest = (rest.slice(0, at) + rest.slice(at + bare.length)).replace(/^[。，\s]+/, "").trim();
  }
  if (rest && !rest.endsWith("。")) rest += "。";
  return pic + rest;
}

function focusOf(spread: string, n: number): { pastI: number; nowI: number; foreI: number } {
  if (spread === "venus") return { pastI: 0, nowI: 1, foreI: 5 };
  if (spread === "celtic") return { pastI: 3, nowI: 0, foreI: 9 };
  if (spread === "triangle" || spread === "hexagram" || spread === "trinity") return { pastI: 0, nowI: 1, foreI: 2 };
  if (spread === "choice") return { pastI: 1, nowI: 4, foreI: 5 };
  return { pastI: 0, nowI: 0, foreI: n - 1 };
}

function actionIndexes(spread: string): number[] {
  if (spread === "choice") return [2, 5];
  if (spread === "hexagram") return [3];
  if (spread === "venus") return [4];
  if (spread === "celtic") return [9];
  return [2];
}

function readEnvFile(): Record<string, string> {
  const file = path.join(process.cwd(), ".env.local");
  const out: Record<string, string> = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i < 1) continue;
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

function facesFor(spread: string, pageIds: string[]): CardFace[] | null {
  const pos = POS[spread];
  if (!pos || pageIds.length !== pos.length) return null;
  const faces: CardFace[] = [];
  for (let i = 0; i < pageIds.length; i++) {
    const mapped = pageToCardId(pageIds[i]);
    if (!mapped) return null;
    const key = mapped.cardId + "|" + (mapped.upright ? "u" : "r");
    const locked = Q02_LOCKED_BY_KEY[key];
    const single = SINGLE.get(key);
    if (!locked || !single) return null;
    faces.push({
      pageId: pageIds[i],
      cardId: mapped.cardId,
      upright: mapped.upright,
      name: locked.nameZh,
      pos: pos[i],
      picture: locked.picture,
      trust: locked.trust,
      open: single.open,
      action: single.action,
    });
  }
  return faces;
}

function checkArticle(spread: string, faces: CardFace[], article: SpreadArticle, keeps: string[] = []): string[] {
  const reasons: string[] = [];
  const blob = [article.open, article.chain, article.action, ...(article.seats || [])].join("\n");
  if (!article.open || article.open.length < 40 || /所以。|因为。|，。/.test(article.open)) reasons.push("核心定盘太短");
  if (!article.seats || article.seats.length !== faces.length) reasons.push("位子数量不对");
  if (!article.chain || article.chain.indexOf("因为") === -1 || article.chain.indexOf("所以") === -1) {
    reasons.push("连线要另写一句，里面要有因为、所以");
  }
  if (article.chain && article.open && article.chain === article.open) reasons.push("连线不能把核心定盘再抄一遍");
  if (!article.action || article.action.indexOf("今天") === -1 || article.action.indexOf("看两件：对方来不来") === -1 || article.action.indexOf("来了以后") === -1) {
    reasons.push("破局要写成：今天做什么。看两件：对方来不来。来了以后，看什么。");
  }
  if (/热的那头|冷的那头|这一头/.test(blob)) reasons.push("不要写热的那头、冷的那头、这一头");
  if (/游刃有余|假象|布景|惯性|节拍|咬住|刻度|弧度|丰足|归属感|确定性|脚本|闭环|共识|校准|回响|平制/.test(blob)) reasons.push("不要用确定性、脚本、闭环、共识、校准、回响、丰足、刻度这些词");
  if (article.open.indexOf("信") === -1 || article.open.indexOf("还没") === -1) reasons.push("核心定盘要写明信现在已经在的，未来还没发生");
  if (/你先看住这一下|已经走过|才是现在该信的|后头那张还没落下来|灯是亮的|杯子放在桌上|这盏灯|再往前/.test(article.open + "\n" + (article.chain || ""))) {
    reasons.push("不要用空话把句子接上");
  }
  if (/没[^。]{0,8}而是|门没开|已经侧身|已经迎|没迎上来|没侧身/.test((article.open || "") + "\n" + (article.chain || ""))) {
    reasons.push("两边都还没发生，不要写成已经没迎上来、已经侧身、门已经没开");
  }

  const hasDoor = faces.some((f) => f.name === "权杖四" && f.upright);
  const hasHouse = faces.some((f) => f.name === "星币十" && f.upright);
  const hasTen = faces.some((f) => f.name === "宝剑十" && f.upright);
  if (!hasDoor && /这扇门|能庆祝的门口|花环和柱子/.test(blob)) reasons.push("这手里没有权杖四正位，不许写庆祝的门");
  if (hasDoor && /门关上/.test(blob)) reasons.push("权杖四正位的门是开的");
  if (!hasHouse && /能传下去/.test(blob)) reasons.push("这手里没有星币十正位，不许写成能传下去的家");
  if (hasHouse && /还停在图上/.test(blob)) reasons.push("星币十正位是真能过日子的家");
  if (hasTen && /重新开始/.test(blob) && blob.indexOf("不算重新开始") === -1) reasons.push("宝剑十正位远处那点天亮，不算重新开始");
  if (!hasTen && /不算重新开始|远处那点天亮/.test(blob)) reasons.push("这手里没有宝剑十正位，不要写天亮");

  const focus = focusOf(spread, faces.length);
  const focusFaces = [focus.pastI, focus.nowI, focus.foreI].map((i) => faces[i]).filter(Boolean);
  const pics = focusFaces.map((face) => face.picture.replace(/。$/, ""));
  focusFaces.forEach((face, n) => {
    if (pics[n] && article.open.indexOf(pics[n]) === -1) reasons.push("核心定盘要把「" + face.pos + "」的画面原句写进去");
  });
  faces.forEach((face) => {
    const hitOpen = pastedTrust(article.open, face);
    if (hitOpen) reasons.push("核心定盘不要贴「" + face.pos + "」的原句：" + hitOpen);
    const hitChain = pastedTrust(article.chain || "", face);
    if (hitChain) reasons.push("连线不要贴「" + face.pos + "」的原句：" + hitChain);
  });
  article.open.split("。").forEach((part) => {
    const bit = part.trim();
    if (bit.length >= 12 && article.chain && article.chain.indexOf(bit) !== -1) {
      reasons.push("连线不要把核心定盘的句子再抄一遍");
    }
  });
  if (pics.length >= 2 && pics.every((pic) => pic && article.open.indexOf(pic) !== -1) && !picturesAreWoven(article.open, pics)) {
    reasons.push("核心定盘不要把几句画面挨着排，两句画面中间要有一句人话，里面有因为或所以");
  }
  if (focusFaces.some((face) => face.trust.indexOf("还是") !== -1) && !/还是/.test(article.open.replace(/还是在/g, ""))) {
    reasons.push("有「还是」的那张，两边都还没选完，核心定盘里要留「还是」");
  }
  if (!focusFaces.some((face) => face.trust.indexOf("还是") !== -1) && article.open.indexOf("还是") !== -1) {
    reasons.push("这三张没有两边未定的选择，不要写还是");
  }
  if (/那头|一头|冷热|侧身只|只因太快/.test((article.open || "") + "\n" + (article.chain || ""))) {
    reasons.push("不要用那头、冷热来概括，也不要把还没发生的侧身写成已经发生");
  }
  const said = new Set<string>();
  article.open.split(/[。；]/).forEach((part) => {
    const bit = part.trim();
    if (bit.length < 8) return;
    if (said.has(bit)) reasons.push("不要把同一句说两遍");
    said.add(bit);
  });
  keeps.forEach((bit) => {
    if (bit && article.open.indexOf(bit) === -1) reasons.push("核心定盘要留下这句意思：" + bit);
  });
  if (/第一张|第二张|第三张|眼前已经在|正位|逆位/.test(article.open + "\n" + (article.chain || ""))) {
    reasons.push("不要写第几张，也不要在正文里写正位逆位");
  }
  if (/表象|尚无定论|温度|揭晓|预留|热着|冷着|忽冷忽热|悄悄/.test((article.open || "") + "\n" + (article.chain || ""))) {
    reasons.push("不要用表象、温度、揭晓、预留这些词");
  }
  if (focusFaces.some((face) => face.trust.indexOf("不信已经") !== -1) && /留给你|预留|已经给你|给你了|空位|落脚|留着空|等你/.test((article.open || "") + "\n" + (article.chain || ""))) {
    reasons.push("原意是位子还没给你，不要写成已经留了位子");
  }
  faces.forEach((face) => {
    if (face.picture.indexOf(face.name) === -1 && article.open.indexOf(face.name) !== -1) {
      reasons.push("不要在正文里写牌名");
    }
  });
  if (article.open.indexOf("过去") !== -1 && article.open.indexOf("现在") !== -1 && article.open.indexOf("未来") !== -1) {
    reasons.push("核心定盘不要用过去、现在、未来当标签");
  }
  if (article.chain && article.chain.indexOf("过去") !== -1 && article.chain.indexOf("现在") !== -1 && article.chain.indexOf("未来") !== -1) {
    reasons.push("连线不要用过去、现在、未来当标签");
  }
  const act = new Set(actionIndexes(spread));
  faces.forEach((face, i) => {
    const bit = anchorOf(face.picture);
    const seat = article.seats[i] || "";
    if (bit && seat.indexOf(bit) === -1) reasons.push(face.pos + "缺了画面：" + bit);
    const extra = sentenceCount(seat) - sentenceCount(face.picture);
    if (extra < 1) reasons.push(face.pos + "还要补一句这个位子在说什么");
    if (extra > 1) reasons.push(face.pos + "只留画面加一句，不要贴整段");
    const seatExtra = seat.replace(face.picture, "");
    if (face.trust.indexOf("还是") !== -1 && seatExtra.indexOf("还是") === -1) {
      reasons.push(face.pos + "这一句要留住意思里的「还是」，把两边说出来");
    }
    if (!hasNeededAnchor(seatExtra, face.trust)) {
      reasons.push(face.pos + "这一句要原样带上：" + anchorsForSeat(face.trust).join("、"));
    }
    copiedClauses(face).forEach((clause) => {
      if (article.open.indexOf(clause) !== -1) reasons.push("核心定盘照抄了「" + face.pos + "」的单张");
      if (seat.indexOf(clause) !== -1) reasons.push(face.pos + "照抄了单张，要另写一句");
    });
    if (face.trust.indexOf("你的追求") !== -1 && /他冲|对方在冲|对方冲过来|对方冲得/.test(article.open + "\n" + article.chain)) {
      reasons.push(face.pos + "这张是你在追，不要写成对方在冲");
    }
    if (!act.has(i) && bit.length >= 6 && article.action.indexOf(bit) !== -1) {
      reasons.push("破局只跟指定的那一张，不要写进「" + face.pos + "」");
    }
  });
  return reasons;
}

function pastedTrust(text: string, face: CardFace): string {
  const parts = face.trust.split(/[。，]/).map((part) => part.trim()).filter((part) => part.length >= 6);
  for (let i = 0; i < parts.length; i++) {
    if (text.indexOf(parts[i]) !== -1) return parts[i];
  }
  return "";
}

function trustAnchors(trust: string): string[] {
  const parts = trust.split(/[。，]/).map((part) => part.trim()).filter(Boolean);
  const out: string[] = [];
  for (const part of parts) {
    if (part.length >= 6 && part.length <= 12) out.push(part);
    else if (part.length > 12) out.push(part.slice(0, 8));
  }
  return out;
}

function choiceAnchors(trust: string): string[] {
  return trustAnchors(trust).filter((anchor) => anchor.indexOf("还是") !== -1);
}

function anchorsForSeat(trust: string): string[] {
  const choice = choiceAnchors(trust);
  return choice.length ? choice : trustAnchors(trust);
}

function hasTrustAnchor(text: string, trust: string): boolean {
  const anchors = trustAnchors(trust);
  if (!anchors.length) return true;
  return anchors.some((anchor) => text.indexOf(anchor) !== -1);
}

function hasNeededAnchor(text: string, trust: string): boolean {
  const anchors = anchorsForSeat(trust);
  if (!anchors.length) return true;
  return anchors.some((anchor) => text.indexOf(anchor) !== -1);
}

function picturesAreWoven(open: string, pics: string[]): boolean {
  const hits = pics
    .map((pic) => ({ pic, at: open.indexOf(pic) }))
    .filter((hit) => hit.at !== -1)
    .sort((a, b) => a.at - b.at);
  if (hits.length < 2) return false;
  if (!/因为/.test(open) || !/所以/.test(open)) return false;
  for (let n = 0; n < hits.length - 1; n++) {
    const between = open.slice(hits[n].at + hits[n].pic.length, hits[n + 1].at);
    const rest = between.replace(/因为|所以/g, "").replace(/[。，、；：\s]/g, "");
    if (rest.length >= 6 && /因为|所以/.test(between)) return true;
  }
  return false;
}

function copiedClauses(face: CardFace): string[] {
  const picture = face.picture.replace(/。$/, "");
  return face.open.split("。").map((s) => s.trim()).filter((s) => {
    if (s.length < 12) return false;
    if (picture.indexOf(s) !== -1 || s.indexOf(picture) !== -1) return false;
    if (face.trust.indexOf(s) !== -1) return false;
    return true;
  });
}

function parseArticle(raw: string): SpreadArticle | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const data = JSON.parse(raw.slice(start, end + 1));
    const seats = Array.isArray(data.seats) ? data.seats.map((s: unknown) => String(s || "").trim()) : [];
    return {
      open: String(data.open || "").trim(),
      seats,
      chain: String(data.chain || "").trim(),
      action: String(data.action || "").trim(),
    };
  } catch {
    return null;
  }
}

async function callQwen(prompt: string, temperature = 0.5): Promise<string> {
  const env = readEnvFile();
  const key = env.DASHSCOPE_API_KEY || process.env.DASHSCOPE_API_KEY || "";
  const base = (env.DASHSCOPE_BASE_URL || process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1").replace(/\/$/, "");
  if (!key) throw new Error("missing-key");
  const res = await fetch(base + "/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen-plus",
      temperature,
      max_tokens: 2200,
      messages: [
        {
          role: "system",
          content: "你写塔罗牌阵的一段话。只输出一个 JSON 对象，不要 Markdown。画面必须用给出的原句。意思用自己的话说，不要逐张把原句接上。",
        },
        { role: "user", content: prompt },
      ],
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error("upstream-" + res.status);
  const data = JSON.parse(text);
  return String(data.choices?.[0]?.message?.content || "");
}

function banClauses(face: CardFace): string[] {
  return face.trust.split(/[。，]/).map((part) => part.trim()).filter((part) => part.length >= 6);
}

function statedMeaning(face: CardFace, index: number): string {
  let text = face.trust.replace(/信不信/g, "要看");
  text = text.replace(/不信已经/g, "还没有");
  if (index === 2) text = text.replace(/已经/g, "还没真正");
  text = text.replace(/[。，]{2,}/g, "。").replace(/^[。，\s]+/, "").replace(/[。，\s]+$/, "");
  if (text.replace(/[。，\s]/g, "").length < 4) {
    if (face.trust.indexOf("不信已经") !== -1) return "还没给到你，别当成已经有了";
    if (face.trust.indexOf("还是") !== -1) return "两边都还没定";
    if (index === 2) return "这一下还没发生";
    if (index === 1) return "信眼前这一下";
    return "这一下已经走过";
  }
  return text;
}

function keepBit(line: string): string {
  const parts = line.split("，").map((part) => part.trim()).filter((part) => part.length >= 6);
  const best = parts.sort((a, b) => b.length - a.length)[0] || line.trim();
  return best.length > 16 ? best.slice(0, 14) : best;
}

function fallbackLine(face: CardFace, index: number): string {
  let text = statedMeaning(face, index);
  const swaps: Array<[string, string]> = [
    ["对方", "他"],
    ["很好", "挺好"],
    ["开不开", "是否敞开"],
    ["包不包括", "有没有"],
    ["你的追求很猛", "你追得很猛"],
    ["抓紧松了一点", "手只松了一点"],
    ["冷一点的", "不热的"],
    ["你处处证明没事", "你还在证明自己没事"],
    ["看起来什么都有", "看着像什么都有"],
    ["喝下去是空的", "喝下去发空"],
    ["只有一个人的完整", "这份完整只在他一人身上"],
    ["是他自己的", "是他一人的"],
  ];
  for (let i = 0; i < swaps.length; i++) text = text.split(swaps[i][0]).join(swaps[i][1]);
  text = text.replace(/还是侧身让你过去/g, "还是让开，这下还没定");
  text = text.replace(/侧身，就是太快/g, "");
  const beforeBans = text;
  const bans = banClauses(face).slice().sort((a, b) => b.length - a.length);
  for (let i = 0; i < bans.length; i++) text = text.split(bans[i]).join("");
  text = text.replace(/[。，]{2,}/g, "。").replace(/^[。，\s]+/, "").replace(/[。，\s]+$/, "");
  if (text.replace(/[。，]/g, "").length < 6) text = beforeBans;
  if (index === 1 && text.indexOf("信") === -1) {
    text = text.replace(/^他/, "信他");
    if (text.indexOf("信") === -1) text = "信这一下，" + text;
  }
  if (index === 2 && text.indexOf("还没") === -1) text += "，这一下还没发生";
  if (face.trust.indexOf("还是") !== -1 && !/还是/.test(text.replace(/还是在/g, ""))) text += "，两边还是没定";
  text = text.replace(/就是太快/g, "");
  text = text.replace(/[。，]{2,}/g, "。").replace(/^[。，\s]+/, "").replace(/[。，\s]+$/, "");
  return text || beforeBans;
}

function spokenOpen(faces: CardFace[], focus: { pastI: number; nowI: number; foreI: number }, lines: string[]): string {
  const pic = (face: CardFace) => (face.picture.endsWith("。") ? face.picture : face.picture + "。");
  const bit = (line: string) => line.replace(/[。]+$/, "") + "。";
  const past = faces[focus.pastI];
  const now = faces[focus.nowI];
  const fore = faces[focus.foreI];
  return pic(past) + bit(lines[0]) + "因为" + pic(now) + bit(lines[1]) + "所以" + pic(fore) + bit(lines[2]);
}

function spokenChain(lines: string[]): string {
  const one = (line: string) => line.replace(/[。，].*$/, "").trim();
  const third = one(lines[2]);
  const tail = third.indexOf("还没") === -1 ? third + "，还没发生" : third;
  return "因为" + one(lines[0]) + "，所以" + one(lines[1]) + "。" + tail + "。";
}

function paraphraseOk(text: string, face: CardFace): boolean {
  const bare = face.picture.replace(/。$/, "");
  if (!text || text.length < 8 || text.length > 42) return false;
  if (text.indexOf(bare) !== -1) return false;
  if (/因为|所以|第一张|第二张|第三张/.test(text)) return false;
  if (face.trust.indexOf("还是") !== -1 && !/还是/.test(text.replace(/还是在/g, ""))) return false;
  if (/没迎上来|没侧身|已经侧身|已经迎|门没开|他冲|对方在冲|留给你|预留|为你空|为你留|早已|始终为/.test(text)) return false;
  if (face.trust.indexOf("不信已经") !== -1 && !/[不没别]/.test(text)) return false;
  if (face.trust.indexOf("不信已经") !== -1 && /空着|给你了/.test(text)) return false;
  if (/表象|尚无定论|温度|揭晓|正位|逆位|热着|冷着/.test(text)) return false;
  return !banClauses(face).some((clause) => text.indexOf(clause) !== -1);
}

function parseLines(raw: string): string[] | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const data = JSON.parse(raw.slice(start, end + 1));
    const lines = Array.isArray(data.lines) ? data.lines.map((item: unknown) => String(item || "").trim()) : [];
    return lines.length >= 3 ? lines.slice(0, 3) : null;
  } catch {
    return null;
  }
}

async function paraphraseThree(faces: CardFace[], focus: { pastI: number; nowI: number; foreI: number }): Promise<string[] | null> {
  const picked = [faces[focus.pastI], faces[focus.nowI], faces[focus.foreI]];
  const roles = ["已经走过的那一下", "眼前已经在的那一下。这句里要有「信」", "还没发生的那一下。这句里要有「还没」，不要写成已经发生"];
  let fix = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const blocks = picked.map((face, i) => {
      const why = face.trust.indexOf("不信已经") !== -1
        ? "这句是否定。新句必须有「还没」或「不」。禁止写成已经留了、空着、为你留着。"
        : "";
      return [
        (i + 1) + ". " + roles[i],
        "结论：" + statedMeaning(face, i),
        "这些片段不许原样出现：" + banClauses(face).join(" / "),
        why,
        face.trust.indexOf("还是") !== -1 ? "两边都还没发生，新句要有「还是」。" : "",
        face.trust.indexOf("你的追求") !== -1 ? "这是你在追，不要写成对方在冲。" : "",
      ].filter(Boolean).join("\n");
    });
    const prompt = [
      "把下面三句各自换成一句新的嘴里的话。意思不变。不要写牌的画面。不要写因为、所以。每句 12 到 36 个字。",
      fix,
      blocks.join("\n\n"),
      '只输出 JSON：{"lines":["","",""]}',
    ].filter(Boolean).join("\n");
    let raw = "";
    try {
      raw = await callQwen(prompt, 0.4);
    } catch (err) {
      try {
        fs.mkdirSync(path.join(process.cwd(), ".cache"), { recursive: true });
        fs.appendFileSync(path.join(process.cwd(), ".cache", "q02-reject.log"), "PARA-ERR " + String(err) + "\n");
      } catch { /* ignore */ }
      return null;
    }
    const lines = parseLines(raw);
    if (!lines) {
      fix = "上一稿不是三句 JSON。";
      try {
        fs.appendFileSync(path.join(process.cwd(), ".cache", "q02-reject.log"), "PARA-BAD\n" + raw + "\n");
      } catch { /* ignore */ }
      continue;
    }
    const bad = lines.map((line, i) => {
      if (picked[i].trust.indexOf("不信已经") !== -1 && /留给|为你空|为你留|早已|始终为|空着/.test(line)) {
        return (i + 1) + "写成了相反的意思。要写还没给到，不要写已经留了：" + line;
      }
      if (!paraphraseOk(line, picked[i])) return (i + 1) + "要整句重写：" + line;
      if (i === 1 && line.indexOf("信") === -1) return "2要写出信：" + line;
      if (i === 2 && line.indexOf("还没") === -1) return "3要写出还没：" + line;
      return "";
    }).filter(Boolean);
    if (!bad.length) return lines;
    try {
      fs.appendFileSync(path.join(process.cwd(), ".cache", "q02-reject.log"), "PARA-FIX " + bad.join("；") + "\n");
    } catch { /* ignore */ }
    fix = "上一稿不合格。" + bad.join("；");
  }
  return null;
}

function promptFor(spread: string, faces: CardFace[], paraphrases: string[], fix: string[]): string {
  const focus = focusOf(spread, faces.length);
  const picked = [faces[focus.pastI], faces[focus.nowI], faces[focus.foreI]];
  const roles = ["已经走过", "眼前已经在，信这一下", "还没发生，发生了才算"];
  const lines = picked.map((face, i) => {
    return [
      roles[i] + "：" + face.name + (face.upright ? "正位" : "逆位"),
      "画面原句，一个字不要改：" + face.picture,
      "意思用这句或更短的话，不要改成别的事：" + paraphrases[i],
    ].join("\n");
  });
  const hasDoor = faces.some((f) => f.name === "权杖四" && f.upright);
  const hasHouse = faces.some((f) => f.name === "星币十" && f.upright);
  const hasTen = faces.some((f) => f.name === "宝剑十" && f.upright);
  return [
    "问题：对方信号一会热一会冷，我该信哪头？",
    "把这三张写成一段人话，讲给对面的人听。",
    "只写 open 和 chain。",
    "open 只写一段。三句画面原句嵌进这段，不要改字。用因为、所以把三张连成一件事，意思揉在连接里，不要写成「画面。意思。因为画面。意思。所以画面。意思。」。这段里要有「信」和「还没」。" + (picked.some((face) => face.trust.indexOf("还是") !== -1) ? "有「还是」的两边都还没选完，不要写成已经迎上来或已经侧身。" : "这三张没有「还是」，open 里不要写「还是」。") + "意思里的「你」不要改成对方。不要用过去、现在、未来三个词一起当标签。不要写第几张。不要用那头、冷热、确定性、脚本、闭环、共识、校准、回响、丰足、刻度。不要把同一句说两遍。",
    "chain 另写一句，用「因为」开头，里面有「所以」。不许出现画面原句，不许把 open 里已经写过的整句再抄一遍。",
    "下面这几个字必须原样出现在 open 里：" + paraphrases.map(keepBit).join(" / "),
    hasDoor ? "这手里有权杖四正位，那扇门是开的，是给人走进去高兴的。" : "不要写庆祝的门。",
    hasHouse ? "这手里有星币十正位，那是真能过日子的家。" : "不要写能传下去的家。",
    hasTen ? "这手里有宝剑十正位，远处那点天亮不算重新开始。" : "不要写天亮。",
    "",
    fix.length ? "上一稿不合格，必须改掉：" + fix.join("；") : "",
    "",
    lines.join("\n\n"),
    "",
    '只输出 JSON：{"open":"","chain":""}',
  ].filter(Boolean).join("\n");
}

function cacheKey(spread: string, pageIds: string[]): string {
  return "v15|" + spread + "|" + pageIds.join(",");
}

function readCache(): Record<string, SpreadArticle> {
  try {
    return JSON.parse(fs.readFileSync(CACHE, "utf8"));
  } catch {
    return {};
  }
}

function writeCache(key: string, article: SpreadArticle) {
  const all = readCache();
  all[key] = article;
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  fs.writeFileSync(CACHE, JSON.stringify(all));
}

function meaningLine(face: CardFace): string {
  const sentences = face.trust.split("。").map((part) => part.trim()).filter(Boolean);
  const choice = sentences.find((part) => part.indexOf("还是") !== -1);
  if (choice) return choice + "。";
  const anchors = anchorsForSeat(face.trust);
  const hit = sentences.find((part) => anchors.some((anchor) => part.indexOf(anchor) !== -1));
  const line = hit || sentences[sentences.length - 1] || sentences[0] || "";
  return line ? line + "。" : "";
}

function seatLine(face: CardFace): string {
  const pic = face.picture.endsWith("。") ? face.picture : face.picture + "。";
  return pic + meaningLine(face);
}

function composeOpen(faces: CardFace[], focus: { pastI: number; nowI: number; foreI: number }): string {
  const past = faces[focus.pastI];
  const now = faces[focus.nowI];
  const fore = faces[focus.foreI];
  const pic = (face: CardFace) => (face.picture.endsWith("。") ? face.picture : face.picture + "。");
  return pic(past) + meaningLine(past) + "因为" + pic(now) + meaningLine(now) + "所以" + pic(fore) + meaningLine(fore);
}

function leadBit(face: CardFace): string {
  const line = meaningLine(face).replace(/。$/, "");
  const cut = line.split("，")[0];
  return cut || line;
}

function composeChain(faces: CardFace[], focus: { pastI: number; nowI: number; foreI: number }): string {
  const past = leadBit(faces[focus.pastI]);
  const now = leadBit(faces[focus.nowI]);
  const fore = leadBit(faces[focus.foreI]);
  return "因为" + past + "，所以现在" + now + "。后一张，" + fore + "。";
}

function actionText(spread: string, faces: CardFace[]): string {
  return actionIndexes(spread).map((i) => {
    const face = faces[i];
    if (!face) return "";
    if (spread === "choice") return (i === 2 ? "人在A。" : "人在B。") + face.action;
    return face.action;
  }).filter(Boolean).join("");
}

function sewForward(open: string, pics: string[]): string {
  let text = open;
  for (let guard = 0; guard < pics.length; guard++) {
    const hits = pics
      .map((pic) => ({ pic, at: text.indexOf(pic) }))
      .filter((hit) => hit.at !== -1)
      .sort((a, b) => a.at - b.at);
    let sewed = false;
    for (let n = hits.length - 1; n > 0; n--) {
      const between = text.slice(hits[n - 1].at + hits[n - 1].pic.length, hits[n].at);
      const rest = between.replace(/[。，、；：\s]/g, "");
      if (rest.length < 2) {
        text = text.slice(0, hits[n].at) + "再往前，" + text.slice(hits[n].at);
        sewed = true;
        break;
      }
    }
    if (!sewed) break;
  }
  return text;
}

function keepOpen(text: string): string {
  return text
    .replace(/没迎上来[^。]{0,12}侧身[^。，]{0,8}/g, "这一冲他还没接，也还没让开")
    .replace(/对方这一冲/g, "这一冲")
    .replace(/对方侧身让你过去/g, "这一冲他还没接，也还没让开");
}

function stripTrust(text: string, faces: CardFace[]): string {
  let out = text;
  for (let i = 0; i < faces.length; i++) {
    const parts = faces[i].trust.split(/[。，]/).map((part) => part.trim()).filter((part) => part.length >= 6);
    for (let n = 0; n < parts.length; n++) out = out.split(parts[n]).join("");
  }
  return out.replace(/[。]{2,}/g, "。").replace(/，。/g, "。").replace(/。，/g, "。").replace(/，{2,}/g, "，");
}

function ensurePictures(open: string, faces: CardFace[], focus: { pastI: number; nowI: number; foreI: number }): string {
  let text = open;
  const picked = [faces[focus.pastI], faces[focus.nowI], faces[focus.foreI]];
  for (let i = 0; i < picked.length; i++) {
    const face = picked[i];
    if (!face) continue;
    const bare = face.picture.replace(/。$/, "");
    if (text.indexOf(bare) === -1) text += (text.endsWith("。") ? "" : "。") + face.picture;
  }
  return text;
}

function restorePictures(open: string, faces: CardFace[], focus: { pastI: number; nowI: number; foreI: number }): string {
  let text = open;
  const picked = [faces[focus.pastI], faces[focus.nowI], faces[focus.foreI]];
  for (let i = 0; i < picked.length; i++) {
    const face = picked[i];
    if (!face) continue;
    const bare = face.picture.replace(/。$/, "");
    if (text.indexOf(bare) !== -1) continue;
    const tail = bare.split("，").slice(1).join("，");
    if (tail.length < 4 || text.indexOf(tail) === -1) continue;
    const at = text.indexOf(tail);
    let start = at;
    while (start > 0 && text.charAt(start - 1) !== "。") start--;
    text = text.slice(0, start) + bare + text.slice(at + tail.length);
  }
  return text;
}

function placeFixed(spread: string, faces: CardFace[], article: SpreadArticle): SpreadArticle {
  const focus = focusOf(spread, faces.length);
  const open = restorePictures(keepOpen(String(article.open || "")), faces, focus);
  const chain = keepOpen(String(article.chain || "")).trim();
  return {
    open,
    seats: faces.map(seatLine),
    chain,
    action: actionText(spread, faces),
  };
}
function period(text: string): string {
  const s = (text || "").trim();
  if (!s) return "";
  return s.endsWith("。") ? s : s + "。";
}

function nowVerdict(face: CardFace): string {
  const sentences = face.trust.split("。").map((part) => part.trim()).filter(Boolean);
  const said = sentences.find((part) => part.indexOf("信") !== -1 && part.indexOf("信不信") !== 0);
  const deny = sentences.find((part) => /不信|不算|不是/.test(part));
  const notYet = sentences.find((part) => part.indexOf("还没") !== -1);
  const line = (said || deny || notYet || meaningLine(face).replace(/。$/, "")).replace(/。$/, "");
  if (line.indexOf("还是") !== -1) return line + "。";
  if (line.indexOf("信") === 0 && line.indexOf("信不信") !== 0) return line + "。";
  return "信现在这一张：" + line + "。";
}

function timeArticle(spread: string, faces: CardFace[]): SpreadArticle {
  const focus = focusOf(spread, faces.length);
  const block = (face: CardFace, future: boolean) => period(face.picture) + period(face.trust) + (future ? "这一下还没发生。" : "");
  const now = faces[focus.nowI];
  const verdict = nowVerdict(now);
  return {
    open: block(faces[focus.pastI], false) + block(now, false) + block(faces[focus.foreI], true) + verdict,
    seats: faces.map(seatLine),
    chain: verdict + "这一下还没发生。",
    action: actionText(spread, faces),
  };
}

export async function generateQ02Spread(spread: string, pageIds: string[]): Promise<{ article: SpreadArticle; cached: boolean } | { fallback: true }> {
  const faces = facesFor(spread, pageIds);
  if (!faces) return { fallback: true };
  const key = cacheKey(spread, pageIds);
  const hit = readCache()[key];
  if (hit && hit.chain && hit.open.indexOf("因为") === -1) return { article: hit, cached: true };
  const article = timeArticle(spread, faces);
  writeCache(key, article);
  return { article, cached: false };
}
