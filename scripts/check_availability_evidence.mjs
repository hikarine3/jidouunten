// @ts-nocheck
import assert from 'node:assert/strict';
import fs from 'node:fs';

const vehicles = JSON.parse(fs.readFileSync(new URL('../src/data/vehicles.json', import.meta.url), 'utf8'));
const orderable = vehicles.filter(({ availability }) => availability === 'new_order_available');
assert.ok(orderable.length > 0, '注文可の販売単位が0件');

for (const vehicle of orderable) {
  const evidence = vehicle.sources.filter(({ type, supports = [] }) => type === 'manufacturer' && supports.some((fact) => /注文|出荷目処|車両注文|オンライン.*契約|購入予約/.test(fact)));
  assert.ok(evidence.length > 0, `${vehicle.id}: メーカー一次情報の注文・出荷根拠がない`);
  assert.ok(!vehicle.limitations.some((limitation) => /新車.*注文.*未確認|注文可否.*未確認/.test(limitation)), `${vehicle.id}: 注文可と未確認を同時表示`);
}

const unknown = vehicles.filter(({ availability }) => availability === 'unknown');
assert.ok(unknown.length > 0, '未確認の棚卸し対象が0件');
console.log(`PASS: 注文可${orderable.length}件は全件メーカー注文・出荷根拠あり / 未確認${unknown.length}件を保持`);
