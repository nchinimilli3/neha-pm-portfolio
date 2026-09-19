import React, {useState, useEffect, useRef} from 'react';
import './commute-case.css';
import CommuteBARTStory from './CommuteBARTStory';
import LifecycleRoad from './LifecycleRoad';
import { DecisionMoment, Tradeoff } from './CaseDecision';
import { CommutePhoneDemo, CommuteSurfaces, useMorning } from './CommuteSurfaces';


const measures=[
 {label:'Arrival error',desc:'Predicted vs. actual walk-in time'},
 {label:'Unused buffer',desc:'Minutes spent waiting instead of sleeping'},
 {label:'Prediction error',desc:'Routine, walk, and ride, per route'},
 {label:'Interruptions',desc:'Normal mornings that needed me. Target: 0'},
 {label:'App opens',desc:'Mornings I had to unlock to know what to do. Target: 0'}
];

/* Reveal-on-scroll used by the diagrams below. Honors reduced motion by
   resolving straight to the finished state instead of never animating. */
function useInView<T extends HTMLElement>(){
 const ref=useRef<T>(null);
 const [seen,setSeen]=useState(false);
 useEffect(()=>{
  const node=ref.current;
  if(!node) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setSeen(true);return}
  const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setSeen(true);io.disconnect()}},{threshold:.25,rootMargin:'0px 0px -60px 0px'});
  io.observe(node);
  return ()=>io.disconnect();
 },[]);
 return [ref,seen] as const;
}

const clock=(m:number)=>{const h=Math.floor(m/60),mm=m%60;return `${((h+11)%12)+1}:${String(mm).padStart(2,'0')}`};

/* Why the faster route is not automatically the better one. Real windows from
   the app: BART lands 8:48-8:53, the NL lands 8:42-9:04. */
function RouteRisk(){
 const [ref,seen]=useInView<HTMLDivElement>();
 // A one-hour dial from 8:00 to 9:00, with 9:00 at twelve o'clock.
 const pt=(m:number,r:number)=>{const a=(m/60*360-90)*Math.PI/180;return [60+r*Math.cos(a),60+r*Math.sin(a)]};
 const arc=(from:number,to:number,r:number)=>{const [x1,y1]=pt(from,r),[x2,y2]=pt(to,r);return `M${x1} ${y1}A${r} ${r} 0 ${to-from>30?1:0} 1 ${x2} ${y2}`};
 const R=38;
 const routes=[
  {name:'BART',from:48,to:53,tone:'ok',range:'arrives 8:48–8:53',note:'Always on time'},
  {name:'NL bus',from:42,to:64,tone:'risk',range:'arrives 8:42–9:04',note:'Late 1 in 3 mornings'}
 ];
 return <div className={`cmClocks${seen?' isIn':''}`} ref={ref}>
  {routes.map(r=><div key={r.name} className={`cmClock is-${r.tone}`} role="img" aria-label={`${r.name} ${r.range}. ${r.note}.`}>
   <svg viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="55" className="cmClockRim"/>
    <circle cx="60" cy="60" r="50" className="cmClockFace"/>
    {Array.from({length:60},(_,i)=>{const long=i%5===0;const [x1,y1]=pt(i,47),[x2,y2]=pt(i,long?42:45);return <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} className={long?'cmTickHour':'cmTickMin'}/>})}
    <circle cx="60" cy="60" r={R} className="cmClockTrack"/>
    <path d={arc(r.from,Math.min(r.to,60),R)} className="cmClockWin" style={{'--len':R*(Math.min(r.to,60)-r.from)/60*2*Math.PI} as React.CSSProperties}/>
    {r.to>60&&<path d={arc(60,r.to,R)} className="cmClockLate" style={{'--len':R*(r.to-60)/60*2*Math.PI} as React.CSSProperties}/>}
    <circle cx="60" cy="10" r="3.2" className="cmClockPin"/>
    <text x="60" y="58" className="cmClockName">{r.name}</text>
    <text x="60" y="72" className="cmClockRange">{r.range.replace('arrives ','')}</text>
   </svg>
   <span className="cmClockNote">{r.note}</span>
  </div>)}
  <p className="cmClockKey"><i/>9:00 deadline</p>
 </div>;
}

