/* About me as the other corner of the room, drawn with the same light and materials as the desk:
   window light from the right, plaster walls, oak floor, soft contact shadows. The bookshelf, the
   framed photo and corkboard of film prints, and the TV open the same takeovers the words in the
   copy do; the couch and rug are just there, like in real life. Hotspots are real buttons. */

const asset=(src:string)=>{const clean=src.replace(/^\/+/,'');return import.meta.env.DEV?`/${clean}`:`${import.meta.env.BASE_URL}${clean}`};
type View='film'|'books'|'tv';

// [colour, height, width] per book, per shelf. The last shelf ends in a small horizontal stack.
const SHELVES:{y:number;books:[string,number,number][];lean?:boolean;stack?:boolean}[]=[
 {y:118,books:[['#6d2631',46,14],['#264a3f',40,12],['#b6863a',44,16],['#28314f',38,11],['#d9cdb8',34,13]],lean:true},
 {y:178,books:[['#28314f',42,12],['#e3d6bd',36,15],['#9c4f3f',48,13],['#3d5a80',40,14],['#e3a88f',34,12],['#5a4a3c',44,10]]},
 {y:238,books:[['#3d5a80',38,13],['#e3a88f',32,12],['#5c8a5a',46,14],['#8a5aa0',40,12],['#c0504d',44,13]],lean:true},
 {y:298,books:[['#6d2631',44,13],['#264a3f',40,12],['#b6863a',42,15]],stack:true},
];

