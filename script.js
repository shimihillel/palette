function el(id){ return document.getElementById(id); }
function on(id, event, fn){ const node = el(id); if(node) node.addEventListener(event, fn); }

'use strict';

const STORAGE_KEY = 'shimi-looks-v11-earth-balanced';

const COLORS = {
  ivory:{id:'ivory',he:'שנהב',en:'Ivory',hex:'#EADBC7',family:'light'},
  linen:{id:'linen',he:'לבן פשתן',en:'Linen',hex:'#F1E5D6',family:'light'},
  oat:{id:'oat',he:'שיבולת',en:'Oat',hex:'#DCCAAE',family:'light'},
  sand:{id:'sand',he:'חול',en:'Sand',hex:'#D9C2A2',family:'warm-neutral'},
  camel:{id:'camel',he:'קאמל',en:'Camel',hex:'#C79A6B',family:'warm-neutral'},
  cognac:{id:'cognac',he:'קוניאק',en:'Cognac',hex:'#A6653D',family:'warm-neutral'},
  cocoa:{id:'cocoa',he:'קקאו',en:'Cocoa',hex:'#6A442D',family:'dark-neutral'},
  espresso:{id:'espresso',he:'אספרסו',en:'Espresso',hex:'#4F2E20',family:'dark-neutral'},
  bark:{id:'bark',he:'קליפת עץ',en:'Bark',hex:'#705241',family:'dark-neutral'},
  navy:{id:'navy',he:'כחול עמוק',en:'Navy',hex:'#1F4065',family:'blue'},
  cobalt:{id:'cobalt',he:'קובלט',en:'Cobalt',hex:'#29548A',family:'blue'},
  indigo:{id:'indigo',he:'אינדיגו',en:'Indigo',hex:'#3A3C73',family:'blue'},
  slate:{id:'slate',he:'אבן כחולה',en:'Slate',hex:'#677C96',family:'blue'},
  teal:{id:'teal',he:'טיל כהה',en:'Deep Teal',hex:'#2B6264',family:'blue'},
  sage:{id:'sage',he:'מרווה',en:'Sage',hex:'#9AA68E',family:'green'},
  eucalyptus:{id:'eucalyptus',he:'אקליפטוס',en:'Eucalyptus',hex:'#819A87',family:'green'},
  olive:{id:'olive',he:'זית',en:'Olive',hex:'#7F7A4D',family:'green'},
  moss:{id:'moss',he:'טחב',en:'Moss',hex:'#6B7354',family:'green'},
  blush:{id:'blush',he:'סומק',en:'Blush',hex:'#D8B4A4',family:'soft'},
  dustyrose:{id:'dustyrose',he:'ורוד עתיק',en:'Dusty Rose',hex:'#C98C85',family:'soft'},
  mauve:{id:'mauve',he:'מאוב',en:'Mauve',hex:'#A88CA2',family:'soft'},
  lavgray:{id:'lavgray',he:'לבנדר מעושן',en:'Lavender Gray',hex:'#B2ADC3',family:'soft'},
  plum:{id:'plum',he:'שזיף',en:'Plum',hex:'#6B355F',family:'purple'},
  fig:{id:'fig',he:'תאנה',en:'Fig',hex:'#5D2E4F',family:'purple'},
  bordeaux:{id:'bordeaux',he:'בורדו',en:'Bordeaux',hex:'#6B2831',family:'purple'},
  terracotta:{id:'terracotta',he:'טרה קוטה',en:'Terracotta',hex:'#C8713F',family:'warm-accent'},
  rust:{id:'rust',he:'חלודה',en:'Rust',hex:'#A8532C',family:'warm-accent'},
  coral:{id:'coral',he:'קורל',en:'Coral',hex:'#D98963',family:'warm-accent'},
  ochre:{id:'ochre',he:'אוכרה',en:'Ochre',hex:'#C78E1A',family:'warm-accent'},
  marigold:{id:'marigold',he:'חרדל זהוב',en:'Marigold',hex:'#D7A722',family:'warm-accent'},
  charcoal:{id:'charcoal',he:'פחם',en:'Charcoal',hex:'#3B3A3D',family:'dark-neutral'},
  black:{id:'black',he:'שחור',en:'Black',hex:'#101216',family:'dark-neutral'}
};

const GROUPS = {
  light:['ivory','linen','oat'],
  warmLight:['oat','sand','linen'],
  warmNeutral:['sand','camel','cognac'],
  darkNeutral:['cocoa','espresso','bark','charcoal'],
  blue:['navy','cobalt','indigo','slate','teal'],
  green:['sage','eucalyptus','olive','moss'],
  soft:['blush','dustyrose','mauve','lavgray'],
  purple:['plum','fig','bordeaux'],
  warmAccent:['terracotta','rust','coral','ochre','marigold'],
  jewel:['cobalt','indigo','plum','fig','teal','bordeaux']
};

