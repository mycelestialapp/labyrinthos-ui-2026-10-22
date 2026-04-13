/**
 * 工作台「灵识解构」解码面 + 主流判读三句：声部成稿层。
 * - 解码面：声部 1 用 `WORKSPACE_DECODE_SURFACE_ZH` 基座；2–10 叠 `WORKSPACE_DECODE_MASTER_PATCH` + 四段副标题补丁。
 * - 主流判读：声部 1 用 `MAINSTREAM_INSIGHT_LINES_ZH` 基座填模板；2–10 叠 `MAINSTREAM_INSIGHT_MASTER_PATCH`。
 * - 全路径不再使用 `applyVoiceStyleZhText` / `applyVoiceStyleZhDeep`（已从 `astro-voice-style-zh` 移除）。
 */

import type { ChartKindId } from "@/lib/astro-chart-kinds";
import {
  MAINSTREAM_INSIGHT_LINES_ZH,
  WORKSPACE_DECODE_SURFACE_ZH,
  type MainstreamInsightLinesZh,
  type WorkspaceDecodeSurfaceZh,
} from "@/lib/astro-eight-chart-view-copy-zh";
import { deepMergePlain } from "@/lib/astro-copy-deep-merge";
import { WORKSPACE_DECODE_SUBTITLE_VOICE_PATCH } from "@/lib/astro-workspace-decode-subtitle-voice-patch-zh";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

type DecodePatch = Partial<WorkspaceDecodeSurfaceZh>;
type MainstreamPatch = Partial<MainstreamInsightLinesZh>;

function fillMainstreamTemplates(
  template: MainstreamInsightLinesZh,
  params: { chartLabel: string; topicLabel: string },
): MainstreamInsightLinesZh {
  const topic = params.topicLabel.trim() || "—";
  return {
    structureClosing: template.structureClosing,
    boundary: template.boundary.replaceAll("{chartLabel}", params.chartLabel).replaceAll("{topicLabel}", topic),
    action: template.action,
  };
}

const D = (readoutLayerBlurb: string, decodeDepthLead: string): DecodePatch => ({
  readoutLayerBlurb,
  decodeDepthLead,
});

/** 解码面：声部 2–10 × 八种盘；覆写导读两段；副标题四段见 `WORKSPACE_DECODE_SUBTITLE_VOICE_PATCH`。 */
const WORKSPACE_DECODE_MASTER_PATCH: Partial<
  Record<VoiceStyleIdZh, Partial<Record<ChartKindId, DecodePatch>>>
