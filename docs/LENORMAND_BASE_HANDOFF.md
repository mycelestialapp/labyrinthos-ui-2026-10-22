# 雷诺曼解读底座 — 交接备忘（可随时删）

> 你重启前让「先保存、下次能看懂」——本文件 + Git 提交一起留档。

## 分支与提交

- **分支**：`checkpoint/numerology-pre-3d-ui`
- **建议**：拉代码后 `git log -1` 看本次提交的说明；所有雷诺曼相关未跟踪文件应已纳入提交。

## 这轮在做什么

- **产品**：站内雷诺曼（Lenormand）免费解读链路：问题分类 → 母题匹配（规划中加强）→ 牌阵职责 → 逐位 + 单牌正反（按大类/牌阵/意图/证据）→ 合局与边界。
- **用户红线**：13/15 大类母题要紧贴主题、**宁可少答也不要错答**；母题层需：类内封闭、主主题命中、角度/同义、排除词、低置信度不硬判（**上一轮对话里计划继续优化匹配，尚未全部落地**）。

## 目录与文件（心智模型）

| 区域 | 路径 | 作用 |
|------|------|------|
| 路由/页面 | `app/lenormand/` | 雷诺曼入口与页面 |
| UI | `components/lenormand/` | 牌阵、交互等 |
| 导航 | `components/BottomNav.tsx`, `components/UniverseHub.tsx` | 入口挂载 |
| 牌数据 | `lib/lenormand-cards.ts`, `lib/lenormand-spread-id.ts` | 36 牌、牌阵 id |
| 问题域 | `lib/question-category-keywords.ts`, `lib/question-classification.ts`, `lib/question-guidance-topics.ts` | 大类关键词与指引 |
| 解读底座 | `lib/lenormand-reading-base-zh.ts` | 问题画像、牌阵元信息、组装 blocks |
| 类型 | `lib/lenormand-reading-types.ts` | `ReadingIntent` / `EvidenceLevel`（避免循环引用） |
| 语义矩阵 | `lib/lenormand-semantic-matrix-zh.ts` | 36 牌基底 + 大类/牌阵/意图/证据 → `getCardContextPolarity` |
| 母题库 | `lib/lenormand-mother-topics-13x500-zh.ts` | 按类 50×10=500 条结构；`matchMotherTopic` / `matchMotherTopicDetailed` |
| 感情 500（旧/并行） | `lib/lenormand-love-mother-topics-500-zh.ts` | 感情专用 50×10，可与总库并存，注意是否重复引用 |
| 免费解读输出 | `lib/lenormand-free-reading-zh.ts` | 拼最终中文段落 |
| 其它文案 | `lib/lenormand-reading-copy.ts`, `lib/lenormand-vetted-deep-readings-zh.ts` | 展示/深读文案 |

## 已知缺口（下次打开优先看）

1. **`CORE_13_CATEGORIES` 与全部分类不一致**：`question-category-keywords` 里还有 **`宠物`、`占风水`** 等，若母题只按当前 `CORE_13_CATEGORIES` 生成，则这些大类桶里可能是**空数组**，命中会失效。下次应统一为「除 `其他` 外全部领域」或明确文档写死只支持 13 类。
2. **母题防误判**：需落实「主主题 + 角度/同义词」双阈值、排除词、低分不输出母题 ID；当前匹配仍偏关键词打分，易在口语问法下不稳。
3. **模板层**：用户约定底座打牢后再做「解读文案模板」；模板未开工。
4. **成稿库 / 500 母题逐条细化**：方案上还有成稿优先、原型映射等，未接入工程。

## 本地开发

- 预览：`npm run dev` → http://localhost:3088（以仓库 `package.json` 为准）。

---
*生成时间：会话交接；改完底座可删本文件或改成正式设计文档。*
