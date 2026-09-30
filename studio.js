'use strict';

const STUDIO_ROLES = ['top','bottom','shoes','accessory'];
const STUDIO_LABELS = {top:'עליון',bottom:'תחתון',shoes:'נעליים',accessory:'תיק'};
const CHARACTER_FILES = {base:'assets/shimi-character-art-v190.png',...Object.fromEntries(STUDIO_ROLES.map(r=>[r,`assets/art-mask-${r}-v190.png`]))};
const STUDIO_ICONS = {
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
let characterAssetPromise=null;
let characterPaintSeq=0;
let studioDetailSeq=0;
let studioDetailRole=null;
let studioUndo=[];
let studioExporting=false;
const studioRasterCache=new Map();

function loadCharacterImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('טעינת האיור נכשלה'));img.src=src;});}
function loadCharacterAssets(){
  if(characterAssetPromise)return characterAssetPromise;
  characterAssetPromise=(async()=>{
    const [base,...images]=await Promise.all([loadCharacterImage(CHARACTER_FILES.base),...STUDIO_ROLES.map(r=>loadCharacterImage(CHARACTER_FILES[r]))]);
    const w=base.naturalWidth,h=base.naturalHeight,work=document.createElement('canvas');work.width=w;work.height=h;
    const ctx=work.getContext('2d',{willReadFrequently:true});ctx.drawImage(base,0,0);const basePixels=ctx.getImageData(0,0,w,h);
    const pixels={},means={},bounds={},masks={};
    for(let r=0;r<STUDIO_ROLES.length;r++){
      const role=STUDIO_ROLES[r],img=images[r];
      if(img.naturalWidth!==w||img.naturalHeight!==h)throw Error('מידות שכבות האיור אינן תואמות');
      ctx.clearRect(0,0,w,h);ctx.drawImage(img,0,0);const raw=ctx.getImageData(0,0,w,h).data;
      const indices=[],light=[],alpha=new Uint8ClampedArray(w*h);let sum=0,minX=w,minY=h,maxX=0,maxY=0;
      for(let p=0;p<w*h;p++){
        const m=raw[p*4];if(!m)continue;
        const i=p*4,lum=.2126*basePixels.data[i]+.7152*basePixels.data[i+1]+.0722*basePixels.data[i+2];
        indices.push(p);light.push(Math.round(lum));alpha[p]=m;sum+=lum;
        const x=p%w,y=Math.floor(p/w);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
      }
      if(!indices.length)throw Error('שכבת צבע ריקה');
      pixels[role]={indices:new Uint32Array(indices),light:new Uint8Array(light)};masks[role]=alpha;means[role]=sum/indices.length;
      bounds[role]={x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
    }
    return {base,w,h,basePixels,pixels,means,bounds,masks};
  })().catch(err=>{characterAssetPromise=null;throw err;});
  return characterAssetPromise;
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
async function renderCharacterBitmap(mapping){
  const assets=await loadCharacterAssets(),{w,h,basePixels,pixels,means}=assets;
  const out=new ImageData(new Uint8ClampedArray(basePixels.data),w,h);
  for(const role of STUDIO_ROLES){
    const hex=mapping[role]?.color?.hex||'#888888',key=role+hex;let rgb=studioRasterCache.get(key);
    const {indices,light}=pixels[role];
    if(!rgb){
      const target=parseCharacterHex(hex),table=new Uint8ClampedArray(768);rgb=new Uint8ClampedArray(indices.length*3);
      for(let l=0;l<256;l++)table.set(recolorArtPixel(target,l,means[role],role),l*3);
      for(let n=0;n<indices.length;n++){const t=light[n]*3,i=n*3;rgb[i]=table[t];rgb[i+1]=table[t+1];rgb[i+2]=table[t+2];}
      // Bound memory on long browsing sessions (roughly 10 MB at most).
      if(studioRasterCache.size>=16)studioRasterCache.delete(studioRasterCache.keys().next().value);
      studioRasterCache.set(key,rgb);
    }
    for(let n=0;n<indices.length;n++){const i=indices[n]*4,j=n*3;out.data[i]=rgb[j];out.data[i+1]=rgb[j+1];out.data[i+2]=rgb[j+2];}
  }
  return out;
}

async function paintCharacter(canvas,mapping){
  if(!canvas||!mapping)return;
  const seq=++characterPaintSeq,frame=canvas.closest('.character-frame'),status=frame?.querySelector('.art-status');
  if(frame)frame.setAttribute('aria-busy','true');
  try{
    const bitmap=await renderCharacterBitmap(mapping);
    if(seq!==characterPaintSeq||!canvas.isConnected)return;
    // Trim only the unused background so the full figure fills a phone screen.
    canvas.width=628;canvas.height=1620;canvas.getContext('2d').putImageData(bitmap,-170,-10);
    canvas.dataset.painted='true';canvas.dataset.signature=STUDIO_ROLES.map(r=>mapping[r].color.id).join('|');
    canvas.setAttribute('aria-label','איור הלוק: '+STUDIO_ROLES.map(r=>`${STUDIO_LABELS[r]} ${mapping[r].color.he}`).join(', '));
    if(status)status.hidden=true;
    if(frame)frame.setAttribute('aria-busy','false');
  }catch(err){
    if(seq!==characterPaintSeq||!canvas.isConnected)return;
    // Never show original garment colors as if they were the chosen palette.
    if(status){status.hidden=false;status.innerHTML='<span>האיור לא נטען. אפשר לנסות שוב בלי להחליף לוק.</span><button type="button" data-retry-art>נסי שוב</button>';}
    if(frame)frame.setAttribute('aria-busy','false');
    console.warn('Character assets unavailable',err.message);
  }
}

function renderLookVisual(container,mapping,options={}){
  if(!container||!mapping)return;
  const showControls=options.controls!==false&&container.id==='lookVisual';
  if(!container.querySelector('[data-character-canvas]')){
    container.innerHTML=`<div class="character-frame" aria-busy="true"><div class="character-art"><canvas class="character-canvas" data-character-canvas role="img"></canvas><button class="art-inspect" type="button" data-inspect-art aria-label="הגדלת איור הלוק"><span>${studioIcon('zoom')}</span></button><span class="stage-caption" lang="en">The art of getting dressed.</span><div class="art-status" role="status">מכינה את האיור שלך…</div></div></div><div class="character-role-grid" aria-label="צבעי הלוק">${STUDIO_ROLES.map(role=>`<article class="character-role" data-role-row="${role}"><button class="role-inspect" data-inspect-role="${role}" type="button"><span class="character-role-dot"></span><span><span class="character-role-label">${STUDIO_LABELS[role]}</span><span class="character-role-name"></span><span class="role-lock-note">נעול בלוק הבא</span></span></button>${showControls?`<div class="character-role-controls"><button class="mini-item-btn" data-replace-role="${role}" type="button">${studioIcon('replace')}<span>החלפה</span></button><button class="mini-item-btn lock" data-lock-role="${role}" type="button"></button></div>`:''}</article>`).join('')}</div>`;
  }
  for(const role of STUDIO_ROLES){
    const row=container.querySelector(`[data-role-row="${role}"]`),color=mapping[role].color,locked=!!state.lockedRoles[role]||options.lockedRole===role;
    row.classList.toggle('locked',locked);row.querySelector('.character-role-dot').style.background=color.hex;row.querySelector('.character-role-name').textContent=color.he;
    row.querySelector('.role-inspect').setAttribute('aria-label',`הגדלת ${STUDIO_LABELS[role]} בגוון ${color.he}`);
    const lock=row.querySelector('[data-lock-role]'),replace=row.querySelector('[data-replace-role]');
    if(lock){lock.classList.toggle('active',locked);lock.setAttribute('aria-pressed',String(locked));lock.setAttribute('aria-label',`${locked?'שחרור':'נעילת'} ${STUDIO_LABELS[role]}`);lock.innerHTML=studioIcon(locked?'lock':'unlock');}
    if(replace){replace.disabled=locked;replace.setAttribute('aria-label',`החלפת צבע ${STUDIO_LABELS[role]}`);}
  }
  const canvas=container.querySelector('[data-character-canvas]'),signature=STUDIO_ROLES.map(r=>mapping[r].color.id).join('|');
  if(canvas.dataset.signature!==signature)paintCharacter(canvas,mapping);
}

function rememberStudioPreview(){
  if(!state.currentLook)return;
  studioUndo.push(JSON.parse(JSON.stringify({look:state.currentLook,locks:state.lockedRoles})));
  if(studioUndo.length>12)studioUndo.shift();
}
function updateStudioActions(){
  const next=$('nextLookBtn'),previous=$('previousLookBtn'),n=STUDIO_ROLES.filter(r=>state.lockedRoles[r]).length;
  if(next){next.disabled=n===4||next.dataset.busy==='1';next.setAttribute('aria-busy',String(next.dataset.busy==='1'));next.innerHTML=next.dataset.busy==='1'?'בוחרת שילוב…':`<span>${n===4?'כל הפריטים נעולים':'הלוק הבא'}</span>${n&&n<4?`<span class="lock-summary">${n} ${n===1?'פריט נעול':'פריטים נעולים'}</span>`:''}${studioIcon('next')}`;}
  if(previous)previous.disabled=!studioUndo.length||next?.dataset.busy==='1';
  if($('sourceTag'))$('sourceTag').textContent=state.currentLook?.wada?`Wada · ${String(state.currentLook.wada.plate).padStart(3,'0')}`:'';
}
function bindStudio(){
  document.querySelectorAll('[data-icon]').forEach(n=>n.innerHTML=studioIcon(n.dataset.icon));
  on('previousLookBtn','click',()=>{
    const snapshot=studioUndo.pop();if(!snapshot)return;
    state.currentLook=snapshot.look;state.lockedRoles=snapshot.locks;saveState();renderToday();animateLookChange();toast('חזרת ללוק הקודם');
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
  studioDetailRole=role;const seq=++studioDetailSeq,dialog=$('artDialog'),canvas=$('detailCanvas'),mapping=JSON.parse(JSON.stringify(state.currentLook.mapping));
  $('detailTitle').textContent=role?`${STUDIO_LABELS[role]} · ${mapping[role].color.he}`:'מבט מקרוב';
  $('detailCaption').textContent=role?'מרקם, קפלים ופרטים קטנים':'איור אופנה בצבעים של הלוק שלך';
  $('detailStatus').textContent='טוענת את האיור…';canvas.hidden=true;if(!dialog.open)dialog.showModal();
  try{
    const [bitmap,assets]=await Promise.all([renderCharacterBitmap(mapping),loadCharacterAssets()]);
    if(seq!==studioDetailSeq||!dialog.open)return;
    const b=role?assets.bounds[role]:{x:160,y:0,w:650,h:1630},pad=role?30:0;
    const x=Math.max(0,b.x-pad),y=Math.max(0,b.y-pad);
    canvas.width=Math.min(assets.w-x,b.w+pad*2);canvas.height=Math.min(assets.h-y,b.h+pad*2);
    canvas.getContext('2d').putImageData(bitmap,-x,-y);canvas.hidden=false;$('detailStatus').textContent='';
    canvas.setAttribute('aria-label',$('detailTitle').textContent);
  }catch(err){if(seq===studioDetailSeq)$('detailStatus').textContent='האיור לא נטען. סגרי ונסי שוב.';}
}

async function downloadStudioLook(){
  if(studioExporting||!state.currentLook)return;
  studioExporting=true;const look=JSON.parse(JSON.stringify(state.currentLook));
  $('downloadLookBtn').disabled=true;$('detailDownloadBtn').disabled=true;
  try{
    const bitmap=await renderCharacterBitmap(look.mapping);
    await document.fonts.ready;
    const out=document.createElement('canvas');out.width=1080;out.height=1920;const ctx=out.getContext('2d');
    ctx.fillStyle='#f7f3ec';ctx.fillRect(0,0,1080,1920);
    ctx.textAlign='center';ctx.fillStyle='#34281f';ctx.font='600 55px "Cormorant Garamond", Georgia';ctx.fillText('SHIMI LOOKS',540,91);
    const figure=document.createElement('canvas');figure.width=bitmap.width;figure.height=bitmap.height;figure.getContext('2d').putImageData(bitmap,0,0);
    ctx.drawImage(figure,170,0,628,1630,253,125,574,1490);
    ctx.direction='rtl';ctx.font='600 35px Assistant, sans-serif';ctx.fillText(look.title,540,1668,940);
    for(let i=0;i<4;i++){
      const role=STUDIO_ROLES[i],c=look.mapping[role].color,x=855-i*210;
      ctx.fillStyle=c.hex;ctx.beginPath();ctx.roundRect(x-74,1710,148,54,9);ctx.fill();
      ctx.fillStyle='#756356';ctx.font='26px Assistant, sans-serif';ctx.fillText(STUDIO_LABELS[role],x,1801);
      ctx.fillStyle='#34281f';ctx.font='600 27px Assistant, sans-serif';ctx.fillText(c.he,x,1839,196);
    }
    const blob=await new Promise(resolve=>out.toBlob(resolve,'image/png'));if(!blob)throw Error('export');
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`Shimi-Looks-${look.wada?.plate||'look'}.png`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
    toast('תמונת הלוק מוכנה להורדה');
  }catch(err){toast('לא הצלחתי להכין תמונה. נסי שוב.');}
  finally{studioExporting=false;$('downloadLookBtn').disabled=false;$('detailDownloadBtn').disabled=false;}
}
