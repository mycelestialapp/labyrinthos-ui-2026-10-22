/**
 * 星象简读全文（导师向）：12 太阳 / 12 月亮 / 12 上升 / 12 关系镜像 + 动态元素 / 模式（基本·固定·变动）与组装。
 * 风格对齐 docs/NATAL_READING_FULL_EXAMPLE_ZH.md；不替代医学/法律咨询。
 */

import { type NatalBig3, type ZodiacKey, ZODIAC_CN } from "./natal-chart";
import {
  WORKSPACE_SUN_CARD_ZH,
  WORKSPACE_MOON_CARD_ZH,
  WORKSPACE_RISING_CARD_ZH,
  WORKSPACE_MIRROR_LINE_ZH,
  descendantLabelZh,
} from "./astro-workspace-shortcards-zh";
import {
  type ElementKind,
  type ModalityKind,
  ELEMENT_TRIPLET_NARRATIVE,
  MODALITY_TRIPLET_NARRATIVE,
  elementModalityBridgeVariant,
  triadElementKey,
  triadModalityKey,
} from "./natal-reading-synthesis-zh";
import { getLegacyAstrologySeedBySun } from "./legacy-astrology-seed-zh";

type Element = "fire" | "earth" | "air" | "water";

function elementOf(key: ZodiacKey): Element {
  const f: ZodiacKey[] = ["ARIES", "LEO", "SAGITTARIUS"];
  const e: ZodiacKey[] = ["TAURUS", "VIRGO", "CAPRICORN"];
  const a: ZodiacKey[] = ["GEMINI", "LIBRA", "AQUARIUS"];
  if (f.includes(key)) return "fire";
  if (e.includes(key)) return "earth";
  if (a.includes(key)) return "air";
  return "water";
}

const ELEMENT_WORD: Record<Element, string> = {
  fire: "火象",
  earth: "土象",
  air: "风象",
  water: "水象",
};

/** 星座模式（与元素独立：谈「节奏/换挡」，不谈宫位细读） */
type Modality = "cardinal" | "fixed" | "mutable";

function modalityOf(key: ZodiacKey): Modality {
  const cardinal: ZodiacKey[] = ["ARIES", "CANCER", "LIBRA", "CAPRICORN"];
  const fixed: ZodiacKey[] = ["TAURUS", "LEO", "SCORPIO", "AQUARIUS"];
  if (cardinal.includes(key)) return "cardinal";
  if (fixed.includes(key)) return "fixed";
  return "mutable";
}

const MODALITY_WORD: Record<Modality, string> = {
  cardinal: "基本宫",
  fixed: "固定宫",
  mutable: "变动宫",
};

function elementModalityLabel(key: ZodiacKey): string {
  return `${ELEMENT_WORD[elementOf(key)]}·${MODALITY_WORD[modalityOf(key)]}`;
}

/** 上升 ⇄ 下降（对宫） */
const DESCENDANT: Record<ZodiacKey, ZodiacKey> = {
  ARIES: "LIBRA",
  TAURUS: "SCORPIO",
  GEMINI: "SAGITTARIUS",
  CANCER: "CAPRICORN",
  LEO: "AQUARIUS",
  VIRGO: "PISCES",
  LIBRA: "ARIES",
  SCORPIO: "TAURUS",
  SAGITTARIUS: "GEMINI",
  CAPRICORN: "CANCER",
  AQUARIUS: "LEO",
  PISCES: "VIRGO",
};

// --- 太阳：十二段（与定稿示例同级：建筑师式叙事 + 检修句） ---

