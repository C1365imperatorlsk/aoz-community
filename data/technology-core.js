const TechnologyCore=(()=>{
 const byId=new Map(technologyData.map(t=>[t.id,t]));
 const checked=(item,n)=>{if(!item||!Number.isInteger(n)||n<0||n>item.rows.length)throw new RangeError('Level');return n};
 const add=(a,k,v)=>{a[k]=(a[k]||0)+v};
 const max=(a,k,v)=>{a[k]=Math.max(a[k]||0,v)};
 const pairs=(a,vs)=>{for(let i=0;i<vs.length;i+=2)max(a,vs[i],vs[i+1]+1)};
 const effect=(item,n)=>{checked(item,n);const r=item.rows[n-1];if(!r)return {id:0,value:0};return item.group==='alliance'?{id:r.eg,value:r.ev}:{id:r.eff.t||0,value:r.eff.c||0}};
 const calc=(item,from,to,speed=0)=>{checked(item,from);checked(item,to);if(to<from)throw new RangeError('Range');if(!Number.isFinite(speed)||speed<0||speed>100000)throw new RangeError('Speed');const costs={},buildings={},requires={};let time=0,xp=0;const rows=item.rows.slice(from,to);for(const r of rows){for(const c of r.cost||[])add(costs,c.t,c.c);time+=r.tm||0;xp+=r.xp||0;pairs(buildings,r.pre_b||[]);pairs(requires,r.pre_t||[])}return {costs,buildings,requires,time,adjusted:Math.ceil(time/(1+speed/100)),xp,before:effect(item,from),after:effect(item,to),power:[item.rows[from-1]?.power||0,item.rows[to-1]?.power||0],rows}};
 const normalize=(raw)=>{const s={};for(const item of technologyData){const r=raw?.[item.id];if(Array.isArray(r)&&r.length===2&&r.every(Number.isInteger)&&r[0]>=0&&r[1]>=r[0]&&r[1]<=item.rows.length)s[item.id]=r.slice()}return s};
 const plan=(raw,group,speed=0,include=false)=>{const state=normalize(raw),target={};for(const [id,[from,to]] of Object.entries(state))if(byId.get(+id)?.group===group&&to>from)target[id]=to;
 if(include&&group==='academy'){let changes=true;let passes=0;while(changes){changes=false;if(++passes>technologyData.length+1)throw Error('Dependency cycle');for(const [id,to] of Object.entries(target)){const item=byId.get(+id),from=state[id]?.[0]||0;for(const [dep,lv] of Object.entries(calc(item,from,to,speed).requires)){const prior=state[dep]?.[0]||0;if(prior>=lv)continue;const d=byId.get(+dep);if(!d||d.group!==group||lv>d.rows.length)throw Error('Unresolved requirement');if((target[dep]||0)<lv){target[dep]=lv;changes=true}}}}}
 const out={costs:{},buildings:{},requires:{},time:0,adjusted:0,xp:0,selected:[],effects:{}};for(const [id,to] of Object.entries(target)){const item=byId.get(+id),from=state[id]?.[0]||0;if(to<=from)continue;const c=calc(item,from,to,speed);for(const [k,v] of Object.entries(c.costs))add(out.costs,k,v);for(const [k,v] of Object.entries(c.buildings))max(out.buildings,k,v);for(const [k,v] of Object.entries(c.requires))if(Math.max(target[k]||0,state[k]?.[0]||0)<v)max(out.requires,k,v);out.time+=c.time;out.xp+=c.xp;if(c.after.id)add(out.effects,c.after.id,c.after.value-c.before.value);out.selected.push({id:+id,from,to,added:!state[id]||to>state[id][1]})}out.adjusted=Math.ceil(out.time/(1+speed/100));return out};
 const percent=id=>((Number(id)>>>16)&255)===1;
 return Object.freeze({calc,plan,normalize,byId,percent});
})();
