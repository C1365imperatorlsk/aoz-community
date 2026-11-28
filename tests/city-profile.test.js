'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const db = JSON.parse(html.match(/^const db=(.*);$/m)[1]);
const engineSource = ['floors', 'cityPlan'].map(n => html.split('\n').find(l => l.startsWith('function ' + n + '('))).join('\n');
const ctx = vm.createContext({});
vm.runInContext(engineSource + '\n' + fs.readFileSync(path.join(root, 'data/city-profile-core.js'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'data/city-profile-locales.js'), 'utf8'), ctx);
const core = vm.runInContext('CityProfile', ctx);
const engines = vm.runInContext('({floors,cityPlan})', ctx);
const words = vm.runInContext('cityProfileWords', ctx);
const plain = x => JSON.parse(JSON.stringify(x));
let checks = 0;
function equal(actual, expected) { assert.deepEqual(plain(actual), plain(expected)); checks++; }
function ok(value) { assert.ok(value); checks++; }
function rejects(action) { assert.throws(action); checks++; }
const mem = () => {
  const m = new Map();
  return {getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, v)};
};
const d = core.empty(db.names), p = d.profiles.global;
equal(p.levels.main, null);
equal(core.estimate(p, db.names, db.global, engines), {state: 'needsHall'});
equal(p.stock, ['', '', '', '', '', '']);
core.setLevel(p, 'main', 30, db.names); equal(p.target, 31);
core.setLevel(d.profiles.v3, 'main', 20, db.names); equal(p.levels.main, 30);
core.setLevel(p, 'workshop', 13, db.names);
for (const n of [-1, 1, 12, 42, 13.5, '13']) rejects(() => core.setLevel(p, 'workshop', n, db.names));
for (const n of [0, 42, 1.5]) rejects(() => core.setLevel(p, 'main', n, db.names));
core.setLevel(p, 'wall', 31, db.names);
equal(core.estimate(p, db.names, db.global, engines).state, 'invalidLevels');
core.setLevel(p, 'wall', 30, db.names);
equal(core.normalizeStock(''), ''); equal(core.normalizeStock('0'), '0');
equal(core.normalizeStock('1 234 567'), '1234567');
equal(core.normalizeStock('١٢٣٤'), '1234'); equal(core.normalizeStock('۱۲۳۴'), '1234');
for (const v of ['1.5', '1,5', '-1', 'NaN', '1e6', '1000000000000000']) equal(core.normalizeStock(v), null);
const plan = {total: [100, 100, 100, 100, 0], badges: 5};
equal(core.budget(plan, ['', '0', '50', '150', '', '5']).map(r => r.missing), [null, 100, 50, 0, 0, 0]);
const storage = mem(); ok(core.save(storage, d, db.names));
equal(core.load(storage, db.names).data, d);
const encoded = JSON.stringify(d); equal(core.parse(encoded, db.names), d);
for (const mutate of [
  x => {x.schema = 2;}, x => {x.format = 'other';}, x => {x.version = 'cn';},
  x => {x.profiles.global.target = 0;}, x => {x.profiles.global.target = 29;},
  x => {delete x.profiles.v3;}, x => {delete x.profiles.global.levels.wall;},
  x => {x.profiles.global.stock = [];}, x => {x.profiles.global.stock[0] = 1;},
  x => {x.profiles.global.stock[0] = '1e6';}, x => {x.profiles.global.levels.workshop = 12;},
  x => {x.profiles.global.levels.wall = '30';}
]) { const bad = plain(d); mutate(bad); rejects(() => core.parse(JSON.stringify(bad), db.names)); }
rejects(() => core.parse('x'.repeat(100001), db.names));
rejects(() => core.parse('null', db.names));
const old = mem(); old.setItem('aozCityCenter_v1', JSON.stringify({inventory: {global: ['123', '0'], v3: ['456']}, selections: {global: {building:'main', a:30, b:41}}, cityCache:{30:{wall:29}}}));
const migrated = core.load(old, db.names);
equal(migrated.data.profiles.global.stock, ['123', '0', '', '', '', '']);
equal(migrated.data.profiles.v3.stock[0], '456'); equal(migrated.data.profiles.global.levels.main, null);
equal(old.getItem(core.storageKey), null);
const corrupt = mem(); corrupt.setItem(core.storageKey, 'invalid');
equal(core.load(corrupt, db.names).state, 'loadError'); equal(corrupt.getItem(core.storageKey), 'invalid');
const denied = {getItem() {throw Error('denied');}, setItem() {throw Error('denied');}};
equal(core.load(denied, db.names).state, 'loadError'); equal(core.save(denied, d, db.names), false);
equal(core.save({getItem: () => null, setItem(){}}, d, db.names), false);
// Exercise every valid City Hall range against the shared engine and verify actual step costs.
let ranges = 0;
for (let a = 1; a <= 41; a++) for (let b = a; b <= 41; b++) {
  const profile = core.empty(db.names).profiles.global;
  core.setLevel(profile, 'main', a, db.names); profile.target = b;
  const estimate = core.estimate(profile, db.names, db.global, engines);
  equal(estimate.state, 'ready');
  const r = estimate.plan, sums = [0, 0, 0, 0, 0]; let badges = 0;
  for (const step of r.steps) {
    const row = db.global[step.k]?.[step.l];
    if (row && step.cost) {row.cost.forEach((n, i) => sums[i] += n); badges += row.badges || 0;}
    if (step.k === 'workshop') ok(step.l >= 13);
  }
  equal(r.total, sums); equal(r.badges, badges);
  equal(new Set(r.steps.map(x => x.k + ':' + x.l)).size, r.steps.length);
  equal(r.steps.filter(x => x.k === 'main').length, b - a);
  equal(core.budget(r, Array(6).fill('999999999999999')).every(x => x.missing === 0), true);
  equal(estimate.assumed.every(k => profile.levels[k] === null), true);
  ranges++;
}
const sample = core.empty(db.names).profiles.global; core.setLevel(sample, 'main', 30, db.names);
const actual = core.estimate(sample, db.names, db.global, engines);
equal(actual.plan.total, [156437890, 221090460, 56703180, 33611910, 49270]);
const upgraded = core.empty(db.names).profiles.global; core.setLevel(upgraded, 'main', 30, db.names);
for (const [k, n] of Object.entries(actual.plan.targets)) if (k !== 'main') upgraded.levels[k] = n;
const ready = core.estimate(upgraded, db.names, db.global, engines);
equal(ready.plan.steps.map(x => x.k), ['main']); equal(ready.assumed, []);
equal(ready.plan.total, db.global.main[31].cost);
const missing = plain(db.global); delete missing.main[31];
ok(core.estimate(sample, db.names, missing, engines).plan.missing.includes('main:31'));
const keys = Object.keys(words.ru).sort();
equal(Object.keys(words).sort(), ['ru','en','es','vi','ar','zh','hr','it'].sort());
for (const [lang, copy] of Object.entries(words)) {
  equal(Object.keys(copy).sort(), keys);
  for (const key of keys) ok(typeof copy[key] === 'string' && copy[key].trim().length > 0);
  if (lang !== 'en') ok(copy.saveError !== words.en.saveError);
}
console.log(JSON.stringify({checks, ranges, languages:Object.keys(words).length, buildings:Object.keys(db.names).length}));