const SUN_BODY: Record<ZodiacKey, string> = {
  ARIES: `你是**开路者**。自尊来自「我敢先走一步」，厌恶被晾在原地与无休止的迂回。

你习惯用冲劲破冰，却也可能把「快」当成唯一正义。

但请记住：真正的勇敢包含**收刀**——知道何时该停、该修、该认错，路才走得远。`,

  TAURUS: `你是**沉淀者**。自尊来自可触摸的积累：身体、资源、品味与信任，讨厌空转与朝令夕改。

你要的是**慢而实**，却也容易把「不变」误当成「安全」。

但请记住：土壤也需要翻耕——**适度的变**，不是背叛，是让生活继续肥沃。`,

  GEMINI: `你是**连接者**。自尊来自「我把事说清、把人连上」，怕无聊甚于怕难。

你用信息与视角组织世界，却也可能停在无数开头。

但请记住：**深**与**广**可以并存——选一条路走深，不是否定你的灵，而是给灵一个家。`,

  CANCER: `你是**守护者**。自尊来自「我护住了谁、守住了家」，情绪与记忆常比道理先响。

你愿意给温柔，却也要警惕**裹挟**与**委屈换停留**。

但请记住：**边界内的温柔**才是巢穴；没有边界的温柔，会变成彼此的债。`,

  LEO: `你是**点灯者**。自尊来自磊落与被正当看见——光不是虚荣，是存在的确认。

你愿大方给，却也可能在「没被看见」时一下子暗下去。

但请记住：光也能**照见他人**；舞台共享时，你的光更稳、更久。`,

  VIRGO: `你是**精进者**。自尊来自「有用、干净、到位」，细节常是你的信仰。

你服务世界，却也可能把自己榨成工具。

但请记住：**完成比完美重要**；检修包括允许自己不必时刻正确。`,

  LIBRA: `你是**衡平者**。自尊来自关系里的正义与美感，讨厌单边失衡与粗鄙。

你擅长周旋，却也可能把「和谐」当成逃避。

但请记住：**不讨喜的真话**有时比漂亮的平衡更养人。`,

  SCORPIO: `你是**转化者**。自尊来自穿透与真实，浅表寒暄对你近乎浪费生命。

你要么深，要么收，却也可能把控制误当成爱。

但请记住：力量可用于**疗愈**；松手有时是更深的拥有。`,

  SAGITTARIUS: `你是**远行信者**。自尊来自自由、信念与更宽的视野，闷与窄会逼你逃向抽象。

你怕被困住，却也可能用「意义」逃避当下。

但请记住：**落地与承诺**让远方不是借口，而是方向。`,

  CAPRICORN: `你是**人生建筑师**。

自尊来自实打实的成果与责任，来自那句「**交给他，稳了**」。你厌恶空转，也厌恶只有情绪、没有落点的关系。

你习惯说「我能扛」。

但请记住：再坚固的结构也需要检修。情绪值得被安放、被休息——否则你守住的「架子」，会先把你掏空。`,

  AQUARIUS: `你是**理念者**。自尊来自原则与群体之善，常走在人情前半步。

你怕庸俗同化，却也可能把疏离当成清高。

但请记住：理念落地时，仍握得住**具体的人的温度**，才叫成熟。`,

  PISCES: `你是**融梦者**。自尊来自悲悯、想象与一体感，边界常柔软。

你易共情，却也要警惕把**逃避**包装成**通透**。

但请记住：**慈悲先给自己**；有边界的善，才能长久。`,
};

const SUN_TAGLINE: Record<ZodiacKey, string> = {
  ARIES: "人生内核：开路与勇气",
  TAURUS: "人生内核：可累积的实在",
  GEMINI: "人生内核：连接与命名",
  CANCER: "人生内核：护与归",
  LEO: "人生内核：磊落与光",
  VIRGO: "人生内核：服务与精进",
  LIBRA: "人生内核：正义与美感",
  SCORPIO: "人生内核：穿透与转化",
  SAGITTARIUS: "人生内核：信与远方",
  CAPRICORN: "人生内核：可沉淀的作品",
  AQUARIUS: "人生内核：理念与群体",
  PISCES: "人生内核：悲悯与边界",
};

function resolvedSunBody(key: ZodiacKey): string {
  const legacy = getLegacyAstrologySeedBySun(key);
  return legacy ?? SUN_BODY[key];
}

// --- 月亮：十二段 ---

const MOON_BODY: Record<ZodiacKey, string> = {
  ARIES: `情绪要**热度与即时回应**；被冷落或拖延时，容易用「冲一下」确认自己还在场。

你不是爱吵架，而是怕**自己不存在于关系里**。学会区分：**愤怒是信号，不是策略**——先命名「我哪里被忽略了」，再决定要不要开火。

温柔对你而言，有时是**敢慢下来**；慢不是怂，是给心一个不靠肾上腺素活着的机会。`,

  TAURUS: `心里要**踏实、可触摸的安稳**；节奏被打乱，往往比道理不对更伤你。

滋养常来自规律、身体与味觉；变动来临时，给自己**缓冲期**，比立刻「想通」更重要。

别用「我不在乎」硬扛——你在乎得很具体：**可预期的陪伴、可触摸的承诺**。说出来，不是矫情，是自救。`,

  GEMINI: `心里要**想得通、聊得开**；信息卡壳时，情绪最先起雾。

换视角有时是自救，也是逃避——试着在**一个议题上停久一点**，让感受落地，而不是永远飘在下一句话里。

你需要被听懂，也需要**听见自己**——否则你会在无数对话里，仍然觉得孤单。`,

  CANCER: `安全感不最先长在数字上，而长在细节里：谁把你当自己人、谁会留灯等你、谁记得你的小喜好。

你一眼就能看出谁在装、谁在硬撑——这不是玄学，是你长期读气氛练出来的直觉。

比起被说服，你更需要被懂得。

温柔要有边界。别用过度照顾换「被需要」的资格，也别用默默委屈换停留。好好爱自己，才是巢穴的根基。`,

  LEO: `心里要**尊严与温度并存**；怕被敷衍、怕被当背景。

你愿意给，也希望那份给被看见——**被珍惜**是你的止血棉。

真正的骄傲，不是永远不倒，而是倒下去后仍愿意**为自己点灯**。`,

  VIRGO: `情绪常落在「有没有用、该不该」；自我苛责若过头，会把关心拧成挑剔。

你帮别人很利落，对自己却常**欠一句好话**。

练习一句：**我已经够好了，今天到此为止。** 检修包括允许房间乱一次、允许计划偏一次。`,

  LIBRA: `心里要**公平与美感**；关系失衡时最难睡。

你擅长斡旋，别忘了问：**我自己究竟想要什么。** 长期只说「都行」，最后会变成**内伤**。

温柔要有牙齿——**体面地拒绝**，也是爱自己的方式。`,

  SCORPIO: `感受深、记性好；信任与背叛的刻度极锋利。

你要么全给，要么全收；中间态常让你更难受。

疗愈常需先承认**恨意与欲望**——它们不是污点，是未被听见的自己。`,

  SAGITTARIUS: `心里要**空间与意义**；闷与窄会逼你逃向远方或大道理。

幽默有时是盾，也可能是**未完成的悲伤**的出口。

你需要的未必是更大的世界，有时是**更真的当下**——让脚落回地面，心才不会一直逃票。`,

  CAPRICORN: `情绪习惯往责任里塞；难过也常包装成「还能扛」。

你怕一松手就塌，却忘了**人不是结构**。

你需要的，有时是**允许自己不必有用**——只是存在，也值得被接住。`,

  AQUARIUS: `心里要**距离与清醒**；太近窒息，太远又空。

**友谊式亲密**往往比黏腻依赖更让你安心。

理念是你的骨，人情是你的皮——别为了「正确」把皮撕掉，也别为了「合群」把骨打折。`,

  PISCES: `共情像潮水，易吞没边界；艺术与梦是泄洪口。

你易替人疼、替人扛，却常**忘了自己的岸在哪**。

落地与拒绝，是你长期的功课——**先上岸，再救人。** 慈悲若没有边界，会变成彼此的溺水。`,
};

