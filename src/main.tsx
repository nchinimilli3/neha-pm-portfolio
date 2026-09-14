import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './estee.css';
import EsteeCompact from './EsteeCompact';
import FCVFCase from './FCVFCase';
import FCVFMustang from './FCVFMustang';
import AboutFilmCamera from './AboutFilmCamera';
import FinSimpleCase from './FinSimpleCase';
import FinSimpleMachE from './FinSimpleMachE';
import AccentureOpsWorkbench from './AccentureOpsWorkbench';
import SchedulerPlannerHero from './SchedulerPlannerHero';
import AccentureRequestRelay from './AccentureRequestRelay';
import AccentureFieldKit from './AccentureFieldKit';
import AccentureSFHero from './AccentureSFHero';
import {BookclubEditorial, BookclubEditorialHero} from './BookclubEditorial';
import {GrazeHero, GrazeRecipe, GrazeLocations, GrazeGrowth, GrazeProjectPreview} from './GrazeExperience';
import './fcvf.css';
import './annotation-fixes.css';
import './annotation-final.css';
import CommuteBARTStory from './CommuteBARTStory';

const assetUrl=src=>{
  if(/^https?:\/\//.test(src))return src;
  const clean=src.replace(/^\/+/, '');
  return import.meta.env.DEV?`/${clean}`:`${import.meta.env.BASE_URL}${clean}`;
};
const BOOKCLUB_LIVE_URL='https://book-club-cog.pages.dev/';


function Reveal({children,className=''}){
  const ref=useRef(null);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const el=ref.current;
    if(!el)return;
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){setVisible(true);observer.disconnect();}
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    observer.observe(el);
    return ()=>observer.disconnect();
  },[]);
  return <div ref={ref} className={`reveal ${visible?'visible':''} ${className}`}>{children}</div>
}

const metrics = {
  kohler: [
    ['Product','definition + UX','product'],
    ['5','person team','scope'],
    ['Azure','technical environment','system'],
    ['1 → any','SKU-to-market goal','system']
  ],
  accenture: [
    ['21','live requests supported','scope'],
    ['~2.2K','learner responses synthesized','analysis'],
    ['10-tab','automation data contract','artifact'],
    ['~20','providers benchmarked','research'],
    ['5','recommendations','decision']
  ],
  fcvf: [
    ['+25%','feedback volume','outcome'],
    ['4','user interviews led','research'],
    ['100+','Git commits','output'],
    ['7','legacy CSS files replaced','output']
  ],
  finsimple: [
    ['50','people coordinated','context'],
    ['5','cross-functional teams','context'],
    ['10%','ahead of schedule','outcome'],
    ['20+','customer-impacting incidents analyzed','operations']
  ],
  estee: [
    ['Top 5','challenge finalist','outcome']
  ],
  marketExpansion: [
    ['4','decision criteria','scope'],
    ['3','locations compared','analysis'],
    ['1','reusable scorecard','artifact'],
    ['3','growth levers','decision']
  ]
};

const ownership = {
  kohler:'Kohler provided the business problem and technical environment. On a five-person team, I am helping define the product, design the workflow and interface, and contribute to the React/Node build, Azure orchestration, source integrations, validation, and human-review flow.',
  accenture:'I supported 21 live requests, documented the rules behind trainer matching and scheduling, tested clean and exception cases, built an early Codex-based request prototype, and combined learner and market research into recommendations.',
  fcvf:'I interviewed four users, evaluated the two interface directions, implemented frontend work, and tested the experience with the team.',
  finsimple:'I owned requirements, AEM component work, API integration, testing, and coordination across the teams needed to ship my feature.',
  scheduler:'I led product definition, research with seven students, interaction design, full-stack development, and deployment.',
  chat:'I used HTML, CSS, JavaScript, and Socket.IO to recreate the interaction patterns behind iMessage while keeping room state synchronized across clients.',
  commute:'I defined the product, recommendation logic, onboarding, and interactive iPhone demo.',
  estee:'I worked on the product concept, UX/UI, and frontend development.',
  bookclub:'I independently defined the product, designed the experience, built the frontend and backend, and deployed the live application for my reading group.',
  marketExpansion:'I built the interactive Excel scorecard and scoring rubric used to compare candidate locations. The broader market research and branch-growth recommendations were developed with the consulting team.'
};


function AuraField({tone='default'}){
  return <div className={`auraField tone-${tone}`} aria-hidden="true">
    <span className="auraBloom bloom1"/><span className="auraBloom bloom2"/><span className="auraBloom bloom3"/><span className="auraBloom bloom4"/><span className="auraBloom bloom5"/><span className="auraBloom bloom6"/><span className="auraBloom bloom7"/>
  </div>
}

const projects = [
  {
    id:'commute',
    title:'Commute App',
    company:'Independent app · iOS',
    summary:'Works backward from where I need to be to decide when I should wake up, when I should leave, and which Bay Area commute is actually worth taking today.',
    media:'commute',
    facts:[]
  },
  {
    id:'fcvf',
    title:'Customer Value Framework',
    company:'Ford Motor Company',
    summary:'Turned an Excel-based customer-value assessment into a web application, then used four user interviews to change the interaction model, not just the interface.',
    media:'fcvf',
    facts:['4 user interviews','Live score removed after research']
  },
  {
    id:'accenture',
    title:'AI Enablement Operations',
    company:'Accenture · Frontier AI lab',
    summary:'Supported 21 live enablement requests, then used the repeated decisions and edge cases I saw to define automation requirements, test an early prototype, and recommend what to improve next.',
    media:'accenture',
    facts:['~2,200 learner responses','10-tab automation data contract']
  },
  {
    id:'kohler',
    title:'Ship Anywhere',
    company:'Kohler Co. · MSU CSE 498',
    summary:'Designing an export-preparation assistant that uses an order’s SKU and destination to identify the documents, checks, and review steps needed before shipment.',
    media:'kohler',
    facts:['Product + workflow design','Azure enterprise stack']
  },
  {
    id:'scheduler',
    title:'Collaborative Scheduling Platform',
    company:'',
    summary:'Built a campus scheduling product that keeps Available, Maybe, and Unavailable separate, recommends the best time, and carries that choice into a place and calendar event.',
    media:'scheduler',
    facts:['Interactive sandbox','Flask · Socket.IO · MySQL']
  },
  {
    id:'finsimple',
    title:'FinSimple',
    company:'Ford Credit',
    summary:'Owned the Previous Estimates feature inside an existing financial platform, taking it from requirements through AEM component work, Salesforce/API integration, QA, coordination across five teams, and production validation.',
    media:'finsimple',
    facts:['Feature ownership','Production environment']
  },
  {
    id:'marketExpansion',
    title:'Market Expansion Decision System',
    company:'Consumer services client · Spectrum Consulting Group',
    summary:'Built a weighted scorecard and rubric so the team could compare candidate locations using the same criteria.',
    media:'marketExpansion',
    facts:['Scorecard ownership','Strategy + business analysis']
  },
  {
    id:'chat',
    title:'iMessage Recreation on Web',
    company:'MSU · CSE 477',
    summary:'The assignment was to build a real-time chat room that showed people entering and leaving. I used it as an excuse to recreate iMessage on the web and then added typing state, Tapbacks, and synchronized message state across clients.',
    media:'chat',
    facts:['Real-time rooms + presence','Socket.IO']
  },
  {
    id:'estee',
    title:'Double Wear Foundation',
    company:'Estée Lauder × Kode With Klossy',
    summary:'Designed a branded Double Wear discovery experience connecting product education, shade exploration, and purchase.',
    media:'estee',
    facts:['Top 5 finalist','Earlier work']
  },
  {
    id:'bookclub',
    title:'Bookclub',
    company:'Independent product · live web app',
    summary:'Built a private book-club app for choosing a book, tracking reading progress, discussing without spoilers, and planning meetings.',
    media:'bookclub',
    facts:['Product definition + UX','Full-stack build + deployment']
  }
];

