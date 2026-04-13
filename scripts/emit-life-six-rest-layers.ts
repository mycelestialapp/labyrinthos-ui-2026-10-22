/**
 * 生成生活六大类 6×20×156 条心理/灵性/行动/收束（与 freeze 牌序一致）。
 * 运行：esbuild 打包后 node（见 package.json tarot:life-six:emit-layers）。
 */
import * as fs from 'fs';
import * as path from 'path';
import { LIFE_SIX_VOICE_PACKS } from '../lib/tarot-life-six-voice-deck-zh';
import { LIFE_SIX_CAT_POOLS_1_5, type LifeSixRestCatPools } from './life-six-cat-pools-1-5';

const majors = [
  '愚者',
  '魔术师',
  '女祭司',
  '皇后',
  '皇帝',
  '教皇',
  '恋人',
  '战车',
  '力量',
  '隐士',
  '命运之轮',
  '正义',
  '倒吊人',
  '死神',
  '节制',
  '恶魔',
  '高塔',
  '星星',
  '月亮',
  '太阳',
  '审判',
  '世界',
];

const suitZh: Record<string, string> = {
  wands: '权杖',
  cups: '圣杯',
  swords: '宝剑',
  pentacles: '星币',
};
const suits = ['wands', 'cups', 'swords', 'pentacles'] as const;

function rankName(n: number): string {
  if (n === 1) return '王牌';
  if (n <= 10) return ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][n]!;
  if (n === 11) return '侍从';
  if (n === 12) return '骑士';
  if (n === 13) return '王后';
  if (n === 14) return '国王';
  return String(n);
}

function labelForSlot(slot: number): string {
  if (slot < 44) {
    const mi = Math.floor(slot / 2);
    const up = slot % 2 === 0;
    return `${majors[mi]!}${up ? '正位' : '逆位'}`;
  }
  const rest = slot - 44;
  const si = Math.floor(rest / 28);
  const r = rest % 28;
  const rank = Math.floor(r / 2) + 1;
  const up = r % 2 === 0;
  const sz = suitZh[suits[si]!]!;
  return `${sz}${rankName(rank)}${up ? '正位' : '逆位'}`;
}

/** 身体健康类专用：心理层名词（无学业/职场串味） */
const N_HEALTH = [
  '就医羞耻', '疑病', '侥幸心', '拖延复诊', '完美康复幻想', '孤独扛病', '信息过载', '对照恐惧',
  '身体背叛感', '失控感', '内疚（拖累家人）', '愤怒（对体制/对己）', '麻木', '疲惫', '睡眠债',
  '对检查的怕', '对确诊的怕', '对花钱的怕', '对麻烦的怕', '对丢脸的怕', '对「小题大做」标签的怕',
  '照护耗竭', '代际无力', '医患不信任', '偏方诱惑', '停药冲动', '加量冲动', '比较病情', '自责循环',
  '沉默成本', '求助羞耻', '被误解怕', '被抛弃怕（病重）', '选错医院怕', '浪费时间怕', '让家人失望怕',
  '不确定', '兴奋过头（乱试疗法）', '逃避', '依赖搜索', '过度负责', '摆烂冲动', '面子', '安全感',
  '身体报警', '家庭期待', '同辈健康比较', '规则陌生（医保流程）', '承诺恐惧（长期疗程）', '失败标签',
  '路径迷恋（单一神药）', '捷径幻想', '沟通回避（不对医生说实话）', '冲突恐惧', '平庸怕（恢复慢）',
  '指标洁癖', '复诊羞耻（怕浪费号）', '疼痛否认', '躯体化误读', '医保陌生焦虑', '急诊恐惧（怕小题大做）',
  '慢病倦怠', '家属期待压顶', '职业暴露耻感', '运动代偿执念', '营养教条', '疼痛比较', '药物污名',
];

