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
    <defs><linearGradient id="bartSteel" x2="0" y2="1"><stop stopColor="#f8fbfc"/><stop offset=".55" stopColor="#d9e0e4"/><stop offset="1" stopColor="#aebbc2"/></linearGradient><linearGradient id="bartBlue" x2="1"><stop stopColor="#1371b8"/><stop offset=".55" stopColor="#005496"/><stop offset="1" stopColor="#063b75"/></linearGradient><linearGradient id="bartGlass" x2="0" y2="1"><stop stopColor="#9bc9d7"/><stop offset=".35" stopColor="#315f76"/><stop offset="1" stopColor="#122d3b"/></linearGradient><filter id="bartShadow"><feGaussianBlur stdDeviation="8"/></filter></defs>
    <ellipse cx="520" cy="268" rx="465" ry="15" fill="#173142" opacity=".18" filter="url(#bartShadow)"/>
    <g className="bartCar"><path d="M48 221V87Q48 58 82 54H865Q910 55 947 91L1000 144Q1015 159 1015 184V221Z" fill="url(#bartSteel)" stroke="#78909c" strokeWidth="3"/><path d="M48 202H1015V230H48Z" fill="url(#bartBlue)"/><path d="M867 57Q911 60 947 95L999 146H877Z" fill="url(#bartGlass)"/><path d="M888 73Q914 79 937 102L969 132H888Z" fill="#0d2939"/><rect x="850" y="76" width="24" height="69" rx="4" fill="#2a4b5b"/><rect x="74" y="81" width="134" height="55" rx="4" fill="#173341"/><text x="91" y="105" fill="#ffb33b" fontFamily="monospace" fontSize="13">YELLOW</text><text x="91" y="125" fill="#ffd78a" fontFamily="monospace" fontSize="12">SF / DALY CITY</text>
    {[236,455,674].map((x,index)=><g key={x} className={`bartDoor bartDoor${index+1}`}><rect x={x} y="69" width="128" height="137" rx="5" fill="#e8edef" stroke="#718892" strokeWidth="3"/><rect x={x+10} y="79" width="50" height="67" rx="3" fill="url(#bartGlass)"/><rect x={x+68} y="79" width="50" height="67" rx="3" fill="url(#bartGlass)"/><path d={`M${x+64} 70V205`} stroke="#718892" strokeWidth="3"/><rect x={x+18} y="156" width="92" height="6" rx="3" fill="#1671b7"/></g>)}
    <rect x="80" y="151" width="105" height="43" rx="5" fill="url(#bartGlass)"/><circle cx="141" cy="218" r="21" fill="#fff" stroke="#0960a4" strokeWidth="6"/><text x="141" y="226" textAnchor="middle" fill="#0960a4" fontFamily="Arial" fontWeight="800" fontSize="24">ba</text><rect x="925" y="154" width="55" height="14" rx="3" fill="#ffd21f"/><rect x="58" y="230" width="944" height="11" fill="#485b64"/>
    {[174,830].map(x=><g key={x}><circle cx={x} cy="241" r="32" fill="#14232a"/><circle cx={x} cy="241" r="20" fill="#74858d"/><circle cx={x} cy="241" r="7" fill="#d3dade"/></g>)}</g>
   </svg>
   <div className="bartPlatform" aria-hidden="true"><span></span><span></span><span></span></div>
   <div className="bartDecisionCard"><span>COMMUTE RECOMMENDS</span><strong>BART · 8:19 AM</strong><small>More recovery time if a train is missed</small></div>
  </div>
  <footer><span>SCROLL TO MOVE THE MORNING →</span><strong>Arrive at Salesforce Tower by 9:00 AM</strong></footer>
 </section>
}
