type OracleMood = "CHAOS" | "STILLNESS" | "SEEKING" | "SURGE" | "FISSURE";
type OracleTheme =
  | "ORDER_REBUILD"
  | "EMOTION_REPAIR"
  | "BOUNDARY"
  | "MOMENTUM"
  | "DECISION"
  | "RESOURCE_FLOW"
  | "CAREER_PATH"
  | "BODY_RHYTHM"
  | "CREATION"
  | "CYCLE_END"
  | "SYNCHRONICITY"
  | "SOUL_INTEGRATION";

const Y = (a: string, b: string): [string, string] => [`宜：${a}。`, `宜：${b}。`];
const J = (a: string, b: string): [string, string] => [`忌：${a}。`, `忌：${b}。`];

// 主文：全部改为直白可执行，不用隐语
export const SEMANTIC_MAIN: Record<OracleTheme, Record<OracleMood, string>> = {
  ORDER_REBUILD: {
    CHAOS: "今天先把混乱停下来。先关掉多线任务，只保留一条主线。",
    STILLNESS: "现在适合整理规则。把标准写清楚，再开始执行。",
    SEEKING: "你在找方向。先列出三个选项，再用一个标准筛掉两个。",
    SURGE: "推进速度很快。先定边界，再集中火力做一件最重要的事。",
    FISSURE: "原有规则出现裂缝。先修补关键环节，不要整盘推翻。",
  },
  EMOTION_REPAIR: {
    CHAOS: "情绪过载时先降杂音。先停输入，再处理当下最强烈的感受。",
    STILLNESS: "情绪在低位时，适合观察。先命名感受，再判断要不要行动。",
    SEEKING: "你在找原因。先记录触发点，再找重复出现的模式。",
    SURGE: "情绪能量很高。把它导入具体行动，不要对外发散。",
    FISSURE: "你有明显受伤感。先止损，再做修复，不要硬撑。",
  },
  BOUNDARY: {
    CHAOS: "边界被反复打断。先拒绝无关请求，再处理自己的主任务。",
    STILLNESS: "外界很安静，适合立边界。先把底线写下来并执行。",
    SEEKING: "你在试探边界。先小范围验证，再决定是否放开。",
    SURGE: "你在高压推进。先明确谁能进入、谁不能进入你的时间。",
    FISSURE: "边界已受损。先补口子，再谈关系，不要继续让步。",
  },
  MOMENTUM: {
    CHAOS: "节奏乱了先刹车。先停掉临时加项，再恢复主节奏。",
    STILLNESS: "节奏偏慢时别焦虑。先完成一个小动作，重启惯性。",
    SEEKING: "前路不清时先试跑。做一个最小实验，拿结果再决定。",
    SURGE: "动力很足。把速度用在关键路径，不要四处分散。",
    FISSURE: "原节奏失效。换一种步幅，不要再用旧方法硬推。",
  },
  DECISION: {
    CHAOS: "信息太多时先减项。只保留最关键的判断条件。",
    STILLNESS: "暂时不急着拍板。把风险写清楚，留到明天再定。",
    SEEKING: "你在反复比较。先设一个截止时间，到点就做选择。",
    SURGE: "现在适合果断。做出决定后，立刻进入执行。",
    FISSURE: "你卡在两难。先选损失更小的方案，再逐步修正。",
  },
  RESOURCE_FLOW: {
    CHAOS: "资源在漏。先堵住最大的漏点，再谈增长。",
    STILLNESS: "资源稳定时先盘点。明确储备、消耗和可用空间。",
    SEEKING: "你在找新增来源。先测试一条新渠道，别同时开太多。",
    SURGE: "资源进入快。先设分配规则，避免高峰期浪费。",
    FISSURE: "资源结构有裂口。先保核心，再砍非必要开支。",
  },
  CAREER_PATH: {
    CHAOS: "职业方向混乱时先校准。写下你当前阶段唯一目标。",
    STILLNESS: "阶段平稳时先打底。补一项长期有复利的能力。",
    SEEKING: "你在找下一步。先访谈一个前辈，再做路径选择。",
    SURGE: "机会在加速出现。先占主位，再扩展影响范围。",
    FISSURE: "旧路径走不通。转向不等于失败，是升级入口。",
  },
  BODY_RHYTHM: {
    CHAOS: "身体节律紊乱。先把睡眠和进食时间固定下来。",
    STILLNESS: "状态偏低时先保养。减少刺激输入，给身体留恢复时段。",
    SEEKING: "你在找身体信号。记录三天作息，找最明显的波动点。",
    SURGE: "状态上升时可训练。先加一点强度，再看恢复反应。",
    FISSURE: "身体在报警。先减负，再休息，不要继续透支。",
  },
  CREATION: {
    CHAOS: "创作混乱时先收束。只做一个版本，不并行开稿。",
    STILLNESS: "灵感偏低时先积累。读、看、记，不急着产出。",
    SEEKING: "你在找题眼。先写十个标题，再选最有张力的一个。",
    SURGE: "灵感高峰已到。直接输出初稿，先完成再优化。",
    FISSURE: "旧作品卡住了。先删掉拖累部分，再重建结构。",
  },
  CYCLE_END: {
    CHAOS: "旧循环临近终点。先停重复动作，别再追加投入。",
    STILLNESS: "结束阶段要慢。先收尾，再交接，不留尾巴。",
    SEEKING: "你在判断是否该结束。看三条信号：回报、成本、消耗。",
    SURGE: "确认要结束就果断。切断旧回路，马上切到新周期。",
    FISSURE: "结束会疼，但必要。先放下旧身份，再开始新阶段。",
  },
  SYNCHRONICITY: {
    CHAOS: "巧合太多先别迷信。只记录重复三次以上的信号。",
    STILLNESS: "安静期的信号更清晰。先观察，再解释，不急下结论。",
    SEEKING: "你在找对齐点。把目标、时间、行动放到同一页检查。",
    SURGE: "时机打开。先接住当前最匹配的一项机会。",
    FISSURE: "错位感很强。先做一次对齐校正，再继续推进。",
  },
  SOUL_INTEGRATION: {
    CHAOS: "你被多种声音拉扯。先选一个核心原则，其他暂缓。",
    STILLNESS: "内部整合需要安静。给自己留一段无干扰时间。",
    SEEKING: "你在找真正想要的。问自己：做这件事为了什么。",
    SURGE: "内外方向一致时，行动会很稳。先做能代表你的决定。",
    FISSURE: "分裂感出现时，先收拢自己。照顾好内在，再处理外部。",
  },
};

