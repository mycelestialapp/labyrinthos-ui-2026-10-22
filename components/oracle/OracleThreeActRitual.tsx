"use client";

/**
 * 神谕卡 · 大师级三幕式仪式感
 * Act 01 静心与意图 → Act 02 抽牌 → Act 03 神谕显圣
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { toast } from '@/lib/oracle-toast';
import { useReadingBack } from '@/contexts/ReadingBackContext';
import {
  getRandomOracleDraw,
  type OracleCardEntry,
  type OracleTopic,
} from '@/lib/oracleCards';
import { getOracleDisplayCard } from '@/lib/oracleCardDisplay';
import { categoryToOracleTopic } from '@/lib/oracleQuestionTopics';
import { addReading } from '@/lib/readingHistory';
import { buildOracleLoveMasterReading } from '@/lib/oracleLoveMasterReading';
import OracleAct1Backdrop from '@/components/oracle/OracleAct1Backdrop';
import OracleAct1QuestionPicker from '@/components/oracle/OracleAct1QuestionPicker';
import OracleAct1QuestionConfirm from '@/components/oracle/OracleAct1QuestionConfirm';
import {
  buildMasterEchoQuestion,
  matchLoveSubcategory,
  sanitizeLoveQuestionInput,
  type LoveSubcategoryMatchResult,
} from '@/lib/oracleLoveSubcategoryMatch';
import { LOVE_MARRIAGE_CATEGORY_ID } from '@/lib/oracleLoveSurfaceQuestions';
import {
  CAREER_WORK_CATEGORY_ID,
} from '@/lib/oracleCareerSurfaceQuestions';
import {
  buildCareerMasterEchoQuestion,
} from '@/lib/oracleCareerConfirmEcho';
import {
  matchCareerSubcategory,
  sanitizeCareerQuestionInput,
  type CareerSubcategoryMatchResult,
} from '@/lib/oracleCareerSubcategoryMatch';
import './oracle-three-act.css';

type RitualStage = 1 | 2 | 3;
type OracleSpreadType = 'single' | 'three';

interface OracleThreeActRitualProps {
  date?: Date;
}

export default function OracleThreeActRitual({
  date = new Date(),
}: OracleThreeActRitualProps) {
  const [stage, setStage] = useState<RitualStage>(1);
  const [exitingAct1, setExitingAct1] = useState(false);
  const [focusLabel, setFocusLabel] = useState('');
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState<OracleTopic>('general');
  const [spreadType, setSpreadType] = useState<OracleSpreadType>('single');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDraft, setCustomDraft] = useState('');
  const [pendingConfirm, setPendingConfirm] = useState<{
    userText: string;
    echoText: string;
    categoryId: string;
    categoryLabel: string;
    match: LoveSubcategoryMatchResult | CareerSubcategoryMatchResult | null;
  } | null>(null);

  const [card, setCard] = useState<OracleCardEntry | null>(null);
  const [drawnCards, setDrawnCards] = useState<OracleCardEntry[]>([]);
  const [selectedLoveMatch, setSelectedLoveMatch] = useState<LoveSubcategoryMatchResult | null>(null);
  const [selectedCareerMatch, setSelectedCareerMatch] = useState<CareerSubcategoryMatchResult | null>(null);
  const hasSavedRef = useRef(false);
  const revealPlayedRef = useRef(false);
  const revealingRef = useRef(false);

  const act1Ref = useRef<HTMLDivElement>(null);
  const singleOrbRef = useRef<HTMLDivElement>(null);
  const threeOrbRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const pullTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activePullSpreadRef = useRef<OracleSpreadType>('single');
  const progressRef = useRef(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const keywordRef = useRef<HTMLParagraphElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const readingBack = useReadingBack();
  const act1BackRef = useRef<(() => boolean) | null>(null);

  const clearPullTimer = useCallback(() => {
    if (pullTimerRef.current) {
      clearInterval(pullTimerRef.current);
      pullTimerRef.current = null;
    }
  }, []);

  const resetToAct1 = useCallback(() => {
    clearPullTimer();
    progressRef.current = 0;
    revealPlayedRef.current = false;
    hasSavedRef.current = false;
    revealingRef.current = false;

    if (singleOrbRef.current) {
      gsap.killTweensOf(singleOrbRef.current);
      singleOrbRef.current.style.transform = '';
      singleOrbRef.current.style.filter = '';
      singleOrbRef.current.style.opacity = '';
      singleOrbRef.current.style.setProperty('--o3a-pull', '0');
    }
    if (threeOrbRef.current) {
      gsap.killTweensOf(threeOrbRef.current);
      threeOrbRef.current.style.transform = '';
      threeOrbRef.current.style.filter = '';
      threeOrbRef.current.style.opacity = '';
      threeOrbRef.current.style.setProperty('--o3a-pull', '0');
    }
    if (starsRef.current) {
      gsap.killTweensOf(starsRef.current);
      starsRef.current.style.transform = '';
    }

    setStage(1);
    setExitingAct1(false);
    setFocusLabel('');
    setQuestion('');
    setTopic('general');
    setSpreadType('single');
    setShowCustomInput(false);
    setCustomDraft('');
    setPendingConfirm(null);
    setSelectedLoveMatch(null);
    setSelectedCareerMatch(null);
    setCard(null);
    setDrawnCards([]);
  }, [clearPullTimer]);

  const getOrbRefBySpread = useCallback((spread: OracleSpreadType) => {
    return spread === 'single' ? singleOrbRef.current : threeOrbRef.current;
  }, []);

  const updateOrbVisuals = useCallback((progress: number, spread: OracleSpreadType) => {
    const orb = getOrbRefBySpread(spread);
    const stars = starsRef.current;
    if (!orb) return;
    const scale = 1 + progress * 0.2;
    const glow = 28 + progress * 78;
    const glowColor = spread === 'single' ? '107,214,255' : '244,129,230';
    orb.style.transform = `scale(${scale})`;
    orb.style.filter = `drop-shadow(0 0 ${glow}px rgba(${glowColor}, ${0.24 + progress * 0.52}))`;
    orb.style.setProperty('--o3a-pull', progress.toFixed(3));
    if (stars) {
      stars.style.transform = `scale(${1 - progress * 0.06}) translateY(${progress * 10}px)`;
    }
  }, [getOrbRefBySpread]);

  const drawCard = useCallback((forcedSpread?: OracleSpreadType) => {
    const finalSpread = forcedSpread ?? spreadType;
    const seed = Date.now() + date.getDate();
    const count = finalSpread === 'three' ? 3 : 1;
    const cards = getRandomOracleDraw(seed, count, topic);
    const [drawn] = cards;
    setCard(drawn);
    setDrawnCards(cards);
    return drawn;
  }, [date, spreadType, topic]);

  const triggerReveal = useCallback((spread: OracleSpreadType) => {
    if (revealingRef.current || stage !== 2) return;
    revealingRef.current = true;
    clearPullTimer();
    const flash = flashRef.current;
    const orb = getOrbRefBySpread(spread);

    if (flash) {
      gsap.fromTo(flash, { opacity: 0 }, { opacity: 0.85, duration: 0.05, yoyo: true, repeat: 1 });
    }
    if (orb) {
      orb.style.setProperty('--o3a-pull', '1');
      gsap.to(orb, {
        scale: 2.45,
        opacity: 0,
        filter: 'blur(30px)',
        duration: 0.62,
        ease: 'power2.in',
      });
    }

    setSpreadType(spread);
    drawCard(spread);
    window.setTimeout(() => setStage(3), 380);
  }, [stage, clearPullTimer, drawCard, getOrbRefBySpread]);

  const handleActivate = useCallback(
    (spread: OracleSpreadType) => {
      triggerReveal(spread);
    },
    [triggerReveal],
  );

  const handlePullStart = useCallback((spread: OracleSpreadType) => {
    if (stage !== 2) return;
    activePullSpreadRef.current = spread;
    setSpreadType(spread);
    progressRef.current = 0;
    clearPullTimer();
    pullTimerRef.current = setInterval(() => {
      if (progressRef.current < 1) {
        progressRef.current = Math.min(1, progressRef.current + 0.02);
        updateOrbVisuals(progressRef.current, spread);
        if (progressRef.current >= 1) {
          triggerReveal(spread);
        }
      }
    }, 20);
  }, [stage, clearPullTimer, updateOrbVisuals, triggerReveal]);

  const handlePullEnd = useCallback(() => {
    clearPullTimer();
    const activeOrb = getOrbRefBySpread(activePullSpreadRef.current);
    if (progressRef.current < 1 && activeOrb) {
      progressRef.current = 0;
      activeOrb.style.setProperty('--o3a-pull', '0');
      const activeGlow =
        activePullSpreadRef.current === 'single'
          ? 'drop-shadow(0 0 24px rgba(107,214,255,0.28))'
          : 'drop-shadow(0 0 24px rgba(244,129,230,0.28))';
      gsap.to(activeOrb, {
        scale: 1,
        filter: activeGlow,
        duration: 0.62,
        ease: 'power2.out',
      });
      if (starsRef.current) {
        gsap.to(starsRef.current, { scale: 1, y: 0, duration: 0.5 });
      }
    }
  }, [clearPullTimer, getOrbRefBySpread]);

  const enterAct2 = useCallback(
    (questionText: string, categoryId?: string, categoryLabel?: string) => {
      setFocusLabel(categoryLabel ?? '心中所困');
      setQuestion(questionText);
      setTopic(categoryId ? categoryToOracleTopic(categoryId) : 'general');
      if (categoryId === LOVE_MARRIAGE_CATEGORY_ID) {
        setSelectedLoveMatch(prev => prev ?? matchLoveSubcategory(questionText));
        setSelectedCareerMatch(null);
      } else if (categoryId === CAREER_WORK_CATEGORY_ID) {
        setSelectedCareerMatch(prev => prev ?? matchCareerSubcategory(questionText));
        setSelectedLoveMatch(null);
      } else {
        setSelectedLoveMatch(null);
        setSelectedCareerMatch(null);
      }
      setExitingAct1(true);
      const root = act1Ref.current;
      if (root) {
        gsap.to(root.querySelectorAll('.o3a-act1__backdrop, .o3a-act1__motto, .o3a-question-picker, .o3a-cat-board, .o3a-cat-stage, .o3a-cat-detail, .o3a-confirm'), {
          opacity: 0,
          y: -24,
          x: (i: number) => (i % 2 === 0 ? -16 : 16),
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.inOut',
          onComplete: () => {
            progressRef.current = 0;
            setStage(2);
            setExitingAct1(false);
          },
        });
      } else {
        setStage(2);
      }
    },
    [],
  );

  const requestCustomConfirm = useCallback((
    userText: string,
    categoryId: string,
    categoryLabel: string,
  ) => {
    const sanitizer =
      categoryId === CAREER_WORK_CATEGORY_ID ? sanitizeCareerQuestionInput : sanitizeLoveQuestionInput;
    const trimmed = sanitizer(userText);
    if (!trimmed) return;
    const match =
      categoryId === CAREER_WORK_CATEGORY_ID
        ? matchCareerSubcategory(trimmed)
        : matchLoveSubcategory(trimmed);
    const echo =
      categoryId === CAREER_WORK_CATEGORY_ID
        ? buildCareerMasterEchoQuestion(trimmed, match as CareerSubcategoryMatchResult | null)
        : buildMasterEchoQuestion(trimmed, match as LoveSubcategoryMatchResult | null);
    setPendingConfirm({
      userText: trimmed,
      echoText: echo,
      categoryId,
      categoryLabel: match?.subcategory.name ?? categoryLabel ?? '心中所困',
      match,
    });
    setShowCustomInput(false);
  }, []);

  const confirmPendingQuestion = useCallback(() => {
    if (!pendingConfirm) return;
    if (pendingConfirm.categoryId === LOVE_MARRIAGE_CATEGORY_ID) {
      setSelectedLoveMatch(pendingConfirm.match as LoveSubcategoryMatchResult | null);
      setSelectedCareerMatch(null);
    } else if (pendingConfirm.categoryId === CAREER_WORK_CATEGORY_ID) {
      setSelectedCareerMatch(pendingConfirm.match as CareerSubcategoryMatchResult | null);
      setSelectedLoveMatch(null);
    }
    enterAct2(
      pendingConfirm.userText,
      pendingConfirm.categoryId,
      pendingConfirm.categoryLabel,
    );
    setPendingConfirm(null);
  }, [enterAct2, pendingConfirm]);

  const cancelPendingConfirm = useCallback(() => {
    setPendingConfirm(null);
    setShowCustomInput(true);
    setCustomDraft('');
  }, []);

  const chooseAlternativeDirection = useCallback((subcategoryId: string) => {
    setPendingConfirm(prev => {
      if (!prev?.match) return prev;
      const picked = prev.match.alternatives.find(
        alt => alt.subcategory.id === subcategoryId,
      )?.subcategory;
      if (!picked) return prev;
      const refreshedMatch = {
        ...prev.match,
        subcategory: picked,
        confidence: 'medium',
      } as LoveSubcategoryMatchResult | CareerSubcategoryMatchResult;
      const refreshedEcho =
        prev.categoryId === CAREER_WORK_CATEGORY_ID
          ? buildCareerMasterEchoQuestion(prev.userText, refreshedMatch as CareerSubcategoryMatchResult)
          : buildMasterEchoQuestion(prev.userText, refreshedMatch as LoveSubcategoryMatchResult);

      return {
        ...prev,
        categoryLabel: picked.name,
        match: refreshedMatch,
        echoText: refreshedEcho,
      };
    });
  }, []);

  const playAct3Timeline = useCallback(() => {
    if (revealPlayedRef.current || !card) return;
    revealPlayedRef.current = true;

    const cardEl = cardRef.current;
    const kw = keywordRef.current;
    const messageEl = messageRef.current;
    const actionEl = actionRef.current;
    if (!cardEl || !kw) return;

    const tl = gsap.timeline();
    tl.fromTo(
      cardEl,
      { y: 100, opacity: 0, filter: 'blur(20px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power4.out' },
    );
    tl.fromTo(
      kw,
      { opacity: 0, letterSpacing: '1.5em', filter: 'blur(10px)' },
      { opacity: 1, letterSpacing: '0.3em', filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
      '-=0.4',
    );
    if (messageEl) {
      tl.fromTo(
        messageEl,
        { opacity: 0, y: 15, filter: 'blur(8px)' },
        { opacity: 0.9, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' },
        '+=0.25',
      );
    }
    if (actionEl) {
      tl.fromTo(
        actionEl,
        { opacity: 0, y: 12 },
        { opacity: 0.85, y: 0, duration: 0.9, ease: 'power2.out' },
        '-=0.15',
      );
    }
  }, [card]);

  const displayCard = card ? getOracleDisplayCard(card) : null;
  const loveMasterReading =
    displayCard && topic === 'love'
      ? buildOracleLoveMasterReading({
          question,
          match: selectedLoveMatch,
          card: displayCard,
        })
      : null;
  const revealMessage = loveMasterReading?.message ?? displayCard?.message ?? '';
  const revealAction = loveMasterReading?.action ?? displayCard?.action ?? '';

  useEffect(() => {
    if (stage !== 3 || !card) return;
    const id = requestAnimationFrame(() => playAct3Timeline());
    return () => cancelAnimationFrame(id);
  }, [stage, card, playAct3Timeline]);

  useEffect(() => {
    if (stage !== 3 || !card || hasSavedRef.current) return;
    const text = getOracleDisplayCard(card);
    try {
      addReading({
        tool: 'oracle',
        question: question || null,
        summary: `神谕卡 · ${text.nameZh}`,
        detail: {
          topic,
          spread: spreadType,
          cards: (drawnCards.length > 0 ? drawnCards : [card]).map((entry, idx) => {
            const shown = getOracleDisplayCard(entry);
            return {
              id: entry.id,
              nameZh: shown.nameZh,
              tagline: shown.tagline,
              image: entry.image ?? null,
              message:
                idx === 0
                  ? (loveMasterReading?.message ?? text.message)
                  : shown.shortHint,
              action:
                idx === 0
                  ? (loveMasterReading?.action ?? text.action)
                  : '',
            };
          }),
        },
      });
      hasSavedRef.current = true;
      toast.success('保存成功 ✅', { duration: 2000 });
    } catch {
      /* ignore */
    }
  }, [stage, card, question, topic, loveMasterReading, spreadType, drawnCards]);

  useEffect(() => () => clearPullTimer(), [clearPullTimer]);

  useEffect(() => {
    if (!readingBack) return;
    const handler = () => {
      if (stage === 1) return false;
      resetToAct1();
      return true;
    };
    readingBack.registerHandler(handler);
    return () => readingBack.unregisterHandler();
  }, [readingBack, stage, resetToAct1]);

  return (
    <div className="o3a">
      <div className="o3a__canvas" aria-hidden />
      <div ref={starsRef} className="o3a__stars" aria-hidden />
      <div ref={flashRef} className="o3a-flash" aria-hidden />
      {stage > 1 && (
        <button type="button" className="o3a-back o3a-back--float" onClick={resetToAct1}>
          <ArrowLeft size={14} />
          返回第一幕
        </button>
      )}

      {stage === 1 && (
        <div ref={act1Ref} className="o3a-act1">
          <OracleAct1Backdrop />
          <p className="o3a-act1__motto">请在此时安静地，走进你自己的圣殿。</p>
          <OracleAct1QuestionPicker
            disabled={exitingAct1 || pendingConfirm != null}
            showCustomInput={showCustomInput}
            customDraft={customDraft}
            onRegisterAct1Back={handler => {
              act1BackRef.current = handler;
            }}
            onPickQuestion={(q, categoryId, categoryLabel) => {
              enterAct2(q, categoryId, categoryLabel);
            }}
            onToggleCustomInput={() => setShowCustomInput(true)}
            onCustomDraftChange={setCustomDraft}
            onCustomSubmit={requestCustomConfirm}
            onRequestCustomConfirm={requestCustomConfirm}
            confirmSlot={
              pendingConfirm ? (
                <OracleAct1QuestionConfirm
                  echoText={pendingConfirm.echoText}
                  userText={pendingConfirm.userText}
                  match={pendingConfirm.match}
                  disabled={exitingAct1}
                  onConfirm={confirmPendingQuestion}
                  onRetry={cancelPendingConfirm}
                  onChooseAlternative={chooseAlternativeDirection}
                />
              ) : null
            }
          />
        </div>
      )}

      {stage === 2 && (
        <div className="o3a-act2">
          <p className="o3a-focus">
            {`${question || focusLabel || '请专注你的问题'}（默念问题，然后点一下光球抽牌）`}
          </p>
          <div className="o3a-orb-grid" role="group" aria-label="抽牌方式">
            <div className={`o3a-orb-option${spreadType === 'single' ? ' is-active' : ''}`}>
              <p className="o3a-orb-option__title">单张神谕卡</p>
              <div className="o3a-orb-wrap">
                <div className="o3a-orb-corona o3a-orb-corona--single" aria-hidden />
                <div
                  ref={singleOrbRef}
                  className="o3a-orb o3a-orb--single"
                  role="button"
                  tabIndex={0}
                  aria-label="抽取单张神谕卡"
                  onClick={() => handleActivate('single')}
                  onPointerDown={() => handlePullStart('single')}
                  onPointerUp={() => handleActivate('single')}
                  onPointerCancel={handlePullEnd}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleActivate('single');
                    }
                  }}
                >
                  <div className="o3a-orb__core" aria-hidden />
                  <div className="o3a-orb__ring" aria-hidden />
                  <div className="o3a-orb__veil" aria-hidden />
                  <div className="o3a-orb__dust" aria-hidden />
                </div>
              </div>
            </div>
            <div className={`o3a-orb-option${spreadType === 'three' ? ' is-active' : ''}`}>
              <p className="o3a-orb-option__title">三张牌阵</p>
              <div className="o3a-orb-wrap">
                <div className="o3a-orb-corona o3a-orb-corona--three" aria-hidden />
                <div
                  ref={threeOrbRef}
                  className="o3a-orb o3a-orb--three"
                  role="button"
                  tabIndex={0}
                  aria-label="抽取三张牌阵"
                  onClick={() => handleActivate('three')}
                  onPointerDown={() => handlePullStart('three')}
                  onPointerUp={() => handleActivate('three')}
                  onPointerCancel={handlePullEnd}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleActivate('three');
                    }
                  }}
                >
                  <div className="o3a-orb__core" aria-hidden />
                  <div className="o3a-orb__ring" aria-hidden />
                  <div className="o3a-orb__veil" aria-hidden />
                  <div className="o3a-orb__dust" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {stage === 3 && card && displayCard && (
        <div className="o3a-act3">
          {spreadType === 'three' && drawnCards.length > 1 ? (
            <div ref={cardRef} className="o3a-card-triple">
              {drawnCards.map((drawn, idx) => {
                const shown = getOracleDisplayCard(drawn);
                const slot = idx === 0 ? '过去' : idx === 1 ? '当下' : '方向';
                return (
                  <div key={`${drawn.id}-${slot}`} className="o3a-card o3a-card--mini">
                    <div className="o3a-card__frame" />
                    {drawn.image ? (
                      <img src={drawn.image} alt={shown.nameZh} className="o3a-card__img" />
                    ) : (
                      <div className="o3a-card__fallback">✦</div>
                    )}
                    <p className="o3a-card-slot">{slot}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div ref={cardRef} className="o3a-card">
              <div className="o3a-card__frame" />
              {card.image ? (
                <img src={card.image} alt={displayCard.nameZh} className="o3a-card__img" />
              ) : (
                <div className="o3a-card__fallback">✦</div>
              )}
            </div>
          )}

          <div className="o3a-reveal-copy">
            <p ref={keywordRef} className="o3a-reveal-keyword">
              {spreadType === 'three' && drawnCards.length > 1
                ? drawnCards.map(c => getOracleDisplayCard(c).nameZh).join(' · ')
                : `${displayCard.nameZh} · ${displayCard.tagline}`}
            </p>
            <p className="o3a-reveal-section-label">宇宙给你的讯息</p>
            <div ref={messageRef} className="o3a-reveal-message">
              {revealMessage}
            </div>
            <p className="o3a-reveal-section-label">可以立刻采取的小行动</p>
            <div ref={actionRef} className="o3a-reveal-action">
              {revealAction}
            </div>
          </div>

          <button type="button" className="o3a-restart" onClick={resetToAct1}>
            重新选择意图 · 再来一次
          </button>
        </div>
      )}

      {stage === 3 && (
        <Link href="/hub" className="o3a-history-link">
          返回星云
        </Link>
      )}
    </div>
  );
}
