function el(id){ return document.getElementById(id); }
function on(id, event, fn){ const node = el(id); if(node) node.addEventListener(event, fn); }

'use strict';

const STORAGE_KEY = 'shimi-looks-v11-earth-balanced';
const APP_VERSION = 'v25';

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
  black:{id:'black',he:'שחור',en:'Black',hex:'#101216',family:'dark-neutral'},

  // v17 — more real neutrals + stronger accents.
  white:{id:'white',he:'לבן',en:'White',hex:'#F7F4EF',family:'neutral'},
  opticwhite:{id:'opticwhite',he:'לבן נקי',en:'Clean White',hex:'#FFFFFF',family:'neutral'},
  pearl:{id:'pearl',he:'פנינה',en:'Pearl',hex:'#ECE8DF',family:'neutral'},
  silver:{id:'silver',he:'אפור כסף',en:'Silver Gray',hex:'#BFC1C3',family:'neutral'},
  fog:{id:'fog',he:'אפור בהיר',en:'Light Gray',hex:'#D6D6D2',family:'neutral'},
  stone:{id:'stone',he:'אפור אבן',en:'Stone Gray',hex:'#9A9A92',family:'neutral'},
  graphite:{id:'graphite',he:'גרפיט',en:'Graphite',hex:'#56575A',family:'neutral'},

  tomato:{id:'tomato',he:'אדום עגבנייה',en:'Tomato Red',hex:'#C94431',family:'red'},
  cherry:{id:'cherry',he:'אדום דובדבן',en:'Cherry Red',hex:'#B51F32',family:'red'},
  lipstick:{id:'lipstick',he:'אדום ליפסטיק',en:'Lipstick Red',hex:'#D0384D',family:'red'},
  scarlet:{id:'scarlet',he:'אדום ארגמן',en:'Scarlet',hex:'#D54A35',family:'red'},
  denim:{id:'denim',he:'ג׳ינס',en:'Denim',hex:'#496F9B',family:'blue'},
  sky:{id:'sky',he:'תכלת',en:'Sky Blue',hex:'#86AFCB',family:'blue'},
  mint:{id:'mint',he:'מנטה',en:'Mint',hex:'#A9CBB7',family:'green'},
  emerald:{id:'emerald',he:'ירוק אמרלד',en:'Emerald',hex:'#227A5A',family:'green'},
  lilac:{id:'lilac',he:'לילך',en:'Lilac',hex:'#B89AD4',family:'purple'},
  fuchsia:{id:'fuchsia',he:'פוקסיה',en:'Fuchsia',hex:'#C13E8A',family:'purple'},
  butter:{id:'butter',he:'צהוב חמאה',en:'Butter Yellow',hex:'#F0D975',family:'warm-accent'},
  lemon:{id:'lemon',he:'צהוב לימון',en:'Lemon',hex:'#EAD94C',family:'warm-accent'}
};

const GROUPS = {
  light:['ivory','linen','oat','pearl'],
  warmLight:['oat','sand','linen','pearl','butter'],
  warmNeutral:['sand','camel','cognac','cocoa','bark'],
  darkNeutral:['cocoa','espresso','bark','graphite','charcoal','black'],
  neutral:['white','opticwhite','pearl','fog','silver','stone','graphite','charcoal','black'],
  blue:['navy','cobalt','indigo','slate','denim','sky'],
  green:['sage','eucalyptus','olive','moss','mint','emerald'],
  soft:['blush','dustyrose','mauve','lavgray','lilac'],
  purple:['plum','fig','bordeaux','lilac','fuchsia'],
  warmAccent:['terracotta','rust','coral','ochre','marigold','butter','lemon'],
  red:['tomato','cherry','lipstick','scarlet'],
  jewel:['cobalt','indigo','plum','fig','bordeaux','emerald','fuchsia','cherry']
};

