import React,{useCallback,useEffect,useLayoutEffect,useRef,useState} from 'react';
import {getLenis,initAnchors} from './smoothScroll';
import {pageY} from './perfMode';
import {waitForSceneImages} from './sceneReadiness';
import './desk-hero.css';
import {createPortal} from 'react-dom';
import WatercolorPaper,{watercolorName} from './WatercolorPaper';
import {Candle,DeskTips,SnowGlobe,TumblerFlask} from './DeskProps';
import './desk-materials.css';
import {CASE_FILES,HOME_SHOWN,isParked,maximizeInto} from './CaseWindow';
import {ShelbyMark} from './CarArt';
import FlatText from './FlatText';

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
 {src:'desk/print-04.jpg',pos:'50% 50%',cap:'presidio',r:-5},
 {src:'desk/print-01.jpg',pos:'50% 50%',cap:'baker beach',r:4},
 {src:'desk/print-06.jpg',pos:'50% 40%',cap:'tahoe',r:-3},
 {src:'desk/print-10.jpg',pos:'50% 50%',cap:'painted ladies',r:6}
];

const cl=(v:number)=>Math.max(0,Math.min(1,v));
const L=(a:number,b:number,t:number)=>a+(b-a)*t;
const io=(t:number)=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const out3=(t:number)=>1-Math.pow(1-t,3);

const ORDER:Tod[]=['morning','day','evening','night'];
const todFor=(h:number):Tod=>h>=5&&h<11?'morning':h>=11&&h<17?'day':h>=17&&h<20?'evening':'night';
const GREETING:Record<Tod,string>={morning:'good morning',day:'good afternoon',evening:'good evening',night:'hey night owl'};

// Room geometry, in stage pixels (the stage is a 1600×1000 set).
const SW=420,SX=630,SCREEN_BOTTOM=572;
const TRACK_VH=280,ANCHOR_P=.9,ROOM_ZOOM=.92;

// The sun's path on the bay: sparkles crowd near the horizon and spread out and grow toward the viewer.
const GLITTER=Array.from({length:30},(_,j)=>{const t=j/29,y=237+t*t*90,spread=3+t*24,x=226+Math.sin(j*12.99)*spread,w=2+t*9+Math.abs(Math.sin(j*7.3))*4;return [x-w/2,y,w,.7+t*.9]});
// Soft clouds built from gradient puffs (no filters, so zooming in on the room stays cheap).
const CLOUDS:[number,number,number,number][][]=[
 [[44,62,34,7],[70,57,26,8],[96,63,30,6],[60,66,40,4]],
 [[140,40,18,4],[156,37,14,4.5],[170,41,16,3.5]],
 [[18,178,30,7],[44,172,22,9],[66,178,26,6]],
 [[262,170,26,6],[282,166,20,8],[300,172,22,5]]
];

// A little illustrated postcard of Neha's SF summer, shown only on phones.
// Motion stays inside the window: bay traffic, a cable car, marine fog and night sky.
/* The quieter bay to the left of the original SF neighborhood view. */
function SummerBayExtension(){
 const id=React.useId().replace(/:/g,'');
 return <svg className="dhView dhBayExtension" viewBox="-300 0 300 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
   <linearGradient id={`${id}Sky`} x2="0" y2="1"><stop className="sky1"/><stop offset="1" className="sky3"/></linearGradient>
   <linearGradient id={`${id}Bay`} x2="0" y2="1"><stop className="bay1"/><stop offset="1" className="bay2"/></linearGradient>
  </defs>
  <rect x="-300" width="300" height="330" fill={`url(#${id}Sky)`}/>
  <g className="sfSummerNight" fill="#fff6d9" opacity=".65"><circle cx="-218" cy="29" r="1"/><circle cx="-119" cy="51" r="1.2"/><circle cx="-49" cy="26" r="1"/></g>
  <path d="M-300 143Q-250 109-204 120T-113 130Q-55 112 0 134V184H-300Z" fill="#738e88" opacity=".55"/>
  <rect x="-300" y="148" width="300" height="103" fill={`url(#${id}Bay)`}/>
  <path d="M-175 158H0M-175 150Q-91 166 0 146M-131 155V158M-89 155V158M-45 153V158" fill="none" stroke="#c66648" strokeWidth="1.5"/>
  <g fill="#e1e6e0" opacity=".22"><ellipse cx="-145" cy="143" rx="115" ry="9"/><ellipse cx="-16" cy="145" rx="55" ry="7"/></g>
  <g fill="none" stroke="#e0ece7" strokeWidth=".8" opacity=".22"><path d="M-254 187h44M-134 204h37M-224 222h53M-66 190h28"/></g>
  <path d="M-300 277Q-237 270-191 258T-95 244Q-45 234 0 239V330H-300Z" fill="#596c62"/>
  <path d="M-300 321L0 306V330H-300Z" fill="#505760"/>
 </svg>;
}

function SanFranciscoSummerView(){
 const id=React.useId().replace(/:/g,''),view=useRef<SVGSVGElement>(null);
 useEffect(()=>{
  const node=view.current;if(!node)return;
  const observer=new IntersectionObserver(([entry])=>node.getAnimations({subtree:true}).forEach(a=>{
   if(a.effect?.getTiming().iterations===Infinity)entry.isIntersecting?a.play():a.pause();
  }));observer.observe(node);return()=>observer.disconnect();
 },[]);
 return <svg ref={view} className="dhView dhSummerScene" viewBox="0 0 300 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
   <linearGradient id={`${id}Sky`} x2="0" y2="1"><stop className="sky1"/><stop offset="1" className="sky3"/></linearGradient>
   <linearGradient id={`${id}Bay`} x2="0" y2="1"><stop className="bay1"/><stop offset="1" className="bay2"/></linearGradient>
   <linearGradient id={`${id}Streak`}><stop stopColor="#fff4cf" stopOpacity="0"/><stop offset="1" stopColor="#fff4cf"/></linearGradient>
  </defs>
  <rect width="300" height="330" fill={`url(#${id}Sky)`}/>
  <circle className="sfSummerSun" cx="65" cy="61" r="21" fill="#ffdfaa" opacity=".85"/>
  <g className="sfSummerNight" fill="#fff6d9">{[[22,25],[48,43],[105,24],[138,52],[182,31],[231,19],[268,48]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%2?1.2:1.7}/>)}</g>
  <g className="sfSummerNight"><g className="sfShootingStar"><path d="M-38 -14L0 0" stroke={`url(#${id}Streak)`} strokeWidth="1.5"/><circle r="1.6" fill="#fff4cf"/></g></g>
  <path d="M0 134Q46 99 92 119T188 126Q236 98 300 124V184H0Z" fill="#738e88" opacity=".55"/>
  <rect y="148" width="300" height="103" fill={`url(#${id}Bay)`}/>
  {/* The bridge remains a small, familiar landmark beyond the neighborhood. */}
  <g fill="none" stroke="#c66648" strokeWidth="2"><path d="M0 158H155M39 157V115H46V157M113 157V119H120V157M0 146Q25 147 42 117Q76 168 116 121Q136 152 155 150"/><path d="M18 151V158M61 142V158M80 150V158M97 143V158M136 147V158" strokeWidth=".8"/></g>
  <g fill="#536977"><path d="M180 151V129H191V119H202V151M205 151V115H216V107H223V151M231 151L241 91L251 151M261 151V118Q261 90 273 88Q285 90 285 118V151M288 151V126H300V151"/><path d="M273 88V151" stroke="#98b2ba" strokeWidth="1"/></g>
  <g className="sfSummerFog" fill="#e1e6e0" opacity=".25"><ellipse cx="85" cy="143" rx="100" ry="9"/><ellipse cx="241" cy="148" rx="86" ry="7"/></g>
  <g className="sfSummerFerry"><path d="M0 200H36L30 209H8Z" fill="#faf2da"/><path d="M7 199V190H28V199M13 189V184H22V189" fill="#d2ddd8"/><path d="M10 194H25" stroke="#536977" strokeWidth="3"/><path d="M-12 212H34" stroke="#e0ece7" strokeWidth="1" opacity=".65"/></g>
  <path d="M0 239L300 201V330H0Z" fill="#596c62"/>
  {/* Painted Lady silhouettes, bay windows and warm rooms on a sloping street. */}
  {[['#bd958c',-7,205],['#d3bb80',43,199],['#94b8b1',93,193],['#a898bc',143,187],['#caa286',193,181],['#9aaf99',243,175]].map(([color,x,y],i)=>{
   const left=x as number,top=y as number;
   return <g key={i} transform={`translate(${left} ${top})`}>
    <path d="M0 21L24 0L48 21V84H0Z" fill={color as string}/>
    <path d="M-3 22L24-2L51 22M0 29H48M0 61H48" fill="none" stroke="#f4e3c6" strokeWidth="3"/>
    <path d="M18 14L24 8L30 14V22H18Z" fill="#405b64" stroke="#ead6b7" strokeWidth="2"/>
    <path d="M10 34L19 31H31L39 34V58L31 61H19L10 58Z" fill="#f1ddba"/>
    {[14,25,34].map(wx=><rect key={wx} className="sfSummerWindow" x={wx-3} y="36" width="6" height="17" rx=".6"/>)}
    <path d="M22 84V67H32V84" fill="#4d6064"/><path d="M5 84V70H14V84" fill="#6c8285"/>
   </g>;
  })}
  <path d="M0 306L300 259V330H0Z" fill="#505760"/>
  <path d="M0 313L300 266M0 323L300 276" stroke="#9eacac" strokeWidth="1.1"/>
  <g className="sfSummerCableCar"><g transform="rotate(-9)">
   <path d="M0 0H51V25H0Z" fill="#b9603f" stroke="#392e29" strokeWidth="1"/><path d="M-3-4H54V1H-3Z" fill="#efc781"/>
   <path d="M3 3H47V14H3Z" fill="#edd7a4"/>
   {[7,18,29,40].map(x=><rect key={x} x={x-3} y="4" width="6" height="9" fill="#43575e"/>)}
   <path d="M0 19H51" stroke="#e7b461" strokeWidth="3"/><circle cx="9" cy="26" r="3" fill="#303738"/><circle cx="43" cy="26" r="3" fill="#303738"/>
   <circle cx="48" cy="17" r="1.7" fill="#fff1b5"/>
  </g></g>
  <g className="sfSummerNight">{[[87,101,'#f1cf8e',-16],[174,86,'#e5a999',-10]].map(([x,y,color,delay],i)=><g key={i} transform={`translate(${x} ${y})`}>
   <g className="sfSummerFirework" style={{animationDelay:`${delay}s`}} stroke={color as string} strokeWidth="1.2" strokeLinecap="round">
    {Array.from({length:12},(_,j)=>{const a=j*Math.PI/6;return <path key={j} d={`M${Math.cos(a)*9} ${Math.sin(a)*9}L${Math.cos(a)*22} ${Math.sin(a)*22}`}/>})}
   </g>
  </g>)}</g>
 </svg>;
}

