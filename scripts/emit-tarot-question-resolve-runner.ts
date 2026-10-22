import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { emitTarotQuestionResolveIife, resolveTarotCanonicalQuestion } from "../lib/tarot-question-resolve-zh";
import { TAROT_QUESTION_CATALOG_19, TAROT_SURFACE_QUESTION_COUNT } from "../lib/tarot-question-catalog-19-zh";
import { getTarotFollowups, getTarotFollowupsForQuestion } from "../lib/tarot-question-intent-zh";

const checks: Array<[string, string, string]> = [
  ["她还爱我吗？", "感情婚姻", "他／她目前对我的真实感受／能量是什么？我该如何回应？"],
  ["该不该复合？", "感情婚姻", "关于复合，我需要知道什么？"],
  ["该不该表白？", "感情婚姻", "该不该表白？"],
  ["我們適合結婚嗎？", "感情婚姻", "我们适合结婚吗？"],
  ["有没有第三者？", "感情婚姻", "有没有第三者？"],
  ["他会不会出轨？", "感情婚姻", "他／她会不会出轨？"],
  ["我是不是备胎？", "感情婚姻", "我是不是备胎？"],
  ["这算交往还是暧昧？", "感情婚姻", "我们现在到底算什么？"],
  ["要不要摊牌要名份？", "感情婚姻", "继续装傻，还是逼他给我一个正式名份？"],
  ["他为什么突然拉黑我？", "感情婚姻", "他为什么突然冷暴力／拉黑我？还会再联系吗？"],
  ["跟着他会不会变成扶贫？", "感情婚姻", "跟着他是不是要陪他吃苦，我会不会变成扶贫？"],
  ["除了身体契合还有没有爱？", "感情婚姻", "我们除了身体契合，到底还有没有真正的爱？"],
  ["异地恋还能不能撑？", "感情婚姻", "异地恋还能不能撑下去？"],
  ["出轨之后该不该原谅？", "感情婚姻", "出轨之后，该原谅还是离开？"],
  ["该不该见家长？", "感情婚姻", "该不该见家长？"],
  ["该不该换行？", "事业工作", "我该不该换行从头来过？"],
  ["转行来得及吗", "事业工作", "我该不该换行从头来过？"],
  ["该不该跳槽？", "事业工作", "现在跳槽，窗口对不对？"],
  ["面试能过吗？", "事业工作", "这场面试能过吗？"],
  ["我会不会被裁？", "事业工作", "公司要裁员，我会不会是那个？"],
  ["三十五岁再转行晚不晚？", "事业工作", "这个年纪再转行，还来得及吗？"],
  ["我适不适合带团队？", "事业工作", "我适不适合带团队？"],
  ["该不该为工作搬家或出国？", "事业工作", "该不该为工作搬家或出国？"],
  ["老板现在怎么看我？", "事业工作", "老板现在到底怎么看我？"],
  ["被调岗了接不接？", "事业工作", "被调岗了，接不接？"],
  ["怎样才能被看见？", "事业工作", "怎样才能被看见？"],
  ["该不该炒掉这个客户？", "事业工作", "该不该结束和这个客户的合作？"],
  ["赔偿方案不合理该硬刚还是接受？", "事业工作", "赔偿方案不合理，我该硬刚还是接受？"],
  ["第一次带团队该怎么立威？", "事业工作", "第一次带团队／做主管，我该怎么立威、带出绩效？"],
  ["直属领导和再上一级意见不合我站哪边？", "事业工作", "直属领导和再上一级意见不合，我站哪边？"],
  ["期权未来能兑现吗？", "财运投资", "现在拿的期权／股权，未来真的能兑现吗？"],
  ["该不该买房？", "财运投资", "现在是买房窗口，还是再等？"],
  ["先还债还是先投资？", "财运投资", "先还债，还是先拿去投资？"],
  ["会不会被人骗钱？", "财运投资", "会不会被人骗钱？"],
  ["做个人IP全职能养活自己吗？", "事业工作", "做个人品牌／自媒体全职，能养活我自己吗？"],
  ["跨到完全不相关的行业胜算大吗？", "事业工作", "想跨到完全不相关的行业，胜算大吗？"],
  ["胸口闷要不要去医院？", "身体健康", "胸口闷了一周是熬夜还是该去医院？"],
  ["这个梦在提醒我什么？", "占梦境", "这个梦代表什么意思？"],
  ["他还爱我吗", "感情婚姻", "他／她目前对我的真实感受／能量是什么？我该如何回应？"],
  ["转行来得及吗", "事业工作", "我该不该换行从头来过？"],
  ["还能找到吗", "失物寻找", "丢的东西能找回吗？"],
  ["这梦怎么解", "占梦境", "这个梦代表什么意思？"],
  ["鳄鱼是生病了吗？", "宠物", "它是生病了吗？"],
  ["鳄鱼不吃东西了是生病了吗？", "宠物", "不吃东西严不严重？"],
  ["哪个器官生病了？", "宠物", "哪个器官出问题了？"],
  ["能治好吗？", "宠物", "能治好吗？"],
  ["哪天治好？", "宠物", "哪天能好？"],
  ["狗走丢了还能找回来吗？", "宠物", "我的狗走丢了，还能找回来吗？"],
];
{
  const q = "未来 3～6 个月，我的感情能量会如何变化？我该做什么准备？";
  const near = getTarotFollowupsForQuestion("感情婚姻", q).map((c) => c.canonical);
  if (near.some((t) => t.includes("分手") || t.includes("还爱"))) {
    throw new Error("followupsFor 未来走向 should stay in the same group, not 分手/还爱");
  }
  if (near.length < 1) throw new Error("followupsFor 未来走向 expected siblings");
}
for (const cat of TAROT_QUESTION_CATALOG_19) {
  const n = getTarotFollowups(cat.id).length;
  if (n !== 6) throw new Error(`${cat.id} followups=${n}, expected 6`);
}
for (const [raw, cat, expect] of checks) {
  const hit = resolveTarotCanonicalQuestion(raw, cat);
  if (hit?.canonical !== expect) {
    throw new Error(`resolve failed: ${raw} => ${hit?.canonical ?? "null"} (expected ${expect})`);
  }
}

const out = join(process.cwd(), "public", "tarotQuestionResolve.js");
writeFileSync(out, emitTarotQuestionResolveIife(), "utf8");

for (const cat of TAROT_QUESTION_CATALOG_19) {
  const n = cat.groups.reduce((s, g) => s + g.surface.length, 0);
  const hidden = cat.groups.reduce((s, g) => s + g.hidden.length, 0);
  if (hidden < 200) {
    throw new Error(`${cat.id} hidden too thin: ${hidden}`);
  }
  console.log(`${cat.id}\tsurface=${n}\thidden=${hidden}\talias=${Object.keys(cat.aliasToCanonical).length}`);
}
console.log(`wrote ${out}`);
