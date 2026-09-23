import React, { useEffect, useId, useRef, useState } from 'react';
import './about-hobbies.css';

/* The two other About-copy phrases that take over the photo, alongside the
   film camera: "reading" pulls a book off a 3D shelf, "reality TV"
   switches on a retro set that flips between channels. Both play their intro
   once per visit (Replay brings it back), skip it for reduced motion, and
   answer Escape and the arrow keys like the film gallery does. */

const reduceMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const seenOnce=(key:string)=>{
 let seen=false;
 try{seen=sessionStorage.getItem(key)==='yes';sessionStorage.setItem(key,'yes')}catch{}
 return seen;
};
function useArrowKeys(onMove:(d:number)=>void,onClose:()=>void,enabled=true){
 useEffect(()=>{
  if(!enabled)return;
  const key=(e:KeyboardEvent)=>{
   if((e.target as HTMLElement)?.matches('input,textarea,select,[contenteditable=true]'))return;
   if(e.key==='Escape'){onClose();return;}
   if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();onMove(e.key==='ArrowLeft'?-1:1)}
  };
  window.addEventListener('keydown',key);
  return()=>window.removeEventListener('keydown',key);
 },[onMove,onClose,enabled]);
}

/* ───────────────────────── Reading ───────────────────────── */

type Motif='sun'|'breath'|'moons'|'shards';
export type ShelfBook={title:string;author:string;cloth:string;foil:string;motif:Motif};

const serif="'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif";
const wrapTitle=(title:string,max=13)=>title.split(' ').reduce<string[]>((lines,word)=>{
 const last=lines[lines.length-1];
 if(last&&(last+' '+word).length<=max)lines[lines.length-1]=last+' '+word;else lines.push(word);
 return lines;
},[]);