function GoldenGateView(){
 // Per-instance ids: the hero and the footer each draw this view at a different time of day.
 const u=React.useId().replace(/:/g,'');
 // Decorative weather, shared by both windows and stable for the visitor's local day.
 // Three days out of each seven get a marine layer; this is not a live forecast.
 const [foggy]=useState(()=>{const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000)%7<3});
 const viewRef=useRef<SVGSVGElement>(null);
 useEffect(()=>{
  const view=viewRef.current;if(!view)return;
  const observer=new IntersectionObserver(([entry])=>{
   view.getAnimations({subtree:true}).forEach(a=>{if(a.effect?.getTiming().iterations===Infinity)entry.isIntersecting?a.play():a.pause()});
  });
  observer.observe(view);return()=>observer.disconnect();
 },[]);
 return <svg ref={viewRef} className={`dhView ${foggy?'isFoggy':'isClear'}`} viewBox="0 0 300 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
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
   <radialGradient id={`dhPuff${u}`} cx=".5" cy=".42" r=".5"><stop offset="0" className="cloud1"/><stop offset=".55" className="cloud2"/><stop offset="1" className="cloud3"/></radialGradient>
   <radialGradient id={`dhCore${u}`}><stop offset="0" className="core1"/><stop offset=".6" className="core2"/><stop offset="1" className="core3"/></radialGradient>
   <radialGradient id={`dhBloom${u}`}><stop offset="0" className="bloom1"/><stop offset="1" className="bloom2"/></radialGradient>
   {/* Backlit hills: the face toward us sits in shade, darkest at the waterline. */}
   <linearGradient id={`dhHillShade${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".28"/></linearGradient>
   <linearGradient id={`dhMeteor${u}`}><stop stopColor="#fff4cf" stopOpacity="0"/><stop offset="1" stopColor="#fff4cf"/></linearGradient>
  </defs>
  <rect width="300" height="330" fill={`url(#dhSky${u})`}/>
  <g className="dhSunDisc"><circle cx="226" cy="92" r="150" fill={`url(#dhBloom${u})`}/><circle cx="226" cy="92" r="46" fill={`url(#dhHalo${u})`}/><circle cx="226" cy="92" r="17" fill={`url(#dhCore${u})`}/></g>
  <g className="dhClouds">{CLOUDS.map((c,i)=><g key={i}>{c.map(([x,y,rx,ry],k)=><ellipse key={k} cx={x} cy={y} rx={rx} ry={ry} fill={`url(#dhPuff${u})`}/>)}</g>)}</g>
  <g className="dhStars">{[[30,40],[70,22],[120,52],[180,30],[250,46],[280,20],[150,14],[210,70]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3?0.9:1.3}/>)}</g>
  <g className="dhNightSky"><g className="dhMeteor"><path d="M-34 -16L0 0" stroke={`url(#dhMeteor${u})`} strokeWidth="1.2"/><circle r="1.2" fill="#fff4cf"/></g></g>
  <g className="dhDayLife dhGulls">{[0,1,2].map(i=><g key={i} className="dhGullFlight" style={{animationDelay:`${-i*11}s`}}><g transform={`translate(${-i*13} ${i*6})`}><path className="dhGullWings" d="M-5 -1Q-2 -4 0 0Q2 -4 5 -1"/></g></g>)}</g>
  {/* Distant ridge, far shore, then the near headland: each step back is paler and bluer. */}
  <path className="dhRidge" d="M150 224C176 206 200 200 226 204C252 208 276 196 300 192V236H150Z"/>
  <path className="dhRim dhRimFar" d="M150 224C176 206 200 200 226 204C252 208 276 196 300 192"/>
  <path className="dhHillFar" d="M0 214C30 196 58 180 96 186C120 190 136 204 160 210L160 236H0Z"/>
  <path className="dhHillFar" d="M300 206C274 200 250 206 232 216C218 224 208 232 196 236H300Z"/>
  <path d="M0 214C30 196 58 180 96 186C120 190 136 204 160 210L160 236H0ZM300 206C274 200 250 206 232 216C218 224 208 232 196 236H300Z" fill={`url(#dhHillShade${u})`}/>
  <path className="dhRim" d="M0 214C30 196 58 180 96 186C120 190 136 204 160 210M300 206C274 200 250 206 232 216"/>
  <rect y="186" width="300" height="52" fill={`url(#dhHaze${u})`}/>
  <path className="dhHillNear" d="M0 226C22 208 44 200 70 206C88 210 98 222 112 232L112 250H0Z"/>
  <path d="M0 226C22 208 44 200 70 206C88 210 98 222 112 232L112 250H0Z" fill={`url(#dhHillShade${u})`}/>
  <path className="dhRim" d="M0 226C22 208 44 200 70 206C88 210 98 222 112 232"/>
  <rect y="234" width="300" height="96" fill={`url(#dhBay${u})`}/>
  {/* The sky's reflection brightens the water toward the horizon. */}
  <rect y="234" width="300" height="34" fill={`url(#dhSheen${u})`}/>
  <g className="dhGlint dhGlitter">{GLITTER.map(([x,y,w,h],i)=><rect key={i} x={x} y={y} width={w} height={h} rx={h/2}/>)}</g>
  <g className="dhBridgeRef" mask={`url(#dhRefMask${u})`}><rect x="77" y="232" width="15" height="70"/><rect x="218" y="230" width="12.4" height="44"/><path d="M-6 232L306 222L306 226L-6 237Z"/></g>
  <g className="dhWaves">{[246,262,280,300,318].map((y,i)=><path key={y} d={`M-40 ${y}q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0q5 -2.2 10 0q5 2.2 10 0`} style={{animationDuration:`${7+i*1.6}s`,opacity:.18+i*.03}}/>)}</g>
  <g className="dhGlint">{[[40,258,8],[130,270,12],[180,250,6],[90,292,10],[150,306,12],[60,318,14]].map(([x,y,w],i)=><rect key={i} x={x} y={y} width={w} height="1.2" rx=".6"/>)}</g>
  <g className="dhDayLife dhBoats">
   <g className="dhSailCrossing"><g className="dhBoatBob">
    <path className="dhBoatWake" d="M-25 2Q-17 0 -9 2M-31 5L-13 4"/>
    <path className="dhBoatHull" d="M-10 0H10L6 4H-6Z"/>
    <path className="dhBoatMast" d="M0 0V-25"/>
    <path className="dhBoatSail" d="M-1 -24L-1 -3H-12ZM2 -21L11 -3H2Z"/>
   </g></g>
   <g className="dhLaunchCrossing"><g className="dhBoatBob">
    <path className="dhBoatWake" d="M9 2Q20 0 32 3M13 5L39 6"/>
    <path className="dhBoatHull" d="M-9 0H9L6 3H-5Z"/>
    <path className="dhBoatSail" d="M-3 0V-4H4L7 0Z"/>
   </g></g>
  </g>
  {/* The bridge, International Orange, receding from the Presidio side */}
  <g className="dhBridge">
   <path className="dhCable" d="M-6 196Q40 222 82 118Q150 214 222 136Q256 196 306 212"/>
   <path className="dhCableRim" d="M-6 195Q40 221 82 117Q150 213 222 135Q256 195 306 211"/>
   <g className="dhHangers" clipPath={`url(#dhHangClip${u})`}>{Array.from({length:34},(_,i)=>{const x=-2+i*9;return <line key={i} x1={x} x2={x} y1="0" y2="226"/>})}</g>
   <path className="dhDeck" d="M-6 224L306 214L306 219L-6 230Z"/>
   <path className="dhTruss" d="M-6 229L306 218.6L306 221L-6 232.4Z"/>
   <path className="dhCableRim" d="M-6 224L306 214"/>
   {/* Two lanes follow the deck's perspective; towers occlude the tiny cars. */}
   <g className="dhTraffic">{Array.from({length:6},(_,i)=><g key={i} className={`dhCar ${i%2?'dhCarWest':'dhCarEast'}`} style={{animationDelay:`${-i*7.7}s`,animationDuration:`${36+i%3*5}s`}}>
    <path className="dhCarBody" d="M-3 0V-1H-1.5L-.7 -2H1.2L2 -1H3V0Z" style={{fill:['#efe1c3','#596a75','#d3aa68'][i%3]}}/>
    <circle className="dhHeadlight" cx={i%2?-3:3} cy="-.6" r=".75"/><circle className="dhTaillight" cx={i%2?3:-3} cy="-.6" r=".55"/>
   </g>)}</g>
   <path className="dhPier" d="M72 229h25l1 7H71Z"/><path className="dhPier dhPierFar" d="M216 225.6h17l.6 4.6h-18.2Z"/>
   <g className="dhTower"><rect x="77" y="116" width="4" height="118"/><rect x="88" y="120" width="4" height="114"/><rect x="77" y="130" width="15" height="3"/><rect x="77" y="156" width="15" height="3"/><rect x="77" y="182" width="15" height="3"/><rect x="77" y="206" width="15" height="3"/><rect x="76.5" y="115.5" width="16" height="2.8"/><rect className="dhTowerShade" x="79.4" y="116" width="1.6" height="118"/><rect className="dhTowerShade" x="90.4" y="120" width="1.6" height="114"/><rect className="dhTowerRim" x="80.3" y="118" width=".7" height="112"/><rect className="dhTowerRim" x="91.3" y="120" width=".7" height="110"/></g>
   <g className="dhTower dhTowerFar"><rect x="218" y="134" width="3.4" height="94"/><rect x="227" y="137" width="3.4" height="91"/><rect x="218" y="146" width="12.4" height="2.6"/><rect x="218" y="166" width="12.4" height="2.6"/><rect x="218" y="186" width="12.4" height="2.6"/><rect x="218" y="204" width="12.4" height="2.6"/><rect x="217.6" y="133.6" width="13.2" height="2.2"/><rect className="dhTowerRim" x="220.8" y="137" width=".6" height="88"/><rect className="dhTowerRim" x="229.8" y="139" width=".6" height="86"/></g>
   <g className="dhBridgeLights">{Array.from({length:18},(_,i)=><circle key={i} cx={-2+i*18} cy={225-i*.55} r="1.2"/>)}<circle cx="84" cy="116" r="1.8"/><circle cx="224" cy="134" r="1.6"/></g>
  </g>
  <g className="dhFog" filter={`url(#dhFogBlur${u})`}><ellipse cx="60" cy="214" rx="90" ry="14"/><ellipse cx="220" cy="224" rx="110" ry="12"/><ellipse cx="150" cy="196" rx="70" ry="8"/></g>
 </svg>
}

function CanonAE1({onShoot}:{onShoot:()=>void}){
 // Canon AE-1 Program with the FD 50mm f/1.8: black body, chrome top plate, the prism hump.
 return <button type="button" className="dhCamera dh3d" tabIndex={-1} data-tip="Say cheese" onClick={onShoot} aria-label="Take a photo with the Canon AE-1 Program">
  <svg viewBox="0 0 200 150" aria-hidden="true">
   <defs>
    <linearGradient id="aeChrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f4f2"/><stop offset=".45" stopColor="#c9c9c6"/><stop offset=".55" stopColor="#e9e9e6"/><stop offset="1" stopColor="#9d9d9a"/></linearGradient>
    <linearGradient id="aeChromeV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#a9a9a6"/><stop offset=".35" stopColor="#f1f1ee"/><stop offset=".7" stopColor="#c4c4c1"/><stop offset="1" stopColor="#8f8f8c"/></linearGradient>
    <pattern id="aeLeather" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#1b1b1c"/><circle cx="1.5" cy="1.5" r=".7" fill="#262628"/></pattern>
    <linearGradient id="aeBarrel" x1="0" y1="0" x2="1" y2=".8"><stop stopColor="#57585a"/><stop offset=".2" stopColor="#191a1c"/><stop offset=".6" stopColor="#070809"/><stop offset="1" stopColor="#323337"/></linearGradient>
    <radialGradient id="aeGlass" cx=".4" cy=".35" r=".7"><stop offset="0" stopColor="#6d7fb8"/><stop offset=".25" stopColor="#2b2f55"/><stop offset=".6" stopColor="#101118"/><stop offset="1" stopColor="#050506"/></radialGradient>
   </defs>
   <path d="M14 118Q100 140 186 118" fill="none" stroke="#060607" strokeWidth="7"/>
   {/* top plate, dials, prism */}
   <path d="M88 7V3H113V7M92 3V0H109V3" fill="#55565a" stroke="#bdbdbb" strokeWidth="1.2"/>
   <rect x="22" y="30" width="22" height="10" rx="2" fill="url(#aeChromeV)"/><rect x="26" y="25" width="14" height="6" rx="2" fill="#1b1b1c"/>
   <rect x="148" y="28" width="28" height="12" rx="3" fill="url(#aeChromeV)"/><rect x="140" y="33" width="10" height="6" rx="2" fill="#2a2a2b"/>
   <circle cx="132" cy="36" r="4" fill="url(#aeChromeV)" stroke="#6b6b69" strokeWidth=".6"/>
   <path d="M62 40L74 10Q76 6 81 6H119Q124 6 126 10L138 40Z" fill="url(#aeChrome)" stroke="#8a8a87" strokeWidth=".6"/>
   <FlatText viewBox="0 0 200 150" markup={`<text x="100" y="31" text-anchor="middle" font-family="'Times New Roman',Georgia,serif" font-weight="700" font-size="13" fill="#161616" letter-spacing="-.2" transform="translate(100 0) scale(1.06 1) translate(-100 0)">Canon</text>`}/>
   <rect x="8" y="40" width="184" height="14" rx="4" fill="url(#aeChrome)" stroke="#8a8a87" strokeWidth=".6"/>
   <FlatText viewBox="0 0 200 150" markup={`<text x="20" y="50.5" font-family="Helvetica,Arial,sans-serif" font-weight="700" font-style="italic" font-size="7.4" fill="#161616">AE-1</text><text x="40" y="50.5" font-family="Helvetica,Arial,sans-serif" font-size="5.2" fill="#161616" letter-spacing="1">PROGRAM</text>`}/>
   {/* The right return and raised top plate make the body a solid casting. */}
   <path d="M192 44L198 49V118L192 124Z" fill="#0c0d0e" stroke="#525355" strokeWidth=".6"/>
   <path d="M8 40L15 35H64L62 40ZM138 40L135 35H183L192 40Z" fill="url(#aeChromeV)"/>
   {/* body */}
   <rect x="8" y="52" width="184" height="72" rx="7" fill="url(#aeLeather)"/>
   <rect x="8" y="52" width="184" height="72" rx="7" fill="none" stroke="#000" strokeOpacity=".5"/>
   <rect x="8" y="116" width="184" height="10" rx="5" fill="url(#aeChrome)" opacity=".9"/>
   <rect x="158" y="60" width="16" height="7" rx="2" fill="#2d2d2f" stroke="#555" strokeWidth=".5"/>
   <rect x="2" y="56" width="7" height="6" rx="1.5" fill="url(#aeChromeV)"/><rect x="191" y="56" width="7" height="6" rx="1.5" fill="url(#aeChromeV)"/>
   <circle cx="28" cy="75" r="6" fill="url(#aeChromeV)"/><path d="M28 74l-3 17" stroke="#b9b9b6" strokeWidth="3"/>
   {[16,184].map(x=><g key={x}><circle cx={x} cy="47" r="1.5" fill="#686868"/><path d={`M${x-1} 47h2`} stroke="#d9d9d4" strokeWidth=".5"/></g>)}
   <ellipse cx="103" cy="95" rx="39" ry="36" fill="#070708"/>
   {/* A projecting lens barrel: rear mount behind the offset front ring. */}
   <circle cx="103" cy="89" r="38" fill="url(#aeChromeV)"/>
   <path d="M68 81C63 102 75 126 99 126C123 126 138 107 138 85L135 78C131 58 72 58 68 81Z" fill="url(#aeBarrel)"/>
   <path d="M72 104Q103 129 131 104M73 108Q103 132 128 109" fill="none" stroke="#747478" strokeOpacity=".35" strokeWidth=".8"/>
   {/* FD 50mm f/1.8 */}
   <circle cx="100" cy="90" r="35" fill="#101011"/>
   <circle cx="100" cy="90" r="35" fill="none" stroke="#2c2c2e" strokeWidth="5" strokeDasharray="1.4 1.4"/>
   <circle cx="100" cy="90" r="28.5" fill="#18181a" stroke="url(#aeChromeV)" strokeWidth="2.2"/>
   <circle cx="100" cy="90" r="22.2" fill="#030406" stroke="#6a6870" strokeWidth=".7"/>
   <circle cx="100" cy="90" r="21" fill="url(#aeGlass)"/>
   <path d="M99 81l8 3 3 8-6 7-9-1-5-8 4-7Z" fill="#03050b" opacity=".7"/><path d="M85 82q11-13 23-4" stroke="#98aecb" strokeOpacity=".4" fill="none"/>
   <circle cx="100" cy="90" r="13.5" fill="none" stroke="#3a4274" strokeOpacity=".7"/>
   <path d="M85 75L94 72L99 82L89 86Z" fill="#dbeaf6" opacity=".22"/>
   <path d="M86 76L96 82M91 74L95 83" stroke="#fff" strokeOpacity=".3" strokeWidth=".6"/>
   <circle cx="108" cy="98" r="1.8" fill="#fff" opacity=".18"/>
   <FlatText viewBox="0 0 200 150" markup={`<defs><path id="arc" d="M76 90a24 24 0 0 1 48 0"/></defs><text font-family="Helvetica,Arial,sans-serif" font-size="3.6" fill="#cfcfcc" letter-spacing=".5"><textPath href="#arc" startOffset="50%" text-anchor="middle">CANON LENS FD 50mm 1:1.8</textPath></text>`}/>
  </svg>
 </button>
}

