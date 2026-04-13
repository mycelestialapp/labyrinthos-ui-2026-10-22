/**
 * 轴线解读：中段与专业条目的声部成稿（占位符填空）。
 * {plate} {orb} {house} {mid} {aspect} {detail} {tag} {sign}
 */

import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

const DEF = {
  regSunYes:
    "太阳和火星{plate}贴得很近（{orb}°），又压在 {house} 宫附近，做事会有「非要看透才肯停」的劲。",
  regSunNo: "你做事有明显主轴，通常不是浅尝即止，而是会往深处追问。",
  regFricWrap:
    "当前拉扯主要在「心里怎么想」和「外面怎么做」之间：{mid}。别硬顶，先稳住身体和节奏。",
  regFricNo: "这阶段更适合先把节奏稳住，再推大动作。",
  regMinYes: "次要相位里最紧的一条是 {aspect}，小摩擦里常藏着可用的灵感。",
  regMinNo: "次要相位噪声不高，先把主线跑顺就够了。",
  proMoonYes: "主摩擦一：月亮四分天顶（orb {orb}°），情绪底层与社会投射不同步。",
  proMoonNo: "主摩擦一：未见月亮-天顶紧硬相位，以其他角点压力代替。",
  proSatYes: "主摩擦二：土星四分上升（orb {orb}°），自我呈现端承压，进入新场景需预热。",
  proSatNo: "主摩擦二：未见土星-上升紧硬相位，门槛压力相对可控。",
  proSmYes: "动力簇：太阳合火星（orb {orb}°）{houseClause}，执行端冲量高。",
  proSmNo: "动力簇：未见日火紧合，以主相位列表为准。",
  proMinYes: "微扰监控：{detail}列为次要噪声/灵感样本。",
  proMinNo: "微扰监控：次要相位无紧样本。",
  proMoonSign: "{tag}落 {sign}，情绪底色以该星座气质为主干。",
} as const;

type PatchRow = Partial<Record<keyof typeof DEF, string>>;

