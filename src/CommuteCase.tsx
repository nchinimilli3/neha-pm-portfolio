import React, {useState, useEffect, useRef} from 'react';
import './commute-case.css';
import CommuteBARTStory from './CommuteBARTStory';
import RollingVehicle from './RollingVehicle';
import LifecycleRoad from './LifecycleRoad';
import { DecisionMoment, Tradeoff } from './CaseDecision';
import { CommutePhoneDemo, useMorning } from './CommuteSurfaces';
import CommuteModelLab from './CommuteModelLab';


/* A forecast can be accurate and still produce bad mornings, so the scoreboard tracks the
   decisions the app made, not only the numbers it predicted. */
const measures=[
 {label:'Arrival error',desc:'Predicted vs. actual walk-in time'},
 {label:'On-time rate',desc:'How often I actually made 9:00'},
 {label:'Calibration',desc:'Whether "90% likely" happens about 90% of the time'},
 {label:'Unnecessary early minutes',desc:'Sleep given up that the morning turned out not to need'},
 {label:'Missed sleep',desc:'Mornings I could safely have woken later'},
 {label:'Helpful switches',desc:'Route changes that actually protected the arrival'},
 {label:'Interruptions',desc:'Normal mornings that needed me. Target: 0'}
];

/* Seven things that separate risk-aware planning from a confident guess. */
const robustness=[
 {n:'01',t:'Range, not point',d:'0 to 4 min normal. 8 to 12 when struggling.'},
 {n:'02',t:'Learn your routine',d:'Personal history > transit feed.'},
 {n:'03',t:'Each leg separate',d:'Routine + walk + wait + ride + final walk. One delay doesn\'t break the rest.'},
 {n:'04',t:'Correlate conditions',d:'Rain hits everything together.'},
 {n:'05',t:'Conservative bound',d:'Worst-case must still hit 9:00.'},
 {n:'06',t:'Replan at checkpoints',d:'Before alarm, after wake, before leave, when live feed updates.'},
 {n:'07',t:'Measure what matters',d:'On-time rate. Unnecessary early time. Was this route switch real.'}
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
 {name:'BART',from:48,to:53,tone:'ok',range:'arrives 8:48 to 8:53',note:'Narrow observed range'},
  {name:'NL bus',from:42,to:64,tone:'risk',range:'arrives 8:42 to 9:04',note:'Wider observed range'}
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
 {k:'routine',name:'Morning routine',typ:'48 min',lo:34,hi:62,w:28,tone:'wide',src:'AlarmKit dismissal → departure geofence'},
 {k:'walk',name:'Walk to the station',typ:'19 min',lo:16,hi:23,w:7,tone:'ok',src:'HealthKit pace · Google Routes'},
 {k:'wait',name:'Platform wait',typ:'0 to 6 min',lo:0,hi:6,w:6,tone:'ok',src:'511 GTFS-Realtime'},
 {k:'ride',name:'The ride',typ:'11 min',lo:11,hi:23,w:12,tone:'mid',src:'511 live BART'},
 {k:'final',name:'Final walk',typ:'7 min',lo:6,hi:9,w:3,tone:'ok',src:'HealthKit pace · Google Routes'}
];
function VarianceLegs(){
 const [ref,seen]=useInView<HTMLDivElement>();
 const max=Math.max(...legs.map(l=>l.w));
 return <section ref={ref} className={`cmVariance${seen?' isIn':''}`} aria-labelledby="cm-var-title">
  <header>
   <h3 id="cm-var-title">This finding changed what the product learned.</h3>
   <p>My getting-ready time varied by 28 minutes, more than any transit step. So Commute learns my routine from past mornings instead of treating it as a fixed 48-minute block.</p>
  </header>
  <ol>
   {legs.map((l,i)=><li key={l.k} className={`is-${l.tone}`} style={{'--i':i,'--w':`${l.w/max*100}%`} as React.CSSProperties}>
    <div className="cmVarHead"><b>{l.name}</b><em>{l.typ}</em></div>
    <div className="cmVarBar" role="img" aria-label={`${l.name} spans ${l.lo} to ${l.hi} minutes, a spread of ${l.w} minutes`}><i/><span>±{Number.isInteger(l.w/2)?l.w/2:(l.w/2).toFixed(1)} min</span></div>
   </li>)}
  </ol>
  <p className="cmVarianceDecision"><b>Product change:</b> replace the fixed routine estimate with a personal range that updates after each completed morning.</p>
 </section>;
}

