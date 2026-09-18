import React, {useEffect, useRef} from 'react';
import './commute-bart.css';

/* The reference render of car 3102, cut out of its white background with the rail removed, so
   the car itself is identical to the reference. Motion is layered on top of it: the car rolls in
   from the page edge over a fixed rail and brakes into place, its wheels turn and blur with
   speed, the body rides with a little vibration, and a light sweeps along it as it passes. */
const SRC = 'project-media/bart-train.webp';
const IMG_W = 2172, IMG_H = 418, WHEEL_R = 44, WHEEL_Y = 375;
const WHEEL_X = [171, 465, 1724, 2009];

export default function CommuteBARTStory(){
 const sceneRef=useRef<HTMLDivElement>(null);
 const trainRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const scene=sceneRef.current,train=trainRef.current;
  if(!scene||!train)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let target=0,current=0,speed=0,frame=0;
  const measure=()=>{
   const box=scene.getBoundingClientRect();
   // Fully off the left edge of the page at the start, parked in the column at the end.
   const offstage=box.left+box.width+60;
   const progress=Math.max(0,Math.min(1,(window.innerHeight-box.top)/(window.innerHeight*.55)));
   const eased=1-Math.pow(1-progress,3); // decelerates like a train braking into a platform
   target=-offstage*(1-eased);
   train.style.setProperty('--sheen',String(eased));
  };
  const tick=(t:number)=>{
   frame=0;
   const prev=current;
   current+=(target-current)*.16; // a little inertia so the car has mass
   if(Math.abs(target-current)<.05)current=target;
   speed=Math.min(1,speed*.86+Math.abs(current-prev)/28*.84);
   const wheelRadius=WHEEL_R/IMG_W*train.offsetWidth;
   const bounce=speed*(Math.sin(t/38)*.7+Math.sin(t/13)*.35);
   train.style.transform=`translate3d(${current}px,${bounce}px,0)`;
   train.style.setProperty('--wheel',`${current/wheelRadius*57.2958}deg`);
   train.style.setProperty('--speed',speed.toFixed(3));
   if(Math.abs(target-current)>.05||speed>.01)frame=requestAnimationFrame(tick);
   else train.style.setProperty('--speed','0');
  };
  const kick=()=>{
   if(reduced.matches){train.style.transform='';train.style.setProperty('--sheen','1');return}
   measure();
   if(!frame)frame=requestAnimationFrame(tick);
  };
  measure();current=target;kick();
  window.addEventListener('scroll',kick,{passive:true});window.addEventListener('resize',kick);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',kick);window.removeEventListener('resize',kick)};
 },[]);

 const pct=(n:number)=>`${n}%`;
 return <section className="commuteBARTStory" aria-label="A BART train rolls in as the page scrolls">
  <div ref={sceneRef} className="bartSceneSimple">
   <div className="bartRail" aria-hidden="true"/>
   <div ref={trainRef} className="bartTrain">
    <img className="bartBody" src={SRC} width={IMG_W} height={IMG_H} decoding="async" alt="BART Fleet of the Future train car 3102 with blue wrapped ends and the BART logo, two pairs of sliding doors, and an SFO Airport destination sign"/>
    {/* Each wheel is the same pixels from the photo, turned by the distance travelled. At rest
        the angle is 0, so they sit exactly on the original. */}
    {WHEEL_X.map(cx=><span key={cx} className="bartWheel" aria-hidden="true" style={{
     left:pct((cx-WHEEL_R)/IMG_W*100),
     top:pct((WHEEL_Y-WHEEL_R)/IMG_H*100),
     width:pct(2*WHEEL_R/IMG_W*100),
     backgroundImage:`url(${SRC})`,
     backgroundSize:`${IMG_W/(2*WHEEL_R)*100}% auto`,
     backgroundPosition:`${(cx-WHEEL_R)/(IMG_W-2*WHEEL_R)*100}% ${(WHEEL_Y-WHEEL_R)/(IMG_H-2*WHEEL_R)*100}%`
    }}/>)}
    <span className="bartSheen" aria-hidden="true" style={{maskImage:`url(${SRC})`,WebkitMaskImage:`url(${SRC})`}}/>
   </div>
  </div>
 </section>
}