function CoverMotif({motif,paint,cloth}:{motif:Motif;paint:string;cloth:string}){
 const s={fill:'none',stroke:paint,strokeWidth:1.6,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 if(motif==='sun')return <g>
  <circle cx="100" cy="88" r="17" fill={paint}/>
  {Array.from({length:16},(_,i)=>{const a=i*Math.PI/8,r1=24,r2=i%2?31:37;return <path key={i} {...s} d={`M${100+Math.cos(a)*r1} ${88+Math.sin(a)*r1}L${100+Math.cos(a)*r2} ${88+Math.sin(a)*r2}`}/>})}
 </g>;
 if(motif==='breath')return <g {...s}>
  <path d="M84 128c-8-12 8-18 0-30s6-18 2-30"/>
  <path d="M100 132c-9-14 9-20 0-34s7-20 1-38" strokeWidth="2"/>
  <path d="M116 128c-8-12 8-18 0-30s6-18 2-30"/>
 </g>;
 if(motif==='moons')return <g>
  {[[58,11,-5],[100,17,0],[142,11,5]].map(([x,r,off],i)=><g key={i}>
   <circle cx={x} cy="90" r={r} fill={paint}/>
   {off!==0&&<circle cx={x+off} cy="88" r={r-1} fill={cloth}/>}
  </g>)}
  <circle cx="100" cy="90" r="25" {...s} strokeWidth="1" strokeDasharray="1 4"/>
 </g>;
 return <g {...s}>
  <path d="M74 62l20 8-12 22z" fill={paint}/>
  <path d="M98 56l26 18-20 30z"/>
  <path d="M86 98l16 10-18 18z"/>
  <path d="M112 106l16-4-6 20z" fill={paint}/>
 </g>;
}

/* An original cloth-hardcover design per book: stamped metallic foil (a gradient
   pressed slightly into the board), bookcloth grain, and a hinge groove. */
export function BookCoverArt({book,className=''}:{book:ShelfBook;className?:string}){
 const id=useId().replace(/[^a-zA-Z0-9]/g,'');
 const lines=wrapTitle(book.title);
 const top=176-(lines.length-1)*11;
 const foil=`url(#${id}f)`;
 return <svg className={className} viewBox="0 0 200 300" preserveAspectRatio="none" role="img" aria-label={`${book.title} by ${book.author}`}>
  <defs>
   <pattern id={`${id}w`} width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 .5h3M.5 0v3" stroke="#fff" strokeOpacity=".06"/></pattern>
   <filter id={`${id}n`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .28 0"/></filter>
   <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
    <stop style={{stopColor:`color-mix(in srgb, ${book.foil} 55%, #fff)`}}/>
    <stop offset=".38" stopColor={book.foil}/>
    <stop offset=".62" style={{stopColor:`color-mix(in srgb, ${book.foil} 72%, #000)`}}/>
    <stop offset=".85" style={{stopColor:`color-mix(in srgb, ${book.foil} 80%, #fff)`}}/>
    <stop offset="1" stopColor={book.foil}/>
   </linearGradient>
   <filter id={`${id}e`} x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy=".7" stdDeviation=".25" floodColor="#000" floodOpacity=".5"/></filter>
   <linearGradient id={`${id}l`} x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".1"/><stop offset=".5" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".2"/></linearGradient>
  </defs>
  <rect width="200" height="300" fill={book.cloth}/>
  <rect width="200" height="300" fill={`url(#${id}w)`}/>
  <rect width="200" height="300" filter={`url(#${id}n)`}/>
  <g filter={`url(#${id}e)`}>
   <rect x="22" y="12" width="166" height="276" fill="none" stroke={foil} strokeWidth="1.3"/>
   <rect x="26" y="16" width="158" height="268" fill="none" stroke={foil} strokeWidth=".5"/>
   <g transform="translate(5 0)">
    <CoverMotif motif={book.motif} paint={foil} cloth={book.cloth}/>
    {lines.map((line,i)=><text key={line} x="100" y={top+i*22} textAnchor="middle" fill={foil} fontFamily={serif} fontSize="19" fontWeight="600" letterSpacing=".4">{line}</text>)}
    <path d={`M86 ${top+lines.length*22-2}h28`} stroke={foil} strokeWidth=".8"/>
    <text x="100" y="262" textAnchor="middle" fill={foil} fontFamily={serif} fontSize="9.5" letterSpacing="2.2">{book.author.toUpperCase()}</text>
   </g>
  </g>
  {/* the hinge: a pressed groove where the board meets the spine */}
  <rect x="0" y="0" width="10" height="300" fill="#000" opacity=".22"/>
  <rect x="10" y="0" width="2.5" height="300" fill="#000" opacity=".3"/>
  <rect x="12.5" y="0" width="1.5" height="300" fill="#fff" opacity=".12"/>
  <rect width="200" height="300" fill={`url(#${id}l)`}/>
 </svg>;
}

/* The shelf is a small CSS 3D scene measured in a 400-wide unit grid (--u), so
   it scales with its column. Each book is a real box (spine, cover, page tops,
   fore-edge) standing on an oak plank seen from a little above. The featured
   book lifts out of its slot, arcs up to the front, and turns to face you;
   switching books sends it home as the next one comes out. */
const slots=[{x:78,w:26,h:136},{x:106,w:22,h:150},{x:130,w:30,h:128},{x:162,w:21,h:144}];
function Book3D({book,slot,index,out,onPick}:{book:ShelfBook;slot:typeof slots[number];index:number;out:boolean;onPick:()=>void}){
 const d=Math.round(slot.h*2/3);
 // Shrink long titles to fit the spine rather than cutting them off.
 const fs=Math.min(9.5,(slot.h-40)/(book.title.length*.66));
 return <div className={`book3d${out?' isOut':''}`} role="button" tabIndex={0} aria-pressed={out} aria-label={`${book.title} by ${book.author}`}
  onClick={onPick} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onPick()}}}
  style={{'--x':slot.x,'--w':slot.w,'--h':slot.h,'--d':d,'--i':index,'--fs':fs.toFixed(2),'--cloth':book.cloth,'--foil':book.foil} as React.CSSProperties}>
  <div className="bookMoveX"><div className="bookMoveY"><div className="bookFloat"><div className="bookBody">
   <span className="bookFace bookSpineFace"><i className="bookBands"/><em>{book.title}</em><i className="bookBands isTail"/></span>
   <span className="bookFace bookTop"/>
   <span className="bookFace bookEdge"/>
   <span className="bookFace bookCoverFace"><BookCoverArt book={book} className="bookCoverArt"/><i className="coverSheen"/></span>
  </div></div></div></div>
 </div>;
}