const RECIPES = [
  {title:'חום, ירוק ובורדו',roles:['warmNeutral','green','purple','darkNeutral'],map:{top:1,bottom:3,shoes:0,accessory:2}, weight:1.25},
  {title:'כחול עמוק עם קוניאק',roles:['blue','warmNeutral','darkNeutral','warmAccent'],map:{top:0,bottom:2,shoes:1,accessory:3}, weight:1.20},
  {title:'בורדו עם אדמה וכחול',roles:['purple','warmNeutral','blue','warmAccent'],map:{top:0,bottom:2,shoes:1,accessory:3}, weight:1.20},
  {title:'ירוק בקבוק ושוקולד',roles:['green','darkNeutral','warmNeutral','soft'],map:{top:0,bottom:1,shoes:2,accessory:3}, weight:1.15},
  {title:'חלודה, קקאו וזית',roles:['warmAccent','darkNeutral','green','warmNeutral'],map:{top:0,bottom:1,shoes:3,accessory:2}, weight:1.15},
  {title:'טיל, שזיף וחום',roles:['blue','purple','warmNeutral','green'],map:{top:0,bottom:1,shoes:2,accessory:3}, weight:1.10},
  {title:'אדמתי אבל צבעוני',roles:['warmNeutral','warmAccent','green','blue'],map:{top:2,bottom:0,shoes:1,accessory:3}, weight:1.10},
  {title:'עמוק עם אקסנט חם',roles:['darkNeutral','blue','warmAccent','green'],map:{top:1,bottom:0,shoes:3,accessory:2}, weight:1.05},
  {title:'בורדו, זית וקאמל',roles:['purple','green','warmNeutral','darkNeutral'],map:{top:0,bottom:1,shoes:2,accessory:3}, weight:1.10},
  {title:'כחול ירוק וחום',roles:['blue','green','warmNeutral','darkNeutral'],map:{top:0,bottom:1,shoes:2,accessory:3}, weight:1.10},

  // light appears, but as a rare balancing option — not every look.
  {title:'שנהב כמרכך קטן',roles:['light','purple','green','warmNeutral'],map:{top:1,bottom:2,shoes:3,accessory:0}, weight:0.20},
  {title:'שיבולת עם עומק',roles:['light','blue','warmAccent','darkNeutral'],map:{top:1,bottom:3,shoes:2,accessory:0}, weight:0.18},
  {title:'בהיר עם חום ובורדו',roles:['light','warmNeutral','purple','green'],map:{top:2,bottom:3,shoes:1,accessory:0}, weight:0.18},

  // pink/black are present, but reduced.
  {title:'ורוד עתיק במינון',roles:['soft','green','warmNeutral','blue'],map:{top:1,bottom:2,shoes:3,accessory:0}, weight:0.28},
  {title:'כהה דרמטי במינון',roles:['darkNeutral','purple','warmNeutral','green'],map:{top:1,bottom:0,shoes:2,accessory:3}, weight:0.32}
];

const PIECES = [
  {id:'top',label:'עליון',icon:'👚'},
  {id:'bottom',label:'תחתון',icon:'👖'},
  {id:'shoes',label:'נעליים',icon:'👟'},
  {id:'accessory',label:'אביזר',icon:'👜'}
];

const COLOR_FAMILIES = {
  'חום':['camel','cognac','cocoa','espresso','bark'],
  'שמנת':['ivory','linen','oat','sand'],
  'כחול':['navy','cobalt','indigo','slate','teal'],
  'ירוק':['sage','eucalyptus','olive','moss'],
  'ורוד/סגול':['blush','dustyrose','mauve','lavgray','plum','fig'],
  'אדום/חם':['bordeaux','terracotta','rust','coral'],
  'צהוב/זהב':['ochre','marigold'],
  'כהה':['charcoal','black','espresso','navy']
};

const COLOR_MODES = {
  super:{id:'super', title:'סופר צבע', desc:'4 צבעים, בלי להתנצל', detail:'לימים שבא לך שהלוק ייכנס לפנייך.'},
  half:{id:'half', title:'חצי קלאץ׳', desc:'חצי צבע, חצי איזון', detail:'כשבא לך צבע, אבל לא רעש.'},
  tiny:{id:'tiny', title:'בקטנה ממש', desc:'רגוע עם צבע אחד שעושה עניין', detail:'ליום שקט עם קריצה מדויקת.'}
};

