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
    summary:'Replaced an Excel-based customer-value assessment with a web application shaped by four user interviews and design testing.',
    media:'fcvf',
    facts:['4 user interviews','Live score removed after research']
  },
  {
    id:'accenture',
    title:'AI Enablement Operations',
    company:'Accenture · frontier AI lab account',
    summary:'Structured a manual enablement workflow, translated judgment into automation requirements, synthesized customer evidence, and tested an early prototype.',
    media:'accenture',
    facts:['~2,200 learner responses','10-tab automation data contract']
  },
  {
    id:'scheduler',
    title:'Collaborative Scheduling Platform',
    company:'',
    summary:'Kept When2Meet’s fast grid and heatmap, then extended the workflow with tentative availability, faster entry, recommendations, venues, and event coordination.',
    media:'scheduler',
    facts:['Interactive sandbox','Flask · Socket.IO · MySQL']
  },
  {
    id:'finsimple',
    title:'FinSimple',
    company:'Ford Credit',
    summary:'Shipped customer-facing feature work inside an existing financial platform across UI, APIs, Salesforce, testing, and stakeholder coordination.',
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

function FCVFVisual(){
  return <div className="comparisonVisual">
    <figure><figcaption>Before</figcaption><img loading="lazy" decoding="async" src="project-media/ford-before.webp" alt="Original Ford Excel assessment"/></figure>
    <figure><figcaption>After</figcaption><img loading="lazy" decoding="async" src="project-media/ford-after.webp" alt="Ford Customer Value Framework web application"/></figure>
  </div>
}
function FinSimpleVisual(){
  return <div className="finsimpleVisual">
    <img loading="lazy" decoding="async" className="mainShot" src="project-media/finsimple-live.png" alt="Finished FinSimple Previous Estimates experience"/>
    <div className="thumbRow"><img loading="lazy" decoding="async" src="project-media/finsimple-dummy.png" alt="Previous Estimates with dummy data"/><img loading="lazy" decoding="async" src="project-media/finsimple-aem.png" alt="Previous Estimates AEM implementation"/></div>
  </div>
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
  return <div className="accentureVisual workflowCanvas" aria-label="Simplified enterprise AI enablement workflow">
    <div className="workflowTitle"><span>Trainer assignment</span><strong>Matching worked — the local time did not</strong></div>
    <div className="workflowColumns">
      <div className="workflowNode"><span>Request</span><strong>Customer · region · topic · timing</strong></div>
      <b aria-hidden="true">→</b>
      <div className="workflowNode"><span>Matching</span><strong>Language · expertise · availability · time zone</strong></div>
      <b aria-hidden="true">→</b>
      <div className="workflowNode"><span>Review</span><strong>Reason codes · warnings · human check</strong></div>
    </div>
    <div className="workflowEvidence"><div><strong>~2,200</strong><span>learner responses synthesized</span></div><div><strong>10-tab</strong><span>automation data contract</span></div></div>
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
  if(view==='why') return <div className="commutePhone"><div className="phoneStatus">9:41</div><div className="commuteNav">‹ <strong>{recommendation}</strong></div><div className="whyLead">{takeBart?'The bus could still be faster. Missing it is the bigger risk.':'The bus is worth catching right now.'}</div><p className="whyCopy">{takeBart?`NL is about ${busDelay} min behind and bridge traffic is ${bridge}. BART leaves you more recovery room.`:`The bus is close, traffic is ${bridge}, and waiting for BART costs more time today.`}</p><div className="routeCompare"><div><strong>BART</strong><span>Leave {fm(leave)}</span><span>Arrive 8:48–8:53</span><small>Miss it → next train ~6 min later</small></div><div><strong>NL</strong><span>Leave 8:09</span><span>Arrive 8:42–9:04</span><small>Miss it → next useful bus ~28 min later</small></div></div></div>;
  return <div className="commutePhone"><div className="phoneStatus">9:41</div><div className="commuteDate">FRIDAY · AUG 21</div><div className="commuteDestination"><span>Salesforce Tower</span><strong>9:00 AM</strong></div><div className="wakeHero"><strong>{fm(wake)}</strong><span>Wake up</span><small>Alarm set</small></div><div className="morningLine"><div><b>{fm(leave)}</b><span>Leave home</span></div><div><b>8:19</b><span>19th St BART</span></div><div><b>8:51</b><span>Salesforce Tower</span></div></div><div className="recommendLine"><strong>{recommendation}</strong><span>{takeBart?'19th St → Embarcadero':'Grand Ave → Salesforce Transit Center'}</span><small>{stale?'Live transit data unavailable · using schedule':takeBart?'Safer choice this morning':'Worth catching this morning'}</small></div><button className="sleepBtn" onClick={onWait}>Can I sleep longer?</button></div>
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
  const [origin,setOrigin]=useState('230 Bay Pl, Oakland');
  const [destination,setDestination]=useState('Salesforce Tower');
  const [arrive,setArrive]=useState('09:00');
  const [buffer,setBuffer]=useState(8);
  const [health,setHealth]=useState(false);
  const [healthSheet,setHealthSheet]=useState(false);
  const [calendar,setCalendar]=useState(false);
  const [routine,setRoutine]=useState(commuteRoutineDefaults);
  const [tab,setTab]=useState('today');
  const [detail,setDetail]=useState(null);
  const [busDelay,setBusDelay]=useState(6);
  const [bartDelay,setBartDelay]=useState(0);
  const [bridge,setBridge]=useState('building');
  const [stale,setStale]=useState(false);
  const [sleepOffset,setSleepOffset]=useState(0);
  const [toast,setToast]=useState('');
  const routineMinutes=routine.reduce((n,x)=>n+x.minutes,0);
  const walkMinutes=health?10:8;
  const busRisk=busDelay*4+(bridge==='heavy'?18:bridge==='building'?10:0)+(stale?12:0);
  const bartRisk=bartDelay*3+(stale?10:0);
  const takeBart=bartRisk<=busRisk;
  const route=takeBart?'BART':'NL bus';
  const arriveTarget=Number(arrive.slice(0,2))*60+Number(arrive.slice(3));
  const transitMinutes=takeBart?35+bartDelay:31+Math.ceil(busDelay*.7)+(bridge==='heavy'?10:bridge==='building'?5:0);
  const leaveMin=arriveTarget-buffer-transitMinutes-walkMinutes;
  const wakeMin=leaveMin-routineMinutes+sleepOffset;
  const fmt=m=>{m=(m+1440)%1440;const h=Math.floor(m/60),mm=m%60;return `${h%12||12}:${String(mm).padStart(2,'0')} ${h>=12?'PM':'AM'}`};
  const next=()=>setStage(x=>x==='welcome'?'routine':x==='routine'?'health':x==='health'?'calendar':x==='calendar'?'trip':'app');
  const flash=t=>{setToast(t);window.setTimeout(()=>setToast(''),1800)};
  const changeRoutine=(id,delta)=>setRoutine(r=>r.map(x=>x.id===id?{...x,minutes:Math.max(1,x.minutes+delta)}:x));
  const freshness={
    bart:{tone:stale?'warn':'live',label:stale?'updated 6m ago':'updated now'},
    nl:{tone:stale?'warn':'live',label:stale?'updated 4m ago':'updated now'},
    traffic:{tone:stale?'warn':'live',label:stale?'updated 5m ago':'updated now'}
  };
  const Fresh=({tone,label})=><span className={`freshness ${tone}`}><i></i>{label}</span>;

  const chrome=(content)=><div className="iosDemoShell"><div className="iosDynamicIsland"></div><div className="iosStatus"><span>9:41</span><span>●●● 5G ▰</span></div>{content}{toast&&<div className="iosToast">{toast}</div>}</div>;

  if(stage==='welcome') return chrome(<div className="iosOnboarding iosWelcome"><div className="iosBrandMark">C</div><div><h3>Commute</h3><h2>Your morning, timed backwards.</h2><p>Tell Commute where you need to be. It works out when to wake up, when to leave, and which familiar route makes sense that day.</p></div><button className="iosPrimary" onClick={next}>Get started</button><button className="iosTextBtn" onClick={()=>setStage('app')}>Try with demo data</button></div>);

  if(stage==='routine') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button onClick={()=>setStage('welcome')}>‹</button><span>1 of 4</span></div><h2>What happens before you leave?</h2><p className="iosSub">Start with a rough morning. You can change this anytime.</p><div className="routineEditor">{routine.map(x=><div className="routineItem" key={x.id}><span>{x.name}</span><div><button onClick={()=>changeRoutine(x.id,-1)}>−</button><strong>{x.minutes} min</strong><button onClick={()=>changeRoutine(x.id,1)}>+</button></div></div>)}</div><div className="routineSummary"><span>Typical morning</span><strong>{routineMinutes} min</strong></div><button className="iosPrimary" onClick={next}>Continue</button></div>);

  if(stage==='health') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button onClick={()=>setStage('routine')}>‹</button><span>2 of 4</span></div><h2>Make walking estimates yours.</h2><p className="iosSub">With permission, Commute can use walking-speed data to personalize how long you need to reach transit.</p><div className="healthPreview"><div className="healthGlyph">♥</div><div><strong>Apple Health</strong><span>{health?'Connected · walking speed':'Not connected'}</span></div></div><button className="iosPrimary" onClick={()=>setHealthSheet(true)}>{health?'Health connected':'Connect Health'}</button><button className="iosTextBtn" onClick={next}>Not now</button>{healthSheet&&<div className="iosPermissionSheet"><div className="sheetHandle"></div><div className="healthGlyph big">♥</div><h3>Allow “Commute” to read?</h3><p>Walking Speed</p><div className="permissionRow"><span>Walking Speed</span><span className="iosSwitch on"><i></i></span></div><small>This portfolio demo simulates the native Health permission. No health data leaves this page.</small><button className="iosPrimary" onClick={()=>{setHealth(true);setHealthSheet(false);flash('Walking personalization on')}}>Allow</button><button className="iosTextBtn" onClick={()=>setHealthSheet(false)}>Don’t Allow</button></div>}</div>);

  if(stage==='calendar') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button onClick={()=>setStage('health')}>‹</button><span>3 of 4</span></div><h2>Let your calendar do the setup.</h2><p className="iosSub">Commute can find the first place you need to be and build the morning around it.</p><div className="calendarPreview"><span>9:00 AM</span><div><strong>Frontier AI lab team</strong><small>Salesforce Tower</small></div></div><button className="iosPrimary" onClick={()=>{setCalendar(true);flash('Calendar connected');window.setTimeout(next,350)}}>{calendar?'Calendar connected':'Connect Calendar'}</button><button className="iosTextBtn" onClick={next}>Enter trips myself</button></div>);

  if(stage==='trip') return chrome(<div className="iosOnboarding"><div className="iosNavRow"><button onClick={()=>setStage('calendar')}>‹</button><span>4 of 4</span></div><h2>Your first morning.</h2><div className="iosField"><label>From</label><input value={origin} onChange={e=>setOrigin(e.target.value)}/></div><div className="iosField"><label>To</label><input value={destination} onChange={e=>setDestination(e.target.value)}/></div><div className="iosField split"><label>Arrive by</label><input type="time" value={arrive} onChange={e=>setArrive(e.target.value)}/></div><div className="bufferRow"><span>Arrival buffer</span><div><button onClick={()=>setBuffer(Math.max(0,buffer-1))}>−</button><strong>{buffer} min</strong><button onClick={()=>setBuffer(buffer+1)}>+</button></div></div><button className="iosPrimary" onClick={next}>Build my morning</button></div>);

  const today=<div className="iosAppScreen"><div className="appTop"><div><span>Friday · Aug 21</span><h3>Good morning, {name}</h3></div><button className="avatarBtn" onClick={()=>setDetail('profile')}>{name[0]}</button></div><div className="destinationLine"><span>{destination}</span><strong>{fmt(arriveTarget)}</strong></div><div className="bigMoment"><strong>{fmt(wakeMin)}</strong><span>Wake up</span><small>Alarm set</small></div><div className="morningTimeline"><div><b>{fmt(leaveMin)}</b><span>Leave home</span></div><i></i><div><b>{takeBart?'8:19 AM':'8:17 AM'}</b><span>{takeBart?'19th St BART':'Grand Ave bus'}</span></div><i></i><div><b>{fmt(arriveTarget-buffer)}</b><span>Arrive</span></div></div><button className="routeRecommendation" onClick={()=>setDetail('why')}><span><strong>{route}</strong><small>{takeBart?'19th St → Embarcadero':'Grand Ave → Salesforce Transit Center'}</small></span><b>›</b></button><div className="liveSources"><span>BART <Fresh {...freshness.bart}/></span><span>AC Transit NL <Fresh {...freshness.nl}/></span><span>Bay Bridge <Fresh {...freshness.traffic}/></span></div><p className="stateSentence">{stale?'Some live sources are stale. Recent schedules and observed patterns are carrying more weight.':takeBart?'The bus is less forgiving this morning.':'The bus is worth catching this morning.'}</p><button className="sleepAction" onClick={()=>setDetail('sleep')}>Can I sleep longer?</button></div>;

  const plan=<div className="iosAppScreen"><div className="appTop"><div><span>Morning plan</span><h3>{destination}</h3></div><button onClick={()=>setDetail('edit')}>Edit</button></div><div className="planList"><div><time>{fmt(wakeMin)}</time><span>Wake up</span></div><div><time>{fmt(leaveMin)}</time><span>Leave {origin.split(',')[0]}</span></div><div><time>{takeBart?'8:19 AM':'8:17 AM'}</time><span>{route}</span></div><div><time>{fmt(arriveTarget-buffer)}</time><span>Arrive · {buffer} min early</span></div><div><time>{fmt(arriveTarget)}</time><span>{destination}</span></div></div><button className="iosSecondary" onClick={()=>setDetail('conditions')}>View commute conditions</button></div>;

  const settings=<div className="iosAppScreen"><div className="appTop"><div><span>Personalization</span><h3>Commute learns carefully.</h3></div></div><div className="settingsList"><button onClick={()=>setStage('routine')}><span>Morning routine</span><b>{routineMinutes} min ›</b></button><button onClick={()=>setStage('health')}><span>Health</span><b>{health?'Walking speed on':'Off'} ›</b></button><button onClick={()=>setStage('calendar')}><span>Calendar</span><b>{calendar?'Connected':'Off'} ›</b></button><button onClick={()=>setDetail('edit')}><span>Saved commute</span><b>{destination} ›</b></button></div><button className="resetDemo" onClick={()=>{setStage('welcome');setTab('today');setDetail(null)}}>Restart demo</button></div>;

  const main=tab==='today'?today:tab==='plan'?plan:settings;
  return chrome(<>{main}<nav className="iosTabBar"><button className={tab==='today'?'active':''} onClick={()=>{setTab('today');setDetail(null)}}><span>⌂</span><small>Today</small></button><button className={tab==='plan'?'active':''} onClick={()=>{setTab('plan');setDetail(null)}}><span>◷</span><small>Plan</small></button><button className={tab==='settings'?'active':''} onClick={()=>{setTab('settings');setDetail(null)}}><span>⋯</span><small>More</small></button></nav>{detail==='why'&&<div className="iosFullSheet"><div className="sheetNav"><button onClick={()=>setDetail(null)}>Done</button><strong>Why {route}?</strong><span></span></div><h2>{takeBart?'The bus could still be faster. Missing it is the bigger risk.':'BART is steadier. The bus saves enough time today.'}</h2><div className="routeFacts"><div><div className="routeFactHead"><strong>BART</strong><Fresh {...freshness.bart}/></div><span>Arrive 8:48–8:53</span><small>{bartDelay?`+${bartDelay} min delay`:'Running normally'} · next train ~6 min</small></div><div><div className="routeFactHead"><strong>NL bus</strong><Fresh {...freshness.nl}/></div><span>Arrive 8:42–9:04</span><small>+{busDelay} min · bridge {bridge}</small><span className="trafficFresh">Bay Bridge <Fresh {...freshness.traffic}/></span></div></div><p>{takeBart?'If you miss the NL, the next useful departure is much farther away. BART gives you more recovery room before 9:00.':'The bus is close enough and bridge conditions are favorable enough to justify the less reliable option.'}</p><button className="iosSecondary" onClick={()=>setDetail('conditions')}>See conditions</button></div>}{detail==='sleep'&&<div className="iosFullSheet"><div className="sheetNav"><button onClick={()=>setDetail(null)}>Done</button><strong>Sleep longer?</strong><span></span></div><h2>How much more time do you want?</h2><div className="sleepChoices">{[5,10,15].map(n=><button key={n} onClick={()=>{setSleepOffset(n);flash(n<=10?`Alarm moved ${n} min later`:'That makes the morning tight');setDetail(null)}}><strong>+{n} min</strong><span>{n<=10?'Still workable':'Tight'}</span></button>)}</div></div>}{detail==='conditions'&&<div className="iosFullSheet"><div className="sheetNav"><button onClick={()=>setDetail(null)}>Done</button><strong>Conditions</strong><span></span></div><div className="sourceStatusList"><div><span>BART arrivals</span><Fresh {...freshness.bart}/></div><div><span>AC Transit NL arrivals</span><Fresh {...freshness.nl}/></div><div><span>Bay Bridge traffic</span><Fresh {...freshness.traffic}/></div></div><div className="conditionRows"><label>NL delay <b>+{busDelay} min</b><input type="range" min="0" max="18" value={busDelay} onChange={e=>setBusDelay(+e.target.value)}/></label><label>BART delay <b>+{bartDelay} min</b><input type="range" min="0" max="15" value={bartDelay} onChange={e=>setBartDelay(+e.target.value)}/></label><label>Bridge<select value={bridge} onChange={e=>setBridge(e.target.value)}><option value="clear">Clear</option><option value="building">Building</option><option value="heavy">Heavy</option></select></label><label className="toggleLine"><span>Stale live feed</span><input type="checkbox" checked={stale} onChange={e=>setStale(e.target.checked)}/></label></div></div>}{detail==='edit'&&<div className="iosFullSheet"><div className="sheetNav"><button onClick={()=>setDetail(null)}>Done</button><strong>Saved commute</strong><span></span></div><div className="iosField"><label>From</label><input value={origin} onChange={e=>setOrigin(e.target.value)}/></div><div className="iosField"><label>To</label><input value={destination} onChange={e=>setDestination(e.target.value)}/></div><div className="iosField"><label>Arrive by</label><input type="time" value={arrive} onChange={e=>setArrive(e.target.value)}/></div></div>}</>);
}

