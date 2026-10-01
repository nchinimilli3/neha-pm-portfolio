import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Observer} from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger,Observer);

/* One Lenis instance for the page: wheel and trackpad input become one steady glide,
   and ScrollTrigger reads positions from it. Touch keeps the phone's native scrolling,
   and reduced-motion visitors get no smoothing at all. */
let lenis:Lenis|null=null;
export function getLenis(){
 if(lenis||typeof window==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return lenis;
 lenis=new Lenis({lerp:.2,wheelMultiplier:.9});
 lenis.on('scroll',ScrollTrigger.update);
 gsap.ticker.add(t=>lenis?.raf(t*1000));
 gsap.ticker.lagSmoothing(0);
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
 if(l){l.resize();l.scrollTo(y,{duration,force:true,lock:true,easing:linear?t=>t:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,onComplete});return}
 window.scrollTo({top:y,behavior:'auto'});onComplete?.();
}

export {gsap,ScrollTrigger,Observer};

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
  const t=hashTarget(hash);if(!t)return;
  e.preventDefault();history.pushState(null,'',hash);
  const d=Math.abs(t.y-window.scrollY);
  glideTo(t.y,{duration:Math.min(1.6,.5+d/9000)});
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
