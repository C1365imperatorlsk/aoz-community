// Notifications: Telegram-signed identity, opt-in, owner-only campaign controls.
const origin="https://c1365imperatorlsk.github.io";
const headers={"Content-Type":"application/json","Cache-Control":"no-store","Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Vary":"Origin"};
const reply=(x:object,status=200)=>new Response(JSON.stringify(x),{status,headers});
const enc=new TextEncoder();
const hex=(a:ArrayBuffer)=>Array.from(new Uint8Array(a),b=>b.toString(16).padStart(2,"0")).join("");
const eq=(a:string,b:string)=>{if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0};
async function hmac(key:Uint8Array,data:string){const k=await crypto.subtle.importKey("raw",key,{name:"HMAC",hash:"SHA-256"},false,["sign"]);return crypto.subtle.sign("HMAC",k,enc.encode(data))}
async function identity(raw:unknown,token:string){
 if(typeof raw!=="string"||raw.length>12000||!raw)return null;
 const q=new URLSearchParams(raw);const seen=new Set<string>();for(const [k] of q){if(seen.has(k))return null;seen.add(k)}
 const hash=q.get("hash");if(!hash||! /^[a-f0-9]{64}$/.test(hash))return null;
 q.delete("hash");const data=[...q.entries()].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0).map(([k,v])=>k+"="+v).join("\n");
 const key=await hmac(enc.encode("WebAppData"),token);
 if(!eq(hex(await hmac(new Uint8Array(key),data)),hash))return null;
 const t=Number(q.get("auth_date")),now=Math.floor(Date.now()/1000);
 if(!Number.isSafeInteger(t)||t>now+60||now-t>1800)return null;
 try{const u=JSON.parse(q.get("user")||"null");return Number.isSafeInteger(u?.id)&&u.id>0?String(u.id):null}catch{return null}
}

