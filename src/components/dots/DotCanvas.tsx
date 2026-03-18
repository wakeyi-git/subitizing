import { Dot } from './Dot';
import type { DotArrangement } from '../../types/arrangement';

interface DotCanvasProps {
  arrangement: DotArrangement;
  showGroupLabels?: boolean;
}

export function DotCanvas({ arrangement, showGroupLabels = false }: DotCanvasProps) {
  const size = 500;
  const baseRadius = arrangement.totalQuantity <= 3 ? 40
    : arrangement.totalQuantity <= 5 ? 32
    : arrangement.totalQuantity <= 8 ? 26
    : arrangement.totalQuantity <= 10 ? 22
    : 18;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-full max-w-[min(80vw,80vh)] max-h-[min(80vw,80vh)]"
    >
      {arrangement.groups.map(group =>
        group.dots.map((dot, i) => (
          <Dot
            key={`${group.id}-${i}`}
            cx={dot.x * size}
            cy={dot.y * size}
            r={baseRadius}
            color={dot.color}
          />
        )),
      )}

      {/* Group quantity labels overlaid on each sub-group center */}
      {showGroupLabels && arrangement.groups.length > 1 &&
        arrangement.groups.map(group => {
          const cx = group.dots.reduce((s, d) => s + d.x, 0) / group.dots.length * size;
          const cy = group.dots.reduce((s, d) => s + d.y, 0) / group.dots.length * size;
          return (
            <g key={`label-${group.id}`}>
              <circle cx={cx} cy={cy} r={24} fill="white" fillOpacity={0.85} />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={28}
                fontWeight="bold"
                fill="#333"
              >
                {group.quantity}
              </text>
            </g>
          );
        })
      }
    </svg>
  );
}
