export type Availability =
  | 'new_order_available'
  | 'inventory_only'
  | 'used_only'
  | 'service_available'
  | 'trial_or_research'
  | 'announced'
  | 'unavailable'
  | 'unknown';

export type HandsOff = 'allowed_in_conditions' | 'not_allowed' | 'unknown';
export type DriverMonitoring = 'required' | 'takeover_ready' | 'not_required_in_odd' | 'unknown';

export const capabilityDefinitions = {
  adaptive_cruise_control: { label: '追従走行（ACC）', description: '先行車との車間を保つよう速度を調整します。' },
  lane_centering: { label: '車線中央維持', description: '車線の中央付近を走るようハンドル操作を支援します。' },
  traffic_jam_assist: { label: '渋滞時運転支援', description: '渋滞時の追従走行と車線維持を支援します。運転者の常時監視が必要です。' },
  hands_off_highway: { label: '条件内ハンズオフ', description: '条件を満たす区間でハンドルから手を離せます。運転者の常時監視が必要です。' },
  lane_change_support: { label: '車線変更支援', description: '運転者の確認や操作を前提に、車線変更を支援します。' },
  driver_monitoring: { label: '運転者監視', description: 'カメラなどで運転者の状態を確認します。' },
  traffic_jam_pilot: { label: '渋滞時自動運転', description: '定められた条件内ではシステムが運転し、引継ぎ要求時に運転者が対応します。' },
} as const;

export type CapabilityId = keyof typeof capabilityDefinitions;

export interface Odd {
  roadTypes: string[];
  speedKph: { min?: number; max?: number; condition?: string };
  trafficConditions: string[];
  weather: string | string[];
  geoRestriction: string | string[];
  driverConditions: string[];
  manufacturerSummary: string;
}

export interface VehicleSource {
  url: string;
  publisher: string;
  title: string;
  accessedAt: string;
  supports: string[];
  type?: string;
}

export interface VehiclePriceAmount {
  amountJpy: number;
  qualifier: string | null;
  sourceUrl: string;
}

export interface VehicleOptionalPackagePrice extends VehiclePriceAmount {
  label: string;
}

export interface VehiclePrice {
  kind: 'exact' | 'range';
  currency: 'JPY';
  amounts: VehiclePriceAmount[];
  maxJpy: number | null;
  optionalPackages: VehicleOptionalPackagePrice[];
  basis: 'vehicle_body' | 'msrp' | 'price_list' | 'unknown';
  taxIncluded: 'included' | 'excluded' | 'unknown';
}

export interface OfficialLink {
  maker: string;
  model: string;
  url: string;
  kind: 'product' | 'archive';
  checkedAt: string;
  actions?: OfficialAction[];
}

export interface OfficialAction {
  kind: 'order' | 'test_drive' | 'dealer' | 'catalog' | 'estimate';
  label: string;
  url: string;
  checkedAt: string;
}

export interface Vehicle {
  id: string;
  market: string;
  maker: string;
  model: string;
  /** Manufacturer-explicit model year; document/publication years are not substitutes. */
  modelYear: string | null;
  generation: string | null;
  catalogAsOf: string | null;
  salesUnitIntroducedAt: string | null;
  priceEffectiveAt: string | null;
  price: VehiclePrice | null;
  grade: string;
  requiredPackage: string | null;
  /** Manufacturer feature/package revision used to keep materially different sales units distinct. */
  featureVersion: string;
  /** True only when the current Japanese catalog listing was checked. */
  currentCatalogListed: boolean;
  automationLevel: 0 | 1 | 2 | 3 | 4 | 5;
  category: 'driver_assistance' | 'automated_driving';
  availability: Availability;
  availabilityCheckedAt: string;
  odd: Odd;
  driverMonitoring: DriverMonitoring;
  handsOff: HandsOff;
  capabilities: string[];
  limitations: string[];
  sources: VehicleSource[];
  classificationRationale?: string;
  factStatus: 'verified' | 'stale' | 'conflicting' | 'unknown';
  lastReviewedAt: string;
}

/**
 * vehicles.json is intentionally supplied by the data owner. The glob keeps a
 * clean empty build while that file is absent, then picks it up automatically.
 */
const modules = import.meta.glob('./vehicles.json', { eager: true, import: 'default' }) as Record<string, unknown>;
const raw = Object.values(modules)[0];
export const vehicles: Vehicle[] = Array.isArray(raw)
  ? (raw as Vehicle[])
  : ((raw as { vehicles?: Vehicle[] } | undefined)?.vehicles ?? []);

