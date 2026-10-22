/**
 * 事业工作 · 子类字典（600）
 * 生成方式：以职业场景模板扩展为固定 600 子类，编号 2.1 ~ 2.600
 */

export interface CareerSubcategory {
  id: string;
  index: number;
  name: string;
  gate: string;
}

export const CAREER_SUBCATEGORY_COUNT = 600;

export const CAREER_SUBCATEGORY_GATES = [
  '职业方向',
  '求职与面试',
  '跳槽与转行',
  '升职与晋升',
  '团队关系',
  '上级沟通',
  '项目执行',
  '绩效考核',
  '薪资与谈判',
  '创业与副业',
  '裁员与风险',
  '职业成长',
] as const;

const CAREER_INTENTS = [
  '是否跳槽',
  '是否转行',
  '是否离职',
  '是否接受新offer',
  '是否主动争取升职',
  '是否适合创业',
  '是否继续当前项目',
  '如何提升面试通过率',
  '如何提升职场竞争力',
  '如何提升汇报表达力',
  '如何提升结果产出',
  '如何谈到更高薪资',
  '如何处理团队协作冲突',
  '如何与上级有效沟通',
  '如何处理同事关系压力',
  '如何突破职业瓶颈',
  '如何避免被边缘化',
  '如何应对绩效考核压力',
  '如何应对裁员风险',
  '如何规划职业方向',
  '如何规划三个月职业目标',
  '如何规划一年职业路径',
  '如何积累管理能力',
  '如何建立个人职业品牌',
  '如何争取核心资源',
  '如何争取关键项目',
  '如何平衡主业与副业',
  '如何提升跨部门协同效率',
  '如何重建职业信心',
  '如何判断岗位发展天花板',
] as const;

const CAREER_CONTEXTS = [
  '在当前岗位阶段',
  '在试用期阶段',
  '在核心项目周期',
  '在绩效评估周期',
  '在组织调整阶段',
  '在部门变动阶段',
  '在高压工作状态下',
  '在资源紧张情况下',
  '在上级强势管理下',
  '在团队关系敏感期',
  '在业务增长停滞期',
  '在结果不达预期时',
  '在准备求职面试时',
  '在拿到多个offer时',
  '在考虑副业并行时',
  '在想转管理岗位时',
  '在想走专家路线时',
  '在想创业启动前',
  '在准备年度复盘时',
  '在职业焦虑明显时',
] as const;

const CAREER_NAMES: string[] = CAREER_CONTEXTS.flatMap(context =>
  CAREER_INTENTS.map(intent => `${context}${intent}`),
);

if (CAREER_NAMES.length !== CAREER_SUBCATEGORY_COUNT) {
  throw new Error(
    `Career subcategory count mismatch: expected ${CAREER_SUBCATEGORY_COUNT}, got ${CAREER_NAMES.length}`,
  );
}

export function buildCareerSubcategoryCatalog(): CareerSubcategory[] {
  const gates = CAREER_SUBCATEGORY_GATES;
  return CAREER_NAMES.map((name, i) => {
    const index = i + 1;
    const gate = gates[i % gates.length];
    return {
      id: `2.${index}`,
      index,
      name,
      gate,
    };
  });
}