> = {
  2: {
    natal: D(
      "出生盘：表下已接五联分层；先对数表再读解释，语义路由只是帮你对齐口径。",
      "锚在生辰与出生地。这里谈长期结构，不当单日签文。",
    ),
    synastry: D(
      "合盘：主轮是案主本命，表下五联对齐案主侧；双人几何在「合盘」Tab，别用主轮一笔带过。",
      "主解读仍锚案主本命轮；关系机制要合盘数据与双方档案一起看。",
    ),
    transit: D(
      "行运：表下五联对应当前天象；行运×本命在专 Tab。另有行运实时块，别把窗口写成终身定调。",
      "锚在「此刻」相对本命。讲当下触发与窗口，不替代出生全文。",
    ),
    ephemeris: D(
      "时刻盘：表下五联对应该切片；服务现场决定，不接终身人格判决书。",
      "锚在选定时间地点。只谈这一刻可读的结构，不外推成长期定性。",
    ),
    secondary: D(
      "次限：表下五联对推进轮；看几年慢变，不当每日天气预报。",
      "锚在日—年映射。谈几年里的心里场域迁移，出生全文仍是底色。",
    ),
    tertiary: D(
      "三限：表下五联对推进轮；看近几周节拍，不当终身改名条。",
      "锚在日—月映射。谈短窗松紧，不替代出生全文。",
    ),
    solar_return: D(
      "日返：表下五联对太阳回归当刻；定年度主题，不当每日指令。",
      "锚在太阳回到本命黄经那一瞬间。谈这一公历年侧重，仍建议对照本命。",
    ),
    lunar_return: D(
      "月返：表下五联对月亮回归当刻；短周期起居与情绪，不当十年大运。",
      "锚在月亮回到本命黄经（相对此刻向后搜索）。谈这一小段日子，仍建议对照本命。",
    ),
  },
  3: {
    natal: D(
      "出生盘执行顺序：星盘数据表 → 表下五联 → 语义路由校准。跳步容易误读。",
      "生辰地锚死。本区输出长期基线；要日运去日历与今日参考，别混锚点。",
    ),
    synastry: D(
      "合盘：主轮只承载案主几何；双人相位、互落宫——合盘 Tab。主区负责案主侧校准。",
      "关系题拆两层：案主本命底色 + 合盘机制。缺对象数据就别硬断。",
    ),
    transit: D(
      "行运：先锁定「行运↔本命」与行运五联，再碰本命长文摘录；实时块单独看窗口。",
      "现在相对本命。表内是外境节奏；档案日月升仍是内在参照。",
    ),
    ephemeris: D(
      "时刻盘：一切结论前缀「这一刻」。长文是背景，不是同一张盘的判决。",
      "切片锚点唯一。读完先标注：哪句属于现场、哪句属于一生。",
    ),
    secondary: D(
      "次限：年尺度。把「今年主戏」和「今天琐事」分开命名，再读表下五联。",
      "推进龄映射年景。适合按季复盘，不适合用单日吉凶推翻判断。",
    ),
    tertiary: D(
      "三限：月尺度。用来排程与缓冲，不是用来重写你是谁。",
      "近几周松紧。大事尽量落在表上相对松的窗，并仍对照本命。",
    ),
    solar_return: D(
      "日返：年度海报。抓一两条主轴写进行事历，其余当背景噪音。",
      "公历年切片。年题与终身底色分开放，避免把年运当每日指令。",
    ),
    lunar_return: D(
      "月返：起居情绪短窗。月初排负载，月底做一页复盘即可。",
      "短窗调度。紧处少加码，松处再推进；别把几天写成一辈子。",
    ),
  },
  4: {
    natal: D(
      "你可以把出生盘想成「一辈子的底色说明书」：数表是目录，五联是逐章批注，路由帮你翻到当前议题。",
      "故事从生辰地开场。这里写的是长期人物弧，不是某一集的剧情反转。",
    ),
    synastry: D(
      "合盘叙事分两卷：主轮是案主篇；两人对手戏在合盘 Tab——别在案主篇里硬塞双人结局。",
      "案主仍是叙述者。关系张力要在合盘与双方档案里找对白。",
    ),
    transit: D(
      "行运像外景摄制组进场：表告诉你今天灯打在哪；本命剧本还在档案三主星那页。",
      "此刻与终局同框时，记得谁在当主角：行运表管外境触发，底色看本命。",
    ),
    ephemeris: D(
      "时刻盘是一场戏的定格照：表是镜头参数，长文是演员过往履历——别混成同一张剧照。",
      "时间停在选定瞬间。只让这一格参与当下决定。",
    ),
    secondary: D(
      "次限像把几年拉长成一卷慢放：表下五联记录心里场景怎么换布景，不是天气预报。",
      "推进把年景摊开。看见慢变就好，不必用单日情绪给年景判死刑。",
    ),
    tertiary: D(
      "三限像近几周的剪辑节奏：哪里快切、哪里留白，表上会写得比较清楚。",
      "短窗讲松紧。用它来安排恢复与冲刺，别用来改身份证上的故事。",
    ),
    solar_return: D(
      "日返像年度片头曲：听一遍就知道这一年镜头常扫哪些宫位；别把它当每日台词。",
      "太阳回归开新季。年题与一生底色并排放，别互相顶替。",
    ),
    lunar_return: D(
      "月返像一小段生活蒙太奇：情绪、住处、身体感在表上连着唱；唱完这小段就翻篇。",
      "月亮回归圈出短窗。适合安顿起居，不适合预言十年。",
    ),
  },
  5: {
    natal: D(
      "出生盘 checklist：① 星盘数据 ② 表下五联 ③ 语义路由。按序勾选，误读率会降。",
      "硬条件：出生时刻 + 出生地。输出类型：长期结构；排除项：单日运势。",
    ),
    synastry: D(
      "合盘 checklist：主轮＝案主表 + 五联；双人项＝合盘 Tab。不要合并单元格。",
      "分工：案主本命＝主解读锚点；双人机制＝合盘与双方档案。",
    ),
    transit: D(
      "行运 checklist：行运表 → 行运↔本命 → 五联 → 实时块 → 本命摘录。",
      "双表头：档案三主星＝底色行；行运表＝当下行。",
    ),
    ephemeris: D(
      "时刻盘 checklist：先表（切片）后文（背景）；锚点标签贴在每一句上。",
      "字段：时间地点唯一。禁止：把切片结论迁移成终身标签。",
    ),
    secondary: D(
      "次限 checklist：推进表 + 表下五联 + 本命对照；粒度＝年，不是日。",
      "映射：推进龄 ↔ 年景。复核频率建议：按季。",
    ),
    tertiary: D(
      "三限 checklist：推进表 + 五联 + 本命；粒度＝几周。",
      "用途：排程 / 缓冲。禁止：用短窗推翻终身结构命名。",
    ),
    solar_return: D(
      "日返 checklist：返盘表 + 五联 + 本命；产出：1–2 条年度主轴。",
      "边界：年题 ≠ 每日指令。",
    ),
    lunar_return: D(
      "月返 checklist：返盘表 + 五联 + 起居复盘；产出：短窗负载表。",
      "边界：短窗 ≠ 大运。",
    ),
  },
  6: {
    natal: D(
      "出生盘：证据在星盘数据与表下五联；语义路由把议题挂回同一套几何，减少口径漂移。",
      "前提：固定生辰地。推论范围：长期配置；不承诺具体某日吉凶。",
    ),
    synastry: D(
      "合盘：案主轮提供可复核的案主几何；关系命题需合盘 Tab 的交叉证据。",
      "区分变量：案主内化模式 vs. 双人互动结构。缺一则不下全称判断。",
    ),
    transit: D(
      "行运：把「当下天象落宫 / 相位」与「本命接收方式」分开建模，再读实时块。",
      "外因表（行运）与内因底（本命）叠加阅读，避免单因子归因。",
    ),
    ephemeris: D(
      "时刻盘：事件切片上只接纳与该锚点一致的推论；长文提供先验，不升格为同锚结论。",
      "方法论：先锁定锚点，再分配证据权重。",
    ),
    secondary: D(
      "次限：在年尺度上观察场域主题如何平移；用表下五联做期中检查，而非日更。",
      "解释层级：推进场 > 单日情绪。",
    ),
    tertiary: D(
      "三限：在月尺度上观察资源与恢复节律；适合作为排程约束条件。",
      "解释层级：短窗节拍 ≠ 身份重写。",
    ),
    solar_return: D(
      "日返：从返盘提取年度主轴假设，用季度数据复核是否仍成立。",
      "假设类型：年度侧重；需与本命结构交叉验证。",
    ),
    lunar_return: D(
      "月返：从返盘提取短窗起居与情绪假设，用周历做轻量复核。",
      "假设类型：短周期调度；不外推为年度或终身结论。",
    ),
  },
  7: {
    natal: D(
      "出生盘就老实说：表在下面，解读贴在表头下，收起表也能看见路由在帮你对齐话题——别急，一步一步对。",
      "咱们从生辰地出发聊底色，这是长线故事，不是明天中不中奖那种。",
    ),
    synastry: D(
      "合盘时主轮是 TA 本命那套；你俩怎么掐、怎么好，去合盘 Tab 聊，主区先把案主侧读稳。",
      "主轮是案主视角；双人戏码得有双方数据才说得完整。",
    ),
    transit: D(
      "行运：外面变天在表里，你心里那套老规矩还在档案三主星——两边都看一眼，就不容易慌。",
      "现在是外头节奏对上了本命哪根弦，别一口气说成一辈子定了。",
    ),
    ephemeris: D(
      "时刻盘是「那一刻」的事：表对准现场，长文当背景，别混成同一句狠话。",
      "就当拍立得：只框这一下。",
    ),
    secondary: D(
      "次限像慢慢换季：表下五联帮你看见几年里哪儿换了布景，别拿今天下雨否定整个雨季。",
      "年景的事，年景的读法；给时间一点耐心。",
    ),
    tertiary: D(
      "三限管这几周松不松、紧不紧，用来安排喘口气还是冲一把；不是用来改你叫什么。",
      "短窗过了就翻篇，本命还在。",
    ),
    solar_return: D(
      "日返定调这一年常挂在心上的题，写进日程里一两件就好，别当每天的紧箍咒。",
      "年片头曲放一遍，知道主戏往哪走。",
    ),
    lunar_return: D(
      "月返管一小段日子住得舒不舒服、心里黏不黏，月初排一排，月底收个尾。",
      "小段日子小段读，别吓自己。",
    ),
  },
  8: {
    natal: D(
      "出生盘：以星盘数据为准；表下五联为辅助阅读。语义路由仅作议题对齐，不新增事实。",
      "范围：长期结构。不适用：以本区替代医疗、法律或财务专业意见。",
    ),
    synastry: D(
      "合盘：主轮数据仅覆盖案主；关系结论需合盘 Tab 与双方档案交叉验证。",
      "避免：在案主轮上直接下双人全称判断。",
    ),
    transit: D(
      "行运：表列当下天象；本命长文为底色参照。重大决定宜保留复核期，并结合现实约束。",
      "区分：外境触发与内在承受方式。",
    ),
    ephemeris: D(
      "时刻盘：结论仅绑定选定时间地点。长文不得升格为与该锚点冲突的终身断言。",
      "适用：现场决策支持；不适用：人格终局标签。",
    ),
    secondary: D(
      "次限：年尺度推论需按季复核；避免以单日波动覆盖年景判断。",
      "推进读慢变，读主题迁移。",
    ),
    tertiary: D(
      "三限：短窗推论用于节律管理；高风险决定建议落在表上相对缓和的时段并复核本命。",
      "读松紧，不读终局。",
    ),
    solar_return: D(
      "日返：年度主轴宜控制在少数可执行目标；避免把年题当作每日强制清单。",
      "年规划与本命底色并行，不互相替代。",
    ),
    lunar_return: D(
      "月返：短窗建议用于起居与情绪管理；不作长期命运断言。",
      "月度调度；边界清晰。",
    ),
  },
  9: {
    natal: D(
      "出生盘这一屏：星盘数据是正文，五联是随页注释；语义路由像索引，让你从议题跳回同一几何。",
      "写作体例：长期结构素描；刻意不写「今日宜忌」体。",
    ),
    synastry: D(
      "合盘专栏分栏：左栏案主本命（主轮+五联），右栏双人机制（合盘 Tab）。混栏即误读。",
      "栏目标题不同，证据标准也不同。",
    ),
    transit: D(
      "行运稿：上栏当下天象，下栏本命参照；实时块是短讯，别拉长成社论。",
      "时态：现在进行时；底色：一般现在时（本命）。",
    ),
    ephemeris: D(
      "时刻特稿：表为现场特讯，长文为背景资料；引用时请标注时间地点。",
      "体裁：切片特稿；非人物传记终稿。",
    ),
    secondary: D(
      "次限连载：一章管几年氛围；表下五联是章节细读，别用日报体去改连载设定。",
      "叙事速度：慢；更新频率：按季。",
    ),
    tertiary: D(
      "三限短篇：几周内的起承转合；用于排程，不用来重写人物小传。",
      "叙事速度：中；篇幅：短。",
    ),
    solar_return: D(
      "日返年度专题：返盘+五联定题，本命做脚注；专题不等同每日专栏。",
      "年度一次定调，多次轻量复盘。",
    ),
    lunar_return: D(
      "月返半月札记：短窗情绪与起居；札记完结即归档，不自动续写成长篇。",
      "月度体裁；克制外推。",
    ),
  },
  10: {
    natal: D(
      "出生盘：数据 → 表下五联 → 路由。短句，按顺序。",
      "生辰地。长期结构。非日运。",
    ),
    synastry: D(
      "合盘：主轮＝案主。双人＝合盘 Tab。",
      "案主本命 + 合盘数据。缺一则慢判。",
    ),
    transit: D(
      "行运：行运表。行运×本命。五联。实时块。",
      "此刻天象。本命底色。",
    ),
    ephemeris: D(
      "时刻盘：先表。长文背景。",
      "单锚点。勿外推终身。",
    ),
    secondary: D(
      "次限：推进表 + 五联。年粒度。",
      "年景。非单日。",
    ),
    tertiary: D(
      "三限：推进表 + 五联。几周。",
      "排程用。非改名。",
    ),
    solar_return: D(
      "日返：返盘 + 五联。年主轴。",
      "年题。非日令。",
    ),
    lunar_return: D(
      "月返：返盘 + 五联。短窗。",
      "小段。非大运。",
    ),
  },
};

