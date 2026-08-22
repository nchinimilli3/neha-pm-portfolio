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
    ['21','live requests supported','scope'],
    ['~2.2K','learner responses synthesized','analysis'],
    ['10-tab','automation data contract','artifact'],
    ['~20','providers benchmarked','research'],
    ['5','recommendations','decision']
  ],
  fcvf: [
    ['4','user interviews','research'],
    ['2','interface directions compared','decision'],
    ['1','live-score behavior removed','decision'],
    ['1','multi-page flow shipped','output']
  ],
  finsimple: [
    ['50','people coordinated · broader internship','context'],
    ['5','cross-functional teams · broader internship','context'],
    ['10%','ahead of schedule · broader delivery','outcome'],
    ['20+','customer-impacting incidents analyzed','operations']
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
    company:'Accenture · frontier AI lab account',
    summary:'Turned live enablement friction into a six-stage operating model, testable automation requirements, and evidence-backed recommendations for the next phase.',
    media:'accenture',
    facts:['~2,200 learner responses','10-tab automation data contract']
  },
  {
    id:'scheduler',
    title:'Collaborative Scheduling Platform',
    company:'',
    summary:'Took the core problem When2Meet solves, rebuilt the architecture from scratch, and made it better with uncertainty, recommendations, venue coordination, and real-time collaboration.',
    media:'scheduler',
    facts:['Interactive sandbox','Flask · Socket.IO · MySQL']
  },
  {
    id:'finsimple',
    title:'FinSimple',
    company:'Ford Credit',
    summary:'Owned customer-facing feature work inside an existing financial platform across requirements, AEM, Salesforce integration, QA, and production validation.',
    media:'finsimple',
    facts:['End-to-end feature work','Production environment']
  },
  {
    id:'chat',
    title:'Synchronized Group Chat',
    company:'',
    summary:'Recreated an iMessage-style group chat with synchronized messages, presence, typing state, and reactions across multiple clients.',
    media:'chat',
    facts:['Real-time rooms + presence','Socket.IO']
  },
  {
    id:'estee',
    title:'Estée Lauder: Double Wear',
    company:'Estée Lauder × Kode With Klossy',
    summary:'Designed a branded Double Wear discovery experience connecting product education, shade exploration, and purchase.',
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
    <div className="accenturePhotoMark"><span>Accenture · San Francisco · Summer 2026</span></div>
    <figcaption>Source: American City Business Journals</figcaption>
  </figure>
}
function AccentureWorkflowVisual(){
  return <div className="accentureVisual workflowCanvas" aria-label="Simplified enterprise AI enablement workflow">
    <div className="workflowTitle"><span>Trainer assignment</span><strong>Matching worked, but the local time did not</strong></div>
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
  if(view==='why') return <div className="commutePhone"><div className="phoneStatus">7:22</div><div className="commuteNav">‹ <strong>{recommendation}</strong></div><div className="whyLead">{takeBart?'The bus could still be faster. Missing it is the bigger risk.':'The bus is worth catching right now.'}</div><p className="whyCopy">{takeBart?`NL is about ${busDelay} min behind and bridge traffic is ${bridge}. BART leaves you more recovery room.`:`The bus is close, traffic is ${bridge}, and waiting for BART costs more time today.`}</p><div className="routeCompare"><div><strong>BART</strong><span>Leave {fm(leave)}</span><span>Arrive 8:48-8:53</span><small>Miss it → next train ~6 min later</small></div><div><strong>NL</strong><span>Leave 8:09</span><span>Arrive 8:42-9:04</span><small>Miss it → next useful bus ~28 min later</small></div></div></div>;
  return <div className="commutePhone"><div className="phoneStatus">7:22</div><div className="commuteDate">FRIDAY · AUG 21</div><div className="commuteDestination"><span>Salesforce Tower</span><strong>9:00 AM</strong></div><div className="wakeHero"><strong>{fm(wake)}</strong><span>Wake up</span><small>Alarm set</small></div><div className="morningLine"><div><b>{fm(leave)}</b><span>Leave home</span></div><div><b>{takeBart?'8:19':'8:17'}</b><span>{takeBart?'19th St BART':'Grand Ave bus'}</span></div><div><b>{takeBart?'8:51':'8:49'}</b><span>Salesforce Tower</span></div></div><div className="recommendLine"><strong>{recommendation}</strong><span>{takeBart?'19th St → Embarcadero':'Grand Ave → Salesforce Transit Center'}</span><small>{stale?'Live transit data unavailable · using schedule':takeBart?'Safer choice this morning':'Worth catching this morning'}</small></div><button className="sleepBtn" onClick={onWait}>Can I sleep longer?</button></div>
}

