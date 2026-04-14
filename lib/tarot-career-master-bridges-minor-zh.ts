/**
 * 事业大师向 · 题×小牌点数桥接（20 题 × 14 点数 × 正逆）
 */

import { CAREER_TAG_PSYCH } from './tarot-career-master-bridges-major-zh';

const UP_TAIL: readonly string[] = [
  '先认最硬那一项交付，再谈冲不冲。',
  '越早对齐责任人与截止，越早止损。',
  '三角里别永远牺牲睡眠或诚信。',
  '稳定来自小惯例；今晚守住一页工作记录。',
  '冲突带上书面与流程，别只带脾气。',
  '中段要有复盘日与对接人。',
  '走险棋可以，先写睡眠与合规底线。',
  '加速前检查刹车：情绪与支持系统。',
  '顶格压力分段谈、分段交。',
  '目标写纸上；空想不会变履历。',
  '第一次升级很难，允许结巴。',
  '定一天去执行：带表不带情绪。',
  '温柔而清楚，成果与请求并排。',
  '扛责带计划，不是只倒苦水。',
];

const DN_TAIL: readonly string[] = [
  '别用新承诺盖旧洞，先止血。',
  '小拖一夜会滚成事故；今晚认领一格。',
  '怕冲突就只剩一个人扛；先立底线。',
  '死板是怕变；方法可改，目标别丢。',
  '赢嘴输关系不划算；先交一样动作。',
  '躲已读只会让提醒更刺耳。',
  '孤勇要有退路；别只剩赌一口气。',
  '冲太快会翻车；先补觉再问前途。',
  '崩溃式诉苦会吓到人；求助要短。',
  '想要的太多会冻结；先保一条主线。',
  '别用脾气代替把截止说清楚。',
  '别冲动发誓；说到做不到更伤信用。',
  '别说你都不懂，说我需要你配合哪一步。',
  '别装全扛得住；示弱有时是推进。',
];

export const CAREER_MINOR_RANK_BRIDGE: readonly (readonly (readonly [string, string])[])[] =
  CAREER_TAG_PSYCH.map((scene) => {
    const stem = scene.endsWith('。') ? scene.slice(0, -1) : scene;
    return UP_TAIL.map((up, idx) => {
      const u = `这一步：${stem}；${up}`;
      const d = `这一步：${stem}；${DN_TAIL[idx]!}`;
      return [u, d] as const;
    });
  });
