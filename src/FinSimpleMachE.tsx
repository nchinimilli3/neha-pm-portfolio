import React, { useEffect, useRef, useState } from 'react';
import './finsimple-mache.css';

// Original vector illustration, proportion reference: Ford's Mustang Mach-E profile.
// https://ford.bg/cars/mustang-mach-e
// Electric motion is expressed with light trails only; no exhaust or audio.
export default function FinSimpleMachE() {
 const scene = useRef<HTMLDivElement>(null);
 const played = useRef(false);
 const [run, setRun] = useState(0);
 useEffect(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const launch = () => {
   if (played.current || motion.matches || !scene.current) return;
   const rect = scene.current.getBoundingClientRect();
   if (window.scrollY > 35 && rect.bottom > 80 && rect.top < window.innerHeight) {
    played.current = true;
    setRun(1);
   }
  };
  window.addEventListener('scroll', launch, { passive: true });
  return () => window.removeEventListener('scroll', launch);
 }, []);
 const wheel = (x: number, name: string) => <g>
  <circle cx={x} cy="299" r="49" fill="#080f1b" stroke="#1b2c40" strokeWidth="2"/>
  <circle cx={x} cy="299" r="42" fill="#121e2b" stroke="#45556c" strokeWidth="1.5"/>
  <circle cx={x} cy="299" r="34" fill="#12202e" stroke="url(#meAlloy)" strokeWidth="3"/>
  <path d={`M${x+22} 280L${x+28} 282L${x+28} 305L${x+22} 310Z`} fill="#4484d8"/>
  <g className={`meWheel ${name}`}>{Array.from({length:5},(_,i)=><g key={i} transform={`rotate(${i*72} ${x} 299)`}><path d={`M${x-4} 294L${x-15} 271L${x-4} 265L${x+7} 291Z`} fill="url(#meAlloy)"/><path d={`M${x+4} 292L${x+10} 268L${x+17} 273L${x+11} 296Z`} fill="#92a7bf"/><path d={`M${x-7} 290L${x-14} 274`} stroke="#e1ecf7" strokeWidth="1.2"/></g>)}</g>
  <circle cx={x} cy="299" r="9" fill="url(#meAlloy)"/>
  <circle cx={x} cy="299" r="5" fill="#142a43"/>
  <path d={`M${x-38} 280Q${x} 248 ${x+38} 280`} stroke="#bcd6f1" strokeOpacity=".18" fill="none"/>
 </g>;
 return <div ref={scene} className="meScene">
 <div className="meSpec"><span>FORD MUSTANG MACH-E</span><span>ALL ELECTRIC</span></div>
 <svg key={run} className={`meIllustration${run ? ' meRunning' : ''}`} viewBox="0 0 800 410" role="img" aria-label="Original metallic blue Mustang Mach-E illustration with panoramic glass roof and sculpted electric crossover body. Scroll to see a silent electric launch.">
 <defs>
  <linearGradient id="meBody" x1="0" y1="0" x2=".12" y2="1"><stop stopColor="#a5d5ff"/><stop offset=".23" stopColor="#4d9de4"/><stop offset=".46" stopColor="#1b68be"/><stop offset=".56" stopColor="#16477f"/><stop offset=".79" stopColor="#2366ae"/><stop offset="1" stopColor="#0a244b"/></linearGradient>
  <linearGradient id="meGlass" x1="0" y1="0" x2=".9" y2="1"><stop stopColor="#638bb5"/><stop offset=".35" stopColor="#263e61"/><stop offset="1" stopColor="#071b34"/></linearGradient>
  <linearGradient id="meAlloy" x2=".7" y2="1"><stop stopColor="#e4eef8"/><stop offset=".4" stopColor="#8ba2b9"/><stop offset=".52" stopColor="#edf6ff"/><stop offset="1" stopColor="#4c6683"/></linearGradient>
  <linearGradient id="meTrail"><stop stopColor="#60aaff" stopOpacity="0"/><stop offset="1" stopColor="#72bcff"/></linearGradient>
  <linearGradient id="meSculpt" x2="0" y2="1"><stop stopColor="#b1daff" stopOpacity=".28"/><stop offset="1" stopColor="#041b40" stopOpacity=".3"/></linearGradient>
  <radialGradient id="meGround"><stop stopColor="#287ad2" stopOpacity=".2"/><stop offset="1" stopColor="#287ad2" stopOpacity="0"/></radialGradient>
  <filter id="meSoft" x="-.2" y="-1" width="1.4" height="3"><feGaussianBlur stdDeviation="7"/></filter>
 </defs>
 <ellipse cx="414" cy="340" rx="362" ry="49" fill="url(#meGround)"/>
 <path d="M55 372H745" stroke="#5484b2" strokeOpacity=".18"/>
 <g className="meTrails" fill="none" stroke="url(#meTrail)" strokeLinecap="round"><path d="M-140 212H171" strokeWidth="2"/><path d="M-100 249H192" strokeWidth="3"/><path d="M-180 282H152" strokeWidth="1.5"/><path d="M-60 327H215" strokeWidth="2"/></g>
 <g className="meCar">
 <ellipse cx="409" cy="346" rx="319" ry="11" fill="#051a34" opacity=".24" filter="url(#meSoft)"/>
 <path d="M70 254L76 216L113 182L161 151Q205 122 252 119L377 117Q408 117 431 137L499 191L653 207Q697 213 722 237L732 277L720 313L643 317Q642 245 587 245Q531 245 529 319H241Q239 245 184 245Q128 245 127 317H86L69 297Z" fill="url(#meBody)" stroke="#153c66" strokeWidth="1.8"/>
 <path d="M97 194L164 146Q204 120 252 116L377 115Q410 115 434 135L497 186L477 191L426 146Q407 128 379 126H252Q209 128 179 149L130 192Z" fill="#101f35"/>
 <path d="M119 193L179 151Q211 131 253 129L378 128Q404 128 424 146L477 191Z" fill="url(#meGlass)" stroke="#89b4dc" strokeWidth="1.5"/>
 <path d="M270 129L266 191M374 129L386 191" stroke="#10213a" strokeWidth="10"/>
 <path d="M164 166L179 155L214 194H193Z" fill="#9dcdf2" opacity=".18"/>
 <path d="M286 135H307L358 186H333Z" fill="#a8cfea" opacity=".13"/>
 <path d="M401 142L454 188H429L394 153Z" fill="#bddaf4" opacity=".1"/>
 <path d="M101 182L144 166L138 176L102 193L88 191Z" fill="#13283f"/>
 <path d="M120 199L485 198L654 214Q695 220 719 241" fill="none" stroke="#b2d9f8" strokeOpacity=".65" strokeWidth="2"/>
 <path d="M247 224Q330 213 417 224L511 234L494 273L259 280Z" fill="url(#meSculpt)"/>
 <path d="M245 278Q365 252 517 276" fill="none" stroke="#86b8e6" strokeWidth="1.4" strokeOpacity=".5"/>
 <path d="M267 199L258 286Q258 297 270 298H384L389 198M389 298H507Q519 298 519 285L508 221L486 199" fill="none" stroke="#0d3b6a" strokeWidth="1.2"/>
 <path d="M278 207H285M398 207H405" stroke="#0a2a4e" strokeWidth="4" strokeLinecap="round"/>
 <path d="M469 199L472 189L493 186L502 192L497 201H481Z" fill="#143857" stroke="#6f9ac0"/>
 <path d="M475 193L492 191" stroke="#a2d0f2" strokeWidth="1.4"/>
 <path d="M548 216Q563 212 572 220L569 237H551Z" fill="none" stroke="#133f6f" strokeWidth="1.2"/>
 <path d="M78 283L126 284Q133 243 175 239Q219 235 239 287L530 288Q543 240 584 239Q625 237 644 281L729 276L720 313H645Q642 246 587 246Q532 246 530 317H240Q238 246 184 246Q130 246 127 316H86Z" fill="#10233a"/>
 <path d="M244 306H527" stroke="#476684" strokeWidth="2"/>
 <text x="346" y="297" fill="#a5bed8" fontFamily="sans-serif" fontSize="8" letterSpacing="3">MACH-E</text>
 <path d="M645 216L706 229L715 243L675 237L652 225Z" fill="#0d2948"/>
 <path d="M650 219L704 231L709 236L676 231" fill="none" stroke="#e3f5ff" strokeWidth="3" strokeLinejoin="round"/>
 <path d="M658 221L656 225M666 223L664 227M674 225L672 229" stroke="#c7eaff" strokeWidth="2"/>
 <path d="M708 249L724 254L727 276L713 280L701 268Z" fill="#174c81" stroke="#103459"/>
 <path d="M716 256L723 260L723 271L715 273" fill="none" stroke="#729fcb" strokeWidth="1"/>
 <path d="M681 285L716 280L711 293L678 300Z" fill="#071e35"/>
 <path d="M83 216L106 207L116 211L102 218L87 228Z" fill="#622339"/>
 <path d="M89 214L90 226M97 211L98 222M105 209L106 216" stroke="#ff777c" strokeWidth="3"/>
 {wheel(184,'meRear')}{wheel(587,'meFront')}
 <path d="M139 278Q151 250 179 249M542 278Q554 249 584 249" stroke="#6ca1d4" strokeWidth="1.3" fill="none"/>
 </g>
 </svg>
 <div className="meCaption"><span>Built for what’s next.</span><button type="button" onClick={() => { played.current = true; setRun(n => n + 1); }} aria-label="Replay the Mustang Mach-E electric drive animation">Take a drive <span aria-hidden="true">↗</span></button></div>
 </div>;
}
