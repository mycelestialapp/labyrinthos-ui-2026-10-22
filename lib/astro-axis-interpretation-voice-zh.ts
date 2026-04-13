/**
 * 轴线解读：声部成稿层。
 * - 常规：首句（盘型×声部）、第二段四轴坐标行（声部模板+坐标填空）。
 * - 专业：首行锚点（声部模板+坐标）、第二句判读顺序（声部）。
 * 与 `astro-axis-interpretation-body-voice-zh` 拼接后即为定稿。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

/** 声部 1 或未命中时使用；与 axis-interpretation-zh 原句一致。 */
export function axisRegularOpeningBaseZh(kind: ChartKindId): string {
  switch (kind) {
    case "natal":
      return "这里不是在算运气，更像在描述你长期结构里的气压与阻力。";
    case "synastry":
      return "这里先钉住案主出生盘上的轴线；双人怎么咬合，要再对照合盘数据。";
    case "transit":
      return "这里抓的是当下天象盘里的轴线气氛，用来对照本命，不是另起一张终身定调。";
    case "ephemeris":
      return "这里抓的是指定时刻的天空切片；看的是现场结构，不接终身结论。";
    case "secondary":
      return "这张次限推进盘看年尺度走向；轴线描述的是这一推进时刻下的接口与压力。";
    case "tertiary":
      return "这张三限推进盘看月尺度节律；轴线帮你对齐近期身心接口。";
    case "solar_return":
      return "日返盘以太阳回归瞬间立轴；轴线框定的是这一年度主题的大门口。";
    case "lunar_return":
      return "月返盘以月亮回归瞬间立轴；轴线更贴近这一小段情绪与起居接口。";
    default: {
      const _e: never = kind;
      return _e;
    }
  }
}

/** 常规解读首句：声部 2–10 × 八种盘 */
const AXIS_REGULAR_OPENING_VOICE_PATCH: Partial<
  Record<VoiceStyleIdZh, Partial<Record<ChartKindId, string>>>
