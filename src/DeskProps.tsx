import React,{useEffect,useRef,useState} from 'react';
import './desk-props.css';

/* Small things on the hero desk that each do one real thing when touched. Drawn in code,
   lit like the rest of the room: light from the front left, soft contact shadows, and
   tops seen from a little above so they read as solid objects. */

/* The Accenture tumbler, measured off a product photo of a 40oz Quencher: a stocky body
   (width 0.44 of its height) that tapers a touch, steps in at 60% to a base 0.62 as wide,
   a lid slightly wider than the body, a thin steel band, a tall straw a little left of
   centre, and a thick squared handle a third as wide as the body. Sized against the mug
   (~8.5cm): the body is ~9.8cm across. Click and the straw bobs, as if someone sipped. */
export function TumblerFlask(){
 const [n,setN]=useState(0);
 const body="M44 50H110L108 120C108 125 101 128 97.5 131.5L96.8 177A19.8 4.6 0 0 1 57.2 177L56.5 131.5C53 128 46 125 46 120Z";
 return <div className={`dhFlask dh3d ${n?'isSip':''}`} key={n} title="Stay hydrated" onClick={()=>setN(v=>v+1)}>
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
   <ellipse cx="77" cy="182" rx="24" ry="3" fill="#2a1a0c" opacity=".35" filter="url(#tuSoft)"/>
   {/* Straw: tall, a little left of centre. */}
   <g className="tuStraw"><rect x="69.6" y="3" width="4.6" height="31" rx="1.6" fill="url(#tuStraw)"/><path d="M71 4V33" stroke="#fff" strokeOpacity=".9" strokeWidth=".8"/></g>
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
    {/* The Accenture mark, engraved in purple. */}
    <path d="M83.6 68.4L89.2 70.8L83.6 73.2" fill="none" stroke="#a100ff" strokeWidth="1.4"/>
    <text x="77" y="81" textAnchor="middle" fontFamily="Helvetica,Arial,sans-serif" fontSize="10.4" fontWeight="600" fill="#a100ff" letterSpacing="-.25">accenture</text>
   </g>
   {/* Brushed steel band. */}
   <rect x="44" y="44" width="66" height="6.4" fill="url(#tuSteel)"/>
   <path d="M44 44.8H110" stroke="#000" strokeOpacity=".22" strokeWidth="1.2"/>
   <path d="M44 49.8H110" stroke="#fff" strokeOpacity=".6" strokeWidth=".5"/>
   {/* Lid: a touch wider than the body, frosted, its top seen from above, the slider. */}
   <path d="M42 35.4Q42 32.4 45 32.4H109Q112 32.4 112 35.4V44.8Q77 46.6 42 44.8Z" fill="url(#tuLid)"/>
   <ellipse cx="77" cy="32.8" rx="35" ry="3.4" fill="#f5f7f9"/>
   <ellipse cx="77" cy="32.8" rx="35" ry="3.4" fill="none" stroke="#a9aeb4" strokeWidth=".5"/>
   <ellipse cx="71.9" cy="33" rx="3.8" ry="1" fill="#c9ced4"/>
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
  <div className={`dhCandle ${lit?'isLit':''}`} onClick={blow} title={lit?'Blow it out':'Strike a match to light it'}>
   <div className="dcGlow"/>
   <svg viewBox="0 0 100 84" aria-hidden="true">
    <defs>
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
    <ellipse cx="50" cy="80" rx="47" ry="6" fill="#1e140a" opacity=".3" filter="url(#dcSoft)"/>
    {/* The mouth: the frosted inside wall at the back, then the flames just below the rim. */}
    <ellipse cx="50" cy="12" rx="46.5" ry="10" fill="url(#dcInside)"/>
    <ellipse className="dcInnerGlow" cx="50" cy="13" rx="44" ry="8.6" fill="#ffcf8a" opacity="0"/>
    {[[28,16],[50,18.6],[72,16]].map(([x,y],i)=><g key={i} className="dcFlame" style={{'--i':i} as React.CSSProperties}><ellipse cx={x} cy={y-5.4} rx="2.6" ry="6.4" fill="url(#dcFlame)"/><ellipse cx={x} cy={y-3} rx="1" ry="2" fill="#fff" opacity=".85"/></g>)}
    {/* Jar body: straight walls, rounded foot. */}
    <path d="M3.5 12V70Q50 92 96.5 70V12Q50 32 3.5 12Z" fill="url(#dcJar)"/>
    <path d="M3.5 12V70Q50 92 96.5 70V12Q50 32 3.5 12Z" fill="url(#dcJarV)"/>
    <path className="dcBodyGlow" d="M3.5 12V70Q50 92 96.5 70V12Q50 32 3.5 12Z" fill="url(#dcInner)" opacity="0"/>
    <path d="M14 20V74" stroke="#fff" strokeOpacity=".35" strokeWidth="5" filter="url(#dcSoft)"/>
    {/* Rolled lip. */}
    <path d="M3.5 12Q50 32 96.5 12" fill="none" stroke="url(#dcRim)" strokeWidth="2.4"/>
    <path d="M4 11.4Q50 -8 96 11.4" fill="none" stroke="#fbf8f1" strokeWidth="1.6"/>
    {/* Label: pinstriped paper, bold serif scent name, a double gold rule, notes. */}
    <path d="M24 31Q50 37 76 31V69Q50 75 24 69Z" fill="url(#dcStripes)"/>
    <path d="M24 31Q50 37 76 31V69Q50 75 24 69Z" fill="url(#dcLabelShade)"/>
    <text x="28.5" y="40" fontFamily="Georgia,'Times New Roman',serif" fontWeight="700" fontSize="6.6" fill="#2e2219">late night</text>
    <text x="28.5" y="47.2" fontFamily="Georgia,'Times New Roman',serif" fontWeight="700" fontSize="6.6" fill="#2e2219">latte</text>
    <path d="M28.5 51.4H70.5M28.5 52.6H70.5" stroke="#d6a45a" strokeWidth=".45"/>
    <text x="28.5" y="57.6" fontFamily="Helvetica,Arial,sans-serif" fontSize="3" letterSpacing=".5" fill="#2e2219">HOME STUDIO</text>
    <text x="28.5" y="61.4" fontFamily="Georgia,serif" fontSize="2.3" fill="#4a3a2e">Espresso, Oat Milk,</text>
    <text x="28.5" y="64.2" fontFamily="Georgia,serif" fontSize="2.3" fill="#4a3a2e">Vanilla Bean</text>
    <text x="28.5" y="68.6" fontFamily="Georgia,serif" fontSize="1.9" fill="#4a3a2e">Hand-poured soy wax blend candle</text>
   </svg>
   {puffs>0&&<svg className="dcSmoke" key={puffs} viewBox="0 0 100 80" aria-hidden="true">{[28,50,72].map((x,i)=><path key={i} d={`M${x} 78c-6-10 7-16 0-27s5-18-1-30`} style={{animationDelay:`${i*.12}s`}}/>)}</svg>}
  </div>
  <div className={`dhMatches ${striking?'isStriking':''}`} onClick={strike} title="Strike a match">
   <svg viewBox="0 0 60 34" aria-hidden="true">
    <defs><linearGradient id="dmSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6b3b2a"/><stop offset="1" stopColor="#3f2016"/></linearGradient></defs>
    <ellipse cx="30" cy="31" rx="27" ry="3" fill="#1e140a" opacity=".3"/>
    <path d="M6 14L44 10L56 17L18 21.5Z" fill="#e8dcc6"/>
    <path d="M9 14.2L43.5 10.6L52 15.6L18.2 19.6Z" fill="#c2413a"/>
    <text x="0" y="0" transform="matrix(.98 -.1 .5 .38 22 17)" fontFamily="Helvetica,Arial,sans-serif" fontWeight="800" fontSize="7" fill="#f6ead6">MATCHES</text>
    <path d="M18 21.5L56 17V24L18 29Z" fill="url(#dmSide)"/>
    <path d="M18 23.5L56 19V21.5L18 26Z" fill="#2b1a12" opacity=".7"/>
    <path d="M6 14L18 21.5V29L6 21Z" fill="#b8ab93"/>
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
 return <div className={`dhGlobe ${n?'isShaken':''}`} key={n} onClick={e=>{e.stopPropagation();setN(v=>v+1)}} title="Shake it">
  <svg viewBox="0 0 100 120" aria-hidden="true">
   <defs>
    <radialGradient id="sgWater" cx=".4" cy=".35" r=".75"><stop offset="0" stopColor="#eef5fb" stopOpacity=".55"/><stop offset=".7" stopColor="#c9dcec" stopOpacity=".35"/><stop offset="1" stopColor="#8fa9c2" stopOpacity=".55"/></radialGradient>
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
   <rect x="38" y="97" width="24" height="7.4" rx="1.4" fill="url(#sgBrass)"/>
   <text x="50" y="102.4" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4.2" letterSpacing=".6" fill="#4a3312">NEW YORK</text>
   <g className="sgBody">
    <circle cx="50" cy="50" r="38" fill="url(#sgSky)"/><ellipse cx="50" cy="85" rx="28" ry="5" fill="#839baf" opacity=".4"/>
    <g clipPath="url(#sgInside)">
     {/* Skyline: back row paler (further away), Chrysler and Empire State in front, lit windows. */}
     <path d="M12 86V70H18V64H24V72H30V60H35V68H40V74H64V62H70V66H76V58H81V70H88V86Z" fill="#a9bacb"/>
     <g fill="url(#sgTower)">
      <path d="M31 86V52H33.5V47H36V43L37.5 40L39 43V47H41.5V52H44V86Z"/>
      <path d="M37.5 40V33" stroke="#6e8398" strokeWidth=".7"/>
      <path d="M52 86V40H54V36H56V31.5H58.4V26H59.4V16.5H60.3V26H61.3V31.5H63.7V36H65.7V40H67.7V86Z"/>
      <path d="M59.85 16.5V9" stroke="#6e8398" strokeWidth=".6"/>
     </g>
     <path d="M34.3 46L37.5 42.2L40.7 46M35.2 49.5L37.5 46.6L39.8 49.5" fill="none" stroke="#e9eef3" strokeWidth=".6"/>
     {Array.from({length:18},(_,i)=><rect key={i} x={(i%2?55:33)+(i%3)*2.6+(i%2?(i%4):0)} y={56+Math.floor(i/3)*4.4} width=".9" height="1.3" fill="#ffe4a1" opacity={.55+(i%3)*.15}/>)}
     <path d="M12 88Q30 78 50 81T88 80V92H12Z" fill="#fbfdff"/>
     <path d="M14 84Q32 77 50 80" fill="none" stroke="#d6e2ee" strokeWidth="1.2"/>
     {/* Snow, resting until the globe is shaken. */}
     <g className="sgFlakes">{FLAKES.map((f,i)=><circle key={i} r={f.s} cx="0" cy="0" fill="#fff" style={{'--x0':`${f.x0}px`,'--x1':`${f.x1}px`,'--y1':`${f.y1}px`,'--x2':`${f.x2}px`,'--d':`${f.d}s`,'--dl':`${f.dl}s`} as React.CSSProperties}/>)}</g>
    </g>
    {/* Glass: water tint, a darker refracting edge, a window reflection and a glint. */}
    <circle cx="50" cy="50" r="38" fill="url(#sgWater)"/>
    <circle cx="50" cy="50" r="37.3" fill="none" stroke="#6f8aa3" strokeOpacity=".35" strokeWidth="1.4"/>
    <path d="M24 28A32 32 0 0 1 48 16" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M22 36A30 30 0 0 1 25 30" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.4" strokeLinecap="round"/>
    <ellipse cx="70" cy="30" rx="4" ry="6.5" fill="#fff" opacity=".22" transform="rotate(30 70 30)"/>
    <path d="M25 86Q50 94 75 86" fill="none" stroke="#f6fcff" strokeOpacity=".75" strokeWidth="1.6"/><path d="M80 66A32 32 0 0 1 64 82" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1.2" strokeLinecap="round"/>
   </g>
  </svg>
 </div>
}

