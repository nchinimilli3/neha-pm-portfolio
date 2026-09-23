import React, { useEffect, useRef } from 'react';

// Decorative vector still life. All surfaces are paths, gradients, and procedural
// texture; recognition stays in accessible HTML rather than on the product.
export default function EsteeCompact(){
 // Per-instance gradient ids: this artwork can be on the page more than once.
 const _u = React.useId().replace(/:/g, '');
 const scene=useRef<SVGSVGElement>(null);
 const lid=useRef<SVGGElement>(null);
 const lidFace=useRef<SVGGElement>(null);
 const lidMirror=useRef<SVGGElement>(null);
 useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const update=()=>{
   frame=0;
   if(!scene.current||!lid.current)return;
   const {top,height}=scene.current.getBoundingClientRect();
   const entry=window.innerHeight*.92-height*.7;
   const bottomTop=top+window.scrollY-(document.documentElement.scrollHeight-window.innerHeight);
   const travel=Math.max(1,Math.min(window.innerHeight*.4,entry-bottomTop-16));
   const progress=reduced.matches?1:Math.max(0,Math.min(1,(entry-top)/travel));
   const eased=progress*progress*(3-2*progress);
   // Orthographic projection of a rigid lid rotating about its rear hinge.
   const angle=eased*2.0944;
   const depthX=-70.2*Math.cos(angle)-18.6*Math.sin(angle);
   const depthY=114.9*Math.cos(angle)-89.55*Math.sin(angle);
   lid.current.setAttribute('transform',`matrix(168.3 22.1 ${depthX} ${depthY} 302.2 242.1)`);
   const mirrorVisible=depthY<0;
   lidFace.current?.setAttribute('opacity',mirrorVisible?'0':'1');
   lidMirror.current?.setAttribute('opacity',mirrorVisible?'1':'0');
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  reduced.addEventListener('change',schedule);
  return ()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule)};
 },[]);
 return <svg ref={scene} className="elCompactArtwork" viewBox="0 -40 520 560" aria-hidden="true" focusable="false">
  <defs>
   <radialGradient id={`elClosedGold${_u}`} cx=".32" cy=".23" r=".95"><stop stopColor="#f3e1b9"/><stop offset=".4" stopColor="#d2b783"/><stop offset=".75" stopColor="#ad8f5a"/><stop offset="1" stopColor="#735832"/></radialGradient>
   <pattern id={`elBrushed${_u}`} width=".03" height=".017" patternUnits="userSpaceOnUse" patternTransform="rotate(12)"><path d="M0 .002H.03M.008 .011H.027" stroke="#fff7df" strokeWidth=".002" opacity=".3"/><path d="M0 .007H.024" stroke="#5a442c" strokeWidth=".001" opacity=".3"/></pattern>
   <linearGradient id={`elMetal${_u}`} x1="0" y1="0" x2="1" y2=".7"><stop stopColor="#554026"/><stop offset=".12" stopColor="#d2b98d"/><stop offset=".24" stopColor="#fff1d5"/><stop offset=".34" stopColor="#8a6940"/><stop offset=".48" stopColor="#e9d2a9"/><stop offset=".65" stopColor="#fff9e9"/><stop offset=".78" stopColor="#79562c"/><stop offset=".9" stopColor="#d2b887"/><stop offset="1" stopColor="#6c4d2b"/></linearGradient>
   <linearGradient id={`elSide${_u}`} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#6e512f"/><stop offset=".18" stopColor="#e6c99a"/><stop offset=".4" stopColor="#f5e4c7"/><stop offset=".55" stopColor="#b79761"/><stop offset=".75" stopColor="#e1c495"/><stop offset="1" stopColor="#624622"/></linearGradient>
   <linearGradient id={`elGlass${_u}`} x1="0" y1="0" x2="1" y2=".6"><stop stopColor="#b0ada4"/><stop offset=".22" stopColor="#e3e0d5"/><stop offset=".38" stopColor="#fffdf3"/><stop offset=".5" stopColor="#c3c1b7"/><stop offset=".68" stopColor="#f9f7ed"/><stop offset="1" stopColor="#b3b3a9"/></linearGradient>
   <radialGradient id={`elPowder${_u}`} cx=".4" cy=".25" r=".8"><stop stopColor="#e5c19b"/><stop offset=".7" stopColor="#caa079"/><stop offset="1" stopColor="#b88d62"/></radialGradient>
   <linearGradient id={`elWindow${_u}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".8"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
   <filter id={`elContact${_u}`} x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="12"/></filter>
   <filter id={`elGrain${_u}`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="8"/><feColorMatrix type="saturate" values="0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
   <clipPath id={`elMirrorClip${_u}`}><ellipse cx="321" cy="188" rx="126" ry="151" transform="rotate(-23 321 188)"/></clipPath>
   <clipPath id={`elPowderClip${_u}`}><ellipse cx="232" cy="357" rx="156" ry="91" transform="rotate(-12 232 357)"/></clipPath>
  </defs>
  <ellipse cx="280" cy="462" rx="185" ry="24" fill="#493722" opacity=".15" filter={`url(#elContact${_u})`}/>
  {/* Lower shell thickness shares the same tilted ellipse as the powder well. */}
  <g transform="rotate(-12 232 357)">
   <path d="M47 356C47 287 417 287 417 356L417 380C410 443 314 476 232 476S54 443 47 380Z" fill={`url(#elSide${_u})`} stroke="#a18050" strokeWidth="1"/>
   <ellipse cx="232" cy="357" rx="185" ry="113" fill={`url(#elMetal${_u})`} stroke="#f4e2bd" strokeWidth="2"/>
   <ellipse cx="232" cy="357" rx="175" ry="104" fill="none" stroke="#fff8e6" strokeWidth="2"/>
   <ellipse cx="232" cy="357" rx="165" ry="97" fill="#654c31"/>
   <ellipse cx="232" cy="359" rx="161" ry="94" fill="#f1d4a6"/>
   <ellipse cx="232" cy="357" rx="156" ry="91" fill={`url(#elPowder${_u})`} stroke="#ac8056" strokeWidth="1.5"/>
   <path d="M64 395C104 453 332 477 408 397" fill="none" stroke="#fff0ce" strokeOpacity=".65" strokeWidth="1.5"/>
   <rect x="215" y="461" width="35" height="7" rx="2" fill="#8c6a3e" stroke="#eed4a9"/>
  </g>
  <g clipPath={`url(#elPowderClip${_u})`} opacity=".2"><rect x="40" y="235" width="390" height="240" filter={`url(#elGrain${_u})`} fill="#b9946e"/></g>
  {/* Rigid lid: one projected plane, with an outer shell and mirrored inner face. */}
  <g ref={lid} transform="matrix(168.3 22.1 19 -135 302.2 242.1)">
   <ellipse cx="0" cy="1" rx="1" ry="1" fill={`url(#elMetal${_u})`}/>
   <ellipse cx="0" cy="1" rx=".973" ry=".973" fill="none" stroke="#fff0d1" strokeWidth=".012"/>
   <g ref={lidFace} opacity="0">
    <ellipse cx="0" cy="1.015" rx="1" ry="1" fill="#4e3a23"/>
    <ellipse cx="0" cy=".985" rx="1" ry="1" fill={`url(#elMetal${_u})`}/>
    <ellipse cx="0" cy=".98" rx=".958" ry=".958" fill={`url(#elClosedGold${_u})`}/>
    <ellipse cx="0" cy=".98" rx=".953" ry=".953" fill={`url(#elBrushed${_u})`}/>
    <ellipse cx="0" cy=".985" rx=".98" ry=".98" fill="none" stroke="#fff0d1" strokeOpacity=".65" strokeWidth=".007"/>
   </g>
   <g ref={lidMirror}>
    <ellipse cx="0" cy="1" rx=".935" ry=".935" fill="#6b5940"/>
    <ellipse cx="0" cy="1" rx=".91" ry=".91" fill={`url(#elGlass${_u})`}/>
    <path d="M-.5 .32L-.29 .19 .48 1.7 .29 1.83Z" fill={`url(#elWindow${_u})`} opacity=".65"/>
    <ellipse cx="0" cy=".21" rx=".46" ry=".1" fill="#a58c6a" opacity=".25"/>
   </g>
  </g>
  {/* Small barrel hinge sits where the two physical surfaces meet. */}
  <g transform="translate(-22 -34) rotate(8 324 276)"><rect x="288" y="266" width="69" height="18" rx="5" fill={`url(#elMetal${_u})`} stroke="#886a42"/><path d="M296 269V281M349 269V281" stroke="#fff0d2" strokeWidth="2"/><path d="M302 268H342" stroke="#fff4de" strokeWidth="2"/></g>
 </svg>
}
