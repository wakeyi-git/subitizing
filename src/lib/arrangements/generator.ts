import type { DotArrangement, DotPosition, DotGroup, DotColor } from '../../types/arrangement';
import { getTemplatesForQuantity } from './templates';
import { addJitter, isValidPosition, enforceMinDistance, getMinDotDistance, EDGE_MARGIN } from './constraints';
import { getPartition, hasPartitions } from './subgroups';

const DOT_COLOR_LIST: DotColor[] = ['red', 'blue'];

/**
 * Generate a dot arrangement for the given quantity using the specified strategy.
 */
export function generateArrangement(
  quantity: number,
  useSubgroups: boolean,
): DotArrangement {
  if (useSubgroups && hasPartitions(quantity)) {
    return generateSubgrouped(quantity);
  }

  const templates = getTemplatesForQuantity(quantity);
  if (templates.length > 0 && Math.random() < 0.7) {
    return generateFromTemplate(quantity, templates);
  }

  return generateRandom(quantity);
}

function generateFromTemplate(
  quantity: number,
  templates: { positions: { x: number; y: number }[] }[],
): DotArrangement {
  const template = templates[Math.floor(Math.random() * templates.length)];
  const minDist = getMinDotDistance(quantity);

  const dots: DotPosition[] = template.positions.map((pos) => {
    const jittered = addJitter(pos.x, pos.y);
    return { x: jittered.x, y: jittered.y, color: 'red' as DotColor, groupId: 0 };
  });

  // Enforce minimum distance after jitter
  enforceMinDistance(dots, minDist);

  return {
    totalQuantity: quantity,
    groups: [{ id: 0, dots, quantity }],
    layout: 'template',
  };
}

function generateRandom(quantity: number): DotArrangement {
  const dots: DotPosition[] = [];
  const minDist = getMinDotDistance(quantity);
  const maxAttempts = 150;

  for (let i = 0; i < quantity; i++) {
    let placed = false;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = EDGE_MARGIN + Math.random() * (1 - 2 * EDGE_MARGIN);
      const y = EDGE_MARGIN + Math.random() * (1 - 2 * EDGE_MARGIN);
      if (isValidPosition({ x, y }, dots, minDist)) {
        dots.push({ x, y, color: 'red', groupId: 0 });
        placed = true;
        break;
      }
    }
    // Fallback: place on a grid
    if (!placed) {
      const cols = Math.ceil(Math.sqrt(quantity));
      const row = Math.floor(i / cols);
      const col = i % cols;
      const spacing = (1 - 2 * EDGE_MARGIN) / Math.max(cols, 1);
      dots.push({
        x: EDGE_MARGIN + spacing * (col + 0.5),
        y: EDGE_MARGIN + spacing * (row + 0.5),
        color: 'red',
        groupId: 0,
      });
    }
  }

  // Final enforcement pass
  enforceMinDistance(dots, minDist);

  return {
    totalQuantity: quantity,
    groups: [{ id: 0, dots, quantity }],
    layout: 'random',
  };
}

function generateSubgrouped(quantity: number): DotArrangement {
  const partition = getPartition(quantity);
  const groups: DotGroup[] = [];
  const minDist = getMinDotDistance(quantity);

  // Collect ALL dots across groups for cross-group distance checking
  const allDots: DotPosition[] = [];

  // Divide canvas into regions based on number of groups
  const regions = getRegions(partition.length);

  partition.forEach((groupQty, groupIndex) => {
    const region = regions[groupIndex];
    const color = DOT_COLOR_LIST[groupIndex % DOT_COLOR_LIST.length];
    const dots: DotPosition[] = [];

    // Try to use a template within the region, scaled to fit
    const templates = getTemplatesForQuantity(groupQty);
    if (templates.length > 0) {
      const template = templates[Math.floor(Math.random() * templates.length)];

      // Scale template into region, keeping dots centered with padding
      const padding = 0.15; // padding within region
      const innerW = region.w * (1 - 2 * padding);
      const innerH = region.h * (1 - 2 * padding);
      const offsetX = region.x + region.w * padding;
      const offsetY = region.y + region.h * padding;

      for (const pos of template.positions) {
        const x = offsetX + pos.x * innerW;
        const y = offsetY + pos.y * innerH;
        const dot: DotPosition = { x, y, color, groupId: groupIndex };
        dots.push(dot);
        allDots.push(dot);
      }
    } else {
      // Random placement within region, checking against ALL placed dots
      for (let i = 0; i < groupQty; i++) {
        let placed = false;
        for (let attempt = 0; attempt < 80; attempt++) {
          const pad = 0.05;
          const x = region.x + pad * region.w + Math.random() * region.w * (1 - 2 * pad);
          const y = region.y + pad * region.h + Math.random() * region.h * (1 - 2 * pad);
          if (isValidPosition({ x, y }, allDots, minDist)) {
            const dot: DotPosition = { x, y, color, groupId: groupIndex };
            dots.push(dot);
            allDots.push(dot);
            placed = true;
            break;
          }
        }
        if (!placed) {
          const spacing = region.w / Math.max(groupQty + 1, 2);
          const dot: DotPosition = {
            x: region.x + spacing * (i + 1),
            y: region.y + region.h * 0.5,
            color,
            groupId: groupIndex,
          };
          dots.push(dot);
          allDots.push(dot);
        }
      }
    }

    groups.push({ id: groupIndex, dots, quantity: groupQty });
  });

  // Final pass: enforce minimum distance across ALL dots (cross-group)
  enforceMinDistance(allDots, minDist);

  return {
    totalQuantity: quantity,
    groups,
    layout: 'subgrouped',
  };
}

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

function getRegions(count: number): Region[] {
  const margin = 0.05;
  const gap = 0.12; // increased gap for clearer group separation

  if (count === 1) {
    return [{ x: margin, y: margin, w: 1 - 2 * margin, h: 1 - 2 * margin }];
  }

  if (count === 2) {
    // Side by side or top/bottom randomly
    if (Math.random() < 0.5) {
      const w = (1 - 2 * margin - gap) / 2;
      return [
        { x: margin, y: margin, w, h: 1 - 2 * margin },
        { x: margin + w + gap, y: margin, w, h: 1 - 2 * margin },
      ];
    } else {
      const h = (1 - 2 * margin - gap) / 2;
      return [
        { x: margin, y: margin, w: 1 - 2 * margin, h },
        { x: margin, y: margin + h + gap, w: 1 - 2 * margin, h },
      ];
    }
  }

  // 3 groups: triangle layout
  const cellW = (1 - 2 * margin - gap) / 2;
  const cellH = (1 - 2 * margin - gap) / 2;
  return [
    { x: (1 - cellW) / 2, y: margin, w: cellW, h: cellH },
    { x: margin, y: margin + cellH + gap, w: cellW, h: cellH },
    { x: margin + cellW + gap, y: margin + cellH + gap, w: cellW, h: cellH },
  ];
}
