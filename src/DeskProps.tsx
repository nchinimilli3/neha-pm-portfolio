import React,{useEffect,useRef,useState} from 'react';
import './desk-props.css';

/* Small things on the hero desk that each do one real thing when touched. Drawn in code,
   lit like the rest of the room: light from the front left, soft contact shadows, and
   tops seen from a little above so they read as solid objects. */

/* The Accenture tumbler: a cream 40oz travel tumbler with a handle, a translucent lid
   and straw, a polished steel band, a stepped-in base that fits a cup holder, and the
   Accenture mark printed in purple. Click and the straw bobs as if someone took a sip. */
export function TumblerFlask(){
 const [n,setN]=useState(0);
 return <div className={`dhFlask dh3d ${n?'isSip':''}`} key={n} title="Stay hydrated" onClick={()=>setN(v=>v+1)}>
  <svg viewBox="0 0 100 150" aria-hidden="true">
   <defs>
    <linearGradient id="tuBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9bfac"/><stop offset=".14" stopColor="#e2d9c8"/><stop offset=".42" stopColor="#f4eee2"/><stop offset=".6" stopColor="#f1eadc"/><stop offset=".86" stopColor="#d8cebb"/><stop offset="1" stopColor="#bdb29e"/></linearGradient>
    <linearGradient id="tuFoot" x1="0" y1="0" x2="0" y2="1"><stop offset=".8" stopColor="#6b5a40" stopOpacity="0"/><stop offset="1" stopColor="#6b5a40" stopOpacity=".3"/></linearGradient>
    <linearGradient id="tuHandle" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#cfc5b2"/><stop offset=".5" stopColor="#efe8da"/><stop offset="1" stopColor="#d6ccb9"/></linearGradient>
    <linearGradient id="tuSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6e7074"/><stop offset=".2" stopColor="#c3c5c8"/><stop offset=".45" stopColor="#f6f7f7"/><stop offset=".62" stopColor="#b9bbbe"/><stop offset=".85" stopColor="#8a8c90"/><stop offset="1" stopColor="#5c5e62"/></linearGradient>
    <linearGradient id="tuLid" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d5d8dc"/><stop offset=".35" stopColor="#f3f5f7"/><stop offset=".7" stopColor="#e6e9ec"/><stop offset="1" stopColor="#c4c8cd"/></linearGradient>
    <filter id="tuSoft" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="1.4"/></filter>
   </defs>
   {/* Straw, rising from the lid. */}
   <g className="tuStraw"><rect x="45" y="0" width="5" height="22" rx="1.6" fill="#e9ecef" opacity=".9"/><rect x="45.8" y="0" width="1.4" height="22" fill="#fff"/></g>
   {/* Handle: a squared loop, lit along its outer face. */}
   <path d="M34 38H20Q12 38 12 46V86Q12 94 20 94H34" fill="none" stroke="url(#tuHandle)" strokeWidth="8" strokeLinejoin="round"/>
   <path d="M34 35H20Q9 35 9 46" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1.2"/>
   {/* Body: the wide upper cup, stepping in to the base. */}
   <path d="M32 32H90L88 100Q87 106 82 110L81 144Q81 148 76 148H46Q41 148 41 144L40 110Q35 106 34 100Z" fill="url(#tuBody)"/>
   <path d="M32 32H90L88 100Q87 106 82 110L81 144Q81 148 76 148H46Q41 148 41 144L40 110Q35 106 34 100Z" fill="url(#tuFoot)"/>
   <path d="M34.5 100Q61 106 87.5 100" fill="none" stroke="#b3a893" strokeOpacity=".55" strokeWidth=".8"/>
   <path d="M47 36V98" stroke="#fff" strokeOpacity=".35" strokeWidth="6" filter="url(#tuSoft)"/>
   <path d="M49 114V144" stroke="#fff" strokeOpacity=".3" strokeWidth="4" filter="url(#tuSoft)"/>
   {/* The Accenture mark, printed in purple. */}
   <path d="M66 55.5L71.5 58L66 60.5" fill="none" stroke="#a100ff" strokeWidth="1.3"/>
   <text x="61" y="67" textAnchor="middle" fontFamily="Helvetica,Arial,sans-serif" fontSize="9.2" fontWeight="600" fill="#a100ff" letterSpacing="-.2">accenture</text>
   {/* Steel band and lid. */}
   <rect x="31" y="25" width="60" height="7.5" fill="url(#tuSteel)"/>
   <path d="M31 26H91" stroke="#fff" strokeOpacity=".7" strokeWidth=".6"/>
   <path d="M30 15Q30 12 33 12H89Q92 12 92 15V25H30Z" fill="url(#tuLid)"/>
   <ellipse cx="61" cy="12.5" rx="31" ry="3.2" fill="#f7f8f9"/>
   <ellipse cx="61" cy="12.5" rx="31" ry="3.2" fill="none" stroke="#b9bdc2" strokeWidth=".5"/>
   <rect x="72" y="8" width="11" height="5" rx="2.4" fill="#efe7d6" stroke="#cbbfa8" strokeWidth=".5"/>
  </svg>
 </div>
}