function UpdateMechanism(){
 const [ref,seen]=useInView<HTMLElement>();
 const updates=[
  {day:'1',pred:'48 min',actual:'52 min',alarm:'7:18'},
  {day:'2',pred:'49 to 51',actual:'51 min',alarm:'7:17'},
  {day:'3',pred:'50 to 52',actual:'50 min',alarm:'7:16'},
  {day:'4',pred:'49 to 52',actual:'47 min',alarm:'7:16'},
  {day:'5',pred:'48 to 51',actual:'49 min',alarm:'7:17'},
  {day:'6',pred:'48 to 51',actual:'48 min',alarm:'7:17'},
  {day:'7',pred:'47 to 50',actual:'46 min',alarm:'7:18'},
  {day:'8',pred:'47 to 50',actual:'48 min',alarm:'7:18'}
 ];
 return <section ref={ref} className={`cmUpdateMechanism${seen?' isIn':''}`} aria-labelledby="cm-update-title">
  <header><h3 id="cm-update-title">Each completed morning improves the next alarm.</h3><p>AlarmKit records when I dismiss the alarm; a departure geofence records when I leave home. That elapsed time becomes the actual routine, which can move tomorrow’s alarm earlier or later. I can correct a bad reading.</p></header>
  <table className="cmUpdateTable">
   <thead><tr><th>Morning</th><th>Routine estimate</th><th>Actual</th><th>Next alarm</th></tr></thead>
   <tbody>{updates.map((u,i)=><tr key={i} style={{'--day':i} as React.CSSProperties}><td>{u.day}</td><td>{u.pred}</td><td>{u.actual}</td><td>{u.alarm}</td></tr>)}</tbody>
  </table>
 </section>;
}

/* The routine, drawn the way the phone actually experiences it: two timestamps
   it can read and a stretch between them it cannot see into. That gap is the
   argument for measuring the block instead of modelling its parts — and it is
   why the biggest number in the case is the one no transit feed could supply. */
function RoutineBlock(){
 const [ref,seen]=useInView<HTMLDivElement>();
 const inside=[
  {x:216,l:'out of bed',d:'M-16 9V-3M-16 4h32v5M-16 1h12M-13 1v-5h9v5'},
  {x:312,l:'shower',    d:'M0 -15v8M-9 -7h18a9 9 0 0 0-18 0M-5 1v5M0 2v6M5 1v5'},
  {x:408,l:'coffee',    d:'M-8 -4h13v8a6.5 6.5 0 0 1-13 0zM5 -2h3a4 4 0 0 1 0 8H5M-3 -9c0-3 3-3 3-6M3 -9c0-3 3-3 3-6'},
  {x:504,l:'keys, door',d:'M-3 0h14M8 0v5M12 0v4'}
 ];
 return <div ref={ref} className={`cmRoutine${seen?' isIn':''}`}>
  <svg viewBox="0 0 720 160" role="img"
   aria-label="AlarmKit records the alarm dismissed at 7:18 and a departure geofence records the exit at 8:06. Everything in between — getting out of bed, showering, coffee, keys and the door — is invisible to the phone. The gap between the two timestamps ran 34 to 62 minutes across the test, typically 48.">

   <path className="cmRtRail" d="M84 52h84M552 52h84"/>
   <rect className="cmRtBand" x="168" y="12" width="384" height="80" rx="14"/>

   {inside.map(g=><g key={g.l} className="cmRtIn" transform={`translate(${g.x} 52)`}>
    <path d={g.d}/>{g.l==='keys, door'&&<circle cx="-8" cy="0" r="5"/>}
   </g>)}
   <text className="cmRtCap" x="360" y="84">no sensor reaches in here</text>

   <g className="cmRtEnd" transform="translate(84 52)">
    <circle r="15"/><path d="M0 -8v8l6 4"/><path d="M-11 -11-15 -15M11 -11 15 -15"/>
   </g>
   <text className="cmRtTime" x="84" y="86">7:18</text>
   <text className="cmRtSrc" x="84" y="100">alarm dismissed · AlarmKit</text>

   <g className="cmRtEnd" transform="translate(636 52)">
    <path d="M-10 15V-13h20v28"/><circle cx="5" cy="2" r="2"/>
    <path className="cmRtFence" d="M-19 12a22 22 0 0 1 0-24M19 12a22 22 0 0 0 0-24"/>
   </g>
   <text className="cmRtTime" x="636" y="86">8:06</text>
   <text className="cmRtSrc" x="636" y="100">left home · departure geofence</text>

   <path className="cmRtBrace" d="M84 116v8h552v-8"/>
   <text className="cmRtSpan" x="360" y="146">34 to 62 min measured · 48 typical · the gap itself is the estimate</text>
  </svg>
  <p className="cmSpreadLoop"><b>Dismiss alarm</b><i aria-hidden="true">&rarr;</i><b>leave home</b><i aria-hidden="true">&rarr;</i><b>tomorrow&rsquo;s range narrows</b></p>
 </div>;
}

