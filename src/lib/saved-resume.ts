export const SAVED_RESUME_STORAGE_KEY = 'jidouunten:saved-resume:v1';

export type SavedResumeKind = 'search' | 'compare';

export interface SavedResumeItem {
  href: string;
  label: string;
  savedAt: string;
}

export interface SavedResumeState {
  version: 1;
  search: SavedResumeItem | null;
  compare: SavedResumeItem | null;
}

const ALLOWED_PATHS = new Set(['/', '/cars/', '/compare/']);
const SEARCH_KEYS = new Set(['maker', 'level', 'capability', 'handsOff', 'road', 'availability', 'sort']);

export function emptySavedResumeState(): SavedResumeState {
  return { version: 1, search: null, compare: null };
}

function isDate(value: unknown) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

/** 保存対象は自サイトの既存一覧・比較URLだけに限定し、外部URLや未知のqueryを受け付けない。 */
export function normalizeSavedHref(kind: SavedResumeKind, href: unknown): string | null {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//') || /[\u0000-\u001f\\]/.test(href)) return null;
  try {
    const url = new URL(href, 'https://jidouunten.jp');
    if (url.origin !== 'https://jidouunten.jp' || !ALLOWED_PATHS.has(url.pathname) || url.hash) return null;
    const params = new URLSearchParams();
    if (kind === 'search') {
      if (url.pathname !== '/' && url.pathname !== '/cars/') return null;
      for (const [key, value] of url.searchParams.entries()) {
        if (!SEARCH_KEYS.has(key) || params.has(key) || !value || value.length > 120) return null;
        params.set(key, value);
      }
      if (params.get('sort') === 'introduced_desc') params.delete('sort');
    } else {
      if (url.pathname !== '/compare/') return null;
      const ids = url.searchParams.getAll('ids');
      if (url.searchParams.keys().some((key) => key !== 'ids') || ids.length !== 2 || ids[0] === ids[1] || ids.some((id) => !/^[a-z0-9-]+$/.test(id))) return null;
      ids.forEach((id) => params.append('ids', id));
    }
    const query = params.toString();
    return `${url.pathname}${query ? `?${query}` : ''}`;
  } catch {
    return null;
  }
}

export function readSavedResumeState(storage: Pick<Storage, 'getItem'> | null | undefined): SavedResumeState | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(SAVED_RESUME_STORAGE_KEY);
    if (!raw) return emptySavedResumeState();
    const parsed = JSON.parse(raw) as Partial<SavedResumeState>;
    if (parsed.version !== 1) return emptySavedResumeState();
    const state = emptySavedResumeState();
    for (const kind of ['search', 'compare'] as const) {
      const item = parsed[kind];
      if (!item || typeof item !== 'object') continue;
      const href = normalizeSavedHref(kind, item.href);
      if (href && typeof item.label === 'string' && item.label.length <= 120 && isDate(item.savedAt)) {
        state[kind] = { href, label: item.label, savedAt: item.savedAt };
      }
    }
    return state;
  } catch {
    return emptySavedResumeState();
  }
}

export function writeSavedResumeState(storage: Pick<Storage, 'setItem'> | null | undefined, state: SavedResumeState) {
  if (!storage) return false;
  try {
    storage.setItem(SAVED_RESUME_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function updateSavedResume(storage: Pick<Storage, 'getItem' | 'setItem'> | null | undefined, kind: SavedResumeKind, href: unknown, label: unknown, savedAt = new Date().toISOString()) {
  const normalized = normalizeSavedHref(kind, href);
  const state = readSavedResumeState(storage);
  if (!normalized || !state || !isDate(savedAt)) return false;
  state[kind] = { href: normalized, label: typeof label === 'string' && label.trim() ? label.trim().slice(0, 120) : kind === 'search' ? '保存した検索' : '保存した比較', savedAt };
  return writeSavedResumeState(storage, state);
}

export function deleteSavedResume(storage: Pick<Storage, 'getItem' | 'setItem'> | null | undefined, kind: SavedResumeKind) {
  const state = readSavedResumeState(storage);
  if (!state) return false;
  state[kind] = null;
  return writeSavedResumeState(storage, state);
}
