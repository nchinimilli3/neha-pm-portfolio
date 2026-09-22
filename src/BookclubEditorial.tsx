import React, {useEffect, useId, useRef, useState} from 'react';
import {bookclubDevicePath,bookclubDeviceViewBox} from './bookclub-device-mask';
import './bookclub-editorial.css';
import LifecycleRoad from './LifecycleRoad';
import { DecisionMoment, Supporting, Tradeoff } from './CaseDecision';
export function BookclubDevice({screen,label}:{screen:string;label:string}){
  const id=useId().replace(/:/g,'');
  return <svg className="bcDevice" viewBox={bookclubDeviceViewBox} role="img" aria-label={label}>
    <defs><clipPath id={`device-${id}`}><path d={bookclubDevicePath}/></clipPath></defs>
    <image href={`${import.meta.env.BASE_URL}project-media/bookclub/mobile/${screen}.png`} width="1414" height="2000" clipPath={`url(#device-${id})`}/>
  </svg>;
}
export function BookclubEditorialHero(){
  return <div className="bcHero" aria-label="Bookclub reading plan, club home, and conversation deck">
    <svg className="bcHeroBooks" viewBox="0 0 360 165" aria-hidden="true">
      <defs><linearGradient id="bcBookCloth"><stop stopColor="#3d6558"/><stop offset=".5" stopColor="#597966"/><stop offset="1" stopColor="#35584b"/></linearGradient></defs>
      <g transform="translate(13 83) rotate(-4 156 30)"><path d="M8 0H311q16 0 16 14v34H8Z" fill="#75494e"/><path d="M18 6h288v34H18Z" fill="#ece5cf"/><path d="M22 13h280M22 20h283M22 28h277M22 35h282" stroke="#cfc5ab" strokeWidth="1"/><path d="M8 0h300M8 47h317" stroke="#633c44" strokeWidth="5"/><path d="M8 1Q-2 22 8 47h26V1Z" fill="#805057"/><path d="M19 8v31" stroke="#ab7e7e"/><path d="M264 5h16v50l-8-7-8 7Z" fill="#c7a764"/></g>
      <g transform="translate(25 44) rotate(3 150 20)"><path d="M0 0h302v39H0q-10-20 0-39Z" fill="#a58357"/><path d="M15 5h278v29H15Z" fill="#f3ebd8"/><path d="M20 12h266M20 19h268M20 26h263" stroke="#d5c9ad"/><path d="M0 0h301M0 39h301" stroke="#997649" strokeWidth="4"/><path d="M0 0h23v39H0q-10-20 0-39Z" fill="#b59461"/></g>
      <g transform="translate(2 4) rotate(-2 150 20)"><path d="M8 0h284q13 0 13 12v32H8Q-3 22 8 0Z" fill="url(#bcBookCloth)"/><path d="M24 6h272v30H24Z" fill="#e8e5d1"/><path d="M29 13h259M29 20h261M29 27h255" stroke="#c6c8af"/><path d="M8 0h286M8 44h295" stroke="#315648" strokeWidth="4"/><path d="M8 0h25v44H8Q-3 22 8 0Z" fill="#426856"/><path d="M18 7v30" stroke="#8b9b74"/></g>
    </svg>
    <figure className="bcHeroLeft"><BookclubDevice screen="reading-plan" label="Bookclub reading plan"/></figure>
    <figure className="bcHeroCenter"><BookclubDevice screen="club-home" label="Bookclub club home"/></figure>
    <figure className="bcHeroRight"><BookclubDevice screen="conversation-deck" label="Bookclub conversation deck"/></figure>
    <span className="bcHeroCaption">A shared shelf. A conversation worth coming back to.</span>
  </div>;
}
function useInView<T extends Element>(threshold=.35){
  const ref=useRef<T>(null);const [inView,setInView]=useState(false);
  useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(([e])=>setInView(e.isIntersecting),{threshold});io.observe(el);return()=>io.disconnect()},[threshold]);
  return [ref,inView] as const;
}

