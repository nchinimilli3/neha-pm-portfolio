import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';


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
  accenture: [
    ['~2,200','learner responses synthesized','scale'],
    ['10-tab','automation data contract','artifact'],
    ['~20','providers benchmarked','context']
  ],
  fcvf: [
    ['4','user interviews','research'],
    ['2','interface directions compared','context']
  ],
  finsimple: [
    ['30%','ahead of schedule · broader internship','outcome'],
    ['5','cross-functional teams · broader internship','context']
  ],
  estee: [
    ['Top 5','challenge finalist','outcome']
  ]
};

const ownership = {
  accenture:'My scope included operating the live workflow, defining automation requirements, synthesizing customer evidence, and creating and testing an early enablement prototype.',
  fcvf:'I interviewed four users, evaluated the two interface directions, implemented frontend work, and tested the experience with the team.',
  finsimple:'I owned requirements, AEM component work, API integration, testing, and stakeholder coordination for my feature work.',
  scheduler:'I designed and built the full-stack scheduler, including the real-time interactions and deployment.',
  chat:'I built Socket.IO event handling, synchronized state, and the iMessage-style interaction layer.',
  commute:'I defined the product, recommendation logic, onboarding, and interactive iPhone demo.',
  estee:'I worked on the product concept, UX/UI, and frontend development.'
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
    company:'Independent product concept · iOS',
    summary:'One place to work backward from where I need to be to when I need to get out of bed.',
    media:'commute',
    facts:[]
  },
  {
    id:'fcvf',
    title:'Customer Value Framework',
    company:'Ford Motor Company',
    summary:'Four user interviews changed how a customer-value assessment should behave—not just how it should look.',
    media:'fcvf',
    facts:['4 user interviews','Live score removed after research']
  },
  {
    id:'accenture',
    title:'AI Enablement Operations',
    company:'Accenture · frontier AI lab account',
    summary:'Turned live enablement friction into a repeatable operating model, testable automation requirements, and a leadership recommendation.',
    media:'accenture',
    facts:['~2,200 learner responses','10-tab automation data contract']
  },
  {
    id:'scheduler',
    title:'Collaborative Scheduling Platform',
    company:'',
    summary:'Started with the fastest part of When2Meet, then fixed the uncertainty and coordination that happens around the grid.',
    media:'scheduler',
    facts:['Interactive sandbox','Flask · Socket.IO · MySQL']
  },
  {
    id:'finsimple',
    title:'FinSimple',
    company:'Ford Credit',
    summary:'Owned a customer-facing feature inside an existing financial platform, from requirements through production testing.',
    media:'finsimple',
    facts:['End-to-end feature work','Production environment']
  },
  {
    id:'chat',
    title:'Synchronized Group Chat',
    company:'',
    summary:'Built a multi-user chat with synchronized messages, presence, typing state, and reactions using an iMessage-style interface.',
    media:'chat',
    facts:['Real-time rooms + presence','Socket.IO']
  },
  {
    id:'estee',
    title:'Estée Lauder — Double Wear',
    company:'Estée Lauder × Kode With Klossy',
    summary:'Designed a branded product-discovery experience connecting education, shade exploration, and purchase.',
    media:'estee',
    facts:['Top 5 finalist','Earlier work']
  }
];

