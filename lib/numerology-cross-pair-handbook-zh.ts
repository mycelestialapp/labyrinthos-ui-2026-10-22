/**
 * 主路径 × 个人年：镜鉴/KPI 用文案层（不修改 `numerology-cross-pair-table-zh` 原文）。
 * 先交代「这一格在命盘里管什么」，再接表内句，避免只剩表句看不出入口。
 */

/** KPI「年度侧写」等：主路径×个人年一句 + 跟读说明 */
export function handbookWrapCrossPairThesisLine(line: string): string {
  const core = line.trim();
  return `【镜鉴·定性·侧写】
${core}

【镜鉴·定性·跟读】
这里只讲两件事叠在一起：「你这条命的主线」和「今年外圈气氛」。旁边「展开 / 戒线 / 行法」接着写今年容易撞上的场面、别踩的线、能做的事。生日数、姓名三数在别的格里，别混进这一句里一起判。`;
}

/** 展开：先点明叠数与段落职责，再接表内场面正文。 */
export function handbookWrapCrossPairUnfold(unfold: string, lifePath: number, personalYear: number): string {
  const u = unfold.trim();
  return `【镜鉴·展开】
主路径 ${lifePath} 遇上今年个人年 ${personalYear}：下面写这一年里容易反复出现的场面（上班、家里、心情都可以对号入座）。具体句子来自表内原文。

${u}`;
}

/** 戒线：先点明「禁区」指什么，再接表内条文。 */
export function handbookWrapCrossPairTaboo(taboo: string, lifePath: number, personalYear: number): string {
  const t = taboo.trim();
  return `【镜鉴·戒线】
还是主路径 ${lifePath}、今年个人年 ${personalYear}：下面是「一碰就容易把全年拖垮」的习惯，当红灯看。数字帮你避雷，不是骂你。

${t}`;
}

/** 行法：先点明「动作」指什么，再接表内条目。 */
export function handbookWrapCrossPairAdvice(advice: string, lifePath: number, personalYear: number): string {
  const a = advice.trim();
  return `【镜鉴·行法】
还是主路径 ${lifePath}、今年个人年 ${personalYear}：下面是能写进日历、按周做的小事，照做就行。

${a}`;
}
