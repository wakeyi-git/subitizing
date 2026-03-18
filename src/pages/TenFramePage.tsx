import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TenFrame } from '../components/ten-frame/TenFrame';
import { DoubleTenFrame } from '../components/ten-frame/DoubleTenFrame';
import { FlashDisplay } from '../components/presenter/FlashDisplay';
import { useFlashTimer } from '../hooks/useFlashTimer';
import { useKeyboard } from '../hooks/useKeyboard';
import {
  generateTenFrame,
  generateDoubleTenFrame,
  generatePartWholeTenFrame,
} from '../lib/ten-frame/generator';
import type { TenFrameState, DoubleTenFrameState } from '../types/ten-frame';

type FrameMode = 'single' | 'double' | 'partWhole';

interface FrameEntry {
  mode: FrameMode;
  single?: TenFrameState;
  double?: DoubleTenFrameState;
  quantity: number;
  parts?: [number, number];
}

export function TenFramePage() {
  const [displayDuration, setDisplayDuration] = useState(1500);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [frameMode, setFrameMode] = useState<FrameMode>('single');
  const [quantityRange, setQuantityRange] = useState<[number, number]>([1, 10]);

  const [current, setCurrent] = useState<FrameEntry | null>(null);
  const historyRef = useRef<FrameEntry[]>([]);
  const historyIndexRef = useRef(-1);

  const { isVisible, show } = useFlashTimer({ duration: displayDuration });

  const generateNext = useCallback(() => {
    const [min, max] = quantityRange;
    const quantity = Math.floor(Math.random() * (max - min + 1)) + min;

    let entry: FrameEntry;

    if (frameMode === 'double' && quantity > 10) {
      const state = generateDoubleTenFrame(quantity);
      entry = { mode: 'double', double: state, quantity };
    } else if (frameMode === 'partWhole') {
      const { frame, parts } = generatePartWholeTenFrame(Math.min(quantity, 10));
      entry = { mode: 'partWhole', single: frame, quantity: Math.min(quantity, 10), parts };
    } else {
      const state = generateTenFrame(Math.min(quantity, 10));
      entry = { mode: 'single', single: state, quantity: Math.min(quantity, 10) };
    }

    historyRef.current.push(entry);
    historyIndexRef.current = historyRef.current.length - 1;
    setCurrent(entry);
    setShowAnswer(false);
    show();
  }, [quantityRange, frameMode, show]);

  const goToPrevious = useCallback(() => {
    if (!isVisible && current) {
      // Frame just disappeared — re-show the current one
      show();
    } else if (historyIndexRef.current > 0) {
      // Frame is visible — go to the actual previous one
      historyIndexRef.current--;
      setCurrent(historyRef.current[historyIndexRef.current]);
      setShowAnswer(false);
      show();
    }
  }, [show, isVisible, current]);

  const toggleAnswer = useCallback(() => {
    setShowAnswer(prev => {
      const next = !prev;
      if (next && !isVisible && current) {
        show(true);
      }
      return next;
    });
  }, [isVisible, current, show]);

  // Sync fullscreen state with browser (e.g. when user presses Esc)
  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useKeyboard({
    onNext: generateNext,
    onPrevious: goToPrevious,
    onToggleAnswer: toggleAnswer,
    onToggleFullscreen: toggleFullscreen,
  });

  return (
    <div className="flex flex-col h-screen bg-cream relative">
      {/* Home button */}
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
      {showAnswer && current && (
        <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur rounded-2xl px-6 py-3 shadow-lg border border-gray-200">
          <span className="text-4xl font-bold text-gray-800">{current.quantity}</span>
          {current.parts && (
            <span className="text-lg text-gray-500 ml-3">
              ({current.parts[0]} + {current.parts[1]})
            </span>
          )}
          <div className="text-sm text-gray-400 mt-1">
            빈 칸: {current.mode === 'double' ? 20 - current.quantity : 10 - current.quantity}
          </div>
        </div>
      )}

      {/* Main display area */}
      <FlashDisplay isVisible={isVisible} hasHistory={current !== null}>
        {current && (
          <div className="flex items-center justify-center w-full">
            {current.mode === 'double' && current.double ? (
              <DoubleTenFrame state={current.double} />
            ) : current.single ? (
              <div className="w-full max-w-[min(70vw,700px)] mx-auto">
                <TenFrame state={current.single} />
              </div>
            ) : null}
          </div>
        )}
      </FlashDisplay>

      {/* Control bar - customized for ten-frame */}
      {!isFullscreen && (
        <div className="bg-white/90 backdrop-blur border-t border-gray-200 px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevious}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-sm"
              >
                ◀ 이전
              </button>
              <button
                onClick={generateNext}
                className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors text-sm font-medium"
              >
                다음 ▶
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2">
                <span className="text-gray-500">유형</span>
                <select
                  value={frameMode}
                  onChange={e => {
                    const mode = e.target.value as FrameMode;
                    setFrameMode(mode);
                    if (mode === 'double') setQuantityRange([11, 18]);
                    else setQuantityRange([1, 10]);
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1.5 bg-white"
                >
                  <option value="single">단일 십 프레임</option>
                  <option value="partWhole">부분-전체 (두 색상)</option>
                  <option value="double">이중 십 프레임 (10+)</option>
                </select>
              </label>

              <label className="flex items-center gap-2">
                <span className="text-gray-500">시간</span>
                <select
                  value={displayDuration}
                  onChange={e => setDisplayDuration(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1.5 bg-white"
                >
                  <option value={500}>0.5초</option>
                  <option value={800}>0.8초</option>
                  <option value={1000}>1.0초</option>
                  <option value={1200}>1.2초</option>
                  <option value={1500}>1.5초</option>
                  <option value={2000}>2.0초</option>
                  <option value={3000}>3.0초</option>
                  <option value={999999}>계속 보기</option>
                </select>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleAnswer}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  showAnswer
                    ? 'bg-dot-blue text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {showAnswer && current ? `정답: ${current.quantity}` : '정답 보기'}
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-sm"
              >
                전체화면
              </button>
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-2 text-xs text-gray-400 flex gap-4">
            <span>Space/→ 다음</span>
            <span>← 이전</span>
            <span>Enter 정답</span>
            <span>F 전체화면</span>
          </div>
        </div>
      )}
    </div>
  );
}