/** 主流判读：成稿三句（模板仍含 {chartLabel}{topicLabel}） */
const MAINSTREAM_INSIGHT_MASTER_PATCH: Partial<
  Record<VoiceStyleIdZh, Partial<Record<ChartKindId, MainstreamPatch>>>
> = {
  2: {
    natal: {
      structureClosing: "以上三轴，是出生时刻下能反复核对的一条基线。",
      boundary:
        "太阳偏「要什么」，月亮偏「怎么感受」，上升偏「怎么被看见」。请同时对照当前盘面「{chartLabel}」与议题「{topicLabel}」，别把别的盘型句子搬过来。",
      action: "先回到数据区把落宫与相位摸实，再读正文；若冲突，先查宫位制、相位集、容许度是否一致。",
    },
    synastry: {
      structureClosing: "上列为案主三轴；主轮以表为准，双人细节请看合盘 Tab。",
      boundary:
        "主解读站在案主本命轮；相处与承诺要结合「{chartLabel}」与「{topicLabel}」，并看合盘与双方档案，勿用主轮代答关系题。",
      action: "先读合盘相位与互落宫，再回案主正文；争执时拆成事实与感受两层。",
    },
    transit: {
      structureClosing: "上列为档案三主星；表内是当下行运天象，请分两层读。",
      boundary:
        "行运读「此刻落在哪、怎么碰到本命」。底色仍在日月升。当前盘面「{chartLabel}」，议题「{topicLabel}」——别把几天情绪写成终身判决。",
      action: "先看行运↔本命与行运五联，再读本命摘录；大事按表上复核窗，急事先降速。",
    },
    ephemeris: {
      structureClosing: "上列为档案三主星；几何锚在选定时刻，与生日盘是两条线。",
      boundary:
        "时刻盘只服务该切片，不接终身定性。对照「{chartLabel}」与「{topicLabel}」时，分清哪句是这一刻、哪句是一生。",
      action: "现场优先对表：轴点、主相位、触发宫；长文作背景，勿混锚点。",
    },
    secondary: {
      structureClosing: "上列为出生三轴；次限表是推进场，看几年，不看单日。",
      boundary:
        "次限谈几年里的心里剧情迁移。联读「{chartLabel}」与「{topicLabel}」时，把年景与终身结构分开说。",
      action: "按季设一个小结构目标；月复盘时回到数据区看相位与落宫是否仍支持判断。",
    },
    tertiary: {
      structureClosing: "上列为出生三轴；三限表看近几周节拍，用来排程。",
      boundary:
        "三限读短窗松紧。当前「{chartLabel}」与「{topicLabel}」联读时，别用几周推翻终身结论。",
      action: "先读三限表再排日程；大事放到较松的窗，并仍对照本命。",
    },
    solar_return: {
      structureClosing: "上列为出生三轴；日返表是这一公历年的主题切片。",
      boundary:
        "日返定今年主戏在哪，不是每日指令。联读「{chartLabel}」与「{topicLabel}」时，年题与一生底色分开放。",
      action: "年度只抓一两场主战役写进行事历；每季用数据区复查主轴是否仍成立。",
    },
    lunar_return: {
      structureClosing: "上列为出生三轴；月返表是短窗起居与情绪提示。",
      boundary:
        "月返管小段调度，不管大运。联读「{chartLabel}」与「{topicLabel}」时，别把几天写成一辈子。",
      action: "月初粗排负载，月底一页复盘；紧处少加码，松处再推进。",
    },
  },
  3: {
    natal: {
      structureClosing: "三轴收束：太阳—目标感，月亮—安全感，上升—出场方式。出生口径可复核。",
      boundary:
        "判读时同时锁定盘面「{chartLabel}」与议题「{topicLabel}」。禁止串台：别用别的盘型句式套出生盘。",
      action: "执行顺序：数据区对齐 → 正文对照 → 冲突则回退三项：宫位制、相位集、容许度。",
    },
    synastry: {
      structureClosing: "案主三轴已列出；双人证据链在合盘 Tab。",
      boundary:
        "变量分离：案主内化（主轮）与双人结构（合盘）。当前「{chartLabel}」+「{topicLabel}」联读时，缺合盘勿下全称。",
      action: "合盘相位与互落宫优先；再读案主正文。争议拆层：事实 / 感受。",
    },
    transit: {
      structureClosing: "档案三主星＝底色；行运表＝外境输入。",
      boundary:
        "行运句型：外境如何触发本命接口。盘面「{chartLabel}」，议题「{topicLabel}」——避免把窗口情绪升格成终身标签。",
      action: "优先 Tab：行运↔本命；其次行运五联；再读本命摘录。保留复核窗。",
    },
    ephemeris: {
      structureClosing: "档案三主星为背景；时刻几何为前景。",
      boundary:
        "时刻盘结论仅绑定选定锚点。对照「{chartLabel}」与「{topicLabel}」：先标注时间地点，再分配句子权重。",
      action: "决策链：轴点 → 主相位 → 触发宫；长文不得覆盖锚点冲突。",
    },
    secondary: {
      structureClosing: "出生三轴＝常量；次限表＝年变量。",
      boundary:
        "次限讨论几年主题迁移。联读「{chartLabel}」与「{topicLabel}」：年景不得吞掉终身结构命名。",
      action: "按季目标 + 月度数据复核；禁止单日波动覆盖年景判断。",
    },
    tertiary: {
      structureClosing: "出生三轴＝常量；三限表＝月变量。",
      boundary:
        "三限定义短窗资源与恢复。联读「{chartLabel}」与「{topicLabel}」：短窗不得改写身份结论。",
      action: "排程约束：先表后历；高风险时段对照本命缓冲。",
    },
    solar_return: {
      structureClosing: "出生三轴＝底色；日返表＝年度变量。",
      boundary:
        "日返输出年度主轴假设。联读「{chartLabel}」与「{topicLabel}」：年假设需与本命交叉验证。",
      action: "年度 OKR 控制在 1–2 条；季度回到数据区验收。",
    },
    lunar_return: {
      structureClosing: "出生三轴＝底色；月返表＝短窗变量。",
      boundary:
        "月返输出起居与情绪假设。联读「{chartLabel}」与「{topicLabel}」：短假设不外推年/终身。",
      action: "月初排期 + 月底复盘；负载与情绪分栏记录。",
    },
  },
  4: {
    natal: {
      structureClosing: "三颗主星像三条旁白：想要、感受、被看见——出生这一刻写下的版本，可以一再对照。",
      boundary:
        "读的时候让「{chartLabel}」与「{topicLabel}」同时在场；别从别的盘型借台词，容易串戏。",
      action: "先把数据区的故事读实，再听正文怎么讲；对不上，就回到三张表底下找线索。",
    },
    synastry: {
      structureClosing: "案主的主星旁白在此；两人的对白在合盘那一章。",
      boundary:
        "主轮守住案主视角；「{chartLabel}」与「{topicLabel}」要在合盘里找对手戏才完整。",
      action: "先读双人线，再读案主线；吵起来时分开「发生了什么」和「各自怎么感受」。",
    },
    transit: {
      structureClosing: "档案里的三颗星是老配乐；行运表是今天新进来的鼓点。",
      boundary:
        "听清「{chartLabel}」这一刻的鼓点怎么敲在「{topicLabel}」上，别把几天的高潮剪成整部电影结局。",
      action: "先听行运与本命的对位，再翻本命长文；急的时候把节奏放慢半拍。",
    },
    ephemeris: {
      structureClosing: "档案主星是人物小传；时刻表是这一场戏的灯位。",
      boundary:
        "在「{chartLabel}」这一格里发生的，只属于「{topicLabel}」这一刻；别让小传抢戏。",
      action: "让表先说话：轴点、相位、宫位；长文在后景轻轻托着。",
    },
    secondary: {
      structureClosing: "出生三轴是人物设定；次限像几年一季的剧情推进。",
      boundary:
        "读「{chartLabel}」时记住次限在讲年景；「{topicLabel}」别被几天的小插曲改写成终局。",
      action: "给这一年选一两幕主戏，季末回看表下五联是否还站得住。",
    },
    tertiary: {
      structureClosing: "出生三轴还在；三限像近几集的剪辑节奏。",
      boundary:
        "「{chartLabel}」这几周怎么切镜头，配合「{topicLabel}」看松紧；别用一集改人设。",
      action: "把大事挪到剪辑松一点的日子，并回头问本命同不同意。",
    },
    solar_return: {
      structureClosing: "出生三轴是全长片；日返像这一季片头透露的母题。",
      boundary:
        "「{chartLabel}」年度母题与「{topicLabel}」并读时，别把季歌当成每日台词。",
      action: "写两条年度母题进行事历，其余当背景；季末再听一遍返盘。",
    },
    lunar_return: {
      structureClosing: "出生三轴还在；月返像一小段生活蒙太奇的提示。",
      boundary:
        "「{chartLabel}」这段蒙太奇服务「{topicLabel}」短窗；别剪成十年预告片。",
      action: "月初排镜头，月底收一卷；紧处少加戏，松处再推进。",
    },
  },
  5: {
    natal: {
      structureClosing: "三轴收束句（可复核）：太阳—月亮—上升。",
      boundary:
        "同时校验：盘面「{chartLabel}」、议题「{topicLabel}」、盘型边界。禁止跨盘型套句。",
      action: "复验清单：数据区 → 正文；冲突则查宫位制 / 相位集 / 容许度。",
    },
    synastry: {
      structureClosing: "案主三轴：已勾选。双人项：迁移至合盘 Tab。",
      boundary:
        "输入：主轮（案主）+ 合盘（双人）。当前「{chartLabel}」&「{topicLabel}」：缺合盘则标记为未决。",
      action: "顺序：合盘相位 / 互落宫 → 案主正文；争议分层：事实 / 感受。",
    },
    transit: {
      structureClosing: "底色行：档案三主星。输入行：行运表。",
      boundary:
        "行运判读约束：外境触发 × 本命接口。参数：「{chartLabel}」「{topicLabel}」。禁止窗口→终身。",
      action: "Tab 顺序：行运↔本命 → 行运五联 → 本命摘录；设复核窗。",
    },
    ephemeris: {
      structureClosing: "背景行：档案三主星。前景行：时刻几何。",
      boundary:
        "锚点校验：「{chartLabel}」「{topicLabel}」；禁止切片→终身标签。",
      action: "字段优先级：轴点 > 主相位 > 触发宫；长文=低权重背景。",
    },
    secondary: {
      structureClosing: "常量：出生三轴。变量：次限表（年）。",
      boundary:
        "年景判读：「{chartLabel}」+「{topicLabel}」。约束：年变量不得覆盖终身常量命名。",
      action: "季度目标 + 月度复核；剔除单日噪声。",
    },
    tertiary: {
      structureClosing: "常量：出生三轴。变量：三限表（几周）。",
      boundary:
        "短窗判读：「{chartLabel}」+「{topicLabel}」。约束：短变量不得改写身份常量。",
      action: "排程矩阵：先三限表后日历；高风险对照本命。",
    },
    solar_return: {
      structureClosing: "常量：出生三轴。变量：日返表（年）。",
      boundary:
        "年度判读：「{chartLabel}」+「{topicLabel}」。约束：年题 ≠ 日令。",
      action: "年度 OKR（1–2）+ 季度复盘。",
    },
    lunar_return: {
      structureClosing: "常量：出生三轴。变量：月返表（短窗）。",
      boundary:
        "短窗判读：「{chartLabel}」+「{topicLabel}」。约束：短窗 ≠ 大运。",
      action: "月初负载表 + 月底复盘一行。",
    },
  },
  6: {
    natal: {
      structureClosing: "三轴陈述完毕：可在出生口径下重复验证。",
      boundary:
        "解释需同时满足：几何「{chartLabel}」、议题「{topicLabel}」、盘型边界条件。",
      action: "若结论不一致：回退证据栈（宫位制 / 相位集 / 容许度）再前推。",
    },
    synastry: {
      structureClosing: "案主三轴：主轮可验证；双人命题需合盘证据。",
      boundary:
        "模型拆分：案主内化（主轮）与双人结构（合盘）。参数「{chartLabel}」「{topicLabel}」联立时缺合盘则降置信度。",
      action: "证据序：合盘交叉项 → 案主正文；冲突分解为可观测层与体验层。",
    },
    transit: {
      structureClosing: "底色模型：档案三主星；输入模型：行运天象。",
      boundary:
        "假说：外境通过「{chartLabel}」触发「{topicLabel}」相关接口；禁止将短期激活等同于长期特质判定。",
      action: "检验路径：行运↔本命 → 行运五联 → 本命摘录；保留时间复核。",
    },
    ephemeris: {
      structureClosing: "先验：档案三主星；观测：时刻几何。",
      boundary:
        "推论域限定于锚点（「{chartLabel}」「{topicLabel}」）；先验不得僭越观测域下全称结论。",
      action: "权重：轴点、主相位、触发宫 > 长文背景。",
    },
    secondary: {
      structureClosing: "常量层：出生三轴；过程层：次限推进（年）。",
      boundary:
        "过程假说需标注时间尺度；联读「{chartLabel}」「{topicLabel}」时分离年过程与终身结构。",
      action: "季度检验次限主题是否仍得到数据区支持。",
    },
    tertiary: {
      structureClosing: "常量层：出生三轴；过程层：三限（几周）。",
      boundary:
        "短窗假说仅用于节律；联读「{chartLabel}」「{topicLabel}」时不升格为身份断言。",
      action: "用三限表生成排程约束；大事对齐本命缓冲。",
    },
    solar_return: {
      structureClosing: "常量层：出生三轴；年过程层：日返。",
      boundary:
        "年度假说「{chartLabel}」需与本命结构联立验证；议题「{topicLabel}」仅作索引。",
      action: "年度假设季度复盘一次，更新置信度。",
    },
    lunar_return: {
      structureClosing: "常量层：出生三轴；短过程层：月返。",
      boundary:
        "短窗假说「{chartLabel}」不外推；议题「{topicLabel}」作索引。",
      action: "周度轻量复核月返起居与情绪假设。",
    },
  },
  7: {
    natal: {
      structureClosing: "三句话把底子说清：要什么、怎么感受、怎么出场——都能回到出生那一刻查。",
      boundary:
        "读的时候别忘了你现在看的是「{chartLabel}」，聊的是「{topicLabel}」；别拿别的盘型的顺口溜糊弄自己。",
      action: "先摸数据区，再听正文；对不上就先把宫位制和相位口径对齐，多半就顺了。",
    },
    synastry: {
      structureClosing: "案主这边我先说到这；你们俩的戏，合盘里接着聊。",
      boundary:
        "主轮是 TA 的故事线；「{chartLabel}」配上「{topicLabel}」时，记得把对象那份数据也请来。",
      action: "合盘看过再回案主正文；吵的时候先分清事实和感受，别混一锅。",
    },
    transit: {
      structureClosing: "档案里的三颗星还在；外面的天象今天这么落宫。",
      boundary:
        "「{chartLabel}」这几天怎么撞上「{topicLabel}」，可以急，但别一口气说成一辈子定了。",
      action: "先看行运和本命怎么掐，再读长文；真急就先深呼吸半分钟。",
    },
    ephemeris: {
      structureClosing: "档案主星是老朋友；这一刻的盘是现场快照。",
      boundary:
        "「{chartLabel}」这一下只服务「{topicLabel}」这个当场，别把小抄当人生判决书。",
      action: "让表先说话，长文在后头轻轻托着就行。",
    },
    secondary: {
      structureClosing: "出生三轴还在；次限帮你看见这几年心里哪儿在慢慢换景。",
      boundary:
        "读「{chartLabel}」时记得是年景；「{topicLabel}」别被今天的小事带跑。",
      action: "这一年挑一两件正经事盯着，季末回表看看还应不应。",
    },
    tertiary: {
      structureClosing: "出生三轴还在；三限告诉你这几周哪儿紧哪儿松。",
      boundary:
        "「{chartLabel}」这几周配合「{topicLabel}」看节奏；别用几周改写你是谁。",
      action: "大事往松一点的日子挪，仍问问本命同不同意。",
    },
    solar_return: {
      structureClosing: "出生三轴还在；日返像这一年的片头，告诉你常扫哪些景。",
      boundary:
        "「{chartLabel}」年题和「{topicLabel}」并读时，别当每日紧箍咒。",
      action: "写两条进日历，季末再听一遍返盘够不够准。",
    },
    lunar_return: {
      structureClosing: "出生三轴还在；月返像一小段日子的生活提示。",
      boundary:
        "「{chartLabel}」这段配合「{topicLabel}」看就好，别吓自己说一辈子都这样。",
      action: "月初排个大概，月底收个尾；紧的时候别硬顶。",
    },
  },
  8: {
    natal: {
      structureClosing: "以上三轴为出生口径下可复核陈述。",
      boundary:
        "适用范围：当前盘面「{chartLabel}」与议题「{topicLabel}」；不替代医疗、法律或财务专业意见。",
      action: "以数据区为准绳；若与正文冲突，优先复核宫位制、相位集、容许度。",
    },
    synastry: {
      structureClosing: "案主三轴：主轮可复核；双人陈述需合盘支持。",
      boundary:
        "主轮不覆盖双人全称判断。联读「{chartLabel}」与「{topicLabel}」须引用合盘与双方档案。",
      action: "合盘证据优先；正文为辅。争议时分层记录事实与感受。",
    },
    transit: {
      structureClosing: "档案三主星：参照系；行运表：外境输入。",
      boundary:
        "行运解读需限定窗口；盘面「{chartLabel}」、议题「{topicLabel}」下，避免终身化断言。",
      action: "重大决策保留复核期；同步查阅行运↔本命与五联。",
    },
    ephemeris: {
      structureClosing: "档案三主星：背景；时刻几何：前景。",
      boundary:
        "结论绑定选定锚点（「{chartLabel}」「{topicLabel}」）；禁止越权外推终身定性。",
      action: "现场决策以表为准；长文仅作背景参照。",
    },
    secondary: {
      structureClosing: "出生三轴：基线；次限：年尺度过程。",
      boundary:
        "年尺度推论联读「{chartLabel}」「{topicLabel}」；不以单日样本覆盖年景判断。",
      action: "按季复核；更新或撤回原判断需注明依据。",
    },
    tertiary: {
      structureClosing: "出生三轴：基线；三限：短窗过程。",
      boundary:
        "短窗推论用于节律管理；联读「{chartLabel}」「{topicLabel}」时不作终身断言。",
      action: "高风险决定宜落于较缓和时段，并对照本命。",
    },
    solar_return: {
      structureClosing: "出生三轴：基线；日返：年度过程。",
      boundary:
        "年度主轴联读「{chartLabel}」「{topicLabel}」；年题不构成每日强制义务。",
      action: "年度目标宜少而可执行；季度复核一次。",
    },
    lunar_return: {
      structureClosing: "出生三轴：基线；月返：短窗过程。",
      boundary:
        "短窗建议联读「{chartLabel}」「{topicLabel}」；不作长期命运断言。",
      action: "起居与情绪管理用途为主；月底轻量复盘。",
    },
  },
  9: {
    natal: {
      structureClosing: "收束：三轴在出生口径下可读、可复核。",
      boundary:
        "写作约束：同时点名盘面「{chartLabel}」与议题「{topicLabel}」；禁止跨盘型套作。",
      action: "结构：数据区证据先行，正文阐释跟随；冲突则回退三项技术口径。",
    },
    synastry: {
      structureClosing: "栏内：案主三轴；栏外：合盘专稿。",
      boundary:
        "文体分界：主轮≠双人终稿。参数「{chartLabel}」「{topicLabel}」需在合盘栏补全证据。",
      action: "刊例：合盘材料前置；案主正文后置；争议分栏刊登。",
    },
    transit: {
      structureClosing: "上栏底色：档案三主星；下栏现场：行运表。",
      boundary:
        "时态规范：现在进行时（行运）与一般现在时（本命）。对象：「{chartLabel}」「{topicLabel}」。",
      action: "刊发顺序：行运↔本命、五联、摘录；实时块保持短讯篇幅。",
    },
    ephemeris: {
      structureClosing: "特稿前景：时刻几何；资料背景：档案三主星。",
      boundary:
        "体裁：切片特稿。脚注：「{chartLabel}」「{topicLabel}」时间地点。禁止升格传记终判。",
      action: "编排：表先于文；引用须带锚点。",
    },
    secondary: {
      structureClosing: "连载设定：出生三轴；本卷：次限年景。",
      boundary:
        "叙事尺度：年。索引：「{chartLabel}」「{topicLabel}」。禁止日报体改写连载设定。",
      action: "卷末：季更复盘；依据数据区更新剧情梗概。",
    },
    tertiary: {
      structureClosing: "人物设定：出生三轴；短篇：三限窗口。",
      boundary:
        "篇幅：几周。索引：「{chartLabel}」「{topicLabel}」。禁止短篇扩写成长篇终稿。",
      action: "刊例：先表后排程；收束于窗口结束。",
    },
    solar_return: {
      structureClosing: "母题栏：出生三轴；年题栏：日返。",
      boundary:
        "年度专题联立「{chartLabel}」「{topicLabel}」；专题≠日更专栏。",
      action: "年题定稿后按季勘误；保持可执行篇幅。",
    },
    lunar_return: {
      structureClosing: "母题栏：出生三轴；札记栏：月返。",
      boundary:
        "札记联立「{chartLabel}」「{topicLabel}」；完结归档，不自动续写长篇。",
      action: "月刊体例：月初选题，月底收束。",
    },
  },
  10: {
    natal: {
      structureClosing: "三轴基线（出生口径）。",
      boundary:
        "同时看：「{chartLabel}」「{topicLabel}」。禁串盘型。",
      action: "数据区 → 正文；冲突查宫位制 / 相位 / 容许度。",
    },
    synastry: {
      structureClosing: "案主三轴。双人：合盘 Tab。",
      boundary:
        "主轮≠双人终判。「{chartLabel}」「{topicLabel}」需合盘。",
      action: "合盘 → 案主正文；分层：事实 / 感受。",
    },
    transit: {
      structureClosing: "底色：档案三主星。输入：行运表。",
      boundary:
        "窗口读行运。「{chartLabel}」「{topicLabel}」。禁终身化。",
      action: "行运↔本命 → 五联 → 摘录。",
    },
    ephemeris: {
      structureClosing: "背景：档案三主星。前景：时刻表。",
      boundary:
        "锚点：「{chartLabel}」「{topicLabel}」。禁外推终身。",
      action: "轴点 → 主相位 → 宫。",
    },
    secondary: {
      structureClosing: "常量：三轴。变量：次限（年）。",
      boundary:
        "年景读。「{chartLabel}」「{topicLabel}」。年≠终身。",
      action: "季目标；月复核。",
    },
    tertiary: {
      structureClosing: "常量：三轴。变量：三限（几周）。",
      boundary:
        "短窗读。「{chartLabel}」「{topicLabel}」。短≠终身。",
      action: "先表后排程。",
    },
    solar_return: {
      structureClosing: "常量：三轴。变量：日返（年）。",
      boundary:
        "年题。「{chartLabel}」「{topicLabel}」。年≠日令。",
      action: "年 OKR；季复盘。",
    },
    lunar_return: {
      structureClosing: "常量：三轴。变量：月返（短）。",
      boundary:
        "短窗。「{chartLabel}」「{topicLabel}」。短≠大运。",
      action: "月初 / 月底一行。",
    },
  },
};

