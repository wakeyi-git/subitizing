// Minimum center-to-center distance in normalized [0,1] space.
// Scaled by quantity since fewer dots render larger.
// viewBox=500: radius 40 (qty≤3) → diameter 80px → need 0.20 min
//              radius 32 (qty≤5) → diameter 64px → need 0.16 min
//              radius 26 (qty≤8) → diameter 52px → need 0.14 min
//              radius 22 (qty≤10) → diameter 44px → need 0.12 min
//              radius 18 (qty>10) → diameter 36px → need 0.10 min
export function getMinDotDistance(quantity: number): number {
  if (quantity <= 3) return 0.22;
  if (quantity <= 5) return 0.18;
  if (quantity <= 8) return 0.15;
  if (quantity <= 10) return 0.13;
  return 0.11;
}

export const EDGE_MARGIN = 0.1;
export const JITTER_AMOUNT = 0.04;

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function isValidPosition(
  pos: { x: number; y: number },
  existingDots: Array<{ x: number; y: number }>,
  minDist: number,
): boolean {
  if (pos.x < EDGE_MARGIN || pos.x > 1 - EDGE_MARGIN) return false;
  if (pos.y < EDGE_MARGIN || pos.y > 1 - EDGE_MARGIN) return false;

  for (const dot of existingDots) {
    if (distance(pos, dot) < minDist) return false;
  }

  return true;
}

export function addJitter(x: number, y: number): { x: number; y: number } {
  const jx = x + (Math.random() - 0.5) * JITTER_AMOUNT * 2;
  const jy = y + (Math.random() - 0.5) * JITTER_AMOUNT * 2;
  return {
    x: Math.max(EDGE_MARGIN, Math.min(1 - EDGE_MARGIN, jx)),
    y: Math.max(EDGE_MARGIN, Math.min(1 - EDGE_MARGIN, jy)),
  };
}

/**
 * Post-placement validation: push apart any dots that are too close.
 * Runs iteratively until all dots satisfy the minimum distance.
 */
export function enforceMinDistance(
  dots: Array<{ x: number; y: number }>,
  minDist: number,
  maxIterations = 20,
): void {
  for (let iter = 0; iter < maxIterations; iter++) {
    let adjusted = false;

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const d = distance(dots[i], dots[j]);
        if (d < minDist && d > 0.001) {
          // Push dots apart along the line between them
          const overlap = (minDist - d) / 2 + 0.005;
          const dx = (dots[j].x - dots[i].x) / d;
          const dy = (dots[j].y - dots[i].y) / d;

          dots[i].x -= dx * overlap;
          dots[i].y -= dy * overlap;
          dots[j].x += dx * overlap;
          dots[j].y += dy * overlap;

          // Clamp to valid area
          dots[i].x = Math.max(EDGE_MARGIN, Math.min(1 - EDGE_MARGIN, dots[i].x));
          dots[i].y = Math.max(EDGE_MARGIN, Math.min(1 - EDGE_MARGIN, dots[i].y));
          dots[j].x = Math.max(EDGE_MARGIN, Math.min(1 - EDGE_MARGIN, dots[j].x));
          dots[j].y = Math.max(EDGE_MARGIN, Math.min(1 - EDGE_MARGIN, dots[j].y));

          adjusted = true;
        } else if (d <= 0.001) {
          // Near-identical positions: nudge randomly
          dots[j].x = Math.max(EDGE_MARGIN, Math.min(1 - EDGE_MARGIN, dots[j].x + minDist * (Math.random() - 0.5)));
          dots[j].y = Math.max(EDGE_MARGIN, Math.min(1 - EDGE_MARGIN, dots[j].y + minDist * (Math.random() - 0.5)));
          adjusted = true;
        }
      }
    }

    if (!adjusted) break;
  }
}