const MOON_TAGLINE: Record<ZodiacKey, string> = {
  ARIES: "情绪底色：热度与在场",
  TAURUS: "情绪底色：安稳与节奏",
  GEMINI: "情绪底色：信息与表达",
  CANCER: "情绪底色：安全感藏在「被懂得」里",
  LEO: "情绪底色：尊严与温度",
  VIRGO: "情绪底色：有用与自洽",
  LIBRA: "情绪底色：公平与美感",
  SCORPIO: "情绪底色：深流与记忆",
  SAGITTARIUS: "情绪底色：空间与意义",
  CAPRICORN: "情绪底色：责任与自持",
  AQUARIUS: "情绪底色：距离与清醒",
  PISCES: "情绪底色：共情与边界",
};

// --- 上升：十二段 ---

const RISING_BODY: Record<ZodiacKey, string> = {
  ARIES: `你进场合，常**先动后想**——用行动占位，再补逻辑。最耗你的是被晾在空转里。

别人看你冲，你往往只是在**抢回主动权**；抢到了，才安心谈细节。

压力下你可能变硬、变冲；那不是只有鲁莽，有时是**怕来不及**。你需要的是**可验证的小赢**，而不是无限等待。`,

  TAURUS: `你给外界**稳、慢、可预期**的第一印象；身体感与「可持续」先于口号。

信任一旦建立，你愿意长期扛；被催逼时，你会**沉默式抵抗**——不是懒，是**节律被踩**。

你需要的是**被尊重的节奏**，而不是被推着证明「你还行」。`,

  GEMINI: `你习惯**先说话、先连人、先命名局面**；闷局与无话可接，最让你慌。

外在轻快，内里可能已在飞速运算——记得给自己**静音分钟**，否则脑内剧场会通宵排戏。

你需要**信息流动**，也需要**一个能停下来的锚**——否则你会永远「在聊」，却很难「在」。`,

  CANCER: `外在常带**护壳**：读空气、护短、察言观色来得快。

被粗暴推开时，你会先缩回安全距离；那不是冷，是**自保**。

真正让你累的，往往不是事，是**气氛里的刺**。学会命名「我受伤了」，比硬撑体面更养人。`,

  LEO: `你在意**台面与骨气**；宁可吃亏也不愿被轻看。

你愿意给光，也希望光**照在值得的地方**；被当背景时，你会一下子暗下去。

真正的软肋，往往藏在**骄傲后面**——允许被看见脆弱，是另一种强。`,

  VIRGO: `外在**克制、重条理**；混乱与不可验证的承诺，易触发焦虑。

你先把自己收拾利落再出场——有时也别忘了**粗糙一点也能活**。

别人看你挑剔，你往往只是在**降低失控感**；你需要的是**可控的一小步**，而不是完美的全世界。`,

  LIBRA: `你用**体面与协商**缓冲冲突，讨厌硬撕。

长期只周旋不落地，内里会积压**未说清的委屈**——最后爆发时，别人还觉得「你突然」。

你需要的是**敢表态的温柔**，而不是永远漂亮的和稀泥。`,

  SCORPIO: `第一印象常带**紧度与探测**；信任要么不给，要给就偏彻底。

你讨厌浅，也讨厌假；一旦投入，就希望**看见底**。

背叛感一旦被点燃，很难装作没发生——**修复需要命名与时间。** 沉默不是酷，有时是**伤口在发炎**。`,

  SAGITTARIUS: `你愿**撑开场面、说明白话**；远景先于细抠。

琐碎纠缠无止尽时，你会想**换跑道**——先问：是环境糟，还是你在逃。

你需要**意义感**，也需要**把小事做完的肌肉**——否则远方永远像借口。`,

  CAPRICORN: `外在**收敛、先承重**；情绪常压进责任里再说。

别人看你冷硬时，你往往只是在**守底线与进度**。

你需要的不是更多夸奖，而是**被承认：你已经扛了很久**。`,

  AQUARIUS: `你给人**抽离、讲原则**感；真正在乎的多是**理念与自由是否被尊重**。

人情与公理冲突时，你会痛，但仍会**选边**——那不是冷血，是**骨头的位置**。

你也需要**具体的人的温度**；理念若永远不落回生活，会变成**漂亮的孤岛**。`,

  PISCES: `你像一块**情绪海绵**。进陌生场合，先融入氛围、读懂潜台词，再慢慢亮出立场。别人看你软，你往往只是把硬，留给真正重要的人与事。

压力下的「算了」，多半是过载前的自保，不是懦弱。

你需要睡眠、独处，和一件能慢慢完成的小事——它们是锚，帮你从别人的情绪里抽离，不被洪流卷走。`,
};

