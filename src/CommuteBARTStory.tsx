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
   const travel=window.innerHeight*.75;
   const progress=Math.max(0,Math.min(1,(window.innerHeight-box.top)/travel));
   trainRef.current.style.transform=`translateX(${-26+progress*26}%)`;
  };
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll)};
 },[]);
 return <section ref={host} className="commuteBARTStory" aria-label="A BART train travels from Oakland to Embarcadero as the page scrolls">
  <div className="bartSceneSimple">
   <svg ref={trainRef} className="bartTrain" viewBox="0 140 2000 470" role="img" aria-label="BART Fleet of the Future train car: white body with blue wrapped end panels carrying the BART logo, a band of tinted windows, two pairs of sliding doors, an amber SFO Airport destination sign, and two bogies on rail">
    <defs>
     <linearGradient id="bartBody" x2="0" y2="1"><stop stopColor="#e7ebee"/><stop offset=".05" stopColor="#ffffff"/><stop offset=".44" stopColor="#ffffff"/><stop offset=".8" stopColor="#f3f6f8"/><stop offset=".95" stopColor="#e2e7eb"/><stop offset="1" stopColor="#ccd2d7"/></linearGradient>
     <linearGradient id="bartBlue" x2="0" y2="1"><stop stopColor="#2e8ad6"/><stop offset=".45" stopColor="#2280cd"/><stop offset="1" stopColor="#1a73c0"/></linearGradient>
     <linearGradient id="bartGlass" x2="0" y2="1"><stop stopColor="#6d8da3"/><stop offset=".14" stopColor="#456679"/><stop offset=".46" stopColor="#2e485b"/><stop offset=".8" stopColor="#233848"/><stop offset="1" stopColor="#1c2e3b"/></linearGradient>
     <linearGradient id="bartDoor" x2="0" y2="1"><stop stopColor="#eaeef1"/><stop offset=".07" stopColor="#fdfefe"/><stop offset=".45" stopColor="#fdfefe"/><stop offset=".82" stopColor="#f1f4f6"/><stop offset="1" stopColor="#e0e5e9"/></linearGradient>
     <linearGradient id="bartGlassHi" x2="0" y2="1"><stop stopColor="#dCE9F2" stopOpacity=".17"/><stop offset=".38" stopColor="#dCE9F2" stopOpacity=".05"/><stop offset="1" stopColor="#dCE9F2" stopOpacity="0"/></linearGradient>
     <linearGradient id="bartFloor" x2="0" y2="1"><stop stopColor="#0a141b" stopOpacity="0"/><stop offset=".4" stopColor="#0a141b" stopOpacity=".5"/><stop offset="1" stopColor="#0a141b" stopOpacity=".78"/></linearGradient>
     <linearGradient id="bartEndL"><stop stopColor="#04121e" stopOpacity=".34"/><stop offset="1" stopColor="#04121e" stopOpacity="0"/></linearGradient>
     <linearGradient id="bartCabL"><stop stopColor="#15191d"/><stop offset=".62" stopColor="#222a31"/><stop offset="1" stopColor="#2c353d"/></linearGradient>
     <linearGradient id="bartCabR" x1="1" x2="0"><stop stopColor="#15191d"/><stop offset=".62" stopColor="#222a31"/><stop offset="1" stopColor="#2c353d"/></linearGradient>
     <linearGradient id="bartEndR" x1="1" x2="0"><stop stopColor="#04121e" stopOpacity=".24"/><stop offset="1" stopColor="#04121e" stopOpacity="0"/></linearGradient>
     <clipPath id="bartBodyClip"><path d="M120 174 L1880 174 C1936 175 1948 196 1948 246 L1974 432 C1976 458 1964 477 1942 479 L58 479 C36 477 24 458 26 432 L52 246 C52 196 64 175 120 174 Z"/></clipPath>
     <filter id="bartSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
     <filter id="bartGroundShadow"><feGaussianBlur stdDeviation="10"/></filter>
    </defs>

    <ellipse cx="1000" cy="574" rx="915" ry="10" fill="#0a1218" opacity=".2" filter="url(#bartGroundShadow)"/>

    <g className="bartCar">
     {/* underframe: shallow toward the ends, deepest between the bogies */}
     <rect x="110" y="478" width="1780" height="44" fill="#171c21"/>
     <rect x="436" y="478" width="1128" height="70" fill="#151a1f"/>
     {[285,1715].map((bx,i)=><g key={`bogie${i}`}>
      <rect x={bx-162} y="482" width="324" height="54" rx="5" fill="#1b2126"/>
      <rect x={bx-124} y="470" width="248" height="22" rx="4" fill="#232a30"/>
      {[bx-132,bx+132].map((wx,j)=><g key={j}>
       <circle cx={wx} cy="518" r="47" fill="#0b0f13"/>
       <circle cx={wx} cy="518" r="35" fill="#3f474e"/>
       <circle cx={wx} cy="518" r="35" fill="none" stroke="#6d757d" strokeWidth="2" opacity=".55"/>
       <circle cx={wx} cy="518" r="21" fill="#1d2329"/>
       <circle cx={wx} cy="518" r="7" fill="#868e96"/>
      </g>)}
     </g>)}
     {[{x:448,w:96},{x:552,w:118},{x:678,w:104},{x:790,w:126},{x:924,w:110},{x:1042,w:98},{x:1148,w:120},{x:1276,w:102},{x:1386,w:88},{x:1482,w:76}].map((b,i)=>
      <rect key={`ub${i}`} x={b.x} y="484" width={b.w} height={i%3===1?62:56} rx="2" fill={i%2?'#242a30':'#1f252b'} stroke="#0d1216" strokeWidth="1.5"/>)}
     <rect x="900" y="498" width="18" height="12" rx="2" fill="#9aa2a9"/>

     {/* body shell */}
     <path d="M120 174 L1880 174 C1936 175 1948 196 1948 246 L1974 432 C1976 458 1964 477 1942 479 L58 479 C36 477 24 458 26 432 L52 246 C52 196 64 175 120 174 Z" fill="url(#bartBody)"/>

     <g clipPath="url(#bartBodyClip)">
      {/* roof rail and sill shading first, so the blue end panels stay clean */}
      <rect x="0" y="174" width="2000" height="3" fill="#8e979f" opacity=".6"/>
      <rect x="0" y="177" width="2000" height="4" fill="#c3cad0" opacity=".45"/>
      {[{x:260,w:450},{x:740,w:400},{x:1180,w:290},{x:1500,w:250}].map((r,i)=>
       <rect key={`roofseg${i}`} x={r.x} y="180" width={r.w} height="5" rx="2" fill="#98a1a8" opacity=".1"/>)}
      <rect x="0" y="456" width="2000" height="24" fill="#b9c1c8" opacity=".24"/>
      <rect x="0" y="472" width="2000" height="8" fill="#98a0a7" opacity=".5"/>
      <rect x="0" y="477" width="2000" height="3" fill="#5c646b" opacity=".5"/>

      {/* cab front faces: the extreme ends turn away from the viewer and read near-black */}
      <rect x="0" y="150" width="96" height="360" fill="url(#bartCabL)"/>
      <rect x="1904" y="150" width="96" height="360" fill="url(#bartCabR)"/>

      {/* blue end panels: near-vertical inner edge */}
      <path d="M102 150 L196 150 C206 252 198 366 180 510 L76 510 Z" fill="url(#bartBlue)"/>
      <path d="M1898 150 L1804 150 C1794 252 1802 366 1820 510 L1924 510 Z" fill="url(#bartBlue)"/>

      {/* soft cab-end shading, no hard seam */}
      <rect x="0" y="160" width="128" height="340" fill="url(#bartEndL)"/>
      <rect x="1872" y="160" width="128" height="340" fill="url(#bartEndR)"/>

      {/* window band: each bay is a pair of panes split by a body-coloured pillar */}
      {[{x:205,w:187},{x:985,w:335},{x:1600,w:192}].map((b,i)=>{
       const pillar=14, pw=(b.w-pillar)/2;
       return <g key={`win${i}`}>{[b.x,b.x+pw+pillar].map((px,k)=><g key={k}>
        <rect x={px} y="228" width={pw} height="142" rx="6" fill="url(#bartGlass)" stroke="#070c10" strokeWidth="2.5"/>
        <rect x={px+pw*.46} y="236" width="3" height="126" fill="#e3c452" opacity=".72"/>
        <rect x={px+3} y="302" width={pw-6} height="66" fill="url(#bartFloor)"/>
        <rect x={px+3} y="231" width={pw-6} height="136" rx="5" fill="url(#bartGlassHi)"/>
       </g>)}</g>;
      })}

      {/* destination sign bay */}
      <g>
       <rect x="700" y="228" width="240" height="142" rx="7" fill="url(#bartGlass)" stroke="#070c10" strokeWidth="2.5"/>
       {[772,868].map((o,k)=><rect key={k} x={o} y="288" width="3" height="76" fill="#e3c452" opacity=".66"/>)}
       <rect x="704" y="304" width="232" height="64" fill="url(#bartFloor)"/>
       <rect x="704" y="282" width="232" height="84" fill="url(#bartGlassHi)"/>
       <rect x="722" y="238" width="196" height="38" rx="4" fill="#05080b"/>
       <text x="820" y="263" textAnchor="middle" fill="#efa61c" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="21" letterSpacing=".4">✈ SFO Airport</text>
      </g>

      {/* door pairs */}
      {[448,1338].map((dx,i)=><g key={`door${i}`}>
       <rect x={dx-4} y="196" width="218" height="284" fill="#f7f9fa"/>
       <rect x={dx-4} y="196" width="2" height="284" fill="#ced5da"/>
       <rect x={dx+212} y="196" width="2" height="284" fill="#ced5da"/>
       {[dx,dx+105].map((lx,j)=><g key={j}>
        <rect x={lx} y="197" width="105" height="282" fill="url(#bartDoor)"/>
        <rect x={lx+8} y="228" width="89" height="142" rx="5" fill="url(#bartGlass)" stroke="#070c10" strokeWidth="2.5"/>
        <rect x={lx+40} y="236" width="3" height="126" fill="#e3c452" opacity=".62"/>
        <rect x={lx+11} y="302" width="83" height="66" fill="url(#bartFloor)"/>
        <rect x={lx+11} y="231" width="83" height="136" rx="4" fill="url(#bartGlassHi)"/>
       </g>)}
       <rect x={dx+104} y="200" width="3" height="276" fill="#d2d9de"/>
      </g>)}

      {/* BART roundel: the "ba" mark is geometric (circular bowls, straight stems), so it is
          drawn as paths rather than set in a text face */}
      {[{x:102},{x:1822}].map((l,i)=><g key={`logo${i}`}>
       <rect x={l.x} y="280" width="76" height="66" rx="7" fill="#ffffff"/>
       <text x={l.x+38} y="301" textAnchor="middle" fill="#1264b0" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="9.5" letterSpacing="1.4">BART</text>
       <g transform={`translate(${l.x+17} 309) scale(.62)`} fill="#1264b0">
        <rect x="0" y="0" width="9" height="30"/>
        <path fillRule="evenodd" d="M0 29.5a16.5 16.5 0 1 0 33 0a16.5 16.5 0 1 0-33 0ZM8 29.5a8.5 8.5 0 1 1 17 0a8.5 8.5 0 1 1-17 0Z"/>
        <g transform="translate(35 0)">
         <path fillRule="evenodd" d="M0 29.5a16.5 16.5 0 1 0 33 0a16.5 16.5 0 1 0-33 0ZM8 29.5a8.5 8.5 0 1 1 17 0a8.5 8.5 0 1 1-17 0Z"/>
         <rect x="24" y="13" width="9" height="33"/>
        </g>
       </g>
      </g>)}

      {/* car numbers */}
      {[{x:140},{x:1860}].map((n,i)=>
       <text key={`num${i}`} x={n.x} y="434" textAnchor="middle" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="24" letterSpacing=".5">3102<tspan fontSize="14">Y</tspan></text>)}

      {/* US flag decals */}
      {[206,1748].map((fx,i)=><g key={`flag${i}`}>
       <rect x={fx} y="398" width="46" height="29" fill="#f5f7f8"/>
       {[0,1,2,3,4,5,6].map(r=><rect key={r} x={fx} y={398+r*4.1} width="46" height="2.1" fill="#b22234"/>)}
       <rect x={fx} y="398" width="19" height="14" fill="#3c3b6e"/>
      </g>)}

     </g>

     <path d="M120 174 L1880 174 C1936 175 1948 196 1948 246 L1974 432 C1976 458 1964 477 1942 479 L58 479 C36 477 24 458 26 432 L52 246 C52 196 64 175 120 174 Z" fill="none" stroke="#b9c1c8" strokeWidth="1" opacity=".35"/>
    </g>

    <rect x="0" y="562" width="2000" height="9" fill="#343b41"/>
    <rect x="0" y="571" width="2000" height="5" fill="#1a1f23" opacity=".6"/>
   </svg>
  </div>
 </section>
}