export function AboutBookshelf({books,onClose}:{books:ShelfBook[];onClose:()=>void}){
 const [index,setIndex]=useState(0);
 // The featured book is always the current one; this only says whether it has left the shelf yet.
 const [pulled,setPulled]=useState(false);
 const out=pulled?index:null;
 const [intro,setIntro]=useState(false);
 const [run,setRun]=useState(0);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const pullOut=(wait:number)=>{if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setPulled(true),wait)};
 const play=(full:boolean)=>{
  setPulled(false);setRun(n=>n+1);
  const still=reduceMotion();
  setIntro(full&&!still);
  pullOut(still?0:full?1500:80);
 };
 useEffect(()=>{play(!seenOnce('neha-shelf-seen-v1'));return()=>{if(timer.current)clearTimeout(timer.current)}},[]);
 const pick=(i:number)=>{setIndex(i);setPulled(true)};
 const move=React.useCallback((d:number)=>{setIndex(i=>(i+d+books.length)%books.length);setPulled(true)},[books.length]);
 useArrowKeys(move,onClose);
 const tilt=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(e.pointerType==='touch')return;
  const r=e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--px',(((e.clientX-r.left)/r.width)*2-1).toFixed(3));
  e.currentTarget.style.setProperty('--py',(((e.clientY-r.top)/r.height)*2-1).toFixed(3));
 };
 const book=books[index];
 return <div className="hobbyTakeover shelfTakeover">
  <div className="shelfReader">
   <div className="hobbyHeader"><span>ON MY SHELF</span><button type="button" className="hobbyClose" onClick={onClose} aria-label="Close my bookshelf">×</button></div>
   <div className={`shelfScene${intro?' isIntro':''}${out!==null?' hasOut':''}`} key={run} onPointerMove={tilt} onPointerLeave={e=>{e.currentTarget.style.setProperty('--px','0');e.currentTarget.style.setProperty('--py','0')}}>
    <span className="shelfFeatureShadow" aria-hidden="true"/>
    <div className="shelfWorld" role="group" aria-label="Books on my shelf">
     <div className="shelfPlank" aria-hidden="true">
      <span className="plankTop">{slots.slice(0,books.length).map((s,i)=><i key={i} className={`plankShadow${out===i?' isEmpty':''}`} style={{'--x':s.x,'--w':s.w,'--d':Math.round(s.h*2/3)} as React.CSSProperties}/>)}<i className="plankShadow isStack"/></span>
      <span className="plankFront"/>
      <span className="plankBracket"/><span className="plankBracket isRight"/>
     </div>
     <span className="shelfBookend" aria-hidden="true"/>
     {books.slice(0,slots.length).map((b,i)=><Book3D key={b.title} book={b} slot={slots[i]} index={i} out={out===i} onPick={()=>pick(i)}/>)}
     <div className="shelfStack" aria-hidden="true">
      <span className="stackBook isLower"><i className="stackFront"/><i className="stackTop"/></span>
      <span className="stackBook isUpper"><i className="stackFront"/><i className="stackTop"/></span>
     </div>
     <svg className="shelfPlant" viewBox="0 0 70 100" aria-hidden="true">
      <defs><linearGradient id="shelfPotFill" x2="1"><stop stopColor="#e2a07c"/><stop offset=".55" stopColor="#c8744f"/><stop offset="1" stopColor="#9c5234"/></linearGradient></defs>
      <g className="shelfPlantLeaves">
       <path d="M35 64C24 50 20 34 26 16c6 14 10 30 9 48z" fill="#5f8a56"/>
       <path d="M35 64c6-18 18-30 32-34-6 14-18 26-32 34z" fill="#86ad76"/>
       <path d="M35 64C22 58 8 58 2 50c14-4 26 2 33 14z" fill="#6f9a63"/>
       <path d="M35 64c2-16 10-30 22-40 0 16-8 30-22 40z" fill="#6f9a63"/>
       <path d="M35 64C30 48 34 30 44 20c2 16-2 32-9 44z" fill="#9dc08b"/>
       <path d="M30 18c3 10 5 28 5 46M56 26C46 38 38 52 35 64M4 50c12 2 24 6 31 14" stroke="#3f6437" strokeOpacity=".35" fill="none"/>
      </g>
      <path d="M17 64h36l-4 34H21z" fill="url(#shelfPotFill)"/>
      <rect x="14" y="61" width="42" height="7" rx="2" fill="#d98a64"/>
      <path d="M22 70c8 1 18 1 27 0" stroke="#fff" strokeOpacity=".18"/>
     </svg>
    </div>
   </div>
   <div className="shelfCaption" aria-live="polite"><strong>{book.title}</strong><span>{book.author}</span></div>
   <div className="hobbyControls"><button type="button" onClick={()=>move(-1)} aria-label="Previous book">←</button><span>{String(index+1).padStart(2,'0')} / {String(books.length).padStart(2,'0')}</span><button type="button" onClick={()=>move(1)} aria-label="Next book">→</button></div>
   <button className="hobbyTextButton hobbyReplay" type="button" onClick={()=>play(true)}>Replay shelf ↻</button>
  </div>
 </div>;
}

