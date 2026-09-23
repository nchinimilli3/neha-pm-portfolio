import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './estee.css';
import EsteeCompact from './EsteeCompact';
import FCVFCase from './FCVFCase';
import { SurveyDemo } from './FCVFResearch';
import { KohlerAssembly, KohlerBoxOpen, KohlerDelivery, KohlerExceptions, KohlerOrderHold, KohlerPrinciples, KohlerRoles } from './KohlerVisuals';
import { AccentureBoundary, AccentureEvidenceFunnel, AccentureStagger, AccentureToolRelay } from './AccentureVisuals';
import AboutFilmCamera from './AboutFilmCamera';
import FinSimpleCase, { FinSimpleBuildDeck } from './FinSimpleCase';
import './accenture-v2.css';
import SchedulerPlannerHero from './SchedulerPlannerHero';
import AccentureRequestRelay from './AccentureRequestRelay';
import AccentureSFHero from './AccentureSFHero';
import { ChatAnatomyPhone } from './ChatVisuals';
import { SchedulerDemo, SchedulerFlatten, SchedulerSync } from './SchedulerVisuals';
import LifecycleRoad from './LifecycleRoad';
import {BookclubEditorial, BookclubEditorialHero} from './BookclubEditorial';
import { GrazeArtifacts, GrazeBriefFacts, GrazeGrowth, GrazeHero, GrazeLocations, GrazePrepSteps, GrazeProjectPreview, GrazeRecipe } from './GrazeExperience';
import './fcvf.css';
import './annotation-fixes.css';
import './annotation-final.css';
import './chat.css';
import './case-auras.css';
import CommuteBARTStory from './CommuteBARTStory';
import CommuteCase from './CommuteCase';
import { CommutePhoneDemo, useMorning } from './CommuteSurfaces';
import { CaseAnswer, CaseChapter, CaseResults, CausalChain, CountUp, DecisionMoment, Tradeoff } from './CaseDecision';
import { CarBand } from './CarArt';
import './responsive-v44.css';
import './case-system.css';

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
    ['42%','less processing time','outcome'],
    ['71% → 94%','first-pass document accuracy','outcome'],
    ['5','person team','scope'],
    ['1 → any','destination markets per SKU','system']
  ],
  accenture: [
    ['~60 min','coordinator work saved per request','outcome'],
    ['21','live requests supported','scope'],
    ['3,862','user responses analyzed','analysis'],
    ['10-tab','automation data contract','artifact'],
    ['8x','requests per trainer, top vs. bottom decile of teams','outcome']
  ],
  fcvf: [
    ['+25%','assessment feedback submitted','outcome'],
    ['4','user interviews led','research']
  ],
  finsimple: [
    ['15%','less calendar time per story than the team’s prior average','outcome'],
    ['6%','fewer Salesforce write failures per submitted estimate','outcome']
  ],
  estee: [
    ['Top 5','finalist, Kode With Klossy × Estée Lauder','outcome']
  ],
  marketExpansion: [
    ['4','decision criteria','scope'],
    ['3','locations compared','analysis'],
    ['1','scorecard the client can rerun','artifact'],
    ['3','growth recommendations delivered','decision']
  ],
  commute: [
    ['4','apps this one replaced','scope'],
    ['9','live data sources, one decision','system']
  ]
};



/* The aura belongs to the hero. It is at full pigment and full speed over the
   first screen, then falls away as the reader reaches the sections that are
   actually made of text, so nothing colourful sits behind a case study. One
   rAF-throttled listener writes a single 1→0 progress variable; the opacity
   and the drift speed are both derived from it in CSS. */
function useAuraFalloff(){
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      root.style.setProperty('--aura-p', '0.35');
      return;
    }
    let frame = 0;
    const apply = () => {
      frame = 0;
      /* Eased over nearly two screens rather than one: a linear ramp over a
         single viewport dropped to bare white the moment the hero left, which
         read as two different pages stitched together. */
      const span = Math.max(1, window.innerHeight * 1.8);
      const t = Math.max(0, Math.min(1, window.scrollY / span));
      const p = 1 - t * t * (3 - 2 * t);   // smoothstep: leaves slowly, settles slowly
      root.style.setProperty('--aura-p', p.toFixed(3));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(apply); };
    apply();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}

function AuraField({tone='default'}){
  useAuraFalloff();
  return <div className={`auraField tone-${tone}`} aria-hidden="true">
    <span className="auraBloom bloom1"/><span className="auraBloom bloom2"/><span className="auraBloom bloom3"/><span className="auraBloom bloom4"/><span className="auraBloom bloom5"/><span className="auraBloom bloom6"/><span className="auraBloom bloom7"/>
  </div>
}

const projects = [
  {
    id:'commute',
    title:'Commute',
    company:'Independent app · iOS',
    summary:'A personal iOS app that tells me the latest I can wake up and still get to work on time.',
    blurb:'Learns my routine, simulates 1,000 mornings per departure, and chooses the latest wake time that still clears the arrival target.',
    media:'commute'
  },
  {
    id:'fcvf',
    title:'Customer Value Framework',
    company:'Ford Motor Company',
    preview:'Moved a customer-value assessment from Excel to the web, then used four interviews to raise feedback volume 25%.',
    summary:'A web version of the customer value assessment that Ford teams had been running in Excel.',
    media:'fcvf'
  },
  {
    id:'accenture',
    title:'AI Lab GTM Enablement',
    company:'Accenture · Frontier AI lab',
    preview:'Built and launched an AI workflow for a frontier AI lab that cuts ~60 min of coordinator work per request.',
    summary:'Go to market enablement for an AI lab, matching trainers to customer training sessions.',
    media:'accenture'
  },
  {
    id:'kohler',
    title:'Ship Anywhere',
    company:'Kohler Co. · MSU CSE 498',
    preview:'Built an export assistant that cut processing time 42% and raised first-pass accuracy from 71% to 94%.',
    summary:'An assistant that gets a Kohler order ready to ship to another country.',
    media:'kohler'
  },
  {
    id:'scheduler',
    title:'Group Scheduling App',
    company:'Live web product · CSE 477',
    summary:'A group scheduling app for students, built from a one line assignment: build When2meet.',
    blurb:'Keeps “maybe”, ranks the best time, and carries the choice into a venue poll, chat, and calendar event.',
    media:'scheduler'
  },
  {
    id:'finsimple',
    title:'Previous Estimates',
    company:'Ford Credit · FinSimple',
    preview:'Brought saved estimates back for returning customers, with 6% fewer write failures per estimate.',
    summary:'A way for returning Ford Credit customers to get back to an estimate they already built.',
    media:'finsimple'
  },
  {
    id:'marketExpansion',
    title:'Market Expansion Scorecard',
    company:'Consumer services client · Spectrum Consulting Group',
    preview:'Built a reusable scorecard to compare three markets on the same four criteria.',
    summary:'A scorecard that let a franchise client compare candidate markets the same way every time.',
    media:'marketExpansion'
  },
  {
    id:'chat',
    title:'iMessage Recreation on Web',
    company:'MSU · CSE 477',
    summary:'A real time chat room for a class assignment, built as an iMessage recreation.',
    blurb:'iMessage on the web, because everyone knew the spec. Typing expires; a Tapback edits the message.',
    media:'chat'
  },
  {
    id:'estee',
    title:'Double Wear Foundation',
    company:'Estée Lauder × Kode With Klossy',
    preview:'Turned a promotional brief into a product decision tool. Top 5 in the Estée Lauder challenge.',
    summary:'A one week build for the Kode With Klossy challenge: a Double Wear page that helps shoppers find their shade.',
    media:'estee'
  },
  {
    id:'bookclub',
    title:'Bookclub',
    company:'Independent product · live web app',
    summary:'A private app for my reading group, so picking books and tracking progress happen in one place.',
    blurb:'A private app for my reading group: pick the book, track progress, talk without spoilers. Live, and in use.',
    media:'bookclub'
  }
];

