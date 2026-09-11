// @ts-check
import assert from 'node:assert/strict';
import fs from 'node:fs';

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

const counts = vehicles.reduce((result, vehicle) => {
  const status = statusFor(vehicle);
  result[status] = (result[status] ?? 0) + 1;
  return result;
}, {});
console.log(`PASS: 鮮度判定基準日${asOf.toISOString().slice(0, 10)} / 確認済み${counts.verified ?? 0} / 要再確認${counts.stale ?? 0} / 競合${counts.conflicting ?? 0} / 未確認${counts.unknown ?? 0}`);
