import React, { useEffect, useRef, useState } from 'react';
import { InterviewRoom, SurveyDemo } from './FCVFResearch';
import LifecycleRoad from './LifecycleRoad';
import './fcvf-visuals.css';

const asset = (src: string) => `${import.meta.env.BASE_URL}${src}`;

function useInView<T extends Element>(){
 const ref=useRef<T>(null);
 const [seen,setSeen]=useState(false);
 useEffect(()=>{
  const el=ref.current;
  if(!el)return;
  const io=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setSeen(true);io.disconnect()}},{threshold:.35});
  io.observe(el);
  return ()=>io.disconnect();
 },[]);
 return [ref,seen] as const;
}

const stages=[
 {id:'fv-discover',name:'Discover',did:'Who uses it, and what hurts'},
 {id:'fv-define',name:'Define',did:'Goals and constraints'},
 {id:'fv-build',name:'Build',did:'Ship early, iterate 4 times'},
 {id:'fv-validate',name:'Validate',did:'4 user interviews'},
 {id:'fv-decide',name:'Decide',did:'Move the score to the end'},
 {id:'fv-deliver',name:'Deliver',did:'Ship on a 10-person team'},
 {id:'fv-measure',name:'Measure',did:'+25% feedback, and next'}
];

// Seven legacy stylesheets fold into one Material UI theme.
function CssConsolidation(){
 const [ref,seen]=useInView<HTMLDivElement>();
 return <div ref={ref} className={`fvCss ${seen?'isOn':''}`} role="img" aria-label="Seven legacy CSS files replaced by one Material UI theme">
  <div className="fvCssFiles">{Array.from({length:7},(_,i)=><span key={i} style={{'--i':i} as React.CSSProperties}><svg viewBox="0 0 24 30"><path d="M3 2h12l6 6v20H3z"/><path d="M15 2v6h6"/></svg></span>)}</div>
  <i className="fvCssArrow" aria-hidden="true"/>
  <div className="fvCssTheme"><svg viewBox="0 0 36 32" aria-hidden="true"><path d="M1 6l11 6v19L1 25zM35 6l-11 6v19l11-6zM12 12l6-3.5 6 3.5-6 3.5z"/></svg></div>
 </div>;
}

// Feedback volume as a dash gauge: the needle sweeps from the old baseline to +25%.
function FeedbackGauge(){
 const [ref,seen]=useInView<HTMLDivElement>();
 const cx=130,cy=132,r=104,max=150;
 const angle=(v:number)=>Math.PI*(1-v/max);
 const pt=(v:number,rad=r)=>[cx+rad*Math.cos(angle(v)),cy-rad*Math.sin(angle(v))];
 const arc=(a:number,b:number)=>{const [x1,y1]=pt(a),[x2,y2]=pt(b);return `M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`};
 const needle=(v:number)=>180*v/max-90;
 return <div ref={ref} className={`fvGauge ${seen?'isOn':''}`} role="img" aria-label="Feedback volume rose 25 percent after launch">
  <svg viewBox="0 0 260 150" aria-hidden="true">
   <path d={arc(0,max)} className="fvGaugeTrack"/>
   <path d={arc(100,125)} className="fvGaugeGain" pathLength={1}/>
   {Array.from({length:31},(_,i)=>i*5).map(v=>{const major=v%25===0;const [x1,y1]=pt(v,r-10);const [x2,y2]=pt(v,r-(major?24:16));return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} className={major?'major':''}/>})}
   {[['Before',100],['After',125]].map(([label,v])=>{const [x,y]=pt(v as number,r+26);return <text key={label} x={x} y={y} textAnchor="middle">{label}</text>})}
   <g className="fvGaugeNeedle" style={{'--from':`${needle(100)}deg`,'--to':`${needle(125)}deg`} as React.CSSProperties}><path d={`M${cx-3} ${cy}L${cx} ${cy-r+30}L${cx+3} ${cy}Z`}/></g>
   <circle cx={cx} cy={cy} r="8" className="fvGaugeHub"/>
  </svg>
  <strong>+25%</strong><span>feedback volume</span>
 </div>;
}

