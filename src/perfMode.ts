import './low-fx.css';
import {currentLenis} from './smoothScroll';

/* Keeping the scroll scenes smooth on slow machines.

   - pageY(): the scroll position from Lenis, which sets it earlier in the same frame, so
     the scenes neither force a layout to learn it nor draw a frame behind it.
   - html.isScrolling: set while the page moves, so the hero's rooms stop taking the
     pointer (see .dhShield in desk-hero.css).
   - html.lowFx: set when this device can't keep up (it drops frames during the first
     scroll) or asks for reduced motion. low-fx.css then swaps the costly effects (blend
     modes, live blurs, frosted glass) for cheap look-alikes. Fast devices never switch. */

export const pageY=()=>{const l=currentLenis();return l?l.scroll:window.scrollY};

const LOW_KEY='neha-fx';
const root=()=>document.documentElement;

function watchFrames(){
 const html=root();
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){html.classList.add('lowFx');return()=>{}}
 try{if(sessionStorage.getItem(LOW_KEY)==='low'){html.classList.add('lowFx');return()=>{}}}catch{}
 // Frame gaps are sampled only while the page is actually scrolling; 60 of them decide.
 const gaps:number[]=[];let last=0,raf=0,moving=false,done=false;
 const tick=(t:number)=>{
  raf=0;if(done)return;
  if(last&&moving)gaps.push(t-last);
  last=moving?t:0;
  if(gaps.length>=60){
   done=true;
   const sorted=[...gaps].sort((a,b)=>a-b),median=sorted[sorted.length>>1];
   // Under ~45fps at the median: this device needs the light scene.
   if(median>22){html.classList.add('lowFx');try{sessionStorage.setItem(LOW_KEY,'low')}catch{}}
   return;
  }
  if(moving)raf=requestAnimationFrame(tick);
 };
 return(scrolling:boolean)=>{if(done)return;moving=scrolling;if(moving&&!raf){last=0;raf=requestAnimationFrame(tick)}};
}

export function startPerfMode(){
 if(typeof window==='undefined')return;
 const html=root();
 const onFrames=watchFrames();
 let idle=0,scrolling=false;
 const onScroll=()=>{
  if(!scrolling){scrolling=true;html.classList.add('isScrolling');onFrames(true)}
  window.clearTimeout(idle);
  idle=window.setTimeout(()=>{scrolling=false;html.classList.remove('isScrolling');onFrames(false)},180);
 };
 window.addEventListener('scroll',onScroll,{passive:true});
}