export const SEMANTIC_DO: Record<OracleTheme, Record<OracleMood, [string, string]>> = {
  ORDER_REBUILD: {
    CHAOS: Y("先定主线", "删掉次要事项"),
    STILLNESS: Y("写清执行标准", "先做小范围试行"),
    SEEKING: Y("列三选一", "用单一标准筛选"),
    SURGE: Y("先定边界", "集中做关键任务"),
    FISSURE: Y("先补关键缺口", "保留有效规则"),
  },
  EMOTION_REPAIR: {
    CHAOS: Y("暂停外部输入", "先处理最强烈感受"),
    STILLNESS: Y("命名当前感受", "观察触发场景"),
    SEEKING: Y("记录触发点", "找重复模式"),
    SURGE: Y("把情绪转成行动", "先做一件具体事"),
    FISSURE: Y("先止损", "安排恢复动作"),
  },
  BOUNDARY: {
    CHAOS: Y("拒绝无关请求", "保护专注时段"),
    STILLNESS: Y("写下底线", "按底线执行"),
    SEEKING: Y("小范围试探", "明确可进可退"),
    SURGE: Y("定义进入权限", "回收被占用时间"),
    FISSURE: Y("先补边界漏洞", "停止继续让步"),
  },
  MOMENTUM: {
    CHAOS: Y("先刹车整理", "恢复固定节奏"),
    STILLNESS: Y("先做最小动作", "重启惯性"),
    SEEKING: Y("做最小实验", "用结果决策"),
    SURGE: Y("优先关键路径", "减少分散动作"),
    FISSURE: Y("更换推进方式", "缩小目标再进"),
  },
  DECISION: {
    CHAOS: Y("压缩决策条件", "先排除不重要项"),
    STILLNESS: Y("写清风险", "延后到清醒时决定"),
    SEEKING: Y("设决策截止", "到点执行"),
    SURGE: Y("果断拍板", "拍板后立即开工"),
    FISSURE: Y("先选损失更小方案", "边做边修正"),
  },
  RESOURCE_FLOW: {
    CHAOS: Y("先堵最大漏点", "暂停非必要投入"),
    STILLNESS: Y("做资源盘点", "锁定核心储备"),
    SEEKING: Y("只测一条新渠道", "保留复盘数据"),
    SURGE: Y("先设分配比例", "高峰先保核心"),
    FISSURE: Y("砍掉非必要开支", "保留关键能力"),
  },
  CAREER_PATH: {
    CHAOS: Y("写下唯一阶段目标", "先稳住当前岗位"),
    STILLNESS: Y("补长期能力", "建立稳定输出"),
    SEEKING: Y("问一位前辈", "对比两条路径"),
    SURGE: Y("先拿关键位置", "再扩影响范围"),
    FISSURE: Y("接受转向", "把失败经验转成新方案"),
  },
  BODY_RHYTHM: {
    CHAOS: Y("固定作息时间", "固定进食时间"),
    STILLNESS: Y("减少刺激输入", "优先恢复睡眠"),
    SEEKING: Y("记录三天状态", "找波动最大时段"),
    SURGE: Y("小步加训练量", "观察恢复反应"),
    FISSURE: Y("立即减负", "先休息再补强"),
  },
  CREATION: {
    CHAOS: Y("只保留一个版本", "先完成骨架"),
    STILLNESS: Y("先做素材积累", "延后成稿压力"),
    SEEKING: Y("先写十个标题", "选一个最有张力"),
    SURGE: Y("先出初稿", "后做精修"),
    FISSURE: Y("删掉拖累段落", "重建最短结构"),
  },
  CYCLE_END: {
    CHAOS: Y("停止重复投入", "关闭旧任务入口"),
    STILLNESS: Y("先收尾再交接", "补齐遗漏项"),
    SEEKING: Y("核对回报成本消耗", "按结果决定去留"),
    SURGE: Y("确认结束后立即切换", "启动新周期"),
    FISSURE: Y("放下旧身份", "给新阶段留空间"),
  },
  SYNCHRONICITY: {
    CHAOS: Y("只记高频重复信号", "不做过度解读"),
    STILLNESS: Y("先观察后解释", "保留客观记录"),
    SEEKING: Y("对齐目标时间行动", "找真正匹配点"),
    SURGE: Y("先接住最匹配机会", "快速小步验证"),
    FISSURE: Y("做一次对齐校正", "再继续推进"),
  },
  SOUL_INTEGRATION: {
    CHAOS: Y("先选一个核心原则", "其余事项暂缓"),
    STILLNESS: Y("留无干扰时段", "做内在整理"),
    SEEKING: Y("回答真实动机", "筛掉伪目标"),
    SURGE: Y("做代表自我的决定", "把决定落地"),
    FISSURE: Y("先收拢自己", "再处理外部关系"),
  },
};

