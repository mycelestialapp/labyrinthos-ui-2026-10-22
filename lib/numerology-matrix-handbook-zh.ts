/**
 * 能量矩阵 · 格数手册：单格 1–9、双格 36、三格 84、四格 126（C(9,4)）、五格与六格按亮格枚举；
 * 口吻与矩阵伴读同向。三/四/五格中部分为句库轮换拼句，关键组合另有精修覆盖。
 */

const MATRIX_ROOT_SINGLE_ZH: Record<number, string> = {
  1: `先伸手、先落字的那口气。你未必爱争，只是见不得悬案在半空；别人还在张望，你已经把名字写上证人栏。记得给自己留一口「不必当全场爹」的余地：落款比音量更要紧。夜里若反刍「我是不是太冲」，多半是累了，把休息写进日程，不比认错丢人。`,
  2: `结盟、等人、把场抹平的那面。你读空气快，快到把自己读没了；和平里若少了回条，你会内伤。温柔要站得住，靠的是界线写清楚，不是嗓门变小。今晚若又想「算了忍忍」，先停三秒：忍要忍在纸面上有回条，不然只是在赊账。`,
  3: `喉舌、形声、想被看见的那把火。稿与话会往外涌，堵的是「说了无人接」的空转。每天留一块能署名的铁，比一圈点赞更能把你按回地上。热闹过后若心里发空，就去洗把脸：空不是你没料，是身体叫你收声。`,
  4: `清单、架子、要可重复的安全。你怕明天没有形状，形状一硬又怕没有呼吸缝。先书面留痕再动结构；大改要写退出条件，不然你会替全世界扛表格。表格若越写越像符咒，就撕一页重写：留一条「今晚不加班」也算结构。`,
  5: `变、试探、找活路。小步试错比全盘推翻仁慈；止损写在外面，比写在心里有用。身体往往比脑子先喊停，听见就减载一日，不算逃。心里痒着想推翻一切时，先写「最坏能赔到哪」：写出来，往往就没那么想赌了。`,
  6: `照护、责任、想把人安顿好。你会先垫情分，情分薄了用钱补，最后自己像海绵。先写清你能扛到哪里，再付出，不是冷血，是自保。若有人说你「太冷」，先问对方要的是帮助还是无限供血：界线说清楚，关系反而更久。`,
  7: `想清楚再动、要证据、要站得住。别人读你慢，不是你没料，是你在找自己的说法。别把自己收成孤僻；多半是话没说清、界线没写清。一个人走夜路若越走越硬，就给信任的人发一句「我在钻」：说出口，钻劲会松一半。`,
  8: `结果、责任、能见度。谈钱、谈责任、谈结果，该落字就落字，不是冷，是怕空诺伤人。成败一数时，也给自己留一口不演给别人看的软。赢了一场却睡不着，多半是心里知道：还有一句道歉或一笔账没收尾。`,
  9: `收、放、大愿与告别。收尾不是失败，是把力气留给下一程；清空之前，先跟旧账道个别，心里才不拖泥。慈悲若拖成耗竭，就先睡饱再谈给。想哭就哭一会儿：收不是硬，是把哭完的那张纸也折好放进抽屉。`,
};

