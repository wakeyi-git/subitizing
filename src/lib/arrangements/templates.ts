import type { ArrangementTemplate } from '../../types/arrangement';

// Positions normalized to [0, 1] coordinate space
// Multiple templates per quantity to ensure variety

export const TEMPLATES: ArrangementTemplate[] = [
  // 1 dot
  { name: 'center', quantity: 1, positions: [{ x: 0.5, y: 0.5 }] },

  // 2 dots
  { name: 'horizontal', quantity: 2, positions: [{ x: 0.3, y: 0.5 }, { x: 0.7, y: 0.5 }] },
  { name: 'vertical', quantity: 2, positions: [{ x: 0.5, y: 0.3 }, { x: 0.5, y: 0.7 }] },
  { name: 'diagonal', quantity: 2, positions: [{ x: 0.35, y: 0.35 }, { x: 0.65, y: 0.65 }] },

  // 3 dots
  { name: 'triangle-up', quantity: 3, positions: [{ x: 0.5, y: 0.3 }, { x: 0.3, y: 0.7 }, { x: 0.7, y: 0.7 }] },
  { name: 'triangle-down', quantity: 3, positions: [{ x: 0.3, y: 0.3 }, { x: 0.7, y: 0.3 }, { x: 0.5, y: 0.7 }] },
  { name: 'diagonal-3', quantity: 3, positions: [{ x: 0.25, y: 0.25 }, { x: 0.5, y: 0.5 }, { x: 0.75, y: 0.75 }] },
  { name: 'line-h', quantity: 3, positions: [{ x: 0.25, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.75, y: 0.5 }] },

  // 4 dots
  { name: 'square', quantity: 4, positions: [{ x: 0.3, y: 0.3 }, { x: 0.7, y: 0.3 }, { x: 0.3, y: 0.7 }, { x: 0.7, y: 0.7 }] },
  { name: 'diamond', quantity: 4, positions: [{ x: 0.5, y: 0.2 }, { x: 0.2, y: 0.5 }, { x: 0.8, y: 0.5 }, { x: 0.5, y: 0.8 }] },
  { name: 'line-4', quantity: 4, positions: [{ x: 0.2, y: 0.5 }, { x: 0.4, y: 0.5 }, { x: 0.6, y: 0.5 }, { x: 0.8, y: 0.5 }] },
  { name: 'T-shape', quantity: 4, positions: [{ x: 0.25, y: 0.35 }, { x: 0.5, y: 0.35 }, { x: 0.75, y: 0.35 }, { x: 0.5, y: 0.65 }] },

  // 5 dots
  { name: 'dice-5', quantity: 5, positions: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.5, y: 0.5 }, { x: 0.25, y: 0.75 }, { x: 0.75, y: 0.75 }] },
  { name: 'cross', quantity: 5, positions: [{ x: 0.5, y: 0.2 }, { x: 0.2, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.8, y: 0.5 }, { x: 0.5, y: 0.8 }] },
  { name: 'pentagon', quantity: 5, positions: [{ x: 0.5, y: 0.15 }, { x: 0.82, y: 0.4 }, { x: 0.7, y: 0.8 }, { x: 0.3, y: 0.8 }, { x: 0.18, y: 0.4 }] },
  { name: 'domino-23', quantity: 5, positions: [{ x: 0.25, y: 0.35 }, { x: 0.25, y: 0.65 }, { x: 0.65, y: 0.25 }, { x: 0.65, y: 0.5 }, { x: 0.65, y: 0.75 }] },

  // 6 dots
  { name: 'dice-6', quantity: 6, positions: [{ x: 0.3, y: 0.2 }, { x: 0.3, y: 0.5 }, { x: 0.3, y: 0.8 }, { x: 0.7, y: 0.2 }, { x: 0.7, y: 0.5 }, { x: 0.7, y: 0.8 }] },
  { name: 'grid-23', quantity: 6, positions: [{ x: 0.25, y: 0.35 }, { x: 0.5, y: 0.35 }, { x: 0.75, y: 0.35 }, { x: 0.25, y: 0.65 }, { x: 0.5, y: 0.65 }, { x: 0.75, y: 0.65 }] },
  { name: 'hexagon', quantity: 6, positions: [{ x: 0.5, y: 0.15 }, { x: 0.8, y: 0.35 }, { x: 0.8, y: 0.65 }, { x: 0.5, y: 0.85 }, { x: 0.2, y: 0.65 }, { x: 0.2, y: 0.35 }] },
];

export function getTemplatesForQuantity(quantity: number): ArrangementTemplate[] {
  return TEMPLATES.filter(t => t.quantity === quantity);
}
