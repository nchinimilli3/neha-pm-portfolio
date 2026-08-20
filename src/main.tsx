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
  fcvf: [
    ['4','user interviews'],
    ['2','interface directions compared']
  ],
  finsimple: [
    ['30%','ahead of schedule · broader internship'],
    ['5','cross-functional teams · broader internship']
  ],
  estee: [
    ['Top 5','challenge finalist']
  ]
};

const ownership = {
  fcvf:'User interviews · design evaluation · frontend implementation · testing',
  finsimple:'Requirements · AEM components · API integration · testing · stakeholder coordination',
  scheduler:'Product design · full-stack implementation · real-time interactions · deployment',
  chat:'Socket.IO event handling · synchronized state · interaction design · frontend implementation',
  estee:'Product concept · UX/UI design · frontend development'
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
    summary:'Replaced an Excel-based customer-value assessment with a web application shaped by user interviews and design testing.',
    media:'fcvf',
    facts:['4 user interviews','Live score removed after research']
  },
  {
    id:'finsimple',
    title:'FinSimple',
    company:'Ford Credit',
    summary:'Shipped customer-facing feature work inside an existing financial platform across UI, APIs, Salesforce, testing, and stakeholder coordination.',
    media:'finsimple',
    facts:['End-to-end feature work','30% ahead · broader internship']
  },
  {
    id:'scheduler',
    title:'Collaborative Scheduling Platform',
    company:'CSE 477',
    summary:'Extended a When2Meet-style scheduler with tentative availability, faster entry, best-time calculation, venue voting, and event coordination.',
    media:'scheduler',
    facts:['Interactive sandbox','Flask · Socket.IO · MySQL']
  },
  {
    id:'chat',
    title:'Synchronized Group Chat',
    company:'CSE 477',
    summary:'Built a multi-user chat with synchronized messages, presence, typing state, and reactions using a familiar iMessage-style interface.',
    media:'chat',
    facts:['Real-time rooms + presence','Socket.IO']
  },
  {
    id:'estee',
    title:'Estée Lauder — Double Wear',
    company:'Estée Lauder × Kode With Klossy',
    summary:'Designed a branded product-discovery experience connecting education, shade exploration, and purchase.',
    media:'estee',
    facts:['Top 5 finalist']
  }
];

function MetricStrip({items}) {
  return <div className="metricStrip">{items.map(([v,l])=><div className="metric" key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
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
    <div className="previewTabs"><span>Group availability</span><strong>Best time · Tue 10:30</strong></div>
    <div className="previewCalendarHead"><span></span>{days.map(d=><span key={d}>{d}</span>)}</div>
    <div className="previewCalendar">{times.slice(0,5).map((t,r)=><React.Fragment key={t}><span>{t}</span>{days.map((d,c)=><i key={d} className={`overlap overlap-${overlap[r*5+c]}`}/>)}</React.Fragment>)}</div>
    <div className="previewLegend"><span><i className="legendLow"/>Fewer available</span><span><i className="legendHigh"/>Best overlap</span></div>
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

function EsteeVisual(){return <div className="esteeGrid"><img loading="lazy" decoding="async" src="project-media/el-home.webp" alt="Estée Lauder Double Wear landing experience"/><img loading="lazy" decoding="async" src="project-media/el-benefits.webp" alt="Double Wear product benefits"/><img loading="lazy" decoding="async" src="project-media/el-shades.webp" alt="Double Wear shade exploration"/><img loading="lazy" decoding="async" src="project-media/el-shop.webp" alt="Double Wear purchase options"/></div>}

function ProjectCover({type}){
  if(type==='fcvf') return <div className="editorialCover fordEditorial autoCover photoCover"><img loading="eager" fetchPriority="high" decoding="async" className="autoPhoto" src="https://images.unsplash.com/photo-1568068158767-9463ba730cf6?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=82&w=1800" alt="Black Ford vehicle photographed by ot design on Unsplash"/><div className="photoShade"/><img loading="lazy" decoding="async" className="editorialLogo" src="company-logos/ford.png" alt="Ford"/><div className="autoCopy"><span>Ford Motor Company</span><strong>Customer Value Framework</strong></div><span className="photoCredit">Photo: ot design · Unsplash</span></div>;
  if(type==='finsimple') return <div className="editorialCover finEditorial autoCover photoCover"><img loading="lazy" decoding="async" className="autoPhoto" src="https://images.unsplash.com/photo-1579272154060-4e7a4d0f5033?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=82&w=1800" alt="Black Ford Fiesta ST photographed by Obi on Unsplash"/><div className="photoShade creditShade"/><img loading="lazy" decoding="async" className="editorialLogo credit" src="company-logos/ford-credit.jpg" alt="Ford Credit"/><div className="financeOverlay"><span>Customer financing</span><strong>Existing product · enterprise systems</strong></div><span className="photoCredit">Photo: Obi · Unsplash</span></div>;
  if(type==='scheduler') return <div className="editorialCover schedulerEditorial"><SchedulerPreview/></div>;
  if(type==='chat') return <div className="editorialCover chatEditorial"><MiniChat/></div>;
  return <div className="editorialCover esteeEditorial"><img loading="lazy" decoding="async" src="project-media/el-home.webp" alt="Estée Lauder Double Wear digital experience"/><div className="esteeStack"><img loading="lazy" decoding="async" src="project-media/el-benefits.webp" alt="Double Wear product benefits"/><img loading="lazy" decoding="async" src="project-media/el-shades.webp" alt="Double Wear shade exploration"/></div></div>;
}

function ProjectCard({project,index,onOpen,onAura}){
  const featured=project.id==='scheduler';
  return <Reveal className={featured?'projectCardReveal featured':''}>
    <article className={`projectCard ${featured?'featured':''}`} role="link" tabIndex={0} aria-label={`Open ${project.title} case study`} onMouseEnter={()=>onAura?.(project.id)} onMouseLeave={()=>onAura?.('default')} onFocus={()=>onAura?.(project.id)} onBlur={()=>onAura?.('default')} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onOpen(project.id)}}} onClick={()=>onOpen(project.id)}>
      <div className="projectCardMedia"><ProjectCover type={project.media}/></div>
      <div className="projectCardBody">
        <div className="projectCardTop"><span>{project.company}</span></div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="projectFacts">{project.facts?.map(f=><span key={f}>{f}</span>)}</div>
        <button type="button" onClick={(e)=>{e.stopPropagation();onOpen(project.id)}}>View case study <span>↗</span></button>
      </div>
    </article>
  </Reveal>
}

