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

const descriptions:Record<string,string>={"":"Start / restart the bot",ru:"Запустить / перезапустить бота",en:"Start / restart the bot",es:"Iniciar / reiniciar el bot",vi:"Khởi động / khởi động lại bot",ar:"تشغيل / إعادة تشغيل البوت",zh:"啟動 / 重新啟動機器人",hr:"Pokreni / ponovno pokreni bot",it:"Avvia / riavvia il bot"};
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="POST"||req.headers.get("origin")!==origin)return reply({ok:false,error:"forbidden"},403);
 const token=Deno.env.get("TELEGRAM_BOT_TOKEN"),base=Deno.env.get("SUPABASE_URL"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!token||!base||!service)return reply({ok:false,error:"configuration"},503);
 try{
  const raw=await req.text();if(raw.length>16000)return reply({ok:false,error:"invalid"},400);
  const b=JSON.parse(raw);const id=await identity(b.initData,token);
  if(!id)return reply({ok:false,error:"telegram_auth"},401);
  const ownerResponse=await fetch(base+"/rest/v1/aoz_notification_owner?singleton=eq.true&select=telegram_id,test_status",{headers:{apikey:service,Authorization:"Bearer "+service},signal:AbortSignal.timeout(8000)});
  if(!ownerResponse.ok)return reply({ok:false,error:"owner_check"},503);
  const owner=(await ownerResponse.json())[0];
  if(!owner||String(owner.telegram_id)!==id||owner.test_status!=="sent")return reply({ok:false,error:"owner_only"},403);
  if(b.action!=="apply"||b.confirm!==true)return reply({ok:false,error:"confirmation_required"},400);
  const api=async(method:string,payload:object)=>{try{const r=await fetch("https://api.telegram.org/bot"+token+"/"+method,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:AbortSignal.timeout(7000)});const v=await r.json();return r.ok&&v.ok===true?{ok:true,result:v.result}:{ok:false,result:null}}catch{return {ok:false,result:null}}};
  const me=await api("getMe",{});
  if(!me.ok||String(me.result?.username||"").toLowerCase()!=="aozv3communitybot")return reply({ok:false,error:"unexpected_bot"},409);
  const languages=Object.keys(descriptions);
  const results=await Promise.all(languages.map(async language_code=>{
   const scope={type:"all_private_chats"};
   const commands=[{command:"start",description:descriptions[language_code]}];
   const p={scope,language_code};
   const set=await api("setMyCommands",{...p,commands});
   if(!set.ok||set.result!==true)return {language:language_code||"default",ok:false};
   const get=await api("getMyCommands",p);
   const ok=get.ok&&Array.isArray(get.result)&&get.result.length===1&&get.result[0]?.command==="start"&&get.result[0]?.description===commands[0].description;
   return {language:language_code||"default",ok};
  }));
  const ok=results.every(r=>r.ok);return reply({ok,results,error:ok?null:"partial_or_failed"},ok?200:502);
 }catch{return reply({ok:false,error:"server"},500)}
});
