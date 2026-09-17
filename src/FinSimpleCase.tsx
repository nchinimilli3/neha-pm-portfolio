import React, { useEffect, useRef, useState } from 'react';
import './finsimple.css';
import LifecycleRoad from './LifecycleRoad';
const asset=(src:string)=>`${import.meta.env.BASE_URL}${src}`;
const builds=[
 {title:'Make the behavior tangible',stage:'Prototype',src:'project-media/finsimple-dummy.png',alt:'FinSimple prototype with synthetic data',copy:'Synthetic data made the Previous Estimates interaction testable before integration.'},
 {title:'Make it native to the platform',stage:'AEM component',src:'project-media/finsimple-aem.png',alt:'FinSimple AEM component implementation',copy:'The experience became a reusable AEM component inside the existing product.'},
 {title:'Carry it into the live journey',stage:'Customer release',src:'project-media/finsimple-live.png',alt:'Released FinSimple Previous Estimates experience',copy:'Integration, testing, and release coordination carried the feature into the customer-facing flow.'}
];
const layers=[
 {name:'Web experience',detail:'The customer finds a previous estimate and continues from it.'},
 {name:'AEM component',detail:'The feature ships as a reusable component in the existing platform.'},
 {name:'API layer',detail:'Customer and estimate context cross the integration boundary.'},
 {name:'Salesforce',detail:'The workflow stays connected to the downstream record.'}
];
const drive=[
 {title:'Open Previous Estimates',copy:'Return to the estimates already created.'},
 {title:'Choose an estimate',copy:'Find the earlier vehicle estimate to revisit.'},
 {title:'Continue the journey',copy:'Pick up the workflow from that estimate.'}
];
const lanes=['Requirements','AEM component','API integration','QA & validation','Production release'];
const stages=[
 {id:'fs-discover',name:'Discover',did:'Customers lose their saved work'},
 {id:'fs-define',name:'Define',did:'Fit a live platform'},
 {id:'fs-build',name:'Build',did:'Prototype, component, release'},
 {id:'fs-test',name:'Test',did:'Dev, QA, and production'},
 {id:'fs-launch',name:'Launch',did:'5 teams, 10% early'},
 {id:'fs-operate',name:'Operate',did:'Incidents, playbooks, learnings'}
];
const envs=[
 {name:'Dev',checks:['Component behavior','Postman API validation']},
 {name:'QA',checks:['Security-scan findings reviewed','PR compliance']},
 {name:'Production',checks:['Release validated','Environment tags documented']}
];

// Reveal grouped items one after another the first time they scroll into view; loop SVG motion only while visible.
function useFinSimpleMotion(root:React.RefObject<HTMLDivElement>){
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const groups=[...el.querySelectorAll<HTMLElement>('[data-stagger]')];
  groups.forEach(g=>[...g.children].forEach((c,i)=>(c as HTMLElement).style.setProperty('--si',String(i))));
  if(reduced){groups.forEach(g=>g.classList.add('isIn'));return}
  groups.forEach(g=>g.classList.add('fseStagger'));
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{
   const t=e.target as HTMLElement;
   if(t.dataset.stagger!==undefined&&e.isIntersecting){t.classList.add('isIn')}
   if(t instanceof SVGSVGElement){e.isIntersecting?t.unpauseAnimations():t.pauseAnimations()}
  }),{threshold:.25});
  groups.forEach(g=>io.observe(g));
  el.querySelectorAll<SVGSVGElement>('svg[data-loop]').forEach(s=>{s.pauseAnimations();io.observe(s)});
  return()=>io.disconnect();
 },[root]);
}

function TopCar({className=''}:{className?:string}){
 return <g className={`fseCar ${className}`}><rect x="-11" y="-6" width="22" height="12" rx="4.5" className="fseCarBody"/><rect x="1" y="-4.6" width="6" height="9.2" rx="2" className="fseCarGlass"/><rect x="-8" y="-4.2" width="4" height="8.4" rx="1.6" className="fseCarGlass"/><path d="M10 -4.4v2M10 2.4v2" className="fseCarLamp"/></g>;
}