function MsuCappuccino(){
 // Cappuccino in an MSU mug on a saucer, with a latte-art heart. Click for a sip.
 // Drawn from a reference photo of a cappuccino seen from about 30° above: a thick cream
 // lip with the inside wall showing at the back; crema with a dark meniscus, fine pale
 // bubbles and gentle mottling; a soft heart (lobes away, point toward you) with a pale
 // halo; a satin glaze darker at the sides and foot with a warm bounce from the saucer.
 const [sip,setSip]=useState(0);
 const [drinking,setDrinking]=useState(false);
 // Press and hold: the steam writes "hi" for a moment, then drifts apart. A hold isn't a sip.
 const [hi,setHi]=useState(0);
 const hold=useRef({timer:0,held:false});
 useEffect(()=>{if(!hi)return;const t=window.setTimeout(()=>setHi(0),3000);return()=>window.clearTimeout(t)},[hi]);
 useEffect(()=>{
  if(!drinking)return;
  const lower=window.setTimeout(()=>setSip(v=>Math.min(5,v+1)),420);
  const settle=window.setTimeout(()=>setDrinking(false),1200);
  return ()=>{window.clearTimeout(lower);window.clearTimeout(settle)};
 },[drinking]);
 useEffect(()=>{
  if(sip!==5)return;
  const refill=window.setTimeout(()=>setSip(0),1800);
  return ()=>window.clearTimeout(refill);
 },[sip]);
 const heart='M0 14C-10 8-18 1-18-6C-18-12-13.5-16-9-16C-4.5-16-1.5-13 0-10C1.5-13 4.5-16 9-16C13.5-16 18-12 18-6C18 1 10 8 0 14Z';
 return <button type="button" tabIndex={-1} className={`dhCappa dh3d ${drinking?'isSip':''} ${hi?'isHi':''}`} data-tip={sip===5?'Refilling…':'Take a sip · or hold'} aria-label={sip===5?'Empty cup, refilling':`Take a sip of coffee, ${100-sip*20}% remaining`} aria-disabled={drinking||sip===5} onPointerDown={()=>{hold.current.held=false;window.clearTimeout(hold.current.timer);hold.current.timer=window.setTimeout(()=>{hold.current.held=true;if(sip<5)setHi(v=>v+1)},550)}} onPointerUp={()=>window.clearTimeout(hold.current.timer)} onPointerLeave={()=>window.clearTimeout(hold.current.timer)} onClick={()=>{if(hold.current.held){hold.current.held=false;return}if(!drinking&&sip<5)setDrinking(true)}} style={{'--coffee-steam':sip===5?0:1-sip*.14} as React.CSSProperties}><svg className="dhSteam" viewBox="0 0 60 80" aria-hidden="true"><path d="M19 78C8 64 30 57 20 43S12 22 24 5"/><path d="M32 79C46 65 22 55 34 39S44 20 32 0"/><path d="M42 78C32 67 49 56 42 46S36 28 47 15"/></svg>
  {hi>0&&<svg className="dhSteamHi" key={hi} viewBox="0 0 60 70" aria-hidden="true"><path d="M14 52C15 38 17 22 19 10M18 38C22 30 30 30 30 38V52"/><path d="M41 52V36"/><path d="M40.6 26.4l.9.9"/></svg>}
  <svg viewBox="0 0 120 104" aria-hidden="true">
   <defs>
    {/* Glaze: a cylinder lit from the front left, satin rather than glossy. */}
    <linearGradient id="msuBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0a2a21"/><stop offset=".12" stopColor="#153f33"/><stop offset=".38" stopColor="#23604d"/><stop offset=".55" stopColor="#2b6f5a"/><stop offset=".78" stopColor="#1a4d3f"/><stop offset=".93" stopColor="#0f3329"/><stop offset="1" stopColor="#0a261e"/></linearGradient>
    <linearGradient id="msuShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity=".18"/><stop offset=".14" stopColor="#000" stopOpacity="0"/><stop offset=".72" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".38"/></linearGradient>
    <linearGradient id="msuBounce" x1="0" y1="0" x2="0" y2="1"><stop offset=".8" stopColor="#f3e7d2" stopOpacity="0"/><stop offset="1" stopColor="#f3e7d2" stopOpacity=".2"/></linearGradient>
    <linearGradient id="msuHandle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f7560"/><stop offset=".45" stopColor="#1b4f41"/><stop offset="1" stopColor="#0b2d24"/></linearGradient>
    {/* Porcelain saucer: bright at the back, cooler toward the front edge. */}
    <radialGradient id="msuSaucer" cx=".4" cy=".25" r=".85"><stop offset="0" stopColor="#fdfcf8"/><stop offset=".55" stopColor="#efebe2"/><stop offset="1" stopColor="#d6d0c4"/></radialGradient>
    <radialGradient id="msuWell" cx=".45" cy=".35" r=".7"><stop offset="0" stopColor="#f7f4ec"/><stop offset="1" stopColor="#e0dacd"/></radialGradient>
    {/* Cream lip and inside wall. */}
    <linearGradient id="msuLip" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e2dccd"/><stop offset=".35" stopColor="#fbf8f0"/><stop offset=".75" stopColor="#f4efe3"/><stop offset="1" stopColor="#d9d2c2"/></linearGradient>
    <linearGradient id="msuWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6f1e4"/><stop offset=".6" stopColor="#ddd4c1"/><stop offset="1" stopColor="#b9ae98"/></linearGradient>
    {/* Crema: dark where it meets the wall, warm tan toward the middle. */}
    <radialGradient id="msuCrema" cx=".5" cy=".46" r=".54"><stop offset="0" stopColor="#c89a66"/><stop offset=".55" stopColor="#a8773f"/><stop offset=".86" stopColor="#7d4f24"/><stop offset="1" stopColor="#4d2e14"/></radialGradient>
    <radialGradient id="msuHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#e9cfa6" stopOpacity=".95"/><stop offset=".6" stopColor="#d7b283" stopOpacity=".55"/><stop offset="1" stopColor="#c69a66" stopOpacity="0"/></radialGradient>
    <radialGradient id="msuHeart" cx=".5" cy=".4" r=".6"><stop offset="0" stopColor="#fffcf5"/><stop offset=".75" stopColor="#fbf2e2"/><stop offset="1" stopColor="#f0dfc2"/></radialGradient>
    {/* Fine pale bubbles: sparse points pulled out of high-frequency noise. */}
    <filter id="msuBubbles" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="3.2" numOctaves="1" seed="11"/><feColorMatrix values="0 0 0 0 .97  0 0 0 0 .9  0 0 0 0 .78  0 0 0 9 -5.6"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    {/* Gentle mottling across the crema. */}
    <filter id="msuMottle" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".35 1.2" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .32  0 0 0 0 .19  0 0 0 0 .08  0 0 0 1.6 -.75"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="msuSoft" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation=".6"/></filter>
    <filter id="msuSofter" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.4"/></filter>
    <clipPath id="msuMouth"><ellipse cx="56" cy="18" rx="37.2" ry="10.1"/></clipPath>
    <clipPath id="msuLiquid"><ellipse cx="56" cy="20.2" rx="36.3" ry="9.6"/></clipPath>
    <clipPath id="msuBodyClip"><path d="M16 18L21.5 78A34.5 9.3 0 0 0 90.5 78L96 18Z"/></clipPath>
   </defs>
   {/* Saucer: underside edge, top, the well, and the mug's contact shadow in it. */}
   <ellipse cx="56" cy="89.6" rx="53.5" ry="13.4" fill="#b9b2a5"/>
   <ellipse cx="56" cy="88" rx="53.5" ry="13.4" fill="url(#msuSaucer)"/>
   <ellipse cx="56" cy="87.6" rx="52.6" ry="12.9" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth=".7"/>
   <ellipse cx="56" cy="87" rx="37" ry="9.4" fill="url(#msuWell)"/>
   <ellipse cx="56" cy="87.4" rx="37" ry="9.4" fill="none" stroke="#c9c2b4" strokeWidth=".9"/>
   <ellipse cx="59" cy="85.6" rx="36" ry="8.2" fill="#1e1a12" opacity=".2" filter="url(#msuSofter)"/>
   <ellipse cx="57" cy="84.6" rx="33" ry="6.4" fill="#120d07" opacity=".3" filter="url(#msuSoft)"/>
   {/* Where the foot meets the well: a thin dark line, so the mug sits rather than floats. */}
   <path d="M22.5 79A34 8.8 0 0 0 89.5 79" fill="none" stroke="#0b0806" strokeOpacity=".55" strokeWidth="1.6" filter="url(#msuSoft)"/>
   {/* Handle: a rounded loop, lit along its top. */}
   <path d="M91.5 30C110 29 112 46 104 56C98.5 63 93 64 89.5 63" fill="none" stroke="url(#msuHandle)" strokeWidth="8.6" strokeLinecap="round"/>
   <path d="M93 29.6C106 30 108.5 41 104.5 49" fill="none" stroke="#7fb7a0" strokeOpacity=".55" strokeWidth="1.4" strokeLinecap="round"/>
   <path d="M95.5 35.4C102.5 37 103 47.5 98 54.5" fill="none" stroke="#051a14" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" filter="url(#msuSoft)"/>
   {/* Body. */}
   <path d="M16 18L21.5 78A34.5 9.3 0 0 0 90.5 78L96 18Z" fill="url(#msuBody)"/>
   <g clipPath="url(#msuBodyClip)">
    <rect x="10" y="10" width="92" height="82" fill="url(#msuShade)"/>
    <rect x="10" y="10" width="92" height="82" fill="url(#msuBounce)"/>
    {/* Lines on a cylinder seen from above bow downward toward the sides. */}
    <FlatText viewBox="0 0 120 104" markup={`<defs><path id="a1" d="M25 47Q56 58 87 47"/><path id="a2" d="M29 60Q56 70 83 60"/></defs><text font-family="Helvetica,Arial,sans-serif" font-weight="800" font-size="15.5" fill="#efe9dc" fill-opacity=".95" letter-spacing=".4"><textPath href="#a1" startOffset="50%" text-anchor="middle">MSU</textPath></text><text font-family="Helvetica,Arial,sans-serif" font-weight="600" font-size="5.6" fill="#d6e3dc" fill-opacity=".9" letter-spacing="1.2"><textPath href="#a2" startOffset="50%" text-anchor="middle">SPARTANS</textPath></text>`}/>
    {/* Sheen: a broad soft band and one crisp window reflection. */}
    <path d="M37 20L39 82" stroke="#fff" strokeOpacity=".09" strokeWidth="9" filter="url(#msuSofter)"/>
    <path d="M81 22L78.5 76" stroke="#fff" strokeOpacity=".14" strokeWidth="5" strokeLinecap="round" filter="url(#msuSoft)"/>
    <path d="M84.2 24L82.2 66" stroke="#fff" strokeOpacity=".55" strokeWidth="1" strokeLinecap="round"/>
   </g>
   {/* Lip, then the mouth: the inside wall and the coffee a little below the rim. */}
   <ellipse cx="56" cy="18" rx="40" ry="11" fill="url(#msuLip)"/>
   <g clipPath="url(#msuMouth)">
    <ellipse cx="56" cy="18" rx="37.2" ry="10.1" fill="url(#msuWall)"/>
    <ellipse cx="56" cy="24" rx="30" ry="7" fill="#9b886c" opacity=".4"/>
    <g className="dhCoffeeLevel" style={{transform:`translateY(${sip*3.7}px)`,opacity:sip===5?0:1}}>
    <ellipse cx="56" cy="20.2" rx="36.3" ry="9.6" fill="#3b2210"/>
    <g clipPath="url(#msuLiquid)">
     <ellipse cx="56" cy="20.4" rx="35.4" ry="9.1" fill="url(#msuCrema)"/>
     <ellipse cx="56" cy="20.4" rx="35.4" ry="9.1" fill="#fff" filter="url(#msuMottle)" opacity=".7"/>
     <ellipse cx="56" cy="20.4" rx="35.4" ry="9.1" fill="#fff" filter="url(#msuBubbles)" opacity=".55"/>
     {/* The heart, lying in the foam: halo, a soft outer edge, the body, a faint inner ring and the pull-through. */}
     <ellipse cx="56" cy="20.6" rx="24" ry="6" fill="url(#msuHalo)" opacity=".7" filter="url(#msuSoft)"/>
     <g transform="translate(56 20.5) scale(1.12 .3)">
      <path d={heart} fill="#ecd9b8" opacity=".55" filter="url(#msuSoft)" transform="scale(1.06)"/>
      <path d={heart} fill="url(#msuHeart)"/>
      <path d="M0-10C.4-2 .2 6 0 12.5" fill="none" stroke="#c39a6c" strokeOpacity=".45" strokeWidth="1.1" strokeLinecap="round"/>
     </g>
     {/* A soft sheen on the far side of the surface. */}
     <ellipse cx="44" cy="15.6" rx="11" ry="1.6" fill="#fff" opacity=".22" filter="url(#msuSoft)"/>
    </g>
    </g>
    {/* The near wall hides the front edge of the coffee in a little shade. */}
    <ellipse cx="56" cy="30.2" rx="38" ry="4" fill="#2a1a0c" opacity=".25" filter="url(#msuSoft)"/>
   </g>
   {/* Lip edges: bright along the back, a fine glaze line at the front, a specular glint. */}
   <path d="M17 17.4A39 10.4 0 0 1 95 17.4" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth=".8"/>
   <path d="M16.2 18.6A39.8 10.8 0 0 0 95.8 18.6" fill="none" stroke="#8d887c" strokeOpacity=".5" strokeWidth=".7"/>
   <ellipse cx="85" cy="25.6" rx="3.2" ry="1" fill="#fff" opacity=".8" transform="rotate(-24 85 25.6)"/>
  </svg>
 </button>
}

function Lamp({on=true,disco=false,onToggle}:{on?:boolean;disco?:boolean;onToggle?:()=>void}){
 return <div className={`dhLamp ${on?'isOn':''}`} role="button" tabIndex={-1} data-tip={disco?'Disco off':on?'Lamp off':'Lamp on'} onClick={onToggle}>
  <svg viewBox="0 0 200 320" aria-hidden="true">
   <defs>
    <linearGradient id="lampShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#141312"/><stop offset=".55" stopColor="#3c3a38"/><stop offset=".78" stopColor="#5a5754"/><stop offset="1" stopColor="#1c1b1a"/></linearGradient>
    <linearGradient id="lampBase" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#121212"/><stop offset=".62" stopColor="#3d3b39"/><stop offset=".8" stopColor="#6a6763"/><stop offset="1" stopColor="#1a1919"/></linearGradient>
    <radialGradient id="lampInner" cx=".5" cy=".9" r=".9"><stop offset="0" stopColor="#fff3cf"/><stop offset=".5" stopColor="#e9c98a"/><stop offset="1" stopColor="#8c7450"/></radialGradient>
    <filter id="lampBlur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>
   </defs>
   <g transform="translate(200 0) scale(-1 1)">
   <path d="M168 301Q186 307 208 298T245 301" fill="none" stroke="#292522" strokeWidth="2.3" strokeLinecap="round"/>
   <ellipse className="dhLampShadow" cx="124" cy="308" rx="52" ry="8" fill="#1c1a19" opacity=".38" filter="url(#lampBlur)"/>
   <ellipse cx="150" cy="298" rx="39" ry="10" fill="#141414"/><ellipse cx="150" cy="294" rx="38" ry="8" fill="url(#lampBase)"/><ellipse cx="150" cy="292" rx="30" ry="5" fill="#3a3836"/><path d="M160 288.5a30 5 0 0 0 18 -1.6" stroke="#9b978f" strokeOpacity=".7" fill="none"/>
   <path d="M150 292L126 176L64 104" fill="none" stroke="#3a3836" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
   <path d="M160 290L137 176L73 103" fill="none" stroke="#242423" strokeWidth="4"/><path d="M152 282L131 182L69 111" fill="none" stroke="#797772" strokeWidth="1"/>
   <path d="M142 280L122 186M118 170L74 118" fill="none" stroke="#8d8a86" strokeWidth="1.6" strokeDasharray="1.2 1.6"/>
   <path d="M126 181L143 270M122 170L83 124" stroke="#111212" strokeWidth="3.2" fill="none"/>
   <path d="M126 181L143 270M122 170L83 124" stroke="#b1aba1" strokeWidth="2" strokeDasharray=".8 2.8" fill="none"/>
   <circle cx="126" cy="176" r="7" fill="#2f2e2c" stroke="#5a5754"/><circle cx="126" cy="176" r="2.4" fill="#8d8a86"/><path d="M124.5 176h3" stroke="#222" strokeWidth=".7"/>
   <circle cx="150" cy="290" r="5" fill="#2f2e2c"/><circle cx="66" cy="106" r="5" fill="#2f2e2c"/>
   <g transform="rotate(51 58 98)"><path d="M40 78h36l2 8H38Z" fill="#2f2e2c"/><path d="M36 86h44l22 40H14Z" fill="url(#lampShade)"/><path d="M78 87l21 37" stroke="#8d8a86" strokeOpacity=".55" strokeWidth="1.2"/><ellipse cx="58" cy="126" rx="44" ry="7" fill="#1b1a19"/><ellipse cx="58" cy="126" rx="41" ry="5.8" className="dhShadeInner" fill="url(#lampInner)"/><ellipse cx="58" cy="126.5" rx="14" ry="3.2" className="dhBulb"/></g>
   </g>
  </svg>
 </div>
}

function SucculentFoliage(){
 const u=React.useId().replace(/:/g,'');
 return <svg className="dhRosette" viewBox="0 0 68 64" aria-hidden="true">
  <defs><linearGradient id={`rosette${u}`} x1="0" y1="0" x2="1" y2=".7"><stop stopColor="#c2ccb2"/><stop offset=".35" stopColor="#9bad8b"/><stop offset=".6" stopColor="#6f8b68"/><stop offset="1" stopColor="#3e614c"/></linearGradient></defs>
  <ellipse cx="34" cy="46" rx="21" ry="7" fill="#203928" opacity=".28"/>
  {[[-78,1],[-43,1.02],[0,1.04],[43,.98],[78,.96],[-108,.75],[108,.78],[-58,.65],[58,.65],[0,.67]].map(([a,k],i)=><g key={i} transform={`translate(34 44) rotate(${a}) scale(${k})`}>
   <path d="M0 3C-9 1-12-10-8-20Q-4-30 0-35Q7-26 9-16C12-4 7 3 0 3Z" fill={`url(#rosette${u})`} stroke="#cbd2b3" strokeWidth=".65"/>
   <path d="M0 1Q-2-15 0-32" fill="none" stroke="#dce0c5" strokeOpacity=".32" strokeWidth=".8"/>
   <path d="M0 2Q7-1 7-14" fill="none" stroke="#2b4d3e" strokeOpacity=".35"/>
  </g>)}
  <path d="M34 46Q23 34 34 25Q45 34 34 46Z" fill={`url(#rosette${u})`} stroke="#d4dcc3" strokeWidth=".7"/>
 </svg>
}

function PhotoFrame({eager=true}:{eager?:boolean}){
 // A 5×7 frame with my headshot. It is just a photo on the desk.
 return <div className="dhFrame" aria-hidden="true">
  <div className="dhFrameFace"><div className="dhFramePhoto"><img src={asset('headshot.jpg')} srcSet={`${asset('desk/headshot-600.jpg')} 600w, ${asset('headshot.jpg')} 1200w`} sizes="(max-width: 900px) 120px, 240px" width={1200} height={1800} alt="" loading={eager?'eager':'lazy'} decoding="async"/></div></div>
 </div>
}
function Mustang(){
 const [rev,setRev]=useState(0);
 return <div className={`dhMustang dh3d ${rev?'isRev':''}`} key={rev} data-tip="’67 Shelby GT500" onClick={()=>setRev(v=>v+1)}><div className="dhToyBody"><ShelbyMark/><img className="dhFordScript" src={asset('desk/ford-script.png')} alt="" aria-hidden="true"/></div>{rev>0&&<span className="dhVroom">vroom!</span>}</div>
}

// Where each click's bite lands, as [angle in degrees, depth] around the cookie's edge.
// Four bites show; the fifth finishes it, and a fresh one appears.
const COOKIE_BITES=5;
const BITES:[number,number][]=[[-40,1],[25,1.05],[150,.95],[210,1.1],[95,1],[290,1.15]];
// A slightly lumpy outline, so it reads as baked rather than stamped.
const COOKIE_EDGE=(()=>{const n=22,pts=Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2,r=41+Math.sin(i*2.7)*1.6+Math.cos(i*1.3)*1.1;return [50+Math.cos(a)*r,50+Math.sin(a)*r*.97]});
 return pts.map((p,i)=>{const q=pts[(i+1)%n],m=[(p[0]+q[0])/2,(p[1]+q[1])/2];return `${i?'':`M${((pts[n-1][0]+p[0])/2).toFixed(1)} ${((pts[n-1][1]+p[1])/2).toFixed(1)}`}Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`}).join('')+'Z'})();