const RED_COLOR_IDS = ['tomato','cherry','lipstick','scarlet'];
const BLACK_WHITE_IDS = ['black','white','opticwhite'];
function isBlackWhiteColor(color){
  return !!color && BLACK_WHITE_IDS.includes(color.id);
}
function isBlackColor(color){
  return !!color && color.id === 'black';
}
function isWhiteColor(color){
  return !!color && (color.id === 'white' || color.id === 'opticwhite');
}
function isBlackOrWhiteColor(color){
  return isBlackColor(color) || isWhiteColor(color);
}
function hasBlackWhiteConflict(mapping){
  const top = mapping?.top?.color;
  const bottom = mapping?.bottom?.color;
  return (isBlackColor(top) && isWhiteColor(bottom)) || (isWhiteColor(top) && isBlackColor(bottom));
}
function hasBlackWhiteInMainRoles(mapping){
  return isBlackOrWhiteColor(mapping?.top?.color) || isBlackOrWhiteColor(mapping?.bottom?.color);
}
function blackWhiteCount(look){
  return (look.colors || []).filter(c => isBlackOrWhiteColor(c)).length;
}
function blackWhiteRecentRatio(){
  const recent = state.lookbook.slice(0,10);
  if(!recent.length) return 0;
  return recent.filter(look => (look.colors || []).some(c => isBlackOrWhiteColor(c))).length / recent.length;
}
function fixBlackWhiteMainConflict(mapping, colors){
  if(!mapping || !colors) return mapping;

  // Never allow top black + bottom white, or top white + bottom black.
  if(hasBlackWhiteConflict(mapping)){
    const swapRole = ['shoes','accessory'].find(role => {
      const c = mapping[role]?.color;
      return c && !isBlackOrWhiteColor(c) && !isRedColor(c);
    });

    if(swapRole){
      const bottomColor = mapping.bottom.color;
      mapping[swapRole].color = bottomColor;
      mapping[swapRole].text = roleText(swapRole, bottomColor);
      const replacement = mapping[swapRole].color;
      mapping.bottom.color = replacement;
      mapping.bottom.text = roleText('bottom', replacement);
    }else{
      const safe = colors.find(c => !isBlackOrWhiteColor(c) && !isRedColor(c)) || colors.find(c => !isRedColor(c)) || COLORS.denim;
      mapping.bottom.color = safe;
      mapping.bottom.text = roleText('bottom', safe);
    }
  }

  // If top is black/white, the opposite black/white should only live in shoes/accessory.
  const top = mapping.top?.color;
  const bottom = mapping.bottom?.color;
  if(isBlackOrWhiteColor(top) && isBlackOrWhiteColor(bottom)){
    const safe = colors.find(c => !isBlackOrWhiteColor(c) && !isRedColor(c)) || COLORS.denim;
    mapping.bottom.color = safe;
    mapping.bottom.text = roleText('bottom', safe);
  }

  return fixBlackWhiteMainConflict(mapping, colors);
}
function hasBlackWhiteRed(look){
  const ids = (look.colors || []).map(c => c.id);
  return ids.some(id => BLACK_WHITE_IDS.includes(id) || RED_COLOR_IDS.includes(id));
}
function overlapCount(a,b){
  const set = new Set(a || []);
  return (b || []).filter(x => set.has(x)).length;
}
function isRedColor(color){
  return !!color && (color.family === 'red' || RED_COLOR_IDS.includes(color.id));
}

