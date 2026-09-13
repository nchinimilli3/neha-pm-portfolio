import React, { useEffect, useRef } from 'react';

// Decorative vector still life. All surfaces are paths, gradients, and procedural
// texture; recognition stays in accessible HTML rather than on the product.
export default function EsteeCompact(){
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
   const progress=reduced.matches?1:Math.max(0,Math.min(1,(entry-top)/(window.innerHeight*.4)));
   const eased=progress*progress*(3-2*progress);
   // Orthographic projection of a rigid lid rotating about its rear hinge.
   const angle=eased*2.0944;
   const depthX=-88*Math.cos(angle)-51*Math.sin(angle);
   const depthY=90*Math.cos(angle)-110*Math.sin(angle);
   lid.current.setAttribute('transform',`matrix(165 -28 ${depthX} ${depthY} 320 276)`);
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
   <linearGradient id="elMetal" x1="0" y1="0" x2="1" y2=".7"><stop stopColor="#554026"/><stop offset=".12" stopColor="#d2b98d"/><stop offset=".24" stopColor="#fff1d5"/><stop offset=".34" stopColor="#8a6940"/><stop offset=".48" stopColor="#e9d2a9"/><stop offset=".65" stopColor="#fff9e9"/><stop offset=".78" stopColor="#79562c"/><stop offset=".9" stopColor="#d2b887"/><stop offset="1" stopColor="#6c4d2b"/></linearGradient>
   <linearGradient id="elSide" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#6e512f"/><stop offset=".18" stopColor="#e6c99a"/><stop offset=".4" stopColor="#f5e4c7"/><stop offset=".55" stopColor="#b79761"/><stop offset=".75" stopColor="#e1c495"/><stop offset="1" stopColor="#624622"/></linearGradient>
   <linearGradient id="elGlass" x1="0" y1="0" x2="1" y2=".6"><stop stopColor="#b0ada4"/><stop offset=".22" stopColor="#e3e0d5"/><stop offset=".38" stopColor="#fffdf3"/><stop offset=".5" stopColor="#c3c1b7"/><stop offset=".68" stopColor="#f9f7ed"/><stop offset="1" stopColor="#b3b3a9"/></linearGradient>
   <radialGradient id="elPowder" cx=".4" cy=".25" r=".8"><stop stopColor="#e5c19b"/><stop offset=".7" stopColor="#caa079"/><stop offset="1" stopColor="#b88d62"/></radialGradient>
   <linearGradient id="elWindow" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".8"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
   <filter id="elContact" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="12"/></filter>
   <filter id="elGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="8"/><feColorMatrix type="saturate" values="0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
   <clipPath id="elMirrorClip"><ellipse cx="321" cy="188" rx="126" ry="151" transform="rotate(-23 321 188)"/></clipPath>
   <clipPath id="elPowderClip"><ellipse cx="232" cy="357" rx="156" ry="91" transform="rotate(-12 232 357)"/></clipPath>
  </defs>
  <ellipse cx="280" cy="462" rx="185" ry="24" fill="#493722" opacity=".15" filter="url(#elContact)"/>
  {/* Lower shell thickness shares the same tilted ellipse as the powder well. */}
  <g transform="rotate(-12 232 357)">
   <path d="M47 356C47 287 417 287 417 356L417 380C410 443 314 476 232 476S54 443 47 380Z" fill="url(#elSide)" stroke="#a18050" strokeWidth="1"/>
   <ellipse cx="232" cy="357" rx="185" ry="113" fill="url(#elMetal)" stroke="#f4e2bd" strokeWidth="2"/>
   <ellipse cx="232" cy="357" rx="175" ry="104" fill="none" stroke="#fff8e6" strokeWidth="2"/>
   <ellipse cx="232" cy="357" rx="165" ry="97" fill="#654c31"/>
   <ellipse cx="232" cy="359" rx="161" ry="94" fill="#f1d4a6"/>
   <ellipse cx="232" cy="357" rx="156" ry="91" fill="url(#elPowder)" stroke="#ac8056" strokeWidth="1.5"/>
   <path d="M64 395C104 453 332 477 408 397" fill="none" stroke="#fff0ce" strokeOpacity=".65" strokeWidth="1.5"/>
   <rect x="215" y="461" width="35" height="7" rx="2" fill="#8c6a3e" stroke="#eed4a9"/>
  </g>
  <g clipPath="url(#elPowderClip)" opacity=".2"><rect x="40" y="235" width="390" height="240" filter="url(#elGrain)" fill="#b9946e"/></g>
  {/* Rigid lid: one projected plane, with an outer shell and mirrored inner face. */}
  <g ref={lid} transform="matrix(165 -28 0 -140 320 276)">
   <ellipse cx="0" cy="1" rx="1" ry="1" fill="url(#elMetal)"/>
   <ellipse cx="0" cy="1" rx=".973" ry=".973" fill="none" stroke="#fff0d1" strokeWidth=".012"/>
   <g ref={lidFace} opacity="0">
    <ellipse cx="0" cy="1" rx=".945" ry=".945" fill="url(#elSide)"/>
    <ellipse cx="0" cy="1" rx=".89" ry=".89" fill="none" stroke="#fff0d1" strokeOpacity=".55" strokeWidth=".006"/>
   </g>
   <g ref={lidMirror}>
    <ellipse cx="0" cy="1" rx=".935" ry=".935" fill="#6b5940"/>
    <ellipse cx="0" cy="1" rx=".91" ry=".91" fill="url(#elGlass)"/>
    <path d="M-.5 .32L-.29 .19 .48 1.7 .29 1.83Z" fill="url(#elWindow)" opacity=".65"/>
    <ellipse cx="0" cy=".21" rx=".46" ry=".1" fill="#a58c6a" opacity=".25"/>
   </g>
  </g>
  {/* Small barrel hinge sits where the two physical surfaces meet. */}
  <g transform="rotate(18 324 276)"><rect x="288" y="266" width="69" height="18" rx="5" fill="url(#elMetal)" stroke="#886a42"/><path d="M296 269V281M349 269V281" stroke="#fff0d2" strokeWidth="2"/><path d="M302 268H342" stroke="#fff4de" strokeWidth="2"/></g>
 </svg>
}
