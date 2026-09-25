import React,{useCallback,useEffect,useRef,useState} from 'react';
import './desk-hero.css';
import {CASE_FILES,HOME_SHOWN,isParked,maximizeInto} from './CaseWindow';
import {ShelbyMark} from './CarArt';

/* The home hero is my desk. Scrolling pins the room, the camera walks into the
   monitor, and the monitor becomes "Neha OS": a desktop where every window is a
   case study. The room follows the visitor's clock (fog in the morning, the
   bridge lit up at night). Phones, portrait tablets, and reduced motion get the
   same room and desktop without the pinned zoom. */

const asset=(src:string)=>{const clean=src.replace(/^\/+/,'');return import.meta.env.DEV?`/${clean}`:`${import.meta.env.BASE_URL}${clean}`};

type Project={id:string;title:string;company:string;preview?:string;summary:string};
type Tod='morning'|'day'|'evening'|'night';

// Metrics match the case pages (and the resume); cases without one say what they were.
const WINDOWS:Record<string,{img:string;note:string;pos?:string}>={
 fcvf:{img:'project-media/fcvf-home-mockup.png',note:'+25% feedback submitted'},
 accenture:{img:'project-media/accenture-innovation-hub.jpg',note:'~60 min saved per request'},
 finsimple:{img:'project-media/finsimple-home-mockup.png',note:'6% fewer write failures'},
 kohler:{img:'project-media/supplied-covers/kohler.jpg',note:'71% → 94% accuracy'},
 marketExpansion:{img:'project-media/graze-scorecard.png',note:'3 markets, 1 scorecard',pos:'0 0'},
 estee:{img:'project-media/estee-home-mockup.png',note:'Top 5 finalist'}
};
// Where each window lands on the desktop, in viewport percent.
// Second row stays above the dock: the middle window sits directly over it.
const SLOTS=[[2.5,7],[30.5,9.5],[58.5,6],[4.5,47],[32.5,48.5],[60.5,46]];

const BOOKS=[
 {t:'A Thousand Splendid Suns',c:'#6d2631',f:'#d6b066',h:118,w:26},
 {t:'When Breath Becomes Air',c:'#264a3f',f:'#d3ad63',h:104,w:22},
 {t:'The Year of Magical Thinking',c:'#b6863a',f:'#3b2612',h:112,w:25},
 {t:'Sharp Objects',c:'#28314f',f:'#d4b06a',h:98,w:21},
 {t:'',c:'#d9cdb8',f:'#7a6a55',h:92,w:18},
 {t:'',c:'#9c4f3f',f:'#e8cf9c',h:108,w:16}
];
const PRINTS=[
 {src:'project-media/about-film/04.jpg',pos:'50% 50%',cap:'presidio',r:-5},
 {src:'project-media/about-film/01.jpg',pos:'50% 50%',cap:'baker beach',r:4},
 {src:'project-media/about-film/06.jpg',pos:'50% 40%',cap:'tahoe',r:-3},
 {src:'project-media/about-film/10.jpg',pos:'50% 50%',cap:'painted ladies',r:6}
];

const cl=(v:number)=>Math.max(0,Math.min(1,v));
const L=(a:number,b:number,t:number)=>a+(b-a)*t;
const io=(t:number)=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const out3=(t:number)=>1-Math.pow(1-t,3);
const back=(t:number)=>{const c=1.35;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};

const ORDER:Tod[]=['morning','day','evening','night'];
const todFor=(h:number):Tod=>h>=5&&h<11?'morning':h>=11&&h<17?'day':h>=17&&h<20?'evening':'night';
const GREETING:Record<Tod,string>={morning:'good morning',day:'good afternoon',evening:'good evening',night:'hey night owl'};

// Room geometry, in stage pixels (the stage is a 1600×1000 set).
const SW=420,SX=630,SCREEN_BOTTOM=572;
const TRACK_VH=600,ANCHOR_P=.9,ROOM_ZOOM=.92;

