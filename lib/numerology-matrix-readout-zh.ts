function foldTo1to9(n: number): number {
  let x = Math.abs(Math.floor(n));
  while (x > 9) {
    x = `${x}`.split("").reduce((s, ch) => s + Number(ch), 0);
  }
  return x || 1;
}

/** 与矩阵页同源：主路径、生日数、个人年与姓名三数化约至 1–9 后去重排序，即各亮格之「格数」。 */
export type NumerologyMatrixLitRootsInput = {
  lifePath: number;
  birthdayNum: number;
  personalYearNum: number;
  expression: number | null;
  soulUrge: number | null;
  personality: number | null;
};

export function numerologyMatrixLitRootsZh(input: NumerologyMatrixLitRootsInput): number[] {
  const s = new Set<number>();
  for (const n of [
    input.lifePath,
    input.birthdayNum,
    input.personalYearNum,
    input.expression,
    input.soulUrge,
    input.personality,
  ]) {
    if (typeof n === "number") s.add(foldTo1to9(n));
  }
  return [...s].sort((a, b) => a - b);
}

/** 与之门场域 key 对齐；大师向：沉稳、指点、有分寸（忌轻浮套话） */
function matrixClusterHintWarmZh(themeKey: string): string {
  switch (themeKey) {
    case "master":
      return "节律一拉高，人最易自役不休；先睡稳两晚，再谈加码，不是躲懒，是把局走长。";
    case "moon":
      return "财、果、心里那口气不必同一夜谈完；分三次落款，比一场会掏光更清楚，也更不伤关系。";
    case "mist":
      return "协同前先各写要与不要各三条，再开口；忍要忍在纸面上有回条，才不算把内伤当修养。";
    case "cerulean":
      return "先锁每日一段能交付的时辰，再谈曝光与社交；顺序反了，热闹止于回声，落不进可交付里。";
    case "jade":
    default:
      return "动结构前先落字留痕；大改写清收刀与认账，写到一半有人认账，比事后救火更省底气。";
  }
}

/** 能量矩阵 · 顶栏：先算法与同源，再分寸，末收束 */
export function numerologyMatrixIntroBodyZh(): string {
  return [
    "这一页只做收束：取你在「寰宇之门」已填之主路径、生日数、个人年，及（拉丁姓名齐备时）姓名三数，化约至 1–9，于九宫格中高亮——让你一眼看齐：哪些数在你命盘里反复作响。",
    "灰格非缺席，只是此番未著色于 1–9 这一层；亮格如镜上一点光，示何处常响，非替你定罪。姓名三数须拉丁全拼齐备方并入；未齐者先看生辰三线，无过。",
    "遇 11、22、33，先收成 2、4、6 再入九宫，与之门、炼金工具同源同法。数以本页与之门演算为真：先对齐，再顺读；长文不必一夜吞尽。",
  ].join("\n\n");
}

function densityRemarkWarmZh(distinctRootCount: number): string {
  if (distinctRootCount <= 0) return "请先在寰宇之门落稳公历生辰。空盘不谈格，有数方有光可照。";
  if (distinctRootCount <= 2) {
    return "亮格稀少，多是数条声线争一把嗓子。先令主路径一句落地，其余作旁白徐徐接，勿一口说尽自己。";
  }
  if (distinctRootCount >= 6) {
    return "亮格铺散，未必即乱：桌大、菜多，亦可能是岁序本繁。先端稳主路径与个人年，其余分次读，脉络反清。";
  }
  return "有亮有灰，最为常见。先看亮格定心，再回之门顺读长文；格数是收束，不是代你落笔定案。";
}

function nameLinePresentZh(ex: number | null, su: number | null, pe: number | null): boolean {
  return ex != null || su != null || pe != null;
}

export type NumerologyMatrixInsightInput = {
  rootDigits: number[];
  themeLabel: string;
  themeKey: string;
  lifePath: number;
  birthdayNum: number;
  personalYearNum: number;
  expression: number | null;
  soulUrge: number | null;
  personality: number | null;
};

/** 能量矩阵 · 伴读：先对齐读数，再叠大师分寸（与塔罗 pre 大师向同旨：沉稳、指点、有分寸） */
export function numerologyMatrixInsightBodyZh(p: NumerologyMatrixInsightInput): string {
  const sorted = [...p.rootDigits].sort((a, b) => a - b);
  const list = sorted.length ? sorted.join("、") : "—";
  const rLp = foldTo1to9(p.lifePath);
  const rBd = foldTo1to9(p.birthdayNum);
  const rPy = foldTo1to9(p.personalYearNum);
  const nameIn = nameLinePresentZh(p.expression, p.soulUrge, p.personality);
  const tail = nameIn
    ? "姓名三数已并入格中；若问像谁、心里要什么，仍须回之门第一段细听人话。"
    : "姓名须拉丁全拼齐备方入格；未齐时且先看生辰三线，补全再对，为时未晚。";
  const cluster = matrixClusterHintWarmZh(p.themeKey);
  return [
    `亮格在此：${list}。三条常响之声线，先替你压齐：主路径 ${p.lifePath} 化约 ${rLp}；生日数 ${p.birthdayNum} 化约 ${rBd}；个人年 ${p.personalYearNum} 化约 ${rPy}。${tail}`,
    densityRemarkWarmZh(sorted.length),
    "若与之门顶栏「关键读数」五格参差，先核公历生辰与拉丁拼写；镜鉴长文、戒线行法仍以之门为纲——此页惟九宫收束，替你省一眼力，不叫你在格里硬编故事。",
    `场域色气偏「${p.themeLabel}」——非贴签，乃提醒：${cluster}`,
    "下方「格数手册」自单格叠至多格，条数随亮格而长，穷举使然。念到哪段算哪段，落笔仍在东家。",
  ].join("\n\n");
}