const MODE_LINES = {
  super:[
    'היום הלוק בא לעשות שמח.',
    'צבע, נוכחות, בלי להתנצל.',
    'זה לא לוק, זו הכרזה.'
  ],
  half:[
    'צבעוני, אבל לא מתאמץ מדי.',
    'יש צבע, יש שקט, יש סטייל.',
    'בול באמצע בין וואו לנוח.'
  ],
  tiny:[
    'רגוע עם קריצה אחת שעושה את העבודה.',
    'שקט, אבל לא משעמם.',
    'הצבע קטן, האפקט לא.'
  ]
};

const RELAXED_GROUPS = ['light','warmNeutral','darkNeutral','soft'];
const COLORFUL_GROUPS = ['blue','green','purple','warmAccent'];

const state = loadState();

const $ = (id) => document.getElementById(id);

function loadState(){
  try{
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      currentLook: parsed.currentLook || null,
      anchorLook: parsed.anchorLook || null,
      anchorPiece: parsed.anchorPiece || 'bottom',
      anchorFamily: parsed.anchorFamily || 'חום',
      anchorColorId: parsed.anchorColorId || 'cocoa',
      anchorColorMode: parsed.anchorColorMode || parsed.colorMode || 'super',
      lookbook: parsed.lookbook || [],
      recent: parsed.recent || [],
      colorMode: parsed.colorMode || 'super',
      screen: parsed.screen || 'todayScreen'
    };
  }catch(e){
    return {currentLook:null,anchorLook:null,anchorPiece:'bottom',anchorFamily:'חום',anchorColorId:'cocoa',anchorColorMode:'super',lookbook:[],recent:[],colorMode:'super',screen:'todayScreen'};
  }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function init(){
  try{
    if(!state.currentLook){
      state.currentLook = generateBestLook(state.colorMode || 'super');
      remember(state.currentLook);
      saveState();
    }
    bindEvents();
    renderAll();
    showScreen(state.screen || 'todayScreen');
  }catch(err){
    console.error(err);
    $('lookTitle').textContent = 'אופס, צריך רענון';
    $('lookVibe').textContent = 'היה באג קטן. נסי ללחוץ הבא בתור או לרענן.';
  }
}

function bindEvents(){
  $('nextLookBtn').addEventListener('click', () => {
    state.currentLook = generateBestLook(state.colorMode || 'super');
    remember(state.currentLook);
    saveState();
    renderToday();
    toast('הבא בתור ✨');
  });

  $('saveLookBtn').addEventListener('click', () => saveLook(state.currentLook));
  $('anchorModeBtn').addEventListener('click', () => showScreen('anchorScreen'));
  $('buildAroundBtn').addEventListener('click', () => buildAnchorLook());
  $('anchorNextBtn').addEventListener('click', () => buildAnchorLook());
  $('anchorSaveBtn').addEventListener('click', () => {
    if(state.anchorLook) saveLook(state.anchorLook);
  });

  $('lookbookSearch').addEventListener('input', renderLookbook);
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
  });

  $('closeDialogBtn').addEventListener('click', () => $('lookDialog').close());
  $('infoBtn').addEventListener('click', () => $('infoDialog').showModal());
  $('closeInfoBtn').addEventListener('click', () => $('infoDialog').close());
  $('closeInfoCta').addEventListener('click', () => $('infoDialog').close());
  $('changeColorModeBtn').addEventListener('click', () => openColorModeDialog('today'));
  $('closeColorModeBtn').addEventListener('click', () => $('colorModeDialog').close());
  on('anchorChangeColorModeBtn','click', () => openColorModeDialog('anchor'));
}

function renderAll(){
  renderToday();
  renderAnchor();
  renderLookbook();
}

function showScreen(screenId){
  state.screen = screenId;
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === screenId));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.screen === screenId));
  saveState();
}

function currentMode(){
  return COLOR_MODES[state.colorMode || 'super'] || COLOR_MODES.super;
}

function renderColorModeCard(){
  const mode = currentMode();
  if(el('colorModeTitle')) el('colorModeTitle').textContent = mode.title;
  if(el('colorModeDesc')) el('colorModeDesc').textContent = mode.desc;
}

function renderAnchorColorModeCard(){
  const mode = COLOR_MODES[state.anchorColorMode || state.colorMode || 'super'] || COLOR_MODES.super;
  if(el('anchorColorModeTitle')) el('anchorColorModeTitle').textContent = mode.title;
  if(el('anchorColorModeDesc')) el('anchorColorModeDesc').textContent = mode.desc;
}

