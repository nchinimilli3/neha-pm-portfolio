import React, { useEffect, useRef, useState } from 'react';
import './lifecycle-road.css';
import { ShelbyMark } from './CarArt';
import MachEArtwork from './MachEArtwork';
import RollingVehicle from './RollingVehicle';

// A sticky road across the top of the case. The car drives continuously with the scroll,
// the road fills behind it, and the readout names the stage on screen.

const G=({id,stops,x2='0',y2='1'}:{id:string,stops:[string,string][],x2?:string,y2?:string})=><linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>{stops.map(([o,c])=><stop key={o} offset={o} stopColor={c}/>)}</linearGradient>;
const shadow=(cx:number,rx:number,cy=37.5)=><ellipse cx={cx} cy={cy} rx={rx} ry="2.6" fill="url(#lcGround)"/>;
const ground=<radialGradient id="lcGround"><stop offset="0" stopColor="#000" stopOpacity=".38"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>;
// A spoked alloy wheel with tire sidewall, rim gradient, and hub.
const wheel=(cx:number,cy:number,r:number,spokes=5)=><g className="lcWheel" style={{transformOrigin:`${cx}px ${cy}px`}}>
 <circle cx={cx} cy={cy} r={r} fill="#16181c"/><circle cx={cx} cy={cy} r={r*.82} fill="none" stroke="#2c3036" strokeWidth={r*.12}/>
 <circle cx={cx} cy={cy} r={r*.62} fill="url(#lcRim)"/>
 {Array.from({length:spokes},(_,i)=>{const a=i*2*Math.PI/spokes;return <path key={i} d={`M${cx} ${cy}L${cx+Math.cos(a)*r*.58} ${cy+Math.sin(a)*r*.58}`} stroke="#8a9199" strokeWidth={r*.14} strokeLinecap="round"/>})}
 <circle cx={cx} cy={cy} r={r*.16} fill="#dfe3e6"/>
</g>;
const rim=<radialGradient id="lcRim" cx=".4" cy=".35"><stop offset="0" stopColor="#f4f6f7"/><stop offset=".7" stopColor="#b9c0c6"/><stop offset="1" stopColor="#6d747b"/></radialGradient>;