/* ───────────────────────── Reality TV ───────────────────────── */

type Doodle='house'|'glass'|'beach'|'diamond';
export type TvShow={title:string;kicker:string;from:string;to:string;doodle:Doodle};

const sparkle='M0 -6L1.4 -1.4L6 0L1.4 1.4L0 6L-1.4 1.4L-6 0L-1.4 -1.4Z';
function ShowDoodle({doodle}:{doodle:Doodle}){
 const line={pathLength:1,className:'tvDraw'};
 const glow='#fff3c4';
 if(doodle==='house')return <svg className="tvDoodle" viewBox="0 0 120 80" aria-hidden="true">
  <rect x="35" y="45" width="12" height="10" fill={glow} className="tvGlow"/><rect x="73" y="45" width="12" height="10" fill={glow} className="tvGlow"/>
  <path {...line} d="M18 44L60 14L102 44"/><path {...line} d="M28 37V70H92V37"/><path {...line} d="M54 70V53H66V70"/><path {...line} d="M80 27V18H88V33"/>
  <path {...line} d="M35 45h12v10H35zM73 45h12v10H73z"/><path {...line} d="M8 70h104"/>
 </svg>;
 if(doodle==='glass')return <svg className="tvDoodle" viewBox="0 0 120 80" aria-hidden="true">
  <path d="M46 26H74C73 40 67 47 60 47S47 40 46 26Z" fill="#ffd0dc" className="tvGlow"/>
  <path {...line} d="M44 12H76C76 38 68 48 60 48S44 38 44 12Z"/><path {...line} d="M60 48V68M48 70H72"/>
  <path d={sparkle} transform="translate(90 20)" fill="#fff" className="tvTwinkle"/><path d={sparkle} transform="translate(28 34) scale(.7)" fill="#fff" className="tvTwinkle tvTwinkleLate"/>
 </svg>;
 if(doodle==='beach')return <svg className="tvDoodle" viewBox="0 0 120 80" aria-hidden="true">
  <circle cx="96" cy="18" r="9" fill={glow} className="tvGlow"/>
  <path {...line} d="M20 44Q50 8 82 44"/><path {...line} d="M20 44Q30 36 40 44Q51 34 61 44Q72 36 82 44"/><path {...line} d="M51 26L60 70"/>
  <path {...line} className="tvDraw tvWave" d="M4 66q8-6 16 0t16 0t16 0t16 0t16 0t16 0t16 0"/>
 </svg>;
 return <svg className="tvDoodle" viewBox="0 0 120 80" aria-hidden="true">
  <path d="M60 14L80 30L60 66L40 30Z" fill="#fff" opacity=".18"/>
  <path {...line} d="M60 14L80 30L60 66L40 30Z"/><path {...line} d="M40 30H80M50 14L60 30L70 14M60 30V66M50 14H70"/>
  <path d={sparkle} transform="translate(92 22)" fill="#fff" className="tvTwinkle"/><path d={sparkle} transform="translate(26 50) scale(.8)" fill="#fff" className="tvTwinkle tvTwinkleLate"/><path d={sparkle} transform="translate(88 58) scale(.55)" fill="#fff" className="tvTwinkle"/>
 </svg>;
}

