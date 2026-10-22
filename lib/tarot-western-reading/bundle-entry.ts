import {
  formatWesternCardReading,
  getLoveQ01Reading,
  getWesternQuestionCardReading,
  LOVE_Q01,
} from "./index";

function canonQuestion(q: string): string {
  return q.replace(/\s+/g, "").replace(/\//g, "／");
}

type WesternReadingApi = {
  LOVE_Q01: string;
  get: (
    categoryId: string,
    questionText: string,
    cardId: string,
    upright: boolean,
  ) => {
    lean: string;
    verdict: string;
    speak: string;
    soul: string;
    doToday: string;
    nameZh: string;
    upright: boolean;
    text: string;
  } | null;
};

const api: WesternReadingApi = {
  LOVE_Q01,
  get(categoryId, questionText, cardId, upright) {
    const q = String(questionText || "");
    let hit = getWesternQuestionCardReading(categoryId, q, cardId, upright);
    if (!hit && canonQuestion(q) === canonQuestion(LOVE_Q01)) {
      hit = getLoveQ01Reading(cardId, upright);
    }
    if (!hit) return null;
    return {
      lean: hit.lean,
      verdict: hit.verdict,
      speak: hit.speak,
      soul: hit.soul,
      doToday: hit.doToday,
      nameZh: hit.nameZh,
      upright: hit.upright,
      text: formatWesternCardReading(hit),
    };
  },
};

(globalThis as unknown as { TarotWesternReading: WesternReadingApi }).TarotWesternReading = api;
