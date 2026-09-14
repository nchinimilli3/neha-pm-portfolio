import React, { useEffect, useRef, useState } from 'react';
import MachEArtwork from './MachEArtwork';
import './finsimple-mache.css';

export default function FinSimpleMachE(){
 const scene=useRef<HTMLDivElement>(null);
 const car=useRef<HTMLDivElement>(null);
 const streak=useRef<HTMLDivElement>(null);
 const [replay,setReplay]=useState(0);
 useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const update=()=>{
   frame=0;
   if(!scene.current||!car.current||!streak.current)return;
   const rect=scene.current.getBoundingClientRect();
   // The full-width scene spans the page; scrolling controls its horizontal travel.
   const p=reduced.matches?0:Math.max(0,Math.min(1,(window.innerHeight*.72-rect.top)/(window.innerHeight*.62)));
   const ease=p*p;
   const travel=Math.max(0,rect.width-car.current.offsetWidth-24);
   const x=12+ease*travel;
   car.current.style.transform=`translateX(${x}px)`;
   car.current.style.setProperty('--me-wheel',`${ease*650}deg`);
   streak.current.style.width=`${Math.max(0,x+50)}px`;
   streak.current.style.opacity=String(p===0?0:Math.min(.85,p*4));
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule)};
 },[replay]);
 return <div className="meScrollScene" ref={scene}><div className="meScrollHeading"><span>FORD MUSTANG MACH-E</span><span>SCROLL TO DRIVE →</span></div><div className="meRoadStage"><div className="meElectricWake" ref={streak} aria-hidden="true"><i/><i/><i/></div><div className="meScrollCar" ref={car}><MachEArtwork/></div><div className="meGroundLine" aria-hidden="true"/></div><button className="meScrollReplay" type="button" onClick={()=>{if(scene.current)window.scrollTo({top:Math.max(0,window.scrollY+scene.current.getBoundingClientRect().top-window.innerHeight*.78),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});setReplay(v=>v+1)}}>Back to the starting line ↶</button></div>
}