export default function AboutCorner({onOpen}:{onOpen:(v:View)=>void}){
 return <div className="aboutCorner">
  <svg viewBox="0 0 400 500" aria-hidden="true">
   <defs>
    <linearGradient id="acWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0e5d4"/><stop offset="1" stopColor="#e2d1b8"/></linearGradient>
    <linearGradient id="acFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a87b50"/><stop offset="1" stopColor="#86592f"/></linearGradient>
    <linearGradient id="acWood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7c5434"/><stop offset=".5" stopColor="#8f6440"/><stop offset="1" stopColor="#744d2f"/></linearGradient>
    <linearGradient id="acWalnut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5031"/><stop offset="1" stopColor="#5a3820"/></linearGradient>
    <linearGradient id="acSofa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8aa892"/><stop offset="1" stopColor="#5f7c67"/></linearGradient>
    <linearGradient id="acSofaDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#779580"/><stop offset="1" stopColor="#4f6a57"/></linearGradient>
    <linearGradient id="acSpine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity=".22"/><stop offset=".3" stopColor="#fff" stopOpacity=".12"/><stop offset=".55" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".25"/></linearGradient>
    <linearGradient id="acTv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f7a9c0"/><stop offset=".55" stopColor="#b0406a"/><stop offset="1" stopColor="#4a2a5c"/></linearGradient>
    <radialGradient id="acBias" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#f39ab8" stopOpacity=".5"/><stop offset="1" stopColor="#f39ab8" stopOpacity="0"/></radialGradient>
    <linearGradient id="acSun" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6dc" stopOpacity=".55"/><stop offset="1" stopColor="#fff6dc" stopOpacity="0"/></linearGradient>
    <filter id="acPlaster" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .4 0 0 0 0 .3 0 0 0 .5 -.2"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="acGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".02 .6" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 .25 0 0 0 0 .14 0 0 0 0 .05 0 0 0 .8 -.3"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="acCorkTex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="2"/><feColorMatrix values="0 0 0 0 .4 0 0 0 0 .25 0 0 0 0 .1 0 0 0 1.3 -.55"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="acWeave" x="0" y="0" width="100%" height="100%"><feTurbulence type="turbulence" baseFrequency=".35 .9" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .45 0 0 0 0 .33 0 0 0 0 .18 0 0 0 1 -.35"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="acSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="acSofter" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
    <clipPath id="acPhoto"><rect x="180" y="66" width="88" height="62"/></clipPath>
    {[0,1,2].map(i=><clipPath key={i} id={`acPrint${i}`}><rect x={187+i*38} y="182" width="28" height="26"/></clipPath>)}
   </defs>

   {/* Room: plaster wall, window light from the right, baseboard, oak planks. */}
   <rect width="400" height="362" fill="url(#acWall)"/>
   <rect width="400" height="362" fill="#fff" filter="url(#acPlaster)" opacity=".35"/>
   <path d="M400 28 318 64 292 300 400 262Z" fill="url(#acSun)" filter="url(#acSoft)"/>
   <rect x="0" y="362" width="400" height="138" fill="url(#acFloor)"/>
   <rect x="0" y="362" width="400" height="138" fill="#fff" filter="url(#acGrain)" opacity=".5"/>
   {Array.from({length:9},(_,i)=><path key={i} d={`M${i*62-80} 500L${118+i*22} 362`} stroke="#5e3d20" strokeOpacity=".35" strokeWidth=".8"/>)}
   <path d="M0 392H400M0 432H400M0 478H400" stroke="#5e3d20" strokeOpacity=".2" strokeWidth=".8"/>
   <path d="M400 380 250 500H400Z" fill="#fff4d8" opacity=".14" filter="url(#acSoft)"/>
   <rect x="0" y="350" width="400" height="12" fill="#efe6d7"/><rect x="0" y="350" width="400" height="1.5" fill="#fff" opacity=".7"/>
   <rect x="0" y="361" width="400" height="6" fill="#3a2410" opacity=".22" filter="url(#acSoft)"/>

   {/* Jute rug under the couch. */}
   <path d="M34 418H366L398 492H2Z" fill="#cdb38b"/>
   <path d="M34 418H366L398 492H2Z" fill="#fff" filter="url(#acWeave)" opacity=".6"/>
   <path d="M40 424H360L390 486H10Z" fill="none" stroke="#b39468" strokeWidth="1.2" strokeDasharray="3 2"/>

   {/* Bookshelf, with its side showing, a trailing pothos on top. */}
   <g className="acShelf">
    <ellipse cx="82" cy="370" rx="70" ry="6" fill="#2e1b0c" opacity=".35" filter="url(#acSoft)"/>
    <path d="M140 64 150 60V364L140 370Z" fill="#5f3f25"/>
    <rect x="14" y="64" width="126" height="306" fill="url(#acWood)"/>
    <rect x="21" y="71" width="112" height="232" fill="#4a301b"/>
    <rect x="21" y="71" width="112" height="232" fill="#fff" filter="url(#acGrain)" opacity=".25"/>
    {SHELVES.map(({y,books,lean,stack})=>{let x=25;return <g key={y}>
     <rect x="21" y={y-60} width="112" height="10" fill="#000" opacity=".22" filter="url(#acSoft)"/>
     {books.map(([c,h,w],i)=>{const bx=x;x+=w+1.5;return <g key={i}><rect x={bx} y={y-h} width={w} height={h} rx="1.2" fill={c}/><rect x={bx} y={y-h} width={w} height={h} rx="1.2" fill="url(#acSpine)"/><path d={`M${bx+2} ${y-h+6}h${w-4}M${bx+2} ${y-8}h${w-4}`} stroke="#f3e2b8" strokeOpacity=".45" strokeWidth=".8"/></g>})}
     {lean&&<g transform={`rotate(14 ${x} ${y})`}><rect x={x} y={y-40} width="12" height="40" rx="1.2" fill="#d6c7a6"/><rect x={x} y={y-40} width="12" height="40" rx="1.2" fill="url(#acSpine)"/></g>}
     {stack&&<g>{[['#e3d6bd',34],['#9c4f3f',30],['#3d5a80',36]].map(([c,w],i)=><rect key={i} x={86+(i%2)*3} y={y-7-i*7} width={Number(w)} height="6.5" rx="1" fill={c as string}/>)}<path d="M112 277c-4 0-6 3-6 7v6h14v-6c0-4-3-7-8-7z" fill="#e9e1d2"/><path d="M109 280c1-2 5-2 6 0" stroke="#fff" strokeWidth="1" fill="none"/></g>}
     <rect x="21" y={y} width="112" height="6" fill="#a47a52"/><rect x="21" y={y} width="112" height="1.2" fill="#c89a6b"/>
    </g>})}
    <rect x="21" y="304" width="112" height="60" fill="#7a5434"/>
    <rect x="25" y="308" width="51" height="52" rx="1.5" fill="#86603d" stroke="#6a4829"/><rect x="78" y="308" width="51" height="52" rx="1.5" fill="#86603d" stroke="#6a4829"/>
    <rect x="70" y="330" width="3" height="10" rx="1" fill="#d8c29a"/><rect x="81" y="330" width="3" height="10" rx="1" fill="#d8c29a"/>
    <path d="M92 62h18l-2 10H94Z" fill="#e8ddcb"/><path d="M92 62h18" stroke="#fff" strokeWidth="1"/>
    <g fill="none" stroke="#4e7442" strokeWidth="1.3"><path d="M96 64c-10 6-18 20-20 40s-2 40 2 56"/><path d="M106 64c8 8 14 24 18 44"/><path d="M100 60c-2-10 4-16 12-18"/></g>
    {[[88,74],[80,92],[77,112],[76,132],[79,152],[114,78],[120,96],[123,110],[104,48],[96,52]].map(([x,y],i)=><path key={i} d={`M${x} ${y}c-5-3-7-8-3-11 3 2 5 6 3 11z`} fill={i%3?'#6b9a58':'#8ab56e'} stroke="#4e7442" strokeWidth=".5" transform={`rotate(${(i%2?30:-30)} ${x} ${y})`}/>)}
   </g>

   {/* The lakefront photo: black frame, white mat, glass glare, a shadow on the wall. */}
   <rect x="170" y="58" width="108" height="84" fill="#2a1a0c" opacity=".35" filter="url(#acSoft)" transform="translate(-4 6)"/>
   <rect x="168" y="54" width="112" height="86" rx="1.5" fill="#1f1c1a"/>
   <rect x="171" y="57" width="106" height="80" fill="#34302c"/>
   <rect x="174" y="60" width="100" height="74" fill="#f8f4ea"/>
   <image href={asset('about-lakefront.webp')} x="180" y="66" width="88" height="62" preserveAspectRatio="xMidYMid slice" clipPath="url(#acPhoto)"/>
   <path d="M174 60 214 60 184 134H174Z" fill="#fff" opacity=".12"/>

   {/* Corkboard of film prints, pinned. */}
   <g className="acCork">
    <rect x="178" y="172" width="128" height="60" rx="2" fill="#2a1a0c" opacity=".3" filter="url(#acSoft)" transform="translate(-4 6)"/>
    <rect x="176" y="168" width="128" height="60" rx="2" fill="#6f4f32"/>
    <rect x="180" y="172" width="120" height="52" fill="#c89c69"/>
    <rect x="180" y="172" width="120" height="52" fill="#fff" filter="url(#acCorkTex)" opacity=".7"/>
    {['project-media/about-film/01.jpg','project-media/about-film/06.jpg','project-media/about-film/10.jpg'].map((src,i)=><g key={src} transform={`rotate(${[-5,3,-2][i]} ${201+i*38} 196)`}>
     <rect x={183+i*38} y="180" width="36" height="42" fill="#2a1a0c" opacity=".35" filter="url(#acSoft)" transform="translate(-2 3)"/>
     <rect x={184+i*38} y="179" width="34" height="40" fill="#fffdf8"/>
     <image href={asset(src)} x={187+i*38} y="182" width="28" height="26" preserveAspectRatio="xMidYMid slice" clipPath={`url(#acPrint${i})`}/>
     <circle cx={201+i*38} cy="181" r="2.4" fill="#c0392b"/><circle cx={200.3+i*38} cy="180.3" r=".8" fill="#fff" opacity=".7"/>
    </g>)}
   </g>

   {/* Walnut media console on tapered legs, a thin TV with the show on, bias glow on the wall. */}
   <g className="acTvSet">
    <ellipse cx="314" cy="252" rx="92" ry="62" fill="url(#acBias)" className="acGlow"/>
    <ellipse cx="312" cy="368" rx="84" ry="6" fill="#2e1b0c" opacity=".4" filter="url(#acSoft)"/>
    <path d="M246 342l-4 24h4l6-24zM378 342l4 24h-4l-6-24z" fill="#3a2414"/>
    <rect x="232" y="300" width="160" height="44" rx="3" fill="url(#acWalnut)"/>
    <rect x="232" y="300" width="160" height="44" rx="3" fill="#fff" filter="url(#acGrain)" opacity=".3"/>
    <rect x="232" y="300" width="160" height="2" rx="1" fill="#a2734a"/>
    {Array.from({length:14},(_,i)=><rect key={i} x={240+i*10.8} y="308" width="7.5" height="30" rx="1" fill="#4d2f19" opacity=".55"/>)}
    <path d="M292 300l-6-4h10zM332 300l6-4h-10z" fill="#1b1b1d"/>
    <rect x="250" y="222" width="126" height="74" rx="2" fill="#0f0f11"/>
    <rect x="252.5" y="224.5" width="121" height="69" rx="1" fill="url(#acTv)" className="acTvScreen"/>
    <text x="313" y="263" textAnchor="middle" fontFamily="'Instrument Serif',Georgia,serif" fontSize="15" fill="#fff">Vanderpump</text>
    <path d="M253 225h44l-22 68h-22Z" fill="#fff" opacity=".07"/>
   </g>

   {/* The sofa faces the TV, so from here we see its back: the upholstered back panel and arms,
       cushions and pillows peeking over the top, and the throw hanging down the back. */}
   <g>
    <ellipse cx="196" cy="454" rx="120" ry="9" fill="#2e1b0c" opacity=".45" filter="url(#acSoft)"/>
    <path d="M108 440l-3 16h4l6-16zM284 440l3 16h-4l-6-16z" fill="#3a2414"/>
    <path d="M122 338q24-12 70-4q4 2 4 10H116q0-4 6-6z" fill="#8fae98"/>
    <path d="M200 334q46-8 70 4q6 2 6 6H196q0-8 4-10z" fill="#8fae98"/>
    <g transform="rotate(-8 150 336)"><path d="M128 344q2-16 22-18t24 16z" fill="#dcb04a"/><path d="M132 340q16-8 38 0" stroke="#b88d2c" strokeWidth="1" fill="none"/></g>
    <g transform="rotate(7 246 336)"><path d="M224 344q2-16 22-18t24 16z" fill="#e2a596"/><path d="M228 340q16-8 38 0" stroke="#c07f70" strokeWidth="1" fill="none"/></g>
    <rect x="80" y="360" width="34" height="84" rx="15" fill="url(#acSofaDark)"/>
    <rect x="278" y="360" width="34" height="84" rx="15" fill="url(#acSofaDark)"/>
    <rect x="102" y="342" width="188" height="102" rx="12" fill="url(#acSofa)"/>
    <path d="M108 350q88-8 176 0" stroke="#b4cdb9" strokeOpacity=".7" strokeWidth="2" fill="none"/>
    <path d="M196 348v94M150 350v92M242 350v92" stroke="#58755f" strokeOpacity=".35" strokeWidth="1"/>
    <rect x="102" y="430" width="188" height="14" rx="6" fill="#4f6a57" opacity=".55"/>
    <path d="M86 368q11-5 22 0M284 368q11-5 22 0" stroke="#a9c3b0" strokeOpacity=".55" strokeWidth="1.5" fill="none"/>
    <path d="M222 342q30-4 50 2v70q-10 8-24 6-12-2-26-8z" fill="#efe4cf"/>
    <path d="M230 346v64M242 344v70M254 344v70M266 346v64" stroke="#d9c9ab" strokeWidth="1.1"/>
    <path d="M224 412l-1 7M231 414l-1 7M238 416l0 7M245 417l0 7M252 417l1 7M259 416l1 7M266 413l1 7" stroke="#d9c9ab" strokeWidth="1"/>
   </g>
  </svg>
  <button type="button" className="acHot acHotShelf" onClick={()=>onOpen('books')} aria-label="Open my bookshelf"><span>my shelf</span></button>
  <button type="button" className="acHot acHotFilm" onClick={()=>onOpen('film')} aria-label="See my film photos"><span>film photos</span></button>
  <button type="button" className="acHot acHotTv" onClick={()=>onOpen('tv')} aria-label="Turn on the reality TV"><span>reality tv</span></button>
 </div>
}
