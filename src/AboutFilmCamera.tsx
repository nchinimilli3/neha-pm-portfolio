import React, { useEffect, useRef, useState } from 'react';
import './about-film.css';

const asset=(src:string)=>`${import.meta.env.BASE_URL}${src}`;
const seenKey='neha-film-camera-seen-v1';
let seenThisVisit=false;

// Original vector interpretation of the cream/rainbow OneStep with an accessory flashbar.
// Visual reference: https://danfinnen.com/review/polaroid-rainbow-white-onestep-camera-review/
function InstantCamera({photo}){
 return <svg className="instantCameraArt" viewBox="0 0 500 590" role="img" aria-label="An instant camera flashes and prints a film photo">
 <defs>
  <linearGradient id="filmCream" x2=".6" y2="1"><stop stopColor="#fffdf3"/><stop offset=".5" stopColor="#e9e4d7"/><stop offset="1" stopColor="#bcb8af"/></linearGradient>
  <linearGradient id="filmBlack" x2=".6" y2="1"><stop stopColor="#4e5354"/><stop offset=".6" stopColor="#202829"/><stop offset="1" stopColor="#11191c"/></linearGradient>
  <radialGradient id="filmLens"><stop stopColor="#597c85"/><stop offset=".22" stopColor="#122f3a"/><stop offset=".48" stopColor="#061b24"/><stop offset=".64" stopColor="#325360"/><stop offset=".75" stopColor="#0c252d"/><stop offset="1" stopColor="#050d12"/></radialGradient>
  <linearGradient id="filmMetal" x2=".8" y2="1"><stop stopColor="#e9ece6"/><stop offset=".3" stopColor="#86918f"/><stop offset=".5" stopColor="#f5f2e8"/><stop offset="1" stopColor="#6c7777"/></linearGradient>
  <radialGradient id="filmFlash"><stop stopColor="#fffef6" stopOpacity=".9"/><stop offset="1" stopColor="#fffef6" stopOpacity="0"/></radialGradient>
  <clipPath id="filmEjectClip"><path d="M100 334H400V585H100Z"/></clipPath>
 </defs>
 <ellipse cx="255" cy="366" rx="175" ry="13" fill="#222e32" opacity=".09"/>
 <g className="filmCameraBody">
 <path d="M80 213L108 139H390L420 213V326L403 357H97L80 326Z" fill="url(#filmCream)" stroke="#92988f"/>
 <path d="M108 139L123 123H373L390 139Z" fill="#f9f6eb" stroke="#c1c3b8"/>
 <rect x="173" y="112" width="154" height="15" rx="3" fill="#283031"/>
 <rect x="116" y="65" width="268" height="54" rx="10" fill="url(#filmBlack)" stroke="#919b96" strokeWidth="2"/>
 <rect x="127" y="75" width="246" height="33" rx="4" fill="url(#filmMetal)"/>
 {Array.from({length:10},(_,i)=><rect key={i} x={131+i*24} y="78" width="18" height="27" rx="3" fill="#f4edcd" stroke="#acb4ab"/>)}
 <path d="M87 230H413L406 325H94Z" fill="#ede9de"/>
 <rect x="105" y="158" width="63" height="40" rx="5" fill="#273234" stroke="#afb5ad" strokeWidth="3"/><rect x="116" y="167" width="40" height="21" rx="3" fill="#527079"/><path d="M121 169H146L122 182Z" fill="#bad0cc" opacity=".5"/>
 <text x="106" y="219" fill="#53615f" fontSize="9" letterSpacing="1.5" fontFamily="monospace">ONE MOMENT</text>
 <circle cx="134" cy="256" r="20" fill="#999d94"/><circle cx="134" cy="254" r="16" fill="#b55a47" stroke="#de8b6d" strokeWidth="2"/>
 <circle cx="255" cy="220" r="75" fill="url(#filmMetal)"/><circle cx="255" cy="220" r="69" fill="url(#filmBlack)" stroke="#111c1e" strokeWidth="2"/>
 <circle cx="255" cy="220" r="57" fill="none" stroke="#7d8986" strokeWidth="2" strokeDasharray="1 4"/><circle cx="255" cy="220" r="48" fill="#091b21" stroke="#aeb8ac"/><circle cx="255" cy="220" r="41" fill="url(#filmLens)"/>
 <ellipse cx="241" cy="204" rx="16" ry="10" fill="#a0c7cd" opacity=".35" transform="rotate(-35 241 204)"/><circle cx="268" cy="234" r="7" fill="#72949d" opacity=".4"/>
 <rect x="348" y="174" width="34" height="35" rx="5" fill="#293334"/><circle cx="365" cy="191" r="10" fill="#434f4e" stroke="#7a8580"/>
 <path d="M347 242H380M363 228V257" stroke="#7e8881" strokeWidth="2"/><circle cx="363" cy="242" r="7" fill="#394746"/>
 {['#bd564c','#d68849','#d8b963','#879c7d','#628993'].map((color,i)=><rect key={color} x={235+i*8} y="296" width="8" height="38" fill={color}/>)}
 <path d="M80 318L99 355H402L420 318Z" fill="url(#filmBlack)" stroke="#384440"/>
 <path d="M110 335H390" stroke="#090f11" strokeWidth="12" strokeLinecap="round"/><path d="M111 330H390" stroke="#959c93" strokeWidth="2"/>
 </g>
 <g clipPath="url(#filmEjectClip)"><g className="filmEjectPrint"><rect x="145" y="338" width="210" height="218" rx="2" fill="#fffdf3" stroke="#d2d1c4"/><image href={asset(photo.src)} x="157" y="350" width="186" height="165" preserveAspectRatio="xMidYMid meet"/><text x="250" y="539" textAnchor="middle" fontFamily="monospace" fontSize="9" letterSpacing="2" fill="#747a72">A LITTLE OF MY WORLD</text></g></g>
 <ellipse className="filmSoftFlash" cx="250" cy="90" rx="185" ry="110" fill="url(#filmFlash)"/>
 </svg>
}

