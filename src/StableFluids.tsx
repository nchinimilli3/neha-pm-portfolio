import {useEffect,useRef,useState} from 'react';

/* A live browser port of the CSE 476 project: Jos Stam's "Stable Fluids"
   (semi-Lagrangian advection, Gauss-Seidel diffusion, pressure projection)
   on a small grid, drawn to a canvas and scaled up. Dragging stirs the dye;
   a slow emitter keeps it alive the way the C++ version's emitters did. The
   loop only runs while the window is on screen. */

const W=112,H=63,N=(W+2)*(H+2);
const IX=(i:number,j:number)=>i+(W+2)*j;

function setBnd(b:number,x:Float32Array){
 for(let i=1;i<=W;i++){x[IX(i,0)]=b===2?-x[IX(i,1)]:x[IX(i,1)];x[IX(i,H+1)]=b===2?-x[IX(i,H)]:x[IX(i,H)]}
 for(let j=1;j<=H;j++){x[IX(0,j)]=b===1?-x[IX(1,j)]:x[IX(1,j)];x[IX(W+1,j)]=b===1?-x[IX(W,j)]:x[IX(W,j)]}
 x[IX(0,0)]=.5*(x[IX(1,0)]+x[IX(0,1)]);x[IX(0,H+1)]=.5*(x[IX(1,H+1)]+x[IX(0,H)]);
 x[IX(W+1,0)]=.5*(x[IX(W,0)]+x[IX(W+1,1)]);x[IX(W+1,H+1)]=.5*(x[IX(W,H+1)]+x[IX(W+1,H)]);
}
function linSolve(b:number,x:Float32Array,x0:Float32Array,a:number,c:number,iters=14){
 for(let k=0;k<iters;k++){
  for(let j=1;j<=H;j++)for(let i=1;i<=W;i++){const n=IX(i,j);x[n]=(x0[n]+a*(x[n-1]+x[n+1]+x[n-(W+2)]+x[n+(W+2)]))/c}
  setBnd(b,x);
 }
}
function advect(b:number,d:Float32Array,d0:Float32Array,u:Float32Array,v:Float32Array,dt:number){
 const dtx=dt*W,dty=dt*H;
 for(let j=1;j<=H;j++)for(let i=1;i<=W;i++){
  const n=IX(i,j);let x=i-dtx*u[n],y=j-dty*v[n];
  x=Math.max(.5,Math.min(W+.5,x));y=Math.max(.5,Math.min(H+.5,y));
  const i0=x|0,j0=y|0,s1=x-i0,t1=y-j0,s0=1-s1,t0=1-t1;
  d[n]=s0*(t0*d0[IX(i0,j0)]+t1*d0[IX(i0,j0+1)])+s1*(t0*d0[IX(i0+1,j0)]+t1*d0[IX(i0+1,j0+1)]);
 }
 setBnd(b,d);
}
function project(u:Float32Array,v:Float32Array,p:Float32Array,div:Float32Array){
 for(let j=1;j<=H;j++)for(let i=1;i<=W;i++){const n=IX(i,j);div[n]=-.5*((u[n+1]-u[n-1])/W+(v[n+W+2]-v[n-W-2])/H);p[n]=0}
 setBnd(0,div);setBnd(0,p);linSolve(0,p,div,1,4,18);
 for(let j=1;j<=H;j++)for(let i=1;i<=W;i++){const n=IX(i,j);u[n]-=.5*W*(p[n+1]-p[n-1]);v[n]-=.5*H*(p[n+W+2]-p[n-W-2])}
 setBnd(1,u);setBnd(2,v);
}