export function AboutRealityTV({shows,onClose}:{shows:TvShow[];onClose:()=>void}){
 const [index,setIndex]=useState(0);
 const [phase,setPhase]=useState<'boot'|'quick'|'on'|'off'>('on');
 const [flips,setFlips]=useState(0);
 const [run,setRun]=useState(0);
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};
 const clear=()=>{timers.current.forEach(clearTimeout);timers.current=[]};
 const power=(full:boolean)=>{
  clear();
  if(reduceMotion()){setPhase('on');return;}
  setRun(n=>n+1);setPhase(full?'boot':'quick');
  later(()=>setPhase('on'),full?2500:750);
 };
 useEffect(()=>{power(!seenOnce('neha-tv-seen-v1'));return clear},[]);
 const switchOff=React.useCallback(()=>{
  if(reduceMotion()){onClose();return;}
  clear();setPhase('off');later(onClose,520);
 },[onClose]);
 const flip=React.useCallback((d:number)=>{
  if(phase!=='on')return;
  setIndex(i=>(i+d+shows.length)%shows.length);setFlips(n=>n+1);
 },[phase,shows.length]);
 useArrowKeys(flip,switchOff);
 const show=shows[index];
 const ch=String(index+2).padStart(2,'0');
 return <div className={`hobbyTakeover tvTakeover is-${phase}`} key={run}>
  <div className="hobbyHeader"><span>ALWAYS ON ROTATION</span><button type="button" className="hobbyClose" onClick={switchOff} aria-label="Turn off the TV">×</button></div>
  <div className="tvSet">
   <div className="tvEars" key={`ears-${flips}`} aria-hidden="true"><i/><i/><span/></div>
   <div className="tvCabinet">
    <div className="tvBezel">
     <div className="tvGlass">
      <div className="tvProgram" key={`${index}-${flips}`} style={{'--from':show.from,'--to':show.to} as React.CSSProperties} aria-live="polite">
       <ShowDoodle doodle={show.doodle}/>
       <div className="tvKicker">{show.kicker}</div>
       <div className="tvTitle">{show.title}</div>
      </div>
      <span className="tvOsd" key={`osd-${flips}`} aria-hidden="true">{phase==='boot'?'TUNING…':`CH ${ch}`}</span>
      <span className="tvStatic" key={`static-${flips}`} aria-hidden="true"/>
      <span className="tvScan" aria-hidden="true"/>
      <span className="tvBeam" aria-hidden="true"/>
     </div>
    </div>
    <div className="tvPanel">
     <button type="button" className="tvDial" onClick={()=>flip(1)} aria-label={`Change channel (now channel ${ch}, ${show.title})`} style={{'--turn':`${index*72}deg`} as React.CSSProperties}><i/></button>
     <span className="tvKnob" aria-hidden="true"/>
     <span className="tvGrille" aria-hidden="true"/>
     <button type="button" className="tvPower" onClick={switchOff} aria-label="Turn off the TV"><i/></button>
    </div>
   </div>
   <div className="tvFeet" aria-hidden="true"><i/><i/></div>
  </div>
  <div className="hobbyControls"><button type="button" onClick={()=>flip(-1)} aria-label="Previous channel">←</button><span>{String(index+1).padStart(2,'0')} / {String(shows.length).padStart(2,'0')}</span><button type="button" onClick={()=>flip(1)} aria-label="Next channel">→</button></div>
  <button className="hobbyTextButton hobbyReplay" type="button" onClick={()=>power(true)}>Turn it off and on again ↻</button>
 </div>;
}