function openColorModeDialog(context='today'){
  const activeMode = context === 'anchor'
    ? (state.anchorColorMode || state.colorMode || 'super')
    : (state.colorMode || 'super');

  $('colorModeOptions').innerHTML = Object.values(COLOR_MODES).map(mode => `
    <button class="mode-card ${activeMode === mode.id ? 'selected' : ''}" data-mode="${mode.id}" type="button">
      <strong>${mode.title}</strong>
      <span>${mode.desc}</span>
      <small>${mode.detail}</small>
    </button>
  `).join('');

  document.querySelectorAll('#colorModeOptions .mode-card').forEach(btn => {
    btn.addEventListener('click', () => {
      if(context === 'anchor'){
        state.anchorColorMode = btn.dataset.mode;
        renderAnchorColorModeCard();
        if(state.anchorLook){
          const anchorColor = COLORS[state.anchorColorId] || COLORS.cocoa;
          state.anchorLook = generateBestAnchoredLook(state.anchorPiece, anchorColor, state.anchorColorMode);
          remember(state.anchorLook);
          renderAnchorLook(state.anchorLook);
        }
        saveState();
      }else{
        state.colorMode = btn.dataset.mode;
        state.currentLook = generateBestLook(state.colorMode);
        remember(state.currentLook);
        saveState();
        renderToday();
      }
      $('colorModeDialog').close();
    });
  });

  $('colorModeDialog').showModal();
}

function renderToday(){
  const look = state.currentLook;
  $('lookTitle').textContent = look.title;
  $('lookVibe').textContent = look.vibe || pick(MODE_LINES[state.colorMode || 'super']);
  $('whyWorks').textContent = look.why;
  renderColorModeCard();
  renderPalette($('paletteRow'), look.colors);
  renderMapping($('mappingList'), look.mapping);
}

function renderAnchor(){
  renderAnchorColorModeCard();
  renderPieceChoices();
  renderFamilyChoices();
  renderColorChoices();
  if(state.anchorLook) renderAnchorLook(state.anchorLook);
}

function renderPieceChoices(){
  $('pieceChoices').innerHTML = PIECES.map(piece => `
    <button class="choice-btn ${state.anchorPiece === piece.id ? 'selected' : ''}" data-piece="${piece.id}" type="button">
      <span>${piece.icon}</span>
      <strong>${piece.label}</strong>
    </button>
  `).join('');
  document.querySelectorAll('#pieceChoices .choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.anchorPiece = btn.dataset.piece;
      saveState();
      renderAnchor();
    });
  });
}

function renderFamilyChoices(){
  $('familyChoices').innerHTML = Object.keys(COLOR_FAMILIES).map(family => `
    <button class="family-btn ${state.anchorFamily === family ? 'selected' : ''}" data-family="${family}" type="button">${family}</button>
  `).join('');
  document.querySelectorAll('#familyChoices .family-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.anchorFamily = btn.dataset.family;
      state.anchorColorId = COLOR_FAMILIES[state.anchorFamily][0];
      saveState();
      renderAnchor();
    });
  });
}

function renderColorChoices(){
  const ids = COLOR_FAMILIES[state.anchorFamily] || COLOR_FAMILIES['חום'];
  $('colorChoices').innerHTML = ids.map(id => {
    const c = COLORS[id];
    return `<button class="color-btn ${state.anchorColorId === id ? 'selected' : ''}" data-color="${id}" type="button">
      <span class="color-chip" style="background:${c.hex}"></span>
      <strong>${c.he}</strong>
    </button>`;
  }).join('');
  document.querySelectorAll('#colorChoices .color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.anchorColorId = btn.dataset.color;
      saveState();
      renderAnchor();
    });
  });
}

function buildAnchorLook(){
  const anchorColor = COLORS[state.anchorColorId] || COLORS.cocoa;
  state.anchorLook = generateBestAnchoredLook(state.anchorPiece, anchorColor, state.anchorColorMode || state.colorMode || 'super');
  remember(state.anchorLook);
  saveState();
  renderAnchorLook(state.anchorLook);
  toast('בנינו סביב הפריט שלך ✨');
}

function renderAnchorLook(look){
  renderAnchorColorModeCard();
  $('anchorResultCard').hidden = false;
  $('anchorLookTitle').textContent = look.title;
  $('anchorLookVibe').textContent = look.vibe;
  $('anchorWhyWorks').textContent = look.why;
  renderPalette($('anchorPaletteRow'), look.colors);
  renderMapping($('anchorMappingList'), look.mapping);
  const locked = $('anchorMappingList').querySelector(`[data-role="${state.anchorPiece}"]`);
  if(locked) locked.classList.add('locked');
}