function MetricStrip({items}) {
  return <div className={`metricStrip metricCount-${items.length}`}>{items.map(([v,l,type='context'])=><div className={`metric metric-${type}`} key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
}


function PhotoLaptopMockup({src,alt,scene='front'}){
  return <figure className={`photoLaptop photoLaptop-${scene}`}>
    <img className="photoLaptopScene" loading="lazy" decoding="async" src={scene==='overhead'?'project-media/laptop-overhead-cc0.jpg':'project-media/laptop-desk-cc0.jpg'} alt="Laptop on a desk" width={3165} height={2334}/>
    <div className="photoLaptopScreen" aria-hidden="true"><img loading="lazy" decoding="async" src={src} alt=""/></div>
    <figcaption>{scene==='overhead'?'Photo: Aleksi Tappura · CC0':'Photo: Radek Grzybowski · CC0'}</figcaption>
  </figure>
}
function FCVFVisual(){
  return <PhotoLaptopMockup src="project-media/ford-after.webp" alt="Ford Customer Value Framework web application" scene="front"/>
}
function FinSimpleVisual(){
  return <PhotoLaptopMockup src="project-media/finsimple-live.png" alt="FinSimple Previous Estimates experience" scene="overhead"/>
}

const days=['Mon','Tue','Wed','Thu','Fri'];
const times=['9:00','9:30','10:00','10:30','11:00','11:30','12:00'];
const initialLevels=[0,1,2,0,1,1,2,3,1,0,0,1,2,3,2,1,0,1,2,2,0,0,1,2,3,2,1,0,1,1,2,0,0,1,2];

function SchedulerPreview(){
  const overlap=[1,2,3,1,0,2,3,3,2,1,1,2,3,2,1,0,1,2,3,2,1,2,2,3,1];
  return <div className="schedulerPreview">
    <div className="previewBar"><div><strong>Design Sync</strong><span>3 participants · Sep 15-19</span></div><span className="liveDot">Live</span></div>
    <div className="previewModes" aria-label="Availability states"><span className="modeAvailable">Available</span><span className="modeMaybe">Maybe</span><span className="modeUnavailable">Unavailable</span></div>
    <div className="previewTabs"><span>Group availability</span><strong>Best time · Tue 10:30</strong></div>
    <div className="previewCalendarHead"><span></span>{days.map(d=><span key={d}>{d}</span>)}</div>
    <div className="previewCalendar">{times.slice(0,5).map((t,r)=><React.Fragment key={t}><span>{t}</span>{days.map((d,c)=><i key={d} className={`overlap overlap-${overlap[r*5+c]} ${r===3&&c===1?'bestCell':''}`}/>)}</React.Fragment>)}</div>
    <div className="previewFooter"><div className="previewLegend"><span><i className="legendLow"/>Fewer available</span><span><i className="legendHigh"/>Best overlap</span></div><span className="venueHint">Venue vote · Minskoff Pavilion</span></div>
  </div>
}
function MiniScheduler(){
  const [view,setView]=useState('mine');
  const [mode,setMode]=useState('available');
  const [cells,setCells]=useState(()=>initialLevels.map((n,i)=>({
    status:n===1?'available':n===2?'maybe':n===3?'unavailable':'',
    available:[1,2,3,0,2][i%5]
  })));
  const quickFill=(type)=>setCells(prev=>prev.map((cell,i)=>{
    const row=Math.floor(i/5);
    if(type==='all') return {...cell,status:'available'};
    if(type==='evenings') return {...cell,status:row>=5?'available':''};
    if(type==='clear') return {...cell,status:''};
    return {...cell,status:row<=5?'available':''};
  }));
  return <div className="miniScheduler">
    <div className="miniEventHeader"><div><strong>Design Sync</strong><span>Sep 15-19 · Minskoff Pavilion</span></div><span>3 participants</span></div>
    <div className="miniQuick"><span>Quick fill</span><button onClick={()=>quickFill('all')}>Free all</button><button onClick={()=>quickFill('weekdays')}>Weekdays 9-5</button><button onClick={()=>quickFill('evenings')}>Evenings</button></div>
    <div className="miniView"><div><button className={view==='mine'?'active':''} onClick={()=>setView('mine')}>My Availability</button><button className={view==='heatmap'?'active':''} onClick={()=>setView('heatmap')}>Group Heatmap</button></div>{view==='mine'&&<div className="miniModes">{['available','maybe','unavailable'].map(m=><button key={m} className={mode===m?'active':''} onClick={()=>setMode(m)}>{m}</button>)}</div>}</div>
    <div className="calendarHead"><span></span>{days.map(d=><span key={d}>{d}</span>)}</div>
    <div className="calendarGrid">{times.map((t,r)=><React.Fragment key={t}><span className="timeLabel">{t}</span>{days.map((d,c)=>{const i=r*5+c;const cell=cells[i];const cls=view==='heatmap'?`heat heat-${Math.min(3,cell.available)}`:`status-${cell.status||'empty'}`;return <button key={d} aria-label={`${d} ${t}`} className={`slot ${cls}`} onClick={()=>view==='mine'&&setCells(a=>a.map((x,j)=>j===i?{...x,status:x.status===mode?'':mode}:x))}/>})}</React.Fragment>)}</div>
    <div className="miniFooter"><span>Best time: Tue 10:30</span><span>Venue voting · Event chat · Notes</span></div>
  </div>
}
function MiniChat(){
  const [messages,setMessages]=useState([
    {mine:false,text:'did everyone push?'},
    {mine:true,text:'yep just finished the socket changes'},
    {mine:false,text:'perfect I see them live'}
  ]);
  const [text,setText]=useState('');
  const send=()=>{if(!text.trim())return;setMessages(m=>[...m,{mine:true,text:text.trim()}]);setText('')};
  return <div className="phoneShell"><div className="phoneBar"><div className="avatar">NC</div><strong>Project group</strong><small>3 people</small></div><div className="phoneMessages">{messages.map((m,i)=><div className={m.mine?'bubble mine':'bubble theirs'} key={i}>{m.text}</div>)}</div><div className="composer"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="iMessage"/><button onClick={send}>↑</button></div></div>
}


function AccentureVisual(){
  return <figure className="accenturePhotoCover creditImage">
    <img loading="lazy" decoding="async" src="project-media/accenture-innovation-hub.jpg" alt="Accenture innovation hub at Salesforce Tower" width={900} height={506}/>
    <figcaption>Source: American City Business Journals</figcaption>
  </figure>
}
function AccentureWorkflowVisual(){
  return <div className="accentureSchemaWindow" aria-label="Operations decision schema">
    <header><i/><i/><i/><span>operations-decision-schema.ts</span></header>
    <pre><code><span className="codeComment">// Inputs captured for every request</span>{'\n'}<b>type Request</b> = {'{'}{'\n'}  customer, region, topic, timing;{'\n'}  language, expertise, capacity, timeZone;{'\n'}{'}'};{'\n\n'}<span className="codeComment">// Repeatable decision path</span>{'\n'}<b>if</b> (!requiredInputs) <em>return NEEDS_INFO;</em>{'\n'}<b>if</b> (!constraintsMatch) <em>return REVIEW;</em>{'\n'}<b>if</b> (warning || conflict) <em>return HUMAN_REVIEW;</em>{'\n'}<b>return</b> RECOMMEND_WITH_REASON;</code></pre>
    <footer><strong>10-tab operations specification</strong><span>inputs · matching · validation · warnings · reason codes · human review</span></footer>
  </div>
}

function CompanyBanner(){
 const logos=[['company-logos/ford-white-source.png','Ford'],['company-logos/ford-credit-white-source.png','Ford Credit'],['company-logos/esteelauder.png','Estee Lauder'],['company-logos/accenture-v31.png','Accenture'],['company-logos/kohler.svg','Kohler'],['company-logos/pwc-v31.png','PwC']];
 return <section className="companyBanner" aria-label="Companies and organizations I have built for"><span>Built for</span><div>{logos.map(([src,alt])=><img key={alt} src={assetUrl(src)} alt={alt}/>)}</div></section>
}

function EsteeVisual(){return <div className="esteeGrid"><img loading="lazy" decoding="async" src="project-media/el-home.webp" alt="Estée Lauder Double Wear landing experience"/><img loading="lazy" decoding="async" src="project-media/el-benefits.webp" alt="Double Wear product benefits"/><img loading="lazy" decoding="async" src="project-media/el-shades.webp" alt="Double Wear shade exploration"/><img loading="lazy" decoding="async" src="project-media/el-shop.webp" alt="Double Wear purchase options"/></div>}

function CommutePhone({view='home',busDelay=6,bridge='building',bartDelay=0,routine=48,health=true,wait=0,stale=false,onWait=()=>{}}){
  const fm=t=>{const h=Math.floor(t/60);const m=((t%60)+60)%60;return `${h>12?h-12:h}:${String(m).padStart(2,'0')}`};
  const bartRisk=Math.max(0,bartDelay*3+(stale?10:0));
  const busRisk=Math.max(0,busDelay*4+(bridge==='heavy'?18:bridge==='building'?10:0));
  const takeBart=bartRisk<=busRisk;
  const recommendation=takeBart?'BART':'NL bus';
  const leave=(takeBart?8*60+6:8*60+9)-(takeBart?Math.ceil(bartDelay*.7)+(stale?2:0):Math.ceil(busDelay*.45)+(bridge==='heavy'?3:bridge==='building'?1:0)+(stale?2:0));
  const wake=leave-Math.max(18,routine-wait);
  if(view==='why') return <div className="commutePhone"><div className="phoneStatus">7:22</div><div className="commuteNav">‹ <strong>{recommendation}</strong></div><div className="whyLead">{takeBart?'The bus could still be faster. Missing it is the bigger risk.':'The bus is worth catching right now.'}</div><p className="whyCopy">{takeBart?`NL is about ${busDelay} min behind and bridge traffic is ${bridge}. BART leaves you more recovery room.`:`The bus is close, traffic is ${bridge}, and waiting for BART costs more time today.`}</p><div className="routeCompare"><div><strong>BART</strong><span>Leave {fm(leave)}</span><span>Arrive 8:48-8:53</span><small>Miss it → next train ~6 min later</small></div><div><strong>NL</strong><span>Leave 8:09</span><span>Arrive 8:42-9:04</span><small>Miss it → next useful bus ~28 min later</small></div></div></div>;
  return <div className="commutePhone"><div className="phoneStatus">7:22</div><div className="commuteDate">FRIDAY · AUG 21</div><div className="commuteDestination"><span>Salesforce Tower</span><strong>9:00 AM</strong></div><div className="wakeHero"><strong>{fm(wake)}</strong><span>Wake up</span><small>Alarm set</small></div><div className="morningLine"><div><b>{fm(leave)}</b><span>Leave home</span></div><div><b>{takeBart?'8:19':'8:17'}</b><span>{takeBart?'19th St BART':'Grand Ave bus'}</span></div><div><b>{takeBart?'8:51':'8:49'}</b><span>Salesforce Tower</span></div></div><div className="recommendLine"><strong>{recommendation}</strong><span>{takeBart?'19th St → Embarcadero':'Grand Ave → Salesforce Transit Center'}</span><small>{stale?'Live transit data unavailable · using schedule':takeBart?'Safer choice this morning':'Worth catching this morning'}</small></div><button className="sleepBtn" onClick={onWait}>Can I sleep longer?</button></div>
}

const commuteRoutineDefaults=[
  {id:'shower',name:'Shower',minutes:10},
  {id:'hair',name:'Hair',minutes:10},
  {id:'makeup',name:'Makeup',minutes:10},
  {id:'coffee',name:'Coffee',minutes:5},
  {id:'breakfast',name:'Breakfast',minutes:8},
  {id:'scroll',name:'Morning phone scroll',minutes:8},
  {id:'buffer',name:'Buffer / grab things',minutes:7},
  {id:'gymTripOut',name:'Commute to gym',minutes:0},
  {id:'gym',name:'Gym',minutes:0},
  {id:'gymTripBack',name:'Commute from gym',minutes:0}
];

function IOSStatusIcons(){
  return <span className="iosStatusIcons" aria-label="5G, Wi-Fi, battery 82 percent">
    <svg className="statusSignal" viewBox="0 0 18 12" aria-hidden="true"><rect x="1" y="8" width="2.4" height="3" rx="1"/><rect x="5.2" y="6" width="2.4" height="5" rx="1"/><rect x="9.4" y="3.5" width="2.4" height="7.5" rx="1"/><rect x="13.6" y="1" width="2.4" height="10" rx="1"/></svg>
    <span className="status5g">5G</span>
    <svg className="statusWifi" viewBox="0 0 18 13" aria-hidden="true"><path d="M1.5 4.4C5.8.6 12.2.6 16.5 4.4"/><path d="M4.3 7.2c2.7-2.3 6.7-2.3 9.4 0"/><path d="M7.2 10c1-.85 2.6-.85 3.6 0"/><circle cx="9" cy="11.2" r="1"/></svg>
    <svg className="statusBattery" viewBox="0 0 27 13" aria-hidden="true"><rect x="1" y="1.5" width="22" height="10" rx="3"/><path d="M24.5 4.5v4"/><rect className="batteryFill" x="3" y="3.5" width="17" height="6" rx="1.5"/></svg>
  </span>
}

function CommuteAppDemo(){
  const defaults={
    name:'Neha',
    origin:'Whole Foods Oakland / Lake Merritt',
    destination:'Salesforce Tower',
    arrive:'09:00',
    buffer:8,
    routine:commuteRoutineDefaults,
    busDelay:6,
    bartDelay:0,
    bridge:'building',
    weather:'clear',
    freshness:{bart:0,nl:1,traffic:0}
  };
  const [stage,setStage]=useState('welcome');
  const [name,setName]=useState(defaults.name);
  const [origin,setOrigin]=useState(defaults.origin);
  const [destination,setDestination]=useState(defaults.destination);
  const [arrive,setArrive]=useState(defaults.arrive);
  const [buffer,setBuffer]=useState(defaults.buffer);
  const [health,setHealth]=useState(false);
  const [calendar,setCalendar]=useState(false);
  const [location,setLocation]=useState(false);
  const [alerts,setAlerts]=useState(false);
  const [alarmRule,setAlarmRule]=useState('suggest');
  const [permission,setPermission]=useState(null);
  const [routine,setRoutine]=useState(defaults.routine);
  const [tab,setTab]=useState('today');
  const [detail,setDetail]=useState(null);
  const [busDelay,setBusDelay]=useState(defaults.busDelay);
  const [bartDelay,setBartDelay]=useState(defaults.bartDelay);
  const [bridge,setBridge]=useState(defaults.bridge);
  const [weather,setWeather]=useState(defaults.weather);
  const [freshnessMin,setFreshnessMin]=useState(defaults.freshness);
  const [sleepOffset,setSleepOffset]=useState(0);
  const [toast,setToast]=useState('');
  const [demoNow]=useState(7*60+22);
  const [todayLabel]=useState(()=>new Intl.DateTimeFormat(undefined,{weekday:'long',month:'short',day:'numeric'}).format(new Date()));

  const routineMinutes=routine.reduce((n,x)=>n+x.minutes,0);
  const minRoutine=Math.max(18,routineMinutes-12);
  const standardWalk=8;
  const personalizedWalk=10;
  const walkToBart=(health?personalizedWalk:standardWalk)+(weather==='rain'?2:0);
  const walkToBus=6+(weather==='rain'?1:0);
  const arriveTarget=Number(arrive.slice(0,2))*60+Number(arrive.slice(3));
  const deadline=arriveTarget-buffer;
  const fmt=m=>{m=(m+1440)%1440;const h=Math.floor(m/60),mm=m%60;return `${h%12||12}:${String(mm).padStart(2,'0')} ${h>=12?'PM':'AM'}`};
  const shortFmt=m=>fmt(m).replace(' AM','').replace(' PM','');
  const latestDeparture=(start,headway,ride,finalWalk,delay)=>{let best=null;for(let dep=start;dep<start+240;dep+=headway){const actual=dep+delay;const arrival=actual+ride+finalWalk;if(arrival<=deadline)best={scheduled:dep,actual,arrival}}return best};
  const bartTrip=latestDeparture(7*60+30,6,22,6,bartDelay) || {scheduled:deadline-28-bartDelay,actual:deadline-28,arrival:deadline};
  const trafficExtra=bridge==='heavy'?12:bridge==='building'?6:0;
  const busTrip=latestDeparture(7*60+15,30,25+trafficExtra,3,busDelay) || {scheduled:deadline-28-trafficExtra-busDelay,actual:deadline-28-trafficExtra,arrival:deadline};
  const bartFreshRisk=Math.min(6,Math.floor(freshnessMin.bart/2));
  const nlFreshRisk=Math.min(8,Math.floor(freshnessMin.nl/2));
  const trafficFreshRisk=Math.min(6,Math.floor(freshnessMin.traffic/2));
  const bartLeave=bartTrip.actual-walkToBart-2;
  const busLeave=busTrip.actual-walkToBus-2;
  const bartPenalty=Math.ceil(bartDelay*.45)+bartFreshRisk;
  const busPenalty=(busDelay>5?4:1)+(bridge==='heavy'?5:bridge==='building'?2:0)+nlFreshRisk+trafficFreshRisk;
  const takeBart=(bartLeave-bartPenalty)>=(busLeave-busPenalty);
  const chosen=takeBart?bartTrip:busTrip;
  const route=takeBart?'BART':'NL bus';
  const leaveMin=takeBart?bartLeave:busLeave;
  const baseWake=leaveMin-routineMinutes;
  const requestedWake=baseWake+sleepOffset;
  const availableRoutine=leaveMin-requestedWake;
  const sleepFeasible=availableRoutine>=minRoutine;
  const wakeMin=sleepFeasible?requestedWake:baseWake;
  const phase=demoNow<wakeMin?'planned':demoNow<leaveMin?'morning':demoNow<deadline?'leave':'late';
  const routeStation=takeBart?'19th St BART':'Grand Ave bus stop';
  const routeSub=takeBart?'19th St to Embarcadero':'Grand Ave to Salesforce Transit Center';
  const vehicleTime=takeBart?bartTrip.actual:busTrip.actual;
  const chosenArrival=chosen.arrival;
  const lateBy=Math.max(0,chosenArrival-deadline);

  const next=()=>setStage(x=>({welcome:'routine',routine:'health',health:'calendar',calendar:'location',location:'alerts',alerts:'trip',trip:'app'}[x]||'app'));
  const flash=t=>{setToast(t);window.setTimeout(()=>setToast(''),1600)};
  const changeRoutine=(id,delta)=>setRoutine(r=>r.map(x=>x.id===id?{...x,minutes:Math.max(0,x.minutes+delta)}:x));
  const freshness=(key)=>{const age=freshnessMin[key];return {tone:age<=1?'live':age<=5?'aging':'warn',label:age===0?'Live':age<=1?'1m ago':`${age}m ago`}};
  const Fresh=({source})=>{const f=freshness(source);return <span className={`freshness ${f.tone}`}><i></i>{f.label}</span>};
  const resetDemo=()=>{
    setStage('welcome');setName(defaults.name);setOrigin(defaults.origin);setDestination(defaults.destination);setArrive(defaults.arrive);setBuffer(defaults.buffer);
    setHealth(false);setCalendar(false);setLocation(false);setAlerts(false);setAlarmRule('suggest');setPermission(null);setRoutine(commuteRoutineDefaults);
    setTab('today');setDetail(null);setBusDelay(defaults.busDelay);setBartDelay(defaults.bartDelay);setBridge(defaults.bridge);setWeather(defaults.weather);setFreshnessMin(defaults.freshness);setSleepOffset(0);setToast('');
  };

  const permissionCopy={
    health:{title:'Allow Commute to read Walking Speed?',body:'HealthKit Walking Speed is used only to personalize your estimated walk to transit.',allow:'Allow'},
    calendar:{title:'Allow Commute to access your calendar?',body:'Event time and location can create a morning plan automatically.',allow:'Allow'},
    location:{title:'Allow location while using Commute?',body:'Used to estimate door-to-stop time while a trip is active.',allow:'Allow'},
    alerts:{title:'Allow notifications from Commute?',body:'Get a heads-up if your wake or leave time changes.',allow:'Allow'}
  };
  const allowPermission=(type)=>{
    if(type==='health')setHealth(true);
    if(type==='calendar')setCalendar(true);
    if(type==='location')setLocation(true);
    if(type==='alerts')setAlerts(true);
    setPermission(null);
    if(stage==='app')flash(`${type[0].toUpperCase()+type.slice(1)} connected`);
    if(stage!=='app')window.setTimeout(next,180);
  };
  const denyPermission=()=>{setPermission(null);if(stage!=='app')next()};
  const dialog=permission&&<div className="iosPermissionBackdrop"><div className="iosPermissionDialog" role="dialog" aria-modal="true" aria-labelledby="permission-title"><h3 id="permission-title">{permissionCopy[permission].title}</h3><p>{permissionCopy[permission].body}</p><div><button type="button" onClick={denyPermission}>Not Now</button><button type="button" onClick={()=>allowPermission(permission)}>{permissionCopy[permission].allow}</button></div></div></div>;
  const StatusIcons=()=> <IOSStatusIcons/>;
  const TabIcon=({name})=>{
    if(name==='today')return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z"/></svg>;
    if(name==='plan')return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>;
    if(name==='history')return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 9A8 8 0 1 1 5 16"/><path d="M4 4v5h5"/><path d="M12 8v5l3 2"/></svg>;
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></svg>;
  };
  const chrome=(content)=><div className="iosPhoneDevice"><div className="iosDemoShell"><div className="iosStatus"><span>{shortFmt(demoNow)}</span><StatusIcons/></div><div className="iosScreenContent" inert={permission?true:undefined}>{content}</div>{dialog}{toast&&<div className="iosToast" role="status" aria-live="polite">{toast}</div>}<div className="iosHomeIndicator" aria-hidden="true"></div></div><img className="iosHardwareFrame" src="project-media/iphone-frame-v31.png" alt="" aria-hidden="true"/></div>;

  if(stage==='welcome') return chrome(<div className="iosOnboarding iosWelcome"><div className="iosBrandMark">C</div><div className="welcomeCopy"><h3>Commute</h3><h2>Know when to get up.</h2><p>Tell it where you need to be. It works backward from arrival time, transit, traffic, and your routine.</p></div><label className="iosField"><span>Your name</span><input value={name} onChange={e=>setName(e.target.value)} /></label><button className="iosPrimary" type="button" onClick={next}>Set up my morning</button><button className="iosTextBtn" type="button" onClick={()=>setStage('app')}>Use current plan</button></div>);
  if(stage==='routine') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('welcome')}>‹</button><span>1 of 6</span></div><h2>Your routine</h2><p className="iosSub">About how long do you need before leaving?</p><div className="routineEditor">{routine.map(x=><div className="routineItem" key={x.id}><span>{x.name}</span><div><button type="button" aria-label={`Decrease ${x.name} duration`} onClick={()=>changeRoutine(x.id,-1)}>−</button><strong>{x.minutes}m</strong><button type="button" aria-label={`Increase ${x.name} duration`} onClick={()=>changeRoutine(x.id,1)}>+</button></div></div>)}</div><div className="routineSummary"><span>Total</span><strong>{routineMinutes} min</strong></div><button className="iosPrimary" type="button" onClick={next}>Continue</button></div>);
  if(stage==='health') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('routine')}>‹</button><span>2 of 6</span></div><h2>Walking pace</h2><p className="iosSub">With permission, Commute reads Apple Health’s Walking Speed data through HealthKit to make the estimated walk to transit more accurate for you.</p><div className="nativeSettingRow"><div className="nativeIcon healthNative">♥</div><div><strong>Apple Health</strong><span>{health?'Walking speed connected':'Not connected'}</span></div></div><button className="iosPrimary" type="button" onClick={()=>health?next():setPermission('health')}>{health?'Continue':'Connect Health'}</button><button className="iosTextBtn" type="button" onClick={next}>Not now</button></div>);
  if(stage==='calendar') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('health')}>‹</button><span>3 of 6</span></div><h2>Calendar</h2><p className="iosSub">Commute can turn the first place-based event on your calendar into a morning plan.</p><div className="calendarEventPreview"><div className="calendarDateBadge"><span>FRI</span><strong>21</strong></div><i aria-hidden="true"></i><div className="calendarEventBody"><span>9:00–10:00 AM</span><strong>Team sync</strong><small>Salesforce Tower · 415 Mission St</small></div></div><button className="iosPrimary" type="button" onClick={()=>calendar?next():setPermission('calendar')}>{calendar?'Continue':'Connect Calendar'}</button><button className="iosTextBtn" type="button" onClick={next}>Enter trips myself</button></div>);
  if(stage==='location') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('calendar')}>‹</button><span>4 of 6</span></div><h2>Location</h2><p className="iosSub">Optional. Use your location only while a commute is active.</p><div className="nativeSettingRow"><div className="nativeIcon locationNative">⌖</div><div><strong>While using the app</strong><span>{location?'Enabled':'Off'}</span></div></div><button className="iosPrimary" type="button" onClick={()=>location?next():setPermission('location')}>{location?'Continue':'Choose access'}</button><button className="iosTextBtn" type="button" onClick={next}>Not now</button></div>);
  if(stage==='alerts') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('location')}>‹</button><span>5 of 6</span></div><h2>Notifications</h2><p className="iosSub">Only when the plan changes or it is time to leave.</p><div className="alarmPreference"><span>Alarm changes</span><select value={alarmRule} onChange={e=>setAlarmRule(e.target.value)}><option value="suggest">Ask me first</option><option value="auto15">Auto-adjust up to 15m</option><option value="never">Never adjust</option></select></div><button className="iosPrimary" type="button" onClick={()=>alerts?next():setPermission('alerts')}>{alerts?'Continue':'Allow notifications'}</button><button className="iosTextBtn" type="button" onClick={next}>Not now</button></div>);
  if(stage==='trip') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('alerts')}>‹</button><span>6 of 6</span></div><h2>First commute</h2><div className="iosField"><label>From</label><input value={origin} onChange={e=>setOrigin(e.target.value)}/></div><div className="iosField"><label>To</label><input value={destination} onChange={e=>setDestination(e.target.value)}/></div><div className="iosField"><label>Arrive by</label><input type="time" value={arrive} onChange={e=>setArrive(e.target.value)}/></div><div className="bufferRow"><span>Arrive early</span><div><button type="button" aria-label="Decrease arrival buffer" onClick={()=>setBuffer(Math.max(0,buffer-1))}>−</button><strong>{buffer}m</strong><button type="button" aria-label="Increase arrival buffer" onClick={()=>setBuffer(Math.min(30,buffer+1))}>+</button></div></div><button className="iosPrimary" type="button" onClick={next}>Build my morning</button></div>);

  const routeReason=takeBart?'More recovery time if you miss a train.':'The bus saves enough time to justify the longer headway.';
  const today=<div className="iosAppScreen todayScreen"><div className="appTop"><div><span>{todayLabel}</span><h3>{phase==='late'?'You need a new plan':`Good morning, ${name}`}</h3></div><button className="avatarBtn" type="button" aria-label="Open profile" onClick={()=>setDetail('profile')}>{name[0]||'N'}</button></div><button className="destinationLine" type="button" onClick={()=>setDetail('edit')} aria-label="Edit commute destination and arrival time"><div><span>Arrive by</span><strong>{destination}</strong></div><b>{fmt(arriveTarget)}</b></button>{phase==='late'?<button className="bigMoment urgent" type="button" onClick={()=>setDetail('alarm')}><span>Leave now</span><strong>{fmt(chosenArrival)}</strong><small>Current arrival with {route}</small></button>:<button className="bigMoment" type="button" onClick={()=>setDetail('alarm')}><span>{phase==='planned'?'Alarm':'Wake up'}</span><strong>{fmt(wakeMin)}</strong><small>Leave at {fmt(leaveMin)}</small></button>}<button className="routeRecommendation" type="button" onClick={()=>setDetail('why')}><div className="routeBadge">{takeBart?'B':'NL'}</div><span><small>Recommended</small><strong>{route}</strong><em>{routeSub}</em></span><div className="routeTimes"><b>{fmt(vehicleTime)}</b><small>arrive {fmt(chosenArrival)}</small></div></button><p className="routeReason">{routeReason}</p><div className="liveStrip"><button type="button" onClick={()=>setDetail('sources')}><Fresh source={takeBart?'bart':'nl'}/> {route}</button><button type="button" onClick={()=>setDetail('conditions')}>{bridge==='clear'?'Bridge clear':bridge==='building'?'Bridge +6m':'Bridge +12m'}</button></div><button className="sleepAction" type="button" onClick={()=>setDetail('sleep')}><span>Can I sleep longer?</span><b>›</b></button></div>;
  const plan=<div className="iosAppScreen"><div className="appTop"><div><span>Morning plan</span><h3>{destination}</h3></div><button className="smallEdit" type="button" onClick={()=>setDetail('edit')}>Edit</button></div><div className="planSummary"><span>Wake</span><strong>{fmt(wakeMin)}</strong><small>{routineMinutes} min routine</small></div><div className="planList"><div><time>{fmt(leaveMin)}</time><span>Leave home</span></div><div><time>{fmt(vehicleTime)}</time><span>{routeStation}</span></div><div><time>{fmt(chosenArrival)}</time><span>Arrive at {destination}</span></div><div><time>{fmt(arriveTarget)}</time><span>Be there</span></div></div><button className="iosSecondary" type="button" onClick={()=>setDetail('why')}>Why this route?</button></div>;
  const history=<div className="iosAppScreen"><div className="appTop"><div><span>History</span><h3>What Commute learns</h3></div></div><p className="historyIntro">Completed trips update the signals Commute uses for future mornings.</p><div className="historyRows"><div><span>Walk to 19th St</span><strong>{health?'10 min':'8 min'}</strong><small>{health?'Personalized walking estimate':'Default walking estimate'}</small></div><div><span>Arrival buffer</span><strong>{buffer} min</strong><small>Your current preference</small></div><div><span>Morning routine</span><strong>{routineMinutes} min</strong><small>{routine.length} saved steps</small></div></div></div>;
  const settings=<div className="iosAppScreen"><div className="appTop"><div><span>Settings</span><h3>{name}</h3></div></div><div className="settingsList"><button type="button" onClick={()=>setStage('routine')}><span>Morning routine</span><b>{routineMinutes} min</b></button><button type="button" onClick={()=>health?(setHealth(false),flash('Health disconnected')):setPermission('health')}><span>Health</span><b>{health?'On':'Off'}</b></button><button type="button" onClick={()=>calendar?(setCalendar(false),flash('Calendar disconnected')):setPermission('calendar')}><span>Calendar</span><b>{calendar?'On':'Off'}</b></button><button type="button" onClick={()=>location?(setLocation(false),flash('Location turned off')):setPermission('location')}><span>Location</span><b>{location?'While Using':'Off'}</b></button><button type="button" onClick={()=>alerts?(setAlerts(false),flash('Notifications turned off')):setPermission('alerts')}><span>Notifications</span><b>{alerts?'On':'Off'}</b></button><button type="button" onClick={()=>setDetail('conditions')}><span>Live inputs</span><b>Adjust</b></button></div><button className="resetDemo" type="button" onClick={resetDemo}>Reset morning</button></div>;
  const main=tab==='today'?today:tab==='plan'?plan:tab==='history'?history:settings;
  const sleepChoices=[5,10,15].map(n=>{const available=routineMinutes-n;const feasible=available>=minRoutine;return {n,feasible,label:feasible?(n===5?'No tradeoff':'Shorten routine'):'Not enough time'}});

  return chrome(<>{main}<nav className="iosTabBar" aria-label="Commute tabs">{['today','plan','history','settings'].map(item=><button type="button" key={item} className={tab===item?'active':''} onClick={()=>{setTab(item);setDetail(null)}}><TabIcon name={item}/><small>{item[0].toUpperCase()+item.slice(1)}</small></button>)}</nav>{detail==='why'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label={`Why ${route}`}><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Why {route}</strong><span></span></div><h2>{takeBart?'BART is the safer choice this morning.':'The NL is worth catching this morning.'}</h2><p className="sheetLead">Commute compares the latest safe departure, current delay, missed-departure penalty, and data freshness.</p><div className="routeFacts"><div className={takeBart?'selected':''}><div className="routeFactHead"><strong>BART</strong><Fresh source="bart"/></div><span>Leave {fmt(bartLeave)}</span><b>Arrive {fmt(bartTrip.arrival)}</b><small>{bartDelay?`Delay +${bartDelay}m`:'On time'} · next train about 6m</small></div><div className={!takeBart?'selected':''}><div className="routeFactHead"><strong>NL bus</strong><Fresh source="nl"/></div><span>Leave {fmt(busLeave)}</span><b>Arrive {fmt(busTrip.arrival)}</b><small>Delay +{busDelay}m · next bus about 30m</small></div></div><button className="iosSecondary" type="button" onClick={()=>setDetail('conditions')}>Change conditions</button></div>}{detail==='alarm'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Alarm and wake plan"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Wake plan</strong><span></span></div><h2>{fmt(wakeMin)} alarm</h2><p className="sheetLead">This wake time works backward from your {fmt(arriveTarget)} arrival, {buffer}-minute buffer, selected route, and {routineMinutes}-minute routine.</p><div className="nativeDetailList"><button type="button" onClick={()=>setDetail('sleep')}><span>Sleep adjustment</span><strong>{sleepOffset?`+${sleepOffset} min`:'Check options'} ›</strong></button><button type="button" onClick={()=>{setDetail(null);setTab('plan')}}><span>Morning plan</span><strong>View timeline ›</strong></button><button type="button" onClick={()=>{setDetail(null);setTab('settings')}}><span>Alarm changes</span><strong>{alarmRule==='suggest'?'Ask first':alarmRule==='auto15'?'Auto up to 15m':'Never'} ›</strong></button></div></div>}{detail==='sources'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Live data sources"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Live data</strong><span></span></div><h2>What changed this morning</h2><p className="sheetLead">Commute only surfaces data that can change your leave time or route choice.</p><div className="sourceStatusList"><div><span>BART</span><strong><Fresh source="bart"/></strong></div><div><span>NL · AC Transit bus</span><strong><Fresh source="nl"/></strong></div><div><span>Bridge traffic</span><strong><Fresh source="traffic"/></strong></div></div><button className="iosSecondary" type="button" onClick={()=>setDetail('conditions')}>Change live inputs</button></div>}{detail==='sleep'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Sleep longer"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Sleep longer</strong><span></span></div><h2>Keep the same leave time.</h2><p className="sheetLead">Choose how much of your morning buffer to trade for sleep.</p><div className="sleepChoices">{sleepChoices.map(x=><button type="button" key={x.n} disabled={!x.feasible} onClick={()=>{setSleepOffset(x.n);flash(`Alarm moved ${x.n}m later`);setDetail(null)}}><div><strong>+{x.n} min</strong><span>{x.label}</span></div><b>{x.feasible?'›':'Unavailable'}</b></button>)}</div>{sleepOffset>0&&<button className="iosTextBtn leftText" type="button" onClick={()=>{setSleepOffset(0);flash('Original alarm restored');setDetail(null)}}>Restore original alarm</button>}</div>}{detail==='conditions'&&<div className="iosFullSheet demoConditionsSheet" role="dialog" aria-modal="true" aria-label="Live inputs"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Conditions</strong><span></span></div><h2>Change the morning.</h2><div className="demoOnlyNotice"><strong>Portfolio demo only</strong><p>These controls let you simulate real-time conditions and see the recommendation change. They do not exist in the actual app: BART and AC Transit GTFS-Realtime/511 feeds, traffic data, and weather supply these inputs automatically.</p></div><div className="conditionRows"><label>NL delay <b>+{busDelay}m</b><input type="range" min="0" max="18" value={busDelay} onChange={e=>setBusDelay(+e.target.value)}/></label><label>BART delay <b>+{bartDelay}m</b><input type="range" min="0" max="15" value={bartDelay} onChange={e=>setBartDelay(+e.target.value)}/></label><label>Bridge<select value={bridge} onChange={e=>setBridge(e.target.value)}><option value="clear">Clear</option><option value="building">Building</option><option value="heavy">Heavy</option></select></label><label>Weather<select value={weather} onChange={e=>setWeather(e.target.value)}><option value="clear">Clear</option><option value="rain">Rain</option></select></label><label>BART data age <b>{freshnessMin.bart}m</b><input type="range" min="0" max="12" value={freshnessMin.bart} onChange={e=>setFreshnessMin(v=>({...v,bart:+e.target.value}))}/></label><label>NL data age <b>{freshnessMin.nl}m</b><input type="range" min="0" max="12" value={freshnessMin.nl} onChange={e=>setFreshnessMin(v=>({...v,nl:+e.target.value}))}/></label></div><p className="iosFinePrint">Changes update the route and wake-time recommendation immediately.</p></div>}{detail==='edit'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Edit commute"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Edit commute</strong><span></span></div><div className="iosField"><label>From</label><input value={origin} onChange={e=>setOrigin(e.target.value)}/></div><div className="iosField"><label>To</label><input value={destination} onChange={e=>setDestination(e.target.value)}/></div><div className="iosField"><label>Arrive by</label><input type="time" value={arrive} onChange={e=>setArrive(e.target.value)}/></div><div className="bufferRow"><span>Arrive early</span><div><button type="button" onClick={()=>setBuffer(Math.max(0,buffer-1))}>−</button><strong>{buffer}m</strong><button type="button" onClick={()=>setBuffer(Math.min(30,buffer+1))}>+</button></div></div><button className="iosPrimary fixedPrimary" type="button" onClick={()=>{flash('Commute updated');setDetail(null)}}>Save commute</button></div>}{detail==='profile'&&<div className="iosFullSheet profileSheet" role="dialog" aria-modal="true" aria-label="Profile"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Profile</strong><span></span></div><div className="profileMonogram">{name[0]||'N'}</div><h2>{name}</h2><div className="profileStats"><div><span>Home</span><strong>Oakland</strong></div><div><span>Typical destination</span><strong>{destination}</strong></div><div><span>Routine</span><strong>{routineMinutes} min</strong></div></div><button className="iosSecondary" type="button" onClick={()=>{setDetail(null);setTab('settings')}}>Open settings</button></div>}</>);
}
function PreviewStatusIcons(){return <IOSStatusIcons/>}
function CommutePreviewScreen(){
  return <div className="iosAppScreen todayScreen commutePreviewScreen"><div className="appTop"><div><span>Friday, Aug 21</span><h3>Good morning, Neha</h3></div><button className="avatarBtn" type="button" tabIndex={-1}>N</button></div><button className="destinationLine" type="button" tabIndex={-1}><div><span>Arrive by</span><strong>Salesforce Tower</strong></div><b>9:00 AM</b></button><button className="bigMoment" type="button" tabIndex={-1}><span>Wake up</span><strong>7:18 AM</strong><small>Leave at 8:06 AM</small></button><button className="routeRecommendation" type="button" tabIndex={-1}><div className="routeBadge">B</div><span><small>Recommended</small><strong>BART</strong><em>19th St → Embarcadero</em></span><div className="routeTimes"><b>8:19</b><small>arrive 8:51</small></div></button><p className="routeReason">More recovery time if you miss a train.</p><div className="liveStrip"><span>BART live</span><span>Bridge +6m</span></div><button className="sleepAction" type="button" tabIndex={-1}><span>Can I sleep longer?</span><b>›</b></button><nav className="iosTabBar" aria-hidden="true"><button className="active" tabIndex={-1}><span>⌂</span><small>Today</small></button><button tabIndex={-1}><span>◫</span><small>Plan</small></button><button tabIndex={-1}><span>↶</span><small>History</small></button><button tabIndex={-1}><span>⚙</span><small>Settings</small></button></nav></div>
}
function CommutePreview(){
  return <div className="commutePreview commutePreviewStatic"><img src={assetUrl('project-media/commute-demo-preview.png')} alt="Commute iOS app demo showing a morning wake-time and BART recommendation"/></div>
}

