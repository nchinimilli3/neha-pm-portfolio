import React from 'react';

// Decorative vector still life. All surfaces are paths, gradients, and procedural
// texture; recognition stays in accessible HTML rather than on the product.
export default function EsteeCompact(){
 return <svg className="elCompactArtwork" viewBox="0 0 520 520" aria-hidden="true" focusable="false">
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
  {/* Lid thickness, rolled gold rim, and mirror bevel. */}
  <ellipse cx="326" cy="190" rx="142" ry="165" transform="rotate(-23 326 190)" fill="#705331"/>
  <ellipse cx="321" cy="186" rx="142" ry="165" transform="rotate(-23 321 186)" fill="url(#elMetal)" stroke="#e7cfa4" strokeWidth="1.5"/>
  <ellipse cx="321" cy="187" rx="135" ry="158" transform="rotate(-23 321 187)" fill="none" stroke="#fff6df" strokeWidth="2"/>
  <ellipse cx="321" cy="188" rx="128" ry="153" transform="rotate(-23 321 188)" fill="#695c46"/>
  <ellipse cx="321" cy="188" rx="126" ry="151" transform="rotate(-23 321 188)" fill="url(#elGlass)"/>
  <g clipPath="url(#elMirrorClip)">
   <path d="M191 27L238 18 355 320 303 342Z M255 9L283 4 404 303 373 316Z" fill="url(#elWindow)"/>
   <ellipse cx="300" cy="318" rx="103" ry="37" transform="rotate(12 300 318)" fill="#958468" opacity=".52"/>
   <ellipse cx="300" cy="314" rx="96" ry="30" transform="rotate(12 300 314)" fill="#ddd0b8"/>
   <ellipse cx="300" cy="317" rx="83" ry="24" transform="rotate(12 300 317)" fill="#c7aa88"/>
  </g>
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
  {/* Small barrel hinge sits where the two physical surfaces meet. */}
  <g transform="rotate(18 324 276)"><rect x="288" y="266" width="69" height="18" rx="5" fill="url(#elMetal)" stroke="#886a42"/><path d="M296 269V281M349 269V281" stroke="#fff0d2" strokeWidth="2"/><path d="M302 268H342" stroke="#fff4de" strokeWidth="2"/></g>
 </svg>
}