const langs=["ru","en","es","vi","ar","zh","hr"];
const msg:Record<string,string[]>={
ru:["🎁 Новый подарочный промокод!","Версия игры:","Активируйте код в игре.","Копировать код","Настройки уведомлений"],
en:["🎁 New gift code!","Game version:","Redeem the code in the game.","Copy code","Notification settings"],
es:["🎁 ¡Nuevo código de regalo!","Versión del juego:","Canjea el código en el juego.","Copiar código","Ajustes de notificaciones"],
vi:["🎁 Mã quà tặng mới!","Phiên bản trò chơi:","Đổi mã trong trò chơi.","Sao chép mã","Cài đặt thông báo"],
ar:["🎁 رمز هدية جديد!","إصدار اللعبة:","استخدم الرمز داخل اللعبة.","نسخ الرمز","إعدادات الإشعارات"],
zh:["🎁 新禮包碼！","遊戲版本：","請在遊戲中兌換代碼。","複製代碼","通知設定"],
hr:["🎁 Novi poklon-kod!","Verzija igre:","Iskoristite kod u igri.","Kopiraj kod","Postavke obavijesti"]};
const categories:Record<string,string>={v3:"China V3",v1:"China V1",global:"Global"};
const fields:Record<string,string>={v3:"v3",v1:"v1",global:"global_codes"};
function template(language:string,category:string,code:string){const m=msg[language]||msg.en;return {text:m[0]+"\n\n"+m[1]+" "+categories[category]+"\n\n"+code+"\n\n"+m[2],reply_markup:{inline_keyboard:[[{text:m[3],copy_text:{text:code}}],[{text:m[4],url:"https://t.me/AOZV3CommunityBot?startapp=notifications"}]]}}}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="POST"||req.headers.get("origin")!==origin)return reply({ok:false,error:"forbidden"},403);
 const token=Deno.env.get("TELEGRAM_BOT_TOKEN"),base=Deno.env.get("SUPABASE_URL"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!token||!base||!service)return reply({ok:false,error:"configuration"},503);
 try{
  const raw=await req.text();if(raw.length>16000)return reply({ok:false,error:"invalid"},400);
  const b=JSON.parse(raw);const id=await identity(b.initData,token);if(!id)return reply({ok:false,error:"telegram_auth"},401);
  const rest=async(path:string,method="GET",body?:object,prefer?:string)=>{
   const h:Record<string,string>={apikey:service,Authorization:"Bearer "+service,"Content-Type":"application/json"};if(prefer)h.Prefer=prefer;
   const r=await fetch(base+"/rest/v1/"+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(7000)});
   if(!r.ok){console.warn("aoz_notify_db",method,r.status);throw Error("db")}
   const payload=await r.text();return payload.trim()?JSON.parse(payload):null
  };
  const rpc=(name:string,args={})=>rest("rpc/"+name,"POST",args);
  const read=async(target=id)=>(await rest("aoz_subscribers?telegram_id=eq."+target+"&select=language,v3,v1,global_codes,news,blocked_at,consent_at"))[0]||null;
  const o=(await rest("aoz_notification_owner?singleton=eq.true&select=telegram_id,test_status"))[0];
  const owner=!!o&&String(o.telegram_id)===id&&o.test_status==="sent";
  const prefs=async()=>{const x=await read();return x?{language:x.language,v3:x.v3,v1:x.v1,global_codes:x.global_codes,news:x.news,blocked:!!x.blocked_at}:null};
  if(b.action==="status")return reply({ok:true,owner,preferences:await prefs()});
  if(b.action==="save"){
   const p=b.preferences;if(!p||!langs.includes(p.language)||!["v3","v1","global_codes","news"].every(k=>typeof p[k]==="boolean"))return reply({ok:false,error:"invalid"},400);
   const enabled=p.v3||p.v1||p.global_codes||p.news;
   if(enabled&&b.consent!==true)return reply({ok:false,error:"consent"},400);
   const now=new Date().toISOString();
   await rest("aoz_subscribers?on_conflict=telegram_id","POST",{telegram_id:id,language:p.language,v3:p.v3,v1:p.v1,global_codes:p.global_codes,news:p.news,consent_at:enabled?now:null,updated_at:now,blocked_at:null},"resolution=merge-duplicates,return=minimal");
   return reply({ok:true,owner,preferences:await prefs()})
  }
  if(!owner)return reply({ok:false,error:"owner_only"},403);
  const counts=()=>rpc("aoz_notify_counts"),history=()=>rpc("aoz_notify_history");
  if(b.action==="admin")return reply({ok:true,counts:await counts(),history:await history()});
  if(b.action==="preview"||b.action==="queue"){
   const category=b.category,code=b.code;
   if(!Object.hasOwn(categories,category)||typeof code!=="string"||! /^[A-Za-z0-9_-]{1,64}$/.test(code))return reply({ok:false,error:"invalid_code"},400);
   if(b.action==="preview"){const c=await counts();return reply({ok:true,total:c[category],previews:Object.fromEntries(langs.map(l=>[l,template(l,category,code).text]))})}
   if(b.confirm!==true||!Number.isSafeInteger(b.expected)||b.expected<1)return reply({ok:false,error:"invalid"},400);
   const q=await rpc("aoz_notify_queue",{p_category:category,p_code:code,p_expected:b.expected});return q.error?reply({ok:false,error:q.error},409):reply({ok:true,...q});
  }
  if(b.action==="batch"){
   if(b.confirm!==true||typeof b.id!=="string"||! /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.id))return reply({ok:false,error:"invalid"},400);
   const job=await rpc("aoz_notify_batch",{p_id:b.id});if(job.error)return reply({ok:false,error:job.error},409);
   try{
    for(const target of job.recipients){
     let state="uncertain";
     try{
      const u=await read(target);
      if(!u||!u.consent_at||u.blocked_at||!u[fields[job.category]])state="skipped";
      else{
       const r=await fetch("https://api.telegram.org/bot"+token+"/sendMessage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:target,...template(u.language,job.category,job.code)}),signal:AbortSignal.timeout(6000)});
       const j=await r.json();state=r.ok&&j.ok===true?"sent":j.ok===false?"failed":"uncertain";
       if(j.error_code===403){await rest("aoz_subscribers?telegram_id=eq."+target,"PATCH",{blocked_at:new Date().toISOString()},"return=minimal")}
      }
     }catch{console.warn("aoz_notify_delivery_uncertain")}
     await rest("aoz_deliveries?campaign_id=eq."+b.id+"&telegram_id=eq."+target+"&status=eq.sending","PATCH",{status:state,updated_at:new Date().toISOString()},"return=minimal");
     await new Promise(r=>setTimeout(r,250));
    }
   }finally{await rpc("aoz_notify_finish",{p_id:b.id,p_lease:job.lease})}
   return reply({ok:true,history:await history()})
  }
  return reply({ok:false,error:"invalid"},400)
 }catch{return reply({ok:false,error:"server_error"},500)}
});