const biteCircles=(k:number)=>BITES.slice(0,k).flatMap(([deg,d])=>{const a=deg*Math.PI/180,cx=50+Math.cos(a)*44,cy=50+Math.sin(a)*44,tx=-Math.sin(a),ty=Math.cos(a);
 return [[cx,cy,11*d],[cx+tx*9,cy+ty*9,8.5*d],[cx-tx*9,cy-ty*9,8.5*d]] as [number,number,number][]});

function CookieNapkin(){
 // A chocolate-chunk cookie on a napkin. Five bites and it's gone (crumbs left), then a
 // fresh one fades back in.
 const [bites,setBites]=useState(0);
 const [chomp,setChomp]=useState(0);
 const bite=()=>{if(bites>=COOKIE_BITES)return;const n=bites+1;setChomp(c=>c+1);setBites(n);if(n>=COOKIE_BITES)window.setTimeout(()=>setBites(0),2600)};
 const gone=bites>=COOKIE_BITES;
 const cut=biteCircles(bites);
 const last=bites>0&&!gone?BITES[bites-1]:null;
 // The cookie is drawn upright in the room, not painted onto the tilted desk plane, so it
 // keeps its thickness in every browser. It sits over the napkin's measured centre.
 const napkin=useRef<HTMLButtonElement>(null);
 const [spot,setSpot]=useState<{x:number;y:number;stage:HTMLElement}|null>(null);
 useLayoutEffect(()=>{
  const place=()=>{const n=napkin.current,st=n?.closest<HTMLElement>('.dhStage');if(!n||!st)return;
   const r=n.getBoundingClientRect(),sr=st.getBoundingClientRect(),k=sr.width/st.offsetWidth;
   setSpot({x:(r.left+r.width*.52-sr.left)/k,y:(r.top+r.height*.62-sr.top)/k,stage:st})};
  place();window.addEventListener('resize',place);return()=>window.removeEventListener('resize',place);
 },[]);
 return <><button ref={napkin} type="button" className={`dhCookie ${gone?'isGone':''}`} onClick={bite} aria-label={gone?'All gone':'Take a bite of the cookie'} data-tip={gone?'All gone… one more coming':'Take a bite'}>
  <svg viewBox="0 0 150 130" aria-hidden="true">
  <defs>
   <radialGradient id="ckBody" cx=".42" cy=".38" r=".66"><stop offset="0" stopColor="#ecc991"/><stop offset=".45" stopColor="#dcae6c"/><stop offset=".78" stopColor="#c48a48"/><stop offset=".94" stopColor="#a86c33"/><stop offset="1" stopColor="#8a5424"/></radialGradient>
   <radialGradient id="ckRim" cx=".42" cy=".36" r=".6"><stop offset=".72" stopColor="#5a3212" stopOpacity="0"/><stop offset="1" stopColor="#5a3212" stopOpacity=".45"/></radialGradient>
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
  {[[30,98,1.6],[112,34,1.3],[120,96,1.1],[36,30,1],[104,108,1.4],[24,70,.9]].slice(0,gone?6:2+bites).map(([x,y,r],i)=><ellipse key={i} cx={x} cy={y} rx={r*1.3} ry={r} fill="#c48c50"/>)}
  <g transform="translate(25 15)">
   {/* The cookie stands up off the napkin (below); on the napkin itself, just its shadow. */}
   {/* The shadow shrinks as the cookie does, and goes with the last bite. */}
   <g className="ckShadow" style={{opacity:gone?0:1-bites*.13,transition:gone?'none':undefined,transform:`scale(${1-bites*.06})`,transformOrigin:'54px 80px'}}><ellipse cx="54" cy="80" rx="44" ry="30" fill="#3a2410" opacity=".42" filter="url(#ckSoft)"/>
   <ellipse cx="52" cy="84" rx="36" ry="16" fill="#241406" opacity=".35" filter="url(#ckSoft)"/></g>
   {last&&<g key={`crumbs${chomp}`} className="ckCrumbs">{[0,1,2,3].map(i=>{const a=last[0]*Math.PI/180,x=50+Math.cos(a)*50+(i-1.5)*5,y=50+Math.sin(a)*50+(i%2)*4;return <ellipse key={i} cx={x} cy={y} rx={1.4+i%2} ry={1+i%2*.6} fill="#c48c50" style={{'--dx':`${Math.cos(a)*6+(i-1.5)*2}px`,'--dy':`${Math.sin(a)*6+3}px`} as React.CSSProperties}/>})}</g>}
  </g>
  </svg>
 </button>
  {/* Upright, facing the viewer: a domed top seen at an angle over its thick baked side. */}
  {spot&&createPortal(<svg className="ckUp" viewBox="0 0 150 72" aria-hidden="true" onClick={bite} style={{left:spot.x-75,top:spot.y-50,opacity:gone?0:1,transition:gone?'none':'opacity .6s ease'}}>
   <g transform="translate(25 4) scale(1 .52)">
   <g key={chomp} className="ckWhole" mask="url(#ckBite)">
    {/* The cookie's thickness: its baked side, darker toward the base, seen along the front edge. */}{/* The crumb inside, which a bite exposes where it cuts through the top and side. */}<path d={COOKIE_EDGE} transform="translate(0 9)" fill="#d2a468"/><path d={COOKIE_EDGE} transform="translate(0 9)" fill="#fff" filter="url(#ckTex)" opacity=".5"/>{[22,18,14,10,6,3].map((d,i)=><g key={d} transform={`translate(0 ${d})`}><path d={COOKIE_EDGE} mask="url(#ckBite)" fill={['#5e3514','#6f4119','#80501f','#935f28','#a86f33','#b98040'][i]}/></g>)}<path d={COOKIE_EDGE} fill="url(#ckBody)"/><path d={COOKIE_EDGE} fill="url(#ckRim)"/>
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
   </g>
  </svg>,spot.stage)}</>
}

