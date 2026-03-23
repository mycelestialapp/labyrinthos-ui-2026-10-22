export type ColorEntry = {
  id: `C-${string}`;
  name: string;
  hex: `#${string}`;
};

export type NumberEntry = {
  id: `N-${string}`;
  value: number;
  keyword: string;
};

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export const COLOR_TABLE: ColorEntry[] = [
  { id: "C-01", name: "黑曜", hex: "#050505" },
  { id: "C-02", name: "虚空紫", hex: "#1a0b3d" },
  { id: "C-03", name: "流金", hex: "#D4AF37" },
  { id: "C-04", name: "紫晶", hex: "#6D28D9" },
  { id: "C-05", name: "靛纱", hex: "#312E81" },
  { id: "C-06", name: "子夜青", hex: "#0B1F3A" },
  { id: "C-07", name: "琥珀金", hex: "#B8860B" },
  { id: "C-08", name: "香槟", hex: "#E7D3A0" },
  { id: "C-09", name: "月绢", hex: "#EDE7D9" },
  { id: "C-10", name: "蔷薇尘", hex: "#C08497" },
  { id: "C-11", name: "绯印", hex: "#9F1239" },
  { id: "C-12", name: "深红宝石", hex: "#7F1D1D" },
  { id: "C-13", name: "翠雾", hex: "#0F766E" },
  { id: "C-14", name: "玉影", hex: "#14532D" },
  { id: "C-15", name: "鼠尾草晕", hex: "#86A789" },
  { id: "C-16", name: "海玻璃", hex: "#0EA5E9" },
  { id: "C-17", name: "碧流", hex: "#22C55E" },
  { id: "C-18", name: "天珠", hex: "#F5F3FF" },
  { id: "C-19", name: "烟晶", hex: "#3F3F46" },
  { id: "C-20", name: "铜晕", hex: "#A16207" },
  { id: "C-21", name: "黄玉光", hex: "#F59E0B" },
  { id: "C-22", name: "鸢尾夜", hex: "#4C1D95" },
  { id: "C-23", name: "梅影", hex: "#3B0764" },
  { id: "C-24", name: "淡紫痕", hex: "#A78BFA" },
];

export const NUMBER_TABLE: NumberEntry[] = Array.from({ length: 99 }, (_, i) => {
  const value = i + 1;
  const id = `N-${pad2(value)}` as const;

  const keyword =
    value === 11
      ? "门扉"
      : value === 22
        ? "筑构"
        : value === 33
          ? "指引"
          : value % 9 === 0
            ? "圆满"
            : value % 7 === 0
              ? "洞察"
              : value % 5 === 0
                ? "势能"
                : value % 3 === 0
                  ? "对齐"
                  : "信号";

  return { id, value, keyword };
});

export function getColorById(id: ColorEntry["id"]) {
  return COLOR_TABLE.find((c) => c.id === id) ?? COLOR_TABLE[0];
}

export function getNumberById(id: NumberEntry["id"]) {
  return NUMBER_TABLE.find((n) => n.id === id) ?? NUMBER_TABLE[0];
}