const officialLinkModules = import.meta.glob('./official-links.json', { eager: true, import: 'default' }) as Record<string, unknown>;
const officialLinkRaw = Object.values(officialLinkModules)[0];
export const officialLinks: OfficialLink[] = Array.isArray(officialLinkRaw) ? officialLinkRaw as OfficialLink[] : [];

export function officialLinkFor(vehicle: Pick<Vehicle, 'maker' | 'model'>) {
  return officialLinks.find((link) => link.maker === vehicle.maker && link.model === vehicle.model);
}

export const levelLabels: Record<number, string> = {
  0: '運転自動化なし',
  1: '運転支援',
  2: '運転支援',
  3: '条件付自動運転',
  4: '高度自動運転',
  5: '完全自動運転',
};

export const levelShort: Record<number, string> = {
  0: 'すべて運転者が操作',
  1: '前後または左右を支援',
  2: '前後と左右を同時に支援',
  3: '条件内ではシステムが運転',
  4: '限定エリアなら無人で走れる',
  5: '場所や天候を限定せず自動運転',
};

export const availabilityLabels: Record<Availability, string> = {
  new_order_available: '新車注文可',
  inventory_only: '在庫販売の可能性',
  used_only: '中古流通のみ',
  service_available: '移動サービス',
  trial_or_research: '実証・研究',
  announced: '発表済み・提供前',
  unavailable: '現在利用不可',
  unknown: '注文可否：未確認',
};

export const availabilityNotes: Partial<Record<Availability, string>> = {
  unknown: 'メーカー公式サイトへの掲載は確認済みです。新車で注文できるかは未確認です。',
};

export const handsOffLabels: Record<HandsOff, string> = {
  allowed_in_conditions: 'ハンズオフ：条件内で可',
  not_allowed: 'ハンズオフ：不可',
  unknown: 'ハンズオフ：未確認',
};

export const monitoringLabels: Record<DriverMonitoring, string> = {
  required: '常時監視が必要',
  takeover_ready: '引継ぎに備える',
  not_required_in_odd: 'ODD内では不要',
  unknown: '監視条件は不明',
};

export const levelIds = [1, 2, 3, 4, 5] as const;

export const roadFilterLabels = ['高速道路', '自動車専用道路', '一般道'] as const;

/** ODDの詳細表記を、一覧フィルター用の利用者向け道路区分へ正規化する。 */
export function canonicalRoadType(value: string) {
  if (value.includes('高速道路')) return '高速道路';
  if (value.includes('自動車専用道路')) return '自動車専用道路';
  if (value.includes('一般道')) return '一般道';
  return value;
}

export function findVehicle(id: string) {
  return vehicles.find((vehicle) => vehicle.id === id);
}

export function vehicleReferenceLabel(vehicle: Pick<Vehicle, 'modelYear' | 'generation'>) {
  if (vehicle.modelYear) return `${vehicle.modelYear}年モデル`;
  if (vehicle.generation) return vehicle.generation;
  return '現行仕様';
}

export function displayDate(date: string) {
  if (!date) return '不明';
  const parsed = new Date(date);
  return Number.isNaN(parsed.valueOf()) ? date : new Intl.DateTimeFormat('ja-JP').format(parsed);
}

export function filterVehicles(input: {
  level?: string | number;
  maker?: string;
  capability?: string;
  road?: string;
  handsOff?: string;
  availability?: string;
}) {
  return filterVehicleList(vehicles, input);
}

/** 一覧の既定表示とトップ集計で共有する「現行カタログ掲載確認」の判定。 */
export function isDefaultListedVehicle(vehicle: Pick<Vehicle, 'availability' | 'currentCatalogListed'>) {
  return vehicle.availability === 'new_order_available'
    || (vehicle.availability === 'unknown' && vehicle.currentCatalogListed === true);
}

export function filterVehicleList(list: Vehicle[], input: {
  level?: string | number;
  maker?: string;
  capability?: string;
  road?: string;
  handsOff?: string;
  availability?: string;
}) {
  const level = input.level === undefined || input.level === '' ? undefined : Number(input.level);
  return list.filter((vehicle) => {
    // Unknown order status remains visible as a review candidate, but is never
    // presented as orderable. Explicitly excluded records can opt out.
    if (!input.availability && !isDefaultListedVehicle(vehicle)) return false;
    if (level !== undefined && vehicle.automationLevel !== level) return false;
    if (input.maker && vehicle.maker !== input.maker) return false;
    if (input.capability && !vehicle.capabilities.includes(input.capability)) return false;
    if (input.road && !vehicle.odd.roadTypes.some((road) => canonicalRoadType(road) === input.road)) return false;
    if (input.handsOff && vehicle.handsOff !== input.handsOff) return false;
    if (input.availability && input.availability !== 'all' && vehicle.availability !== input.availability) return false;
    return true;
  });
}

