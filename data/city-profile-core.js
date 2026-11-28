/* Local city profiles. Game costs and prerequisites stay in the existing building engine. */
const CityProfile = (() => {
  'use strict';
  const storageKey = 'aozMyCity_v1';
  const games = ['global', 'v3'];
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const record = o => o !== null && typeof o === 'object' && !Array.isArray(o);
  function emptyProfile(meta) {
    return {levels: Object.fromEntries(Object.keys(meta).map(k => [k, null])), target: 1, stock: Array(6).fill('')};
  }
  function empty(meta) {
    return {format: 'aoz-city-profile', schema: 1, version: 'global', profiles: Object.fromEntries(games.map(g => [g, emptyProfile(meta)]))};
  }
  function validLevel(k, n, meta) {
    return own(meta, k) && Number.isInteger(n) && n >= (k === 'main' ? 1 : 0) && n <= meta[k].max && (k !== 'workshop' || n === 0 || n >= 13);
  }
  function validStock(n) { return typeof n === 'string' && /^(?:\d{1,15})?$/.test(n); }
  function validate(value, meta) {
    if (!record(value) || value.format !== 'aoz-city-profile' || value.schema !== 1 || !games.includes(value.version) || !record(value.profiles)) throw new Error('city-format');
    const out = empty(meta);
    out.version = value.version;
    for (const game of games) {
      const p = own(value.profiles, game) && value.profiles[game];
      if (!record(p) || !record(p.levels) || !Array.isArray(p.stock) || p.stock.length !== 6 || !p.stock.every(validStock) || !Number.isInteger(p.target) || p.target < 1 || p.target > meta.main.max) throw new Error('city-profile');
      for (const k of Object.keys(meta)) {
        if (!own(p.levels, k)) throw new Error('city-levels');
        const n = p.levels[k];
        if (n !== null && !validLevel(k, n, meta)) throw new Error('city-level');
        out.profiles[game].levels[k] = n;
      }
      if (p.levels.main !== null && p.target < p.levels.main) throw new Error('city-target');
      out.profiles[game].target = p.target;
      out.profiles[game].stock = [...p.stock];
    }
    return out;
  }
  function parse(text, meta) {
    if (typeof text !== 'string' || text.length > 100000) throw new Error('city-size');
    return validate(JSON.parse(text), meta);
  }
  function load(storage, meta) {
    const data = empty(meta);
    try {
      const raw = storage.getItem(storageKey);
      if (raw !== null) return {data: parse(raw, meta), state: 'saved'};
      // Only actual inventory entries are reused. A calculator range is not a city level.
      const legacy = JSON.parse(storage.getItem('aozCityCenter_v1') || 'null');
      for (const game of games) {
        const values = legacy?.inventory?.[game];
        if (Array.isArray(values)) data.profiles[game].stock = Array.from({length: 6}, (_, i) => validStock(values[i]) ? values[i] : '');
      }
      return {data, state: 'new'};
    } catch { return {data, state: 'loadError'}; }
  }
  function save(storage, data, meta) {
    try {
      const text = JSON.stringify(validate(data, meta));
      storage.setItem(storageKey, text);
      return storage.getItem(storageKey) === text;
    } catch { return false; }
  }
  function setLevel(profile, k, n, meta) {
    if (n !== null && !validLevel(k, n, meta)) throw new Error('city-level');
    if (!own(meta, k)) throw new Error('city-building');
    const wasUnknown = profile.levels.main === null;
    profile.levels[k] = n;
    if (k === 'main' && n !== null) profile.target = Math.max(profile.target, wasUnknown ? Math.min(meta.main.max, n + 1) : n);
  }
  function normalizeStock(value) {
    if (typeof value !== 'string') return null;
    const digits = value.replace(/[٠-٩۰-۹]/g, c => String(c.charCodeAt(0) - (c <= '٩' ? 1632 : 1776))).replace(/\s/g, '');
    return validStock(digits) ? digits : null;
  }
  function estimate(profile, meta, table, engines) {
    const hall = profile.levels.main;
    if (hall === null) return {state: 'needsHall'};
    const invalid = Object.keys(meta).filter(k => k !== 'main' && profile.levels[k] !== null && profile.levels[k] > hall);
    if (invalid.length) return {state: 'invalidLevels', invalid};
    const base = engines.floors(table, hall);
    const current = {...base, ...Object.fromEntries(Object.entries(profile.levels).filter(([, v]) => v !== null))};
    const plan = engines.cityPlan(table, hall, profile.target, current);
    const needed = Object.keys(plan.targets).filter(k => k !== 'main');
    const assumed = needed.filter(k => profile.levels[k] === null);
    const lower = needed.filter(k => profile.levels[k] !== null && profile.levels[k] < (base[k] || 0));
    return {state: 'ready', plan, current, assumed, lower, base};
  }
  function budget(plan, stock) {
    return [...plan.total, plan.badges].map((cost, i) => {
      const have = stock[i] === '' ? null : Number(stock[i]);
      return {cost, have, missing: cost === 0 ? 0 : have === null ? null : Math.max(0, cost - have)};
    });
  }
  return Object.freeze({storageKey, games, empty, validate, parse, load, save, setLevel, normalizeStock, estimate, budget});
})();
