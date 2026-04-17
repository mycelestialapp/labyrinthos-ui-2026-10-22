/**
 * 毕达哥拉斯生命数字演算（与 `lib/numerology-profile.ts`、接口 `/api/numerology/profile` 同源）
 *
 * 与多数英文圈「Pythagorean」软件一致的核心：
 * - 主路径：月化约 + 日化约 + 出生年化约 → 求和 → `reduceWithMaster`（可保留 11 / 22 / 33）
 * - 生日数：仅 `reduceDay(日)`（日 11、22 保留，其余化约）
 * - 个人年：月化约 + 日化约 + **目标公历年**各位数字化约 → 求和 → `reduceWithMaster`
 * - 姓名三数：A=1…I=9 表；元音→灵魂、辅音→人格、全字母→表现
 *
 * 与部分「主流」站点可能不一致的一处（本仓库已固定）：
 * - **出生月份为 11 月**：此处 `reduceMonth(11)` 保留 **11** 再参与相加；若对方把 11 先收成 2，主路径与个人年会整体偏移。
 * - 若需与某一站逐位对齐，请用同一规则处理 11 月与 11/22 日后再比。
 */

function digitSum(n: number): number {
  let x = Math.abs(Math.floor(n));
  let s = 0;
  while (x > 0) {
    s += x % 10;
    x = Math.floor(x / 10);
  }
  return s;
}

/** 化约至 1–9，或保留大师数 11 / 22 / 33 */
export function reduceWithMaster(n: number): number {
  let v = n;
  while (v > 9 && v !== 11 && v !== 22 && v !== 33) {
    v = digitSum(v);
  }
  return v;
}

function reduceMonth(month: number): number {
  if (month === 11) return 11;
  return reduceWithMaster(digitSum(month));
}

function reduceDay(day: number): number {
  if (day === 11 || day === 22) return day;
  return reduceWithMaster(digitSum(day));
}

function reduceYear(year: number): number {
  return reduceWithMaster(digitSum(year));
}

/** 生命路径数 */
export function lifePathNumber(month: number, day: number, year: number): number {
  const a = reduceMonth(month);
  const b = reduceDay(day);
  const c = reduceYear(year);
  return reduceWithMaster(a + b + c);
}

/** 生日数（日） */
export function birthdayNumber(day: number): number {
  return reduceDay(day);
}

/** 个人年：当年 */
export function personalYear(month: number, day: number, forYear: number): number {
  const a = reduceMonth(month);
  const b = reduceDay(day);
  const c = reduceWithMaster(digitSum(forYear));
  return reduceWithMaster(a + b + c);
}

const LETTER_VAL: Record<string, number> = (() => {
  const rows = ["ajs", "bkt", "clu", "dmv", "enw", "fox", "gpy", "hqz", "ir"];
  const m: Record<string, number> = {};
  rows.forEach((row, i) => {
    const v = i + 1;
    for (const ch of row) m[ch] = v;
  });
  return m;
})();

const VOWELS = new Set("aeiou".split(""));

function nameLettersNormalized(name: string): string[] {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "")
    .split("");
}

/** 姓名框里是否含至少一个 a–z（与三数算法同一套清洗规则；纯中文会被判为「无字母」） */
export function numerologyNameHasLatinLetters(name: string): boolean {
  return nameLettersNormalized(name).length > 0;
}

/** 表现数（全名字母，无拉丁字母时返回 null） */
export function expressionNumber(fullNameLatin: string): number | null {
  const letters = nameLettersNormalized(fullNameLatin);
  if (letters.length === 0) return null;
  const sum = letters.reduce((acc, ch) => acc + (LETTER_VAL[ch] ?? 0), 0);
  return reduceWithMaster(sum);
}

/** 灵魂冲动数（元音） */
export function soulUrgeNumber(fullNameLatin: string): number | null {
  const letters = nameLettersNormalized(fullNameLatin).filter((ch) => VOWELS.has(ch));
  if (letters.length === 0) return null;
  const sum = letters.reduce((acc, ch) => acc + (LETTER_VAL[ch] ?? 0), 0);
  return reduceWithMaster(sum);
}

/** 人格数（辅音） */
export function personalityNumber(fullNameLatin: string): number | null {
  const letters = nameLettersNormalized(fullNameLatin).filter((ch) => !VOWELS.has(ch));
  if (letters.length === 0) return null;
  const sum = letters.reduce((acc, ch) => acc + (LETTER_VAL[ch] ?? 0), 0);
  return reduceWithMaster(sum);
}

/** 生命路径中间步（供第二段备忘表 / 导出对数区） */
export type LifePathBreakdown = {
  monthReduced: number;
  dayReduced: number;
  yearReduced: number;
  combinedRaw: number;
  lifePath: number;
};

export function computeLifePathBreakdown(month: number, day: number, year: number): LifePathBreakdown {
  const monthReduced = reduceMonth(month);
  const dayReduced = reduceDay(day);
  const yearReduced = reduceYear(year);
  const combinedRaw = monthReduced + dayReduced + yearReduced;
  return {
    monthReduced,
    dayReduced,
    yearReduced,
    combinedRaw,
    lifePath: reduceWithMaster(combinedRaw),
  };
}
