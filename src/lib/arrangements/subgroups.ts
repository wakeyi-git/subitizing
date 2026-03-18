// Valid partitions for conceptual subitizing
// Each partition splits a quantity into perceptually subitizable sub-groups (1-5 each)

const PARTITION_POOL: Record<number, number[][]> = {
  4: [[1, 3], [2, 2]],
  5: [[2, 3], [1, 4]],
  6: [[3, 3], [2, 4], [1, 5]],
  7: [[3, 4], [2, 5]],
  8: [[3, 5], [4, 4]],
  9: [[4, 5], [3, 3, 3]],
  10: [[5, 5], [4, 3, 3]],
  11: [[5, 5, 1], [4, 4, 3]],
  12: [[5, 5, 2], [4, 4, 4]],
  13: [[5, 5, 3], [5, 4, 4]],
  14: [[5, 5, 4]],
  15: [[5, 5, 5]],
};

// Track recently used partitions to avoid repetition
const recentPartitions: Map<number, number[][]> = new Map();
const MAX_RECENT = 3;

export function getPartition(quantity: number): number[] {
  const pool = PARTITION_POOL[quantity];
  if (!pool) return [quantity];

  const recent = recentPartitions.get(quantity) ?? [];

  // Filter out recently used partitions
  const available = pool.filter(
    p => !recent.some(r => r.length === p.length && r.every((v, i) => v === p[i])),
  );

  const choices = available.length > 0 ? available : pool;
  const chosen = choices[Math.floor(Math.random() * choices.length)];

  // Track this partition
  recent.push(chosen);
  if (recent.length > MAX_RECENT) recent.shift();
  recentPartitions.set(quantity, recent);

  return chosen;
}

export function hasPartitions(quantity: number): boolean {
  return quantity in PARTITION_POOL;
}