const MATRIX_ROOT_PAIR_ZH: Record<string, string> = {
  "1-2": `1 与 2 同亮：开与附并肩。你会先伸手，又忍不住把场抹平；最怕「抢先」变成「替人扛雷」。先问一句：这局谁该落款，再决定要不要站中间。`,
  "1-3": `1 与 3 同亮：开与露同灶。你想被看见，也恨局面悬空；锣响时记得台下要有铁。把「先占位」配一个交付日，缺一就不开枪。`,
  "1-4": `1 与 4 同亮：开与架同案。你要快，也要形状；快若没留痕，后面全是你补洞。先写清单三件，再开第二战场。`,
  "1-5": `1 与 5 同亮：开与变同席。试探没错，别把自己试成陀螺；止损写清，比热血更像对自己负责。`,
  "1-6": `1 与 6 同亮：开与照护同桌。你会牵头，也会先垫情分；记得照护里写上限，不然全场默认你会忍。`,
  "1-7": `1 与 7 同亮：开与审同炉。想清再动与先站中间会打架：给证据链留一晚，再给场面落一字。`,
  "1-8": `1 与 8 同亮：开与果同秤。要结果也要名分；口头对齐不算数，关键承诺落字，缺一不配开第二波。`,
  "1-9": `1 与 9 同亮：开与收同潮。新局要开，旧尾也要收；别用「更大」盖住「没收口」的慌。`,
  "2-3": `2 与 3 同亮：附与露相邻。你想被接住，也想被看见；最怕热闹替代回条。先问：谁听见了、谁回话了，再上台。`,
  "2-4": `2 与 4 同亮：附与架相邻。你要和平，也要形状；和平没回条，会变成赊账。把「默认你会忍」的条款改写成纸面。`,
  "2-5": `2 与 5 同亮：附与变相邻。关系里试探一多，你先用情分垫；记得设止损，别把软读成没底线。`,
  "2-6": `2 与 6 同亮：附与照护双柔。软上加软，最容易被读成矿脉；留白不是冷落，是防被榨干。`,
  "2-7": `2 与 7 同亮：附与审相邻。敏感与证据并行：先写事实三行，再谈感觉，你会少一半内伤。`,
  "2-8": `2 与 8 同亮：附与果相邻。情分与结果别混成一场会；钱没谈清时，别只用体面垫。`,
  "2-9": `2 与 9 同亮：附与收相邻。结盟也要收口：该结束的沉默，别用「和平」命名。`,
  "3-4": `3 与 4 同亮：露与架相邻。要见光，也要清单；没有结构的显，只是噪。把每日一块铁写进日历，再开锣。`,
  "3-5": `3 与 5 同亮：露与变相邻。曝光与试探共振：先锁产出时段，再开社交；反了顺序，只剩回声。`,
  "3-6": `3 与 6 同亮：露与照护相邻。台上热台下要有人接；照护外溢前，先写你能扛到哪里。`,
  "3-7": `3 与 7 同亮：露与审相邻。想被看穿前先自问：有没有一物可呈；没有就先收声一晚。`,
  "3-8": `3 与 8 同亮：露与果相邻。能见度要配交付；否则掌声是借来的火，散场更冷。`,
  "3-9": `3 与 9 同亮：露与收相邻。热闹与收尾同潮：每场对外露出，绑一个可验收物。`,
  "4-5": `4 与 5 同亮：架与变相邻。清单与试探并行：小步改结构，比一夜推翻温柔。`,
  "4-6": `4 与 6 同亮：架与照护相邻。责任写清形状，照护才不变成背锅；先纸面，再付出。`,
  "4-7": `4 与 7 同亮：架与审相邻。要证据也要呼吸缝；审太久会冻场，给截止日期。`,
  "4-8": `4 与 8 同亮：架与果相邻。结构配结果：先留痕再谈加码，写到一半有人认账。`,
  "4-9": `4 与 9 同亮：架与收相邻。收尾也是结构：清单最后三项，写清谁结、何时结。`,
  "5-6": `5 与 6 同亮：变与照护相邻。试探里别拿人情当缓冲；照护前先写上限，关系才不勒脖子。`,
  "5-7": `5 与 7 同亮：变与审相邻。试错要配证据；别用「我在思考」掩护拖延，也别用「快」掩盖没算清。`,
  "5-8": `5 与 8 同亮：变与果相邻。试探与结果对齐：每次外扩，配退出条件与止损。`,
  "5-9": `5 与 9 同亮：变与收相邻。新局前先收旧线头；不然变只是乱。`,
  "6-7": `6 与 7 同亮：照护与审相邻。照顾人也要核对事实；不然好心会变成替罪。`,
  "6-8": `6 与 8 同亮：照护与果相邻。责任与结果同秤：先写你能扛到哪里，再谈交付。`,
  "6-9": `6 与 9 同亮：照护与收相邻。收照护不是冷漠，是把空杯续上水；先睡饱，再承担。`,
  "7-8": `7 与 8 同亮：审与果相邻。证据与结果一条绳：落字前先核对来源，落字后认账。`,
  "7-9": `7 与 9 同亮：审与收相邻。想清再收：告别也要证据，别用情绪替交割。`,
  "8-9": `8 与 9 同亮：果与收同潮。要结果也要会收刀；收尾写进日历，比誓言更像对自己守信。`,
};

