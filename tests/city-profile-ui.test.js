'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const db = JSON.parse(html.match(/^const db=(.*);$/m)[1]);
class Element {
  constructor(tag) { this.tag = tag; this.children = []; this.dataset = {}; this.attributes = {}; this._text = ''; }
  set textContent(v) { this._text = String(v); this.children = []; }
  get textContent() { return this._text + this.children.filter(c => !c.hidden).map(c => c.textContent).join(' '); }
  append(...items) { this.children.push(...items); }
  add(item) { this.children.push(item); }
  setAttribute(k, v) { this.attributes[k] = v; }
  replaceChildren(...items) { this._text = ''; this.children = items; }
}
const context = vm.createContext({document: {createElement: tag => new Element(tag)}, Option: function(text, value) {const e = new Element('option'); e.textContent = text; e.value = value; return e;}});
vm.runInContext(['core', 'locales', 'ui'].map(n => fs.readFileSync(path.join(root, 'data/city-profile-' + n + '.js'), 'utf8')).join('\n'), context);
const {core, ui, words} = vm.runInContext('({core:CityProfile,ui:CityProfileUI,words:cityProfileWords})', context);
let screens = 0;
for (const code of Object.keys(words)) for (const incomplete of [false, true]) {
  const data = core.empty(db.names); data.profiles.global.levels.main = 30; data.profiles.global.target = 31;
  data.profiles.global.stock = Array(6).fill('999999999999999');
  const store = new Map([[core.storageKey, JSON.stringify(data)]]), container = new Element('div');
  ui.install({root:container, meta:db.names, table:db.global, engines: {
    floors: () => ({}), cityPlan: () => ({total: [100,0,0,0,0], badges:0, steps:[{k:'main',l:31}], targets:{main:31}, missing:incomplete?['main:31']:[], cycles:[], review:[]})
  }, lang:()=>code, buildingName:k=>db.names[k][code]||db.names[k].en, resourceNames:()=>['food','oil','steel','minerals','uranium','badges'], fmt:String,
  storage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}});
  const all = [];
  function walk(el) {all.push(el); for (const child of el.children) walk(child);}
  walk(container);
  const result = all.find(el => el.className === 'cpResult').textContent;
  assert.ok(result.includes(words[code].title) === false);
  if (incomplete) {
    assert.ok(result.includes(words[code].partial));
    assert.ok(result.includes(words[code].unknownTotal));
    assert.ok(!result.includes(words[code].enough));
    assert.ok(result.includes('≥ 100'));
  } else {
    assert.ok(!result.includes(words[code].partial));
    assert.ok(result.includes(words[code].enough));
  }
  assert.equal(all.filter(el=>el.tag==='input').length,7);
  screens++;
}
console.log(JSON.stringify({screens,languages:Object.keys(words).length,partialTotals:'no false sufficient result'}));
