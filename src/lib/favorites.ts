export const FAVORITES_STORAGE_KEY = 'jidouunten:favorites:v1';
export const FAVORITES_LIMIT = 100;

export type FavoriteStorage = Pick<Storage, 'getItem' | 'setItem'>;

const VALID_ID = /^[a-z0-9][a-z0-9-]*$/;

function normalizeIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  for (const candidate of value) {
    if (typeof candidate !== 'string' || !VALID_ID.test(candidate) || seen.has(candidate)) continue;
    seen.add(candidate);
    if (seen.size >= FAVORITES_LIMIT) break;
  }
  return [...seen];
}

export function readFavoriteIds(storage: Pick<Storage, 'getItem'> | null | undefined): string[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    return normalizeIds(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function writeFavoriteIds(storage: FavoriteStorage | null | undefined, ids: unknown): boolean {
  if (!storage) return false;
  try {
    storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(normalizeIds(ids)));
    return true;
  } catch {
    return false;
  }
}

export function addFavorite(storage: FavoriteStorage | null | undefined, id: unknown) {
  const current = readFavoriteIds(storage);
  if (typeof id !== 'string' || !VALID_ID.test(id)) return { ok: false, added: false, limitReached: false, ids: current };
  if (current.includes(id)) return { ok: true, added: false, limitReached: false, ids: current };
  if (current.length >= FAVORITES_LIMIT) return { ok: false, added: false, limitReached: true, ids: current };
  const ids = [...current, id];
  return { ok: writeFavoriteIds(storage, ids), added: true, limitReached: false, ids };
}

export function removeFavorite(storage: FavoriteStorage | null | undefined, id: unknown) {
  const current = readFavoriteIds(storage);
  if (typeof id !== 'string' || !VALID_ID.test(id)) return { ok: false, removed: false, ids: current };
  if (!current.includes(id)) return { ok: true, removed: false, ids: current };
  const ids = current.filter((candidate) => candidate !== id);
  return { ok: writeFavoriteIds(storage, ids), removed: true, ids };
}