/** 三格精修（键为小-中-大） */
const MATRIX_ROOT_TRIPLE_SPECIAL_ZH: Record<string, string> = {
  "1-2-3": `格数 1、2、3 同亮：开、附、露一锅炖。你既想出头，又怕场面难看，还想被看见——最容易把自己拧成「忙给别人看」。今晚只做一件事：把主路那句写下来贴眼皮下，其余两条明天再接。`,
  "1-2-4": `格数 1、2、4 同亮：开、附、架同案。你先伸手，又想抹平，还要把明天钉死——最怕「快」把人情碾薄。先留一条纸面回条，再开下一刀。`,
  "1-2-8": `格数 1、2、8 同亮：开、附、果同秤。人情与结果都想要时，别用体面替交付。把「谁付、何时止」写清，关系反而更干净。`,
  "1-3-9": `格数 1、3、9 同亮：开、露、收同潮。新锣想敲，旧账又想清——先收一场再开一场，别两场同时在台上抢麦。`,
  "1-4-7": `格数 1、4、7 同亮：开、架、审同炉。你要快、要形、还要证据，最容易把自己审到动不了。给「今晚到此为止」四个字，比再给一晚硬扛温柔。`,
  "1-5-7": `格数 1、5、7 同亮：开、变、审并行。试探与证据抢同一把刀时，先写止损，再写假设；不然脑子会把自己当实验品。`,
  "1-8-9": `格数 1、8、9 同亮：开、果、收三连。要站中间，也要结果，还要会收刀；最怕只开不收。写清「这周收什么、谁认账」，比再开新局更像对自己诚实。`,
  "2-3-5": `格数 2、3、5 同亮：附、露、变同灶。关系、表达、试探搅在一起，你会先用热闹盖住不安。今晚留一小时不产出：只散步，把喉咙里的火凉一凉。`,
  "2-4-6": `格数 2、4、6 同亮：附、架、照护同席。你要和平，也要形状，还想照顾——最容易把自己排到最后。把自己写进清单第二行，不算自私。`,
  "2-6-9": `格数 2、6、9 同亮：附、照护、收并潮。你容易把温柔扛成债，又在收的时候内疚。记住：收不是冷，是把照护放回可持续的火候里。`,
  "3-4-5": `格数 3、4、5 同亮：露、架、变相邻。想被看见，又要清单，还想试探——先锁每日一块铁，再开社交；反了顺序，只剩回声。`,
  "3-5-7": `格数 3、5、7 同亮：露、变、审同席。曝光、试探、证据三头烧时，先问：哪一头今天可以熄火一晚。`,
  "3-6-9": `格数 3、6、9 同亮：露、照护、收同席。台上想亮，台下想照顾，心里还想清旧账——先睡一晚，再决定哪一场戏非演不可。`,
  "4-5-9": `格数 4、5、9 同亮：架、变、收同潮。结构、试探、告别同时敲门时，先收一条旧线，再改一条新线；别三线同时硬扯。`,
  "4-6-8": `格数 4、6、8 同亮：架、照护、果同秤。责任、照护、结果叠在一起时，先写你能扛到哪里，再谈能见度；不然你会用「更努力」骗自己。`,
  "4-7-8": `格数 4、7、8 同亮：架、审、果同案。证据、结构、结果一条绳上三颗扣；先留痕，再落字，最后才谈加码，顺序反了会把自己审到动不了。`,
  "5-7-9": `格数 5、7、9 同亮：变、审、收同潮。试探、证据、告别搅在一起，人会又急又冷。先写「最坏能赔到哪」，再决定动不动。`,
  "7-8-9": `格数 7、8、9 同亮：审、果、收同潮。想清、要结果、还要告别——这是「认真的人」最容易硬的一段。给自己一口软：收不等于输，是把力气留给下一程。`,
};

const TRIPLE_OPEN_ZH = [
  "三口同灶，火别一把拧糊：",
  "三格一齐亮，先别急着给人下判词：",
  "三口气同时在桌上，像三支烛并排：",
  "三味都上桌了，别装作只尝一口：",
  "三声叠在一起，耳朵会先炸一下：",
  "三把刷子同时蘸墨：",
  "三扇门同时开了一条缝：",
  "三股绳拧在一处：",
  "三句话都想抢着先说：",
  "三笔账同时翻到同一页：",
  "三盏茶一起烫手：",
  "三步都想跨成一步：",
] as const;