> = {
  2: {
    natal: "不说运气签文，更像帮你把长期结构里的松紧、阻力摸清楚。",
    synastry: "先把案主盘上的轴线说稳；俩人怎么磨合，合盘里再细聊。",
    transit: "抓的是此刻天象盘里的轴线味道，用来对照本命，不当终身判决书。",
    ephemeris: "抓的是那一刻的天空切片；只看现场结构，不接一生定性。",
    secondary: "次限看几年大走向；轴线说的是这一推进当口的接口和压力。",
    tertiary: "三限看近几周节拍；轴线帮你对齐身心怎么接招。",
    solar_return: "日返在太阳回归瞬间立轴；轴线像这一年主题的大门口。",
    lunar_return: "月返在月亮回归瞬间立轴；轴线贴近这一小段心情和家里事。",
  },
  3: {
    natal: "输出类型：长期结构中的气压与阻力素描；非运势断言。",
    synastry: "主锚：案主轴线；双人机制：合盘数据域。",
    transit: "观测域：当下天象盘轴线；参照系：本命。禁止终身定调。",
    ephemeris: "观测域：指定时刻轴线切片；禁止外推终身人格。",
    secondary: "观测域：次限年尺度轴线；接口与压力以推进时刻为准。",
    tertiary: "观测域：三限月尺度轴线；近端身心接口对齐。",
    solar_return: "观测域：日返回归瞬轴线；年度主题大门口。",
    lunar_return: "观测域：月返回归瞬轴线；短窗情绪与起居接口。",
  },
  4: {
    natal: "像在翻一本关于你的气候图：哪里常闷、哪里常顺，不讲吉凶签。",
    synastry: "开场先把案主这条故事线的门轴钉住；双人戏码在合盘里演。",
    transit: "这一幕的天象轴线是外景灯光；本命是你身上的老布景。",
    ephemeris: "这一帧的天空怎么搭景；不接整部人生电影结局。",
    secondary: "几年一季的轴线迁移；门口朝哪开、压力从哪来。",
    tertiary: "近几集的轴线剪辑；身心接口怎么接。",
    solar_return: "年度片头那一声「立轴」；主题大门往哪开。",
    lunar_return: "小段蒙太奇的轴线提示；心情与起居接口。",
  },
  5: {
    natal: "任务：描述长期结构松紧；排除项：单日运势。",
    synastry: "任务：案主轴线定位；双人任务→合盘。",
    transit: "任务：此刻天象轴线；本命对照；排除终身定性。",
    ephemeris: "任务：时刻轴线切片；排除终身标签。",
    secondary: "任务：次限轴线（年）；接口/压力。",
    tertiary: "任务：三限轴线（短窗）；身心接口。",
    solar_return: "任务：日返轴线；年度大门口。",
    lunar_return: "任务：月返轴线；短窗接口。",
  },
  6: {
    natal: "解释域：终身结构中的压力与支撑分布；非预测型断言。",
    synastry: "锚点：案主四轴几何；扩展模型：合盘交互。",
    transit: "样本：行运盘轴线状态；参照：本命结构；禁混层级。",
    ephemeris: "样本：时刻盘轴线；禁升格终身模型。",
    secondary: "样本：次限推进轴线；年尺度接口/压力。",
    tertiary: "样本：三限推进轴线；短周期接口。",
    solar_return: "样本：日返回归轴线；年度主题接口。",
    lunar_return: "样本：月返回归轴线；短窗起居—情绪接口。",
  },
  7: {
    natal: "咱不聊中不中奖，就聊聊你心里那块长期顶着的风向。",
    synastry: "先把案主门上那把锁讲清楚；俩人咋钥匙配对，合盘里再说。",
    transit: "先看外面这天象盘的轴线味儿，再回头对本命，别急着重写一辈子。",
    ephemeris: "就看这一刻天上怎么摆；别一口气讲到八十岁。",
    secondary: "几年里大轴线怎么挪；门口顺不顺脚。",
    tertiary: "近几周轴线紧不紧；人怎么接活、怎么歇。",
    solar_return: "这一年主题的大门口朝哪；太阳的老故事还在本命那本。",
    lunar_return: "这一小段月亮管的起居心情；长线还在本命月亮那页。",
  },
  8: {
    natal: "本段描述长期结构中的压力与支撑特征；不作单日运势判定。",
    synastry: "本段锚定案主轴线；双人命题请参阅合盘材料。",
    transit: "本段描述当下天象盘轴线，用于对照本命；不作终身定性。",
    ephemeris: "本段描述指定时刻轴线结构；不作终身人格结论。",
    secondary: "本段描述次限推进时刻之轴线接口与压力（年尺度）。",
    tertiary: "本段描述三限推进时刻之轴线接口（短窗尺度）。",
    solar_return: "本段描述太阳回归当刻之年度主题轴线。",
    lunar_return: "本段描述月亮回归当刻之短窗起居与情绪轴线。",
  },
  9: {
    natal: "【常规稿】轴线导语：终身结构气压/阻力；非签文体。",
    synastry: "【常规稿】案主轴线导语；双人稿→合盘栏。",
    transit: "【常规稿】行运盘轴线导语；本命对照栏。",
    ephemeris: "【常规稿】时刻轴线导语；终身稿→出生盘栏。",
    secondary: "【常规稿】次限轴线导语（年尺度）。",
    tertiary: "【常规稿】三限轴线导语（短窗）。",
    solar_return: "【常规稿】日返轴线导语（年度）。",
    lunar_return: "【常规稿】月返轴线导语（短窗）。",
  },
  10: {
    natal: "长期结构：气压/阻力。非日运。",
    synastry: "案主轴。双人→合盘。",
    transit: "行运轴。对本命。非终身。",
    ephemeris: "时刻轴。非终身。",
    secondary: "次限轴。年。",
    tertiary: "三限轴。短窗。",
    solar_return: "日返轴。年门。",
    lunar_return: "月返轴。短窗。",
  },
};

/** 专业版首行：含占位 {asc}{mc}{dsc}{ic}（已为格式化星座句） */
const AXIS_PROFESSIONAL_FIRST_LINE_BY_VOICE: Partial<Record<VoiceStyleIdZh, string>> = {
  2: "轴线锚点（温润）：ASC {asc} / MC {mc} / DSC {dsc} / IC {ic}。",
  3: "判读输出·轴线锚点：ASC {asc} / MC {mc} / DSC {dsc} / IC {ic}。",
  4: "先把四轴钉在台上：ASC {asc} / MC {mc} / DSC {dsc} / IC {ic}。",
  5: "四轴锚点：ASC {asc} / MC {mc} / DSC {dsc} / IC {ic}。",
  6: "轴线锚点（观测）：ASC {asc} / MC {mc} / DSC {dsc} / IC {ic}。",
  7: "四轴先给你摆出来：ASC {asc} / MC {mc} / DSC {dsc} / IC {ic}。",
  8: "轴线锚点：ASC {asc} / MC {mc} / DSC {dsc} / IC {ic}。",
  9: "【专业栏】轴线锚点：ASC {asc} / MC {mc} / DSC {dsc} / IC {ic}。",
  10: "锚：ASC {asc} / MC {mc} / DSC {dsc} / IC {ic}。",
};

export function axisRegularOpeningForVoice(kind: ChartKindId, voiceStyleId: VoiceStyleIdZh): string {
  const p = AXIS_REGULAR_OPENING_VOICE_PATCH[voiceStyleId]?.[kind];
  return p ?? axisRegularOpeningBaseZh(kind);
}

