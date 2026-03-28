# 旧项目占星文案迁移清单（v1）

## 已完成

- 已确认旧项目路径：`D:/Dmy-projects`
- 已接入当前项目文案优先源：`lib/legacy-astrology-seed-zh.ts`
- 已迁移并启用 **12 太阳星座** 文案（本命段）
- 已接入到：
  - `buildNatalReadingFullMarkdown`
  - `buildNatalReadingCompactMarkdown`
- 回退策略生效：若迁移源缺失，自动使用当前项目原文案

## 来源映射

- 旧项目种子：
  - `D:/Dmy-projects/src/lib/astrologyReadingSeed.ts`
  - 仅含 `aquarius`
- 旧项目主语料：
  - `D:/Dmy-projects/src/i18n/locales/zh-Hant.json`
  - 使用 `oracle.signs.{sign}.interpretation / traits / career / growth` 进行迁移整理

## 仍待迁移（旧项目中无直接等价结构）

- 月亮 12 星座长文（当前继续使用本项目现有成熟文案）
- 上升 12 星座长文（当前继续使用本项目现有成熟文案）
- 关系镜像（上升-下降）专段（当前继续使用本项目现有成熟文案）
- 三十日行动段（当前继续使用本项目现有成熟文案）

## 下一步建议（v2）

1. 从旧项目 `oracle.signs` 中迁移 `love / health / strengths / weaknesses`，作为「短卡增强版」可选段落。
2. 新建 `legacy-astrology-tone-map-zh.ts`，统一旧项目语气与当前项目「导师风」口径。
3. 增加 `MIGRATION_TOGGLE`（环境变量或配置项），支持 A/B 对比旧版与新版文案。