function ModelLearningSummary(){
 const [ref,seen]=useInView<HTMLElement>();
 const max=Math.max(...legs.map(l=>l.w));
 // Grouped by what the product can actually do about each one: a feed already
 // covers the transit legs, so the only way to shrink the big one is to measure
 // it. Every row shows the same thing — the observed range and how wide it is —
 // on one shared scale, so the comparison is the visual.
 const feed=legs.filter(l=>l.k!=='routine');
 const mine=legs.filter(l=>l.k==='routine');
 const row=(l:typeof legs[number],i:number,focus=false)=>
  <li key={l.k} className={focus?'is-focus':''} style={{'--i':i,'--w':`${l.w/max*100}%`} as React.CSSProperties}>
   <span><b>{l.name}</b><cite>{l.lo}–{l.hi} min · {l.src}</cite></span>
   <i><u/></i>
   <strong>{l.w}<small>min</small></strong>
  </li>;
 return <section ref={ref} className={`cmSpread${seen?' isIn':''}`} aria-labelledby="cm-model-learning-title">
  <header>
   <h3 id="cm-model-learning-title">The biggest unknown was me, not the trains.</h3>
   <p>Every leg of the trip swings by a few minutes. My getting-ready time swings by 28. A better transit feed could not have found that, so the product had to measure it.</p>
  </header>
  <div className="cmSpreadGroups">
   <div className="cmSpreadGroup">
    <p className="cmSpreadCap">A live feed already knows these<em>swing</em></p>
    <ol>{feed.map((l,i)=>row(l,i))}</ol>
    <p className="cmSpreadNote">Paying for better transit data moves these by a minute or two.</p>
   </div>
   <div className="cmSpreadGroup is-mine">
    <p className="cmSpreadCap">Only my own mornings know this<em>swing</em></p>
    <ol>{mine.map((l,i)=>row(l,i,true))}</ol>
    <p className="cmSpreadNote">Four times the swing of any transit leg — so Commute measures it instead of assuming 48 minutes. AlarmKit reports the dismissal, a departure geofence reports the exit, and the gap between them becomes tomorrow&rsquo;s range.</p>
   </div>
  </div>
  <RoutineBlock/>
 </section>;
}


/* The algorithm is deliberately shown as a decision system rather than a
   black-box score: create reachable plans, simulate the uncertainty in each
   leg, enforce the reliability constraint, then keep monitoring the winner. */
function ReliabilityEngine(){
 const [ref,seen]=useInView<HTMLDivElement>();
 return <div ref={ref} className={`cmEngine${seen?' isRunning':''}`} aria-label="Commute reliability algorithm">
  <CommuteModelLab/>
  <ModelLearningSummary/>
 </div>;
}

