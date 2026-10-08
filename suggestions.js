'use strict';

// Wada still supplies every complete palette. These rules rank only candidates
// that have already passed its original color, role and harmony constraints.
const LOOK_VARIETY = Object.freeze({
  mainChange: .14,
  constrainedChange: .10,
  recentDistance: .12,
  historySize: 8
});

// Composition is separate from change between consecutive looks. Light/dark
// versions of one hue must not pass as a new color inside the same outfit.
const LOOK_COMPOSITION = Object.freeze({
  nearDistance: .11,
  neutralDistance: .23,
  hueChroma: .025,
  sameHueDegrees: 40,
  mainDistance: .14,
  mainChroma: .075,
  accentChroma: .065,
  accentHueDegrees: 50
});

function wadaHueGap(a,b){
  const delta=Math.abs(Math.atan2(a[2],a[1])-Math.atan2(b[2],b[1]))*180/Math.PI;
  return Math.min(delta,360-delta);
}

const wadaToneCache=new WeakMap();
function wadaSameTone(a,b){
  const cached=wadaToneCache.get(a)?.get(b);if(cached!==undefined)return cached;
  const distance=wadaDistance(a,b),ca=wadaChroma(a),cb=wadaChroma(b);
  const result=distance<LOOK_COMPOSITION.nearDistance
    ||(ca<LOOK_COMPOSITION.hueChroma&&cb<LOOK_COMPOSITION.hueChroma&&distance<LOOK_COMPOSITION.neutralDistance)
    ||(ca>=LOOK_COMPOSITION.hueChroma&&cb>=LOOK_COMPOSITION.hueChroma&&wadaHueGap(a,b)<LOOK_COMPOSITION.sameHueDegrees);
  if(!wadaToneCache.has(a))wadaToneCache.set(a,new WeakMap());
  if(!wadaToneCache.has(b))wadaToneCache.set(b,new WeakMap());
  wadaToneCache.get(a).set(b,result);wadaToneCache.get(b).set(a,result);
  return result;
}

function wadaComposition(colors){
  const labs=colors.map(c=>wadaLab(c.hex)),chroma=labs.map(wadaChroma);
  const matchingShoes=wadaSameTone(labs[0],labs[2]);
  const tonalMain=wadaSameTone(labs[0],labs[1])||wadaDistance(labs[0],labs[1])<LOOK_COMPOSITION.mainDistance;
  let colorfulPair=false,distinctColors=1;
  // Only four garments: inspect every subset so group count does not depend on
  // garment order, and nearby hues cannot inflate the count through chaining.
  for(let mask=1;mask<16;mask++){
    const indices=[0,1,2,3].filter(i=>mask&(1<<i));
    if(indices.every((i,k)=>indices.slice(k+1).every(j=>!wadaSameTone(labs[i],labs[j]))))
      distinctColors=Math.max(distinctColors,indices.length);
  }
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
    if(chroma[i]>=LOOK_COMPOSITION.accentChroma&&chroma[j]>=LOOK_COMPOSITION.accentChroma
      &&wadaHueGap(labs[i],labs[j])>=LOOK_COMPOSITION.accentHueDegrees
      &&!wadaSameTone(labs[i],labs[j]))colorfulPair=true;
  }
  const mainColor=Math.max(chroma[0],chroma[1]);
  const valid=!matchingShoes&&!tonalMain&&colorfulPair&&mainColor>=LOOK_COMPOSITION.mainChroma;
  // Saturation rewards stop early: deep, muted and pastel colors still belong.
  const score=Math.min(1,mainColor/.14)*8+Math.min(3,distinctColors)*3;
  return {valid,matchingShoes,tonalMain,colorfulPair,mainColor,distinctColors,score};
}

function prioritizeColorComposition(candidates,context){
  // Three out of four generation positions prefer a third distinct color.
  // The fourth also admits bold two-color combinations for a varied rhythm.
  if(!context.replaceRole&&(state.suggestionSeq||0)%4!==3){
    const multicolor=candidates.filter(c=>c.composition.distinctColors>=3);
    if(multicolor.length)return multicolor;
  }
  return candidates;
}

function wadaLockedStyleMessage(fixed){
  const current=state.currentLook;
  if(!current)return null;
  const lab=role=>wadaLab(current.mapping[role].color.hex);
  if(fixed.top&&fixed.shoes&&wadaSameTone(lab('top'),lab('shoes')))
    return 'החולצה והנעליים נעולות בגוונים דומים. שחררי אחת מהן כדי להפריד בין הצבעים.';
  if(fixed.top&&fixed.bottom&&(wadaSameTone(lab('top'),lab('bottom'))||wadaDistance(lab('top'),lab('bottom'))<LOOK_COMPOSITION.mainDistance))
    return 'החולצה והמכנסיים נעולים בגוונים קרובים. שחררי אחד מהם כדי לקבל לוק מגוון יותר.';
  return null;
}