/* A doodle pad lying on the desk. Drag across it to draw in ink that feathers a little
   into the paper; the corner tears off a fresh page. The desk is a real perspective
   plane, so the pointer is mapped onto the page through the page's projected corners. */
type Pt=[number,number];
const PAD_W=200,PAD_H=150;
function squareToQuad(q:Pt[]){
 const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=q;
 const sx=x0-x1+x2-x3,sy=y0-y1+y2-y3,dx1=x1-x2,dx2=x3-x2,dy1=y1-y2,dy2=y3-y2,det=dx1*dy2-dx2*dy1;
 const g=(sx*dy2-dx2*sy)/det,h=(dx1*sy-sx*dy1)/det;
 return [x1-x0+g*x1,x3-x0+h*x3,x0,y1-y0+g*y1,y3-y0+h*y3,y0,g,h,1];
}
function invert3(m:number[]){
 const [a,b,c,d,e,f,g,h,i]=m,A=e*i-f*h,B=-(d*i-f*g),C=d*h-e*g,det=a*A+b*B+c*C;
 return [A,-(b*i-c*h),b*f-c*e,B,a*i-c*g,-(a*f-c*d),C,-(a*h-b*g),a*e-b*d].map(v=>v/det);
}
export function DoodlePad(){
 const [strokes,setStrokes]=useState<string[]>([]);
 const [tear,setTear]=useState(0);
 const corners=useRef<(HTMLSpanElement|null)[]>([]);
 const drawing=useRef<{inv:number[];pts:Pt[]}|null>(null);
 const toPad=(inv:number[],x:number,y:number):Pt=>{const u=inv[0]*x+inv[1]*y+inv[2],v=inv[3]*x+inv[4]*y+inv[5],w=inv[6]*x+inv[7]*y+inv[8];return [u/w*PAD_W,v/w*PAD_H]};
 const path=(p:Pt[])=>p.length<2?`M${p[0][0]} ${p[0][1]}l.1 .1`:p.reduce((s,q,i)=>{if(!i)return `M${q[0].toFixed(1)} ${q[1].toFixed(1)}`;const m=p[i-1];return s+`Q${m[0].toFixed(1)} ${m[1].toFixed(1)} ${((m[0]+q[0])/2).toFixed(1)} ${((m[1]+q[1])/2).toFixed(1)}`},'');
 const down=(e:React.PointerEvent)=>{
  if(e.button!==0)return;e.preventDefault();e.stopPropagation();
  const q=corners.current.map(c=>{const r=c!.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2] as Pt});
  const inv=invert3(squareToQuad(q));
  drawing.current={inv,pts:[toPad(inv,e.clientX,e.clientY)]};
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  setStrokes(s=>[...s.slice(-40),path(drawing.current!.pts)]);
 };
 const move=(e:React.PointerEvent)=>{const d=drawing.current;if(!d)return;const p=toPad(d.inv,e.clientX,e.clientY),l=d.pts[d.pts.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])<1.2)return;d.pts.push(p);setStrokes(s=>[...s.slice(0,-1),path(d.pts)])};
 const up=()=>{drawing.current=null};
 return <div className="dhDoodle">
  <div className="ddPage" key={tear} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} title="Doodle: drag to draw">
   <svg viewBox={`0 0 ${PAD_W} ${PAD_H}`} aria-hidden="true">
    <defs>
     {/* Ink in paper: the line wanders a hair and a faint halo bleeds into the fibres. */}
     <filter id="ddInk" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".35"/></filter>
     <filter id="ddBleed" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="1.1"/></filter>
    </defs>
    <g filter="url(#ddBleed)" opacity=".22">{strokes.map((d,i)=><path key={i} d={d} fill="none" stroke="#243764" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>)}</g>
    <g filter="url(#ddInk)">{strokes.map((d,i)=><path key={i} d={d} fill="none" stroke="#18223f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>)}</g>
   </svg>
   {[0,1,2,3].map(i=><span key={i} className="ddCorner" data-c={i} ref={el=>{corners.current[i]=el}}/>)}
  </div>
  <button type="button" className="ddTear" onClick={()=>{setStrokes([]);setTear(t=>t+1)}} title="Tear off a fresh page" aria-label="Tear off a fresh page"/>
 </div>
}