const RISING_TAGLINE: Record<ZodiacKey, string> = {
  ARIES: "外在名片：先动后占",
  TAURUS: "外在名片：稳与慢热",
  GEMINI: "外在名片：连接与轻快",
  CANCER: "外在名片：护壳与读空气",
  LEO: "外在名片：台面与骨气",
  VIRGO: "外在名片：克制与条理",
  LIBRA: "外在名片：体面与协商",
  SCORPIO: "外在名片：紧度与探测",
  SAGITTARIUS: "外在名片：撑开与直白",
  CAPRICORN: "外在名片：收敛与承重",
  AQUARIUS: "外在名片：抽离与原则",
  PISCES: "外在名片：温柔是铠甲，不是软肋",
};

// --- 关系镜像：按上升星座（对宫为下降）---

const MIRROR_BODY: Record<ZodiacKey, string> = {
  ARIES: `你直给、先占位，容易在关系里**急着要结果**。下降天秤在对面提醒你：长久需要**互惠、协商与留白**——不是委屈自己讨好，而是**把「我们」摆进同一张桌**。

你怕慢，但关系偏偏需要**来回**；学会等一等对方的节奏，不等于认输。

真正属于你的亲密，是**敢提需求、也听得进「不」**——那是平等，不是战争。`,

  TAURUS: `你要稳、要可预期，讨厌被催被掀桌。下降天蝎提醒你：真亲密离不开**信任的深度与共同的秘密功课**——包括谈钱、谈性、谈恐惧，而不是只停在舒适区。

你怕失控，但爱若永远「安全到无聊」，心会先饿。

真正属于你的亲密，是**慢，但能见底**——身体与承诺同样重要。`,

  GEMINI: `你轻快、怕闷，关系里易**浮在话题层**。下降射手提醒你：若没有**共同信念与远方**，再热闹也会散；需要一起相信点什么，一起走一段路。

你怕沉重，但逃避沉重不等于轻盈——有时只是**悬空**。

真正属于你的亲密，是**聊得来，也走得下去**——废话与誓言可以并存。`,

  CANCER: `你护短、重巢穴，易把**照顾当控制**或把**委屈当筹码**。下降摩羯提醒你：关系也要**可执行、可成长**——责任分工、长期规划，不是冷漠，是给彼此安全感。

你要的是家，不是牢；**规则与温柔**可以一起存在。

真正属于你的巢穴，是**说清需要、也扛得起现实**——不是单方面牺牲。`,

  LEO: `你要被看见、要体面，易在关系里**争一口气**。下降水瓶提醒你：伴侣也是**独立的人**，需要空间与理念尊重——爱不是驯服，是并肩。

你怕黯淡，但把对方的光掐灭，并不会让你更亮。

真正属于你的舞台，是**两个人都能发光**——共享掌声，而不是独占镜头。`,

  VIRGO: `你重细节、易挑剔，关系里常**越帮越累**。下降双鱼提醒你：**悲悯与原谅**同样是爱的语法；有时松手与相信，比纠正更有效。

你要的是更好，不是更累——**改进**若变成审判，爱会先碎。

真正属于你的亲密，是**细节里有温度**，而不是细节里有刀。`,

  LIBRA: `你要和谐、怕冲突，易**拖延表态**。下降白羊提醒你：关系也需要**直球与勇气**——温和不是永远说行，而是敢说「我要」。

你怕撕破脸，但长期含糊，最后往往**更伤**。

真正属于你的平衡，是**敢吵架、也能和好**——不是没有冲突，而是冲突能被接住。`,

  SCORPIO: `你要深、要绝对，易在关系里**全有或全无**。下降金牛提醒你：长久靠**身体感、耐心与可累积的信任**——慢，反而是深。

你怕浅，但也怕**被看穿后仍不被选择**。

真正属于你的亲密，是**日复一日的小可靠**——不炫，但沉。`,

  SAGITTARIUS: `你要自由、怕绑死，易**用远方逃避当下**。下降双子提醒你：亲密也需要**日常对话与信息同步**——不是监控，是仍在同一频道。

你怕闷，但关系若只剩「理念」，会**越来越像室友**。

真正属于你的远方，是**两个人一起把日子说清**——不是一个人先逃。`,

  CAPRICORN: `你收敛、重责任，关系里易**只谈事不谈心**。下降巨蟹提醒你：**巢穴与照料**不可少；柔软不是软弱，是让人敢留下来。

你怕乱，但心若永远「项目管理」，人会**越走越远**。

真正属于你的长期关系，是**扛得住事，也接得住泪**——结构与温度并存。`,

  AQUARIUS: `你重理念、要空间，易**把人聊成概念**。下降狮子提醒你：爱需要**被看见、被庆祝**——偶尔的台面与热情，是关系的阳光。

你怕庸俗，但**冷漠**不是高级，只是**隔离**。

真正属于你的连接，是**理念落地在具体的人身上**——原则与拥抱可以同框。`,

  PISCES: `你在关系里重氛围、爱融合，容易把边界说糊。

下降处女在轴的另一端提醒你：长久亲密，不只靠感觉，也靠**具体的偏爱**。记得喜好、分清责任、愿意一起改进——把细节当成**爱的语法**，而不是把对方当项目表。

你不敢提要求，有时不是大度，是怕一提人就走。

但真正属于你的巢穴，是**边界清楚的温柔**，不是无限委曲的共情。`,
};

