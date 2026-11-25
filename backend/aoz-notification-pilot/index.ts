// Owner-only pilot. No bulk delivery or webhook changes.
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
const messages:Record<string,string[]>={hr:["🧪 Test AOZ Community Huba\nObavijesti rade!\nTestni kod (nije kod za igru):","Kopiraj kod"],ru:["🧪 Тест AOZ Community Hub\nУведомления работают!\nТестовый код (не игровой):","Копировать код"],en:["🧪 AOZ Community Hub test\nNotifications work!\nTest code (not a game code):","Copy code"],es:["🧪 Prueba de AOZ Community Hub\n¡Las notificaciones funcionan!\nCódigo de prueba (no válido en el juego):","Copiar código"],vi:["🧪 Kiểm tra AOZ Community Hub\nThông báo hoạt động!\nMã thử (không dùng trong trò chơi):","Sao chép mã"],ar:["🧪 اختبار AOZ Community Hub\nالإشعارات تعمل!\nرمز اختبار (ليس رمز اللعبة):","نسخ الرمز"],zh:["🧪 AOZ Community Hub 測試\n通知功能正常！\n測試代碼（非遊戲禮包碼）：","複製代碼"]};
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="POST"||req.headers.get("origin")!==origin)return reply({ok:false,error:"forbidden"},403);
 const token=Deno.env.get("TELEGRAM_BOT_TOKEN"),base=Deno.env.get("SUPABASE_URL"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!token||!base||!service)return reply({ok:false,error:"configuration"},503);
 try{
  const raw=await req.text();if(raw.length>16000)return reply({ok:false,error:"invalid"},400);
  const b=JSON.parse(raw);const id=await identity(b.initData,token);if(!id)return reply({ok:false,error:"telegram_auth"},401);
  const rest=async(path:string,method="GET",body?:object,prefer?:string)=>{
   const h:Record<string,string>={apikey:service,Authorization:"Bearer "+service,"Content-Type":"application/json"};
   if(prefer)h.Prefer=prefer;
   const r=await fetch(base+"/rest/v1/"+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
   if(!r.ok)throw new Error("db");return r.status===204?null:await r.json()
  };
  const owner=()=>rest("aoz_notification_owner?singleton=eq.true&select=telegram_id,test_status");
  let o=(await owner())[0];
  if(!o&&b.action==="claim"){
   if(Date.now()>Date.parse("2026-11-27T00:00:00Z")||typeof b.code!=="string"||b.code.length>100||!eq(hex(await crypto.subtle.digest("SHA-256",enc.encode(b.code))),"e836a5ede5159623c42cc4e6b41ed3963b2d5387eff9d972a12d139354d77784"))return reply({ok:false,error:"claim_code"},403);
   await rest("aoz_notification_owner?on_conflict=singleton","POST",{singleton:true,telegram_id:id},"resolution=ignore-duplicates,return=minimal");
   o=(await owner())[0];
  }
  if(!o)return reply({ok:false,error:"claim_required"},403);
  if(String(o.telegram_id)!==id)return reply({ok:false,error:"owner_only"},403);
  const read=async()=> (await rest("aoz_subscribers?telegram_id=eq."+id+"&select=language,v3,v1,global_codes,news"))[0]||null;
  if(b.action==="claim"||b.action==="status")return reply({ok:true,preferences:await read(),test:o.test_status});
  if(b.action==="save"){
   const p=b.preferences, language=p?.language;
   if(!Object.hasOwn(messages,language)||!["v3","v1","global_codes","news"].every(k=>typeof p[k]==="boolean"))return reply({ok:false,error:"invalid"},400);
   const enabled=p.v3||p.v1||p.global_codes||p.news;
   const now=new Date().toISOString();
   await rest("aoz_subscribers?on_conflict=telegram_id","POST",{telegram_id:id,language,v3:p.v3,v1:p.v1,global_codes:p.global_codes,news:p.news,consent_at:enabled?now:null,updated_at:now,blocked_at:null},"resolution=merge-duplicates,return=minimal");
   return reply({ok:true,preferences:await read(),test:o.test_status})
  }
  if(b.action==="test"){
   const p=await read();if(!p||!(p.v3||p.v1||p.global_codes||p.news))return reply({ok:false,error:"subscribe_first"},409);
   const claimed=await rest("aoz_notification_owner?singleton=eq.true&telegram_id=eq."+id+"&test_status=eq.ready","PATCH",{test_status:"sending"},"return=representation");
   if(!claimed.length)return reply({ok:false,error:"test_already_attempted"},409);
   let state="uncertain";
   try{
    const m=messages[p.language]||messages.en;
    const r=await fetch("https://api.telegram.org/bot"+token+"/sendMessage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:id,text:m[0]+"\nAOZ-TEST",reply_markup:{inline_keyboard:[[{text:m[1],copy_text:{text:"AOZ-TEST"}}]]}}),signal:AbortSignal.timeout(12000)});
    const j=await r.json();state=r.ok&&j.ok===true?"sent":j.ok===false?"failed":"uncertain";
   }catch{}
   await rest("aoz_notification_owner?singleton=eq.true&telegram_id=eq."+id,"PATCH",{test_status:state},"return=minimal");
   return reply({ok:state==="sent",test:state,error:state==="sent"?null:"delivery_"+state},state==="sent"?200:502)
  }
  return reply({ok:false,error:"invalid"},400)
 }catch{return reply({ok:false,error:"server_error"},500)}
});
