import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
/* One Lenis instance for the page: wheel and trackpad input become one steady glide.
   Touch keeps the phone's native scrolling, and reduced-motion visitors get no smoothing.
   Its clock runs only while a glide is moving: a clock left running wakes the page's main
   thread every frame at rest. */
let lenis:Lenis|null=null,raf=0;
const frame=(t:number)=>{raf=0;if(!lenis)return;lenis.raf(t);if(lenis.isScrolling==='smooth')raf=requestAnimationFrame(frame)};
// Lenis steps by the time since its last frame; after a rest, count from one frame ago, not the rest.
const wake=()=>{if(raf||!lenis)return;raf=requestAnimationFrame(t=>{if(lenis)lenis.time=t-1000/60;frame(t)})};
export function getLenis(){
 if(lenis||typeof window==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return lenis;
 lenis=new Lenis({lerp:.2,wheelMultiplier:.9});
 lenis.on('virtual-scroll',wake);
 return lenis;
}

// The running instance, if any, without starting one.
export const currentLenis=()=>lenis;

/* Scroll to a y position through Lenis when it's running (even while it's stopped for a
   pinned scene), else natively. */
// `linear` is for scenes that ease their own motion along the scroll (the fun desk's camera),
// so the page's glide doesn't stack a second ease on top.
export function glideTo(y:number,{duration=1,linear=false,onComplete}:{duration?:number;linear?:boolean;onComplete?:()=>void}={}){
 const l=getLenis();
 // Lenis clamps to the page height it last measured. Home's lower sections mount after the
 // hero, so without a fresh measure every glide past the hero stopped at the hero's end.
 if(l){l.resize();l.scrollTo(y,{duration,force:true,lock:true,easing:linear?t=>t:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,onComplete});wake();return}
 window.scrollTo({top:y,behavior:'auto'});onComplete?.();
}

/* Go to a section. A long trip cuts to one screen short of it and glides the rest: gliding
   the whole way played every scroll scene in between (the walk-in, the fun desk) at speed,
   which no GPU draws smoothly. */
export function glideToHash(hash:string){
 const t=hashTarget(hash);if(!t)return false;
 const l=getLenis(),from=l?l.scroll:window.scrollY,d=t.y-from,vh=window.innerHeight;
 if(Math.abs(d)>vh*1.5){const near=t.y-Math.sign(d)*vh;if(l){l.resize();l.scrollTo(near,{immediate:true,force:true})}else window.scrollTo(0,near)}
 glideTo(t.y,{duration:.8});
 return true;
}

/* In-page links (#fun, #about, #top…) glide through Lenis. Left to the browser, its own
   smooth scroll and Lenis fight, and the jump stops partway (stranded mid walk-in). The
   URL updates with pushState, so the hash router doesn't re-render. A page opened with a
   section hash lands on it once that section has mounted (home builds below the hero late). */
let anchorsOn=false;
const SECTION_HASH=/^#[A-Za-z][\w-]*$/;
const hashTarget=(hash:string)=>{
 const el=document.getElementById(hash.slice(1));
 if(hash==='#top')return {el,y:0};
 if(!el)return null;
 const margin=parseFloat(getComputedStyle(el).scrollMarginTop)||0;
 return {el,y:Math.max(0,el.getBoundingClientRect().top+window.scrollY-margin)};
};
export function initAnchors(){
 if(anchorsOn||typeof window==='undefined')return;anchorsOn=true;
 document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=(e.target as Element)?.closest?.('a[href^="#"]');const hash=a?.getAttribute('href')||'';
  if(!SECTION_HASH.test(hash))return;
  if(!hashTarget(hash))return;
  e.preventDefault();history.pushState(null,'',hash);
  glideToHash(hash);
 });
 const hash=window.location.hash;
 if(SECTION_HASH.test(hash)&&hash!=='#top'){
  const t0=performance.now();
  const land=()=>{
   const t=hashTarget(hash);
   if(!t){if(performance.now()-t0<5000)window.setTimeout(land,100);return}
   // Two frames so the section's own layout (and anything above it) has settled.
   requestAnimationFrame(()=>requestAnimationFrame(()=>{const y=hashTarget(hash)?.y??t.y;const l=currentLenis();if(l){l.resize();l.scrollTo(y,{immediate:true,force:true})}else window.scrollTo(0,y)}));
  };
  land();
 }
}