const commuteRoutineDefaults=[
  {id:'shower',name:'Shower',minutes:10},
  {id:'ready',name:'Get ready',minutes:25},
  {id:'breakfast',name:'Breakfast / coffee',minutes:8},
  {id:'door',name:'Grab things + get out',minutes:5}
];

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
  const changeRoutine=(id,delta)=>setRoutine(r=>r.map(x=>x.id===id?{...x,minutes:Math.max(1,x.minutes+delta)}:x));
  const freshness=(key)=>{const age=freshnessMin[key];return {tone:age<=1?'live':age<=5?'aging':'warn',label:age===0?'Live':age<=1?'1m ago':`${age}m ago`}};
  const Fresh=({source})=>{const f=freshness(source);return <span className={`freshness ${f.tone}`}><i></i>{f.label}</span>};
  const resetDemo=()=>{
    setStage('welcome');setName(defaults.name);setOrigin(defaults.origin);setDestination(defaults.destination);setArrive(defaults.arrive);setBuffer(defaults.buffer);
    setHealth(false);setCalendar(false);setLocation(false);setAlerts(false);setAlarmRule('suggest');setPermission(null);setRoutine(commuteRoutineDefaults);
    setTab('today');setDetail(null);setBusDelay(defaults.busDelay);setBartDelay(defaults.bartDelay);setBridge(defaults.bridge);setWeather(defaults.weather);setFreshnessMin(defaults.freshness);setSleepOffset(0);setToast('');
  };

  const permissionCopy={
    health:{title:'Allow Commute to read walking speed?',body:'Used only to estimate your walk to transit.',allow:'Allow'},
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
  const StatusIcons=()=> <span className="iosStatusIcons" aria-label="5G, Wi-Fi, battery 82 percent"><i className="signalBars"><b></b><b></b><b></b><b></b></i><em>5G</em><i className="wifiMark"></i><i className="batteryMark"><b></b></i></span>;
  const TabIcon=({name})=>{
    if(name==='today')return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z"/></svg>;
    if(name==='plan')return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>;
    if(name==='history')return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 9A8 8 0 1 1 5 16"/><path d="M4 4v5h5"/><path d="M12 8v5l3 2"/></svg>;
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></svg>;
  };
  const chrome=(content)=><div className="iosPhoneDevice"><div className="iosDemoShell"><div className="iosStatus"><span>{shortFmt(demoNow)}</span><StatusIcons/></div><div className="iosScreenContent" inert={permission?true:undefined}>{content}</div>{dialog}{toast&&<div className="iosToast" role="status" aria-live="polite">{toast}</div>}<div className="iosHomeIndicator" aria-hidden="true"></div></div><img className="iosHardwareFrame" src="project-media/iphone-frame-v31.png" alt="" aria-hidden="true"/></div>;

  if(stage==='welcome') return chrome(<div className="iosOnboarding iosWelcome"><div className="iosBrandMark">C</div><div className="welcomeCopy"><h3>Commute</h3><h2>Know when to get up.</h2><p>Tell it where you need to be. It works backward from arrival time, transit, traffic, and your routine.</p></div><label className="iosField"><span>Your name</span><input value={name} onChange={e=>setName(e.target.value)} /></label><button className="iosPrimary" type="button" onClick={next}>Set up my morning</button><button className="iosTextBtn" type="button" onClick={()=>setStage('app')}>Skip to demo</button></div>);
  if(stage==='routine') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('welcome')}>‹</button><span>1 of 6</span></div><h2>Your routine</h2><p className="iosSub">About how long do you need before leaving?</p><div className="routineEditor">{routine.map(x=><div className="routineItem" key={x.id}><span>{x.name}</span><div><button type="button" aria-label={`Decrease ${x.name} duration`} onClick={()=>changeRoutine(x.id,-1)}>−</button><strong>{x.minutes}m</strong><button type="button" aria-label={`Increase ${x.name} duration`} onClick={()=>changeRoutine(x.id,1)}>+</button></div></div>)}</div><div className="routineSummary"><span>Total</span><strong>{routineMinutes} min</strong></div><button className="iosPrimary" type="button" onClick={next}>Continue</button></div>);
  if(stage==='health') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('routine')}>‹</button><span>2 of 6</span></div><h2>Walking pace</h2><p className="iosSub">Optional. A walking-speed estimate makes door-to-transit timing more personal.</p><div className="nativeSettingRow"><div className="nativeIcon healthNative">♥</div><div><strong>Apple Health</strong><span>{health?'Walking speed connected':'Not connected'}</span></div></div><button className="iosPrimary" type="button" onClick={()=>health?next():setPermission('health')}>{health?'Continue':'Connect Health'}</button><button className="iosTextBtn" type="button" onClick={next}>Not now</button></div>);
  if(stage==='calendar') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('health')}>‹</button><span>3 of 6</span></div><h2>Calendar</h2><p className="iosSub">Commute can turn the first place-based event on your calendar into a morning plan.</p><div className="calendarPreview"><span>9:00</span><div><strong>Team sync</strong><small>Salesforce Tower</small></div></div><button className="iosPrimary" type="button" onClick={()=>calendar?next():setPermission('calendar')}>{calendar?'Continue':'Connect Calendar'}</button><button className="iosTextBtn" type="button" onClick={next}>Enter trips myself</button></div>);
  if(stage==='location') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('calendar')}>‹</button><span>4 of 6</span></div><h2>Location</h2><p className="iosSub">Optional. Use your location only while a commute is active.</p><div className="nativeSettingRow"><div className="nativeIcon locationNative">⌖</div><div><strong>While using the app</strong><span>{location?'Enabled':'Off'}</span></div></div><button className="iosPrimary" type="button" onClick={()=>location?next():setPermission('location')}>{location?'Continue':'Choose access'}</button><button className="iosTextBtn" type="button" onClick={next}>Not now</button></div>);
  if(stage==='alerts') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('location')}>‹</button><span>5 of 6</span></div><h2>Notifications</h2><p className="iosSub">Only when the plan changes or it is time to leave.</p><div className="alarmPreference"><span>Alarm changes</span><select value={alarmRule} onChange={e=>setAlarmRule(e.target.value)}><option value="suggest">Ask me first</option><option value="auto15">Auto-adjust up to 15m</option><option value="never">Never adjust</option></select></div><button className="iosPrimary" type="button" onClick={()=>alerts?next():setPermission('alerts')}>{alerts?'Continue':'Allow notifications'}</button><button className="iosTextBtn" type="button" onClick={next}>Not now</button></div>);
  if(stage==='trip') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button type="button" aria-label="Back" onClick={()=>setStage('alerts')}>‹</button><span>6 of 6</span></div><h2>First commute</h2><div className="iosField"><label>From</label><input value={origin} onChange={e=>setOrigin(e.target.value)}/></div><div className="iosField"><label>To</label><input value={destination} onChange={e=>setDestination(e.target.value)}/></div><div className="iosField"><label>Arrive by</label><input type="time" value={arrive} onChange={e=>setArrive(e.target.value)}/></div><div className="bufferRow"><span>Arrive early</span><div><button type="button" aria-label="Decrease arrival buffer" onClick={()=>setBuffer(Math.max(0,buffer-1))}>−</button><strong>{buffer}m</strong><button type="button" aria-label="Increase arrival buffer" onClick={()=>setBuffer(Math.min(30,buffer+1))}>+</button></div></div><button className="iosPrimary" type="button" onClick={next}>Build my morning</button></div>);

  const routeReason=takeBart?'More recovery time if you miss a train.':'The bus saves enough time to justify the longer headway.';
  const today=<div className="iosAppScreen todayScreen"><div className="appTop"><div><span>Friday, Aug 21</span><h3>{phase==='late'?'You need a new plan':`Good morning, ${name}`}</h3></div><button className="avatarBtn" type="button" aria-label="Open profile" onClick={()=>setDetail('profile')}>{name[0]||'N'}</button></div><button className="destinationLine" type="button" onClick={()=>setDetail('edit')} aria-label="Edit commute destination and arrival time"><div><span>Arrive by</span><strong>{destination}</strong></div><b>{fmt(arriveTarget)}</b></button>{phase==='late'?<button className="bigMoment urgent" type="button" onClick={()=>setDetail('alarm')}><span>Leave now</span><strong>{fmt(chosenArrival)}</strong><small>Current arrival with {route}</small></button>:<button className="bigMoment" type="button" onClick={()=>setDetail('alarm')}><span>{phase==='planned'?'Alarm':'Wake up'}</span><strong>{fmt(wakeMin)}</strong><small>Leave at {fmt(leaveMin)}</small></button>}<button className="routeRecommendation" type="button" onClick={()=>setDetail('why')}><div className="routeBadge">{takeBart?'B':'NL'}</div><span><small>Recommended</small><strong>{route}</strong><em>{routeSub}</em></span><div className="routeTimes"><b>{fmt(vehicleTime)}</b><small>arrive {fmt(chosenArrival)}</small></div></button><p className="routeReason">{routeReason}</p><div className="liveStrip"><button type="button" onClick={()=>setDetail('sources')}><Fresh source={takeBart?'bart':'nl'}/> {route}</button><button type="button" onClick={()=>setDetail('conditions')}>{bridge==='clear'?'Bridge clear':bridge==='building'?'Bridge +6m':'Bridge +12m'}</button></div><button className="sleepAction" type="button" onClick={()=>setDetail('sleep')}><span>Can I sleep longer?</span><b>›</b></button></div>;
  const plan=<div className="iosAppScreen"><div className="appTop"><div><span>Morning plan</span><h3>{destination}</h3></div><button className="smallEdit" type="button" onClick={()=>setDetail('edit')}>Edit</button></div><div className="planSummary"><span>Wake</span><strong>{fmt(wakeMin)}</strong><small>{routineMinutes} min routine</small></div><div className="planList"><div><time>{fmt(leaveMin)}</time><span>Leave home</span></div><div><time>{fmt(vehicleTime)}</time><span>{routeStation}</span></div><div><time>{fmt(chosenArrival)}</time><span>Arrive at {destination}</span></div><div><time>{fmt(arriveTarget)}</time><span>Be there</span></div></div><button className="iosSecondary" type="button" onClick={()=>setDetail('why')}>Why this route?</button></div>;
  const history=<div className="iosAppScreen"><div className="appTop"><div><span>History</span><h3>What Commute learns</h3></div></div><p className="historyIntro">A real build would learn from completed trips. This demo shows the signals that would update.</p><div className="historyRows"><div><span>Walk to 19th St</span><strong>{health?'10 min':'8 min'}</strong><small>{health?'Personalized walking estimate':'Default walking estimate'}</small></div><div><span>Arrival buffer</span><strong>{buffer} min</strong><small>Your current preference</small></div><div><span>Morning routine</span><strong>{routineMinutes} min</strong><small>{routine.length} saved steps</small></div></div></div>;
  const settings=<div className="iosAppScreen"><div className="appTop"><div><span>Settings</span><h3>{name}</h3></div></div><div className="settingsList"><button type="button" onClick={()=>setStage('routine')}><span>Morning routine</span><b>{routineMinutes} min</b></button><button type="button" onClick={()=>health?(setHealth(false),flash('Health disconnected')):setPermission('health')}><span>Health</span><b>{health?'On':'Off'}</b></button><button type="button" onClick={()=>calendar?(setCalendar(false),flash('Calendar disconnected')):setPermission('calendar')}><span>Calendar</span><b>{calendar?'On':'Off'}</b></button><button type="button" onClick={()=>location?(setLocation(false),flash('Location turned off')):setPermission('location')}><span>Location</span><b>{location?'While Using':'Off'}</b></button><button type="button" onClick={()=>alerts?(setAlerts(false),flash('Notifications turned off')):setPermission('alerts')}><span>Notifications</span><b>{alerts?'On':'Off'}</b></button><button type="button" onClick={()=>setDetail('conditions')}><span>Demo conditions</span><b>Adjust</b></button></div><button className="resetDemo" type="button" onClick={resetDemo}>Restart demo</button></div>;
  const main=tab==='today'?today:tab==='plan'?plan:tab==='history'?history:settings;
  const sleepChoices=[5,10,15].map(n=>{const available=routineMinutes-n;const feasible=available>=minRoutine;return {n,feasible,label:feasible?(n===5?'No tradeoff':'Shorten routine'):'Not enough time'}});

  return chrome(<>{main}<nav className="iosTabBar" aria-label="Commute tabs">{['today','plan','history','settings'].map(item=><button type="button" key={item} className={tab===item?'active':''} onClick={()=>{setTab(item);setDetail(null)}}><TabIcon name={item}/><small>{item[0].toUpperCase()+item.slice(1)}</small></button>)}</nav>{detail==='why'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label={`Why ${route}`}><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Why {route}</strong><span></span></div><h2>{takeBart?'BART is the safer choice this morning.':'The NL is worth catching this morning.'}</h2><p className="sheetLead">Commute compares the latest safe departure, current delay, missed-departure penalty, and data freshness.</p><div className="routeFacts"><div className={takeBart?'selected':''}><div className="routeFactHead"><strong>BART</strong><Fresh source="bart"/></div><span>Leave {fmt(bartLeave)}</span><b>Arrive {fmt(bartTrip.arrival)}</b><small>{bartDelay?`Delay +${bartDelay}m`:'On time'} · next train about 6m</small></div><div className={!takeBart?'selected':''}><div className="routeFactHead"><strong>NL bus</strong><Fresh source="nl"/></div><span>Leave {fmt(busLeave)}</span><b>Arrive {fmt(busTrip.arrival)}</b><small>Delay +{busDelay}m · next bus about 30m</small></div></div><button className="iosSecondary" type="button" onClick={()=>setDetail('conditions')}>Change conditions</button></div>}{detail==='alarm'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Alarm and wake plan"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Wake plan</strong><span></span></div><h2>{fmt(wakeMin)} alarm</h2><p className="sheetLead">This wake time works backward from your {fmt(arriveTarget)} arrival, {buffer}-minute buffer, selected route, and {routineMinutes}-minute routine.</p><div className="nativeDetailList"><button type="button" onClick={()=>setDetail('sleep')}><span>Sleep adjustment</span><strong>{sleepOffset?`+${sleepOffset} min`:'Check options'} ›</strong></button><button type="button" onClick={()=>{setDetail(null);setTab('plan')}}><span>Morning plan</span><strong>View timeline ›</strong></button><button type="button" onClick={()=>{setDetail(null);setTab('settings')}}><span>Alarm changes</span><strong>{alarmRule==='suggest'?'Ask first':alarmRule==='auto15'?'Auto up to 15m':'Never'} ›</strong></button></div></div>}{detail==='sources'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Live data sources"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Live data</strong><span></span></div><h2>What changed this morning</h2><p className="sheetLead">Commute only surfaces data that can change your leave time or route choice.</p><div className="sourceStatusList"><div><span>BART</span><strong><Fresh source="bart"/></strong></div><div><span>NL bus</span><strong><Fresh source="nl"/></strong></div><div><span>Bridge traffic</span><strong><Fresh source="traffic"/></strong></div></div><button className="iosSecondary" type="button" onClick={()=>setDetail('conditions')}>Adjust demo conditions</button></div>}{detail==='sleep'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Sleep longer"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Sleep longer</strong><span></span></div><h2>Keep the same leave time.</h2><p className="sheetLead">Choose how much of your morning buffer to trade for sleep.</p><div className="sleepChoices">{sleepChoices.map(x=><button type="button" key={x.n} disabled={!x.feasible} onClick={()=>{setSleepOffset(x.n);flash(`Alarm moved ${x.n}m later`);setDetail(null)}}><div><strong>+{x.n} min</strong><span>{x.label}</span></div><b>{x.feasible?'›':'Unavailable'}</b></button>)}</div>{sleepOffset>0&&<button className="iosTextBtn leftText" type="button" onClick={()=>{setSleepOffset(0);flash('Original alarm restored');setDetail(null)}}>Restore original alarm</button>}</div>}{detail==='conditions'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Demo conditions"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Conditions</strong><span></span></div><h2>Change the morning.</h2><div className="conditionRows"><label>NL delay <b>+{busDelay}m</b><input type="range" min="0" max="18" value={busDelay} onChange={e=>setBusDelay(+e.target.value)}/></label><label>BART delay <b>+{bartDelay}m</b><input type="range" min="0" max="15" value={bartDelay} onChange={e=>setBartDelay(+e.target.value)}/></label><label>Bridge<select value={bridge} onChange={e=>setBridge(e.target.value)}><option value="clear">Clear</option><option value="building">Building</option><option value="heavy">Heavy</option></select></label><label>Weather<select value={weather} onChange={e=>setWeather(e.target.value)}><option value="clear">Clear</option><option value="rain">Rain</option></select></label><label>BART data age <b>{freshnessMin.bart}m</b><input type="range" min="0" max="12" value={freshnessMin.bart} onChange={e=>setFreshnessMin(v=>({...v,bart:+e.target.value}))}/></label><label>NL data age <b>{freshnessMin.nl}m</b><input type="range" min="0" max="12" value={freshnessMin.nl} onChange={e=>setFreshnessMin(v=>({...v,nl:+e.target.value}))}/></label></div><p className="iosFinePrint">The sandbox uses deterministic demo rules so every change has a predictable result.</p></div>}{detail==='edit'&&<div className="iosFullSheet" role="dialog" aria-modal="true" aria-label="Edit commute"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Edit commute</strong><span></span></div><div className="iosField"><label>From</label><input value={origin} onChange={e=>setOrigin(e.target.value)}/></div><div className="iosField"><label>To</label><input value={destination} onChange={e=>setDestination(e.target.value)}/></div><div className="iosField"><label>Arrive by</label><input type="time" value={arrive} onChange={e=>setArrive(e.target.value)}/></div><div className="bufferRow"><span>Arrive early</span><div><button type="button" onClick={()=>setBuffer(Math.max(0,buffer-1))}>−</button><strong>{buffer}m</strong><button type="button" onClick={()=>setBuffer(Math.min(30,buffer+1))}>+</button></div></div><button className="iosPrimary fixedPrimary" type="button" onClick={()=>{flash('Commute updated');setDetail(null)}}>Save commute</button></div>}{detail==='profile'&&<div className="iosFullSheet profileSheet" role="dialog" aria-modal="true" aria-label="Profile"><div className="sheetNav"><button type="button" onClick={()=>setDetail(null)}>Done</button><strong>Profile</strong><span></span></div><div className="profileMonogram">{name[0]||'N'}</div><h2>{name}</h2><div className="profileStats"><div><span>Home</span><strong>Oakland</strong></div><div><span>Typical destination</span><strong>{destination}</strong></div><div><span>Routine</span><strong>{routineMinutes} min</strong></div></div><button className="iosSecondary" type="button" onClick={()=>{setDetail(null);setTab('settings')}}>Open settings</button></div>}</>);
}
function PreviewStatusIcons(){return <span className="iosStatusIcons" aria-hidden="true"><i className="signalBars"><b></b><b></b><b></b><b></b></i><em>5G</em><i className="wifiMark"></i><i className="batteryMark"><b></b></i></span>}
function CommutePreviewScreen(){
  return <div className="commutePreviewScreen"><div className="previewScreenTop"><span>Friday, Aug 21</span><strong>Good morning, Neha</strong></div><button type="button" className="previewDestination"><div><span>Arrive by</span><strong>Salesforce Tower</strong></div><b>9:00 AM</b></button><div className="previewWakeCard"><span>Wake up</span><strong>7:18</strong><small>Leave at 8:06 · 8 min arrival buffer</small></div><button type="button" className="previewRouteCard"><div className="previewRouteBadge">B</div><div className="previewRouteText"><small>Recommended</small><strong>BART</strong><em>19th St to Embarcadero</em></div><div className="previewRouteTimes"><b>8:19</b><small>arrive 8:51</small></div></button><div className="previewSignalRow"><span><i className="signalDot live"></i>BART live</span><span><i className="signalDot warm"></i>Bridge +6m</span></div><button type="button" className="previewSleepLink">Can I sleep longer? <b>›</b></button></div>
}
function CommutePreview(){
  return <div className="commutePreview commutePreviewClean"><div className="commutePreviewBackdrop" aria-hidden="true"></div><div className="commutePreviewMeta"><span className="commutePreviewEyebrow">Morning readiness</span><strong>Wake 7:18</strong><small>Leave 8:06 · BART today</small><p>Oakland to Salesforce Tower with live transit and a route choice that accounts for missed-departure risk.</p></div><div className="commutePreviewDevice"><div className="iosPhoneDevice commutePreviewDeviceFrame"><div className="iosDemoShell commutePreviewShell"><div className="iosStatus previewStatusBar"><span>7:22</span><PreviewStatusIcons/></div><div className="iosScreenContent"><CommutePreviewScreen/></div><div className="iosHomeIndicator" aria-hidden="true"></div></div><img className="iosHardwareFrame" src="project-media/iphone-frame-v31.png" alt="" aria-hidden="true"/></div></div></div>
}

