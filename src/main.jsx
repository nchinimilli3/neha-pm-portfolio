import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, Check, MessageCircle, Send, Sparkles } from 'lucide-react';
import './styles.css';

const slots = ['9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30'];
const days = ['Mon','Tue','Wed','Thu'];

function Header(){
  return <header className="nav shell">
    <a className="brand" href="#top"><span className="brand-dot"/>NEHA CHINIMILLI</a>
    <nav>
      <a href="#work">Work</a><a href="#experience">Experience</a><a href="#about">About</a><a href="/resume.pdf" target="_blank" rel="noreferrer">Resume</a>
      <a className="pill small" href="mailto:YOUR_EMAIL">Contact <ArrowUpRight size={14}/></a>
    </nav>
  </header>
}

function Hero(){
  return <section id="top" className="hero shell">
    <div className="bloom bloom-a"/><div className="bloom bloom-b"/><div className="bloom bloom-c"/>
    <div className="eyebrow">PRODUCT · TECHNOLOGY · STRATEGY</div>
    <h1>I like figuring out why something isn’t working — then building a better version.</h1>
    <div className="hero-bottom">
      <p>Computer Science + Supply Chain at Michigan State. Previously at Ford Credit and Accenture.</p>
      <div className="hero-actions"><a className="pill dark" href="#work">See my work <ArrowDown size={16}/></a><a className="text-link" href="#experience">Experience →</a></div>
    </div>
  </section>
}

function FCVFMock(){
  const [step,setStep]=useState(1);
  const [choice,setChoice]=useState(null);
  const q = [
    ['How clear is the customer problem?',['Still fuzzy','Mostly clear','Very clear']],
    ['How confident are you in the evidence?',['Low','Medium','High']],
    ['How ready is this concept for prioritization?',['Not yet','Almost','Ready']]
  ][step-1];
  return <div className="fcvf-mock">
    <div className="mock-top"><span>Customer Value Assessment</span><span>{step} of 3</span></div>
    <div className="progress"><i style={{width:`${step/3*100}%`}}/></div>
    <div className="question-card">
      <span className="mini-label">YOUR ASSESSMENT</span>
      <h4>{q[0]}</h4>
      <div className="choice-list">{q[1].map(c=><button key={c} onClick={()=>setChoice(c)} className={choice===c?'selected':''}>{choice===c&&<Check size={14}/>} {c}</button>)}</div>
      <button className="next" onClick={()=>{setStep(step===3?1:step+1);setChoice(null)}}>{step===3?'Restart demo':'Continue'} →</button>
    </div>
  </div>
}

function ProjectIntro({index,kicker,title,summary,tags}){
  return <div className="project-copy">
    <div className="project-index">0{index}</div>
    <div className="eyebrow">{kicker}</div>
    <h2>{title}</h2>
    <p>{summary}</p>
    <div className="tags">{tags.map(t=><span key={t}>{t}</span>)}</div>
  </div>
}

function FordProject(){
  return <section className="project project-ford shell">
    <ProjectIntro index={1} kicker="FORD CREDIT · PRODUCT + ENGINEERING" title="Turning an Excel workflow into a product people could actually use." summary="The original customer-value assessment was slow, fragile, and hard to navigate. Our team rebuilt it as a web experience, tested one-page vs. multi-page flows, interviewed users, and shipped the multi-page direction." tags={['User research','A/B testing','React','Product delivery']}/>
    <div className="visual-wrap teal"><FCVFMock/></div>
    <div className="project-notes">
      <div><span>Problem</span><p>A long spreadsheet created usability, support, and data-integrity issues.</p></div>
      <div><span>Decision</span><p>User testing favored a multi-page experience, so the team implemented pagination and clearer progress.</p></div>
      <div><span>Why it matters</span><p>It shows product judgment and engineering execution inside real enterprise constraints.</p></div>
    </div>
  </section>
}

function Scheduler(){
  const initial = useMemo(()=>new Set(['Mon-10:00','Mon-10:30','Tue-11:00','Tue-11:30','Wed-9:30','Wed-10:00','Thu-12:00']),[]);
  const [mine,setMine]=useState(initial);
  const others={
    'Mon-10:00':2,'Mon-10:30':2,'Mon-11:00':1,'Tue-11:00':2,'Tue-11:30':2,'Tue-12:00':1,'Wed-9:30':2,'Wed-10:00':2,'Wed-10:30':1,'Thu-12:00':2,'Thu-12:30':2
  };
  const toggle=(key)=>setMine(prev=>{const n=new Set(prev);n.has(key)?n.delete(key):n.add(key);return n});
  return <div className="scheduler-demo">
    <div className="demo-head"><div><span className="status-dot"/>Room: CSE 477 Team</div><span>3 people</span></div>
    <div className="scheduler-grid">
      <div className="grid-corner">TIME</div>{days.map(d=><div className="day" key={d}>{d}</div>)}
      {slots.map(time=><React.Fragment key={time}><div className="time">{time}</div>{days.map(day=>{const key=`${day}-${time}`;const total=(others[key]||0)+(mine.has(key)?1:0);return <button aria-label={`${day} ${time}`} key={key} onClick={()=>toggle(key)} className={`slot heat-${total}`}>{total===3?<Sparkles size={13}/>:total||''}</button>})}</React.Fragment>)}
    </div>
    <div className="demo-foot"><span>Click cells to add/remove your availability.</span><span className="best"><Sparkles size={13}/> Best overlap</span></div>
  </div>
}

