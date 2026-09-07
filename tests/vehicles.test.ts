import { describe, expect, it } from 'vitest';
import { canonicalRoadType, filterVehicleList, validateVehicle, vehicleReferenceLabel, vehicles, type Vehicle } from '../src/data/loader';

const makeVehicle = (overrides: Partial<Vehicle> = {}): Vehicle => ({
  id: 'test-car', market: 'JP', maker: 'テスト', model: 'モデル', modelYear: '2026', generation: null, catalogAsOf: null, salesUnitIntroducedAt: null, priceEffectiveAt: null, grade: '標準',
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
    expect(validateVehicle({ ...makeVehicle(), catalogAsOf: undefined })).toBe(false);
    expect(validateVehicle({ ...makeVehicle(), catalogAsOf: '2026-2' })).toBe(false);
    expect(validateVehicle({ ...makeVehicle(), salesUnitIntroducedAt: '2026-02-31' })).toBe(false);
    expect(validateVehicle({ ...makeVehicle(), modelYear: null })).toBe(true);
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
    expect(vehicles).toHaveLength(14);
    expect(vehicles.every((vehicle) => validateVehicle(vehicle))).toBe(true);
  });

  it('現行カタログ確認済みTesla 2モデルは日本向け根拠付きのLevel 2相当として扱う', () => {
    const tesla = vehicles.filter((vehicle) => vehicle.maker === 'Tesla');
    expect(tesla.map((vehicle) => vehicle.model).sort()).toEqual(['Model 3', 'Model Y']);
    expect(tesla).toHaveLength(2);
    expect(tesla.every((vehicle) => vehicle.automationLevel === 2 && vehicle.category === 'driver_assistance')).toBe(true);
    expect(tesla.every((vehicle) => vehicle.sources.some((source) => source.publisher === 'Tesla Japan' && source.accessedAt === '2026-09-07'))).toBe(true);
    expect(tesla.every((vehicle) => vehicle.handsOff === 'not_allowed' && vehicle.driverMonitoring === 'required')).toBe(true);
    expect(tesla.every((vehicle) => vehicleReferenceLabel(vehicle) === '現行仕様')).toBe(true);
  });

  it('時系列フィールドは公式モデル年・世代・適用時点を混同しない', () => {
    const ariya = vehicles.filter((vehicle) => vehicle.model === '日産アリア');
    expect(ariya).toHaveLength(4);
    expect(ariya.every((vehicle) => vehicle.modelYear === null && vehicle.catalogAsOf === '2026-02' && vehicle.salesUnitIntroducedAt === '2026-02')).toBe(true);
    const serena = vehicles.find((vehicle) => vehicle.model === 'セレナ');
    expect(serena && vehicleReferenceLabel(serena)).toBe('C28');
    expect(serena?.modelYear).toBeNull();
    const volvo = vehicles.filter((vehicle) => vehicle.maker === 'Volvo');
    expect(volvo.every((vehicle) => vehicleReferenceLabel(vehicle) === '2027年モデル' && vehicle.catalogAsOf === '2026-07' && vehicle.priceEffectiveAt === '2026-07')).toBe(true);
  });

  it('Volvo EX30の2027年モデル3グレードを同じ監視条件で別販売単位に保つ', () => {
    const ex30 = vehicles.filter((vehicle) => vehicle.maker === 'Volvo' && vehicle.model === 'EX30');
    expect(ex30.map((vehicle) => vehicle.grade).sort()).toEqual([
      'Plus P5 Electric',
      'Ultra P5 Long Range Electric',
      'Ultra P8 AWD Electric',
    ]);
    expect(ex30).toHaveLength(3);
    expect(ex30.every((vehicle) => vehicle.modelYear === '2027' && vehicle.automationLevel === 2)).toBe(true);
    expect(ex30.every((vehicle) => vehicle.handsOff === 'not_allowed' && vehicle.driverMonitoring === 'required')).toBe(true);
    expect(ex30.every((vehicle) => vehicle.sources.some((source) => source.publisher === 'ボルボ・カー・ジャパン'))).toBe(true);
  });
});
