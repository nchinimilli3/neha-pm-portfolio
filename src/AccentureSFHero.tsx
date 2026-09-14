import React, {useEffect, useRef} from 'react';
import './accenture-sf-hero.css';

// Native vector artwork: all landmarks, the Accenture mark, and fog are drawn in code.
const houses = ['#d9bf81', '#a9b3a1', '#a8a9c3', '#da9b97', '#aaa3bf'];
const random = (n:number) => {const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};

function Trees({x,y,scale=1}:{x:number;y:number;scale?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M0 0V-64M0-24-14-42M0-38 12-53" fill="none" stroke="#615a47" strokeWidth="5"/>
    {[[-14,-40,19],[9,-49,22],[-5,-65,18],[22,-31,17],[-23,-23,17],[0,-26,24]].map(([cx,cy,r],i)=><circle key={i} cx={cx} cy={cy} r={r} fill={['#425c50','#586b4e','#718053'][i%3]}/>)}
    <path d="m-21-59 12-9m10 23 12-5m-35 22 11-4" stroke="#9c9c68" strokeWidth="5" opacity=".45"/>
  </g>;
}
function House({x,color,index}:{x:number;color:string;index:number}) {
  return <g transform={`translate(${x} ${index%2?3:0})`}>
    <path d="M0 686V581L43 543 86 581V686Z" fill={color} stroke="#646276" strokeWidth="2"/>
    <path d="m-7 582 50-48 51 48-7 7-44-40-42 40Z" fill="#676477"/>
    <path d="m0 581 43-40 44 40M7 579l36-32 37 32" fill="none" stroke="#f8e6cd" strokeWidth="3"/>
    <path d="M38 543v-15m3 14v-12" stroke="#eee4d2" strokeWidth="2"/>
    <path d="M9 585H77M8 616H79M5 649H81M2 680H84" stroke="#f8e4cb" strokeWidth="5"/>
    <path d="M11 589v88M74 589v88" stroke="#f3e0c9" strokeWidth="4"/>
    <path d="M22 579 43 558 64 579Z" fill="#eee0ca"/><path d="M37 570h13v12H37Z" fill="#4b5360"/>
    <path d="M22 591h39l9 12v64H17v-64Z" fill="#e7d9c5" stroke="#847b7b"/>
    {[601,628,654].map(y=><g key={y}>
      <path d={`M21 ${y}h12v18H21Zm17 0h13v18H38Zm18 0h10v18H56Z`} fill="url(#sfWindow)" stroke="#faf0da" strokeWidth="2"/>
      <path d={`M20 ${y+8}h46M34 ${y-3}v24M53 ${y-3}v24`} stroke="#d2c7b7" strokeWidth="1.5"/>
    </g>)}
    <path d="M14 674h56v5H14Z" fill="#f7ead4"/><path d="M34 679h18v13H34Z" fill="#4c5359"/>
    <path d="M29 685h30m-34 4h38" stroke="#d8c8b7" strokeWidth="3"/>
  </g>;
}
function Scene(){
  return <g>
    <g stroke="#a74734" fill="none">
      <path d="M-40 521 529 604" strokeWidth="17"/><path d="M-40 516 529 599" stroke="#eea16f" strokeWidth="3"/>
      {Array.from({length:46},(_,i)=>{const x=i*12;return <path key={i} d={`m${x} ${526+x*.145} 12 10v-8m-12-2v8`} strokeWidth="1.6"/>})}
      <path d="M217 669V260h53v417M447 649V435h31v216" strokeWidth="10"/>
      <path d="M220 316h47m-47 62h47m-47 67h47m-47 72h47m-47 68h47M449 469h28m-28 42h28m-28 45h28m-28 43h28" strokeWidth="12"/>
      <path d="m219 670 48-72m-48 0 48 72M450 642l26-37m-26 0 26 37" strokeWidth="5"/>
      <path d="M-55 489Q125 401 219 251M269 251Q368 566 449 430M478 430Q505 550 540 597" stroke="#c95e39" strokeWidth="3"/>
      {Array.from({length:23},(_,i)=>{const t=i/23,x=-40+t*259,y=489-238*t*t;return <path key={i} d={`M${x} ${y}V${518+x*.145}`} strokeWidth="1.6"/>})}
      {Array.from({length:22},(_,i)=>{const t=i/22,x=270+179*t,y=(1-t)*(1-t)*251+2*(1-t)*t*566+t*t*430;return <path key={i} d={`M${x} ${y}V${518+x*.145}`} strokeWidth="1.5"/>})}
      <path d="M214 672V259m49 420V257M444 650V435m31 216V433" stroke="#ed9363" strokeWidth="3"/>
      <path d="m216 261 6-16 5 16m36-1 6-17 5 17m171 176 5-12 4 12m23 0 3-12 4 12" strokeWidth="3"/>
    </g>
    <g>
      <path d="M1040 646 1054 259Q1066 127 1087 112Q1109 104 1130 113Q1148 131 1162 269L1177 646Z" fill="url(#sfGlass)" stroke="#b4aac9" strokeWidth="2"/>
      <path d="M1040 646 1054 259Q1066 127 1087 112Q1109 104 1130 113Q1148 131 1162 269L1177 646Z" fill="url(#sfGlassGrid)"/>
      {Array.from({length:15},(_,i)=>{const t=i/14;return <path key={i} d={`M${1087+t*43} 113Q${1062+t*93} 245 ${1041+t*135} 646`} fill="none" stroke={i>7?'#ffe5c4':'#c3c9df'} strokeWidth="1.25" opacity=".75"/>})}
      <path d="M1116 113Q1138 245 1148 642" stroke="#ffe2b3" strokeWidth="4" opacity=".65"/>
    </g>
    {houses.map((color,i)=><House key={color} x={572+i*87} color={color} index={i}/>)}
    <g fill="url(#sfStone)" stroke="#aa7856" strokeWidth="2">
      <path d="M1196 614h476v17h-476Z"/>
      {[1205,1237,1270,1595,1627,1658].map(x=><g key={x}><path d={`M${x} 626h13v58h-13Z`}/><path d={`M${x-4} 627h21m-21 53h21`} strokeWidth="5"/></g>)}
      <path d="M1320 508Q1333 444 1436 442Q1539 444 1553 508Z" fill="url(#sfDome)"/>
      <path d="M1313 507h248v32h-248Z"/>
      <path d="M1333 539h207v144h-207Z" fill="#9c694f"/>
      <path d="M1390 684v-91a45 45 0 0 1 90 0v91Z" fill="#694b4d"/>
      <path d="M1355 677v-90a17 24 0 0 1 34 0v90m92 0v-90a17 24 0 0 1 34 0v90" fill="#6b514e"/>
      {[1328,1353,1380,1483,1510,1536].map(x=><g key={x}><path d={`M${x} 541h15v138h-15Z`}/><path d={`M${x+4} 549v123m5-123v123`} stroke="#efd3a0"/><path d={`M${x-5} 544h25m-25-8h25m-25 144h25`} strokeWidth="6"/></g>)}
      <path d="M1303 532h267M1312 508h250M1310 688h258" stroke="#f5d5a1" strokeWidth="6"/>
      {Array.from({length:13},(_,i)=><g key={i} transform={`translate(${1322+i*18} 515)`}><path d="M0 13V0h8v13" fill="#dcb184"/><path d="m-2-8 5-7 7 7-4 8H1Z"/></g>)}
    </g>
    {Array.from({length:29},(_,i)=>{const x=i<8?510+i*22:i<15?991+(i-8)*29:1195+(i-15)*35;return <Trees key={i} x={x} y={690} scale={.4+random(i+4)*.55}/>})}
    
  </g>;
}
export default function AccentureSFHero(){
  const heroRef=useRef<HTMLElement|null>(null);
  const id=React.useId().replace(/:/g,'');
  useEffect(()=>{
    const hero=heroRef.current;
    if(!hero)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const initialTop=hero.getBoundingClientRect().top;
    let frame=0, current=0, target=0, lastTime=0;
    const paint=()=>{
      hero.style.setProperty('--sf-fog-front',`${current*1132}px`);
    };
    const tick=(time:number)=>{
      const elapsed=Math.min(50,lastTime?time-lastTime:16.7);lastTime=time;
      current+=(target-current)*(1-Math.exp(-elapsed/110));
      if(Math.abs(target-current)<.0002){current=target;frame=0;lastTime=0;paint();return}
      paint();frame=requestAnimationFrame(tick);
    };
    const update=()=>{
      const rect=hero.getBoundingClientRect();
      target=reduced.matches?0:Math.max(0,Math.min(1,(initialTop-rect.top)/(window.innerHeight*.65)));
      if(reduced.matches){cancelAnimationFrame(frame);frame=0;current=target;paint()}
      else if(!frame)frame=requestAnimationFrame(tick);
    };
    paint();
    window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);reduced.addEventListener('change',update);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update);reduced.removeEventListener('change',update)};
  },[]);
  // Keep each instance’s city and fog references independent.
  return <figure ref={heroRef} className="accentureSFHero" role="img" aria-label="San Francisco landmarks: Golden Gate Bridge, Painted Ladies, Salesforce Tower, and Palace of Fine Arts, beneath a purple Accenture mark. Fog moves right as you scroll down.">
    <svg className="accentureSFScene" viewBox="0 0 1672 735" aria-hidden="true">
      <defs>
        <linearGradient id="sfGlass"><stop stopColor="#606ca5"/><stop offset=".36" stopColor="#8e9dca"/><stop offset=".62" stopColor="#b1b0d0"/><stop offset=".84" stopColor="#ffdfb5"/><stop offset="1" stopColor="#d7afab"/></linearGradient>
        <linearGradient id="sfWindow" x2="1" y2="1"><stop stopColor="#3d5366"/><stop offset=".6" stopColor="#7c8c9c"/><stop offset="1" stopColor="#d3c3b0"/></linearGradient>
        <linearGradient id="sfStone"><stop stopColor="#b6825d"/><stop offset=".45" stopColor="#f2ca90"/><stop offset="1" stopColor="#c18c63"/></linearGradient>
        <linearGradient id="sfDome" x2=".3" y2="1"><stop stopColor="#ffe6b8"/><stop offset=".5" stopColor="#e9bf91"/><stop offset="1" stopColor="#af8580"/></linearGradient>
        <pattern id="sfGlassGrid" width="12" height="13" patternUnits="userSpaceOnUse"><path d="M0 0H12V13" fill="none" stroke="#f1d9da" strokeWidth="1" opacity=".8"/></pattern>
        <linearGradient id={`fog-density-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#f9f8fc" stopOpacity="0"/><stop offset=".24" stopColor="#f9f8fc" stopOpacity=".88"/>
          <stop offset=".5" stopColor="#fff"/><stop offset=".76" stopColor="#f0eef7" stopOpacity=".94"/><stop offset="1" stopColor="#f0eef7" stopOpacity="0"/>
        </linearGradient>
        <filter id={`fog-texture-${id}`} x="-8%" y="-60%" width="116%" height="220%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency=".007 .018" numOctaves="3" seed="17" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="48" xChannelSelector="R" yChannelSelector="G"/>
          <feGaussianBlur stdDeviation="5 9"/>
        </filter>
        <g id={`city-${id}`}><Scene/></g>
        <linearGradient id={`fog-edges-${id}`}><stop stopColor="white" stopOpacity="0"/><stop offset=".1" stopColor="white"/><stop offset=".86" stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
        <mask id={`fog-envelope-${id}`} maskUnits="userSpaceOnUse" x="0" y="210" width="540" height="300"><rect x="0" y="210" width="540" height="300" fill={`url(#fog-edges-${id})`}/></mask>
        <g id={`fog-${id}`} fill={`url(#fog-density-${id})`}>
          <path d="M0 32Q65-5 133 18T280 7T420 24T540 10V147Q470 173 390 151T245 168T110 150T0 165Z"/>
          <path d="M0 54Q91 14 170 45T338 35T540 51V131Q430 108 340 142T180 130T0 147Z" opacity=".85"/>
        </g>
      </defs>
      <path d="M461 29 1280 334v34L461 680V522l451-179L461 170Z" fill="#a55eef" opacity=".6"/>
      <use href={`#city-${id}`}/>
      <g className="sfFog sfFogFront">
        <g mask={`url(#fog-envelope-${id})`}>
          <g filter={`url(#fog-texture-${id})`}><use href={`#fog-${id}`} y="260" opacity=".78"/><use href={`#fog-${id}`} y="305"/></g>
        </g>
      </g>
    </svg>
  </figure>;
}