function CommutePreview(){
  return <div className="commutePreview"><div className="commutePreviewPhoto"><img src="https://images.unsplash.com/photo-1755975696371-73756a4a382c?fm=jpg&q=76&w=1400" alt="BART train in San Francisco, photo by Anthony Sebbo on Unsplash"/><span>Oakland → San Francisco</span></div><div className="commutePreviewPhone"><CommutePhone/></div><div className="commutePreviewNote"><span>One recurring question</span><strong>How long can I stay home?</strong><p>The product works backward from the first place you need to be.</p></div></div>
}

function CommuteSandbox(){
  return <div className="commuteSandbox immersiveSandbox"><div className="iphoneDemoStage"><CommuteAppDemo/></div><p className="sandboxFinePrint">Demo data only. Health, Calendar, location, and live transit permissions are simulated.</p></div>
}

function CommuteInUse(){return <div className="commuteInUse"><figure className="usagePhoto"><img src="https://images.unsplash.com/photo-1671641911931-c8b5f05f4251?fm=jpg&q=76&w=1600" alt="Salesforce Tower in San Francisco, photo by Georg Eiermann on Unsplash"/><figcaption>Photo: Georg Eiermann / Unsplash</figcaption></figure><div className="usagePhone"><CommutePhone busDelay={2} bridge="clear"/></div><div className="lockMock"><span>7:54</span><strong>Leave in 12 min</strong><small>BART · 19th St</small><i>Everything is on track.</i></div></div>}

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
  return <Reveal className={featured?'projectCardReveal featured':''}>
    <article className={`projectCard ${featured?'featured':''}`} role="link" tabIndex={0} aria-label={`Open ${project.title} case study`} onMouseEnter={()=>onAura?.(project.id)} onMouseLeave={()=>onAura?.('default')} onFocus={()=>onAura?.(project.id)} onBlur={()=>onAura?.('default')} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onOpen(project.id)}}} onClick={()=>onOpen(project.id)}>
      <div className="projectCardMedia"><ProjectCover type={project.media}/></div>
      <div className="projectCardBody">
        <div className="projectCardTop"><span>{project.company}</span></div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <button type="button" onClick={(e)=>{e.stopPropagation();onOpen(project.id)}}>View case study <span>↗</span></button>
      </div>
    </article>
  </Reveal>
}

