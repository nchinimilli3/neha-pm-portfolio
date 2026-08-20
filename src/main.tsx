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
  estee:'I worked on the product concept, UX/UI, and frontend development.'
};


function AuraField({tone='default'}){
  const field=useRef(null);
  useEffect(()=>{
    const move=(e)=>{
      const x=(e.clientX/window.innerWidth-.5);
      const y=(e.clientY/window.innerHeight-.5);
      field.current?.style.setProperty('--mx',`${x*22}px`);
      field.current?.style.setProperty('--my',`${y*18}px`);
    };
    window.addEventListener('pointermove',move,{passive:true});
    return ()=>window.removeEventListener('pointermove',move);
  },[]);
  return <div ref={field} className={`auraField tone-${tone}`} aria-hidden="true">
    <span className="auraBloom bloom1"/>
    <span className="auraBloom bloom2"/>
    <span className="auraBloom bloom3"/>
    <span className="auraBloom bloom4"/>
    <span className="auraBloom bloom5"/>
    <span className="auraBloom bloom6"/>
    <span className="auraBloom bloom7"/>
  </div>
}

const projects = [
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
    title:'Enterprise AI Enablement',
    company:'Accenture · frontier AI lab account',
    summary:'Structured a manual enablement workflow, translated judgment into automation requirements, synthesized customer evidence, and tested an early prototype.',
    media:'accenture',
    facts:['~2,200 learner responses','10-tab automation data contract']
  },
  {
    id:'scheduler',
    title:'Collaborative Scheduling Platform',
    company:'CSE 477',
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
    company:'CSE 477',
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
    <div className="workflowTitle"><span>Enterprise AI enablement</span><strong>Turning manual assignment into testable logic</strong></div>
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

function ProjectCover({type}){
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
        <div className="projectFacts">{project.facts?.map((f,i)=><span className={project.id==='fcvf'&&i===1?'factEmphasis':''} key={f}>{f}</span>)}</div>
        <button type="button" onClick={(e)=>{e.stopPropagation();onOpen(project.id)}}>View case study <span>↗</span></button>
      </div>
    </article>
  </Reveal>
}

function ProjectVisual({type}){
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
 return <main className="casePage"><button className="backBtn" onClick={onBack}>← Back</button><header className="caseHeader"><p>{p.company}</p><h1>{p.title}</h1><div className="caseIntro">{p.summary}</div><div className="ownershipLine"><span>{ownership[id]}</span></div>{metrics[id]&&<MetricStrip items={metrics[id]}/>}</header><section className="caseHeroMedia evidenceFirst"><ProjectVisual type={p.media}/></section>
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
function Home({openCase}){
 const [auraTone,setAuraTone]=useState('default');
 const featured=projects.filter(p=>['fcvf','accenture','scheduler'].includes(p.id));
 const more=projects.filter(p=>['finsimple','chat','estee'].includes(p.id));
 return <>
 <a className="skipLink" href="#main-content">Skip to content</a>
 <AuraField tone={auraTone}/>
 <header className="siteHeader"><a className="wordmark" href="#top">Neha Chinimilli</a><nav aria-label="Primary"><a href="#featured">Work</a><a href="#experience">Experience</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume</a><a href="mailto:chinimi2@msu.edu">Email</a></nav></header>
 <main id="main-content">
  <section id="top" className="hero"><div className="heroInner"><h1>Neha Chinimilli</h1><p className="heroThesis">Computer Science + Supply Chain Management at Michigan State University</p><div className="heroLinks"><a className="primaryHeroLink" href="#featured">View work ↓</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div></div></section>
  <section id="featured" className="section projectsSection"><div className="sectionTitle compactTitle"><h2>Selected work</h2></div><div className="flagshipEditorial"><div className="flagshipLead"><ProjectCard project={featured[0]} index={0} featured={true} onOpen={openCase} onAura={setAuraTone}/></div><div className="flagshipPair">{featured.slice(1).map((p,i)=><ProjectCard project={p} index={i+1} key={p.id} featured={true} onOpen={openCase} onAura={setAuraTone}/>)}</div></div></section>
  <section id="more" className="section moreSection"><div className="sectionTitle compactTitle"><h2>More things I’ve built</h2></div><div className="moreBuildGrid visualGallery">{more.map(p=><MoreProjectCard key={p.id} project={p} onOpen={openCase}/>)}<article className="moreBuildCard static galleryWide"><div className="moreBuildVisual"><div className="techVisual game"><div className="spartanScene"><img loading="lazy" decoding="async" className="spartanBg" src="project-media/spartan-background.png" alt="Spartan Touchdown level artwork"/><div className="spartanGround"></div><img loading="lazy" decoding="async" className="spartySprite" src="project-media/sparty.png" alt="Sparty power-up from Spartan Touchdown"/><img loading="lazy" decoding="async" className="coinSprite coinOne" src="project-media/coin100.png" alt="100 point coin"/><img loading="lazy" decoding="async" className="enemySprite" src="project-media/um-enemy.png" alt="Michigan enemy from Spartan Touchdown"/><img loading="lazy" decoding="async" className="goalSprite" src="project-media/goalpost.png" alt="Goalpost from Spartan Touchdown"/></div></div></div><div className="moreBuildCopy"><span>CSE 335 · C++ · wxWidgets</span><h3>Spartan Touchdown</h3><p>Team-built C++ football game.</p></div></article><article className="moreBuildCard static galleryTall"><div className="moreBuildVisual"><div className="techVisual fluids"><img loading="lazy" decoding="async" src="project-media/stable-fluids.png" alt="2D Stable Fluids simulation"/></div></div><div className="moreBuildCopy"><span>CSE 472 · C++</span><h3>2D Stable Fluids</h3><p>Interactive C++ fluid simulation.</p></div></article><article className="moreBuildCard static"><div className="moreBuildVisual"><div className="techVisual ray"><div className="rayDiagram"><span>camera ray</span><i></i><span>intersection</span><i></i><span>lighting + reflection</span></div></div></div><div className="moreBuildCopy"><span>CSE 472 · C++</span><h3>Ray Tracer</h3><p>C++ renderer with lighting, shadows, textures, and reflections.</p></div></article></div></section>
  <section id="experience" className="section experienceSection"><div className="sectionTitle compactTitle"><h2>Experience</h2></div><div className="experienceTimeline"><Reveal><article className="timelineRow"><CompanyLogo src="company-logos/accenture.svg" alt="Accenture"/><div className="timelineMain"><h3>Accenture</h3><h4>Technology Summer Analyst</h4><p>Frontier AI lab account · enablement workflows, automation requirements, evidence synthesis, and prototyping.</p><button className="inlineCaseLink" onClick={()=>openCase('accenture')}>View case study →</button></div><time>2026</time></article></Reveal><Reveal><article className="timelineRow"><CompanyLogo src="company-logos/ford-credit.jpg" alt="Ford Credit"/><div className="timelineMain"><h3>Ford Credit</h3><h4>Software Engineering Intern · 2 summers</h4><p>Customer financial products · APIs · Salesforce · releases and production systems.</p></div><time>2024–25</time></article></Reveal><Reveal><article className="timelineRow"><CompanyLogo src="company-logos/ford.png" alt="Ford Motor Company"/><div className="timelineMain"><h3>Ford Motor Company</h3><h4>Software Engineering Intern</h4><p>Customer Value Framework · user interviews · full-stack implementation.</p></div><time>2023</time></article></Reveal><Reveal><article className="timelineRow"><CompanyLogo label="SCG" alt="Spectrum Consulting Group"/><div className="timelineMain"><h3>Spectrum Consulting Group</h3><h4>Consultant · Client Acquisition Lead</h4><p>KPI systems · growth strategy · product commercialization.</p></div><time>2022–26</time></article></Reveal></div></section>
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