function WatercolorTin(){
 // Top-down: a travel watercolor tin, lid open as a mixing tray, twelve used half-pans, and a round brush.
 const [wash,setWash]=useState(0);
 const [painting,setPainting]=useState(false);
 const pans=['#e2b33a','#e07b2e','#c9352c','#b0304f','#7a3c8c','#2d4f9e','#2f86b8','#2a8f78','#4f8a3a','#9a7b2e','#7a4a2a','#2b2b2e'];
 return <button type="button" tabIndex={-1} className={`dhPaints ${painting?'isPainting':''}`} data-tip={`Paint another little picture · ${watercolorName(wash)}`} aria-label={`Paint a new watercolor on the paper. Currently ${watercolorName(wash)}.`} onClick={()=>setWash(v=>v+1)}>
 <WatercolorPaper click={wash} onPaintingChange={setPainting}/>

 <svg className="dhWatercolorTin" viewBox="0 0 240 130" aria-hidden="true">
  <defs>
   <linearGradient id="wcTin" x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#64676a"/><stop offset=".12" stopColor="#272e32"/><stop offset=".8" stopColor="#151c20"/><stop offset="1" stopColor="#41474a"/></linearGradient>
   <linearGradient id="wcMetal" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffaf0"/><stop offset=".24" stopColor="#a9aaa5"/><stop offset=".48" stopColor="#edece4"/><stop offset=".75" stopColor="#797e7b"/><stop offset="1" stopColor="#d7d6cb"/></linearGradient>
   <linearGradient id="wcEnamel" x1="0" y1="0" x2=".5" y2="1"><stop stopColor="#fffdf3"/><stop offset=".6" stopColor="#e9e6da"/><stop offset="1" stopColor="#c8c7bb"/></linearGradient>
   <radialGradient id="wcPigment" cx=".48" cy=".45" r=".7"><stop stopColor="#090b0a" stopOpacity=".32"/><stop offset=".52" stopColor="#090b0a" stopOpacity=".05"/><stop offset="1" stopColor="#090b0a" stopOpacity=".5"/></radialGradient>
   <linearGradient id="wcBrushWood" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#df9872"/><stop offset=".3" stopColor="#9c4e31"/><stop offset=".75" stopColor="#713321"/><stop offset="1" stopColor="#3a231c"/></linearGradient>
  </defs>
  {/* The open lid lies on the same desk plane; a narrow rolled edge gives the tin thickness. */}
  <rect x="3" y="13" width="113" height="113" rx="7" fill="#727773"/>
  <rect x="3" y="9" width="113" height="113" rx="7" fill="url(#wcMetal)" stroke="#767b78" strokeWidth=".8"/>
  <rect x="6" y="12" width="107" height="106" rx="5" fill="url(#wcEnamel)"/>
  {[[12,18,'#2f86b8'],[62,18,'#b0304f'],[12,69,'#e2b33a'],[62,69,'#2a8f78']].map(([x,y,c],i)=><g key={i} transform={`translate(${x} ${y})`}>
   <rect width="44" height="43" rx="5" fill="#b7b7ac"/>
   <rect x="1" y="1.8" width="42" height="40" rx="4" fill="url(#wcEnamel)" stroke="#fffdf4" strokeWidth=".7"/>
   <path d="M9 27Q2 12 18 13T34 25Q28 36 15 32Z" fill={c as string} opacity=".19"/>
   <path d="M9 27Q5 20 12 18M17 32Q30 34 34 25" fill="none" stroke={c as string} strokeWidth="1.2" opacity=".32"/>
   <ellipse cx="25" cy="24" rx="10" ry="7" fill={c as string} opacity=".12"/>
  </g>)}
  <path d="M9 14H108M7 20v86" fill="none" stroke="#fffdf5" strokeWidth="1"/>
  <rect x="115" y="13" width="6" height="108" fill="#585e5c"/>
  {[29,87].map(y=><g key={y}><rect x="112" y={y} width="12" height="16" rx="2" fill="url(#wcMetal)" stroke="#6c736f" strokeWidth=".6"/><path d={`M118 ${y+1}v14`} stroke="#fffdf5" strokeWidth="1"/></g>)}
  <rect x="120" y="13" width="117" height="114" rx="7" fill="#11181b"/>
  <rect x="119" y="9" width="118" height="113" rx="7" fill="url(#wcTin)" stroke="#929792" strokeWidth="1"/>
  <rect x="123" y="13" width="110" height="105" rx="4" fill="#10171a" stroke="#707775" strokeWidth=".8"/>
  {pans.map((c,i)=>{const col=i%4,row=Math.floor(i/4),x=127+col*26,y=18+row*32;return <g key={c}>
   <rect x={x} y={y+1.8} width="23" height="28" rx="2" fill="#62675f"/>
   <rect x={x} y={y} width="23" height="27" rx="2" fill="url(#wcEnamel)"/>
   <rect x={x+2} y={y+2} width="19" height="23" rx="1.8" fill={c}/>
   <rect x={x+2} y={y+2} width="19" height="23" rx="1.8" fill="url(#wcPigment)"/>
   <path d={`M${x+5} ${y+17}q5 ${-5-i%3} 13 -3M${x+6} ${y+20}l8 -2`} fill="none" stroke="#f5e5c7" strokeOpacity=".19" strokeWidth=".7"/>
   <path d={`M${x+3} ${y+3}h17`} stroke="#100f0b" strokeOpacity=".35"/>
   <ellipse cx={x+9+i%3} cy={y+11} rx="4" ry="2.5" fill="#fff8df" opacity=".12"/>
  </g>})}
  <path d="M125 10h104M121 16v98" stroke="#c3ccc7" strokeOpacity=".5" fill="none"/>
  <path d="M170 122v3h17v-3" fill="url(#wcMetal)" stroke="#858c86" strokeWidth=".6"/>
  {/* A tapered lacquer handle, crimped ferrule and individual wet bristles. */}
  <g transform="rotate(-24 150 70)">
   <g key={wash} className="dhRestingBrush">
    <path d="M62 72L221 72L245 73" fill="none" stroke="#101513" strokeOpacity=".25" strokeWidth="7" strokeLinecap="round"/>
    <path d="M59 68Q56 69 61 70L208 72V65Z" fill="url(#wcBrushWood)"/>
    <path d="M68 68L204 66.3" stroke="#efba8b" strokeOpacity=".6" strokeWidth=".7"/>
    <path d="M207 65L224 65.5V71.5L207 72Z" fill="url(#wcMetal)" stroke="#828781" strokeWidth=".5"/>
    <path d="M211 65.5v6M214 65.5v6M221 66v5" stroke="#555d56" strokeOpacity=".7" strokeWidth=".6"/>
    <path d="M224 65.5C232 64 240 68 248 69C239 70 232 74 224 71.5Z" fill="#503528"/>
    {[0,1,2,3].map(i=><path key={i} d={`M225 ${66+i*1.5}Q235 ${67+i*.8} 247 69`} fill="none" stroke={i%2?'#bb8b59':'#231d18'} strokeWidth=".55" opacity=".75"/>)}
    <path d="M239 67.8L248 69L239 70.4Q242 69 239 67.8" fill={pans[wash%pans.length]}/>
   </g>
  </g>
 </svg></button>
}