function ProjectVisual({type}){
  if(type==='commute') return <CommutePreview/>;
  if(type==='fcvf') return <FCVFVisual/>;
  if(type==='accenture') return <AccentureVisual/>;
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
    <div className="quickRow"><span>Quick fill:</span><button onClick={()=>quick('all')}>✨ Free all slots</button><button onClick={()=>quick('weekdays')}>☀️ Weekdays 9–5</button><button onClick={()=>quick('evenings')}>🌙 Evenings only</button><button onClick={()=>quick('clear')}>🗑 Clear all</button></div>
    <div className="viewRow"><div><button className={view==='mine'?'active':''} onClick={()=>setView('mine')}>My Availability</button><button className={view==='heatmap'?'active':''} onClick={()=>setView('heatmap')}>Group Heatmap</button></div>{view==='mine'&&<div className="modeRow">{['available','maybe','unavailable'].map(m=><button className={mode===m?'active':''} key={m} onClick={()=>setMode(m)}>{m[0].toUpperCase()+m.slice(1)}</button>)}</div>}</div>
    <div className="schedulerActionRow"><button onClick={()=>{setShareOpen(v=>!v);copyText('link','portfolio-demo.local/event/design-sync')}}>🔗 {copyState==='link'?'Copied':'Share Event Link'}</button><button onClick={()=>copyText('discord','Design Sync · Sep 15–19 · Add your availability: portfolio-demo.local/event/design-sync')}>💬 {copyState==='discord'?'Copied':'Copy for Discord'}</button><button onClick={()=>copyText('email','Design Sync — please add your availability: portfolio-demo.local/event/design-sync')}>✉️ {copyState==='email'?'Copied':'Copy for Email'}</button><button onClick={exportCalendar}>📅 Export Calendar</button><button onClick={()=>quick('clear')}>Clear My Availability</button></div>
    {shareOpen&&<div className="shareBox"><strong>Invite link</strong><code>portfolio-demo.local/event/design-sync</code></div>}
    <div className="bestMeet"><div><span>Best Time to Meet</span><strong>{best.day} · {best.time}–{times[Math.min(times.length-1,times.indexOf(best.time)+1)]}</strong></div><p>Highest available count, then fewest unavailable responses, then earliest tied slot.</p></div>
    <div className="sandboxAnnotations"><div><strong>Maybe</strong><span>Keep uncertain times without treating them as fully free.</span></div><div><strong>Quick fill</strong><span>Mark predictable blocks without repeating the same clicks.</span></div><div><strong>Best time</strong><span>Turn the heatmap into a recommendation.</span></div><div><strong>Venue + chat</strong><span>Keep the next decisions in the same workflow.</span></div></div><div className="schedulerBody"><div className="fullCalendar"><p className="gridHint">Click or drag to apply a status. Drag the same status across filled cells again to clear them. Right-click a cell to add a note.</p><div className="calendarHead"><span></span>{days.map(d=><span key={d}>{d}</span>)}</div><div className="calendarGrid interactiveGrid">{times.map((t,r)=><React.Fragment key={t}><span className="timeLabel">{t}</span>{days.map((d,c)=>{const i=r*5+c;const cell=cells[i];const cls=view==='heatmap'?`heat heat-${Math.min(3,cell.available)}`:`status-${cell.status||'empty'}`;return <button key={d} data-slot-index={i} title={`${cell.note?cell.note+' · ':''}Available: ${cell.available} · Maybe: ${cell.maybe} · Unavailable: ${cell.unavailable}`} aria-pressed={view==='mine'?cell.status===mode:undefined} className={`slot ${cls} ${cell.note?'hasNote':''}`} onPointerDown={e=>beginDrag(i,e)} onContextMenu={e=>{e.preventDefault();const note=window.prompt('Add a note for this time slot',cell.note||'');if(note!==null)setCells(a=>a.map((x,j)=>j===i?{...x,note}:x))}}/>})}</React.Fragment>)}</div></div>
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
 return <main className="casePage"><button className="backBtn" onClick={onBack}>← Back</button><header className="caseHeader"><p>{p.company}</p><h1>{p.title}</h1><div className="caseIntro">{p.summary}</div>{id!=='commute'&&<div className="ownershipLine"><span>{ownership[id]}</span></div>}{id!=='commute'&&metrics[id]&&<MetricStrip items={metrics[id]}/>}</header><section className="caseHeroMedia evidenceFirst"><ProjectVisual type={p.media}/></section>
 {id==='commute'&&<><section className="sandboxSection commuteShowcase"><CommuteSandbox/></section><CaseSection title="Why I built it"><p>Every morning, I checked my calendar, commute, traffic or transit, then worked backward to figure out when I actually needed to get out of bed.</p><p>I wanted one place to do that math for me—whether I was driving in Michigan or taking BART in the Bay Area.</p></CaseSection><CaseSection title="How it works"><div className="decisionSteps"><div><span>1</span><strong>Arrival</strong><p>Calendar, destination, buffer.</p></div><div><span>2</span><strong>Morning</strong><p>Routine and personal walking time.</p></div><div><span>3</span><strong>Conditions</strong><p>Transit arrivals, headways, traffic, freshness.</p></div><div><span>4</span><strong>Decision</strong><p>Wake. Leave. Route.</p></div></div></CaseSection><CaseSection title="Data"><div className="dataSourceList"><div><strong>Google Routes</strong><span>walking and route geometry</span></div><div><strong>511 / GTFS-Realtime</strong><span>BART + AC Transit arrivals, vehicles, service alerts</span></div><div><strong>511 traffic</strong><span>incidents and Bay Bridge conditions</span></div><div><strong>HealthKit</strong><span>personal walking pace</span></div><div><strong>Calendar</strong><span>destination and arrival commitment</span></div><div><strong>Weather</strong><span>only when conditions change the plan</span></div><div><strong>iOS alarms</strong><span>wake-time execution</span></div></div><p className="caseFinePrint">The browser demo simulates native permissions and live feeds. The product architecture shows the intended iOS integrations.</p></CaseSection><CaseSection title="Decisions"><div className="principleList"><div><strong>Work backward from arrival.</strong><span>The commitment anchors the morning.</span></div><div><strong>Don’t rebuild Maps.</strong><span>Use routing as an input; own the morning decision.</span></div><div><strong>Optimize for time kept.</strong><span>Thirty unnecessary early minutes are not a better commute.</span></div><div><strong>Model missed departures.</strong><span>Missing a frequent train and a 30-minute bus are different risks.</span></div><div><strong>Freshness affects confidence.</strong><span>A stale vehicle position should carry less weight.</span></div><div><strong>Interrupt only when the plan changes.</strong><span>Quiet data is better than noisy notifications.</span></div></div></CaseSection><CaseSection title="Scope"><div className="scopeColumns"><div><strong>V1</strong><span>Calendar · routine · Health · wake/leave · BART/AC Transit · traffic · alarms</span></div><div><strong>Later</strong><span>Driving expansion · recurring commute detection · deeper reliability learning</span></div><div><strong>Cut</strong><span>Social features · generic trip planning · analytics dashboard · navigation replacement</span></div></div></CaseSection><CaseSection title="What I’d measure"><div className="validationGrid"><div><strong>Arrival error</strong><span>Predicted vs. observed.</span></div><div><strong>Unused buffer</strong><span>Minutes returned to the morning.</span></div><div><strong>Prediction error</strong><span>Routine, walking, and route timing.</span></div><div><strong>Interruptions</strong><span>How often the app asks for attention.</span></div></div><p>North star: arrive on time with the least unnecessary buffer.</p></CaseSection></>}
 {id==='fcvf'&&<><CaseSection title="Original assessment"><p>The assessment lived in Excel. It was long to complete, difficult to navigate, and exposed scoring logic while users were still answering.</p></CaseSection><CaseSection title="User interviews"><div className="researchDecision"><div><span>During interviews</span><strong>Users said seeing the full assessment at once felt overwhelming.</strong></div><b>→</b><div><span>We also observed</span><strong>The live score changed with each answer, so users could go back and alter responses to move the score.</strong></div><b>→</b><div><span>What changed</span><strong>We moved to a multi-page flow and removed the live score while the assessment was in progress.</strong></div></div></CaseSection><CaseSection title="Iteration"><div className="comparisonVisual iterationVisual"><figure><figcaption>Earlier</figcaption><img loading="lazy" decoding="async" src="project-media/ford-before.webp" alt="Original Ford Excel assessment"/></figure><figure><figcaption>Final</figcaption><img loading="lazy" decoding="async" src="project-media/ford-after.webp" alt="Final Ford Customer Value Framework web application"/></figure></div></CaseSection><CaseSection title="What shipped"><div className="finalArtifact"><img loading="lazy" decoding="async" src="project-media/ford-after.webp" alt="Final Ford Customer Value Framework web experience"/><p>A web-based assessment with a multi-page flow and no live score influencing in-progress responses.</p></div></CaseSection></>}
 {id==='accenture'&&<><CaseSection title="Context"><p>I supported the live request-to-delivery workflow for an enterprise AI enablement program on a frontier AI lab account. The work covered intake, routing, trainer assignment, scheduling, delivery, feedback, and follow-up.</p></CaseSection><CaseSection title="Customer evidence"><div className="evidenceNumbers"><div><strong>~2,200</strong><span>learner responses synthesized</span></div><div><strong>~20 → 8</strong><span>providers researched → competitors compared</span></div><div><strong>27 → 12 → 5</strong><span>metrics → patterns → recommendations</span></div></div></CaseSection><CaseSection title="Workflow"><p className="diagramNote">Simplified portfolio diagram based on the workflow I documented during the internship.</p><div className="journeyFlow aiJourney"><div><strong>Manual requests</strong><span>inconsistent inputs + coordination</span></div><b>→</b><div><strong>Structured intake</strong><span>consistent mapping fields</span></div><b>→</b><div><strong>Automation contract</strong><span>10 tabs of logic, inputs, and guardrails</span></div><b>→</b><div><strong>Prototype</strong><span>refined, tested, demonstrated</span></div></div></CaseSection><CaseSection title="Testing"><div className="edgeCaseCard"><span>Edge case caught during QA</span><strong>A proposed trainer assignment landed at 10:30 PM local time.</strong><p>That exposed a missing requirement: working hours and time zones needed to be part of the matching logic, not handled after assignment.</p></div></CaseSection><CaseSection title="Selected deliverables"><div className="deliverableGrid"><div><strong>10-tab data contract</strong><span>Structured automation inputs, mapping, and requirements.</span></div><div><strong>Evidence synthesis</strong><span>~2,200 learner responses plus market/adoption research.</span></div><div><strong>Enablement prototype</strong><span>Created, refined, tested, and demonstrated an early experience.</span></div><div><strong>Recommendation path</strong><span>Converted research into five recommendations and a 90-day pilot path.</span></div></div></CaseSection></>}
 {id==='scheduler'&&<><section className="productDelta"><div><span>Kept from When2Meet</span><strong>Fast grid input + shared heatmap</strong></div><b>→</b><div><span>Extended around it</span><strong>Nuance, faster entry, recommendation, venues, notes, chat, sharing + calendar handoff</strong></div></section><section className="sandboxSection schedulerShowcase"><SchedulerSandbox/></section><CaseSection title="Starting point"><p>When2Meet uses click-and-drag availability entry and a shared overlap view. I kept that core interaction and built additional coordination around it based on pain points I had experienced: uncertain availability, repetitive entry, choosing the best overlap, and coordinating what happens after a time is selected.</p></CaseSection><CaseSection title="What I added"><div className="factGrid"><Fact title="Availability is not always binary">Available / Maybe / Unavailable keeps uncertainty visible without turning the grid into a more complicated input.</Fact><Fact title="Entering time is repetitive">Quick-fill presets reduce repeated selection for predictable blocks.</Fact><Fact title="A heatmap still needs interpretation">Best Time to Meet converts overlap into a recommendation.</Fact><Fact title="Scheduling does not end with a time">Venue voting, participant status, notes, chat, sharing, and calendar export keep the next decisions in the same flow.</Fact></div></CaseSection><CaseSection title="Architecture"><div className="architecture"><span>Browser</span><b>↔</b><span>Socket.IO</span><b>↔</b><span>Flask</span><b>↔</b><span>MySQL</span></div><p>Docker and Google Cloud Run were used for deployment. This portfolio sandbox preserves the product behavior with local browser state so it can run on GitHub Pages without the original backend.</p></CaseSection><CaseSection title="Finished system"><p>The original application supported availability states, group overlap, best-time calculation, participant status, venue voting, notes, event chat, sharing, and calendar handoff.</p></CaseSection></>}
 {id==='finsimple'&&<><CaseSection title="Context"><p>My second Ford internship moved from a greenfield intern-built application to FinSimple, a deployed financial product with existing customers, shared libraries, data dependencies, and production environments.</p></CaseSection><CaseSection title="Previous Estimates"><p>I owned requirements, UI/component development, integration, testing, and stakeholder coordination. The feature progressed from dummy data to an AEM component and then into the customer-facing flow.</p><div className="progression"><img loading="lazy" decoding="async" src="project-media/finsimple-dummy.png" alt="Dummy data stage"/><img loading="lazy" decoding="async" src="project-media/finsimple-aem.png" alt="AEM component stage"/><img loading="lazy" decoding="async" src="project-media/finsimple-live.png" alt="Finished FinSimple stage"/></div></CaseSection><CaseSection title="Customer + system flow"><div className="journeyFlow"><div><strong>Customer</strong><span>starts a financing/account workflow</span></div><b>→</b><div><strong>Web experience</strong><span>collects/displays information</span></div><b>→</b><div><strong>Service + API layer</strong><span>moves customer + contract data</span></div><b>→</b><div><strong>Salesforce</strong><span>creates/populates the downstream record</span></div></div></CaseSection><CaseSection title="What shipped"><div className="finalArtifact"><img loading="lazy" decoding="async" src="project-media/finsimple-live.png" alt="Finished FinSimple Previous Estimates feature"/><p>A customer-facing feature delivered inside an existing enterprise product rather than as a standalone application.</p></div></CaseSection></>}
 {id==='chat'&&<><section className="sandboxSection"><ChatSandbox/></section><CaseSection title="Real-time behavior"><div className="factGrid"><Fact title="Messages">Clients receive new messages through Socket.IO.</Fact><Fact title="Presence">Join and leave events are broadcast to the room.</Fact><Fact title="Typing">Typing state is emitted while another user is composing.</Fact><Fact title="Tapbacks">Messages support reactions including heart, thumbs-up, laughter, exclamation, and question reactions.</Fact></div></CaseSection></>}
 {id==='estee'&&<><CaseSection title="Brief"><p>The goal was to keep the experience recognizably Estée Lauder while adding product education, shade exploration, and clear paths to purchase.</p></CaseSection><CaseSection title="Final screens"><EsteeVisual/></CaseSection></>}
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
  return <article className="moreBuildCard clickable" role="link" tabIndex={0} onClick={()=>onOpen(project.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onOpen(project.id)}}}>
    <div className="moreBuildVisual"><ProjectCover type={project.media}/></div>
    <div className="moreBuildCopy"><span>{project.company}</span><h3>{project.title}</h3><button type="button" onClick={e=>{e.stopPropagation();onOpen(project.id)}}>View →</button></div>
  </article>
}
function MoreTechnicalCard({title,subtitle,kind,description}){
  return <article className="moreBuildCard"><div className="moreBuildVisual technicalCompact"><TechnicalCard title={title} subtitle={subtitle} kind={kind} description={description}/></div></article>
}

