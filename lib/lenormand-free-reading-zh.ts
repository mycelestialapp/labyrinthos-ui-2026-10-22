/**
 * 阵位标签（工作台与旧调用共用）。用户可见解读已改走大师连读，无正逆位。
 */
import type { LenormandCard } from "./lenormand-cards";
import type { LenormandSpreadId } from "./lenormand-spread-id";
import { buildLenormandMasterReadingZh } from "./lenormand-master-reading-zh";

export type LenormandSpreadKind = "TRIAD" | "CROSS" | "SQUARE" | "GRAND_TABLEAU";

export interface LenormandSpreadPosition {
  label: string;
  logic: string;
}

export const LENORMAND_SPREAD_LAYOUTS: Record<LenormandSpreadKind, LenormandSpreadPosition[]> = {
  TRIAD: [
    { label: "过去", logic: "起因、已经发生的铺垫" },
    { label: "现在", logic: "当前现场" },
    { label: "将来", logic: "走向" },
  ],
  CROSS: [
    { label: "铺垫", logic: "事情怎么铺过来的" },
    { label: "推力", logic: "正在把局面往前推的那一股" },
    { label: "核心", logic: "五线心脏，整句先看这里" },
    { label: "落地", logic: "落到什么现场、什么动作上" },
    { label: "收局", logic: "这条线收到什么结果上" },
  ],
  SQUARE: [
    { label: "左上·环境", logic: "角落拉扯，不是主轴" },
    { label: "上·念头", logic: "脑子里在转什么" },
    { label: "右上·环境", logic: "角落拉扯" },
    { label: "左·已然", logic: "已经发生、已经在场" },
    { label: "中心", logic: "九宫心脏，先看这里" },
    { label: "右·将然", logic: "接下来会碰到什么" },
    { label: "左下·环境", logic: "角落拉扯" },
    { label: "下·根基", logic: "日子、身体、底盘" },
    { label: "右下·环境", logic: "角落拉扯" },
  ],
  GRAND_TABLEAU: [
    { label: "问卜者", logic: "自我、当事人核心状态" },
    { label: "家", logic: "住所、家庭空间、安全感" },
    { label: "想法", logic: "计划、念头、思维" },
    { label: "家庭", logic: "家族、根源、血缘" },
    { label: "子女/创意", logic: "新生命、创造、纯真" },
    { label: "健康", logic: "身体、日常、活力" },
    { label: "伴侣", logic: "合作、一对一关系" },
    { label: "结束", logic: "转化、死亡与重生" },
    { label: "灵性", logic: "信仰、更高意义" },
    { label: "事业", logic: "工作、社会角色" },
    { label: "希望", logic: "愿望、期待" },
    { label: "潜意识", logic: "隐藏、梦、未觉察" },
    { label: "沟通", logic: "讯息、表达、传递" },
    { label: "金钱", logic: "财富、资源、流动" },
    { label: "焦虑", logic: "阻碍、担忧" },
    { label: "喜悦", logic: "快乐、享受" },
    { label: "权威", logic: "长辈、制度、规则" },
    { label: "阻碍", logic: "限制、瓶颈" },
    { label: "远行", logic: "迁移、变动、距离" },
    { label: "外在环境", logic: "他人、外界、局势" },
    { label: "支持", logic: "贵人、资源、助力" },
    { label: "对立", logic: "挑战、敌人、张力" },
    { label: "爱情", logic: "浪漫、激情、吸引" },
    { label: "牺牲", logic: "付出、放下" },
    { label: "遗产/契约", logic: "传承、承诺、循环" },
    { label: "疾病/耗损", logic: "耗损、担忧、脆弱" },
    { label: "亲密", logic: "欲望、隐私、深度" },
    { label: "死亡", logic: "终结、转型、放手" },
    { label: "扩张", logic: "成长、机会、拓展" },
    { label: "关系", logic: "婚姻、承诺、长期" },
    { label: "教学", logic: "学习、智慧、传承" },
    { label: "放下", logic: "释放、结束" },
    { label: "秘密", logic: "未知、业力、隐藏" },
    { label: "成功", logic: "收获、认可" },
    { label: "变动", logic: "意外、转折" },
    { label: "完成", logic: "业力、总结、终局" },
  ],
};

export function spreadIdToKind(spreadId: LenormandSpreadId): LenormandSpreadKind {
  switch (spreadId) {
    case "line3":
      return "TRIAD";
    case "line5":
      return "CROSS";
    case "box9":
      return "SQUARE";
    case "grand":
      return "GRAND_TABLEAU";
    default:
      return "TRIAD";
  }
}

/** 用户可见解读：单面连读，无正逆位。 */
export function buildLenormandFreeReadingZh(
  spreadId: LenormandSpreadId,
  cards: LenormandCard[],
  inquiry?: string,
): string {
  return buildLenormandMasterReadingZh(spreadId, cards, inquiry);
}