function wadaCanPlaceColor(colors,index,color){
  const lab=wadaLab(color.hex);
  for(const [a,b] of [[0,1],[0,2]]){
    if(index!==a&&index!==b)continue;
    const other=colors[index===a?b:a];if(!other)continue;
    const otherLab=wadaLab(other.hex);
    if(wadaSameTone(lab,otherLab)||(b===1&&wadaDistance(lab,otherLab)<LOOK_COMPOSITION.mainDistance))return false;
  }
  return true;
}

function wadaCoverageTargets(fixed,replaceRole){
  if(replaceRole)return [];
  const seq=state.suggestionSeq||0,current=state.currentLook;
  const covered=new Set(wadaCoverageCycle().seen);
  const recentIds=new Set(recentHomeHistory(6).flatMap(h=>h.ids||[]));
  const ranked=Object.values(COLORS).filter(color=>!isBannedColor(color)&&!recentIds.has(color.id)
    &&WADA_ROLES.some(role=>!fixed[role]&&canUseColorForRole(color,role)
      &&(!current||!['top','bottom'].includes(role)||wadaDistance(wadaLab(color.hex),wadaLab(current.mapping[role].color.hex))>=LOOK_VARIETY.mainChange)))
    .map(color=>{
      const use=state.colorUsage?.[color.id];
      // Unseen colors lead. Afterwards, age keeps every shade returning, while
      // count breaks near-ties in favor of colors that had fewer opportunities.
      const priority=(covered.has(color.id)?0:2000)+(use?Math.min(800,seq-(use.lastSeq||0))-Math.min(40,(use.count||0)*2):1000);
      return {color,priority:priority+Math.random()*12};
    }).sort((a,b)=>b.priority-a.priority);
  const pending=ranked.filter(x=>!covered.has(x.color.id));
  return (pending.length?pending:ranked).slice(0,12).map(x=>x.color);
}

// Balance recognizable colors in every role, independently of how many
// named shades each color has. Black is one group, just like blue or green.
const wadaColorGroupById=new Map(Object.entries(COLOR_FAMILIES)
  .flatMap(([group,ids])=>ids.map(id=>[id,group])));
wadaColorGroupById.set('black','black');
for(const color of Object.values(COLORS)){
  if(wadaColorGroupById.has(color.id)||isBannedColor(color))continue;
  const group={neutral:'אפור / שחור',light:'לבן / שמנת','dark-neutral':'בז׳ / חום',
    'warm-neutral':'בז׳ / חום',blue:'כחול / תכלת',green:'ירוק',soft:'ורוד',
    purple:'סגול','warm-accent':'צהוב / כתום',red:'אדום מוגבל'}[color.family];
  wadaColorGroupById.set(color.id,group||color.family);
}
const WADA_COLOR_GROUPS=Object.freeze(Object.fromEntries(
  [...new Set(wadaColorGroupById.values())].map(group=>[group,Object.values(COLORS)
    .filter(c=>!isBannedColor(c)&&wadaColorGroupById.get(c.id)===group).map(c=>c.id)])));

function wadaGroupTargets(fixed,replaceRole){
  // Let the last few rare shades finish the existing coverage cycle. Otherwise
  // a color group could repeatedly occupy their only compatible slot.
  if(!replaceRole){
    const covered=new Set(wadaCoverageCycle().seen);
    const pending=Object.values(COLORS).filter(c=>!isBannedColor(c)&&!covered.has(c.id));
    if(pending.length>0&&pending.length<=4)return [];
  }
  const history=recentHomeHistory(36),targets=[];
  for(const role of WADA_ROLES){
    if(fixed[role]||(replaceRole&&replaceRole!==role))continue;
    const eligible=Object.entries(WADA_COLOR_GROUPS).map(([group,ids])=>
      [group,ids.filter(id=>canUseColorForRole(COLORS[id],role))]).filter(([,ids])=>ids.length);
    for(const [group,ids] of eligible){
      const last=history.findIndex(look=>wadaColorGroupById.get(look[role])===group);
      const count=history.filter(look=>wadaColorGroupById.get(look[role])===group).length;
      targets.push({role,index:WADA_ROLES.indexOf(role),group,ids:new Set(ids),
        count,pressure:count*eligible.length,age:last<0?history.length+1:last});
    }
  }
  // A blue seen in five different shades still counts as five blue items.
  // Every group gets the same count/age rule, with random ties.
  // Roles with fewer allowed groups (no red clothes) have a different fair
  // share. Normalize counts so those roles are not starved by accessories.
  return shuffleArray(targets).sort((a,b)=>a.pressure-b.pressure||b.age-a.age);
}

