const assert=require('node:assert/strict');const D=require('../data/island-source');const C=require('../data/island-core');let checks=0;
const ok=(a,b)=>{assert.deepEqual(a,b);checks++};const totals=(a,b)=>Object.fromEntries([...new Set([...Object.keys(a),...Object.keys(b)])].map(k=>[k,(a[k]||0)+(b[k]||0)]));
ok(D.deco.length,86);ok(Object.keys(D.dock).length,4);ok(D.deco.filter(x=>x.type==='sea').length,6);ok(D.deco.filter(x=>x.type==='land').length,76);ok(D.deco.filter(x=>x.type==='decor').length,4);
for(const rows of Object.values(D.dock)){for(let i=-1;i<rows.length;i++){ok(C.dock(rows,i,i).cost,{});for(let j=i+1;j<rows.length;j++){let v=C.dock(rows,i,j);ok(v.cost,totals(C.dock(rows,i,j-1).cost,C.dock(rows,j-1,j).cost));ok(v.after.power,rows[j].p);ok(v.after.luxury,rows[j].l)}}}
ok(Object.values(D.dock).reduce((s,r)=>s+C.dock(r,-1,r.length-1).cost[67240371],0),33450);
for(const item of D.deco){if(item.type==='land'){for(let i=0;i<item.rows.length;i++)for(let j=i;j<item.rows.length;j++){const v=C.land(item,i,j);ok(v.copies,item.rows.slice(i,j).reduce((s,r)=>s+r.c,0));ok(v.after.power,item.rows[j].p);}}if(item.type==='sea'){for(let i=-1;i<item.rows.length;i++)for(let j=i+1;j<item.rows.length;j++){const v=C.sea(item,i,j);ok(v.cost,totals(C.sea(item,i,j-1).cost,C.sea(item,j-1,j).cost));ok(v.after.power,item.rows[j].p)}}}
for(let i=1;i<=6;i++){ok(C.setMembers(D.deco,i).length,5);ok(C.setMembers(D.deco,i).filter(x=>x.setRows.length).length,1)}
console.log(JSON.stringify({checks,errors:0}));
