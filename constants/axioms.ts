export type AxiomEntry = {
  scene: string;
  action: string;
  advice: string;
};

const SCENES = [
  "风大浪急",
  "火候到了",
  "井水混浊",
  "露水未干",
  "乌云压顶",
  "水面起皱",
  "潮水回落",
  "树影摇晃",
  "晚霞正浓",
  "山路回弯",
  "叶子发黄",
  "谷仓见底",
  "麦穗低头",
  "河面结霜",
  "晨雾未散",
  "土壤发硬",
  "雨脚渐密",
  "蚂蚁搬家",
  "炊烟笔直",
  "老树抽芽",
  "石缝冒水",
  "炉火偏旺",
  "池塘见底",
  "田埂湿滑",
  "天色将晚",
] as const;

const ACTIONS = [
  "收网回家",
  "立刻掀锅",
  "等它沉淀",
  "先慢半拍",
  "补上缺口",
  "守住边界",
  "小步快走",
  "今天收手",
  "先把门关",
  "把灯点亮",
  "把土压实",
  "换条小路",
  "先理旧账",
  "把话说清",
  "留一口气",
  "先做一件",
  "静观其变",
  "重排轻重",
  "先抬头看",
  "握紧主线",
] as const;

const SCENE_READINGS: Record<(typeof SCENES)[number], string> = {
  风大浪急: "局面翻涌，硬扛只会折损",
  火候到了: "窗口已经打开，拖延会错过",
  井水混浊: "越搅越乱，先稳住手",
  露水未干: "时机偏早，贸然下脚会打滑",
  乌云压顶: "情绪容易沉，先护住心气",
  水面起皱: "外界干扰多，判断易偏",
  潮水回落: "热闹散去，能看清真底",
  树影摇晃: "风向不定，先别站死位",
  晚霞正浓: "当下最亮，但转瞬即逝",
  山路回弯: "拐点已到，直冲会吃亏",
  叶子发黄: "该减负了，旧包袱要清",
  谷仓见底: "存量有限，必须精打细算",
  麦穗低头: "收成在前，别被虚名带偏",
  河面结霜: "表面平静，脚下更要谨慎",
  晨雾未散: "信息不全，先看再动",
  土壤发硬: "阻力变大，要换做法",
  雨脚渐密: "节奏会被打断，先稳阵脚",
  蚂蚁搬家: "细小信号在提醒你转向",
  炊烟笔直: "气流稳定，适合定下计划",
  老树抽芽: "新机冒头，动作宜轻快",
  石缝冒水: "缝隙里有机会，值得细看",
  炉火偏旺: "冲劲过头，容易焦糊",
  池塘见底: "真相浮出，别再自我遮掩",
  田埂湿滑: "路还在，但步子要小",
  天色将晚: "收官时段，重在归拢成果",
};

const ACTION_GUIDES: Record<(typeof ACTIONS)[number], string> = {
  收网回家: "先守住成果，别再冒险扩线",
  立刻掀锅: "看准时点，马上定案执行",
  等它沉淀: "先把手放下，等局面自行澄清",
  先慢半拍: "留出观察位，避免误判",
  补上缺口: "先补最短板，后面才走得稳",
  守住边界: "把范围写清，别让人随意越线",
  小步快走: "动作切小，连贯推进更有效",
  今天收手: "见好就收，把火力留到明天",
  先把门关: "先做隔离，再谈扩张",
  把灯点亮: "先把关键问题照明白",
  把土压实: "先夯基础，别急着盖楼",
  换条小路: "主路拥堵时，侧路更快到达",
  先理旧账: "先清旧欠，心里才有余地",
  把话说清: "先统一口径，减少内耗",
  留一口气: "别把力气一把用尽",
  先做一件: "聚焦一件最关键的小事",
  静观其变: "暂不表态，保留回旋空间",
  重排轻重: "先排优先级，再安排人手",
  先抬头看: "先看全局，再下局部判断",
  握紧主线: "别被枝节带偏，抓住主任务",
};

const OPENERS = [
  "今天这盘面，",
  "眼下这一步，",
  "你现在最要紧的，",
  "别急着抢答案，",
  "先把心放回身体里，",
] as const;

const CLOSERS = [
  "把这一点守住，今天就不算白过。",
  "你稳住节奏，结果自然会站到你这边。",
  "少做无效动作，就是今天最大的聪明。",
  "先做对，再做快，这是今天的胜法。",
  "把手里这一寸做好，后面三步都会顺。",
] as const;

const EMPHASIS = [
  "先稳后快",
  "先少后多",
  "先内后外",
  "先近后远",
  "先清后动",
] as const;

const TOP_CURATED_SCENES = [
  "风大浪急",
  "火候到了",
  "井水混浊",
  "山路回弯",
  "池塘见底",
  "天色将晚",
] as const;

const CURATED_SCENE_OPEN: Record<(typeof TOP_CURATED_SCENES)[number], string> = {
  风大浪急: "风再大，也别拿身体去顶浪。",
  火候到了: "锅里这口气已经到点，拖不得。",
  井水混浊: "水一浑，第一反应不是捞，是等。",
  山路回弯: "弯道里拼的不是胆子，是手稳。",
  池塘见底: "见底这一天，别再给自己留借口。",
  天色将晚: "天快黑时，最该做的是收拢。",
};

