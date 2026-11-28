'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'data/message-editor-core.js'),'utf8');
const context=vm.createContext({});vm.runInContext(source+'\n'+fs.readFileSync(path.join(root,'data/message-editor-locales.js'),'utf8'),context);
const C=vm.runInContext('AOZMessageCore',context),words=vm.runInContext('AOZEditorExtrasWords',context),plain=x=>JSON.parse(JSON.stringify(x));let checks=0,cases=0;
const eq=(a,b)=>{assert.deepEqual(plain(a),plain(b));checks++;},ok=v=>{assert.ok(v);checks++;};
function balanced(code){const stack=[];for(const m of code.matchAll(/\[(\/?[BIUS]|[0-9A-F]{8}|-)\]/g)){const t=m[1];if(t==='-'){assert.equal(stack.pop(),'color');}else if(t[0]==='/'){assert.equal(stack.pop(),t.slice(1));}else stack.push(/^[0-9A-F]{8}$/.test(t)?'color':t);}assert.equal(stack.length,0);checks++;}
function verify(code,limit){const original=C.parseCode(code),result=C.splitCode(code,limit);eq(result.error,null);eq(result.parts.map(p=>p.text).join(''),original.text);let offset=0;for(const part of result.parts){ok(part.code.length<=limit);eq(part.length,part.code.length);balanced(part.code);const parsed=C.parseCode(part.code);eq(parsed.text,part.text);eq(parsed.styles,original.styles.slice(offset,offset+part.text.length));offset+=part.text.length;}eq(offset,original.text.length);cases++;return result;}
for(const [s,n] of [['A',1],['Я',1],['中',1],['ع',1],['🔥',2],['❤️',2],['👨‍👩‍👧‍👦',11],['[B]',3],['[/B]',4]])eq(s.length,n);
for(const n of [479,480,481,139,140,141]){const text='Я'.repeat(n),code=C.encode(text,Array(n).fill(C.plain));eq(code.length,n);const limit=n>200?480:140,result=verify(code,limit);eq(result.parts.length,Math.ceil(n/limit));}
eq(C.modes.map(m=>m.limit),[480,480,480,480,480,140,140,100,65,30]);
eq(C.modes.filter(m=>m.split).map(m=>m.id),['private','alliance','nation','group','worldReply','battle']);
eq(C.symbolGroups.map(a=>a.length),[10,10,10,12,8]);eq(C.symbolGroups.flat().length,50);eq(new Set(C.symbolGroups.flat()).size,50);
for(const s of ['👨‍👩‍👧‍👦','❤️','🛡️','🇨🇳','👍🏽','1️⃣','e\u0301','क्‍ष'])eq(C.graphemes(s).length,1);
for(let mask=0;mask<16;mask++)for(const limit of [65,100,480]){
 const text=('Привет hello 中文 العربية 🔥 ❤️ 👨‍👩‍👧‍👦\n').repeat(20),styles=Array.from({length:text.length},()=>({m:mask,c:'1255AA88'}));
 const code=C.encode(text,styles);balanced(code);verify(code,limit);
}
const ui=fs.readFileSync(path.join(root,'data/message-editor.js'),'utf8');
const gradient=ui.split('\n').find(l=>l.startsWith('function gradient('));
vm.runInContext('const norm=AOZMessageCore.norm,graphemes=AOZMessageCore.graphemes;\n'+gradient,context);
const grad=vm.runInContext('gradient',context),text=('Радуга 🌈 семейство 👨‍👩‍👧‍👦 中文 العربية\n\n').repeat(35),styles=grad(text,Array(text.length).fill(C.plain),0,text.length,['A00000','00566F','702080'],'FF');
const compiled=C.compile(text,styles);eq(compiled.text,text);eq(compiled.code,C.encode(text,styles));verify(compiled.code,480);verify(compiled.code,100);
const family='👨‍👩‍👧‍👦';for(const limit of [11,12,13,20,30]){const code=C.encode(family.repeat(20),Array(family.length*20).fill(C.plain));const r=verify(code,limit);ok(r.parts.every(p=>p.text.length%11===0));}
const paragraphs='Первый абзац.\n\nВторой абзац длиннее первого.\nПоследняя строка.';
const p=verify(paragraphs,25);ok(p.parts[0].text.endsWith('\n\n'));
verify('[B][FF0000]Красный ❤️[-] [I]наклон[/I][/B]\n'.repeat(30),100);
verify('[B][I][U][S]🔥 中文 العربية[/S][/U][/I][/B]'.repeat(40),65);
const raw=C.compile('[B]Привет[/B] [00FF00]мир[-]',Array(34).fill(C.plain));eq(raw.text,'Привет мир');
const tag=verify('a [CUSTOM_NAME] b '.repeat(20),30);ok(tag.parts.every(p=>!p.text.includes('[CUSTOM_')||p.text.includes('[CUSTOM_NAME]')));
eq(C.splitCode(family,10).error,'atomTooLarge');eq(C.splitCode('',480).parts,[]);
eq(C.insertionRange('A'+family+'B',3,3),[12,12]);eq(C.insertionRange('A'+family+'B',2,4),[1,12]);eq(C.insertionRange('x[B]y',3,3),[4,4]);
eq(C.extraState({destination:'bad',symbolFavorites:['🔥','🔥','[sticker:1]'],recentSymbols:['❤️','bad']}).symbolFavorites,['🔥']);
let seed=42;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed;};const alphabet=['a','Я','中','ع','🔥','❤️','👨‍👩‍👧‍👦','e\u0301',' ','\n','🇨🇳','👍🏽'];
for(let n=0;n<45;n++){const parts=Array.from({length:80+rnd()%180},()=>alphabet[rnd()%alphabet.length]),text=parts.join(''),s=[];for(const g of C.graphemes(text)){const f={m:rnd()%16,c:rnd()%3?'':'33AA77FF'};for(let i=0;i<g.s.length;i++)s.push(f);}verify(C.encode(text,s),[65,100,140,480][n%4]);}
const keys=Object.keys(words.ru).sort();eq(Object.keys(words).sort(),['ar','en','es','hr','it','ru','vi','zh']);
for(const [lang,w] of Object.entries(words)){eq(Object.keys(w).sort(),keys);eq(w.destinations.length,10);eq(w.symbolCategories.length,7);eq(w.templates.length,8);for(const [k,v] of Object.entries(w))if(typeof v==='string')ok(v.trim().length>0);for(const [name,body] of w.templates){ok(name.length>0);ok(body===null||body.length>0);}if(lang!=='en')ok(w.single!==words.en.single);}
const fallback=vm.createContext({Intl:{}});vm.runInContext(source,fallback);const F=vm.runInContext('AOZMessageCore',fallback);eq(F.splitCode(family.repeat(5),12).error,'atomTooLarge');
const long=('Long Привет 中 عرب 🔥 family 👨‍👩‍👧‍👦\n').repeat(500),t0=performance.now(),longCode=C.encode(long,Array(long.length).fill(C.plain)),longParts=C.splitCode(longCode,480);ok(!longParts.error);eq(longParts.parts.map(p=>p.text).join(''),long);const elapsed=Math.round(performance.now()-t0);ok(elapsed<5000);
console.log(JSON.stringify({checks,splitCases:cases,performance:{units:long.length,parts:longParts.parts.length,milliseconds:elapsed},languages:Object.keys(words).length}));