const TRIPLE_MID_ZH = [
  "先听最响的一条，再把另外两格当配菜；主线仍在主路径。",
  "先写事实三行，再谈感觉；不然你会把自己骂成坏人。",
  "先问「谁该落款」，再问「谁该出声」，最后才问「谁该被看见」。",
  "先减载一晚，再谈加码；疲时做的决定，多半要返工。",
  "先把最软的一格托住，硬的才不会把桌掀了。",
  "先把今年外圈当天气看，不当判决书；主路仍是底盘。",
  "先把姓名那条线放回拉丁拼写里核对，别用中文名硬套。",
  "先把「能交付」写清，再谈「想被懂」；顺序反了会空转。",
  "先把身体当第一证人：困了就睡，不比硬扛丢脸。",
  "先把关系里的回条补上，再谈浪漫与体面。",
  "先把钱、情、义分三个信封，别混在一个红包里。",
  "先把退出条件写纸上，再进深水区。",
] as const;

const TRIPLE_CLOSE_ZH = [
  "乱了，就回寰宇之门第一段拆主线；这儿只摆桌形。",
  "念到哪段算哪段，不必一次吞完。",
  "拆不清时，去对一下之门最上排五格：数对得上，心就先落一半。",
  "星图六条摘句也在说同一套，只是换角度陪你扫。",
  "炼金工具里能把手稿折一遍，和这儿对眼也行。",
  "别在格子里硬编故事：格亮是提醒，不是判决书。",
  "今晚允许自己只读一段，剩下的留给明天晒太阳。",
  "把最刺的那句留到纸上，别留在胃里过夜。",
  "对不上眼时，先喝水，再重看一遍亮格。",
  "你不必一次把自己说满；留一口余地，才是长久。",
  "把「我怕」写成「我要」，字会变轻一点。",
  "把「他们」写回「我」，责任会回到该落的地方。",
] as const;

function pairKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function tripleKey(a: number, b: number, c: number): string {
  const x = [a, b, c].sort((p, q) => p - q);
  return `${x[0]}-${x[1]}-${x[2]}`;
}

function tripleGeneratedZh(a: number, b: number, c: number): string {
  const sk = tripleKey(a, b, c);
  const sp = MATRIX_ROOT_TRIPLE_SPECIAL_ZH[sk];
  if (sp) return sp;
  const h = (a * 37 + b * 19 + c * 53) % 10000;
  const o = TRIPLE_OPEN_ZH[h % TRIPLE_OPEN_ZH.length]!;
  const m = TRIPLE_MID_ZH[(h * 7) % TRIPLE_MID_ZH.length]!;
  const cl = TRIPLE_CLOSE_ZH[(h * 13) % TRIPLE_CLOSE_ZH.length]!;
  return `格数 ${a}、格数 ${b}、格数 ${c} 同亮：${o}${m}${cl}`;
}

