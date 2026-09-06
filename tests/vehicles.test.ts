import { describe, expect, it } from 'vitest';
import { canonicalRoadType, filterVehicleList, validateVehicle, vehicles, type Vehicle } from '../src/data/loader';

const makeVehicle = (overrides: Partial<Vehicle> = {}): Vehicle => ({
  id: 'test-car', market: 'JP', maker: 'テスト', model: 'モデル', modelYear: '2026', grade: '標準',
  requiredPackage: null, automationLevel: 2, category: 'driver_assistance', availability: 'new_order_available',
  availabilityCheckedAt: '2026-09-01', odd: { roadTypes: ['高速道路'], speedKph: { max: 100 }, trafficConditions: [], weather: [], geoRestriction: [], driverConditions: ['着座'], manufacturerSummary: '要約' },
  driverMonitoring: 'required', handsOff: 'allowed_in_conditions', capabilities: ['lane'], limitations: ['監視'],
  sources: [{ url: 'https://example.com', publisher: '公式', title: '資料', accessedAt: '2026-09-01', supports: ['level'] }], factStatus: 'verified', lastReviewedAt: '2026-09-01',
  currentCatalogListed: true,
  ...overrides,
});

describe('vehicle data contract and filters', () => {
  it('accepts a complete JP record and rejects incomplete records', () => {
    expect(validateVehicle(makeVehicle())).toBe(true);
    expect(validateVehicle({ id: 'missing' })).toBe(false);
    expect(validateVehicle({ ...makeVehicle(), currentCatalogListed: undefined })).toBe(false);
  });

  it('filters by level, road, hands-off and availability together', () => {
    const list = [
      makeVehicle({ id: 'a' }),
      makeVehicle({ id: 'b', automationLevel: 1, handsOff: 'not_allowed' }),
      makeVehicle({ id: 'c', availability: 'used_only' }),
      makeVehicle({ id: 'hidden', availability: 'unknown', currentCatalogListed: false }),
    ];
    expect(filterVehicleList(list, { level: 2, road: '高速道路', handsOff: 'allowed_in_conditions', availability: 'new_order_available' }).map((v) => v.id)).toEqual(['a']);
    expect(filterVehicleList(list, { availability: 'used_only' }).map((v) => v.id)).toEqual(['c']);
    expect(filterVehicleList(list, {}).map((v) => v.id)).toEqual(['a', 'b']);
    expect(filterVehicleList([makeVehicle({ id: 'mainline', odd: { ...makeVehicle().odd, roadTypes: ['高速道路の本線'] } })], { road: '高速道路' }).map((v) => v.id)).toEqual(['mainline']);
  });

  it('normalizes detailed ODD road labels for the shared filter', () => {
    expect(canonicalRoadType('高速道路の本線')).toBe('高速道路');
    expect(canonicalRoadType('自動車専用道路の本線')).toBe('自動車専用道路');
    expect(canonicalRoadType('一般道')).toBe('一般道');
  });

  it('validates every supplied catalog record before release', () => {
    expect(vehicles.length).toBeGreaterThanOrEqual(6);
    expect(vehicles.every((vehicle) => validateVehicle(vehicle))).toBe(true);
  });
});
