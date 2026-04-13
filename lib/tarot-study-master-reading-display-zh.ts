import { STUDY_QUESTION_TEXTS } from './tarot-master-question-content-study-texts-only';
import { STUDY_QUESTION_BAND_ZH } from './tarot-study-question-band-zh';

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 按题干取题脉短签；未命中题库时回退「学业」。 */
export function studyQuestionBandForText(questionText: string): string {
  const q = questionText.trim();
  const i = STUDY_QUESTION_TEXTS.findIndex((t) => t === q);
  if (i < 0) return '学业';
  return STUDY_QUESTION_BAND_ZH[i] ?? '学业';
}

/**
 * 用户屏展示：去掉正文中重复的「【题脉·子层】」盖章，保留真源里的实质句子。
 * 不影响导出 Markdown 等仍带标签的通路（仅 bundle 展示用）。
 */
export function stripStudyReadingBandPrefixes(text: string, band: string): string {
  if (!text || !band) return text;
  const re = new RegExp(`【${escapeRegExp(band)}·[^】]+】`, 'g');
  return text
    .replace(re, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+/, '')
    .trimEnd();
}
