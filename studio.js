'use strict';

const STUDIO_ROLES = ['top','bottom','shoes','accessory'];
const WINTER_ROLES = ['top','outerwear','bottom','shoes','accessory'];
const STUDIO_LABELS = {top:'חולצה',outerwear:'ג׳קט',bottom:'מכנסי בד',shoes:'נעליים',accessory:'תיק'};
const WINTER_PATCH = {x:210,y:245,w:550,h:600};
function studioView(){
  return state.seasonMode==='summer' ? 'summer' : state.showJacket ? 'jacket' : 'sleeves';
}
function visibleRoles(view){return view==='jacket' ? WINTER_ROLES : STUDIO_ROLES;}
function studioRoleLabel(role,mapping,view=studioView()){
  if(role==='top')return view==='summer'?'חולצה קצרה':'חולצה ארוכה';
  if(role==='bottom'&&mapping.bottom.fabric==='denim')return 'מכנסי ג׳ינס';
  return STUDIO_LABELS[role];
}
function artSignature(mapping,view=studioView()){
  return [view,mapping.bottom.fabric||'cloth',...visibleRoles(view).map(r=>mapping[r].color.id)].join('|');
}
const CHARACTER_FILES = {base:'assets/shimi-character-art-v190.png',...Object.fromEntries(STUDIO_ROLES.map(r=>[r,`assets/art-mask-${r}-v190.png`]))};
const STUDIO_ICONS = {
  settings:'<path d="M4 6h6m4 0h6M4 12h10m4 0h2M4 18h2m4 0h10"/><circle cx="12" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
  zoom:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  unlock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 7.5-2m-3.5 10v2"/>',
  replace:'<path d="M20 7H8l3-3M4 17h12l-3 3M4 10V7m16 7v3"/>',
  next:'<path d="M20 12H4m6-6-6 6 6 6"/>',
  previous:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  chevron:'<path d="m6 9 6 6 6-6"/>'
};
function studioIcon(name){return `<svg viewBox="0 0 24 24" aria-hidden="true">${STUDIO_ICONS[name]||''}</svg>`;}
function escapeStudio(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function parseCharacterHex(value){const m=String(value||'').match(/^#([0-9a-f]{6})$/i);if(!m)return [128,128,128];const n=parseInt(m[1],16);return [(n>>16)&255,(n>>8)&255,n&255];}
const characterAssets=new Map();
let jacketPromise=null;
let characterPaintSeq=0;
let studioDetailSeq=0;
let studioDetailRole=null;
let studioUndo=[];
let studioExporting=false;
const studioRasterCache=new Map();

function loadCharacterImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('טעינת האיור נכשלה'));img.src=src;});}
function loadCharacterAssets(view=studioView()){
  const season=view==='summer'?'summer':'winter';
  if(!characterAssets.has(season)){
    characterAssets.set(season,prepareCharacterAssets(season).catch(err=>{
      characterAssets.delete(season);
      throw err;
    }));
  }
  return characterAssets.get(season);
}

