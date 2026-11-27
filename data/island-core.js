/* Island calculation primitives. Configuration indexes, not player-visible level numbers.
   Player-visible level = configuration index + 1. Percent effects use tenths. */
const IslandCore=(()=>{
 const checked=(n,min,max)=>{if(!Number.isInteger(n)||n<min||n>max)throw new RangeError('Level out of bounds');return n};
 const range=(rows,from,to)=>{checked(from,-1,rows.length-1);checked(to,from,rows.length-1)};
 const pairs=(xs=[])=>{const out={};for(let i=0;i<xs.length;i+=2)out[xs[i]]=xs[i+1];return out};
 const add=(target,entries)=>{for(const [k,v] of Object.entries(entries))target[k]=(target[k]||0)+v;return target};
 const cost=(rows)=>rows.reduce((m,r)=>{for(const c of r.c||[])m[c.t]=(m[c.t]||0)+c.c;return m},{});
 const dockAt=(rows,n)=>{checked(n,-1,rows.length-1);const normal={},extra={};for(const r of rows.slice(0,n+1)){Object.assign(normal,pairs(r.e));add(extra,pairs(r.e1))}return {normal,extra,power:n<0?0:rows[n].p,luxury:n<0?0:rows[n].l}};
 const dock=(rows,from,to)=>{range(rows,from,to);return {cost:cost(rows.slice(from+1,to+1)),before:dockAt(rows,from),after:dockAt(rows,to),steps:rows.slice(from+1,to+1).map(r=>({index:r.lv,cost:cost([r]),unlock:r.ul||null,requirement:r.nl,requiredRank:r.r_l}))}};
 const rawAt=(rows,n)=>{checked(n,-1,rows.length-1);const r=rows[n];return {power:r?.p||0,luxury:r?.l||0,base:pairs(r?.e),extra:pairs(r?.e1),special:pairs(r?.e2)}};
 const landAt=(item,n)=>{const a=rawAt(item.rows,n);a.extra={};for(const r of item.rows.slice(0,n+1))add(a.extra,pairs(r.e1));return a};
 const land=(item,from,to)=>{const rows=item.rows; if(item.type!=='land')throw new TypeError('Not land');checked(from,0,rows.length-1);checked(to,from,rows.length-1);return {copies:rows.slice(from,to).reduce((a,r)=>a+r.c,0),before:landAt(item,from),after:landAt(item,to),steps:rows.slice(from,to).map(r=>({from:r.lv,to:r.lv+1,copies:r.c}))}};
 const sea=(item,from,to)=>{const rows=item.rows;if(item.type!=='sea')throw new TypeError('Not sea');range(rows,from,to);return {cost:cost(rows.slice(from+1,to+1)),before:rawAt(rows,from),after:rawAt(rows,to),steps:rows.slice(from+1,to+1).map(r=>({index:r.lv,cost:cost([r])}))}};
 const setMembers=(items,set)=>items.filter(x=>x.set===set);
 const setAt=(items,set,levels)=>{const members=setMembers(items,set);if(members.length!==5)throw new RangeError('Set');const owner=members.find(x=>x.setRows.length);const level=Math.min(...members.map(x=>checked(levels[x.id]??-1,-1,x.rows.length-1)));return {level,effects:level<0?{}:pairs(owner.setRows[level].e)} };
 const dockRequirements=(D,gid,n)=>{const rows=D.dock[gid];checked(n,-1,rows.length-1);if(n<0)return {};const ids=Object.keys(D.dock).map(Number),main=ids[0];if(+gid===main){const need=Math.max(-1,...rows.slice(0,n+1).map(r=>r.nl));return need<0?{}:Object.fromEntries(ids.slice(1).map(id=>[id,need]));}const unlock=D.dock[main].find(r=>r.ul===+gid);return {[main]:Math.max(unlock?.lv??-1,n>=9?9:-1)}};
 const dockPlan=(D,from,to)=>{const ids=Object.keys(D.dock).map(Number),out={cost:{},before:{normal:{},extra:{},power:0,luxury:0},after:{normal:{},extra:{},power:0,luxury:0},requirements:[]};for(const id of ids){const a=from[id]??-1,b=to[id]??-1,v=dock(D.dock[id],a,b);add(out.cost,v.cost);for(const k of ['before','after']){add(out[k].normal,v[k].normal);add(out[k].extra,v[k].extra);out[k].power+=v[k].power;out[k].luxury+=v[k].luxury}for(const [required,lv] of Object.entries(dockRequirements(D,id,b)))if((to[required]??-1)<lv)out.requirements.push({id,required:+required,level:lv});}for(const k of ['before','after']){const e=out[k].extra;out[k].electro={chance:e[50397452]>0?25+(e[50397455]||0)/10:0,damage:(e[50397452]||0)/10};delete e[50397452];delete e[50397455]}return out};
 const effectNumber=(id,v)=>((Number(id)>>>16)&255)===1?v/10:v;
 const isPercent=id=>((Number(id)>>>16)&255)===1;
 return Object.freeze({dock,dockAt,land,sea,rawAt,landAt,setMembers,setAt,dockRequirements,dockPlan,effectNumber,isPercent});
})();
if(typeof module!=="undefined")module.exports=IslandCore;