function CompanyLogo({src='',alt='',label=''}){return <div className="companyLogo">{src?<img loading="lazy" decoding="async" src={src} alt={alt}/>:<strong className="logoText">{label}</strong>}</div>}

const experienceItems=[
 {id:'accenture',company:'Accenture',role:'Technology Summer Analyst',dates:'2026',logo:'company-logos/accenture.svg',short:'GTM enablement and operations for a frontier AI lab.',detail:<><p>Worked across live enablement operations, automation readiness, customer evidence, and an early guided experience.</p><div className="experienceFacts"><span><b>~2.2K</b> learner responses</span><span><b>~20</b> providers benchmarked</span><span><b>10-tab</b> automation data contract</span></div></>},
 {id:'ford',company:'Ford / Ford Credit',role:'Software Engineering Intern · 3 summers',dates:'2023–25',logo:'company-logos/ford.png',short:'Customer products, delivery systems, APIs, and production operations.',detail:<><p>Progressed from a greenfield customer-feedback product to customer-facing financial features and ownership across releases, incidents, and cross-team delivery.</p><div className="experienceFacts"><span><b>40%</b> faster release cycle</span><span><b>20+</b> incidents analyzed</span><span><b>4</b> user interviews</span></div></>},
 {id:'spectrum',company:'Spectrum Consulting Group',role:'Consultant · Client Acquisition Lead',dates:'2022–26',logo:'company-logos/spectrum.png',short:'Client strategy across hospitality, utilities, and automotive.',detail:<><p>Worked across customer research, KPI design, commercialization, and a $15K automotive analysis workstream while mentoring two analysts.</p><div className="experienceFacts"><span><b>3,000+</b> survey responses</span><span><b>19</b> utility KPIs</span><span><b>$15K</b> automotive workstream</span></div></>},
 {id:'pwc',company:'PwC × Arc of Indiana',role:'Consulting Extern',dates:'2024',label:'PwC',short:'Competitive analysis and strategy for a nonprofit client.',detail:<><p>Built a weighted seven-category scorecard, benchmarked five peer organizations, and translated the work into five executive recommendations adopted by leadership.</p></>},
 {id:'palmer',company:'MSU Russell Palmer Career Management Center',role:'Peer Coach',dates:'2025–present',label:'MSU',short:'1:1 career coaching for students navigating recruiting.',detail:<><p>Coach 10+ students weekly across resumes, interviews, networking, and case preparation, translating messy individual goals into concrete next steps.</p><div className="experienceFacts"><span><b>100+</b> students coached</span><span><b>10+</b> sessions weekly</span></div></>}
];