async function prepareCharacterAssets(season){
  const files=[CHARACTER_FILES.base,...STUDIO_ROLES.map(r=>CHARACTER_FILES[r])];
  const winter=season==='winter',patch=WINTER_PATCH;
  if(winter)files.push('assets/long-sleeves-v340.webp','assets/long-sleeves-roles-v340.png');
  const [base,...images]=await Promise.all(files.map(loadCharacterImage));
  const w=base.naturalWidth,h=base.naturalHeight,work=document.createElement('canvas');
  work.width=w;work.height=h;
  const ctx=work.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(base,0,0);
  let rolePatch;
  if(winter){
    ctx.drawImage(images[4],patch.x,patch.y);
    const patchCanvas=document.createElement('canvas');
    patchCanvas.width=patch.w;patchCanvas.height=patch.h;
    const patchCtx=patchCanvas.getContext('2d');
    patchCtx.drawImage(images[5],0,0);
    rolePatch=patchCtx.getImageData(0,0,patch.w,patch.h).data;
  }
  const basePixels=ctx.getImageData(0,0,w,h);
  const pixels={},means={},bounds={},masks={};
  for(let r=0;r<STUDIO_ROLES.length;r++){
    const role=STUDIO_ROLES[r],img=images[r];
    if(img.naturalWidth!==w||img.naturalHeight!==h)throw Error('מידות שכבות האיור אינן תואמות');
    ctx.clearRect(0,0,w,h);ctx.drawImage(img,0,0);const raw=ctx.getImageData(0,0,w,h).data;
    if(winter){
      for(let y=0;y<patch.h;y++)for(let x=0;x<patch.w;x++){
        raw[((y+patch.y)*w+x+patch.x)*4]=rolePatch[(y*patch.w+x)*4]===(r+1)*40?255:0;
      }
    }
    const indices=[],light=[],alpha=new Uint8Array(w*h);let sum=0,minX=w,minY=h,maxX=0,maxY=0;
    for(let p=0;p<w*h;p++){
      const i=p*4;
      if(!raw[i])continue;
      const lum=.2126*basePixels.data[i]+.7152*basePixels.data[i+1]+.0722*basePixels.data[i+2];
      indices.push(p);light.push(Math.round(lum));alpha[p]=raw[i];sum+=lum;
      const x=p%w,y=Math.floor(p/w);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
    }
    if(!indices.length)throw Error('שכבת צבע ריקה');
    pixels[role]={indices:new Uint32Array(indices),light:new Uint8Array(light)};masks[role]=alpha;means[role]=sum/indices.length;
    bounds[role]={x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
  }
  return {w,h,basePixels,pixels,means,bounds,masks,season};
}

function loadJacket(){
  if(!jacketPromise)jacketPromise=loadCharacterImage('assets/open-jacket-v340.png').then(img=>{
    const {x,y,w,h}=WINTER_PATCH,work=document.createElement('canvas');work.width=w;work.height=h;
    const ctx=work.getContext('2d');ctx.drawImage(img,0,0);
    const data=ctx.getImageData(0,0,w,h).data;
    const indices=[],light=[],opacity=[];let sum=0;
    for(let p=0;p<w*h;p++){
      const i=p*4;
      if(!data[i+3])continue;
      indices.push(p);light.push(data[i]);opacity.push(data[i+3]);sum+=data[i];
    }
    return {indices:Uint32Array.from(indices),light:Uint8Array.from(light),opacity:Uint8Array.from(opacity),
      mean:sum/indices.length,bounds:{x,y,w,h}};
  }).catch(err=>{jacketPromise=null;throw err;});
  return jacketPromise;
}

function paintJacket(bitmap,jacket,color){
  const {indices,light,opacity,mean,bounds}=jacket,target=parseCharacterHex(color.hex);
  const table=new Uint8ClampedArray(768);
  for(let l=0;l<256;l++)table.set(recolorArtPixel(target,l,mean,'outerwear'),l*3);
  for(let n=0;n<indices.length;n++){
    const p=indices[n],x=p%bounds.w+bounds.x,y=Math.floor(p/bounds.w)+bounds.y;
    const i=(y*bitmap.width+x)*4,t=light[n]*3,a=opacity[n]/255;
    for(let c=0;c<3;c++)bitmap.data[i+c]+=a*(table[t+c]-bitmap.data[i+c]);
  }
}

function recolorArtPixel(target,lum,mean,role){
  // Matte pigments keep their selected hue. Lighter cloth has softer folds;
  // bag leather keeps a little more contrast. Ink and pencil texture remain.
  const lightness=(.2126*target[0]+.7152*target[1]+.0722*target[2])/255;
  const fold=Math.tanh(Math.log(Math.max(.06,lum/Math.max(1,mean)))*1.2);
  const depth=(role==='accessory'?.66:.58)-.25*lightness;
  if(fold<0)return target.map(c=>c*(1+fold*depth));
  const lift=((role==='accessory'?.15:.10)+.29*lightness)*fold;
  return target.map(c=>c+(255-c)*lift);
}
async function renderCharacterBitmap(mapping,view=studioView()){
  const assets=await loadCharacterAssets(view),{w,h,basePixels,pixels,means}=assets;
  const denim=mapping.bottom.fabric==='denim'?await loadDenimTexture(assets):null;
  const out=new ImageData(new Uint8ClampedArray(basePixels.data),w,h);
  for(const role of STUDIO_ROLES){
    const jeans=role==='bottom'&&denim;
    const hex=mapping[role]?.color?.hex||'#888888',key=assets.season+(jeans?'denim':role)+hex;let rgb=studioRasterCache.get(key);
    const {indices}=pixels[role],light=jeans?denim.light:pixels[role].light;
    if(!rgb){
      const target=parseCharacterHex(hex),table=new Uint8ClampedArray(768);rgb=new Uint8ClampedArray(indices.length*3);
      for(let l=0;l<256;l++)table.set(recolorArtPixel(target,l,jeans?denim.mean:means[role],role),l*3);
      for(let n=0;n<indices.length;n++){const t=light[n]*3,i=n*3;rgb[i]=table[t];rgb[i+1]=table[t+1];rgb[i+2]=table[t+2];}
      // Bound memory on long browsing sessions (roughly 10 MB at most).
      if(studioRasterCache.size>=16)studioRasterCache.delete(studioRasterCache.keys().next().value);
      studioRasterCache.set(key,rgb);
    }
    for(let n=0;n<indices.length;n++){const i=indices[n]*4,j=n*3;out.data[i]=rgb[j];out.data[i+1]=rgb[j+1];out.data[i+2]=rgb[j+2];}
  }
  if(view==='jacket')paintJacket(out,await loadJacket(),mapping.outerwear.color);
  return out;
}

// Only the existing trouser mask receives the alternate fabric. Regular looks never load it.
function loadDenimTexture(assets){
  const {w,h,pixels}=assets;
  if(!assets.denimTexture)assets.denimTexture=loadCharacterImage('assets/denim-weave-v330.png').then(img=>{
    if(img.naturalWidth!==w||img.naturalHeight!==h)throw Error('מידות שכבת הג׳ינס אינן תואמות');
    const work=document.createElement('canvas');work.width=w;work.height=h;
    const ctx=work.getContext('2d');ctx.drawImage(img,0,0);
    const raw=ctx.getImageData(0,0,w,h).data,indices=pixels.bottom.indices,light=new Uint8Array(indices.length);
    let sum=0;for(let i=0;i<light.length;i++){light[i]=raw[indices[i]*4];sum+=light[i];}
    return {light,mean:sum/light.length};
  }).catch(err=>{assets.denimTexture=null;throw err;});
  return assets.denimTexture;
}

async function paintCharacter(canvas,mapping,view=studioView()){
  if(!canvas||!mapping)return;
  const seq=++characterPaintSeq,frame=canvas.closest('.character-frame'),status=frame?.querySelector('.art-status');
  canvas.dataset.requested=artSignature(mapping,view);
  canvas.dataset.paintSeq=String(seq);
  if(frame)frame.setAttribute('aria-busy','true');
  try{
    const bitmap=await renderCharacterBitmap(mapping,view);
    if(canvas.dataset.paintSeq!==String(seq)||!canvas.isConnected)return;
    // Trim only the unused background so the full figure fills a phone screen.
    canvas.width=628;canvas.height=1620;canvas.getContext('2d').putImageData(bitmap,-170,-10);
    canvas.dataset.painted='true';canvas.dataset.signature=artSignature(mapping,view);
    canvas.setAttribute('aria-label','איור הלוק: '+visibleRoles(view).map(r=>`${studioRoleLabel(r,mapping,view)} ${mapping[r].color.he}`).join(', '));
    if(status)status.hidden=true;
    if(frame)frame.setAttribute('aria-busy','false');
  }catch(err){
    if(canvas.dataset.paintSeq!==String(seq)||!canvas.isConnected)return;
    // Never show original garment colors as if they were the chosen palette.
    if(status){status.hidden=false;status.innerHTML='<span>האיור לא נטען. אפשר לנסות שוב בלי להחליף לוק.</span><button type="button" data-retry-art>נסי שוב</button>';}
    if(frame)frame.setAttribute('aria-busy','false');
    console.warn('Character assets unavailable',err.message);
  }
}

function renderLookVisual(container,mapping){
  const view=studioView();
  if(!container||!mapping)return;
  if(!container.querySelector('[data-character-canvas]')){
    container.innerHTML=`<div class="character-frame" aria-busy="true"><div class="character-art"><canvas class="character-canvas" data-character-canvas role="img"></canvas><button class="art-inspect" type="button" data-inspect-art aria-label="הגדלת איור הלוק"><span>${studioIcon('zoom')}</span></button><span class="stage-caption" lang="en">The art of getting dressed.</span><div class="art-status" role="status">מכינה את האיור שלך…</div></div></div><div class="character-role-grid" aria-label="צבעי הלוק">${WINTER_ROLES.map(role=>`<article class="character-role" data-role-row="${role}"><button class="role-inspect" data-inspect-role="${role}" type="button"><span class="character-role-dot"></span><span><span class="character-role-label">${STUDIO_LABELS[role]}</span><span class="character-role-name"></span></span></button></article>`).join('')}</div>`;
  }
  const rail=container.querySelector('.character-role-grid');
  rail.style.setProperty('--role-count',visibleRoles(view).length);
  rail.querySelector('[data-role-row="outerwear"]').hidden=view!=='jacket';
  for(const role of visibleRoles(view)){
    const row=rail.querySelector(`[data-role-row="${role}"]`),color=mapping[role].color;
    row.querySelector('.character-role-label').textContent=studioRoleLabel(role,mapping);
    row.querySelector('.character-role-dot').style.background=color.hex;
    row.querySelector('.character-role-name').textContent=color.he;
    row.querySelector('.role-inspect').setAttribute('aria-label',`הגדלת ${studioRoleLabel(role,mapping)} בגוון ${color.he}`);
  }
  const canvas=container.querySelector('[data-character-canvas]');
  if(canvas.dataset.requested!==artSignature(mapping))paintCharacter(canvas,mapping);
}

function rememberStudioPreview(){
  if(!state.currentLook)return;
  studioUndo.push(JSON.parse(JSON.stringify({look:state.currentLook,locks:state.lockedRoles})));
  if(studioUndo.length>12)studioUndo.shift();
}
function updateStudioActions(){
  const next=$('nextLookBtn'),toggle=$('jacketToggle'),previous=$('previousLookBtn'),busy=next?.dataset.busy==='1';
  if(next){next.disabled=busy;next.setAttribute('aria-busy',String(busy));next.innerHTML=busy?'בוחרת שילוב…':`<span>הלוק הבא</span>${studioIcon('next')}`;}
  if(toggle){
    toggle.hidden=state.seasonMode==='summer';
    toggle.disabled=busy;
    toggle.setAttribute('aria-pressed',String(state.showJacket));
    toggle.textContent=state.showJacket?'הסתרת ג׳קט':'הצגת ג׳קט';
  }
  if(previous)previous.disabled=!studioUndo.length||busy;
  if($('sourceTag'))$('sourceTag').textContent=state.currentLook?.wada?`Wada · ${String(state.currentLook.wada.plate).padStart(3,'0')}`:'';
  renderStyleFeedback();
}

function bindStudio(){
  document.querySelectorAll('[data-icon]').forEach(n=>n.innerHTML=studioIcon(n.dataset.icon));
  on('settingsBtn','click',()=>$('settingsDialog').showModal());
  on('closeSettingsBtn','click',()=>$('settingsDialog').close());
  on('jacketToggle','click',()=>{state.showJacket=!state.showJacket;saveState();renderToday();});
  on('previousLookBtn','click',()=>{
    const snapshot=studioUndo.pop();if(!snapshot)return;
    state.currentLook=applySeasonToLook(snapshot.look);state.lockedRoles={};saveState();renderToday();animateLookChange();toast('חזרת ללוק הקודם');
  });
  on('downloadLookBtn','click',downloadStudioLook);
  on('detailDownloadBtn','click',downloadStudioLook);
  on('closeDetailBtn','click',()=>$('artDialog').close());
  on('artDialog','click',e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();}});
  on('artDialog','close',()=>{studioDetailSeq++;});
  document.addEventListener('click',event=>{
    const role=event.target.closest('[data-inspect-role]');
    if(role)openStudioDetail(role.dataset.inspectRole);
    else if(event.target.closest('[data-inspect-art]'))openStudioDetail();
    else if(event.target.closest('[data-retry-art]'))paintCharacter(document.querySelector('[data-character-canvas]'),state.currentLook.mapping);
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelector('.why-card')?.removeAttribute('open');});
}