const MATRIX_ROOT_QUAD_SPECIAL_ZH: Record<string, string> = {
  "1-2-3-4": `格数 1、2、3、4 同亮：开、附、露、架一锅端。又想快、又想圆、又想被看见、还要形状——最容易把自己拧成「全能替身」。今晚只留一把主勺：主路先落一句，其余三条写进「明天再接」。`,
  "1-2-8-9": `格数 1、2、8、9 同亮：开、附、果、收同潮。人情、场面、结果、告别同时敲门时，先问：哪一扇今晚可以关小一点。写清「这周收什么」，比再开新局更像对自己诚实。`,
  "1-3-6-9": `格数 1、3、6、9 同亮：开、露、照护、收并席。台上要亮，台下要顾，心里还要收——最怕三场戏同时唱。先睡稳，再排场次；睡不稳时，别谈重大转向。`,
  "1-4-7-8": `格数 1、4、7、8 同亮：开、架、审、果同案。快、形、证据、结果四头烧时，给「今晚到此」四个字；不然你会把自己审到动不了。`,
  "2-3-5-7": `格数 2、3、5、7 同亮：附、露、变、审同灶。关系、表达、试探、证据搅在一起，先用纸面把事实三行写清，再进人话。`,
  "2-4-6-8": `格数 2、4、6、8 同亮：附、架、照护、果同秤。和平、结构、照护、结果都想要时，最容易把自己排到最后。把自己写进清单第二行，不算自私。`,
  "3-4-5-6": `格数 3、4、5、6 同亮：露、架、变、照护同席。要见光、要清单、要试探、还要照顾——先锁每日一块铁，再开人情场；反了顺序，只剩回声。`,
  "3-5-7-9": `格数 3、5、7、9 同亮：露、变、审、收同潮。曝光、试探、证据、告别四弦同拨时，先写「最坏能赔到哪」，再决定动不动。`,
  "4-5-6-7": `格数 4、5、6、7 同亮：架、变、照护、审同炉。结构、试探、照护、证据叠在一起时，先问：哪一条今天可以交给别人半寸。`,
  "4-6-7-8": `格数 4、6、7、8 同亮：架、照护、审、果同案。责任、照护、证据、结果一条绳上四颗扣；先留痕，再落字，再谈加码，最后才把自己放上秤。`,
  "5-6-7-8": `格数 5、6、7、8 同亮：变、照护、审、果并行。试探里别拿人情当缓冲；照护前先写上限，审与果才不会把你勒死。`,
  "1-5-8-9": `格数 1、5、8、9 同亮：开、变、果、收同潮。新局、试探、结果、告别同时伸手时，先收一条旧线，再开一条新线；别四线同时硬扯。`,
  "2-3-6-9": `格数 2、3、6、9 同亮：附、露、照护、收并席。想被接住、想被看见、想照顾、还想清账——先问身体：困了就睡，不比硬扛丢脸。`,
  "1-3-5-9": `格数 1、3、5、9 同亮：开、露、变、收同灶。想出头、想表达、想试探、还要收——最怕只开不收。把「这周收什么」写进日历。`,
  "2-5-8-9": `格数 2、5、8、9 同亮：附、变、果、收同潮。人情、试探、结果、告别叠在一起时，先把「谁付、何时止」落字，再谈体面。`,
  "3-6-8-9": `格数 3、6、8、9 同亮：露、照护、果、收同席。台上热、台下软、还要结果、还要告别——先收一场再亮一场，别两场抢麦。`,
  "1-2-6-9": `格数 1、2、6、9 同亮：开、附、照护、收并潮。牵头与抹平同时，又想照顾又想收——最容易把自己榨干。今晚留一口不扮演的软。`,
  "4-5-8-9": `格数 4、5、8、9 同亮：架、变、果、收同案。结构、试探、结果、告别同页时，先写退出条件，再谈加码。`,
  "1-7-8-9": `格数 1、7、8、9 同亮：开、审、果、收同炉。站中间、要证据、要结果、还要告别——给自己一口软：收不等于输。`,
};

const QUAD_OPEN_ZH = [
  "四口灶同开，先别急着一锅炖：",
  "四弦同拨，耳朵会先胀一下：",
  "四味都上桌，别装作只尝一口：",
  "四扇门同时开缝，风会乱：",
  "四笔账翻到同一页：",
  "四盏茶一起烫手：",
  "四步都想跨成一步：",
  "四股绳拧在一处：",
  "四句话都想抢着先说：",
  "四张脸同时看向你：",
  "四口气抢一把嗓子：",
  "四块砖同时搬到胸口：",
  "四枚钉子同时敲：",
  "四线并行，最容易把自己当超人：",
] as const;

const QUAD_MID_ZH = [
  "先听主路径那一句，再把其余几格当佐料；主线仍在之门第一段。",
  "先写「今晚收什么」，再谈「明天开什么」；顺序反了会空转。",
  "先把身体当第一证人：困了就睡，不比硬扛丢脸。",
  "先把钱、情、义分三个信封，别混在一个红包里。",
  "先把关系里的回条补上，再谈浪漫与体面。",
  "先把「能交付」写清，再谈「想被懂」。",
  "先把最软的一格托住，硬的才不会把桌掀了。",
  "先把今年外圈当天气看，不当判决书。",
  "先把姓名那条线放回拉丁拼写里核对。",
  "先把退出条件写纸上，再进深水区。",
  "先把「我怕」写成「我要」，字会变轻一点。",
  "先把「他们」写回「我」，责任会回到该落的地方。",
  "先把事实三行写清，再谈感觉。",
  "先减载一晚，再谈加码。",
] as const;

