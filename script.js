
const STORAGE_KEY = 'shimi-looks-state-v1';

const COLOR_LIBRARY = {
  ivory: {id:'ivory', he:'שנהב', en:'Ivory', hex:'#EADBC7', family:'light'},
  linen: {id:'linen', he:'לבן פשתן', en:'Linen', hex:'#F1E5D6', family:'light'},
  oat: {id:'oat', he:'שיבולת', en:'Oat', hex:'#DCCAAE', family:'light'},
  sand: {id:'sand', he:'חול', en:'Sand', hex:'#D9C2A2', family:'warm-neutral'},
  camel: {id:'camel', he:'קאמל', en:'Camel', hex:'#C79A6B', family:'warm-neutral'},
  cognac: {id:'cognac', he:'קוניאק', en:'Cognac', hex:'#A6653D', family:'warm-neutral'},
  cocoa: {id:'cocoa', he:'קקאו', en:'Cocoa', hex:'#6A442D', family:'dark-neutral'},
  espresso: {id:'espresso', he:'אספרסו', en:'Espresso', hex:'#4F2E20', family:'dark-neutral'},
  bark: {id:'bark', he:'קליפת עץ', en:'Bark', hex:'#705241', family:'dark-neutral'},
  navy: {id:'navy', he:'כחול עמוק', en:'Navy', hex:'#1F4065', family:'blue'},
  cobalt: {id:'cobalt', he:'קובלט', en:'Cobalt', hex:'#29548A', family:'blue'},
  indigo: {id:'indigo', he:'אינדיגו', en:'Indigo', hex:'#3A3C73', family:'blue'},
  slate: {id:'slate', he:'אבן כחולה', en:'Slate', hex:'#677C96', family:'blue'},
  teal: {id:'teal', he:'טיל כהה', en:'Deep Teal', hex:'#2B6264', family:'blue-green'},
  sage: {id:'sage', he:'מרווה', en:'Sage', hex:'#9AA68E', family:'green'},
  eucalyptus: {id:'eucalyptus', he:'אקליפטוס', en:'Eucalyptus', hex:'#819A87', family:'green'},
  olive: {id:'olive', he:'זית', en:'Olive', hex:'#7F7A4D', family:'green'},
  moss: {id:'moss', he:'טחב', en:'Moss', hex:'#6B7354', family:'green'},
  blush: {id:'blush', he:'סומק', en:'Blush', hex:'#D8B4A4', family:'soft'},
  dustyrose: {id:'dustyrose', he:'ורוד עתיק', en:'Dusty Rose', hex:'#C98C85', family:'soft'},
  mauve: {id:'mauve', he:'מאוב', en:'Mauve', hex:'#A88CA2', family:'soft'},
  lavgray: {id:'lavgray', he:'לבנדר מעושן', en:'Lavender Gray', hex:'#B2ADC3', family:'soft'},
  plum: {id:'plum', he:'שזיף', en:'Plum', hex:'#6B355F', family:'purple'},
  fig: {id:'fig', he:'תאנה', en:'Fig', hex:'#5D2E4F', family:'purple'},
  bordeaux: {id:'bordeaux', he:'בורדו', en:'Bordeaux', hex:'#6B2831', family:'red-purple'},
  terracotta: {id:'terracotta', he:'טרה קוטה', en:'Terracotta', hex:'#C8713F', family:'warm-accent'},
  rust: {id:'rust', he:'חלודה', en:'Rust', hex:'#A8532C', family:'warm-accent'},
  coral: {id:'coral', he:'קורל', en:'Coral', hex:'#D98963', family:'warm-accent'},
  ochre: {id:'ochre', he:'אוכרה', en:'Ochre', hex:'#C78E1A', family:'warm-accent'},
  marigold: {id:'marigold', he:'חרדל זהוב', en:'Marigold', hex:'#D7A722', family:'warm-accent'},
  charcoal: {id:'charcoal', he:'פחם', en:'Charcoal', hex:'#3B3A3D', family:'dark-neutral'},
  black: {id:'black', he:'שחור', en:'Black', hex:'#101216', family:'dark-neutral'}
};