function FreshnessDiagram(){
 const [ref,seen]=useInView<HTMLDivElement>();
 // Older location pings shrink and fade: how faint a dot is shows how much that update still counts.
 const pings=[{t:'8 min ago',w:.2,x:40},{t:'5 min ago',w:.46,x:112},{t:'2 min ago',w:.78,x:184}];
 return <div ref={ref} className={`cmTrail${seen?' isIn':''}`} role="img" aria-label="The Muni bus's current location counts 100 percent. Its position 2 minutes ago counts 78 percent, 5 minutes ago 46 percent, and 8 minutes ago 20 percent, drawn as fading dots behind the bus.">
  <svg viewBox="0 0 340 150" aria-hidden="true">
   <path d="M20 104H330" className="cmTrailLine"/>
   <path d={`M40 104H224`} className="cmTrailPath"/>
   {pings.map((p,i)=><g key={p.t} className="cmTrailPing" style={{'--i':i} as React.CSSProperties}>
    <circle cx={p.x} cy="104" r={3+p.w*4} className="cmPingDot" style={{opacity:.25+p.w*.75}}/>
    <text x={p.x} y="82" className="cmPingPct" style={{opacity:.35+p.w*.65}}>{Math.round(p.w*100)}%</text>
    <text x={p.x} y="130" className="cmPingAge">{p.t}</text>
   </g>)}
   <g className="cmBus" transform="translate(282 99)">
    <g className="cmBusBody">
     <path d="M-54 -6V-43a5 5 0 0 1 5-5h96a6 6 0 0 1 5.6 4l2.4 8V-6z" className="cmMuniShell"/>
     <path d="M-54 -41v-2a5 5 0 0 1 5-5h96a6 6 0 0 1 5.6 4l.8 3z" className="cmMuniBand"/>
     <path d="M-54 -14h109v8a3 3 0 0 1-3 3h-103a3 3 0 0 1-3-3z" className="cmMuniBand"/>
     <path d="M-54 -14h6v11h-3a3 3 0 0 1-3-3z" className="cmMuniRear"/>
     {[-50,-37,-24,-11,2,15,28].map((x,i)=><rect key={x} x={x} y="-37" width={i===0?10:11.5} height="13" rx="1" className="cmMuniWin"/>)}
     <path d="M-37 -31h11.5M-11 -31h11.5M15 -31h11.5" className="cmMuniMull"/>
     <path d="M42 -37h9.5a2 2 0 0 1 1.9 1.4l3.6 13.6v5H42z" className="cmMuniWin"/>
     <path d="M47 -37v20" className="cmMuniMull"/>
     <g transform="translate(-9 -22) scale(.5)" className="cmMuniLogo"><path d="M0 12V3.5a3.5 3.5 0 0 1 7 0V12M7 3.5a3.5 3.5 0 0 1 7 0V12M16.5 0v8.5a3.5 3.5 0 0 0 7 0V0M26 12V3.5a3.5 3.5 0 0 1 7 0V12M35.5 0v12" className="cmWormOut"/><path d="M0 10V4a3 3 0 0 1 6 0v2a3 3 0 0 1 6 0v4 M15 0v6a3 3 0 0 0 6 0V0 M24 10V4a3 3 0 0 1 6 0v6 M33 0v10" className="cmWormIn"/></g>
     <rect x="55" y="-9" width="3" height="5" rx="1" className="cmMuniBumper"/>
     <rect x="-56" y="-9" width="3" height="5" rx="1" className="cmMuniBumper"/>
    </g>
    <circle cx="-34" cy="-2" r="7" className="cmBusWheel"/><circle cx="36" cy="-2" r="7" className="cmBusWheel"/>
    <circle cx="-34" cy="-2" r="3" className="cmBusHub"/><circle cx="36" cy="-2" r="3" className="cmBusHub"/>
    <text x="0" y="-60" className="cmPingPct cmPingNow">100%</text>
    <text x="0" y="31" className="cmPingAge">now</text>
   </g>
  </svg>
 </div>;
}