function ExperienceSection(){
 const [open,setOpen]=useState(null);
 return <section id="experience" className="section experienceSection v28Experience"><div className="sectionTitle compactTitle"><h2>Experience</h2></div><div className="experienceAccordion">{experienceItems.map((x,i)=><article className={`experienceItem ${open===i?'open':''}`} key={x.company}><button className="experienceSummary" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}><CompanyLogo src={x.logo} alt={x.company} label={x.label}/><div><h3>{x.company}</h3><span>{x.role}</span><p>{x.short}</p></div><time>{x.dates}</time><b className="expToggle">{open===i?'−':'+'}</b></button><div className="experienceDetail" aria-hidden={open!==i}><div>{x.detail}</div></div></article>)}</div></section>
}

function Home({openCase}){
 const [auraTone,setAuraTone]=useState('default');
 const serious=['fcvf','finsimple','accenture','scheduler'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 const fun=['commute','chat','estee'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 return <>
 <a className="skipLink" href="#main-content">Skip to content</a><AuraField tone={auraTone}/>
 <header className="siteHeader"><a className="wordmark" href="#top">Neha Chinimilli</a><nav aria-label="Primary"><a href="#experience">Experience</a><a href="#projects">Projects</a><a href="#fun">Fun things</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume</a></nav></header>
 <main id="main-content">
  <section id="top" className="hero v28Hero"><div className="heroInner"><h1>Neha Chinimilli</h1><p className="heroThesis">Computer Science + Supply Chain Management at Michigan State University</p><div className="heroLinks"><a className="primaryHeroLink" href="#about">Learn about me ↓</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div></div></section>
  <ExperienceSection/>
  <section id="projects" className="section projectsSection v28Projects"><div className="sectionTitle compactTitle"><h2>Projects</h2></div><div className="balancedProjectGrid">{serious.map((p,i)=><ProjectCard project={p} index={i} key={p.id} featured={true} onOpen={openCase} onAura={setAuraTone}/>)}</div></section>
  <section id="fun" className="section moreSection v28Fun"><div className="sectionTitle compactTitle"><h2>Fun things I’ve built</h2></div><div className="funLeadGrid">{fun.map(p=><MoreProjectCard key={p.id} project={p} onOpen={openCase}/>)}</div><div className="smallBuildGrid"><article className="smallBuild"><div className="techVisual game"><div className="spartanScene"><img className="spartanBg" src="project-media/spartan-background.png" alt="Spartan Touchdown level"/><div className="spartanGround"></div><img className="spartySprite" src="project-media/sparty.png" alt="Sparty"/><img className="enemySprite" src="project-media/um-enemy.png" alt="Michigan enemy"/></div></div><h3>Spartan Touchdown</h3><p>C++ football game.</p></article><article className="smallBuild"><div className="techVisual fluids"><img src="project-media/stable-fluids.png" alt="Stable Fluids simulation"/></div><h3>Stable Fluids</h3><p>Interactive C++ fluid simulation.</p></article><article className="smallBuild raySmall"><div className="rayDiagram"><span>camera ray</span><i></i><span>surface</span><i></i><span>reflection</span></div><h3>Ray Tracer</h3><p>C++ renderer with lighting and reflections.</p></article></div></section>
  <section id="about" className="section aboutSection"><div className="aboutPhoto"><img src="headshot.jpg" alt="Neha Chinimilli"/></div><div className="aboutCopy"><h2>About me</h2><p>I like products that remove annoying little decisions from everyday life. I studied computer science and supply chain because I wanted to understand both how systems are built and how people actually use them.</p><p>Outside work, I shoot film, explore cities on foot, and build small things when I wish a tool already existed.</p><div className="aboutLinks"><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a><a href="mailto:chinimi2@msu.edu">Email</a><a href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div></section>
 </main><footer className="siteFooter"><span>© 2026 Neha Chinimilli</span><nav aria-label="Footer"><a href="mailto:chinimi2@msu.edu">Email</a><a href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></nav></footer>
 </>
}
function App(){
 const [caseId,setCaseId]=useState(null);
 const homeScroll=useRef(0);
 const transition=(fn)=>{const d=document;if(d.startViewTransition)d.startViewTransition(fn);else fn()};
 const openCase=(id)=>{homeScroll.current=window.scrollY;transition(()=>{setCaseId(id);requestAnimationFrame(()=>window.scrollTo(0,0))})};
 const closeCase=()=>transition(()=>{setCaseId(null);requestAnimationFrame(()=>window.scrollTo(0,homeScroll.current))});
 if(caseId)return <CaseStudy id={caseId} onBack={closeCase}/>;
 return <Home openCase={openCase}/>;
}

createRoot(document.getElementById('root')).render(<App/>);
