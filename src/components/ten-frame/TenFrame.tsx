import { TenFrameCell } from './TenFrameCell';
import type { TenFrameState } from '../../types/ten-frame';

interface TenFrameProps {
  state: TenFrameState;
  cellSize?: number;
}

export function TenFrame({ state, cellSize = 80 }: TenFrameProps) {
  const cols = 5;
  const rows = 2;
  const width = cols * cellSize;
  const height = rows * cellSize;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
    >
      {state.cells.map((cell, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <TenFrameCell
            key={i}
            cell={cell}
            x={col * cellSize}
            y={row * cellSize}
            cellSize={cellSize}
          />
        );
      })}
    </svg>
  );
}