const V_HEALTH = [
  '压住复查单', '放大搜索词条', '推迟预约', '偷换主题成情绪发泄', '偷换责任给「忙」', '让你失眠', '让你胃紧',
  '让你嘴硬（不说真症状）', '让你沉默（瞒家人）', '让你爆发（对医护）', '让你妥协（信偏方）', '让你反悔（乱停药）',
  '让你拖延量体温', '让你囤积截图不行动', '让你逃避面诊', '让你表演「我没事」', '让你孤立（不问人）',
  '让你依赖旁人断病', '让你怀疑正规治疗', '让你讨好医生不敢说清', '让你硬扛红线', '让你分神刷病例',
  '让你冲动换医院', '让你冻结在候诊椅', '让你过度解释症状像在辩护', '让你不敢问副作用', '让你不敢睡（怕一睡更糟）',
  '让你不敢停工作', '让你不敢选手术', '让你只信短视频', '让你只信直觉', '让你不信复查', '让你不信自己还能好',
  '让你误把忍当坚强', '让你误把拖当谨慎', '让你误把搜病当掌控', '让你误把熬当负责', '让你误把瞒当保护家人',
  '让你忘了写症状时间线', '让你忘了带药盒', '让你忘了问药物交互', '让你忘了备份化验', '让你忘了急诊红线',
  '让你忘了求助合法', '让你忘了小步也算赢', '让你忘了睡完再决定', '让你忘了写清再吵家庭分工',
  '让你把红线症状说成「老毛病」', '让你把复诊拖成「等有空那一周」', '让你把第二意见想成背叛主治',
  '让你把互联网问诊当终审却不传化验', '让你把疼痛阈值当道德考试', '让你把家属分工吵成自尊战',
  '让你把运动打卡当治疗替代医嘱', '让你把忌口清单执行成自我惩罚',
];

const MIND_HEALTH = [
  '像一口气堵在胸口：想查又怕查，想睡又睡不着。',
  '像脑子里同时开着搜索页、工作群和家人语音，没有一个能关。',
  '像明知该预约，却先刷半小时「别人是不是也这样」。',
  '像把「我还行」练成条件反射，真症状反而烫嘴。',
  '像等一个不会来的「再观察就好」，证明自己不用去医院。',
  '像把求助预演成给家人添堵，于是先惩罚自己硬扛。',
  '像把一次指标波动写成终审，越写越信。',
  '像用忙碌给拖延复查上漆，漆厚了连自己也骗过。',
  '像把身体当叛徒，又嫌它不够懂事。',
  '像夜里把疼脑补成最坏结局，白天一步没动。',
  '像收藏养生文当治疗，转发当完成。',
  '像把情绪当诊断，把医嘱当配角。',
  '像把复查日当羞辱日，而不是当坐标。',
  '像把家人当法官，其实他们也只是怕失去你。',
  '像把病友故事当判决书，忘了你们不是同一种病。',
  '像把权威当墙，忘了问诊室里门把手在你手里（你可以问、可以换）。',
  '像把费用单当判决书，越怕越不敢打开。',
  '像把时间当沙子：想抓康复，却漏掉睡眠。',
  '像候诊区坐成孤岛：人很多，话很少。',
  '像把疼痛当耻辱：说出来怕显得软弱。',
  '像把「别麻烦人」当勋章，包括该麻烦的医护。',
  '像把一次误诊恐惧放大成永远不信任何人。',
  '像把药盒当战场：吃与不吃都在赌。',
  '像把康复当考试：慢一点就像不及格。',
];

const ROOT_HEALTH = [
  '把自尊与「我不麻烦人」焊死，慢一点就医就像丢脸。',
  '把独立误会成绝不求助，包括该求助的急诊与复诊。',
  '把诚实当成危险：怕说实话就被判「矫情」。',
  '把一次不适写成我不配好好活，越写越像真。',
  '把控制当负责：抓牢药量、抓牢家人作息，却抓碎自己睡眠。',
  '把比较当燃料：看别人恢复快就恨自己慢，燃料是自厌。',
  '把熟人议论当第二诊室，把面诊当麻烦。',
  '把情绪当判决，把检查当上诉。',
  '把完美康复当门槛，门槛高到进不去就干脆躺平。',
  '把熬夜当赎罪：以为多熬就能多换一点「我没偷懒」。',
  '把沉默当孝顺：对父母瞒病情，常常拖到更难收拾。',
  '把狠话当清醒：骂自己废物，其实只是伤神经免疫。',
  '把偏方当捷径，常常买到肝肾账单。',
  '把面子当氧气：宁可硬扛也不在同事面前请假去医院。',
  '把期待当债：必须一次看好，越还越焦虑。',
  '把选择当生死：其实多数医疗选择可逆、可二诊。',
  '把他人目光当裁判，忘了你才是对自己身体签字的人。',
  '把信息当掌控：收藏越多越不敢行动。',
  '把焦虑当尽责：心跳快不等于你已经负责到位。',
  '把缓冲当答案：「再观察」没有截止就会变成赌。',
];