function GoldenGateView(){
 // Per-instance ids: the hero and the footer each draw this view at a different time of day.
 const u=React.useId().replace(/:/g,'');
 return <svg className="dhView" viewBox="0 0 300 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
   <linearGradient id={`dhSky${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="sky1"/><stop offset=".7" className="sky2"/><stop offset="1" className="sky3"/></linearGradient>
   <linearGradient id={`dhBay${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="bay1"/><stop offset="1" className="bay2"/></linearGradient>
   <clipPath id={`dhHangClip${u}`}><path d="M-6 196Q40 222 82 118Q150 214 222 136Q256 196 306 212L306 226L-6 232Z"/></clipPath>
   <filter id={`dhFogBlur${u}`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
   <radialGradient id={`dhHalo${u}`}><stop offset="0" className="halo1"/><stop offset="1" className="halo2"/></radialGradient>
   <linearGradient id={`dhHaze${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="haze0"/><stop offset=".86" className="haze1"/><stop offset="1" className="haze2"/></linearGradient>
   <linearGradient id={`dhSheen${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="sheen1"/><stop offset="1" className="sheen2"/></linearGradient>
   <linearGradient id={`dhRefFade${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".5"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
   <mask id={`dhRefMask${u}`}><rect y="232" width="300" height="80" fill={`url(#dhRefFade${u})`}/></mask>
  </defs>
  <rect width="300" height="330" fill={`url(#dhSky${u})`}/>
  <g className="dhSunDisc"><circle cx="226" cy="92" r="46" fill={`url(#dhHalo${u})`}/><circle cx="226" cy="92" r="17"/></g>
  <g className="dhStars">{[[30,40],[70,22],[120,52],[180,30],[250,46],[280,20],[150,14],[210,70]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3?0.9:1.3}/>)}</g>
  {/* Distant ridge, far shore, then the near headland: each step back is paler and bluer. */}
  <path className="dhRidge" d="M150 224C176 206 200 200 226 204C252 208 276 196 300 192V236H150Z"/>
  <path className="dhHillFar" d="M0 214C30 196 58 180 96 186C120 190 136 204 160 210L160 236H0Z"/>
  <path className="dhHillFar" d="M300 206C274 200 250 206 232 216C218 224 208 232 196 236H300Z"/>
  <rect y="186" width="300" height="52" fill={`url(#dhHaze${u})`}/>
  <path className="dhHillNear" d="M0 226C22 208 44 200 70 206C88 210 98 222 112 232L112 250H0Z"/>
  <rect y="234" width="300" height="96" fill={`url(#dhBay${u})`}/>
  {/* The sky's reflection brightens the water toward the horizon. */}
  <rect y="234" width="300" height="34" fill={`url(#dhSheen${u})`}/>
  <g className="dhBridgeRef" mask={`url(#dhRefMask${u})`}><rect x="77" y="232" width="15" height="70"/><rect x="218" y="230" width="12.4" height="44"/><path d="M-6 232L306 222L306 226L-6 237Z"/></g>
  <g className="dhWaves">{[246,262,280,300,318].map((y,i)=><path key={y} d={`M-40 ${y}q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0`} style={{animationDuration:`${7+i*1.6}s`,opacity:.18+i*.03}}/>)}</g>
  <g className="dhGlint">{[[40,258,30],[130,270,44],[210,262,26],[90,292,36],[240,300,40]].map(([x,y,w],i)=><rect key={i} x={x} y={y} width={w} height="1.4" rx=".7"/>)}</g>
  {/* The bridge, International Orange, receding from the Presidio side */}
  <g className="dhBridge">
   <path className="dhCable" d="M-6 196Q40 222 82 118Q150 214 222 136Q256 196 306 212"/>
   <g className="dhHangers" clipPath={`url(#dhHangClip${u})`}>{Array.from({length:34},(_,i)=>{const x=-2+i*9;return <line key={i} x1={x} x2={x} y1="0" y2="226"/>})}</g>
   <path className="dhDeck" d="M-6 224L306 214L306 219L-6 230Z"/>
   <g className="dhTower"><rect x="77" y="116" width="4" height="118"/><rect x="88" y="120" width="4" height="114"/><rect x="77" y="130" width="15" height="3"/><rect x="77" y="156" width="15" height="3"/><rect x="77" y="182" width="15" height="3"/><rect x="77" y="206" width="15" height="3"/><rect className="dhTowerShade" x="79.4" y="116" width="1.6" height="118"/><rect className="dhTowerShade" x="90.4" y="120" width="1.6" height="114"/></g>
   <g className="dhTower dhTowerFar"><rect x="218" y="134" width="3.4" height="94"/><rect x="227" y="137" width="3.4" height="91"/><rect x="218" y="146" width="12.4" height="2.6"/><rect x="218" y="166" width="12.4" height="2.6"/><rect x="218" y="186" width="12.4" height="2.6"/><rect x="218" y="204" width="12.4" height="2.6"/></g>
   <g className="dhBridgeLights">{Array.from({length:18},(_,i)=><circle key={i} cx={-2+i*18} cy={225-i*.55} r="1.2"/>)}<circle cx="84" cy="116" r="1.8"/><circle cx="224" cy="134" r="1.6"/></g>
  </g>
  <g className="dhFog" filter={`url(#dhFogBlur${u})`}><ellipse cx="60" cy="214" rx="90" ry="14"/><ellipse cx="220" cy="224" rx="110" ry="12"/><ellipse cx="150" cy="196" rx="70" ry="8"/></g>
 </svg>
}

function CanonAE1({onShoot}:{onShoot:()=>void}){
 // Canon AE-1 Program with the FD 50mm f/1.8: black body, chrome top plate, the prism hump.
 return <button type="button" className="dhCamera dh3d" tabIndex={-1} title="Say cheese" onClick={onShoot} aria-label="Take a photo with the Canon AE-1 Program">
  <svg viewBox="0 0 200 150" aria-hidden="true">
   <defs>
    <linearGradient id="aeChrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f4f2"/><stop offset=".45" stopColor="#c9c9c6"/><stop offset=".55" stopColor="#e9e9e6"/><stop offset="1" stopColor="#9d9d9a"/></linearGradient>
    <linearGradient id="aeChromeV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#a9a9a6"/><stop offset=".35" stopColor="#f1f1ee"/><stop offset=".7" stopColor="#c4c4c1"/><stop offset="1" stopColor="#8f8f8c"/></linearGradient>
    <pattern id="aeLeather" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#1b1b1c"/><circle cx="1.5" cy="1.5" r=".7" fill="#262628"/></pattern>
    <radialGradient id="aeGlass" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#6d7fb8"/><stop offset=".25" stopColor="#2b2f55"/><stop offset=".6" stopColor="#101118"/><stop offset="1" stopColor="#050506"/></radialGradient>
   </defs>
   <path d="M14 118Q100 140 186 118" fill="none" stroke="#060607" strokeWidth="7"/>
   {/* top plate, dials, prism */}
   <path d="M88 7V3H113V7M92 3V0H109V3" fill="#55565a" stroke="#bdbdbb" strokeWidth="1.2"/>
   <rect x="22" y="30" width="22" height="10" rx="2" fill="url(#aeChromeV)"/><rect x="26" y="25" width="14" height="6" rx="2" fill="#1b1b1c"/>
   <rect x="148" y="28" width="28" height="12" rx="3" fill="url(#aeChromeV)"/><rect x="140" y="33" width="10" height="6" rx="2" fill="#2a2a2b"/>
   <circle cx="132" cy="36" r="4" fill="url(#aeChromeV)" stroke="#6b6b69" strokeWidth=".6"/>
   <path d="M62 40L74 10Q76 6 81 6H119Q124 6 126 10L138 40Z" fill="url(#aeChrome)" stroke="#8a8a87" strokeWidth=".6"/>
   <text x="100" y="31" textAnchor="middle" fontFamily="'Times New Roman',Georgia,serif" fontWeight="700" fontSize="13" fill="#161616" letterSpacing="-.2" transform="translate(100 0) scale(1.06 1) translate(-100 0)">Canon</text>
   <rect x="8" y="40" width="184" height="14" rx="4" fill="url(#aeChrome)" stroke="#8a8a87" strokeWidth=".6"/>
   <text x="20" y="50.5" fontFamily="Helvetica,Arial,sans-serif" fontWeight="700" fontStyle="italic" fontSize="7.4" fill="#161616">AE-1</text>
   <text x="40" y="50.5" fontFamily="Helvetica,Arial,sans-serif" fontSize="5.2" fill="#161616" letterSpacing="1">PROGRAM</text>
   {/* body */}
   <rect x="8" y="52" width="184" height="72" rx="7" fill="url(#aeLeather)"/>
   <rect x="8" y="52" width="184" height="72" rx="7" fill="none" stroke="#000" strokeOpacity=".5"/>
   <rect x="8" y="116" width="184" height="10" rx="5" fill="url(#aeChrome)" opacity=".9"/>
   <rect x="158" y="60" width="16" height="7" rx="2" fill="#2d2d2f" stroke="#555" strokeWidth=".5"/>
   <rect x="2" y="56" width="7" height="6" rx="1.5" fill="url(#aeChromeV)"/><rect x="191" y="56" width="7" height="6" rx="1.5" fill="url(#aeChromeV)"/>
   <circle cx="28" cy="75" r="6" fill="url(#aeChromeV)"/><path d="M28 74l-3 17" stroke="#b9b9b6" strokeWidth="3"/>
   {[16,184].map(x=><g key={x}><circle cx={x} cy="47" r="1.5" fill="#686868"/><path d={`M${x-1} 47h2`} stroke="#d9d9d4" strokeWidth=".5"/></g>)}
   <ellipse cx="103" cy="95" rx="39" ry="36" fill="#070708"/>
   {/* FD 50mm f/1.8 */}
   <circle cx="100" cy="90" r="35" fill="#101011"/>
   <circle cx="100" cy="90" r="35" fill="none" stroke="#2c2c2e" strokeWidth="5" strokeDasharray="1.4 1.4"/>
   <circle cx="100" cy="90" r="28.5" fill="#18181a" stroke="url(#aeChromeV)" strokeWidth="2.2"/>
   <circle cx="100" cy="90" r="21" fill="url(#aeGlass)"/>
   <path d="M99 81l8 3 3 8-6 7-9-1-5-8 4-7Z" fill="#03050b" opacity=".7"/><path d="M85 82q11-13 23-4" stroke="#98aecb" strokeOpacity=".4" fill="none"/>
   <circle cx="100" cy="90" r="13.5" fill="none" stroke="#3a4274" strokeOpacity=".7"/>
   <ellipse cx="93" cy="82" rx="6" ry="3.6" fill="#fff" opacity=".28" transform="rotate(-30 93 82)"/>
   <circle cx="108" cy="98" r="1.8" fill="#fff" opacity=".18"/>
   <path id="aeLensArc" d="M76 90a24 24 0 0 1 48 0" fill="none"/>
   <text fontFamily="Helvetica,Arial,sans-serif" fontSize="3.6" fill="#cfcfcc" letterSpacing=".5"><textPath href="#aeLensArc" startOffset="50%" textAnchor="middle">CANON LENS FD 50mm 1:1.8</textPath></text>
  </svg>
 </button>
}

function HydroFlask(){
 // Black powder-coat bottle, flex cap, with the Accenture mark. Tap it and it wobbles.
 const [n,setN]=useState(0);
 return <div className={`dhFlask dh3d ${n?'isWobble':''}`} key={n} title="Stay hydrated" onClick={()=>setN(v=>v+1)}><svg viewBox="0 0 60 176" aria-hidden="true">
  <defs><linearGradient id="hfBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1a1b1e"/><stop offset=".08" stopColor="#0b0b0d"/><stop offset=".4" stopColor="#1e1e22"/><stop offset=".66" stopColor="#3e3e44"/><stop offset=".8" stopColor="#26262a"/><stop offset="1" stopColor="#0a0a0b"/></linearGradient>
  <linearGradient id="hfCap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#111113"/><stop offset=".65" stopColor="#35353a"/><stop offset="1" stopColor="#141416"/></linearGradient>
  <linearGradient id="hfSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5d5f62"/><stop offset=".6" stopColor="#d9dadb"/><stop offset=".75" stopColor="#f4f4f4"/><stop offset="1" stopColor="#6b6d70"/></linearGradient></defs>
  <path d="M22 8Q30 -6 38 8" fill="none" stroke="#1b1b1d" strokeWidth="4" strokeLinecap="round"/>
  <rect x="15" y="6" width="30" height="20" rx="4" fill="url(#hfCap)"/><rect x="15" y="6" width="30" height="4" rx="2" fill="#2e2e32"/>
  {Array.from({length:12},(_,i)=><path key={i} d={`M${17+i*2.3} 12v10`} stroke="#55545a" strokeOpacity=".45" strokeWidth=".7"/>)}
  <rect x="18" y="26" width="24" height="6" fill="url(#hfSteel)"/>
  <path d="M19 27h22" stroke="#fff" strokeOpacity=".5" strokeWidth=".8"/>
  <path d="M18 32Q4 38 4 54V164Q4 174 14 174H46Q56 174 56 164V54Q56 38 42 32Z" fill="url(#hfBody)"/>
  <path d="M7 162q23 9 46 0" fill="none" stroke="#5c5c60" strokeOpacity=".5"/><path d="M41 60V158" stroke="#fff" strokeOpacity=".16" strokeWidth="5" strokeLinecap="round"/><path d="M44 64V150" stroke="#fff" strokeOpacity=".22" strokeWidth="1.2" strokeLinecap="round"/><path d="M6.5 60V160" stroke="#8fa0b8" strokeOpacity=".22" strokeWidth="1.2"/><path d="M22 33Q30 30 38 33" stroke="#fff" strokeOpacity=".18" fill="none"/>
  <path d="M26 88L36 96L26 104" fill="none" stroke="#a100ff" strokeWidth="4.2" strokeLinejoin="miter"/>
  <text x="30" y="120" textAnchor="middle" fontFamily="Helvetica,Arial,sans-serif" fontSize="7.4" fontWeight="600" fill="#f5f5f5">accenture</text>
 </svg></div>
}

function MsuCappuccino(){
 // Cappuccino in an MSU mug on a saucer, with a latte-art heart. Click for a sip.
 const [sip,setSip]=useState(0);
 return <div className={`dhCappa dh3d ${sip?'isSip':''}`} key={sip} title="Take a sip" onClick={()=>setSip(v=>v+1)}><svg className="dhSteam" viewBox="0 0 60 80" aria-hidden="true"><path d="M20 76c-9-11 9-18 0-31s4-20 4-27"/><path d="M36 76c-9-11 9-18 0-31s4-20 4-27"/></svg>
  <svg viewBox="0 0 120 104" aria-hidden="true">
   <defs><linearGradient id="msuBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0b3026"/><stop offset=".3" stopColor="#154a3c"/><stop offset=".66" stopColor="#2c7560"/><stop offset=".8" stopColor="#1c5646"/><stop offset="1" stopColor="#0c3228"/></linearGradient>
   <linearGradient id="msuHandle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24664f"/><stop offset="1" stopColor="#0f3a2f"/></linearGradient>
   <radialGradient id="msuSaucer" cx=".6" cy=".35" r=".7"><stop offset="0" stopColor="#ffffff"/><stop offset=".6" stopColor="#efece5"/><stop offset="1" stopColor="#cfcac0"/></radialGradient>
   <radialGradient id="foam" cx=".5" cy=".5" r=".6"><stop offset="0" stopColor="#f3e6cf"/><stop offset=".7" stopColor="#dcbf92"/><stop offset="1" stopColor="#9a6a3d"/></radialGradient></defs>
   <ellipse cx="56" cy="93" rx="54" ry="10" fill="#bdb7ac"/><ellipse cx="56" cy="91.5" rx="54" ry="9.5" fill="url(#msuSaucer)"/><ellipse cx="56" cy="90" rx="42" ry="6.5" fill="#f4f1ea"/>
   <ellipse cx="56" cy="91" rx="33" ry="5" fill="none" stroke="#c6c1b5" strokeWidth="1.3"/>
   <ellipse cx="50" cy="90" rx="34" ry="3.2" fill="#0e2a20" opacity=".22"/>
   <path d="M90 34q20 2 18 20t-20 16" fill="none" stroke="url(#msuHandle)" strokeWidth="8" strokeLinecap="round"/>
   <path d="M92 35q16 3 13.5 18" fill="none" stroke="#0a2a21" strokeOpacity=".5" strokeWidth="1.2"/>
   <path d="M16 20H96L91 80Q90 90 80 90H32Q22 90 21 80Z" fill="url(#msuBody)"/>
   <path d="M99 37q9 5 7 17" fill="none" stroke="#8cc0a8" strokeOpacity=".8" strokeWidth="1.4" strokeLinecap="round"/><ellipse cx="56" cy="20" rx="40" ry="8" fill="#f0eee2"/><path d="M17 20a39 7.6 0 0 0 78 0" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1"/><ellipse cx="56" cy="21" rx="38" ry="7" fill="#724b2d"/>
   <ellipse cx="56" cy="21" rx="36" ry="6.4" fill="url(#foam)"/>
   <path d="M56 26c-6-3-9-5-9-8a4 4 0 0 1 9-1 4 4 0 0 1 9 1c0 3-3 5-9 8Z" fill="#fbf5ea" opacity=".95"/>
   <text x="56" y="55" textAnchor="middle" fontFamily="Helvetica,Arial,sans-serif" fontWeight="800" fontSize="15" fill="#f4efe4" letterSpacing="1">MSU</text>
   <text x="56" y="67" textAnchor="middle" fontFamily="Helvetica,Arial,sans-serif" fontSize="6.2" fill="#d9e6df" letterSpacing="1.6">SPARTANS</text>
   <path d="M80 30L77 78" stroke="#fff" strokeOpacity=".2" strokeWidth="5" strokeLinecap="round"/><path d="M84 31L81.5 70" stroke="#fff" strokeOpacity=".45" strokeWidth="1.2" strokeLinecap="round"/>
   <ellipse cx="56" cy="22" rx="36" ry="6.4" fill="none" stroke="#3b2413" strokeOpacity=".35" strokeWidth="1.4"/>
  </svg>
 </div>
}

function Lamp({on,onToggle}:{on:boolean;onToggle:()=>void}){
 return <button type="button" className={`dhLamp ${on?'isOn':''}`} tabIndex={-1} title={on?'Lamp off':'Lamp on'} onClick={onToggle} aria-pressed={on} aria-label={on?'Turn the desk lamp off':'Turn the desk lamp on'}>
  <svg viewBox="0 0 200 320" aria-hidden="true">
   <defs>
    <linearGradient id="lampShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#141312"/><stop offset=".55" stopColor="#3c3a38"/><stop offset=".78" stopColor="#5a5754"/><stop offset="1" stopColor="#1c1b1a"/></linearGradient>
    <linearGradient id="lampBase" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#121212"/><stop offset=".62" stopColor="#3d3b39"/><stop offset=".8" stopColor="#6a6763"/><stop offset="1" stopColor="#1a1919"/></linearGradient>
    <radialGradient id="lampInner" cx=".5" cy=".9" r=".9"><stop offset="0" stopColor="#fff3cf"/><stop offset=".5" stopColor="#e9c98a"/><stop offset="1" stopColor="#8c7450"/></radialGradient>
    <filter id="lampBlur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>
   </defs>
   <ellipse className="dhLampShadow" cx="124" cy="308" rx="52" ry="8" fill="#1c1a19" opacity=".38" filter="url(#lampBlur)"/>
   <ellipse cx="150" cy="298" rx="39" ry="10" fill="#141414"/><ellipse cx="150" cy="294" rx="38" ry="8" fill="url(#lampBase)"/><ellipse cx="150" cy="292" rx="30" ry="5" fill="#3a3836"/><path d="M160 288.5a30 5 0 0 0 18 -1.6" stroke="#9b978f" strokeOpacity=".7" fill="none"/>
   <path d="M150 292L126 176L64 104" fill="none" stroke="#3a3836" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
   <path d="M160 290L137 176L73 103" fill="none" stroke="#242423" strokeWidth="4"/><path d="M152 282L131 182L69 111" fill="none" stroke="#797772" strokeWidth="1"/>
   <path d="M142 280L122 186M118 170L74 118" fill="none" stroke="#8d8a86" strokeWidth="1.6" strokeDasharray="1.2 1.6"/>
   <circle cx="126" cy="176" r="7" fill="#2f2e2c" stroke="#5a5754"/><circle cx="126" cy="176" r="2.4" fill="#8d8a86"/>
   <circle cx="150" cy="290" r="5" fill="#2f2e2c"/><circle cx="66" cy="106" r="5" fill="#2f2e2c"/>
   <g transform="rotate(-38 58 98)"><path d="M40 78h36l2 8H38Z" fill="#2f2e2c"/><path d="M36 86h44l22 40H14Z" fill="url(#lampShade)"/><path d="M78 87l21 37" stroke="#8d8a86" strokeOpacity=".55" strokeWidth="1.2"/><ellipse cx="58" cy="126" rx="44" ry="7" fill="#1b1a19"/><ellipse cx="58" cy="126" rx="41" ry="5.8" className="dhShadeInner" fill="url(#lampInner)"/><ellipse cx="58" cy="126.5" rx="14" ry="3.2" className="dhBulb"/></g>
  </svg>
 </button>
}

function PhotoFrame({eager=true}:{eager?:boolean}){
 // A 5×7 frame with my headshot. It is just a photo on the desk.
 return <div className="dhFrame" aria-hidden="true">
  <div className="dhFrameFace"><img src={asset('headshot.jpg')} alt="" loading={eager?'eager':'lazy'} decoding="async"/></div>
 </div>
}
function Mustang(){
 const [rev,setRev]=useState(0);
 return <div className={`dhMustang dh3d ${rev?'isRev':''}`} key={rev} title="’67 Shelby GT500" onClick={()=>setRev(v=>v+1)}><ShelbyMark/><img className="dhFordScript" src={asset('company-logos/ford-white-source.png')} alt="" aria-hidden="true"/>{rev>0&&<span className="dhVroom">vroom!</span>}</div>
}

// Where each click's bite lands, as [angle in degrees, depth] around the cookie's edge.
const BITES:[number,number][]=[[-40,1],[25,1.05],[150,.95],[210,1.1],[95,1],[290,1.15]];
// A slightly lumpy outline, so it reads as baked rather than stamped.
const COOKIE_EDGE=(()=>{const n=22,pts=Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2,r=41+Math.sin(i*2.7)*1.6+Math.cos(i*1.3)*1.1;return [50+Math.cos(a)*r,50+Math.sin(a)*r*.97]});
 return pts.map((p,i)=>{const q=pts[(i+1)%n],m=[(p[0]+q[0])/2,(p[1]+q[1])/2];return `${i?'':`M${((pts[n-1][0]+p[0])/2).toFixed(1)} ${((pts[n-1][1]+p[1])/2).toFixed(1)}`}Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`}).join('')+'Z'})();
const biteCircles=(k:number)=>BITES.slice(0,k).flatMap(([deg,d])=>{const a=deg*Math.PI/180,cx=50+Math.cos(a)*44,cy=50+Math.sin(a)*44,tx=-Math.sin(a),ty=Math.cos(a);
 return [[cx,cy,11*d],[cx+tx*9,cy+ty*9,8.5*d],[cx-tx*9,cy-ty*9,8.5*d]] as [number,number,number][]});

function CookieNapkin(){
 // A chocolate-chunk cookie on a napkin. Every click takes a bite; when it is gone, a fresh one appears.
 const [bites,setBites]=useState(0);
 const [chomp,setChomp]=useState(0);
 const bite=()=>{setChomp(c=>c+1);setBites(b=>b>=BITES.length?0:b+1)};
 const gone=bites>=BITES.length;
 const cut=biteCircles(bites);
 const last=bites>0&&!gone?BITES[bites-1]:null;
 return <button type="button" className={`dhCookie ${gone?'isGone':''}`} onClick={bite} aria-label={gone?'Get a fresh cookie':'Take a bite of the cookie'} title={gone?'Another one?':'Take a bite'}>
  <svg viewBox="0 0 150 130" aria-hidden="true">
  <defs>
   <radialGradient id="ckBody" cx=".42" cy=".38" r=".66"><stop offset="0" stopColor="#ecc991"/><stop offset=".45" stopColor="#dcae6c"/><stop offset=".78" stopColor="#c48a48"/><stop offset=".94" stopColor="#a86c33"/><stop offset="1" stopColor="#8a5424"/></radialGradient>
   <radialGradient id="ckDome" cx=".38" cy=".3" r=".55"><stop offset="0" stopColor="#fff3d6" stopOpacity=".55"/><stop offset="1" stopColor="#fff3d6" stopOpacity="0"/></radialGradient>
   <radialGradient id="ckChunk" cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#6b4027"/><stop offset=".5" stopColor="#3d2314"/><stop offset="1" stopColor="#24130a"/></radialGradient>
   <filter id="ckTex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" seed="11"/><feColorMatrix values="0 0 0 0 .45 0 0 0 0 .27 0 0 0 0 .1 0 0 0 1.4 -.62"/><feComposite in2="SourceGraphic" operator="in"/></filter>
   <filter id="ckSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.5"/></filter>
   <clipPath id="ckClip"><path d={COOKIE_EDGE}/></clipPath>
   <mask id="ckBite"><rect x="-20" y="-20" width="140" height="140" fill="#fff"/>{cut.map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill="#000"/>)}</mask>
  </defs>
  <g transform="rotate(-12 75 65)">
   <rect x="10" y="8" width="130" height="114" rx="3" fill="#fbfaf6"/>
   <rect x="16" y="14" width="118" height="102" rx="2" fill="none" stroke="#e9e4da" strokeWidth="1.2" strokeDasharray="2 2"/>
   <path d="M75 8V122M10 65H140" stroke="#ece7dd" strokeWidth="1"/>
  </g>
  {[[30,98,1.6],[112,34,1.3],[120,96,1.1],[36,30,1],[104,108,1.4],[24,70,.9]].slice(0,2+bites).map(([x,y,r],i)=><ellipse key={i} cx={x} cy={y} rx={r*1.3} ry={r} fill="#c48c50"/>)}
  <g transform="translate(25 15)">
   <g key={chomp} className="ckWhole" mask="url(#ckBite)">
    <path d={COOKIE_EDGE} transform="translate(-3 5)" fill="#3a2410" opacity=".35" filter="url(#ckSoft)"/>
    <path d={COOKIE_EDGE} fill="url(#ckBody)"/>
    <path d={COOKIE_EDGE} fill="#fff" filter="url(#ckTex)" opacity=".55"/>
    <g clipPath="url(#ckClip)">
     <path d="M26 42q9-7 18-2M52 66q8 5 15 1M34 74q5-6 11-5M60 38q7-5 13 0M44 26q6 3 11 0" fill="none" stroke="#8a5424" strokeWidth="1.3" strokeLinecap="round" opacity=".55"/>
     <path d="M26 43q9-7 18-2M52 67q8 5 15 1M60 39q7-5 13 0" fill="none" stroke="#f6dcae" strokeWidth=".9" strokeLinecap="round" opacity=".7"/>
     {[[33,36,5.5,-8],[58,29,5,14],[66,55,5.8,30],[42,60,5.4,-20],[53,46,3.6,0],[29,53,4.6,40],[61,71,4.4,-10],[75,41,3.8,22],[45,78,3.2,8]].map(([x,y,r,rot],i)=><g key={i} transform={`rotate(${rot} ${x} ${y})`}>
      <path d={`M${x-r} ${y-r*.3}l${r*.6} ${-r*.7}l${r*1.1} ${r*.15}l${r*.3} ${r*.9}l${-r*.7} ${r*.75}l${-r*.95} ${-r*.2}z`} fill="url(#ckChunk)"/>
      <path d={`M${x-r*.5} ${y-r*.6}l${r*.8} ${r*.1}`} stroke="#9a6a48" strokeWidth=".8" strokeLinecap="round"/>
     </g>)}
     {[[38,47],[64,35],[50,58],[70,63]].map(([x,y],i)=><rect key={i} x={x} y={y} width="1.6" height="1.2" rx=".3" fill="#fffaf0" opacity=".9" transform={`rotate(${i*30} ${x} ${y})`}/>)}
     <path d={COOKIE_EDGE} fill="url(#ckDome)"/>
     {cut.map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r+1.4} fill="none" stroke="#b77f45" strokeWidth="2.6" opacity=".9"/>)}
     {cut.map(([x,y,r],i)=><circle key={`c${i}`} cx={x} cy={y} r={r+2.6} fill="none" stroke="#e8c48c" strokeWidth="1" strokeDasharray="1.5 2" opacity=".8"/>)}
    </g>
   </g>
   {last&&<g key={`crumbs${chomp}`} className="ckCrumbs">{[0,1,2,3].map(i=>{const a=last[0]*Math.PI/180,x=50+Math.cos(a)*50+(i-1.5)*5,y=50+Math.sin(a)*50+(i%2)*4;return <ellipse key={i} cx={x} cy={y} rx={1.4+i%2} ry={1+i%2*.6} fill="#c48c50" style={{'--dx':`${Math.cos(a)*6+(i-1.5)*2}px`,'--dy':`${Math.sin(a)*6+3}px`} as React.CSSProperties}/>})}</g>}
  </g>
  </svg>
 </button>
}

function WatercolorTin(){
 // Top-down: a travel watercolor tin, lid open as a mixing tray, twelve used half-pans, and a round brush.
 const pans=['#e2b33a','#e07b2e','#c9352c','#b0304f','#7a3c8c','#2d4f9e','#2f86b8','#2a8f78','#4f8a3a','#9a7b2e','#7a4a2a','#2b2b2e'];
 return <div className="dhPaints"><svg viewBox="0 0 240 130" aria-hidden="true">
  <defs><linearGradient id="wcTin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3a3e"/><stop offset="1" stopColor="#1f1f22"/></linearGradient></defs>
  <rect x="4" y="10" width="112" height="112" rx="6" fill="#eeeae2" stroke="#c9c3b7"/>
  {[[26,36,'#2f86b8'],[64,40,'#c9352c'],[40,82,'#e2b33a'],[84,84,'#2a8f78']].map(([x,y,c],i)=><g key={i}><circle cx={x} cy={y} r="16" fill="#fff" stroke="#ddd6c9"/><circle cx={Number(x)+2} cy={Number(y)+1} r="10" fill={c as string} opacity=".28"/><circle cx={Number(x)-3} cy={Number(y)+3} r="5" fill={c as string} opacity=".35"/></g>)}
  <path d="M100 26q-10 14 -2 30" fill="none" stroke="#7a3c8c" strokeOpacity=".3" strokeWidth="4" strokeLinecap="round"/>
  <rect x="8" y="14" width="104" height="104" rx="4" fill="none" stroke="#fffdf5" strokeWidth="2"/>
  <rect x="116" y="10" width="4" height="112" fill="#8d8a84"/>
  {[28,88].map(y=><g key={y}><rect x="113" y={y} width="10" height="14" rx="2" fill="#b6b5b0" stroke="#72746f" strokeWidth=".6"/><path d={`M118 ${y}v14`} stroke="#f2f0e6"/></g>)}
  <rect x="120" y="10" width="116" height="112" rx="6" fill="url(#wcTin)"/>
  {pans.map((c,i)=>{const col=i%6,row=Math.floor(i/6),x=126+col*18.3,y=20+row*50;return <g key={c}><rect x={x} y={y} width="15" height="40" rx="2.5" fill="#f4f1ea"/><rect x={x+1.5} y={y+1.5} width="12" height="37" rx="2" fill={c}/><ellipse cx={x+7.5} cy={y+14+(i%3)*5} rx="4.5" ry="7" fill="#fff" opacity=".22"/><path d={`M${x+3} ${y+28}q4 -4 9 0`} stroke="#000" strokeOpacity=".18" fill="none"/></g>})}
  <g transform="rotate(-24 150 70)">
   <rect x="60" y="66" width="150" height="5" rx="2.5" fill="#b0452f"/>
   <path d="M66 67h140" stroke="#f1b394" strokeOpacity=".5" strokeWidth=".8"/>
   <rect x="210" y="65.5" width="16" height="6" rx="1" fill="#c9c5bd"/>
   <path d="M211 67h14M214 66v5M223 66v5" stroke="#f9f7ed" strokeWidth=".7"/>
   <path d="M226 65.5q14 1.5 20 3.5q-6 2 -20 3.5Z" fill="#2a1a12"/>
   <path d="M238 67.8q6 .8 8 1.2q-2 .6 -8 1.2Z" fill="#2d4f9e"/>
  </g>
 </svg></div>
}

function DeskKeyboard(){
 const rows=[['esc','☀','☀','▦','⌕','◉','◀','▶','▶','◁','◁','▷','⏻'],['`','1','2','3','4','5','6','7','8','9','0','−','=','delete'],['tab','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],['caps','A','S','D','F','G','H','J','K','L',';',"'",'return'],['shift','Z','X','C','V','B','N','M',',','.','/','shift'],['fn','control','option','⌘','space','⌘','option','◀','▲','▼','▶']];
 return <div className="dhKeyboard" aria-hidden="true">{rows.map((row,r)=><div className="dhKeyRow" key={r}>{row.map((key,i)=><span key={i} className={key==='space'?'dhSpace':key.length>1?'dhModifier':''}>{key==='space'?'':key}</span>)}</div>)}</div>;
}

function Glyph({d}:{d:string}){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d}/></svg>}
const G={
 work:'M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm2 0h2V5h-2ZM3 12h18',
 exp:'M4 20V9l8-5 8 5v11M9 20v-6h6v6',
 fun:'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2Z',
 about:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
 resume:'M7 3h7l5 5v13H7Zm7 0v5h5M10 13h6M10 17h6',
 mail:'M3 6h18v12H3Zm0 0 9 7 9-7',
 li:'M6 9v10M6 5.5v.1M10 19v-6a3 3 0 0 1 6 0v6M10 10v9'
};

// A macOS-style wallpaper: soft layered color waves (drawn here, not Apple's image).
function WaveWallpaper({id}:{id:string}){
 const g=(n:string,a:string,b:string,c:string)=><linearGradient id={`${id}${n}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a}/><stop offset=".55" stopColor={b}/><stop offset="1" stopColor={c}/></linearGradient>;
 return <svg className="dhWallpaper" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
   {g('Bg','#1b1f5c','#3a2d8f','#1c3f8f')}
   {g('W1','#6d5cf6','#3f7cf0','#2bb3e8')}
   {g('W2','#ff8fb3','#ff6a88','#c04cd6')}
   {g('W3','#ffc36e','#ff8a5b','#ff5d86')}
   {g('W4','#9b6cff','#6c4be0','#3a2fa8')}
   <filter id={`${id}Soft`}><feGaussianBlur stdDeviation="2"/></filter>
  </defs>
  <rect width="1600" height="1000" fill={`url(#${id}Bg)`}/>
  <path d="M-50 380C260 250 520 420 820 330S1380 160 1650 260V1000H-50Z" fill={`url(#${id}W1)`} opacity=".9"/>
  <path d="M-50 520C300 420 560 600 900 500S1400 330 1650 430V1000H-50Z" fill={`url(#${id}W2)`}/>
  <path d="M-50 660C320 560 620 760 960 660S1420 520 1650 600V1000H-50Z" fill={`url(#${id}W3)`}/>
  <path d="M-50 800C340 720 700 900 1040 810S1460 700 1650 760V1000H-50Z" fill={`url(#${id}W4)`}/>
  <g fill="none" stroke="#fff" strokeWidth="3" opacity=".22" filter={`url(#${id}Soft)`}>
   <path d="M-50 520C300 420 560 600 900 500S1400 330 1650 430"/><path d="M-50 660C320 560 620 760 960 660S1420 520 1650 600"/><path d="M-50 380C260 250 520 420 820 330S1380 160 1650 260"/>
  </g>
 </svg>
}

export default function DeskHero({projects,openCase,onSimple}:{projects:Project[];openCase:(id:string)=>void;onSimple?:()=>void}){
 const trackRef=useRef<HTMLElement>(null),stageRef=useRef<HTMLDivElement>(null),sceneRef=useRef<HTMLDivElement>(null);
 const copyRef=useRef<HTMLDivElement>(null),osRef=useRef<HTMLDivElement>(null);
 const helloRef=useRef<HTMLDivElement>(null),progRef=useRef<HTMLDivElement>(null),dockRef=useRef<HTMLElement>(null),toastRef=useRef<HTMLDivElement>(null);
 const winRefs=useRef<(HTMLElement|null)[]>([]),iconRefs=useRef<(HTMLElement|null)[]>([]);
 const drag=useRef<{x:number,y:number}[]>(projects.map(()=>({x:0,y:0})));
 const zTop=useRef(10);

 // Decided before the first paint, so a phone never flashes the pinned desktop layout.
 const [isStatic,setStatic]=useState(()=>window.matchMedia('(max-width: 900px), (max-aspect-ratio: 23/20), (prefers-reduced-motion: reduce)').matches);
 // Reduced-motion visitors get the same plain-text offer, worded for them.
 const [reduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [tod,setTod]=useState<Tod>(()=>{
  const q=new URLSearchParams(window.location.search).get('tod');
  return (['morning','day','evening','night'] as Tod[]).includes(q as Tod)?q as Tod:todFor(new Date().getHours());
 });
 const [lampOn,setLampOn]=useState(()=>tod==='evening'||tod==='night');
 const manualTod=useRef(false);
 useEffect(()=>{setLampOn(tod==='evening'||tod==='night')},[tod]);
 const [flash,setFlash]=useState(0);
 const [clock,setClock]=useState(()=>new Date());

 useEffect(()=>{const id=setInterval(()=>{const now=new Date();setClock(now);if(!manualTod.current&&!new URLSearchParams(window.location.search).get('tod'))setTod(todFor(now.getHours()))},30000);return()=>clearInterval(id)},[]);

 useEffect(()=>{
  const mq=window.matchMedia('(max-width: 900px), (max-aspect-ratio: 23/20), (prefers-reduced-motion: reduce)');
  const set=()=>setStatic(mq.matches);set();mq.addEventListener('change',set);return()=>mq.removeEventListener('change',set);
 },[]);

 // The scroll-driven camera. Everything is written straight to styles; no re-renders per frame.
 useEffect(()=>{
  const stage=stageRef.current,track=trackRef.current;if(!stage||!track)return;
  let raf=0,lastKey='',warmed=false,toastAt=0,toastGone=false,toastTimer=0;
  // The camera eases toward the scroll position instead of jumping with it, so a
  // mouse wheel's notches read as one glide. Big jumps (skip, resize) snap.
  let shown=-1,lastT=0,snap=true;
  let SH=262,SY=334,CX0=740,HELLO_DY=0;
  const measure=()=>{
   const vw=window.innerWidth,vh=window.innerHeight;
   SH=isStatic?262:Math.max(220,Math.min(285,SW*vh/vw));SY=SCREEN_BOTTOM-SH;
   stage.style.setProperty('--sh',`${SH}px`);stage.style.setProperty('--sy',`${SY}px`);
   // Slide the room right until the photo frame (the leftmost object, x≈474) clears the copy.
   const copy=copyRef.current,s0=Math.max(vw/1600,vh/1000)*ROOM_ZOOM;
   const copyRight=copy?copy.offsetLeft+copy.offsetWidth:vw*.4;
   CX0=Math.min(vw/vh>1.9?800:760,468-(copyRight+28-vw/2)/s0);
   // How far the hello note drops so it shrinks into the middle of the dock (it scales from its bottom edge).
   const hello=helloRef.current,dock=dockRef.current;
   if(hello&&dock)HELLO_DY=dock.offsetTop+dock.offsetHeight/2-(hello.offsetTop+hello.offsetHeight)+hello.offsetHeight*.06/2;
   lastKey='';
  };
  const setOsLive=(v:boolean)=>document.documentElement.classList.toggle('deskOsLive',v);

  const frameStatic=()=>{
   const scene=sceneRef.current;if(!scene)return;
   const w=scene.clientWidth,h=scene.clientHeight,s=Math.max(w/1400,h/760);
   stage.style.transform=`translate(${w/2-900*s}px,${h/2-520*s}px) scale(${s})`;
  };
  // Draw only when something can have changed: a scroll, a resize, or the toast's timer.
  // A loop that ran every frame forced a layout read on every frame of the whole page.
  const frame=(now:number)=>{raf=0;update(now)};
  const request=()=>{if(!raf)raf=requestAnimationFrame(frame)};
  const update=(now=performance.now())=>{
   // Parked under an open case: the case page is what's scrolling.
   if(isParked(track)){snap=true;return}
   const vw=window.innerWidth,vh=window.innerHeight;
   const r=track.getBoundingClientRect(),total=track.offsetHeight-vh;
   const away=r.bottom<-50||r.top>vh+50;
   if(progRef.current&&away){progRef.current.style.opacity='0';progRef.current.style.visibility='hidden'}
   // Offscreen, the room's water, fog and steam stop drawing.
   track.classList.toggle('isAway',away);
   if(away){snap=true;return}
   const target=cl(-r.top/total),dt=Math.min(.05,Math.max(0,(now-lastT)/1000));lastT=now;
   if(snap||shown<0||Math.abs(target-shown)>.25)shown=target;
   else{shown+=(target-shown)*(1-Math.exp(-dt/.085));if(Math.abs(target-shown)<.0004)shown=target}
   snap=false;
   if(shown!==target)request();
   const p=shown;
   // Start fetching the case images once the visitor starts walking in.
   if(!warmed&&p>.05){warmed=true;winRefs.current.forEach(w=>{const img=w?.querySelector('img');if(img)img.loading='eager'})}
   // Like a real notification, the toast slides in, then gets out of the way.
   const toast=toastRef.current;
   if(toast){if(p<.86)toastAt=0;else if(p>=.91&&!toastAt){toastAt=performance.now();window.clearTimeout(toastTimer);toastTimer=window.setTimeout(request,5050)}toastGone=!!toastAt&&performance.now()-toastAt>5000&&!toast.matches(':hover')}
   const key=`${toastGone?1:0}|${p.toFixed(4)}|${vw}x${vh}`;if(key===lastKey)return;lastKey=key;

   // Camera: the visible part of the room shrinks from the whole set to exactly the screen.
   const s0=Math.max(vw/1600,vh/1000)*ROOM_ZOOM,s1=Math.max(vw/SW,vh/SH);
   const e=io(cl((p-.07)/.35));
   const s=s0*Math.pow(s1/s0,e);
   const k=(1/s0-1/s)/(1/s0-1/s1||1);
   const cx=L(CX0,SX+SW/2,k),cy=L(510,SY+SH/2,k);
   stage.style.transform=`translate(${vw/2-cx*s}px,${vh/2-cy*s}px) scale(${s})`;

   const ct=cl((p-.03)/.09);
   if(copyRef.current){copyRef.current.style.opacity=String(1-ct);copyRef.current.style.transform=`translate(${-ct*80}px,-50%)`;copyRef.current.style.visibility=ct>=1?'hidden':''}
   // A quiet progress rail: where you are in the walk-in, and a way out of it.
   if(progRef.current){progRef.current.style.setProperty('--p',String(p));const po=1-cl((p-.97)/.03);progRef.current.style.opacity=String(po);progRef.current.style.visibility=po>0?'':'hidden';progRef.current.dataset.chapter=p<.07?'0':p<.42?'1':p<.56?'2':'3';progRef.current.classList.toggle('isDone',p>=.88)}

   // Neha OS takes over once the screen fills the view.
   const ot=cl((p-.38)/.05),os=osRef.current;
   if(os){os.style.opacity=String(ot);os.style.visibility=ot>0?'visible':'hidden';os.classList.toggle('isLive',ot>.9)}
   // Once the OS fully covers the room, the room's ambient loops pause underneath it.
   track.classList.toggle('osCovers',ot>=1);
   setOsLive(ot>.5&&p<.999);
   const dockY=(1-out3(cl((p-.43)/.06)))*140;
   if(dockRef.current)dockRef.current.style.transform=`translate(-50%,${dockY}px)`;
   // The hello note minimizes into the dock before the work opens.
   const hm=io(cl((p-.51)/.06)),hello=helloRef.current;
   if(hello){hello.style.transform=`translateY(${hm*(HELLO_DY||vh*.5)}px) scale(${L(1,.06,hm)})`;hello.style.opacity=String(1-cl((hm-.7)/.3))}
   winRefs.current.forEach((w,i)=>{if(!w)return;const t=cl((p-.56-i*.05)/.06),b=back(t),d=drag.current[i];
    w.style.opacity=String(cl(t*3));w.style.visibility=t>0?'visible':'hidden';
    w.style.transform=`translate(${d.x}px,${d.y+(1-b)*110}px) scale(${L(.55,1,b)})`});
   iconRefs.current.forEach((d,i)=>{if(!d)return;const t=cl((p-.84-i*.02)/.04);d.style.opacity=String(t);d.style.transform=`scale(${L(.6,1,back(t))})`});
   if(toastRef.current){const t=cl((p-.87)/.04);toastRef.current.style.opacity=String(toastGone?0:t);toastRef.current.style.visibility=toastGone||t===0?'hidden':'';toastRef.current.style.transform=`translateX(${(1-out3(t))*120}%)`}
  };

  measure();
  if(isStatic){frameStatic();const onR=()=>{measure();frameStatic()};window.addEventListener('resize',onR);setOsLive(false);
   // Clear anything the scroll version wrote.
   for(const el of [copyRef.current,osRef.current,helloRef.current,dockRef.current,toastRef.current,...winRefs.current,...iconRefs.current])if(el){el.style.opacity='';el.style.transform='';el.style.visibility=''}
   return()=>window.removeEventListener('resize',onR)}
  const onResize=()=>{measure();snap=true;request()};
  // Back from a case: draw now, so the closing transition shrinks into the window where it sits.
  const onShown=()=>{measure();snap=true;update()};
  const toastEl=toastRef.current;
  window.addEventListener('resize',onResize);window.addEventListener('scroll',request,{passive:true});window.addEventListener(HOME_SHOWN,onShown);toastEl?.addEventListener('mouseleave',request);
  // Draw the first frame now, not on the next animation frame, so a view
  // transition back to the desktop snapshots the windows in place.
  update();
  return()=>{cancelAnimationFrame(raf);window.clearTimeout(toastTimer);window.removeEventListener('resize',onResize);window.removeEventListener('scroll',request);window.removeEventListener(HOME_SHOWN,onShown);toastEl?.removeEventListener('mouseleave',request);track.classList.remove('isAway','osCovers');setOsLive(false)};
 },[isStatic]);

 // Windows drag by their title bar, like the real thing.
 const startDrag=useCallback((i:number,e:React.PointerEvent)=>{
  if(isStatic||e.button!==0)return;
  const w=winRefs.current[i];if(!w)return;
  e.preventDefault();w.style.zIndex=String(++zTop.current);
  const start={x:e.clientX,y:e.clientY},from={...drag.current[i]};
  const move=(ev:PointerEvent)=>{drag.current[i]={x:from.x+ev.clientX-start.x,y:from.y+ev.clientY-start.y};w.style.transform=`translate(${drag.current[i].x}px,${drag.current[i].y}px)`};
  const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)};
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
 },[isStatic]);

 const shoot=()=>{setFlash(f=>f+1)};
 // Desk objects tilt toward the pointer in perspective and lift while hovered.
 useEffect(()=>{
  const stage=stageRef.current;if(!stage||isStatic)return;
  const move=(e:PointerEvent)=>{const el=(e.target as HTMLElement).closest<HTMLElement>('.dh3d');if(!el)return;const r=el.getBoundingClientRect();
   el.style.setProperty('--rx',`${(-((e.clientY-r.top)/r.height-.5)*16).toFixed(1)}deg`);el.style.setProperty('--ry',`${(((e.clientX-r.left)/r.width-.5)*22).toFixed(1)}deg`)};
  const out=(e:PointerEvent)=>{const el=(e.target as HTMLElement).closest<HTMLElement>('.dh3d');if(el&&!el.contains(e.relatedTarget as Node)){el.style.removeProperty('--rx');el.style.removeProperty('--ry')}};
  stage.addEventListener('pointermove',move);stage.addEventListener('pointerout',out);
  return()=>{stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerout',out)};
 },[isStatic]);
 // Measured from the document, not the offset parent, so p=1 lands exactly on the sequence's last frame.
 const jumpTo=(p:number)=>{const t=trackRef.current;if(t)window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY+(t.offsetHeight-window.innerHeight)*p,behavior:'instant' as ScrollBehavior})};
 // Links to the work fly through the walk-in in ~1.1s instead of the browser's slow smooth scroll.
 useEffect(()=>{
  if(isStatic)return;
  let raf=0;
  const fly=(to:number)=>{
   cancelAnimationFrame(raf);
   const from=window.scrollY,d=to-from,t0=performance.now(),dur=Math.min(1100,300+Math.abs(d)*.18);
   const step=(now:number)=>{const k=cl((now-t0)/dur);window.scrollTo({top:from+d*io(k),behavior:'instant' as ScrollBehavior});if(k<1)raf=requestAnimationFrame(step)};
   raf=requestAnimationFrame(step);
  };
  const onClick=(e:MouseEvent)=>{
   const a=(e.target as HTMLElement).closest?.('a[href="#projects"]');const t=trackRef.current;
   if(!a||!t||e.metaKey||e.ctrlKey)return;
   e.preventDefault();history.replaceState(null,'','#projects');
   fly(t.offsetTop+(t.offsetHeight-window.innerHeight)*.93);
  };
  const stop=()=>cancelAnimationFrame(raf);
  document.addEventListener('click',onClick);window.addEventListener('wheel',stop,{passive:true});window.addEventListener('touchstart',stop,{passive:true});
  return()=>{cancelAnimationFrame(raf);document.removeEventListener('click',onClick);window.removeEventListener('wheel',stop);window.removeEventListener('touchstart',stop)};
 },[isStatic]);
 const scrub=(e:React.MouseEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect();jumpTo(cl((e.clientX-r.left)/r.width))};
 const open=(id:string)=>(e:React.MouseEvent<HTMLElement>)=>{e.preventDefault();maximizeInto(e.currentTarget.closest('.dhWin')||e.currentTarget,id,()=>openCase(id))};
 const day=clock.toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'}),time=clock.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
 const hello=<><div className="dhHelloBar"><i/><i/><i/><span>hello.txt</span></div><div className="dhHelloBody"><p>{GREETING[tod]}, i’m neha.<span className="dhCaret"/></p><small>welcome to my desk. keep scrolling, come on in →</small></div></>;

 return <section ref={trackRef} className={`dhTrack tod-${tod} ${isStatic?'isStatic':''} ${lampOn?'lampOn':''}`} style={{'--track':`${TRACK_VH}vh`} as React.CSSProperties} aria-label="Neha Chinimilli, intro and selected work" id="top">
  {!isStatic&&<span id="projects" className="dhAnchor" style={{top:`${ANCHOR_P*(TRACK_VH-100)}vh`}} aria-hidden="true"/>}
  <div className="dhPin">
   <div className="dhCopy" ref={copyRef}>
    <h1>Neha<br/><em>Chinimilli</em></h1>
    <p><b>Product-minded engineer</b> who turns customer and operations problems into shipped software, most recently at Accenture, Ford Credit, and Ford.</p>
    <p className="dhEdu"><i aria-hidden="true"/><span>Computer Science + Supply Chain Management<br/>Michigan State University · 2027</span></p>
    <div className="dhLinks"><a href="#projects">See my work <span aria-hidden="true">↓</span></a><a href="#about">About me</a><a href="Neha_Chinimilli_Resume.pdf" target="_blank" rel="noreferrer">Resume <span aria-hidden="true">↗</span></a></div>
    {onSimple&&<p className="dhQuick">{reduced?'Reduced motion is on.':'Short on time?'} <button type="button" onClick={onSimple}>Switch to Simple view</button></p>}
    <span className="dhPoke" aria-hidden="true">this is my desk. poke around <i>↘</i></span>
   </div>

   <div className="dhScene" ref={sceneRef}>
    <div className="dhStage" ref={stageRef} aria-hidden="true">
     <div className="dhWall"/>
     <div className="dhSunPatch"/>

     <div className="dhWindow" title="Change the time of day" onClick={()=>{manualTod.current=true;setTod(t=>ORDER[(ORDER.indexOf(t)+1)%4]);}}>
      <div className="dhGlass"><GoldenGateView/><div className="dhMuntins"/><div className="dhReflect"/></div>
      <div className="dhCurtain"/>
      <div className="dhSill"><div className="dhSucculent"><i/><i/><i/><i/><i/></div></div>
     </div>

     <div className="dhString">
      <svg viewBox="0 0 520 90" preserveAspectRatio="none"><path d="M0 8Q260 80 520 12"/></svg>
      {Array.from({length:13},(_,i)=>{const t=i/12,x=t*520,y=(1-t)*(1-t)*8+2*(1-t)*t*80+t*t*12;return <i key={i} className="dhBulbDot" style={{left:x,top:y+2,animationDelay:`${(i*.37)%2}s`}}/>})}
      {PRINTS.map((p,i)=>{const t=.12+i*.25,x=t*520,y=(1-t)*(1-t)*8+2*(1-t)*t*80+t*t*12;return <figure key={p.src} className="dhPrint" style={{left:x-40,top:y-4,'--r':`${p.r}deg`,animationDelay:`${i*.6}s`} as React.CSSProperties}><span className="dhPeg"/><img src={asset(p.src)} alt="" style={{objectPosition:p.pos}} loading="eager" decoding="async"/><figcaption>{p.cap}</figcaption></figure>})}
     </div>

     <div className="dhShelf">
      <div className="dhBooks">{BOOKS.map((b,i)=><i key={i} style={{'--c':b.c,'--f':b.f,height:b.h,width:b.w} as React.CSSProperties}>{b.t&&<span>{b.t}</span>}</i>)}<i className="dhLean" style={{'--c':'#e3a88f','--f':'#6b2d1f',height:100,width:20} as React.CSSProperties}/></div>
      <b className="dhCanvas"/>
      <div className="dhStack"><i style={{'--c':'#3d5a80'} as React.CSSProperties}/><i style={{'--c':'#e8dcc4'} as React.CSSProperties}/><Mustang/></div>
      <div className="dhPothos"><svg viewBox="0 0 90 230" aria-hidden="true"><path className="dhVine" d="M40 30C44 70 30 96 36 130S52 180 44 222"/><path className="dhVine" d="M52 30C62 60 66 84 60 110"/>{[[36,48,-30],[44,70,40],[32,94,-40],[40,120,30],[38,148,-35],[48,172,35],[42,198,-30],[46,220,20],[62,56,40],[64,84,-20],[58,106,30]].map(([x,y,r],i)=><path key={i} className="dhLeaf" transform={`translate(${x} ${y}) rotate(${r})`} d="M0 0C-15-6-16-24-5-23Q-1-23 0-18Q5-29 12-20C18-10 7-3 0 0Z"/>)}</svg><div className="dhPot"/></div>
      <div className="dhPlank"/><i className="dhBracket"/><i className="dhBracket dhBracketR"/>
     </div>

     <div className="dhGlow"/>
     <div className="dhImac"><div className="dhImacFace"><i className="dhImacCam"/></div><div className="dhImacChin"/><div className="dhImacStand"/><div className="dhImacFoot"/></div>

     <div className="dhDesk"><div className="dhDeskEdge"/></div><div className="dhWood"/>
     <div className="dhLampPool"/>
     {/* Everything lying on the desk shares one plane, seen in perspective */}
     <div className="dhTop">
      <div className="dhDaylight"/>
      <div className="dhMat"><DeskKeyboard/><div className="dhMouse"/></div>
      <div className="dhNotebook"><span>ship-it list<br/>✓ commute<br/>✓ book club<br/>☐ your team?</span></div>
      <div className="dhPen"/>
      <WatercolorTin/>
      <CookieNapkin/>
     </div>
     <PhotoFrame/>
     <HydroFlask/>
     <MsuCappuccino/>
     <CanonAE1 onShoot={shoot}/>
     <Lamp on={lampOn} onToggle={()=>setLampOn(v=>!v)}/>
     <div className="dhShade"/>

     <div className="dhScreen" title="Come on in" onClick={()=>{const t=trackRef.current;if(t&&!isStatic){const to=t.offsetTop+(t.offsetHeight-window.innerHeight)*.5;window.scrollTo({top:to,behavior:'smooth'})}}}>
      <WaveWallpaper id="dhMiniWp"/>
      <div className="dhMiniBar"><b>Neha</b><span>Selected work</span><span>Experience</span></div>
      <div className="dhHello dhHelloMini">{hello}</div>
     </div>
     <div className="dhSticky dhStickyA">71% → 94% accuracy ✓<small>kohler</small></div>
     <div className="dhSticky dhStickyB">vanderpump reunion 9pm!!</div>
    </div>
    {flash>0&&<div className="dhFlash" key={flash} aria-hidden="true"/>}
   </div>
   {!isStatic&&<div className="dhProgress" ref={progRef} data-chapter="0">
    <span className="dhChapter" aria-hidden="true"><b>scroll to walk in</b><b>walking in</b><b>hello</b><b>the work</b></span>
    <div className="dhRail" onClick={scrub} role="presentation"><i/>{[.07,.42,.56].map(t=><em key={t} style={{left:`${t*100}%`}}/>)}</div>
    <button type="button" className="dhSkip" onClick={()=>jumpTo(1)}>Skip to the work ↓</button>
   </div>}

   <div className="dhOs" ref={osRef}>
    <WaveWallpaper id="dhOsWp"/>
    <nav className="dhMenuBar" aria-label="Neha OS">
     <a href="#top" className="dhMenuLogo"><img src={asset('favicon.svg')} alt=""/><b>Neha</b></a>
     <a href="#projects">Selected work</a><a href="#experience">Experience</a><a href="#fun">Fun builds</a><a href="#about">About</a><a href="Neha_Chinimilli_Resume.pdf" target="_blank" rel="noreferrer">Resume</a>
     <span className="dhMenuRight">{onSimple&&<button type="button" className="dhMenuView" onClick={onSimple}>Simple view</button>}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01"/></svg><svg viewBox="0 0 30 16" aria-hidden="true"><rect x="1" y="2" width="24" height="12" rx="3.5"/><rect x="3.5" y="4.5" width="15" height="7" rx="1.6" className="dhBatt"/><path d="M27.5 6v4"/></svg><span>{day}</span><span>{time}</span></span>
    </nav>
    {isStatic&&<span id="projects" className="dhAnchor" aria-hidden="true"/>}
    <h2 className="dhOsTitle">Selected work</h2>
    <div className="dhHello dhHelloOs" ref={helloRef} aria-hidden="true">{hello}</div>
    <div className="dhWindows">
     {projects.map((p,i)=>{const w=WINDOWS[p.id];if(!w)return null;const [x,y]=SLOTS[i]||[10,10];
      return <article key={p.id} className="dhWin" data-case={p.id} ref={el=>{winRefs.current[i]=el}} style={isStatic?undefined:{left:`${x}vw`,top:`${y}vh`}}>
       <header className="dhWinBar" onPointerDown={e=>startDrag(i,e)}><i/><i/><i/><span>{CASE_FILES[p.id]}</span></header>
       <a href={`#/projects/${p.id}`} onClick={open(p.id)} className="dhWinBody" aria-label={`Open ${p.title} case study`}>
        <img src={asset(w.img)} alt="" loading="lazy" decoding="async" style={w.pos?{objectPosition:w.pos}:undefined}/>
        <div className="dhWinCap"><div><h3>{p.title}</h3><small>{p.company.split(' · ')[0]}</small></div><em>{w.note}</em></div>
       </a>
      </article>})}
    </div>
    <div className="dhIcons">
     {[['resume.pdf','PDF','Neha_Chinimilli_Resume.pdf',null],['Commute','iOS','#/projects/commute','commute'],['Bookclub','APP','#/projects/bookclub','bookclub'],['film roll','35MM','#about',null]].map(([label,tag,href,id],i)=>
      <a key={label} ref={el=>{iconRefs.current[i]=el}} href={href as string} onClick={id?open(id as string):undefined} target={href==='Neha_Chinimilli_Resume.pdf'?'_blank':undefined} rel="noreferrer"><i data-t={tag}/>{label}</a>)}
    </div>
    <div className="dhToast" ref={toastRef} role="status"><img src={asset('favicon.svg')} alt=""/><div><b>Neha</b><span>Drag the windows around, or click one to open the case study.</span></div><small>now</small></div>
    <nav className="dhDock" ref={dockRef} aria-label="Dock">
     {[['Selected work','#projects',G.work,'#e0634f,#b23a2c'],['Experience','#experience',G.exp,'#4f7fd6,#2b4c9a'],['Fun things I built','#fun',G.fun,'#7cc27a,#3f8a45'],['About me','#about',G.about,'#f5b94f,#d9861c'],['Resume','Neha_Chinimilli_Resume.pdf',G.resume,'#f4f1ea,#d8d2c6'],['Email','mailto:chinimi2@msu.edu',G.mail,'#6ec1f2,#2a86d0'],['LinkedIn','https://www.linkedin.com/in/nchinimilli',G.li,'#3a7dc0,#1d5a96']].map(([label,href,d,bg])=>
      <a key={label} href={href} target={href.startsWith('http')||href.endsWith('.pdf')?'_blank':undefined} rel="noreferrer" style={{'--bg':`linear-gradient(160deg,${bg})`} as React.CSSProperties} className={label==='Resume'?'dhDockLight':''}><Glyph d={d}/><span>{label}</span></a>)}
    </nav>
   </div>
  </div>
 </section>
}

/* The end of the page: the same desk, at night. When it comes into view the
   lamp clicks off, and a note on the wall says thanks, with how to reach me. */
export function DeskGoodnight(){
 const rootRef=useRef<HTMLElement>(null),sceneRef=useRef<HTMLDivElement>(null),stageRef=useRef<HTMLDivElement>(null);
 const [lampOn,setLampOn]=useState(true);
 useEffect(()=>{
  const scene=sceneRef.current,stage=stageRef.current;if(!scene||!stage)return;
  const fit=()=>{const w=scene.clientWidth,h=scene.clientHeight,s=Math.max(w/1500,h/780),cx=w<760?900:760;stage.style.transform=`translate(${w/2-cx*s}px,${h/2-500*s}px) scale(${s})`};
  fit();const ro=new ResizeObserver(fit);ro.observe(scene);
  let t=0;
  const io=new IntersectionObserver(([e])=>{
   if(e.isIntersecting&&e.intersectionRatio>.55){if(!t)t=window.setTimeout(()=>setLampOn(false),900)}
   else if(!e.isIntersecting){window.clearTimeout(t);t=0;setLampOn(true)}
  },{threshold:[0,.55]});
  if(rootRef.current)io.observe(rootRef.current);
  return()=>{ro.disconnect();io.disconnect();window.clearTimeout(t)};
 },[]);
 return <section ref={rootRef} className={`dhTrack tod-night dhGoodnight ${lampOn?'lampOn':'lampOff'}`} aria-label="Contact">
  <div className="dhScene" ref={sceneRef}>
   <div className="dhStage" ref={stageRef} style={{'--sh':'262px','--sy':'310px'} as React.CSSProperties} aria-hidden="true">
    <div className="dhWall"/>
    <div className="dhWindow"><div className="dhGlass"><GoldenGateView/><div className="dhMuntins"/><div className="dhReflect"/></div><div className="dhCurtain"/><div className="dhSill"><div className="dhSucculent"><i/><i/><i/><i/><i/></div></div></div>
    <div className="dhShelf"><div className="dhBooks">{BOOKS.map((b,i)=><i key={i} style={{'--c':b.c,'--f':b.f,height:b.h,width:b.w} as React.CSSProperties}>{b.t&&<span>{b.t}</span>}</i>)}</div><div className="dhStack"><i style={{'--c':'#3d5a80'} as React.CSSProperties}/><i style={{'--c':'#e8dcc4'} as React.CSSProperties}/><Mustang/></div><div className="dhPlank"/></div>
    <div className="dhImac"><div className="dhImacFace"><i className="dhImacCam"/></div><div className="dhImacChin"/><div className="dhImacStand"/><div className="dhImacFoot"/></div>
    <div className="dhScreen"/>
    <div className="dhDesk"><div className="dhDeskEdge"/></div><div className="dhWood"/>
    <div className="dhLampPool"/>
    <div className="dhTop"><div className="dhMat"><DeskKeyboard/><div className="dhMouse"/></div></div>
    <PhotoFrame eager={false}/>
    <MsuCappuccino/>
    <CanonAE1 onShoot={()=>{}}/>
    <Lamp on={lampOn} onToggle={()=>setLampOn(v=>!v)}/>
    <div className="dhShade"/>
   </div>
  </div>
  <div className="gnNote">
   <p className="gnThanks">thanks for stopping by ♡</p>
   <p className="gnLead">If you’re hiring for product, or want to trade book recs, I’d love to hear from you.</p>
   <div className="gnLinks"><a href="mailto:chinimi2@msu.edu">chinimi2@msu.edu</a><a href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="Neha_Chinimilli_Resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div>
   <span className="gnSign">— neha</span>
  </div>
 </section>
}

