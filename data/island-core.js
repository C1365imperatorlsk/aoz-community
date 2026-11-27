/* Island calculation primitives. Configuration indexes, not player-visible level numbers.
   No unit conversion or unverified aggregate set/sea effects are inferred here. */
const IslandCore=(()=>{
 const checked=(n,min,max)=>{if(!Number.isInteger(n)||n<min||n>max)throw new RangeError('Level out of bounds');return n};
 const range=(rows,from,to)=>{checked(from,-1,rows.length-1);checked(to,from,rows.length-1)};
 const pairs=(xs=[])=>{const out={};for(let i=0;i<xs.length;i+=2)out[xs[i]]=xs[i+1];return out};
 const add=(target,entries)=>{for(const [k,v] of Object.entries(entries))target[k]=(target[k]||0)+v;return target};
 const cost=(rows)=>rows.reduce((m,r)=>{for(const c of r.c||[])m[c.t]=(m[c.t]||0)+c.c;return m},{});
 const dockAt=(rows,n)=>{checked(n,-1,rows.length-1);const normal={},extra={};for(const r of rows.slice(0,n+1)){Object.assign(normal,pairs(r.e));add(extra,pairs(r.e1))}return {normal,extra,power:n<0?0:rows[n].p,luxury:n<0?0:rows[n].l}};
 const dock=(rows,from,to)=>{range(rows,from,to);return {cost:cost(rows.slice(from+1,to+1)),before:dockAt(rows,from),after:dockAt(rows,to),steps:rows.slice(from+1,to+1).map(r=>({index:r.lv,cost:cost([r]),unlock:r.ul||null,requirement:r.nl,requiredRank:r.r_l}))}};
 const rawAt=(rows,n)=>{checked(n,-1,rows.length-1);const r=rows[n];return {power:r?.p||0,luxury:r?.l||0,base:pairs(r?.e),extra:pairs(r?.e1),special:pairs(r?.e2)}};
 const land=(item,from,to)=>{const rows=item.rows; if(item.type!=='land')throw new TypeError('Not land');checked(from,0,rows.length-1);checked(to,from,rows.length-1);return {copies:rows.slice(from,to).reduce((a,r)=>a+r.c,0),before:rawAt(rows,from),after:rawAt(rows,to),steps:rows.slice(from,to).map(r=>({from:r.lv,to:r.lv+1,copies:r.c}))}};
 const sea=(item,from,to)=>{const rows=item.rows;if(item.type!=='sea')throw new TypeError('Not sea');range(rows,from,to);return {cost:cost(rows.slice(from+1,to+1)),before:rawAt(rows,from),after:rawAt(rows,to),steps:rows.slice(from+1,to+1).map(r=>({index:r.lv,cost:cost([r])}))}};
 const setMembers=(items,set)=>items.filter(x=>x.set===set);
 return Object.freeze({dock,dockAt,land,sea,rawAt,setMembers});
})();
if(typeof module!=="undefined")module.exports=IslandCore;