/** 固定块：读前须知（Markdown） */
export const NATAL_READING_NOTICE_ZH = `## 读前须知（约 30 秒）

这不是算命，是你出生时刻的**几何快照**。

不恐吓未来，不包装成预言；这里是温和的自我观察，**不替代**心理咨询与医学判断。

这里只拆解三件事：你习惯如何面对世界（**上升**）、内心情绪如何起伏（**月亮**）、潜意识里想活成什么样（**太阳**）。

每颗星旁会标注**元素**与**模式（基本宫 / 固定宫 / 变动宫）**——帮你感受「节奏与换挡」。

帮你读懂**感受从哪来**，而不是给你贴终身标签。`;

/** 金卡 / 移动端默认：极短读前 */
const NATAL_READING_NOTICE_COMPACT = `## 读前须知

**几何快照**，不是算命预言；不恐吓未来，也不替你决定人生。这里只用**日月升**三件事：**怎么出场、情绪靠什么起落、心里最想活成谁**。`;

/** 金卡默认：极短口径 */
const NATAL_READING_DISCLAIMER_COMPACT = `## 五、口径说明

热带黄道（回归黄道）；上升最吃**出生时间地点**；**星图是地图，不是判决书**。`;

/** 五、口径说明（全局固定） */
export const NATAL_READING_DISCLAIMER_ZH = `## 五、口径说明

- **黄道**：热带黄道（回归黄道）。与恒星盘、印度盘不是同一套口径，勿混用「偏移」来吓人。  
- **误差**：上升与下降最吃出生时辰与经纬——时间不准，最先晃动的就是这条轴。  
- **原则**：**星图是地图，不是判决书**。不夸大星象，不把性格说成命运。`;

/** 收尾里「愿你…」随三主星变化（太阳=长期认领，月亮=心里要守住，上升=与世界交手的方式） */
const CLOSING_SUN: Record<ZodiacKey, string> = {
  ARIES: "开路勇气",
  TAURUS: "慢火实在",
  GEMINI: "灵与连接",
  CANCER: "护与归属",
  LEO: "磊落光亮",
  VIRGO: "精进自持",
  LIBRA: "公道美感",
  SCORPIO: "深与转化",
  SAGITTARIUS: "信步远方",
  CAPRICORN: "担当交代",
  AQUARIUS: "原则清醒",
  PISCES: "悲悯柔软",
};

const CLOSING_MOON: Record<ZodiacKey, string> = {
  ARIES: "在场与热度",
  TAURUS: "安稳节奏",
  GEMINI: "想通与诉说",
  CANCER: "懂得与被护",
  LEO: "被看见的尊严",
  VIRGO: "检修与自洽",
  LIBRA: "公平与体面",
  SCORPIO: "诚实愈合",
  SAGITTARIUS: "空间与意义",
  CAPRICORN: "扛得住也歇得下",
  AQUARIUS: "距离与自重",
  PISCES: "边界与慈悲",
};

const CLOSING_RISING: Record<ZodiacKey, string> = {
  ARIES: "先动后想的胆",
  TAURUS: "稳的底色",
  GEMINI: "命名与连接",
  CANCER: "护短的温度",
  LEO: "骨气的台面",
  VIRGO: "克制的条理",
  LIBRA: "体面的协商",
  SCORPIO: "探测的真心",
  SAGITTARIUS: "敞开的白话",
  CAPRICORN: "承重的边界",
  AQUARIUS: "抽离的原则",
  PISCES: "温柔的铠甲",
};

/** 多段正文只取首段，用于精简版 */
function firstNarrativeBlock(text: string): string {
  const parts = text
    .trim()
    .split(/\n\n+/)
    .map((x) => x.trim())
    .filter(Boolean);
  return parts[0] ?? text.trim();
}

function sectionOneCompact(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  return `## 一、三主星（速览）

### ☉ 太阳·${ZODIAC_CN[s]}（${elementModalityLabel(s)}）｜${SUN_TAGLINE[s]}

${firstNarrativeBlock(resolvedSunBody(s))}

### ☽ 月亮·${ZODIAC_CN[m]}（${elementModalityLabel(m)}）｜${MOON_TAGLINE[m]}

${firstNarrativeBlock(MOON_BODY[m])}

### ↑ 上升·${ZODIAC_CN[r]}（${elementModalityLabel(r)}）｜${RISING_TAGLINE[r]}

${firstNarrativeBlock(RISING_BODY[r])}`;
}

