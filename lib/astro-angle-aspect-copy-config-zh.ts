/**
 * 轴点相位观测：主解读句库（出生盘基座）；盘型差异由 `astro-observation-main-copy-by-chart-kind-zh` patch。
 */
export type AngleAspectCopyConfigZh = {
  statusLine: string;
  answer: {
    happened: string;
    risk: string;
    synergyTemplate: string;
    todayTemplate: string;
  };
  pro: {
    socialFrictionTemplate: string;
    entryPressureTemplate: string;
    interfaceMicroAdjustWithMinorTemplate: string;
    interfaceMicroAdjustEmpty: string;
  };
  precision: {
    matrix: string;
    majorEmpty: string;
    minorEmpty: string;
  };
  actions: {
    a0Template: string;
    a1Template: string;
    a2: string;
  };
};

export const ANGLE_ASPECT_COPY_CONFIG_ZH: AngleAspectCopyConfigZh = {
  statusLine: "本表在说什么：你心里那股劲，和「别人眼里你该怎样」之间，有没有拧着。",
  answer: {
    happened:
      "行星和上升、天顶打交道，就像内心戏撞上社会角色：你想做自己，场合又要求你像另一个人，中间就容易扯着疼。",
    risk:
      "风险是什么：在外面越要体面，回家或独处时越容易憋或炸；若盘里主轴本来就紧，这种拉扯会更明显。",
    synergyTemplate:
      "协同建议：留意 {aspect} 这类配置——有时恰恰是「肯示弱、肯说清楚伤口」反而让关系松一点，不必一直硬扛。",
    todayTemplate: "今天怎么做：对外的事别排太满，给自己留大约 {reserve} 的空白；喘口气比硬撑像样更重要。",
  },
  pro: {
    socialFrictionTemplate:
      "社会角色与心情：{aspect}。职业或公众形象想要的，和情绪底色不一定同频，这不等于路走错了，只是劲不容易使在一处。",
    entryPressureTemplate:
      "出场压力：{aspect}。新环境或见生人时，你会更谨慎、更慢热，这更像自我保护，不是能力不足。",
    interfaceMicroAdjustWithMinorTemplate:
      "细节微调：{snippet}。小事上多一句确认、慢一点表态，往往比硬撑大局更省事。",
    interfaceMicroAdjustEmpty: "细节微调：次要轴点相位不多，先把上面主轴的几条理顺就够。",
  },
  precision: {
    matrix: "轴点交互矩阵：Angles Aspect Matrix（来源：星体与上升/天顶卡片）",
    majorEmpty: "无主轴高压相位",
    minorEmpty: "无边缘补偿相位",
  },
  actions: {
    a0Template:
      "别把别扭当结论：{aspect} 带来的阻力，多半是当下节奏问题，不必因此否定长期方向。",
    a1Template:
      "边界软一点：{aspect} 容易让你绷得太紧，正式场合也可以留一小处不那么「完美」的缝隙。",
    a2: "涉及个人立场时，先听清对方一句、再回一句，避免抢话造成误会。",
  },
};
