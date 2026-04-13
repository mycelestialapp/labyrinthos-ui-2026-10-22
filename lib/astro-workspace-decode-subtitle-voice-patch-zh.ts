import type { ChartKindId } from "@/lib/astro-chart-kinds";
import type { VoiceStyleIdZh } from "@/lib/astro-voice-style-zh";

/** 灵识解构区：日月升卡与三段子标题（不含 big3Title）。声部 2–10 成稿，避免整段 apply。 */
export type WorkspaceDecodeSubtitleQuad = {
  big3Subtitle: string;
  structureDecodeSubtitle: string;
  rhythmLayerSubtitle: string;
  todayRefSubtitle: string;
};

export const WORKSPACE_DECODE_SUBTITLE_VOICE_PATCH: Partial<
  Record<VoiceStyleIdZh, Partial<Record<ChartKindId, WorkspaceDecodeSubtitleQuad>>>
> = {
  2: {
    natal: {
      big3Subtitle: "日月升先扫一眼：最常和日常感受对上号的就是这三颗。",
      structureDecodeSubtitle: "结构解读在星盘数据后面——先对表、再读解释，顺序别反。",
      rhythmLayerSubtitle:
        "这里是宫位议题和相位摘要；八种盘型里五联都贴在星盘数据各表下面，几何跟当前轮一致。",
      todayRefSubtitle: "今日条只服务今天的心情和节拍，不改你出生盘里的底层结构。",
    },
    synastry: {
      big3Subtitle: "主轮上的日月升先帮案主对上日常感受；俩人怎么磨合，以合盘为准。",
      structureDecodeSubtitle: "这一块读的是案主侧结构；双人互动请回到合盘 Tab 和双方档案。",
      rhythmLayerSubtitle:
        "五联贴在案主的数据表下面，双人数据在合盘 Tab；分层照样能用，别拿案主轮一笔勾销关系核对。",
      todayRefSubtitle: "今日线是日历向的心情提示；关系判断仍以合盘和两张本命为据。",
    },
    transit: {
      big3Subtitle: "档案里日月升还是你的长期底色；行运表在说当下天象落在哪几宫。",
      structureDecodeSubtitle: "先看清数据区里的行运几何和行运×本命，再读正文摘录，不容易串戏。",
      rhythmLayerSubtitle:
        "行运模式下五联跟当前轮对齐，还有行运实时块；综合结论 Tab 会标明你在行运语境里。",
      todayRefSubtitle: "今日参考可以拿去跟行运对一下：今天的日历节奏和「此刻天象落宫」是不是同向。",
    },
    ephemeris: {
      big3Subtitle: "长文还是从出生结构来；时刻表只框住那一瞬间的天象。",
      structureDecodeSubtitle: "时刻盘以数据区为先，长文当背景，两套口径别搅在一起。",
      rhythmLayerSubtitle: "时刻盘五联跟当刻轮对齐；分层是在帮你分清「这一刻」和「一辈子」各管哪一段。",
      todayRefSubtitle: "今日参考是日历系提示；跟时刻盘不是同一个锚点时，就分开理解别硬并。",
    },
    secondary: {
      big3Subtitle: "档案三主星垫着底色；次限表在推进几年里的场域和相位。",
      structureDecodeSubtitle: "先啃次限数据区，再翻本命长文，时间尺度拆开想就清爽。",
      rhythmLayerSubtitle: "次限里五联跟推进轮是一套几何；用语义路由时按年复盘，别拿单日赌吉凶。",
      todayRefSubtitle: "今日条是当天的微小节奏；次限看年景，别把日历上当推进结论。",
    },
    tertiary: {
      big3Subtitle: "底色还在档案三主星；三限表盯的是最近这几周的推进。",
      structureDecodeSubtitle: "三限数据区先看，再接本命长文，记得哪层管几周、哪层管一生。",
      rhythmLayerSubtitle: "三限五联贴着推进轮；适合拿来排松紧，不适合一句话重写你是谁。",
      todayRefSubtitle: "今日参考可以当「今天要不要硬扛」的小提示；窗口松紧仍以三限几周为主。",
    },
    solar_return: {
      big3Subtitle: "终身底色看档案三主星；日返表是这一年的切片。",
      structureDecodeSubtitle: "年度数据和出生长文放一起读时，先标清哪句在说今年、哪句在说一生。",
      rhythmLayerSubtitle: "日返五联跟返盘轮对齐；分层是为了你排全年兵力，不是替你做每日指令。",
      todayRefSubtitle: "今日参考管今天的起伏；日返定年度主题，两边尺度不一样。",
    },
    lunar_return: {
      big3Subtitle: "档案三主星仍是底盘；月返表圈的是这一小段日子的切片。",
      structureDecodeSubtitle: "短窗数据和出生长文联读时，别把几天的劲儿写成一辈子定性。",
      rhythmLayerSubtitle: "月返五联跟返盘轮对齐；适合当月调度，不顶替年度叙事，更不顶替终身结构。",
      todayRefSubtitle: "今日参考能对上月亮返照窗口里的起居节拍；但别把日历条当成整段月返正文。",
    },
  },
  3: {
    natal: {
      big3Subtitle: "日月升｜日常感受主入口。",
      structureDecodeSubtitle: "顺序：星盘数据 → 解读。",
      rhythmLayerSubtitle: "五联｜各表下；八盘几何=当前轮。",
      todayRefSubtitle: "今日｜不改本命结构。",
    },
    synastry: {
      big3Subtitle: "案主日月升｜双人→合盘。",
      structureDecodeSubtitle: "案主结构｜双人→合盘+双档。",
      rhythmLayerSubtitle: "五联｜案主表下；双人→合盘Tab。",
      todayRefSubtitle: "今日提示｜关系→合盘·双本命。",
    },
    transit: {
      big3Subtitle: "档案日月升｜底色；行运表｜当下落宫。",
      structureDecodeSubtitle: "行运数据+行运×本命→再正文。",
      rhythmLayerSubtitle: "五联=当前轮；+实时块；综结标行运。",
      todayRefSubtitle: "今日↔行运｜日历节奏vs天象落宫。",
    },
    ephemeris: {
      big3Subtitle: "长文｜出生；时刻表｜瞬态。",
      structureDecodeSubtitle: "时刻数据优先｜长文背景。",
      rhythmLayerSubtitle: "五联=当刻；分层｜此刻vs终身。",
      todayRefSubtitle: "今日日历≠时刻锚｜分读。",
    },
    secondary: {
      big3Subtitle: "档案三主｜底；次限｜年推进。",
      structureDecodeSubtitle: "次限区→本命长文｜分尺度。",
      rhythmLayerSubtitle: "五联=推进轮；路由按年｜非单日吉凶。",
      todayRefSubtitle: "今日微节奏≠次限年景。",
    },
    tertiary: {
      big3Subtitle: "档案三主｜底；三限｜近窗。",
      structureDecodeSubtitle: "三限区→本命｜尺度标注。",
      rhythmLayerSubtitle: "五联=推进；排程用｜非重写身份。",
      todayRefSubtitle: "今日硬顶提示；窗口｜三限几周。",
    },
    solar_return: {
      big3Subtitle: "档案三主｜终身；日返｜年切片。",
      structureDecodeSubtitle: "年数据vs一生长文｜先分层。",
      rhythmLayerSubtitle: "五联=返盘；年度排兵｜非日令。",
      todayRefSubtitle: "今日节奏≠年主轴。",
    },
    lunar_return: {
      big3Subtitle: "档案三主｜底；月返｜短切片。",
      structureDecodeSubtitle: "短窗+长文｜禁几天=一生。",
      rhythmLayerSubtitle: "五联=返盘；月调度｜非替年/终身。",
      todayRefSubtitle: "今日↔月返起居｜≠月返全文。",
    },
  },
  4: {
    natal: {
      big3Subtitle: "日月升像三本最容易翻开的日记：情绪对号入座，从这里最省事。",
      structureDecodeSubtitle: "结构解读在数据的下一幕出场——先拿表上的事实，再听旁白。",
      rhythmLayerSubtitle: "宫位与相位像脚注贴在各表下面；八种戏码里五联都跟当前这轮同一套布景。",
      todayRefSubtitle: "今日参考是今天的画外音，不负责改你出生那页的人物小传。",
    },
    synastry: {
      big3Subtitle: "主轮日月升先把案主日常对上；相处走势看合盘。",
      structureDecodeSubtitle: "案主侧幕前；双人幕后→合盘与档案。",
      rhythmLayerSubtitle: "五联趴案主表下；双人场次→合盘Tab。别用主轮一笔杀青。",
      todayRefSubtitle: "今日声调是日历嘀咕；关系终审→合盘+双本命。",
    },
    transit: {
      big3Subtitle: "档案日月升=底色台词；行运表=今天打的灯。",
      structureDecodeSubtitle: "先盯行运与行运×本命，再翻正文摘录。",
      rhythmLayerSubtitle: "五联贴当下轮；带实时块；综结论标明行运。",
      todayRefSubtitle: "今日可与行运对表：日历步点vs天象落宫。",
    },
    ephemeris: {
      big3Subtitle: "长文来自出生；时刻表停在此帧。",
      structureDecodeSubtitle: "时刻数据当分镜；长文当回忆录。",
      rhythmLayerSubtitle: "五联守当刻；分层帮你切开此刻与余生。",
      todayRefSubtitle: "今日是日历旁白；无同一锚点就别硬剪在一起。",
    },
    secondary: {
      big3Subtitle: "三主星垫场；次限推几年的景别。",
      structureDecodeSubtitle: "次限分镜先，对切本命长镜头。",
      rhythmLayerSubtitle: "五联跟推进布景；路由按年回放，别按日下注。",
      todayRefSubtitle: "今日是花絮；次限是正片年轴。",
    },
    tertiary: {
      big3Subtitle: "三主星打底；三限盯近几周剪辑点。",
      structureDecodeSubtitle: "三限粗剪先看，再接本命全长。",
      rhythmLayerSubtitle: "五联跟推进；拿来调松紧，别拿来改人设终稿。",
      todayRefSubtitle: "今日可当「今天顶不顶」的提示；主节拍仍看三限窗。",
    },
    solar_return: {
      big3Subtitle: "三主星是全集；日返是本季预告。",
      structureDecodeSubtitle: "年轴与一生轴并排读，别混声道。",
      rhythmLayerSubtitle: "五联守返盘；方便你排全年场次，不是每日台本。",
      todayRefSubtitle: "今日属花絮；年主题是日返。",
    },
    lunar_return: {
      big3Subtitle: "三主星是老座；月返是小剧场一周目。",
      structureDecodeSubtitle: "短窗接长文，别把插曲当终章。",
      rhythmLayerSubtitle: "五联贴返盘；当月排期用，不换年题、不改终身。",
      todayRefSubtitle: "今日可对表月返起居；日历≠整场月返。",
    },
  },
  5: {
    natal: {
      big3Subtitle: "日月升·情绪主入口",
      structureDecodeSubtitle: "数据→解释",
      rhythmLayerSubtitle: "五联@表下·八盘一致",
      todayRefSubtitle: "今日≠改本命",
    },
    synastry: {
      big3Subtitle: "案主日月升·双人→合盘",
      structureDecodeSubtitle: "案主结构·双人→合盘",
      rhythmLayerSubtitle: "五联@案主·双人在合盘Tab",
      todayRefSubtitle: "今日·关系→合盘+双本命",
    },
    transit: {
      big3Subtitle: "档案日月升·底+行运表·当下",
      structureDecodeSubtitle: "行运+行运×本命→正文",
      rhythmLayerSubtitle: "五联=轮+实时+综结标语境",
      todayRefSubtitle: "今日↔行运·日历vs落宫",
    },
    ephemeris: {
      big3Subtitle: "长文·出生；表·瞬态",
      structureDecodeSubtitle: "时刻数据>长文",
      rhythmLayerSubtitle: "五联=当刻·此刻≠终身",
      todayRefSubtitle: "今日日历≠时刻锚",
    },
    secondary: {
      big3Subtitle: "档案三主·底；次限·年",
      structureDecodeSubtitle: "次限区→本命·分尺度",
      rhythmLayerSubtitle: "五联=推进·按年复盘",
      todayRefSubtitle: "今日≠次限年景",
    },
    tertiary: {
      big3Subtitle: "档案三主·底；三限·窗",
      structureDecodeSubtitle: "三限→本命·标尺度",
      rhythmLayerSubtitle: "五联=推进·排程",
      todayRefSubtitle: "今日提示·窗看三限",
    },
    solar_return: {
      big3Subtitle: "档案三主·终身；日返·年",
      structureDecodeSubtitle: "年vs一生·先分层",
      rhythmLayerSubtitle: "五联=返盘·年排兵",
      todayRefSubtitle: "今日≠年主轴",
    },
    lunar_return: {
      big3Subtitle: "档案三主·底；月返·短",
      structureDecodeSubtitle: "短窗+长文·禁升格",
      rhythmLayerSubtitle: "五联=返盘·月调度",
      todayRefSubtitle: "今日·对照月返起居",
    },
  },
  6: {
    natal: {
      big3Subtitle: "日月升三主星为日常体验之首要对齐接口。",
      structureDecodeSubtitle: "结构解读位于星盘数据之后；宜先完成数据核对。",
      rhythmLayerSubtitle: "本区摘要宫位与相位；八种盘型之五联均附于数据表下，并与当前轮一致。",
      todayRefSubtitle: "今日参考限于当日心情与节奏；不改变出生结构。",
    },
    synastry: {
      big3Subtitle: "主轮日月升用于案主日常对齐；关系命题以合盘为准。",
      structureDecodeSubtitle: "本段为案主侧结构；双人互动请参阅合盘与双方档案。",
      rhythmLayerSubtitle: "五联附于案主表下；双人数据位于合盘 Tab。",
      todayRefSubtitle: "今日为日历向提示；关系判断依据合盘与双方本命。",
    },
    transit: {
      big3Subtitle: "档案日月升为长期底色；行运表表述当下天象落宫。",
      structureDecodeSubtitle: "宜先行阅读行运数据与行运×本命，再读正文摘录。",
      rhythmLayerSubtitle: "行运模式五联与当前轮一致，并含行运实时块；综合结论标明行运语境。",
      todayRefSubtitle: "今日参考可与行运对照，比较日历节奏与天象落宫。",
    },
    ephemeris: {
      big3Subtitle: "正文基于出生结构；时刻表对应该瞬间天象。",
      structureDecodeSubtitle: "时刻数据优先；长文为背景参照。",
      rhythmLayerSubtitle: "时刻盘五联与当刻轮一致；分层阅读以区分此刻与终身。",
      todayRefSubtitle: "今日参考属日历提示；与时刻锚不一致时应分别理解。",
    },
    secondary: {
      big3Subtitle: "档案三主星为背景；次限表为推进场域与相位。",
      structureDecodeSubtitle: "先读次限数据区，再读本命长文，并区分时间尺度。",
      rhythmLayerSubtitle: "次限五联与推进轮一致；语义路由宜按年复盘。",
      todayRefSubtitle: "今日为微节奏；次限聚焦年景，不宜以日历条替代推进结论。",
    },
    tertiary: {
      big3Subtitle: "档案三主星为背景；三限表为近窗推进。",
      structureDecodeSubtitle: "先读三限数据区，再读本命长文，并标注尺度。",
      rhythmLayerSubtitle: "三限五联与推进轮一致；用于节律安排，不宜重写身份结论。",
      todayRefSubtitle: "今日参考可作为当日强度提示；窗口判断仍以三限几周为准。",
    },
    solar_return: {
      big3Subtitle: "档案三主星为终身底色；日返表为年度切片。",
      structureDecodeSubtitle: "年度数据与出生长文联读时，应区分年与终身口径。",
      rhythmLayerSubtitle: "日返五联与返盘轮一致；分层便于年度规划而非单日指令。",
      todayRefSubtitle: "今日参考描述当日节奏；年度主题由日返承担，二者尺度不同。",
    },
    lunar_return: {
      big3Subtitle: "档案三主星为背景；月返表为短窗切片。",
      structureDecodeSubtitle: "短窗数据与出生长文联读时，应避免将短周期升格为终身断言。",
      rhythmLayerSubtitle: "月返五联与返盘轮一致；适用于月度调度，不替代年度与终身结构。",
      todayRefSubtitle: "今日参考可对齐月返窗口内起居节奏；日历条不等同月返全文。",
    },
  },
  7: {
    natal: {
      big3Subtitle: "咱先把日月升这三颗弄明白，日常好受难受先从这儿对上。",
      structureDecodeSubtitle: "结构话接在星盘数据后边，先瞅表再听解说。",
      rhythmLayerSubtitle: "宫位相位摘要在里；八张盘五联都挨各表下头，跟这轮几何一套。",
      todayRefSubtitle: "今日条只管今儿心情和步子，改不了你出生那点底子。",
    },
    synastry: {
      big3Subtitle: "主轮日月升先帮案主把日常对上；俩人咋处，合盘说话。",
      structureDecodeSubtitle: "这段念案主侧；对手戏去合盘 Tab 和双方档案。",
      rhythmLayerSubtitle: "五联贴案主表下，双人那摊在合盘；分层能用，别拿主轮糊弄关系。",
      todayRefSubtitle: "今日线是日历嘀咕；拍板关系还得合盘加两张本命。",
    },
    transit: {
      big3Subtitle: "档案日月升还是你的老底；行运表叨叨的是这会儿天象落哪宫。",
      structureDecodeSubtitle: "先把行运跟行运×本命看实了，再翻正文摘录。",
      rhythmLayerSubtitle: "行运时五联跟当前轮一路，还有实时块；综结会告诉你正在行运语境里。",
      todayRefSubtitle: "今日拿去打行运也行：日历节奏跟当下落宫顺不顺。",
    },
    ephemeris: {
      big3Subtitle: "长文还是从出生那把尺子来；时刻表就框这一下子。",
      structureDecodeSubtitle: "时刻数据当头；长文垫背，别搅成一锅粥。",
      rhythmLayerSubtitle: "时刻五联跟当刻轮；分层就是帮你掰开这一刻跟一辈子。",
      todayRefSubtitle: "今日是日历系的；跟时刻不是一锚点就各听各的。",
    },
    secondary: {
      big3Subtitle: "三主星托底；次限推几年的戏路子。",
      structureDecodeSubtitle: "次限区先啃透，再接本命长文，尺度别糊。",
      rhythmLayerSubtitle: "次限五联跟推进轮一套；路由按年盘，别拿单日赌。",
      todayRefSubtitle: "今日是当天碎拍；次限看整年景，别拿日历当推进结论。",
    },
    tertiary: {
      big3Subtitle: "三主星垫底；三限盯这几周松紧。",
      structureDecodeSubtitle: "三限数据先看，再接本命，几周和一生分开念。",
      rhythmLayerSubtitle: "三限五联跟推进；拿来排日子，不当改名分。",
      todayRefSubtitle: "今日能提示今儿硬不硬顶；大头还看三限那几周窗口。",
    },
    solar_return: {
      big3Subtitle: "三主星是一辈子那本；日返是这一年的册子。",
      structureDecodeSubtitle: "年册和全书放一块儿读，先分清谁说年谁说一生。",
      rhythmLayerSubtitle: "日返五联跟返盘；帮你排全年的仗，不是天天敲你。",
      todayRefSubtitle: "今日管今天起伏；年主题是日返那边的事。",
    },
    lunar_return: {
      big3Subtitle: "三主星是底；月返圈这一小段日子的戏。",
      structureDecodeSubtitle: "短窗接长文，别把几天的劲儿说成一辈子定调。",
      rhythmLayerSubtitle: "月返五联贴返盘；当月排期用，顶不了年题也换不了终身。",
      todayRefSubtitle: "今日能对生活起居跟月返对对表；日历条不是整段月返。",
    },
  },
  8: {
    natal: {
      big3Subtitle: "建议优先阅读日月升三主星，以便将盘面与日常体验建立对应。",
      structureDecodeSubtitle: "建议先完成星盘数据阅读，再进行结构解读。",
      rhythmLayerSubtitle: "本区提供宫位与相位摘要；于八种盘型中，五联均位于各数据表下方，并与当前轮几何一致。",
      todayRefSubtitle: "今日参考仅作为心情与节奏之提示，不宜理解为对出生结构的改写。",
    },
    synastry: {
      big3Subtitle: "建议以主轮日月升对齐案主日常体验；关系层面宜以合盘为主要依据。",
      structureDecodeSubtitle: "本段侧重案主侧结构；双人互动建议结合合盘与双方档案。",
      rhythmLayerSubtitle: "五联位于案主数据表下方；双人相关数据分布于合盘 Tab。",
      todayRefSubtitle: "今日参考属日历向提示；关系判断仍建议依据合盘及双方本命。",
    },
    transit: {
      big3Subtitle: "档案日月升可视为长期底色；行运表描述当下天象之落宫分布。",
      structureDecodeSubtitle: "建议先行核对行运数据及行运×本命，再阅读正文摘录。",
      rhythmLayerSubtitle: "行运模式下五联与当前轮一致，并包含行运实时报告；综合结论将标明行运语境。",
      todayRefSubtitle: "今日参考可与行运盘对照，以比较日历节奏与当下天象落宫是否同向。",
    },
    ephemeris: {
      big3Subtitle: "正文仍源自出生结构；时刻表对应该瞬间之天象配置。",
      structureDecodeSubtitle: "建议以时刻数据为优先，长文作为背景材料。",
      rhythmLayerSubtitle: "时刻盘五联与当刻轮一致；分层阅读有助于区分「此刻」与「终身」之边界。",
      todayRefSubtitle: "今日参考为日历向提示；若与时刻锚不一致，建议分别理解。",
    },
    secondary: {
      big3Subtitle: "档案三主星构成底色；次限表反映推进后之场域与相位关系。",
      structureDecodeSubtitle: "建议先阅读次限数据区，再阅读本命长文，并区分时间尺度。",
      rhythmLayerSubtitle: "次限下五联与推进轮几何一致；使用语义路由时，建议按年度复盘。",
      todayRefSubtitle: "今日参考描述当日微节奏；次限聚焦年景，不宜以日历条替代推进结论。",
    },
    tertiary: {
      big3Subtitle: "档案三主星为背景；三限表对应近窗推进。",
      structureDecodeSubtitle: "建议先阅读三限数据区，再阅读本命长文，并明确尺度标注。",
      rhythmLayerSubtitle: "三限下五联与推进轮一致；适用于节律安排，不宜用于改写身份结论。",
      todayRefSubtitle: "今日参考可作为当日强度之提示；窗口判断仍以三限之几周范围为准。",
    },
    solar_return: {
      big3Subtitle: "档案三主星对应终身底色；日返表为该公历年度之切片。",
      structureDecodeSubtitle: "年度数据与出生长文联读时，建议先区分年度叙述与终身叙述。",
      rhythmLayerSubtitle: "日返五联与返盘轮一致；分层旨在支持年度规划，而非单日决策。",
      todayRefSubtitle: "今日参考描述当日节奏；年度主题由日返承担，二者尺度不同。",
    },
    lunar_return: {
      big3Subtitle: "档案三主星为背景；月返表对应短周期切片。",
      structureDecodeSubtitle: "短窗数据与出生长文联读时，建议避免将短周期上升为终身结论。",
      rhythmLayerSubtitle: "月返五联与返盘轮一致；适用于月度调度，不宜替代年度及终身结构。",
      todayRefSubtitle: "今日参考可对齐月返窗口内之起居节奏；日历条不等同于月返全文。",
    },
  },
  9: {
    natal: {
      big3Subtitle: "【三主星】日月升→日常",
      structureDecodeSubtitle: "【顺序】数据→解读",
      rhythmLayerSubtitle: "【五联】表下·八盘",
      todayRefSubtitle: "【今日】≠本命",
    },
    synastry: {
      big3Subtitle: "【案主】日月升",
      structureDecodeSubtitle: "【案主结构】双人→合盘",
      rhythmLayerSubtitle: "【五联】案主表｜合盘Tab",
      todayRefSubtitle: "【今日】关系→合盘",
    },
    transit: {
      big3Subtitle: "【底色】档案日月升【当下】行运表",
      structureDecodeSubtitle: "【数据】行运+×本命",
      rhythmLayerSubtitle: "【五联】+实时+综结",
      todayRefSubtitle: "【今日】↔行运",
    },
    ephemeris: {
      big3Subtitle: "【长文】出生【表】此刻",
      structureDecodeSubtitle: "【优先】时刻数据",
      rhythmLayerSubtitle: "【五联】当刻·界",
      todayRefSubtitle: "【今日】≠时刻锚",
    },
    secondary: {
      big3Subtitle: "【底】三主【次限】年",
      structureDecodeSubtitle: "【次限】→本命",
      rhythmLayerSubtitle: "【五联】推进·年复盘",
      todayRefSubtitle: "【今日】≠年景",
    },
    tertiary: {
      big3Subtitle: "【底】三主【三限】窗",
      structureDecodeSubtitle: "【三限】→本命",
      rhythmLayerSubtitle: "【五联】推进·排程",
      todayRefSubtitle: "【今日】+三限窗",
    },
    solar_return: {
      big3Subtitle: "【底】三主【日返】年",
      structureDecodeSubtitle: "【年】【一生】分读",
      rhythmLayerSubtitle: "【五联】返盘·年",
      todayRefSubtitle: "【今日】≠年题",
    },
    lunar_return: {
      big3Subtitle: "【底】三主【月返】短",
      structureDecodeSubtitle: "【短窗】禁升格",
      rhythmLayerSubtitle: "【五联】返盘·月",
      todayRefSubtitle: "【今日】↔月返",
    },
  },
  10: {
    natal: {
      big3Subtitle: "日月升·日常",
      structureDecodeSubtitle: "数据→释",
      rhythmLayerSubtitle: "五联↓表",
      todayRefSubtitle: "今日≠本命",
    },
    synastry: {
      big3Subtitle: "案主日月升",
      structureDecodeSubtitle: "案主→合盘",
      rhythmLayerSubtitle: "五联↓案主",
      todayRefSubtitle: "今日→合盘",
    },
    transit: {
      big3Subtitle: "档案底+行运",
      structureDecodeSubtitle: "行运→文",
      rhythmLayerSubtitle: "五联+实时",
      todayRefSubtitle: "今日↔行运",
    },
    ephemeris: {
      big3Subtitle: "长文+时刻",
      structureDecodeSubtitle: "表>文",
      rhythmLayerSubtitle: "五联=刻",
      todayRefSubtitle: "今≠锚",
    },
    secondary: {
      big3Subtitle: "三主+次限",
      structureDecodeSubtitle: "次限→本命",
      rhythmLayerSubtitle: "五联+年",
      todayRefSubtitle: "今≠次限",
    },
    tertiary: {
      big3Subtitle: "三主+三限",
      structureDecodeSubtitle: "三限→本命",
      rhythmLayerSubtitle: "五联+窗",
      todayRefSubtitle: "今+窗",
    },
    solar_return: {
      big3Subtitle: "三主+日返",
      structureDecodeSubtitle: "年·一生",
      rhythmLayerSubtitle: "五联+返",
      todayRefSubtitle: "今≠年",
    },
    lunar_return: {
      big3Subtitle: "三主+月返",
      structureDecodeSubtitle: "短·长",
      rhythmLayerSubtitle: "五联+月",
      todayRefSubtitle: "今↔月返",
    },
  },
};
