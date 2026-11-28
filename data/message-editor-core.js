/* Exact UTF-16 budgets and independent, balanced message parts. No game requests. */
const AOZMessageCore = (() => {
  'use strict';
  const plain = Object.freeze({c: '', m: 0});
  const tags = ['B', 'I', 'U', 'S'];
  const modes = [
    {id:'private',limit:480,split:true,group:0},
    {id:'alliance',limit:480,split:true,group:0},
    {id:'nation',limit:480,split:true,group:0},
    {id:'group',limit:480,split:true,group:0},
    {id:'worldReply',limit:480,split:true,group:0},
    {id:'wall',limit:140,split:false,group:0},
    {id:'allianceCreation',limit:140,split:false,group:1},
    {id:'battle',limit:100,split:true,group:1},
    {id:'quickBattle',limit:65,split:false,group:1},
    {id:'worldNotice',limit:30,split:false,group:1}
  ];
  const symbolGroups = [
    ['⚔','♛','♚','♜','☠','★','☆','⚡','☢','☣'],
    ['✦','✧','❖','❀','❁','✿','❃','◆','◇','۞'],
    ['➤','➜','➣','➥','➳','➵','➽','«','»','↔'],
    ['╔','╗','╚','╝','═','║','┌','┐','└','┘','━','┃'],
    ['🔥','⚔️','💀','👑','🛡️','🚀','💎','❤️']
  ];
  const symbolSet = new Set(symbolGroups.flat());
  const segmenter = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined,{granularity:'grapheme'}) : null;
  function norm(s) {
    return s && typeof s.c === 'string' && /^(?:[0-9a-f]{8})?$/i.test(s.c) && Number.isInteger(s.m) && s.m >= 0 && s.m < 16 ? {c:s.c.toUpperCase(),m:s.m} : plain;
  }
  const same = (a,b) => a.c === b.c && a.m === b.m;
  function graphemes(text) {
    if (segmenter) return Array.from(segmenter.segment(text),x=>({s:x.segment,i:x.index}));
    // Conservative fallback: never cut inside a word when Unicode segmentation is absent.
    return Array.from(text.matchAll(/\r\n|\s|[^\s]+/gu),x=>({s:x[0],i:x.index}));
  }
  function runs(text,styles) {
    const out=[];
    for (const x of graphemes(text)) {
      const f=norm(styles[x.i]),last=out[out.length-1];
      if(last&&same(last.f,f))last.s+=x.s;else out.push({s:x.s,f});
    }
    return out;
  }
  function finish(f) {
    let out=f.c?'[-]':'';
    for(let j=3;j>=0;j--)if(f.m&(1<<j))out+='[/'+tags[j]+']';
    return out;
  }
  function transition(a,b) {
    if(a.m!==b.m) {
      let out=finish(a);
      for(let j=0;j<4;j++)if(b.m&(1<<j))out+='['+tags[j]+']';
      return out+(b.c?'['+b.c+']':'');
    }
    return a.c===b.c?'':(a.c?'[-]':'')+(b.c?'['+b.c+']':'');
  }
  function encodeRuns(values) {
    let out='',last=plain;
    for(const x of values){out+=transition(last,x.f)+x.s;last=x.f;}
    return out+finish(last);
  }
  const encode=(text,styles)=>encodeRuns(runs(text,styles));
  function parseCode(code) {
    const pieces=[],styles=[],colors=[],counts=[0,0,0,0];let offset=0;
    const pattern=/\[(?:\/?[BIUS]|[0-9a-f]{6}(?:[0-9a-f]{2})?|-)\]/gi;
    function append(s) {
      if(!s)return;
      const f={c:colors[colors.length-1]||'',m:counts.reduce((n,v,i)=>n|(v>0?1<<i:0),0)};
      pieces.push(s);for(let i=0;i<s.length;i++)styles.push(f);
    }
    for(const match of code.matchAll(pattern)) {
      append(code.slice(offset,match.index));
      const token=match[0].slice(1,-1).toUpperCase();
      if(token==='-')colors.pop();
      else if(/^[0-9A-F]{6}(?:[0-9A-F]{2})?$/.test(token))colors.push(token.length===6?token+'FF':token);
      else {const close=token[0]==='/',i=tags.indexOf(close?token.slice(1):token);counts[i]=Math.max(0,counts[i]+(close?-1:1));}
      offset=match.index+match[0].length;
    }
    append(code.slice(offset));
    return {text:pieces.join(''),styles};
  }
  function compile(text,styles) {
    const rr=runs(text,styles),code=encodeRuns(rr);
    if(!/\[(?:\/?[BIUS]|[0-9a-f]{6}(?:[0-9a-f]{2})?|-)\]/i.test(text))return {code,text,runs:rr};
    const parsed=parseCode(code);
    return {code,text:parsed.text,runs:codepointRuns(parsed.text,parsed.styles)};
  }
  function codepointRuns(text,styles) {
    const out=[];let offset=0;
    for(const s of text) {
      const f=norm(styles[offset]),last=out[out.length-1];
      if(last&&same(last.f,f))last.s+=s;else out.push({s,f});offset+=s.length;
    }
    return out;
  }
  function makeAtoms(text,styles) {
    const values=graphemes(text),out=[];
    for(const x of values) {
      const rr=codepointRuns(x.s,styles.slice(x.i,x.i+x.s.length));
      if(!rr.length)continue;
      let body=rr[0].s,last=rr[0].f;
      for(let j=1;j<rr.length;j++){body+=transition(last,rr[j].f)+rr[j].s;last=rr[j].f;}
      const end=x.i+x.s.length,tail=text.slice(Math.max(0,end-80),end);
      const rank=/\n[\t ]*\r?\n$/.test(tail)?3:/[\r\n]$/.test(x.s)?2:/\s$/u.test(x.s)?1:0;
      out.push({s:x.s,first:rr[0].f,last,body,rank});
    }
    // Bracketed user tokens are indivisible too, including unknown tags.
    const merged=[];
    for(let i=0;i<out.length;i++) {
      if(out[i].s==='[') {
        let end=i+1;while(end<out.length&&end-i<256&&out[end].s!==']'&&!/[\r\n]/.test(out[end].s))end++;
        if(end<out.length&&out[end].s===']') {
          let a={...out[i]};
          for(let j=i+1;j<=end;j++){a.body+=transition(a.last,out[j].first)+out[j].body;a.s+=out[j].s;a.last=out[j].last;}
          a.rank=out[end].rank;merged.push(a);i=end;continue;
        }
      }
      merged.push(out[i]);
    }
    return merged;
  }
  function splitCode(code,limit) {
    if(!Number.isInteger(limit)||limit<1)throw new RangeError('message limit');
    const parsed=parseCode(code),atoms=makeAtoms(parsed.text,parsed.styles),parts=[];let start=0;
    while(start<atoms.length) {
      let j=start,length=0,last=plain;const breaks=[0,0,0,0];
      while(j<atoms.length) {
        const a=atoms[j],next=length+transition(last,a.first).length+a.body.length;
        if(next+finish(a.last).length>limit)break;
        length=next;last=a.last;j++;if(a.rank)breaks[a.rank]=j;
      }
      if(j===start)return {parts:[],error:'atomTooLarge'};
      const end=j===atoms.length?j:(breaks[3]||breaks[2]||breaks[1]||j);
      let body='',visible='',style=plain;
      for(let k=start;k<end;k++){const a=atoms[k];body+=transition(style,a.first)+a.body;style=a.last;visible+=a.s;}
      body+=finish(style);
      if(body.length>limit)throw new Error('message budget mismatch');
      parts.push({code:body,text:visible,length:body.length});start=end;
    }
    return {parts,error:null};
  }
  function cleanSymbols(values,max) {
    return Array.isArray(values)?[...new Set(values.filter(x=>symbolSet.has(x)))].slice(0,max):[];
  }
  function extraState(value) {
    const e=value&&typeof value==='object'?value:{};
    return {destination:modes.some(m=>m.id===e.destination)?e.destination:'private',symbolCategory:Number.isInteger(e.symbolCategory)&&e.symbolCategory>=0&&e.symbolCategory<7?e.symbolCategory:2,
      symbolFavorites:cleanSymbols(e.symbolFavorites,50),recentSymbols:cleanSymbols(e.recentSymbols,20)};
  }
  function insertionRange(text,a,b) {
    a=Math.max(0,Math.min(text.length,a||0));b=Math.max(a,Math.min(text.length,b??a));
    for(const g of graphemes(text)) {
      const end=g.i+g.s.length;
      if(a===b&&g.i<a&&end>a){a=b=end;break;}
      if(g.i<a&&end>a)a=g.i;
      if(g.i<b&&end>b)b=end;
    }
    for(const tag of text.matchAll(/\[[^\]\r\n]*\]/g)) {
      const end=tag.index+tag[0].length;
      if(a===b&&tag.index<a&&end>a){a=b=end;break;}
      if(tag.index<a&&end>a)a=tag.index;
      if(tag.index<b&&end>b)b=end;
    }
    return [a,b];
  }
  return Object.freeze({plain,norm,same,modes,symbolGroups,graphemes,runs,encode,parseCode,compile,splitCode,extraState,insertionRange});
})();
