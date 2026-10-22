import type { WesternCardReading } from "./types";

export function canonQuestion(q: string): string {
  return q.replace(/\s+/g, "").replace(/\//g, "／");
}

export const WESTERN_READING_BY_QUESTION: Record<string, WesternCardReading[]> = {};

export function getWesternQuestionCardReading(
  _categoryId: string,
  _questionText: string,
  _cardId: string,
  _upright: boolean,
): WesternCardReading | undefined {
  return undefined;
}

export function getLoveQ01Reading(_cardId: string, _upright: boolean): WesternCardReading | undefined {
  return undefined;
}