function CommuteSandbox(){
  return <div className="commuteExperience"><CommuteBARTStory/><div className="commuteSandbox immersiveSandbox"><div className="iphoneDemoStage"><CommuteAppDemo/></div></div></div>
}

function CommuteInUse(){return <div className="commuteInUse"><figure className="usagePhoto"><img src="project-media/salesforce-tower.jpg" alt="Salesforce Tower in San Francisco" width={1600} height={1067}/><figcaption>Photo: lamblukas · Wikimedia Commons</figcaption></figure><div className="usagePhone"><CommutePhone busDelay={2} bridge="clear"/></div><div className="lockMock"><span>7:54</span><strong>Leave in 12 min</strong><small>BART · 19th St</small><i>Everything is on track.</i></div></div>}

function BookclubLiveVisual(){
 return <figure className="bookclubLiveVisual"><img loading="lazy" decoding="async" src={assetUrl('project-media/bookclub/screens/club-home.jpg')} alt="Bookclub club home showing the current read, progress, and upcoming meeting"/><figcaption><i aria-hidden="true"></i>Live product · club home</figcaption></figure>
}

function MarketArtifactBoard(){
 return <div className="marketArtifactBoard" aria-label="Selected artifacts from the Graze Craze final presentation">
  <div className="artifactBoardTop"><span>SELECTED DECK ARTIFACTS · APRIL 2024</span><strong>Original scorecard and supporting artifacts</strong></div>
  <div className="artifactBoardGrid">
   <figure className="artifactSlide artifactScore"><img src={assetUrl('project-media/graze-scorecard.png')} alt="Original interactive Excel scorecard from the Graze Craze presentation"/><figcaption><span>01</span><div><strong>Interactive scorecard</strong><small>The weighted criteria roll into one location score.</small></div></figcaption></figure>
   <figure className="artifactSlide artifactRubric"><img src={assetUrl('project-media/graze-rubric.png')} alt="Original scoring rubric from the Graze Craze presentation"/><figcaption><span>02</span><div><strong>Supplemental rubric</strong><small>Each score has a concrete benchmark, making the model repeatable.</small></div></figcaption></figure>
   <figure className="artifactSlide artifactMap"><img src={assetUrl('project-media/graze-map.png')} alt="Original Michigan location map from the Graze Craze presentation"/><figcaption><span>03</span><div><strong>Location shortlist</strong><small>The model compared Northville, Ann Arbor, and Traverse City.</small></div></figcaption></figure>
  </div>
 </div>
}

const kohlerMarkets={
  india:{label:'Bengaluru, India',language:'English + Hindi',page:'A4',warranty:'India market warranty',readiness:82},
  china:{label:'Shanghai, China',language:'Chinese + English',page:'A4',warranty:'China market warranty',readiness:74},
  uae:{label:'Dubai, UAE',language:'Arabic + English',page:'A4',warranty:'GCC market warranty',readiness:67}
};

function KohlerProductSurface({compact=false}){
 const [market,setMarket]=useState('india');
 const detail=kohlerMarkets[market];
 const requirements=[`Translated installation guide`,`${detail.page} specification sheet`,detail.warranty,'Destination compliance label'];
 return <div className={`kohlerSurface ${compact?'compact':''}`} aria-label="Portfolio reconstruction of the Ship Anywhere export preparation workspace">
  <header className="kohlerSurfaceBar"><img src={assetUrl('company-logos/kohler.svg')} alt="Kohler"/><div><strong>Ship Anywhere</strong><span>AI export compliance assistant</span></div><small>WORKFLOW PROTOTYPE · SAMPLE DATA</small></header>
  <div className="kohlerSurfaceBody">
   <aside><span>PREPARATION</span>{['Overview','Requirements','Documents','Validation','Audit'].map((item,index)=><div className={index===0?'active':''} key={item}><b>{String(index+1).padStart(2,'0')}</b>{item}</div>)}</aside>
   <div className="kohlerSurfaceMain">
    <div className="kohlerWorkspaceHead"><div><span>ORDER SO-28471</span><strong>Export preparation for this order</strong></div><i>Workflow prototype</i></div>
    {!compact&&<div className="kohlerMarketTabs" role="group" aria-label="Choose a sample destination">{Object.entries(kohlerMarkets).map(([key,value])=><button type="button" className={key===market?'selected':''} onClick={()=>setMarket(key)} aria-pressed={key===market} key={key}>{value.label}</button>)}</div>}
    <div className="kohlerFieldRail"><div><span>PRODUCT</span><strong>Purist single-handle faucet</strong></div><div><span>DESTINATION</span><strong>{detail.label}</strong></div><div><span>ORDER SOURCE</span><strong>SAP ECC</strong></div></div>
    <div className="kohlerWorkspaceGrid"><section className="kohlerRoute"><header><span>REQUIREMENT PACKET</span><b>{detail.readiness}% ready</b></header><div className="kohlerRouteLine"><i></i><strong>US</strong><em></em><strong>{market==='india'?'IN':market==='china'?'CN':'AE'}</strong></div><ul>{requirements.slice(0,compact?3:4).map((item,index)=><li key={item}><span>{index<2?'✓':index===2?'↻':'!'}</span><div><strong>{item}</strong><small>{index<2?'Validated against source':'Prepared for review'}</small></div></li>)}</ul></section><section className="kohlerDocument"><header><span>GENERATED DOCUMENT</span><b>{detail.page}</b></header><div className="kohlerPaper"><span>SPECIFICATION</span><strong>Purist® faucet</strong><i></i><small>{detail.language}</small><p>Regional contacts, warranty language, compliance notes, and approved product attributes assembled for the destination.</p></div><footer><span>Validation</span><strong>Human review required</strong></footer></section></div>
   </div>
   {!compact&&<section className="kohlerStatusRail"><span>WORKFLOW STATUS</span><strong>{detail.readiness}%</strong><i><b style={{width:`${detail.readiness}%`}}></b></i><div><small>Product data</small><b>Ready</b></div><div><small>Regional packet</small><b>Review</b></div><div><small>Audit record</small><b>Open</b></div></section>}
  </div>
 </div>
}

function ProjectCover({type}){
  if(type==='commute') return <figure className="suppliedProjectCover portraitCover"><img loading="lazy" decoding="async" src={assetUrl('project-media/supplied-covers/commute.jpg')} alt="Commute mobile app showing a recommended morning plan"/></figure>;
  if(type==='fcvf') return <figure className="homepageMockup"><img loading="lazy" decoding="async" src="project-media/fcvf-home-mockup.png" alt="Customer Value Framework shown on a laptop during a working session"/></figure>;
  if(type==='accenture') return <AccentureVisual/>;
  if(type==='kohler') return <figure className="suppliedProjectCover"><img loading="lazy" decoding="async" src={assetUrl('project-media/supplied-covers/kohler.jpg')} alt="Ship Anywhere export preparation workspace in use"/></figure>;
  if(type==='finsimple') return <figure className="homepageMockup"><img loading="lazy" decoding="async" src="project-media/finsimple-home-mockup.png" alt="FinSimple shown on a laptop"/></figure>;
  if(type==='scheduler') return <figure className="suppliedProjectCover"><img loading="lazy" decoding="async" src={assetUrl('project-media/supplied-covers/scheduler.jpg')} alt="Collaborative Scheduler displayed in a workspace"/></figure>;
  if(type==='chat') return <figure className="suppliedProjectCover"><img loading="lazy" decoding="async" src={assetUrl('project-media/supplied-covers/chat.jpeg')} alt="Collaborative chat displayed in a workspace"/></figure>;
  if(type==='bookclub') return <figure className="suppliedProjectCover"><img loading="lazy" decoding="async" src={assetUrl('project-media/supplied-covers/bookclub.jpg')} alt="Bookclub mobile app beside a reader's notebook and tea"/></figure>;
  if(type==='marketExpansion') return <GrazeProjectPreview/>;
  return <figure className="homepageMockup"><img loading="lazy" decoding="async" src="project-media/estee-home-mockup.png" alt="Estée Lauder Double Wear experience shown on a laptop"/></figure>;
}

function ProjectCard({project,index,onOpen,featured=true}){
  return <Reveal className={featured?'projectCardReveal featured':'projectCardReveal'}>
    <article className={`projectCard project-${project.id} ${featured?'featured':''}`}>
      <a className="projectCardAction" href={`#/projects/${project.id}`} onClick={(event)=>{event.preventDefault();onOpen(project.id)}} aria-label={`Open ${project.title} case study`}>
        <div className="projectCardMedia"><ProjectCover type={project.media}/></div>
        <div className="projectCardBody"><div className="projectCardTop"><span>{project.company}</span></div><h3>{project.title}</h3><p>{project.summary}</p><span className="projectTextLink">Learn more ↗</span></div>
      </a>
    </article>
  </Reveal>
}

function CaseHeroLogo({src,alt,className=''}){
  return <div className={`caseHeroLogoWrap ${className}`}><img src={assetUrl(src)} alt={alt}/></div>
}
function ProjectVisual({type}){
  if(type==='commute') return <CommutePreview/>;
  if(type==='fcvf') return <CaseHeroLogo src="company-logos/ford.png" alt="Ford Motor Company" className="fcvfHeroMark"/>;
  if(type==='accenture') return <AccentureSFHero/>;
  if(type==='kohler') return <CaseHeroLogo src="company-logos/kohler.svg" alt="Kohler" className="kohlerHeroMark"/>;
  if(type==='finsimple') return <FinSimpleMachE/>;
  if(type==='scheduler') return <SchedulerPlannerHero/>;
  if(type==='chat') return <MiniChat/>;
  if(type==='bookclub') return <BookclubPhoneHero/>;
  if(type==='marketExpansion') return <GrazeHero/>;
  if(type==='estee') return <figure className="esteeHeroMockup"><img loading="eager" decoding="async" src={assetUrl('project-media/estee-home-mockup.png')} alt="Double Wear discovery experience shown on a laptop"/></figure>;
  return <EsteeVisual/>;
}

