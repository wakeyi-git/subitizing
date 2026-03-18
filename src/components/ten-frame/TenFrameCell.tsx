import { DOT_COLORS } from '../../constants/colors';
import type { TenFrameCell as CellType } from '../../types/ten-frame';

interface TenFrameCellProps {
  cell: CellType;
  x: number;
  y: number;
  cellSize: number;
}

export function TenFrameCell({ cell, x, y, cellSize }: TenFrameCellProps) {
  const padding = cellSize * 0.15;
  const dotRadius = (cellSize - padding * 2) / 2;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={cellSize}
        height={cellSize}
        fill="white"
        stroke="#2C3E50"
        strokeWidth={2.5}
      />
      {cell.filled && (
        <circle
          cx={x + cellSize / 2}
          cy={y + cellSize / 2}
          r={dotRadius}
          fill={cell.color ? DOT_COLORS[cell.color] : DOT_COLORS.red}
        />
      )}
    </g>
  );
}