const ROLE_GROUPS = {
  light: ['ivory','linen','oat'],
  warmLight: ['oat','sand','linen'],
  warmNeutral: ['sand','camel','cognac'],
  darkNeutral: ['cocoa','espresso','bark','charcoal','black'],
  blue: ['navy','cobalt','indigo','slate'],
  green: ['sage','eucalyptus','olive','moss'],
  soft: ['blush','dustyrose','mauve','lavgray'],
  purple: ['plum','fig','bordeaux'],
  warmAccent: ['terracotta','rust','coral','ochre','marigold'],
  jewel: ['cobalt','indigo','plum','fig','teal','bordeaux'],
  coolAccent: ['cobalt','slate','teal','lavgray'],
  softAccent: ['dustyrose','mauve','blush','sage']
};

const RECIPES = [
  {id:'studio-1', title:'שילוב מתוחכם עם עומק וצבע', roles:['light','blue','purple','warmAccent'], baseMap:{top:0,bottom:1,shoes:2,accessory:3}, weight:1.1},
  {id:'studio-2', title:'ניטרלים חמים עם אקסנט קר', roles:['warmLight','warmNeutral','blue','darkNeutral'], baseMap:{top:0,bottom:3,shoes:1,accessory:2}, weight:1.0},
  {id:'studio-3', title:'רך, בוגר ולא מתאמץ', roles:['light','green','soft','darkNeutral'], baseMap:{top:0,bottom:1,shoes:3,accessory:2}, weight:1.0},
  {id:'studio-4', title:'בסיס רגוע עם עקיצה אמיתית', roles:['light','darkNeutral','warmAccent','purple'], baseMap:{top:0,bottom:1,shoes:2,accessory:3}, weight:1.0},
  {id:'studio-5', title:'קלאסי עם אקסנט אופנתי', roles:['light','blue','warmNeutral','soft'], baseMap:{top:0,bottom:1,shoes:2,accessory:3}, weight:1.0},
  {id:'studio-6', title:'עמוק, ארצי ומדויק', roles:['warmLight','green','warmAccent','darkNeutral'], baseMap:{top:0,bottom:1,shoes:3,accessory:2}, weight:1.0},
  {id:'studio-7', title:'שיק שקט עם טוויסט קטן', roles:['light','soft','blue','warmNeutral'], baseMap:{top:1,bottom:2,shoes:3,accessory:0}, weight:0.95},
  {id:'studio-8', title:'חם וקר עם איזון יפה', roles:['warmLight','warmAccent','blue','darkNeutral'], baseMap:{top:0,bottom:2,shoes:3,accessory:1}, weight:1.0},
  {id:'studio-9', title:'אבקתי ומעודן אבל לא משעמם', roles:['light','soft','green','darkNeutral'], baseMap:{top:0,bottom:2,shoes:3,accessory:1}, weight:0.95},
  {id:'studio-10', title:'קונטרסט מעניין אבל לביש', roles:['light','jewel','warmNeutral','darkNeutral'], baseMap:{top:0,bottom:1,shoes:2,accessory:3}, weight:1.0},
  {id:'studio-11', title:'לוק שמשלב רוך עם נוכחות', roles:['warmLight','soft','purple','warmNeutral'], baseMap:{top:1,bottom:2,shoes:3,accessory:0}, weight:0.9},
  {id:'studio-12', title:'נינוח, אומנותי ומדויק', roles:['light','green','blue','warmAccent'], baseMap:{top:0,bottom:2,shoes:1,accessory:3}, weight:1.0}
];

const MAP_VARIANTS = [
  {top:0,bottom:1,shoes:2,accessory:3},
  {top:0,bottom:2,shoes:1,accessory:3},
  {top:1,bottom:0,shoes:2,accessory:3},
  {top:1,bottom:2,shoes:3,accessory:0},
  {top:2,bottom:1,shoes:3,accessory:0},
  {top:0,bottom:3,shoes:1,accessory:2}
];

const state = loadState();

