/**
 * 第四～二十问（及全量 rebuild 中同属区间的题目）：已升格或正在分批手改大师终稿时，
 * 将 constName 加入此集合，rebuild 脚本将**跳过**该题全部 156 条，避免母版派生覆盖现稿。
 *
 * 逐题完成后可继续冻结下一题；若需对某题重新派生，先从 Set 删除对应 constName 再跑 rebuild。
 */

/** @type {ReadonlySet<string>} */
export const FROZEN_LOVE_REBUILD_MASTER_CONSTS = new Set([
  /** 第 4 问：大师终稿分批写入中（当前库内已改牌位勿被覆盖） */
  "我们目前的关系能量走向如何我可以做什么来影响它",
]);
