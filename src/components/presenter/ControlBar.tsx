import { LEVELS } from '../../lib/difficulty/levels';

interface ControlBarProps {
  levelId: number;
  displayDuration: number;
  showAnswer: boolean;
  currentQuantity: number | null;
  fixedQuantity: number | null;
  cardIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onLevelChange: (levelId: number) => void;
  onDurationChange: (ms: number) => void;
  onFixedQuantityChange: (qty: number | null) => void;
  onToggleAnswer: () => void;
  onToggleFullscreen: () => void;
  hidden?: boolean;
}

const DURATION_OPTIONS = [
  { label: '0.5초', value: 500 },
  { label: '0.8초', value: 800 },
  { label: '1.0초', value: 1000 },
  { label: '1.2초', value: 1200 },
  { label: '1.5초', value: 1500 },
  { label: '2.0초', value: 2000 },
  { label: '3.0초', value: 3000 },
  { label: '계속 보기', value: 999999 },
];

export function ControlBar({
  levelId,
  displayDuration,
  showAnswer,
  currentQuantity,
  fixedQuantity,
  cardIndex,
  onNext,
  onPrevious,
  onLevelChange,
  onDurationChange,
  onFixedQuantityChange,
  onToggleAnswer,
  onToggleFullscreen,
  hidden,
}: ControlBarProps) {
  if (hidden) return null;

  const level = LEVELS.find(l => l.id === levelId)!;
  const [min, max] = level.quantityRange;
  const quantityOptions: number[] = [];
  for (let i = min; i <= max; i++) quantityOptions.push(i);

  return (
    <div className="bg-white/90 backdrop-blur border-t border-gray-200 px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-sm"
          >
            ◀ 이전
          </button>
          <button
            onClick={onNext}
            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors text-sm font-medium"
          >
            다음 ▶
          </button>
          {cardIndex > 0 && (
            <span className="text-xs text-gray-400 ml-1">#{cardIndex}</span>
          )}
        </div>

        {/* Settings */}
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-1.5">
            <span className="text-gray-500">단계</span>
            <select
              value={levelId}
              onChange={e => onLevelChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1.5 bg-white"
            >
              {LEVELS.map(level => (
                <option key={level.id} value={level.id}>
                  {level.id}. {level.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1.5">
            <span className="text-gray-500">수량</span>
            <select
              value={fixedQuantity ?? 'random'}
              onChange={e => {
                const v = e.target.value;
                onFixedQuantityChange(v === 'random' ? null : Number(v));
              }}
              className="border border-gray-300 rounded-md px-2 py-1.5 bg-white"
            >
              <option value="random">랜덤 ({min}-{max})</option>
              {quantityOptions.map(n => (
                <option key={n} value={n}>{n}개</option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1.5">
            <span className="text-gray-500">시간</span>
            <select
              value={displayDuration}
              onChange={e => onDurationChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1.5 bg-white"
            >
              {DURATION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAnswer}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              showAnswer
                ? 'bg-dot-blue text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {showAnswer && currentQuantity !== null
              ? `정답: ${currentQuantity}`
              : '정답 보기'}
          </button>
          <button
            onClick={onToggleFullscreen}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-sm"
            title="전체 화면 (F)"
          >
            전체화면
          </button>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="max-w-5xl mx-auto mt-2 text-xs text-gray-400 flex gap-4">
        <span>Space/→ 다음</span>
        <span>← 이전</span>
        <span>Enter 정답</span>
        <span>F 전체화면</span>
      </div>
    </div>
  );
}
