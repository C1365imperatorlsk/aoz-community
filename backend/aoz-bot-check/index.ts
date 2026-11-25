// Read-only diagnostic. Does not send messages or modify Telegram webhook/settings.
Deno.serve(async (req: Request) => {
 const reply=(data:object,status=200)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
 if(req.method!=="POST") return reply({ok:false,error:"method_not_allowed"},405);
 const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!service || req.headers.get("Authorization")!=="Bearer "+service) return reply({ok:false,error:"forbidden"},403);
 const token=Deno.env.get("TELEGRAM_BOT_TOKEN");
 if(!token) return reply({ok:false,error:"bot_secret_missing"},503);
 try {
   const response=await fetch("https://api.telegram.org/bot"+token+"/getMe",{method:"POST",signal:AbortSignal.timeout(10000)});
   const result=await response.json();
   if(!response.ok || result.ok!==true) return reply({ok:false,error:"telegram_rejected_token"},502);
   const expected="aozv3communitybot";
   const match=String(result.result?.username||"").toLowerCase()===expected || (Array.isArray(result.result?.active_usernames)&&result.result.active_usernames.some((v:unknown)=>String(v).toLowerCase()===expected));
   return reply({ok:match,bot:match?"@AOZV3CommunityBot":null,error:match?null:"unexpected_bot"},match?200:409);
 } catch { return reply({ok:false,error:"telegram_connection_failed"},502); }
});
