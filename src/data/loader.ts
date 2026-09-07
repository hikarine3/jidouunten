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
  grade: string;
  requiredPackage: string | null;
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
  4: '限定領域内でシステムが対応',
  5: '条件限定のない自動運転',
};

export const availabilityLabels: Record<Availability, string> = {
  new_order_available: '新車注文可',
  inventory_only: '在庫販売の可能性',
  used_only: '中古流通のみ',
  service_available: '移動サービス',
  trial_or_research: '実証・研究',
  announced: '発表済み・提供前',
  unavailable: '現在利用不可',
  unknown: '受注状況は要確認',
};

export const handsOffLabels: Record<HandsOff, string> = {
  allowed_in_conditions: '条件内で可',
  not_allowed: '不可',
  unknown: '不明',
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
  road?: string;
  handsOff?: string;
  availability?: string;
}) {
  return filterVehicleList(vehicles, input);
}

export function filterVehicleList(list: Vehicle[], input: {
  level?: string | number;
  road?: string;
  handsOff?: string;
  availability?: string;
}) {
  const level = input.level === undefined || input.level === '' ? undefined : Number(input.level);
  const hasAvailabilityFilter = Boolean(input.availability);
  return list.filter((vehicle) => {
    // Unknown order status remains visible as a review candidate, but is never
    // presented as orderable. Explicitly excluded records can opt out.
    if (!hasAvailabilityFilter && vehicle.availability !== 'new_order_available' && !(vehicle.availability === 'unknown' && vehicle.currentCatalogListed === true)) return false;
    if (level !== undefined && vehicle.automationLevel !== level) return false;
    if (input.road && !vehicle.odd.roadTypes.some((road) => canonicalRoadType(road) === input.road)) return false;
    if (input.handsOff && vehicle.handsOff !== input.handsOff) return false;
    if (input.availability && vehicle.availability !== input.availability) return false;
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
    && typeof candidate.grade === 'string'
    && (typeof candidate.requiredPackage === 'string' || candidate.requiredPackage === null)
    && typeof candidate.currentCatalogListed === 'boolean'
    && Number.isInteger(numericLevel) && numericLevel >= 0 && numericLevel <= 5
    && (candidate.category === 'driver_assistance' || candidate.category === 'automated_driving') && levelMatchesCategory
    && validAvailability && validMonitoring && validHandsOff && validStatus
    && validDate(candidate.availabilityCheckedAt) && validDate(candidate.lastReviewedAt)
    && Boolean(validOdd)
    && Array.isArray(candidate.capabilities)
    && Array.isArray(candidate.limitations)
    && validSources;
}

export function listFact(value: string | string[] | undefined) {
  if (!value || (Array.isArray(value) && value.length === 0)) return '不明';
  return Array.isArray(value) ? value.join(' / ') : value;
}

export function levelCaveat(level: number) {
  if (level === 2) return 'Level 2は運転支援。システム作動中も、運転者が周囲を常時監視します。';
  if (level === 3) return 'Level 3はODD内でシステムが運転しますが、引継ぎ要求には運転者が対応します。';
  if (level >= 4) return 'Level 4以上は限定領域のサービス・実証が中心で、購入車一覧とは区別しています。';
  if (level === 1) return 'Level 1は前後または左右の一方を支援。運転の主体は常に運転者です。';
  return 'レベルは優劣の点数ではなく、運転の役割と条件を表します。';
}
