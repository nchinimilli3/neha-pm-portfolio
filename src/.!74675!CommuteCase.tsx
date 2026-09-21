import React, {useState, useEffect, useRef} from 'react';
import './commute-case.css';
import CommuteBARTStory from './CommuteBARTStory';
import RollingVehicle from './RollingVehicle';
import LifecycleRoad from './LifecycleRoad';
import { DecisionMoment, Tradeoff } from './CaseDecision';
import { CommutePhoneDemo, CommuteSurfaces, useMorning } from './CommuteSurfaces';


/* A forecast can be accurate and still produce bad mornings, so the scoreboard tracks the
   decisions the app made, not only the numbers it predicted. */
const measures=[
 {label:'Arrival error',desc:'Predicted vs. actual walk-in time'},
 {label:'On-time rate',desc:'How often I actually made 9:00'},
 {label:'Calibration',desc:'Whether “90% likely” happens about 90% of the time'},
 {label:'Unnecessary early minutes',desc:'Sleep given up that the morning turned out not to need'},
 {label:'Missed sleep',desc:'Mornings I could safely have woken later'},
 {label:'Helpful switches',desc:'Route changes that actually protected the arrival'},
 {label:'Interruptions',desc:'Normal mornings that needed me. Target: 0'}
];

/* Seven things that separate risk-aware planning from a confident guess. */
const robustness=[
 {n:'01',t:'Predict a range',d:'Not a point. “0–4 min normal, 8–12 when struggling.”'},
 {n:'02',t:'Learn your routine',d:'Personal history narrows the widest uncertainty. Months of route history informs delays.'},
 {n:'03',t:'Model each leg separately',d:"Routine, walk, wait, ride, final walk. One delay doesn't distort the rest."},
 {n:'04',t:'Correlate conditions',d:'Rain hits walk + traffic + bus together, not independently.'},
 {n:'05',t:'Use lower confidence bound',d:'Approve only if worst-case morning still arrives on time. Optimism kills alarm clocks.'},
 {n:'06',t:'Replan at checkpoints',d:'Before alarm, after wake, before leave, when live feed changes.'},
 {n:'07',t:'Measure decisions, not predictions',d:'Track: calibration, early minutes, missed sleep, route switches that mattered.'}
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
  {name:'BART',from:48,to:53,tone:'ok',range:'arrives 8:48–8:53',note:'Narrow observed range'},
  {name:'NL bus',from:42,to:64,tone:'risk',range:'arrives 8:42–9:04',note:'Wider observed range'}
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

/* Where the uncertainty actually lives. The simulation work above is aimed at
   transit, but transit is the narrow term — the phone can see a train and
   cannot see whether I went back for my keys. Saying so is what justifies
   learning a personal routine instead of buying a better feed. */
const legs=[
 {k:'routine',name:'Morning routine',typ:'48 min',lo:34,hi:62,w:28,why:'Showers, keys, a second coffee. No feed predicts this — only my own history does.',tone:'wide'},
 {k:'walk',name:'Walk to the station',typ:'19 min',lo:16,hi:23,w:7,why:'Pace and weather. Tight, and HealthKit already knows my pace.',tone:'ok'},
 {k:'wait',name:'Platform wait',typ:'0–6 min',lo:0,hi:6,w:6,why:'Bounded by headway. Trains every 5–6 minutes cap the damage.',tone:'ok'},
 {k:'ride',name:'The ride',typ:'11 min',lo:11,hi:23,w:12,why:'0–4 minutes of slack on an ordinary day, a tail of 8–12 when the line struggles.',tone:'mid'},
 {k:'final',name:'Final walk',typ:'7 min',lo:6,hi:9,w:3,why:'Effectively fixed.',tone:'ok'}
];
function VarianceLegs(){
 const [ref,seen]=useInView<HTMLDivElement>();
 const max=Math.max(...legs.map(l=>l.w));
 const transit=legs.filter(l=>l.k!=='routine').reduce((a,l)=>a+l.w,0);
 return <section ref={ref} className={`cmVariance${seen?' isIn':''}`} aria-labelledby="cm-var-title">
  <header>
   <h3 id="cm-var-title">Routine spreads 28 min. Transit spreads 18 min total.</h3>
  </header>
  <ol>
   {legs.map((l,i)=><li key={l.k} className={`is-${l.tone}`} style={{'--i':i,'--w':`${l.w/max*100}%`} as React.CSSProperties}>
    <div className="cmVarHead"><b>{l.name}</b><em>{l.typ}</em></div>
    <div className="cmVarBar" role="img" aria-label={`${l.name} spans ${l.lo} to ${l.hi} minutes, a spread of ${l.w} minutes`}><i/><span>{l.w} min spread</span></div>
    <p>{l.why}</p>
   </li>)}
  </ol>
  <div className="cmVarPunch">
   <p><b>Personal history is the product.</b> Personal data narrows the routine. Simulations prevent narrow assumptions. Most apps do it backwards.</p>
  </div>
 </section>;
}

/* How the model learns from each morning and adjusts tomorrow's prediction. The
   key tension: outliers need less weight (one shower doesn't redefine the routine),
   but consistent shifts need full weight (moving slower means the model must expand). */
function UpdateMechanism(){
 return <section aria-labelledby="cm-update-title">
  <header>
   <h3 id="cm-update-title">Observe → adjust → predict.</h3>
   <p>Predicted 48 min routine, took 48? Stay confident. Took 56? Widen range tomorrow, push alarm earlier. Took 72 (outlier)? Count it at 30% weight. Missed the deadline? Full replan—the model is wrong.</p>
  </header>
 </section>;
}

/* What the public feeds actually publish, and the one thing none of them do.
   Worth stating plainly because the obvious assumption — that an agency this
   open must publish how late its trains usually are — is wrong, and the gap is
   what forces the architecture. */
const feeds=[
 {k:'schedule',name:'The timetable',src:'GTFS',open:'Open.',
  gives:'Candidate departures.',
  cannot:'Whether they actually ran.'},
 {k:'live',name:'The live feed',src:'GTFS-Realtime',open:'Open (with rate limits).',
  gives:'What is happening now.',
  cannot:'What usually happens.'},
 {k:'kpi',name:'Published performance',src:'Agency quarterly reports',open:'Public.',
  gives:'System-level health.',
  cannot:'Route-level or delay-level patterns.'}
];
function DataReality(){
 const [ref,seen]=useInView<HTMLDivElement>();
 return <section ref={ref} className={`cmFeeds${seen?' isIn':''}`} aria-labelledby="cm-feeds-title">
  <header>
   <h3 id="cm-feeds-title">No agency publishes how often trains are actually late.</h3>
   <p>BART publishes schedules and live positions. Nothing joins them—scheduled vs. actual per departure. So route history doesn't exist; it has to be logged continuously.</p>
  </header>
  <ol>
   {feeds.map((f,i)=><li key={f.k} style={{'--i':i} as React.CSSProperties}>
    <div className="cmFeedHead"><b>{f.name}</b><em>{f.src}</em><small>{f.open}</small></div>
    <p className="cmFeedGives"><span>What it gives me</span>{f.gives}</p>
    <p className="cmFeedCannot"><span>What it cannot</span>{f.cannot}</p>
   </li>)}
  </ol>
  <div className="cmFeedGap">
   <b>No history exists.</b> Must be logged continuously by checking live against scheduled. Cold start requires months of data before it's useful.
  </div>
  <div className="cmFeedRate">
   <b>60 requests/hour rate limit means: replan at checkpoints, not on timer.</b>
  </div>
 </section>;
}

/* The algorithm is deliberately shown as a decision system rather than a
   black-box score: create reachable plans, simulate the uncertainty in each
   leg, enforce the reliability constraint, then keep monitoring the winner. */
function ReliabilityEngine(){
 const [ref,seen]=useInView<HTMLDivElement>();
 const steps=[
  {n:'01',title:'List what I can catch',body:'Every reachable bus and train departure.'},
  {n:'02',title:'Run 1,000 mornings',body:'Vary routine, walking, waiting, and riding.'},
  {n:'03',title:'Remove fragile plans',body:'Keep only departures whose lower confidence bound survives the morning I plan against.'},
  {n:'04',title:'Choose more sleep',body:'Take the latest wake-up time among the plans that remain.'},
  {n:'05',title:'Observe the actual morning',body:'Log routine, walk, wait, ride, and arrival. Score each against the prediction.'},
  {n:'06',title:'Update distributions',body:'If routine was 52 min (not 48), widen tomorrow\'s range slightly. If consistent, sharpen it. Outliers count less.'}
 ];
 const terms=['routine','walk','wait','ride','final walk'];
 return <div ref={ref} className={`cmEngine${seen?' isRunning':''}`} aria-label="Commute reliability algorithm">
  <header><span>Reliability engine</span><h2>1,000 possible mornings.<br/><em>One plan.</em></h2><p>Simulate each reachable departure. Remove plans whose lower bound fails. Pick the latest wake time that survives. Observe the real morning. Update. Repeat.</p></header>
  <div className="cmBudget">
   <div className="cmBudgetAsk"><span>What it never asks me</span><strong>“Do you want 95% or 99%?”</strong><p>I am not trading away mornings. On time or early, never late — that is the whole requirement, and nobody sits at 7 a.m. pricing their own tardiness. So the plan is always built against the worst morning I can still recover from. The only thing left to choose is what that protection costs in the one unit I actually feel at 7 a.m.: minutes of sleep.</p></div>
   <ol className="cmBudgetScale">
    <li><b>An ordinary morning</b><span>Wake 7:30 · what a fastest-route app would tell me</span></li>
    <li><b>The worst morning this line had this month</b><span>Wake 7:18 · 12 minutes of sleep</span></li>
    <li className="isPicked"><b>The line fails completely and I take the bus</b><span>Wake 7:04 · 26 minutes of sleep</span><i aria-hidden="true">what I run</i></li>
   </ol>
   <p className="cmBudgetNote"><b>Early is free. Late is not.</b>Twenty-six minutes of sleep is a price I will pay every morning, because arriving early costs me nothing I care about and arriving late costs me the thing I was going to. That asymmetry is the entire product; a trip planner that optimises the average is solving a different problem.</p>
   <p className="cmBudgetNote"><b>And when even that is not enough, it says so immediately.</b>A line failure at 8:40 cannot be fixed by waking earlier. At that point the only honest move is to surface the fastest remaining option and tell me I will not make 9:00 while I can still warn someone — not to quietly relax the threshold until the maths agrees with itself.</p>
   <p className="cmBudgetNote"><b>Per event, not per person.</b>A 1:1 that can start five minutes late is not a board review, and my calendar already knows which is which. Today it runs one stance for every morning; reading the stakes off the event itself is the next thing I would build, so the sleep I spend matches what the meeting is worth.</p>
  </div>
  <div className="cmMathStage" role="img" aria-label="Animated equation showing uncertain parts of a morning flowing through one thousand simulations toward a 9 AM arrival deadline">
   <div className="cmEngineEquation" aria-label="Arrival time equals routine plus walking plus waiting plus riding plus final walk">
    <strong>Arrival</strong><i>=</i>{terms.map((term,i)=><React.Fragment key={term}><span style={{'--term':i} as React.CSSProperties}>{term}<u/></span>{i<terms.length-1&&<i>+</i>}</React.Fragment>)}
   </div>
   <div className="cmSimFlow" aria-hidden="true">
    <div className="cmSimSource"><b>1 candidate</b><span>sampled 1,000×</span></div>
    <div className="cmSimField">{Array.from({length:34},(_,i)=><i key={i} style={{'--dot':i,'--x':`${16+(i*19)%74}%`,'--y':`${8+(i*31)%76}%`} as React.CSSProperties}/>)}</div>
    <div className="cmDeadline"><span>9:00</span><b>deadline</b></div>
   </div>
   <p className="cmSimCaption">Each dot is a possible arrival. The same departure lands differently because real mornings vary — the spread is the answer, not the average.</p>
  </div>
  <VarianceLegs/>
  <UpdateMechanism/>
  <DataReality/>
  <ol>{steps.map(step=><li key={step.n}><i>{step.n}</i><div><b>{step.title}</b><p>{step.body}</p></div></li>)}</ol>
  <div className="cmEngineRule"><span>Choose</span><strong>the latest wake-up time</strong><i>only when</i><strong>the worst morning I plan against still arrives by 9:00</strong></div>