function sectionTwoCompact(big3: NatalBig3): string {
  const r = big3.rising;
  const d = DESCENDANT[r];
  return `## 二、关系镜像：上升${ZODIAC_CN[r]} ⇄ 下降${ZODIAC_CN[d]}

${firstNarrativeBlock(MIRROR_BODY[r])}`;
}

function sectionThreeCompact(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  const es = elementOf(s) as ElementKind;
  const em = elementOf(m) as ElementKind;
  const er = elementOf(r) as ElementKind;
  const ek = triadElementKey(es, em, er);
  const ms = modalityOf(s) as ModalityKind;
  const mm = modalityOf(m) as ModalityKind;
  const mr = modalityOf(r) as ModalityKind;
  const mk = triadModalityKey(ms, mm, mr);
  const et =
    ELEMENT_TRIPLET_NARRATIVE[ek] ??
    `你的日、月、升元素组合较罕见，以第一节为准；张力可当资源慢慢用。`;
  const mt =
    MODALITY_TRIPLET_NARRATIVE[mk] ?? `你的模式三联以第一节为准；换挡比贴标签重要。`;
  const cnS = ZODIAC_CN[s];
  const cnM = ZODIAC_CN[m];
  const cnR = ZODIAC_CN[r];
  return `## 三、元素与模式（要点）

${et}

${mt}

**顺序口诀**：先${cnR}（场面）→ 再${cnM}（感受）→ 后${cnS}（长期认领）。`;
}

function sectionThirtyCompact(big3: NatalBig3): string {
  const r = big3.rising;
  const m = big3.moon;
  const s = big3.sun;
  return `## 四、三十日（各一条）

**1–10 天 · 升${ZODIAC_CN[r]}** ${THIRTY_RISING[r]}

**11–20 天 · 月${ZODIAC_CN[m]}** ${THIRTY_MOON[m]}

**21–30 天 · 日${ZODIAC_CN[s]}** ${THIRTY_SUN[s]}`;
}

function sectionClosingCompact(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  const cnS = ZODIAC_CN[s];
  const cnM = ZODIAC_CN[m];
  const cnR = ZODIAC_CN[r];
  return `---

## 收尾

坐标在这里，怎么活仍是你。**太阳${cnS} · 月亮${cnM} · 上升${cnR}**——愿你拿得稳、也放得下；不必活成标准答案。`;
}

function sectionClosing(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  const cnS = ZODIAC_CN[s];
  const cnM = ZODIAC_CN[m];
  const cnR = ZODIAC_CN[r];
  return `---

## 收尾

星象帮你看清坐标；怎么活，仍是你的工程。

愿你以太阳${cnS}的**${CLOSING_SUN[s]}**锚定长远，以月亮${cnM}的**${CLOSING_MOON[m]}**安顿内心，也以${cnR}式的**${CLOSING_RISING[r]}**与世界交手。

但不必活成任何人写的标准答案。`;
}

function layerOsParagraph(big3: NatalBig3): string {
  const cnS = ZODIAC_CN[big3.sun];
  const cnM = ZODIAC_CN[big3.moon];
  const cnR = ZODIAC_CN[big3.rising];
  return `### 分层操作系统（同名三颗星）

你不是乱七八糟的矛盾体，而是一条常见链：**先以${cnR}在场面立足 → 再以${cnM}处理感受与安全感 → 最后用${cnS}决定你要长期成为谁**——这是顺序，不是审判。

**硬壳护软心**，才是顶级智慧。`;
}

function sectionThree(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  const es = elementOf(s) as ElementKind;
  const em = elementOf(m) as ElementKind;
  const er = elementOf(r) as ElementKind;
  const ek = triadElementKey(es, em, er);
  const ms = modalityOf(s) as ModalityKind;
  const mm = modalityOf(m) as ModalityKind;
  const mr = modalityOf(r) as ModalityKind;
  const mk = triadModalityKey(ms, mm, mr);
  const et =
    ELEMENT_TRIPLET_NARRATIVE[ek] ??
    `你的日、月、升元素组合（${ek}）较罕见，以第一节三主星正文为准；张力可当作**待开发的资源**，不必急着消灭。`;
  const mt =
    MODALITY_TRIPLET_NARRATIVE[mk] ??
    `你的模式三联（${mk}）以第一节正文为准；换挡比贴标签重要。`;

  return `## 三、元素与模式速写 & 底层逻辑

第一节已写明各星的**元素 · 模式**与长文；此处不再重复列星座表，只读**三联怎么拧在一起**（手机阅读更短）。

### 元素三联张力（日 → 月 → 升）

${et}

### 模式三联张力（日 → 月 → 升）

${mt}

${elementModalityBridgeVariant(es, em, er)}

${layerOsParagraph(big3)}`;
}