export default function FinSimpleCase({setLightbox}){
 const root=useRef<HTMLDivElement>(null);
 const [build,setBuild]=useState(2);
 const current=builds[build];
 useFinSimpleMotion(root);
 const expand=(src:string,alt:string)=>(e:React.MouseEvent)=>{e.stopPropagation();setLightbox({src:asset(src),alt})};
 // Route for the in-car navigation strip: 90 × 300 box, stops at y = 50, 150, 250.
 const route='M45 12C45 34 60 40 60 62S30 92 30 118S60 140 60 162S30 192 30 214S45 240 45 262S45 290 45 300';
 const plate=(i:number)=>66+i*126;
 const iso=(cy:number)=>`matrix(.866 .28 -.866 .28 260 ${cy})`;
 return <div className="fseEditorial" ref={root}>
 <LifecycleRoad stages={stages} vehicle="ev"/>
 <section className="fseReturn fseStage" id="fs-discover"><div><h2>Find an earlier estimate.<br/><em>Continue from there.</em></h2><p>Customers had already spent time building vehicle estimates. Previous Estimates gave them a way back to that work inside the FinSimple experience they already used.</p>
  {/* In-car navigation: a car follows the route through three stops. */}
  <div className="fseNav">
   <svg className="fseNavRoute" viewBox="0 0 90 300" data-loop aria-hidden="true">
    <path d={route} className="fseRoadEdge"/><path d={route} className="fseRoad"/><path d={route} className="fseRoadLine"/>
    {[62,162,262].map((y,i)=><g key={y} className={`fsePin ${i===2?'isGoal':''}`}><circle cx={i===1?60:i===0?60:45} cy={y} r="9"/></g>)}
    <g><TopCar/><animateMotion dur="7s" repeatCount="indefinite" rotate="auto" keyPoints="0;.2;.2;.53;.53;.86;.86" keyTimes="0;.14;.3;.46;.62;.78;1" calcMode="linear" path={route}/></g>
   </svg>
   <ol className="fseNavStops" data-stagger>{drive.map((d,i)=><li key={d.title}><strong>{d.title}</strong><span>{d.copy}</span></li>)}</ol>
  </div>
 </div>
  <figure className="fseBrowser"><div className="fseBrowserBar" aria-hidden="true"><i/><i/><i/><span>fordcredit.com/finsimple</span></div><button type="button" onClick={expand('project-media/finsimple-live.png','Released FinSimple Previous Estimates interface')} aria-label="Expand the released FinSimple Previous Estimates interface"><img src={asset('project-media/finsimple-live.png')} alt="Released FinSimple Previous Estimates interface" loading="lazy"/><span>View full size ↗</span></button></figure>
 </section>

 <section className="fsePlatform fseStage" id="fs-define"><header><h2>One simple action.<br/><em>Four connected layers.</em></h2><p>I turned customer and business requirements into a feature that fit the platform’s shared AEM components, Salesforce data contracts, and release environments.</p></header>
  {/* Exploded view of the platform: a saved estimate drops through each layer to the system of record. */}
  <div className="fseExploded">
   <svg viewBox="0 0 520 520" data-loop role="img" aria-label="A saved estimate travels from the web experience through the AEM component and API layer to Salesforce">
    <defs>
     <linearGradient id="fsePlateTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f7fbff"/><stop offset="1" stopColor="#dce9f5"/></linearGradient>
     <linearGradient id="fseBeamGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fd4ff" stopOpacity="0"/><stop offset=".5" stopColor="#2f8fe0"/><stop offset="1" stopColor="#9fd4ff" stopOpacity="0"/></linearGradient>
    </defs>
    {[3,2,1,0].map(i=>{const cy=plate(i);return <g key={i} className={`fsePlate fsePlate${i}`}>
     <path d={`M${260-180} ${cy}L260 ${cy+58}L${260+180} ${cy}V${cy+12}L260 ${cy+70}L${260-180} ${cy+12}z`} className="fsePlateSide"/>
     <path d={`M260 ${cy-58}L${260+180} ${cy}L260 ${cy+58}L${260-180} ${cy}z`} className="fsePlateTop"/>
     <g transform={iso(cy)}>
      {i===0&&<><rect x="-80" y="-66" width="160" height="132" rx="8" className="fseUiWin"/><rect x="-80" y="-66" width="160" height="16" rx="8" className="fseUiBar"/>{[-36,-12,12,36].map((y,k)=><rect key={y} x="-66" y={y} width="132" height="16" rx="4" className={k===1?'fseUiRowHot':'fseUiRow'}/>)}</>}
      {i===1&&<>{[[-86,-70],[-6,-70],[-86,6],[-6,6]].map(([x,y],k)=><rect key={k} x={x} y={y} width="72" height="62" rx="8" className={k===1?'fseTileHot':'fseTile'}/>)}</>}
      {i===2&&<>{[-50,0,50].map(y=><g key={y}><path d={`M-90 ${y}H90`} className="fsePipe"/><path d={`M-90 ${y}H90`} className="fsePipeFlow"/><circle cx="-90" cy={y} r="7" className="fseNode"/><circle cx="90" cy={y} r="7" className="fseNode"/></g>)}</>}
      {i===3&&<><path d="M-40 -8a26 26 0 0 1 48-18a22 22 0 0 1 40 12a20 20 0 0 1-4 40h-78a22 22 0 0 1-6-34z" className="fseCloud"/>{[-60,60].map(x=><rect key={x} x={x-22} y="44" width="44" height="30" rx="4" className="fseRecord"/>)}</>}
     </g>
    </g>})}
    <path d={`M260 ${plate(0)}V${plate(3)}`} className="fseBeam"/>
    <g className="fseChip"><path d="M0 -12L20 -4L0 4L-20 -4z" className="fseChipTop"/><path d="M-20 -4V2L0 10L20 2V-4L0 4z" className="fseChipSide"/>
     <animateTransform attributeName="transform" type="translate" dur="6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.12;.3;.42;.6;.72;.9;1" keySplines=".5 0 .5 1;0 0 1 1;.5 0 .5 1;0 0 1 1;.5 0 .5 1;0 0 1 1;.5 0 .5 1" values={`260 ${plate(0)-40};260 ${plate(0)};260 ${plate(0)};260 ${plate(1)};260 ${plate(1)};260 ${plate(2)};260 ${plate(2)};260 ${plate(3)}`}/>
    </g>
   </svg>
   <ol className="fseCallouts" data-stagger>{layers.map((l,i)=><li key={l.name} style={{'--top':`${(plate(i)/520)*100}%`} as React.CSSProperties}><strong>{l.name}</strong><span>{l.detail}</span></li>)}</ol>
  </div>
 </section>

 <section className="fseBuild fseStage" id="fs-build"><header><h2>Built into<br/><em>the real thing.</em></h2><p>As the sole intern embedded on FinSimple, I took the feature from synthetic data to a customer release.</p></header>
  <div className="fseEvolution">
   {/* The three artifacts fan out like a deck; the selected stage comes to the front. */}
   <div className="fseDeck">{builds.map((item,i)=>{const depth=(i-build+3)%3;return <button type="button" key={item.stage} className={`fseDeckCard depth${depth}`} onClick={e=>{e.stopPropagation();if(depth===0){setLightbox({src:asset(item.src),alt:item.alt})}else setBuild(i)}} aria-label={depth===0?`Expand ${item.alt}`:`Show ${item.stage}`}><img src={asset(item.src)} alt={item.alt} loading="lazy"/></button>})}</div>
   <div className="fseEvolutionNotes">
    <ol className="fseStageList" data-stagger>{builds.map((item,i)=><li key={item.stage}><button type="button" aria-pressed={build===i} onClick={()=>setBuild(i)}><i aria-hidden="true"/>{item.stage}</button></li>)}</ol>
    <div aria-live="polite"><h3>{current.title}</h3><p>{current.copy}</p></div>
   </div>
  </div>
 </section>

 <section className="fseTest fseStage" id="fs-test"><header><h2>Proven in every<br/><em>environment.</em></h2><p>I validated the APIs in Postman and carried the feature through development, QA, and production checks.</p></header>
  <ol className="fsePipeline" data-stagger>{envs.map((env,i)=><li key={env.name}>
   <span className="fseGate" aria-hidden="true"><i/><i/><i/></span>
   <strong>{env.name}</strong>
   <ul>{env.checks.map(c=><li key={c}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>{c}</li>)}</ul>
  </li>)}</ol>
 </section>

 <section className="fseDelivery fseStage" id="fs-launch"><div><h2>The handoffs were<br/><em>part of the product.</em></h2><p>I coordinated the teams behind the release.</p></div>
  {/* Five workstreams merge like on-ramps into one release freeway. */}
  <figure className="fseFreeway">
   <svg viewBox="0 0 600 330" data-loop role="img" aria-label="Five workstreams with 50 people merge into one production release, shipped 10 percent ahead of schedule">
    {lanes.map((lane,i)=>{const y=40+i*52;const d=`M150 ${y}H270C350 ${y} 360 200 440 200H600`;return <g key={lane}>
     <path d={d} className="fseLaneEdge"/><path d={d} className="fseLane"/>
     <text x="138" y={y+5} textAnchor="end" className="fseLaneLabel">{lane}</text>
     {[0,1].map(k=><g key={k}><TopCar className={`tone${(i+k)%3}`}/><animateMotion dur="5s" begin={`${-(i*.9+k*2.5)}s`} repeatCount="indefinite" rotate="auto" path={d}/></g>)}
    </g>})}
    <path d="M440 200H600" className="fseFreewayLine"/>
    <g className="fseSign"><path d="M478 200V120M578 200V120" className="fseSignPost"/>
     <rect x="452" y="52" width="148" height="74" rx="8" className="fseSignFace"/><rect x="457" y="57" width="138" height="64" rx="5" className="fseSignInset"/>
     <text x="526" y="80" className="fseSignTitle">Production release</text>
     <text x="526" y="102" className="fseSignBig">10% early</text>
     <path d="M512 112h28" className="fseSignArrow"/><path d="M534 108l6 4-6 4" className="fseSignArrow"/>
    </g>
   </svg>
   <p className="fseFreewayNote"><b>5</b> workstreams<b>50</b> people<b>10%</b> ahead of schedule</p>
  </figure>
 </section>
 <section className="fseOperate fseStage" id="fs-operate">
  <header><h2>Shipping was the start.<br/><em>Running it was the job.</em></h2><p>After launch I monitored live incidents with the Payment, DevOps, and QA teams, looked for patterns in what broke, and turned repeat problems into reusable fixes.</p></header>
  <div className="fseOps" data-stagger>
   <div className="fseOpsStat"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M4 30l8-9 7 5 9-13 8 6"/><circle cx="28" cy="13" r="2.5"/></svg><strong>20+</strong><span>customer-impacting incidents analyzed for failure patterns</span></div>
   <div className="fseOpsStat"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 5h17l6 6v24H9z"/><path d="M26 5v6h6M14 18h13M14 24h13M14 30h8"/></svg><strong>4</strong><span>recovery playbooks written from those patterns</span></div>
   <div className="fseOpsStat"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="21" r="14"/><path d="M20 12v9l6 4M16 3h8"/></svg><strong>40%</strong><span>faster release cycle</span></div>
  </div>
  <div className="fseRamp" aria-label="Intern onboarding ramp-up went from about two weeks to three days">
   <p>I also built an onboarding hub from 15 technical resources across 3 teams.</p>
   <div className="fseRampRow"><span>Before</span><i style={{'--w':'100%'} as React.CSSProperties}><b>~2 weeks to ramp up</b></i></div>
   <div className="fseRampRow isAfter"><span>After</span><i style={{'--w':'21%'} as React.CSSProperties}><b>3 days</b></i></div>
  </div>
  
 </section>
 </div>
}
