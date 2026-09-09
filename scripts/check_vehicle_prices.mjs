// @ts-nocheck
import fs from 'node:fs';

const path = new URL('../src/data/vehicles.json', import.meta.url);
const vehicles = JSON.parse(fs.readFileSync(path, 'utf8'));
const failures = [];

for (const vehicle of vehicles) {
  const price = vehicle.price;
  if (!Object.hasOwn(vehicle, 'price')) failures.push(`${vehicle.id}: price field missing`);
  if (!price) continue;
  const manufacturerSources = vehicle.sources.filter(({ type }) => type === 'manufacturer');
  for (const amount of [...price.amounts, ...price.optionalPackages]) {
    const source = manufacturerSources.find(({ url }) => url === amount.sourceUrl);
    if (!source) {
      failures.push(`${vehicle.id}: price source is not a manufacturer source: ${amount.sourceUrl}`);
      continue;
    }
    const marker = new Intl.NumberFormat('ja-JP').format(amount.amountJpy) + '円';
    if (!source.supports.some((support) => support.includes(marker))) failures.push(`${vehicle.id}: ${marker} is absent from source.supports`);
  }
  const values = price.amounts.map(({ amountJpy }) => amountJpy);
  if (price.kind === 'range' && price.maxJpy !== null) failures.push(`${vehicle.id}: range must not invent maxJpy`);
  if (price.kind === 'exact' && price.maxJpy !== Math.max(...values)) failures.push(`${vehicle.id}: exact maxJpy mismatch`);
}

const current = vehicles.filter((vehicle) => vehicle.currentCatalogListed === true && ['new_order_available', 'unknown'].includes(vehicle.availability));
const counts = {
  all: vehicles.length,
  current: current.length,
  priced: vehicles.filter(({ price }) => price !== null).length,
  currentPriced: current.filter(({ price }) => price !== null).length,
  exact: vehicles.filter(({ price }) => price?.kind === 'exact').length,
  range: vehicles.filter(({ price }) => price?.kind === 'range').length,
  unknown: vehicles.filter(({ price }) => price === null).length,
};

if (failures.length) {
  console.error(`BLOCK: ${failures.length}件の価格整合性エラー`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`PASS: 全${counts.all}件中${counts.all}件正常 / 現行${counts.current}件中${counts.currentPriced}件に公式価格 / exact ${counts.exact} / range ${counts.range} / 未確認 ${counts.unknown}`);
