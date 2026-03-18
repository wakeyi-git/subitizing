import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DotCanvas } from '../components/dots/DotCanvas';
import { FlashDisplay } from '../components/presenter/FlashDisplay';
import { ControlBar } from '../components/presenter/ControlBar';
import { useFlashTimer } from '../hooks/useFlashTimer';
import { useKeyboard } from '../hooks/useKeyboard';
import { generateArrangement } from '../lib/arrangements/generator';
import { LEVELS } from '../lib/difficulty/levels';
import type { DotArrangement } from '../types/arrangement';

export function DotFlashPage() {
  const [levelId, setLevelId] = useState(1);
  const [displayDuration, setDisplayDuration] = useState(2000);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fixedQuantity, setFixedQuantity] = useState<number | null>(null);

  const [currentArrangement, setCurrentArrangement] = useState<DotArrangement | null>(null);
  const historyRef = useRef<DotArrangement[]>([]);
  const historyIndexRef = useRef(-1);

  const level = LEVELS.find(l => l.id === levelId)!;

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const { isVisible, show } = useFlashTimer({
    duration: displayDuration,
  });

  const generateNext = useCallback(() => {
    let quantity: number;
    if (fixedQuantity !== null) {
      quantity = fixedQuantity;
    } else {
      const [min, max] = level.quantityRange;
      quantity = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const arrangement = generateArrangement(quantity, level.useSubgroups);

    historyRef.current.push(arrangement);
    historyIndexRef.current = historyRef.current.length - 1;
    setCurrentArrangement(arrangement);
    setShowAnswer(false);
    show();
  }, [level, fixedQuantity, show]);

  const goToPrevious = useCallback(() => {
    if (!isVisible && currentArrangement) {
      show();
    } else if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      setCurrentArrangement(historyRef.current[historyIndexRef.current]);
      setShowAnswer(false);
      show();
    }
  }, [show, isVisible, currentArrangement]);

  const toggleAnswer = useCallback(() => {
    setShowAnswer(prev => {
      const next = !prev;
      // When showing the answer while dots are hidden, re-show dots without auto-hide
      if (next && !isVisible && currentArrangement) {
        show(true);
      }
      return next;
    });
  }, [isVisible, currentArrangement, show]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleLevelChange = useCallback((newLevelId: number) => {
    setLevelId(newLevelId);
    const newLevel = LEVELS.find(l => l.id === newLevelId)!;
    setDisplayDuration(newLevel.displayDuration);
    setFixedQuantity(null);
    historyRef.current = [];
    historyIndexRef.current = -1;
    setCurrentArrangement(null);
    setShowAnswer(false);
  }, []);

  useKeyboard({
    onNext: generateNext,
    onPrevious: goToPrevious,
    onToggleAnswer: toggleAnswer,
    onToggleFullscreen: toggleFullscreen,
  });

  return (
    <div className="flex flex-col h-screen bg-cream relative">
      {/* Home button — only visible on hover */}
      {!isFullscreen && (
        <Link
          to="/"
          className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 text-sm transition-colors border border-gray-200 opacity-0 hover:opacity-100 focus:opacity-100"
        >
          ← 홈
        </Link>
      )}

      {/* Fullscreen hint */}
      {isFullscreen && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-lg bg-black/50 text-white text-sm animate-pulse">
          Esc 또는 F키로 전체화면 해제
        </div>
      )}

      {/* Answer overlay */}
      {showAnswer && currentArrangement && (
        <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur rounded-2xl px-6 py-3 shadow-lg border border-gray-200">
          <span className="text-4xl font-bold text-gray-800">
            {currentArrangement.totalQuantity}
          </span>
          {currentArrangement.groups.length > 1 && (
            <span className="text-lg text-gray-500 ml-3">
              ({currentArrangement.groups.map(g => g.quantity).join(' + ')})
            </span>
          )}
        </div>
      )}

      {/* Main display area */}
      <FlashDisplay isVisible={isVisible} hasHistory={currentArrangement !== null}>
        {currentArrangement && (
          <DotCanvas arrangement={currentArrangement} showGroupLabels={showAnswer} />
        )}
      </FlashDisplay>

      {/* Control bar */}
      <ControlBar
        levelId={levelId}
        displayDuration={displayDuration}
        showAnswer={showAnswer}
        currentQuantity={currentArrangement?.totalQuantity ?? null}
        fixedQuantity={fixedQuantity}
        cardIndex={historyIndexRef.current + 1}
        onNext={generateNext}
        onPrevious={goToPrevious}
        onLevelChange={handleLevelChange}
        onDurationChange={setDisplayDuration}
        onFixedQuantityChange={setFixedQuantity}
        onToggleAnswer={toggleAnswer}
        onToggleFullscreen={toggleFullscreen}
        hidden={isFullscreen}
      />
    </div>
  );
}
