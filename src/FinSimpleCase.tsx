import React, { useEffect, useRef, useState } from 'react';
import './finsimple.css';
import LifecycleRoad from './LifecycleRoad';
import { DecisionMoment, Supporting, Tradeoff } from './CaseDecision';
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
// What each workstream had to hand over before the release could move. The
// point of this section is the dependency, not the headcount.
const handoffs=[
 {lane:'Requirements',gate:'What the feature had to do',blocked:'Nothing could be built until customer and business requirements agreed on what a previous estimate meant.'},
 {lane:'AEM component',gate:'Where it lived',blocked:'The experience had to become a reusable component before it could enter the existing product.'},
 {lane:'API integration',gate:'What data it could see',blocked:'Estimate and customer context had to cross the integration boundary before the interface meant anything.'},
 {lane:'QA & validation',gate:'Whether it was allowed through',blocked:'Security-scan findings and PR compliance had to clear before the release train would take it.'},
 {lane:'Production release',gate:'When customers got it',blocked:'The release window belonged to the platform, not to the feature.',mine:'This is the one I chased. The component was ready before the release was. Which environments had to be tagged, and in what order, lived with the release and DevOps side rather than with the feature \u2014 so I traced the sequence myself to get Previous Estimates onto the train, and wrote the release and environment-tagging workflow down.'}
];
const stages=[
 {id:'fs-discover',name:'Discover',did:'Customers lose their saved work'},
 {id:'fs-define',name:'Define',did:'Fit a live platform'},
 {id:'fs-build',name:'Build',did:'Prototype, component, release'},
 {id:'fs-launch',name:'Launch',did:'The handoff nobody owned'},
 {id:'fs-operate',name:'Operate',did:'Incidents, playbooks, learnings'}
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


/* Fifteen scattered pages across three teams collapse into one hub with a
   table of contents. Drawn generically on purpose: the resources lived in a
   wiki, not in a product worth putting a logo on. */
function OnboardingHub(){
 const groups=[
  {team:'Platform',y:18,tint:'#cfe2f2'},
  {team:'QA',y:96,tint:'#d8e6d5'},
  {team:'DevOps',y:174,tint:'#e8ddd0'}
 ];
 const toc=['Environments','Access + credentials','Release steps','Who owns what','Common failures'];
 return <div className="fseHub">
  <svg viewBox="0 0 640 250" role="img" aria-label="Fifteen scattered documents across the Platform, QA and DevOps teams funnel into a single onboarding hub page with a table of contents covering environments, access, release steps, ownership and common failures">
   <defs>
    <linearGradient id="fseHubPage" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#eef4fa"/></linearGradient>
   </defs>

   {/* scattered pages, three teams */}
   {groups.map((g,gi)=><g key={g.team} className="fseHubGroup">
    <text x="0" y={g.y - 6} className="fseHubTeamLabel">{g.team}</text>
    {Array.from({length:5},(_,i)=>{
     const x=2+i*32, rot=(((gi*5+i)%5)-2)*4.5;
     return <g key={i} className="fseHubPage" style={{'--d':gi*5+i} as React.CSSProperties} transform={`translate(${x} ${g.y}) rotate(${rot} 13 17)`}>
      <rect width="26" height="34" rx="3" fill={g.tint} stroke="rgba(11,48,82,.22)"/>
      <path d="M6 9h14M6 15h14M6 21h9" stroke="rgba(11,48,82,.3)" strokeWidth="1.6" strokeLinecap="round"/>
     </g>;
    })}
   </g>)}

   {/* funnel */}
   <g className="fseHubArrow">
    {groups.map((g,i)=><path key={i} d={`M176 ${g.y+17}C232 ${g.y+17} 236 125 292 125`} style={{'--l':i} as React.CSSProperties}/>)}
    <path d="M286 118l8 7-8 7" className="fseHubTip"/>
   </g>

   {/* the hub */}
   <g className="fseHubDoc" transform="translate(300 26)">
    <rect width="328" height="198" rx="10" fill="url(#fseHubPage)" stroke="rgba(11,48,82,.22)"/>
    <path d="M0 34h328" stroke="rgba(11,48,82,.16)"/>
    <circle cx="16" cy="17" r="3.4" fill="#c3d4e3"/><circle cx="27" cy="17" r="3.4" fill="#c3d4e3"/><circle cx="38" cy="17" r="3.4" fill="#c3d4e3"/>
    <text x="56" y="21" className="fseHubDocTitle">Start here</text>
    <path d="M134 34v164" stroke="rgba(11,48,82,.16)"/>
    {toc.map((item,i)=><g key={item}>
     <rect x="12" y={50+i*28} width="4" height="14" rx="2" fill={i===0?'#15609f':'#c3d4e3'}/>
     <text x="24" y={61+i*28} className={`fseHubTocItem${i===0?' isOn':''}`}>{item}</text>
    </g>)}
    <path d="M152 58h152M152 72h152M152 86h112" className="fseHubDocLine"/>
    <path d="M152 112h152M152 126h126M152 140h152M152 154h88" className="fseHubDocLine"/>
    <rect x="152" y="170" width="92" height="20" rx="10" fill="#15609f" opacity=".12"/>
    <text x="198" y="184" className="fseHubDocTag">3 days in</text>
   </g>
  </svg>
  <div className="fseHubFacts">
   <span><b>15</b> resources gathered</span>
   <span><b>3</b> teams they lived in</span>
   <span><b><s>~2 weeks</s> 3 days</b> to ramp up</span>
  </div>
 </div>;
}

/* Prototype -> AEM component -> customer release, as a fanned deck. Shared by the
   Build chapter and the Skim view, so both show the same three real artifacts. */
export function FinSimpleBuildDeck({setLightbox}:{setLightbox:(img:{src:string,alt:string})=>void}){
 const [build,setBuild]=useState(2);
 const current=builds[build];
 return <>
  <div className="fseEvolution">
   {/* The three artifacts fan out like a deck; the selected stage comes to the front. */}
   <div className="fseDeck">{builds.map((item,i)=>{const depth=(i-build+3)%3;return <button type="button" key={item.stage} className={`fseDeckCard depth${depth}`} onClick={e=>{e.stopPropagation();if(depth===0){setLightbox({src:asset(item.src),alt:item.alt})}else setBuild(i)}} aria-label={depth===0?`Expand ${item.alt}`:`Show ${item.stage}`}><img src={asset(item.src)} alt={item.alt} loading="lazy"/></button>})}</div>
   <div className="fseEvolutionNotes">
    <ol className="fseStageList" data-stagger>{builds.map((item,i)=><li key={item.stage}><button type="button" aria-pressed={build===i} onClick={()=>setBuild(i)}><i aria-hidden="true"/>{item.stage}</button></li>)}</ol>
    <div aria-live="polite"><h3>{current.title}</h3><p>{current.copy}</p></div>
   </div>
  </div>
 </>;
}

export default function FinSimpleCase({setLightbox}){
 const root=useRef<HTMLDivElement>(null);
 useFinSimpleMotion(root);
 const expand=(src:string,alt:string)=>(e:React.MouseEvent)=>{e.stopPropagation();setLightbox({src:asset(src),alt})};
 // Route for the in-car navigation strip: 90 × 300 box, stops at y = 50, 150, 250.
 const route='M45 12C45 34 60 40 60 62S30 92 30 118S60 140 60 162S30 192 30 214S45 240 45 262S45 290 45 300';
 const plate=(i:number)=>66+i*126;
 const iso=(cy:number)=>`matrix(.866 .28 -.866 .28 260 ${cy})`;
 return <div className="fseEditorial" ref={root}>
 <LifecycleRoad stages={stages} vehicle="mache"/>
 <section className="fseReturn fseStage" id="fs-discover"><h2 className="csTitle">Find an earlier estimate. <em>Continue from there.</em></h2><div><p>Customers had already spent time building vehicle estimates. Previous Estimates gave them a way back to that work inside the FinSimple experience they already used.</p>
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

 <section className="fsePlatform fseStage" id="fs-define">
  <DecisionMoment
   statement={<>It had to live inside<br/>a running platform.</>}
   sub="FinSimple was already deployed, with existing customers and a workflow they knew, so Previous Estimates had to fit the platform’s shared AEM components, Salesforce data contracts, and release environments."
   because={<p>A cleaner standalone Previous Estimates screen would have been faster to design and impossible to put in front of anyone, because the estimate history only means anything inside the financing journey it belongs to. Everything below is what working inside a live product actually cost.</p>}
   tradeoff={<Tradeoff pairs={[
    ['A clean screen I could design from scratch','Shared AEM components I had to work inside'],
    ['My own data shape','Salesforce contracts the record already had to match'],
    ['Shipping on my own schedule','A release train that made five teams a dependency']
   ]}/>}
   result={<p>One customer action travels through the web experience, the AEM component, the API layer, and into Salesforce as a durable record, inside the product customers already used, shipped with 6% fewer Salesforce write failures per submitted estimate.</p>}
  >
   <p className="cdEvidenceLabel">One simple action, four connected layers</p>
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
  </DecisionMoment>
 </section>

 <section className="fseBuild fseStage" id="fs-build"><h2 className="csTitle">Built into <em>the real thing.</em></h2><header><p>As the sole intern embedded on FinSimple, I took the feature from synthetic data to a customer release.</p></header>
  <FinSimpleBuildDeck setLightbox={setLightbox}/>
 </section>


 <section className="fseDelivery fseStage" id="fs-launch"><h2 className="csTitle">The handoffs were <em>part of the product.</em></h2><div><p>Five workstreams each held something the feature could not ship without. Coordinating them was the work, not overhead around it.</p>
 </div>
  {/* Five workstreams merge like on-ramps into one release freeway. */}
  <figure className="fseFreeway">
   <svg viewBox="0 0 600 330" data-loop role="img" aria-label="Five workstreams merge into one production release, with each story taking 15 percent less calendar time">
    {lanes.map((lane,i)=>{const y=40+i*52;const d=`M150 ${y}H270C350 ${y} 360 200 440 200H600`;return <g key={lane}>
     <path d={d} className="fseLaneEdge"/><path d={d} className="fseLane"/>
     <text x="138" y={y+5} textAnchor="end" className="fseLaneLabel">{lane}</text>
     {[0,1].map(k=><g key={k}><TopCar className={`tone${(i+k)%3}`}/><animateMotion dur="5s" begin={`${-(i*.9+k*2.5)}s`} repeatCount="indefinite" rotate="auto" path={d}/></g>)}
    </g>})}
    <path d="M440 200H600" className="fseFreewayLine"/>
    <g className="fseSign"><path d="M478 200V120M578 200V120" className="fseSignPost"/>
     <rect x="452" y="52" width="148" height="74" rx="8" className="fseSignFace"/><rect x="457" y="57" width="138" height="64" rx="5" className="fseSignInset"/>
     <text x="526" y="80" className="fseSignTitle">Production release</text>
     <text x="526" y="102" className="fseSignBig">15% faster</text>
     <path d="M512 112h28" className="fseSignArrow"/><path d="M534 108l6 4-6 4" className="fseSignArrow"/>
    </g>
   </svg>
   <p className="fseFreewayNote"><b>5</b> workstreams<b>15%</b> less calendar time per story</p>
  </figure>
  <DecisionMoment
   statement={<>Nobody owned the<br/>release sequence.</>}
   sub="The component was ready before the release was, and the order environments had to be tagged in lived with release and DevOps rather than with the feature."
   because={<p>I could have waited for someone on the release side to pick it up, which is what an intern is expected to do. Instead I traced the sequence myself, got Previous Estimates onto the train, and wrote the release and environment-tagging workflow down so the next person would not have to trace it again.</p>}
   tradeoff={<Tradeoff pairs={[
    ['Staying inside my feature’s scope','Learning a release process that was not mine'],
    ['Waiting for the owning team','Time I spent chasing it down instead of building']
   ]}/>}
   result={<p>Previous Estimates made its release window, and the workflow I documented outlived my internship.</p>}
  />
 </section>
 <section className="fseOperate fseStage" id="fs-operate"><h2 className="csTitle">Shipping was the start. <em>Running it was the job.</em></h2>
  <header><p>After launch I monitored live incidents with the Payment, DevOps, and QA teams, looked for patterns in what broke, and turned repeat problems into reusable fixes.</p></header>
  {/* Three numbers, stated as the chain they actually were: what broke, what I
      wrote because of it, what changed as a result. */}
  <ol className="fseOps" data-stagger>
   <li className="fseOpsStat"><b>What broke</b><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M4 30l8-9 7 5 9-13 8 6"/><circle cx="28" cy="13" r="2.5"/></svg><strong>25</strong><span>customer-impacting issues investigated with Splunk and ServiceNow</span></li>
   <li className="fseOpsStat"><b>What I wrote</b><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 5h17l6 6v24H9z"/><path d="M26 5v6h6M14 18h13M14 24h13M14 30h8"/></svg><strong>4</strong><span>recovery playbooks written from those patterns</span></li>
   <li className="fseOpsStat"><b>What changed</b><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="21" r="14"/><path d="M20 12v9l6 4M16 3h8"/></svg><strong>50%</strong><span>faster restoration with standardized troubleshooting</span></li>
  </ol>
  <Supporting title="Also while I was there" note="Onboarding was nobody’s deliverable, so the same two weeks got spent again with every new engineer.">
   <OnboardingHub/>
  </Supporting>
 </section>
 </div>
}
