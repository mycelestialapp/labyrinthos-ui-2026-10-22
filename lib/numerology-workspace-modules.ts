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
  {
    id: "gate",
    label: "寰宇之门",
    path: "/numerology",
    status: "ready",
    description: "首段高光与手册、KPI、镜鉴；节律与接口入口",
  },
  {
    id: "chart",
    label: "个人星图",
    path: "/numerology/chart",
    status: "ready",
    description: "与寰宇之门同源读数；主路径与辅数一览",
  },
  {
    id: "matrix",
    label: "能量矩阵",
    path: "/numerology/matrix",
    status: "ready",
    description: "九宫收束格数，示何数常响；伴读压齐三线，手册叠读以主路、个人年为轴，可跳读",
  },
  {
    id: "wheel",
    label: "时序轮盘",
    path: "/numerology/wheel",
    status: "ready",
    description: "多年个人年成表；算法与之门同源，岁意深浅仍归镜鉴与年度侧写",
  },
  {
    id: "syn",
    label: "共鸣分析",
    path: "/numerology/syn",
    status: "ready",
    description: "双人主路径矩阵定稿与合拍档位；沟通提纲式备忘，仅供整理",
  },
  {
    id: "lab",
    label: "炼金工具",
    path: "/numerology/lab",
    status: "ready",
    description: "化约链演示；与第二段备忘表规则互证",
  },
];