/* A three-wick jar candle in the style of a bath-and-body shop: squat glass, cream wax,
   a pastel illustrated label. Strike the match on the box beside it to light the wicks;
   click the lit candle to blow it out, and a thread of smoke rises from each wick. */
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
   <svg viewBox="0 0 100 86" aria-hidden="true">
    <defs>
     <linearGradient id="dcGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9c2b4" stopOpacity=".55"/><stop offset=".12" stopColor="#fff" stopOpacity=".12"/><stop offset=".5" stopColor="#fff" stopOpacity=".05"/><stop offset=".86" stopColor="#fff" stopOpacity=".16"/><stop offset="1" stopColor="#b8b0a1" stopOpacity=".6"/></linearGradient>
     <linearGradient id="dcWax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e2d4bd"/><stop offset=".4" stopColor="#f7eedf"/><stop offset="1" stopColor="#dccbb0"/></linearGradient>
     <radialGradient id="dcTop" cx=".45" cy=".4" r=".65"><stop offset="0" stopColor="#fbf4e8"/><stop offset="1" stopColor="#e8dac3"/></radialGradient>
     <radialGradient id="dcPool" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#f0d7a8" stopOpacity=".95"/><stop offset=".7" stopColor="#e7c690" stopOpacity=".7"/><stop offset="1" stopColor="#e7c690" stopOpacity="0"/></radialGradient>
     <linearGradient id="dcLabel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e9d8d0"/><stop offset=".25" stopColor="#fdf2ec"/><stop offset=".75" stopColor="#fbeee6"/><stop offset="1" stopColor="#dfcbc1"/></linearGradient>
     <radialGradient id="dcFlame" cx=".5" cy=".72" r=".62"><stop offset="0" stopColor="#fffbe8"/><stop offset=".35" stopColor="#ffe9a6"/><stop offset=".7" stopColor="#ffb44a"/><stop offset="1" stopColor="#ff8a1e" stopOpacity="0"/></radialGradient>
     <filter id="dcSoft"><feGaussianBlur stdDeviation="1.2"/></filter>
    </defs>
    {/* Contact shadow, then the wax column seen through the glass. */}
    <ellipse cx="50" cy="80" rx="43" ry="5.5" fill="#1e140a" opacity=".3" filter="url(#dcSoft)"/>
    <path d="M9 30V74Q9 80 16 80.5H84Q91 80 91 74V30Z" fill="url(#dcWax)"/>
    {/* The label wraps the front: pastel with a little illustration and the scent in script. */}
    <path d="M14 42H86V70H14Z" fill="url(#dcLabel)"/>
    <path d="M14 42H86M14 70H86" stroke="#c9a9a0" strokeWidth=".6"/>
    <g transform="translate(24 50)"><circle r="6.2" fill="#f4c6b8"/><path d="M-4.4-1.5H3.8V2.6Q3.8 5.2 1.2 5.2H-1.8Q-4.4 5.2-4.4 2.6Z" fill="#fff" stroke="#8a5a4a" strokeWidth=".7"/><path d="M3.8 0.2Q6.2 0.2 6.2 2T3.8 3.4" fill="none" stroke="#8a5a4a" strokeWidth=".7"/><path d="M-2.5-3.2q-.8-1.4.2-2.6M0-3.4q-.8-1.4.2-2.6" fill="none" stroke="#8a5a4a" strokeWidth=".6" strokeLinecap="round"/></g>
    <text x="57" y="55" textAnchor="middle" fontFamily="Caveat,cursive" fontSize="11" fill="#8a4a52">late night latte</text>
    <text x="57" y="63.4" textAnchor="middle" fontFamily="Helvetica,Arial,sans-serif" fontSize="3.3" letterSpacing=".9" fill="#9a7a70">3-WICK CANDLE</text>
    {/* Glass: thick base, walls catching light at both edges, a crisp reflection. */}
    <path d="M7 26V74Q7 82 16 82.5H84Q93 82 93 74V26Z" fill="url(#dcGlass)"/>
    <path d="M9 76.5Q50 81 91 76.5" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.2"/>
    <path d="M16 30V70" stroke="#fff" strokeOpacity=".5" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M20 31V52" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round"/>
    <path d="M86 32V72" stroke="#fff" strokeOpacity=".18" strokeWidth="1.2" strokeLinecap="round"/>
    {/* Top: the rim, the wax surface a little below it, a melt pool when lit, three wicks. */}
    <ellipse cx="50" cy="26" rx="43" ry="8.5" fill="#f3efe7" opacity=".55"/>
    <ellipse cx="50" cy="27.6" rx="40.5" ry="7.4" fill="url(#dcTop)"/>
    <ellipse className="dcPool" cx="50" cy="27.8" rx="34" ry="5.8" fill="url(#dcPool)"/>
    <ellipse cx="50" cy="26" rx="43" ry="8.5" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth=".8"/>
    {[[33,26.6],[50,29.4],[67,26.6]].map(([x,y],i)=><g key={i}>
     <path d={`M${x} ${y}q.4-2.4-.6-4.2`} fill="none" stroke="#2a2018" strokeWidth="1.1" strokeLinecap="round"/>
     <g className="dcFlame" style={{'--i':i} as React.CSSProperties}><ellipse cx={x-.5} cy={y-8} rx="3.4" ry="8" fill="url(#dcFlame)"/><ellipse cx={x-.5} cy={y-4.6} rx="1.3" ry="2.4" fill="#fff" opacity=".85"/><ellipse cx={x-.5} cy={y-1.9} rx="1" ry=".9" fill="#6fa3ff" opacity=".6"/></g>
    </g>)}
   </svg>
   {puffs>0&&<svg className="dcSmoke" key={puffs} viewBox="0 0 100 80" aria-hidden="true">{[33,50,67].map((x,i)=><path key={i} d={`M${x} 76c-6-10 7-16 0-27s5-18-1-30`} style={{animationDelay:`${i*.12}s`}}/>)}</svg>}
  </div>
  <div className={`dhMatches ${striking?'isStriking':''}`} onClick={strike} title="Strike a match">
   <svg viewBox="0 0 60 34" aria-hidden="true">
    <defs><linearGradient id="dmSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6b3b2a"/><stop offset="1" stopColor="#3f2016"/></linearGradient></defs>
    <ellipse cx="30" cy="31" rx="27" ry="3" fill="#1e140a" opacity=".3"/>
    {/* The box lying flat: its top seen from above, the striker strip on the long side. */}
    <path d="M6 14L44 10L56 17L18 21.5Z" fill="#e8dcc6"/>
    <path d="M9 14.2L43.5 10.6L52 15.6L18.2 19.6Z" fill="#c2413a"/>
    <text x="0" y="0" transform="matrix(.98 -.1 .5 .38 22 17)" fontFamily="Helvetica,Arial,sans-serif" fontWeight="800" fontSize="7" fill="#f6ead6">MATCHES</text>
    <path d="M18 21.5L56 17V24L18 29Z" fill="url(#dmSide)"/>
    <path d="M18 23.5L56 19V21.5L18 26Z" fill="#2b1a12" opacity=".7"/>
    <path d="M6 14L18 21.5V29L6 21Z" fill="#b8ab93"/>
    {/* The match, struck along the strip, and its flare. */}
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
    <circle cx="50" cy="50" r="38" fill="url(#sgSky)"/>
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
    <path d="M80 66A32 32 0 0 1 64 82" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1.2" strokeLinecap="round"/>
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