/** 第 1–10 天：练「出场方式」（随上升） */
const THIRTY_RISING: Record<ZodiacKey, string> = {
  ARIES: `每天一次：开口前**停三秒**，把「冲」换成「说清楚」。记下一句你其实可以不说、却偏要抢先的话。`,
  TAURUS: `选一件小事**故意慢半拍**（回复、表态、改计划），观察焦虑从哪来——那是你的节律在说话。`,
  GEMINI: `每天留 **10 分钟静音**：不刷信息、不接话，只写三行「此刻真实感受」。练「在」比练「聊」更重要。`,
  CANCER: `进场合先问自己：**我在护谁、躲谁**？把一次「算了」改写成「我其实需要 ___」。`,
  LEO: `允许一次**不漂亮**：衣着、表达或场面。记下事后世界有没有塌——你的价值不靠永远发光证明。`,
  VIRGO: `每天选一件可做 **60 分就放行** 的事；完成比完美先到，算你赢。`,
  LIBRA: `练习一次**不讨好的拒绝**（很小即可）。把「怕撕破脸」写下来，再写一句你真正想守的边界。`,
  SCORPIO: `当你想「全有或全无」时，先写：**最坏真相是什么、我希望被怎样接住**。深不必等于绝。`,
  SAGITTARIUS: `把一句大话换成**一件当天能做完的小事**。远方从脚下这一格开始。`,
  CAPRICORN: `每天收工前写：**今天哪件责任其实可以移交或删减**。扛得住也要扛得聪明。`,
  AQUARIUS: `选一次**先谈感受再谈道理**（对在乎的人）。理念与温度并表，不算降智。`,
  PISCES: `设一个**每日硬边界**（时间/人/事）。过载时说「我现在需要停」，练一次不内疚。`,
};

/** 第 11–20 天：练「情绪与安全」（随月亮） */
const THIRTY_MOON: Record<ZodiacKey, string> = {
  ARIES: `记下三次「突然上火」的**前一秒**发生了什么。对镜子说一句：「我在，我可以慢一点。」`,
  TAURUS: `列三张**让你安心的清单**（食物、声音、人、地方）。打乱一项小节奏后，用清单里的一项把自己接回来。`,
  GEMINI: `情绪起时先**命名**：是闷、是慌、还是委屈？写下来再给任何人发长语音。`,
  CANCER: `每天记录一件**小事里的被懂得/被忽略**。选一天，把其中一条清楚告诉对方。`,
  LEO: `记下三次「**没被看见**就难受」的时刻。补一句自我确认：「我的光不依赖每一次掌声。」`,
  VIRGO: `把一句内心批评改成：**「我已经做到 ___，够了。」** 写满十天，看看苛责从哪来。`,
  LIBRA: `每天问：**我今天讨好谁了**？把一次「都行」换成「我要 ___」。`,
  SCORPIO: `写一封**不寄出的信**给让你耿耿于怀的人或事。烧掉或删掉前，读一遍，然后做一件善待身体的事。`,
  SAGITTARIUS: `闷的时候，先**散步或拉伸**，再决定要不要逃向大道理或新计划。`,
  CAPRICORN: `每晚写一句：**「今天我不必有用的事是 ___。」** 允许无用，是修复。`,
  AQUARIUS: `当你想抽离时，问：**我是在冷静，还是在逃**。选一次留下，把一句真话说完。`,
  PISCES: `共情上头时设**闹钟 5 分钟**：到点问自己，这是谁的痛？做一件把你带回身体的事（水、睡眠、走路）。`,
};

/** 第 21–30 天：练「长期认领」（随太阳） */
const THIRTY_SUN: Record<ZodiacKey, string> = {
  ARIES: `选一件你一直拖的「**第一步**」，只做开头 15 分钟。开跑比完美重要。`,
  TAURUS: `启动一个 **30 天可见的小积累**（钱、身体、技能三选一），每天只记一笔，不断更。`,
  GEMINI: `把飘着的三个想法**钉成一个可交付**：截止日 + 验收标准。交付一次，再谈下一个。`,
  CANCER: `为你的「**护**」设边界：这周护好一个人或一件事即可，其余允许暂时不圆满。`,
  LEO: `做一件**不为展示、只为真心**的小事。记下你做时是否仍感到充实。`,
  VIRGO: `选一条**长期标准**降一级试行一周：看看失控有没有发生，还是你更轻松了。`,
  LIBRA: `在关系或合作里**主动提议一次**（吃什么、怎么分工、何时谈），练习当半个主心骨。`,
  SCORPIO: `结束一件**拖太久的消耗**（关系、项目、心结）：命名它，设终点，做一次仪式性的告别。`,
  SAGITTARIUS: `把「意义」写成**一张可执行的周计划**：信念要落在日程格里，才算落地。`,
  CAPRICORN: `分清 **「值得扛」与「面子扛」**：选一件后者，正式允许自己不做，并写下替代方案（休息也算）。`,
  AQUARIUS: `选一条你愿意公开坚持的**小原则**（环保、时间、诚实等），用 10 天小行动对齐它。`,
  PISCES: `每天留 **15 分钟给创作或灵性**，但不牺牲睡眠。慈悲先给肉身，再给世界。`,
};

function sectionThirty(big3: NatalBig3): string {
  const r = big3.rising;
  const m = big3.moon;
  const s = big3.sun;
  return `## 四、三十日极简行动

**第 1–10 天 · 上升${ZODIAC_CN[r]}**  
${THIRTY_RISING[r]}

**第 11–20 天 · 月亮${ZODIAC_CN[m]}**  
${THIRTY_MOON[m]}

**第 21–30 天 · 太阳${ZODIAC_CN[s]}**  
${THIRTY_SUN[s]}`;
}