// The real AC Transit NL coach and the real BART car, both driving. The NL bus is the selected
// plan, so it is the one rolling; when the feed drops it stalls and BART takes over the motion.
const BUS_SRC=`${import.meta.env.BASE_URL}project-media/ac-transit-nl-transbay-bus.svg`;
const BART_SRC=`${import.meta.env.BASE_URL}project-media/bart-train.webp`;

function NLBusGraphic({failed}:{failed:boolean}){
 return <div className="cmTransitVehicle cmNLVehicle">
  <RollingVehicle
   src={BUS_SRC} w={1280} h={400} moving={!failed} stalled={failed}
   wheels={[{cx:354,cy:255,r:54},{cx:996,cy:255,r:54}]}
   alt="AC Transit Line NL Transbay bus in the green and white livery, signed NL Transbay"/>
  {failed&&<svg className="cmTransitFailure" viewBox="0 0 320 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <path d="M130 52h60"/><text x="160" y="90">5 min late</text>
  </svg>}
 </div>;
}

function BARTMiniGraphic({live}:{live:boolean}){
 return <div className="cmTransitVehicle cmBARTVehicle">
  <RollingVehicle
   src={BART_SRC} w={2172} h={418} moving={live}
   wheels={[171,465,1724,2009].map(cx=>({cx,cy:375,r:44}))}
   alt="BART Fleet of the Future train car with blue wrapped ends and the BART logo"/>
 </div>;
}

function DisruptionReplay(){
 return <div className="cmReplay cmReplayRule">
  <header><strong>Choose NL first. Keep BART ready.</strong><p>A live check near departure decides whether the faster bus is still safe.</p></header>
  <div className="cmReplayTrack">
   <div className="cmReplayRoute cmReplayBus"><NLBusGraphic failed={false}/><div><b>NL bus</b><span>Take it while the live arrival stays safe</span></div></div>
   <div className="cmReplayHandoff" aria-hidden="true"><span>IF 5 MIN LATE</span><i>→</i></div>
   <div className="cmReplayRoute cmReplayBart"><BARTMiniGraphic live={false}/><div><b>BART</b><span>Switch here and still arrive by 8:53</span></div></div>
  </div>
  <p>The alarm is already set. This check changes only the route and leave countdown.</p>
 </div>;
}

