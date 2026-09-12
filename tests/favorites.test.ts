import { describe, expect, it } from 'vitest';
import { addFavorite, FAVORITES_LIMIT, FAVORITES_STORAGE_KEY, readFavoriteIds, removeFavorite, writeFavoriteIds } from '../src/lib/favorites';

const storage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value); },
  };
};

describe('favorites browser storage contract', () => {
  it('normalizes IDs, removes duplicates, and caps stored state', () => {
    const fake = storage();
    expect(writeFavoriteIds(fake, ['jp-a', 'jp-a', 'bad_id', 42, 'jp-b'])).toBe(true);
    expect(readFavoriteIds(fake)).toEqual(['jp-a', 'jp-b']);
    const ids = Array.from({ length: FAVORITES_LIMIT + 3 }, (_, index) => `jp-${index}`);
    expect(writeFavoriteIds(fake, ids)).toBe(true);
    expect(readFavoriteIds(fake)).toHaveLength(FAVORITES_LIMIT);
  });

  it('adds, deduplicates, removes, and blocks the 101st item', () => {
    const fake = storage();
    expect(addFavorite(fake, 'jp-a')).toMatchObject({ ok: true, added: true, ids: ['jp-a'] });
    expect(addFavorite(fake, 'jp-a')).toMatchObject({ ok: true, added: false, ids: ['jp-a'] });
    expect(removeFavorite(fake, 'jp-a')).toMatchObject({ ok: true, removed: true, ids: [] });
    writeFavoriteIds(fake, Array.from({ length: FAVORITES_LIMIT }, (_, index) => `jp-${index}`));
    expect(addFavorite(fake, 'jp-over')).toMatchObject({ ok: false, added: false, limitReached: true, ids: expect.any(Array) });
  });

  it('survives malformed data and blocked storage without throwing', () => {
    const malformed = storage();
    malformed.setItem(FAVORITES_STORAGE_KEY, '{bad');
    expect(readFavoriteIds(malformed)).toEqual([]);
    const failing = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
    expect(readFavoriteIds(failing)).toEqual([]);
    expect(addFavorite(failing, 'jp-a').ok).toBe(false);
    expect(removeFavorite(failing, 'jp-a').ok).toBe(true);
  });
});