function SchedulerSandbox(){
  const [mode,setMode]=useState('available');
  const [view,setView]=useState('mine');
  const [cells,setCells]=useState(()=>Array.from({length:35},(_,i)=>({
    status:i%7===0?'available':i%11===0?'maybe':'',
    available:[1,2,3,0,2][i%5],
    maybe:i%3===0?1:0,
    unavailable:i%4===0?1:0,
    note:i===8?'class until 10:30':''
  })));
  const [dragging,setDragging]=useState(false);
  const draggingRef=useRef(false);
  const dragAction=useRef('paint');
  const visitedSlots=useRef(new Set());
  const [copyState,setCopyState]=useState('');
  const [venues,setVenues]=useState([{name:'MSU Library',votes:2},{name:'Minskoff Pavilion',votes:1}]);
  const [venue,setVenue]=useState('MSU Library');
  const [newVenue,setNewVenue]=useState('');
  const [chat,setChat]=useState(['Maya: Tuesday morning works for me.']);
  const [chatText,setChatText]=useState('');
  const [shareOpen,setShareOpen]=useState(false);
  const [toast,setToast]=useState('');
  const toastTimer=useRef(null);
  const flash=message=>{setToast(message);if(toastTimer.current)window.clearTimeout(toastTimer.current);toastTimer.current=window.setTimeout(()=>setToast(''),1600)};
  useEffect(()=>()=>{if(toastTimer.current)window.clearTimeout(toastTimer.current)},[]);
  const best=useMemo(()=>{
    let bestI=0;
    for(let i=1;i<cells.length;i++){
      const a=cells[i],b=cells[bestI];
      if(a.available>b.available ||
        (a.available===b.available && a.unavailable<b.unavailable) ||
        (a.available===b.available && a.unavailable===b.unavailable && i<bestI)) bestI=i;
    }
    return {day:days[bestI%5],time:times[Math.floor(bestI/5)]};
  },[cells]);
  const paint=(i,action=dragAction.current)=>{
    if(view==='heatmap' || visitedSlots.current.has(i))return;
    visitedSlots.current.add(i);
    setCells(a=>a.map((c,j)=>j===i?{...c,status:action==='erase'?'':mode}:c));
  };
  const endDrag=()=>{draggingRef.current=false;setDragging(false);visitedSlots.current.clear();document.body.classList.remove('is-grid-dragging')};
  const beginDrag=(i,e)=>{
    if(view==='heatmap' || (e.pointerType==='mouse' && e.button!==0))return;
    e.preventDefault();
    document.body.classList.add('is-grid-dragging');
    const shouldErase=cells[i]?.status===mode;
    dragAction.current=shouldErase?'erase':'paint';
    visitedSlots.current.clear();
    draggingRef.current=true;
    setDragging(true);
    paint(i,dragAction.current);
  };
  useEffect(()=>{
    const move=(e)=>{
      if(!draggingRef.current || view==='heatmap')return;
      const el=document.elementFromPoint(e.clientX,e.clientY);
      const slot=el?.closest?.('[data-slot-index]');
      if(!slot)return;
      const i=Number(slot.getAttribute('data-slot-index'));
      if(Number.isFinite(i))paint(i,dragAction.current);
    };
    const up=()=>{if(draggingRef.current)endDrag()};
    window.addEventListener('pointermove',move,{passive:false});
    window.addEventListener('pointerup',up);
    window.addEventListener('pointercancel',up);
    return ()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up)};
  },[view,mode]);
  const quick=type=>{setCells(prev=>prev.map((c,i)=>{
    const row=Math.floor(i/5);
    if(type==='clear')return {...c,status:''};
    if(type==='all')return {...c,status:'available'};
    if(type==='evenings')return {...c,status:row>=5?'available':''};
    return {...c,status:row<=5?'available':''};
  }));flash(type==='all'?'Filled all slots as available':type==='evenings'?'Filled evening availability':type==='clear'?'Cleared your availability':'Filled weekdays 9–5')};
  const copyText=async(label,text)=>{try{await navigator.clipboard.writeText(text);setCopyState(label);flash(label==='link'?'Invite link copied':label==='discord'?'Discord copy ready':'Email copy ready');window.setTimeout(()=>setCopyState(''),1400)}catch{setCopyState('');flash('Clipboard unavailable')}};
  const exportCalendar=()=>{const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Neha Portfolio//Scheduler Demo//EN','BEGIN:VEVENT','SUMMARY:Design Sync','LOCATION:Minskoff Pavilion - Room 240','DTSTART:20260915T103000','DTEND:20260915T110000','END:VEVENT','END:VCALENDAR'].join('\r\n');const blob=new Blob([body],{type:'text/calendar'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='design-sync.ics';a.click();URL.revokeObjectURL(url);flash('Calendar exported')};
  const addVenue=()=>{const v=newVenue.trim();if(!v)return;setVenues(x=>[...x,{name:v,votes:0}]);setNewVenue('');flash(`Added venue: ${v}`)};
  const sendChat=()=>{const value=chatText.trim();if(!value)return;setChat(c=>[...c,`Neha: ${value}`]);setChatText('');flash('Message sent')};
  const toggleNote=i=>{const hadNote=Boolean(cells[i]?.note);setCells(a=>a.map((x,j)=>j===i?{...x,note:x.note?'':'Class / hold'}:x));flash(hadNote?'Note removed':'Note added')};
  return <div className="schedulerSandbox">
    <div className="eventHero"><div><h2>Design Sync</h2><p>Sep 15-19 · 9:00 AM-12:00 PM</p><span className="locationPill">Minskoff Pavilion · Room 240</span></div><div className="eventStats"><span>2 days left</span><strong>3 participants</strong></div></div>
    <div className="quickRow"><span>Quick fill:</span><button onClick={()=>quick('all')}>Free all slots</button><button onClick={()=>quick('weekdays')}>Weekdays 9-5</button><button onClick={()=>quick('evenings')}>Evenings</button><button onClick={()=>quick('clear')}>Clear all</button></div>
    <div className="viewRow"><div><button className={view==='mine'?'active':''} onClick={()=>setView('mine')}>My Availability</button><button className={view==='heatmap'?'active':''} onClick={()=>setView('heatmap')}>Group Heatmap</button></div>{view==='mine'&&<div className="modeRow">{['available','maybe','unavailable'].map(m=><button className={mode===m?'active':''} key={m} onClick={()=>setMode(m)}>{m[0].toUpperCase()+m.slice(1)}</button>)}</div>}</div>
    <div className="schedulerActionRow"><button onClick={()=>{setShareOpen(v=>!v);copyText('link','#projects/scheduler')}}>{copyState==='link'?'Copied':'Share link'}</button><button onClick={()=>copyText('discord','Design Sync · Sep 15-19 · Add your availability: #projects/scheduler')}>{copyState==='discord'?'Copied':'Copy for Discord'}</button><button onClick={()=>copyText('email','Design Sync: please add your availability: #projects/scheduler')}>{copyState==='email'?'Copied':'Copy for Email'}</button><button onClick={exportCalendar}>Export calendar</button><button onClick={()=>quick('clear')}>Clear My Availability</button></div>
    <div className="schedulerMicroRow"><span className="microPill activeMode">Mode: {view==='mine'?mode:'heatmap'}</span><span className="microPill">Best slot recalculates live</span>{dragging&&<span className="microPill accent">Painting…</span>}</div>
    {shareOpen&&<div className="shareBox"><strong>Invite link</strong><code>#projects/scheduler</code></div>}
    {toast&&<div className="sandboxToast" role="status">{toast}</div>}
    <div className="bestMeet"><div><span>Best Time to Meet</span><strong>{best.day} · {best.time}-{times[Math.min(times.length-1,times.indexOf(best.time)+1)]}</strong></div><p>Highest available count, then fewest unavailable responses, then earliest tied slot.</p></div>
    <div className="schedulerBody"><div className="fullCalendar"><p className="gridHint">Click or drag to apply a status. Drag the same status across filled cells again to clear them. Right-click a cell to add a note.</p><div className="calendarHead"><span></span>{days.map(d=><span key={d}>{d}</span>)}</div><div className="calendarGrid interactiveGrid">{times.map((t,r)=><React.Fragment key={t}><span className="timeLabel">{t}</span>{days.map((d,c)=>{const i=r*5+c;const cell=cells[i];const cls=view==='heatmap'?`heat heat-${Math.min(3,cell.available)}`:`status-${cell.status||'empty'}`;return <button key={d} data-slot-index={i} title={`${cell.note?cell.note+' · ':''}Available: ${cell.available} · Maybe: ${cell.maybe} · Unavailable: ${cell.unavailable}`} aria-pressed={view==='mine'?cell.status===mode:undefined} className={`slot ${cls} ${cell.note?'hasNote':''}`} onPointerDown={e=>beginDrag(i,e)} onContextMenu={e=>{e.preventDefault();toggleNote(i)}}/>})}</React.Fragment>)}</div></div>
      <aside className="schedulerAside"><div className="sideCard"><h3>Participants</h3><p><span className="responded"></span> Neha · Responded</p><p><span className="responded"></span> Maya · Responded</p><p><span className="pending"></span> Alex · Pending</p></div><div className="sideCard"><h3>Venue Voting</h3>{venues.map(v=><button className={venue===v.name?'venue active':'venue'} key={v.name} onClick={()=>{setVenue(v.name);flash(`${v.name} selected`)}}><span>{v.name}</span><strong>{v.votes+(venue===v.name?1:0)} votes</strong></button>)}<div className="venueAdd"><input value={newVenue} onChange={e=>setNewVenue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addVenue()} placeholder="Add venue…"/><button onClick={addVenue}>Add</button></div></div><div className="sideCard"><h3>Event Chat</h3><div className="eventChat">{chat.map((m,i)=><p key={i}>{m}</p>)}</div><div className="inlineComposer"><input value={chatText} onChange={e=>setChatText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()} placeholder="Drop a quick note…"/><button onClick={sendChat}>Send</button></div></div></aside>
    </div>
  </div>
}
function ChatSandbox(){
 type ChatMessage={system?:string;who?:string;text?:string;reaction?:string};
 const seed:ChatMessage[]=[{system:'Neha joined the room'},{who:'Maya',text:'did everyone push?'},{who:'me',text:'yep just finished the socket changes'}];
 const [msgs,setMsgs]=useState(seed); const [text,setText]=useState(''); const [typing,setTyping]=useState(false); const [pickerFor,setPickerFor]=useState(null); const typingTimer=useRef(null);
 const tapbacks=[['❤️','Love'],['👍','Like'],['👎','Dislike'],['😂','Laugh'],['‼️','Emphasize'],['❓','Question']];
 const add=()=>{if(!text.trim())return;setMsgs(m=>[...m,{who:'me',text:text.trim()}]);setText('');setPickerFor(null)};
 const react=(i,r)=>{setMsgs(m=>m.map((x,j)=>j===i?{...x,reaction:x.reaction===r?'':r}:x));setPickerFor(null)};
 return <div className="chatSandbox" onClick={()=>pickerFor!==null&&setPickerFor(null)}><div className="chatTitle"><h2>iMessage-style group chat</h2><span>Room: main</span></div><div className="chatWindow">{msgs.map((m,i)=>m.system?<div className="systemMsg" key={i}>{m.system}</div>:<div className={m.who==='me'?'chatLine mine':'chatLine theirs'} key={i}><div className="chatBubbleWrap"><button className="chatBubble" onDoubleClick={e=>{e.stopPropagation();setPickerFor(current=>current===i?null:i)}} aria-label={`${m.text}. Double-click for reactions.`}>{m.text}{m.reaction&&<span className="reaction">{m.reaction}</span>}</button>{pickerFor===i&&<div className="tapbackPicker" role="menu" aria-label="Choose a message reaction" onClick={e=>e.stopPropagation()}>{tapbacks.map(([symbol,label])=><button type="button" role="menuitem" key={label} aria-label={label} title={label} onClick={()=>react(i,symbol)}>{symbol}</button>)}</div>}</div></div>)}{typing&&<div className="typingBubble"><i></i><i></i><i></i></div>}</div><div className="chatEntry"><input value={text} onChange={e=>{setText(e.target.value);setTyping(true);if(typingTimer.current)window.clearTimeout(typingTimer.current);typingTimer.current=window.setTimeout(()=>setTyping(false),900)}} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Type a message..."/><button onClick={add}>Send</button><button onClick={()=>{setMsgs(m=>[...m,{system:'Neha left the room'}]);setPickerFor(null)}}>Leave</button></div><p className="sandboxNote">Double-click any message to open the Tapback picker. The demo also tracks typing and join/leave state so those behaviors are part of the interaction, not just the styling.</p></div>
}

function CaseDecisionNotes({id}){
 const notes={
  fcvf:[['Constraint','The Excel scoring logic had to carry over without showing users information that could influence their answers.'],['Decision','Use a multi-page flow so users can focus on the current question instead of scanning the full assessment.'],['Evidence','Four interviews comparing two interface directions showed that the long page was harder to work through and that the live score could influence responses.']],
  finsimple:[['Constraint','The feature lived inside an existing financial platform, so it had to fit established UI, data contracts, and release environments.'],['Decision','Treat AEM, Salesforce, QA, and production validation as connected parts of shipping the feature.'],['Tradeoff','Build inside the existing platform instead of creating a cleaner standalone experience that would not fit the real product.']],
  accenture:[['Constraint','Trainer matching depended on region, language, expertise, capacity, time zones, and information spread across several tools.'],['Decision','Turn repeated coordinator checks into explicit rules while keeping review for exceptions.'],['Evidence','Testing produced a proposed 10:30 PM local assignment, which led to working-hours and time-zone checks.']],
  scheduler:[['Problem','Availability grids show when people are free, but the group still has to choose a time, place, and next step.'],['Decision','Keep availability, uncertainty, venue voting, and lightweight chat in the same workflow.'],['Technical','Flask, MySQL, and Socket.IO handled saved scheduling state and real-time collaboration in the original build.']],
  chat:[['Assignment','Build a chat room where people could see messages and when someone entered or left.'],['Product direction','I recreated iMessage so I could study the interaction details behind a familiar messaging product, then added typing and Tapback states beyond the base assignment.'],['Technical','HTML, CSS, JavaScript, and Socket.IO handled the interface and synchronized room events across clients.']],
  estee:[['Problem','Online beauty shoppers need enough product and shade context to decide whether a foundation is worth buying.'],['Decision','Keep product education, shade exploration, and the path to purchase in one branded experience.'],['Outcome','The concept finished as a Top 5 challenge finalist.']]
 }[id];
 if(!notes)return null;
 if(id==='accenture')return <CaseSection title="What I automated and what stayed human" className="accentureDecisionBoundary"><div className="accentureBoundaryMap"><header><span>THE OPERATING PRINCIPLE</span><strong>Automate the repeatable checks. Route judgment calls to a coordinator.</strong></header><div className="accentureBoundaryFlow"><article><b>01</b><span>REQUEST ARRIVES</span><strong>Structure the intake</strong><p>Required fields and matching criteria</p></article><i aria-hidden="true">→</i><article><b>02</b><span>RULES RUN</span><strong>Validate the match</strong><p>Expertise, capacity, availability, time zone</p></article><i aria-hidden="true">→</i><article className="isGate"><b>!</b><span>EXCEPTION GATE</span><strong>Is context or information missing?</strong><p>Warnings and conflicts stop here</p></article><i aria-hidden="true">→</i><article className="isHuman"><b>03</b><span>HUMAN DECISION</span><strong>Resolve and approve</strong><p>Local context and final judgment</p></article></div><footer><div><span>WHY THE GATE MATTERS</span><p>Region, language, capacity, time zones, and incomplete requests created cases that rules alone could not safely resolve.</p></div><div className="accentureBoundaryProof"><b>10:30 PM</b><p>A proposed match passed expertise and availability checks but failed the trainer’s local working-hours test.</p></div></footer></div></CaseSection>;
 return <CaseSection title="Decisions and tradeoffs"><div className="decisionNoteGrid">{notes.map(([k,v])=><div key={k}><span>{k}</span><p>{v}</p></div>)}</div></CaseSection>
}

const caseCompanyInfo={
  kohler:{name:'Kohler Co. · CSE 498',logo:'company-logos/kohler.svg'},
  fcvf:{name:'Ford Motor Company',logo:'company-logos/ford.png'},
  finsimple:{name:'Ford Credit',logo:'company-logos/ford-credit-v31.png'},
  accenture:{name:'Accenture',logo:'company-logos/accenture-v31.png'},
  estee:{name:'Estée Lauder × Kode With Klossy',logo:''},
  commute:{name:'Personal iOS app',logo:''},
  bookclub:{name:'Independent product · designed, built, and deployed',logo:''},
  marketExpansion:{name:'Graze Craze · Spectrum Consulting Group',logo:'project-media/graze/logo.png'},
  scheduler:{name:'Michigan State University · CSE 477',logo:''},
  chat:{name:'Michigan State University · CSE 477',logo:''}
};
function CaseCompanyBar({id,fallback=''}){
  const info=caseCompanyInfo[id]||{name:fallback,logo:''};
  if(!info.name)return null;
  return <div className="caseCompanyBar"><span>{info.name}</span></div>
}
function ExpandableImage({src,alt,label='',className='',onExpand}){
  const resolvedSrc=assetUrl(src);
  return <button type="button" className={`expandableImage ${className}`} onClick={()=>onExpand?.({src:resolvedSrc,alt})} aria-label={`Expand ${label||alt}`}>
    <img loading={src.includes('finsimple-dummy')?'eager':'lazy'} decoding="async" src={resolvedSrc} alt={alt}/>{label&&<span>{label}</span>}<i aria-hidden="true">↗</i>
  </button>
}
function ImageLightbox({image,onClose}){
  useEffect(()=>{if(!image)return;const fn=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[image,onClose]);
  if(!image)return null;
  return <div className="imageLightbox" role="dialog" aria-modal="true" aria-label={image.alt||'Expanded project image'} onClick={onClose}><button className="lightboxClose" type="button" onClick={onClose} aria-label="Close image">×</button><img src={image.src} alt={image.alt||''} onClick={e=>e.stopPropagation()}/></div>
}
const toolLogoMap={
  openai:{name:'OpenAI',mark:'AI',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg','https://cdn.simpleicons.org/openai/3F3D3A']},
  excel:{name:'Microsoft Excel',mark:'XL',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftexcel.svg','https://cdn.simpleicons.org/microsoftexcel/217346']},
  powerpoint:{name:'Microsoft PowerPoint',mark:'PP',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftpowerpoint.svg','https://cdn.simpleicons.org/microsoftpowerpoint/B7472A']},
  powerbi:{name:'Power BI',mark:'BI',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/powerbi.svg','https://cdn.simpleicons.org/powerbi/F2C811']},
  salesforce:{name:'Salesforce',mark:'SF',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/salesforce.svg','https://cdn.simpleicons.org/salesforce/00A1E0']},
  adobe:{name:'Adobe Experience Manager',mark:'Ae',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobe.svg','https://cdn.simpleicons.org/adobe/FF0000']},
  postman:{name:'Postman',mark:'PM',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/postman.svg','https://cdn.simpleicons.org/postman/FF6C37']},
  graphql:{name:'GraphQL',mark:'GQ',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/graphql.svg','https://cdn.simpleicons.org/graphql/E10098']},
  figma:{name:'Figma',mark:'FG',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/figma.svg','https://cdn.simpleicons.org/figma/F24E1E']},
  html:{name:'HTML5',mark:'H5',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/html5.svg','https://cdn.simpleicons.org/html5/E34F26']},
  css:{name:'CSS3',mark:'CSS',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/css3.svg','https://cdn.simpleicons.org/css3/1572B6']},
  javascript:{name:'JavaScript',mark:'JS',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/javascript.svg','https://cdn.simpleicons.org/javascript/F7DF1E']},
  typescript:{name:'TypeScript',mark:'TS',urls:['tool-logos/typescript.svg','https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/typescript.svg']},
  react:{name:'React',mark:'R',urls:['tool-logos/react.svg','https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/react.svg']},
  node:{name:'Node.js',mark:'Node',urls:['tool-logos/nodedotjs.svg']},
  azure:{name:'Microsoft Azure',mark:'Azure',urls:['tool-logos/microsoftazure.svg']},
  copilotstudio:{name:'Microsoft Copilot Studio',mark:'Copilot',urls:['tool-logos/copilot-studio.svg']},
  aifoundry:{name:'Azure AI Foundry',mark:'Foundry',urls:['tool-logos/azure-ai-foundry.svg']},
  databricks:{name:'Databricks',mark:'DB',urls:['tool-logos/databricks.svg']},
  sap:{name:'SAP ECC',mark:'SAP',urls:['tool-logos/sap.svg']},
  inriver:{name:'Inriver PIM',mark:'PIM',urls:['tool-logos/inriver.webp']},
  translator:{name:'Azure AI Translator',mark:'Translate',urls:['tool-logos/azure-translator.svg']},
  mui:{name:'Material UI',mark:'MUI',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mui.svg','https://cdn.simpleicons.org/mui/007FFF']},
  kotlin:{name:'Kotlin',mark:'K',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/kotlin.svg','https://cdn.simpleicons.org/kotlin/7F52FF']},
  spring:{name:'Spring',mark:'SP',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/spring.svg','https://cdn.simpleicons.org/spring/6DB33F']},
  github:{name:'GitHub Projects',mark:'GH',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg','https://cdn.simpleicons.org/github/181717']},
  googlecloud:{name:'Google Cloud / Pub/Sub',mark:'GCP',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecloud.svg','https://cdn.simpleicons.org/googlecloud/4285F4']},
  ucl:{name:'Ford UCL component library',mark:'UCL',urls:['company-logos/ford.png']},
  rally:{name:'Broadcom Rally',mark:'Rally',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/broadcom.svg']},
  graphapi:{name:'Microsoft Graph API validation',mark:'Graph API',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoft.svg']},
  flask:{name:'Flask',mark:'FL',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/flask.svg','https://cdn.simpleicons.org/flask/3F3D3A']},
  mysql:{name:'MySQL',mark:'MY',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mysql.svg','https://cdn.simpleicons.org/mysql/4479A1']},
  socketio:{name:'Socket.IO',mark:'IO',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/socketdotio.svg','https://cdn.simpleicons.org/socketdotio/3F3D3A']},
  docker:{name:'Docker',mark:'DK',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/docker.svg','https://cdn.simpleicons.org/docker/2496ED']},
  python:{name:'Python',mark:'PY',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg','https://cdn.simpleicons.org/python/3776AB']},
  swift:{name:'Swift',mark:'Swift',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/swift.svg','https://cdn.simpleicons.org/swift/F05138']},
  appleplatforms:{name:'Apple frameworks: SwiftUI, HealthKit, Core Location, MapKit, EventKit, WeatherKit, AlarmKit',mark:'Apple',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg']},
  gtfs:{name:'GTFS-Realtime / 511 transit data',mark:'511',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg']},
  googlemaps:{name:'Google Maps Platform / Routes',mark:'Maps',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlemaps.svg','https://cdn.simpleicons.org/googlemaps/4285F4']},
  gmail:{name:'Gmail integration',mark:'Gmail',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/gmail.svg','https://cdn.simpleicons.org/gmail/EA4335']},
  googlecalendar:{name:'Google Calendar integration',mark:'Calendar',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecalendar.svg','https://cdn.simpleicons.org/googlecalendar/4285F4']},
  slack:{name:'Slack',mark:'Slack',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/slack.svg','https://cdn.simpleicons.org/slack/4A154B']},
  googlesheets:{name:'Google Sheets',mark:'Sheets',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlesheets.svg','https://cdn.simpleicons.org/googlesheets/34A853']},
  googleslides:{name:'Google Slides',mark:'Slides',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googleslides.svg','https://cdn.simpleicons.org/googleslides/FBBC04']},
  cloudflare:{name:'Cloudflare Workers',mark:'CF',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cloudflare.svg','https://cdn.simpleicons.org/cloudflare/F38020']},
  cloudflarepages:{name:'Cloudflare Pages',mark:'CF',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cloudflarepages.svg','https://cdn.simpleicons.org/cloudflarepages/F38020','https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cloudflare.svg']},
  d1:{name:'Cloudflare D1',mark:'CF',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cloudflare.svg','https://cdn.simpleicons.org/cloudflare/F38020']},
  r2:{name:'Cloudflare R2',mark:'CF',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cloudflare.svg','https://cdn.simpleicons.org/cloudflare/F38020']},
  vite:{name:'Vite',mark:'Vite',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vite.svg','https://cdn.simpleicons.org/vite/646CFF']},
  nyt:{name:'The New York Times Books',mark:'NYT',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/newyorktimes.svg','https://cdn.simpleicons.org/newyorktimes/000000']},
  googlebooks:{name:'Google Books',mark:'G',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg','https://cdn.simpleicons.org/google/4285F4']},
  openlibrary:{name:'Open Library',mark:'OL',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/internetarchive.svg','https://cdn.simpleicons.org/internetarchive/666666']},
  googlevision:{name:'Google Vision OCR',mark:'GCP',urls:['https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecloud.svg','https://cdn.simpleicons.org/googlecloud/4285F4']}
};
const toolSets={
  kohler:['azure','copilotstudio','aifoundry','databricks','react','typescript','node','sap','inriver','translator','github'],
  fcvf:['excel','figma','html','css','javascript','typescript','react','mui','kotlin','spring','github'],
  accenture:['salesforce','slack','googlecalendar','googlesheets','googleslides','openai','powerbi'],
  finsimple:['adobe','ucl','salesforce','graphapi','graphql','postman','googlecloud','rally','github'],
  scheduler:['python','flask','mysql','socketio','html','css','javascript','docker','googlecloud','github'],
  chat:['javascript','html','css','socketio','github'],
  estee:['html','css','javascript','figma','github'],
  commute:['swift','appleplatforms','googlemaps','gtfs','figma','react','typescript','vite','github'],
  bookclub:['react','typescript','vite','figma','cloudflarepages','cloudflare','d1','r2','googlecalendar','nyt','googlebooks','openlibrary','openai','googlevision','github'],
  marketExpansion:['excel','powerpoint']
};

function ToolLogo({tool}){
 const safeTool=tool||{name:'Tool',mark:'Tool',urls:[],textOnly:true};
 const [attempt,setAttempt]=useState(0);
 const failed=safeTool.textOnly||attempt>=safeTool.urls.length;
 useEffect(()=>setAttempt(0),[safeTool.name]);
 return <span className={`toolLogoWrap ${failed?'fallback':''} ${safeTool.textOnly?'textOnly':''}`} data-tool={safeTool.name} tabIndex={0} aria-label={safeTool.name}>{failed?<span className="toolLogoFallback" aria-hidden="true">{safeTool.mark}</span>:<img loading="lazy" decoding="async" src={assetUrl(safeTool.urls[attempt])} alt="" referrerPolicy="no-referrer" onError={()=>setAttempt(v=>v+1)}/>}<span className="toolLogoLabel" aria-hidden="true">{safeTool.name}</span></span>
}
function ToolLogoStrip({id}){const items=toolSets[id]||[];if(!items.length)return null;const description=id==='fcvf'?'Tools and technologies used across the FCVF build.':id==='finsimple'?'Tools and platform technologies used in the FinSimple work.':id==='bookclub'?'Product, platform, data, and connected services.':id==='kohler'?'Tools and systems used across the Kohler project.':'Tools used in this project.';return <section className={`toolLogoSection ${id==='bookclub'?'bookclubToolLogoSection':''}`}><div className="toolLogoHeading"><h2>Tech stack</h2><p>{description}</p></div><div className="toolLogoRow">{items.map(k=><ToolLogo key={k} tool={toolLogoMap[k]}/>)}</div></section>}


function CaseStudy({id,onBack}){
 const p=projects.find(x=>x.id===id);
 const [lightbox,setLightbox]=useState(null);
 if(!p)return null;
 const openClickedImage=(e)=>{const img=e.target instanceof HTMLImageElement?e.target:null;if(!img||img.closest('.caseCompanyBar')||img.closest('.toolLogoSection')||img.closest('.kohlerStory')||img.closest('.caseHeroLogoWrap')||img.classList.contains('companyLogo'))return;setLightbox({src:img.currentSrc||img.src,alt:img.alt||'Project image'})};
 return <main className={`casePage case-${id}`} onClick={openClickedImage}><AuraField tone={id}/><button className="backBtn" onClick={onBack}>← Projects</button><section className="caseLead"><header className="caseHeader"><CaseCompanyBar id={id} fallback={p.company}/>{id==='finsimple'&&<img className="finsimpleHeaderLogo" src={assetUrl('company-logos/ford-credit-v31.png')} alt="Ford Credit"/>}<h1>{p.title}</h1><div className="caseIntro">{p.summary}</div>{id!=='commute'&&id!=='finsimple'&&<div className="ownershipLine"><span>{ownership[id]}</span></div>}{id==='bookclub'&&<a className="bookclubLiveLink" href={BOOKCLUB_LIVE_URL} target="_blank" rel="noreferrer" aria-label="Open the live Bookclub app in a new tab">Open live app ↗</a>}{id!=='commute'&&metrics[id]&&<MetricStrip items={metrics[id]}/>}</header><div className="caseHeroMedia casePreviewHero"><ProjectVisual type={p.media}/></div></section>
 <ToolLogoStrip id={id}/>
 {id==='fcvf'&&<section className="fcvfRoadStage" aria-label="Ford Mustang scroll animation"><div className="fcvfRoadCopy"></div><FCVFMustang/></section>}
 {id==='commute'&&<><section className="sandboxSection commuteShowcase"><CommuteSandbox/></section><CaseSection title="Users"><p><strong>First user:</strong> me. <strong>Broader user:</strong> anyone with a busy morning routine who is tired of checking Maps, transit, and the clock every day just to figure out when to get up and when to leave.</p></CaseSection><CaseSection title="Why I built it"><p>I got tired of doing the same morning calculation over and over again. Commute works backward from where I need to be, then combines my routine with live transit, traffic, walking time, and missed-departure risk to tell me when to wake up and when to leave.</p><p>I made it an iOS app because my phone is the first thing I see in the morning. Once the app calculates the plan, it can turn that recommendation directly into my wake-up alarm instead of giving me another time to remember.</p></CaseSection><section className="caseSection caseNarrative"><h2>Work backward from the arrival time.</h2><div><div className="decisionSteps"><div><span>1</span><strong>Set the arrival target</strong><p>Calendar commitment + chosen arrival buffer.</p></div><div><span>2</span><strong>Compare routes</strong><p>Transit + walking + transfers + cost of missing a departure.</p></div><div><span>3</span><strong>Check current conditions</strong><p>Live arrivals + traffic + service alerts + data freshness.</p></div><div><span>4</span><strong>Account for the routine</strong><p>Saved morning steps + observed walking behavior.</p></div><div><span>5</span><strong>Set the plan</strong><p>Wake time + latest safe departure + recommended route.</p></div></div></div></section><section className="caseSection technicalNote"><h2>Native iOS architecture + APIs</h2><div><p className="technicalArchitectureCopy">SwiftUI drives the interface while API clients bring route, transit, traffic, weather, calendar, and HealthKit data into the same recommendation model. The decision layer works backward from the arrival deadline, finds the latest safe departure for each route, accounts for missed-departure and stale-data risk, then passes the selected wake and leave times to alarms and notifications.</p><div className="dataSourceList"><div><strong>Google Routes API</strong><span>walking time and route geometry for first- and last-mile estimates</span></div><div><strong>511 SF Bay GTFS-Realtime APIs</strong><span>BART and AC Transit trip updates, vehicle positions, and service alerts</span></div><div><strong>511 traffic data</strong><span>road incidents and Bay Bridge conditions that change bus or driving reliability</span></div><div><strong>HealthKit framework</strong><span>Apple Health Walking Speed samples used to personalize walking duration</span></div><div><strong>EventKit / Calendar</strong><span>event time and destination used to create the morning plan</span></div><div><strong>Core Location</strong><span>current location during an active commute for door-to-stop estimates</span></div><div><strong>WeatherKit</strong><span>weather context used to adjust walking and road assumptions</span></div><div><strong>AlarmKit + UserNotifications</strong><span>turn the calculated wake and leave times into alarms and plan-change alerts</span></div><div><strong>Observed commute history</strong><span>route-specific walking and prediction error used to improve future estimates</span></div></div></div></section><section className="caseSection decisionEditorial"><h2>Choices I made</h2><div className="principleList"><div><strong>Start from when I need to arrive.</strong><span>The commitment sets the deadline for everything before it.</span></div><div><strong>Use Maps for routing instead of rebuilding it.</strong><span>The product focuses on the morning decision, not turn-by-turn navigation.</span></div><div><strong>Do not reward unnecessary early arrival.</strong><span>Getting somewhere 30 minutes early is not automatically a better plan.</span></div><div><strong>Treat a missed train and missed bus differently.</strong><span>A six-minute train headway and a 30-minute bus headway create different risks.</span></div><div><strong>Lower confidence when live data is stale.</strong><span>A bus position from 20 seconds ago should count more than one from eight minutes ago.</span></div><div><strong>Personalize only where it improves the estimate.</strong><span>Health is optional and improves walking estimates; observed commute history becomes more useful over time.</span></div><div><strong>Notify only when the plan changes.</strong><span>A delay that does not change the wake time, leave time, or route does not need an alert.</span></div></div></section><section className="caseSection scopeLine"><h2>Scope</h2><div><p><strong>V1:</strong> calendar · routine · Health · wake/leave · BART/AC Transit · traffic · alarms</p><p><strong>Later:</strong> recurring commutes, more cities and driving use cases, and deeper reliability learning</p><p><strong>Cut:</strong> social features · generic trip planning · analytics dashboard · navigation replacement</p></div></section><section className="caseSection measureLine"><h2>What would tell me it works</h2><div><p className="metricDefinitionLine"><strong>Arrival error</strong> · predicted vs. observed &nbsp; <strong>Unused buffer</strong> · extra minutes returned &nbsp; <strong>Prediction error</strong> · routine, walking, and route estimates &nbsp; <strong>Interruptions</strong> · how often the app needs attention</p></div></section></>}
 {id==='fcvf'&&<FCVFCase setLightbox={setLightbox}/>}
 {id==='accenture'&&<AccentureCase/>}
 {id==='kohler'&&<KohlerCase/>}
 {id==='scheduler'&&<SchedulerCase/>}
 {id==='finsimpleLegacy'&&<><CaseSection title="Users"><p>Ford Credit customers moving through a financing/account workflow were the primary users; the feature also had to fit the internal systems and teams operating the downstream data flow.</p></CaseSection><CaseSection title="The user problem"><p>Returning customers needed a straightforward way to revisit earlier vehicle estimates while continuing the financing journey. Previous Estimates had to make that history useful without forcing customers to recreate an estimate or learn a separate workflow.</p></CaseSection><CaseSection title="Shipping into a system that already existed"><p>FinSimple was already a deployed financial product with existing customers, shared libraries, data dependencies, and production environments. As the sole intern embedded on the team, I had to fit the feature into the experience customers already knew while respecting the AEM, Salesforce, API, QA, and release constraints behind it.</p></CaseSection><CaseSection title="Previous Estimates"><p>I owned requirements, UI/component development, integration, testing, and coordination across the teams involved in shipping the feature. The feature progressed from synthetic data to an AEM component and then into the customer-facing flow, giving customers one place to review previous estimates and take the next action from the existing product.</p><div className="progression"><ExpandableImage onExpand={setLightbox} src="project-media/finsimple-dummy.png" alt="Dummy data stage" label="Dummy data"/><ExpandableImage onExpand={setLightbox} src="project-media/finsimple-aem.png" alt="AEM component stage" label="AEM component"/><ExpandableImage onExpand={setLightbox} src="project-media/finsimple-live.png" alt="Finished FinSimple stage" label="Customer-facing flow"/></div></CaseSection><CaseSection title="Customer + system flow" className="finsimpleFlowSection"><div className="finsimpleSystemFlow" aria-label="Customer action moving through four layers into Salesforce"><div className="systemDepthLabel" aria-hidden="true"><span>Customer-facing</span><i></i><span>System of record</span></div><div className="systemFlowTrack"><article><header><span>01</span><small>INTENT</small></header><h3>Customer</h3><p>Starts a financing or account workflow.</p></article><i aria-hidden="true">↘</i><article><header><span>02</span><small>INTERFACE</small></header><h3>Web experience</h3><p>Collects and displays information.</p></article><i aria-hidden="true">↘</i><article><header><span>03</span><small>SERVICE</small></header><h3>API layer</h3><p>Moves customer and contract data.</p></article><i aria-hidden="true">↘</i><article><header><span>04</span><small>RECORD</small></header><h3>Salesforce</h3><p>Creates and populates the downstream record.</p></article></div><div className="systemFlowPayload"><span>customer context</span><b>travels forward</b><span>durable record</span></div></div></CaseSection><CaseSection title="What shipped"><div className="finalArtifact"><ExpandableImage onExpand={setLightbox} src="project-media/finsimple-live.png" alt="Finished FinSimple Previous Estimates feature" label="Final experience"/><p>A customer-facing Previous Estimates experience shipped inside the existing enterprise product, preserving the platform’s workflow while making past estimates easier to revisit and act on.</p></div></CaseSection></>}
 {id==='chatLegacy'&&<><section className="sandboxSection"><ChatSandbox/></section><CaseSection title="The assignment"><p>For CSE 477, the base assignment was to build a real-time chat room where multiple users could exchange messages and see when someone entered or left. I wanted the result to feel like a product I already understood instead of a generic class demo, so I recreated iMessage on the web.</p></CaseSection><CaseSection title="What I added"><p>I treated the assignment requirements as the starting state. Beyond messages and join/leave presence, I added typing state and Tapback reactions, then paid attention to the smaller interaction rules that make iMessage feel familiar: bubble alignment, temporary states, reaction placement, and keeping the same message state synchronized across clients.</p><div className="factGrid"><Fact title="Messages">Socket.IO broadcasts new messages so every client in the room sees the same conversation.</Fact><Fact title="Presence">Join and leave events update the room without pretending those events are normal messages.</Fact><Fact title="Typing">Typing is temporary state with a timeout, so it disappears instead of becoming persisted chat history.</Fact><Fact title="Tapbacks">Double-clicking opens a reaction picker; the selected reaction updates the existing message state rather than adding a second message.</Fact></div></CaseSection><CaseSection title="Build"><p>I built the interface with HTML, CSS, and JavaScript and used Socket.IO for real-time room events. The interesting part was learning the design logic behind a familiar product and then turning those states into code, not just making blue and gray message bubbles that looked like iMessage.</p></CaseSection></>}
 {id==='esteeLegacy'&&<><CaseSection title="Users"><p>Online beauty shoppers exploring Double Wear who need enough product context and confidence to decide whether the line is right for them, then a simple path to purchase.</p></CaseSection><CaseSection title="The challenge"><p>For the Kode With Klossy x Estée Lauder challenge, I worked on the product concept, UX/UI, and frontend for a Double Wear discovery experience. I treated it as more than a storefront. The goal was to make product research feel like part of the Estée Lauder brand experience, then carry that interest all the way to purchase.</p></CaseSection><CaseSection title="Product direction"><div className="factGrid"><Fact title="Feel immediately on-brand">I kept the experience elegant and minimal, using familiar Estée Lauder colors, typography, imagery, and navigation patterns so the site felt connected to the brand.</Fact><Fact title="Give shoppers a reason to keep exploring">An interactive question and concise benefit content turned product education into something more active than a static catalog page.</Fact><Fact title="Put the research in one place">The experience brought Double Wear benefits, product-line context, brand story, and purchase options into one guided flow.</Fact><Fact title="Make the next step easy">The purchase experience linked shoppers to eight established retailers instead of making them restart the search elsewhere.</Fact></div></CaseSection><CaseSection title="The journey I designed"><div className="esteeJourney"><div><span>01</span><strong>Draw the shopper in</strong><p>Lead with recognizable Double Wear imagery and a familiar brand shell.</p></div><div><span>02</span><strong>Invite interaction</strong><p>Use a question and benefit-led content to make discovery feel personal and scannable.</p></div><div><span>03</span><strong>Build product understanding</strong><p>Show the broader Double Wear line, key benefits, and brand context without turning the page into a dense product database.</p></div><div><span>04</span><strong>Close the loop</strong><p>Move from exploration to purchase through direct retailer options.</p></div></div></CaseSection><CaseSection title="What I made"><p>I built the experience around large product imagery, a benefits carousel, product exploration, and a purchase page while keeping the visual system cohesive across screens.</p><EsteeVisual/></CaseSection><CaseSection title="Responsive design"><p>The site was image-heavy, so responsive behavior became a real implementation problem rather than a final polish step. I reused responsive patterns across the visual elements and adjusted the layouts so the product story still held together as the viewport got smaller.</p></CaseSection><CaseSection title="Outcome"><p>The project finished as a Top 5 challenge finalist, and I presented the concept to Estée Lauder C-suite leadership.</p></CaseSection></>}
 {id==='finsimple'&&<FinSimpleCase setLightbox={setLightbox}/>}
 {id==='chat'&&<ChatCase/>}
 {id==='estee'&&<EsteeCase/>}
 {id==='bookclub'&&<BookclubCase/>}
 {id==='marketExpansion'&&<MarketExpansionCase/>}
 {id!=='commute'&&!['fcvf','chat','estee','bookclub','marketExpansion','finsimple','scheduler'].includes(id)&&<CaseDecisionNotes id={id}/>}<ImageLightbox image={lightbox} onClose={()=>setLightbox(null)}/></main>
}

function CaseSection({title,children,className=''}){return <section className={`caseSection ${className}`}><h2>{title}</h2><div className="caseSectionBody">{children}</div></section>}


function SchedulerCase(){return <div className="schedulerStory">
  <section className="sandboxSection schedulerShowcase"><SchedulerSandbox/></section>
  <section className="schedulerProblemStage"><div><h2>A heatmap did not finish the plan.</h2><p>Students could mark when they were free, but tentative availability was flattened into yes or no. Even after finding overlap, the group still had to choose a time, place, and next step somewhere else.</p></div><div className="schedulerUncertainty" aria-label="A schedule preserving available, maybe, and unavailable states"><header><strong>Design Sync</strong><span>3 responses</span></header><div className="schedulerMiniGrid"><span></span><b>Tue</b><b>Wed</b><b>Thu</b><span>10:00</span><i className="yes"></i><i className="maybe"></i><i></i><span>10:30</span><i className="best"></i><i className="yes"></i><i className="no"></i><span>11:00</span><i className="maybe"></i><i></i><i className="yes"></i></div><footer><span><i className="yes"></i>Available</span><span><i className="maybe"></i>Maybe</span><span><i className="no"></i>Unavailable</span></footer></div></section>
  <CaseSection title="What I learned from seven student interviews" className="schedulerResearchSection"><div className="schedulerResearchDesk"><aside className="schedulerInterviewIndex"><strong>7 students</strong><span>One-on-one conversations</span><span>Live task walkthroughs</span><div>{['01','02','03','04','05','06','07'].map(x=><i key={x}>{x}</i>)}</div></aside><div className="schedulerNotebook"><header><strong>Interview synthesis</strong><span>Scheduling a real group project</span></header><div className="schedulerSessionNotes"><article><b>Students wanted a way to say “maybe.”</b><p>Tentative availability was useful information, but the binary grid erased it.</p><span>Seen during availability entry</span></article><article><b>The heatmap did not finish the task.</b><p>Groups opened another chat to interpret the overlap, choose a room, and confirm the plan.</p><span>Seen after comparing schedules</span></article><article><b>Event details split across tools.</b><p>Time, venue, participant status, and notes separated as soon as the group left the grid.</p><span>Seen during follow-through</span></article></div><footer><span>What changed</span><strong>Keep Available, Maybe, and Unavailable separate, then recommend a time and carry that choice into venue and calendar setup.</strong></footer></div></div></CaseSection>
  <CaseSection title="From availability to a confirmed event" className="schedulerDecisionSection"><div className="schedulerDecisionCanvas"><div className="schedulerRecommendationGrid" aria-label="Tuesday 10:30 selected from the group availability grid"><header><span>Group availability</span><strong>3 responses</strong></header><div className="schedulerDecisionDays"><b>Mon</b><b>Tue</b><b>Wed</b></div><div className="schedulerDecisionRows"><span>10:00</span><i></i><i className="warm"></i><i></i><span>10:30</span><i className="warm"></i><i className="chosen">3</i><i className="warm"></i><span>11:00</span><i></i><i className="warm"></i><i></i></div><footer>Highest availability · fewest conflicts</footer></div><div className="schedulerCommitPath" aria-hidden="true"><i></i><span>Choose</span></div><article className="schedulerCalendarInvite"><header><time><b>16</b><span>SEP</span></time><div><span>Tuesday</span><strong>Design Sync</strong></div></header><dl><div><dt>Time</dt><dd>10:30–11:00 AM</dd></div><div><dt>Place</dt><dd>Minskoff Pavilion</dd></div><div><dt>Going</dt><dd><span className="schedulerAvatars"><i>N</i><i>M</i><i>A</i></span>3 participants</dd></div></dl><strong className="schedulerCalendarAction">Calendar ready</strong></article><p className="schedulerDecisionCaption">The selected time moves forward with the venue, participants, notes, and sharing details.</p></div></CaseSection>
  <CaseSection title="Keeping one event record in sync" className="schedulerSystemSection"><div className="schedulerRecordBlueprint"><article className="schedulerRecordObject"><header><span>Design Sync</span><strong>Event #DS-0916</strong></header><dl><div><dt>Time</dt><dd>Tue · 10:30–11:00</dd><i>live</i></div><div><dt>Participants</dt><dd>Neha · Maya · Alex</dd><i>3/3</i></div><div><dt>Venue</dt><dd>Minskoff Pavilion</dd><i>selected</i></div><div><dt>Group note</dt><dd>Bring the first prototype</dd><i>saved</i></div></dl></article><aside><p><b>Socket.IO</b><span>Keeps active participants and changes synchronized.</span></p><p><b>Flask</b><span>Applies recommendation and event rules.</span></p><p><b>MySQL</b><span>Stores the shared event record.</span></p></aside><footer>Docker and Google Cloud Run supported the original deployment. The portfolio demo uses local browser state while keeping the same interaction model.</footer></div></CaseSection>
  <section className="schedulerOutcome"><div className="schedulerOutcomeDate"><span>SEP</span><strong>16</strong><small>TUE</small></div><div className="schedulerOutcomeEvent"><span>10:30–11:00 AM · Minskoff Pavilion</span><strong>Design Sync is on three calendars.</strong><div><i>N</i><i>M</i><i>A</i><b>Time, place, and participants stay on the same event.</b></div></div><aside><span>Before</span><s>“Does Tuesday morning work?”</s><span>After</span><strong>Confirmed time, place, and participant list.</strong></aside></section>
 </div>}

function ChatCase(){return <div className="chatStory">
  <section className="sandboxSection"><ChatSandbox/></section>
  <section className="chatRuleStage"><div><h2>Recreating the interaction rules behind iMessage</h2><p>The assignment required real-time messages and room presence. I recreated iMessage so I could study how a familiar messaging product handles message state, typing, reactions, and join or leave events.</p></div><div className="chatMessageSpecimen" aria-label="An iMessage bubble with the states that support it"><span className="chatPresence">Maya joined</span><div className="chatTyping"><i></i><i></i><i></i></div><div className="chatBubble">did everyone push?<b>❤️ 1</b></div><span className="chatDelivery">Delivered to every client</span></div></section>
  <CaseSection title="Persistent state and temporary state" className="chatStateSection"><div className="chatStateLedger"><section><h3>Stored state</h3><div className="chatPersistLine"><span>Message</span><strong>“did everyone push?”</strong><i>stored + synchronized</i></div><div className="chatPersistLine"><span>Tapback</span><strong>❤️ on the same message</strong><i>updates existing state</i></div></section><section><h3>Temporary state</h3><div className="chatTransient"><span>typing…</span><i></i><small>times out</small></div><div className="chatTransient"><span>Maya joined</span><i></i><small>room event</small></div></section></div></CaseSection>
  <CaseSection title="How I implemented those states" className="chatBuildSection"><div className="chatBuildRail"><article><strong>Send</strong><span>Socket.IO broadcasts the message.</span></article><article><strong>Sync</strong><span>Every client receives the same room state.</span></article><article><strong>Expire</strong><span>Typing disappears instead of entering history.</span></article><article><strong>Update</strong><span>A Tapback changes the original message state.</span></article><i aria-hidden="true"></i></div><p>HTML, CSS, JavaScript, and Socket.IO turned those rules into a working chat experience, not just an interface styled to look like iMessage.</p></CaseSection>
 </div>}

// Each scene ties a product decision to a supplied artifact. Motion compares viewport
// widths only; all narrative content stays visible without animation or JavaScript.
function EsteeCase(){
 const [compact,setCompact]=useState(false);
 return <div className="elEditorial">
  <section className="elVanity">
   <div className="elMirrorScene"><div className="elMirrorGlass"><div className="elReflection"/><p>Will this foundation<br/> <em>work for me?</em></p><span>The shopper question</span></div><div className="elMirrorStem"/><div className="elMirrorBase"/></div>
   <div className="elProblem"><span className="elIndex">01 / Shopper problem</span><h2>Online shoppers needed enough context to decide if Double Wear was right for them.</h2><p>Without a tester at the counter, shoppers have to understand finish, coverage, and shade context from the site itself.</p><p>I organized the experience around that decision: introduce the product, make the benefits easy to explore, then give the shopper a clear path to buy.</p><div className="elNote"><b>My starting point</b><p>Double Wear already had strong campaign imagery and product information. I wanted to bring those materials into one guided experience instead of making shoppers piece the story together across separate pages.</p></div></div>
  </section>
  <section className="elInvitation"><header><span className="elIndex">02 / Invite exploration</span><h2>Start with a question the shopper can answer.</h2><p>I used an interactive question to make product discovery more active while keeping the experience visually consistent with Estée Lauder.</p></header><figure><img src={assetUrl('project-media/el-shop.webp')} alt="Original Double Wear screen asking what the shopper looks for in a foundation" loading="lazy"/><figcaption>The original question screen. Product imagery creates recognition, and the question gives the shopper a clear way to start.</figcaption></figure></section>
  <section className="elProof"><header><span className="elIndex">03 / Product benefits</span><h2>Make the product benefits easy to scan.</h2><p>I put finish, coverage, and wear into a benefits carousel so each idea had its own space instead of becoming a wall of product copy.</p></header><figure><img src={assetUrl('project-media/el-benefits.webp')} alt="Original benefits carousel showing finish, buildable coverage, and wear information" loading="lazy"/><figcaption>Actual project screen · Product benefits carousel</figcaption></figure></section>
  <section className="elPurchase"><div className="elRetail"><span className="elIndex">04 / Purchase path</span><h2>Move from product discovery to a clear purchase path.</h2><p>I linked the experience to eight established retailers. That kept my scope focused on discovery and product education while checkout stayed with the retailers that already handled it.</p><figure><img src={assetUrl('project-media/el-shades.webp')} alt="Original purchase page showing foundation imagery and retailer links including Estée Lauder, Sephora, Ulta, and Nordstrom" loading="lazy"/><figcaption>Original retailer page with product and shade context.</figcaption></figure></div><aside className="elReceipt"><div className="elReceiptBrand">Estée Lauder<br/> <small>Double Wear discovery</small></div><h3>Scope decisions</h3><p className="elReceiptSub">What stayed in the experience and what I handed off</p><dl><div><dt>Keep</dt><dd>Brand scale, product imagery, and shade context.</dd></div><div><dt>Simplify</dt><dd>Dense product details into scannable benefit content.</dd></div><div><dt>Partner</dt><dd>Send purchase intent to eight established retailers.</dd></div></dl><div className="elReceiptTotal"><span>Scope</span><b>Discovery → retailer</b></div><p>Checkout stayed with retail partners so the experience could stay focused on discovery and education.</p><div className="elBarcode" aria-hidden="true"/><small>Case-study summary · not a purchase receipt</small></aside></section>
  <section className="elResponsive"><header><div><span className="elIndex">05 / Responsive design</span><h2>Make the image-heavy layout work on smaller screens.</h2></div><div><p>Responsive behavior was part of the build, not a final polish step. I reused responsive patterns and adjusted layouts so the product information and imagery still worked as the viewport narrowed.</p><p className="elSmall">The original capture below scales intact. This comparison shows the width constraint; it is not a separate mobile UI capture.</p></div></header><div className="elSizeToggle" role="group" aria-label="Compare image presentation widths"><button aria-pressed={!compact} onClick={()=>setCompact(false)}>Wide canvas</button><button aria-pressed={compact} onClick={()=>setCompact(true)}>Narrow canvas</button></div><div className={`elViewport ${compact?'elViewportCompact':''}`}><img src={assetUrl('project-media/el-home.webp')} alt="Original Double Wear homepage, scaled without cropping" loading="lazy"/></div><p className="elViewportCaption">The original imagery stays intact as the available width changes.</p></section>
  <section className="elFinal"><div className="elCompactScene"><EsteeCompact/></div><div className="elOutcomeText"><span className="elIndex">Outcome</span><p className="elFinalRecognition"><strong>Top 5</strong><span>Challenge finalist</span></p><h2>Top 5 finalist and C-suite presentation.</h2><p>The project finished as a Top 5 challenge finalist, and I presented the concept to Estée Lauder C-suite leadership.</p><p className="elFinalRole">My contribution: product concept, UX/UI, and frontend development.</p></div></section>
 </div>
}

function BookclubPhoneHero(){return <BookclubEditorialHero/>;}


function AccentureCase(){return <div className="accentureStory">
  <CaseSection title="How the workflow worked" className="accentureContext"><div><p className="accentureLeadCopy">At Accenture in San Francisco, I supported 21 live enablement requests for a frontier AI lab. Working through them showed me where requests arrived incomplete, which checks coordinators repeated, and where scheduling could fail. I used that work to define clearer operating guidance and automation requirements.</p><div className="accentureFieldLoop"><article><b>01</b><span>Support the requests</span><strong>Work through intake, matching, scheduling, and follow-up</strong></article><i>→</i><article><b>02</b><span>Find repeated decisions</span><strong>Track what coordinators check every time</strong></article><i>→</i><article><b>03</b><span>Define requirements</span><strong>Turn repeated checks into rules and review points</strong></article><footer><strong>The live requests became the basis for the automation requirements.</strong><span>21 requests</span></footer></div></div></CaseSection>

  <section className="accentureRelayStage"><header><span>LIVE WORKFLOW</span><h2>How one request moved through the process</h2><p>I supported intake, trainer matching, scheduling, and follow-up. The tools moved the request along, but coordinators still had to resolve missing information and check whether a proposed match actually worked.</p></header><AccentureRequestRelay/></section>

  <CaseSection title="Turning repeated decisions into requirements" className="accentureRequirements"><div><p className="accentureLeadCopy">After working through the requests, I could see the same decisions coming up repeatedly. I documented them in a 10-tab data contract covering required inputs, matching logic, warnings, reason codes, and the cases that still needed coordinator review.</p><AccentureWorkflowVisual/></div></CaseSection>

  <section className="accentureCanvasStage"><header><span>PROTOTYPE</span><h2>Testing the rules in a prototype</h2><p>I built and tested an early Codex-based prototype that structured requests, flagged missing inputs, and surfaced cases that needed human review. The workspace below is a portfolio reconstruction of that logic, not a live integration.</p></header><div className="accentureCanvasWork"><AccentureOpsWorkbench/><div className="accentureGtmRail" aria-label="GTM artifact flow from Salesforce through Google Sheets and an OpenAI decision workspace to Google Slides"><article className="isSalesforce"><b>SF</b><div><span>01 / REQUEST</span><strong>Salesforce record</strong><small>Request data</small></div></article><i>→</i><article className="isSheets"><b>▦</b><div><span>02 / TRACK</span><strong>Google Sheets</strong><small>Patterns + issues</small></div></article><i>→</i><article className="isOpenAI"><b>◉</b><div><span>03 / TEST</span><strong>Codex prototype</strong><small>Rules + review</small></div></article><i>→</i><article className="isSlides"><b>▰</b><div><span>04 / RECOMMEND</span><strong>Google Slides</strong><small>Next-step recommendations</small></div></article></div></div></section>

  <CaseSection title="Testing found a scheduling edge case" className="accentureQa"><div className="accentureQaScene"><div className="accentureClock" aria-label="Clock showing 10:30 PM"><i></i><b></b><span>10:30</span><small>PM</small></div><div className="accentureQaBefore"><span>PROPOSED MATCH</span><s>Valid match</s><small>Expertise ✓ &nbsp; Availability ✓</small></div><i aria-hidden="true">→</i><div className="accentureQaAfter"><span>REQUIREMENT CHANGE</span><strong>Add working-hours<br/>and time-zone checks.</strong><small>A free calendar slot is not enough.</small></div><footer><p>One proposed match passed the expertise and availability checks but landed at 10:30 PM in the trainer's local time. I used that case to add working-hours and time-zone checks to the requirements.</p></footer></div></CaseSection>

  <section className="accentureKitStage"><header><span>WHAT I DELIVERED</span><h2>Operating guidance, automation rules, and recommendations</h2><p>I documented roles and recurring communication, defined the rules for future automation, tracked process issues, and built a recommendation deck for the next phase of work.</p></header><AccentureFieldKit/></section>

  <CaseSection title="Using evidence to decide what to test next" className="accentureEvidence"><div><p className="accentureLeadCopy">I combined learner feedback with market and adoption research, then narrowed the findings into five recommendations and a 90-day test plan.</p><div className="accentureEvidenceFunnel"><header><span>EVIDENCE IN</span><strong>Two research streams, one prioritized test plan</strong></header><div className="accentureEvidenceSource"><article><small>LEARNER SIGNAL</small><strong>~2,200</strong><span>responses analyzed</span></article><article><small>MARKET SIGNAL</small><strong>~20 → 8</strong><span>providers researched → competitors compared</span></article></div><div className="accentureSynthesisSteps"><article><b>27</b><span>metrics captured</span></article><i>→</i><article><b>12</b><span>patterns synthesized</span></article><i>→</i><article className="focus"><b>5</b><span>recommendations prioritized</span></article></div><footer><span>OUTPUT / 90 DAYS</span><strong>Each recommendation became a hypothesis with a measurable test.</strong><div><i></i><i></i><i></i></div></footer></div></div></CaseSection>
 </div>}

function KohlerCase(){
 const stages=[
  {number:'01',kind:'order',title:'Read the order',copy:'Use the SKU and destination to determine what preparation the shipment needs.'},
  {number:'02',kind:'sources',title:'Check approved sources',copy:'Pull product information and market requirements from the systems that already own that data.'},
  {number:'03',kind:'packet',title:'Assemble and validate',copy:'Build the market-specific packet and surface anything missing or conflicting.'},
  {number:'04',kind:'release',title:'Review before release',copy:'A person resolves exceptions and approves the packet before the order continues.'}
 ];
 return <div className="kohlerStory">
  <CaseSection title="The product in use" className="kohlerProductSection"><div><p className="kohlerSectionLead">The workspace keeps the order, destination requirements, documents, validation status, and review in one place. Change the destination to see the market packet change without changing the underlying product record.</p><section className="kohlerProductStage"><KohlerProductSurface/><p className="kohlerPreviewCaption">Portfolio reconstruction using sample data.</p></section></div></CaseSection>

  <CaseSection title="The order problem" className="kohlerRiskSection"><div className="kohlerRiskLayout"><p className="kohlerSectionLead">A product can be in stock and still not be ready to export. If the destination needs a different specification sheet, label, warranty, translation, or compliance document, that material has to be identified and prepared before the order can move forward.</p><div className="kohlerOrderIllustration" aria-label="Three steps show a faucet in stock, an incomplete market packet, and the resulting export hold"><div className="kohlerSkuObject"><b className="kohlerRiskNumber">1</b><span>Faucet in stock</span><img className="kohlerFaucet" src={assetUrl('project-media/kohler-faucet.svg')} alt="Single-handle faucet"/><strong>K-14402 is available</strong><small>Physical inventory is confirmed.</small></div><div className="kohlerMissingPacket"><b className="kohlerRiskNumber">2</b><span>Market packet incomplete</span><div><b>SPEC</b><b>WARRANTY</b><b>LABELS</b></div><strong>Required material is missing</strong><small>India-specific documents still need to be prepared.</small></div><div className="kohlerHeldOrder"><b className="kohlerRiskNumber">3</b><span>Order SO-28471</span><div className="kohlerRouteStamp"><b>US</b><i></i><b>IN</b></div><strong>Export preparation stops</strong><small>Inventory is available, but the market packet is incomplete.</small></div></div></div></CaseSection>

  <CaseSection title="The product decision" className="kohlerBetSection"><div className="kohlerBet"><blockquote>We centered the experience on the export order. The user starts with the SKU and destination, sees what that market requires, resolves gaps, and reviews one packet before the order continues.</blockquote><div>{[
   ['Start with the order','The SKU and destination give the workflow the context it needs to begin.'],['Keep the work together','Required documents, missing information, validation, and review stay attached to the same order.'],['Keep the source trail','Generated material should point back to the approved source and the person who reviewed it.']
  ].map(([title,copy],index)=><article key={title}><b>{index+1}</b><strong>{title}</strong><p>{copy}</p></article>)}</div></div></CaseSection>

  <CaseSection title="Who is involved" className="kohlerPeopleSection"><div className="kohlerPeopleMap"><div className="kohlerPeopleRoute">{[
   ['Warehouse associate','Starts the export request and follows the preparation steps.'],['Product data owner','Provides the approved product information used in the packet.'],['Regional compliance','Checks destination-specific requirements and unresolved issues.'],['Order operations','Reviews the completed packet before the order continues.']
  ].map(([role,job,verb],index)=><article className={`person-${index+1}`} key={role}><b>{index+1}</b><span>{verb}</span><strong>{role}</strong><p>{job}</p></article>)}</div><div className="kohlerPeopleCore"><strong>Each role works from the same export packet.</strong><small>Product data, requirements, status, and review stay connected as the order moves forward.</small></div></div></CaseSection>

  <CaseSection title="From request to review" className="kohlerFlowSection"><div><p className="kohlerSectionLead">The workflow follows four steps from the original order to a packet that is ready for a person to review.</p><div className="kohlerDecisionJourney"><header><strong>Order SO-28471</strong><span>K-14402 · United States → India</span></header><div className="kohlerJourneyRail">{stages.map(({number,kind,title,copy})=><article className={`journey-${kind}`} key={number}><div className="kohlerJourneyStep"><span>{number}</span><i></i></div><div className="kohlerJourneyVisual" aria-hidden="true">{kind==='order'&&<div className="journeyOrderTicket"><small>ORDER</small><strong>SO-28471</strong><span>SKU K-14402</span><b>US → IN</b></div>}{kind==='sources'&&<div className="journeySources"><span>ORDER</span><span>PRODUCT</span><span>MARKET</span><i></i></div>}{kind==='packet'&&<div className="journeyPacket"><i></i><i></i><i></i><strong>INDIA<br/>PACKET</strong><span>3 ✓ &nbsp; 1 !</span></div>}{kind==='release'&&<div className="journeyRelease"><span>HUMAN REVIEW</span><strong>✓</strong><b>READY</b></div>}</div><h3>{title}</h3><p>{copy}</p></article>)}</div><footer><span>order</span><i></i><strong>source-linked packet</strong><i></i><span>human review</span></footer></div></div></CaseSection>

  <CaseSection title="Where automation stops" className="kohlerBoundarySection"><div className="kohlerBoundary"><article><span>FIXED RULES</span><strong>The system handles deterministic checks.</strong><p>Required fields, approved sources, document format, and completion status can be checked against explicit rules.</p></article><article><span>AI ASSISTANCE</span><strong>The model helps assemble the packet.</strong><p>It can retrieve relevant context, draft market-specific material, and point out information that is still missing.</p></article><article><span>HUMAN REVIEW</span><strong>A person makes the final decision.</strong><p>Conflicting sources, uncertain translations, incomplete evidence, and other exceptions stop for review before the order continues.</p></article></div></CaseSection>

  <CaseSection title="How the packet gets made" className="kohlerArchitectureSection"><div><p className="kohlerSectionLead">The system combines order data, approved product information, and destination requirements into one packet. Generated material keeps a source trail, and anything incomplete or conflicting is held for review.</p><div className="kohlerPacketStory" aria-label="Order, product, and market information are assembled into an India export packet for a person to review"><section className="kohlerEvidenceShelf"><h3><b>1</b> Gather approved information</h3><article><span>Order</span><strong>What is shipping where?</strong><small>SAP · SKU + destination</small></article><article><span>Product</span><strong>What product facts are approved?</strong><small>PIM · dimensions, materials, attributes</small></article><article><span>Market</span><strong>What does the destination require?</strong><small>Language · warranty · labels · compliance</small></article></section><div className="kohlerPacketBridge" aria-hidden="true"><i></i><span>keep source references attached</span></div><section className="kohlerPacketBuilder"><h3><b>2</b> Assemble the market packet</h3><div className="kohlerPaperStack"><article><span>PRODUCT FACTS</span><strong>Purist® faucet</strong><small>Approved source content</small></article><article><span>INDIA REQUIREMENTS</span><strong>English + Hindi</strong><small>A4 · warranty · labels</small></article><article><span>REVIEW CHECKLIST</span><strong>3 ready · 1 needs review</strong><small>Missing information stays visible</small></article></div><div className="kohlerServiceTrail"><span>Azure + Databricks provide context</span><span>Agent assembles the packet</span><span>Review flow keeps a person in control</span></div></section><div className="kohlerPacketBridge" aria-hidden="true"><i></i><span>unresolved items stay visible</span></div><section className="kohlerReviewDesk"><h3><b>3</b> Review before the order continues</h3><div className="kohlerReviewCard"><header><span>INDIA EXPORT PACKET</span><strong>SO-28471</strong></header><p><i>✓</i><span><strong>Product facts</strong><small>Source verified</small></span></p><p><i>✓</i><span><strong>Regional specification</strong><small>Generated and source-linked</small></span></p><p className="needsReview"><i>!</i><span><strong>Warranty language</strong><small>Human review required</small></span></p><footer><strong>Ready after 1 review</strong><span>The order does not continue automatically.</span></footer></div></section></div><div className="kohlerFailureModes"><article><strong>Product information is missing</strong><p>Route the issue back to the product-data owner.</p></article><article><strong>Sources disagree</strong><p>Show the conflicting information and require a person to resolve it.</p></article><article><strong>Evidence is incomplete</strong><p>Stop the workflow and identify exactly what still needs to be provided.</p></article></div></div></CaseSection>

  <CaseSection title="What we're building" className="kohlerDeliverySection"><div className="kohlerDelivery"><p>Our five-person team is building the workflow around a simple goal: help a warehouse associate understand what an export order needs, prepare the market-specific material, and keep a person in control of the final decision. My work focuses on product definition, workflow and interface design, and the pieces needed to connect the experience to enterprise data and validation.</p><div className="kohlerShippedList"><article><strong>Market-specific preparation packet</strong></article><article><strong>Exception handling and human review</strong></article><article><strong>Auditable preparation history</strong></article></div><div className="kohlerReleaseMoment"><div><span>ORDER SO-28471</span><strong>Ready for review</strong><small>Market packet assembled · 1 item needs review</small></div><div className="kohlerFinalRoute" aria-hidden="true"><b>US</b><i><em></em></i><b>IN</b></div><p><span>BEFORE</span><s>Teams search across systems and rebuild missing market documentation.</s><span>WITH SHIP ANYWHERE</span><strong>The order shows what is ready, what is missing, and what needs a person to review.</strong></p></div></div></CaseSection>

 </div>
}

function BookclubCase(){return <><aside className="bookclubMobileFirst"><strong>Mobile-first was an intentional product choice.</strong><p>Busy working adults coordinate between everything else, mostly from their phones. The core loop—choose, read, capture, and meet—was designed to work comfortably in one hand.</p></aside><BookclubEditorial/></>;}

function BookclubCaseLegacy(){return <>
  <CaseSection title="The problem"><p>A book club’s hardest work happens between meetings. The next title sits across text threads, polls, and search tabs; readers move at different speeds; discussion risks spoilers; and meeting details disappear into the chat history.</p><p>I designed and built Bookclub for a private reading group so that choosing, reading, discussing, and meeting could work as one continuous product loop.</p></CaseSection>
  <CaseSection title="The product loop"><div className="bookclubLoop"><article><header><span>01</span><div><strong>Choose together</strong><small>Reduce decision friction</small></div></header><div className="bookclubLoopSteps"><span>Create or join</span><b>→</b><span>Nominate</span><b>→</b><span>Rank</span></div><p>Private membership and ranked preference turn scattered suggestions into one group decision.</p></article><article><header><span>02</span><div><strong>Read together</strong><small>Support different paces</small></div></header><div className="bookclubLoopSteps"><span>Track</span><b>→</b><span>Discuss</span></div><p>Progress, checkpoints, and spoiler boundaries keep the group connected without forcing one speed.</p></article><article><header><span>03</span><div><strong>Keep the club moving</strong><small>Close and restart the loop</small></div></header><div className="bookclubLoopSteps"><span>Meet</span><b>→</b><span>Rate</span><b>→</b><span>Repeat</span></div><p>Meeting coordination and the shared shelf carry momentum into the next pick.</p></article></div></CaseSection>
  <CaseSection title="Product decisions"><div className="bookclubDecisionGrid">{[
    ['01 · Trust','Private by default','Invite-only clubs protect the intimacy of an existing group.','Tradeoff: growth is member-led, not feed-led.'],
    ['02 · Choice','Preference over popularity','Ranked choices plus runoff handling surface acceptable group options, not only the loudest favorite.','Tradeoff: a few more taps for a fairer decision.'],
    ['03 · Pace','Flexible progress','Page or chapter tracking supports different editions and honest reading speeds.','Tradeoff: progress stays lightweight, not analytically precise.'],
    ['04 · Safety','Checkpoint spoiler boundaries','Discussion unlocks around reading progress so members can participate without seeing ahead.','Tradeoff: posts need checkpoint context.'],
    ['05 · Expression','Private or shared notes','Quotes, questions, and predictions can remain personal or enter the group conversation.','Tradeoff: sharing is an explicit choice.'],
    ['06 · Coordination','Calendar as a handoff','Polls, RSVPs, reminders, and calendar actions finish the plan without turning Bookclub into a full calendar.','Tradeoff: external calendars own the final event.'],
    ['07 · Assistance','AI assists; members decide','AI supports discovery and reading context while nominations, rankings, and shared posts stay human-authored choices.','Tradeoff: assistance is bounded and reviewable.'],
    ['08 · Resilience','Replaceable book sources','NYT, Google Books, and Open Library broaden discovery without tying the core loop to one catalog.','Tradeoff: metadata quality can vary by source.'],
    ['09 · Capture','OCR before retyping','Vision OCR helps capture printed passages, with a review step before a quote is saved or shared.','Tradeoff: extraction is never treated as final.']
  ].map(([label,title,copy,tradeoff])=><article key={label}><span>{label}</span><strong>{title}</strong><p>{copy}</p><small>{tradeoff}</small></article>)}</div></CaseSection>
  <CaseSection title="Product walkthrough"><div className="bookclubWalkthrough"><article><figure><img loading="lazy" decoding="async" src={assetUrl('project-media/bookclub/screens/want-to-read.jpg')} alt="Bookclub want-to-read shelf with search and Goodreads import actions"/><figcaption>Live product · want-to-read shelf</figcaption></figure><div><span>Build the shared shelf</span><h3>Add to your reading life.</h3><p>Members can search for a book or import from Goodreads, then keep potential reads together in one visible want-to-read shelf.</p></div></article><article><figure><img loading="lazy" decoding="async" src={assetUrl('project-media/bookclub/screens/book-detail.jpg')} alt="Bookclub book detail showing premise, reading commitment, club fit, and discussion value"/><figcaption>Live product · book detail and club fit</figcaption></figure><div><span>Decide with enough context</span><h3>Would this work for your club?</h3><p>The detail view puts premise, estimated reading time, reasons it could fit, and likely discussion value beside the book, matching the decision shown on screen.</p></div></article><article><figure><img loading="lazy" decoding="async" src={assetUrl('project-media/bookclub/screens/club-activity.jpg')} alt="Bookclub activity view showing member reading progress and recent discussions"/><figcaption>Live product · shared progress and activity</figcaption></figure><div><span>Orient the group</span><h3>See how the club is moving.</h3><p>Recent activity and member progress show what is happening now without pretending every reader moves at the same pace.</p></div></article><article><figure><img loading="lazy" decoding="async" src={assetUrl('project-media/bookclub/screens/reading-plan.jpg')} alt="Bookclub chapter-based reading plan with checkpoints, finish date, and calendar actions"/><figcaption>Live product · reading plan and checkpoints</figcaption></figure><div><span>Plan the read</span><h3>Break the book into checkpoints.</h3><p>The screen turns a finish date into a chapter-based plan that members can follow and add to their calendars.</p></div></article><article><figure><img loading="lazy" decoding="async" src={assetUrl('project-media/bookclub/screens/meeting-room.jpg')} alt="Bookclub meeting room for A Thousand Splendid Suns showing reader attendance and a start meeting action"/><figcaption>Live product · meeting room</figcaption></figure><div><span>Meet together</span><h3>See who is here, then start.</h3><p>The meeting room keeps the active book, participating readers, and start action in one focused view.</p></div></article><article><figure><img loading="lazy" decoding="async" src={assetUrl('project-media/bookclub/screens/meeting-agenda.jpg')} alt="Bookclub meeting agenda showing a reader question and sealed prediction"/><figcaption>Live product · discussion agenda</figcaption></figure><div><span>Protect the conversation</span><h3>Carry saved thoughts into the meeting.</h3><p>Questions and sealed predictions become discussion prompts while spoiler context stays attached.</p></div></article><article><figure><img loading="lazy" decoding="async" src={assetUrl('project-media/bookclub/screens/shelves.jpg')} alt="Bookclub shelves showing books currently being read and books already completed"/><figcaption>Live product · current and finished shelves</figcaption></figure><div><span>Close the loop</span><h3>Keep the club’s reading history.</h3><p>Current and finished shelves preserve what the group has read and make the next return to discovery obvious.</p></div></article></div></CaseSection>
  <CaseSection title="What shipped"><div className="bookclubBuildGrid"><div><strong>Discovery + selection</strong><span>Book search, nominations, ranked voting, runoff and tie handling, and final selection.</span></div><div><strong>Reading + discussion</strong><span>Reading plans, progress, checkpoints, spoiler-aware posts, notes, OCR passage capture, replies, reactions, and meeting agenda capture.</span></div><div><strong>Meetings + continuity</strong><span>Time polls, RSVPs, calendar actions, scheduled reminders, ratings, and a finished-books shelf.</span></div></div></CaseSection>
  <CaseSection title="System design"><p className="bookclubSystemIntro">One server layer keeps private club data controlled while book, calendar, OCR, and AI services stay replaceable.</p><div className="bookclubSystemMap" aria-label="Bookclub system architecture"><div className="bookclubSystemFrontend"><span>Experience layer</span><strong>React · TypeScript · Vite</strong><small>Cloudflare Pages</small></div><div className="bookclubSystemConnector" aria-hidden="true"><i></i><span>requests + responses</span></div><div className="bookclubSystemCore"><span>Product orchestration</span><strong>Cloudflare Workers</strong><div><small>Club workflows</small><small>AI + OCR</small><small>Calendar + reminders</small></div></div><div className="bookclubSystemBranch" aria-hidden="true"><i></i><i></i></div><div className="bookclubSystemData"><article><span>Relational state</span><strong>D1</strong><small>clubs · votes · progress · discussions</small></article><article><span>Object storage</span><strong>R2</strong><small>covers · captures · product media</small></article></div><div className="bookclubServiceRail"><span><b>Discover</b> NYT · Google Books · Open Library</span><span><b>Assist</b> OpenAI · Google Vision OCR</span><span><b>Coordinate</b> Google Calendar</span></div></div></CaseSection>
  <CaseSection title="Live testing"><p className="bookclubMeasureIntro">Bookclub is live and in active testing with me and a group of roughly 15 friends. I’m combining observed use with lightweight user tests to find where selection, reading, and meeting coordination still create friction.</p><div className="bookclubMeasures"><div><strong>First-use success</strong><span>Can a new member join and nominate without help?</span></div><div><strong>Selection momentum</strong><span>Where does the path from shortlist to final choice stall?</span></div><div><strong>Reading rhythm</strong><span>Do progress and checkpoints bring readers back between meetings?</span></div><div><strong>Conversation carryover</strong><span>Do saved thoughts become replies or useful agenda items?</span></div></div></CaseSection>
</>}
function MarketExpansionCase(){return <div className="grazeStory">
  <section className="grazeBrief"><header><span className="grazeEyebrow">GRAZE CRAZE / PROJECT BRIEF</span><h2>Compare candidate locations with the same criteria.</h2></header><div><p>Graze Craze wanted to evaluate new franchise locations and strengthen demand at its existing Okemos and Shelby Township branches.</p><p>I owned the interactive Excel scorecard and supporting rubric. The consulting team developed the broader market research and branch-growth recommendations.</p><div className="grazeBriefFacts"><span><b>4</b> decision areas</span><span><b>3</b> markets compared</span><span><b>2</b> existing branches</span></div></div></section>
  <section className="grazeSection"><header className="grazeSectionHeading"><span className="grazeEyebrow">01 / BUILD THE SCORECARD</span><h2>Turn market research into a repeatable score.</h2><p>The rubric compared partnership potential, facility requirements, customer opportunity, and competition using the same scoring logic. Select a criterion to see an example.</p></header><GrazeRecipe/><div className="grazePrepSteps"><span>Research the market</span><i>→</i><span>Define benchmarks</span><i>→</i><span>Set criticality</span><i>→</i><span>Compare locations</span></div><p className="grazeSourceNote">The deck provides Michigan criticality values and allows users to customize them for other markets. Baseline checks include 5,000 B2B and 100,000 B2C opportunities.</p></section>
  <section className="grazeSection"><header className="grazeSectionHeading"><span className="grazeEyebrow">02 / COMPARE LOCATIONS</span><h2>Northville and Ann Arbor scored almost the same.</h2><p>Northville scored 123 and Ann Arbor 122; Traverse City scored 101. The scorecard made the gap visible, so the team recommended investigating properties and owners in both top markets instead of treating a one-point difference as decisive.</p></header><GrazeLocations/></section>
  <section className="grazeSection"><header className="grazeSectionHeading"><span className="grazeEyebrow">03 / GROW EXISTING BRANCHES</span><h2>Recommendations for the two existing Michigan branches.</h2><p>The team linked softer early-year demand to post-holiday spending constraints and New Year health priorities. Its recommendations focused on community outreach, B2B relationships, and targeted paid marketing.</p></header><GrazeGrowth/></section>
  <section className="grazeSection grazeEvidence"><header className="grazeSectionHeading"><span className="grazeEyebrow">04 / DELIVERABLE ARTIFACTS</span><h2>The scorecard and rubric given to client and stakeholders</h2></header><MarketArtifactBoard/></section>
  <section className="grazeClosing"><span className="grazeEyebrow">MY CONTRIBUTION</span><h2>I built the scorecard and scoring rubric.</h2><p>I turned the team’s market research into an Excel scorecard and a rubric with a concrete benchmark behind each score. That gave the client a consistent way to compare future locations alongside the team’s broader branch-growth recommendations.</p><span className="grazeSourceNote">Source: Graze Craze Revenue Generation and Franchising Strategy · April 19, 2024</span></section>
 </div>}

function Fact({title,children}){return <div className="fact"><h3>{title}</h3><p>{children}</p></div>}

function TechnicalCard({title,subtitle,kind,description}){
  return <article className="techCard">
    <div className={`techVisual ${kind}`}>
      {kind==='game' && <div className="spartanScene"><img loading="lazy" decoding="async" className="spartanBg" src="project-media/spartan-background.png" alt="Spartan Touchdown level artwork"/><div className="spartanGround"></div><img loading="lazy" decoding="async" className="spartySprite" src="project-media/sparty.png" alt="Sparty power-up from Spartan Touchdown"/><img loading="lazy" decoding="async" className="coinSprite coinOne" src="project-media/coin100.png" alt="100 point coin"/><img loading="lazy" decoding="async" className="coinSprite coinTwo" src="project-media/coin100.png" alt=""/><img loading="lazy" decoding="async" className="enemySprite" src="project-media/um-enemy.png" alt="Michigan enemy from Spartan Touchdown"/><img loading="lazy" decoding="async" className="goalSprite" src="project-media/goalpost.png" alt="Goalpost from Spartan Touchdown"/></div>}
      {kind==='fluids' && <img loading="lazy" decoding="async" src="project-media/stable-fluids.png" alt="2D Stable Fluids simulation with interactive controls"/>}
      {kind==='ray' && <div className="rayDiagram"><span>camera ray</span><i></i><span>intersection</span><i></i><span>lighting + reflection</span></div>}
    </div>
    <h3>{title}</h3>
    <p className="techMeta">{subtitle}</p>
    <p className="techDescription">{description}</p>
  </article>
}

function MoreProjectCard({project,onOpen}){
  return <article className={`moreBuildCard clickable project-${project.id}`}><a className="moreBuildAction" href={`#/projects/${project.id}`} onClick={(event)=>{event.preventDefault();onOpen(project.id)}} aria-label={`Open ${project.title}`}><div className="moreBuildVisual"><ProjectCover type={project.media}/></div><div className="moreBuildCopy"><span>{project.company}</span><h3>{project.title}</h3><span className="projectTextLink">Learn more ↗</span></div></a></article>
}
function MoreTechnicalCard({title,subtitle,kind,description}){
  return <article className="moreBuildCard"><div className="moreBuildVisual technicalCompact"><TechnicalCard title={title} subtitle={subtitle} kind={kind} description={description}/></div></article>
}

function CompanyLogo({src='',alt='',label=''}){const [failed,setFailed]=useState(false);const fallback=label||alt.split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0]).join('').toUpperCase();return <div className={`companyLogo ${failed?'fallback':''}`}>{src&&!failed?<img loading="lazy" decoding="async" src={src} alt={alt} onError={()=>setFailed(true)}/>:<strong className="logoText" aria-label={alt}>{fallback}</strong>}</div>}


const experienceItems=[
 {id:'accenture',caseStudy:'accenture',company:'Accenture',role:'Technology Summer Analyst',location:'San Francisco, CA',dates:'Summer 2026',logo:'company-logos/accenture-v31.png',short:'Supported live AI training requests and turned repeated coordination into clearer rules, tests, and recommendations.',detail:<div className="expStory"><p>I worked inside a live customer-enablement operation supporting 21 requests. I used the repeated checks and exceptions I saw to document matching rules, test automation requirements, prototype the request flow, and recommend what the program should improve next.</p><div className="expMetricRow"><span><b>21</b> live requests</span><span><b>6</b> workflow stages</span><span><b>10-tab</b> data contract</span><span><b>~2.2K</b> learner responses</span></div><div className="expColumns"><div><strong>Live requests</strong><span>Supported intake, validation, trainer fit, scheduling, status management, global coverage across six regions, and closeout.</span></div><div><strong>Automation requirements</strong><span>Documented required inputs, matching rules, warnings, reason codes, QA cases, and human-review points so repeated checks could be tested before automation.</span></div><div><strong>Research and recommendations</strong><span>Analyzed ~2.2K learner responses and researched ~20 providers, narrowing the work into 27 metrics, 12 patterns, five recommendations, and a 90-day test plan.</span></div></div></div>},
 {id:'palmer',company:'Russell Palmer Career Management Center',role:'Peer Coach',location:'East Lansing, MI',dates:'May 2025-present',logo:'company-logos/palmer-v31.png',short:'Coach students on resumes, interviews, networking, recruiting strategy, and case prep.',detail:<div className="expStory"><p>As a peer coach in MSU’s Russell Palmer Career Management Center, I meet one-on-one with students for resume reviews, interview preparation, recruiting strategy, networking, and case prep. Each session ends with specific edits or next steps the student can use right away.</p><div className="expMetricRow"><span><b>20+</b> sessions weekly</span><span><b>300+</b> students coached</span><span><b>25</b> coaches on team</span><span><b>~40%</b> of positive feedback in one 800-appointment snapshot</span></div></div>},
 {id:'fordcredit',caseStudy:'finsimple',company:'Ford Credit',role:'Software Engineering Intern',location:'Dearborn, MI',dates:'Summers 2024-2025',logo:'company-logos/ford-credit-v31.png',short:'Built customer-facing financial features and worked across the systems and teams needed to ship them.',detail:<div className="expStory"><p>As the sole intern embedded on FinSimple, I worked on customer-facing feature delivery and the systems around it: AEM, Salesforce APIs, QA and production environments, release coordination, incidents, and onboarding.</p><div className="expMetricRow"><span><b>40%</b> faster release cycle</span><span><b>20+</b> incidents analyzed</span><span><b>4</b> recovery playbooks</span><span><b>50</b> people across 5 teams</span></div><div className="expColumns"><div><strong>Product</strong><span>Built AEM components and Salesforce-backed workflows from customer and business requirements; worked across UI behavior, REST/GraphQL integration, Postman validation, and testing through development, QA, and production.</span></div><div><strong>Delivery quality</strong><span>Reviewed QA security-scan findings and PR compliance, documented release and environment-tagging workflows, and researched OAuth/API error patterns to support reliable deployments.</span></div><div><strong>Production operations</strong><span>Monitored live incidents, analyzed customer-impacting failure patterns, and coordinated with Payment, DevOps, and QA teams while turning recurring issues into four reusable recovery playbooks.</span></div></div><div className="expNote">I also built a centralized onboarding hub from 15 technical resources across 3 teams, cutting intern ramp-up from ~2 weeks to 3 days.</div></div>},
 {id:'pwc',company:'PwC × Arc of Indiana',role:'Consulting Extern',location:'',dates:'Aug-Oct 2024',logo:'company-logos/pwc-v31.png',short:'Built a weighted benchmark to compare peer nonprofits and turn the research into recommendations.',detail:<div className="expStory"><p>Over a five-week externship, I independently researched The Arc of Indiana and peer organizations it could learn from. I defined the comparison criteria, built a weighted seven-category scorecard, benchmarked five organizations across 10+ engagement and innovation metrics, and turned the findings into recommendations for the client.</p><div className="expMetricRow"><span><b>7</b> scorecard categories</span><span><b>5</b> peer organizations</span><span><b>10+</b> metrics</span><span><b>5</b> recommendations adopted</span></div></div>},
 {id:'ford',caseStudy:'fcvf',company:'Ford Motor Company',role:'Software Engineering Intern',location:'Dearborn, MI',dates:'Summer 2023',logo:'company-logos/ford.png',short:'Built a customer-value assessment and used user interviews to change how the experience worked.',detail:<div className="expStory"><p>My first internship put me close to both the code and the user. On a 10-person team, I helped build the full-stack Customer Value Framework, interviewed users, and used what we learned to change the product and implementation.</p><div className="expMetricRow"><span><b>4</b> user interviews</span><span><b>100+</b> Git commits</span><span><b>7</b> legacy CSS files replaced</span><span><b>+25%</b> feedback volume</span></div><div className="expColumns two"><div><strong>What I owned</strong><span>Frontend and backend implementation, accessibility improvements, refactoring, user interviews, Agile planning, and turning product feedback into interface changes, including pagination and score-visibility changes.</span></div><div><strong>What changed</strong><span>We moved toward a multi-page experience, removed the in-progress score, and replaced seven legacy CSS files with a more maintainable Material-UI approach while feedback volume increased 25%.</span></div></div></div>},
 {id:'spectrum',caseStudy:'marketExpansion',company:'Spectrum Consulting Group',role:'Consultant',location:'East Lansing, MI',dates:'2022-2026',logo:'company-logos/spectrum-v31.png',short:'Built decision tools and recommendations across consumer services, utilities, hospitality, and automotive projects.',detail:<div className="expStory"><div className="expMetricRow"><span><b>3,000+</b> survey responses</span><span><b>19</b> utility KPIs</span><span><b>3</b> locations compared</span><span><b>2</b> analysts mentored</span></div><div className="expColumns spectrumColumns"><div><strong>Consumer services</strong><span>Built an interactive Excel scorecard and rubric so the team could compare candidate locations using the same market and operating criteria. The team also developed community, partnership, and paid-media recommendations for existing branches.</span></div><div><strong>Utilities</strong><span>Built a criticality/feasibility rubric, defined 19 KPIs, and evaluated three software options for a multimillion-dollar utility.</span></div><div><strong>Hospitality</strong><span>Found engagement gaps across 3,000+ responses and recommended three digital initiatives that increased social interaction by 20%.</span></div><div><strong>Automotive</strong><span>Led the analysis workstream, combined customer pain points with funnel evidence, built implementation-ready recommendations, and redesigned lead-management workflows.</span></div></div><div className="expNote spectrumSaaS"><strong>Automotive SaaS strategy</strong><span>Defined target accounts and buyer roles, outreach signals, multichannel sequences, CRM handoffs, objection handling, and demo guidance tied to customer workflow problems.</span></div></div>},
];

const experienceImpact:Record<string,string>={
 accenture:'Supported 21 live AI enablement requests, defined a 10-tab automation contract, and turned ~2.2K learner responses into five recommendations.',
 palmer:'Coach 20+ sessions each week and have helped 300+ students leave with stronger applications and specific next steps.',
 fordcredit:'Owned a customer-facing feature through production, helped cut release time 40%, and created four incident-recovery playbooks.',
 pwc:'Built a seven-category peer benchmark that led to five adopted client recommendations.',
 ford:'Built the web-based Customer Value Framework, led four interviews, and increased feedback volume 25%.',
 spectrum:'Built decision tools across four consulting projects, including a repeatable location scorecard and measurable growth recommendations.'
};
experienceItems.forEach(item=>{if(experienceImpact[item.id])item.short=experienceImpact[item.id]});

function ExperienceSection({onAura,onOpen}){
 const [openIds,setOpenIds]=useState([]);
 const itemRefs=useRef({});
 const toneFor={accenture:'accenture',palmer:'palmer',spectrum:'spectrum',fordcredit:'fordcredit',pwc:'pwc',ford:'ford'};
 useEffect(()=>{
   const update=()=>{
     if(!openIds.length){onAura?.('default');return;}
     const center=window.innerHeight/2;
     const nearest=openIds.map(id=>{const el=itemRefs.current[id];if(!el)return null;const rect=el.getBoundingClientRect();const nearViewport=rect.bottom>-window.innerHeight*.12&&rect.top<window.innerHeight*1.12;if(!nearViewport)return null;return {id,distance:Math.abs((rect.top+rect.bottom)/2-center)}}).filter(Boolean).sort((a,b)=>a.distance-b.distance)[0];
     onAura?.(nearest?toneFor[nearest.id]||'default':'default');
   };
   update();
   window.addEventListener('scroll',update,{passive:true});
   window.addEventListener('resize',update);
   return ()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)};
 },[openIds,onAura]);
 const toggle=id=>setOpenIds(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);
 return <section id="experience" className="section experienceSection v28Experience"><div className="sectionTitle compactTitle"><h2>Experience</h2></div><div className="experienceAccordion">{experienceItems.map(x=>{const isOpen=openIds.includes(x.id);return <article ref={el=>{if(el)itemRefs.current[x.id]=el}} className={`experienceItem experience-${x.id} ${isOpen?'open':''}`} key={x.id}><button className="experienceSummary" onClick={()=>toggle(x.id)} aria-expanded={isOpen} aria-label={`${x.company}: ${isOpen?'collapse details':'expand details'}`}><CompanyLogo src={x.logo} alt={x.company}/><div><h3>{x.company}</h3><span className="experienceRole">{x.role}</span>{x.location&&<span className="experienceLocation">{x.location}</span>}<p>{x.short}</p></div><time>{x.dates}</time><b className="expToggle" aria-hidden="true">{isOpen?'−':'+'}</b></button><div className="experienceDetail" aria-hidden={!isOpen} hidden={!isOpen}><div>{x.detail}{x.caseStudy&&<button type="button" className="expCaseStudyLink" onClick={()=>onOpen?.(x.caseStudy)}>Learn more ↗</button>}</div></div></article>})}</div></section>
}



function EducationSection(){
 const schools=[
  {id:'broad',school:'Michigan State University',college:'Broad College of Business',degree:'B.A. Supply Chain Management',date:'May 2027',logo:'company-logos/msu-broad.webp'},
  {id:'engineering',school:'Michigan State University',college:'College of Engineering',degree:'B.S. Computer Science',date:'May 2027',logo:'company-logos/msu-engineering.png'}
 ];
 return <section id="education" className="section educationSection"><div className="sectionTitle compactTitle"><h2>Education</h2></div><div className="educationRows">{schools.map(item=><article className={`educationRow education-${item.id}`} key={item.id}><div className="educationLogo"><img loading="lazy" decoding="async" src={item.logo} alt={`${item.college} logo`}/></div><div className="educationCopy"><span className="educationSchool">{item.school}</span><h3>{item.college}</h3><p>{item.degree}</p></div><time>{item.date}</time></article>)}</div></section>
}


function HobbyPopover({label,title,items}){
  return <span className="hobbyPopover"><button type="button" className="hobbyPopoverTrigger">{label}</button><span className="hobbyPopoverCard" role="tooltip"><strong>{title}</strong>{items.map(item=><span key={item}>{item}</span>)}</span></span>
}

const aboutFilmPhotos=[
  {src:'project-media/about-film/01.jpg',width:1050,height:650,alt:'Golden Gate Bridge and Baker Beach framed by dark tree branches'},
  {src:'project-media/about-film/02.jpg',width:1002,height:1512,alt:'Yosemite granite cliffs rising above a green meadow and trees'},
  {src:'project-media/about-film/03.jpg',width:1086,height:1283,alt:'Banana plants and tropical greenery at a roadside farm in Hawaii'},
  {src:'project-media/about-film/04.jpg',width:1127,height:1409,alt:'Presidio buildings and palms with the Golden Gate Bridge behind them'},
  {src:'project-media/about-film/05.jpg',width:1193,height:1800,alt:'Two graduates walking together through a warmly lit arched hallway'},
  {src:'project-media/about-film/06.jpg',width:750,height:1133,alt:'Paddleboarder on clear blue Lake Tahoe framed by tall trees'},
  {src:'project-media/about-film/07.jpg',width:1002,height:1512,alt:'Turquoise cove and waterfall along a rocky California coastline'},
  {src:'project-media/about-film/08.jpg',width:1193,height:1800,alt:'Graduation portrait between colorful library stacks'},
  {src:'project-media/about-film/09.jpg',width:1194,height:1800,alt:'Chicago theater sign glowing between downtown buildings in warm evening light'},
  {src:'project-media/about-film/10.jpg',width:1333,height:883,alt:'Painted Ladies with the San Francisco skyline in the distance'}
];


function BookRecForm(){
 const [book,setBook]=useState('');
 const [status,setStatus]=useState('idle');
 const submit=async(e)=>{
   e.preventDefault();
   const value=book.trim();
   if(!value||status==='sending')return;
   setStatus('sending');
   try{
     const response=await fetch('https://formsubmit.co/ajax/chinimi2@msu.edu',{
       method:'POST',
       headers:{'Content-Type':'application/json','Accept':'application/json'},
       body:JSON.stringify({
         _subject:'New book recommendation from your portfolio',
         recommendation:value,
         _template:'table',
         _honey:''
       })
     });
     if(!response.ok)throw new Error('Submission failed');
     setBook('');
     setStatus('sent');
     window.setTimeout(()=>setStatus('idle'),3500);
   }catch{
     setStatus('error');
   }
 };
 return <form className={`bookRecForm ${status}`} onSubmit={submit}><div className="bookRecRow"><input id="book-rec" aria-label="Leave me a book rec" value={book} onChange={e=>{setBook(e.target.value);if(status==='error'||status==='sent')setStatus('idle')}} placeholder={status==='sent'?'Added to my reading list :)':'Send me a book rec'} autoComplete="off" disabled={status==='sending'||status==='sent'}/><button type="submit" disabled={!book.trim()||status==='sending'||status==='sent'}>{status==='sending'?'Sending…':status==='sent'?'Sent ✓':'Submit'}</button></div>{status==='error'&&<span className="bookRecStatus" role="status">Couldn’t send that one. Try again.</span>}</form>
}

function Home({openCase}){
 const [auraTone,setAuraTone]=useState('default');
 const [heroPointerActive,setHeroPointerActive]=useState(false);
 const [filmOpen,setFilmOpen]=useState(false);
 const [filmIndex,setFilmIndex]=useState(0);
 const serious=['fcvf','accenture','kohler','finsimple','scheduler','marketExpansion'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 const fun=['commute','bookclub','chat','estee'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 const moveHeroAura=e=>{
   if(e.pointerType==='touch')return;
   const rect=e.currentTarget.getBoundingClientRect();
   e.currentTarget.style.setProperty('--hero-mouse-x',`${e.clientX-rect.left}px`);
   e.currentTarget.style.setProperty('--hero-mouse-y',`${e.clientY-rect.top}px`);
 };
 return <>
 <header className="siteHeader"><a className="wordmark" href="#top">Neha Chinimilli</a><nav aria-label="Primary"><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#fun">Fun builds</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume</a><a className="headerLinkedIn" href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer" aria-label="Neha Chinimilli on LinkedIn"><img src={assetUrl('linkedin.svg')} alt="LinkedIn"/></a></nav></header>
 <main id="main-content">
  <section id="top" className={`hero v28Hero ${heroPointerActive?'heroPointerActive':''}`} onPointerMove={moveHeroAura} onPointerEnter={e=>{if(e.pointerType!=='touch')setHeroPointerActive(true)}} onPointerLeave={()=>setHeroPointerActive(false)}><div className="heroMouseAura" aria-hidden="true"/><div className="heroInner"><h1>Neha Chinimilli</h1><p className="heroThesis">Computer Science + Supply Chain Management at Michigan State University</p><p className="heroTagline">I like finding the annoying part of a process and building a better way through it.</p><div className="heroLinks"><a className="primaryHeroLink" href="#projects">View projects ↓</a><a href="#about">Learn more about me ↓</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div></div></section>
  <CompanyBanner/>
  <section id="projects" className="section projectsSection v28Projects"><div className="sectionTitle compactTitle"><h2>Projects</h2></div><div className="balancedProjectGrid">{serious.map((p,i)=><ProjectCard project={p} index={i} key={p.id} featured={i===0} onOpen={openCase}/>)}</div></section>
  <ExperienceSection onAura={setAuraTone} onOpen={openCase}/><EducationSection/>
  <section id="fun" className="section moreSection v28Fun">
    <div className="sectionTitle compactTitle">
      <h2>Fun things I’ve built</h2>
      </div>
      <div className="funLeadGrid">{fun.map(p=><MoreProjectCard key={p.id} project={p} onOpen={openCase}/>)}</div>
      <div className="smallBuildGrid">
        <article className="smallBuild">
          <div className="techVisual game">
            <div className="spartanScene">
              <img className="spartanBg" src="project-media/spartan-background.png" alt="Spartan Touchdown level"/>
              <div className="spartanGround"></div>
              <img className="spartySprite" src="project-media/sparty.png" alt="Sparty"/>
              <img className="enemySprite" src="project-media/um-enemy.png" alt="Michigan enemy"/>
              </div>
              </div>
              <h3>Spartan Touchdown</h3>
              <p>MSU CSE 335 team project built in C++ with wxWidgets. We worked from shared gameplay requirements and constraints, split the build across player movement, collision handling, enemies, scoring, level/state logic, and 2D graphics/assets, then integrated and tested the systems together.</p>
              </article><article className="smallBuild">
                <div className="techVisual fluids">
                  <img src="project-media/stable-fluids.png" alt="Stable Fluids simulation"/>
                  </div>
                  <h3>Stable Fluids</h3>
                  <p>MSU CSE 472 computer graphics project built in C++. I implemented a 2D Stable Fluids simulation based on the Stam method, modeling advection, diffusion/viscosity, buoyancy, velocity and density fields on a grid, with interactive emitters and obstacles rendered in real time.</p>
                  </article>
                  </div>
                  </section>
  <section id="about" className="section aboutSection">
    <div className="aboutPhoto"><AboutFilmCamera photos={aboutFilmPhotos} open={filmOpen} index={filmIndex} onClose={()=>setFilmOpen(false)} onChange={setFilmIndex}/></div><div className="aboutCopy"><h2>About me</h2><p>I’m Neha. I study <strong>Computer Science and Supply Chain Management at Michigan State</strong>, so I spend a lot of time thinking about how systems work and why people are still doing the annoying parts manually. I also care a lot about how things look and feel, so I like the design side as much as the systems side.</p><p>I’ve been rebuilding the same alarm idea for myself since high school: figure out the latest I can get up and still make it to work or class on time. It started as a script using Google Maps drive time. After moving to the Bay for the summer, I added my morning routine, real-time transit, traffic, and walking time, and it became the <a className="aboutInlineLink" href="#/projects/commute">Commute iOS app</a> above.</p><p className="hobbyLine">Outside of work, I’m usually trying a new coffee shop, traveling, <HobbyPopover label="reading" title="On my shelf" items={["A Thousand Splendid Suns","When Breath Becomes Air","The Year of Magical Thinking","Sharp Objects"]}/>, keeping up with <HobbyPopover label="reality TV" title="Always on rotation" items={["Modern Family","Vanderpump Rules","Summer House","the newest Real Housewives season"]}/>, baking, hiking, painting, or taking <span className="filmPhotoTriggerWrap"><button type="button" className="filmPhotoTrigger" onClick={()=>{setFilmOpen(true);setFilmIndex(0)}} aria-expanded={filmOpen}>film photos</button><span className="filmPhotoHint" role="tooltip">click to see my photos</span></span>.</p><div className="aboutActions"><BookRecForm/></div></div></section>
 </main><footer className="siteFooter"><span>© 2026 Neha Chinimilli</span><nav aria-label="Footer"><a href="mailto:chinimi2@msu.edu">Email</a><a className="linkedinLink" href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer" aria-label="Visit Neha Chinimilli on LinkedIn (opens in a new tab)"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3ZM8.25 18.25H5.75v-8h2.5v8ZM7 9.15a1.45 1.45 0 1 1 0-2.9 1.45 1.45 0 0 1 0 2.9Zm11.25 9.1h-2.5v-3.9c0-.93-.02-2.12-1.29-2.12-1.3 0-1.5 1.01-1.5 2.05v3.97h-2.5v-8h2.4v1.09h.04c.33-.64 1.15-1.32 2.37-1.32 2.54 0 3.01 1.67 3.01 3.84v4.39Z"/></svg><span>LinkedIn</span><span aria-hidden="true">↗</span></a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></nav></footer>
 </>
}

function ScrollToTopButton(){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{const update=()=>setVisible(window.scrollY>520);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);
 return <button type="button" className={`scrollTopButton ${visible?'visible':''}`} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top" title="Back to top">↑</button>
}

function App(){
 const route=()=>{const project=window.location.hash.match(/^#\/projects\/([^/?#]+)/);if(project)return {type:'case',id:project[1]};return {type:'home'}};
 const [current,setCurrent]=useState(route);
 const homeScroll=useRef(0);
 const restoreHomeScroll=useRef(false);
 useEffect(()=>{const onHash=()=>setCurrent(route());window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[]);
 useEffect(()=>{
  if(current.type!=='home'||!restoreHomeScroll.current)return;
  restoreHomeScroll.current=false;
  requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,homeScroll.current)));
 },[current]);
 const transition=(fn)=>fn();
 const openCase=(id)=>{homeScroll.current=window.scrollY;transition(()=>{window.location.hash=`/projects/${id}`;setCurrent({type:'case',id});requestAnimationFrame(()=>window.scrollTo(0,0))})};
 const closeRoute=()=>transition(()=>{restoreHomeScroll.current=true;history.pushState(null,'',window.location.pathname+window.location.search);setCurrent({type:'home'})});
 if(current.type==='case')return <><CaseStudy id={current.id} onBack={closeRoute}/><ScrollToTopButton/></>;
 return <><Home openCase={openCase}/><ScrollToTopButton/></>;
}

createRoot(document.getElementById('root')).render(<App/>);
