import { DOT_COLORS } from '../../constants/colors';
import type { DotColor } from '../../types/arrangement';

interface DotProps {
  cx: number;
  cy: number;
  r: number;
  color: DotColor;
}

export function Dot({ cx, cy, r, color }: DotProps) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={DOT_COLORS[color]}
    />
  );
}