function MetricStrip({items}) {
  const ref=useRef(null);const [run,setRun]=useState(false);
  useEffect(()=>{const n=ref.current;if(!n)return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setRun(false);return}const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setRun(true);io.disconnect()}},{threshold:.4});io.observe(n);return()=>io.disconnect()},[]);
  return <div ref={ref} className={`metricStrip metricCount-${items.length}`}>{items.map(([v,l,type='context'])=><div className={`metric metric-${type}`} key={l}><strong><CountUp value={v} run={run}/></strong><span>{l}</span></div>)}</div>
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
function MiniChat(){
  const [messages,setMessages]=useState([
    {mine:false,text:'did everyone push?'},
    {mine:true,text:'yep just finished the socket changes'},
    {mine:false,text:'perfect I see them live'}
  ]);
  const [text,setText]=useState('');
  const send=()=>{if(!text.trim())return;setMessages(m=>[...m,{mine:true,text:text.trim()}]);setText('')};
  // Drawn as Messages on macOS: the recreation is a web app, so a desktop window is the
  // honest frame for it. Other sidebar rows are blank placeholders, not invented chats.
  const last=messages[messages.length-1];
  return <div className="macMsgs">
    <aside className="macMsgsSide">
      <div className="macMsgsLights" aria-hidden="true"><i/><i/><i/></div>
      <div className="macMsgsSearch" aria-hidden="true">Search</div>
      <ul>
        <li className="isActive"><span className="macMsgsAvatar">NC</span><div><b>Project group</b><small>{last.text}</small></div></li>
        {[0,1,2].map(i=><li key={i} className="isGhost" aria-hidden="true"><span className="macMsgsAvatar"/><div><b/><small/></div></li>)}
      </ul>
    </aside>
    <section className="macMsgsMain" aria-label="Project group conversation">
      <header><span>To:</span><b>Project group</b><small>3 people</small></header>
      <div className="macMsgsThread">{messages.map((m,i)=><p className={m.mine?'mine':'theirs'} key={i}>{m.text}</p>)}</div>
      <div className="macMsgsCompose"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="iMessage" aria-label="Message"/><button type="button" onClick={send} aria-label="Send">↑</button></div>
    </section>
  </div>
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
 const logos=[['company-logos/ford-white-source.png','Ford'],['company-logos/ford-credit-white-source.png','Ford Credit'],['company-logos/esteelauder.png','Estée Lauder'],['company-logos/accenture-v31.png','Accenture'],['company-logos/kohler.svg','Kohler'],['company-logos/pwc-v31.png','PwC']];
 return <section className="companyBanner" aria-label="Companies and organizations I have built for"><span>Built for</span><div>{logos.map(([src,alt])=><img className={`companyBannerLogo companyBannerLogo-${alt.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} key={alt} src={assetUrl(src)} alt={alt}/>)}</div></section>
}

function EsteeVisual(){return <div className="esteeGrid"><img loading="lazy" decoding="async" src="project-media/el-home.webp" alt="Estée Lauder Double Wear landing experience"/><img loading="lazy" decoding="async" src="project-media/el-benefits.webp" alt="Double Wear product benefits"/><img loading="lazy" decoding="async" src="project-media/el-shades.webp" alt="Double Wear shade exploration"/><img loading="lazy" decoding="async" src="project-media/el-shop.webp" alt="Double Wear purchase options"/></div>}

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
  const chrome=(content)=><div className="iosPhoneDevice"><div className="iosDemoShell"><div className="iosStatus"><span>{shortFmt(demoNow)}</span><StatusIcons/></div><div className="iosScreenContent" inert={permission?true:undefined}>{content}</div>{dialog}{toast&&<div className="iosToast" role="status" aria-live="polite">{toast}</div>}<div className="iosHomeIndicator" aria-hidden="true"></div></div><img className="iosHardwareFrame" src="project-media/iphone-frame-v31.png" alt="" aria-hidden="true" loading="lazy" decoding="async"/></div>;

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
  return <figure className="commuteHeroCover"><img src={assetUrl('project-media/supplied-covers/commute.jpg')} alt="A person holding a phone showing Commute's morning plan: wake at 7:16 AM and take BART"/></figure>
}


function BookclubLiveVisual(){
 return <figure className="bookclubLiveVisual"><img loading="lazy" decoding="async" src={assetUrl('project-media/bookclub/screens/club-home.jpg')} alt="Bookclub club home showing the current read, progress, and upcoming meeting"/><figcaption><i aria-hidden="true"></i>Live product · club home</figcaption></figure>
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
    <div className="kohlerMarketControl"><div className="kohlerMarketPrompt"><span>Try another destination</span><small>Choose a market to update the checklist and document <i aria-hidden="true">↓</i></small></div><div className="kohlerMarketTabs" role="group" aria-label="Choose a sample destination">{Object.entries(kohlerMarkets).map(([key,value])=><button type="button" className={key===market?'selected':''} onClick={()=>setMarket(key)} aria-pressed={key===market} key={key}>{value.label}</button>)}</div></div>
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
        <div className="projectCardBody"><div className="projectCardTop"><span>{project.company}</span></div><h3>{project.title}</h3><p>{project.preview||project.summary}</p><span className="projectTextLink">Learn more ↗</span></div>
      </a>
    </article>
  </Reveal>
}

function CaseHeroLogo({src,alt,className=''}){
  return <div className={`caseHeroLogoWrap ${className}`}><img src={assetUrl(src)} alt={alt}/></div>
}
function ProjectVisual({type}){
  if(type==='commute') return <CommutePreview/>;
  if(type==='fcvf') return <CaseHeroLogo src="company-logos/ford-white-source.png" alt="Ford Motor Company" className="fcvfHeroMark"/>;
  if(type==='accenture') return <AccentureSFHero/>;
  if(type==='kohler') return <KohlerBoxOpen/>;
  if(type==='finsimple') return <figure className="homepageMockup"><img loading="eager" decoding="async" src={assetUrl('project-media/finsimple-home-mockup.png')} alt="FinSimple Previous Estimates shown on a laptop"/></figure>;
  if(type==='scheduler') return <SchedulerPlannerHero/>;
  if(type==='chat') return <MiniChat/>;
  if(type==='bookclub') return <BookclubPhoneHero/>;
  if(type==='marketExpansion') return <GrazeHero/>;
  if(type==='estee') return <figure className="esteeHeroMockup"><img loading="eager" decoding="async" src={assetUrl('project-media/estee-home-mockup.png')} alt="Double Wear discovery experience shown on a laptop"/></figure>;
  return <EsteeVisual/>;
}

// Top 5 outcome: the first time it scrolls into view, the text catches the light and gold confetti bursts once.
function EsteeOutcome(){
 const ref=useRef<HTMLDivElement>(null);
 const [on,setOn]=useState(false);
 useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setOn(true);io.disconnect()}},{threshold:.6});io.observe(el);return ()=>io.disconnect()},[]);
 const colors=['#d4af6a','#f3dfb1','#b08a4f','#e8c3b0','#fff4dc'];
 return <div ref={ref} className={`elOutcomeText${on?' isCelebrating':''}`}>
  {on&&<div className="elConfetti" aria-hidden="true">{Array.from({length:36},(_,i)=>{const a=(i/36)*Math.PI*2+(i%3)*.3;const d=90+(i*37%110);return <i key={i} style={{'--x':`${Math.cos(a)*d*1.6}px`,'--y':`${Math.sin(a)*d-60}px`,'--r':`${(i*53)%360}deg`,'--c':colors[i%colors.length],'--d':`${(i%6)*40}ms`} as React.CSSProperties}/>})}</div>}
  <p className="elFinalRecognition"><strong>Top 5</strong><span>Challenge finalist</span></p>
 </div>;
}

function ChatSandbox(){
 type ChatMessage={system?:string;who?:string;text?:string;reaction?:string};
 const seed:ChatMessage[]=[{system:'Neha joined the room'},{who:'Maya',text:'did everyone push?'},{who:'me',text:'yep just finished the socket changes'}];
 const [msgs,setMsgs]=useState(seed); const [text,setText]=useState(''); const [typing,setTyping]=useState(false); const [pickerFor,setPickerFor]=useState(null); const typingTimer=useRef(null);
 const tapbacks=[['❤️','Love'],['👍','Like'],['👎','Dislike'],['😂','Laugh'],['‼️','Emphasize'],['❓','Question']];
 const add=()=>{if(!text.trim())return;setMsgs(m=>[...m,{who:'me',text:text.trim()}]);setText('');setPickerFor(null)};
 const react=(i,r)=>{setMsgs(m=>m.map((x,j)=>j===i?{...x,reaction:x.reaction===r?'':r}:x));setPickerFor(null)};
 const left=msgs.some(m=>m.system==='Neha left the conversation');
 const leave=()=>{if(left)return;setMsgs(m=>[...m,{system:'Neha left the conversation'}]);setPickerFor(null)};
 const rejoin=()=>setMsgs(m=>[...m,{system:'Neha joined the conversation'}].filter(x=>x.system!=='Neha left the conversation'));
 const lastMine=msgs.map(m=>m.who==='me').lastIndexOf(true);
 return <div className="imsg isMac" onClick={()=>pickerFor!==null&&setPickerFor(null)}>
  <aside className="imsgSide" aria-hidden="true">
   <div className="imsgLights"><i/><i/><i/></div>
   <div className="imsgSearch"><svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>Search</div>
   <ul>
    <li className="isActive"><span className="imsgAvatars"><i>M</i><i>J</i></span><div><b>Project group<small>9:41 AM</small></b><em>{[...msgs].reverse().find(m=>m.text)?.text}</em></div></li>
    <li><span className="imsgAvatars"><i>A</i></span><div><b>Anj<small>9:12 AM</small></b><em>coffee after class?</em></div></li>
    <li><span className="imsgAvatars"><i>V</i></span><div><b>Varnika<small>Yesterday</small></b><em>see you at the library</em></div></li>
    <li><span className="imsgAvatars"><i>A</i></span><div><b>Anjani<small>Monday</small></b><em>Loved “sounds good”</em></div></li>
   </ul>
  </aside>
  <section className="imsgMain">
  <header className="imsgNav">
   <div className="imsgWho"><span className="imsgTo">To:</span><h2>Project group</h2></div>
   <button type="button" className="imsgLeave" onClick={left?rejoin:leave}>{left?'Rejoin':'Leave'}</button>
  </header>
  <div className="imsgThread">
   <p className="imsgStamp"><b>iMessage</b><br/>Today 9:41 AM</p>
   {msgs.map((m,i)=>m.system?<p className="imsgSystem" key={i}>{m.system}</p>:<div className={`imsgRow ${m.who==='me'?'mine':'theirs'}${msgs[i+1]?.who===m.who?' isGrouped':''}`} key={i}>
    {m.who!=='me'&&msgs[i-1]?.who!==m.who&&<span className="imsgName">{m.who}</span>}
    <div className="imsgBubbleWrap"><button type="button" className="imsgBubble" onDoubleClick={e=>{e.stopPropagation();setPickerFor(c=>c===i?null:i)}} aria-label={`${m.text}. Double-click for reactions.`}>{m.text}</button>
     {m.reaction&&<span className="imsgTapback" aria-label={`Reaction ${m.reaction}`}>{m.reaction}</span>}
     {pickerFor===i&&<div className="imsgPicker" role="menu" aria-label="Choose a message reaction" onClick={e=>e.stopPropagation()}>{tapbacks.map(([symbol,label])=><button type="button" role="menuitem" key={label} aria-label={label} title={label} onClick={()=>react(i,symbol)}>{symbol}</button>)}</div>}
    </div>
    {i===lastMine&&<span className="imsgReceipt">Delivered</span>}
   </div>)}
   {typing&&<div className="imsgRow theirs"><div className="imsgTyping" aria-label="Typing"><i/><i/><i/></div></div>}
  </div>
  <div className="imsgComposer">
   <span className="imsgPlus" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M10 4v12M4 10h12"/></svg></span>
   <div className="imsgField"><input value={text} disabled={left} onChange={e=>{setText(e.target.value);setTyping(true);if(typingTimer.current)window.clearTimeout(typingTimer.current);typingTimer.current=window.setTimeout(()=>setTyping(false),900)}} onKeyDown={e=>e.key==='Enter'&&add()} placeholder={left?'You left this conversation':'iMessage'} aria-label="Message"/>
    <button type="button" className={`imsgSend${text.trim()?' isReady':''}`} onClick={add} disabled={!text.trim()} aria-label="Send"><svg viewBox="0 0 24 24"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg></button>
   </div>
  </div>
  </section>
  <p className="sandboxNote">Double-click any message for Tapbacks. Typing expires on its own, and Leave posts a presence event instead of a message.</p>
 </div>
}

function CaseDecisionNotes({id}){
 const notes={
  fcvf:[['Constraint','The Excel scoring logic had to carry over without showing users information that could influence their answers.'],['Decision','Use a multi-page flow so users can focus on the current question instead of scanning the full assessment.'],['Evidence','Four interviews comparing two interface directions showed that the long page was harder to work through and that the live score could influence responses.']],
  finsimple:[['Constraint','The feature lived inside an existing financial platform, so it had to fit established UI, data contracts, and release environments.'],['Decision','Treat AEM, Salesforce, QA, and production validation as connected parts of shipping the feature.'],['Tradeoff','Build inside the existing platform instead of creating a cleaner standalone experience that would not fit the real product.']],
  accenture:[['Constraint','Trainer matching depended on region, language, expertise, capacity, time zones, and information spread across several tools.'],['Decision','Turn repeated coordinator checks into explicit rules while keeping review for exceptions.'],['Evidence','Testing produced a proposed 10:30 PM local assignment, which led to working-hours and time-zone checks.']],
  scheduler:[['Problem','Availability grids show when people are free, but the group still has to choose a time, place, and next step.'],['Decision','Keep availability, uncertainty, venue voting, and lightweight chat in the same workflow.'],['Technical','Flask, MySQL, and Socket.IO handled saved scheduling state and real-time collaboration in the original build.']],
  chat:[['Assignment','Build a chat room where people could see messages and when someone entered or left.'],['Product direction','I recreated iMessage so I could study the interaction details behind a familiar messaging product, then added typing and Tapback states beyond the base assignment.'],['Technical','HTML, CSS, JavaScript, and Socket.IO handled the interface and synchronized room events across clients.']],
  estee:[['Problem','Without a tester, online shoppers have to decide on finish, coverage, and shade from the page alone.'],['Decision','Build the site around the shopper’s question, keep benefits scannable, and hand checkout to the retailers they already trust.'],['Outcome','The concept finished as a Top 5 challenge finalist.']]
 }[id];
 if(!notes)return null;
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
  translator:{name:'Azure AI Translator',mark:'Translate',urls:['tool-logos/azure-translator-mark.svg']},
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
  swiftui:{name:'SwiftUI',mark:'UI',urls:['tool-logos/swiftui-mark.svg']},
  swiftdata:{name:'SwiftData',mark:'Data',urls:['tool-logos/swiftdata-mark.svg']},
  activitykit:{name:'ActivityKit',mark:'Live',urls:['tool-logos/activitykit-mark.svg']},
  widgetkit:{name:'WidgetKit',mark:'Widget',urls:['tool-logos/widgetkit-mark.svg']},
  eventkit:{name:'EventKit',mark:'Event',urls:['tool-logos/eventkit-mark.svg']},
  healthkit:{name:'HealthKit',mark:'Health',urls:['tool-logos/healthkit-mark.svg']},
  corelocation:{name:'Core Location',mark:'Location',urls:['tool-logos/corelocation-mark.svg']},
  weatherkit:{name:'WeatherKit',mark:'Weather',urls:['tool-logos/weatherkit-mark.svg']},
  notifications:{name:'UserNotifications',mark:'Notify',urls:['tool-logos/notifications-mark.svg']},
  alarmkit:{name:'AlarmKit',mark:'Alarm',urls:['tool-logos/alarmkit-mark.svg']},
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
  commute:['swift','swiftui','swiftdata','activitykit','widgetkit','eventkit','healthkit','corelocation','weatherkit','notifications','alarmkit','googlemaps','gtfs','python','typescript','node','figma','github'],
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
function ToolLogoStrip({id}){const items=toolSets[id]||[];if(!items.length)return null;return <section className={`toolLogoSection ${id==='bookclub'?'bookclubToolLogoSection':''}`}><div className="toolLogoHeading"><h2>Tech stack</h2></div><div className="toolLogoRow">{items.map(k=><ToolLogo key={k} tool={toolLogoMap[k]}/>)}</div></section>}


// Every case study cascades its groups: when a row of cards, a set of steps, or a list comes into view,
// its items fade up one after another. Single headings and paragraphs are left alone, and demos or
// visuals with their own choreography are skipped.
const revealSkip='.caseLead,.cdAnswer,.carBand,.lcRoad,.sandboxSection,.iphoneDemoStage,.kohlerSurface,.requestApp,.accentureSchemaWindow,.fvSurveyExperiment,.fvWorkbookBefore,.fvWorkbookGrid,.cmBoard,.cmLock,.bcThreadPhone,.axRide,.axStagger,.fseStagger,[data-stagger],.elScopeNotes,.bcPlan,.fseDeck,.fvBuildNav,.imageLightbox,.toolLogoRow,.fcvfRoadStage,.bartTrain,.elSizeToggle,.elViewport,.kxLineStage,svg';
function useCaseReveal(id:string){
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let onScroll:(()=>void)|undefined;
  const timers:number[]=[];
  const t=window.setTimeout(()=>{
   const page=document.querySelector(`main.casePage.case-${id}`);if(!page)return;
   const runs:HTMLElement[][]=[];
   const skipTags=['SPAN','B','I','EM','STRONG','BR','SMALL','A','BUTTON','INPUT','LABEL','OPTION','TD','TH','TR','SOURCE','P','H1','H2','H3','H4','H5','SECTION','MAIN','NAV','HEADER','FOOTER','svg','SVG','PATH','G','CIRCLE','RECT','TEXT','IMG','I'];
   const key=(k:Element)=>k.tagName+'|'+(k.tagName==='LI'?'':(String((k as HTMLElement).className||'').split(/\s+/)[0]||''));
   const ok=(k:HTMLElement)=>{const c=getComputedStyle(k);const r=k.getBoundingClientRect();return c.display!=='none'&&r.height>=(k.tagName==='LI'?20:36)&&c.opacity==='1'&&(!c.translate||c.translate==='none')&&c.position!=='absolute'&&c.position!=='fixed'&&c.animationName==='none'};
   page.querySelectorAll<HTMLElement>('*').forEach(parent=>{
    if(parent.closest(revealSkip))return;
    const kids=[...parent.children] as HTMLElement[];
    let run:HTMLElement[]=[];
    const flush=()=>{if(run.length>=2&&run.length<=8)runs.push(run);run=[]};
    kids.forEach(k=>{
     if(skipTags.includes(k.tagName)||k.matches(revealSkip)||!ok(k)){flush();return}
     if(run.length&&key(run[0])!==key(k))flush();
     run.push(k);
    });
    flush();
   });
   // Keep only the outermost runs so nested groups don't hide twice.
   const all=runs.flat();
   const outer=runs.filter(r=>!all.some(o=>!r.includes(o)&&o.contains(r[0])));
   const vh=window.innerHeight;
   const pending=outer.filter(r=>{const top=r[0].getBoundingClientRect().top,bottom=r[r.length-1].getBoundingClientRect().bottom;return top>vh*.92||bottom<0});
   pending.forEach(r=>r.forEach((k,i)=>{k.classList.add('revealItem');k.style.setProperty('--rd',`${i*170}ms`)}));
   const reveal=(r:HTMLElement[])=>{if(!pending.includes(r))return;pending.splice(pending.indexOf(r),1);r.forEach((k,i)=>{k.classList.add('isRevealed');timers.push(window.setTimeout(()=>{k.classList.remove('revealItem','isRevealed');k.style.removeProperty('--rd')},i*170+900))})};
   let frame=0;
   const check=()=>{frame=0;const line=window.innerHeight*.94;[...pending].forEach(r=>{if(r[0].getBoundingClientRect().top<line)reveal(r)})};
   onScroll=()=>{if(!frame)frame=requestAnimationFrame(check)};
   window.addEventListener('scroll',onScroll,{passive:true});
  },150);
  return ()=>{window.clearTimeout(t);timers.forEach(clearTimeout);if(onScroll)window.removeEventListener('scroll',onScroll)};
 },[id]);
}

/* The five answers a reviewer should have before deciding to keep scrolling.
   A case with an entry here renders it directly under the hero, with what I
   owned in the "What I owned" row. */
const caseAnswers={
  commute:{
  problem:'Commute tells me the latest time I can wake up and still reliably arrive by 9:00. It learns how long my own morning takes, watches live transit and traffic, and tests possible routes before recommending one plan.',
  owned:'I defined the product, built the SwiftUI app and monitoring service, designed the prediction model, and tested it across 40 weekday mornings.',
  call:'Recommend the latest wake-up time that still clears my on-time threshold.',
  callHref:'#cm-decide',
  evidence:'To make that recommendation, Commute simulates 1,000 possible mornings for each reachable departure, using routine history plus live walking, wait, traffic, and transit ranges. It selects the latest plan that clears the on-time threshold, then rechecks it as live conditions change.',
  result:'Used every weekday for 8 weeks. It replaced repeated map checks with one wake time, one route, and a notification only when the plan needed to change.'
 },
 marketExpansion:{
  problem:'Graze Craze wanted a new franchise location and stronger Michigan branches, with no shared way to compare candidate markets.',
  owned:'I built the interactive Excel scorecard and scoring rubric. The market research and branch-growth recommendations were developed with the consulting team.',
  call:'Recommend both top markets, because one point apart is a tie.',
  callHref:'#gz-analyze',
  evidence:'Four weighted criteria across three markets: Northville 123, Ann Arbor 122, Traverse City 101.',
  result:'The team pursued properties in both top markets instead of ranking them, and the client kept a scorecard it can rerun on any market.'
 },
 bookclub:{
  problem:'My reading group had nowhere shared to pick the next book, see who was how far in, or talk about it without spoilers.',
  owned:'I defined the product, designed the experience, built the frontend and backend, and deployed it for my reading group.',
  call:'Pick the book, see everyone’s progress, and keep notes and questions in one app.',
  callHref:'#bc-build',
  evidence:'In a chat thread, the club’s decisions and questions scroll away, and nobody can see who is actually keeping up. A club only meets if that state stays visible in one place. The live app is now in use with my club; next are five user interviews and moderated usability tests before I build more.',
  result:'Taken from concept to launch as a full-stack React and Cloudflare product, now used by an invite-only club of 10 active users.'
 },
 scheduler:{
  problem:'The CSE 477 brief was one line: build When2meet. Cloning it would have met the assignment and shipped a grid that flattens tentative availability to yes or no, then leaves the group to pick a time, place, and next step somewhere else.',
  owned:'I led product definition, research with seven students, interaction design, full-stack development, and deployment.',
  call:'Let people mark “maybe,” not just yes or no.',
  callHref:'#sc-research',
  evidence:'Seven one-on-one student interviews with live task walkthroughs.',
  result:'Two study groups ran their meetings on it for a semester, carrying one group record from availability through to a recommended time, venue vote, and calendar event.'
 },
 chat:{
  problem:'The CSE 477 brief was open-ended: build a real-time chat room with messages and join and leave events. A generic chat app would meet it, but there would be no clear bar for “good.”',
  owned:'I chose the direction, defined the scope, and built it solo in HTML, CSS, JavaScript, and Socket.IO.',
  call:'Typing and reactions are temporary state, not messages in the history.',
  evidence:'Everyone who would use it already knew iMessage, so their expectations became my spec: any detail that felt off would be noticed immediately.',
  result:'Typing expires instead of becoming chat history, and a Tapback updates the existing message rather than adding a second one.'
 },
 estee:{
  problem:'The brief was to build a promotional website for Double Wear. A promotional page shows the product; online there is no tester, so the shopper is still left to judge finish, coverage, and shade from a picture and decide alone.',
  owned:'A one-week solo build for the Kode With Klossy × Estée Lauder challenge: I shaped the product concept, designed the UX/UI, and built the frontend.',
  call:'Help the shopper pick their shade, then hand checkout to eight established retailers.',
  callHref:'#el-scope',
  evidence:'Estée Lauder’s own pages next to Sephora and Ulta: all image-led, the product shot as the focal point, and the fit question left to the shopper. Plus how I shop for foundation myself.',
  result:'Top 5 finalist, and I presented the concept to Estée Lauder C-suite leadership.',
  stat:{value:'Top 5',label:'finalist in the challenge'}
 },
 fcvf:{
  problem:'Ford teams trusted the Customer Value Framework, but it lived in one long Excel workbook whose score moved while people were still answering.',
  owned:'Software engineering intern on a 10-person team. I led four user interviews, shaped the interaction model, and built frontend and backend features.',
  call:'Hide the score until the assessment is submitted.',
  callHref:'#fv-decide',
  evidence:'Four moderated interviews comparing the one-page build against a multi-page prototype.',
  result:'Shipped a paginated assessment that holds the score until submission.',
  stat:{value:'+25%',label:'feedback volume across internal teams'}
 },
 accenture:{
  problem:'A frontier AI lab’s enablement requests crossed three tools before a trainer was booked, and the same judgment calls were remade by hand every time.',
  owned:'I supported 21 live requests, wrote the trainer-matching and scheduling rules into a 10-tab data contract, built and launched an OpenAI API workflow that applies them, and helped shape the go-to-market plan for scaled partner-led delivery.',
  call:'Send uncertain trainer matches to a person instead of booking them automatically.',
  callHref:'#ax-test',
  evidence:'A trainer match passed every rule and still landed at 10:30 PM in the trainer’s time zone. A coordinator would have rejected it instantly.',
  result:'The workflow went live and cuts ~60 min of coordinator work per request. Uncertain matches still stop at a human gate.',
  stat:{value:'8x',label:'requests per trainer between the heaviest- and lightest-using teams'}
 },
 kohler:{
  problem:'A Kohler product can be in stock and still not be ready to export: each destination needs its own spec sheets, labels, warranties and translations.',
  owned:'On a five-person team, I defined the product, designed the workflow and interface, and contributed to the React/Node build, Azure orchestration, and human-review flow.',
  call:'Build the tool around the export order, not the product catalog.',
  callHref:'#kx-define',
  evidence:'How an order actually gets held up today, and the exception cases where a person has to decide rather than a rule.',
  result:'Delivered to Kohler: an order workspace driven by the order SKU and destination, the destination rules, the agent-drafted packet, and a human review gate.',
  stat:{value:'42%',label:'less processing time, with first-pass accuracy up from 71% to 94%'}
 },
 finsimple:{
  problem:'FinSimple is where Ford Credit customers build a financing estimate for a vehicle. Returning customers had no way back to an estimate they had already built, so they started over.',
  owned:'I owned requirements, AEM component work, API integration, testing, and coordination across the teams needed to ship my feature.',
  call:'Map the five-team release sequence myself, because nobody owned it.',
  callHref:'#fs-launch',
  evidence:'A live product with existing customers, shared AEM components, Salesforce data contracts, and a release train spanning five teams.',
  result:'Previous Estimates shipped into the customer-facing flow with 6% fewer Salesforce write failures per submitted estimate, and I owned it in production.',
  stat:{value:'15%',label:'less calendar time per story'}
 }
};

/* Each case tints only its own <main>, so the site's beige html/body showed
   through on load, on overscroll, and below short pages. Match the page to the
   case before first paint, and hand the beige back on the way out. */
function useCaseCanvas(id:string){
 useLayoutEffect(()=>{
  const main=document.querySelector<HTMLElement>(`main.casePage.case-${id}`);
  if(!main)return;
  // body's background reads --page-canvas (styles.css), so one variable moves both.
  const root=document.documentElement;
  root.style.setProperty('--page-canvas',getComputedStyle(main).backgroundColor);
  return ()=>{root.style.removeProperty('--page-canvas')};
 },[id]);
}

function CaseSkimDemo({id,setLightbox}:{id:string,setLightbox:(img:{src:string,alt:string})=>void}){
 const morning=useMorning();
 if(id==='commute')return <section className="caseSkimDemo caseSkimCommute" aria-label="Try the Commute product"><header><h2>Try the product</h2></header><div className="cmDemoStage"><CommutePhoneDemo m={morning} app={<CommuteAppDemo/>}/></div></section>;
 if(id==='scheduler')return <section className="caseSkimDemo schedulerDemo" aria-label="Try the scheduler"><header><h2>Try the product</h2></header><SchedulerDemo/></section>;
 if(id==='chat')return <section className="caseSkimDemo" aria-label="Try the chat product"><header><h2>Try the product</h2></header><ChatSandbox/></section>;
 if(id==='kohler')return <section className="caseSkimDemo kohlerProductStage" aria-label="Try the export workflow"><header><h2>Try the product</h2></header><KohlerProductSurface compact/></section>;
 if(id==='marketExpansion')return <section className="caseSkimDemo" aria-label="Explore the market comparison"><header><h2>Try the scorecard</h2></header><GrazeLocations/></section>;
 if(id==='fcvf')return <section className="caseSkimDemo" aria-label="Try the assessment decision"><header><h2>Try the key decision</h2></header><SurveyDemo/></section>;
 if(id==='accenture')return <section className="caseSkimDemo" aria-label="Try the request workflow"><header><h2>Try the workflow</h2></header><AccentureRequestRelay/></section>;
 // No interaction to offer here: the deliverable was the released experience, so the skim
 // view shows the actual screens rather than a decorative compact.
 if(id==='estee')return <section className="caseSkimDemo esteeSkimShots" aria-label="See the released Double Wear experience"><header><h2>See the product</h2></header><EsteeVisual/></section>;
 if(id==='bookclub')return <section className="caseSkimDemo" aria-label="See the live Bookclub product"><header><h2>See the product</h2></header><BookclubEditorialHero/></section>;
 if(id==='finsimple')return <section className="caseSkimDemo" aria-label="See the FinSimple feature from prototype to release"><header><h2>See the shipped feature</h2></header><div className="fseEditorial fseSkimDeck"><div className="fseBuild"><FinSimpleBuildDeck setLightbox={setLightbox}/></div></div></section>;
 return null;
}

/* Previous / next case study, in the same order as the home page (Selected work,
   then the fun builds), wrapping at the ends, so no case is a dead end. */
const CASE_ORDER=['fcvf','accenture','finsimple','kohler','marketExpansion','estee','commute','bookclub','scheduler','chat'];
function CaseNav({id}:{id:string}){
 const i=CASE_ORDER.indexOf(id);
 if(i<0)return null;
 const at=(n:number)=>projects.find(p=>p.id===CASE_ORDER[(n+CASE_ORDER.length)%CASE_ORDER.length]);
 const prev=at(i-1),next=at(i+1);
 const go=(target:string)=>(e:React.MouseEvent)=>{e.preventDefault();window.location.hash=`/projects/${target}`;window.scrollTo(0,0)};
 const link=(p,dir:'prev'|'next')=>p&&<a className={`csCaseNavLink is-${dir}`} href={`#/projects/${p.id}`} onClick={go(p.id)}>
  <span className="csCaseNavDir">{dir==='prev'?'← Previous case':'Next case →'}</span>
  <strong>{p.title}</strong>
  <small>{p.company}</small>
 </a>;
 return <nav className="csCaseNav" aria-label="More case studies">{link(prev,'prev')}{link(next,'next')}</nav>;
}

function CaseStudy({id,onBack}){
 useCaseReveal(id);
 useCaseCanvas(id);
 const p=projects.find(x=>x.id===id);
 const [lightbox,setLightbox]=useState(null);
 const [readingMode,setReadingMode]=useState<'skim'|'deep'>(()=>{
  try{return localStorage.getItem('case-reading-mode')==='deep'?'deep':'skim'}catch{return 'skim'}
 });
 useEffect(()=>{try{localStorage.setItem('case-reading-mode',readingMode)}catch{}},[readingMode]);
 if(!p)return null;
 const openClickedImage=(e)=>{const img=e.target instanceof HTMLImageElement?e.target:null;if(!img||img.closest('.caseCompanyBar')||img.closest('.toolLogoSection')||img.closest('[data-no-lightbox]')||img.closest('.kohlerStory')||img.closest('.caseHeroLogoWrap')||img.classList.contains('companyLogo'))return;setLightbox({src:img.currentSrc||img.src,alt:img.alt||'Project image'})};
 const openDeepSection=(e)=>{
  openClickedImage(e);
  if(readingMode!=='skim')return;
  const anchor=(e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement|null;
  const href=anchor?.getAttribute('href');
  if(!href||href==='#'||href.startsWith('#/'))return;   // '#/projects/…' is a route, not a section
  e.preventDefault();setReadingMode('deep');
  window.setTimeout(()=>document.querySelector(href)?.scrollIntoView({behavior:'smooth',block:'start'}),50);
 };
 return <main className={`casePage case-${id} ${readingMode==='skim'?'isSkim':'isDeep'}`} onClick={openDeepSection}><AuraField tone={id}/><div className="caseReadingBar"><button className="backBtn" onClick={onBack}>← Selected work</button><div className="caseReadingControl"><div className="caseReadingToggle" role="group" aria-label="Case study reading depth"><button type="button" aria-pressed={readingMode==='skim'} onClick={()=>setReadingMode('skim')}><b>Skim</b></button><button type="button" aria-pressed={readingMode==='deep'} onClick={()=>setReadingMode('deep')}><b>In depth</b></button></div></div></div><section className="caseLead"><header className="caseHeader"><CaseCompanyBar id={id} fallback={p.company}/><h1>{p.title}</h1><div className="caseIntro">{p.summary}</div>{id==='bookclub'&&<a className="bookclubLiveLink" href={BOOKCLUB_LIVE_URL} target="_blank" rel="noreferrer" aria-label="Open the live Bookclub app in a new tab">Open live app ↗</a>}</header><div className="caseHeroMedia casePreviewHero"><ProjectVisual type={p.media}/></div>{metrics[id]&&<MetricStrip items={metrics[id]}/>}<ToolLogoStrip id={id}/></section>
 {caseAnswers[id]&&<CaseAnswer key={id} {...caseAnswers[id]} stat={metrics[id]?.some(([v])=>v===caseAnswers[id].stat?.value)?undefined:caseAnswers[id].stat}/>}
 {readingMode==='skim'&&<><CaseSkimDemo id={id} setLightbox={setLightbox}/><div className="caseSkimFinish"><button type="button" onClick={()=>setReadingMode('deep')}>Read the in-depth case ↓</button></div></>}
 {readingMode==='deep'&&<>
 {id==='fcvf'&&<CarBand car="shelby" label="Shelby GT500 illustration that drives as you scroll"/>}
 {id==='finsimple'&&<CarBand car="mache" label="Mustang Mach-E illustration that drives as you scroll"/>}
 {id==='commute'&&<CommuteCase demo={<CommuteAppDemo/>}/>}
 {id==='fcvf'&&<FCVFCase setLightbox={setLightbox}/>}
 {id==='accenture'&&<AccentureCase/>}
 {id==='kohler'&&<KohlerCase/>}
 {id==='scheduler'&&<SchedulerCase/>}
 {id==='finsimple'&&<FinSimpleCase setLightbox={setLightbox}/>}
 {id==='chat'&&<ChatCase/>}
 {id==='estee'&&<EsteeCase/>}
 {id==='bookclub'&&<BookclubCase/>}
 {id==='marketExpansion'&&<MarketExpansionCase/>}
 {id!=='commute'&&!['fcvf','chat','estee','bookclub','marketExpansion','finsimple','scheduler','accenture'].includes(id)&&<CaseDecisionNotes id={id}/>}</>}
 <CaseNav id={id}/>
 <ImageLightbox image={lightbox} onClose={()=>setLightbox(null)}/></main>
}

function CaseSection({title,children,className='',id=undefined}:{title:any,children:any,className?:string,id?:string}){return <section id={id} className={`caseSection ${className}`}><h2>{title}</h2><div className="caseSectionBody">{children}</div></section>}


function SchedulerPeople(){
 const people=[
  {id:'01',skin:'#8f5b45',hair:'#211a1a',shirt:'#7055a8',style:'waves'},
  {id:'02',skin:'#d9a17f',hair:'#3b251e',shirt:'#2f7590',style:'curly'},
  {id:'03',skin:'#72503f',hair:'#16191d',shirt:'#bf7b56',style:'short'},
  {id:'04',skin:'#efc2a5',hair:'#7c4a31',shirt:'#507a68',style:'bun'},
  {id:'05',skin:'#4a2b24',hair:'#151515',shirt:'#cb9e3c',style:'braids'},
  {id:'06',skin:'#c98261',hair:'#30211e',shirt:'#a55673',style:'bob'},
  {id:'07',skin:'#a96d50',hair:'#26202a',shirt:'#4266a6',style:'coils'}
 ];
 return <div className="schedulerPeople" aria-label="Seven illustrated student interview participants">{people.map(person=><figure key={person.id} aria-label={`Illustration of student participant ${person.id}`}>
  <svg viewBox="0 0 80 92" role="img" aria-hidden="true"><circle cx="40" cy="32" r="17" fill={person.skin}/><path d="M20 92c3-25 13-37 20-37s17 12 20 37" fill={person.shirt}/>{person.style==='waves'&&<path d="M21 35c-4-20 9-29 20-27 16 1 23 16 17 32-3-12-9-19-19-20-7 1-11 7-18 15" fill={person.hair}/>} {person.style==='curly'&&<path d="M20 34c-2-17 7-27 20-27 14 0 23 11 19 28-4-9-9-15-19-15-8 0-13 6-20 14" fill={person.hair}/>} {person.style==='short'&&<path d="M23 31c2-16 10-23 20-23 12 0 19 9 17 24-5-7-10-10-18-10-7 0-12 4-19 9" fill={person.hair}/>} {person.style==='bun'&&<><circle cx="55" cy="12" r="9" fill={person.hair}/><path d="M21 34c-1-18 8-27 20-27 15 0 23 12 18 29-4-9-10-14-19-14-8 0-12 5-19 12" fill={person.hair}/></>} {person.style==='braids'&&<><path d="M21 34c-2-18 7-27 20-27 15 0 22 12 18 29-4-9-10-14-19-14-8 0-13 5-19 12" fill={person.hair}/><path d="M25 42c-4 13-2 23 1 33M55 42c4 13 2 23-1 33" stroke={person.hair} strokeWidth="5" strokeLinecap="round"/></>} {person.style==='bob'&&<path d="M19 36c-1-20 9-30 21-30 15 0 24 12 20 32-3-11-10-18-20-18-8 0-13 6-21 16" fill={person.hair}/>} {person.style==='coils'&&<path d="M19 33c1-18 10-27 22-27 13 0 22 10 20 29-5-9-11-14-21-14-8 0-14 5-21 12" fill={person.hair}/>}<circle cx="34" cy="32" r="1.5" fill="#2c2725"/><circle cx="46" cy="32" r="1.5" fill="#2c2725"/><path d="M35 41q5 4 10 0" fill="none" stroke="#6f453a" strokeWidth="1.5" strokeLinecap="round"/></svg><figcaption>{person.id}</figcaption></figure>)}</div>
}

function SchedulerDecisionDemo(){
 const [committed,setCommitted]=useState(false);
 return <div className={`schedulerDecisionCanvas ${committed?'is-committed':''}`}>
   <div className="schedulerRecommendationGrid" aria-label="Tuesday 10:30 selected from the group availability grid"><header><span>Group availability</span><strong>3 responses</strong></header><div className="schedulerDecisionDays"><b>Mon</b><b>Tue</b><b>Wed</b></div><div className="schedulerDecisionRows"><span>10:00</span><i></i><i className="warm"></i><i></i><span>10:30</span><i className="warm"></i><i className="chosen">3</i><i className="warm"></i><span>11:00</span><i></i><i className="warm"></i><i></i></div><footer>Highest availability · fewest conflicts</footer><button type="button" className={`schedulerChooseButton ${committed?'is-committed':''}`} onClick={()=>setCommitted(true)} aria-expanded={committed}>{committed?'Calendar event created':<><span>Choose Tue · 10:30</span><small>Click to create the shared event <i aria-hidden="true">↓</i></small></>}</button></div>
   {committed&&<><div className="schedulerCommitPath" aria-hidden="true"><i></i><span>Chosen</span></div><article className="schedulerCalendarInvite" aria-live="polite"><header><time><b>16</b><span>SEP</span></time><div><span>Tuesday</span><strong>Design Sync</strong></div></header><dl><div><dt>Time</dt><dd>10:30–11:00 AM</dd></div><div><dt>Place</dt><dd>Minskoff Pavilion</dd></div><div><dt>Going</dt><dd><span className="schedulerAvatars"><i>N</i><i>M</i><i>A</i></span>3 participants</dd></div></dl><strong className="schedulerCalendarAction">Calendar ready</strong></article></>}
   <p className="schedulerDecisionCaption">{committed?'The selected time carries the venue, participants, notes, and sharing details into one calendar-ready event.':'Pick the best overlap to carry it forward as a complete event.'}</p>
 </div>
}

const schedulerStages=[
 {id:'sc-brief',name:'Brief',did:'“Build When2meet”'},
 {id:'sc-discover',name:'Discover',did:'A heatmap isn’t a plan'},
 {id:'sc-research',name:'Research',did:'7 student interviews'},
 {id:'sc-design',name:'Design',did:'From overlap to an event'},
 {id:'sc-compare',name:'Compare',did:'What When2meet leaves out'},
 {id:'sc-build',name:'Build',did:'One record, kept in sync'}
];

/* When2meet set the bar: every student I interviewed already used it. Each row is a step
   it hands back to the group chat, and the feature I built to keep it in one window. */
const scCompareRows=[
 {label:'Availability',them:'Free or busy. Nothing in between.',mine:'Maybe is its own answer: it can break a tie between times, but it never counts as a yes.',
  icon:<><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7 12h3M13.5 12h3.5" strokeLinecap="round"/><circle cx="11.5" cy="12" r="1.2" fill="currentColor" stroke="none"/></>},
 {label:'Filling it in',them:'Click every cell, one by one, every time.',mine:'Connect Outlook or Google Calendar and your booked hours arrive already blocked out. Don’t want to link a calendar? Quick fill paints a whole block in one click. Either way, nobody clicks 35 cells.',
  icon:<><rect x="3" y="4.5" width="18" height="15.5" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4" strokeLinecap="round"/><path d="M9 14.5l2.2 2.2L15.5 12" strokeLinecap="round" strokeLinejoin="round"/></>},
 {label:'Picking a time',them:'You read the heatmap and argue it out.',mine:'Ranked times, each with who it works for and who it costs.',
  icon:<><path d="M4 20V13M10 20V8.5M16 20v-5M22 20V4.5" strokeLinecap="round"/></>},
 {label:'Where to meet',them:'Not its job.',mine:'A location poll in the same window: options in, votes back, winner attached to the event.',
  icon:<><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></>},
 {label:'Talking it through',them:'Everyone opens a group chat somewhere else.',mine:'A chat room on the event itself, so the reason for a time stays next to the time.',
  icon:<><path d="M20 14.5a2.5 2.5 0 0 1-2.5 2.5H8l-4 3.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5z"/><path d="M8.5 9.5h7M8.5 13h4.5" strokeLinecap="round"/></>},
 {label:'Making it real',them:'Retype the time into your calendar.',mine:'The chosen time becomes a calendar event with the place, the chat and the guest list attached.',
  icon:<><rect x="3" y="4.5" width="18" height="15.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4" strokeLinecap="round"/><circle cx="12" cy="14.5" r="2" fill="currentColor" stroke="none"/></>},
 {label:'When plans change',them:'Re-share the link and hope.',mine:'Every edit reaches everyone’s screen live.',
  icon:<><path d="M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6" strokeLinecap="round"/><path d="M4 21v-5h5M20 3v5h-5" strokeLinecap="round" strokeLinejoin="round"/></>},
 {label:'Who is actually coming',them:'A grid of names.',mine:'Going, maybe or out, per person, on the event.',
  icon:<><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 11.5a3 3 0 1 0-1.6-5.5M17 20a6 6 0 0 0-2.6-4.9" strokeLinecap="round"/></>}
];
function SchedulerCompare(){
 return <div className="scCompareWrap">
  <p className="scCompareIntro">Copying When2meet would have been a finished grade and an unfinished product. It is genuinely good at one step, collecting availability, and hands everything after it back to the group chat. Every row below is something it handed back, and what I decided to do instead.</p>
  <div className="scCompare">
   <div className="scCompareHead"><span/><span className="scCompareThem">When2meet</span><span className="scCompareMine">This app</span></div>
   {scCompareRows.map(row=><div className="scCompareRow" key={row.label}>
    <span className="scCompareLabel">{row.label}</span>
    <span className="scCompareThem">{row.them}</span>
    <span className="scCompareMine"><svg viewBox="0 0 24 24" aria-hidden="true">{row.icon}</svg><b>{row.mine}</b></span>
   </div>)}
  </div>
  <p className="scCompareNote">Built for MSU study groups and org meetings, which is where all seven interviews came from.</p>
 </div>
}

function SchedulerBrief(){return <section className="schedulerBriefSection scStage" id="sc-brief" aria-labelledby="scheduler-brief-title">
  <h2 id="scheduler-brief-title">The brief before the build</h2>
  <article className="schedulerBriefWindow" aria-label="Product requirements document">
   <div className="schedulerBriefChrome" aria-hidden="true"><span className="schedulerBriefDots"><i/><i/><i/></span><b>Scheduler PRD · Google Docs</b></div>
   <div className="schedulerBriefBar" aria-hidden="true">
    <i className="schedulerBriefFileIcon"/>
    <div><b>Scheduler PRD</b><span>File · Edit · View · Insert · Format · Tools</span></div>
    <em>Share</em>
   </div>
   <div className="schedulerBriefToolbar" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
   <div className="schedulerBriefPage">
    <header><h3>Group Scheduling App PRD</h3><p>Neha Chinimilli · CSE 477 brief: “build When2meet” · MSU study groups</p></header>
    <h4>Goal</h4>
    <p>Let a group capture availability, choose a time and venue, and leave with one shared event, without making the decision for them.</p>
    <h4>Requirements</h4>
    <ol>
     <li><b>Make entry cost nothing.</b> Import a calendar or paint a block; nobody fills 35 cells by hand.</li>
     <li><b>Preserve uncertainty.</b> Blank already means no; Maybe is the one answer a grid can’t hold.</li>
     <li><b>Rank the times, don’t decide them.</b> The software reads the overlap so the group doesn’t; the group still picks.</li>
     <li><b>Carry the decision forward.</b> Venue votes, status, notes, and calendar on one record.</li>
    </ol>
    <h4>Out of scope</h4>
    <p>Auto-selecting a time, or replacing the group’s judgment with an algorithm.</p>
    <h4>Success criteria</h4>
    <p>A group reaches a confirmed event, and “maybe” is never read as yes.</p>
   </div>
  </article>
 </section>}

function SchedulerCase(){return <div className="schedulerStory"><LifecycleRoad stages={schedulerStages} vehicle="calendar"/>
  <section className="schedulerDemo"><SchedulerDemo/></section>
  <SchedulerBrief/>
  <section id="sc-discover" className="schedulerProblemStage scStage"><h2 className="csTitle">A heatmap did not finish the plan.</h2><div><p>Students could mark when they were free, but tentative availability was flattened into yes or no. Then the grid handed the rest back: read the shading yourself, work out which slot costs the fewest people, and settle the time, the place, and the invite somewhere else. Ranking a heatmap is a job the software can do.</p></div><SchedulerFlatten/></section>
  <CaseSection title="What I learned from seven student interviews" className="schedulerResearchSection scStage" id="sc-research"><div className="schedulerResearchDesk"><aside className="schedulerInterviewIndex"><strong>7 students</strong><span>One-on-one conversations</span><span>Live task walkthroughs</span><SchedulerPeople/></aside><div className="schedulerNotebook"><div className="schedulerSessionNotes"><article><svg viewBox="0 0 64 40" aria-hidden="true"><circle cx="12" cy="20" r="9" fill="#b9d7c7"/><circle cx="32" cy="20" r="9"/><path d="M32 11a9 9 0 0 1 0 18z" fill="#e7d9ad"/><circle cx="52" cy="20" r="9"/></svg><b>Students wanted a way to say “maybe.”</b><p>Tentative availability was useful information, but the binary grid erased it.</p><span>Seen during availability entry</span></article><article><svg viewBox="0 0 64 40" aria-hidden="true"><path d="M4 4h10v10H4zM18 4h10v10H18zM32 4h10v10H32zM4 18h10v10H4zM18 18h10v10H18zM32 18h10v10H32z"/><path d="M50 14a5 5 0 1 1 7 4.6c-1.3.6-2 1.6-2 3V24M55 30v.5"/></svg><b>The heatmap did not finish the task.</b><p>Groups opened another chat to interpret the overlap, choose a room, and confirm the plan.</p><span>Seen after comparing schedules</span></article><article><svg viewBox="0 0 64 40" aria-hidden="true"><rect x="4" y="8" width="16" height="22" rx="3"/><rect x="26" y="4" width="14" height="14" rx="3" transform="rotate(12 33 11)"/><rect x="44" y="18" width="16" height="16" rx="3" transform="rotate(-10 52 26)"/><path d="M22 20l3-2M41 20l3 2" strokeDasharray="2 3"/></svg><b>Event details split across tools.</b><p>Time, venue, participant status, and notes separated as soon as the group left the grid.</p><span>Seen during follow-through</span></article></div><footer><i aria-hidden="true">→</i><strong>Keep Maybe as its own answer, then recommend a time and carry that choice into venue and calendar setup.</strong></footer></div></div></CaseSection>
  <CaseSection title="From availability to a confirmed event" className="schedulerDecisionSection scStage" id="sc-design"><SchedulerDecisionDemo/></CaseSection>
  <CaseSection title="Everything When2meet left to the group chat" className="schedulerCompareSection scStage" id="sc-compare"><SchedulerCompare/></CaseSection>
  <section id="sc-build" className="schedulerBuild scStage"><header><h2>One event, kept in sync.</h2></header><SchedulerSync/></section>
 </div>}

const chatStages=[
 {id:'ch-frame',name:'Frame',did:'Why recreate iMessage'},
 {id:'ch-discover',name:'Discover',did:'Study iMessage’s rules'},
 {id:'ch-design',name:'Design',did:'Stored vs. temporary state'},
 {id:'ch-build',name:'Build',did:'Socket.IO room events'}
];
function ChatCase(){return <div className="chatStory"><LifecycleRoad stages={chatStages} vehicle="bubble"/>
  <section className="sandboxSection"><ChatSandbox/></section>
  <CaseSection title="Why recreate iMessage" className="chatFrameSection chStage" id="ch-frame">
   <div className="chatFrameLead">The brief was a feature list: a real-time chat room with messages and join and leave events. I made it a product by recreating iMessage. Every user already knew it by heart, so <em>their expectations became my spec</em>, and a design study of how Apple thinks.</div>
   <div className="chatFrameCols">
    <div><h3>What users expect</h3><ol>
     <li><b>Where did my message go?</b><span>Mine right and blue, theirs left and gray</span></li>
     <li><b>Is someone replying?</b><span>Typing shows, then quietly clears</span></li>
     <li><b>Can I react without replying?</b><span>A Tapback on the original message</span></li>
     <li><b>Who’s here?</b><span>Joins and leaves as room events</span></li>
    </ol></div>
    <div><h3>How Apple answers</h3><ol>
     <li><b>Tail on the last bubble only</b><span>Groups a run into one thought</span></li>
     <li><b>Name only when the speaker changes</b><span>Less repetition, same clarity</span></li>
     <li><b>Typing is a bubble, not text</b><span>Feedback that never enters history</span></li>
     <li><b>Reactions attach, never post</b><span>Response without noise</span></li>
    </ol></div>
   </div>
   <dl className="chatFramePM">
    <div><dt>Scope</dt><dd>Keep whatever answers those questions. Cut photos, replies, and read receipts: expected, but not what makes a chat feel right.</dd></div>
    <div><dt>Tradeoff</dt><dd>Sending typing and reactions as ordinary messages would reuse one pipeline and ship faster. It would also fill history with noise, so I gave each its own event type and paid for it in extra socket logic.</dd></div>
    <div><dt>Success bar</dt><dd>Nobody should need instructions. If a classmate could open it, chat, react, and leave without asking how, it worked.</dd></div>
    <div><dt>Next</dt><dd>Read receipts, the most expected thing still missing, then keeping history across a page reload.</dd></div>
   </dl>
  </CaseSection>
  <section className="chatRuleStage chStage" id="ch-discover"><h2 className="csTitle">Recreating the interaction rules behind iMessage</h2><div><p>I treated iMessage like a design study. I used it the way my users would, and wrote down what happened for every kind of event: sending, typing, reacting, someone arriving or leaving. The pattern was that iMessage never treats these the same way. Some change the conversation’s history; others only change what you see right now.</p></div><ChatAnatomyPhone/></section>
  <CaseSection title="Persistent state and temporary state" className="chatStateSection chStage" id="ch-design"><div className="chatInk"><section className="chatInkStored"><h3><svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>Stored state</h3><p className="chatInkLine"><strong>“did everyone push?”</strong><span>Message · stored and synchronized</span></p><p className="chatInkLine"><strong>❤️ on the same message</strong><span>Tapback · updates existing state</span></p></section><section className="chatInkTemp"><h3><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2"/></svg>Temporary state</h3><p className="chatFade"><strong>typing…</strong><span>Times out</span></p><p className="chatFade chatFadeLate"><strong>Maya joined</strong><span>Room event</span></p></section></div></CaseSection>
  <CaseSection title="How I implemented those states" className="chatBuildSection chStage" id="ch-build"><ol className="chatPath"><li><span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 11 21 3l-8 18-2-8z"/></svg></span><strong>Send</strong>Socket.IO broadcasts the message.</li><li><span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-14 5M4 12a8 8 0 0 1 14-5M18 3v4h-4M6 21v-4h4"/></svg></span><strong>Sync</strong>Every client receives the same room state.</li><li><span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2"/></svg></span><strong>Expire</strong>Typing disappears instead of entering history.</li><li><span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg></span><strong>Update</strong>A Tapback changes the original message state.</li></ol></CaseSection>
 </div>}

// Each scene ties a product decision to a supplied artifact. Motion compares viewport
// widths only; all narrative content stays visible without animation or JavaScript.
const esteeStages=[
 {id:'el-discover',name:'Discover',did:'Will this work for me?'},
 {id:'el-design',name:'Design',did:'Question, then benefits'},
 {id:'el-scope',name:'Scope',did:'Hand checkout to retailers'},
 {id:'el-build',name:'Build',did:'Responsive, image-heavy'},
 {id:'el-present',name:'Present',did:'Top 5, C-suite'}
];
function EsteeCase(){
 const [compact,setCompact]=useState(false);
 return <div className="elEditorial"><LifecycleRoad stages={esteeStages} vehicle="bottle"/>
  <section className="elVanity elStage" id="el-discover"><h2 className="csTitle">Foundation is the hardest thing to buy without trying it on.</h2>
   <div className="elMirrorScene isVanity"><div className="elVanityFrame">{Array.from({length:14},(_,i)=><i key={i} className="elBulb" style={{'--i':i} as React.CSSProperties}/>)}<div className="elMirrorGlass"><div className="elReflection"/><p>Will this foundation<br/> <em>work for me?</em></p><span>The shopper question</span></div></div><div className="elVanityTable"/></div>
   <div className="elProblem"><p>At a counter, a shopper swatches a shade, feels the finish, and asks someone who knows. Online, the page has to do all of that work. When it does not, people guess or leave.</p><p>I went through Estée Lauder’s own pages alongside Sephora and Ulta, and they answer the same way: the product shot is the focal point, the copy is underneath it, and the shopper is left to work out fit on their own. That is a good promotional page and a poor answer to the only question I had when buying foundation myself.</p><p>So I read the brief as a job rather than a page type: build enough confidence in fit, finish, coverage, and shade to decide whether Double Wear is for them. That meant leading with their question instead of a product grid, then moving them toward a confident yes or no.</p></div>
  </section>
  <section className="elInvitation elStage" id="el-design"><h2 className="csTitle">Start with a question the shopper can answer.</h2><figure><img src={assetUrl('project-media/el-shop.webp')} width={1600} height={1015} alt="Original Double Wear screen asking what the shopper looks for in a foundation" loading="lazy"/><figcaption>The original opening screen. Familiar Double Wear imagery earns recognition; the question gives the shopper an easy first move.</figcaption></figure></section>
  <section className="elProof"><header><h2>One benefit at a time.</h2></header><figure><img src={assetUrl('project-media/el-benefits.webp')} width={1600} height={1015} alt="Original benefits carousel showing finish, buildable coverage, and wear information" loading="lazy"/><figcaption>Actual project screen · Product benefits carousel</figcaption></figure></section>
  <section className="elPurchase elStage" id="el-scope"><h2 className="csTitle">Know where the product ends.</h2><div className="elRetail"><p>Nothing in the brief stopped me adding a cart, and a week was enough to fake one. I decided against it: rebuilding checkout would have meant inventory, payments, and accounts, real work that helps nobody decide, and shoppers already have a favorite place to buy beauty. So I spent the week on discovery and linked out to eight established retailers, letting people finish the purchase where they already trust.</p><figure><img src={assetUrl('project-media/el-shades.webp')} width={955} height={1078} alt="Original purchase page showing foundation imagery and retailer links including Estée Lauder, Sephora, Ulta, and Nordstrom" loading="lazy"/><figcaption>Original retailer page with product and shade context.</figcaption></figure></div><aside className="elScope" ref={el=>{if(!el||el.dataset.io)return;el.dataset.io='1';const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('isIn');io.disconnect()}},{threshold:.3});io.observe(el)}} aria-label="Scope decisions: kept brand scale, imagery, and shade context; simplified dense product details into scannable benefits; handed checkout to eight established retailers"><h3>Where I drew the line</h3><div className="elBottleScene"><svg className="elBottle" viewBox="0 0 200 320" aria-hidden="true"><defs><linearGradient id="elCap" x1="0" x2="1"><stop offset="0" stopColor="#7d5a26"/><stop offset=".22" stopColor="#c9a25d"/><stop offset=".42" stopColor="#f3dfae"/><stop offset=".6" stopColor="#c19a55"/><stop offset="1" stopColor="#6f4f20"/></linearGradient><linearGradient id="elCapTop" x1="0" x2="1"><stop offset="0" stopColor="#a8823f"/><stop offset=".5" stopColor="#f6e6bd"/><stop offset="1" stopColor="#8e6a30"/></linearGradient><linearGradient id="elGlass" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity=".95"/><stop offset=".12" stopColor="#f4efe8" stopOpacity=".6"/><stop offset=".85" stopColor="#efe8de" stopOpacity=".55"/><stop offset="1" stopColor="#d9cfc0" stopOpacity=".95"/></linearGradient><linearGradient id="elKeepFill" x1="0" x2="1"><stop offset="0" stopColor="#4a2a17"/><stop offset=".5" stopColor="#6e412a"/><stop offset="1" stopColor="#3f2313"/></linearGradient><linearGradient id="elSimplifyFill" x1="0" x2="1"><stop offset="0" stopColor="#7a4b2e"/><stop offset=".5" stopColor="#9a6441"/><stop offset="1" stopColor="#6c4128"/></linearGradient><radialGradient id="elShadow"><stop offset="0" stopColor="#3b2a1a" stopOpacity=".28"/><stop offset="1" stopColor="#3b2a1a" stopOpacity="0"/></radialGradient><clipPath id="elInside"><path d="M44 112q0-10 10-10h92q10 0 10 10v176q0 8-8 8H52q-8 0-8-8z"/></clipPath></defs><ellipse cx="100" cy="312" rx="86" ry="8" fill="url(#elShadow)"/><rect x="66" y="6" width="68" height="62" rx="4" fill="url(#elCap)"/><rect x="66" y="6" width="68" height="7" rx="3" fill="url(#elCapTop)"/>{[74,82,90,98,106,114,122].map(x=><path key={x} d={`M${x} 14v50`} stroke="#5b3f14" strokeOpacity=".22" strokeWidth="1.2"/>)}<path d="M72 14v50" stroke="#fff" strokeOpacity=".5" strokeWidth="2"/><rect x="78" y="68" width="44" height="14" fill="#6f4f20"/><rect x="78" y="68" width="44" height="3" fill="#3e2a0e" fillOpacity=".5"/><path d="M26 108q0-26 26-26h96q26 0 26 26v186q0 20-20 20H46q-20 0-20-20z" fill="url(#elGlass)" stroke="#cbbba2" strokeWidth="1.6"/><g clipPath="url(#elInside)"><g className="elFill"><rect x="40" y="150" width="120" height="70" fill="url(#elSimplifyFill)"/><rect x="40" y="220" width="120" height="80" fill="url(#elKeepFill)"/><path d="M40 150q30-6 60 0t60 0v4q-30 6-60 0t-60 0z" fill="#b07a54"/></g></g><path d="M44 112q0-10 10-10h92q10 0 10 10v176q0 8-8 8H52q-8 0-8-8z" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.2"/><path d="M34 118v160" stroke="#fff" strokeOpacity=".75" strokeWidth="5" strokeLinecap="round"/><path d="M166 124v120" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round"/><text x="100" y="124" textAnchor="middle" className="elBottleBrand">ESTĒE LAUDER</text><text x="100" y="140" textAnchor="middle" className="elBottleName">Double Wear</text></svg><ol className="elScopeNotes"><li className="is-handoff"><b>Handed off</b><span>Checkout stays with 8 established retailers</span><span className="elBags" aria-hidden="true">{Array.from({length:8},(_,i)=><svg key={i} viewBox="0 0 24 28"><path d="M8.5 9V6.5a3.5 3.5 0 0 1 7 0V9" className="elBagHandle"/><path d="M3.5 9h17l-1.2 16.2a1.5 1.5 0 0 1-1.5 1.3H6.2a1.5 1.5 0 0 1-1.5-1.3z" className="elBagBody"/><path d="M3.5 9h17l-.3 3.4H3.8z" className="elBagFold"/><circle cx="8.5" cy="12" r=".9" className="elBagEyelet"/><circle cx="15.5" cy="12" r=".9" className="elBagEyelet"/></svg>)}</span></li><li className="is-simplify"><b>Simplified</b><span>Dense product details became scannable benefits</span></li><li className="is-keep"><b>Kept</b><span>Brand scale, product imagery, and shade context</span></li></ol></div></aside></section>
  <section className="elResponsive elStage" id="el-build"><header><div><h2>An image-led site has to survive a phone.</h2></div><div><p>This product sells through imagery: bottles, textures, shades. Crop it badly on a small screen and the shade context disappears, so responsive layout was a core problem, not polish. I reused a small set of responsive patterns so images scaled intact and the story kept its order as the screen narrowed.</p><p className="elSmall">Toggle the width to see the original capture scale.</p></div></header><div className="elSizeToggle" role="group" aria-label="Compare image presentation widths"><button aria-pressed={!compact} onClick={()=>setCompact(false)}>Wide canvas</button><button aria-pressed={compact} onClick={()=>setCompact(true)}>Narrow canvas</button></div><div className={`elViewport ${compact?'elViewportCompact':''}`}><img src={assetUrl('project-media/el-home.webp')} width={1600} height={1015} alt="Original Double Wear homepage, scaled without cropping" loading="lazy"/></div><p className="elViewportCaption">The original imagery stays intact as the available width changes.</p></section>
  <section className="elFinal elStage" id="el-present"><h2 className="csTitle">Top 5 finalist and C-suite presentation.</h2><div className="elCompactScene"><EsteeCompact/></div><EsteeOutcome/></section>
 </div>
}

function BookclubPhoneHero(){return <BookclubEditorialHero/>;}


const accentureStages=[
 {id:'ax-discover',name:'Discover',did:'Supported 21 live requests'},
 {id:'ax-define',name:'Define',did:'Write the rules down'},
 {id:'ax-build',name:'Build',did:'Build and launch'},
 {id:'ax-test',name:'Test',did:'Find where rules break'},
 {id:'ax-recommend',name:'Recommend',did:'Five ideas, each with a 90-day test'}
];
function AccentureCase(){return <div className="accentureStory"><AccentureStagger/><LifecycleRoad stages={accentureStages} vehicle="cablecar"/>
  <CaseChapter id="ax-discover" className="axStage axDiscover" title={<>How one request moved <em>through the process.</em></>} lead="At Accenture in San Francisco, I supported intake, trainer matching, and scheduling for an AI lab client. Every request crossed three tools before a trainer was booked for a training session.">
   <AccentureRequestRelay/>
  </CaseChapter>

  <CaseChapter id="ax-define" className="axStage axRules csChapter--split" title={<>From repeated decisions <em>to rules I could test.</em></>} lead="The same checks came up on every request, so I wrote them into a 10-tab data contract: required inputs, matching logic, warnings, reason codes, and the cases that need a person.">
   <AccentureWorkflowVisual/>
  </CaseChapter>

  <CaseChapter id="ax-build" className="axStage axBuild" title={<>Then the workflow, <em>built and launched.</em></>} lead="I built an OpenAI API workflow in Codex, using tool calling, MCP, and RAG. It automates Salesforce intake, trainer matching, and calendar checks, and routes only flagged cases to a coordinator. It went live and cuts about 60 minutes of coordinator work per request.">
   <AccentureToolRelay/>
  </CaseChapter>

  <div className="axStage csMoment" id="ax-test">
   <DecisionMoment
    statement={<>A free slot<br/>is not a yes.</>}
    sub="Rules handle what repeats. Anything uncertain stops at a gate for a coordinator, and one late-night test case is what drew the line."
    because={<p>A request cleared every automated check for expertise, capacity, and availability, and still resolved to 10:30 PM in the trainer’s local time. The rules were matching on calendar data, not on whether a person would actually say yes at that hour.</p>}
    tradeoff={<Tradeoff pairs={[
     ['Requests that resolve end to end on their own','Every recommendation carries a reason a person can check'],
     ['A higher automation rate to report','Exceptions surface before a trainer ever sees them']
    ]}/>}
    result={<p>Working-hours and time-zone checks went into the matching rules, and warnings and conflicts became a human-review stop rather than something the system resolved on its own. The boundary itself became part of the 10-tab specification.</p>}
   >
    <AccentureBoundary/>
   </DecisionMoment>
  </div>

  <CaseChapter id="ax-recommend" className="axStage axRecommend" title={<>Using evidence <em>to decide what to test next.</em></>}>
   <AccentureEvidenceFunnel/>
   <div className="csPull"><p className="csPullFigure" aria-hidden="true">8x</p><p className="axClose">The clearest signal in the data was how unevenly the program was used: the heaviest-using teams ran <b>8x</b> the requests per trainer of the lightest. That gap is what the five recommendations are aimed at, and each one ships with a 90-day test so the program can tell whether it closed.</p></div>
  </CaseChapter>
 </div>}

const kohlerStages=[
 {id:'kx-discover',name:'Discover',did:'In stock, not ready to ship'},
 {id:'kx-define',name:'Define',did:'Center it on the order'},
 {id:'kx-design',name:'Design',did:'One workspace, four roles'},
 {id:'kx-build',name:'Build',did:'Rules, agent, human gate'},
 {id:'kx-deliver',name:'Deliver',did:'What we shipped'}
];
function KohlerCase(){
 return <div className="kohlerStory"><LifecycleRoad stages={kohlerStages} vehicle="box"/>
  <CaseChapter id="kx-discover" className="kxStage kxProblem" title="The order problem" lead="A product can be in stock and still not be ready to export. If the destination needs a different spec sheet, label, warranty, or translation, that material has to be prepared before the order can move.">
   <KohlerOrderHold/>
  </CaseChapter>

  <div className="kxStage csMoment" id="kx-define">
   <DecisionMoment
    statement={<>Center it on<br/>the order.</>}
    because={<p>The product record says what the item is. It cannot say what this shipment, to this market, still needs. Every hold we looked at came from work that only became visible once an order already existed, by which point someone was searching across systems to rebuild it.</p>}
    tradeoff={<Tradeoff pairs={[
     ['One canonical view of the product','A workspace that only makes sense once there is an order'],
     ['Preparing market material once, up front','Preparing it per destination, every time'],
     ['A system that decides on its own','A gate that stops and waits for a person']
    ]}/>}
    result={<p>Documents, missing information, validation and review all stay attached to the same order, and every generated line points back to the approved source and the person who reviewed it.</p>}
   >
    <KohlerPrinciples/>
   </DecisionMoment>
  </div>

  <CaseChapter id="kx-design" className="kxStage kxProduct" title="The product in use" lead="Change the destination to see the market packet update without touching the product record.">
   <section className="kohlerProductStage"><KohlerProductSurface/></section>
   <KohlerRoles/>
  </CaseChapter>

  <CaseChapter id="kx-build" className="kxStage kxBuild" title="How the packet gets made" lead="Rules check what is certain, an agent drafts what is market-specific, and a person approves the result.">
   <KohlerAssembly/>
   <h3 className="kxExceptionsTitle">What stops at the review gate</h3>
   <KohlerExceptions/>
  </CaseChapter>

  <CaseChapter id="kx-deliver" className="kxStage kxDeliver" title="What we built and delivered"><KohlerDelivery/></CaseChapter>

  <CaseResults items={metrics.kohler.filter(([,,type])=>type==='outcome') as [string,string][]}/>
 </div>
}


function BookclubCase(){return <BookclubEditorial/>;}

function BookclubCaseLegacy(){return <>
  <CaseSection title="The problem"><p>A book club’s hardest work happens between meetings. The next title sits across text threads, polls, and search tabs; readers move at different speeds; discussion risks spoilers; and meeting details are hard to find again later.</p><p>I designed and built Bookclub for a private reading group so that choosing, reading, discussing, and meeting could work as one continuous product loop.</p></CaseSection>
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
  <CaseSection title="Live testing"><p className="bookclubMeasureIntro">Bookclub is live with 10 active users in an invite-only club. I’m combining observed use with lightweight user tests to find where selection, reading, and meeting coordination still create friction.</p><div className="bookclubMeasures"><div><strong>First-use success</strong><span>Can a new member join and nominate without help?</span></div><div><strong>Selection momentum</strong><span>Where does the path from shortlist to final choice stall?</span></div><div><strong>Reading rhythm</strong><span>Do progress and checkpoints bring readers back between meetings?</span></div><div><strong>Conversation carryover</strong><span>Do saved thoughts become replies or useful agenda items?</span></div></div></CaseSection>
</>}
const grazeStages=[
 {id:'gz-discover',name:'Discover',did:'New sites, stronger branches'},
 {id:'gz-define',name:'Define',did:'One rubric for every market'},
 {id:'gz-analyze',name:'Analyze',did:'Score the candidates'},
 {id:'gz-recommend',name:'Recommend',did:'Grow the two branches'},
 {id:'gz-deliver',name:'Deliver',did:'Hand off scorecard + rubric'}
];
function MarketExpansionCase(){return <div className="grazeStory"><LifecycleRoad stages={grazeStages} vehicle="cheese"/>
  <section id="gz-discover" className="grazeBrief gzStage"><h2 className="csTitle">Compare candidate locations with the same criteria.</h2><div><p>Graze Craze wanted to evaluate new franchise locations and strengthen demand at its existing Okemos and Shelby Township branches.</p><GrazeBriefFacts/></div></section>
  <section id="gz-define" className="grazeSection gzStage"><h2 className="csTitle">Turn market research into a repeatable score.</h2><header className="grazeSectionHeading"><p>The rubric compared partnership potential, facility requirements, customer opportunity, and competition using the same scoring logic. Select a criterion to see an example.</p></header><GrazeRecipe/><GrazePrepSteps/><p className="grazeSourceNote">The deck provides Michigan criticality values and allows users to customize them for other markets. Baseline checks include 5,000 B2B and 100,000 B2C opportunities.</p></section>
  <section id="gz-analyze" className="grazeSection gzStage">
   <DecisionMoment
    statement={<>One point is<br/>not a decision.</>}
    sub="Northville scored 123. Ann Arbor scored 122. Traverse City scored 101."
    because={<p>Every input into that score is an estimate: criticality weights, B2B and B2C opportunity counts, competitor coverage. A one-point gap sits well inside the model’s own margin of error. Ranking Northville first would have handed the client a precision the data could not support.</p>}
    tradeoff={<Tradeoff pairs={[
     ['A single recommended site, cleanly ranked','Two markets to investigate, and the reason why'],
     ['Letting the model make the call','Saying out loud where the model stops being decisive']
    ]}/>}
    result={<p>The team recommended investigating properties and owners in both top markets. The 101 is what the scorecard was genuinely decisive about, and the client kept a rubric it could rerun on any market.</p>}
   >
    <GrazeLocations/>
   </DecisionMoment>
  </section>
  <section id="gz-recommend" className="grazeSection gzStage"><h2 className="csTitle">Recommendations for the two existing Michigan branches.</h2><header className="grazeSectionHeading"><p>The team linked softer early-year demand to post-holiday spending constraints and New Year health priorities. Its recommendations focused on community outreach, B2B relationships, and targeted paid marketing.</p></header><GrazeGrowth/></section>
  <section id="gz-deliver" className="grazeSection grazeEvidence gzStage"><header className="grazeSectionHeading"><h2>What the client received</h2></header><GrazeArtifacts/><span className="grazeSourceNote">Source: Graze Craze Revenue Generation and Franchising Strategy · April 19, 2024</span></section>
  
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
  return <article className={`moreBuildCard clickable project-${project.id}`}><a className="moreBuildAction" href={`#/projects/${project.id}`} onClick={(event)=>{event.preventDefault();onOpen(project.id)}} aria-label={`Open ${project.title}`}><div className="moreBuildVisual"><ProjectCover type={project.media}/></div><div className="moreBuildCopy"><span>{project.company}</span><h3>{project.title}</h3>{project.blurb&&<p className="moreBuildBlurb">{project.blurb}</p>}<span className="projectTextLink">Learn more ↗</span></div></a></article>
}
function MoreTechnicalCard({title,subtitle,kind,description}){
  return <article className="moreBuildCard"><div className="moreBuildVisual technicalCompact"><TechnicalCard title={title} subtitle={subtitle} kind={kind} description={description}/></div></article>
}

function CompanyLogo({src='',alt='',label=''}){const [failed,setFailed]=useState(false);const fallback=label||alt.split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0]).join('').toUpperCase();return <div className={`companyLogo ${failed?'fallback':''}`}>{src&&!failed?<img loading="lazy" decoding="async" src={src} alt={alt} onError={()=>setFailed(true)}/>:<strong className="logoText" aria-label={alt}>{fallback}</strong>}</div>}


const experienceItems=[
 {id:'accenture',caseStudy:'accenture',company:'Accenture',role:'Technology Summer Analyst',location:'San Francisco, CA',dates:'Summer 2026',logo:'company-logos/accenture-v31.png',short:'Built and launched an AI workflow for a frontier AI lab that cuts ~60 min of coordinator work per request, after supporting 21 live enablement requests and writing the rules into a 10-tab data contract.',detail:<div className="expStory"><p>I worked inside a live customer-enablement operation supporting 21 requests. I used the repeated checks and exceptions I saw to document matching rules, build and launch the request workflow, and recommend what the program should improve next.</p><div className="expMetricRow"><span><b>~60 min</b> saved per request</span><span><b>21</b> live requests</span><span><b>10-tab</b> data contract</span><span><b>3,862</b> user responses</span></div><div className="expColumns"><div><strong>Live requests</strong><span>Supported intake, validation, trainer fit, scheduling, status management, global coverage across six regions, and closeout.</span></div><div><strong>Automation requirements</strong><span>Documented required inputs, matching rules, warnings, reason codes, QA cases, and human-review points so repeated checks could be tested before automation.</span></div><div><strong>Research and recommendations</strong><span>Analyzed 3,862 user responses and researched ~20 providers, narrowing the work into 27 metrics, 12 patterns, five recommendations, and a 90-day test plan.</span></div></div></div>},
 {id:'palmer',company:'Russell Palmer Career Management Center',role:'Peer Coach',location:'East Lansing, MI',dates:'May 2025-May 2026',logo:'company-logos/palmer-v31.png',short:'Ran 20+ coaching sessions a week at MSU’s career center for 200+ undergraduates, and generated 40% of the positive feedback on a 25-coach team.',detail:<div className="expStory"><p>As a peer coach in MSU’s Russell Palmer Career Management Center, I met one-on-one with students for resume reviews, interview preparation, recruiting strategy, networking, and case prep. Each session ended with specific edits or next steps the student could use right away.</p><div className="expMetricRow"><span><b>20+</b> sessions weekly</span><span><b>200+</b> undergraduates coached</span><span><b>25</b> coaches on team</span><span><b>40%</b> of the team’s positive feedback</span></div></div>},
 {id:'fordcredit',caseStudy:'finsimple',company:'Ford Credit',role:'Software Engineering Intern',location:'Dearborn, MI',dates:'Summers 2024-2025',logo:'company-logos/ford-credit-v31.png',short:'Owned a customer-facing Ford Credit feature from requirements through production, improved delivery 15%, and turned recurring incidents into four playbooks that cut restoration time 50%.',detail:<div className="expStory"><p>As the sole intern embedded on FinSimple, I worked on customer-facing feature delivery and the systems around it: AEM, Salesforce APIs, QA and production environments, release coordination, incidents, and onboarding.</p><div className="expMetricRow"><span><b>15%</b> faster delivery</span><span><b>25</b> issues investigated</span><span><b>50%</b> faster restoration</span><span><b>4</b> recovery playbooks</span><span><b>50</b> people across 5 teams</span></div><div className="expColumns"><div><strong>Product</strong><span>Built AEM components and Salesforce-backed workflows from customer and business requirements; worked across UI behavior, REST/GraphQL integration, Postman validation, and testing through development, QA, and production.</span></div><div><strong>Delivery quality</strong><span>Reviewed QA security-scan findings and PR compliance, documented release and environment-tagging workflows, and researched OAuth/API error patterns to support reliable deployments.</span></div><div><strong>Production operations</strong><span>Monitored live incidents, analyzed customer-impacting failure patterns, and coordinated with Payment, DevOps, and QA teams while turning recurring issues into four reusable recovery playbooks.</span></div></div><div className="expNote">I also built a centralized onboarding hub from 15 technical resources across 3 teams, cutting intern ramp-up from ~2 weeks to 3 days.</div></div>},
 {id:'pwc',company:'PwC × Arc of Indiana',role:'Consulting Extern',location:'',dates:'Aug-Oct 2024',logo:'company-logos/pwc-v31.png',short:'Benchmarked five peer nonprofits for The Arc of Indiana on a seven-category scorecard I built, and all five recommendations were adopted.',detail:<div className="expStory"><p>Over a five-week externship, I independently researched The Arc of Indiana and peer organizations it could learn from. I defined the comparison criteria, built a weighted seven-category scorecard, benchmarked five organizations across 10+ engagement and innovation metrics, and turned the findings into recommendations for the client.</p><div className="expMetricRow"><span><b>7</b> scorecard categories</span><span><b>5</b> peer organizations</span><span><b>10+</b> metrics</span><span><b>5</b> recommendations adopted</span></div></div>},
 {id:'ford',caseStudy:'fcvf',company:'Ford Motor Company',role:'Software Engineering Intern',location:'Dearborn, MI',dates:'Summer 2023',logo:'company-logos/ford.png',short:'Built Ford’s Customer Value Framework as a web app, led four user interviews, and changed the interaction model based on them. Feedback volume went up 25%.',detail:<div className="expStory"><p>My first internship put me close to both the code and the user. On a 10-person team, I helped build the full-stack Customer Value Framework, interviewed users, and used what we learned to change the product and implementation.</p><div className="expMetricRow"><span><b>4</b> user interviews</span><span><b>100+</b> Git commits</span><span><b>7</b> legacy CSS files replaced</span><span><b>+25%</b> feedback volume</span></div><div className="expColumns two"><div><strong>What I owned</strong><span>Frontend and backend implementation, accessibility improvements, refactoring, user interviews, Agile planning, and turning product feedback into interface changes, including pagination and score-visibility changes.</span></div><div><strong>What changed</strong><span>We moved toward a multi-page experience, removed the in-progress score, and replaced seven legacy CSS files with a more maintainable Material-UI approach while feedback volume increased 25%.</span></div></div></div>},
 {id:'spectrum',caseStudy:'marketExpansion',company:'Spectrum Consulting Group',role:'Consultant',location:'East Lansing, MI',dates:'2022–May 2026',logo:'company-logos/spectrum-v31.png',short:'Seven client projects across consumer services, utilities, hospitality, automotive, and private equity: a location scorecard the client can rerun, 19 KPIs for a utility software selection, and a market-penetration strategy for a portfolio company in insurance tech.',detail:<div className="expStory"><div className="expMetricRow"><span><b>3,000+</b> data points</span><span><b>19</b> utility KPIs</span><span><b>3</b> locations compared</span><span><b>2</b> analysts mentored</span></div><div className="expColumns spectrumColumns"><div><strong>Consumer services</strong><span>Built an interactive Excel scorecard and rubric so the team could compare candidate locations using the same market and operating criteria. The team also developed community, partnership, and paid-media recommendations for existing branches.</span></div><div><strong>Utilities</strong><span>Built a criticality/feasibility rubric, defined 19 KPIs, and evaluated three software options for a multimillion-dollar utility.</span></div><div><strong>Hospitality</strong><span>Found engagement gaps across 3,000+ responses and recommended three digital initiatives that increased social interaction by 20%.</span></div><div><strong>Automotive SaaS</strong><span>Led the analysis workstream: combined customer pain points with funnel evidence, redesigned lead-management workflows, and defined target accounts, buyer roles, outreach sequences, CRM handoffs, and demo guidance tied to the workflow problems behind them.</span></div><div><strong>Private equity</strong><span>Built a market-penetration strategy for a private equity client’s portfolio company in insurance tech, and supported the value-creation work around integration and process rollout.</span></div></div></div>},
];


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
  {id:'broad',school:'Michigan State University',college:'Broad College of Business',degree:'B.A. Supply Chain Management',date:'May 2027',logo:'company-logos/msu-broad-clean.png'},
  {id:'engineering',school:'Michigan State University',college:'College of Engineering',degree:'B.S. Computer Science',date:'May 2027',logo:'company-logos/msu-engineering-clean.png'}
 ];
 return <section id="education" className="section educationSection"><div className="sectionTitle compactTitle"><h2>Education</h2></div><div className="educationRows">{schools.map(item=><article className={`educationRow education-${item.id}`} key={item.id}><div className="educationLogo"><img loading="lazy" decoding="async" src={item.logo} alt={`${item.college} logo`}/></div><div className="educationCopy"><span className="educationSchool">{item.school}</span><h3>{item.college}</h3><p>{item.degree}</p></div><time>{item.date}</time></article>)}</div></section>
}


