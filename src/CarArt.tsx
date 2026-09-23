import React from 'react';
import MachEArtwork from './MachEArtwork';

/* The Shelby GT500 from the Ford CVF scroll scene, redrawn at road scale so the
   traveler on the lifecycle bar is literally the same car the page drives.
   Cropped tight to the body: no road, no exhaust, no speed lines. */
export function ShelbyMark(){
 // Per-instance gradient ids: this artwork can be on the page more than once.
 const _u = React.useId().replace(/:/g, '');
 const wheel = (cx: number, name: string) => <g>
  <circle cx={cx} cy="291" r="46" fill="#101b22" stroke="#071019" strokeWidth="3"/>
  <circle cx={cx} cy="291" r="39" fill="#172730" stroke="#607580"/>
  <circle cx={cx} cy="291" r="31" fill={`url(#shelbyMetal${_u})`}/>
  <g className={`shelbyWheel ${name}`}>{[0,72,144,216,288].map(a => <path key={a} d={`M${cx-5} 284L${cx-9} 265L${cx+9} 265L${cx+5} 284Z`} transform={`rotate(${a} ${cx} 291)`} fill="#17374a" stroke="#eef2e9" strokeWidth="1.5"/>)}</g>
  <circle cx={cx} cy="291" r="10" fill={`url(#shelbyMetal${_u})`} stroke="#263e4c" strokeWidth="2"/>
  <circle cx={cx} cy="291" r="4" fill="#284b64"/>
  <path d={`M${cx-35} 273Q${cx} 242 ${cx+35} 273`} fill="none" stroke="#fff" strokeOpacity=".17"/>
 </g>;
 return <svg className="lcMarkCar lcMarkShelby" viewBox="52 140 676 180" aria-hidden="true">
  <defs>
  <linearGradient id={`shelbyPaint${_u}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#93b8ce"/><stop offset=".21" stopColor="#4d89b0"/><stop offset=".46" stopColor="#28668f"/><stop offset=".55" stopColor="#194767"/><stop offset=".85" stopColor="#205579"/><stop offset="1" stopColor="#0c2d46"/></linearGradient>
  <linearGradient id={`shelbyMetal${_u}`} x2=".65" y2="1"><stop stopColor="#fffdf1"/><stop offset=".27" stopColor="#8294a0"/><stop offset=".48" stopColor="#f1f4eb"/><stop offset="1" stopColor="#607785"/></linearGradient>
  <linearGradient id={`shelbyGlass${_u}`} x2=".6" y2="1"><stop stopColor="#aecbd8"/><stop offset=".3" stopColor="#41677d"/><stop offset="1" stopColor="#0a263b"/></linearGradient>
  <filter id={`shelbyShadow${_u}`} x="-.2" y="-1" width="1.4" height="3"><feGaussianBlur stdDeviation="6"/></filter>
  <radialGradient id={`shelbySmoke${_u}`}><stop stopColor="#d4e2e3" stopOpacity=".78"/><stop offset=".48" stopColor="#91a8ad" stopOpacity=".48"/><stop offset="1" stopColor="#a4b1b5" stopOpacity="0"/></radialGradient></defs>
 <ellipse cx="391" cy="337" rx="313" ry="10" fill="#0c263b" opacity=".23" filter={`url(#shelbyShadow${_u})`}/>
 <path d="M62 256L72 223L124 214L259 153Q272 147 292 147H366Q381 147 395 161L440 207L639 217L700 233L715 256L712 299L641 304Q638 238 587 238Q534 238 532 305H233Q231 238 180 238Q127 238 126 305H76L62 290Z" fill={`url(#shelbyPaint${_u})`} stroke="#14374f" strokeWidth="2"/>
 <path d="M127 214L263 157Q273 152 293 153H363L421 207Z" fill={`url(#shelbyMetal${_u})`}/>
 <path d="M162 207L268 161L293 159L290 207Z" fill={`url(#shelbyGlass${_u})`}/>
 <path d="M300 159H360L405 205L298 207Z" fill={`url(#shelbyGlass${_u})`}/>
 <path d="M311 162H330L373 202H352Z" fill="#d4e7e8" opacity=".23"/>
 <path d="M223 181L259 166L256 196L223 206Z" fill="#20455f" stroke="#90adbe"/>
 <path d="M232 181L231 199M239 178L238 196M246 175L245 193" stroke="#acc2cd" strokeWidth="2"/>
 <path d="M442 207L495 197L547 200L575 215" fill="#407da4" stroke="#183c55" strokeWidth="1.5"/>
 <path d="M500 198L535 201L549 207L501 205Z" fill="#102d42"/>
 <path d="M447 210L626 223L688 238" fill="none" stroke="#e9ebe1" strokeWidth="6"/>
 <path d="M70 227L223 220L432 213L643 228L703 241" fill="none" stroke="#c3dbe3" strokeWidth="2" strokeOpacity=".8"/>
 <path d="M294 213L286 278Q285 289 296 290H418Q428 290 429 278L434 211" fill="none" stroke="#082d46" strokeWidth="1.5"/>
 <path d="M310 225H331" stroke="#09273b" strokeWidth="5"/><path d="M310 223H330" stroke={`url(#shelbyMetal${_u})`} strokeWidth="3"/>
 <path d="M412 205L418 194H432L435 200L421 207Z" fill={`url(#shelbyMetal${_u})`} stroke="#31536a"/>
 <path d="M241 234L276 228L270 255L238 263Z" fill="#12364f" stroke="#84a9bf" strokeWidth="1.5"/>
 <path d="M245 242L268 236M244 249L266 242M243 256L264 249" stroke="#547c94"/>
 <path d="M234 279H532" stroke="#ebece1" strokeWidth="7"/><path d="M236 286H531" stroke="#d5dedb" strokeWidth="2"/>
 <text x="452" y="275" fill="#e9ece1" fontFamily="monospace" fontSize="10" letterSpacing="2">G.T. 500</text>
 <path d="M239 300H528" stroke={`url(#shelbyMetal${_u})`} strokeWidth="4"/>
 <path d="M645 252L702 256L704 280L644 277Z" fill="#102c40"/>
 <path d="M651 258H699M650 263H700M650 268H700" stroke="#738e9c" strokeWidth="1"/>
 <ellipse cx="697" cy="265" rx="9" ry="12" fill="#f4ebcb" stroke={`url(#shelbyMetal${_u})`} strokeWidth="3"/>
 <path d="M73 240L84 239L81 267L70 267Z" fill="#a14236" stroke="#adc0c8" strokeWidth="2"/>
 <path d="M67 289L124 293M645 291L715 286" stroke={`url(#shelbyMetal${_u})`} strokeWidth="8"/>
 <path d="M73 307H94" stroke="#506571" strokeWidth="6" strokeLinecap="round"/>
 <path d="M294 238Q385 228 518 241" fill="none" stroke="#c5e0e9" strokeOpacity=".3" strokeWidth="2"/>
 {wheel(180,'shelbyRear')}{wheel(587,'shelbyFront')}
 <path d="M133 270Q145 242 174 243M540 270Q552 242 581 243" stroke="#bdd2da" strokeOpacity=".7" strokeWidth="2" fill="none"/>
 </svg>;
}

/* A full-bleed strip between the 20-second answer and the case body. The car
   drives across it as that strip crosses the viewport, so the motion is tied
   to reading the page rather than firing before the reader has moved. */
export function CarBand({car,label}:{car:'shelby'|'mache';label:string}){
 const host=React.useRef<HTMLElement>(null);
 const rider=React.useRef<HTMLDivElement>(null);
 React.useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const update=()=>{
   frame=0;
   const band=host.current,ride=rider.current;
   if(!band||!ride)return;
   const rect=band.getBoundingClientRect();
   // 0 when the band is just below the fold, 1 once it has fully passed above.
   const span=window.innerHeight+rect.height;
   const p=reduced.matches?.5:Math.max(0,Math.min(1,(window.innerHeight-rect.top)/span));
   const travel=Math.max(0,rect.width-ride.offsetWidth-48);
   const x=24+p*travel;
   ride.style.transform=`translateX(${x}px)`;
   band.style.setProperty('--band-progress',String(p));
   band.style.setProperty('--band-x',`${x}px`);
   band.style.setProperty('--band-wheel',`${p*1440}deg`);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)};
 },[]);
 return <section ref={host} className={`carBand carBand-${car}`} aria-label={label}>
  <div className="carBandRoad" aria-hidden="true"><i/></div>
  <div className="carBandWake" aria-hidden="true"><i/><i/><i/><i/></div>
  <div className="carBandRider" ref={rider} aria-hidden="true">
   {car==='shelby'?<ShelbyMark/>:<MachEArtwork className="carBandMachE"/>}
  </div>
 </section>;
}