const QUAD_CLOSE_ZH = [
  "乱了，就回寰宇之门第一段拆主线；这儿只摆桌形。",
  "念到哪段算哪段，不必一次吞完。",
  "星图六条摘句也在说同一套，只是换角度陪你扫。",
  "炼金工具里能把手稿折一遍，和这儿对眼也行。",
  "别在格子里硬编故事：格亮是提醒，不是判决书。",
  "今晚允许自己只读一段，剩下的留给明天晒太阳。",
  "把最刺的那句留到纸上，别留在胃里过夜。",
  "对不上眼时，先喝水，再重看一遍亮格。",
  "你不必一次把自己说满；留一口余地，才是长久。",
  "对一下之门最上排五格：数对得上，心就先落一半。",
  "把「这周收什么」写进日历，比发誓更像对自己守信。",
  "把「最坏能赔到哪」写出来，往往就没那么想赌。",
  "把「谁该落款」问出来，比先骂自己更有效。",
] as const;

function quadKey(a: number, b: number, c: number, d: number): string {
  const x = [a, b, c, d].sort((p, q) => p - q);
  return `${x[0]}-${x[1]}-${x[2]}-${x[3]}`;
}

function quadGeneratedZh(a: number, b: number, c: number, d: number): string {
  const qk = quadKey(a, b, c, d);
  const sp = MATRIX_ROOT_QUAD_SPECIAL_ZH[qk];
  if (sp) return sp;
  const h = (a * 43 + b * 29 + c * 17 + d * 11) % 100000;
  const o = QUAD_OPEN_ZH[h % QUAD_OPEN_ZH.length]!;
  const m = QUAD_MID_ZH[(h * 5) % QUAD_MID_ZH.length]!;
  const cl = QUAD_CLOSE_ZH[(h * 11) % QUAD_CLOSE_ZH.length]!;
  return `格数 ${a}、格数 ${b}、格数 ${c}、格数 ${d} 同亮：${o}${m}${cl}`;
}

const MATRIX_ROOT_QUINT_SPECIAL_ZH: Record<string, string> = {
  "1-2-3-4-5": `格数 1、2、3、4、5 五格同亮：开、附、露、架、变一锅端。这是最「满桌」的一种：快、圆、亮、形、试探都在。今晚只做一件事：主路落一句，其余四条写进「明天再接」，不然你会把自己当超人用。`,
  "1-3-5-7-9": `格数 1、3、5、7、9 五格同亮：开、露、变、审、收五弦齐。奇数一路排开，像五步都要踩实；最怕只开不收。把「这周收什么」写进日历，比再开新局更像对自己诚实。`,
  "2-4-6-8-9": `格数 2、4、6、8、9 五格同亮：附、架、照护、果、收并潮。人情、结构、照护、结果、告别叠在一起时，先睡稳，再排场次；睡不稳时，别谈重大转向。`,
};

const QUINT_OPEN_ZH = [
  "五格同亮，像五只碗一起递到你手里：",
  "五弦齐鸣，先别急着定调：",
  "五口气同时敲门：",
  "五笔账同页翻开：",
  "五扇门同时开了一条缝：",
  "五块砖同时搬到胸口：",
  "五线并行，最容易把自己当超人：",
  "五句「必须」叠在一起：",
] as const;

const QUINT_MID_ZH = [
  "先听主路径那一句，其余当佐料；主线仍在之门第一段。",
  "先写「今晚收什么」，再谈「明天开什么」。",
  "先把身体当第一证人：困了就睡。",
  "先把「最坏能赔到哪」写出来。",
  "先把事实三行写清，再谈感觉。",
  "先把退出条件写纸上，再进深水区。",
  "先把钱、情、义分三个信封。",
  "先把关系里的回条补上。",
  "先减载一晚，再谈加码。",
  "先把「谁该落款」问出来。",
] as const;

const QUINT_CLOSE_ZH = [
  "念到哪段算哪段，不必一次吞完。",
  "乱了，就回之门第一段拆主线。",
  "对一下之门最上排五格：数对得上，心就先落一半。",
  "星图六条摘句也在说同一套。",
  "别在格子里硬编故事。",
  "今晚允许自己只读一段。",
  "把最刺的那句留到纸上。",
  "你不必一次把自己说满。",
] as const;

