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
    expect(vehicles).toHaveLength(38);
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

  it('Suzuki e VITARAの3販売単位を全車標準の縦横支援として保持する', () => {
    const evitara = vehicles.filter((vehicle) => vehicle.maker === 'Suzuki' && vehicle.model === 'e VITARA');
    expect(evitara.map((vehicle) => vehicle.id).sort()).toEqual([
      'jp-suzuki-e-vitara-2026-x-2wd',
      'jp-suzuki-e-vitara-2026-z-2wd',
      'jp-suzuki-e-vitara-2026-z-4wd',
    ]);
    expect(evitara).toHaveLength(3);
    expect(evitara.every((vehicle) => vehicle.modelYear === null && vehicle.generation === null && vehicle.catalogAsOf === null && vehicle.salesUnitIntroducedAt === '2026-01-16' && vehicle.priceEffectiveAt === null)).toBe(true);
    expect(evitara.every((vehicle) => vehicle.automationLevel === 2 && vehicle.category === 'driver_assistance' && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'unknown')).toBe(true);
    expect(evitara.every((vehicle) => vehicle.requiredPackage?.includes('全車標準装備') && vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,driver_monitoring')).toBe(true);
    expect(evitara.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://www.suzuki.co.jp/release/a/2025/0916/index.html' && source.accessedAt === '2026-09-07'))).toBe(true);
  });

  it('Renault ARKANAの4販売単位をACC・車線中央支援付きとして保持する', () => {
    const arkana = vehicles.filter((vehicle) => vehicle.maker === 'Renault' && vehicle.model === 'ARKANA');
    expect(arkana.map((vehicle) => vehicle.id).sort()).toEqual([
      'jp-renault-arkana-esprit-alpine-full-hybrid-e-tech',
      'jp-renault-arkana-esprit-alpine-mild-hybrid',
      'jp-renault-arkana-techno-full-hybrid-e-tech',
      'jp-renault-arkana-techno-mild-hybrid',
    ]);
    expect(arkana).toHaveLength(4);
    expect(arkana.every((vehicle) => vehicle.modelYear === null && vehicle.generation === null && vehicle.salesUnitIntroducedAt === null && vehicle.priceEffectiveAt === null)).toBe(true);
    expect(arkana.filter((vehicle) => vehicle.grade.startsWith('esprit Alpine')).every((vehicle) => vehicle.catalogAsOf === '2025-07')).toBe(true);
    expect(arkana.filter((vehicle) => vehicle.grade.startsWith('techno')).every((vehicle) => vehicle.catalogAsOf === '2025-09')).toBe(true);
    expect(arkana.every((vehicle) => vehicle.automationLevel === 2 && vehicle.category === 'driver_assistance' && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'unknown')).toBe(true);
    expect(arkana.every((vehicle) => vehicle.odd.speedKph.min === 0 && vehicle.odd.speedKph.max === 160 && vehicle.odd.speedKph.condition?.includes('ACC単体はおおむね0〜170km/h') === true)).toBe(true);
    expect(arkana.every((vehicle) => vehicle.requiredPackage?.includes('ACC（ストップ＆ゴー機能付）') && vehicle.requiredPackage.includes('レーンセンタリングアシスト') && vehicle.requiredPackage.includes('標準装備'))).toBe(true);
    expect(arkana.every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist')).toBe(true);
    expect(arkana.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://dcms.renault.jp/car_lineup/pricelist.php' && source.accessedAt === '2026-09-07'))).toBe(true);
  });

  it('BMW 3シリーズの通常カタログ9販売単位を世代・形状別に保持する', () => {
    const bmw = vehicles.filter((vehicle) => vehicle.maker === 'BMW');
    expect(bmw.map((vehicle) => vehicle.id).sort()).toEqual([
      'jp-bmw-3-series-g20-sedan-318i-m-sport',
      'jp-bmw-3-series-g20-sedan-320d-xdrive-m-sport',
      'jp-bmw-3-series-g20-sedan-320i-m-sport',
      'jp-bmw-3-series-g20-sedan-330e-m-sport',
      'jp-bmw-3-series-g20-sedan-m340i-xdrive',
      'jp-bmw-3-series-g21-touring-318i-m-sport',
      'jp-bmw-3-series-g21-touring-320d-xdrive-m-sport',
      'jp-bmw-3-series-g21-touring-320i-m-sport',
      'jp-bmw-3-series-g21-touring-m340i-xdrive',
    ]);
    expect(bmw.filter((vehicle) => vehicle.generation === 'G20')).toHaveLength(5);
    expect(bmw.filter((vehicle) => vehicle.generation === 'G21')).toHaveLength(4);
    expect(bmw.every((vehicle) => vehicle.modelYear === null && vehicle.catalogAsOf === '2026-07' && vehicle.priceEffectiveAt === '2026-07' && vehicle.salesUnitIntroducedAt === null)).toBe(true);
    expect(bmw.every((vehicle) => vehicle.automationLevel === 2 && vehicle.requiredPackage === 'ドライビング・アシスト・プロフェッショナル（標準装備）')).toBe(true);
    expect(bmw.every((vehicle) => vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'allowed_in_conditions' && !vehicle.capabilities.includes('driver_monitoring'))).toBe(true);
    expect(bmw.every((vehicle) => vehicle.odd.speedKph.min === null && vehicle.odd.speedKph.max === null)).toBe(true);
    expect(bmw.every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist,hands_off_highway')).toBe(true);
    expect(bmw.every((vehicle) => vehicle.sources.some((source) => source.url.includes('3series_') && source.url.includes('EPL_202607V1') && source.supports.some((support) => support.includes('メーカー希望小売価格'))))).toBe(true);
  });

  it('MINI Countrymanの2026年7月以降生産8販売単位を装備差・導入時点付きで保持する', () => {
    const mini = vehicles.filter((vehicle) => vehicle.maker === 'MINI' && vehicle.model === 'Countryman');
    expect(mini.map((vehicle) => vehicle.id).sort()).toEqual([
      'jp-mini-countryman-u25-c',
      'jp-mini-countryman-u25-c-select',
      'jp-mini-countryman-u25-d',
      'jp-mini-countryman-u25-e',
      'jp-mini-countryman-u25-john-cooper-works-all4',
      'jp-mini-countryman-u25-s-all4',
      'jp-mini-countryman-u25-s-all4-select',
      'jp-mini-countryman-u25-se-all4',
    ]);
    expect(mini).toHaveLength(8);
    expect(mini.every((vehicle) => vehicle.modelYear === null && vehicle.generation === '第3世代' && vehicle.catalogAsOf === '2026-07' && vehicle.priceEffectiveAt === '2026-07')).toBe(true);
    expect(mini.every((vehicle) => vehicle.automationLevel === 2 && vehicle.category === 'driver_assistance' && vehicle.driverMonitoring === 'required')).toBe(true);
    const select = mini.filter((vehicle) => vehicle.grade.endsWith('SELECT'));
    expect(select).toHaveLength(2);
    expect(select.every((vehicle) => vehicle.handsOff === 'not_allowed' && vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist' && !vehicle.capabilities.includes('driver_monitoring'))).toBe(true);
    expect(select.every((vehicle) => {
      const geoRestrictions = Array.isArray(vehicle.odd.geoRestriction) ? vehicle.odd.geoRestriction : [vehicle.odd.geoRestriction];
      return vehicle.odd.roadTypes.join(',') === '不明' && geoRestrictions.some((condition) => condition.includes('対象道路は現行公開資料で未確認'));
    })).toBe(true);
    expect(select.every((vehicle) => !vehicle.odd.driverConditions.some((condition) => condition.includes('両手') || condition.includes('片手')))).toBe(true);
    const professional = mini.filter((vehicle) => !vehicle.grade.endsWith('SELECT'));
    expect(professional).toHaveLength(6);
    expect(professional.every((vehicle) => vehicle.handsOff === 'allowed_in_conditions' && vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist,hands_off_highway' && !vehicle.capabilities.includes('driver_monitoring'))).toBe(true);
    expect(professional.every((vehicle) => vehicle.requiredPackage?.includes('ドライビング・アシスタント・プロフェッショナル') && vehicle.odd.roadTypes.join(',') === '不明')).toBe(true);
    expect(mini.every((vehicle) => vehicle.odd.speedKph.min === null && vehicle.odd.speedKph.max === null)).toBe(true);
    expect(mini.find((vehicle) => vehicle.grade === 'C SELECT')?.salesUnitIntroducedAt).toBe('2026-03-03');
    expect(mini.find((vehicle) => vehicle.grade === 'C')?.salesUnitIntroducedAt).toBe('2026-03-03');
    expect(mini.find((vehicle) => vehicle.grade === 'S ALL4 SELECT')?.salesUnitIntroducedAt).toBe('2026-07-13');
    expect(mini.find((vehicle) => vehicle.grade === 'S ALL4')?.salesUnitIntroducedAt).toBe('2026-03-03');
    expect(mini.find((vehicle) => vehicle.grade === 'E')?.salesUnitIntroducedAt).toBe('2024-03-01');
    expect(mini.every((vehicle) => vehicle.sources.some((source) => source.url.includes('MINI_COUNTRYMAN_EPL_2607')))).toBe(true);
    const expectedPrices = new Map([
      ['C SELECT', '4,800,000円'],
      ['C', '5,180,000円'],
      ['D', '5,260,000円'],
      ['S ALL4 SELECT', '5,530,000円'],
      ['S ALL4', '5,920,000円'],
      ['JOHN COOPER WORKS COUNTRYMAN ALL4', '6,830,000円'],
      ['E', '6,040,000円'],
      ['SE ALL4', '6,780,000円'],
    ]);
    expect(mini.every((vehicle) => vehicle.sources.some((source) => source.url.includes('MINI_COUNTRYMAN_EPL_2607') && source.supports.some((support) => support.includes(expectedPrices.get(vehicle.grade) ?? ''))))).toBe(true);
  });
});