const SPIRIT_LEAD_HEALTH = [
  '光先落在「今晚能做的一小步医嘱」上，不落在「我配不配被治好」上。',
  '身体偏爱把话说短的人：主诉三句，比一夜自辩更接得住帮助。',
  '你不必完美才配复查；你要的是可协作的真实症状。',
  '指标会波动，方案要更新；别把旧拖延当命运。',
  '边界清楚的人，更容易被医护帮助，也更容易帮家人对路。',
  '资源不止一种：睡眠、病历、陪护、第二意见，先点名再伸手。',
  '沉默有时是保护，有时是拖延；对症状沉默常常放大风险。',
  '把怕写下来，它会缩小；不写，它会在夜里长大。',
  '宽恕自己不是赖账，是停止用自恨让免疫更乱。',
  '医嘱像盐，热闹偏方像糖；长期靠盐才站得住。',
  '想要与需要分桌：想要「立刻不焦虑」，需要「可验证的一步」。',
  '觉察不是审判，是把不知不觉变成可选的下一步。',
  '小步可逆，大手术谨慎；这是长期的赢法。',
  '睡眠是底气，面子是利息；别用后者透支前者。',
  '证据与随访，是医疗里的护身符。',
  '一句话短、真有预约时间，胜过一夜搜病。',
  '停战后，复查才有机会排成队。',
  '别把「我很努力扛」当治疗；努力要落在可见的遵医嘱动作上。',
  '别把一次指标失手当人坏；坏的是拖、瞒、扛到红线。',
  '别把康复押给一夜神药；一夜只是补丁，疗程才是土壤。',
  '先把人稳住：疼痛可管理，恐惧也可管理。',
  '信任专业不是盲从：问清「为什么」与「替代方案」同样是尊重。',
  '慢病像长跑：配速写在日历里，比写在脸上更体面。',
  '疼痛会撒谎，也会说真话；记录比辩解更接近真相。',
  '医保与流程陌生时，先问窗口一句「最少材料路径」，羞耻会退一寸。',
];

const SPIRIT_CORE_HEALTH = [
  '把下一步缩到能看见：预约、采血、取药，才接得住你。',
  '先对齐体征与时间表，再谈情绪；顺序反了会越谈越慌。',
  '你可以怕，但仍可把症状说短、说清、说在面诊之前写纸上。',
  '真实会疼一分钟，假装会疼很久——对身体也是。',
  '带时间线去问诊的人，比只带洪水的人更容易被接住。',
  '脆弱处进照护，硬撑处只剩延误。',
  '晚复查不是温柔，常常是把雷养到急诊。',
  '让家人看见你的计划，也是让他们参与爱，而不只参与担心。',
  '空手的情绪换不来陪护分工；带清单的人才接得住。',
  '瞒症独自发酵时，误诊与延误概率都升高。',
  '一句话开窗：哪三天最痛、做了什么会更痛。',
  '先护安全，再谈面子；顺序反了，你会更不敢去医院。',
  '停战后，误会才有机会排队——包括你与自己的误会。',
  '把「我怕的是钱还是怕痛」写下来，它会缩小一半。',
  '疗程买的是结构，不是自我感动式硬扛。',
  '群里的个案不等于你的人生病理。',
  '复盘指标是镜子，不是鞭子。',
  '想快可以，但别用停药与通宵当天结账。',
  '求助医护是技能，练第一次最疼，也最值得。',
  '诚实晚一天，焦虑滚大一天；诚实早一天，治疗少绕弯。',
];

