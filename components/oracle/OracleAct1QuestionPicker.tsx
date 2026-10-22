"use client";

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  getOracleCategoryCardMeta,
  getOracleDisplayCategory,
  getOracleVisibleCategories,
} from '@/lib/oracleQuestionCatalog';
import {
  LOVE_MARRIAGE_CATEGORY_ID,
  getLoveSurfaceQuestions,
} from '@/lib/oracleLoveSurfaceQuestions';
import {
  CAREER_WORK_CATEGORY_ID,
  getCareerSurfaceQuestions,
} from '@/lib/oracleCareerSurfaceQuestions';
import type { QuickPickCategory } from '@/lib/questionQuickPick';
import OracleCategoryGate from '@/components/oracle/OracleCategoryGate';

const PRESET_LEADING_CHATTER = [
  '姐妹们',
  '朋友们',
] as const;

function cleanPresetQuestionText(text: string): string {
  let out = text.trim();
  for (const prefix of PRESET_LEADING_CHATTER) {
    if (out.startsWith(prefix)) {
      out = out.slice(prefix.length).trim();
      out = out.replace(/^[\s,，。!！?？~～:：、·\-—]+/, '');
    }
  }
  return out || text.trim();
}

interface OracleAct1QuestionPickerProps {
  disabled?: boolean;
  showCustomInput: boolean;
  customDraft: string;
  onPickQuestion: (question: string, categoryId: string, categoryLabel: string) => void;
  onToggleCustomInput: () => void;
  onCustomDraftChange: (value: string) => void;
  onCustomSubmit: (question: string, categoryId: string, categoryLabel: string) => void;
  onRequestCustomConfirm: (
    question: string,
    categoryId: string,
    categoryLabel: string,
  ) => void;
  onRegisterAct1Back?: (handler: (() => boolean) | null) => void;
  confirmSlot?: ReactNode;
}

export default function OracleAct1QuestionPicker({
  disabled = false,
  showCustomInput,
  customDraft,
  onPickQuestion,
  onToggleCustomInput,
  onCustomDraftChange,
  onCustomSubmit,
  onRequestCustomConfirm,
  onRegisterAct1Back,
  confirmSlot,
}: OracleAct1QuestionPickerProps) {
  const categories = getOracleVisibleCategories();
  const [selectedCategory, setSelectedCategory] = useState<QuickPickCategory | null>(null);
  const selectedTheme = selectedCategory
    ? getOracleCategoryCardMeta(selectedCategory.id).theme
    : 'gold';

  const handleSelectCategory = useCallback(
    (cat: QuickPickCategory) => {
      if (disabled || selectedCategory) return;
      setSelectedCategory(cat);
    },
    [disabled, selectedCategory],
  );

  const handleResetCategory = useCallback(() => {
    if (disabled) return;
    setSelectedCategory(null);
  }, [disabled]);

  useEffect(() => {
    if (!onRegisterAct1Back) return;
    if (!selectedCategory) {
      onRegisterAct1Back(null);
      return;
    }
    onRegisterAct1Back(() => {
      handleResetCategory();
      return true;
    });
    return () => onRegisterAct1Back(null);
  }, [handleResetCategory, onRegisterAct1Back, selectedCategory]);

  const displayCategory = selectedCategory ? getOracleDisplayCategory(selectedCategory) : null;
  const surfaceQuestions = (() => {
    if (selectedCategory?.id === LOVE_MARRIAGE_CATEGORY_ID) {
      return [...getLoveSurfaceQuestions()];
    }
    if (selectedCategory?.id === CAREER_WORK_CATEGORY_ID) {
      return [...getCareerSurfaceQuestions()];
    }
    return displayCategory?.questions ?? [];
  })();
  const displayQuestions = surfaceQuestions.map((question, index) => ({
    key: `${index}-${question}`,
    order: index + 1,
    value: cleanPresetQuestionText(question),
  }));

  return (
    <div className="o3a-question-picker">
      {!selectedCategory && (
        <p className="o3a-picker-step">选择问题大类</p>
      )}

      {!selectedCategory && (
        <div className="o3a-cat-board">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className="o3a-cat-board__cell"
              role="presentation"
              onClick={() => handleSelectCategory(cat)}
            >
              <OracleCategoryGate
                category={cat}
                variant="tile"
                disabled={disabled}
                style={{ animationDelay: `${0.04 * i}s` }}
                onClick={() => handleSelectCategory(cat)}
              />
            </div>
          ))}
        </div>
      )}

      {selectedCategory && displayCategory && (
        <div className="o3a-cat-stage">
          <button
            type="button"
            className="o3a-back o3a-back--act1"
            disabled={disabled}
            onClick={handleResetCategory}
          >
            <ArrowLeft size={14} />
            返回大类
          </button>
          <div className="o3a-cat-stage__row">
            <div className="o3a-cat-stage__card">
              <OracleCategoryGate category={selectedCategory} variant="hero" selected />
            </div>
            <div className="o3a-cat-detail">
              {selectedCategory.id !== LOVE_MARRIAGE_CATEGORY_ID && (
                <p className="o3a-picker-step o3a-picker-step--sub">选择具体问题</p>
              )}
              <div className="o3a-custom-entry o3a-custom-entry--hero">
                <div className="o3a-custom-input-wrap o3a-custom-input-wrap--prominent">
                  <input
                    className="o3a-custom-input"
                    placeholder="请写下你真正想问的问题（按 Enter 或点确认）"
                    value={customDraft}
                    disabled={disabled}
                    onFocus={() => {
                      if (!showCustomInput) onToggleCustomInput();
                    }}
                    onChange={e => onCustomDraftChange(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing && customDraft.trim()) {
                        e.preventDefault();
                        onRequestCustomConfirm(
                          customDraft.trim(),
                          selectedCategory.id,
                          displayCategory.label,
                        );
                      }
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="o3a-custom-submit"
                    disabled={disabled || !customDraft.trim()}
                    onClick={() =>
                      onCustomSubmit(customDraft.trim(), selectedCategory.id, displayCategory.label)
                    }
                  >
                    确认请牌
                  </button>
                </div>
                {confirmSlot && (
                  <div className="o3a-custom-confirm-slot">
                    {confirmSlot}
                  </div>
                )}
              </div>
              <div className="o3a-preset-block">
                <div className="o3a-picker-questions o3a-picker-questions--mosaic">
                  {displayQuestions.map(item => (
                    <button
                      key={item.key}
                      type="button"
                      className={`o3a-picker-q o3a-picker-q--theme-${selectedTheme}`}
                      disabled={disabled}
                      onClick={() =>
                        onPickQuestion(item.value, selectedCategory.id, displayCategory.label)
                      }
                    >
                      {item.order}. {item.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