function ProjectVisual({type}){
  if(type==='fcvf') return <FCVFVisual/>;
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
 return <main className="casePage"><button className="backBtn" onClick={onBack}>← Projects</button><header className="caseHeader"><p>{p.company}</p><h1>{p.title}</h1><div className="caseIntro">{p.summary}</div><div className="ownershipLine"><strong>My work</strong><span>{ownership[id]}</span></div>{metrics[id]&&<MetricStrip items={metrics[id]}/>}</header><section className="caseHeroMedia evidenceFirst"><ProjectVisual type={p.media}/></section>
 {id==='fcvf'&&<><CaseSection title="Context"><p>FCVF was created to give product teams a more consistent, data-driven way to evaluate customer value. The existing assessment lived in Excel, which was long to complete, difficult to navigate, and exposed underlying formulas.</p></CaseSection><CaseSection title="Research changed the product"><div className="researchDecision"><div><span>During interviews</span><strong>Users saw every question at once and could watch the live score change as they answered.</strong></div><b>→</b><div><span>What we found</span><strong>The score could influence later answers, creating response bias.</strong></div><b>→</b><div><span>Design change</span><strong>Use a multi-page flow and remove the live score while the assessment is in progress.</strong></div></div></CaseSection><CaseSection title="My role"><p>I worked across four user interviews, design comparison, requirements discussions, frontend implementation, testing, and product-owner conversations.</p></CaseSection><CaseSection title="Final experience"><div className="finalArtifact"><img loading="lazy" decoding="async" src="project-media/ford-after.webp" alt="Final Ford Customer Value Framework web experience"/><p>The final web experience used a multi-page flow and kept the live score out of the in-progress assessment.</p></div></CaseSection></>}
 {id==='finsimple'&&<><CaseSection title="Context"><p>My second Ford internship moved from a greenfield intern-built application to FinSimple, a deployed financial product with existing customers, shared libraries, data dependencies, and production environments.</p></CaseSection><CaseSection title="Previous Estimates"><p>I owned work across requirements, UI/component development, integration, testing, and stakeholder coordination. The Previous Estimates experience progressed from dummy data to an AEM component and then into the finished customer-facing flow.</p><div className="progression"><img loading="lazy" decoding="async" src="project-media/finsimple-dummy.png" alt="Dummy data stage"/><img loading="lazy" decoding="async" src="project-media/finsimple-aem.png" alt="AEM component stage"/><img loading="lazy" decoding="async" src="project-media/finsimple-live.png" alt="Finished FinSimple stage"/></div></CaseSection><CaseSection title="Customer journey"><div className="journeyFlow"><div><strong>Customer</strong><span>Starts a financing/account workflow</span></div><b>→</b><div><strong>Web experience</strong><span>Collects and displays the needed information</span></div><b>→</b><div><strong>Service + API layer</strong><span>Moves existing customer and contract data</span></div><b>→</b><div><strong>Salesforce</strong><span>Creates/populates the downstream record</span></div></div></CaseSection><CaseSection title="System around the UI"><p>A small interface change could depend on record creation, field population, PDF attachments, API behavior, and failure handling across AEM, GraphQL/APIs, Salesforce, and GCP.</p></CaseSection><CaseSection title="Broader internship outcomes"><p>The delivery metrics above describe my broader internship work, not only Previous Estimates. Across that work, I managed 20+ tasks across five teams and contributed to delivery that finished 30% ahead of schedule.</p></CaseSection><CaseSection title="Shipped result"><div className="finalArtifact"><img loading="lazy" decoding="async" src="project-media/finsimple-live.png" alt="Finished FinSimple Previous Estimates feature"/><p>Previous Estimates moved from dummy data to an AEM implementation and into the customer-facing FinSimple experience.</p></div></CaseSection></>}
 {id==='scheduler'&&<><section className="productDelta"><div><span>Kept from When2Meet</span><strong>Fast grid input + shared heatmap</strong></div><b>→</b><div><span>Extended around it</span><strong>Nuance, faster entry, recommendation, venues, notes, chat, sharing + calendar handoff</strong></div></section><section className="sandboxSection schedulerShowcase"><SchedulerSandbox/></section><CaseSection title="When2Meet baseline"><p>I kept the grid-based availability input and shared heatmap because they already make group overlap easy to understand.</p></CaseSection><CaseSection title="Added to the workflow"><div className="factGrid"><Fact title="Availability is not always binary">Real schedules include “maybe,” not just free or unavailable.</Fact><Fact title="Entering time is repetitive">Quick-fill presets reduce the work of marking predictable blocks.</Fact><Fact title="A heatmap still needs interpretation">Best Time to Meet turns overlap into a recommendation instead of leaving the group to compare every cell manually.</Fact><Fact title="Scheduling does not end with a time">Venue voting, participant status, notes, chat, sharing, and calendar export keep the rest of the coordination in one flow.</Fact></div></CaseSection><CaseSection title="What changed"><div className="architecture"><span>Available / Maybe / Unavailable</span><b>→</b><span>Quick fill</span><b>→</b><span>Group heatmap</span><b>→</b><span>Best time</span><b>→</b><span>Venue + chat</span></div></CaseSection><CaseSection title="Architecture"><div className="architecture"><span>Browser</span><b>↔</b><span>Socket.IO</span><b>↔</b><span>Flask</span><b>↔</b><span>MySQL</span></div><p>Docker and Google Cloud Run were used for deployment. This portfolio sandbox preserves the product behavior with local browser state so it can run on GitHub Pages without the original backend.</p></CaseSection><CaseSection title="Finished system"><p>The original application ran with Flask, Socket.IO, MySQL, Docker, and Google Cloud Run. The portfolio sandbox recreates the core product behavior in-browser so it can be tested directly.</p></CaseSection></>}
 {id==='chat'&&<><section className="sandboxSection"><ChatSandbox/></section><CaseSection title="Interaction model"><p>The interface follows iMessage conventions: the current user’s messages appear blue and right-aligned, other users’ messages appear gray and left-aligned, and room events are shown as system messages.</p></CaseSection><CaseSection title="Real-time behavior"><div className="factGrid"><Fact title="Messages">Clients receive new messages through Socket.IO.</Fact><Fact title="Presence">Join and leave events are broadcast to the room.</Fact><Fact title="Typing">Typing state is emitted while another user is composing a message.</Fact><Fact title="Tapbacks">Messages support reactions including heart, thumbs-up, laughter, exclamation, and question reactions.</Fact></div></CaseSection><CaseSection title="Finished system"><p>The working chat synchronized messages and room events across connected users while keeping the interface intentionally familiar.</p></CaseSection></>}
 {id==='estee'&&<><CaseSection title="Brief"><p>The goal was to keep the experience recognizably Estée Lauder while adding promotional elements, explaining why customers should buy Double Wear, and making purchase options easy to reach.</p></CaseSection><CaseSection title="Design approach"><div className="factGrid"><Fact title="Brand consistency">Matched Estée Lauder’s colors, typography, and visual style.</Fact><Fact title="Product education">Used concise benefits, visuals, and interactive elements to make the product easier to understand.</Fact><Fact title="Purchase path">Linked customers to multiple reputable retailers after product exploration.</Fact><Fact title="Customer journey">Structured the experience around discover → learn → explore → buy.</Fact></div></CaseSection><CaseSection title="Final screens"><EsteeVisual/></CaseSection></>}
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

function CompanyLogo({src='',alt='',label=''}){return <div className="companyLogo">{src?<img loading="lazy" decoding="async" src={src} alt={alt}/>:<strong className="logoText">{label}</strong>}</div>}
function Home({openCase}){
 const [auraTone,setAuraTone]=useState('default');
 return <>
 <AuraField tone={auraTone}/>
 <header className="siteHeader"><a className="wordmark" href="#top">Neha Chinimilli</a><nav aria-label="Primary"><div className="navProjects"><a href="#projects">Projects</a><div className="navMenu"><button onClick={()=>openCase('fcvf')}>Customer Value Framework</button><button onClick={()=>openCase('scheduler')}>Collaborative Scheduler</button><button onClick={()=>openCase('finsimple')}>FinSimple</button><a href="#technical">Technical work</a></div></div><a href="#experience">Experience</a><a href="#technical">Technical work</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume</a><a href="mailto:chinimi2@msu.edu">Email</a></nav></header>
 <main id="top">
  <section className="hero"><div className="heroInner"><h1>Neha Chinimilli</h1><p>Computer Science + Supply Chain Management at Michigan State University.</p><div className="heroLinks"><a href="#projects">Projects</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div></div></section>
  <section id="projects" className="section projectsSection"><div className="sectionTitle compactTitle"><h2>Projects</h2></div><div className="projectCardGrid">{projects.map((p,i)=><ProjectCard project={p} index={i} key={p.id} onOpen={openCase} onAura={setAuraTone}/>)}</div></section>
  <section id="experience" className="section experienceSection"><div className="sectionTitle compactTitle"><h2>Experience</h2></div><div className="experienceCards"><Reveal className="experienceFeatured"><article className="experienceCard featuredExperience"><CompanyLogo src="company-logos/accenture.svg" alt="Accenture"/><div><div className="experienceMeta"><span>2026 · San Francisco</span></div><h3>Accenture</h3><h4>Technology Summer Analyst</h4><p>Structured an enterprise AI enablement workflow, translated manual judgment into automation requirements, synthesized customer evidence, and prototyped an enablement experience for a frontier AI lab account.</p><div className="experienceEvidence"><span><strong>~2,200</strong> learner responses</span><span><strong>10-tab</strong> automation data contract</span><span><strong>Prototype</strong> tested + demonstrated</span></div></div></article></Reveal><Reveal><article className="experienceCard"><CompanyLogo src="company-logos/ford-credit.jpg" alt="Ford Credit"/><div><div className="experienceMeta"><span>2024–2025 · Dearborn</span></div><h3>Ford Credit</h3><h4>Software Engineering Intern · 2 summers</h4><p>Shipped customer-facing financial-product work across requirements, UI, APIs, Salesforce, testing, releases, and production reliability.</p></div></article></Reveal><Reveal><article className="experienceCard"><CompanyLogo src="company-logos/ford.png" alt="Ford Motor Company"/><div><div className="experienceMeta"><span>2023 · Dearborn</span></div><h3>Ford Motor Company</h3><h4>Software Engineering Intern</h4><p>Built a customer-value web application from MVP through full-stack implementation and used four user interviews to change the design.</p></div></article></Reveal><Reveal><article className="experienceCard"><CompanyLogo label="SCG" alt="Spectrum Consulting Group"/><div><div className="experienceMeta"><span>2022–2026 · East Lansing</span></div><h3>Spectrum Consulting Group</h3><h4>Consultant · Client Acquisition Lead</h4><p>Built research, KPI, and decision frameworks for client work spanning performance measurement, growth strategy, and product commercialization.</p></div></article></Reveal></div></section>
  <section id="technical" className="section technicalSection">
    <div className="sectionTitle compactTitle"><h2>Technical work</h2></div>
    <div className="techGrid">
      <TechnicalCard title="Spartan Touchdown" subtitle="CSE 335 · C++ · wxWidgets · team development" kind="game" description="Team-built C++ football game with XML-defined levels, reusable game objects, collision systems, tests, and Kanban delivery."/>
      <TechnicalCard title="2D Stable Fluids" subtitle="CSE 472 · C++ · simulation" kind="fluids" description="Interactive C++ simulation with advection, buoyancy, sparse-matrix diffusion, and adjustable fluid behavior."/>
      <TechnicalCard title="Ray Tracer" subtitle="CSE 472 · C++ · computer graphics" kind="ray" description="C++ renderer implementing intersections, materials, texture mapping, lighting, shadows, and reflections."/>
    </div>
  </section>
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