async function openStudioDetail(role=null){
  const view=studioView();
  studioDetailRole=role;const seq=++studioDetailSeq,dialog=$('artDialog'),canvas=$('detailCanvas'),mapping=JSON.parse(JSON.stringify(state.currentLook.mapping));
  $('detailTitle').textContent=role?`${studioRoleLabel(role,mapping)} · ${mapping[role].color.he}`:'מבט מקרוב';
  $('detailCaption').textContent=role?'מרקם, קפלים ופרטים קטנים':'איור אופנה בצבעים של הלוק שלך';
  $('detailStatus').textContent='טוענת את האיור…';canvas.hidden=true;if(!dialog.open)dialog.showModal();
  try{
    const [bitmap,assets]=await Promise.all([renderCharacterBitmap(mapping,view),loadCharacterAssets(view)]);
    if(seq!==studioDetailSeq||!dialog.open)return;
    const b=role==='outerwear'?WINTER_PATCH:role?assets.bounds[role]:{x:160,y:0,w:650,h:1630},pad=role?30:0;
    const x=Math.max(0,b.x-pad),y=Math.max(0,b.y-pad);
    canvas.width=Math.min(assets.w-x,b.w+pad*2);canvas.height=Math.min(assets.h-y,b.h+pad*2);
    canvas.getContext('2d').putImageData(bitmap,-x,-y);canvas.hidden=false;$('detailStatus').textContent='';
    canvas.setAttribute('aria-label',$('detailTitle').textContent);
  }catch(err){if(seq===studioDetailSeq)$('detailStatus').textContent='האיור לא נטען. סגרי ונסי שוב.';}
}

