import type { TenFrameState, TenFrameCell, DoubleTenFrameState } from '../../types/ten-frame';

/**
 * Generate a ten-frame with the given number of filled cells.
 * Fills left-to-right, top-to-bottom by default.
 */
export function generateTenFrame(
  filledCount: number,
  options?: { twoColor?: [number, number] },
): TenFrameState {
  const cells: TenFrameCell[] = Array.from({ length: 10 }, () => ({
    filled: false,
    color: null,
  }));

  if (options?.twoColor) {
    const [firstCount, secondCount] = options.twoColor;
    for (let i = 0; i < firstCount && i < 10; i++) {
      cells[i] = { filled: true, color: 'red' };
    }
    for (let i = firstCount; i < firstCount + secondCount && i < 10; i++) {
      cells[i] = { filled: true, color: 'blue' };
    }
  } else {
    for (let i = 0; i < filledCount && i < 10; i++) {
      cells[i] = { filled: true, color: 'red' };
    }
  }

  return { cells, filledCount: Math.min(filledCount, 10) };
}

/**
 * Generate a double ten-frame for numbers > 10.
 */
export function generateDoubleTenFrame(totalFilled: number): DoubleTenFrameState {
  const topCount = Math.min(totalFilled, 10);
  const bottomCount = Math.max(0, totalFilled - 10);

  return {
    top: generateTenFrame(topCount),
    bottom: generateTenFrame(bottomCount),
    totalFilled,
  };
}

/**
 * Generate a random quantity within the given range for ten-frame display.
 */
export function randomTenFrameQuantity(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a two-color ten-frame for part-whole practice.
 * Returns the partition used.
 */
export function generatePartWholeTenFrame(
  total: number,
): { frame: TenFrameState; parts: [number, number] } {
  const capped = Math.min(total, 10);
  const firstPart = Math.floor(Math.random() * (capped - 1)) + 1;
  const secondPart = capped - firstPart;
  return {
    frame: generateTenFrame(capped, { twoColor: [firstPart, secondPart] }),
    parts: [firstPart, secondPart],
  };
}