export function axisProfessionalFirstLineForVoice(
  voiceStyleId: VoiceStyleIdZh,
  coords: { asc: string; mc: string; dsc: string; ic: string },
): string {
  const tmpl =
    AXIS_PROFESSIONAL_FIRST_LINE_BY_VOICE[voiceStyleId] ??
    "轴线锚点：ASC {asc} / MC {mc} / DSC {dsc} / IC {ic}。";
  return tmpl
    .replaceAll("{asc}", coords.asc)
    .replaceAll("{mc}", coords.mc)
    .replaceAll("{dsc}", coords.dsc)
    .replaceAll("{ic}", coords.ic);
}

function fillAxisCoords(
  tmpl: string,
  c: { asc: string; mc: string; dsc: string; ic: string },
): string {
  return tmpl
    .replaceAll("{asc}", c.asc)
    .replaceAll("{mc}", c.mc)
    .replaceAll("{dsc}", c.dsc)
    .replaceAll("{ic}", c.ic);
}

/** 常规解读第二段：四轴坐标 + 导读（中文上升/天顶，与原文一致） */
const AXIS_REGULAR_AXES_BRIDGE_BY_VOICE: Partial<Record<VoiceStyleIdZh, string>> = {
  2: "四轴先帮你摆好：上升 {asc}、天顶 {mc}、下降 {dsc}、天底 {ic}。怎么出场、怎么被看见、关系怎么接、回家怎么回血，先看这四条线。",
  3: "坐标行：上升 {asc}、天顶 {mc}、下降 {dsc}、天底 {ic}。阅读优先级：出场—社会标签—关系接口—私密回血。",
  4: "舞台四角亮灯：上升 {asc}、天顶 {mc}、下降 {dsc}、天底 {ic}。出场、名片、关系、回家四条叙事线先对齐。",
  5: "四轴：升{asc} 顶{mc} 降{dsc} 底{ic}。出场/标签/关系/回血。",
  6: "四轴观测行：上升 {asc}、天顶 {mc}、下降 {dsc}、天底 {ic}。接口序列：呈现—公众—关系—私密。",
  7: "四条线先给你捋直：上升 {asc}、天顶 {mc}、下降 {dsc}、天底 {ic}。出门啥样、外面咋看你、关系咋接、回家咋歇，都从这里起。",
  8: "四轴陈述：上升 {asc}、天顶 {mc}、下降 {dsc}、天底 {ic}。建议依次检视呈现方式、社会角色、关系接口与私密恢复。",
  9: "【坐标栏】上升 {asc}、天顶 {mc}、下降 {dsc}、天底 {ic}。导读：出场—标签—关系—回血。",
  10: "四轴：{asc}/{mc}/{dsc}/{ic}。出场·标签·关系·回血。",
};

const AXIS_REGULAR_AXES_BRIDGE_DEFAULT =
  "四轴先给你定场：上升 {asc}、天顶 {mc}、下降 {dsc}、天底 {ic}。你怎么登场、外面怎么看你、关系怎么接、回家怎么回血，都先看这四条线。";

export function axisRegularAxesBridgeForVoice(
  voiceStyleId: VoiceStyleIdZh,
  coords: { asc: string; mc: string; dsc: string; ic: string },
): string {
  const tmpl = AXIS_REGULAR_AXES_BRIDGE_BY_VOICE[voiceStyleId] ?? AXIS_REGULAR_AXES_BRIDGE_DEFAULT;
  return fillAxisCoords(tmpl, coords);
}

/** 专业版第二句：判读顺序 */
const AXIS_PROFESSIONAL_READ_ORDER_BY_VOICE: Partial<Record<VoiceStyleIdZh, string>> = {
  2: "读法建议：角点先行——先看 ASC-MC 与日月主轴，再接 1/7、4/10 对位。",
  3: "执行顺序：角点优先｜ASC-MC + 日月主轴 → 1/7、4/10 轴对。",
  4: "叙事顺序：先把 ASC-MC 和日月主轴读实，再翻 1/7、4/10 的对台戏。",
  5: "顺序：ASC-MC · 日月主轴 · 1/7 · 4/10 对位。",
  6: "判读序列：角点优先；ASC-MC 与日月主轴先行，其次 1/7、4/10 对位。",
  7: "顺着读：先 ASC-MC 和日月主轴，再看 1/7、4/10 怎么唱对台。",
  8: "建议判读顺序：角点优先；先 ASC-MC 与日月主轴，再检视 1/7、4/10 对位。",
  9: "【专业栏】判读顺序：角点优先｜ASC-MC、日月主轴 → 1/7、4/10 对位。",
  10: "顺序：角点→日月轴→1/7→4/10。",
};

export function axisProfessionalReadOrderForVoice(voiceStyleId: VoiceStyleIdZh): string {
  return (
    AXIS_PROFESSIONAL_READ_ORDER_BY_VOICE[voiceStyleId] ??
    "判读顺序保持角点优先：先看 ASC-MC 与日月主轴，再看 1/7、4/10 对位。"
  );
}