const el = {
  todayScreen: document.getElementById('todayScreen'),
  anchorScreen: document.getElementById('anchorScreen'),
  lookbookScreen: document.getElementById('lookbookScreen'),
  paletteRow: document.getElementById('paletteRow'),
  mappingList: document.getElementById('mappingList'),
  lookTitle: document.getElementById('lookTitle'),
  lookVibe: document.getElementById('lookVibe'),
  whyWorks: document.getElementById('whyWorks'),
  saveLookBtn: document.getElementById('saveLookBtn'),
  refreshLookBtn: document.getElementById('refreshLookBtn'),
  moreOptionsBtn: document.getElementById('moreOptionsBtn'),
  pieceChoices: document.getElementById('pieceChoices'),
  familyChoices: document.getElementById('familyChoices'),
  colorChoices: document.getElementById('colorChoices'),
  buildAroundBtn: document.getElementById('buildAroundBtn'),
  anchorModeBtn: document.getElementById('anchorModeBtn'),
  anchorResultCard: document.getElementById('anchorResultCard'),
  anchorLookTitle: document.getElementById('anchorLookTitle'),
  anchorLookVibe: document.getElementById('anchorLookVibe'),
  anchorPaletteRow: document.getElementById('anchorPaletteRow'),
  anchorMappingList: document.getElementById('anchorMappingList'),
  anchorWhyWorks: document.getElementById('anchorWhyWorks'),
  anchorNextBtn: document.getElementById('anchorNextBtn'),
  anchorSaveBtn: document.getElementById('anchorSaveBtn'),
  lookbookList: document.getElementById('lookbookList'),
  lookbookCount: document.getElementById('lookbookCount'),
  lookbookSearch: document.getElementById('lookbookSearch'),
  navBtns: [...document.querySelectorAll('.nav-btn')],
  screens: [...document.querySelectorAll('.screen')],
  lookDialog: document.getElementById('lookDialog'),
  dialogDate: document.getElementById('dialogDate'),
  dialogTitle: document.getElementById('dialogTitle'),
  dialogVibe: document.getElementById('dialogVibe'),
  dialogPalette: document.getElementById('dialogPalette'),
  dialogMapping: document.getElementById('dialogMapping'),
  dialogWhy: document.getElementById('dialogWhy'),
  closeDialogBtn: document.getElementById('closeDialogBtn'),
  infoBtn: document.getElementById('infoBtn'),
  infoDialog: document.getElementById('infoDialog'),
  closeInfoBtn: document.getElementById('closeInfoBtn'),
  closeInfoCta: document.getElementById('closeInfoCta'),
  toast: document.getElementById('toast')
};

init();

function init(){
  if(!state.currentLook){
    state.currentLook = generateBestLook();
    state.history.unshift(state.currentLook.signature);
    persist();
  }
  renderToday();
  renderAnchor();
  renderLookbook();
  bindEvents();
  showScreen(state.activeScreen || 'todayScreen');
  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
}

function bindEvents(){
  el.refreshLookBtn.addEventListener('click', ()=> {
    state.currentLook = generateBestLook();
    state.history.unshift(state.currentLook.signature);
    state.history = state.history.slice(0, 60);
    persist();
    renderToday();
    toast('הבא בתור ✨');
  });

  el.saveLookBtn.addEventListener('click', ()=> saveCurrentLook());
  el.anchorModeBtn.addEventListener('click', ()=> showScreen('anchorScreen'));
  el.buildAroundBtn.addEventListener('click', ()=> buildAnchorLook());
  el.anchorNextBtn.addEventListener('click', ()=> buildAnchorLook());
  el.anchorSaveBtn.addEventListener('click', ()=> {
    if(state.anchorLook) saveCurrentLook(state.anchorLook);
  });
  el.lookbookSearch.addEventListener('input', renderLookbook);

  el.navBtns.forEach(btn => btn.addEventListener('click', ()=> showScreen(btn.dataset.screen)));
  el.closeDialogBtn.addEventListener('click', ()=> el.lookDialog.close());
  el.infoBtn.addEventListener('click', ()=> el.infoDialog.showModal());
  el.closeInfoBtn.addEventListener('click', ()=> el.infoDialog.close());
  el.closeInfoCta.addEventListener('click', ()=> el.infoDialog.close());
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      return {
        currentLook: parsed.currentLook || null,
        anchorLook: parsed.anchorLook || null,
        anchorPiece: parsed.anchorPiece || 'bottom',
        anchorFamily: parsed.anchorFamily || 'חום',
        anchorColorId: parsed.anchorColorId || 'cocoa',
        lookbook: parsed.lookbook || [],
        history: parsed.history || [],
        activeScreen: parsed.activeScreen || 'todayScreen'
      };
    }
  }catch(e){}
  return { currentLook:null, anchorLook:null, anchorPiece:'bottom', anchorFamily:'חום', anchorColorId:'cocoa', lookbook:[], history:[], activeScreen:'todayScreen' };
}