function LearningRun(){
 const [ref,seen]=useInView<HTMLDivElement>();
 const weeks=Array.from({length:10},(_,i)=>i+1);
 return <section className="cmLearning cmStage" id="cm-learn">
  <header><h2>The 10-week test answered one product question: did the alarms improve?</h2><p>Each weekday created a fair comparison between what Commute predicted before I left and what actually happened. The result updated only the next morning, showing whether personalization was helping rather than simply replaying known outcomes.</p></header>
  <div ref={ref} className={`cmWeekRun${seen?' isRunning':''}`} aria-label="Ten-week learning run across 40 to 50 weekday mornings">
   <div className="cmWeekLabels"><span>Week 1</span><b>40 to 50 weekday mornings</b><span>Week 10</span></div>
   <div className="cmWeekTrack">{weeks.map(week=><div key={week}>{Array.from({length:5},(_,day)=><i key={day} style={{'--morning':(week-1)*5+day} as React.CSSProperties}/>)}</div>)}</div>
   <div className="cmWeekLegend"><span><i/>prediction locked</span><span><i/>actual morning observed</span><span><i/>next prediction updated</span></div>
  </div>
  <div className="cmLearningLoop" aria-label="How one morning improves the next">
   <div><small>Monday, before leaving</small><b>Predict 8:53</b><span>Lock the alarm and arrival estimate</span></div><i>→</i>
   <div><small>Monday, after arriving</small><b>Actual 8:57</b><span>The routine took four minutes longer</span></div><i>→</i>
   <div><small>Tuesday</small><b>Wake 4 min earlier</b><span>Use the new routine range in the next prediction</span></div>
  </div>
 </section>;
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
 const [delayed,setDelayed]=useState(false);
 const shift=delayed?6:0;
 const steps=[
  {k:'wake',t:7*60+30-shift,old:7*60+30,title:'Wake up',sub:'48 min morning routine',inputs:[['history','Commute history'],['alarm','AlarmKit']]},
  {k:'leave',t:8*60+18-shift,old:8*60+18,title:'Leave home',sub:'19 min walk to BART',inputs:[['health','HealthKit'],['routes','Google Routes'],['weather','WeatherKit'],['location','Location']]},
  {k:'ride',t:8*60+37-shift,old:8*60+37,title:delayed?'Take the earlier BART':'Board BART',sub:delayed?'8:31 train still arrives on the bad-morning case':'11 min ride · trains every 5 to 6 min',inputs:[['transit','511 live BART + bus'],['traffic','511 traffic']]},
  {k:'arrive',t:9*60,old:9*60,title:'Office',sub:delayed?'Arrives by 9:00 across the outcomes I accept':'7 min walk · arrival is fixed',inputs:[['calendar','Calendar']]}
 ];
 return <div className={`cmItin${delayed?' isDelayed':''}`}>
  <ol>{steps.map((st,i)=><li key={st.k} className={`is-${st.k}`} style={{'--i':i} as React.CSSProperties}>
   <span className="cmItinTime"><b>{clock(st.t)}</b>{delayed&&st.k!=='arrive'&&<s>{clock(st.old)}</s>}</span>
   <span className="cmItinDot" aria-hidden="true"/>
   <div className="cmItinBody">
    <strong>{st.title}</strong><span>{st.sub}</span>
    <ul>{st.inputs.map(([icon,name])=><li key={name}><Ico k={icon as keyof typeof I}/>{name}</li>)}</ul>
   </div>
  </li>)}</ol>
  {delayed&&<div className="cmLateUpdate cmForecastUpdate" aria-live="polite"><b>7:10 check</b><div><strong>Real-time BART conditions make the 8:37 train too risky.</strong><span>Because this update arrives before the 7:30 alarm, Commute can ask AlarmKit to move it to 7:24 and switch the plan to the 8:31 train. Updates after the alarm rings only change the leave time or route. They cannot change the past alarm.</span></div></div>}
  <button type="button" className="cmItinToggle" aria-pressed={delayed} onClick={()=>setDelayed(v=>!v)}><i aria-hidden="true"/>{delayed?'Reset the morning':'Simulate a 7:10 BART update'}</button>
 </div>;
}

/* The gap the alarm cannot close. Moving a wake-up time is the easy lever;
   the minutes that actually make me late are the ones between the alarm and
   the door, and no forecast reaches them. So the plan has to be checked
   against my real pace while the routine is still running, early enough that
   a small action is still enough. Late detection is the same as no detection. */