async function downloadStudioLook(){
  if(studioExporting||!state.currentLook)return;
  const view=studioView(),roles=visibleRoles(view);
  studioExporting=true;const look=JSON.parse(JSON.stringify(state.currentLook));
  $('downloadLookBtn').disabled=true;$('detailDownloadBtn').disabled=true;
  try{
    const bitmap=await renderCharacterBitmap(look.mapping,view);
    await document.fonts.ready;
    const out=document.createElement('canvas');out.width=1080;out.height=1920;const ctx=out.getContext('2d');
    ctx.fillStyle='#f7f3ec';ctx.fillRect(0,0,1080,1920);
    ctx.textAlign='center';ctx.fillStyle='#34281f';ctx.font='600 55px "Cormorant Garamond", Georgia';ctx.fillText('SHIMI LOOKS',540,91);
    const figure=document.createElement('canvas');figure.width=bitmap.width;figure.height=bitmap.height;figure.getContext('2d').putImageData(bitmap,0,0);
    ctx.drawImage(figure,170,0,628,1630,253,125,574,1490);
    ctx.direction='rtl';ctx.font='600 35px Assistant, sans-serif';ctx.fillText(look.title,540,1668,940);
    for(let i=0;i<roles.length;i++){
      const slot=980/roles.length;
      const role=roles[i],c=look.mapping[role].color,x=1030-(i+.5)*slot;
      ctx.fillStyle=c.hex;ctx.beginPath();ctx.roundRect(x-74,1710,148,54,9);ctx.fill();
      ctx.fillStyle='#756356';ctx.font='26px Assistant, sans-serif';ctx.fillText(studioRoleLabel(role,look.mapping,view),x,1801);
      ctx.fillStyle='#34281f';ctx.font='600 27px Assistant, sans-serif';ctx.fillText(c.he,x,1839,slot-12);
    }
    const blob=await new Promise(resolve=>out.toBlob(resolve,'image/png'));if(!blob)throw Error('export');
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`Shimi-Looks-${look.wada?.plate||'look'}.png`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
    toast('תמונת הלוק מוכנה להורדה');
  }catch(err){toast('לא הצלחתי להכין תמונה. נסי שוב.');}
  finally{studioExporting=false;$('downloadLookBtn').disabled=false;$('detailDownloadBtn').disabled=false;}
}
