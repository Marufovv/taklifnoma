(() => {
'use strict';
const c=window.INVITATION,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const motion=matchMedia('(prefers-reduced-motion: reduce)'),reduced=()=>motion.matches;
const couple=`${c.groom} & ${c.bride}`, start=new Date(c.startsAt),end=new Date(c.endsAt);
// === CONFIG / ACCESSIBILITY ===
document.documentElement.dataset.theme=c.theme==='burgundy'?'burgundy':'emerald';
if(/^#[\da-f]{6}$/i.test(c.accentColor))document.documentElement.style.setProperty('--accent',c.accentColor);
$$('[data-copy]').forEach(el=>{if(c.copy[el.dataset.copy]!==undefined)el.textContent=c.copy[el.dataset.copy];});
$$('[data-groom]').forEach(el=>el.textContent=c.groom);$$('[data-bride]').forEach(el=>el.textContent=c.bride);$$('[data-couple]').forEach(el=>el.textContent=couple);
$('[data-venue]').textContent=c.venue;$('[data-address]').textContent=c.address;$('[data-landmark]').textContent=c.landmark;
for(const [id,value] of [['parents',c.parents],['dress-code',c.dressCode],['venue-phone',c.phone]]){if(value){$('#'+id).hidden=false;$('#'+id).textContent=value;}}
if(c.phone)$('#venue-phone').href='tel:'+c.phone.replace(/[^\d+]/g,'');
$('#google-map').href=`https://www.google.com/maps/dir/?api=1&destination=${c.coordinates.lat},${c.coordinates.lng}`;
$('#yandex-map').href=`https://yandex.com/maps/?pt=${c.coordinates.lng},${c.coordinates.lat}&z=16&l=map`;
$('#wish').placeholder=c.copy.wishPlaceholder;
const root=document.documentElement;
const ready=()=>root.classList.add('loaded');
Promise.race([document.fonts?.ready||Promise.resolve(),new Promise(r=>setTimeout(r,1200))]).then(ready);
let toastTimer;function announce(text){const el=$('#status');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),6500);}
window.invitationAnnounce=announce;
if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');e.target.classList.remove('pending');io.unobserve(e.target);}}),{threshold:.08});$$('.reveal').forEach(el=>{el.classList.add('pending');io.observe(el);});}else $$('.reveal').forEach(el=>el.classList.add('visible'));
// Dynamic content still leaves a complete static HTML version for no-JS browsers.
const timeline=$('.timeline');timeline.replaceChildren();c.program.forEach(item=>{const li=document.createElement('li'),time=document.createElement('time'),box=document.createElement('div'),h=document.createElement('h3'),p=document.createElement('p');li.className='timeline-item';time.textContent=item.time;h.textContent=item.title;p.textContent=item.detail;box.append(h,p);li.append(time,box);timeline.append(li);});
$('#dastur').hidden=!c.program.length;
if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.6});$$('.timeline-item').forEach(el=>io.observe(el));}
const art=$('.venue-art img');art.src=c.artwork.fallback;art.width=c.artwork.width;art.height=c.artwork.height;art.alt=c.artwork.alt;$('.venue-art source').srcset=c.artwork.webp;
art.addEventListener('error',()=>{art.hidden=true;announce('To‘yxona rasmi yuklanmadi. Manzil va xarita tugmalari ishlaydi.');});
$$('.photo-frame').forEach((frame,i)=>{const p=c.photos[i];if(!p){frame.hidden=true;return;}const image=frame.querySelector('img');frame.querySelector('figcaption span').textContent=p.caption;if(image){if(!p.src){image.remove();return;}image.addEventListener('error',()=>image.remove(),{once:true});image.src=p.src;image.alt=p.alt;}});
// === OPEN THE INVITATION ===
let opening=false;
$('#open-invite').addEventListener('click',e=>{e.preventDefault();if(opening)return;opening=true;$('.cover').classList.add('opening');$('#open-invite').setAttribute('aria-busy','true');if(navigator.vibrate)navigator.vibrate(20);dispatchEvent(new CustomEvent('invitation-open'));
setTimeout(()=>{$('#taklif').focus({preventScroll:true});$('#taklif').scrollIntoView({behavior:reduced()?'auto':'smooth'});$('#open-invite').removeAttribute('aria-busy');setTimeout(()=>{$('.cover').classList.remove('opening');opening=false;},900);},reduced()?0:1500);});
let frame=0;addEventListener('scroll',()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;$('.reading-progress').style.width=`${scrollY/Math.max(1,root.scrollHeight-innerHeight)*100}%`;});},{passive:true});
// === COUNTDOWN / CALENDAR ===
function countdown(){const now=Date.now(),d=Math.max(0,start-now),values=[Math.floor(d/86400000),Math.floor(d/3600000)%24,Math.floor(d/60000)%60,Math.floor(d/1000)%60];['days','hours','minutes','seconds'].forEach((id,i)=>{const el=$('#'+id),value=String(values[i]).padStart(2,'0');if(el.textContent!==value){el.textContent=value;if(!reduced()){el.classList.remove('rolling');void el.offsetWidth;el.classList.add('rolling');}}});$('#countdown-status').textContent=now>=end?'Biz birga nishonladik ♡':now>=start?'Bugun bizning kunimiz. Sizni kutamiz!':'Toshkent vaqti bilan · Asia/Tashkent';}
countdown();setInterval(countdown,1000);
const utc=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const escapeICS=s=>String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');
// Fold at 75 UTF-8 bytes, preserving Uzbek characters.
function foldICS(line){let out='',current='',bytes=0;for(const ch of line){const n=new TextEncoder().encode(ch).length;if(bytes+n>75){out+=current+'\r\n';current=' ';bytes=1;}current+=ch;bytes+=n;}return out+current;}
$('#calendar').addEventListener('click',()=>{const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sardorbek Gulsevar//UZ','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${+start}@wedding.local`,`DTSTAMP:${utc(new Date())}`,`DTSTART:${utc(start)}`,`DTEND:${utc(end)}`,`SUMMARY:${escapeICS(couple+' — nikoh to‘yi')}`,`LOCATION:${escapeICS(c.venue+' to‘yxonasi, '+c.address)}`,`GEO:${c.coordinates.lat};${c.coordinates.lng}`,'END:VEVENT','END:VCALENDAR'];const url=URL.createObjectURL(new Blob([lines.map(foldICS).join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Sardorbek-Gulsevar.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);announce('Taqvim fayli tayyor. Uni ochib taqvimga qo‘shing.');});
async function copy(text){try{await navigator.clipboard.writeText(text);announce('Nusxalandi.');}catch{announce('Nusxalashga ruxsat berilmadi. Matnni qo‘lda nusxalang.');}}
$('#copy-address').addEventListener('click',()=>copy(`${c.venue} to‘yxonasi, ${c.address}. ${c.landmark}`));
$('#share').addEventListener('click',async()=>{try{if(navigator.share)await navigator.share({title:couple,text:'Nikoh to‘yimizga taklif etamiz.',url:c.siteUrl});else await copy(c.siteUrl);}catch(e){if(e.name!=='AbortError')announce('Havolani manzil satridan nusxalashingiz mumkin.');}});
// === GALLERY / TOUCH / KEYBOARD ===
const stage=$('.gallery-stage');const scrollGallery=dir=>stage.scrollBy({left:dir*(stage.querySelector('.photo-frame').offsetWidth+30),behavior:reduced()?'auto':'smooth'});
$('#gallery-prev').addEventListener('click',()=>scrollGallery(-1));$('#gallery-next').addEventListener('click',()=>scrollGallery(1));stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();scrollGallery(e.key==='ArrowRight'?1:-1);}});
let drag=null;stage.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;drag={x:e.clientX,left:stage.scrollLeft};stage.setPointerCapture(e.pointerId);});stage.addEventListener('pointermove',e=>{if(drag)stage.scrollLeft=drag.left-e.clientX+drag.x;});for(const event of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(event,()=>drag=null);stage.addEventListener('dragstart',e=>e.preventDefault());
// === REAL MP3 + M4A FALLBACK / HONEST PLAYER STATES ===
const audio=$('#music'),button=$('#music-toggle'),dock=$('.music-dock'),label=$('.music-label');audio.querySelector('source[type="audio/mpeg"]').src=c.music.mp3;audio.querySelector('source[type="audio/mp4"]').src=c.music.m4a;
let playerState='idle',loadTimer,particleTimer,attempt=0,usingFallback=false;
function particle(){if(reduced()||document.hidden)return;const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),use=document.createElementNS('http://www.w3.org/2000/svg','use');svg.setAttribute('viewBox','0 0 24 24');use.setAttribute('href',Math.random()>.5?'#heart':'#note');svg.append(use);svg.style.setProperty('--drift',`${Math.random()*50-25}px`);$('.music-particles').append(svg);setTimeout(()=>svg.remove(),3100);}
function state(value){playerState=value;clearTimeout(loadTimer);clearInterval(particleTimer);dock.classList.toggle('playing',value==='playing');dock.classList.toggle('loading',value==='loading');button.setAttribute('aria-pressed',String(value==='playing'));button.setAttribute('aria-busy',String(value==='loading'));button.setAttribute('aria-label',value==='playing'?'Musiqani to‘xtatish':value==='loading'?'Musiqa yuklashni bekor qilish':'Musiqani tinglash');label.textContent=value==='loading'?'Yuklanmoqda…':value==='playing'?c.music.title+' · ijroda':value==='error'?'Qayta tinglash':c.music.title;if(value==='playing'&&!reduced())particleTimer=setInterval(particle,1100);if(value==='loading')loadTimer=setTimeout(()=>{attempt++;audio.pause();state('error');announce('Musiqa sekin yuklanmoqda. Qayta bosing.');},25000);}
audio.addEventListener('playing',()=>state('playing'));audio.addEventListener('pause',()=>state('idle'));audio.addEventListener('waiting',()=>{if(!audio.paused)state('loading');});
async function play(){const token=++attempt;state('loading');try{audio.volume=.7;await audio.play();}catch(e){if(token!==attempt)return;if(!usingFallback&&c.music.m4a&&e.name==='NotSupportedError'){usingFallback=true;audio.src=c.music.m4a;return play();}state('error');announce('Musiqa boshlanmadi. Internetni tekshirib, qayta bosing.');}}
audio.addEventListener('error',()=>{if(!usingFallback&&playerState==='loading'&&c.music.m4a){usingFallback=true;audio.src=c.music.m4a;play();}else{state('error');announce('Musiqa fayli yuklanmadi. Qayta urinib ko‘ring.');}});
button.addEventListener('click',()=>{if(playerState==='loading'||!audio.paused){attempt++;audio.pause();state('idle');return;}if(audio.error)audio.load();play();});
// === WISHES: TELEGRAM DRAFT OR PRIVATE WORKER ===
const wish=$('#wish'),form=$('#wish-form'),submit=form.querySelector('[type=submit]');let message='',submitting=false,challenge=null,challengePromise=null;
try{wish.value=sessionStorage.getItem('wedding-wish')||'';}catch{}
function updateWish(){wish.setCustomValidity('');$('#char-count').textContent=wish.value.length+' / 1800';try{sessionStorage.setItem('wedding-wish',wish.value);}catch{}}
updateWish();wish.addEventListener('input',updateWish);
async function getChallenge(){if(!c.apiBase)return null;if(challengePromise)return challengePromise;challengePromise=(async()=>{try{const r=await fetch(c.apiBase.replace(/\/$/,'')+'/api/challenge',{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();challenge=await r.json();return challenge;}catch{challenge=null;return null;}finally{challengePromise=null;}})();return challengePromise;}
if(c.apiBase){$('.form-note').textContent='Tabrigingiz to‘g‘ridan-to‘g‘ri bizga yetib keladi.';submit.firstChild.textContent='Tabrikni yuborish ';wish.addEventListener('focus',()=>{if(!challenge||Date.now()-challenge.timestamp>1700000)getChallenge();});}
form.addEventListener('submit',async e=>{e.preventDefault();if(submitting||$('#website').value)return;const text=wish.value.trim();if(text.length<3){wish.setCustomValidity('Kamida 3 ta belgi yozing.');wish.reportValidity();return;}message=`${c.groom} va ${c.bride}ga to‘y tabrigi\n\n${text}`;
if(!c.apiBase){const url=`https://t.me/${c.telegram}?text=${encodeURIComponent(message)}`;$('#telegram-retry').href=url;$('.wish-actions').hidden=false;window.open(url,'_blank','noopener,noreferrer');announce('Tabrigingiz tayyor. Telegramda yuborishni yakunlang.');return;}
if(!challenge||Date.now()-challenge.timestamp>1700000)await getChallenge();if(!challenge){announce('Tabrik xizmati bilan ulanish yo‘q. Matningiz saqlandi.');return;}if(Date.now()-challenge.timestamp<3000){announce('Ulanish tayyor. 3 soniyadan keyin yana bosing.');return;}
submitting=true;submit.disabled=true;form.setAttribute('aria-busy','true');const sentChallenge=challenge;challenge=null;
try{const r=await fetch(c.apiBase.replace(/\/$/,'')+'/api/wish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,website:'',challenge:sentChallenge}),signal:AbortSignal.timeout(15000)});const data=await r.json();if(!r.ok||!data.ok)throw Error(data.message||'Tabrik yuborilmadi.');wish.value='';updateWish();form.classList.remove('sent');void form.offsetWidth;form.classList.add('sent');announce('Rahmat! Tabrigingiz bizga yetib keldi.');}catch(err){announce(err.name==='TimeoutError'?'Ulanish vaqti tugadi. Matningiz saqlandi; qayta yuborishdan oldin natijani tekshiring.':err.message);}finally{submitting=false;submit.disabled=false;form.removeAttribute('aria-busy');getChallenge();}});
$('#copy-wish').addEventListener('click',()=>copy(message));
document.addEventListener('visibilitychange',()=>root.classList.toggle('paused',document.hidden));
})();