const SHOE_SAFE_IDS = ['ivory','linen','oat','sand','camel','cognac','cocoa','espresso','bark','charcoal','black','white','opticwhite','pearl','fog','silver','stone','graphite','navy','cobalt','indigo','slate','denim','sky','sage','eucalyptus','olive','moss','mint','emerald','blush','dustyrose','mauve','lavgray','lilac','plum','fig','bordeaux','terracotta','rust','coral','ochre','marigold','butter','lemon','tomato','cherry','lipstick','scarlet'];
const SHOE_RED_MAX_RECENT = 1; // נעליים אדומות: בערך פעם ב־6 לוקים
function isTurquoiseLike(color){
  return !!color && ['teal'].includes(color.id);
}
function recentShoeColors(count=8){
  return state.lookbook.slice(0,count).map(look => look.mapping?.shoes?.color?.id).filter(Boolean);
}
function recentRedShoesCount(count=8){
  return state.lookbook.slice(0,count).filter(look => isRedColor(look.mapping?.shoes?.color)).length;
}
function recentRedAccessoryCount(count=10){
  return state.lookbook.slice(0,count).filter(look => isRedColor(look.mapping?.accessory?.color)).length;
}
function recentRedAccentCount(count=6){
  return state.lookbook.slice(0,count).filter(look => isRedColor(look.mapping?.shoes?.color) || isRedColor(look.mapping?.accessory?.color)).length;
}
function isPinkShoeColor(color){
  return !!color && ['blush','dustyrose','mauve','lavgray','lilac','fuchsia'].includes(color.id);
}
function isGreenShoeColor(color){
  return !!color && ['sage','eucalyptus','olive','moss','mint','emerald'].includes(color.id);
}
function pickShoeColorAvoidingRecent(colors){
  let options = (colors||[]).filter(c => c && SHOE_SAFE_IDS.includes(c.id) && !isTurquoiseLike(c));
  if(!options.length) options = (colors||[]).filter(c => c && !isTurquoiseLike(c) && !isRedColor(c));
  if(!options.length) options = [COLORS.camel, COLORS.cognac, COLORS.espresso, COLORS.navy].filter(Boolean);
  const recent = recentShoeColors(6);
  const weighted = options.map(c => {
    let weight = 12;
    if(recent.includes(c.id)) weight -= 9;
    // גיוון פשוט: כל צבע מקבל סיכוי דומה, עם קנס רק לחזרות קרובות.
    if(recent.includes(c.id)) weight -= 18;
    if(recentShoeColors(10).includes(c.id)) weight -= 8;
    if(c.family === 'red') weight += recentRedShoesCount(6) ? -45 : 3;
    return {color:c, weight:Math.max(0.8, weight)};
  });
  return weightedPick(weighted);
}
function fixShoeVariety(mapping, colors){
  if(!mapping || !mapping.shoes) return mapping;
  const shoe = mapping.shoes.color;
  const recentShoes = recentShoeColors(5);
  const redOverload = isRedColor(shoe) && recentRedShoesCount(6) >= SHOE_RED_MAX_RECENT;
  const repeatOverload = shoe && recentShoes.filter(id => id === shoe.id).length >= 1;
  const turquoiseBad = isTurquoiseLike(shoe);
  if(redOverload || repeatOverload || turquoiseBad){
    const replacement = pickShoeColorAvoidingRecent(colors);
    mapping.shoes.color = replacement;
    mapping.shoes.text = roleText('shoes', replacement);
  }
  return mapping;
}
function pickAccessoryColorAvoidingRed(colors){
  let options = (colors||[]).filter(c => c && !isTurquoiseLike(c) && !isRedColor(c));
  if(!options.length) options = [COLORS.bordeaux, COLORS.olive, COLORS.cognac, COLORS.navy, COLORS.dustyrose].filter(Boolean);
  return weightedPick(options.map(c=>{
    let weight=10;
    if(['bordeaux','cognac','olive','navy','dustyrose','ochre','graphite'].includes(c.id)) weight+=3;
    return {color:c, weight};
  }));
}
function fixRedAccentFrequency(mapping, colors){
  if(!mapping) return mapping;
  const shoeRed = isRedColor(mapping.shoes?.color);
  const accessoryRed = isRedColor(mapping.accessory?.color);

  // לא אדום גם נעליים וגם אביזר באותו לוק.
  if(shoeRed && accessoryRed){
    const repl = pickAccessoryColorAvoidingRed(colors);
    mapping.accessory.color = repl;
    mapping.accessory.text = roleText('accessory', repl);
  }

  // אביזר אדום נדיר יותר: בערך פעם ב־10 לוקים.
  if(isRedColor(mapping.accessory?.color) && recentRedAccessoryCount(10) >= 1){
    const repl = pickAccessoryColorAvoidingRed(colors);
    mapping.accessory.color = repl;
    mapping.accessory.text = roleText('accessory', repl);
  }

  // נעליים אדומות מותרות יותר מאביזר, אבל עדיין במרווח: בערך פעם ב־6 לוקים.
  if(isRedColor(mapping.shoes?.color) && recentRedShoesCount(6) >= 1){
    const repl = pickShoeColorAvoidingRecent(colors);
    mapping.shoes.color = repl;
    mapping.shoes.text = roleText('shoes', repl);
  }
  return mapping;
}
function canUseColorForRole(color, role){
  if(!color) return false;
  if((role === 'top' || role === 'bottom') && isRedColor(color)) return false;
  return true;
}
function safeColorsForRole(colors, role){
  const safe = (colors || []).filter(c => canUseColorForRole(c, role));
  return safe.length ? safe : (colors || []);
}
function fixNoRedTopBottom(mapping, colors){
  if(!mapping || !colors) return mapping;
  ['top','bottom'].forEach(role => {
    const current = mapping[role]?.color;
    if(!isRedColor(current)) return;
    const swapRole = ['shoes','accessory'].find(r => mapping[r] && !isRedColor(mapping[r].color));
    if(swapRole){
      const tmp = mapping[swapRole].color;
      mapping[swapRole].color = current;
      mapping[swapRole].text = roleText(swapRole, current);
      mapping[role].color = tmp;
      mapping[role].text = roleText(role, tmp);
    }else{
      const replacement = pick(safeColorsForRole(colors, role));
      mapping[role].color = replacement;
      mapping[role].text = roleText(role, replacement);
    }
  });
  return mapping;
}
const VARIETY_GROUPS = ['neutral','blue','green','purple','warmAccent','red','warmNeutral','darkNeutral','soft'];

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
  {title:'כהה דרמטי במינון',roles:['darkNeutral','purple','warmNeutral','green'],map:{top:1,bottom:0,shoes:2,accessory:3}, weight:0.32},
  // v17 — more contrast and real black/white/gray.
  {title:'שחור לבן עם צבע',roles:['neutral','blue','warmAccent','green'],map:{top:1,bottom:0,shoes:2,accessory:3}, weight:0.95},
  {title:'אפור, כחול ואדום קטן',roles:['neutral','blue','red','warmNeutral'],map:{top:1,bottom:0,shoes:2,accessory:3}, weight:0.65},
  {title:'לבן, ירוק ונעל אדומה',roles:['neutral','green','red','purple'],map:{top:1,bottom:0,shoes:2,accessory:3}, weight:0.35},
  {title:'גרפיט עם צהוב ותכלת',roles:['neutral','warmAccent','blue','green'],map:{top:2,bottom:0,shoes:1,accessory:3}, weight:1.45},
  {title:'ג׳ינס, לבן ואביזר אדום',roles:['blue','neutral','red','warmAccent'],map:{top:0,bottom:1,shoes:3,accessory:2}, weight:0.90},
  {title:'אפור עם פוקסיה וזית',roles:['neutral','purple','green','warmNeutral'],map:{top:1,bottom:0,shoes:3,accessory:2}, weight:0.72}