/* The problem as a BART platform sign: four readings scroll in, the question blinks, then the answer. */
const boardRows=[
 {src:'MAPS',msg:'BAY BRIDGE HEAVY',val:'+6 MIN'},
 {src:'BART',msg:'SFO / MILLBRAE',val:'4 MIN'},
 {src:'AC NL',msg:'GRAND AVE',val:'6 LATE'},
 {src:'CLOCK',msg:'NO ALARM SET',val:'7:22'}
];
function PlatformBoard(){
 const [ref,inView]=useLive<HTMLDivElement>();
 const [step,setStep]=useState(6);
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!inView){setStep(6);return}
  setStep(0);
  const id=window.setInterval(()=>setStep(n=>(n+1)%9),1000);
  return ()=>window.clearInterval(id);
 },[inView]);
 return <div ref={ref} className="cmBoard" aria-label="Four app readings at 7:22 each answer part of the question. Commute combines them: wake 7:18, leave 8:06, take BART.">
  <div className="cmBoardFace">
   <div className="cmBoardInputs">
    <p className="cmBoardHead"><span>4 apps · 4 partial answers</span></p>
    {boardRows.map((r,i)=><p key={r.src} className={`cmBoardRow${step>i?' isOn':''}`}><b>{r.src}</b><span>{r.msg}</span><em>{r.val}</em></p>)}
   </div>
   <p className={`cmBoardAsk${step===5?' isFlash':''}${step>=5?' isOn':''}`}><span>?</span>WHEN DO I<br/>GET UP</p>
   <div className={`cmBoardAnswer${step>=6?' isOn':''}`}><span>COMMUTE · ONE ANSWER</span><p><b>WAKE</b><em>7:18</em></p><p><b>LEAVE</b><em>8:06</em></p><p><b>TAKE</b><em>BART</em></p></div>
  </div>
  <div className="cmBoardPosts" aria-hidden="true"><i/><i/></div>
 </div>;
}

function useLive<T extends HTMLElement>(){
 const ref=useRef<T>(null);
 const [inView,setInView]=useState(false);
 useEffect(()=>{const n=ref.current;if(!n)return;const io=new IntersectionObserver(([e])=>setInView(e.isIntersecting),{threshold:.35});io.observe(n);return ()=>io.disconnect()},[]);
 return [ref,inView] as const;
}

/* Plan backward from 9:00 as the app's own itinerary. Each step lists the live inputs that move it,
   and a simulated BART delay shows every time before 9:00 shifting earlier. */
