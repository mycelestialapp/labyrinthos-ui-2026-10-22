import type { TarotCardDef } from "./tarot-deck-zh";
import type { TarotDrawnCard } from "./tarot-seeded-draw";
import { LIFE_SIX_MASTER_CATEGORY_IDS } from "./tarot-master-question-content-life-categories";
import type { MasterQuestionCardContent } from "./tarot-master-question-types-shared";
import type { TarotLayeredReadingZh } from "./tarot-reading-zh";
import {
  TAROT_QUESTION_LIFE_CATEGORIES_SCRIPT_VERSION,
  tarotQuestionLifeCategoriesBundlePath,
} from "./tarot-life-six-public-script-url";

export { TAROT_QUESTION_LIFE_CATEGORIES_SCRIPT_VERSION, tarotQuestionLifeCategoriesBundlePath };

const SCRIPT_ATTR = "data-tarot-life-six-bundle";

type TarotQuestionLifeWindow = {
  getMasterQuestionContentLifeSix?: (
    categoryId: string,
    questionText: string,
    cardId: string,
    upright: boolean,
    options?: { placeholder?: boolean },
  ) => MasterQuestionCardContent | null;
};

export function isLifeSixMasterCategoryId(categoryId: string): boolean {
  return (LIFE_SIX_MASTER_CATEGORY_IDS as readonly string[]).includes(categoryId);
}

/** 与冻结核 `major_${n}` / `{suit}_{1..14}`、`TAROT_DECK_ZH` 顺序一致 */
export function tarotDeckZhCardIdToLifeSixDmy(card: Pick<TarotCardDef, "id">): string | null {
  const id = card.id;
  if (id >= 0 && id <= 21) return `major_${id}`;
  const minorIdx = id - 22;
  if (minorIdx < 0 || minorIdx >= 56) return null;
  const MINOR_PER_SUIT = 14;
  const suitIdx = Math.floor(minorIdx / MINOR_PER_SUIT);
  const rank = (minorIdx % MINOR_PER_SUIT) + 1;
  const suits = ["wands", "cups", "swords", "pentacles"] as const;
  if (suitIdx >= suits.length) return null;
  return `${suits[suitIdx]!}_${rank}`;
}

function getTarotQuestionLifeWindow(): TarotQuestionLifeWindow | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { TarotQuestionLife?: TarotQuestionLifeWindow }).TarotQuestionLife;
}

/**
 * 动态注入 `public/tarotQuestionLifeCategoriesContent.js`（IIFE `TarotQuestionLife`），幂等。
 * HTML 原版 iframe 与 `v=` 真源：`tarot-life-six-public-script-url.ts`。
 */
export function loadTarotQuestionLifeCategoriesScriptOnce(
  scriptVersion = TAROT_QUESTION_LIFE_CATEGORIES_SCRIPT_VERSION,
): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (getTarotQuestionLifeWindow()?.getMasterQuestionContentLifeSix) return Promise.resolve();

  const basePath = tarotQuestionLifeCategoriesBundlePath(scriptVersion);

  const existing = document.querySelector<HTMLScriptElement>(`script[${SCRIPT_ATTR}]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      if (getTarotQuestionLifeWindow()?.getMasterQuestionContentLifeSix) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("tarotQuestionLifeCategoriesContent load error")), {
        once: true,
      });
    });
  }

  const inject = (src: string, allowRetry: boolean): Promise<void> =>
    new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.setAttribute(SCRIPT_ATTR, "1");
      s.addEventListener("load", () => resolve(), { once: true });
      s.addEventListener(
        "error",
        () => {
          s.remove();
          if (allowRetry) {
            const bust = `${basePath}&_=${Date.now()}`;
            inject(bust, false).then(resolve).catch(reject);
          } else {
            reject(new Error("tarotQuestionLifeCategoriesContent load error"));
          }
        },
        { once: true },
      );
      document.head.appendChild(s);
    });

  return inject(basePath, true);
}

/**
 * 生活六大类 + 题干与冻结核命中时，用大师五段按位拼接替换分层解读；否则返回 `base`。
 */
export function mergeLifeSixMasterLayeredReadingZh(params: {
  categoryId: string;
  questionTrim: string;
  drawn: TarotDrawnCard[];
  positionLabelsZh: string[];
  base: TarotLayeredReadingZh;
}): TarotLayeredReadingZh {
  const { categoryId, questionTrim, drawn, positionLabelsZh, base } = params;
  if (typeof window === "undefined" || !isLifeSixMasterCategoryId(categoryId) || drawn.length === 0) {
    return base;
  }

  const gm6 = getTarotQuestionLifeWindow()?.getMasterQuestionContentLifeSix;
  if (!gm6) return base;

  const q = questionTrim || "（未填写具体问题，以下按牌阵泛读）";
  const rows: MasterQuestionCardContent[] = [];

  for (let i = 0; i < drawn.length; i += 1) {
    const dc = drawn[i]!;
    const dmy = tarotDeckZhCardIdToLifeSixDmy(dc.card);
    if (!dmy) return base;
    const upright = !dc.reversed;
    const m = gm6(categoryId, q, dmy, upright, { placeholder: false });
    if (!m || m.isPlaceholder) return base;
    rows.push(m);
  }

  const labelAt = (i: number) => positionLabelsZh[i] ?? `位${i + 1}`;

  const snapshot =
    `你在问：${q}\n\n` +
    rows.map((m, i) => `${labelAt(i)}\n${m.cardSpeaking}`).join("\n\n");

  const spreadLogic = rows
    .map((m, i) => (m.psychologyLayer ? `${labelAt(i)}\n${m.psychologyLayer}` : ""))
    .filter(Boolean)
    .join("\n\n");

  const rawTable = rows
    .map((m, i) => (m.spiritLayer ? `${labelAt(i)}\n${m.spiritLayer}` : ""))
    .filter(Boolean)
    .join("\n\n");

  const actions = rows
    .map((m, i) => {
      const bits = [m.actionPath, m.masterSummary].filter(Boolean);
      return bits.length ? `${labelAt(i)}\n${bits.join("\n\n")}` : "";
    })
    .filter(Boolean)
    .join("\n\n");

  return {
    snapshot,
    spreadLogic: spreadLogic || base.spreadLogic,
    rawTable: rawTable || base.rawTable,
    actions: actions || base.actions,
  };
}