function quintKey(five: number[]): string {
  return [...five].sort((p, q) => p - q).join("-");
}

function quintGeneratedZh(a: number, b: number, c: number, d: number, e: number): string {
  const qk = quintKey([a, b, c, d, e]);
  const sp = MATRIX_ROOT_QUINT_SPECIAL_ZH[qk];
  if (sp) return sp;
  const h = (a * 47 + b * 41 + c * 23 + d * 13 + e * 7) % 100000;
  const o = QUINT_OPEN_ZH[h % QUINT_OPEN_ZH.length]!;
  const m = QUINT_MID_ZH[(h * 3) % QUINT_MID_ZH.length]!;
  const cl = QUINT_CLOSE_ZH[(h * 9) % QUINT_CLOSE_ZH.length]!;
  return `格数 ${a}、格数 ${b}、格数 ${c}、格数 ${d}、格数 ${e} 同亮：${o}${m}${cl}`;
}

function sextupleHandbookZh(six: number[]): string {
  const s = [...six].sort((a, b) => a - b);
  const list = s.join("、");
  return `格数 ${list} 六格同亮：这是「满桌」里最难端稳的一种——六口气同时在桌上，最容易把自己当超人。今晚只做三件事：先睡稳；再把主路那句写下来贴眼皮下；最后把「这周收什么」写进日历。其余五条写进「明天再接」。想听人怎么长，仍回寰宇之门第一段慢慢念；这儿只摆桌形，不替你落笔。`;
}

function chooseCount(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n - k) k = n - k;
  let num = 1;
  let den = 1;
  for (let i = 0; i < k; i++) {
    num *= n - i;
    den *= i + 1;
  }
  return Math.round(num / den);
}

const HANDBOOK_INTRO_ZH =
  "格数手册：先逐格留影，次写两两、三三叠读；条数随亮格而增，乃穷举脉络，非逼你一夜背尽。跳读无妨，仍以主路径与个人年为轴，其余作注脚可也。";

type MatrixHandbookParts = {
  emptyMessage: string | null;
  intro: string;
  singleBlocks: string[];
  pairLines: string[];
  tripleLines: string[];
  quadLines: string[];
  quintLines: string[];
  sextLine: string | null;
};

function matrixHandbookSortedLitRoots(litRoots: number[]): number[] {
  return [...new Set(litRoots.filter((n) => n >= 1 && n <= 9))].sort((a, b) => a - b);
}

function buildMatrixHandbookParts(sorted: number[]): MatrixHandbookParts {
  if (sorted.length === 0) {
    return {
      emptyMessage: "尚无格可读。请先在寰宇之门填实公历生辰，再回到此桌。",
      intro: "",
      singleBlocks: [],
      pairLines: [],
      tripleLines: [],
      quadLines: [],
      quintLines: [],
      sextLine: null,
    };
  }
  const singleBlocks: string[] = [];
  for (const r of sorted) {
    const line = MATRIX_ROOT_SINGLE_ZH[r];
    if (line) singleBlocks.push(`格数 ${r}：${line}`);
  }
  const pairLines: string[] = [];
  if (sorted.length >= 2) {
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i]!;
        const b = sorted[j]!;
        const line = MATRIX_ROOT_PAIR_ZH[pairKey(a, b)];
        if (line) pairLines.push(line);
      }
    }
  }
  const tripleLines: string[] = [];
  if (sorted.length >= 3) {
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        for (let k = j + 1; k < sorted.length; k++) {
          const a = sorted[i]!;
          const b = sorted[j]!;
          const c = sorted[k]!;
          tripleLines.push(tripleGeneratedZh(a, b, c));
        }
      }
    }
  }
  const quadLines: string[] = [];
  if (sorted.length >= 4) {
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        for (let k = j + 1; k < sorted.length; k++) {
          for (let l = k + 1; l < sorted.length; l++) {
            const a = sorted[i]!;
            const b = sorted[j]!;
            const c = sorted[k]!;
            const d = sorted[l]!;
            quadLines.push(quadGeneratedZh(a, b, c, d));
          }
        }
      }
    }
  }
  const quintLines: string[] = [];
  if (sorted.length >= 5) {
    const n = sorted.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        for (let k = j + 1; k < n; k++) {
          for (let l = k + 1; l < n; l++) {
            for (let m = l + 1; m < n; m++) {
              quintLines.push(quintGeneratedZh(sorted[i]!, sorted[j]!, sorted[k]!, sorted[l]!, sorted[m]!));
            }
          }
        }
      }
    }
  }
  const sextLine = sorted.length >= 6 ? sextupleHandbookZh(sorted) : null;
  return {
    emptyMessage: null,
    intro: HANDBOOK_INTRO_ZH,
    singleBlocks,
    pairLines,
    tripleLines,
    quadLines,
    quintLines,
    sextLine,
  };
}