function DeskKeyboard({onKey}:{onKey?:(k:string)=>void}){
 const rows=[['esc','☀','☀','▦','⌕','◉','◀','▶','▶','◁','◁','▷','⏻'],['`','1','2','3','4','5','6','7','8','9','0','−','=','delete'],['tab','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],['caps','A','S','D','F','G','H','J','K','L',';',"'",'return'],['shift','Z','X','C','V','B','N','M',',','.','/','shift'],['fn','control','option','⌘','space','⌘','option','◀','▲','▼','▶']];
 // data-k is what the key types, so the room's keyboard can light up the key you pressed.
 const typed=(key:string)=>key==='space'?' ':key==='delete'?'Backspace':key.length===1&&/[\x21-\x7e]/.test(key)?key.toLowerCase():'';
 return <div className="dhKeyboard" aria-hidden="true">{rows.map((row,r)=><div className="dhKeyRow" key={r}>{row.map((key,i)=>{const k=typed(key);return <span key={i} data-k={k||undefined} className={key==='space'?'dhSpace':key.length>1?'dhModifier':''} onClick={k&&onKey?e=>{e.stopPropagation();onKey(k)}:undefined}>{key==='space'?'':key}</span>})}</div>)}</div>;
}

function Glyph({d}:{d:string}){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d}/></svg>}
// The GitHub mark is a filled silhouette, not a stroke glyph like the rest of the dock.
function GithubGlyph(){return <svg viewBox="0 0 24 24" aria-hidden="true" className="dhGithubMark"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.9 10.9 0 0 1 5.75 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.2.67.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/></svg>}
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
 const progRef=useRef<HTMLDivElement>(null),dockRef=useRef<HTMLElement>(null),toastRef=useRef<HTMLDivElement>(null);
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
 const manualTod=useRef(false);
 const [flash,setFlash]=useState(0);
 useEffect(()=>{if(!flash)return;const timer=window.setTimeout(()=>setFlash(0),2000);return()=>window.clearTimeout(timer)},[flash]);
 // Window latch: every other click opens it a crack; each opening replays the curtain's breeze.
 const [air,setAir]=useState(0);
 const [lampOn,setLampOn]=useState(true);
 // Typing at the desk shows up in hello.txt on the iMac; ↑↑↓↓←→←→BA throws a disco.
 const [typed,setTyped]=useState('');
 const [disco,setDisco]=useState(false);
 const keyboardRef=useRef<HTMLDivElement>(null),pNow=useRef(0);
 const pressKey=useCallback((k:string)=>{
  const el=keyboardRef.current?.querySelector<HTMLElement>(`[data-k="${CSS.escape(k.toLowerCase())}"]`);
  if(el){el.classList.remove('isDown');void el.offsetWidth;el.classList.add('isDown');window.setTimeout(()=>el.classList.remove('isDown'),140)}
  setTyped(t=>k==='Backspace'?t.slice(0,-1):(t+k).slice(-34));
 },[]);
 // The succulent: watered, it perks up, greens and flowers.
 const [watering,setWatering]=useState(0),[watered,setWatered]=useState(false);
 useEffect(()=>{if(!watering)return;const g=window.setTimeout(()=>setWatered(true),1500),d=window.setTimeout(()=>setWatering(0),2400);return()=>{window.clearTimeout(g);window.clearTimeout(d)}},[watering]);
 // Only opening-room images gate the reveal. Later/lazy images and unrelated
 // fonts must not hold the desk behind its loading cover on a slow connection.
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const stage=stageRef.current;
  const imgs=stage?[...stage.querySelectorAll('img')].filter(i=>i.getAttribute('src')&&i.loading!=='lazy'):[];
  return waitForSceneImages(imgs.map(i=>i.decode()),()=>setReady(true),800);
 },[]);
 const [clock,setClock]=useState(()=>new Date());

 useEffect(()=>{const id=setInterval(()=>{const now=new Date();setClock(now);if(!manualTod.current&&!new URLSearchParams(window.location.search).get('tod'))setTod(todFor(now.getHours()))},30000);return()=>clearInterval(id)},[]);

 useEffect(()=>{
  const mq=window.matchMedia('(max-width: 900px), (max-aspect-ratio: 23/20), (prefers-reduced-motion: reduce)');
  const set=()=>setStatic(mq.matches);set();mq.addEventListener('change',set);return()=>mq.removeEventListener('change',set);
 },[]);

 // The scroll-driven camera. Everything is written straight to styles; no re-renders per frame.
 // A layout effect, so the first frame is framed before the browser paints (otherwise the
 // raw, unscaled room flashes on load while the rest of the page mounts).
 useLayoutEffect(()=>{
  const stage=stageRef.current,track=trackRef.current;if(!stage||!track)return;
  const lenis=isStatic?null:getLenis();
  initAnchors();
  let raf=0,lastKey='',warmed=false,toastAt=0,toastGone=false,toastTimer=0;
  // The camera follows the scroll position exactly; Lenis (smoothScroll.ts) does the smoothing.
  let shown=-1,lastT=0,snap=true;
  let promotedAt=0,restTimer=0;
  let SH=262,SY=334,CX0=740,START_SCALE=1,TRACK_TOP=0,TRACK_H=1;
  const measure=()=>{
   const vw=window.innerWidth,vh=window.innerHeight;
   SH=isStatic?262:Math.max(220,Math.min(285,SW*vh/vw));SY=SCREEN_BOTTOM-SH;
   stage.style.setProperty('--sh',`${SH}px`);stage.style.setProperty('--sy',`${SY}px`);
   // Slide the room right until the photo frame (the leftmost object, x≈456) clears the copy.
   const copy=copyRef.current;
   const copyRight=copy?copy.offsetLeft+copy.offsetWidth:vw*.4;
   // Leave the camera at the far right inside the opening view on narrower laptops.
   const s0=Math.min(Math.max(vw/1600,vh/1000)*ROOM_ZOOM,Math.max(.35,(vw-copyRight-44)/1000));
   START_SCALE=s0;
   CX0=Math.min(vw/vh>1.9?800:760,450-(copyRight+28-vw/2)/s0);
   // Where the track sits on the page: measured here, not read back on every frame.
   TRACK_TOP=track.getBoundingClientRect().top+window.scrollY;TRACK_H=track.offsetHeight;
   lastKey='';
  };
  const setOsLive=(v:boolean)=>document.documentElement.classList.toggle('deskOsLive',v);
  // The ambient loops (water, fog, steam, the caret) hold still while nobody can see them:
  // everything when the hero is offscreen, the room when the opaque OS covers it. Paused one
  // by one: a class with an `… *` rule restyled the whole page each time it flipped (~120ms).
  const holder=(root:Element)=>{let on=false,held:Animation[]=[];return(v:boolean)=>{if(v===on)return;on=v;
   if(v)held=root.getAnimations({subtree:true}).filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations===Infinity);
   held.forEach(a=>{if(v)a.pause();else if(a.playState==='paused')a.play()});if(!v)held=[]}};
  const holdAll=holder(track),holdRoom=holder(stage);

  const touchControls=([['lamp',280,416,200,320],['window',1130,58,380,410],['camera',1268,622,128,96]] as const).map(([name,x,y,w,h])=>({name,x,y,w,h,el:sceneRef.current?.querySelector<HTMLElement>(`.dhTouch${name[0].toUpperCase()+name.slice(1)}`)}));
  let staticFrame='';
  const frameStatic=(zoom=1)=>{
   const scene=sceneRef.current;if(!scene)return;
   const w=scene.clientWidth,h=scene.clientHeight,phone=w<=600;
   const s=phone?w/1280:Math.max(w/1400,h/760),cx=phone?850:900,cy=phone?480:520;
   // Fit the room; accessible touch targets follow the same object coordinates.
   // Zoom around the monitor, keeping the original room framing at rest.
   const tx=w/2-cx*s+(1-zoom)*(SX+SW/2)*s;
   const ty=h/2-cy*s+(1-zoom)*(SY+SH/2)*s;
   const scaled=s*zoom;
   const key=`${tx}|${ty}|${scaled}`;if(key===staticFrame)return;staticFrame=key;
   stage.style.transform=`translate(${tx}px,${ty}px) scale(${scaled})`;
   // Scope changing variables to the empty buttons, not the whole illustrated room.
   for(const {name,x,y,w:ow,h:oh,el} of touchControls){
    if(!el)continue;
    el.style.setProperty(`--${name}-left`,`${tx+x*scaled}px`);
    el.style.setProperty(`--${name}-top`,`${ty+y*scaled}px`);
    el.style.setProperty(`--${name}-width`,`${ow*scaled}px`);
    el.style.setProperty(`--${name}-height`,`${oh*scaled}px`);
   }
  };
  // Draw only when something can have changed: a scroll, a resize, or the toast's timer.
  // A loop that ran every frame forced a layout read on every frame of the whole page.
  const frame=(now:number)=>{raf=0;update(now)};
  const request=()=>{if(!raf)raf=requestAnimationFrame(frame)};
  const update=(now=performance.now())=>{
   // Parked under an open case: the case page is what's scrolling.
   if(isParked(track)){snap=true;return}
   const vw=window.innerWidth,vh=window.innerHeight;
   const top=TRACK_TOP-pageY(),r={top,bottom:top+TRACK_H},total=TRACK_H-vh;
   const away=r.bottom<-50||r.top>vh+50;
   if(progRef.current&&away){progRef.current.style.opacity='0';progRef.current.style.visibility='hidden'}
   holdAll(away);
   if(away){snap=true;return}
   const target=cl(-r.top/total),dt=Math.min(.05,Math.max(0,(now-lastT)/1000));lastT=now;
   shown=target;
   snap=false;
   const p=shown;pNow.current=p;
   // Start fetching the case images once the visitor starts walking in.
   if(!warmed&&p>.05){warmed=true;winRefs.current.forEach(w=>{const img=w?.querySelector('img');if(img&&!img.getAttribute('src')&&img.dataset.src){img.loading='eager';img.src=img.dataset.src}})}
   // Like a real notification, the toast slides in, then gets out of the way.
   const toast=toastRef.current;
   if(toast){if(p<.86)toastAt=0;else if(p>=.91&&!toastAt){toastAt=performance.now();window.clearTimeout(toastTimer);toastTimer=window.setTimeout(request,5050)}toastGone=!!toastAt&&performance.now()-toastAt>5000&&!toast.matches(':hover')}
   const key=`${toastGone?1:0}|${p.toFixed(4)}|${vw}x${vh}`;if(key===lastKey)return;lastKey=key;

   // Camera: the visible part of the room shrinks from the whole set to exactly the screen.
   const s0=START_SCALE,s1=Math.max(vw/SW,vh/SH);
   const e=io(cl((p-.08)/.62));
   const s=s0*Math.pow(s1/s0,e);
   const k=(1/s0-1/s)/(1/s0-1/s1||1);
   const cx=L(CX0,SX+SW/2,k),cy=L(510,SY+SH/2,k);
   // Promote while moving; re-raster when a zoom-out falls well below the promoted zoom (else
   // the whole room would be drawn at close-up resolution); drop the layer once it rests.
   if(stage.style.willChange!=='transform'){stage.style.willChange='transform';promotedAt=s}
   else if(s<promotedAt*.6)stage.style.willChange='auto';
   window.clearTimeout(restTimer);restTimer=window.setTimeout(()=>{stage.style.willChange='auto'},180);
   stage.style.transform=`translate(${vw/2-cx*s}px,${vh/2-cy*s}px) scale(${s})`;

   // Keep the introduction until the camera starts filling the left side.
   // Reuse the camera's progress: no extra animation loop or layout measurement.
   const ct=cl((e-.12)/.34);
   if(copyRef.current){copyRef.current.style.opacity=String(1-ct);copyRef.current.style.transform=`translate(${-ct*80}px,-50%)`;copyRef.current.style.visibility=ct>=1?'hidden':''}
   // A quiet progress rail: where you are in the walk-in, and a way out of it.
   if(progRef.current){progRef.current.style.setProperty('--p',String(p));const po=1-cl((p-.97)/.03);progRef.current.style.opacity=String(po);progRef.current.style.visibility=po>0?'':'hidden';progRef.current.dataset.chapter=p<.08?'0':p<.7?'1':'3';progRef.current.classList.toggle('isDone',p>=.84)}

   // Neha OS takes over once the screen fills the view.
   const ot=cl((p-.63)/.1),os=osRef.current;
   if(os){os.style.opacity=String(ot);os.style.visibility=ot>0?'visible':'hidden';os.classList.toggle('isLive',ot>.9)}
   // Once the OS fully covers the room, the room isn't drawn underneath it.
   track.classList.toggle('osCovers',ot>=1);holdRoom(p>.08);
   setOsLive(ot>.5&&p<.999);
   const dockY=(1-out3(cl((p-.7)/.12)))*24;
   if(dockRef.current)dockRef.current.style.transform=`translate(-50%,${dockY}px)`;
   // The work arrives together without a separate greeting/minimization interlude.
   winRefs.current.forEach((w,i)=>{if(!w)return;const t=cl((p-.7-i*.008)/.1),b=out3(t),d=drag.current[i];
    w.style.opacity=String(t);w.style.visibility=t>0?'visible':'hidden';
    w.style.transform=`translate(${d.x}px,${d.y+(1-b)*18}px) scale(${L(.98,1,b)})`});
   iconRefs.current.forEach((d)=>{if(!d)return;const t=cl((p-.7)/.14);d.style.opacity=String(t);d.style.transform=`scale(${L(.98,1,out3(t))})`});
   if(toastRef.current){const t=cl((p-.8)/.04);toastRef.current.style.opacity=String(toastGone?0:t);toastRef.current.style.visibility=toastGone||t===0?'hidden':'';toastRef.current.style.transform=`translateX(${(1-out3(t))*12}px)`}
  };

  measure();
  if(isStatic){frameStatic();const onR=()=>{measure();frameStatic()};window.addEventListener('resize',onR);setOsLive(false);
   // Clear anything the scroll version wrote.
   for(const el of [copyRef.current,osRef.current,dockRef.current,toastRef.current,...winRefs.current,...iconRefs.current])if(el){el.style.opacity='';el.style.transform='';el.style.visibility=''}
   // On a phone the room scrolls away before the projects do; stop its ambient loops there.
   const observer=new IntersectionObserver(([entry])=>holdRoom(reduced||!entry.isIntersecting),{rootMargin:'80px'});
   if(sceneRef.current)observer.observe(sceneRef.current);
   return()=>{window.removeEventListener('resize',onR);observer.disconnect();holdRoom(false)}}

  const onResize=()=>{measure();snap=true;request()};
  // Back from a case: draw now, so the closing transition shrinks into the window where it sits.
  const onShown=()=>{measure();snap=true;update()};
  const toastEl=toastRef.current;
  window.addEventListener('resize',onResize);window.addEventListener('scroll',request,{passive:true});window.addEventListener(HOME_SHOWN,onShown);
  // With Lenis, draw in the same frame it moves the page (a scroll event would arrive a frame later).
  const offLenis=lenis?.on('scroll',()=>{cancelAnimationFrame(raf);raf=0;update()});
 toastEl?.addEventListener('mouseleave',request);
  // Draw the first frame now, not on the next animation frame, so a view
  // transition back to the desktop snapshots the windows in place.
  update();
  return()=>{offLenis?.();cancelAnimationFrame(raf);window.clearTimeout(toastTimer);window.removeEventListener('resize',onResize);window.removeEventListener('scroll',request);window.removeEventListener(HOME_SHOWN,onShown);toastEl?.removeEventListener('mouseleave',request);holdRoom(false);holdAll(false);track.classList.remove('osCovers');setOsLive(false)};
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
 // Arrow keys visit the same visual chapters as the progress rail.
 useEffect(()=>{
  if(isStatic)return;
  const chapters=[0,.25,.5,.75,.93];
  const onKey=(e:KeyboardEvent)=>{
   if(e.key!=='ArrowDown'&&e.key!=='ArrowUp'||e.repeat||e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey)return;
   if((e.target as Element)?.closest?.('input,textarea,select,button,a,[contenteditable],[role="button"],[role="textbox"]'))return;
   const track=trackRef.current;if(!track)return;
   const r=track.getBoundingClientRect(),vh=window.innerHeight;
   if(r.top>1||r.bottom<vh-1)return;
   const total=track.offsetHeight-vh,p=Math.max(0,Math.min(1,-r.top/total));
   const next=e.key==='ArrowDown'?chapters.find(v=>v>p+.025):[...chapters].reverse().find(v=>v<p-.025);
   if(next===undefined&&e.key==='ArrowUp'&&p<.025)return;
   e.preventDefault();
   const top=r.top+window.scrollY;
   window.scrollTo({top:next===undefined?top+track.offsetHeight:top+total*next,behavior:'smooth'});
  };
  document.addEventListener('keydown',onKey);
  return()=>document.removeEventListener('keydown',onKey);
 },[isStatic]);
 // Typing while the room is in view writes into hello.txt; the Konami code toggles the disco.
 // Arrows that continue the code past its first two presses are kept from scrolling the walk-in.
 useEffect(()=>{
  if(isStatic)return;
  const CODE=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let at=0;
  const onKey=(e:KeyboardEvent)=>{
   if(e.altKey||e.ctrlKey||e.metaKey||e.repeat)return;
   if((e.target as Element)?.closest?.('input,textarea,select,[contenteditable]'))return;
   const track=trackRef.current;if(!track)return;
   const r=track.getBoundingClientRect(),mid=window.innerHeight/2;if(r.top>mid||r.bottom<mid)return;
   const k=e.key.length===1?e.key.toLowerCase():e.key;
   at=k===CODE[at]?at+1:k===CODE[0]?1:0;
   if(at>2&&k.startsWith('Arrow'))e.preventDefault();
   if(at===CODE.length){at=0;setDisco(d=>{if(!d){manualTod.current=true;setTod('night');setLampOn(true)}return !d});return}
   // Typing only in the room, before Neha OS takes the screen.
   if(pNow.current>.38)return;
   if(e.key==='Backspace'){e.preventDefault();pressKey('Backspace');return}
   if(e.key===' '&&typed)e.preventDefault();
   if(e.key.length===1&&/[\x20-\x7e]/.test(e.key)&&(e.key!==' '||typed))pressKey(e.key===' '?' ':e.key);
  };
  window.addEventListener('keydown',onKey,true);
  return()=>window.removeEventListener('keydown',onKey,true);
 },[isStatic,pressKey,typed]);
 // Links to the work (#projects, the anchor near the end of the walk-in) glide through Lenis; see initAnchors.
 const scrub=(e:React.MouseEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect();jumpTo(cl((e.clientX-r.left)/r.width))};
 const open=(id:string)=>(e:React.MouseEvent<HTMLElement>)=>{e.preventDefault();maximizeInto(e.currentTarget.closest('.dhWin')||e.currentTarget,id,()=>openCase(id))};
 const day=clock.toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'}),time=clock.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
 const hello=<><div className="dhHelloBar"><i/><i/><i/><span>hello.txt</span></div><div className="dhHelloBody"><p>{GREETING[tod]}, i’m neha.{!typed&&<span className="dhCaret"/>}</p>{typed?<p className="dhTyped">{typed}<span className="dhCaret"/></p>:<small>welcome to my desk. keep scrolling, come on in →</small>}</div></>;

 return <section ref={trackRef} className={`dhTrack tod-${tod} ${ready?'isReady':''} ${isStatic?'isStatic':''} ${lampOn?'lampOn':''} ${disco?'isDisco':''}`} style={{'--track':`${TRACK_VH}vh`} as React.CSSProperties} aria-label="Neha Chinimilli, intro and selected work" id="top">
  {!isStatic&&<DeskTips/>}
  {!isStatic&&<span id="projects" className="dhAnchor" style={{top:`${ANCHOR_P*(TRACK_VH-100)}vh`}} aria-hidden="true"/>}
  <div className="dhPin">
   <div className="dhCopy" ref={copyRef}>
    <h1>Neha<br/><em>Chinimilli</em></h1>
    <p><b>I find what makes a product hard to use,</b> decide what to change, and help ship it, most recently at Accenture, Ford Credit, and Ford.</p>
    <p className="dhEdu"><i aria-hidden="true"/><span>Computer Science + Supply Chain Management<br/>Michigan State University · 2027</span></p>
    <div className="dhLinks"><a href="#projects">See my work <span aria-hidden="true">↓</span></a><a href="#about">About me</a><a href="Neha_Chinimilli_Resume.pdf" target="_blank" rel="noreferrer">Resume <span aria-hidden="true">↗</span></a></div>
    {onSimple&&<p className="dhQuick">{reduced?'Reduced motion is on.':'Short on time?'} <button type="button" onClick={onSimple}>Switch to Simple view</button></p>}
    <span className="dhPoke" aria-hidden="true">{isStatic?'tap around my little corner':'this is my desk. poke around'} <i>↘</i></span>
   </div>

   <div className="dhScene" ref={sceneRef}>
    <div className="dhStage" ref={stageRef} aria-hidden="true" inert={isStatic}>
     <div className="dhWall"/>
     {isStatic&&<figure className="dhBayPainting"><div className="dhBayPaintingCanvas"><SummerBayExtension/></div></figure>}
     <div className="dhSunPatch"/>
     <div className="dhShaft"/>

     <div className={`dhWindow ${air%2?'isAjar':''}`} data-tip="Change the time of day" onClick={()=>{manualTod.current=true;setTod(t=>ORDER[(ORDER.indexOf(t)+1)%4]);}}>
      <div className="dhGlass"><GoldenGateView/>{isStatic&&<SanFranciscoSummerView/>}<div className="dhMuntins"/><div className="dhReflect"/><div className="dhGap"/><button type="button" className="dhLatch" tabIndex={-1} data-tip={air%2?'Close the window':'Open the window a crack'} aria-label={air%2?'Close the window':'Open the window a crack'} onClick={e=>{e.stopPropagation();setAir(v=>v+1)}}/></div>
      <div className="dhCurtain" key={Math.ceil(air/2)}/>
      <div className="dhSill"><div className={`dhSucculent ${watered?'isWatered':''} ${watering?'isWatering':''}`} data-tip={watered?'Water it again':'Water me'} onClick={e=>{e.stopPropagation();setWatering(v=>v+1)}}><SucculentFoliage/><b className="dhBloom"/><b className="dhBloom"/><b className="dhBloom"/>
       {watering>0&&<span className="dhCan" key={watering}><svg viewBox="0 0 48 30" aria-hidden="true"><defs><linearGradient id="dhCanG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfe4e6"/><stop offset=".5" stopColor="#a9b2b7"/><stop offset="1" stopColor="#7d878d"/></linearGradient></defs><path d="M2 9L14 14" stroke="#8d969b" strokeWidth="2.6" strokeLinecap="round"/><ellipse cx="2" cy="9" rx="2.2" ry="3" fill="#6f787d"/><path d="M14 8H40V27Q27 30 14 27Z" fill="url(#dhCanG)"/><ellipse cx="27" cy="8" rx="13" ry="2.6" fill="#c9d0d3"/><path d="M38 6C48 2 50 18 40 20" fill="none" stroke="#8d969b" strokeWidth="2.4"/></svg><span className="dhDrops"><em/><em/><em/></span></span>}
      </div></div>
     </div>

     <SnowGlobe/>
     <div className="dhString">
      <svg viewBox="0 0 520 90" preserveAspectRatio="none"><path d="M0 8Q260 80 520 12"/></svg>
      {Array.from({length:13},(_,i)=>{const t=i/12,x=t*520,y=(1-t)*(1-t)*8+2*(1-t)*t*80+t*t*12;return <i key={i} className="dhBulbDot" style={{left:x,top:y+2,animationDelay:`${(i*.37)%2}s`}}/>})}
      {PRINTS.map((p,i)=>{const t=.12+i*.25,x=t*520,y=(1-t)*(1-t)*8+2*(1-t)*t*80+t*t*12;return <figure key={p.src} className="dhPrint" onClick={e=>{const f=e.currentTarget;f.classList.remove('isSwing');void f.offsetWidth;f.classList.add('isSwing')}} style={{left:x-40,top:y-4,'--r':`${p.r}deg`} as React.CSSProperties}><span className="dhPeg"/><img src={asset(p.src)} alt="" style={{objectPosition:p.pos}} loading="eager" decoding="async"/><figcaption>{p.cap}</figcaption></figure>})}
     </div>

     <div className="dhShelf">
      <div className="dhBooks">{BOOKS.map((b,i)=><i key={i} style={{'--c':b.c,'--f':b.f,height:b.h,width:b.w} as React.CSSProperties}>{b.t&&<span>{b.t}</span>}</i>)}<i className="dhLean" style={{'--c':'#e3a88f','--f':'#6b2d1f',height:100,width:20} as React.CSSProperties}/></div>
      <b className="dhCanvas"/>
      <div className="dhStack"><i style={{'--c':'#3d5a80'} as React.CSSProperties}/><i style={{'--c':'#e8dcc4'} as React.CSSProperties}/><Mustang/></div>
      <div className="dhPothos"><svg viewBox="0 0 90 230" aria-hidden="true"><defs><linearGradient id="dhLeafFace" x1="0" y1="0" x2="1" y2=".5"><stop stopColor="#34523b"/><stop offset=".44" stopColor="#77925b"/><stop offset=".5" stopColor="#abc280"/><stop offset=".56" stopColor="#65824d"/><stop offset="1" stopColor="#385a3c"/></linearGradient></defs><path className="dhVine" d="M40 30C44 70 30 96 36 130S52 180 44 222"/><path className="dhVine" d="M52 30C62 60 66 84 60 110"/>{[[36,48,-30],[44,70,40],[32,94,-40],[40,120,30],[38,148,-35],[48,172,35],[42,198,-30],[46,220,20],[62,56,40],[64,84,-20],[58,106,30]].map(([x,y,r],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${i%3===0?.88:1} ${i%2?.94:1})`}><path d="M0 5Q-1 2 0-2" fill="none" stroke="#66794c" strokeWidth="1.2"/><path className="dhLeaf" d="M0 0C-12-4-15-18-8-23Q-2-27 0-18Q6-29 13-20C17-10 8-3 0 0Z"/><path d="M0-1Q-2-10 0-18M-1-8L-9-15M-1-11L8-18" fill="none" stroke="#c4d19a" strokeOpacity=".42" strokeWidth=".6"/></g>)}</svg><div className="dhPot"/></div>
      <div className="dhPlank"/><i className="dhBracket"/><i className="dhBracket dhBracketR"/>
     </div>

     <div className="dhGlow"/>
     <div className="dhImac"><div className="dhImacFace"><i className="dhImacCam"/></div><div className="dhImacChin"/><div className="dhImacStand"/><div className="dhImacFoot"/></div>

     <div className="dhDesk"><div className="dhDeskEdge"/></div><div className="dhWood"><i className="dhSunDesk"/></div>
     <div className="dhLampPool"/><div className="dhPortraitLight"/>
     {/* Everything lying on the desk shares one plane, seen in perspective */}
     <div className="dhTop">
      <div className="dhMat" ref={keyboardRef}><DeskKeyboard onKey={pressKey}/><div className="dhMouse"/></div>
      <div className="dhNotebook"><span>ship-it list<br/>✓ commute<br/>✓ book club<br/>☐ your team?</span></div>
      <div className="dhPen"/>
      <WatercolorTin/>
      <CookieNapkin/>
     </div>
     <PhotoFrame/>
     <Candle/>
     <TumblerFlask/>
     <MsuCappuccino/>
     <CanonAE1 onShoot={shoot}/>
     <Lamp on={lampOn} disco={disco} onToggle={()=>disco?setDisco(false):setLampOn(v=>!v)}/>
     <div className="dhShade"/>

     <div className="dhScreen" data-tip="Come on in" onClick={()=>{const t=trackRef.current;if(t&&!isStatic){const to=t.offsetTop+(t.offsetHeight-window.innerHeight)*.5;window.scrollTo({top:to,behavior:'smooth'})}}}>
      <WaveWallpaper id="dhMiniWp"/>
      <div className="dhMiniBar">{isStatic?<><b>Finder</b><span>File</span><span>Edit</span><span>View</span><time>{time}</time></>:<><b>Neha</b><span>Selected work</span><span>Experience</span></>}</div>
      <div className="dhHello dhHelloMini">{isStatic?<><div className="dhHelloBar"><i/><i/><i/><span>hello.txt</span></div><div className="dhHelloBody"><p>{GREETING[tod]}, i’m neha.</p><small>make yourself at home.</small></div></>:hello}</div>
     </div>
     <div className="dhSticky dhStickyA">71% → 94% accuracy ✓<small>kohler</small></div>
     <div className="dhSticky dhStickyB">vanderpump reunion 9pm!!</div>
    </div>

    {isStatic&&<>
     <button className="dhObjectTouch dhTouchLamp" type="button" aria-label="Desk lamp" aria-pressed={lampOn} onClick={()=>{setDisco(false);setLampOn(v=>!v)}}/>
     <button className="dhObjectTouch dhTouchWindow" type="button" aria-label="Change the time of day" onClick={()=>{manualTod.current=true;setTod(t=>ORDER[(ORDER.indexOf(t)+1)%4])}}/>
     <button className="dhObjectTouch dhTouchCamera" type="button" aria-label="Say cheese" onClick={shoot}/>
     <span className="dhDeskStatus" role="status">{flash>0?'Click!':''}</span>
    </>}
    {flash>0&&!reduced&&<div className="dhFlash" key={flash} aria-hidden="true"/>}
   </div>
   {!isStatic&&<div className="dhShield" aria-hidden="true"/>}
   {!isStatic&&<div className="dhProgress" ref={progRef} data-chapter="0">
    <span className="dhChapter" aria-hidden="true"><b>scroll to walk in</b><b>walking in</b><b>hello</b><b>the work</b></span>
    <div className="dhRail" onClick={scrub} role="presentation"><i/>{[.08,.7,.84].map(t=><em key={t} style={{left:`${t*100}%`}}/>)}</div>
    <button type="button" className="dhSkip" onClick={()=>jumpTo(ANCHOR_P)}>Skip to the work ↓</button>
   </div>}

   <div className="dhOs" ref={osRef}>
    <WaveWallpaper id="dhOsWp"/>
    <nav className="dhMenuBar" aria-label="Neha OS">
     <a href="#top" className="dhMenuLogo"><img src={asset('favicon-32.png')} width={32} height={32} alt=""/><b>Neha</b></a>
     <a href="#projects">Selected work</a><a href="#experience">Experience</a><a href="#fun">Fun builds</a><a href="#about">About</a><a href="Neha_Chinimilli_Resume.pdf" target="_blank" rel="noreferrer">Resume</a>
     <span className="dhMenuRight">{onSimple&&<button type="button" className="dhMenuView" onClick={onSimple}>Simple view</button>}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01"/></svg><svg viewBox="0 0 30 16" aria-hidden="true"><rect x="1" y="2" width="24" height="12" rx="3.5"/><rect x="3.5" y="4.5" width="15" height="7" rx="1.6" className="dhBatt"/><path d="M27.5 6v4"/></svg><span>{day}</span><span>{time}</span></span>
    </nav>
    {isStatic&&<span id="projects" className="dhAnchor" aria-hidden="true"/>}
    <h2 className="dhOsTitle">Selected work</h2>
    <div className="dhWindows">
     {projects.map((p,i)=>{const w=WINDOWS[p.id];if(!w)return null;const [x,y]=SLOTS[i]||[10,10];
      return <article key={p.id} className="dhWin" data-case={p.id} ref={el=>{winRefs.current[i]=el}} style={isStatic?undefined:{left:`${x}vw`,top:`${y}vh`}}>
       <header className="dhWinBar" onPointerDown={e=>startDrag(i,e)}><i/><i/><i/><span>{CASE_FILES[p.id]}</span></header>
       <a href={`#/projects/${p.id}`} onClick={open(p.id)} className="dhWinBody" aria-label={`Open ${p.title} case study`}>
        <img src={isStatic?asset(w.img):undefined} data-src={asset(w.img)} alt="" loading="lazy" decoding="async" style={w.pos?{objectPosition:w.pos}:undefined}/>
        <div className="dhWinCap"><div><h3>{p.title}</h3><small>{p.company.split(' · ')[0]}</small></div><em>{w.note}</em></div>
        <span className="dhCaseCue">View case study <span aria-hidden="true">→</span></span>
       </a>
      </article>})}
    </div>
    <div className="dhIcons">
     {[['resume.pdf','PDF','Neha_Chinimilli_Resume.pdf',null],['Commute','iOS','#/projects/commute','commute'],['Bookclub','APP','#/projects/bookclub','bookclub'],['film roll','35MM','#about',null]].map(([label,tag,href,id],i)=>
      <a key={label} ref={el=>{iconRefs.current[i]=el}} href={href as string} onClick={id?open(id as string):undefined} target={href==='Neha_Chinimilli_Resume.pdf'?'_blank':undefined} rel="noreferrer"><i data-t={tag}/>{label}</a>)}
    </div>
    <div className="dhToast" ref={toastRef} role="status"><img src={asset('favicon-32.png')} width={32} height={32} alt=""/><div><b>Neha</b><span>Drag the windows around, or click one to open the case study.</span></div><small>now</small></div>
    <nav className="dhDock" ref={dockRef} aria-label="Dock">
     {[['Selected work','#projects',G.work,'#e0634f,#b23a2c'],['Experience','#experience',G.exp,'#4f7fd6,#2b4c9a'],['Fun things I built','#fun',G.fun,'#7cc27a,#3f8a45'],['About me','#about',G.about,'#f5b94f,#d9861c'],['Resume','Neha_Chinimilli_Resume.pdf',G.resume,'#f4f1ea,#d8d2c6'],['Email','mailto:chinimi2@msu.edu',G.mail,'#6ec1f2,#2a86d0'],['GitHub','https://github.com/nchinimilli3',null,'#f4f1ea,#d8d2c6'],['LinkedIn','https://www.linkedin.com/in/nchinimilli',G.li,'#3a7dc0,#1d5a96']].map(([label,href,d,bg])=>
      <a key={label} href={href} target={href.startsWith('http')||href.endsWith('.pdf')?'_blank':undefined} rel="noreferrer" style={{'--bg':`linear-gradient(160deg,${bg})`} as React.CSSProperties} className={label==='Resume'?'dhDockLight':''}>{label==='GitHub'?<GithubGlyph/>:<Glyph d={d as string}/>}<span>{label}</span></a>)}
    </nav>
   </div>
  </div>
 </section>
}

