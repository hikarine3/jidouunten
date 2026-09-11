import { describe, expect, it } from 'vitest';
import { canonicalRoadType, displayCatalogAsOf, displayOptionalPackagePrices, displayVehiclePrice, displayVehicleReferenceTotal, displayVehicleTiming, filterVehicleList, isDefaultListedVehicle, levelCaveat, officialLinkFor, officialLinks, sortVehicleList, validateVehicle, vehicleDecisionFingerprint, vehicleDecisionSignals, vehicleImageFor, vehicleImages, vehicleItemListStructuredData, vehicleMatchesPriceBand, vehiclePriceMin, vehiclePublicUrl, vehicleReferenceLabel, vehicleReferenceTotal, vehicleStructuredData, vehicles, type Vehicle } from '../src/data/loader';

const makeVehicle = (overrides: Partial<Vehicle> = {}): Vehicle => ({
  id: 'test-car', market: 'JP', maker: 'テスト', model: 'モデル', modelYear: '2026', generation: null, catalogAsOf: null, salesUnitIntroducedAt: null, priceEffectiveAt: null, price: null, grade: '標準',
  requiredPackage: null, featureVersion: 'test', automationLevel: 2, category: 'driver_assistance', availability: 'new_order_available',
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
    expect(validateVehicle({ ...makeVehicle(), featureVersion: undefined })).toBe(false);
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
    expect(filterVehicleList(list, { capability: ['lane_centering', 'lane_change_support'] }).map((vehicle) => vehicle.id)).toEqual(['tesla-match']);
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

  it('一覧の時期表示は発売日がなければ現行カタログ確認月へフォールバックする', () => {
    expect(displayVehicleTiming({ salesUnitIntroducedAt: '2026-07-13', catalogAsOf: '2026-09' })).toBe('発売・導入 2026年7月13日');
    expect(displayCatalogAsOf('2026-09')).toBe('2026年9月');
    expect(displayVehicleTiming({ salesUnitIntroducedAt: null, catalogAsOf: '2026-09' })).toBe('2026年9月');
    expect(displayVehicleTiming({ salesUnitIntroducedAt: null, catalogAsOf: null })).toBe('');
  });

  it('構造化データは車両正本と可視一覧のURL・名称・順序を一致させる', () => {
    const dated = vehicleStructuredData(makeVehicle({ id: 'dated-car', maker: 'Maker', model: 'Model', modelYear: '2026', grade: 'Grade' }));
    expect(dated).toMatchObject({ '@type': 'Car', url: vehiclePublicUrl('dated-car'), brand: { '@type': 'Brand', name: 'Maker' }, model: 'Model', modelDate: '2026', vehicleConfiguration: 'Grade' });
    expect(dated).not.toHaveProperty('automationLevel');
    expect(dated).not.toHaveProperty('aggregateRating');
    const undated = vehicleStructuredData(makeVehicle({ id: 'undated-car', modelYear: null }));
    expect(undated).not.toHaveProperty('modelDate');
    const visible = sortVehicleList(vehicles).filter(isDefaultListedVehicle);
    const itemList = vehicleItemListStructuredData(visible);
    expect(itemList.itemListElement).toHaveLength(visible.length);
    expect(itemList.numberOfItems).toBe(visible.length);
    expect(itemList.itemListElement).toEqual(visible.map((vehicle, index) => ({ '@type': 'ListItem', position: index + 1, name: `${vehicle.maker} ${vehicle.model} ${vehicle.grade}`, url: vehiclePublicUrl(vehicle.id) })));
  });

  it('車種識別写真はモデル単位で帰属情報を持ち、未登録車は従来表示を維持する', () => {
    expect(vehicleImages).toHaveLength(3);
    expect(vehicleImageFor({ maker: 'Toyota', model: 'プリウス' })).toMatchObject({ license: 'CC0 1.0', src: '/vehicles/toyota-prius.webp' });
    expect(vehicleImageFor({ maker: 'Tesla', model: 'Model 3' })).toMatchObject({ license: 'CC BY-SA 4.0', src: '/vehicles/tesla-model-3.webp' });
    expect(vehicleImageFor({ maker: 'Honda', model: 'ACCORD' })).toBeUndefined();
    expect(vehicleImages.every((image) => vehicles.some((vehicle) => vehicle.maker === image.maker && vehicle.model === image.model))).toBe(true);
    expect(vehicleImages.every((image) => image.sourceUrl.startsWith('https://commons.wikimedia.org/wiki/File:') && image.licenseUrl.startsWith('https://creativecommons.org/'))).toBe(true);
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

  it('価格帯は確認済み本体価格の開始値で分類し、未確認を含めない', () => {
    const under = makeVehicle({ id: 'under', price: { kind: 'exact', currency: 'JPY', amounts: [{ amountJpy: 2_990_000, qualifier: null, sourceUrl: 'https://example.com' }], maxJpy: 2_990_000, optionalPackages: [], basis: 'msrp', taxIncluded: 'included' } });
    const mid = makeVehicle({ id: 'mid', price: { kind: 'range', currency: 'JPY', amounts: [{ amountJpy: 5_000_000, qualifier: null, sourceUrl: 'https://example.com' }], maxJpy: 5_600_000, optionalPackages: [], basis: 'price_list', taxIncluded: 'included' } });
    const unknown = makeVehicle({ id: 'unknown-price', price: null });
    expect(vehicleMatchesPriceBand(under, 'under_300')).toBe(true);
    expect(vehicleMatchesPriceBand(mid, 'from_500_to_800')).toBe(true);
    expect(vehicleMatchesPriceBand(unknown, 'under_300')).toBe(false);
    expect(filterVehicleList([under, mid, unknown], { budget: 'under_300' }).map((vehicle) => vehicle.id)).toEqual(['under']);
  });

  it('確認済み追加パッケージだけを参考総額へ合算し、レンジや未確認は合算しない', () => {
    const exact = makeVehicle({ price: { kind: 'exact', currency: 'JPY', amounts: [{ amountJpy: 4_056_800, qualifier: 'S-Z', sourceUrl: 'https://example.com' }], maxJpy: 4_056_800, optionalPackages: [{ amountJpy: 122_100, qualifier: 'S-Z', sourceUrl: 'https://example.com', label: 'Advanced Drive' }], basis: 'msrp', taxIncluded: 'included' } });
    const range = makeVehicle({ price: { kind: 'range', currency: 'JPY', amounts: [{ amountJpy: 4_056_800, qualifier: 'S-Z', sourceUrl: 'https://example.com' }], maxJpy: 4_300_000, optionalPackages: [{ amountJpy: 122_100, qualifier: 'S-Z', sourceUrl: 'https://example.com', label: 'Advanced Drive' }], basis: 'msrp', taxIncluded: 'included' } });
    const noPackage = makeVehicle({ price: { kind: 'exact', currency: 'JPY', amounts: [{ amountJpy: 4_056_800, qualifier: 'S-Z', sourceUrl: 'https://example.com' }], maxJpy: 4_056_800, optionalPackages: [], basis: 'msrp', taxIncluded: 'included' } });
    expect(vehicleReferenceTotal(exact)).toBe(4_178_900);
    expect(displayVehicleReferenceTotal(exact)).toBe('4,178,900円');
    expect(vehicleReferenceTotal(range)).toBeNull();
    expect(vehicleReferenceTotal(noPackage)).toBeNull();
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

  it('fingerprintは確認日・出典URLの更新を無視し、判断材料の差分だけを検出する', () => {
    const base = makeVehicle({
      price: { kind: 'exact', currency: 'JPY', amounts: [{ amountJpy: 4_000_000, qualifier: '標準', sourceUrl: 'https://example.com/old' }], maxJpy: 4_000_000, optionalPackages: [], basis: 'msrp', taxIncluded: 'included' },
      sources: [{ url: 'https://example.com/old', publisher: '公式', title: '旧資料', accessedAt: '2026-09-01', supports: ['price'] }],
      lastReviewedAt: '2026-09-01',
    });
    const reviewOnly = { ...base, sources: [{ ...base.sources[0], url: 'https://example.com/new', title: '新資料', accessedAt: '2026-09-10' }], lastReviewedAt: '2026-09-10' };
    const priceChanged = { ...reviewOnly, price: { ...base.price!, amounts: [{ ...base.price!.amounts[0], amountJpy: 4_100_000, sourceUrl: 'https://example.com/new' }], maxJpy: 4_100_000 } };
    expect(vehicleDecisionFingerprint(reviewOnly)).toBe(vehicleDecisionFingerprint(base));
    expect(vehicleDecisionFingerprint(priceChanged)).not.toBe(vehicleDecisionFingerprint(base));
    expect(vehicleDecisionSignals(reviewOnly)).toEqual(vehicleDecisionSignals(base));
    expect(vehicleDecisionSignals(priceChanged).price).not.toBe(vehicleDecisionSignals(base).price);
  });

  it('validates every supplied catalog record before release', () => {
    expect(vehicles).toHaveLength(315);
    expect(vehicles.every((vehicle) => validateVehicle(vehicle))).toBe(true);
  });

  it('現行候補314件は全件の公式金額を保持する', () => {
    const current = vehicles.filter(isDefaultListedVehicle);
    expect(current).toHaveLength(314);
    expect(current.filter((vehicle) => vehicle.price !== null)).toHaveLength(314);
    expect(current.filter((vehicle) => vehicle.price === null)).toHaveLength(0);
    expect(vehicles.find(({ id }) => id === 'jp-honda-accord-2025-ehev-sensing360plus')?.price?.amounts[0].amountJpy).toBe(6_351_400);
    expect(vehicles.find(({ id }) => id === 'jp-nissan-ariya-2026-b6')?.priceEffectiveAt).toBe('2026-02');
    expect(vehicles.find(({ id }) => id === 'jp-nissan-serena-2026-e-power-luxion')?.price?.optionalPackages[0].amountJpy).toBe(49_500);
    expect(displayOptionalPackagePrices(vehicles.find(({ id }) => id === 'jp-mazda-cx-5-g-ex-package')!)).toBe('EX Package +227,700円');
    expect(vehicles.find(({ id }) => id === 'jp-subaru-levorg-layback-2023-limited-ex')?.price?.kind).toBe('range');
  });

  it('Audi A5 / A5 Avantは2026年4月価格表の6販売単位をLevel 2能力付きで保持する', () => {
    const audi = vehicles.filter((vehicle) => vehicle.maker === 'Audi');
    expect(audi).toHaveLength(6);
    expect(audi.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      6_170_000, 6_420_000, 7_000_000, 7_250_000, 7_350_000, 7_600_000,
    ]);
    expect(audi.every((vehicle) => vehicle.currentCatalogListed && vehicle.catalogAsOf === '2026-04' && vehicle.priceEffectiveAt === '2026-04' && vehicle.price?.kind === 'exact' && vehicle.price?.basis === 'msrp' && vehicle.price?.taxIncluded === 'included')).toBe(true);
    expect(audi.filter((vehicle) => vehicle.grade.startsWith('TFSI')).every((vehicle) => vehicle.salesUnitIntroducedAt === '2025-02-17' && vehicle.sources.some((source) => source.url.endsWith('s5n52g0000002avz.html')))).toBe(true);
    expect(audi.filter((vehicle) => vehicle.grade.startsWith('TDI')).every((vehicle) => vehicle.salesUnitIntroducedAt === '2025-06-24' && vehicle.sources.some((source) => source.url.endsWith('s5n52g0000003ck6.html')))).toBe(true);
    expect(audi.every((vehicle) => vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'not_allowed' && vehicle.availability === 'unknown')).toBe(true);
    expect(audi.every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,lane_change_support')).toBe(true);
    expect(audi.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://www.audi-press.jp/press-releases/2026/s5n52g00000061vq.html' && source.supports.some((fact) => fact.includes('メーカー希望小売価格'))))).toBe(true);
    expect(audi.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('A5_S5_Product_Information.pdf')))).toBe(true);
    expect(officialLinkFor(audi.find((vehicle) => vehicle.model === 'A5')!)?.actions?.map(({ kind }) => kind)).toEqual(['estimate', 'dealer', 'test_drive']);
    expect(officialLinkFor(audi.find((vehicle) => vehicle.model === 'A5 Avant')!)?.actions?.map(({ kind }) => kind)).toEqual(['estimate', 'dealer', 'test_drive']);
  });

  it('カローラ スポーツ／ツーリングは公式価格表の9販売単位をLevel 2能力付きで保持する', () => {
    const corollaSport = vehicles.filter((vehicle) => vehicle.model === 'カローラ スポーツ');
    const corollaTouring = vehicles.filter((vehicle) => vehicle.model === 'カローラ ツーリング');
    expect(corollaSport).toHaveLength(3);
    expect(corollaTouring).toHaveLength(6);
    expect(corollaSport.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([2_531_600, 2_831_900, 3_220_200]);
    expect(corollaTouring.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([2_447_500, 2_662_000, 2_812_700, 3_027_200, 3_179_000, 3_393_500]);
    expect([...corollaSport, ...corollaTouring].every((vehicle) => vehicle.currentCatalogListed && vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'not_allowed' && vehicle.availability === 'unknown' && vehicle.salesUnitIntroducedAt === null)).toBe(true);
    expect([...corollaSport, ...corollaTouring].every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering')).toBe(true);
    expect(corollaSport.every((vehicle) => vehicle.catalogAsOf === '2026-07' && vehicle.priceEffectiveAt === '2026-07' && vehicle.sources.some((source) => source.url.endsWith('corollasport_equipment_compare_202607.pdf')))).toBe(true);
    expect(corollaTouring.every((vehicle) => vehicle.catalogAsOf === '2026-05' && vehicle.priceEffectiveAt === '2026-05' && vehicle.sources.some((source) => source.url.endsWith('corollatouring_main.pdf')))).toBe(true);
    expect(officialLinkFor(corollaSport[0])?.actions?.map(({ kind }) => kind)).toEqual(['estimate']);
    expect(officialLinkFor(corollaTouring[0])?.actions?.map(({ kind }) => kind)).toEqual(['estimate']);
  });

  it('Mercedes-Benz GLC／C-Class SedanはMP202602価格表・装備表に基づく11販売単位を保持する', () => {
    const mercedes = vehicles.filter((vehicle) => vehicle.maker === 'Mercedes-Benz');
    expect(mercedes).toHaveLength(11);
    expect(mercedes.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      7_440_000, 7_640_000, 8_290_000, 9_150_000, 9_200_000, 9_310_000, 10_360_000, 10_450_000, 12_320_000, 13_090_000, 18_440_000,
    ]);
    expect(mercedes.every((vehicle) => vehicle.currentCatalogListed && vehicle.catalogAsOf === '2026-09' && vehicle.priceEffectiveAt === null && vehicle.price?.basis === 'price_list' && vehicle.price?.taxIncluded === 'included' && vehicle.salesUnitIntroducedAt === null)).toBe(true);
    expect(mercedes.every((vehicle) => vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'not_allowed' && vehicle.availability === 'unknown')).toBe(true);
    expect(mercedes.every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering')).toBe(true);
    expect(mercedes.every((vehicle) => vehicle.sources.some((source) => source.url.includes('DI_MP202602') && source.supports.some((fact) => fact.includes('販売単位・標準装備'))))).toBe(true);
    expect(officialLinkFor(mercedes.find((vehicle) => vehicle.model === 'GLC')!)?.url).toBe('https://www.mercedes-benz.co.jp/passengercars/models/suv/glc/overview.html');
    expect(officialLinkFor(mercedes.find((vehicle) => vehicle.model === 'C-Class Sedan')!)?.url).toBe('https://www.mercedes-benz.co.jp/passengercars/models/saloon/c-class/overview.html');
  });

  it('SUBARUフォレスターは現行7グレードをEyeSight X有無の差付きで保持する', () => {
    const forester = vehicles.filter((vehicle) => vehicle.model === 'フォレスター');
    expect(forester).toHaveLength(7);
    expect(forester.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([3_850_000, 3_993_000, 4_191_000, 4_301_000, 4_378_000, 4_521_000, 4_642_000]);
    expect(forester.every((vehicle) => vehicle.currentCatalogListed && vehicle.catalogAsOf === '2026-09' && vehicle.priceEffectiveAt === null && vehicle.salesUnitIntroducedAt === null && vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.availability === 'unknown')).toBe(true);
    expect(forester.filter((vehicle) => vehicle.requiredPackage?.includes('アイサイトX'))).toHaveLength(5);
    expect(forester.filter((vehicle) => vehicle.handsOff === 'allowed_in_conditions')).toHaveLength(5);
    expect(forester.filter((vehicle) => vehicle.handsOff === 'not_allowed')).toHaveLength(2);
    expect(forester.filter((vehicle) => vehicle.capabilities.includes('lane_change_support'))).toHaveLength(5);
    expect(forester.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://www.subaru.jp/forester/grade/' && source.supports.some((fact) => fact.includes('円'))))).toBe(true);
    expect(forester.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('/equipment.pdf')))).toBe(true);
    expect(officialLinkFor(forester[0])?.actions?.map(({ kind }) => kind)).toEqual(['estimate', 'dealer', 'test_drive']);
  });

  it('Honda ステップ ワゴンは現行10販売単位を価格・渋滞支援付きで保持する', () => {
    const stepwgn = vehicles.filter((vehicle) => vehicle.model === 'ステップ ワゴン');
    expect(stepwgn).toHaveLength(10);
    expect(stepwgn.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      3_348_400, 3_543_100, 3_603_600, 3_763_100, 3_823_600, 3_873_100, 3_938_000, 3_998_500, 4_063_400, 4_268_000,
    ]);
    expect(stepwgn.every((vehicle) => vehicle.currentCatalogListed && vehicle.catalogAsOf === '2026-09' && vehicle.priceEffectiveAt === null && vehicle.salesUnitIntroducedAt === null && vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'not_allowed' && vehicle.availability === 'unknown')).toBe(true);
    expect(stepwgn.every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist')).toBe(true);
    expect(stepwgn.every((vehicle) => vehicle.sources.some((source) => source.url.includes('STEPWGN') && source.supports.some((fact) => fact.includes('円'))))).toBe(true);
    expect(stepwgn.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('/performance/')))).toBe(true);
    expect(officialLinkFor(stepwgn[0])?.actions?.map(({ kind }) => kind)).toEqual(['dealer', 'test_drive', 'estimate', 'catalog']);
  });

  it('全販売単位に用途を分けたメーカー公式導線を持つ', () => {
    expect(officialLinks).toHaveLength(63);
    expect(vehicles.every((vehicle) => Boolean(officialLinkFor(vehicle)))).toBe(true);
    expect(vehicles.filter(isDefaultListedVehicle).every((vehicle) => officialLinkFor(vehicle)?.kind === 'product')).toBe(true);
    expect(officialLinkFor(vehicles.find(({ id }) => id === 'jp-honda-legend-2021-honda-sensing-elite')!)?.kind).toBe('archive');
    expect(new Set(officialLinks.map(({ maker, model }) => `${maker}\u0000${model}`)).size).toBe(officialLinks.length);
    const teslaActions = officialLinks.filter(({ maker }) => maker === 'Tesla').flatMap((link) => link.actions ?? []);
    expect(teslaActions.map(({ kind }) => kind).sort()).toEqual(['order', 'order', 'test_drive', 'test_drive']);
    expect(teslaActions.every(({ url, checkedAt }) => url.startsWith('https://www.tesla.com/') && checkedAt === '2026-09-10')).toBe(true);
    const toyotaEstimateLinks = officialLinks.filter(({ maker }) => maker === 'Toyota').flatMap((link) => (link.actions ?? []).filter(({ kind }) => kind === 'estimate'));
    expect(toyotaEstimateLinks).toHaveLength(18);
    expect(toyotaEstimateLinks.every(({ label, url }) => label === '公式で見積り' && url.startsWith('https://toyota.jp/service/estimate/grades?car_name_en='))).toBe(true);
    expect(toyotaEstimateLinks.filter(({ url }) => !url.includes('COROLLA%20CROSS') && !url.includes('AQUA') && !url.includes('COROLLA') && !url.includes('YARIS+CROSS') && !url.includes('YARIS') && !url.includes('CROWN+SPORT')).every(({ checkedAt }) => checkedAt === '2026-09-10')).toBe(true);
    expect(toyotaEstimateLinks.find(({ url }) => url.includes('COROLLA%20CROSS'))?.checkedAt).toBe('2026-09-11');
    expect(toyotaEstimateLinks.find(({ url }) => url.includes('AQUA'))?.checkedAt).toBe('2026-09-11');
    expect(toyotaEstimateLinks.find(({ url }) => url.includes('YARIS+CROSS'))?.checkedAt).toBe('2026-09-11');
    expect(toyotaEstimateLinks.find(({ url }) => url.includes('YARIS') && !url.includes('YARIS+CROSS'))?.checkedAt).toBe('2026-09-11');
    expect(toyotaEstimateLinks.find(({ url }) => url.includes('COROLLA') && !url.includes('COROLLA%20CROSS'))?.checkedAt).toBe('2026-09-11');
    expect(toyotaEstimateLinks.find(({ url }) => url.includes('CROWN+SPORT'))?.checkedAt).toBe('2026-09-12');
    expect(toyotaEstimateLinks.map(({ url }) => new URL(url).searchParams.get('car_name_en')).sort()).toEqual(['ALPHARD', 'AQUA', 'COROLLA', 'COROLLA CROSS', 'COROLLA SPORT', 'COROLLA TOURING', 'CROWN CROSSOVER', 'CROWN SPORT', 'HARRIER', 'NOAH', 'PRIUS', 'RAV4', 'SIENTA', 'VELLFIRE', 'VOXY', 'YARIS', 'YARIS CROSS', 'bZ4X'].sort());
    const expandedActionModels = new Map([
      ['Honda\u0000ACCORD', ['dealer', 'test_drive', 'estimate', 'catalog']],
      ['Honda\u0000VEZEL', ['dealer', 'test_drive', 'estimate', 'catalog']],
      ['Honda\u0000ZR-V', ['dealer', 'test_drive', 'estimate', 'catalog']],
      ['Nissan\u0000日産アリア', ['dealer', 'test_drive', 'estimate', 'catalog']],
      ['Nissan\u0000セレナ', ['dealer', 'test_drive', 'estimate', 'catalog']],
      ['Nissan\u0000エクストレイル', ['dealer', 'test_drive', 'estimate', 'catalog']],
      ['Lexus\u0000LM', ['dealer', 'test_drive', 'estimate', 'catalog']],
      ['Lexus\u0000UX300h', ['dealer', 'test_drive', 'estimate', 'catalog']],
    ]);
    for (const [modelKey, kinds] of expandedActionModels) {
      const actions = officialLinks.find((link) => `${link.maker}\u0000${link.model}` === modelKey)?.actions ?? [];
      expect(actions.map(({ kind }) => kind)).toEqual(kinds);
      expect(actions.every(({ checkedAt }) => checkedAt === '2026-09-11')).toBe(true);
      expect(actions.every(({ url }) => url.startsWith('https://'))).toBe(true);
    }
    const stepwgnActions = officialLinkFor(vehicles.find(({ model }) => model === 'ステップ ワゴン')!)?.actions ?? [];
    expect(stepwgnActions.map(({ kind }) => kind)).toEqual(['dealer', 'test_drive', 'estimate', 'catalog']);
    expect(stepwgnActions.every(({ checkedAt, url }) => checkedAt === '2026-09-12' && url.startsWith('https://'))).toBe(true);
    const bydActions = officialLinks.filter(({ maker }) => maker === 'BYD').flatMap((link) => link.actions ?? []);
    expect(bydActions).toHaveLength(12);
    expect(bydActions.every(({ checkedAt, url }) => checkedAt === '2026-09-11' && url.startsWith('https://'))).toBe(true);
    const mitsubishiActions = officialLinks.find(({ maker, model }) => maker === 'Mitsubishi' && model === 'アウトランダーPHEV')?.actions ?? [];
    expect(mitsubishiActions.map(({ kind }) => kind)).toEqual(['order', 'test_drive', 'estimate', 'dealer', 'catalog']);
    expect(mitsubishiActions.every(({ checkedAt, url }) => checkedAt === '2026-09-11' && url.startsWith('https://'))).toBe(true);
    const crownSportActions = officialLinkFor(vehicles.find(({ model }) => model === 'クラウン スポーツ')!)?.actions ?? [];
    expect(crownSportActions.map(({ kind }) => kind)).toEqual(['dealer', 'test_drive', 'estimate', 'catalog']);
    expect(crownSportActions.every(({ checkedAt }) => checkedAt === '2026-09-12')).toBe(true);
    expect(officialLinks.flatMap(({ actions = [] }) => actions)).toHaveLength(95);
  });

  it('日産エクストレイルは現行14販売単位をProPILOT標準・価格付きで保持する', () => {
    const xtrail = vehicles.filter((vehicle) => vehicle.model === 'エクストレイル');
    expect(xtrail).toHaveLength(14);
    expect(xtrail.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      4_092_000, 4_389_000, 4_521_000, 4_653_000, 4_757_500, 4_889_500, 4_950_000, 5_365_800, 5_480_200, 5_559_400, 5_662_800, 5_754_100, 5_904_800, 5_962_000,
    ]);
    expect(xtrail.every((vehicle) => vehicle.currentCatalogListed && vehicle.catalogAsOf === '2026-09' && vehicle.priceEffectiveAt === '2026-09' && vehicle.salesUnitIntroducedAt === null && vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'not_allowed' && vehicle.availability === 'unknown')).toBe(true);
    expect(xtrail.every((vehicle) => vehicle.requiredPackage === 'プロパイロット（ナビリンク機能付）標準装備' && vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering')).toBe(true);
    expect(xtrail.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://www3.nissan.co.jp/vehicles/new/x-trail/specifications.html' && source.supports.some((fact) => fact.includes('14販売単位'))))).toBe(true);
    expect(xtrail.filter((vehicle) => vehicle.grade.includes('NISMO')).every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('x-trail_2608_nismo_specsheet.pdf')))).toBe(true);
    expect(xtrail.filter((vehicle) => vehicle.grade.includes('AUTECH')).every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('x-trail_2608_autech_autech_sports_specsheet.pdf')))).toBe(true);
    expect(officialLinkFor(xtrail[0])?.actions?.map(({ kind }) => kind)).toEqual(['dealer', 'test_drive', 'estimate', 'catalog']);
  });

  it('トヨタ ヤリス クロスは2026年8月の20販売単位を価格・Level 2能力付きで保持する', () => {
    const yarisCross = vehicles.filter((vehicle) => vehicle.model === 'ヤリス クロス');
    expect(yarisCross).toHaveLength(20);
    expect(yarisCross.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      2_126_300, 2_341_900, 2_373_800, 2_510_200, 2_549_800, 2_589_400, 2_621_300, 2_712_600, 2_736_800, 2_757_700,
      2_789_600, 2_797_300, 2_868_800, 2_960_100, 2_984_300, 2_992_000, 3_107_500, 3_169_100, 3_239_500, 3_355_000,
    ]);
    expect(yarisCross.every((vehicle) => vehicle.currentCatalogListed && vehicle.modelYear === null && vehicle.catalogAsOf === '2026-08' && vehicle.salesUnitIntroducedAt === null && vehicle.priceEffectiveAt === '2026-08')).toBe(true);
    expect(yarisCross.every((vehicle) => vehicle.automationLevel === 2 && vehicle.handsOff === 'not_allowed' && vehicle.driverMonitoring === 'required' && vehicle.availability === 'unknown')).toBe(true);
    expect(yarisCross.every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist')).toBe(true);
    expect(yarisCross.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://toyota.jp/pages/contents/include/carpage_format/carlineup/data/json/grades59.json' && source.supports.some((fact) => fact.includes('円'))))).toBe(true);
    expect(yarisCross.every((vehicle) => vehicle.sources.some((source) => source.url.includes('yariscross_spec_202608.pdf')))).toBe(true);
    expect(officialLinkFor(yarisCross[0])?.actions?.map(({ kind }) => kind)).toEqual(['estimate']);
  });

  it('トヨタ ヤリスは2026年4月の価格比較可能な17販売単位を能力差付きで保持する', () => {
    const yaris = vehicles.filter((vehicle) => vehicle.model === 'ヤリス');
    expect(yaris).toHaveLength(17);
    expect(yaris.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      1_697_300, 1_771_000, 1_848_000, 1_921_700, 1_996_500, 2_061_400, 2_072_400, 2_197_800, 2_249_500,
      2_286_900, 2_301_200, 2_445_300, 2_473_900, 2_515_700, 2_669_700, 2_669_700, 2_884_200,
    ]);
    expect(yaris.every((vehicle) => vehicle.currentCatalogListed && vehicle.modelYear === null && vehicle.catalogAsOf === '2026-04' && vehicle.salesUnitIntroducedAt === null && vehicle.priceEffectiveAt === null && vehicle.availability === 'unknown' && vehicle.handsOff === 'not_allowed')).toBe(true);
    expect(yaris.filter((vehicle) => vehicle.automationLevel === 2)).toHaveLength(15);
    expect(yaris.filter((vehicle) => vehicle.automationLevel === 1)).toHaveLength(2);
    expect(yaris.filter((vehicle) => vehicle.capabilities.includes('traffic_jam_assist'))).toHaveLength(6);
    expect(yaris.filter((vehicle) => vehicle.automationLevel === 1).every((vehicle) => vehicle.capabilities.includes('adaptive_cruise_control') && !vehicle.capabilities.includes('lane_centering'))).toBe(true);
    expect(yaris.every((vehicle) => !vehicle.capabilities.includes('lane_change_support'))).toBe(true);
    expect(yaris.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('grades53.json') && source.supports.some((fact) => fact.includes('円'))))).toBe(true);
    expect(yaris.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('yaris_spec_202604.pdf')))).toBe(true);
    expect(officialLinkFor(yaris[0])?.actions?.map(({ kind }) => kind)).toEqual(['estimate']);
  });

  it('VW Tiguan・Lexus GX550・Toyota ランドクルーザー250の9販売単位を保持する', () => {
    const tranche = vehicles.filter((vehicle) => ['Volkswagen', 'Lexus', 'Toyota'].includes(vehicle.maker) && ['Tiguan', 'GX550', 'ランドクルーザー250'].includes(vehicle.model));
    expect(tranche).toHaveLength(9);
    expect(tranche.filter((vehicle) => vehicle.model === 'Tiguan')).toHaveLength(6);
    expect(tranche.filter((vehicle) => vehicle.model === 'GX550')).toHaveLength(2);
    expect(tranche.filter((vehicle) => vehicle.model === 'ランドクルーザー250')).toHaveLength(1);
    expect(tranche.every((vehicle) => vehicle.automationLevel === 2 && vehicle.handsOff === 'not_allowed' && vehicle.capabilities.includes('adaptive_cruise_control') && vehicle.capabilities.includes('lane_centering'))).toBe(true);
    expect(tranche.every((vehicle) => vehicle.currentCatalogListed && vehicle.availability === 'unknown' && vehicle.price?.kind === 'exact')).toBe(true);
    expect(tranche.every((vehicle) => vehicle.sources.some((source) => source.supports.some((support) => support.includes('円'))))).toBe(true);
    expect(tranche.every((vehicle) => Boolean(officialLinkFor(vehicle)))).toBe(true);
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
    expect(tesla.every((vehicle) => vehicle.availability === 'new_order_available' && vehicle.availabilityCheckedAt === '2026-09-10')).toBe(true);
    expect(tesla.every((vehicle) => vehicleReferenceLabel(vehicle) === '現行仕様')).toBe(true);
  });

  it('日産アリアはB6だけ注文受付を一次情報で確認し、他グレードを未確認のまま分ける', () => {
    const ariya = vehicles.filter((vehicle) => vehicle.maker === 'Nissan' && vehicle.model === '日産アリア');
    expect(ariya).toHaveLength(4);
    expect(ariya.find((vehicle) => vehicle.grade === 'B6')?.availability).toBe('new_order_available');
    expect(ariya.find((vehicle) => vehicle.grade === 'B6')?.availabilityCheckedAt).toBe('2026-09-11');
    expect(ariya.find((vehicle) => vehicle.grade === 'B6')?.sources.some((source) => source.url === 'https://www3.nissan.co.jp/vehicles/new/ariya.html' && source.accessedAt === '2026-09-11' && source.supports.some((fact) => fact.includes('日産各店で注文できるB6')))).toBe(true);
    expect(ariya.filter((vehicle) => vehicle.grade !== 'B6').every((vehicle) => vehicle.availability === 'unknown')).toBe(true);
    expect(ariya.find((vehicle) => vehicle.grade === 'B6')?.limitations.at(-1)).toContain('在庫・納期・契約条件');
  });

  it('SUBARU レイバックは注文済み新車の工場出荷目処を確認しつつ注文可否を未確認とする', () => {
    const layback = vehicles.find((vehicle) => vehicle.id === 'jp-subaru-levorg-layback-2023-limited-ex');
    expect(layback?.availability).toBe('unknown');
    expect(layback?.availabilityCheckedAt).toBe('2026-09-11');
    expect(layback?.sources.some((source) => source.url === 'https://www.subaru.jp/news/delivery/' && source.supports.some((fact) => fact.includes('ご注文いただきました新車')))).toBe(true);
    expect(layback?.limitations.at(-1)).toContain('現在の受注可否・納期');
  });

  it('Hyundai IONIQ 5はHDA/HDA2のグレード差を販売単位へ保持する', () => {
    const ioniq5 = vehicles.filter((vehicle) => vehicle.maker === 'Hyundai' && vehicle.model === 'IONIQ 5');
    expect(ioniq5).toHaveLength(4);
    expect(ioniq5.map((vehicle) => vehicle.grade).sort()).toEqual(['Lounge', 'Lounge AWD', 'Voyage', 'Voyage L'].sort());
    expect(ioniq5.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([4_994_000, 5_236_000, 5_742_000, 6_138_000]);
    expect(ioniq5.every((vehicle) => vehicle.modelYear === '2025' && vehicle.catalogAsOf === '2026-06' && vehicle.handsOff === 'not_allowed' && vehicle.driverMonitoring === 'required')).toBe(true);
    expect(ioniq5.filter((vehicle) => ['Voyage', 'Lounge'].includes(vehicle.grade)).every((vehicle) => vehicle.availability === 'new_order_available' && vehicle.availabilityCheckedAt === '2026-09-11' && vehicle.sources.some((source) => source.url === 'https://www.hyundai.com/jp/stock/new' && source.supports.some((fact) => fact.includes('車両注文'))))).toBe(true);
    expect(ioniq5.filter((vehicle) => ['Voyage L', 'Lounge AWD'].includes(vehicle.grade)).every((vehicle) => vehicle.availability === 'unknown')).toBe(true);
    expect(ioniq5.find((vehicle) => vehicle.grade === 'Voyage L')?.capabilities).not.toContain('lane_change_support');
    expect(ioniq5.filter((vehicle) => vehicle.grade !== 'Voyage L').every((vehicle) => vehicle.capabilities.includes('lane_change_support'))).toBe(true);
    expect(ioniq5.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://www.hyundai.com/jp/purchase/downFile/ioniq5' && source.accessedAt === '2026-09-11'))).toBe(true);
    expect(ioniq5.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://www.hyundai.com/jp/customer-service/notice/679' && source.supports.some((fact) => fact.includes('2025年モデル'))))).toBe(true);
    expect(officialLinkFor(ioniq5[0])?.actions?.map(({ kind }) => kind)).toEqual(['test_drive', 'estimate', 'catalog']);
  });

  it('BYDの4車種7販売単位は価格とLevel 2内の能力差を保持する', () => {
    const byd = vehicles.filter((vehicle) => vehicle.maker === 'BYD');
    expect(byd).toHaveLength(7);
    expect(byd.every((vehicle) => vehicle.automationLevel === 2 && vehicle.currentCatalogListed && vehicle.availability === 'unknown' && vehicle.handsOff === 'not_allowed')).toBe(true);
    expect(byd.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([2_992_000, 3_740_000, 3_982_000, 4_180_000, 4_488_000, 4_950_000, 5_720_000]);
    const dolphin = byd.filter((vehicle) => vehicle.model === 'DOLPHIN');
    expect(dolphin).toHaveLength(2);
    expect(dolphin.every((vehicle) => vehicle.capabilities.includes('lane_change_support') && vehicle.odd.speedKph.max === 120 && vehicle.driverMonitoring === 'unknown')).toBe(true);
    expect(dolphin.every((vehicle) => vehicle.salesUnitIntroducedAt === '2026-02-10')).toBe(true);
    expect(dolphin.every((vehicle) => vehicle.catalogAsOf === '2026-02' && vehicle.featureVersion.includes('2026年2月装備更新'))).toBe(true);
    const atto3 = byd.find((vehicle) => vehicle.model === 'ATTO 3');
    expect(atto3?.factStatus).toBe('conflicting');
    expect(atto3?.capabilities).toContain('lane_change_support');
    const seal = byd.filter((vehicle) => vehicle.model === 'SEAL');
    expect(seal).toHaveLength(2);
    expect(seal.every((vehicle) => vehicle.salesUnitIntroducedAt === '2025-10-30' && vehicle.priceEffectiveAt === '2025-10-30')).toBe(true);
    expect(seal.every((vehicle) => vehicle.capabilities.includes('driver_monitoring') && !vehicle.capabilities.includes('lane_change_support') && vehicle.driverMonitoring === 'required')).toBe(true);
    const sealion6 = byd.filter((vehicle) => vehicle.model === 'SEALION 6');
    expect(sealion6).toHaveLength(2);
    expect(sealion6.every((vehicle) => vehicle.capabilities.includes('adaptive_cruise_control') && vehicle.capabilities.includes('lane_centering') && !vehicle.capabilities.includes('lane_change_support') && vehicle.odd.speedKph.max === 150)).toBe(true);
    expect(byd.every((vehicle) => vehicle.sources.some((source) => source.publisher === 'BYD Auto Japan' && source.accessedAt === '2026-09-11'))).toBe(true);
    expect(officialLinks.filter(({ maker }) => maker === 'BYD')).toHaveLength(4);
  });

  it('Mitsubishi OUTLANDER PHEVは5グレード・定員別の9販売単位を価格付きで保持する', () => {
    const outlander = vehicles.filter((vehicle) => vehicle.maker === 'Mitsubishi' && vehicle.model === 'アウトランダーPHEV');
    expect(outlander).toHaveLength(9);
    expect(outlander.every((vehicle) => vehicle.market === 'JP' && vehicle.currentCatalogListed && vehicle.automationLevel === 2 && vehicle.availability === 'new_order_available')).toBe(true);
    expect(outlander.every((vehicle) => vehicle.salesUnitIntroducedAt === '2026-06-25' && vehicle.priceEffectiveAt === '2026-06-25' && vehicle.catalogAsOf === '2026-06')).toBe(true);
    expect(outlander.every((vehicle) => vehicle.handsOff === 'not_allowed' && vehicle.driverMonitoring === 'unknown' && vehicle.capabilities.includes('adaptive_cruise_control') && vehicle.capabilities.includes('lane_centering') && !vehicle.capabilities.includes('lane_change_support'))).toBe(true);
    expect(outlander.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([5_369_100, 5_985_100, 6_076_400, 6_419_600, 6_510_900, 6_700_100, 6_791_400, 6_810_100, 6_901_400]);
    expect(outlander.every((vehicle) => vehicle.grade.includes('4WD'))).toBe(true);
    expect(outlander.filter((vehicle) => vehicle.grade.includes('7人')).length).toBe(4);
    expect(outlander.filter((vehicle) => vehicle.grade.includes('5人')).length).toBe(5);
    expect(outlander.every((vehicle) => vehicle.sources.some((source) => source.publisher === '三菱自動車' && source.accessedAt === '2026-09-11'))).toBe(true);
    expect(officialLinkFor(outlander[0])?.actions?.map(({ kind }) => kind)).toEqual(['order', 'test_drive', 'estimate', 'dealer', 'catalog']);
    expect(officialLinkFor(outlander[0])?.actions?.find(({ kind }) => kind === 'order')?.url).toBe('https://try.mitsubishi-motors.co.jp/olm/EGP0002.do?model=274&skp=1');
  });

  it('Toyota アルファードは乗車定員・駆動方式別の4販売単位を価格付きで保持する', () => {
    const alphard = vehicles.filter((vehicle) => vehicle.model === 'アルファード');
    expect(alphard).toHaveLength(4);
    expect(alphard.map((vehicle) => vehicle.grade).sort()).toEqual([
      'G HEV 2WD（8人乗り）', 'G HEV E-Four（8人乗り）', 'Z HEV 2WD（7人乗り）', 'Z HEV E-Four（7人乗り）',
    ].sort());
    expect(alphard.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => a! - b!)).toEqual([5_599_000, 5_819_000, 6_399_800, 6_619_800]);
    expect(alphard.every((vehicle) => vehicle.automationLevel === 2 && vehicle.handsOff === 'not_allowed' && vehicle.capabilities.includes('lane_centering'))).toBe(true);
    expect(alphard.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('alphard_spec_202606.pdf')))).toBe(true);
  });

  it('Toyota ヴェルファイアは電動化・駆動方式・定員別の7販売単位を条件付きハンズオフ付きで保持する', () => {
    const vellfire = vehicles.filter((vehicle) => vehicle.model === 'ヴェルファイア');
    expect(vellfire).toHaveLength(7);
    expect(vellfire.map((vehicle) => vehicle.grade).sort()).toEqual([
      'Executive Lounge（プラグインハイブリッド車・E-Four）',
      'Executive Lounge（ハイブリッド車・2WD）',
      'Executive Lounge（ハイブリッド車・E-Four）',
      'Z Premier（ハイブリッド車・2WD）',
      'Z Premier（ハイブリッド車・E-Four）',
      'Z Premier（ターボガソリン車・2WD）',
      'Z Premier（ターボガソリン車・4WD）',
    ].sort());
    expect(vellfire.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      6_749_600, 6_947_600, 7_099_400, 7_319_400, 8_849_500, 9_069_500, 10_899_900,
    ]);
    expect(vellfire.every((vehicle) => vehicle.automationLevel === 2 && vehicle.handsOff === 'allowed_in_conditions' && vehicle.driverMonitoring === 'required')).toBe(true);
    expect(vellfire.every((vehicle) => vehicle.odd.speedKph.max === 40 && vehicle.capabilities.includes('lane_change_support'))).toBe(true);
    expect(vellfire.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('vellfire_spec_202606.pdf')))).toBe(true);
  });

  it('Toyota ヴォクシーは駆動方式・定員・パッケージ別の6販売単位を価格付きで保持する', () => {
    const voxy = vehicles.filter((vehicle) => vehicle.model === 'ヴォクシー');
    expect(voxy).toHaveLength(6);
    expect(voxy.map((vehicle) => vehicle.grade).sort()).toEqual([
      'S-Z 2WD（7人乗り）',
      'S-Z E-Four（7人乗り）',
      'S-G 2WD（7人乗り）',
      'S-G E-Four（7人乗り）',
      'S-G 2WD（8人乗り）',
      'S-G マルチユーティリティ（2WD・5人乗り）',
    ].sort());
    expect(voxy.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      3_751_000, 3_751_000, 4_004_000, 4_120_600, 4_127_200, 4_380_200,
    ]);
    expect(voxy.every((vehicle) => vehicle.currentCatalogListed && vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'allowed_in_conditions')).toBe(true);
    expect(voxy.every((vehicle) => vehicle.odd.speedKph.max === 130 && vehicle.capabilities.includes('lane_change_support'))).toBe(true);
    expect(voxy.find((vehicle) => vehicle.grade.startsWith('S-Z'))?.price?.optionalPackages[0].amountJpy).toBe(122_100);
    expect(voxy.filter((vehicle) => vehicle.grade.startsWith('S-G')).every((vehicle) => vehicle.price?.optionalPackages[0].amountJpy === 78_100)).toBe(true);
    expect(voxy.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('voxy_spec_202609.pdf')))).toBe(true);
    const multiUtility = voxy.find((vehicle) => vehicle.grade.includes('マルチユーティリティ'))!;
    expect(multiUtility.sources.some((source) => source.url.includes('/ucar/catalog/brand-TOYOTA/car-VOXY/'))).toBe(true);
    expect(multiUtility.sources.some((source) => source.url.endsWith('/noah_voxy_special1.pdf') && source.supports.some((support) => support.includes('78,100円')))).toBe(true);
  });

  it('Toyota シエンタは動力・駆動方式・定員を網羅した18販売単位として価格と手保持条件を固定する', () => {
    const sienta = vehicles.filter((vehicle) => vehicle.model === 'シエンタ');
    expect(sienta).toHaveLength(18);
    expect(sienta.map((vehicle) => vehicle.grade).sort()).toEqual([
      'Z（ハイブリッド車・2WD・7人乗り）', 'Z（ハイブリッド車・E-Four・7人乗り）',
      'Z（ハイブリッド車・2WD・5人乗り）', 'Z（ハイブリッド車・E-Four・5人乗り）',
      'Z（ガソリン車・2WD・7人乗り）', 'Z（ガソリン車・2WD・5人乗り）',
      'G（ハイブリッド車・2WD・7人乗り）', 'G（ハイブリッド車・E-Four・7人乗り）',
      'G（ハイブリッド車・2WD・5人乗り）', 'G（ハイブリッド車・E-Four・5人乗り）',
      'G（ガソリン車・2WD・7人乗り）', 'G（ガソリン車・2WD・5人乗り）',
      'X（ハイブリッド車・2WD・7人乗り）', 'X（ハイブリッド車・E-Four・7人乗り）',
      'X（ハイブリッド車・2WD・5人乗り）', 'X（ハイブリッド車・E-Four・5人乗り）',
      'X（ガソリン車・2WD・7人乗り）', 'X（ガソリン車・2WD・5人乗り）',
    ].sort());
    expect(sienta.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      2_146_100, 2_185_700, 2_487_100, 2_504_700, 2_526_700, 2_544_300,
      2_719_200, 2_758_800, 2_763_200, 2_802_800, 2_833_600, 2_874_300,
      3_048_100, 3_088_800, 3_142_700, 3_183_400, 3_357_200, 3_397_900,
    ]);
    expect(sienta.every((vehicle) => vehicle.currentCatalogListed && vehicle.modelYear === null && vehicle.catalogAsOf === '2026-08' && vehicle.priceEffectiveAt === '2026-08')).toBe(true);
    expect(sienta.every((vehicle) => vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'not_allowed')).toBe(true);
    expect(sienta.every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist')).toBe(true);
    expect(sienta.every((vehicle) => vehicle.odd.speedKph.min === 0 && vehicle.odd.speedKph.max === null)).toBe(true);
    expect(sienta.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://toyota.jp/sienta/grade/'))).toBe(true);
    expect(sienta.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://toyota.jp/sienta/safety/'))).toBe(true);
    expect(sienta.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('sienta_spec_202608.pdf')))).toBe(true);
    expect(sienta.every((vehicle) => !vehicle.capabilities.includes('hands_off_highway') && !vehicle.capabilities.includes('lane_change_support') && !vehicle.capabilities.includes('driver_monitoring'))).toBe(true);
  });

  it('Toyota カローラ クロスは7グレードを価格・駆動方式・車線変更補助つきで保持する', () => {
    const corollaCross = vehicles.filter((vehicle) => vehicle.model === 'カローラ クロス');
    expect(corollaCross).toHaveLength(7);
    expect(corollaCross.map((vehicle) => vehicle.grade).sort()).toEqual([
      'Z（2WD）', 'Z（E-Four）', 'S（2WD）', 'S（E-Four）', 'GR SPORT', 'Z“Adventure”（2WD）', 'Z“Adventure”（E-Four）',
    ].sort());
    expect(corollaCross.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([2_981_000, 3_239_500, 3_613_500, 3_663_000, 3_872_000, 3_921_500, 4_077_700]);
    expect(corollaCross.every((vehicle) => vehicle.currentCatalogListed && vehicle.modelYear === null && vehicle.catalogAsOf === '2026-07' && vehicle.priceEffectiveAt === '2026-07')).toBe(true);
    expect(corollaCross.every((vehicle) => vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'not_allowed' && vehicle.availability === 'unknown')).toBe(true);
    expect(corollaCross.every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist,lane_change_support')).toBe(true);
    expect(corollaCross.every((vehicle) => vehicle.odd.speedKph.min === null && vehicle.odd.speedKph.max === null && vehicle.odd.driverConditions.includes('ステアリングを常に保持'))).toBe(true);
    expect(corollaCross.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('grades61.json')))).toBe(true);
    expect(corollaCross.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://toyota.jp/corollacross/safety/'))).toBe(true);
    expect(corollaCross.every((vehicle) => vehicle.sources.some((source) => source.url.includes('/corollacross/2607/hev/')))).toBe(true);
  });

  it('Lexus LMは4人/6人仕様をAdvanced Drive付きの条件付きハンズオフとして保持する', () => {
    const lm = vehicles.filter((vehicle) => vehicle.model === 'LM');
    expect(lm).toHaveLength(2);
    expect(lm.map((vehicle) => vehicle.grade).sort()).toEqual(['LM500h EXECUTIVE（4人乗り）', 'LM500h version L（6人乗り）'].sort());
    expect(lm.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([15_200_000, 20_300_000]);
    expect(lm.every((vehicle) => vehicle.currentCatalogListed && vehicle.modelYear === null && vehicle.catalogAsOf === '2026-03' && vehicle.priceEffectiveAt === null)).toBe(true);
    expect(lm.every((vehicle) => vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'allowed_in_conditions')).toBe(true);
    expect(lm.every((vehicle) => vehicle.odd.speedKph.min === 0 && vehicle.odd.speedKph.max === 40)).toBe(true);
    expect(lm.every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist,hands_off_highway,driver_monitoring,lane_change_support')).toBe(true);
    expect(lm.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://lexus.jp/models/lm/features/price_package/'))).toBe(true);
    expect(lm.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://lexus.jp/models/lm/features/safety/'))).toBe(true);
    expect(lm.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('/lm/pdf/equipmentlist.pdf')))).toBe(true);
    expect(lm.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('/lm/pdf/specificationslist.pdf')))).toBe(true);
    expect(lm.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('vhch04se050415.php') && source.supports.some((support) => support.includes('ハンドルから手を離す'))))).toBe(true);
    expect(lm.every((vehicle) => vehicle.requiredPackage?.includes('G-Link契約') && vehicle.limitations.some((limitation) => limitation.includes('G-Link契約')))).toBe(true);
    expect(lm.every((vehicle) => vehicle.availability === 'unknown' && vehicle.availabilityCheckedAt === '2026-09-11' && vehicle.sources.some((source) => source.url === 'https://lexus.jp/news/info/delivery/index.html' && source.supports.some((fact) => fact.includes('5.5〜6.0ヶ月')) && vehicle.limitations.some((limitation) => limitation.includes('現在の受注可否・納期'))))).toBe(true);
    expect(lm.every((vehicle) => !vehicle.classificationRationale?.includes('allowed_in_conditions'))).toBe(true);
  });

  it('Lexus LXは10販売単位を価格・定員別の条件付きハンズオフLevel 2として保持する', () => {
    const lx = vehicles.filter((vehicle) => vehicle.model === 'LX');
    expect(lx).toHaveLength(10);
    expect(lx.map((vehicle) => vehicle.grade).sort()).toEqual([
      'LX700h EXECUTIVE AWD（4人乗り）', 'LX700h AWD（5人乗り）', 'LX700h AWD（7人乗り）',
      'LX700h OVERTRAIL+ AWD（5人乗り）', 'LX700h OVERTRAIL+ AWD（7人乗り）',
      'LX600 EXECUTIVE AWD（4人乗り）', 'LX600 AWD（5人乗り）', 'LX600 AWD（7人乗り）',
      'LX600 OVERTRAIL+ AWD（5人乗り）', 'LX600 OVERTRAIL+ AWD（7人乗り）',
    ].sort());
    expect(lx.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      14_500_000, 14_500_000, 14_900_000, 14_900_000, 15_900_000, 15_900_000, 15_900_000, 15_900_000, 20_000_000, 21_000_000,
    ]);
    expect(lx.every((vehicle) => vehicle.currentCatalogListed && vehicle.modelYear === null && vehicle.catalogAsOf === '2026-09' && vehicle.priceEffectiveAt === null)).toBe(true);
    expect(lx.every((vehicle) => vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'allowed_in_conditions' && vehicle.availability === 'unknown')).toBe(true);
    expect(lx.every((vehicle) => vehicle.odd.speedKph.min === 0 && vehicle.odd.speedKph.max === 40 && vehicle.capabilities.includes('adaptive_cruise_control') && vehicle.capabilities.includes('lane_centering') && vehicle.capabilities.includes('traffic_jam_assist') && vehicle.capabilities.includes('hands_off_highway'))).toBe(true);
    expect(lx.every((vehicle) => !vehicle.capabilities.includes('lane_change_support'))).toBe(true);
    expect(lx.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://lexus.jp/models/lx/spec_price/'))).toBe(true);
    expect(lx.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://lexus.jp/models/lx/features/safety/'))).toBe(true);
    expect(lx.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://lexus.jp/models/lx/configurator/index.html'))).toBe(true);
    expect(lx.flatMap((vehicle) => vehicle.sources.map((source) => source.url))).toContain('https://lexus.jp/models/lx/pdf/equipmentlist.pdf');
    expect(lx.flatMap((vehicle) => vehicle.sources.map((source) => source.url))).toContain('https://lexus.jp/models/lx/pdf/detail.pdf');
    expect(lx.filter((vehicle) => vehicle.grade.startsWith('LX700h') && !vehicle.grade.includes('OVERTRAIL')).every((vehicle) => vehicle.salesUnitIntroducedAt === '2025-03-24')).toBe(true);
    expect(lx.filter((vehicle) => vehicle.grade.startsWith('LX600')).every((vehicle) => vehicle.salesUnitIntroducedAt === null)).toBe(true);
    expect(officialLinkFor(lx[0])?.actions?.map(({ kind }) => kind)).toEqual(['dealer', 'estimate', 'catalog', 'catalog']);
  });

  it('Lexus UX300hは6販売単位を価格・駆動方式別のステアリング保持Level 2として保持する', () => {
    const ux = vehicles.filter((vehicle) => vehicle.model === 'UX300h');
    expect(ux).toHaveLength(6);
    expect(ux.map((vehicle) => vehicle.grade).sort()).toEqual([
      'UX300h “Shining Essence” 2WD', 'UX300h “Shining Essence” AWD',
      'UX300h “version L” 2WD', 'UX300h “version L” AWD',
      'UX300h “F SPORT” 2WD', 'UX300h “F SPORT” AWD',
    ].sort());
    expect(ux.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([5_210_000, 5_341_000, 5_475_000, 5_492_000, 5_606_000, 5_757_000]);
    expect(ux.every((vehicle) => vehicle.currentCatalogListed && vehicle.modelYear === null && vehicle.catalogAsOf === null && vehicle.priceEffectiveAt === null)).toBe(true);
    expect(ux.every((vehicle) => vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'not_allowed')).toBe(true);
    expect(ux.every((vehicle) => vehicle.odd.speedKph.min === null && vehicle.odd.speedKph.max === null)).toBe(true);
    expect(ux.every((vehicle) => vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist')).toBe(true);
    expect(ux.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://lexus.jp/models/ux/features/price_package/'))).toBe(true);
    expect(ux.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://lexus.jp/models/ux/features/safety/'))).toBe(true);
    expect(ux.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('/ux/pdf/equipmentlist.pdf')))).toBe(true);
    expect(ux.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('/ux/pdf/specificationslist.pdf')))).toBe(true);
    expect(ux.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('vhch04se050404.php') && source.supports.some((support) => support.includes('ステアリング保持'))))).toBe(true);
    expect(ux.every((vehicle) => vehicle.limitations.some((limitation) => limitation.includes('2027年2月生産終了予定')))).toBe(true);
    expect(ux.every((vehicle) => !vehicle.capabilities.includes('hands_off_highway') && !vehicle.capabilities.includes('lane_change_support') && !vehicle.capabilities.includes('driver_monitoring'))).toBe(true);
  });

  it('Honda VEZEL e:HEV ZはFF/4WDを分け、支援速度と価格を保持する', () => {
    const vezel = vehicles.filter((vehicle) => vehicle.model === 'VEZEL');
    expect(vezel).toHaveLength(2);
    expect(vezel.map((vehicle) => vehicle.grade).sort()).toEqual(['e:HEV Z（4WD）', 'e:HEV Z（FF）'].sort());
    expect(vezel.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => a! - b!)).toEqual([3_268_100, 3_488_100]);
    expect(vezel.every((vehicle) => vehicle.modelYear === '2026' && vehicle.automationLevel === 2 && vehicle.handsOff === 'not_allowed' && vehicle.odd.speedKph.max === 120)).toBe(true);
    expect(vezel.every((vehicle) => vehicle.sources.some((source) => source.url.includes('/ownersmanual/webom/jpn/vezel/2026/')))).toBe(true);
  });

  it('Honda ZR-V e:HEV X／ZはFF・4WDを分け、Honda SENSINGと価格を保持する', () => {
    const zrV = vehicles.filter((vehicle) => vehicle.model === 'ZR-V');
    expect(zrV).toHaveLength(4);
    expect(zrV.map((vehicle) => vehicle.grade).sort()).toEqual(['e:HEV X〈4WD〉', 'e:HEV X〈FF〉', 'e:HEV Z〈4WD〉', 'e:HEV Z〈FF〉'].sort());
    expect(zrV.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => a! - b!)).toEqual([3_707_000, 3_927_000, 4_307_600, 4_527_600]);
    expect(zrV.every((vehicle) => vehicle.currentCatalogListed && vehicle.modelYear === null && vehicle.catalogAsOf === '2026-09' && vehicle.salesUnitIntroducedAt === null && vehicle.priceEffectiveAt === null)).toBe(true);
    expect(zrV.every((vehicle) => vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.handsOff === 'not_allowed' && vehicle.availability === 'unknown')).toBe(true);
    expect(zrV.every((vehicle) => vehicle.odd.speedKph.min === 0 && vehicle.odd.speedKph.max === 120 && vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist')).toBe(true);
    expect(zrV.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://www.honda.co.jp/ZR-V/webcatalog/performance/' && source.supports.some((fact) => fact.includes('Honda SENSING'))))).toBe(true);
    expect(zrV.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://www.honda.co.jp/hondasensing/sensing/tja/' && source.supports.some((fact) => fact.includes('手放し'))))).toBe(true);
    expect(officialLinkFor(zrV[0])?.actions?.map(({ kind }) => kind)).toEqual(['dealer', 'test_drive', 'estimate', 'catalog']);
  });

  it('Toyota ノア現行HEV全8販売単位を価格・定員・能力差つきで保持する', () => {
    const noah = vehicles.filter((vehicle) => vehicle.model === 'ノア');
    expect(noah).toHaveLength(8);
    expect(noah.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => a! - b!)).toEqual([
      3_261_500, 3_261_500, 3_514_500, 3_700_400, 3_700_400, 3_953_400, 4_056_800, 4_309_800,
    ]);
    const advanced = noah.filter((vehicle) => vehicle.handsOff === 'allowed_in_conditions');
    expect(advanced).toHaveLength(5);
    expect(advanced.every((vehicle) => vehicle.capabilities.includes('lane_change_support') && vehicle.capabilities.includes('driver_monitoring'))).toBe(true);
    expect(advanced.map((vehicle) => vehicle.price?.optionalPackages[0].amountJpy).sort((a, b) => a! - b!)).toEqual([78_100, 78_100, 78_100, 122_100, 122_100]);
    expect(advanced.every((vehicle) => vehicle.odd.speedKph.min === 0 && vehicle.odd.speedKph.max === 130 && vehicle.odd.speedKph.condition?.includes('約40km/h') && vehicle.odd.speedKph.condition?.includes('約85〜130km/h'))).toBe(true);
    expect(advanced.every((vehicle) => vehicle.requiredPackage?.includes('T-Connect／コネクティッドナビ契約') && vehicle.limitations.some((limitation) => limitation.includes('地図更新は停止')))).toBe(true);
    expect(advanced.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://toyota.jp/noah/safety/' && source.supports.some((support) => support.includes('約85〜130km/h'))))).toBe(true);
    const sx = noah.filter((vehicle) => vehicle.grade.includes('S-X'));
    expect(sx).toHaveLength(3);
    expect(sx.every((vehicle) => vehicle.handsOff === 'not_allowed' && vehicle.price?.optionalPackages.length === 0 && !vehicle.capabilities.includes('lane_change_support') && vehicle.odd.speedKph.min === null && vehicle.odd.speedKph.max === null && vehicle.odd.speedKph.condition?.includes('0〜約40km/h条件は適用しない'))).toBe(true);
    expect(noah.every((vehicle) => vehicle.automationLevel === 2 && vehicle.driverMonitoring === 'required' && vehicle.availability === 'unknown' && vehicle.salesUnitIntroducedAt === null && vehicle.sources.some((source) => source.url.endsWith('noah_spec_202609.pdf')))).toBe(true);
    const noahSz = noah.find((vehicle) => vehicle.id === 'jp-toyota-noah-2026-hybrid-sz-2wd-7seater-advanced-drive');
    expect(noahSz?.price?.optionalPackages[0].amountJpy).toBe(122_100);
    expect(displayVehicleReferenceTotal(noahSz!)).toBe('4,178,900円');

    const rz = vehicles.find((vehicle) => vehicle.id === 'jp-lexus-rz-2026-rz500e-version-l-awd');
    expect(rz?.price?.amounts[0].amountJpy).toBe(8_500_000);
    expect(rz?.handsOff).toBe('unknown');
    expect(rz?.driverMonitoring).toBe('unknown');
    expect(rz?.availability).toBe('unknown');
  });

  it('Toyota プリウスとLexus NXの主要販売単位を価格・手保持条件付きで保持する', () => {
    const priusUnits = vehicles.filter((vehicle) => vehicle.model === 'プリウス');
    expect(priusUnits).toHaveLength(6);
    expect(priusUnits.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([2_796_200, 3_049_200, 3_324_200, 3_577_200, 3_998_500, 4_251_500]);
    expect(priusUnits.every((vehicle) => vehicle.catalogAsOf === '2026-07' && vehicle.priceEffectiveAt === '2026-07' && vehicle.salesUnitIntroducedAt === null && vehicle.automationLevel === 2 && vehicle.handsOff === 'not_allowed' && vehicle.driverMonitoring === 'required' && vehicle.availability === 'unknown')).toBe(true);
    expect(priusUnits.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://toyota.jp/prius/grade/' && source.supports.some((support) => support.includes('円'))))).toBe(true);
    expect(priusUnits.filter((vehicle) => vehicle.grade.includes('法人向け'))).toHaveLength(2);
    expect(priusUnits.filter((vehicle) => vehicle.grade.includes('法人向け')).every((vehicle) => vehicle.sources.some((source) => source.url === 'https://toyota.jp/request/webcatalog/prius/' && source.supports.some((support) => support.includes('法人向け'))))).toBe(true);
    const prius = vehicles.find((vehicle) => vehicle.id === 'jp-toyota-prius-2026-z-2wd');
    expect(prius?.modelYear).toBe('2026');
    expect(prius?.catalogAsOf).toBe('2026-07');
    expect(prius?.salesUnitIntroducedAt).toBeNull();
    expect(prius?.priceEffectiveAt).toBe('2026-07');
    expect(prius?.price?.amounts[0].amountJpy).toBe(3_998_500);
    expect(prius?.handsOff).toBe('not_allowed');
    expect(prius?.driverMonitoring).toBe('required');
    expect(prius?.capabilities).toEqual(expect.arrayContaining(['adaptive_cruise_control', 'lane_centering', 'traffic_jam_assist']));
    expect(prius?.capabilities).not.toContain('driver_monitoring');
    expect(prius?.availability).toBe('unknown');
    expect(prius?.sources.some((source) => source.url === 'https://toyota.jp/prius/safety/')).toBe(true);
    expect(prius?.sources.some((source) => source.url === 'https://manual.toyota.jp/prius/3066/hev/ja_JP/contents/vhch04se050404.php')).toBe(true);

    const nx = vehicles.find((vehicle) => vehicle.id === 'jp-lexus-nx-2026-nx350h-version-l-2wd');
    expect(nx?.price?.amounts[0].amountJpy).toBe(6_376_000);
    expect(nx?.handsOff).toBe('not_allowed');
    expect(nx?.driverMonitoring).toBe('required');
    expect(nx?.availability).toBe('unknown');
    expect(nx?.sources.some((source) => source.url === 'https://lexus.jp/models/nx/features/safety/')).toBe(true);
    expect(nx?.sources.some((source) => source.url === 'https://manual.lexus.jp/nx/3050/hev/ja_JP/contents/reb1668054515740.php#yaw1609986159221')).toBe(true);
  });

  it('Toyota クラウンとLexus LBX/RXは渋滞時支援・車線変更・監視条件を販売単位へ固定する', () => {
    const crown = vehicles.find((vehicle) => vehicle.id === 'jp-toyota-crown-crossover-2026-rs-limited-matte-metal-4wd');
    expect(crown?.price?.amounts[0].amountJpy).toBe(7_590_000);
    expect(crown?.handsOff).toBe('allowed_in_conditions');
    expect(crown?.driverMonitoring).toBe('required');
    expect(crown?.odd.speedKph).toMatchObject({ min: 0, max: 40 });
    expect(crown?.capabilities).toEqual(expect.arrayContaining(['traffic_jam_assist', 'hands_off_highway', 'driver_monitoring', 'lane_change_support']));
    expect(crown?.sources.some((source) => source.url === 'https://manual.toyota.jp/crowncrossover/3143/hev/ja_JP/contents/vhch04se050415.php')).toBe(true);

    const lbx = vehicles.find((vehicle) => vehicle.id === 'jp-lexus-lbx-2026-bespoke-build-2wd');
    expect(lbx?.price?.amounts[0].amountJpy).toBe(5_500_000);
    expect(lbx?.handsOff).toBe('allowed_in_conditions');
    expect(lbx?.driverMonitoring).toBe('required');
    expect(lbx?.capabilities).toEqual(expect.arrayContaining(['traffic_jam_assist', 'hands_off_highway', 'driver_monitoring', 'lane_change_support']));
    expect(lbx?.sources.some((source) => source.url === 'https://lexus.jp/models/lbx/features/safety/')).toBe(true);

    const rx = vehicles.find((vehicle) => vehicle.id === 'jp-lexus-rx-2026-rx500h-f-sport-performance-awd');
    expect(rx?.price?.amounts[0].amountJpy).toBe(9_030_000);
    expect(rx?.handsOff).toBe('allowed_in_conditions');
    expect(rx?.driverMonitoring).toBe('required');
    expect(rx?.odd.speedKph).toMatchObject({ min: 0, max: 40 });
    expect(rx?.capabilities).toEqual(expect.arrayContaining(['traffic_jam_assist', 'hands_off_highway', 'driver_monitoring', 'lane_change_support']));
    expect(rx?.sources.some((source) => source.url === 'https://lexus.jp/models/rx/pdf/rx_safety.pdf')).toBe(true);
  });

  it('Toyota クラウン スポーツはPHEV/HEV・グレード別の価格と能力差を保持する', () => {
    const sport = vehicles.filter((vehicle) => vehicle.model === 'クラウン スポーツ');
    expect(sport).toHaveLength(4);
    expect(sport.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([5_327_300, 6_061_000, 6_927_800, 7_777_000]);
    expect(sport.every((vehicle) => vehicle.currentCatalogListed && vehicle.catalogAsOf === '2026-09' && vehicle.priceEffectiveAt === '2026-09' && vehicle.automationLevel === 2 && vehicle.availability === 'unknown')).toBe(true);
    const advanced = sport.filter((vehicle) => vehicle.grade.includes('SPORT RS') || vehicle.grade.includes('SPORT Z'));
    expect(advanced).toHaveLength(3);
    expect(advanced.every((vehicle) => vehicle.handsOff === 'allowed_in_conditions' && vehicle.driverMonitoring === 'required' && vehicle.odd.speedKph.max === 40 && vehicle.capabilities.join(',') === 'adaptive_cruise_control,lane_centering,traffic_jam_assist,hands_off_highway,driver_monitoring,lane_change_support')).toBe(true);
    const base = sport.find((vehicle) => vehicle.grade.includes('SPORT G'))!;
    expect(base.handsOff).toBe('not_allowed');
    expect(base.driverMonitoring).toBe('unknown');
    expect(base.capabilities.join(',')).toBe('adaptive_cruise_control,lane_centering,traffic_jam_assist');
    expect(base.odd.speedKph.max).toBeNull();
    expect(sport.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('grades64.json')))).toBe(true);
    expect(sport.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('crownsport_spec_202609.pdf')))).toBe(true);
    expect(officialLinkFor(sport[0])?.actions?.map(({ kind }) => kind)).toEqual(['dealer', 'test_drive', 'estimate', 'catalog']);
  });

  it('Toyota bZ4X Zは価格・渋滞時支援・監視条件を販売単位へ固定する', () => {
    const bz4x = vehicles.find((vehicle) => vehicle.id === 'jp-toyota-bz4x-2026-z-fwd-advanced-drive');
    expect(bz4x?.price?.amounts[0].amountJpy).toBe(5_500_000);
    expect(bz4x?.handsOff).toBe('allowed_in_conditions');
    expect(bz4x?.driverMonitoring).toBe('required');
    expect(bz4x?.odd.speedKph).toMatchObject({ min: 0, max: 40 });
    expect(bz4x?.capabilities).toEqual(expect.arrayContaining(['adaptive_cruise_control', 'lane_centering', 'traffic_jam_assist', 'hands_off_highway', 'driver_monitoring', 'lane_change_support']));
    expect(bz4x?.sources.some((source) => source.url === 'https://toyota.jp/bz4x/safety/')).toBe(true);
    expect(bz4x?.sources.some((source) => source.url.includes('manual.toyota.jp/bz4x'))).toBe(true);
  });

  it('Toyota RAV4はHEV/PHEV・グレード別の価格とオプション差を販売単位へ固定する', () => {
    const rav4 = vehicles.filter((vehicle) => vehicle.model === 'RAV4');
    expect(rav4).toHaveLength(4);
    expect(rav4.every((vehicle) => vehicle.automationLevel === 2 && vehicle.handsOff === 'not_allowed')).toBe(true);
    expect(rav4.every((vehicle) => vehicle.price?.kind === 'exact' && vehicle.catalogAsOf === '2026-02' && vehicle.priceEffectiveAt === '2026-02')).toBe(true);
    expect(rav4.find((vehicle) => vehicle.id === 'jp-toyota-rav4-2026-z-phev-e-four')?.price?.amounts[0].amountJpy).toBe(6_000_000);
    expect(rav4.find((vehicle) => vehicle.id === 'jp-toyota-rav4-2026-z-hev-e-four')?.price?.amounts[0].amountJpy).toBe(4_900_000);
    expect(rav4.find((vehicle) => vehicle.id === 'jp-toyota-rav4-2026-adventure-hev-e-four')?.price?.amounts[0].amountJpy).toBe(4_500_000);
    expect(rav4.find((vehicle) => vehicle.id === 'jp-toyota-rav4-2026-gr-sport-phev-e-four')?.price?.amounts[0].amountJpy).toBe(6_300_000);
    expect(rav4.filter((vehicle) => vehicle.driverMonitoring === 'required')).toHaveLength(1);
    expect(rav4.find((vehicle) => vehicle.grade.startsWith('Adventure'))?.capabilities).toContain('driver_monitoring');
    expect(rav4.filter((vehicle) => vehicle.requiredPackage?.includes('メーカーオプション'))).toHaveLength(4);
    expect(rav4.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://toyota.jp/rav4/grade/'))).toBe(true);
    expect(rav4.filter((vehicle) => vehicle.featureVersion.includes(' RAV4 HEV ')).every((vehicle) => vehicle.sources.some((source) => source.url.includes('manual.toyota.jp/rav4/3097/hev')))).toBe(true);
    expect(rav4.filter((vehicle) => vehicle.featureVersion.includes('PHEV')).every((vehicle) => vehicle.sources.some((source) => source.url.includes('manual.toyota.jp/rav4/3098/phev')))).toBe(true);
  });

  it('Toyota ハリアーはHEVの6グレードを価格・支援機能付きで販売単位化する', () => {
    const harrier = vehicles.filter((vehicle) => vehicle.model === 'ハリアー');
    expect(harrier).toHaveLength(6);
    expect(harrier.every((vehicle) => vehicle.automationLevel === 2 && vehicle.handsOff === 'not_allowed')).toBe(true);
    expect(harrier.every((vehicle) => vehicle.currentCatalogListed && vehicle.catalogAsOf === '2026-08')).toBe(true);
    expect(harrier.map((vehicle) => vehicle.price?.amounts[0].amountJpy).sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([4_396_700, 4_616_700, 4_866_400, 5_086_400, 5_186_500, 5_406_500]);
    expect(harrier.every((vehicle) => vehicle.capabilities.includes('adaptive_cruise_control') && vehicle.capabilities.includes('lane_centering') && vehicle.capabilities.includes('traffic_jam_assist'))).toBe(true);
    expect(harrier.every((vehicle) => vehicle.driverMonitoring === 'unknown' && !vehicle.capabilities.includes('lane_change_support'))).toBe(true);
    expect(harrier.every((vehicle) => vehicle.sources.some((source) => source.url.endsWith('grades34.json')))).toBe(true);
    expect(harrier.every((vehicle) => vehicle.sources.some((source) => source.url.includes('manual.toyota.jp/harrier/2608/hev')))).toBe(true);
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
    expect(ex30.every((vehicle) => vehicle.availability === 'new_order_available' && vehicle.availabilityCheckedAt === '2026-09-11')).toBe(true);
    expect(ex30.every((vehicle) => vehicle.sources.some((source) => source.url === 'https://www.volvocars.com/jp/l/electric-qa/' && source.accessedAt === '2026-09-11'))).toBe(true);
    expect(officialLinks.find(({ maker, model }) => maker === 'Volvo' && model === 'EX30')?.actions).toEqual([
      { kind: 'order', label: 'オンラインで注文', url: 'https://www.volvocars.com/jp/shop/', checkedAt: '2026-09-11' },
    ]);
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
    expect(professional.every((vehicle) => vehicle.requiredPackage?.includes('ドライビング・アシスタント・プロフェッショナル') && vehicle.odd.roadTypes.join(',') === '高速道路')).toBe(true);
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