/** 声部 2–10 覆盖项；未写明的字段回退 DEF */
const PATCH: Record<Exclude<VoiceStyleIdZh, 1>, PatchRow> = {
  2: {
    regSunYes:
      "太阳和火星{plate}挨得近（{orb}°），又贴着 {house} 宫，做事容易「不搞明白就不撒手」。",
    regSunNo: "你做事有一根主心骨，往往不是浅尝一下就算，而是想往深处问到底。",
    regFricWrap: "心里和外面容易拧着的地方在这儿：{mid}。先别硬顶，把身体和节奏稳住再说。",
    regFricNo: "这段更适合先稳住节奏，再往外推大事。",
    regMinYes: "次要相位里掐得最紧的是 {aspect}，小磕碰里有时能抠出点子。",
    regMinNo: "次要相位不算吵，先把主线跑顺就够用。",
    proMoonYes: "主摩擦一｜月亮四分天顶（orb {orb}°）：情绪底层和社会投射容易不同步。",
    proMoonNo: "主摩擦一：未见月亮—天顶紧硬样本，改由其他角点压力解释。",
    proSatYes: "主摩擦二｜土星四分上升（orb {orb}°）：出场端承压，新场景先预热。",
    proSatNo: "主摩擦二：未见土星—上升紧硬样本，门槛压力相对可控。",
    proSmYes: "动力簇｜日火合（orb {orb}°）{houseClause}：执行端冲量偏高。",
    proSmNo: "动力簇：未见日火紧合，改以主相位列表为准。",
    proMinYes: "微扰监控：{detail}，当作次要噪声/灵感样本。",
    proMinNo: "微扰监控：暂无紧次要样本。",
    proMoonSign: "{tag}落在 {sign}；日常心情的底色，先按这颗月亮的星座气质读。",
  },
  3: {
    regSunYes:
      "观测：日火{plate}紧合（{orb}°）近 {house} 宫；行为特征：深度追问倾向。",
    regSunNo: "行为主轴：偏深度推进，非浅尝模式。",
    regFricWrap: "摩擦轴｜内感受↔外行动：{mid}。处置：降速、稳身。",
    regFricNo: "建议：先稳态节律，再放大动作幅度。",
    regMinYes: "次要紧样本：{aspect}；可提取微洞察。",
    regMinNo: "次要域噪声低；优先主线。",
    proMoonYes: "主摩擦一：月亮四分天顶（orb {orb}°）—情绪层与社会投射异步。",
    proMoonNo: "主摩擦一：无月—天顶紧硬；由他角点代填。",
    proSatYes: "主摩擦二：土星四分上升（orb {orb}°）—呈现端承压；场景切换需预热。",
    proSatNo: "主摩擦二：无土—上升紧硬；门槛可控。",
    proSmYes: "动力簇：日火合（orb {orb}°）{houseClause}；执行冲量高。",
    proSmNo: "动力簇：无日火紧合；以主表为准。",
    proMinYes: "微扰：{detail}。",
    proMinNo: "微扰：无紧样本。",
    proMoonSign: "月亮锚点｜{tag} {sign}；情绪主干参照该星座谱系。",
  },
  4: {
    regSunYes:
      "太阳和火星{plate}几乎叠在同一张脸上（{orb}°），又压在 {house} 宫，剧情里常有「不刨到底不罢休」。",
    regSunNo: "你这条故事线有主轴，很少停在表面，会往深处走。",
    regFricWrap: "内心戏和对外戏在这儿掐上了：{mid}。别硬扛，先把身体和节拍找回来。",
    regFricNo: "这幕更适合先稳住节拍，再推高潮。",
    regMinYes: "背景里最响的一条次要线是 {aspect}，细碎里藏着可用转折。",
    regMinNo: "次要线不算喧宾夺主，先把主线演顺。",
    proMoonYes: "主摩擦一（月亮四分天顶·orb {orb}°）：心底台词和外界聚光灯对不上拍。",
    proMoonNo: "主摩擦一：月亮—天顶紧硬缺席，改读其他角点压力。",
    proSatYes: "主摩擦二（土星四分上升·orb {orb}°）：出场带壳，新场次先暖机。",
    proSatNo: "主摩擦二：土星—上升紧硬缺席，门槛感尚可。",
    proSmYes: "动力簇（日火合·orb {orb}°）{houseClause}：推进油门偏大。",
    proSmNo: "动力簇：日火紧合缺席，看主相位表。",
    proMinYes: "微扰线：{detail}，可当配角灵感。",
    proMinNo: "微扰线：暂无紧镜头。",
    proMoonSign: "月亮落在 {sign}：{tag}把心底的底色定调。",
  },
  5: {
    regSunYes: "日火{plate}紧（{orb}°）·近{house}宫→深挖倾向。",
    regSunNo: "主轴：深度>浅尝。",
    regFricWrap: "拉扯：{mid}。→稳身。",
    regFricNo: "先稳再冲。",
    regMinYes: "次紧：{aspect}。",
    regMinNo: "次要静。",
    proMoonYes: "摩一：月□MC orb{orb}。",
    proMoonNo: "摩一：无。",
    proSatYes: "摩二：土□ASC orb{orb}。",
    proSatNo: "摩二：无。",
    proSmYes: "动力：日火合 orb{orb}{houseClause}。",
    proSmNo: "动力：无日火合。",
    proMinYes: "微：{detail}。",
    proMinNo: "微：无。",
    proMoonSign: "月底:{tag}{sign}。",
  },
  6: {
    regSunYes:
      "样本：日火{plate}合（{orb}°），场域贴近 {house} 宫；推论：高坚持/深挖执行偏好。",
    regSunNo: "推论：存在显著主轴行为，倾向深度加工而非浅尝。",
    regFricWrap: "张力域（内感受—外行动）：{mid}。处置建议：避免硬顶，稳定生理节律。",
    regFricNo: "策略：优先稳态，再扩展行动半径。",
    regMinYes: "次要域最紧样本：{aspect}；可作微扰—灵感联合读。",
    regMinNo: "次要域信噪比偏低；主线优先。",
    proMoonYes: "主摩擦一：月亮四分天顶（orb {orb}°）—情绪基底与社会投射失配。",
    proMoonNo: "主摩擦一：月亮—天顶紧硬未观测；由替代角点机制解释。",
    proSatYes: "主摩擦二：土星四分上升（orb {orb}°）—自我呈现端载荷；场景迁移需预热。",
    proSatNo: "主摩擦二：土星—上升紧硬未观测；门槛压力温和。",
    proSmYes: "动力簇：太阳合火星（orb {orb}°）{houseClause}—执行冲量升高。",
    proSmNo: "动力簇：日火紧合未观测；参照主相位枚举。",
    proMinYes: "微扰监控项：{detail}。",
    proMinNo: "微扰监控：无显著紧样本。",
    proMoonSign: "情绪基底：{tag}落于 {sign}；主干气质以该星座为参照。",
  },
  7: {
    regSunYes:
      "太阳和火星{plate}黏得紧（{orb}°），还挨着 {house} 宫，你做事常有股「不搞清不罢休」的倔劲。",
    regSunNo: "你心里有根主心骨，不太停在表面，会往深里刨。",
    regFricWrap: "心里想的和外面要的在这儿打架：{mid}。别死扛，先把人稳住、喘口气。",
    regFricNo: "这阵子先别急着冲，把节奏踩实了再说。",
    regMinYes: "次要相位里蹦得最响的是 {aspect}，小别扭里有时能抠出好点子。",
    regMinNo: "次要线不算吵，主线先理顺就挺好。",
    proMoonYes: "主摩擦一：月亮四分天顶（orb {orb}°）—心里底色和外面给你的标签容易对不上。",
    proMoonNo: "主摩擦一：没瞅见月亮—天顶死磕，换别的角点顶着呢。",
    proSatYes: "主摩擦二：土星四分上升（orb {orb}°）—出门像背壳，新场合先暖暖场。",
    proSatNo: "主摩擦二：土星—上升没掐紧，门槛还算过得去。",
    proSmYes: "动力这块：日火合（orb {orb}°）{houseClause}，油门偏大。",
    proSmNo: "动力：没瞅见日火紧挨，看主相位表。",
    proMinYes: "微扰盯着：{detail}。",
    proMinNo: "微扰：没啥紧的。",
    proMoonSign: "月亮在 {sign}，{tag}这条一出来，你心里那点惯常感受就有个抓手。",
  },
  8: {
    regSunYes:
      "太阳与火星{plate}呈紧合（{orb}°），且靠近 {house} 宫；常见表现为坚持深度澄清与追问。",
    regSunNo: "行为层面可见稳定主轴，倾向深度推进而非浅尝。",
    regFricWrap: "内在感受与外在行动之间存在张力：{mid}。建议避免硬顶，优先稳定身心节律。",
    regFricNo: "现阶段宜先稳定节奏，再推进重大动作。",
    regMinYes: "次要相位中最紧样本为 {aspect}；可作补充性解读。",
    regMinNo: "次要相位噪声较低，建议优先处理主线。",
    proMoonYes: "主摩擦一：月亮四分天顶（orb {orb}°），情绪底层与社会投射可能不同步。",
    proMoonNo: "主摩擦一：未见月亮—天顶紧硬相位，由其他角点机制替代说明。",
    proSatYes: "主摩擦二：土星四分上升（orb {orb}°），自我呈现端承压，新场景宜预留预热。",
    proSatNo: "主摩擦二：未见土星—上升紧硬相位，门槛压力相对可控。",
    proSmYes: "动力簇：太阳合火星（orb {orb}°）{houseClause}，执行端冲量偏高。",
    proSmNo: "动力簇：未见日火紧合，请以主相位列表为准。",
    proMinYes: "微扰监控：{detail}。",
    proMinNo: "微扰监控：未见紧样本。",
    proMoonSign: "月亮位置：{tag} {sign}；情绪底色建议以该星座气质为主干参照。",
  },
  9: {
    regSunYes: "【情节线】日火{plate}紧合（{orb}°）·{house}宫旁；母题：深挖。",
    regSunNo: "【情节线】主轴偏深，不停留在表层。",
    regFricWrap: "【冲突】内—外：{mid}。导演笔记：勿硬顶，稳节奏。",
    regFricNo: "【导演笔记】先稳拍，再推戏。",
    regMinYes: "【配角线】最响次要：{aspect}。",
    regMinNo: "【配角线】安静。",
    proMoonYes: "【主摩擦一】月□MC orb{orb}。",
    proMoonNo: "【主摩擦一】缺席。",
    proSatYes: "【主摩擦二】土□ASC orb{orb}。",
    proSatNo: "【主摩擦二】缺席。",
    proSmYes: "【动力】日火合 orb{orb}{houseClause}。",
    proSmNo: "【动力】日火合缺席。",
    proMinYes: "【微扰】{detail}。",
    proMinNo: "【微扰】无。",
    proMoonSign: "【月亮栏】{tag}·{sign}；底色取星座气质。",
  },
  10: {
    regSunYes: "日火{plate}合{orb}°·{house}宫→深挖。",
    regSunNo: "主轴：深。",
    regFricWrap: "拉扯:{mid}。稳。",
    regFricNo: "先稳。",
    regMinYes: "次紧:{aspect}。",
    regMinNo: "次静。",
    proMoonYes: "摩一:月□MC {orb}。",
    proMoonNo: "摩一:无。",
    proSatYes: "摩二:土□ASC {orb}。",
    proSatNo: "摩二:无。",
    proSmYes: "动:日火{orb}{houseClause}。",
    proSmNo: "动:无日火。",
    proMinYes: "微:{detail}。",
    proMinNo: "微:无。",
    proMoonSign: "月:{tag}{sign}底色。",
  },
};

