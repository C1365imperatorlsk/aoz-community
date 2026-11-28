function installMessageEditorTools(api) {
  'use strict';
  const {root,E,language,legacy,getState,changed,insert,builtin,simplify,copy} = api;
  const C=AOZMessageCore,w=()=>AOZEditorExtrasWords[language()]||AOZEditorExtrasWords.en;
  const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  const btn=(text,fn,cls='edSmall')=>{const b=node('button',cls,text);b.type='button';b.onclick=fn;return b;};
  const mode=()=>C.modes.find(m=>m.id===getState().extra.destination)||C.modes[0];
  const destination=node('details','edxDestination'),summary=node('summary'),destTitle=node('span','edxDestLabel'),destName=node('strong'),badge=node('span','edxBadge'),destList=node('div','edxDestList');
  destination.id='edDestination';summary.append(destTitle,destName,badge);destination.append(summary,destList);E('Text').previousElementSibling.before(destination);
  const symbols=node('details','edxSymbols'),symbolSummary=node('summary'),symbolTabs=node('div','edxChips'),symbolNote=node('p','edNote'),symbolGrid=node('div','edxSymbolsGrid');
  symbols.id='edSymbols';symbolTabs.setAttribute('role','group');symbols.append(symbolSummary,symbolTabs,symbolGrid,symbolNote);E('Toolbar').after(symbols);
  const splitButton=btn('',()=>splitNow(),'edSmall edxSplitAction'),singleNote=node('p','edWarn'),partsBox=node('div','edxParts');
  splitButton.id='edSplit';singleNote.id='edSingleWarning';partsBox.id='edParts';E('Copy').after(splitButton,singleNote,partsBox);
  const simplifyBox=node('details','edxSimplify'),simplifyTitle=node('summary'),simplifyHint=node('p','edNote');
  simplifyBox.append(simplifyTitle,simplifyHint,btn('↘',simplify));E('Optimized').after(simplifyBox);simplifyBox.lastChild?.setAttribute('aria-label',w().simplify);
  const originalNote=root.querySelector('[data-ed="29"]');originalNote.removeAttribute('data-ed');originalNote.hidden=true;
  E('Over').removeAttribute('data-ed');
  let lastCode='',cached=null,shown=0,requestCode='';
  function modeLabel(m) {return w().destinations[C.modes.indexOf(m)];}
  function renderDestination() {
    const s=getState(),m=mode(),words=w();
    destTitle.textContent=words.destination;destName.textContent=modeLabel(m);badge.textContent=String(m.limit);
    destList.replaceChildren();
    for(const group of [0,1]) {
      const wrap=group===1?node('details','edxSpecial'):node('div');
      wrap.append(node(group===1?'summary':'h4','',words[group===1?'special':'main']));
      const choices=node('div','edxDestChoices');
      for(const candidate of C.modes.filter(m=>m.group===group)) {
        const b=btn('',()=>{s.extra.destination=candidate.id;destination.open=false;changed();});b.dataset.destination=candidate.id;b.setAttribute('aria-pressed',String(candidate.id===m.id));
        b.append(node('span','',modeLabel(candidate)),node('strong','',String(candidate.limit)));choices.append(b);
      }
      wrap.append(choices);destList.append(wrap);
    }
    destList.append(node('p','edNote',words.limitsNote),node('p','edNote',words.unknownLimits));
  }
  function renderSymbols() {
    const words=w(),e=getState().extra,index=e.symbolCategory;
    symbolSummary.textContent=words.symbols;symbolNote.textContent=words.symbolNote;symbolTabs.replaceChildren();symbolGrid.replaceChildren();
    symbolTabs.setAttribute('aria-label',words.symbols);
    words.symbolCategories.forEach((label,i)=>{const b=btn(label,()=>{e.symbolCategory=i;api.save();renderSymbols();});b.dataset.symbolCategory=String(i);b.setAttribute('aria-pressed',String(i===index));symbolTabs.append(b);});
    const values=index===0?e.recentSymbols:index===1?e.symbolFavorites:C.symbolGroups[index-2];
    if(!values.length){symbolGrid.append(node('p','edNote edxEmpty',words[index===0?'emptyRecent':'emptyFavorite']));return;}
    for(const symbol of values) {
      const cell=node('div','edxSymbolCell'),add=btn(symbol,()=>{insert(symbol);e.recentSymbols=[symbol,...e.recentSymbols.filter(x=>x!==symbol)].slice(0,20);api.save();renderSymbols();},'edxSymbolInsert');
      add.dataset.symbol=symbol;add.setAttribute('aria-label',words.insert+': '+symbol);
      const isFavorite=e.symbolFavorites.includes(symbol),fav=btn(isFavorite?'★':'☆',()=>{e.symbolFavorites=isFavorite?e.symbolFavorites.filter(x=>x!==symbol):[...e.symbolFavorites,symbol];api.save();renderSymbols();},'edxSymbolFavorite');
      fav.dataset.symbolFavorite=symbol;fav.setAttribute('aria-pressed',String(isFavorite));fav.setAttribute('aria-label',words[isFavorite?'unfavorite':'favorite']+': '+symbol);
      cell.append(add,fav);symbolGrid.append(cell);
    }
  }
  function renderParts() {
    partsBox.replaceChildren();if(!cached)return;
    const words=w();
    if(cached.error){partsBox.append(node('p','edWarn',words.splitError));return;}
    const title=node('h3','edSectionTitle',words.splitTitle+' · '+cached.parts.length);partsBox.append(title,node('p','edNote',words.splitHint));
    const limit=mode().limit,total=cached.parts.length;
    for(let i=0;i<Math.min(shown,total);i++) {
      const part=cached.parts[i],card=node('div','edxPart'),heading=node('div','edxPartHeading'),area=node('textarea','edOutput');
      card.dataset.part=String(i+1);heading.append(node('strong','',words.part.replace('{n}',String(i+1)).replace('{total}',String(total))),node('span','',part.length+' / '+limit));
      area.value=part.code;area.readOnly=true;area.rows=2;area.dir='auto';area.spellcheck=false;area.setAttribute('aria-label',words.part.replace('{n}',String(i+1)).replace('{total}',String(total)));
      const b=btn(words.copyPart,()=>copy(part.code,area));b.dataset.copyPart=String(i+1);card.append(heading,area,b);partsBox.append(card);
    }
    if(shown<total)partsBox.append(btn(words.more,()=>{shown+=20;renderParts();}));
  }
  function splitNow() {
    if(!mode().split)return;
    if(requestCode!==lastCode||!cached){cached={...C.splitCode(lastCode,mode().limit),limit:mode().limit};requestCode=lastCode;}
    shown=Math.min(20,cached.parts.length);renderParts();
  }
  function update(compiled) {
    const words=w(),m=mode(),used=compiled.code.length,over=used>m.limit;
    if(lastCode!==compiled.code||cached?.limit!==m.limit){cached=null;partsBox.replaceChildren();}
    lastCode=compiled.code;
    E('Count').replaceChildren();
    for(const [label,value] of [[words.visible,compiled.text.length],[words.used,used+' / '+m.limit],[words.left,m.limit-used]]) {
      const cell=node('span','edxStat');cell.append(node('span','',label),node('strong','',String(value)));E('Count').append(cell);
    }
    const level=over?'over':used>=m.limit*.85?'near':'normal';
    E('Count').dataset.budget=level;E('Budget').dataset.budget=level;
    E('Budget').setAttribute('aria-label',words.budget);E('Budget').setAttribute('aria-valuemax',String(m.limit));E('Budget').setAttribute('aria-valuenow',String(Math.min(m.limit,used)));E('Budget').setAttribute('aria-valuetext',used+' / '+m.limit);
    E('Budget').classList.toggle('over',over);E('BudgetFill').style.width=Math.min(100,used/m.limit*100)+'%';
    E('Over').hidden=!over;E('Over').textContent=m.split?legacy()[63]:words.single;
    E('Copy').disabled=!compiled.text||over;
    splitButton.hidden=!over||!m.split;splitButton.textContent=words.split;
    singleNote.hidden=true;
    simplifyBox.hidden=!over||getState().text.length>m.limit;simplifyTitle.textContent=words.simplify;simplifyHint.textContent=words.simplifyHint;
    simplifyBox.lastChild.textContent=words.simplify;
    renderDestination();if(cached)renderParts();
  }
  function localize() {
    E('Builtins').replaceChildren();w().templates.forEach(([name],i)=>E('Builtins').append(btn(name,()=>builtin(i))));
    renderDestination();renderSymbols();renderParts();
  }
  function builtinText(i) {return w().templates[i]?.[1]??legacy()[{0:51,1:52,3:53}[i]??51];}
  return Object.freeze({update,localize,builtinText,renderSymbols,mode});
}