function renderLookbook(){
  const query = ($('lookbookSearch').value || '').trim().toLowerCase();
  const list = state.lookbook.filter(look => {
    if(!query) return true;
    const hay = [look.title, look.vibe, look.why, ...look.colors.map(c => c.he + ' ' + c.en)].join(' ').toLowerCase();
    return hay.includes(query);
  });
  $('lookbookCount').textContent = state.lookbook.length;
  if(!list.length){
    $('lookbookList').innerHTML = `<div class="card empty-state"><strong>עדיין אין לוקים שמורים</strong><br>כשתלחצי שומרת ♡, הלוק יופיע כאן.</div>`;
    return;
  }
  $('lookbookList').innerHTML = list.map((look, index) => `
    <article class="look-card">
      <div class="saved-top">
        <div>
          <h3 class="saved-title">${look.title}</h3>
          <p class="saved-vibe">${look.vibe}</p>
        </div>
        <span class="saved-date">${formatDate(look.savedAt)}</span>
      </div>
      <div class="saved-swatches">${look.colors.map(c => `<span class="mini-dot" style="background:${c.hex}"></span>`).join('')}</div>
      <div class="saved-bottom">
        <button class="text-btn" data-open="${look.signature}" type="button">פתחי לוק</button>
        <button class="text-btn" data-delete="${look.signature}" type="button">מחיקה</button>
      </div>
    </article>
  `).join('');
  document.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => {
    const look = state.lookbook.find(item => item.signature === btn.dataset.open);
    if(look) openDialog(look);
  }));
  document.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => {
    state.lookbook = state.lookbook.filter(item => item.signature !== btn.dataset.delete);
    saveState();
    renderLookbook();
    toast('נמחק מהלוקבוק');
  }));
}

function renderPalette(container, colors){
  container.innerHTML = colors.map(c => `
    <div class="swatch-card">
      <div class="swatch" style="background:${c.hex}"></div>
      <strong>${c.he}</strong>
      <span>${c.en}</span>
    </div>
  `).join('');
}

function renderMapping(container, mapping){
  const labels = {top:'עליון', bottom:'תחתון', shoes:'נעליים', accessory:'אביזר'};
  container.innerHTML = Object.entries(labels).map(([role,label]) => {
    const item = mapping[role];
    return `<div class="mapping-row" data-role="${role}">
      <small>${label}</small>
      <strong>${item.text}</strong>
      <span class="mapping-dot" style="background:${item.color.hex}"></span>
    </div>`;
  }).join('');
}

function openDialog(look){
  $('dialogDate').textContent = formatDate(look.savedAt);
  $('dialogTitle').textContent = look.title;
  $('dialogVibe').textContent = look.vibe;
  $('dialogWhy').textContent = look.why;
  renderPalette($('dialogPalette'), look.colors);
  renderMapping($('dialogMapping'), look.mapping);
  $('lookDialog').showModal();
}

function saveLook(look){
  if(!look) return;
  if(state.lookbook.some(item => item.signature === look.signature)){
    toast('כבר שמור בלוקבוק ♡');
    return;
  }
  state.lookbook.unshift({...look, savedAt:new Date().toISOString()});
  saveState();
  renderLookbook();
  toast('נשמר ללוקבוק ♡');
}

function remember(look){
  state.recent.unshift(look.signature);
  state.recent = state.recent.slice(0, 80);
}


