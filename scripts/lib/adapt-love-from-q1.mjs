/**
 * 感情类：从大师成稿母版派生第四～二十八问时的字符串替换。
 * - q1：第一问「这段关系的本质是什么」（本质/走向/读心类题干）
 * - q2：第二问「我们之间最大的阻碍是什么」（卡点/挽回/分合抉择类）
 * - q3：第三问「这段关系想教会我什么」（成长/疗愈/模式/迎新类）
 */

export function esc(s) {
  return String(s).replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

export function cardOrder() {
  const out = [];
  for (let i = 0; i < 22; i++) {
    out.push([`major_${i}`, true], [`major_${i}`, false]);
  }
  for (const suit of ["wands", "cups", "swords", "pentacles"]) {
    for (let r = 1; r <= 14; r++) {
      out.push([`${suit}_${r}`, true], [`${suit}_${r}`, false]);
    }
  }
  return out;
}

/**
 * @param {string} raw
 * @param {{ display: string, essenceShort: string }} meta
 * @param {'q1' | 'q2' | 'q3'} [mother]
 */
export function adaptString(raw, meta, mother = "q1") {
  if (mother === "q2") return adaptStringFromQ2Mother(raw, meta);
  if (mother === "q3") return adaptStringFromQ3Mother(raw, meta);
  return adaptStringFromQ1Mother(raw, meta);
}

function adaptStringFromQ1Mother(raw, meta) {
  let s = raw;
  const d = meta.display;
  const e = meta.essenceShort;

  const pairs = [
    ["题面在问「这段关系的本质是什么」", `题面在问「${d}」`],
    ["那你现在为什么还在问「本质是什么」", `那你现在为什么还在问「${d}」`],
    ["你不必再问「本质是什么」，因为本质就是：", `你不必再问「${d}」，因为走到这一步，答案就是：`],
    [
      "你问「这段关系的本质是什么」，其实你真正想问的是：",
      `你问「${d}」，其实你真正想问的是：`,
    ],
    ["你问自己「这段关系的本质是什么」", `你问自己「${d}」`],
    ["你问「这段关系的本质是什么」", `你问「${d}」`],
    [
      "你一直在问这段关系的本质，但你真正想问的是——",
      `你一直在问「${d}」，但你真正想问的是——`,
    ],
    ["你来问这段关系的本质，但你想听的", `你来问「${d}」，但你想听的`],
  ];

  for (const [a, b] of pairs) {
    s = s.split(a).join(b);
  }

  s = s.split("这段关系的本质").join(e);
  return s;
}

/** 第二问母版：阻碍叙事 → 目标题干（大师收束与「阻碍」措辞一并落到本题） */
function adaptStringFromQ2Mother(raw, meta) {
  const d = meta.display;
  let s = raw;
  s = s.split("你问我们之间最大的阻碍是什么——").join(`你问「${d}」——`);
  s = s.split("你问我们之间最大的阻碍是什么").join(`你问「${d}」`);
  /**
   * 必须先处理含「你们之间最大的阻碍」的长串，再动「最大的阻碍，」，
   * 否则母版句会被切成「你们之间最卡的关口，往往…」，题面收束替换会失效。
   */
  s = s.split("「你们之间最大的阻碍，往往不是").join(`「${d}」这道题，关口往往不是`);
  s = s.split("「你们之间最大的阻碍，往往是").join(`「${d}」这道题，关口往往是`);
  s = s.split("「你们之间最大的阻碍，往往在").join(`「${d}」这道题，关口往往在`);
  s = s.split("你们之间最大的阻碍，往往是").join(`题面在问「${d}」；关口往往是`);
  s = s.split("你们之间最大的阻碍，往往在").join(`题面在问「${d}」；关口往往在`);
  s = s.split("你们之间最大的阻碍，与").join(`题面「${d}」与`);
  s = s.split("阻碍不是").join("症结不是");
  s = s.split("阻碍卡在").join("卡口卡在");
  s = s.split("阻碍与「").join("卡点与「");
  s = s.split("阻碍往往").join("卡口往往");
  s = s.split("最大的阻碍，是").join("最深的卡口，是");
  s = s.split("最大的阻碍，").join("最卡的关口，");
  s = s.split("阻碍是").join("卡口是");
  s = s.split("阻碍就松动").join("卡口就松动");
  s = s.split("阻碍就从").join("卡口就从");
  s = s.split("阻碍会自己浮出来").join("卡口会自己浮出来");
  s = s.split("阻碍会清晰").join("卡口会清晰");
  s = s.split("阻碍会现形").join("卡口会现形");
  s = s.split("阻碍有時就松了").join("卡口有時就松了");
  s = s.split("阻碍才守得住").join("卡口才守得住");
  s = s.split("阻碍才松动").join("卡口才松动");
  s = s.split("有些阻碍是").join("有些卡口是");
  s = s.split("有些阻碍只有").join("有些卡口只有");
  s = s.split("若阻碍是").join("若卡口是");
  s = s.split("可能阻碍流动").join("可能拖住流动");
  return s;
}

/** 第三问母版：教会/学分叙事 → 目标题干 */
function adaptStringFromQ3Mother(raw, meta) {
  const d = meta.display;
  let s = raw;
  s = s.split("你问这段关系想教会你什么——").join(`你问「${d}」——`);
  s = s.split("你问这段关系想教会你什么").join(`你问「${d}」`);
  s = s.split("这段关系教会你：").join(`题面在问「${d}」；收束一句：`);
  s = s.split("这段关系的学分").join("这一题的学分");
  s = s.split("这段关系要你学").join("这一程要你学");
  return s;
}

/**
 * @param {{ cardSpeaking: string, psychologyLayer: string, spiritLayer: string, actionPath: string, masterSummary: string }} row
 * @param {{ display: string, essenceShort: string, mother?: 'q1'|'q2'|'q3' }} meta
 */
export function adaptContent(row, meta) {
  const mother = meta.mother ?? "q1";
  return {
    cardSpeaking: adaptString(row.cardSpeaking, meta, mother),
    psychologyLayer: adaptString(row.psychologyLayer, meta, mother),
    spiritLayer: adaptString(row.spiritLayer, meta, mother),
    actionPath: adaptString(row.actionPath, meta, mother),
    masterSummary: adaptString(row.masterSummary, meta, mother),
  };
}

export function emitRegister(questionConst, cardId, upright, c) {
  return `register(感情婚姻, ${questionConst}, '${cardId}', ${upright}, {
  cardSpeaking: \`${esc(c.cardSpeaking)}\`,
  psychologyLayer: \`${esc(c.psychologyLayer)}\`,
  spiritLayer: \`${esc(c.spiritLayer)}\`,
  actionPath: \`${esc(c.actionPath)}\`,
  masterSummary: \`${esc(c.masterSummary)}\`,
});
`;
}