,
  // v18 — intentional black/white/red moments.
  {title:'שחור לבן ואדום קטן',roles:['neutral','neutral','red','blue'],map:{top:3,bottom:0,shoes:1,accessory:2}, weight:0.35},
  {title:'לבן נקי עם שחור וקורל',roles:['neutral','neutral','warmAccent','green'],map:{top:2,bottom:1,shoes:0,accessory:3}, weight:0.70},
  {title:'שחור עם ירוק ונגיעה אדומה',roles:['neutral','green','red','warmNeutral'],map:{top:1,bottom:0,shoes:2,accessory:3}, weight:0.45},
  {title:'לבן, דנים ואדום באקססורי',roles:['neutral','blue','red','purple'],map:{top:1,bottom:0,shoes:3,accessory:2}, weight:0.85},
  {title:'אפור גרפיט עם לבן וצהוב',roles:['neutral','neutral','warmAccent','blue'],map:{top:3,bottom:0,shoes:2,accessory:1}, weight:0.85}

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
  'כחול':['navy','cobalt','indigo','slate','denim','sky'],
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

const RELAXED_GROUPS = ['neutral','light','warmNeutral','darkNeutral','soft'];
const COLORFUL_GROUPS = ['blue','green','purple','warmAccent','red'];

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
      recentHome: parsed.recentHome || [],
      colorMode: parsed.colorMode || 'super',
      screen: parsed.screen || 'todayScreen'
    };
  }catch(e){
    return {currentLook:null,anchorLook:null,anchorPiece:'bottom',anchorFamily:'חום',anchorColorId:'cocoa',anchorColorMode:'super',lookbook:[],recent:[],recentHome:[],colorMode:'super',screen:'todayScreen'};
  }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function init(){
  try{
    if(!state.currentLook){
      state.currentLook = generateBestLook(state.colorMode || 'super');
      remember(state.currentLook, 'today');
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
    remember(state.currentLook, 'today');
    saveState();
    renderToday();
    toast('הבא בתור ✨');
  });

  $('saveLookBtn').addEventListener('click', () => saveLook(state.currentLook));
  on('anchorModeBtn','click', () => showScreen('anchorScreen'));
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
  on('buildAroundBtn','click', buildAnchorLook);
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
          remember(state.anchorLook, 'anchor');
          renderAnchorLook(state.anchorLook);
        }
        saveState();
      }else{
        state.colorMode = btn.dataset.mode;
        state.currentLook = generateBestLook(state.colorMode);
        remember(state.currentLook, 'today');
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
  renderLookVisual($('lookVisual'), look.mapping);
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
  try{
    const anchorColor = COLORS[state.anchorColorId] || COLORS.cocoa;
    state.anchorColorMode = state.anchorColorMode || state.colorMode || 'super';
    state.anchorLook = generateBestAnchoredLook(state.anchorPiece, anchorColor, state.anchorColorMode);
    remember(state.anchorLook, 'anchor');
    saveState();
    renderAnchorLook(state.anchorLook);
    toast('בנינו סביב הפריט שלך ✨');
  }catch(err){
    console.error('anchor build failed', err);
    toast('רגע, משהו נתקע. נסי שוב');
  }
}

