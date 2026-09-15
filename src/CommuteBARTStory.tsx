import React, {useEffect, useRef} from 'react';
import './commute-bart.css';

export default function CommuteBARTStory(){
 const host=useRef<HTMLElement>(null);
 useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const update=()=>{
   frame=0;
   if(!host.current||reduced.matches)return;
   const box=host.current.getBoundingClientRect();
   const travel=window.innerHeight+box.height;
   const progress=Math.max(0,Math.min(1,(window.innerHeight-box.top)/travel));
   host.current.style.setProperty('--bart-x',`${-34+progress*68}%`);
  };
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll)};
 },[]);
 return <section ref={host} className="commuteBARTStory" aria-label="A BART train travels from Oakland to Embarcadero as the page scrolls">
  <header><span>THE MORNING, AS A SYSTEM</span><h2>One arrival time.<br/>Every decision before it.</h2><p>Commute works backward from the commitment, watches live conditions, and returns the latest safe wake-up and leave times.</p></header>
  <div className="bartStickyScene">
   <div className="bartSkyline" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><b></b></div>
   <div className="bartRouteLabel"><span>OAKLAND</span><i></i><strong>19th St</strong><i></i><span>TRANSBAY</span><i></i><strong>Embarcadero</strong></div>
   <svg className="bartTrain" viewBox="0 0 1040 310" role="img" aria-label="Code-drawn BART Fleet of the Future train with a blue body, three doors, and an amber destination display">
    <defs>
     <linearGradient id="bartSteel" x2="0" y2="1"><stop stopColor="#f8fbfc"/><stop offset=".55" stopColor="#d9e0e4"/><stop offset="1" stopColor="#aebbc2"/></linearGradient>
     <linearGradient id="bartBlue" x2="1"><stop stopColor="#0a4fa3"/><stop offset=".5" stopColor="#1366b8"/><stop offset="1" stopColor="#002d6b"/></linearGradient>
     <linearGradient id="bartGlass" x2="0" y2="1"><stop stopColor="#a0d4e0"/><stop offset=".35" stopColor="#4a7d8f"/><stop offset="1" stopColor="#1a3a47"/></linearGradient>
     <linearGradient id="bartHeadlight" x2="0" y2="1"><stop stopColor="#fffacd"/><stop offset="1" stopColor="#ffeb99"/></linearGradient>
     <filter id="bartShadow"><feGaussianBlur stdDeviation="8"/></filter>
     <filter id="bartGlow"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <ellipse cx="520" cy="268" rx="465" ry="15" fill="#173142" opacity=".18" filter="url(#bartShadow)"/>
    <g className="bartCar">
     <path d="M48 221V87Q48 58 82 54H865Q910 55 947 91L1000 144Q1015 159 1015 184V221Z" fill="url(#bartSteel)" stroke="#6b7f8a" strokeWidth="2.5"/>
     <path d="M48 202H1015V230H48Z" fill="url(#bartBlue)"/>
     <path d="M867 57Q911 60 947 95L999 146H877Z" fill="url(#bartGlass)" opacity=".9"/>
     <path d="M888 73Q914 79 937 102L969 132H888Z" fill="#0a2333" opacity=".7"/>
     <rect x="850" y="76" width="24" height="69" rx="4" fill="#1a3a4a" stroke="#2a5a6a" strokeWidth="1.5"/>
     <rect x="74" y="81" width="134" height="55" rx="4" fill="#0f2838" stroke="#2a5a6a" strokeWidth="1.5"/>
     <text x="91" y="105" fill="#ffb33b" fontFamily="monospace" fontSize="13" fontWeight="600">YELLOW</text>
     <text x="91" y="125" fill="#ffd78a" fontFamily="monospace" fontSize="12">SF / DALY CITY</text>
     {[236,455,674].map((x,index)=><g key={x} className={`bartDoor bartDoor${index+1}`}>
      <rect x={x} y="69" width="128" height="137" rx="6" fill="#e6ebf0" stroke="#5a7a8a" strokeWidth="2.5"/>
      <rect x={x+10} y="79" width="50" height="67" rx="3" fill="url(#bartGlass)" opacity=".85"/>
      <rect x={x+68} y="79" width="50" height="67" rx="3" fill="url(#bartGlass)" opacity=".85"/>
      <path d={`M${x+64} 70V205`} stroke="#5a7a8a" strokeWidth="2.5"/>
      <rect x={x+18} y="156" width="92" height="6" rx="3" fill="#0a4fa3"/>
      <circle cx={x+20} cy="210" r="4" fill="#8a9aaa"/>
      <circle cx={x+108} cy="210" r="4" fill="#8a9aaa"/>
     </g>)}
     <rect x="80" y="151" width="105" height="43" rx="5" fill="url(#bartGlass)" opacity=".8"/>
     <circle cx="141" cy="218" r="21" fill="#f5f7fa" stroke="#0a4fa3" strokeWidth="5"/>
     <circle cx="141" cy="218" r="18" fill="#e8f0f5"/>
     <text x="141" y="226" textAnchor="middle" fill="#0a4fa3" fontFamily="Arial" fontWeight="900" fontSize="22">ba</text>
     <rect x="925" y="154" width="55" height="14" rx="3" fill="#ffd21f" filter="url(#bartGlow)"/>
     <rect x="925" y="154" width="55" height="14" rx="3" fill="#ffeb99" opacity=".6"/>
     <rect x="58" y="230" width="944" height="11" rx="3" fill="#3a4f5a"/>
     <rect x="58" y="235" width="944" height="2" fill="#5a7a8a" opacity=".6"/>
     {[174,830].map(x=><g key={x}>
      <circle cx={x} cy="241" r="34" fill="#0a1620"/>
      <circle cx={x} cy="241" r="26" fill="#5a7a8a"/>
      <circle cx={x} cy="241" r="18" fill="#7a8a9a"/>
      <circle cx={x} cy="241" r="8" fill="#d3dade"/>
      <circle cx={x} cy="241" r="4" fill="#f5f7fa"/>
      <ellipse cx={x-6} cy={241-6} rx="6" ry="5" fill="#fff" opacity=".4"/>
     </g>)}
     <line x1="40" y1="180" x2="120" y2="175" stroke="#0a4fa3" strokeWidth="3" opacity=".6"/>
     <line x1="930" y1="140" x2="1010" y2="130" stroke="#ffb33b" strokeWidth="3" opacity=".7"/>
    </g>
   </svg>
   <div className="bartPlatform" aria-hidden="true"><span></span><span></span><span></span></div>
   <div className="bartDecisionCard"><span>COMMUTE RECOMMENDS</span><strong>BART · 8:19 AM</strong><small>More recovery time if a train is missed</small></div>
  </div>
  <footer><span>SCROLL TO MOVE THE MORNING →</span><strong>Arrive at Salesforce Tower by 9:00 AM</strong></footer>
 </section>
}