function persist(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showScreen(id){
  state.activeScreen = id;
  el.screens.forEach(screen => screen.classList.toggle('active', screen.id===id));
  el.navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.screen===id));
  persist();
}

function saveCurrentLook(look = state.currentLook){
  if(state.lookbook.some(item => item.signature === look.signature)){
    toast('הלוק הזה כבר שמור בלוקבוק ♡');
    return;
  }
  state.lookbook.unshift({...look, savedAt: new Date().toISOString()});
  state.lookbook = state.lookbook.slice(0, 200);
  persist();
  renderLookbook();
  toast('נשמר ללוקבוק 💫');
}

function renderToday(){
  const look = state.currentLook;
  el.lookTitle.textContent = look.title;
  el.lookVibe.textContent = look.vibe;
  el.whyWorks.textContent = look.why;
  renderPalette(el.paletteRow, look.colors);
  renderMapping(el.mappingList, look.mapping);
}


const PIECES = [
  {id:'top', label:'עליון', icon:'👚'},
  {id:'bottom', label:'תחתון', icon:'👖'},
  {id:'shoes', label:'נעליים', icon:'👟'},
  {id:'accessory', label:'אביזר', icon:'👜'}
];

const COLOR_FAMILIES = {
  'חום': ['camel','cognac','cocoa','espresso','bark'],
  'שמנת': ['ivory','linen','oat','sand'],
  'כחול': ['navy','cobalt','indigo','slate'],
  'ירוק': ['sage','eucalyptus','olive','moss','teal'],
  'ורוד/סגול': ['blush','dustyrose','mauve','lavgray','plum','fig'],
  'אדום/חם': ['bordeaux','terracotta','rust','coral'],
  'צהוב/זהב': ['ochre','marigold'],
  'כהה': ['charcoal','black','espresso','navy']
};

function renderAnchor(){
  renderPieceChoices();
  renderFamilyChoices();
  renderColorChoices();
  if(state.anchorLook){
    renderAnchorLook(state.anchorLook);
  }
}

function renderPieceChoices(){
  if(!el.pieceChoices) return;
  el.pieceChoices.innerHTML = PIECES.map(piece => `
    <button class="choice-btn ${state.anchorPiece===piece.id?'selected':''}" data-piece="${piece.id}">
      <span>${piece.icon}</span>
      <strong>${piece.label}</strong>
    </button>
  `).join('');
  [...el.pieceChoices.querySelectorAll('.choice-btn')].forEach(btn => {
    btn.addEventListener('click', () => {
      state.anchorPiece = btn.dataset.piece;
      persist();
      renderAnchor();
    });
  });
}

function renderFamilyChoices(){
  if(!el.familyChoices) return;
  el.familyChoices.innerHTML = Object.keys(COLOR_FAMILIES).map(family => `
    <button class="family-btn ${state.anchorFamily===family?'selected':''}" data-family="${family}">${family}</button>
  `).join('');
  [...el.familyChoices.querySelectorAll('.family-btn')].forEach(btn => {
    btn.addEventListener('click', () => {
      state.anchorFamily = btn.dataset.family;
      state.anchorColorId = COLOR_FAMILIES[state.anchorFamily][0];
      persist();
      renderAnchor();
    });
  });
}