function renderAnchorLook(look){
  renderAnchorColorModeCard();
  $('anchorResultCard').hidden = false;
  $('anchorLookTitle').textContent = look.title;
  $('anchorLookVibe').textContent = look.vibe;
  $('anchorWhyWorks').textContent = look.why;
  renderLookVisual($('anchorLookVisual'), look.mapping, {lockedRole: state.anchorPiece});
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
    $('lookbookList').innerHTML = `<div class="card empty-state"><strong>עדיין אין לוקים שאהבתי</strong><br>כשתלחצי שומרת ♡, הם יופיעו כאן. נשמור עד 30 אחרונים כדי שזה לא יהפוך למחסן.</div>`;
    return;
  }
  $('lookbookList').innerHTML = list.map((look) => `
    <article class="liked-card">
      <button class="liked-main" data-open="${look.signature}" type="button">
        <div class="liked-info">
          <h3 class="liked-title">${look.title}</h3>
          <p class="liked-date">${formatDate(look.savedAt)} · ${look.colorMode === 'tiny' ? 'נגיעה קטנה' : look.colorMode === 'half' ? 'חצי קלאץ׳' : 'סופר צבע'}</p>
        </div>
        <div class="liked-dots">
          ${look.colors.slice(0,4).map(c => `<span class="liked-dot" title="${c.he}" style="background:${c.hex}"></span>`).join('')}
        </div>
      </button>
      <button class="liked-delete" data-delete="${look.signature}" type="button" aria-label="מחיקה">×</button>
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
    toast('נמחק מאהבתי');
  }));
}


function renderLookVisual(container, mapping, options={}){
  if(!container || !mapping) return;
  const labels = {top:'עליון', bottom:'תחתון', shoes:'נעליים', accessory:'אביזר'};
  const descriptions = {
    top: mapping.top?.color?.he || '',
    bottom: mapping.bottom?.color?.he || '',
    shoes: mapping.shoes?.color?.he || '',
    accessory: mapping.accessory?.color?.he || ''
  };
  const heart = accessoryHeartSvg(mapping.accessory?.color?.hex || '#C94431');
  container.innerHTML = `
    <div class="look-visual-grid">
      <div class="visual-stack">
        <div class="color-block top" style="background:${mapping.top.color.hex}"></div>
        <div class="color-block bottom" style="background:${mapping.bottom.color.hex}"></div>
        <div class="accessory-heart" aria-hidden="true">${heart}</div>
        <div class="shoes-pair">
          <div class="shoe-block" style="background:${mapping.shoes.color.hex}"></div>
          <div class="shoe-block" style="background:${mapping.shoes.color.hex}"></div>
        </div>
      </div>
      <div class="visual-map">
        ${['top','bottom','shoes','accessory'].map(role => {
          const locked = options.lockedRole === role ? ' · הפריט שלך' : '';
          return `<div class="visual-row ${options.lockedRole === role ? 'locked' : ''}">
            <div class="visual-role">${labels[role]}</div>
            <div class="visual-text">${descriptions[role]}</div>
            <div class="visual-subtext">${mapping[role].text}${locked}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

function accessoryHeartSvg(fill){
  return `<svg viewBox="0 0 64 64" role="img" aria-label="אביזר">
    <path d="M32 55C23 47 8 36.5 8 22.5 8 15.6 13.6 10 20.5 10c4.9 0 9.3 2.8 11.5 6.8C34.2 12.8 38.6 10 43.5 10 50.4 10 56 15.6 56 22.5 56 36.5 41 47 32 55z" fill="${fill}" stroke="#fff8f0" stroke-width="3.5" stroke-linejoin="round"/>
  </svg>`;
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
    toast('כבר שמור באהבתי ♡');
    return;
  }
  state.lookbook.unshift({...look, savedAt:new Date().toISOString()});
  state.lookbook = state.lookbook.slice(0, 30);
  saveState();
  renderLookbook();
  toast('נשמר באהבתי ♡');
}

function compactLookForHistory(look){
  return {
    signature: look.signature,
    ids: (look.colors || []).map(c => c.id),
    top: look.mapping?.top?.color?.id || '',
    bottom: look.mapping?.bottom?.color?.id || '',
    topFamily: look.mapping?.top?.color?.family || '',
    bottomFamily: look.mapping?.bottom?.color?.family || ''
  };
}

function recentHomeHistory(count=3){
  return (state.recentHome || []).slice(0, count);
}

function violatesThreeClickRule(look, history=recentHomeHistory(3)){
  if(!history.length) return false;
  const ids = (look.colors || []).map(c => c.id);
  const top = look.mapping?.top?.color?.id || '';
  const bottom = look.mapping?.bottom?.color?.id || '';
  const topFamily = look.mapping?.top?.color?.family || '';
  const bottomFamily = look.mapping?.bottom?.color?.family || '';
  const recentMainIds = new Set(history.flatMap(item => [item.top, item.bottom]).filter(Boolean));

  if(recentMainIds.has(top) || recentMainIds.has(bottom)) return true;

  for(const item of history){
    if(item.signature === look.signature) return true;
    const overlap = ids.filter(id => item.ids.includes(id)).length;
    if(overlap >= 2) return true;
    if(item.topFamily === topFamily && item.bottomFamily === bottomFamily) return true;
  }
  return false;
}

function softlyRepeatsRecentLook(look, history=recentHomeHistory(3)){
  if(!history.length) return false;
  const ids = (look.colors || []).map(c => c.id);
  const top = look.mapping?.top?.color?.id || '';
  const bottom = look.mapping?.bottom?.color?.id || '';
  return history.some(item => {
    const overlap = ids.filter(id => item.ids.includes(id)).length;
    return item.top === top || item.bottom === bottom || overlap >= 3;
  });
}

function remember(look, source='today'){
  state.recent.unshift(look.signature);
  state.recent = state.recent.slice(0, 80);
  if(source === 'today'){
    state.recentHome = state.recentHome || [];
    state.recentHome.unshift(compactLookForHistory(look));
    state.recentHome = state.recentHome.slice(0, 12);
  }
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
  const topPool = safeColorsForRole(colors.filter(c => c.family !== 'light'), 'top');
  const actualTopPool = topPool.length ? topPool : safeColorsForRole(colors, 'top');

  const topPreferred = actualTopPool.filter(c =>
    ['warm-neutral','green','purple','blue','warm-accent','neutral'].includes(c.family)
  );
  const topColor = pick(topPreferred.length ? topPreferred : actualTopPool);

  const remaining = colors.filter(c => c.id !== topColor.id);
  const mapping = { top:{color:topColor, text:roleText('top', topColor)} };

  const preferred = {
    bottom:['neutral','dark-neutral','blue','green','warm-neutral','purple','warm-accent','soft','light'],
    shoes:['red','warm-neutral','neutral','dark-neutral','green','blue','warm-accent','purple','light','soft'],
    accessory:['red','warm-accent','purple','blue','green','neutral','warm-neutral','soft','light','dark-neutral']
  };

  ['bottom','shoes','accessory'].forEach(role => {
    const options = safeColorsForRole(remaining.length ? remaining : colors, role);
    const pref = preferred[role] || [];
    const sorted = [...options].sort((a,b) => {
      const ai = pref.indexOf(a.family);
      const bi = pref.indexOf(b.family);
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    });
    const color = Math.random() < 0.70 ? sorted[0] : pick(options);
    mapping[role] = {color, text:roleText(role, color)};
    const idx = remaining.findIndex(c => c.id === color.id);
    if(idx >= 0) remaining.splice(idx, 1);
  });

  return fixRedAccentFrequency(fixShoeVariety(fixNoRedTopBottom(mapping, colors), colors), colors);
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
  const candidates = Array.from({length:260}, () => generateLook(mode));
  candidates.sort((a,b) => scoreLookWithTopVariety(b) - scoreLookWithTopVariety(a));

  const strictPool = candidates.filter(look => !violatesThreeClickRule(look));
  const softPool = candidates.filter(look => !softlyRepeatsRecentLook(look));
  const basePool = strictPool.length ? strictPool : (softPool.length ? softPool : candidates);

  if(mode === 'super'){
    const bwRatio = blackWhiteRecentRatio();
    const bwSpecial = basePool.find(look => (look.colors || []).some(c => isBlackOrWhiteColor(c)) && !hasBlackWhiteConflict(look.mapping));
    const redSpecial = basePool.find(look => (look.colors || []).some(c => isRedColor(c)) && !isRedColor(look.mapping?.shoes?.color) && !isRedColor(look.mapping?.accessory?.color));

    if(bwRatio < 0.30 && bwSpecial && Math.random() < 0.22) return bwSpecial;
    if(redSpecial && Math.random() < 0.03) return redSpecial;
  }

  return basePool[0] || candidates[0];
}

function scoreLookWithTopVariety(look){
  let s = score(look);
  const families = look.colors ? look.colors.map(c => c.family) : [];
  const ids = look.colors ? look.colors.map(c => c.id) : [];

  // Make every next click feel different from recent looks.
  const last = state.lookbook[0];
  if(last){
    const lastIds = last.colors.map(c => c.id);
    const lastFamilies = last.colors.map(c => c.family);
    s -= overlapCount(lastIds, ids) * 55;
    s -= overlapCount(lastFamilies, families) * 18;

    const sameTop = last.mapping?.top?.color?.id === look.mapping?.top?.color?.id;
    const sameBottom = last.mapping?.bottom?.color?.id === look.mapping?.bottom?.color?.id;
    if(sameTop) s -= 70;
    if(sameBottom) s -= 60;
  }

  const recent = state.lookbook.slice(0,6);
  const recentIds = recent.flatMap(look => look.colors.map(c => c.id));
  const recentFamilies = recent.flatMap(look => look.colors.map(c => c.family));
  s -= overlapCount(recentIds, ids) * 16;
  s -= overlapCount(recentFamilies, families) * 5;

  const recentHome = recentHomeHistory(3);
  recentHome.forEach(item => {
    const overlap = ids.filter(id => item.ids.includes(id)).length;
    s -= overlap * 18;
    if(item.top === look.mapping?.top?.color?.id) s -= 60;
    if(item.bottom === look.mapping?.bottom?.color?.id) s -= 50;
    if(item.topFamily === look.mapping?.top?.color?.family) s -= 14;
    if(item.bottomFamily === look.mapping?.bottom?.color?.family) s -= 10;
  });

  // Preferred Shimi zone, but now neutrals and red accents are invited too.
  families.forEach(f => {
    if(['warm-neutral','green','purple','blue','warm-accent','neutral'].includes(f)) s += 14;
    if(f === 'light') s -= 18;
    if(f === 'soft') s -= 10;
    if(f === 'red') s += 18;
  });

  if(ids.includes('black')) s += 8;
  if(ids.includes('white') || ids.includes('opticwhite')) s += 8;
  if(ids.some(id => RED_COLOR_IDS.includes(id))) s += 22;
  if(ids.includes('charcoal')) s += 6;

  // Keep black/white special: around 30% overall, and never as top+bottom opposite combo.
  if(hasBlackWhiteConflict(look.mapping)) s -= 999;
  if(blackWhiteRecentRatio() >= 0.30 && ids.some(id => BLACK_WHITE_IDS.includes(id))) s -= 120;
  if(blackWhiteCount(look) > 1) s -= 35;

  // Avoid all-neutral boredom.
  if(families.filter(f => f === 'neutral').length >= 3) s -= 18;
  if(families.filter(f => f === 'light').length > 1) s -= 70;
  if(families.filter(f => f === 'soft').length > 1) s -= 36;

  if(look.mapping?.shoes?.color){
    const shoe = look.mapping.shoes.color;
    if(isTurquoiseLike(shoe)) s -= 999;
    if(isRedColor(shoe)) s += recentRedShoesCount(6) ? -190 : 4;
    const recentShoes = recentShoeColors(5);
    if(recentShoes.includes(shoe.id)) s -= 95;
    if(['camel','cognac','sand','cocoa','espresso','bark','navy','denim','olive','bordeaux','black','graphite','stone'].includes(shoe.id)) s += 32;
  }

  if(look.mapping && look.mapping.bottom && isRedColor(look.mapping.bottom.color)) s -= 999;
  if(look.mapping && look.mapping.top && look.mapping.top.color){
    const top = look.mapping.top.color;
    if(isRedColor(top)) s -= 999;
    if(top.family === 'light') s -= 62;
    if(top.family === 'soft') s -= 18;
    if(['green','purple','blue','warm-accent','warm-neutral','neutral'].includes(top.family)) s += 22;
  }
  if(look.mapping?.accessory?.color){
    const acc = look.mapping.accessory.color;
    if(isTurquoiseLike(acc)) s -= 999;
    if(isRedColor(acc)) s += recentRedAccessoryCount(10) ? -220 : -8;
  }
  if(isRedColor(look.mapping?.shoes?.color) && isRedColor(look.mapping?.accessory?.color)) s -= 999;

  return s;
}

function generateLook(mode='super'){
  if(mode === 'half') return generateHalfClutchLook();
  if(mode === 'tiny') return generateTinyLook();

  const recipe = pickWeightedRecipe(RECIPES);
  let colors = [];
  recipe.roles.forEach(role => colors.push(pickColor(role, colors)));

  // If a super-color look came out too safe, sometimes insert red, and only rarely black/white.
  const bwRatio = blackWhiteRecentRatio();
  if(mode === 'super' && !colors.some(c => isBlackWhiteColor(c) || isRedColor(c))){
    if(bwRatio < 0.30 && Math.random() < 0.22){
      const forced = pick([COLORS.black, COLORS.white, COLORS.opticwhite]);
      colors[Math.floor(Math.random() * colors.length)] = forced;
    }else if(Math.random() < 0.10){
      const forced = pick([COLORS.tomato, COLORS.cherry, COLORS.lipstick]);
      colors[Math.floor(Math.random() * colors.length)] = forced;
    }
  }

  // סופר צבע נשאר כמו שהאפליקציה עבדה עד עכשיו.
  const lightCount = colors.filter(c => c.family === 'light').length;
  const softCount = colors.filter(c => c.family === 'soft').length;
  const blackishCount = colors.filter(c => c.id === 'black' || c.id === 'charcoal').length;

  if(lightCount > 1 || softCount > 1 || blackishCount > 1){
    const shimiGroups = ['neutral','warmNeutral','green','purple','blue','warmAccent','darkNeutral','red'];
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
  const mapping = fixRedAccentFrequency(fixShoeVariety(buildVariedMapping(colors), colors), colors);
  const modeLine = pick(MODE_LINES[mode] || MODE_LINES.super);
  const signature = `meter-v25|${mode}|${colors.map(c => c.id).join('|')}|${mapping.top.color.id}|${mapping.bottom.color.id}|${mapping.shoes.color.id}|${mapping.accessory.color.id}`;
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
  const candidates = Array.from({length:80}, () => generateAnchoredLook(piece, anchorColor, mode));
  candidates.sort((a,b) => {
    const av = (a.colors || []).filter(c => c && c.id !== anchorColor.id).length + (a.colorMode === mode ? 2 : 0);
    const bv = (b.colors || []).filter(c => c && c.id !== anchorColor.id).length + (b.colorMode === mode ? 2 : 0);
    return bv - av;
  });
  return candidates[0] || generateAnchoredLook(piece, anchorColor, mode);
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
    unique.push(pickColor(pick(['neutral','warmNeutral','green','purple','blue','warmAccent','darkNeutral','light','soft','red']), unique));
  }
  colors = unique.slice(0,4);

  const mapping = {};
  mapping[piece] = {color:anchorColor, text:`${pieceLabel(piece)} ב${anchorColor.he}`};

  const remainingRoles = ['top','bottom','shoes','accessory'].filter(r => r !== piece);
  let remainingColors = colors.filter(c => c.id !== anchorColor.id);

  remainingRoles.forEach(role => {
    const color = bestForRole(role, remainingColors.length ? remainingColors : colors.filter(c => c.id !== anchorColor.id));
    mapping[role] = {color, text: roleText(role, color)};
    remainingColors = remainingColors.filter(c => c.id !== color.id);
  });

  fixNoRedTopBottom(mapping, colors);
  const orderedColors = [mapping.top.color, mapping.bottom.color, mapping.shoes.color, mapping.accessory.color];
  return {
    title:`${anchorColor.he} עם ${orderedColors.filter(c => c.id !== anchorColor.id).slice(0,2).map(c => c.he).join(' ו')}`,
    vibe: pick(MODE_LINES[mode] || MODE_LINES.super),
    why: buildWhyByMode(orderedColors, mode),
    colors:orderedColors,
    mapping,
    colorMode:mode,
    signature:`anchor-v16|${mode}|${piece}|${anchorColor.id}|${orderedColors.map(c => c.id).join('|')}`,
    createdAt:new Date().toISOString()
  };
}

function pickColor(groupName, previous, role=null){
  const ids = GROUPS[groupName] || GROUPS.blue;
  let options = ids.map(id => COLORS[id]).filter(Boolean);
  if(role) options = safeColorsForRole(options, role);
  const previousFamilies = previous.map(c => c.family);
  const recentLooks = state.lookbook.slice(0,14);
  const recentIds = recentLooks.flatMap(look => look.colors.map(c => c.id));
  const veryRecentIds = state.lookbook.slice(0,4).flatMap(look => look.colors.map(c => c.id));
  const weighted = options.map(color => {
    let weight = 12;
    if(previousFamilies.includes(color.family)) weight -= 4;
    if(recentIds.includes(color.id)) weight -= 8;
    if(veryRecentIds.includes(color.id)) weight -= 14;
    if(previous.some(c => c.id === color.id)) weight = 0.1;

    // Red is allowed only as shoes/accessory, never top/bottom.
    if(isRedColor(color) && (role === 'top' || role === 'bottom')) weight = 0.1;
    if(isRedColor(color) && role === 'shoes') weight += recentRedShoesCount(6) ? -45 : 4;
    if(isRedColor(color) && role === 'accessory') weight += recentRedAccessoryCount(10) ? -55 : 2;
    if(isTurquoiseLike(color)) weight = 0.05;

    // Push black/white to actually appear, not just sit politely in the palette.
    if(color.id === 'black') weight += 2;
    if(color.id === 'white' || color.id === 'opticwhite') weight += 2;

    if(color.family === 'neutral') weight += 2;
    return {color, weight:Math.max(0.4, weight)};
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
  const mapping = {
    top:{color:colors[map.top], text:roleText('top', colors[map.top])},
    bottom:{color:colors[map.bottom], text:roleText('bottom', colors[map.bottom])},
    shoes:{color:colors[map.shoes], text:roleText('shoes', colors[map.shoes])},
    accessory:{color:colors[map.accessory], text:roleText('accessory', colors[map.accessory])}
  };
  return fixNoRedTopBottom(mapping, colors);
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
  if(['dark-neutral','warm-neutral','neutral'].includes(fam)) return ['light','blue','soft','green','warmAccent','purple','red'];
  if(fam === 'light') return ['darkNeutral','neutral','blue','green','soft','warmAccent','purple','red'];
  if(['blue','green'].includes(fam)) return ['light','neutral','warmNeutral','darkNeutral','soft','warmAccent','red'];
  if(['soft','purple','red'].includes(fam)) return ['light','neutral','warmNeutral','darkNeutral','blue','green'];
  if(fam === 'warm-accent') return ['light','darkNeutral','blue','green','warmNeutral'];
  return ['light','warmNeutral','darkNeutral','blue','green','soft'];
}

function bestForRole(role, colors){
  if(!colors.length) return COLORS.ivory;
  const safe = safeColorsForRole(colors, role);
  const pref = {
    top:['blue','green','purple','warm-accent','soft','neutral','dark-neutral','warm-neutral','light'],
    bottom:['neutral','dark-neutral','blue','green','warm-neutral','purple','light'],
    shoes:['warm-neutral','dark-neutral','neutral','blue','green','purple','warm-accent','light','soft','red'],
    accessory:['red','warm-accent','purple','blue','soft','green','neutral','dark-neutral','warm-neutral','light']
  }[role] || [];
  return [...safe].sort((a,b) => {
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