function SchedulerProject(){
  return <section className="project project-scheduler shell">
    <ProjectIntro index={2} kicker="CSE 477 · COLLABORATIVE SCHEDULING" title="Finding a meeting time shouldn’t require 47 texts." summary="A browser-only recreation of a When2Meet-style collaborative scheduler: shared availability, overlap detection, and the interaction model of a real-time multi-user room." tags={['Product UX','Flask concept','Socket.IO concept','Cloud architecture']}/>
    <div className="visual-wrap lavender"><Scheduler/></div>
  </section>
}

function ChatDemo(){
  const [messages,setMessages]=useState([
    {me:false,name:'Maya',text:'are we still meeting at 7?'},
    {me:true,name:'Neha',text:'yes — I just pushed the latest build'},
    {me:false,name:'Jordan',text:'wait the iMessage theme is actually so fun'}
  ]);
  const [text,setText]=useState('');
  const send=()=>{if(!text.trim())return;setMessages([...messages,{me:true,name:'Neha',text:text.trim()}]);setText('')};
  return <div className="phone">
    <div className="phone-notch"/><div className="chat-head"><span>‹</span><div className="avatar">G</div><strong>group chat</strong><span>ⓘ</span></div>
    <div className="messages">{messages.map((m,i)=><div key={i} className={`bubble-row ${m.me?'me':''}`}><div className={`bubble ${m.me?'blue':'gray'}`}>{m.text}</div></div>)}</div>
    <div className="typing"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="iMessage"/><button onClick={send}><Send size={15}/></button></div>
  </div>
}

function ChatProject(){
  return <section className="project project-chat shell">
    <ProjectIntro index={3} kicker="CHINIMI2 · REAL-TIME WEB APP" title="What if a web app felt like texting your friends?" summary="The memorable surface is the iMessage interface. The important part is the shared state underneath: users enter and leave rooms, messages update for everyone, and the experience stays synchronized." tags={['Realtime UX','Messaging','Shared state','Socket.IO']}/>
    <div className="visual-wrap pink"><ChatDemo/></div>
  </section>
}

function EarlierWork(){return <section className="earlier shell">
  <div className="eyebrow">EARLIER EXPLORATION</div>
  <div className="earlier-card">
    <div>
      <span className="year">2021</span>
      <h3>Estée Lauder × Kode With Klossy</h3>
      <p>Designed and built a Double Wear product-discovery experience around brand consistency, interactive promotion, benefits education, and a clear path to purchase.</p>
    </div>
    <div className="el-visual"><div className="bottle b1"/><div className="bottle b2"/><div className="bottle b3"/><span>DOUBLE WEAR<br/><small>DIGITAL EXPERIENCE</small></span></div>
  </div>
</section>}

function Experience(){return <section id="experience" className="experience shell">
  <div className="section-head"><div><div className="eyebrow">EXPERIENCE</div><h2>I’ve also shipped inside much bigger systems.</h2></div><p>The résumé version is concise. This is the context behind it.</p></div>
  <div className="exp-list">
    <article><div><span>2026</span><h3>Accenture</h3><strong>Technology Summer Analyst · San Francisco</strong></div><p>Worked with the OpenAI go-to-market organization on client adoption and enablement — translating technical capabilities into practical use cases, training concepts, and clearer ways for enterprise users to understand the product.</p></article>
    <article><div><span>2023–2025</span><h3>Ford Motor Company / Ford Credit</h3><strong>Software Engineering Intern · 3 summers</strong></div><p>Shipped customer-facing and internal product work across AEM, Salesforce integrations, release systems, incident response, onboarding, and product discovery.</p></article>
  </div>
  <div className="mini-exp">
    <div><span>CONSULTING</span><h4>Spectrum Consulting Group</h4><p>KPI systems, growth strategy, dashboards, and client recommendations.</p></div>
    <div><span>CAREER COACHING</span><h4>MSU Russell Palmer Career Center</h4><p>Resume, interviewing, networking, and consulting-readiness coaching.</p></div>
    <div><span>LEADERSHIP</span><h4>Dashney’s Women’s Leadership Accelerator</h4><p>Selected cohort member and community builder.</p></div>
  </div>
</section>}

function About(){return <section id="about" className="about shell">
  <div className="about-grid"><div><div className="eyebrow">ABOUT</div><h2>Technical enough to build it. Curious enough to question it.</h2></div><div><p>I’m most interested in product roles where the hard part is making something complicated feel obvious to the user.</p><p>Outside work, I shoot film photography, wander around cities, and care an unreasonable amount about whether an interface feels good.</p><a className="pill dark" href="mailto:YOUR_EMAIL">Say hi <MessageCircle size={15}/></a></div></div>
  <footer><span>Neha Chinimilli · 2026</span><span>Built in React + Vite</span></footer>
</section>}

function App(){return <><Header/><main><Hero/><section id="work" className="work-intro shell"><div className="eyebrow">SELECTED WORK</div><h2>Three projects that show how I think.</h2><p>One professional product. Two interactive technical builds. No filler.</p></section><FordProject/><SchedulerProject/><ChatProject/><EarlierWork/><Experience/><About/></main></>}

createRoot(document.getElementById('root')).render(<App/>);
