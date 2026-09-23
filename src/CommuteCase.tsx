import React, {useState, useEffect, useRef} from 'react';
import './commute-case.css';
import CommuteBARTStory from './CommuteBARTStory';
import RollingVehicle from './RollingVehicle';
import LifecycleRoad from './LifecycleRoad';
import { CasePull } from './CaseDecision';
import { CommutePhoneDemo, useMorning } from './CommuteSurfaces';
import CommuteModelLab, {ROUTINE, CANDIDATES, clock as labClock} from './CommuteModelLab';
import {CommuteArtDefs} from './CommuteArt';


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

/* The route model can find a safe departure, but only personal evidence can
   connect that departure to the start of the morning. Show the one interval
   Commute adds, then make the user-facing payoff explicit. */
function ModelLearningSummary(){
 const leave=CANDIDATES[1].leave;
 const alarm=leave-ROUTINE;
 return <section className="cmLoop" aria-labelledby="cm-loop-title">
  <header>
   <h3 id="cm-loop-title">A leave-by time only helps if I know when to wake up.</h3>
   <p>Transit feeds can time the trip. Commute learns the one part they cannot see: the time between my alarm and my front door.</p>
  </header>
  <ol className="cmRoutineMeasure">
   <li className="is-watch">
    <div className="cmWatch" role="img" aria-label={`Illustrative watch alarm dismissed at ${labClock(alarm)}`}>
     <i className="cmWatchBand" aria-hidden="true"/>
     <div className="cmWatchCase">
      <i className="cmWatchCrown" aria-hidden="true"/>
      <div className="cmWatchScreen">
       <span className="cmWatchAlarmIcon" aria-hidden="true"><i/></span>
       <small>ALARM</small>
       <b>{labClock(alarm)}</b>
       <em>Dismissed</em>
      </div>
     </div>
    </div>
    <div className="cmRoutineCopy"><strong>Alarm dismissed</strong><small>AlarmKit timestamps the dismissal.</small></div>
   </li>
   <li className="is-gap">
    <div className="cmRoutineInterval" role="img" aria-label={`${ROUTINE} minutes from alarm dismissed to leaving home`}>
     <i aria-hidden="true"/>
     <b>{ROUTINE} min</b>
     <small>alarm to front door</small>
    </div>
    <div className="cmRoutineCopy"><strong>My pre-door routine</strong><small>The gap between the two timestamps, measured rather than assumed.</small></div>
   </li>
   <li className="is-door">
    <div className="cmDepartureMoment" role="img" aria-label={`Left home at ${labClock(leave)}`}>
     <span><b>{labClock(leave)}</b><small>LEFT HOME</small></span>
     <i className="cmDoor" aria-hidden="true"><u/></i>
    </div>
    <div className="cmRoutineCopy"><strong>Live data takes over</strong><small>A Core Location geofence at home marks the door. Live conditions pick bus or BART.</small></div>
   </li>
  </ol>
  <aside className="cmLoopOutcome" aria-label={`${labClock(leave)} leave-by time minus a ${ROUTINE} minute routine becomes a ${labClock(alarm)} alarm`}>
   <div className="cmLoopEquation" aria-hidden="true">
    <span><b>{labClock(leave)}</b><small>safe leave-by</small></span>
    <i>−</i>
    <span><b>{ROUTINE} min</b><small>my routine</small></span>
    <i>=</i>
    <span className="is-answer"><b>{labClock(alarm)}</b><small>alarm I can use</small></span>
   </div>
   <span className="cmLoopOutcomeCopy">Live transit finds the departure. Commute works backward through my routine to tell me when the morning starts.</span>
  </aside>
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
 const [ref,seen]=useInView<HTMLDivElement>();
 return <div ref={ref} className={`cmReplay cmReplayRule${seen?' isSequenced':''}`}>
  <header><h3>Choose NL first. Keep BART ready.</h3></header>
  <div className="cmReplayTrack">
   <div className="cmReplayRoute cmReplayBus"><NLBusGraphic failed={false}/><div><b>NL bus</b><span>Faster, taken while the live arrival holds</span></div></div>
   <div className="cmReplayHandoff" aria-hidden="true"><span>if the bus slips 5 min</span><i>→</i></div>
   <div className="cmReplayRoute cmReplayBart"><BARTMiniGraphic live={false}/><div><b>BART</b><span>Qualified fallback · modeled arrival 8:53</span></div></div>
  </div>
 </div>;
}

/* Validate: one weekday morning, read left to right in the order it happened,
   then the same morning repeated 40 times on the same axis. The step glyphs
   (ring, filled dot, plum thread) are the chart's legend, so the method and
   the evidence read as one figure. The order is the argument: the prediction
   is locked before the outcome exists and only learns from it tomorrow. */
