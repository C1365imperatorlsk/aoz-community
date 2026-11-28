'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'data/language-picker.js'), 'utf8');
const initial = html.slice(html.indexOf('const hubSupportedLanguages='), html.indexOf("$('lang').value=hubInitialLanguage();"));
const codes = ['ru','en','es','vi','ar','zh','hr','it'];
const names = ['Русский','English','Español','Tiếng Việt','العربية','繁體中文','Hrvatski','Italiano'];
const titles = ['Язык приложения','App language','Idioma de la aplicación','Ngôn ngữ ứng dụng','لغة التطبيق','應用程式語言','Jezik aplikacije','Lingua dell’app'];
let checks = 0;
const equal = (a,b) => {assert.deepEqual(a,b);checks++;};
const ok = value => {assert.ok(value);checks++;};
class Element {
  constructor(tag) {
    this.tag = tag; this.children = []; this.dataset = {}; this.attrs = {}; this.listeners = {};
    this.className = ''; this.style = {setProperty(k,v){this[k]=v;}}; this.inert = false;
    this.classList = {add: c => {if(!this.className.split(' ').includes(c))this.className += ' '+c;},remove: c => {this.className=this.className.split(' ').filter(x=>x!==c).join(' ');}};
  }
  append(...children) {for(const c of children){c.parent=this;this.children.push(c);}}
  setAttribute(k,v) {this.attrs[k]=String(v);}
  getAttribute(k) {return this.attrs[k]??null;}
  closest(tag) {let n=this;while(n){if(n.tag===tag)return n;n=n.parent;}return null;}
  addEventListener(type,fn) {(this.listeners[type]??=[]).push(fn);}
  dispatchEvent(e) {e.target??=this;this['on'+e.type]?.(e);for(const fn of this.listeners[e.type]||[])fn(e);return true;}
  focus() {this.doc.activeElement=this;}
  scrollIntoView() {this.scrolled=true;}
}
function environment(code='en',reduce=false) {
  const doc={activeElement:null};
  doc.createElement=tag=>{const e=new Element(tag);e.doc=doc;return e;};
  doc.createElementNS=(_,tag)=>doc.createElement(tag);
  doc.body=doc.createElement('body');const main=doc.createElement('main'),header=doc.createElement('header'),host=doc.createElement('div'),state=doc.createElement('input');
  doc.body.append(main);main.append(header);header.append(host,state);doc.querySelector=tag=>tag==='main'?main:null;
  state.id='lang';state.type='hidden';state.value=code;
  const stored=new Map(),changes=[];state.onchange=()=>{stored.set('aozHubManualLang',state.value);stored.set('aozHubLang',state.value);changes.push(state.value);doc.direction=state.value==='ar'?'rtl':'ltr';};
  let id=0;const frames=new Map(),timers=new Map();
  const win={innerHeight:568,visualViewport:{height:568,addEventListener(){}},addEventListener(){},matchMedia:()=>({matches:reduce}),Event:class{constructor(type,options){this.type=type;Object.assign(this,options);}},
    requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:i=>frames.delete(i),
    setTimeout:(fn,delay)=>{timers.set(++id,{fn,delay});return id;},clearTimeout:i=>timers.delete(i)};
  const context=vm.createContext({document:doc,window:win});vm.runInContext(source,context);
  const api=vm.runInContext('HubLanguagePicker',context).install({host,state,document:doc,window:win});
  const walk=n=>[n,...n.children.flatMap(walk)],all=()=>walk(doc.body),get=cls=>all().find(e=>e.className.split(' ').includes(cls));
  const flushFrames=()=>{const values=[...frames.values()];frames.clear();values.forEach(fn=>fn());};
  const flushTimers=()=>{const values=[...timers.values()];timers.clear();values.forEach(v=>v.fn());};
  const options=all().filter(e=>e.attrs.role==='option');
  return {doc,main,host,state,api,stored,changes,win,all,get,options,frames,timers,flushFrames,flushTimers};
}
const event=(type,more={})=>({type,preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;},...more});
for(let i=0;i<codes.length;i++) {
  const e=environment(codes[i]),trigger=e.get('hlpTrigger'),overlay=e.get('hlpOverlay'),panel=e.get('hlpPanel');
  equal(e.get('hlpCurrent').textContent,names[i]);equal(e.options.map(x=>x.children[0].textContent),names);
  equal(e.options.filter(x=>x.getAttribute('aria-selected')==='true').length,1);equal(e.options[i].getAttribute('aria-selected'),'true');
  equal(e.changes.length,0);equal(e.stored.size,0);equal(overlay.hidden,true);
  e.doc.body.style.overflow='auto';trigger.onclick();e.flushFrames();
  equal(overlay.hidden,false);equal(trigger.getAttribute('aria-expanded'),'true');equal(e.main.inert,true);equal(e.doc.body.style.overflow,'hidden');
  equal(e.doc.activeElement,e.options[i]);equal(panel.dir,codes[i]==='ar'?'rtl':'ltr');equal(e.get('hlpHeading').children[1].textContent,titles[i]);
  overlay.dispatchEvent(event('click',{target:panel}));equal(trigger.getAttribute('aria-expanded'),'true');
  const next=(i+1)%8;e.options[next].onclick();
  equal(e.state.value,codes[next]);equal(e.changes,[codes[next]]);equal(e.stored.get('aozHubManualLang'),codes[next]);equal(e.stored.get('aozHubLang'),codes[next]);
  equal(e.doc.direction,codes[next]==='ar'?'rtl':'ltr');equal(trigger.getAttribute('aria-expanded'),'false');equal(e.main.inert,false);equal(e.doc.body.style.overflow,'auto');equal(e.doc.activeElement,trigger);
  e.flushTimers();equal(overlay.hidden,true);
  trigger.onclick();overlay.dispatchEvent(event('click',{target:overlay}));e.flushTimers();equal(overlay.hidden,true);
}
{
  const e=environment(),overlay=e.get('hlpOverlay'),trigger=e.get('hlpTrigger');
  trigger.dispatchEvent(event('keydown',{key:'ArrowDown'}));equal(trigger.getAttribute('aria-expanded'),'true');
  overlay.dispatchEvent(event('keydown',{key:'End'}));equal(e.doc.activeElement,e.options[7]);
  overlay.dispatchEvent(event('keydown',{key:'ArrowDown'}));equal(e.doc.activeElement,e.options[0]);
  overlay.dispatchEvent(event('keydown',{key:'ArrowUp'}));equal(e.doc.activeElement,e.options[7]);
  overlay.dispatchEvent(event('keydown',{key:'Home'}));equal(e.doc.activeElement,e.options[0]);equal(e.state.value,'en');
  overlay.dispatchEvent(event('keydown',{key:'Tab'}));equal(e.doc.activeElement,e.get('hlpClose'));
  overlay.dispatchEvent(event('keydown',{key:'Tab',shiftKey:true}));equal(e.doc.activeElement,e.options[0]);
  const esc=event('keydown',{key:'Escape'});overlay.dispatchEvent(esc);ok(esc.prevented&&esc.stopped);equal(e.doc.activeElement,trigger);e.flushFrames();equal(overlay.className.includes('is-open'),false);
  e.api.open();e.flushTimers();equal(overlay.hidden,false);e.flushFrames();ok(overlay.className.includes('is-open'));
  e.api.close();e.api.close();e.flushTimers();equal(overlay.hidden,true);equal(e.main.inert,false);
}
{
  const e=environment('ar',true);e.api.open();e.api.close();equal([...e.timers.values()][0].delay,0);e.flushTimers();equal(e.get('hlpOverlay').hidden,true);
  const f=environment();f.main.inert=true;f.api.open();f.api.close();equal(f.main.inert,true);
}
// Actual unchanged preference and auto-detection functions, including storage denial.
const ctx=vm.createContext({});vm.runInContext(initial,ctx);const pick=vm.runInContext('hubPickLanguage',ctx);
for(const code of codes){equal(pick('', '',code==='zh'?'zh-Hant':code+'-XX',['en-US']),code);equal(pick(code,'','en',['en']),code);}
equal(pick('ru','it','ar',['en']),'ru');equal(pick('bad','','it-IT',['ru']),'it');
equal(pick('', 'ru','zh-Hant',['ru']),'zh');equal(pick('', '', 'zh-CN',['ru']),'en');
equal(pick('', '', '', ['de-DE','vi-VN']),'vi');equal(pick('', '', '', []),'en');
for(const tag of ['zh-TW','zh-HK','zh-Hant-TW','zh-MO'])equal(pick('','',tag,[]),'zh');
const denied=vm.createContext({localStorage:{getItem(){throw Error('denied');}},window:{},navigator:{language:'hr-HR',languages:['it-IT']}});
vm.runInContext(initial,denied);equal(vm.runInContext('hubInitialLanguage()',denied),'hr');
ok(!/<select[^>]*\bid=["']lang["']/.test(html));ok(/<input type="hidden" id="lang"/.test(html));
console.log(JSON.stringify({checks,languages:codes.length,keyboard:'passed',legacyChangePipeline:'passed',autoDetection:'passed'}));
