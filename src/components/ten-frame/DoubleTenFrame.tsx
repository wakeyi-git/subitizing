import { TenFrame } from './TenFrame';
import type { DoubleTenFrameState } from '../../types/ten-frame';

interface DoubleTenFrameProps {
  state: DoubleTenFrameState;
  cellSize?: number;
}

export function DoubleTenFrame({ state, cellSize = 70 }: DoubleTenFrameProps) {
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-[min(55vw,520px)] mx-auto">
      <TenFrame state={state.top} cellSize={cellSize} />
      <TenFrame state={state.bottom} cellSize={cellSize} />
    </div>
  );
}