function renderColorChoices(){
  if(!el.colorChoices) return;
  const ids = COLOR_FAMILIES[state.anchorFamily] || COLOR_FAMILIES['חום'];
  el.colorChoices.innerHTML = ids.map(id => {
    const c = COLOR_LIBRARY[id];
    return `<button class="color-btn ${state.anchorColorId===id?'selected':''}" data-color="${id}">
      <span class="color-chip" style="background:${c.hex}"></span>
      <strong>${c.he}</strong>
    </button>`;
  }).join('');
  [...el.colorChoices.querySelectorAll('.color-btn')].forEach(btn => {
    btn.addEventListener('click', () => {
      state.anchorColorId = btn.dataset.color;
      persist();
      renderAnchor();
    });
  });
}

function buildAnchorLook(){
  const anchorColor = COLOR_LIBRARY[state.anchorColorId] || COLOR_LIBRARY.cocoa;
  state.anchorLook = generateBestAnchoredLook(state.anchorPiece, anchorColor);
  state.history.unshift(state.anchorLook.signature);
  state.history = state.history.slice(0, 60);
  persist();
  renderAnchorLook(state.anchorLook);
  toast('בנינו סביב הפריט שלך ✨');
}

function renderAnchorLook(look){
  if(!look || !el.anchorResultCard) return;
  el.anchorResultCard.hidden = false;
  el.anchorLookTitle.textContent = look.title;
  el.anchorLookVibe.textContent = look.vibe;
  el.anchorWhyWorks.textContent = look.why;
  renderPalette(el.anchorPaletteRow, look.colors);
  renderMapping(el.anchorMappingList, look.mapping);
  const lockedRow = el.anchorMappingList.querySelector(`[data-role="${state.anchorPiece}"]`);
  if(lockedRow) lockedRow.classList.add('locked');
}

function renderLookbook(){
  const q = el.lookbookSearch.value.trim().toLowerCase();
  const list = state.lookbook.filter(item => {
    if(!q) return true;
    const hay = [item.title, item.vibe, item.why, ...item.colors.map(c=>c.he), ...Object.values(item.mapping).map(m=>m.color.he + ' ' + m.text)].join(' ').toLowerCase();
    return hay.includes(q);
  });
  el.lookbookCount.textContent = state.lookbook.length;
  el.lookbookList.innerHTML = '';

  if(!list.length){
    el.lookbookList.innerHTML = `<div class="card empty-state"><strong>עדיין אין לוקים שמורים</strong><br>כשתשמרי לוק, הוא יופיע פה.</div>`;
    return;
  }

  list.forEach(item => {
    const card = document.createElement('article');
    card.className = 'look-card saved-card';
    card.innerHTML = `
      <div class="saved-top">
        <div>
          <h3 class="saved-title">${item.title}</h3>
          <p class="saved-vibe">${item.vibe}</p>
        </div>
        <span class="saved-date">${formatDate(item.savedAt)}</span>
      </div>
      <div class="saved-swatches">${item.colors.map(c=>`<span class="mini-dot" style="background:${c.hex}"></span>`).join('')}</div>
      <div class="saved-bottom">
        <button class="text-btn open-btn">פתחי לוק</button>
        <button class="text-btn delete-btn">מחיקה</button>
      </div>
    `;
    card.querySelector('.open-btn').addEventListener('click', ()=> openLookDialog(item));
    card.querySelector('.delete-btn').addEventListener('click', ()=> {
      if(!confirm(`למחוק את "${item.title}" מהלוקבוק?`)) return;
      state.lookbook = state.lookbook.filter(x => x.signature !== item.signature);
      persist();
      renderLookbook();
      toast('הלוק נמחק');
    });
    el.lookbookList.appendChild(card);
  });
}

function openLookDialog(look){
  el.dialogDate.textContent = formatDate(look.savedAt);
  el.dialogTitle.textContent = look.title;
  el.dialogVibe.textContent = look.vibe;
  el.dialogWhy.textContent = look.why;
  renderPalette(el.dialogPalette, look.colors);
  renderMapping(el.dialogMapping, look.mapping);
  el.lookDialog.showModal();
}

function renderPalette(container, colors){
  container.innerHTML = colors.map(color => `
    <div class="swatch-card">
      <div class="swatch" style="background:${color.hex}"></div>
      <strong>${color.he}</strong>
      <span>${color.en}</span>
    </div>`).join('');
}