const CURATED_SCENE_RISK: Record<(typeof TOP_CURATED_SCENES)[number], string> = {
  风大浪急: "硬冲会先丢体力，再丢判断",
  火候到了: "多想一轮就会错过最亮的窗口",
  井水混浊: "越解释越脏，越着急越糊",
  山路回弯: "直线思维会把你带进沟里",
  池塘见底: "回避问题只会让成本翻倍",
  天色将晚: "再开新摊子，收尾就会失控",
};

const CURATED_ACTION_DRIVE: Record<(typeof ACTIONS)[number], string> = {
  收网回家: "先把已有成果拢住，不再外放",
  立刻掀锅: "看准就拍板，动作要快于犹豫",
  等它沉淀: "把手先收回来，让局势自己分层",
  先慢半拍: "刻意留半拍，换一个更准的落点",
  补上缺口: "先堵漏，再谈扩大盘面",
  守住边界: "把线画清楚，谁越线谁负责",
  小步快走: "动作切碎，连续推进",
  今天收手: "今天只守不攻，把风险关门外",
  先把门关: "先隔离变量，再做判断",
  把灯点亮: "先照明关键点，再谈情绪",
  把土压实: "先把地基夯实，后面才不返工",
  换条小路: "主路堵了就换小路，不死磕",
  先理旧账: "旧账清完，心里才有带宽",
  把话说清: "口径统一，动作才不会打架",
  留一口气: "留余力，才有第二手",
  先做一件: "锁定一件最关键的小事",
  静观其变: "不抢答，先看牌桌变化",
  重排轻重: "先排优先级，再开工",
  先抬头看: "先看全局，别埋头内耗",
  握紧主线: "抓住主任务，枝节一律延后",
};

type CuratedTone = "restrained" | "balanced" | "decisive";

const TONE_LABEL: Record<CuratedTone, string> = {
  restrained: "克制档",
  balanced: "平衡档",
  decisive: "重锤档",
};

const TONE_INSERT: Record<CuratedTone, string> = {
  restrained: "少说一句，少做一手",
  balanced: "稳住主线，再推一步",
  decisive: "当断则断，今天不拖",
};

function hash32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function randFactory(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 15), 1 | s);
    s ^= s + Math.imul(s ^ (s >>> 7), 61 | s);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

function adviceFor(scene: (typeof SCENES)[number], action: (typeof ACTIONS)[number], idx: number): string {
  const rand = randFactory(hash32(`${scene}-${action}-${idx}`));
  const opener = pick(OPENERS, rand);
  const closer = pick(CLOSERS, rand);
  const emphasis = pick(EMPHASIS, rand);
  const reading = SCENE_READINGS[scene];
  const guide = ACTION_GUIDES[action];

  const middleA = `${reading}。${guide}。`;
  const middleB = `你的局面是“${scene}”，对应手法就是“${action}”。${guide}。`;
  const middle = rand() > 0.5 ? middleA : middleB;
  return `${opener}${middle}记住四个字：${emphasis}。${closer}`;
}

function curatedAdviceFor(
  scene: (typeof TOP_CURATED_SCENES)[number],
  action: (typeof ACTIONS)[number],
  idx: number,
  tone: CuratedTone,
): string {
  const rand = randFactory(hash32(`curated-${scene}-${action}-${idx}-${tone}`));
  const closer = pick(CLOSERS, rand);
  const emphasis = pick(EMPHASIS, rand);
  const open = CURATED_SCENE_OPEN[scene];
  const risk = CURATED_SCENE_RISK[scene];
  const drive = CURATED_ACTION_DRIVE[action];
  return `${open}${risk}。今天就按「${action}」执行：${drive}。${TONE_INSERT[tone]}。记住四个字：${emphasis}。${closer}`;
}

/**
 * 500 组大师级文案库：
 * 25 个「象」x 20 个「定」固定为 500，
 * 每组 advice 由场景语义 + 动作策略 + 多句式自然语言生成，
 * 避免机械重复和流水线拼接感。
 */
export const AXIOM_VAULT_500: readonly AxiomEntry[] = Array.from(
  { length: SCENES.length * ACTIONS.length },
  (_, i) => {
    const scene = SCENES[Math.floor(i / ACTIONS.length)]!;
    const action = ACTIONS[i % ACTIONS.length]!;
    const advice = adviceFor(scene, action, i);
    return { scene, action, advice };
  },
);

const CURATED_TONES: readonly CuratedTone[] = ["restrained", "balanced", "decisive"];

const TOP_CURATED_120X3_MAP: ReadonlyMap<string, AxiomEntry> = new Map(
  Array.from({ length: TOP_CURATED_SCENES.length * ACTIONS.length }, (_, i) => {
    const scene = TOP_CURATED_SCENES[Math.floor(i / ACTIONS.length)]!;
    const action = ACTIONS[i % ACTIONS.length]!;
    return CURATED_TONES.map((tone) => {
      const advice = `【${TONE_LABEL[tone]}】${curatedAdviceFor(scene, action, i, tone)}`;
      return [`${scene}|${action}|${tone}`, { scene, action, advice }] as const;
    });
  }).flat(),
);

export function pickAxiomBySeed(seed: number): AxiomEntry {
  const idx = seed % AXIOM_VAULT_500.length;
  const base = AXIOM_VAULT_500[idx]!;
  const tone = CURATED_TONES[seed % CURATED_TONES.length]!;
  return TOP_CURATED_120X3_MAP.get(`${base.scene}|${base.action}|${tone}`) ?? base;
}
