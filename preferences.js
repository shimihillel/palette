'use strict';

// Explicit outfit feedback only. Skipping and downloading never train this model.
// These color pairs are an approximate starting brief from approved outfits,
// not sampled pixels, a garment inventory, or machine training on photographs.
const PERSONAL_STYLE = Object.freeze({
  maxRatings: 600,
  pairs: [
    ['wine','olive'], ['chocolate','lime'],
    ['lilac','denim'], ['magenta','slate'], ['chocolate','denim'],
    ['navy','mustard'], ['sage','camel'], ['black','army'],
    ['cornflower','indigo'], ['mustard','slate'], ['powderblue','rust'],
    ['espresso','sage'], ['cognac','black'], ['wine','camel'],
    ['denim','caramel'], ['fuchsia','olive']
  ]
});
const FEEDBACK_REASONS = Object.freeze({
  light:'בהיר מדי', bright:'זרחני מדי', boring:'משעמם', clash:'הצבעים לא עובדים יחד'
});
const personalClamp = (n,lo=0,hi=1) => Math.max(lo,Math.min(hi,n));
let personalRatingCache = null;
let personalModelCache = [];
let personalPairCache = null;

function personalWhite(color){
  if(!color)return false;
  const lab=wadaLab(color.hex);
  return isWhiteColor(color)||(lab[0]>.9&&wadaChroma(lab)<.045);
}

function normalizeStyleFeedback(raw){
  const unique=new Map();
  const rows=Array.isArray(raw?.ratings)?raw.ratings:[];
  for(const row of rows.slice(-PERSONAL_STYLE.maxRatings*2)){
    if(!row||![1,-1].includes(row.vote)||!Array.isArray(row.ids)||row.ids.length!==4
      ||row.ids.some(id=>typeof id!=='string'||!Object.hasOwn(COLORS,id)))continue;
    const ids=[...row.ids],key=ids.join('|');
    unique.delete(key);
    unique.set(key,{ids,vote:row.vote,
      reason:row.vote===-1&&Object.hasOwn(FEEDBACK_REASONS,row.reason)?row.reason:null,
      updatedAt:Number.isFinite(row.updatedAt)?row.updatedAt:0});
  }
  return {version:1,ratings:[...unique.values()].slice(-PERSONAL_STYLE.maxRatings)};
}

function initializePersonalStyle(){
  state.styleFeedback=normalizeStyleFeedback(state.styleFeedback);
  // Removed controls must not leave invisible locks from an older release.
  state.lockedRoles={};
  personalRatingCache=null;
}

function personalLookIds(look){
  return WADA_ROLES.map(role=>look?.mapping?.[role]?.color?.id);
}

function currentStyleRating(){
  const key=personalLookIds(state.currentLook).join('|');
  return state.styleFeedback?.ratings.find(row=>row.ids.join('|')===key)||null;
}

function setLookFeedback(vote,reason=null){
  if(!state.currentLook||el('nextLookBtn')?.dataset.busy==='1')return false;
  const ids=personalLookIds(state.currentLook),key=ids.join('|');
  const previous=state.styleFeedback;
  const ratings=(previous?.ratings||[]).filter(row=>row.ids.join('|')!==key);
  if(vote===1||vote===-1)ratings.push({ids,vote,
    reason:vote===-1&&Object.hasOwn(FEEDBACK_REASONS,reason)?reason:null,updatedAt:Date.now()});
  state.styleFeedback={version:1,ratings:ratings.slice(-PERSONAL_STYLE.maxRatings)};
  if(!saveState()){
    state.styleFeedback=previous;
    renderStyleFeedback('הדירוג לא נשמר. נסי שוב.');
    toast('הדירוג לא נשמר בדפדפן. נסי שוב.');
    return false;
  }
  personalRatingCache=null;
  el('toast')?.classList.remove('show');
  renderStyleFeedback();
  updateShadeCoverageControl();
  return true;
}

function renderStyleFeedback(message=''){
  const row=currentStyleRating(),busy=el('nextLookBtn')?.dataset.busy==='1';
  for(const [id,vote] of [['likeLookBtn',1],['dislikeLookBtn',-1]]){
    const button=el(id);if(!button)continue;
    button.setAttribute('aria-pressed',String(row?.vote===vote));
    button.disabled=busy;
  }
  const reasons=el('feedbackReasons');
  if(reasons){
    reasons.hidden=row?.vote!==-1;
    reasons.querySelectorAll('[data-feedback-reason]').forEach(button=>{
      button.setAttribute('aria-pressed',String(row?.reason===button.dataset.feedbackReason));
      button.disabled=busy;
    });
  }
  const status=el('feedbackStatus'),undo=el('undoFeedbackBtn');
  if(status)status.textContent=message||(row?'הדירוג נשמר':'מה דעתך על השילוב?');
  if(undo){undo.hidden=!row;undo.disabled=busy;}
}

function bindStyleFeedback(){
  for(const [id,vote] of [['likeLookBtn',1],['dislikeLookBtn',-1]])
    on(id,'click',()=>setLookFeedback(currentStyleRating()?.vote===vote?0:vote));
  on('undoFeedbackBtn','click',()=>setLookFeedback(0));
  el('feedbackReasons')?.addEventListener('click',event=>{
    const button=event.target.closest('[data-feedback-reason]');
    if(button&&currentStyleRating()?.vote===-1)
      setLookFeedback(-1,currentStyleRating().reason===button.dataset.feedbackReason?null:button.dataset.feedbackReason);
  });
}

