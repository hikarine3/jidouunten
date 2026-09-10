import { describe, expect, it } from 'vitest';
import { deleteSavedResume, emptySavedResumeState, normalizeSavedHref, readSavedResumeState, SAVED_RESUME_STORAGE_KEY, updateSavedResume } from '../src/lib/saved-resume';

const storage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value); },
  };
};

describe('saved resume URL and browser storage contract', () => {
  it('normalizes only supported search URLs and omits the default sort', () => {
    expect(normalizeSavedHref('search', '/?maker=Tesla&sort=introduced_desc')).toBe('/?maker=Tesla');
    expect(normalizeSavedHref('search', '/cars/?level=2&availability=all')).toBe('/cars/?level=2&availability=all');
    expect(normalizeSavedHref('search', '/?maker=Tesla&unknown=x')).toBeNull();
    expect(normalizeSavedHref('search', 'https://evil.example/?maker=Tesla')).toBeNull();
    expect(normalizeSavedHref('search', '/detail/foo')).toBeNull();
  });

  it('requires exactly two distinct catalog-safe IDs for a comparison', () => {
    expect(normalizeSavedHref('compare', '/compare/?ids=car-a&ids=car-b')).toBe('/compare/?ids=car-a&ids=car-b');
    expect(normalizeSavedHref('compare', '/compare/?ids=car-a&ids=car-a')).toBeNull();
    expect(normalizeSavedHref('compare', '/compare/?ids=car-a')).toBeNull();
    expect(normalizeSavedHref('compare', '/compare/?ids=car-a&ids=car-b&ids=car-c')).toBeNull();
    expect(normalizeSavedHref('compare', '/compare/?ids=car_a&ids=car-b')).toBeNull();
    expect(normalizeSavedHref('compare', '/compare/?ids=car-a&foo=bar')).toBeNull();
  });

  it('replaces one item per kind and deletes it safely', () => {
    const fake = storage();
    expect(readSavedResumeState(fake)).toEqual(emptySavedResumeState());
    expect(updateSavedResume(fake, 'search', '/?maker=Tesla', 'Tesla')).toBe(true);
    expect(updateSavedResume(fake, 'search', '/?maker=Toyota', 'Toyota', '2026-09-10T00:00:00.000Z')).toBe(true);
    expect(readSavedResumeState(fake)).toMatchObject({ search: { href: '/?maker=Toyota', label: 'Toyota' }, compare: null });
    expect(updateSavedResume(fake, 'compare', '/compare/?ids=car-a&ids=car-b', 'A × B')).toBe(true);
    expect(deleteSavedResume(fake, 'search')).toBe(true);
    expect(readSavedResumeState(fake)).toMatchObject({ search: null, compare: { href: '/compare/?ids=car-a&ids=car-b' } });
    expect(deleteSavedResume(fake, 'compare')).toBe(true);
    expect(readSavedResumeState(fake)).toEqual(emptySavedResumeState());
  });

  it('保存時点の判断材料snapshotを保持し、不正なfingerprintは受け付けない', () => {
    const fake = storage();
    const signals = { identity: '11111111', capability: '22222222', odd: '33333333', package: '44444444', availability: '55555555', price: '66666666' };
    const snapshot = { entries: [{ id: 'car-a', fingerprint: 'a1b2c3d4', signals }, { id: 'car-b', fingerprint: '0000ffff', signals }] };
    expect(updateSavedResume(fake, 'compare', '/compare/?ids=car-a&ids=car-b', 'A × B', '2026-09-10T00:00:00.000Z', snapshot)).toBe(true);
    expect(readSavedResumeState(fake)?.compare?.snapshot).toEqual(snapshot);
    expect(updateSavedResume(fake, 'compare', '/compare/?ids=car-a&ids=car-b', 'A × B', '2026-09-10T00:00:00.000Z', { entries: [{ id: 'car-a', fingerprint: 'bad' }] })).toBe(true);
    expect(readSavedResumeState(fake)?.compare?.snapshot).toBeUndefined();
  });

  it('drops malformed or obsolete data and survives storage exceptions', () => {
    const fake = storage();
    fake.setItem(SAVED_RESUME_STORAGE_KEY, '{"version":99,"search":{"href":"https://evil.example","label":"x","savedAt":"2026-09-10"}}');
    expect(readSavedResumeState(fake)).toEqual(emptySavedResumeState());
    fake.setItem(SAVED_RESUME_STORAGE_KEY, '{"version":1,"search":{"href":"/?maker=Tesla","label":"x","savedAt":"not-a-date"}}');
    expect(readSavedResumeState(fake)).toEqual(emptySavedResumeState());
    const failing = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
    expect(readSavedResumeState(failing)).toEqual(emptySavedResumeState());
    expect(updateSavedResume(failing, 'search', '/?maker=Tesla', 'Tesla')).toBe(false);
  });
});
