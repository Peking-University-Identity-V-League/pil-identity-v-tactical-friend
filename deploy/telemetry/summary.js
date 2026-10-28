const list = (value) => Array.isArray(value) ? value : [];
const count = (value) => Math.min(10000, list(value).length);

export function summarizeBoard(board = {}) {
  const tokens = board.tokens && typeof board.tokens === 'object'
    ? Object.values(board.tokens).slice(0, 2000) : [];
  const items = list(board.items).slice(0, 2000);
  const summary = {
    role_count: tokens.length,
    item_count: count(board.items),
    arrow_count: count(board.arrows),
    text_count: count(board.texts),
    measure_count: count(board.measures),
  };
  for (let i = 1; i <= 9; i += 1) summary['zone_' + i] = 0;
  for (const point of [...tokens, ...items]) {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)
        || point.x < 0 || point.x > 1 || point.y < 0 || point.y > 1) continue;
    const column = Math.min(2, Math.floor(point.x * 3));
    const row = Math.min(2, Math.floor(point.y * 3));
    summary['zone_' + (row * 3 + column + 1)] += 1;
  }
  return summary;
}

// This change detector stays in browser memory. It is never sent to Umami.
export function boardFingerprint(board) {
  try {
    const value = JSON.stringify(board || {});
    if (value.length > 1024 * 1024) return null;
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
    return hash >>> 0;
  } catch { return null; }
}