/* The end of the page: the same desk, at night. When it comes into view the
   portrait lamp stays warm, and a note on the wall says thanks, with how to reach me. */
export function DeskGoodnight(){
 const rootRef=useRef<HTMLElement>(null),sceneRef=useRef<HTMLDivElement>(null),stageRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const scene=sceneRef.current,stage=stageRef.current;if(!scene||!stage)return;
  const fit=()=>{const w=scene.clientWidth,h=scene.clientHeight,s=Math.max(w/1500,h/780),cx=w<760?900:760;stage.style.transform=`translate(${w/2-cx*s}px,${h/2-500*s}px) scale(${s})`};
  fit();const ro=new ResizeObserver(fit);ro.observe(scene);
  return()=>ro.disconnect();
 },[]);
 return <section ref={rootRef} className="dhTrack tod-night dhGoodnight lampOn" aria-label="Contact">
  <div className="dhScene" ref={sceneRef}>
   <div className="dhStage" ref={stageRef} style={{'--sh':'262px','--sy':'310px'} as React.CSSProperties} aria-hidden="true">
    <div className="dhWall"/>
    <div className="dhWindow"><div className="dhGlass"><GoldenGateView/><div className="dhMuntins"/><div className="dhReflect"/></div><div className="dhCurtain"/><div className="dhSill"><div className="dhSucculent"><SucculentFoliage/></div></div></div>
    <div className="dhShelf"><div className="dhBooks">{BOOKS.map((b,i)=><i key={i} style={{'--c':b.c,'--f':b.f,height:b.h,width:b.w} as React.CSSProperties}>{b.t&&<span>{b.t}</span>}</i>)}</div><div className="dhStack"><i style={{'--c':'#3d5a80'} as React.CSSProperties}/><i style={{'--c':'#e8dcc4'} as React.CSSProperties}/><Mustang/></div><div className="dhPlank"/></div>
    <div className="dhImac"><div className="dhImacFace"><i className="dhImacCam"/></div><div className="dhImacChin"/><div className="dhImacStand"/><div className="dhImacFoot"/></div>
    <div className="dhScreen"/>
    <div className="dhDesk"><div className="dhDeskEdge"/></div><div className="dhWood"><i className="dhSunDesk"/></div>
    <div className="dhLampPool"/><div className="dhPortraitLight"/>
    <div className="dhTop"><div className="dhMat"><DeskKeyboard/><div className="dhMouse"/></div></div>
    <PhotoFrame eager={false}/>
    <MsuCappuccino/>
    <CanonAE1 onShoot={()=>{}}/>
    <Lamp/>
    <div className="dhShade"/>
   </div>
  </div>
  <div className="gnNote">
   <p className="gnThanks">thanks for stopping by ♡</p>
   <p className="gnLead">If you’re hiring for product, or want to trade book recs, I’d love to hear from you.</p>
   <div className="gnLinks"><a href="mailto:chinimi2@msu.edu">chinimi2@msu.edu</a><a href="https://github.com/nchinimilli3" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="Neha_Chinimilli_Resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div>
   <span className="gnSign">— neha</span>
  </div>
 </section>
}