function MetricStrip({items}) {
  return <div className="metricStrip">{items.map(([v,l,type='context'])=><div className={`metric metric-${type}`} key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
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
    <div className="previewBar"><div><strong>Design Sync</strong><span>3 participants · Sep 15–19</span></div><span className="liveDot">Live</span></div>
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
    <div className="miniEventHeader"><div><strong>Design Sync</strong><span>Sep 15–19 · Minskoff Pavilion</span></div><span>3 participants</span></div>
    <div className="miniQuick"><span>Quick fill</span><button onClick={()=>quickFill('all')}>Free all</button><button onClick={()=>quickFill('weekdays')}>Weekdays 9–5</button><button onClick={()=>quickFill('evenings')}>Evenings</button></div>
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
  return <figure className="accenturePhotoCover">
    <img loading="lazy" decoding="async" src="project-media/accenture-context.webp" alt="Accenture office context" width={1600} height={900}/>
    <div className="accenturePhotoMark"><img src="company-logos/accenture.svg" alt=""/><span>San Francisco · Summer 2026</span></div>
    <figcaption>Accenture office exterior · contextual reference</figcaption>
  </figure>
}
function AccentureWorkflowVisual(){
  return <div className="accentureVisual workflowCanvas" aria-label="Simplified enterprise AI enablement workflow">
    <div className="workflowTitle"><span>Trainer assignment</span><strong>Matching worked — the local time did not</strong></div>
    <div className="workflowColumns"><div className="workflowNode"><span>Request</span><strong>Customer · region · topic · timing</strong></div><b aria-hidden="true">→</b><div className="workflowNode"><span>Matching</span><strong>Language · expertise · availability · time zone</strong></div><b aria-hidden="true">→</b><div className="workflowNode"><span>Review</span><strong>Reason codes · warnings · human check</strong></div></div>
    <div className="aiEdgeCase"><span>QA finding</span><strong>10:30 PM local assignment</strong><small>Working-hours and time-zone constraints became explicit matching requirements.</small></div>
  </div>
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
  if(view==='why') return <div className="commutePhone"><div className="phoneStatus">7:22</div><div className="commuteNav">‹ <strong>{recommendation}</strong></div><div className="whyLead">{takeBart?'The bus could still be faster. Missing it is the bigger risk.':'The bus is worth catching right now.'}</div><p className="whyCopy">{takeBart?`NL is about ${busDelay} min behind and bridge traffic is ${bridge}. BART leaves you more recovery room.`:`The bus is close, traffic is ${bridge}, and waiting for BART costs more time today.`}</p><div className="routeCompare"><div><strong>BART</strong><span>Leave {fm(leave)}</span><span>Arrive 8:48–8:53</span><small>Miss it → next train ~6 min later</small></div><div><strong>NL</strong><span>Leave 8:09</span><span>Arrive 8:42–9:04</span><small>Miss it → next useful bus ~28 min later</small></div></div></div>;
  return <div className="commutePhone"><div className="phoneStatus">7:22</div><div className="commuteDate">FRIDAY · AUG 21</div><div className="commuteDestination"><span>Salesforce Tower</span><strong>9:00 AM</strong></div><div className="wakeHero"><strong>{fm(wake)}</strong><span>Wake up</span><small>Alarm set</small></div><div className="morningLine"><div><b>{fm(leave)}</b><span>Leave home</span></div><div><b>{takeBart?'8:19':'8:17'}</b><span>{takeBart?'19th St BART':'Grand Ave bus'}</span></div><div><b>{takeBart?'8:51':'8:49'}</b><span>Salesforce Tower</span></div></div><div className="recommendLine"><strong>{recommendation}</strong><span>{takeBart?'19th St → Embarcadero':'Grand Ave → Salesforce Transit Center'}</span><small>{stale?'Live transit data unavailable · using schedule':takeBart?'Safer choice this morning':'Worth catching this morning'}</small></div><button className="sleepBtn" onClick={onWait}>Can I sleep longer?</button></div>
}

const commuteRoutineDefaults=[
  {id:'shower',name:'Shower',minutes:10},
  {id:'ready',name:'Get ready',minutes:25},
  {id:'breakfast',name:'Breakfast / coffee',minutes:8},
  {id:'door',name:'Grab things + get out',minutes:5}
];

function CommuteAppDemo(){
  const [stage,setStage]=useState('welcome');
  const [name,setName]=useState('Neha');
  const [origin,setOrigin]=useState('Whole Foods Oakland / Lake Merritt');
  const [destination,setDestination]=useState('Salesforce Tower');
  const [arrive,setArrive]=useState('09:00');
  const [buffer,setBuffer]=useState(8);
  const [health,setHealth]=useState(false);
  const [calendar,setCalendar]=useState(false);
  const [location,setLocation]=useState(false);
  const [alerts,setAlerts]=useState(false);
  const [alarmRule,setAlarmRule]=useState('suggest');
  const [permission,setPermission]=useState(null);
  const [routine,setRoutine]=useState(commuteRoutineDefaults);
  const [tab,setTab]=useState('today');
  const [detail,setDetail]=useState(null);
  const [busDelay,setBusDelay]=useState(6);
  const [bartDelay,setBartDelay]=useState(0);
  const [bridge,setBridge]=useState('building');
  const [weather,setWeather]=useState('clear');
  const [freshnessMin,setFreshnessMin]=useState({bart:0,nl:1,traffic:0});
  const [sleepOffset,setSleepOffset]=useState(0);
  const [toast,setToast]=useState('');
  const [demoNow,setDemoNow]=useState(7*60+22);
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
  const bartPenalty=(bartDelay>4?3:0)+bartFreshRisk;
  const busPenalty=(busDelay>5?4:1)+(bridge==='heavy'?5:bridge==='building'?2:0)+nlFreshRisk+trafficFreshRisk;
  const bartScore=bartLeave-bartPenalty;
  const busScore=busLeave-busPenalty;
  const takeBart=bartScore>=busScore;
  const chosen=takeBart?bartTrip:busTrip;
  const route=takeBart?'BART':'NL bus';
  const leaveMin=takeBart?bartLeave:busLeave;
  const baseWake=leaveMin-routineMinutes;
  const requestedWake=baseWake+sleepOffset;
  const availableRoutine=leaveMin-requestedWake;
  const sleepFeasible=availableRoutine>=minRoutine;
  const wakeMin=sleepFeasible?requestedWake:baseWake;
  const skipped=sleepOffset>0?routine.filter(x=>x.id==='breakfast' && availableRoutine<routineMinutes).map(x=>x.name):[];
  const phase=demoNow<wakeMin?'planned':demoNow<leaveMin?'morning':demoNow<deadline?'leave':'late';
  const next=()=>setStage(x=>({welcome:'routine',routine:'health',health:'calendar',calendar:'location',location:'alerts',alerts:'trip',trip:'app'}[x]||'app'));
  const flash=t=>{setToast(t);window.setTimeout(()=>setToast(''),1800)};
  const changeRoutine=(id,delta)=>setRoutine(r=>r.map(x=>x.id===id?{...x,minutes:Math.max(1,x.minutes+delta)}:x));
  const freshness=(key)=>{const age=freshnessMin[key];return {tone:age<=1?'live':age<=5?'aging':'warn',label:age===0?'updated now':`updated ${age}m ago`}};
  const Fresh=({source})=>{const f=freshness(source);return <span className={`freshness ${f.tone}`}><i></i>{f.label}</span>};
  const permissionCopy={health:{title:'Allow “Commute” to read Health data?',body:'Walking Speed only. Used to personalize walking time.',allow:'Allow'},calendar:{title:'Allow “Commute” to access Calendar?',body:'Event title, time, and location are used to build commute plans.',allow:'Allow Full Access'},location:{title:'Allow “Commute” to use your location?',body:'Used while commuting to estimate door-to-stop time and detect departure/arrival.',allow:'Allow While Using App'},alerts:{title:'Allow “Commute” to send notifications?',body:'For changed wake times, changed routes, and when it is time to leave.',allow:'Allow'}};
  const allowPermission=(type)=>{if(type==='health')setHealth(true);if(type==='calendar')setCalendar(true);if(type==='location')setLocation(true);if(type==='alerts')setAlerts(true);setPermission(null);flash(`${type[0].toUpperCase()+type.slice(1)} connected`);window.setTimeout(next,250)};
  const dialog=permission&&<div className="iosPermissionBackdrop"><div className="iosPermissionDialog" role="dialog" aria-modal="true" aria-labelledby="permission-title"><h3 id="permission-title">{permissionCopy[permission].title}</h3><p>{permissionCopy[permission].body}</p><div><button onClick={()=>{setPermission(null);next()}}>Don’t Allow</button><button onClick={()=>allowPermission(permission)}>{permissionCopy[permission].allow}</button></div></div></div>;
  const chrome=(content)=><div className="iosDemoShell"><img className="iosHardwareFrame" src="project-media/iphone-15-pro-frame.webp" alt="" aria-hidden="true"/><div className="iosStatus"><span>{shortFmt(demoNow)}</span><span className="iosStatusGlyphs">5G · Wi‑Fi · 82%</span></div><div className="iosScreenContent" inert={permission?true:undefined}>{content}</div>{dialog}{toast&&<div className="iosToast" role="status" aria-live="polite">{toast}</div>}</div>;

  if(stage==='welcome') return chrome(<div className="iosOnboarding iosWelcome"><div className="iosBrandMark">C</div><div><h3>Commute</h3><h2>Plan tomorrow morning.</h2><p>Start with where you need to be. Commute works backward to your alarm.</p></div><label className="iosField"><span>Your name</span><input value={name} onChange={e=>setName(e.target.value)} /></label><button className="iosPrimary" onClick={next}>Get started</button><button className="iosTextBtn" onClick={()=>setStage('app')}>Try demo</button></div>);
  if(stage==='routine') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button aria-label="Back" onClick={()=>setStage('welcome')}>‹</button><span>1 of 6</span></div><h2>Your morning routine</h2><p className="iosSub">A rough estimate is enough. You can refine it later.</p><div className="routineEditor">{routine.map(x=><div className="routineItem" key={x.id}><span>{x.name}</span><div><button aria-label={`Decrease ${x.name} duration`} onClick={()=>changeRoutine(x.id,-1)}>−</button><strong>{x.minutes} min</strong><button aria-label={`Increase ${x.name} duration`} onClick={()=>changeRoutine(x.id,1)}>+</button></div></div>)}</div><div className="routineSummary"><span>Typical morning</span><strong>{routineMinutes} min</strong></div><button className="iosPrimary" onClick={next}>Continue</button></div>);
  if(stage==='health') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button aria-label="Back" onClick={()=>setStage('routine')}>‹</button><span>2 of 6</span></div><h2>Use your walking pace</h2><p className="iosSub">Optional. Health can improve the walking part of your leave time.</p><div className="healthPreview"><div className="healthGlyph">♥</div><div><strong>Apple Health</strong><span>{health?'Connected':'Not connected'}</span></div></div>{health&&<div className="healthResult"><span>Standard estimate</span><strong>{standardWalk} min</strong><span>Your morning pace</span><strong>{personalizedWalk} min</strong></div>}<button className="iosPrimary" onClick={()=>setPermission('health')}>{health?'Connected':'Connect Health'}</button><button className="iosTextBtn" onClick={next}>Not now</button></div>);
  if(stage==='calendar') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button aria-label="Back" onClick={()=>setStage('health')}>‹</button><span>3 of 6</span></div><h2>Connect your calendar</h2><p className="iosSub">Use event time and location to build the morning automatically.</p><div className="calendarPreview"><span>9:00 AM</span><div><strong>Team sync</strong><small>Salesforce Tower</small></div></div><button className="iosPrimary" onClick={()=>setPermission('calendar')}>{calendar?'Connected':'Connect Calendar'}</button><button className="iosTextBtn" onClick={next}>Enter trips myself</button></div>);
  if(stage==='location') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button aria-label="Back" onClick={()=>setStage('calendar')}>‹</button><span>4 of 6</span></div><h2>Location while commuting</h2><p className="iosSub">Optional. Used to measure door-to-stop time and detect when a trip starts and ends.</p><div className="permissionPreview"><div className="permissionIcon locationIcon">⌖</div><div><strong>Location</strong><span>{location?'While Using the App':'Off'}</span></div></div><button className="iosPrimary" onClick={()=>setPermission('location')}>{location?'Connected':'Choose access'}</button><button className="iosTextBtn" onClick={next}>Not now</button></div>);
  if(stage==='alerts') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button aria-label="Back" onClick={()=>setStage('location')}>‹</button><span>5 of 6</span></div><h2>Commute notifications</h2><p className="iosSub">Only for a changed plan or when it is time to leave.</p><button className="iosPrimary" onClick={()=>setPermission('alerts')}>{alerts?'Notifications allowed':'Allow notifications'}</button><div className="alarmPreference"><span>Alarm changes</span><select value={alarmRule} onChange={e=>setAlarmRule(e.target.value)}><option value="suggest">Suggest changes</option><option value="auto15">Auto-adjust up to 15 min earlier</option><option value="never">Never change automatically</option></select></div><button className="iosTextBtn" onClick={next}>Not now</button></div>);
  if(stage==='trip') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button aria-label="Back" onClick={()=>setStage('alerts')}>‹</button><span>6 of 6</span></div><h2>Your first morning</h2><div className="iosField"><label>From</label><input value={origin} onChange={e=>setOrigin(e.target.value)}/></div><div className="iosField"><label>To</label><input value={destination} onChange={e=>setDestination(e.target.value)}/></div><div className="iosField"><label>Arrive by</label><input type="time" value={arrive} onChange={e=>setArrive(e.target.value)}/></div><div className="bufferRow"><span>Arrival buffer</span><div><button aria-label="Decrease arrival buffer" onClick={()=>setBuffer(Math.max(0,buffer-1))}>−</button><strong>{buffer} min</strong><button aria-label="Increase arrival buffer" onClick={()=>setBuffer(buffer+1)}>+</button></div></div><button className="iosPrimary" onClick={next}>Build morning</button></div>);

  const routeStation=takeBart?'19th St BART':'Grand Ave bus';
  const routeSub=takeBart?'19th St → Embarcadero':'Grand Ave → Salesforce Transit Center';
  const vehicleTime=takeBart?bartTrip.actual:busTrip.actual;
  const chosenArrival=chosen.arrival;
  const lateBy=Math.max(0,chosenArrival-deadline);
  const today=<div className="iosAppScreen"><div className="appTop"><div><span>Friday · Aug 21</span><h3>{phase==='late'?'Replan now':phase==='planned'?`Tomorrow, ${name}`:`Good morning, ${name}`}</h3></div><button className="avatarBtn" aria-label="Open profile" onClick={()=>setDetail('profile')}>{name[0]||'N'}</button></div><div className="destinationLine"><span>{destination}</span><strong>{fmt(arriveTarget)}</strong></div>{phase==='late'?<div className="bigMoment urgent"><strong>Leave now</strong><span>{route} · arrive {fmt(chosenArrival)}</span><small>{lateBy?`${lateBy} min past your preferred buffer`:'Fastest current plan'}</small></div>:<div className="bigMoment"><strong>{fmt(wakeMin)}</strong><span>{phase==='planned'?'Wake tomorrow':'Wake up'}</span><small>{alerts?'Alarm ready':'Alarm suggestion'}</small></div>}<div className="morningTimeline"><div><b>{fmt(leaveMin)}</b><span>Leave</span></div><i></i><div><b>{fmt(vehicleTime)}</b><span>{routeStation}</span></div><i></i><div><b>{fmt(chosenArrival)}</b><span>Arrive</span></div></div><button className="routeRecommendation" onClick={()=>setDetail('why')}><span><strong>{route}</strong><small>{routeSub}</small></span><b>›</b></button><div className="liveSources"><span>BART <Fresh source="bart"/></span><span>AC Transit NL <Fresh source="nl"/></span><span>Bay Bridge <Fresh source="traffic"/></span></div><p className="stateSentence">{takeBart?'BART keeps more recovery time if you miss a departure.':'The NL saves enough time today to justify the longer wait if you miss it.'}</p><button className="sleepAction" onClick={()=>setDetail('sleep')}>Can I sleep longer?</button></div>;
  const plan=<div className="iosAppScreen"><div className="appTop"><div><span>Morning plan</span><h3>{destination}</h3></div></div><div className="planList"><div><time>{fmt(wakeMin)}</time><span>Wake</span></div><div><time>{fmt(leaveMin)}</time><span>Leave {origin}</span></div><div><time>{fmt(vehicleTime)}</time><span>{routeStation}</span></div><div><time>{fmt(chosenArrival)}</time><span>Arrive</span></div><div><time>{fmt(arriveTarget)}</time><span>Commitment</span></div></div><button className="iosSecondary" onClick={()=>setDetail('edit')}>Edit commute</button></div>;
  const history=<div className="iosAppScreen"><div className="appTop"><div><span>Demo observations</span><h3>Learning over time</h3></div></div><div className="historyRows"><div><span>Walk to 19th St</span><strong>{health?'10 min':'8 min'}</strong><small>{health?'personalized from demo Health data':'standard estimate'}</small></div><div><span>Preferred arrival buffer</span><strong>{buffer} min</strong><small>your current setting</small></div><div><span>Routine</span><strong>{routineMinutes} min</strong><small>{routine.length} steps</small></div></div><p className="historyNote">A native build would compare predicted and observed trips before changing these values.</p></div>;
  const settings=<div className="iosAppScreen"><div className="appTop"><div><span>Settings</span><h3>{name}</h3></div></div><div className="settingsList"><button onClick={()=>setStage('routine')}><span>Morning routine</span><b>{routineMinutes} min</b></button><button onClick={()=>setPermission('health')}><span>Apple Health</span><b>{health?'Connected':'Off'}</b></button><button onClick={()=>setPermission('calendar')}><span>Calendar</span><b>{calendar?'Connected':'Off'}</b></button><button onClick={()=>setPermission('location')}><span>Location</span><b>{location?'While Using':'Off'}</b></button><button onClick={()=>setPermission('alerts')}><span>Notifications</span><b>{alerts?'Allowed':'Off'}</b></button><button onClick={()=>setDetail('conditions')}><span>Demo conditions</span><b>Adjust</b></button></div><button className="resetDemo" onClick={()=>{setStage('welcome');setHealth(false);setCalendar(false);setLocation(false);setAlerts(false);setSleepOffset(0)}}>Restart demo</button></div>;
  const main=tab==='today'?today:tab==='plan'?plan:tab==='history'?history:settings;
  const sleepChoices=[5,10,15].map(n=>{const avail=routineMinutes-n;const feasible=avail>=minRoutine;return {n,feasible,label:feasible?(n<=5?'Still safe':'Quick morning'):'Too late'}});
  return chrome(<>{main}<nav className="iosTabBar" aria-label="Commute tabs"><button className={tab==='today'?'active':''} onClick={()=>{setTab('today');setDetail(null)}}><span>⌂</span><small>Today</small></button><button className={tab==='plan'?'active':''} onClick={()=>{setTab('plan');setDetail(null)}}><span>◷</span><small>Plan</small></button><button className={tab==='history'?'active':''} onClick={()=>{setTab('history');setDetail(null)}}><span>↺</span><small>History</small></button><button className={tab==='settings'?'active':''} onClick={()=>{setTab('settings');setDetail(null)}}><span>⚙</span><small>Settings</small></button></nav>{detail==='why'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label={`Why ${route}`}><div className="sheetNav"><button onClick={()=>setDetail(null)}>Done</button><strong>Why {route}?</strong><span></span></div><h2>{takeBart?'BART gives you more recovery time this morning.':'The NL gives you more time at home today.'}</h2><div className="routeFacts"><div><div className="routeFactHead"><strong>BART</strong><Fresh source="bart"/></div><span>Leave {fmt(bartLeave)} · arrive {fmt(bartTrip.arrival)}</span><small>{bartDelay?`+${bartDelay} min delay`:'Running normally'} · next train ~6 min</small></div><div><div className="routeFactHead"><strong>NL bus</strong><Fresh source="nl"/></div><span>Leave {fmt(busLeave)} · arrive {fmt(busTrip.arrival)}</span><small>+{busDelay} min · bridge {bridge} · next useful bus ~30 min</small><span className="trafficFresh">Bay Bridge <Fresh source="traffic"/></span></div></div><p>{takeBart?'The bus can be faster, but its missed-departure penalty and current road uncertainty cost more recovery time.':'The bus is catchable and its time advantage outweighs the larger missed-departure penalty today.'}</p><button className="iosSecondary" onClick={()=>setDetail('conditions')}>See demo conditions</button></div>}{detail==='sleep'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Sleep longer"><div className="sheetNav"><button onClick={()=>setDetail(null)}>Done</button><strong>Sleep longer?</strong><span></span></div><h2>Your leave time stays fixed.</h2><div className="sleepChoices">{sleepChoices.map(x=><button key={x.n} disabled={!x.feasible} onClick={()=>{setSleepOffset(x.n);flash(x.label);setDetail(null)}}><strong>+{x.n} min</strong><span>{x.label}</span></button>)}</div>{skipped.length>0&&<p>Quick morning skips: {skipped.join(', ')}.</p>}</div>}{detail==='conditions'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Demo conditions"><div className="sheetNav"><button onClick={()=>setDetail(null)}>Done</button><strong>Demo conditions</strong><span></span></div><div className="sourceStatusList"><div><span>BART arrivals</span><Fresh source="bart"/></div><div><span>AC Transit NL arrivals</span><Fresh source="nl"/></div><div><span>Bay Bridge traffic</span><Fresh source="traffic"/></div></div><div className="conditionRows"><label>NL delay <b>+{busDelay} min</b><input type="range" min="0" max="18" value={busDelay} onChange={e=>setBusDelay(+e.target.value)}/></label><label>BART delay <b>+{bartDelay} min</b><input type="range" min="0" max="15" value={bartDelay} onChange={e=>setBartDelay(+e.target.value)}/></label><label>Bridge<select value={bridge} onChange={e=>setBridge(e.target.value)}><option value="clear">Clear</option><option value="building">Building</option><option value="heavy">Heavy</option></select></label><label>Weather<select value={weather} onChange={e=>setWeather(e.target.value)}><option value="clear">Clear</option><option value="rain">Rain</option></select></label>{['bart','nl','traffic'].map(key=><label key={key}>{key==='traffic'?'Traffic':key.toUpperCase()} data age <b>{freshnessMin[key]} min</b><input type="range" min="0" max="12" value={freshnessMin[key]} onChange={e=>setFreshnessMin(v=>({...v,[key]:+e.target.value}))}/></label>)}</div><p className="iosFinePrint">This sandbox uses deterministic demo rules, not a statistical confidence model.</p></div>}{detail==='edit'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Saved commute"><div className="sheetNav"><button onClick={()=>setDetail(null)}>Done</button><strong>Saved commute</strong><span></span></div><div className="iosField"><label>From</label><input value={origin} onChange={e=>setOrigin(e.target.value)}/></div><div className="iosField"><label>To</label><input value={destination} onChange={e=>setDestination(e.target.value)}/></div><div className="iosField"><label>Arrive by</label><input type="time" value={arrive} onChange={e=>setArrive(e.target.value)}/></div></div>}</>);
}

function CommutePreview(){
  return <div className="commutePreview"><figure className="commutePreviewPhoto"><img src="project-media/commute-bart.jpg" alt="BART trains at a Bay Area station" width={1400} height={1050}/><span>Oakland → San Francisco</span><figcaption>Photo: Pi.1415926535 · CC BY-SA 4.0</figcaption></figure><div className="commutePreviewPhone"><CommutePhone/></div><div className="commutePreviewNote"><strong>Wake 7:18 · leave 8:06</strong><p>BART today.</p></div></div>
}

function CommuteSandbox(){
  return <div className="commuteSandbox immersiveSandbox"><div className="iphoneDemoStage"><CommuteAppDemo/></div><p className="sandboxFinePrint">Demo data only. Health, Calendar, Location, alerts, and live transit permissions are simulated.</p></div>
}

function CommuteInUse(){return <div className="commuteInUse"><figure className="usagePhoto"><img src="project-media/salesforce-tower.jpg" alt="Salesforce Tower in San Francisco" width={1600} height={1067}/><figcaption>Photo: lamblukas · Wikimedia Commons</figcaption></figure><div className="usagePhone"><CommutePhone busDelay={2} bridge="clear"/></div><div className="lockMock"><span>7:54</span><strong>Leave in 12 min</strong><small>BART · 19th St</small><i>Everything is on track.</i></div></div>}

function ProjectCover({type}){
  if(type==='commute') return <div className="editorialCover commuteEditorial"><CommutePreview/></div>;
  if(type==='fcvf') return <div className="editorialCover artifactEditorial fcvfArtifact"><FCVFVisual/></div>;
  if(type==='accenture') return <div className="editorialCover accentureEditorial"><AccentureVisual/></div>;
  if(type==='finsimple') return <div className="editorialCover artifactEditorial finArtifact"><FinSimpleVisual/></div>;
  if(type==='scheduler') return <div className="editorialCover schedulerEditorial"><SchedulerPreview/></div>;
  if(type==='chat') return <div className="editorialCover chatEditorial"><MiniChat/></div>;
  return <div className="editorialCover esteeEditorial"><img loading="lazy" decoding="async" src="project-media/el-home.webp" alt="Estée Lauder Double Wear digital experience"/><div className="esteeStack"><img loading="lazy" decoding="async" src="project-media/el-benefits.webp" alt="Double Wear product benefits"/><img loading="lazy" decoding="async" src="project-media/el-shades.webp" alt="Double Wear shade exploration"/></div></div>;
}

function ProjectCard({project,index,onOpen,onAura,featured=true}){
  return <Reveal className={featured?'projectCardReveal featured':'projectCardReveal'}>
    <article className={`projectCard ${featured?'featured':''}`} onMouseEnter={()=>onAura?.(project.id)} onMouseLeave={()=>onAura?.('default')}>
      <button className="projectCardAction" type="button" onClick={()=>onOpen(project.id)} aria-label={`Open ${project.title} case study`}>
        <div className="projectCardMedia"><ProjectCover type={project.media}/></div>
        <div className="projectCardBody"><div className="projectCardTop"><span>{project.company}</span></div><h3>{project.title}</h3><p>{project.summary}</p><span className="projectTextLink">View case study ↗</span></div>
      </button>
    </article>
  </Reveal>
}

function ProjectVisual({type}){
  if(type==='commute') return <CommutePreview/>;
  if(type==='fcvf') return <FCVFVisual/>;
  if(type==='accenture') return <AccentureWorkflowVisual/>;
  if(type==='finsimple') return <FinSimpleVisual/>;
  if(type==='scheduler') return <MiniScheduler/>;
  if(type==='chat') return <MiniChat/>;
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
  const quick=type=>setCells(prev=>prev.map((c,i)=>{
    const row=Math.floor(i/5);
    if(type==='clear')return {...c,status:''};
    if(type==='all')return {...c,status:'available'};
    if(type==='evenings')return {...c,status:row>=5?'available':''};
    return {...c,status:row<=5?'available':''};
  }));
  const copyText=async(label,text)=>{try{await navigator.clipboard.writeText(text);setCopyState(label);window.setTimeout(()=>setCopyState(''),1400)}catch{setCopyState('')}};
  const exportCalendar=()=>{const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Neha Portfolio//Scheduler Demo//EN','BEGIN:VEVENT','SUMMARY:Design Sync','LOCATION:Minskoff Pavilion - Room 240','DTSTART:20260915T103000','DTEND:20260915T110000','END:VEVENT','END:VCALENDAR'].join('\r\n');const blob=new Blob([body],{type:'text/calendar'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='design-sync.ics';a.click();URL.revokeObjectURL(url)};
  const addVenue=()=>{const v=newVenue.trim();if(!v)return;setVenues(x=>[...x,{name:v,votes:0}]);setNewVenue('')};
  return <div className="schedulerSandbox">
    <div className="eventHero"><div><h2>Design Sync</h2><p>Sep 15–19 · 9:00 AM–12:00 PM</p><span className="locationPill">📍 Minskoff Pavilion · Room 240</span></div><div className="eventStats"><span>2 days left</span><strong>3 participants</strong></div></div>
    <div className="quickRow"><span>Quick fill:</span><button onClick={()=>quick('all')}>✨ Free all slots</button><button onClick={()=>quick('weekdays')}>Weekdays 9–5</button><button onClick={()=>quick('evenings')}>Evenings</button><button onClick={()=>quick('clear')}>Clear all</button></div>
    <div className="viewRow"><div><button className={view==='mine'?'active':''} onClick={()=>setView('mine')}>My Availability</button><button className={view==='heatmap'?'active':''} onClick={()=>setView('heatmap')}>Group Heatmap</button></div>{view==='mine'&&<div className="modeRow">{['available','maybe','unavailable'].map(m=><button className={mode===m?'active':''} key={m} onClick={()=>setMode(m)}>{m[0].toUpperCase()+m.slice(1)}</button>)}</div>}</div>
    <div className="schedulerActionRow"><button onClick={()=>{setShareOpen(v=>!v);copyText('link','#projects/scheduler')}}>{copyState==='link'?'Copied':'Share link'}</button><button onClick={()=>copyText('discord','Design Sync · Sep 15–19 · Add your availability: #projects/scheduler')}>{copyState==='discord'?'Copied':'Copy for Discord'}</button><button onClick={()=>copyText('email','Design Sync — please add your availability: #projects/scheduler')}>{copyState==='email'?'Copied':'Copy for Email'}</button><button onClick={exportCalendar}>Export calendar</button><button onClick={()=>quick('clear')}>Clear My Availability</button></div>
    {shareOpen&&<div className="shareBox"><strong>Invite link</strong><code>#projects/scheduler</code></div>}
    <div className="bestMeet"><div><span>Best Time to Meet</span><strong>{best.day} · {best.time}–{times[Math.min(times.length-1,times.indexOf(best.time)+1)]}</strong></div><p>Highest available count, then fewest unavailable responses, then earliest tied slot.</p></div>
    <div className="sandboxAnnotations"><div><strong>Maybe</strong><span>Keep uncertain times without treating them as fully free.</span></div><div><strong>Quick fill</strong><span>Mark predictable blocks without repeating the same clicks.</span></div><div><strong>Best time</strong><span>Turn the heatmap into a recommendation.</span></div><div><strong>Venue + chat</strong><span>Keep the next decisions in the same workflow.</span></div></div><div className="schedulerBody"><div className="fullCalendar"><p className="gridHint">Click or drag to apply a status. Drag the same status across filled cells again to clear them. Right-click a cell to add a note.</p><div className="calendarHead"><span></span>{days.map(d=><span key={d}>{d}</span>)}</div><div className="calendarGrid interactiveGrid">{times.map((t,r)=><React.Fragment key={t}><span className="timeLabel">{t}</span>{days.map((d,c)=>{const i=r*5+c;const cell=cells[i];const cls=view==='heatmap'?`heat heat-${Math.min(3,cell.available)}`:`status-${cell.status||'empty'}`;return <button key={d} data-slot-index={i} title={`${cell.note?cell.note+' · ':''}Available: ${cell.available} · Maybe: ${cell.maybe} · Unavailable: ${cell.unavailable}`} aria-pressed={view==='mine'?cell.status===mode:undefined} className={`slot ${cls} ${cell.note?'hasNote':''}`} onPointerDown={e=>beginDrag(i,e)} onContextMenu={e=>{e.preventDefault();setCells(a=>a.map((x,j)=>j===i?{...x,note:x.note?'':'Class / hold'}:x))}}/>})}</React.Fragment>)}</div></div>
      <aside className="schedulerAside"><div className="sideCard"><h3>Participants</h3><p><span className="responded"></span> Neha · Responded</p><p><span className="responded"></span> Maya · Responded</p><p><span className="pending"></span> Alex · Pending</p></div><div className="sideCard"><h3>Venue Voting</h3>{venues.map(v=><button className={venue===v.name?'venue active':'venue'} key={v.name} onClick={()=>setVenue(v.name)}><span>{v.name}</span><strong>{v.votes+(venue===v.name?1:0)} votes</strong></button>)}<div className="venueAdd"><input value={newVenue} onChange={e=>setNewVenue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addVenue()} placeholder="Add venue…"/><button onClick={addVenue}>Add</button></div></div><div className="sideCard"><h3>Event Chat</h3><div className="eventChat">{chat.map((m,i)=><p key={i}>{m}</p>)}</div><div className="inlineComposer"><input value={chatText} onChange={e=>setChatText(e.target.value)} placeholder="Drop a quick note…"/><button onClick={()=>{if(chatText.trim()){setChat(c=>[...c,`Neha: ${chatText.trim()}`]);setChatText('')}}}>Send</button></div></div></aside>
    </div>
  </div>
}
function ChatSandbox(){
 const seed=[{system:'Neha joined the room'},{who:'Maya',text:'did everyone push?'},{who:'me',text:'yep just finished the socket changes'}];
 const [msgs,setMsgs]=useState(seed); const [text,setText]=useState(''); const [typing,setTyping]=useState(false); const typingTimer=useRef(null);
 const add=()=>{if(!text.trim())return;setMsgs(m=>[...m,{who:'me',text:text.trim()}]);setText('')};
 const react=(i,r)=>setMsgs(m=>m.map((x,j)=>j===i?{...x,reaction:r}:x));
 return <div className="chatSandbox"><div className="chatTitle"><h2>Real-Time Chat</h2><span>Room: main</span></div><div className="chatWindow">{msgs.map((m,i)=>m.system?<div className="systemMsg" key={i}>{m.system}</div>:<div className={m.who==='me'?'chatLine mine':'chatLine theirs'} key={i}><button className="chatBubble" onDoubleClick={()=>react(i,'❤️')}>{m.text}{m.reaction&&<span className="reaction">{m.reaction}</span>}</button></div>)}{typing&&<div className="typingBubble"><i></i><i></i><i></i></div>}</div><div className="chatEntry"><input value={text} onChange={e=>{setText(e.target.value);setTyping(true);if(typingTimer.current)window.clearTimeout(typingTimer.current);typingTimer.current=window.setTimeout(()=>setTyping(false),900)}} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Type a message..."/><button onClick={add}>Send</button><button onClick={()=>setMsgs(m=>[...m,{system:'Neha left the room'}])}>Leave</button></div><p className="sandboxNote">Double-click a message to add a tapback. Typing and join/leave states mirror the original Socket.IO project behavior.</p></div>
}

function CaseStudy({id,onBack}){
 const p=projects.find(x=>x.id===id);
 if(!p)return null;
 return <main className="casePage"><button className="backBtn" onClick={onBack}>← Projects</button><header className="caseHeader"><p>{p.company}</p><h1>{p.title}</h1><div className="caseIntro">{p.summary}</div>{id!=='commute'&&<div className="ownershipLine"><span>{ownership[id]}</span></div>}{id!=='commute'&&metrics[id]&&<MetricStrip items={metrics[id]}/>}</header><section className="caseHeroMedia evidenceFirst"><ProjectVisual type={p.media}/></section>
 {id==='commute'&&<><section className="sandboxSection commuteShowcase"><CommuteSandbox/></section><CaseSection title="Why I built it"><p>Every morning, I checked my calendar, commute, traffic or transit, then worked backward to figure out when I actually needed to get out of bed.</p><p>I wanted one place to do that math for me—whether I was driving in Michigan or taking BART in the Bay Area.</p></CaseSection><section className="caseSection caseNarrative"><h2>It starts with the commitment.</h2><div><div className="decisionSteps"><div><span>1</span><strong>Arrive</strong><p>Calendar + buffer.</p></div><div><span>2</span><strong>Get ready</strong><p>Routine + walking.</p></div><div><span>3</span><strong>Check reality</strong><p>Arrivals + traffic + freshness.</p></div><div><span>4</span><strong>Act</strong><p>Wake. Leave. Route.</p></div></div></div></section><section className="caseSection technicalNote"><h2>What the native app would connect</h2><div><div className="dataSourceList"><div><strong>Google Routes</strong><span>walking + route geometry</span></div><div><strong>511 / GTFS-Realtime</strong><span>BART + AC Transit arrivals, vehicles, alerts</span></div><div><strong>511 traffic</strong><span>road incidents + bridge conditions</span></div><div><strong>HealthKit</strong><span>walking pace</span></div><div><strong>Calendar</strong><span>time + place</span></div><div><strong>Weather</strong><span>only when it changes the plan</span></div><div><strong>iOS alarms</strong><span>wake-time execution</span></div></div><p className="caseFinePrint"><strong>Browser prototype:</strong> deterministic demo data and simulated permissions. <strong>Native build:</strong> these are the intended integrations; the web demo does not claim to pull them live.</p></div></section><section className="caseSection decisionEditorial"><h2>Choices I made</h2><div className="principleList"><div><strong>Work backward from arrival.</strong><span>The commitment anchors the morning.</span></div><div><strong>Don’t rebuild Maps.</strong><span>Routing is infrastructure; the product owns the morning decision.</span></div><div><strong>Optimize for time kept.</strong><span>Arriving 30 minutes early is not automatically better.</span></div><div><strong>Model the miss.</strong><span>A six-minute train headway and a 30-minute bus headway are different risks.</span></div><div><strong>Freshness changes trust.</strong><span>Old vehicle data should carry less weight.</span></div><div><strong>Interrupt only when the plan changes.</strong><span>No alert for a delay that changes nothing.</span></div></div></section><section className="caseSection scopeLine"><h2>Scope</h2><div><p><strong>V1:</strong> calendar · routine · Health · wake/leave · BART/AC Transit · traffic · alarms</p><p><strong>Later:</strong> driving in Michigan · recurring commute detection · deeper reliability learning</p><p><strong>Cut:</strong> social features · generic trip planning · analytics dashboard · navigation replacement</p></div></section><section className="caseSection measureLine"><h2>What would tell me it works</h2><div><p><strong>Arrival error</strong> · predicted vs. observed &nbsp; <strong>Unused buffer</strong> · minutes returned &nbsp; <strong>Prediction error</strong> · routine/walk/route &nbsp; <strong>Interruptions</strong> · how often the app needs attention</p><p>North star: arrive on time with the least unnecessary buffer.</p></div></section></>}
 {id==='fcvf'&&<><CaseSection title="Original assessment"><p>The assessment lived in Excel. It was long to complete, difficult to navigate, and exposed scoring logic while users were still answering.</p></CaseSection><CaseSection title="User interviews"><div className="researchDecision"><div><span>During interviews</span><strong>Users said seeing the full assessment at once felt overwhelming.</strong></div><b>→</b><div><span>We also observed</span><strong>The live score changed with each answer, so users could go back and alter responses to move the score.</strong></div><b>→</b><div><span>What changed</span><strong>We moved to a multi-page flow and removed the live score while the assessment was in progress.</strong></div></div></CaseSection><CaseSection title="Iteration"><div className="comparisonVisual iterationVisual"><figure><figcaption>Earlier</figcaption><img loading="lazy" decoding="async" src="project-media/ford-before.webp" alt="Original Ford Excel assessment"/></figure><figure><figcaption>Final</figcaption><img loading="lazy" decoding="async" src="project-media/ford-after.webp" alt="Final Ford Customer Value Framework web application"/></figure></div></CaseSection><CaseSection title="What shipped"><div className="finalArtifact"><img loading="lazy" decoding="async" src="project-media/ford-after.webp" alt="Final Ford Customer Value Framework web experience"/><p>A web-based assessment with a multi-page flow and no live score influencing in-progress responses.</p></div></CaseSection></>}
 {id==='accenture'&&<><CaseSection title="Context"><p>I supported the live request-to-delivery workflow for an enterprise AI enablement program on a frontier AI lab account. The work covered intake, routing, trainer assignment, scheduling, delivery, feedback, and follow-up.</p></CaseSection><CaseSection title="Customer evidence"><div className="evidenceNumbers"><div><strong>~2,200</strong><span>learner responses synthesized</span></div><div><strong>~20 → 8</strong><span>providers researched → competitors compared</span></div><div><strong>27 → 12 → 5</strong><span>metrics → patterns → recommendations</span></div></div></CaseSection><CaseSection title="Workflow"><p className="diagramNote">Simplified portfolio diagram based on the workflow I documented during the internship.</p><div className="journeyFlow aiJourney"><div><strong>Manual requests</strong><span>inconsistent inputs + coordination</span></div><b>→</b><div><strong>Structured intake</strong><span>consistent mapping fields</span></div><b>→</b><div><strong>Automation contract</strong><span>10 tabs of logic, inputs, and guardrails</span></div><b>→</b><div><strong>Prototype</strong><span>refined, tested, demonstrated</span></div></div></CaseSection><CaseSection title="Testing"><div className="edgeCaseCard"><span>Edge case caught during QA</span><strong>A proposed trainer assignment landed at 10:30 PM local time.</strong><p>That exposed a missing requirement: working hours and time zones needed to be part of the matching logic, not handled after assignment.</p></div></CaseSection><CaseSection title="Selected deliverables"><div className="deliverableGrid"><div><strong>10-tab data contract</strong><span>Structured automation inputs, mapping, and requirements.</span></div><div><strong>Evidence synthesis</strong><span>~2,200 learner responses plus market/adoption research.</span></div><div><strong>Enablement prototype</strong><span>Created, refined, tested, and demonstrated an early experience.</span></div><div><strong>Recommendation path</strong><span>Converted research into five recommendations and a 90-day pilot path.</span></div></div></CaseSection></>}
 {id==='scheduler'&&<><section className="productDelta"><div><span>Kept from When2Meet</span><strong>Fast grid input + shared heatmap</strong></div><b>→</b><div><span>What I changed</span><strong>Uncertain availability · repetitive entry · what happens after a time is picked</strong></div></section><section className="sandboxSection schedulerShowcase"><SchedulerSandbox/></section><CaseSection title="Starting point"><p>When2Meet uses click-and-drag availability entry and a shared overlap view. I kept that core interaction and built additional coordination around it based on pain points I had experienced: uncertain availability, repetitive entry, choosing the best overlap, and coordinating what happens after a time is selected.</p></CaseSection><CaseSection title="What I added"><div className="factGrid"><Fact title="Availability is not always binary">Available / Maybe / Unavailable keeps uncertainty visible without turning the grid into a more complicated input.</Fact><Fact title="Entering time is repetitive">Quick-fill presets reduce repeated selection for predictable blocks.</Fact><Fact title="A heatmap still needs interpretation">Best Time to Meet converts overlap into a recommendation.</Fact><Fact title="Scheduling does not end with a time">Venue voting, participant status, notes, chat, sharing, and calendar export keep the next decisions in the same flow.</Fact></div></CaseSection><CaseSection title="Architecture"><div className="architecture"><span>Browser</span><b>↔</b><span>Socket.IO</span><b>↔</b><span>Flask</span><b>↔</b><span>MySQL</span></div><p>Docker and Google Cloud Run were used for deployment. This portfolio sandbox preserves the product behavior with local browser state so it can run on GitHub Pages without the original backend.</p></CaseSection><CaseSection title="Finished system"><p>The original application supported availability states, group overlap, best-time calculation, participant status, venue voting, notes, event chat, sharing, and calendar handoff.</p></CaseSection></>}
 {id==='finsimple'&&<><CaseSection title="Context"><p>My second Ford internship moved from a greenfield intern-built application to FinSimple, a deployed financial product with existing customers, shared libraries, data dependencies, and production environments.</p></CaseSection><CaseSection title="Previous Estimates"><p>I owned requirements, UI/component development, integration, testing, and stakeholder coordination. The feature progressed from dummy data to an AEM component and then into the customer-facing flow.</p><div className="progression"><img loading="lazy" decoding="async" src="project-media/finsimple-dummy.png" alt="Dummy data stage"/><img loading="lazy" decoding="async" src="project-media/finsimple-aem.png" alt="AEM component stage"/><img loading="lazy" decoding="async" src="project-media/finsimple-live.png" alt="Finished FinSimple stage"/></div></CaseSection><CaseSection title="Customer + system flow"><div className="journeyFlow"><div><strong>Customer</strong><span>starts a financing/account workflow</span></div><b>→</b><div><strong>Web experience</strong><span>collects/displays information</span></div><b>→</b><div><strong>Service + API layer</strong><span>moves customer + contract data</span></div><b>→</b><div><strong>Salesforce</strong><span>creates/populates the downstream record</span></div></div></CaseSection><CaseSection title="What shipped"><div className="finalArtifact"><img loading="lazy" decoding="async" src="project-media/finsimple-live.png" alt="Finished FinSimple Previous Estimates feature"/><p>A customer-facing feature delivered inside an existing enterprise product rather than as a standalone application.</p></div></CaseSection></>}
 {id==='chat'&&<><section className="sandboxSection"><ChatSandbox/></section><CaseSection title="What made it interesting"><p>The hard part was not drawing message bubbles; it was keeping multiple clients in the same room consistent as people joined, typed, reacted, and left.</p><div className="factGrid"><Fact title="Messages">Socket.IO broadcasts new messages to every client in the room.</Fact><Fact title="Presence">Join and leave events update shared room state.</Fact><Fact title="Typing">Typing is ephemeral state, so it expires instead of becoming another message.</Fact><Fact title="Tapbacks">Reactions update the same message for everyone instead of creating a second event in the feed.</Fact></div></CaseSection></>}
 {id==='estee'&&<><CaseSection title="Night Hack"><p>For an Estée Lauder × Kode With Klossy challenge, I worked on the product concept, UX/UI, and frontend for a Double Wear discovery experience. The team finished as a Top 5 finalist.</p></CaseSection><CaseSection title="What we made"><p>The goal was to keep the experience recognizably Estée Lauder while connecting product education, shade exploration, and a clear path to purchase.</p><EsteeVisual/></CaseSection></>}
 </main>
}
function CaseSection({title,children}){return <section className="caseSection"><h2>{title}</h2><div>{children}</div></section>}
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
  return <article className="moreBuildCard clickable"><button className="moreBuildAction" type="button" onClick={()=>onOpen(project.id)} aria-label={`Open ${project.title}`}><div className="moreBuildVisual"><ProjectCover type={project.media}/></div><div className="moreBuildCopy"><span>{project.company}</span><h3>{project.title}</h3><span className="projectTextLink">View →</span></div></button></article>
}
function MoreTechnicalCard({title,subtitle,kind,description}){
  return <article className="moreBuildCard"><div className="moreBuildVisual technicalCompact"><TechnicalCard title={title} subtitle={subtitle} kind={kind} description={description}/></div></article>
}

function CompanyLogo({src='',alt='',label=''}){return <div className="companyLogo">{src?<img loading="lazy" decoding="async" src={src} alt={alt}/>:<strong className="logoText">{label}</strong>}</div>}


const experienceItems=[
 {id:'accenture',company:'Accenture',role:'Technology Summer Analyst',dates:'2026',logo:'company-logos/accenture.svg',short:'Built the operating layer behind a frontier AI lab’s customer-enablement motion.',detail:<div className="expStory"><p>I started inside the live request flow, then used the friction I saw there to make the system more repeatable.</p><div className="expColumns"><div><strong>Operate</strong><span>Supported live requests across intake, routing, trainer fit, scheduling, and closeout.</span></div><div><strong>Systematize</strong><span>Mapped a six-stage workflow and built a 10-tab automation data contract with rules, tests, warnings, and human review.</span></div><div><strong>Recommend</strong><span>Synthesized ~2.2K learner responses and ~20-provider research into five recommendations and a 90-day path.</span></div></div></div>},
 {id:'ford',company:'Ford / Ford Credit',role:'Software Engineering Intern · 3 summers',dates:'2023–2025',logo:'company-logos/ford.png',short:'Three summers moving from a greenfield feedback product into customer-facing financial features and production delivery.',detail:<div className="expStory"><div className="fordProgression"><div><time>2023</time><strong>Build</strong><span>Customer-feedback platform · 4 user interviews · 100+ commits · +25% feedback volume.</span></div><div><time>2024</time><strong>Ship</strong><span>Customer-facing AEM + Salesforce work, onboarding tooling, and cross-team delivery.</span></div><div><time>2025</time><strong>Operate</strong><span>Release work, production incidents, recovery playbooks, and a 40% faster release cycle.</span></div></div></div>},
 {id:'spectrum',company:'Spectrum Consulting Group',role:'Consultant · Client Acquisition Lead',dates:'2022–2026',logo:'company-logos/spectrum.png',short:'Client strategy across hospitality, utilities, and automotive.',detail:<div className="expStory"><div className="expColumns"><div><strong>Hospitality</strong><span>Analyzed 3,000+ customer responses and recommended three digital initiatives.</span></div><div><strong>Utilities</strong><span>Defined 19 KPIs and evaluated three software options for a multimillion-dollar utility.</span></div><div><strong>Automotive</strong><span>Led a $15K workstream, mentored two analysts, and redesigned lead-management workflows.</span></div></div></div>},
 {id:'pwc',company:'PwC × Arc of Indiana',role:'Consulting Extern',dates:'2024',label:'PwC',short:'Built a repeatable way for a nonprofit client to compare peers and choose where to act.',detail:<div className="expStory"><p>Built a weighted seven-category scorecard, benchmarked five peer organizations across 10+ metrics, and translated the work into five recommendations adopted by leadership.</p></div>},
 {id:'palmer',company:'MSU Russell Palmer Career Management Center',role:'Peer Coach',dates:'2025–present',label:'MSU',short:'Turn messy recruiting questions into a concrete next step, 10+ times a week.',detail:<div className="expStory"><p>Coach 10+ students weekly across resumes, interviews, networking, and case preparation. The work is less about giving a template and more about diagnosing what each person actually needs next.</p><div className="experienceFacts"><span><b>100+</b> students coached</span><span><b>10+</b> sessions weekly</span></div></div>}
];

function ExperienceSection(){
 const [open,setOpen]=useState(null);
 return <section id="experience" className="section experienceSection v28Experience"><div className="sectionTitle compactTitle"><h2>Experience</h2></div><div className="experienceAccordion">{experienceItems.map((x,i)=><article className={`experienceItem ${open===i?'open':''}`} key={x.company}><button className="experienceSummary" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i} aria-label={`${x.company}: ${open===i?'collapse details':'expand details'}`}><CompanyLogo src={x.logo} alt={x.company} label={x.label}/><div><h3>{x.company}</h3><span>{x.role}</span><p>{x.short}</p></div><time>{x.dates}</time><b className="expToggle" aria-hidden="true">{open===i?'−':'+'}</b></button><div className="experienceDetail" aria-hidden={open!==i}><div>{x.detail}</div></div></article>)}</div></section>
}

function Home({openCase}){
 const [auraTone,setAuraTone]=useState('default');
 const serious=['fcvf','finsimple','accenture','scheduler'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 const fun=['commute','chat','estee'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 return <>
 <a className="skipLink" href="#main-content">Skip to content</a><AuraField tone={auraTone}/>
 <header className="siteHeader"><a className="wordmark" href="#top">Neha Chinimilli</a><nav aria-label="Primary"><a href="#experience">Experience</a><a href="#projects">Projects</a><a href="#fun">Fun builds</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume</a></nav></header>
 <main id="main-content">
  <section id="top" className="hero v28Hero"><div className="heroInner"><h1>Neha Chinimilli</h1><p className="heroThesis">Computer Science + Supply Chain Management at Michigan State University</p><div className="heroLinks"><a className="primaryHeroLink" href="#about">Learn about me ↓</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div></div></section>
  <ExperienceSection/>
  <section id="projects" className="section projectsSection v28Projects"><div className="sectionTitle compactTitle"><h2>Projects</h2></div><div className="balancedProjectGrid">{serious.map((p,i)=><ProjectCard project={p} index={i} key={p.id} featured={false} onOpen={openCase} onAura={setAuraTone}/>)}</div></section>
  <section id="fun" className="section moreSection v28Fun"><div className="sectionTitle compactTitle"><h2>Fun things I’ve built</h2></div><div className="funLeadGrid">{fun.map(p=><MoreProjectCard key={p.id} project={p} onOpen={openCase}/>)}</div><div className="smallBuildGrid"><article className="smallBuild"><div className="techVisual game"><div className="spartanScene"><img className="spartanBg" src="project-media/spartan-background.png" alt="Spartan Touchdown level"/><div className="spartanGround"></div><img className="spartySprite" src="project-media/sparty.png" alt="Sparty"/><img className="enemySprite" src="project-media/um-enemy.png" alt="Michigan enemy"/></div></div><h3>Spartan Touchdown</h3><p>C++ football game.</p></article><article className="smallBuild"><div className="techVisual fluids"><img src="project-media/stable-fluids.png" alt="Stable Fluids simulation"/></div><h3>Stable Fluids</h3><p>Interactive C++ fluid simulation.</p></article><article className="smallBuild raySmall"><div className="rayRenderedScene" aria-label="Ray-traced scene preview"><i className="raySphere one"></i><i className="raySphere two"></i><i className="rayFloor"></i></div><h3>Ray Tracer</h3><p>C++ renderer with lighting and reflections.</p></article></div></section>
  <section id="about" className="section aboutSection"><div className="aboutPhoto"><img src="headshot.jpg" alt="Neha Chinimilli" width={1066} height={1599}/></div><div className="aboutCopy"><h2>About me</h2><p>I like noticing the tiny annoying decisions people repeat every day—and figuring out whether one of them is worth building away.</p><p>Outside work, I shoot film, explore cities on foot, and build small things when I wish a tool already existed.</p><div className="aboutLinks"><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a><a href="mailto:chinimi2@msu.edu">Email</a><a href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div></section>
 </main><footer className="siteFooter"><span>© 2026 Neha Chinimilli</span><nav aria-label="Footer"><a href="mailto:chinimi2@msu.edu">Email</a><a href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></nav></footer>
 </>
}
function App(){
 const hashToId=()=>{const m=window.location.hash.match(/^#\/projects\/([^/?#]+)/);return m?m[1]:null};
 const [caseId,setCaseId]=useState(hashToId);
 const homeScroll=useRef(0);
 useEffect(()=>{const onHash=()=>setCaseId(hashToId());window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[]);
 const transition=(fn)=>{const d=document;if(d.startViewTransition)d.startViewTransition(fn);else fn()};
 const openCase=(id)=>{homeScroll.current=window.scrollY;transition(()=>{window.location.hash=`/projects/${id}`;setCaseId(id);requestAnimationFrame(()=>window.scrollTo(0,0))})};
 const closeCase=()=>transition(()=>{history.pushState(null,'',window.location.pathname+window.location.search);setCaseId(null);requestAnimationFrame(()=>window.scrollTo(0,homeScroll.current))});
 if(caseId)return <CaseStudy id={caseId} onBack={closeCase}/>;
 return <Home openCase={openCase}/>;
}

createRoot(document.getElementById('root')).render(<App/>);