export default function FCVFCase({setLightbox}) {
 const [active,setActive]=useState(3);
 const iterations=[
  {number:'01',title:'Original Excel',src:'project-media/fcvf-iterations/slide6-pic8.png',alt:'Original Excel Customer Value Framework assessment',tried:'The working assessment kept questions, formulas, and response values in one long workbook.',learned:'It preserved the framework, but added time, navigation friction, and exposed the score logic.',changed:'Move the workflow into a browser-based product.'},
  {number:'02',title:'Lean MVP',src:'project-media/fcvf-iterations/slide8-pic5.png',alt:'Early one-page HTML Customer Value Framework MVP',tried:'A usable one-page application built from basic HTML components with almost no visual styling.',learned:'Shipping early let product owners react before the team overbuilt the interface.',changed:'Use that feedback to design the single-page experience.'},
  {number:'03',title:'Designed one-page',src:'project-media/fcvf-iterations/slide9-pic5.png',alt:'Designed single-page Customer Value Framework application',tried:'A Figma-led interface with implemented score calculation and a clearer visual system.',learned:'Users still experienced cognitive load, and the live score created response-integrity risk.',changed:'Compare one-page and multi-page directions in interviews.'},
  {number:'04',title:'Multi-page flow',src:'project-media/fcvf-iterations/slide10-pic4.png',alt:'Multi-page Customer Value Framework application with pagination',tried:'A paginated assessment that focused attention on one portion of the framework at a time.',learned:'Interview feedback favored the clearer, lower-load experience.',changed:'Ship pagination and visible progress while keeping the score hidden.'}
 ];

 const current=iterations[active];
 const evidence=(src,alt,caption)=><figure className="fvEvidence"><button type="button" onClick={(e)=>{e.stopPropagation();setLightbox({src:asset(src),alt})}} aria-label={`Expand ${alt}`}><img src={asset(src)} alt={alt} loading="lazy"/><span aria-hidden="true">↗</span></button><figcaption>{caption}</figcaption></figure>;
 return <div className="fvEditorial">
  <LifecycleRoad stages={stages}/>

  <section className="fvBrief fvStage" id="fv-discover">
   <div><h2>Better signals.<br/><em>Better decisions.</em></h2><p>Ford product teams used the Customer Value Framework to decide whether to invest in, improve, or stop a product idea.</p><p>The framework worked. The Excel workbook around it didn’t: one long sheet, formulas anyone could edit, and a score that changed while people were still answering.</p></div>
   <div className="fvWorkbookBefore" aria-label="Recreation of the original Excel Customer Value Framework workbook">
    <header><span className="fvWorkbookIcon">X</span><div><strong>Customer Value Framework.xlsx</strong><small>Original assessment · score logic exposed</small></div></header>
    <div className="fvWorkbookChrome"><span>File</span><span>Home</span><span>Insert</span><span>Formulas</span><span>Data</span><i>fx&nbsp;&nbsp;=SUMPRODUCT(C12:C28,D12:D28)</i></div>
    <div className="fvWorkbookGrid" aria-hidden="true"><b></b>{['A','B','C','D','E'].map(x=><b key={x}>{x}</b>)}{['1','2','3','4','5','6'].map((row,r)=><React.Fragment key={row}><b>{row}</b><span className={r===0?'wide':''}>{r===0?'Customer evidence':''}</span><span>{r===1?'Demand':''}</span><span className="score">{[72,84,61,90,77,68][r]}</span><span>{r===2?'=C4*D4':''}</span><span></span></React.Fragment>)}</div>
    <footer><span>Long sheet</span><span>Editable formulas</span><span>Live score shapes answers</span></footer>
   </div>
  </section>

  <section className="fvLogic fvStage" id="fv-define">
   <div><h2>Keep the engine.<br/><em>Rethink the controls.</em></h2>    <ol className="fvGoals">
     <li><b>Preserve the scoring logic</b><span>Same response values and formulas as the workbook.</span></li>
     <li><b>Make a long assessment easier to finish</b><span>Less scanning, clearer navigation, visible progress.</span></li>
     <li><b>Protect response integrity</b><span>No accidental formula edits, no answering toward a score.</span></li>
    </ol>
   </div>
   <div className="fvFormulaPair">{evidence('project-media/fcvf-iterations/slide6-pic5.png','Original Excel response values','01 / Response values')}{evidence('project-media/fcvf-iterations/slide6-pic6.png','Original Excel scoring formula','02 / Scoring logic')}</div>
  </section>

  <section className="fvWorkbench fvStage" id="fv-build"><header><div><h2>Ship early.<br/><em>Then iterate.</em></h2></div><p>A plain HTML MVP got product owners reacting early. Each build after it answered the next open question.</p></header><div className="fvBuildNav" role="group" aria-label="Choose a prototype version">{iterations.map((item,i)=><button key={item.number} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}><span>{item.number}</span>{item.title}</button>)}</div><div className="fvBuild" aria-live="polite"><div className="fvBuildImage">{evidence(current.src,current.alt,`Original project artifact / Build ${current.number}`)}</div><div className="fvBuildNotes"><h3>{current.title}</h3><dl><dt>What we built</dt><dd>{current.tried}</dd><dt>What we learned</dt><dd>{current.learned}</dd><dt>What changed next</dt><dd>{current.changed}</dd></dl></div></div></section>

  <section className="fvResearch fvStage" id="fv-validate"><header><h2>Four interviews changed<br/>the product's direction.</h2><InterviewRoom/></header><div className="fvResearchNotes"><p>I led four moderated interviews comparing the one-page build with a multi-page prototype. Two findings changed the product:</p><article><svg className="fvTestSketch" viewBox="0 0 190 74" aria-hidden="true"><rect x="1" y="1" width="188" height="70" rx="9" fill="none" stroke="currentColor"/><path d="M64 1V71M126 1V71" stroke="currentColor"/><path d="M11 17H52M11 28H52M11 39H41M137 17H177M137 28H177M137 39H166" stroke="currentColor" opacity=".25"/><rect x="72" y="10" width="46" height="52" rx="4" fill="#163f5b"/><path d="M81 23H109M81 32H109M81 41H100" stroke="#e2e8e7"/></svg><h3>The full assessment felt overwhelming.</h3><p>Pagination gave users one portion of the framework at a time, with progress they could see.</p></article><article><svg className="fvTestSketch" viewBox="0 0 190 74" aria-hidden="true"><rect x="1" y="1" width="188" height="70" rx="9" fill="none" stroke="currentColor"/><path d="M18 22H103M18 36H103M18 50H103" stroke="currentColor" opacity=".25"/><rect x="118" y="12" width="58" height="47" rx="4" fill="#163f5b"/><path d="M138 33V27a9 9 0 0 1 18 0V33" fill="none" stroke="#dce5e6" strokeWidth="2"/><rect x="135" y="32" width="24" height="18" rx="2" fill="#dce5e6"/><path d="M147 38V44" stroke="#163f5b" strokeWidth="2"/></svg><h3>A live score could steer the answers.</h3><p>Watching the number change while answering invited people to pick the option that scored higher, not the one the evidence supported.</p></article></div></section>

  <div className="fvStage" id="fv-decide"><SurveyDemo/>
   <section className="fvTradeoffs"><h3>The tradeoffs I accepted</h3>
    <div><p><s>Instant score feedback while answering</s><i aria-hidden="true">→</i><b>Answers based on the evidence, not the number</b></p>
    <p><s>Everything visible on one page</s><i aria-hidden="true">→</i><b>More clicks, but less to scan and clear progress</b></p></div>
   </section>
  </div>

  <section className="fvDelivery fvStage" id="fv-deliver"><header><h2>Shipped on a<br/><em>10-person Agile team.</em></h2><p>I implemented frontend and backend work in React, TypeScript, and Material UI on a Kotlin and Spring service, improved accessibility, and planned the work in GitHub Projects.</p></header>{evidence('project-media/ford-after.webp','Final Ford Customer Value Framework web experience','Shipped web experience / Multi-page flow · Visible progress · Score after completion')}
   <div className="fvShipFacts"><div className="fvFact"><strong>100+</strong><span>Git commits across the frontend and backend</span></div><div className="fvFact"><div className="fvFactHead"><strong>7<small>→</small>1</strong><CssConsolidation/></div><span>Legacy stylesheets consolidated into one Material UI theme</span></div></div>
  </section>

  <section className="fvMeasure fvStage" id="fv-measure">
   <header className="fvMeasureHead"><h2>Measured by<br/><em>what users sent back.</em></h2></header>
   <div className="fvMeasureResult"><FeedbackGauge/><p>More feedback after launch gave the team clearer signal on what to fix next.</p></div>
   <div className="fvMeasureNext">
    <h3>What I’d measure next</h3>
    <ul><li><b>Completion rate</b>How many assessments are finished once started.</li><li><b>Time to complete</b>Whether pagination actually shortened the work.</li><li><b>Answer changes before submitting</b>A check that hiding the score kept responses honest.</li></ul>
    
   </div>
  </section>
 </div>
}
