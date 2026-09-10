import { describe, expect, it } from 'vitest';
import { canonicalRoadType, displayVehiclePrice, filterVehicleList, isDefaultListedVehicle, levelCaveat, officialLinkFor, officialLinks, sortVehicleList, validateVehicle, vehiclePriceMin, vehicleReferenceLabel, vehicles, type Vehicle } from '../src/data/loader';

const makeVehicle = (overrides: Partial<Vehicle> = {}): Vehicle => ({
  id: 'test-car', market: 'JP', maker: 'テスト', model: 'モデル', modelYear: '2026', generation: null, catalogAsOf: null, salesUnitIntroducedAt: null, priceEffectiveAt: null, price: null, grade: '標準',
  requiredPackage: null, automationLevel: 2, category: 'driver_assistance', availability: 'new_order_available',
  availabilityCheckedAt: '2026-09-01', odd: { roadTypes: ['高速道路'], speedKph: { max: 100 }, trafficConditions: [], weather: [], geoRestriction: [], driverConditions: ['着座'], manufacturerSummary: '要約' },
  driverMonitoring: 'required', handsOff: 'allowed_in_conditions', capabilities: ['lane_centering'], limitations: ['監視'],
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
    expect(validateVehicle({ ...makeVehicle(), capabilities: ['raw_unknown_id'] })).toBe(false);
    expect(validateVehicle({ ...makeVehicle(), modelYear: null })).toBe(true);
  });

  it('filters makers and defined capabilities together', () => {
    const list = [
      makeVehicle({ id: 'tesla-match', maker: 'Tesla', capabilities: ['lane_centering', 'lane_change_support'] }),
      makeVehicle({ id: 'tesla-other', maker: 'Tesla', capabilities: ['lane_centering'] }),
      makeVehicle({ id: 'other', maker: 'Honda', capabilities: ['lane_change_support'] }),
    ];
    expect(filterVehicleList(list, { maker: 'Tesla', capability: 'lane_change_support' }).map((vehicle) => vehicle.id)).toEqual(['tesla-match']);
  });

  it('sorts by confirmed introduction date and leaves unknown dates last', () => {
    const list = [
      makeVehicle({ id: 'unknown-b', maker: 'B', salesUnitIntroducedAt: null }),
      makeVehicle({ id: 'older', maker: 'C', salesUnitIntroducedAt: '2025-01' }),
      makeVehicle({ id: 'newer', maker: 'D', salesUnitIntroducedAt: '2026-07-13' }),
      makeVehicle({ id: 'unknown-a', maker: 'A', salesUnitIntroducedAt: null }),
    ];
    expect(sortVehicleList(list).map((vehicle) => vehicle.id)).toEqual(['newer', 'older', 'unknown-a', 'unknown-b']);
    expect(sortVehicleList(list, 'maker_asc').map((vehicle) => vehicle.id)).toEqual(['unknown-a', 'unknown-b', 'older', 'newer']);
  });

  it('価格が安い順は車両本体の最小額を使い、未確認を末尾に置く', () => {
    const exact = makeVehicle({ id: 'exact', price: { kind: 'exact', currency: 'JPY', amounts: [{ amountJpy: 4_790_000, qualifier: null, sourceUrl: 'https://example.com' }], maxJpy: 4_790_000, optionalPackages: [], basis: 'vehicle_body', taxIncluded: 'unknown' } });
    const multi = makeVehicle({ id: 'multi', price: { kind: 'exact', currency: 'JPY', amounts: [{ amountJpy: 3_300_000, qualifier: '2WD', sourceUrl: 'https://example.com' }, { amountJpy: 3_536_500, qualifier: '4WD', sourceUrl: 'https://example.com' }], maxJpy: 3_536_500, optionalPackages: [], basis: 'unknown', taxIncluded: 'unknown' } });
    const unknown = makeVehicle({ id: 'unknown', price: null });
    expect(sortVehicleList([exact, unknown, multi], 'price_asc').map(({ id }) => id)).toEqual(['multi', 'exact', 'unknown']);
    expect(vehiclePriceMin(multi)).toBe(3_300_000);
    expect(displayVehiclePrice(exact, true)).toBe('約479万円');
    expect(displayVehiclePrice(multi, true)).toBe('約330〜354万円');
    expect(displayVehiclePrice(unknown, true)).toBe('価格要確認');
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
    expect(filterVehicleList(list, { availability: 'all' }).map((v) => v.id)).toEqual(['a', 'b', 'c', 'hidden']);
    expect(filterVehicleList(list, {}).map((v) => v.id)).toEqual(['a', 'b']);
    expect(filterVehicleList([makeVehicle({ id: 'mainline', odd: { ...makeVehicle().odd, roadTypes: ['高速道路の本線'] } })], { road: '高速道路' }).map((v) => v.id)).toEqual(['mainline']);
  });

  it('uses one default-list predicate for filtering and top-page counts', () => {
    const list = [
      makeVehicle({ id: 'orderable' }),
      makeVehicle({ id: 'catalog-review', availability: 'unknown', currentCatalogListed: true }),
      makeVehicle({ id: 'not-listed', availability: 'unknown', currentCatalogListed: false }),
      makeVehicle({ id: 'past', availability: 'unavailable', currentCatalogListed: false }),
    ];
    expect(list.filter(isDefaultListedVehicle).map((vehicle) => vehicle.id)).toEqual(['orderable', 'catalog-review']);
    expect(filterVehicleList(list, {}).map((vehicle) => vehicle.id)).toEqual(['orderable', 'catalog-review']);
  });

  it('normalizes detailed ODD road labels for the shared filter', () => {
    expect(canonicalRoadType('高速道路の本線')).toBe('高速道路');
    expect(canonicalRoadType('自動車専用道路の本線')).toBe('自動車専用道路');
    expect(canonicalRoadType('一般道')).toBe('一般道');
  });

  it('validates every supplied catalog record before release', () => {
    expect(vehicles).toHaveLength(79);
    expect(vehicles.every((vehicle) => validateVehicle(vehicle))).toBe(true);
  });

  it('現行候補78件は全件の公式金額を保持する', () => {
    const current = vehicles.filter(isDefaultListedVehicle);
    expect(current).toHaveLength(78);
    expect(current.filter((vehicle) => vehicle.price !== null)).toHaveLength(78);
    expect(current.filter((vehicle) => vehicle.price === null)).toHaveLength(0);
    expect(vehicles.find(({ id }) => id === 'jp-honda-accord-2025-ehev-sensing360plus')?.price?.amounts[0].amountJpy).toBe(6_351_400);
    expect(vehicles.find(({ id }) => id === 'jp-nissan-ariya-2026-b6')?.priceEffectiveAt).toBe('2026-02');
    expect(vehicles.find(({ id }) => id === 'jp-nissan-serena-2026-e-power-luxion')?.price?.optionalPackages[0].amountJpy).toBe(49_500);
    expect(vehicles.find(({ id }) => id === 'jp-subaru-levorg-layback-2023-limited-ex')?.price?.kind).toBe('range');
  });

  it('全販売単位に用途を分けたメーカー公式導線を持つ', () => {
    expect(officialLinks).toHaveLength(22);
    expect(vehicles.every((vehicle) => Boolean(officialLinkFor(vehicle)))).toBe(true);
    expect(vehicles.filter(isDefaultListedVehicle).every((vehicle) => officialLinkFor(vehicle)?.kind === 'product')).toBe(true);
    expect(officialLinkFor(vehicles.find(({ id }) => id === 'jp-honda-legend-2021-honda-sensing-elite')!)?.kind).toBe('archive');
    expect(new Set(officialLinks.map(({ maker, model }) => `${maker}\u0000${model}`)).size).toBe(officialLinks.length);
  });

  it('Level 4とLevel 5を限定条件の有無で分ける', () => {
    expect(levelCaveat(4)).toContain('限定されたエリア');
    expect(levelCaveat(5)).toContain('走行エリアや天候などを限定せず');
    expect(levelCaveat(4)).not.toBe(levelCaveat(5));
  });

  it('Mazda日本向け現行6車種は35販売単位を公式装備表付きで保持する', () => {
    const mazda = vehicles.filter((vehicle) => vehicle.maker === 'Mazda');
    expect(mazda).toHaveLength(35);
    expect(mazda.filter((vehicle) => vehicle.model === 'CX-80')).toHaveLength(8);
    expect(mazda.filter((vehicle) => vehicle.model === 'CX-60')).toHaveLength(11);
    expect(mazda.filter((vehicle) => vehicle.model === '新型 CX-5')).toHaveLength(4);
    expect(mazda.filter((vehicle) => vehicle.model === 'MAZDA3 FASTBACK')).toHaveLength(6);
    expect(mazda.filter((vehicle) => vehicle.model === 'MAZDA3 SEDAN')).toHaveLength(1);
    expect(mazda.filter((vehicle) => vehicle.model === 'CX-30')).toHaveLength(4);
    expect(mazda.filter((vehicle) => vehicle.model === 'MX-30 ROTARY-EV')).toHaveLength(1);
    expect(mazda.every((vehicle) => vehicle.currentCatalogListed && vehicle.modelYear === null && vehicle.salesUnitIntroducedAt === null && vehicle.priceEffectiveAt === null)).toBe(true);
    expect(mazda.every((vehicle) => vehicle.automationLevel === 2 && vehicle.category === 'driver_assistance' && vehicle.driverMonitoring === 'required' && vehicle.handsOff !== 'unknown')).toBe(true);
    expect(mazda.every((vehicle) => vehicle.requiredPackage?.includes('MRCC') && vehicle.requiredPackage.includes('CTS'))).toBe(true);
    expect(mazda.every((vehicle) => vehicle.sources.some((source) => source.publisher === 'マツダ株式会社' && source.url.includes('mazda.co.jp') && source.accessedAt === '2026-09-08'))).toBe(true);
    expect(mazda.every((vehicle) => vehicle.sources.some((source) => source.supports.some((support) => support.includes('円'))))).toBe(true);
    const handsOnManualModels = new Set(['MAZDA3 FASTBACK', 'MAZDA3 SEDAN', 'CX-30', 'MX-30 ROTARY-EV']);
    expect(mazda.filter((vehicle) => handsOnManualModels.has(vehicle.model))).toHaveLength(12);
    expect(mazda.filter((vehicle) => handsOnManualModels.has(vehicle.model)).every((vehicle) => vehicle.sources.some((source) => source.title.includes('取扱説明書') && source.supports.some((support) => support.includes('手を放す'))))).toBe(true);
    expect(mazda.find((vehicle) => vehicle.model === '新型 CX-5' && vehicle.grade === 'G')?.handsOff).toBe('not_allowed');
    expect(mazda.find((vehicle) => vehicle.id === 'jp-mazda-cx-5-g-ex-package')?.capabilities).toEqual(expect.arrayContaining(['hands_off_highway', 'lane_change_support']));
    expect(mazda.find((vehicle) => vehicle.model === '新型 CX-5' && vehicle.grade === 'L')?.capabilities).toEqual(expect.arrayContaining(['hands_off_highway', 'lane_change_support']));
    expect(mazda.find((vehicle) => vehicle.model === '新型 CX-5' && vehicle.grade === 'S')?.handsOff).toBe('not_allowed');
    expect(mazda.find((vehicle) => vehicle.model === 'CX-30' && vehicle.grade === '20G')?.requiredPackage).toContain('メーカーオプション');
    expect(mazda.find((vehicle) => vehicle.model === 'CX-30' && vehicle.grade === '20G')?.capabilities).toContain('driver_monitoring');
    expect(mazda.find((vehicle) => vehicle.model === 'CX-30' && vehicle.grade === '20G')?.sources.flatMap((source) => source.supports)).toContain('EX Package 148,500円（CTS・ドライバー・モニタリングを含む）');
    expect(mazda.find((vehicle) => vehicle.id === 'jp-mazda-mazda3-fastback-25s-6ec-at')?.capabilities).not.toContain('driver_monitoring');
    expect(mazda.find((vehicle) => vehicle.id === 'jp-mazda-mazda3-fastback-25s-6ec-at')?.requiredPackage).toContain('全車速追従機能付');
    expect(mazda.find((vehicle) => vehicle.id === 'jp-mazda-mazda3-fastback-25s-6mt')?.requiredPackage).not.toContain('全車速追従機能付');
    expect(mazda.some((vehicle) => vehicle.id === 'jp-mazda-mx-30-rotary-ev-rotary-ev')).toBe(false);
  });

  it('現行カタログ確認済みTesla 2モデル6販売仕様をLevel 2相当として扱う', () => {
    const tesla = vehicles.filter((vehicle) => vehicle.maker === 'Tesla');
    expect([...new Set(tesla.map((vehicle) => vehicle.model))].sort()).toEqual(['Model 3', 'Model Y']);
    expect(tesla).toHaveLength(6);
    expect(tesla.map((vehicle) => vehicle.grade).sort()).toEqual([
      'L',
      'Performance',
      'Premium RWD',
      'Premium RWD',
      'Premium ロングレンジAWD',
      'Premium ロングレンジAWD',
    ].sort());
    expect(tesla.every((vehicle) => vehicle.automationLevel === 2 && vehicle.category === 'driver_assistance')).toBe(true);
    expect(tesla.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://www.tesla.com/ja_JP/support/incentives' && source.accessedAt === '2026-09-10'))).toBe(true);
    expect(tesla.every((vehicle) => vehicle.price?.kind === 'range' && vehicle.price.amounts[0].amountJpy >= 5_313_000)).toBe(true);
    expect(tesla.every((vehicle) => vehicle.handsOff === 'not_allowed' && vehicle.driverMonitoring === 'required')).toBe(true);
    expect(tesla.every((vehicle) => vehicleReferenceLabel(vehicle) === '現行仕様')).toBe(true);
  });

  it('Toyota ノアとLexus RZは販売単位を分け、ハンズオフ条件の不確実性を保持する', () => {
    const noah = vehicles.find((vehicle) => vehicle.id === 'jp-toyota-noah-2026-hybrid-sz-2wd-7seater-advanced-drive');
    expect(noah?.price?.amounts[0].amountJpy).toBe(4_056_800);
    expect(noah?.price?.optionalPackages[0].amountJpy).toBe(121_000);
    expect(noah?.handsOff).toBe('allowed_in_conditions');
    expect(noah?.capabilities).toContain('hands_off_highway');
    expect(noah?.driverMonitoring).toBe('required');
    expect(noah?.salesUnitIntroducedAt).toBeNull();
    expect(noah?.availability).toBe('unknown');
    expect(noah?.sources.some((source) => source.url.endsWith('noah_spec_202609.pdf'))).toBe(true);

    const rz = vehicles.find((vehicle) => vehicle.id === 'jp-lexus-rz-2026-rz500e-version-l-awd');
    expect(rz?.price?.amounts[0].amountJpy).toBe(8_500_000);
    expect(rz?.handsOff).toBe('unknown');
    expect(rz?.driverMonitoring).toBe('unknown');
    expect(rz?.availability).toBe('unknown');
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
    expect(evitara.every((vehicle) => vehicle.automationLevel === 2 && vehicle.category === 'driver_assistance' && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'not_allowed')).toBe(true);
    expect(evitara.every((vehicle) => vehicle.requiredPackage?.includes('全車標準装備') && vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,driver_monitoring')).toBe(true);
    expect(evitara.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://www.suzuki.co.jp/release/a/2025/0916/index.html' && source.accessedAt === '2026-09-07'))).toBe(true);
    expect(evitara.every((vehicle) => vehicle.sources.some((source) => source.url.includes('evitara_26MC_DSBS2-4.pdf') && source.accessedAt === '2026-09-10'))).toBe(true);
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
    expect(arkana.every((vehicle) => vehicle.automationLevel === 2 && vehicle.category === 'driver_assistance' && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'not_allowed')).toBe(true);
    expect(arkana.every((vehicle) => vehicle.odd.speedKph.min === 0 && vehicle.odd.speedKph.max === 160 && vehicle.odd.speedKph.condition?.includes('ACC単体はおおむね0〜170km/h') === true)).toBe(true);
    expect(arkana.every((vehicle) => vehicle.requiredPackage?.includes('ACC（ストップ＆ゴー機能付）') && vehicle.requiredPackage.includes('レーンセンタリングアシスト') && vehicle.requiredPackage.includes('標準装備'))).toBe(true);
    expect(arkana.every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist')).toBe(true);
    expect(arkana.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://dcms.renault.jp/car_lineup/pricelist.php' && source.accessedAt === '2026-09-07'))).toBe(true);
    expect(arkana.every((vehicle) => vehicle.sources.some((source) => source.url.includes('user-manual.renault.com') && source.accessedAt === '2026-09-10'))).toBe(true);
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
