'use strict';

// Wada still supplies every complete palette. These rules rank only candidates
// that have already passed its original color, role and harmony constraints.
const LOOK_VARIETY = Object.freeze({
  mainChange: .14,
  constrainedChange: .10,
  recentDistance: .12,
  historySize: 8,
  preferenceLimit: 40,
  preferenceBonus: 6
});

function downloadedLookPreferences(){
  const input=Array.isArray(state.downloadPreferences)?state.downloadPreferences:[];
  const seen=new Set(),result=[];
  for(const entry of input){
    if(!Array.isArray(entry)||entry.length!==4||entry.some(id=>typeof id!=='string')||!wadaHardValid(entry.map(id=>COLORS[id])))continue;
    const key=entry.join('|');if(seen.has(key))continue;
    seen.add(key);result.push(entry.slice());
    if(result.length===LOOK_VARIETY.preferenceLimit)break;
  }
  return result;
}

function rememberDownloadedLook(look){
  const colors=WADA_ROLES.map(role=>look?.mapping?.[role]?.color);
  if(!wadaHardValid(colors))return false;
  const ids=colors.map(c=>c.id),preferences=downloadedLookPreferences();
  // Re-downloading one outfit is one preference, including after a reload.
  if(preferences.some(old=>old.every((id,i)=>id===ids[i])))return false;
  state.downloadPreferences=[ids,...preferences].slice(0,LOOK_VARIETY.preferenceLimit);
  saveState();
  updateDownloadPreferenceControl();
  return true;
}

function updateDownloadPreferenceControl(){
  const button=el('resetStyleLearningBtn');
  if(button)button.hidden=downloadedLookPreferences().length===0;
}

function resetDownloadPreferences(){
  state.downloadPreferences=[];
  const persisted=saveState();
  updateDownloadPreferenceControl();
  toast(persisted?'ההעדפות מההורדות אופסו':'ההעדפות אופסו לביקור הזה; הדפדפן לא מאפשר לשמור את האיפוס');
}

function wadaVarietyContext(fixed,replaceRole){
  // For a single-item replacement, the other three garments really are fixed.
  // For Next, only explicitly unlocked main garments drive visual novelty.
  const mainRoles=['top','bottom'].filter(role=>!fixed[role]);
  const roles=replaceRole?[replaceRole]:mainRoles;
  const indices=roles.map(role=>WADA_ROLES.indexOf(role));
  const current=state.currentLook;
  const currentLabs=current?indices.map(i=>wadaLab(current.mapping[WADA_ROLES[i]].color.hex)):[];
  const history=[],seen=new Set();
  if(!replaceRole&&indices.length){
    // Accessory edits must not count as eight sightings of the same shirt/pants.
    for(const old of recentHomeHistory(36)){
      const ids=roles.map(r=>old[r]);
      if(ids.some(id=>!COLORS[id]))continue;
      const key=ids.join('|');if(seen.has(key))continue;
      seen.add(key);history.push(ids.map(id=>wadaLab(COLORS[id].hex)));
      if(history.length===LOOK_VARIETY.historySize)break;
    }
  }
  const preferences=downloadedLookPreferences();
  // Every third generation explores without a learned preference bonus.
  const learn=preferences.length>0&&(state.suggestionSeq||0)%3!==0;
  const affinity=new Map();
  if(learn){
    const downloaded=preferences.map(ids=>ids.map(id=>wadaLab(COLORS[id].hex)));
    for(const color of Object.values(COLORS)){
      const lab=wadaLab(color.hex),values=[];
      for(let role=0;role<4;role++){
        let total=0,weight=0;
        downloaded.forEach((look,index)=>{
          const w=Math.pow(.94,index),d=wadaDistance(lab,look[role]);
          total+=Math.exp(-Math.pow(d/.13,2))*w;weight+=w;
        });
        values.push(total/weight);
      }
      affinity.set(color.id,values);
    }
  }
  return {fixed,replaceRole,indices,currentLabs,history,learn,affinity};
}

function wadaVisualMetrics(colors,context){
  const labs=context.indices.map(i=>wadaLab(colors[i].hex));
  const changes=context.currentLabs.length?labs.map((lab,i)=>wadaDistance(lab,context.currentLabs[i])):[];
  const nearest=context.history.length?Math.min(...context.history.map(old=>
    labs.reduce((sum,lab,i)=>sum+wadaDistance(lab,old[i]),0)/labs.length)):1;
  return {changes,minimum:changes.length?Math.min(...changes):1,nearest};
}

function wadaVisualScore(metrics,context){
  if(!metrics.changes.length)return 0;
  // Reward a clear change, then stop: ever more extreme color is not the goal.
  const change=metrics.changes.reduce((sum,d)=>sum+Math.min(1,d/.22)*16,0)/metrics.changes.length;
  const repeat=context.replaceRole?0:Math.max(0,1-metrics.nearest/.18)*32;
  return change-repeat;
}

function wadaPreferenceScore(colors,context){
  if(!context.learn)return 0;
  const weights=[.42,.48,.05,.05];
  return LOOK_VARIETY.preferenceBonus*colors.reduce((sum,c,i)=>sum+(context.affinity.get(c.id)?.[i]||0)*weights[i],0);
}

function prioritizeVisibleChanges(candidates,context){
  if(!context.currentLabs.length||!context.indices.length)return candidates;
  const mainReplacement=context.replaceRole&&['top','bottom'].includes(context.replaceRole);
  const desired=context.replaceRole?(mainReplacement ? .085 : .065):LOOK_VARIETY.mainChange;
  // This gate comes before preference bonuses and palette recency. A favorite
  // hue or a new palette number cannot masquerade as changed main garments.
  const clear=candidates.filter(c=>c.visual.minimum>=desired);
  let pool=clear;
  if(!pool.length){
    const relaxed=candidates.filter(c=>c.visual.minimum>=LOOK_VARIETY.constrainedChange);
    if(relaxed.length)pool=relaxed;
    else{
      // Locks can leave only close shades. Keep harmony and locks intact and
      // use the largest available change instead of inventing an invalid look.
      const largest=Math.max(...candidates.map(c=>c.visual.minimum));
      pool=candidates.filter(c=>c.visual.minimum>=largest-.015);
    }
  }
  if(!context.replaceRole&&context.history.length){
    const fresh=pool.filter(c=>c.visual.nearest>=LOOK_VARIETY.recentDistance);
    if(fresh.length)pool=fresh;
  }
  return pool;
}
