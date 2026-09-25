import React,{useEffect,useRef,useState} from 'react';

/* A one-button take on the CSE 335 game: Sparty runs, a Michigan player
   charges, you jump. Click, tap, or press Space while it's focused. It only
   moves while someone is playing and pauses when scrolled out of view. */

type Phase='idle'|'playing'|'over';

export default function SpartanGame(){
 const sceneRef=useRef<HTMLDivElement>(null),spartyRef=useRef<HTMLImageElement>(null),enemyRef=useRef<HTMLImageElement>(null),groundRef=useRef<HTMLDivElement>(null);
 const [phase,setPhase]=useState<Phase>('idle');
 const [score,setScore]=useState(0);
 const [best,setBest]=useState(0);
 const game=useRef({x:1.1,y:0,vy:0,speed:.36,passed:false,score:0,ground:0,last:0,raf:0});

 const jump=()=>{const g=game.current,h=sceneRef.current?.clientHeight||200;if(g.y<=0.5)g.vy=h*1.75};
 const start=()=>{
  const g=game.current;Object.assign(g,{x:1.1,y:0,vy:0,speed:.36,passed:false,score:0,last:0});
  setScore(0);setPhase('playing');sceneRef.current?.focus({preventScroll:true});
 };
 const press=()=>{if(phase==='playing')jump();else start()};

 useEffect(()=>{
  if(phase!=='playing')return;
  const scene=sceneRef.current,sp=spartyRef.current,en=enemyRef.current;if(!scene||!sp||!en)return;
  const g=game.current;
  const tick=(now:number)=>{
   g.raf=requestAnimationFrame(tick);
   const dt=g.last?Math.min(.05,(now-g.last)/1000):0;g.last=now;
   const w=scene.clientWidth,h=scene.clientHeight;
   // Sparty: gravity and the jump arc.
   if(g.y>0||g.vy>0){g.vy-=h*4.4*dt;g.y=Math.max(0,g.y+g.vy*dt);if(g.y===0)g.vy=0}
   sp.style.transform=`translateY(${-g.y}px)`;
   // The defender charges from the right; speed rises with the score.
   g.x-=g.speed*dt;
   if(g.x<-.15){g.x=1.05+Math.random()*.35;g.passed=false;g.speed=Math.min(.95,g.speed+.035)}
   en.style.left=`${g.x*100}%`;
   g.ground=(g.ground+g.speed*dt*w)%64;
   if(groundRef.current)groundRef.current.style.backgroundPosition=`${-g.ground}px 0`;
   // Collision, with forgiving hitboxes.
   const sL=.18*w+.035*w,sR=.18*w+.095*w,eL=g.x*w+.03*w,eR=g.x*w+.08*w;
   const enemyTop=en.offsetHeight*.6;
   if(eL<sR&&eR>sL&&g.y<enemyTop){
    cancelAnimationFrame(g.raf);setBest(b=>Math.max(b,g.score));setPhase('over');return;
   }
   if(!g.passed&&eR<sL){g.passed=true;g.score++;setScore(g.score)}
  };
  g.raf=requestAnimationFrame(tick);
  const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting){cancelAnimationFrame(g.raf);setBest(b=>Math.max(b,g.score));setPhase('idle')}},{threshold:.2});
  io.observe(scene);
  return()=>{cancelAnimationFrame(g.raf);io.disconnect()};
 },[phase]);

 useEffect(()=>{
  // Park the sprites where the original screenshot had them when not playing.
  if(phase==='playing')return;
  if(spartyRef.current)spartyRef.current.style.transform='';
  if(enemyRef.current&&phase==='idle')enemyRef.current.style.left='';
 },[phase]);

 const onKey=(e:React.KeyboardEvent)=>{if(e.key===' '||e.key==='ArrowUp'||e.key==='Enter'){e.preventDefault();press()}};
 return <div ref={sceneRef} className={`spartanScene sgGame is-${phase}`} tabIndex={0} role="button"
  aria-label={phase==='playing'?`Spartan Touchdown, score ${score}. Press space to jump.`:'Play Spartan Touchdown. Press space or click to start, then to jump.'}
  onPointerDown={e=>{e.preventDefault();press()}} onKeyDown={onKey}>
  <img className="spartanBg" src="project-media/spartan-background.png" alt="" width={2048} height={1024} loading="lazy" decoding="async"/>
  <div className="spartanGround" ref={groundRef}></div>
  <img className="spartySprite" ref={spartyRef} src="project-media/sparty.png" alt="Sparty" loading="lazy" decoding="async"/>
  <img className="enemySprite" ref={enemyRef} src="project-media/um-enemy.png" alt="Michigan defender" loading="lazy" decoding="async"/>
  {phase==='playing'&&<span className="sgScore" aria-hidden="true">{score}</span>}
  {phase!=='playing'&&<span className="sgOverlay" aria-hidden="true">
   {phase==='over'?<><b>Tackled!</b><small>{score} {score===1?'dodge':'dodges'}{best>0?` · best ${best}`:''} · click to play again</small></>:<><b>▶ Play</b><small>click or press space to jump</small></>}
  </span>}
 </div>
}
