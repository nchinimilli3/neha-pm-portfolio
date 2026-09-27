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
 lenis=new Lenis({lerp:.12,wheelMultiplier:.9});
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
 if(l){l.scrollTo(y,{duration,force:true,lock:true,easing:linear?t=>t:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,onComplete});return}
 window.scrollTo({top:y,behavior:'auto'});onComplete?.();
}

export {gsap,ScrollTrigger,Observer};
