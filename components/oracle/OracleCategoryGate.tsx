"use client";

import { forwardRef } from 'react';
import { GateOrnaments } from '@/components/oracle/OracleAct1Backdrop';
import { getOracleCategoryCardMeta } from '@/lib/oracleQuestionCatalog';
import type { QuickPickCategory } from '@/lib/questionQuickPick';

interface OracleCategoryGateProps {
  category: QuickPickCategory;
  variant: 'tile' | 'hero';
  selected?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const OracleCategoryGate = forwardRef<HTMLButtonElement, OracleCategoryGateProps>(
  function OracleCategoryGate(
    { category, variant, selected = false, disabled = false, style, onClick },
    ref,
  ) {
    const meta = getOracleCategoryCardMeta(category.id);

    return (
      <button
        ref={ref}
        type="button"
        className={`o3a-gate o3a-gate--theme-${meta.theme} o3a-gate--${variant}${selected ? ' is-selected' : ''}`}
        style={style}
        disabled={disabled}
        onClick={onClick}
      >
        <span className="o3a-gate__glow" aria-hidden />
        <span className="o3a-gate__frame" aria-hidden />
        <GateOrnaments />
        <span className="o3a-gate__num">{meta.num}</span>
        <span className="o3a-gate__medallion" aria-hidden>
          <span className="o3a-gate__medallion-ring" />
          <span className="o3a-gate__medallion-rays" />
          <span className="o3a-gate__emoji">{meta.emoji}</span>
        </span>
        <span className="o3a-gate__symbol">{meta.symbol}</span>
        <span className="o3a-gate__divider" aria-hidden />
        <span className="o3a-gate__label">{meta.verticalLabel}</span>
        <span className="o3a-gate__whisper">{meta.whisper}</span>
        <span className="o3a-gate__mist" aria-hidden />
      </button>
    );
  },
);

export default OracleCategoryGate;
