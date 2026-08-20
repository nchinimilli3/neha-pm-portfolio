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
    ['2','interface directions compared'],
    ['3','customer-value scores in the framework'],
    ['1','MVP delivered before full build']
  ],
  finsimple: [
    ['30%','ahead of schedule'],
    ['15%','system reliability improvement'],
    ['6%','error reduction'],
    ['20+','tasks across 5 teams']
  ],
  scheduler: [
    ['3','availability states'],
    ['4','quick-fill actions'],
    ['10+','coordination features beyond the grid']
  ],
  chat: [
    ['4','real-time interaction types'],
    ['5','tapback reactions']
  ],
  estee: [
    ['Top 5','challenge finalist']
  ]
};


function AuraField(){
  return <div className="auraField" aria-hidden="true">
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
    summary:'Rebuilt an Excel-based customer-value assessment as a multi-page web application, using user feedback to choose the interaction model and prioritize what to build next.',
    media:'fcvf',
    facts:['Excel → web product','2 interface directions']
  },
  {
    id:'finsimple',
    title:'FinSimple',
    company:'Ford Credit',
    summary:'Shipped customer-facing work inside an existing Ford Credit financial product across AEM, shared components, APIs, Salesforce, GraphQL, and GCP.',
    media:'finsimple',
    facts:['30% ahead of schedule','15% reliability improvement']
  },
  {
    id:'scheduler',
    title:'Collaborative Scheduling Platform',
    company:'CSE 477',
    summary:'Extended the When2Meet model to address common coordination gaps: tentative availability, quick-fill presets, automatic best-time calculation, participant status, venue voting, notes, event chat, sharing, and calendar export.',
    media:'scheduler',
    facts:['When2Meet + 10+ extensions','Flask · Socket.IO · MySQL']
  },
  {
    id:'chat',
    title:'Synchronized Group Chat',
    company:'CSE 477',
    summary:'A multi-user chat application using an iMessage-style interaction model, with join/leave events, typing state, reactions, and synchronized messages.',
    media:'chat',
    facts:['Real-time rooms + presence','iMessage interaction model']
  },
  {
    id:'estee',
    title:'Estée Lauder — Double Wear',
    company:'Estée Lauder × Kode With Klossy',
    summary:'Designed a digital product-discovery experience that combined product education, brand consistency, and paths to purchase.',
    media:'estee',
    facts:['Top 5 finalist','Discover → learn → explore → buy']
  }
];

