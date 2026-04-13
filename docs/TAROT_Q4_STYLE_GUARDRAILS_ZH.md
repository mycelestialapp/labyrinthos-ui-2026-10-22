# 感情第四问 · 风格红线与去套话（中文）

## 必须保留（体例，不因去重而动）

- **五段式结构**不变：`cardSpeaking` / `psychologyLayer` / `spiritLayer` / `actionPath` / `masterSummary`。感情婚姻大师题库**不含**工具箱类段落。
- **心理层**优先保留「关系现状 → 心理 → 根源」三层逻辑（可与本题「走向 / 影响」自然咬合，不必硬贴第三问「功课」口吻）。
- **灵性层**仍要有一句能停住的「核心启示」式收束；**行动层**仍要具体可做，并保留「检查行囊」类自省（与第二问可执行感一致）。
- **用词禁忌**：延续全库大师文案约定；用户可见正文慎用半角 `*` 作强调（与工具链一致）。

## 允许、且鼓励变化（表层，去广播腔）

- **牌开口**的起势：画面、短问、钉刺、叙事，**因牌而异**；避免 156 条共用同一钩子句。
- **走向**：每条至少有一处让人读出**势头**（在收紧、在松动、在空转、在爬坡、在回摆等），不要只重复「信号 / 枢纽」而无形。
- **总结句**：每牌有自己的「魂」，避免同一前缀填空（如固定「走向与杠杆：」全场重复）。

## 验收

- 运行 `npm run lint:q4-tone` 查看套话出现次数（当前为基线报告）。
- `npm run lint:q4-tone:strict`：各短语有独立上限（见 `scripts/lint-tarot-q4-duplicate-tone.mjs` 内 `MONITORED_PHRASES`）；未写 `max` 的条目默认 ≤`LINT_Q4_PHRASE_MAX` 或 `--max=`（默认 10）。`宇宙在借` 默认 ≤40，可与第二问语感衔接，但仍不宜条条同一骨架。
- 当前第四问若为第三问迁移版，strict **会失败**，属预期；去套话后再将 strict 接进合并流程。

## 生成第四问正文（推荐）

- `npm run tarot:q4-from-q1q2:rebuild`：`build-q4-from-q1q2.mjs` 读库内第一问、第二问 → 写 `q4-love-energy-fragment.ts` → `merge-q4-love-energy.mjs` → 打包 `tarotQuestionLoveContent.js`。

## 人读备份

本文件为产品侧约定；套话巡检：`scripts/lint-tarot-q4-duplicate-tone.mjs`。