const I={
 calendar:<><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
 transit:<><rect x="5" y="3" width="14" height="14" rx="4"/><path d="M5 10h14M9 21l-2-3M15 21l2-3"/></>,
 traffic:<><rect x="8" y="2" width="8" height="18" rx="4"/><circle cx="12" cy="7" r="1.2"/><circle cx="12" cy="11" r="1.2"/><circle cx="12" cy="15" r="1.2"/></>,
 routes:<><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6"/></>,
 health:<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>,
 location:<><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
 weather:<path d="M7 18a4.5 4.5 0 0 1-.7-8.9A5.5 5.5 0 0 1 17 9.5a4 4 0 0 1 .5 8.5z"/>,
 history:<><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></>,
 alarm:<><circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 1.5M4 5l3-2.5M20 5l-3-2.5"/></>
};
const Ico=({k}:{k:keyof typeof I})=><svg viewBox="0 0 24 24" aria-hidden="true">{I[k]}</svg>;
function MorningItinerary(){
 const [ref,inView]=useLive<HTMLDivElement>();
 const [delayed,setDelayed]=useState(false);
 const [touched,setTouched]=useState(false);
 useEffect(()=>{
  if(touched||!inView||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const id=window.setInterval(()=>setDelayed(d=>!d),3200);
  return ()=>window.clearInterval(id);
 },[inView,touched]);
 const d=delayed?10:0;
 const steps=[
  {k:'wake',t:7*60+18-d,title:'Wake up',sub:'48 min morning routine',inputs:[['history','Commute history'],['alarm','AlarmKit']]},
  {k:'leave',t:8*60+6-d,title:'Leave home',sub:'13 min walk to 19th St',inputs:[['health','HealthKit'],['routes','Google Routes'],['weather','WeatherKit'],['location','Location']]},
  {k:'ride',t:8*60+19-d,title:'Board BART',sub:delayed?'42 min to Embarcadero · 10 min delay':'32 min to Embarcadero',inputs:[['transit','511 live BART + bus'],['traffic','511 traffic']]},
  {k:'arrive',t:9*60,title:'Salesforce Tower',sub:'9 min walk · arrival is fixed',inputs:[['calendar','Calendar']]}
 ];
 return <div ref={ref} className={`cmItin${delayed?' isDelayed':''}`}>
  <ol>{steps.map((st,i)=><li key={st.k} className={`is-${st.k}`} style={{'--i':i} as React.CSSProperties}>
   <span className="cmItinTime"><b>{clock(st.t)}</b>{delayed&&st.k!=='arrive'&&<s>{clock(st.t+d)}</s>}</span>
   <span className="cmItinDot" aria-hidden="true"/>
   <div className="cmItinBody">
    <strong>{st.title}</strong><span>{st.sub}</span>
    <ul>{st.inputs.map(([icon,name])=><li key={name}><Ico k={icon as keyof typeof I}/>{name}</li>)}</ul>
   </div>
  </li>)}</ol>
  <button type="button" className="cmItinToggle" aria-pressed={delayed} onClick={()=>{setTouched(true);setDelayed(v=>!v)}}><i aria-hidden="true"/>{delayed?'10 min BART delay on':'Simulate a 10 min BART delay'}</button>
 </div>;
}

/* Notify only when the plan changes: small shifts are absorbed silently, one real change gets through. */
const pings=[
 {text:'BART +2 min',note:'Plan unchanged',muted:true},
 {text:'Light rain · walk +1 min',note:'Plan unchanged',muted:true},
 {text:'NL bus 11 min late',note:'Leave 6 min earlier · take BART',muted:false}
];
function LockScreen(){
 const [ref,inView]=useLive<HTMLDivElement>();
 const [n,setN]=useState(3);
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!inView){setN(3);return}
  const id=window.setInterval(()=>setN(x=>(x+1)%7),1300);
  return ()=>window.clearInterval(id);
 },[inView]);
 return <div ref={ref} className="cmLock">
  <p className="cmLockTime">7:31</p><p className="cmLockDate">Tuesday</p>
  <div className="cmLockStack">{pings.map((p,i)=><div key={p.text} className={`cmPing${p.muted?' isMuted':' isLive'}${n>i?' isIn':''}`}>
   <span className="cmPingIcon" aria-hidden="true">C</span>
   <div><strong>{p.muted?p.text:p.note}</strong><small>{p.muted?`${p.note} · not sent`:p.text}</small></div>
  </div>)}</div>
 </div>;
}