export function validateVehicle(value: unknown): value is Vehicle {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Vehicle>;
  const hasOwn = (key: string) => Object.prototype.hasOwnProperty.call(candidate, key);
  const validAvailability = ['new_order_available', 'inventory_only', 'used_only', 'service_available', 'trial_or_research', 'announced', 'unavailable', 'unknown'].includes(candidate.availability ?? '');
  const validMonitoring = ['required', 'takeover_ready', 'not_required_in_odd', 'unknown'].includes(candidate.driverMonitoring ?? '');
  const validHandsOff = ['allowed_in_conditions', 'not_allowed', 'unknown'].includes(candidate.handsOff ?? '');
  const validStatus = ['verified', 'stale', 'conflicting', 'unknown'].includes(candidate.factStatus ?? '');
  const validOdd = candidate.odd && typeof candidate.odd === 'object'
    && Array.isArray(candidate.odd.roadTypes) && typeof candidate.odd.speedKph === 'object'
    && Array.isArray(candidate.odd.trafficConditions) && (typeof candidate.odd.weather === 'string' || Array.isArray(candidate.odd.weather))
    && (typeof candidate.odd.geoRestriction === 'string' || Array.isArray(candidate.odd.geoRestriction)) && Array.isArray(candidate.odd.driverConditions)
    && typeof candidate.odd.manufacturerSummary === 'string';
  const validDate = (date: unknown) => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date));
  const validSources = Array.isArray(candidate.sources) && candidate.sources.length > 0 && candidate.sources.every((source) => source && typeof source === 'object' && typeof source.url === 'string' && /^https?:\/\//.test(source.url) && typeof source.publisher === 'string' && typeof source.title === 'string' && validDate(source.accessedAt) && Array.isArray(source.supports));
  const validPriceAmount = (amount: unknown) => Boolean(amount && typeof amount === 'object'
    && Number.isInteger((amount as VehiclePriceAmount).amountJpy) && (amount as VehiclePriceAmount).amountJpy > 0
    && ((amount as VehiclePriceAmount).qualifier === null || typeof (amount as VehiclePriceAmount).qualifier === 'string')
    && typeof (amount as VehiclePriceAmount).sourceUrl === 'string' && /^https?:\/\//.test((amount as VehiclePriceAmount).sourceUrl));
  const validPrice = candidate.price === null || Boolean(candidate.price && typeof candidate.price === 'object'
    && ['exact', 'range'].includes(candidate.price.kind)
    && candidate.price.currency === 'JPY'
    && Array.isArray(candidate.price.amounts) && candidate.price.amounts.length > 0 && candidate.price.amounts.every(validPriceAmount)
    && (candidate.price.maxJpy === null || (Number.isInteger(candidate.price.maxJpy) && candidate.price.maxJpy > 0))
    && Array.isArray(candidate.price.optionalPackages) && candidate.price.optionalPackages.every((item) => validPriceAmount(item) && typeof item.label === 'string')
    && ['vehicle_body', 'msrp', 'price_list', 'unknown'].includes(candidate.price.basis)
    && ['included', 'excluded', 'unknown'].includes(candidate.price.taxIncluded));
  const validMonth = (date: unknown) => typeof date === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(date);
  const validMonthOrDate = (date: unknown) => {
    if (validMonth(date)) return true;
    if (typeof date !== 'string') return false;
    const match = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.exec(date);
    if (!match) return false;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
  };
  const validNullable = (value: unknown, validator: (input: unknown) => boolean) => value === null || validator(value);
  const levelMatchesCategory = candidate.category === 'driver_assistance' ? Number(candidate.automationLevel) <= 2 : Number(candidate.automationLevel) >= 3;
  const numericLevel = Number(candidate.automationLevel);
  return typeof candidate.id === 'string'
    && candidate.market === 'JP'
    && typeof candidate.maker === 'string'
    && typeof candidate.model === 'string'
    && (typeof candidate.modelYear === 'string' || candidate.modelYear === null)
    && hasOwn('generation') && (typeof candidate.generation === 'string' || candidate.generation === null)
    && hasOwn('catalogAsOf') && validNullable(candidate.catalogAsOf, validMonth)
    && hasOwn('salesUnitIntroducedAt') && validNullable(candidate.salesUnitIntroducedAt, validMonthOrDate)
    && hasOwn('priceEffectiveAt') && validNullable(candidate.priceEffectiveAt, validMonthOrDate)
    && hasOwn('price') && validPrice
    && typeof candidate.grade === 'string'
    && (typeof candidate.requiredPackage === 'string' || candidate.requiredPackage === null)
    && typeof candidate.featureVersion === 'string'
    && typeof candidate.currentCatalogListed === 'boolean'
    && Number.isInteger(numericLevel) && numericLevel >= 0 && numericLevel <= 5
    && (candidate.category === 'driver_assistance' || candidate.category === 'automated_driving') && levelMatchesCategory
    && validAvailability && validMonitoring && validHandsOff && validStatus
    && validDate(candidate.availabilityCheckedAt) && validDate(candidate.lastReviewedAt)
    && Boolean(validOdd)
    && Array.isArray(candidate.capabilities)
    && candidate.capabilities.every((capability) => typeof capability === 'string' && capability in capabilityDefinitions)
    && Array.isArray(candidate.limitations)
    && validSources;
}

export function capabilityDefinition(id: string) {
  return capabilityDefinitions[id as CapabilityId];
}

export function displayIntroducedAt(value: string | null) {
  if (!value) return '発売・導入時期 未確認';
  const [year, month, day] = value.split('-').map(Number);
  return day ? `発売・導入 ${year}年${month}月${day}日` : `発売・導入 ${year}年${month}月`;
}

export type VehicleSort = 'introduced_desc' | 'price_asc' | 'maker_asc';

export function vehiclePriceMin(vehicle: Pick<Vehicle, 'price'>) {
  if (!vehicle.price?.amounts.length) return null;
  return Math.min(...vehicle.price.amounts.map(({ amountJpy }) => amountJpy));
}

export function displayVehiclePrice(vehicle: Pick<Vehicle, 'price'>, compact = false) {
  const price = vehicle.price;
  if (!price) return compact ? '価格要確認' : '公式価格未確認';
  const values = price.amounts.map(({ amountJpy }) => amountJpy);
  const min = Math.min(...values);
  const max = price.maxJpy ?? Math.max(...values);
  if (compact) {
    const minMan = price.kind === 'range' ? Math.floor(min / 10_000) : Math.round(min / 10_000);
    if (price.kind === 'range') return `約${minMan}万円〜`;
    const maxMan = Math.round(max / 10_000);
    return minMan === maxMan ? `約${minMan}万円` : `約${minMan}〜${maxMan}万円`;
  }
  const yen = new Intl.NumberFormat('ja-JP');
  if (price.kind === 'range') return `${yen.format(min)}円〜`;
  return min === max ? `${yen.format(min)}円` : `${yen.format(min)}〜${yen.format(max)}円`;
}

/** 確認できたメーカーオプション価格だけを表示し、車両本体価格と混同しない。 */
export function displayOptionalPackagePrices(vehicle: Pick<Vehicle, 'price'>) {
  const packages = vehicle.price?.optionalPackages ?? [];
  if (!packages.length) return null;
  const yen = new Intl.NumberFormat('ja-JP');
  return packages.map(({ label, amountJpy }) => `${label} +${yen.format(amountJpy)}円`).join(' / ');
}

/**
 * 本体価格と、価格が確認できた追加パッケージだけを合算した参考総額。
 * 本体価格がレンジ、複数候補、または追加パッケージ未確認の場合は推測せずnullを返す。
 */
export function vehicleReferenceTotal(vehicle: Pick<Vehicle, 'price'>) {
  const price = vehicle.price;
  if (!price || price.kind !== 'exact' || price.amounts.length !== 1 || price.optionalPackages.length === 0) return null;
  return price.amounts[0].amountJpy + price.optionalPackages.reduce((total, packagePrice) => total + packagePrice.amountJpy, 0);
}

export function displayVehicleReferenceTotal(vehicle: Pick<Vehicle, 'price'>) {
  const total = vehicleReferenceTotal(vehicle);
  return total === null ? null : `${new Intl.NumberFormat('ja-JP').format(total)}円`;
}

/**
 * 保存した候補の再訪判定に使う、公開判断材料だけの安定 fingerprint。
 * 確認日・出典URLは更新通知の差分に含めない。価格・能力・作動条件・
 * 販売状態など、購入判断に意味のある値だけを正規化してハッシュ化する。
 */
export function vehicleDecisionFingerprint(vehicle: Pick<Vehicle, 'modelYear' | 'generation' | 'grade' | 'salesUnitIntroducedAt' | 'automationLevel' | 'handsOff' | 'driverMonitoring' | 'capabilities' | 'limitations' | 'requiredPackage' | 'featureVersion' | 'currentCatalogListed' | 'availability' | 'odd' | 'price'>) {
  const payload = JSON.stringify({
    modelYear: vehicle.modelYear,
    generation: vehicle.generation,
    grade: vehicle.grade,
    salesUnitIntroducedAt: vehicle.salesUnitIntroducedAt,
    automationLevel: vehicle.automationLevel,
    handsOff: vehicle.handsOff,
    driverMonitoring: vehicle.driverMonitoring,
    capabilities: [...vehicle.capabilities].sort(),
    limitations: [...vehicle.limitations].sort(),
    requiredPackage: vehicle.requiredPackage,
    featureVersion: vehicle.featureVersion,
    currentCatalogListed: vehicle.currentCatalogListed,
    availability: vehicle.availability,
    odd: {
      roadTypes: [...vehicle.odd.roadTypes].map(canonicalRoadType).sort(),
      speedKph: vehicle.odd.speedKph,
      trafficConditions: [...vehicle.odd.trafficConditions].sort(),
      weather: Array.isArray(vehicle.odd.weather) ? [...vehicle.odd.weather].sort() : vehicle.odd.weather,
      geoRestriction: Array.isArray(vehicle.odd.geoRestriction) ? [...vehicle.odd.geoRestriction].sort() : vehicle.odd.geoRestriction,
      driverConditions: [...vehicle.odd.driverConditions].sort(),
    },
    price: vehicle.price && {
      kind: vehicle.price.kind,
      currency: vehicle.price.currency,
      amounts: vehicle.price.amounts.map(({ amountJpy, qualifier }) => ({ amountJpy, qualifier })),
      maxJpy: vehicle.price.maxJpy,
      optionalPackages: vehicle.price.optionalPackages.map(({ label, amountJpy, qualifier }) => ({ label, amountJpy, qualifier })),
      basis: vehicle.price.basis,
      taxIncluded: vehicle.price.taxIncluded,
    },
  });
  let hash = 2166136261;
  for (let index = 0; index < payload.length; index += 1) {
    hash ^= payload.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/** 発売・導入日はsalesUnitIntroducedAtだけを使い、未確認は必ず末尾に置く。 */
export function sortVehicleList(list: Vehicle[], sort: VehicleSort = 'introduced_desc') {
  const text = (vehicle: Vehicle) => [vehicle.maker, vehicle.model, vehicle.grade, vehicle.id].join('\u0000');
  return [...list].sort((a, b) => {
    if (sort === 'price_asc') {
      const aPrice = vehiclePriceMin(a);
      const bPrice = vehiclePriceMin(b);
      if (aPrice !== null && bPrice === null) return -1;
      if (aPrice === null && bPrice !== null) return 1;
      if (aPrice !== null && bPrice !== null && aPrice !== bPrice) return aPrice - bPrice;
    }
    if (sort === 'introduced_desc') {
      if (a.salesUnitIntroducedAt && !b.salesUnitIntroducedAt) return -1;
      if (!a.salesUnitIntroducedAt && b.salesUnitIntroducedAt) return 1;
      const byDate = (b.salesUnitIntroducedAt ?? '').localeCompare(a.salesUnitIntroducedAt ?? '');
      if (byDate) return byDate;
    }
    return text(a).localeCompare(text(b), 'ja');
  });
}

export function listFact(value: string | string[] | undefined) {
  if (!value || (Array.isArray(value) && value.length === 0)) return '不明';
  return Array.isArray(value) ? value.join(' / ') : value;
}

export function levelCaveat(level: number) {
  if (level === 2) return 'Level 2は運転支援。システム作動中も、運転者が周囲を常時監視します。';
  if (level === 3) return 'Level 3はODD内でシステムが運転しますが、引継ぎ要求には運転者が対応します。';
  if (level === 4) return 'Level 4は、限定されたエリア・ルート・天候などの条件内で、システムが運転を完結します。条件外を自力で走れるとは限りません。';
  if (level === 5) return 'Level 5は、走行エリアや天候などを限定せず、人が運転できるあらゆる場面でシステムが運転する分類です。現時点で日本の一般向け購入候補は掲載していません。';
  if (level === 1) return 'Level 1は前後または左右の一方を支援。運転の主体は常に運転者です。';
  return 'レベルは優劣の点数ではなく、運転の役割と条件を表します。';
}
