/**
 * 主路径 × 个人年 交叉判读：表内真源在 `numerology-cross-pair-table-zh`（含大师数行/列）。
 * 镜鉴/KPI 外包文案见 `numerology-cross-pair-handbook-zh`，口径与首段高光脚注一致。
 */



import {
  handbookWrapCrossPairAdvice,
  handbookWrapCrossPairTaboo,
  handbookWrapCrossPairThesisLine,
  handbookWrapCrossPairUnfold,
} from "@/lib/numerology-cross-pair-handbook-zh";
import { numerologyCrossPairTableLookupZh } from "@/lib/numerology-cross-pair-table-zh";



export type PairReading = {

  thesis: string;

  unfold: string;

  taboo: string;

  advice: string;

};



/** 首屏灰条：定性 + 展开 */

export function numerologyCrossPairInstantPartsZh(lifePath: number, personalYear: number): { lead: string; unfold: string } {

  const cell = numerologyCrossPairTableLookupZh(lifePath, personalYear);

  return {

    lead: `主路径 ${lifePath}、个人年 ${personalYear}：${cell.thesis}`,

    /** 与镜鉴「展开」同源；首屏灰条只用 `lead`，此处供导出等复用 */
    unfold: handbookWrapCrossPairUnfold(cell.unfold, lifePath, personalYear),

  };

}



export function numerologyCrossPairReadingZh(lifePath: number, personalYear: number): PairReading {

  const cell = numerologyCrossPairTableLookupZh(lifePath, personalYear);

  const thesisLine = `主路径 ${lifePath}、个人年 ${personalYear}：${cell.thesis}`;

  return {

    thesis: handbookWrapCrossPairThesisLine(thesisLine),

    unfold: handbookWrapCrossPairUnfold(cell.unfold, lifePath, personalYear),

    taboo: handbookWrapCrossPairTaboo(cell.taboo, lifePath, personalYear),

    advice: handbookWrapCrossPairAdvice(cell.advice, lifePath, personalYear),

  };

}