/** 供矩阵页折叠区块：三格及以上默认收起，减轻首屏长度（与 `numerologyMatrixHandbookBodyZh` 同源） */
export type NumerologyMatrixHandbookFoldLayerZh = {
  key: "pairs" | "triples" | "quads" | "quints" | "sexts";
  summary: string;
  defaultOpen: boolean;
  body: string;
};

export function numerologyMatrixHandbookFoldLayersZh(litRoots: number[]): {
  emptyMessage: string | null;
  introAndSingles: string;
  folds: NumerologyMatrixHandbookFoldLayerZh[];
} {
  const sorted = matrixHandbookSortedLitRoots(litRoots);
  const parts = buildMatrixHandbookParts(sorted);
  if (parts.emptyMessage) {
    return { emptyMessage: parts.emptyMessage, introAndSingles: "", folds: [] };
  }
  const introAndSingles = [parts.intro, ...parts.singleBlocks].join("\n\n");
  const n = sorted.length;
  const folds: NumerologyMatrixHandbookFoldLayerZh[] = [];
  if (parts.pairLines.length) {
    folds.push({
      key: "pairs",
      summary: `双格叠读 · ${chooseCount(n, 2)} 组（两两配对）`,
      defaultOpen: true,
      body: parts.pairLines.join("\n\n"),
    });
  }
  if (parts.tripleLines.length) {
    folds.push({
      key: "triples",
      summary: `三格叠读 · ${chooseCount(n, 3)} 组（三元组）`,
      defaultOpen: false,
      body: parts.tripleLines.join("\n\n"),
    });
  }
  if (parts.quadLines.length) {
    folds.push({
      key: "quads",
      summary: `四格叠读 · ${chooseCount(n, 4)} 组（四元组）`,
      defaultOpen: false,
      body: parts.quadLines.join("\n\n"),
    });
  }
  if (parts.quintLines.length) {
    folds.push({
      key: "quints",
      summary: `五格叠读 · ${chooseCount(n, 5)} 组（五元组）`,
      defaultOpen: false,
      body: parts.quintLines.join("\n\n"),
    });
  }
  if (parts.sextLine) {
    folds.push({
      key: "sexts",
      summary: "六格叠读 · 满桌收束（一段）",
      defaultOpen: false,
      body: parts.sextLine,
    });
  }
  return { emptyMessage: null, introAndSingles, folds };
}

/** 按当前亮格（格数）拼接手册正文（\n\n 分段，供 Preline / 导出 Markdown） */
export function numerologyMatrixHandbookBodyZh(litRoots: number[]): string {
  const sorted = matrixHandbookSortedLitRoots(litRoots);
  const parts = buildMatrixHandbookParts(sorted);
  if (parts.emptyMessage) return parts.emptyMessage;
  const blocks: string[] = [parts.intro, ...parts.singleBlocks];
  if (parts.pairLines.length) {
    blocks.push("双格叠读（只读亮格两两之间）：");
    blocks.push(...parts.pairLines);
  }
  if (parts.tripleLines.length) {
    blocks.push("三格叠读（只读亮格三元组）：");
    blocks.push(...parts.tripleLines);
  }
  if (parts.quadLines.length) {
    blocks.push("四格叠读（只读亮格四元组）：");
    blocks.push(...parts.quadLines);
  }
  if (parts.quintLines.length) {
    blocks.push("五格叠读（只读亮格五元组）：");
    blocks.push(...parts.quintLines);
  }
  if (parts.sextLine) {
    blocks.push("六格叠读（满桌收束）：");
    blocks.push(parts.sextLine);
  }
  return blocks.join("\n\n");
}
