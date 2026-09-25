import React from 'react';

/* About me as the other corner of the room. The bookshelf, the corkboard of
   film prints, and the TV open the same takeovers the words in the copy do;
   the couch, the cookie tray, and the hiking boots are just there, like in
   real life. Hotspots are real buttons over the drawing. */

const asset=(src:string)=>{const clean=src.replace(/^\/+/,'');return import.meta.env.DEV?`/${clean}`:`${import.meta.env.BASE_URL}${clean}`};
type View='film'|'books'|'tv';

const SPINES=[['#6d2631',44],['#264a3f',38],['#b6863a',42],['#28314f',36],['#d9cdb8',32],['#9c4f3f',40],['#3d5a80',34],['#e3a88f',30],['#5c8a5a',42],['#8a5aa0',36],['#c0504d',40],['#e8dcc4',34]];

export default function AboutCorner({onOpen}:{onOpen:(v:View)=>void}){
 const shelves=[118,178,238,298];
 return <div className="aboutCorner">
  <svg viewBox="0 0 400 500" aria-hidden="true">
   <defs>
    <linearGradient id="acWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f1e6d6"/><stop offset="1" stopColor="#e4d4bd"/></linearGradient>
    <linearGradient id="acFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b98a5c"/><stop offset="1" stopColor="#8f643c"/></linearGradient>
    <linearGradient id="acCouch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7d9a84"/><stop offset="1" stopColor="#5b7863"/></linearGradient>
    <linearGradient id="acTv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f7a9c0"/><stop offset=".55" stopColor="#b0406a"/><stop offset="1" stopColor="#4a2a5c"/></linearGradient>
    <radialGradient id="acTvGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#f39ab8" stopOpacity=".55"/><stop offset="1" stopColor="#f39ab8" stopOpacity="0"/></radialGradient>
    <clipPath id="acPhoto"><rect x="176" y="62" width="96" height="72"/></clipPath>
    {[0,1,2].map(i=><clipPath key={i} id={`acPrint${i}`}><rect x={186+i*38} y="184" width="28" height="26"/></clipPath>)}
   </defs>
   {/* room */}
   <rect width="400" height="360" fill="url(#acWall)"/>
   <rect x="0" y="352" width="400" height="10" fill="#efe6d8"/><rect x="0" y="360" width="400" height="140" fill="url(#acFloor)"/>
   {Array.from({length:7},(_,i)=><path key={i} d={`M${i*70-40} 500L${140+i*28} 360`} stroke="#7a5433" strokeOpacity=".28"/>)}
   <path d="M0 404H400M0 452H400" stroke="#7a5433" strokeOpacity=".18"/>
   <ellipse cx="310" cy="400" rx="120" ry="40" fill="url(#acTvGlow)" className="acGlow"/>

   {/* bookshelf */}
   <g className="acShelf">
    <rect x="16" y="70" width="124" height="298" fill="#8a6240"/><rect x="22" y="76" width="112" height="286" fill="#6e4d31"/>
    {shelves.map((y,s)=><g key={y}>
     {SPINES.slice((s*3)%9,(s*3)%9+5).map(([c,h],i)=><rect key={i} x={26+i*20+(s%2)*4} y={y-Number(h)} width={17} height={Number(h)} fill={c as string} rx="1.5"/>)}
     <rect x="22" y={y} width="112" height="6" fill="#9b7150"/>
    </g>)}
    <rect x="22" y="304" width="112" height="6" fill="#9b7150"/>
    <path d="M96 60q10-26 24-18q-12 6-14 18M98 60q-6-24-22-20q12 6 16 20" fill="#5f8a57"/><rect x="92" y="58" width="16" height="12" rx="2" fill="#d9c2a4"/>
   </g>

   {/* the lakefront photo, framed */}
   <rect x="170" y="56" width="108" height="84" fill="#2f2a26"/><rect x="173" y="59" width="102" height="78" fill="#f7f2e8"/>
   <image href={asset('about-lakefront.webp')} x="176" y="62" width="96" height="72" preserveAspectRatio="xMidYMid slice" clipPath="url(#acPhoto)"/>

   {/* corkboard of film prints */}
   <g className="acCork">
    <rect x="176" y="170" width="128" height="58" rx="2" fill="#c99d6c" stroke="#7a5a3c" strokeWidth="4"/>
    {['project-media/about-film/01.jpg','project-media/about-film/06.jpg','project-media/about-film/10.jpg'].map((src,i)=><g key={src} transform={`rotate(${[-5,3,-2][i]} ${200+i*38} 197)`}><rect x={183+i*38} y="181" width="34" height="40" fill="#fffdf8"/><image href={asset(src)} x={186+i*38} y="184" width="28" height="26" preserveAspectRatio="xMidYMid slice" clipPath={`url(#acPrint${i})`}/><circle cx={200+i*38} cy="182" r="2.2" fill="#d14b34"/></g>)}
   </g>

   {/* TV on a low console, with a cookie tray */}
   <g className="acTvSet">
    <rect x="236" y="300" width="152" height="54" rx="3" fill="#a07650"/><rect x="242" y="318" width="68" height="30" rx="2" fill="#8a6240"/><rect x="316" y="318" width="66" height="30" rx="2" fill="#8a6240"/>
    <rect x="250" y="222" width="126" height="74" rx="4" fill="#161618"/><rect x="255" y="227" width="116" height="64" rx="1.5" fill="url(#acTv)" className="acScreen"/>
    <text x="313" y="263" textAnchor="middle" fontFamily="'Instrument Serif',Georgia,serif" fontSize="15" fill="#fff">Vanderpump</text>
    <rect x="304" y="296" width="18" height="5" fill="#161618"/>
   </g>
   <g><ellipse cx="366" cy="300" rx="20" ry="4" fill="#c9c6bf"/>{[354,366,378].map(x=><circle key={x} cx={x} cy="296" r="5" fill="#c48a4e"/>)}</g>

   {/* couch and throw */}
   <g>
    <rect x="96" y="376" width="200" height="66" rx="14" fill="url(#acCouch)"/>
    <rect x="84" y="360" width="30" height="80" rx="12" fill="#6d8a74"/><rect x="278" y="360" width="30" height="80" rx="12" fill="#6d8a74"/>
    <rect x="110" y="344" width="172" height="46" rx="12" fill="#86a38d"/>
    <rect x="124" y="352" width="40" height="30" rx="8" fill="#f1d9a8" transform="rotate(-8 144 367)"/><rect x="224" y="352" width="40" height="30" rx="8" fill="#e7a99b" transform="rotate(7 244 367)"/>
    <path d="M186 376h60v52q-30 8-60 0Z" fill="#d9c7a8"/><path d="M186 392h60M186 408h60" stroke="#c4ae8a"/>
    <rect x="104" y="440" width="8" height="12" fill="#4a3a2c"/><rect x="280" y="440" width="8" height="12" fill="#4a3a2c"/>
   </g>

   {/* hiking boots by the mat */}
   <g transform="translate(318 446)">
    <rect x="0" y="30" width="72" height="16" rx="3" fill="#8e6c4a" opacity=".6"/>
    <path d="M8 6h14l2 22h10q4 0 4 6v4H6Z" fill="#6b4a2e"/><path d="M36 4h14l2 24h10q4 0 4 6v4H34Z" fill="#7a5636"/>
    <path d="M10 12h10M10 18h10M38 10h10M38 16h10" stroke="#e6c38a" strokeWidth="1.4"/>
    <rect x="6" y="36" width="32" height="4" rx="1" fill="#2e2016"/><rect x="34" y="36" width="32" height="4" rx="1" fill="#2e2016"/>
   </g>
  </svg>
  <button type="button" className="acHot acHotShelf" onClick={()=>onOpen('books')} aria-label="Open my bookshelf"><span>my shelf</span></button>
  <button type="button" className="acHot acHotFilm" onClick={()=>onOpen('film')} aria-label="See my film photos"><span>film photos</span></button>
  <button type="button" className="acHot acHotTv" onClick={()=>onOpen('tv')} aria-label="Turn on the reality TV"><span>reality tv</span></button>
 </div>
}