function renderMapping(container, mapping){
  const labels = {
    top: 'עליון',
    bottom: 'תחתון',
    shoes: 'נעליים',
    accessory: 'אביזר'
  };
  container.innerHTML = Object.entries(labels).map(([key,label]) => {
    const item = mapping[key];
    return `<div class="mapping-row" data-role="${key}"><small>${label}</small><strong>${item.text}</strong><span class="mapping-dot" style="background:${item.color.hex}"></span></div>`;
  }).join('');
}

function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('he-IL', {day:'numeric', month:'long'});
}

function toast(msg){
  el.toast.textContent = msg;
  el.toast.classList.add('show');
  clearTimeout(el.toast._timer);
  el.toast._timer = setTimeout(()=> el.toast.classList.remove('show'), 2300);
}

function generateBestLook(extraExclude = []){
  const candidates = [];
  for(let i=0; i<28; i++) candidates.push(generateLook());
  candidates.sort((a,b) => scoreLook(b, extraExclude) - scoreLook(a, extraExclude));
  return candidates[0];
}

function generateLook(){
  const recipe = pickWeighted(RECIPES, 'weight');
  const pickedColors = [];
  recipe.roles.forEach(role => {
    pickedColors.push(pickColorForRole(role, pickedColors));
  });
  const colors = pickedColors;
  let mapTemplate = Math.random() < 0.55 ? recipe.baseMap : MAP_VARIANTS[Math.floor(Math.random()*MAP_VARIANTS.length)];
  const mapping = buildMapping(colors, mapTemplate);
  const title = buildTitle(colors);
  const vibe = buildVibe(recipe, colors);
  const why = buildWhy(recipe, colors, mapping);
  const signature = [...colors.map(c=>c.id).sort(), Object.values(mapTemplate).join('-')].join('|');
  return { recipeId: recipe.id, colors, mapping, title, vibe, why, signature, createdAt: new Date().toISOString() };
}

function pickColorForRole(role, previousColors = []){
  const options = (ROLE_GROUPS[role] || []).map(id => COLOR_LIBRARY[id]);
  const prevFamilies = previousColors.filter(Boolean).map(c=>c.family);
  const weighted = options.map(color => {
    let w = 1;
    if(prevFamilies.includes(color.family)) w *= 0.25;
    const recentFamilies = recentColorFamilies();
    if(recentFamilies.includes(color.family)) w *= 0.45;
    const recentIds = recentColorIds();
    if(recentIds.includes(color.id)) w *= 0.35;
    return { ...color, _w:w };
  });
  return pickWeighted(weighted, '_w');
}

function recentLooks(limit = 6){
  const recentSaved = state.lookbook.slice(0, limit).map(item => item.colors);
  const current = state.currentLook ? [state.currentLook.colors] : [];
  return [...current, ...recentSaved].flat();
}

function recentColorFamilies(){ return recentLooks().map(c=>c.family); }
function recentColorIds(){ return recentLooks().map(c=>c.id); }

function scoreLook(look, extraExclude = []){
  let score = 100;
  const recentFamilies = recentColorFamilies();
  const recentIds = recentColorIds();
  look.colors.forEach(color => {
    const familyCount = recentFamilies.filter(f => f===color.family).length;
    const idCount = recentIds.filter(id => id===color.id).length;
    score -= familyCount * 9;
    score -= idCount * 18;
  });
  if(state.lookbook.some(item => item.signature === look.signature)) score -= 90;
  if(state.history.slice(0, 12).includes(look.signature)) score -= 120;
  if(extraExclude.includes(look.signature)) score -= 120;
  // bonus for balanced diversity
  const uniqueFamilies = new Set(look.colors.map(c=>c.family)).size;
  score += uniqueFamilies * 6;
  const hasNeutral = look.colors.some(c=>['light','warm-neutral','dark-neutral'].includes(c.family));
  const hasAccent = look.colors.some(c=>['warm-accent','purple','blue','green','soft','red-purple'].includes(c.family));
  if(hasNeutral && hasAccent) score += 10;
  return score + Math.random()*3;
}