export const SEMANTIC_DONT: Record<OracleTheme, Record<OracleMood, [string, string]>> = {
  ORDER_REBUILD: {
    CHAOS: J("同时开多条主线", "边做边改标准"),
    STILLNESS: J("急着全面铺开", "规则没写清就执行"),
    SEEKING: J("一直比较不行动", "无标准选项"),
    SURGE: J("扩张时无边界", "关键任务被打断"),
    FISSURE: J("全盘推翻", "忽略关键裂口"),
  },
  EMOTION_REPAIR: {
    CHAOS: J("情绪上头时争辩", "继续高强度输入"),
    STILLNESS: J("否认感受", "用忙碌压住情绪"),
    SEEKING: J("只靠猜测下结论", "反复追问不记录"),
    SURGE: J("情绪外溢伤人", "把冲动当结论"),
    FISSURE: J("硬撑不修复", "在脆弱期做重决策"),
  },
  BOUNDARY: {
    CHAOS: J("来者不拒", "把他人优先级放在自己前面"),
    STILLNESS: J("底线反复变动", "说了底线却不执行"),
    SEEKING: J("一次性全放开", "不试探就承诺"),
    SURGE: J("高压时继续让步", "时间边界被侵占"),
    FISSURE: J("边界破损后继续消耗", "用讨好换平静"),
  },
  MOMENTUM: {
    CHAOS: J("乱中继续加速", "临时加项不断"),
    STILLNESS: J("长期停滞不动", "把等待当拖延"),
    SEEKING: J("不实验只空想", "结果没出就换方向"),
    SURGE: J("到处发力", "忽略节奏恢复"),
    FISSURE: J("旧方法硬推", "失败后原地重复"),
  },
  DECISION: {
    CHAOS: J("信息不过滤直接定", "同时满足所有条件"),
    STILLNESS: J("无限期拖延决定", "疲劳状态拍板"),
    SEEKING: J("反复改口", "截止时间失效"),
    SURGE: J("拍板后反复推翻", "只说不做"),
    FISSURE: J("卡住不选", "选了不承担后果"),
  },
  RESOURCE_FLOW: {
    CHAOS: J("漏点未补先扩张", "继续冲动投入"),
    STILLNESS: J("不盘点就分配", "储备无预案"),
    SEEKING: J("同时开太多新渠道", "没有复盘数据"),
    SURGE: J("高峰期随意花费", "无分配规则"),
    FISSURE: J("核心资源被挤占", "舍不得砍低效项"),
  },
  CAREER_PATH: {
    CHAOS: J("频繁换目标", "还没稳住就跳转"),
    STILLNESS: J("只守不进", "长期不升级能力"),
    SEEKING: J("只听他人说法不验证", "路径选择无依据"),
    SURGE: J("机会来了还犹豫", "扩张前没站稳主位"),
    FISSURE: J("把转向当失败", "困在旧身份"),
  },
  BODY_RHYTHM: {
    CHAOS: J("作息持续漂移", "靠刺激硬顶状态"),
    STILLNESS: J("忽略恢复信号", "长期透支不减负"),
    SEEKING: J("不记录只凭感觉", "波动点不处理"),
    SURGE: J("加量过快", "恢复未完成继续冲"),
    FISSURE: J("身体报警还硬扛", "把休息当软弱"),
  },
  CREATION: {
    CHAOS: J("并行开太多稿", "还没完成就追完美"),
    STILLNESS: J("没有输入就强产出", "因为焦虑乱改"),
    SEEKING: J("题眼未定就开写", "频繁换方向"),
    SURGE: J("高峰期只想不写", "初稿阶段过度打磨"),
    FISSURE: J("卡住还死守旧稿", "舍不得删拖累内容"),
  },
  CYCLE_END: {
    CHAOS: J("明知无效还持续投入", "结束前再开新支线"),
    STILLNESS: J("收尾不完整就退出", "交接信息缺失"),
    SEEKING: J("不用数据判断去留", "情绪化结束"),
    SURGE: J("宣布结束却不断回头", "新周期启动太晚"),
    FISSURE: J("抓着旧身份不放", "结束后继续自耗"),
  },
  SYNCHRONICITY: {
    CHAOS: J("把偶然当必然", "看到信号就冲动行动"),
    STILLNESS: J("只解释不记录", "主观脑补过多"),
    SEEKING: J("目标时间行动不一致", "匹配点不验证"),
    SURGE: J("机会很多但全接", "接住后不落地"),
    FISSURE: J("错位后不校正", "带偏状态硬推进"),
  },
  SOUL_INTEGRATION: {
    CHAOS: J("每个声音都要满足", "核心原则反复更改"),
    STILLNESS: J("不给自己安静时间", "一直向外找答案"),
    SEEKING: J("不问真实动机", "伪目标越积越多"),
    SURGE: J("决定和行动脱节", "价值观与行为相反"),
    FISSURE: J("内在失衡时强行社交", "忽略自我修复"),
  },
};