function pick<K extends keyof typeof DEF>(voice: VoiceStyleIdZh, key: K): string {
  const def = DEF[key];
  if (voice === 1) return def;
  const hit = PATCH[voice as Exclude<VoiceStyleIdZh, 1>]?.[key];
  return hit ?? def;
}

export function axisRegularSunMarsLineVocal(
  voiceStyleId: VoiceStyleIdZh,
  platePhrase: string,
  orbDegFixed2: string,
  house: number,
): string {
  const tmpl = pick(voiceStyleId, "regSunYes");
  return tmpl
    .replaceAll("{plate}", platePhrase)
    .replaceAll("{orb}", orbDegFixed2)
    .replaceAll("{house}", String(house));
}

export function axisRegularNoSunMarsVocal(voiceStyleId: VoiceStyleIdZh): string {
  return pick(voiceStyleId, "regSunNo");
}

export function axisRegularFrictionWrapVocal(voiceStyleId: VoiceStyleIdZh, mid: string): string {
  return pick(voiceStyleId, "regFricWrap").replace("{mid}", mid);
}

export function axisRegularNoFrictionVocal(voiceStyleId: VoiceStyleIdZh): string {
  return pick(voiceStyleId, "regFricNo");
}

export function axisRegularTightMinorYesVocal(voiceStyleId: VoiceStyleIdZh, aspectPhrase: string): string {
  return pick(voiceStyleId, "regMinYes").replace("{aspect}", aspectPhrase);
}