export default function AboutFilmCamera({photos,open,index,onClose,onChange}){
 const [printing,setPrinting]=useState(false);
 const [run,setRun]=useState(0);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const finish=()=>{if(timer.current)clearTimeout(timer.current);timer.current=null;setPrinting(false)};
 const start=()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(timer.current)clearTimeout(timer.current);
  setPrinting(true);setRun(n=>n+1);
  timer.current=setTimeout(finish,3900);
 };
 useEffect(()=>{
  if(!open){finish();return;}
  let seen=seenThisVisit;
  try{seen=seen||sessionStorage.getItem(seenKey)==='yes';sessionStorage.setItem(seenKey,'yes')}catch{}
  seenThisVisit=true;
  if(!seen)start();
  return()=>{if(timer.current)clearTimeout(timer.current)};
 },[open]);
 useEffect(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const changed=()=>{if(reduce.matches)finish()};
  reduce.addEventListener('change',changed);
  return()=>reduce.removeEventListener('change',changed);
 },[]);
 const move=(delta:number)=>onChange((index+delta+photos.length)%photos.length);
 useEffect(()=>{
  if(!open)return;
  const key=(e:KeyboardEvent)=>{
   const target=e.target as HTMLElement;
   if(target?.matches('input,textarea,select,[contenteditable=true]'))return;
   if(e.key==='Escape'){onClose();return;}
   if(!printing&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}
  };
  window.addEventListener('keydown',key);
  return()=>window.removeEventListener('keydown',key);
 },[open,index,printing]);
 if(!open)return <div className="aboutFilmFrame"><img className="aboutHeadshot" src={asset('headshot.jpg')} alt="Neha Chinimilli" width={1066} height={1599}/></div>;
 const photo=photos[index];
 return <div className={`aboutFilmFrame isGallery instantFilmFrame ${printing?'isPrinting':''}`} style={{'--film-ratio':photo.width/photo.height} as React.CSSProperties}>
  {printing?<div className="filmCameraSequence" key={run}><InstantCamera photo={photo}/><div className="filmPrintStatus" role="status">Developing a little memory…</div><button className="filmSkip" type="button" onClick={finish}>Skip animation →</button></div>:<div className="filmGalleryReveal"><div className="filmGalleryHeader"><span>35 MM / NEHA’S FILM</span><button type="button" onClick={onClose} aria-label="Close film photos">×</button></div><img className="filmGalleryPhoto" src={asset(photo.src)} alt={photo.alt} width={photo.width} height={photo.height}/><div className="filmGalleryControls"><button type="button" onClick={()=>move(-1)} aria-label="Previous film photo">←</button><span aria-live="polite">{String(index+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</span><button type="button" onClick={()=>move(1)} aria-label="Next film photo">→</button></div><button className="filmReplay" type="button" onClick={start}>Replay camera ↻</button></div>}
  {printing&&<button type="button" className="filmSequenceClose" onClick={onClose} aria-label="Close film photos">×</button>}
 </div>
}