export function workspaceDecodeSurfaceVocal(
  kind: ChartKindId,
  voiceStyleId: VoiceStyleIdZh,
): WorkspaceDecodeSurfaceZh {
  const base = WORKSPACE_DECODE_SURFACE_ZH[kind];
  const patch = WORKSPACE_DECODE_MASTER_PATCH[voiceStyleId]?.[kind];

  if (!patch) {
    return { ...base };
  }

  const merged = deepMergePlain(base, patch);
  const sub = WORKSPACE_DECODE_SUBTITLE_VOICE_PATCH[voiceStyleId]?.[kind];
  return {
    big3Title: base.big3Title,
    readoutLayerBlurb: merged.readoutLayerBlurb,
    decodeDepthLead: merged.decodeDepthLead,
    big3Subtitle: sub?.big3Subtitle ?? base.big3Subtitle,
    structureDecodeSubtitle: sub?.structureDecodeSubtitle ?? base.structureDecodeSubtitle,
    rhythmLayerSubtitle: sub?.rhythmLayerSubtitle ?? base.rhythmLayerSubtitle,
    todayRefSubtitle: sub?.todayRefSubtitle ?? base.todayRefSubtitle,
  };
}

export function mainstreamInsightLinesVocal(
  kind: ChartKindId,
  params: { chartLabel: string; topicLabel: string },
  voiceStyleId: VoiceStyleIdZh,
): MainstreamInsightLinesZh {
  const baseT = MAINSTREAM_INSIGHT_LINES_ZH[kind];
  const patch = MAINSTREAM_INSIGHT_MASTER_PATCH[voiceStyleId]?.[kind];

  if (!patch) {
    return fillMainstreamTemplates(baseT, params);
  }

  const merged = deepMergePlain(baseT, patch);
  return fillMainstreamTemplates(merged, params);
}