export function axisRegularTightMinorNoVocal(voiceStyleId: VoiceStyleIdZh): string {
  return pick(voiceStyleId, "regMinNo");
}

export function axisProMoonMcYesVocal(voiceStyleId: VoiceStyleIdZh, orbDegFixed2: string): string {
  return pick(voiceStyleId, "proMoonYes").replaceAll("{orb}", orbDegFixed2);
}

export function axisProMoonMcNoVocal(voiceStyleId: VoiceStyleIdZh): string {
  return pick(voiceStyleId, "proMoonNo");
}

export function axisProSatAscYesVocal(voiceStyleId: VoiceStyleIdZh, orbDegFixed2: string): string {
  return pick(voiceStyleId, "proSatYes").replaceAll("{orb}", orbDegFixed2);
}

export function axisProSatAscNoVocal(voiceStyleId: VoiceStyleIdZh): string {
  return pick(voiceStyleId, "proSatNo");
}

export function axisProSunMarsYesVocal(
  voiceStyleId: VoiceStyleIdZh,
  orbDegFixed2: string,
  houseClause: string,
): string {
  return pick(voiceStyleId, "proSmYes")
    .replaceAll("{orb}", orbDegFixed2)
    .replaceAll("{houseClause}", houseClause);
}

export function axisProSunMarsNoVocal(voiceStyleId: VoiceStyleIdZh): string {
  return pick(voiceStyleId, "proSmNo");
}

export function axisProTightMinorYesVocal(voiceStyleId: VoiceStyleIdZh, detail: string): string {
  return pick(voiceStyleId, "proMinYes").replace("{detail}", detail);
}

export function axisProTightMinorNoVocal(voiceStyleId: VoiceStyleIdZh): string {
  return pick(voiceStyleId, "proMinNo");
}

export function axisProMoonEmotionalTailForVoice(
  voiceStyleId: VoiceStyleIdZh,
  tag: string,
  signZh: string,
): string {
  return pick(voiceStyleId, "proMoonSign").replaceAll("{tag}", tag).replaceAll("{sign}", signZh);
}
