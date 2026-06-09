
'use strict';

const STORAGE_KEY = 'shimi-looks-v7';

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
  darkNeutral:['cocoa','espresso','bark','charcoal','black'],
  blue:['navy','cobalt','indigo','slate','teal'],
  green:['sage','eucalyptus','olive','moss'],
  soft:['blush','dustyrose','mauve','lavgray'],
  purple:['plum','fig','bordeaux'],
  warmAccent:['terracotta','rust','coral','ochre','marigold'],
  jewel:['cobalt','indigo','plum','fig','teal','bordeaux']
};

const RECIPES = [
  {title:'שילוב מתוחכם עם עומק וצבע',roles:['light','blue','purple','warmAccent'],map:{top:0,bottom:1,shoes:2,accessory:3}},
  {title:'ניטרלים חמים עם אקסנט קר',roles:['warmLight','warmNeutral','blue','darkNeutral'],map:{top:0,bottom:3,shoes:1,accessory:2}},
  {title:'רך, בוגר ולא מתאמץ',roles:['light','green','soft','darkNeutral'],map:{top:0,bottom:1,shoes:3,accessory:2}},
  {title:'בסיס רגוע עם עקיצה אמיתית',roles:['light','darkNeutral','warmAccent','purple'],map:{top:0,bottom:1,shoes:2,accessory:3}},
  {title:'קלאסי עם אקסנט אופנתי',roles:['light','blue','warmNeutral','soft'],map:{top:0,bottom:1,shoes:2,accessory:3}},
  {title:'עמוק, ארצי ומדויק',roles:['warmLight','green','warmAccent','darkNeutral'],map:{top:0,bottom:1,shoes:3,accessory:2}},
  {title:'שיק שקט עם טוויסט קטן',roles:['light','soft','blue','warmNeutral'],map:{top:1,bottom:2,shoes:3,accessory:0}},
  {title:'חם וקר עם איזון יפה',roles:['warmLight','warmAccent','blue','darkNeutral'],map:{top:0,bottom:2,shoes:3,accessory:1}},
  {title:'קונטרסט מעניין אבל לביש',roles:['light','jewel','warmNeutral','darkNeutral'],map:{top:0,bottom:1,shoes:2,accessory:3}}
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
      lookbook: parsed.lookbook || [],
      recent: parsed.recent || [],
      screen: parsed.screen || 'todayScreen'
    };
  }catch(e){
    return {currentLook:null,anchorLook:null,anchorPiece:'bottom',anchorFamily:'חום',anchorColorId:'cocoa',lookbook:[],recent:[],screen:'todayScreen'};
  }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function init(){
  try{
    if(!state.currentLook){
      state.currentLook = generateBestLook();
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
    state.currentLook = generateBestLook();
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

function renderToday(){
  const look = state.currentLook;
  $('lookTitle').textContent = look.title;
  $('lookVibe').textContent = look.vibe;
  $('whyWorks').textContent = look.why;
  renderPalette($('paletteRow'), look.colors);
  renderMapping($('mappingList'), look.mapping);
}

function renderAnchor(){
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
  state.anchorLook = generateBestAnchoredLook(state.anchorPiece, anchorColor);
  remember(state.anchorLook);
  saveState();
  renderAnchorLook(state.anchorLook);
  toast('בנינו סביב הפריט שלך ✨');
}

function renderAnchorLook(look){
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
  const roles = ['top','bottom','shoes','accessory'];

  // Every color can become the top. This fixes the old bias where top was almost always the first/light color.
  const topColor = pick(colors);

  const remaining = colors.filter(c => c.id !== topColor.id);
  const mapping = { top:{color:topColor, text:roleText('top', topColor)} };

  const preferred = {
    bottom:['dark-neutral','blue','green','warm-neutral','purple','red-purple','warm-accent','light','soft'],
    shoes:['warm-neutral','dark-neutral','light','blue','green','purple','soft','warm-accent'],
    accessory:['warm-accent','purple','blue','green','soft','red-purple','dark-neutral','warm-neutral','light']
  };

  ['bottom','shoes','accessory'].forEach(role => {
    const options = remaining.length ? remaining : colors;
    const pref = preferred[role] || [];
    const sorted = [...options].sort((a,b) => {
      const ai = pref.indexOf(a.family);
      const bi = pref.indexOf(b.family);
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    });

    // Most of the time follow styling preference, sometimes deliberately vary.
    const color = Math.random() < 0.72 ? sorted[0] : pick(options);
    mapping[role] = {color, text:roleText(role, color)};
    const idx = remaining.findIndex(c => c.id === color.id);
    if(idx >= 0) remaining.splice(idx, 1);
  });

  return mapping;
}

function generateBestLook(){
  const candidates = Array.from({length:40}, () => generateLook());
  candidates.sort((a,b) => score(b) - score(a));
  return candidates[0];
}

function generateLook(){
  const recipe = pick(RECIPES);
  const colors = [];
  recipe.roles.forEach(role => colors.push(pickColor(role, colors)));

  // v8 fix: mapping is varied instead of forcing the first/light color to be top.
  const mapping = buildVariedMapping(colors);

  const signature = `free|${colors.map(c => c.id).join('|')}|${mapping.top.color.id}|${mapping.bottom.color.id}|${mapping.shoes.color.id}|${mapping.accessory.color.id}`;
  return {
    title: buildTitle(colors),
    vibe: buildVibe(recipe, colors),
    why: buildWhy(colors),
    colors,
    mapping,
    signature,
    createdAt:new Date().toISOString()
  };
}

function generateBestAnchoredLook(piece, anchorColor){
  const candidates = Array.from({length:40}, () => generateAnchoredLook(piece, anchorColor));
  candidates.sort((a,b) => score(b) - score(a));
  return candidates[0];
}

function generateAnchoredLook(piece, anchorColor){
  const roles = compatibleRoles(anchorColor);
  const colors = [anchorColor];
  while(colors.length < 4){
    const color = pickColor(pick(roles), colors);
    if(!colors.some(c => c.id === color.id)) colors.push(color);
  }
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
    vibe:`התחלנו מ${pieceLabel(piece)} ב${anchorColor.he}, ובנינו סביבו שילוב מלא שלא מרגיש מאולץ.`,
    why:`ה${anchorColor.he} הוא העוגן. הוספנו צבע שמאיר, צבע שמאזן ואקסנט קטן כדי שהשילוב ירגיש מתוכנן ולא מקרי.`,
    colors:orderedColors,
    mapping,
    signature:`anchor|${piece}|${anchorColor.id}|${orderedColors.map(c => c.id).join('|')}`,
    createdAt:new Date().toISOString()
  };
}

function pickColor(groupName, previous){
  const ids = GROUPS[groupName] || GROUPS.light;
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