function wadaGroupFocus(refs,colors,targets,sources,replaceRole){
  for(const target of targets){
    const i=target.index;
    if(colors[i])continue;
    const options=sources[refs[i]].options[target.role].filter(o=>target.ids.has(o.color.id)
      &&!colors.some(c=>c?.id===o.color.id)
      &&(!isRedColor(o.color)||!colors.some(c=>c&&isRedColor(c)))
      &&wadaCanPlaceColor(colors,i,o.color)
      &&(replaceRole||i>1||!state.currentLook
        ||wadaDistance(wadaLab(o.color.hex),wadaLab(state.currentLook.mapping[target.role].color.hex))>=LOOK_VARIETY.mainChange)
      &&(replaceRole!==target.role||o.color.id!==state.currentLook?.mapping[target.role].color.id));
    if(options.length)return {index:i,color:weightedPick(options.map(o=>({color:o.color,
      weight:Math.max(1,12+shadeCoverageWeight(o.color,target.role)*.6)})))};
  }
  return null;
}

function prioritizeColorGroups(candidates,targets){
  for(const target of targets){
    const matching=candidates.filter(c=>target.ids.has(c.colors[target.index].id));
    if(matching.length){
      // Balance the other free garments too; targeting one rare group must not
      // leave the remaining three slots dominated by the largest shade banks.
      const pressure=c=>targets.reduce((sum,t)=>sum+(t.ids.has(c.colors[t.index].id)?t.pressure:0),0);
      const ranked=matching.map(candidate=>({candidate,pressure:pressure(candidate)}));
      const best=Math.min(...ranked.map(c=>c.pressure));
      return ranked.filter(c=>c.pressure<=best+9).map(c=>c.candidate);
    }
  }
  return candidates;
}

function wadaCoverageFocus(refs,colors,targets,sources){
  for(const color of targets){
    if(colors.some(c=>c?.id===color.id)||(isRedColor(color)&&colors.some(c=>c&&isRedColor(c))))continue;
    const roles=shuffleArray([0,1,2,3]).filter(i=>!colors[i]
      &&sources[refs[i]].optionIds[WADA_ROLES[i]].has(color.id)
      &&wadaCanPlaceColor(colors,i,color)
      &&(!state.currentLook||i>1||wadaDistance(wadaLab(color.hex),wadaLab(state.currentLook.mapping[WADA_ROLES[i]].color.hex))>=LOOK_VARIETY.mainChange));
    if(roles.length){
      // Every role gets the same priority, including shoes and bags.
      const use=state.colorUsage?.[color.id]?.roles||{};
      roles.sort((a,b)=>(use[WADA_ROLES[a]]||0)-(use[WADA_ROLES[b]]||0));
      return {index:roles[0],color};
    }
  }
  return null;
}

function prioritizeShadeCoverage(candidates,targets){
  for(const target of targets){
    const containing=candidates.filter(c=>c.colors.some(color=>color.id===target.id));
    if(containing.length){
      const roles=state.colorUsage?.[target.id]?.roles||{};
      const leastUsed=Math.min(...containing.map(c=>roles[WADA_ROLES[c.colors.findIndex(color=>color.id===target.id)]]||0));
      return containing.filter(c=>(roles[WADA_ROLES[c.colors.findIndex(color=>color.id===target.id)]]||0)===leastUsed);
    }
  }
  return candidates;
}

function wadaCoverageCycle(){
  const raw=state.shadeCoverage||{},seen=Array.isArray(raw.seen)?raw.seen:[];
  return {round:Number.isSafeInteger(raw.round)&&raw.round>=0?raw.round:0,
    seen:[...new Set(seen.filter(id=>typeof id==='string'&&COLORS[id]&&!isBannedColor(COLORS[id])))]};
}

function rememberShadeCoverage(look){
  const cycle=wadaCoverageCycle(),seen=new Set(cycle.seen);
  WADA_ROLES.forEach(role=>{const c=look.mapping?.[role]?.color;if(c&&COLORS[c.id]&&!isBannedColor(c))seen.add(c.id)});
  const total=Object.values(COLORS).filter(c=>!isBannedColor(c)).length;
  state.shadeCoverage=seen.size===total?{round:cycle.round+1,seen:[]}:{round:cycle.round,seen:[...seen]};
}

function updateShadeCoverageControl(){
  const label=el('shadeCoverageStatus');if(!label)return;
  const cycle=wadaCoverageCycle(),total=Object.values(COLORS).filter(c=>!isBannedColor(c)).length;
  label.textContent=`סבב צבעים ${cycle.round+1}: ${cycle.seen.length} מתוך ${total} גוונים הוצגו. גוונים שטרם הופיעו מקבלים קדימות; נעילות עשויות לצמצם את האפשרויות.`;
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
  return {fixed,replaceRole,indices,currentLabs,history};
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

function prioritizeVisibleChanges(candidates,context){
  if(!context.currentLabs.length||!context.indices.length)return candidates;
  const mainReplacement=context.replaceRole&&['top','bottom'].includes(context.replaceRole);
  const desired=context.replaceRole?(mainReplacement ? .085 : .065):LOOK_VARIETY.mainChange;
  // This gate comes before palette recency. A new palette number cannot
  // masquerade as changed main garments.
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