export const SEMANTIC_CLOSING: Record<OracleTheme, Record<OracleMood, string>> = {
  ORDER_REBUILD: {
    CHAOS: "先稳住，再推进。",
    STILLNESS: "规则清楚，执行更轻。",
    SEEKING: "选对比选多更重要。",
    SURGE: "有边界的速度，才安全。",
    FISSURE: "先补关键，再谈扩展。",
  },
  EMOTION_REPAIR: {
    CHAOS: "先降杂音，情绪才会清晰。",
    STILLNESS: "先看见，才能处理。",
    SEEKING: "记录会让答案出现。",
    SURGE: "把情绪转成动作。",
    FISSURE: "先修复，再出发。",
  },
  BOUNDARY: {
    CHAOS: "先守住自己。",
    STILLNESS: "底线不是口号，是执行。",
    SEEKING: "试探比承诺更安全。",
    SURGE: "高压时更要守界。",
    FISSURE: "破了就补，不要拖。",
  },
  MOMENTUM: {
    CHAOS: "乱时先刹车。",
    STILLNESS: "小动作能重启节奏。",
    SEEKING: "先试，再定。",
    SURGE: "集中比分散更快。",
    FISSURE: "换方法，不硬推。",
  },
  DECISION: {
    CHAOS: "先减项，再判断。",
    STILLNESS: "不急，先写清风险。",
    SEEKING: "有截止，才有结果。",
    SURGE: "决定要配执行。",
    FISSURE: "先选可承受的那条。",
  },
  RESOURCE_FLOW: {
    CHAOS: "先堵漏，再增长。",
    STILLNESS: "盘点清楚，分配才准。",
    SEEKING: "一条一条测，别全开。",
    SURGE: "高峰更要守规则。",
    FISSURE: "先保核心资源。",
  },
  CAREER_PATH: {
    CHAOS: "先校准目标。",
    STILLNESS: "稳步升级能力。",
    SEEKING: "问路后要验证。",
    SURGE: "先站稳，再扩大。",
    FISSURE: "转向也是前进。",
  },
  BODY_RHYTHM: {
    CHAOS: "节律先稳，状态才稳。",
    STILLNESS: "恢复是推进的一部分。",
    SEEKING: "记录比感觉更可靠。",
    SURGE: "训练要配恢复。",
    FISSURE: "报警就先减负。",
  },
  CREATION: {
    CHAOS: "先收束，再打磨。",
    STILLNESS: "输入会养出输出。",
    SEEKING: "题眼清楚，写作就顺。",
    SURGE: "先完成，再优化。",
    FISSURE: "敢删，才能重建。",
  },
  CYCLE_END: {
    CHAOS: "该停就停。",
    STILLNESS: "收尾完整，才算结束。",
    SEEKING: "用数据判断去留。",
    SURGE: "结束后立刻切换。",
    FISSURE: "放下旧身份，才有新阶段。",
  },
  SYNCHRONICITY: {
    CHAOS: "重复信号才值得重视。",
    STILLNESS: "先观察，再解释。",
    SEEKING: "三点对齐，方向才准。",
    SURGE: "先接最匹配的机会。",
    FISSURE: "先校正，再推进。",
  },
  SOUL_INTEGRATION: {
    CHAOS: "先守住一个核心原则。",
    STILLNESS: "安静会让你更清楚。",
    SEEKING: "先回答你真正想要什么。",
    SURGE: "决定和行动要一致。",
    FISSURE: "先照顾内在，再处理外部。",
  },
};

