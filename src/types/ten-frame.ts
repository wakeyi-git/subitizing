import type { DotColor } from './arrangement';

export interface TenFrameState {
  cells: TenFrameCell[];
  filledCount: number;
}

export interface TenFrameCell {
  filled: boolean;
  color: DotColor | null;
}

export interface DoubleTenFrameState {
  top: TenFrameState;
  bottom: TenFrameState;
  totalFilled: number;
}