const commuteStages=[
 {id:'cm-discover',name:'Discover',did:'Four apps, one question'},
 {id:'cm-design',name:'Design',did:'Plan backward from 9:00'},
 {id:'cm-decide',name:'Decide',did:'Rules for 7 a.m.'},
 {id:'cm-surface',name:'Surface',did:'Lock Screen, Island, widget'},
 {id:'cm-ship',name:'Ship',did:'Daily alarm, next, metrics'}
];
export default function CommuteCase({demo}:{demo:React.ReactNode}){
 // One morning, shared by the demo phone and the surfaces section.
 const m=useMorning();
 return <div className="cmEditorial">
  <LifecycleRoad stages={commuteStages} vehicle="train"/>

  <section className="cmShowcase" id="cm-demo">
   <CommuteBARTStory/>
  </section>

  <section className="cmProblem cmStage" id="cm-discover">
   <div className="cmProblemCopy">
    <h2>Four apps. <em>One question.</em></h2>
    <p>Every weekday I checked four apps and did the math in my head. Maps plans the trip, not the morning, and none of them answered the real question.</p>
   </div>
   <PlatformBoard/>
   <div className="cmDemoStage">
    <CommutePhoneDemo m={m} app={demo}/>
   </div>
  </section>

  <section className="cmPlanBack cmStage" id="cm-design">
   <div className="cmPlanCopy">
    <h2>Plan backward <em>from 9:00.</em></h2>
    <p>Arrival is fixed. Eight live inputs each adjust one step of the morning, and a delay moves the alarm earlier instead of making me late.</p>
   </div>
   <MorningItinerary/>
  </section>

  <section className="cmRules cmStage" id="cm-decide">
   <DecisionMoment
    statement={<>Recommend the reliable<br/>route, not the fast one.</>}
    sub="A late bus costs more than a slow train saves."
    because={<p>BART is almost never late. The NL bus is late one morning in three. A trip planner optimises the average; a commute has to survive the bad day.</p>}
    tradeoff={<Tradeoff pairs={[
     ['The earliest possible arrival','An arrival I can plan around'],
     ['Trusting the fastest-looking feed','Fresh delays beat stale “on time”'],
     ['Moving the alarm on every change','Asking first, silent otherwise']
    ]}/>}
    result={<p>One alarm instead of four apps, and it never moves without asking.</p>}
   >
   <p className="cmRulesLabel">The three rules behind it</p>
   <div className="cmRuleGrid">
    <div className="cmRule"><h3>A faster route can be the riskier one.</h3><p>Missing a train that runs every 6 minutes costs little. Missing a bus that runs every 30 costs the morning.</p><RouteRisk/></div>
    <div className="cmRule"><h3>Old data counts for less.</h3><FreshnessDiagram/></div>
    <div className="cmRule"><h3>Only interrupt when the plan changes.</h3><p>If a delay doesn’t move the wake time, leave time, or route, it stays silent.</p><LockScreen/></div>
   </div>
   </DecisionMoment>
  </section>

  <section className="cmSurface cmStage" id="cm-surface">
   <header className="cmSurfaceHead">
    <h2>The best version <em>is the one I never open.</em></h2>
    <p>Everything the model knows fits in one glance, so I shipped it to where my eyes already are at 7 a.m.: a Live Activity on the Lock Screen, a countdown in the Dynamic Island, and a Home Screen widget. The app is still there for editing a routine. The morning itself runs without it.</p>
   </header>
   <CommuteSurfaces m={m}/>
  </section>

  <section className="cmClose cmStage" id="cm-ship">
   <div className="cmCloseCopy">
    <h2>Four apps. <em>One alarm.</em></h2>
    
    <ol className="cmScopeStops" aria-label="Scope">
     <li className="is-shipped"><i/><div><b>Shipped</b><span>Lock Screen Live Activity, Dynamic Island, Home Screen widget, calendar, routine, walking speed, live transit and traffic, native alarms</span></div></li>
     <li className="is-next"><i/><div><b>Next stop</b><span>Recurring commutes, more cities, reliability learning</span></div></li>
     <li className="is-cut"><i/><div><b>Not in service</b><span>Social features, generic trip planning, dashboards</span></div></li>
    </ol>
   </div>
   <div className="cmScale">
    <header>
     <span className="cmScaleKicker">If this were Google Maps</span>
     <h3>What changes at scale</h3>
     <p>For me, one route and a few weeks of history are enough. For millions of commuters, three things break first.</p>
    </header>
    <ol>
     <li><i>01</i><b>Cold start</b><p>A new user has no history, so reliability comes from aggregate data on the same line, stop, and time of day, then personalizes as their own trips accumulate.</p></li>
     <li><i>02</i><b>Uneven data</b><p>Many cities have no realtime feed. Fall back to scheduled times, widen the buffer, and say so.</p></li>
     <li><i>03</i><b>Trust</b><p>An alarm that moves on its own loses trust fast. Keep approve-before-change, and guard missed arrivals against minutes of sleep saved.</p></li>
    </ol>
   </div>
   <div className="cmTicket">
    <div className="cmTicketStub" aria-hidden="true"><span>Commute</span><i className="cmBarcode"/></div>
    <div className="cmTicketMain">
     <header><strong>How I’d know it’s wrong</strong><span>Valid every weekday</span></header>
     <dl>{measures.map(m=><div key={m.label}><dt>{m.label}</dt><dd>{m.desc}</dd></div>)}</dl>
     <footer><span>Wake 7:18</span><i aria-hidden="true">→</i><span>Arrive 9:00</span></footer>
    </div>
   </div>
  </section>

 </div>;
}