function buildMapping(colors, template){
  const [a,b,c,d] = colors;
  const byIndex = [a,b,c,d];
  return {
    top: { color: byIndex[template.top], text: topText(byIndex[template.top]) },
    bottom: { color: byIndex[template.bottom], text: bottomText(byIndex[template.bottom]) },
    shoes: { color: byIndex[template.shoes], text: shoesText(byIndex[template.shoes]) },
    accessory: { color: byIndex[template.accessory], text: accessoryText(byIndex[template.accessory]) }
  };
}

function topText(color){
  const map = {
    light:'חולצה או טי',
    'warm-neutral':'חולצה רכה',
    'dark-neutral':'עליונית או טופ',
    blue:'חולצה או סריג',
    green:'חולצה או סריג',
    soft:'חולצה רכה',
    purple:'חולצה או טופ',
    'warm-accent':'חולצה עם נוכחות',
    'red-purple':'חולצה או טופ'
  };
  return `${map[color.family] || 'חולצה'} ב${color.he}`;
}
function bottomText(color){
  const map = {
    light:'מכנסיים בהירים',
    'warm-neutral':'מכנסיים או חצאית',
    'dark-neutral':'ג׳ינס או מכנסיים',
    blue:'ג׳ינס או מכנסיים',
    green:'מכנסיים',
    soft:'חצאית או מכנסיים',
    purple:'מכנסיים',
    'warm-accent':'מכנסיים עם טוויסט',
    'red-purple':'מכנסיים'
  };
  return `${map[color.family] || 'מכנסיים'} ב${color.he}`;
}
function shoesText(color){
  const map = {
    light:'נעליים עדינות',
    'warm-neutral':'נעליים או מגפונים',
    'dark-neutral':'נעליים כהות',
    blue:'נעליים או נעלי עקב',
    green:'נעליים',
    soft:'נעליים עדינות',
    purple:'נעליים',
    'warm-accent':'נעליים עם עניין',
    'red-purple':'נעליים'
  };
  return `${map[color.family] || 'נעליים'} ב${color.he}`;
}
function accessoryText(color){
  const map = {
    light:'תיק או תכשיט',
    'warm-neutral':'תיק או חגורה',
    'dark-neutral':'תיק או חגורה',
    blue:'תיק או עגילים',
    green:'תיק או צעיף',
    soft:'תיק או תכשיט',
    purple:'תיק או שפתון',
    'warm-accent':'תיק, שפתון או לק',
    'red-purple':'תיק או שפתון'
  };
  return `${map[color.family] || 'אביזר'} ב${color.he}`;
}

function buildTitle(colors){
  const majors = [colors[0], colors[1], colors[2]];
  return `${majors[0].he}, ${majors[1].he} ו${majors[2].he}`;
}

function buildVibe(recipe, colors){
  const lines = [
    `שילוב ${recipe.title} – אבל עדיין לביש בבוקר אמיתי.`,
    `בסיס מדויק עם ${colors[2].he} שנותן טוויסט קטן.`,
    `נעים לעין, לא צפוי מדי, ומרגיש אסוף.`,
    `לוק שלא צועק – אבל ברור שיש בו מחשבה.`
  ];
  return lines[Math.floor(Math.random()*lines.length)];
}

function buildWhy(recipe, colors, mapping){
  const [c1,c2,c3,c4] = colors;
  const parts = [
    `יש כאן איזון בין ${c1.he} ל${c2.he},`,
    `${c3.he} מכניס עומק או עקיצה צבעונית,`,
    `ו${c4.he} קושר את הכול יחד בלי להעמיס.`
  ];
  if(mapping.accessory.color.family === 'warm-accent' || mapping.accessory.color.family === 'purple'){
    parts.push('האקסנט באביזר שומר על הלוק חכם ולא כבד.');
  } else {
    parts.push('הבסיס נשאר לביש, והעניין קורה במינון נכון.');
  }
  return parts.join(' ');
}


function generateBestAnchoredLook(piece, anchorColor){
  const candidates = [];
  for(let i=0; i<36; i++) candidates.push(generateAnchoredLook(piece, anchorColor));
  candidates.sort((a,b)=>scoreLook(b, []) - scoreLook(a, []));
  return candidates[0];
}