const slips=[
 {k:'ok',at:'7:52',behind:0,leave:'8:18',arrive:'8:53',
  head:'On pace. Nothing to say.',
  body:'Twenty-two minutes into a forty-eight minute routine, roughly where I should be. The plan holds, so Commute stays quiet — the Live Activity just keeps counting down to 8:18.',
  act:'No interruption'},
 {k:'warn',at:'7:52',behind:9,leave:'8:27',arrive:'9:04',
  head:'Nine minutes behind, with room to fix it.',
  body:'At this pace I leave at 8:27 and walk in at 9:04. But it is still 7:52, so nine minutes is recoverable: the 8:31 train clears 9:00 if I am out the door by 8:24. One instruction, while there is still runway to follow it.',
  act:'Out the door by 8:24 · take the 8:31'},
 {k:'late',at:'8:14',behind:9,leave:'8:27',arrive:'9:06',
  head:'The same nine minutes, now unfixable.',
  body:'Identical slip, twenty-two minutes later, and nothing is left to spend it from. Walking faster saves two minutes and the next train is the one I am already on track for. The bar has been missed and pretending otherwise just costs me the chance to warn anyone.',
  act:'You will arrive 9:06 · message the 9:00 now'}
];
function RoutineSlip(){
 const [i,setI]=useState(1);
 const s=slips[i];
 return <section className={`cmSlip is-${s.k}`} aria-labelledby="cm-slip-title">
  <header>
   <h3 id="cm-slip-title">A wake-up time is a plan. Getting out of bed is not.</h3>
   <p>Even with the right alarm, I can still leave late. Commute checks my pace once, early enough to offer a useful recovery.</p>
  </header>
  <div className="cmSlipPick" role="group" aria-label="Choose a morning">
   {slips.map((st,n)=><button key={st.k} type="button" aria-pressed={i===n} onClick={()=>setI(n)}>
    <b>{st.behind?`${st.behind} min behind`:'On pace'}</b><span>checked {st.at}</span>
   </button>)}
  </div>
  <div className="cmSlipBody">
   <div className="cmSlipRail" role="img" aria-label={`Checked at ${s.at}. Projected departure ${s.leave}, projected arrival ${s.arrive}.`}>
    {[{l:'Woke',v:'7:30'},{l:'Checked',v:s.at},{l:'Leaves',v:s.leave},{l:'Arrives',v:s.arrive}].map((n,x)=>
     <div key={n.l} className={x===3?'is-end':''} style={{'--n':x} as React.CSSProperties}><i aria-hidden="true"/><small>{n.l}</small><b>{n.v}</b></div>)}
   </div>
   <div className="cmSlipRead">
    <strong>{s.head}</strong>
    <p>{s.body}</p>
    <p className="cmSlipAct"><span>What it says</span><b>{s.act}</b></p>
   </div>
  </div>
  <footer><p><b>The point:</b> nine minutes late at 7:52 can still be fixed. The same delay at 8:14 can only be reported.</p></footer>
 </section>;
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
 {id:'cm-discover',name:'Discover',did:'Why another commute app?'},
 {id:'cm-algorithm',name:'Model',did:'How does it choose?'},
 {id:'cm-decide',name:'Decide',did:'What if traffic delays the bus?'},
 {id:'cm-learn',name:'Validate',did:'Did it learn without cheating?'},
 {id:'cm-ship',name:'Ship',did:'What did I actually build?'}
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
    <h2>When do I wake up?</h2>
    <p>Maps doesn't answer. It plans trips. This plans mornings.</p>
   </div>
   <PlatformBoard/>
   <div className="cmDemoStage">
    <CommutePhoneDemo m={m} app={demo}/>
   </div>
  </section>

  <section className="cmAlgorithm cmStage" id="cm-algorithm">
   <ReliabilityEngine/>
  </section>

  <section className="cmDecision cmStage" id="cm-decide">
   <header className="cmSectionIntro">
    <h2>Commute checks the selected route again before I leave.</h2>
    <p>The direct bus starts as the faster plan. If its live arrival slips past the safe range, BART becomes the backup.</p>
   </header>
   <DisruptionReplay/>
  </section>

  <LearningRun/>

  <section className="cmClose cmStage" id="cm-ship">
   <div className="cmCloseCopy">
    <h2>What shipped, what I measured, and what comes next.</h2>

    <ol className="cmScopeStops" aria-label="Scope">
     <li className="is-shipped"><i/><div><b>Shipped</b><span>Routine learning · route picking · live replanning · lock screen widget</span></div></li>
     <li className="is-next"><i/><div><b>Next</b><span>Cold-start priors · more cities · templates</span></div></li>
     <li className="is-cut"><i/><div><b>Not built</b><span>Navigation · social · booking · dashboards</span></div></li>
    </ol>
   </div>
   <div className="cmScale">
    <header><h3>What the next version still needs.</h3></header>
    <ol>
     <li><b>Cold start:</b> No history first two weeks. Need route-level priors.</li>
     <li><b>Uneven data:</b> Many cities lack realtime feeds. Widen buffer.</li>
     <li><b>One miss:</b> Show why you were late. Don't quietly replan.</li>
    </ol>
   </div>
   <div className="cmTicket">
    <div className="cmTicketStub" aria-hidden="true"><span>Commute</span><i className="cmBarcode"/></div>
    <div className="cmTicketMain">
     <header><strong>What I measured during the 10-week test</strong></header>
     <dl>{measures.map(m=><div key={m.label}><dt>{m.label}</dt><dd>{m.desc}</dd></div>)}</dl>
     <footer><span>Wake 7:18</span><i aria-hidden="true">→</i><span>Arrive 9:00</span></footer>
    </div>
   </div>
  </section>

 </div>;
}