function personalFeatures(colors){
  const labs=colors.map(c=>wadaLab(c.hex)),chroma=labs.map(wadaChroma);
  const area=[.36,.46,.08,.10];
  const light=labs.reduce((sum,lab,i)=>sum+lab[0]*area[i],0);
  const bright=labs.reduce((sum,lab,i)=>sum+area[i]
    *personalClamp((lab[0]-.62)/.25)*personalClamp((chroma[i]-.12)/.12),0);
  const palePair=labs[0][0]>.74&&labs[1][0]>.74;
  const candy=labs.slice(0,2).filter((lab,i)=>lab[0]>.69&&chroma[i]>.075).length;
  let twist=0;
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
    if(chroma[i]>.045&&chroma[j]>.045)
      twist=Math.max(twist,personalClamp(wadaHueGap(labs[i],labs[j])/95)
        *personalClamp(Math.min(chroma[i],chroma[j])/.085));
  }
  return {labs,chroma,light,bright,palePair,candy,twist};
}

function personalColorWeight(color,role){
  if(!canUseColorForRole(color,role))return 0;
  const lab=wadaLab(color.hex),chroma=wadaChroma(lab);
  if(role==='top'&&personalWhite(color))return 0;
  if(role==='bottom'&&personalWhite(color))return .07;
  if(role==='shoes'||role==='accessory')return lab[0]>.82&&chroma>.15?.6:1;
  // Favor depth without banning a lime trouser or a soft blue shirt.
  let weight=lab[0]<.66?2:lab[0]<.79?1:.42;
  if(['dark-neutral','warm-neutral','blue','green','purple'].includes(color.family))weight*=1.2;
  if(lab[0]>.75&&chroma>.16)weight*=.48;
  return weight;
}

function personalPriorScore(colors){
  const f=personalFeatures(colors);
  let score=18-personalClamp((f.light-.63)/.25)*32;
  if(f.light<.32)score-=12;
  if(f.palePair)score-=24;
  if(f.candy===2)score-=18;
  score-=f.bright*36;
  if(personalWhite(colors[1]))score-=24;
  // Unusual color relationships earn credit independently of brightness.
  score+=f.twist*9;
  if(!personalPairCache)personalPairCache=PERSONAL_STYLE.pairs
    .filter(ids=>ids.every((id,i)=>canUseColorForRole(COLORS[id],WADA_ROLES[i])))
    .map(ids=>ids.map(id=>wadaLab(COLORS[id].hex)));
  const pairMatch=Math.max(0,...personalPairCache.map(pair=>
    Math.exp(-(wadaDistance(f.labs[0],pair[0])**2+wadaDistance(f.labs[1],pair[1])**2)/(.14**2*2))));
  score+=pairMatch*20;
  return score;
}

function personalRatingModel(){
  const ratings=state.styleFeedback?.ratings||[];
  if(personalRatingCache!==ratings){
    personalRatingCache=ratings;
    // Keep older votes in storage, but excluded outfits cannot train suggestions.
    personalModelCache=ratings.filter(row=>row.ids.every((id,i)=>canUseColorForRole(COLORS[id],WADA_ROLES[i])))
      .map(row=>({...row,labs:row.ids.map(id=>wadaLab(COLORS[id].hex))}));
  }
  return personalModelCache;
}

function personalOutfitSimilarity(labs,other){
  const distances=labs.map((lab,i)=>wadaDistance(lab,other[i])**2);
  const near=distances.map(d=>Math.exp(-d/(2*.11**2)));
  // No standalone color likes/dislikes: both members of a role pair must match.
  const pairs=near[0]*near[1]*.45+near[0]*near[2]*.12+near[0]*near[3]*.12
    +near[1]*near[2]*.12+near[1]*near[3]*.12+near[2]*near[3]*.07;
  const whole=Math.exp(-distances.reduce((sum,d,i)=>sum+d*[.35,.4,.125,.125][i],0)/(2*.12**2));
  return personalClamp((pairs*.5+whole*.5-.30)/.70);
}

function personalFeedbackScore(colors){
  const model=personalRatingModel();if(!model.length)return 0;
  const f=personalFeatures(colors);let sum=0,evidence=0,reasonSum=0,reasonCount=0;
  for(const row of model){
    const similarity=personalOutfitSimilarity(f.labs,row.labs);
    sum+=row.vote*similarity;evidence+=similarity;
    if(row.vote!==-1||!row.reason)continue;
    if(row.reason==='light'){reasonSum-=personalClamp((f.light-.62)/.23);reasonCount++;}
    if(row.reason==='bright'){reasonSum-=personalClamp(f.bright*3);reasonCount++;}
    if(row.reason==='boring'){reasonSum-=1-f.twist;reasonCount++;}
    // "Clash" remains contextual; it never declares a whole hue incompatible.
  }
  return 32*sum/(3+evidence)+10*reasonSum/(4+reasonCount);
}

function personalSelectCandidates(candidates,context){
  let pool=prioritizeVisibleChanges(candidates,context);
  const rejected=new Set(personalRatingModel().filter(row=>row.vote===-1).map(row=>row.ids.join('|')));
  const accepted=pool.filter(c=>!rejected.has(c.key));
  if(accepted.length)pool=accepted;
  // One in six positions explores within the personal starting brief.
  const exploration=(state.suggestionSeq||0)%6===5;
  for(const c of pool)c.score=c.fit.quality*.18+c.score*.10
    +personalPriorScore(c.colors)+personalFeedbackScore(c.colors)*(exploration?.35:1);
  return pool;
}