function generateAnchoredLook(piece, anchorColor){
  const compatible = compatibleRolesFor(anchorColor);
  const colors = [anchorColor];
  while(colors.length < 4){
    const role = compatible[Math.floor(Math.random()*compatible.length)];
    const color = pickColorForRole(role, colors);
    if(!colors.some(c=>c.id===color.id)) colors.push(color);
  }

  const mapping = {};
  mapping[piece] = { color: anchorColor, text: anchoredText(piece, anchorColor) };

  const remainingRoles = ['top','bottom','shoes','accessory'].filter(r=>r!==piece);
  const remainingColors = colors.filter(c=>c.id!==anchorColor.id);

  remainingRoles.forEach((role, idx)=>{
    const color = chooseBestForRole(role, remainingColors, idx);
    mapping[role] = { color, text: roleText(role, color) };
    const ci = remainingColors.findIndex(c=>c.id===color.id);
    if(ci >= 0) remainingColors.splice(ci,1);
  });

  const orderedColors = [mapping.top.color, mapping.bottom.color, mapping.shoes.color, mapping.accessory.color];
  const otherNames = orderedColors.filter(c=>c.id!==anchorColor.id).slice(0,2).map(c=>c.he).join(' ו');
  const title = `${anchorColor.he} עם ${otherNames}`;
  const vibe = `התחלנו מ${pieceLabel(piece)} ב${anchorColor.he}, ובנינו סביבו שילוב מלא שלא מרגיש מאולץ.`;
  const why = `ה${anchorColor.he} הוא העוגן של הלוק. הוספנו צבע שמאיר, צבע שמאזן, ואקסנט קטן כדי שהשילוב ירגיש מתוכנן ולא מקרי.`;
  const signature = `anchor-${piece}-${anchorColor.id}|${orderedColors.map(c=>c.id).join('|')}`;
  return { recipeId:'anchor', colors: orderedColors, mapping, title, vibe, why, signature, createdAt: new Date().toISOString() };
}

function compatibleRolesFor(color){
  const fam = color.family;
  if(['dark-neutral','warm-neutral'].includes(fam)) return ['light','blue','soft','green','warmAccent','purple'];
  if(['light'].includes(fam)) return ['darkNeutral','blue','green','soft','warmAccent','purple'];
  if(['blue','green'].includes(fam)) return ['light','warmNeutral','darkNeutral','soft','warmAccent'];
  if(['soft','purple','red-purple'].includes(fam)) return ['light','warmNeutral','darkNeutral','blue','green'];
  if(['warm-accent'].includes(fam)) return ['light','darkNeutral','blue','green','warmNeutral'];
  return ['light','warmNeutral','darkNeutral','blue','green','soft'];
}

function chooseBestForRole(role, colors, idx){
  if(!colors.length) return COLOR_LIBRARY.ivory;
  const pref = {
    top: ['light','soft','blue','green','warm-accent','dark-neutral','warm-neutral'],
    bottom: ['dark-neutral','blue','green','warm-neutral','purple','light'],
    shoes: ['warm-neutral','dark-neutral','light','blue','green','soft'],
    accessory: ['warm-accent','purple','blue','soft','green','dark-neutral','warm-neutral','light']
  }[role] || [];
  return [...colors].sort((a,b)=>{
    const ai = pref.indexOf(a.family);
    const bi = pref.indexOf(b.family);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  })[0] || colors[idx % colors.length];
}

function pieceLabel(piece){
  return ({top:'עליון', bottom:'תחתון', shoes:'נעליים', accessory:'אביזר'})[piece] || 'פריט';
}

function anchoredText(piece, color){
  return `${pieceLabel(piece)} ב${color.he}`;
}

function roleText(role, color){
  if(role==='top') return topText(color);
  if(role==='bottom') return bottomText(color);
  if(role==='shoes') return shoesText(color);
  return accessoryText(color);
}


function pickWeighted(items, weightKey){
  const total = items.reduce((sum, item) => sum + (Number(item[weightKey]) || 1), 0);
  let r = Math.random() * total;
  for(const item of items){
    r -= (Number(item[weightKey]) || 1);
    if(r <= 0) return item;
  }
  return items[items.length - 1];
}