function MetricStrip({items}) {
  return <div className="metricStrip">{items.map(([v,l])=><div className="metric" key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
}

function FCVFVisual(){
  return <div className="comparisonVisual">
    <figure><figcaption>Before</figcaption><img src="project-media/ford-before.webp" alt="Original Ford Excel assessment"/></figure>
    <figure><figcaption>After</figcaption><img src="project-media/ford-after.webp" alt="Ford Customer Value Framework web application"/></figure>
  </div>
}
function FinSimpleVisual(){
  return <div className="finsimpleVisual">
    <img className="mainShot" src="project-media/finsimple-live.png" alt="Finished FinSimple Previous Estimates experience"/>
    <div className="thumbRow"><img src="project-media/finsimple-dummy.png" alt="Previous Estimates with dummy data"/><img src="project-media/finsimple-aem.png" alt="Previous Estimates AEM implementation"/></div>
  </div>
}

const days=['Mon','Tue','Wed','Thu','Fri'];
const times=['9:00','9:30','10:00','10:30','11:00','11:30','12:00'];
const initialLevels=[0,1,2,0,1,1,2,3,1,0,0,1,2,3,2,1,0,1,2,2,0,0,1,2,3,2,1,0,1,1,2,0,0,1,2];
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
    <div className="calendarGrid">{times.map((t,r)=><React.Fragment key={t}><span className="timeLabel">{t}</span>{days.map((d,c)=>{const i=r*5+c;const cell=cells[i];const cls=view==='heatmap'?`heat heat-${Math.min(3,cell.available)}`:`status-${cell.status||'empty'}`;return <button key={d} aria-label={`${d} ${t}`} className={`slot ${cls}`} onClick={()=>view==='mine'&&setCells(a=>a.map((x,j)=>j===i?{...x,status:mode}:x))}/>})}</React.Fragment>)}</div>
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

function EsteeVisual(){return <div className="esteeGrid"><img src="project-media/el-home.webp" alt="Estée Lauder Double Wear landing experience"/><img src="project-media/el-benefits.webp" alt="Double Wear product benefits"/><img src="project-media/el-shades.webp" alt="Double Wear shade exploration"/><img src="project-media/el-shop.webp" alt="Double Wear purchase options"/></div>}

function ProjectCover({type}){
  if(type==='fcvf') return <div className="editorialCover fordEditorial"><img className="editorialLogo" src="company-logos/ford.png" alt="Ford"/><div className="screenFloat"><img src="project-media/ford-after.webp" alt="Ford Customer Value Framework web application"/></div><div className="coverCaption">Customer Value Framework</div></div>;
  if(type==='finsimple') return <div className="editorialCover finEditorial"><img className="editorialLogo credit" src="company-logos/ford-credit.jpg" alt="Ford Credit"/><div className="screenFloat"><img src="project-media/finsimple-live.png" alt="FinSimple Previous Estimates product"/></div><div className="coverCaption">Previous Estimates</div></div>;
  if(type==='scheduler') return <div className="editorialCover schedulerEditorial"><div className="schedulerCoverTag">Interactive preview</div><MiniScheduler/></div>;
  if(type==='chat') return <div className="editorialCover chatEditorial"><MiniChat/></div>;
  return <div className="editorialCover esteeEditorial"><img src="project-media/el-home.webp" alt="Estée Lauder Double Wear digital experience"/><div className="esteeStack"><img src="project-media/el-benefits.webp" alt="Double Wear product benefits"/><img src="project-media/el-shades.webp" alt="Double Wear shade exploration"/></div></div>;
}

function ProjectCard({project,index,onOpen}){
  const featured=project.id==='scheduler';
  return <Reveal className={featured?'projectCardReveal featured':''}>
    <article className={`projectCard ${featured?'featured':''}`} onClick={()=>onOpen(project.id)}>
      <div className="projectCardMedia"><ProjectCover type={project.media}/></div>
      <div className="projectCardBody">
        <div className="projectCardTop"><span>{project.company}</span><span>{String(index+1).padStart(2,'0')}</span></div>
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
  const paint=i=>{if(view==='heatmap')return;setCells(a=>a.map((c,j)=>j===i?{...c,status:mode}:c))};
  const quick=type=>setCells(prev=>prev.map((c,i)=>{
    const row=Math.floor(i/5);
    if(type==='clear')return {...c,status:''};
    if(type==='all')return {...c,status:'available'};
    if(type==='evenings')return {...c,status:row>=5?'available':''};
    return {...c,status:row<=5?'available':''};
  }));
  const addVenue=()=>{const v=newVenue.trim();if(!v)return;setVenues(x=>[...x,{name:v,votes:0}]);setNewVenue('')};
  return <div className="schedulerSandbox">
    <div className="eventHero"><div><h2>Design Sync</h2><p>Sep 15–19 · 9:00 AM–12:00 PM</p><span className="locationPill">📍 Minskoff Pavilion · Room 240</span></div><div className="eventStats"><span>2 days left</span><strong>3 participants</strong></div></div>
    <div className="quickRow"><span>Quick fill:</span><button onClick={()=>quick('all')}>✨ Free all slots</button><button onClick={()=>quick('weekdays')}>☀️ Weekdays 9–5</button><button onClick={()=>quick('evenings')}>🌙 Evenings only</button><button onClick={()=>quick('clear')}>🗑 Clear all</button></div>
    <div className="viewRow"><div><button className={view==='mine'?'active':''} onClick={()=>setView('mine')}>My Availability</button><button className={view==='heatmap'?'active':''} onClick={()=>setView('heatmap')}>Group Heatmap</button></div>{view==='mine'&&<div className="modeRow">{['available','maybe','unavailable'].map(m=><button className={mode===m?'active':''} key={m} onClick={()=>setMode(m)}>{m[0].toUpperCase()+m.slice(1)}</button>)}</div>}</div>
    <div className="schedulerActionRow"><button onClick={()=>setShareOpen(v=>!v)}>🔗 Share Event Link</button><button>💬 Copy for Discord</button><button>✉️ Copy for Email</button><button>📅 Export Calendar</button><button onClick={()=>quick('clear')}>Clear My Availability</button></div>
    {shareOpen&&<div className="shareBox"><strong>Invite link</strong><code>portfolio-demo.local/event/design-sync</code></div>}
    <div className="bestMeet"><div><span>Best Time to Meet</span><strong>{best.day} · {best.time}–{times[Math.min(times.length-1,Math.floor(cells.findIndex(c=>c===cells[(times.indexOf(best.time)*5)+(days.indexOf(best.day))])/5)+1)] || '10:00'}</strong></div><p>Highest available count, then fewest unavailable responses, then earliest tied slot.</p></div>
    <div className="schedulerBody"><div className="fullCalendar"><p className="gridHint">Click or drag to apply your selected status. Right-click a cell to add a note.</p><div className="calendarHead"><span></span>{days.map(d=><span key={d}>{d}</span>)}</div><div className="calendarGrid" onMouseLeave={()=>setDragging(false)}>{times.map((t,r)=><React.Fragment key={t}><span className="timeLabel">{t}</span>{days.map((d,c)=>{const i=r*5+c;const cell=cells[i];const cls=view==='heatmap'?`heat heat-${Math.min(3,cell.available)}`:`status-${cell.status||'empty'}`;return <button key={d} title={`${cell.note?cell.note+' · ':''}Available: ${cell.available} · Maybe: ${cell.maybe} · Unavailable: ${cell.unavailable}`} className={`slot ${cls} ${cell.note?'hasNote':''}`} onMouseDown={()=>{setDragging(true);paint(i)}} onMouseEnter={()=>dragging&&paint(i)} onMouseUp={()=>setDragging(false)} onContextMenu={e=>{e.preventDefault();const note=window.prompt('Add a note for this time slot',cell.note||'');if(note!==null)setCells(a=>a.map((x,j)=>j===i?{...x,note}:x))}}/>})}</React.Fragment>)}</div></div>
      <aside className="schedulerAside"><div className="sideCard"><h3>Participants</h3><p><span className="responded"></span> Neha · Responded</p><p><span className="responded"></span> Maya · Responded</p><p><span className="pending"></span> Alex · Pending</p></div><div className="sideCard"><h3>Venue Voting</h3>{venues.map(v=><button className={venue===v.name?'venue active':'venue'} key={v.name} onClick={()=>setVenue(v.name)}><span>{v.name}</span><strong>{v.votes+(venue===v.name?1:0)} votes</strong></button>)}<div className="venueAdd"><input value={newVenue} onChange={e=>setNewVenue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addVenue()} placeholder="Add venue…"/><button onClick={addVenue}>Add</button></div></div><div className="sideCard"><h3>Event Chat</h3><div className="eventChat">{chat.map((m,i)=><p key={i}>{m}</p>)}</div><div className="inlineComposer"><input value={chatText} onChange={e=>setChatText(e.target.value)} placeholder="Drop a quick note…"/><button onClick={()=>{if(chatText.trim()){setChat(c=>[...c,`Neha: ${chatText.trim()}`]);setChatText('')}}}>Send</button></div></div></aside>
    </div>
  </div>
}
function ChatSandbox(){
 const seed=[{system:'Neha joined the room'},{who:'Maya',text:'did everyone push?'},{who:'me',text:'yep just finished the socket changes'}];
 const [msgs,setMsgs]=useState(seed); const [text,setText]=useState(''); const [typing,setTyping]=useState(false);
 const add=()=>{if(!text.trim())return;setMsgs(m=>[...m,{who:'me',text:text.trim()}]);setText('')};
 const react=(i,r)=>setMsgs(m=>m.map((x,j)=>j===i?{...x,reaction:r}:x));
 return <div className="chatSandbox"><div className="chatTitle"><h2>Real-Time Chat</h2><span>Room: main</span></div><div className="chatWindow">{msgs.map((m,i)=>m.system?<div className="systemMsg" key={i}>{m.system}</div>:<div className={m.who==='me'?'chatLine mine':'chatLine theirs'} key={i}><button className="chatBubble" onDoubleClick={()=>react(i,'❤️')}>{m.text}{m.reaction&&<span className="reaction">{m.reaction}</span>}</button></div>)}{typing&&<div className="typingBubble"><i></i><i></i><i></i></div>}</div><div className="chatEntry"><input value={text} onChange={e=>{setText(e.target.value);setTyping(true);window.clearTimeout(window.__typing);window.__typing=window.setTimeout(()=>setTyping(false),900)}} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Type a message..."/><button onClick={add}>Send</button><button onClick={()=>setMsgs(m=>[...m,{system:'Neha left the room'}])}>Leave</button></div><p className="sandboxNote">Double-click a message to add a tapback. Typing and join/leave states mirror the original Socket.IO project behavior.</p></div>
}

function CaseStudy({id,onBack}){
 const p=projects.find(x=>x.id===id);
 if(!p)return null;
 return <main className="casePage"><button className="backBtn" onClick={onBack}>← Projects</button><header className="caseHeader"><p>{p.company}</p><h1>{p.title}</h1><div className="caseIntro">{p.summary}</div>{metrics[id]&&<MetricStrip items={metrics[id]}/>}</header><section className="caseHeroMedia"><ProjectCover type={p.media}/></section>
 {id==='fcvf'&&<><CaseSection title="Context"><p>FCVF was created to give product teams a more consistent, data-driven way to evaluate customer value. The existing assessment lived in Excel, which was long to complete, difficult to navigate, and exposed underlying formulas.</p></CaseSection><CaseSection title="What I did"><div className="factGrid"><Fact title="User research">Led a user interview for the design and used interview findings in product discussions.</Fact><Fact title="Design comparison">Helped compare one-page and multi-page approaches, then moved forward with the multi-page version after feedback.</Fact><Fact title="Prioritization">In a PO meeting, focused the discussion on features surfaced by customer interviews; save/load functionality became the next priority.</Fact><Fact title="Implementation">Contributed to the web application and the transition from a long form to a structured multi-page experience.</Fact></div></CaseSection><CaseSection title="Decision"><p>The team selected the multi-page approach after A/B testing and user feedback indicated it was easier to use. Navigation and progress cues were then refined around that structure.</p></CaseSection></>}
 {id==='finsimple'&&<><CaseSection title="Context"><p>My second Ford internship moved from a greenfield intern-built application to FinSimple, a deployed financial product with existing customers, shared libraries, data dependencies, and production environments.</p></CaseSection><CaseSection title="Previous Estimates"><p>I worked on the Previous Estimates experience in AEM. The project progressed from dummy data to an AEM component and then into the finished customer-facing flow.</p><div className="progression"><img src="project-media/finsimple-dummy.png" alt="Dummy data stage"/><img src="project-media/finsimple-aem.png" alt="AEM component stage"/><img src="project-media/finsimple-live.png" alt="Finished FinSimple stage"/></div></CaseSection><CaseSection title="System around the UI"><div className="architecture"><span>Customer UI</span><b>→</b><span>AEM / UCL</span><b>→</b><span>GraphQL / APIs</span><b>→</b><span>Salesforce / GCP</span></div><p>My work also involved questions around Salesforce record creation failures, PDF attachment handling, field population, and how information moved across the customer workflow.</p></CaseSection></>}
 {id==='scheduler'&&<><section className="productDelta"><div><span>When2Meet core</span><strong>Shared availability grid + overlap</strong></div><b>→</b><div><span>What I added</span><strong>Nuance, faster input, consensus, venues, notes, chat, sharing + calendar handoff</strong></div></section><section className="sandboxSection schedulerShowcase"><SchedulerSandbox/></section><CaseSection title="Starting point"><p>The assignment was explicitly to build an extended version of When2Meet. I kept the core idea — a shared grid and visual overlap — then added product features around coordination problems that the basic model does not solve on its own.</p></CaseSection><CaseSection title="What I extended"><div className="factGrid"><Fact title="More realistic availability">Added Available, Maybe, and Unavailable instead of a single binary state.</Fact><Fact title="Less repetitive input">Added quick-fill presets for all slots, weekdays 9–5, evenings, and clearing availability.</Fact><Fact title="Faster consensus">Added a Best Time to Meet calculation using availability count, conflicts, and tie-breaking.</Fact><Fact title="Coordination beyond time">Added participant response status, venue voting, notes, event chat, sharing, and calendar export.</Fact></div></CaseSection><CaseSection title="Interaction model"><div className="architecture"><span>My availability</span><b>→</b><span>Group heatmap</span><b>→</b><span>Best time</span><b>→</b><span>Venue + chat</span></div><p>The grid supports single-cell editing and click-and-drag status application. Heatmap intensity updates around collective availability, while the side panels keep the remaining event decisions in the same workspace.</p></CaseSection><CaseSection title="Architecture"><div className="architecture"><span>Browser</span><b>↔</b><span>Socket.IO</span><b>↔</b><span>Flask</span><b>↔</b><span>MySQL</span></div><p>Docker and Google Cloud Run were used for deployment. This portfolio sandbox preserves the product behavior with local browser state so it can run on GitHub Pages without the original backend.</p></CaseSection></>}
 {id==='chat'&&<><section className="sandboxSection"><ChatSandbox/></section><CaseSection title="Interaction model"><p>The interface follows iMessage conventions: the current user’s messages appear blue and right-aligned, other users’ messages appear gray and left-aligned, and room events are shown as system messages.</p></CaseSection><CaseSection title="Real-time behavior"><div className="factGrid"><Fact title="Messages">Clients receive new messages through Socket.IO.</Fact><Fact title="Presence">Join and leave events are broadcast to the room.</Fact><Fact title="Typing">Typing state is emitted while another user is composing a message.</Fact><Fact title="Tapbacks">Messages support reactions including heart, thumbs-up, laughter, exclamation, and question reactions.</Fact></div></CaseSection></>}
 {id==='estee'&&<><CaseSection title="Brief"><p>The goal was to keep the experience recognizably Estée Lauder while adding promotional elements, explaining why customers should buy Double Wear, and making purchase options easy to reach.</p></CaseSection><CaseSection title="Design approach"><div className="factGrid"><Fact title="Brand consistency">Matched Estée Lauder’s colors, typography, and visual style.</Fact><Fact title="Product education">Used concise benefits, visuals, and interactive elements to make the product easier to understand.</Fact><Fact title="Purchase path">Linked customers to multiple reputable retailers after product exploration.</Fact><Fact title="Customer journey">Structured the experience around discover → learn → explore → buy.</Fact></div></CaseSection></>}
 </main>
}
function CaseSection({title,children}){return <section className="caseSection"><h2>{title}</h2><div>{children}</div></section>}
function Fact({title,children}){return <div className="fact"><h3>{title}</h3><p>{children}</p></div>}

function TechnicalCard({title,subtitle,kind,description}){
  return <article className="techCard">
    <div className={`techVisual ${kind}`}>
      {kind==='game' && <div className="spartanScene"><img className="spartanBg" src="project-media/spartan-background.png" alt="Spartan Touchdown level artwork"/><div className="spartanGround"></div><img className="spartySprite" src="project-media/sparty.png" alt="Sparty power-up from Spartan Touchdown"/><img className="coinSprite coinOne" src="project-media/coin100.png" alt="100 point coin"/><img className="coinSprite coinTwo" src="project-media/coin100.png" alt=""/><img className="enemySprite" src="project-media/um-enemy.png" alt="Michigan enemy from Spartan Touchdown"/><img className="goalSprite" src="project-media/goalpost.png" alt="Goalpost from Spartan Touchdown"/></div>}
      {kind==='fluids' && <img src="project-media/stable-fluids.png" alt="2D Stable Fluids simulation with interactive controls"/>}
      {kind==='ray' && <div className="rayDiagram"><span>camera ray</span><i></i><span>intersection</span><i></i><span>lighting + reflection</span></div>}
    </div>
    <h3>{title}</h3>
    <p className="techMeta">{subtitle}</p>
    <p className="techDescription">{description}</p>
  </article>
}

function CompanyLogo({src,alt}){return <div className="companyLogo"><img src={src} alt={alt}/></div>}
function Home({openCase}){
 return <>
 <AuraField/>
 <header className="siteHeader"><a className="wordmark" href="#top">Neha Chinimilli</a><nav><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#technical">Technical work</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume</a></nav></header>
 <main id="top">
  <section className="hero"><div className="heroInner"><h1>Neha Chinimilli</h1><p>Computer Science + Supply Chain at Michigan State University. Ford Motor Company, Ford Credit, and Accenture.</p><div className="heroLinks"><a href="#projects">Projects</a><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div></div></section>
  <section id="projects" className="section projectsSection"><div className="sectionTitle compactTitle"><h2>Projects</h2><p>Five projects. Click any card for the full build, decisions, and evidence.</p></div><div className="projectCardGrid">{projects.map((p,i)=><ProjectCard project={p} index={i} key={p.id} onOpen={openCase}/>)}</div></section>
  <section id="experience" className="section experienceSection"><div className="sectionTitle compactTitle"><h2>Experience</h2><p>Role, scope, and what I worked on.</p></div><div className="experienceCards"><Reveal><article className="experienceCard"><CompanyLogo src="company-logos/accenture.svg" alt="Accenture"/><div><div className="experienceMeta"><span>2026 · San Francisco</span></div><h3>Accenture</h3><h4>Technology Summer Analyst</h4><p>Frontier AI lab account work across client adoption, enablement, and go-to-market programs.</p></div></article></Reveal><Reveal><article className="experienceCard"><CompanyLogo src="company-logos/ford-credit.jpg" alt="Ford Credit"/><div><div className="experienceMeta"><span>2024–2025 · Dearborn</span></div><h3>Ford Credit</h3><h4>Software Engineering Intern · 2 summers</h4><p>Customer-facing financial experiences, enterprise integrations, release workflows, and production reliability.</p></div></article></Reveal><Reveal><article className="experienceCard"><CompanyLogo src="company-logos/ford.png" alt="Ford Motor Company"/><div><div className="experienceMeta"><span>2023 · Dearborn</span></div><h3>Ford Motor Company</h3><h4>Software Engineering Intern</h4><p>Customer-value web product from MVP and user feedback through full-stack implementation.</p></div></article></Reveal></div></section>
  <section id="technical" className="section technicalSection">
    <div className="sectionTitle compactTitle"><h2>Technical work</h2><p>Game architecture, simulation, and rendering systems.</p></div>
    <div className="techGrid">
      <TechnicalCard title="Spartan Touchdown" subtitle="CSE 335 · C++ · wxWidgets · team development" kind="game" description="Built a team side-scrolling football game with XML-defined levels, reusable game objects, collision behavior, visitor-based traversal, automated tests, and a shared Kanban workflow. Level content could be composed and tuned without hard-coding every object into the game loop."/>
      <TechnicalCard title="2D Stable Fluids" subtitle="CSE 472 · C++ · simulation" kind="fluids" description="Implemented backtraced velocity advection, interpolation, buoyancy, and sparse-matrix velocity diffusion, then exposed controls for density, velocity, grid visibility, stepping, reset, and viscosity so the simulation could be tuned and observed interactively."/>
      <TechnicalCard title="Ray Tracer" subtitle="CSE 472 · C++ · computer graphics" kind="ray" description="Built a ray-tracing pipeline with camera rays, nearest-object intersections, materials, texture mapping, multiple lights, shadow rays, and reflections. Visual errors had to be traced through the full rendering path rather than patched at the surface."/>
    </div>
  </section>
  <section className="section aboutSection"><div className="sectionTitle"><h2>About</h2></div><div className="aboutGrid"><p>B.S. Computer Science + B.A. Supply Chain Management, Michigan State University.</p><div><a href="resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a><a href="https://www.linkedin.com/in/nchinimilli" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="mailto:chinimi2@msu.edu">chinimi2@msu.edu</a></div></div></section>
 </main><footer>© 2026 Neha Chinimilli</footer>
 </>
}
function App(){
 const [caseId,setCaseId]=useState(null);
 if(caseId)return <CaseStudy id={caseId} onBack={()=>{setCaseId(null);window.scrollTo(0,0)}}/>;
 return <Home openCase={id=>{setCaseId(id);window.scrollTo(0,0)}}/>;
}

createRoot(document.getElementById('root')).render(<App/>);
