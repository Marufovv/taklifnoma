// === OPTIONAL MOTION: CONTENT NEVER DEPENDS ON CDN ===
const c=window.INVITATION,root=document.documentElement,media=matchMedia('(prefers-reduced-motion: reduce)');
const fine=matchMedia('(pointer:fine)').matches;
let gsap,ST,lenis;const cleanups=[];
const load=url=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=url;script.onload=resolve;script.onerror=reject;document.head.append(script);});
if(!media.matches){
 // === GSAP / SCROLLTRIGGER / OPTIONAL DESKTOP SMOOTH SCROLL ===
 load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js').then(()=>load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js')).then(()=>{
  if(media.matches)return;gsap=window.gsap;ST=window.ScrollTrigger;gsap.registerPlugin(ST);
  document.querySelectorAll('.names>[data-groom],.names>[data-bride]').forEach(el=>{
   const original=el.textContent;el.setAttribute('aria-label',original);const chars=[...original].map(ch=>{const span=document.createElement('span');span.className='name-letter';span.textContent=ch;span.setAttribute('aria-hidden','true');return span;});el.replaceChildren(...chars);
   // Solid glyphs: no transparent gradient parent + transformed children paint bug.
   gsap.fromTo(chars,{clipPath:'inset(0 0 100% 0)',y:32,opacity:.01},{clipPath:'inset(0 0 0% 0)',y:0,opacity:1,stagger:.09,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}});
  });
  gsap.fromTo('.huge-date',{rotationY:-14,rotationX:4},{rotationY:14,rotationX:-4,ease:'none',scrollTrigger:{trigger:'.date-art',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.fromTo('.venue-art img',{y:18,scale:1.025},{y:0,scale:1,ease:'none',scrollTrigger:{trigger:'.venue-art',start:'top bottom',end:'center center',scrub:1}});
  document.querySelectorAll('.photo-window img').forEach(el=>gsap.fromTo(el,{y:-8},{y:8,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}}));
  if(fine&&innerWidth>1000)load('https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js').then(()=>{
   if(media.matches)return;lenis=new window.Lenis({duration:1.05,smoothWheel:true,anchors:true});lenis.on('scroll',ST.update);const tick=t=>lenis.raf(t*1000);gsap.ticker.add(tick);cleanups.push(()=>{gsap.ticker.remove(tick);lenis.destroy();});
  }).catch(()=>{});
 }).catch(()=>{});
 // === CURSOR / MAGNETIC BUTTONS ===
 if(fine){const cursor=document.querySelector('.cursor');if(c.effects.cursor){cursor.style.display='block';addEventListener('pointermove',e=>{cursor.style.transform=`translate(${e.clientX-6}px,${e.clientY-6}px)`;},{passive:true});}
 document.querySelectorAll('.button,.gallery-controls button').forEach(el=>{el.addEventListener('pointermove',e=>{if(media.matches)return;const r=el.getBoundingClientRect();el.style.translate=`${(e.clientX-r.left-r.width/2)*.06}px ${(e.clientY-r.top-r.height/2)*.1}px`;cursor.classList.add('active');});el.addEventListener('pointerleave',()=>{el.style.translate='';cursor.classList.remove('active');});});}
 // === CURVED GALLERY ===
 const stage=document.querySelector('.gallery-stage');let galleryFrame=0;function curve(){galleryFrame=0;const r=stage.getBoundingClientRect();stage.querySelectorAll('.photo-frame').forEach(el=>{const b=el.getBoundingClientRect();const delta=(b.left+b.width/2-r.left-r.width/2)/r.width;el.style.setProperty('--ry',`${Math.max(-14,Math.min(14,-delta*22))}deg`);});}stage.addEventListener('scroll',()=>{if(!galleryFrame)galleryFrame=requestAnimationFrame(curve);},{passive:true});curve();
 // === PROCEDURAL THREE.JS ENVELOPE, RINGS, PARTICLES ===
 if(c.effects.three)import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js').then(T=>{
  if(media.matches)return;
  const canvas=document.querySelector('#world');let renderer;
  try{renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
  renderer.setClearColor(0,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.4:2));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,innerWidth/innerHeight,.1,40);camera.position.z=9;
  scene.add(new T.AmbientLight(0xfff4dc,1.6));const key=new T.DirectionalLight(0xffedd1,2.4);key.position.set(-3,5,7);scene.add(key);const rim=new T.DirectionalLight(0xd7f0e5,2);rim.position.set(4,-1,3);scene.add(rim);
  const paper=new T.MeshStandardMaterial({color:0xeee2c7,roughness:.8,side:T.DoubleSide}),edge=new T.MeshStandardMaterial({color:0xd6c49d,roughness:.9,side:T.DoubleSide}),gold=new T.MeshStandardMaterial({color:0xd9b867,metalness:.85,roughness:.28});
  const envelope=new T.Group();scene.add(envelope);
  const body=new T.Mesh(new T.BoxGeometry(3.4,2.05,.07),edge);envelope.add(body);
  function polygon(points,material){const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();return new T.Mesh(new T.ShapeGeometry(shape),material);}
  const letterCanvas=document.createElement('canvas');letterCanvas.width=1024;letterCanvas.height=640;const ctx=letterCanvas.getContext('2d');ctx.fillStyle='#fffaf0';ctx.fillRect(0,0,1024,640);ctx.strokeStyle='#b49a5e';ctx.lineWidth=2;ctx.strokeRect(34,34,956,572);ctx.fillStyle='#604d2d';ctx.textAlign='center';ctx.font='italic 62px Georgia';ctx.fillText(c.groom+' & '+c.bride,512,175);ctx.font='24px Georgia';ctx.fillText('25 · 10 · 2026',512,240);const texture=new T.CanvasTexture(letterCanvas);texture.colorSpace=T.SRGBColorSpace;
  const letter=new T.Mesh(new T.PlaneGeometry(3.12,1.9),new T.MeshStandardMaterial({map:texture,roughness:.9,side:T.DoubleSide}));letter.position.z=.07;envelope.add(letter);
  const front=polygon([[-1.7,-1.025],[1.7,-1.025],[1.7,.98],[0,-.1],[-1.7,.98]],paper);front.position.z=.13;envelope.add(front);
  const flapPivot=new T.Group();flapPivot.position.set(0,1.025,.16);const flap=polygon([[-1.7,0],[1.7,0],[0,-1.18]],new T.MeshStandardMaterial({color:0xe5d3ad,roughness:.8,side:T.DoubleSide}));flapPivot.add(flap);const seamGeo=new T.BufferGeometry().setFromPoints([new T.Vector3(-1.7,0,.008),new T.Vector3(0,-1.18,.008),new T.Vector3(1.7,0,.008)]);flapPivot.add(new T.Line(seamGeo,new T.LineBasicMaterial({color:0xb9a178,transparent:true,opacity:.65})));envelope.add(flapPivot);
  const seal=new T.Group();const wax=new T.Mesh(new T.CylinderGeometry(.29,.3,.065,48),gold);wax.rotation.x=Math.PI/2;seal.add(wax);const ring=new T.Mesh(new T.TorusGeometry(.25,.009,8,64),gold);ring.position.z=.04;seal.add(ring);
  const markCanvas=document.createElement('canvas');markCanvas.width=256;markCanvas.height=256;const mark=markCanvas.getContext('2d');mark.clearRect(0,0,256,256);mark.fillStyle='#fff4d6';mark.font='68px Georgia';mark.textAlign='center';mark.fillText(c.groom[0]+'&'+c.bride[0],128,149);const markTex=new T.CanvasTexture(markCanvas);const monogram=new T.Mesh(new T.PlaneGeometry(.46,.46),new T.MeshBasicMaterial({map:markTex,transparent:true,depthWrite:false}));monogram.position.z=.045;seal.add(monogram);seal.position.set(0,-.12,.22);envelope.add(seal);
  const rings=new T.Group();const ringMat=new T.MeshStandardMaterial({color:0xc8a356,metalness:.95,roughness:.2,transparent:true,opacity:.68});for(let i=0;i<2;i++){const r=new T.Mesh(new T.TorusGeometry(.7,.035,12,80),ringMat);r.position.x=i?.34:-.34;r.rotation.y=i?-.55:.55;r.rotation.x=.25;rings.add(r);}scene.add(rings);
  const n=Math.min(innerWidth<700?32:100,Math.max(0,c.effects.particles||0));const positions=new Float32Array(n*3);for(let i=0;i<n;i++){positions[i*3]=(Math.random()-.5)*12;positions[i*3+1]=(Math.random()-.5)*12;positions[i*3+2]=-1-Math.random()*2;}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(positions,3));const dust=new T.Points(geo,new T.PointsMaterial({color:0xd9b867,size:.024,transparent:true,opacity:.65}));scene.add(dust);
  const petals=new T.Group();const petalShape=new T.Shape();petalShape.moveTo(0,-.13);petalShape.bezierCurveTo(-.2,0,-.1,.16,0,.16);petalShape.bezierCurveTo(.2,0,.1,-.1,0,-.13);const petalGeo=new T.ShapeGeometry(petalShape),petalMat=new T.MeshStandardMaterial({color:0xd8bd7d,side:T.DoubleSide,transparent:true,opacity:.28,metalness:.5,roughness:.5});for(let i=0;i<(innerWidth<700?4:8);i++){const p=new T.Mesh(petalGeo,petalMat);p.position.set((Math.random()-.5)*9,(Math.random()-.5)*8,-1);p.scale.setScalar(.55);petals.add(p);}scene.add(petals);
  let pointer={x:0,y:0},openTime=null,on=true,raf,last=0,slow=0,adapted=false;const scrollState={progress:0};
  addEventListener('pointermove',e=>{pointer.x=(e.clientX/innerWidth-.5)*.12;pointer.y=(e.clientY/innerHeight-.5)*.1;},{passive:true});
  addEventListener('invitation-open',()=>openTime=performance.now());
  function align(group,rect,width){const worldHeight=2*camera.position.z*Math.tan(T.MathUtils.degToRad(camera.fov/2));const unit=worldHeight/innerHeight;group.position.x=(rect.left+rect.width/2-innerWidth/2)*unit;group.position.y=-(rect.top+rect.height/2-innerHeight/2)*unit;group.scale.setScalar(rect.width*unit/width);}
  // Optional sensor control: permission is requested only on the visitor's explicit tap.
  if(navigator.maxTouchPoints>0 && 'DeviceOrientationEvent' in window){
   const sensorButton=document.createElement('button');sensorButton.className='sensor-toggle';sensorButton.textContent='Telefon harakati';sensorButton.setAttribute('aria-label','Telefon harakati bilan 3D effektni yoqish');document.querySelector('.cover-bottom').append(sensorButton);
   let listening=false;const orient=e=>{pointer.x=Math.max(-.2,Math.min(.2,(e.gamma||0)/180));pointer.y=Math.max(-.15,Math.min(.15,(e.beta||0)/360));};
   sensorButton.addEventListener('click',async()=>{try{if(listening){removeEventListener('deviceorientation',orient);listening=false;sensorButton.textContent='Telefon harakati';return;}const permission=typeof DeviceOrientationEvent.requestPermission==='function'?await DeviceOrientationEvent.requestPermission():'granted';if(permission==='granted'){addEventListener('deviceorientation',orient,{passive:true});listening=true;sensorButton.textContent='Harakatni o‘chirish';}else window.invitationAnnounce?.('Harakatga ruxsat berilmadi. Taklifnoma odatdagidek ishlaydi.');}catch{window.invitationAnnounce?.('Bu qurilmada harakat effekti mavjud emas.');}});cleanups.push(()=>{removeEventListener('deviceorientation',orient);sensorButton.remove();});
  }
  const cover=document.querySelector('.cover'),anchor=document.querySelector('.envelope-stage'),names=document.querySelector('.names');
  let scrollTrigger;const stTimer=setInterval(()=>{if(ST){clearInterval(stTimer);scrollTrigger=ST.create({trigger:document.body,start:'top top',end:'bottom bottom',scrub:1,onUpdate:s=>scrollState.progress=s.progress});}},500);setTimeout(()=>clearInterval(stTimer),12000);
  function animate(t){if(!on||media.matches)return;const delta=t-last;last=t;if(delta>38)slow++;else slow=Math.max(0,slow-1);if(slow>45&&!adapted){adapted=true;renderer.setPixelRatio(1);geo.setDrawRange(0,Math.min(n,18));petals.children.slice(3).forEach(p=>p.visible=false);}
   const cr=cover.getBoundingClientRect(),nr=names.getBoundingClientRect();envelope.visible=cr.bottom>0&&cr.top<innerHeight;rings.visible=nr.bottom>0&&nr.top<innerHeight;dust.visible=cr.bottom>innerHeight*.6;petals.visible=dust.visible;
   let zoom=0;if(openTime!==null){const elapsed=(t-openTime)/1500;const phase=Math.min(1,elapsed);flapPivot.rotation.x=-Math.PI*Math.min(1,phase*2);seal.scale.setScalar(Math.max(.001,1-phase*5));letter.position.y=Math.max(0,phase-.25)*1.4;letter.position.z=phase>.25?.19:.07;zoom=Math.max(0,phase-.7)*1.7;if(elapsed>2.5){openTime=null;flapPivot.rotation.x=0;seal.scale.setScalar(1);letter.position.y=0;letter.position.z=.07;}}
   camera.position.z=9-scrollState.progress*.12;align(envelope,anchor.getBoundingClientRect(),4.3);envelope.scale.multiplyScalar(1+zoom);envelope.rotation.set(pointer.y,-.12+pointer.x,-.04+Math.sin(t*.0007)*.018);
   if(rings.visible){const box={left:nr.left+nr.width*.3,top:nr.top+nr.height*.35,width:nr.width*.4,height:nr.height*.3};align(rings,box,3.5);rings.rotation.y=t*.0002+scrollState.progress*.6;rings.rotation.z=Math.sin(t*.0002)*.12;}
   dust.rotation.y=t*.000025;petals.children.forEach((p,i)=>{p.rotation.x=t*.0004+i;p.rotation.z=t*.00015+i;p.position.y=4-((t*.00012+i*1.3)%8);});renderer.render(scene,camera);raf=requestAnimationFrame(animate);
  }
  renderer.render(scene,camera);root.classList.add('webgl-cover');raf=requestAnimationFrame(animate);
  document.addEventListener('visibilitychange',()=>{on=!document.hidden;if(on){last=performance.now();raf=requestAnimationFrame(animate);}else cancelAnimationFrame(raf);});
  const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);};addEventListener('resize',resize,{passive:true});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();on=false;cancelAnimationFrame(raf);root.classList.remove('webgl-cover');canvas.style.display='none';});
  cleanups.push(()=>{on=false;cancelAnimationFrame(raf);clearInterval(stTimer);scrollTrigger?.kill();root.classList.remove('webgl-cover');renderer.dispose();canvas.style.display='none';});
 }).catch(()=>{});
}
media.addEventListener('change',()=>{if(media.matches){cleanups.forEach(fn=>fn());ST?.getAll().forEach(t=>t.kill());gsap?.globalTimeline.clear();document.querySelectorAll('.name-letter').forEach(el=>{el.style.clipPath='none';el.style.transform='none';el.style.opacity=1;});}});