const checkSteps=[
 {when:'Before leaving',name:'Lock',line:'The prediction is locked before I leave.'},
 {when:'At arrival',name:'Log',line:'A geofence at the office logs the arrival, with a tap on the widget as backup when it misfires.'},
 {when:'Next morning',name:'Learn',line:'The result updates the prediction only the next morning.'}
];
function LearningRun(){
 const [ref,seen]=useInView<HTMLDivElement>();
 const weeks=Array.from({length:8},(_,i)=>i+1);
 return <section className="cmLearning cmStage" id="cm-learn">
  <header><h2>I tested the loop without letting it grade itself on known outcomes.</h2><p>Every weekday ran the same three steps. That made calibration and sleep tradeoffs inspectable without pretending a personal prototype had proven universal reliability.</p></header>
  <div ref={ref} className={`cmCheckRun${seen?' isRunning':''}`}>
   <ol className="cmCheckSteps" aria-label="One weekday morning">
    {checkSteps.map((s,i)=><li key={s.name} style={{'--step':i} as React.CSSProperties}>
     <i aria-hidden="true"/>
     <span>{s.when}</span>
     <h3>{s.name}</h3>
     <p>{s.line}</p>
    </li>)}
   </ol>
   <div className="cmWeekRun" role="img" aria-label="Eight-week run: 40 weekday mornings, each locked, logged and learned from">
    <div className="cmWeekHead"><b>40 weekday mornings</b><span>Each dot is one morning through all three steps</span></div>
    <div className="cmWeekTrack" aria-hidden="true">{weeks.map(week=><div key={week}>
     <div>{Array.from({length:5},(_,day)=><i key={day} style={{'--morning':(week-1)*5+day} as React.CSSProperties}/>)}</div>
     <span>Week {week}</span>
    </div>)}</div>
   </div>
  </div>
 </section>;
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

/* The four pieces of the product, named as pieces. Each description carries its own
   reason for existing rather than labelling one. They close the case: by the time the
   reader reaches them, the problem, the model and the validation are already behind. */
const parts=[
 {n:'01',t:'Learns my routine',
  d:'Forty-eight minutes from alarm to front door, measured from my own mornings rather than assumed.'},
 {n:'02',t:'Runs a Monte Carlo loop over every departure',
  d:'A thousand simulated mornings for each departure I could still make.'},
 {n:'03',t:'Re-checks and switches routes',
  d:'Live transit and traffic keep running after the alarm goes off. Only a change that moves the plan is worth a notification.'},
 {n:'04',t:'Lives on the Lock Screen',
  d:'A Live Activity, a widget holding the whole plan, and a notification only when the plan changes. The measure of this part is how often I never open the app.'}
];
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
  <CommuteArtDefs/>
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
    <p className="cmDemoHint cmDemoLead">The real morning, playable. It opens on the Lock Screen because that is where the app lives: the full app is one tap away, and a normal morning never needs it.</p>
   </div>
  </section>

  <section className="cmAlgorithm cmStage" id="cm-algorithm">
   <ReliabilityEngine/>
  </section>

  <section className="cmDecision cmStage" id="cm-decide">
   <header className="cmSectionIntro">
    <h2>Commute re-checks the plan before I leave, and never rides without a backup.</h2>
    <p>The bus is faster, so it goes first. BART stays available as a fallback that cleared the same 90% simulation rule. If the live feed says the bus has slipped, the app switches while the modeled arrival still holds at 8:53.</p>
   </header>
   <DisruptionReplay/>
  </section>

  <CasePull>The alarm is already set, so switching costs no sleep. <em>This check changes the route and the leave countdown, nothing else.</em></CasePull>

  <LearningRun/>

  <section className="cmClose cmStage cmRhSticky" id="cm-ship">
   <div className="cmCloseCopy">
    <div className="cmShipped">
     <h2>What shipped, what I measured, and what comes next.</h2>
     <ol className="cmPartsGrid">
      {parts.map(p=><li key={p.n}>
       <i>{p.n}</i>
       <b>{p.t}</b>
       <span>{p.d}</span>
      </li>)}
     </ol>
    </div>

    <ol className="cmScopeStops" aria-label="Scope">
     <li className="is-next"><i/><div><b>Evidence boundary</b><span>One commuter · two East Bay routes · 8 weeks</span></div></li>
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
     <header><strong>The scorecard for the 8-week test</strong></header>
     <dl>{measures.map(m=><div key={m.label}><dt>{m.label}</dt><dd>{m.desc}</dd></div>)}</dl>
     <footer><span>One alarm</span><i aria-hidden="true">→</i><span>One live route check</span></footer>
    </div>
   </div>
  </section>

 </div>;
}