function CommuteSandbox(){
  return <div className="commuteSandbox immersiveSandbox"><div className="iphoneDemoStage"><CommuteAppDemo/></div><p className="sandboxFinePrint">Demo data only. Health, Calendar, Location, alerts, and live transit permissions are simulated.</p></div>
}

function CommuteInUse(){return <div className="commuteInUse"><figure className="usagePhoto"><img src="project-media/salesforce-tower.jpg" alt="Salesforce Tower in San Francisco" width={1600} height={1067}/><figcaption>Photo: lamblukas · Wikimedia Commons</figcaption></figure><div className="usagePhone"><CommutePhone busDelay={2} bridge="clear"/></div><div className="lockMock"><span>7:54</span><strong>Leave in 12 min</strong><small>BART · 19th St</small><i>Everything is on track.</i></div></div>}

function ProjectCover({type}){
  if(type==='commute') return <div className="editorialCover commuteEditorial"><CommutePreview/></div>;
  if(type==='fcvf') return <figure className="homepageMockup"><img loading="lazy" decoding="async" src="project-media/fcvf-home-mockup.png" alt="Customer Value Framework shown on a laptop during a working session"/></figure>;
  if(type==='accenture') return <div className="editorialCover accentureEditorial"><AccentureVisual/></div>;
  if(type==='finsimple') return <figure className="homepageMockup"><img loading="lazy" decoding="async" src="project-media/finsimple-home-mockup.png" alt="FinSimple shown on a laptop"/></figure>;
  if(type==='scheduler') return <figure className="homepageMockup productScreenshotMockup"><img loading="lazy" decoding="async" src="project-media/scheduler-actual-v31.png" alt="Collaborative Scheduler running in the browser"/></figure>;
  if(type==='chat') return <figure className="homepageMockup productScreenshotMockup darkScreenshot"><img loading="lazy" decoding="async" src="project-media/chat-actual-v31.png" alt="Synchronized Group Chat running in the browser"/></figure>;
  return <figure className="homepageMockup"><img loading="lazy" decoding="async" src="project-media/estee-home-mockup.png" alt="Estée Lauder Double Wear experience shown on a laptop"/></figure>;
}

function ProjectCard({project,index,onOpen,featured=true}){
  return <Reveal className={featured?'projectCardReveal featured':'projectCardReveal'}>
    <article className={`projectCard project-${project.id} ${featured?'featured':''}`}>
      <a className="projectCardAction" href={`#/projects/${project.id}`} onClick={(event)=>{event.preventDefault();onOpen(project.id)}} aria-label={`Open ${project.title} case study`}>
        <div className="projectCardMedia"><ProjectCover type={project.media}/></div>
        <div className="projectCardBody"><div className="projectCardTop"><span>{project.company}</span></div><h3>{project.title}</h3><p>{project.summary}</p><span className="projectTextLink">View case study ↗</span></div>
      </a>
    </article>
  </Reveal>
}