const ACT_A_HEALTH = [
  '写三行给诊室：何时开始、如何加重、伴随症状——先草稿也算。',
  '设 25 分钟只做一件医疗小事：预约、整理药盒或打印化验，做完打勾。',
  '把复查日与前置检查抄到便利贴，贴冰箱门。',
  '打官方电话问急诊指征，记工单号或录音备忘。',
  '约一位家人只做见证：不谈替你做决定，只谈陪诊时间。',
  '整理症状时间线截图进相册，命名「给医生看」。',
  '睡 20 分钟再决定熬不熬；醒后先写红线三条（喘、热、意识等按题替换）。',
  '把「要不要去」改成「几点前、找谁、做到哪一步检查」。',
  '查指南或医院官方页对应症状条目，勾出与你最像的三条。',
  '给主治发短消息：主题写清「复查咨询」、附一页关键指标。',
  '列对比表：保守观察与积极检查的成本、风险、可逆性。',
  '本周留一小时空白写进表，当给身体复诊的证据。',
  '演练开口三句：最痛一点、多久了、最怕什么。',
  '导出用药记录照片，防日后记错剂量。',
  '给任何新疗法写止损线：无效几周就复诊调整。',
  '今天只问医生一个真问题，写下来再问出口。',
  '复核化验单姓名与日期两遍再保存。',
  '长假只锁一个健康主线（如把疫苗打完），副线最多半个。',
  '写一封给家人的短信：症状、预约时间、你需要他们怎么配合。',
  '家庭群发陪护分工确认，请对方回「收到」。',
  '量体温/血压三次记下来，比凭感觉争论有用。',
  '把药盒按周一到周日分格，漏服一眼能看见。',
  '带孩子就诊前先列「吃喝拉撒睡」五句给医生。',
  '互联网医院问诊上传：主诉三行、既往诊断、现用药清单。',
  '把过敏史、末次月经、肝肾功能写在同一张便签，进诊室先递。',
  '慢病周记只记四格：睡、痛、药、情绪；复诊带一页就够。',
  '预约前打医院热线确认「当日是否需空腹/停药」，少白跑一趟。',
];

const ACT_B_HEALTH = [
  '你现在最回避的是检查、用药，还是告诉家人？',
  '你是在等信息，还是在等「奇迹替你做决定」？',
  '手机是工具还是搜病舱？设 15 分钟闹钟。',
  '你会不会用感动式硬扛代替遵医嘱？',
  '你只敢想最坏时，问过「最好可验证的一步」吗？',
  '孤立放大羞耻：你愿意破一点孤，先打给一个可信的人吗？',
  '底线保护你，还是被你当成拖延借口？',
  '你会不会道歉十分钟却说不清「我需要陪诊」？',
  '你用娱乐或熬夜填焦虑吗？',
  '你在等身体自己好吗？有没有写「观察截止」？',
  '材料与问题准备好了吗：药盒、化验、三问。',
  '急诊电话你躲了吗？先存进通讯录。',
  '钱、陪护、时间哪条是主线？写清再动。',
  '你敢为自己谈判「我要第二意见」吗？',
  '你怕麻烦所以不测体温吗？',
  '缓冲有截止吗？还是无限「再观察」？',
  '日历上有可去的门诊时段吗？',
  '你敢对偏方说「我要成分与禁忌」吗？',
  '你会不会因为怕丢脸而不请假就医？',
  '你有没有把「工作交付」放在「身体红线」之上？',
  '家属之间谁在扛？有没有轮流表？',
];

