/**
 * Lightweight in-memory TTL cache for read-heavy public endpoints.
 * Reduces database round-trips under traffic spikes while staying safe
 * via short TTLs and explicit prefix invalidation on admin writes.
 */
const store = new Map();
const MAX_ENTRIES = 500;

exports.get = (key) => {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
};

exports.set = (key, value, ttlMs = 60000) => {
  if (store.size >= MAX_ENTRIES) {
    const oldestKey = store.keys().next().value;
    if (oldestKey !== undefined) store.delete(oldestKey);
  }
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
};

exports.del = (key) => {
  store.delete(key);
};

exports.delByPrefix = (prefix) => {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
};
