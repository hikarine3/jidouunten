// @ts-check
import assert from 'node:assert/strict';
import fs from 'node:fs';

/** @typedef {{ id: string, salesUnitIntroducedAt: string|null, sources: Array<{ supports: string[] }>, factStatus: string, availabilityCheckedAt: string, lastReviewedAt: string }} Vehicle */
/** @type {Vehicle[]} */
const vehicles = JSON.parse(fs.readFileSync(new URL('../src/data/vehicles.json', import.meta.url), 'utf8'));
assert.ok(Array.isArray(vehicles) && vehicles.length > 0, '車両データが空です');

const asOf = process.env.FRESHNESS_AS_OF ? new Date(`${process.env.FRESHNESS_AS_OF}T00:00:00Z`) : new Date();
assert.ok(!Number.isNaN(asOf.valueOf()), 'FRESHNESS_AS_OF must be YYYY-MM-DD');
/** @param {string} date */
const ageDays = (date) => Math.floor((asOf.valueOf() - Date.parse(date)) / 86_400_000);
/** @param {{ factStatus: string, availabilityCheckedAt: string, lastReviewedAt: string }} vehicle */
const statusFor = (vehicle) => {
  if (vehicle.factStatus !== 'verified') return vehicle.factStatus;
  if (ageDays(vehicle.availabilityCheckedAt) >= 90 || ageDays(vehicle.lastReviewedAt) >= 180) return 'stale';
  return 'verified';
};

// A source that explicitly states a launch month must not be downgraded to
// the less precise catalogAsOf display. This catches source-to-field omissions
// before the date reaches the list/detail renderers.
const explicitLaunchMonth = /^発売年月(\d{4})年(0?[1-9]|1[0-2])月/;
const launchMonthMismatches = vehicles.flatMap((vehicle) => {
  const facts = vehicle.sources.flatMap((source) => source.supports).map((fact) => explicitLaunchMonth.exec(fact));
  const expectedMatch = facts.find((match) => match);
  const expected = expectedMatch ? `${expectedMatch[1]}-${expectedMatch[2].padStart(2, '0')}` : null;
  if (!expected) return [];
  return vehicle.salesUnitIntroducedAt === expected ? [] : [{ id: vehicle.id, expected, actual: vehicle.salesUnitIntroducedAt }];
});
assert.equal(launchMonthMismatches.length, 0, `発売年月根拠とsalesUnitIntroducedAtが不一致: ${JSON.stringify(launchMonthMismatches)}`);
const explicitLaunchCount = vehicles.filter((vehicle) => vehicle.sources.some((source) => source.supports.some((fact) => explicitLaunchMonth.test(fact)))).length;

const counts = vehicles.reduce((result, vehicle) => {
  const status = statusFor(vehicle);
  result[status] = (result[status] ?? 0) + 1;
  return result;
}, /** @type {Record<string, number>} */ ({}));
console.log(`PASS: 鮮度判定基準日${asOf.toISOString().slice(0, 10)} / 確認済み${counts.verified ?? 0} / 要再確認${counts.stale ?? 0} / 競合${counts.conflicting ?? 0} / 未確認${counts.unknown ?? 0} / 発売年月根拠${explicitLaunchCount}件中${explicitLaunchCount}件正常`);