// Each case study's traveler, drawn at 96 x 40 with the ground line at y ≈ 37.
const travelers:Record<string,React.ReactNode>={
 car:<svg viewBox="0 0 96 40"><defs>{ground}{rim}
  <G id="lcCarBody" stops={[['0','#f2a468'],['.45','#d9803f'],['1','#8f4a1f']]}/>
  <G id="lcCarGlass" stops={[['0','#e9f3f8'],['.55','#7d97a8'],['1','#2b3a46']]}/>
  </defs>{shadow(49,42)}
  <path fill="url(#lcCarBody)" d="M5 30.5v-6.2c0-2.3 1.6-4.2 3.8-4.7l14.6-3.1 12.8-8.2c2.3-1.4 5-2.2 7.7-2.2h13.3c3.3 0 6.4 1.3 8.8 3.6l7.2 6.6 10.2 2c3 .6 5.2 3.2 5.2 6.3v5.9z"/>
  <path fill="url(#lcCarGlass)" d="M31.3 15.3l8.4-5.2c1.4-.8 3-1.3 4.6-1.3h6.3v6.5zM53.1 8.8h4.6c2.1 0 4.2.8 5.8 2.3l4.6 4.2H53.1z"/>
  <path d="M33 11.5l3-1.8" stroke="#fff" strokeOpacity=".7" strokeWidth="1.2" strokeLinecap="round"/>
  <path d="M51.6 9v21M8 22.5h80" stroke="#6e3714" strokeOpacity=".45" strokeWidth=".8"/>
  <path d="M10 25.4h76" stroke="#ffd9b3" strokeOpacity=".55" strokeWidth="1.1"/>
  <path d="M38 20.6h6.5" stroke="#5a2c10" strokeWidth="1.3" strokeLinecap="round"/>
  <path d="M87.5 19.6h4.4a1.5 1.5 0 0 1 1.5 1.5v1.5h-6z" fill="#fff4c9"/><path d="M5.2 21.5h3v3h-3z" fill="#d2281f"/>
  {wheel(24,30.5,6.8)}{wheel(74,30.5,6.8)}</svg>,
 ev:<svg viewBox="0 0 96 40"><defs>{ground}{rim}
  <G id="lcEvBody" stops={[['0','#8fc8ff'],['.4','#2f8fe0'],['1','#0f3f73']]}/>
  <G id="lcEvGlass" stops={[['0','#dcebf6'],['.5','#50657a'],['1','#141c24']]}/>
  </defs>{shadow(49,43)}
  <path fill="url(#lcEvBody)" d="M4 31v-8c0-2.4 1.6-4.4 3.9-4.9l11.8-2.7 11-7.9c1.9-1.3 4.1-2 6.3-2h19c2.8 0 5.5 1.1 7.5 3.1l7.7 7.4 8.7 1.9c3 .7 5.1 3.3 5.1 6.3V31z"/>
  <path d="M26 15.6l11-7.6c1.4-.9 3-1.5 4.7-1.5h19.6c2.3 0 4.4.9 6 2.5l6.2 6.6z" fill="#101820" opacity=".9"/>
  <path fill="url(#lcEvGlass)" d="M28.8 15l9.3-6.4c1-.7 2.2-1 3.4-1H48V15zM50.6 7.6h8.6c1.9 0 3.7.8 5 2.1l4.8 5.3H50.6z"/>
  <path d="M31 12.6l4-2.7" stroke="#fff" strokeOpacity=".6" strokeWidth="1.1" strokeLinecap="round"/>
  <path d="M49.3 7.6V31M8 24h82" stroke="#082a4d" strokeOpacity=".45" strokeWidth=".8"/>
  <path d="M84 19.4h8" stroke="#eaf6ff" strokeWidth="2" strokeLinecap="round"/><path d="M4.4 20h5" stroke="#ff4d4d" strokeWidth="2" strokeLinecap="round"/>
  <path d="M47.4 17.6l-3.4 4.8h3l-2.2 4.4 5.2-5.8h-3l1.9-3.4z" fill="#fff"/>
  {wheel(23,31,7.2,6)}{wheel(75,31,7.2,6)}</svg>,
 mustang:<ShelbyMark/>,
 mache:<MachEArtwork className="lcMarkCar lcMarkMachE"/>,
 cablecar:<svg viewBox="0 0 96 40"><defs>{ground}{rim}
  <G id="lcCcMaroon" stops={[['0','#b63a36'],['1','#6e1a1a']]}/>
  <G id="lcCcCream" stops={[['0','#fff8e6'],['1','#dccfa9']]}/>
  <G id="lcCcRoof" stops={[['0','#7a5238'],['1','#3f2819']]}/>
  <G id="lcCcGlass" x2="1" y2="1" stops={[['0','#9fb1c2'],['.5','#3e4d5d'],['1','#1f2831']]}/>
  </defs>{shadow(48,42)}
  <path d="M48 32v6" stroke="#2a2327" strokeWidth="2.2"/>
  <path d="M6 7.5h84l-3-3.2H9z" fill="url(#lcCcRoof)"/><rect x="18" y="1.6" width="60" height="3" rx="1" fill="url(#lcCcCream)"/>
  <rect x="9" y="7.5" width="78" height="13" fill="url(#lcCcCream)"/>
  <rect x="9" y="20" width="78" height="10.5" fill="url(#lcCcMaroon)"/><rect x="9" y="19.2" width="78" height="1.8" fill="#2f4d7c"/>
  <path d="M12 22.5h72v6H12z" fill="none" stroke="#e1bd67" strokeWidth=".7"/>
  {[13,21,29,55,63,71,79].map(x=><g key={x}><path d={`M${x} 18V12a3 3 0 0 1 6 0v6z`} fill="url(#lcCcGlass)"/><path d={`M${x+1.5} 16.4v-3.2`} stroke="#fff" strokeOpacity=".45" strokeWidth=".9"/></g>)}
  <rect x="38" y="8.5" width="20" height="21" fill="#2a1d18" opacity=".35"/>
  <path d="M39 8v22M57 8v22" stroke="#e0b75b" strokeWidth="1.4"/>
  <circle cx="44" cy="14" r="2" fill="#8d5a42"/><path d="M41.8 22v-5a2.2 2.2 0 0 1 4.4 0v5z" fill="#5b3f96"/>
  <circle cx="52" cy="13.6" r="1.8" fill="#e2b995"/><path d="M50 22v-4.6a2 2 0 0 1 4 0V22z" fill="#3f7f6c"/>
  <circle cx="48" cy="25" r="3" fill="url(#lcCcCream)" stroke="#e1bd67" strokeWidth=".6"/>
  <circle cx="8" cy="15" r="1.6" fill="#ffe7a1"/><circle cx="88" cy="15" r="1.6" fill="#ffe7a1"/>
  <rect x="7" y="30" width="82" height="2.2" rx="1" fill="#2b1f1a"/>
  {wheel(20,33.5,3.6)}{wheel(76,33.5,3.6)}</svg>,
 box:<svg viewBox="0 0 96 40"><defs>{ground}
  <G id="lcBoxTopG" x2="1" y2="1" stops={[['0','#e9c894'],['1','#cda56c']]}/>
  <G id="lcBoxL" stops={[['0','#c49660'],['1','#9f7442']]}/>
  <G id="lcBoxR" stops={[['0','#d6ad73'],['1','#b3874f']]}/>
  </defs>{shadow(48,30,38)}
  <path d="M22 13.5L48 5l26 8.5-26 8.6z" fill="url(#lcBoxTopG)"/>
  <path d="M22 13.5v18.3L48 37V22.1z" fill="url(#lcBoxL)"/><path d="M74 13.5v18.3L48 37V22.1z" fill="url(#lcBoxR)"/>
  <path d="M35 9.3l26 8.5v6.6l-3 1V18.8L32 10.3z" fill="#efe0b9" opacity=".9"/><path d="M36.5 9.6l25 8.2" stroke="#fff" strokeOpacity=".6" strokeWidth=".7"/>
  <path d="M22 13.5l26 8.6 26-8.6" fill="none" stroke="#8b6536" strokeWidth=".6" strokeOpacity=".6"/>
  <path d="M52.5 23.7l17-5.6v9.2l-17 5.6z" fill="#fbf8ef"/>
  {[0,1.5,2.6,4.2,5.4,6.8,8.3,9.5,10.7].map((d,i)=><path key={i} d={`M${54.5+d} ${27.6-d*.33}v${i%3===0?4:3.2}`} stroke="#1f2b26" strokeWidth=".6"/>)}
  <path d="M54 25.2l6-2" stroke="#a0482f" strokeWidth=".9"/>
  <path d="M27 24l3.5 1.2M28.8 21.8v4.8" stroke="#6b4a26" strokeWidth=".8" strokeOpacity=".7"/></svg>,
 cheese:<svg viewBox="0 0 96 40"><defs>{ground}
  <G id="lcChSide" stops={[['0','#f7c65a'],['1','#e0a12c']]}/>
  <G id="lcChTop" x2="1" y2="0" stops={[['0','#fbe3a0'],['1','#f5cf6c']]}/>
  <radialGradient id="lcHoleG" cx=".4" cy=".35"><stop offset="0" stopColor="#b97c17"/><stop offset="1" stopColor="#e3a93a"/></radialGradient>
  <radialGradient id="lcGrapeG" cx=".35" cy=".3"><stop offset="0" stopColor="#c07bb1"/><stop offset=".45" stopColor="#7a3d6e"/><stop offset="1" stopColor="#3f1c39"/></radialGradient>
  </defs>{shadow(46,40)}
  <path d="M10 35V19.5L52 8l20 11.5V35z" fill="url(#lcChSide)"/>
  <path d="M10 19.5L52 8l20 11.5z" fill="url(#lcChTop)"/>
  <path d="M10 19.5h62" stroke="#c98a1f" strokeOpacity=".5" strokeWidth=".8"/><path d="M10 35h62" stroke="#b8791a" strokeWidth="1.4"/>
  {[[20,26,3],[33,30,2.2],[48,25,3.6],[61,30,2.4],[40,21.8,1.4],[27,20.6,1.2],[58,16.6,1.3]].map(([x,y,r],i)=><ellipse key={i} cx={x} cy={y} rx={r} ry={r*.85} fill="url(#lcHoleG)"/>)}
  {[[80,26],[86,28.5],[81.5,32],[87.5,33.4],[76.5,31],[84,21.5]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="3.6" fill="url(#lcGrapeG)"/><circle cx={x-1.1} cy={y-1.2} r=".8" fill="#fff" opacity=".55"/></g>)}
  <path d="M84 18q1.5-4 5-4.6M85.6 15.4q2.6-.4 3.4 1.6" fill="none" stroke="#5c7a3e" strokeWidth="1.3" strokeLinecap="round"/></svg>,
 train:<svg viewBox="0 0 96 40"><defs>{ground}{rim}
  <G id="lcBartBody" stops={[['0','#ffffff'],['.55','#dfe4e9'],['1','#a9b2bb']]}/>
  <G id="lcBartNose" x2="1" y2="0" stops={[['0','#0a6fa8'],['1','#18a8e6']]}/>
  <G id="lcBartWin" stops={[['0','#566677'],['.5','#1d252e'],['1','#0f1419']]}/>
  </defs>{shadow(48,46)}
  <path d="M3 11a5 5 0 0 1 5-5h72c4 0 7.4 2.5 8.7 6.2l2.6 7.3V31H3z" fill="url(#lcBartBody)"/>
  <path d="M80 6c4 0 7.4 2.5 8.7 6.2l2.6 7.3V31H81z" fill="url(#lcBartNose)"/>
  <path d="M82 9.6h3.2c1.6 0 3 1 3.6 2.5l1.6 4.4H82z" fill="url(#lcBartWin)"/>
  <rect x="3" y="9.5" width="75" height="8.4" rx="1.4" fill="url(#lcBartWin)"/>
  {[6,20,40,58].map(x=><path key={x} d={`M${x+2} 10.8l3 6`} stroke="#fff" strokeOpacity=".22" strokeWidth="1.4"/>)}
  {[16,32,48,64].map(x=><rect key={x} x={x} y="9" width="7" height="21" rx=".8" fill="none" stroke="#8c96a0" strokeWidth=".8"/>)}
  <rect x="3" y="22.6" width="78" height="1.6" fill="#0099d8"/>
  <rect x="84" y="21" width="4" height="2.4" rx=".8" fill="#fff4c4"/>
  <rect x="4" y="30.5" width="86" height="2.6" fill="#3b4148"/>
  <rect x="10" y="31.6" width="20" height="3" rx="1" fill="#2a2e33"/><rect x="62" y="31.6" width="20" height="3" rx="1" fill="#2a2e33"/>
  {wheel(15,34.4,3.2)}{wheel(25,34.4,3.2)}{wheel(67,34.4,3.2)}{wheel(77,34.4,3.2)}</svg>,
 calendar:<svg viewBox="0 0 96 40"><defs>{ground}
  <G id="lcCalPaper" stops={[['0','#ffffff'],['1','#eef0ea']]}/>
  <G id="lcCalHead" stops={[['0','#c7584a'],['1','#8f3328']]}/>
  <G id="lcRingG" x2="1" y2="0" stops={[['0','#6f757b'],['.5','#f1f3f4'],['1','#5c6166']]}/>
  </defs>{shadow(48,20,38)}
  <path d="M30 6.5h36a4 4 0 0 1 4 4V36H34a4 4 0 0 1-4-4z" fill="#d7d9d2"/>
  <path d="M28 5h36a4 4 0 0 1 4 4v20l-7 7H32a4 4 0 0 1-4-4z" fill="url(#lcCalPaper)" stroke="#00000018" strokeWidth=".6"/>
  <path d="M61 36v-5a2 2 0 0 1 2-2h5z" fill="#d9dbd4"/><path d="M61 36l7-7" stroke="#00000022" strokeWidth=".6"/>
  <path d="M28 14V9a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v5z" fill="url(#lcCalHead)"/>
  <text x="48" y="12" textAnchor="middle" style={{font:'700 5.5px sans-serif',fill:'#fff',letterSpacing:'.08em'}}>SEP</text>
  <text x="48" y="29.5" textAnchor="middle" style={{font:'700 14px Georgia,serif',fill:'#1f2b27'}}>16</text>
  {[37,59].map(x=><g key={x}><rect x={x-1.6} y="1.2" width="3.2" height="7.4" rx="1.6" fill="url(#lcRingG)"/><circle cx={x} cy="8" r="1.1" fill="#5a1c16"/></g>)}</svg>,
 book:<svg viewBox="0 0 96 40"><defs>{ground}
  <G id="lcBookCloth" stops={[['0','#4d7a64'],['1','#244236']]}/>
  <G id="lcBookPages" stops={[['0','#fffaf0'],['1','#e5d9bd']]}/>
  <G id="lcRibbonG" x2="1" y2="0" stops={[['0','#7d3a32'],['.5','#b35d51'],['1','#7d3a32']]}/>
  </defs>{shadow(48,40,38)}
  <path d="M12 20h70v12H12z" fill="url(#lcBookPages)"/>
  {[23,25.4,27.8,30.2].map(y=><path key={y} d={`M14 ${y}h67`} stroke="#d4c6a4" strokeWidth=".5"/>)}
  <path d="M8 14.5a3 3 0 0 1 3-3h73a3 3 0 0 1 3 3V20H8z" fill="url(#lcBookCloth)"/>
  <path d="M8 32h79v3a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="url(#lcBookCloth)"/>
  <path d="M8 14.5a3 3 0 0 1 3-3h3v25.5h-3a3 3 0 0 1-3-3z" fill="#1b3329"/>
  <path d="M20 15.2h40M20 17.4h26" stroke="#e8cf8f" strokeWidth=".9"/><path d="M9.5 16v18" stroke="#e8cf8f" strokeWidth=".6" strokeOpacity=".7"/>
  <path d="M70 11.5h5v25l-2.5-2.6-2.5 2.6z" fill="url(#lcRibbonG)"/>
  <path d="M11 12.4h72" stroke="#fff" strokeOpacity=".22" strokeWidth=".8"/></svg>,
 bottle:<svg viewBox="30 0 36 40"><defs>{ground}
  <G id="lcCapG" x2="1" y2="0" stops={[['0','#6f4f20'],['.18','#c9a25d'],['.38','#f7e7bd'],['.55','#d4b06a'],['.8','#9c7a3d'],['1','#5e421a']]}/>
  <G id="lcGlassG" x2="1" y2="0" stops={[['0','#d8cdbd'],['.12','#f7f3ec'],['.5','#fbf8f3'],['.88','#efe8dc'],['1','#c9bca6']]}/>
  <G id="lcLiquidG" x2="1" y2="0" stops={[['0','#8a5634'],['.35','#c08a60'],['.65','#b27b52'],['1','#7a4a2b']]}/>
  </defs>{shadow(48,15,38.4)}
  {/* Brushed gold cap with a darker collar */}
  <rect x="41" y="1" width="14" height="12.5" rx="1.2" fill="url(#lcCapG)"/>
  <path d="M43 2.2v10M53 2.2v10" stroke="#fff" strokeOpacity=".35" strokeWidth=".6"/>
  <rect x="42" y="13.5" width="12" height="1.8" fill="#5e421a"/>
  {/* Thick frosted glass: outer body, then the foundation seen through an inner wall */}
  <rect x="35" y="15.3" width="26" height="22.7" rx="3" fill="url(#lcGlassG)" stroke="#b9a88c" strokeWidth=".5"/>
  <rect x="37.6" y="18" width="20.8" height="17.6" rx="1.6" fill="url(#lcLiquidG)"/>
  <rect x="37.6" y="18" width="20.8" height="2" rx="1" fill="#d7a57c" opacity=".7"/>
  {/* Label: brand line and product name as simple marks, legible at bar size */}
  <rect x="40.5" y="22.4" width="15" height="7.6" rx=".6" fill="#fbf7f0" opacity=".92"/>
  <path d="M42.3 24.6h11.4" stroke="#07132f" strokeWidth=".9"/>
  <path d="M43.8 27.4h8.4" stroke="#07132f" strokeWidth=".6" strokeOpacity=".7"/>
  <path d="M36.4 17v19" stroke="#fff" strokeOpacity=".9" strokeWidth="1.2" strokeLinecap="round"/>
  <path d="M59.6 19v14" stroke="#fff" strokeOpacity=".45" strokeWidth=".6"/></svg>,
 bubble:<svg viewBox="0 0 96 40"><defs>
  <G id="lcBubG" stops={[['0','#5ab0ff'],['1','#0a6fe0']]}/>
  <filter id="lcBubShadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#0a3d7a" floodOpacity=".28"/></filter>
  </defs>
  <path filter="url(#lcBubShadow)" d="M26 5h44a12.5 12.5 0 0 1 0 25H34.5l-9.5 4.8 2.7-5.6A12.5 12.5 0 0 1 26 5z" fill="url(#lcBubG)"/>
  <path d="M28 8.5h36" stroke="#fff" strokeOpacity=".28" strokeWidth="1.6" strokeLinecap="round"/>
  <circle cx="38" cy="17.5" r="3" className="lcTypeDot"/><circle cx="48" cy="17.5" r="3" className="lcTypeDot"/><circle cx="58" cy="17.5" r="3" className="lcTypeDot"/>
  <text x="84" y="37.5" textAnchor="end" style={{font:'500 4.4px -apple-system,sans-serif',fill:'#8896a8'}}>Delivered</text></svg>
};

export type Traveler='car'|'mustang'|'mache'|'ev'|'cablecar'|'box'|'cheese'|'train'|'calendar'|'book'|'bottle'|'bubble';
const HONKS:Record<string,string>={train:'ding ding!',cablecar:'clang clang!',book:'shh!',calendar:'ding!',bubble:'…',mustang:'vroom!',mache:'…whirr (it’s electric)',box:'beep beep!',bottle:'clink!',cheese:'squeak!'};

export default function LifecycleRoad({stages,vehicle='car',label='Product lifecycle stages in this case study'}:{stages:{id:string,name:string,did:string}[],vehicle?:Traveler,label?:string}){
 const [progress,setProgress]=useState(0);
 const [shown,setShown]=useState(false);
 const [honk,setHonk]=useState(0);
 const [moving,setMoving]=useState(false);
 const navRef=useRef<HTMLElement>(null);
 // Mustang smoke is emitted into the scene: each puff stays where the car released it,
 // then rises and thins toward the top of the bar while the car drives on.
 const [puffs,setPuffs]=useState<{id:number,pos:string,v:number}[]>([]);
 const posRef=useRef('0%');
 // Label each chapter's heading with its stage ("02 · Define") so the page's own headings
 // carry the same map as the sticky road. The attribute is a layout hook in case-system.css; it is not printed.
 useEffect(()=>{
  stages.forEach((st,i)=>{
   const el=document.getElementById(st.id);
   const heading=el?.matches('h2')?el:el?.querySelector('h2,.cdStatement');
   heading?.setAttribute('data-eyebrow',`${String(i+1).padStart(2,'0')} · ${st.name}`);
  });
 },[stages]);
 useEffect(()=>{
  let frame=0,stop=0;
  const update=()=>{
   frame=0;
   const line=window.innerHeight*.34;
   const tops=stages.map(st=>document.getElementById(st.id)?.getBoundingClientRect().top??Infinity);
   let p=0;
   for(let i=0;i<tops.length;i++){
    if(tops[i]<line){const next=tops[i+1]??tops[i]+window.innerHeight;p=i+Math.min(1,(line-tops[i])/Math.max(1,next-tops[i]))*(i<tops.length-1?1:0)}
   }
   const atEnd=window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4;
   setProgress(atEnd?stages.length-1:Math.min(p,stages.length-1));
   // The bar is fixed to the top, so it can only ever appear there: show it once the first stage is well on screen.
   setShown(tops[0]<window.innerHeight*.5);
  };
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);setMoving(true);clearTimeout(stop);stop=window.setTimeout(()=>setMoving(false),180)};
  update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
  return ()=>{cancelAnimationFrame(frame);clearTimeout(stop);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll)};
 },[]);
 useEffect(()=>{
  if(vehicle!=='mustang'||!moving||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let id=Date.now();
  const emit=window.setInterval(()=>{
   const puff={id:id++,pos:posRef.current,v:Math.random()};
   setPuffs(p=>[...p.slice(-40),puff]);
   window.setTimeout(()=>setPuffs(p=>p.filter(x=>x.id!==puff.id)),2600);
  },110);
  return ()=>window.clearInterval(emit);
 },[moving,vehicle]);
 const current=Math.min(stages.length-1,Math.floor(progress+.02));
 const go=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 const pos=`${(progress+.5)/stages.length*100}%`;
 posRef.current=pos;
 return <nav ref={navRef} className={`lcRoad${shown?' isShown':''}${moving?' isMoving':''}`} data-traveler={vehicle} aria-label={label}>
  <div className="lcRoadTrack" style={{'--pos':pos,'--fill':`${progress/(stages.length-1)*100}%`,'--n':stages.length} as React.CSSProperties}>
   <span className="lcAsphalt" aria-hidden="true"><i className="lcFill"/></span>
   <span className="lcWake" aria-hidden="true"><i/><i/><i/>{Array.from({length:7},(_,k)=><em key={k} style={{'--k':k} as React.CSSProperties}/>)}</span>
   {vehicle==='mustang'&&<span className="lcSmoke" aria-hidden="true">{puffs.map(p=><i key={p.id} style={{left:p.pos,'--v':p.v} as React.CSSProperties}/>)}</span>}
   <span className={`lcCar${honk?' isHonking':''}`} aria-hidden="true" onClick={()=>{setHonk(0);requestAnimationFrame(()=>setHonk(Date.now()));window.setTimeout(()=>setHonk(0),900)}}>{honk?<b key={honk} className="lcHonk">{HONKS[vehicle]||'beep beep!'}</b>:null}{vehicle==='book'&&<span className="lcStack">{Array.from({length:current},(_,k)=><i key={k} style={{'--k':k} as React.CSSProperties}/>)}</span>}{vehicle==='train'?<RollingVehicle className="lcBartImg" src={`${import.meta.env.BASE_URL}project-media/bart-train.webp`} w={2172} h={418} moving={moving} wheels={[171,465,1724,2009].map(cx=>({cx,cy:375,r:44}))} alt=""/>:travelers[vehicle]}</span>
   <ol>{stages.map((st,i)=><li key={st.id} className={i<current?'isPast':i===current?'isHere':''}><button type="button" onClick={()=>go(st.id)} aria-current={i===current?'step':undefined}><b>{st.name}</b></button></li>)}</ol>
  </div>
  <p className="lcNow" aria-live="polite"><span>{String(current+1).padStart(2,'0')} / {String(stages.length).padStart(2,'0')}</span><b key={current}>{stages[current].name}</b><small key={`d${current}`}>{stages[current].did}</small></p>
 </nav>;
}