function shuffleArray(arr){
  const copy = [...arr];
  for(let i = copy.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildVariedMapping(colors){
  const nonLight = colors.filter(c => c.family !== 'light');
  const topPool = nonLight.length ? nonLight : colors;

  // Earth/green/bordeaux/blue should often be the top.
  const topPreferred = topPool.filter(c =>
    ['warm-neutral','green','purple','blue','warm-accent','dark-neutral'].includes(c.family)
  );
  const topColor = pick(topPreferred.length ? topPreferred : topPool);

  const remaining = colors.filter(c => c.id !== topColor.id);
  const mapping = { top:{color:topColor, text:roleText('top', topColor)} };

  const preferred = {
    bottom:['dark-neutral','blue','green','warm-neutral','purple','warm-accent','soft','light'],
    shoes:['warm-neutral','dark-neutral','green','blue','warm-accent','purple','light','soft'],
    accessory:['warm-accent','purple','blue','green','warm-neutral','soft','light','dark-neutral']
  };

  ['bottom','shoes','accessory'].forEach(role => {
    const options = remaining.length ? remaining : colors;
    const pref = preferred[role] || [];
    const sorted = [...options].sort((a,b) => {
      const ai = pref.indexOf(a.family);
      const bi = pref.indexOf(b.family);
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    });
    const color = Math.random() < 0.78 ? sorted[0] : pick(options);
    mapping[role] = {color, text:roleText(role, color)};
    const idx = remaining.findIndex(c => c.id === color.id);
    if(idx >= 0) remaining.splice(idx, 1);
  });

  return mapping;
}


function pickWeightedRecipe(recipes){
  const total = recipes.reduce((sum, r) => sum + (r.weight || 1), 0);
  let roll = Math.random() * total;
  for(const recipe of recipes){
    roll -= (recipe.weight || 1);
    if(roll <= 0) return recipe;
  }
  return recipes[recipes.length - 1];
}

function generateBestLook(mode='super'){
  const candidates = Array.from({length:90}, () => generateLook(mode));
  candidates.sort((a,b) => scoreLookWithTopVariety(b) - scoreLookWithTopVariety(a));
  return candidates[0];
}

function scoreLookWithTopVariety(look){
  let s = score(look);
  const families = look.colors ? look.colors.map(c => c.family) : [];
  const ids = look.colors ? look.colors.map(c => c.id) : [];

  // Preferred Shimi zone: earth, brown, green, bordeaux/purple, blues.
  families.forEach(f => {
    if(['warm-neutral','green','purple','blue','warm-accent'].includes(f)) s += 14;
    if(f === 'light') s -= 22;
    if(f === 'soft') s -= 12;
  });

  if(ids.includes('black')) s -= 24;
  if(ids.includes('charcoal')) s -= 10;
  if(families.filter(f => f === 'light').length > 1) s -= 80;
  if(families.filter(f => f === 'soft').length > 1) s -= 40;

  if(look.mapping && look.mapping.top && look.mapping.top.color){
    const top = look.mapping.top.color;
    if(top.family === 'light') s -= 70;
    if(top.family === 'soft') s -= 22;
    if(['green','purple','blue','warm-accent','warm-neutral'].includes(top.family)) s += 22;
  }
  return s;
}

function generateLook(mode='super'){
  if(mode === 'half') return generateHalfClutchLook();
  if(mode === 'tiny') return generateTinyLook();

  const recipe = pickWeightedRecipe(RECIPES);
  let colors = [];
  recipe.roles.forEach(role => colors.push(pickColor(role, colors)));

  // סופר צבע נשאר כמו שהאפליקציה עבדה עד עכשיו.
  const lightCount = colors.filter(c => c.family === 'light').length;
  const softCount = colors.filter(c => c.family === 'soft').length;
  const blackishCount = colors.filter(c => c.id === 'black' || c.id === 'charcoal').length;

  if(lightCount > 1 || softCount > 1 || blackishCount > 1){
    const shimiGroups = ['warmNeutral','green','purple','blue','warmAccent','darkNeutral'];
    colors = [];
    while(colors.length < 4){
      const c = pickColor(pick(shimiGroups), colors);
      if(!colors.some(existing => existing.id === c.id)){
        colors.push(c);
      }
    }
  }

  if(colors.filter(c => c.family === 'light').length > 1){
    const firstLight = colors.find(c => c.family === 'light');
    colors = colors.filter(c => c.family !== 'light');
    colors.push(firstLight);
  }

  colors = colors.slice(0,4);
  return buildLookFromColors(colors, 'super');
}

function generateHalfClutchLook(){
  const relaxedColors = pickRelaxedSet(2);
  let colorA = pickColor(pick(COLORFUL_GROUPS), relaxedColors);
  let colorB = null;
  let tries = 0;
  while(!colorB && tries < 35){
    const c = pickColor(pick(COLORFUL_GROUPS), [...relaxedColors, colorA]);
    if(c.family !== colorA.family && c.id !== colorA.id) colorB = c;
    tries++;
  }
  colorB = colorB || pickColor(pick(COLORFUL_GROUPS), [...relaxedColors, colorA]);
  const colors = shuffleArray([...relaxedColors, colorA, colorB]).slice(0,4);
  return buildLookFromColors(colors, 'half');
}

function generateTinyLook(){
  const relaxedColors = pickRelaxedSet(3);
  let accent = null;
  let tries = 0;
  while(!accent && tries < 35){
    const c = pickColor(pick(COLORFUL_GROUPS), relaxedColors);
    if(!relaxedColors.some(r => r.id === c.id)) accent = c;
    tries++;
  }
  accent = accent || pickColor('warmAccent', relaxedColors);
  const colors = shuffleArray([...relaxedColors, accent]).slice(0,4);
  return buildLookFromColors(colors, 'tiny');
}

function pickRelaxedSet(count){
  const colors = [];
  const sameFamily = Math.random() < 0.55;
  if(sameFamily){
    const group = pick(RELAXED_GROUPS);
    while(colors.length < count && colors.length < (GROUPS[group] || []).length){
      const c = pickColor(group, colors);
      if(!colors.some(x => x.id === c.id)) colors.push(c);
    }
  }
  while(colors.length < count){
    const c = pickColor(pick(RELAXED_GROUPS), colors);
    if(!colors.some(x => x.id === c.id)) colors.push(c);
  }
  return colors.slice(0,count);
}

function buildLookFromColors(colors, mode){
  const mapping = buildVariedMapping(colors);
  const modeLine = pick(MODE_LINES[mode] || MODE_LINES.super);
  const signature = `meter-v12|${mode}|${colors.map(c => c.id).join('|')}|${mapping.top.color.id}|${mapping.bottom.color.id}|${mapping.shoes.color.id}|${mapping.accessory.color.id}`;
  return {
    title: buildTitle(colors),
    vibe: modeLine,
    why: buildWhyByMode(colors, mode),
    colors,
    mapping,
    colorMode:mode,
    signature,
    createdAt:new Date().toISOString()
  };
}

function buildWhyByMode(colors, mode){
  if(mode === 'half'){
    return `יש כאן חצי צבע וחצי איזון: שני צבעים רגועים מחזיקים את הבסיס, ושני צבעים שונים מכניסים עניין בלי להפוך את זה לרעש.`;
  }
  if(mode === 'tiny'){
    return `הבסיס נשאר רגוע, וצבע אחד מכניס את הקריצה. זה שקט, אבל לא משעמם.`;
  }
  return buildWhy(colors);
}

function generateBestAnchoredLook(piece, anchorColor, mode='super'){
  const candidates = Array.from({length:90}, () => generateAnchoredLook(piece, anchorColor, mode));
  const score = look => scoreAnchoredLook(look, piece, anchorColor);
  candidates.sort((a,b) => score(b) - score(a));
  return candidates[0];
}

function generateAnchoredLook(piece, anchorColor, mode='super'){
  let colors;

  if(mode === 'half'){
    const relaxed = pickRelaxedSet(2).filter(c => c.id !== anchorColor.id);
    let colorA = pickColor(pick(COLORFUL_GROUPS), [anchorColor, ...relaxed]);
    let colorB = null;
    let tries = 0;
    while(!colorB && tries < 35){
      const c = pickColor(pick(COLORFUL_GROUPS), [anchorColor, ...relaxed, colorA]);
      if(c.family !== colorA.family && c.id !== colorA.id && c.id !== anchorColor.id) colorB = c;
      tries++;
    }
    colorB = colorB || pickColor(pick(COLORFUL_GROUPS), [anchorColor, ...relaxed, colorA]);
    colors = [anchorColor, ...relaxed, colorA, colorB];
  }else if(mode === 'tiny'){
    const relaxed = pickRelaxedSet(3).filter(c => c.id !== anchorColor.id);
    let accent = pickColor(pick(COLORFUL_GROUPS), [anchorColor, ...relaxed]);
    colors = [anchorColor, ...relaxed, accent];
  }else{
    // סופר צבע נשאר כמו שהיה בגרסת המקור של "בחרתי".
    const roles = compatibleRoles(anchorColor);
    colors = [anchorColor];
    while(colors.length < 4){
      const color = pickColor(pick(roles), colors);
      if(!colors.some(c => c.id === color.id)) colors.push(color);
    }
  }

  const unique = [];
  colors.forEach(c => {
    if(c && !unique.some(x => x.id === c.id)) unique.push(c);
  });
  while(unique.length < 4){
    unique.push(pickColor(pick(['warmNeutral','green','purple','blue','warmAccent','darkNeutral','light','soft']), unique));
  }
  colors = unique.slice(0,4);

  const mapping = {};
  mapping[piece] = {color:anchorColor, text:`${pieceLabel(piece)} ב${anchorColor.he}`};

  const remainingRoles = ['top','bottom','shoes','accessory'].filter(r => r !== piece);
  let remainingColors = colors.filter(c => c.id !== anchorColor.id);

  remainingRoles.forEach(role => {
    const color = bestForRole(role, remainingColors);
    mapping[role] = {color, text: roleText(role, color)};
    remainingColors = remainingColors.filter(c => c.id !== color.id);
  });

  const orderedColors = [mapping.top.color, mapping.bottom.color, mapping.shoes.color, mapping.accessory.color];
  return {
    title:`${anchorColor.he} עם ${orderedColors.filter(c => c.id !== anchorColor.id).slice(0,2).map(c => c.he).join(' ו')}`,
    vibe: pick(MODE_LINES[mode] || MODE_LINES.super),
    why: buildWhyByMode(orderedColors, mode),
    colors:orderedColors,
    mapping,
    colorMode:mode,
    signature:`anchor-v15|${mode}|${piece}|${anchorColor.id}|${orderedColors.map(c => c.id).join('|')}`,
    createdAt:new Date().toISOString()
  };
}

function pickColor(groupName, previous){
  const ids = GROUPS[groupName] || GROUPS.blue;
  const options = ids.map(id => COLORS[id]).filter(Boolean);
  const previousFamilies = previous.map(c => c.family);
  const recentIds = state.lookbook.slice(0,8).flatMap(look => look.colors.map(c => c.id));
  const weighted = options.map(color => {
    let weight = 10;
    if(previousFamilies.includes(color.family)) weight -= 5;
    if(recentIds.includes(color.id)) weight -= 4;
    if(previous.some(c => c.id === color.id)) weight = 0.1;
    return {color, weight:Math.max(0.5, weight)};
  });
  return weightedPick(weighted);
}

function weightedPick(items){
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * total;
  for(const item of items){
    r -= item.weight;
    if(r <= 0) return item.color;
  }
  return items[items.length-1].color;
}

function score(look){
  let s = 100;
  if(state.recent.includes(look.signature)) s -= 60;
  if(state.lookbook.some(item => item.signature === look.signature)) s -= 80;
  const recentColors = state.lookbook.slice(0,8).flatMap(look => look.colors.map(c => c.id));
  look.colors.forEach(c => {
    if(recentColors.includes(c.id)) s -= 10;
  });
  s += new Set(look.colors.map(c => c.family)).size * 7;
  return s + Math.random() * 5;
}

function mapByTemplate(colors, map){
  return {
    top:{color:colors[map.top], text:roleText('top', colors[map.top])},
    bottom:{color:colors[map.bottom], text:roleText('bottom', colors[map.bottom])},
    shoes:{color:colors[map.shoes], text:roleText('shoes', colors[map.shoes])},
    accessory:{color:colors[map.accessory], text:roleText('accessory', colors[map.accessory])}
  };
}

function roleText(role, color){
  if(role === 'top') return `עליון ב${color.he}`;
  if(role === 'bottom') return `תחתון ב${color.he}`;
  if(role === 'shoes') return `נעליים ב${color.he}`;
  return `אביזר ב${color.he}`;
}

function pieceLabel(piece){
  return ({top:'עליון', bottom:'תחתון', shoes:'נעליים', accessory:'אביזר'})[piece] || 'פריט';
}

function compatibleRoles(color){
  const fam = color.family;
  if(['dark-neutral','warm-neutral'].includes(fam)) return ['light','blue','soft','green','warmAccent','purple'];
  if(fam === 'light') return ['darkNeutral','blue','green','soft','warmAccent','purple'];
  if(['blue','green'].includes(fam)) return ['light','warmNeutral','darkNeutral','soft','warmAccent'];
  if(['soft','purple'].includes(fam)) return ['light','warmNeutral','darkNeutral','blue','green'];
  if(fam === 'warm-accent') return ['light','darkNeutral','blue','green','warmNeutral'];
  return ['light','warmNeutral','darkNeutral','blue','green','soft'];
}

function bestForRole(role, colors){
  if(!colors.length) return COLORS.ivory;
  const pref = {
    top:['blue','green','purple','warm-accent','soft','dark-neutral','warm-neutral','light'],
    bottom:['dark-neutral','blue','green','warm-neutral','purple','light'],
    shoes:['warm-neutral','dark-neutral','light','blue','green','soft'],
    accessory:['warm-accent','purple','blue','soft','green','dark-neutral','warm-neutral','light']
  }[role] || [];
  return [...colors].sort((a,b) => {
    const ai = pref.indexOf(a.family);
    const bi = pref.indexOf(b.family);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  })[0];
}

function buildTitle(colors){
  return `${colors[0].he}, ${colors[1].he} ו${colors[2].he}`;
}

function buildVibe(recipe){
  const options = [
    `שילוב ${recipe.title} — אבל עדיין לביש בבוקר אמיתי.`,
    'לוק שלא צועק, אבל ברור שיש בו מחשבה.',
    'שילוב רגוע מספיק ליומיום, עם טוויסט קטן שעושה עניין.',
    'צבעים שנראים כאילו הם נפגשו במקרה, אבל בעצם עובדים מעולה.'
  ];
  return pick(options);
}

function buildWhy(colors){
  return `יש כאן איזון בין ${colors[0].he} ל${colors[1].he}, ${colors[2].he} מכניס עניין, ו${colors[3].he} קושר את הכול יחד בלי להעמיס.`;
}

function pick(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('he-IL', {day:'numeric', month:'long'});
}

function toast(message){
  const t = $('toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

document.addEventListener('DOMContentLoaded', init);
