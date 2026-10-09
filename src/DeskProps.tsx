import React,{useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import './desk-props.css';
import FlatText from './FlatText';

/* Small things on the hero desk that each do one real thing when touched. Drawn in code,
   lit like the rest of the room: light from the front left, soft contact shadows, and
   tops seen from a little above so they read as solid objects. */

/* Cream handled tumbler: an elliptical lid, curved steel band, tapered shoulder,
   narrower foot and matte powder coat. Its scale is set against the nearby mug. */
export function TumblerFlask(){
 const body="M44 50Q77 58 110 50L106 116C105.5 124 101 128 97.5 132L96.8 177A19.8 5.5 0 0 1 57.2 177L56.5 132C53 128 48.5 124 48 116Z";
 return <div className="dhFlask">
  <svg viewBox="0 0 120 200" aria-hidden="true">
   <defs>
    <linearGradient id="tuBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c8bca7"/><stop offset=".1" stopColor="#ddd3c2"/><stop offset=".32" stopColor="#f1ebdf"/><stop offset=".46" stopColor="#f8f3ea"/><stop offset=".62" stopColor="#efe8db"/><stop offset=".84" stopColor="#d9cfbd"/><stop offset="1" stopColor="#bfb39e"/></linearGradient>
    <linearGradient id="tuShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5b4a33" stopOpacity=".22"/><stop offset=".04" stopColor="#5b4a33" stopOpacity="0"/><stop offset=".88" stopColor="#5b4a33" stopOpacity="0"/><stop offset="1" stopColor="#5b4a33" stopOpacity=".26"/></linearGradient>
    <linearGradient id="tuHandleG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c7bba6"/><stop offset=".35" stopColor="#f3ede2"/><stop offset=".7" stopColor="#e3dacb"/><stop offset="1" stopColor="#c2b6a1"/></linearGradient>
    <linearGradient id="tuSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6c6e72"/><stop offset=".18" stopColor="#b7b9bc"/><stop offset=".4" stopColor="#eeeff0"/><stop offset=".52" stopColor="#fbfbfb"/><stop offset=".66" stopColor="#b4b6b9"/><stop offset=".86" stopColor="#838589"/><stop offset="1" stopColor="#5a5c60"/></linearGradient>
    <linearGradient id="tuLid" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9ccd0"/><stop offset=".3" stopColor="#eef0f2"/><stop offset=".5" stopColor="#fafbfc"/><stop offset=".75" stopColor="#e2e5e8"/><stop offset="1" stopColor="#bcc0c5"/></linearGradient>
    <linearGradient id="tuStraw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9d3dc" stopOpacity=".9"/><stop offset=".4" stopColor="#f5f9fc" stopOpacity=".95"/><stop offset="1" stopColor="#b3bec9" stopOpacity=".9"/></linearGradient>
    <filter id="tuGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="8"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .28  0 0 0 .35 -.12"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="tuSoft" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="1.6"/></filter>
    <clipPath id="tuBodyClip"><path d={body}/></clipPath>
   </defs>
   <ellipse cx="77" cy="182" rx="22" ry="3.5" fill="#2a1a0c" opacity=".35" filter="url(#tuSoft)"/>
   {/* Straw: tall, a little left of centre. */}
   <g className="tuStraw"><ellipse cx="71.9" cy="3" rx="2.3" ry=".9" fill="#8c9aa5"/><rect x="69.6" y="3" width="4.6" height="31" rx="1.6" fill="url(#tuStraw)"/><path d="M71 4V33" stroke="#fff" strokeOpacity=".9" strokeWidth=".8"/></g>
   {/* Handle: a thick squared loop from under the band to just past halfway, with its shadow on the cup. */}
   <path d="M45 57H33Q27 57 27 63V105Q27 111 33 111H46" fill="none" stroke="#6b5a40" strokeOpacity=".25" strokeWidth="11" strokeLinejoin="round" filter="url(#tuSoft)" transform="translate(2 3)"/>
   <path d="M45 57H33Q27 57 27 63V105Q27 111 33 111H46" fill="none" stroke="url(#tuHandleG)" strokeWidth="10" strokeLinejoin="round"/>
   <path d="M44 52.6H32Q22.4 52.6 22.4 62V104" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.3" strokeLinejoin="round"/>
   <path d="M44 61.6H34Q31.6 61.6 31.6 64V104Q31.6 106.4 34 106.4H45" fill="none" stroke="#7d6a4c" strokeOpacity=".35" strokeWidth="1"/>
   {/* Body. */}
   <path d={body} fill="url(#tuBody)"/>
   <g clipPath="url(#tuBodyClip)">
    <rect x="40" y="46" width="74" height="140" fill="url(#tuShade)"/>
    <rect x="40" y="46" width="74" height="140" fill="#fff" filter="url(#tuGrain)"/>
    <path d="M46 120C52 128 102 128 108 120" fill="none" stroke="#8f7f65" strokeOpacity=".4" strokeWidth=".9"/>
    <path d="M48 122.5C55 130.5 100 130.5 106 122.5" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth=".8"/>
    <path d="M62 54V116" stroke="#fff" strokeOpacity=".42" strokeWidth="10" filter="url(#tuSoft)"/>
    <path d="M67 136V178" stroke="#fff" strokeOpacity=".3" strokeWidth="6" filter="url(#tuSoft)"/>
    <ellipse cx="45.5" cy="57" rx="2.4" ry="5.4" fill="#6b5a40" opacity=".2"/><ellipse cx="46.5" cy="111" rx="2.4" ry="5.4" fill="#6b5a40" opacity=".2"/>
    {/* Printed wordmark follows the round front face. */}
    <path d="M83.6 68.4L89.2 70.8L83.6 73.2" fill="none" stroke="#7b24b4" strokeWidth="1.25"/>
    <FlatText viewBox="0 0 120 200" markup={`<defs><path id="w" d="M49 80Q77 84 105 80"/></defs><text font-family="Helvetica,Arial,sans-serif" font-size="9" font-weight="600" fill="#7b24b4" letter-spacing="-.2"><textPath href="#w" startOffset="50%" text-anchor="middle">accenture</textPath></text>`}/>
   </g>
   <path d="M58 175.5Q77 181.5 96 175.5" stroke="#a99980" strokeWidth="1.3" fill="none"/>
   <path d="M60 177Q77 181 94 177" stroke="#f4edde" strokeWidth=".8" fill="none"/>
   {/* Brushed steel band. */}
   <path d="M43 43Q77 51 111 43V50Q77 58 44 50Z" fill="url(#tuSteel)"/>
   <path d="M44 44Q77 52 110 44" stroke="#494d4d" strokeOpacity=".35" strokeWidth=".8" fill="none"/>
   <path d="M44 50Q77 58 110 50" stroke="#fff" strokeOpacity=".65" strokeWidth=".65" fill="none"/>
   {/* Lid: a touch wider than the body, frosted, its top seen from above, the slider. */}
   <path d="M42 33Q77 43 112 33V43Q77 53 42 43Z" fill="url(#tuLid)"/>
   <ellipse cx="77" cy="32.8" rx="35" ry="7.8" fill="#f5f7f9"/>
   <ellipse cx="77" cy="32.8" rx="35" ry="7.8" fill="none" stroke="#a9aeb4" strokeWidth=".5"/>
   <ellipse cx="77" cy="32.8" rx="31" ry="5.7" fill="#b6c1bd" opacity=".26"/><path d="M46 36Q77 43 108 36" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth=".8"/><ellipse cx="71.9" cy="33" rx="3.8" ry="1" fill="#88959d"/><path d="M69.6 30.8V33Q71.9 34 74.2 33V30.8" fill="url(#tuStraw)"/>
   <rect x="88" y="28.8" width="11" height="4.6" rx="2.3" fill="#ece3d1" stroke="#bfb29a" strokeWidth=".5"/>
  </svg>
 </div>
}

/* A three-wick candle, drawn from a product photo: a wide, frosted cream jar with a
   rolled lip, a pinstriped paper label (bold lowercase scent name, a double gold rule,
   notes in small type), and the three flames sitting just below the rim, lighting the
   glass from inside. About 10cm across at the room's scale. Strike the match on the box
   beside it to light it; click it to blow it out, and smoke rises from the wicks. */
export function Candle(){
 const [lit,setLit]=useState(false);
 const [striking,setStriking]=useState(0);
 const [puffs,setPuffs]=useState(0);
 const timers=useRef<number[]>([]);
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 const strike=()=>{if(lit||striking)return;setStriking(Date.now());timers.current.push(window.setTimeout(()=>{setLit(true);setPuffs(0)},900),window.setTimeout(()=>setStriking(0),1500))};
 const blow=()=>{if(!lit)return;setLit(false);setPuffs(p=>p+1)};
 return <>
  <div className={`dhCandle ${lit?'isLit':''}`} onClick={blow} data-tip={lit?'Blow it out':'Strike a match to light it'}>
   <div className="dcGlow"/>
   <svg viewBox="0 0 100 84" aria-hidden="true">
    <defs>
     <clipPath id="dcLabelClip"><path d="M24 29.3A46.5 10 0 0 0 76 29.3V67.3A46.5 10 0 0 1 24 67.3Z"/></clipPath>
     <linearGradient id="dcJar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d6cbb8"/><stop offset=".1" stopColor="#e6dccb"/><stop offset=".35" stopColor="#f3ece0"/><stop offset=".55" stopColor="#f6f0e5"/><stop offset=".8" stopColor="#e7ddcc"/><stop offset="1" stopColor="#d1c5b1"/></linearGradient>
     <linearGradient id="dcJarV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6d5a3e" stopOpacity=".12"/><stop offset=".12" stopColor="#6d5a3e" stopOpacity="0"/><stop offset=".85" stopColor="#6d5a3e" stopOpacity="0"/><stop offset="1" stopColor="#6d5a3e" stopOpacity=".2"/></linearGradient>
     {/* Lit from within: warm light through the frosted glass, strongest just under the rim. */}
     <radialGradient id="dcInner" cx=".5" cy=".05" r=".75"><stop offset="0" stopColor="#ffd9a0" stopOpacity=".75"/><stop offset=".45" stopColor="#ffe6c2" stopOpacity=".3"/><stop offset="1" stopColor="#ffe6c2" stopOpacity="0"/></radialGradient>
     <linearGradient id="dcRim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ddd2bf"/><stop offset=".4" stopColor="#fbf7ef"/><stop offset="1" stopColor="#d8ccb8"/></linearGradient>
     <linearGradient id="dcInside" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe4d1"/><stop offset="1" stopColor="#d9c9ae"/></linearGradient>
     <pattern id="dcStripes" width="1.6" height="4" patternUnits="userSpaceOnUse"><rect width="1.6" height="4" fill="#f6ead7"/><rect width=".45" height="4" fill="#e9d5b6"/></pattern>
     <linearGradient id="dcLabelShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7a6040" stopOpacity=".16"/><stop offset=".2" stopColor="#7a6040" stopOpacity="0"/><stop offset=".8" stopColor="#7a6040" stopOpacity="0"/><stop offset="1" stopColor="#7a6040" stopOpacity=".16"/></linearGradient>
     <radialGradient id="dcFlame" cx=".5" cy=".72" r=".62"><stop offset="0" stopColor="#fffbe8"/><stop offset=".35" stopColor="#ffe9a6"/><stop offset=".7" stopColor="#ffb44a"/><stop offset="1" stopColor="#ff8a1e" stopOpacity="0"/></radialGradient>
     <filter id="dcSoft"><feGaussianBlur stdDeviation="1.2"/></filter>
    </defs>
    <ellipse cx="51" cy="81" rx="46" ry="5.5" fill="#1e140a" opacity=".32" filter="url(#dcSoft)"/>
    {/* The mouth: the frosted inside wall at the back, then the flames just below the rim. */}
    <ellipse cx="50" cy="12" rx="46.5" ry="10" fill="url(#dcInside)"/>
    <ellipse cx="50" cy="12.4" rx="44.2" ry="9.1" fill="none" stroke="#e6dac6" strokeWidth="1.2"/>
    <ellipse cx="50" cy="13.2" rx="42" ry="7.8" fill="#f4e9d5"/>
    <path d="M13 14Q50 23 87 14" fill="none" stroke="#baa98c" strokeOpacity=".35" strokeWidth=".8"/>
    {[[29,13.5],[50,11.5],[71,13.5]].map(([x,y])=><g key={x}><ellipse cx={x} cy={y+1} rx="3" ry="1" fill="#aa9575" opacity=".22"/><path d={`M${x} ${y+1}l.3 -2.7`} stroke="#3a2b22" strokeWidth=".8" strokeLinecap="round"/></g>)}
    <ellipse className="dcInnerGlow" cx="50" cy="13" rx="44" ry="8.6" fill="#ffcf8a" opacity="0"/>
    {[[29,13.5],[50,11.5],[71,13.5]].map(([x,y],i)=><g key={i} className="dcFlame" style={{'--i':i} as React.CSSProperties}><ellipse cx={x} cy={y-5.4} rx="2.6" ry="6.4" fill="url(#dcFlame)"/><ellipse cx={x} cy={y-3} rx="1" ry="2" fill="#fff" opacity=".85"/></g>)}
    {/* Jar body: straight walls, rounded foot. */}
    <path d="M3.5 12V72A46.5 10 0 0 0 96.5 72V12A46.5 10 0 0 1 3.5 12Z" fill="url(#dcJar)"/>
    <path d="M3.5 12V72A46.5 10 0 0 0 96.5 72V12A46.5 10 0 0 1 3.5 12Z" fill="url(#dcJarV)"/>
    <path className="dcBodyGlow" d="M3.5 12V72A46.5 10 0 0 0 96.5 72V12A46.5 10 0 0 1 3.5 12Z" fill="url(#dcInner)" opacity="0"/>
    <path d="M91 24V69" fill="none" stroke="#ad9d83" strokeOpacity=".25" strokeWidth="1"/>
    <path d="M14 20V74" stroke="#fff" strokeOpacity=".35" strokeWidth="5" filter="url(#dcSoft)"/>
    <path d="M7 72Q50 90 93 72" fill="none" stroke="#baac94" strokeWidth="1.4"/><path d="M9 73Q50 87 91 73" fill="none" stroke="#fffaf0" strokeOpacity=".6" strokeWidth=".8"/>
    {/* Rolled lip. */}
    <path d="M3.5 12A46.5 10 0 0 0 96.5 12" fill="none" stroke="url(#dcRim)" strokeWidth="2.4"/>
    <path d="M3.5 12A46.5 10 0 0 1 96.5 12" fill="none" stroke="#fbf8f1" strokeWidth="1.6"/>
    {/* Label: pinstriped paper, bold serif scent name, a double gold rule, notes. */}
    <path d="M24 29.3A46.5 10 0 0 0 76 29.3V67.3A46.5 10 0 0 1 24 67.3Z" fill="url(#dcStripes)"/>
    <path d="M24 29.3A46.5 10 0 0 0 76 29.3V67.3A46.5 10 0 0 1 24 67.3Z" fill="url(#dcLabelShade)"/>
    <g clipPath="url(#dcLabelClip)"><FlatText viewBox="0 0 100 84" markup={`<g font-family="Georgia,'Times New Roman',serif"><text x="28.5" y="40" font-weight="700" font-size="6.6" fill="#2e2219">late night</text><text x="28.5" y="47.2" font-weight="700" font-size="6.6" fill="#2e2219">latte</text><path d="M28.5 51.4H70.5M28.5 52.6H70.5" stroke="#d6a45a" stroke-width=".45"/><text x="28.5" y="57.6" font-family="Helvetica,Arial,sans-serif" font-size="3" letter-spacing=".5" fill="#2e2219">HOME STUDIO</text><text x="28.5" y="61.4" font-size="2.3" fill="#4a3a2e">Espresso, Oat Milk,</text><text x="28.5" y="64.2" font-size="2.3" fill="#4a3a2e">Vanilla Bean</text><text x="28.5" y="68" font-size="1.8" textLength="39" lengthAdjust="spacingAndGlyphs" fill="#4a3a2e">Hand-poured soy wax blend</text></g>`}/></g>
   </svg>
   {puffs>0&&<svg className="dcSmoke" key={puffs} viewBox="0 0 100 80" aria-hidden="true">{[28,50,72].map((x,i)=><path key={i} d={`M${x} 78c-6-10 7-16 0-27s5-18-1-30`} style={{animationDelay:`${i*.12}s`}}/>)}</svg>}
  </div>
  <div className={`dhMatches ${striking?'isStriking':''}`} onClick={strike} data-tip="Strike a match">
   <svg viewBox="0 0 60 34" aria-hidden="true">
    <defs>
     <linearGradient id="dmSide" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#8d614c"/><stop offset="1" stopColor="#472a20"/></linearGradient>
     <pattern id="dmGrit" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#51362d"/><circle cx=".5" cy=".5" r=".35" fill="#b79980"/><circle cx="1.5" cy="1.5" r=".3" fill="#211713"/></pattern>
     <clipPath id="dmPrintClip"><path d="M10 14.1L43.5 10.6L52 15.6L18.2 19.6Z"/></clipPath>
    </defs>
    <ellipse cx="31" cy="30" rx="26" ry="3" fill="#1e140a" opacity=".25"/>
    {/* Cardboard sleeve around a slightly exposed wooden drawer. */}
    <path d="M5 14.5L16.5 22V28L5 20.5Z" fill="#c7b796"/>
    <path d="M7 16L14 20.5V25.6L7 21Z" fill="#9a8766"/>
    <path d="M8 18L13.5 21M8 20L13.5 23" stroke="#ebdab2" strokeWidth="1"/>
    <path d="M6 14L44 10L56 17L18 21.5Z" fill="#f3e9d5"/>
    <path d="M9 14.2L43.5 10.6L52 15.6L18.2 19.6Z" fill="#ae3830"/>
    <g clipPath="url(#dmPrintClip)"><FlatText viewBox="0 0 60 34" markup={`<text transform="matrix(.96 -.103 .6 .46 16 17)" font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="4.8" textLength="26" lengthAdjust="spacingAndGlyphs" fill="#f6ead6">MATCHES</text>`}/></g>
    <path d="M18 21.5L56 17V24L18 29Z" fill="url(#dmSide)"/>
    <path d="M20 23L54 19.2V22.4L20 26.5Z" fill="url(#dmGrit)"/>
    <path d="M6 14L18 21.5V29L6 21Z" fill="#e0d2b8"/>
    <path d="M7 16.5L16.4 22.4V26.8L7 21.4Z" fill="#b9a78a"/>
    <path d="M6 14L18 21.5L56 17M18 21.5V29" fill="none" stroke="#fff2d9" strokeOpacity=".5" strokeWidth=".5"/>
    <g className="dmMatch"><path d="M30 20L50 4" stroke="#e6cfa0" strokeWidth="1.8" strokeLinecap="round"/><circle cx="50.5" cy="3.6" r="1.8" fill="#9b2c22"/>
     <g className="dmFlame"><ellipse cx="51.5" cy="-1" rx="2.6" ry="5.4" fill="url(#dcFlame)"/><ellipse cx="51" cy="1.6" rx="1" ry="1.8" fill="#fff" opacity=".8"/></g></g>
   </svg>
  </div>
 </>;
}

/* A Manhattan snow globe on the window sill: the Empire State and the Chrysler in a
   glass dome on a walnut base. Click and it shakes, the snow swirls up, drifts down
   and settles back on the ground. */
const FLAKES=Array.from({length:34},(_,i)=>{const r=(n:number)=>((Math.sin(i*12.9898+n*78.233)*43758.5453)%1+1)%1;
 return {x0:20+r(1)*60,x1:14+r(2)*72,y1:14+r(3)*34,x2:18+r(4)*64,d:4.2+r(5)*3.4,dl:r(6)*.35,s:.7+r(7)*1.1}});
export function SnowGlobe(){
 const [n,setN]=useState(0);
 return <div className={`dhGlobe ${n?'isShaken':''}`} key={n} onClick={e=>{e.stopPropagation();setN(v=>v+1)}} data-tip="Shake it">
  <svg viewBox="0 0 100 120" aria-hidden="true">
   <defs>
    <radialGradient id="sgWater" cx=".4" cy=".35" r=".75"><stop offset="0" stopColor="#eef5fb" stopOpacity=".06"/><stop offset=".7" stopColor="#c9dcec" stopOpacity=".08"/><stop offset="1" stopColor="#7795aa" stopOpacity=".36"/></radialGradient>
    <linearGradient id="sgSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bcd3e8"/><stop offset="1" stopColor="#e9f0f6"/></linearGradient>
    <linearGradient id="sgBase" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3b2416"/><stop offset=".35" stopColor="#7a4c30"/><stop offset=".6" stopColor="#8e5a3a"/><stop offset="1" stopColor="#3a2215"/></linearGradient>
    <linearGradient id="sgBaseTop" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a3521"/><stop offset=".5" stopColor="#a06a45"/><stop offset="1" stopColor="#4d2d1b"/></linearGradient>
    <linearGradient id="sgBrass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f1d68f"/><stop offset=".5" stopColor="#b88b3a"/><stop offset="1" stopColor="#e3c275"/></linearGradient>
    <linearGradient id="sgTower" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5d7188"/><stop offset=".6" stopColor="#8196ad"/><stop offset="1" stopColor="#4d5f74"/></linearGradient>
    <clipPath id="sgInside"><circle cx="50" cy="50" r="37"/></clipPath>
    <filter id="sgSoft"><feGaussianBlur stdDeviation="1.6"/></filter>
   </defs>
   <ellipse cx="50" cy="114" rx="36" ry="4.6" fill="#1e140a" opacity=".35" filter="url(#sgSoft)"/>
   {/* Walnut base: a tapered drum, its top seen from above, a brass plaque. */}
   <path d="M20 90L24 110Q50 116 76 110L80 90Z" fill="url(#sgBase)"/>
   <ellipse cx="50" cy="90" rx="30" ry="5.4" fill="url(#sgBaseTop)"/>
   <path d="M24 107Q50 114 76 107" stroke="#b58254" strokeWidth=".8" fill="none"/><path d="M24 110Q50 116 76 110" stroke="#24180f" strokeWidth="1.4" fill="none"/>
   <rect x="33" y="97" width="34" height="7.4" rx="1.4" fill="url(#sgBrass)"/>
   <FlatText viewBox="0 0 100 120" markup={`<text x="50" y="102.4" text-anchor="middle" font-family="Georgia,serif" font-size="3.8" letter-spacing=".35" textLength="27" lengthAdjust="spacingAndGlyphs" fill="#4a3312">MANHATTAN</text>`}/>
   <g className="sgBody">
    <circle cx="50" cy="50" r="38" fill="url(#sgSky)" fillOpacity=".2"/><ellipse cx="50" cy="85" rx="28" ry="5" fill="#839baf" opacity=".4"/>
    <g clipPath="url(#sgInside)">
     {/* A miniature Manhattan: dense blocks, limestone setbacks, steel crowns and spires. */}
     <path d="M12 83V62H18V53H23V64H28V48H33V56H38V61H43V52H48V60H54V51H59V58H66V47H71V55H77V61H84V69H89V86Z" fill="#a2acb1"/>
     <path d="M13 83V69H21V61H27V73H35V58H43V68H50V62H57V74H66V57H74V66H82V74H89V86Z" fill="#73878b"/>
     {/* One World Trade Center: tapered facets and a long needle. */}
     <path d="M19 82L22 43L25 35L29 44L32 82Z" fill="#91bacb" stroke="#4e778e" strokeWidth=".5"/>
     <path d="M25 35L25.5 82H32L29 44Z" fill="#507b95"/>
     <path d="M25 35V24" stroke="#657d86" strokeWidth=".7"/>
     <path d="M22 49H29M22 55H30M21 62H30M21 69H31M20 76H31" stroke="#d9e9ed" strokeOpacity=".55" strokeWidth=".55"/>
     {/* Empire State: broad limestone shaft, successive shoulders and antenna. */}
     <path d="M38 83V45H41V37H44V31H47V25H49V20H51V25H53V31H56V37H59V45H62V83Z" fill="#c4bca6" stroke="#8f8977" strokeWidth=".5"/>
     <path d="M51 25H53V31H56V37H59V45H62V83H53V45H51Z" fill="#8d9288"/>
     <path d="M50 20V12" stroke="#687a7a" strokeWidth=".7"/>
     <path d="M45 34H55M42 40H58M39 47H61" stroke="#eee3c9" strokeWidth=".8"/>
     {[42,46,50,54,58].map(x=><path key={x} d={`M${x} 49V81`} stroke="#5f716f" strokeWidth=".65"/>)}
     {Array.from({length:8},(_,i)=><path key={i} d={`M40 ${51+i*3.6}H60`} stroke="#e7dcc2" strokeWidth=".55"/>)}
     {/* Chrysler: stacked scalloped steel arches, triangular windows and a needle. */}
     <path d="M67 83V49H69V42L71 38V34L74 30L77 34V38L79 42V49H82V83Z" fill="#bac7c6" stroke="#768c91" strokeWidth=".5"/>
     <path d="M74 30V21M69 42Q74 35 79 42M68 47Q74 39 80 47M70 37Q74 31 78 37" fill="none" stroke="#f0efe0" strokeWidth=".9"/>
     <path d="M74 30L77 34V38L79 42V49H82V83H77V49L75 42Z" fill="#748e98" opacity=".7"/>
     <path d="M72 40l1-2 1 2M75 40l1-2 1 2M71 45l1-2 1 2M75 45l1-2 1 2" stroke="#486a7b" strokeWidth=".65" fill="none"/>
     {[70,74,78].map(x=><path key={x} d={`M${x} 52V81`} stroke="#547886" strokeWidth=".6"/>)}
     {/* Lower blocks make the towers part of a city, rather than two isolated silhouettes. */}
     <path d="M13 86V77H19V72H28V79H35V73H43V79H53V74H61V80H70V74H79V78H88V88Z" fill="#a68e73" stroke="#6e756c" strokeWidth=".5"/>
     {Array.from({length:22},(_,i)=><rect key={i} x={15+(i%11)*6.6} y={78+Math.floor(i/11)*4} width="1.2" height="1.8" fill={i%4?'#e4d8b0':'#405b68'}/>)}
     <ellipse cx="50" cy="86" rx="33" ry="4" fill="#e8e4d6"/>
     <path d="M19 86Q50 80 81 86" fill="none" stroke="#faf9f0" strokeWidth="1"/>
     {/* A quiet, continuous snowfall for the phone's ambient desk frame. */}
     <g className="sgAmbientSnow">{FLAKES.slice(0,18).map((f,i)=><circle key={i} cx={f.x1} cy="0" r={1.25+f.s*.45} fill="#fffdf5" style={{'--snow-d':`${4.2+f.d*.45}s`,'--snow-delay':`${-i*.53}s`,'--snow-drift':`${(i%2?1:-1)*(2+i%4)}px`,'--snow-rest':`${16+i*3.6}px`} as React.CSSProperties}/>)}</g>
     {/* Snow, resting until the globe is shaken. */}
     <g className="sgFlakes">{FLAKES.map((f,i)=><circle key={i} r={f.s} cx="0" cy="0" fill="#fff" style={{'--x0':`${f.x0}px`,'--x1':`${f.x1}px`,'--y1':`${f.y1}px`,'--x2':`${f.x2}px`,'--d':`${f.d}s`,'--dl':`${f.dl}s`} as React.CSSProperties}/>)}</g>
    </g>
    {/* Glass: water tint, a darker refracting edge, a window reflection and a glint. */}
    <circle cx="50" cy="50" r="38" fill="url(#sgWater)"/>
    <circle cx="50" cy="50" r="37.3" fill="none" stroke="#6f8aa3" strokeOpacity=".35" strokeWidth="1.4"/>
    <path d="M24 28A32 32 0 0 1 48 16" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M22 36A30 30 0 0 1 25 30" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M21 34Q26 24 36 23L35 42Q26 45 21 48Z" fill="#fff" opacity=".19"/>
    <path d="M27 28L26 45M22 37L35 33" fill="none" stroke="#d4e3ee" strokeWidth=".7" strokeOpacity=".5"/>
    <ellipse cx="70" cy="30" rx="4" ry="6.5" fill="#fff" opacity=".16" transform="rotate(30 70 30)"/>
    <path d="M25 86Q50 94 75 86" fill="none" stroke="#f6fcff" strokeOpacity=".75" strokeWidth="1.6"/><path d="M80 66A32 32 0 0 1 64 82" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1.2" strokeLinecap="round"/>
   </g>
  </svg>
 </div>
}

/* The desk's hover labels, in place of the browser's tooltip: a small cream tag with a
   pointer, just above whatever the mouse rests on (anything in the hero with data-tip).
   It waits a beat before appearing, follows state changes (lamp on/off), and gets out
   of the way when the page scrolls. Mouse only; touch devices don't hover. */
export function DeskTips(){
 const [tip,setTip]=useState<{text:string;x:number;y:number;on:boolean}|null>(null);
 useEffect(()=>{
  let anchor:HTMLElement|null=null,timer=0;
  const place=(el:HTMLElement,on:boolean)=>{const r=el.getBoundingClientRect(),text=el.dataset.tip||'';if(!text){setTip(null);return}
   setTip({text,x:Math.min(window.innerWidth-12,Math.max(12,r.left+r.width/2)),y:Math.max(28,r.top-6),on})};
  // Already hidden: keep the same state, so scrolling doesn't re-render the tip every event.
  const hide=()=>{window.clearTimeout(timer);anchor=null;setTip(t=>t?.on?{...t,on:false}:t)};
  const over=(e:PointerEvent)=>{
   if(e.pointerType!=='mouse')return;
   const el=(e.target as HTMLElement).closest<HTMLElement>('.dhTrack [data-tip]');
   if(el===anchor)return;
   window.clearTimeout(timer);anchor=el;
   if(!el){setTip(t=>t&&{...t,on:false});return}
   timer=window.setTimeout(()=>{if(anchor===el)place(el,true)},260);
  };
  const click=()=>{const el=anchor;if(el)window.setTimeout(()=>{if(anchor===el)place(el,true)},0)};
  document.addEventListener('pointerover',over);document.addEventListener('click',click,true);
  window.addEventListener('scroll',hide,{passive:true});window.addEventListener('blur',hide);
  return()=>{window.clearTimeout(timer);document.removeEventListener('pointerover',over);document.removeEventListener('click',click,true);window.removeEventListener('scroll',hide);window.removeEventListener('blur',hide)};
 },[]);
 if(!tip)return null;
 return createPortal(<div className={`deskTip ${tip.on?'isOn':''}`} style={{left:tip.x,top:tip.y}} aria-hidden="true">{tip.text}</div>,document.body);
}
