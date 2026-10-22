export type LenormandTemplateSpreadKind = "TRIAD" | "CROSS" | "SQUARE" | "GRAND_TABLEAU";

export type LenormandTemplateInput = {
  spreadType: LenormandTemplateSpreadKind;
  opening: string;
  spreadRole: string;
  motherTopicLine: string | null;
  positionLines: string[];
  cardPolarityLines: string[];
  synthesis: string;
  polarity: string;
  focus: string;
  boundary: string;
};

function spreadTone(kind: LenormandTemplateSpreadKind): string {
  if (kind === "TRIAD") return "这次三位结构强调“先看起因，再看卡点，最后看走向”。";
  if (kind === "CROSS") return "这次五位结构强调“矛盾与资源并看”，不只盯单点结论。";
  if (kind === "SQUARE") return "这次九宫结构强调“中心主轴 + 周边拉扯”，要抓主次。";
  return "这次大展结构强调“全局与长期”，不适合做即时断言。";
}

export function buildLenormandReadingTemplateZh(input: LenormandTemplateInput): string {
  const intro = [
    `【开篇】${input.opening}`,
    `【牌阵职责】${input.spreadRole}`,
    `【判读基调】${spreadTone(input.spreadType)}`,
  ];
  if (input.motherTopicLine) {
    intro.push(`【母题对焦】${input.motherTopicLine}`);
  }

  return [
    ...intro,
    "【逐位解读】",
    ...input.positionLines,
    "【单牌正反面（按问题大类）】",
    ...input.cardPolarityLines,
    `【合局判断】${input.synthesis}`,
    `【当前正反权重】${input.polarity}`,
    `【贴题焦点】${input.focus}`,
    `【边界提醒】${input.boundary}`,
  ].join("\n");
}