function HobbyPopover({label,title,items,variant=''}){
  // Books fall onto the shelf the first time it opens; after that they're already there.
  const [dropped,setDropped]=useState('');
  if(variant==='shelf'){
    // [bookcloth, foil, length]: oxblood, bottle green, ochre (stamped in dark foil), navy, rust
    const spines=[['#6d2631','#d6b066',150],['#264a3f','#d3ad63',168],['#b6863a','#3b2612',140],['#28314f','#d4b06a',158],['#7c3a29','#d6b066',146]];
    return <span className="hobbyPopover" onMouseEnter={()=>setDropped(d=>d||'dropping')} onFocus={()=>setDropped(d=>d||'dropping')} onMouseLeave={()=>setDropped(d=>d==='dropping'?'done':d)} onBlur={()=>setDropped(d=>d==='dropping'?'done':d)}><button type="button" className="hobbyPopoverTrigger">{label}</button><span className={`hobbyShelf${dropped==='dropping'?' isDropping':dropped===''?' isFresh':''}`} role="tooltip"><strong>{title}</strong><span className="shelfBooks">{items.map((item,i)=>{const [bg,fg,h]=spines[i%spines.length];return <span key={item} className="shelfBook" style={{'--bg':bg,'--fg':fg,'--h':`${h}px`,'--k':i} as React.CSSProperties}><em>{item}</em></span>})}</span><span className="shelfBoard" aria-hidden="true"/></span></span>;
  }
  if(variant==='tv'){
    return <span className="hobbyPopover"><button type="button" className="hobbyPopoverTrigger">{label}</button><span className="hobbyTv" role="tooltip"><span className="tvAntenna" aria-hidden="true"/><span className="tvBody"><span className="tvScreen"><strong>{title}</strong>{items.map((item,i)=><span key={item} className="tvShow" style={{'--k':i,'--n':items.length} as React.CSSProperties}><b>CH {i+2}</b>{item}</span>)}</span><span className="tvKnobs" aria-hidden="true"><i/><i/><span/></span></span><span className="tvLegs" aria-hidden="true"/></span></span>;
  }
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
  {src:'project-media/about-film/09-conservatory.jpg',width:1193,height:1800,alt:'Water lilies and hanging orchids under the glass roof of a plant conservatory'},
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
 return <form className={`bookRecForm ${status}`} onSubmit={submit}><p className="bookRecTitle"><svg className="bookRecIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.5C10 5 7 4.6 3.5 5v13c3.5-.4 6.5 0 8.5 1.5 2-1.5 5-1.9 8.5-1.5V5C17 4.6 14 5 12 6.5z"/><path d="M12 6.5v13"/></svg>Reading anything good? Send me a rec.</p><div className="bookRecRow"><input id="book-rec" aria-label="Leave me a book rec" value={book} onChange={e=>{setBook(e.target.value);if(status==='error'||status==='sent')setStatus('idle')}} placeholder={status==='sent'?'Added to my reading list :)':'Title and author'} autoComplete="off" disabled={status==='sending'||status==='sent'}/><button type="submit" disabled={!book.trim()||status==='sending'||status==='sent'}>{status==='sending'?'Sending…':status==='sent'?'Sent ✓':'Send →'}</button></div>{status==='error'&&<span className="bookRecStatus" role="status">Couldn’t send that one. Try again.</span>}{status==='sent'&&<span className="bookRecThanks" role="status"><span className="bookFlip" aria-hidden="true"><i/><i/></span>Thanks! Added to my list.</span>}</form>
}

