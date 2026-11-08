'use strict';

const wardrobeRoles = {shoes:'נעליים', top:'חולצות', bottom:'מכנסיים', outerwear:'ג׳קטים', accessory:'תיקים'};
const lightBlueIds = new Set(['powderblue','sky','cloudblue','denimlight','cornflower','capri']);
let wardrobeDraft;
let wardrobeRole = 'shoes';

function resetWardrobeCaches(){
  wadaCatalogCache = null;
  personalRatingCache = null;
  personalPairCache = null;
}

function wardrobeFamily(color){
  if(lightBlueIds.has(color.id))return 'תכלת';
  const family = wadaColorGroupById.get(color.id);
  if(family === 'כחול / תכלת')return 'כחול';
  if(family === 'אדום מוגבל')return 'אדום';
  if(family === 'black')return 'אפור / שחור';
  return family || 'גוונים נוספים';
}

function wardrobeColorGroups(role,search){
  const groups = new Map();
  const query = search.trim().toLowerCase();
  const colors = Object.values(COLORS).filter(color => catalogAllowsRole(color,role));
  for(const color of colors){
    const family = wardrobeFamily(color);
    if(![family,color.he,color.en].some(label => label.toLowerCase().includes(query)))continue;
    if(!groups.has(family))groups.set(family,[]);
    groups.get(family).push(color);
  }
  const order = ['תכלת','כחול','ירוק','ורוד','סגול','אדום','צהוב / כתום','בז׳ / חום','לבן / שמנת','אפור / שחור'];
  return [...groups].sort(([a],[b]) => order.indexOf(a)-order.indexOf(b)).map(([family,items])=>[
    family,items.sort((a,b)=>wadaLab(b.hex)[0]-wadaLab(a.hex)[0])
  ]);
}

function renderWardrobeCount(){
  const count = wardrobeDraft[wardrobeRole].size;
  $('wardrobeCount').textContent = count ? wardrobeRoles[wardrobeRole]+' · '+count+' להורדה' : wardrobeRoles[wardrobeRole]+' · כל הגוונים זמינים';
}

function renderWardrobeGroups(){
  const groups = wardrobeColorGroups(wardrobeRole,$('wardrobeSearch').value);
  const selected = wardrobeDraft[wardrobeRole];
  const container = $('wardrobeGroups');
  container.innerHTML = groups.map(([family,colors])=>{
    const all = colors.every(color=>selected.has(color.id));
    const chips = colors.map(color=>`<label class="wardrobe-chip">
      <input type="checkbox" value="${escapeStudio(color.id)}" ${selected.has(color.id)?'checked':''}>
      <span class="wardrobe-swatch" aria-hidden="true" style="--shade:${escapeStudio(color.hex)}"></span><span>${escapeStudio(color.he)}</span>
    </label>`).join('');
    return `<section class="wardrobe-group" aria-label="${escapeStudio(family)}">
      <div class="wardrobe-family"><h3>${escapeStudio(family)} <small>· ${colors.length}</small></h3>
      <button type="button" data-group-toggle aria-label="${all?'החזרת':'סימון'} כל הגוונים המוצגים בקבוצת ${escapeStudio(family)}">${all?'החזרת הכול':'סימון הכול'}</button></div>
      <div class="wardrobe-grid">${chips}</div></section>`;
  }).join('') || '<p class="wardrobe-no-match">לא נמצאו גוונים בחיפוש הזה.</p>';
  renderWardrobeCount();
}

function chooseWardrobeRole(role){
  wardrobeRole = role;
  for(const button of $('wardrobeRoles').children){
    button.setAttribute('aria-pressed',String(button.dataset.role === role));
  }
  renderWardrobeGroups();
  $('wardrobeGroups').scrollTop = 0;
}

function openWardrobe(){
  const saved = normalizeWardrobeExclusions(state.wardrobeExclusions);
  wardrobeDraft = Object.fromEntries(Object.entries(saved).map(([role,ids])=>[role,new Set(ids)]));
  $('wardrobeSearch').value = '';
  chooseWardrobeRole('shoes');
  $('wardrobeDialog').showModal();
  if(location.hash === '#wardrobe')history.replaceState(null,'',location.pathname + location.search);
  $('wardrobeRoles').firstElementChild.focus();
}

function saveWardrobe(){
  const before = state.wardrobeExclusions, previousLook = state.currentLook;
  state.wardrobeExclusions = Object.fromEntries(Object.entries(wardrobeDraft).map(([role,ids])=>[role,[...ids]]));
  resetWardrobeCaches();
  try{
    if(!previousLook || !WADA_ROLES.every(role => canUseColorForRole(previousLook.mapping[role].color,role))){
      state.currentLook = null;
      state.currentLook = selectAvailableStudioLook(previousLook?.mapping.bottom.fabric === 'denim');
    }
    state.currentLook = applySeasonToLook(state.currentLook);
    if(!saveState())throw Error('wardrobe storage');
  }catch(error){
    state.wardrobeExclusions = before;
    state.currentLook = previousLook;
    resetWardrobeCaches();
    $('wardrobeCount').textContent = 'הבחירה לא נשמרה. נסי שוב.';
    return;
  }
  studioUndo = studioUndo.filter(({look})=>WADA_ROLES.every(role=>canUseColorForRole(look.mapping[role].color,role)));
  $('wardrobeDialog').close();
  if($('settingsDialog').open)$('settingsDialog').close();
  renderToday();
  toast('בחירת הצבעים נשמרה');
}

function updateWardrobeGroup(section){
  const boxes = [...section.querySelectorAll('input')];
  const all = boxes.every(box=>box.checked);
  const button = section.querySelector('[data-group-toggle]');
  button.textContent = all?'החזרת הכול':'סימון הכול';
  button.setAttribute('aria-label',(all?'החזרת':'סימון')+' כל הגוונים המוצגים בקבוצת '+section.getAttribute('aria-label'));
  renderWardrobeCount();
}

function bindWardrobe(){
  $('wardrobeRoles').innerHTML = Object.entries(wardrobeRoles).map(([role,label])=>
    `<button type="button" data-role="${role}">${label}</button>`).join('');
  on('openWardrobe','click',openWardrobe);
  on('emptyWardrobe','click',openWardrobe);
  on('cancelWardrobe','click',()=>$('wardrobeDialog').close());
  on('saveWardrobe','click',saveWardrobe);
  on('wardrobeRoles','click',event=>{
    const button=event.target.closest('[data-role]');
    if(button)chooseWardrobeRole(button.dataset.role);
  });
  on('wardrobeSearch','input',()=>{
    renderWardrobeGroups();
    $('wardrobeGroups').scrollTop = 0;
  });
  on('wardrobeGroups','change',event=>{
    const box=event.target;
    if(box.checked)wardrobeDraft[wardrobeRole].add(box.value);
    else wardrobeDraft[wardrobeRole].delete(box.value);
    updateWardrobeGroup(box.closest('section'));
  });
  on('wardrobeGroups','click',event=>{
    const button=event.target.closest('[data-group-toggle]');
    if(!button)return;
    const section=button.closest('section'), boxes=[...section.querySelectorAll('input')];
    const mark=boxes.some(box=>!box.checked);
    for(const box of boxes){
      box.checked=mark;
      if(mark)wardrobeDraft[wardrobeRole].add(box.value);
      else wardrobeDraft[wardrobeRole].delete(box.value);
    }
    updateWardrobeGroup(section);
  });
}