// The problem, as it actually shows up: a group thread where each message is a different job.
const thread=[
  {who:'Maya',text:'what are we reading next??',job:'Choose'},
  {who:'Jordan',poll:['Piranesi','Circe','The Overstory'],job:'Choose'},
  {who:'Sam',text:'did anyone finish ch 12? pls no spoilers',job:'Keep pace'},
  {who:'Priya',text:'can we move it to thursday?',job:'Meet'},
  {who:'Maya',text:'what was that quote you loved last time?',job:'Meet'},
];
function GroupThread(){
  const [ref,inView]=useInView<HTMLDivElement>(.4);
  const [shown,setShown]=useState(0);
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setShown(thread.length);return}
    if(!inView){setShown(0);return}
    const id=window.setInterval(()=>setShown(n=>n>=thread.length+3?0:n+1),900);
    return()=>window.clearInterval(id);
  },[inView]);
  return <div ref={ref} className="bcThreadPhone" aria-label="A group chat mixing book choices, a poll, a spoiler worry, a schedule change, and a lost quote">
    <div className="bcThreadTop"><span className="bcThreadAvatars" aria-hidden="true"><i/><i/><i/></span><strong>Book club 📚</strong><small>6 people</small></div>
    <div className="bcThreadBody">
      {thread.map((m,i)=><div key={i} className={`bcMsg ${shown>i?'isShown':''}`}>
        <small>{m.who}</small>
        {m.poll?<div className="bcBubble bcPoll"><b>Poll: next book</b>{m.poll.map((o,k)=><span key={o}><i style={{width:`${[62,48,22][k]}%`}}/>{o}</span>)}</div>:<div className="bcBubble">{m.text}</div>}
        <em className={`bcJob job-${m.job.replace(' ','')}`}>{m.job}</em>
      </div>)}
      <div className={`bcTyping ${shown>=thread.length?'isShown':''}`} aria-hidden="true"><i/><i/><i/></div>
    </div>
  </div>;
}

const bets=[
  {job:'Choose',title:'Rank the nominees instead of running a poll.',instead:'One-tap polls where the loudest favorite wins',tradeoff:'A few more taps for a pick the whole group accepts.',screen:'book-detail',label:'Book details for a nominated title'},
  {job:'Keep pace',title:'Tie every discussion to a reading checkpoint.',instead:'One thread everyone scrolls at their own risk',tradeoff:'Posters add a chapter tag. Readers get a clear spoiler boundary.',screen:'reading-plan',label:'Reading plan with chapter checkpoints'},
  {job:'Meet',title:'Bring saved thoughts into the meeting.',instead:'Starting the meeting from a blank page',tradeoff:'Notes stay private until the reader chooses to share.',screen:'meeting-room',label:'Meeting room with the active book'},
];

const people=[
  {skin:'#8d5a42',hair:'#1c1715',shirt:'#3f6a55',role:'Reader'},
  {skin:'#e2b995',hair:'#6d4630',shirt:'#9d4f45',role:'Organizer'},
  {skin:'#c68b67',hair:'#2b211c',shirt:'#b39a73',role:'Reader'},
  {skin:'#6b4535',hair:'#151313',shirt:'#5b7fa6',role:'Reader'},
  {skin:'#f0c9a8',hair:'#b8863f',shirt:'#6f5b8e',role:'Organizer'},
];
const Avatar=({p}:{p:typeof people[number]})=><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" className="bcHalo"/><path d="M12 60c2-14 10-21 20-21s18 7 20 21" fill={p.shirt}/><circle cx="32" cy="26" r="11" fill={p.skin}/><path d="M20 25c0-9 5-14 12-14s13 5 12 14c-3-5-7-7-12-7s-9 2-12 7" fill={p.hair}/></svg>;
const tasks=[
  {task:'Find the current read',time:'< 1 min'},
  {task:'Rank the shortlist',time:'< 2 min'},
  {task:'Bring a thought to the meeting',time:'< 90 sec'},
];
const rank=[{t:'Ranking the ballot',w:.94},{t:'Tagging checkpoints',w:.66},{t:'Thoughts reaching the meeting',w:.48},{t:'Finding the current read',w:.28}];