// The sim waits behind a Play button, like Spartan Touchdown: solving the grid every
// frame is costly, so it only runs once asked. `live` goes false when the desk tour
// moves to another device; the sim then pauses on its last frame and shows Play again.
export default function StableFluids({live=true}:{live?:boolean}){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const [touched,setTouched]=useState(false);
 const [playing,setPlaying]=useState(false);
 const liveRef=useRef(false),wakeRef=useRef<()=>void>(()=>{});
 useEffect(()=>{if(!live)setPlaying(false)},[live]);
 useEffect(()=>{liveRef.current=playing&&live;if(liveRef.current)wakeRef.current()},[playing,live]);
 useEffect(()=>{
  const canvas=canvasRef.current;if(!canvas)return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const u=new Float32Array(N),v=new Float32Array(N),u0=new Float32Array(N),v0=new Float32Array(N);
  const dye=[0,1,2].map(()=>new Float32Array(N)),tmp=new Float32Array(N),p=new Float32Array(N),div=new Float32Array(N);
  const img=ctx.createImageData(W,H);
  const dt=.1,visc=.00001;
  let raf=0,visible=false,t=0,hue=0,idle=0;
  const pointer={x:0,y:0,px:0,py:0,down:false,active:false};

  const hsl=(h:number)=>{const f=(n:number)=>{const k=(n+h/30)%12;return .5-.45*Math.max(-1,Math.min(k-3,9-k,1))};return [f(0),f(8),f(4)]};
  const splat=(gx:number,gy:number,fx:number,fy:number,rgb:number[],amt:number,r=3)=>{
   for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){
    const x=Math.round(gx)+i,y=Math.round(gy)+j;if(x<1||x>W||y<1||y>H)continue;
    const f=Math.exp(-(i*i+j*j)/(r*r*.6)),n=IX(x,y);
    u[n]+=fx*f;v[n]+=fy*f;dye[0][n]+=rgb[0]*amt*f;dye[1][n]+=rgb[1]*amt*f;dye[2][n]+=rgb[2]*amt*f;
   }
  };
  const step=()=>{
   // velocity: diffuse, project, advect, project
   u0.set(u);v0.set(v);
   linSolve(1,u,u0,dt*visc*W*H,1+4*dt*visc*W*H,4);linSolve(2,v,v0,dt*visc*W*H,1+4*dt*visc*W*H,4);
   project(u,v,p,div);
   u0.set(u);v0.set(v);advect(1,u,u0,u0,v0,dt);advect(2,v,v0,u0,v0,dt);
   project(u,v,p,div);
   for(const d of dye){tmp.set(d);advect(0,d,tmp,u,v,dt);for(let n=0;n<N;n++)d[n]*=.994}
  };
  const draw=()=>{
   const px=img.data;
   for(let j=0;j<H;j++)for(let i=0;i<W;i++){
    const n=IX(i+1,j+1),o=(i+j*W)*4;
    px[o]=Math.min(255,14+dye[0][n]*255);px[o+1]=Math.min(255,16+dye[1][n]*255);px[o+2]=Math.min(255,30+dye[2][n]*255);px[o+3]=255;
   }
   ctx.putImageData(img,0,0);
  };
  const frame=()=>{
   raf=0;if(!visible)return;
   t++;hue=(hue+.6)%360;
   if(pointer.active){
    const dx=pointer.x-pointer.px,dy=pointer.y-pointer.py;
    splat(pointer.x,pointer.y,dx*.9,dy*.9,hsl(hue),pointer.down?.9:.45,pointer.down?4:3);
    pointer.px=pointer.x;pointer.py=pointer.y;
    idle=0;
   }else idle++;
   // The emitter: a slow jet from the left edge that sweeps up and down.
   if(!reduce){const y=H/2+Math.sin(t*.018)*H*.28;splat(4,y,2.4,Math.cos(t*.018)*.6,hsl((hue+180)%360),.35,3)}
   step();draw();
   if(liveRef.current&&(!reduce||idle<240))raf=requestAnimationFrame(frame);else raf=0;
  };
  const kick=()=>{if(!raf&&visible&&liveRef.current)raf=requestAnimationFrame(frame)};
  wakeRef.current=kick;
  const toGrid=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width*W+1,y:(e.clientY-r.top)/r.height*H+1}};
  const onMove=(e:PointerEvent)=>{const g=toGrid(e);if(!pointer.active){pointer.px=g.x;pointer.py=g.y}pointer.x=g.x;pointer.y=g.y;pointer.active=true;setTouched(true);kick()};
  const onDown=(e:PointerEvent)=>{pointer.down=true;canvas.setPointerCapture(e.pointerId);onMove(e)};
  const onUp=()=>{pointer.down=false};
  const onLeave=()=>{pointer.active=false;pointer.down=false};
  canvas.addEventListener('pointermove',onMove);canvas.addEventListener('pointerdown',onDown);
  canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointerleave',onLeave);canvas.addEventListener('pointercancel',onLeave);
  // Seed a little color so the first frame isn't empty.
  for(let k=0;k<6;k++)splat(10+k*16,H/2+Math.sin(k)*14,1.6,Math.cos(k)*.8,hsl(k*55),.6,5);
  step();draw();
  const io=new IntersectionObserver(([en])=>{visible=en.isIntersecting&&document.visibilityState==='visible';if(visible)kick();else{cancelAnimationFrame(raf);raf=0}},{threshold:.15});
  io.observe(canvas);
  const onVis=()=>{if(document.visibilityState!=='visible'){visible=false;cancelAnimationFrame(raf);raf=0}};
  document.addEventListener('visibilitychange',onVis);
  return()=>{io.disconnect();cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',onVis);
   canvas.removeEventListener('pointermove',onMove);canvas.removeEventListener('pointerdown',onDown);canvas.removeEventListener('pointerup',onUp);canvas.removeEventListener('pointerleave',onLeave);canvas.removeEventListener('pointercancel',onLeave)};
 },[]);
 return <div className="sfLive">
  <canvas ref={canvasRef} width={W} height={H} aria-label="Live Stable Fluids simulation. Drag across it to stir the dye." role="img"/>
  {playing?<span className={`sfHint ${touched?'isGone':''}`} aria-hidden="true">live · drag to stir</span>
  :<button type="button" className="sgOverlay sfPlay" onClick={e=>{e.stopPropagation();setPlaying(true)}}><b>▶ Play</b><small>then drag across it to stir</small></button>}
 </div>
}
