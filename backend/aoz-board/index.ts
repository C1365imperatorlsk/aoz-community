// Private classifieds pilot. Reuse Telegram-signed identity; no public listings.
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


const bucket="aoz-board-private";
const fields="id,game_version,world,city_level,power,price,currency,title,description,image_count,status,created_at,published_at,expires_at,updated_at";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const clean=(x:unknown,max:number,min=0)=>typeof x==="string"&&x.trim().length>=min&&x.trim().length<=max?x.trim():null;
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="POST"||req.headers.get("origin")!==origin)return reply({ok:false,error:"forbidden"},403);
 const token=Deno.env.get("TELEGRAM_BOT_TOKEN"),base=Deno.env.get("SUPABASE_URL"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!token||!base||!service)return reply({ok:false,error:"configuration"},503);
 try{
  if(Number(req.headers.get("content-length"))>1800000)return reply({ok:false,error:"invalid"},400);
  const raw=await req.text();if(raw.length>1800000)return reply({ok:false,error:"invalid"},400);
  const b=JSON.parse(raw);const id=await identity(b.initData,token);if(!id)return reply({ok:false,error:"telegram_auth"},401);
  const h={apikey:service,Authorization:"Bearer "+service};
  const rest=async(path:string,method="GET",body?:object,prefer?:string)=>{
   const hs:Record<string,string>={...h,"Content-Type":"application/json"};if(prefer)hs.Prefer=prefer;
   const r=await fetch(base+"/rest/v1/"+path,{method,headers:hs,body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(8000)});
   if(!r.ok){console.warn("board_db",method,r.status);throw Error("db")}
   const t=await r.text();return t?JSON.parse(t):null
  };
  const owner=(await rest("aoz_notification_owner?singleton=eq.true&select=telegram_id,test_status"))[0];
  const allowed=!!owner&&String(owner.telegram_id)===id&&owner.test_status==="sent";
  if(b.action==="access")return reply({ok:true,allowed});
  if(!allowed)return reply({ok:false,error:"owner_only"},403);
  const path=(i:string)=>"aoz_board_listings?id=eq."+i+"&author_id=eq."+id;
  const files=(row:any)=>Array.from({length:row.image_count},(_,i)=>row.id+"/"+i+".jpg");
  const storage=async(route:string,method:string,body?:BodyInit,contentType="application/json")=>{
   const r=await fetch(base+"/storage/v1/"+route,{method,headers:{...h,"Content-Type":contentType},body,signal:AbortSignal.timeout(12000)});
   if(!r.ok){console.warn("board_storage",method,r.status);throw Error("storage")}
   return r;
  };
  const erase=async(row:any)=>{
   await rest(path(row.id),"PATCH",{status:"deleting",updated_at:new Date().toISOString()});
   if(row.image_count)await storage("object/"+bucket,"DELETE",JSON.stringify({prefixes:files(row)}));
   await rest(path(row.id)+"&status=eq.deleting","DELETE");
  };
  const present=(r:any)=>({...r,status:r.status==="published"&&Date.parse(r.expires_at)<=Date.now()?"expired":r.status});
  if(b.action==="list"){
   const rows=await rest("aoz_board_listings?author_id=eq."+id+"&select="+fields+"&order=created_at.desc&limit=50");
   return reply({ok:true,listings:rows.map(present)})
  }
  if(b.action==="create"){
   const x=b.listing||{},title=clean(x.title,80,1),world=clean(x.world,24,1),description=clean(x.description,1500);
   const level=x.city_level,power=x.power,price=x.price;
   if(!title||!world||description===null||!["v3","v1","global"].includes(x.game_version)||!["USD","EUR","RUB","CNY"].includes(x.currency)||!Number.isInteger(level)||level<1||level>99||(power!==null&&(!Number.isSafeInteger(power)||power<0||power>999999999999))||(price!==null&&(!Number.isFinite(price)||price<0||price>9999999999.99))||!Array.isArray(b.images)||b.images.length>5)return reply({ok:false,error:"invalid"},400);
   const images:Uint8Array[]=[];
   for(const v of b.images){if(typeof v!=="string"||v.length>342000||! /^[A-Za-z0-9+/]+={0,2}$/.test(v))return reply({ok:false,error:"image"},400);
    const bytes=Uint8Array.from(atob(v),c=>c.charCodeAt(0));if(bytes.length<4||bytes.length>256000||bytes[0]!==255||bytes[1]!==216||bytes[2]!==255||bytes[bytes.length-2]!==255||bytes[bytes.length-1]!==217)return reply({ok:false,error:"image"},400);images.push(bytes);
   }
   const current=await rest("aoz_board_listings?author_id=eq."+id+"&select=id&limit=20");if(current.length>=20)return reply({ok:false,error:"limit"},409);
   const row=(await rest("aoz_board_listings","POST",{author_id:id,game_version:x.game_version,world,city_level:level,power,price,currency:x.currency,title,description,image_count:images.length},"return=representation"))[0];
   try{
    for(let i=0;i<images.length;i++)await storage("object/"+bucket+"/"+row.id+"/"+i+".jpg","POST",images[i],"image/jpeg");
    const result=(await rest(path(row.id)+"&status=eq.uploading","PATCH",{status:"pending",updated_at:new Date().toISOString()},"return=representation"))[0];if(!result)throw Error("state");
    return reply({ok:true,id:row.id})
   }catch(e){try{await erase(row)}catch{console.warn("board_cleanup_pending")}throw e}
  }
  if(typeof b.id!=="string"||!uuid.test(b.id))return reply({ok:false,error:"invalid"},400);
  const row=(await rest(path(b.id)+"&select="+fields))[0];if(!row)return reply({ok:false,error:"not_found"},404);
  if(b.action==="images"){
   if(["uploading","deleting"].includes(row.status))return reply({ok:false,error:"state"},409);
   const urls=[];for(const file of files(row)){const r=await storage("object/sign/"+bucket+"/"+file,"POST",JSON.stringify({expiresIn:120}));const result=await r.json();urls.push(base+"/storage/v1"+result.signedURL)}
   return reply({ok:true,urls});
  }
  if(b.action==="delete"){
   if(row.status==="uploading"&&Date.now()-Date.parse(row.updated_at)<180000)return reply({ok:false,error:"state"},409);
   await erase(row);return reply({ok:true})
  }
  const now=new Date(),stamp=now.toISOString();let next:any;
  if(b.action==="approve"&&row.status==="pending")next={status:"published",published_at:stamp,expires_at:new Date(now.getTime()+30*86400000).toISOString()};
  if(b.action==="reject"&&row.status==="pending")next={status:"rejected"};
  if(b.action==="close"&&row.status==="published")next={status:"closed"};
  if(b.action==="renew"&&((row.status==="published"&&Date.parse(row.expires_at)<=now.getTime())||row.status==="closed"||row.status==="rejected"))next={status:"pending",published_at:null,expires_at:null};
  if(!next)return reply({ok:false,error:"state"},409);
  const updated=await rest(path(row.id)+"&status=eq."+row.status,"PATCH",{...next,updated_at:stamp},"return=representation");
  if(!updated.length)return reply({ok:false,error:"state"},409);
  return reply({ok:true});
 }catch(e){console.warn("board_error",e instanceof Error?e.message:"unknown");return reply({ok:false,error:"server"},500)}
});