function ValidationPlan(){
  const [ref,inView]=useInView<HTMLDivElement>(.25);
  return <div ref={ref} className={`bcPlan ${inView?'isIn':''}`}>
    <article className="bcPhase" style={{'--pi':0} as React.CSSProperties}>
      <span className="bcPhaseNum">1</span>
      <h3>5 user interviews</h3>
      <p>Readers and organizers on how their club runs today.</p>
      <div className="bcPeople">{people.map((p,i)=><figure key={i} style={{'--k':i} as React.CSSProperties}><Avatar p={p}/><figcaption>{p.role}</figcaption></figure>)}</div>
    </article>
    <article className="bcPhase" style={{'--pi':1} as React.CSSProperties}>
      <span className="bcPhaseNum">2</span>
      <h3>Usability tests</h3>
      <p>Three core tasks. Pass = 4 of 5 unaided.</p>
      <ol className="bcTasks">{tasks.map((t,i)=><li key={t.task} style={{'--k':i} as React.CSSProperties}><span><b>{t.task}</b><small>{t.time}</small></span><i className="bcTaskBar"><em/></i><span className="bcTaskDots" aria-hidden="true">{[0,1,2,3,4].map(d=><i key={d} className={d<4?'ok':''}/>)}</span></li>)}</ol>
    </article>
    <article className="bcPhase" style={{'--pi':2} as React.CSSProperties}>
      <span className="bcPhaseNum">3</span>
      <h3>Live club demo</h3>
      <p>Rank every issue by frequency × pain.</p>
      <ol className="bcRank" aria-label="Issues ranked by how often they happen times how much they hurt">
        {rank.map((d,i)=><li key={d.t} className={i===0?'isTop':''} style={{'--k':i,'--w':d.w} as React.CSSProperties}>
          <span>{d.t}</span><b/>{i===0&&<em>Fix first</em>}
        </li>)}
      </ol>
    </article>
  </div>;
}

const bookclubStages=[
  {id:'bc-discover',name:'Discover',did:'The coordination problem'},
  {id:'bc-build',name:'Build',did:'Three product bets'},
  {id:'bc-validate',name:'Validate',did:'5 interviews, then tests'}
];
export function BookclubEditorial(){
  return <div className="bcStory">
    <LifecycleRoad stages={bookclubStages} vehicle="book"/>
    <section className="bcProblem bcStage" id="bc-discover">
      <div className="bcProblemCopy">
        <h2>The hard part of a book club<br/><em>happens between meetings.</em></h2>
        <p>My reading group is busy adults coordinating from their phones. Choosing the next book, reading at different speeds, and showing up with something to say each happened somewhere different, and none of it stayed put.</p>
        <ul className="bcJobs">
          <li className="job-Choose"><b>Choose</b>a book the whole group wants</li>
          <li className="job-Keeppace"><b>Keep pace</b>without spoiling anyone</li>
          <li className="job-Meet"><b>Meet</b>with thoughts ready to share</li>
        </ul>
      </div>
      <GroupThread/>
    </section>

    <section className="bcBets bcStage" id="bc-build">
      <DecisionMoment
        statement={<>Rank the nominees.<br/>Don’t run a poll.</>}
        sub="Three product bets shape this app. This is the one that decides whether the club survives its own book choice."
        because={<p>A one-tap poll rewards whoever answers first and loudest. In a group of busy adults reading one book at a time, a pick that only half the club wanted is the thing that quietly ends a book club, so the choosing step is worth more friction than any other.</p>}
        tradeoff={<Tradeoff pairs={[
          ['One-tap polls where the loudest favourite wins','A few more taps for a pick the whole group accepts']
        ]}/>}
        result={<p>Private membership plus ranked preference turns scattered suggestions into one decision the club can live with. AI helps with search and passage scanning; members make every choice.</p>}
      >
        <figure className="bcBetPhone bcLeadBet"><BookclubDevice screen={bets[0].screen} label={bets[0].label}/></figure>
      </DecisionMoment>

      <Supporting title="The other two bets" note="Same shape: a little more effort, a better group outcome.">
        <ol>{bets.slice(1).map((b,i)=><li key={b.title} style={{'--k':i} as React.CSSProperties}>
          <figure className="bcBetPhone"><BookclubDevice screen={b.screen} label={b.label}/></figure>
          <em className={`bcJob job-${b.job.replace(' ','')}`}>{b.job}</em>
          <h3>{b.title}</h3>
          <p className="bcInstead"><s>{b.instead}</s></p>
          <p className="bcTradeoff"><b>Tradeoff</b>{b.tradeoff}</p>
        </li>)}</ol>
      </Supporting>
    </section>

    <section className="bcValidate bcStage" id="bc-validate">
      <header><h2>How I’ll know <em>it works</em></h2><p>Live with my reading group. Three checks before building more.</p></header>
      <ValidationPlan/>
      <div className="bcRules">
        <p className="bcRulesHead">If the tests show…</p>
        <div className="bcRule"><span>Fewer than 4 of 5 finish ranking</span><b>Simplify the ballot before adding features</b></div>
        <div className="bcRule"><span>Readers skip checkpoint tags</span><b>Suggest the tag from their saved progress</b></div>
        <div className="bcRule"><span>Saved thoughts never reach the meeting</span><b>Turn them into the meeting’s opening prompts</b></div>
      </div>
    </section>
  </div>;
}