function sectionOne(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  return `## 一、三主星：你的三层自我

### ☉ 太阳·${ZODIAC_CN[s]}（${elementModalityLabel(s)}）｜${SUN_TAGLINE[s]}

${resolvedSunBody(s)}

### ☽ 月亮·${ZODIAC_CN[m]}（${elementModalityLabel(m)}）｜${MOON_TAGLINE[m]}

${MOON_BODY[m]}

### ↑ 上升·${ZODIAC_CN[r]}（${elementModalityLabel(r)}）｜${RISING_TAGLINE[r]}

${RISING_BODY[r]}`;
}

function sectionTwo(big3: NatalBig3): string {
  const r = big3.rising;
  const d = DESCENDANT[r];
  return `## 二、关系镜像：上升${ZODIAC_CN[r]} ⇄ 下降${ZODIAC_CN[d]}

${MIRROR_BODY[r]}`;
}

export type NatalReadingFullOptions = {
  /** 例如 2026.03.23 */
  dateLine?: string;
  /** 是否输出案例行 */
  showCaseLine?: boolean;
};

/**
 * 生成完整星象简读 Markdown（与 docs/NATAL_READING_FULL_EXAMPLE_ZH.md 同源风格）。
 */
export function buildNatalReadingFullMarkdown(big3: NatalBig3, options: NatalReadingFullOptions = {}): string {
  const { dateLine = "", showCaseLine = true } = options;
  const head = `# 星象简读报告

> **星图是地图，不是刑期。**
`;
  const caseLine = showCaseLine
    ? `\n**案例**：太阳${ZODIAC_CN[big3.sun]} · 月亮${ZODIAC_CN[big3.moon]} · 上升${ZODIAC_CN[big3.rising]}（下降${ZODIAC_CN[DESCENDANT[big3.rising]]}）${dateLine ? `  \n**日期**：${dateLine}` : ""}\n`
    : "";

  return [
    head,
    caseLine,
    "---\n",
    NATAL_READING_NOTICE_ZH,
    "\n---\n",
    sectionOne(big3),
    "\n---\n",
    sectionTwo(big3),
    "\n---\n",
    sectionThree(big3),
    "\n---\n",
    sectionThirty(big3),
    "\n---\n",
    NATAL_READING_DISCLAIMER_ZH,
    "\n",
    sectionClosing(big3),
    "\n",
  ].join("\n");
}

const GOLD_CARD_SLICE = "## 读前须知";

/**
 * 精简版全文：金卡 / 移动端默认；约为完整版的 **1/3～1/4** 字数。
 * 完整导师版见 `buildNatalReadingFullMarkdown`（导出、归档、将来「全文」开关可用）。
 */
export function buildNatalReadingCompactMarkdown(big3: NatalBig3): string {
  return [
    `# 星象简读（精简版）\n\n> **星图是地图，不是刑期。**\n`,
    "---\n",
    NATAL_READING_NOTICE_COMPACT,
    "\n---\n",
    sectionOneCompact(big3),
    "\n---\n",
    sectionTwoCompact(big3),
    "\n---\n",
    sectionThreeCompact(big3),
    "\n---\n",
    sectionThirtyCompact(big3),
    "\n---\n",
    NATAL_READING_DISCLAIMER_COMPACT,
    "\n",
    sectionClosingCompact(big3),
    "\n",
  ].join("\n");
}

/**
 * 身份金卡内嵌：默认使用**精简版**；从「读前须知」起切片，避免与卡片顶部符号行重复。
 */
export function buildNatalReadingGoldCardMarkdown(big3: NatalBig3): string {
  const full = buildNatalReadingCompactMarkdown(big3);
  const i = full.indexOf(GOLD_CARD_SLICE);
  const body = i >= 0 ? full.slice(i).trimStart() : full.trim();
  return `> **星图是地图，不是刑期。**\n\n${body}`;
}

/**
 * 星历终端右侧「怎么理解这张盘」：**通俗短卡**（主流 App 式短句），与首页长读错层；算法同源（热带黄道）。
 */
export function buildAstroWorkspaceUnderstandMarkdown(big3: NatalBig3): string {
  const s = big3.sun;
  const m = big3.moon;
  const r = big3.rising;
  return `> **怎么读这一栏**：全是**大白话短句**，和首页长文不一样；算法一样（热带黄道），没有第二套盘。

## 先说一句

**太阳**：你长期在意啥。**月亮**：你情绪吃啥。**上升**：别人第一眼觉得你啥样。看完有个数就行，别当判决书。

---

## 太阳 · ${ZODIAC_CN[s]}

${WORKSPACE_SUN_CARD_ZH[s]}

---

## 月亮 · ${ZODIAC_CN[m]}

${WORKSPACE_MOON_CARD_ZH[m]}

---

## 上升 · ${ZODIAC_CN[r]}

${WORKSPACE_RISING_CARD_ZH[r]}

---

## 一对一 · 上升${ZODIAC_CN[r]} · 下降${descendantLabelZh(r)}

${WORKSPACE_MIRROR_LINE_ZH[r]}`;
}