function ProjectVisual({type}){
  if(type==='commute') return <CommutePreview/>;
  if(type==='fcvf') return <figure className="caseArtifactHero"><img src="project-media/ford-after.webp" alt="Final Customer Value Framework application"/></figure>;
  if(type==='accenture') return <AccentureWorkflowVisual/>;
  if(type==='finsimple') return <figure className="caseArtifactHero"><img src="project-media/finsimple-live.png" alt="FinSimple production interface"/></figure>;
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
    <div className="eventHero"><div><h2>Design Sync</h2><p>Sep 15-19 · 9:00 AM-12:00 PM</p><span className="locationPill">Minskoff Pavilion · Room 240</span></div><div className="eventStats"><span>2 days left</span><strong>3 participants</strong></div></div>
    <div className="quickRow"><span>Quick fill:</span><button onClick={()=>quick('all')}>Free all slots</button><button onClick={()=>quick('weekdays')}>Weekdays 9-5</button><button onClick={()=>quick('evenings')}>Evenings</button><button onClick={()=>quick('clear')}>Clear all</button></div>
    <div className="viewRow"><div><button className={view==='mine'?'active':''} onClick={()=>setView('mine')}>My Availability</button><button className={view==='heatmap'?'active':''} onClick={()=>setView('heatmap')}>Group Heatmap</button></div>{view==='mine'&&<div className="modeRow">{['available','maybe','unavailable'].map(m=><button className={mode===m?'active':''} key={m} onClick={()=>setMode(m)}>{m[0].toUpperCase()+m.slice(1)}</button>)}</div>}</div>
    <div className="schedulerActionRow"><button onClick={()=>{setShareOpen(v=>!v);copyText('link','#projects/scheduler')}}>{copyState==='link'?'Copied':'Share link'}</button><button onClick={()=>copyText('discord','Design Sync · Sep 15-19 · Add your availability: #projects/scheduler')}>{copyState==='discord'?'Copied':'Copy for Discord'}</button><button onClick={()=>copyText('email','Design Sync: please add your availability: #projects/scheduler')}>{copyState==='email'?'Copied':'Copy for Email'}</button><button onClick={exportCalendar}>Export calendar</button><button onClick={()=>quick('clear')}>Clear My Availability</button></div>
    {shareOpen&&<div className="shareBox"><strong>Invite link</strong><code>#projects/scheduler</code></div>}
    <div className="bestMeet"><div><span>Best Time to Meet</span><strong>{best.day} · {best.time}-{times[Math.min(times.length-1,times.indexOf(best.time)+1)]}</strong></div><p>Highest available count, then fewest unavailable responses, then earliest tied slot.</p></div>
    <div className="schedulerBody"><div className="fullCalendar"><p className="gridHint">Click or drag to apply a status. Drag the same status across filled cells again to clear them. Right-click a cell to add a note.</p><div className="calendarHead"><span></span>{days.map(d=><span key={d}>{d}</span>)}</div><div className="calendarGrid interactiveGrid">{times.map((t,r)=><React.Fragment key={t}><span className="timeLabel">{t}</span>{days.map((d,c)=>{const i=r*5+c;const cell=cells[i];const cls=view==='heatmap'?`heat heat-${Math.min(3,cell.available)}`:`status-${cell.status||'empty'}`;return <button key={d} data-slot-index={i} title={`${cell.note?cell.note+' · ':''}Available: ${cell.available} · Maybe: ${cell.maybe} · Unavailable: ${cell.unavailable}`} aria-pressed={view==='mine'?cell.status===mode:undefined} className={`slot ${cls} ${cell.note?'hasNote':''}`} onPointerDown={e=>beginDrag(i,e)} onContextMenu={e=>{e.preventDefault();setCells(a=>a.map((x,j)=>j===i?{...x,note:x.note?'':'Class / hold'}:x))}}/>})}</React.Fragment>)}</div></div>
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

function CaseDecisionNotes({id}){
 const notes={
  fcvf:[['Constraint','The assessment logic had to survive the move from Excel without exposing scoring behavior that could bias answers.'],['Decision','Use a multi-page flow so users focus on the current question instead of scanning the entire assessment.'],['Evidence','Four interviews and two interface directions surfaced both cognitive load and score-gaming risk.']],
  finsimple:[['Constraint','The feature lived inside an existing financial platform, so implementation had to respect established UI, data contracts, and release environments.'],['Decision','Treat AEM, Salesforce, QA, and production validation as one product workflow, not separate engineering tasks.'],['Tradeoff','Ship within the existing system instead of creating a cleaner standalone experience that would not fit the real platform.']],
  accenture:[['Constraint','The operating model mixed human judgment, regional coverage, language, capacity, and time-zone rules; a fully automated happy path would fail on real exceptions.'],['Decision','Translate coordinator judgment into schemas, rules, warnings, reason codes, and explicit human-review points.'],['Evidence','QA exposed a proposed 10:30 PM local assignment; that failure became a working-hours guardrail.']],
  scheduler:[['Problem','Availability grids answer “when are people free?” but not the coordination that comes immediately after.'],['Decision','Keep availability, uncertainty, venue voting, and lightweight chat in the same workflow.'],['Technical','Flask + MySQL + Socket.IO handled persisted scheduling state and real-time collaboration in the original build.']],
  chat:[['Problem','The interesting part was not drawing message bubbles. It was keeping multiple clients synchronized.'],['Decision','Make presence, typing, join/leave, reactions, and messages stateful events instead of decorative UI.'],['Technical','Socket.IO event handling keeps each client’s room state synchronized.']],
  estee:[['Problem','Beauty discovery has to bridge education, shade confidence, and purchase without making the shopper feel like they entered a product database.'],['Decision','Use product education and shade exploration as part of one branded journey.'],['Outcome','The concept finished as a Top 5 challenge finalist.']]
 }[id];
 if(!notes)return null;
 return <CaseSection title="Decisions & tradeoffs"><div className="decisionNoteGrid">{notes.map(([k,v])=><div key={k}><span>{k}</span><p>{v}</p></div>)}</div></CaseSection>
}



const caseCompanyInfo={
  fcvf:{name:'Ford Motor Company',logo:'company-logos/ford.png'},
  finsimple:{name:'Ford Credit',logo:'company-logos/ford-credit-v31.png'},
  accenture:{name:'Accenture',logo:'company-logos/accenture-v31.png'},
  estee:{name:'Estée Lauder × Kode With Klossy',logo:''},
  commute:{name:'Independent product concept',logo:''},
  scheduler:{name:'Michigan State University · CSE 477',logo:''},
  chat:{name:'Michigan State University · CSE 477',logo:''}
};
function CaseCompanyBar({id,fallback=''}){
  const info=caseCompanyInfo[id]||{name:fallback,logo:''};
  if(!info.name)return null;
  return <div className="caseCompanyBar"><span>{info.name}</span>{info.logo&&<img src={info.logo} alt={`${info.name} logo`}/>}</div>
}
function ExpandableImage({src,alt,label='',className='',onExpand}){
  return <button type="button" className={`expandableImage ${className}`} onClick={()=>onExpand?.({src,alt})} aria-label={`Expand ${label||alt}`}>
    <img loading="lazy" decoding="async" src={src} alt={alt}/>{label&&<span>{label}</span>}<i aria-hidden="true">↗</i>
  </button>
}
function ImageLightbox({image,onClose}){
  useEffect(()=>{if(!image)return;const fn=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[image,onClose]);
  if(!image)return null;
  return <div className="imageLightbox" role="dialog" aria-modal="true" aria-label={image.alt||'Expanded project image'} onClick={onClose}><button className="lightboxClose" type="button" onClick={onClose} aria-label="Close image">×</button><img src={image.src} alt={image.alt||''} onClick={e=>e.stopPropagation()}/></div>
}
const photoCollections=[
  {
    id:'umich-grad',
    title:'UMich grad',
    note:'Ann Arbor',
    description:'A quieter set from graduation weekend.',
    photos:[
      {src:'photography/gallery/umich/umich-1.JPG',alt:'Graduation portraits in front of a historic stone archway at the University of Michigan'},
      {src:'photography/gallery/umich/umich-2.JPG',alt:'Graduation group portrait seated in front of a campus building entrance'},
      {src:'photography/gallery/umich/umich-3.JPG',alt:'Graduation group portrait at night under neon lights'},
      {src:'photography/gallery/umich/umich-4.JPG',alt:'Candid graduation portrait in a dimly lit arcade space'},
      {src:'photography/gallery/umich/umich-5.JPG',alt:'Graduation portrait with flowers in bloom'}
    ]
  },
  {
    id:'msu-grad',
    title:'MSU grad',
    note:'East Lansing',
    description:'Film portraits and details from graduation day.',
    photos:[
      {src:'photography/gallery/msu/msu-1.JPG',alt:'Two graduates walking through an arched campus corridor'},
      {src:'photography/gallery/msu/msu-2.JPG',alt:'Two graduates photographed in an arched campus hallway'},
      {src:'photography/gallery/msu/msu-3.JPG',alt:'Graduate portrait beneath flowering trees'},
      {src:'photography/gallery/msu/msu-4.jpg',alt:'Graduate portrait in a green gown beneath spring blossoms'},
      {src:'photography/gallery/msu/msu-5.JPG',alt:'Group graduation portrait framed by a stone campus doorway'},
      {src:'photography/gallery/msu/msu-6.JPG',alt:'Two graduates seated in a campus archway'}
    ]
  },
  {
    id:'san-francisco',
    title:'San Francisco',
    note:'California',
    description:'City light, coastlines, and the Bay.',
    photos:[
      {src:'photography/gallery/sf/sf-1.JPG',alt:'Cliffside cave and cypress landscape above turquoise water'},
      {src:'photography/gallery/sf/sf-2.jpg',alt:'Curving coastline with teal water viewed from above'},
      {src:'photography/gallery/sf/sf-3.jpg',alt:'San Francisco skyline behind pastel Painted Ladies homes'},
      {src:'photography/gallery/sf/sf-4.jpg',alt:'Golden Gate Bridge in haze above flowering foreground'},
      {src:'photography/gallery/sf/sf-5.jpg',alt:'Dark water and sunset light over the Bay'},
      {src:'photography/gallery/sf/sf-6.jpg',alt:'Bay view framed by trees and a house on the edge of the frame'}
    ]
  },
  {
    id:'lake-tahoe',
    title:'Lake Tahoe',
    note:'California and Nevada',
    description:'Clear water, pines, and summer light.',
    photos:[
      {src:'photography/gallery/tahoe/tahoe-1.jpg',alt:'Forest-lined lake with mountains in the distance'},
      {src:'photography/gallery/tahoe/tahoe-2.jpg',alt:'Lake Tahoe shoreline seen from behind a wooden railing'},
      {src:'photography/gallery/tahoe/tahoe-3.jpg',alt:'Blue lake framed between two tree trunks'},
      {src:'photography/gallery/tahoe/tahoe-4.jpg',alt:'Clear turquoise water and boats near the forested shore'},
      {src:'photography/gallery/tahoe/tahoe-5.jpg',alt:'Lake view framed by tall tree trunks'},
      {src:'photography/gallery/tahoe/tahoe-6.jpg',alt:'Wide overlook of Lake Tahoe with rocks and pine trees'},
      {src:'photography/gallery/tahoe/tahoe-7.jpg',alt:'Rocky lake horizon under clear daylight'}
    ]
  },
  {
    id:'yosemite',
    title:'Yosemite',
    note:'California',
    description:'Granite walls, open meadows, and valley light.',
    photos:[
      {src:'photography/gallery/yosemite/yosemite-1.JPG',alt:'Dark lake and mountain scene in Yosemite'},
      {src:'photography/gallery/yosemite/yosemite-2.JPG',alt:'Granite ridge rising above the trees'},
      {src:'photography/gallery/yosemite/yosemite-3.JPG',alt:'El Capitan framed vertically against a blue sky'},
      {src:'photography/gallery/yosemite/yosemite-4.JPG',alt:'Granite wall with soft-focus greenery in the foreground'},
      {src:'photography/gallery/yosemite/yosemite-5.jpg',alt:'Yosemite Valley vista with meadow and granite formations'},
      {src:'photography/gallery/yosemite/yosemite-6.JPG',alt:'Yosemite Falls and meadow framed by trees'},
      {src:'photography/gallery/yosemite/yosemite-7.JPG',alt:'El Capitan and meadow in warm valley light'}
    ]
  },
  {
    id:'chicago',
    title:'Chicago',
    note:'Illinois',
    description:'Architecture, street light, and downtown texture.',
    photos:[
      {src:'photography/gallery/chicago/chicago-1.JPG',alt:'The Chrysler Building reflected in downtown Chicago light'},
      {src:'photography/gallery/chicago/chicago-2.JPG',alt:'Downtown street canyon with elevated tracks and evening light'},
      {src:'photography/gallery/chicago/chicago-3.jpg',alt:'Chicago street scene with tall buildings and warm light'},
      {src:'photography/gallery/chicago/chicago-4.JPG',alt:'Chicago skyline at sunset framed by taller buildings'}
    ]
  }
];
function PhotographyPage({onBack}){
  const [lightbox,setLightbox]=useState(null);
  const featured=photoCollections.find(section=>section.id==='san-francisco')?.photos?.[2]||photoCollections[0].photos[0];
  return <main className="photoPage photoGalleryPage"><AuraField tone="photography"/><header className="photoPageHeader"><button type="button" onClick={onBack}>← Portfolio</button><span>Photography</span></header><section className="photoGalleryIntro"><div className="photoGalleryCopy"><p>Film photography</p><h1>Selected work.</h1><span>UMich grad, MSU grad, San Francisco, Lake Tahoe, Yosemite, and Chicago.</span><small>Image-first, lightly organized, and meant to feel like a real gallery rather than a scrapbook.</small></div><figure className="photoHeroShot"><img loading="eager" decoding="async" src={featured.src} alt={featured.alt}/></figure></section><nav className="photoCollectionNav" aria-label="Photography collections">{photoCollections.map(section=><a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav><section className="photoGalleryStatement"><p>I shoot mostly on 35mm film and usually carry a camera when I am exploring somewhere new. This page keeps the presentation quiet so the photos do the work.</p></section>{photoCollections.map(section=><section id={section.id} key={section.id} className="photoCollectionSection"><div className="photoCollectionMeta"><p>{section.note}</p><h2>{section.title}</h2><span>{section.description}</span></div><div className="photoMasonry" aria-label={`${section.title} photo collection`}>{section.photos.map((photo,index)=><button type="button" className={`photoGalleryTile ${index===0?'lead':''}`} key={photo.src} onClick={()=>setLightbox(photo)} aria-label={`Open image from ${section.title}`}><img loading="lazy" decoding="async" src={photo.src} alt={photo.alt}/></button>)}</div></section>)}<ImageLightbox image={lightbox} onClose={()=>setLightbox(null)}/></main>
}

function ToolLogo({slug,name,mark}){
 const [failed,setFailed]=useState(false);
 return <span className={`toolLogoWrap ${failed?'fallback':''}`} data-tool={name} aria-label={name} title={name}>{failed?<span className="toolLogoFallback" aria-hidden="true">{mark}</span>:<img loading="lazy" decoding="async" src={`https://cdn.simpleicons.org/${slug}/3F3D3A`} alt="" onError={()=>setFailed(true)}/>}</span>
}
function ToolLogoStrip({id}){const items=toolSets[id]||[];if(!items.length)return null;return <section className="toolLogoSection"><h2>Tech Stack</h2><div className="toolLogoRow">{items.map(k=>{const [slug,name,mark]=toolLogoMap[k];return <ToolLogo key={k} slug={slug} name={name} mark={mark}/>})}</div></section>}


function CaseStudy({id,onBack}){
 const p=projects.find(x=>x.id===id);
 const [lightbox,setLightbox]=useState(null);
 if(!p)return null;
 const openClickedImage=(e)=>{const img=e.target instanceof HTMLImageElement?e.target:null;if(!img||img.closest('.caseCompanyBar')||img.closest('.toolLogoSection')||img.classList.contains('companyLogo'))return;setLightbox({src:img.currentSrc||img.src,alt:img.alt||'Project image'})};
 return <main className={`casePage case-${id}`} onClick={openClickedImage}><AuraField tone={id}/><button className="backBtn" onClick={onBack}>← Projects</button><header className="caseHeader"><CaseCompanyBar id={id} fallback={p.company}/><h1>{p.title}</h1><div className="caseIntro">{p.summary}</div>{id!=='commute'&&<div className="ownershipLine"><span>{ownership[id]}</span></div>}{id!=='commute'&&metrics[id]&&<MetricStrip items={metrics[id]}/>}</header><section className="caseHeroMedia casePreviewHero"><ProjectCover type={p.media}/></section><ToolLogoStrip id={id}/>
 {id==='commute'&&<><section className="sandboxSection commuteShowcase"><CommuteSandbox/></section><CaseSection title="Customer / User"><p><strong>First user:</strong> me. <strong>Broader user:</strong> anyone with a recurring commitment whose morning depends on several changing inputs.</p></CaseSection><CaseSection title="Why I built it"><p>Every morning I was doing the same calculation myself: when I needed to be there, how long I would take to get ready, when I had to leave, whether traffic was bad, whether BART was on time, whether the bus was actually coming, and what happened if I missed it.</p><p>At home in Michigan that meant checking traffic before driving. In the Bay Area it meant comparing BART, AC Transit, walking time, live arrivals, bridge traffic, and different missed-departure penalties. I did not want another place to search for directions. I wanted the morning decision to already be made.</p><p>Google Maps was useful once I already knew I was leaving. It could route the trip, but it could not answer the actual question I had every morning: when does my morning need to start? It did not know my routine, how early I wanted to arrive, whether I could trade part of that routine for more sleep, or how to weigh the cost of missing the next bus versus taking the safer train.</p></CaseSection><section className="caseSection caseNarrative"><h2>The model starts at the destination.</h2><div><div className="decisionSteps"><div><span>1</span><strong>Arrive</strong><p>Calendar commitment + chosen arrival buffer.</p></div><div><span>2</span><strong>Travel</strong><p>Candidate routes + walking + transfers + missed-departure cost.</p></div><div><span>3</span><strong>Check reality</strong><p>Live arrivals + traffic + service alerts + source freshness.</p></div><div><span>4</span><strong>Get ready</strong><p>Personal routine + observed walking behavior.</p></div><div><span>5</span><strong>Act</strong><p>Wake time + latest safe departure + recommended mode.</p></div></div></div></section><section className="caseSection technicalNote"><h2>What the native app would connect</h2><div><div className="dataSourceList"><div><strong>Google Routes</strong><span>walking + route geometry</span></div><div><strong>511 / GTFS-Realtime</strong><span>BART + AC Transit arrivals, vehicles, alerts</span></div><div><strong>511 traffic</strong><span>road incidents + bridge conditions</span></div><div><strong>HealthKit</strong><span>walking pace</span></div><div><strong>Calendar</strong><span>time + place</span></div><div><strong>Weather</strong><span>walking and road-context adjustment</span></div><div><strong>AlarmKit / iOS alarms</strong><span>wake-time execution in a native build</span></div><div><strong>Observed commute history</strong><span>route-specific walking and prediction error over time</span></div></div><p className="caseFinePrint"><strong>Browser prototype:</strong> deterministic demo data and simulated permissions. <strong>Native build:</strong> these are the intended integrations; the web demo does not claim to pull them live.</p></div></section><section className="caseSection decisionEditorial"><h2>Choices I made</h2><div className="principleList"><div><strong>Work backward from arrival.</strong><span>The commitment anchors the morning.</span></div><div><strong>Do not rebuild Maps.</strong><span>Routing is infrastructure; the product owns the morning decision.</span></div><div><strong>Optimize for time kept.</strong><span>Arriving 30 minutes early is not automatically better.</span></div><div><strong>Model the miss.</strong><span>A six-minute train headway and a 30-minute bus headway are different risks.</span></div><div><strong>Freshness changes trust.</strong><span>A bus position updated 20 seconds ago should not be weighted like one last updated eight minutes ago.</span></div><div><strong>Personalize only where it earns accuracy.</strong><span>Health is optional and improves walking estimates; route-specific observed history becomes stronger evidence over time.</span></div><div><strong>Interrupt only when the plan changes.</strong><span>No alert for a delay that changes nothing.</span></div></div></section><section className="caseSection scopeLine"><h2>Scope</h2><div><p><strong>V1:</strong> calendar · routine · Health · wake/leave · BART/AC Transit · traffic · alarms</p><p><strong>Later:</strong> driving in Michigan · recurring commute detection · deeper reliability learning</p><p><strong>Cut:</strong> social features · generic trip planning · analytics dashboard · navigation replacement</p></div></section><section className="caseSection measureLine"><h2>What would tell me it works</h2><div><p><strong>Arrival error</strong> · predicted vs. observed &nbsp; <strong>Unused buffer</strong> · minutes returned &nbsp; <strong>Prediction error</strong> · routine/walk/route &nbsp; <strong>Interruptions</strong> · how often the app needs attention</p><p><strong>North star:</strong> minutes of unnecessary buffer returned while maintaining the user’s chosen on-time threshold.</p></div></section></>}
 {id==='fcvf'&&<><CaseSection title="Customer / User"><p>Ford product owners and internal product teams used the framework to evaluate the customer value of a product or experience early enough to inform product decisions.</p></CaseSection><CaseSection title="Why I rebuilt it"><p>The framework already existed, but the working experience lived in Excel: one long file that was slow to complete, difficult to navigate, missing an easy path to help, vulnerable to accidental formula edits, and transparent about the value attached to each response.</p><div className="fcvfProblemGrid"><div><strong>Time</strong><span>One long assessment created unnecessary friction.</span></div><div><strong>Usability</strong><span>The spreadsheet made navigation and help harder than they needed to be.</span></div><div><strong>Integrity</strong><span>Formula and response values were visible while the assessment was being completed.</span></div></div></CaseSection><CaseSection title="User interviews I led:"><p>I interviewed users about the assessment experience and compared one-page and multi-page directions. The research changed the interaction model, not just the styling.</p><div className="researchDecision"><div><span>What I heard</span><strong>Seeing the full assessment at once felt overwhelming.</strong></div><b>→</b><div><span>What I noticed</span><strong>Showing the score live created a reason to revisit answers and push the result.</strong></div><b>→</b><div><span>What I changed</span><strong>I moved the experience to a multi-page flow and removed the live score during completion.</strong></div></div><div className="biasCallout"><span>Design consideration</span><h3>Live feedback can bias the measurement.</h3><p>If a user sees the exact score consequence of every answer, they can consciously or unconsciously change responses to reach a desired result. I treated that as a product-integrity problem, not just a UI preference.</p></div></CaseSection><CaseSection title="How the product evolved"><div className="iterationTimeline"><article><ExpandableImage onExpand={setLightbox} src="project-media/fcvf-iterations/slide6-pic8.png" alt="Original Excel Customer Value Framework assessment" label="01 · Original Excel"/><div><strong>What I started with</strong><p>A working spreadsheet assessment with the scoring logic and form fields in one file.</p><strong>What I learned</strong><p>The format added time, navigation friction, and exposed scoring values.</p><strong>What changed next</strong><p>I moved the workflow into a browser-based product.</p></div></article><article><ExpandableImage onExpand={setLightbox} src="project-media/fcvf-iterations/slide8-pic5.png" alt="Early one-page HTML Customer Value Framework MVP" label="02 · Lean MVP"/><div><strong>What I tried</strong><p>A usable one-page application built from basic HTML components with essentially no visual styling.</p><strong>What I learned</strong><p>Shipping the workflow early let product owners react before the team overbuilt the interface.</p><strong>What changed next</strong><p>I used the feedback to move into a designed single-page version.</p></div></article><article><ExpandableImage onExpand={setLightbox} src="project-media/fcvf-iterations/slide9-pic5.png" alt="Designed single-page Customer Value Framework application" label="03 · Designed one-page"/><div><strong>What I tried</strong><p>A Figma-led one-page experience with implemented score calculation and a more intentional interface.</p><strong>What I learned</strong><p>Feedback from product owners, users, and non-users still surfaced cognitive-load and response-integrity concerns.</p><strong>What changed next</strong><p>I compared one-page and multi-page approaches and focused interviews on usability.</p></div></article><article><ExpandableImage onExpand={setLightbox} src="project-media/fcvf-iterations/slide10-pic4.png" alt="Multi-page Customer Value Framework application with pagination" label="04 · Multi-page flow"/><div><strong>What I tried</strong><p>A paginated assessment that focused the user on one portion of the framework at a time.</p><strong>What I learned</strong><p>User feedback favored the clearer multi-page experience.</p><strong>What changed next</strong><p>I helped implement pagination and a visible sense of progress while keeping the in-progress score hidden.</p></div></article></div></CaseSection><CaseSection title="Scoring logic without score gaming"><div className="fcvfEvidencePair"><ExpandableImage onExpand={setLightbox} src="project-media/fcvf-iterations/slide6-pic5.png" alt="Original Excel response values for a Customer Value Framework question" label="Response values in the original workbook"/><ExpandableImage onExpand={setLightbox} src="project-media/fcvf-iterations/slide6-pic6.png" alt="Original Excel formula used in Customer Value Framework scoring" label="Visible formula logic"/></div><p>I preserved the underlying assessment logic while changing when the user could see its consequences. The goal was useful feedback after completion without influencing the answers used to produce the score.</p></CaseSection><CaseSection title="What shipped"><div className="finalArtifact"><ExpandableImage onExpand={setLightbox} src="project-media/ford-after.webp" alt="Final Ford Customer Value Framework experience" label="Final web experience"/><p>A web-based assessment with a clearer multi-page flow, a progress-oriented interaction model, and no live score influencing in-progress responses.</p></div></CaseSection></>}
 {id==='accenture'&&<><CaseSection title="Customer / User"><div className="factGrid"><Fact title="Enterprise requester">Needs enablement delivered with the right scope and timing.</Fact><Fact title="Coordinator">Turns the request into a workable delivery plan.</Fact><Fact title="Trainer">Needs an assignment they can realistically deliver.</Fact><Fact title="Learner">Needs training they can apply afterward.</Fact></div></CaseSection><CaseSection title="Operating it exposed what automation needed to know"><p>I supported the live request-to-delivery workflow across intake, routing, trainer assignment, scheduling, delivery, feedback, and follow-up. Working inside the process made the repeated handoff failures visible before I translated them into requirements.</p></CaseSection><CaseSection title="Customer evidence"><div className="evidenceNumbers"><div><strong>~2,200</strong><span>learner responses synthesized</span></div><div><strong>~20 → 8</strong><span>providers researched → competitors compared</span></div><div><strong>27 → 12 → 5</strong><span>metrics → patterns → recommendations</span></div></div></CaseSection><CaseSection title="Workflow"><p className="diagramNote">Simplified portfolio diagram based on the workflow I documented during the internship.</p><div className="journeyFlow aiJourney"><div><strong>Manual requests</strong><span>inconsistent inputs + coordination</span></div><b>→</b><div><strong>Structured intake</strong><span>consistent mapping fields</span></div><b>→</b><div><strong>Automation contract</strong><span>10 tabs of logic, inputs, and guardrails</span></div><b>→</b><div><strong>Prototype</strong><span>refined, tested, demonstrated</span></div></div></CaseSection><CaseSection title="Testing"><div className="edgeCaseCard"><span>Edge case caught during QA</span><strong>A proposed trainer assignment landed at 10:30 PM local time.</strong><p>That exposed a missing requirement: working hours and time zones needed to be part of the matching logic, not handled after assignment.</p></div></CaseSection><CaseSection title="Selected deliverables"><div className="deliverableGrid"><div><strong>10-tab data contract</strong><span>Structured automation inputs, mapping, and requirements.</span></div><div><strong>Evidence synthesis</strong><span>~2,200 learner responses plus market/adoption research.</span></div><div><strong>Enablement prototype</strong><span>Created, refined, tested, and demonstrated an early experience.</span></div><div><strong>Recommendation path</strong><span>Converted research into five recommendations and a 90-day pilot path.</span></div></div></CaseSection></>}
 {id==='scheduler'&&<><section className="productDelta"><div><span>Kept from When2Meet</span><strong>Fast grid input + shared heatmap</strong></div><b>→</b><div><span>What I changed</span><strong>Uncertain availability · repetitive entry · what happens after a time is picked</strong></div></section><section className="sandboxSection schedulerShowcase"><SchedulerSandbox/></section><CaseSection title="Customer / User"><p>I started as the user: a student repeatedly scheduling group work where tentative availability gets forced into yes/no, the overlap still needs interpretation, and everyone moves to another chat once a time is chosen.</p></CaseSection><CaseSection title="Starting point"><p>When2Meet already solves fast availability entry well. I kept the click-and-drag grid and shared overlap view, then built around the parts of group coordination I kept experiencing after the grid.</p></CaseSection><CaseSection title="What I added"><div className="factGrid"><Fact title="Availability is not always binary">Available / Maybe / Unavailable keeps uncertainty visible without turning the grid into a more complicated input.</Fact><Fact title="Entering time is repetitive">Quick-fill presets reduce repeated selection for predictable blocks.</Fact><Fact title="A heatmap still needs interpretation">Best Time to Meet converts overlap into a recommendation.</Fact><Fact title="Scheduling does not end with a time">Venue voting, participant status, notes, chat, sharing, and calendar export keep the next decisions in the same flow.</Fact></div></CaseSection><CaseSection title="Architecture"><div className="architecture"><span>Browser</span><b>↔</b><span>Socket.IO</span><b>↔</b><span>Flask</span><b>↔</b><span>MySQL</span></div><p>Docker and Google Cloud Run were used for deployment. This portfolio sandbox preserves the product behavior with local browser state so it can run on GitHub Pages without the original backend.</p></CaseSection><CaseSection title="Finished system"><p>The original application supported availability states, group overlap, best-time calculation, participant status, venue voting, notes, event chat, sharing, and calendar handoff.</p></CaseSection></>}
 {id==='finsimple'&&<><CaseSection title="Customer / User"><p>Ford Credit customers moving through a financing/account workflow were the primary users; the feature also had to fit the internal systems and teams operating the downstream data flow.</p></CaseSection><CaseSection title="Shipping into a system that already existed"><p>My second Ford internship moved from a greenfield intern-built application to FinSimple, a deployed financial product with existing customers, shared libraries, data dependencies, and production environments. As the sole intern embedded on the team, my feature had to fit the product and survive the system around it.</p></CaseSection><CaseSection title="Previous Estimates"><p>I owned requirements, UI/component development, integration, testing, and stakeholder coordination. The feature progressed from dummy data to an AEM component and then into the customer-facing flow.</p><div className="progression"><ExpandableImage onExpand={setLightbox} src="project-media/finsimple-dummy.png" alt="Dummy data stage" label="Dummy data"/><ExpandableImage onExpand={setLightbox} src="project-media/finsimple-aem.png" alt="AEM component stage" label="AEM component"/><ExpandableImage onExpand={setLightbox} src="project-media/finsimple-live.png" alt="Finished FinSimple stage" label="Customer-facing flow"/></div></CaseSection><CaseSection title="Customer + system flow"><div className="journeyFlow"><div><strong>Customer</strong><span>starts a financing/account workflow</span></div><b>→</b><div><strong>Web experience</strong><span>collects/displays information</span></div><b>→</b><div><strong>Service + API layer</strong><span>moves customer + contract data</span></div><b>→</b><div><strong>Salesforce</strong><span>creates/populates the downstream record</span></div></div></CaseSection><CaseSection title="What shipped"><div className="finalArtifact"><ExpandableImage onExpand={setLightbox} src="project-media/finsimple-live.png" alt="Finished FinSimple Previous Estimates feature" label="Final experience"/><p>A customer-facing feature delivered inside an existing enterprise product rather than as a standalone application.</p></div></CaseSection></>}
 {id==='chat'&&<><section className="sandboxSection"><ChatSandbox/></section><CaseSection title="Customer / User"><p>Multiple people in the same room who needed messages, presence, typing state, and reactions to stay consistent across clients.</p></CaseSection><CaseSection title="What made it interesting"><p>The hard part was not drawing message bubbles; it was keeping multiple clients in the same room consistent as people joined, typed, reacted, and left.</p><div className="factGrid"><Fact title="Messages">Socket.IO broadcasts new messages to every client in the room.</Fact><Fact title="Presence">Join and leave events update shared room state.</Fact><Fact title="Typing">Typing is ephemeral state, so it expires instead of becoming another message.</Fact><Fact title="Tapbacks">Reactions update the same message for everyone instead of creating a second event in the feed.</Fact></div></CaseSection></>}
 {id==='estee'&&<><CaseSection title="Customer / User"><p>Online beauty shoppers exploring Double Wear who need enough product context and confidence to decide whether the line is right for them, then a simple path to purchase.</p></CaseSection><CaseSection title="The challenge"><p>For the Kode With Klossy x Estée Lauder challenge, I worked on the product concept, UX/UI, and frontend for a Double Wear discovery experience. I treated it as more than a storefront. The goal was to make product research feel like part of the Estée Lauder brand experience, then carry that interest all the way to purchase.</p></CaseSection><CaseSection title="Product direction"><div className="factGrid"><Fact title="Feel immediately on-brand">I kept the experience elegant and minimal, using familiar Estée Lauder colors, typography, imagery, and navigation patterns so the site felt connected to the brand.</Fact><Fact title="Give shoppers a reason to keep exploring">An interactive question and concise benefit content turned product education into something more active than a static catalog page.</Fact><Fact title="Put the research in one place">The experience brought Double Wear benefits, product-line context, brand story, and purchase options into one guided flow.</Fact><Fact title="Make the next step easy">The purchase experience linked shoppers to eight established retailers instead of making them restart the search elsewhere.</Fact></div></CaseSection><CaseSection title="The journey I designed"><div className="esteeJourney"><div><span>01</span><strong>Draw the shopper in</strong><p>Lead with recognizable Double Wear imagery and a familiar brand shell.</p></div><div><span>02</span><strong>Invite interaction</strong><p>Use a question and benefit-led content to make discovery feel personal and scannable.</p></div><div><span>03</span><strong>Build product understanding</strong><p>Show the broader Double Wear line, key benefits, and brand context without turning the page into a dense product database.</p></div><div><span>04</span><strong>Close the loop</strong><p>Move from exploration to purchase through direct retailer options.</p></div></div></CaseSection><CaseSection title="What I made"><p>I built the experience around large product imagery, a benefits carousel, product exploration, and a purchase page while keeping the visual system cohesive across screens.</p><EsteeVisual/></CaseSection><CaseSection title="Responsive design"><p>The site was image-heavy, so responsive behavior became a real implementation problem rather than a final polish step. I reused responsive patterns across the visual elements and adjusted the layouts so the product story still held together as the viewport got smaller.</p></CaseSection><CaseSection title="Outcome"><p>The project finished as a Top 5 challenge finalist, and I presented the concept to Estée Lauder C-suite leadership.</p></CaseSection></>}
 {id!=='commute'&&!['fcvf','chat','estee'].includes(id)&&<CaseDecisionNotes id={id}/>}<ImageLightbox image={lightbox} onClose={()=>setLightbox(null)}/></main>
}

function CaseSection({title,children}){return <section className="caseSection"><h2>{title}</h2><div className="caseSectionBody">{children}</div></section>}
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
  return <article className={`moreBuildCard clickable project-${project.id}`}><a className="moreBuildAction" href={`#/projects/${project.id}`} onClick={(event)=>{event.preventDefault();onOpen(project.id)}} aria-label={`Open ${project.title}`}><div className="moreBuildVisual"><ProjectCover type={project.media}/></div><div className="moreBuildCopy"><span>{project.company}</span><h3>{project.title}</h3><span className="projectTextLink">View →</span></div></a></article>
}
function MoreTechnicalCard({title,subtitle,kind,description}){
  return <article className="moreBuildCard"><div className="moreBuildVisual technicalCompact"><TechnicalCard title={title} subtitle={subtitle} kind={kind} description={description}/></div></article>
}

function CompanyLogo({src='',alt='',label=''}){const [failed,setFailed]=useState(false);const fallback=label||alt.split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0]).join('').toUpperCase();return <div className={`companyLogo ${failed?'fallback':''}`}>{src&&!failed?<img loading="lazy" decoding="async" src={src} alt={alt} onError={()=>setFailed(true)}/>:<strong className="logoText" aria-label={alt}>{fallback}</strong>}</div>}


const experienceItems=[
 {id:'accenture',company:'Accenture',role:'Technology Summer Analyst',location:'San Francisco, CA',dates:'Summer 2026',logo:'company-logos/accenture-v31.png',short:'GTM enablement, product operations, and automation readiness for a frontier AI lab.',detail:<div className="expStory"><p>I worked inside a live customer-enablement operation, then used what broke in practice to improve the system around it by standardizing workflows, defining automation requirements, QA-testing edge cases, prototyping the request experience, and turning learner and market evidence into recommendations for what should come next.</p><div className="expMetricRow"><span><b>21</b> live requests</span><span><b>6</b> workflow stages</span><span><b>10-tab</b> data contract</span><span><b>~2.2K</b> learner responses</span></div><div className="expColumns"><div><strong>Operate</strong><span>Supported request intake, validation, trainer fit, scheduling, status management, global coverage across six regions, and closeout.</span></div><div><strong>Systematize</strong><span>Translated coordinator judgment into schemas, matching rules, warnings, reason codes, QA cases, and human-review paths. A 10:30 PM local-time assignment exposed a missing working-hours and time-zone guardrail.</span></div><div><strong>Recommend</strong><span>Analyzed ~2.2K learner responses and benchmarked ~20 providers, structuring the research into 27 metrics, 12 patterns, five recommendations, and a 90-day path.</span></div></div></div>},
 {id:'palmer',company:'Russell Palmer Career Management Center',role:'Peer Coach',location:'East Lansing, MI',dates:'May 2025-present',logo:'company-logos/palmer-v31.png',short:'Coach students through recruiting decisions one conversation at a time.',detail:<div className="expStory"><p>I diagnose what is actually blocking a student: positioning, resume evidence, interview structure, networking, or case prep, then turn it into a concrete next step.</p><div className="expMetricRow"><span><b>20+</b> sessions weekly</span><span><b>300+</b> students coached</span><span><b>25</b> coaches on team</span><span><b>~40%</b> of positive feedback in one 800-appointment snapshot</span></div></div>},
 {id:'fordcredit',company:'Ford Credit',role:'Software Engineering Intern',location:'Dearborn, MI',dates:'Summers 2024-2025',logo:'company-logos/ford-credit-v31.png',short:'Customer-facing financial features, cross-team delivery, and production operations.',detail:<div className="expStory"><p>As the sole intern embedded on FinSimple, I worked from customer-facing feature delivery into the systems around shipping reliably: AEM, Salesforce APIs, QA and production environments, release coordination, incidents, and onboarding.</p><div className="expMetricRow"><span><b>40%</b> faster release cycle</span><span><b>20+</b> incidents analyzed</span><span><b>4</b> recovery playbooks</span><span><b>50</b> people across 5 teams</span></div><div className="expColumns"><div><strong>Product</strong><span>Translated customer and business requirements into AEM components and Salesforce-backed workflows; worked across UI behavior, REST/GraphQL integration, Postman validation, and testing through development, QA, and production.</span></div><div><strong>Delivery</strong><span>Owned an Agile workstream for a seven-person engineering team, tracked requirements and dependencies across Rally/Jira-style planning, Jenkins CI/CD and ServiceNow release workflows, and coordinated risks across five teams; broader delivery finished 10% ahead of schedule.</span></div><div><strong>Operations</strong><span>Used Splunk and ServiceNow to analyze customer-impacting incidents and turned recurring failure modes into four reusable recovery playbooks.</span></div></div><div className="expNote">Also built a centralized onboarding hub from 15 technical resources across 3 teams, cutting intern ramp-up from ~2 weeks to 3 days.</div></div>},
 {id:'pwc',company:'PwC × Arc of Indiana',role:'Consulting Extern',location:'',dates:'Aug-Oct 2024',logo:'company-logos/pwc-v31.png',short:'Turned peer benchmarking into a repeatable strategy framework for a nonprofit client.',detail:<div className="expStory"><p>Built a weighted seven-category scorecard and evaluation rubric, then used it to compare five peer organizations across 10+ engagement and innovation metrics.</p><div className="expMetricRow"><span><b>7</b> scorecard categories</span><span><b>5</b> peer organizations</span><span><b>10+</b> metrics</span><span><b>5</b> recommendations adopted</span></div></div>},
 {id:'ford',company:'Ford Motor Company',role:'Software Engineering Intern',location:'Dearborn, MI',dates:'Summer 2023',logo:'company-logos/ford.png',short:'Built a customer-feedback product and used user research to improve the experience.',detail:<div className="expStory"><p>My first internship put me close to both the code and the user. On a 10-person team, I helped build the full-stack Customer Value Framework, interviewed users, and translated what we learned into changes to the product and implementation.</p><div className="expMetricRow"><span><b>4</b> user interviews</span><span><b>100+</b> Git commits</span><span><b>7</b> legacy CSS files replaced</span><span><b>+25%</b> feedback volume</span></div><div className="expColumns two"><div><strong>What I owned</strong><span>Frontend and backend implementation, accessibility improvements, refactoring, user interviews, Agile planning, and translating product feedback into interface changes, including pagination and score-visibility changes.</span></div><div><strong>What changed</strong><span>We moved toward a multi-page experience, removed the in-progress score, and replaced seven legacy CSS files with a more maintainable Material-UI approach while feedback volume increased 25%.</span></div></div></div>},
 {id:'spectrum',company:'Spectrum Consulting Group',role:'Consultant',location:'East Lansing, MI',dates:'2022-2026',logo:'company-logos/spectrum-v31.png',short:'Delivered client strategy across hospitality, utilities, automotive, and food-business engagements.',detail:<div className="expStory"><div className="expMetricRow"><span><b>3,000+</b> survey responses</span><span><b>19</b> utility KPIs</span><span><b>$15K</b> automotive workstream</span><span><b>2</b> analysts mentored</span></div><div className="expColumns"><div><strong>Hospitality</strong><span>Found engagement gaps across 3,000+ responses and recommended three digital initiatives that increased social interaction by 20%.</span></div><div><strong>Utilities</strong><span>Built a criticality/feasibility rubric, defined 19 KPIs, and evaluated three software options for a multimillion-dollar utility.</span></div><div><strong>Automotive</strong><span>Led the analysis workstream, translated pain points and funnel evidence into implementation-ready recommendations, and redesigned lead-management workflows.</span></div></div><div className="expNote">Additional work included a food-business strategy engagement and team mentorship.</div></div>},
];

function ExperienceSection({onAura}){
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
 return <section id="experience" className="section experienceSection v28Experience"><div className="sectionTitle compactTitle"><h2>Experience</h2></div><div className="experienceAccordion">{experienceItems.map(x=>{const isOpen=openIds.includes(x.id);return <article ref={el=>{if(el)itemRefs.current[x.id]=el}} className={`experienceItem experience-${x.id} ${isOpen?'open':''}`} key={x.id}><button className="experienceSummary" onClick={()=>toggle(x.id)} aria-expanded={isOpen} aria-label={`${x.company}: ${isOpen?'collapse details':'expand details'}`}><CompanyLogo src={x.logo} alt={x.company}/><div><h3>{x.company}</h3><span className="experienceRole">{x.role}</span>{x.location&&<span className="experienceLocation">{x.location}</span>}<p>{x.short}</p></div><time>{x.dates}</time><b className="expToggle" aria-hidden="true">{isOpen?'−':'+'}</b></button><div className="experienceDetail" aria-hidden={!isOpen} hidden={!isOpen}><div>{x.detail}</div></div></article>})}</div></section>
}


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
 return <form className={`bookRecForm ${status}`} onSubmit={submit}><div className="bookRecRow"><input id="book-rec" aria-label="Leave me a book rec" value={book} onChange={e=>{setBook(e.target.value);if(status==='error'||status==='sent')setStatus('idle')}} placeholder={status==='sent'?'Added to my reading list :)':'Leave me a book rec'} autoComplete="off" disabled={status==='sending'||status==='sent'}/><button type="submit" disabled={!book.trim()||status==='sending'||status==='sent'}>{status==='sending'?'Sending…':status==='sent'?'Sent ✓':'Submit'}</button></div>{status==='error'&&<span className="bookRecStatus" role="status">Couldn’t send that one. Try again.</span>}</form>
}

function Home({openCase}){
 const [auraTone,setAuraTone]=useState('default');
 const serious=['fcvf','finsimple','accenture','scheduler'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 const fun=['commute','chat','estee'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 return <>
 <a className="skipLink" href="#main-content">Skip to content</a><AuraField tone={auraTone}/>
 <header className="siteHeader"><a className="wordmark" href="#top">Neha Chinimilli</a><nav aria-label="Primary"><a href="#experience">Experience</a><a href="#projects">Projects</a><a href="#fun">Fun builds</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume</a></nav></header>
 <main id="main-content">
  <section id="top" className="hero v28Hero"><div className="heroInner"><h1>Neha Chinimilli</h1><p className="heroThesis">Computer Science + Supply Chain Management at Michigan State University</p><div className="heroLinks"><a className="primaryHeroLink" href="#projects">View projects ↓</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div></div></section>
  <ExperienceSection onAura={setAuraTone}/>
  <section id="projects" className="section projectsSection v28Projects"><div className="sectionTitle compactTitle"><h2>Projects</h2></div><div className="balancedProjectGrid">{serious.map((p,i)=><ProjectCard project={p} index={i} key={p.id} featured={false} onOpen={openCase}/>)}</div></section>
  <section id="fun" className="section moreSection v28Fun"><div className="sectionTitle compactTitle"><h2>Fun things I’ve built</h2></div><div className="funLeadGrid">{fun.map(p=><MoreProjectCard key={p.id} project={p} onOpen={openCase}/>)}</div><div className="smallBuildGrid"><article className="smallBuild"><div className="techVisual game"><div className="spartanScene"><img className="spartanBg" src="project-media/spartan-background.png" alt="Spartan Touchdown level"/><div className="spartanGround"></div><img className="spartySprite" src="project-media/sparty.png" alt="Sparty"/><img className="enemySprite" src="project-media/um-enemy.png" alt="Michigan enemy"/></div></div><h3>Spartan Touchdown</h3><p>C++ football game.</p></article><article className="smallBuild"><div className="techVisual fluids"><img src="project-media/stable-fluids.png" alt="Stable Fluids simulation"/></div><h3>Stable Fluids</h3><p>Interactive C++ fluid simulation.</p></article></div></section>
  <section id="about" className="section aboutSection"><div className="aboutPhoto"><img src="headshot.jpg" alt="Neha Chinimilli" width={1066} height={1599}/></div><div className="aboutCopy"><h2>About me</h2><p>I’m Neha. I study Computer Science and Supply Chain Management at Michigan State, which means I spend a lot of time bouncing between how systems work and how people actually use them.</p><p>I like building things that make an annoying process a little easier, whether that is a product at work, a class project, or something I made because I got tired of doing the same thing manually.</p><details className="outsideWork"><summary>Outside of work <span aria-hidden="true">+</span></summary><div><p><strong>Film photography.</strong> City scenes, coastlines, color, and little details I would have walked past otherwise. <a className="photoCta" href="#/photography">Check out my pics →</a></p><p><strong>Otherwise.</strong> Coffee, traveling, reading thrillers and classics, baking, hiking, painting, reality TV, and falling into Wikipedia and Reddit rabbit holes.</p><BookRecForm/></div></details></div></section>
 </main><footer className="siteFooter"><span>© 2026 Neha Chinimilli</span><nav aria-label="Footer"><a href="mailto:chinimi2@msu.edu">Email</a><a href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></nav></footer>
 </>
}
function App(){
 const route=()=>{const project=window.location.hash.match(/^#\/projects\/([^/?#]+)/);if(project)return {type:'case',id:project[1]};if(window.location.hash.startsWith('#/photography'))return {type:'photography'};return {type:'home'}};
 const [current,setCurrent]=useState(route);
 const homeScroll=useRef(0);
 useEffect(()=>{const onHash=()=>setCurrent(route());window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[]);
 const transition=(fn)=>{const d=document;if(d.startViewTransition)d.startViewTransition(fn);else fn()};
 const openCase=(id)=>{homeScroll.current=window.scrollY;transition(()=>{window.location.hash=`/projects/${id}`;setCurrent({type:'case',id});requestAnimationFrame(()=>window.scrollTo(0,0))})};
 const closeRoute=()=>transition(()=>{history.pushState(null,'',window.location.pathname+window.location.search);setCurrent({type:'home'});requestAnimationFrame(()=>window.scrollTo(0,homeScroll.current))});
 if(current.type==='case')return <CaseStudy id={current.id} onBack={closeRoute}/>;
 if(current.type==='photography')return <PhotographyPage onBack={closeRoute}/>;
 return <Home openCase={openCase}/>;
}

createRoot(document.getElementById('root')).render(<App/>);
