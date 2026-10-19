import assert from 'node:assert/strict';
import worker,{RateLimiter,escapeHTML} from '../server/worker.mjs';
const origin='https://example.test';let sent=[];
const originalFetch=globalThis.fetch;
globalThis.fetch=async(url,options)=>{sent.push(JSON.parse(options.body));return Response.json({ok:true});};
const states=new Map();
const env={ALLOWED_ORIGIN:origin,TELEGRAM_BOT_TOKEN:'test-token',TELEGRAM_CHAT_ID:'1',SIGNING_SECRET:'only-a-local-test-secret',RATE_LIMITER:{idFromName:x=>x,get(id){if(!states.has(id)){const data=new Map();const txn={get:async k=>data.get(k),put:async(k,v)=>data.set(k,v),setAlarm:async()=>{},deleteAll:async()=>data.clear()};states.set(id,new RateLimiter({storage:{...txn,transaction:fn=>fn(txn)}}));}return {fetch:(url,options)=>states.get(id).fetch(new Request(url,options))};}}};
const realNow=Date.now;let now=realNow();Date.now=()=>now;
function request(path,body,ip='1.2.3.4',o=origin){return new Request('https://worker.test'+path,{method:body?'POST':'GET',headers:{Origin:o,'CF-Connecting-IP':ip,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});}
let response=await worker.fetch(request('/api/challenge',null,'1.2.3.4','https://evil.test'),env);assert.equal(response.status,403);
response=await worker.fetch(request('/api/challenge'),env);const challenge=await response.json();assert(challenge.signature);
response=await worker.fetch(request('/api/wish',{text:'Baxtli bo‘ling!',website:'',challenge}),env);assert.equal(response.status,400);
now+=3100;
response=await worker.fetch(request('/api/wish',{text:'<script>x</script> & baxt',website:'',challenge}),env);assert.equal(response.status,200);assert(sent[0].text.includes('&lt;script&gt;'));assert(!sent[0].text.includes('<script>'));
response=await worker.fetch(request('/api/wish',{text:'Takroriy xabar',website:'',challenge}),env);assert.equal(response.status,429);assert.equal(sent.length,1);
const c2=await (await worker.fetch(request('/api/challenge'),env)).json();now+=3100;
response=await worker.fetch(request('/api/wish',{text:'Baxt',website:'bot',challenge:c2}),env);assert.equal(response.status,400);
response=await worker.fetch(request('/api/wish',{text:'Baxt',website:'',challenge:{...c2,signature:'0'.repeat(64)}}),env);assert.equal(response.status,403);
response=await worker.fetch(request('/api/wish',{text:'x'.repeat(1801),website:'',challenge:c2}),env);assert.equal(response.status,400);
response=await worker.fetch(request('/api/wish',{text:'Baxt',website:'',challenge:c2},'another-ip'),env);assert.equal(response.status,403);
response=await worker.fetch(request('/api/rsvp',{name:'Mehmon',attendance:'yes',guests:2,website:'',challenge:c2}),env);assert.equal(response.status,404);
for(let i=0;i<3;i++){const c=await (await worker.fetch(request('/api/challenge'),env)).json();now+=3100;response=await worker.fetch(request('/api/wish',{text:'Tabriklayman',website:'',challenge:c}),env);assert.equal(response.status,i<2?200:429);}
assert.equal(escapeHTML('<b>&"'),'&lt;b&gt;&amp;&quot;');
Date.now=realNow;globalThis.fetch=originalFetch;
console.log('PASS: exact-origin CORS, signed timed challenge, IP binding, honeypot, escaping, length, replay prevention, durable rate limits, RSVP disabled. Telegram requests mocked; no live messages sent.');
