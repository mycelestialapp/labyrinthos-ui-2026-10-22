"use client";

import type { LoveSubcategoryMatchResult } from '@/lib/oracleLoveSubcategoryMatch';
import type { CareerSubcategoryMatchResult } from '@/lib/oracleCareerSubcategoryMatch';
import {
  CONFIRM_RETRY_LABEL,
  CONFIRM_YES_LABEL,
} from '@/lib/oracleLoveConfirmEcho';

interface OracleAct1QuestionConfirmProps {
  echoText: string;
  userText: string;
  match: LoveSubcategoryMatchResult | CareerSubcategoryMatchResult | null;
  disabled?: boolean;
  onConfirm: () => void;
  onRetry: () => void;
  onChooseAlternative: (subcategoryId: string) => void;
}

export default function OracleAct1QuestionConfirm({
  echoText,
  match,
  disabled = false,
  onConfirm,
  onRetry,
  onChooseAlternative,
}: OracleAct1QuestionConfirmProps) {
  const showAlternatives =
    match?.confidence === 'low' && (match.alternatives?.length ?? 0) > 0;

  return (
    <div className="o3a-confirm">
      <div className="o3a-confirm__echo">{echoText}</div>
      {showAlternatives && (
        <div className="o3a-confirm__alts">
          <p className="o3a-confirm__alts-title">如果你想问得更准，可以直接点这句：</p>
          <div className="o3a-confirm__alts-list">
            {match.alternatives.slice(0, 2).map((alt) => (
              <button
                key={alt.subcategory.id}
                type="button"
                className="o3a-confirm__alt-btn"
                disabled={disabled}
                onClick={() => onChooseAlternative(alt.subcategory.id)}
              >
                其实我更想问：{alt.subcategory.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="o3a-confirm__actions">
        <button
          type="button"
          className="o3a-confirm__btn o3a-confirm__btn--yes"
          disabled={disabled}
          onClick={onConfirm}
        >
          {CONFIRM_YES_LABEL}
        </button>
        <button
          type="button"
          className="o3a-confirm__btn o3a-confirm__btn--no"
          disabled={disabled}
          onClick={onRetry}
        >
          {CONFIRM_RETRY_LABEL}
        </button>
      </div>
    </div>
  );
}
