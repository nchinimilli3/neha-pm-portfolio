import React, {useEffect, useRef} from 'react';
import './commute-bart.css';

export default function CommuteBARTStory(){
 const host=useRef<HTMLElement>(null);
 const trainRef=useRef<SVGSVGElement>(null);
 useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const update=()=>{
   frame=0;
   if(!trainRef.current||reduced.matches)return;
   const box=trainRef.current.getBoundingClientRect();
   const travel=window.innerHeight+800;
   const progress=Math.max(0,Math.min(1,(window.innerHeight-box.top)/travel));
   trainRef.current.style.transform=`translateX(${-34+progress*68}%)`;
  };
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll)};
 },[]);
 return <section ref={host} className="commuteBARTStory" aria-label="A BART train travels from Oakland to Embarcadero as the page scrolls">
  <header><span>THE MORNING, AS A SYSTEM</span><h2>One arrival time.<br/>Every decision before it.</h2><p>Commute works backward from the commitment, watches live conditions, and returns the latest safe wake-up and leave times.</p></header>
  <div className="bartSceneSimple">
   <svg ref={trainRef} className="bartTrain" viewBox="0 0 1200 280" role="img" aria-label="BART Fleet of the Future train with blue ends, white body, multiple doors, and destination display">
    <defs>
     <linearGradient id="bartWhiteBody" x2="0" y2="1"><stop stopColor="#f9fafb"/><stop offset=".3" stopColor="#eff2f5"/><stop offset="1" stopColor="#e8ecf0"/></linearGradient>
     <linearGradient id="bartBlueFront" x2="1"><stop stopColor="#003d9f"/><stop offset=".5" stopColor="#0052cc"/><stop offset="1" stopColor="#0f66d9"/></linearGradient>
     <linearGradient id="bartWindowGlass" x2="0" y2="1"><stop stopColor="#7fb3c8"/><stop offset=".35" stopColor="#4a7d8f"/><stop offset="1" stopColor="#1f3a47"/></linearGradient>
     <filter id="bartShadowDepth"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <ellipse cx="600" cy="265" rx="540" ry="12" fill="#000" opacity=".12" filter="url(#bartShadowDepth)"/>
    <g className="bartCar">
     <path d="M80 235V110Q80 75 115 70H1050Q1080 72 1105 105L1145 155Q1155 170 1155 190V235Z" fill="url(#bartWhiteBody)" stroke="#a0a8b0" strokeWidth="2"/>
     <path d="M80 220H1155V245H80Z" fill="#d5dce2"/>
     <path d="M50 70H80V235H50Q30 200 30 155Q30 100 50 70Z" fill="url(#bartBlueFront)"/>
     <path d="M1155 70H1185V235H1155Q1175 200 1175 155Q1175 100 1155 70Z" fill="url(#bartBlueFront)"/>
     <circle cx="55" cy="95" r="9" fill="#fff" opacity=".4"/>
     <circle cx="1160" cy="95" r="9" fill="#fff" opacity=".4"/>
     <text x="55" y="170" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="900" fontSize="16" letterSpacing="1">BART</text>
     <text x="1160" y="170" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="900" fontSize="16" letterSpacing="1">BART</text>
     <rect x="55" y="70" width="18" height="18" fill="#fff" stroke="#d0d8de" strokeWidth="1" rx="2"/>
     <text x="64" y="83" textAnchor="middle" fontFamily="Arial" fontSize="11" fill="#000">🇺🇸</text>
     {[110,200,310,420,540,660,780,890,1000].map((x,i)=><rect key={`w${i}`} x={x} y="78" width="72" height="60" rx="3" fill="url(#bartWindowGlass)" stroke="#5a7080" strokeWidth="1.5" opacity=".9"/>)}
     {[160,270,390,510,630,750,860,970].map((x,i)=><g key={`d${i}`}>
      <rect x={x} y="98" width="85" height="110" rx="4" fill="#e5ecf2" stroke="#6a7a88" strokeWidth="2"/>
      <rect x={x+8} y="110" width="32" height="48" rx="2" fill="url(#bartWindowGlass)" opacity=".8"/>
      <rect x={x+45} y="110" width="32" height="48" rx="2" fill="url(#bartWindowGlass)" opacity=".8"/>
      <path d={`M${x+42} 98V208`} stroke="#6a7a88" strokeWidth="1.5"/>
      <circle cx={x+21} cy="170" r="2" fill="#7a8a98"/>
      <circle cx={x+64} cy="170" r="2" fill="#7a8a98"/>
      <circle cx={x+42} cy="215" r="4" fill="#6a7a8a"/>
     </g>)}
     <g>
      <rect x="330" y="135" width="85" height="55" rx="4" fill="#ffd700" stroke="#b8860b" strokeWidth="1.5"/>
      <text x="372" y="155" textAnchor="middle" fill="#000" fontFamily="Arial" fontWeight="800" fontSize="13" letterSpacing=".5">SFO Airport</text>
      <text x="372" y="180" textAnchor="middle" fill="#b8860b" fontFamily="Arial" fontWeight="600" fontSize="9">✈️</text>
     </g>
     <rect x="80" y="225" width="1075" height="6" fill="#3a4a54"/>
     <rect x="80" y="231" width="1075" height="3" fill="#2a3a44"/>
     {[130,1130].map((x,i)=><g key={`wh${i}`}>
      <circle cx={x} cy="248" r="28" fill="#0a0f14"/>
      <circle cx={x} cy="248" r="22" fill="#404a52"/>
      <circle cx={x} cy="248" r="16" fill="#5a6a72"/>
      <circle cx={x} cy="248" r="6" fill="#e8ecf0"/>
      <ellipse cx={x-8} cy={248-8} rx="7" ry="5" fill="#fff" opacity=".4"/>
     </g>)}
     <rect x="90" y="250" width="75" height="22" fill="#2a3a44"/>
     <rect x="1035" y="250" width="75" height="22" fill="#2a3a44"/>
     <text x="128" y="265" fontFamily="Arial" fontWeight="900" fontSize="14" fill="#7a8a98">3102</text>
     <text x="1072" y="265" fontFamily="Arial" fontWeight="900" fontSize="14" fill="#7a8a98">3102</text>
     <line x1="55" y1="55" x2="140" y2="55" stroke="#2a3a44" strokeWidth="2" opacity=".6"/>
     <line x1="1125" y1="55" x2="1160" y2="55" stroke="#2a3a44" strokeWidth="2" opacity=".6"/>
    </g>
   </svg>
  </div>
 </section>
}
