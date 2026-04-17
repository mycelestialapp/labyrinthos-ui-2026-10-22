/**
 * 导出**全部**主路径合拍与侧栏定稿为 Markdown（stdout 或第二参数路径）。
 * 用法：`npm run dump:numerology-pair-md` 或 `npm run dump:numerology-pair-md -- out.md`
 */
import { writeFileSync } from "node:fs";

import { lifePathPairTwinManualBodyZh } from "@/lib/numerology-life-path-pair-compat-zh";
import {
  ALL_LIFE_PATH_ORDERED_PAIRS_144,
  lifePathPairCatalogBodyZh,
} from "@/lib/numerology-life-path-pair-catalog-zh";
import {
  allPairMatrixDualDraftsZh,
  formatPairMatrixBodyMarkdownZh,
} from "@/lib/numerology-life-path-pair-matrix-enumerate-zh";
import { LIFE_PATH_PLATEAU_NUMBERS } from "@/lib/numerology-life-path-pair-matrix-manual-zh";
import { rawIntegerToPlateauMap1To99 } from "@/lib/numerology-life-path-raw-pair-catalog-zh";
import { allLifePathSideManualRowsZh } from "@/lib/numerology-life-path-side-manual-zh";

function md(s: string): string {
  return s;
}

function main(): void {
  const lines: string[] = [];
  lines.push(md("# 生命灵数：合拍与侧栏文案全量导出"));
  lines.push("");
  lines.push(
    md(
      `盘面全集：${LIFE_PATH_PLATEAU_NUMBERS.join("、")}。异数合拍为 **66 无序数对 × 各 2 套手写**；同数 **12 条 twin**；工作台序向 **144** 见第二节逐条。`,
    ),
  );
  lines.push("");

  lines.push(md("## 一、侧栏「主路径与生命密码」12 盘面 × 3 段"));
  lines.push("");
  for (const row of allLifePathSideManualRowsZh()) {
    lines.push(md(`### 主路径 ${row.lifePath}`));
    lines.push("");
    lines.push(md(`**古代** ${row.ancient}`));
    lines.push("");
    lines.push(md(`**气质** ${row.glance}`));
    lines.push("");
    lines.push(md(`**来由** ${row.principle}`));
    lines.push("");
  }

  lines.push(md("## 二、合拍异数 66 对 × 双稿（小→大 / 大→小）"));
  lines.push("");
  for (const d of allPairMatrixDualDraftsZh()) {
    lines.push(md(`### 无序 ${d.keyLoHi}（小=${d.lo}，大=${d.hi}）`));
    lines.push("");
    lines.push(formatPairMatrixBodyMarkdownZh(d.bodyWhenMeIsLo, `我=${d.lo}，对方=${d.hi}`));
    lines.push("");
    lines.push(formatPairMatrixBodyMarkdownZh(d.bodyWhenMeIsHi, `我=${d.hi}，对方=${d.lo}`));
    lines.push("");
  }

  lines.push(md("## 三、同数 twin（12 条）"));
  lines.push("");
  for (const n of LIFE_PATH_PLATEAU_NUMBERS) {
    const t = lifePathPairTwinManualBodyZh(n);
    lines.push(md(`### 两人皆主路径 ${n}`));
    lines.push("");
    lines.push(formatPairMatrixBodyMarkdownZh(t));
    lines.push("");
  }

  lines.push(md("## 四、工作台 12×12 序对（144）逐条（与第二节异数+第三节同数一致）"));
  lines.push("");
  for (const [me, ot] of ALL_LIFE_PATH_ORDERED_PAIRS_144) {
    const b = lifePathPairCatalogBodyZh(me, ot);
    lines.push(md(`### 我 ${me} × 对方 ${ot}`));
    lines.push("");
    lines.push(formatPairMatrixBodyMarkdownZh(b));
    lines.push("");
  }

  lines.push(md("## 五、任意整数 1–99 → 主路径盘面（化约全表）"));
  lines.push("");
  lines.push(md("以下每条原数经 `reduceWithMaster` 化约后，再进入上列 12×12 / twin 定稿；**不另写 99² 篇**。"));
  lines.push("");
  for (const { raw, plateau } of rawIntegerToPlateauMap1To99()) {
    lines.push(md(`- **${raw}** → ${plateau}`));
  }
  lines.push("");

  const out = lines.join("\n");
  const path = process.argv[2];
  if (path) {
    writeFileSync(path, out, "utf8");
    console.error(`wrote ${path} (${out.length} chars)`);
  } else {
    process.stdout.write(out);
  }
}

main();