const SUM_HEALTH_ONLY = [
  '把下一步写进日历，比把怕写进搜索框更管用。',
  '急症敬畏，慢病耐心；两条线别混成一种自责。',
  '先听身体，再听焦虑；顺序对了，路不会歪太远。',
  '医学是团队运动：你、家人、医护各尽其职，不是要一个人打赢。',
  '温柔对待器官，它会回报你一点点松。',
  '证据比嘴硬可靠，化验比记忆可靠。',
  '填错可补，瞒错难补；先面诊，后自责。',
  '睡眠是硬通货，别当零钱花光。',
  '复查不是判决，是更新地图。',
  '求助不是投降，是把自己从单独扛病里保出来。',
  '小步算赢：今天这一格遵医嘱，就是大赢。',
  '把羞写成短句，羞会缩小。',
  '把截止写眼前，拖会失去借口。',
  '把身体当队友，别当敌人熬。',
  '把疗程当练习，不当一次性死刑。',
  '信息要过滤，行动要落地。',
  '照护他人之前，先确认自己还有气。',
  '第二意见不是背叛，是谨慎。',
  '红线症状别赌：宁可多跑一趟急诊。',
  '停药与加量都要问：专业签字比勇气签字安全。',
  '同类病友故事参考即可，不当你人生的判决书。',
  '你值得被医治，也值得把恐惧说短。',
  '复诊像对账：对的是指标与方案，不对的是你的自尊。',
  '第二意见写在纸上并排看，比在心里站队更接近解。',
  '慢病配速写在日历里，比写在脸上更省命。',
  '红线症状出现时，先动身再解释；体面可以晚一点到。',
];

const POOL_HEALTH: LifeSixRestCatPools = {
  n: N_HEALTH,
  v: V_HEALTH,
  mind: MIND_HEALTH,
  root: ROOT_HEALTH,
  spiritLead: SPIRIT_LEAD_HEALTH,
  spiritCore: SPIRIT_CORE_HEALTH,
  actA: ACT_A_HEALTH,
  actB: ACT_B_HEALTH,
  sum: SUM_HEALTH_ONLY,
  actionCheckLabel: '就医自检',
};

const LIFE_SIX_CAT_POOLS: readonly LifeSixRestCatPools[] = [POOL_HEALTH, ...LIFE_SIX_CAT_POOLS_1_5];

function buildPsychCat(
  pools: LifeSixRestCatPools,
  _qi: number,
  slot: number,
  k: number,
  q: string,
  band: string,
  tagPsych: string
): string {
  const lab = labelForSlot(slot);
  const n = pools.n[k % pools.n.length]!;
  const v = pools.v[Math.floor(k / 60) % pools.v.length]!;
  const m = pools.mind[(k * 3) % pools.mind.length]!;
  const r = pools.root[(k * 5) % pools.root.length]!;
  return (
    `【${band}·现状】${tagPsych}\n\n` +
    `【${band}·心事】你拎着「${q}」时，${lab}把你心里的${n}与${v}推到台前——${m}\n\n` +
    `【${band}·根源】${r}`
  );
}

function buildSpiritCat(
  pools: LifeSixRestCatPools,
  _qi: number,
  k: number,
  band: string,
  tagSpirit: string
): string {
  const tag = tagSpirit;
  const lead = pools.spiritLead[k % pools.spiritLead.length]!;
  const core = pools.spiritCore[(k * 7) % pools.spiritCore.length]!;
  const f = k % 8;
  if (f === 0) return `【${band}·读本】${tag}\n\n【${band}·示意】${lead}\n\n【${band}·记取】${core}`;
  if (f === 1) return `判读落在此题：${tag}\n\n${lead}\n\n你可收束为一步：${core}`;
  if (f === 2) return `【${band}·牌层】${tag}\n\n${lead}\n\n【${band}·脚层】${core}`;
  if (f === 3) return `读本直陈：${tag}\n\n人事落实：${lead}\n\n行者记取：${core}`;
  if (f === 4) return `象示在此题：${tag}\n\n用以自处：${lead}\n\n落到实处：${core}`;
  if (f === 5) return `【${band}·判读】${tag}\n\n${lead}\n\n【${band}·收刃】${core}`;
  if (f === 6) return `灵识催你清醒：${tag}\n\n${lead}\n\n脚步只取一格：${core}`;
  return `象外一言：${tag}\n\n象内一行：${lead}\n\n同时记下：${core}`;
}

function buildActionCat(
  pools: LifeSixRestCatPools,
  _qi: number,
  k: number,
  band: string,
  tagAction: string
): string {
  const a = pools.actA[k % pools.actA.length]!;
  const b = pools.actB[(k * 11) % pools.actB.length]!;
  return `【${band}·今日一格】今天，先把题拆成能落地的一步：${tagAction}\n\n${a}\n\n【${pools.actionCheckLabel}】${b}`;
}