function Home({openCase}){
 const [auraTone,setAuraTone]=useState('default');
 // Phone nav: every link lives in a sheet behind a menu button.
 const [navOpen,setNavOpen]=useState(false);
 const navRef=useRef(null);const [activeSection,setActiveSection]=useState('');const [navInd,setNavInd]=useState<React.CSSProperties>({opacity:0});
 useEffect(()=>{const ids=['projects','experience','fun'];const onScroll=()=>{const y=window.innerHeight*.35;let cur='';for(const id of ids){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<y)cur=id}const about=document.getElementById('about');if(about&&about.getBoundingClientRect().top<y)cur='';setActiveSection(cur)};onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);
 useEffect(()=>{const nav=navRef.current;if(!nav)return;const a=activeSection&&nav.querySelector(`a[href="#${activeSection}"]`);if(!a){setNavInd(v=>({...v,opacity:0}));return}setNavInd({opacity:1,width:`${a.offsetWidth}px`,transform:`translateX(${a.offsetLeft}px)`})},[activeSection]);
 useEffect(()=>{if(!navOpen)return;const k=e=>{if(e.key==='Escape')setNavOpen(false)};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[navOpen]);
 const [heroPointerActive,setHeroPointerActive]=useState(false);
 const [filmOpen,setFilmOpen]=useState(false);
 const [filmIndex,setFilmIndex]=useState(0);
 const serious=['fcvf','accenture','finsimple','kohler','marketExpansion','estee'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 const fun=['commute','bookclub','scheduler','chat'].map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 const moveHeroAura=e=>{
   if(e.pointerType==='touch')return;
   const rect=e.currentTarget.getBoundingClientRect();
   e.currentTarget.style.setProperty('--hero-mouse-x',`${e.clientX-rect.left}px`);
   e.currentTarget.style.setProperty('--hero-mouse-y',`${e.clientY-rect.top}px`);
 };
 return <>
 <header className={`siteHeader${navOpen?' navIsOpen':''}`}><a className="wordmark" href="#top">Neha Chinimilli</a><button type="button" className="navToggle" aria-expanded={navOpen} aria-controls="primaryNav" aria-label={navOpen?'Close menu':'Open menu'} onClick={()=>setNavOpen(o=>!o)}><span/><span/></button><nav id="primaryNav" ref={navRef} aria-label="Primary" onClick={e=>{if((e.target as HTMLElement).closest('a'))setNavOpen(false)}}><i className="navIndicator" aria-hidden="true" style={navInd}/><a href="#projects" className={activeSection==='projects'?'isActive':''}>Selected work</a><a href="#experience" className={activeSection==='experience'?'isActive':''}>Experience</a><a href="#fun" className={activeSection==='fun'?'isActive':''}>Fun things I’ve built</a><a href="Neha_Chinimilli_Resume.pdf" target="_blank" rel="noreferrer">Resume</a><a href="mailto:chinimi2@msu.edu">Email</a><a className="headerLinkedIn" href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer" aria-label="Neha Chinimilli on LinkedIn"><img src={assetUrl('linkedin.svg')} alt="LinkedIn"/></a></nav></header>
 <main id="main-content" className={`homePage homeAura-${auraTone}`}>
  <AuraField tone={auraTone}/>
  <section id="top" className={`hero v28Hero ${heroPointerActive?'heroPointerActive':''}`} onPointerMove={moveHeroAura} onPointerEnter={e=>{if(e.pointerType!=='touch')setHeroPointerActive(true)}} onPointerLeave={()=>setHeroPointerActive(false)}><div className="heroMouseAura" aria-hidden="true"/><figure className="heroPortrait"><span className="heroPortraitGlow" aria-hidden="true"><i/><i/><i/></span><span className="heroPortraitFrame"><img src={assetUrl('headshot.jpg')} alt="Neha Chinimilli"/></span></figure><div className="heroInner"><h1>Neha Chinimilli</h1><p className="heroThesis">Dual degree in Computer Science and Supply Chain Management · Michigan State</p><p className="heroTagline">Product-minded technical builder who turns customer and operating problems into shipped solutions at Ford, Ford Credit, and Accenture.</p><div className="heroLinks"><a className="primaryHeroLink" href="#projects">View selected work ↓</a><a href="#about">Learn more about me ↓</a><a href="Neha_Chinimilli_Resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div></div></section>
  <CompanyBanner/>
  <section id="projects" className="section projectsSection v28Projects"><div className="sectionTitle compactTitle"><h2>Selected work</h2></div><div className="balancedProjectGrid">{serious.map((p,i)=><ProjectCard project={p} index={i} key={p.id} featured={i===0} onOpen={openCase}/>)}</div></section>
  <ExperienceSection onAura={setAuraTone} onOpen={openCase}/><EducationSection/>
  <section id="fun" className="section moreSection v28Fun">
    <div className="sectionTitle compactTitle">
      <h2>Fun things I’ve built</h2>
      </div>
      <div className="funBuildGrid">{fun.map(p=><MoreProjectCard key={p.id} project={p} onOpen={openCase}/>)}
        <article className="smallBuild">
          <div className="techVisual game">
            <div className="spartanScene">
              <img className="spartanBg" src="project-media/spartan-background.png" alt="Spartan Touchdown level" width={2048} height={1024} loading="lazy" decoding="async"/>
              <div className="spartanGround"></div>
              <img className="spartySprite" src="project-media/sparty.png" alt="Sparty" loading="lazy" decoding="async"/>
              <img className="enemySprite" src="project-media/um-enemy.png" alt="Michigan enemy" loading="lazy" decoding="async"/>
              </div>
              </div>
              <div className="moreBuildCopy"><span>MSU · CSE 335</span><h3>Spartan Touchdown</h3>
              <p>A C++ team game with player movement, collisions, enemies, scoring, and a shared level state.</p></div>
              </article><article className="smallBuild">
                <div className="techVisual fluids">
                  <img src="project-media/stable-fluids.png" alt="Stable Fluids simulation" width={1025} height={665} loading="lazy" decoding="async"/>
                  </div>
                  <div className="moreBuildCopy"><span>MSU · CSE 476</span><h3>Stable Fluids</h3>
                  <p>Interactive 2D fluid simulation in C++ using the Stam method, with live emitters and obstacles.</p></div>
                  </article>
                  </div>
                  </section>
  <section id="about" className="section aboutSection">
    <div className="aboutPhoto"><AboutFilmCamera photos={aboutFilmPhotos} open={filmOpen} index={filmIndex} onClose={()=>setFilmOpen(false)} onChange={setFilmIndex}/></div><div className="aboutCopy"><h2>About me</h2><p>I’m Neha, finishing <strong>two degrees at Michigan State in Computer Science and Supply Chain Management</strong>. I’m drawn to work where I can understand why a system is hard to use, decide what should change, and help ship a better version. I’m a <span className="creativeWord" tabIndex={0} aria-label="creative">{"creative".split("").map((c,i)=><span key={i} aria-hidden="true" style={{"--i":i} as React.CSSProperties}>{c}</span>)}<svg className="creativeLine" viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden="true"><path d="M3 9 C 18 3, 30 13, 46 7 S 74 3, 88 8 S 108 12, 117 5"/></svg><svg className="creativeWash" viewBox="-130 -70 260 140" aria-hidden="true">
 <defs>
  <filter id="wcBleed" x="-30%" y="-30%" width="160%" height="160%">
   <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7" result="n"/>
   <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" result="d"/>
   <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="grain"/>
   <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.9 1.05" result="g"/>
   <feComposite in="d" in2="g" operator="in" result="grained"/>
   <feGaussianBlur in="grained" stdDeviation=".6"/>
  </filter>
  {[['wcRose','#f3a0b8','#d9587e'],['wcPeach','#fbc79a','#e8844f'],['wcGold','#fbd98f','#e0a13a'],['wcCoral','#f7a58f','#d9604f']].map(([id,a,e])=><radialGradient key={id} id={id}><stop offset="0" stopColor={a} stopOpacity=".28"/><stop offset=".62" stopColor={a} stopOpacity=".5"/><stop offset=".86" stopColor={e} stopOpacity=".72"/><stop offset=".95" stopColor={e} stopOpacity=".9"/><stop offset="1" stopColor={e} stopOpacity="0"/></radialGradient>)}
 </defs>
 <g filter="url(#wcBleed)">
  {[[-70,-8,34,'wcRose'],[-22,-30,28,'wcPeach'],[34,-22,32,'wcCoral'],[78,6,26,'wcGold'],[-40,26,24,'wcPeach'],[22,30,27,'wcRose'],[-98,14,15,'wcCoral'],[100,-28,13,'wcRose']].map(([x,y,r,f],i)=><circle key={i} className="wcPool" cx={x} cy={y} r={r} fill={`url(#${f})`} style={{"--k":i} as React.CSSProperties}/>)}
  {[[-112,-34,2.6,'#d9587e'],[-86,-48,1.6,'#e8844f'],[112,32,2.2,'#d9604f'],[92,48,1.4,'#e0a13a'],[-60,50,1.8,'#d9587e'],[58,-50,2,'#e8844f'],[124,-6,1.3,'#d9587e'],[-124,40,1.2,'#e0a13a']].map(([x,y,r,c],i)=><circle key={'d'+i} className="wcDrop" cx={x} cy={y} r={r} fill={c as string} style={{"--k":i} as React.CSSProperties}/>)}
 </g>
</svg></span> at heart, so I care about how a product feels, not only whether it works. I’ve built customer-facing software at Ford and Ford Credit and worked on product and business problems at Accenture and Spectrum. That mix is why I’m pursuing product management.</p><p className="hobbyLine">Outside of work, I’m usually trying a new coffee shop<span className="coffeeCup" aria-hidden="true"><svg viewBox="0 0 24 24"><path className="steam s1" d="M9.5 8.5c-1.3-1.2 1.3-2.3 0-3.6s0-2.4 0-2.4"/><path className="steam s2" d="M13 8.5c-1.3-1.2 1.3-2.3 0-3.6s0-2.4 0-2.4"/><path className="cupLine" d="M5 11h13v3.5A5.5 5.5 0 0 1 12.5 20h-2A5.5 5.5 0 0 1 5 14.5z"/><path className="cupLine" d="M18 12.2h.9a2.2 2.2 0 0 1 0 4.4h-1.3"/><path className="cupLine" d="M4 22h15"/></svg></span>, traveling, <HobbyPopover variant="shelf" label="reading" title="On my shelf" items={["A Thousand Splendid Suns","When Breath Becomes Air","The Year of Magical Thinking","Sharp Objects"]}/>, keeping up with <HobbyPopover variant="tv" label="reality TV" title="Always on rotation" items={["Modern Family","Vanderpump Rules","Summer House","the newest Real Housewives season"]}/>, baking, hiking, painting, or taking <span className="filmPhotoTriggerWrap"><button type="button" className="filmPhotoTrigger" onClick={()=>{setFilmOpen(true);setFilmIndex(0)}} aria-expanded={filmOpen}>film photos</button><span className="filmPhotoHint" role="tooltip">click to see my photos</span></span>.</p><div className="aboutActions"><BookRecForm/></div></div></section>
 </main><footer className="siteFooter"><span>© 2026 Neha Chinimilli</span><nav aria-label="Footer"><a href="mailto:chinimi2@msu.edu">Email</a><a className="linkedinLink" href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer" aria-label="Visit Neha Chinimilli on LinkedIn (opens in a new tab)"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3ZM8.25 18.25H5.75v-8h2.5v8ZM7 9.15a1.45 1.45 0 1 1 0-2.9 1.45 1.45 0 0 1 0 2.9Zm11.25 9.1h-2.5v-3.9c0-.93-.02-2.12-1.29-2.12-1.3 0-1.5 1.01-1.5 2.05v3.97h-2.5v-8h2.4v1.09h.04c.33-.64 1.15-1.32 2.37-1.32 2.54 0 3.01 1.67 3.01 3.84v4.39Z"/></svg><span>LinkedIn</span><span aria-hidden="true">↗</span></a><a href="Neha_Chinimilli_Resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></nav></footer>
 </>
}

function ScrollToTopButton(){
 const [visible,setVisible]=useState(false);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{const update=()=>{setVisible(window.scrollY>520);const max=document.documentElement.scrollHeight-window.innerHeight;setProgress(max>0?Math.min(1,window.scrollY/max):0)};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[]);
 return <button type="button" className={`scrollTopButton ${visible?'visible':''}`} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top" title="Back to top"><svg className="scrollRing" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" className="scrollRingTrack"/><circle cx="24" cy="24" r="22" className="scrollRingFill" style={{strokeDashoffset:138.2*(1-progress)}}/></svg><span aria-hidden="true">↑</span></button>
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

// Easter eggs: a hello for anyone who opens dev tools, and a tab title that
// calls you back when you wander off (per case, restored on return).
console.log('%cHi 👋','font:700 28px system-ui;color:#7b4bd1');
console.log("%cIf you're reading the console, you're the kind of person I want to work with.\nnchinimilli5@gmail.com",'font:15px/1.5 system-ui;color:#444');
const AWAY_TITLES:Record<string,string>={commute:'⏰ your alarm is going off',bookclub:'📚 come back, the book club is waiting',scheduler:'📅 still free at 2?',chat:'💬 typing…',fcvf:'🏁 the Mustang is idling',finsimple:'🧾 your estimate is ready',estee:'💄 touch-up time',kohler:'🚿 still shipping anywhere',accenture:'🚋 one request still in the queue',marketExpansion:'🧀 the cheese is getting warm'};
let homeTitle=document.title;
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){homeTitle=document.title;const id=location.hash.match(/^#\/projects\/([^/?#]+)/)?.[1];document.title=(id&&AWAY_TITLES[id])||'👀 come back, there’s more'}
 else document.title=homeTitle;
});

createRoot(document.getElementById('root')).render(<App/>);
