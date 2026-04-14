/** 坛城数轨工作台模块清单（与侧栏 id 对齐；供 manifest API 与后续路由接线） */

export type NumerologyModuleStatus = "ready" | "planned";

export type NumerologyWorkspaceModule = {
  id: string;
  label: string;
  /** 目标路径；planned 时可为未来路由 */
  path: string;
  status: NumerologyModuleStatus;
  description: string;
};

export const NUMEROLOGY_WORKSPACE_MODULES: NumerologyWorkspaceModule[] = [
  { id: "gate", label: "寰宇之门", path: "/numerology", status: "ready", description: "公历生辰与主路径、辅数入口" },
  { id: "chart", label: "个人星图", path: "/numerology/chart", status: "ready", description: "主路径与辅数一览、曼陀罗缩略" },
  { id: "matrix", label: "能量矩阵", path: "/numerology/matrix", status: "ready", description: "九数基底格与当前命盘高亮" },
  { id: "wheel", label: "时序轮盘", path: "/numerology/wheel", status: "ready", description: "相邻年份个人年列表" },
  { id: "syn", label: "共鸣分析", path: "/numerology/syn", status: "ready", description: "甲乙生辰主路径对照摘要" },
  { id: "archive", label: "智慧档案", path: "/numerology/archive", status: "ready", description: "本机快照保存与载入" },
  { id: "lab", label: "炼金工具", path: "/numerology/lab", status: "ready", description: "数位和与化约演示" },
];