function buildSumCat(pools: LifeSixRestCatPools, _qi: number, k: number, band: string): string {
  const L = pools.sum.length;
  const i1 = ((k % L) + L) % L;
  let i2 = ((k * 13) % L + L) % L;
  /** 避免两句同索引（mod 周期碰撞）或同文，strip 后呈「半段重复」 */
  let guard = 0;
  while (i2 === i1 && L > 1 && guard < L) {
    i2 = (i2 + 1) % L;
    guard += 1;
  }
  const s1 = pools.sum[i1]!;
  let s2 = pools.sum[i2]!;
  guard = 0;
  while (s2 === s1 && L > 1 && guard < L) {
    i2 = (i2 + 1) % L;
    s2 = pools.sum[i2]!;
    guard += 1;
  }
  const mid = s1.endsWith('。') ? '' : '。';
  return `【${band}·总断】${s1}${mid}${s2}`;
}

function main(): void {
  const psych: string[] = [];
  const spirit: string[] = [];
  const action: string[] = [];
  const sum: string[] = [];

  for (let ci = 0; ci < LIFE_SIX_VOICE_PACKS.length; ci++) {
    const pack = LIFE_SIX_VOICE_PACKS[ci]!;
    const base = ci * 20 * 156;
    for (let qi = 0; qi < 20; qi++) {
      const q = pack.questions[qi]!;
      const band = pack.qBand[qi] ?? pack.slug;
      const tp = pack.tagPsych[qi]!;
      const ts = pack.tagSpirit[qi]!;
      const ta = pack.tagAction[qi]!;
      for (let slot = 0; slot < 156; slot++) {
        const k = base + qi * 156 + slot;
        const pools = LIFE_SIX_CAT_POOLS[ci]!;
        psych.push(buildPsychCat(pools, qi, slot, k, q, band, tp));
        spirit.push(buildSpiritCat(pools, qi, k, band, ts));
        action.push(buildActionCat(pools, qi, k, band, ta));
        sum.push(buildSumCat(pools, qi, k, band));
      }
    }
  }

  const outPath = path.join(process.cwd(), 'lib', 'tarot-life-six-rest-layers.generated.ts');
  const esc = (s: string) => JSON.stringify(s);
  const body = `/**
 * AUTO-GENERATED — 运行 npm run tarot:life-six:emit-layers 重新生成。
 * 6×3120×4 条：心理 / 灵性 / 行动 / 收束；与 freeze 牌序一致。
 */
export function lifeSixRestLayerIndex(categoryIndex: number, qi: number, cardId: string, upright: boolean): number {
  const u = upright ? 0 : 1;
  let local: number;
  if (cardId.startsWith('major_')) {
    const mi = Number(cardId.slice('major_'.length));
    const safe = Number.isFinite(mi) ? mi : 0;
    local = safe * 2 + u;
  } else {
    const m = /^(\\w+)_(\\d+)$/.exec(cardId);
    if (!m) local = 0;
    else {
      const suitOrder: Record<string, number> = { wands: 0, cups: 1, swords: 2, pentacles: 3 };
      const si = suitOrder[m[1]!] ?? 0;
      const rank = Number(m[2]);
      local = 44 + si * 28 + (rank - 1) * 2 + u;
    }
  }
  return categoryIndex * 3120 + qi * 156 + local;
}

export const LIFE_SIX_REST_PSYCH: readonly string[] = [${psych.map(esc).join(',')}];

export const LIFE_SIX_REST_SPIRIT: readonly string[] = [${spirit.map(esc).join(',')}];

export const LIFE_SIX_REST_ACTION: readonly string[] = [${action.map(esc).join(',')}];

export const LIFE_SIX_REST_SUM: readonly string[] = [${sum.map(esc).join(',')}];
`;
  fs.writeFileSync(outPath, `${body}\n`, 'utf8');
  console.log(`Wrote ${outPath} layers × ${psych.length}`);
}

main();
