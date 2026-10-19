const encoder=new TextEncoder();
const json=(data,status=200,origin)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json;charset=UTF-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...(origin?{'Access-Control-Allow-Origin':origin,'Vary':'Origin'}:{})}});
const hex=bytes=>Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');
async function hmac(secret,text){const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',key,encoder.encode(text)));}
function equal(a,b){if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;let v=0;for(let i=0;i<a.length;i++)v|=a.charCodeAt(i)^b.charCodeAt(i);return v===0;}
export const escapeHTML=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
async function limitedBody(req,max=16000){const reader=req.body?.getReader();if(!reader)throw Error('body');let bytes=0,parts=[];while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>max){await reader.cancel();throw Error('large');}parts.push(value);}const all=new Uint8Array(bytes);let off=0;for(const part of parts){all.set(part,off);off+=part.length;}return JSON.parse(new TextDecoder().decode(all));}
export default {async fetch(req,env){
 const origin=req.headers.get('Origin'),path=new URL(req.url).pathname;
 if(!env.ALLOWED_ORIGIN||origin!==env.ALLOWED_ORIGIN)return json({ok:false,message:'Ruxsat berilmagan manba.'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'}});
 if(!['/api/challenge','/api/wish','/api/rsvp'].includes(path))return json({ok:false},404,origin);
 if(path==='/api/rsvp'&&env.ENABLE_RSVP!=='true')return json({ok:false,message:'Bu xizmat yoqilmagan.'},404,origin);
 if(!env.SIGNING_SECRET||!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_CHAT_ID||!env.RATE_LIMITER)return json({ok:false,message:'Tabrik xizmati hali sozlanmagan.'},503,origin);
 const ip=req.headers.get('CF-Connecting-IP');if(!ip)return json({ok:false},403,origin);
 const identity=await hmac(env.SIGNING_SECRET,ip);const stub=env.RATE_LIMITER.get(env.RATE_LIMITER.idFromName(identity));
 async function rate(kind,nonce){const r=await stub.fetch('https://limiter/check',{method:'POST',body:JSON.stringify({kind,nonce})});return r.json();}
 try{
  if(path==='/api/challenge'){
   if(req.method!=='GET')return json({ok:false},405,origin);
   if(!(await rate('challenge')).ok)return json({ok:false,message:'Birozdan keyin qayta urinib ko‘ring.'},429,origin);
   const timestamp=Date.now(),nonce=crypto.randomUUID(),signature=await hmac(env.SIGNING_SECRET,`${timestamp}.${nonce}.${identity}`);
   return json({timestamp,nonce,signature},200,origin);
  }
  if(req.method!=='POST')return json({ok:false},405,origin);
  if(!req.headers.get('Content-Type')?.startsWith('application/json'))return json({ok:false},415,origin);
  let body;try{body=await limitedBody(req);}catch{return json({ok:false,message:'Xabar formati yoki hajmi noto‘g‘ri.'},400,origin);}
  if(!body||typeof body!=='object'||Array.isArray(body))return json({ok:false},400,origin);
  if(typeof body.website!=='string'||body.website)return json({ok:false,message:'So‘rov qabul qilinmadi.'},400,origin);
  const c=body.challenge,age=Date.now()-c?.timestamp;
  if(!c||!Number.isSafeInteger(c.timestamp)||typeof c.nonce!=='string'||!/^[a-f0-9-]{36}$/.test(c.nonce)||typeof c.signature!=='string'||age<3000||age>1800000)return json({ok:false,message:'Sahifani yangilang yoki 3 soniyadan keyin qayta yuboring.'},400,origin);
  const valid=await hmac(env.SIGNING_SECRET,`${c.timestamp}.${c.nonce}.${identity}`);if(!equal(valid,c.signature))return json({ok:false},403,origin);
  const name=typeof body.name==='string'?body.name.trim():'';if(name.length>80)return json({ok:false},400,origin);
  let content;
  if(path==='/api/wish'){
   if(typeof body.text!=='string'||body.text.trim().length<3||body.text.length>1800)return json({ok:false,message:'Tilak 3–1800 belgidan iborat bo‘lsin.'},400,origin);
   content=`<b>💐 Yangi to‘y tabrigi</b>\n${escapeHTML(env.COUPLE_NAMES||'Sardorbek & Gulsevar')}\n${name?'\nIsm: '+escapeHTML(name)+'\n':''}\n${escapeHTML(body.text.trim())}`;
  }else{
   if(!name||!['yes','no'].includes(body.attendance)||!Number.isInteger(body.guests)||body.guests<1||body.guests>10)return json({ok:false,message:'Ma’lumotlarni tekshiring.'},400,origin);
   content=`<b>Taklifnoma javobi</b>\nIsm: ${escapeHTML(name)}\nJavob: ${body.attendance==='yes'?'Kelaman':'Kela olmayman'}\nMehmonlar: ${body.attendance==='yes'?body.guests:0}`;
  }
  const permission=await rate('send',c.nonce);if(!permission.ok)return json({ok:false,message:permission.duplicate?'Bu tabrik avval qayta ishlangan. Telegramdagi natijani tekshiring.':'Juda ko‘p urinish. 10 daqiqadan keyin qayta urinib ko‘ring.'},429,origin);
  content+='\n\n'+escapeHTML(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tashkent',dateStyle:'medium',timeStyle:'short'}).format(new Date()));
  const result=await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text:content,parse_mode:'HTML'}),signal:AbortSignal.timeout(10000)});
  const telegram=await result.json();if(!result.ok||!telegram.ok)return json({ok:false,message:'Xabarni yetkazib bo‘lmadi. Matningiz saqlandi.'},502,origin);
  return json({ok:true},200,origin);
 }catch{return json({ok:false,message:'Ulanishda xatolik. Matningiz saqlandi; yuborilganini tekshiring.'},502,origin);}
}};
// Persisted, atomic limits per hashed client IP. No tokens or raw IPs stored here.
export class RateLimiter {
 constructor(state){this.state=state;}
 async fetch(req){const {kind,nonce}=await req.json();if(!['send','challenge'].includes(kind))return json({ok:false},400);const now=Date.now();
  return this.state.storage.transaction(async txn=>{const key='state',s=await txn.get(key)||{since:now,send:0,challenge:0,nonces:{}};for(const [n,t] of Object.entries(s.nonces)){if(now-t>1800000)delete s.nonces[n];}if(now-s.since>=600000){s.since=now;s.send=0;s.challenge=0;}if(nonce&&s.nonces[nonce])return json({ok:false,duplicate:true});const limit=kind==='send'?3:20;if(s[kind]>=limit)return json({ok:false});s[kind]++;if(nonce)s.nonces[nonce]=now;await txn.put(key,s);await txn.setAlarm(now+1900000);return json({ok:true});});
 }
 async alarm(){await this.state.storage.deleteAll();}
}
