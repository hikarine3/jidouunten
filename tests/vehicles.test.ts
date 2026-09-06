import { describe, expect, it } from 'vitest';
import { filterVehicleList, validateVehicle, vehicles, type Vehicle } from '../src/data/loader';

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
  });

  it('validates every supplied catalog record before release', () => {
    expect(vehicles.length).toBeGreaterThanOrEqual(6);
    expect(vehicles.every((vehicle) => validateVehicle(vehicle))).toBe(true);
  });
});
